import { describe, expect, it } from 'vitest';
import { StepSchema } from '../schema';
import { MORPHOLOGY_UPGRADES } from './morphology';

describe('morphology learning path', () => {
  it('provides explicit guidance and application for all 25 morphology lessons', () => {
    expect(Object.keys(MORPHOLOGY_UPGRADES).sort()).toEqual(Array.from({ length: 25 }, (_, i) => `d${i}`).sort());
    for (const [lessonId, upgrade] of Object.entries(MORPHOLOGY_UPGRADES)) {
      expect(upgrade.guidance.goal, lessonId).toMatch(/\S/);
      expect(upgrade.guidance.startingPoint, lessonId).toMatch(/\S/);
      expect(upgrade.guidance.strategy.length, lessonId).toBeGreaterThanOrEqual(3);
      expect(upgrade.guidance.selfCheck.length, lessonId).toBeGreaterThanOrEqual(2);
      expect(upgrade.steps.length, lessonId).toBeGreaterThanOrEqual(3);
      const ids = upgrade.steps.map((step) => step.id);
      expect(new Set(ids).size, lessonId).toBe(ids.length);
      expect(ids.some((id) => id?.startsWith('transfer-')), lessonId).toBe(true);
      for (const step of upgrade.steps) {
        const parsed = StepSchema.safeParse(step);
        expect(parsed.success, `${lessonId}/${step.id}: ${JSON.stringify(parsed.error?.issues)}`).toBe(true);
      }
    }
  });

  it('gives the short introductory lessons an interactive explanation and at least four practice steps', () => {
    for (const lessonId of ['d0', 'd1', 'd2', 'd3', 'd4']) {
      const steps = MORPHOLOGY_UPGRADES[lessonId]!.steps;
      expect(steps.filter((step) => step.kind !== 'explain').length, lessonId).toBeGreaterThanOrEqual(4);
      expect(steps.some((step) => step.kind === 'explain' && step.panels.some((panel) => panel.lab || panel.split || panel.build)), lessonId).toBe(true);
    }
  });

  it('gives each open writing task a content rubric and an example that meets its own length requirement', () => {
    const tasks = Object.values(MORPHOLOGY_UPGRADES).flatMap((upgrade) => upgrade.steps).filter((step) => step.kind === 'write');
    expect(tasks.length).toBe(5);
    for (const task of tasks) {
      expect(task.rubric?.criteria.length, task.id).toBeGreaterThanOrEqual(3);
      expect(task.rubric?.example.trim().split(/\s+/).length, task.id).toBeGreaterThanOrEqual(task.minWords);
    }
  });

  it('checks the difference between phonological and morphological boundaries in the introductory contrast', () => {
    const step = MORPHOLOGY_UPGRADES.d0!.steps.find((step) => step.id === 'transfer-zelf-ontleden');
    expect(step?.kind).toBe('type');
    if (step?.kind === 'type') expect(step.answer).toBe('stoel-en');
    const klank = MORPHOLOGY_UPGRADES.d0!.steps.find((step) => step.id === 'toepassen-klankgrens');
    expect(klank?.kind).toBe('choice');
    if (klank?.kind === 'choice') expect(klank.answer).toBe('stoe-len');
  });

  it('does not miscount morphological productivity or classify spelling alternation as vowel change', () => {
    const calculation = MORPHOLOGY_UPGRADES.d15!.steps.find((step) => step.id === 'toepassen-productiviteit-rekenen');
    expect(calculation?.kind).toBe('type');
    if (calculation?.kind === 'type') expect(Number(calculation.answer.replace(',', '.'))).toBe(30 / 750);
    const contrast = MORPHOLOGY_UPGRADES.d12!.steps.find((step) => step.id === 'toepassen-aard-van-verschil');
    expect(contrast?.kind).toBe('sort');
    if (contrast?.kind === 'sort') {
      expect(contrast.items.find((item) => item.t === 'raam → ramen')?.b).toBe(0);
      expect(contrast.items.find((item) => item.t === 'schip → schepen')?.b).toBe(1);
    }
  });
});
