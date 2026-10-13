import { describe, expect, it } from 'vitest';
import { structureLessons } from './structure';

function lesson(number: number) {
  const found = structureLessons.find((entry) => entry.number === number);
  if (!found) throw new Error(`Structuurles ${number} ontbreekt.`);
  return found;
}

describe('structuurlessen: grammaticale grensgevallen', () => {
  it('illustreert presentatief én kwantitatief er met een weggelaten zelfstandig naamwoord buiten het voorveld', () => {
    const entry = lesson(5);
    const combined = entry.discovery.variants.find((variant) => variant.id === 'er-samenval');
    expect(combined?.sentence).toBe('Vandaag zijn er drie gerepareerd.');
    expect(combined?.note).toContain('De fietsen zijn al genoemd');
    expect(combined?.note).toContain('Er zijn er drie gerepareerd');
    expect(entry.rules.find((rule) => rule.id === 'zin05-er')?.sourceIds).toContain('eans-er-combinaties');
  });

  it('verbindt bij inversie de lexicale onderwerpskern, ook wanneer hem direct na de persoonsvorm staat', () => {
    const exercise = lesson(6).arena.find((entry) => entry.kind === 'tether');
    expect(exercise?.kind).toBe('tether');
    if (exercise?.kind !== 'tether') return;
    const link = exercise.links.find((entry) => entry.from === 'w4');
    expect(exercise.tokens.find((token) => token.id === link?.from)?.text).toBe('docent');
    expect(exercise.tokens.find((token) => token.id === link?.to)?.text).toBe('heeft');
    expect(exercise.tokens.find((token) => token.id === 'w2')?.text).toBe('hem');
  });

  it('accepteert beide correcte deelwoordvolgordes en bewaart het onderscheid met IPP', () => {
    const entry = lesson(7);
    expect(entry.debugger.find((exercise) => exercise.id === 'zin07-debug-01')?.repairs).toEqual([
      'Ik hoor dat Noor heeft geschreven.',
      'Ik hoor dat Noor geschreven heeft.',
    ]);
    expect(entry.debugger.find((exercise) => exercise.id === 'zin07-debug-02')?.repairs).toEqual(['Ik heb altijd willen zwemmen.']);
    const separateClause = entry.arena.find((exercise) => exercise.id === 'zin07-arena-05');
    expect(separateClause?.kind).toBe('gate');
    if (separateClause?.kind !== 'gate') return;
    expect(separateClause.answer).toBe('geprobeerd');
    expect(separateClause.diagnosis.targets.map((id) => separateClause.diagnosis.tokens.find((token) => token.id === id)?.text)).toEqual(['om', 'te']);
  });

  it('houdt de persoonsvormen en onderwerpen van de twee deelzinnen uit elkaar', () => {
    const exercise = lesson(8).arena.find((entry) => entry.kind === 'tether');
    expect(exercise?.kind).toBe('tether');
    if (exercise?.kind !== 'tether') return;
    expect(exercise.links.map((link) => [
      exercise.tokens.find((token) => token.id === link.from)?.text,
      exercise.tokens.find((token) => token.id === link.to)?.text,
    ])).toEqual([['trams', 'rijden,'], ['wij', 'hoeven']]);
    expect(lesson(8).debugger.find((entry) => entry.id === 'zin08-debug-03')?.repairs).toEqual(['Ik ga mee, tenzij ik ziek word.']);
  });
});
