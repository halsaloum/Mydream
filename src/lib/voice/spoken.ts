import { course } from '@/content/catalog';
import { demoEntries } from '@/content/demo';
import { CONSONANT_TABLE } from '@/content/packs/tables';
import { parseRich } from '@/content/text';
import { VOWEL_INFO } from '@/content/vowels';
import { speakableExample } from '@/lib/speech';
import { FIXED_SPOKEN } from './fixed';

/**
 * Alles wat pennig kan voorlezen, zoals het in de app staat. Hieruit maakt `scripts/stem/` de
 * geluidsbestanden van de pennig-stem. `task` is wat je móet horen om een opdracht te doen
 * (dictees en reeksen); de rest zijn voorbeelden die je kunt aantikken.
 */
export type SpokenText = { text: string; task: boolean };

export function collectSpoken(): SpokenText[] {
  const found = new Map<string, boolean>();
  const add = (text: string | null | undefined, task = false) => {
    const clean = text?.replace(/\s+/g, ' ').trim();
    if (!clean) return;
    found.set(clean, (found.get(clean) ?? false) || task);
  };

  const walk = (value: unknown, key = ''): void => {
    if (typeof value === 'string') {
      // Gekleurde voorbeelden in uitleg, regels en opdrachten (*huis*): aan te tikken.
      for (const segment of parseRich(value)) if (segment.emphasis) add(speakableExample(segment.text));
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => walk(item, key));
      return;
    }
    if (!value || typeof value !== 'object') return;
    const node = value as Record<string, unknown>;
    if (node.kind === 'dictation' && typeof node.sentence === 'string') add(node.sentence, true);
    if (node.kind === 'passage' && Array.isArray(node.sentences)) node.sentences.forEach((sentence) => add(String(sentence), true));
    if (node.kind === 'drill' && Array.isArray(node.items)) {
      for (const item of node.items as Array<{ say?: string }>) add(item.say, true);
    }
    // Voorbeelden met een luisterknop (goed/fout-paren) en de antwoorden van de vormmachine en de samenstelbank.
    if (typeof node.right === 'string' && key === 'example') add(speakableExample(node.right, { sentence: true }));
    if ((key === 'morph' || key === 'compound') && Array.isArray(node.rounds)) {
      for (const round of node.rounds as Array<{ answer?: unknown }>) if (typeof round.answer === 'string') add(round.answer);
    }
    for (const [childKey, child] of Object.entries(node)) walk(child, childKey);
  };

  walk(course.layers);
  walk(demoEntries.map((entry) => entry.step));

  // Klinkerkaart en medeklinkertabel: elk voorbeeldwoord en elk contrastpaar.
  const words = (value: unknown): void => {
    if (Array.isArray(value)) return value.forEach(words);
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (key === 'word' && typeof child === 'string') add(child);
      else words(child);
    }
  };
  words(VOWEL_INFO);
  words(CONSONANT_TABLE);

  FIXED_SPOKEN.forEach((text) => add(text));
  return [...found].map(([text, task]) => ({ text, task })).sort((a, b) => a.text.localeCompare(b.text, 'nl'));
}
