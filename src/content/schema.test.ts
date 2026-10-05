// @vitest-environment node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { adaptLegacyCourse } from './adapters/legacy';
import { course, lessonEntries, lessonOverview } from './catalog';
import { LESSONS } from './legacy/build';
import { EXTRA_LESSONS, withExtraLessons } from './packs';
import { CoursePackSchema, PanelSchema, STAGES, StepSchema, type CoursePackInput } from './schema';

const SCHEMA_FILE = path.resolve(import.meta.dirname, '../../content/schema/course-pack.schema.json');

function clonePack(): CoursePackInput {
  return structuredClone(adaptLegacyCourse());
}

function firstLesson(pack: CoursePackInput) {
  const lesson = pack.layers[0]?.lessons[0];
  if (!lesson) throw new Error('Geen les gevonden');
  return lesson;
}

const EXTRA_IDS = new Set(Object.values(EXTRA_LESSONS).flatMap((lessons) => lessons.map((lesson) => lesson.id)));
const legacyEntries = lessonEntries.filter((entry) => !EXTRA_IDS.has(entry.lesson.id));

describe('bestaande lesinhoud', () => {
  it('voldoet aan het contract: 9 niveaus, 29 + 96 lessen, 7 vakgebieden waarvan 4 perspectieven', () => {
    expect(course.layers).toHaveLength(9);
    expect(legacyEntries).toHaveLength(29);
    expect(EXTRA_IDS.size).toBe(96);
    expect(lessonEntries).toHaveLength(125);
    expect(course.domains.map((domain) => domain.id)).toEqual(['orth', 'fon', 'morf', 'syn', 'sem', 'prag', 'tekst']);
    expect(course.domains.filter((domain) => domain.persp).map((domain) => domain.id)).toEqual(['morf', 'syn', 'sem', 'prag']);
    expect(course.layers.every((layer) => layer.growth && layer.learn && layer.example && layer.fields.length > 0)).toBe(true);
    expect(lessonEntries.find((entry) => entry.lesson.id === 'k1')?.also.map((domain) => domain.id)).toEqual(['orth']);
  });

  it('volgt dezelfde volgorde als de oorspronkelijke app', () => {
    expect(legacyEntries.map((entry) => entry.lesson.id)).toEqual(LESSONS.map((lesson) => lesson.id));
  });

  it('laat de inhoud ongewijzigd; alleen schrijfcriteria krijgen een JSON-vorm', () => {
    LESSONS.forEach((legacy, i) => {
      const adapted = legacyEntries[i]?.lesson;
      expect(adapted?.title).toBe(legacy.title);
      expect(adapted?.also).toEqual(legacy.also);
      legacy.steps.forEach((step, s) => {
        const copy = adapted?.steps[s];
        if (step.kind === 'write' && copy?.kind === 'write') {
          expect({ ...copy, must: undefined }).toEqual({ ...step, must: undefined });
          step.must.forEach((criterion, c) => {
            const test = copy.must[c]?.test;
            expect(test && 'pattern' in test ? new RegExp(test.pattern, test.flags).source : null).toBe(criterion.test.source);
          });
        } else {
          expect(copy).toEqual(step);
        }
      });
    });
  });

  it('geeft per les een overzicht van uitleg en oefenvormen', () => {
    const w1 = lessonEntries.find((entry) => entry.lesson.id === 'w1')?.lesson;
    expect(w1 && lessonOverview(w1)).toEqual({
      explainTitles: ['Je hoort het niet, je schrijft het wel'],
      exerciseKinds: ['sort', 'fix'],
      exerciseCount: 2,
    });
  });
});

