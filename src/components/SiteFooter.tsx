import { ShieldCheck } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-hairline bg-surface-2">
                <ShieldCheck
                  className="h-4 w-4 text-accent-green"
                  aria-hidden="true"
                />
              </span>
              <span className="text-[17px] font-semibold tracking-tight text-ink">
                evenstamp
                <span className="font-mono text-sm text-accent-green">.com</span>
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ink-body">
              Cryptographic precision and forensic telemetry. One Rust binary,
              one sovereign SQLite file, four physical layers.
            </p>
            <p className="font-mono text-[11px] text-ink-muted">
              Engine v2.4 · MIT reference implementation
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={[
              { label: 'Architecture', href: '/#architecture' },
              { label: 'Detection layers', href: '/#detection' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Integration', href: '/#integration' },
              { label: 'Sign in', href: '/login' },
            ]}
          />
          <FooterColumn
            title="Engineering"
            links={[
              { label: 'Live playground', href: 'https://m.evenstamp.com' },
              { label: 'Self-hosted binary', href: '/pricing' },
              { label: 'Edge header contract', href: '/#integration' },
              { label: 'Identity weights', href: '/#architecture' },
              { label: 'Anomaly taxonomy', href: '/#detection' },
            ]}
          />
          <FooterColumn
            title="Trust"
            links={[
              { label: 'Privacy & GDPR', href: '/privacy' },
              { label: 'Data residency', href: '/#trust' },
              { label: 'Security posture', href: '/#trust' },
              { label: 'Responsible use', href: '/#trust' },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 font-mono text-[11px] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Evenstamp Inc. Cryptographic device
            and kinematic intelligence.
          </p>
          <p className="flex items-center gap-2">
            <span
              className="status-dot animate-pulse-dot bg-accent-green"
              aria-hidden="true"
            />
            Built for lawful abuse prevention
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-ink-body transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
