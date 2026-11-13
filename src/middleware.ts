import { NextResponse, type NextRequest } from 'next/server';

/**
 * Marks first-party proxy requests. Header enforcement lives in
 * `lib/engine-proxy.ts`, which builds the upstream request from a fixed
 * whitelist and forwards wire telemetry only when
 * `EVENSTAMP_TRUST_EDGE_HEADERS=true` at request time.
 *
 * Keeping the decision in the Node route handler avoids Next inlining this
 * value into the Edge middleware bundle at build time, so a deployment can
 * change it without rebuilding.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Fast-path redirect for visitors with no session cookie. The dashboard
    // layout still verifies the token against the engine; middleware is not
    // the authorization boundary.
    if (!request.cookies.get('es_session')) {
      const login = request.nextUrl.clone();
      login.pathname = '/login';
      login.search = `?next=${encodeURIComponent(
        request.nextUrl.pathname + request.nextUrl.search,
      )}`;
      return NextResponse.redirect(login);
    }
  }

  const headers = new Headers(request.headers);
  headers.set('x-evenstamp-proxy', 'next');
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/api/v1/:path*', '/dashboard/:path*'],
};
