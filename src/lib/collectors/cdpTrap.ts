/**
 * Chrome DevTools Protocol (CDP) presence probes.
 *
 * Playwright, Puppeteer, and cloud stealth browsers patch `navigator.webdriver`
 * but still require an attached CDP session. Two side channels remain:
 *
 *  - Console serialization: `Runtime.enable` installs a V8 ValueMirror that
 *    eagerly reads getters when a console message is formatted. Passing an
 *    object with a side-effecting `stack` getter to `console.debug` flips a
 *    flag only when an inspector is listening.
 *  - Injected preload frames: `Page.addScriptToEvaluateOnNewDocument` scripts
 *    surface as anonymous `:1` CallSite frames without a file name.
 */

export interface CdpIntegrityResult {
  cdpSerializerTriggered: boolean;
  injectedPreloadDetected: boolean;
}

let trapsExecuted = false;

export function emptyCdpIntegrity(): CdpIntegrityResult {
  return { cdpSerializerTriggered: false, injectedPreloadDetected: false };
}

export function detectActiveCDPSession(): CdpIntegrityResult {
  const result = emptyCdpIntegrity();
  if (typeof window === 'undefined' || trapsExecuted) return result;
  trapsExecuted = true;

  result.cdpSerializerTriggered = probeConsoleSerializer();
  result.injectedPreloadDetected = probeInjectedPreloadFrames();
  return result;
}

function probeConsoleSerializer(): boolean {
  let triggered = false;
  try {
    const probe = new Error();
    Object.defineProperty(probe, 'stack', {
      configurable: true,
      get() {
        triggered = true;
        return '';
      },
    });
    // A console without an attached inspector does not format the object, so
    // the getter is never invoked. CDP's ValueMirror does.
    console.debug(probe);
  } catch {
    // Ignore consoles that reject the object.
  }
  return triggered;
}

function probeInjectedPreloadFrames(): boolean {
  try {
    const errorConstructor = Error as unknown as {
      prepareStackTrace?: (error: Error, frames: unknown[]) => unknown;
    };
    const originalPrepare = errorConstructor.prepareStackTrace;
    let frames: unknown = null;
    try {
      errorConstructor.prepareStackTrace = (_error, structuredStack) => structuredStack;
      frames = new Error().stack;
    } finally {
      errorConstructor.prepareStackTrace = originalPrepare;
    }

    if (!Array.isArray(frames)) return false;
    return frames.some((frame) => {
      const callSite = frame as {
        getFileName?: () => string | null;
        getLineNumber?: () => number | null;
        isNative?: () => boolean;
        toString?: () => string;
      };
      const fileName = callSite.getFileName?.() ?? '';
      const native = callSite.isNative?.() ?? false;
      const line = callSite.getLineNumber?.() ?? 0;
      const text = callSite.toString?.() ?? '';
      return (
        (fileName === '' && !native && line === 1) ||
        /^<anonymous>:1:/.test(text)
      );
    });
  } catch {
    // Non-V8 engines do not support structured CallSite frames.
    return false;
  }
}

