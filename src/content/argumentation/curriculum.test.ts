import { describe, expect, it } from 'vitest';
import { argumentLessons, argumentModules, argumentSources } from './index';
import { answerReady, emptyArgumentAnswer, gradeArgument, lessonPassed, lessonScore, wordCount } from '@/lib/argumentation/learning';

describe('leerlijn argumenten voor leiders', () => {
  it('heeft drie samenhangende leerroutes met een eigen checkpoint', () => {
    expect(argumentModules.map((module) => module.id)).toEqual(['basis', 'bachelor', 'master']);
    expect(argumentLessons.length).toBeGreaterThanOrEqual(15);
    expect(new Set(argumentLessons.map((lesson) => lesson.id)).size).toBe(argumentLessons.length);
    for (const level of argumentModules) {
      const lessons = argumentLessons.filter((lesson) => lesson.moduleId === level.id);
      expect(lessons.length).toBeGreaterThanOrEqual(5);
      expect(lessons.filter((lesson) => lesson.checkpoint)).toHaveLength(1);
      expect(lessons.at(-1)?.checkpoint).toBe(true);
    }
  });
  it('biedt uitgebreide theorie, analyse, reconstructie en zelfgeschreven argumenten', () => {
    for (const lesson of argumentLessons.filter((lesson) => !lesson.checkpoint && !lesson.introductory)) {
      expect(lesson.minutes, lesson.id).toBeGreaterThanOrEqual(25);
      expect(lesson.sections.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(wordCount(lesson.sections.map((section) => section.body).join(' ') + ' ' + lesson.deepDive.body), lesson.id).toBeGreaterThanOrEqual(350);
      expect(lesson.exercises.length, lesson.id).toBeGreaterThanOrEqual(5);
      expect(lesson.exercises.filter((exercise) => exercise.kind === 'choice').length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.exercises.some((exercise) => exercise.kind === 'sort' || exercise.kind === 'map'), lesson.id).toBe(true);
      const writing = lesson.exercises.find((exercise) => exercise.kind === 'reflection');
      expect(writing, lesson.id).toBeDefined();
      if (writing?.kind === 'reflection') {
        expect(writing.minWords, lesson.id).toBeGreaterThanOrEqual(80);
        expect(writing.rubric.length, lesson.id).toBeGreaterThanOrEqual(3);
        expect(wordCount(writing.model), lesson.id).toBeGreaterThanOrEqual(60);
      }
    }
  });
  it('houdt antwoorden, kaartjes, feedback en bronverwijzingen consistent', () => {
    const sources = new Set(argumentSources.map((source) => source.id));
    for (const lesson of argumentLessons) {
      expect(lesson.sourceIds.length, lesson.id).toBeGreaterThan(0);
      expect(lesson.sourceIds.every((id) => sources.has(id)), lesson.id).toBe(true);
      expect(new Set(lesson.exercises.map((exercise) => exercise.id)).size, lesson.id).toBe(lesson.exercises.length);
      if (lesson.checkpoint) {
        expect(lesson.exercises.filter((exercise) => exercise.kind !== 'reflection').length, lesson.id).toBeGreaterThanOrEqual(6);
        if (lesson.id !== 'master-checkpoint') expect(lesson.exercises.every((exercise) => exercise.kind !== 'reflection'), lesson.id).toBe(true);
      }
      for (const exercise of lesson.exercises) {
        expect(exercise.explanation.trim().length, exercise.id).toBeGreaterThan(30);
        if (exercise.kind === 'choice') {
          expect(exercise.options.length, exercise.id).toBeGreaterThanOrEqual(3);
          expect(exercise.options.filter((option) => option.id === exercise.answer), exercise.id).toHaveLength(1);
          expect(new Set(exercise.options.map((option) => option.id)).size, exercise.id).toBe(exercise.options.length);
          expect(new Set(exercise.options.map((option) => option.text)).size, exercise.id).toBe(exercise.options.length);
          expect(exercise.options.every((option) => option.feedback.trim().length > 20), exercise.id).toBe(true);
        } else if (exercise.kind !== 'reflection') {
          expect(exercise.cards.length, exercise.id).toBeGreaterThanOrEqual(3);
          expect(exercise.cards.every((card) => exercise.categories.some((category) => category.id === card.category)), exercise.id).toBe(true);
          expect(new Set(exercise.cards.map((card) => card.id)).size, exercise.id).toBe(exercise.cards.length);
        }
      }
    }
    expect(new Set(argumentSources.map((source) => source.id)).size).toBe(argumentSources.length);
    expect(argumentSources.every((source) => new URL(source.url).protocol === 'https:')).toBe(true);
  });
  it('sluit af met twee zelfstandige expertwerkstukken en behoudt acht objectieve toetsvragen', () => {
    const checkpoint = argumentLessons.find((lesson) => lesson.id === 'master-checkpoint')!;
    const objectives = checkpoint.exercises.filter((exercise) => exercise.kind !== 'reflection');
    const writings = checkpoint.exercises.filter((exercise) => exercise.kind === 'reflection');
    expect(checkpoint.minutes).toBeGreaterThanOrEqual(60);
    expect(objectives.map((exercise) => exercise.id)).toEqual(['mc1-keten', 'mc2-gezamenlijk', 'mc3-aanval', 'mc4-belangen', 'mc5-tegenspraak', 'mc6-posterior', 'mc7-likelihood', 'mc8-besluit']);
    expect(objectives.every((exercise) => exercise.kind === 'choice')).toBe(true);
    expect(writings.map((exercise) => exercise.id)).toEqual(['mc9-expertcasus-leiderschapsadvies', 'mc10-expertcasus-advies-herzien']);
    const limits = [[200, 250, 300], [180, 220, 280]] as const;
    for (const [index, writing] of writings.entries()) {
      const [minimum, modelMinimum, modelMaximum] = limits[index]!;
      expect(writing.minWords).toBeGreaterThanOrEqual(minimum);
      expect(wordCount(writing.model)).toBeGreaterThanOrEqual(modelMinimum);
      expect(wordCount(writing.model)).toBeLessThanOrEqual(modelMaximum);
      expect(wordCount(writing.scenario ?? '')).toBeGreaterThanOrEqual(100);
      expect(writing.rubric).toHaveLength(6);
      expect(new Set(writing.rubric).size).toBe(6);
      expect(writing.prompt).toMatch(/zelfbeoordeling/i);
      expect(writing.explanation).toMatch(/zelfbeoordel/i);
      expect(answerReady(writing, { ...emptyArgumentAnswer(), value: Array.from({ length: minimum - 1 }, () => 'woord').join(' ') })).toBe(false);
      expect(answerReady(writing, { ...emptyArgumentAnswer(), value: writing.model })).toBe(true);
      expect(gradeArgument(writing, { ...emptyArgumentAnswer(), value: writing.model })).toBeNull();
    }
    expect(writings[0]?.scenario).not.toBe(writings[1]?.scenario);
    const sevenCorrect = Object.fromEntries(objectives.map((exercise, index) => [exercise.id, index < 7 ? 1 : 0]));
    expect(lessonScore(checkpoint, { ...sevenCorrect, [writings[0]!.id]: 0, [writings[1]!.id]: 0 })).toBe(88);
    expect(lessonPassed(checkpoint, lessonScore(checkpoint, sevenCorrect))).toBe(true);
    expect(lessonPassed(checkpoint, lessonScore(checkpoint, Object.fromEntries(objectives.map((exercise, index) => [exercise.id, index < 6 ? 1 : 0]))))).toBe(false);
  });
});
