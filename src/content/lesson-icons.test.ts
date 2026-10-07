// @vitest-environment node
import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { course } from './catalog';
import { LESSON_ICONS } from './lesson-icons';

const PUBLIC = path.resolve(import.meta.dirname, '../../public');

describe('les-iconen', () => {
  it('bestaan als bestand', () => {
    for (const url of Object.values(LESSON_ICONS)) expect(existsSync(path.join(PUBLIC, url)), url).toBe(true);
  });

  it('horen bij een bestaande les', () => {
    const ids = new Set(course.layers.flatMap((layer) => layer.lessons.map((lesson) => lesson.id)));
    for (const id of Object.keys(LESSON_ICONS)) expect(ids.has(id), id).toBe(true);
  });

  it('dekken elke les van Het betekenisvolle woorddeel en Het woord', () => {
    const lessons = course.layers.filter((layer) => layer.id === 'deel' || layer.id === 'woord').flatMap((layer) => layer.lessons);
    expect(lessons.filter((lesson) => !LESSON_ICONS[lesson.id]).map((lesson) => lesson.id)).toEqual([]);
  });
});
