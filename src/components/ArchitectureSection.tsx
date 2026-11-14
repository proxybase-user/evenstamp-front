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
    title: 'Sees right through VPNs and residential proxies',
    subtitle: 'Catches hidden tunnels before the page even finishes loading',
    description:
      'Fraudsters pay for "residential proxies" to make it look like they are browsing from a normal home Wi-Fi connection. Evenstamp measures subtle timing delays in their internet connection to expose hidden VPNs and proxy servers instantly.',
    tech: 'Connection Timing → VPN & Proxy Unmasking',
    icon: Network,
    textClass: 'text-white',
    badgeClass: 'bg-white/20 text-white',
    colSpan: 'lg:col-span-7',
  },
  {
    category: 'category-card-pink',
    badge: 'CHECK 2 · THE HARDWARE',
    title: 'Reads the physical graphics chip inside the device',
    subtitle: 'Identifies the real machine across different browsers',
    description:
      'A user can switch from Chrome to Firefox or open an Incognito window, but they can\'t swap out the physical graphics card soldered to their motherboard. We test how their chip renders tiny invisible graphics to recognize the exact same computer every time.',
    tech: 'Hardware Speed Test → Same Device ID Across Browsers',
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
      'Professional bonus abusers and multi-accounters use special software to fake hundreds of different laptops. Evenstamp sets invisible traps in the browser\'s rendering engine that force these disguise tools to reveal themselves.',
    tech: 'Invisible Rendering Traps → Fake Browser Caught',
    icon: Eye,
    textClass: 'text-white',
    badgeClass: 'bg-white/20 text-white',
    colSpan: 'lg:col-span-4',
  },
  {
    category: 'category-card-orange',
    badge: 'CHECK 4 · HUMAN BEHAVIOR',
    title: 'Tells real human hands apart from automated scripts',
    subtitle: 'Natural mouse movement, scrolling, and typing rhythm',
    description:
      'Humans don\'t move a mouse in dead-straight lines or scroll at robotic intervals. Evenstamp analyzes how a visitor moves, clicks, and scrolls in real time—blocking automated bots even when they use stolen residential IPs.',
    tech: 'Mouse, Scroll & Touch Rhythm → Bots Blocked',
    icon: Activity,
    textClass: 'text-white',
    badgeClass: 'bg-white/20 text-white',
    colSpan: 'lg:col-span-4',
  },
  {
    category: 'category-card-green',
    badge: 'CHECK 5 · PRIVACY & SPEED',
    title: 'Fast, private, and 100% under your control',
    subtitle: 'Encrypted end-to-end with zero third-party data sharing',
    description:
      'Unlike legacy trackers that pool your visitors\' data into massive ad-tech databases, Evenstamp keeps your customer identity graph completely isolated, encrypted, and GDPR-friendly—available as instant cloud hosting or a single private install.',
    tech: 'Bank-Grade Encryption → GDPR Ready → Instant Verdicts',
    icon: Lock,
    textClass: 'text-ink',
    badgeClass: 'bg-black/15 text-ink',
    colSpan: 'lg:col-span-4',
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
          Faking a browser takes seconds. Faking a physical computer is nearly impossible.
        </h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-ink-body sm:text-lg">
          Basic tracking relies on cookies and IP addresses—which anyone can reset in two clicks.
          Evenstamp checks five physical realities of a visitor&apos;s device at the exact same time.
          If a fraudster tries to fake one, the others give them away.
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
              Smart Risk Scoring
            </div>
            <h3 className="text-xl font-semibold text-ink">
              One clear score from 0 to 100. You decide who gets blocked.
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-ink-body">
              Instead of dumping confusing technical logs on your team, Evenstamp combines
              every check into a single risk score. Let normal customers breeze through
              while automatically stopping repeat abusers at signup or checkout.
            </p>
          </div>

          <div className="flex flex-col gap-3 min-w-[280px]">
            {RISK_PROGRESS_BARS.map((bar) => (
              <div key={bar.label} className="space-y-1">
                <div className="flex justify-between font-mono text-xs text-ink">
                  <span>{bar.label}</span>
                  <span className="font-semibold">{Math.round(bar.value * 100)}%</span>
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
