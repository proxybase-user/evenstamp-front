import {
  proxyEngineAsset,
  publicAssetPreflight,
} from '@/lib/engine-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function OPTIONS() {
  return publicAssetPreflight();
}

export async function GET() {
  return proxyEngineAsset('/embed/v1.js');
}
