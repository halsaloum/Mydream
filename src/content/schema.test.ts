// @vitest-environment node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { adaptLegacyCourse } from './adapters/legacy';
import { course, lessonEntries, lessonOverview } from './catalog';
import { LESSONS } from './legacy/build';
import { CoursePackSchema, StepSchema, type CoursePackInput } from './schema';

const SCHEMA_FILE = path.resolve(import.meta.dirname, '../../content/schema/course-pack.schema.json');

function clonePack(): CoursePackInput {
  return structuredClone(adaptLegacyCourse());
}

function firstLesson(pack: CoursePackInput) {
  const lesson = pack.layers[0]?.lessons[0];
  if (!lesson) throw new Error('Geen les gevonden');
  return lesson;
}

describe('bestaande lesinhoud', () => {
  it('voldoet aan het contract: 9 niveaus, 29 lessen, 7 vakgebieden waarvan 4 perspectieven', () => {
    expect(course.layers).toHaveLength(9);
    expect(lessonEntries).toHaveLength(29);
    expect(course.domains.map((domain) => domain.id)).toEqual(['orth', 'fon', 'morf', 'syn', 'sem', 'prag', 'tekst']);
    expect(course.domains.filter((domain) => domain.persp).map((domain) => domain.id)).toEqual(['morf', 'syn', 'sem', 'prag']);
    expect(course.layers.every((layer) => layer.growth && layer.learn && layer.example && layer.fields.length > 0)).toBe(true);
    expect(lessonEntries.find((entry) => entry.lesson.id === 'k1')?.also.map((domain) => domain.id)).toEqual(['orth']);
  });

  it('volgt dezelfde volgorde als de oorspronkelijke app', () => {
    expect(lessonEntries.map((entry) => entry.lesson.id)).toEqual(LESSONS.map((lesson) => lesson.id));
  });

  it('laat de inhoud ongewijzigd; alleen schrijfcriteria krijgen een JSON-vorm', () => {
    LESSONS.forEach((legacy, i) => {
      const adapted = lessonEntries[i]?.lesson;
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
