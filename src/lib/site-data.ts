export type BillingCycle = 'monthly' | 'annual';

export interface PricingTier {
  name: string;
  tagline: string;
  monthly: number;
  annualMonthly: number;
  included: number | null;
  overage: string;
  features: string[];
  cta: string;
  accent: 'slate' | 'cyan' | 'emerald' | 'amber';
  highlighted?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    tagline:
      'For SaaS tools, paid communities, and e-commerce stores stopping promo & trial abuse.',
    monthly: 29,
    annualMonthly: 23,
    included: 50_000,
    overage: '$0.80 per additional 10,000 checks',
    features: [
      'Cross-browser hardware Device ID (Chrome, Safari, Firefox)',
      'Instant 0–100 Fraud Risk Score',
      'VPN, Proxy & Incognito detection',
      'AdBlocker-proof first-party setup',
      'Dashboard & webhook alerts',
    ],
    cta: 'Start 14-Day Free Trial',
    accent: 'cyan',
  },
  {
    name: 'Growth',
    tagline:
      'For high-traffic platforms, AI apps, marketplaces, and fintechs fighting multi-accounting and bots.',
    monthly: 79,
    annualMonthly: 63,
    included: 250_000,
    overage: '$0.50 per additional 10,000 checks',
    features: [
      'Everything in Starter, plus:',
      'Full 8-layer anti-detect browser unmasking',
      'Live human vs. bot behavioral biometrics (mouse, scroll, touch)',
      'Residential proxy & cloud VM detection',
      'Custom auto-block score thresholds',
      'Priority support & Slack alerts',
    ],
    cta: 'Start 14-Day Free Trial',
    accent: 'emerald',
    highlighted: true,
  },
  {
    name: 'Scale / Sovereign',
    tagline:
      'For teams that want 100% data residency on their own servers with zero per-call fees.',
    monthly: 199,
    annualMonthly: 159,
    included: 1_000_000,
    overage: 'Unlimited checks (Self-Hosted) or $0.30 per 10k Cloud checks',
    features: [
      'Everything in Growth, plus:',
      'Dedicated single-file private deployment option',
      'Raw signal weights & custom fraud rules',
      'Zero external database dependencies',
      'Dedicated onboarding & SLA',
    ],
    cta: 'Get Scale Access',
    accent: 'amber',
  },
];

export interface Technique {
  id: string;
  index: string;
  name: string;
  title: string;
  layer: string;
  summary: string;
  flags: string[];
  icon: 'network' | 'eye' | 'cpu' | 'terminal' | 'audio' | 'globe' | 'layers' | 'activity';
}

