'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { InlineFeedback, isTypingTarget, Kbd, StepIntro, type StepProps } from '../shared';

type Last = { index: number; saysGood: boolean; ok: boolean; text: string };

const feedbackText = (card: StepProps<'swipe'>['step']['cards'][number], saysGood: boolean) => {
  const ok = saysGood === card.ok;
  const detail = card.ok ? `Deze zin klopt. ${card.why}` : `De fout: ${card.fix}. ${card.why}`;
  return { ok, text: `${ok ? 'Raak.' : 'Mis.'} ${detail}` };
};

export function SwipeStep({ step, response, onChange, locked }: StepProps<'swipe'>) {
  const calm = useCalmMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pending, setPending] = useState<Last | null>(null);
  const [last, setLast] = useState<Last | null>(null);
  const index = Math.min(response.answers.length, step.cards.length);
  const card = step.cards[index];
  const done = response.answers.length >= step.cards.length;
  const busy = locked || pending !== null || done;
  const score = response.answers.filter((answer, i) => answer === step.cards[i]?.ok).length;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const answer = (saysGood: boolean) => {
    if (busy || !card) return;
    const result = feedbackText(card, saysGood);
    const nextLast = { index, saysGood, ...result };
    setPending(nextLast);
    setLast(nextLast);
    play(result.ok ? 'right' : 'wrong');
    timer.current = setTimeout(() => {
      timer.current = null;
      setPending(null);
      onChange({ kind: 'swipe', answers: [...response.answers, saysGood] });
    }, calm ? 80 : 360);
  };

  useEffect(() => {
    if (busy) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      if (document.querySelector('[role="dialog"]')) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        answer(false);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        answer(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 90) return;
    answer(info.offset.x > 0);
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <section className="mt-7" aria-label="Swipe-stapel">
        <div className="relative mx-auto h-72 max-w-xl sm:h-80">
          <div aria-hidden className="absolute inset-x-4 top-8 bottom-2 rotate-[2.5deg] rounded-card border-2 border-line bg-sunken" />
          <div aria-hidden className="absolute inset-x-3 top-5 bottom-5 -rotate-[2deg] rounded-card border-2 border-line bg-surface" />

          <AnimatePresence mode="popLayout" initial={false}>
            {done ? (
              <motion.div
                key="empty"
                initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={transition.base}
                className="absolute inset-x-3 top-1 bottom-6 grid place-items-center rounded-card border-2 border-green-line bg-green-soft p-6 text-center shadow-[0_6px_0_var(--color-green-line)]"
              >
                <div>
                  <p className="font-display text-caption font-extrabold tracking-[0.08em] text-green-ink uppercase">Stapel leeg</p>
                  <p className="mt-2 font-display text-[2.25rem] leading-none font-extrabold tracking-[-0.03em] text-green-ink">
                    {score} van {step.cards.length} goed
                  </p>
                </div>
              </motion.div>
            ) : card ? (
              <motion.div
                key={index}
                drag={busy ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={onDragEnd}
                initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 }}
                exit={
                  pending
                    ? { opacity: 0, x: pending.saysGood ? 520 : -520, rotate: pending.saysGood ? 14 : -14, transition: transition.slow }
                    : { opacity: 0, scale: 0.98, transition: transition.fast }
                }
                transition={transition.base}
                className={cn(
                  'absolute inset-x-3 top-1 bottom-6 cursor-grab touch-pan-y select-none rounded-card border-2 border-line bg-surface p-6 text-center shadow-[0_6px_0_var(--color-line-strong)] active:cursor-grabbing sm:p-8',
                  busy && 'cursor-default active:cursor-default',
                )}
              >
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <p className="font-display text-caption font-extrabold tracking-[0.08em] text-ink-muted uppercase">
                    Kaart {index + 1} van {step.cards.length}
                  </p>
                  <p className="max-w-[19ch] text-balance font-serif text-example-lg leading-tight text-ink" lang="nl">
                    {card.t}
                  </p>
                </div>
                {pending?.saysGood === true && <Stamp tone="good" />}
                {pending?.saysGood === false && <Stamp tone="bad" />}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button type="button" variant="danger" size="lg" disabled={busy} onClick={() => answer(false)} className="min-h-16">
            <ArrowLeft aria-hidden className="size-5" strokeWidth={3} />
            Fout
          </Button>
          <Button type="button" variant="primary" size="lg" disabled={busy} onClick={() => answer(true)} className="min-h-16">
            Goed
            <ArrowRight aria-hidden className="size-5" strokeWidth={3} />
          </Button>
        </div>

        <InlineFeedback tone={last?.ok ? 'right' : 'wrong'} id={`${last?.index}:${last?.saysGood}`} className="mt-4">
          {last?.text}
        </InlineFeedback>

        <div aria-hidden className="mt-4 flex justify-center gap-2">
          {step.cards.map((item, i) => {
            const answer = response.answers[i];
            const state = answer === undefined ? 'open' : answer === item.ok ? 'right' : 'wrong';
            return (
              <span
                key={i}
                className={cn(
                  'size-3 rounded-full transition-colors',
                  state === 'right' && 'bg-green',
                  state === 'wrong' && 'rounded-[0.25rem] bg-red',
                  state === 'open' && 'bg-line',
                  i === index && !done && 'ring-2 ring-ink-muted ring-offset-2 ring-offset-surface',
                )}
              />
            );
          })}
        </div>
        {!locked && !done && (
          <p className="mt-4 hidden items-center justify-center gap-1.5 text-caption font-semibold text-ink-muted sm:flex">
            Veeg de kaart, of gebruik <Kbd>←</Kbd> voor fout en <Kbd>→</Kbd> voor goed.
          </p>
        )}
      </section>
    </div>
  );
}

function Stamp({ tone }: { tone: 'good' | 'bad' }) {
  const good = tone === 'good';
  return (
    <span
      className={cn(
        'absolute top-4 rounded-control border-[3px] bg-surface px-3 py-1 font-display text-lead font-black tracking-[0.08em]',
        good ? 'right-4 rotate-12 border-green-ink text-green-ink' : 'left-4 -rotate-12 border-red-ink text-red-ink',
      )}
    >
      {good ? 'GOED' : 'FOUT'}
    </span>
  );
}
