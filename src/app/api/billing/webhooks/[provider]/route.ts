import { NextResponse, type NextRequest } from 'next/server';
import { ENGINE_URL } from '@/lib/engine-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PROVIDERS = new Set(['airwallex', 'nowpayments']);
const MAX_BODY_BYTES = 262_144;

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  if (!PROVIDERS.has(provider)) {
    return NextResponse.json(
      { error: { code: 'UNKNOWN_PROVIDER', message: 'unknown provider' } },
      { status: 404 },
    );
  }

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: { code: 'PAYLOAD_TOO_LARGE', message: 'webhook body too large' } },
      { status: 413 },
    );
  }

  const headers = new Headers({
    'content-type': request.headers.get('content-type') ?? 'application/json',
  });
  // Signature headers are the authentication boundary; forward them verbatim.
  for (const name of ['x-timestamp', 'x-signature', 'x-nowpayments-sig']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const upstream = await fetch(
      `${ENGINE_URL}/api/v1/billing/webhooks/${provider}`,
      {
        method: 'POST',
        headers,
        body,
        cache: 'no-store',
        signal: controller.signal,
      },
    );
    const responseBody = await upstream.text();
    return new NextResponse(responseBody, {
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
          message: 'Evenstamp engine is unreachable from the webhook proxy',
        },
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timer);
  }
}
