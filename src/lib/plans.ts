import { lessonEntries } from '@/content/catalog';
import { buildPlan, type PlanStep } from '@/engine/plan';

/** Koppelt inhoud aan de engine: het lesplan van elke les en een opzoektabel op stapsleutel. */
const plans = new Map<string, PlanStep[]>(lessonEntries.map((entry) => [entry.lesson.id, buildPlan(entry.lesson)]));
const steps = new Map<string, PlanStep>([...plans.values()].flat().map((item) => [item.key, item]));

export function planFor(lessonId: string): PlanStep[] | undefined {
  return plans.get(lessonId);
}

export function lookupStep(key: string): PlanStep | undefined {
  return steps.get(key);
}
