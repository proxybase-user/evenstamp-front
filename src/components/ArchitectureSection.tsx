import {
  Activity,
  Cpu,
  Database,
  Eye,
  Network,
} from 'lucide-react';
import SectionFrame from './SectionFrame';

const CATEGORY_CARDS = [
  {
    category: 'category-card-purple',
    badge: 'L3 · WIRE TELEMETRY',
    title: 'Native SYN wire sniffer',
    subtitle: 'Kernel cBPF · 60 B TCP SYN · TTL & MSS',
    description:
      'A zero-dependency AF_PACKET listener with a kernel cBPF filter copies the initial 60-byte TCP SYN. It infers the true client OS from the initial TTL and reads the MSS option to unmask WireGuard, OpenVPN, and IPsec encapsulation before user space runs.',
    tech: 'cBPF → SYN · 96 B → TTL:64 / MSS:1380',
    icon: Network,
    textClass: 'text-white',
    badgeClass: 'bg-white/20 text-white',
    colSpan: 'lg:col-span-7',
  },
  {
    category: 'category-card-pink',
    badge: 'L1 · SILICON & SHADERS',
    title: 'WebGPU silicon probes',
    subtitle: 'WGSL atomic contention · raymarch latency',
    description:
      'A 120-iteration fragment shader and a WGSL atomic-contention kernel measure the physical GPU silicon. Spoofed renderer strings cannot fake shader pipeline latency or hypervisor steal-time jitter.',
    tech: 'clear(400) → raymarch(120) → atomic(16k)',
    icon: Cpu,
    textClass: 'text-white',
    badgeClass: 'bg-white/20 text-white',
    colSpan: 'lg:col-span-5',
  },
  {
    category: 'category-card-blue',
    badge: 'L2 · CANVAS & RUNTIME',
    title: 'Canvas integrity traps',
    subtitle: 'CDP side channels · anti-detect unmasking',
    description:
      'Multi-pass sub-pixel canvas rendering, synthetic emoji font metrics, and CDP serializer timing detect browser spoofing engines and headless automation before DOM manipulation begins.',
    tech: 'Canvas 2D / WebGL2 → CDP serializer → Speech synthesis',
    icon: Eye,
    textClass: 'text-white',
    badgeClass: 'bg-white/20 text-white',
    colSpan: 'lg:col-span-4',
  },
  {
    category: 'category-card-orange',
    badge: 'L4 · POLARS KINEMATICS',
    title: 'Vectorized behavioral engine',
    subtitle: 'Columnar LazyFrame · motor control',
    description:
      'Pointer, keystroke, wheel, and touch events stream into an in-memory Polars LazyFrame. Third-order jerk, path collinearity, flight distributions, and scroll inertia separate human motor control from scripted bot curves.',
    tech: 'LazyFrame → 3rd-order jerk → dwell/flight → 8D vector',
    icon: Activity,
    textClass: 'text-white',
    badgeClass: 'bg-white/20 text-white',
    colSpan: 'lg:col-span-4',
  },
  {
    category: 'category-card-green',
    badge: 'STORAGE · IDENTITY GRAPH',
    title: 'Sovereign SQLite engine',
    subtitle: 'ECDH P-256 · WAL mode · single binary',
    description:
      'Every payload is sealed with ECDH P-256 and AES-256-GCM against single-use nonces consumed via DELETE … RETURNING. Cross-browser devices and sessions live in one sovereign SQLite file. No Redis, no Postgres, no cluster.',
    tech: 'ECDH P-256 → DELETE … RETURNING → SQLite WAL',
    icon: Database,
    textClass: 'text-ink', // Ink text per DESIGN.md for legibility against green
    badgeClass: 'bg-black/15 text-ink',
    colSpan: 'lg:col-span-4',
  },
];

const WEIGHTS = [
  { label: 'GPU profile & limits', value: 0.3, accent: 'bg-accent-pink' },
  { label: 'OS, display & fonts', value: 0.25, accent: 'bg-accent-blue' },
  { label: 'WASM math invariants', value: 0.15, accent: 'bg-accent-purple' },
  { label: 'Behavioral biometrics', value: 0.15, accent: 'bg-accent-orange' },
  { label: 'ASN & network stack', value: 0.15, accent: 'bg-accent-green' },
];

export default function ArchitectureSection() {
  return (
    <SectionFrame id="architecture">
      {/* Header with Eyebrow 15px / 500 / 1.5px tracking and Display-LG 44.8px 600 */}
      <div className="max-w-3xl space-y-4">
        <div className="eyebrow">// Four-layer correlation engine</div>
        <h2 className="text-3xl font-semibold leading-[1.12] tracking-normal sm:text-4xl lg:text-[44.8px] lg:leading-[46.6px]">
          Spoofing one API is trivial. Forging all five layers at once is
          mathematically infeasible.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-body sm:text-lg">
          Evenstamp does not compete on the number of superficial JavaScript
          attributes it collects. It competes on the mathematical cost of
          keeping every forensic layer mutually consistent while a session is live.
        </p>
      </div>

      {/* Signature Five-Stop Chromatic Category Cards Grid per DESIGN.md */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
        {CATEGORY_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.title}
              className={`${card.category} ${card.colSpan} flex flex-col justify-between transition-transform hover:-translate-y-0.5`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-[4px] px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.05em] uppercase ${card.badgeClass}`}
                  >
                    {card.badge}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-black/10">
                    <Icon className={`h-5 w-5 ${card.textClass}`} aria-hidden="true" />
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-2xl font-semibold tracking-[-0.01em] ${card.textClass}`}
                  >
                    {card.title}
                  </h3>
                  <div
                    className={`mt-1 font-mono text-xs opacity-90 ${card.textClass}`}
                  >
                    {card.subtitle}
                  </div>
                </div>

                <p
                  className={`text-sm leading-relaxed opacity-95 ${card.textClass}`}
                >
                  {card.description}
                </p>
              </div>

              <div
                className={`mt-6 border-t border-black/10 pt-4 font-mono text-[11px] opacity-90 ${card.textClass}`}
              >
                {card.tech}
              </div>
            </article>
          );
        })}
      </div>

      {/* Identity Weights Matrix (Level 1 hairline card) */}
      <div className="card-feature mt-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="eyebrow-sm text-ink-muted">
              Fuzzy Match Resolution Matrix
            </div>
            <h3 className="text-xl font-semibold text-ink">
              Identity vector weights · 0.85 auto-link threshold
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-ink-body">
              Signals are weighted across physical hardware, runtime invariants,
              and network topology. An anomalous score above 70 quarantines the device.
            </p>
          </div>

          <div className="flex flex-col gap-3 min-w-[280px]">
            {WEIGHTS.map((w) => (
              <div key={w.label} className="space-y-1">
                <div className="flex justify-between font-mono text-xs text-ink">
                  <span>{w.label}</span>
                  <span className="font-semibold">{Math.round(w.value * 100)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${w.accent}`}
                    style={{ width: `${w.value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
