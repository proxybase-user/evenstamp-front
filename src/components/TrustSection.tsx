import { DatabaseZap, Fingerprint, Scale } from 'lucide-react';
import SectionFrame from './SectionFrame';

const PILLARS = [
  {
    icon: Fingerprint,
    title: 'Privacy by default',
    copy: 'The identity database stores only a /24 or /48 network prefix, never the full client IP; ephemeral challenges bind to a one-way HMAC of the IP. Raw keystrokes are never collected; behavior uses key classes and timing. Full payload retention is off unless you explicitly enable it.',
  },
  {
    icon: DatabaseZap,
    title: 'Data residency',
    copy: 'The sovereign binary runs inside your VPC with zero telemetry egress. SQLite is a local file. You control backups, retention windows, and deletion. Managed cloud is available when you want no operations burden.',
  },
  {
    icon: Scale,
    title: 'Responsible use',
    copy: 'Evenstamp is built for fraud prevention, account security, and bot mitigation. Deploy it with a lawful basis, a privacy notice, and a deletion path. It is not a tool for surveillance or discriminatory pricing.',
  },
];

export default function TrustSection() {
  return (
    <SectionFrame id="trust">
      <div className="max-w-3xl space-y-4">
        <div className="eyebrow">// Trust &amp; operations</div>
        <h2 className="text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[44.8px] lg:leading-[46.6px]">
          Forensic capability without an uncontrolled data footprint.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-body">
          Device fingerprinting is personal data in most jurisdictions. The
          architecture treats that as a design constraint, not an afterthought.
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
