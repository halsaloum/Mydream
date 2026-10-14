import { describe, expect, it } from 'vitest';
import { emptySentenceAnswer, gradeSentence } from '@/lib/sentences/learning';
import { debuggerReview } from './debugger-review';
import { sentenceLessons } from './index';
import type { DebugExercise, GateExercise } from './types';

const exercises = sentenceLessons.flatMap((lesson) => [...lesson.arena, ...lesson.debugger]);
const debuggers = sentenceLessons.flatMap((lesson) => lesson.debugger);

describe('zelfstandig onderzoeken vóór toepassen', () => {
  it('herziet alle 48 stabiele reparaties en houdt de passende uitwerking uit de opdracht', () => {
    expect(debuggers).toHaveLength(48);
    expect(Object.keys(debuggerReview).sort()).toEqual(debuggers.map((exercise) => exercise.id).sort());
    for (const exercise of debuggers) {
      expect(exercise.prompt, exercise.id).toBe(debuggerReview[exercise.id]!.prompt);
      expect(exercise.instruction, exercise.id).toBe(debuggerReview[exercise.id]!.instruction);
      for (const repair of exercise.repairs) {
        expect(exercise.prompt.includes(repair), exercise.id).toBe(false);
        expect(exercise.instruction.includes(repair), exercise.id).toBe(false);
      }
    }
  });

  it.each(['zinnen-02-arena-1', 'zin05-arena-02', 'zin06-arena-05', 'zin07-arena-03', 'zin07-arena-05', 'zin08-arena-06', 'zinnen-09-arena-6', 'zinnen-11-arena-3'])('%s laat de nog te kiezen vorm weg uit diagnose en bouwblokken', (id) => {
    const exercise = exercises.find((item) => item.id === id) as GateExercise;
    expect(exercise.kind).toBe('gate');
    expect(exercise.diagnosis.tokens.some((token) => token.text === '___'), id).toBe(true);
    expect(exercise.diagnosis.targets.every((target) => exercise.diagnosis.tokens.find((token) => token.id === target)!.text !== '___'), id).toBe(true);
    if (exercise.segmentation) expect(exercise.segmentation.tokens.some((token) => token.text === '___'), id).toBe(true);
  });

  it('vraagt bij een verkeerd geplaatste nabepaling uitsluitend de betreffende voorzetselgroep', () => {
    const exercise = debuggers.find((item) => item.id === 'zinnen-01-debugger-4')!;
    expect(exercise.targets.map((id) => exercise.tokens.find((token) => token.id === id)!.text)).toEqual(['over', 'grammatica']);
  });

  it.each([
    ['zin05-debug-04', 'We hebben erop gerekend.'],
    ['zin05-debug-04', 'We hebben daarop gerekend.'],
    ['zinnen-09-debug-4', 'Dat alle leden akkoord zijn, verbaast mij niet.'],
    ['zinnen-09-debug-4', 'Dat alle leden akkoord zijn verbaast mij niet.'],
    ['zinnen-11-debug-2', 'Deze woning heb ik opgeknapt en zij ligt vlak bij het park.'],
    ['zinnen-11-debug-2', 'Deze woning heb ik opgeknapt en ze ligt vlak bij het park.'],
    ['zinnen-11-debug-1', 'Nadat ik het verslag had gelezen, verdween mijn twijfel.'],
    ['zinnen-11-debug-1', 'Nadat ik het verslag gelezen had, verdween mijn twijfel.'],
  ])('accepteert de toegestane variant in %s: %s', (id, text) => {
    const exercise = exercises.find((item) => item.id === id) as DebugExercise;
    const answer = { ...emptySentenceAnswer(), selected: exercise.targets, diagnosisPassed: true, text };
    expect(gradeSentence(exercise, answer)).toBe(true);
    expect(gradeSentence(exercise, { ...answer, text: 'Een inhoudelijk andere zin.' })).toBe(false);
  });
});
