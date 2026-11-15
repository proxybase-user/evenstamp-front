'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

const COMMON_NAME_TO_CODE: Record<string, string> = {
  'united states': 'US',
  usa: 'US',
  'united kingdom': 'GB',
  uk: 'GB',
  germany: 'DE',
  france: 'FR',
  canada: 'CA',
  japan: 'JP',
  australia: 'AU',
  netherlands: 'NL',
  brazil: 'BR',
  india: 'IN',
  china: 'CN',
  russia: 'RU',
  singapore: 'SG',
  spain: 'ES',
  italy: 'IT',
  turkey: 'TR',
  mexico: 'MX',
  switzerland: 'CH',
  sweden: 'SE',
  poland: 'PL',
  ukraine: 'UA',
  ireland: 'IE',
  norway: 'NO',
  finland: 'FI',
  denmark: 'DK',
  belgium: 'BE',
  austria: 'AT',
  portugal: 'PT',
  israel: 'IL',
  'south korea': 'KR',
  korea: 'KR',
  'hong kong': 'HK',
  taiwan: 'TW',
};

export function resolveCountryCode(input?: string | null): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (/^[A-Za-z]{2}$/.test(trimmed) && trimmed.toUpperCase() !== 'XX') {
    return trimmed.toUpperCase();
  }
  const normalized = trimmed.toLowerCase();
  return COMMON_NAME_TO_CODE[normalized] ?? null;
}

export function countryCodeToEmoji(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) return '';
  const c1 = code.codePointAt(0)! + 127397;
  const c2 = code.codePointAt(1)! + 127397;
  return String.fromCodePoint(c1, c2);
}

export interface CountryFlagProps {
  country?: string | null;
  countryName?: string | null;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function CountryFlag({
  country,
  countryName,
  className = '',
  size = 'sm',
}: CountryFlagProps) {
  const [imageError, setImageError] = useState(false);
  const code = resolveCountryCode(country) || resolveCountryCode(countryName);

  if (!code) {
    return (
      <Globe
        className={`inline-block shrink-0 text-ink-muted/70 ${
          size === 'lg'
            ? 'h-5 w-5'
            : size === 'md'
              ? 'h-4 w-4'
              : 'h-3.5 w-3.5'
        } ${className}`}
        aria-hidden="true"
      />
    );
  }

  const emoji = countryCodeToEmoji(code);
  const title = countryName || country || code;

  const sizeClasses =
    size === 'lg'
      ? 'h-4 w-5.5'
      : size === 'md'
        ? 'h-3.5 w-5'
        : size === 'xs'
          ? 'h-2.5 w-3.5'
          : 'h-3 w-4';

  if (imageError) {
    return (
      <span
        title={title}
        role="img"
        aria-label={title}
        className={`inline-block font-sans select-none leading-none shrink-0 ${
          size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-xs'
        } ${className}`}
      >
        {emoji || code}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex items-center shrink-0 ${className}`}
      title={title}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
        alt={title}
        loading="lazy"
        decoding="async"
        onError={() => setImageError(true)}
        className={`inline-block rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.12)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.2)] shrink-0 ${sizeClasses}`}
      />
    </span>
  );
}
