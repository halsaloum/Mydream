/**
 * Echte 3D-modellen, gemaakt met Meshy (tekst naar 3D) en daarna verkleind voor het web. Hoe ze
 * gemaakt zijn, staat in `scripts/meshy.mjs`. De bestanden staan in `public/models`, zodat de app
 * ze zelf serveert en ze ook zonder Meshy blijven werken.
 */
export const MODELS = {
  fiets: {
    src: '/models/fiets.glb',
    poster: '/models/fiets.webp',
    alt: 'Een mintgroene speelgoedfiets met een zilveren bel, een geel koplampje, een bruin zadel, een bagagedrager, crèmekleurige spatborden, een kettingkast, trappers, een standaard en twee dikke banden.',
    /** Beginstand van de camera in graden (rondom, van boven): schuin van voren, aan de kant van de ketting. */
    view: [-145, 72],
  },
} as const;

export const MODEL_IDS = Object.keys(MODELS) as [keyof typeof MODELS, ...(keyof typeof MODELS)[]];
export type ModelId = keyof typeof MODELS;

const ARTICLES = ['de', 'het', 'een'] as const;

/** Vergelijkbaar maken: kleine letters, rechte apostrof, enkele spaties, geen punt aan het eind. */
export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*[.!]+$/, '');
}

function splitArticle(text: string): { article: string | null; word: string } {
  const [first, ...rest] = text.split(' ');
  if (rest.length > 0 && (ARTICLES as readonly string[]).includes(first ?? '')) return { article: first!, word: rest.join(' ') };
  return { article: null, word: text };
}

export type PartCheck = {
  answer: string;
  also?: readonly string[];
  traps?: readonly { w: string; note: string }[];
};

export type Verdict = { ok: true } | { ok: false; tip: string | null };

/**
 * Beoordeelt wat de leerling typt bij een onderdeel. Een bekende valkuil krijgt zijn eigen uitleg;
 * een goed woord met het verkeerde (of geen) lidwoord krijgt een gerichte tip.
 */
export function judgeAnswer(part: PartCheck, typed: string): Verdict {
  const given = normalizeAnswer(typed);
  if (!given) return { ok: false, tip: null };
  const good = [part.answer, ...(part.also ?? [])].map(normalizeAnswer);
  if (good.includes(given)) return { ok: true };
  const trap = part.traps?.find((item) => normalizeAnswer(item.w) === given);
  if (trap) return { ok: false, tip: trap.note };
  const want = splitArticle(normalizeAnswer(part.answer));
  const got = splitArticle(given);
  if (want.article && got.word === want.word) {
    if (!got.article) return { ok: false, tip: 'Het woord klopt. Zet er nog de of het voor.' };
    if (got.article === 'een') return { ok: false, tip: 'Het woord klopt. Kies nu het bepaalde lidwoord: de of het?' };
    return { ok: false, tip: `Het woord klopt, het lidwoord niet. Niet ${got.article}, maar…?` };
  }
  if (!want.article && got.article && got.word === want.word) return { ok: false, tip: 'Alleen het woord, zonder lidwoord.' };
  return { ok: false, tip: null };
}
