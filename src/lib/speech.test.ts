import { afterEach, describe, expect, it, vi } from 'vitest';
import { canSpeak, pickVoice, rankVoices, speak, speakAll, speakableExample, voiceLabel } from './speech';
import { DEFAULT_SETTINGS, useSettings } from '@/state/settings';

const voice = (name: string, lang: string) => ({ name, lang, voiceURI: name, localService: true, default: false }) as SpeechSynthesisVoice;

const FENNA = voice('Microsoft Fenna Online (Natural) - Dutch (Netherlands)', 'nl-NL');
const FRANK = voice('Microsoft Frank - Dutch (Netherlands)', 'nl-NL');
const GOOGLE = voice('Google Nederlands', 'nl-NL');
const ARNAUD = voice('Microsoft Arnaud Online (Natural) - Dutch (Belgium)', 'nl-BE');
const ENGLISH = voice('Google US English', 'en-US');

class FakeUtterance {
  lang = '';
  rate = 1;
  voice: SpeechSynthesisVoice | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(public text: string) {}
}

function stubSpeech(voices: SpeechSynthesisVoice[]) {
  const spoken: FakeUtterance[] = [];
  vi.stubGlobal('speechSynthesis', {
    speak: (utterance: FakeUtterance) => spoken.push(utterance),
    cancel: vi.fn(),
    resume: vi.fn(),
    paused: false,
    getVoices: () => voices,
    addEventListener: vi.fn(),
  });
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
  return spoken;
}

afterEach(() => {
  vi.unstubAllGlobals();
  useSettings.setState(DEFAULT_SETTINGS);
});

describe('stemkeuze', () => {
  it('zet natuurlijke Nederlandse stemmen voor Google, Google voor de basisstem, Nederland voor België', () => {
    const ranked = rankVoices([FRANK, ENGLISH, GOOGLE, ARNAUD, FENNA]);
    expect(ranked.map((entry) => entry.voice)).toEqual([FENNA, ARNAUD, GOOGLE, FRANK]);
    expect(ranked.map((entry) => entry.quality)).toEqual(['top', 'top', 'goed', 'basis']);
  });

  it('neemt de gekozen stem als die er is, anders de beste', () => {
    expect(pickVoice([FRANK, FENNA], FRANK.voiceURI)).toBe(FRANK);
    expect(pickVoice([FRANK, FENNA], 'weg')).toBe(FENNA);
    expect(pickVoice([ENGLISH], null)).toBeNull();
  });

  it('maakt korte namen', () => {
    expect(voiceLabel(FENNA)).toBe('Fenna');
    expect(voiceLabel(GOOGLE)).toBe('Google Nederlands');
  });
});

describe('voorlezen', () => {
  it('leest voor met de beste Nederlandse stem en het tempo uit de instellingen', () => {
    const spoken = stubSpeech([ENGLISH, FRANK, FENNA]);
    useSettings.getState().setSpeech({ rate: 'langzaam' });
    expect(speak('huis')).toBe(true);
    expect(spoken[0]).toMatchObject({ text: 'huis', lang: 'nl-NL', voice: FENNA, rate: 0.7 });
  });

  it('zwijgt als er alleen anderstalige stemmen zijn', () => {
    const spoken = stubSpeech([ENGLISH]);
    expect(canSpeak([ENGLISH])).toBe(false);
    expect(speak('huis')).toBe(false);
    expect(spoken).toHaveLength(0);
  });

  it('spreekt een contrastpaar na elkaar uit, met een pauze', () => {
    vi.useFakeTimers();
    const spoken = stubSpeech([FENNA]);
    speakAll(['piet', 'pit', 'piet'], { gap: 600 });
    expect(spoken.map((u) => u.text)).toEqual(['piet']);
    spoken[0]?.onend?.();
    expect(spoken).toHaveLength(1);
    vi.advanceTimersByTime(600);
    expect(spoken.map((u) => u.text)).toEqual(['piet', 'pit']);
    vi.useRealTimers();
  });
});

describe('uitspreekbare voorbeelden', () => {
  it('neemt woorden en korte woordgroepen', () => {
    expect(speakableExample('framboos')).toBe('framboos');
    expect(speakableExample('de rivier')).toBe('de rivier');
    expect(speakableExample('zee-egel')).toBe('zee-egel');
    expect(speakableExample('draMAtisch')).toBe('dramatisch');
  });

  it('slaat klanken, losse letters, afkortingen en notaties over', () => {
    for (const text of ['/ɛi/', 'ch', '-e', 'AP', 'mo(tor) + (h)otel', 'Distributed Morphology', 'き', 'bdfg']) {
      expect(speakableExample(text)).toBeNull();
    }
  });
});
