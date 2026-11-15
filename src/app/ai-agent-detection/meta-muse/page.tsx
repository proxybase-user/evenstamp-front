import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import CtaSection from '@/components/CtaSection';
import JsonLd from '@/components/JsonLd';
import SectionFrame from '@/components/SectionFrame';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import {
  Callout,
  CardGrid,
  CompareTable,
  FaqList,
  SeoSection,
  SourceList,
  StatStrip,
} from '@/components/seo-blocks';
import {
  getBaseUrl,
  getBreadcrumbSchema,
  getFaqSchema,
} from '@/lib/seo-schemas';

const siteUrl = getBaseUrl();
const canonicalUrl = `${siteUrl}/ai-agent-detection/meta-muse`;

export const metadata: Metadata = {
  title: {
    absolute: 'Meta Muse Detection: Identify Muse Agent Traffic',
  },
  description:
    'Meta Muse runs a real Chrome browser from a cloud VM and often presents as ordinary desktop Chrome. Here are the signals that reveal Muse traffic and how to respond.',
  keywords: [
    'Meta Muse detection',
    'detect Meta Muse',
    'Meta Muse bot',
    'Meta Muse agent traffic',
    'block Meta Muse',
    'AI agent detection',
    'bot detection',
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Meta Muse Detection: Identify Muse Agent Traffic',
    description:
      'Meta Muse runs a real Chrome browser from a cloud VM and often presents as ordinary desktop Chrome. Here are the signals that reveal Muse traffic and how to respond.',
    url: canonicalUrl,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meta Muse Detection: Identify Muse Agent Traffic',
    description:
      'Meta Muse runs a real Chrome browser from a cloud VM and often presents as ordinary desktop Chrome. Here are the signals that reveal Muse traffic and how to respond.',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Is Meta Muse a bot?',
    answer:
      'Muse is an autonomous AI agent that operates a browser inside a cloud VM. It uses a full browser and acts on a user’s behalf. Whether you classify it as a bot depends on your policy.',
  },
  {
    question: 'Does Meta Muse declare itself?',
    answer:
      'DataDome reported that Muse initially presented as ordinary desktop Chrome on Linux and did not identify itself as an AI agent. Verify the current behavior on your own traffic; vendor behavior changes quickly.',
  },
  {
    question: 'Can I detect Muse with a user-agent check?',
    answer:
      'A user-agent check will usually classify Muse as desktop Chrome. Use device, network, behavior, and session signals as well.',
  },
  {
    question: 'Does Muse respect robots.txt?',
    answer:
      'Muse acts for a user through a full browser, so crawler conventions do not apply. Treat it as an interactive session and apply your site policy to the actions it takes.',
  },
  {
    question: 'Should I block Meta Muse?',
    answer:
      'Blocking all Muse traffic is a business decision. Amazon blocked Muse in September 2026; Shopify allowed it. A better default is to allow low-risk browsing, verify high-risk actions, and block abusive behavior.',
  },
  {
    question: 'How does Evenstamp detect Muse?',
    answer:
      'Evenstamp does not rely on a Muse user-agent. It combines cross-browser DeviceID, device integrity probes, edge telemetry, behavior kinematics, and explainable risk findings to classify the session.',
  },
  {
    question: 'Is Muse traffic legitimate?',
    answer:
      'Often, yes. The user asked the agent to shop, compare, book, or complete a task. That is why blanket blocking is risky. Classify intent before you block.',
  },
];

