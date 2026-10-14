import { addDays, dayKey } from '@/lib/dates';
import { practiceTopics, type PracticeTopic } from './catalog';
import type { ProgressData } from '@/state/progress';
import type { ArgumentData } from '@/state/argumentation';
import type { SentenceData } from '@/state/sentences';

export type PracticeRecord = {
  sourceCompletedAt: string; due: string; lastDay: string | null;
  successfulDays: number; reviews: number; lastScore: number | null;
};
export type DueTopic = PracticeTopic & { completedAt: string; schedule: PracticeRecord };
/** Praktische intervallen voor korte kennischecks, geen bewezen optimaal persoonlijk geheugenschema. */
export const PRACTICE_INTERVALS = [1, 3, 7, 14, 30] as const;
export const PRACTICE_BATCH = 8;

export function initialPracticeRecord(completedAt: string): PracticeRecord {
  return { sourceCompletedAt: completedAt, due: addDays(dayKey(new Date(completedAt)), 1), lastDay: null, successfulDays: 0, reviews: 0, lastScore: null };
}

export function reviewPractice(record: PracticeRecord, score: number, today: string): PracticeRecord {
  const validScore = Math.max(0, Math.min(1, score));
  const anotherDay = record.lastDay !== today;
  const successfulDays = validScore < 1 ? 0 : record.successfulDays + (anotherDay ? 1 : 0);
  const interval = validScore < 1 ? 1 : PRACTICE_INTERVALS[Math.min(successfulDays, PRACTICE_INTERVALS.length - 1)]!;
  return { ...record, due: addDays(today, interval), lastDay: today, successfulDays, reviews: record.reviews + 1, lastScore: validScore };
}

export function completedPracticeTopics(
  progress: Pick<ProgressData, 'lessons'>, argumentsData: Pick<ArgumentData, 'records'>,
  sentences: Pick<SentenceData, 'records'>, records: Record<string, PracticeRecord>,
): DueTopic[] {
  return practiceTopics.flatMap((topic): DueTopic[] => {
    const completedAt = topic.course === 'schrijven' ? progress.lessons[topic.lessonId]?.lastCompletedAt
      : topic.course === 'zinnen' ? sentences.records[topic.lessonId]?.lastPracticedAt
        : argumentsData.records[topic.lessonId]?.completedAt ? argumentsData.records[topic.lessonId]?.lastPracticedAt : undefined;
    if (!completedAt || !Number.isFinite(Date.parse(completedAt)) || !topic.questions.length) return [];
    const previous = records[topic.key];
    const schedule = previous?.sourceCompletedAt === completedAt ? previous : initialPracticeRecord(completedAt);
    return [{ ...topic, completedAt, schedule }];
  });
}

export function duePracticeTopics(topics: readonly DueTopic[], today = dayKey()): DueTopic[] {
  return topics.filter((topic) => topic.schedule.due <= today)
    .sort((a, b) => a.schedule.due.localeCompare(b.schedule.due) || (a.schedule.lastScore ?? 1) - (b.schedule.lastScore ?? 1) || a.key.localeCompare(b.key));
}

/** Meng alleen reeds geleerde stof en bied één wisselende vraag per leerpunt aan. */
export function practiceBatch(due: readonly DueTopic[]): DueTopic[] {
  const queues = ['schrijven', 'zinnen', 'argumentatie'].map((course) => due.filter((topic) => topic.course === course));
  const batch: DueTopic[] = [];
  while (batch.length < PRACTICE_BATCH && queues.some((queue) => queue.length)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next && batch.length < PRACTICE_BATCH) batch.push(next);
    }
  }
  return batch;
}

export function practiceQuestion(topic: DueTopic) {
  // Begin met de zelfstandige toepassing aan het einde; wissel daarna van opdracht.
  return topic.questions[(topic.questions.length - 1 - topic.schedule.reviews % topic.questions.length + topic.questions.length) % topic.questions.length]!;
}
