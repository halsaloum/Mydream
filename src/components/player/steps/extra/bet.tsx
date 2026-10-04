"use client";

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useId } from 'react';
import { betConsequence } from '@/engine/kinds';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { StepIntro, type StepProps } from '../shared';

const BETS = [
  { value: 1 as const, label: 'Ik gok' },
  { value: 2 as const, label: 'Vrij zeker' },
  { value: 3 as const, label: 'Heel zeker' },
];

function CoinStack({ count, lost = false }: { count: 1 | 2 | 3; lost?: boolean }) {
  return (
    <span aria-hidden className="relative flex h-7 w-14 items-center justify-center">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={cn('absolute size-6 drop-shadow-sm', lost && 'opacity-70')} style={{ left: `${14 + i * 8}px` }}>
          <circle cx="12" cy="12" r="9" fill="var(--color-yellow)" stroke="var(--color-yellow-deep)" strokeWidth="2" />
          <path d="M8 12h8M12 7v10" stroke="var(--color-yellow-deep)" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        </svg>
      ))}
    </span>
  );
}

export function BetStep({ step, response, onChange, locked, correct }: StepProps<'bet'>) {
  const calm = useCalmMotion();
  const answerId = useId();
  const betId = useId();
  const selected = response.value;
  const chosenBet = response.bet;
  const resolvedCorrect = locked ? (correct ?? selected === step.answer) : null;
  const delta = chosenBet ?? 0;
  const shownPoints = locked && resolvedCorrect !== null ? 12 + (resolvedCorrect ? delta : -delta) : 12;

  const chooseValue = (value: string) => {
    if (locked) return;
    play('select');
    onChange({ ...response, value });
  };

  const chooseBet = (value: string) => {
    if (locked) return;
    const n = Number(value);
    if (n !== 1 && n !== 2 && n !== 3) return;
    play('select');
    onChange({ ...response, bet: n });
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <StepIntro prompt={step.prompt} intro={step.intro ?? 'Kies eerst je antwoord. Zeg daarna hoe zeker je bent.'} />
        <motion.p
          key={`${shownPoints}:${locked}`}
          initial={locked && !calm ? { y: resolvedCorrect ? -8 : 0, scale: 0.96 } : false}
          animate={locked && !calm && resolvedCorrect === false ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0, y: 0, scale: 1 }}
          transition={transition.base}
          className="inline-flex items-center gap-2 rounded-chip bg-yellow-soft px-3.5 py-2 font-display text-small font-extrabold text-yellow-ink"
        >
          <CoinStack count={(chosenBet ?? 1) as 1 | 2 | 3} lost={locked && resolvedCorrect === false} />
          {shownPoints} punten
        </motion.p>
      </div>

      <RadioGroup aria-labelledby={answerId} value={selected ?? ''} onValueChange={(value) => chooseValue(String(value))} readOnly={locked} className="mt-6 grid gap-3">
        <h2 id={answerId} className="sr-only">Antwoorden</h2>
        {step.options.map((option) => {
          const isAnswer = option === step.answer;
          const isChosen = option === selected;
          const verdict = locked ? (isAnswer ? 'right' : isChosen ? 'wrong' : 'other') : null;
          return (
            <Radio.Root
              key={option}
              value={option}
              className={cn(
                'group slab pressable flex min-h-16 items-center justify-between gap-4 rounded-tile border-2 px-4 py-3.5 text-left [--lift:4px]',
                !verdict && 'border-line bg-surface [--slab:var(--color-line-strong)] hover:border-line-strong data-[checked]:border-blue-line data-[checked]:bg-blue-soft data-[checked]:[--slab:var(--color-blue)]',
                verdict === 'right' && 'border-green bg-green-soft text-green-ink [--slab:var(--color-green)]',
                verdict === 'wrong' && 'border-red bg-red-soft text-red-ink [--slab:var(--color-red)]',
                verdict === 'other' && 'border-line bg-surface opacity-55 shadow-none',
                locked && 'pointer-events-none',
              )}
            >
              <span className="font-serif text-[1.22rem] leading-snug text-ink group-data-[checked]:text-blue-ink sm:text-[1.35rem]">{option}</span>
              {verdict === 'right' && <span className="inline-flex items-center gap-1.5 font-display text-caption font-extrabold text-green-ink"><Check className="size-4" strokeWidth={3.25} /> juist</span>}
              {verdict === 'wrong' && <span className="inline-flex items-center gap-1.5 font-display text-caption font-extrabold text-red-ink"><X className="size-4" strokeWidth={3.25} /> jouw keuze</span>}
            </Radio.Root>
          );
        })}
      </RadioGroup>

      <section className="mt-7" aria-labelledby={betId}>
        <h2 id={betId} className="font-display text-title-sm font-extrabold text-ink">Hoe zeker ben je?</h2>
        <RadioGroup value={chosenBet ? String(chosenBet) : ''} onValueChange={(value) => chooseBet(String(value))} readOnly={locked} className="mt-3 grid gap-3 sm:grid-cols-3">
          {BETS.map((bet) => (
            <Radio.Root
              key={bet.value}
              value={String(bet.value)}
              className={cn(
                'group slab pressable flex min-h-24 flex-col items-center justify-center gap-1 rounded-tile border-2 px-3 py-3 text-center [--lift:4px]',
                'border-line bg-surface [--slab:var(--color-line-strong)] hover:border-line-strong data-[checked]:border-yellow-line data-[checked]:bg-yellow-soft data-[checked]:[--slab:var(--color-yellow-deep)]',
                locked && 'pointer-events-none',
              )}
            >
              <CoinStack count={bet.value} />
              <span className="font-display text-body font-extrabold text-ink group-data-[checked]:text-yellow-ink">{bet.label}</span>
              <span className="text-caption font-bold text-ink-muted">inzet {bet.value}</span>
            </Radio.Root>
          ))}
        </RadioGroup>
      </section>

      <p
        role="status"
        className={cn(
          'mt-5 rounded-card border-2 px-4 py-3.5 text-small font-bold',
          locked ? (resolvedCorrect ? 'border-green-line bg-green-soft text-green-ink' : 'border-red-line bg-red-soft text-red-ink') : 'border-line bg-sunken text-ink-muted',
        )}
      >
        {locked && chosenBet && resolvedCorrect !== null
          ? betConsequence(resolvedCorrect, chosenBet)
          : 'Twijfel je? Zet dan weinig in. Zo leer je ook hoe goed je iets echt weet.'}
      </p>
    </div>
  );
}
