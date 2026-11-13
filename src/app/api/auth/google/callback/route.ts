import { NextResponse, type NextRequest } from 'next/server';
import {
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  appUrl,
  exchangeGoogleCode,
  safeNextPath,
  sessionCookieOptions,
} from '@/lib/auth';
import { SESSION_COOKIE, accountFetch } from '@/lib/account';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AccountSessionResponse {
  token: string;
  expiresAtMs: number;
  user: { id: string };
}

function failure(code: string) {
  const target = new URL('/login', appUrl());
  target.searchParams.set('error', code);
  return NextResponse.redirect(target);
}

export async function GET(request: NextRequest) {
  const oauthError = request.nextUrl.searchParams.get('error');
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  const verifier = request.cookies.get(OAUTH_VERIFIER_COOKIE)?.value;
  const next = safeNextPath(
    request.cookies.get(OAUTH_NEXT_COOKIE)?.value ?? '/dashboard',
  );

  if (oauthError) {
    return failure(
      oauthError === 'access_denied' ? 'google_denied' : 'google_exchange',
    );
  }
  if (!code || !state || !expectedState || state !== expectedState || !verifier) {
    return failure('oauth_state');
  }

  let profile;
  try {
    profile = await exchangeGoogleCode(code, verifier);
  } catch {
    return failure('google_exchange');
  }

  if (profile.email_verified === false) {
    return failure('email_unverified');
  }

  let session: AccountSessionResponse;
  try {
    session = await accountFetch<AccountSessionResponse>(
      '/api/v1/account/session',
      {
        method: 'POST',
        body: {
          googleSub: profile.sub,
          email: profile.email,
          name: profile.name ?? '',
          picture: profile.picture ?? '',
        },
      },
    );
  } catch {
    return failure('account_session');
  }

  const response = NextResponse.redirect(new URL(next, appUrl()));
  const maxAge = Math.max(
    60,
    Math.floor((session.expiresAtMs - Date.now()) / 1000),
  );
  response.cookies.set(SESSION_COOKIE, session.token, sessionCookieOptions(maxAge));
  response.cookies.delete(OAUTH_STATE_COOKIE);
  response.cookies.delete(OAUTH_VERIFIER_COOKIE);
  response.cookies.delete(OAUTH_NEXT_COOKIE);
  return response;
}
