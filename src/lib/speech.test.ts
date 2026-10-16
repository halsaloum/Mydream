import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { canSpeak, chunks, pauseSpeaking, pickVoice, rankVoices, resumeSpeaking, speak, speakAll, speakableExample, stopSpeaking, useCanSpeak, useSpeechStatus, voiceLabel } from './speech';
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
  onstart: (() => void) | null = null;
  onpause: (() => void) | null = null;
  onresume: (() => void) | null = null;
  onboundary: ((event: { charIndex: number; charLength?: number; name: string }) => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(public text: string) {}
}

function stubSpeech(voices: SpeechSynthesisVoice[]) {
  const spoken: FakeUtterance[] = [];
  const engine = {
    speak: vi.fn((utterance: FakeUtterance) => spoken.push(utterance)),
    cancel: vi.fn(),
    pause: vi.fn(() => { engine.paused = true; }),
    resume: vi.fn(() => { engine.paused = false; }),
    paused: false,
    getVoices: () => voices,
    addEventListener: vi.fn(),
  };
  vi.stubGlobal('speechSynthesis', engine);
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
  return spoken;
}

afterEach(() => {
  stopSpeaking();
  vi.unstubAllGlobals();
  vi.useRealTimers();
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
  it('houdt de contrastpauze tussen teksten, zonder een extra pauze tussen hun zinnen', () => {
    vi.useFakeTimers();
    const spoken = stubSpeech([FENNA]);
    speakAll(['Eerste zin. Tweede zin.', 'Het contrast.'], { gap: 600 });
    spoken[0]?.onend?.();
    expect(spoken.map((utterance) => utterance.text)).toEqual(['Eerste zin.', 'Tweede zin.']);
    spoken[1]?.onend?.();
    vi.advanceTimersByTime(599);
    expect(spoken).toHaveLength(2);
    vi.advanceTimersByTime(1);
    expect(spoken[2]?.text).toBe('Het contrast.');
  });
  it('behoudt de gekozen Nederlandse stem en de vaste of relatieve snelheid', () => {
    const spoken = stubSpeech([FRANK, FENNA]);
    useSettings.getState().setSpeech({ voice: FRANK.voiceURI, rate: 'langzaam' });
    speak('eerste', { rate: 1.2 });
    speak('tweede', { slower: 0.8 });
    expect(spoken[0]).toMatchObject({ voice: FRANK, rate: 1.2 });
    expect(spoken[1]?.rate).toBeCloseTo(0.56);
  });
  it('ondersteunt het leestempo tot 2× en begrenst een hogere aanvraag op 2×', () => {
    const spoken = stubSpeech([FENNA]);
    speak('Tweemaal zo snel.', { rate: 2 });
    speak('Geen hoger tempo.', { rate: 3 });
    expect(spoken.map((utterance) => utterance.rate)).toEqual([2, 2]);
  });
  it('kan Nederlands aanvragen zolang stemmen nog laden en blijft stil bij anderstalige stemmen', () => {
    const spoken = stubSpeech([]);
    const available = renderHook(() => useCanSpeak());
    expect(available.result.current).toBe(true);
    expect(speak('voorlezen')).toBe(true);
    expect(spoken[0]).toMatchObject({ lang: 'nl-NL', voice: null });
    stopSpeaking();
    stubSpeech([ENGLISH]);
    const unavailable = renderHook(() => useCanSpeak());
    expect(unavailable.result.current).toBe(false);
    expect(speak('voorlezen')).toBe(false);
  });
  it('rapporteert ieder werkelijk gestart fragment eenmaal en eindigt na de laatste zin', () => {
    const spoken = stubSpeech([FENNA]);
    const onChunk = vi.fn(), onEnd = vi.fn();
    speak('Eerste zin. Tweede zin.', { onChunk, onEnd });
    expect(onChunk).not.toHaveBeenCalled();
    spoken[0]?.onstart?.();
    spoken[0]?.onstart?.();
    expect(onChunk).toHaveBeenCalledExactlyOnceWith({ index: 0, total: 2, text: 'Eerste zin.' });
    spoken[0]?.onend?.();
    expect(onEnd).not.toHaveBeenCalled();
    spoken[1]?.onstart?.();
    expect(onChunk).toHaveBeenLastCalledWith({ index: 1, total: 2, text: 'Tweede zin.' });
    spoken[1]?.onend?.();
    spoken[1]?.onend?.();
    expect(onEnd).toHaveBeenCalledOnce();
  });
  it('meldt uitsluitend native woordgrenzen van het werkelijk gestarte fragment', () => {
    vi.useFakeTimers();
    const spoken = stubSpeech([FENNA]);
    const onBoundary = vi.fn();
    speak('Eerste zin. Tweede zin.', { onBoundary });
    spoken[0]?.onboundary?.({ charIndex: 0, charLength: 6, name: 'word' });
    expect(onBoundary).not.toHaveBeenCalled();
    spoken[0]?.onstart?.();
    vi.advanceTimersByTime(5000);
    expect(onBoundary).not.toHaveBeenCalled();
    spoken[0]?.onboundary?.({ charIndex: 7, charLength: 3, name: 'word' });
    expect(onBoundary).toHaveBeenCalledExactlyOnceWith({ index: 0, total: 2, text: 'Eerste zin.', charIndex: 7, charLength: 3, name: 'word' });
    spoken[0]?.onend?.();
    spoken[0]?.onboundary?.({ charIndex: 0, charLength: 6, name: 'word' });
    expect(onBoundary).toHaveBeenCalledOnce();
    spoken[1]?.onstart?.();
    spoken[1]?.onboundary?.({ charIndex: 0, charLength: 6, name: 'word' });
    expect(onBoundary).toHaveBeenLastCalledWith({ index: 1, total: 2, text: 'Tweede zin.', charIndex: 0, charLength: 6, name: 'word' });
  });
  it('bewaart native UTF-16-posities en geeft een onbekende woordlengte als nul door', () => {
    const spoken = stubSpeech([FENNA]);
    const onBoundary = vi.fn();
    speak('🙂 huis.', { onBoundary });
    spoken[0]?.onstart?.();
    spoken[0]?.onboundary?.({ charIndex: 3, charLength: 4, name: 'word' });
    expect(onBoundary).toHaveBeenLastCalledWith({ index: 0, total: 1, text: '🙂 huis.', charIndex: 3, charLength: 4, name: 'word' });
    spoken[0]?.onboundary?.({ charIndex: 3, name: 'word' });
    expect(onBoundary).toHaveBeenLastCalledWith({ index: 0, total: 1, text: '🙂 huis.', charIndex: 3, charLength: 0, name: 'word' });
    spoken[0]?.onboundary?.({ charIndex: 3, charLength: 50, name: 'word' });
    expect(onBoundary).toHaveBeenLastCalledWith({ index: 0, total: 1, text: '🙂 huis.', charIndex: 3, charLength: 0, name: 'word' });
    for (const charIndex of [-1, 1.5, 9, Number.NaN, Number.POSITIVE_INFINITY]) {
      spoken[0]?.onboundary?.({ charIndex, charLength: 1, name: 'word' });
    }
    expect(onBoundary).toHaveBeenCalledTimes(3);
    spoken[0]?.onboundary?.({ charIndex: 8, charLength: 0, name: 'sentence' });
    expect(onBoundary).toHaveBeenLastCalledWith({ index: 0, total: 1, text: '🙂 huis.', charIndex: 8, charLength: 0, name: 'sentence' });
  });
  it('negeert late woordgrenzen na stoppen, overnemen en native annulering', () => {
    const spoken = stubSpeech([FENNA]);
    const onBoundary = vi.fn();
    speak('De eerste zin.', { onBoundary });
    spoken[0]?.onstart?.();
    stopSpeaking();
    spoken[0]?.onboundary?.({ charIndex: 3, charLength: 6, name: 'word' });
    speak('Een volgende zin.', { onBoundary });
    spoken[1]?.onstart?.();
    speak('Nieuwe eigenaar.');
    spoken[1]?.onboundary?.({ charIndex: 4, charLength: 8, name: 'word' });
    speak('Annuleer deze zin.', { onBoundary });
    spoken[3]?.onstart?.();
    spoken[3]?.onerror?.({ error: 'canceled' });
    spoken[3]?.onboundary?.({ charIndex: 9, charLength: 4, name: 'word' });
    expect(onBoundary).not.toHaveBeenCalled();
  });
  it('houdt een gedeelde, alleen-lezen status bij voor pauzeren, hervatten en afronden', () => {
    const spoken = stubSpeech([FENNA]);
    const status = renderHook(() => useSpeechStatus());
    expect(status.result.current).toBe('idle');
    expect(pauseSpeaking()).toBe(false);
    expect(resumeSpeaking()).toBe(false);
    act(() => { speak('Deze zin lees ik voor.'); });
    expect(status.result.current).toBe('speaking');
    act(() => { expect(pauseSpeaking()).toBe(true); });
    expect(status.result.current).toBe('paused');
    act(() => { expect(resumeSpeaking()).toBe(true); });
    expect(status.result.current).toBe('speaking');
    // Een vertraagd pause-event na resume mag de actuele browserstatus niet overschrijven.
    act(() => { spoken[0]?.onpause?.(); });
    expect(status.result.current).toBe('speaking');
    act(() => { spoken[0]?.onend?.(); });
    expect(status.result.current).toBe('idle');
  });
  it('verzint geen pauzestatus wanneer de browser pauzeren of hervatten weigert', () => {
    stubSpeech([FENNA]);
    const status = renderHook(() => useSpeechStatus());
    act(() => { speak('Een actieve zin.'); });
    vi.mocked(window.speechSynthesis.pause).mockImplementationOnce(() => {});
    act(() => { expect(pauseSpeaking()).toBe(false); });
    expect(status.result.current).toBe('speaking');
    act(() => { pauseSpeaking(); });
    vi.mocked(window.speechSynthesis.resume).mockImplementationOnce(() => {});
    act(() => { expect(resumeSpeaking()).toBe(false); });
    expect(status.result.current).toBe('paused');
    act(() => { stopSpeaking(); });
    expect(status.result.current).toBe('idle');
  });
  it('blijft idle als de browser de opdracht tijdens pauzeren of hervatten annuleert', () => {
    const spoken = stubSpeech([FENNA]);
    const status = renderHook(() => useSpeechStatus());
    act(() => { speak('Pauzeer deze zin.'); });
    vi.mocked(window.speechSynthesis.pause).mockImplementationOnce(() => {
      (window.speechSynthesis as unknown as { paused: boolean }).paused = true;
      spoken[0]?.onerror?.({ error: 'canceled' });
    });
    act(() => { expect(pauseSpeaking()).toBe(false); });
    expect(status.result.current).toBe('idle');
    act(() => { speak('Hervat deze zin.'); pauseSpeaking(); });
    expect(status.result.current).toBe('paused');
    vi.mocked(window.speechSynthesis.resume).mockImplementationOnce(() => {
      (window.speechSynthesis as unknown as { paused: boolean }).paused = false;
      spoken[1]?.onerror?.({ error: 'canceled' });
    });
    act(() => { expect(resumeSpeaking()).toBe(false); });
    expect(status.result.current).toBe('idle');
  });
  it('laat een volgend fragment tijdens een pauze wachten en hervat dezelfde wachtrij', () => {
    vi.useFakeTimers();
    const spoken = stubSpeech([FENNA]);
    const status = renderHook(() => useSpeechStatus());
    act(() => { speakAll(['piet', 'pit'], { gap: 600 }); });
    act(() => { spoken[0]?.onend?.(); pauseSpeaking(); vi.advanceTimersByTime(600); });
    expect(status.result.current).toBe('paused');
    expect(spoken.map((utterance) => utterance.text)).toEqual(['piet']);
    act(() => { resumeSpeaking(); });
    expect(spoken.map((utterance) => utterance.text)).toEqual(['piet', 'pit']);
    expect(status.result.current).toBe('speaking');
  });
  it('annuleert vertraagde fragmenten en late events na stoppen zonder voltooiingscallback', () => {
    vi.useFakeTimers();
    const spoken = stubSpeech([FENNA]);
    const onEnd = vi.fn(), onError = vi.fn(), onChunk = vi.fn(), onInterrupt = vi.fn();
    const status = renderHook(() => useSpeechStatus());
    act(() => { speakAll(['eerste', 'tweede'], { gap: 600, onEnd, onError, onChunk, onInterrupt }); });
    act(() => { spoken[0]?.onend?.(); stopSpeaking(); });
    expect(status.result.current).toBe('idle');
    act(() => {
      spoken[0]?.onstart?.(); spoken[0]?.onresume?.(); spoken[0]?.onpause?.();
      spoken[0]?.onerror?.({ error: 'network' }); spoken[0]?.onend?.();
      vi.advanceTimersByTime(600);
    });
    expect(spoken).toHaveLength(1);
    expect(status.result.current).toBe('idle');
    expect(onEnd).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(onChunk).not.toHaveBeenCalled();
    expect(onInterrupt).toHaveBeenCalledOnce();
  });
  it('geeft de oude run direct vrij als woordspraak de lezer overneemt', () => {
    const spoken = stubSpeech([FENNA]);
    const oldEnd = vi.fn(), oldError = vi.fn(), oldChunk = vi.fn(), onInterrupt = vi.fn(), newEnd = vi.fn();
    const status = renderHook(() => useSpeechStatus());
    act(() => { speak('Eerste lezerzin. Een vervolg.', { onEnd: oldEnd, onError: oldError, onChunk: oldChunk, onInterrupt }); pauseSpeaking(); });
    act(() => { speak('woord', { onEnd: newEnd }); });
    expect(onInterrupt).toHaveBeenCalledOnce();
    expect(status.result.current).toBe('speaking');
    expect(window.speechSynthesis.paused).toBe(false);
    act(() => { spoken[0]?.onend?.(); spoken[0]?.onerror?.({ error: 'canceled' }); spoken[0]?.onstart?.(); });
    expect(spoken.map((utterance) => utterance.text)).toEqual(['Eerste lezerzin.', 'woord']);
    expect(oldEnd).not.toHaveBeenCalled();
    expect(oldError).not.toHaveBeenCalled();
    expect(oldChunk).not.toHaveBeenCalled();
    act(() => { spoken[1]?.onend?.(); });
    expect(newEnd).toHaveBeenCalledOnce();
    expect(status.result.current).toBe('idle');
  });
  it('beëindigt native annulering zonder fout en meldt een echte spraakfout eenmaal', () => {
    const spoken = stubSpeech([FENNA]);
    const onEnd = vi.fn(), onError = vi.fn(), onInterrupt = vi.fn();
    const status = renderHook(() => useSpeechStatus());
    act(() => { speak('Annuleer deze zin.', { onEnd, onError, onInterrupt }); });
    act(() => { spoken[0]?.onerror?.({ error: 'canceled' }); });
    expect(status.result.current).toBe('idle');
    expect(onInterrupt).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();
    act(() => { speak('Een nieuwe zin. Nog een zin.', { onEnd, onError }); });
    act(() => { spoken[1]?.onerror?.({ error: 'network' }); spoken[1]?.onerror?.({ error: 'network' }); spoken[1]?.onend?.(); });
    expect(status.result.current).toBe('idle');
    expect(spoken).toHaveLength(2);
    expect(onError).toHaveBeenCalledOnce();
    expect(onEnd).not.toHaveBeenCalled();
  });
  it('blijft idle bij een synchrone browserfout of een lege leesopdracht', () => {
    stubSpeech([FENNA]);
    const onError = vi.fn();
    const status = renderHook(() => useSpeechStatus());
    vi.mocked(window.speechSynthesis.speak).mockImplementationOnce(() => { throw new Error('spraak niet beschikbaar'); });
    act(() => { expect(speak('Deze zin.', { onError })).toBe(false); });
    expect(onError).toHaveBeenCalledOnce();
    expect(status.result.current).toBe('idle');
    expect(speak('   ')).toBe(false);
    expect(status.result.current).toBe('idle');
  });
});

