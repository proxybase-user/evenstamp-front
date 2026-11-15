import { FAQ_ITEMS, PRICING_TIERS } from './site-data';

export const DEFAULT_SITE_URL = 'https://evenstamp.com';

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export function getOrganizationSchema(baseUrl = getBaseUrl()) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Evenstamp',
    legalName: 'Evenstamp Inc.',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/icon.svg`,
      width: '64',
      height: '64',
    },
    description:
      'Cross-browser hardware identification and fraud prevention engine. Stop fake accounts, promo abuse, and bots with cross-browser hardware identification.',
    email: 'engineering@evenstamp.com',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'technical support',
      email: 'engineering@evenstamp.com',
      availableLanguage: ['English'],
    },
  };
}

export function getWebSiteSchema(baseUrl = getBaseUrl()) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Evenstamp',
    description:
      'Cross-Browser Fraud & Abuse Protection with hardware identification and risk scoring.',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: 'en-US',
  };
}

export function getSoftwareApplicationSchema(baseUrl = getBaseUrl()) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${baseUrl}/#software`,
    name: 'Evenstamp Fraud & Abuse Protection Engine',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'All',
    url: baseUrl,
    description:
      'Recognize every visitor across Chrome, Safari, and Firefox — even when they clear cookies, switch browsers, or use a VPN. Stop fake accounts, promo abuse, and bots with cross-browser hardware identification.',
    offers: PRICING_TIERS.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      description: tier.tagline,
      price: tier.monthly.toFixed(2),
      priceCurrency: 'USD',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/pricing`,
    })),
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
  };
}

export function getFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
  baseUrl = getBaseUrl(),
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  };
}
