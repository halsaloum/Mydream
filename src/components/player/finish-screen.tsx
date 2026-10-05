'use client';

import { ArrowRight, Check, Clock3, Flame, RotateCcw, Target } from 'lucide-react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import type { Route } from 'next';
import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';
import type { SessionSummary } from '@/engine/session';
import { Pim, type PimMood } from '@/components/brand/pim';
import { Button, ButtonLink } from '@/components/ui/button';
import { celebrate } from '@/lib/confetti';
import { cn } from '@/lib/cn';
import { ease, transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { ToyCanvas } from '@/lib/toy3d/toy-canvas';

const loadReward = () => import('@/lib/toy3d/scenes/reward').then((module) => module.rewardScene);

export type FinishAction = { label: string; href: Route; onNavigate?: () => void };

type FinishScreenProps = {
  mode: 'lesson' | 'review' | 'demo';
  title: string;
  context?: string;
  summary: SessionSummary;
  learned: string[];
  /** Alleen bij een afronding tijdens dit bezoek; niet na verversen. */
  celebrate: boolean;
  primary: FinishAction;
  secondary?: FinishAction;
  onRestart?: () => void;
};

function message(mode: FinishScreenProps['mode'], accuracy: number, graded: number): string {
  if (mode === 'demo') return 'Dit was een voorbeeld; het telt niet mee voor je voortgang.';
  if (graded === 0) return 'Uitleg gelezen en uitgeprobeerd.';
  if (mode === 'review') return accuracy >= 90 ? 'Je oefenpunten zitten erin.' : 'Wat nog niet lukte, komt later nog eens terug.';
  if (accuracy >= 90) return 'Dit zit erin.';
  if (accuracy >= 60) return 'Goed gedaan. Nog een keer maakt het vast.';
  return 'Je fouten komen straks terug in de herhaling. Zo leer je het.';
}

function mood(accuracy: number): PimMood {
  return accuracy >= 90 ? 'cheer' : accuracy >= 60 ? 'happy' : 'think';
}

function duration(ms: number): string {
  const total = Math.round(ms / 1000);
  if (total < 60) return `${Math.max(total, 1)} s`;
  const min = Math.round(total / 60);
  return `${min} min`;
}

const RING = 2 * Math.PI * 52;

export function FinishScreen({ mode, title, context, summary, learned, celebrate: party, primary, secondary, onRestart }: FinishScreenProps) {
  const calm = useCalmMotion();
  const accuracy = summary.accuracy;
  const shown = useMotionValue(calm || !party ? accuracy : 0);
  const rounded = useTransform(shown, (value) => Math.round(value));

  useEffect(() => {
    if (!party) return;
    play('win');
    void celebrate('lesson');
  }, [party]);

  useEffect(() => {
    if (calm || !party) {
      shown.set(accuracy);
      return;
    }
    const controls = animate(shown, accuracy, { duration: 0.9, delay: 0.35, ease: ease.out });
    return () => controls.stop();
  }, [accuracy, calm, party, shown]);

  const rise = (i: number) =>
    calm || !party
      ? {}
      : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { ...transition.slow, delay: 0.25 + i * 0.08 } };

  return (
    <div className="mx-auto w-full max-w-lg px-gutter pt-10 pb-12 text-center sm:pt-14">
      <div className="flex items-center justify-center gap-2 sm:gap-6">
        <div className="relative size-40 shrink-0">
          <svg viewBox="0 0 120 120" aria-hidden className="absolute inset-0 -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-line)" strokeWidth="10" />
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING}
              initial={{ strokeDashoffset: calm || !party ? RING * (1 - accuracy / 100) : RING }}
              animate={{ strokeDashoffset: RING * (1 - accuracy / 100) }}
              transition={calm || !party ? { duration: 0 } : { duration: 0.9, delay: 0.35, ease: ease.out }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <p aria-hidden className="font-display text-[2.6rem] leading-none font-extrabold tracking-[-0.03em] text-accent-ink tabular-nums">
              <motion.span>{rounded}</motion.span>%
            </p>
          </div>
        </div>
        <ToyCanvas
          load={loadReward}
          props={{ thing: accuracy >= 60 || summary.graded === 0 ? 'ster' : 'pim', drop: party && !calm }}
          label={accuracy >= 60 || summary.graded === 0 ? 'Een gouden ster als beloning.' : 'Pim het potlood.'}
          className="size-40 shrink-0"
          fallback={
            <div className="grid size-full place-items-center">
              <Pim mood={mood(accuracy)} size="lg" reactKey="klaar" />
            </div>
          }
        />
      </div>
      <p className="sr-only">{`${accuracy} procent in één keer goed.`}</p>

      <motion.div {...rise(0)}>
        {context && <p className="mt-7 text-small font-bold text-accent-ink">{context}</p>}
        <h1 className={cn('font-serif text-headline leading-tight text-ink', context ? 'mt-1' : 'mt-7')}>{title}</h1>
        <p className="mt-3 text-lead text-ink-muted">{message(mode, accuracy, summary.graded)}</p>
      </motion.div>

      <motion.dl {...rise(1)} className="mt-8 grid grid-cols-3 gap-2.5 text-left">
        <Stat icon={<Target aria-hidden className="size-4" strokeWidth={2.5} />} label="In één keer goed">
          {summary.graded ? `${summary.firstTryCorrect}/${summary.graded}` : '–'}
        </Stat>
        <Stat icon={<Clock3 aria-hidden className="size-4" strokeWidth={2.5} />} label="Actieve tijd">
          {duration(summary.activeMs)}
        </Stat>
        <Stat icon={<Flame aria-hidden className="size-4" strokeWidth={2.5} />} label="Beste reeks">
          {summary.bestCombo}
        </Stat>
      </motion.dl>

      {mode !== 'demo' && summary.missed.length > 0 && (
        <motion.p {...rise(2)} className="mt-4 rounded-tile border-2 border-orange-line bg-orange-soft px-4 py-3 text-left text-small font-semibold text-orange-ink">
          {summary.missed.length === 1 ? 'Eén opdracht staat' : `${summary.missed.length} opdrachten staan`} klaar in je{' '}
          <Link href="/herhalen" className="underline decoration-2 underline-offset-4 hover:text-ink">
            herhaalstapel
          </Link>
          .
        </motion.p>
      )}

      {learned.length > 0 && (
        <motion.section {...rise(3)} className="mt-6 rounded-card border-2 border-line bg-surface p-5 text-left shadow-slab">
          <h2 className="font-display text-title-sm font-bold text-ink">Wat je nu weet</h2>
          <ul className="mt-3 space-y-2.5">
            {learned.map((item, i) => (
              <motion.li
                key={item}
                initial={calm || !party ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transition.base, delay: calm || !party ? 0 : 0.5 + i * 0.1 }}
                className="flex items-center gap-3 font-semibold text-ink"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-accent-on">
                  <Check aria-hidden className="size-3.5" strokeWidth={3.5} />
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.section>
      )}

      <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
        {secondary && (
          <ButtonLink href={secondary.href} variant="secondary" size="lg" onClick={secondary.onNavigate}>
            {secondary.label}
          </ButtonLink>
        )}
        <ButtonLink href={primary.href} variant="primary" size="lg" onClick={primary.onNavigate} data-finish-primary>
          {primary.label}
          <ArrowRight aria-hidden className="size-5" strokeWidth={2.75} />
        </ButtonLink>
      </div>
      {onRestart && (
        <Button variant="ghost" size="sm" className="mt-4" onClick={onRestart}>
          <RotateCcw aria-hidden className="size-4" strokeWidth={2.5} />
          {mode === 'review' ? 'Nog een ronde' : 'Les opnieuw doen'}
        </Button>
      )}
    </div>
  );
}

function Stat({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="rounded-tile border-2 border-line bg-surface px-3.5 py-3">
      <dt className="flex items-center gap-1.5 text-caption font-bold text-ink-muted">
        <span className="text-accent-ink">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 font-display text-title-sm font-extrabold text-ink tabular-nums">{children}</dd>
    </div>
  );
}
