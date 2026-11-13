import { type NextRequest } from 'next/server';
import {
  proxyToEngine,
  publicCorsPreflight,
  withPublicCors,
} from '@/lib/engine-proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export function OPTIONS() {
  return publicCorsPreflight();
}

export async function GET(request: NextRequest) {
  return withPublicCors(
    await proxyToEngine(request, '/api/v1/challenge', { method: 'GET' }),
  );
}
