import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { NAV_LINKS } from '@/lib/site-data';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[var(--bg-glass)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="Evenstamp home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10">
              <ShieldCheck
                className="h-4 w-4 text-emerald-400"
                aria-hidden="true"
              />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              evenstamp
              <span className="font-mono text-sm text-emerald-400">.com</span>
            </span>
          </Link>
          <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary lg:inline-flex">
            <span
              className="status-dot animate-pulse-dot bg-emerald-400"
              aria-hidden="true"
            />
            RUST + WASM + POLARS
          </span>
        </div>

        <nav
          className="hidden items-center gap-7 text-sm text-ink-secondary md:flex"
          aria-label="Main"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-md border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-ink-primary transition hover:bg-white/[0.07] sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/login?next=/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-emerald-950 shadow-emerald-glow transition hover:bg-emerald-400"
          >
            Get started
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
