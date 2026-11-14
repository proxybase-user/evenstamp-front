import { DatabaseZap, Fingerprint, Scale } from 'lucide-react';
import SectionFrame from './SectionFrame';

const PILLARS = [
  {
    icon: Fingerprint,
    title: 'Privacy and GDPR compliance',
    copy: 'Identity graphs stay isolated, encrypted, and pseudonymized. We do not sell, rent, or cross-broker visitor telemetry to ad-tech networks.',
  },
  {
    icon: DatabaseZap,
    title: 'Data residency control',
    copy: 'Use managed cloud hosting, or run the single-file container inside your own VPC with no external network egress.',
  },
  {
    icon: Scale,
    title: 'Lawful abuse defense',
    copy: 'Built to stop promo abuse, fake accounts, and credential stuffing. The evidence supports a GDPR Article 6(1)(f) legitimate-interest assessment.',
  },
];

export default function TrustSection() {
  return (
    <SectionFrame id="trust">
      <div className="max-w-3xl space-y-4">
        <div className="eyebrow">// Privacy &amp; Trust</div>
        <h2 className="text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[44.8px] lg:leading-[46.6px]">
          Fraud defense without the privacy liabilities.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-body">
          Your customer data stays yours. Evenstamp does not track visitors across
          unrelated sites, broker ad profiles, or pool identity graphs.
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
