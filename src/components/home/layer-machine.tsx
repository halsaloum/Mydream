'use client';

import { Tabs } from '@base-ui/react/tabs';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { course, getDomain, lessonEntries } from '@/content/catalog';
import type { Domain, Layer } from '@/content/schema';
import { DomainGlyph, LayerGlyph } from '@/components/brand/glyphs';
import { LessonRow } from '@/components/lesson/lesson-row';
import { IconButton } from '@/components/ui/button';
import { RichText } from '@/components/ui/rich-text';
import type { SessionState } from '@/engine/session';
import { cn } from '@/lib/cn';
import { spring, transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import type { ProgressData } from '@/state/progress';
import { layerCompletion } from '@/state/selectors';

const AUTOPLAY_MS = 2600;

/** Het voorbeeld dat door de niveaus groeit: stukken in Fraunces, wat nieuw is uitgelicht. */
function GrowingExample({ layer, index, total }: { layer: Layer; index: number; total: number }) {
  const calm = useCalmMotion();
  const growth = layer.growth;
  return (
    <div className="min-h-[15.5rem] sm:min-h-[13rem]">
      <p className="text-small font-bold text-ink-muted">
        Niveau {index + 1} van {total} · <span className="text-accent-ink">{layer.name}</span>
      </p>
      {growth ? (
        <>
          <div className="mt-5 flex flex-wrap items-start gap-x-2.5 gap-y-4" lang="nl">
            {growth.segments.map((segment, k) =>
              segment.gap ? (
                <span key={k} aria-hidden className="self-center px-1.5 font-serif text-example-lg text-line-strong">
                  {segment.t}
                </span>
              ) : (
                <motion.span
                  key={k}
                  className="flex flex-col"
                  initial={calm ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transition.slow, delay: calm ? 0 : k * 0.07 }}
                >
                  <span
                    className={cn(
                      'rounded-control px-2 font-serif text-example-lg text-ink',
                      segment.hi && 'bg-accent text-accent-on shadow-[inset_0_-4px_0_rgb(0_0_0/0.12)]',
                    )}
                  >
                    {segment.t}
                  </span>
                  <span aria-hidden className={cn('mx-1.5 mt-1.5 h-1.5 rounded-full bg-accent', !segment.hi && 'opacity-35')} />
                  {segment.tag && (
                    <span className={cn('mx-1.5 mt-1.5 text-caption font-bold', segment.hi ? 'text-accent-ink' : 'text-ink-muted')}>{segment.tag}</span>
                  )}
                </motion.span>
              ),
            )}
          </div>
          <motion.p
            className="mt-5 max-w-2xl text-body text-ink-soft"
            initial={calm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition.slow, delay: calm ? 0 : 0.18 }}
          >
            {growth.tip}
          </motion.p>
        </>
      ) : (
        <p className="mt-4 text-body text-ink-muted">{layer.made}</p>
      )}
    </div>
  );
}

/** Kleine voortgangsring per vakgebied. */
function Ring({ ratio, label }: { ratio: number; label: string }) {
  const calm = useCalmMotion();
  const length = 2 * Math.PI * 14;
  return (
    <svg viewBox="0 0 36 36" role="img" aria-label={label} className="size-10 shrink-0 -rotate-90">
      <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-line)" strokeWidth="5" />
      <motion.circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={length}
        initial={false}
        animate={{ strokeDashoffset: length * (1 - ratio) }}
        transition={calm ? { duration: 0 } : transition.progress}
      />
    </svg>
  );
}

function FieldPill({ domain }: { domain: Domain }) {
  return (
    <li
      data-accent={domain.accent}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-full border-2 border-accent-line bg-accent-soft px-3 text-small font-bold text-accent-ink"
    >
      <DomainGlyph id={domain.id} className="size-4" />
      {domain.name}
    </li>
  );
}

type LayerMachineProps = {
  selected: number;
  onSelect: (index: number) => void;
  progress: ProgressData;
  sessions: Record<string, SessionState>;
  nextId: string | undefined;
};

