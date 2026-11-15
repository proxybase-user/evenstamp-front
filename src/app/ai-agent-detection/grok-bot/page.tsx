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
const canonicalUrl = `${siteUrl}/ai-agent-detection/grok-bot`;

export const metadata: Metadata = {
  title: {
    absolute: 'Grok Bot Detection: Identify xAI Agent Traffic',
  },
  description:
    'xAI’s Grok Bot runs a cloud Linux computer and can sign requests with Web Bot Auth. Here’s how to verify signed agents and spot unsigned Grok traffic.',
  keywords: [
    'Grok Bot detection',
    'detect Grok Bot',
    'xAI Grok bot',
    'Grok agent traffic',
    'block Grok Bot',
    'Web Bot Auth',
    'AI agent detection',
    'bot detection',
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Grok Bot Detection: Identify xAI Agent Traffic',
    description:
      'xAI’s Grok Bot runs a cloud Linux computer and can sign requests with Web Bot Auth. Here’s how to verify signed agents and spot unsigned Grok traffic.',
    url: canonicalUrl,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grok Bot Detection: Identify xAI Agent Traffic',
    description:
      'xAI’s Grok Bot runs a cloud Linux computer and can sign requests with Web Bot Auth. Here’s how to verify signed agents and spot unsigned Grok traffic.',
  },
};

const FAQ_ITEMS = [
  {
    question: 'What is Grok Bot?',
    answer:
      'Grok Bot is xAI’s always-on agent product. Each bot gets a cloud Linux computer with a browser and file manager, and can complete tasks on real websites, including sites without APIs. It launched in beta in August 2026.',
  },
  {
    question: 'Is Grok Bot a crawler?',
    answer:
      'No. Grok web_search and x_search are server-side retrieval tools. Grok Bot is a computer-use agent that operates a browser and can log in, click, fill forms, and complete multi-step tasks.',
  },
  {
    question: 'Does Grok Bot sign its requests?',
    answer:
      'Verisoul reports that Grok Bot signs requests with Web Bot Auth and provides static IPs to customers on request. Arkose Labs reports that Grok stopped signing in October 2026. Verify the current behavior on your traffic.',
  },
  {
    question: 'Can I block Grok Bot?',
    answer:
      'You can verify signed traffic, challenge unsigned high-risk actions, and block abuse. Blanket-blocking all Grok Bot traffic may block legitimate customer tasks. Apply policy by action and risk.',
  },
  {
    question: 'What is Web Bot Auth?',
    answer:
      'An IETF effort built on HTTP Message Signatures (RFC 9421). It lets an agent cryptographically sign a request and disclose its operator through a Signature-Agent header. Coverage is still limited.',
  },
  {
    question: 'How do I detect Grok Bot without a signature?',
    answer:
      'Use corroborating layers: cloud VM device fingerprints, static IP ranges and ASN, a Linux browser stack with sparse fonts and voices, zero-mouse behavior, 24/7 cadence, and repeated routines.',
  },
  {
    question: 'Is Grok Bot traffic legitimate?',
    answer:
      'Often, yes. The user asked the agent to complete a task. That is why verified agents should get a different policy from undeclared automation with abuse signals.',
  },
];

