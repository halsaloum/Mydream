import type { SentenceAnswer, SentenceExercise, SentenceLesson } from '@/content/sentences/types';

export const emptySentenceAnswer = (): SentenceAnswer => ({
  selected: [], diagnosisPassed: false, boundaries: [], segmentationPassed: false,
  choice: '', placements: {}, links: [], variant: '', order: [], text: '', checked: false, correct: false,
});

/** A repair may vary in casing, whitespace and its final full stop. Other punctuation matters. */
export function normalizeRepair(text: string): string {
  return text.normalize('NFC').trim().replace(/\s+/gu, ' ').toLocaleLowerCase('nl-NL').replace(/(?<!\.)\.$/u, '').trim();
}

function sameSequence<T>(actual: T[], expected: T[]): boolean {
  return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

function sameSet<T>(actual: T[], expected: T[]): boolean {
  return new Set(actual).size === actual.length && new Set(expected).size === expected.length
    && actual.length === expected.length && expected.every((value) => actual.includes(value));
}

export function diagnosisCorrect(exercise: SentenceExercise, answer: SentenceAnswer): boolean {
  if (exercise.kind === 'gate') return sameSet(answer.selected, exercise.diagnosis.targets);
  if (exercise.kind === 'debug') return sameSet(answer.selected, exercise.targets);
  return true;
}

export function segmentationCorrect(exercise: SentenceExercise, answer: SentenceAnswer): boolean {
  if (exercise.support !== 'half') return true;
  return !!exercise.segmentation && sameSet(answer.boundaries, exercise.segmentation.boundaries);
}

function stagesPassed(exercise: SentenceExercise, answer: SentenceAnswer): boolean {
  if (exercise.support === 'half' && (!answer.segmentationPassed || !segmentationCorrect(exercise, answer))) return false;
  if ((exercise.kind === 'gate' || exercise.kind === 'debug') && (!answer.diagnosisPassed || !diagnosisCorrect(exercise, answer))) return false;
  return true;
}

export function effectivePlacements(exercise: Extract<SentenceExercise, { kind: 'slots' }>, answer: SentenceAnswer): Record<string, string[]> {
  return Object.keys(answer.placements).length ? answer.placements : exercise.initial;
}

function placementsReady(exercise: Extract<SentenceExercise, { kind: 'slots' }>, answer: SentenceAnswer): boolean {
  const placements = effectivePlacements(exercise, answer);
  if (Object.keys(placements).some((id) => !exercise.slots.some((slot) => slot.id === id))) return false;
  const placed = exercise.slots.flatMap((slot) => placements[slot.id] ?? []);
  return sameSet(placed, exercise.blocks.map((block) => block.id))
    && exercise.slots.every((slot) => slot.capacity === undefined || (placements[slot.id]?.length ?? 0) <= slot.capacity);
}

/** Readiness includes the prerequisite stages, so direct store calls cannot skip them. */
export function answerReady(exercise: SentenceExercise, answer: SentenceAnswer): boolean {
  if (!stagesPassed(exercise, answer)) return false;
  if (exercise.kind === 'slots') return placementsReady(exercise, answer);
  if (exercise.kind === 'gate') return exercise.options.some((option) => option.id === answer.choice);
  if (exercise.kind === 'tether') return answer.links.length > 0 && answer.links.every((link) => exercise.tokens.some((token) => token.id === link.from) && exercise.tokens.some((token) => token.id === link.to));
  if (exercise.kind === 'mutate') {
    const variant = exercise.variants.find((item) => item.id === answer.variant);
    return !!variant && sameSet(answer.order, variant.blocks.map((block) => block.id));
  }
  return answer.text.trim().length > 0;
}

/** Binary practice feedback: each required part must be supported by the actual answer. */
export function gradeSentence(exercise: SentenceExercise, answer: SentenceAnswer): boolean {
  if (!answerReady(exercise, answer)) return false;
  if (exercise.kind === 'slots') {
    const placements = effectivePlacements(exercise, answer);
    return exercise.accept.some((accepted) => exercise.slots.every((slot) => sameSequence(placements[slot.id] ?? [], accepted[slot.id] ?? [])));
  }
  if (exercise.kind === 'gate') return answer.choice === exercise.answer;
  if (exercise.kind === 'tether') {
    const key = (link: { from: string; to: string }) => JSON.stringify([link.from, link.to]);
    return sameSet(answer.links.map(key), exercise.links.map(key));
  }
  if (exercise.kind === 'mutate') {
    const target = exercise.variants.find((variant) => variant.id === exercise.target);
    return answer.variant === exercise.target && !!target && sameSequence(answer.order, target.order);
  }
  return exercise.repairs.some((repair) => normalizeRepair(repair) === normalizeRepair(answer.text));
}

/** Saved flags only remain valid when the corresponding saved evidence is still correct. */
export function sanitizeSentenceAnswer(exercise: SentenceExercise, answer: SentenceAnswer): SentenceAnswer {
  const diagnosisPassed = answer.diagnosisPassed && diagnosisCorrect(exercise, answer);
  const segmentationPassed = answer.segmentationPassed && segmentationCorrect(exercise, answer);
  const restored = { ...answer, diagnosisPassed, segmentationPassed };
  const checked = restored.checked && answerReady(exercise, restored);
  return { ...restored, checked, correct: checked && gradeSentence(exercise, restored) };
}

export function lessonExercises(lesson: SentenceLesson): SentenceExercise[] {
  return [...lesson.arena, ...lesson.debugger];
}

export function lessonProgress(lesson: SentenceLesson, answers: Record<string, SentenceAnswer>): { solved: number; total: number } {
  const exercises = lessonExercises(lesson);
  return { total: exercises.length, solved: exercises.filter((exercise) => {
    const answer = answers[exercise.id];
    return !!answer?.checked && gradeSentence(exercise, answer);
  }).length };
}

export function lessonSolved(lesson: SentenceLesson, answers: Record<string, SentenceAnswer>): boolean {
  if (lesson.arena.length !== 6 || lesson.debugger.length !== 4) return false;
  const exercises = lessonExercises(lesson);
  if (new Set(exercises.map((exercise) => exercise.id)).size !== 10) return false;
  return lessonProgress(lesson, answers).solved === 10;
}

/** Accuracy describes the first checked practice answers, without claiming mastery. */
export function lessonAccuracy(lesson: SentenceLesson, firstTry: Record<string, number>): number {
  const exercises = lessonExercises(lesson);
  return exercises.length ? Math.round(100 * exercises.reduce((sum, exercise) => sum + (firstTry[exercise.id] === 1 ? 1 : 0), 0) / exercises.length) : 0;
}
