import { dialogueFallacies } from './fallacies-dialogue';
import { appealFallacies } from './fallacies-appeals';
import { evidenceFallacies } from './fallacies-evidence';
import { transferFallacies } from './fallacies-transfer';
import { buildFallacy } from './fallacy-builder';

export const fallacySeeds = [...dialogueFallacies, ...appealFallacies, ...evidenceFallacies, ...transferFallacies];
const packs = fallacySeeds.map(buildFallacy);
export const fallacyLessons = packs.map((pack) => pack.lesson);
export const fallacyScaffolds = Object.fromEntries(packs.map((pack) => [pack.lesson.id, pack.scaffold]));
export const fallacyCoreChecks = Object.fromEntries(packs.map((pack) => [pack.lesson.id, pack.core]));
export const fallacyInquiries = Object.fromEntries(packs.map((pack) => [pack.lesson.id, pack.inquiry]));
export const fallacyIllustrations = Object.fromEntries(packs.map((pack) => [pack.lesson.id, pack.illustration]));
export const fallacySourceGuide = Object.fromEntries(packs.map((pack) => [pack.lesson.id, pack.sourceGuide]));
export const fallacyMedia = Object.fromEntries(packs.map((pack) => [pack.lesson.id, pack.mediaIds]));
export const fallacyFamilies = [...new Set(fallacySeeds.map((seed) => seed.family))];
