import { ArrowRight, Shield, ShieldCheck } from 'lucide-react';
import CodeBlock from './CodeBlock';
import TelemetryHudClient from './TelemetryHudClient';

const SDK_SNIPPET = `import { EvenstampAgent } from '@evenstamp/sdk';

// 1. Add Evenstamp to your signup, login, or checkout page
const stamp = await EvenstampAgent.load({ endpoint: '/api/v1' });

// 2. Check if this device has been here before
const verdict = await stamp.identify();
// => { deviceId: "dev_7c44a912", riskScore: 3, verdict: "Safe Customer" }`;

const VALUE_PILLS = [
  { name: 'Stops Free-Trial Abuse', color: 'bg-accent-purple text-white' },
  { name: 'Blocks Multi-Accounting', color: 'bg-accent-pink text-white' },
  { name: 'Unmasks VPNs & Proxies', color: 'bg-accent-blue text-white' },
  { name: 'Catches Scraping Bots', color: 'bg-accent-orange text-white' },
  { name: 'Prevents Chargebacks', color: 'bg-accent-green text-ink' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-canvas">
      <div
        className="grid-backdrop pointer-events-none absolute inset-0 opacity-60 mask-fade-b"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hairline-frame relative">
          <span className="crosshair -left-[5px] -top-[5px]" aria-hidden="true" />
          <span className="crosshair -right-[5px] -top-[5px]" aria-hidden="true" />

          <div className="grid grid-cols-1 items-start gap-10 px-4 py-10 sm:px-8 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
            <div className="min-w-0 space-y-6 lg:col-span-6">
              {/* Eyebrow badge */}
              <div className="flex items-center gap-2">
                <span className="eyebrow flex items-center gap-2 text-ink-secondary text-xs sm:text-[15px]">
                  <Shield className="h-4 w-4 text-accent-blue shrink-0" aria-hidden="true" />
                  <span>STOP FAKE ACCOUNTS · PROMO ABUSE · BOTS</span>
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.5px] sm:text-5xl sm:leading-[1.05] sm:tracking-[-0.8px] lg:text-[62px] xl:text-[70px] break-words">
                Know when it&apos;s the same person, even if they clear cookies, switch browsers, or use a VPN.
              </h1>

              {/* Sub-headline / lead paragraph */}
              <p className="max-w-xl text-base leading-relaxed text-ink-body sm:text-lg">
                Scammers and bots hide behind Incognito mode, VPNs, and
                &quot;anti-detect&quot; browsers to burn through free trials, abuse promo codes,
                and create fake accounts. Evenstamp looks past the browser to identify the
                actual computer or phone, so one person can&apos;t pretend to be a hundred.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  href="/pricing"
                  className="button-primary justify-center text-center w-full sm:w-auto"
                >
                  View Plans
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#detection"
                  className="button-secondary justify-center text-center w-full sm:w-auto"
                >
                  <ShieldCheck className="h-4 w-4 text-accent-blue" aria-hidden="true" />
                  See What We Catch
                </a>
              </div>

              {/* Trust micro-copy */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12px] text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <span
                    className="status-dot bg-accent-green"
                    aria-hidden="true"
                  />
                  5-minute setup
                </span>
                <span>Works across Chrome, Safari &amp; Firefox</span>
                <span>GDPR &amp; privacy compliant</span>
              </div>

              {/* Code Snippet */}
              <div className="pt-2">
                <CodeBlock
                  title="2-Line Website Setup"
                  language="TypeScript"
                  code={SDK_SNIPPET}
                />
              </div>

              {/* Five outcome pill tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {VALUE_PILLS.map((pill) => (
                  <span
                    key={pill.name}
                    className={`rounded-[4px] px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.04em] ${pill.color}`}
                  >
                    {pill.name}
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
