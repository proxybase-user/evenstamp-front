'use client';

import { Check } from 'lucide-react';
import { useId, useState } from 'react';
import SectionFrame from './SectionFrame';
import {
  estimateCloudCost,
  MONTHLY_EVENT_MAX,
  MONTHLY_EVENT_MIN,
  PRICING_TIERS,
  type BillingCycle,
  type PricingTier,
} from '@/lib/site-data';

const LOG_MIN = Math.log10(MONTHLY_EVENT_MIN);
const LOG_MAX = Math.log10(MONTHLY_EVENT_MAX);

function sliderToEvents(slider: number): number {
  const raw = 10 ** (LOG_MIN + (slider / 100) * (LOG_MAX - LOG_MIN));
  return Math.max(
    MONTHLY_EVENT_MIN,
    Math.round(raw / 1_000) * 1_000,
  );
}

const numberFormat = new Intl.NumberFormat('en-US');

function accentClasses(tier: PricingTier) {
  switch (tier.accent) {
    case 'cyan':
      return { label: 'text-cyan-400', border: 'border-white/[0.07]' };
    case 'emerald':
      return { label: 'text-emerald-400', border: 'border-emerald-500/45' };
    case 'amber':
      return { label: 'text-amber-400', border: 'border-white/[0.07]' };
    default:
      return { label: 'text-ink-muted', border: 'border-white/[0.07]' };
  }
}

export default function PricingSection() {
  const [billing, setBilling] = useState<BillingCycle>('annual');
  const [slider, setSlider] = useState(50);
  const sliderId = useId();

  const monthlyEvents = sliderToEvents(slider);
  const estimate = estimateCloudCost(monthlyEvents, billing);

  return (
    <SectionFrame id="pricing">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="eyebrow">// Transparent unit economics</div>
          <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-4xl">
            Cloud API or sovereign self-hosted binary.
          </h2>
          <p className="max-w-[60ch] text-base leading-relaxed text-ink-secondary">
            Start free at 25,000 identifications. Scale without a platform fee.
            Move the entire engine into your own VPC when regulatory or
            residency requirements demand it.
          </p>
        </div>

        <div
          className="inline-flex shrink-0 items-center rounded-lg border border-white/[0.08] bg-surface-1 p-1 font-mono text-xs"
          role="group"
          aria-label="Billing cycle"
        >
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            aria-pressed={billing === 'monthly'}
            className={`rounded-md px-3.5 py-1.5 transition ${
              billing === 'monthly'
                ? 'bg-surface-3 text-ink-primary'
                : 'text-ink-secondary hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling('annual')}
            aria-pressed={billing === 'annual'}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 transition ${
              billing === 'annual'
                ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                : 'text-ink-secondary hover:text-white'
            }`}
          >
            Annual
            <span className="text-[10px] text-emerald-400">−20%</span>
          </button>
        </div>
      </div>

      {/* Volume planner */}
      <div className="mt-10 rounded-xl border border-white/[0.07] bg-surface-1 p-6 shadow-specular lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <label
                htmlFor={sliderId}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted"
              >
                Monthly identifications
              </label>
              <output
                htmlFor={sliderId}
                className="metric font-mono text-2xl font-semibold text-ink-primary"
              >
                {numberFormat.format(monthlyEvents)}
              </output>
            </div>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={slider}
              onChange={(event) => setSlider(Number(event.target.value))}
              className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-emerald-500"
              aria-valuetext={`${numberFormat.format(monthlyEvents)} identifications per month`}
            />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-ink-muted">
              <span>{numberFormat.format(MONTHLY_EVENT_MIN)}</span>
              <span>{numberFormat.format(MONTHLY_EVENT_MAX)}</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-muted">
              Estimates use published overage rates. Annual billing discounts
              the base plan; overage remains usage-based. Taxes excluded.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-3 gap-3 rounded-lg border border-white/[0.06] bg-canvas p-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                Plan
              </div>
              <div className="mt-1 text-sm font-semibold text-ink-primary">
                {estimate.tier.name}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                Invoice
              </div>
              <div className="metric mt-1 text-xl font-bold text-emerald-400">
                ${numberFormat.format(Math.round(estimate.total))}
                <span className="ml-1 text-[10px] font-normal text-ink-muted">
                  /mo
                </span>
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                Effective
              </div>
              <div className="metric mt-1 text-xl font-bold text-cyan-400">
                ${estimate.perThousand.toFixed(2)}
                <span className="ml-1 text-[10px] font-normal text-ink-muted">
                  /1k
                </span>
              </div>
            </div>
            <div className="col-span-3 border-t border-white/[0.06] pt-3 font-mono text-[10px] leading-relaxed text-ink-muted">
              {estimate.overage > 0
                ? `Includes $${numberFormat.format(
                    Math.round(estimate.overage),
                  )} overage beyond ${numberFormat.format(
                    estimate.tier.included ?? 0,
                  )} included identifications.`
                : 'No overage at this volume.'}
            </div>
          </div>
        </div>
      </div>

      {/* Tier cards */}
      <div
        className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {PRICING_TIERS.map((tier) => {
          const accent = accentClasses(tier);
          const price =
            tier.name === 'Sovereign'
              ? tier.monthly
              : billing === 'annual'
                ? tier.annualMonthly
                : tier.monthly;
          return (
            <article
              key={tier.name}
              className={`relative flex flex-col justify-between gap-6 rounded-xl border bg-surface-1 p-6 shadow-specular ${
                tier.highlighted
                  ? 'border-emerald-500/45 shadow-[0_0_35px_rgba(16,185,129,0.1)]'
                  : accent.border
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.08em] ${accent.label}`}
                  >
                    {tier.name}
                  </span>
                  {tier.highlighted ? (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 font-mono text-[9px] text-emerald-300">
                      MOST POPULAR
                    </span>
                  ) : null}
                </div>

                <div>
                  <div className="metric text-3xl font-bold text-ink-primary">
                    ${price}
                    <span className="ml-1 text-sm font-normal text-ink-muted">
                      / month
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-ink-muted">
                    {tier.name === 'Sovereign'
                      ? 'billed annually'
                      : billing === 'annual' && price > 0
                        ? 'billed annually · save 20%'
                        : tier.included === null
                          ? 'unlimited identifications'
                          : `${numberFormat.format(tier.included)} included / month`}
                  </div>
                </div>

                <p className="min-h-[3rem] text-xs leading-relaxed text-ink-secondary">
                  {tier.tagline}
                </p>

                <div className="rounded-md border border-white/[0.06] bg-canvas px-3 py-2 font-mono text-[10px] text-ink-muted">
                  {tier.overage}
                </div>

                <ul className="space-y-2.5 pt-1 text-xs text-ink-secondary">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={
                  tier.name === 'Sovereign'
                    ? 'mailto:engineering@evenstamp.com?subject=Evenstamp%20Sovereign%20license'
                    : tier.name === 'Developer'
                      ? '/login?next=/dashboard'
                      : '/login?next=/dashboard/billing'
                }
                className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-xs font-semibold transition ${
                  tier.highlighted
                    ? 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400'
                    : 'border border-white/15 bg-white/[0.03] text-ink-primary hover:bg-white/[0.07]'
                }`}
              >
                {tier.cta}
              </a>
            </article>
          );
        })}
      </div>

      <p className="mt-6 font-mono text-[10px] text-ink-muted">
        Cloud plans include first-party proxy routes, ECDH P-256 envelopes,
        single-use nonces, and 99.9% uptime. Sovereign includes a 99.99% SLA and
        deployment review.
      </p>
    </SectionFrame>
  );
}
