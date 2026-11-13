import SectionFrame from './SectionFrame';
import { COMPARISON_ROWS } from '@/lib/site-data';

const COST_BARS = [
  {
    label: 'Evenstamp Scale',
    detail: '$199 / 1M',
    value: 0.199,
    width: 4,
    tone: 'bg-emerald-500',
  },
  {
    label: 'Evenstamp Growth',
    detail: '$39 / 100k',
    value: 0.39,
    width: 8,
    tone: 'bg-cyan-500',
  },
  {
    label: 'Fingerprint Pro Plus',
    detail: '$99 / 20k',
    value: 4.95,
    width: 100,
    tone: 'bg-rose-500/70',
  },
];

export default function ComparisonSection() {
  return (
    <SectionFrame id="comparison">
      <div className="max-w-3xl space-y-4">
        <div className="eyebrow">// Benchmarks & unit economics</div>
        <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-4xl">
          Built for teams tired of cloud lock-in and $99 / 20k quotas.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-secondary">
          A single compiled Rust binary backed by SQLite and in-memory Polars
          removes the managed-cluster overhead that incumbent pricing carries.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto rounded-xl border border-white/[0.08] bg-surface-1 scrollbar-thin">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-surface-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
              <th scope="col" className="px-5 py-4 font-normal">
                Capability
              </th>
              <th scope="col" className="px-5 py-4 font-normal text-emerald-400">
                Evenstamp
              </th>
              <th scope="col" className="px-5 py-4 font-normal">
                Fingerprint Pro
              </th>
              <th scope="col" className="px-5 py-4 font-normal">
                Open-source FPJS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.capability} className="transition-colors hover:bg-white/[0.015]">
                <th
                  scope="row"
                  className="px-5 py-3.5 text-left font-medium text-ink-primary"
                >
                  {row.capability}
                </th>
                <td className="px-5 py-3.5 font-mono text-[12px] text-emerald-400">
                  {row.evenstamp}
                </td>
                <td className="px-5 py-3.5 text-[13px] text-ink-secondary">
                  {row.fingerprint}
                </td>
                <td className="px-5 py-3.5 text-[13px] text-ink-muted">
                  {row.openSource}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 rounded-xl border border-white/[0.07] bg-surface-1 p-6 shadow-specular lg:grid-cols-[1fr_1.2fr] lg:p-8">
        <div className="space-y-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-cyan-400">
            Cost per 1,000 identifications
          </div>
          <h3 className="text-xl font-semibold tracking-[-0.01em]">
            Up to 96% lower cost per call.
          </h3>
          <p className="max-w-[46ch] text-sm leading-relaxed text-ink-secondary">
            Published list pricing, normalized to the same unit. Evenstamp
            overage is $0.50 per 10k on Scale and $0.80 per 10k on Growth, with
            no punitive platform fee.
          </p>
          <p className="font-mono text-[10px] text-ink-muted">
            Comparison reflects public pricing and documented capabilities as
            of Q4 2026. Verify with each vendor.
          </p>
        </div>

        <div className="space-y-5">
          {COST_BARS.map((bar) => (
            <div key={bar.label} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3 font-mono text-[11px]">
                <span className="text-ink-secondary">{bar.label}</span>
                <span className="metric text-ink-primary">
                  ${bar.value.toFixed(2)}
                  <span className="ml-1 text-[10px] text-ink-muted">
                    / 1k · {bar.detail}
                  </span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className={`h-full rounded-full ${bar.tone}`}
                  style={{ width: `${bar.width}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
