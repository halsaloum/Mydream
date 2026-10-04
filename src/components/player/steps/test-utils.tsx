import { render } from '@testing-library/react';
import { useState, type ComponentType } from 'react';
import type { Step, StepKind, StepOf } from '@/content/schema';
import { evaluate, isComplete } from '@/engine/grade';
import { stepMode } from '@/engine/kinds';
import { initialResponse, type Response, type ResponseOf } from '@/engine/responses';
import type { StepProps } from './shared';

/**
 * Rendert één oefenvorm zoals de player dat doet, zonder de rest van de app:
 * - het antwoord leeft hier (zoals in de sessie);
 * - zelfcontrolerende vormen (task) zetten zichzelf vast zodra ze klaar zijn;
 * - gecontroleerde vormen (graded) zetten vast bij `onSubmit` als ze compleet zijn.
 */
export function renderStep<K extends StepKind>(Component: ComponentType<StepProps<K>>, step: StepOf<K>, start?: ResponseOf<K>) {
  const state = {
    response: (start ?? initialResponse(step as Step)) as ResponseOf<K>,
    locked: false,
    correct: null as boolean | null,
    submits: 0,
  };

  function Harness() {
    const [response, setResponse] = useState(state.response);
    const [locked, setLocked] = useState(false);
    const [correct, setCorrect] = useState<boolean | null>(null);

    const lock = (next: Response) => {
      const outcome = evaluate(step as Step, next);
      state.locked = true;
      state.correct = outcome.correct;
      setLocked(true);
      setCorrect(outcome.correct);
    };

    const submit = () => {
      state.submits += 1;
      if (!state.locked && stepMode(step as Step) === 'graded' && isComplete(step as Step, state.response)) lock(state.response);
    };

    return (
      <>
        <Component
          step={step}
          response={response}
          locked={locked}
          correct={correct}
          stepKey="test:s0#0"
          onChange={(next) => {
            if (state.locked) return;
            state.response = next;
            setResponse(next);
            if (stepMode(step as Step) === 'task' && isComplete(step as Step, next)) lock(next);
          }}
          onSubmit={submit}
        />
        {/* Zoals de hoofdknop in de voettekst van de player. */}
        <button type="button" data-testid="player-submit" onClick={submit}>
          Controleer
        </button>
      </>
    );
  }

  const view = render(<Harness />);
  /** `state`: actueel antwoord, of de stap vaststaat, en de uitkomst. */
  return { ...view, state };
}