describe('nieuwe lessen (packs)', () => {
  it('staan achter de bestaande lessen van hun niveau', () => {
    for (const [layerId, extra] of Object.entries(EXTRA_LESSONS)) {
      const ids = course.layers.find((layer) => layer.id === layerId)?.lessons.map((lesson) => lesson.id) ?? [];
      expect(ids.slice(-extra.length)).toEqual(extra.map((lesson) => lesson.id));
    }
  });

  it('hebben allemaal een stap en lopen op van basis naar master', () => {
    for (const extra of Object.values(EXTRA_LESSONS)) {
      const stages = extra.map((lesson) => lesson.stage);
      expect(stages.every((stage) => stage !== undefined)).toBe(true);
      const ranks = stages.map((stage) => STAGES.indexOf(stage!));
      expect(ranks).toEqual(ranks.toSorted((a, b) => a - b));
    }
    const stages = new Set(Object.values(EXTRA_LESSONS).flatMap((lessons) => lessons.map((lesson) => lesson.stage)));
    expect([...stages].toSorted()).toEqual([...STAGES].toSorted());
  });

  it('gebruiken de nieuwe klankexperimenten', () => {
    const widgets = course.layers
      .flatMap((layer) => layer.lessons)
      .flatMap((lesson) => lesson.steps)
      .flatMap((step) => (step.kind === 'explain' ? step.panels : []))
      .flatMap((panel) => (['vowels', 'grid', 'tableau', 'sonority', 'tree', 'bracket', 'paradigm', 'phrase'] as const).filter((widget) => panel[widget] !== undefined));
    expect(new Set(widgets)).toEqual(new Set(['vowels', 'grid', 'tableau', 'sonority', 'tree', 'bracket', 'paradigm', 'phrase']));
  });

  it('weigert lessen voor een onbekend niveau', () => {
    expect(() => withExtraLessons(adaptLegacyCourse(), { bestaatniet: [] })).toThrow(/onbekend niveau: bestaatniet/);
  });
});

