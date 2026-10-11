// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  firstReview,
  forgetStability,
  initDifficulty,
  initStability,
  nextDifficulty,
  nextInterval,
  recallStability,
  retrievability,
  review,
  shortTermStability,
  type Grade,
} from './fsrs';

/**
 * De verwachte getallen komen uit de tests van ts-fsrs v4.7.1 (`__tests__/FSRSV5.test.ts`), de
 * referentie-implementatie van FSRS-5.
 */

describe('FSRS-5', () => {
  it('begint met de standaardwaarden voor stabiliteit en moeilijkheid', () => {
    const grades: Grade[] = [1, 2, 3, 4];
    expect(grades.map(initStability)).toEqual([0.40255, 1.18385, 3.173, 15.69105]);
    grades.map(initDifficulty).forEach((d, i) => expect(d).toBeCloseTo([7.1949, 6.48830527, 5.28243442, 3.22450159][i]!, 7));
  });

  it('de kans is precies 90% na S dagen, en de volgende herhaling valt dan', () => {
    expect(retrievability(0, 5)).toBe(1);
    expect(retrievability(12, 12)).toBeCloseTo(0.9, 12);
    expect(nextInterval(12)).toBe(12);
    expect(nextInterval(0.2)).toBe(1);
    expect(nextInterval(5000)).toBe(365);
  });

  it('volgt de intervallen van ts-fsrs: zes keer goed, twee keer fout, vijf keer goed', () => {
    // Het schema van ts-fsrs v4.7.1 (BasicScheduler) rond de formules: een nieuw of opnieuw te
    // leren woord oefent eerst op dezelfde dag, daarna gaat het in dagen.
    type State = 'new' | 'learning' | 'review' | 'relearning';
    let state: State = 'new';
    let s = 0;
    let d = 0;
    let ivl = 0;
    const history: number[] = [];
    const ratings: Grade[] = [3, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3];
    for (const g of ratings) {
      if (state === 'new') {
        s = initStability(g);
        d = initDifficulty(g);
        state = 'learning';
        ivl = 0;
      } else if (state === 'learning' || state === 'relearning') {
        d = nextDifficulty(d, g);
        s = shortTermStability(s, g);
        if (g >= 3) {
          state = 'review';
          ivl = nextInterval(s);
        } else ivl = 0;
      } else {
        const r = retrievability(ivl, s);
        if (g === 1) {
          s = forgetStability(d, s, r);
          d = nextDifficulty(d, 1);
          state = 'relearning';
          ivl = 0;
        } else {
          const hard = Math.min(nextInterval(recallStability(d, s, r, 2)), nextInterval(recallStability(d, s, r, 3)));
          const good = Math.max(nextInterval(recallStability(d, s, r, 3)), hard + 1);
          s = recallStability(d, s, r, g);
          d = nextDifficulty(d, g);
          ivl = good;
        }
      }
      history.push(ivl);
    }
    expect(history).toEqual([0, 4, 14, 44, 125, 328, 0, 0, 7, 16, 34, 71, 142]);
  });

  it('een fout maakt de stabiliteit nooit groter dan ervoor', () => {
    for (const s of [0.5, 3, 20, 200]) {
      for (const days of [1, 10, 100]) expect(forgetStability(5, s, retrievability(days, s))).toBeLessThan(s);
    }
  });

  it('op de eerste dag telt ook hoe het aan het eind van de ronde ging', () => {
    const good = firstReview(3, 3);
    const slipped = firstReview(3, 1);
    expect(good.s).toBeGreaterThan(initStability(3));
    expect(slipped.s).toBeLessThan(initStability(3));
    expect(slipped.d).toBeGreaterThan(good.d);
    expect(firstReview(1)).toEqual({ s: initStability(1), d: initDifficulty(1) });
  });

  it('dezelfde dag nog eens: de korte formule, zonder verval', () => {
    const state = { s: 4, d: 5 };
    expect(review(state, 0, 3)).toEqual({ s: shortTermStability(4, 3), d: nextDifficulty(5, 3), r: 1 });
    const later = review(state, 4, 3);
    expect(later.r).toBeCloseTo(0.9, 12);
    expect(later.s).toBeGreaterThan(4);
  });
});
