import { describe, expect, it } from 'vitest';
import { argumentLessons } from './index';
import { conditionalHolds, lessonIllustrations, quantifierTruth } from './illustrations';

describe('authored lesson illustrations', () => {
  it('covers every current lesson with distinct, described alternatives', () => {
    expect(Object.keys(lessonIllustrations).sort()).toEqual(argumentLessons.map((lesson) => lesson.id).sort());
    for (const [lessonId, entry] of Object.entries(lessonIllustrations)) {
      expect(entry.variants.length, lessonId).toBeGreaterThanOrEqual(2);
      expect(entry.variants.length, lessonId).toBeLessThanOrEqual(3);
      expect(new Set(entry.variants.map((variant) => variant.id)).size, lessonId).toBe(entry.variants.length);
      expect(new Set(entry.variants.map((variant) => JSON.stringify(variant.data))).size, lessonId).toBe(entry.variants.length);
      for (const variant of entry.variants) expect(variant.caption.length, `${lessonId}/${variant.id}`).toBeGreaterThan(60);
    }
  });

  it('keeps all authored relation endpoints and visible cards consistent', () => {
    for (const entry of Object.values(lessonIllustrations)) {
      for (const variant of entry.variants) {
        const data = variant.data;
        if (data.family !== 'flow') continue;
        const ids = data.nodes.map((node) => node.id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(data.rows.flat().sort()).toEqual(ids.slice().sort());
        expect(data.edges.length).toBeGreaterThan(0);
        for (const edge of data.edges) {
          expect(ids).toContain(edge.from);
          expect(ids).toContain(edge.to);
          expect(edge.label.trim().length).toBeGreaterThan(4);
        }
      }
    }
  });

  it('distinguishes all four conditional assignments, without reversing only-if', () => {
    expect([conditionalHolds(true, true), conditionalHolds(true, false), conditionalHolds(false, true), conditionalHolds(false, false)]).toEqual([true, false, true, true]);
    const variants = lessonIllustrations['basis-voorwaarden-en-gevolgen']!.variants;
    expect(variants.map((variant) => variant.data.family === 'condition' && variant.data.direction)).toEqual(['if', 'only-if']);
  });

  it('does not smuggle existence into a universal claim and checks group membership', () => {
    const onlyOutside = [{ id: 'outside', name: 'Dossier X', member: false, property: false }];
    expect(quantifierTruth(onlyOutside)).toEqual({ all: true, some: false, none: true, members: 0, counterexamples: [] });
    expect(quantifierTruth([...onlyOutside, { id: 'inside', name: 'Dossier Y', member: true, property: false }])).toEqual({ all: false, some: false, none: true, members: 1, counterexamples: ['inside'] });
  });
});
