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
      className={`flex flex-col rounded-xl border bg-surface-1 p-5 ${
        highlighted
          ? 'border-emerald-500/45 shadow-[0_0_35px_rgba(16,185,129,0.1)]'
          : 'border-white/[0.07]'
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">{plan.name}</h3>
        {highlighted ? (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 font-mono text-[9px] text-emerald-300">
            MOST POPULAR
          </span>
        ) : null}
      </div>

      <div className="metric mt-3 text-3xl font-bold text-ink-primary">
        {formatMoney(monthlyEquivalent)}
        <span className="ml-1 text-xs font-normal text-ink-muted">/ month</span>
      </div>
      <p className="mt-1 font-mono text-[10px] text-ink-muted">
        {interval === 'annual'
          ? `${formatMoney(cents)} billed annually`
          : 'billed monthly'}
        {plan.included === null
          ? ' · unlimited'
          : ` · ${formatNumber(plan.included)} included`}
      </p>
      <p className="mt-1 font-mono text-[10px] text-ink-muted">
        {plan.overagePer10kCents > 0
          ? `${formatMoney(plan.overagePer10kCents)} per additional 10,000`
          : 'hard cap on the free tier'}
      </p>

      <ul className="mt-4 flex-1 space-y-1.5 text-[11px] leading-relaxed text-ink-secondary">
        {(FEATURES[plan.key] ?? []).map((feature) => (
          <li key={feature} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-2">
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
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              highlighted
                ? 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400'
                : 'border border-white/15 bg-white/[0.03] text-ink-primary hover:bg-white/[0.07]'
            }`}
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
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-50"
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

      <p className="mt-2 font-mono text-[9px] leading-relaxed text-ink-muted">
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
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Upgrade your plan</h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            Paid plans remove the hard cap and add overage billing.
          </p>
        </div>
        <div
          className="inline-flex items-center rounded-lg border border-white/[0.08] bg-surface-1 p-1 font-mono text-xs"
          role="group"
          aria-label="Billing interval"
        >
          <button
            type="button"
            onClick={() => setInterval('monthly')}
            aria-pressed={interval === 'monthly'}
            className={`rounded-md px-3 py-1.5 transition ${
              interval === 'monthly'
                ? 'bg-surface-3 text-ink-primary'
                : 'text-ink-secondary hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setInterval('annual')}
            aria-pressed={interval === 'annual'}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
              interval === 'annual'
                ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                : 'text-ink-secondary hover:text-white'
            }`}
          >
            Annual
            <span className="text-[10px] text-emerald-400">−20%</span>
          </button>
        </div>
      </div>

      {state.error ? (
        <p
          role="alert"
          className="mt-4 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200"
        >
          {state.error}
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
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
        <p className="mt-4 rounded-md border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2 font-mono text-[10px] leading-relaxed text-amber-200">
          No payment provider is configured. Set AIRWALLEX_* or NOWPAYMENTS_*
          on the backend to enable hosted checkout.
        </p>
      ) : null}
      {providers.airwallex && !providers.airwallexWebhooks ? (
        <p className="mt-2 rounded-md border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2 font-mono text-[10px] leading-relaxed text-amber-200">
          AIRWALLEX_WEBHOOK_SECRET is missing. Checkout will open, but plans
          will not activate until the signed webhook is accepted.
        </p>
      ) : null}
      {providers.nowpayments && !providers.nowpaymentsWebhooks ? (
        <p className="mt-2 rounded-md border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2 font-mono text-[10px] leading-relaxed text-amber-200">
          NOWPAYMENTS_IPN_SECRET is missing. Invoices will open, but crypto
          payments will not activate a plan.
        </p>
      ) : null}
    </div>
  );
}
