import { DatabaseZap, Fingerprint, Scale } from 'lucide-react';
import SectionFrame from './SectionFrame';

const PILLARS = [
  {
    icon: Fingerprint,
    title: 'Privacy & GDPR Compliant',
    copy: 'Customer identity graphs remain completely isolated, encrypted, and pseudonymized. We never sell, rent, or cross-broker your visitor telemetry to ad-tech networks.',
  },
  {
    icon: DatabaseZap,
    title: '100% Data Residency Control',
    copy: 'Choose instant managed cloud hosting, or deploy our private single-file container directly inside your own VPC with zero external network egress.',
  },
  {
    icon: Scale,
    title: 'Lawful Abuse Defense',
    copy: 'Built specifically to stop promo abuse, fake accounts, and credential stuffing. Fully aligned with GDPR Article 6(1)(f) legitimate interest guidelines.',
  },
];

export default function TrustSection() {
  return (
    <SectionFrame id="trust">
      <div className="max-w-3xl space-y-4">
        <div className="eyebrow">// Privacy &amp; Trust</div>
        <h2 className="text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[44.8px] lg:leading-[46.6px]">
          Enterprise fraud defense without the privacy liabilities.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-body">
          Your customer data belongs entirely to you. Evenstamp does not track visitors
          across unrelated websites, broker ad profiles, or pool identity graphs.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <article
              key={pillar.title}
              className="card-feature space-y-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-hairline bg-surface-2 text-accent-green">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-ink">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-body">
                {pillar.copy}
              </p>
            </article>
          );
        })}
      </div>
    </SectionFrame>
  );
}
