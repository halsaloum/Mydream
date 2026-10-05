import { z } from 'zod';
import { AccentSchema } from './accent';
import { EXTRA_STEP_SCHEMAS } from './kinds';
import { ARGUMENT_STEP_SCHEMAS } from './kinds-argument';
import { parseBracket, spanText } from './bracket';
import { canWin, winsAlone } from './tableau';
import { hasBalancedEmphasis, isPermutationJoin, tokenize } from './text';
import { DIPHTHONGS, VOWELS } from './vowels';

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

/** Hoe diep een les gaat: van de basis tot het niveau van een masteropleiding taalwetenschap. */
export const STAGES = ['basis', 'bachelor', 'master'] as const;

const Text = z.string().regex(/\S/, 'Mag niet leeg zijn');
const Rich = Text.refine(hasBalancedEmphasis, 'Markeringen met * moeten in paren voorkomen').describe('Tekst waarin *woord* een taalvoorbeeld markeert.');
const Id = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*$/, 'Gebruik kleine letters, cijfers en koppeltekens')
  .describe('Stabiele sleutel; wijzig niet zodra leerlingen voortgang hebben.');
const StepId = Id.optional().describe('Optionele stabiele sleutel van de stap. Zonder id wordt de positie plus een inhoudsvingerafdruk gebruikt.');

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
    chips: z.array(z.object({ k: Text.describe('Knoptekst'), out: Text.describe('Resultaat'), note: Text.describe('Toelichting') })).min(1),
  })
  .describe('Klikexperiment: kies een knop en zie het resultaat veranderen.');

const QuizSchema = z
  .object({ q: Text, options: z.array(Text).min(2), answer: Text, why: Text })
  .describe('Snelle check binnen de uitleg. De app toont deze als losse meerkeuzevraag direct na de uitleg.');

const SplitSchema = z
  .object({
    q: Text.optional().describe('Opdracht boven het woord; standaard "Knip het woord in lettergrepen".'),
    word: Text,
    answer: Text.describe('Woord met koppeltekens op de knippunten, bv. "bo-men".'),
    note: Text,
  })
  .describe('Knip een woord in stukken: lettergrepen, of bijvoorbeeld grafemen.');

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

const AlphaSchema = z.object({ q: Text, targets: z.array(z.string().regex(/^[a-z]$/)).min(1), note: Text }).describe('Tik de doelletters in het alfabet aan.');

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

const VowelsSchema = z
  .object({
    q: Text.describe('Opdracht, bv. "Tik alle gespannen klinkers".'),
    targets: z.array(z.enum(VOWELS)).min(1).describe('De klinkers (IPA) die gevonden moeten worden.'),
    note: Text,
    glides: z.boolean().optional().describe('Toon ook de drie tweeklanken als glijbewegingen.'),
  })
  .describe('Klinkerkaart: de klinkers op hun plek in de mond. Tik, luister en zoek de gevraagde klinkers.');

const GridSchema = z
  .object({
    q: Text.describe('Opdracht, bv. "Tik alle stemhebbende medeklinkers".'),
    cols: z.array(Text).min(1).max(8).describe('Kolomkoppen, bv. articulatieplaatsen.'),
    rows: z.array(Text).min(1).max(8).describe('Rijkoppen, bv. articulatiewijzen.'),
    cells: z
      .array(
        z.object({
          t: Text.describe('Het teken, bv. "p".'),
          row: z.int().nonnegative(),
          col: z.int().nonnegative(),
          ex: z.string().optional().describe('Voorbeeldwoord, bv. "pak".'),
        }),
      )
      .min(2),
    targets: z.array(Text).min(1).describe('De tekens die gevonden moeten worden.'),
    note: Text,
  })
  .describe('Klanktabel: een tabel zoals de IPA-tabel. Tik alle gevraagde klanken aan.');

const TableauSchema = z
  .object({
    input: Text.describe('De onderliggende vorm, bv. "/hɔnd/".'),
    constraints: z
      .array(z.object({ name: Text, note: Text.describe('Wat de eis verbiedt of vraagt.') }))
      .min(2)
      .max(4)
      .describe('De eisen in de beginvolgorde; links staat de hoogste.'),
    candidates: z
      .array(z.object({ form: Text, marks: z.array(z.int().min(0).max(3)).describe('Overtredingen per eis, in de volgorde van de eisen.') }))
      .min(2)
      .max(4),
    winner: z.int().nonnegative().describe('Index van de kandidaat die moet winnen.'),
    goal: Text.describe('Wat de leerling moet bereiken, bv. "Laat de Nederlandse uitspraak winnen".'),
    note: Text,
  })
  .describe('OT-tableau: zet de eisen in een rangorde waarbij de juiste kandidaat wint.');

