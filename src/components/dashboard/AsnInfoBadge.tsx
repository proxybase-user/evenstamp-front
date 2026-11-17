'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Network, ShieldCheck, X } from 'lucide-react';

export interface AsnInfoBadgeProps {
  asn: number | null;
  name: string | null;
  bad: boolean;
}

export default function AsnInfoBadge({ asn, name, bad }: AsnInfoBadgeProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const label = asn ? `AS${asn}` : 'ASN —';
  const displayName = name?.trim() || 'No ASN name reported';
  const statusClass = bad
    ? 'border-accent-red/30 bg-accent-red/10 text-accent-red'
    : 'border-accent-green/30 bg-accent-green/10 text-accent-green';

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="asn-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[8px] border border-hairline bg-surface-1 p-6 shadow-2xl transition-all"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-hairline bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
              <Network className="h-3 w-3" aria-hidden="true" />
              Autonomous System
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${statusClass}`}
            >
              {bad ? (
                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              ) : (
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              )}
              {bad ? 'Bad ASN' : 'Not blocked'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-[4px] border border-hairline bg-surface-2 p-1.5 text-ink-muted transition hover:bg-surface-3 hover:text-ink cursor-pointer"
            aria-label="Close ASN dialog"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <h2
          id="asn-modal-title"
          className="mt-3 text-lg font-semibold tracking-tight text-ink sm:text-xl"
        >
          {asn ? `AS${asn}` : 'ASN not reported'}
        </h2>
        <p className="mt-1 text-sm font-medium text-ink-body">{displayName}</p>

        <div className="mt-5 space-y-4">
          <div className="rounded-[6px] border border-hairline bg-surface-2/60 p-3.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              ASN name
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink">{displayName}</p>
          </div>

          <div className="rounded-[6px] border border-hairline bg-surface-2/60 p-3.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Blocklist status
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink">
              {bad
                ? 'This ASN appears in the bad-ASN blocklist loaded by the engine. Traffic from this network is more likely to originate from hosting, proxy, or other non-residential infrastructure.'
                : 'This ASN is not in the currently loaded bad-ASN blocklist. This is a network-reputation signal only, not a statement about the visitor.'}
            </p>
          </div>

          {asn ? (
            <div className="rounded-[6px] border border-hairline bg-surface-2/60 p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                ASN number
              </div>
              <p className="mt-1 font-mono text-sm text-ink">AS{asn}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="button-secondary !py-1.5 !px-4 !text-xs !min-h-0 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`View ASN details${asn ? ` for AS${asn}` : ''}`}
        className={`inline-flex items-center gap-1 rounded-[4px] border px-1.5 py-0.5 font-mono text-[10px] font-medium transition cursor-pointer ${
          bad
            ? 'border-accent-red/40 bg-accent-red/10 text-accent-red hover:bg-accent-red/20 hover:border-accent-red/60'
            : 'border-hairline bg-surface-2 text-ink-muted hover:bg-surface-3 hover:text-ink-secondary'
        }`}
      >
        {bad ? (
          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
        ) : (
          <Network className="h-3 w-3" aria-hidden="true" />
        )}
        <span>{label}</span>
        {bad ? (
          <span className="font-semibold uppercase tracking-wider">bad</span>
        ) : null}
      </button>

      {mounted && open ? createPortal(modal, document.body) : null}
    </>
  );
}
