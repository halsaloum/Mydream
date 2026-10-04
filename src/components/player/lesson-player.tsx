'use client';

import { ArrowRight, BookOpen, Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Route } from 'next';
import Link from 'next/link';
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import type { Accent } from '@/content/accent';
import type { Domain, Layer, Step } from '@/content/schema';
import { evaluate, expectedAnswer, isComplete, isPanelReady } from '@/engine/grade';
import { extraFeedback, extraProgress, isExtraKind, stepMode, type ExtraResponse } from '@/engine/kinds';
import type { Response } from '@/engine/responses';
import { currentKey, currentResponse, isRetry, sessionProgress, summarize, type SessionState } from '@/engine/session';
import { Pim } from '@/components/brand/pim';
import { Button, type ButtonVariant } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { celebrate, originOf } from '@/lib/confetti';
import { cn } from '@/lib/cn';
import { scrollToTop, transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { gotoPanel } from './explain/explain-step';
import { FinishScreen, type FinishAction } from './finish-screen';
import { LayerTag, RetryBadge, ReviewSource } from './layer-tag';
import { lessonRules, RuleSheet } from './rule-sheet';
import { StepView } from './step-view';
import { Kbd } from './steps/shared';
import type { PlayerController } from './use-session';

export type PlayerMeta = {
  mode: 'lesson' | 'review' | 'demo';
  title: string;
  /** Korte context boven de titel in de kop, bv. het vakgebied. */
  context?: string;
  accent: Accent;
  exit: { href: Route; label: string };
  finish: { title: string; context?: string; primary: FinishAction; secondary?: FinishAction; learned: string[] };
  /** Niveau en vakgebied, getoond bij de eerste stap. */
  tag?: { layer: Layer; layerIndex: number; domain: Domain };
};

const PRAISE = ['Precies!', 'Klopt!', 'Mooi zo!', 'Helemaal goed!'];

const now = () => Date.now();

type Primary = { label: string; enabled: boolean; variant: ButtonVariant; run: () => void };

function waitingHint(step: Step, response: Response): string {
  if (isExtraKind(step.kind) && stepMode(step) === 'task') return extraProgress(step, response as ExtraResponse) ?? '';
  switch (step.kind) {
    case 'choice':
    case 'combine':
    case 'bet':
      return 'Kies je antwoord';
    case 'type':
    case 'fix':
    case 'rewrite':
    case 'dictation':
      return 'Typ je antwoord';
    case 'order':
    case 'paragraph':
      return 'Leg alle kaartjes neer';
    case 'sort':
      return 'Sorteer alle kaartjes';
    case 'write':
      return 'Haal alle taakeisen';
    default:
      return '';
  }
}

function isActivatable(target: HTMLElement): boolean {
  const role = target.getAttribute('role');
  if (role === 'radio') return false;
  return ['BUTTON', 'A', 'SELECT', 'SUMMARY'].includes(target.tagName) || ['button', 'link', 'switch', 'checkbox', 'option', 'tab', 'slider', 'menuitem'].includes(role ?? '');
}

/**
 * De lesplayer. Eén hoofdactie onderaan; feedback blijft staan tot de leerling verdergaat.
 * De sessie (bewaard of los) komt van buiten, zodat dezelfde player lessen, herhaling en
 * voorbeelden speelt.
 */
export function LessonPlayer({ controller, meta }: { controller: PlayerController; meta: PlayerMeta }) {
  const { session, dispatch, lookup } = controller;
  const calm = useCalmMotion();
  const primaryRef = useRef<HTMLButtonElement>(null);
  const ruleOpener = useRef<HTMLElement | null>(null);
  const [rulesOpen, setRulesOpen] = useState(false);

  const key = session ? currentKey(session) : undefined;
  const item = key ? lookup(key) : undefined;
  const response = session && item ? currentResponse(session, item) : null;
  const phase = session?.phase;
  const pos = session?.pos ?? 0;

  // Geluid, beloning en focus bij overgangen; niet bij het laden of verversen.
  const last = useRef<string | null | undefined>(undefined);
  const [firstPhase, setFirstPhase] = useState<SessionState['phase'] | null>(null);
  if (session && firstPhase === null) setFirstPhase(session.phase);
  useEffect(() => {
    if (!session) return;
    const token = `${session.pos}:${session.phase}`;
    if (last.current === undefined) {
      last.current = token;
      return;
    }
    if (token === last.current) return;
    last.current = token;
    if (session.phase === 'feedback') {
      const right = session.lastCorrect === true;
      play(right ? 'right' : 'wrong');
      if (right && session.combo >= 2) void celebrate(session.combo >= 4 ? 'answer' : 'spark', originOf(primaryRef.current));
      primaryRef.current?.focus({ preventScroll: true });
    } else if (session.phase === 'answering') {
      scrollToTop();
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-step-pos="${session.pos}"] [data-step-heading]`)?.focus({ preventScroll: true });
      });
    }
  }, [session]);

  const advance = () => dispatch({ type: 'advance', now: now() });
  const check = () => dispatch({ type: 'check', now: now() });
  const respond = (next: Response) => dispatch({ type: 'respond', response: next, now: now() });

  let primary: Primary = { label: 'Doorgaan', enabled: false, variant: 'accent', run: () => {} };
  if (session && item && response) {
    const mode = stepMode(item.step);
    if (phase === 'feedback') {
      primary = { label: 'Doorgaan', enabled: true, variant: session.lastCorrect ? 'primary' : 'danger', run: advance };
    } else if (item.step.kind === 'explain' && response.kind === 'explain') {
      const step = item.step;
      const index = Math.min(response.panel, step.panels.length - 1);
      const panel = step.panels[index]!;
      const lastPanel = index === step.panels.length - 1;
      if (!isPanelReady(panel, index, response)) primary = { label: 'Doe eerst de opdracht', enabled: false, variant: 'accent', run: () => {} };
      else if (!lastPanel)
        primary = {
          label: 'Volgende deel',
          enabled: true,
          variant: 'accent',
          run: () => {
            play('tap');
            respond(gotoPanel(response, index + 1));
            scrollToTop();
          },
        };
      else primary = { label: 'Ik snap het', enabled: true, variant: 'accent', run: advance };
    } else if (mode === 'teach') {
      primary = { label: 'Begrepen', enabled: true, variant: 'accent', run: advance };
    } else if (mode === 'graded') {
      primary = { label: 'Controleer', enabled: isComplete(item.step, response), variant: 'accent', run: check };
    }
  }

  const primaryRun = useRef(primary);
  useEffect(() => {
    primaryRun.current = primary;
  });

  // Enter = hoofdactie, behalve waar Enter al iets doet (knoppen, links, velden, vensters).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.repeat || event.isComposing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target && (target.isContentEditable || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || isActivatable(target))) return;
      const action = primaryRun.current;
      if (!action.enabled) return;
      event.preventDefault();
      action.run();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openRules = (event: MouseEvent<HTMLElement>) => {
    ruleOpener.current = event.currentTarget;
    play('tap');
    setRulesOpen(true);
  };

  const ruleLessonId = item?.lessonId ?? null;
  const hasRules = meta.mode !== 'demo' && ruleLessonId !== null && lessonRules(ruleLessonId) !== null;
  const teaching = item ? stepMode(item.step) === 'teach' : false;

  if (!session) return <PlayerSkeleton meta={meta} />;

  if (session.phase === 'done') {
    const summary = summarize(session, lookup);
    return (
      <div data-accent={meta.accent} className="flex min-h-dvh flex-col">
        <PlayerHeader meta={meta} progress={1} counter={null} />
        <main id="inhoud" className="flex-1">
          <FinishScreen
            mode={meta.mode}
            title={meta.finish.title}
            context={meta.finish.context}
            summary={summary}
            learned={meta.finish.learned}
            celebrate={firstPhase !== null && firstPhase !== 'done'}
            primary={meta.finish.primary}
            secondary={meta.finish.secondary}
            onRestart={controller.restart}
          />
        </main>
      </div>
    );
  }

  if (!item || !response) {
    return (
      <div data-accent={meta.accent} className="flex min-h-dvh flex-col">
        <PlayerHeader meta={meta} progress={0} counter={null} />
        <main id="inhoud" className="mx-auto grid w-full max-w-md flex-1 place-items-center px-gutter text-center">
          <div>
            <Pim mood="think" size="lg" className="mx-auto" />
            <h1 className="mt-5 font-display text-title font-extrabold">Deze stap bestaat niet meer</h1>
            <p className="mt-2 text-body text-ink-muted">De les is aangepast sinds je begon. Begin opnieuw; je eerdere resultaten blijven bewaard.</p>
            <Button className="mt-6" onClick={controller.restart}>
              Opnieuw beginnen
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const locked = phase === 'feedback';
  const outcome = locked ? evaluate(item.step, response) : null;
  const wrongNow = locked && session.lastCorrect === false;

  return (
    <div data-accent={meta.accent} className="flex min-h-dvh flex-col">
      <PlayerHeader
        meta={meta}
        progress={sessionProgress(session)}
        counter={`${Math.min(pos + 1, session.queue.length)} / ${session.queue.length}`}
        rules={hasRules && !teaching ? openRules : undefined}
      />

      <main id="inhoud" className="relative mx-auto w-full max-w-3xl flex-1 px-3 pt-5 pb-10 sm:px-gutter sm:pt-9">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.article
            key={pos}
            data-step-pos={pos}
            initial={calm ? { opacity: 0 } : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={calm ? { opacity: 0, transition: { duration: 0.1 } } : { opacity: 0, x: -20, transition: transition.fast }}
            transition={transition.slow}
            className="rounded-sheet border-2 border-line bg-surface px-5 pt-7 pb-9 shadow-sheet sm:px-10 sm:pt-10 sm:pb-11"
          >
            {pos === 0 && meta.tag && <LayerTag {...meta.tag} />}
            {meta.mode === 'review' && <ReviewSource lessonId={item.lessonId} />}
            {isRetry(session) && <RetryBadge />}
            <motion.div animate={wrongNow && !calm ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.36 }}>
              <StepView
                step={item.step}
                response={response}
                onChange={respond}
                locked={locked}
                correct={locked ? session.lastCorrect : null}
                stepKey={item.key}
                onSubmit={() => {
                  if (primaryRun.current.enabled && phase === 'answering') primaryRun.current.run();
                }}
              />
            </motion.div>
          </motion.article>
        </AnimatePresence>
      </main>

      <footer
        className={cn(
          'sticky bottom-0 z-30 border-t-2 transition-colors duration-200',
          !locked && 'border-line bg-surface/95 backdrop-blur-md',
          locked && session.lastCorrect && 'border-success-line bg-success-bg',
          wrongNow && 'border-error-line bg-error-bg',
        )}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3.5 px-gutter pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:min-h-[6.75rem] sm:flex-row sm:items-center sm:gap-6 sm:py-5">
          <div className="min-w-0 flex-1">
            <div role="status" aria-live="polite" aria-atomic="true">
              {locked && outcome ? (
                <Feedback step={item.step} response={response} correct={session.lastCorrect === true} pos={pos} />
              ) : (
                <WaitingHint step={item.step} response={response} enabled={primary.enabled} graded={stepMode(item.step) === 'graded'} />
              )}
            </div>
            {wrongNow && hasRules && (
              <button
                type="button"
                onClick={openRules}
                className="mt-2 ml-[4.25rem] text-small font-bold text-red-ink underline decoration-2 underline-offset-4 hover:text-ink"
              >
                Lees de regel nog eens
              </button>
            )}
          </div>
          <Button
            ref={primaryRef}
            size="lg"
            variant={primary.variant}
            disabled={!primary.enabled}
            onClick={primary.run}
            className="w-full sm:w-auto sm:min-w-44"
          >
            {primary.label}
            {primary.enabled && <ArrowRight aria-hidden className="size-5" strokeWidth={2.75} />}
          </Button>
        </div>
      </footer>

      {ruleLessonId && (
        <RuleSheet lessonId={ruleLessonId} open={rulesOpen} onOpenChange={setRulesOpen} finalFocus={ruleOpener} />
      )}
    </div>
  );
}

function PlayerHeader({ meta, progress, counter, rules }: { meta: PlayerMeta; progress: number; counter: string | null; rules?: (event: MouseEvent<HTMLElement>) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-line/70 bg-canvas/90 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/75">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-3 py-3 sm:gap-4 sm:px-gutter">
        <Link
          href={meta.exit.href}
          aria-label={meta.exit.label}
          className="grid size-11 shrink-0 place-items-center rounded-control text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
        >
          <X aria-hidden className="size-5" strokeWidth={2.75} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-small font-bold text-ink">
              {meta.context && <span className="text-accent-ink">{meta.context} · </span>}
              {meta.title}
            </p>
            {counter && <p className="shrink-0 text-caption font-bold text-ink-muted tabular-nums">{counter}</p>}
          </div>
          <ProgressBar className="mt-2" value={progress * 100} label="Voortgang in deze les" valueText={counter ? `Stap ${counter.replace(' / ', ' van ')}` : undefined} />
        </div>
        {rules && (
          <Button variant="secondary" size="sm" onClick={rules} className="px-3">
            <BookOpen aria-hidden className="size-[1.1rem]" strokeWidth={2.5} />
            <span className="max-sm:sr-only">De regel</span>
          </Button>
        )}
      </div>
    </header>
  );
}

function WaitingHint({ step, response, enabled, graded }: { step: Step; response: Response; enabled: boolean; graded: boolean }) {
  const text = waitingHint(step, response);
  if (graded && enabled) {
    return (
      <p className="hidden items-center gap-1.5 text-small font-semibold text-ink-muted sm:flex">
        <Kbd>Enter</Kbd> om te controleren
      </p>
    );
  }
  return <p className={cn('text-small font-semibold text-ink-muted', !text && 'max-sm:hidden')}>{text}</p>;
}

function Feedback({ step, response, correct, pos }: { step: Step; response: Response; correct: boolean; pos: number }) {
  const calm = useCalmMotion();
  let title: string;
  let detail: ReactNode = null;
  let why: string | undefined;

  if (isExtraKind(step.kind)) {
    const result = extraFeedback(step, response as ExtraResponse, evaluate(step, response));
    title = result.title;
    why = result.body;
  } else {
    title = correct ? (PRAISE[pos % PRAISE.length] ?? 'Goed!') : 'Niet helemaal';
    const answer = correct ? null : expectedAnswer(step);
    if (answer) {
      detail = (
        <p className="mt-0.5 text-small text-ink">
          Juist: <strong className="font-serif text-[1.0625rem] font-semibold">{answer}</strong>
        </p>
      );
    }
    why = 'why' in step && typeof step.why === 'string' ? step.why : undefined;
  }

  return (
    <motion.div
      key={`feedback-${pos}`}
      initial={calm ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition.base}
      className="flex items-start gap-3.5"
    >
      <span className="relative mt-0.5 grid size-14 shrink-0 place-items-center rounded-full bg-surface shadow-[0_3px_0_rgb(16_24_40/0.08)]">
        <Pim mood={correct ? 'happy' : 'sad'} size="xs" reactKey={pos} />
        <span
          className={cn(
            'absolute -right-1 -bottom-1 grid size-6 place-items-center rounded-full border-2 border-surface',
            correct ? 'bg-green text-green-on' : 'bg-red text-white',
          )}
        >
          {correct ? <Check aria-hidden className="size-3.5" strokeWidth={3.5} /> : <X aria-hidden className="size-3.5" strokeWidth={3.5} />}
        </span>
      </span>
      <div className={cn('min-w-0', correct ? 'text-green-ink' : 'text-red-ink')}>
        <p className="font-display text-title-sm font-extrabold">
          <span className="sr-only">{correct ? 'Goed. ' : 'Fout. '}</span>
          {title}
        </p>
        {detail}
        {why && <p className="mt-1 max-w-[60ch] text-small font-semibold text-ink-soft">{why}</p>}
      </div>
    </motion.div>
  );
}

function PlayerSkeleton({ meta }: { meta: PlayerMeta }) {
  return (
    <div data-accent={meta.accent} className="flex min-h-dvh flex-col" aria-busy="true">
      <PlayerHeader meta={meta} progress={0} counter={null} />
      <main id="inhoud" className="mx-auto w-full max-w-3xl flex-1 px-3 pt-5 sm:px-gutter sm:pt-9">
        <div className="rounded-sheet border-2 border-line bg-surface px-5 pt-8 pb-10 shadow-sheet sm:px-10">
          <p className="sr-only">Les laden…</p>
          <div className="skeleton h-9 w-2/3" />
          <div className="mt-5 skeleton h-5 w-11/12" />
          <div className="mt-3 skeleton h-5 w-4/5" />
          <div className="mt-8 skeleton h-40" />
        </div>
      </main>
    </div>
  );
}
