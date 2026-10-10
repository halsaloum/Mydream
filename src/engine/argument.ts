import { z } from 'zod';
import type { Step, StepOf } from '@/content/schema';
import { plural, taskOutcome, taskScore, type Feedback, type Outcome } from './outcome';

/**
 * Engine voor de argumentatievormen ("Overtuigen in één alinea" en "Drogredenen herkennen").
 *
 * Alle vormen zijn zelfcontrolerend (task): de leerling krijgt bij elke handeling direct een
 * reactie, en de oefening rondt zichzelf af. Fouten tellen in de score en zetten de opdracht
 * op de herhaalstapel. De spelregels en vaste teksten staan hier, als pure functies: de
 * componenten tonen alleen wat deze functies teruggeven.
 */

const index = z.int().nonnegative();
const count = z.int().nonnegative();
const Word = z.enum(['want', 'dus']);

export const ARGUMENT_RESPONSE_SCHEMAS = [
  z.object({ kind: z.literal('reason'), pair: index, top: z.enum(['claim', 'reason']), word: Word, found: z.array(Word), mistakes: count }),
  z.object({ kind: z.literal('support'), level: index, tried: z.array(index), mistakes: count }),
  z.object({ kind: z.literal('evidence'), sel: index, pick: z.array(index) }),
  z.object({ kind: z.literal('rebut'), round: index, tried: z.array(index), mistakes: count }),
  z.object({ kind: z.literal('strawman'), found: z.array(z.string()), tried: z.array(index), fair: z.boolean(), mistakes: count }),
  z.object({ kind: z.literal('slope'), judged: count, tried: z.array(index), honest: z.boolean(), mistakes: count }),
  z.object({
    kind: z.literal('dilemma'),
    added: z.array(index),
    tried: z.array(index),
    triedOptions: z.array(index),
    honest: z.boolean(),
    mistakes: count,
  }),
  z.object({ kind: z.literal('inspect'), sel: index.nullable(), judged: z.array(index), fixed: z.array(index), tried: z.array(z.string()), mistakes: count }),
] as const;

export type ArgumentResponse = z.infer<(typeof ARGUMENT_RESPONSE_SCHEMAS)[number]>;
export type ArgumentKind = ArgumentResponse['kind'];
export type ArgumentResponseOf<K extends ArgumentKind> = Extract<ArgumentResponse, { kind: K }>;

const KINDS = new Set<string>(ARGUMENT_RESPONSE_SCHEMAS.map((schema) => schema.shape.kind.value));

export function isArgumentKind(kind: string): kind is ArgumentKind {
  return KINDS.has(kind);
}

/** Korte reactie in de oefening op één handeling. */
export type Note = { tone: 'right' | 'wrong' | 'info'; text: string };
/** Het gevolg van een handeling: het nieuwe antwoord, en eventueel een reactie. */
export type Move<R> = { response: R; note: Note | null };

const stay = <R>(response: R): Move<R> => ({ response, note: null });
const wrong = (text: string): Note => ({ tone: 'wrong', text });
const right = (text: string): Note => ({ tone: 'right', text });

/* ------------------------------------------------------------------ want of dus */

export type ReasonWord = 'want' | 'dus';
export type ReasonPart = 'claim' | 'reason';
type ReasonStep = StepOf<'reason'>;
type ReasonResponse = ArgumentResponseOf<'reason'>;

export const REASON_IDLE = 'Lees de twee zinnen achter elkaar. Klopt het zo?';
export const otherWord = (word: ReasonWord): ReasonWord => (word === 'want' ? 'dus' : 'want');

/** Logisch is: standpunt voorop met "want", of argument voorop met "dus". */
export const reasonLogical = (top: ReasonPart, word: ReasonWord) => (top === 'claim') === (word === 'want');

/** De twee zinnen zoals ze nu staan, met hun rol. */
export function reasonLines(step: ReasonStep, r: ReasonResponse) {
  const pair = step.pairs[r.pair]!;
  const bottom: ReasonPart = r.top === 'claim' ? 'reason' : 'claim';
  return {
    top: { role: r.top, text: `${pair[r.top].lead},` },
    bottom: { role: bottom, text: `${pair[bottom].mid}.` },
  };
}

