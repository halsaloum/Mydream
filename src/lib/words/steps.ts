import type { Step, StepOf } from '@/content/schema';
import { plainText } from '@/content/text';
import { getTheme, getWord, gapSolution, headword, POS_LABELS, splitGap, wholeWord, type BankWord } from '@/content/words';
import { fingerprint } from '@/engine/hash';
import type { PlanStep } from '@/engine/plan';

/**
 * Van woord naar oefening. Elke oefening in de tab "Woorden" komt uit één woord (of, bij de
 * schrijfopdracht aan het eind, uit een paar woorden) en heeft een vaste sleutel:
 *
 *   woorden:<woord-id>:<taak>#<vingerafdruk>        bv. woorden:draagvlak:recall0#1x9k2
 *   woorden:samen:<id>+<id>+<id>:<situatie>#<vingerafdruk>
 *
 * Uit de sleutel bouwt `lookupWordStep` de stap opnieuw; past de vingerafdruk niet meer (de inhoud
 * is veranderd), dan bestaat de stap niet meer en vervalt hij netjes, net als bij lessen.
 */

export const WORDS_LESSON_ID = 'woorden';

export const TASKS = ['guess', 'card', 'recall0', 'recall1', 'recall2', 'free0', 'free1', 'free2', 'chat', 'colloc', 'name', 'meaning', 'use0', 'use1'] as const;
export type Task = (typeof TASKS)[number];

/** Taken die meetellen voor het onthouden (de rest is uitleg of een poging vooraf). */
export const MEMORY_TASKS = new Set<Task>(['recall0', 'recall1', 'recall2', 'free0', 'free1', 'free2', 'chat', 'colloc', 'name', 'meaning', 'use0', 'use1']);

const initials = (name: string) => name.slice(0, 1).toLocaleUpperCase('nl');

/**
 * De beginletter van elk woord in het antwoord, als steuntje: zo weet je welk woord bedoeld is (en
 * niet een synoniem), maar moet je het zelf ophalen en spellen.
 */
