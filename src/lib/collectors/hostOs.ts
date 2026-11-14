import type { SpeechSynthesisSignals } from './types';

/** The backend accepts at most this many voices before clamping. */
export const MAX_VOICE_COUNT = 1_024;
export const MAX_VOICE_FAMILIES = 16;

export interface HostOsSignals {
  speechSynthesis: SpeechSynthesisSignals;
  /** Resolved family for the CSS `font: 16px status-bar` system keyword. */
  systemFontFamily: string;
  p3Gamut: boolean;
  hdrSupported: boolean;
}

export function emptyHostOsSignals(): HostOsSignals {
  return {
    speechSynthesis: {
      available: false,
      voiceCount: 0,
      voiceFamilies: [],
    },
    systemFontFamily: '',
    p3Gamut: false,
    hdrSupported: false,
  };
}

/**
 * Probes OS-coupled subsystems that User-Agent spoofing does not reach:
 * text-to-speech voice inventories and the window manager's system font.
 */
export async function collectHostOsSignals(): Promise<HostOsSignals> {
  const result = emptyHostOsSignals();
  if (typeof window === 'undefined') return result;

  result.p3Gamut = matches('(color-gamut: p3)');
  result.hdrSupported =
    matches('(dynamic-range: high)') || matches('(video-dynamic-range: high)');
  result.systemFontFamily = readSystemFontFamily();

  if ('speechSynthesis' in window) {
    try {
      const voices = await readVoices();
      result.speechSynthesis = summarizeVoices(voices);
    } catch {
      // A spoofed/broken speechSynthesis must not fail the whole collector.
      result.speechSynthesis = {
        available: true,
        voiceCount: 0,
        voiceFamilies: [],
      };
    }
  }

  return result;
}

/**
 * Normalizes a voice inventory to the wire contract. Some hardened or spoofed
 * browsers return an implausible number of voices (Camoufox/Firefox on hosts
 * with a large speech-dispatcher inventory); the backend would otherwise
 * clamp it, so do it at the source and keep the report consistent.
 */
export function summarizeVoices(
  voices: readonly SpeechSynthesisVoice[],
): SpeechSynthesisSignals {
  const list = Array.isArray(voices)
    ? voices.filter((voice) => voice && typeof voice === 'object')
    : [];
  const families = Array.from(
    new Set(list.map(classifyVoiceFamily).filter((family) => family !== '')),
  )
    .sort()
    .slice(0, MAX_VOICE_FAMILIES);
  return {
    available: true,
    voiceCount: Math.min(list.length, MAX_VOICE_COUNT),
    voiceFamilies: families,
  };
}

function matches(query: string): boolean {
  try {
    return window.matchMedia?.(query).matches ?? false;
  } catch {
    return false;
  }
}

function readSystemFontFamily(): string {
  try {
    if (!document.body) return '';
    const probe = document.createElement('span');
    probe.textContent = 'evenstamp';
    probe.style.cssText =
      'position:absolute;left:-10000px;top:-10000px;font:16px status-bar;visibility:hidden';
    document.body.appendChild(probe);
    const family = window.getComputedStyle(probe).fontFamily ?? '';
    probe.remove();
    return family.slice(0, 128);
  } catch {
    return '';
  }
}

function readVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    try {
      const synth = window.speechSynthesis;
      const initial = normalizeVoiceList(synth.getVoices());
      if (initial.length > 0) {
        resolve(initial);
        return;
      }

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        try {
          synth.removeEventListener('voiceschanged', finish);
        } catch {
          // Ignore.
        }
        resolve(normalizeVoiceList(synth.getVoices()));
      };
      try {
        synth.addEventListener('voiceschanged', finish);
      } catch {
        // Some engines expose only the onvoiceschanged property.
      }
      setTimeout(finish, 300);
    } catch {
      resolve([]);
    }
  });
}

function normalizeVoiceList(value: unknown): SpeechSynthesisVoice[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (voice): voice is SpeechSynthesisVoice =>
      Boolean(voice) && typeof voice === 'object',
  );
}

/**
 * Maps a voice to the OS vendor that shipped it. Apple and Microsoft voices
 * cannot appear on the other vendor's genuine host.
 */
export function classifyVoiceFamily(voice: SpeechSynthesisVoice): string {
  const name =
    typeof voice?.name === 'string' ? voice.name.toLowerCase() : '';
  const uri =
    typeof voice?.voiceURI === 'string' ? voice.voiceURI.toLowerCase() : '';

  if (
    uri.includes('com.apple') ||
    uri.includes('apple') ||
    /^(samantha|alex|victoria|daniel|fred|karen|moira|tessa|rishi|siri)\b/.test(name)
  ) {
    return 'apple';
  }
  if (
    name.startsWith('microsoft') ||
    uri.includes('microsoft') ||
    uri.includes('sapi')
  ) {
    return 'microsoft';
  }
  if (name.startsWith('google') || uri.includes('google')) {
    return 'google';
  }
  return 'other';
}
