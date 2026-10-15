import type { ChoiceQuestion, MarkQuestion, TypeQuestion } from './types';

/** Only construction helpers: every explanation and distractor is authored per task. */
export function choice(id: string, prompt: string, options: string[], answer: number, feedback: string[], concept: string, hint: string, explanation: string, sentence?: string): ChoiceQuestion {
  return { id, kind: 'choice', prompt, options, answer, feedback, concept, hint, explanation, ...(sentence ? { sentence } : {}) };
}
export function term(id: string, prompt: string, accept: string[], concept: string, hint: string, explanation: string, sentence?: string): TypeQuestion {
  return { id, kind: 'type', prompt, accept, concept, hint, explanation, ...(sentence ? { sentence } : {}) };
}
export function mark(id: string, prompt: string, tokens: string[], targets: number[], concept: string, hint: string, explanation: string): MarkQuestion {
  return { id, kind: 'mark', prompt, tokens, targets, concept, hint, explanation };
}
