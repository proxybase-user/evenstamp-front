'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  getAnomalyInfo,
  type AnomalyDefinition,
  type AnomalySeverity,
} from '@/lib/anomaly-dictionary';

export interface FindingInfoModalProps {
  code: string | null;
  onClose: () => void;
}

function getRecommendedAction(
  severity: AnomalySeverity,
  category: string,
  code: string,
): string {
  if (code.startsWith('BOT_') || category === 'Automation & Bots') {
    return 'Consider requiring step-up verification (such as an email or SMS code) or challenging this request before allowing high-value actions like account registration, login, or purchases.';
  }
  if (category === 'Identity & OS Spoofing') {
    return 'The visitor is actively masking their true operating system or hardware. Treat this session with caution, especially if linked to financial transactions or new account creation.';
  }
  if (category === 'Network & Proxy') {
    if (code === 'WEBRTC_LOCAL_IP_EXPOSED') {
      return 'Informational signal. Can be used to cross-reference multiple accounts connecting from the same local office or home network.';
    }
    return 'Traffic is routed through an intermediary proxy or VPN. If your service enforces geographic boundaries or restricts VPN usage, review or challenge access.';
  }
  if (category === 'Hardware & Environment') {
    return 'The visitor is running inside a virtual machine or cloud server instead of a genuine personal device. Common with bot farms and emulated test setups.';
  }
  if (category === 'Privacy Tools') {
    return 'This usually indicates a privacy-conscious user (using Brave, Firefox privacy mode, or an ad-blocker). Unless paired with automation flags, no blocking is needed.';
  }
  if (severity === 'high') {
    return 'High-risk anomaly. Review recent activity from this session and consider requiring step-up authentication or manual review.';
  }
  if (severity === 'medium') {
    return 'Moderate anomaly. Monitor this session and evaluate in combination with the overall risk score.';
  }
  return 'Informational indicator. Normal user traffic may trigger this without malicious intent; no immediate action required.';
}

export default function FindingInfoModal({
  code,
  onClose,
}: FindingInfoModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!code) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [code, onClose]);

  if (!mounted || !code) return null;

  const isClean = code === 'CLEAN';

  const info: AnomalyDefinition = isClean
    ? {
        code: 'CLEAN',
        title: 'All Security Probes Passed Cleanly',
        badge: 'Clean',
        category: 'Clean Session' as unknown as AnomalyDefinition['category'],
        severity: 'low',
        summary:
          'No automated scripts, browser spoofing tools, virtual machines, or proxy tunnels were detected for this visit.',
        whyItMatters:
          'The visitor is using a genuine personal device with natural human behavior and standard network routing. This session has the lowest likelihood of fraud or multi-accounting.',
        technicalNote:
          'Operating system signatures, TCP/TLS packet handshake timings, WebGL graphics benchmarks, and pointer behavioral physics all matched normal human baselines.',
      }
    : getAnomalyInfo(code);

  const recommendedAction = isClean
    ? 'Allow this session to proceed normally without friction or extra verification.'
    : getRecommendedAction(info.severity, info.category, info.code);

  const severityBadge =
    info.severity === 'high'
      ? 'border-accent-red/30 bg-accent-red/10 text-accent-red'
      : info.severity === 'medium'
        ? 'border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow'
        : 'border-accent-green/30 bg-accent-green/10 text-accent-green';

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="finding-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[8px] border border-hairline bg-surface-1 p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Badges & Close Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${severityBadge}`}
            >
              {info.severity === 'high' ? (
                <ShieldAlert className="h-3 w-3" />
              ) : info.severity === 'medium' ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <ShieldCheck className="h-3 w-3" />
              )}
              {isClean ? 'Clean Session' : `${info.severity} Risk`}
            </span>
            <span className="rounded-[4px] border border-hairline bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-ink-secondary">
              {info.category}
            </span>
            {!isClean && (
              <span className="font-mono text-[10px] text-ink-muted">
                {info.code}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[4px] border border-hairline bg-surface-2 p-1.5 text-ink-muted transition hover:bg-surface-3 hover:text-ink cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Title */}
        <h2
          id="finding-modal-title"
          className="mt-3 text-lg font-semibold tracking-tight text-ink sm:text-xl"
        >
          {info.title}
        </h2>

        {/* Explanation Sections */}
        <div className="mt-5 space-y-4">
          {/* What this means */}
          <div className="rounded-[6px] border border-hairline bg-surface-2/60 p-3.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
              What this means
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink">
              {info.summary}
            </p>
          </div>

          {/* Why it matters */}
          <div className="rounded-[6px] border border-hairline bg-surface-2/60 p-3.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Why it matters for your site
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
              {info.whyItMatters}
            </p>
          </div>

          {/* Technical verification */}
          <div className="rounded-[6px] border border-hairline bg-surface-2/60 p-3.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
              Technical check
            </div>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-ink-secondary">
              {info.technicalNote}
            </p>
          </div>

          {/* Recommended action */}
          <div className="rounded-[6px] border border-hairline bg-surface-2/60 p-3.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-accent-blue font-semibold">
              Recommended action
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink">
              {recommendedAction}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="button-secondary !py-1.5 !px-4 !text-xs !min-h-0 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
