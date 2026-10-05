import { z } from 'zod';
import { AccentSchema } from './accent';
import { tokenize } from './text';

/**
 * Oefenvormen uit "Interactieve lessen – ideeën". Elke vorm is JSON-serialiseerbaar en wordt
 * semantisch gecontroleerd (bestaande verwijzingen, oplosbaarheid), zodat lessen uit PDF's
 * niet pas in de app blijken te haperen.
 */

const Text = z.string().regex(/\S/, 'Mag niet leeg zijn');
const StepId = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*$/)
  .optional();
const prompt = Text.describe('Opdracht boven de oefening.');
const intro = z.string().optional().describe('Toelichting onder de opdracht.');
const unique = (values: readonly string[]) => new Set(values).size === values.length;
const issue = (ctx: z.RefinementCtx, path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', message, path });

const Done = z
  .object({ title: Text, text: Text, note: z.string().optional().describe('Slotopmerking in de oefening zelf.') })
  .describe('Afsluitende feedback zodra de oefening klaar is.');
const Segment = z.object({ t: z.string(), hi: z.boolean().optional().describe('Uitgelicht stuk.') });
const Person = z.object({
  name: Text,
  role: z.string().optional().describe('Wie dit is voor de leerling, bv. "je teamleider".'),
  initials: z.string().max(3).optional(),
});
const Image = z.object({ src: Text.describe('Pad naar een afbeelding in /public.'), alt: Text });

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const SwipeStep = z
  .object({
    kind: z.literal('swipe'),
    id: StepId,
    prompt,
    intro,
    cards: z.array(z.object({ t: Text, ok: z.boolean(), fix: z.string().optional().describe('Bij ok=false: de verbetering, bv. "houd → houdt".'), why: Text })).min(2),
    done: Done.optional(),
  })
  .describe('Swipe-kaarten: beoordeel elke zin als goed of fout.')
  .superRefine((step, ctx) => {
    step.cards.forEach((card, i) => {
      if (!card.ok && !card.fix?.trim()) issue(ctx, ['cards', i, 'fix'], 'Een foute zin heeft een verbetering nodig');
    });
  });

export const MorphStep = z
  .object({
    kind: z.literal('morph'),
    id: StepId,
    prompt,
    intro,
    stem: Text,
    slots: z
      .array(z.object({ id: z.string().regex(/^[a-z0-9-]+$/), label: Text, side: z.enum(['before', 'after']), parts: z.array(Text).min(1) }))
      .min(1),
    words: z
      .array(
        z.object({
          combo: z.array(z.string()).describe('Per slot het gekozen stukje, of "" voor niets.'),
          w: Text,
          cls: z.string().optional().describe('Woordsoort, bv. "zn".'),
          mean: Text,
        }),
      )
      .min(1),
    forms: z.record(z.string(), Text).optional().describe('Weergave van stam + eerste achtervoegsel, bv. { "er": "lezer" }.'),
    hints: z.array(z.object({ part: Text, note: Text })).optional().describe('Uitleg als een niet-bestaand woord dit stukje bevat.'),
    goal: z.int().positive(),
    done: Done.optional(),
  })
  .describe('Woordbouwer: plak stukjes aan een stam en ontdek welke woorden bestaan.')
  .superRefine((step, ctx) => {
    if (!unique(step.slots.map((slot) => slot.id))) issue(ctx, ['slots'], 'Slot-id’s moeten uniek zijn');
    step.words.forEach((word, i) => {
      if (word.combo.length !== step.slots.length) issue(ctx, ['words', i, 'combo'], `Verwacht ${step.slots.length} stukjes`);
      word.combo.forEach((part, s) => {
        const slot = step.slots[s];
        if (part !== '' && slot && !slot.parts.includes(part)) issue(ctx, ['words', i, 'combo', s], `"${part}" staat niet in slot ${slot.id}`);
      });
    });
    if (!unique(step.words.map((word) => word.combo.join('|')))) issue(ctx, ['words'], 'Elke combinatie mag één keer voorkomen');
    if (step.goal > step.words.length) issue(ctx, ['goal'], 'Doel is hoger dan het aantal woorden');
  });

export const TimelineStep = z
  .object({
    kind: z.literal('timeline'),
    id: StepId,
    prompt,
    intro,
    stops: z.array(z.object({ label: Text, sub: z.string().optional(), tense: Text })).min(2).max(6),
    verbs: z.array(z.object({ t: Text, cells: z.array(z.object({ segs: z.array(Segment).min(1), rule: Text, note: Text })) })).min(1),
    done: Done.optional(),
  })
  .describe('Tijdschuif: schuif een werkwoord door de tijd.')
  .superRefine((step, ctx) => {
    step.verbs.forEach((verb, i) => {
      if (verb.cells.length !== step.stops.length) issue(ctx, ['verbs', i, 'cells'], `Verwacht ${step.stops.length} tijden`);
    });
  });

export const SpeedStep = z
  .object({
    kind: z.literal('speed'),
    id: StepId,
    prompt,
    intro,
    seconds: z.int().min(10).max(60).describe('Duur van de ronde.'),
    items: z.array(z.object({ a: Text, b: Text, joined: z.boolean(), tip: z.string().optional() })).min(4),
    done: Done.optional(),
  })
  .describe('Snelrondje: aan elkaar of los, tegen de klok (de klok kan uit).');

export const TrainStep = z
  .object({
    kind: z.literal('train'),
    id: StepId,
    prompt,
    intro,
    blocks: z.array(z.object({ id: z.string().regex(/^[A-Za-z0-9]+$/), t: Text, role: Text })).min(3),
    verb: z.string().describe('Id van het blok met de persoonsvorm.'),
    fronts: z.array(z.object({ block: z.string(), order: z.array(z.string()), sentence: z.string().optional() })).min(2),
    done: Done.optional(),
  })
  .describe('Zinstrein: kies wat vooraan staat; de persoonsvorm blijft op plek 2.')
  .superRefine((step, ctx) => {
    const ids = step.blocks.map((block) => block.id);
    if (!unique(ids)) issue(ctx, ['blocks'], 'Blok-id’s moeten uniek zijn');
    if (!ids.includes(step.verb)) issue(ctx, ['verb'], 'Onbekend blok');
    step.fronts.forEach((front, i) => {
      if (!ids.includes(front.block)) issue(ctx, ['fronts', i, 'block'], 'Onbekend blok');
      if (front.order[0] !== front.block) issue(ctx, ['fronts', i, 'order'], 'De volgorde begint met het gekozen blok');
      if (front.order.length !== ids.length || !ids.every((id) => front.order.includes(id)))
        issue(ctx, ['fronts', i, 'order'], 'De volgorde bevat elk blok precies één keer');
    });
  });

export const HighlightStep = z
  .object({
    kind: z.literal('highlight'),
    id: StepId,
    prompt,
    intro,
    pens: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]+$/), label: Text, tag: Text, ask: Text, accent: AccentSchema })).min(2).max(5),
    words: z.array(z.object({ t: Text, role: z.string().optional().describe('Pen-id; leeg = hoeft niet gekleurd.') })).min(2),
    done: Done.optional(),
  })
  .describe('Markeerstiften: kleur elk woord met de stift van zijn zinsdeel.')
  .superRefine((step, ctx) => {
    const ids = step.pens.map((pen) => pen.id);
    if (!unique(ids)) issue(ctx, ['pens'], 'Stift-id’s moeten uniek zijn');
    step.words.forEach((word, i) => {
      if (word.role && !ids.includes(word.role)) issue(ctx, ['words', i, 'role'], 'Onbekende stift');
    });
    step.pens.forEach((pen, i) => {
      if (!step.words.some((word) => word.role === pen.id)) issue(ctx, ['pens', i], 'Deze stift kleurt geen enkel woord');
    });
  });

