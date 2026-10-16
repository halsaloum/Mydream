import { foundationLessons } from './foundation';
import { structureLessons } from './structure';
import { compositionLessons } from './composition';

export const sentenceLessons = [...foundationLessons, ...structureLessons, ...compositionLessons];
export const sentenceLessonById = new Map(sentenceLessons.map((lesson) => [lesson.id, lesson]));
export { sentenceSources, sentenceSourceById } from './sources';
export type { SentenceLesson, SentenceExercise, SentenceAnswer } from './types';
