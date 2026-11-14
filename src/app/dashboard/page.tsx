import Link from 'next/link';
import {
  ArrowRight,
  Fingerprint,
  Globe2,
  Plus,
  ShieldAlert,
  Gauge,
} from 'lucide-react';
import { getSessions, getSites, requireUser } from '@/lib/account';
import {
  countryLabel,
  formatNumber,
  percent,
  riskTone,
  timeAgo,
} from '@/lib/format';

export default async function DashboardOverviewPage() {
  const me = await requireUser();
  const [sites, recent] = await Promise.all([
    getSites(),
    getSessions({ limit: 8 }),
  ]);

  const used = me.usage.identifications;
  const included = me.usage.included;
  const usagePercent = percent(used, included);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="eyebrow">// Account overview</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-ink">
            Welcome back{me.user.name ? `, ${me.user.name.split(' ')[0]}` : ''}.
          </h1>
          <p className="mt-1.5 text-sm text-ink-body">
            Install a site key, then watch the engine turn raw probes into
            device findings.
          </p>
        </div>
        <Link
          href="/dashboard/sites"
          className="button-primary !text-xs !py-2 !min-h-0 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add a website
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="card-feature !p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
              Identifications / month
            </span>
            <Gauge className="h-4 w-4 text-accent-green" aria-hidden="true" />
          </div>
          <div className="metric mt-2 text-3xl font-semibold text-ink">
            {formatNumber(used)}
          </div>
          <div className="mt-1 font-mono text-[10px] text-ink-muted">
            {included === null
              ? 'unlimited on your plan'
              : `of ${formatNumber(included)} included`}
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-3">
            <div
              className={`h-full rounded-full ${
                usagePercent >= 100
                  ? 'bg-accent-red'
                  : usagePercent >= 80
                    ? 'bg-accent-yellow'
                    : 'bg-accent-green'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </article>

        <article className="card-feature !p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
              Managed sites
            </span>
            <Globe2 className="h-4 w-4 text-accent-blue" aria-hidden="true" />
          </div>
          <div className="metric mt-2 text-3xl font-semibold text-ink">
            {sites.length}
          </div>
          <div className="mt-1 font-mono text-[10px] text-ink-muted">
            {sites.length === 0
              ? 'add your first site to start'
              : `${formatNumber(
                  sites.reduce((sum, site) => sum + site.sessions30d, 0),
                )} sessions in 30d`}
          </div>
        </article>

        <article className="card-feature !p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
              Recent sessions
            </span>
            <Fingerprint className="h-4 w-4 text-accent-green" aria-hidden="true" />
          </div>
          <div className="metric mt-2 text-3xl font-semibold text-ink">
            {recent.sessions.length}
          </div>
          <div className="mt-1 font-mono text-[10px] text-ink-muted">
            latest findings from the engine
          </div>
        </article>

        <article className="card-feature !p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
              Plan
            </span>
            <ShieldAlert className="h-4 w-4 text-accent-yellow" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-ink">
            {me.plan.name}
          </div>
          <div className="mt-1 font-mono text-[10px] text-ink-muted">
            {me.plan.status} · {me.plan.interval}
            {me.plan.currentPeriodEndMs
              ? ` · renews ${timeAgo(me.plan.currentPeriodEndMs)}`
              : ''}
          </div>
          <Link
            href="/dashboard/billing"
            className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-accent-blue hover:underline"
          >
            Manage billing
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </article>
      </div>

      {sites.length === 0 ? (
        <section className="card-feature border-dashed !p-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[8px] border border-hairline bg-surface-2 text-accent-green">
            <Globe2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-ink">
            Add a website to generate its site key
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-body">
            Each site gets a public key and a copy-paste snippet. The key routes
            challenge and ingest traffic to this account only.
          </p>
          <Link
            href="/dashboard/sites"
            className="button-primary mt-5 inline-flex"
          >
            Add your first site
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Recent session findings</h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Risk, anomaly codes, and edge telemetry from the latest ingests.
            </p>
          </div>
          <Link
            href="/dashboard/sessions"
            className="font-mono text-[11px] text-accent-blue hover:underline"
          >
            View all
          </Link>
        </div>

        {recent.sessions.length === 0 ? (
          <div className="card-feature !p-6 text-sm text-ink-body">
            No sessions yet. Once the snippet is installed, the first page load
            creates a challenge and an ingest.
          </div>
        ) : (
          <div className="card-feature overflow-hidden !p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="border-b border-hairline bg-surface-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Risk</th>
                    <th className="px-4 py-3 font-medium">Site</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Device</th>
                    <th className="px-4 py-3 font-medium">Anomalies</th>
                    <th className="px-4 py-3 font-medium">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {recent.sessions.map((session) => {
                    const tone = riskTone(session.riskScore);
                    return (
                      <tr
                        key={session.sessionId}
                        className="transition-colors hover:bg-surface-2/60"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/sessions/${session.sessionId}`}
                            className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-0.5 font-mono text-[10px] ${tone.className}`}
                          >
                            <span className={`status-dot ${tone.dot}`} />
                            {session.riskScore.toFixed(0)}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-ink font-medium">
                          {session.siteName}
                        </td>
                        <td className="px-4 py-3 text-ink-body">
                          {countryLabel(session.edge)}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-ink-body">
                          {session.gpuRenderer ||
                            session.osFamily ||
                            'Unreported'}
                        </td>
                        <td className="px-4 py-3">
                          {session.anomalies.length === 0 ? (
                            <span className="font-mono text-[11px] text-accent-green">
                              none
                            </span>
                          ) : (
                            <span className="font-mono text-[11px] text-accent-yellow">
                              {session.anomalies.length} flagged
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-ink-muted">
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
      </section>
    </div>
  );
}
