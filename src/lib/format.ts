const numberFormat = new Intl.NumberFormat('en-US');
const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
  timeZoneName: 'short',
});

export function formatNumber(value: number | null | undefined): string {
  return numberFormat.format(value ?? 0);
}

export function formatMoney(cents: number | null | undefined): string {
  return `$${((cents ?? 0) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatTimestamp(ms: number | null | undefined): string {
  if (!ms) return '—';
  return dateTimeFormat.format(new Date(ms));
}

export function timeAgo(ms: number | null | undefined): string {
  if (!ms) return '—';
  const seconds = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatTimestamp(ms);
}

export function riskTone(score: number): {
  label: string;
  className: string;
  dot: string;
} {
  if (score >= 70) {
    return {
      label: 'High',
      className: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
      dot: 'bg-rose-400',
    };
  }
  if (score >= 30) {
    return {
      label: 'Medium',
      className: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
      dot: 'bg-amber-400',
    };
  }
  return {
    label: 'Low',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    dot: 'bg-emerald-400',
  };
}

export function percent(used: number, included: number | null): number {
  if (!included || included <= 0) return 0;
  return Math.min(100, Math.round((used / included) * 100));
}

export function countryLabel(edge: {
  country?: string | null;
  city?: string | null;
}): string {
  const parts = [edge.city, edge.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Unknown';
}
