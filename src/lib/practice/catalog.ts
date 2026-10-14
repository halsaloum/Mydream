import { lessonEntries } from '@/content/catalog';
import { argumentLessons } from '@/content/argumentation';
import { sentenceLessons } from '@/content/sentences';
import { StepSchema, type Step, type StepInput } from '@/content/schema';
import { fingerprint } from '@/engine/hash';
import { isScored, stepMode } from '@/engine/kinds';
import type { PlanStep } from '@/engine/plan';
import { planFor } from '@/lib/plans';

export type PracticeCourse = 'schrijven' | 'argumentatie' | 'zinnen';
export type PracticeTopic = {
  key: string; course: PracticeCourse; lessonId: string; title: string; href: string;
  questions: PlanStep[];
};

function adapted(lessonId: string, id: string, input: StepInput, index: number): PlanStep {
  const step = StepSchema.parse(input);
  return { key: `ophalen:${lessonId}:${id}#${fingerprint(step)}`, lessonId, step, source: { stepIndex: index } };
}

/** Oefent alleen al uitgelegde stof. Open schrijfwerk krijgt geen automatische goed/fout-score. */
export const practiceTopics: readonly PracticeTopic[] = [
  ...lessonEntries.map(({ lesson }): PracticeTopic => ({
    key: `schrijven:${lesson.id}`, course: 'schrijven', lessonId: lesson.id, title: lesson.title,
    href: `/les/${lesson.id}`,
    questions: (planFor(lesson.id) ?? []).filter(({ step }) => isScored(step) && stepMode(step) === 'graded' && step.kind !== 'write')
      .map((question) => ({ ...question, step: retrievalStep(question.step) })),
  })),
  ...argumentLessons.map((lesson): PracticeTopic => ({
    key: `argumentatie:${lesson.id}`, course: 'argumentatie', lessonId: lesson.id,
    title: lesson.title, href: `/argumentatie/les/${lesson.id}`,
    questions: lesson.exercises.flatMap((exercise, index) => {
      if (exercise.kind === 'reflection') return [];
      if (exercise.kind === 'choice') return [adapted(lesson.id, exercise.id, {
        kind: 'choice', prompt: exercise.prompt, before: exercise.scenario ?? '', after: '',
        options: exercise.options.map((option) => option.text),
        answer: exercise.options.find((option) => option.id === exercise.answer)!.text,
        why: exercise.explanation,
      }, index)];
      if (exercise.categories.length > 4) return exercise.cards.map((card, cardIndex) => adapted(lesson.id, `${exercise.id}-kaart-${cardIndex + 1}`, {
        kind: 'choice',
        prompt: `${exercise.scenario ? `${exercise.scenario}\n\n` : ''}${exercise.claim ? `${exercise.claim}\n\n` : ''}Welke rol heeft dit kaartje in de redenering?`,
        before: card.text, after: '', options: exercise.categories.map((category) => category.label),
        answer: exercise.categories.find((category) => category.id === card.category)!.label,
        why: exercise.explanation,
      }, index));
      return [adapted(lesson.id, exercise.id, {
        kind: 'sort', prompt: `${exercise.scenario ? `${exercise.scenario}\n\n` : ''}${exercise.claim ? `${exercise.claim}\n\n` : ''}${exercise.prompt}`,
        buckets: exercise.categories.map((category) => category.label),
        items: exercise.cards.map((card) => ({ t: card.text, b: exercise.categories.findIndex((category) => category.id === card.category) })),
        why: exercise.explanation,
      }, index)];
    }),
  })),
  ...sentenceLessons.map((lesson): PracticeTopic => ({
    key: `zinnen:${lesson.id}`, course: 'zinnen', lessonId: lesson.id,
    title: lesson.title, href: `/zinnen/les/${lesson.id}`,
    questions: lesson.debugger.map((exercise, index) => adapted(lesson.id, exercise.id, {
      kind: 'rewrite', prompt: `${exercise.prompt}\n\n${exercise.instruction}\nSchrijf de volledige zin met de juiste hoofdletters en leestekens.`,
      source: exercise.tokens.map((token) => token.text).join(' '),
      accept: exercise.repairs, strict: true, why: exercise.explanation,
    }, index)),
  })),
];

const topics = new Map(practiceTopics.map((topic) => [topic.key, topic]));
const questions = new Map(practiceTopics.flatMap((topic) => topic.questions.map((question) => [question.key, question] as const)));
const owners = new Map(practiceTopics.flatMap((topic) => topic.questions.map((question) => [question.key, topic.key] as const)));
export const practiceTopic = (key: string) => topics.get(key);
export const lookupPracticeStep = (key: string) => questions.get(key);
export const practiceTopicForQuestion = (key: string) => owners.get(key);

/** Voorbeelden en begeleide keuzes gaan pas weer open na het zelfstandig antwoorden. */
export function retrievalStep(step: Step): Step {
  if (step.kind === 'type') return { ...step, hint: '' };
  return step;
}
