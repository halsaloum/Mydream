import { foundationTeaching } from './teaching-foundation';
import { structureTeaching } from './teaching-structure';
import { compositionTeaching } from './teaching-composition';

export const sentenceTeaching = [...foundationTeaching, ...structureTeaching, ...compositionTeaching];
export const sentenceTeachingById = new Map(sentenceTeaching.map((teaching) => [teaching.lessonId, teaching]));
export type { SentenceTeaching } from './teaching-types';
