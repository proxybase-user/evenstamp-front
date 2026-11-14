import Link from 'next/link';
import { CheckCircle2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { getSessions, getSites, requireUser } from '@/lib/account';
import { getAnomalyInfo } from '@/lib/anomaly-dictionary';
import {
  countryLabel,
  formatNumber,
  riskTone,
  timeAgo,
} from '@/lib/format';

function buildQuery(params: {
  siteId?: string;
  risk?: string;
  before?: number;
}): string {
  const search = new URLSearchParams();
  if (params.siteId) search.set('siteId', params.siteId);
  if (params.risk && params.risk !== 'all') search.set('risk', params.risk);
  if (params.before) search.set('before', String(params.before));
  const value = search.toString();
  return value ? `?${value}` : '';
}

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ siteId?: string; risk?: string; before?: string }>;
}) {
  await requireUser('/dashboard/sessions');
  const params = await searchParams;
  const siteId = params.siteId?.trim() || undefined;
  const risk = params.risk?.trim() || 'all';
  const before = params.before ? Number(params.before) : undefined;

  const [sites, list] = await Promise.all([
    getSites(),
    getSessions({
      siteId,
      risk,
      before: Number.isFinite(before) ? before : undefined,
      limit: 50,
    }),
  ]);

  const activeSite = sites.find((site) => site.siteId === siteId);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="eyebrow">// Session findings</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            Device findings from the engine.
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-secondary">
            Every verified ingest produces a session: identity confidence, risk,
            spoof/automation split, anomaly findings, behavior summary, and edge
            telemetry.
          </p>
        </div>

        <form
          method="get"
          className="surface-card flex flex-wrap items-end gap-3 rounded-xl p-3"
        >
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
              Site
            </span>
            <select
              name="siteId"
              defaultValue={siteId ?? ''}
              className="mt-1 block min-w-[12rem] rounded-md border border-white/10 bg-canvas px-2.5 py-1.5 text-xs text-ink-primary focus:border-emerald-500/50 focus:outline-none"
            >
              <option value="">All sites</option>
              {sites.map((site) => (
                <option key={site.siteId} value={site.siteId}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
              Risk
            </span>
            <select
              name="risk"
              defaultValue={risk}
              className="mt-1 block rounded-md border border-white/10 bg-canvas px-2.5 py-1.5 text-xs text-ink-primary focus:border-emerald-500/50 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="high">High (70+)</option>
              <option value="medium">Medium (30–69)</option>
              <option value="low">Low (&lt;30)</option>
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-ink-primary transition hover:bg-white/[0.07]"
          >
            <Filter className="h-3.5 w-3.5" aria-hidden="true" />
            Filter
          </button>
        </form>
      </div>

      {activeSite ? (
        <p className="font-mono text-[10px] text-ink-muted">
          Filtering by{' '}
          <span className="text-emerald-400">{activeSite.name}</span> ·{' '}
          {activeSite.domain}
        </p>
      ) : null}

      {list.sessions.length === 0 ? (
        <div className="surface-card rounded-xl p-8 text-center">
          <p className="text-sm text-ink-secondary">
            No sessions match this filter yet.
          </p>
          <p className="mt-2 font-mono text-[10px] text-ink-muted">
            Install the snippet on a site, then load the page once. The first
            ingest appears here within seconds.
          </p>
        </div>
      ) : (
        <div className="surface-card overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-xs">
              <thead className="border-b border-white/[0.07] bg-surface-2 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Risk</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Location</th>
                  <th className="px-4 py-2.5 font-medium">Device / OS</th>
                  <th className="px-4 py-2.5 font-medium">Wire</th>
                  <th className="px-4 py-2.5 font-medium">Confidence</th>
                  <th className="px-4 py-2.5 font-medium">Findings</th>
                  <th className="px-4 py-2.5 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {list.sessions.map((session) => {
                  const tone = riskTone(session.riskScore);
                  const wire = [
                    session.edge.tcpTtl ? `TTL ${session.edge.tcpTtl}` : null,
                    session.edge.tcpMss ? `MSS ${session.edge.tcpMss}` : null,
                    session.edge.tcpRttMs !== null &&
                    session.edge.tcpRttMs !== undefined
                      ? `TCP ${Math.round(session.edge.tcpRttMs)}ms`
                      : null,
                    session.edge.tlsRttMs !== null &&
                    session.edge.tlsRttMs !== undefined
                      ? `TLS ${Math.round(session.edge.tlsRttMs)}ms`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' · ');
                  return (
                    <tr
                      key={session.sessionId}
                      className="border-b border-white/[0.05] transition last:border-b-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/sessions/${session.sessionId}`}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] ${tone.className}`}
                        >
                          <span className={`status-dot ${tone.dot}`} />
                          {session.riskScore.toFixed(0)} {tone.label}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/sessions/${session.sessionId}`}
                          className="text-ink-primary hover:text-emerald-300"
                        >
                          {session.siteName}
                        </Link>
                        <div className="font-mono text-[10px] text-ink-muted">
                          {session.isNewDevice ? 'new device' : 'linked device'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-secondary">
                        {countryLabel(session.edge)}
                        <div className="font-mono text-[10px] text-ink-muted">
                          AS{session.edge.asn ?? '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-secondary">
                        {session.gpuRenderer || 'Unreported GPU'}
                        <div className="font-mono text-[10px] text-ink-muted">
                          {session.osFamily || 'unknown OS'}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-ink-secondary">
                        {wire || 'headers absent'}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-ink-primary">
                        {(session.confidenceScore * 100).toFixed(0)}%
                        <div className="text-[10px] text-ink-muted">
                          spoof {session.spoofAndAutomationScore.toFixed(0)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {session.anomalies.length === 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" />
                            Clean
                          </span>
                        ) : (
                          <span className="inline-flex max-w-[18rem] flex-wrap gap-1">
                            {session.anomalies.slice(0, 2).map((anomaly) => {
                              const info = getAnomalyInfo(anomaly);
                              const badgeStyle =
                                info.severity === 'high'
                                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                                  : info.severity === 'medium'
                                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                                    : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
                              return (
                                <span
                                  key={anomaly}
                                  title={`${info.title}: ${info.summary}`}
                                  className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium ${badgeStyle}`}
                                >
                                  {info.badge}
                                </span>
                              );
                            })}
                            {session.anomalies.length > 2 ? (
                              <span className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-ink-muted">
                                +{session.anomalies.length - 2}
                              </span>
                            ) : null}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-ink-muted">
                        {timeAgo(session.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] text-ink-muted">
          {formatNumber(list.sessions.length)} session
          {list.sessions.length === 1 ? '' : 's'} on this page
        </p>
        <div className="flex items-center gap-2">
          {before ? (
            <Link
              href={`/dashboard/sessions${buildQuery({ siteId, risk })}`}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[10px] text-ink-primary hover:bg-white/[0.07]"
            >
              <ChevronLeft className="h-3 w-3" aria-hidden="true" />
              Newest
            </Link>
          ) : null}
          {list.hasMore && list.nextBefore ? (
            <Link
              href={`/dashboard/sessions${buildQuery({
                siteId,
                risk,
                before: list.nextBefore,
              })}`}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[10px] text-ink-primary hover:bg-white/[0.07]"
            >
              Older
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
