import type { OntleedLesson } from './types';
import { MORPHOLOGY_BASIS } from './morphology-basis';
import { MORPHOLOGY_STRUCTURE } from './morphology-structure';
import { MORPHOLOGY_PATTERNS } from './morphology-patterns';
import { MORPHOLOGY_RESEARCH } from './morphology-research';

export const MORPHOLOGY_LESSONS: OntleedLesson[] = [
  ...MORPHOLOGY_BASIS,
  ...MORPHOLOGY_STRUCTURE,
  ...MORPHOLOGY_PATTERNS,
  ...MORPHOLOGY_RESEARCH,
];
