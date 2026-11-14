import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        primary: 'var(--colors-primary)',
        'on-primary': 'var(--colors-on-primary)',
        canvas: 'var(--colors-canvas)',
        hairline: 'var(--colors-hairline)',
        accent: {
          purple: '#7a3dff',
          pink: '#ed52cb',
          blue: '#3b89ff',
          'blue-deep': '#006acc',
          'blue-info': '#146ef5',
          orange: '#ff6b00',
          green: '#00d722',
          yellow: '#ffae13',
          red: '#ee1d36',
        },
        surface: {
          1: 'var(--colors-surface-1)',
          2: 'var(--colors-surface-2)',
          3: 'var(--colors-surface-3)',
          glass: 'var(--colors-surface-glass)',
        },
        ink: {
          DEFAULT: 'var(--colors-ink)',
          strong: 'var(--colors-ink-strong)',
          body: 'var(--colors-body)',
          'body-mid': 'var(--colors-body-mid)',
          mute: 'var(--colors-mute)',
          'mute-soft': 'var(--colors-mute-soft)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          code: 'var(--text-code)',
        },
        wire: 'var(--accent-wire)',
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '4px',
        md: '8px',
        full: '9999px',
      },
      fontSize: {
        'display-xxl': ['80px', { lineHeight: '83.2px', letterSpacing: '-0.8px', fontWeight: '600' }],
        'display-xl': ['56px', { lineHeight: '58.24px', letterSpacing: '0px', fontWeight: '600' }],
        'display-lg': ['44.8px', { lineHeight: '46.6px', letterSpacing: '0px', fontWeight: '600' }],
        'display-md': ['32px', { lineHeight: '41.6px', letterSpacing: '0px', fontWeight: '500' }],
        'display-sm': ['24px', { lineHeight: '31.2px', letterSpacing: '0px', fontWeight: '500' }],
        'display-xs': ['20px', { lineHeight: '28px', letterSpacing: '0px', fontWeight: '500' }],
        'eyebrow-uppercase': ['15px', { lineHeight: '19.5px', letterSpacing: '1.5px', fontWeight: '500' }],
        'eyebrow-uppercase-sm': ['12px', { lineHeight: '12px', letterSpacing: '0.6px', fontWeight: '500' }],
        'body-lg': ['28.8px', { lineHeight: '46.08px', letterSpacing: '-0.288px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '25.6px', letterSpacing: '-0.16px', fontWeight: '400' }],
        'body-md-strong': ['16px', { lineHeight: '25.6px', letterSpacing: '-0.16px', fontWeight: '500' }],
        'body-sm': ['14px', { lineHeight: '22.4px', letterSpacing: '0px', fontWeight: '400' }],
        'body-sm-strong': ['14px', { lineHeight: '22.4px', letterSpacing: '0px', fontWeight: '500' }],
        caption: ['12.8px', { lineHeight: '15.36px', letterSpacing: '0px', fontWeight: '550' }],
        'caption-mono': ['12px', { lineHeight: '18px', letterSpacing: '0px', fontWeight: '400' }],
        'button-md': ['16px', { lineHeight: '25.6px', letterSpacing: '-0.16px', fontWeight: '500' }],
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'var(--font-mono)',
          'Inconsolata',
          '"DM Mono"',
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'monospace',
        ],
      },
      boxShadow: {
        'level-1': 'none',
        'level-2':
          '0 84px 24px rgba(0,0,0,0), 0 54px 22px rgba(0,0,0,0.01), 0 30px 18px rgba(0,0,0,0.04), 0 13px 13px rgba(0,0,0,0.08), 0 3px 7px rgba(0,0,0,0.09)',
        'level-3':
          '0 84px 24px rgba(0,0,0,0), 0 54px 22px rgba(0,0,0,0.02), 0 30px 18px rgba(0,0,0,0.06), 0 13px 13px rgba(0,0,0,0.10), 0 3px 7px rgba(0,0,0,0.12)',
        'level-4':
          '0 24px 24px rgba(0,0,0,0.26), 0 6px 13px rgba(0,0,0,0.29)',
        specular: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'emerald-glow': '0 0 30px rgba(0, 215, 34, 0.25)',
        'danger-glow': '0 0 35px rgba(238, 29, 54, 0.15)',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        scan: {
          '0%': { transform: 'translateY(-120%)' },
          '100%': { transform: 'translateY(1200%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        scan: 'scan 7s linear infinite',
        'fade-up': 'fade-up 500ms ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
