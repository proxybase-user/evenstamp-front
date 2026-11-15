import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Home, ShieldAlert } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The requested page could not be found on Evenstamp.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="relative flex min-h-[calc(100vh-200px)] items-center justify-center bg-canvas px-6 py-24 transition-colors">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-[8px] border border-hairline bg-surface-2 text-accent-red">
            <ShieldAlert className="h-7 w-7 text-accent-red" aria-hidden="true" />
          </div>

          <div className="eyebrow justify-center">// 404 Error</div>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
            Page not found
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-ink-body">
            The page you are looking for doesn&apos;t exist or has been moved. If you
            believe this is an error, please reach out to our engineering team.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="button-primary">
              <Home className="h-4 w-4" aria-hidden="true" />
              <span>Back to home</span>
            </Link>
            <Link href="/pricing" className="button-secondary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>View pricing</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
