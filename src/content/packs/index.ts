import type { CoursePackInput, LessonInput } from '../schema';
import { DEEL_LESSONS } from './deel';
import { DEEL_MASTER_LESSONS } from './deel-master';
import { GREEP_LESSONS } from './greep';
import { GREEP_MASTER_LESSONS } from './greep-master';
import { KLANK_LESSONS } from './klank';
import { KLANK_MASTER_LESSONS } from './klank-master';
import { LETTER_LESSONS } from './letter';
import { WOORD_LESSONS } from './woord';
import { WOORD_MASTER_LESSONS } from './woord-master';

/**
 * Lessen die later bij de oorspronkelijke niveaus zijn geschreven, per niveau-id. Ze komen achter
 * de bestaande lessen van dat niveau en lopen op in diepte: basis, bachelor, master.
 */
export const EXTRA_LESSONS: Readonly<Record<string, readonly LessonInput[]>> = {
  letter: LETTER_LESSONS,
  klank: [...KLANK_LESSONS, ...KLANK_MASTER_LESSONS],
  greep: [...GREEP_LESSONS, ...GREEP_MASTER_LESSONS],
  deel: [...DEEL_LESSONS, ...DEEL_MASTER_LESSONS],
  woord: [...WOORD_LESSONS, ...WOORD_MASTER_LESSONS],
};

/** Voegt de extra lessen toe aan hun niveau. Een onbekend niveau is een fout in de inhoud. */
export function withExtraLessons(pack: CoursePackInput, extra: Readonly<Record<string, readonly LessonInput[]>> = EXTRA_LESSONS): CoursePackInput {
  const unknown = Object.keys(extra).filter((id) => !pack.layers.some((layer) => layer.id === id));
  if (unknown.length > 0) throw new Error(`Extra lessen voor onbekend niveau: ${unknown.join(', ')}`);
  return {
    ...pack,
    layers: pack.layers.map((layer) => ({ ...layer, lessons: [...layer.lessons, ...(extra[layer.id] ?? [])] })),
  };
}
