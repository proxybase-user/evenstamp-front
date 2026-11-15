import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import CtaSection from '@/components/CtaSection';
import CodeBlock from '@/components/CodeBlock';
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
const canonicalUrl = `${siteUrl}/ai-agent-detection`;

export const metadata: Metadata = {
  title: {
    absolute: 'AI Agent Detection: Muse, Grok Bot & AI Browsers',
  },
  description:
    'AI browsers like Meta Muse and xAI Grok Bot look like Chrome. Learn the signals they leave and how to allow, verify, or block agent traffic.',
  keywords: [
    'AI agent detection',
    'agentic traffic',
    'Meta Muse detection',
    'Grok Bot detection',
    'detect AI browser agents',
    'block AI agents',
    'Web Bot Auth',
    'bot detection',
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'AI Agent Detection: Muse, Grok Bot & AI Browsers',
    description:
      'AI browsers like Meta Muse and xAI Grok Bot look like Chrome. Learn the signals they leave and how to allow, verify, or block agent traffic.',
    url: canonicalUrl,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Agent Detection: Muse, Grok Bot & AI Browsers',
    description:
      'AI browsers like Meta Muse and xAI Grok Bot look like Chrome. Learn the signals they leave and how to allow, verify, or block agent traffic.',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Are Meta Muse and Grok Bot bots?',
    answer:
      'They are autonomous software agents that operate a browser or a cloud computer. Whether you treat them as bots depends on your policy. Many sessions are legitimate and use a full browser, so headless-bot rules will miss them.',
  },
  {
    question: 'Can I block Meta Muse?',
    answer:
      'You can identify and challenge Muse traffic, but blocking all of it is a business decision. Amazon blocked Muse in September 2026; Shopify allowed it. A risk-based policy is usually better than a blanket block.',
  },
  {
    question: 'Does Grok Bot sign its requests?',
    answer:
      'Verisoul reports that Grok Bot signs requests with Web Bot Auth. Arkose Labs reports that Grok stopped signing in October 2026. Verify the current behavior on your own traffic and treat signing as one signal among several.',
  },
  {
    question: 'Will blocking AI agents hurt SEO?',
    answer:
      'Search crawlers and AI retrieval tools follow different rules from browser agents. Blocking Googlebot or AI search crawlers can reduce citations and visibility. Browser agents that act on a user’s behalf need a separate policy.',
  },
  {
    question: 'What is Web Bot Auth?',
    answer:
      'Web Bot Auth is an IETF effort built on HTTP Message Signatures (RFC 9421). It lets an agent cryptographically sign requests and identify its operator. Coverage is still low: Arkose Labs found only 2.3% of legitimate agent sessions carried a verified signature in Q3 2026.',
  },
  {
    question: 'How accurate is AI agent detection?',
    answer:
      'It is probabilistic. Signatures are high-confidence when present. Device, network, and behavior signals need corroboration. No vendor can guarantee 100% detection, and false positives can block real customers.',
  },
  {
    question: 'Is Evenstamp a bot-detection product?',
    answer:
      'Evenstamp is a device identity and risk engine with bot and automation findings. It identifies the machine and behavior behind a session and gives you explainable findings you can act on.',
  },
];

const AGENT_TYPES: Array<{
  agent: string;
  examples: string;
  signal: string;
  policy: string;
}> = [
  {
    agent: 'Declared crawler',
    examples: 'Googlebot, Bingbot, AI search crawlers',
    signal: 'User-agent, published IP ranges, robots.txt',
    policy: 'Allow or rate-limit according to robots.txt',
  },
  {
    agent: 'Retrieval tool',
    examples: 'Grok web_search, ChatGPT search',
    signal: 'Server-side fetch, citations, no browser',
    policy: 'Treat as a crawler, separate from browser sessions',
  },
  {
    agent: 'Browser agent',
    examples: 'Comet, ChatGPT Atlas, Meta Muse',
    signal: 'Real browser, cloud VM, user-initiated task',
    policy: 'Allow browsing; verify high-risk actions',
  },
  {
    agent: 'Computer-use agent',
    examples: 'Grok Bot, Muse',
    signal: 'Cloud desktop, logins, multi-step tasks',
    policy: 'Verify identity; step up at checkout',
  },
  {
    agent: 'Abuse automation',
    examples: 'Headless farms, anti-detect browsers',
    signal: 'Synthetic events, rotating proxies, multi-account',
    policy: 'Challenge or block',
  },
];

