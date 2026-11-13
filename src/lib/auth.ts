import { createHash, randomBytes } from 'node:crypto';

export const OAUTH_STATE_COOKIE = 'es_oauth_state';
export const OAUTH_VERIFIER_COOKIE = 'es_oauth_verifier';
export const OAUTH_NEXT_COOKIE = 'es_oauth_next';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';

export function appUrl(): string {
  const configured =
    process.env.EVENSTAMP_APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  return (configured ?? 'http://127.0.0.1:3000').replace(/\/+$/, '');
}

/**
 * Origin embedded in the customer install snippet. Defaults to the public web
 * origin, whose `/embed/v1.js` route proxies the backend-served loader. Set
 * `EVENSTAMP_SNIPPET_ORIGIN` to point snippets directly at a publicly exposed
 * engine origin in self-hosted/direct-engine deployments.
 */
export function snippetOrigin(): string {
  return (process.env.EVENSTAMP_SNIPPET_ORIGIN ?? appUrl()).replace(/\/+$/, '');
}

export function googleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
}

export function googleCallbackUrl(): string {
  return `${appUrl()}/api/auth/google/callback`;
}

export function randomUrlSafe(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

export function pkceChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}

export function googleAuthorizeUrl(
  state: string,
  verifier: string,
): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    redirect_uri: googleCallbackUrl(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: pkceChallenge(verifier),
    code_challenge_method: 'S256',
    access_type: 'online',
    prompt: 'select_account',
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export interface GoogleProfile {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export async function exchangeGoogleCode(
  code: string,
  verifier: string,
): Promise<GoogleProfile> {
  const body = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    redirect_uri: googleCallbackUrl(),
    grant_type: 'authorization_code',
    code_verifier: verifier,
  });

  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
  if (!tokenResponse.ok) {
    throw new Error(`google token exchange failed (${tokenResponse.status})`);
  }
  const tokenPayload = (await tokenResponse.json()) as {
    access_token?: string;
  };
  if (!tokenPayload.access_token) {
    throw new Error('google token exchange returned no access token');
  }

  const userResponse = await fetch(GOOGLE_USERINFO_URL, {
    headers: { authorization: `Bearer ${tokenPayload.access_token}` },
    cache: 'no-store',
  });
  if (!userResponse.ok) {
    throw new Error(`google userinfo failed (${userResponse.status})`);
  }
  const profile = (await userResponse.json()) as GoogleProfile;
  if (!profile.sub || !profile.email) {
    throw new Error('google profile is missing sub or email');
  }
  return profile;
}

/** Only same-site paths are accepted as post-login destinations. */
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard';
  }
  return value;
}

export function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}
