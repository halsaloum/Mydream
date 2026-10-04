"use client";

import { Check, Layers3 } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { spring, transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { Tile } from '../../tile';
import { InlineFeedback, Kbd, Stage, StepIntro, type StepProps } from '../shared';

type Msg = { tone: 'wrong' | 'right' | 'info'; text: string; id: number } | null;

export function StackStep({ step, response, onChange, locked, stepKey }: StepProps<'stack'>) {
  const calm = useCalmMotion();
  const [message, setMessage] = useState<Msg>(null);
  const [bad, setBad] = useState<number | null>(null);
  const messageId = useRef(0);
  const placed = Math.min(response.placed, step.layers.length);
  const current = step.layers[placed];
  const paragraph = step.layers.map((layer) => layer.text).join(' ');
  const options = useMemo(() => step.layers.map((_, index) => index).filter((index) => index >= placed), [step.layers, placed]);

  const choose = (index: number) => {
    if (locked || !current) return;
    if (index === placed) {
      const nextPlaced = placed + 1;
      play('place');
      setBad(null);
      setMessage(null);
      onChange({ ...response, placed: nextPlaced });
    } else {
      play('wrong');
      setBad(index);
      setMessage({ tone: 'wrong', text: current.hint, id: (messageId.current += 1) });
      onChange({ ...response, mistakes: response.mistakes + 1 });
      window.setTimeout(() => setBad((value) => (value === index ? null : value)), 450);
    }
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <LayoutGroup id={`${stepKey}:stack`}>
        <ol className="mt-6 grid gap-3" aria-label="Alinea-lagen">
          {step.layers.map((layer, index) => {
            const filled = index < placed;
            const active = index === placed && !locked;
            return (
              <motion.li key={layer.text} layout="position" transition={spring.layout} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={cn(
                    'mt-3 grid size-9 shrink-0 place-items-center rounded-chip border-2 font-display text-small font-extrabold tabular-nums',
                    filled && 'border-orange-ink bg-orange-ink text-white',
                    active && 'border-orange-line bg-orange-soft text-orange-ink',
                    !filled && !active && 'border-line bg-sunken text-ink-muted',
                  )}
                >
                  {filled ? <Check className="size-4" strokeWidth={3.25} /> : index + 1}
                </span>
                <motion.div
                  layout
                  initial={filled && index === placed - 1 && !calm ? { opacity: 0.45, y: -12 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={transition.base}
                  className={cn(
                    'min-h-16 flex-1 rounded-tile border-2 px-4 py-3',
                    filled && 'border-orange-line bg-orange-soft shadow-[0_3px_0_var(--color-orange-line)]',
                    active && 'border-dashed border-accent bg-surface',
                    !filled && !active && 'border-dashed border-line-strong bg-sunken',
                  )}
                >
                  <p className="label-caps text-orange-ink">
                    {layer.role} · {layer.ask}
                  </p>
                  <AnimatePresence mode="wait" initial={false}>
                    {filled ? (
                      <motion.p
                        key={layer.text}
                        initial={calm ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={transition.base}
                        className="mt-1 font-serif text-[1.1rem] leading-snug text-ink sm:text-[1.2rem]"
                        lang="nl"
                      >
                        {layer.text}
                      </motion.p>
                    ) : (
                      <motion.p key="empty" initial={false} className="mt-1 text-small font-semibold text-ink-muted">
                        {active ? 'Kies de zin die hier landt.' : 'Deze laag komt straks.'}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.li>
            );
          })}
        </ol>

        {placed < step.layers.length ? (
          <section className="mt-7" aria-labelledby={`${stepKey}-stack-question`}>
            <h2 id={`${stepKey}-stack-question`} className="font-display text-title-sm font-extrabold text-ink">
              {current?.question}
            </h2>
            <div className="mt-3 grid gap-3">
              {options.map((index) => {
                const layer = step.layers[index];
                if (!layer) return null;
                const wrong = bad === index;
                return (
                  <motion.div
                    key={layer.text}
                    animate={wrong && !calm ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
                    transition={transition.fast}
                  >
                    <Tile
                      type="button"
                      size="block"
                      layoutId={`${stepKey}:stack:${index}`}
                      state={wrong ? 'wrong' : 'idle'}
                      disabled={locked}
                      onClick={() => choose(index)}
                      aria-label={`${layer.text}. ${layer.role}`}
                    >
                      <span className="min-w-0 flex-1">{layer.text}</span>
                    </Tile>
                  </motion.div>
                );
              })}
            </div>
            <InlineFeedback className="mt-4" tone={message?.tone ?? 'info'} id={message?.id}>
              {message?.text}
            </InlineFeedback>
            {!locked && (
              <p className="mt-2 hidden items-center gap-1.5 text-caption font-semibold text-ink-muted sm:flex">
                Gebruik <Kbd>Tab</Kbd> en <Kbd>Enter</Kbd> om de volgende laag te kiezen.
              </p>
            )}
          </section>
        ) : (
          <Stage className="mt-7 border-orange-line bg-orange-soft">
            <div className="flex items-center gap-2 text-orange-ink">
              <Layers3 aria-hidden className="size-5" strokeWidth={2.75} />
              <h2 className="font-display text-title-sm font-extrabold">Zo leest je alinea</h2>
            </div>
            <p className="mt-3 font-serif text-example leading-relaxed text-ink" lang="nl">
              {paragraph}
            </p>
          </Stage>
        )}
      </LayoutGroup>
    </div>
  );
}
