'use client';

import { Input } from '@base-ui/react/input';
import { Check, Circle } from 'lucide-react';
import { motion } from 'motion/react';
import { useId } from 'react';
import { TextArea } from '@/components/ui/field';
import { RichText } from '@/components/ui/rich-text';
import { criteriaStatus, isFormExercise } from '@/engine/grade';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { Examples, Hint, Kbd, Stage, StepHeading, type StepProps } from './shared';

/** Nieuw begrip: titel, uitleg en voorbeelden. */
export function LearnStep({ step }: StepProps<'learn'>) {
  return (
    <div>
      <StepHeading className="text-headline">{step.title}</StepHeading>
      <p className="mt-5 text-[1.3rem] leading-[1.65] text-ink">
        <RichText text={step.body} />
      </p>
      {step.example.length > 0 && <Examples examples={step.example} className="mt-7" />}
    </div>
  );
}

/** Invullen in de zin. Hoofdletters tellen niet mee; Enter controleert. */
export function TypeStep({ step, response, onChange, locked, correct, onSubmit }: StepProps<'type'>) {
  const id = useId();
  const size = Math.max(5, response.value.length, step.hint.length) + 1.5;
  const state = locked ? (correct ? 'correct' : 'wrong') : 'idle';
  return (
    <div>
      <StepHeading>{step.prompt}</StepHeading>
      <Stage className="mt-6">
        <p className="font-serif text-example leading-[1.9] text-ink" lang="nl">
          {step.before}{' '}
          <label htmlFor={id} className="sr-only">
            {`Invulveld: ${step.before} … ${step.after}`.trim()}
          </label>
          <Input
            id={id}
            data-step-autofocus
            value={response.value}
            onValueChange={(value) => onChange({ kind: 'type', value })}
            placeholder={step.hint}
            readOnly={locked}
            autoComplete="off"
            autoCapitalize="off"
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
              state === 'wrong' && 'border-red bg-red-soft text-red-ink',
            )}
          />{' '}
          {step.after}
        </p>
      </Stage>
      {!locked && (
        <Hint className="mt-4 hidden items-center gap-1.5 sm:flex">
          Typ je antwoord en druk op <Kbd>Enter</Kbd>.
        </Hint>
      )}
    </div>
  );
}

/** Herschrijven. Bij vormopdrachten tellen hoofdletters en leestekens mee; dat wordt vooraf gezegd. */
export function RewriteStep({ step, response, onChange, locked, onSubmit }: StepProps<'rewrite'>) {
  const strict = isFormExercise(step);
  return (
    <div>
      <StepHeading>{step.prompt}</StepHeading>
      <div className="mt-6 rounded-card border-2 border-dashed border-line-strong bg-sunken px-5 py-5 sm:px-6">
        <p className="text-caption font-bold text-ink-muted">Oorspronkelijke zin</p>
        <p className="mt-1 font-serif text-[1.5rem] leading-snug text-ink-soft" lang="nl">
          {step.source}
        </p>
      </div>
      <TextArea
        className="mt-4"
        label="Jouw versie"
        value={response.value}
        onChange={(value) => onChange({ kind: 'rewrite', value })}
        placeholder="Schrijf hier je versie…"
        rows={3}
        disabled={locked}
        textareaClassName="font-serif text-[1.5rem] leading-snug"
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        }}
        description={strict ? 'Let op: hoofdletters en leestekens tellen bij deze opdracht mee.' : undefined}
      />
      {!locked && (
        <Hint className="mt-3 hidden items-center gap-1.5 sm:flex">
          <Kbd>Enter</Kbd> controleert · <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd> voor een nieuwe regel
        </Hint>
      )}
    </div>
  );
}

/** Vrij schrijven: de taakeisen vinken zichtbaar af terwijl je schrijft. */
export function WriteStep({ step, response, onChange, locked, onSubmit }: StepProps<'write'>) {
  const calm = useCalmMotion();
  const status = criteriaStatus(step, response.value);
  const items = [
    { label: `${status.words} van ${step.minWords} woorden`, met: status.enoughWords },
    ...status.criteria,
  ];
  const allMet = items.every((item) => item.met);
  return (
    <div>
      <StepHeading>{step.prompt}</StepHeading>
      <TextArea
        className="mt-6"
        label="Jouw tekst"
        hideLabel
        value={response.value}
        onChange={(value) => onChange({ kind: 'write', value })}
        placeholder="Begin met een heldere kernzin…"
        rows={8}
        disabled={locked}
        textareaClassName="text-lead leading-relaxed"
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
      <ul aria-label="Taakeisen" className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item.label}
            className={cn(
              'inline-flex min-h-9 items-center gap-1.5 rounded-full border-2 px-3 text-small font-bold transition-colors duration-200',
              item.met ? 'border-green-line bg-green-soft text-green-ink' : 'border-line bg-surface text-ink-muted',
            )}
          >
            {item.met ? (
              <motion.span key="ja" initial={calm ? false : { scale: 0.4 }} animate={{ scale: 1 }} transition={transition.base}>
                <Check aria-hidden className="size-4" strokeWidth={3} />
              </motion.span>
            ) : (
              <Circle aria-hidden className="size-3.5" strokeWidth={3} />
            )}
            <span className="sr-only">{item.met ? 'Gehaald: ' : 'Nog niet: '}</span>
            {item.label}
          </li>
        ))}
      </ul>
      <p role="status" className="mt-3 text-small font-semibold text-ink-muted">
        {allMet && !locked ? (
          <span className="inline-flex flex-wrap items-center gap-1.5 text-green-ink">
            Alle eisen gehaald. Controleer met de knop of <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd>.
          </span>
        ) : null}
      </p>
    </div>
  );
}
