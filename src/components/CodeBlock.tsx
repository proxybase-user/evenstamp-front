import CopyButton from './CopyButton';

export default function CodeBlock({
  title,
  language,
  code,
}: {
  title: string;
  language?: string;
  code: string;
}) {
  return (
    <div className="surface-card min-w-0 overflow-hidden rounded-xl">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] bg-surface-2 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
          <span className="status-dot bg-emerald-400" aria-hidden="true" />
          <span className="truncate">{title}</span>
          {language ? (
            <span className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-ink-muted sm:inline">
              {language}
            </span>
          ) : null}
        </div>
        <CopyButton value={code} label="Copy" />
      </div>
      <pre className="scrollbar-thin overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-ink-code">
        <code>{code}</code>
      </pre>
    </div>
  );
}
