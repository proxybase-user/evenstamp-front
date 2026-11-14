export function toHex(bytes: Uint8Array): string {
  let out = '';
  for (const byte of bytes) {
    out += byte.toString(16).padStart(2, '0');
  }
  return out;
}

export function bufferSource(bytes: Uint8Array): BufferSource {
  return bytes as unknown as BufferSource;
}

export function utf8(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

export async function sha256Hex(data: Uint8Array): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('WebCrypto subtle unavailable');
  }
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    bufferSource(data),
  );
  return toHex(new Uint8Array(digest));
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function finiteOr(value: unknown, fallback = 0): number {
  return isFiniteNumber(value) ? value : fallback;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