describe('contractvalidatie weigert onjuiste inhoud', () => {
  const expectIssue = (pack: CoursePackInput, message: RegExp) => {
    const result = CoursePackSchema.safeParse(pack);
    expect(result.success).toBe(false);
    if (!result.success) expect(z.prettifyError(result.error)).toMatch(message);
  };

  it('meerkeuze zonder het antwoord tussen de opties', () => {
    const result = StepSchema.safeParse({
      kind: 'choice',
      prompt: 'Kies',
      before: '',
      after: '',
      options: ['a', 'b'],
      answer: 'c',
      why: 'Omdat.',
    });
    expect(result.success).toBe(false);
  });

  it('markeer-index buiten de zin', () => {
    const pack = clonePack();
    pack.layers[0]!.lessons[0]!.steps[0] = {
      kind: 'explain',
      title: 'Test',
      panels: [{ text: 'Tik.', mark: { q: 'Tik', sentence: 'een twee', targets: [5], note: 'n' } }],
    };
    expectIssue(pack, /valt buiten de zin/);
  });

  it('wisselblokken waarvan het antwoord geen volgorde van de blokken is', () => {
    const pack = clonePack();
    pack.layers[0]!.lessons[0]!.steps[0] = {
      kind: 'explain',
      title: 'Test',
      panels: [{ text: 'Wissel.', swap: { goal: 'g', blocks: ['a b', 'c'], accept: ['a c b'], note: 'n' } }],
    };
    expectIssue(pack, /Geen volgorde van precies deze blokken/);
  });

  it('les met onbekend domein en dubbele les-id', () => {
    const pack = clonePack();
    const lesson = firstLesson(pack);
    pack.layers[1]!.lessons.push({ ...lesson, domain: 'onbekend' });
    expectIssue(pack, /bestaat al/);
    expectIssue(pack, /Onbekend domein/);
  });

  it('klinkerkaart: een tweeklank zoeken zonder glijbanen', () => {
    const result = PanelSchema.safeParse({ text: 'Tik.', vowels: { q: 'Tik', targets: ['i', 'ɛi'], note: 'n' } });
    expect(result.success).toBe(false);
    if (!result.success) expect(z.prettifyError(result.error)).toMatch(/glides: true/);
  });

  it('klanktabel: een doelklank die niet in de tabel staat, of een cel buiten de tabel', () => {
    const result = PanelSchema.safeParse({
      text: 'Tik.',
      grid: {
        q: 'Tik',
        cols: ['lippen'],
        rows: ['plofklank'],
        cells: [
          { t: 'p', row: 0, col: 0 },
          { t: 'b', row: 0, col: 1 },
        ],
        targets: ['m'],
        note: 'n',
      },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(z.prettifyError(result.error)).toMatch(/Kolom 1 bestaat niet/);
      expect(z.prettifyError(result.error)).toMatch(/"m" staat niet in de tabel/);
    }
  });

  it('OT-tableau: een winnaar die nooit kan winnen, of een opgave die al is opgelost', () => {
    const tableau = (winner: number, marks: number[][]) => ({
      text: 'Wissel.',
      tableau: {
        input: '/hɔnd/',
        constraints: [
          { name: 'IDENT', note: 'n' },
          { name: 'CODA', note: 'n' },
        ],
        candidates: marks.map((m, i) => ({ form: `[k${i}]`, marks: m })),
        winner,
        goal: 'g',
        note: 'n',
      },
    });
    const bounded = PanelSchema.safeParse(tableau(1, [[0, 1], [1, 1]]));
    expect(bounded.success).toBe(false);
    if (!bounded.success) expect(z.prettifyError(bounded.error)).toMatch(/Bij geen enkele rangorde/);
    const solved = PanelSchema.safeParse(tableau(0, [[0, 1], [1, 0]]));
    expect(solved.success).toBe(false);
    if (!solved.success) expect(z.prettifyError(solved.error)).toMatch(/al de oplossing/);
    expect(PanelSchema.safeParse(tableau(1, [[0, 1], [1, 0]])).success).toBe(true);
  });

  it('sonoriteitsberg: knippunten buiten het woord of niet oplopend', () => {
    const berg = (cuts: number[]) => ({
      text: 'Knip.',
      sonority: { segs: [{ t: 'a', s: 6 }, { t: 'p', s: 1 }, { t: 'a', s: 6 }], cuts, note: 'n' },
    });
    const outside = PanelSchema.safeParse(berg([3]));
    expect(outside.success).toBe(false);
    if (!outside.success) expect(z.prettifyError(outside.error)).toMatch(/valt buiten het woord/);
    const unsorted = PanelSchema.safeParse(berg([2, 1]));
    expect(unsorted.success).toBe(false);
    if (!unsorted.success) expect(z.prettifyError(unsorted.error)).toMatch(/moeten oplopen/);
    expect(PanelSchema.safeParse(berg([1])).success).toBe(true);
  });

  it('lettergreepboom: geen kern, of de plekken in de verkeerde volgorde', () => {
    const boom = (roles: ('onset' | 'kern' | 'coda' | 'appendix')[]) => ({
      text: 'Hang.',
      tree: { segs: roles.map((role, i) => ({ t: `k${i}`, role })), note: 'n' },
    });
    const empty = PanelSchema.safeParse(boom(['onset', 'coda']));
    expect(empty.success).toBe(false);
    if (!empty.success) expect(z.prettifyError(empty.error)).toMatch(/heeft een kern/);
    const order = PanelSchema.safeParse(boom(['kern', 'onset']));
    expect(order.success).toBe(false);
    if (!order.success) expect(z.prettifyError(order.error)).toMatch(/onset, kern, coda, appendix/);
    expect(PanelSchema.safeParse(boom(['onset', 'kern', 'coda', 'appendix'])).success).toBe(true);
  });

  it('woordboom: ongeldige boom, ontbrekende of verzonnen knopen, een val die juist goed is', () => {
    const boom = (tree: string, nodes: string[], traps: string[] = []) => ({
      text: 'Bouw.',
      bracket: { tree, nodes: nodes.map((w) => ({ w, cat: 'bn', note: 'n' })), traps: traps.map((w) => ({ w, note: 'n' })), note: 'n' },
    });
    const check = (panel: unknown, message: RegExp) => {
      const result = PanelSchema.safeParse(panel);
      expect(result.success).toBe(false);
      if (!result.success) expect(z.prettifyError(result.error)).toMatch(message);
    };
    check(boom('[on lees baar]', ['onleesbaar']), /precies twee stukken/);
    check(boom('[on [lees baar]]', ['onleesbaar']), /Knoop "leesbaar" heeft geen uitleg/);
    check(boom('[on [lees baar]]', ['leesbaar', 'onleesbaar', 'baar']), /"baar" is geen knoop/);
    check(boom('[on [lees baar]]', ['leesbaar', 'onleesbaar'], ['leesbaar']), /juist een goede stap/);
    expect(PanelSchema.safeParse(boom('[on [lees baar]]', ['leesbaar', 'onleesbaar'], ['onlees'])).success).toBe(true);
  });

  it('woordboom van hele woorden: knopen heten naar hun woorden met spaties', () => {
    const boom = (nodes: string[]) => ({
      text: 'Bouw.',
      bracket: { words: true, tree: '[het [rode boek]]', nodes: nodes.map((w) => ({ w, cat: 'NP', note: 'n' })), note: 'n' },
    });
    expect(PanelSchema.safeParse(boom(['rode boek', 'het rode boek'])).success).toBe(true);
    const glued = PanelSchema.safeParse(boom(['rodeboek', 'hetrodeboek']));
    expect(glued.success).toBe(false);
    if (!glued.success) expect(z.prettifyError(glued.error)).toMatch(/Knoop "rode boek" heeft geen uitleg/);
  });

  it('groepenjager: groep buiten de zin, kern buiten de groep, dubbele groep, een val die juist een groep is', () => {
    const jacht = (groups: { span: [number, number]; head: number }[], traps: [number, number][] = []) => ({
      text: 'Zoek.',
      phrase: {
        sentence: 'Mijn buurman zwaait naar de bakker.',
        groups: groups.map((group) => ({ ...group, cat: 'naamwoordgroep', note: 'n' })),
        traps: traps.map((span) => ({ span, note: 'n' })),
        note: 'n',
      },
    });
    const check = (panel: unknown, message: RegExp) => {
      const result = PanelSchema.safeParse(panel);
      expect(result.success).toBe(false);
      if (!result.success) expect(z.prettifyError(result.error)).toMatch(message);
    };
    check(jacht([{ span: [4, 6], head: 5 }]), /valt buiten de zin/);
    check(jacht([{ span: [3, 1], head: 2 }]), /eerste woord staat na het laatste/);
    check(jacht([{ span: [0, 1], head: 2 }]), /kern ligt buiten de groep/);
    check(
      jacht([
        { span: [0, 1], head: 1 },
        { span: [0, 1], head: 0 },
      ]),
      /Groepen staan dubbel/,
    );
    check(jacht([{ span: [0, 1], head: 1 }], [[0, 1]]), /juist een groep/);
    expect(
      PanelSchema.safeParse(
        jacht(
          [
            { span: [0, 1], head: 1 },
            { span: [4, 5], head: 5 },
          ],
          [[1, 2]],
        ),
      ).success,
    ).toBe(true);
  });

  it('paradigma: verkeerd aantal vakjes, niets in te vullen, een valkuil die juist goed is', () => {
    const tabel = (cells: unknown[], extra: string[] = []) => ({
      text: 'Vul in.',
      paradigm: { cols: ['verleden tijd', 'voltooid deelwoord'], rows: [{ label: 'rijden', cells }], extra, note: 'n' },
    });
    const check = (panel: unknown, message: RegExp) => {
      const result = PanelSchema.safeParse(panel);
      expect(result.success).toBe(false);
      if (!result.success) expect(z.prettifyError(result.error)).toMatch(message);
    };
    check(tabel([{ fill: 'reed' }]), /Verwacht 2 vakjes/);
    check(tabel(['reed', 'gereden']), /geen vakje om in te vullen/);
    check(tabel(['reed', { fill: 'gereden' }], ['gereden']), /juist een goed antwoord/);
    expect(PanelSchema.safeParse(tabel(['reed', { fill: 'gereden' }], ['gereed'])).success).toBe(true);
  });

  it('ongelijke markeringen en ongeldige reguliere expressies', () => {
    const pack = clonePack();
    firstLesson(pack).steps = [
      { kind: 'learn', title: 'T', body: 'Een *half voorbeeld', example: [] },
      { kind: 'write', prompt: 'Schrijf', minWords: 1, must: [{ label: 'x', test: { pattern: '(' } }], why: 'w' },
    ];
    expectIssue(pack, /in paren/);
    expectIssue(pack, /Ongeldige reguliere expressie/);
  });
});

describe('JSON Schema voor lesauteurs', () => {
  it('is actueel', () => {
    const generated = `${JSON.stringify(z.toJSONSchema(CoursePackSchema, { target: 'draft-2020-12' }), null, 2)}\n`;
    if (process.env.UPDATE_CONTENT_SCHEMA === '1' || !existsSync(SCHEMA_FILE)) {
      writeFileSync(SCHEMA_FILE, generated);
    }
    expect(readFileSync(SCHEMA_FILE, 'utf8')).toBe(generated);
  });
});
