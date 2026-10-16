import type { Diagnosis, Segmentation, SentenceToken } from './types';

/** Stable token IDs make saved selections independent of the visual layout. */
export function tokens(sentence: string): SentenceToken[] {
  return sentence.trim().split(/\s+/).map((text, index) => ({ id: `w${index}`, text }));
}
export function diagnosis(sentence: string, indices: number[], prompt: string, feedback: string): Diagnosis {
  return { prompt, tokens: tokens(sentence), targets: indices.map((index) => `w${index}`), feedback };
}
export function segmentation(groups: string[], feedback = 'Houd naamwoord- en voorzetselgroepen bij elkaar. De persoonsvorm en de overige werkwoorden kunnen aparte bouwblokken zijn.'): Segmentation {
  let position = 0;
  const boundaries = groups.slice(0, -1).map((group) => (position += group.trim().split(/\s+/).length));
  return { prompt: 'Knip de zin eerst in bouwblokken: zinsdelen en werkwoordelijke delen. Zet een grens tussen de blokken.', tokens: tokens(groups.join(' ')), boundaries, feedback };
}