const LAYERS: Array<{
  title: string;
  body: ReactNode;
  accent: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
}> = [
  {
    title: '1 · Signature and identity',
    accent: 'green',
    body: (
      <>
        Web Bot Auth / RFC 9421 message signatures, the{' '}
        <span className="font-mono text-ink">Signature-Agent</span> header, user-agent
        declarations, and robots.txt policy. High precision when present, but low
        coverage: most agent traffic still arrives unsigned.
      </>
    ),
  },
  {
    title: '2 · Network',
    accent: 'blue',
    body: (
      <>
        ASN, IP reputation, JA4 and H2 fingerprints, TCP TTL/MSS, TCP and TLS RTT,
        and the network prefix. A cloud VM has a different network shape from a
        home or mobile connection, even when the user-agent matches.
      </>
    ),
  },
  {
    title: '3 · Device',
    accent: 'yellow',
    body: (
      <>
        WebGL and WebGPU renderer strings, adapter limits, speech-voice inventory,
        system font, canvas readback, 2D-versus-WebGL bridge checks, and CDP
        serializer/preload traps. A VM’s hardware and OS stack are hard to fake
        consistently across sessions.
      </>
    ),
  },
  {
    title: '4 · Behavior',
    accent: 'purple',
    body: (
      <>
        Pointer, keyboard, and scroll kinematics; trusted versus synthetic events;
        dwell timing; path curvature; and micro-corrections. Agents often skip the
        messy parts of human input. Akamai found 63.2% of Comet and Atlas requests
        had zero mouse events.
      </>
    ),
  },
  {
    title: '5 · Intent',
    accent: 'red',
    body: (
      <>
        The page, the action, account age, transaction value, and promo history. A
        product-page browse, a checkout, and a promo redemption carry different
        risk. Detection without intent produces bad policy.
      </>
    ),
  },
];

const POLICY: Array<{
  title: string;
  body: ReactNode;
  accent: 'green' | 'yellow' | 'red';
}> = [
  {
    title: 'Allow',
    accent: 'green',
    body: (
      <>
        Verified agents and low-risk browsing on product, search, and content
        pages. If the agent is shopping for a real customer, blocking it costs
        revenue and teaches the customer to go elsewhere.
      </>
    ),
  },
  {
    title: 'Verify',
    accent: 'yellow',
    body: (
      <>
        Checkout, account creation, promo redemption, password changes, and
        high-value actions. Ask for a step-up signal or human approval at
        high-risk actions.
      </>
    ),
  },
  {
    title: 'Block',
    accent: 'red',
    body: (
      <>
        Undeclared automation at scale, credential stuffing, scraping that ignores
        your terms, multiple accounts from one machine, and promo abuse. Target
        the behavior and leave legitimate agent traffic alone.
      </>
    ),
  },
];

