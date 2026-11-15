import SectionFrame from './SectionFrame';
import { COMPARISON_ROWS } from '@/lib/site-data';

const COST_BARS = [
  {
    label: 'Evenstamp Scale',
    detail: '$199 / 1M checks',
    value: 0.199,
    width: 4,
    tone: 'bg-accent-green',
  },
  {
    label: 'Evenstamp Starter',
    detail: '$29 / 50k checks',
    value: 0.58,
    width: 12,
    tone: 'bg-accent-blue',
  },
  {
    label: 'Fingerprint Pro',
    detail: '$99 / 20k checks',
    value: 4.95,
    width: 100,
    tone: 'bg-accent-red/70',
  },
];

export default function ComparisonSection() {
  return (
    <SectionFrame id="comparison">
      <div className="max-w-3xl space-y-4">
        <div className="eyebrow">// Better protection, fairer pricing</div>
        <h2 className="text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[44.8px] lg:leading-[46.6px]">
          Stop paying $99+ a month to let abusers slip through in another browser.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-body">
          Legacy fingerprinting tools charge monthly minimums and still get fooled when a user
          switches from Chrome to Edge. Free open-source scripts break when someone opens Incognito.
          Evenstamp starts at $29/mo and identifies the hardware itself.
        </p>
      </div>

      <div className="mt-8">
        <div className="mb-2 text-right md:hidden font-mono text-[11px] text-accent-blue flex items-center justify-end gap-1">
          <span>Swipe to compare</span>
        </div>
        <div className="overflow-x-auto rounded-[8px] border border-hairline bg-surface-1 scrollbar-thin">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-hairline bg-surface-2 font-mono text-[12px] uppercase tracking-[0.06em] text-ink-muted">
                <th scope="col" className="px-6 py-4 font-normal">
                  What Matters to Your Business
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-accent-green">
                  Evenstamp
                </th>
                <th scope="col" className="px-6 py-4 font-normal">
                  Fingerprint Pro ($99+/mo)
                </th>
                <th scope="col" className="px-6 py-4 font-normal">
                  Free Open-Source Scripts
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.capability} className="transition-colors hover:bg-surface-2/60">
                  <th
                    scope="row"
                    className="px-6 py-4 text-left font-medium text-ink"
                  >
                    {row.capability}
                  </th>
                  <td className="px-6 py-4 font-mono text-[13px] font-semibold text-accent-green">
                    {row.evenstamp}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-ink-body">
                    {row.fingerprint}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-ink-muted">
                    {row.openSource}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-feature mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr] lg:p-8">
        <div className="space-y-3">
          <div className="eyebrow-sm text-accent-blue">
            Cost per 1,000 identifications
          </div>
          <h3 className="text-xl font-semibold text-ink">
            Up to 96% lower cost per 1,000 checks.
          </h3>
          <p className="max-w-[46ch] text-sm leading-relaxed text-ink-body">
            Published list prices, normalized to the same unit. Evenstamp starts at
            $29/mo with published overage rates and no platform fee.
          </p>
          <p className="font-mono text-[11px] text-ink-muted">
            Comparison reflects public pricing and documented capabilities as of Q4 2026.
          </p>
          <div className="pt-1">
            <a
              href="/pricing"
              className="button-primary !text-xs !py-2 !px-4 inline-flex items-center gap-1.5"
              data-umami-event="comparison-view-pricing-click"
            >
              See all plans &amp; pricing &rarr;
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          {COST_BARS.map((bar) => (
            <div key={bar.label} className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 font-mono text-xs">
                <span className="font-medium text-ink">{bar.label}</span>
                <span className="text-ink-muted">
                  {bar.detail} (${bar.value.toFixed(3)}/1k checks)
                </span>
              </div>
              <div className="h-3 w-full rounded-[4px] bg-surface-3 overflow-hidden">
                <div
                  className={`h-full rounded-[4px] ${bar.tone}`}
                  style={{ width: `${Math.max(bar.width, 3)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