export const ConjunctionStep = z
  .object({
    kind: z.literal('conjunction'),
    id: StepId,
    prompt,
    intro,
    clause: z.object({ subject: Text, verb: Text, rest: Text }).describe('De bijzin of hoofdzin na het voegwoord, bv. het · regent · hard.'),
    items: z.array(z.object({ conj: Text, type: z.enum(['neven', 'onder']), main: Text, why: Text })).min(2),
    done: Done.optional(),
  })
  .describe('Voegwoord-duw: landt de persoonsvorm op plek 2 of achteraan?')
  .superRefine((step, ctx) => {
    if (!unique(step.items.map((item) => item.conj))) issue(ctx, ['items'], 'Voegwoorden moeten uniek zijn');
  });

const ClampPart = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  t: Text,
  front: z.boolean().describe('Mag vooraan.'),
  after: z.boolean().describe('Mag achter het laatste werkwoord.'),
  note: z.string().optional().describe('Uitleg als het deel achteraan wordt gezet.'),
});

export const ClampStep = z
  .object({
    kind: z.literal('clamp'),
    id: StepId,
    prompt,
    intro,
    subject: Text,
    finite: Text.describe('Persoonsvorm, het begin van de tang.'),
    participle: Text.describe('Laatste werkwoord, het eind van de tang.'),
    middle: z
      .array(z.union([z.object({ part: z.string() }), z.object({ text: Text })]))
      .min(1)
      .describe('Volgorde binnen de tang: verplaatsbare delen (part) en vaste woorden (text).'),
    parts: z.array(ClampPart).min(1).max(6),
    goal: z.int().min(1),
    done: Done.optional(),
  })
  .describe('Zinstang: verplaats zinsdelen tot er weinig woorden tussen de werkwoorden staan.')
  .superRefine((step, ctx) => {
    const ids = step.parts.map((part) => part.id);
    if (!unique(ids)) issue(ctx, ['parts'], 'Deel-id’s moeten uniek zijn');
    const inMiddle = step.middle.flatMap((item) => ('part' in item ? [item.part] : []));
    if (inMiddle.length !== ids.length || !ids.every((id) => inMiddle.includes(id)))
      issue(ctx, ['middle'], 'Elk verplaatsbaar deel staat precies één keer in de tang');
    // Oplosbaar? Probeer alle toegestane plaatsingen (maximaal één deel vooraan).
    const options = step.parts.map((part) => ['mid', ...(part.front ? ['front'] : []), ...(part.after ? ['after'] : [])]);
    let best = Infinity;
    const walk = (i: number, pos: string[]) => {
      if (i === options.length) {
        if (pos.filter((p) => p === 'front').length > 1) return;
        const front = pos.includes('front');
        let count = front ? words(step.subject) : 0;
        step.middle.forEach((item) => {
          if ('text' in item) count += words(item.text);
          else if (pos[ids.indexOf(item.part)] === 'mid') count += words(step.parts[ids.indexOf(item.part)]?.t ?? '');
        });
        best = Math.min(best, count);
        return;
      }
      for (const option of options[i] ?? []) walk(i + 1, [...pos, option]);
    };
    walk(0, []);
    if (best > step.goal) issue(ctx, ['goal'], `Niet haalbaar: minimaal ${best} woorden in de tang`);
  });

