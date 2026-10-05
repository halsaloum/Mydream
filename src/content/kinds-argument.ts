import { z } from 'zod';
import { Done, Person, Segment, StepId, Text, intro, issue, prompt, unique } from './kinds';

/**
 * Oefenvormen uit "Interactieve lessen – j": argumenteren ("Overtuigen in één alinea") en
 * drogredenen herkennen. Zelfde uitgangspunten als de andere vormen: JSON-serialiseerbaar,
 * alle lesteksten in de inhoud, en semantische controles zodat een les uit een PDF niet pas
 * in de app blijkt te haperen.
 */

const Id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'Kleine letters, cijfers en koppeltekens');
const Index = z.int().nonnegative();

/** Een foute keuze met de naam van de valkuil (bv. "cirkelredenering"). */
const Trap = z.object({
  t: Text,
  ok: z.literal(false).optional(),
  trap: Text.describe('Naam van de valkuil, getoond na een foute keuze.'),
  why: Text.describe('Waarom deze keuze niet werkt.'),
});
/** De goede keuze. */
const Right = z.object({ t: Text, ok: z.literal(true), why: Text.describe('Waarom dit wel werkt.') });

/** Precies één goede keuze, met unieke teksten. */
function checkChoices(options: readonly { t: string; ok?: boolean }[], ctx: z.RefinementCtx, path: (string | number)[]) {
  const right = options.filter((option) => option.ok === true).length;
  if (right !== 1) issue(ctx, path, `Precies één goede keuze nodig (nu ${right})`);
  if (!unique(options.map((option) => option.t))) issue(ctx, path, 'Keuzes moeten uniek zijn');
}

const noFinalStop = (text: string) => !/[.!?]\s*$/.test(text);

/* ------------------------------------------------------------------ want of dus */

const ReasonSentence = z
  .object({
    lead: Text.describe('Vorm aan het begin van de zin (met hoofdletter), zonder punt.'),
    mid: Text.describe('Vorm na het signaalwoord (meestal zonder hoofdletter), zonder punt.'),
  })
  .describe('Eén zin in twee vormen, zodat hij zowel voorop als na "want" of "dus" kan staan.');

export const ReasonStep = z
  .object({
    kind: z.literal('reason'),
    id: StepId,
    prompt,
    intro,
    pairs: z
      .array(
        z.object({
          claim: ReasonSentence.describe('Het standpunt.'),
          reason: ReasonSentence.describe('Het argument.'),
          bad: Text.describe('Uitleg bij een onlogische combinatie.'),
          start: z
            .object({ top: z.enum(['claim', 'reason']), word: z.enum(['want', 'dus']) })
            .describe('Beginstand: welke zin bovenaan staat en welk signaalwoord gekozen is.'),
        }),
      )
      .min(1),
    done: Done.optional(),
  })
  .describe('Want of dus: zet standpunt en argument in de goede volgorde met het goede signaalwoord. Elk paar kan op twee manieren.')
  .superRefine((step, ctx) => {
    step.pairs.forEach((pair, i) => {
      for (const part of ['claim', 'reason'] as const) {
        const { lead, mid } = pair[part];
        if (lead.toLocaleLowerCase('nl') !== mid.toLocaleLowerCase('nl')) issue(ctx, ['pairs', i, part], 'Beide vormen moeten dezelfde zin zijn (alleen hoofdletters verschillen)');
        if (!noFinalStop(lead) || !noFinalStop(mid)) issue(ctx, ['pairs', i, part], 'Zonder slotteken: de app zet de komma en punt');
      }
    });
  });

/* ------------------------------------------------------------------ onderbouwen */

export const SUPPORT_ROLES = ['argument', 'uitleg', 'voorbeeld', 'feit'] as const;

