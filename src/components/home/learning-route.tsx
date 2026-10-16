'use client';

import type { Route } from 'next';
import { learningPhases } from '@/content/catalog';
import { ButtonLink } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import type { ProgressData } from '@/state/progress';

export function LearningRoute({ progress }: { progress: ProgressData }) {
  return (
    <section aria-labelledby="leerroute-titel">
      <h2 id="leerroute-titel" className="font-display text-title font-extrabold">Jouw route naar een sterk betoog</h2>
      <p className="mt-2 max-w-3xl text-body text-ink-soft">Begin bij de basis en werk toe naar zelfstandig schrijven. Elke les helpt je begrijpen, oefenen en toepassen. Je kunt ook een onderdeel kiezen; er zijn geen vergrendelde lessen.</p>
      <ol className="mt-5 grid gap-4 md:grid-cols-2">
        {learningPhases.map((phase) => {
          const done = phase.entries.filter((entry) => progress.lessons[entry.lesson.id]).length;
          const next = phase.entries.find((entry) => !progress.lessons[entry.lesson.id]) ?? phase.entries[0];
          if (!next) return null;
          return (
            <li key={phase.id} className="flex flex-col rounded-card border-2 border-line bg-surface p-5">
              <h3 className="font-display text-title-sm font-bold">{phase.title}</h3>
              {phase.optional && <p className="mt-1 text-caption font-bold text-ink-muted">Keuzeverdieping</p>}
              <p className="mt-2 flex-1 text-body text-ink-soft">{phase.description}</p>
              <p className="mt-4 mb-2 text-small font-semibold text-ink-muted">{done} van {phase.entries.length} lessen afgerond</p>
              <ProgressBar value={done} max={phase.entries.length} size="sm" label={`Voortgang: ${phase.title}`} />
              <ButtonLink href={next.layer.id === 'zinnen' ? '/?niveau=zinnen#niveaus-titel' : `/les/${next.lesson.id}` as Route} variant="secondary" className="mt-4 self-start">
                {done === phase.entries.length ? 'Herhaal dit onderdeel' : done > 0 ? 'Verder met dit onderdeel' : 'Start dit onderdeel'}
                <span className="sr-only">: {phase.title}</span>
              </ButtonLink>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
