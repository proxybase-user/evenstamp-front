import type { Metadata } from 'next';
import CodeBlock from '@/components/CodeBlock';
import SectionFrame from '@/components/SectionFrame';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Privacy & data handling',
  description:
    'What Evenstamp collects, how device identity is scoped, how long sessions are retained, and how to export or erase a DeviceID.',
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
  return (
    <>
      <SiteHeader />
      <main>
        <SectionFrame id="privacy">
          <div className="max-w-3xl space-y-5">
            <div className="eyebrow">// Privacy & data handling</div>
            <h1 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">
              What Evenstamp collects, and how to control it.
            </h1>
            <p className="text-base leading-relaxed text-ink-secondary">
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
            <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Signals collected by the browser SDK
            </h2>
            <p className="text-sm leading-relaxed text-ink-secondary">
              Collection is bounded and typed. Raw keystrokes, input values,
              page URLs, referrers, form contents, cookies, local storage, and
              clipboard contents are not collected.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {SIGNALS.map((signal) => (
              <article
                key={signal.title}
                className="surface-card rounded-xl border border-white/[0.07] p-5"
              >
                <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-emerald-400">
                  {signal.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  {signal.detail}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
            WebRTC/STUN is disabled by default. A deploying site can opt in to a
            first-party <span className="font-mono text-ink-secondary">stunUrl</span>;
            if it does, that STUN server sees the visitor&apos;s public IP and
            timing. The SDK does not enumerate installed fonts; it measures a
            fixed 11-family list.
          </p>
        </SectionFrame>

        <SectionFrame id="storage">
          <div className="max-w-3xl space-y-4">
            <div className="eyebrow">// Storage boundaries</div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              What is stored, and for how long
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="surface-card rounded-xl border border-white/[0.07] p-5">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-cyan-400">
                Challenge binding
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                The challenge row stores a one-way{' '}
                <span className="font-mono text-ink-code">HMAC-SHA256</span> of
                the client IP, not the raw address. It exists for the nonce TTL
                (60 seconds by default) and is deleted on use or by GC.
              </p>
            </article>
            <article className="surface-card rounded-xl border border-white/[0.07] p-5">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-cyan-400">
                Network prefix
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                Long-lived identity rows store a truncated{' '}
                <span className="font-mono text-ink-code">/24</span> (IPv4) or{' '}
                <span className="font-mono text-ink-code">/48</span> (IPv6)
                prefix plus ASN, never the full client IP.
              </p>
            </article>
            <article className="surface-card rounded-xl border border-white/[0.07] p-5">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-cyan-400">
                Sessions &amp; devices
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                Sessions are retained for{' '}
                <span className="font-mono text-ink-code">FP_SESSION_RETENTION_DAYS</span>{' '}
                (90 days by default), then removed by a six-hour GC. A device
                that is still being seen can persist for its device lifetime;
                the authenticated erase endpoint removes it and its links and
                sessions immediately.
              </p>
            </article>
            <article className="surface-card rounded-xl border border-white/[0.07] p-5">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-cyan-400">
                Raw payload
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                Full raw payload storage is off by default
                (<span className="font-mono text-ink-code">FP_STORE_RAW_PAYLOAD=false</span>).
                When disabled, the session stores a redaction marker; the
                derived device profile, font metrics, behavioral vector, scores,
                and edge telemetry are still stored. When enabled, the full
                typed payload is stored for the session retention period.
              </p>
            </article>
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
            SQLite uses <span className="font-mono text-ink-secondary">secure_delete=ON</span>{' '}
            and Unix file mode <span className="font-mono text-ink-secondary">0600</span>.
            Deletions are recorded in a separate deletion audit log. Backups,
            WAL checkpoints, load balancers, WAFs, and hosting-provider logs are
            controlled by the deploying operator.
          </p>
        </SectionFrame>

        <SectionFrame id="controls">
          <div className="max-w-3xl space-y-4">
            <div className="eyebrow">// Export &amp; erase</div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              DeviceID controls
            </h2>
            <p className="text-sm leading-relaxed text-ink-secondary">
              The SDK returns a DeviceID in its verdict. End users should ask
              the site operator that displayed this notice. Customers and
              operators can use the authenticated engine endpoints with an
              admin bearer token or a tenant API key. Admin tokens can select a
              tenant with <span className="font-mono text-ink-code">X-Tenant-Id</span>;
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
          <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-ink-secondary">
            <p>
              <span className="font-mono text-ink-code">GET</span> returns the
              matching device row, browser-to-device links, and sessions,
              including confidence/risk, spoof/automation score, privacy flag,
              anomaly codes, behavioral summary, edge telemetry, and the stored
              raw payload or redaction marker.
            </p>
            <p>
              <span className="font-mono text-ink-code">DELETE</span> removes the
              device and cascades to its links and sessions. The deletion audit
              log retains tenant, DeviceID, actor type, and timestamp, but not
              the identity payload.
            </p>
          </div>
        </SectionFrame>

        <SectionFrame id="scope">
          <div className="max-w-3xl space-y-4">
            <div className="eyebrow">// Scope &amp; responsible use</div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Limits and responsibilities
            </h2>
            <ul className="space-y-3 text-sm leading-relaxed text-ink-secondary">
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
                The visitor playground is a dry run: it computes a report
                without storing a device or session row, and it redacts the
                client IP to a prefix or placeholder. It still samples behavior
                on load and discloses that in its footer.
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
