import type { WordEntry } from '../schema';
import { BOVENDIEN, DELEGEREN, DRAAGVLAK, KNOOP_DOORHAKKEN } from './_voorbeelden';

/** De woorden per thema, in de volgorde waarin je ze leert (de belangrijkste eerst). */
export const BANK: Record<string, readonly WordEntry[]> = {
  leidinggeven: [DELEGEREN],
  besluiten: [DRAAGVLAK],
  uitdrukkingen: [KNOOP_DOORHAKKEN],
  verbanden: [BOVENDIEN],
};
