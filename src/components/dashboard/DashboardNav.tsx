'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CreditCard,
  Fingerprint,
  Globe2,
  LayoutDashboard,
} from 'lucide-react';

const LINKS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/sites', label: 'Sites', icon: Globe2 },
  { href: '/dashboard/sessions', label: 'Session findings', icon: Fingerprint },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto scrollbar-thin">
      {LINKS.map((link) => {
        const active =
          link.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-[4px] px-3.5 py-2 text-xs font-medium transition ${
              active
                ? 'bg-surface-2 text-ink border border-hairline font-semibold'
                : 'text-ink-muted hover:bg-surface-2/60 hover:text-ink'
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
