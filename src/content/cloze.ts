/**
 * Invulteksten en getypte antwoorden in spellingoefeningen.
 *
 * Een invultekst is gewone tekst met gaten tussen accolades:
 *
 *   `Mijn {vriend} woont in een {stad|st…} met veel {bruggen|brug, meervoud|Eén brug, twee bruggen: korte u, dus gg.}.`
 *
 * - `{antwoord}`: een gat zonder aanwijzing.
 * - `{antwoord|aanwijzing}`: de aanwijzing staat grijs in het lege vakje.
 * - `{antwoord|aanwijzing|uitleg}`: de uitleg verschijnt na het nakijken als het gat fout is.
 * - Meer goede antwoorden: scheid ze met `~`, bv. `{collega’s~collegae}`. Een gekrulde en een rechte
 *   apostrof gelden als hetzelfde antwoord, dus die hoef je niet allebei te noemen.
 * - Een lege regel (`\n\n`) begint een nieuwe alinea.
 *
 * Engine, validatie en weergave lezen de tekst met dezelfde functie.
 */

export type ClozeGap = { answers: string[]; cue: string | null; note: string | null };
export type ClozePart = { kind: 'text'; text: string } | { kind: 'gap'; gap: number };
export type ParsedCloze = { parts: ClozePart[]; gaps: ClozeGap[] };

/** Leest een invultekst. Geeft een foutmelding als de markering niet klopt. */
export function parseCloze(text: string): ParsedCloze | { error: string } {
  const parts: ClozePart[] = [];
  const gaps: ClozeGap[] = [];
  let rest = text;
  while (rest.length > 0) {
    const open = rest.indexOf('{');
    const close = rest.indexOf('}');
    if (open === -1) {
      if (close !== -1) return { error: 'Er staat een } zonder {' };
      parts.push({ kind: 'text', text: rest });
      break;
    }
    if (close !== -1 && close < open) return { error: 'Er staat een } zonder {' };
    if (close === -1) return { error: 'Er staat een { zonder }' };
    const inner = rest.slice(open + 1, close);
    if (inner.includes('{')) return { error: 'Gaten mogen niet in elkaar staan' };
    if (open > 0) parts.push({ kind: 'text', text: rest.slice(0, open) });
    const segments = inner.split('|');
    if (segments.length > 3) return { error: `Te veel | in {${inner}}: gebruik {antwoord|aanwijzing|uitleg}` };
    const answers = (segments[0] ?? '').split('~').map((answer) => answer.trim());
    if (answers.some((answer) => answer.length === 0)) return { error: `Leeg antwoord in {${inner}}` };
    const cue = segments[1]?.trim() || null;
    const note = segments[2]?.trim() || null;
    parts.push({ kind: 'gap', gap: gaps.length });
    gaps.push({ answers, cue, note });
    rest = rest.slice(close + 1);
  }
  return { parts, gaps };
}

/** Leest een invultekst waarvan bekend is dat hij klopt (na validatie). */
export function clozeOf(text: string): ParsedCloze {
  const parsed = parseCloze(text);
  if ('error' in parsed) throw new Error(parsed.error);
  return parsed;
}

/** De tekst met de goede antwoorden ingevuld, bv. om voor te lezen of te tonen. */
export function clozeSolution(text: string): string {
  const { parts, gaps } = clozeOf(text);
  return parts.map((part) => (part.kind === 'text' ? part.text : (gaps[part.gap]?.answers[0] ?? ''))).join('');
}

/**
 * Een getypt antwoord gelijk maken voor de vergelijking: spaties, gekrulde aanhalingstekens
 * (telefoons) en een punt aan het eind tellen niet. Hoofdletters tellen alleen als `caps`.
 */
export function normalizeAnswer(text: string, caps: boolean): string {
  const plain = text
    .normalize('NFC')
    .replace(/[‘’`´]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*[.!?]+$/, '');
  return caps ? plain : plain.toLocaleLowerCase('nl');
}

/**
 * Is het getypte antwoord een van de goede antwoorden? Met `caps` telt elke hoofdletter. Zonder
 * `caps` mag je een hoofdletter te veel typen, maar een hoofdletter die in het antwoord hoort
 * (*België*, *IJsland*) moet er wel staan.
 */
export function matchesAnswer(typed: string, answers: readonly string[], caps: boolean): boolean {
  const mine = normalizeAnswer(typed, true);
  if (mine.length === 0) return false;
  return answers.some((answer) => {
    const want = normalizeAnswer(answer, true);
    if (caps) return want === mine;
    return want.toLocaleLowerCase('nl') === mine.toLocaleLowerCase('nl') && keepsCapitals(want, mine);
  });
}

/** Staat elke hoofdletter van het antwoord ook in het getypte woord? */
function keepsCapitals(want: string, mine: string): boolean {
  const typed = Array.from(mine);
  return Array.from(want).every((char, i) => char === char.toLocaleLowerCase('nl') || typed[i] === char);
}
