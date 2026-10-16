import { z } from 'zod';
import { clozeOf, normalizeAnswer, parseCloze } from '../cloze';
import { hasBalancedEmphasis, parseRich, plainText } from '../text';

/**
 * Het contract van de woordenbank (tab "Woorden").
 *
 * Elk woord is één `WordEntry`: de vorm, de betekenis en het gebruik, plus het materiaal voor
 * de oefeningen die de app er zelf van maakt (raden uit de zin, ophalen, de goede combinatie,
 * denken in een gesprek, benoemen, zelf gebruiken). De app bedenkt geen inhoud: elke zin die
 * de leerling ziet, staat hier.
 *
 * Conventies:
 * - `*…*` markeert het doelwoord in een zin (voorbeelden, raadzin).
 * - `{…}` is het gat in een invulzin; meer goede antwoorden scheid je met `~` (zie `cloze.ts`).
 * - `forms` bevat elke vorm waarin het woord in de zinnen staat. Een gesplitste vorm schrijf je
 *   met `…`, bv. `stuurt … bij` of `hakt … de knoop door`. Daarmee controleert de app of een
 *   eigen zin het woord echt bevat.
 */

export const WORD_POS = ['zn', 'ww', 'bn', 'bw', 'vw', 'vz', 'uitdr'] as const;
export type WordPos = (typeof WORD_POS)[number];

export const POS_LABELS: Record<WordPos, string> = {
  zn: 'zelfstandig naamwoord',
  ww: 'werkwoord',
  bn: 'bijvoeglijk naamwoord',
  bw: 'bijwoord',
  vw: 'voegwoord',
  vz: 'voorzetsel',
  uitdr: 'uitdrukking',
};

export const WORD_LEVELS = ['B1', 'B2', 'C1', 'C2'] as const;
export const REGISTERS = ['formeel', 'informeel'] as const;

const Text = z.string().regex(/\S/, 'Mag niet leeg zijn');
const Slug = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'Gebruik kleine letters, cijfers en koppeltekens');

/** Een zin waarin het doelwoord met `*…*` is gemarkeerd. */
const Marked = Text.refine(hasBalancedEmphasis, 'Markeringen met * moeten in paren voorkomen').refine(
  (text) => parseRich(text).some((segment) => segment.emphasis),
  'Markeer het doelwoord met *…*',
);

/** Een zin met precies één gat `{…}`. */
const GapText = Text.superRefine((text, ctx) => {
  const parsed = parseCloze(text);
  if ('error' in parsed) ctx.addIssue({ code: 'custom', message: parsed.error });
  else if (parsed.gaps.length !== 1) ctx.addIssue({ code: 'custom', message: 'Een invulzin heeft precies één gat {…}' });
});

const unique = (values: readonly string[]) => new Set(values.map((value) => normalizeAnswer(value, false))).size === values.length;

