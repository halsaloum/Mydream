import { z } from 'zod';
import { AccentSchema } from './accent';
import { EXTRA_STEP_SCHEMAS } from './kinds';
import { ARGUMENT_STEP_SCHEMAS } from './kinds-argument';
import { hasBalancedEmphasis, isPermutationJoin, tokenize } from './text';

export { ACCENTS, AccentSchema, type Accent } from './accent';

/**
 * Het inhoudscontract van pennig.
 *
 * Elke cursus (nu: de bestaande bouwlagen, straks: lessen uitgewerkt uit PDF's) wordt als één
 * `CoursePack` aangeleverd en bij het laden met dit schema gevalideerd. Het formaat is
 * JSON-serialiseerbaar, zodat lessen ook als `.json` kunnen worden aangeleverd.
 * Een JSON Schema-versie staat in `content/schema/course-pack.schema.json`.
 *
 * Presentatie (kleuren, iconen, animatie) zit niet in dit contract; alleen semantische
 * accentnamen. Beoordeling zit in `src/engine`, voortgang in `src/state`.
 */

export const SCHEMA_VERSION = 1 as const;

export const SKILLS = ['Spelling', 'Woorden', 'Zinsbouw', 'Complex', 'Alinea'] as const;

const Text = z.string().regex(/\S/, 'Mag niet leeg zijn');
const Rich = Text.refine(hasBalancedEmphasis, 'Markeringen met * moeten in paren voorkomen').describe(
  'Tekst waarin *woord* een taalvoorbeeld markeert.',
);
const Id = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*$/, 'Gebruik kleine letters, cijfers en koppeltekens')
  .describe('Stabiele sleutel; wijzig niet zodra leerlingen voortgang hebben.');
const StepId = Id.optional().describe(
  'Optionele stabiele sleutel van de stap. Zonder id wordt de positie plus een inhoudsvingerafdruk gebruikt.',
);

export const SkillSchema = z.enum(SKILLS);

const unique = (values: readonly string[]) => new Set(values).size === values.length;

function issue(ctx: z.RefinementCtx, path: (string | number)[], message: string) {
  ctx.addIssue({ code: 'custom', message, path });
}

export const ExampleSchema = z.object({
  wrong: z.string().optional().describe('Foute vorm (doorgestreept getoond).'),
  right: Text.describe('Juiste vorm.'),
});

const LabSchema = z
  .object({
    label: Text.describe('Opdrachtzin boven de knoppen, bv. "Tik een woord".'),
    chips: z
      .array(z.object({ k: Text.describe('Knoptekst'), out: Text.describe('Resultaat'), note: Text.describe('Toelichting') }))
      .min(1),
  })
  .describe('Klikexperiment: kies een knop en zie het resultaat veranderen.');

const QuizSchema = z
  .object({ q: Text, options: z.array(Text).min(2), answer: Text, why: Text })
  .describe('Snelle check binnen de uitleg. De app toont deze als losse meerkeuzevraag direct na de uitleg.');

const SplitSchema = z
  .object({ word: Text, answer: Text.describe('Woord met koppeltekens op de knippunten, bv. "bo-men".'), note: Text })
  .describe('Knip een woord in lettergrepen.');

const MarkSchema = z
  .object({
    q: Text,
    sentence: Text,
    targets: z.array(z.int().nonnegative()).min(1).describe('Indexen van de doelwoorden; woorden worden op spaties geteld, vanaf 0.'),
    note: Text,
  })
  .describe('Tik alle doelwoorden in een zin aan.');

const BuildSchema = z
  .object({
    before: z.string().optional(),
    stem: Text,
    endings: z.array(z.string()).min(2).describe('Keuzes; een lege string betekent "niets erachter".'),
    answer: z.string(),
    note: Text,
  })
  .describe('Plak de juiste uitgang achter een stam.');

const AlphaSchema = z
  .object({ q: Text, targets: z.array(z.string().regex(/^[a-z]$/)).min(1), note: Text })
  .describe('Tik de doelletters in het alfabet aan.');

