'use client';

import { Clock, TimerReset } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { speedScore } from '@/engine/kinds';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { InlineFeedback, isTypingTarget, Kbd, StepIntro, type StepProps } from '../shared';

type Flash = { ok: boolean; text: string; answer: string; item: number };

export function SpeedStep({ step, response, onChange, locked }: StepProps<'speed'>) {
  const calm = useCalmMotion();
  const finishSent = useRef(false);
  const [now, setNow] = useState(() => Date.now());
  const [flash, setFlash] = useState<Flash | null>(null);
  const [blocked, setBlocked] = useState(false);
  const active = !response.finished && (!response.clock || response.endsAt !== null);
  const currentIndex = response.answers.length % step.items.length;
  const current = step.items[currentIndex] ?? step.items[0];
  const stats = speedScore(response.answers);
  const remaining = response.clock && response.endsAt ? Math.max(0, response.endsAt - now) : null;
  const secondsLeft = remaining === null ? null : Math.ceil(remaining / 1000);
  const totalMs = step.seconds * 1000;
  const progress = remaining === null ? 1 : Math.max(0, Math.min(1, remaining / totalMs));

  const finish = (base = response) => {
    if (locked || base.finished || finishSent.current) return;
    finishSent.current = true;
    onChange({ ...base, finished: true });
  };

  useEffect(() => {
    if (!response.clock || response.finished || response.endsAt === null) return;
    if (Date.now() >= response.endsAt) finish();
  });

  useEffect(() => {
    if (!response.clock || response.finished || response.endsAt === null) return;
    const endsAt = response.endsAt;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endsAt) finish();
    }, 250);
    return () => clearInterval(id);
  });

  const start = (clock: boolean) => {
    if (locked) return;
    play('select');
    onChange({ kind: 'speed', answers: [], clock, endsAt: clock ? Date.now() + step.seconds * 1000 : null, finished: false });
  };

  const answer = (joined: boolean) => {
    if (!active || locked || blocked || response.finished || !current) return;
    if (response.clock && response.endsAt !== null && Date.now() >= response.endsAt) {
      finish();
      return;
    }
    const ok = joined === current.joined;
    const nextAnswers = [...response.answers, { item: currentIndex, ok }];
    const nextStats = speedScore(nextAnswers);
    const gain = nextStats.points - stats.points;
    const text = ok ? `+${gain}${gain > 10 ? ' · dubbel' : ''}` : `${current.joined ? 'Eén woord.' : 'Twee woorden.'} ${current.tip ?? ''}`;
    const next: StepProps<'speed'>['response'] = { ...response, answers: nextAnswers };
    const answerText = current.joined ? `${current.a}${current.b}` : `${current.a} ${current.b}`;
    setFlash({ ok, text, answer: answerText, item: currentIndex });
    play(ok ? 'right' : 'wrong');

    if (!response.clock && nextAnswers.length >= step.items.length) {
      onChange({ ...next, finished: true });
      return;
    }

    setBlocked(true);
    onChange(next);
    setTimeout(() => {
      setFlash(null);
      setBlocked(false);
    }, calm ? 120 : ok ? 380 : 900);
  };

  useEffect(() => {
    if (!active || locked || blocked) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      if (document.querySelector('[role="dialog"]')) return;
      if (event.key === 'ArrowLeft' || event.key === '1') {
        event.preventDefault();
        answer(true);
      }
      if (event.key === 'ArrowRight' || event.key === '2') {
        event.preventDefault();
        answer(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      {!active && !response.finished ? (
        <section className="mt-7 grid gap-4 rounded-card border-2 border-line bg-sunken p-5 sm:grid-cols-2 sm:p-6">
          <div className="sm:col-span-2">
            <p className="font-serif text-example text-ink">Eén rondje. Jij kiest het tempo.</p>
            <p className="mt-2 text-small font-semibold text-ink-soft">Met klok speel je {step.seconds} seconden. Zonder klok maak je elke combinatie één keer, rustig en zonder tijdsdruk.</p>
          </div>
          <Button type="button" size="lg" onClick={() => start(true)} className="min-h-20">
            <Clock aria-hidden className="size-5" />
            Start met klok
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => start(false)} className="min-h-20">
            <TimerReset aria-hidden className="size-5" />
            Zonder klok
          </Button>
        </section>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-3" aria-hidden={response.clock ? undefined : true}>
            {response.clock ? <Clock className="size-6 text-ink-muted" aria-hidden /> : <TimerReset className="size-6 text-ink-muted" aria-hidden />}
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-line shadow-[inset_0_2px_0_rgb(16_24_40/0.06)]">
              <motion.div className={cn('h-full rounded-full', (secondsLeft ?? 10) <= 5 ? 'bg-red' : 'bg-yellow')} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.1, ease: 'linear' }} />
            </div>
            <p className="min-w-14 text-right font-display text-body font-extrabold tabular-nums text-ink">{response.clock ? `${secondsLeft ?? step.seconds} s` : `${response.answers.length}/${step.items.length}`}</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <Stat label="Punten" value={stats.points} />
            <Stat label="Op rij" value={stats.combo} />
            <div className={cn('rounded-control border-2 p-3', stats.combo >= 2 ? 'border-yellow-line bg-yellow-soft text-yellow-ink' : 'border-line bg-surface text-ink')}>
              <p className="font-display text-caption font-extrabold tracking-[0.06em] uppercase">Volgende</p>
              <p className="mt-1 font-display text-[1.75rem] leading-none font-extrabold">{stats.combo >= 2 ? '×2' : '+10'}</p>
            </div>
          </div>

          <section className={cn('mt-4 grid min-h-48 place-items-center rounded-card border-2 bg-sunken p-5 text-center', flash?.ok && 'border-green-line bg-green-soft', flash && !flash.ok && 'border-red-line bg-red-soft')}>
            <AnimatePresence mode="wait" initial={false}>
              {response.finished ? (
                <motion.div key="done" initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={transition.base}>
                  <p className="font-display text-caption font-extrabold tracking-[0.08em] text-ink-muted uppercase">Tijd!</p>
                  <p className="mt-2 font-display text-[2.5rem] leading-none font-extrabold text-ink">{stats.points} punten</p>
                  <p className="mt-2 text-small font-bold text-ink-soft">Beste reeks: {stats.best} op rij</p>
                </motion.div>
              ) : flash ? (
                <motion.div key={`flash-${flash.item}-${flash.text}`} initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: transition.fast }} transition={transition.base}>
                  <p className={cn('rounded-control border-2 bg-surface px-5 py-2 font-serif text-example leading-tight', flash.ok ? 'border-green-line text-green-ink' : 'border-red-line text-red-ink')}>{flash.answer}</p>
                  <p className={cn('mt-3 text-small font-extrabold', flash.ok ? 'text-green-ink' : 'text-red-ink')}>{flash.text}</p>
                </motion.div>
              ) : current ? (
                <motion.div key={currentIndex} initial={calm ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: transition.fast }} transition={transition.base}>
                  <p className="flex flex-wrap items-center justify-center gap-3 font-serif text-[clamp(2rem,8vw,3.5rem)] leading-tight text-ink" lang="nl">
                    <span>{current.a}</span>
                    <span className="grid size-14 place-items-center rounded-control border-[3px] border-dashed border-line-strong bg-surface text-[0.75em] text-ink-muted">?</span>
                    <span>{current.b}</span>
                  </p>
                  <p className="mt-2 text-small font-bold text-ink-muted">Eén woord of twee?</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </section>

          {!response.finished && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button type="button" variant="secondary" size="lg" disabled={locked || blocked} onClick={() => answer(true)} className="min-h-20 text-[1.35rem]">
                aan elkaar
              </Button>
              <Button type="button" variant="secondary" size="lg" disabled={locked || blocked} onClick={() => answer(false)} className="min-h-20 text-[1.35rem]">
                los
              </Button>
            </div>
          )}

          <InlineFeedback tone={flash?.ok ? 'right' : 'wrong'} id={`${flash?.item}:${flash?.text}`} className="mt-4">
            {flash?.text}
          </InlineFeedback>
          {!locked && !response.finished && (
            <p className="mt-3 hidden items-center justify-center gap-1.5 text-caption font-semibold text-ink-muted sm:flex">
              <Kbd>←</Kbd> of <Kbd>1</Kbd> aan elkaar · <Kbd>→</Kbd> of <Kbd>2</Kbd> los
            </p>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-control border-2 border-line bg-surface p-3 text-ink">
      <p className="font-display text-caption font-extrabold tracking-[0.06em] text-ink-muted uppercase">{label}</p>
      <p className="mt-1 font-display text-[1.75rem] leading-none font-extrabold tabular-nums">{value}</p>
    </div>
  );
}
