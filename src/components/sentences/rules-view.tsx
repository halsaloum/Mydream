'use client';

import { ArrowDown, ArrowUpRight, GitBranch } from 'lucide-react';
import { useState } from 'react';
import { sentenceSourceById } from '@/content/sentences';
import type { SentenceLesson, SentenceRule } from '@/content/sentences/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export function SentenceRuleCard({ rule }: { rule: SentenceRule }) {
  return <article className="rounded-card border-2 border-blue-line bg-white p-5 sm:p-6">
    <p className="text-caption font-bold tracking-wider text-blue-ink uppercase">Wanneer gebruik je deze regel?</p>
    <p className="mt-3 text-body leading-relaxed text-ink"><strong>Als</strong> {rule.when.replace(/^als\s+/iu, '')}</p>
    <p className="mt-3 rounded-control bg-blue-soft p-4 text-body leading-relaxed text-blue-ink"><strong>Dan</strong> {rule.then.replace(/^dan\s+/iu, '')}</p>
    <p className="mt-4 text-small leading-relaxed text-ink-soft"><strong>Let hier ook op.</strong> {rule.nuance}</p>
    <ul aria-label="Bronnen bij deze regel" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-3">
      {rule.sourceIds.map((id) => {
        const source = sentenceSourceById.get(id);
        return source ? <li key={id}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-blue-ink underline underline-offset-4">{source.title} · {source.section}<ArrowUpRight aria-hidden className="size-3.5" /><span className="sr-only">, opent in een nieuw tabblad</span></a></li> : null;
      })}
    </ul>
  </article>;
}

export function RulesView({ lesson }: { lesson: SentenceLesson }) {
  const [choices, setChoices] = useState<Record<number, 'yes' | 'no'>>({});
  return <div className="space-y-7">
    <div><h2 className="font-display text-title font-extrabold">De regels bij elkaar</h2><p className="mt-2 text-body leading-relaxed text-ink-soft">Gebruik deze regels bij het schrijven. Lees ook wanneer ze gelden: een proef helpt je onderzoeken en heeft soms uitzonderingen.</p></div>
    <div className="space-y-4">{lesson.rules.map((rule) => <SentenceRuleCard key={rule.id} rule={rule} />)}</div>
    <section aria-labelledby="beslisroute" className="rounded-card border-2 border-line bg-surface p-5 sm:p-6">
      <h3 id="beslisroute" className="flex items-center gap-2 font-display text-title-sm font-bold"><GitBranch aria-hidden className="size-5 text-purple-ink" />Onderzoek je zin stap voor stap</h3>
      <p className="mt-2 text-small leading-relaxed text-ink-soft">Neem een voorbeeldzin of je eigen zin. Beantwoord de vragen en bekijk wat ieder antwoord betekent. Deze verkenning geeft geen cijfer.</p>
      <ol className="mt-5 space-y-3">{lesson.decision.map((step, index) => <li key={step.question}>
        {index > 0 && <ArrowDown aria-hidden className="mx-auto mb-3 size-5 text-ink-muted" />}
        <div className="rounded-control border border-purple-line bg-white p-4">
          <p className="font-display text-body font-bold">{index + 1}. {step.question}</p>
          <div className="mt-3 flex gap-2"><Button size="sm" variant={choices[index] === 'yes' ? 'accent' : 'secondary'} data-accent="purple" aria-pressed={choices[index] === 'yes'} onClick={() => setChoices((old) => ({ ...old, [index]: 'yes' }))}>Ja<span className="sr-only">: {step.question}</span></Button><Button size="sm" variant={choices[index] === 'no' ? 'accent' : 'secondary'} data-accent="purple" aria-pressed={choices[index] === 'no'} onClick={() => setChoices((old) => ({ ...old, [index]: 'no' }))}>Nee<span className="sr-only">: {step.question}</span></Button></div>
          {choices[index] && <p role="status" className={cn('mt-3 rounded-control p-3 text-small leading-relaxed', choices[index] === 'yes' ? 'bg-purple-soft text-purple-ink' : 'bg-sunken text-ink-soft')}>{step[choices[index]!]}</p>}
        </div>
      </li>)}</ol>
    </section>
  </div>;
}