/** Een goede versie als stukken; het standpunt is gemarkeerd, het signaalwoord vet. */
export function reasonWay(step: ReasonStep, pairIndex: number, word: ReasonWord): { t: string; claim?: boolean; signal?: boolean }[] {
  const pair = step.pairs[pairIndex]!;
  return word === 'want'
    ? [{ t: pair.claim.lead, claim: true }, { t: ', ' }, { t: 'want', signal: true }, { t: ` ${pair.reason.mid}.` }]
    : [{ t: `${pair.reason.lead}, ` }, { t: 'dus', signal: true }, { t: ' ' }, { t: pair.claim.mid, claim: true }, { t: '.' }];
}

export const reasonPairDone = (r: ReasonResponse) => r.found.includes('want') && r.found.includes('dus');

export function reasonCheck(step: ReasonStep, r: ReasonResponse): Move<ReasonResponse> {
  const pair = step.pairs[r.pair];
  if (!pair || reasonPairDone(r)) return stay(r);
  const other = otherWord(r.word);
  if (!reasonLogical(r.top, r.word)) return { response: { ...r, mistakes: r.mistakes + 1 }, note: wrong(pair.bad) };
  if (r.found.includes(r.word)) return { response: r, note: { tone: 'info', text: `Die had je al. Lukt het ook met ${other}? Wissel dan ook de zinnen.` } };
  const found = [...r.found, r.word];
  const text = r.word === 'want' ? 'Klopt. Na want komt het argument: de reden.' : 'Klopt. Na dus komt het standpunt: de conclusie.';
  const tail = found.length >= 2 ? ' Nu heb je ze allebei.' : ` Lukt het ook met ${other}?`;
  return { response: { ...r, found }, note: right(text + tail) };
}

export function reasonNextPair(step: ReasonStep, r: ReasonResponse): ReasonResponse {
  const pair = step.pairs[r.pair + 1];
  if (!pair || !reasonPairDone(r)) return r;
  return { ...r, pair: r.pair + 1, top: pair.start.top, word: pair.start.word, found: [] };
}

/* ------------------------------------------------------------------ onderbouwen */

type SupportStep = StepOf<'support'>;
type SupportResponse = ArgumentResponseOf<'support'>;
export type SupportBlock = { role: 'standpunt' | 'argument' | 'uitleg' | 'voorbeeld' | 'feit'; t: string };

/** De stapel tot nu toe: het standpunt en per beantwoorde vraag het goede antwoord. */
export function supportBlocks(step: SupportStep, level: number): SupportBlock[] {
  const blocks: SupportBlock[] = [{ role: 'standpunt', t: step.claim }];
  step.levels.slice(0, level).forEach((item) => {
    const answer = item.options.find((option) => option.ok === true);
    if (answer && answer.ok === true) blocks.push({ role: answer.role, t: answer.text });
  });
  return blocks;
}

export function supportPick(step: SupportStep, r: SupportResponse, i: number): Move<SupportResponse> {
  const option = step.levels[r.level]?.options[i];
  if (!option || r.tried.includes(i)) return stay(r);
  if (option.ok === true) return { response: { ...r, level: r.level + 1, tried: [] }, note: right(option.why) };
  return { response: { ...r, tried: [...r.tried, i], mistakes: r.mistakes + 1 }, note: wrong(option.why) };
}

/* ------------------------------------------------------------------ bewijsbalk */

type EvidenceStep = StepOf<'evidence'>;
type EvidenceRow = EvidenceStep['rows'][number];
type EvidenceResponse = ArgumentResponseOf<'evidence'>;
export type EvidenceStatus = 'past' | 'stellig' | 'voorzichtig';

export function evidenceStatus(row: EvidenceRow, k: number): EvidenceStatus {
  if (k === row.best) return 'past';
  return (row.options[k]?.need ?? 0) > row.known ? 'stellig' : 'voorzichtig';
}

/** De balk in procenten: wat je weet, wat je zin belooft, en het gat ertussen. */
export function evidenceBar(row: EvidenceRow, k: number) {
  const known = (row.known / row.total) * 100;
  const promise = ((row.options[k]?.need ?? 0) / row.total) * 100;
  return { known, promise, from: Math.min(known, promise), to: Math.max(known, promise) };
}

export const evidenceFitting = (step: EvidenceStep, r: EvidenceResponse) => step.rows.filter((row, i) => evidenceStatus(row, r.pick[i] ?? row.start) === 'past').length;

export function evidenceChoose(r: EvidenceResponse, k: number): EvidenceResponse {
  const pick = [...r.pick];
  pick[r.sel] = k;
  return { ...r, pick };
}

/* ------------------------------------------------------------------ ja, maar */

