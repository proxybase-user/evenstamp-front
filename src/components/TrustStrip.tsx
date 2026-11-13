import { STATS } from '@/lib/site-data';

export default function TrustStrip() {
  return (
    <div className="border-b border-white/[0.07] bg-surface-1">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-2 divide-x divide-white/[0.07] md:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-4 py-6 sm:px-6 ${
                index >= 2 ? 'border-t border-white/[0.07] md:border-t-0' : ''
              }`}
            >
              <dd className="metric text-2xl font-semibold text-ink-primary">
                {stat.value}
              </dd>
              <dt className="mt-1 text-xs leading-relaxed text-ink-muted">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