export const SupportStep = z
  .object({
    kind: z.literal('support'),
    id: StepId,
    prompt,
    intro,
    claim: Text.describe('Het standpunt dat onderbouwd moet worden.'),
    levels: z
      .array(
        z.object({
          ask: Text.describe('De vraag van de lezer, bv. "Waarom moet dat?".'),
          options: z
            .array(
              z.union([
                Right.extend({
                  role: z.enum(SUPPORT_ROLES).describe('Wat dit antwoord toevoegt; "feit" is vaste grond.'),
                  text: Text.describe('Het antwoord als zin in de alinea.'),
                }),
                Trap,
              ]),
            )
            .min(2),
        }),
      )
      .min(1)
      .describe('Doorvragen, van standpunt tot vaste grond.'),
    paragraph: z.string().optional().describe('De alinea die zo ontstaat, getoond na afloop.'),
    done: Done.optional(),
  })
  .describe('Onderbouwen: vraag door tot je op vaste grond staat.')
  .superRefine((step, ctx) => {
    step.levels.forEach((level, i) => checkChoices(level.options, ctx, ['levels', i, 'options']));
  });

/* ------------------------------------------------------------------ bewijsbalk */

export const EvidenceStep = z
  .object({
    kind: z.literal('evidence'),
    id: StepId,
    prompt,
    intro,
    rows: z
      .array(
        z.object({
          before: z.string().describe('Tekst voor het kieswoord.'),
          after: z.string().describe('Tekst na het kieswoord.'),
          evidence: Text.describe('Wat de schrijver werkelijk weet.'),
          total: z.int().positive().describe('Hoeveel er in totaal zijn.'),
          known: Index.describe('Waarvoor het bewijs geldt.'),
          max: Text.describe('Uiteinde van de balk, bv. "alle 40 huishoudens".'),
          options: z
            .array(
              z.object({
                w: Text.describe('Het kieswoord, bv. "De meeste".'),
                need: Index.describe('Hoeveel er minstens moeten zijn om de zin waar te maken.'),
                says: Text.describe('Wat de zin dan belooft, bv. "meer dan de helft".'),
                why: Text,
              }),
            )
            .min(2),
          best: Index.describe('Het sterkste woord dat het bewijs nog dekt.'),
          start: Index.describe('Beginkeuze.'),
        }),
      )
      .min(1),
    closing: z.string().optional().describe('Slotzin van de alinea.'),
    done: Done.optional(),
  })
  .describe('Bewijsbalk: kies per zin hoe ver je bewering mag gaan.')
  .superRefine((step, ctx) => {
    step.rows.forEach((row, i) => {
      const path = ['rows', i];
      if (row.known > row.total) issue(ctx, [...path, 'known'], 'Bewijs kan niet groter zijn dan het totaal');
      if (!unique(row.options.map((option) => option.w))) issue(ctx, [...path, 'options'], 'Kieswoorden moeten uniek zijn');
      row.options.forEach((option, k) => {
        if (option.need > row.total) issue(ctx, [...path, 'options', k, 'need'], 'Kan niet groter zijn dan het totaal');
      });
      if (row.best >= row.options.length) issue(ctx, [...path, 'best'], 'Bestaat niet');
      if (row.start >= row.options.length) issue(ctx, [...path, 'start'], 'Bestaat niet');
      const covered = row.options.map((option, k) => ({ k, need: option.need })).filter((option) => option.need <= row.known);
      const strongest = covered.sort((a, b) => b.need - a.need)[0];
      if (!strongest) issue(ctx, [...path, 'options'], 'Geen enkel woord wordt door het bewijs gedekt');
      else if (strongest.k !== row.best) issue(ctx, [...path, 'best'], `Het sterkste gedekte woord is "${row.options[strongest.k]?.w}"`);
    });
  });

/* ------------------------------------------------------------------ ja, maar */

