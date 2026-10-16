'use client';

import { BriefcaseBusiness } from 'lucide-react';
import { useId, useMemo } from 'react';
import { RichText } from '@/components/ui/rich-text';
import { shuffle } from '@/engine/hash';
import { StepHeading, type StepProps } from '../shared';
import { OptionList } from './options';

/** Denk na: een situatie op het werk, en het woord (of de zin) dat daar precies past. */
export function SceneStep({ step, response, onChange, locked, seed }: StepProps<'scene'>) {
  const headingId = useId();
  const options = useMemo(() => shuffle(seed, step.options), [seed, step.options]);
  return (
    <div>
      <StepHeading>
        <span id={headingId}>{step.prompt}</span>
      </StepHeading>
      <div className="mt-6 flex gap-3.5 rounded-card border-2 border-blue-line bg-blue-soft p-4 sm:p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-control bg-surface text-blue-ink shadow-slab-sm">
          <BriefcaseBusiness aria-hidden className="size-5" strokeWidth={2.5} />
        </span>
        <p className="self-center text-lead leading-snug text-ink" lang="nl">
          <span className="sr-only">Situatie: </span>
          <RichText text={step.situation} />
        </p>
      </div>
      <OptionList labelledBy={headingId} options={options} value={response.value} answer={step.answer} locked={locked} onSelect={(value) => onChange({ kind: 'scene', value })} />
    </div>
  );
}
