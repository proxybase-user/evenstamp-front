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
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-ink">
          Usage, plans, and payment providers.
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-body">
          Card subscriptions are handled by Airwallex. Crypto invoices are
          handled by NOWPayments as prepaid terms. The engine stores the plan
          and period end; provider keys never reach the browser.
        </p>
      </div>

      {params.checkout === 'success' ? (
        <div className="flex items-start gap-2 rounded-[4px] border border-accent-green/30 bg-accent-green/10 px-3.5 py-2.5 text-xs leading-relaxed text-accent-green">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Checkout completed. The plan activates when the signed provider
            webhook reaches the engine, usually within a few seconds. Refresh
            this page if the plan badge has not changed.
          </p>
        </div>
      ) : null}
      {params.checkout === 'cancelled' ? (
        <div className="rounded-[4px] border border-accent-yellow/30 bg-accent-yellow/10 px-3.5 py-2.5 text-xs text-accent-yellow">
          Checkout was cancelled. Your current plan is unchanged.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="card-feature !p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                Current subscription
              </div>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <h2 className="text-2xl font-semibold text-ink">{billing.plan.name}</h2>
                <span className="rounded-[4px] border border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                  {billing.plan.status}
                </span>
                <span className="rounded-[4px] border border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                  {billing.plan.interval}
                </span>
              </div>
              <p className="mt-2 font-mono text-[11px] text-ink-muted">
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
              className="button-secondary shrink-0 !py-1.5 !px-3 !text-[11px] !min-h-0"
            >
              Compare plans
            </Link>
          </div>

          <div className="mt-5 rounded-[4px] border border-hairline bg-surface-2 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                {usage.month} identifications
              </span>
              <span className="metric text-sm font-semibold text-ink">
                {formatNumber(usage.identifications)}
                {usage.included === null
                  ? ' / unlimited'
                  : ` / ${formatNumber(usage.included)}`}
              </span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-3">
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
            <div className="mt-2 flex justify-between font-mono text-[10px] text-ink-muted">
              <span>{usagePercent.toFixed(1)}% of included capacity used</span>
              <span>
                {remaining === null
                  ? 'unlimited capacity'
                  : `${formatNumber(remaining)} remaining`}
              </span>
            </div>
          </div>

          {billing.plan.key === 'developer' ? (
            <div className="mt-4 flex items-start gap-2 rounded-[4px] border border-hairline bg-surface-2 px-3 py-2 text-xs leading-relaxed text-ink-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-blue" aria-hidden="true" />
              <p>
                The Developer tier hard-caps at 25,000 identifications per UTC
                month. Upgrade to Growth or Scale for linear overage.
              </p>
            </div>
          ) : null}
        </section>

        <section className="card-feature !p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
            Payment rails
          </div>
          <h2 className="mt-1 text-base font-semibold text-ink">How payments are settled</h2>
          <div className="mt-4 space-y-3 text-xs leading-relaxed text-ink-body">
            <div className="rounded-[4px] border border-hairline bg-surface-2 p-3">
              <div className="font-medium text-ink">Airwallex hosted cards</div>
              <p className="mt-1 text-ink-muted">
                Card credentials are stored by Airwallex under PCI-DSS Level 1.
                The engine receives an HMAC-SHA256-signed webhook before
                activating the plan period.
              </p>
            </div>
            <div className="rounded-[4px] border border-hairline bg-surface-2 p-3">
              <div className="font-medium text-ink">NOWPayments crypto invoices</div>
              <p className="mt-1 text-ink-muted">
                Prepaid terms in BTC, ETH, USDT, USDC, and 200+ coins. Payment
                callbacks are verified with HMAC-SHA512 against the raw request
                body.
              </p>
            </div>
          </div>
        </section>
      </div>

      <BillingActions plans={billing.plans} providers={billing.providers} />
    </div>
  );
}
