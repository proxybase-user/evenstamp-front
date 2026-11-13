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
    name: 'Developer',
    tagline:
      'Full cross-browser identification for side projects, staging, and proofs of concept.',
    monthly: 0,
    annualMonthly: 0,
    included: 25_000,
    overage: 'Hard cap — upgrade when you outgrow it',
    features: [
      '25,000 identifications / month',
      'Exact BrowserID + fuzzy DeviceID',
      'VM, headless, and automation checks',
      '7-day SQLite identity graph retention',
      'Community support',
    ],
    cta: 'Start free',
    accent: 'slate',
  },
  {
    name: 'Growth',
    tagline:
      'Five times the volume of the incumbent entry tier at less than half the price.',
    monthly: 39,
    annualMonthly: 31,
    included: 100_000,
    overage: '$0.80 per additional 10,000',
    features: [
      '100,000 identifications / month',
      'WASM steal-time + GPU shader benchmarks',
      'Cross-realm and worker-spoof checks',
      'Canvas farbling + WebGL bridge traps',
      '30-day identity graph retention',
      'Webhooks and CSV export',
    ],
    cta: 'Start Growth',
    accent: 'cyan',
  },
  {
    name: 'Scale',
    tagline:
      'The full wire-to-kinematics stack for fintech, e-commerce, and high-traffic platforms.',
    monthly: 199,
    annualMonthly: 159,
    included: 1_000_000,
    overage: '$0.50 per additional 10,000',
    features: [
      '1,000,000 identifications / month',
      'Polars kinematic biometrics engine',
      'TCP SYN TTL + MSS wire verification',
      'WebGPU subgroup + atomic contention probe',
      'CDP ValueMirror and preload detection',
      'Custom first-party CNAME proxy',
      '1-year identity graph retention',
    ],
    cta: 'Start 14-day Scale trial',
    accent: 'emerald',
    highlighted: true,
  },
  {
    name: 'Sovereign',
    tagline:
      'Run the entire Rust + Polars + SQLite + AF_PACKET engine inside your own VPC.',
    monthly: 999,
    annualMonthly: 999,
    included: null,
    overage: '$199 / month per additional node',
    features: [
      'Unlimited identifications (4 vCPU nodes)',
      'Single-binary Docker + bare metal',
      'Zero external telemetry egress',
      'Raw 8D Polars feature-vector export',
      'Embedded AF_PACKET wire sniffer',
      'GDPR / HIPAA / PCI deployment review',
      '99.99% availability SLA',
    ],
    cta: 'Talk to engineering',
    accent: 'amber',
  },
];

export interface Technique {
  id: string;
  index: string;
  title: string;
  layer: string;
  summary: string;
  flags: string[];
  icon: 'network' | 'eye' | 'cpu' | 'terminal' | 'audio' | 'globe' | 'layers' | 'activity';
}

