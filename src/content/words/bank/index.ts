import type { WordEntry } from '../schema';
import { BOVENDIEN, DELEGEREN, DRAAGVLAK, KNOOP_DOORHAKKEN } from './_voorbeelden';
import { LEIDINGGEVEN } from './leidinggeven';
import { VISIE } from './visie';
import { BESLUITEN } from './besluiten';
import { VERGADEREN } from './vergaderen';
import { FEEDBACK } from './feedback';
import { MOTIVEREN } from './motiveren';
import { PLANNEN } from './plannen';
import { CONFLICT } from './conflict';
import { VERANDERING } from './verandering';
import { OVERTUIGEN } from './overtuigen';
import { TEAM } from './team';
import { RESULTAAT } from './resultaat';
import { GELD } from './geld';
import { INTEGRITEIT } from './integriteit';
import { PERSONEEL } from './personeel';
import { UITDRUKKINGEN } from './uitdrukkingen';
import { VERBANDEN } from './verbanden';
import { DENKEN } from './denken';
import { ZEGGEN } from './zeggen';
import { FORMEEL } from './formeel';
import { DAGELIJKS } from './dagelijks';
import { GEVOEL } from './gevoel';
import { TIJD } from './tijd';
import { BESCHRIJVEN } from './beschrijven';

/** De woorden per thema, in de volgorde waarin je ze leert (de belangrijkste eerst). */
export const BANK: Record<string, readonly WordEntry[]> = {
  leidinggeven: [DELEGEREN, ...LEIDINGGEVEN],
  visie: VISIE,
  besluiten: [DRAAGVLAK, ...BESLUITEN],
  vergaderen: VERGADEREN,
  feedback: FEEDBACK,
  motiveren: MOTIVEREN,
  plannen: PLANNEN,
  conflict: CONFLICT,
  verandering: VERANDERING,
  overtuigen: OVERTUIGEN,
  team: TEAM,
  resultaat: RESULTAAT,
  geld: GELD,
  integriteit: INTEGRITEIT,
  personeel: PERSONEEL,
  uitdrukkingen: [KNOOP_DOORHAKKEN, ...UITDRUKKINGEN],
  verbanden: [BOVENDIEN, ...VERBANDEN],
  denken: DENKEN,
  zeggen: ZEGGEN,
  formeel: FORMEEL,
  dagelijks: DAGELIJKS,
  gevoel: GEVOEL,
  tijd: TIJD,
  beschrijven: BESCHRIJVEN,
};
