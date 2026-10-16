'use client';

import type { ArgumentLesson } from '@/content/argumentation/types';
import { emptyArgumentAnswer, wordCount, type ArgumentAnswer } from '@/lib/argumentation/learning';
import { ArgumentExerciseView } from './exercise-view';

/** Models appear only after every independent response has been submitted. */
export function ArgumentCheckpointReview({ lesson, answers, onChange }: {
  lesson: ArgumentLesson;
  answers: Record<string, ArgumentAnswer>;
  onChange: (exerciseId: string, patch: Partial<ArgumentAnswer>) => void;
}) {
  const writings = lesson.exercises.filter((exercise) => exercise.kind === 'reflection');
  return <section className="space-y-8" aria-label="Zelfcontrole na de toetsronde">
    <div><h2 className="font-display text-title font-bold">Vergelijk en herzie je eigen analyses</h2><p className="mt-3 text-body leading-relaxed text-ink-muted">Je eerste teksten zijn vastgelegd vóór de modellen zichtbaar werden. Vergelijk nu elk criterium met jouw tekst en verbeter wat ontbreekt. Deze zelfcontrole bepaalt geen objectieve inhoudelijke score.</p></div>
    {writings.map((exercise) => <article key={exercise.id} className="space-y-4 border-t border-line pt-7">
      {answers[exercise.id]?.reasoning && <details className="rounded-control border border-line bg-sunken p-4"><summary className="cursor-pointer text-small font-bold">Jouw eerste zelfstandige versie</summary><p className="mt-3 whitespace-pre-line text-small leading-relaxed">{answers[exercise.id]!.reasoning}</p></details>}
      <ArgumentExerciseView exercise={exercise} answer={answers[exercise.id] ?? emptyArgumentAnswer()} onChange={(patch) => onChange(exercise.id, patch)} allowRevision />
    </article>)}
  </section>;
}

export function checkpointReviewReady(lesson: ArgumentLesson, answers: Record<string, ArgumentAnswer>): boolean {
  return lesson.exercises.every((exercise) => {
    const answer = answers[exercise.id];
    return Boolean(answer?.checked && (exercise.kind !== 'reflection' || (wordCount(answer.value) >= exercise.minWords && exercise.rubric.every((_, index) => answer.rubric[String(index)]))));
  });
}

export function ArgumentCheckpointFeedback({ lesson, answers }: { lesson: ArgumentLesson; answers: Record<string, ArgumentAnswer> }) {
  return <details className="rounded-card border border-line bg-sunken p-5"><summary className="cursor-pointer font-display font-bold">Bekijk de feedback op alle toetsvragen</summary><div className="mt-5 space-y-6">{lesson.exercises.filter((exercise) => exercise.kind !== 'reflection').map((exercise, index) => <article key={exercise.id} className="border-t border-line pt-4"><h3 className="font-bold">{index + 1}. {exercise.prompt}</h3>{exercise.kind === 'choice' && <><p className="mt-2 text-small text-ink-muted">Jouw antwoord: {exercise.options.find((option) => option.id === answers[exercise.id]?.value)?.text ?? 'Geen geldig antwoord'}</p><p className="mt-2 text-small font-semibold">Best onderbouwde antwoord: {exercise.options.find((option) => option.id === exercise.answer)?.text}</p><p className="mt-2 text-small leading-relaxed">{exercise.options.find((option) => option.id === answers[exercise.id]?.value)?.feedback}</p></>}<p className="mt-3 text-small leading-relaxed">{exercise.explanation}</p></article>)}</div></details>;
}