export const TECHNIQUES: Technique[] = [
  {
    id: 'rtt-mss',
    index: '01',
    title: 'TCP RTT vs TLS RTT divergence',
    layer: 'L3 / L4',
    summary:
      'A backconnect residential proxy terminates the SYN at a home gateway but forwards the TLS handshake through its superproxy. Timestamping both handshakes exposes a 100–300 ms split before a byte of HTML is served. MSS inspection catches WireGuard, OpenVPN, and IPsec encapsulation at the same time.',
    flags: [
      'RESIDENTIAL_PROXY_TCP_TLS_RTT_SPLIT',
      'VPN_TUNNEL_MSS_CLAMP_WITH_TTL_SHIFT',
    ],
    icon: 'network',
  },
  {
    id: 'ttl',
    index: '02',
    title: 'Kernel SYN TTL attribution',
    layer: 'L3',
    summary:
      'A kernel cBPF filter drops everything except the 60-byte TCP SYN. The initial TTL (64 on Unix, 128 on Windows) is compared with the OS the client claims. A Windows 11 profile on a Linux container, or an iPhone profile on a Windows anti-detect host, cannot hide the contradiction.',
    flags: [
      'OS_TCP_TTL_MISMATCH_WINDOWS_ON_UNIX_STACK',
      'OS_TCP_TTL_MISMATCH_UNIX_ON_WINDOWS_STACK',
      'ANOMALOUS_ZERO_HOP_REMOTE_TTL',
    ],
    icon: 'layers',
  },
  {
    id: 'canvas',
    index: '03',
    title: 'Canvas farbling & texture-bridge traps',
    layer: 'L2',
    summary:
      'An axis-aligned integer fill must read back byte-exact on every GPU. Separately, a 2D canvas is uploaded into a WebGL texture and read back through a framebuffer. Hooks that poison getImageData or toDataURL cannot poison the C++ graphics upload path.',
    flags: [
      'CANVAS_NOISE_FARBLING_DETECTED',
      'CANVAS_WEBGL_TEXTURE_BRIDGE_MISMATCH',
    ],
    icon: 'eye',
  },
  {
    id: 'webgpu',
    index: '04',
    title: 'WebGPU subgroup & atomic contention',
    layer: 'L1',
    summary:
      'Subgroup widths separate NVIDIA warps (32) from AMD wavefronts (32/64) and Apple/Intel variable SIMD. A 16k-atomic WGSL shader serializes on the L1 cache; CPU-emulated adapters finish one to two orders of magnitude slower than a physical GPU.',
    flags: ['WEBGPU_COMPUTE_ATOMIC_SOFTWARE_EMULATION'],
    icon: 'cpu',
  },
  {
    id: 'cdp',
    index: '05',
    title: 'CDP ValueMirror & preload residue',
    layer: 'Runtime',
    summary:
      'Playwright and stealth plugins patch navigator.webdriver, but an attached Runtime domain still formats console objects. A side-effecting stack getter fires only when an inspector listens. Injected preload scripts also leave anonymous :1 CallSite frames.',
    flags: ['CDP_RUNTIME_VALUE_MIRROR_SERIALIZER_ACTIVE'],
    icon: 'terminal',
  },
  {
    id: 'host-os',
    index: '06',
    title: 'Host OS voice & font unmasking',
    layer: 'OS',
    summary:
      'Apple voices never ship on Windows and Microsoft SAPI voices never ship on macOS. The CSS status-bar system font resolves through the window manager, not the User-Agent. A claimed MacBook Pro without a P3 display is another contradiction.',
    flags: [
      'OS_SPEECH_SYNTHESIS_VOICE_CONTRADICTION',
      'APPLE_SILICON_WITHOUT_P3_GAMUT_DISPLAY',
    ],
    icon: 'audio',
  },
  {
    id: 'realm',
    index: '07',
    title: 'Worker and realm divergence',
    layer: 'Runtime',
    summary:
      'Stealth patches frequently reach the main window but miss SharedWorker, ServiceWorker, or a sandboxed iframe realm. Comparing userAgent, platform, hardwareConcurrency, timezone, and languages across realms exposes partial patches.',
    flags: ['CROSS_REALM_OR_WORKER_SPOOF_MISMATCH'],
    icon: 'globe',
  },
  {
    id: 'kinematics',
    index: '08',
    title: 'Scroll inertia & touch biomechanics',
    layer: 'Behavior',
    summary:
      'A physical trackpad emits a decaying momentum curve with variable deltas and inter-event jitter. Scripted scrollBy loops emit identical deltas on a fixed timer. Genuine fingers vary contact pressure; mobile emulators often report a constant 0.5.',
    flags: [
      'BOT_SYNTHETIC_SCROLL_STEP_FUNCTION',
      'MOBILE_STATIC_TOUCH_PRESSURE_EMULATOR',
    ],
    icon: 'activity',
  },
];

