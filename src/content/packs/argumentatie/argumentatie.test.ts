import { describe, expect, it } from 'vitest';
import { ARGUMENTATIE_LESSONS } from '../argumentatie';
import { LessonSchema, type StepKind } from '../../schema';

describe('doorlopende leerlijn argumentatie', () => {
  it('valideert alle lessen, antwoordverwijzingen en specialistische interacties', () => {
    for (const lesson of ARGUMENTATIE_LESSONS) {
      const result = LessonSchema.safeParse(lesson);
      expect(result.success, `${lesson.id}: ${result.success ? '' : JSON.stringify(result.error.issues)}`).toBe(true);
      const ids = lesson.steps.map((step) => step.id);
      expect(ids.every(Boolean), lesson.id).toBe(true);
      expect(new Set(ids).size, lesson.id).toBe(ids.length);
    }
  });

  it('bouwt op van beginnersgrondslagen naar zelfstandige analyse en herziening', () => {
    expect(ARGUMENTATIE_LESSONS.map((lesson) => lesson.id)).toEqual(Array.from({ length: 16 }, (_, i) => `a${20 + i}`));
    expect(ARGUMENTATIE_LESSONS.map((lesson) => lesson.stage)).toEqual([
      ...Array<string>(4).fill('regels'), ...Array<string>(6).fill('bachelor'), ...Array<string>(6).fill('master'),
    ]);
    for (const lesson of ARGUMENTATIE_LESSONS) {
      expect(lesson.steps.length, lesson.id).toBeGreaterThanOrEqual(8);
      expect(lesson.guidance?.strategy.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.guidance?.selfCheck.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.steps.some((step) => step.kind === 'explain' && step.panels.some((panel) => panel.lab || panel.quiz)), lesson.id).toBe(true);
      expect(lesson.steps.some((step) => step.kind === 'write'), lesson.id).toBe(true);
    }
    const kinds = new Set(ARGUMENTATIE_LESSONS.flatMap((lesson) => lesson.steps.map((step) => step.kind)));
    const specialized: StepKind[] = ['reason', 'support', 'evidence', 'rebut', 'strawman', 'slope', 'dilemma', 'inspect'];
    for (const kind of specialized) expect(kinds.has(kind), kind).toBe(true);
    const final = ARGUMENTATIE_LESSONS.at(-1)!;
    expect(final.steps.filter((step) => step.kind === 'write').map((step) => step.id)).toEqual(['advies', 'herzien']);
  });

  it('geeft bij vrij schrijven een bruikbaar model en zelfcontrole, zonder trefwoorden als inhoudelijke beoordeling', () => {
    for (const lesson of ARGUMENTATIE_LESSONS) {
      for (const step of lesson.steps) {
        if (step.kind !== 'write') continue;
        const context = `${lesson.id}/${step.id}`;
        expect(step.must, context).toEqual([]);
        expect(step.rubric, context).toBeDefined();
        expect(step.rubric!.criteria.length, context).toBeGreaterThanOrEqual(3);
        expect(step.rubric!.example.trim().split(/\s+/).length, context).toBeGreaterThanOrEqual(step.minWords);
        expect(step.intro, context).toContain('beoordeelt niet of je argumentatie klopt');
      }
    }
  });
});
