'use client';

import { ArrowLeft, ArrowRight, Check, Eye, Pause, Play, RotateCcw } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useEffect, useId, useState } from 'react';
import type { SentenceLesson } from '@/content/sentences/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { spring, useCalmMotion } from '@/lib/motion';
import { SentenceScene } from './sentence-scene';

type DiscoveryProps = { lesson: SentenceLesson; visited: string[]; onVisit: (variantId: string) => void };

const tones = {
  blue: 'border-blue-line bg-blue-soft text-blue-ink',
  green: 'border-green-line bg-green-soft text-green-ink',
  orange: 'border-orange-line bg-orange-soft text-orange-ink',
  purple: 'border-purple-line bg-purple-soft text-purple-ink',
};

function constituentIdentity(text: string): string {
  return text.toLocaleLowerCase('nl').replace(/[.,;:!?]/g, '').replace(/\s+/g, ' ').trim();
}

/** A contrast is explored with whole constituents; no automatic playback starts on entry. */
export function DiscoveryLab({ lesson, visited, onVisit }: DiscoveryProps) {
  const calm = useCalmMotion();
  const layoutId = useId();
  const variants = lesson.discovery.variants;
  const [index, setIndex] = useState(() => Math.max(0, variants.findIndex((variant) => variant.id === visited.at(-1))));
  const [playState, setPlayState] = useState({ active: false, calm });
  // A preference change cancels the user's previous play request; it never resumes by itself.
  if (playState.calm !== calm) setPlayState({ active: false, calm });
  const currentIndex = Math.min(index, Math.max(0, variants.length - 1));
  const current = variants[currentIndex];
  const playing = playState.active && playState.calm === calm && !calm;

  useEffect(() => {
    if (current && !visited.includes(current.id)) onVisit(current.id);
  }, [current, visited, onVisit]);

  useEffect(() => {
    if (!playing || variants.length < 2) return;
    const timer = window.setTimeout(() => setIndex((previous) => (previous + 1) % variants.length), 3200);
    return () => window.clearTimeout(timer);
  }, [playing, currentIndex, variants.length]);

  const choose = (next: number) => {
    setPlayState({ active: false, calm });
    setIndex(next);
  };

  if (!current) return null;
  const explored = variants.filter((variant) => visited.includes(variant.id)).length;
  const occurrences = new Map<string, number>();
  const blocks = current.blocks.map((block) => {
    const identity = constituentIdentity(block.text);
    const occurrence = occurrences.get(identity) ?? 0;
    occurrences.set(identity, occurrence + 1);
    return { ...block, identity: `${identity}:${occurrence}` };
  });

  return <section aria-label="Ontdek-lab" className="space-y-6">
    <div>
      <p className="mb-2 flex items-center gap-2 text-caption font-bold tracking-wide text-blue-ink uppercase"><Eye aria-hidden className="size-4" />Eerst kijken, dan verklaren</p>
      <h2 className="font-display text-title-sm font-extrabold leading-tight text-ink">{lesson.discovery.question}</h2>
      <p className="mt-3 text-small leading-relaxed text-ink-muted">Wissel de voorbeelden. Volg wat de woorden doen en lees welke betekenis of grammaticale functie verandert.</p>
    </div>

    <div className="flex flex-wrap gap-2" role="group" aria-label="Contrasterende voorbeelden">
      {variants.map((variant, position) => <Button key={variant.id} variant={position === currentIndex ? 'accent' : 'secondary'} data-accent="blue" aria-pressed={position === currentIndex} onClick={() => choose(position)} className="min-w-0 max-w-full text-left">
        <span className="min-w-0 whitespace-normal">{variant.label}</span>
        {visited.includes(variant.id) && <Check aria-hidden className="size-4 shrink-0" />}
        {visited.includes(variant.id) && <span className="sr-only"> · bekeken</span>}
      </Button>)}
    </div>

    <div className="min-w-0 rounded-card border-2 border-blue-line bg-blue-soft/40 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption font-bold text-blue-ink">Zinsbouw · {current.label}</p>
        <span className="rounded-chip border border-line bg-surface px-2.5 py-1 text-caption font-bold text-ink-muted">{currentIndex + 1} van {variants.length}</span>
      </div>
      <LayoutGroup id={`${layoutId}-${lesson.id}`}>
        <ol aria-label="Zinblokken in leesvolgorde" className="mt-5 flex min-w-0 flex-wrap items-stretch gap-3">
          <AnimatePresence initial={false} mode="popLayout">
            {blocks.map((block, position) => <motion.li key={block.identity} layout={calm ? false : 'position'} layoutId={calm ? undefined : `${layoutId}-${block.identity}`} initial={calm ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={calm ? undefined : { opacity: 0, y: -6 }} transition={calm ? { duration: 0 } : spring.layout} className={cn('min-w-0 max-w-full flex-1 basis-[8rem] rounded-control border-2 px-3.5 py-3 shadow-slab-sm', tones[block.accent ?? 'blue'])}>
              <span className="mb-2 block text-caption font-bold">Blok {position + 1} · {block.role}</span>
              <span className="block break-words font-serif text-[1.3rem] leading-snug">{block.text}</span>
            </motion.li>)}
          </AnimatePresence>
        </ol>
      </LayoutGroup>
      <p className="mt-4 text-caption leading-relaxed text-ink-muted">De labels horen bij hele zinblokken. Een blok kan uit meerdere woorden bestaan.</p>
      <p role="status" aria-live="polite" aria-atomic="true" className="mt-5 rounded-control border border-blue-line bg-surface p-4 font-serif text-[1.4rem] leading-snug text-ink" lang="nl">{current.sentence}</p>
    </div>

    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <SentenceScene scene={current.scene} variantId={current.id} caption={current.note} />
      <div className="rounded-card border-2 border-line bg-surface p-5 sm:p-6">
        <h3 className="font-display text-lead font-extrabold text-ink">Wat je hier ziet</h3>
        <p className="mt-3 text-body leading-relaxed text-ink-soft">{current.note}</p>
        <div className="mt-5 border-t border-line pt-5">
          <p className="text-caption font-bold text-green-ink">Neem dit mee</p>
          <p className="mt-2 text-small leading-relaxed text-ink-soft">{lesson.discovery.takeaway}</p>
        </div>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-4 rounded-control border border-line bg-sunken p-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="De voorbeelden stap voor stap vergelijken">
        <Button variant="secondary" size="sm" aria-label="Vorig voorbeeld" disabled={currentIndex === 0} onClick={() => choose(currentIndex - 1)}><ArrowLeft aria-hidden className="size-4" /></Button>
        <Button variant="secondary" size="sm" aria-label="Volgend voorbeeld" disabled={currentIndex === variants.length - 1} onClick={() => choose(currentIndex + 1)}><ArrowRight aria-hidden className="size-4" /></Button>
        <Button variant="ghost" size="sm" disabled={calm || variants.length < 2} aria-pressed={playing} onClick={() => setPlayState({ active: !playing, calm })}>{playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}{playing ? 'Pauzeren' : 'Afspelen'}</Button>
        <Button variant="ghost" size="sm" onClick={() => choose(0)}><RotateCcw aria-hidden className="size-4" />Vanaf het begin</Button>
      </div>
      <p className="text-caption font-bold text-ink-muted">{explored} van {variants.length} voorbeelden bekeken</p>
      {calm && <p className="w-full text-caption text-ink-muted">Rustige weergave: gebruik de voorbeeldknoppen om zelf het tempo te bepalen.</p>}
    </div>
  </section>;
}
