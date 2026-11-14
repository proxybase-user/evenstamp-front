import { CheckCircle2, Cloud, Container, ShieldCheck } from 'lucide-react';
import CodeBlock from './CodeBlock';
import SectionFrame from './SectionFrame';

const STEPS = [
  {
    step: '01',
    title: 'Paste the snippet',
    description:
      'Add the script to your signup, login, or checkout page, or install it from npm.',
  },
  {
    step: '02',
    title: 'Get the Device ID & Risk Score',
    description:
      'Before you grant a trial, apply a coupon, or take a payment, Evenstamp tells you whether the device is new or a repeat abuser.',
  },
  {
    step: '03',
    title: 'Block or challenge automatically',
    description:
      'If the risk score is over 70, block the signup, deny the promo code, or ask for phone verification. Real customers do not notice.',
  },
];

const PROXY_CODE = `// app/api/v1/ingest/route.ts - first-party proxy (runs on your domain)
import { NextRequest, NextResponse } from 'next/server';

const ENGINE = process.env.RUST_BACKEND_INTERNAL_URL!;

export async function POST(req: NextRequest) {
  const upstream = await fetch(\`\${ENGINE}/api/v1/ingest\`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': req.headers.get('x-forwarded-for') ?? '',
    },
    body: await req.text(),
    cache: 'no-store',
  });

  return NextResponse.json(await upstream.json(), {
    status: upstream.status,
  });
}`;

const SELF_HOST_CODE = `# Self-hosted private deployment (Scale & Sovereign plan)
# One binary, one SQLite file, no external network dependencies.
export FP_MASTER_SECRET="$(openssl rand -base64 32)"

docker run -p 8080:8080 \\
  -e FP_MASTER_SECRET \\
  -e FP_DATABASE_URL=sqlite:///data/evenstamp.db \\
  -e FP_TRUSTED_PROXIES=172.16.0.0/12 \\
  -v evenstamp-data:/data \\
  ghcr.io/evenstamp/engine:latest`;

const HEADERS = [
  ['X-Forwarded-For', 'Client IP from the edge'],
  ['X-Client-Port', 'Source TCP port for exact SYN matching'],
  ['X-ASN', 'Autonomous system number'],
  ['X-JA4-Fingerprint', 'TLS ClientHello JA4'],
  ['X-H2-Fingerprint', 'HTTP/2 settings + window fingerprint'],
  ['X-TCP-TTL', 'Observed SYN TTL'],
  ['X-TCP-MSS', 'SYN MSS option'],
  ['X-TCP-RTT-MS', 'TCP handshake RTT'],
  ['X-TLS-RTT-MS', 'TLS handshake RTT'],
];

export default function IntegrationSection() {
  return (
    <SectionFrame id="integration">
      <div className="max-w-3xl space-y-4">
        <div className="eyebrow">// Live in under 5 minutes</div>
        <h2 className="text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[44.8px] lg:leading-[46.6px]">
          No security team required. Add it to your signup or checkout flow.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-body">
          Use the managed cloud API or self-host the binary. Both install with a few
          lines of code.
        </p>
      </div>

      {/* 3 Simple Steps */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="card-feature space-y-3 relative border-l-2 border-l-accent-green"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-bold text-accent-green">
                {s.step}
              </span>
              <CheckCircle2 className="h-5 w-5 text-accent-green/80" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-ink">
              {s.title}
            </h3>
            <p className="text-sm leading-relaxed text-ink-body">
              {s.description}
            </p>
          </div>
        ))}
      </div>

      {/* Deployment paths: Cloud vs Sovereign */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card-feature space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-hairline bg-surface-2 text-accent-blue">
              <Cloud className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink">
                Managed cloud · first-party proxy
              </h3>
              <p className="font-mono text-[11px] text-ink-muted">
                Next.js route handler -&gt; Evenstamp Cloud
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-ink-body">
            Privacy extensions block third-party fingerprinting domains. Routing
            through your own origin avoids those blocklists and keeps the check
            on your domain.
          </p>
          <CodeBlock
            title="app/api/v1/ingest/route.ts"
            language="TypeScript"
            code={PROXY_CODE}
          />
        </div>

        <div className="card-feature space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-hairline bg-surface-2 text-accent-green">
              <Container className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink">
                Sovereign · single private binary
              </h3>
              <p className="font-mono text-[11px] text-ink-muted">
                Docker, bare metal, or your own private VPC
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-ink-body">
            If you have strict compliance or zero-telemetry requirements, run
            the single-file container on your own infrastructure. No per-call
            fees, no external egress.
          </p>
          <CodeBlock
            title="docker run"
            language="Bash"
            code={SELF_HOST_CODE}
          />
        </div>
      </div>

      {/* Edge Header Contract */}
      <div className="card-feature mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr] lg:p-8">
        <div className="space-y-3">
          <div className="eyebrow-sm flex items-center gap-2 text-accent-blue">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Edge header contract
          </div>
          <h3 className="text-xl font-semibold text-ink">
            The proxy supplies wire facts. The engine makes the call.
          </h3>
          <p className="text-sm leading-relaxed text-ink-body">
            The engine honors headers only when the TCP peer is inside{' '}
            <span className="font-mono font-medium text-ink">
              FP_TRUSTED_PROXIES
            </span>
            . It ignores headers from anywhere else.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
          {HEADERS.map(([header, desc]) => (
            <div key={header} className="min-w-0 border-b border-hairline py-2">
              <div className="truncate font-mono text-[12px] font-medium text-ink">
                {header}
              </div>
              <div className="mt-0.5 text-[11px] text-ink-muted">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