const SIGNALS: Array<{
  title: string;
  body: ReactNode;
  accent: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
}> = [
  {
    title: '1 · Web Bot Auth signature',
    accent: 'green',
    body: (
      <>
        Check for RFC 9421 message signatures and a{' '}
        <span className="font-mono text-ink">Signature-Agent</span> header. A valid
        signature is a high-confidence identity signal. Treat a missing signature
        as unverified, not necessarily abusive.
      </>
    ),
  },
  {
    title: '2 · Cloud Linux VM fingerprint',
    accent: 'blue',
    body: (
      <>
        Grok Bot runs a Linux cloud computer with a browser. Look for a Linux
        platform, a software or virtual GPU, a minimal font stack, and few or zero
        text-to-speech voices.
      </>
    ),
  },
  {
    title: '3 · Static IP ranges and ASN',
    accent: 'yellow',
    body: (
      <>
        xAI provides static IPs to customers on request, and Cloudflare Radar lists
        Grok Bot by name. Network reputation and ASN are useful, but IPs can change
        and a single range is not a complete policy.
      </>
    ),
  },
  {
    title: '4 · Browser stack mismatch',
    accent: 'purple',
    body: (
      <>
        The claimed browser and the actual OS stack often disagree in detectable
        ways: Linux Chrome with no voices, sparse fonts, a virtual GPU, or a
        P3/HDR result that does not match the device class.
      </>
    ),
  },
  {
    title: '5 · Zero or synthetic pointer input',
    accent: 'red',
    body: (
      <>
        Agents complete tasks through automation APIs or synthetic events. Missing
        pointer paths, perfectly straight movement, and constant timing are
        stronger together than alone.
      </>
    ),
  },
  {
    title: '6 · 24/7 cadence and repeated routines',
    accent: 'green',
    body: (
      <>
        Grok Bots can run scheduled routines around the clock. Repeated visits at
        machine-like intervals, identical task sequences, and no human idle
        periods look different from a person using a browser.
      </>
    ),
  },
  {
    title: '7 · Approval and handoff pauses',
    accent: 'blue',
    body: (
      <>
        Grok Bot can pause for human approval or hand a task back to the user.
        Long stalls in the middle of a precise multi-step flow, followed by an
        exact resume, are a useful behavioral signature.
      </>
    ),
  },
  {
    title: '8 · One VM, multiple accounts',
    accent: 'yellow',
    body: (
      <>
        One agent computer can act for multiple tasks and accounts. A cross-browser
        DeviceID that links otherwise unrelated sessions is more useful than a
        cookie or user-agent check.
      </>
    ),
  },
  {
    title: '9 · CAPTCHA and block handoff',
    accent: 'purple',
    body: (
      <>
        xAI’s documentation says the bot hands CAPTCHAs and blocks back to the
        user. A session that stops at a challenge and resumes later may be an
        agent waiting for a human.
      </>
    ),
  },
];

const SOURCES = [
  {
    label: 'Verisoul: How to detect xAI’s Grok bots',
    href: 'https://www.verisoul.ai/agents/xai-bots',
    note: 'Web Bot Auth signing, VM profile, static IPs, and Cloudflare Radar',
  },
  {
    label: 'Arkose Labs: State of Agentic AI Trust Report, Q3 2026',
    href: 'https://www.arkoselabs.com/agentic-ai-trust-report-q3-2026',
    note: 'Signature coverage and reported change in Grok signing',
  },
  {
    label: 'xAI developer docs: Web Search',
    href: 'https://docs.x.ai/developers/tools/web-search',
    note: 'Grok web_search is a retrieval tool, not the browser agent',
  },
  {
    label: '4sysops: Grok Bot turns AI agents into virtual computers',
    href: 'https://4sysops.com/archives/grok-bot-turns-ai-agents-into-easy-to-use-virtual-computers/',
    note: 'Product overview and cloud-computer architecture',
  },
  {
    label: 'Infobae: xAI presents Grok Bot',
    href: 'https://www.infobae.com/america/agencias/2026/08/12/xai-presenta-grok-bot-un-sistema-de-agentes-de-ia-que-trabaja-como-un-companero-de-equipo-autonomo-las-24-horas/',
    note: 'August 2026 launch and positioning',
  },
  {
    label: 'Verisoul: Four ways to detect AI agents',
    href: 'https://www.verisoul.ai/articles/four-ways-to-spot-ai-agents',
    note: 'Cryptography, device data, IP ranges, and behavior',
  },
  {
    label: 'Cloud Security Alliance: AI agent impersonation traffic',
    href: 'https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-agent-impersonation-traffic-20261113-cs/',
    note: 'Why user-agent trust is collapsing',
  },
];

