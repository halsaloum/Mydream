import type { Question } from '@/content/ontleed/types';
export type Answer = string | number | number[];
export function normalize(value: string): string {
  return value.normalize('NFC').toLocaleLowerCase('nl').trim().replace(/[“”«»]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
}
export function gradeQuestion(question: Question, answer: Answer): boolean {
  switch (question.kind) {
    case 'choice': return typeof answer === 'number' && answer === question.answer;
    case 'type': return typeof answer === 'string' && question.accept.some(v => normalize(v) === normalize(answer));
    case 'order': return Array.isArray(answer) && answer.length === question.tokens.length && new Set(answer).size === answer.length && question.accept.some(v => normalize(v) === normalize(answer.map(i => question.tokens[i]).join(' ')));
    case 'mark': return Array.isArray(answer) && answer.length === question.targets.length && new Set(answer).size === answer.length && question.targets.every(i => answer.includes(i));
  }
}
export function correctAnswer(question: Question): string {
  switch (question.kind) {
    case 'choice': return question.options[question.answer]!;
    case 'type': case 'order': return question.accept[0]!;
    case 'mark': return question.targets.map(i=>question.tokens[i]).join(' · ');
  }
}
