'use client';

import type { DebugExercise } from '@/content/sentences/types';
import { DiagnosisGate, LockedNotice, type SentenceEngineProps } from './shared';

export function XRayDebuggerEngine({ exercise, answer, onChange, onDiagnose, disabled = false }: SentenceEngineProps & { exercise: DebugExercise }) {
  const locked = disabled || !answer.diagnosisPassed;
  return <div className="space-y-5">
    <DiagnosisGate diagnosis={{ prompt: 'Welke woorden wijzen het probleem aan?', tokens: exercise.tokens, targets: exercise.targets, feedback: 'Je hebt het probleem gevonden. Herstel nu zelf de zin.' }} answer={answer} onChange={onChange} onDiagnose={onDiagnose} disabled={disabled} />
    {!answer.diagnosisPassed && <LockedNotice>Wijs eerst de fout aan. Het herstelveld gaat open na je diagnose.</LockedNotice>}
    <div className="space-y-3">
      <label htmlFor={`repair-${exercise.id}`} className="block font-display font-bold">{answer.diagnosisPassed ? exercise.instruction : 'Jouw reparatie: eerst zelfstandig de fout vinden'}</label>
      <textarea id={`repair-${exercise.id}`} value={answer.text} disabled={locked} onChange={(event) => onChange({ text: event.target.value })}
        rows={4} placeholder={answer.diagnosisPassed ? 'Schrijf hier je herstelde zin…' : 'Eerst de diagnose controleren…'}
        className="w-full resize-y rounded-control border-2 border-line-strong bg-surface p-4 font-serif text-lead leading-relaxed focus:border-blue-ink disabled:bg-sunken disabled:text-ink-muted" />
      <p className="text-caption leading-relaxed text-ink-muted">Behoud de betekenis en verander alleen wat de opdracht vraagt. Deze afgebakende oefening vergelijkt je herstel met passende uitwerkingen; vrij schrijven wordt hier niet beoordeeld.</p>
    </div>
  </div>;
}