type RebutStep = StepOf<'rebut'>;
type RebutResponse = ArgumentResponseOf<'rebut'>;
export type RebutPiece = { t: string; part: 'base' | 'concede' | 'rebut'; round?: number };

export function rebutPick(step: RebutStep, r: RebutResponse, i: number): Move<RebutResponse> {
  const option = step.rounds[r.round]?.options[i];
  if (!option || r.tried.includes(i)) return stay(r);
  if (option.ok === true) return { response: { ...r, round: r.round + 1, tried: [] }, note: right(option.why) };
  return { response: { ...r, tried: [...r.tried, i], mistakes: r.mistakes + 1 }, note: wrong(option.why) };
}

/** De alinea tot nu toe: het voorstel, en per weerlegd bezwaar wat je toegeeft en weerlegt. */
export function rebutParagraph(step: RebutStep, round: number): RebutPiece[] {
  const pieces: RebutPiece[] = [{ t: step.base, part: 'base' }];
  step.rounds.slice(0, round).forEach((item, k) => {
    const answer = item.options.find((option) => option.ok === true);
    if (!answer || answer.ok !== true) return;
    pieces.push({ t: answer.concede, part: 'concede', round: k }, { t: answer.rebut, part: 'rebut', round: k });
  });
  return pieces;
}

export const DOUBT_MAX = 5;

/** Twijfel van de lezer: zakt per weerlegd bezwaar, stijgt (rood) bij een zwak antwoord. */
export function rebutDoubt(step: RebutStep, r: RebutResponse) {
  const solved = Math.min(r.round, step.rounds.length);
  const added = Math.min(r.tried.length, 2);
  const value = Math.max(0, Math.min(DOUBT_MAX, step.rounds.length + 1 - solved + added));
  return { value, added: Math.min(added, value), max: DOUBT_MAX };
}

/* ------------------------------------------------------------------ stroman */

type StrawmanStep = StepOf<'strawman'>;
type StrawmanResponse = ArgumentResponseOf<'strawman'>;

export const strawmanTwists = (step: StrawmanStep) => step.response.chunks.flatMap((chunk) => (chunk.twist ? [chunk.twist] : []));
export const strawmanAllFound = (step: StrawmanStep, r: StrawmanResponse) => strawmanTwists(step).every((id) => r.found.includes(id));

export function strawmanTap(step: StrawmanStep, r: StrawmanResponse, i: number): Move<StrawmanResponse> {
  const chunk = step.response.chunks[i];
  if (!chunk || strawmanAllFound(step, r)) return stay(r);
  if (chunk.twist) {
    if (r.found.includes(chunk.twist)) return stay(r);
    return { response: { ...r, found: [...r.found, chunk.twist] }, note: right(chunk.why) };
  }
  return { response: { ...r, mistakes: r.mistakes + 1 }, note: wrong(chunk.why) };
}

export function strawmanPick(step: StrawmanStep, r: StrawmanResponse, i: number): Move<StrawmanResponse> {
  const option = step.options[i];
  if (!option || r.fair || r.tried.includes(i) || !strawmanAllFound(step, r)) return stay(r);
  if (option.ok === true) return { response: { ...r, fair: true }, note: right(option.why) };
  return { response: { ...r, tried: [...r.tried, i], mistakes: r.mistakes + 1 }, note: wrong(option.why) };
}

/* ------------------------------------------------------------------ hellend vlak */

type SlopeStep = StepOf<'slope'>;
type SlopeResponse = ArgumentResponseOf<'slope'>;

export function slopeJudge(step: SlopeStep, r: SlopeResponse, holds: boolean): Move<SlopeResponse> {
  const link = step.links[r.judged];
  if (!link) return stay(r);
  if (holds !== link.holds) return { response: { ...r, mistakes: r.mistakes + 1 }, note: wrong(link.hint) };
  const judged = r.judged + 1;
  const text =
    judged === step.links.length
      ? step.summary
      : link.holds
        ? 'Klopt, deze stap volgt.'
        : 'Goed gezien. Stel dat het toch gebeurt: volgt de volgende stap dan vanzelf?';
  return { response: { ...r, judged }, note: right(text) };
}

export function slopePick(step: SlopeStep, r: SlopeResponse, i: number): Move<SlopeResponse> {
  const option = step.options[i];
  if (!option || r.honest || r.tried.includes(i) || r.judged < step.links.length) return stay(r);
  if (option.ok === true) return { response: { ...r, honest: true }, note: right(option.why) };
  return { response: { ...r, tried: [...r.tried, i], mistakes: r.mistakes + 1 }, note: wrong(option.why) };
}

