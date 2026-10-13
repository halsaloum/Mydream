// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { buildPlan, planFingerprint } from '../engine/plan';
import { adaptLegacyCourse } from './adapters/legacy';
import { course, getLayer, getLessonEntry, learningPathEntries, lessonEntries } from './catalog';
import { withCurriculum } from './curriculum';
import { withExtraLessons } from './packs';
import { CoursePackSchema } from './schema';
import { LEGACY_SENTENCE_LAYER_IDS, withSentenceLayer } from './sentence-layer';

describe('de gezamenlijke afdeling Zinnen', () => {
  it('voegt alleen de drie zinsbouwlagen samen en behoudt ieder oorspronkelijk lesobject', () => {
    const original = withCurriculum(withExtraLessons(adaptLegacyCourse()));
    const combined = withSentenceLayer(original);
    expect(combined.layers.map((layer) => layer.id)).toEqual(['letter', 'klank', 'greep', 'deel', 'woord', 'zinnen', 'alinea']);
    const source = original.layers.filter((layer) => LEGACY_SENTENCE_LAYER_IDS.some((id) => id === layer.id)).flatMap((layer) => layer.lessons);
    const lessons = combined.layers.find((layer) => layer.id === 'zinnen')!.lessons;
    expect(lessons).toHaveLength(30);
    for (const [index, lesson] of source.entries()) expect(lessons[index]).toBe(lesson);
    for (const layer of original.layers.filter((layer) => !LEGACY_SENTENCE_LAYER_IDS.some((id) => id === layer.id))) {
      expect(combined.layers.find((candidate) => candidate.id === layer.id)).toBe(layer);
    }
    expect(CoursePackSchema.safeParse(combined).success).toBe(true);
    expect(withSentenceLayer(combined)).toBe(combined);
  });

  it('behoudt bestaande leslinks, lesplannen en de sleutels van opgeslagen sessies', () => {
    const source = CoursePackSchema.parse(withCurriculum(withExtraLessons(adaptLegacyCourse())));
    for (const original of source.layers.filter((layer) => LEGACY_SENTENCE_LAYER_IDS.some((id) => id === layer.id))) {
      expect(getLayer(original.id)?.id).toBe('zinnen');
      for (const lesson of original.lessons) {
        const entry = getLessonEntry(lesson.id)!;
        expect(entry.layer.id).toBe('zinnen');
        expect(entry.layerIndex).toBe(5);
        expect(planFingerprint(buildPlan(entry.lesson))).toBe(planFingerprint(buildPlan(lesson)));
      }
    }
  });

  it('behoudt alle 138 lessen in de aanbevelingen en oefent praktische zinsbouw vóór optionele theorie', () => {
    const route = learningPathEntries.map((entry) => entry.lesson.id);
    expect(lessonEntries).toHaveLength(138);
    expect(new Set(route).size).toBe(138);
    expect([...route].sort()).toEqual(lessonEntries.map((entry) => entry.lesson.id).sort());
    expect(route.indexOf('z20')).toBeLessThan(route.indexOf('p12'));
    expect(route.indexOf('s20')).toBeLessThan(route.indexOf('p12'));
    expect(getLessonEntry('a1')?.layerIndex).toBe(6);
    expect(course.layers.filter((layer) => layer.id === 'zinnen')).toHaveLength(1);
  });
});
