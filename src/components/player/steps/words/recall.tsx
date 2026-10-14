'use client';

import { Input } from '@base-ui/react/input';
import { KeyRound } from 'lucide-react';
import { useId } from 'react';
import { recallNearMiss } from '@/engine/words';
import { cn } from '@/lib/cn';
import { Hint, Kbd, Stage, StepHeading, type StepProps } from '../shared';

/** Ophalen: typ het woord in de goede vorm in een nieuwe zin. Enter controleert. */
export function RecallStep({ step, response, onChange, locked, correct, onSubmit }: StepProps<'recall'>) {
  const id = useId();
  const answer = (locked && !correct && recallNearMiss(step, response.value)) || (step.answers[0] ?? '');
  const cue = step.cue ?? '';
  // The input grows with the learner's text, never with the hidden solution.
  const size = Math.max(16, response.value.length + 2, cue.length + 2);
  const state = locked ? (correct ? 'correct' : 'wrong') : 'idle';
  return (
    <div>
      <StepHeading>{step.prompt}</StepHeading>
      <div className="mt-5 flex gap-3 rounded-card border-2 border-accent-line bg-accent-soft px-4 py-3.5">
        <KeyRound aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-ink" strokeWidth={2.5} />
        <p className="text-body leading-snug text-ink">
          <strong className="font-display font-extrabold text-accent-ink">{step.clueLabel ?? 'Betekenis'}: </strong>
          {step.clue}
        </p>
      </div>
      <Stage className="mt-4">
        <p className="font-serif text-example leading-[1.9] text-ink" lang="nl">
          {step.before}
          {step.before && ' '}
          <label htmlFor={id} className="sr-only">
            {`${cue ? `Typ het woord dat begint met ${cue}` : 'Typ het woord'}: ${step.before} … ${step.after}`.trim()}
          </label>
          <Input
            id={id}
            data-step-autofocus
            value={response.value}
            onValueChange={(value) => onChange({ kind: 'recall', value })}
            placeholder={cue || '…'}
            readOnly={locked}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onSubmit();
              }
            }}
            style={{ width: `${size}ch` }}
            className={cn(
              'inline-block max-w-full rounded-control border-2 bg-surface px-2 py-0.5 text-center font-serif text-example outline-none transition-colors duration-200 placeholder:text-ink-muted/70 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
              state === 'idle' && 'border-accent text-accent-ink',
              state === 'correct' && 'border-green bg-green-soft text-green-ink',
              state === 'wrong' && 'border-red bg-red-soft text-red-ink line-through decoration-2',
            )}
          />
          {locked && !correct && (
            <span className="ml-2 rounded-chip bg-green-soft px-2 py-0.5 text-green-ink">
              <span className="sr-only">Juist: </span>
              {answer}
            </span>
          )}
          {step.after && /^[\p{L}\p{N}(‘“]/u.test(step.after) ? ' ' : ''}
          {step.after}
        </p>
      </Stage>
      {!locked && (
        <Hint className="mt-4 hidden items-center gap-1.5 sm:flex">
          Gebruik het geleerde woord in de passende vorm en druk op <Kbd>Enter</Kbd>. Deze oefening vraagt om dat doelwoord; een ander passend synoniem kan buiten de opdracht vallen.
        </Hint>
      )}
    </div>
  );
}
