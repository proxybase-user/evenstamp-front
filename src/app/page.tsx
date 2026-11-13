import ArchitectureSection from '@/components/ArchitectureSection';
import ComparisonSection from '@/components/ComparisonSection';
import CtaSection from '@/components/CtaSection';
import FaqSection from '@/components/FaqSection';
import Hero from '@/components/Hero';
import IntegrationSection from '@/components/IntegrationSection';
import PricingSection from '@/components/PricingSection';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import TechniquesSection from '@/components/TechniquesSection';
import TrustSection from '@/components/TrustSection';
import TrustStrip from '@/components/TrustStrip';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TrustStrip />
        <ArchitectureSection />
        <TechniquesSection />
        <ComparisonSection />
        <PricingSection />
        <IntegrationSection />
        <TrustSection />
        <FaqSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
