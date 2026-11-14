import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

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

const siteUrl = 'https://evenstamp.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      'Evenstamp — Cross-Browser Fraud & Abuse Protection',
    template: '%s · Evenstamp',
  },
  description:
    'Recognize every visitor—even when they clear cookies, switch browsers, or use a VPN. Stop fake accounts, promo abuse, and bots with cross-browser hardware identification.',
  keywords: [
    'fraud prevention',
    'stop multi-accounting',
    'promo abuse prevention',
    'cross-browser device identity',
    'anti-detect browser detection',
    'bot detection',
    'chargeback prevention',
  ],
  authors: [{ name: 'Evenstamp' }],
  creator: 'Evenstamp',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Evenstamp',
    title: 'Evenstamp — Stop Multi-Accounting & Bot Abuse',
    description:
      'Recognize every visitor—even when they try to hide. Instant fraud risk score and cross-browser hardware ID.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evenstamp — Stop Multi-Accounting & Bot Abuse',
    description:
      'Recognize every visitor—even when they try to hide. Instant fraud risk score and cross-browser hardware ID.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
