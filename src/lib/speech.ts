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

export type SpeechChunk = { index: number; total: number; text: string };
/** Positie die de browser zelf meldt, gerekend in UTF-16-tekens van dit fragment. */
export type SpeechBoundary = SpeechChunk & {
  charIndex: number;
  /** Nul wanneer de browser geen bruikbare lengte van het gesproken deel meldt. */
  charLength: number;
  /** Meestal "word" of "sentence"; niet iedere stem meldt woordgrenzen. */
  name: string;
};
export type SpeakOptions = {
  /** Vaste snelheid; zonder deze waarde geldt het tempo uit de instellingen. */
  rate?: number;
  /** Tempo ten opzichte van de instelling, bijv. 0.8 voor "nog wat langzamer". */
  slower?: number;
  onEnd?: () => void;
  onError?: () => void;
  /** Nulgebaseerde voortgang zodra een fragment daadwerkelijk begint te klinken. */
  onChunk?: (chunk: SpeechChunk) => void;
  /** Werkelijke browsergrenzen voor meelezen; er worden geen woordtijden verzonnen. */
  onBoundary?: (boundary: SpeechBoundary) => void;
  /** Een andere opdracht, stoppen of native annulering neemt deze run over. */
  onInterrupt?: () => void;
};

export type SpeechStatus = 'idle' | 'speaking' | 'paused';
let speechStatus: SpeechStatus = 'idle';
const speechListeners = new Set<() => void>();
let generation = 0;
type ActiveSpeech = {
  generation: number;
  engine: SpeechSynthesis;
  timer: number | null;
  pending: (() => void) | null;
  onInterrupt?: () => void;
};
let activeSpeech: ActiveSpeech | null = null;

function setSpeechStatus(next: SpeechStatus) {
  if (speechStatus === next) return;
  speechStatus = next;
  speechListeners.forEach((listener) => listener());
}

function subscribeSpeech(listener: () => void) {
  speechListeners.add(listener);
  return () => { speechListeners.delete(listener); };
}

/** Alleen-lezen status van alle voorleesknoppen samen; op de server altijd idle. */
export function useSpeechStatus(): SpeechStatus {
  return useSyncExternalStore(subscribeSpeech, () => speechStatus, () => 'idle');
}

function clearTimer(run: ActiveSpeech | null) {
  if (run?.timer !== null && run?.timer !== undefined) window.clearTimeout(run.timer);
}

function finishRun(run: number): ActiveSpeech | null {
  if (activeSpeech?.generation !== run) return null;
  const previous = activeSpeech;
  activeSpeech = null;
  generation++;
  clearTimer(previous);
  setSpeechStatus('idle');
  return previous;
}