/**
 * Waar ligt de bal? De echte bal rolt zolang de schakels houden; de stippelbal rolt door tot
 * waar de leerling heeft geoordeeld, als je telkens "stel dat" zegt.
 */
export function slopeBalls(step: SlopeStep, judged: number): { real: number; ghost: number | null } {
  let real = 0;
  let ghost: number | null = null;
  let stopped = false;
  for (let j = 0; j < judged && j < step.links.length; j++) {
    if (step.links[j]!.holds && !stopped) real = j + 1;
    else {
      stopped = true;
      ghost = j + 1;
    }
  }
  return { real, ghost };
}

/* ------------------------------------------------------------------ vals dilemma */

type DilemmaStep = StepOf<'dilemma'>;
type DilemmaResponse = ArgumentResponseOf<'dilemma'>;
export type DilemmaSign = { t: string | null; side: 'left' | 'right'; added: boolean };

export const dilemmaNeeded = (step: DilemmaStep) => step.candidates.filter((candidate) => candidate.ok === true).length;
export const dilemmaAllAdded = (step: DilemmaStep, r: DilemmaResponse) => r.added.length >= dilemmaNeeded(step);

export function dilemmaAdd(step: DilemmaStep, r: DilemmaResponse, i: number): Move<DilemmaResponse> {
  const candidate = step.candidates[i];
  if (!candidate || r.added.includes(i) || r.tried.includes(i) || dilemmaAllAdded(step, r)) return stay(r);
  if (candidate.ok === true) return { response: { ...r, added: [...r.added, i] }, note: right(candidate.why) };
  return { response: { ...r, tried: [...r.tried, i], mistakes: r.mistakes + 1 }, note: wrong(candidate.why) };
}

export function dilemmaPick(step: DilemmaStep, r: DilemmaResponse, i: number): Move<DilemmaResponse> {
  const option = step.options[i];
  if (!option || r.honest || r.triedOptions.includes(i) || !dilemmaAllAdded(step, r)) return stay(r);
  if (option.ok === true) return { response: { ...r, honest: true }, note: right(option.why) };
  return { response: { ...r, triedOptions: [...r.triedOptions, i], mistakes: r.mistakes + 1 }, note: wrong(option.why) };
}

/** De wegwijzer: de twee wegen uit het dilemma, dan per gevonden weg een nieuw bordje (of een lege plek). */
export function dilemmaSigns(step: DilemmaStep, r: DilemmaResponse): DilemmaSign[] {
  const signs: DilemmaSign[] = [
    { t: step.horns[0], side: 'left', added: false },
    { t: step.horns[1], side: 'right', added: false },
  ];
  for (let n = 0; n < dilemmaNeeded(step); n++) {
    const candidate = r.added[n] === undefined ? undefined : step.candidates[r.added[n]!];
    signs.push({ t: candidate && candidate.ok === true ? candidate.sign : null, side: n % 2 === 0 ? 'left' : 'right', added: true });
  }
  return signs;
}

/* ------------------------------------------------------------------ keuring */

type InspectStep = StepOf<'inspect'>;
type InspectResponse = ArgumentResponseOf<'inspect'>;

export const CREDIBILITY_MAX = 5;
export const inspectVerdicts = (step: InspectStep) => [step.fine, ...step.fallacies];
export const inspectFlawed = (step: InspectStep) => step.rows.flatMap((row, i) => ('fallacy' in row ? [i] : []));

/** Index van het juiste oordeel in `inspectVerdicts`: 0 is "houdt stand". */
export function inspectVerdictOf(step: InspectStep, row: number): number {
  const item = step.rows[row];
  return item && 'fallacy' in item ? 1 + step.fallacies.indexOf(item.fallacy) : 0;
}

export function inspectCredibility(step: InspectStep, r: InspectResponse) {
  const value = CREDIBILITY_MAX - inspectFlawed(step).length + r.fixed.length;
  return { value: Math.max(0, Math.min(CREDIBILITY_MAX, value)), max: CREDIBILITY_MAX };
}

export const inspectSelect = (r: InspectResponse, row: number): InspectResponse => ({ ...r, sel: row });

