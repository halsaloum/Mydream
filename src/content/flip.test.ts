import { describe, expect, it } from 'vitest';
import { flipLetter, poseOf } from './flip';

describe('draailetters', () => {
  it('spiegelen, kantelen en draaien maken van b de andere drie', () => {
    expect(flipLetter('b', poseOf(0, 1, 0))).toBe('d');
    expect(flipLetter('b', poseOf(1, 0, 0))).toBe('p');
    expect(flipLetter('b', poseOf(0, 0, 1))).toBe('q');
    expect(flipLetter('b', poseOf(1, 1, 0))).toBe('q');
  });

  it('twee keer dezelfde beweging brengt je terug', () => {
    expect(flipLetter('d', poseOf(0, 2, 0))).toBe('d');
    expect(flipLetter('p', poseOf(1, 1, 1))).toBe('p');
    expect(flipLetter('q', poseOf(-1, 0, 0))).toBe('d');
  });
});
