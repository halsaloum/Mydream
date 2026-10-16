'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getLayer } from '@/content/catalog';
import { PageHeader } from '@/components/shell/app-shell';
import { ButtonLink } from '@/components/ui/button';
import { SentenceLearningPath } from './sentence-learning-path';

/** Oude links blijven werken; de gewone leerroute staat binnen niveau 6 op Leren. */
export function SentencesView() {
  const oldCount = getLayer('zinnen')?.lessons.length ?? 0;
  return <div className="space-y-9" data-accent="navy">
    <PageHeader title="Zinnen" description="De lessen van niveau 6: van woordgroepen naar enkelvoudige en samengestelde zinnen."
      action={<ButtonLink href="/?niveau=zinnen#niveaus-titel" variant="secondary"><ArrowLeft aria-hidden className="size-4" />Terug naar niveau 6</ButtonLink>} />
    <SentenceLearningPath />
    <details className="rounded-card border-2 border-line bg-surface p-5 sm:p-6">
      <summary className="cursor-pointer font-display text-title-sm font-bold">Extra oefenen en verdiepen · {oldCount} lessen</summary>
      <p className="mt-3 text-body leading-relaxed text-ink-soft">Gebruik de aanvullende woordgroep- en zinsbouwlessen voor meer oefening. Je eerdere voortgang blijft bewaard.</p>
      <ButtonLink href="/lessen?niveau=zinnen" variant="secondary" className="mt-4">Bekijk de {oldCount} aanvullende lessen<ArrowRight aria-hidden className="size-4" /></ButtonLink>
    </details>
  </div>;
}