const WheelSchema = z
  .object({
    start: z.string(),
    end: z.string(),
    options: z.array(z.object({ v: Text, mean: z.string().optional().describe('Betekenis; leeg = geen bestaand woord.') })).min(2),
    need: z.int().positive().describe('Aantal bestaande woorden dat gevonden moet worden.'),
    note: Text,
  })
  .describe('Klinkerwiel: wissel de middelste letter en ontdek welke woorden bestaan.');

const BlendSchema = z
  .object({
    letters: z.array(z.string().min(1)).min(2),
    pairs: z.array(z.object({ s: Text, ex: Text })).min(1),
    note: Text,
  })
  .describe('Combineer twee letters tot één klank.');

const SwapSchema = z
  .object({
    goal: Text,
    blocks: z.array(Text).min(2).describe('Blokken in de beginvolgorde.'),
    accept: z.array(Text).min(1).describe('Goede volgordes: de blokken gescheiden door één spatie.'),
    note: Text,
  })
  .describe('Wissel blokken tot de zin klopt.');

export const PanelSchema = z
  .object({
    text: Rich,
    rule: Rich.optional().describe('Regelkaart: de kern in één zin.'),
    deep: z.object({ q: Text, a: Rich }).optional().describe('Uitklapbare verdieping.'),
    show: z.array(ExampleSchema).optional(),
    lab: LabSchema.optional(),
    quiz: QuizSchema.optional(),
    split: SplitSchema.optional(),
    mark: MarkSchema.optional(),
    build: BuildSchema.optional(),
    alpha: AlphaSchema.optional(),
    wheel: WheelSchema.optional(),
    blend: BlendSchema.optional(),
    swap: SwapSchema.optional(),
  })
  .superRefine((panel, ctx) => {
    if (panel.lab && !unique(panel.lab.chips.map((chip) => chip.k))) issue(ctx, ['lab', 'chips'], 'Knopteksten moeten uniek zijn');
    if (panel.quiz) {
      if (!unique(panel.quiz.options)) issue(ctx, ['quiz', 'options'], 'Opties moeten uniek zijn');
      if (!panel.quiz.options.includes(panel.quiz.answer)) issue(ctx, ['quiz', 'answer'], 'Antwoord staat niet tussen de opties');
    }
    if (panel.split) {
      const { word, answer } = panel.split;
      if (!answer.includes('-') || answer.replaceAll('-', '') !== word || /--|^-|-$/.test(answer))
        issue(ctx, ['split', 'answer'], 'Antwoord moet het woord zijn met koppeltekens op de knippunten');
    }
    if (panel.mark) {
      const count = tokenize(panel.mark.sentence).length;
      if (!unique(panel.mark.targets.map(String))) issue(ctx, ['mark', 'targets'], 'Doelwoorden staan dubbel');
      panel.mark.targets.forEach((target, i) => {
        if (target >= count) issue(ctx, ['mark', 'targets', i], `Index ${target} valt buiten de zin (${count} woorden)`);
      });
    }
    if (panel.build) {
      if (!unique(panel.build.endings)) issue(ctx, ['build', 'endings'], 'Uitgangen moeten uniek zijn');
      if (!panel.build.endings.includes(panel.build.answer)) issue(ctx, ['build', 'answer'], 'Antwoord staat niet tussen de uitgangen');
    }
    if (panel.alpha && !unique(panel.alpha.targets)) issue(ctx, ['alpha', 'targets'], 'Letters staan dubbel');
    if (panel.wheel) {
      const real = panel.wheel.options.filter((option) => option.mean).length;
      if (!unique(panel.wheel.options.map((option) => option.v))) issue(ctx, ['wheel', 'options'], 'Klinkers moeten uniek zijn');
      if (panel.wheel.need > real) issue(ctx, ['wheel', 'need'], `Er zijn maar ${real} bestaande woorden`);
    }
    if (panel.blend) {
      const { letters, pairs } = panel.blend;
      if (!unique(pairs.map((pair) => pair.s))) issue(ctx, ['blend', 'pairs'], 'Klanken staan dubbel');
      pairs.forEach((pair, i) => {
        const formable = letters.some((a, ai) => letters.some((b, bi) => ai !== bi && a + b === pair.s));
        if (!formable) issue(ctx, ['blend', 'pairs', i, 's'], `"${pair.s}" is niet te maken met deze letters`);
      });
    }
    if (panel.swap) {
      const { blocks, accept } = panel.swap;
      if (!unique(blocks)) issue(ctx, ['swap', 'blocks'], 'Blokken moeten uniek zijn');
      accept.forEach((answer, i) => {
        if (!isPermutationJoin(blocks, answer)) issue(ctx, ['swap', 'accept', i], 'Geen volgorde van precies deze blokken');
      });
    }
  });

