import { WRITING_TEACHING } from './teaching-writing';
import { SEMANTICS_TEACHING } from './teaching-semantics';
import { MORPHOLOGY_TEACHING } from './teaching-morphology';
import { SYNTAX_TEACHING } from './teaching-syntax';
import type { OntleedLesson, SectionTeaching } from './types';

export const SECTION_TEACHING: Record<string, SectionTeaching[]> = {
  ...WRITING_TEACHING,
  ...SEMANTICS_TEACHING,
  ...MORPHOLOGY_TEACHING,
  ...SYNTAX_TEACHING,
};

/** Keep stable curriculum identifiers and exercise answers while adding authored explanation layers. */
export function withSectionTeaching(lesson: OntleedLesson): OntleedLesson {
  const teaching = SECTION_TEACHING[lesson.id];
  if (!teaching) return lesson;
  return { ...lesson, sections: lesson.sections.map((section, index) => ({ ...section, teaching: teaching[index] })) };
}
