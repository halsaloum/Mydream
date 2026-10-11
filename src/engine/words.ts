import { z } from 'zod';
import { normalizeAnswer } from '@/content/cloze';
import type { Step, StepOf } from '@/content/schema';
import { containsWord } from '@/content/words/schema';
import { plural, taskOutcome, type Feedback, type Outcome } from './outcome';

/**
 * Engine voor de oefenvormen van de tab "Woorden" (zie `content/kinds-words.ts`).
 *
 * - Woordkaart: uitleg, altijd klaar.
 * - Raad eerst: rondt zichzelf af zodra je kiest, en telt niet mee (het is een poging vooraf).
 * - Ophalen en Denk na: je controleert zelf; fout = later in de ronde nog eens.
 * - Gebruik het: klaar als je jezelf beoordeeld hebt. Dat oordeel telt niet mee in de score,
 *   maar de woordenbank gebruikt het om te bepalen wanneer het woord terugkomt.
 */

export const RATINGS = [0, 1, 2] as const;
export type UseRating = (typeof RATINGS)[number];

export const WORD_RESPONSE_SCHEMAS = [
  z.object({ kind: z.literal('word'), said: z.boolean() }),
  z.object({ kind: z.literal('guess'), value: z.string().nullable() }),
  z.object({ kind: z.literal('recall'), value: z.string() }),
  z.object({ kind: z.literal('scene'), value: z.string().nullable() }),
  z.object({
    kind: z.literal('use'),
    value: z.string(),
    /** De leerling heeft de voorbeelden bekeken. */
    compared: z.boolean(),
    rating: z.union([z.literal(0), z.literal(1), z.literal(2)]).nullable(),
  }),
] as const;

export type WordResponse = z.infer<(typeof WORD_RESPONSE_SCHEMAS)[number]>;
export type WordKind = WordResponse['kind'];
export type WordResponseOf<K extends WordKind> = Extract<WordResponse, { kind: K }>;

const KINDS = new Set<string>(WORD_RESPONSE_SCHEMAS.map((schema) => schema.shape.kind.value));

export function isWordKind(kind: string): kind is WordKind {
  return KINDS.has(kind);
}

/* ------------------------------------------------------------------ ophalen */

/** Afstand in letters tussen twee woorden (Levenshtein). */
export function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j]!;
      row[j] = Math.min(above + 1, row[j - 1]! + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length]!;
}

/** Een getypt woord gelijkmaken: hoofdletters, spaties en een punt aan het eind tellen niet. */
const typed = (text: string) => normalizeAnswer(text, false);

export function recallCorrect(step: StepOf<'recall'>, value: string): boolean {
  const mine = typed(value);
  return mine.length > 0 && step.answers.some((answer) => typed(answer) === mine);
}

/** Bijna goed: één of twee letters verschil (bij korte woorden één). Telt wel als fout. */
export function recallNearMiss(step: StepOf<'recall'>, value: string): boolean {
  const mine = typed(value);
  if (!mine || recallCorrect(step, value)) return false;
  return step.answers.some((answer) => {
    const want = typed(answer);
    const allowed = want.length >= 8 ? 2 : 1;
    return editDistance(mine, want) <= allowed;
  });
}

/* ------------------------------------------------------------------ gebruiken */

export function writeStatus(step: StepOf<'use'>, text: string) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const targets = step.targets.map((target) => ({ word: target.word, found: containsWord(target, text) }));
  return { words, enoughWords: words >= step.minWords, targets, ready: words >= step.minWords && targets.every((target) => target.found) };
}

export const RATING_LABELS: Record<UseRating, { label: string; text: string }> = {
  2: { label: 'Klopt', text: 'Mijn tekst gebruikt het woord net zo precies als het voorbeeld.' },
  1: { label: 'Bijna', text: 'Het klopt bijna; de combinatie of de toon kan beter.' },
  0: { label: 'Nog niet', text: 'Ik gebruik het woord nog niet goed.' },
};

/* ------------------------------------------------------------------ engine */

