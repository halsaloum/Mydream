'use client';

import { Check, CornerDownRight, Lightbulb } from 'lucide-react';
import type { LessonScaffold } from '@/content/argumentation/scaffolds';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { emptyArgumentAnswer } from '@/lib/argumentation/learning';
import { useArgumentation, type ArgumentSession } from '@/state/argumentation';

export function LessonWarmup({ lessonId, scaffold, session }: { lessonId: string; scaffold: LessonScaffold; session: ArgumentSession }) {
  const key = `warmup-${lessonId}`;
  const answer = session.answers[key] ?? emptyArgumentAnswer();
  const correct = answer.value === scaffold.answer;
  const selected = scaffold.options.find((option) => option.id === answer.value);
  return <section aria-label="Begin met één kleine stap" className="space-y-4 rounded-card border-2 border-blue-line bg-surface p-5 sm:p-6">
    <p className="flex items-center gap-2 text-caption font-bold tracking-wider text-blue-ink uppercase"><CornerDownRight aria-hidden className="size-4" />Begin met één kleine stap</p>
    <p className="text-body leading-relaxed text-ink-soft">{scaffold.context}</p>
    <h2 className="font-display text-title-sm font-bold">{scaffold.question}</h2>
    <fieldset className="space-y-2"><legend className="sr-only">Kies één antwoord op de eerste vraag</legend>{scaffold.options.map((option) => <label key={option.id} className={cn('flex cursor-pointer items-start gap-3 rounded-control border-2 p-4 text-body leading-relaxed', answer.value === option.id ? correct ? 'border-green-line bg-green-soft' : 'border-orange-line bg-orange-soft' : 'border-line bg-sunken')}><input type="radio" name={`warmup-${lessonId}`} checked={answer.value === option.id} disabled={session.finished} onChange={() => useArgumentation.getState().answer(lessonId, key, { value: option.id, checked: true, score: option.id === scaffold.answer ? 1 : 0 })} className="mt-1 size-4 shrink-0 accent-[var(--color-blue-ink)]" />{option.text}</label>)}</fieldset>
    {selected && <div role="status" className={cn('rounded-control border p-4', correct ? 'border-green-line bg-green-soft' : 'border-orange-line bg-orange-soft')}><h3 className="flex items-center gap-2 font-display text-small font-bold">{correct ? <Check aria-hidden className="size-4" /> : <Lightbulb aria-hidden className="size-4" />}{correct ? 'Deze eerste stap staat.' : 'Kijk nog eens naar de vraag.'}</h3><p className="mt-2 text-small leading-relaxed text-ink-soft">{selected.feedback}</p>{correct && <p className="mt-3 text-small font-semibold leading-relaxed">{scaffold.bridge}</p>}</div>}
    {!correct && selected && <Button variant="ghost" size="sm" onClick={() => useArgumentation.getState().answer(lessonId, key, { value: '', checked: false, score: null })}>Opnieuw bekijken</Button>}
    <p className="text-caption text-ink-muted">Deze startvraag is oefening met begeleiding en telt niet mee in je score. De uitleg helpt je verder; later in de les krijg je meer verantwoordelijkheid.</p>
  </section>;
}
