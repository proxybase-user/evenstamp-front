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
        <div className="eyebrow">// Trust & operations</div>
        <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-4xl">
          Forensic capability without an uncontrolled data footprint.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-secondary">
          Device fingerprinting is personal data in most jurisdictions. The
          architecture treats that as a design constraint, not an afterthought.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <article
              key={pillar.title}
              className="surface-card space-y-3 rounded-xl p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.01em]">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-secondary">
                {pillar.copy}
              </p>
            </article>
          );
        })}
      </div>
    </SectionFrame>
  );
}
