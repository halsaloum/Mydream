import type { LessonInput } from '../../schema';
import { LES_L20 } from './l20';
import { LES_L21 } from './l21';
import { LES_L22 } from './l22';
import { LES_L23 } from './l23';
import { LES_L24 } from './l24';
import { LES_L25 } from './l25';
import { LES_L26 } from './l26';
import { LES_L27 } from './l27';
import { LES_K30 } from './k30';
import { LES_K31 } from './k31';
import { LES_K32 } from './k32';
import { LES_K33 } from './k33';
import { LES_K34 } from './k34';
import { LES_K35 } from './k35';
import { LES_K36 } from './k36';
import { LES_K37 } from './k37';
import { LES_K38 } from './k38';
import { LES_K39 } from './k39';
import { LES_K40 } from './k40';
import { LES_G20 } from './g20';
import { LES_G21 } from './g21';
import { LES_G22 } from './g22';
import { LES_G23 } from './g23';
import { LES_G24 } from './g24';
import { LES_G25 } from './g25';
import { LES_G26 } from './g26';
import { LES_G27 } from './g27';
import { LES_G28 } from './g28';

/**
 * De praktijklessen van de eerste drie niveaus: de spellingregels kennen en toepassen, zonder
 * taalwetenschap, geschiedenis of vergelijking met andere talen. Per niveau eerst de regels, dan
 * een toets die alles door elkaar vraagt. Ze vervangen de basis-, bachelor- en masterlessen die
 * hier eerder stonden.
 */
export const LETTER_PRAKTIJK: readonly LessonInput[] = [LES_L20, LES_L21, LES_L22, LES_L23, LES_L24, LES_L25, LES_L26, LES_L27];
export const KLANK_PRAKTIJK: readonly LessonInput[] = [LES_K30, LES_K31, LES_K32, LES_K33, LES_K34, LES_K35, LES_K36, LES_K37, LES_K38, LES_K39, LES_K40];
export const GREEP_PRAKTIJK: readonly LessonInput[] = [LES_G20, LES_G21, LES_G22, LES_G23, LES_G24, LES_G25, LES_G26, LES_G27, LES_G28];
