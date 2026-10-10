'use client';

import { MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { Button } from '@/components/ui/button';
import { InlineFeedback, StepIntro, type StepProps } from '../shared';

type Feedback = { id: string; ok: boolean; text: string };

export function ChatStep({ step, response, onChange, locked }: StepProps<'chat'>) {
  const calm = useCalmMotion();
  const [typing, setTyping] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const visibleIncoming = typing ? response.picks.length : Math.min(response.picks.length + 1, step.rounds.length);

  useEffect(() => {
    if (!typing) return;
    const timer = window.setTimeout(() => setTyping(false), 1200);
    return () => window.clearTimeout(timer);
  }, [typing]);

  useEffect(() => () => setTyping(false), []);

  const messages = useMemo(() => {
    const list: Array<{ key: string; side: 'in' | 'out'; text: string; note?: string }> = [];
    step.rounds.forEach((round, i) => {
      if (i < visibleIncoming) list.push({ key: `in-${i}`, side: 'in', text: round.say });
      const pick = response.picks[i];
      if (pick !== undefined) {
        const wrong = pick !== round.right;
        list.push({ key: `out-${i}`, side: 'out', text: round.options[round.right] ?? '', note: wrong ? `verbeterd voor het versturen: ${round.fix}` : undefined });
      }
    });
    if (response.picks.length >= step.rounds.length) list.push({ key: 'bye', side: 'in', text: step.bye });
    return list;
  }, [response.picks, step.bye, step.rounds, visibleIncoming]);

  const current = step.rounds[response.picks.length];
  const pick = (index: number) => {
    if (locked || typing || !current) return;
    const ok = index === current.right;
    play(ok ? 'right' : 'wrong');
    const next = { ...response, picks: [...response.picks, index] };
    onChange(next);
    setFeedback({ id: `pick-${response.picks.length}-${index}`, ok, text: `${ok ? 'Goed gekozen.' : 'Dat was de andere.'} ${current.why}` });
    if (next.picks.length < step.rounds.length) setTyping(true);
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <section className="mt-6 overflow-hidden rounded-card border-2 border-purple-line bg-purple-soft/50 shadow-[inset_0_2px_0_rgb(255_255_255/0.7)]" aria-label={`Chat met ${step.contact.name}`}>
        <header className="flex items-center gap-3 border-b-2 border-purple-line bg-surface px-4 py-3">
          <span className="grid size-10 place-items-center rounded-full bg-purple text-purple-on font-display font-extrabold shadow-[0_3px_0_var(--color-purple-deep)]">
            {step.contact.initials ?? step.contact.name.slice(0, 1)}
          </span>
          <div>
            <h2 className="font-display text-body font-extrabold text-ink">{step.contact.name}</h2>
            <p role="status" className="text-caption font-semibold text-purple-ink">{typing ? `${step.contact.name} typt …` : 'online'}</p>
          </div>
        </header>
        <div className="flex min-h-[18rem] flex-col justify-end gap-3 overflow-y-auto px-4 py-5">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.key}
                initial={calm ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={transition.base}
                className={cn('max-w-[82%]', message.side === 'out' && 'self-end text-right')}
              >
                <p className={cn('rounded-[1.35rem] border-2 px-4 py-2.5 text-body shadow-[0_2px_0_rgb(16_24_40/0.08)]', message.side === 'in' ? 'rounded-bl-sm border-line bg-surface text-ink' : 'rounded-br-sm border-purple-line bg-purple-soft text-purple-ink')}>
                  {message.text}
                </p>
                {message.note && <p className="mt-1 text-caption font-bold text-red-ink">{message.note}</p>}
              </motion.div>
            ))}
            {typing && (
              <motion.div key="typing" className="flex items-center gap-1 self-start rounded-[1.35rem] rounded-bl-sm border-2 border-line bg-surface px-4 py-3 text-purple-ink" aria-label={`${step.contact.name} typt`}>
                {[0, 1, 2].map((dot) => <span key={dot} className="size-2 rounded-full bg-purple [animation:chatBlink_1.2s_infinite]" style={{ animationDelay: `${dot * 0.2}s` }} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <style jsx>{`@keyframes chatBlink{0%,80%,100%{opacity:.25}40%{opacity:1}}`}</style>

      <InlineFeedback className="mt-4" tone={feedback ? (feedback.ok ? 'right' : 'wrong') : 'info'} id={feedback?.id}>
        {feedback?.text}
      </InlineFeedback>

      {current && !locked && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {current.options.map((option, i) => (
            <Button key={option} variant="secondary" size="lg" disabled={typing} onClick={() => pick(i)} className="h-auto justify-start py-4 text-left font-serif text-[1.15rem] leading-snug">
              <MessageCircle aria-hidden className="size-5" />
              <span>{option}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
