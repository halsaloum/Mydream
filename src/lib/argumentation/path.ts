import type { ArgumentLesson } from '@/content/argumentation/types';

type CompletionRecords = Record<string, { completedAt: string | null } | undefined>;

export function nextPathLesson(lessons: readonly ArgumentLesson[], records: CompletionRecords) {
  return lessons.find((lesson) => !records[lesson.id]?.completedAt);
}

export function lessonAvailable(lessonId: string, lessons: readonly ArgumentLesson[], records: CompletionRecords): boolean {
  if (records[lessonId]?.completedAt) return true;
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index >= 0 && lessons.slice(0, index).every((lesson) => records[lesson.id]?.completedAt);
}

export function moduleAvailable(moduleId: string, lessons: readonly ArgumentLesson[], records: CompletionRecords): boolean {
  const first = lessons.find((lesson) => lesson.moduleId === moduleId);
  return Boolean(first && lessonAvailable(first.id, lessons, records));
}
