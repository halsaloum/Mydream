import { describe, expect, it } from 'vitest';
import { LessonSchema, type LessonInput } from '../../schema';
import { panelWidgets } from '../../../engine/plan';

/**
 * De praktijklessen van De letter, Klank en letter en De lettergreep: regels kennen en toepassen.
 * Elk bestand wordt los geladen, zodat één fout bestand de andere niet meeneemt.
 */
const files = import.meta.glob(['./*.ts', '!./*.test.ts', '!./index.ts']);

/** Woorden die horen bij taalwetenschap, geschiedenis of vergelijking, niet bij een praktijkles. */
const NIET_PRAKTISCH = /\b(IPA|fone(em|men|tisch)|fonolog\w*|morfeem\w*|taalkundig\w*|taalwetenschap\w*|onset|coda|sonoriteit\w*|optimaliteit\w*|middelnederlands\w*|latijn\w*|proto-\w*|etymolog\w*)\b/i;

describe.each(Object.keys(files))('praktijkles %s', (file) => {
  it('voldoet aan het contract en is lang, gevarieerd en interactief', async () => {
    const mod = (await files[file]!()) as Record<string, LessonInput>;
    const lessons = Object.values(mod);
    expect(lessons).toHaveLength(1);
    const lesson = LessonSchema.parse(lessons[0]);
    expect(lesson.stage === 'regels' || lesson.stage === 'toets').toBe(true);

    const explains = lesson.steps.filter((step) => step.kind === 'explain');
    const exercises = lesson.steps.filter((step) => step.kind !== 'explain' && step.kind !== 'learn');
    expect(explains.length).toBeGreaterThanOrEqual(lesson.stage === 'toets' ? 1 : 2);
    expect(exercises.length).toBeGreaterThanOrEqual(lesson.stage === 'toets' ? 14 : 10);
    expect(new Set(exercises.map((step) => step.kind)).size).toBeGreaterThanOrEqual(5);
    for (const step of explains) {
      expect(step.panels.length).toBeGreaterThanOrEqual(3);
      for (const panel of step.panels) {
        const todo = panelWidgets(panel).length + (panel.lab ? 1 : 0) + (panel.quiz ? 1 : 0);
        expect(todo, `${step.id}: elk uitlegpaneel heeft iets om te doen`).toBeGreaterThan(0);
      }
    }
    const ids = lesson.steps.map((step) => step.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);

    const text = JSON.stringify(lesson);
    expect(text.match(NIET_PRAKTISCH)?.[0]).toBeUndefined();
  });
});
