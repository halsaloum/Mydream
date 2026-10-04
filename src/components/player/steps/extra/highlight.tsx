'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { Check, Highlighter } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { InlineFeedback, isTypingTarget, Kbd, Stage, StepIntro, type StepProps } from '../shared';

const tagFor = (step: StepProps<'highlight'>['step'], role: string | undefined) => step.pens.find((pen) => pen.id === role);

function nextPen(step: StepProps<'highlight'>['step'], painted: readonly number[], current: string) {
  const currentLeft = step.words.some((word, i) => word.role === current && !painted.includes(i));
  if (currentLeft) return current;
  return step.pens.find((pen) => step.words.some((word, i) => word.role === pen.id && !painted.includes(i)))?.id ?? current;
}

export function HighlightStep({ step, response, onChange, locked }: StepProps<'highlight'>) {
  const calm = useCalmMotion();
  const [bad, setBad] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const activePen = step.pens.find((pen) => pen.id === response.pen) ?? step.pens[0];

  const selectPen = (pen: string) => {
    if (locked || !step.pens.some((p) => p.id === pen)) return;
    play('select');
    setBad(null);
    setMessage('');
    onChange({ ...response, pen });
  };

  useEffect(() => {
    if (locked) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      const n = Number(event.key);
      const pen = Number.isInteger(n) && n >= 1 ? step.pens[n - 1] : undefined;
      if (pen) {
        event.preventDefault();
        selectPen(pen.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const paint = (index: number) => {
    if (locked || response.painted.includes(index)) return;
    const word = step.words[index];
    if (!word?.role) return;
    setBad(null);
    setMessage('');
    if (word.role !== response.pen) {
      play('wrong');
      setBad(index);
      setMessage(`Dat hoort er niet bij. ${activePen?.ask ?? ''}`);
      window.setTimeout(() => setBad((current) => (current === index ? null : current)), 450);
      onChange({ ...response, mistakes: response.mistakes + 1 });
      return;
    }
    play('right');
    const painted = [...response.painted, index].sort((a, b) => a - b);
    onChange({ ...response, painted, pen: nextPen(step, painted, response.pen) });
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <ToggleGroup aria-label="Kies een markeerstift" value={[response.pen]} onValueChange={(value) => value[0] && selectPen(value[0])} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {step.pens.map((pen, i) => {
          const total = step.words.filter((word) => word.role === pen.id).length;
          const done = step.words.filter((word, wordIndex) => word.role === pen.id && response.painted.includes(wordIndex)).length;
          const pressed = response.pen === pen.id;
          return (
            <Toggle
              key={pen.id}
              value={pen.id}
              disabled={locked}
              data-accent={pen.accent}
              className={cn(
                'group slab pressable flex min-h-[5.75rem] flex-col items-center justify-center gap-1.5 rounded-tile border-2 px-3 py-3 text-center outline-none [--lift:4px] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                pressed ? 'border-accent bg-accent-soft [--slab:var(--accent)]' : 'border-line bg-surface [--slab:var(--color-line-strong)] hover:border-accent-line',
              )}
            >
              <Highlighter aria-hidden className={cn('size-6', pressed ? 'text-accent-ink' : 'text-ink-muted')} strokeWidth={2.75} />
              <span className="font-display text-body font-extrabold text-ink">{pen.label}</span>
              <span className="text-caption font-extrabold text-ink-muted">
                {i + 1} · {done}/{total}
              </span>
            </Toggle>
          );
        })}
      </ToggleGroup>

      <Stage className="mt-6">
        <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-4">
          {step.words.map((word, index) => {
            const pen = tagFor(step, word.role);
            const painted = response.painted.includes(index);
            return (
              <button
                key={`${word.t}:${index}`}
                type="button"
                disabled={locked || painted || !word.role}
                onClick={() => paint(index)}
                data-accent={pen?.accent ?? 'slate'}
                className={cn('group flex min-h-16 min-w-12 flex-col items-center gap-1 rounded-control px-1 outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus', bad === index && 'animate-shake')}
              >
                <span className="relative overflow-hidden rounded-chip px-2.5 py-0.5 font-serif text-example leading-tight text-ink transition-colors group-hover:bg-line/50">
                  <AnimatePresence initial={false}>
                    {painted && (
                      <motion.span
                        aria-hidden
                        initial={calm ? { opacity: 0 } : { scaleX: 0, opacity: 0.5 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={transition.base}
                        className="absolute inset-x-0 bottom-1 top-[45%] origin-left rounded-chip bg-accent-soft"
                      />
                    )}
                  </AnimatePresence>
                  <span className={cn('relative z-1 border-b-[3px]', painted ? 'border-accent text-accent-ink' : 'border-dashed border-line-strong')}>{word.t}</span>
                </span>
                <span className="min-h-5 text-caption font-extrabold tracking-wide text-accent-ink">{painted && pen ? pen.tag : <span aria-hidden>&nbsp;</span>}</span>
                {painted && <Check aria-hidden className="sr-only" />}
              </button>
            );
          })}
        </div>
      </Stage>

      <InlineFeedback tone={message ? 'wrong' : 'info'} id={message || response.pen} className="mt-4">
        {message || activePen?.ask || null}
      </InlineFeedback>
      {!locked && (
        <p className="mt-3 hidden items-center gap-1.5 text-caption font-semibold text-ink-muted sm:flex">
          Wissel van stift met <Kbd>1</Kbd>–<Kbd>{step.pens.length}</Kbd>.
        </p>
      )}
      {locked && step.done?.note && <p className="mt-4 text-center font-display text-title-sm font-extrabold text-green-ink">{step.done.note}</p>}
    </div>
  );
}