describe('veilige tekstfragmenten', () => {
  it('deelt een zeer lange zin op woordgrenzen zonder woorden of leestekens te verliezen', () => {
    const text = 'Beoordeel de premissen zorgvuldig, ' + 'want een lange zin kan veel samenhangende redenen bevatten '.repeat(12) + 'en houd de conclusie beperkt.';
    const parts = chunks(text);
    expect(parts.length).toBeGreaterThan(3);
    expect(parts.every((part) => part.length > 0 && part.length <= 220)).toBe(true);
    expect(parts.join(' ')).toBe(text.replace(/\s+/gu, ' ').trim());
  });
  it('houdt afkortingen en decimalen intact en bewaart aanhalingstekens bij hun zin', () => {
    const text = 'Dr. Jansen vergelijkt bijv. 1,5 euro met 1.5 euro i.p.v. een afgerond bedrag. “Is dat voldoende?” Daarna volgt de uitleg.';
    const parts = chunks(text);
    expect(parts).toEqual([
      'Dr. Jansen vergelijkt bijv. 1,5 euro met 1.5 euro i.p.v. een afgerond bedrag.',
      '“Is dat voldoende?”',
      'Daarna volgt de uitleg.',
    ]);
    expect(chunks('')).toEqual([]);
  });
  it('deelt ook een extreem lang token zonder tekens of een emojihelft te verliezen', () => {
    const text = 'x'.repeat(219) + '🙂' + 'y'.repeat(350);
    const parts = chunks(text);
    expect(parts.every((part) => part.length <= 220)).toBe(true);
    expect(parts.join('')).toBe(text);
    expect(parts.some((part) => part.startsWith('\uDE42') || part.endsWith('\uD83D'))).toBe(false);
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
