import type { LessonInput } from '../schema';
import { ARGUMENT_FUNDAMENT } from './argumentatie/fundament';
import { ARGUMENT_ONDERZOEK } from './argumentatie/onderzoek';
import { ARGUMENT_DIALOOG } from './argumentatie/dialoog';
import { ARGUMENT_MEESTERSCHAP } from './argumentatie/meesterschap';

/** Een doorlopende leerlijn: herkennen → toetsen → weerleggen → zelfstandig betogen en herzien. */
export const ARGUMENTATIE_LESSONS: readonly LessonInput[] = [
  ...ARGUMENT_FUNDAMENT,
  ...ARGUMENT_ONDERZOEK,
  ...ARGUMENT_DIALOOG,
  ...ARGUMENT_MEESTERSCHAP,
];
