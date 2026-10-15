import { describe, expect, it } from 'vitest';
import { BOOKS } from './sources';
import { ontleedLessons, PARTS, getOntleedLesson } from './index';
import type { ChoiceQuestion, Discovery, OntleedLesson, OrderQuestion, Question } from './types';
import { correctAnswer, gradeQuestion, normalize } from '@/lib/ontleed/grade';

const questionsOf = (lesson: OntleedLesson): Question[] => [
  ...lesson.practice,
  ...lesson.retrieval,
  ...(['mark', 'order'].includes(lesson.lab.kind) ? [lesson.lab as Question] : []),
];

/** Find a complete permutation of the actual draggable chunks, not whitespace words. */
function acceptedPermutation(question: OrderQuestion, accepted: string): number[] | undefined {
  const target = normalize(accepted);
  const search = (indices: number[]): number[] | undefined => {
    const current = normalize(indices.map(index => question.tokens[index]).join(' '));
    if (indices.length === question.tokens.length) return current === target ? indices : undefined;
    if (current && !target.startsWith(current)) return undefined;
    for (let index = 0; index < question.tokens.length; index++) {
      if (indices.includes(index)) continue;
      const result = search([...indices, index]);
      if (result) return result;
    }
    return undefined;
  };
  return search([]);
}

function scenario(question: Question): string {
  return normalize([
    question.kind,
    question.prompt,
    ...('sentence' in question && question.sentence ? [question.sentence] : []),
    ...('tokens' in question ? question.tokens : []),
  ].join(' '));
}

function checkChoice(question: Discovery | ChoiceQuestion) {
  expect(question.options.length).toBeGreaterThanOrEqual(2);
  expect(new Set(question.options.map(normalize)).size).toBe(question.options.length);
  expect(question.options.every(option => option.trim().length > 0)).toBe(true);
  expect(Number.isInteger(question.answer)).toBe(true);
  expect(question.answer).toBeGreaterThanOrEqual(0);
  expect(question.answer).toBeLessThan(question.options.length);
  expect(question.feedback).toHaveLength(question.options.length);
  expect(question.feedback.every(feedback => feedback.trim().length > 0)).toBe(true);
}

