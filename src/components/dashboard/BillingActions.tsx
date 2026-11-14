'use client';

import { Bitcoin, CreditCard, Loader2 } from 'lucide-react';
import { useActionState, useState } from 'react';
import {
  startCheckoutAction,
  type CheckoutActionState,
} from '@/app/dashboard/actions';
import type { BillingPlan, BillingResponse } from '@/lib/account';
import { formatMoney, formatNumber } from '@/lib/format';

const INITIAL: CheckoutActionState = {};

const FEATURES: Record<string, string[]> = {
  growth: [
    '100,000 identifications / month',
    'WASM steal-time + GPU shader benchmarks',
    'Cross-realm and worker-spoof checks',
    'Canvas farbling + WebGL bridge traps',
    '30-day identity graph retention',
  ],
  scale: [
    '1,000,000 identifications / month',
    'Polars kinematic biometrics engine',
    'TCP SYN TTL + MSS wire verification',
    'WebGPU subgroup + atomic contention probe',
    '1-year identity graph retention',
  ],
};

function PlanCard({
  plan,
  interval,
  providers,
  pending,
  highlighted,
  formAction,
}: {
  plan: BillingPlan;
  interval: 'monthly' | 'annual';
  providers: BillingResponse['providers'];
  pending: boolean;
  highlighted: boolean;
  formAction: (formData: FormData) => void;
}) {
  const cents = interval === 'annual' ? plan.annualCents : plan.monthlyCents;
  const monthlyEquivalent =
    interval === 'annual' ? Math.round(cents / 12) : cents;
  const airwallexPriceReady =
    providers.airwallexPrices?.[`${plan.key}:${interval}`] ?? false;
  const airwallexReady = providers.airwallex && airwallexPriceReady;
  const cryptoReady = providers.nowpayments;

  return (
    <article
      className={`card-pricing flex flex-col justify-between ${
        highlighted ? 'shadow-level-2 ring-1 ring-hairline relative' : ''
      }`}
    >
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold text-ink">{plan.name}</h3>
          {highlighted ? (
            <span className="badge-info text-[10px]">
              FEATURED
            </span>
          ) : null}
        </div>

        <div className="metric mt-3 text-3xl font-semibold text-ink">
          {formatMoney(monthlyEquivalent)}
          <span className="ml-1 text-xs font-normal text-ink-muted">/ month</span>
        </div>
        <p className="mt-1 font-mono text-[11px] text-ink-muted">
          {interval === 'annual'
            ? `${formatMoney(cents)} billed annually`
            : 'billed monthly'}
          {plan.included === null
            ? ' · unlimited'
            : ` · ${formatNumber(plan.included)} included`}
        </p>
        <p className="mt-1 font-mono text-[11px] text-ink-muted">
          {plan.overagePer10kCents > 0
            ? `${formatMoney(plan.overagePer10kCents)} per additional 10,000`
            : 'hard cap on the free tier'}
        </p>

        <ul className="mt-4 flex-1 space-y-2 text-xs leading-relaxed text-ink-body">
          {(FEATURES[plan.key] ?? []).map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 space-y-2.5">
        <form action={formAction}>
          <input type="hidden" name="plan" value={plan.key} />
          <input type="hidden" name="interval" value={interval} />
          <input type="hidden" name="provider" value="airwallex" />
          <button
            type="submit"
            disabled={pending || !airwallexReady}
            title={
              airwallexReady
                ? `Pay ${formatMoney(cents)} with Airwallex`
                : providers.airwallex
                  ? `No Airwallex ${interval} price is configured for ${plan.name}`
                  : 'Airwallex is not configured on this deployment'
            }
            className="button-primary w-full !text-xs !py-2.5 !min-h-0"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Pay by card · Airwallex
          </button>
        </form>

        <form action={formAction}>
          <input type="hidden" name="plan" value={plan.key} />
          <input type="hidden" name="interval" value={interval} />
          <input type="hidden" name="provider" value="nowpayments" />
          <button
            type="submit"
            disabled={pending || !cryptoReady}
            title={
              cryptoReady
                ? `Pay ${formatMoney(cents)} in crypto via NOWPayments`
                : 'NOWPayments is not configured on this deployment'
            }
            className="button-secondary w-full !text-xs !py-2.5 !min-h-0"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Bitcoin className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Pay in crypto · NOWPayments
          </button>
        </form>
      </div>

      <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink-muted">
        {interval === 'annual'
          ? 'Annual term is prepaid for crypto; card renews automatically.'
          : 'Crypto is a prepaid 30-day term. Card renews automatically.'}
      </p>
    </article>
  );
}

export default function BillingActions({
  plans,
  providers,
}: {
  plans: BillingPlan[];
  providers: BillingResponse['providers'];
}) {
  const [interval, setInterval] = useState<'monthly' | 'annual'>('monthly');
  const [state, formAction, pending] = useActionState(
    startCheckoutAction,
    INITIAL,
  );

  const purchasable = plans.filter(
    (plan) => plan.key === 'growth' || plan.key === 'scale',
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">Upgrade your plan</h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            Paid plans remove the hard cap and add overage billing.
          </p>
        </div>
        <div
          className="inline-flex items-center rounded-[4px] border border-hairline bg-surface-2 p-1 font-mono text-xs"
          role="group"
          aria-label="Billing interval"
        >
          <button
            type="button"
            onClick={() => setInterval('monthly')}
            aria-pressed={interval === 'monthly'}
            className={`rounded-[4px] px-3 py-1.5 font-medium transition ${
              interval === 'monthly'
                ? 'bg-canvas text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setInterval('annual')}
            aria-pressed={interval === 'annual'}
            className={`flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 font-medium transition ${
              interval === 'annual'
                ? 'bg-canvas text-accent-green shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Annual
            <span className="rounded-[2px] bg-accent-green/15 px-1 text-[10px] text-accent-green">
              −20%
            </span>
          </button>
        </div>
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-[4px] border border-accent-red/30 bg-accent-red/10 px-3.5 py-2 text-xs text-accent-red"
        >
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {purchasable.map((plan) => (
          <PlanCard
            key={plan.key}
            plan={plan}
            interval={interval}
            providers={providers}
            pending={pending}
            highlighted={plan.key === 'scale'}
            formAction={formAction}
          />
        ))}
      </div>

      {!providers.airwallex && !providers.nowpayments ? (
        <p className="rounded-[4px] border border-accent-yellow/30 bg-accent-yellow/10 px-3.5 py-2 font-mono text-[11px] leading-relaxed text-accent-yellow">
          No payment provider is configured. Set AIRWALLEX_* or NOWPAYMENTS_*
          on the backend to enable hosted checkout.
        </p>
      ) : null}
      {providers.airwallex && !providers.airwallexWebhooks ? (
        <p className="rounded-[4px] border border-accent-yellow/30 bg-accent-yellow/10 px-3.5 py-2 font-mono text-[11px] leading-relaxed text-accent-yellow">
          AIRWALLEX_WEBHOOK_SECRET is missing. Checkout will open, but plans
          will not activate until the signed webhook is accepted.
        </p>
      ) : null}
      {providers.nowpayments && !providers.nowpaymentsWebhooks ? (
        <p className="rounded-[4px] border border-accent-yellow/30 bg-accent-yellow/10 px-3.5 py-2 font-mono text-[11px] leading-relaxed text-accent-yellow">
          NOWPAYMENTS_IPN_SECRET is missing. Invoices will open, but crypto
          payments will not activate a plan.
        </p>
      ) : null}
    </div>
  );
}