function abbreviationAt(text: string, index: number): boolean {
  if (text[index] !== '.') return false;
  const token = text.slice(0, index + 1).match(/[^\s]+$/u)?.[0].replace(/^["'‘“(]+/u, '').toLowerCase() ?? '';
  return /^(?:dr|dhr|mevr|mw|prof|mr|ir|ing|nr|art|ca|ong|bijv|bv|etc|enz)\.$/u.test(token) || /^(?:\p{L}\.){1,5}$/u.test(token);
}

/** Korte zinnen en langere zinsdelen; behoud alle tekst en bescherm afkortingen/getallen. */
export function chunks(text: string): string[] {
  const clean = text.replace(/\s+/gu, ' ').trim();
  if (!clean) return [];
  const sentences: string[] = [];
  let start = 0;
  for (let index = 0; index < clean.length; index++) {
    if (!/[.!?;:]/u.test(clean[index]!) || abbreviationAt(clean, index)) continue;
    let end = index + 1;
    while (end < clean.length && /["'’”)\]}]/u.test(clean[end]!)) end++;
    // Dit sluit ook punten in 1.5 en dubbele punten in 12:30 uit.
    if (end < clean.length && clean[end] !== ' ') continue;
    const sentence = clean.slice(start, end).trim();
    if (sentence) sentences.push(sentence);
    start = end;
    index = end - 1;
  }
  const tail = clean.slice(start).trim();
  if (tail) sentences.push(tail);
  return sentences.flatMap((sentence) => {
    const parts: string[] = [];
    let rest = sentence;
    while (rest.length > 220) {
      let cut = rest.lastIndexOf(' ', 220);
      const clause = [...rest.slice(0, 221).matchAll(/[,;:] /gu)].at(-1)?.index;
      if (clause !== undefined && clause >= 140) cut = clause + 1;
      while (cut > 0 && abbreviationAt(rest, cut - 1)) cut = rest.lastIndexOf(' ', cut - 1);
      if (cut <= 0) {
        cut = 220;
        // Een ongewoon lang woord mag worden gedeeld, maar geen UTF-16-teken doormidden.
        if (/[\uD800-\uDBFF]/u.test(rest[cut - 1]!)) cut--;
      }
      parts.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    if (rest) parts.push(rest);
    return parts;
  });
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
  const fragments = texts.flatMap((text, sourceIndex) => chunks(text).map((part) => ({ text: part, sourceIndex })));
  const parts = fragments.map((fragment) => fragment.text);
  if (parts.length === 0) return false;
  const voice = pickVoice(voices, useSettings.getState().speech.voice);
  const rate = Math.min(2, Math.max(0.4, options.rate ?? settingsRate() * (options.slower ?? 1)));
  const previous = activeSpeech;
  clearTimer(previous);
  const run = ++generation;
  const current: ActiveSpeech = { generation: run, engine: speech.engine, timer: null, pending: null, onInterrupt: options.onInterrupt };
  activeSpeech = current;

  const say = (index: number) => {
    if (run !== generation || activeSpeech !== current) return;
    if (speechStatus === 'paused') { current.pending = () => say(index); return; }
    try {
      const utterance = new speech.Utterance(parts[index] ?? '');
      utterance.lang = voice?.lang.replace('_', '-') ?? 'nl-NL';
      if (voice) utterance.voice = voice;
      utterance.rate = rate;
      let settled = false;
      let started = false;
      utterance.onstart = () => {
        if (run !== generation || settled || started) return;
        started = true;
        setSpeechStatus(speech.engine.paused ? 'paused' : 'speaking');
        options.onChunk?.({ index, total: parts.length, text: parts[index]! });
      };
      utterance.onboundary = (event) => {
        if (run !== generation || activeSpeech !== current || settled || !started) return;
        const text = parts[index]!;
        // Sommige stemmen leveren geen grenzen of een onbruikbare positie. Een lezer
        // kan dan het fragment markeren, zonder een gesproken woord te suggereren.
        if (!Number.isInteger(event.charIndex) || event.charIndex < 0 || event.charIndex > text.length) return;
        const charLength = Number.isInteger(event.charLength) && event.charLength >= 0 && event.charLength <= text.length - event.charIndex ? event.charLength : 0;
        options.onBoundary?.({ index, total: parts.length, text, charIndex: event.charIndex, charLength, name: event.name });
      };
      const syncStatus = () => { if (run === generation && !settled) setSpeechStatus(speech.engine.paused ? 'paused' : 'speaking'); };
      utterance.onpause = syncStatus;
      utterance.onresume = syncStatus;
      utterance.onend = () => {
        if (run !== generation || settled) return;
        settled = true;
        if (index + 1 >= parts.length) {
          finishRun(run);
          options.onEnd?.();
          return;
        }
        const gapAfter = fragments[index]!.sourceIndex !== fragments[index + 1]!.sourceIndex ? gap : 0;
        if (gapAfter > 0) current.timer = window.setTimeout(() => { current.timer = null; say(index + 1); }, gapAfter);
        else say(index + 1);
      };
      utterance.onerror = (event) => {
        if (run !== generation || settled) return;
        settled = true;
        const ended = finishRun(run);
        // Native annulering beëindigt óók de status, zonder een foutmelding te verzinnen.
        if (event.error === 'interrupted' || event.error === 'canceled') ended?.onInterrupt?.();
        else options.onError?.();
      };
      speech.engine.speak(utterance);
      return true;
    } catch {
      if (finishRun(run)) options.onError?.();
      return false;
    }
  };

  let accepted = false;
  try {
    speech.engine.cancel();
    // Sommige browsers blijven gepauzeerd na cancel; een nieuwe opdracht begint gewoon.
    if (speech.engine.paused) speech.engine.resume();
    setSpeechStatus('speaking');
    accepted = say(0) === true;
  } catch {
    if (finishRun(run)) options.onError?.();
  } finally {
    previous?.onInterrupt?.();
  }
  return accepted;
}

/** Leest `text` voor; geeft `false` als de browser geen Nederlandse spraak heeft. */
export function speak(text: string, options: SpeakOptions = {}): boolean {
  return speakAll([text], options);
}

/** Stopt wat er nu wordt voorgelezen. */
export function stopSpeaking() {
  const previous = activeSpeech;
  generation++;
  activeSpeech = null;
  clearTimer(previous);
  setSpeechStatus('idle');
  try {
    (previous?.engine ?? synth()?.engine)?.cancel();
  } catch {
    // Geen spraak: niets te stoppen.
  }
  previous?.onInterrupt?.();
}

/** Pauzeert een actieve opdracht; bij stilstand blijft de status idle. */
export function pauseSpeaking(): boolean {
  const current = activeSpeech;
  if (!current) return false;
  if (speechStatus === 'paused') return true;
  try {
    current.engine.pause();
    if (activeSpeech !== current || !current.engine.paused) return false;
    setSpeechStatus('paused');
    return true;
  } catch { return false; }
}

/** Hervat dezelfde opdracht, inclusief een fragment dat tijdens een pauze wachtte. */
export function resumeSpeaking(): boolean {
  const current = activeSpeech;
  if (!current || speechStatus !== 'paused') return false;
  try {
    current.engine.resume();
    if (activeSpeech !== current || current.engine.paused) return false;
    setSpeechStatus('speaking');
    const pending = current.pending;
    current.pending = null;
    pending?.();
    return true;
  } catch { return false; }
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
