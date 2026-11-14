import { ArrowRight, Check } from 'lucide-react';

const ASSURANCES = [
  '25,000 free identifications every month',
  'No credit card for the Developer tier',
  'Self-host from one sovereign container',
];

export default function CtaSection() {
  return (
    <section id="get-started" className="border-t border-hairline py-20 bg-canvas transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[8px] border border-hairline bg-surface-1 p-8 shadow-level-3 sm:p-12 transition-colors">
          <div
            className="grid-backdrop pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
          />
          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="space-y-4">
              <div className="eyebrow">// Production access</div>
              <h2 className="max-w-[22ch] text-3xl font-semibold leading-[1.1] sm:text-4xl text-ink">
                Stop trusting the User-Agent.
              </h2>
              <p className="max-w-[56ch] text-base leading-relaxed text-ink-body">
                Start with the free developer tier, run the integration tests
                against the real engine, then decide whether the managed edge or
                the sovereign binary fits your architecture.
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-ink-body">
                {ASSURANCES.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check
                      className="h-4 w-4 text-accent-green"
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
                className="button-primary justify-center text-center"
              >
                Create your account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/pricing"
                className="button-secondary justify-center text-center"
              >
                Compare plans
              </a>
              <a
                href="mailto:engineering@evenstamp.com?subject=Evenstamp%20architecture%20review"
                className="text-center font-mono text-[11px] text-ink-muted transition hover:text-ink pt-2"
              >
                Book a 30-minute architecture review →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
