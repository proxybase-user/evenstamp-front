import { ArrowRight, Server, Zap } from 'lucide-react';
import CodeBlock from './CodeBlock';
import TelemetryHudClient from './TelemetryHudClient';

const SDK_SNIPPET = `import { EvenstampAgent } from '@evenstamp/sdk';

// 1. Load the WASM + behavioral collectors.
const stamp = await EvenstampAgent.load({
  endpoint: '/api/v1', // first-party proxy, not a blocked third party
});

// 2. Resolve the cross-browser device and risk verdict.
const verdict = await stamp.identify();
// => { deviceId: "dev_7c44a912-…", riskScore: 3, anomalies: [] }`;

const LAYERS = ['TCP TTL', 'JA4', 'WebGPU', 'Canvas', 'CDP', 'Polars'];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07]">
      <div
        className="grid-backdrop pointer-events-none absolute inset-0 opacity-80 mask-fade-b"
        aria-hidden="true"
      />
      <div
        className="radial-fade pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="hairline-frame relative">
          <span className="crosshair -left-[5px] -top-[5px]" aria-hidden="true" />
          <span className="crosshair -right-[5px] -top-[5px]" aria-hidden="true" />

          <div className="grid grid-cols-1 items-start gap-10 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:py-20">
            <div className="min-w-0 space-y-6 lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-emerald-400">
                <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                Zero-trust device identity
              </div>

              <h1 className="text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]">
                Identify the physical machine.{' '}
                <span className="text-emerald-gradient">
                  Unmask every spoofed VM.
                </span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg">
                Anti-detect browsers fake a User-Agent in milliseconds.
                Evenstamp correlates{' '}
                <strong className="font-medium text-ink-primary">
                  TCP SYN TTL and MSS wire telemetry
                </strong>
                ,{' '}
                <strong className="font-medium text-ink-primary">
                  WebGPU silicon and shader timing
                </strong>
                ,{' '}
                <strong className="font-medium text-ink-primary">
                  canvas integrity traps
                </strong>
                , and{' '}
                <strong className="font-medium text-ink-primary">
                  Polars kinematic biometrics
                </strong>{' '}
                into one device identity across Chrome, Firefox, and Safari.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-emerald-glow transition hover:bg-emerald-400"
                >
                  Start free — 25,000 calls / mo
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#architecture"
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-ink-primary transition hover:bg-white/[0.07]"
                >
                  <Server className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                  Deploy the single binary
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <span
                    className="status-dot bg-emerald-400"
                    aria-hidden="true"
                  />
                  No credit card
                </span>
                <span>Self-host from one container</span>
                <span>GDPR-ready by default</span>
              </div>

              <div className="pt-2">
                <CodeBlock
                  title="npm i @evenstamp/sdk"
                  language="TypeScript"
                  code={SDK_SNIPPET}
                />
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {LAYERS.map((layer) => (
                  <span
                    key={layer}
                    className="rounded border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-secondary"
                  >
                    {layer}
                  </span>
                ))}
              </div>
            </div>

            <div className="min-w-0 lg:col-span-6">
              <TelemetryHudClient />
            </div>
          </div>

          <span
            className="crosshair -bottom-[5px] -left-[5px]"
            aria-hidden="true"
          />
          <span
            className="crosshair -bottom-[5px] -right-[5px]"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
