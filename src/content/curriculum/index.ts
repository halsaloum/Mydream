import type { CoursePackInput } from '../schema';
import { FOUNDATION_UPGRADES } from './foundations';
import { MORPHOLOGY_UPGRADES } from './morphology';
import { WORD_UPGRADES } from './words';
import { WRITING_UPGRADES } from './writing';
import type { LessonUpgrade } from './types';

export const LESSON_UPGRADES: Readonly<Record<string, LessonUpgrade>> = {
  ...FOUNDATION_UPGRADES, ...MORPHOLOGY_UPGRADES, ...WORD_UPGRADES, ...WRITING_UPGRADES,
};

/** Bestaande stappen houden hun positie; nieuwe toepassing volgt op het oorspronkelijke materiaal. */
export function withCurriculum(pack: CoursePackInput): CoursePackInput {
  const ids = new Set(pack.layers.flatMap((layer) => layer.lessons.map((lesson) => lesson.id)));
  const unknown = Object.keys(LESSON_UPGRADES).filter((id) => !ids.has(id));
  if (unknown.length) throw new Error(`Lesverbetering voor onbekende les: ${unknown.join(', ')}`);
  return {
    ...pack,
    title: 'Van eerste zin tot sterk betoog',
    version: '3.0.0',
    layers: pack.layers.map((layer) => ({
      ...layer,
      lessons: layer.lessons.map((lesson) => {
        const upgrade = LESSON_UPGRADES[lesson.id];
        return upgrade ? { ...lesson, guidance: upgrade.guidance, steps: [...lesson.steps, ...upgrade.steps] } : lesson;
      }),
    })),
  };
}
