'use client';

import { RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { course, getLessonEntry } from '@/content/catalog';
import type { Domain, Layer, Stage } from '@/content/schema';
import { DomainGlyph } from '@/components/brand/glyphs';
import { STAGE_ACCENTS, STAGE_LABELS } from '@/components/lesson/stage-badge';
import { transition, useCalmMotion } from '@/lib/motion';

/** Bij de eerste stap: op welk niveau en in welk vakgebied deze les zit, en hoe diep hij gaat. */
export function LayerTag({ layer, layerIndex, domain, stage }: { layer: Layer; layerIndex: number; domain: Domain; stage?: Stage | undefined }) {
  const calm = useCalmMotion();
  return (
    <div className="mb-8 flex flex-wrap items-stretch gap-2.5">
      <div className="flex items-center gap-3 rounded-tile border-2 border-line bg-surface px-3.5 py-2 shadow-slab-sm">
        <span aria-hidden className="flex h-9 items-end gap-[3px]">
          {course.layers.map((item, i) => (
            <motion.span
              key={item.id}
              data-accent={i <= layerIndex ? item.accent : undefined}
              className={i <= layerIndex ? 'w-[5px] origin-bottom rounded-[2px] bg-accent' : 'w-[5px] origin-bottom rounded-[2px] bg-line'}
              style={{ height: 8 + i * 3.4 }}
              initial={calm ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ ...transition.slow, delay: calm ? 0 : 0.05 + i * 0.035 }}
            />
          ))}
        </span>
        <span className="leading-tight">
          <span className="block text-caption font-bold text-ink-muted">Niveau {layerIndex + 1}</span>
          <span className="block font-display text-body font-extrabold text-ink">{layer.name}</span>
        </span>
      </div>
      <div
        data-accent={domain.accent}
        className="flex items-center gap-2.5 rounded-tile border-2 border-accent-line bg-accent-soft px-3.5 py-2 text-accent-ink"
      >
        <span className="grid size-8 place-items-center rounded-chip bg-accent icon-tile">
          <DomainGlyph id={domain.id} className="size-[1.1rem]" />
        </span>
        <span className="leading-tight">
          <span className="block text-caption font-bold">Vakgebied</span>
          <span className="block font-display text-body font-extrabold">{domain.name}</span>
        </span>
      </div>
      {stage && (
        <div
          data-accent={STAGE_ACCENTS[stage]}
          className="flex items-center rounded-tile border-2 border-accent-line bg-accent-soft px-3.5 py-2 text-accent-ink"
        >
          <span className="leading-tight">
            <span className="block text-caption font-bold">Stap</span>
            <span className="block font-display text-body font-extrabold">{STAGE_LABELS[stage]}</span>
          </span>
        </div>
      )}
    </div>
  );
}

/** Een eerder gemiste opdracht die in dezelfde les terugkomt. */
export function RetryBadge() {
  return (
    <p className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-orange-line bg-orange-soft px-3 py-1 text-small font-bold text-orange-ink">
      <RotateCcw aria-hidden className="size-4" strokeWidth={2.75} />
      Nog een keer
    </p>
  );
}

/** In een herhaalronde: uit welke les deze opdracht komt. */
export function ReviewSource({ lessonId }: { lessonId: string }) {
  const entry = getLessonEntry(lessonId);
  if (!entry) return null;
  return (
    <p data-accent={entry.domain.accent} className="mb-5 inline-flex items-center gap-2 text-small font-bold text-accent-ink">
      <span className="grid size-7 place-items-center rounded-chip bg-accent-soft">
        <DomainGlyph id={entry.domain.id} className="size-4" />
      </span>
      Uit de les “{entry.lesson.title}”
    </p>
  );
}
