import { describe, expect, it } from 'vitest';
import { argumentLessons } from './curriculum';
import { exerciseDiagram } from './diagrams';
import { validateArgumentMap } from '@/lib/argumentation/maps';

describe('uitgewerkte kaarten bij reconstructieopdrachten', () => {
  it('verbindt bestaande kaartrollen en onderscheidt aanvalsdoelen', () => {
    let count = 0;
    for (const exercise of argumentLessons.flatMap((lesson) => lesson.exercises)) {
      if (exercise.kind !== 'map') continue;
      const result = exerciseDiagram(exercise, Object.fromEntries(exercise.cards.map((card) => [card.id, card.category])));
      if (!result) continue;
      count++;
      expect(validateArgumentMap(result.map), exercise.id).toEqual([]);
      expect(result.map.nodes.every((node) => node.text.trim().length > 0), exercise.id).toBe(true);
      for (const attack of result.map.attacks) {
        expect(attack.kind === 'undercut' ? result.map.inferences.some((inference) => inference.id === attack.to) : result.map.nodes.some((node) => node.id === attack.to)).toBe(true);
      }
    }
    expect(count).toBe(4);
  });
});
