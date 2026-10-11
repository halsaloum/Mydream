'use client';

import { ArrowRight, Check, Flame, Languages } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { addDays, dayKey } from '@/lib/dates';
import { wordStreak } from '@/lib/words/memory';
import { dueCount, useWords } from '@/state/words';

/** Kleine kaart op de startpagina: staan je woorden van vandaag nog open? Laadt de woordenbank niet. */
export function WordsCard() {
  const cards = useWords((state) => state.cards);
  const days = useWords((state) => state.days);
  const perDay = useWords((state) => state.perDay);
  const today = dayKey();
  const done = days[today]?.done ?? false;
  const due = dueCount(cards, today);
  const learned = Object.keys(cards).length;
  const streak = wordStreak(days, today);
  const tomorrow = dueCount(cards, addDays(today, 1));

  const text = done
    ? `Klaar voor vandaag. Morgen komen er ${tomorrow === 1 ? '1 woord' : `${tomorrow} woorden`} terug.`
    : learned === 0
      ? 'Elke dag nieuwe woorden voor je werk als leider. Je raadt ze, haalt ze zelf op en gebruikt ze in je eigen zinnen.'
      : due > 0
        ? `${due === 1 ? '1 woord komt' : `${due} woorden komen`} vandaag terug, en er staan ${perDay} nieuwe woorden klaar.`
        : `Er staan ${perDay} nieuwe woorden voor je klaar.`;

  return (
    <section aria-labelledby="woorden-titel" data-accent="teal" className="mt-4 rounded-card border-2 border-line bg-surface p-5 shadow-slab">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h2 id="woorden-titel" className="inline-flex items-center gap-2 font-display text-body font-extrabold text-ink">
          <span className="grid size-8 place-items-center rounded-control bg-accent-soft text-accent-ink">
            {done ? <Check aria-hidden className="size-4" strokeWidth={3} /> : <Languages aria-hidden className="size-4" strokeWidth={2.5} />}
          </span>
          Woorden van vandaag
        </h2>
        {streak > 0 && (
          <p className="inline-flex items-center gap-1 text-small font-semibold text-orange-ink">
            <Flame aria-hidden className="size-4" strokeWidth={2.5} />
            {streak === 1 ? '1 dag' : `${streak} dagen`} op rij
          </p>
        )}
      </div>
      <p className="mt-2 text-small text-ink-soft">{text}</p>
      <ButtonLink href="/woorden" variant={done ? 'secondary' : 'accent'} size="md" className="group mt-4 max-sm:w-full">
        {done ? 'Naar je woorden' : learned === 0 ? 'Begin met woorden' : 'Naar je woorden'}
        <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1" strokeWidth={2.75} />
      </ButtonLink>
    </section>
  );
}
