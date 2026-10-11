// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { StepSchema } from '@/content/schema';
import { composeItem, lookupWordStep, situationFor, TASKS, wordTaskItem } from '@/lib/words/steps';
import { BANK } from './bank';
import { THEMES, WORDS } from './index';
import { containsWord, gapSolution, WordEntrySchema } from './schema';

const bare = (text: string) => text.toLocaleLowerCase('nl').replace(/^(de|het|een)\s+/, '').trim();

describe('woordenbank', () => {
  it('elk woord voldoet aan het contract', () => {
    const problems: string[] = [];
    for (const [theme, entries] of Object.entries(BANK)) {
      for (const entry of entries) {
        const result = WordEntrySchema.safeParse(entry);
        if (!result.success) problems.push(`${theme}/${entry.id}:\n${z.prettifyError(result.error)}`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('elke id en elk woord komt één keer voor, in één thema', () => {
    const ids = WORDS.map((word) => word.id);
    expect(new Set(ids).size).toBe(ids.length);
    const words = WORDS.map((word) => `${bare(word.word)}|${word.pos}`);
    expect(words.filter((word, i) => words.indexOf(word) !== i)).toEqual([]);
  });

  it('elk thema in de bank bestaat, en heeft situaties voor de schrijfopdracht', () => {
    const known = new Set(THEMES.map((theme) => theme.id));
    expect(Object.keys(BANK).filter((id) => !known.has(id))).toEqual([]);
    for (const theme of THEMES.filter((candidate) => candidate.group === 'vak')) expect(theme.situations.length).toBeGreaterThan(0);
  });

  it('het woord staat niet al in de situatie waarin je het moet benoemen', () => {
    expect(WORDS.filter((word) => containsWord(word, word.name.situation)).map((word) => word.id)).toEqual([]);
  });

  it('elke opdracht die de app maakt, voldoet aan het contract van de lesplayer', () => {
    const problems: string[] = [];
    for (const word of WORDS) {
      for (const task of TASKS) {
        const item = wordTaskItem(word, task);
        const result = StepSchema.safeParse(item.step);
        if (!result.success) problems.push(`${word.id}:${task}\n${z.prettifyError(result.error)}`);
        expect(lookupWordStep(item.key)?.key).toBe(item.key);
      }
    }
    expect(problems).toEqual([]);
  });

  it('de schrijfopdracht aan het eind werkt met de woorden van elk thema', () => {
    for (const theme of THEMES) {
      const words = WORDS.filter((word) => word.theme === theme.id).slice(0, 3);
      if (words.length < 2) continue;
      const key = theme.situations.length ? `${theme.id}.0` : 'algemeen.0';
      const item = composeItem(words, situationFor(key)!, key);
      expect(StepSchema.safeParse(item.step).success).toBe(true);
      expect(lookupWordStep(item.key)?.key).toBe(item.key);
      // Het voorbeeld bij de schrijfopdracht bevat de woorden zelf.
      words.forEach((word, i) => expect(containsWord(word, item.step.kind === 'use' ? item.step.models[i]! : '')).toBe(true));
    }
  });

  it('een verouderde sleutel (andere inhoud) bestaat niet meer', () => {
    const word = WORDS[0]!;
    const item = wordTaskItem(word, 'recall0');
    expect(lookupWordStep(item.key.replace(/#.*$/, '#oud'))).toBeUndefined();
    expect(lookupWordStep('woorden:bestaat-niet:recall0#x')).toBeUndefined();
    expect(gapSolution(word.gaps[0]!)).not.toContain('{');
  });
});
