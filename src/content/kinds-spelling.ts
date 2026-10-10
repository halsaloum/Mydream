import { z } from 'zod';
import { normalizeAnswer, parseCloze } from './cloze';
import { Done, StepId, Text, intro, issue, prompt } from './kinds';

/**
 * Lange spellingoefeningen: veel zelf typen, weinig hulp. Ze zijn gemaakt om uit te dagen:
 * de leerling ziet geen beginletters en geen aantal fouten, en moet elk woord zelf schrijven.
 *
 * - Invultekst (`cloze`): een hele tekst met gaten; je typt elk gat zelf.
 * - Reeks (`drill`): veel woorden achter elkaar; wat fout gaat, komt terug tot het goed is.
 * - Tekstdictee (`passage`): een dictee van meerdere zinnen, per woord nagekeken.
 */

export const ClozeStep = z
  .object({
    kind: z.literal('cloze'),
    id: StepId,
    prompt,
    intro,
    title: z.string().optional().describe('Kop boven de tekst, bv. "Mail aan de huisbaas".'),
    text: Text.describe(
      'Tekst met gaten: {antwoord}, {antwoord|aanwijzing} of {antwoord|aanwijzing|uitleg}. Meer goede antwoorden met ~. Een lege regel begint een nieuwe alinea.',
    ),
    caps: z.boolean().optional().describe('Hoofdletters tellen mee (bij lessen over hoofdletters).'),
    why: Text.describe('Uitleg die na het nakijken onder de tekst staat.'),
  })
  .describe('Invultekst: een hele tekst met gaten. Elk gat typ je zelf; na het controleren zie je per gat wat goed is.')
  .superRefine((step, ctx) => {
    const parsed = parseCloze(step.text);
    if ('error' in parsed) return issue(ctx, ['text'], parsed.error);
    if (parsed.gaps.length < 2) issue(ctx, ['text'], 'Een invultekst heeft minstens twee gaten');
    const caps = step.caps ?? false;
    parsed.gaps.forEach((gap, i) => {
      const answers = gap.answers.map((answer) => normalizeAnswer(answer, caps));
      if (new Set(answers).size !== answers.length) issue(ctx, ['text'], `Gat ${i + 1}: een antwoord staat dubbel`);
      if (answers.includes('')) issue(ctx, ['text'], `Gat ${i + 1}: een antwoord van alleen leestekens kan niemand goed typen`);
      if (gap.cue && answers.includes(normalizeAnswer(gap.cue, caps))) issue(ctx, ['text'], `Gat ${i + 1}: de aanwijzing verraadt het antwoord`);
    });
  });

const DrillItem = z.object({
  q: Text.describe('De opdracht bij dit woord, bv. "Meervoud van stad" of "Schrijf het getal".'),
  before: z.string().optional().describe('Zinsdeel vóór het invulvak.'),
  after: z.string().optional().describe('Zinsdeel na het invulvak.'),
  say: Text.optional().describe('Wordt voorgelezen met een luisterknop, bv. het woord dat je moet schrijven. De opdracht moet ook zonder geluid te doen zijn.'),
  a: Text.describe('Het goede antwoord.'),
  also: z.array(Text).optional().describe('Andere goede antwoorden.'),
  why: Text.describe('Uitleg, direct na het antwoord.'),
});

export const DrillStep = z
  .object({
    kind: z.literal('drill'),
    id: StepId,
    prompt,
    intro,
    items: z.array(DrillItem).min(4),
    caps: z.boolean().optional().describe('Hoofdletters tellen mee.'),
    done: Done.optional(),
  })
  .describe('Reeks: veel korte opdrachten achter elkaar. Je typt elk antwoord zelf; wat fout gaat, komt achteraan terug tot het goed is.')
  .superRefine((step, ctx) => {
    const caps = step.caps ?? false;
    const seen = new Set<string>();
    step.items.forEach((item, i) => {
      const key = [item.q, item.before ?? '', item.after ?? ''].join('|');
      if (seen.has(key)) issue(ctx, ['items', i], 'Deze opdracht staat dubbel');
      seen.add(key);
      const answers = [item.a, ...(item.also ?? [])].map((answer) => normalizeAnswer(answer, caps));
      if (new Set(answers).size !== answers.length) issue(ctx, ['items', i, 'also'], 'Een antwoord staat dubbel');
      if (answers.includes('')) issue(ctx, ['items', i, 'a'], 'Een antwoord van alleen leestekens kan niemand goed typen');
    });
  });

export const PassageStep = z
  .object({
    kind: z.literal('passage'),
    id: StepId,
    prompt,
    intro,
    title: z.string().optional().describe('Kop boven het dictee, bv. "Een mail aan je buurman".'),
    sentences: z.array(Text).min(2).max(12).describe('De zinnen die één voor één worden voorgelezen; hoofdletters en leestekens tellen mee.'),
    right: Text.describe('Uitleg als alles goed is.'),
    wrong: Text.describe('Uitleg als er fouten in staan.'),
  })
  .describe('Tekstdictee: luister zin voor zin en typ precies wat je hoort. Elk woord wordt nagekeken.');

export const SPELLING_STEP_SCHEMAS = [ClozeStep, DrillStep, PassageStep] as const;
