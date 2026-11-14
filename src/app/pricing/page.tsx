import type { Metadata } from 'next';
import { ArrowRight, Bitcoin, Check, CreditCard } from 'lucide-react';
import CtaSection from '@/components/CtaSection';
import PricingSection from '@/components/PricingSection';
import SectionFrame from '@/components/SectionFrame';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Pricing · Fraud & Abuse Protection',
  description:
    'Simple Evenstamp pricing: Starter at $29/mo, Growth at $79/mo, and Scale / Sovereign at $199/mo. 14-day free trial on all plans.',
  keywords: [
    'fraud protection pricing',
    'bot detection pricing',
    'device fingerprinting pricing',
    'stop multi-accounting',
    'promo abuse prevention',
    'self-hosted fraud engine',
  ],
  alternates: { canonical: 'https://evenstamp.com/pricing' },
};

const TIER_MATRIX = [
  {
    tier: 'Starter',
    target: 'SaaS tools, indie apps, e-commerce',
    price: '$29/mo · $23/mo annual',
    included: '50,000 / month',
    overage: '$0.80 / 10k',
    capabilities:
      'Cross-browser hardware Device ID, 0-100 fraud risk score, VPN and proxy unmasking, first-party proxy, webhooks',
  },
  {
    tier: 'Growth',
    target: 'High-traffic platforms, AI apps, marketplaces',
    price: '$79/mo · $63/mo annual',
    included: '250,000 / month',
    overage: '$0.50 / 10k',
    capabilities:
      'Everything in Starter, plus full 8-layer anti-detect traps, behavioral biometrics (mouse, scroll, touch), cloud VM detection, custom score thresholds, priority support',
  },
  {
    tier: 'Scale / Sovereign',
    target: 'Strict compliance, high volume, enterprise',
    price: '$199/mo · $159/mo annual',
    included: '1,000,000 Cloud or Unlimited Self-Hosted',
    overage: '$0.30 / 10k Cloud overage',
    capabilities:
      'Everything in Growth, plus a dedicated single-file private Docker deployment, raw signal weights, no external telemetry egress, SLA and onboarding',
  },
  {
    tier: 'Sandbox (Dev)',
    target: 'Localhost testing & development',
    price: '$0',
    included: '1,000 / month',
    overage: 'Hard cap on dev domains',
    capabilities:
      'Test API keys for local environment, staging proofs of concept, sample anomaly payloads',
  },
];

const PRICING_FAQ = [
  {
    question: 'How does the 14-day free trial work?',
    answer:
      'Every paid plan includes a 14-day trial with live device checks, risk scoring, and dashboard analytics. Cancel in one click before the trial ends and you will not be billed.',
  },
  {
    question: 'How do you charge less than Fingerprint Pro ($99+/mo)?',
    answer:
      'The engine is written in Rust, backed by embedded SQLite and in-memory analytics. We do not run large multi-tenant database clusters, so the infrastructure savings go into the price.',
  },
  {
    question: 'How does the Self-Hosted Sovereign option work?',
    answer:
      'The $199/mo Scale plan includes a single-binary Docker container you can run inside your own VPC or on bare metal. Telemetry stays on your infrastructure, which helps with GDPR, HIPAA, and PCI requirements.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Credit cards (Visa, Mastercard, Amex) run securely through Airwallex recurring subscriptions. We also support prepaid terms via NOWPayments in BTC, ETH, USDT, USDC, and other major cryptocurrencies.',
  },
];

