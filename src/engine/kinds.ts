import { z } from 'zod';
import type { Step, StepKind, StepOf } from '@/content/schema';
import {
  ARGUMENT_RESPONSE_SCHEMAS,
  argumentEvaluate,
  argumentFeedback,
  argumentFits,
  argumentInitialResponse,
  argumentIsComplete,
  argumentProgress,
  isArgumentKind,
  type ArgumentResponse,
} from './argument';
import { plural, taskOutcome, taskScore, type Feedback, type Outcome } from './outcome';
import {
  isSpellingKind,
  normalizeQuotes,
  normalizeSpaces,
  SPELLING_RESPONSE_SCHEMAS,
  spellingEvaluate,
  spellingFeedback,
  spellingFits,
  spellingInitialResponse,
  spellingIsComplete,
  spellingProgress,
  wordDiff,
  type SpellingResponse,
} from './spelling';

export type { Feedback, Outcome } from './outcome';

/**
 * Engine voor de oefenvormen uit "Interactieve lessen – ideeën": antwoordtoestand,
 * voltooiing, score en afsluitende feedback. Puur en serialiseerbaar, zodat een oefening
 * na verversen precies terugkomt.
 *
 * Modi:
 * - teach:  uitleg; verder zodra alles gedaan is, geen score.
 * - graded: de leerling controleert zelf (knop); fout = later nog eens.
 * - task:   de oefening controleert zichzelf onderweg; klaar = automatisch afronden.
 *           Score = deel dat in één keer goed ging. Wordt niet opnieuw aangeboden,
 *           maar met fouten wel bewaard voor de herhaling.
 */
export type StepMode = 'teach' | 'graded' | 'task';

export const STEP_MODES: Record<StepKind, StepMode> = {
  explain: 'teach',
  learn: 'teach',
  choice: 'graded',
  combine: 'graded',
  type: 'graded',
  order: 'graded',
  paragraph: 'graded',
  sort: 'graded',
  fix: 'graded',
  rewrite: 'graded',
  write: 'graded',
  bet: 'graded',
  dictation: 'graded',
  swipe: 'task',
  morph: 'task',
  timeline: 'task',
  speed: 'task',
  train: 'task',
  highlight: 'task',
  conjunction: 'task',
  clamp: 'task',
  refs: 'task',
  ladder: 'task',
  ambiguity: 'task',
  chat: 'task',
  tone: 'task',
  intent: 'task',
  scale: 'task',
  stack: 'task',
  proofread: 'task',
  reason: 'task',
  support: 'task',
  evidence: 'task',
  rebut: 'task',
  strawman: 'task',
  slope: 'task',
  dilemma: 'task',
  inspect: 'task',
  cloze: 'graded',
  drill: 'task',
  passage: 'graded',
};

/** Ontdekvormen zonder goed of fout: ze tellen niet mee in "in één keer goed". */
const UNSCORED = new Set<StepKind>(['morph', 'timeline', 'train', 'clamp', 'evidence']);

export function stepMode(step: Step): StepMode {
  return STEP_MODES[step.kind];
}

export function isScored(step: Step): boolean {
  const mode = stepMode(step);
  return mode === 'graded' || (mode === 'task' && !UNSCORED.has(step.kind));
}

const index = z.int().nonnegative();
const count = z.int().nonnegative();