export default function GrokBotPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'AI Agent Detection', path: '/ai-agent-detection' },
    { name: 'Grok Bot', path: '/ai-agent-detection/grok-bot' },
  ]);
  const faqSchema = getFaqSchema(FAQ_ITEMS);
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Grok Bot Detection: Identify xAI Agent Traffic',
    description:
      'How to detect xAI Grok Bot traffic using Web Bot Auth signatures, device, network, behavior, and session signals.',
    url: canonicalUrl,
    datePublished: '2026-11-15',
    dateModified: '2026-11-15',
    author: { '@type': 'Organization', name: 'Evenstamp', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'Evenstamp', url: siteUrl },
    about: ['Grok Bot', 'xAI', 'AI agent detection', 'Web Bot Auth', 'bot detection'],
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
              <span className="text-ink">Grok Bot</span>
            </nav>
            <div className="eyebrow">// Agent profile · xAI Grok Bot</div>
            <h1 className="text-3xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-[56px]">
              How to detect xAI’s Grok Bot on your website.
            </h1>
            <p className="text-base leading-relaxed text-ink-body">
              Grok Bot is a separate product from Grok’s search feature. It is an
              always-on agent with its own cloud Linux computer, browser, and file
              manager, and it launched in beta in August 2026. It has signed
              requests with Web Bot Auth, and Arkose Labs reports signing stopped
              in October. The sections below cover verification when a signature
              is present and classification when it is not.
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
              Last updated 2026-11-15 · Verify current Grok Bot behavior on your own traffic
            </p>
          </div>
          <div className="mt-8">
            <StatStrip
              stats={[
                { value: 'Aug 2026', label: 'Grok Bot beta launch' },
                { value: '24/7', label: 'always-on agent routines' },
                { value: 'Web Bot Auth', label: 'reported request signing' },
                { value: 'Cloud Linux', label: 'runtime with browser and file manager' },
              ]}
            />
          </div>
        </SectionFrame>

        <SeoSection
          id="what-is-grok-bot"
          eyebrow="// What Grok Bot is"
          title="An agent per thread, with its own cloud computer."
          intro="Grok Bot is a computer-use agent that operates a full browser. Each conversation is treated as an individual bot, and each bot gets a cloud-hosted Linux environment with a browser and file manager."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <article className="card-feature !p-6">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-green">
                What it can do
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Grok Bots can complete tasks on real websites, including sites with
                no API. They can log in, click through flows, fill forms, and hand
                work between agents. A “teach a task” feature converts a
                demonstration into a reusable routine, and scheduled routines run
                around the clock.
              </p>
            </article>
            <article className="card-feature !p-6">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-blue">
                How it is sold
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Grok Bot launched in beta in August 2026 on desktop and iOS,
                initially for high-tier xAI and Cursor subscribers, with an
                enterprise waitlist. The interface hides model pickers and tool
                logs. The product is the agent.
              </p>
            </article>
          </div>
          <div className="mt-4">
            <Callout tone="yellow" title="Why this matters">
              A user-agent rule will not block Grok Bot. It is a user-directed
              agent that operates a browser for minutes or hours. Detection has to
              look at the machine, the behavior, and the action.
            </Callout>
          </div>
        </SeoSection>

        <SeoSection
          id="vs-search"
          eyebrow="// Two different products"
          title="Grok search and Grok Bot are different products."
          intro="If you see “Grok” in your logs, first determine which product it is. The detection and policy are different."
        >
          <CompareTable
            headers={['', 'Grok web_search / x_search', 'Grok Bot']}
            rows={[
              ['What it is', 'Server-side retrieval tool', 'Cloud computer-use agent'],
              ['Runs a browser', 'No', 'Yes'],
              ['Acts on your site', 'No; it retrieves and cites', 'Yes; logins, forms, checkout'],
              ['Identity', 'Server-side retrieval tool', 'Web Bot Auth signing reported'],
              ['Detection', 'Crawler policy and IP reputation', 'Agent policy and session evidence'],
              ['Billing', 'API calls', 'Subscription agent product'],
            ]}
            caption="xAI’s web_search and x_search are retrieval tools used by Grok models. Grok Bot is the always-on agent that operates a computer. Treat them under different policies."
          />
        </SeoSection>

        <SeoSection
          id="web-bot-auth"
          eyebrow="// Verify first"
          title="Web Bot Auth is the strongest signal when it is present."
          intro="Web Bot Auth is an IETF effort built on HTTP Message Signatures (RFC 9421). It lets an agent cryptographically sign a request and identify its operator, usually through a Signature-Agent header."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[8px] border border-hairline bg-surface-1 p-5">
              <div className="metric text-2xl font-semibold text-ink">2.3%</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                of legitimate agent sessions carried a verified signature in Q3
                2026, according to Arkose Labs.
              </p>
            </div>
            <div className="rounded-[8px] border border-hairline bg-surface-1 p-5">
              <div className="metric text-2xl font-semibold text-ink">78.4%</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                of ChatGPT agent sessions were signed, showing that signing can
                work when a vendor commits to it.
              </p>
            </div>
            <div className="rounded-[8px] border border-hairline bg-surface-1 p-5">
              <div className="metric text-2xl font-semibold text-ink">Oct 2026</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">
                Arkose Labs reports Grok stopped signing in October. Verify the
                current state before relying on a signature policy.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Callout tone="blue" title="How to use signatures">
              A valid signature is a high-confidence identity signal. Treat a
              missing signature as unverified. Use signatures to fast-path verified
              agents, then fall back to device, network, and behavior evidence for
              everyone else.
            </Callout>
          </div>
        </SeoSection>

        <SeoSection
          id="signals"
          eyebrow="// Detection signals"
          title="Nine signals when the signature is missing."
          intro="Layered detection matters most when a signature is missing. No single signal is definitive; corroborate before you enforce."
        >
          <CardGrid items={SIGNALS} columns={3} />
          <div className="mt-6">
            <Callout title="Corroborate before you enforce">
              A Linux user-agent or a cloud ASN on its own proves little. Three
              independent signals that agree on the same session are a finding.
            </Callout>
          </div>
        </SeoSection>

        <SeoSection
          id="evenstamp"
          eyebrow="// How Evenstamp handles Grok Bot"
          title="Verify when possible. Identify the machine when not."
          intro="Evenstamp combines signature policy with device identity and behavior. It recognizes the machine without knowing the agent’s name."
        >
          <CardGrid
            items={[
              {
                title: 'Signature-aware policy',
                accent: 'green',
                body: (
                  <>
                    Fast-path verified agents when a valid Web Bot Auth signature is
                    present. Apply a different policy to unverified traffic instead
                    of treating every request the same.
                  </>
                ),
              },
              {
                title: 'Cross-browser DeviceID',
                accent: 'blue',
                body: (
                  <>
                    Links the same cloud VM across sessions, browsers, cookie
                    clears, and IP changes. That is how one agent computer acting
                    for multiple accounts becomes visible.
                  </>
                ),
              },
              {
                title: 'Device integrity',
                accent: 'yellow',
                body: (
                  <>
                    WebGL/WebGPU renderer and limits, speech-voice families, system
                    font, canvas farbling, 2D-versus-WebGL bridge checks, and CDP
                    serializer/preload traps.
                  </>
                ),
              },
              {
                title: 'Edge telemetry',
                accent: 'purple',
                body: (
                  <>
                    ASN, JA4/H2, TCP TTL/MSS, TCP and TLS RTT, and a truncated
                    network prefix. The network path is often more stable than the
                    user-agent.
                  </>
                ),
              },
              {
                title: 'Behavior engine',
                accent: 'red',
                body: (
                  <>
                    Pointer, keyboard, and scroll kinematics plus synthetic-event
                    and timing checks. A bot that clicks without a human pointer
                    path leaves a different signature.
                  </>
                ),
              },
              {
                title: 'Explainable findings',
                accent: 'green',
                body: (
                  <>
                    Per-rule findings and a risk score in the dashboard or API. You
                    decide whether to allow, step up, or block the action.
                  </>
                ),
              },
            ]}
          />
        </SeoSection>

        <SeoSection
          id="policy"
          eyebrow="// Policy"
          title="Route Grok Bot by identity and action."
          intro="Verified agents and unverified automation need separate policies."
        >
          <CompareTable
            headers={['Session evidence', 'Recommended policy']}
            rows={[
              ['Valid Web Bot Auth + low-risk browse', 'Allow'],
              ['Valid Web Bot Auth + checkout or account action', 'Step-up or verify'],
              ['No signature + low-risk browse', 'Allow and monitor'],
              ['No signature + high-risk action', 'Challenge'],
              ['Automation signals + abuse behavior', 'Block'],
              ['Multiple accounts + promo abuse from one VM', 'Block or review'],
            ]}
            caption="The policy is a business decision. The detection layer should give you the evidence to make it consistently."
          />
          <div className="mt-6">
            <Callout tone="blue" title="Target the abusive session">
              Verified Grok Bots are doing work for a real user, so blocking all of
              them can block legitimate tasks. Target the undeclared, high-risk, or
              abusive session instead.
            </Callout>
          </div>
        </SeoSection>

        <SeoSection
          id="faq"
          eyebrow="// FAQ"
          title="Grok Bot detection questions"
          intro="Short answers for teams seeing Grok Bot in their logs."
        >
          <FaqList items={FAQ_ITEMS} />
        </SeoSection>

        <SeoSection
          id="sources"
          eyebrow="// Sources"
          title="What this page is based on"
          intro="Grok Bot and its signing behavior change quickly. These are the sources behind the claims above; verify the current state against your own telemetry."
        >
          <SourceList items={SOURCES} />
        </SeoSection>

        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
