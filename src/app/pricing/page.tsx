import type { Metadata } from 'next';
import { ArrowRight, Bitcoin, Check, CreditCard } from 'lucide-react';
import CtaSection from '@/components/CtaSection';
import PricingSection from '@/components/PricingSection';
import SectionFrame from '@/components/SectionFrame';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Transparent Evenstamp pricing: a free Developer tier with 25,000 identifications, Growth at $39/month, Scale at $199/month, and a sovereign self-hosted license. Card subscriptions via Airwallex, crypto via NOWPayments.',
  keywords: [
    'device fingerprinting pricing',
    'bot detection pricing',
    'fraud prevention pricing',
    'Airwallex subscription',
    'crypto payments',
    'self-hosted fingerprinting',
  ],
  alternates: { canonical: 'https://evenstamp.com/pricing' },
};

const TIER_MATRIX = [
  {
    tier: 'Developer',
    target: 'Indie, POC, staging',
    price: '$0',
    included: '25,000 / month',
    overage: 'Hard cap',
    capabilities:
      'BrowserID, fuzzy DeviceID, VM/headless checks, 7-day retention',
  },
  {
    tier: 'Growth',
    target: 'Startups, SaaS',
    price: '$39/mo · $31/mo annual',
    included: '100,000 / month',
    overage: '$0.80 / 10k',
    capabilities:
      'WASM steal-time, shader benchmarks, cross-realm checks, canvas traps, 30-day retention, webhooks',
  },
  {
    tier: 'Scale',
    target: 'Fintech, e-commerce, high traffic',
    price: '$199/mo · $159/mo annual',
    included: '1,000,000 / month',
    overage: '$0.50 / 10k',
    capabilities:
      'Polars biometrics, TCP TTL/MSS wire verification, WebGPU probes, CDP traps, first-party CNAME, 1-year retention',
  },
  {
    tier: 'Sovereign',
    target: 'Regulated enterprise, crypto, iGaming',
    price: '$999/mo billed annually',
    included: 'Unlimited (4 vCPU nodes)',
    overage: '$199/mo per extra node',
    capabilities:
      'Single-binary Rust + SQLite, AF_PACKET sniffer, zero telemetry egress, raw 8D vector export, 99.99% SLA',
  },
];

const PRICING_FAQ = [
  {
    question: 'How do you charge less than Fingerprint Pro?',
    answer:
      'We run one Rust binary backed by SQLite and in-memory Polars. There is no Kafka, no Cassandra, and no multi-tenant Elasticsearch cluster to maintain. Those architectural choices remove 80%+ of the operational overhead incumbent pricing must amortize.',
  },
  {
    question: 'What happens when I hit the Developer limit?',
    answer:
      'The engine returns a 429 HardCapExceeded error and rejects new challenges until the first of the next UTC month. Paid plans never hard-cap: overage is billed linearly at the published per-10k rate.',
  },
  {
    question: 'How does sovereign licensing work?',
    answer:
      'You receive access to the ghcr.io/evenstamp/engine container images, license verification keys, and architecture reviews. The binary runs entirely inside your infrastructure with zero telemetry egress. You can run SQLite locally or mount a network volume.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Card subscriptions (Visa, Mastercard, Amex) run through Airwallex in compliant recurring subscription mode. Prepaid terms (monthly or annual) can also be settled via NOWPayments in BTC, ETH, USDT, USDC, and other major cryptocurrencies.',
  },
];

const BILLING_PATHS = [
  {
    icon: CreditCard,
    title: 'Card subscription',
    provider: 'Airwallex',
    detail:
      'Hosted checkout in SUBSCRIPTION mode. The card is stored by Airwallex, renews automatically, and the engine receives a signed billing_checkout.completed webhook before activating the plan.',
  },
  {
    icon: Bitcoin,
    title: 'Crypto prepaid term',
    provider: 'NOWPayments',
    detail:
      'Hosted invoice for one monthly or annual term. A confirmed payment extends the plan period; renewal is a fresh invoice, so there is no recurring crypto debit or stored wallet consent.',
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <SectionFrame id="pricing-hero">
          <div className="max-w-3xl space-y-5">
            <div className="eyebrow">// Pricing</div>
            <h1 className="text-3xl font-semibold leading-[1.1] sm:text-5xl lg:text-[56px] text-ink">
              Transparent unit economics, no procurement cliff.
            </h1>
            <p className="text-base leading-relaxed text-ink-body">
              Evenstamp runs as one compiled Rust binary with embedded SQLite
              and in-memory Polars. That footprint supports 85–94% gross margins
              while pricing 60%+ below incumbent list prices. Start free at
              25,000 identifications; upgrade when the free cap actually binds.
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-xs text-ink-body">
              {[
                'No credit card on Developer',
                'Linear, legible overage',
                'Annual saves 20%',
                'Self-hosted option',
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
              Cloud plans include first-party proxy routes, ECDH P-256
              envelopes, single-use nonces, and 99.9% availability. Sovereign
              adds a 99.99% SLA and a deployment review.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-[8px] border border-hairline bg-surface-1">
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
        </SectionFrame>

        <SectionFrame id="billing">
          <div className="max-w-3xl space-y-4">
            <div className="eyebrow">// Billing paths</div>
            <h2 className="text-2xl font-semibold sm:text-3xl text-ink">
              Card subscription or crypto prepaid term.
            </h2>
            <p className="text-sm leading-relaxed text-ink-body">
              Provider credentials stay in the Rust engine. The browser only
              receives a hosted checkout URL.
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
              Start free, upgrade later
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="mailto:engineering@evenstamp.com?subject=Evenstamp%20Sovereign%20license"
              className="button-secondary"
            >
              Talk to engineering about Sovereign
            </a>
          </div>
        </SectionFrame>

        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
