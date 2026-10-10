'use client';

import { useMemo } from 'react';
import { orderSolution } from '@/engine/grade';
import { SequenceBuilder } from './sequence';
import { Stage, StepHeading, type StepProps } from './shared';

/** Woorden of blokken in de goede volgorde leggen. */
export function OrderStep({ step, response, onChange, locked, stepKey }: StepProps<'order'>) {
  const solution = useMemo(() => orderSolution(step.tiles, step.answer), [step.tiles, step.answer]);
  const verdicts = locked
    ? response.placed.map((index, position) => {
        const expected = solution?.[position];
        return expected !== undefined && step.tiles[index] === step.tiles[expected];
      })
    : null;
  return (
    <div>
      <StepHeading>{step.prompt}</StepHeading>
      <Stage className="mt-6 bg-surface">
        <SequenceBuilder
          items={step.tiles}
          placed={response.placed}
          onChange={(placed) => onChange({ kind: 'order', placed })}
          locked={locked}
          verdicts={verdicts}
          variant="inline"
          stepKey={stepKey}
          lineLabel="Jouw zin"
          emptyText="Tik de kaartjes in de goede volgorde aan."
        />
      </Stage>
    </div>
  );
}

/** Zinnen tot een alinea ordenen. Na controleren staat bij elke zin zijn rol. */
export function ParagraphStep({ step, response, onChange, locked, stepKey }: StepProps<'paragraph'>) {
  const verdicts = locked ? response.placed.map((index, position) => index === position) : null;
  return (
    <div>
      <StepHeading>{step.prompt}</StepHeading>
      <div className="mt-6">
        <SequenceBuilder
          items={step.parts.map((part) => part.text)}
          placed={response.placed}
          onChange={(placed) => onChange({ kind: 'paragraph', placed })}
          locked={locked}
          verdicts={verdicts}
          notes={(index, position) => {
            const role = step.parts[index]?.role ?? '';
            return index === position ? role : `${role} · hoort op plek ${index + 1}`;
          }}
          variant="block"
          stepKey={stepKey}
          lineLabel="Jouw alinea"
          emptyText="Tik de zinnen in de goede volgorde aan."
        />
      </div>
    </div>
  );
}
