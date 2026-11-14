import { ArrowRight, Check } from 'lucide-react';

const ASSURANCES = [
  'Setup takes 5 minutes',
  'Works across Chrome, Safari & Firefox',
  '14-day free trial on all plans',
  'Cancel anytime with one click',
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
              <div className="eyebrow">// Stop abuse today</div>
              <h2 className="max-w-[22ch] text-3xl font-semibold leading-[1.1] sm:text-4xl text-ink">
                Stop paying for fraudsters to use your product.
              </h2>
              <p className="max-w-[56ch] text-base leading-relaxed text-ink-body">
                Join teams cutting free-trial abuse, multi-accounting, and bot scraping by over 90% in their first week.
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
                href="/pricing"
                className="button-primary justify-center text-center !py-3 !text-sm"
              >
                Protect My Website Now — Start Free Trial
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <div className="text-center font-mono text-[11px] text-ink-muted pt-1">
                Setup takes 5 minutes · Works with any website or framework · Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
