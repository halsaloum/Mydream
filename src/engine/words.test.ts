// @vitest-environment node
import { describe, expect, it } from 'vitest';
import type { StepOf } from '@/content/schema';
import { BOVENDIEN, DELEGEREN, DRAAGVLAK } from '@/content/words/bank/_voorbeelden';
import { containsWord, WordEntrySchema } from '@/content/words/schema';
import { wordTaskStep } from '@/lib/words/steps';
import { recallCorrect, recallNearMiss, writeStatus } from './words';

const word = (entry: typeof DRAAGVLAK, theme: string) => ({ ...entry, theme });

describe('ophalen nakijken', () => {
  const colloc = (entry: typeof DRAAGVLAK, theme: string) => wordTaskStep(word(entry, theme), 'colloc') as StepOf<'recall'>;

  it('hoofdletters, spaties en een punt tellen niet; elk goed alternatief telt', () => {
    const step = colloc(DRAAGVLAK, 'besluiten');
    expect(recallCorrect(step, ' Zoeken. ')).toBe(true);
    expect(recallCorrect(step, 'creëren')).toBe(true);
    expect(recallCorrect(step, 'maken')).toBe(false);
  });

  it('bijna goed noemt het antwoord waar je dichtbij zat; een ander voorzetsel is geen spelfout', () => {
    expect(recallNearMiss(colloc(DRAAGVLAK, 'besluiten'), 'zoekn')).toBe('zoeken');
    expect(recallNearMiss(colloc(DELEGEREN, 'leidinggeven'), 'van')).toBeNull();
  });

  it('staat het antwoord in de betekenis, dan krijg je alleen het woord als steuntje', () => {
    const step = colloc(DELEGEREN, 'leidinggeven');
    const answers = step.answers.map((answer) => answer.toLocaleLowerCase('nl'));
    expect(answers.some((answer) => new RegExp(`(^|\\s)${answer}(\\s|[.,]|$)`, 'i').test(step.clue))).toBe(false);
  });
});

describe('eigen zinnen', () => {
  const use = wordTaskStep(word(DELEGEREN, 'leidinggeven'), 'use0') as StepOf<'use'>;
  it('herkent ook een verbogen vorm en het woord van het kaartje', () => {
    expect(writeStatus(use, 'De gedelegeerde taken bespreek ik elke week met het hele team.').targets[0]?.found).toBe(true);
    expect(writeStatus(use, 'Ik wil vaker taken delegeren aan mijn team, zodat ik tijd heb.').targets[0]?.found).toBe(true);
    expect(writeStatus(use, 'Ik geef vaker taken aan mijn team, zodat ik tijd heb.').targets[0]?.found).toBe(false);
  });
  it('de inhoud zelf blijft streng: een buigingsuitgang telt daar niet', () => {
    expect(containsWord(DELEGEREN, 'De gedelegeerde taken.')).toBe(false);
    expect(containsWord(BOVENDIEN, 'Bovendiens')).toBe(false);
  });
});

describe('contract van de woordenbank', () => {
  it('het gat staat op het woord zelf, niet op een ander woord in de zin', () => {
    const wrong = { ...DRAAGVLAK, gaps: ['Voordat we {stemmen}, wil ik weten of er genoeg draagvlak is voor dit voorstel.', ...DRAAGVLAK.gaps.slice(1)] };
    const result = WordEntrySchema.safeParse(wrong);
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toContain('Het woord staat al buiten het gat');
  });
});
