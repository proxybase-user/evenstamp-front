import type { ReactNode } from 'react';
import SectionFrame from './SectionFrame';

export type Accent = 'green' | 'blue' | 'yellow' | 'red' | 'purple';

const ACCENT_TEXT: Record<Accent, string> = {
  green: 'text-accent-green',
  blue: 'text-accent-blue',
  yellow: 'text-accent-yellow',
  red: 'text-accent-red',
  purple: 'text-accent-purple',
};

const CALLOUT_TONE: Record<Accent, string> = {
  green: 'border-accent-green/30 bg-accent-green/10',
  blue: 'border-accent-blue/30 bg-accent-blue/10',
  yellow: 'border-accent-yellow/30 bg-accent-yellow/10',
  red: 'border-accent-red/30 bg-accent-red/10',
  purple: 'border-accent-purple/30 bg-accent-purple/10',
};

export function SeoSection({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SectionFrame id={id}>
      <div className="max-w-3xl space-y-4">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="text-2xl font-semibold leading-tight text-ink sm:text-3xl">
          {title}
        </h2>
        {intro ? (
          <div className="text-sm leading-relaxed text-ink-body">{intro}</div>
        ) : null}
      </div>
      <div className="mt-8">{children}</div>
    </SectionFrame>
  );
}

export function StatStrip({
  stats,
}: {
  stats: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[8px] border border-hairline bg-surface-1 p-4"
        >
          <div className="metric text-2xl font-semibold text-ink">
            {stat.value}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.06em] text-ink-muted">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardGrid({
  items,
  columns = 2,
}: {
  items: Array<{ title: string; body: ReactNode; accent?: Accent }>;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={`grid gap-4 ${
        columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
      }`}
    >
      {items.map((item) => (
        <article key={item.title} className="card-feature !p-6">
          <h3
            className={`font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${
              ACCENT_TEXT[item.accent ?? 'green']
            }`}
          >
            {item.title}
          </h3>
          <div className="mt-2 text-sm leading-relaxed text-ink-body">
            {item.body}
          </div>
        </article>
      ))}
    </div>
  );
}

export function Callout({
  title,
  children,
  tone = 'green',
}: {
  title?: string;
  children: ReactNode;
  tone?: Accent;
}) {
  return (
    <div className={`rounded-[8px] border px-4 py-3.5 ${CALLOUT_TONE[tone]}`}>
      {title ? (
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink">
          {title}
        </div>
      ) : null}
      <div className={`text-sm leading-relaxed text-ink-body ${title ? 'mt-1.5' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export function CompareTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: ReactNode[][];
  caption?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-hairline bg-surface-1">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead className="bg-surface-2">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="border-b border-hairline px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className="border-b border-hairline last:border-b-0"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`cell-${rowIndex}-${cellIndex}`}
                    className={`px-4 py-3 align-top leading-relaxed ${
                      cellIndex === 0
                        ? 'font-medium text-ink'
                        : 'text-ink-body'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? (
        <div className="border-t border-hairline bg-surface-2 px-4 py-3 text-[11px] leading-relaxed text-ink-muted">
          {caption}
        </div>
      ) : null}
    </div>
  );
}

export function FaqList({
  items,
}: {
  items: Array<{ question: string; answer: ReactNode }>;
}) {
  return (
    <div className="max-w-3xl space-y-6">
      {items.map((item) => (
        <div key={item.question}>
          <h3 className="text-base font-semibold leading-snug text-ink">
            {item.question}
          </h3>
          <div className="mt-1.5 text-sm leading-relaxed text-ink-body">
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SourceList({
  items,
}: {
  items: Array<{ label: string; href: string; note?: string }>;
}) {
  return (
    <ol className="max-w-3xl space-y-2.5">
      {items.map((item, index) => (
        <li key={item.href} className="flex gap-3 text-sm leading-relaxed">
          <span className="font-mono text-[10px] text-ink-muted">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-hairline underline-offset-2 transition hover:decoration-accent-green"
            >
              {item.label}
            </a>
            {item.note ? (
              <span className="text-ink-muted"> ({item.note})</span>
            ) : null}
          </span>
        </li>
      ))}
    </ol>
  );
}
