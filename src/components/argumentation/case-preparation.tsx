'use client';

import { ArrowRight, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { wordCount, emptyArgumentAnswer } from '@/lib/argumentation/learning';
import { useArgumentation, type ArgumentSession } from '@/state/argumentation';
import type { ArgumentInquiry } from '@/content/argumentation/inquiries';

export function CasePreparation({ lessonId, inquiry, session }: { lessonId: string; inquiry: ArgumentInquiry; session: ArgumentSession }) {
  const key = `inquiry-${lessonId}`;
  const answer = session.answers[key] ?? emptyArgumentAnswer();
  const revealed = answer.checked || session.finished;
  return <section aria-label="Denk eerst zelf" className="space-y-4 rounded-card border-2 border-blue-line bg-blue-soft/40 p-5 sm:p-6">
    <h3 className="flex items-center gap-2 font-display text-title-sm font-bold text-blue-ink"><MessageSquareText aria-hidden className="size-5" />Denk eerst zelf</h3>
    <p className="whitespace-pre-line text-body leading-relaxed text-ink-soft">{inquiry.scenario}</p>
    <p className="font-bold leading-relaxed">{inquiry.prompt}</p>
    <label className="block text-small font-bold">Jouw eerste analyse<textarea value={answer.reasoning} readOnly={revealed} onChange={(event) => useArgumentation.getState().answer(lessonId, key, { reasoning: event.target.value })} rows={4} placeholder="Welke reden draagt het voorstel? Welke aanname of tegenwerping maakt het verschil?" className="mt-2 w-full resize-y rounded-control border border-line-strong bg-surface p-4 text-body leading-relaxed" /></label>
    {!revealed ? <div className="space-y-2"><Button variant="accent" disabled={wordCount(answer.reasoning) < 8} onClick={() => useArgumentation.getState().check(lessonId, key, null)}>Vergelijk mijn redenering<ArrowRight aria-hidden className="size-4" /></Button><p className="text-caption text-ink-muted">Schrijf minstens acht woorden voordat je de uitwerking ziet. Deze denkstap heeft geen automatische score.</p></div> : <div className="space-y-4 border-t border-blue-line pt-5"><div className="rounded-control border border-blue-line bg-surface p-4"><h4 className="font-display font-bold text-blue-ink">Een beargumenteerde uitwerking</h4><p className="mt-3 whitespace-pre-line text-body leading-relaxed text-ink-soft">{inquiry.model}</p></div><label className="block text-small font-bold leading-relaxed">{inquiry.followUp}<textarea value={answer.value} readOnly={session.finished} onChange={(event) => useArgumentation.getState().answer(lessonId, key, { value: event.target.value })} rows={4} placeholder="Wat verander je in je analyse, en waarom?" className="mt-2 w-full resize-y rounded-control border border-line-strong bg-surface p-4 text-body leading-relaxed" /></label><p className="text-caption text-ink-muted">Je eerste analyse en herziening blijven lokaal bewaard. Je vergelijkt de onderbouwing zelf; de tekst wordt niet automatisch nagekeken.</p></div>}
  </section>;
}