const SOURCES = [
  {
    label: 'DataDome: Meta’s Muse does not declare itself',
    href: 'https://datadome.co/threat-research/meta-muse-doesnt-declare-itself-heres-why-that-matters/',
    note: 'Muse presents as desktop Chrome; 29.1M requests and 33% of agentic traffic',
  },
  {
    label: 'HUMAN Security: Is Meta’s Muse the first mass-market AI agent?',
    href: 'https://www.humansecurity.com/learn/blog/meta-muse-agentic-traffic/',
    note: '84% of Muse requests targeted product and search pages',
  },
  {
    label: 'Verisoul: How to detect xAI’s Grok bots',
    href: 'https://www.verisoul.ai/agents/xai-bots',
    note: 'Grok Bot signing, VM profile, and static IPs',
  },
  {
    label: 'Arkose Labs: State of Agentic AI Trust Report, Q3 2026',
    href: 'https://www.arkoselabs.com/agentic-ai-trust-report-q3-2026',
    note: 'Signature coverage, legitimate-agent share, Muse and Grok observations',
  },
  {
    label: 'Verisoul: Four ways to detect AI agents',
    href: 'https://www.verisoul.ai/articles/four-ways-to-spot-ai-agents',
    note: 'Cryptography, device data, IP ranges, and behavior',
  },
  {
    label: 'Akamai mouse-dynamics research (summary)',
    href: 'https://gigazine.net/gsc_news/en/20260820-akamai-identify-agent',
    note: '63.2% of Comet and Atlas requests had zero mouse events',
  },
  {
    label: 'Cloud Security Alliance: AI agent impersonation traffic',
    href: 'https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-agent-impersonation-traffic-20261113-cs/',
    note: 'Why user-agent trust is collapsing',
  },
];

