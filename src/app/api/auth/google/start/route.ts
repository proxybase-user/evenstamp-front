import { NextResponse, type NextRequest } from 'next/server';
import {
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  appUrl,
  googleAuthorizeUrl,
  googleConfigured,
  randomUrlSafe,
  safeNextPath,
  sessionCookieOptions,
} from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!googleConfigured()) {
    return NextResponse.redirect(
      new URL('/login?error=google_not_configured', appUrl()),
    );
  }

  const state = randomUrlSafe(24);
  const verifier = randomUrlSafe(32);
  const next = safeNextPath(request.nextUrl.searchParams.get('next'));

  const response = NextResponse.redirect(googleAuthorizeUrl(state, verifier));
  const options = sessionCookieOptions(10 * 60);
  response.cookies.set(OAUTH_STATE_COOKIE, state, options);
  response.cookies.set(OAUTH_VERIFIER_COOKIE, verifier, options);
  response.cookies.set(OAUTH_NEXT_COOKIE, next, options);
  return response;
}