const SIGNALS: Array<{
  title: string;
  body: ReactNode;
  accent: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
}> = [
  {
    title: '1 · Cloud network origin',
    accent: 'green',
    body: (
      <>
        Muse runs in Meta’s cloud infrastructure, not on the user’s phone. Look at
        ASN, network prefix, latency, and TCP/TLS round-trip time. A cloud VM has a
        different network shape from a home or mobile connection.
      </>
    ),
  },
  {
    title: '2 · Desktop Chrome on Linux',
    accent: 'blue',
    body: (
      <>
        A consumer Meta app driving a Linux Chrome stack is an unusual
        combination. Compare the user-agent and User-Agent Client Hints with the
        font and speech-voice inventory the machine actually exposes.
      </>
    ),
  },
  {
    title: '3 · Virtual GPU',
    accent: 'yellow',
    body: (
      <>
        Cloud VMs often expose a software or virtual GPU: SwiftShader, llvmpipe, or
        a low-end virtual adapter. Check WebGL/WebGPU renderer strings, adapter
        limits, and shader or compute timing for software emulation.
      </>
    ),
  },
  {
    title: '4 · Stable VM fingerprint',
    accent: 'purple',
    body: (
      <>
        Many Muse sessions may share the same VM image, so GPU, limits, fonts, and
        voice inventory repeat across users. A cross-browser DeviceID can link
        those sessions even when IPs and cookies change.
      </>
    ),
  },
  {
    title: '5 · Sparse OS stack',
    accent: 'red',
    body: (
      <>
        Linux containers frequently expose zero or very few text-to-speech voices
        and a minimal system font stack. P3 gamut and HDR support may also
        contradict the claimed consumer device.
      </>
    ),
  },
  {
    title: '6 · Zero or low mouse entropy',
    accent: 'green',
    body: (
      <>
        Agents often click programmatically. Akamai found 63.2% of Comet and Atlas
        requests had zero mouse events. Look for missing pointer paths, no
        micro-corrections, and clicks that land without approach movement.
      </>
    ),
  },
  {
    title: '7 · Machine-timed interactions',
    accent: 'blue',
    body: (
      <>
        Constant dwell between steps, uniform typing cadence, and synthetic event
        flags are stronger together than alone. Humans pause, overshoot, and
        correct; agents usually do not.
      </>
    ),
  },
  {
    title: '8 · Canvas and WebGL inconsistencies',
    accent: 'yellow',
    body: (
      <>
        Anti-detect tooling can poison canvas readback. Compare an exact integer
        fill with the readback, and compare 2D canvas output with a WebGL texture
        upload of the same canvas. CDP serializer and preload traps catch attached
        inspectors.
      </>
    ),
  },
  {
    title: '9 · Session shape',
    accent: 'purple',
    body: (
      <>
        Repeated product and search pages, background tasks, long-running
        sessions, and multiple accounts from the same VM are patterns a human
        shopper rarely produces. The identity graph makes them visible.
      </>
    ),
  },
];

const SOURCES = [
  {
    label: 'DataDome: Meta’s Muse does not declare itself',
    href: 'https://datadome.co/threat-research/meta-muse-doesnt-declare-itself-heres-why-that-matters/',
    note: '29.1M requests; 33% of agentic traffic; Chrome-like presentation',
  },
  {
    label: 'HUMAN Security: Is Meta’s Muse the first mass-market AI agent?',
    href: 'https://www.humansecurity.com/learn/blog/meta-muse-agentic-traffic/',
    note: '84% of Muse requests targeted product and search pages',
  },
  {
    label: 'CNET: I let Meta Muse do my shopping',
    href: 'https://www.cnet.com/tech/services-and-software/meta-muse-my-personal-shopper-upcharged-me/',
    note: 'Hands-on look at Muse’s shopping behavior',
  },
  {
    label: 'Wikipedia: Muse (AI agent)',
    href: 'https://en.wikipedia.org/wiki/Meta_Muse',
    note: 'Launch date and product background',
  },
  {
    label: 'Arkose Labs: State of Agentic AI Trust Report, Q3 2026',
    href: 'https://www.arkoselabs.com/agentic-ai-trust-report-q3-2026',
    note: 'Legitimate-agent share and Muse device-fingerprint observations',
  },
  {
    label: 'Verisoul: Four ways to detect AI agents',
    href: 'https://www.verisoul.ai/articles/four-ways-to-spot-ai-agents',
    note: 'Signatures, device data, IP ranges, and behavior',
  },
  {
    label: 'Akamai mouse-dynamics research (summary)',
    href: 'https://gigazine.net/gsc_news/en/20260820-akamai-identify-agent',
    note: 'Zero-mouse behavior in Comet and Atlas traffic',
  },
];

