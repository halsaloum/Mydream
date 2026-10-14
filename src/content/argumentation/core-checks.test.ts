import { describe, expect, it } from 'vitest';
import { argumentLessons } from './index';
import { lessonCoreChecks } from './core-checks';

describe('new second-section transfer checks', () => {
  it('provides one deliberately authored case for the actual second section of every lesson', () => {
    expect(Object.keys(lessonCoreChecks).sort()).toEqual(argumentLessons.map((lesson) => lesson.id).sort());
    expect(Object.keys(lessonCoreChecks)).toHaveLength(argumentLessons.length);
    for (const lesson of argumentLessons) {
      const check = lessonCoreChecks[lesson.id]!;
      expect(check.sectionTitle, lesson.id).toBe(lesson.sections[1]?.title);
      expect(check.scenario.trim().split(/\s+/).length, lesson.id).toBeGreaterThan(12);
      expect(check.options, lesson.id).toHaveLength(3);
      expect(check.options.filter((option) => option.id === check.answer), lesson.id).toHaveLength(1);
      expect(new Set(check.options.map((option) => option.id)).size, lesson.id).toBe(3);
      expect(new Set(check.options.map((option) => option.text)).size, lesson.id).toBe(3);
      for (const option of check.options) expect(option.feedback.length, `${lesson.id}/${option.id}`).toBeGreaterThan(60);
    }
  });

  it('does not re-use a scored exercise prompt, scenario or option as the transfer case', () => {
    const normalized = (text: string) => text.toLocaleLowerCase('nl-NL').replace(/\s+/g, ' ').trim();
    for (const lesson of argumentLessons) {
      const check = lessonCoreChecks[lesson.id]!;
      const prompts = new Set(lesson.exercises.map((exercise) => normalized(exercise.prompt)));
      const scenarios = new Set(lesson.exercises.flatMap((exercise) => exercise.scenario ? [normalized(exercise.scenario)] : []));
      const options = new Set(lesson.exercises.flatMap((exercise) => exercise.kind === 'choice' ? exercise.options.map((option) => normalized(option.text)) : []));
      expect(prompts.has(normalized(check.prompt)), lesson.id).toBe(false);
      expect(scenarios.has(normalized(check.scenario)), lesson.id).toBe(false);
      expect(check.options.some((option) => options.has(normalized(option.text))), lesson.id).toBe(false);
    }
  });
});