export const TECHNIQUES: Technique[] = [
  {
    id: 'proxies',
    index: '01',
    name: 'VPNs & Hidden Proxies',
    title: '"I\'m just a normal home user in Chicago."',
    layer: 'Network',
    summary:
      'Fraudsters route their traffic through hijacked home routers so standard IP checks don\'t flag them. We compare how long their network takes to connect versus how long their browser takes to respond—exposing hidden proxies before they can create an account.',
    flags: ['HIDDEN_RESIDENTIAL_PROXY', 'VPN_TUNNEL_DETECTED'],
    icon: 'network',
  },
  {
    id: 'device-types',
    index: '02',
    name: 'Fake Device Types',
    title: '"I\'m browsing from a brand-new iPhone."',
    layer: 'Operating System',
    summary:
      'Bot farms often run cheap Linux servers in a data center while telling your website they\'re on an iPhone or Windows PC. Evenstamp inspects the raw internet packets arriving at your server, which immediately give away the real operating system underneath.',
    flags: ['FAKE_OPERATING_SYSTEM', 'SERVER_PRETENDING_TO_BE_PHONE'],
    icon: 'layers',
  },
  {
    id: 'antidetect',
    index: '03',
    name: 'Anti-Detect Browsers',
    title: '"I\'m a brand-new visitor you\'ve never seen before."',
    layer: 'Browser',
    summary:
      'Multi-accounters use privacy extensions and anti-detect browsers that inject fake noise to scramble their device ID. Evenstamp runs a silent two-step graphics check that catches the tampering in the act—turning their disguise into an instant red flag.',
    flags: ['IDENTITY_SCRAMBLER_DETECTED', 'FAKE_BROWSER_PROFILE'],
    icon: 'eye',
  },
  {
    id: 'cloud-vms',
    index: '04',
    name: 'Cloud Farms & Virtual Machines',
    title: '"This is a real laptop with a real graphics card."',
    layer: 'Hardware',
    summary:
      'When scammers spin up 100 virtual computers in the cloud to scrape your site or abuse promos, those cloud servers fake a graphics card using software. We run a microsecond graphics test that fake cloud GPUs fail every single time.',
    flags: ['VIRTUAL_MACHINE_OR_EMULATOR'],
    icon: 'cpu',
  },
  {
    id: 'automation-bots',
    index: '05',
    name: 'Stealth Automation Bots',
    title: '"A real human is clicking this button."',
    layer: 'Automation',
    summary:
      'Modern automation tools (like Playwright and Puppeteer with stealth plugins) erase the obvious signs that a robot is driving the browser. Evenstamp detects the invisible background tools these bots leave open to control the page.',
    flags: ['AUTOMATED_BOT_SOFTWARE'],
    icon: 'terminal',
  },
  {
    id: 'screen-spoof',
    index: '06',
    name: 'Fake MacBooks & Spoofed Screens',
    title: '"I\'m on a MacBook Pro."',
    layer: 'Hardware & OS',
    summary:
      'A Windows PC pretending to be a Mac still has Windows system voices installed, Windows window-border fonts, and a non-Apple color display. We cross-check these built-in system traits to catch fake device profiles instantly.',
    flags: ['FAKE_MAC_ON_WINDOWS', 'DISPLAY_MISMATCH'],
    icon: 'audio',
  },
  {
    id: 'extension-spoofer',
    index: '07',
    name: 'Browser Extension Spoofers',
    title: '"My browser settings are completely normal."',
    layer: 'Browser Integrity',
    summary:
      'Cheap spoofing plugins change the device details on the main webpage, but forget to change them in background browser workers. We compare both places at once—if they don\'t match, you know the visitor is lying.',
    flags: ['BROWSER_SPOOFING_EXTENSION'],
    icon: 'globe',
  },
  {
    id: 'robotic-behavior',
    index: '08',
    name: 'Robotic Scrolling & Fake Mobile Taps',
    title: '"I\'m scrolling and tapping with a real finger."',
    layer: 'Human Behavior',
    summary:
      'A real thumb on a phone screen changes pressure slightly with every tap, and a real laptop trackpad slows down smoothly when you flick it. Automated scripts scroll in rigid steps and tap with identical pressure every time.',
    flags: ['ROBOTIC_SCROLL_PATTERN', 'FAKE_MOBILE_SCREEN_TAP'],
    icon: 'activity',
  },
];

