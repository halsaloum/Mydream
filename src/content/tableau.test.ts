import { describe, expect, it } from 'vitest';
import { canWin, evaluateTableau, rankings, winsAlone } from './tableau';

// /hɔnd/ → kandidaten [hɔnd] en [hɔnt]; eisen IDENT(voice) en ∗VOICED-CODA.
const HOND = [
  [0, 1],
  [1, 0],
];

// /zɑk+duk/ → [zɑkduk], [zɑgduk], [zɑktuk]; eisen IDENT(voice), AGREE(voice), IDENT-ONS(voice).
const ZAKDOEK = [
  [0, 1, 0],
  [1, 0, 0],
  [1, 0, 1],
];

describe('OT-tableau', () => {
  it('laat de hoogste eis beslissen en noteert waar een kandidaat afvalt', () => {
    expect(evaluateTableau(HOND, [0, 1])).toEqual({ winners: [0], fatal: [null, 0] });
    expect(evaluateTableau(HOND, [1, 0])).toEqual({ winners: [1], fatal: [0, null] });
  });

  it('werkt met strikte dominantie: lagere eisen tellen niet meer zodra er één over is', () => {
    expect(evaluateTableau([[1, 0], [0, 3]], [0, 1]).winners).toEqual([1]);
  });

  it('geeft gelijkspel als de eisen geen verschil maken', () => {
    expect(evaluateTableau([[1, 0], [1, 0]], [0, 1])).toEqual({ winners: [0, 1], fatal: [null, null] });
  });

  it('kent alle rangordes', () => {
    expect(rankings(0)).toEqual([[]]);
    expect(rankings(3)).toHaveLength(6);
    const four = rankings(4);
    expect(four).toHaveLength(24);
    expect(new Set(four.map((order) => order.join())).size).toBe(24);
    expect(four.every((order) => order.toSorted().join() === '0,1,2,3')).toBe(true);
  });

  it('herkent een kandidaat die bij geen enkele rangorde kan winnen', () => {
    expect(canWin(ZAKDOEK, 1)).toBe(true);
    expect(canWin(ZAKDOEK, 2)).toBe(false);
    expect(winsAlone(ZAKDOEK, [1, 0, 2], 1)).toBe(true);
    expect(winsAlone(ZAKDOEK, [0, 1, 2], 1)).toBe(false);
  });
});
