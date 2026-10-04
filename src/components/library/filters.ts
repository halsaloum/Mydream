import { course, EXERCISE_LABELS, lessonEntries, type LessonEntry } from '@/content/catalog';
import type { Lesson, StepKind } from '@/content/schema';
import type { LessonStatus } from '@/state/selectors';

/** Filters van de lesbibliotheek. Ze staan in de URL, zodat terug, verversen en delen werken. */
export type StatusFilter = 'alle' | LessonStatus;
export type LibraryFilters = { niveau: string | null; vak: string[]; status: StatusFilter; vorm: StepKind | 'alle'; q: string };

export const EMPTY_FILTERS: LibraryFilters = { niveau: null, vak: [], status: 'alle', vorm: 'alle', q: '' };

const STATUSES: StatusFilter[] = ['alle', 'new', 'busy', 'done'];
const layerIds = new Set(course.layers.map((layer) => layer.id));
const domainIds = new Set(course.domains.map((domain) => domain.id));

export function lessonKinds(lesson: Lesson): StepKind[] {
  const kinds = new Set<StepKind>();
  for (const step of lesson.steps) {
    kinds.add(step.kind);
    if (step.kind === 'explain' && step.panels.some((panel) => panel.quiz)) kinds.add('choice');
  }
  return [...kinds];
}

/** Oefenvormen die in de lessen voorkomen, in de vaste volgorde van het contract. */
export const LESSON_KINDS: StepKind[] = (Object.keys(EXERCISE_LABELS) as StepKind[]).filter((kind) =>
  lessonEntries.some((entry) => lessonKinds(entry.lesson).includes(kind)),
);

export function parseFilters(params: URLSearchParams): LibraryFilters {
  const niveau = params.get('niveau');
  const status = params.get('status') as StatusFilter | null;
  const vorm = params.get('vorm') as StepKind | null;
  return {
    niveau: niveau && layerIds.has(niveau) ? niveau : null,
    vak: (params.get('vak') ?? '').split(',').filter((id) => domainIds.has(id)),
    status: status && STATUSES.includes(status) ? status : 'alle',
    vorm: vorm && LESSON_KINDS.includes(vorm) ? vorm : 'alle',
    q: (params.get('q') ?? '').slice(0, 80),
  };
}

export function filtersToQuery(filters: LibraryFilters): string {
  const params = new URLSearchParams();
  if (filters.niveau) params.set('niveau', filters.niveau);
  if (filters.vak.length) params.set('vak', filters.vak.join(','));
  if (filters.status !== 'alle') params.set('status', filters.status);
  if (filters.vorm !== 'alle') params.set('vorm', filters.vorm);
  if (filters.q.trim()) params.set('q', filters.q.trim());
  return params.toString();
}

export function activeFilterCount(filters: LibraryFilters): number {
  return (filters.niveau ? 1 : 0) + filters.vak.length + (filters.status !== 'alle' ? 1 : 0) + (filters.vorm !== 'alle' ? 1 : 0) + (filters.q.trim() ? 1 : 0);
}

const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function matchesQuery(entry: LessonEntry, q: string): boolean {
  const query = fold(q.trim());
  if (!query) return true;
  const haystack = fold([entry.lesson.title, entry.layer.name, entry.domain.name, ...entry.also.map((domain) => domain.name)].join(' '));
  return query.split(/\s+/).every((word) => haystack.includes(word));
}

export function filterLessons(filters: LibraryFilters, statusOf: (id: string) => LessonStatus, entries: readonly LessonEntry[] = lessonEntries): LessonEntry[] {
  return entries.filter((entry) => {
    if (filters.niveau && entry.layer.id !== filters.niveau) return false;
    if (filters.vak.length && !filters.vak.some((id) => entry.domain.id === id || entry.also.some((domain) => domain.id === id))) return false;
    if (filters.status !== 'alle' && statusOf(entry.lesson.id) !== filters.status) return false;
    if (filters.vorm !== 'alle' && !lessonKinds(entry.lesson).includes(filters.vorm)) return false;
    if (!matchesQuery(entry, filters.q)) return false;
    return true;
  });
}
