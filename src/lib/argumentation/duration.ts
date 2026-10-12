import { foundationForLesson } from '@/content/argumentation/foundations';
import type { ArgumentLesson } from '@/content/argumentation/types';

/** Reading and trying a new concept adds about four minutes; extra videos have their own duration. */
export function argumentLessonMinutes(lesson: ArgumentLesson): number {
  return lesson.minutes + foundationForLesson(lesson.id).length * 4;
}