export const COMPARISON_ROWS = [
  {
    capability: 'Recognizes the same computer across Chrome, Firefox & Safari',
    evenstamp: 'Yes — matches the physical hardware',
    fingerprint: 'No — creates a new ID per browser',
    openSource: 'No — easily reset',
  },
  {
    capability: 'Catches bots by how they move, scroll & type',
    evenstamp: 'Included on all paid plans',
    fingerprint: 'Sold as expensive enterprise add-on',
    openSource: 'Not included',
  },
  {
    capability: 'Unmasks residential proxies & VPNs automatically',
    evenstamp: 'Included',
    fingerprint: 'Extra cost / limited',
    openSource: 'Not included',
  },
  {
    capability: 'Exposes anti-detect browsers (Multilogin, Dolphin, etc.)',
    evenstamp: 'Yes — 8 simultaneous checks',
    fingerprint: 'Partial',
    openSource: 'Easily bypassed',
  },
  {
    capability: 'Blocked by AdBlockers or Brave Shields?',
    evenstamp: 'Never — runs on your own domain',
    fingerprint: 'Paid upgrade required on lower tiers',
    openSource: 'Blocked by 30%+ of users',
  },
  {
    capability: 'Predictable pricing without surprise overage traps',
    evenstamp: 'Starts at $29/mo',
    fingerprint: 'Starts at $99/mo for just 20k checks',
    openSource: 'Free, but costs you thousands in fraud',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How does Evenstamp recognize the same person across different browsers?',
    answer:
      'While cookies, IP addresses, and User-Agents change when switching from Chrome to Firefox or opening Incognito, the physical hardware under the hood does not. Evenstamp tests microsecond graphics rendering characteristics, screen and font metrics, and network timing to recognize the same physical device regardless of browser or disguise tool.',
  },
  {
    question: 'What happens when a visitor uses an AdBlocker or Brave Shields?',
    answer:
      'Because Evenstamp runs through your own domain via a lightweight first-party proxy (e.g., your-domain.com/api/v1), it is never blocked by adblockers, privacy extensions, or Brave Shields that target third-party tracking domains.',
  },
  {
    question: 'Is Evenstamp private and GDPR compliant?',
    answer:
      'Yes. Evenstamp does not track people across unrelated websites to build ad profiles, nor do we sell or broker identity data. Customer identity graphs remain 100% isolated and encrypted. In addition, our self-hosted sovereign option lets you keep all data exclusively inside your private VPC.',
  },
  {
    question: 'How hard is it to install?',
    answer:
      'Setup takes under 5 minutes. You drop a 2-line JavaScript snippet on your signup, login, or checkout page (or install via npm), and query the instant 0–100 risk score before granting free trials or processing transactions.',
  },
  {
    question: 'Can we run Evenstamp on our own servers?',
    answer:
      'Yes. The Sovereign / Scale tier includes a private single-file Docker container and SQLite storage. It runs completely offline with zero external telemetry egress, perfect for regulated industries (healthcare, fintech, defense) and strict compliance mandates.',
  },
];

export const STATS = [
  { value: '99.8%', label: 'Accuracy across Chrome, Safari, and Firefox' },
  { value: '< 50ms', label: 'Zero slowdown for your real customers' },
  { value: '100%', label: 'Private & self-contained (your data never leaks)' },
  { value: '5x', label: 'Lower cost than legacy fraud tools' },
];

export const NAV_LINKS = [
  { label: 'How It Works', href: '/#architecture' },
  { label: 'What We Catch', href: '/#detection' },
  { label: 'Why Switch', href: '/#comparison' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Quick Setup', href: '/#integration' },
];

export const MONTHLY_EVENT_MIN = 10_000;
export const MONTHLY_EVENT_MAX = 2_000_000;

/** Estimates the cloud invoice for a monthly identification volume. */
export function estimateCloudCost(
  monthlyEvents: number,
  billing: BillingCycle,
): {
  tier: PricingTier;
  base: number;
  overage: number;
  total: number;
  perThousand: number;
} {
  const tier =
    monthlyEvents <= 50_000
      ? PRICING_TIERS[0]
      : monthlyEvents <= 250_000
        ? PRICING_TIERS[1]
        : PRICING_TIERS[2];
  const base =
    billing === 'annual' ? tier.annualMonthly : tier.monthly;

  let overage = 0;
  if (tier.included !== null && monthlyEvents > tier.included) {
    const extraBlocks = Math.ceil((monthlyEvents - tier.included) / 10_000);
    const rate = tier.name === 'Starter' ? 0.8 : tier.name === 'Growth' ? 0.5 : 0.3;
    overage = extraBlocks * rate;
  }

  const total = base + overage;
  return {
    tier,
    base,
    overage,
    total,
    perThousand: total === 0 ? 0 : (total / monthlyEvents) * 1_000,
  };
}
