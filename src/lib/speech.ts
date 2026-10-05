import { useSyncExternalStore } from 'react';
import { SPEECH_RATES, useSettings } from '@/state/settings';

/**
 * Voorlezen in het Nederlands met de spraak van de browser (Web Speech API).
 *
 * De browser heeft vaak meerdere Nederlandse stemmen, van robotachtig tot heel natuurlijk.
 * pennig kiest de beste: neurale stemmen ("Natural", "Premium", "Verbeterd") boven Google
 * boven de oude basisstemmen, en Nederlands uit Nederland boven Vlaams. Wie zelf een stem
 * kiest in de instellingen, krijgt die. Is er géén Nederlandse stem, dan zwijgt pennig:
 * een Engelse stem die *huis* voorleest, leert je de verkeerde klanken.
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

/* ------------------------------------------------------------------ stemmen */

const lang = (voice: SpeechSynthesisVoice) => voice.lang.replace('_', '-').toLowerCase();
const isDutch = (voice: SpeechSynthesisVoice) => lang(voice).startsWith('nl');

export type VoiceQuality = 'top' | 'goed' | 'basis';

export type RankedVoice = { voice: SpeechSynthesisVoice; score: number; quality: VoiceQuality; region: 'Nederland' | 'België' | null };

/** Hoe natuurlijk een stem waarschijnlijk klinkt, afgeleid uit naam en taal. Hoger is beter. */
export function scoreVoice(voice: SpeechSynthesisVoice): number {
  const code = lang(voice);
  const name = voice.name;
  let score = code === 'nl-nl' || code === 'nl' ? 30 : code === 'nl-be' ? 20 : 10;
  // Neurale stemmen: Microsoft "Online (Natural)", Apple "Premium"/"Enhanced"/"Verbeterd".
  if (/natural|neural|premium|enhanced|verbeterd|online/i.test(name)) score += 40;
  else if (/google/i.test(name)) score += 25;
  // Stemmen die als goed bekendstaan, ook in hun gewone versie.
  if (/fenna|colette|maarten|xander|claire|ellen|dena|arnaud/i.test(name)) score += 8;
  if (/espeak|robot/i.test(name)) score -= 30;
  return score;
}

function quality(score: number): VoiceQuality {
  return score >= 65 ? 'top' : score >= 45 ? 'goed' : 'basis';
}

/** Alle Nederlandse stemmen, de beste eerst. */
export function rankVoices(voices: readonly SpeechSynthesisVoice[]): RankedVoice[] {
  return voices
    .filter(isDutch)
    .map((voice) => {
      const score = scoreVoice(voice);
      const code = lang(voice);
      const region = code === 'nl-be' ? 'België' : code === 'nl-nl' ? 'Nederland' : null;
      return { voice, score, quality: quality(score), region } satisfies RankedVoice;
    })
    .sort((a, b) => b.score - a.score || a.voice.name.localeCompare(b.voice.name));
}

/** De stem die pennig gebruikt: de gekozen stem als die er (nog) is, anders de beste. */
export function pickVoice(voices: readonly SpeechSynthesisVoice[], preferred: string | null): SpeechSynthesisVoice | null {
  const ranked = rankVoices(voices);
  return ranked.find((entry) => entry.voice.voiceURI === preferred)?.voice ?? ranked[0]?.voice ?? null;
}

/*
 * Chrome laadt de stemmen pas na een tijdje (`voiceschanged`); Safari soms zonder dat event.
 * Daarom een kleine winkel met een vaste lijst, die bij elke wijziging een nieuwe lijst krijgt.
 */
const EMPTY: SpeechSynthesisVoice[] = [];
let voiceList: SpeechSynthesisVoice[] = EMPTY;
const voiceListeners = new Set<() => void>();
let watching = false;