export function inspectLabel(step: InspectStep, r: InspectResponse, k: number): Move<InspectResponse> {
  const row = r.sel === null ? undefined : step.rows[r.sel];
  if (r.sel === null || !row || r.judged.includes(r.sel)) return stay(r);
  const key = `l${r.sel}-${k}`;
  if (k !== inspectVerdictOf(step, r.sel)) {
    if (r.tried.includes(key)) return stay(r);
    return { response: { ...r, tried: [...r.tried, key], mistakes: r.mistakes + 1 }, note: wrong(row.hint) };
  }
  return { response: { ...r, judged: [...r.judged, r.sel] }, note: null };
}

export function inspectFix(step: InspectStep, r: InspectResponse, k: number): Move<InspectResponse> {
  const row = r.sel === null ? undefined : step.rows[r.sel];
  if (r.sel === null || !row || !('fallacy' in row) || !r.judged.includes(r.sel) || r.fixed.includes(r.sel)) return stay(r);
  const fix = row.fixes[k];
  if (!fix) return stay(r);
  const key = `f${r.sel}-${k}`;
  if (fix.ok !== true) {
    if (r.tried.includes(key)) return stay(r);
    return { response: { ...r, tried: [...r.tried, key], mistakes: r.mistakes + 1 }, note: wrong(fix.why) };
  }
  return { response: { ...r, fixed: [...r.fixed, r.sel] }, note: null };
}

/** De goede vervanging van een zin met een drogreden. */
export function inspectRepair(step: InspectStep, row: number) {
  const item = step.rows[row];
  if (!item || !('fallacy' in item)) return undefined;
  const fix = item.fixes.find((option) => option.ok === true);
  return fix && fix.ok === true ? fix : undefined;
}

/* ------------------------------------------------------------------ engine */

export function argumentInitialResponse(step: Step): ArgumentResponse | null {
  switch (step.kind) {
    case 'reason': {
      const first = step.pairs[0]!;
      return { kind: 'reason', pair: 0, top: first.start.top, word: first.start.word, found: [], mistakes: 0 };
    }
    case 'support':
      return { kind: 'support', level: 0, tried: [], mistakes: 0 };
    case 'evidence':
      return { kind: 'evidence', sel: 0, pick: step.rows.map((row) => row.start) };
    case 'rebut':
      return { kind: 'rebut', round: 0, tried: [], mistakes: 0 };
    case 'strawman':
      return { kind: 'strawman', found: [], tried: [], fair: false, mistakes: 0 };
    case 'slope':
      return { kind: 'slope', judged: 0, tried: [], honest: false, mistakes: 0 };
    case 'dilemma':
      return { kind: 'dilemma', added: [], tried: [], triedOptions: [], honest: false, mistakes: 0 };
    case 'inspect':
      return { kind: 'inspect', sel: null, judged: [], fixed: [], tried: [], mistakes: 0 };
    default:
      return null;
  }
}

export function argumentIsComplete(step: Step, r: ArgumentResponse): boolean {
  switch (r.kind) {
    case 'reason':
      return step.kind === 'reason' && r.pair === step.pairs.length - 1 && reasonPairDone(r);
    case 'support':
      return step.kind === 'support' && r.level >= step.levels.length;
    case 'evidence':
      return step.kind === 'evidence' && evidenceFitting(step, r) === step.rows.length;
    case 'rebut':
      return step.kind === 'rebut' && r.round >= step.rounds.length;
    case 'strawman':
      return step.kind === 'strawman' && r.fair;
    case 'slope':
      return step.kind === 'slope' && r.honest;
    case 'dilemma':
      return step.kind === 'dilemma' && r.honest;
    case 'inspect':
      return step.kind === 'inspect' && inspectFlawed(step).every((row) => r.fixed.includes(row));
  }
}

