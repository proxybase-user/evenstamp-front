import { ArrowRight, Server, Shield } from 'lucide-react';
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

const LAYERS = [
  { name: 'TCP TTL', color: 'bg-accent-purple text-white' },
  { name: 'JA4', color: 'bg-accent-pink text-white' },
  { name: 'WebGPU', color: 'bg-accent-blue text-white' },
  { name: 'Canvas', color: 'bg-accent-orange text-white' },
  { name: 'Polars', color: 'bg-accent-green text-ink' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-canvas">
      <div
        className="grid-backdrop pointer-events-none absolute inset-0 opacity-60 mask-fade-b"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="hairline-frame relative">
          <span className="crosshair -left-[5px] -top-[5px]" aria-hidden="true" />
          <span className="crosshair -right-[5px] -top-[5px]" aria-hidden="true" />

          <div className="grid grid-cols-1 items-start gap-10 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:py-20">
            <div className="min-w-0 space-y-6 lg:col-span-6">
              {/* Eyebrow per DESIGN.md: 15px / 500 / 1.5px tracking / uppercase */}
              <div className="flex items-center gap-2">
                <span className="eyebrow flex items-center gap-2 text-ink-secondary">
                  <Shield className="h-4 w-4 text-accent-blue" aria-hidden="true" />
                  FORENSIC TELEMETRY &amp; HARDWARE CORRELATION
                </span>
              </div>

              {/* Headline per DESIGN.md: display-xxl 80px / 600 / -0.8px tracking */}
              <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.8px] sm:text-6xl lg:text-[76px] xl:text-[80px]">
                Identify the physical machine.
              </h1>

              {/* Sub-headline / lead paragraph */}
              <p className="max-w-xl text-base leading-relaxed text-ink-body sm:text-lg">
                Anti-detect browsers fake a User-Agent in milliseconds. Evenstamp
                correlates{' '}
                <strong className="font-semibold text-ink">
                  TCP SYN TTL and MSS wire telemetry
                </strong>
                ,{' '}
                <strong className="font-semibold text-ink">
                  WebGPU silicon and shader timing
                </strong>
                ,{' '}
                <strong className="font-semibold text-ink">
                  canvas integrity traps
                </strong>
                , and{' '}
                <strong className="font-semibold text-ink">
                  Polars kinematic biometrics
                </strong>{' '}
                into one deterministic device identity across Chrome, Firefox, and Safari.
              </p>

              {/* Buttons per DESIGN.md: 4px radius (rounded-sm), 16px 500 */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#pricing"
                  className="button-primary"
                >
                  Start free — 25,000 calls / mo
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#architecture"
                  className="button-secondary"
                >
                  <Server className="h-4 w-4 text-accent-blue" aria-hidden="true" />
                  Deploy sovereign binary
                </a>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12px] text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <span
                    className="status-dot bg-accent-green"
                    aria-hidden="true"
                  />
                  No credit card required
                </span>
                <span>Single SQLite WAL storage</span>
                <span>GDPR &amp; ePrivacy ready</span>
              </div>

              {/* Code Snippet */}
              <div className="pt-2">
                <CodeBlock
                  title="npm i @evenstamp/sdk"
                  language="TypeScript"
                  code={SDK_SNIPPET}
                />
              </div>

              {/* Five chromatic layer tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {LAYERS.map((layer) => (
                  <span
                    key={layer.name}
                    className={`rounded-[4px] px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.04em] ${layer.color}`}
                  >
                    {layer.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Telemetry HUD */}
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
