import { describe, expect, it } from 'vitest';
import { LessonSchema, StepSchema } from '../schema';
import { wordCount } from '../../engine/grade';
import { SCHRIJFLESSEN } from '../packs/schrijven';
import { WRITING_UPGRADES } from './writing';

/** Validate standalone so a broken unrelated pack cannot hide writing-content defects. */
describe('schrijfleerlijn', () => {
  it('valideert alle aanvullende stappen met stabiele, unieke ids per les', () => {
    for (const [lessonId, upgrade] of Object.entries(WRITING_UPGRADES)) {
      expect(upgrade.guidance.goal, lessonId).not.toBe('');
      const ids = upgrade.steps.map((step) => step.id);
      expect(new Set(ids).size, lessonId).toBe(ids.length);
      for (const step of upgrade.steps) {
        expect(step.id, lessonId).toMatch(/^(toepassen|transfer)-/);
        const parsed = StepSchema.safeParse(step);
        expect(parsed.success, `${lessonId}/${step.id}: ${JSON.stringify(parsed.error?.issues)}`).toBe(true);
        if (step.kind === 'write') expect(wordCount(step.rubric?.example ?? ''), `${lessonId}: volledig voorbeeld`).toBeGreaterThanOrEqual(step.minWords);
      }
    }
  });

  it('dekt alle bestaande schrijf- en woordgroeplessen af', () => {
    const expected = [
      ...Array.from({ length: 18 }, (_, i) => `p${i + 1}`),
      'z1', 'z2', 'z3', 's1', 's2', 's3', 'a1', 'a2',
    ];
    expect(Object.keys(WRITING_UPGRADES).sort()).toEqual(expected.sort());
  });

  it('biedt in iedere nieuwe module experimenten, verschillende oefenvormen en een zelfstandige opdracht', () => {
    for (const lesson of Object.values(SCHRIJFLESSEN).flat()) {
      const parsed = LessonSchema.safeParse(lesson);
      expect(parsed.success, `${lesson.id}: ${JSON.stringify(parsed.error?.issues)}`).toBe(true);
      expect(lesson.steps.some((step) => step.kind === 'explain' && step.panels.some((panel) => panel.lab || panel.mark || panel.quiz)), lesson.id).toBe(true);
      expect(new Set(lesson.steps.map((step) => step.kind)).size, lesson.id).toBeGreaterThanOrEqual(4);
      const assignment = lesson.steps.find((step) => step.kind === 'write');
      expect(assignment?.kind).toBe('write');
      if (assignment?.kind === 'write') {
        expect(assignment.rubric?.criteria.length, lesson.id).toBeGreaterThanOrEqual(3);
        expect(assignment.must, lesson.id).toEqual([]);
        expect(wordCount(assignment.rubric?.example ?? ''), `${lesson.id}: voorbeeld is minstens zo lang als vereist`).toBeGreaterThanOrEqual(assignment.minWords);
      }
    }
  });

  it('laat foutdiagnoses de werkelijk foute woorden aanwijzen', () => {
    const expectedWords = new Map([
      ['p4/toepassen-kernfout', 'zijn'],
      ['z1/toepassen-congruentie', 'lijken'],
      ['z20/toepassen-kern', 'blijven'],
    ]);
    const entries = [
      ...Object.entries(WRITING_UPGRADES).map(([id, value]) => ({ id, steps: value.steps })),
      ...Object.values(SCHRIJFLESSEN).flat(),
    ];
    for (const lesson of entries) {
      for (const step of lesson.steps) {
        if (step.kind !== 'fix') continue;
        const target = expectedWords.get(`${lesson.id}/${step.id}`);
        expect(target, `${lesson.id}/${step.id} mist een inhoudelijke indexcontrole`).toBeDefined();
        expect(step.sentence.split(/\s+/)[step.wrong], lesson.id).toBe(target);
      }
    }
  });
});