function readVoices() {
  const speech = synth();
  let next: SpeechSynthesisVoice[] = EMPTY;
  try {
    next = speech?.engine.getVoices() ?? EMPTY;
  } catch {
    next = EMPTY;
  }
  const same = next.length === voiceList.length && next.every((voice, i) => voice.voiceURI === voiceList[i]?.voiceURI);
  if (same) return;
  voiceList = next.length ? [...next] : EMPTY;
  // Later melden: readVoices loopt ook tijdens het tekenen (zie voiceSnapshot).
  queueMicrotask(() => voiceListeners.forEach((listener) => listener()));
}

function watchVoices() {
  if (watching) return;
  const speech = synth();
  if (!speech) return;
  watching = true;
  readVoices();
  try {
    speech.engine.addEventListener?.('voiceschanged', readVoices);
  } catch {
    // Oude browsers zonder events: het nakijken hieronder vangt het op.
  }
  // Vangnet voor browsers die het event niet sturen.
  [250, 1000, 3000].forEach((ms) => window.setTimeout(readVoices, ms));
}

function subscribeVoices(listener: () => void) {
  watchVoices();
  voiceListeners.add(listener);
  return () => {
    voiceListeners.delete(listener);
  };
}

function currentVoices(): SpeechSynthesisVoice[] {
  watchVoices();
  readVoices();
  return voiceList;
}

/** De stemmen van de browser, bijgewerkt zodra ze geladen zijn. Op de server: geen. */
export function useVoices(): SpeechSynthesisVoice[] {
  return useSyncExternalStore(subscribeVoices, voiceSnapshot, () => EMPTY);
}

function voiceSnapshot(): SpeechSynthesisVoice[] {
  return currentVoices();
}

/* ------------------------------------------------------------------ spreken */

/**
 * Kan pennig Nederlands spreken? Ja als er een Nederlandse stem is, of als de browser (nog)
 * geen stemmen noemt maar wel spraak heeft: dan zegt `lang = nl-NL` welke taal het moet zijn.
 * Nee als er alleen anderstalige stemmen zijn.
 */
export function canSpeak(voices: readonly SpeechSynthesisVoice[] = currentVoices()): boolean {
  if (!synth()) return false;
  return voices.length === 0 || voices.some(isDutch);
}

type SpeakOptions = {
  /** Vaste snelheid; zonder deze waarde geldt het tempo uit de instellingen. */
  rate?: number;
  /** Tempo ten opzichte van de instelling, bijv. 0.8 voor "nog wat langzamer". */
  slower?: number;
  onEnd?: () => void;
  onError?: () => void;
};

let generation = 0;

/** Lange teksten in zinnen: Chrome breekt uitspraken van meer dan ±15 seconden af. */
export function chunks(text: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= 160) return clean ? [clean] : [];
  return clean.match(/[^.!?;:]+[.!?;:]*\s*/g)?.map((part) => part.trim()).filter(Boolean) ?? [clean];
}

function settingsRate(): number {
  const id = useSettings.getState().speech.rate;
  return SPEECH_RATES.find((option) => option.id === id)?.rate ?? 0.85;
}

/**
 * Leest `texts` na elkaar voor, met `gap` milliseconden stilte ertussen (voor contrastparen
 * als *piet … pit*). Een nieuwe opdracht onderbreekt de vorige. Geeft `false` als er niet
 * in het Nederlands gesproken kan worden.
 */