export function wordInitialResponse(step: Step): WordResponse | null {
  switch (step.kind) {
    case 'word':
      return { kind: 'word', said: false };
    case 'guess':
      return { kind: 'guess', value: null };
    case 'recall':
      return { kind: 'recall', value: '' };
    case 'scene':
      return { kind: 'scene', value: null };
    case 'use':
      return { kind: 'use', value: '', compared: false, rating: null };
    default:
      return null;
  }
}

export function wordIsComplete(step: Step, r: WordResponse): boolean {
  switch (r.kind) {
    case 'word':
      return true;
    case 'guess':
    case 'scene':
      return r.value !== null;
    case 'recall':
      return r.value.trim().length > 0;
    case 'use':
      return step.kind === 'use' && r.rating !== null && writeStatus(step, r.value).ready;
  }
}

export function wordFits(step: Step, r: WordResponse): boolean {
  switch (r.kind) {
    case 'guess':
      return step.kind === 'guess' && (r.value === null || step.options.includes(r.value));
    case 'scene':
      return step.kind === 'scene' && (r.value === null || step.options.includes(r.value));
    default:
      return step.kind === r.kind;
  }
}

export function wordEvaluate(step: Step, r: WordResponse): Outcome {
  switch (r.kind) {
    case 'word':
    case 'guess':
    case 'use':
      return taskOutcome(null);
    case 'recall': {
      const correct = step.kind === 'recall' && recallCorrect(step, r.value);
      return { score: correct ? 1 : 0, correct, requeue: !correct, review: correct ? 'clear' : 'miss' };
    }
    case 'scene': {
      const correct = step.kind === 'scene' && r.value === step.answer;
      return { score: correct ? 1 : 0, correct, requeue: !correct, review: correct ? 'clear' : 'miss' };
    }
  }
}

export function wordFeedback(step: Step, r: WordResponse, outcome: Outcome): Feedback {
  if (step.kind === 'guess' && r.kind === 'guess') {
    const right = r.value === step.answer;
    return { title: right ? 'Goed afgeleid!' : 'Nu weet je het', body: `${step.word}: ${step.answer} ${step.why}`.trim() };
  }
  if (step.kind === 'recall' && r.kind === 'recall') {
    if (outcome.correct) return { title: 'Precies!', body: step.why };
    const answer = step.answers[0] ?? '';
    if (recallNearMiss(step, r.value)) return { title: 'Bijna: kijk naar de spelling', body: `Het is ‘${answer}’. ${step.why}` };
    return { title: 'Niet helemaal', body: `Het is ‘${answer}’. ${step.why}` };
  }
  if (step.kind === 'scene' && r.kind === 'scene') {
    return outcome.correct ? { title: 'Goed gedacht!', body: step.why } : { title: 'Niet helemaal', body: `Het is ‘${step.answer}’. ${step.why}` };
  }
  if (step.kind === 'use' && r.kind === 'use') {
    const n = step.targets.length;
    const words = plural(n, 'Het woord komt', 'De woorden komen');
    if (r.rating === 2) return { title: 'Mooi gebruikt', body: `${words} later terug in een nieuwe situatie.` };
    if (r.rating === 1) return { title: 'Bijna goed', body: `Lees het voorbeeld nog eens. ${words} snel terug.` };
    return { title: 'Goed dat je het ziet', body: `${words} morgen terug, zodat je het opnieuw kunt proberen.` };
  }
  return { title: 'Klaar' };
}

export function wordProgress(step: Step, r: WordResponse): string | null {
  switch (r.kind) {
    case 'guess':
      return 'Kies wat het woord volgens jou betekent';
    case 'use': {
      if (step.kind !== 'use') return null;
      const status = writeStatus(step, r.value);
      if (!status.ready) {
        const missing = status.targets.filter((target) => !target.found).length;
        if (missing > 0) return `Nog ${missing} ${plural(missing, 'woord', 'woorden')} te gebruiken`;
        return `Nog ${step.minWords - status.words} ${plural(step.minWords - status.words, 'woord', 'woorden')} te schrijven`;
      }
      return r.compared ? 'Beoordeel je eigen tekst' : 'Vergelijk je tekst met het voorbeeld';
    }
    default:
      return null;
  }
}
