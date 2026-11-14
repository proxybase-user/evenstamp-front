import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Fingerprint,
  Globe,
  Keyboard,
  MousePointer,
  Network,
  Scroll,
  Server,
  ShieldAlert,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { getSessionDetail, requireUser } from '@/lib/account';
import {
  ANOMALY_DICTIONARY,
  getAnomalyInfo,
  getExecutiveVerdict,
  interpretBehavior,
  interpretNetwork,
} from '@/lib/anomaly-dictionary';
import {
  countryLabel,
  formatNumber,
  formatTimestamp,
  riskTone,
} from '@/lib/format';

function WireRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number | null | undefined;
  sub?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.05] py-2.5 last:border-b-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
        {label}
      </span>
      <div className="text-right">
        <span className="truncate font-mono text-[11px] text-ink-secondary">
          {value === null || value === undefined || value === '' ? '—' : value}
        </span>
        {sub ? (
          <div className="text-[10px] text-ink-muted">{sub}</div>
        ) : null}
      </div>
    </div>
  );
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireUser(`/dashboard/sessions/${id}`);
  const detail = await getSessionDetail(id);
  if (!detail) {
    notFound();
  }

  const { session, device } = detail;
  const behavior = session.behavior ?? {};
  const edge = session.edge ?? {};

  // Plain-English interpretations
  const verdict = getExecutiveVerdict({
    riskScore: session.riskScore,
    spoofAndAutomationScore: session.spoofAndAutomationScore,
    privacyToolDetected: session.privacyToolDetected,
    findings: session.findings,
    anomalies: session.anomalies,
  });

  const behaviorAnalysis = interpretBehavior(behavior, session.anomalies);
  const networkAnalysis = interpretNetwork(edge, session.anomalies);

  const maxFindingScore = Math.max(
    1,
    ...session.findings.map((f) => f.score),
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Metadata Header */}
      <div>
        <Link
          href="/dashboard/sessions"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted transition hover:text-ink-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to all sessions
        </Link>

        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${verdict.badgeClass}`}
              >
                {verdict.status === 'safe' ? (
                  <ShieldCheck className="h-3.5 w-3.5" />
                ) : verdict.status === 'caution' ? (
                  <AlertTriangle className="h-3.5 w-3.5" />
                ) : (
                  <ShieldAlert className="h-3.5 w-3.5" />
                )}
                {verdict.badgeLabel}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary">
                {session.siteName}
              </span>

              {session.isNewDevice ? (
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300">
                  First-time Device
                </span>
              ) : (
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-ink-muted">
                  Returning Device
                </span>
              )}

              {session.privacyToolDetected ? (
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] text-cyan-300">
                  Privacy Tool Active
                </span>
              ) : null}
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Session Findings Analysis
            </h1>
            <p className="mt-1 font-mono text-xs text-ink-muted">
              Recorded {formatTimestamp(session.createdAt)} ·{' '}
              {networkAnalysis.locationSummary}
            </p>
          </div>

          {/* Quick Identifiers */}
          <div className="surface-card flex flex-col gap-1.5 rounded-xl p-3 font-mono text-[11px] text-ink-muted lg:min-w-[20rem]">
            <div className="flex items-center justify-between gap-3">
              <span>Session ID</span>
              <div className="flex items-center gap-1.5">
                <code className="text-ink-primary">
                  {session.sessionId.slice(0, 12)}...
                </code>
                <CopyButton value={session.sessionId} label="Copy" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Device ID</span>
              <div className="flex items-center gap-1.5">
                <code className="text-ink-secondary">
                  {session.deviceId.slice(0, 12)}...
                </code>
                <CopyButton value={session.deviceId} label="Copy" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Browser ID</span>
              <div className="flex items-center gap-1.5">
                <code className="text-ink-secondary">
                  {session.browserId.slice(0, 12)}...
                </code>
                <CopyButton value={session.browserId} label="Copy" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE VERDICT HERO CARD */}
      <section
        className={`surface-card relative overflow-hidden rounded-2xl border p-6 sm:p-7 ${verdict.borderClass} bg-gradient-to-br ${verdict.bgGlowClass}`}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              {verdict.status === 'safe' ? (
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              ) : verdict.status === 'caution' ? (
                <AlertTriangle className="h-6 w-6 text-amber-400" />
              ) : (
                <ShieldAlert className="h-6 w-6 text-rose-400" />
              )}
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                Executive Verdict
              </span>
            </div>

            <h2 className="text-xl font-bold text-ink-primary sm:text-2xl">
              {verdict.headline}
            </h2>

            <p className="text-sm leading-relaxed text-ink-secondary sm:text-base">
              {verdict.summary}
            </p>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3.5 sm:p-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Recommended Action
              </div>
              <p className="mt-1 text-sm font-medium text-ink-primary">
                {verdict.recommendedAction}
              </p>
            </div>
          </div>

          {/* Quick Score Glance */}
          <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
            <div className="surface-inset rounded-xl p-3.5 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Risk Score
              </div>
              <div
                className={`metric mt-1 text-3xl font-extrabold ${
                  session.riskScore >= 70
                    ? 'text-rose-400'
                    : session.riskScore >= 30
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                }`}
              >
                {session.riskScore.toFixed(0)}
                <span className="text-xs font-normal text-ink-muted">/100</span>
              </div>
              <div className="mt-1 text-[10px] text-ink-secondary">
                {session.riskScore >= 70
                  ? 'High Risk'
                  : session.riskScore >= 30
                    ? 'Medium Risk'
                    : 'Low Risk'}
              </div>
            </div>

            <div className="surface-inset rounded-xl p-3.5 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Bot / Spoof
              </div>
              <div
                className={`metric mt-1 text-3xl font-extrabold ${
                  session.spoofAndAutomationScore >= 50
                    ? 'text-rose-400'
                    : session.spoofAndAutomationScore >= 20
                      ? 'text-amber-400'
                      : 'text-ink-primary'
                }`}
              >
                {session.spoofAndAutomationScore.toFixed(0)}
                <span className="text-xs font-normal text-ink-muted">/100</span>
              </div>
              <div className="mt-1 text-[10px] text-ink-secondary">
                Fraud specific
              </div>
            </div>

            <div className="surface-inset rounded-xl p-3.5 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Identity Match
              </div>
              <div className="metric mt-1 text-2xl font-bold text-ink-primary">
                {(session.confidenceScore * 100).toFixed(0)}%
              </div>
              <div className="mt-1 text-[10px] text-ink-secondary">
                Device confidence
              </div>
            </div>

            <div className="surface-inset rounded-xl p-3.5 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Findings
              </div>
              <div className="metric mt-1 text-2xl font-bold text-ink-primary">
                {session.findings.length}
              </div>
              <div className="mt-1 text-[10px] text-ink-secondary">
                Rules triggered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FINDINGS: WHAT WAS DETECTED */}
      <section className="space-y-4">
        <div>
          <div className="eyebrow">// Detection Breakdown</div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-ink-primary">
            What Evenstamp Detected
          </h2>
          <p className="mt-1 text-xs text-ink-secondary">
            Each security probe inspects physical hardware limits, packet network signatures,
            and behavioral movement to verify genuine human identity.
          </p>
        </div>

        {session.findings.length === 0 ? (
          <div className="surface-card rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 text-center sm:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-emerald-200">
              All Security Probes Passed Cleanly
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-ink-secondary">
              Zero anomalies, automation scripts, OS contradictions, or proxy relays were detected.
              The visitor&apos;s browser environment, network wire packets, and device characteristics
              are entirely consistent with an authentic human user on a genuine personal device.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {session.findings.map((finding) => {
              const info = getAnomalyInfo(finding.code);
              const severityBadge =
                info.severity === 'high'
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                  : info.severity === 'medium'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                    : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';

              return (
                <div
                  key={finding.code}
                  className="surface-card rounded-xl border border-white/[0.08] p-5 transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${severityBadge}`}
                        >
                          {info.severity} Risk
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-ink-secondary">
                          {info.category}
                        </span>
                        <span className="font-mono text-[10px] text-ink-muted">
                          Score Impact: +{finding.score.toFixed(1)} pts
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-ink-primary sm:text-lg">
                        {info.title}
                      </h3>
                    </div>

                    {/* Visual contribution bar */}
                    <div className="sm:w-36 shrink-0">
                      <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mb-1">
                        <span>Risk weight</span>
                        <span>{Math.round((finding.score / maxFindingScore) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full ${
                            info.severity === 'high'
                              ? 'bg-rose-400'
                              : 'bg-amber-400'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((finding.score / maxFindingScore) * 100),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Plain-English Explanation */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/[0.05] bg-canvas p-3.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                        What happened
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-ink-primary">
                        {info.summary}
                      </p>
                    </div>

                    <div className="rounded-lg border border-white/[0.05] bg-canvas p-3.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300">
                        Why it matters for your business
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                        {info.whyItMatters}
                      </p>
                    </div>
                  </div>

                  {/* Technical Probe Accordion */}
                  <details className="group mt-3 border-t border-white/[0.05] pt-3">
                    <summary className="flex cursor-pointer items-center justify-between font-mono text-[10px] text-ink-muted transition hover:text-ink-primary">
                      <span>Technical Rule: {finding.code}</span>
                      <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
                    </summary>
                    <div className="mt-2 rounded bg-surface-2 p-3 font-mono text-[11px] text-ink-code">
                      <div className="text-ink-secondary">{info.technicalNote}</div>
                      <div className="mt-1 text-ink-muted">
                        Engine code: <code className="text-amber-300">{finding.code}</code> ·
                        Raw penalty: +{finding.score.toFixed(2)}
                      </div>
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* HUMAN INTERACTION & BEHAVIORAL BIOMETRICS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-bold text-ink-primary">
                Human Interaction & Movement
              </h2>
            </div>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                behaviorAnalysis.overallHumanScore >= 70
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : behaviorAnalysis.overallHumanScore >= 40
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
              }`}
            >
              {behaviorAnalysis.overallVerdict}
            </span>
          </div>

          <p className="mt-1 text-xs text-ink-muted">
            High-frequency kinematics analyze cursor curvature, typing rhythm, and scroll gestures
            to differentiate living humans from automated script replays.
          </p>

          {/* Behavior Insights Cards */}
          <div className="mt-4 space-y-3">
            {behaviorAnalysis.insights.map((insight) => (
              <div
                key={insight.label}
                className="rounded-xl border border-white/[0.06] bg-canvas p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {insight.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      insight.status === 'natural'
                        ? 'text-emerald-300'
                        : insight.status === 'suspicious'
                          ? 'text-rose-300'
                          : 'text-ink-muted'
                    }`}
                  >
                    {insight.status === 'natural' ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : insight.status === 'suspicious' ? (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    ) : null}
                    {insight.value}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ink-secondary">
                  {insight.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Activity Totals */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-white/[0.05] bg-surface-2 p-2.5">
              <div className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                Mouse Moves
              </div>
              <div className="metric mt-1 text-lg font-bold text-ink-primary">
                {formatNumber(behavior.pointerEventCount ?? 0)}
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.05] bg-surface-2 p-2.5">
              <div className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                Keystrokes
              </div>
              <div className="metric mt-1 text-lg font-bold text-ink-primary">
                {formatNumber(behavior.keyEventCount ?? 0)}
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.05] bg-surface-2 p-2.5">
              <div className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                Scroll Events
              </div>
              <div className="metric mt-1 text-lg font-bold text-ink-primary">
                {formatNumber(behavior.scrollEventCount ?? 0)}
              </div>
            </div>
          </div>
        </section>

        {/* CONNECTION & NETWORK ORIGIN */}
        <section className="surface-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-bold text-ink-primary">
                Connection & Network Analysis
              </h2>
            </div>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${networkAnalysis.networkBadgeClass}`}
            >
              {networkAnalysis.networkType}
            </span>
          </div>

          <p className="mt-1 text-xs text-ink-muted">
            Physical edge telemetry evaluates packet transit headers, routing hops,
            and latency to identify proxies, VPNs, and server-side spoofing.
          </p>

          <div className="mt-4 space-y-3">
            {/* Location & ASN */}
            <div className="rounded-xl border border-white/[0.06] bg-canvas p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Geographic Location & Network
              </div>
              <div className="mt-1 text-sm font-semibold text-ink-primary">
                {networkAnalysis.locationSummary}
              </div>
              <div className="mt-0.5 font-mono text-xs text-ink-secondary">
                {edge.asn ? `AS${edge.asn}` : 'Unreported ASN'}
                {edge.asOrganization ? ` · ${edge.asOrganization}` : ''}
              </div>
            </div>

            {/* OS Network Packet Verification */}
            <div className="rounded-xl border border-white/[0.06] bg-canvas p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Operating System Packet Check
                </span>
                <span
                  className={`text-xs font-semibold ${
                    networkAnalysis.osPacketMatch.status === 'match'
                      ? 'text-emerald-300'
                      : networkAnalysis.osPacketMatch.status === 'mismatch'
                        ? 'text-rose-300'
                        : 'text-ink-muted'
                  }`}
                >
                  {networkAnalysis.osPacketMatch.status === 'match'
                    ? 'Verified Match'
                    : networkAnalysis.osPacketMatch.status === 'mismatch'
                      ? 'Contradiction Detected'
                      : 'Unknown'}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-ink-secondary">
                {networkAnalysis.osPacketMatch.detail}
              </p>
            </div>

            {/* Latency & Ping */}
            <div className="rounded-xl border border-white/[0.06] bg-canvas p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Connection Latency
              </div>
              <div className="mt-1 text-sm font-semibold text-ink-primary">
                {networkAnalysis.latencySummary}
              </div>
              <p className="mt-0.5 text-xs text-ink-secondary">
                TCP wire latency:{' '}
                {edge.tcpRttMs !== null && edge.tcpRttMs !== undefined
                  ? `${Math.round(edge.tcpRttMs)}ms`
                  : 'N/A'}{' '}
                · TLS handshake latency:{' '}
                {edge.tlsRttMs !== null && edge.tlsRttMs !== undefined
                  ? `${Math.round(edge.tlsRttMs)}ms`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* DEVICE HARDWARE PROFILE */}
      <section className="surface-card rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-bold text-ink-primary">
            Device Hardware Profile
          </h2>
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          Persisted physical hardware attributes used for stable, cookie-less cross-browser matching.
        </p>

        {device ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/[0.06] bg-canvas p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Operating System
              </div>
              <div className="mt-1 text-sm font-bold text-ink-primary">
                {device.osFamily || 'Unknown OS'}
              </div>
              <div className="mt-0.5 text-[11px] text-ink-secondary">
                {device.cores ? `${device.cores} CPU Cores` : 'Unknown cores'}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-canvas p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Screen Resolution
              </div>
              <div className="mt-1 text-sm font-bold text-ink-primary">
                {device.screenWidth} × {device.screenHeight}
              </div>
              <div className="mt-0.5 text-[11px] text-ink-secondary">
                Physical display canvas
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-canvas p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Graphics Processor
              </div>
              <div className="mt-1 truncate text-sm font-bold text-ink-primary" title={device.gpuRenderer}>
                {device.gpuRenderer || 'Default Graphics'}
              </div>
              <div className="mt-0.5 truncate text-[11px] text-ink-secondary">
                {device.gpuVendor || 'Vendor Unspecified'}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-canvas p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                First Seen on Site
              </div>
              <div className="mt-1 text-sm font-bold text-ink-primary">
                {formatTimestamp(device.firstSeenAt)}
              </div>
              <div className="mt-0.5 text-[11px] text-ink-secondary">
                Last seen: {formatTimestamp(device.lastSeenAt)}
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs text-ink-muted">
            The device record was pruned by retention policy or privacy deletion request.
          </p>
        )}
      </section>

      {/* ADVANCED TECHNICAL INSPECTOR (COLLAPSIBLE FOR ENGINEERS) */}
      <details className="group surface-card rounded-2xl border border-white/[0.08] p-6 transition">
        <summary className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Terminal className="h-5 w-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-ink-primary sm:text-base">
                Advanced Technical Diagnostics & Raw Wire Data
              </h2>
              <p className="text-xs text-ink-muted">
                Low-level network wire parameters, JA4 TLS fingerprints, and raw payload inspection for developers.
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-ink-muted transition group-open:rotate-180" />
        </summary>

        <div className="mt-6 space-y-6 border-t border-white/[0.07] pt-6">
          {/* Wire rows */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-canvas p-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-cyan-300">
                Network Wire & SYN Telemetry
              </h3>
              <div className="mt-3">
                <WireRow label="TCP TTL" value={edge.tcpTtl} sub="Packet time-to-live" />
                <WireRow label="TCP MSS" value={edge.tcpMss} sub="Maximum segment size (bytes)" />
                <WireRow
                  label="TCP RTT"
                  value={
                    edge.tcpRttMs !== null && edge.tcpRttMs !== undefined
                      ? `${edge.tcpRttMs.toFixed(1)} ms`
                      : null
                  }
                />
                <WireRow
                  label="TLS RTT"
                  value={
                    edge.tlsRttMs !== null && edge.tlsRttMs !== undefined
                      ? `${edge.tlsRttMs.toFixed(1)} ms`
                      : null
                  }
                />
                <WireRow label="IP Prefix" value={edge.ipPrefix} />
                <WireRow label="ASN" value={edge.asn ? `AS${edge.asn}` : null} />
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-canvas p-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                Cryptographic & Hardware Hashes
              </h3>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-ink-muted">
                    <span>JA4 TLS Fingerprint</span>
                    {edge.ja4Fingerprint ? (
                      <CopyButton value={edge.ja4Fingerprint} label="Copy" />
                    ) : null}
                  </div>
                  <code className="mt-1 block break-all rounded bg-surface-2 p-2 font-mono text-[10px] text-ink-code">
                    {edge.ja4Fingerprint || 'Not captured'}
                  </code>
                </div>

                {device ? (
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-ink-muted">
                      <span>GPU Limits Hash</span>
                      <CopyButton value={device.gpuLimitsHash} label="Copy" />
                    </div>
                    <code className="mt-1 block break-all rounded bg-surface-2 p-2 font-mono text-[10px] text-ink-code">
                      {device.gpuLimitsHash || 'N/A'}
                    </code>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Raw Payload JSON */}
          {session.rawPayload ? (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-ink-primary">
                    Stored Raw Collector Ingest Payload
                  </h3>
                  <p className="mt-0.5 text-[11px] text-ink-muted">
                    Full diagnostic dictionary received by the Evenstamp ingestion engine.
                  </p>
                </div>
                <CopyButton
                  value={JSON.stringify(session.rawPayload, null, 2)}
                  label="Copy Payload JSON"
                />
              </div>
              <pre className="scrollbar-thin mt-2.5 max-h-[24rem] overflow-auto rounded-xl border border-white/[0.06] bg-canvas p-4 font-mono text-[10px] leading-relaxed text-ink-code">
                {JSON.stringify(session.rawPayload, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      </details>
    </div>
  );
}
