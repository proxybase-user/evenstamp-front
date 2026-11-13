import { NextResponse, type NextRequest } from 'next/server';
import { accountFetch, SESSION_COOKIE } from '@/lib/account';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      await accountFetch('/api/v1/account/session', {
        method: 'DELETE',
        token,
      });
    } catch {
      // Local sign-out still clears the cookie when the engine is unreachable.
    }
  }

  const response = NextResponse.redirect(new URL('/', request.url), {
    status: 303,
  });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