export const RefsStep = z
  .object({
    kind: z.literal('refs'),
    id: StepId,
    prompt,
    intro,
    text: Text.describe('De tekst; woorden worden op spaties geteld, vanaf 0.'),
    candidates: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]+$/), from: z.int().nonnegative(), to: z.int().nonnegative() })).min(2),
    refs: z.array(z.object({ at: z.int().nonnegative().describe('Index van het verwijswoord.'), to: z.string(), ask: Text })).min(1),
    done: Done.optional(),
  })
  .describe('Verwijsdraad: koppel elk verwijswoord aan het woord waarnaar het verwijst.')
  .superRefine((step, ctx) => {
    const count = tokenize(step.text).length;
    const ids = step.candidates.map((candidate) => candidate.id);
    if (!unique(ids)) issue(ctx, ['candidates'], 'Kandidaat-id’s moeten uniek zijn');
    step.candidates.forEach((candidate, i) => {
      if (candidate.from > candidate.to || candidate.to >= count) issue(ctx, ['candidates', i], 'Bereik valt buiten de tekst');
    });
    step.refs.forEach((ref, i) => {
      if (ref.at >= count) issue(ctx, ['refs', i, 'at'], 'Index valt buiten de tekst');
      if (!ids.includes(ref.to)) issue(ctx, ['refs', i, 'to'], 'Onbekende kandidaat');
      if (step.candidates.some((candidate) => ref.at >= candidate.from && ref.at <= candidate.to))
        issue(ctx, ['refs', i, 'at'], 'Een verwijswoord kan niet zelf een kandidaat zijn');
    });
  });

