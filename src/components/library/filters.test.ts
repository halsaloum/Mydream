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
    const result = filter({ niveau: 'zinnen' });
    expect(result).toHaveLength(30);
    expect(result.every((entry) => entry.layer.id === 'zinnen')).toBe(true);
  });

  it('houdt gedeelde links naar de drie oude zinsbouwniveaus bruikbaar', () => {
    const expected = filter({ niveau: 'zinnen' }).map((entry) => entry.lesson.id);
    for (const niveau of ['groep', 'zin', 'samen']) {
      expect(parseFilters(new URLSearchParams(`niveau=${niveau}`)).niveau).toBe('zinnen');
      expect(filter({ niveau }).map((entry) => entry.lesson.id)).toEqual(expected);
      expect(filtersToQuery({ ...EMPTY_FILTERS, niveau })).toBe('niveau=zinnen');
    }
  });

  it('vindt de oorspronkelijke groepen ook onder hun vroegere namen', () => {
    expect(filter({ q: 'woordgroep' }).map((entry) => entry.lesson.id)).toContain('p1');
    expect(filter({ q: 'enkelvoudige zin' }).map((entry) => entry.lesson.id)).toContain('z20');
    expect(filter({ q: 'samengestelde zin' }).map((entry) => entry.lesson.id)).toContain('s20');
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
