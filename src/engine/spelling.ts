import { z } from 'zod';
import { clozeOf, matchesAnswer } from '@/content/cloze';
import type { Step, StepOf } from '@/content/schema';
import { plural, taskOutcome, type Feedback, type Outcome } from './outcome';

/**
 * Engine voor de lange spellingoefeningen: invultekst (`cloze`), reeks (`drill`) en
 * tekstdictee (`passage`). Alle spelregels staan hier als pure functies; de componenten tonen
 * alleen wat deze functies teruggeven.
 *
 * - Invultekst en tekstdictee controleer je zelf (graded). Ze zijn te lang om in dezelfde les
 *   nog eens aan te bieden: de score is het deel dat goed is, fouten gaan naar de herhaalstapel.
 * - De reeks controleert zichzelf (task): elk antwoord krijgt meteen reactie, en wat fout gaat,
 *   komt achteraan terug tot het goed is (hoogstens twee keer). De score is het deel dat in één
 *   keer goed was.
 */

const index = z.int().nonnegative();
const count = z.int().nonnegative();

export const SPELLING_RESPONSE_SCHEMAS = [
  z.object({ kind: z.literal('cloze'), values: z.array(z.string()) }),
  z.object({ kind: z.literal('drill'), answers: z.array(z.object({ item: index, typed: z.string(), ok: z.boolean() })), value: z.string() }),
  z.object({ kind: z.literal('passage'), values: z.array(z.string()), plays: z.array(count), peeks: z.array(count) }),
] as const;

export type SpellingResponse = z.infer<(typeof SPELLING_RESPONSE_SCHEMAS)[number]>;
export type SpellingKind = SpellingResponse['kind'];
export type SpellingResponseOf<K extends SpellingKind> = Extract<SpellingResponse, { kind: K }>;

const KINDS = new Set<string>(SPELLING_RESPONSE_SCHEMAS.map((schema) => schema.shape.kind.value));

export function isSpellingKind(kind: string): kind is SpellingKind {
  return KINDS.has(kind);
}

/* ------------------------------------------------------------------ woorden vergelijken */

export const normalizeSpaces = (text: string) => text.replace(/\s+/g, ' ').trim();

/**
 * Een telefoon maakt van ' vaak ’ of ´ (en van " vaak “ of ”): in een dictee telt dat niet als fout.
 * Een é die uit e + accentteken bestaat (geplakte tekst) telt als é.
 */
