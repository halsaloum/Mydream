import { describe, expect, it } from 'vitest';
import { clozeOf } from '../../cloze';
import { LessonSchema, type LessonInput, type Step, type StepOf } from '../../schema';
import { panelWidgets } from '../../../engine/plan';

/**
 * De praktijklessen van De letter, Klank en letter en De lettergreep: regels kennen en toepassen.
 * Elk bestand wordt los geladen, zodat één fout bestand de andere niet meeneemt.
 *
 * De lessen moeten uitdagen: veel zelf typen, geen beginletters als hint, geen opdrachten met
 * maar twee keuzes, en elke les eindigt met lang werk (reeks, invultekst, tekstdictee en een
 * tekst nakijken zonder hulp). Een toets heeft daar nog meer van.
 */
const files = import.meta.glob(['./*.ts', '!./*.test.ts', '!./index.ts']);

/** Woorden die horen bij taalwetenschap, geschiedenis of vergelijking, niet bij een praktijkles. */
const NIET_PRAKTISCH = /\b(IPA|fone(em|men|tisch)|fonolog\w*|morfeem\w*|taalkundig\w*|taalwetenschap\w*|onset|coda|sonoriteit\w*|optimaliteit\w*|middelnederlands\w*|latijn\w*|proto-\w*|etymolog\w*)\b/i;

const of = <K extends Step['kind']>(steps: Step[], kind: K) => steps.filter((step): step is StepOf<K> => step.kind === kind);
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const bare = (text: string) => text.toLocaleLowerCase('nl').replace(/[…_.\s]+$/u, '').trim();

describe.each(Object.keys(files))('praktijkles %s', (file) => {
  it('voldoet aan het contract en is lang, gevarieerd en interactief', async () => {
    const mod = (await files[file]!()) as Record<string, LessonInput>;
    const lessons = Object.values(mod);
    expect(lessons).toHaveLength(1);
    const lesson = LessonSchema.parse(lessons[0]);
    expect(lesson.stage === 'regels' || lesson.stage === 'toets').toBe(true);
    const toets = lesson.stage === 'toets';

    const explains = of(lesson.steps, 'explain');
    const exercises = lesson.steps.filter((step) => step.kind !== 'explain' && step.kind !== 'learn');
    expect(explains.length).toBeGreaterThanOrEqual(toets ? 1 : 2);
    expect(exercises.length).toBeGreaterThanOrEqual(toets ? 20 : 16);
    expect(new Set(exercises.map((step) => step.kind)).size).toBeGreaterThanOrEqual(7);
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

  it('daagt uit: veel zelf typen, weinig hulp', async () => {
    const mod = (await files[file]!()) as Record<string, LessonInput>;
    const lesson = LessonSchema.parse(Object.values(mod)[0]);
    const toets = lesson.stage === 'toets';
    const steps = lesson.steps;

    // Geen beginletters als hint, geen opdrachten met maar twee keuzes.
    for (const step of of(steps, 'type')) {
      const hint = bare(step.hint);
      expect(hint === '' || !bare(step.answer).startsWith(hint), `${step.id}: de hint verraadt het begin van het antwoord`).toBe(true);
    }
    for (const step of [...of(steps, 'choice'), ...of(steps, 'bet')]) {
      expect(step.options.length, `${step.id}: minstens drie keuzes`).toBeGreaterThanOrEqual(3);
    }
    for (const step of of(steps, 'swipe')) expect(step.cards.length, `${step.id}: kaarten`).toBeGreaterThanOrEqual(8);
    for (const step of of(steps, 'sort')) expect(step.items.length, `${step.id}: kaartjes`).toBeGreaterThanOrEqual(10);

    // Lang werk aan het eind: reeks, invultekst, tekstdictee en nakijken zonder hulp.
    const drills = of(steps, 'drill');
    const clozes = of(steps, 'cloze');
    const passages = of(steps, 'passage');
    const blind = of(steps, 'proofread').filter((step) => step.blind);
    const gaps = clozes.map((step) => clozeOf(step.text).gaps);

    expect(drills.length).toBeGreaterThanOrEqual(toets ? 2 : 1);
    expect(sum(drills.map((step) => step.items.length))).toBeGreaterThanOrEqual(toets ? 45 : 18);
    expect(clozes.length).toBeGreaterThanOrEqual(toets ? 2 : 1);
    expect(sum(gaps.map((list) => list.length))).toBeGreaterThanOrEqual(toets ? 30 : 12);
    for (const list of gaps) expect(list.every((gap) => gap.note), 'elk gat heeft uitleg voor als het fout gaat').toBe(true);
    expect(Math.max(0, ...passages.map((step) => step.sentences.length))).toBeGreaterThanOrEqual(toets ? 8 : 5);
    expect(blind.length).toBeGreaterThanOrEqual(toets ? 2 : 1);
    for (const step of blind) {
      expect(step.tokens.filter((token) => 'fix' in token).length, `${step.id}: fouten`).toBeGreaterThanOrEqual(6);
      expect(step.tokens.filter((token) => 'trap' in token).length, `${step.id}: woorden die fout lijken maar goed zijn`).toBeGreaterThanOrEqual(2);
    }
  });
});
