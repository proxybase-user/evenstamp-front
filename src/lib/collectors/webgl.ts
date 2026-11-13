import type { WebGLSignals } from './types';
import { sha256Hex, utf8 } from './util';

export function emptyWebGLSignals(): WebGLSignals {
  return {
    supported: false,
    isWebGL2: false,
    vendor: '',
    renderer: '',
    version: '',
    shadingLanguageVersion: '',
    maxTextureSize: 0,
    maxCubeMapTextureSize: 0,
    maxRenderBufferSize: 0,
    maxVertexAttribs: 0,
    maxViewportDims: [0, 0],
    aliasedLineWidthRange: [0, 0],
    aliasedPointSizeRange: [0, 0],
    highpFloatPrecision: '',
    extensionsHash: '',
    gpuClearTimeMs: 0,
    shaderCompileTimeMs: 0,
  };
}

const CONTEXT_OPTIONS: WebGLContextAttributes = {
  powerPreference: 'high-performance',
  preserveDrawingBuffer: true,
  failIfMajorPerformanceCaveat: false,
  antialias: false,
};

export async function collectWebGLSignals(): Promise<WebGLSignals> {
  const empty = emptyWebGLSignals();
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;

  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl2', CONTEXT_OPTIONS) as WebGL2RenderingContext | null;
    if (!gl) {
      gl = canvas.getContext('webgl', CONTEXT_OPTIONS) as WebGLRenderingContext | null;
    }
  } catch {
    return empty;
  }
  if (!gl) return empty;

  const isWebGL2 =
    typeof WebGL2RenderingContext !== 'undefined' &&
    gl instanceof WebGL2RenderingContext;

  try {
    const debugExt = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugExt
      ? String(gl.getParameter(debugExt.UNMASKED_VENDOR_WEBGL))
      : String(gl.getParameter(gl.VENDOR));
    const renderer = debugExt
      ? String(gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL))
      : String(gl.getParameter(gl.RENDERER));

    const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    const highpFloatPrecision = precision
      ? `${precision.rangeMin}:${precision.rangeMax}:${precision.precision}`
      : 'none';

    const extensions = (gl.getSupportedExtensions() ?? []).slice().sort().join(',');
    let extensionsHash = '';
    try {
      extensionsHash = await sha256Hex(utf8(extensions));
    } catch {
      // WebCrypto can be unavailable in an insecure context. Keep the other
      // WebGL signals instead of failing the whole collector.
    }

    const clearStart = performance.now();
    gl.clearColor(0.15, 0.35, 0.65, 1.0);
    for (let i = 0; i < 400; i += 1) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.finish();
    }
    const gpuClearTimeMs = performance.now() - clearStart;

    const shaderStart = performance.now();
    const vertexSource = 'attribute vec2 p; void main(){gl_Position=vec4(p,0.0,1.0);}';
    const fragmentSource = `precision highp float;
      void main() {
        vec2 z = gl_FragCoord.xy / 256.0;
        float c = 0.0;
        for (int i = 0; i < 120; i++) {
          z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + vec2(0.35, 0.35);
          if (dot(z, z) > 4.0) { c = float(i); break; }
        }
        gl_FragColor = vec4(sin(c * 0.1), cos(c * 0.2), sin(c * 0.3), 1.0);
      }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (vertexShader && fragmentShader) {
      gl.shaderSource(vertexShader, vertexSource);
      gl.compileShader(vertexShader);
      gl.shaderSource(fragmentShader, fragmentSource);
      gl.compileShader(fragmentShader);

      const program = gl.createProgram();
      if (program) {
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const linked = gl.getProgramParameter(program, gl.LINK_STATUS) === true;
        if (linked) {
          gl.useProgram(program);
          const buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW,
          );
          const location = gl.getAttribLocation(program, 'p');
          if (location >= 0) {
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.finish();
            const pixel = new Uint8Array(4);
            gl.readPixels(128, 128, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
          }
        }
        gl.deleteProgram(program);
      }
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    }
    const shaderCompileTimeMs = performance.now() - shaderStart;

    const viewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as
      | Int32Array
      | [number, number];
    const lineWidth = gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE) as
      | Float32Array
      | [number, number];
    const pointSize = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) as
      | Float32Array
      | [number, number];

    return {
      supported: true,
      isWebGL2,
      vendor,
      renderer,
      version: String(gl.getParameter(gl.VERSION)),
      shadingLanguageVersion: String(gl.getParameter(gl.SHADING_LANGUAGE_VERSION)),
      maxTextureSize: Number(gl.getParameter(gl.MAX_TEXTURE_SIZE)),
      maxCubeMapTextureSize: Number(gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE)),
      maxRenderBufferSize: Number(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)),
      maxVertexAttribs: Number(gl.getParameter(gl.MAX_VERTEX_ATTRIBS)),
      maxViewportDims: [Number(viewport[0]), Number(viewport[1])],
      aliasedLineWidthRange: [Number(lineWidth[0]), Number(lineWidth[1])],
      aliasedPointSizeRange: [Number(pointSize[0]), Number(pointSize[1])],
      highpFloatPrecision,
      extensionsHash,
      gpuClearTimeMs,
      shaderCompileTimeMs,
    };
  } catch {
    return empty;
  } finally {
    try {
      const lose = gl.getExtension('WEBGL_lose_context') as
        | { loseContext(): void }
        | null;
      lose?.loseContext();
    } catch {
      // Ignore cleanup failures.
    }
  }
}

