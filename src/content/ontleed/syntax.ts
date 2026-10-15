import type { OntleedLesson } from './types';
import { ZINSDELEN_LESSONS } from './syntax-zinsdelen';
import { ZINSBOUW_LESSONS } from './syntax-zinsbouw';

/** Original explanations and exercises, authored after full source reading. */
export const SYNTAX_LESSONS: OntleedLesson[] = [...ZINSDELEN_LESSONS, ...ZINSBOUW_LESSONS];
