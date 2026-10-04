'use client';

/* eslint-disable react-hooks/refs */

import { motion } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';
import { play } from '@/lib/sound';
import { PracticeDnd, useClickGuard, useDragTarget, useDropZone } from '../../dnd';
import { Tile } from '../../tile';
import { InlineFeedback, Stage, StepIntro, type StepProps } from '../shared';

const DAYS = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

export function LadderStep({ step, response, onChange, locked }: StepProps<'ladder'>) {
  const [bad, setBad] = useState<string | null>(null);
  const [hint, setHint] = useState('');
  const guard = useClickGuard();
  const tray = step.tray ?? [...step.steps.map((s) => s.t)].sort();
  const done = response.placed >= step.steps.length;
  const last = response.placed > 0 ? step.steps[response.placed - 1] : null;

  const choose = (word: string) => {
    if (locked || done) return;
    const expected = step.steps[response.placed]?.t;
    setBad(null);
    setHint('');
    if (word !== expected) {
      play('wrong');
      const msg = response.placed === 0 ? (step.startHint ?? 'Begin bij het zwakste woord. Welk woord betekent: geen enkele keer?') : `Er ligt nog een zwakker woord. Wat komt net boven ${step.steps[response.placed - 1]?.t ?? ''}?`;
      setBad(word);
      setHint(msg);
      window.setTimeout(() => setBad((current) => (current === word ? null : current)), 450);
      onChange({ ...response, mistakes: response.mistakes + 1 });
      return;
    }
    play('right');
    onChange({ ...response, placed: response.placed + 1 });
  };

  const available = tray.filter((word) => step.steps.findIndex((s) => s.t === word) >= response.placed);
  const weekText = last ? (last.days === 0 ? 'Geen enkele dag.' : last.days === 7 ? 'Elke dag.' : 'Ongeveer zo vaak.') : 'Kies het zwakste woord.';

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />
      <PracticeDnd
        disabled={locked || done}
        animateDrop={false}
        onDrop={(activeId, overId) => {
          guard.afterDrag();
          if (overId === `rung-${response.placed}`) choose(activeId.replace('word-', ''));
        }}
        renderOverlay={(activeId) => <span className="slab rounded-tile border-2 border-purple bg-surface px-4 py-2 font-serif text-[1.375rem] text-ink [--slab:var(--color-purple)]">{activeId.replace('word-', '')}</span>}
      >
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(16rem,1fr)_minmax(16rem,0.9fr)]">
          <section>
            <p className="mb-2 text-center text-caption font-extrabold uppercase tracking-[0.12em] text-ink-muted">{step.high ?? 'sterkst'}</p>
            <ol aria-label="Ladder van sterk naar zwak" className="space-y-2 border-x-[7px] border-purple-line px-3 py-2">
              {[...step.steps].map((_, displayIndex) => {
                const index = step.steps.length - 1 - displayIndex;
                const rung = step.steps[index];
                if (!rung) return null;
                const filled = index < response.placed;
                const next = index === response.placed;
                return <Rung key={rung.t} id={`rung-${index}`} index={index} label={filled ? rung.t : next ? 'hier' : ''} days={filled ? (rung.days ?? 0) : null} filled={filled} next={next} just={filled && index === response.placed - 1} disabled={locked || done} />;
              })}
            </ol>
            <p className="mt-2 text-center text-caption font-extrabold uppercase tracking-[0.12em] text-ink-muted">{step.low ?? 'zwakst'}</p>
          </section>

          <section className="space-y-4">
            <Stage className="px-4 py-4 sm:px-5">
              <p className="text-caption font-extrabold uppercase tracking-[0.12em] text-ink-muted">In een zin</p>
              <p className="mt-2 font-serif text-[1.45rem] leading-relaxed text-ink">
                {step.sentence.before}{' '}
                <motion.span key={last?.t ?? 'empty'} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block rounded-chip bg-purple-soft px-2 text-purple-ink">
                  {last?.t ?? '…'}
                </motion.span>{' '}
                {step.sentence.after}
              </p>
              <div aria-hidden className="mt-3 grid grid-cols-7 gap-1.5">
                {DAYS.map((day, index) => {
                  const on = last && index < (last.days ?? 0);
                  return <span key={day} className={cn('grid h-8 place-items-center rounded-chip text-caption font-extrabold', on ? 'bg-purple-ink text-white' : 'bg-line text-ink-muted')}>{day}</span>;
                })}
              </div>
              <p className="mt-2 text-caption font-bold text-ink-muted">{weekText}</p>
            </Stage>

            {!done && (
              <section>
                <h2 className="font-display text-body font-extrabold text-purple-ink">Welk woord is de volgende sport?</h2>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {available.map((word) => (
                    <LadderTile key={word} word={word} bad={bad === word} locked={locked} onPick={() => guard.allowed() && choose(word)} />
                  ))}
                </div>
                <InlineFeedback tone={hint ? 'wrong' : 'info'} id={hint || response.placed} className="mt-3">
                  {hint || 'Begin onderaan en klim één sport tegelijk omhoog.'}
                </InlineFeedback>
              </section>
            )}
            {done && step.done?.note && <InlineFeedback tone="right" id="done">{step.done.note}</InlineFeedback>}
          </section>
        </div>
      </PracticeDnd>
    </div>
  );
}

function Rung({ id, index, label, days, filled, next, just, disabled }: { id: string; index: number; label: string; days: number | null; filled: boolean; next: boolean; just: boolean; disabled: boolean }) {
  const zone = useDropZone(id, { label: `sport ${index + 1}`, kind: 'rung', index }, disabled || !next);
  return (
    <motion.li
      ref={zone.setNodeRef}
      layout
      transition={spring.layout}
      className={cn('flex min-h-14 items-center justify-between gap-3 rounded-control border-2 px-4 py-2', filled ? 'border-purple bg-purple-soft text-purple-ink' : next || zone.isOver ? 'border-purple border-dashed bg-surface text-purple-ink' : 'border-dashed border-line-strong bg-sunken text-ink-muted', just && 'animate-pop')}
    >
      <span className="font-display text-title-sm font-extrabold">{label}</span>
      <span aria-hidden className="flex gap-1">
        {Array.from({ length: 7 }, (_, i) => <span key={i} className={cn('size-2.5 rounded-full', days !== null && i < days ? 'bg-purple-ink' : filled ? 'bg-purple-line' : 'bg-transparent')} />)}
      </span>
    </motion.li>
  );
}

function LadderTile({ word, bad, locked, onPick }: { word: string; bad: boolean; locked: boolean; onPick: () => void }) {
  const drag = useDragTarget(`word-${word}`, { label: word, kind: 'word', index: 0 }, locked);
  return (
    <Tile ref={drag.setNodeRef} {...drag.listeners} aria-describedby={drag.describedBy} disabled={locked} onClick={onPick} state={bad ? 'wrong' : drag.isDragging ? 'dragging' : 'idle'} className={cn(bad && 'animate-shake')}>
      {word}
    </Tile>
  );
}
