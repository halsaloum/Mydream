'use client';

import { ArrowRight, Blocks } from 'lucide-react';
import { sentenceLessons } from '@/content/sentences';
import { ButtonLink } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { useSentences } from '@/state/sentences';

export function SentenceCard() {
  const records = useSentences((state) => state.records);
  const done = sentenceLessons.filter((lesson) => records[lesson.id]).length;
  return <section data-accent="navy" aria-labelledby="zinnen-kaart" className="mt-4 rounded-card border-2 border-blue-line bg-blue-soft p-5 shadow-slab-sm">
    <h2 id="zinnen-kaart" className="flex items-center gap-2 font-display text-body font-extrabold"><Blocks aria-hidden className="size-5" />Zinnen · van blok tot volledige zin</h2>
    <p className="mt-2 text-small leading-relaxed text-ink-soft">Woordgroepen, zinsdelen en samengestelde zinnen in één leerpad. Bouw, verbind, verander en repareer de zin zelf.</p>
    <p className="mt-3 mb-2 text-caption font-semibold text-ink-muted">{done} van 12 modules afgerond</p>
    <ProgressBar value={done} max={12} size="sm" label="Voortgang afdeling Zinnen" />
    <ButtonLink href="/zinnen" variant="accent" className="mt-4 max-sm:w-full">Ontdek de afdeling Zinnen<ArrowRight aria-hidden className="size-4" /></ButtonLink>
  </section>;
}