const BILLING_PATHS = [
  {
    icon: CreditCard,
    title: 'Card subscription',
    provider: 'Airwallex Hosted Checkout',
    detail:
      'Recurring monthly or annual billing. Automatic invoices, receipts, and one-click plan management.',
  },
  {
    icon: Bitcoin,
    title: 'Crypto prepaid term',
    provider: 'NOWPayments Invoice',
    detail:
      'Prepay monthly or annually in BTC, ETH, USDT, USDC, or other major cryptocurrencies. No recurring wallet debit.',
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <SectionFrame id="pricing-hero">
          <div className="max-w-3xl space-y-5">
            <div className="eyebrow">// Simple pricing</div>
            <h1 className="text-3xl font-semibold leading-[1.1] sm:text-5xl lg:text-[56px] text-ink">
              If Evenstamp blocks two fake trials or one chargeback a month, it pays for itself.
            </h1>
            <p className="text-base leading-relaxed text-ink-body">
              Start with a 14-day trial. Protect your signups, checkout flows, and promo codes from multi-accounters and bot farms, with published overage rates and no platform penalties.
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-xs text-ink-body">
              {[
                '14-day free trial on all plans',
                'Cancel anytime in one click',
                'Annual billing saves 20%',
                'Self-hosted VPC option included',
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-accent-green" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </SectionFrame>

        <PricingSection />

        <SectionFrame id="tier-matrix">
          <div className="max-w-3xl space-y-4">
            <div className="eyebrow">// Full tier matrix</div>
            <h2 className="text-2xl font-semibold sm:text-3xl text-ink">
              Every plan, in one table.
            </h2>
            <p className="text-sm leading-relaxed text-ink-body">
              All plans include cross-browser hardware matching, fraud risk scores, and first-party routing that survives adblockers.
            </p>
          </div>

          <div className="mt-8">
            <div className="mb-2 text-right md:hidden font-mono text-[11px] text-accent-blue flex items-center justify-end gap-1">
              <span>Swipe to compare</span>
            </div>
            <div className="overflow-x-auto rounded-[8px] border border-hairline bg-surface-1">
              <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="border-b border-hairline bg-surface-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Tier</th>
                  <th className="px-5 py-3.5 font-medium">Target</th>
                  <th className="px-5 py-3.5 font-medium">Base price</th>
                  <th className="px-5 py-3.5 font-medium">Included / month</th>
                  <th className="px-5 py-3.5 font-medium">Overage</th>
                  <th className="px-5 py-3.5 font-medium">Core capabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {TIER_MATRIX.map((row) => (
                  <tr
                    key={row.tier}
                    className="transition-colors hover:bg-surface-2/60"
                  >
                    <td className="px-5 py-4 font-semibold text-ink">
                      {row.tier}
                    </td>
                    <td className="px-5 py-4 text-ink-body">{row.target}</td>
                    <td className="px-5 py-4 font-mono text-[12px] text-ink font-medium">
                      {row.price}
                    </td>
                    <td className="px-5 py-4 font-mono text-[12px] text-ink-body">
                      {row.included}
                    </td>
                    <td className="px-5 py-4 font-mono text-[12px] text-ink-body">
                      {row.overage}
                    </td>
                    <td className="px-5 py-4 leading-relaxed text-ink-body">
                      {row.capabilities}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionFrame>

        <SectionFrame id="billing">
          <div className="max-w-3xl space-y-4">
            <div className="eyebrow">// Billing paths</div>
            <h2 className="text-2xl font-semibold sm:text-3xl text-ink">
              Card subscription or crypto prepaid term.
            </h2>
            <p className="text-sm leading-relaxed text-ink-body">
              Billing is monthly or annual, with no setup fee and no lock-in.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {BILLING_PATHS.map((path) => {
              const Icon = path.icon;
              return (
                <article
                  key={path.title}
                  className="card-feature !p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-hairline bg-surface-2 text-accent-green">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-ink">{path.title}</h3>
                      <p className="font-mono text-[11px] text-ink-muted">
                        {path.provider}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-body">
                    {path.detail}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {PRICING_FAQ.map((item) => (
              <article
                key={item.question}
                className="card-feature !p-6"
              >
                <h3 className="text-base font-semibold text-ink">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-body">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="/login?next=/dashboard/billing"
              className="button-primary"
            >
              Start 14-Day Free Trial
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="mailto:engineering@evenstamp.com?subject=Evenstamp%20Sovereign%20license"
              className="button-secondary"
            >
              Talk to us about Sovereign VPC
            </a>
          </div>
        </SectionFrame>

        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
