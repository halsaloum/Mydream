'use client';

import { Sparkles } from 'lucide-react';
import { useId, useMemo } from 'react';
import { RichText } from '@/components/ui/rich-text';
import { shuffle } from '@/engine/hash';
import { Stage, StepHeading, type StepProps } from '../shared';
import { OptionList } from './options';

/**
 * Raad eerst: het nieuwe woord staat in een zin, en je kiest wat het volgens jou betekent vóór je
 * de woordkaart ziet. Telt niet mee: ook een foute gok laat je de uitleg daarna beter onthouden.
 */
export function GuessStep({ step, response, onChange, locked, seed }: StepProps<'guess'>) {
  const headingId = useId();
  const options = useMemo(() => shuffle(seed, step.options), [seed, step.options]);
  return (
    <div>
      <p className="inline-flex items-center gap-1.5 rounded-full bg-yellow-soft px-3 py-1 text-caption font-extrabold text-yellow-ink">
        <Sparkles aria-hidden className="size-3.5" strokeWidth={2.75} />
        Nieuw woord
      </p>
      <StepHeading className="mt-3">
        <span id={headingId}>{step.prompt}</span>
      </StepHeading>
      <Stage className="mt-6">
        <p className="font-serif text-example leading-snug text-ink" lang="nl">
          <RichText text={step.sentence} listen />
        </p>
      </Stage>
      <OptionList labelledBy={headingId} options={options} value={response.value} answer={step.answer} locked={locked} serif={false} onSelect={(value) => onChange({ kind: 'guess', value })} />
      {!locked && (
        <p className="mt-3 text-small font-semibold text-ink-muted">
          Weet je het niet zeker? Gok gerust. Dit telt niet mee, en wie eerst raadt, onthoudt de betekenis daarna beter.
        </p>
      )}
    </div>
  );
}
