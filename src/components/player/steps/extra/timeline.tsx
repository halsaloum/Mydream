'use client';

import { Slider } from '@base-ui/react/slider';
import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { Button } from '@/components/ui/button';
import { Stage, StepIntro, type StepProps } from '../shared';

export function TimelineStep({ step, response, onChange, locked }: StepProps<'timeline'>) {
  const calm = useCalmMotion();
  const verb = Math.min(response.verb, step.verbs.length - 1);
  const stop = Math.min(response.stop, step.stops.length - 1);
  const currentVerb = step.verbs[verb] ?? step.verbs[0];
  const currentStop = step.stops[stop] ?? step.stops[0];
  const cell = currentVerb?.cells[stop] ?? currentVerb?.cells[0];
  const seen = new Set(response.seen);

  const changeStop = (next: number) => {
    if (locked || next < 0 || next >= step.stops.length) return;
    const nextSeen = new Set(response.seen);
    nextSeen.add(next);
    play(nextSeen.has(next) ? 'select' : 'right');
    onChange({ kind: 'timeline', verb, stop: next, seen: [...nextSeen] });
  };

  const changeVerb = (next: number) => {
    if (locked || next === verb) return;
    play('select');
    onChange({ kind: 'timeline', verb: next, stop, seen: response.seen });
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        {step.verbs.map((item, i) => (
          <Button key={item.t} type="button" variant={i === verb ? 'primary' : 'secondary'} size="sm" aria-pressed={i === verb} disabled={locked} onClick={() => changeVerb(i)}>
            {item.t}
          </Button>
        ))}
      </div>

      <Stage className="mt-5 text-center">
        <p className="font-display text-caption font-extrabold tracking-[0.08em] text-accent-ink uppercase">{currentStop?.tense}</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`${verb}:${stop}`}
            initial={calm ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: transition.fast }}
            transition={transition.base}
            className="mt-3 flex min-h-24 items-center justify-center text-balance font-serif text-example-lg leading-snug text-ink"
            lang="nl"
          >
            <span>
              {cell?.segs.map((seg, i) => (
                <span key={i} className={cn(seg.hi && 'rounded-control bg-green-soft px-2 py-0.5 text-green-ink')}>
                  {seg.t}
                </span>
              ))}
            </span>
          </motion.p>
        </AnimatePresence>
        <div className="mt-3 flex min-h-16 flex-wrap items-center justify-center gap-2">
          <span className="rounded-chip border-2 border-green-line bg-surface px-3 py-1 text-small font-extrabold text-green-ink">{cell?.rule}</span>
          <span role="status" className="max-w-[42ch] text-small font-semibold text-ink-soft">{cell?.note}</span>
        </div>
      </Stage>

      <div className="mt-7 px-1">
        <Slider.Root value={stop} min={0} max={step.stops.length - 1} step={1} onValueChange={(value) => changeStop(Array.isArray(value) ? value[0] ?? 0 : value)} disabled={locked}>
          <Slider.Control className="flex w-full touch-none items-center py-3 select-none">
            <Slider.Track className="relative h-3 w-full rounded-full bg-line shadow-[inset_0_2px_0_rgb(16_24_40/0.06)]">
              <Slider.Indicator className="rounded-full bg-green" />
              <Slider.Thumb aria-label="Tijdlijn van verleden tot toekomst" className="grid size-9 place-items-center rounded-control border-2 border-green bg-surface shadow-[0_4px_0_var(--color-green)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus before:h-4 before:w-5 before:rounded-sm before:bg-[repeating-linear-gradient(90deg,var(--color-green)_0_2px,transparent_2px_6px)]" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
        <div className="mt-1 grid" style={{ gridTemplateColumns: `repeat(${step.stops.length}, minmax(0, 1fr))` }}>
          {step.stops.map((item, i) => (
            <button key={item.label} type="button" disabled={locked} onClick={() => changeStop(i)} className="group flex min-h-14 flex-col items-center gap-1 rounded-control px-1 text-center focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-default">
              <span className={cn('grid size-4 place-items-center rounded-full border-2', seen.has(i) ? 'border-green bg-green text-green-on' : 'border-line-strong bg-surface')}>
                {seen.has(i) && <Check aria-hidden className="size-2.5" strokeWidth={4} />}
              </span>
              <span className={cn('text-small font-extrabold', i === stop ? 'text-green-ink' : 'text-ink')}>{item.label}</span>
              {item.sub && <span className="text-caption font-bold text-ink-muted">{item.sub}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
