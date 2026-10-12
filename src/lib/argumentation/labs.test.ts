import { describe, expect, it } from 'vitest';
import { calculateBayes, calculateCausality, describeStructure, type StructureState } from './labs';

describe('argumentation simulations', () => {
  it('reproduces a Simpson reversal without changing either within-group difference', () => {
    const result = calculateCausality(10);
    expect(result.lessonRate).toBeCloseTo(0.36);
    expect(result.controlRate).toBeCloseTo(0.74);
    expect(result.reversed).toBe(true);
    expect(result.rows.every((row) => Math.abs(row.lessonRate - row.controlRate - 0.1) < 1e-10)).toBe(true);
    expect(result.rows.reduce((sum, row) => sum + row.lessonTotal, 0)).toBe(1000);
    expect(result.rows.reduce((sum, row) => sum + row.controlTotal, 0)).toBe(1000);
  });

  it('restores the known group difference when allocation is balanced', () => {
    const result = calculateCausality(10, true);
    expect(result.lessonRate).toBeCloseTo(0.6);
    expect(result.controlRate).toBeCloseTo(0.5);
    expect(result.difference).toBeCloseTo(0.1);
    expect(result.preparedShare).toBe(0.5);
  });

  it('calculates the posterior from all positive detections, not sensitivity alone', () => {
    const result = calculateBayes(0.01, 0.9, 0.95);
    expect(result.truePositive).toBe(90);
    expect(result.falsePositive).toBe(495);
    expect(result.positives).toBe(585);
    expect(result.posterior).toBeCloseTo(90 / 585);
    expect(result.truePositive + result.falseNegative + result.falsePositive + result.trueNegative).toBe(10000);
  });

  it('keeps fractional expected frequencies and handles impossible positive results', () => {
    const result = calculateBayes(0.015, 0.915, 0.995, 1000);
    expect(result.truePositive).toBeCloseTo(13.725);
    expect(result.posterior).toBeCloseTo(13.725 / (13.725 + 4.925));
    expect(calculateBayes(0, 1, 1).posterior).toBeNull();
    expect(calculateBayes(1, 0.8, 0.9).posterior).toBe(1);
    expect(() => calculateBayes(-0.1, 0.9, 0.9)).toThrow(RangeError);
  });

  it('uses joint evidence rather than independent marginal filters when their errors overlap', () => {
    const joint = calculateBayes(0.2, 0.85, 0.96);
    const independent = calculateBayes(0.2, 0.9 * 0.9, 1 - 0.05 * 0.05);
    expect(joint.truePositive).toBe(1700);
    expect(joint.falsePositive).toBe(320);
    expect(joint.posterior).toBeCloseTo(1700 / 2020);
    expect(independent.posterior).toBeCloseTo(1620 / 1640);
    expect(joint.posterior).toBeLessThan(independent.posterior ?? 0);
  });

  it('distinguishes linked and independent support after one reason is removed', () => {
    const state: StructureState = { mode: 'linked', firstReason: true, secondReason: false, warrant: true, objection: false };
    expect(describeStructure(state).hasPath).toBe(false);
    expect(describeStructure({ ...state, mode: 'independent' }).hasPath).toBe(true);
    expect(describeStructure({ ...state, mode: 'independent', warrant: false }).hasPath).toBe(false);
  });

  it('does not treat a defeater as a numerical truth score or erase the conclusion', () => {
    const result = describeStructure({ mode: 'linked', firstReason: true, secondReason: true, warrant: true, objection: true });
    expect(result.hasPath).toBe(true);
    expect(result.status).toBe('Ondersteund, maar aanvechtbaar');
  });
});