/**
 * De niveaus als tabbladen: het voorbeeld groeit van letter tot alinea, de trap eronder kiest
 * het niveau, en het tabblad toont wat je er leert en welke lessen erbij horen.
 */
export function LayerMachine({ selected, onSelect, progress, sessions, nextId }: LayerMachineProps) {
  const calm = useCalmMotion();
  const [playing, setPlaying] = useState(false);
  const layers = course.layers;
  const layer = layers[selected] ?? layers[0]!;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => onSelect((selected + 1) % layers.length), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, selected, onSelect, layers.length]);

  const go = (index: number) => {
    setPlaying(false);
    play('tap');
    onSelect(Math.max(0, Math.min(layers.length - 1, index)));
  };

  return (
    <Tabs.Root value={selected} onValueChange={(value) => go(Number(value))} className="flex flex-col gap-5">
      <section
        aria-labelledby="niveaus-titel"
        data-accent={layer.accent}
        className="overflow-hidden rounded-sheet border-2 border-line bg-surface shadow-sheet"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
          <div>
            <h2 id="niveaus-titel" className="font-display text-title font-extrabold">
              De niveaus
            </h2>
            <p className="mt-1 text-small text-ink-muted">Hetzelfde voorbeeld, op elk niveau anders bekeken.</p>
          </div>
          <div role="group" aria-label="Niveaus doorlopen" className="flex shrink-0 items-center gap-1.5">
            <IconButton label="Vorig niveau" variant="secondary" icon={<ChevronLeft className="size-5" strokeWidth={2.75} />} disabled={selected === 0} onClick={() => go(selected - 1)} />
            <IconButton
              label={playing ? 'Afspelen pauzeren' : 'Niveaus afspelen'}
              variant="secondary"
              icon={playing ? <Pause className="size-4" strokeWidth={2.75} /> : <Play className="size-4" strokeWidth={2.75} />}
              aria-pressed={playing}
              onClick={() => {
                play('tap');
                setPlaying((value) => !value);
              }}
            />
            <IconButton
              label="Volgend niveau"
              variant="secondary"
              icon={<ChevronRight className="size-5" strokeWidth={2.75} />}
              disabled={selected === layers.length - 1}
              onClick={() => go(selected + 1)}
            />
          </div>
        </div>

        <div className="px-6 pt-6 sm:px-8" aria-live={playing ? 'off' : 'polite'}>
          <GrowingExample key={layer.id} layer={layer} index={selected} total={layers.length} />
        </div>

        <Tabs.List aria-label="Niveaus, van letter tot alinea" className="mt-2 flex items-end gap-1 px-4 sm:gap-2 sm:px-8">
          {layers.map((item, index) => {
            const active = index === selected;
            const reached = index <= selected;
            const done = layerCompletion(item, progress);
            return (
              <Tabs.Tab
                key={item.id}
                value={index}
                data-accent={item.accent}
                aria-label={`Niveau ${index + 1}: ${item.name}, ${done.done} van ${done.total} lessen af`}
                className="group relative flex min-w-0 flex-1 flex-col items-center gap-2 rounded-tile px-0.5 pt-3 pb-2 outline-none focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-focus"
              >
                {active && (
                  <motion.span layoutId="niveau-tab" transition={spring.layout} aria-hidden className="absolute inset-0 rounded-tile bg-accent-soft" />
                )}
                <span
                  className={cn(
                    'relative grid size-8 place-items-center rounded-control border-2 transition-[transform,background-color,border-color,color] duration-200 sm:size-10',
                    active
                      ? '-translate-y-1 border-accent bg-accent text-accent-on shadow-[0_3px_0_var(--accent-deep)]'
                      : reached
                        ? 'border-accent-line bg-surface text-accent-ink shadow-[0_3px_0_var(--accent-line)] group-hover:-translate-y-0.5'
                        : 'border-line bg-surface text-ink-muted shadow-slab-sm group-hover:-translate-y-0.5 group-hover:text-ink',
                  )}
                >
                  <LayerGlyph id={item.id} className="size-4 sm:size-5" />
                </span>
                <span
                  aria-hidden
                  style={{ height: 14 + index * 5.5 }}
                  className={cn(
                    'relative w-full overflow-hidden rounded-md transition-colors duration-300',
                    reached ? 'bg-accent shadow-[inset_0_-4px_0_rgb(0_0_0/0.14)]' : 'bg-line shadow-[inset_0_-4px_0_var(--color-line-strong)] group-hover:bg-line-strong/70',
                  )}
                >
                  {done.done > 0 && (
                    <span className="absolute inset-x-1 bottom-1.5 h-1 overflow-hidden rounded-full bg-black/15">
                      <span className="block h-full rounded-full bg-white" style={{ width: `${done.ratio * 100}%` }} />
                    </span>
                  )}
                </span>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        <div aria-hidden className="flex justify-between px-6 pt-1 pb-6 text-caption font-bold text-ink-muted sm:px-8">
          <span>letter</span>
          <span>alinea</span>
        </div>
      </section>

      {layers.map((item, index) => (
        <Tabs.Panel key={item.id} value={index} className="outline-none">
          <motion.div
            initial={calm ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition.slow}
            className="flex flex-col gap-5"
          >
            <LayerDetail layer={item} index={index} progress={progress} sessions={sessions} nextId={nextId} />
          </motion.div>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}

function LayerDetail({
  layer,
  index,
  progress,
  sessions,
  nextId,
}: {
  layer: Layer;
  index: number;
  progress: ProgressData;
  sessions: Record<string, SessionState>;
  nextId: string | undefined;
}) {
  const entries = lessonEntries.filter((entry) => entry.layer.id === layer.id);
  const domains = course.domains.filter((domain) => entries.some((entry) => entry.domain.id === domain.id));
  const fields = layer.fields.flatMap((id) => {
    const domain = getDomain(id);
    return domain ? [domain] : [];
  });

  return (
    <>
      <section data-accent={layer.accent} aria-labelledby={`niveau-${layer.id}`} className="rounded-card border-2 border-line bg-surface p-6 shadow-slab sm:p-7">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-control bg-accent text-accent-on shadow-[inset_0_-3px_0_rgb(0_0_0/0.14)]">
            <LayerGlyph id={layer.id} className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 id={`niveau-${layer.id}`} className="font-display text-title-sm font-extrabold">
              Niveau {index + 1}: {layer.name}
            </h3>
            <p className="mt-1 text-lead leading-snug text-ink">{layer.learn}</p>
          </div>
        </div>
        <p className="mt-5 rounded-tile bg-sunken px-4 py-3.5 font-serif text-[1.375rem] leading-snug text-ink" lang="nl">
          <RichText text={layer.example} />
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-4">
          <p className="shrink-0 text-small font-bold text-ink-muted">Vakgebieden</p>
          <ul className="flex flex-wrap gap-2">
            {fields.map((domain) => (
              <FieldPill key={domain.id} domain={domain} />
            ))}
          </ul>
        </div>
      </section>

      <div className={cn('grid gap-4', domains.length > 1 && 'md:grid-cols-2')}>
        {domains.map((domain) => {
          const inDomain = entries.filter((entry) => entry.domain.id === domain.id);
          const completion = layerCompletion(layer, progress, domain.id);
          return (
            <section key={domain.id} data-accent={domain.accent} aria-labelledby={`vak-${layer.id}-${domain.id}`} className="rounded-card border-2 border-line bg-surface p-4 shadow-slab sm:p-5">
              <div className="mb-3.5 flex items-center gap-3">
                <Ring ratio={completion.ratio} label={`${completion.done} van ${completion.total} lessen af`} />
                <div className="min-w-0">
                  <h3 id={`vak-${layer.id}-${domain.id}`} className="font-display text-body leading-tight font-extrabold text-accent-ink">
                    {domain.name}
                  </h3>
                  <p className="text-caption text-ink-muted">{domain.q}</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {inDomain.map((entry) => (
                  <li key={entry.lesson.id}>
                    <LessonRow entry={entry} progress={progress} sessions={sessions} isNext={entry.lesson.id === nextId} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
