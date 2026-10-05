'use client';

import { StepIntro, type StepProps } from '../shared';

/** Tijdelijke plaatshouder; wordt vervangen door de echte oefenvorm. */
export function RebutStep({ step }: StepProps<'rebut'>) {
  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />
    </div>
  );
}
