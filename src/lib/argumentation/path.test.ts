import { describe, expect, it } from 'vitest';
import { argumentLessons } from '@/content/argumentation';
import { lessonAvailable, moduleAvailable, nextPathLesson } from './path';

describe('begeleid leerpad', () => {
  it('begint bij geen voorkennis en opent elke volgende stap na afronden', () => {
    const first = argumentLessons[0]!;
    const second = argumentLessons[1]!;
    expect(nextPathLesson(argumentLessons, {})?.id).toBe(first.id);
    expect(lessonAvailable(first.id, argumentLessons, {})).toBe(true);
    expect(lessonAvailable(second.id, argumentLessons, {})).toBe(false);
    const records = { [first.id]: { completedAt: '2026-10-12T10:00:00Z' } };
    expect(lessonAvailable(second.id, argumentLessons, records)).toBe(true);
    expect(nextPathLesson(argumentLessons, records)?.id).toBe(second.id);
  });
  it('laat afgeronde stappen beschikbaar en vereist het checkpoint voor een nieuwe route', () => {
    const basis = argumentLessons.filter((lesson) => lesson.moduleId === 'basis');
    const records = Object.fromEntries(basis.map((lesson) => [lesson.id, { completedAt: lesson.checkpoint ? null : '2026-10-12T10:00:00Z' }]));
    expect(moduleAvailable('bachelor', argumentLessons, records)).toBe(false);
    records[basis.at(-1)!.id] = { completedAt: '2026-10-12T10:00:00Z' };
    expect(moduleAvailable('bachelor', argumentLessons, records)).toBe(true);
    expect(lessonAvailable(basis[0]!.id, argumentLessons, records)).toBe(true);
  });
});
