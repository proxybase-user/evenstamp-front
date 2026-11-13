import { timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

export const ENGINE_URL = (
  process.env.RUST_BACKEND_INTERNAL_URL ?? 'http://127.0.0.1:8080'
).replace(/\/+$/, '');

const MAX_BODY_BYTES = 1_048_576;
const EDGE_SECRET_HEADER = 'x-evenstamp-edge-secret';
const PROXY_SECRET_HEADER = 'x-evenstamp-proxy-secret';

const PUBLIC_CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, x-api-key',
  'access-control-max-age': '86400',
} as const;

/**
 * Challenge and ingest are called from customer origins with a public site
 * key, not a cookie. A wildcard origin is safe here because the key is the
 * tenant selector and the engine never accepts credentialed browser requests.
 */
export function publicCorsPreflight(): NextResponse {
  return new NextResponse(null, { status: 204, headers: PUBLIC_CORS_HEADERS });
}

export function withPublicCors(response: NextResponse): NextResponse {
  for (const [name, value] of Object.entries(PUBLIC_CORS_HEADERS)) {
    response.headers.set(name, value);
  }
  return response;
}

export function publicAssetPreflight(): Response {
  return new Response(null, { status: 204, headers: PUBLIC_CORS_HEADERS });
}

/**
 * Proxies an engine-served JavaScript asset (the install loader and the SDK
 * bundle). The backend is the source of truth; the Next origin only mirrors it
 * for deployments where the engine is not directly reachable by browsers.
 */
export async function proxyEngineAsset(path: string): Promise<Response> {
  try {
    const upstream = await fetch(`${ENGINE_URL}${path}`, { cache: 'no-store' });
    if (!upstream.ok) {
      return new Response('// Evenstamp asset is unavailable', {
        status: 502,
        headers: {
          'content-type': 'application/javascript; charset=utf-8',
          'cache-control': 'no-store',
          ...PUBLIC_CORS_HEADERS,
        },
      });
    }
    return new Response(await upstream.text(), {
      status: 200,
      headers: {
        'content-type': 'application/javascript; charset=utf-8',
        'cache-control': 'public, max-age=300',
        'x-content-type-options': 'nosniff',
        ...PUBLIC_CORS_HEADERS,
      },
    });
  } catch {
    return new Response('// Evenstamp asset is unavailable', {
      status: 502,
      headers: {
        'content-type': 'application/javascript; charset=utf-8',
        'cache-control': 'no-store',
        ...PUBLIC_CORS_HEADERS,
      },
    });
  }
}

/**
 * Wire telemetry headers can only be produced by an edge that sees the client
 * TCP/TLS handshake. Browsers must never be able to supply them. They are
 * forwarded only when:
 *
 *   1. EVENSTAMP_TRUST_EDGE_HEADERS=true,
 *   2. EVENSTAMP_PROXY_SECRET is set (and sent to the Rust engine), and
 *   3. the incoming request carries the matching EVENSTAMP_EDGE_SECRET set by
 *      the trusted Nginx edge.
 */
const WIRE_HEADERS = [
  'x-ja4-fingerprint',
  'x-h2-fingerprint',
  'x-tcp-ttl',
  'x-tcp-mss',
  'x-tcp-rtt-ms',
  'x-tls-rtt-ms',
  'x-client-port',
  'x-asn',
  'x-forwarded-for',
  'x-real-ip',
] as const;

export function trustEdgeHeaders(): boolean {
  return process.env.EVENSTAMP_TRUST_EDGE_HEADERS === 'true';
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function edgeRequestIsTrusted(request: NextRequest): boolean {
  const expected = process.env.EVENSTAMP_EDGE_SECRET;
  const provided = request.headers.get(EDGE_SECRET_HEADER);
  return Boolean(expected && provided && safeEqual(provided, expected));
}

/** Returns a deployment error when trust is enabled without its secrets. */
export function edgeTrustConfigurationError(): string | null {
  if (!trustEdgeHeaders()) return null;
  if (!process.env.EVENSTAMP_PROXY_SECRET) {
    return 'EVENSTAMP_TRUST_EDGE_HEADERS=true requires EVENSTAMP_PROXY_SECRET';
  }
  if (!process.env.EVENSTAMP_EDGE_SECRET) {
    return 'EVENSTAMP_TRUST_EDGE_HEADERS=true requires EVENSTAMP_EDGE_SECRET';
  }
  return null;
}

export function buildUpstreamHeaders(request: NextRequest): Headers {
  const headers = new Headers({ accept: 'application/json' });
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  // Tenant identification is a public client key, not a proxy secret, and
  // must reach the engine so it can enforce FP_REQUIRE_API_KEY.
  const apiKey = request.headers.get('x-api-key');
  if (apiKey) headers.set('x-api-key', apiKey);

  // Origin is needed for optional origin-scoped BrowserIDs; it is also a
  // client-controlled hint, not an authentication boundary.
  const origin = request.headers.get('origin');
  if (origin) headers.set('origin', origin);

  const proxySecret = process.env.EVENSTAMP_PROXY_SECRET;
  if (proxySecret) headers.set(PROXY_SECRET_HEADER, proxySecret);

  if (trustEdgeHeaders() && edgeRequestIsTrusted(request)) {
    for (const name of WIRE_HEADERS) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
  }

  return headers;
}

export async function proxyToEngine(
  request: NextRequest,
  path: string,
  init: { method: 'GET' | 'POST'; body?: string },
): Promise<NextResponse> {
  const configurationError = edgeTrustConfigurationError();
  if (configurationError) {
    return NextResponse.json(
      {
        error: {
          code: 'EDGE_TRUST_MISCONFIGURED',
          message: configurationError,
        },
      },
      { status: 503 },
    );
  }

  if (trustEdgeHeaders() && !edgeRequestIsTrusted(request)) {
    return NextResponse.json(
      {
        error: {
          code: 'EDGE_SECRET_REQUIRED',
          message:
            'this deployment only accepts requests through its configured edge',
        },
      },
      { status: 403 },
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);

  try {
    const upstream = await fetch(`${ENGINE_URL}${path}`, {
      method: init.method,
      headers: buildUpstreamHeaders(request),
      body: init.body,
      cache: 'no-store',
      signal: controller.signal,
    });

    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'content-type':
          upstream.headers.get('content-type') ?? 'application/json',
        'cache-control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'ENGINE_UNREACHABLE',
          message: 'Evenstamp engine is unreachable from the proxy',
        },
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timer);
  }
}

export async function readLimitedBody(
  request: NextRequest,
): Promise<{ body: string } | { error: NextResponse }> {
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return {
      error: NextResponse.json(
        {
          error: {
            code: 'PAYLOAD_TOO_LARGE',
            message: 'envelope exceeds the 1 MiB proxy limit',
          },
        },
        { status: 413 },
      ),
    };
  }

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return {
      error: NextResponse.json(
        {
          error: {
            code: 'PAYLOAD_TOO_LARGE',
            message: 'envelope exceeds the 1 MiB proxy limit',
          },
        },
        { status: 413 },
      ),
    };
  }
  return { body };
}
