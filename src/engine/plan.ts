import type { Lesson, Panel, Step } from '@/content/schema';
import { fingerprint } from './hash';

/**
 * Het lesplan: de reeks stappen die de leerling doorloopt.
 *
 * Zoals in de oorspronkelijke app worden "snelle checks" (`panel.quiz`) uit de uitleg gehaald
 * en direct na die uitleg als losse meerkeuzevraag aangeboden. Zo blijft uitleg uitleg,
 * en telt elke check als echte oefening.
 */
export type PlanStep = {
  /** Stabiele sleutel: les, positie en een vingerafdruk van de inhoud. */
  key: string;
  lessonId: string;
  step: Step;
  source: { stepIndex: number; panelIndex?: number };
};

export const PANEL_WIDGETS = [
  'split',
  'mark',
  'build',
  'swap',
  'alpha',
  'wheel',
  'blend',
  'vowels',
  'grid',
  'tableau',
  'sonority',
  'tree',
  'bracket',
  'paradigm',
  'phrase',
] as const;
export type PanelWidget = (typeof PANEL_WIDGETS)[number];

export function panelWidgets(panel: Panel): PanelWidget[] {
  return PANEL_WIDGETS.filter((widget) => panel[widget] !== undefined);
}

export { isScored as isGraded, stepMode } from './kinds';

function makeKey(lessonId: string, local: string, step: Step) {
  return `${lessonId}:${local}#${fingerprint(step)}`;
}

export function buildPlan(lesson: Lesson): PlanStep[] {
  return lesson.steps.flatMap((step, stepIndex): PlanStep[] => {
    const local = step.id ?? `s${stepIndex}`;
    if (step.kind !== 'explain' || !step.panels.some((panel) => panel.quiz)) {
      return [{ key: makeKey(lesson.id, local, step), lessonId: lesson.id, step, source: { stepIndex } }];
    }
    const explain: Step = { ...step, panels: step.panels.map(({ quiz: _quiz, ...panel }) => panel) };
    const checks = step.panels.flatMap((panel, panelIndex): PlanStep[] => {
      if (!panel.quiz) return [];
      const choice: Step = {
        kind: 'choice',
        prompt: panel.quiz.q,
        before: '',
        after: '',
        options: panel.quiz.options,
        answer: panel.quiz.answer,
        why: panel.quiz.why,
      };
      return [
        {
          key: makeKey(lesson.id, `${local}:q${panelIndex}`, choice),
          lessonId: lesson.id,
          step: choice,
          source: { stepIndex, panelIndex },
        },
      ];
    });
    return [{ key: makeKey(lesson.id, local, explain), lessonId: lesson.id, step: explain, source: { stepIndex } }, ...checks];
  });
}

/** Vingerafdruk van een heel plan; verandert als de les inhoudelijk verandert. */
export function planFingerprint(plan: readonly PlanStep[]): string {
  return fingerprint(plan.map((item) => item.key).join('|'));
}
