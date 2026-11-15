declare global {
  interface Window {
    umami?: {
      track: {
        (
          eventName: string,
          eventData?: Record<string, string | number | boolean>,
        ): void;
        (
          customFn: (props: Record<string, unknown>) => Record<string, unknown>,
        ): void;
      };
    };
  }
}

/**
 * Programmatically tracks a custom event with Umami analytics.
 * Safe to call even if the tracker is blocked by adblockers or unavailable.
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number | boolean>,
): void {
  if (typeof window !== 'undefined' && window.umami?.track) {
    try {
      window.umami.track(eventName, eventData);
    } catch {
      // Ignore errors if Umami script is blocked by browser extensions
    }
  }
}
