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
      'Evenstamp — Cryptographic Precision & Forensic Telemetry',
    template: '%s · Evenstamp',
  },
  description:
    'Identify the physical machine across Chrome, Firefox, and Safari. Evenstamp fuses TCP SYN TTL and MSS wire telemetry, WebGPU silicon probes, canvas integrity traps, and Polars kinematic biometrics into one cryptographic device verdict.',
  keywords: [
    'device fingerprinting',
    'cross-browser device identity',
    'TCP TTL fingerprint',
    'JA4 fingerprint',
    'WebGPU fingerprint',
    'behavioral biometrics',
    'anti-detect browser detection',
    'bot detection',
    'account takeover prevention',
  ],
  authors: [{ name: 'Evenstamp' }],
  creator: 'Evenstamp',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Evenstamp',
    title: 'Evenstamp — Identify the physical machine',
    description:
      'Four orthogonal physical layers. One device identity. Cloud API or sovereign self-hosted Rust binary.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evenstamp — Identify the physical machine',
    description:
      'TCP wire telemetry, WebGPU silicon probes, canvas integrity traps, and Polars kinematic biometrics in one Rust binary.',
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
