import { describe, expect, it } from 'vitest';
import { lessonEntries } from '@/content/catalog';
import { argumentLessons } from '@/content/argumentation';
import { sentenceLessons } from '@/content/sentences';
import { StepSchema } from '@/content/schema';
import { evaluate } from '@/engine/grade';
import { initialResponse, type Response } from '@/engine/responses';
import { EMPTY_PROGRESS } from '@/state/progress';
import { EMPTY_ARGUMENTS } from '@/state/argumentation';
import { EMPTY_SENTENCES } from '@/state/sentences';
import { practiceTopics, lookupPracticeStep, practiceTopicForQuestion, retrievalStep } from './catalog';
import { completedPracticeTopics, duePracticeTopics, initialPracticeRecord, practiceBatch, practiceQuestion, reviewPractice } from './schedule';

describe('zelfstandig ophalen uit alle leergebieden', () => {
  it('geeft elk van de 171 lessen een echte beoordeelbare herhaalopdracht zonder vrije tekst te scoren', () => {
    expect(practiceTopics).toHaveLength(lessonEntries.length + argumentLessons.length + sentenceLessons.length);
    expect(new Set(practiceTopics.map((topic) => topic.key)).size).toBe(practiceTopics.length);
    for (const topic of practiceTopics) {
      expect(topic.questions.length, topic.key).toBeGreaterThan(0);
      for (const question of topic.questions) {
        expect(StepSchema.safeParse(question.step).success, question.key).toBe(true);
        expect(question.step.kind).not.toBe('write');
        expect(practiceTopicForQuestion(question.key)).toBe(topic.key);
        expect(lookupPracticeStep(question.key)).toBe(question);
      }
    }
  });

  it('behoudt alle correcte oplossingen van de aangepaste argument- en zinsopdrachten', () => {
    for (const topic of practiceTopics.filter((item) => item.course !== 'schrijven')) {
      for (const { step } of topic.questions) {
        const initial = initialResponse(step);
        let answer: Response = initial;
        if (step.kind === 'choice') answer = { kind: 'choice', value: step.answer };
        else if (step.kind === 'sort') answer = { kind: 'sort', assign: step.items.map((item) => item.b) };
        else if (step.kind === 'rewrite') {
          for (const value of step.accept) expect(evaluate(step, { kind: 'rewrite', value }).correct, `${topic.key}: ${value}`).toBe(true);
          continue;
        }
        expect(evaluate(step, answer).correct, topic.key).toBe(true);
      }
    }
  });

  it('plant geen onbekende of nog niet afgeronde lessen en start pas op een latere dag', () => {
    const at = '2026-10-14T09:00:00.000Z';
    const topics = completedPracticeTopics({ lessons: { l1: { attempts: 1, bestAccuracy: 100, lastAccuracy: 100, firstCompletedAt: at, lastCompletedAt: at } } }, EMPTY_ARGUMENTS, EMPTY_SENTENCES, {});
    expect(topics.map((topic) => topic.key)).toEqual(['schrijven:l1']);
    expect(duePracticeTopics(topics, '2026-10-14')).toEqual([]);
    expect(duePracticeTopics(topics, '2026-10-15')).toHaveLength(1);
    expect(completedPracticeTopics(EMPTY_PROGRESS, EMPTY_ARGUMENTS, EMPTY_SENTENCES, {})).toEqual([]);
  });

  it('verbergt invulhulp bij ophalen en begint bij de zelfstandige eindtoepassing', () => {
    const topic = practiceTopics.find((item) => item.key === 'schrijven:l1')!;
    const schedule = initialPracticeRecord('2026-10-01T09:00:00.000Z');
    expect(practiceQuestion({ ...topic, completedAt: schedule.sourceCompletedAt, schedule })).toBe(topic.questions.at(-1));
    const type = StepSchema.parse({ kind: 'type', prompt: 'Vul in.', before: '', after: '', hint: 'begin met b', answer: 'boek', why: 'Dit is het passende woord.' });
    expect(retrievalStep(type)).toMatchObject({ kind: 'type', hint: '' });
  });

  it('verlengt na ophalen op verschillende dagen, telt dezelfde dag niet nogmaals en herhaalt fouten sneller', () => {
    const initial = initialPracticeRecord('2026-10-14T09:00:00.000Z');
    const first = reviewPractice(initial, 1, '2026-10-15');
    expect(first).toMatchObject({ successfulDays: 1, due: '2026-10-18' });
    const sameDay = reviewPractice(first, 1, '2026-10-15');
    expect(sameDay.successfulDays).toBe(1);
    const second = reviewPractice(first, 1, '2026-10-18');
    expect(second).toMatchObject({ successfulDays: 2, due: '2026-10-25' });
    expect(reviewPractice(second, 0, '2026-10-25')).toMatchObject({ successfulDays: 0, due: '2026-10-26', lastScore: 0 });
    expect(reviewPractice(initialPracticeRecord('2026-10-31T09:00:00.000Z'), 1, '2026-11-01').due).toBe('2026-11-04');
  });

  it('mengt geleerde onderwerpen uit de drie cursussen met maximaal acht checks', () => {
    const due = practiceTopics.slice(0, 10).concat(practiceTopics.filter((topic) => topic.course !== 'schrijven').slice(0, 10), practiceTopics.filter((topic) => topic.course === 'zinnen').slice(0, 3)).map((topic) => ({ ...topic, completedAt: '2026-10-01T09:00:00.000Z', schedule: initialPracticeRecord('2026-10-01T09:00:00.000Z') }));
    const batch = practiceBatch(due);
    expect(batch).toHaveLength(8);
    expect(new Set(batch.slice(0, 3).map((topic) => topic.course)).size).toBe(3);
    expect(new Set(batch.map((topic) => topic.key)).size).toBe(batch.length);
    expect(practiceQuestion(batch[0]!).key).not.toBe(practiceQuestion({ ...batch[0]!, schedule: { ...batch[0]!.schedule, reviews: 1 } }).key);
  });
});