/** Sonoriteitsschaal, van laag naar hoog: de hoogte van een klank in de lettergreepberg (1–6). */
export const SONORITY = ['plofklank', 'wrijfklank', 'neusklank', 'l of r', 'glijklank', 'klinker'] as const;

const SonoritySchema = z
  .object({
    q: Text.optional().describe('Opdracht boven de berg; standaard "Knip de berg in lettergrepen".'),
    segs: z
      .array(z.object({ t: Text.describe('De klank, bv. "p" of "aː".'), s: z.int().min(1).max(6).describe('Sonoriteit: 1 plofklank … 6 klinker.') }))
      .min(2)
      .max(10),
    cuts: z.array(z.int().positive()).min(1).describe('Knippunten: na hoeveel klanken een lettergreep eindigt, oplopend.'),
    note: Text,
  })
  .describe('Sonoriteitsberg: de klanken van een woord als staven; knip de berg in lettergrepen.');

/** De plekken in een lettergreep, in volgorde. De appendix hangt buiten de rijm, aan de rand. */
export const SYLLABLE_ROLES = ['onset', 'kern', 'coda', 'appendix'] as const;

const TreeSchema = z
  .object({
    q: Text.optional().describe('Opdracht boven de boom; standaard "Hang elke klank in de boom".'),
    segs: z
      .array(z.object({ t: Text, role: z.enum(SYLLABLE_ROLES) }))
      .min(2)
      .max(8)
      .describe('De klanken van één lettergreep, met hun plek.'),
    note: Text,
  })
  .describe('Lettergreepboom: kies een tak (onset, kern, coda) en hang de klanken eraan.');

const BracketSchema = z
  .object({
    q: Text.optional().describe('Opdracht boven de woordboom; standaard "Bouw het woord van binnen naar buiten".'),
    tree: Text.describe('De boom in haakjes, bv. "[[on [eet baar]] heid]": elk paar haakjes bevat precies twee stukken.'),
    words: z.boolean().optional().describe('De bladeren zijn hele woorden, bv. "[het [rode boek]]": knopen heten dan "rode boek", met spaties.'),
    nodes: z
      .array(
        z.object({
          w: Text.describe('De woorddelen van deze knoop aan elkaar, bv. "eetbaar" (bij words: met spaties, "rode boek").'),
          form: Text.optional().describe('Hoe het stuk geschreven wordt als dat anders is, bv. "balletje".'),
          cat: Text.describe('Woordsoort of soort stuk, bv. "bn".'),
          note: Text.describe('Wat er bij deze stap gebeurt.'),
        }),
      )
      .min(1)
      .describe('Eén regel per samengestelde knoop van de boom.'),
    traps: z
      .array(z.object({ w: Text.describe('Een verkeerde plakstap, bv. "oneet".'), note: Text.describe('Waarom die niet kan.') }))
      .optional()
      .describe('Uitleg bij verleidelijke verkeerde stappen.'),
    note: Text,
  })
  .describe('Woordboom: plak steeds twee buren aan elkaar tot het hele woord staat, in de volgorde van de boom.');

const PhraseSpan = z
  .tuple([z.int().nonnegative(), z.int().nonnegative()])
  .describe('Eerste en laatste woord van de groep (indexen op spaties, vanaf 0, beide inclusief).');

const PhraseSchema = z
  .object({
    q: Text.optional().describe('Opdracht boven de zin; standaard "Vind de woordgroepen".'),
    sentence: Text,
    groups: z
      .array(
        z.object({
          span: PhraseSpan,
          cat: Text.describe('Soort groep, bv. "naamwoordgroep".'),
          head: z.int().nonnegative().describe('Index van de kern; ligt binnen de groep.'),
          note: Text.describe('Uitleg zodra de groep gevonden is.'),
        }),
      )
      .min(1)
      .describe('De groepen die gevonden moeten worden.'),
    traps: z
      .array(z.object({ span: PhraseSpan, note: Text.describe('Waarom dit stuk geen groep is.') }))
      .optional()
      .describe('Verleidelijke stukken die geen woordgroep zijn.'),
    note: Text,
  })
  .describe('Groepenjager: tik het eerste en het laatste woord van een woordgroep; vind alle gevraagde groepen.');

const ParadigmCellSchema = z.union([
  Text.describe('Een vorm die al gegeven is.'),
  z.object({
    fill: Text.describe('De vorm die de leerling moet kiezen.'),
    hint: Text.optional().describe('Tip als er een verkeerde vorm in dit vakje wordt gezet.'),
  }),
]);