describe('the rebuilt curriculum contract', () => {
  it('contains the complete 58-lesson, six-part route with unique stable IDs', () => {
    expect(ontleedLessons).toHaveLength(58);
    expect(PARTS).toHaveLength(6);
    expect(new Set(PARTS.map(part => part.id)).size).toBe(PARTS.length);
    expect(new Set(ontleedLessons.map(lesson => lesson.id)).size).toBe(ontleedLessons.length);
    expect(PARTS.every(part => ontleedLessons.some(lesson => lesson.part === part.id))).toBe(true);
    for (const lesson of ontleedLessons) {
      expect(getOntleedLesson(lesson.id)).toBe(lesson);
      expect(PARTS.some(part => part.id === lesson.part)).toBe(true);
    }
    const questionIds = ontleedLessons.flatMap(lesson => questionsOf(lesson).map(question => question.id));
    expect(new Set(questionIds).size).toBe(questionIds.length);
  });

  it('has resolvable, acyclic prerequisites and actual source-catalog references', () => {
    const byId = new Map(ontleedLessons.map(lesson => [lesson.id, lesson]));
    const active = new Set<string>();
    const visited = new Set<string>();
    function visit(id: string) {
      expect(active.has(id), `cyclic prerequisite through ${id}`).toBe(false);
      if (visited.has(id)) return;
      const lesson = byId.get(id);
      expect(lesson, `missing prerequisite ${id}`).toBeDefined();
      active.add(id);
      for (const prerequisite of lesson!.prerequisites) visit(prerequisite);
      active.delete(id);
      visited.add(id);
    }
    for (const lesson of ontleedLessons) {
      visit(lesson.id);
      expect(new Set(lesson.prerequisites).size).toBe(lesson.prerequisites.length);
      expect(lesson.sources.length).toBeGreaterThan(0);
      for (const source of lesson.sources) {
        expect(BOOKS[source.bookId], `${lesson.id}: ${source.bookId}`).toBeDefined();
        expect(source.section.trim()).not.toBe('');
        expect(source.note.trim()).not.toBe('');
      }
    }
  });

  describe.each(ontleedLessons)('$id', lesson => {
    it('contains theory, independent retrieval scenarios and assessable transfer', () => {
      expect(lesson.sections.length).toBeGreaterThanOrEqual(3);
      for (const section of lesson.sections) {
        expect(section.paragraphs.length).toBeGreaterThanOrEqual(2);
        expect(section.paragraphs.every(paragraph => paragraph.trim().length > 0)).toBe(true);
        expect(section.examples.length).toBeGreaterThan(0);
        expect(section.examples.every(example => example.sentence.trim() && example.analysis.trim())).toBe(true);
        expect(section.pitfall.trim()).not.toBe('');
        expect(section.takeaway.trim()).not.toBe('');
      }
      expect(lesson.practice.length).toBeGreaterThanOrEqual(5);
      expect(lesson.retrieval.length).toBeGreaterThanOrEqual(2);
      const practice = new Set(lesson.practice.map(scenario));
      expect(new Set(lesson.retrieval.map(scenario)).size).toBe(lesson.retrieval.length);
      expect(lesson.retrieval.every(question => !practice.has(scenario(question)))).toBe(true);
      expect(lesson.transfer.prompt.trim()).not.toBe('');
      expect(lesson.transfer.checklist.length).toBeGreaterThanOrEqual(3);
      expect(lesson.transfer.model.trim()).not.toBe('');
      expect(lesson.recap.length).toBeGreaterThanOrEqual(3);
      checkChoice(lesson.discovery);
    });

    it('can grade every authored answer through the real lesson grader', () => {
      for (const question of questionsOf(lesson)) {
        expect(question.id.trim()).not.toBe('');
        expect(question.prompt.trim()).not.toBe('');
        expect(question.concept.trim()).not.toBe('');
        expect(question.hint.trim()).not.toBe('');
        expect(question.explanation.trim()).not.toBe('');
        expect(correctAnswer(question).trim()).not.toBe('');
        switch (question.kind) {
          case 'choice':
            checkChoice(question);
            question.options.forEach((_, index) => {
              expect(gradeQuestion(question, index), `${question.id}: option ${index}`).toBe(index === question.answer);
            });
            expect(gradeQuestion(question, String(question.answer))).toBe(false);
            break;
          case 'type':
            expect(question.accept.length).toBeGreaterThan(0);
            expect(question.accept.every(value => value.trim())).toBe(true);
            for (const accepted of question.accept) {
              expect(gradeQuestion(question, accepted), question.id).toBe(true);
              expect(gradeQuestion(question, `  ${accepted.toLocaleUpperCase('nl')}  `), question.id).toBe(true);
            }
            expect(gradeQuestion(question, '__geen_antwoord__')).toBe(false);
            break;
          case 'order':
            expect(question.tokens.length).toBeGreaterThanOrEqual(2);
            expect(question.tokens.every(token => token.trim())).toBe(true);
            expect(question.accept.length).toBeGreaterThan(0);
            for (const accepted of question.accept) {
              const indices = acceptedPermutation(question, accepted);
              expect(indices, `${question.id}: not a permutation: ${accepted}`).toBeDefined();
              expect(gradeQuestion(question, indices!), question.id).toBe(true);
            }
            expect(gradeQuestion(question, question.tokens.map(() => 0))).toBe(false);
            expect(gradeQuestion(question, question.tokens.map((_, index) => index + question.tokens.length))).toBe(false);
            expect(gradeQuestion(question, [])).toBe(false);
            break;
          case 'mark':
            expect(question.targets.length).toBeGreaterThan(0);
            expect(new Set(question.targets).size).toBe(question.targets.length);
            expect(question.targets.every(index => Number.isInteger(index) && index >= 0 && index < question.tokens.length)).toBe(true);
            expect(gradeQuestion(question, question.targets), question.id).toBe(true);
            expect(gradeQuestion(question, [...question.targets].reverse()), question.id).toBe(true);
            expect(gradeQuestion(question, [...question.targets, question.targets[0]!])).toBe(false);
            expect(gradeQuestion(question, [])).toBe(false);
            break;
        }
      }
    });

    it('has valid lab targets and explanatory alternatives', () => {
      const { lab } = lesson;
      expect(lab.prompt.trim()).not.toBe('');
      expect(lab.takeaway.trim()).not.toBe('');
      if (lab.kind === 'classify') {
        expect(lab.categories.length).toBeGreaterThanOrEqual(2);
        expect(new Set(lab.categories.map(normalize)).size).toBe(lab.categories.length);
        expect(lab.items.length).toBeGreaterThanOrEqual(3);
        for (const item of lab.items) {
          expect(Number.isInteger(item.category)).toBe(true);
          expect(item.category).toBeGreaterThanOrEqual(0);
          expect(item.category).toBeLessThan(lab.categories.length);
          expect(item.text.trim()).not.toBe('');
          expect(item.why.trim()).not.toBe('');
        }
      } else if (lab.kind === 'compare') {
        expect(lab.variants.length).toBeGreaterThanOrEqual(2);
        expect(new Set(lab.variants.map(variant => variant.text)).size).toBe(lab.variants.length);
        expect(lab.variants.every(variant => variant.label.trim() && variant.text.trim() && variant.analysis.trim())).toBe(true);
      }
    });
  });
});
