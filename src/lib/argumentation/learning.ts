import type { ArgumentExercise, ArgumentLesson } from '@/content/argumentation/types';

export type ArgumentAnswer = {
  value: string;
  placements: Record<string, string>;
  rubric: Record<string, boolean>;
  checked: boolean;
  score: number | null;
  confidence: number | null;
  reasoning: string;
};

export const emptyArgumentAnswer = (): ArgumentAnswer => ({ value: '', placements: {}, rubric: {}, checked: false, score: null, confidence: null, reasoning: '' });

export function wordCount(text: string): number {
  return text.trim().split(/\s+/u).filter(Boolean).length;
}

export function answerReady(exercise: ArgumentExercise, answer: ArgumentAnswer): boolean {
  if (exercise.kind === 'choice') return exercise.options.some((option) => option.id === answer.value);
  if (exercise.kind === 'reflection') return wordCount(answer.value) >= exercise.minWords;
  return exercise.cards.every((card) => exercise.categories.some((category) => category.id === answer.placements[card.id]));
}

/** Reflections are self-assessed; they never contribute to an objective score. */
export function gradeArgument(exercise: ArgumentExercise, answer: ArgumentAnswer): number | null {
  if (exercise.kind === 'reflection') return null;
  if (exercise.kind === 'choice') return answer.value === exercise.answer ? 1 : 0;
  return exercise.cards.filter((card) => answer.placements[card.id] === card.category).length / exercise.cards.length;
}

export function lessonScore(lesson: ArgumentLesson, firstTry: Record<string, number>): number {
  const scored = lesson.exercises.filter((exercise) => exercise.kind !== 'reflection');
  if (!scored.length) return 0;
  return Math.round(100 * scored.reduce((sum, exercise) => sum + (firstTry[exercise.id] ?? 0), 0) / scored.length);
}

export function lessonPassed(lesson: ArgumentLesson, score: number): boolean {
  return !lesson.checkpoint || score >= 80;
}

/** A transparent practice schedule, not a claim of a fitted adaptive memory model. */
export function nextReviewDays(score: number, attempts: number): number {
  return score < 80 ? 1 : [3, 7, 14, 30][Math.min(Math.max(attempts - 1, 0), 3)]!;
}