export const LadderStep = z
  .object({
    kind: z.literal('ladder'),
    id: StepId,
    prompt,
    intro,
    sentence: z.object({ before: z.string(), after: z.string() }).describe('Zin waarin het gekozen woord wordt ingevuld.'),
    steps: z.array(z.object({ t: Text, days: z.int().min(0).max(7).optional() })).min(3).describe('Van zwak naar sterk.'),
    tray: z.array(Text).optional().describe('Volgorde van de woordkaartjes; standaard geschud.'),
    low: z.string().optional(),
    high: z.string().optional(),
    startHint: z.string().optional(),
    done: Done.optional(),
  })
  .describe('Betekenisladder: zet woorden van zwak naar sterk.')
  .superRefine((step, ctx) => {
    const ladder = step.steps.map((s) => s.t);
    if (!unique(ladder)) issue(ctx, ['steps'], 'Woorden moeten uniek zijn');
    if (step.tray && (step.tray.length !== ladder.length || !ladder.every((t) => step.tray?.includes(t))))
      issue(ctx, ['tray'], 'De kaartjes moeten precies de woorden van de ladder zijn');
  });

export const AmbiguityStep = z
  .object({
    kind: z.literal('ambiguity'),
    id: StepId,
    prompt,
    intro,
    sentence: Text,
    meanings: z
      .array(
        z.object({
          id: z.string().regex(/^[A-Za-z0-9]+$/),
          label: Text,
          highlight: z.array(Text).describe('Woordgroepen die bij deze betekenis bij elkaar horen.'),
          right: Text.describe('Feedback als de passende zin is gevonden.'),
          image: Image.optional(),
        }),
      )
      .min(2)
      .max(3),
    options: z.array(z.object({ t: Text, fits: z.string().nullable(), note: z.string().optional() })).min(2),
    done: Done.optional(),
  })
  .describe('Twee betekenissen: kies per betekenis de zin die alleen dát kan betekenen.')
  .superRefine((step, ctx) => {
    const ids = step.meanings.map((meaning) => meaning.id);
    if (!unique(ids)) issue(ctx, ['meanings'], 'Betekenis-id’s moeten uniek zijn');
    step.options.forEach((option, i) => {
      if (option.fits !== null && !ids.includes(option.fits)) issue(ctx, ['options', i, 'fits'], 'Onbekende betekenis');
    });
    step.meanings.forEach((meaning, i) => {
      if (!step.options.some((option) => option.fits === meaning.id)) issue(ctx, ['meanings', i], 'Geen zin past bij deze betekenis');
      meaning.highlight.forEach((part, h) => {
        if (!step.sentence.includes(part)) issue(ctx, ['meanings', i, 'highlight', h], 'Staat niet in de zin');
      });
    });
  });

export const ChatStep = z
  .object({
    kind: z.literal('chat'),
    id: StepId,
    prompt,
    intro,
    contact: Person,
    rounds: z.array(z.object({ say: Text, options: z.array(Text).min(2).max(3), right: z.int().nonnegative(), fix: Text, why: Text })).min(1),
    bye: Text,
    done: Done.optional(),
  })
  .describe('Chat-scenario: kies telkens de juiste vorm in je antwoord.')
  .superRefine((step, ctx) => {
    step.rounds.forEach((round, i) => {
      if (round.right >= round.options.length) issue(ctx, ['rounds', i, 'right'], 'Antwoordindex bestaat niet');
      if (!unique(round.options)) issue(ctx, ['rounds', i, 'options'], 'Opties moeten uniek zijn');
    });
  });

export const ToneStep = z
  .object({
    kind: z.literal('tone'),
    id: StepId,
    prompt,
    intro,
    contact: Person,
    levels: z.array(z.object({ name: Text, segs: z.array(Segment).min(1), reply: Text, verdict: Text, ok: z.boolean() })).min(3).max(7),
    start: z.int().nonnegative().optional(),
    done: Done.optional(),
  })
  .describe('Toonregelaar: schuif het bericht naar de toon die past bij de lezer.')
  .superRefine((step, ctx) => {
    if (!step.levels.some((level) => level.ok)) issue(ctx, ['levels'], 'Minstens één toon moet passen');
    if (step.start !== undefined && step.start >= step.levels.length) issue(ctx, ['start'], 'Startniveau bestaat niet');
  });

export const IntentStep = z
  .object({
    kind: z.literal('intent'),
    id: StepId,
    prompt,
    intro,
    speaker: Person,
    rounds: z
      .array(z.object({ says: Text, means: Text, replies: z.array(Text).min(2).max(3), right: z.int().nonnegative(), literal: Text, why: Text }))
      .min(1),
    done: Done.optional(),
  })
  .describe('Zegt en bedoelt: kies het antwoord dat doet wat de spreker bedoelt.')
  .superRefine((step, ctx) => {
    step.rounds.forEach((round, i) => {
      if (round.right >= round.replies.length) issue(ctx, ['rounds', i, 'right'], 'Antwoordindex bestaat niet');
    });
  });

