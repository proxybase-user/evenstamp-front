import { Cloud, Container, ShieldCheck } from 'lucide-react';
import CodeBlock from './CodeBlock';
import SectionFrame from './SectionFrame';

const PROXY_CODE = `// app/api/v1/ingest/route.ts — first-party, not a blocked third party
import { NextRequest, NextResponse } from 'next/server';

const ENGINE = process.env.RUST_BACKEND_INTERNAL_URL!;

export async function POST(req: NextRequest) {
  const upstream = await fetch(\`\${ENGINE}/api/v1/ingest\`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': req.headers.get('x-forwarded-for') ?? '',
      // Wire headers are forwarded only when a trusted edge sets them.
    },
    body: await req.text(),
    cache: 'no-store',
  });

  return NextResponse.json(await upstream.json(), {
    status: upstream.status,
  });
}`;

const SELF_HOST_CODE = `# One binary, one SQLite file, no external services.
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
        <div className="eyebrow">// Deployment paths</div>
        <h2 className="text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[44.8px] lg:leading-[46.6px]">
          Two paths into production. One engine.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-body">
          Run the managed edge, or put the entire Rust binary inside your own
          VPC. The wire contract, anomaly engine, and identity graph are
          identical in both.
        </p>
      </div>

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
                Next.js route handler → Rust engine
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-ink-body">
            Privacy extensions block third-party fingerprinting domains. Routing
            through your own origin bypasses those blocklists without weakening
            the ECDH envelope or the single-use nonce.
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
                Sovereign · single binary
              </h3>
              <p className="font-mono text-[11px] text-ink-muted">
                Docker, bare metal, or your own VPC
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-ink-body">
            Regulated environments cannot egress device telemetry. One sovereign
            container with zero external dependencies satisfies strict residency
            and GDPR Article 28 data processor obligations.
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
            The proxy supplies wire facts. The engine supplies the verdict.
          </h3>
          <p className="text-sm leading-relaxed text-ink-body">
            Headers are honored only when the TCP peer is inside{' '}
            <span className="font-mono font-medium text-ink">
              FP_TRUSTED_PROXIES
            </span>
            . Untrusted headers are ignored.
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
