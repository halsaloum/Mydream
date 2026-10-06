'use client';

import { ArrowRight } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { exerciseCountLabel } from '@/content/catalog';
import { DomainGlyph, LayerGlyph } from '@/components/brand/glyphs';
import { Pim } from '@/components/brand/pim';
import { ButtonLink } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import type { ContinueTarget } from '@/state/selectors';

/** "Verder met jouw les": de hoofdactie van de startpagina. */
export function ContinueCard({ target, firstTime }: { target: ContinueTarget; firstTime: boolean }) {
  if (target.kind === 'complete') {
    return (
      <section aria-labelledby="verder-titel" className="flex flex-col gap-5 rounded-sheet border-2 border-line bg-surface p-6 shadow-sheet sm:flex-row sm:items-center sm:p-8">
        <Pim mood="cheer" size="lg" />
        <div className="min-w-0 flex-1">
          <h2 id="verder-titel" className="font-display text-title font-extrabold">
            Alle lessen zijn af
          </h2>
          <p className="mt-2 text-body text-ink-muted">Herhaal je oefenpunten of doe een les opnieuw om het vast te zetten.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/herhalen" size="lg">
              Naar herhalen
            </ButtonLink>
            <ButtonLink href="/lessen" variant="secondary" size="lg">
              Kies een les
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  const { entry } = target;
  const resume = target.kind === 'resume' ? target.session : null;
  const status = resume
    ? `Je was bij stap ${Math.min(resume.pos + 1, resume.queue.length)} van ${resume.queue.length}. Je antwoorden staan klaar.`
    : firstTime
      ? 'Je eerste les. Pim legt eerst uit, daarna oefen je zelf.'
      : 'Eerst een helder voorbeeld, daarna zelf proberen. Je hoeft het nog niet perfect te kunnen.';

  return (
    <section
      aria-labelledby="verder-titel"
      data-accent={entry.domain.accent}
      className="relative overflow-hidden rounded-sheet border-2 border-line bg-surface shadow-sheet"
    >
      <div aria-hidden className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(120%_100%_at_100%_0%,var(--accent-soft),transparent_70%)]" />
      <div aria-hidden className="absolute -top-16 -right-10 size-56 rounded-full bg-accent opacity-[0.12] blur-3xl" />
      <div className="relative flex flex-col gap-4 p-5 sm:p-6">
        <p className="inline-flex items-center gap-2 text-small font-bold text-accent-ink">
          <span aria-hidden className="size-2 rounded-full bg-accent" />
          {resume ? 'Pak de draad weer op' : firstTime ? 'Hier begint jouw schrijfavontuur' : 'Klaar voor de volgende stap?'}
        </p>
        <div className="flex items-start gap-5">
          <div className="min-w-0 flex-1">
            <h2 id="verder-titel" className="font-display text-title font-extrabold">
              <span className="sr-only">Verder met jouw les: </span>
              {entry.lesson.title}
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-caption font-semibold text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <LayerGlyph id={entry.layer.id} className="size-4" />
                Niveau {entry.layerIndex + 1} · {entry.layer.name}
              </span>
              <span className="inline-flex items-center gap-1.5 text-accent-ink">
                <DomainGlyph id={entry.domain.id} className="size-4" />
                {entry.domain.name}
              </span>
              <span>{exerciseCountLabel(entry.lesson)}</span>
            </p>
            <p className="mt-3 text-body text-ink-soft">{status}</p>
          </div>
          <span className="hidden animate-float sm:block">
            <Pim mood={resume ? 'happy' : 'idle'} size="lg" />
          </span>
        </div>
        {resume && (
          <ProgressBar
            value={resume.pos}
            max={resume.queue.length}
            size="sm"
            label="Voortgang in deze les"
            valueText={`${resume.pos} van ${resume.queue.length} stappen gedaan`}
          />
        )}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line/70 pt-4">
          <ButtonLink href={`/les/${entry.lesson.id}` as Route} variant="accent" size="lg" className="group max-sm:w-full">
            {resume ? 'Verder met jouw les' : firstTime ? 'Begin met schrijven' : 'Start de volgende les'}
            <ArrowRight aria-hidden className="size-5 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1" strokeWidth={2.75} />
          </ButtonLink>
          <Link href="/lessen" className="inline-flex min-h-11 items-center justify-center rounded-chip font-bold text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline-3 focus-visible:outline-focus max-sm:w-full">
            Andere les kiezen
          </Link>
        </div>
      </div>
    </section>
  );
}
