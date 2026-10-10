'use client';

import { Check } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';
import { play } from '@/lib/sound';
import { InlineFeedback, isTypingTarget, Kbd, Stage, StepIntro, type StepProps } from '../shared';

const isRightSlot = (type: 'neven' | 'onder', slot: 'A' | 'B') => (slot === 'A') === (type === 'neven');

export function ConjunctionStep({ step, response, onChange, locked, stepKey }: StepProps<'conjunction'>) {
  const [bad, setBad] = useState<'A' | 'B' | null>(null);
  const [message, setMessage] = useState('');
  const currentIndex = Math.min(response.current, step.items.length - 1);
  const item = step.items[currentIndex] ?? step.items[0];
  const placed = response.placed.includes(currentIndex);

  const select = (index: number) => {
    if (locked || !step.items[index]) return;
    play('select');
    setBad(null);
    setMessage('');
    onChange({ ...response, current: index });
  };

  useEffect(() => {
    if (locked) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      const n = Number(event.key);
      if (Number.isInteger(n) && n >= 1 && step.items[n - 1]) {
        event.preventDefault();
        select(n - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const chooseSlot = (slot: 'A' | 'B') => {
    if (locked || placed || !item) return;
    setBad(null);
    setMessage('');
    if (!isRightSlot(item.type, slot)) {
      play('wrong');
      const msg =
        item.type === 'neven'
          ? `Niet daar. Na ${item.conj} komt een gewone hoofdzin: onderwerp, dan de persoonsvorm.`
          : `Niet daar. Na ${item.conj} komt een bijzin. Waar staat de persoonsvorm in een bijzin?`;
      setBad(slot);
      setMessage(msg);
      window.setTimeout(() => setBad((current) => (current === slot ? null : current)), 450);
      onChange({ ...response, mistakes: response.mistakes + 1 });
      return;
    }
    play('right');
    onChange({ ...response, placed: [...response.placed, currentIndex].sort((a, b) => a - b) });
  };

  const tone = item?.type === 'onder' ? 'purple' : 'yellow';
  const verb = step.clause.verb;

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <div className="mt-6 flex flex-wrap gap-2.5" role="group" aria-label="Voegwoorden">
        {step.items.map((it, index) => {
          const done = response.placed.includes(index);
          const active = index === currentIndex;
          return (
            <button
              key={it.conj}
              type="button"
              onClick={() => select(index)}
              disabled={locked}
              data-accent={it.type === 'onder' ? 'purple' : 'yellow'}
              aria-pressed={active}
              className={cn(
                'slab pressable flex min-h-12 items-center gap-2 rounded-control border-2 px-4 font-display text-lead font-extrabold outline-none [--lift:3px] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                active ? 'border-blue bg-blue-soft text-blue-ink [--slab:var(--color-blue)]' : 'border-accent-line bg-accent-soft text-accent-ink [--slab:var(--accent-line)]',
              )}
            >
              {it.conj}
              {done && <Check aria-label="gedaan" className="size-4" strokeWidth={3.5} />}
              <span className="sr-only">{index + 1}</span>
            </button>
          );
        })}
      </div>

      <Stage className="mt-5">
        <p className="text-center font-serif text-example text-ink">{item?.main}</p>
        <LayoutGroup id={`${stepKey}:conjunction:${currentIndex}`}>
          <motion.div layout className="mt-5 flex flex-wrap items-center justify-center gap-2" transition={spring.layout}>
            <Word id="conj" accent={tone} text={item?.conj ?? ''} />
            <Word id="subject" text={step.clause.subject} />
            {placed && item?.type === 'neven' ? <Word id="verb" accent="blue" text={verb} emph /> : <Slot id="A" bad={bad === 'A'} label={`Zet ${verb} plek 2`} text="plek 2" onClick={() => chooseSlot('A')} disabled={locked} />}
            <Word id="rest" text={step.clause.rest.replace(/[.]$/, '')} />
            {placed && item?.type === 'onder' ? <Word id="verb" accent="blue" text={`${verb}.`} emph /> : <Slot id="B" bad={bad === 'B'} label={`Zet ${verb} achteraan`} text="achteraan" onClick={() => chooseSlot('B')} disabled={locked} />}
          </motion.div>
        </LayoutGroup>
        {!placed && !locked && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 text-center font-display text-body font-bold text-blue-ink">
            {verb} zoekt zijn plek.
          </motion.p>
        )}
        {placed && item && <p className="mt-5 text-center text-small font-bold text-green-ink">{item.why}</p>}
      </Stage>

      <InlineFeedback tone="wrong" id={message} className="mt-4">
        {message || null}
      </InlineFeedback>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <SolvedBox title="Twee hoofdzinnen" note="persoonsvorm blijft op plek 2" type="neven" items={step.items} placed={response.placed} />
        <SolvedBox title="Hoofdzin + bijzin" note="persoonsvorm gaat naar achteren" type="onder" items={step.items} placed={response.placed} />
      </div>
      {!locked && (
        <p className="mt-3 hidden items-center gap-1.5 text-caption font-semibold text-ink-muted sm:flex">
          Kies voegwoorden met <Kbd>1</Kbd>–<Kbd>{step.items.length}</Kbd>; activeer daarna de juiste plek.
        </p>
      )}
    </div>
  );
}

function Word({ id, text, accent = 'slate', emph = false }: { id: string; text: string; accent?: string; emph?: boolean }) {
  return (
    <motion.span
      layoutId={id}
      layout="position"
      transition={spring.layout}
      data-accent={accent}
      className={cn('slab rounded-tile border-2 px-4 py-2 font-display text-[1.375rem] font-extrabold', emph ? 'border-accent bg-accent-soft text-accent-ink [--slab:var(--accent)]' : 'border-line bg-surface text-ink [--slab:var(--color-line-strong)]')}
    >
      {text}
    </motion.span>
  );
}

function Slot({ id, text, label, bad, disabled, onClick }: { id: string; text: string; label: string; bad: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <motion.button
      layoutId={`slot-${id}`}
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={cn('grid min-h-[3.5rem] min-w-24 place-items-center rounded-tile border-2 border-dashed border-line-strong bg-surface px-3 font-display text-caption font-extrabold uppercase tracking-wide text-blue-ink outline-none hover:border-blue hover:bg-blue-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus', bad && 'animate-shake border-red bg-red-soft text-red-ink')}
    >
      {text}
    </motion.button>
  );
}

function SolvedBox({ title, note, type, items, placed }: { title: string; note: string; type: 'neven' | 'onder'; items: readonly { conj: string; type: 'neven' | 'onder' }[]; placed: readonly number[] }) {
  return (
    <section data-accent={type === 'onder' ? 'purple' : 'yellow'} className="rounded-card border-2 border-accent-line bg-accent-soft/50 p-4">
      <h2 className="font-display text-body font-extrabold text-accent-ink">{title}</h2>
      <p className="text-caption font-bold text-ink-muted">{note}</p>
      <div className="mt-3 flex min-h-9 flex-wrap gap-2">
        {items
          .map((it, index) => ({ ...it, index }))
          .filter((it) => it.type === type)
          .map((it) => {
            const done = placed.includes(it.index);
            return (
              <span key={it.conj} className={cn('rounded-chip border-2 px-3 py-1 font-display font-extrabold', done ? 'border-accent bg-surface text-accent-ink' : 'border-dashed border-line-strong text-ink-muted')}>
                {done ? it.conj : '?'}
              </span>
            );
          })}
      </div>
    </section>
  );
}