export const ScaleStep = z
  .object({
    kind: z.literal('scale'),
    id: StepId,
    prompt,
    intro,
    args: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]+$/), t: Text, type: Text, w: z.int().min(0).max(3), why: Text })).min(3),
    max: z.int().min(1).max(4),
    doubt: z.int().min(1).describe('De twijfel van de lezer; de argumenten moeten samen zwaarder wegen.'),
    done: Done.optional(),
  })
  .describe('Weegschaal: leg argumenten op de schaal tot ze zwaarder wegen dan de twijfel.')
  .superRefine((step, ctx) => {
    if (!unique(step.args.map((arg) => arg.id))) issue(ctx, ['args'], 'Argument-id’s moeten uniek zijn');
    const best = [...step.args]
      .map((arg) => arg.w)
      .sort((a, b) => b - a)
      .slice(0, step.max)
      .reduce((sum, w) => sum + w, 0);
    if (best <= step.doubt) issue(ctx, ['doubt'], `Niet haalbaar: hoogst mogelijke gewicht is ${best}`);
  });

export const StackStep = z
  .object({
    kind: z.literal('stack'),
    id: StepId,
    prompt,
    intro,
    layers: z.array(z.object({ role: Text, ask: Text, question: Text, hint: Text, text: Text })).min(2).describe('Van boven naar beneden.'),
    done: Done.optional(),
  })
  .describe('Alinea-stapel: bouw de alinea laag voor laag op.')
  .superRefine((step, ctx) => {
    if (!unique(step.layers.map((layer) => layer.text))) issue(ctx, ['layers'], 'Zinnen moeten uniek zijn');
  });

export const ProofreadStep = z
  .object({
    kind: z.literal('proofread'),
    id: StepId,
    prompt,
    intro,
    header: z.object({ to: z.string().optional(), subject: z.string().optional() }).optional(),
    tokens: z.array(z.union([z.object({ t: Text, fix: Text, why: Text }), z.object({ t: Text })])).min(3),
    done: Done.optional(),
  })
  .describe('Eindredactie: vind alle fouten in de tekst.')
  .superRefine((step, ctx) => {
    const errors = step.tokens.filter((token) => 'fix' in token);
    if (errors.length === 0) issue(ctx, ['tokens'], 'De tekst bevat geen fout om te vinden');
    step.tokens.forEach((token, i) => {
      if ('fix' in token && token.fix === token.t) issue(ctx, ['tokens', i, 'fix'], 'De verbetering is gelijk aan het origineel');
    });
  });

export const BetStep = z
  .object({
    kind: z.literal('bet'),
    id: StepId,
    prompt,
    intro,
    options: z.array(Text).min(2),
    answer: Text,
    why: Text,
  })
  .describe('Durf je? Kies een antwoord en zet in hoe zeker je bent; dat stuurt de herhaling.')
  .superRefine((step, ctx) => {
    if (!unique(step.options)) issue(ctx, ['options'], 'Opties moeten uniek zijn');
    if (!step.options.includes(step.answer)) issue(ctx, ['answer'], 'Antwoord staat niet tussen de opties');
  });

export const DictationStep = z
  .object({
    kind: z.literal('dictation'),
    id: StepId,
    prompt,
    intro,
    sentence: Text.describe('De zin die wordt voorgelezen; hoofdletters en leestekens tellen mee.'),
    right: Text.describe('Uitleg bij een goed antwoord.'),
    wrong: Text.describe('Uitleg bij een fout antwoord.'),
  })
  .describe('Dictee: luister en typ precies wat je hoort.');

export const EXTRA_STEP_SCHEMAS = [
  SwipeStep,
  MorphStep,
  TimelineStep,
  SpeedStep,
  TrainStep,
  HighlightStep,
  ConjunctionStep,
  ClampStep,
  RefsStep,
  LadderStep,
  AmbiguityStep,
  ChatStep,
  ToneStep,
  IntentStep,
  ScaleStep,
  StackStep,
  ProofreadStep,
  BetStep,
  DictationStep,
] as const;

/** Bouwstenen die ook andere reeksen oefenvormen gebruiken. */
export { Done, Person, Segment, StepId, Text, intro, issue, prompt, unique };
