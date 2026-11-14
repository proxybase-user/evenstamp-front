import type { Metadata } from 'next';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { getMe } from '@/lib/account';
import { googleConfigured, safeNextPath } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Sign in',
  description:
    'Sign in to Evenstamp to manage sites, session findings, and billing.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const ERROR_MESSAGES: Record<string, string> = {
  google_not_configured:
    'Google sign-in is not configured on this deployment. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
  oauth_state:
    'The sign-in attempt expired or the state did not match. Please try again.',
  google_exchange:
    'Google rejected the authorization code. Please try again.',
  google_denied:
    'Google sign-in was cancelled. You can try again whenever you are ready.',
  email_unverified:
    'Google has not verified this email address. Verify it with Google and retry.',
  account_session:
    'The Evenstamp engine could not create a session. Check that the backend is running and EVENSTAMP_INTERNAL_SECRET matches FP_INTERNAL_SECRET.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next ?? '/dashboard');
  const me = await getMe();
  if (me) {
    redirect(next);
  }

  const configured = googleConfigured();
  const errorMessage = params.error
    ? (ERROR_MESSAGES[params.error] ??
      'Sign-in failed. Please try again.')
    : null;

  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden bg-canvas transition-colors">
        <div className="relative mx-auto flex min-h-[calc(100vh-160px)] max-w-7xl items-center justify-center px-6 py-16 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[8px] border border-hairline bg-surface-2 text-accent-green">
                <ShieldCheck className="h-6 w-6 text-accent-green" aria-hidden="true" />
              </span>
              <h1 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-ink">
                Sign in to Evenstamp
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Add a website, install the first-party snippet, and review
                session findings from the sovereign Rust engine.
              </p>
            </div>

            <div className="card-feature shadow-level-2 !p-6">
              {errorMessage ? (
                <p
                  role="alert"
                  className="mb-5 rounded-[4px] border border-accent-red/30 bg-accent-red/10 px-3.5 py-2.5 text-xs leading-relaxed text-accent-red"
                >
                  {errorMessage}
                </p>
              ) : null}

              {configured ? (
                <a
                  href={`/api/auth/google/start?next=${encodeURIComponent(next)}`}
                  className="button-primary w-full justify-center"
                >
                  Continue with Google
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : (
                <div className="rounded-[4px] border border-accent-yellow/30 bg-accent-yellow/10 px-3.5 py-2.5 text-xs leading-relaxed text-accent-yellow">
                  Google sign-in is not configured. Set{' '}
                  <span className="font-mono font-medium">GOOGLE_CLIENT_ID</span> and{' '}
                  <span className="font-mono font-medium">GOOGLE_CLIENT_SECRET</span>, then
                  restart the web app.
                </div>
              )}

              <div className="mt-6 flex items-start gap-2.5 border-t border-hairline pt-5 text-[11px] leading-relaxed text-ink-muted">
                <LockKeyhole
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted"
                  aria-hidden="true"
                />
                <p>
                  Sessions are opaque HttpOnly cookies. Only a SHA-256 hash of
                  the token is stored in the engine database. Evenstamp never
                  receives your Google password.
                </p>
              </div>
            </div>

            <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
              Google OAuth 2.0 · PKCE · no third-party analytics
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