export function recallCue(answer: string): string {
  return answer
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1)}…`)
    .join(' ');
}

/** A definition may contain an accepted answer; hide that occurrence before retrieval. */
export function recallMeaning(meaning: string, answers: readonly string[]): string {
  return [...answers].sort((a, b) => b.length - a.length).reduce((clue, answer) => {
    const pattern = wholeWord(answer);
    return clue.replace(new RegExp(pattern.source, `${pattern.flags.replace('g', '')}g`), '…');
  }, meaning);
}

/** Zelf ophalen in een zin; met beginletters zolang het woord nog nieuw is, later zonder. */
function recallStep(word: BankWord, index: 0 | 1 | 2, cued: boolean): StepOf<'recall'> {
  const { before, after, answers } = splitGap(word.gaps[index] ?? word.gaps[0]!);
  return {
    kind: 'recall',
    prompt: cued ? 'Vul het geleerde woord in de passende vorm in.' : 'Haal het geleerde woord op, zonder beginletter. Gebruik de vorm die hier past.',
    clue: recallMeaning(word.meaning, answers),
    ...(cued ? { cue: recallCue(answers[0] ?? '') } : {}),
    before,
    after,
    answers,
    word: headword(word),
    why: `Vaak samen met: ${word.collocations.slice(0, 3).join(', ')}.`,
  };
}

/** Wat in een eigen zin als het woord telt: elke vorm uit de bank, en ook het woord zoals op het kaartje. */
function writeTarget(word: BankWord) {
  const lemma = word.word.trim();
  const forms = word.forms.some((form) => form.toLocaleLowerCase('nl') === lemma.toLocaleLowerCase('nl')) ? word.forms : [...word.forms, lemma];
  return { word: headword(word), forms, ...(word.detect ? { detect: word.detect } : {}) };
}

function writeStep(word: BankWord, index: 0 | 1): StepOf<'use'> {
  const use = word.use[index] ?? word.use[0]!;
  return {
    kind: 'use',
    prompt: 'Gebruik het in je eigen zin',
    situation: use.situation,
    targets: [writeTarget(word)],
    minWords: 7,
    models: [use.model],
    checks: [
      'Staat het woord in de goede vorm in je zin?',
      'Past het precies bij deze situatie, of zou een ander woord beter passen?',
      `Gebruik je een vaste combinatie, zoals ‘${word.collocations[0] ?? headword(word)}’?`,
    ],
  };
}

/** De stap voor één taak van één woord. */
export function wordTaskStep(word: BankWord, task: Task): Step {
  const shown = headword(word);
  switch (task) {
    case 'guess':
      return {
        kind: 'guess',
        prompt: 'Wat betekent dit woord, denk je?',
        sentence: word.guess.sentence,
        word: shown,
        options: [word.meaning, ...word.guess.wrong],
        answer: word.meaning,
        why: 'Op de kaart zie je hoe je het gebruikt.',
      };
    case 'card':
      return {
        kind: 'word',
        word: word.word,
        ...(word.article ? { article: word.article } : {}),
        pos: POS_LABELS[word.pos],
        level: word.level,
        ...(word.register ? { register: word.register } : {}),
        theme: getTheme(word.theme)?.name ?? word.theme,
        ...(word.grammar ? { grammar: word.grammar } : {}),
        meaning: word.meaning,
        examples: word.examples,
        collocations: word.collocations,
        ...(word.family ? { family: word.family } : {}),
        ...(word.synonyms ? { synonyms: word.synonyms } : {}),
        ...(word.opposites ? { opposites: word.opposites } : {}),
        ...(word.contrast ? { contrast: word.contrast } : {}),
        ...(word.tip ? { tip: word.tip } : {}),
        ...(word.think ? { think: word.think } : {}),
      };
    case 'recall0':
      return recallStep(word, 0, true);
    case 'recall1':
      return recallStep(word, 1, true);
    case 'recall2':
      return recallStep(word, 2, true);
    case 'free0':
      return recallStep(word, 0, false);
    case 'free1':
      return recallStep(word, 1, false);
    case 'free2':
      return recallStep(word, 2, false);
    case 'chat':
      return {
        kind: 'chat',
        prompt: 'Denk mee: wat antwoord je?',
        intro: `Kies het antwoord dat *${shown}* goed gebruikt en dat ook klopt in deze situatie.`,
        contact: { name: word.chat.name, role: word.chat.role, initials: initials(word.chat.name) },
        rounds: [{ say: word.chat.say, options: [word.chat.reply, ...word.chat.wrong], right: 0, fix: word.chat.fix, why: word.chat.why }],
        bye: 'Helder, dank je.',
      };
    case 'colloc': {
      // Deze taak vraagt productie van de combinatie; de feedback noemt de bedoelde vorm.
      const { before, after, answers } = splitGap(word.colloc.text);
      // Staat het antwoord (vaak een voorzetsel) in de betekenis, dan alleen het woord als steuntje.
      const gives = answers.some((answer) => wholeWord(answer).test(word.meaning));
      return {
        kind: 'recall',
        prompt: 'Vul de geoefende vaste combinatie aan.',
        clueLabel: 'Het woord',
        clue: gives ? shown : `${shown}: ${word.meaning}`,
        cue: recallCue(answers[0] ?? ''),
        before,
        after,
        answers,
        word: shown,
        why: word.colloc.why,
      };
    }
    case 'name':
      return {
        kind: 'scene',
        prompt: 'Welk woord past bij deze situatie?',
        situation: word.name.situation,
        options: [word.word, ...word.name.others],
        answer: word.word,
        why: word.name.why,
      };
    case 'meaning':
      return {
        kind: 'bet',
        prompt: `Wat betekent ‘${shown}’?`,
        intro: word.examples[0],
        options: [word.meaning, ...word.guess.wrong],
        answer: word.meaning,
        why: `Bijvoorbeeld: ${plainText(word.examples[1] ?? word.examples[0]!)}`,
      };
    case 'use0':
      return writeStep(word, 0);
    case 'use1':
      return writeStep(word, 1);
  }
}

/** De schrijfopdracht aan het eind van een dag: een paar nieuwe woorden samen in één tekst. */
export function composeStep(words: readonly BankWord[], situation: string): StepOf<'use'> {
  return {
    kind: 'use',
    prompt: 'Gebruik ze samen',
    situation,
    targets: words.map(writeTarget),
    minWords: 25 + words.length * 5,
    models: words.map((word) => gapSolution(word.gaps[1] ?? word.gaps[0]!)),
    checks: [
      'Gebruik je elk woord in de betekenis van de kaart?',
      'Is je tekst duidelijk voor de lezer: wat moet hij weten of doen?',
      'Klinkt het als een goede leider: helder, vriendelijk en concreet?',
    ],
  };
}

/* ------------------------------------------------------------------ sleutels */

const PREFIX = `${WORDS_LESSON_ID}:`;

export function isWordKey(key: string): boolean {
  return key.startsWith(PREFIX);
}

function planStep(key: string, step: Step): PlanStep {
  return { key, lessonId: WORDS_LESSON_ID, step, source: { stepIndex: 0 } };
}

export function wordTaskItem(word: BankWord, task: Task): PlanStep {
  const step = wordTaskStep(word, task);
  return planStep(`${PREFIX}${word.id}:${task}#${fingerprint(step)}`, step);
}

