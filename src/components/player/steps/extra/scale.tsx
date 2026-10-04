'use client';

import { Scale as ScaleIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { scaleSum } from '@/engine/kinds';
import { cn } from '@/lib/cn';
import { spring, transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { InlineFeedback, StepIntro, type StepProps } from '../shared';

type Feedback = { id: string; tone: 'right' | 'wrong' | 'info'; text: string };

export function ScaleStep({ step, response, onChange, locked }: StepProps<'scale'>) {
  const calm = useCalmMotion();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [bad, setBad] = useState<string | null>(null);
  const sum = scaleSum(step, response.on);
  const angle = Math.max(-14, Math.min(14, (step.doubt - sum) * 4));
  const status = sum > step.doubt ? 'de schaal slaat door' : sum === step.doubt ? 'precies in evenwicht' : 'de twijfel wint nog';

  const toggle = (id: string) => {
    if (locked) return;
    const arg = step.args.find((item) => item.id === id);
    if (!arg) return;
    if (response.on.includes(id)) {
      play('remove');
      onChange({ ...response, on: response.on.filter((item) => item !== id) });
      setFeedback({ id: `remove-${id}-${response.on.length}`, tone: 'right', text: 'Van de schaal gehaald.' });
      return;
    }
    if (response.on.length >= step.max) {
      play('wrong');
      setBad(id);
      window.setTimeout(() => setBad((value) => (value === id ? null : value)), 450);
      onChange({ ...response, mistakes: response.mistakes + 1 });
      setFeedback({ id: `full-${id}-${response.mistakes + 1}`, tone: 'wrong', text: 'Er passen maar twee argumenten op de schaal. Haal er eerst één af.' });
      return;
    }
    const weak = arg.w < 2;
    play(weak ? 'wrong' : 'place');
    onChange({ ...response, on: [...response.on, id], mistakes: response.mistakes + (weak ? 1 : 0) });
    setFeedback({ id: `add-${id}-${response.on.length}-${response.mistakes}`, tone: weak ? 'wrong' : 'right', text: arg.why });
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <section className="mt-6 rounded-card border-2 border-orange-line bg-orange-soft/45 p-4 sm:p-6" aria-label="Weegschaal">
        <div className="grid gap-5 lg:grid-cols-[1fr_15rem] lg:items-center">
          <div className="overflow-hidden rounded-card border-2 border-line bg-surface p-4">
            <BalanceSvg angle={calm ? 0 : angle} sum={sum} doubt={step.doubt} selected={response.on.map((id) => step.args.find((arg) => arg.id === id)).filter((arg): arg is NonNullable<typeof arg> => Boolean(arg))} />
          </div>
          <div className="rounded-card border-2 border-line bg-sunken p-4">
            <ScaleIcon aria-hidden className="size-8 text-orange-ink" />
            <p role="status" className="mt-3 font-display text-title-sm font-extrabold text-ink">{sum > step.doubt ? 'De lezer is overtuigd.' : status}</p>
            <p className="mt-2 text-small font-semibold text-ink-muted">Jouw gewicht: {sum}. Twijfel: {step.doubt}.</p>
          </div>
        </div>
      </section>

      <InlineFeedback className="mt-4" tone={feedback?.tone ?? 'info'} id={feedback?.id}>
        {feedback?.text}
      </InlineFeedback>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {step.args.map((arg) => {
          const on = response.on.includes(arg.id);
          return (
            <motion.button
              key={arg.id}
              type="button"
              aria-pressed={on}
              disabled={locked}
              onClick={() => toggle(arg.id)}
              animate={bad === arg.id && !calm ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={transition.fast}
              className={cn('min-h-28 rounded-tile border-2 p-4 text-left outline-none transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus', on ? 'border-orange bg-orange-soft shadow-[0_4px_0_var(--color-orange-deep)]' : 'border-line bg-surface shadow-slab-sm hover:border-orange-line')}
            >
              <span className="font-display text-caption font-extrabold uppercase tracking-[0.08em] text-orange-ink">{arg.type} · weegt {arg.w}</span>
              <span className="mt-2 block font-serif text-[1.15rem] leading-snug text-ink">{arg.t}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function BalanceSvg({ angle, sum, doubt, selected }: { angle: number; sum: number; doubt: number; selected: Array<{ id: string; type: string; w: number }> }) {
  return (
    <svg viewBox="0 0 520 280" className="h-auto w-full" aria-hidden="true">
      <path d="M260 74v142M212 232h96M230 216h60" stroke="#23262d" strokeWidth="10" strokeLinecap="round" />
      <circle cx="260" cy="72" r="14" fill="#23262d" />
      <motion.g style={{ transformOrigin: '260px 72px' }} animate={{ rotate: angle }} transition={spring.layout}>
        <path d="M122 72h276" stroke="#23262d" strokeWidth="10" strokeLinecap="round" />
        <path d="M150 74l-42 76M150 74l42 76M370 74l-42 76M370 74l42 76" stroke="#5f6570" strokeWidth="4" strokeLinecap="round" />
        <g>
          <path d="M82 152h136c-11 34-125 34-136 0Z" fill="#fff4e5" stroke="#ff9600" strokeWidth="5" />
          {selected.map((arg, i) => <WeightBlock key={arg.id} x={108 + i * 58} y={132 - i * 18} w={arg.w} label={arg.type} />)}
        </g>
        <g>
          <path d="M302 152h136c-11 34-125 34-136 0Z" fill="#f2f3f5" stroke="#5b6b82" strokeWidth="5" />
          <rect x="348" y={130 - doubt * 5} width="44" height={22 + doubt * 5} rx="8" fill="#5b6b82" />
          <text x="370" y="151" textAnchor="middle" fill="white" fontWeight="800" fontSize="14">twijfel</text>
        </g>
      </motion.g>
      <text x="260" y="268" textAnchor="middle" fill="#454a54" fontWeight="800" fontSize="18">gewicht {sum} tegenover twijfel {doubt}</text>
    </svg>
  );
}

function WeightBlock({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  const width = w === 3 ? 56 : w === 2 ? 50 : 44;
  const fill = w === 3 ? '#ffb84d' : w === 2 ? '#ffd08a' : w === 1 ? '#ffe6bf' : '#f4f4f4';
  return (
    <motion.g initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={transition.base}>
      <rect x={x} y={y} width={width} height="28" rx="8" fill={fill} stroke="#a66200" strokeWidth="3" />
      <text x={x + width / 2} y={y + 19} textAnchor="middle" fill="#7a4300" fontWeight="800" fontSize="10">{label}</text>
    </motion.g>
  );
}
