import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Evenstamp · Cross-Browser Fraud & Abuse Protection';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17L4 12"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0C1017',
          padding: '64px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle radial decoration */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 85% 20%, rgba(16, 185, 129, 0.16) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(6, 182, 212, 0.14) 0%, transparent 45%)',
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#161F2E',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L20 6V12C20 16.7 16.7 20.5 12 22C7.3 20.5 4 16.7 4 12V6L12 2Z"
                  stroke="#10B981"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="#34D399"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              evenstamp<span style={{ color: '#10B981' }}>.com</span>
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 18px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34D399',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            ENGINE V2.4 · SOVEREIGN FRAUD DEFENSE
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            position: 'relative',
            zIndex: 10,
            maxWidth: '1000px',
          }}
        >
          <div
            style={{
              fontSize: '54px',
              fontWeight: 800,
              color: '#F8FAFC',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
            }}
          >
            Stop Multi-Accounting &amp; Bot Abuse
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#94A3B8',
              lineHeight: 1.4,
              maxWidth: '920px',
            }}
          >
            Recognize every visitor across Chrome, Safari, and Firefox — even when
            they clear cookies, switch browsers, or use VPNs. Physical hardware
            identification and instant 0–100 risk scoring.
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '10px 18px',
              borderRadius: '8px',
              color: '#F1F5F9',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            <CheckIcon color="#10B981" />
            <span>99.8% Cross-Browser Accuracy</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '10px 18px',
              borderRadius: '8px',
              color: '#F1F5F9',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            <CheckIcon color="#06B6D4" />
            <span>8-Layer Anti-Detect Traps</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '10px 18px',
              borderRadius: '8px',
              color: '#F1F5F9',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            <CheckIcon color="#A855F7" />
            <span>Self-Hosted or Cloud</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '10px 18px',
              borderRadius: '8px',
              color: '#F1F5F9',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            <CheckIcon color="#38BDF8" />
            <span>GDPR &amp; Privacy Compliant</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
