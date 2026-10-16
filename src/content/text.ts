/**
 * Tekstconventies van het inhoudscontract. Deze functies bepalen hoe indexen en markeringen
 * in lesinhoud worden gelezen; engine, validatie en weergave gebruiken dezelfde definitie.
 */

/** Woorden in een zin, zoals `mark.targets` en `fix.wrong` ze tellen: gesplitst op spaties, leestekens blijven aan het woord vast. */
export function tokenize(sentence: string): string[] {
  return sentence.split(' ');
}

export type RichSegment = { text: string; emphasis: boolean };

/** `*woord*` markeert een taalvoorbeeld. Geeft de tekst terug als reeks gewone en gemarkeerde stukken. */
export function parseRich(text: string): RichSegment[] {
  return text
    .split(/(\*[^*]+\*)/)
    .filter((part) => part.length > 0)
    .map((part) =>
      part.length > 2 && part.startsWith('*') && part.endsWith('*')
        ? { text: part.slice(1, -1), emphasis: true }
        : { text: part, emphasis: false },
    );
}

/** Platte tekst zonder markeringen, bijvoorbeeld voor toegankelijke labels. */
export function plainText(text: string): string {
  return parseRich(text)
    .map((segment) => segment.text)
    .join('');
}

export function hasBalancedEmphasis(text: string): boolean {
  return (text.match(/\*/g)?.length ?? 0) % 2 === 0;
}

/**
 * Controleert of `target` precies een volgorde van alle `parts` is, gescheiden door één spatie.
 * Werkt ook als delen zelf spaties bevatten (zoals blokken "op het station").
 */
export function isPermutationJoin(parts: readonly string[], target: string): boolean {
  const used = new Array<boolean>(parts.length).fill(false);
  const walk = (offset: number, placed: number): boolean => {
    if (placed === parts.length) return offset === target.length;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (used[i] || part === undefined || !target.startsWith(part, offset)) continue;
      const end = offset + part.length;
      const last = placed === parts.length - 1;
      if (last ? end !== target.length : target[end] !== ' ') continue;
      used[i] = true;
      if (walk(last ? end : end + 1, placed + 1)) return true;
      used[i] = false;
    }
    return false;
  };
  return walk(0, 0);
}
