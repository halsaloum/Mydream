/** De uitkomst van één stap, en hoe zelfcontrolerende oefeningen hun score bepalen. */
export type Outcome = {
  /** 0–1: deel in één keer goed; null bij vormen zonder score. */
  score: number | null;
  correct: boolean;
  /** Later in dezelfde les nog eens aanbieden. */
  requeue: boolean;
  /** Herhaalstapel: bewaren (miss) of opruimen (clear). */
  review: 'miss' | 'clear' | null;
};

/** Deel van de beslissingen dat in één keer goed was. */
export const taskScore = (items: number, mistakes: number) => (items + mistakes > 0 ? items / (items + mistakes) : 1);

export function taskOutcome(score: number | null): Outcome {
  if (score === null) return { score: null, correct: true, requeue: false, review: null };
  const rounded = Math.round(score * 1000) / 1000;
  return { score: rounded, correct: rounded >= 1, requeue: false, review: rounded >= 1 ? 'clear' : 'miss' };
}

/** Korte feedback in de voettekst. */
export type Feedback = { title: string; body?: string };

export const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
