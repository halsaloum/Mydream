'use client';

import { LockKeyhole } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';
import { play } from '@/lib/sound';
import { StepIntro, type StepProps } from '../shared';

export function TrainStep({ step, response, onChange, locked, stepKey }: StepProps<'train'>) {
  const front = response.front ?? step.fronts[0]?.block ?? '';
  const frontSpec = step.fronts.find((item) => item.block === front) ?? step.fronts[0];
  const blocks = new Map(step.blocks.map((block) => [block.id, block]));
  const seen = new Set(response.seen);
  const order = frontSpec?.order ?? [];
  const sentence = frontSpec?.sentence ?? makeSentence(order, blocks);

  const pick = (block: string) => {
    if (locked) return;
    const nextSeen = new Set(response.seen);
    nextSeen.add(block);
    play('place');
    onChange({ kind: 'train', front: block, seen: [...nextSeen] });
  };

  return (
    <div data-accent="blue">
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        {step.fronts.map((item) => {
          const block = blocks.get(item.block);
          const active = item.block === front;
          return (
            <Button key={item.block} type="button" variant={active ? 'accent' : 'secondary'} size="sm" aria-pressed={active} disabled={locked} onClick={() => pick(item.block)}>
              {block?.t}
            </Button>
          );
        })}
      </div>

      <section className="mt-5 overflow-x-auto rounded-card border-2 border-line bg-sunken px-4 py-6" aria-label="Zinstrein">
        <LayoutGroup id={stepKey}>
          <div className="relative flex min-w-max items-start justify-center px-2 pb-2">
            <span aria-hidden className="absolute right-2 left-2 top-[6.4rem] h-1 rounded-full bg-line-strong" />
            {order.map((id, i) => {
              const block = blocks.get(id);
              if (!block) return null;
              const isVerb = id === step.verb;
              const isFront = i === 0;
              return (
                <div key={id} className="flex items-start">
                  {i > 0 && <span aria-hidden className="mt-[3.35rem] -mx-2 h-1.5 w-9 rounded-full bg-ink-soft" />}
                  <motion.div layout transition={spring.layout} className="relative z-10 flex flex-col items-center">
                    <p className={cn('mb-1 h-4 font-display text-[0.7rem] font-extrabold tracking-[0.06em] uppercase', isVerb ? 'text-blue-ink' : isFront ? 'text-yellow-ink' : 'text-ink-muted')}>{block.role}</p>
                    <div
                      className={cn(
                        'flex h-16 items-center gap-2 rounded-control border-2 px-5 font-display text-lead font-extrabold whitespace-nowrap shadow-[0_4px_0_currentColor]/15',
                        isVerb && 'border-blue bg-blue-soft text-blue-ink',
                        isFront && !isVerb && 'border-yellow-line bg-yellow-soft text-yellow-ink',
                        !isVerb && !isFront && 'border-line bg-surface text-ink',
                      )}
                    >
                      {isVerb && <LockKeyhole aria-hidden className="size-5" strokeWidth={2.75} />}
                      <span>{isFront ? cap(block.t) : block.t}</span>
                    </div>
                    <div aria-hidden className="mt-1 flex w-16 justify-between">
                      <span className="size-3.5 rounded-full border-[4px] border-ink-soft bg-surface" />
                      <span className="size-3.5 rounded-full border-[4px] border-ink-soft bg-surface" />
                    </div>
                    <p className={cn('mt-2 text-caption font-extrabold whitespace-nowrap', isVerb ? 'text-blue-ink' : 'text-ink-muted')}>{isVerb ? 'plek 2 · vast' : `plek ${i + 1}`}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </LayoutGroup>
      </section>

      <p role="status" className="mt-4 rounded-control border-2 border-blue-line bg-blue-soft px-4 py-3 font-serif text-[1.35rem] leading-snug text-blue-ink" lang="nl">
        {sentence}
      </p>

      <section className="mt-5">
        <h2 className="font-display text-small font-extrabold text-ink-soft">Jouw zinnen onder elkaar</h2>
        <div className="mt-2 grid gap-2">
          {step.fronts.map((item) => {
            const itemOrder = item.order;
            const visited = seen.has(item.block);
            const text = item.sentence ?? makeSentence(itemOrder, blocks);
            return (
              <div key={item.block} className={cn('grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-control border-2 px-3 py-2', visited ? 'border-line bg-surface' : 'border-dashed border-line bg-transparent text-ink-muted')}>
                <p className="font-serif text-[1.2rem] leading-snug">{visited ? text : '· · ·  ?  · · ·'}</p>
                <span className={cn('rounded-chip px-2 py-0.5 text-caption font-extrabold', visited ? 'bg-blue-soft text-blue-ink' : 'bg-line text-ink-muted')}>{blocks.get(item.block)?.role}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function cap(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function makeSentence(order: readonly string[], blocks: Map<string, { t: string }>) {
  const text = order.map((id, i) => (i === 0 ? cap(blocks.get(id)?.t ?? '') : blocks.get(id)?.t ?? '')).join(' ');
  return `${text}.`;
}