/** Een tekstcontrole: hele woorden of een reguliere expressie. Vanggroepen in een expressie zijn het "gevonden" signaalwoord. */
const TextTestSchema = z
  .union([
    z.object({ anyWord: z.array(Text).min(1).describe('Minstens één van deze hele woorden (hoofdletterongevoelig).') }),
    z.object({
      pattern: Text.describe('Reguliere expressie (JavaScript-syntaxis). Vanggroepen worden als gevonden woord getoond.'),
      flags: z.string().regex(/^[imsu]*$/, 'Alleen de vlaggen i, m, s en u').optional(),
    }),
  ])
  .superRefine((test, ctx) => {
    if ('pattern' in test) {
      try {
        new RegExp(test.pattern, test.flags);
      } catch {
        issue(ctx, ['pattern'], 'Ongeldige reguliere expressie');
      }
    }
  });

const WriteCriterionSchema = z.object({
  label: Text.describe('Zichtbare taakeis, bv. "Een voorbeeld (bijvoorbeeld, zoals…)".'),
  hint: z.string().optional().describe('Voorbeeldwoorden, getoond zolang de eis nog open staat, bv. "want, omdat".'),
  test: TextTestSchema,
});

const WriteAlarmSchema = z
  .object({
    test: TextTestSchema,
    show: z.string().optional().describe('Hoe het gevonden patroon heet, bv. "of … of"; standaard het gevonden woord.'),
    tip: Text.describe('Een vraag aan de schrijver; geen fout.'),
  })
  .describe('Signaal bij woorden die een drogreden kunnen zijn, zoals "iedereen" of "nooit".');

const prompt = Text.describe('Opdracht boven de oefening.');
const why = Text.describe('Uitleg die na het controleren zichtbaar blijft.');