export const normalizeQuotes = (text: string) =>
  text
    .normalize('NFC')
    .replace(/[‘’`´]/g, "'")
    .replace(/[“”„]/g, '"');

const words = (text: string) => {
  const clean = normalizeSpaces(text);
  return clean ? clean.split(' ') : [];
};

/** Hoe veel twee woorden op elkaar lijken (0–1), op letters, zonder hoofdletters. */
function likeness(a: string, b: string): number {
  const x = a.toLocaleLowerCase('nl');
  const y = b.toLocaleLowerCase('nl');
  const row = Array.from({ length: y.length + 1 }, (_, j) => j);
  for (let i = 1; i <= x.length; i++) {
    let diagonal = row[0]!;
    row[0] = i;
    for (let j = 1; j <= y.length; j++) {
      const above = row[j]!;
      row[j] = Math.min(above + 1, row[j - 1]! + 1, diagonal + (x[i - 1] === y[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return 1 - row[y.length]! / Math.max(1, x.length, y.length);
}

export type WordMark = { word: string; ok: boolean; typed: string | null };
/** `extraAt[k]`: het woord `extra[k]` stond vóór `marks[extraAt[k]]` (of aan het eind). */
export type WordDiff = { marks: WordMark[]; extra: string[]; extraAt: number[]; right: number };

/**
 * Vergelijkt een getypte zin woord voor woord met de goede zin. De woorden worden eerst op
 * elkaar gelegd (zoals bij een spellingcontrole), zodat één vergeten woord niet alle woorden
 * erna fout maakt. Hoofdletters en leestekens tellen mee; spaties en gekrulde aanhalingstekens niet.
 */
export function wordDiff(sentence: string, typed: string): WordDiff {
  const target = words(sentence);
  const mine = words(typed);
  const same = (a: string, b: string) => normalizeQuotes(a) === normalizeQuotes(b);
  // Een woord vervangen door een woord dat erop lijkt (een spelfout) is goedkoper dan door een ander woord.
  const swap = (a: string, b: string) => (same(a, b) ? 0 : likeness(normalizeQuotes(a), normalizeQuotes(b)) >= 0.5 ? 1 : 1.5);
  const n = target.length;
  const m = mine.length;
  // Afstand in woorden: overslaan of toevoegen kost 1, vervangen 1 of 1,5.
  const cost: number[][] = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const sub = cost[i - 1]![j - 1]! + swap(target[i - 1]!, mine[j - 1]!);
      cost[i]![j] = Math.min(sub, cost[i - 1]![j]! + 1, cost[i]![j - 1]! + 1);
    }
  }
  const marks: WordMark[] = [];
  const extra: string[] = [];
  const before: number[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    const here = cost[i]![j]!;
    if (i > 0 && j > 0 && here === cost[i - 1]![j - 1]! + swap(target[i - 1]!, mine[j - 1]!)) {
      const ok = same(target[i - 1]!, mine[j - 1]!);
      marks.unshift({ word: target[i - 1]!, ok, typed: mine[j - 1]! });
      i--;
      j--;
    } else if (i > 0 && here === cost[i - 1]![j]! + 1) {
      marks.unshift({ word: target[i - 1]!, ok: false, typed: null });
      i--;
    } else {
      extra.unshift(mine[j - 1]!);
      before.unshift(i);
      j--;
    }
  }
  return { marks, extra, extraAt: before, right: marks.filter((mark) => mark.ok).length };
}

/** De nagekeken woorden in de volgorde waarin de leerling ze typte: woorden te veel staan op hun plek. */
export function diffSequence(diff: WordDiff): Array<{ kind: 'mark'; mark: WordMark } | { kind: 'extra'; word: string }> {
  const out: Array<{ kind: 'mark'; mark: WordMark } | { kind: 'extra'; word: string }> = [];
  const extras = (at: number) => diff.extra.flatMap((word, k) => (diff.extraAt[k] === at ? [{ kind: 'extra' as const, word }] : []));
  diff.marks.forEach((mark, m) => {
    out.push(...extras(m), { kind: 'mark', mark });
  });
  out.push(...extras(diff.marks.length));
  return out;
}

/* ------------------------------------------------------------------ invultekst */

/** Per gat: goed of niet. */
export function clozeResults(step: StepOf<'cloze'>, values: readonly string[]): boolean[] {
  return clozeOf(step.text).gaps.map((gap, i) => matchesAnswer(values[i] ?? '', gap.answers, step.caps ?? false));
}

export const clozeGapCount = (step: StepOf<'cloze'>) => clozeOf(step.text).gaps.length;

/* ------------------------------------------------------------------ reeks */

/** Zo vaak komt een fout woord hoogstens terug. */
export const DRILL_RETRIES = 2;

type DrillAnswer = SpellingResponseOf<'drill'>['answers'][number];

/** De volgorde van de reeks tot nu toe: alle woorden, plus de fout beantwoorde achteraan. */
export function drillQueue(step: StepOf<'drill'>, answers: readonly DrillAnswer[]): number[] {
  const queue = step.items.map((_, i) => i);
  const misses = new Map<number, number>();
  for (const answer of answers) {
    if (answer.ok) continue;
    const missed = (misses.get(answer.item) ?? 0) + 1;
    misses.set(answer.item, missed);
    if (missed <= DRILL_RETRIES) queue.push(answer.item);
  }
  return queue;
}

/** Het woord dat nu aan de beurt is, of `null` als de reeks klaar is. */
export function drillCurrent(step: StepOf<'drill'>, r: SpellingResponseOf<'drill'>): number | null {
  return drillQueue(step, r.answers)[r.answers.length] ?? null;
}

export function drillCheck(step: StepOf<'drill'>, item: number, typed: string): boolean {
  const entry = step.items[item];
  return entry ? matchesAnswer(typed, [entry.a, ...(entry.also ?? [])], step.caps ?? false) : false;
}

/** Hoeveel woorden in één keer goed waren, en de langste reeks goede antwoorden op rij. */
export function drillStats(step: StepOf<'drill'>, answers: readonly DrillAnswer[]) {
  const first = new Map<number, boolean>();
  let run = 0;
  let best = 0;
  for (const answer of answers) {
    if (!first.has(answer.item)) first.set(answer.item, answer.ok);
    run = answer.ok ? run + 1 : 0;
    best = Math.max(best, run);
  }
  const firstTry = [...first.values()].filter(Boolean).length;
  return { firstTry, total: step.items.length, run, best };
}

/* ------------------------------------------------------------------ tekstdictee */

export function passageDiffs(step: StepOf<'passage'>, values: readonly string[]): WordDiff[] {
  return step.sentences.map((sentence, i) => wordDiff(sentence, values[i] ?? ''));
}

/** Deel van de woorden dat goed is; een woord te veel telt als fout. */
export function passageScore(step: StepOf<'passage'>, values: readonly string[]) {
  const diffs = passageDiffs(step, values);
  const right = diffs.reduce((sum, diff) => sum + diff.right, 0);
  const total = diffs.reduce((sum, diff) => sum + diff.marks.length, 0);
  const extra = diffs.reduce((sum, diff) => sum + diff.extra.length, 0);
  return { right, total, extra, score: total + extra > 0 ? right / (total + extra) : 1 };
}

/* ------------------------------------------------------------------ engine */

type Spelling = StepOf<SpellingKind>;
const isSpellingStep = (step: Step): step is Spelling => isSpellingKind(step.kind);

export function spellingInitialResponse(step: Step): SpellingResponse | null {
  switch (step.kind) {
    case 'cloze':
      return { kind: 'cloze', values: clozeOf(step.text).gaps.map(() => '') };
    case 'drill':
      return { kind: 'drill', answers: [], value: '' };
    case 'passage':
      return { kind: 'passage', values: step.sentences.map(() => ''), plays: step.sentences.map(() => 0), peeks: step.sentences.map(() => 0) };
    default:
      return null;
  }
}

export function spellingIsComplete(step: Step, r: SpellingResponse): boolean {
  if (!isSpellingStep(step) || step.kind !== r.kind) return false;
  switch (r.kind) {
    case 'cloze':
      return step.kind === 'cloze' && r.values.length === clozeGapCount(step) && r.values.every((value) => value.trim().length > 0);
    case 'drill':
      return step.kind === 'drill' && drillCurrent(step, r) === null;
    case 'passage':
      return step.kind === 'passage' && r.values.length === step.sentences.length && r.values.every((value) => value.trim().length > 0);
  }
}

export function spellingFits(step: Step, r: SpellingResponse): boolean {
  if (step.kind !== r.kind) return false;
  switch (r.kind) {
    case 'cloze':
      return step.kind === 'cloze' && r.values.length === clozeGapCount(step);
    case 'drill': {
      if (step.kind !== 'drill') return false;
      const queue = drillQueue(step, r.answers);
      return r.answers.every((answer, i) => answer.item < step.items.length && queue[i] === answer.item);
    }
    case 'passage':
      return step.kind === 'passage' && [r.values, r.plays, r.peeks].every((list) => list.length === step.sentences.length);
  }
}

/** Lang werk komt niet nog eens in dezelfde les; wat niet foutloos is, gaat naar de herhaalstapel. */
function longOutcome(score: number): Outcome {
  const rounded = Math.round(score * 1000) / 1000;
  return { score: rounded, correct: rounded >= 1, requeue: false, review: rounded >= 1 ? 'clear' : 'miss' };
}

export function spellingEvaluate(step: Step, r: SpellingResponse): Outcome {
  switch (r.kind) {
    case 'cloze': {
      if (step.kind !== 'cloze') break;
      const results = clozeResults(step, r.values);
      return longOutcome(results.filter(Boolean).length / Math.max(1, results.length));
    }
    case 'drill': {
      if (step.kind !== 'drill') break;
      const { firstTry, total } = drillStats(step, r.answers);
      return taskOutcome(firstTry / total);
    }
    case 'passage': {
      if (step.kind !== 'passage') break;
      return longOutcome(passageScore(step, r.values).score);
    }
  }
  return { score: 0, correct: false, requeue: false, review: 'miss' };
}

export function spellingFeedback(step: Step, r: SpellingResponse, outcome: Outcome): Feedback {
  switch (r.kind) {
    case 'cloze': {
      if (step.kind !== 'cloze') break;
      const results = clozeResults(step, r.values);
      const right = results.filter(Boolean).length;
      return outcome.correct
        ? { title: 'Alles goed ingevuld!', body: step.why }
        : { title: `${right} van de ${results.length} goed`, body: `De rode vakjes laten zien wat er moest staan. ${step.why}` };
    }
    case 'drill': {
      if (step.kind !== 'drill') break;
      const { firstTry, total, best } = drillStats(step, r.answers);
      const body = `${firstTry} van de ${total} in één keer goed. Langste reeks: ${best} op rij.`;
      if (step.done) return { title: step.done.title, body: `${body} ${step.done.text}` };
      return { title: firstTry === total ? 'Foutloze reeks!' : 'Reeks klaar', body };
    }
    case 'passage': {
      if (step.kind !== 'passage') break;
      const { right, total, extra } = passageScore(step, r.values);
      if (outcome.correct) return { title: 'Foutloos dictee!', body: step.right };
      const wrong = total - right + extra;
      return { title: `${wrong} ${plural(wrong, 'fout', 'fouten')} in het dictee`, body: `${right} van de ${total} woorden goed. ${step.wrong}` };
    }
  }
  return { title: outcome.correct ? 'Klaar!' : 'Klaar' };
}

export function spellingProgress(step: Step, r: SpellingResponse): string | null {
  switch (r.kind) {
    case 'cloze': {
      if (step.kind !== 'cloze') return null;
      const open = r.values.filter((value) => value.trim().length === 0).length;
      return open === 0 ? null : `Nog ${open} ${plural(open, 'vakje', 'vakjes')} leeg`;
    }
    case 'drill': {
      if (step.kind !== 'drill') return null;
      const left = drillQueue(step, r.answers).length - r.answers.length;
      return `Nog ${left} in de reeks`;
    }
    case 'passage': {
      if (step.kind !== 'passage') return null;
      const open = r.values.filter((value) => value.trim().length === 0).length;
      return open === 0 ? null : `Nog ${open} ${plural(open, 'zin', 'zinnen')} te typen`;
    }
  }
}