export function composeItem(words: readonly BankWord[], situation: string, situationKey: string): PlanStep {
  const step = composeStep(words, situation);
  return planStep(`${PREFIX}samen:${words.map((word) => word.id).join('+')}:${situationKey}#${fingerprint(step)}`, step);
}

export type ParsedKey = { kind: 'task'; wordId: string; task: Task } | { kind: 'compose'; wordIds: string[]; situationKey: string };

export function parseWordKey(key: string): ParsedKey | null {
  if (!isWordKey(key)) return null;
  const head = key.slice(PREFIX.length).split('#')[0] ?? '';
  const parts = head.split(':');
  if (parts[0] === 'samen' && parts.length === 3) {
    const wordIds = (parts[1] ?? '').split('+').filter(Boolean);
    return wordIds.length ? { kind: 'compose', wordIds, situationKey: parts[2] ?? '' } : null;
  }
  if (parts.length !== 2) return null;
  const task = parts[1] as Task;
  if (!(TASKS as readonly string[]).includes(task)) return null;
  return { kind: 'task', wordId: parts[0] ?? '', task };
}

/** Situaties per sleutel: `<thema>.<n>` voor een thema, `algemeen.<n>` voor de algemene lijst. */
export function situationFor(situationKey: string): string | undefined {
  const [themeId, n] = situationKey.split('.');
  const index = Number(n);
  if (!Number.isInteger(index)) return undefined;
  if (themeId === 'algemeen') return GENERAL_SITUATIONS[index];
  return getTheme(themeId ?? '')?.situations[index];
}

/** Voor dagen zonder vakwoorden: situaties waar elk woord in past. */
export const GENERAL_SITUATIONS = [
  'Schrijf een korte mail aan een collega over hoe je week ging en wat je volgende week gaat doen.',
  'Schrijf een bericht aan een vriend over iets wat je deze maand hebt geleerd.',
  'Schrijf een paar zinnen over een keuze die je onlangs hebt gemaakt, en waarom.',
];

const cache = new Map<string, PlanStep | null>();

/** Bouwt de stap achter een sleutel opnieuw, of `undefined` als hij niet (meer) bestaat. */
export function lookupWordStep(key: string): PlanStep | undefined {
  if (cache.has(key)) return cache.get(key) ?? undefined;
  const parsed = parseWordKey(key);
  let item: PlanStep | null = null;
  if (parsed?.kind === 'task') {
    const word = getWord(parsed.wordId);
    if (word) item = wordTaskItem(word, parsed.task);
  } else if (parsed?.kind === 'compose') {
    const words = parsed.wordIds.map(getWord);
    const situation = situationFor(parsed.situationKey);
    if (situation && words.every(Boolean)) item = composeItem(words as BankWord[], situation, parsed.situationKey);
  }
  const found = item && item.key === key ? item : null;
  cache.set(key, found);
  return found ?? undefined;
}
