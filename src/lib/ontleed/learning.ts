/** Calendar days are stable across devices and match the Dutch course's learning schedule. */
export function learningDay(timestamp: number): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(timestamp));
}

export function retrievalEvidenceCount(record?: { successfulDays?: string[] }): number {
  return Math.min(2, new Set(record?.successfulDays ?? []).size);
}

export function isProductionQuestion(question: { kind: string }): boolean {
  return question.kind === 'type' || question.kind === 'order';
}

type LearningData = {
  completed: Record<string, unknown>;
  retrieval: Record<string, { successfulDays?: string[] }>;
  mistakes: Record<string, { lessonId: string; resolved: boolean }>;
};

/** Completion, delayed production and unresolved mistakes are separate observations. */
export function getLessonLearningStatus(lessonId: string, data: LearningData) {
  const practicedDays = retrievalEvidenceCount(data.retrieval[lessonId]);
  return {
    completed: Boolean(data.completed[lessonId]),
    practicedDays,
    evidenceComplete: practicedDays >= 2,
    mistakes: Object.values(data.mistakes).filter(item => item.lessonId === lessonId && !item.resolved).length,
  };
}
