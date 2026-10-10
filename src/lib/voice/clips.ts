import { fingerprint } from '@/engine/hash';
import { CLIP_KEYS, CLIP_VERSION } from './clips.generated';

/**
 * De pennig-stem: vooraf gemaakte Nederlandse geluidsbestanden (in `public/stem/`) voor alles
 * wat pennig voorleest. Zo klinkt elk dictee en elk voorbeeld altijd Nederlands, ook op een
 * apparaat zonder Nederlandse stem. Wat geen bestand heeft, leest de stem van het apparaat voor.
 */

/** Dezelfde tekst geeft altijd dezelfde sleutel; spaties en de soort apostrof tellen niet. */
export function clipText(text: string): string {
  return text.normalize('NFC').replace(/[‘’`´]/g, "'").replace(/\s+/g, ' ').trim();
}

export function clipKey(text: string): string {
  return fingerprint(clipText(text));
}

let keys: Set<string> | null = null;

export function hasClip(text: string): boolean {
  keys ??= new Set(CLIP_KEYS.split(' ').filter(Boolean));
  return keys.has(clipKey(text));
}

export function clipUrl(text: string): string {
  return `/stem/${clipKey(text)}.mp3?v=${CLIP_VERSION}`;
}

/* ------------------------------------------------------------------ afspelen */

let player: HTMLAudioElement | null = null;
let playable: boolean | null = null;

/** Kan deze browser de bestanden afspelen? (Niet op de server en niet in jsdom.) */
export function canPlayClips(): boolean {
  if (playable !== null) return playable;
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return false;
  try {
    playable = new Audio().canPlayType('audio/mpeg') !== '';
  } catch {
    playable = false;
  }
  return playable;
}

/** Eén speler voor alles: op iPhone mag een speler die je één keer zelf startte, daarna vanzelf verder. */
function audio(): HTMLAudioElement {
  if (!player) {
    player = new Audio();
    player.preload = 'auto';
  }
  return player;
}

let generation = 0;

type PlayOptions = { rate: number; gap: number; onEnd?: () => void; onError?: () => void };

/**
 * Speelt de bestanden van `texts` na elkaar af, met `gap` ms stilte ertussen. Een nieuwe opdracht
 * onderbreekt de vorige. Geeft `false` als niet elke tekst een bestand heeft.
 */
export function playClips(texts: readonly string[], { rate, gap, onEnd, onError }: PlayOptions): boolean {
  if (texts.length === 0 || !canPlayClips() || !texts.every(hasClip)) return false;
  const run = ++generation;
  const element = audio();

  const play = (index: number) => {
    if (run !== generation) return;
    element.onended = () => {
      if (run !== generation) return;
      if (index + 1 >= texts.length) return onEnd?.();
      if (gap > 0) window.setTimeout(() => play(index + 1), gap);
      else play(index + 1);
    };
    element.onerror = () => {
      if (run === generation) onError?.();
    };
    element.src = clipUrl(texts[index]!);
    element.playbackRate = rate;
    element.preservesPitch = true;
    element.play().catch((error: unknown) => {
      // AbortError: een nieuwe opdracht nam het over, geen echte fout.
      if (run !== generation || (error instanceof DOMException && error.name === 'AbortError')) return;
      onError?.();
    });
  };

  try {
    play(0);
    return true;
  } catch {
    return false;
  }
}

export function stopClips() {
  generation++;
  try {
    player?.pause();
  } catch {
    // Niets te stoppen.
  }
}
