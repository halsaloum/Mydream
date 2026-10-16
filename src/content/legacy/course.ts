/**
 * Typen uit de oorspronkelijke `data/course.ts` (regels 1–48, letterlijk overgenomen uit de
 * meest recente versie, map "src (3)").
 *
 * Alleen deze typen zijn meegenomen, zodat `build.ts` byte-voor-byte ongewijzigd kan blijven
 * (het importeert `type { Domain, Lesson } from './course'`).
 *
 * BEWUST WEGGELATEN: `COURSE` (tweede cursus, niveaus A0–M) en `BOOKS`.
 * De app gebruikt die niet. `COURSE` behandelt deels dezelfde onderwerpen als `build.ts`
 * met andere uitleg; twee actieve bronnen zouden elkaar tegenspreken.
 * De enige inhoudsbron van de app is `build.ts` → `src/content/catalog.ts`.
 */
export type Level = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'M'
export type Skill = 'Spelling' | 'Woorden' | 'Zinsbouw' | 'Complex' | 'Alinea'

export type Panel = {
  text: string
  show?: { wrong?: string; right: string }[]
  /** Interactief lab: kies een chip en zie het resultaat veranderen. */
  lab?: { label: string; chips: { k: string; out: string; note: string }[] }
  /** Tussendoor-quizje: moet goed zijn voordat je verder kunt (kost geen hartje). */
  quiz?: { q: string; options: string[]; answer: string; why: string }
  /** Knip een woord in lettergrepen, bv. answer 'bo-men'. */
  split?: { word: string; answer: string; note: string }
  /** Tik alle doelwoorden (indexen) in een zin aan. */
  mark?: { q: string; sentence: string; targets: number[]; note: string }
  /** Plak de juiste uitgang ('' = niets) achter een stam. */
  build?: { before?: string; stem: string; endings: string[]; answer: string; note: string }
  /** Regelkaart: de kern in één zin. */
  rule?: string
  /** Uitklapbare verdieping. */
  deep?: { q: string; a: string }
  /** Tik de doelletters in het alfabet aan. */
  alpha?: { q: string; targets: string[]; note: string }
  /** Wissel de middelste letter en kijk welke woorden bestaan. */
  wheel?: { start: string; end: string; options: { v: string; mean?: string }[]; need: number; note: string }
  /** Combineer twee letters tot een tweeklank. */
  blend?: { letters: string[]; pairs: { s: string; ex: string }[]; note: string }
  /** Wissel blokken tot de zin klopt. */
  swap?: { goal: string; blocks: string[]; accept: string[]; note: string }
}

export type Step =
  | { kind: 'explain'; title: string; panels: Panel[] }
  | { kind: 'sort'; prompt: string; buckets: [string, string]; items: { t: string; b: 0 | 1 }[]; why: string }
  | { kind: 'learn'; title: string; body: string; example: { wrong?: string; right: string }[] }
  | { kind: 'choice'; prompt: string; before: string; after: string; options: string[]; answer: string; why: string }
  | { kind: 'type'; prompt: string; before: string; after: string; hint: string; answer: string; why: string }
  | { kind: 'order'; prompt: string; tiles: string[]; answer: string; why: string }
  | { kind: 'combine'; prompt: string; a: string; b: string; options: string[]; answer: string; why: string }
  | { kind: 'paragraph'; prompt: string; parts: { role: string; text: string }[]; why: string }
  | { kind: 'write'; prompt: string; minWords: number; must: { label: string; test: RegExp }[]; why: string }
  /** Tik het foute woord aan en typ de verbetering. */
  | { kind: 'fix'; prompt: string; sentence: string; wrong: number; answer: string; why: string }
  /** Herschrijf een zin; elk antwoord in `accept` telt (hoofdletters/leestekens genegeerd). */
  | { kind: 'rewrite'; prompt: string; source: string; accept: string[]; why: string }

export type Domain = 'orth' | 'fon' | 'morf' | 'syn' | 'sem' | 'prag' | 'tekst'
export type Lesson = { id: string; title: string; skill: Skill; icon: string; domain?: Domain; also?: Domain[]; steps: Step[] }
export type Unit = { level: Level; title: string; goal: string; color: string; lessons: Lesson[] }
