import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { speak, speakAll, stopSpeaking } from '@/lib/speech';
import { DEFAULT_SETTINGS, useSettings } from '@/state/settings';
import { clipKey, clipText, hasClip } from './clips';

vi.mock('./clips.generated', async () => {
  const { fingerprint } = await import('@/engine/hash');
  return { CLIP_VERSION: 't1', CLIP_KEYS: ['huis', 'piet', 'pit', "zo'n"].map((text) => fingerprint(text)).join(' ') };
});

class FakeAudio {
  static played: string[] = [];
  static last: FakeAudio | null = null;
  src = '';
  playbackRate = 1;
  preservesPitch = false;
  preload = '';
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor() {
    FakeAudio.last = this;
  }
  canPlayType() {
    return 'maybe';
  }
  play() {
    FakeAudio.played.push(this.src);
    return Promise.resolve();
  }
  pause() {}
}

const FENNA = { name: 'Microsoft Fenna Online (Natural) - Dutch (Netherlands)', lang: 'nl-NL', voiceURI: 'fenna', localService: false, default: false };

class FakeUtterance {
  lang = '';
  rate = 1;
  voice: unknown = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(public text: string) {}
}

let spoken: FakeUtterance[] = [];

beforeEach(() => {
  FakeAudio.played = [];
  spoken = [];
  vi.stubGlobal('Audio', FakeAudio);
  vi.stubGlobal('speechSynthesis', {
    speak: (utterance: FakeUtterance) => spoken.push(utterance),
    cancel: vi.fn(),
    resume: vi.fn(),
    paused: false,
    getVoices: () => [FENNA],
    addEventListener: vi.fn(),
  });
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
});

afterEach(() => {
  stopSpeaking();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  useSettings.setState(DEFAULT_SETTINGS);
});

const url = (text: string) => `/stem/${clipKey(text)}.mp3?v=t1`;

describe('pennig-stem', () => {
  it('maakt dezelfde sleutel ongeacht spaties en de soort apostrof', () => {
    expect(clipText('  zo’n   ding ')).toBe("zo'n ding");
    expect(hasClip('zo’n')).toBe(true);
    expect(hasClip('fiets')).toBe(false);
  });

  it('leest voor met het eigen bestand, ook als het apparaat een Nederlandse stem heeft', () => {
    useSettings.getState().setSpeech({ rate: 'langzaam' });
    expect(speak('huis')).toBe(true);
    expect(FakeAudio.played).toEqual([url('huis')]);
    expect(FakeAudio.last?.playbackRate).toBeCloseTo(0.7 / 0.85);
    expect(spoken).toHaveLength(0);
  });

  it('gebruikt de stem van het apparaat voor een tekst zonder bestand', () => {
    expect(speak('fiets')).toBe(true);
    expect(FakeAudio.played).toEqual([]);
    expect(spoken.map((u) => u.text)).toEqual(['fiets']);
  });

  it('gebruikt de stem van het apparaat als je die zelf koos', () => {
    useSettings.getState().setSpeech({ voice: 'fenna' });
    speak('huis');
    expect(FakeAudio.played).toEqual([]);
    expect(spoken[0]).toMatchObject({ text: 'huis', voice: FENNA });
  });

  it('speelt een contrastpaar na elkaar af, met een pauze', () => {
    vi.useFakeTimers();
    speakAll(['piet', 'pit', 'piet'], { gap: 600, slower: 0.85 });
    expect(FakeAudio.played).toEqual([url('piet')]);
    FakeAudio.last?.onended?.();
    expect(FakeAudio.played).toHaveLength(1);
    vi.advanceTimersByTime(600);
    expect(FakeAudio.played).toEqual([url('piet'), url('pit')]);
  });

  it('valt terug op de stem van het apparaat als een bestand niet laadt', () => {
    const onError = vi.fn();
    speak('huis', { onError });
    FakeAudio.last?.onerror?.();
    expect(spoken.map((u) => u.text)).toEqual(['huis']);
    expect(onError).not.toHaveBeenCalled();
  });
});