const ParadigmSchema = z
  .object({
    q: Text.optional().describe('Opdracht boven de tabel; standaard "Vul het paradigma in".'),
    cols: z.array(Text).min(1).max(5).describe('Kolomkoppen, bv. "verleden tijd" en "voltooid deelwoord".'),
    rows: z
      .array(z.object({ label: Text.describe('Rijkop, bv. het hele werkwoord.'), cells: z.array(ParadigmCellSchema).min(1) }))
      .min(1)
      .max(8),
    extra: z.array(Text).optional().describe('Vormen die nergens passen; ze staan tussen de keuzes als valkuil.'),
    note: Text,
  })
  .describe('Paradigma: een tabel met lege vakjes. Kies een vakje en zet de goede vorm erin.');

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
    vowels: VowelsSchema.optional(),
    grid: GridSchema.optional(),
    tableau: TableauSchema.optional(),
    sonority: SonoritySchema.optional(),
    tree: TreeSchema.optional(),
    bracket: BracketSchema.optional(),
    paradigm: ParadigmSchema.optional(),
    phrase: PhraseSchema.optional(),
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
    if (panel.vowels) {
      const { targets, glides } = panel.vowels;
      if (!unique(targets)) issue(ctx, ['vowels', 'targets'], 'Klinkers staan dubbel');
      targets.forEach((target, i) => {
        if (!glides && DIPHTHONGS.includes(target)) issue(ctx, ['vowels', 'targets', i], 'Een tweeklank vinden kan alleen met glides: true');
      });
    }
    if (panel.grid) {
      const { cols, rows, cells, targets } = panel.grid;
      if (!unique(cells.map((cell) => cell.t))) issue(ctx, ['grid', 'cells'], 'Tekens moeten uniek zijn');
      cells.forEach((cell, i) => {
        if (cell.row >= rows.length) issue(ctx, ['grid', 'cells', i, 'row'], `Rij ${cell.row} bestaat niet`);
        if (cell.col >= cols.length) issue(ctx, ['grid', 'cells', i, 'col'], `Kolom ${cell.col} bestaat niet`);
      });
      if (!unique(targets)) issue(ctx, ['grid', 'targets'], 'Tekens staan dubbel');
      targets.forEach((target, i) => {
        if (!cells.some((cell) => cell.t === target)) issue(ctx, ['grid', 'targets', i], `"${target}" staat niet in de tabel`);
      });
    }
    if (panel.sonority) {
      const { segs, cuts } = panel.sonority;
      cuts.forEach((cut, i) => {
        if (cut >= segs.length) issue(ctx, ['sonority', 'cuts', i], `Knippunt ${cut} valt buiten het woord (${segs.length} klanken)`);
        if (i > 0 && cut <= (cuts[i - 1] ?? 0)) issue(ctx, ['sonority', 'cuts', i], 'Knippunten moeten oplopen');
      });
    }
    if (panel.tree) {
      const roles = panel.tree.segs.map((seg) => SYLLABLE_ROLES.indexOf(seg.role));
      if (!roles.includes(1)) issue(ctx, ['tree', 'segs'], 'Een lettergreep heeft een kern');
      roles.forEach((role, i) => {
        if (i > 0 && role < (roles[i - 1] ?? 0)) issue(ctx, ['tree', 'segs', i, 'role'], 'Volgorde is onset, kern, coda, appendix');
      });
    }
    if (panel.bracket) {
      const { tree: source, nodes, traps } = panel.bracket;
      const tree = parseBracket(source);
      if (!tree) issue(ctx, ['bracket', 'tree'], 'Geen geldige boom: elk paar haakjes bevat precies twee stukken');
      else {
        const expected = tree.nodes.map((node) => spanText(tree, node, panel.bracket?.words));
        if (!unique(expected)) issue(ctx, ['bracket', 'tree'], 'Twee knopen hebben dezelfde letters');
        const given = nodes.map((node) => node.w);
        if (!unique(given)) issue(ctx, ['bracket', 'nodes'], 'Knopen staan dubbel');
        expected.forEach((w) => {
          if (!given.includes(w)) issue(ctx, ['bracket', 'nodes'], `Knoop "${w}" heeft geen uitleg`);
        });
        given.forEach((w, i) => {
          if (!expected.includes(w)) issue(ctx, ['bracket', 'nodes', i, 'w'], `"${w}" is geen knoop van de boom`);
        });
        traps?.forEach((trap, i) => {
          if (expected.includes(trap.w)) issue(ctx, ['bracket', 'traps', i, 'w'], `"${trap.w}" is juist een goede stap`);
        });
      }
    }
    if (panel.paradigm) {
      const { cols, rows, extra } = panel.paradigm;
      if (!unique(cols)) issue(ctx, ['paradigm', 'cols'], 'Kolomkoppen moeten uniek zijn');
      if (!unique(rows.map((row) => row.label))) issue(ctx, ['paradigm', 'rows'], 'Rijkoppen moeten uniek zijn');
      rows.forEach((row, i) => {
        if (row.cells.length !== cols.length) issue(ctx, ['paradigm', 'rows', i, 'cells'], `Verwacht ${cols.length} vakjes`);
      });
      const answers = rows.flatMap((row) => row.cells.flatMap((cell) => (typeof cell === 'string' ? [] : [cell.fill])));
      if (answers.length === 0) issue(ctx, ['paradigm', 'rows'], 'Er is geen vakje om in te vullen');
      if (extra && !unique(extra)) issue(ctx, ['paradigm', 'extra'], 'Valkuilen staan dubbel');
      extra?.forEach((form, i) => {
        if (answers.includes(form)) issue(ctx, ['paradigm', 'extra', i], `"${form}" is juist een goed antwoord`);
      });
    }
    if (panel.phrase) {
      const { sentence, groups, traps } = panel.phrase;
      const count = tokenize(sentence).length;
      const key = ([from, to]: readonly [number, number]) => `${from}-${to}`;
      const checkSpan = (span: readonly [number, number], path: (string | number)[]) => {
        if (span[0] > span[1]) issue(ctx, path, 'Het eerste woord staat na het laatste');
        if (span[1] >= count) issue(ctx, path, `Index ${span[1]} valt buiten de zin (${count} woorden)`);
      };
      groups.forEach((group, i) => {
        checkSpan(group.span, ['phrase', 'groups', i, 'span']);
        if (group.head < group.span[0] || group.head > group.span[1]) issue(ctx, ['phrase', 'groups', i, 'head'], 'De kern ligt buiten de groep');
      });
      if (!unique(groups.map((group) => key(group.span)))) issue(ctx, ['phrase', 'groups'], 'Groepen staan dubbel');
      traps?.forEach((trap, i) => {
        checkSpan(trap.span, ['phrase', 'traps', i, 'span']);
        if (groups.some((group) => key(group.span) === key(trap.span))) issue(ctx, ['phrase', 'traps', i, 'span'], 'Dit stuk is juist een groep');
      });
    }
    if (panel.tableau) {
      const { constraints, candidates, winner } = panel.tableau;
      const marks = candidates.map((candidate) => candidate.marks);
      if (!unique(constraints.map((constraint) => constraint.name))) issue(ctx, ['tableau', 'constraints'], 'Eisen moeten uniek zijn');
      if (!unique(candidates.map((candidate) => candidate.form))) issue(ctx, ['tableau', 'candidates'], 'Kandidaten moeten uniek zijn');
      candidates.forEach((candidate, i) => {
        if (candidate.marks.length !== constraints.length) issue(ctx, ['tableau', 'candidates', i, 'marks'], `Verwacht ${constraints.length} getallen`);
      });
      if (winner >= candidates.length) issue(ctx, ['tableau', 'winner'], 'Deze kandidaat bestaat niet');
      else if (candidates.every((candidate) => candidate.marks.length === constraints.length)) {
        if (!canWin(marks, winner)) issue(ctx, ['tableau', 'winner'], 'Bij geen enkele rangorde wint deze kandidaat');
        else if (
          winsAlone(
            marks,
            constraints.map((_, i) => i),
            winner,
          )
        )
          issue(ctx, ['tableau', 'constraints'], 'De beginvolgorde is al de oplossing');
      }
    }
  });

