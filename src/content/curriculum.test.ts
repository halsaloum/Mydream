// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { learningPathEntries, learningPhases, lessonEntries, nextLessonEntry } from './catalog';
import { LESSON_UPGRADES } from './curriculum';

describe('complete leerlijn van basis naar betoog', () => {
  it('biedt alle bestaande lessen eigen begeleiding en nieuwe toepassing', () => {
    expect(Object.keys(LESSON_UPGRADES)).toHaveLength(119);
    for (const entry of lessonEntries) {
      expect(entry.lesson.guidance, entry.lesson.id).toBeDefined();
      expect(entry.lesson.guidance!.strategy.length).toBeGreaterThanOrEqual(2);
      const upgrade = LESSON_UPGRADES[entry.lesson.id];
      if (upgrade) {
        expect(upgrade.steps.length, entry.lesson.id).toBeGreaterThanOrEqual(2);
        expect(upgrade.steps.some((step) => step.kind !== 'learn' && step.kind !== 'explain'), entry.lesson.id).toBe(true);
        expect(upgrade.steps.every((step) => step.id), entry.lesson.id).toBe(true);
      }
    }
  });

  it('behoudt iedere les precies één keer en plaatst argumenteren vóór optionele taalkunde', () => {
    const route = learningPathEntries.map((entry) => entry.lesson.id);
    expect(new Set(route).size).toBe(lessonEntries.length);
    expect([...route].sort()).toEqual(lessonEntries.map((entry) => entry.lesson.id).sort());
    expect(route.indexOf('a12')).toBeLessThan(route.indexOf('a20'));
    expect(route.indexOf('a35')).toBeLessThan(route.indexOf('d24'));
    expect(learningPhases.find((phase) => phase.id === 'argumenteren')?.entries).toHaveLength(16);
    for (let i = 0; i < route.length; i++) expect(nextLessonEntry(route[i]!)?.lesson.id).toBe(route[i + 1]);
    expect(nextLessonEntry('bestaatniet')).toBeUndefined();
  });
});