const ExplainStep = z.object({ kind: z.literal('explain'), id: StepId, title: Text, panels: z.array(PanelSchema).min(1) });
const LearnStep = z.object({ kind: z.literal('learn'), id: StepId, title: Text, body: Rich, example: z.array(ExampleSchema) });
const ChoiceStep = z.object({
  kind: z.literal('choice'),
  id: StepId,
  prompt,
  before: z.string().describe('Zinsdeel vóór het gat (mag leeg).'),
  after: z.string().describe('Zinsdeel na het gat (mag leeg).'),
  options: z.array(Text).min(2),
  answer: Text,
  why,
});
const CombineStep = z.object({
  kind: z.literal('combine'),
  id: StepId,
  prompt,
  a: Text,
  b: Text,
  options: z.array(Text).min(2),
  answer: Text,
  why,
});
const TypeStep = z.object({
  kind: z.literal('type'),
  id: StepId,
  prompt,
  before: z.string(),
  after: z.string(),
  hint: z.string().describe('Plaatshouder in het invulveld.'),
  answer: Text.describe('Juiste invulling; hoofdletters tellen niet mee.'),
  why,
});
const OrderStep = z.object({
  kind: z.literal('order'),
  id: StepId,
  prompt,
  tiles: z.array(Text).min(2),
  answer: Text.describe('De tegels in de goede volgorde, gescheiden door één spatie.'),
  why,
});
const ParagraphStep = z.object({
  kind: z.literal('paragraph'),
  id: StepId,
  prompt,
  parts: z.array(z.object({ role: Text, text: Text })).min(2).describe('Zinnen in de juiste volgorde; de app schudt ze.'),
  why,
});
const SortStep = z.object({
  kind: z.literal('sort'),
  id: StepId,
  prompt,
  buckets: z.array(Text).min(2).max(4),
  items: z.array(z.object({ t: Text, b: z.int().nonnegative().describe('Index van de juiste categorie.') })).min(2),
  why,
});
const FixStep = z.object({
  kind: z.literal('fix'),
  id: StepId,
  prompt,
  sentence: Text,
  wrong: z.int().nonnegative().describe('Index van het foute woord (op spaties geteld, vanaf 0).'),
  answer: Text.describe('Verbetering van dat woord; hoofdletters en leestekens tellen niet mee.'),
  why,
});
const RewriteStep = z.object({
  kind: z.literal('rewrite'),
  id: StepId,
  prompt,
  source: Text,
  accept: z.array(Text).min(1).describe('Alle goede antwoorden.'),
  why,
});
const WriteStep = z.object({
  kind: z.literal('write'),
  id: StepId,
  prompt,
  intro: z.string().optional().describe('Toelichting onder de opdracht.'),
  start: z.string().optional().describe('Begintekst in het schrijfveld.'),
  minWords: z.int().nonnegative(),
  must: z.array(WriteCriterionSchema).describe('Taakeisen die de leerling tijdens het schrijven ziet afvinken.'),
  avoid: z.array(WriteAlarmSchema).optional().describe('Signalen bij mogelijke drogredenen; ze houden de leerling niet tegen.'),
  starters: z.array(Text).optional().describe('Zinsstarters die de leerling met één tik toevoegt.'),
  why,
  done: z.object({ title: Text, text: Text }).optional().describe('Afsluitende feedback; standaard "why".'),
});

export const StepSchema = z
  .discriminatedUnion('kind', [
    ExplainStep,
    LearnStep,
    ChoiceStep,
    CombineStep,
    TypeStep,
    OrderStep,
    ParagraphStep,
    SortStep,
    FixStep,
    RewriteStep,
    WriteStep,
    ...EXTRA_STEP_SCHEMAS,
    ...ARGUMENT_STEP_SCHEMAS,
  ])
  .superRefine((step, ctx) => {
    switch (step.kind) {
      case 'choice':
      case 'combine':
        if (!unique(step.options)) issue(ctx, ['options'], 'Opties moeten uniek zijn');
        if (!step.options.includes(step.answer)) issue(ctx, ['answer'], 'Antwoord staat niet tussen de opties');
        break;
      case 'order':
        if (!isPermutationJoin(step.tiles, step.answer)) issue(ctx, ['answer'], 'Antwoord is geen volgorde van precies deze tegels');
        break;
      case 'paragraph':
        if (!unique(step.parts.map((part) => part.text))) issue(ctx, ['parts'], 'Zinnen moeten uniek zijn');
        break;
      case 'sort':
        if (!unique(step.buckets)) issue(ctx, ['buckets'], 'Categorieën moeten uniek zijn');
        step.items.forEach((item, i) => {
          if (item.b >= step.buckets.length) issue(ctx, ['items', i, 'b'], 'Categorie bestaat niet');
        });
        break;
      case 'fix': {
        const count = tokenize(step.sentence).length;
        if (step.wrong >= count) issue(ctx, ['wrong'], `Index ${step.wrong} valt buiten de zin (${count} woorden)`);
        break;
      }
      default:
        break;
    }
  });

export const LessonSchema = z.object({
  id: Id,
  title: Text,
  skill: SkillSchema,
  icon: Text.describe('Kort teken op de lestegel, bv. "dt" of "¶".'),
  domain: Id.describe('Hoofdvakgebied: verwijst naar een domein-id van de cursus.'),
  also: z.array(Id).optional().describe('Andere vakgebieden die in de les meespelen.'),
  steps: z.array(StepSchema).min(1),
});