export default function MetaMusePage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'AI Agent Detection', path: '/ai-agent-detection' },
    { name: 'Meta Muse', path: '/ai-agent-detection/meta-muse' },
  ]);
  const faqSchema = getFaqSchema(FAQ_ITEMS);
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Meta Muse Detection: Identify Muse Agent Traffic',
    description:
      'How to detect Meta Muse traffic on your website using device, network, behavior, and session signals.',
    url: canonicalUrl,
    datePublished: '2026-11-15',
    dateModified: '2026-11-15',
    author: { '@type': 'Organization', name: 'Evenstamp', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'Evenstamp', url: siteUrl },
    about: ['Meta Muse', 'AI agent detection', 'bot detection', 'agentic traffic'],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={articleSchema} />
      <SiteHeader />
      <main id="main-content">
        <SectionFrame id="overview">
          <div className="max-w-3xl space-y-5">
            <nav
              aria-label="Breadcrumb"
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted"
            >
              <a href="/ai-agent-detection" className="hover:text-ink">
                AI Agent Detection
              </a>
              <span className="px-2">/</span>
              <span className="text-ink">Meta Muse</span>
            </nav>
            <div className="eyebrow">// Agent profile · Meta Muse</div>
            <h1 className="text-3xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-[56px]">
              How to detect Meta Muse on your website.
            </h1>
            <p className="text-base leading-relaxed text-ink-body">
              Muse is Meta’s consumer AI agent. It launched on September 8, 2026,
              runs a browser inside a sandboxed cloud VM, and reportedly presents
              as ordinary desktop Chrome on Linux. DataDome measured 29.1 million
              Muse requests between September 22 and October 3. That was 33% of
              all agentic traffic that month. The sections below cover the signals
              to check and how to respond without blocking real customers.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#signals" className="button-primary !text-xs !py-2">
                Jump to the signals
              </a>
              <a href="/pricing" className="button-secondary !text-xs !py-2">
                Start free trial
              </a>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
              Last updated 2026-11-15 · Verify current Muse behavior on your own traffic
            </p>
          </div>
          <div className="mt-8">
            <StatStrip
              stats={[
                { value: '29.1M', label: 'Muse requests, Sept 22–Oct 3, 2026' },
                { value: '33%', label: 'of agentic traffic in September 2026' },
                { value: '84%', label: 'of Muse requests hit product/search pages' },
                { value: 'Sept 8', label: '2026 US launch date' },
              ]}
            />
          </div>
        </SectionFrame>

        <SeoSection
          id="what-is-muse"
          eyebrow="// What Muse is"
          title="A cloud browser that acts like a customer."
          intro="Muse is a personal agent that can browse, fill forms, shop, book travel, handle files, and keep working in the background. For a site owner, the important part is the cloud browser behind the chat UI."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <article className="card-feature !p-6">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-green">
                Product surface
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Muse launched in the US on iOS, Android, the web, and WhatsApp,
                with a Mac version later. It can use context from Facebook,
                Instagram, and Threads; Meta pitched it to Facebook’s user base.
                Reports put downloads at 3.4 million by late September and 10
                million within two months.
              </p>
            </article>
            <article className="card-feature !p-6">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-blue">
                Runtime and controls
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Muse runs in a sandboxed cloud VM with its own browser. A
                permission layer called Sentinel can allow, block, or require
                approval for sensitive actions. Payments use Stripe’s Link.
                Amazon blocked Muse on September 21 as an unauthorized AI agent;
                Shopify allowed it and enabled Shop Pay.
              </p>
            </article>
          </div>
          <div className="mt-4">
            <Callout tone="yellow" title="Why this matters for detection">
              Muse traffic does not originate from the user’s device. It
              originates from Meta’s cloud, through a browser that can look like a
              normal Chrome install. Device and network evidence are more useful
              than the user-agent.
            </Callout>
          </div>
        </SeoSection>

        <SeoSection
          id="why-hard"
          eyebrow="// Why Muse is hard to detect"
          title="A real browser on a cloud machine, often with legitimate intent."
          intro="The old bot signals are weak here. Muse runs a full browser, and the person on whose behalf it acts is a real customer."
        >
          <CardGrid
            items={[
              {
                title: 'It presents as Chrome',
                accent: 'green',
                body: (
                  <>
                    DataDome reported that Muse presented as ordinary desktop
                    Chrome on Linux and did not declare itself as an AI agent. A
                    user-agent check alone will not separate it from a developer
                    on a Linux laptop.
                  </>
                ),
              },
              {
                title: 'It runs from the cloud',
                accent: 'blue',
                body: (
                  <>
                    The browser lives in a VM, not on the user’s phone. That gives
                    you strong network and device signals, but it also means the
                    session can outlive the user’s screen and run background
                    tasks.
                  </>
                ),
              },
              {
                title: 'Much of the intent is shopping',
                accent: 'yellow',
                body: (
                  <>
                    HUMAN Security reported that 84% of Muse requests targeted
                    product and search pages. This is shopping and research
                    traffic, not credential stuffing. A blanket block can cost
                    sales.
                  </>
                ),
              },
              {
                title: 'One agent can open many sessions',
                accent: 'red',
                body: (
                  <>
                    A VM can visit multiple sites and accounts in one task. Cookies
                    and IPs may change between sessions. The stable element is the
                    machine and the behavior pattern.
                  </>
                ),
              },
            ]}
          />
        </SeoSection>

        <SeoSection
          id="signals"
          eyebrow="// Detection signals"
          title="Nine signals Muse leaves behind."
          intro="No single signal is definitive. Use them as corroborating evidence, and verify each one against your own traffic before you enforce a block."
        >
          <CardGrid items={SIGNALS} columns={3} />
          <div className="mt-6">
            <Callout title="Corroborate before you enforce">
              A cloud ASN or a software GPU on its own proves little. A cloud ASN
              plus a sparse Linux OS stack, zero pointer entropy, and repeated
              product-page sessions is a much stronger finding.
            </Callout>
          </div>
        </SeoSection>

        <SeoSection
          id="evenstamp"
          eyebrow="// How Evenstamp surfaces Muse"
          title="Evidence you can inspect."
          intro="Evenstamp collects the signals above in one session and turns them into explainable findings. It relies on what the session produces, so a Muse user-agent or a static IP list is unnecessary."
        >
          <CompareTable
            headers={['Muse signal', 'What Evenstamp collects']}
            rows={[
              ['Cloud network origin', 'ASN, network prefix, TCP and TLS RTT, JA4/H2'],
              ['Linux desktop Chrome', 'Platform, UA Client Hints, system font, voice families'],
              ['Virtual GPU', 'WebGL/WebGPU renderer, adapter limits, shader and compute timing'],
              ['Stable VM fingerprint', 'Cross-browser BrowserID and DeviceID across sessions'],
              ['Sparse OS stack', 'Speech-voice count/families, P3 gamut, HDR support'],
              ['Zero or low mouse entropy', 'Pointer kinematics, event trust, synthetic-event ratios'],
              ['Canvas and WebGL inconsistencies', 'Canvas farbling, 2D-versus-WebGL bridge, CDP traps'],
              ['Session shape', 'Identity graph, repeated sessions, risk findings'],
            ]}
            caption="Evenstamp combines these signals into a risk score and per-rule findings. You decide whether the session should be allowed, stepped up, or blocked."
          />
        </SeoSection>

        <SeoSection
          id="policy"
          eyebrow="// Policy"
          title="Blocking Muse: what to allow and what to verify."
          intro="A product-page browse and a promo-code redemption need different policies. Route the session by action."
        >
          <CompareTable
            headers={['Action', 'Recommended policy']}
            rows={[
              ['Browse product or search pages', 'Allow'],
              ['Add to cart', 'Allow and monitor'],
              ['Checkout', 'Step-up verification'],
              ['Account creation', 'Verify'],
              ['Promo or trial redemption', 'Verify; block on repeat abuse'],
              ['Scraping at scale', 'Rate-limit or block'],
              ['Multiple accounts from one VM', 'Review or block'],
            ]}
            caption="Amazon blocked Muse entirely in September 2026. Shopify allowed it. Both are defensible; the right answer depends on your margin, fraud rate, and customer expectations."
          />
          <div className="mt-6">
            <Callout tone="blue" title="Decide which actions are okay">
              Allow the shopping trip, verify the checkout, and block the abuse
              pattern.
            </Callout>
          </div>
        </SeoSection>

        <SeoSection
          id="faq"
          eyebrow="// FAQ"
          title="Meta Muse detection questions"
          intro="Short answers for teams seeing Muse in their logs."
        >
          <FaqList items={FAQ_ITEMS} />
        </SeoSection>

        <SeoSection
          id="sources"
          eyebrow="// Sources"
          title="What this page is based on"
          intro="Muse behavior is changing quickly. These are the sources behind the claims above; verify the current state against your own telemetry."
        >
          <SourceList items={SOURCES} />
        </SeoSection>

        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
