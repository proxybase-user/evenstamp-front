/**
 * Canvas integrity traps.
 *
 * Privacy tools and anti-detect browsers defeat canvas identification by
 * injecting low-amplitude noise into readback paths. Two invariants expose the
 * injection without relying on the rendered content being unique:
 *
 *  - Trap A: an axis-aligned integer fill must read back exactly. Any real GPU
 *    or rasterizer produces the same 64 pixels.
 *  - Trap B: the 2D readback and a WebGL texture-upload/readback of the same
 *    canvas must agree. Hooking `getImageData`/`toDataURL` cannot poison the
 *    C++ graphics upload path.
 */

export interface CanvasIntegrityResult {
  farblingDetected: boolean;
  webglBridgeMismatch: boolean;
  canvasGeometryHash: string;
}

export function emptyCanvasIntegrity(): CanvasIntegrityResult {
  return {
    farblingDetected: false,
    webglBridgeMismatch: false,
    canvasGeometryHash: '',
  };
}

export function runCanvasForensicTraps(): CanvasIntegrityResult {
  const result = emptyCanvasIntegrity();
  if (typeof document === 'undefined') return result;

  result.farblingDetected = detectFarbling();
  result.canvasGeometryHash = bridgeReadback(result);
  return result;
}

/** Trap A: exact integer fill invariant. */
function detectFarbling(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = 'copy';
    ctx.fillStyle = 'rgb(90, 156, 230)';
    ctx.fillRect(0, 0, 8, 8);

    const data = ctx.getImageData(0, 0, 8, 8).data;
    for (let index = 0; index < data.length; index += 4) {
      if (
        data[index] !== 90 ||
        data[index + 1] !== 156 ||
        data[index + 2] !== 230 ||
        data[index + 3] !== 255
      ) {
        return true;
      }
    }
  } catch {
    // A blocked readback is not evidence of farbling.
  }
  return false;
}

/** Trap B: compare 2D readback with WebGL texture readback. */
function bridgeReadback(result: CanvasIntegrityResult): string {
  try {
    const c2d = document.createElement('canvas');
    c2d.width = 64;
    c2d.height = 32;
    const ctx = c2d.getContext('2d', { willReadFrequently: true });
    if (!ctx) return '';

    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(10, 1, 42, 20);
    ctx.fillStyle = '#069';
    ctx.font = '14px Arial';
    ctx.fillText('Evenstamp⚡', 2, 15);

    const directPixels = ctx.getImageData(0, 0, 64, 32).data;
    const hash = fnv1aHex(directPixels);

    const glCanvas = document.createElement('canvas');
    glCanvas.width = 64;
    glCanvas.height = 32;
    const gl =
      (glCanvas.getContext('webgl', { antialias: false }) as WebGLRenderingContext | null) ??
      (glCanvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return hash;

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c2d);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      return hash;
    }

    const glPixels = new Uint8Array(64 * 32 * 4);
    gl.readPixels(0, 0, 64, 32, gl.RGBA, gl.UNSIGNED_BYTE, glPixels);

    // Allow single-channel rounding differences from color-space conversion.
    // A 2D-only hook diverges across large contiguous regions, not a handful
    // of least-significant bits.
    let significantDifferences = 0;
    for (let index = 0; index < directPixels.length; index += 1) {
      if (Math.abs(directPixels[index] - glPixels[index]) > 1) {
        significantDifferences += 1;
        if (significantDifferences > 16) {
          result.webglBridgeMismatch = true;
          break;
        }
      }
    }
    return hash;
  } catch {
    return result.canvasGeometryHash;
  }
}

function fnv1aHex(bytes: Uint8ClampedArray): string {
  let hash = 2166136261;
  for (let index = 0; index < bytes.length; index += 1) {
    hash ^= bytes[index];
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

