import type { Metadata } from 'next';
import Link from 'next/link';
import { LogOut, ShieldCheck } from 'lucide-react';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { requireUser } from '@/lib/account';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s · Evenstamp Dashboard',
  },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

function initials(name: string, email: string): string {
  const source = name.trim() || email;
  return source.slice(0, 1).toUpperCase() || 'E';
}

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const me = await requireUser();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[var(--bg-glass)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard"
              className="flex shrink-0 items-center gap-2.5"
              aria-label="Evenstamp dashboard"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              </span>
              <span className="hidden text-sm font-semibold tracking-tight sm:inline">
                evenstamp
                <span className="font-mono text-xs text-emerald-400">.com</span>
              </span>
            </Link>
            <span className="hidden rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-secondary sm:inline">
              {me.plan.name} · {me.plan.interval}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <div className="truncate text-xs font-medium text-ink-primary">
                {me.user.name || me.user.email}
              </div>
              <div className="truncate font-mono text-[10px] text-ink-muted">
                {me.user.email}
              </div>
            </div>
            {me.user.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={me.user.picture}
                alt=""
                width={32}
                height={32}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full border border-white/10"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-surface-3 font-mono text-xs text-ink-secondary">
                {initials(me.user.name, me.user.email)}
              </span>
            )}
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[11px] text-ink-secondary transition hover:bg-white/[0.07] hover:text-ink-primary"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
          <DashboardNav />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
