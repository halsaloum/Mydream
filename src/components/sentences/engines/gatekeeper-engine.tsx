'use client';

import { useMemo } from 'react';
import type { GateExercise } from '@/content/sentences/types';
import { shuffle } from '@/engine/hash';
import { cn } from '@/lib/cn';
import { DiagnosisGate, LockedNotice, type SentenceEngineProps } from './shared';

export function GatekeeperEngine({ exercise, answer, onChange, onDiagnose, disabled = false }: SentenceEngineProps & { exercise: GateExercise }) {
  const options = useMemo(() => shuffle(`${exercise.id}:choices`, exercise.options), [exercise]);
  const locked = disabled || !answer.diagnosisPassed;
  return <div className="space-y-5">
    <DiagnosisGate diagnosis={exercise.diagnosis} answer={answer} onChange={onChange} onDiagnose={onDiagnose} disabled={disabled} />
    {!answer.diagnosisPassed && <LockedNotice>Onderzoek eerst de zin. Daarna kun je de passende verklaring of formulering kiezen.</LockedNotice>}
    <fieldset disabled={locked} className="space-y-3">
      <legend className="mb-3 font-display font-bold">Welke gevolgtrekking past bij jouw diagnose?</legend>
      {options.map((option, index) => <label key={option.id} className={cn('flex items-start gap-3 rounded-control border-2 p-4 text-small leading-relaxed', answer.choice === option.id ? 'border-blue-ink bg-blue-soft' : 'border-line bg-surface', locked ? 'cursor-default opacity-60' : 'cursor-pointer hover:border-line-strong')}>
        <input type="radio" name={`${exercise.id}:choice`} value={option.id} checked={answer.choice === option.id}
          onChange={() => onChange({ choice: option.id })} className="mt-1 size-4 shrink-0 accent-[var(--color-blue-ink)]" />
        <span><span className="mr-2 font-bold text-ink-muted">{String.fromCharCode(65 + index)}.</span>{option.text}</span>
      </label>)}
    </fieldset>
    {answer.checked && answer.choice && <p className="rounded-control border border-line bg-sunken p-4 text-small leading-relaxed">{exercise.options.find((option) => option.id === answer.choice)?.feedback}</p>}
  </div>;
}
