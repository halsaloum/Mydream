'use client';

import { CollisionSlotEngine } from './engines/collision-slot-engine';
import { DependencyTetherEngine } from './engines/dependency-tether-engine';
import { GatekeeperEngine } from './engines/gatekeeper-engine';
import { LiveMutatorEngine } from './engines/live-mutator-engine';
import { FadedScaffoldingEngine, type SentenceEngineProps } from './engines/shared';
import { XRayDebuggerEngine } from './engines/x-ray-debugger-engine';

export type SentenceExerciseViewProps = SentenceEngineProps;

export function SentenceExerciseView(props: SentenceExerciseViewProps) {
  return <div className="space-y-5">
    <h2 className="font-display text-title-sm font-bold leading-snug">{props.exercise.prompt}</h2>
    <FadedScaffoldingEngine {...props}>{(disabled) => {
      const common = { ...props, disabled };
      switch (props.exercise.kind) {
        case 'slots': return <CollisionSlotEngine {...common} exercise={props.exercise} />;
        case 'gate': return <GatekeeperEngine {...common} exercise={props.exercise} />;
        case 'tether': return <DependencyTetherEngine {...common} exercise={props.exercise} />;
        case 'mutate': return <LiveMutatorEngine {...common} exercise={props.exercise} />;
        case 'debug': return <XRayDebuggerEngine {...common} exercise={props.exercise} />;
      }
    }}</FadedScaffoldingEngine>
  </div>;
}
