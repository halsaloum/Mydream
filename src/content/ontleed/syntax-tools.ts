import type { ChoiceQuestion, TypeQuestion, MarkQuestion, OrderQuestion, LessonSection } from './types';

/** Small authoring helpers; the explanations and examples remain lesson-specific. */
export const choice = (id: string, concept: string, prompt: string, options: string[], answer: number, feedback: string[], hint: string, explanation: string, sentence?: string): ChoiceQuestion => ({ id, concept, kind: 'choice', prompt, options, answer, feedback, hint, explanation, sentence });
export const type = (id: string, concept: string, prompt: string, accept: string[], hint: string, explanation: string, sentence?: string): TypeQuestion => ({ id, concept, kind: 'type', prompt, accept, hint, explanation, sentence });
export const mark = (id: string, concept: string, prompt: string, tokens: string[], targets: number[], hint: string, explanation: string): MarkQuestion => ({ id, concept, kind: 'mark', prompt, tokens, targets, hint, explanation });
export const order = (id: string, concept: string, prompt: string, tokens: string[], accept: string[], hint: string, explanation: string): OrderQuestion => ({ id, concept, kind: 'order', prompt, tokens, accept, hint, explanation });
export const section = (title: string, paragraphs: string[], examples: { sentence: string; analysis: string }[], pitfall: string, takeaway: string): LessonSection => ({ title, paragraphs, examples, pitfall, takeaway });