export default function AiAgentDetectionPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'AI Agent Detection', path: '/ai-agent-detection' },
  ]);
  const faqSchema = getFaqSchema(FAQ_ITEMS);
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'AI Agent Detection: Identify Muse, Grok Bot, Comet & Atlas',
    description:
      'How to detect AI browser agents such as Meta Muse and xAI Grok Bot, and how to allow, verify, or block agent traffic.',
    url: canonicalUrl,
    datePublished: '2026-11-15',
    dateModified: '2026-11-15',
    author: { '@type': 'Organization', name: 'Evenstamp', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'Evenstamp', url: siteUrl },
    about: [
      'AI agent detection',
      'bot detection',
      'Meta Muse',
      'xAI Grok Bot',
      'agentic traffic',
    ],
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
            <div className="eyebrow">// AI agent detection</div>
            <h1 className="text-3xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-[56px]">
              Your next bot may arrive in a real Chrome browser.
            </h1>
            <p className="text-base leading-relaxed text-ink-body">
              Meta Muse, xAI’s Grok Bot, Comet, and ChatGPT Atlas drive real
              browsers from cloud machines. They can pass a user-agent check,
              keep cookies, and click through a checkout. Evenstamp identifies
              the machine behind the agent, so you can allow legitimate agent
              traffic, challenge risky actions, and block abuse.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#layers" className="button-primary !text-xs !py-2">
                See the detection layers
              </a>
              <a href="/pricing" className="button-secondary !text-xs !py-2">
                Start free trial
              </a>
              <a
                href="/ai-agent-detection/meta-muse"
                className="font-mono text-[11px] text-accent-blue underline decoration-hairline underline-offset-4 transition hover:decoration-accent-blue"
              >
                Read the Muse profile
              </a>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
              Last updated 2026-11-15 · Agent traffic is moving fast; verify observations on your own logs
            </p>
          </div>
          <div className="mt-8">
            <StatStrip
              stats={[
                { value: '29.1M', label: 'Muse requests, Sept 22–Oct 3, 2026' },
                { value: '33%', label: 'of agentic traffic in September 2026' },
                { value: '77.4%', label: 'of AI agent sessions were legitimate' },
                { value: '2.3%', label: 'carried a verified agent signature' },
              ]}
            />
          </div>
        </SectionFrame>

        <SeoSection
          id="why"
          eyebrow="// Why the old playbook fails"
          title="AI agents run real browsers that look like Chrome."
          intro="Most bot stacks catch automation that announces itself through HeadlessChrome, navigator.webdriver, datacenter IPs, or robotic click cadence. Agentic browsers present few of those signals reliably."
        >
          <CardGrid
            items={[
              {
                title: 'They run real browsers',
                accent: 'green',
                body: (
                  <>
                    Muse runs a Chrome-based browser inside a cloud VM. Grok Bot
                    runs a Linux computer with a browser and file manager.{' '}
                    <span className="font-mono text-ink">HeadlessChrome</span> and{' '}
                    <span className="font-mono text-ink">navigator.webdriver</span>{' '}
                    are the wrong starting point.
                  </>
                ),
              },
              {
                title: 'Most agents stay unsigned',
                accent: 'blue',
                body: (
                  <>
                    Only 2.3% of legitimate agent sessions carried a verified Web
                    Bot Auth signature in Q3 2026. DataDome found Muse presenting
                    as ordinary desktop Chrome. Grok Bot has signed requests, but
                    Arkose Labs reports signing stopped in October 2026.
                  </>
                ),
              },
              {
                title: 'Their intent is often legitimate',
                accent: 'yellow',
                body: (
                  <>
                    Arkose Labs found 77.4% of AI agent sessions were legitimate,
                    versus 7.9% of known bot sessions. A blanket block stops
                    customers who asked an agent to shop, book, or compare.
                  </>
                ),
              },
              {
                title: 'The machine is the tell',
                accent: 'red',
                body: (
                  <>
                    A cloud VM can rotate its IP and user-agent. It is much harder
                    to hide a software GPU, a zero-voice Linux speech stack,
                    machine-timed input, and a stable VM fingerprint across
                    sessions.
                  </>
                ),
              },
            ]}
          />
        </SeoSection>

        <SeoSection
          id="spectrum"
          eyebrow="// Agentic traffic is a spectrum"
          title="Agent traffic includes customers, crawlers, and attackers."
          intro="Declared crawlers, retrieval tools, browser agents, and computer-use agents need different policies. Detection has to classify the agent and its intent before it decides what to do."
        >
          <CompareTable
            headers={['Class', 'Examples', 'What you see', 'Default policy']}
            rows={AGENT_TYPES.map((item) => [
              item.agent,
              item.examples,
              item.signal,
              item.policy,
            ])}
            caption="Grok web_search and ChatGPT search retrieve pages server-side, so treat them under crawler policy. Grok Bot and Muse operate a browser or a cloud desktop and need a separate agent policy."
          />
        </SeoSection>

        <SeoSection
          id="profiles"
          eyebrow="// Agent profiles"
          title="Muse and Grok Bot, side by side."
          intro="Both are consumer-facing agents. They differ in identity disclosure, runtime, and network behavior, which changes how you detect and route them."
        >
          <CompareTable
            headers={['', 'Meta Muse', 'xAI Grok Bot']}
            rows={[
              ['Operator', 'Meta', 'xAI'],
              ['Launched', 'September 8, 2026 (US)', 'August 11–12, 2026 (beta)'],
              [
                'Runtime',
                'Sandboxed cloud VM with a browser (Muse Secure / Sentinel VM)',
                'Cloud Linux computer with a browser and file manager',
              ],
              [
                'Identity',
                'Reportedly presents as desktop Chrome on Linux; does not declare itself as an agent',
                'Signs requests with Web Bot Auth, according to Verisoul; Arkose reports signing stopped in October 2026',
              ],
              [
                'Network',
                'Cloud infrastructure',
                'Static IPs provided to customers on request; listed by Cloudflare Radar',
              ],
              [
                'Behavior',
                'Shopping, forms, background tasks; 84% of requests hit product and search pages',
                '24/7 routines, teach-a-task, logins, multi-step app work',
              ],
              [
                'Notable',
                'Amazon blocked Muse on September 21; Shopify allowed it',
                'Hands CAPTCHAs and blocks back to the user',
              ],
            ]}
            caption={
              <>
                Vendor reporting changes monthly. Read the{' '}
                <a
                  href="/ai-agent-detection/meta-muse"
                  className="text-accent-blue underline decoration-hairline underline-offset-2"
                >
                  Muse profile
                </a>{' '}
                and the{' '}
                <a
                  href="/ai-agent-detection/grok-bot"
                  className="text-accent-blue underline decoration-hairline underline-offset-2"
                >
                  Grok Bot profile
                </a>{' '}
                for the signals and policy playbooks.
              </>
            }
          />
        </SeoSection>

        <SeoSection
          id="layers"
          eyebrow="// Detection model"
          title="Five layers of evidence."
          intro="No single signal is enough. A signature can be missing, an IP can be residential, and a user-agent can be spoofed. The job is to corroborate evidence across layers."
        >
          <CardGrid items={LAYERS} columns={2} />
          <div className="mt-6">
            <Callout title="The rule we use">
              Treat a single signal as a hint. Act only when independent signals
              agree and the action justifies it.
            </Callout>
          </div>
        </SeoSection>

        <SeoSection
          id="evenstamp"
          eyebrow="// How Evenstamp fits"
          title="Identify the machine behind the agent."
          intro="Evenstamp is a device identity and risk engine. It collects evidence that survives browser switches, cookie clears, and IP rotation instead of relying on a user-agent list."
        >
          <CardGrid
            items={[
              {
                title: 'Cross-browser DeviceID',
                accent: 'green',
                body: (
                  <>
                    Links the same machine across Chrome, Safari, and Firefox,
                    including incognito and cookie clears. That matters when one
                    agent VM opens multiple sessions.
                  </>
                ),
              },
              {
                title: 'Integrity probes',
                accent: 'blue',
                body: (
                  <>
                    Canvas farbling, 2D-versus-WebGL bridge checks, CDP
                    serializer/preload traps, WebGL/WebGPU renderer inspection,
                    speech-voice families, and host-OS contradictions.
                  </>
                ),
              },
              {
                title: 'Edge telemetry',
                accent: 'yellow',
                body: (
                  <>
                    ASN, JA4/H2 fingerprint, TCP TTL/MSS, TCP and TLS RTT, and a
                    truncated network prefix. Cloud VM traffic often looks
                    different at the wire even when the browser looks normal.
                  </>
                ),
              },
              {
                title: 'Behavior engine',
                accent: 'purple',
                body: (
                  <>
                    Pointer, keyboard, and scroll kinematics plus synthetic-event
                    and timing checks. Agents that click without moving a mouse
                    leave a different behavioral signature from a human.
                  </>
                ),
              },
              {
                title: 'Explainable findings',
                accent: 'red',
                body: (
                  <>
                    Per-rule findings and a risk score you can inspect in the
                    dashboard or through the API. You decide whether to allow,
                    step up, or block.
                  </>
                ),
              },
              {
                title: 'Sovereign deployment',
                accent: 'green',
                body: (
                  <>
                    Run the engine as a single Rust binary with embedded SQLite.
                    Agent traffic does not need to leave your infrastructure on
                    the Scale / Sovereign plan.
                  </>
                ),
              },
            ]}
          />
          <div className="mt-6">
            <CodeBlock
              title="Install the first-party snippet"
              language="html"
              code={`<script\n  src="https://evenstamp.com/embed/v1.js"\n  data-site-key="es_pub_…"\n  async\n></script>`}
            />
          </div>
          <div className="mt-4">
            <Callout tone="yellow" title="Where detection stops">
              We do not claim perfect detection for any named agent. We give you
              layered, explainable evidence and a risk score, and you set the
              policy for your business.
            </Callout>
          </div>
        </SeoSection>

        <SeoSection
          id="policy"
          eyebrow="// Policy playbook"
          title="Allow, verify, or block."
          intro="Ask which agent is acting, for whom, and what it is trying to do. Route the session based on that answer."
        >
          <CardGrid items={POLICY} columns={3} />
          <div className="mt-6">
            <Callout tone="blue" title="The business trade-off">
              Blocking every agent can cost revenue; allowing every agent can cost
              margin. Start with monitoring, add step-up verification at high-risk
              actions, and block the behavior you can explain.
            </Callout>
          </div>
        </SeoSection>

        <SeoSection
          id="faq"
          eyebrow="// FAQ"
          title="AI agent detection questions"
          intro="Short answers for teams deciding how to treat Muse, Grok Bot, and the next agent that arrives."
        >
          <FaqList items={FAQ_ITEMS} />
        </SeoSection>

        <SeoSection
          id="sources"
          eyebrow="// Sources"
          title="What this page is based on"
          intro="Agent traffic reporting changes monthly. These are the primary sources used for the claims above; verify the latest behavior against your own logs."
        >
          <SourceList items={SOURCES} />
        </SeoSection>

        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
