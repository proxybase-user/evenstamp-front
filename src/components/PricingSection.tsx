'use client';

import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useId, useState } from 'react';
import SectionFrame from './SectionFrame';
import {
  estimateCloudCost,
  MONTHLY_EVENT_MAX,
  MONTHLY_EVENT_MIN,
  PRICING_TIERS,
  type BillingCycle,
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

export default function PricingSection() {
  const [billing, setBilling] = useState<BillingCycle>('annual');
  const [slider, setSlider] = useState(40);
  const sliderId = useId();

  const monthlyEvents = sliderToEvents(slider);
  const estimate = estimateCloudCost(monthlyEvents, billing);

  return (
    <SectionFrame id="pricing">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="eyebrow">// Simple, ROI-Positive Pricing</div>
          <h2 className="text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[44.8px] lg:leading-[46.6px]">
            If Evenstamp blocks just two fake trials or one chargeback a month, it pays for itself.
          </h2>
          <p className="max-w-[60ch] text-base leading-relaxed text-ink-body">
            Start with a 14-day full-featured trial. Cancel in one click anytime.
          </p>
        </div>

        {/* Billing cycle toggle */}
        <div
          className="inline-flex shrink-0 items-center rounded-[4px] border border-hairline bg-surface-2 p-1 font-mono text-xs"
          role="group"
          aria-label="Billing cycle"
        >
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            aria-pressed={billing === 'monthly'}
            className={`rounded-[4px] px-3.5 py-1.5 font-medium transition ${
              billing === 'monthly'
                ? 'bg-canvas text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling('annual')}
            aria-pressed={billing === 'annual'}
            className={`flex items-center gap-1.5 rounded-[4px] px-3.5 py-1.5 font-medium transition ${
              billing === 'annual'
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

      {/* 3 Main Pricing Cards */}
      <div
        className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {PRICING_TIERS.map((tier) => {
          const price =
            billing === 'annual'
              ? tier.annualMonthly
              : tier.monthly;
          const isFeatured = tier.highlighted;

          return (
            <article
              key={tier.name}
              className={`card-pricing flex flex-col justify-between gap-6 transition-all ${
                isFeatured
                  ? 'border-accent-green/50 shadow-level-2 ring-1 ring-accent-green/30 relative bg-surface-1'
                  : 'bg-surface-1 border-hairline'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-ink">
                    {tier.name}
                  </span>
                  {isFeatured ? (
                    <span className="rounded-[4px] border border-accent-green/40 bg-accent-green/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent-green">
                      MOST POPULAR
                    </span>
                  ) : null}
                </div>

                <div>
                  <div className="metric text-3xl font-semibold text-ink">
                    ${price}
                    <span className="ml-1 text-sm font-normal text-ink-muted">
                      / month
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-ink-muted">
                    {billing === 'annual'
                      ? 'billed annually · save 20%'
                      : 'billed monthly'}
                  </div>
                </div>

                <div className="rounded-[4px] border border-hairline bg-surface-2 px-3 py-1.5 font-mono text-xs font-medium text-ink">
                  {tier.name === 'Starter'
                    ? 'Up to 50,000 device checks / mo'
                    : tier.name === 'Growth'
                      ? 'Up to 250,000 device checks / mo'
                      : 'Unlimited checks (Self-Hosted) or 1M+ Cloud'}
                </div>

                <p className="min-h-[2.75rem] text-sm leading-relaxed text-ink-body">
                  {tier.tagline}
                </p>

                <div className="border-t border-hairline pt-3">
                  <div className="text-[11px] font-mono text-ink-muted mb-2">
                    {tier.overage}
                  </div>
                  <ul className="space-y-2.5 text-sm text-ink-body">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent-green"
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/login?next=/dashboard/billing"
                  className={
                    isFeatured
                      ? 'button-primary w-full text-center justify-center'
                      : 'button-secondary w-full text-center justify-center'
                  }
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Small Sandbox Subtext Underneath Cards */}
      <div className="mt-8 text-center">
        <Link
          href="/login?next=/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted hover:text-accent-blue transition-colors"
        >
          Just testing locally? Grab a free Sandbox API key (1,000 checks/mo, development domains only) &rarr;
        </Link>
      </div>

      {/* Volume planner */}
      <div className="card-feature mt-12 !p-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <label
                htmlFor={sliderId}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted"
              >
                Estimate by monthly checks
              </label>
              <output
                htmlFor={sliderId}
                className="metric font-mono text-2xl font-semibold text-ink"
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
              className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-3 accent-primary"
              aria-valuetext={`${numberFormat.format(monthlyEvents)} checks per month`}
            />
            <div className="mt-2 flex justify-between font-mono text-[11px] text-ink-muted">
              <span>{numberFormat.format(MONTHLY_EVENT_MIN)}</span>
              <span>{numberFormat.format(MONTHLY_EVENT_MAX)}</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-muted">
              All plans include cross-browser hardware correlation, instant fraud scoring,
              first-party domain routing, and automatic 14-day full trials.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-3 gap-3 rounded-[8px] border border-hairline bg-surface-2 p-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                Best Plan
              </div>
              <div className="mt-1 text-sm font-semibold text-ink">
                {estimate.tier.name}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                Invoice
              </div>
              <div className="metric mt-1 text-xl font-semibold text-accent-green">
                ${numberFormat.format(Math.round(estimate.total))}
                <span className="ml-1 text-[10px] font-normal text-ink-muted">
                  /mo
                </span>
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                Per 1k checks
              </div>
              <div className="metric mt-1 text-xl font-semibold text-accent-blue">
                ${estimate.perThousand.toFixed(2)}
                <span className="ml-1 text-[10px] font-normal text-ink-muted">
                  /1k
                </span>
              </div>
            </div>
            <div className="col-span-3 border-t border-hairline pt-3 font-mono text-[11px] leading-relaxed text-ink-muted">
              {estimate.overage > 0
                ? `Includes $${numberFormat.format(
                    Math.round(estimate.overage),
                  )} estimated overage beyond ${numberFormat.format(
                    estimate.tier.included ?? 0,
                  )} base checks.`
                : 'Fully covered within base plan quota.'}
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
