/**
 * Optimaliteitstheorie in het klein: welke kandidaat wint bij een rangorde van eisen?
 * Puur, zodat het contract een tableau kan controleren en de kaart hetzelfde rekent.
 */

export type TableauResult = {
  /** De kandidaat of kandidaten die overblijven; meer dan één betekent gelijkspel. */
  winners: number[];
  /** Per kandidaat de kolom (plek in de rangorde) waar hij afvalt, of `null` als hij overblijft. */
  fatal: (number | null)[];
};

/**
 * EVAL: loop de eisen af van hoog naar laag. Bij elke eis vallen de kandidaten af die meer
 * overtredingen hebben dan de beste kandidaat die nog over is.
 *
 * @param marks per kandidaat het aantal overtredingen per eis (in de volgorde van de eisen)
 * @param order de rangorde: indexen van eisen, hoogste eerst
 */
export function evaluateTableau(marks: readonly (readonly number[])[], order: readonly number[]): TableauResult {
  let alive = marks.map((_, candidate) => candidate);
  const fatal: (number | null)[] = marks.map(() => null);
  const violations = (candidate: number, constraint: number) => marks[candidate]?.[constraint] ?? 0;
  order.forEach((constraint, column) => {
    if (alive.length <= 1) return;
    const best = Math.min(...alive.map((candidate) => violations(candidate, constraint)));
    const survivors = alive.filter((candidate) => violations(candidate, constraint) === best);
    for (const candidate of alive) if (!survivors.includes(candidate)) fatal[candidate] = column;
    alive = survivors;
  });
  return { winners: alive, fatal };
}

/** Wint deze kandidaat in z'n eentje? */
export function winsAlone(marks: readonly (readonly number[])[], order: readonly number[], candidate: number): boolean {
  const { winners } = evaluateTableau(marks, order);
  return winners.length === 1 && winners[0] === candidate;
}

/** Alle rangordes van `n` eisen (n! stuks). */
export function rankings(n: number): number[][] {
  if (n <= 0) return [[]];
  return rankings(n - 1).flatMap((rest) => Array.from({ length: n }, (_, at) => [...rest.slice(0, at), n - 1, ...rest.slice(at)]));
}

/** Bestaat er een rangorde waarbij deze kandidaat in z'n eentje wint? */
export function canWin(marks: readonly (readonly number[])[], candidate: number): boolean {
  const constraints = marks[0]?.length ?? 0;
  return rankings(constraints).some((order) => winsAlone(marks, order, candidate));
}
