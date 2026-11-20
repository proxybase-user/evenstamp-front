import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import type { PlanSummary, UsageSummary } from '@/lib/account';
import { formatNumber } from '@/lib/format';

/**
 * Persistent dashboard warning when a tenant approaches or reaches the
 * included identification capacity of its plan. Server-rendered so every
 * dashboard page shows it without duplicating usage state.
 */
export default function PlanLimitBanner({
  plan,
  usage,
}: {
  plan: PlanSummary;
  usage: UsageSummary;
}) {
  if (usage.included === null || usage.included <= 0) {
    return null;
  }

  const ratio = usage.identifications / usage.included;
  const percentUsed = Math.round(ratio * 100);
  if (percentUsed < 90) {
    return null;
  }

  const atLimit = usage.identifications >= usage.included;
  const isSandbox = plan.key === 'developer';

  const title = atLimit
    ? 'You have reached your plan limit'
    : `You have used ${percentUsed}% of your plan`;

  const description = atLimit
    ? isSandbox
      ? `All ${formatNumber(
          usage.included,
        )} Sandbox identifications for ${usage.month} are used. New identifications are rejected until the monthly reset — upgrade to keep measuring without interruption.`
      : `All ${formatNumber(
          usage.included,
        )} included identifications for ${usage.month} are used. Additional traffic is billed as overage at your plan rate.`
    : `Only ${formatNumber(
        Math.max(0, usage.included - usage.identifications),
      )} of ${formatNumber(
        usage.included,
      )} included identifications remain this month. Upgrade before you hit the limit.`;

  const tone = atLimit
    ? 'border-accent-red/35 bg-accent-red/10 text-accent-red'
    : 'border-accent-yellow/35 bg-accent-yellow/10 text-accent-yellow';

  const barTone = atLimit ? 'bg-accent-red' : 'bg-accent-yellow';

  return (
    <div
      role="alert"
      className={`flex flex-col gap-4 rounded-[6px] border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between ${tone}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-body">
            {description}
          </p>
          <div className="mt-2 h-1 w-full max-w-xs overflow-hidden rounded-full bg-surface-3">
            <div
              className={`h-full rounded-full ${barTone}`}
              style={{ width: `${Math.min(100, percentUsed)}%` }}
            />
          </div>
        </div>
      </div>
      <Link
        href="/dashboard/billing"
        className="button-primary shrink-0 self-start !min-h-0 !py-2 !text-xs sm:self-center"
      >
        {atLimit ? 'Upgrade your plan' : 'Review upgrade options'}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
