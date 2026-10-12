import { z } from 'zod';
import { normalizeAnswer } from './cloze';
import { StepId, Text, issue, prompt, unique } from './kinds';
import { hasBalancedEmphasis } from './text';

/**
 * Oefenvormen van de tab "Woorden". De app maakt ze zelf uit de woordenbank
 * (`content/words/`), maar ze staan in hetzelfde contract als alle andere stappen, zodat de
 * lesplayer, de beoordeling en het bewaren gewoon werken.
 *
 * - Woordkaart (`word`): het woord met betekenis, vormen, combinaties en verschillen. Uitleg.
 * - Raad eerst (`guess`): raad de betekenis uit de zin vóór je de kaart ziet. Telt niet mee:
 *   een poging vooraf, ook een foute, laat je de uitleg daarna beter onthouden.
 * - Ophalen (`recall`): typ het woord zelf in een nieuwe zin.
 * - Denk na (`scene`): kies in een situatie het woord of de zin die precies past.
 * - Gebruik het (`use`): schrijf je eigen zin of tekst met het woord, vergelijk met een voorbeeld
 *   en beoordeel jezelf eerlijk.
 */

export const WordStep = z
  .object({
    kind: z.literal('word'),
    id: StepId,
    word: Text,
    article: z.enum(['de', 'het']).optional(),
    pos: Text.describe('Woordsoort, uitgeschreven.'),
    level: Text,
    register: z.string().optional(),
    theme: Text,
    grammar: z.string().optional(),
    meaning: Text,
    examples: z.array(Text.refine(hasBalancedEmphasis)).min(1),
    collocations: z.array(Text),
    family: z.array(Text).optional(),
    synonyms: z.array(Text).optional(),
    opposites: z.array(Text).optional(),
    contrast: z.object({ word: Text, note: Text }).optional(),
    tip: z.string().optional(),
    think: z.string().optional(),
  })
  .describe('Woordkaart: het woord, de betekenis, de vormen, vaste combinaties en verschillen met verwante woorden.');

export const GuessStep = z
  .object({
    kind: z.literal('guess'),
    id: StepId,
    prompt,
    sentence: Text.refine(hasBalancedEmphasis).describe('De zin met het nieuwe woord gemarkeerd met *…*.'),
    word: Text,
    options: z.array(Text).min(2).max(5).describe('Mogelijke betekenissen.'),
    answer: Text,
    why: Text,
  })
  .describe('Raad eerst: kies de betekenis die je uit de zin afleidt. Telt niet mee voor je score.')
  .superRefine((step, ctx) => {
    if (!unique(step.options)) issue(ctx, ['options'], 'Opties moeten uniek zijn');
    if (!step.options.includes(step.answer)) issue(ctx, ['answer'], 'Antwoord staat niet tussen de opties');
  });

export const RecallStep = z
  .object({
    kind: z.literal('recall'),
    id: StepId,
    prompt,
    clue: Text.describe('Wat het woord betekent, als aanwijzing.'),
    clueLabel: z.string().optional().describe('Kop boven de aanwijzing; leeg = "Betekenis".'),
    cue: z.string().optional().describe('Steuntje in het lege vak, bv. de beginletters. Leeg = geen steuntje.'),
    before: z.string(),
    after: z.string(),
    answers: z.array(Text).min(1).describe('De goede vormen voor dit gat; de eerste wordt getoond.'),
    word: Text.describe('Het woord zoals op de kaart.'),
    why: Text,
  })
  .describe('Ophalen: typ het woord in de goede vorm in een zin. Hoofdletters tellen niet mee.')
  .superRefine((step, ctx) => {
    const answers = step.answers.map((answer) => normalizeAnswer(answer, false));
    if (new Set(answers).size !== answers.length) issue(ctx, ['answers'], 'Een antwoord staat dubbel');
    if (answers.includes('')) issue(ctx, ['answers'], 'Een antwoord van alleen leestekens kan niemand goed typen');
  });

export const SceneStep = z
  .object({
    kind: z.literal('scene'),
    id: StepId,
    prompt,
    situation: Text.describe('De situatie op het werk.'),
    options: z.array(Text).min(2).max(5),
    answer: Text,
    why: Text,
  })
  .describe('Denk na: lees de situatie en kies het woord dat precies past.')
  .superRefine((step, ctx) => {
    if (!unique(step.options)) issue(ctx, ['options'], 'Opties moeten uniek zijn');
    if (!step.options.includes(step.answer)) issue(ctx, ['answer'], 'Antwoord staat niet tussen de opties');
  });

const UseTarget = z.object({
  word: Text.describe('Het woord zoals het getoond wordt.'),
  forms: z.array(Text).min(1).describe('Vormen die als gebruik van het woord gelden (… = woorden ertussen).'),
  detect: z.array(Text).optional().describe('Of: woorddelen die allemaal in de tekst moeten staan.'),
});

export const UseStep = z
  .object({
    kind: z.literal('use'),
    id: StepId,
    prompt,
    situation: Text,
    targets: z.array(UseTarget).min(1).max(5),
    minWords: z.int().min(1),
    models: z.array(Text).max(3).describe('Voorbeelden die de leerling na het schrijven ziet.'),
    checks: z.array(Text).min(1).max(4).describe('Vragen om je eigen tekst mee na te kijken.'),
  })
  .describe('Gebruik het: schrijf een eigen zin of tekst met de woorden, vergelijk hem met een voorbeeld en beoordeel jezelf.')
  .superRefine((step, ctx) => {
    if (!unique(step.targets.map((target) => target.word))) issue(ctx, ['targets'], 'Woorden staan dubbel');
  });

export const WORD_STEP_SCHEMAS = [WordStep, GuessStep, RecallStep, SceneStep, UseStep] as const;
