import { describe, expect, it } from 'vitest';
import { getOntleedLesson, ontleedLessons } from '@/content/ontleed';
import { getSectionCoach } from './lesson-coach';

describe('guided explanations for the whole course', () => {
  it('supports every section with plain guidance and a separate, source-backed check', () => {
    const ids = new Set<string>();
    const positions = new Set<number>();
    let sections = 0;
    for (const lesson of ontleedLessons) {
      for (const [index, section] of lesson.sections.entries()) {
        const coach = getSectionCoach(lesson, index);
        const check = coach.check;
        expect(coach.summary.length, `${lesson.id}:${index}`).toBeGreaterThan(30);
        expect(coach.summary.length).toBeLessThan(250);
        expect(coach.steps).toHaveLength(3);
        expect(coach.focusPrompt).toContain(section.examples.length > 1 ? 'Klik' : 'Lees');
        expect(check.sentence).toBe(section.examples[0]?.sentence);
        expect(check.explanation).toBe(section.examples[0]?.analysis);
        expect(check.options.length).toBeGreaterThanOrEqual(2);
        expect(new Set(check.options).size).toBe(check.options.length);
        expect(check.answer).toBeGreaterThanOrEqual(0);
        expect(check.answer).toBeLessThan(check.options.length);
        expect(check.feedback).toHaveLength(check.options.length);
        expect(check.feedback.every(text => text.length > 30)).toBe(true);
        expect(check.hint.length).toBeGreaterThan(30);
        expect(ids.has(check.id)).toBe(false);
        expect([...lesson.practice, ...lesson.retrieval].some(item => item.id === check.id)).toBe(false);
        if (!coach.lenses) expect(check.options[check.answer]).toBe(section.examples[0]?.analysis);
        for (const lens of coach.lenses ?? []) {
          expect(check.sentence).toContain(lens.highlight);
          expect(lens.explanation).toContain(lens.label === 'Vorm' ? 'naamwoordgroep' : lens.label === 'Functie' ? 'lijdend voorwerp' : 'geschreven zaak');
        }
        ids.add(check.id);
        positions.add(check.answer);
        sections += 1;
      }
    }
    expect(ontleedLessons).toHaveLength(68);
    expect(sections).toBe(204);
    expect(positions.size).toBeGreaterThan(1);
  });

  it('separates the three questions in the example from the screenshot', () => {
    const lesson = getOntleedLesson('basis-vorm-functie')!;
    const coach = getSectionCoach(lesson, 0);
    expect(coach.lenses?.map(lens => lens.label)).toEqual(['Vorm', 'Functie', 'Betekenis']);
    expect(coach.lenses?.every(lens => lens.highlight === 'de lange brief')).toBe(true);
    expect(coach.check.prompt).toContain('functie');
    expect(coach.check.options[coach.check.answer]).toContain('Lijdend voorwerp');
    expect(coach.check.feedback[0]).toContain('vorm');
    expect(coach.check.feedback[2]).toContain('betekenisrol');
    expect(coach.summary).not.toContain('semantische');
  });

  it('is deterministic and leaves the authored lesson unchanged', () => {
    const lesson = getOntleedLesson('basis-woord')!;
    const original = structuredClone(lesson);
    expect(getSectionCoach(lesson, 2)).toEqual(getSectionCoach(lesson, 2));
    expect(lesson).toEqual(original);
    expect(() => getSectionCoach(lesson, -1)).toThrow(RangeError);
    expect(() => getSectionCoach(lesson, 3)).toThrow(RangeError);
  });
});
