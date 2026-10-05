import { useSyncExternalStore } from 'react';

/**
 * Voorlezen met de spraak van de browser (Web Speech API), in het Nederlands.
 * Niet elke browser heeft een Nederlandse stem; zonder spraak verbergen de oefeningen hun luisterknop.
 */
type SpeechWindow = Window &
  typeof globalThis & {
    speechSynthesis?: SpeechSynthesis;
    SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance;
  };

function synth(): { engine: SpeechSynthesis; Utterance: typeof SpeechSynthesisUtterance } | null {
  if (typeof window === 'undefined') return null;
  const { speechSynthesis: engine, SpeechSynthesisUtterance: Utterance } = window as SpeechWindow;
  return engine && Utterance ? { engine, Utterance } : null;
}

export function canSpeak(): boolean {
  return synth() !== null;
}

/** Leest `text` voor; geeft `false` als de browser geen spraak heeft. */
export function speak(text: string, { rate = 0.8 }: { rate?: number } = {}): boolean {
  const speech = synth();
  if (!speech) return false;
  try {
    speech.engine.cancel();
    const utterance = new speech.Utterance(text);
    utterance.lang = 'nl-NL';
    utterance.rate = rate;
    const voice = speech.engine.getVoices().find((candidate) => candidate.lang.replace('_', '-').toLowerCase().startsWith('nl'));
    if (voice) utterance.voice = voice;
    speech.engine.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

const noop = () => () => {};

/** Of er een luisterknop kan komen. Op de server en bij de eerste weergave: nee. */
export function useCanSpeak(): boolean {
  return useSyncExternalStore(noop, canSpeak, () => false);
}
