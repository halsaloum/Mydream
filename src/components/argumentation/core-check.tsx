'use client';

import { CheckCircle2, Lightbulb } from 'lucide-react';
import type { CoreCheck } from '@/content/argumentation/core-checks';
import { cn } from '@/lib/cn';
import { useArgumentation, type ArgumentSession } from '@/state/argumentation';

export function CoreCheckView({ lessonId, check, session }: { lessonId: string; check: CoreCheck; session: ArgumentSession }) {
  const key = `core-${lessonId}`;
  const answer = session.answers[key];
  const selected = check.options.find((option) => option.id === answer?.value);
  const correct = selected?.id === check.answer;
  return <section aria-label="Probeer deze denkstap" className="space-y-4 rounded-card border-2 border-blue-line bg-blue-soft/40 p-5 sm:p-6">
    <p className="text-caption font-bold tracking-wider text-blue-ink uppercase">Een nieuw geval</p><h3 className="font-display text-title-sm font-bold text-ink">Probeer deze denkstap</h3><p className="whitespace-pre-line text-body leading-relaxed text-ink-soft">{check.scenario}</p><fieldset className="space-y-3"><legend className="mb-3 font-display text-body leading-relaxed font-bold text-ink">{check.prompt}</legend>{check.options.map((option, index) => {
      const chosen = selected?.id === option.id;
      return <div key={option.id} className={cn('rounded-control border-2 focus-within:ring-2 focus-within:ring-blue-ink focus-within:ring-offset-2', chosen ? correct ? 'border-green-line bg-green-soft' : 'border-orange-line bg-orange-soft' : 'border-line bg-white')}><label className="relative flex min-h-12 cursor-pointer items-start gap-3 rounded-control p-4 text-body font-semibold leading-relaxed"><input type="radio" name={`core-${lessonId}`} checked={chosen} disabled={session.finished} onChange={() => useArgumentation.getState().answer(lessonId, key, { value: option.id, checked: true, score: option.id === check.answer ? 1 : 0 })} className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default" /><span aria-hidden="true" className={cn('pointer-events-none grid size-8 shrink-0 place-items-center rounded-control font-display text-caption font-bold', chosen ? correct ? 'text-green-ink' : 'text-orange-ink' : 'text-ink-muted')}>{String.fromCharCode(65 + index)}</span><span className={cn('pointer-events-none min-w-0 flex-1 pt-0.5', chosen && (correct ? 'text-green-ink' : 'text-orange-ink'))}>{option.text}</span></label>{chosen && <div role="status" className="mx-4 border-t border-current/10 pt-3 pb-4"><p className={cn('flex items-center gap-2 font-display text-small font-bold', correct ? 'text-green-ink' : 'text-orange-ink')}>{correct ? <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" /> : <Lightbulb aria-hidden="true" className="size-4 shrink-0" />}{correct ? 'Deze stap klopt voor dit geval.' : 'Bekijk de verbinding nog eens.'}</p><p className="mt-2 text-small leading-relaxed text-ink-soft">{option.feedback}</p></div>}</div>;
    })}</fieldset><p className="text-caption leading-relaxed text-ink-muted">Dit is begeleide oefening en telt niet mee in je toetsresultaat. {session.finished ? 'Je bewaarde keuze blijft hier zichtbaar.' : 'Gebruik de uitleg om je keuze te herzien.'}</p>
  </section>;
}
