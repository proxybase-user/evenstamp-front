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
      'Instant 0-100 fraud risk score',
      'VPN, proxy, and Incognito detection',
      'First-party setup that survives adblockers',
      'Dashboard and webhook alerts',
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
      'Human vs. bot behavioral biometrics (mouse, scroll, touch)',
      'Residential proxy and cloud VM detection',
      'Custom auto-block score thresholds',
      'Priority support and Slack alerts',
    ],
    cta: 'Start 14-Day Free Trial',
    accent: 'emerald',
    highlighted: true,
  },
  {
    name: 'Scale / Sovereign',
    tagline:
      'For teams that need data residency on their own servers and no per-call fees.',
    monthly: 199,
    annualMonthly: 159,
    included: 1_000_000,
    overage: 'Unlimited checks (Self-Hosted) or $0.30 per 10k Cloud checks',
    features: [
      'Everything in Growth, plus:',
      'Dedicated single-file private deployment option',
      'Raw signal weights and custom fraud rules',
      'No external database dependencies',
      'Dedicated onboarding and SLA',
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
      'Fraudsters route traffic through infected home routers so IP checks look normal. Evenstamp compares how long the network takes to connect with how long the browser takes to respond; the gap exposes a proxy.',
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
      'Bot farms run Linux servers in a data center and tell your site they are an iPhone or Windows PC. Evenstamp reads the TCP headers on arriving packets, which reveal the real operating system.',
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
      'Multi-accounters use privacy extensions and anti-detect browsers to inject noise and scramble their device ID. Evenstamp runs a two-step graphics check; the injected noise makes the fake profile disagree with itself.',
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
      'Scammers spin up virtual machines in the cloud to scrape your site or abuse promos, but those machines render graphics in software. Evenstamp times the GPU workload, and software rendering fails the test.',
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
      'Stealth plugins for Playwright and Puppeteer hide the obvious signs of automation. Evenstamp detects the DevTools hooks and preload bindings these tools leave behind.',
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
      'A Windows PC pretending to be a Mac still has Windows system voices, Windows UI fonts, and a non-Apple display. Evenstamp cross-checks those built-in traits.',
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
      'Cheap spoofing plugins change device details on the main page but leave background browser workers untouched. Evenstamp compares both; a mismatch means the profile is fake.',
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
      'A real thumb varies pressure with every tap, and a trackpad slows down smoothly when you flick it. Scripts scroll in fixed steps and tap with identical pressure.',
    flags: ['ROBOTIC_SCROLL_PATTERN', 'FAKE_MOBILE_SCREEN_TAP'],
    icon: 'activity',
  },
];

export const COMPARISON_ROWS = [
  {
    capability: 'Recognizes the same computer across Chrome, Firefox & Safari',
    evenstamp: 'Yes, matches the physical hardware',
    fingerprint: 'No, creates a new ID per browser',
    openSource: 'No, easily reset',
  },
  {
    capability: 'Catches bots by how they move, scroll & type',
    evenstamp: 'Growth plan and above',
    fingerprint: 'Paid enterprise add-on',
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
    evenstamp: 'Yes, 8 checks at once',
    fingerprint: 'Partial',
    openSource: 'Easily bypassed',
  },
  {
    capability: 'AdBlocker and Brave Shields resistance',
    evenstamp: 'Yes. Runs on your own domain',
    fingerprint: 'Paid upgrade required on lower tiers',
    openSource: 'Often blocked by privacy extensions',
  },
  {
    capability: 'Predictable pricing with published overage rates',
    evenstamp: 'Starts at $29/mo',
    fingerprint: 'Starts at $99/mo for 20k checks',
    openSource: 'Free, no cross-browser matching',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How does Evenstamp recognize the same person across different browsers?',
    answer:
      'Cookies, IP addresses, and User-Agents change when a visitor switches from Chrome to Firefox or opens Incognito. The hardware does not. Evenstamp tests graphics rendering, screen and font metrics, and network timing to recognize the same device regardless of browser or disguise tool.',
  },
  {
    question: 'What happens when a visitor uses an AdBlocker or Brave Shields?',
    answer:
      'Evenstamp runs through your own domain via a first-party proxy (for example, your-domain.com/api/v1). Adblockers and Brave Shields that target third-party tracking domains do not block it.',
  },
  {
    question: 'Is Evenstamp private and GDPR compliant?',
    answer:
      'Yes. Evenstamp does not track people across unrelated websites or build ad profiles, and we do not sell or broker identity data. Identity graphs stay isolated and encrypted. The self-hosted option keeps all data inside your own VPC.',
  },
  {
    question: 'How hard is it to install?',
    answer:
      'Setup takes under 5 minutes. Add a 2-line JavaScript snippet to your signup, login, or checkout page (or install from npm), then query the 0-100 risk score before granting trials or processing payments.',
  },
  {
    question: 'Can we run Evenstamp on our own servers?',
    answer:
      'Yes. The Scale / Sovereign tier includes a single-file Docker container and SQLite storage. It runs offline with no external telemetry egress, which suits regulated industries (healthcare, fintech, defense) and strict compliance requirements.',
  },
];

export const STATS = [
  { value: '99.8%', label: 'Device match accuracy across Chrome, Safari, and Firefox' },
  { value: '< 50ms', label: 'Added latency per identification' },
  { value: '0', label: 'Third-party trackers or ad brokers in the data path' },
  { value: '25x', label: 'Lower cost per check than Fingerprint Pro' },
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
