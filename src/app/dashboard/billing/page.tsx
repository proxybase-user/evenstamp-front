import Link from 'next/link';
import { CheckCircle2, Info } from 'lucide-react';
import BillingActions from '@/components/dashboard/BillingActions';
import { getBilling, requireUser } from '@/lib/account';
import {
  formatMoney,
  formatNumber,
  formatTimestamp,
  percent,
} from '@/lib/format';

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  await requireUser('/dashboard/billing');
  const params = await searchParams;
  const billing = await getBilling();
  const usage = billing.usage;
  const usagePercent = percent(usage.identifications, usage.included);
  const remaining =
    usage.included === null
      ? null
      : Math.max(0, usage.included - usage.identifications);

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">// Billing &amp; plans</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          Usage, plans, and payment providers.
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-secondary">
          Card subscriptions are handled by Airwallex. Crypto invoices are
          handled by NOWPayments as prepaid terms. The engine stores the plan
          and period end; provider keys never reach the browser.
        </p>
      </div>

      {params.checkout === 'success' ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-2.5 text-xs leading-relaxed text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Checkout completed. The plan activates when the signed provider
            webhook reaches the engine, usually within a few seconds. Refresh
            this page if the plan badge has not changed.
          </p>
        </div>
      ) : null}
      {params.checkout === 'cancelled' ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.08] px-3 py-2.5 text-xs text-amber-200">
          Checkout was cancelled. Your current plan is unchanged.
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="surface-card rounded-xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                Current subscription
              </div>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <h2 className="text-2xl font-semibold">{billing.plan.name}</h2>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-ink-secondary">
                  {billing.plan.status}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-ink-secondary">
                  {billing.plan.interval}
                </span>
              </div>
              <p className="mt-2 font-mono text-[10px] text-ink-muted">
                Billed via {billing.plan.provider} ·{' '}
                {billing.plan.currentPeriodEndMs
                  ? `current period ends ${formatTimestamp(
                      billing.plan.currentPeriodEndMs,
                    )}`
                  : 'no renewal date on the free plan'}
              </p>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] text-ink-primary transition hover:bg-white/[0.07]"
            >
              Compare plans
            </Link>
          </div>

          <div className="mt-5 rounded-lg border border-white/[0.06] bg-canvas p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                {usage.month} identifications
              </span>
              <span className="metric text-sm font-semibold text-ink-primary">
                {formatNumber(usage.identifications)}
                {usage.included === null
                  ? ' / unlimited'
                  : ` / ${formatNumber(usage.included)}`}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
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
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-ink-muted">
              <span>
                {remaining === null
                  ? 'Unlimited included identifications.'
                  : `${formatNumber(remaining)} remaining this month.`}
              </span>
              <span>
                Overage: {formatMoney(usage.overageCents)} (
                {formatNumber(usage.overageUnits)} × 10k)
              </span>
            </div>
          </div>
        </section>

        <section className="surface-card rounded-xl p-5">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <h2 className="text-sm font-semibold">Provider status</h2>
          </div>
          <div className="mt-3 space-y-2 font-mono text-[10px]">
            <div className="flex items-center justify-between border-b border-white/[0.05] py-1.5">
              <span className="text-ink-muted">Airwallex checkout</span>
              <span
                className={
                  billing.providers.airwallex
                    ? 'text-emerald-300'
                    : 'text-ink-muted'
                }
              >
                {billing.providers.airwallex ? 'configured' : 'not configured'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-white/[0.05] py-1.5">
              <span className="text-ink-muted">Airwallex webhook</span>
              <span
                className={
                  billing.providers.airwallexWebhooks
                    ? 'text-emerald-300'
                    : 'text-amber-300'
                }
              >
                {billing.providers.airwallexWebhooks
                  ? 'verified'
                  : 'missing secret'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-white/[0.05] py-1.5">
              <span className="text-ink-muted">NOWPayments invoices</span>
              <span
                className={
                  billing.providers.nowpayments
                    ? 'text-emerald-300'
                    : 'text-ink-muted'
                }
              >
                {billing.providers.nowpayments ? 'configured' : 'not configured'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-ink-muted">NOWPayments IPN</span>
              <span
                className={
                  billing.providers.nowpaymentsWebhooks
                    ? 'text-emerald-300'
                    : 'text-amber-300'
                }
              >
                {billing.providers.nowpaymentsWebhooks
                  ? 'verified'
                  : 'missing secret'}
              </span>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
            Webhook endpoints:{' '}
            <span className="font-mono text-ink-secondary">
              /api/billing/webhooks/airwallex
            </span>{' '}
            and{' '}
            <span className="font-mono text-ink-secondary">
              /api/billing/webhooks/nowpayments
            </span>
            .
          </p>
        </section>
      </div>

      <BillingActions plans={billing.plans} providers={billing.providers} />
    </div>
  );
}
