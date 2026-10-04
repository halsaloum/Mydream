'use client';

import { Tabs } from '@base-ui/react/tabs';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { course, lessonEntries } from '@/content/catalog';
import type { Layer } from '@/content/schema';
import { DomainGlyph, LayerGlyph } from '@/components/brand/glyphs';
import { LessonRow } from '@/components/lesson/lesson-row';
import { IconButton } from '@/components/ui/button';
import type { SessionState } from '@/engine/session';
import { cn } from '@/lib/cn';
import { spring, transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import type { ProgressData } from '@/state/progress';
import { layerCompletion } from '@/state/selectors';

const AUTOPLAY_MS = 2600;

/** Het voorbeeld van één laag: stukken in Fraunces, met wat er op deze laag nieuw is uitgelicht. */
function LayerExample({ layer }: { layer: Layer }) {
  const calm = useCalmMotion();
  const example = layer.example;
  return (
    <div className="min-h-[15rem] sm:min-h-[12.5rem]">
      <p className="font-display text-title-sm font-bold text-ink">
        {layer.name}
        <span className="font-sans text-small font-semibold text-ink-muted"> · {layer.made}</span>
      </p>
      {example ? (
        <>
          <div className="mt-5 flex flex-wrap items-start gap-x-2.5 gap-y-4" lang="nl">
            {example.segments.map((segment, k) =>
              segment.gap ? (
                <span key={k} aria-hidden className="self-center px-1.5 font-serif text-example-lg text-line-strong">
                  {segment.t}
                </span>
              ) : (
                <motion.span
                  key={k}
                  className="flex flex-col"
                  initial={calm ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
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
                    <span className={cn('label-caps mx-1.5 mt-1.5', segment.hi ? 'text-accent-ink' : 'text-ink-muted')}>{segment.tag}</span>
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
            {example.tip}
          </motion.p>
        </>
      ) : (
        <p className="mt-4 text-body text-ink-muted">Voor deze laag is nog geen voorbeeld beschikbaar.</p>
      )}
    </div>
  );
}

type LayerMachineProps = {
  selected: number;
  onSelect: (index: number) => void;
  progress: ProgressData;
  sessions: Record<string, SessionState>;
  nextId: string | undefined;
};

/** De bouwlagen als tabbladen: een trap van letter tot alinea, met het groeiende voorbeeld erboven. */
export function LayerMachine({ selected, onSelect, progress, sessions, nextId }: LayerMachineProps) {
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

  const entries = lessonEntries.filter((entry) => entry.layer.id === layer.id);
  const domains = course.domains.filter((domain) => entries.some((entry) => entry.domain.id === domain.id));

  return (
    <section aria-labelledby="bouwlagen-titel" data-accent={layer.accent} className="overflow-hidden rounded-sheet border-2 border-line bg-surface shadow-sheet">
      <Tabs.Root value={selected} onValueChange={(value) => go(Number(value))}>
        <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
          <div>
            <h2 id="bouwlagen-titel" className="font-display text-title font-extrabold">
              De bouwlagen
            </h2>
            <p className="mt-1 text-small text-ink-muted">Hetzelfde voorbeeld, op elke laag anders bekeken.</p>
          </div>
          <div role="group" aria-label="Lagen doorlopen" className="flex shrink-0 items-center gap-1.5">
            <IconButton label="Vorige laag" variant="secondary" icon={<ChevronLeft className="size-5" strokeWidth={2.75} />} disabled={selected === 0} onClick={() => go(selected - 1)} />
            <IconButton
              label={playing ? 'Afspelen pauzeren' : 'Lagen afspelen'}
              variant="secondary"
              icon={playing ? <Pause className="size-4" strokeWidth={2.75} /> : <Play className="size-4" strokeWidth={2.75} />}
              aria-pressed={playing}
              onClick={() => {
                play('tap');
                setPlaying((value) => !value);
              }}
            />
            <IconButton
              label="Volgende laag"
              variant="secondary"
              icon={<ChevronRight className="size-5" strokeWidth={2.75} />}
              disabled={selected === layers.length - 1}
              onClick={() => go(selected + 1)}
            />
          </div>
        </div>

        {layers.map((item, index) => (
          <Tabs.Panel key={item.id} value={index} className="px-6 pt-6 outline-none sm:px-8" aria-live={playing ? 'off' : undefined}>
            <LayerExample layer={item} />
          </Tabs.Panel>
        ))}

        <Tabs.List aria-label="Bouwlagen, van letter tot alinea" className="mt-2 flex items-end gap-1 px-4 sm:gap-2 sm:px-8">
          {layers.map((item, index) => {
            const active = index === selected;
            const reached = index <= selected;
            const done = layerCompletion(item, progress);
            return (
              <Tabs.Tab
                key={item.id}
                value={index}
                data-accent={item.accent}
                aria-label={`Laag ${index + 1}: ${item.name}, ${done.done} van ${done.total} lessen af`}
                className="group relative flex min-w-0 flex-1 flex-col items-center gap-2 rounded-tile px-0.5 pt-3 pb-2 outline-none focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-focus"
              >
                {active && (
                  <motion.span layoutId="layer-tab" transition={spring.layout} aria-hidden className="absolute inset-0 rounded-tile bg-accent-soft" />
                )}
                <span
                  className={cn(
                    'relative grid size-9 place-items-center rounded-control border-2 transition-[transform,background-color,border-color,color] duration-200 sm:size-10',
                    active
                      ? '-translate-y-1 border-accent bg-accent text-accent-on shadow-[0_3px_0_var(--accent-deep)]'
                      : reached
                        ? 'border-accent-line bg-surface text-accent-ink shadow-[0_3px_0_var(--accent-line)] group-hover:-translate-y-0.5'
                        : 'border-line bg-surface text-ink-muted shadow-slab-sm group-hover:-translate-y-0.5 group-hover:text-ink',
                  )}
                >
                  <LayerGlyph id={item.id} className="size-[1.15rem] sm:size-5" />
                </span>
                <span
                  aria-hidden
                  style={{ height: 14 + index * 6 }}
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
      </Tabs.Root>

      <div className="border-t-2 border-line bg-sunken px-6 py-6 sm:px-8 sm:py-7">
        <h3 className="font-display text-title-sm font-bold">Lessen in {layer.name.toLowerCase()}</h3>
        <div className={cn('mt-4 grid gap-6', domains.length > 1 && 'md:grid-cols-2')}>
          {domains.map((domain) => {
            const inDomain = entries.filter((entry) => entry.domain.id === domain.id);
            return (
              <div key={domain.id} data-accent={domain.accent}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-control bg-accent text-accent-on shadow-[inset_0_-3px_0_rgb(0_0_0/0.14)]">
                    <DomainGlyph id={domain.id} className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="leading-tight font-display font-bold text-ink">{domain.name}</p>
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
