export interface WebGLSignals {
  supported: boolean;
  isWebGL2: boolean;
  vendor: string;
  renderer: string;
  version: string;
  shadingLanguageVersion: string;
  maxTextureSize: number;
  maxCubeMapTextureSize: number;
  maxRenderBufferSize: number;
  maxVertexAttribs: number;
  maxViewportDims: [number, number];
  aliasedLineWidthRange: [number, number];
  aliasedPointSizeRange: [number, number];
  highpFloatPrecision: string;
  /** SHA-256 hex of the sorted, comma-joined WebGL extension list. */
  extensionsHash: string;
  gpuClearTimeMs: number;
  shaderCompileTimeMs: number;
}

export interface WebGpuSignals {
  supported: boolean;
  vendor: string;
  architecture: string;
  device: string;
  description: string;
  /** Hardware subgroup (warp/wavefront) width, when the adapter exposes it. */
  subgroupMinSize: number;
  subgroupMaxSize: number;
  /** Hash of the adapter's high-entropy limit tuple. */
  limitsHash: string;
  /** Wall time of the WGSL atomic-contention compute probe. */
  computeAtomicTimeMs: number;
}

export interface SpeechSynthesisSignals {
  available: boolean;
  voiceCount: number;
  /** Normalized vendor families: `apple`, `microsoft`, `google`, `other`. */
  voiceFamilies: string[];
}

