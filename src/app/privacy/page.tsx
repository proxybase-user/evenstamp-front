import type { Metadata } from 'next';
import CodeBlock from '@/components/CodeBlock';
import JsonLd from '@/components/JsonLd';
import SectionFrame from '@/components/SectionFrame';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { getBaseUrl, getBreadcrumbSchema } from '@/lib/seo-schemas';

const siteUrl = getBaseUrl();
const canonicalUrl = `${siteUrl}/privacy`;

export const metadata: Metadata = {
  title: 'Privacy & Data Handling',
  description:
    'What Evenstamp collects, how device identity is scoped, how long sessions are retained, and how to export or erase a DeviceID.',
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Privacy & Data Handling · Evenstamp',
    description:
      'What Evenstamp collects, how device identity is scoped, how long sessions are retained, and how to export or erase a DeviceID.',
    url: canonicalUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy & Data Handling · Evenstamp',
    description:
      'What Evenstamp collects, how device identity is scoped, how long sessions are retained, and how to export or erase a DeviceID.',
  },
};

const SIGNALS = [
  {
    title: 'Device & display',
    detail:
      'CPU core count, device memory when exposed, touch points, screen and available resolution, color depth, pixel ratio, color gamut, and HDR support.',
  },
  {
    title: 'GPU & rendering',
    detail:
      'WebGL vendor, renderer, limits, extensions hash, and shader/clear timings; WebGPU adapter information, limits hash, subgroup size, and atomic-contention timing; a hash of a rendered canvas and a numeric audio-render sum.',
  },
  {
    title: 'OS, locale & fonts',
    detail:
      'Platform, user agent, User-Agent Client Hints, timezone, languages, the resolved system-font family, measurements for 11 fixed font families, WASM math/timing signals, and speech-voice count/vendor families.',
  },
  {
    title: 'Integrity signals',
    detail:
      'WebDriver/automation globals, tampered property getters or prototypes, iframe/worker scope mismatches, canvas farbling, 2D-vs-WebGL readback mismatch, and CDP serializer/preload probes.',
  },
  {
    title: 'Network & edge',
    detail:
      'Challenge and optional WebRTC round-trip times, a local-IP-leaked boolean, and edge telemetry: ASN, JA4/H2 fingerprints, TCP TTL/MSS, TCP/TLS RTT, and a /24 or /48 network prefix.',
  },
  {
    title: 'Behavioral biometrics',
    detail:
      'Pointer coordinates, pressure, event type and high-resolution timing; key class (alphanumeric, backspace, modifier, other) and press/release timing; scroll deltas and timing; untrusted-event count; and an 8-dimensional kinematic summary.',
  },
  {
    title: 'Derived identifiers',
    detail:
      'A tenant/origin-scoped BrowserID, a random DeviceID, confidence, risk, spoof/automation score, privacy-tool flag, and anomaly codes. These are derived from the signals above.',
  },
];

