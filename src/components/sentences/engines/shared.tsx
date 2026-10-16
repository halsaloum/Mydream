'use client';

import { Check, Lightbulb, LockKeyhole } from 'lucide-react';
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Diagnosis, SentenceAnswer, SentenceExercise, SentenceToken } from '@/content/sentences/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export type SentenceEngineProps = {
  exercise: SentenceExercise;
  answer: SentenceAnswer;
  onChange: (patch: Partial<SentenceAnswer>) => void;
  onDiagnose: () => void | boolean;
  onSegment: () => void | boolean;
  disabled?: boolean;
};

const AttemptContext = createContext<() => void>(() => {});

export function toggleSelection(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function TokenSelection({ tokens, selected, onSelect, disabled, label }: {
  tokens: SentenceToken[]; selected: string[]; onSelect: (id: string) => void; disabled: boolean; label: string;
}) {
  return <div role="group" aria-label={label} className="flex flex-wrap gap-2 rounded-card border border-line bg-surface p-4 sm:p-5">
    {tokens.map((token, index) => <button key={token.id} type="button" disabled={disabled} aria-pressed={selected.includes(token.id)}
      aria-label={`${token.text} kiezen${tokens.filter((item) => item.text === token.text).length > 1 ? ` (woord ${index + 1})` : ''}`} onClick={() => onSelect(token.id)}
      className={cn('min-h-12 rounded-control border-2 px-3 py-2 font-serif text-lead transition-colors disabled:cursor-default', selected.includes(token.id) ? 'border-blue-ink bg-blue-soft text-blue-ink' : 'border-transparent bg-transparent text-ink hover:border-line-strong')}>
      {token.text}
    </button>)}
  </div>;
}

export function DiagnosisGate({ diagnosis, answer, onChange, onDiagnose, disabled = false }: {
  diagnosis: Diagnosis; answer: SentenceAnswer; onChange: SentenceEngineProps['onChange']; onDiagnose: SentenceEngineProps['onDiagnose']; disabled?: boolean;
}) {
  const [attempted, setAttempted] = useState(false);
  const reportAttempt = useContext(AttemptContext);
  return <section aria-label="Eerst onderzoeken" className="space-y-3">
    <p className="font-display font-bold">{diagnosis.prompt}</p>
    <p className="text-small text-ink-muted">Kies zelf de relevante woorden. Pas na een juiste diagnose gaat de volgende stap open.</p>
    <TokenSelection tokens={diagnosis.tokens} selected={answer.selected} label="Selecteer woorden voor je diagnose"
      disabled={disabled || answer.diagnosisPassed} onSelect={(id) => { setAttempted(false); onChange({ selected: toggleSelection(answer.selected, id) }); }} />
    {!answer.diagnosisPassed && <Button variant="secondary" disabled={disabled || answer.selected.length === 0}
      onClick={() => { setAttempted(true); reportAttempt(); onDiagnose(); }}>Controleer mijn diagnose</Button>}
    {(attempted || answer.diagnosisPassed) && <p role="status" className={cn('rounded-control border p-3 text-small leading-relaxed', answer.diagnosisPassed ? 'border-green-line bg-green-soft text-green-ink' : 'border-orange-line bg-orange-soft text-ink')}>
      {answer.diagnosisPassed ? <><Check aria-hidden className="mr-2 inline size-4" />{diagnosis.feedback}</> : 'Deze selectie verklaart het probleem nog niet volledig. Lees de vraag opnieuw en pas je selectie aan.'}
    </p>}
  </section>;
}

export function LockedNotice({ children }: { children: ReactNode }) {
  return <p className="flex items-start gap-2 rounded-control border border-line bg-sunken p-3 text-small leading-relaxed text-ink-muted"><LockKeyhole aria-hidden className="mt-0.5 size-4 shrink-0" />{children}</p>;
}

/** The gate is an actual stage: a hidden scaffold cannot silently satisfy it. */
export function FadedScaffoldingEngine({ exercise, answer, onChange, onSegment, disabled = false, children }: SentenceEngineProps & { children: (locked: boolean) => ReactNode }) {
  const [attempted, setAttempted] = useState(false);
  const [helpAllowed, setHelpAllowed] = useState(false);
  const segment = exercise.support === 'half' ? exercise.segmentation : undefined;
  const locked = disabled || Boolean(segment && !answer.segmentationPassed);
  const supportLabel = exercise.support === 'volledig' ? 'Met bouwsteun' : exercise.support === 'half' ? 'Eerst zelf opdelen' : 'Zelfstandig toepassen';
  return <AttemptContext.Provider value={() => setHelpAllowed(true)}><div className="space-y-5">
    <p className="text-caption font-bold tracking-wide text-blue-ink">{supportLabel}</p>
    {exercise.support === 'volledig' && <p className="rounded-control border border-blue-line bg-blue-soft p-4 text-small leading-relaxed"><Lightbulb aria-hidden className="mr-2 inline size-4" />{exercise.hint}</p>}
    {segment && <section aria-label="Zelf bouwblokken maken" className="space-y-3">
      <h3 className="font-display font-bold">{segment.prompt}</h3>
      <p className="text-small text-ink-muted">Tik op de grens tussen twee woorden. Maak bouwblokken van zinsdelen en werkwoordelijke delen. Houd woorden binnen één woordgroep bij elkaar.</p>
      <div className="flex flex-wrap items-center gap-y-2 rounded-card border border-line bg-surface p-4" role="group" aria-label="Kies grenzen tussen bouwblokken">
        {segment.tokens.map((token, index) => <span key={token.id} className="inline-flex items-center">
          <span className="px-1 font-serif text-lead text-ink">{token.text}</span>
          {index < segment.tokens.length - 1 && <button type="button" aria-pressed={answer.boundaries.includes(index + 1)}
            aria-label={`Grens na ${token.text} (woord ${index + 1})`} disabled={disabled || answer.segmentationPassed}
            onClick={() => { setAttempted(false); onChange({ boundaries: answer.boundaries.includes(index + 1) ? answer.boundaries.filter((value) => value !== index + 1) : [...answer.boundaries, index + 1].sort((a, b) => a - b) }); }}
            className={cn('mx-1 grid min-h-11 min-w-8 place-items-center rounded-control border-2 font-bold', answer.boundaries.includes(index + 1) ? 'border-blue-ink bg-blue-soft text-blue-ink' : 'border-transparent text-ink-muted hover:border-line')}>
            <span aria-hidden>{answer.boundaries.includes(index + 1) ? '|' : '·'}</span>
          </button>}
        </span>)}
      </div>
      {!answer.segmentationPassed && <Button variant="secondary" disabled={disabled}
        onClick={() => { setAttempted(true); setHelpAllowed(true); onSegment(); }}>Controleer mijn bouwblokken</Button>}
      {(attempted || answer.segmentationPassed) && <p role="status" className={cn('rounded-control border p-3 text-small', answer.segmentationPassed ? 'border-green-line bg-green-soft text-green-ink' : 'border-orange-line bg-orange-soft text-ink')}>
        {answer.segmentationPassed ? 'Je bouwblokken kloppen. Je kunt nu met de hele blokken werken.' : segment.feedback}
      </p>}
      {!answer.segmentationPassed && <LockedNotice>Maak en controleer eerst je eigen bouwblokken. Daarna gaat de oefening open.</LockedNotice>}
    </section>}
    {(!segment || answer.segmentationPassed) && children(locked)}
    {exercise.support !== 'volledig' && (helpAllowed || answer.checked) && !answer.correct && <details className="rounded-control border border-blue-line bg-blue-soft p-4">
      <summary className="cursor-pointer font-display text-small font-bold">Ik heb geprobeerd: toon een denkstap</summary>
      <p className="mt-3 text-small leading-relaxed">{exercise.hint}</p>
    </details>}
  </div></AttemptContext.Provider>;
}
