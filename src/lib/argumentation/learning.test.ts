import { describe, expect, it } from 'vitest';
import { choice, map, reflection, testArgumentLesson } from './test-fixtures';
import { answerReady, emptyArgumentAnswer, gradeArgument, lessonPassed, lessonScore, nextReviewDays } from './learning';


describe('argumentatiescores', () => {
  it('accepteert alleen bestaande opties en volledig geplaatste kaartjes', () => {
    const answer = emptyArgumentAnswer();
    expect(answerReady(choice, { ...answer, value: 'onbekend' })).toBe(false);
    expect(answerReady(choice, { ...answer, value: 'b' })).toBe(true);
    expect(answerReady(map, { ...answer, placements: { '1': 'premise', '2': 'onbekend' } })).toBe(false);
    expect(answerReady(map, { ...answer, placements: { '1': 'premise', '2': 'conclusion' } })).toBe(true);
  });
  it('geeft deelscores voor reconstructies en geen automatische schrijfscore', () => {
    const answer = emptyArgumentAnswer();
    expect(gradeArgument(map, { ...answer, placements: { '1': 'premise', '2': 'premise' } })).toBe(0.5);
    expect(gradeArgument(reflection, { ...answer, value: 'Een volkomen willekeurige tekst' })).toBeNull();
    expect(answerReady(reflection, { ...answer, value: '  één\n twee   drie ' })).toBe(true);
    expect(lessonScore(testArgumentLesson, { choice: 1, map: 0.5 })).toBe(75);
  });
  it('hanteert 80% voor checkpoints zonder reflectie mee te tellen', () => {
    const checkpoint = { ...testArgumentLesson, checkpoint: true };
    expect(lessonPassed(checkpoint, 79)).toBe(false);
    expect(lessonPassed(checkpoint, 80)).toBe(true);
    expect(lessonPassed(testArgumentLesson, 50)).toBe(true);
  });
  it('plant een transparante herhaling op basis van score en pogingen', () => {
    expect(nextReviewDays(50, 4)).toBe(1);
    expect([1, 2, 3, 4, 5].map((attempt) => nextReviewDays(100, attempt))).toEqual([3, 7, 14, 30, 30]);
  });
});
