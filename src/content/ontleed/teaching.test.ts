import { describe, expect, it } from 'vitest';
import { ontleedLessons } from './index';
import { BOOKS } from './sources';
import { SECTION_TEACHING, withSectionTeaching } from './teaching';
import { getSectionCoach } from '@/lib/ontleed/lesson-coach';

describe('book-informed structured explanations', () => {
  it('gives every lesson section its own short reasoning steps and traceable sources', () => {
    expect(Object.keys(SECTION_TEACHING).sort()).toEqual(ontleedLessons.map(lesson => lesson.id).sort());
    let count = 0;
    for (const lesson of ontleedLessons) {
      expect(SECTION_TEACHING[lesson.id], lesson.id).toHaveLength(lesson.sections.length);
      for (const [index, section] of lesson.sections.entries()) {
        const teaching = section.teaching;
        expect(teaching, `${lesson.id}:${index}`).toBeDefined();
        expect(teaching!.core.length).toBeGreaterThan(30);
        expect(teaching!.core.length).toBeLessThanOrEqual(250);
        expect(teaching!.steps).toHaveLength(3);
        expect(new Set(teaching!.steps.map(step => step.title)).size).toBe(3);
        expect(teaching!.steps.every(step => step.title.trim() && step.text.length > 35)).toBe(true);
        expect(teaching!.memory.length).toBeGreaterThan(25);
        expect(teaching!.sources.length).toBeGreaterThan(0);
        for (const source of teaching!.sources) {
          expect(BOOKS[source.bookId]).toBeDefined();
          expect(source.section.trim()).not.toBe('');
        }
        expect(getSectionCoach(lesson, index).check.sentence).toBe(section.examples[0]!.sentence);
        count += 1;
      }
    }
    expect(count).toBe(204);
  });

  it('preserves exercise answers and existing content when explanations are attached', () => {
    const lesson = structuredClone(ontleedLessons[0]!);
    lesson.sections.forEach(section => { delete section.teaching; });
    const original = structuredClone(lesson);
    const result = withSectionTeaching(lesson);
    expect(lesson).toEqual(original);
    expect(result.practice).toBe(lesson.practice);
    expect(result.discovery).toBe(lesson.discovery);
    expect(result.sections.map(({ teaching: _teaching, ...section }) => section)).toEqual(lesson.sections);
  });

  it('keeps number and tense separate in the finite-verb demonstration', () => {
    const lesson = ontleedLessons.find(item => item.id === 'zinsdelen-persoonsvorm')!;
    const analysis = lesson.sections[1]!.examples.map(example => example.analysis).join(' ');
    expect(analysis).toContain('meervoudig onderwerp wordt het hebben. De tijd blijft gelijk.');
    expect(analysis).not.toContain('wordt het hadden');
  });
});
