import { describe, expect, it } from 'vitest';
import { bracketDistance, checkFields, emptyFields, inspectWriting, moveChunk, quantifierHolds, tokenizeText } from './workbench';
describe('bounded Dutch workbench models', () => {
  it('accepts several first constituents and rejects a misplaced finite verb', () => {
    const valid = { voorveld: [5], 'eerste-pool': [1], middenveld: [0, 2, 3], 'tweede-pool': [4], achterveld: [] };
    expect(checkFields(valid).correct).toBe(true);
    expect(checkFields({ ...valid, voorveld: [2], middenveld: [0, 5, 3] }).correct).toBe(true);
    expect(checkFields({ ...valid, 'eerste-pool': [4], 'tweede-pool': [1] }).correct).toBe(false);
    expect(checkFields({ ...valid, middenveld: [0, 2, 2] }).correct).toBe(false);
  });
  it('moves a chunk without duplicating it and can return it to the bank', () => {
    const original = moveChunk(emptyFields(), 0, 'voorveld');
    const moved = moveChunk(original, 0, 'middenveld');
    expect(moved.voorveld).toEqual([]);
    expect(moved.middenveld).toEqual([0]);
    expect(original.voorveld).toEqual([0]);
    expect(moveChunk(moved, 0, null).middenveld).toEqual([]);
  });
  it('keeps exact offsets for accents, apostrophes and repeated references', () => {
    const text = 'Zo’n patiënt krijgt hulp. Die hulp werkt.\n\nDit helpt óók.';
    const result = inspectWriting(text);
    expect(result.paragraphs).toBe(2);
    expect(result.sentences).toHaveLength(3);
    expect(result.references.map(word => word.text)).toEqual(['Die', 'Dit']);
    for (const word of result.words) expect(text.slice(word.start, word.end)).toBe(word.text);
    for (const sentence of result.sentences) for (const word of sentence.words) expect(text.slice(word.start, word.end)).toBe(word.text);
    expect(inspectWriting('  ').sentences).toEqual([]);
    expect(inspectWriting('Eerste regel\nTweede regel').sentences.map(sentence => sentence.text)).toEqual(['Eerste regel', 'Tweede regel']);
  });
  it('counts only between manually marked brackets', () => {
    const words = tokenizeText('Noor heeft het nieuwe verslag gisteren gelezen.');
    expect(bracketDistance(words, 1, 6)).toBe(4);
    expect(bracketDistance(words, 6, 1)).toBeNull();
    expect(bracketDistance(words, null, 6)).toBeNull();
  });
  it('tests existential at-least-one separately from not-all', () => {
    expect(quantifierHolds('sommige', 6, 0)).toBe(false);
    expect(quantifierHolds('sommige', 6, 1)).toBe(true);
    expect(quantifierHolds('sommige', 6, 6)).toBe(true);
    expect(quantifierHolds('niet-alle', 6, 0)).toBe(true);
    expect(quantifierHolds('alle', 6, 5)).toBe(false);
    expect(quantifierHolds('geen', 6, 0)).toBe(true);
    expect(quantifierHolds('alle', 0, 0)).toBe(false);
  });
});
