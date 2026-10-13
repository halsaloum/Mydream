import type { StepInput } from '../schema';

/** Lesgebonden begeleiding en nieuwe toepassingsopdrachten. */
export type LessonGuidance = {
  goal: string;
  startingPoint: string;
  strategy: string[];
  selfCheck: string[];
};

export type LessonUpgrade = {
  guidance: LessonGuidance;
  steps: StepInput[];
};