export const WordEntrySchema = z
  .object({
    id: Slug.describe('Stabiele sleutel; wijzig niet zodra leerlingen het woord geleerd hebben.'),
    word: Text.describe('Het woord zoals je het leert: zonder lidwoord; een uitdrukking in haar gewone vorm.'),
    article: z.enum(['de', 'het']).optional().describe('Lidwoord bij een zelfstandig naamwoord.'),
    pos: z.enum(WORD_POS),
    level: z.enum(WORD_LEVELS),
    register: z.enum(REGISTERS).optional().describe('Leeg = neutraal.'),
    forms: z.array(Text).min(1).describe('Alle vormen van het woord die in de zinnen voorkomen, ook gesplitst met …'),
    grammar: Text.optional().describe('Korte vormregel voor op de kaart, bv. "meervoud: draagvlakken" of "delegeerde, heeft gedelegeerd".'),
    meaning: Text.describe('De betekenis in eenvoudig Nederlands, één zin.'),
    examples: z.array(Marked).min(2).max(3),
    collocations: z.array(Text).min(2).max(6).describe('Vaste combinaties, bv. "draagvlak creëren".'),
    family: z.array(Text).max(6).optional(),
    synonyms: z.array(Text).max(4).optional(),
    opposites: z.array(Text).max(3).optional(),
    contrast: z.object({ word: Text, note: Text }).optional().describe('Een woord waarmee je dit woord makkelijk verwart, en het verschil.'),
    tip: Text.optional().describe('Een valkuil of geheugensteun.'),
    think: Text.optional().describe('Een denkvraag over je eigen werk.'),
    detect: z.array(Text).min(1).optional().describe('Woorddelen die allemaal in een eigen zin moeten staan (voor uitdrukkingen en scheidbare werkwoorden).'),
    guess: z.object({
      sentence: Marked.describe('Een zin waaruit je de betekenis kunt afleiden.'),
      wrong: z.array(Text).length(3).describe('Drie aannemelijke maar foute betekenissen.'),
    }),
    gaps: z.array(GapText).length(3).describe('Drie zinnen met het woord als gat, elk in een andere situatie.'),
    colloc: z.object({
      text: GapText.describe('Een zin met het doelwoord, en het gat op het woord dat er vast bij hoort. Alle goede woorden in het gat: {creëren~zoeken}.'),
      why: Text.describe('Waarom dit de vaste combinatie is; mag een veelgemaakte fout noemen.'),
    }),
    chat: z.object({
      name: Text,
      role: Text.describe('Wie dit is, bv. "teamlid" of "je manager".'),
      say: Text.describe('Wat die persoon schrijft.'),
      reply: Text.describe('Het goede antwoord, met het doelwoord.'),
      wrong: z.array(Text).length(2).describe('Twee antwoorden met een verkeerd woord of verkeerd gebruik.'),
      fix: Text.describe('Korte verbetering voor wie fout kiest, bv. "draagvlak, niet draagkracht".'),
      why: Text,
    }),
    name: z.object({
      situation: Text.describe('Een situatie op het werk waar dit woord precies de naam van is.'),
      others: z.array(Text).length(3).describe('Drie andere woorden die je zou kunnen kiezen.'),
      why: Text,
    }),
    use: z
      .array(z.object({ situation: Text, model: Text.describe('Een voorbeeldzin met het woord.') }))
      .length(2)
      .describe('Twee situaties om zelf een zin met het woord te schrijven.'),
  })
  .superRefine((entry, ctx) => {
    const issue = (path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', message, path });
    if (entry.pos === 'zn' && !entry.article) issue(['article'], 'Een zelfstandig naamwoord heeft een lidwoord');
    if (entry.pos !== 'zn' && entry.article) issue(['article'], 'Alleen een zelfstandig naamwoord heeft een lidwoord');
    if (!unique(entry.forms)) issue(['forms'], 'Vormen staan dubbel');
    const finds = (text: string) => containsWord(entry, text);

    entry.examples.forEach((example, i) => {
      if (!finds(plainText(example))) issue(['examples', i], 'Het voorbeeld bevat geen vorm uit forms');
    });
    if (!finds(plainText(entry.guess.sentence))) issue(['guess', 'sentence'], 'De raadzin bevat geen vorm uit forms');
    if (!unique([entry.meaning, ...entry.guess.wrong])) issue(['guess', 'wrong'], 'Een foute betekenis is gelijk aan een andere');

    entry.gaps.forEach((text, i) => {
      const parsed = parseCloze(text);
      if ('error' in parsed || parsed.gaps.length !== 1) return;
      const solution = gapSolution(text);
      if (!finds(solution)) issue(['gaps', i], 'Ingevuld bevat de zin geen vorm uit forms');
      const rest = gapRest(text);
      if (parsed.gaps[0]!.answers.some((answer) => wholeWord(answer).test(rest))) issue(['gaps', i], 'Het antwoord staat al in de zin');
      // Het gat moet op het woord zelf staan: zonder het gat is het woord niet compleet.
      else if (formPattern(entry).test(rest.normalize('NFC'))) issue(['gaps', i], 'Het woord staat al buiten het gat');
    });
    if (new Set(entry.gaps.map(gapSolution)).size !== entry.gaps.length) issue(['gaps'], 'Invulzinnen staan dubbel');

    const colloc = parseCloze(entry.colloc.text);
    if (!('error' in colloc) && colloc.gaps.length === 1) {
      if (!finds(gapSolution(entry.colloc.text))) issue(['colloc', 'text'], 'De combinatiezin bevat geen vorm uit forms');
      const rest = gapRest(entry.colloc.text);
      if (colloc.gaps[0]!.answers.some((answer) => wholeWord(answer).test(rest))) issue(['colloc', 'text'], 'Het antwoord staat al in de zin');
    }

    if (!finds(entry.chat.reply)) issue(['chat', 'reply'], 'Het goede antwoord bevat geen vorm uit forms');
    if (!unique([entry.chat.reply, ...entry.chat.wrong])) issue(['chat', 'wrong'], 'Antwoorden staan dubbel');
    if (!unique([entry.word, ...entry.name.others])) issue(['name', 'others'], 'Woorden staan dubbel');
    entry.use.forEach((use, i) => {
      if (!finds(use.model)) issue(['use', i, 'model'], 'De voorbeeldzin bevat geen vorm uit forms');
    });
  });

export type WordEntry = z.infer<typeof WordEntrySchema>;

/* ------------------------------------------------------------------ vormen herkennen */

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const LETTER_BEFORE = '(?<![\\p{L}\\p{N}])';
const LETTER_AFTER = '(?![\\p{L}\\p{N}])';

/** Een woord of woordgroep als hele woorden, hoofdletters en apostrofvormen gelijk. */
export function wholeWord(text: string): RegExp {
  return new RegExp(`${LETTER_BEFORE}${formSource(text)}${LETTER_AFTER}`, 'iu');
}

/** Bron van één vorm: spaties worden "een of meer spaties", … wordt "hoogstens acht woorden ertussen". */
function formSource(form: string): string {
  return form
    .normalize('NFC')
    .replace(/[‘’`´]/g, "'")
    .split('…')
    .map((part) => part.trim().split(/\s+/).map(escapeRegExp).join('\\s+'))
    .join(`${LETTER_AFTER}(?:\\s+\\S+){0,8}?\\s+${LETTER_BEFORE}`)
    .replace(/'/g, "['’]");
}

/** Een buigingsuitgang die een leerling achter een vorm mag zetten (de gedelegeerde taken, plannen's). */
const INFLECTION = "(?:e|en|n|s|['’]s)?";

/** Gecompileerde patronen per vormenlijst: een patroon met \p{…} bouwen is traag, en het wordt bij elke toetsaanslag gevraagd. */
const patterns = new Map<string, RegExp>();

/**
 * Herkent elke vorm van het woord in een tekst (voor eigen zinnen en voor de controle van de
 * inhoud). `loose` laat ook een buigingsuitgang toe, voor de eigen zinnen van de leerling.
 */
export function formPattern(entry: Pick<WordEntry, 'forms'>, loose = false): RegExp {
  const key = `${loose ? 'l' : 's'}\u0000${entry.forms.join('\u0000')}`;
  let pattern = patterns.get(key);
  if (!pattern) {
    const sources = [...entry.forms].sort((a, b) => b.length - a.length).map(formSource);
    pattern = new RegExp(`${LETTER_BEFORE}(?:${sources.join('|')})${loose ? INFLECTION : ''}${LETTER_AFTER}`, 'iu');
    patterns.set(key, pattern);
  }
  return pattern;
}

/** Staat het woord in de tekst? Een vorm uit `forms`, of alle woorddelen uit `detect`. */
export function containsWord(entry: Pick<WordEntry, 'forms' | 'detect'>, text: string, loose = false): boolean {
  const clean = text.normalize('NFC');
  if (formPattern(entry, loose).test(clean)) return true;
  if (!entry.detect) return false;
  const lower = clean.toLocaleLowerCase('nl');
  return entry.detect.every((part) => lower.includes(part.toLocaleLowerCase('nl')));
}

/** De invulzin met het (eerste) goede antwoord ingevuld. */
export function gapSolution(text: string): string {
  const { parts, gaps } = clozeOf(text);
  return parts.map((part) => (part.kind === 'text' ? part.text : (gaps[part.gap]?.answers[0] ?? ''))).join('');
}

/** De invulzin zonder het gat (om te zien of het antwoord al ergens anders staat). */
export function gapRest(text: string): string {
  const { parts } = clozeOf(text);
  return parts.map((part) => (part.kind === 'text' ? part.text : ' … ')).join('');
}

/** Een invulzin uit elkaar: tekst voor en na het gat, en de goede antwoorden. */
export function splitGap(text: string): { before: string; after: string; answers: string[] } {
  const { parts, gaps } = clozeOf(text);
  const at = parts.findIndex((part) => part.kind === 'gap');
  const join = (list: typeof parts) => list.map((part) => (part.kind === 'text' ? part.text : '')).join('');
  return { before: join(parts.slice(0, at)).trimEnd(), after: join(parts.slice(at + 1)).trimStart(), answers: gaps[0]?.answers ?? [] };
}

/** Het woord met lidwoord, zoals op de kaart: "het draagvlak". */
export function headword(entry: Pick<WordEntry, 'word' | 'article'>): string {
  return entry.article ? `${entry.article} ${entry.word}` : entry.word;
}