export const EXTRA_RESPONSE_SCHEMAS = [
  z.object({ kind: z.literal('swipe'), answers: z.array(z.boolean()) }),
  z.object({ kind: z.literal('morph'), combo: z.array(z.string()), found: z.array(z.string()) }),
  z.object({ kind: z.literal('timeline'), verb: index, stop: index, seen: z.array(index) }),
  z.object({
    kind: z.literal('speed'),
    answers: z.array(z.object({ item: index, ok: z.boolean() })),
    clock: z.boolean(),
    endsAt: z.number().nullable(),
    finished: z.boolean(),
  }),
  z.object({ kind: z.literal('train'), front: z.string().nullable(), seen: z.array(z.string()) }),
  z.object({ kind: z.literal('highlight'), pen: z.string(), painted: z.array(index), mistakes: count }),
  z.object({ kind: z.literal('conjunction'), current: index, placed: z.array(index), mistakes: count }),
  z.object({ kind: z.literal('clamp'), pos: z.record(z.string(), z.enum(['front', 'mid', 'after'])) }),
  z.object({ kind: z.literal('refs'), linked: count, mistakes: count }),
  z.object({ kind: z.literal('ladder'), placed: count, mistakes: count }),
  z.object({ kind: z.literal('ambiguity'), selected: z.string().nullable(), solved: z.record(z.string(), index), mistakes: count }),
  z.object({ kind: z.literal('chat'), picks: z.array(index) }),
  z.object({ kind: z.literal('tone'), level: index, sent: z.array(index) }),
  z.object({ kind: z.literal('intent'), round: index, done: z.array(index), mistakes: count }),
  z.object({ kind: z.literal('scale'), on: z.array(z.string()), mistakes: count }),
  z.object({ kind: z.literal('stack'), placed: count, mistakes: count }),
  z.object({
    kind: z.literal('proofread'),
    found: z.array(index),
    slips: count,
    /** Zonder hulp ("blind"): de leerling heeft gezegd dat hij klaar is. */
    finished: z.boolean().optional(),
  }),
  z.object({ kind: z.literal('bet'), value: z.string().nullable(), bet: z.union([z.literal(1), z.literal(2), z.literal(3)]).nullable() }),
  z.object({ kind: z.literal('dictation'), value: z.string(), plays: count, shown: z.boolean() }),
  ...ARGUMENT_RESPONSE_SCHEMAS,
  ...SPELLING_RESPONSE_SCHEMAS,
] as const;

export type ExtraResponse = z.infer<(typeof EXTRA_RESPONSE_SCHEMAS)[number]>;
export type ExtraKind = ExtraResponse['kind'];
export type ExtraResponseOf<K extends ExtraKind> = Extract<ExtraResponse, { kind: K }>;

const isArgument = (r: ExtraResponse): r is ArgumentResponse => isArgumentKind(r.kind);
const isSpelling = (r: ExtraResponse): r is SpellingResponse => isSpellingKind(r.kind);

const EXTRA_KINDS = new Set<string>(EXTRA_RESPONSE_SCHEMAS.map((schema) => schema.shape.kind.value));

export function isExtraKind(kind: string): kind is ExtraKind {
  return EXTRA_KINDS.has(kind);
}

/* ---------------------------------------------------------------- hulpfuncties */

export const morphKey = (combo: readonly string[]) => combo.join('|');

export function morphWord(step: StepOf<'morph'>, combo: readonly string[]) {
  return step.words.find((word) => morphKey(word.combo) === morphKey(combo));
}

/** Woorden in de tang bij een bepaalde plaatsing. */
export function clampCount(step: StepOf<'clamp'>, pos: Record<string, 'front' | 'mid' | 'after'>): number {
  const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const frontTaken = step.parts.some((part) => pos[part.id] === 'front');
  let total = frontTaken ? words(step.subject) : 0;
  for (const item of step.middle) {
    if ('text' in item) total += words(item.text);
    else if ((pos[item.part] ?? 'mid') === 'mid') total += words(step.parts.find((part) => part.id === item.part)?.t ?? '');
  }
  return total;
}

export function scaleSum(step: StepOf<'scale'>, on: readonly string[]): number {
  return on.reduce((sum, id) => sum + (step.args.find((arg) => arg.id === id)?.w ?? 0), 0);
}

export function proofreadErrors(step: StepOf<'proofread'>): number[] {
  return step.tokens.flatMap((token, i) => ('fix' in token ? [i] : []));
}

export function highlightTargets(step: StepOf<'highlight'>): number[] {
  return step.words.flatMap((word, i) => (word.role ? [i] : []));
}

export { normalizeSpaces } from './spelling';

