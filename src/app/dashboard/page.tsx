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
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            Welcome back{me.user.name ? `, ${me.user.name.split(' ')[0]}` : ''}.
          </h1>
          <p className="mt-1.5 text-sm text-ink-secondary">
            Install a site key, then watch the engine turn raw probes into
            device findings.
          </p>
        </div>
        <Link
          href="/dashboard/sites"
          className="inline-flex items-center gap-1.5 self-start rounded-md bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-400 sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add a website
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="surface-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
              Identifications / month
            </span>
            <Gauge className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          </div>
          <div className="metric mt-2 text-3xl font-bold text-ink-primary">
            {formatNumber(used)}
          </div>
          <div className="mt-1 font-mono text-[10px] text-ink-muted">
            {included === null
              ? 'unlimited on your plan'
              : `of ${formatNumber(included)} included`}
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full ${
                usagePercent >= 100
                  ? 'bg-rose-400'
                  : usagePercent >= 80
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </article>

        <article className="surface-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
              Managed sites
            </span>
            <Globe2 className="h-4 w-4 text-cyan-400" aria-hidden="true" />
          </div>
          <div className="metric mt-2 text-3xl font-bold text-ink-primary">
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

        <article className="surface-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
              Recent sessions
            </span>
            <Fingerprint className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          </div>
          <div className="metric mt-2 text-3xl font-bold text-ink-primary">
            {recent.sessions.length}
          </div>
          <div className="mt-1 font-mono text-[10px] text-ink-muted">
            latest findings from the engine
          </div>
        </article>

        <article className="surface-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
              Plan
            </span>
            <ShieldAlert className="h-4 w-4 text-amber-400" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-ink-primary">
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
            className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 hover:text-emerald-300"
          >
            Manage billing
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </article>
      </div>

      {sites.length === 0 ? (
        <section className="surface-card rounded-xl border-dashed p-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
            <Globe2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">
            Add a website to generate its site key
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">
            Each site gets a public key and a copy-paste snippet. The key routes
            challenge and ingest traffic to this account only.
          </p>
          <Link
            href="/dashboard/sites"
            className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-4 py-2 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Add your first site
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold">Recent session findings</h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Risk, anomaly codes, and edge telemetry from the latest ingests.
            </p>
          </div>
          <Link
            href="/dashboard/sessions"
            className="font-mono text-[10px] text-emerald-400 hover:text-emerald-300"
          >
            View all
          </Link>
        </div>

        {recent.sessions.length === 0 ? (
          <div className="surface-card rounded-xl p-6 text-sm text-ink-secondary">
            No sessions yet. Once the snippet is installed, the first page load
            creates a challenge and an ingest.
          </div>
        ) : (
          <div className="surface-card overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="border-b border-white/[0.07] bg-surface-2 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Risk</th>
                    <th className="px-4 py-2.5 font-medium">Site</th>
                    <th className="px-4 py-2.5 font-medium">Location</th>
                    <th className="px-4 py-2.5 font-medium">Device</th>
                    <th className="px-4 py-2.5 font-medium">Anomalies</th>
                    <th className="px-4 py-2.5 font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.sessions.map((session) => {
                    const tone = riskTone(session.riskScore);
                    return (
                      <tr
                        key={session.sessionId}
                        className="border-b border-white/[0.05] last:border-b-0"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/sessions/${session.sessionId}`}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] ${tone.className}`}
                          >
                            <span className={`status-dot ${tone.dot}`} />
                            {session.riskScore.toFixed(0)}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-ink-primary">
                          {session.siteName}
                        </td>
                        <td className="px-4 py-3 text-ink-secondary">
                          {countryLabel(session.edge)}
                        </td>
                        <td className="px-4 py-3 font-mono text-[10px] text-ink-secondary">
                          {session.gpuRenderer ||
                            session.osFamily ||
                            'Unreported'}
                        </td>
                        <td className="px-4 py-3">
                          {session.anomalies.length === 0 ? (
                            <span className="font-mono text-[10px] text-emerald-400">
                              none
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] text-amber-300">
                              {session.anomalies.length} flagged
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
      </section>
    </div>
  );
}
