import {
  Activity,
  Cpu,
  Eye,
  Lock,
  Network,
} from 'lucide-react';
import SectionFrame from './SectionFrame';

const CATEGORY_CARDS = [
  {
    category: 'category-card-purple',
    badge: 'CHECK 1 · THE CONNECTION',
    title: 'Detects VPNs and residential proxies',
    subtitle: 'Flags the tunnel while the page loads',
    description:
      'Fraudsters buy "residential proxies" so their traffic looks like it comes from a home Wi-Fi connection. Evenstamp measures timing gaps between the network and browser handshakes; a proxy adds delays that a direct connection does not have.',
    tech: 'Connection timing -> VPN & proxy detection',
    icon: Network,
    textClass: 'text-white',
    badgeClass: 'bg-white/20 text-white',
    colSpan: 'lg:col-span-7',
  },
  {
    category: 'category-card-pink',
    badge: 'CHECK 2 · THE HARDWARE',
    title: 'Identifies the physical graphics chip',
    subtitle: 'Same machine across Chrome, Safari, and Firefox',
    description:
      'A user can switch from Chrome to Firefox or open an Incognito window, but they can\'t swap the graphics card soldered to the motherboard. We test how the chip renders invisible graphics to recognize the same computer.',
    tech: 'Hardware speed test -> same Device ID across browsers',
    icon: Cpu,
    textClass: 'text-white',
    badgeClass: 'bg-white/20 text-white',
    colSpan: 'lg:col-span-5',
  },
  {
    category: 'category-card-blue',
    badge: 'CHECK 3 · THE BROWSER',
    title: 'Exposes "anti-detect" browsers built for fraud',
    subtitle: 'Catches tools like Multilogin, Dolphin{anty}, and GoLogin',
    description:
      'Bonus abusers and multi-accounters use software to fake hundreds of laptops. Evenstamp sets traps in the browser\'s rendering engine that make these disguise tools contradict themselves.',
    tech: 'Invisible rendering traps -> fake profile caught',
    icon: Eye,
    textClass: 'text-white',
    badgeClass: 'bg-white/20 text-white',
    colSpan: 'lg:col-span-4',
  },
  {
    category: 'category-card-orange',
    badge: 'CHECK 4 · HUMAN BEHAVIOR',
    title: 'Separates human input from automated scripts',
    subtitle: 'Natural mouse movement, scrolling, and typing rhythm',
    description:
      'Humans don\'t move a mouse in dead-straight lines or scroll at fixed intervals. Evenstamp measures how a visitor moves, clicks, and scrolls, so a scripted session stands out even when it comes from a residential IP.',
    tech: 'Mouse, scroll & touch rhythm -> bots blocked',
    icon: Activity,
    textClass: 'text-white',
    badgeClass: 'bg-white/20 text-white',
    colSpan: 'lg:col-span-4',
  },
  {
    category: 'category-card-green',
    badge: 'CHECK 5 · PRIVACY & SPEED',
    title: 'Fast, private, and under your control',
    subtitle: 'Encrypted in transit, with no third-party sharing',
    description:
      'Legacy trackers pool visitor data into ad-tech databases. Evenstamp keeps your identity graph isolated and encrypted, and you can run it as managed cloud hosting or a single private install.',
    tech: 'AES-256-GCM envelopes -> GDPR-ready -> instant verdicts',
    icon: Lock,
    textClass: 'text-ink',
    badgeClass: 'bg-black/15 text-ink',
    colSpan: 'md:col-span-2 lg:col-span-4',
  },
];

const RISK_PROGRESS_BARS = [
  { label: 'Physical Hardware & Graphics Match', value: 0.3, accent: 'bg-accent-pink' },
  { label: 'Device Screen, Fonts & System Check', value: 0.25, accent: 'bg-accent-blue' },
  { label: 'Processor & Browser Integrity', value: 0.15, accent: 'bg-accent-purple' },
  { label: 'Real Human Movement & Typing', value: 0.15, accent: 'bg-accent-orange' },
  { label: 'Internet Connection & VPN Check', value: 0.15, accent: 'bg-accent-green' },
];

export default function ArchitectureSection() {
  return (
    <SectionFrame id="architecture">
      <div className="max-w-3xl space-y-4">
        <div className="eyebrow">// Why scammers can&apos;t fool it</div>
        <h2 className="text-3xl font-semibold leading-[1.12] tracking-normal sm:text-4xl lg:text-[44.8px] lg:leading-[46.6px]">
          Faking a browser takes seconds. Faking the hardware underneath it is much harder.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-body sm:text-lg">
          Basic tracking relies on cookies and IP addresses, which anyone can reset in two clicks.
          Evenstamp checks five physical properties of a device at once.
          If a fraudster fakes one, the others give them away.
        </p>
      </div>

      {/* Signature Five-Stop Category Cards Grid */}
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

      {/* How Evenstamp Calculates Risk (Smart Risk Scoring) */}
      <div className="card-feature mt-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="eyebrow-sm text-ink-muted">
              Risk scoring
            </div>
            <h3 className="text-xl font-semibold text-ink">
              One score from 0 to 100. You decide who gets blocked.
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-ink-body">
              Evenstamp combines every check into one risk score, so your team doesn&apos;t
              have to read raw telemetry. Normal customers pass; repeat abusers get blocked
              at signup or checkout.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full lg:w-[320px] lg:shrink-0">
            {RISK_PROGRESS_BARS.map((bar) => (
              <div key={bar.label} className="space-y-1">
                <div className="flex justify-between font-mono text-xs text-ink">
                  <span className="truncate pr-2">{bar.label}</span>
                  <span className="font-semibold shrink-0">{Math.round(bar.value * 100)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar.accent}`}
                    style={{ width: `${bar.value * 100}%` }}
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
