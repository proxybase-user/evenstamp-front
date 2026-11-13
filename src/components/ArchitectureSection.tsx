import {
  Activity,
  Cpu,
  Database,
  Network,
} from 'lucide-react';
import SectionFrame from './SectionFrame';

const PILLARS = [
  {
    icon: Network,
    tone: 'cyan',
    title: 'Native SYN wire sniffer',
    subtitle: 'L3 · TCP TTL + MSS',
    copy: 'A zero-dependency AF_PACKET listener with a kernel cBPF filter copies only the 60-byte TCP SYN. It infers the client OS from the initial TTL and reads the MSS option to catch WireGuard, OpenVPN, and IPsec encapsulation before user space wakes up.',
    anchor: 'cBPF → SYN · 96 B → TTL:64 / MSS:1380',
  },
  {
    icon: Cpu,
    tone: 'emerald',
    title: 'Silicon and shader probes',
    subtitle: 'L1 · WebGL + WebGPU + WASM',
    copy: 'A 120-iteration fragment shader, a WGSL atomic-contention kernel, and a compiled Rust libm loop measure the physical GPU. A spoofed renderer string cannot fake shader latency, subgroup width, or hypervisor steal-time jitter.',
    anchor: 'clear(400) → raymarch(120) → atomic(16k) → libm hash',
  },
  {
    icon: Activity,
    tone: 'emerald',
    title: 'Polars kinematic biometrics',
    subtitle: 'L4 · columnar behavior',
    copy: 'Pointer, keystroke, wheel, and touch events stream into a vectorized Polars LazyFrame. Third-order jerk, path collinearity, dwell and flight distributions, scroll inertia, and touch pressure separate human motor control from scripted curves.',
    anchor: 'LazyFrame → jerk → collinearity → dwell / flight → 8D vector',
  },
  {
    icon: Database,
    tone: 'cyan',
    title: 'Embedded identity graph',
    subtitle: 'Storage · SQLite WAL',
    copy: 'Every envelope is sealed with ECDH P-256 and AES-256-GCM against a single-use challenge consumed by DELETE … RETURNING. Devices, browser identities, and sessions live in one SQLite file. No Redis, no Postgres, no cluster.',
    anchor: 'DELETE … RETURNING → WAL → DeviceID graph',
  },
];

const WEIGHTS = [
  { label: 'GPU profile & limits', value: 0.3 },
  { label: 'OS, display & fonts', value: 0.25 },
  { label: 'WASM math invariants', value: 0.15 },
  { label: 'Behavioral biometrics', value: 0.15 },
  { label: 'ASN & network', value: 0.15 },
];

export default function ArchitectureSection() {
  return (
    <SectionFrame id="architecture">
      <div className="max-w-3xl space-y-4">
        <div className="eyebrow">// Four-layer correlation engine</div>
        <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-4xl">
          Spoofing one API is trivial. Forging all four layers at once is
          mathematically infeasible.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-secondary">
          Evenstamp does not compete on the number of JavaScript attributes it
          collects. It competes on the cost of keeping every layer mutually
          consistent while a session is live.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {PILLARS.map((pillar, index) => {
          const Icon = pillar.icon;
          const accent =
            pillar.tone === 'cyan'
              ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
          return (
            <article
              key={pillar.title}
              className="surface-card group space-y-4 rounded-xl p-6 transition-colors hover:border-white/[0.14]"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border ${accent}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-mono text-[11px] text-ink-muted">
                  0{index + 1}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
                  {pillar.subtitle}
                </div>
                <h3 className="text-lg font-semibold tracking-[-0.01em]">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-secondary">
                  {pillar.copy}
                </p>
              </div>
              <div className="overflow-x-auto rounded-md border border-white/[0.06] bg-canvas px-3 py-2 font-mono text-[10px] text-ink-muted scrollbar-thin">
                {pillar.anchor}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 rounded-xl border border-white/[0.07] bg-surface-1 p-6 shadow-specular lg:grid-cols-[1.1fr_1fr] lg:p-8">
        <div className="space-y-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-cyan-400">
            Identity resolution
          </div>
          <h3 className="text-xl font-semibold tracking-[-0.01em]">
            Weighted similarity, not a single hash.
          </h3>
          <p className="max-w-[52ch] text-sm leading-relaxed text-ink-secondary">
            BrowserID is exact per browser family. DeviceID is a fuzzy match
            across the physical machine. A candidate must clear{' '}
            <span className="font-mono text-ink-primary">0.85</span> similarity
            and the session must stay below a{' '}
            <span className="font-mono text-ink-primary">70</span> risk score
            before the engine auto-links it. High-risk sessions are recorded,
            never merged.
          </p>
          <div className="pt-1 font-mono text-[11px] text-ink-muted">
            auto_link = similarity ≥ 0.85 ∧ risk &lt; 70
          </div>
        </div>

        <div className="space-y-3" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {WEIGHTS.map((weight) => (
            <div key={weight.label} className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-ink-secondary">{weight.label}</span>
                <span className="text-ink-primary">
                  {weight.value.toFixed(2)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                  style={{ width: `${weight.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
