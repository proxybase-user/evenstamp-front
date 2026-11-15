import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Evenstamp · Cross-Browser Fraud & Abuse Protection',
    short_name: 'Evenstamp',
    description:
      'Recognize every visitor across browsers, clear cookies, and VPNs. Stop fake accounts, promo abuse, and bots with cross-browser hardware identification.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080808',
    theme_color: '#080808',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
