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
    question: 'Why not price per seat?',
    answer:
      'Fraud and security work is cross-functional. Per-seat pricing suppresses adoption and creates procurement friction, so every plan includes unlimited team access.',
  },
  {
    question: 'Why is there a hard cap on Developer?',
    answer:
      'Predictable free-tier cost and a clean upgrade trigger. Hobby projects never receive a surprise overage bill; Growth removes the cap and bills overage per 10,000 identifications.',
  },
  {
    question: 'How do card subscriptions work?',
    answer:
      'Growth and Scale use an Airwallex hosted billing checkout in subscription mode. After checkout, Airwallex creates the subscription and payment method, and a signed webhook activates the plan in the engine.',
  },
  {
    question: 'How do crypto payments work?',
    answer:
      'NOWPayments issues a hosted crypto invoice for one monthly or annual term. A confirmed payment extends the account period by that term. Renewal is a new invoice; there is no automatic crypto debit.',
  },
  {
    question: 'Why is Sovereign billed annually?',
    answer:
      'Enterprise procurement and deployment review require a committed relationship. Monthly self-serve Sovereign would be a support and compliance risk.',
  },
  {
    question: 'What happens above 10 million identifications?',
    answer:
      'Scale overage applies. A custom committed-use contract is available with a volume discount and a dedicated support channel.',
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
            <h1 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">
              Transparent unit economics, no procurement cliff.
            </h1>
            <p className="text-base leading-relaxed text-ink-secondary">
              Evenstamp runs as one compiled Rust binary with embedded SQLite
              and in-memory Polars. That footprint supports 85–94% gross margins
              while pricing 60%+ below incumbent list prices. Start free at
              25,000 identifications; upgrade when the free cap actually binds.
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-xs text-ink-secondary">
              {[
                'No credit card on Developer',
                'Linear, legible overage',
                'Annual saves 20%',
                'Self-hosted option',
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
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
            <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Every plan, in one table.
            </h2>
            <p className="text-sm leading-relaxed text-ink-secondary">
              Cloud plans include the first-party proxy routes, ECDH P-256
              envelopes, single-use nonces, and 99.9% availability. Sovereign
              adds a 99.99% SLA and a deployment review.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-xl border border-white/[0.07]">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="border-b border-white/[0.07] bg-surface-2 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Tier</th>
                  <th className="px-4 py-3 font-medium">Target</th>
                  <th className="px-4 py-3 font-medium">Base price</th>
                  <th className="px-4 py-3 font-medium">Included / month</th>
                  <th className="px-4 py-3 font-medium">Overage</th>
                  <th className="px-4 py-3 font-medium">Core capabilities</th>
                </tr>
              </thead>
              <tbody>
                {TIER_MATRIX.map((row) => (
                  <tr
                    key={row.tier}
                    className="border-b border-white/[0.05] last:border-b-0"
                  >
                    <td className="px-4 py-3 font-semibold text-ink-primary">
                      {row.tier}
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{row.target}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-ink-primary">
                      {row.price}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-ink-secondary">
                      {row.included}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-ink-secondary">
                      {row.overage}
                    </td>
                    <td className="px-4 py-3 leading-relaxed text-ink-secondary">
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
            <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Card subscription or crypto prepaid term.
            </h2>
            <p className="text-sm leading-relaxed text-ink-secondary">
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
                  className="surface-card rounded-xl p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10">
                      <Icon className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{path.title}</h3>
                      <p className="font-mono text-[10px] text-ink-muted">
                        {path.provider}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
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
                className="surface-card rounded-xl p-5"
              >
                <h3 className="text-sm font-semibold">{item.question}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/login?next=/dashboard/billing"
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
              Start free, upgrade later
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <a
              href="mailto:engineering@evenstamp.com?subject=Evenstamp%20Sovereign%20license"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-ink-primary transition hover:bg-white/[0.07]"
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