export default function PrivacyPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Privacy', path: '/privacy' },
  ]);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy & Data Handling · Evenstamp',
    url: canonicalUrl,
    description:
      'What Evenstamp collects, how device identity is scoped, how long sessions are retained, and how to export or erase a DeviceID.',
    dateModified: '2026-11-07',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Evenstamp',
      url: siteUrl,
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={webPageSchema} />
      <SiteHeader />
      <main id="main-content">
        <SectionFrame id="privacy">
          <div className="max-w-3xl space-y-5">
            <div className="eyebrow">// Privacy &amp; data handling</div>
            <h1 className="text-3xl font-semibold leading-[1.1] sm:text-5xl lg:text-[56px] text-ink">
              What Evenstamp collects, and how to control it.
            </h1>
            <p className="text-base leading-relaxed text-ink-body">
              Evenstamp is device-identity and fraud-detection software. The
              deploying site is the data controller; Evenstamp is the engine.
              This page explains the exact signals, the storage boundaries, and
              the authenticated export/erase path for a DeviceID.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
              Last updated 2026-11-07 · Applies to SDK 1.x and engine v2.x
            </p>
          </div>
        </SectionFrame>

        <SectionFrame id="signals">
          <div className="max-w-3xl space-y-4">
            <div className="eyebrow">// Collected signals</div>
            <h2 className="text-2xl font-semibold sm:text-3xl text-ink">
              Signals collected by the browser SDK
            </h2>
            <p className="text-sm leading-relaxed text-ink-body">
              Collection is bounded and typed. Raw keystrokes, input values,
              page URLs, referrers, form contents, cookies, local storage, and
              clipboard contents are not collected.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {SIGNALS.map((signal) => (
              <article
                key={signal.title}
                className="card-feature !p-6"
              >
                <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent-green font-semibold">
                  {signal.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-body">
                  {signal.detail}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
            WebRTC/STUN is disabled by default. A deploying site can opt in to a
            first-party <span className="font-mono text-ink">stunUrl</span>;
            if it does, that STUN server sees the visitor&apos;s public IP and
            timing. The SDK does not enumerate installed fonts; it measures a
            fixed 11-family list.
          </p>
        </SectionFrame>

        <SectionFrame id="storage">
          <div className="max-w-3xl space-y-4">
            <div className="eyebrow">// Storage boundaries</div>
            <h2 className="text-2xl font-semibold sm:text-3xl text-ink">
              What is stored, and for how long
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="card-feature !p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent-blue font-semibold">
                Challenge binding
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Challenge binding is a one-way{' '}
                <span className="font-mono font-medium text-ink">HMAC-SHA256</span>{' '}
                of the network (ASN or prefix) plus an exact-IP tag used only to
                report address drift; the raw address is never stored. The
                binding exists for the nonce TTL (60 seconds by default) and is
                deleted on use or by GC.
              </p>
            </article>
            <article className="card-feature !p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent-blue font-semibold">
                Network prefix
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Long-lived identity rows store a truncated{' '}
                <span className="font-mono font-medium text-ink">/24</span> (IPv4) or{' '}
                <span className="font-mono font-medium text-ink">/48</span> (IPv6)
                prefix plus ASN, never the full client IP.
              </p>
            </article>
            <article className="card-feature !p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent-blue font-semibold">
                Sessions &amp; devices
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Sessions are retained for{' '}
                <span className="font-mono font-medium text-ink">FP_SESSION_RETENTION_DAYS</span>{' '}
                (90 days by default) or the tenant&apos;s own{' '}
                <span className="font-mono font-medium text-ink">retentionDays</span>{' '}
                (7–365 days), then removed by a six-hour GC. A device that is
                still being seen can persist for its device lifetime; the
                authenticated erase endpoint removes it and its links and
                sessions immediately.
              </p>
            </article>
            <article className="card-feature !p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent-blue font-semibold">
                Raw payload
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                The forensic{' '}
                <span className="font-mono font-medium text-ink">raw_sessions</span>{' '}
                archive is disabled by default. When an operator enables{' '}
                <span className="font-mono font-medium text-ink">FP_FORENSIC_ARCHIVE</span>,
                it stores the sanitized payload, allow-listed headers
                (credentials and cookies are stripped), and edge context for at
                most{' '}
                <span className="font-mono font-medium text-ink">FP_RAW_ARCHIVE_RETENTION_DAYS</span>{' '}
                (default 14, never more than 90). The client IP is a one-way
                HMAC plus prefix unless the operator explicitly opts into the
                raw address.{' '}
                <span className="font-mono font-medium text-ink">FP_STORE_RAW_PAYLOAD</span>{' '}
                controls the customer-facing session copy: when disabled
                (default), the dashboard shows a redaction marker instead of
                the raw payload.
              </p>
            </article>
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-body">
            <span className="font-medium text-ink">Account email.</span> Google
            OAuth provides the email address attached to your account. It is
            used for sign-in and for two transactional messages: a welcome email
            when the account is created and a usage warning when the account
            reaches 90% of its plan&apos;s included identifications. Delivery is
            handled by Resend. No marketing or third-party advertising email is
            sent.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-muted">
            Sensitive columns (biometric templates, behavioral summaries, stored
            raw payloads, and archive payloads/headers) are encrypted at rest
            with AES-256-GCM by default; each ciphertext is bound to its table,
            column, and tenant. SQLite uses{' '}
            <span className="font-mono font-medium text-ink">secure_delete=ON</span>{' '}
            and Unix file mode <span className="font-mono font-medium text-ink">0600</span>.
            Deletions and exports are recorded in a security audit log. Backups,
            WAL checkpoints, load balancers, WAFs, and hosting-provider logs are
            controlled by the deploying operator.
          </p>
        </SectionFrame>

        <SectionFrame id="controls">
          <div className="max-w-3xl space-y-4">
            <div className="eyebrow">// Export &amp; erase</div>
            <h2 className="text-2xl font-semibold sm:text-3xl text-ink">
              DeviceID controls
            </h2>
            <p className="text-sm leading-relaxed text-ink-body">
              The SDK returns a DeviceID in its verdict. End users should ask
              the site operator that displayed this notice. Customers and
              operators can use the authenticated engine endpoints with an
              admin bearer token or a tenant API key. Admin tokens can select a
              tenant with <span className="font-mono font-medium text-ink">X-Tenant-Id</span>;
              tenant API keys are scoped to their own tenant.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <CodeBlock
              title="Export a DeviceID"
              language="bash"
              code={`curl -sS \\
  -H "Authorization: Bearer $FP_ADMIN_TOKEN" \\
  https://your-engine.example/api/v1/devices/<device-id>`}
            />
            <CodeBlock
              title="Erase a DeviceID"
              language="bash"
              code={`curl -sS -X DELETE \\
  -H "Authorization: Bearer $FP_ADMIN_TOKEN" \\
  https://your-engine.example/api/v1/devices/<device-id>`}
            />
          </div>
          <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-ink-body">
            <p>
              <span className="font-mono font-medium text-ink">GET</span> returns the
              matching device row, browser-to-device links, and sessions,
              including confidence/risk, spoof/automation score, privacy flag,
              anomaly codes, behavioral summary, edge telemetry, and the stored
              raw payload or redaction marker.
            </p>
            <p>
              <span className="font-mono font-medium text-ink">DELETE</span> removes the
              device, cascades to its links and sessions, and deletes the
              device&apos;s raw archive rows. The deletion audit log retains
              tenant, DeviceID, actor type, and timestamp, but not the identity
              payload.
            </p>
          </div>
        </SectionFrame>

        <SectionFrame id="scope">
          <div className="max-w-3xl space-y-4">
            <div className="eyebrow">// Scope &amp; responsible use</div>
            <h2 className="text-2xl font-semibold sm:text-3xl text-ink">
              Limits and responsibilities
            </h2>
            <ul className="space-y-3 text-sm leading-relaxed text-ink-body">
              <li>
                Device fingerprinting and behavioral biometrics can be personal
                data, and behavioral biometrics may be special-category data.
                The deploying site must have a lawful basis, a privacy notice,
                and a deletion path.
              </li>
              <li>
                BrowserID is scoped by tenant and, by default, by the request
                Origin host when present. The deploying site remains the data
                controller; Evenstamp does not sell or broker identity graphs.
              </li>
              <li>
                The engine is intended for fraud prevention, account security,
                and abuse mitigation, not surveillance or discriminatory
                pricing. Risk scores are advisory and should not be the sole
                basis for punishment.
              </li>
              <li>
                The visitor playground is a strict dry run: it computes a report
                without writing a device, session, link, or raw archive row, and
                it redacts the client IP to a prefix or placeholder. It still
                samples behavior on load and discloses that in its footer.
              </li>
            </ul>
            <p className="pt-2 text-sm text-ink-muted">
              For access, correction, or erasure, contact the operator of the
              site that showed you this notice. For engine/operator questions,
              use the authenticated export and erase endpoints above.
            </p>
          </div>
        </SectionFrame>
      </main>
      <SiteFooter />
    </>
  );
}