export const RebutStep = z
  .object({
    kind: z.literal('rebut'),
    id: StepId,
    prompt,
    intro,
    base: Text.describe('Het begin van de alinea: het voorstel.'),
    speaker: Person.describe('Wie de bezwaren maakt.'),
    rounds: z
      .array(
        z.object({
          objection: Text.describe('Het bezwaar, bv. "Ja, maar …".'),
          options: z
            .array(
              z.union([
                Right.extend({
                  concede: Text.describe('Het deel dat toegeeft wat klopt.'),
                  rebut: Text.describe('Het deel dat weerlegt.'),
                }),
                Trap,
              ]),
            )
            .min(2),
        }),
      )
      .min(1)
      .max(4),
    reply: Text.describe('Reactie van de spreker als alle bezwaren weerlegd zijn.'),
    done: Done.optional(),
  })
  .describe('Ja, maar: geef toe wat klopt en weerleg het bezwaar.')
  .superRefine((step, ctx) => {
    step.rounds.forEach((round, i) => {
      checkChoices(round.options, ctx, ['rounds', i, 'options']);
      round.options.forEach((option, k) => {
        if (option.ok === true && `${option.concede} ${option.rebut}` !== option.t)
          issue(ctx, ['rounds', i, 'options', k], 'De tekst moet bestaan uit "concede" + spatie + "rebut"');
      });
    });
  });

/* ------------------------------------------------------------------ stroman */

export const StrawmanStep = z
  .object({
    kind: z.literal('strawman'),
    id: StepId,
    prompt,
    intro,
    original: z
      .object({
        author: Text,
        segs: z.array(z.object({ t: z.string(), id: Id.optional().describe('Woord dat verdraaid wordt.') })).min(1),
      })
      .describe('Wat er echt geschreven is.'),
    response: z
      .object({
        author: Text,
        chunks: z
          .array(
            z.object({
              t: Text,
              twist: Id.optional().describe('Id van het echte woord dat hier verdraaid wordt; leeg = niet verdraaid.'),
              was: z.string().optional().describe('Wat er echt stond, bv. "Mila schreef: korter".'),
              why: Text,
            }),
          )
          .min(2),
      })
      .describe('De reactie, in stukken die de leerling kan aantikken.'),
    options: z
      .array(
        z.union([
          Right.extend({
            restate: Text.describe('Eerlijke weergave van wat de ander schreef.'),
            reply: Text.describe('De eigen reactie daarop.'),
          }),
          Trap,
        ]),
      )
      .min(2),
    done: Done.optional(),
  })
  .describe('Stroman: vind wat er verdraaid is en kies de eerlijke reactie.')
  .superRefine((step, ctx) => {
    const ids = step.original.segs.flatMap((seg) => (seg.id ? [seg.id] : []));
    if (!unique(ids)) issue(ctx, ['original', 'segs'], 'Id’s moeten uniek zijn');
    const twists = step.response.chunks.flatMap((chunk) => (chunk.twist ? [chunk.twist] : []));
    if (twists.length === 0) issue(ctx, ['response', 'chunks'], 'Minstens één verdraaiing nodig');
    if (!unique(twists)) issue(ctx, ['response', 'chunks'], 'Elk woord wordt maar één keer verdraaid');
    step.response.chunks.forEach((chunk, i) => {
      if (chunk.twist && !ids.includes(chunk.twist)) issue(ctx, ['response', 'chunks', i, 'twist'], `Onbekend woord "${chunk.twist}"`);
      if (chunk.twist && !chunk.was?.trim()) issue(ctx, ['response', 'chunks', i, 'was'], 'Zeg wat er echt stond');
    });
    checkChoices(step.options, ctx, ['options']);
    step.options.forEach((option, k) => {
      if (option.ok === true && `${option.restate} ${option.reply}` !== option.t) issue(ctx, ['options', k], 'De tekst moet bestaan uit "restate" + spatie + "reply"');
    });
  });

/* ------------------------------------------------------------------ hellend vlak */

export const SlopeStep = z
  .object({
    kind: z.literal('slope'),
    id: StepId,
    prompt,
    intro,
    steps: z.array(Text).min(3).describe('De redenering, stap voor stap; de eerste stap is het voorstel.'),
    links: z
      .array(z.object({ holds: z.boolean().describe('Volgt deze stap echt uit de vorige?'), why: Text, hint: Text.describe('Hulp na een verkeerd oordeel.') }))
      .describe('Eén schakel tussen elke twee stappen.'),
    summary: Text.describe('Conclusie na het laatste oordeel.'),
    options: z
      .array(z.union([Right.extend({ segs: z.array(Segment).min(1).describe('De eerlijke versie, met afgezwakte of na te tellen woorden uitgelicht.') }), Trap]))
      .min(2),
    done: Done.optional(),
  })
  .describe('Hellend vlak: volgt elke stap echt uit de vorige? Schrijf daarna de eerlijke versie.')
  .superRefine((step, ctx) => {
    if (step.links.length !== step.steps.length - 1) issue(ctx, ['links'], `Verwacht ${step.steps.length - 1} schakels`);
    if (step.links.every((link) => link.holds)) issue(ctx, ['links'], 'Een hellend vlak heeft minstens één schakel die niet volgt');
    checkChoices(step.options, ctx, ['options']);
    step.options.forEach((option, k) => {
      if (option.ok === true && option.segs.map((seg) => seg.t).join('') !== option.t) issue(ctx, ['options', k, 'segs'], 'De stukken moeten samen de tekst vormen');
    });
  });

