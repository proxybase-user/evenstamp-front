import { type NextRequest } from 'next/server';
import {
  proxyToEngine,
  publicCorsPreflight,
  readLimitedBody,
  withPublicCors,
} from '@/lib/engine-proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export function OPTIONS() {
  return publicCorsPreflight();
}

export async function POST(request: NextRequest) {
  const body = await readLimitedBody(request);
  if ('error' in body) return withPublicCors(body.error);

  return withPublicCors(
    await proxyToEngine(request, '/api/v1/ingest', {
      method: 'POST',
      body: body.body,
    }),
  );
}
