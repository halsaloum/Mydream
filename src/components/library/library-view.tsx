'use client';

import { ArrowRight, Search, Shapes, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { course, EXERCISE_LABELS, lessonEntries } from '@/content/catalog';
import { demoEntries } from '@/content/demo';
import type { StepKind } from '@/content/schema';
import { DomainGlyph, LayerGlyph } from '@/components/brand/glyphs';
import { LessonRow } from '@/components/lesson/lesson-row';
import { PageHeader } from '@/components/shell/app-shell';
import { Button, ButtonLink } from '@/components/ui/button';
import { ChipGroup } from '@/components/ui/chip-group';
import { EmptyState, PageSkeleton } from '@/components/ui/empty-state';
import { TextField } from '@/components/ui/field';
import { SelectField } from '@/components/ui/select';
import { transition, useCalmMotion } from '@/lib/motion';
import { useProgressData, useSessionsById } from '@/state/hooks';
import { useHydrated } from '@/state/hydration';
import { continueTarget, lessonStatus, recommendedLesson } from '@/state/selectors';
import { useSettings } from '@/state/settings';
import { activeFilterCount, EMPTY_FILTERS, filterLessons, filtersToQuery, LESSON_KINDS, parseFilters, type LibraryFilters, type StatusFilter } from './filters';

const STATUS_LABELS: Record<StatusFilter, string> = { alle: 'Alle', new: 'Nieuw', busy: 'Bezig', done: 'Afgerond' };

export function LibraryView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const calm = useCalmMotion();
  const progress = useProgressData();
  const sessions = useSessionsById();
  const profile = useSettings((state) => state.profile);
  const fromUrl = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  // Het zoekveld reageert direct; de URL loopt mee (vervangen, niet stapelen in de geschiedenis).
  const [query, setQuery] = useState(fromUrl.q);
  const filters = { ...fromUrl, q: query };

  const update = (patch: Partial<LibraryFilters>) => {
    const next = { ...filters, ...patch };
    const search = filtersToQuery(next);
    router.replace((search ? `${pathname}?${search}` : pathname) as Route, { scroll: false });
  };

  const statusOf = (id: string) => lessonStatus(id, progress, sessions);
  const results = filterLessons(filters, statusOf);
  /** Hoeveel lessen er zijn als deze chip gekozen wordt (met de andere filters erbij). */
  const count = (patch: Partial<LibraryFilters>) => filterLessons({ ...filters, ...patch }, statusOf).length;
  const target = continueTarget(progress, sessions, profile);
  const nextId = recommendedLesson(progress, profile)?.lesson.id;
  const active = activeFilterCount(filters);

  const groups = course.layers
    .map((layer, index) => ({ layer, index, entries: results.filter((entry) => entry.layer.id === layer.id) }))
    .filter((group) => group.entries.length > 0);

  const kindOptions = [
    { value: 'alle' as const, label: 'Alle oefenvormen' },
    ...LESSON_KINDS.map((kind) => ({ value: kind, label: EXERCISE_LABELS[kind] })),
  ];

  return (
    <div>
      <PageHeader
        title="Lessen"
        description={`${lessonEntries.length} lessen in ${course.layers.length} niveaus. Zoek op onderwerp of filter op niveau, vakgebied, status en oefenvorm.`}
        action={
          hydrated && target.kind !== 'complete' ? (
            <ButtonLink href={`/les/${target.entry.lesson.id}` as Route} variant="accent" size="lg" data-accent={target.entry.domain.accent}>
              {target.kind === 'resume' ? 'Verder met jouw les' : 'Start de volgende les'}
              <ArrowRight aria-hidden className="size-5" strokeWidth={2.75} />
            </ButtonLink>
          ) : null
        }
      />

      <section aria-label="Lessen zoeken en filteren" className="rounded-card border-2 border-line bg-surface p-5 shadow-slab sm:p-6">
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            update({ q: query });
          }}
          className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]"
        >
          <TextField
            label="Zoek een les"
            type="search"
            value={query}
            onChange={(value) => {
              setQuery(value);
              update({ q: value });
            }}
            placeholder="Bijvoorbeeld: werkwoord, komma of alinea"
            icon={<Search aria-hidden className="size-5" strokeWidth={2.5} />}
          />
          <SelectField label="Oefenvorm" value={filters.vorm} onChange={(vorm) => update({ vorm: vorm as StepKind | 'alle' })} options={kindOptions} />
        </form>

        <div className="mt-6 grid gap-5">
          <FilterRow label="Niveau">
            <ChipGroup
              label="Niveau"
              value={[filters.niveau ?? 'alle']}
              required
              onChange={([next]) => update({ niveau: next === 'alle' || !next ? null : next })}
              chips={[
                { value: 'alle', label: 'Alle', count: count({ niveau: null }) },
                ...course.layers.map((layer, index) => ({
                  value: layer.id,
                  label: `${index + 1}. ${layer.name}`,
                  icon: <LayerGlyph id={layer.id} className="size-4" />,
                  accent: layer.accent,
                  count: count({ niveau: layer.id }),
                })),
              ]}
            />
          </FilterRow>
          <FilterRow label="Vakgebied">
            <ChipGroup
              label="Vakgebied (meerdere mogelijk)"
              multiple
              value={filters.vak}
              onChange={(vak) => update({ vak })}
              chips={course.domains.map((domain) => ({
                value: domain.id,
                label: domain.name,
                icon: <DomainGlyph id={domain.id} className="size-4" />,
                accent: domain.accent,
                count: count({ vak: [domain.id] }),
              }))}
            />
          </FilterRow>
          <FilterRow label="Status">
            <ChipGroup
              label="Status"
              required
              value={[filters.status]}
              onChange={([next]) => update({ status: (next ?? 'alle') as StatusFilter })}
              chips={(Object.keys(STATUS_LABELS) as StatusFilter[]).map((status) => ({
                value: status,
                label: STATUS_LABELS[status],
                count: hydrated ? count({ status }) : undefined,
              }))}
            />
          </FilterRow>
        </div>
      </section>

      <div className="mt-8 flex min-h-11 flex-wrap items-center justify-between gap-3">
        <p role="status" className="font-display text-title-sm font-bold text-ink">
          {results.length === 1 ? '1 les' : `${results.length} lessen`}
          {active > 0 && <span className="font-sans text-small font-semibold text-ink-muted"> · {active === 1 ? '1 filter actief' : `${active} filters actief`}</span>}
        </p>
        {active > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              update(EMPTY_FILTERS);
            }}
          >
            <X aria-hidden className="size-4" strokeWidth={2.75} />
            Filters wissen
          </Button>
        )}
      </div>

      {!hydrated ? (
        <div className="mt-4">
          <PageSkeleton blocks={['h-8 w-56', 'h-20', 'h-20', 'h-20']} />
        </div>
      ) : groups.length === 0 ? (
        <EmptyState
          title="Geen lessen gevonden"
          mood="think"
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                update(EMPTY_FILTERS);
              }}
            >
              Filters wissen
            </Button>
          }
        >
          Geen enkele les past bij deze combinatie. Haal een filter weg of zoek op een ander woord.
        </EmptyState>
      ) : (
        <div className="mt-4 flex flex-col gap-10">
          <AnimatePresence initial={false} mode="popLayout">
            {groups.map(({ layer, index, entries }) => (
              <motion.section
                key={layer.id}
                layout={calm ? false : 'position'}
                initial={calm ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: transition.fast }}
                transition={transition.base}
                aria-labelledby={`groep-${layer.id}`}
                data-accent={layer.accent}
              >
                <h2 id={`groep-${layer.id}`} className="mb-4 flex items-center gap-3 font-display text-title-sm font-extrabold">
                  <span className="grid size-9 place-items-center rounded-control bg-accent text-accent-on shadow-[inset_0_-3px_0_rgb(0_0_0/0.14)]">
                    <LayerGlyph id={layer.id} className="size-[1.1rem]" />
                  </span>
                  <span>
                    Niveau {index + 1} <span className="text-ink-muted">·</span> {layer.name}
                  </span>
                </h2>
                <ul className="grid gap-3 md:grid-cols-2">
                  {entries.map((entry) => (
                    <li key={entry.lesson.id}>
                      <LessonRow entry={entry} progress={progress} sessions={sessions} isNext={entry.lesson.id === nextId} />
                    </li>
                  ))}
                </ul>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Link
        href="/oefenvormen"
        className="group slab pressable mt-14 flex items-center gap-5 rounded-card border-2 border-line bg-surface px-6 py-5 hover:border-line-strong"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-control bg-purple-soft text-purple-ink">
          <Shapes aria-hidden className="size-6" strokeWidth={2.25} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-title-sm font-bold text-ink">Oefenvormen uitproberen</span>
          <span className="block text-small text-ink-muted">
            {demoEntries.length} nieuwe vormen met voorbeeldinhoud, los van je voortgang.
          </span>
        </span>
        <ArrowRight aria-hidden className="size-5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" strokeWidth={2.5} />
      </Link>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2.5 md:grid-cols-[7rem_minmax(0,1fr)] md:items-start">
      <p className="pt-2.5 text-small font-bold text-ink-muted">{label}</p>
      {children}
    </div>
  );
}