/* ------------------------------------------------------------------ vals dilemma */

export const DilemmaStep = z
  .object({
    kind: z.literal('dilemma'),
    id: StepId,
    prompt,
    intro,
    source: z.object({ label: Text, segs: z.array(Segment).min(1) }).describe('De tekst met het dilemma; het dilemma zelf uitgelicht.'),
    horns: z.tuple([Text, Text]).describe('De twee wegen die de schrijver noemt.'),
    candidates: z
      .array(z.union([Right.extend({ sign: Text.describe('Korte naam op de wegwijzer.') }), Trap]))
      .min(2)
      .describe('Mogelijke andere wegen.'),
    options: z.array(z.union([Right, Trap])).min(2).describe('De eerlijke versie kiezen.'),
    done: Done.optional(),
  })
  .describe('Vals dilemma: zet de wegen erbij die de schrijver verzwijgt.')
  .superRefine((step, ctx) => {
    if (!step.candidates.some((candidate) => candidate.ok === true)) issue(ctx, ['candidates'], 'Minstens één andere weg nodig');
    if (!unique(step.candidates.map((candidate) => candidate.t))) issue(ctx, ['candidates'], 'Keuzes moeten uniek zijn');
    checkChoices(step.options, ctx, ['options']);
  });

/* ------------------------------------------------------------------ keuring */

export const InspectStep = z
  .object({
    kind: z.literal('inspect'),
    id: StepId,
    prompt,
    intro,
    heading: z.string().optional().describe('Kop boven de tekst, bv. "Haar alinea".'),
    fine: Text.describe('Oordeel voor een zin zonder drogreden, bv. "houdt stand".'),
    fallacies: z.array(Text).min(1).describe('Drogredenen waaruit de leerling kiest.'),
    rows: z
      .array(
        z.union([
          z.object({
            t: Text,
            fallacy: Text.describe('Welke drogreden; moet in "fallacies" staan.'),
            why: Text,
            hint: Text,
            fixes: z.array(z.union([Right, z.object({ t: Text, ok: z.literal(false).optional(), why: Text })])).min(2),
          }),
          z.object({ t: Text, role: Text.describe('Wat de zin doet, bv. "standpunt" of "feit".'), why: Text, hint: Text }),
        ]),
      )
      .min(2),
    done: Done.optional(),
  })
  .describe('Keuring: beoordeel elke zin en vervang de drogredenen door een eerlijke zin.')
  .superRefine((step, ctx) => {
    if (!unique([step.fine, ...step.fallacies])) issue(ctx, ['fallacies'], 'Oordelen moeten uniek zijn');
    const flawed = step.rows.filter((row) => 'fallacy' in row);
    if (flawed.length === 0) issue(ctx, ['rows'], 'Minstens één zin met een drogreden nodig');
    step.rows.forEach((row, i) => {
      if (!('fallacy' in row)) return;
      if (!step.fallacies.includes(row.fallacy)) issue(ctx, ['rows', i, 'fallacy'], `Onbekende drogreden "${row.fallacy}"`);
      checkChoices(row.fixes, ctx, ['rows', i, 'fixes']);
    });
  });

export const ARGUMENT_STEP_SCHEMAS = [ReasonStep, SupportStep, EvidenceStep, RebutStep, StrawmanStep, SlopeStep, DilemmaStep, InspectStep] as const;
