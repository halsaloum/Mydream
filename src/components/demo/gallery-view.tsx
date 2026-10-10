'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { Route } from 'next';
import Link from 'next/link';
import { EXERCISE_LABELS, lessonEntries } from '@/content/catalog';
import { DEMO_GROUPS, demoEntries, type DemoEntry } from '@/content/demo';
import type { StepKind } from '@/content/schema';
import { DomainGlyph } from '@/components/brand/glyphs';
import { LESSON_KINDS, lessonKinds } from '@/components/library/filters';
import { PageHeader } from '@/components/shell/app-shell';
import { ButtonLink } from '@/components/ui/button';
import { transition, useCalmMotion } from '@/lib/motion';


function promptOf(entry: DemoEntry): string {
  return 'prompt' in entry.step ? entry.step.prompt : entry.title;
}

/** Eerste les waarin een klassieke oefenvorm voorkomt, als werkend voorbeeld. */
function firstLessonWith(kind: StepKind) {
  return lessonEntries.find((entry) => lessonKinds(entry.lesson).includes(kind));
}

export function GalleryView() {
  const calm = useCalmMotion();
  const first = demoEntries[0];
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="Oefenvormen"
        description="Elke oefenvorm van de lesplayer, met de voorbeeldinhoud uit de ontwerpen. Probeer ze vrij uit: voorbeelden tellen niet mee voor je voortgang."
        action={
          first ? (
            <ButtonLink href={`/oefenvormen/${first.slug}` as Route} size="lg">
              Begin bij de eerste
              <ArrowRight aria-hidden className="size-5" strokeWidth={2.75} />
            </ButtonLink>
          ) : null
        }
        className="mb-0"
      />

      {DEMO_GROUPS.map((group) => {
        const items = demoEntries.filter((entry) => entry.group === group);
        if (!items.length) return null;
        return (
          <section key={group} aria-labelledby={`groep-${group.replaceAll(' ', '-')}`}>
            <h2 id={`groep-${group.replaceAll(' ', '-')}`} className="mb-4 font-display text-title-sm font-extrabold">
              {group}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((entry, i) => (
                <motion.li
                  key={entry.slug}
                  initial={calm ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                  transition={{ ...transition.slow, delay: calm ? 0 : i * 0.04 }}
                  data-accent={entry.domain.accent}
                  className="h-full"
                >
                  <Link
                    href={`/oefenvormen/${entry.slug}` as Route}
                    className="group slab pressable flex h-full flex-col rounded-card border-2 border-line bg-surface p-5 hover:border-line-strong"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent icon-tile">
                        <DomainGlyph id={entry.domain.id} className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-title-sm leading-tight font-bold text-ink">{entry.title}</span>
                        <span className="block text-caption font-semibold text-accent-ink">{entry.domain.name}</span>
                      </span>
                    </span>
                    <span className="mt-4 block flex-1 text-small text-ink-soft">{promptOf(entry)}</span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-small font-bold text-accent-ink">
                      Probeer uit
                      <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.75} />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </section>
        );
      })}

      <section aria-labelledby="groep-lessen" className="rounded-card border-2 border-line bg-surface p-5 shadow-slab sm:p-7">
        <h2 id="groep-lessen" className="font-display text-title-sm font-extrabold">
          In de lessen
        </h2>
        <p className="mt-1 text-small text-ink-muted">Deze vormen zitten al in de bestaande lessen. Een les openen telt wel mee voor je voortgang.</p>
        <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
          {LESSON_KINDS.map((kind) => {
            const entry = firstLessonWith(kind);
            return (
              <li key={kind} className="flex min-h-12 items-center justify-between gap-3 border-b-2 border-line py-2">
                <span className="font-bold text-ink">{EXERCISE_LABELS[kind]}</span>
                {entry && (
                  <Link href={`/les/${entry.lesson.id}` as Route} className="truncate text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline">
                    {entry.lesson.title}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
