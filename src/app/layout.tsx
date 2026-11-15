import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import JsonLd from '@/components/JsonLd';
import { ThemeProvider } from '@/components/ThemeProvider';
import {
  getBaseUrl,
  getOrganizationSchema,
  getSoftwareApplicationSchema,
  getWebSiteSchema,
} from '@/lib/seo-schemas';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Evenstamp: Cross-Browser Fraud & Abuse Protection',
    template: '%s · Evenstamp',
  },
  description:
    'Recognize every visitor across browsers, cookie clears, and VPNs. Stop fake accounts, promo abuse, and bots with cross-browser hardware identity.',
  keywords: [
    'fraud prevention',
    'stop multi-accounting',
    'promo abuse prevention',
    'cross-browser device identity',
    'anti-detect browser detection',
    'bot detection',
    'chargeback prevention',
    'device fingerprinting',
    'residential proxy unmasking',
    'behavioral biometrics',
  ],
  authors: [{ name: 'Evenstamp', url: siteUrl }],
  creator: 'Evenstamp',
  publisher: 'Evenstamp',
  applicationName: 'Evenstamp',
  category: 'security',
  classification: 'Fraud Prevention & Device Intelligence',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Evenstamp',
    title: 'Evenstamp: Cross-Browser Fraud & Abuse Protection',
    description:
      'Recognize every visitor across browsers, clear cookies, and VPNs. Stop fake accounts, promo abuse, and bots with cross-browser hardware identification.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evenstamp: Cross-Browser Fraud & Abuse Protection',
    description:
      'Recognize every visitor across browsers, clear cookies, and VPNs. Stop fake accounts, promo abuse, and bots with cross-browser hardware identification.',
    creator: '@evenstamp',
    site: '@evenstamp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#080808' },
  ],
  colorScheme: 'light dark',
};

const THEME_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('evenstamp-theme');
    var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgSchema = getOrganizationSchema(siteUrl);
  const websiteSchema = getWebSiteSchema(siteUrl);
  const softwareSchema = getSoftwareApplicationSchema(siteUrl);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <JsonLd data={orgSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={softwareSchema} />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <Script
          src="https://analytics.lemontv.xyz/script.js"
          data-website-id="86497d60-19b2-44d3-bfd4-bc75a5c56aa9"
          strategy="afterInteractive"
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-[4px] focus:border focus:border-accent-green focus:bg-surface-2 focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink focus:shadow-level-2"
        >
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
