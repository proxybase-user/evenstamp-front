import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Cpu, Fingerprint, Network, ShieldAlert } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { getSessionDetail, requireUser } from '@/lib/account';
import {
  countryLabel,
  formatNumber,
  formatTimestamp,
  percent,
  riskTone,
} from '@/lib/format';

function Stat({
  label,
  value,
  sub,
  tone = 'text-ink-primary',
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
}) {
  return (
    <div className="surface-card rounded-xl p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
        {label}
      </div>
      <div className={`metric mt-1.5 text-2xl font-bold ${tone}`}>{value}</div>
      {sub ? (
        <div className="mt-1 font-mono text-[10px] text-ink-muted">{sub}</div>
      ) : null}
    </div>
  );
}

function WireRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.05] py-2 last:border-b-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
        {label}
      </span>
      <span className="truncate font-mono text-[11px] text-ink-secondary">
        {value === null || value === undefined || value === '' ? '—' : value}
      </span>
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
  const tone = riskTone(session.riskScore);
  const behavior = session.behavior ?? {};
  const edge = session.edge ?? {};
  const maxFinding = Math.max(
    1,
    ...session.findings.map((finding) => finding.score),
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/sessions"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ink-muted hover:text-ink-primary"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          Back to session findings
        </Link>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] ${tone.className}`}
              >
                <span className={`status-dot ${tone.dot}`} />
                Risk {session.riskScore.toFixed(0)} · {tone.label}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-ink-secondary">
                {session.siteName}
              </span>
              {session.privacyToolDetected ? (
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-[10px] text-cyan-300">
                  privacy tool detected
                </span>
              ) : null}
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
              Session {session.sessionId.slice(0, 8)}
            </h1>
            <p className="mt-1 font-mono text-[10px] text-ink-muted">
              {formatTimestamp(session.createdAt)} · {countryLabel(edge)} ·{' '}
              {session.isNewDevice ? 'new device' : 'linked device'}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 font-mono text-[10px] text-ink-muted">
            <div className="flex items-center gap-2">
              <span>BrowserID</span>
              <code className="max-w-[16rem] truncate text-ink-secondary">
                {session.browserId}
              </code>
              <CopyButton value={session.browserId} label="Copy" />
            </div>
            <div className="flex items-center gap-2">
              <span>DeviceID</span>
              <code className="max-w-[16rem] truncate text-ink-secondary">
                {session.deviceId}
              </code>
              <CopyButton value={session.deviceId} label="Copy" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Risk score"
          value={session.riskScore.toFixed(0)}
          sub="0–100, clamped"
          tone={
            session.riskScore >= 70
              ? 'text-rose-300'
              : session.riskScore >= 30
                ? 'text-amber-300'
                : 'text-emerald-300'
          }
        />
        <Stat
          label="Spoof / automation"
          value={session.spoofAndAutomationScore.toFixed(0)}
          sub="risk excluding privacy hardening"
        />
        <Stat
          label="Identity confidence"
          value={`${(session.confidenceScore * 100).toFixed(0)}%`}
          sub="DeviceID match confidence"
        />
        <Stat
          label="Anomaly findings"
          value={String(session.anomalies.length)}
          sub={
            session.privacyToolDetected
              ? 'privacy signal present'
              : 'no privacy signal'
          }
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <section className="surface-card rounded-xl p-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <h2 className="text-sm font-semibold">Anomaly findings</h2>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            Per-rule score contributions before the 0–100 clamp. A clean session
            has no entries.
          </p>

          {session.findings.length === 0 ? (
            <p className="mt-4 rounded-md border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2.5 text-xs text-emerald-200">
              No anomaly rules fired for this session.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {session.findings.map((finding) => (
                <li key={finding.code}>
                  <div className="flex items-center justify-between gap-3">
                    <code className="break-all font-mono text-[10px] text-amber-200">
                      {finding.code}
                    </code>
                    <span className="shrink-0 font-mono text-[10px] text-ink-secondary">
                      +{finding.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((finding.score / maxFinding) * 100),
                        )}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface-card rounded-xl p-5">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <h2 className="text-sm font-semibold">Edge telemetry</h2>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            Trusted edge headers and same-host probes, after proxy allow-listing.
          </p>
          <div className="mt-3">
            <WireRow label="Location" value={countryLabel(edge)} />
            <WireRow
              label="ASN"
              value={
                edge.asn
                  ? `AS${edge.asn}${edge.asOrganization ? ` · ${edge.asOrganization}` : ''}`
                  : null
              }
            />
            <WireRow label="IP prefix" value={edge.ipPrefix} />
            <WireRow label="TCP TTL" value={edge.tcpTtl} />
            <WireRow label="TCP MSS" value={edge.tcpMss} />
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
            <WireRow label="JA4" value={edge.ja4Fingerprint} />
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="surface-card rounded-xl p-5">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <h2 className="text-sm font-semibold">Behavioral biometrics</h2>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            Polars summary computed from the columnar pointer, key, and scroll
            streams.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ['Pointer events', formatNumber(behavior.pointerEventCount ?? 0)],
              ['Key events', formatNumber(behavior.keyEventCount ?? 0)],
              ['Scroll events', formatNumber(behavior.scrollEventCount ?? 0)],
              [
                'Mean velocity',
                `${(behavior.meanVelocity ?? 0).toFixed(1)} px/ms`,
              ],
              ['p90 jerk', (behavior.p90Jerk ?? 0).toFixed(1)],
              [
                'Straightness',
                `${Math.round((behavior.pathStraightnessRatio ?? 0) * 100)}%`,
              ],
              ['Dwell', `${(behavior.meanDwellMs ?? 0).toFixed(1)} ms`],
              ['Rollover', `${Math.round((behavior.rolloverRatio ?? 0) * 100)}%`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-white/[0.06] bg-canvas p-3"
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-muted">
                  {label}
                </div>
                <div className="metric mt-1 text-sm font-semibold text-ink-primary">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card rounded-xl p-5">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <h2 className="text-sm font-semibold">Device profile</h2>
          </div>
          {device ? (
            <>
              <p className="mt-1 text-xs text-ink-muted">
                Persisted hardware profile used for cross-browser matching.
              </p>
              <div className="mt-3">
                <WireRow label="GPU vendor" value={device.gpuVendor} />
                <WireRow label="GPU renderer" value={device.gpuRenderer} />
                <WireRow
                  label="Display"
                  value={`${device.screenWidth} × ${device.screenHeight}`}
                />
                <WireRow label="OS family" value={device.osFamily} />
                <WireRow label="CPU cores" value={device.cores} />
                <WireRow label="Last ASN" value={device.lastAsn} />
                <WireRow label="Last IP prefix" value={device.lastIpPrefix} />
                <WireRow
                  label="First seen"
                  value={formatTimestamp(device.firstSeenAt)}
                />
                <WireRow
                  label="Last seen"
                  value={formatTimestamp(device.lastSeenAt)}
                />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between font-mono text-[10px] text-ink-muted">
                  <span>GPU limits hash</span>
                  <CopyButton value={device.gpuLimitsHash} label="Copy" />
                </div>
                <code className="mt-1 block break-all rounded-md border border-white/[0.06] bg-canvas p-2 font-mono text-[10px] text-ink-secondary">
                  {device.gpuLimitsHash}
                </code>
              </div>
            </>
          ) : (
            <p className="mt-3 text-xs text-ink-muted">
              The device row was removed by retention or a deletion request.
            </p>
          )}
        </section>
      </div>

      {session.rawPayload ? (
        <section className="surface-card rounded-xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Stored raw payload</h2>
              <p className="mt-1 text-xs text-ink-muted">
                This deployment stores full payloads for the session retention
                window.
              </p>
            </div>
          </div>
          <pre className="scrollbar-thin mt-3 max-h-[28rem] overflow-auto rounded-md border border-white/[0.06] bg-canvas p-3 font-mono text-[10px] leading-relaxed text-ink-code">
            {JSON.stringify(session.rawPayload, null, 2)}
          </pre>
        </section>
      ) : null}
    </div>
  );
}
