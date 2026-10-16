import { describe, expect, it } from 'vitest';
import { argumentLessons } from './curriculum';
import { lessonScaffolds } from './scaffolds';
import { argumentInquiries } from './inquiries';

describe('opbouw van begeleiding naar eigen verantwoordelijkheid', () => {
  it('heeft bij elke les een concrete kleine startvraag met geldige feedback', () => {
    expect(Object.keys(lessonScaffolds).sort()).toEqual(argumentLessons.map((lesson) => lesson.id).sort());
    for (const lesson of argumentLessons) {
      const scaffold = lessonScaffolds[lesson.id]!;
      expect(scaffold.context.length, lesson.id).toBeGreaterThan(30);
      expect(scaffold.options, lesson.id).toHaveLength(3);
      expect(scaffold.options.filter((option) => option.id === scaffold.answer), lesson.id).toHaveLength(1);
      expect(scaffold.options.every((option) => option.feedback.length > 20), lesson.id).toBe(true);
      expect(scaffold.bridge.length, lesson.id).toBeGreaterThan(25);
    }
  });
  it('geeft alle inhoudelijke lessen een eigen casusvoorspelling en vergelijking', () => {
    expect(Object.keys(argumentInquiries).sort()).toEqual(argumentLessons.filter((lesson) => !lesson.checkpoint).map((lesson) => lesson.id).sort());
    for (const inquiry of Object.values(argumentInquiries)) {
      expect(inquiry.scenario.length).toBeGreaterThan(50);
      expect(inquiry.model.length).toBeGreaterThan(100);
      expect(inquiry.followUp.length).toBeGreaterThan(30);
    }
  });
});