export const COMPARISON_ROWS = [
  {
    capability: 'Cross-browser hardware DeviceID',
    evenstamp: 'Yes — GPU limits + libm + fonts',
    fingerprint: 'Browser-scoped VisitorID',
    openSource: 'No — breaks across browsers',
  },
  {
    capability: 'Polars kinematic bot biometrics',
    evenstamp: 'Built-in — velocity, jerk, dwell',
    fingerprint: 'Not included',
    openSource: 'Not included',
  },
  {
    capability: 'TCP SYN TTL + MSS wire layer',
    evenstamp: 'Native Rust AF_PACKET / edge header',
    fingerprint: 'Cloud enterprise only',
    openSource: 'Client JavaScript only',
  },
  {
    capability: 'Canvas farbling + WebGL bridge traps',
    evenstamp: 'Built-in',
    fingerprint: 'Not included',
    openSource: 'Not included',
  },
  {
    capability: 'Self-hosted single binary',
    evenstamp: 'Yes — Rust + embedded SQLite',
    fingerprint: 'No — closed cloud',
    openSource: 'No backend included',
  },
  {
    capability: 'Entry paid plan quota',
    evenstamp: '$39 / mo for 100,000',
    fingerprint: '$99 / mo for 20,000',
    openSource: 'MIT — 40–60% accuracy',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Is Evenstamp a tracking cookie or a data broker?',
    answer:
      'No cookies are required, and Evenstamp does not sell or broker identity graphs. The identity database stores a /24 or /48 network prefix, not the full client IP; ephemeral challenges bind to a one-way HMAC of the IP. Raw payload storage is off by default. You remain the data controller; the sovereign deployment never sends telemetry to us.',
  },
  {
    question: 'What happens when a privacy extension blocks the SDK?',
    answer:
      'The first-party route pattern is the answer. Your Next.js app proxies /api/v1/challenge and /api/v1/ingest through your own origin, so domain blocklists never see a third-party fingerprinting host. The SDK also degrades to a partial verdict instead of failing the request.',
  },
  {
    question: 'How accurate is cross-browser matching?',
    answer:
      'Identity scoring weights GPU profile 0.30, OS/display/fonts 0.25, WASM math invariants 0.15, behavioral biometrics 0.15, and ASN 0.15. A candidate must clear a 0.85 similarity threshold and the session must stay below a 70 risk score before the engine auto-links it to an existing device.',
  },
  {
    question: 'Can we deploy the wire sniffer behind our existing Nginx?',
    answer:
      'Yes. Nginx supplies JA4, HTTP/2, ASN, client port, and forwarded IP headers. TCP TTL and MSS come from either the edge header contract or the built-in AF_PACKET listener when Rust terminates the client handshake directly. The backend trusts edge headers only from CIDRs listed in FP_TRUSTED_PROXIES.',
  },
  {
    question: 'What is the infrastructure footprint?',
    answer:
      'One statically linked Rust binary and one SQLite file in WAL mode. No Redis, no Postgres, no JVM, no managed cluster. A 4 vCPU node handles the included Sovereign quota; extra nodes are licensed per node.',
  },
];

export const STATS = [
  { value: '4', label: 'correlated physical layers' },
  { value: '0', label: 'external datastores' },
  { value: '1', label: 'Rust binary + SQLite file' },
  { value: '25k', label: 'free identifications / month' },
];

export const NAV_LINKS = [
  { label: 'Architecture', href: '/#architecture' },
  { label: 'Detection', href: '/#detection' },
  { label: 'Benchmarks', href: '/#comparison' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/#integration' },
];

export const MONTHLY_EVENT_MIN = 25_000;
export const MONTHLY_EVENT_MAX = 10_000_000;

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
    monthlyEvents <= 25_000
      ? PRICING_TIERS[0]
      : monthlyEvents <= 100_000
        ? PRICING_TIERS[1]
        : PRICING_TIERS[2];
  const base =
    billing === 'annual' ? tier.annualMonthly : tier.monthly;

  let overage = 0;
  if (tier.included !== null && monthlyEvents > tier.included) {
    const extraBlocks = Math.ceil((monthlyEvents - tier.included) / 10_000);
    const rate = tier.name === 'Growth' ? 0.8 : 0.5;
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
