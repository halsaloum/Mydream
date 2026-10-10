'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { Button } from '@/components/ui/button';
import { InlineFeedback, StepIntro, type StepProps } from '../shared';

type Mood = 'neutral' | 'happy' | 'flat';
type Feedback = { id: string; tone: 'right' | 'wrong' | 'info'; text: string };

export function IntentStep({ step, response, onChange, locked }: StepProps<'intent'>) {
  const calm = useCalmMotion();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [bad, setBad] = useState<number | null>(null);
  const round = step.rounds[response.round] ?? step.rounds[0];
  const solved = response.done.includes(response.round);
  const mood: Mood = solved ? 'happy' : bad !== null ? 'flat' : 'neutral';

  const pick = (index: number) => {
    if (locked || solved || !round) return;
    const ok = index === round.right;
    if (ok) {
      play('right');
      const done = response.done.includes(response.round) ? response.done : [...response.done, response.round];
      onChange({ ...response, done });
      setFeedback({ id: `right-${response.round}-${index}`, tone: 'right', text: round.why });
      return;
    }
    play('wrong');
    setBad(index);
    window.setTimeout(() => setBad((value) => (value === index ? null : value)), 450);
    onChange({ ...response, mistakes: response.mistakes + 1 });
    setFeedback({ id: `wrong-${response.round}-${index}-${response.mistakes + 1}`, tone: 'wrong', text: round.literal });
  };

  const next = () => {
    if (!solved || locked) return;
    play('tap');
    const nextRound = Math.min(response.round + 1, step.rounds.length - 1);
    onChange({ ...response, round: nextRound });
    setFeedback(null);
    setBad(null);
  };

  if (!round) return <div><StepIntro prompt={step.prompt} intro={step.intro} /></div>;

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <motion.section
        key={response.round}
        initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transition.base}
        className="mt-6 rounded-card border-2 border-orange-line bg-orange-soft/45 p-4 sm:p-6"
      >
        <div className="grid gap-5 md:grid-cols-[12rem_1fr] md:items-center">
          <NoorFace mood={mood} />
          <div className="grid gap-4">
            <Bubble label="Zegt" text={round.says} />
            <Bubble label="Bedoelt" text={solved ? round.means : '?'} active={solved} />
          </div>
        </div>
      </motion.section>

      <InlineFeedback className="mt-4" tone={feedback?.tone ?? 'info'} id={feedback?.id}>
        {feedback?.text ?? (!solved ? 'Let op het verschil tussen de vraag en wat ze nodig heeft.' : '')}
      </InlineFeedback>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {round.replies.map((reply, i) => {
          const state = solved && i === round.right ? 'right' : bad === i ? 'wrong' : 'idle';
          return (
            <motion.button
              key={reply}
              type="button"
              disabled={locked || solved}
              onClick={() => pick(i)}
              animate={bad === i && !calm ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={transition.fast}
              className={cn('min-h-14 rounded-tile border-2 px-4 py-3 text-left font-serif text-[1.2rem] leading-snug outline-none transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus', state === 'right' ? 'border-green bg-green-soft text-green-ink' : state === 'wrong' ? 'border-red bg-red-soft text-red-ink' : 'border-line bg-surface text-ink shadow-slab-sm hover:border-orange-line')}
            >
              {reply}
            </motion.button>
          );
        })}
      </div>

      {solved && response.round < step.rounds.length - 1 && !locked && (
        <Button className="mt-5" variant="accent" onClick={next}>Volgende <ArrowRight aria-hidden className="size-5" /></Button>
      )}
    </div>
  );
}

function Bubble({ label, text, active = false }: { label: string; text: string; active?: boolean }) {
  return (
    <div className={cn('rounded-card border-2 p-4', active ? 'border-orange bg-orange-soft' : 'border-line bg-surface')}>
      <p className="font-display text-caption font-extrabold uppercase tracking-[0.08em] text-ink-muted">{label}</p>
      <p className={cn('mt-1 font-serif text-example text-ink', active && 'text-orange-ink')}>{text}</p>
    </div>
  );
}

function NoorFace({ mood }: { mood: Mood }) {
  const label = mood === 'happy' ? 'Noor kijkt blij' : mood === 'flat' ? 'Noor kijkt verbaasd' : 'Noor wacht op je antwoord';
  return (
    <div className="grid justify-items-center gap-2">
      <svg role="img" aria-label={label} viewBox="0 0 160 160" className="h-40 w-40 drop-shadow-sm">
        <circle cx="80" cy="82" r="58" fill="#fff7ed" stroke="#ff9600" strokeWidth="5" />
        <path d="M38 79c4-34 25-54 53-51 25 2 42 21 43 50-14-18-39-20-58-11-15 7-26 9-38 12Z" fill="#5b3a1f" />
        <circle cx="58" cy="82" r="6" fill="#23262d" />
        <circle cx="102" cy="82" r="6" fill="#23262d" />
        {mood === 'flat' ? <path d="M49 64h20M92 64h20" stroke="#23262d" strokeWidth="5" strokeLinecap="round" /> : <path d="M48 67c7-5 14-5 21 0M91 67c7-5 14-5 21 0" stroke="#23262d" strokeWidth="5" strokeLinecap="round" fill="none" />}
        {mood === 'happy' && <path d="M56 105c12 14 36 14 48 0" stroke="#23262d" strokeWidth="6" strokeLinecap="round" fill="none" />}
        {mood === 'neutral' && <path d="M62 108c10 5 26 5 36 0" stroke="#23262d" strokeWidth="5" strokeLinecap="round" fill="none" />}
        {mood === 'flat' && <path d="M63 109h34" stroke="#23262d" strokeWidth="5" strokeLinecap="round" />}
      </svg>
      <p className="font-display text-body font-extrabold text-orange-ink">{label}</p>
    </div>
  );
}
