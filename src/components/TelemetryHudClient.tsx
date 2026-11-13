'use client';

import {
  Activity,
  Cpu,
  Eye,
  Network,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { collectWebGLSignals } from '@fingerprint/frontend-sdk/collectors/webgl';
import { collectWebGpuSignals } from '@fingerprint/frontend-sdk/collectors/webgpu';
import {
  runCanvasForensicTraps,
  emptyCanvasIntegrity,
} from '@fingerprint/frontend-sdk/collectors/canvasTrap';
import {
  detectActiveCDPSession,
  emptyCdpIntegrity,
} from '@fingerprint/frontend-sdk/collectors/cdpTrap';
import {
  collectHostOsSignals,
  emptyHostOsSignals,
  type HostOsSignals,
} from '@fingerprint/frontend-sdk/collectors/hostOs';

type SimulationMode = 'genuine' | 'antidetect_proxy' | 'playwright_cdp';

interface ProbeResult {
  gpu: string;
  clearMs: number;
  shaderMs: number;
  cores: number;
  screen: string;
  platform: string;
  subgroup: string;
  computeMs: number;
  webgpuAvailable: boolean;
  farbling: boolean;
  bridge: boolean;
  canvasVerdict: string;
  cdpSerializer: boolean;
  cdpPreload: boolean;
  cdpVerdict: string;
  tts: string;
  voiceFamilies: string[];
  p3: boolean;
  hdr: boolean;
  osClaimsWindows: boolean;
  osClaimsApple: boolean;
  edgeOnline: boolean;
  deviceId: string;
  browserId: string;
}

interface HudTelemetry {
  deviceId: string;
  browserId: string;
  riskScore: number;
  confidence: number;
  confidenceLabel: string;
  rttDelta: string;
  tcpMss: string;
  gpu: string;
  subgroup: string;
  canvas: string;
  cdp: string;
  tts: string;
  kinematics: string;
  anomalies: string[];
}

const INITIAL_PROBE: ProbeResult = {
  gpu: 'Probing WebGL2 / WebGPU…',
  clearMs: 0,
  shaderMs: 0,
  cores: 8,
  screen: '—',
  platform: '—',
  subgroup: 'WebGPU probing…',
  computeMs: 0,
  webgpuAvailable: false,
  farbling: false,
  bridge: false,
  canvasVerdict: 'Canvas traps queued',
  cdpSerializer: false,
  cdpPreload: false,
  cdpVerdict: 'CDP probes queued',
  tts: 'Voice inventory queued',
  voiceFamilies: [],
  p3: false,
  hdr: false,
  osClaimsWindows: false,
  osClaimsApple: false,
  edgeOnline: false,
  deviceId: 'dev_local_probe_pending',
  browserId: 'brw_local_probe_pending',
};

let probePromise: Promise<ProbeResult> | null = null;

function runProbesOnce(): Promise<ProbeResult> {
  probePromise ??= collectProbeResult();
  return probePromise;
}

async function collectProbeResult(): Promise<ProbeResult> {
  const [webgl, webgpu, hostOs, edgeOnline] = await Promise.all([
    safeAsync(collectWebGLSignals, null),
    safeAsync(collectWebGpuSignals, null),
    safeAsync(collectHostOsSignals, emptyHostOsSignals() as HostOsSignals),
    checkEdgeReachable(),
  ]);
  const canvas = safeSync(runCanvasForensicTraps, emptyCanvasIntegrity());
  const cdp = safeSync(detectActiveCDPSession, emptyCdpIntegrity());

  const gpu = webgl?.renderer || 'Hardware WebGL2 pipeline';
  const cores =
    typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
  const screen =
    typeof window !== 'undefined'
      ? `${window.screen.width}×${window.screen.height} @${window.devicePixelRatio}x`
      : '—';
  const platform =
    typeof navigator !== 'undefined' ? navigator.platform || 'native' : '—';
  const userAgent =
    typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const computeLabel =
    (webgpu?.computeAtomicTimeMs ?? 0) <= 0
      ? 'n/a'
      : (webgpu?.computeAtomicTimeMs ?? 0) >= 1_490
        ? 'timeout'
        : `${(webgpu?.computeAtomicTimeMs ?? 0).toFixed(2)} ms`;
  const subgroup = webgpu?.supported
    ? `${webgpu.vendor || 'adapter'}${
        webgpu.architecture ? ` · ${webgpu.architecture}` : ''
      }${webgpu.subgroupMaxSize ? ` · ${webgpu.subgroupMaxSize}w` : ''} · ${computeLabel}`
    : 'WebGL2 fallback · no WebGPU adapter';

  const voiceFamilies = hostOs.speechSynthesis.voiceFamilies;
  const tts = hostOs.speechSynthesis.available
    ? hostOs.speechSynthesis.voiceCount > 0
      ? `${hostOs.speechSynthesis.voiceCount} voices · ${
          voiceFamilies.join(', ') || 'unclassified'
        }`
      : '0 voices · minimal OS speech stack'
    : 'Speech synthesis unavailable';

  const canvasVerdict = canvas.farblingDetected
    ? 'FARBLING · integer fill mutated'
    : canvas.webglBridgeMismatch
      ? 'BRIDGE MISMATCH · 2D ≠ WebGL'
      : 'Clean · fill + WebGL bridge match';

  const cdpVerdict =
    cdp.cdpSerializerTriggered || cdp.injectedPreloadDetected
      ? cdp.injectedPreloadDetected
        ? 'PRELOAD RESIDUE · anonymous :1 frame'
        : 'SERIALIZER FIRED · inspector attached'
      : 'Clean · no inspector serializer';

  const entropy = [
    gpu,
    webgl?.vendor ?? '',
    webgl?.extensionsHash ?? '',
    String(webgl?.maxTextureSize ?? 0),
    String(cores),
    screen,
    platform,
    canvas.canvasGeometryHash,
  ].join('|');
  const browserEntropy = [
    browserFamily(userAgent),
    platform,
    gpu,
    webgl?.extensionsHash ?? '',
    canvas.canvasGeometryHash,
  ].join('|');

  const [deviceHash, browserHash] = await Promise.all([
    hashHex(entropy),
    hashHex(browserEntropy),
  ]);

  return {
    gpu,
    clearMs: Number((webgl?.gpuClearTimeMs ?? 0).toFixed(2)),
    shaderMs: Number((webgl?.shaderCompileTimeMs ?? 0).toFixed(2)),
    cores,
    screen,
    platform,
    subgroup,
    computeMs: webgpu?.computeAtomicTimeMs ?? 0,
    webgpuAvailable: Boolean(webgpu?.supported),
    farbling: canvas.farblingDetected,
    bridge: canvas.webglBridgeMismatch,
    canvasVerdict,
    cdpSerializer: cdp.cdpSerializerTriggered,
    cdpPreload: cdp.injectedPreloadDetected,
    cdpVerdict,
    tts,
    voiceFamilies,
    p3: hostOs.p3Gamut,
    hdr: hostOs.hdrSupported,
    osClaimsWindows: /windows/i.test(userAgent),
    osClaimsApple: /macintosh|iphone|ipad/i.test(userAgent),
    edgeOnline,
    deviceId: `dev_${deviceHash.slice(0, 8)}-${deviceHash.slice(8, 12)}-${deviceHash.slice(
      12,
      16,
    )}-${deviceHash.slice(16, 20)}`,
    browserId: `brw_${browserHash.slice(0, 20)}`,
  };
}

async function checkEdgeReachable(): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2_500);
  try {
    const response = await fetch('/api/v1/challenge', {
      cache: 'no-store',
      signal: controller.signal,
      headers: { accept: 'application/json' },
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { nonce?: unknown };
    return typeof data.nonce === 'string';
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function browserFamily(userAgent: string): string {
  for (const token of ['Edg/', 'OPR/', 'Chrome/', 'Firefox/', 'Version/']) {
    const index = userAgent.indexOf(token);
    if (index >= 0) {
      return token.replace('/', '') + userAgent.slice(index + token.length).split('.')[0];
    }
  }
  return 'unknown';
}

async function hashHex(value: string): Promise<string> {
  try {
    const digest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(value),
    );
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0').repeat(8);
  }
}

async function safeAsync<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch {
    return fallback;
  }
}

function safeSync<T>(run: () => T, fallback: T): T {
  try {
    return run();
  } catch {
    return fallback;
  }
}

export default function TelemetryHudClient() {
  const [simMode, setSimMode] = useState<SimulationMode>('genuine');
  const [probe, setProbe] = useState<ProbeResult>(INITIAL_PROBE);
  const [velocityHistory, setVelocityHistory] = useState<number[]>(() =>
    Array<number>(28).fill(0.45),
  );
  const [pointerVelocity, setPointerVelocity] = useState(0.45);
  const [jerk, setJerk] = useState(0.19);
  const [straightness, setStraightness] = useState(0.68);
  const lastPointerRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastVelocityRef = useRef(0.45);
  const pathRef = useRef<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    let cancelled = false;
    void runProbesOnce().then((result) => {
      if (!cancelled) setProbe(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (simMode !== 'genuine') return;
    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      const previous = lastPointerRef.current;
      pathRef.current.push({ x: event.clientX, y: event.clientY });
      if (pathRef.current.length > 24) pathRef.current.shift();

      if (!previous) {
        lastPointerRef.current = { x: event.clientX, y: event.clientY, t: now };
        return;
      }
      const dt = now - previous.t;
      if (dt < 24) return;

      const distance = Math.hypot(
        event.clientX - previous.x,
        event.clientY - previous.y,
      );
      const velocity = Math.min(4.5, distance / dt);
      lastPointerRef.current = { x: event.clientX, y: event.clientY, t: now };

      setPointerVelocity(Number(velocity.toFixed(2)));
      setVelocityHistory((history) => [
        ...history.slice(1),
        Number(velocity.toFixed(2)),
      ]);
      setJerk(
        Number(
          (
            (Math.abs(velocity - lastVelocityRef.current) / Math.max(dt, 1)) *
            1_000
          ).toFixed(2),
        ),
      );
      lastVelocityRef.current = velocity;

      const path = pathRef.current;
      if (path.length >= 4) {
        let travelled = 0;
        for (let index = 1; index < path.length; index += 1) {
          travelled += Math.hypot(
            path[index].x - path[index - 1].x,
            path[index].y - path[index - 1].y,
          );
        }
        const net = Math.hypot(
          path[path.length - 1].x - path[0].x,
          path[path.length - 1].y - path[0].y,
        );
        setStraightness(
          travelled > 8 ? Number(Math.min(1, net / travelled).toFixed(2)) : 0,
        );
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [simMode]);

  const genuineAnomalies = useMemo(() => {
    const flags: string[] = [];
    if (probe.farbling) flags.push('CANVAS_NOISE_FARBLING_DETECTED');
    if (probe.bridge) flags.push('CANVAS_WEBGL_TEXTURE_BRIDGE_MISMATCH');
    if (probe.cdpSerializer || probe.cdpPreload) {
      flags.push('CDP_RUNTIME_VALUE_MIRROR_SERIALIZER_ACTIVE');
    }
    if (
      probe.webgpuAvailable &&
      probe.computeMs > 120 &&
      // A 1.5s timeout means the probe could not complete, which is a
      // capability gap (headless, blocked adapter), not proof of spoofing.
      probe.computeMs < 1_490 &&
      /rtx|gtx|radeon|apple m/i.test(probe.gpu)
    ) {
      flags.push('WEBGPU_COMPUTE_ATOMIC_SOFTWARE_EMULATION');
    }
    const appleVoice = probe.voiceFamilies.includes('apple');
    const microsoftVoice = probe.voiceFamilies.includes('microsoft');
    if (
      (probe.osClaimsWindows && appleVoice) ||
      (probe.osClaimsApple && microsoftVoice)
    ) {
      flags.push('OS_SPEECH_SYNTHESIS_VOICE_CONTRADICTION');
    }
    return flags;
  }, [probe]);

  const telemetry: HudTelemetry = useMemo(() => {
    if (simMode === 'antidetect_proxy') {
      return {
        deviceId: 'dev_9f81c204-77a1-4b9e-8c1a-09d44e12b88a',
        browserId: 'brw_e3b0c44298fc1c149afbf4c8996fb924',
        riskScore: 98,
        confidence: 99.6,
        confidenceLabel: 'MATCH',
        rttDelta: '+148 ms split · TCP 14 / TLS 162',
        tcpMss: '1380 B · WireGuard overhead',
        gpu: 'Spoofed Apple M3 Max · SwiftShader raster',
        subgroup: 'Lavapipe CPU · 312 ms atomic',
        canvas: 'POISONED · 2D ≠ WebGL texture',
        cdp: 'Stealth preload at <anonymous>:1',
        tts: '0 voices · minimal Linux container',
        kinematics: 'Human operator behind backconnect proxy',
        anomalies: [
          'RESIDENTIAL_PROXY_TCP_TLS_RTT_SPLIT',
          'CANVAS_WEBGL_TEXTURE_BRIDGE_MISMATCH',
          'GPU_PERFORMANCE_CONTRADICTS_CLAIMED_RENDERER',
          'OS_TCP_TTL_MISMATCH_WINDOWS_ON_UNIX_STACK',
          'APPLE_SILICON_WITHOUT_P3_GAMUT_DISPLAY',
        ],
      };
    }
    if (simMode === 'playwright_cdp') {
      return {
        deviceId: 'dev_3a12f890-11c4-4e20-9b71-55c92a001e3f',
        browserId: 'brw_09a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4',
        riskScore: 95,
        confidence: 99.9,
        confidenceLabel: 'MATCH',
        rttDelta: '+4 ms · direct datacenter',
        tcpMss: '1460 B · standard Ethernet',
        gpu: 'Google SwiftShader · headless container',
        subgroup: 'No hardware subgroup · 284 ms atomic',
        canvas: 'Clean buffer · headless default',
        cdp: 'ACTIVE · Runtime ValueMirror fired',
        tts: '0 voices · no speech dispatcher',
        kinematics: 'Collinear bot · v=2.0 · jerk 0.01',
        anomalies: [
          'CDP_RUNTIME_VALUE_MIRROR_SERIALIZER_ACTIVE',
          'BOT_CONSTANT_VELOCITY_TRAJECTORY',
          'BOT_COLLINEAR_STRAIGHT_LINE_MOUSE',
          'OS_SPEECH_SYNTHESIS_VOICE_CONTRADICTION',
          'VM_OR_SOFTWARE_GPU_RENDERER',
        ],
      };
    }

    const computeLabel =
      probe.computeMs >= 1_490
        ? 'probe timeout'
        : `${probe.computeMs.toFixed(2)} ms atomic`;

    return {
      deviceId: probe.deviceId,
      browserId: probe.browserId,
      riskScore:
        genuineAnomalies.length === 0
          ? 3
          : Math.min(100, 58 + genuineAnomalies.length * 12),
      confidence: 99.8,
      confidenceLabel: 'LOCAL',
      rttDelta: 'TCP / TLS RTT: edge-only',
      tcpMss: 'edge-only · SYN option',
      gpu: probe.gpu,
      subgroup: probe.subgroup,
      canvas: probe.canvasVerdict,
      cdp: probe.cdpVerdict,
      tts: probe.tts,
      kinematics: `Fitts's law · v=${pointerVelocity} px/ms`,
      anomalies: genuineAnomalies,
    };
  }, [simMode, probe, genuineAnomalies, pointerVelocity, jerk]);

  const isHighRisk = telemetry.riskScore >= 70;
  const displayVelocity =
    simMode === 'playwright_cdp' ? 2 : pointerVelocity;
  const displayJerk = simMode === 'playwright_cdp' ? 0.01 : jerk;
  const displayStraightness =
    simMode === 'playwright_cdp'
      ? 0.998
      : simMode === 'antidetect_proxy'
        ? 0.74
        : straightness;
  const bars =
    simMode === 'playwright_cdp'
      ? Array<number>(28).fill(2)
      : velocityHistory;
  const barColor =
    simMode === 'playwright_cdp'
      ? 'bg-rose-500/70'
      : simMode === 'antidetect_proxy'
        ? 'bg-amber-500/70'
        : 'bg-emerald-400/70';

  return (
    <div
      id="forensic-hud"
      className={`relative min-w-0 overflow-hidden rounded-xl border bg-surface-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-colors duration-300 ${
        isHighRisk
          ? 'border-rose-500/45 shadow-danger-glow'
          : 'border-emerald-500/40'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-px w-full animate-scan bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
      </div>

      {/* Header & attack preset switcher */}
      <div className="relative space-y-3 border-b border-white/[0.07] bg-surface-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={`status-dot shrink-0 animate-pulse-dot ${
                isHighRisk ? 'bg-rose-500' : 'bg-emerald-400'
              }`}
              aria-hidden="true"
            />
            <span className="truncate font-mono text-xs uppercase tracking-[0.08em] text-ink-secondary">
              8-layer forensic HUD
            </span>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium ${
              isHighRisk
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            <span className="sm:hidden">
              {isHighRisk ? 'FLAGGED' : 'VERIFIED'}
            </span>
            <span className="hidden sm:inline">
              {isHighRisk ? 'SPOOF / BOT FLAGGED' : 'VERIFIED PHYSICAL HOST'}
            </span>
          </span>
        </div>

        <div
          className="grid grid-cols-3 gap-1.5 rounded-lg border border-white/[0.06] bg-canvas p-1 font-mono text-[11px]"
          role="group"
          aria-label="Telemetry simulation mode"
        >
          <ModeButton
            active={simMode === 'genuine'}
            tone="emerald"
            fullLabel="1. Your browser"
            onClick={() => setSimMode('genuine')}
          >
            <span className="sm:hidden">Live</span>
            <span className="hidden sm:inline">1. Your browser</span>
          </ModeButton>
          <ModeButton
            active={simMode === 'antidetect_proxy'}
            tone="rose"
            fullLabel="2. Dolphin Anty plus residential proxy"
            onClick={() => setSimMode('antidetect_proxy')}
          >
            <span className="sm:hidden">Dolphin</span>
            <span className="hidden sm:inline">2. Dolphin + proxy</span>
          </ModeButton>
          <ModeButton
            active={simMode === 'playwright_cdp'}
            tone="rose"
            fullLabel="3. Headless Playwright bot"
            onClick={() => setSimMode('playwright_cdp')}
          >
            <span className="sm:hidden">Bot</span>
            <span className="hidden sm:inline">3. Playwright bot</span>
          </ModeButton>
        </div>
      </div>

      {/* Telemetry body */}
      <div
        className="relative space-y-3 p-4 font-mono text-xs sm:p-5"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1 rounded-lg border border-white/[0.06] bg-canvas p-3 sm:col-span-2">
            <div className="flex items-center justify-between gap-2 text-[11px] text-ink-muted">
              <span className="truncate">CROSS-BROWSER DEVICE ID</span>
              <span className="shrink-0 text-emerald-400">
                {telemetry.confidence}% {telemetry.confidenceLabel}
              </span>
            </div>
            <div className="truncate font-semibold text-ink-primary">
              {telemetry.deviceId}
            </div>
            <div className="truncate text-[11px] text-ink-muted">
              BrowserID: {telemetry.browserId}
            </div>
          </div>

          <div
            className={`flex flex-col justify-between rounded-lg border p-3 ${
              isHighRisk
                ? 'border-rose-500/40 bg-rose-950/20'
                : 'border-emerald-500/30 bg-emerald-950/20'
            }`}
            aria-live="polite"
          >
            <span className="text-[11px] text-ink-muted">COMPOSITE RISK</span>
            <div
              className={`text-3xl font-bold ${
                isHighRisk ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {telemetry.riskScore}
              <span className="text-xs font-normal text-ink-muted"> / 100</span>
            </div>
            <span className="text-[10px] text-ink-muted">
              Threshold: ≥70 block
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <HudCard icon={<Network className="h-3.5 w-3.5" />} label="L3 · WIRE JA4 / TCP">
            <div className="truncate text-ink-code" title={telemetry.rttDelta}>
              {telemetry.rttDelta}
            </div>
            <div className="truncate text-[11px] text-ink-secondary">
              MSS: {telemetry.tcpMss}
            </div>
            <div
              className={`truncate text-[10px] ${
                probe.edgeOnline ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {probe.edgeOnline
                ? 'Edge online · server-signed verdict'
                : 'Edge offline · local probe only'}
            </div>
          </HudCard>

          <HudCard
            icon={<Cpu className="h-3.5 w-3.5" />}
            label="L1 · SILICON & SHADER"
          >
            <div className="truncate text-ink-code" title={telemetry.gpu}>
              {telemetry.gpu}
            </div>
            <div className="truncate text-[11px] text-ink-secondary">
              {telemetry.subgroup}
            </div>
            <div className="flex justify-between text-[10px] text-ink-muted">
              <span>
                Clear:{' '}
                {simMode === 'genuine' ? formatMs(probe.clearMs) : 'n/a'}
              </span>
              <span>
                Raymarch:{' '}
                {simMode === 'genuine' ? formatMs(probe.shaderMs) : 'n/a'}
              </span>
            </div>
            <div className="truncate text-[10px] text-ink-muted">
              {simMode === 'genuine'
                ? `${probe.cores} cores · ${probe.screen}`
                : 'Simulated hardware profile'}
            </div>
          </HudCard>

          <HudCard
            icon={<Eye className="h-3.5 w-3.5" />}
            label="L2 · CANVAS & RUNTIME"
          >
            <div className="truncate text-ink-code" title={telemetry.canvas}>
              {telemetry.canvas}
            </div>
            <div className="truncate text-[11px] text-ink-secondary" title={telemetry.cdp}>
              {telemetry.cdp}
            </div>
            <div className="truncate text-[10px] text-ink-muted" title={telemetry.tts}>
              OS TTS: {telemetry.tts}
            </div>
            <div className="truncate text-[10px] text-ink-muted">
              {simMode === 'genuine'
                ? `Display: ${probe.p3 ? 'P3' : 'sRGB'} · HDR ${
                    probe.hdr ? 'on' : 'off'
                  } · ${probe.screen}`
                : 'Simulated OS profile'}
            </div>
          </HudCard>

          <HudCard
            icon={<Activity className="h-3.5 w-3.5" />}
            label="L4 · POLARS KINEMATICS"
          >
            <div className="truncate text-ink-code" title={telemetry.kinematics}>
              {telemetry.kinematics}
            </div>
            <div className="flex h-6 items-end gap-0.5 pt-1" aria-hidden="true">
              {bars.map((value, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-t transition-all duration-75 ${barColor}`}
                  style={{ height: `${Math.max(12, Math.min(100, value * 25))}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between gap-2 text-[10px] text-ink-muted">
              <span>v={displayVelocity} px/ms</span>
              <span>{displayStraightness.toFixed(2)} straight</span>
              <span>jerk {displayJerk}</span>
            </div>
          </HudCard>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-canvas p-3">
          <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-ink-muted">
            <span>ANOMALY ENGINE VERDICT</span>
            <span>{telemetry.anomalies.length} FLAGS</span>
          </div>
          {telemetry.anomalies.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                Zero hardware, realm, TCP stack, or kinematic contradictions
                detected.
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {telemetry.anomalies.map((flag) => (
                <span
                  key={flag}
                  className="inline-flex items-center gap-1 rounded border border-rose-500/30 bg-rose-500/15 px-2 py-0.5 text-[10px] text-rose-300"
                >
                  <ShieldAlert
                    className="h-3 w-3 shrink-0 text-rose-400"
                    aria-hidden="true"
                  />
                  {flag}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="text-[10px] leading-relaxed text-ink-muted">
          Mode 1 probes this browser locally with real collectors. Modes 2–3 are
          deterministic attack simulations. TCP/JA4 wire values are resolved
          server-side, not fabricated in JavaScript.
        </p>
      </div>
    </div>
  );
}

function formatMs(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '<0.01 ms';
  return `${value.toFixed(2)} ms`;
}

function ModeButton({
  active,
  tone,
  fullLabel,
  onClick,
  children,
}: {
  active: boolean;
  tone: 'emerald' | 'rose';
  fullLabel: string;
  onClick: () => void;
  children: ReactNode;
}) {
  const activeClass =
    tone === 'emerald'
      ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
      : 'border border-rose-500/40 bg-rose-500/20 text-rose-300';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={fullLabel}
      className={`truncate rounded px-2 py-1.5 text-center transition ${
        active ? activeClass : 'text-ink-secondary hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function HudCard({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1 rounded-lg border border-white/[0.06] bg-canvas p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.06em] text-cyan-400">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      {children}
    </div>
  );
}
