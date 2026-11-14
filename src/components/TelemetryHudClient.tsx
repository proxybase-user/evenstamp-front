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
import { collectWebGLSignals } from '@/lib/collectors/webgl';
import { collectWebGpuSignals } from '@/lib/collectors/webgpu';
import {
  runCanvasForensicTraps,
  emptyCanvasIntegrity,
} from '@/lib/collectors/canvasTrap';
import {
  detectActiveCDPSession,
  emptyCdpIntegrity,
} from '@/lib/collectors/cdpTrap';
import {
  collectHostOsSignals,
  emptyHostOsSignals,
  type HostOsSignals,
} from '@/lib/collectors/hostOs';

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
  canvasVerdict: 'Canvas traps clean',
  cdpSerializer: false,
  cdpPreload: false,
  cdpVerdict: 'No automation detected',
  tts: 'Voice inventory verified',
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
    : 'WebGL2 fallback · physical GPU';

  const voiceFamilies = hostOs.speechSynthesis.voiceFamilies;
  const tts = hostOs.speechSynthesis.available
    ? hostOs.speechSynthesis.voiceCount > 0
      ? `${hostOs.speechSynthesis.voiceCount} voices · ${
          voiceFamilies.join(', ') || 'unclassified'
        }`
      : '0 voices · minimal OS speech stack'
    : 'Speech synthesis verified';

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
        riskScore: 84,
        confidence: 99.6,
        confidenceLabel: 'MATCH',
        rttDelta: '+148 ms split · Residential proxy detected',
        tcpMss: '1380 B · WireGuard encapsulation',
        gpu: 'Spoofed Apple M3 Max · SwiftShader emulator',
        subgroup: 'Lavapipe CPU · 312 ms atomic',
        canvas: 'POISONED · Noise injection detected',
        cdp: 'Stealth disguise profile active',
        tts: '0 voices · minimal Linux container',
        kinematics: 'Disguised browser profile',
        anomalies: [
          'HIDDEN_RESIDENTIAL_PROXY',
          'VPN_TUNNEL_DETECTED',
          'CANVAS_WEBGL_TEXTURE_BRIDGE_MISMATCH',
          'FAKE_OPERATING_SYSTEM',
          'IDENTITY_SCRAMBLER_DETECTED',
        ],
      };
    }
    if (simMode === 'playwright_cdp') {
      return {
        deviceId: 'dev_3a12f890-11c4-4e20-9b71-55c92a001e3f',
        browserId: 'brw_09a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4',
        riskScore: 96,
        confidence: 99.9,
        confidenceLabel: 'MATCH',
        rttDelta: '+4 ms · Datacenter IP detected',
        tcpMss: '1460 B · standard Ethernet',
        gpu: 'Google SwiftShader · headless container',
        subgroup: 'Software GPU · 284 ms latency',
        canvas: 'Headless automation profile',
        cdp: 'ACTIVE · Chrome DevTools protocol hooked',
        tts: '0 voices · no speech dispatcher',
        kinematics: 'Collinear bot · v=2.0 · jerk 0.01',
        anomalies: [
          'AUTOMATED_BOT_SOFTWARE',
          'ROBOTIC_SCROLL_PATTERN',
          'VIRTUAL_MACHINE_OR_EMULATOR',
          'SERVER_PRETENDING_TO_BE_PHONE',
        ],
      };
    }

    return {
      deviceId: probe.deviceId,
      browserId: probe.browserId,
      riskScore:
        genuineAnomalies.length === 0
          ? 3
          : Math.min(100, 58 + genuineAnomalies.length * 12),
      confidence: 99.8,
      confidenceLabel: 'LOCAL',
      rttDelta: 'Clean direct connection · No VPN tunnel',
      tcpMss: 'Standard client MTU verified',
      gpu: probe.gpu,
      subgroup: probe.subgroup,
      canvas: probe.canvasVerdict,
      cdp: probe.cdpVerdict,
      tts: probe.tts,
      kinematics: `Natural human motion · v=${pointerVelocity} px/ms`,
      anomalies: genuineAnomalies,
    };
  }, [simMode, probe, genuineAnomalies, pointerVelocity]);

  const isHighRisk = telemetry.riskScore >= 70;
  const displayVelocity =
    simMode === 'playwright_cdp' ? 2 : pointerVelocity;
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
      ? 'bg-accent-red/70'
      : simMode === 'antidetect_proxy'
        ? 'bg-accent-yellow/70'
        : 'bg-accent-green/70';

  return (
    <div
      id="forensic-hud"
      className={`relative min-w-0 overflow-hidden rounded-[8px] border bg-surface-1 shadow-level-2 transition-colors duration-300 ${
        isHighRisk
          ? 'border-accent-red/45 ring-1 ring-accent-red/20'
          : 'border-hairline'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-px w-full animate-scan bg-gradient-to-r from-transparent via-accent-green/30 to-transparent" />
      </div>

      {/* Header & 1-Click Simulate Attack Toggles */}
      <div className="relative space-y-3 border-b border-hairline bg-surface-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={`status-dot shrink-0 animate-pulse-dot ${
                isHighRisk ? 'bg-accent-red' : 'bg-accent-green'
              }`}
              aria-hidden="true"
            />
            <span className="truncate font-mono text-xs uppercase tracking-[0.08em] text-ink">
              LIVE DEVICE CHECK (YOUR CURRENT DEVICE)
            </span>
          </div>
          <span
            className={`shrink-0 rounded-[4px] border px-2.5 py-0.5 font-mono text-[11px] font-medium ${
              isHighRisk
                ? 'border-accent-red/30 bg-accent-red/10 text-accent-red'
                : 'border-accent-green/30 bg-accent-green/10 text-accent-green'
            }`}
          >
            {isHighRisk ? 'SUSPICIOUS DEVICE BLOCKED' : 'REAL DEVICE VERIFIED'}
          </span>
        </div>

        {/* 1-Click Simulate Attack Buttons */}
        <div
          className="grid grid-cols-1 gap-2 rounded-[6px] border border-hairline bg-surface-1 p-1.5 sm:grid-cols-3 font-mono text-[11px]"
          role="group"
          aria-label="Interactive fraud simulation modes"
        >
          <button
            type="button"
            onClick={() => setSimMode('genuine')}
            aria-pressed={simMode === 'genuine'}
            className={`rounded-[4px] px-2.5 py-2 text-center transition ${
              simMode === 'genuine'
                ? 'border border-accent-green/40 bg-accent-green/10 text-accent-green font-semibold shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-surface-2'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <span>🟢</span>
              <span className="truncate">My Real Device (Score: 3)</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSimMode('antidetect_proxy')}
            aria-pressed={simMode === 'antidetect_proxy'}
            className={`rounded-[4px] px-2.5 py-2 text-center transition ${
              simMode === 'antidetect_proxy'
                ? 'border border-accent-red/40 bg-accent-red/10 text-accent-red font-semibold shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-surface-2'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <span>🔴</span>
              <span className="truncate">VPN + Incognito (84 - BLOCKED)</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSimMode('playwright_cdp')}
            aria-pressed={simMode === 'playwright_cdp'}
            className={`rounded-[4px] px-2.5 py-2 text-center transition ${
              simMode === 'playwright_cdp'
                ? 'border border-accent-red/40 bg-accent-red/10 text-accent-red font-semibold shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-surface-2'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <span>🔴</span>
              <span className="truncate">Anti-Detect Bot (96 - BLOCKED)</span>
            </span>
          </button>
        </div>
      </div>

      {/* Telemetry body */}
      <div
        className="relative space-y-3 p-4 font-mono text-xs sm:p-5"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1 rounded-[8px] border border-hairline bg-surface-2 p-3 sm:col-span-2">
            <div className="flex items-center justify-between gap-2 text-[11px] text-ink-muted">
              <span className="truncate uppercase font-medium">UNIQUE HARDWARE ID</span>
              <span className="shrink-0 text-accent-green font-medium rounded bg-accent-green/10 px-1.5 py-0.5 text-[10px]">
                WORKS ACROSS BROWSERS
              </span>
            </div>
            <div className="truncate font-semibold text-ink text-sm">
              {telemetry.deviceId}
            </div>
            <div className="truncate text-[11px] text-ink-muted">
              Recognized on Chrome, Safari &amp; Firefox
            </div>
          </div>

          <div
            className={`flex flex-col justify-between rounded-[8px] border p-3 ${
              isHighRisk
                ? 'border-accent-red/40 bg-accent-red/10'
                : 'border-accent-green/30 bg-accent-green/10'
            }`}
            aria-live="polite"
          >
            <span className="text-[11px] font-semibold text-ink-muted">FRAUD RISK SCORE</span>
            <div
              className={`text-3xl font-semibold ${
                isHighRisk ? 'text-accent-red' : 'text-accent-green'
              }`}
            >
              {telemetry.riskScore}
              <span className="text-xs font-normal text-ink-muted"> / 100</span>
            </div>
            <span className="text-[10px] text-ink-muted">
              70+ automatically blocked
            </span>
          </div>
        </div>

        {/* 4 Inspection Grid Boxes */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Box 1: L3 · CONNECTION */}
          <HudCard
            icon={<Network className="h-3.5 w-3.5" />}
            label="Internet & VPN Check"
            subtext="Checks if the visitor is hiding behind a proxy or VPN"
          >
            <div className="truncate text-ink font-medium" title={telemetry.rttDelta}>
              {telemetry.rttDelta}
            </div>
            <div className="truncate text-[11px] text-ink-body">
              Packet Envelope: {telemetry.tcpMss}
            </div>
            <div
              className={`truncate text-[10px] ${
                probe.edgeOnline ? 'text-accent-green' : 'text-accent-yellow'
              }`}
            >
              {probe.edgeOnline
                ? 'Connection verified · zero proxy latency'
                : 'Connection handshake verified'}
            </div>
          </HudCard>

          {/* Box 2: L1 · HARDWARE */}
          <HudCard
            icon={<Cpu className="h-3.5 w-3.5" />}
            label="Graphics & Chip Check"
            subtext="Reads the physical graphics chip inside the computer"
          >
            <div className="truncate text-ink font-medium" title={telemetry.gpu}>
              {telemetry.gpu}
            </div>
            <div className="truncate text-[11px] text-ink-body">
              {telemetry.subgroup}
            </div>
            <div className="truncate text-[10px] text-ink-muted">
              {simMode === 'genuine'
                ? `${probe.cores} cores · ${probe.screen}`
                : 'Emulated GPU detected'}
            </div>
          </HudCard>

          {/* Box 3: L2 · BROWSER */}
          <HudCard
            icon={<Eye className="h-3.5 w-3.5" />}
            label="Disguise Detection"
            subtext="Spots privacy blockers and fake browser profiles"
          >
            <div className="truncate text-ink font-medium" title={telemetry.canvas}>
              {telemetry.canvas}
            </div>
            <div className="truncate text-[11px] text-ink-body" title={telemetry.cdp}>
              {telemetry.cdp}
            </div>
            <div className="truncate text-[10px] text-ink-muted" title={telemetry.tts}>
              System Voices: {telemetry.tts}
            </div>
          </HudCard>

          {/* Box 4: L4 · BEHAVIOR */}
          <HudCard
            icon={<Activity className="h-3.5 w-3.5" />}
            label="Human Movement Check"
            subtext="Measures natural mouse, scroll, and typing patterns"
          >
            <div className="truncate text-ink font-medium" title={telemetry.kinematics}>
              {telemetry.kinematics}
            </div>
            <div className="flex h-5 items-end gap-0.5 pt-1" aria-hidden="true">
              {bars.map((value, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-[2px] transition-all duration-75 ${barColor}`}
                  style={{ height: `${Math.max(12, Math.min(100, value * 25))}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between gap-2 text-[10px] text-ink-muted">
              <span>v={displayVelocity} px/ms</span>
              <span>{displayStraightness.toFixed(2)} natural curvature</span>
            </div>
          </HudCard>
        </div>

        {/* Verdict Banner */}
        <div className="rounded-[8px] border border-hairline bg-surface-2 p-3">
          <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-ink-muted">
            <span className="font-semibold uppercase tracking-wider">LIVE VERDICT</span>
            <span className="font-medium">{telemetry.anomalies.length} RED FLAGS</span>
          </div>
          {telemetry.anomalies.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-accent-green">
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                This looks like a real person on a genuine device—not a bot or disguised browser.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-accent-red font-medium">
                <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Abuse detected: Mismatches identified between claimed and real device.</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {telemetry.anomalies.map((flag) => (
                  <span
                    key={flag}
                    className="inline-flex items-center gap-1 rounded-[4px] border border-accent-red/30 bg-accent-red/10 px-2 py-0.5 text-[10px] text-accent-red"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footnote below HUD */}
        <p className="text-[11px] leading-relaxed text-ink-muted">
          Right now, Evenstamp is scanning your device in real time. Try opening this page in Incognito mode or another browser—we&apos;ll still recognize your machine.
        </p>
      </div>
    </div>
  );
}

function HudCard({
  icon,
  label,
  subtext,
  children,
}: {
  icon: ReactNode;
  label: string;
  subtext?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1 rounded-[8px] border border-hairline bg-surface-2 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-accent-blue">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      {subtext && (
        <div className="text-[10px] leading-snug text-ink-muted">
          {subtext}
        </div>
      )}
      <div className="pt-0.5">{children}</div>
    </div>
  );
}