/** Een tekstcontrole: hele woorden of een reguliere expressie. Vanggroepen in een expressie zijn het "gevonden" signaalwoord. */
const TextTestSchema = z
  .union([
    z.object({ anyWord: z.array(Text).min(1).describe('Minstens één van deze hele woorden (hoofdletterongevoelig).') }),
    z.object({
      pattern: Text.describe('Reguliere expressie (JavaScript-syntaxis). Vanggroepen worden als gevonden woord getoond.'),
      flags: z
        .string()
        .regex(/^[imsu]*$/, 'Alleen de vlaggen i, m, s en u')
        .optional(),
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
  parts: z
    .array(z.object({ role: Text, text: Text }))
    .min(2)
    .describe('Zinnen in de juiste volgorde; de app schudt ze.'),
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

export const StageSchema = z.enum(STAGES).describe('Diepte: basis, bachelor of master. Lessen zonder stap tonen geen label.');

export const LessonSchema = z.object({
  id: Id,
  title: Text,
  skill: SkillSchema,
  stage: StageSchema.optional(),
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
export type LessonInput = z.input<typeof LessonSchema>;
export type Stage = z.infer<typeof StageSchema>;
export type LayerExample = z.infer<typeof LayerExampleSchema>;
export type Layer = z.infer<typeof LayerSchema>;
export type Domain = z.infer<typeof DomainSchema>;
export type CoursePack = z.infer<typeof CoursePackSchema>;
export type CoursePackInput = z.input<typeof CoursePackSchema>;