export const LayerExampleSchema = z
  .object({
    segments: z
      .array(
        z.object({
          t: Text,
          tag: z.string().optional().describe('Label onder het stuk.'),
          hi: z.boolean().optional().describe('Nieuw op deze laag (uitgelicht).'),
          gap: z.boolean().optional().describe('Scheidingsteken in plaats van een stuk.'),
        }),
      )
      .min(1),
    tip: Text,
  })
  .describe('Het voorbeeld dat door de niveaus groeit, zoals het op dit niveau wordt ontleed.');

export const LayerSchema = z.object({
  id: Id,
  name: Text,
  icon: Text,
  made: Text.describe('Waaruit dit niveau bestaat, bv. "letters rond één klinker".'),
  learn: Text.describe('Wat je op dit niveau leert.'),
  fields: z.array(Id).min(1).describe('Vakgebieden die op dit niveau aan bod komen.'),
  example: Rich.describe('Een kort voorbeeld van dit niveau.'),
  accent: AccentSchema,
  growth: LayerExampleSchema.optional(),
  lessons: z.array(LessonSchema).min(1),
});

export const DomainSchema = z.object({
  id: Id,
  name: Text,
  q: Text.describe('De vraag die het vakgebied stelt, bv. "Hoe klinkt het?".'),
  accent: AccentSchema,
  persp: z.boolean().optional().describe('Een van de vier perspectieven die op elk niveau gelden.'),
});

export const CoursePackSchema = z
  .object({
    schemaVersion: z.literal(SCHEMA_VERSION),
    id: Id,
    title: Text,
    version: Text.describe('Inhoudsversie; verhoog bij inhoudelijke wijzigingen.'),
    domains: z.array(DomainSchema).min(1),
    layers: z.array(LayerSchema).min(1),
  })
  .superRefine((pack, ctx) => {
    const domainIds = pack.domains.map((domain) => domain.id);
    if (!unique(domainIds)) issue(ctx, ['domains'], 'Domein-id’s moeten uniek zijn');
    if (!unique(pack.layers.map((layer) => layer.id))) issue(ctx, ['layers'], 'Laag-id’s moeten uniek zijn');
    const seen = new Set<string>();
    pack.layers.forEach((layer, li) => {
      layer.fields.forEach((field, f) => {
        if (!domainIds.includes(field)) issue(ctx, ['layers', li, 'fields', f], `Onbekend vakgebied "${field}"`);
      });
      layer.lessons.forEach((lesson, i) => {
        if (seen.has(lesson.id)) issue(ctx, ['layers', li, 'lessons', i, 'id'], `Les-id "${lesson.id}" bestaat al`);
        seen.add(lesson.id);
        if (!domainIds.includes(lesson.domain)) issue(ctx, ['layers', li, 'lessons', i, 'domain'], `Onbekend domein "${lesson.domain}"`);
        lesson.also?.forEach((other, a) => {
          if (!domainIds.includes(other)) issue(ctx, ['layers', li, 'lessons', i, 'also', a], `Onbekend vakgebied "${other}"`);
          if (other === lesson.domain) issue(ctx, ['layers', li, 'lessons', i, 'also', a], 'Hoofdvakgebied staat ook bij "also"');
        });
      });
    });
  });

export type Skill = z.infer<typeof SkillSchema>;
export type Example = z.infer<typeof ExampleSchema>;
export type Panel = z.infer<typeof PanelSchema>;
export type Step = z.infer<typeof StepSchema>;
export type StepInput = z.input<typeof StepSchema>;
export type StepKind = Step['kind'];
export type StepOf<K extends StepKind> = Extract<Step, { kind: K }>;
export type WriteCriterion = z.infer<typeof WriteCriterionSchema>;
export type TextTest = z.infer<typeof TextTestSchema>;
export type WriteAlarm = z.infer<typeof WriteAlarmSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type LayerExample = z.infer<typeof LayerExampleSchema>;
export type Layer = z.infer<typeof LayerSchema>;
export type Domain = z.infer<typeof DomainSchema>;
export type CoursePack = z.infer<typeof CoursePackSchema>;
export type CoursePackInput = z.input<typeof CoursePackSchema>;
