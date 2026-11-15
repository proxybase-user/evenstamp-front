import type { Metadata } from 'next';
import ArchitectureSection from '@/components/ArchitectureSection';
import ComparisonSection from '@/components/ComparisonSection';
import CtaSection from '@/components/CtaSection';
import FaqSection from '@/components/FaqSection';
import Hero from '@/components/Hero';
import IntegrationSection from '@/components/IntegrationSection';
import JsonLd from '@/components/JsonLd';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import TechniquesSection from '@/components/TechniquesSection';
import TrustSection from '@/components/TrustSection';
import TrustStrip from '@/components/TrustStrip';
import { FAQ_ITEMS } from '@/lib/site-data';
import { getBaseUrl, getFaqSchema } from '@/lib/seo-schemas';

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  title: {
    absolute: 'Evenstamp: Cross-Browser Fraud & Abuse Protection',
  },
  description:
    'Recognize every visitor across browsers, cookie clears, and VPNs. Stop fake accounts, promo abuse, and bots with cross-browser hardware identity.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Evenstamp: Cross-Browser Fraud & Abuse Protection',
    description:
      'Recognize every visitor across browsers, clear cookies, and VPNs. Stop fake accounts, promo abuse, and bots with cross-browser hardware identification.',
    url: siteUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evenstamp: Cross-Browser Fraud & Abuse Protection',
    description:
      'Recognize every visitor across browsers, clear cookies, and VPNs. Stop fake accounts, promo abuse, and bots with cross-browser hardware identification.',
  },
};

export default function HomePage() {
  const faqSchema = getFaqSchema(FAQ_ITEMS);

  return (
    <>
      <JsonLd data={faqSchema} />
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <TrustStrip />
        <ArchitectureSection />
        <TechniquesSection />
        <ComparisonSection />
        <IntegrationSection />
        <TrustSection />
        <FaqSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