/** Per woord van de dicteezin: goed of niet, en wat de leerling op die plek typte. */
export function dictationDiff(sentence: string, typed: string) {
  return wordDiff(sentence, typed).marks;
}

type ProofreadError = Extract<StepOf<'proofread'>['tokens'][number], { fix: string }>;

/**
 * Het woord zonder de leestekens eromheen: punt, komma enz. aan het eind, haakjes en dubbele
 * aanhalingstekens aan beide kanten, en enkele aanhalingstekens alleen als paar (‘zo’). Een
 * apostrof die bij het woord hoort (’s, Max’) blijft staan.
 */
function stripPunctuation(text: string): string {
  let rest = text;
  for (;;) {
    const next = rest
      .replace(/[.,!?;:]+$/, '')
      .replace(/^[("]+/, '')
      .replace(/[)"]+$/, '')
      .replace(/^'(.+)'$/, '$1');
    if (next === rest) return rest;
    rest = next;
  }
}

const proofreadNorm = (text: string) => normalizeQuotes(normalizeSpaces(text));

/**
 * Is de getypte verbetering goed? Spaties en gekrulde aanhalingstekens tellen niet. Leestekens om
 * het woord heen tellen alleen als daar de fout zat. Hoofdletters tellen altijd: de leerling typt
 * het woord zoals het in de tekst moet komen.
 */
export function proofreadAccepts(token: ProofreadError, typed: string): boolean {
  const mine = proofreadNorm(typed);
  const original = proofreadNorm(token.t);
  const fixes = [token.fix, ...(token.also ?? [])].map(proofreadNorm);
  return fixes.some((fix) => {
    if (fix === mine) return true;
    const punctuationCounts = stripPunctuation(fix) === stripPunctuation(original);
    return !punctuationCounts && stripPunctuation(mine) === stripPunctuation(fix);
  });
}

/** Typte de leerling het woord gewoon over (eventueel zonder de leestekens eromheen)? Dan liet hij het staan. */
export function proofreadUnchanged(token: StepOf<'proofread'>['tokens'][number], typed: string): boolean {
  const mine = proofreadNorm(typed);
  const original = proofreadNorm(token.t);
  return mine === original || stripPunctuation(mine) === stripPunctuation(original);
}

/** Punten in het snelrondje: 10 per goed antwoord, 20 vanaf de derde op rij. */
export function speedScore(answers: readonly { ok: boolean }[]) {
  let combo = 0;
  let best = 0;
  let points = 0;
  for (const answer of answers) {
    combo = answer.ok ? combo + 1 : 0;
    best = Math.max(best, combo);
    points += answer.ok ? (combo >= 3 ? 20 : 10) : 0;
  }
  return { points, combo, best, correct: answers.filter((answer) => answer.ok).length };
}

/* ---------------------------------------------------------------- engine */

export function extraInitialResponse(step: Step): ExtraResponse | null {
  switch (step.kind) {
    case 'swipe':
      return { kind: 'swipe', answers: [] };
    case 'morph': {
      const combo = step.slots.map(() => '');
      return { kind: 'morph', combo, found: morphWord(step, combo) ? [morphKey(combo)] : [] };
    }
    case 'timeline':
      return { kind: 'timeline', verb: 0, stop: 0, seen: [0] };
    case 'speed':
      return { kind: 'speed', answers: [], clock: true, endsAt: null, finished: false };
    case 'train':
      return { kind: 'train', front: null, seen: [] };
    case 'highlight':
      return { kind: 'highlight', pen: step.pens[0]?.id ?? '', painted: [], mistakes: 0 };
    case 'conjunction':
      return { kind: 'conjunction', current: 0, placed: [], mistakes: 0 };
    case 'clamp':
      return { kind: 'clamp', pos: Object.fromEntries(step.parts.map((part) => [part.id, 'mid' as const])) };
    case 'refs':
      return { kind: 'refs', linked: 0, mistakes: 0 };
    case 'ladder':
      return { kind: 'ladder', placed: 0, mistakes: 0 };
    case 'ambiguity':
      return { kind: 'ambiguity', selected: step.meanings[0]?.id ?? null, solved: {}, mistakes: 0 };
    case 'chat':
      return { kind: 'chat', picks: [] };
    case 'tone':
      return { kind: 'tone', level: step.start ?? 0, sent: [] };
    case 'intent':
      return { kind: 'intent', round: 0, done: [], mistakes: 0 };
    case 'scale':
      return { kind: 'scale', on: [], mistakes: 0 };
    case 'stack':
      return { kind: 'stack', placed: 0, mistakes: 0 };
    case 'proofread':
      return { kind: 'proofread', found: [], slips: 0 };
    case 'bet':
      return { kind: 'bet', value: null, bet: null };
    case 'dictation':
      return { kind: 'dictation', value: '', plays: 0, shown: false };
    default:
      return spellingInitialResponse(step) ?? argumentInitialResponse(step);
  }
}

export function extraIsComplete(step: Step, r: ExtraResponse): boolean {
  if (step.kind !== r.kind) return false;
  if (isArgument(r)) return argumentIsComplete(step, r);
  if (isSpelling(r)) return spellingIsComplete(step, r);
  switch (r.kind) {
    case 'swipe':
      return step.kind === 'swipe' && r.answers.length >= step.cards.length;
    case 'morph':
      return step.kind === 'morph' && r.found.length >= step.goal;
    case 'timeline':
      return step.kind === 'timeline' && step.stops.every((_, i) => r.seen.includes(i));
    case 'speed':
      return r.finished;
    case 'train':
      return step.kind === 'train' && step.fronts.every((front) => r.seen.includes(front.block));
    case 'highlight':
      return step.kind === 'highlight' && highlightTargets(step).every((i) => r.painted.includes(i));
    case 'conjunction':
      return step.kind === 'conjunction' && r.placed.length >= step.items.length;
    case 'clamp':
      return step.kind === 'clamp' && clampCount(step, r.pos) <= step.goal;
    case 'refs':
      return step.kind === 'refs' && r.linked >= step.refs.length;
    case 'ladder':
      return step.kind === 'ladder' && r.placed >= step.steps.length;
    case 'ambiguity':
      return step.kind === 'ambiguity' && step.meanings.every((meaning) => r.solved[meaning.id] !== undefined);
    case 'chat':
      return step.kind === 'chat' && r.picks.length >= step.rounds.length;
    case 'tone':
      return step.kind === 'tone' && r.sent.some((level) => step.levels[level]?.ok);
    case 'intent':
      return step.kind === 'intent' && r.done.length >= step.rounds.length;
    case 'scale':
      return step.kind === 'scale' && scaleSum(step, r.on) > step.doubt;
    case 'stack':
      return step.kind === 'stack' && r.placed >= step.layers.length;
    case 'proofread':
      if (step.kind !== 'proofread') return false;
      return step.blind ? r.finished === true : proofreadErrors(step).every((i) => r.found.includes(i));
    case 'bet':
      return r.value !== null && r.bet !== null;
    case 'dictation':
      return r.value.trim().length > 0;
  }
}

/** Past een opgeslagen antwoord nog bij de (mogelijk gewijzigde) stap? */
export function extraFits(step: Step, r: ExtraResponse): boolean {
  if (step.kind !== r.kind) return false;
  if (isArgument(r)) return argumentFits(step, r);
  if (isSpelling(r)) return spellingFits(step, r);
  switch (r.kind) {
    case 'swipe':
      return step.kind === 'swipe' && r.answers.length <= step.cards.length;
    case 'morph':
      return step.kind === 'morph' && r.combo.length === step.slots.length;
    case 'timeline':
      return step.kind === 'timeline' && r.verb < step.verbs.length && r.stop < step.stops.length;
    case 'speed':
      return step.kind === 'speed' && r.answers.every((answer) => answer.item < step.items.length);
    case 'highlight':
      return step.kind === 'highlight' && r.painted.every((i) => i < step.words.length);
    case 'conjunction':
      return step.kind === 'conjunction' && r.current < step.items.length;
    case 'refs':
      return step.kind === 'refs' && r.linked <= step.refs.length;
    case 'ladder':
      return step.kind === 'ladder' && r.placed <= step.steps.length;
    case 'chat':
      return step.kind === 'chat' && r.picks.length <= step.rounds.length;
    case 'tone':
      return step.kind === 'tone' && r.level < step.levels.length;
    case 'intent':
      return step.kind === 'intent' && r.round < step.rounds.length;
    case 'stack':
      return step.kind === 'stack' && r.placed <= step.layers.length;
    case 'proofread':
      return (
        step.kind === 'proofread' &&
        r.found.every((i) => {
          const token = step.tokens[i];
          return token !== undefined && 'fix' in token;
        })
      );
    case 'bet':
      return step.kind === 'bet' && (r.value === null || step.options.includes(r.value));
    default:
      return true;
  }
}

export function extraEvaluate(step: Step, r: ExtraResponse): Outcome {
  if (step.kind !== r.kind) return { score: 0, correct: false, requeue: true, review: 'miss' };
  if (isArgument(r)) return argumentEvaluate(step, r);
  if (isSpelling(r)) return spellingEvaluate(step, r);
  switch (r.kind) {
    case 'swipe': {
      if (step.kind !== 'swipe') break;
      const right = r.answers.filter((answer, i) => answer === step.cards[i]?.ok).length;
      return taskOutcome(right / step.cards.length);
    }
    case 'speed': {
      const { correct } = speedScore(r.answers);
      return taskOutcome(r.answers.length ? correct / r.answers.length : 0);
    }
    case 'chat': {
      if (step.kind !== 'chat') break;
      const first = r.picks.filter((pick, i) => pick === step.rounds[i]?.right).length;
      return taskOutcome(first / step.rounds.length);
    }
    case 'highlight':
      return step.kind === 'highlight' ? taskOutcome(taskScore(highlightTargets(step).length, r.mistakes)) : taskOutcome(0);
    case 'conjunction':
      return step.kind === 'conjunction' ? taskOutcome(taskScore(step.items.length, r.mistakes)) : taskOutcome(0);
    case 'refs':
      return step.kind === 'refs' ? taskOutcome(taskScore(step.refs.length, r.mistakes)) : taskOutcome(0);
    case 'ladder':
      return step.kind === 'ladder' ? taskOutcome(taskScore(step.steps.length, r.mistakes)) : taskOutcome(0);
    case 'ambiguity':
      return step.kind === 'ambiguity' ? taskOutcome(taskScore(step.meanings.length, r.mistakes)) : taskOutcome(0);
    case 'intent':
      return step.kind === 'intent' ? taskOutcome(taskScore(step.rounds.length, r.mistakes)) : taskOutcome(0);
    case 'stack':
      return step.kind === 'stack' ? taskOutcome(taskScore(step.layers.length, r.mistakes)) : taskOutcome(0);
    case 'proofread': {
      if (step.kind !== 'proofread') return taskOutcome(0);
      const errors = proofreadErrors(step).length;
      // Zonder hulp telt een gemiste fout ook: gevonden ÷ (fouten + mis getikt).
      return taskOutcome(step.blind ? r.found.length / (errors + r.slips) : taskScore(errors, r.slips));
    }
    case 'tone': {
      if (step.kind !== 'tone') break;
      const misses = r.sent.filter((level) => !step.levels[level]?.ok).length;
      return taskOutcome(taskScore(1, misses));
    }
    case 'scale':
      return taskOutcome(taskScore(1, r.mistakes));
    case 'morph':
    case 'timeline':
    case 'train':
    case 'clamp':
      return taskOutcome(null);
    case 'bet': {
      if (step.kind !== 'bet') break;
      const correct = r.value === step.answer;
      // Goed maar getwijfeld: komt nog eens terug om vast te zetten.
      const review = !correct || r.bet === 1 ? 'miss' : 'clear';
      return { score: correct ? 1 : 0, correct, requeue: !correct, review };
    }
    case 'dictation': {
      if (step.kind !== 'dictation') break;
      const correct = normalizeSpaces(normalizeQuotes(r.value)) === normalizeSpaces(normalizeQuotes(step.sentence));
      return { score: correct ? 1 : 0, correct, requeue: !correct, review: correct ? 'clear' : 'miss' };
    }
  }
  return { score: 0, correct: false, requeue: false, review: 'miss' };
}


/** Afsluitende feedback voor de voettekst. Teksten uit de inhoud gaan voor. */
export function extraFeedback(step: Step, r: ExtraResponse, outcome: Outcome): Feedback {
  if (isArgument(r)) return argumentFeedback(step, r, outcome);
  if (isSpelling(r)) return spellingFeedback(step, r, outcome);
  const done = 'done' in step && step.done ? { title: step.done.title, body: step.done.text } : null;
  switch (r.kind) {
    case 'swipe': {
      if (step.kind !== 'swipe') break;
      const right = Math.round((outcome.score ?? 0) * step.cards.length);
      return done ?? { title: 'Mooi zo!', body: `Je hebt ${right} van de ${step.cards.length} zinnen goed beoordeeld.` };
    }
    case 'speed': {
      if (step.kind !== 'speed') break;
      const { points, best, correct } = speedScore(r.answers);
      if (done) return done;
      return r.clock
        ? { title: 'Lekker tempo!', body: `${points} punten in ${step.seconds} seconden. Beste reeks: ${best} op rij.` }
        : { title: 'Rondje klaar', body: `${correct} van de ${r.answers.length} goed. Beste reeks: ${best} op rij.` };
    }
    case 'chat': {
      if (step.kind !== 'chat') break;
      const first = Math.round((outcome.score ?? 0) * step.rounds.length);
      return done ?? { title: 'Bericht verstuurd', body: `${first} van ${step.rounds.length} in één keer goed.` };
    }
    case 'proofread': {
      if (step.kind !== 'proofread') break;
      const n = proofreadErrors(step).length;
      const slips = r.slips === 0 ? 'zonder één keer mis te tikken' : `met ${r.slips} keer mis`;
      const missed = n - r.found.length;
      if (step.blind && missed > 0) {
        return {
          title: `${missed} ${plural(missed, 'fout', 'fouten')} over het hoofd gezien`,
          body: `${r.found.length} van de ${n} fouten verbeterd, ${slips}. De gemiste ${plural(missed, 'fout staat', 'fouten staan')} nu rood in de tekst.`,
        };
      }
      return { title: done?.title ?? 'Deze tekst kan weg', body: `${n} ${plural(n, 'fout', 'fouten')} eruit, ${slips}.` };
    }
    case 'bet': {
      if (step.kind !== 'bet') break;
      const bet = r.bet ?? 1;
      return outcome.correct ? { title: `Precies! +${bet}`, body: step.why } : { title: `Niet helemaal · −${bet}`, body: step.why };
    }
    case 'dictation': {
      if (step.kind !== 'dictation') break;
      return outcome.correct ? { title: 'Precies!', body: step.right } : { title: 'Niet helemaal', body: step.wrong };
    }
    default:
      break;
  }
  return done ?? { title: outcome.correct ? 'Klaar!' : 'Klaar', body: undefined };
}

/** Voortgangstekst in de voettekst terwijl de leerling bezig is (teksten uit de mock-ups). */
export function extraProgress(step: Step, r: ExtraResponse): string | null {
  if (isArgument(r)) return argumentProgress(step, r);
  if (isSpelling(r)) return spellingProgress(step, r);
  const nog = (n: number, one: string, many: string) => `Nog ${n} ${n === 1 ? one : many}`;
  switch (r.kind) {
    case 'swipe':
      return step.kind === 'swipe' ? (step.cards.length - r.answers.length === 1 ? 'Nog 1 kaart in de stapel' : `Nog ${step.cards.length - r.answers.length} kaarten in de stapel`) : null;
    case 'morph': {
      if (step.kind !== 'morph') return null;
      const left = Math.max(0, step.goal - r.found.length);
      return left === 1 ? 'Vind nog 1 echt woord' : `Vind nog ${left} echte woorden`;
    }
    case 'timeline':
      return step.kind === 'timeline' ? `${step.stops.filter((_, i) => r.seen.includes(i)).length} van ${step.stops.length} tijden bezocht` : null;
    case 'speed':
      return r.clock ? 'Fouten kosten hier niets' : 'Zonder klok: neem de tijd';
    case 'train':
      return step.kind === 'train' ? nog(step.fronts.filter((front) => !r.seen.includes(front.block)).length, 'zin te bouwen', 'zinnen te bouwen') : null;
    case 'highlight':
      return step.kind === 'highlight' ? `${r.painted.length} van ${highlightTargets(step).length} woorden gekleurd` : null;
    case 'conjunction':
      return step.kind === 'conjunction' ? nog(step.items.length - r.placed.length, 'voegwoord te proberen', 'voegwoorden te proberen') : null;
    case 'clamp': {
      if (step.kind !== 'clamp') return null;
      const over = clampCount(step, r.pos) - step.goal;
      return over > 0 ? nog(over, 'woord te veel in de tang', 'woorden te veel in de tang') : null;
    }
    case 'refs':
      return step.kind === 'refs' ? nog(step.refs.length - r.linked, 'draad te spannen', 'draden te spannen') : null;
    case 'ladder':
      return step.kind === 'ladder' ? nog(step.steps.length - r.placed, 'woord te plaatsen', 'woorden te plaatsen') : null;
    case 'ambiguity':
      return step.kind === 'ambiguity' ? nog(step.meanings.filter((m) => r.solved[m.id] === undefined).length, 'plaatje te koppelen', 'plaatjes te koppelen') : null;
    case 'chat':
      return step.kind === 'chat' ? `Bericht ${Math.min(r.picks.length + 1, step.rounds.length)} van ${step.rounds.length}` : null;
    case 'tone':
      return r.sent.length ? 'Verschuif de toon en verstuur opnieuw' : 'Past deze toon bij je lezer?';
    case 'intent':
      return step.kind === 'intent' ? `Situatie ${Math.min(r.round + 1, step.rounds.length)} van ${step.rounds.length}` : null;
    case 'scale':
      return step.kind === 'scale' ? `${r.on.length} van ${step.max} argumenten op de schaal` : null;
    case 'stack':
      return step.kind === 'stack' ? nog(step.layers.length - r.placed, 'zin te plaatsen', 'zinnen te plaatsen') : null;
    case 'proofread':
      if (step.kind !== 'proofread') return null;
      if (step.blind) return r.found.length === 0 ? 'Tik een fout woord aan en verbeter het' : `${r.found.length} verbeterd. Klaar? Tik op ‘Ik ben klaar’.`;
      return nog(proofreadErrors(step).length - r.found.length, 'fout te vinden', 'fouten te vinden');
    case 'bet':
      return r.value === null ? 'Kies een antwoord' : r.bet === null ? 'Hoe zeker ben je?' : 'Zet in om te controleren';
    case 'dictation':
      return r.plays === 0 && !r.shown ? 'Luister eerst, typ daarna' : 'Enter om te controleren';
  }
}

/** Wat de inzet betekent voor de herhaling (Durf je?). */
export function betConsequence(correct: boolean, bet: 1 | 2 | 3): string {
  if (correct) {
    if (bet === 3) return 'Heel zeker en goed: dit beheers je. Deze vraag hoeft niet snel terug te komen.';
    if (bet === 2) return 'Goed ingeschat. Nog één keer en hij zit vast.';
    return 'Goed, maar je twijfelde. Deze vraag komt nog een keer terug om hem vast te zetten.';
  }
  if (bet === 3) return 'Je was heel zeker, maar het is fout. Deze regel krijgt extra herhaling.';
  if (bet === 2) return 'Fout. Deze vraag komt terug in je Herhaalstapel.';
  return 'Fout, maar je wist dat je twijfelde. Dat is ook kennis.';
}
