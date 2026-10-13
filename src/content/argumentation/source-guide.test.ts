import { describe, expect, it } from 'vitest';
import { argumentLessons } from './curriculum';
import { argumentSourceGuide } from './source-guide';
import { argumentMedia } from './media';
import { mediaForLesson } from './lesson-media';

describe('eigen literatuur en geselecteerde media', () => {
  it('verantwoordt elke les vanuit concrete passages van aangeleverde boeken', () => {
    expect(Object.keys(argumentSourceGuide).sort()).toEqual(argumentLessons.map((lesson) => lesson.id).sort());
    for (const lesson of argumentLessons) {
      const entries = argumentSourceGuide[lesson.id]!;
      expect(entries.length, lesson.id).toBeGreaterThanOrEqual(2);
      for (const entry of entries) {
        expect(entry.fileName, lesson.id).toMatch(/\.(pdf|epub)$/);
        expect(entry.chapter.length, lesson.id).toBeGreaterThan(15);
        expect(entry.pages.length, lesson.id).toBeGreaterThan(10);
        expect(entry.concepts.length, lesson.id).toBeGreaterThan(0);
      }
    }
  });
  it('heeft verifieerbare media met concrete verwerkingsvragen', () => {
    expect(new Set(argumentMedia.map((item) => item.id)).size).toBe(argumentMedia.length);
    for (const item of argumentMedia) {
      expect(new URL(item.url).protocol).toBe('https:');
      if (item.youtubeId) expect(item.youtubeId).toMatch(/^[\w-]{11}$/);
      expect(item.watchFor.length).toBeGreaterThan(30);
      expect(item.question.length).toBeGreaterThan(50);
    }
    expect(argumentLessons.every((lesson) => mediaForLesson(lesson.id).length >= 2)).toBe(true);
  });
});