export function speakAll(texts: readonly string[], { gap = 0, ...options }: SpeakOptions & { gap?: number } = {}): boolean {
  const speech = synth();
  const voices = currentVoices();
  if (!speech || !canSpeak(voices)) return false;
  const parts = texts.flatMap(chunks);
  if (parts.length === 0) return false;
  const voice = pickVoice(voices, useSettings.getState().speech.voice);
  const rate = Math.min(1.5, Math.max(0.4, options.rate ?? settingsRate() * (options.slower ?? 1)));
  const run = ++generation;

  const say = (index: number) => {
    if (run !== generation) return;
    const utterance = new speech.Utterance(parts[index] ?? '');
    utterance.lang = voice?.lang.replace('_', '-') ?? 'nl-NL';
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.onend = () => {
      if (run !== generation) return;
      if (index + 1 >= parts.length) return options.onEnd?.();
      const gapAfter = texts.length > 1 ? gap : 0;
      if (gapAfter > 0) window.setTimeout(() => say(index + 1), gapAfter);
      else say(index + 1);
    };
    utterance.onerror = (event) => {
      // `interrupted`/`canceled`: een nieuwe opdracht nam het over, geen echte fout.
      if (run !== generation || event.error === 'interrupted' || event.error === 'canceled') return;
      options.onError?.();
    };
    speech.engine.speak(utterance);
    // Chrome blijft soms op pauze staan na een eerdere onderbreking.
    if (speech.engine.paused) speech.engine.resume();
  };

  try {
    speech.engine.cancel();
    say(0);
    return true;
  } catch {
    return false;
  }
}

/** Leest `text` voor; geeft `false` als de browser geen Nederlandse spraak heeft. */
export function speak(text: string, options: SpeakOptions = {}): boolean {
  return speakAll([text], options);
}

/** Stopt wat er nu wordt voorgelezen. */
export function stopSpeaking() {
  generation++;
  try {
    synth()?.engine.cancel();
  } catch {
    // Geen spraak: niets te stoppen.
  }
}

/** Of er een luisterknop kan komen. Op de server en bij de eerste weergave: nee. */
export function useCanSpeak(): boolean {
  return useSyncExternalStore(subscribeVoices, () => canSpeak(voiceSnapshot()), () => false);
}

/**
 * Taalvoorbeelden die echt uit te spreken zijn: woorden en korte woordgroepen.
 * Geen IPA (klanken tussen schuine strepen), losse letters of lettercombinaties (*ch*, *-e*), afkortingen (*AP*),
 * notaties met haakjes of plustekens, of anderstalige termen met hoofdletters.
 */
export function speakableExample(text: string, { sentence = false }: { sentence?: boolean } = {}): string | null {
  const clean = text.trim();
  if (clean.length < 3 || clean.length > (sentence ? 220 : 60)) return null;
  if (/[/[\]()+=<>{}|#@_\d]/.test(clean)) return null;
  if (/^[-'’]|[-'’]$/.test(clean)) return null;
  // Alleen Latijnse letters (met accenten), spaties, koppeltekens en leestekens.
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿĳĲ' ’,.!?;:-]+$/.test(clean)) return null;
  if (!/[aeiouyèéëêïöüáóú]/i.test(clean)) return null;
  const words = clean.split(/\s+/);
  if (words.length > (sentence ? 30 : 8)) return null;
  // Afkortingen (AP, VP) en termen als *Distributed Morphology*. Hele zinnen mogen namen hebben.
  if (/^[A-Z]{2,}$/.test(clean)) return null;
  if (!sentence && words.slice(1).some((word) => /^[A-Z]/.test(word))) return null;
  // Klemtoon in hoofdletters (*draMAtisch*) spreek je gewoon uit.
  return /[a-z][A-Z]/.test(clean) ? clean.toLowerCase() : clean;
}

/** Korte naam voor een stem: "Microsoft Fenna Online (Natural) - Dutch (Netherlands)" wordt "Fenna". */
export function voiceLabel(voice: SpeechSynthesisVoice): string {
  if (/^google/i.test(voice.name)) return voice.name;
  const short = voice.name
    .replace(/^(Microsoft|Apple)\s+/i, '')
    .replace(/\s*[-–]\s*(Dutch|Nederlands).*$/i, '')
    .replace(/\s*\((Natural|Enhanced|Premium|Verbeterd)\)/gi, '')
    .replace(/\s+Online\b/i, '')
    .trim();
  return short || voice.name;
}
