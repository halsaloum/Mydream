// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { lessonEntries } from '@/content/catalog';
import { activeFilterCount, EMPTY_FILTERS, filterLessons, filtersToQuery, lessonKinds, parseFilters, type LibraryFilters } from './filters';

const allNew = () => 'new' as const;
const filter = (patch: Partial<LibraryFilters>) => filterLessons({ ...EMPTY_FILTERS, ...patch }, allNew);

describe('lesbibliotheek: filters', () => {
  it('zonder filters: alle lessen', () => {
    expect(filter({})).toHaveLength(lessonEntries.length);
  });

  it('filtert op niveau', () => {
    const result = filter({ niveau: 'zin' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((entry) => entry.layer.id === 'zin')).toBe(true);
  });

  it('een vakgebied telt ook mee als het "ook" in de les speelt', () => {
    const viaAlso = lessonEntries.filter((entry) => entry.domain.id !== 'prag' && entry.also.some((domain) => domain.id === 'prag'));
    expect(viaAlso.length).toBeGreaterThan(0);
    const ids = filter({ vak: ['prag'] }).map((entry) => entry.lesson.id);
    for (const entry of viaAlso) expect(ids).toContain(entry.lesson.id);
  });

  it('filtert op status en oefenvorm', () => {
    const done = new Set([lessonEntries[0]!.lesson.id]);
    const result = filterLessons({ ...EMPTY_FILTERS, status: 'done' }, (id) => (done.has(id) ? 'done' : 'new'));
    expect(result.map((entry) => entry.lesson.id)).toEqual([...done]);
    expect(filter({ vorm: 'sort' }).every((entry) => lessonKinds(entry.lesson).includes('sort'))).toBe(true);
  });

  it('zoekt zonder op hoofdletters of accenten te letten', () => {
    const target = lessonEntries.find((entry) => /komma/i.test(entry.lesson.title))!;
    expect(filter({ q: 'KOMMA' }).map((entry) => entry.lesson.id)).toContain(target.lesson.id);
    expect(filter({ q: 'xyzzy' })).toHaveLength(0);
  });

  it('URL heen en terug, en onzin in de URL wordt genegeerd', () => {
    const filters: LibraryFilters = { niveau: 'woord', vak: ['syn', 'sem'], status: 'busy', vorm: 'choice', q: 'werkwoord' };
    expect(parseFilters(new URLSearchParams(filtersToQuery(filters)))).toEqual(filters);
    expect(parseFilters(new URLSearchParams('niveau=bestaat-niet&vak=x,syn&status=raar&vorm=hack'))).toEqual({ ...EMPTY_FILTERS, vak: ['syn'] });
    expect(activeFilterCount(filters)).toBe(6);
  });
});
