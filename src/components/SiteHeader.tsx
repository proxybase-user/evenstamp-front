'use client';

import { useState } from 'react';
import { ArrowRight, Menu, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { NAV_LINKS } from '@/lib/site-data';
import ThemeToggle from './ThemeToggle';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-surface-glass backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand & Wordmark */}
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Evenstamp home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-hairline bg-surface-2">
              <ShieldCheck
                className="h-4 w-4 text-accent-green"
                aria-hidden="true"
              />
            </span>
            <span className="text-[17px] sm:text-[18px] font-semibold tracking-tight text-ink">
              evenstamp
              <span className="font-mono text-sm text-accent-green">.com</span>
            </span>
          </Link>
          <span className="ml-2 hidden items-center gap-1.5 rounded-[4px] border border-hairline bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary xl:inline-flex">
            <span
              className="status-dot animate-pulse-dot bg-accent-green"
              aria-hidden="true"
            />
            STOP MULTI-ACCOUNTING &amp; BOT ABUSE
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-4 lg:gap-6 xl:gap-7 text-[13px] lg:text-[14px] font-medium text-ink-secondary md:flex"
          aria-label="Main"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-ink whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions & Theme Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />

          <Link
            href="/login"
            className="hidden rounded-[4px] border border-hairline bg-surface-1 px-3 py-1.5 font-mono text-xs text-ink transition hover:bg-surface-2 sm:inline-flex"
          >
            Log in
          </Link>

          <Link
            href="/pricing"
            className="button-primary hidden !min-h-0 !px-3.5 sm:!px-4 !py-1.5 !text-xs sm:inline-flex"
          >
            <span className="hidden lg:inline">Start Protecting Revenue</span>
            <span className="lg:hidden">Start Protecting</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="button-icon-circular md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="border-b border-hairline bg-surface-1 px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4 text-base font-medium text-ink">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 transition-colors hover:text-accent-blue"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-hairline">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="button-secondary w-full justify-center text-sm"
              >
                Log in
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="button-primary w-full justify-center text-sm"
              >
                Start Protecting Revenue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
