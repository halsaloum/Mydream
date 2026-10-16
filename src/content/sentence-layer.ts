import type { CoursePackInput } from './schema';

export const SENTENCE_LAYER_ID = 'zinnen';
export const LEGACY_SENTENCE_LAYER_IDS = ['groep', 'zin', 'samen'] as const;

/** Oude gedeelde bibliotheeklinks blijven naar de volledige afdeling Zinnen wijzen. */
export function canonicalLayerId(id: string): string {
  return LEGACY_SENTENCE_LAYER_IDS.some((legacy) => legacy === id) ? SENTENCE_LAYER_ID : id;
}

/** De oude onderwerpnamen blijven bruikbaar bij het zoeken naar bestaande lessen. */
export function sentenceSearchTerms(lessonId: string): string {
  if (/^p\d+$/.test(lessonId)) return 'woordgroep de woordgroep';
  if (/^z\d+$/.test(lessonId)) return 'enkelvoudige zin de enkelvoudige zin';
  if (/^s\d+$/.test(lessonId)) return 'samengestelde zin de samengestelde zin';
  return '';
}

/**
 * Voegt de drie zinsbouwlagen samen nadat alle oorspronkelijke lessen zijn uitgebreid.
 * Alleen de afdeling verandert: lesobjecten, ids, stappen en hun volgorde blijven gelijk,
 * zodat opgeslagen voortgang, lopende sessies en bestaande leslinks bruikbaar blijven.
 */
export function withSentenceLayer(pack: CoursePackInput): CoursePackInput {
  const sentenceLayers = pack.layers.filter((layer) => canonicalLayerId(layer.id) === SENTENCE_LAYER_ID);
  if (sentenceLayers.length === 0) return pack;
  if (sentenceLayers.length === 1 && sentenceLayers[0]?.id === SENTENCE_LAYER_ID) return pack;
  if (sentenceLayers.length !== LEGACY_SENTENCE_LAYER_IDS.length || !LEGACY_SENTENCE_LAYER_IDS.every((id) => sentenceLayers.some((layer) => layer.id === id))) {
    throw new Error('Zinnen kan alleen de volledige lagen groep, zin en samen samenvoegen.');
  }
  const first = sentenceLayers[0]!;
  const last = sentenceLayers.at(-1)!;
  const combined: CoursePackInput['layers'][number] = {
    ...first,
    id: SENTENCE_LAYER_ID,
    name: 'Zinnen',
    icon: '[—].',
    made: 'woordgroepen, zinsdelen en verbonden zinnen',
    learn: 'Van woorden die bij elkaar horen naar volledige zinnen: ontleden, bouwen, verbinden en verbeteren.',
    fields: [...new Set(sentenceLayers.flatMap((layer) => layer.fields))],
    example: last.example,
    accent: 'navy',
    ...(last.growth ? { growth: last.growth } : {}),
    lessons: sentenceLayers.flatMap((layer) => layer.lessons),
  };
  return {
    ...pack,
    layers: pack.layers.flatMap((layer) => layer === first ? [combined] : canonicalLayerId(layer.id) === SENTENCE_LAYER_ID ? [] : [layer]),
  };
}
