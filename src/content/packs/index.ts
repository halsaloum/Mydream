import type { CoursePackInput, LessonInput } from '../schema';
import { DEEL_LESSONS } from './deel';
import { DEEL_EXTRA_LESSONS } from './deel-extra';
import { DEEL_MASTER_LESSONS } from './deel-master';
import { GREEP_LESSONS } from './greep';
import { GROEP_LESSONS } from './groep';
import { GROEP_BOUW_LESSONS } from './groep-bouw';
import { GROEP_EXTRA_LESSONS, GROEP_MASTER_LESSONS } from './groep-master';
import { GROEP_THEORIE_LESSONS } from './groep-theorie';
import { GREEP_MASTER_LESSONS } from './greep-master';
import { GREEP_EXTRA_LESSONS } from './greep-extra';
import { KLANK_LESSONS } from './klank';
import { KLANK_EXTRA_MASTER_LESSONS, KLANK_VARIATIE_LESSONS } from './klank-extra';
import { KLANK_MASTER_LESSONS } from './klank-master';
import { LETTER_LESSONS } from './letter';
import { LETTER_MASTER_LESSONS } from './letter-master';
import { WOORD_LESSONS } from './woord';
import { WOORD_EXTRA_LESSONS, WOORD_EXTRA_MASTER_LESSONS } from './woord-extra';
import { WOORD_MASTER_LESSONS } from './woord-master';
import { LES_D21 } from './nieuw/d21';
import { LES_W24 } from './nieuw/w24';
import { withResearch } from './onderzoek';

/**
 * Lessen die later bij de oorspronkelijke niveaus zijn geschreven, per niveau-id. Ze komen achter
 * de bestaande lessen van dat niveau en lopen op in diepte: basis, bachelor, master.
 */
export const EXTRA_LESSONS: Readonly<Record<string, readonly LessonInput[]>> = {
  letter: [...LETTER_LESSONS, ...LETTER_MASTER_LESSONS],
  klank: [...KLANK_LESSONS, ...KLANK_VARIATIE_LESSONS, ...KLANK_MASTER_LESSONS, ...KLANK_EXTRA_MASTER_LESSONS],
  greep: [...GREEP_LESSONS, ...GREEP_EXTRA_LESSONS, ...GREEP_MASTER_LESSONS],
  deel: withResearch([...DEEL_LESSONS, ...DEEL_EXTRA_LESSONS, LES_D21, ...DEEL_MASTER_LESSONS]),
  woord: withResearch([...WOORD_LESSONS, ...WOORD_EXTRA_LESSONS, LES_W24, ...WOORD_MASTER_LESSONS, ...WOORD_EXTRA_MASTER_LESSONS]),
  groep: [...GROEP_LESSONS, ...GROEP_BOUW_LESSONS, ...GROEP_EXTRA_LESSONS, ...GROEP_MASTER_LESSONS, ...GROEP_THEORIE_LESSONS],
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
