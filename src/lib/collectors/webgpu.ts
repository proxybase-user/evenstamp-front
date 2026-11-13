import type { WebGpuSignals } from './types';
import { sha256Hex, utf8 } from './util';

interface GpuAdapterInfoLike {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
  subgroupMinSize?: number;
  subgroupMaxSize?: number;
}

interface GpuAdapterLike {
  info?: GpuAdapterInfoLike;
  requestAdapterInfo?: () => Promise<GpuAdapterInfoLike>;
  limits?: Record<string, number | undefined>;
  requestDevice?: () => Promise<GpuDeviceLike>;
}

interface GpuDeviceLike {
  createShaderModule(descriptor: { code: string }): unknown;
  createComputePipeline(descriptor: {
    layout: string;
    compute: { module: unknown; entryPoint: string };
  }): {
    getBindGroupLayout(index: number): unknown;
  };
  createBuffer(descriptor: { size: number; usage: number }): unknown;
  createBindGroup(descriptor: {
    layout: unknown;
    entries: Array<{ binding: number; resource: { buffer: unknown } }>;
  }): unknown;
  createCommandEncoder(): {
    beginComputePass(): {
      setPipeline(pipeline: unknown): void;
      setBindGroup(index: number, bindGroup: unknown): void;
      dispatchWorkgroups(count: number): void;
      end(): void;
    };
    finish(): unknown;
  };
  queue: {
    submit(commandBuffers: unknown[]): void;
    onSubmittedWorkDone(): Promise<void>;
  };
  destroy(): void;
}

interface GpuLike {
  requestAdapter(options?: { powerPreference?: string }): Promise<GpuAdapterLike | null>;
}

export function emptyWebGpuSignals(): WebGpuSignals {
  return {
    supported: false,
    vendor: '',
    architecture: '',
    device: '',
    description: '',
    subgroupMinSize: 0,
    subgroupMaxSize: 0,
    limitsHash: '',
    computeAtomicTimeMs: 0,
  };
}

export async function collectWebGpuSignals(): Promise<WebGpuSignals> {
  const nav = navigator as Navigator & { gpu?: GpuLike };
  if (!nav.gpu) return emptyWebGpuSignals();

  try {
    const adapter = await nav.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) return emptyWebGpuSignals();

    let info: GpuAdapterInfoLike = adapter.info ?? {};
    if (!adapter.info && adapter.requestAdapterInfo) {
      try {
        info = await adapter.requestAdapterInfo();
      } catch {
        info = {};
      }
    }

    const limits = adapter.limits ?? {};
    const limitsRaw = [
      limits.maxTextureDimension2D,
      limits.maxBindGroups,
      limits.maxUniformBufferBindingSize,
      limits.maxStorageBufferBindingSize,
      limits.maxComputeWorkgroupStorageSize,
      limits.maxComputeInvocationsPerWorkgroup,
      limits.maxComputeWorkgroupSizeX,
      limits.maxColorAttachmentBytesPerSample,
    ].join(':');
    const limitsHash = await safeHash(limitsRaw);

    const computeAtomicTimeMs = await runAtomicContentionProbe(adapter);

    return {
      supported: true,
      vendor: String(info.vendor ?? ''),
      architecture: String(info.architecture ?? ''),
      device: String(info.device ?? ''),
      description: String(info.description ?? ''),
      subgroupMinSize: Number(info.subgroupMinSize ?? 0),
      subgroupMaxSize: Number(info.subgroupMaxSize ?? 0),
      limitsHash,
      computeAtomicTimeMs,
    };
  } catch {
    return emptyWebGpuSignals();
  }
}

async function safeHash(value: string): Promise<string> {
  try {
    return await sha256Hex(utf8(value));
  } catch {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
  }
}

/**
 * Runs a tiny WGSL shader whose 16k uncoordinated atomic adds serialize on
 * the GPU's L1 cache. A CPU-emulated adapter (SwiftShader, Lavapipe) finishes
 * one to two orders of magnitude slower than a physical GPU.
 */
async function runAtomicContentionProbe(adapter: GpuAdapterLike): Promise<number> {
  if (!adapter.requestDevice) return 0;

  let device: GpuDeviceLike | null = null;
  try {
    device = await adapter.requestDevice();
    const shader = device.createShaderModule({
      code: `
        @group(0) @binding(0) var<storage, read_write> counter: atomic<u32>;
        @compute @workgroup_size(64)
        fn main() {
          for (var i: u32 = 0u; i < 256u; i = i + 1u) {
            atomicAdd(&counter, 1u);
          }
        }
      `,
    });
    const pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module: shader, entryPoint: 'main' },
    });
    // GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC.
    const buffer = device.createBuffer({ size: 4, usage: 0x0080 | 0x0004 });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer } }],
    });

    const started = performance.now();
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(64);
    pass.end();
    device.queue.submit([encoder.finish()]);

    await Promise.race([
      device.queue.onSubmittedWorkDone(),
      new Promise<void>((resolve) => setTimeout(resolve, 1_500)),
    ]);
    return Number((performance.now() - started).toFixed(3));
  } catch {
    return 0;
  } finally {
    try {
      device?.destroy();
    } catch {
      // Ignore cleanup failures.
    }
  }
}