/** Past een opgeslagen antwoord nog bij de (mogelijk gewijzigde) stap? */
export function argumentFits(step: Step, r: ArgumentResponse): boolean {
  const within = (values: readonly number[], length: number) => values.every((value) => value < length);
  switch (r.kind) {
    case 'reason':
      return step.kind === 'reason' && r.pair < step.pairs.length;
    case 'support':
      return step.kind === 'support' && r.level <= step.levels.length && within(r.tried, step.levels[r.level]?.options.length ?? 0);
    case 'evidence':
      return step.kind === 'evidence' && r.sel < step.rows.length && r.pick.length === step.rows.length && r.pick.every((k, i) => k < (step.rows[i]?.options.length ?? 0));
    case 'rebut':
      return step.kind === 'rebut' && r.round <= step.rounds.length && within(r.tried, step.rounds[r.round]?.options.length ?? 0);
    case 'strawman':
      return step.kind === 'strawman' && r.found.every((id) => strawmanTwists(step).includes(id)) && within(r.tried, step.options.length);
    case 'slope':
      return step.kind === 'slope' && r.judged <= step.links.length && within(r.tried, step.options.length);
    case 'dilemma':
      return (
        step.kind === 'dilemma' &&
        r.added.every((i) => step.candidates[i]?.ok === true) &&
        within(r.tried, step.candidates.length) &&
        within(r.triedOptions, step.options.length)
      );
    case 'inspect':
      return step.kind === 'inspect' && (r.sel === null || r.sel < step.rows.length) && within(r.judged, step.rows.length) && within(r.fixed, step.rows.length);
  }
}

export function argumentEvaluate(step: Step, r: ArgumentResponse): Outcome {
  switch (r.kind) {
    case 'reason':
      return step.kind === 'reason' ? taskOutcome(taskScore(step.pairs.length * 2, r.mistakes)) : taskOutcome(0);
    case 'support':
      return step.kind === 'support' ? taskOutcome(taskScore(step.levels.length, r.mistakes)) : taskOutcome(0);
    case 'evidence':
      return taskOutcome(null);
    case 'rebut':
      return step.kind === 'rebut' ? taskOutcome(taskScore(step.rounds.length, r.mistakes)) : taskOutcome(0);
    case 'strawman':
      return step.kind === 'strawman' ? taskOutcome(taskScore(strawmanTwists(step).length + 1, r.mistakes)) : taskOutcome(0);
    case 'slope':
      return step.kind === 'slope' ? taskOutcome(taskScore(step.links.length + 1, r.mistakes)) : taskOutcome(0);
    case 'dilemma':
      return step.kind === 'dilemma' ? taskOutcome(taskScore(dilemmaNeeded(step) + 1, r.mistakes)) : taskOutcome(0);
    case 'inspect':
      return step.kind === 'inspect' ? taskOutcome(taskScore(inspectFlawed(step).length * 2, r.mistakes)) : taskOutcome(0);
  }
}

export function argumentFeedback(step: Step, _r: ArgumentResponse, outcome: Outcome): Feedback {
  const done = 'done' in step && step.done ? { title: step.done.title, body: step.done.text } : null;
  return done ?? { title: outcome.correct ? 'Klaar!' : 'Klaar' };
}

/** Voortgang in de voettekst terwijl de leerling bezig is (teksten uit de ontwerpen). */
export function argumentProgress(step: Step, r: ArgumentResponse): string | null {
  switch (r.kind) {
    case 'reason':
      return step.kind === 'reason' ? `Paar ${r.pair + 1} van ${step.pairs.length} · ${r.found.length} van 2 manieren` : null;
    case 'support':
      return step.kind === 'support' ? `Vraag ${Math.min(r.level + 1, step.levels.length)} van ${step.levels.length}` : null;
    case 'evidence':
      return step.kind === 'evidence' ? `${evidenceFitting(step, r)} van ${step.rows.length} zinnen past bij je bewijs` : null;
    case 'rebut':
      return step.kind === 'rebut' ? `Bezwaar ${Math.min(r.round + 1, step.rounds.length)} van ${step.rounds.length}` : null;
    case 'strawman': {
      if (step.kind !== 'strawman') return null;
      const left = strawmanTwists(step).filter((id) => !r.found.includes(id)).length;
      return left === 0 ? 'Kies de eerlijke reactie' : `Nog ${left} ${plural(left, 'verdraaiing', 'verdraaiingen')} te vinden`;
    }
    case 'slope':
      if (step.kind !== 'slope') return null;
      return r.judged >= step.links.length ? 'Kies de eerlijke versie' : `Stap ${r.judged + 1} van ${step.links.length}`;
    case 'dilemma': {
      if (step.kind !== 'dilemma') return null;
      const left = dilemmaNeeded(step) - r.added.length;
      return left <= 0 ? 'Kies de eerlijke versie' : `Nog ${left} ${plural(left, 'weg', 'wegen')} erbij`;
    }
    case 'inspect': {
      if (step.kind !== 'inspect') return null;
      const left = inspectFlawed(step).filter((row) => !r.fixed.includes(row)).length;
      return `Nog ${left} ${plural(left, 'drogreden', 'drogredenen')} te herstellen`;
    }
  }
}
