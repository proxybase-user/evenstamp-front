import { ArrowRight, Check } from 'lucide-react';

const ASSURANCES = [
  '25,000 free identifications every month',
  'No credit card for the Developer tier',
  'Self-host from one container',
];

export default function CtaSection() {
  return (
    <section id="get-started" className="border-t border-white/[0.07] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border border-emerald-500/35 bg-surface-1 p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] sm:p-12">
          <div
            className="grid-backdrop pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="space-y-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-emerald-400">
                // Production access
              </div>
              <h2 className="max-w-[22ch] text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl">
                Stop trusting the User-Agent.
              </h2>
              <p className="max-w-[56ch] text-base leading-relaxed text-ink-secondary">
                Start with the free developer tier, run the integration tests
                against the real engine, then decide whether the managed edge or
                the sovereign binary fits your architecture.
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs text-ink-secondary">
                {ASSURANCES.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check
                      className="h-3.5 w-3.5 text-emerald-400"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="/login?next=/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-emerald-glow transition hover:bg-emerald-400"
              >
                Create your account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-ink-primary transition hover:bg-white/[0.07]"
              >
                Compare plans
              </a>
              <a
                href="mailto:engineering@evenstamp.com?subject=Evenstamp%20architecture%20review"
                className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2 font-mono text-[11px] text-ink-muted transition hover:text-ink-primary"
              >
                Book a 30-minute architecture review
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
