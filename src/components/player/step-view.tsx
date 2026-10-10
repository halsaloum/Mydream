'use client';

import type { ComponentType } from 'react';
import type { Step, StepKind } from '@/content/schema';
import type { Response } from '@/engine/responses';
import { ExplainStep } from './explain/explain-step';
import { DilemmaStep } from './steps/argument/dilemma';
import { EvidenceStep } from './steps/argument/evidence';
import { InspectStep } from './steps/argument/inspect';
import { ReasonStep } from './steps/argument/reason';
import { RebutStep } from './steps/argument/rebut';
import { SlopeStep } from './steps/argument/slope';
import { StrawmanStep } from './steps/argument/strawman';
import { SupportStep } from './steps/argument/support';
import { AmbiguityStep } from './steps/extra/ambiguity';
import { BetStep } from './steps/extra/bet';
import { ChatStep } from './steps/extra/chat';
import { ClampStep } from './steps/extra/clamp';
import { ConjunctionStep } from './steps/extra/conjunction';
import { DictationStep } from './steps/extra/dictation';
import { HighlightStep } from './steps/extra/highlight';
import { IntentStep } from './steps/extra/intent';
import { LadderStep } from './steps/extra/ladder';
import { MorphStep } from './steps/extra/morph';
import { ProofreadStep } from './steps/extra/proofread';
import { RefsStep } from './steps/extra/refs';
import { ScaleStep } from './steps/extra/scale';
import { SpeedStep } from './steps/extra/speed';
import { StackStep } from './steps/extra/stack';
import { SwipeStep } from './steps/extra/swipe';
import { TimelineStep } from './steps/extra/timeline';
import { ToneStep } from './steps/extra/tone';
import { TrainStep } from './steps/extra/train';
import { ChoiceStep } from './steps/choice-step';
import { FixStep } from './steps/fix-step';
import { OrderStep, ParagraphStep } from './steps/order-steps';
import type { StepProps } from './steps/shared';
import { SortStep } from './steps/sort-step';
import { ClozeStep } from './steps/spelling/cloze';
import { DrillStep } from './steps/spelling/drill';
import { PassageStep } from './steps/spelling/passage';
import { LearnStep, RewriteStep, TypeStep, WriteStep } from './steps/text-steps';

/**
 * Elke stapsoort uit het inhoudscontract heeft precies één component. Een nieuwe oefenvorm
 * aansluiten = schema (content/kinds.ts) + engine (engine/kinds.ts) + een regel hier.
 */
const STEP_COMPONENTS: { [K in StepKind]: ComponentType<StepProps<K>> } = {
  explain: ExplainStep,
  learn: LearnStep,
  choice: ChoiceStep,
  combine: ChoiceStep,
  type: TypeStep,
  order: OrderStep,
  paragraph: ParagraphStep,
  sort: SortStep,
  fix: FixStep,
  rewrite: RewriteStep,
  write: WriteStep,
  swipe: SwipeStep,
  morph: MorphStep,
  timeline: TimelineStep,
  speed: SpeedStep,
  train: TrainStep,
  highlight: HighlightStep,
  conjunction: ConjunctionStep,
  clamp: ClampStep,
  refs: RefsStep,
  ladder: LadderStep,
  ambiguity: AmbiguityStep,
  chat: ChatStep,
  tone: ToneStep,
  intent: IntentStep,
  scale: ScaleStep,
  stack: StackStep,
  proofread: ProofreadStep,
  bet: BetStep,
  dictation: DictationStep,
  reason: ReasonStep,
  support: SupportStep,
  evidence: EvidenceStep,
  rebut: RebutStep,
  strawman: StrawmanStep,
  slope: SlopeStep,
  dilemma: DilemmaStep,
  inspect: InspectStep,
  cloze: ClozeStep,
  drill: DrillStep,
  passage: PassageStep,
};

type StepViewProps = {
  step: Step;
  response: Response;
  onChange: (response: Response) => void;
  locked: boolean;
  correct: boolean | null;
  stepKey: string;
  onSubmit: () => void;
};

export function StepView({ step, response, onChange, ...rest }: StepViewProps) {
  const Component = STEP_COMPONENTS[step.kind] as ComponentType<StepProps<StepKind>>;
  return <Component {...rest} step={step as never} response={response as never} onChange={onChange as never} />;
}
