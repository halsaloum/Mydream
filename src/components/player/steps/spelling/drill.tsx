'use client';

import { ArrowRight, Flame, RotateCcw, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useId, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { RichText } from '@/components/ui/rich-text';
import { DRILL_RETRIES, drillCheck, drillCurrent, drillQueue, drillStats } from '@/engine/spelling';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { speak, useCanSpeak } from '@/lib/speech';
import { Hint, InlineFeedback, Kbd, StepIntro, type StepProps } from '../shared';

/**
 * Reeks: veel korte opdrachten na elkaar. Elk antwoord typ je zelf en krijgt meteen een reactie;
 * wat fout gaat, komt achteraan terug (hoogstens twee keer). Klaar = de reeks is leeg.
 */
export function DrillStep({ step, response, onChange, locked }: StepProps<'drill'>) {
  const calm = useCalmMotion();
  const canSpeak = useCanSpeak();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const queue = drillQueue(step, response.answers);
  const current = drillCurrent(step, response);
  const item = current === null ? null : step.items[current];
  const stats = drillStats(step, response.answers);
  const last = response.answers[response.answers.length - 1];
  const lastItem = last ? step.items[last.item] : undefined;
  const repeat = current !== null && response.answers.some((answer) => answer.item === current);
  const position = Math.min(response.answers.length + 1, queue.length);
  const count = response.answers.length;

  // Na elk antwoord: het vakje weer klaar voor het volgende woord, en het woord voorlezen als dat hoort.
  useEffect(() => {
    if (locked || count === 0) return;
    input.current?.focus({ preventScroll: true });
    const say = current === null ? undefined : step.items[current]?.say;
    if (say && canSpeak) speak(say);
  }, [count, locked, current, step.items, canSpeak]);

  const submit = () => {
    if (locked || current === null || !response.value.trim()) return;
    const ok = drillCheck(step, current, response.value);
    play(ok ? 'right' : 'wrong');
    onChange({ kind: 'drill', answers: [...response.answers, { item: current, typed: response.value.trim(), ok }], value: '' });
  };

  const lastMisses = last ? response.answers.filter((answer) => answer.item === last.item && !answer.ok).length : 0;
  const feedback =
    last && lastItem
      ? last.ok
        ? `Goed: ${lastItem.a}. ${lastItem.why}`
        : `Je schreef ‘${last.typed}’. Juist: ${lastItem.a}. ${lastItem.why}${lastMisses <= DRILL_RETRIES ? ' Dit woord komt straks terug.' : ''}`
      : null;

  const missedFirst = step.items.flatMap((entry, i) => {
    const first = response.answers.find((answer) => answer.item === i);
    return first && !first.ok ? [{ entry, typed: first.typed }] : [];
  });

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <section className="mt-6 rounded-card border-2 border-line bg-sunken p-4 sm:p-6" aria-label="Reeks">
        <div className="flex items-center justify-between gap-3">
          <p className="text-small font-bold text-ink-muted tabular-nums">
            {locked ? `Klaar: ${stats.firstTry} van ${stats.total} in één keer goed` : `Opdracht ${position} van ${queue.length}`}
          </p>
          <p
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border-2 px-2.5 py-0.5 text-caption font-extrabold tabular-nums transition-colors',
              stats.run >= 3 ? 'border-orange-line bg-orange-soft text-orange-ink' : 'border-line bg-surface text-ink-muted',
            )}
            aria-label={`${stats.run} goed op rij`}
          >
            <Flame aria-hidden className="size-3.5" strokeWidth={2.75} />
            {stats.run} op rij
          </p>
        </div>
        <ProgressBar className="mt-3" size="sm" value={locked ? queue.length : response.answers.length} max={queue.length} label="Voortgang in de reeks" />

        {item && !locked && (
          // Geen uitloopanimatie: wie snel typt, typt meteen in het nieuwe vakje.
          <motion.div
            key={count}
            initial={count === 0 ? false : calm ? { opacity: 0 } : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={transition.fast}
            className="mt-5"
          >
            {repeat && (
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border-2 border-orange-line bg-orange-soft px-2.5 py-0.5 text-caption font-bold text-orange-ink">
                <RotateCcw aria-hidden className="size-3.5" strokeWidth={2.75} />
                Nog een keer
              </p>
            )}
            <div className="flex items-start gap-3">
              <p id={`${id}-q`} className="min-w-0 flex-1 text-lead font-bold text-ink">
                <RichText text={item.q} />
              </p>
              {item.say && canSpeak && (
                <Button variant="secondary" size="sm" onClick={() => speak(item.say!)} aria-label="Luister nog eens" className="shrink-0 px-3">
                  <Volume2 aria-hidden className="size-4" strokeWidth={2.75} />
                  <span className="max-sm:sr-only">Luister</span>
                </Button>
              )}
            </div>
            <p className="mt-4 font-serif text-[1.35rem] leading-[1.9] text-ink sm:text-[1.5rem]" lang="nl">
              {item.before && <>{item.before} </>}
              <label htmlFor={id} className="sr-only">
                Jouw antwoord
              </label>
              <input
                ref={input}
                id={id}
                aria-describedby={`${id}-q`}
                value={response.value}
                onChange={(event) => onChange({ ...response, value: event.target.value })}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    submit();
                  }
                }}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="send"
                style={{ width: `${Math.max(8, response.value.length + 2)}ch` }}
                className="inline-block max-w-full rounded-control border-2 border-accent bg-surface px-2 py-0.5 text-center font-serif text-accent-ink outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
              />
              {item.after && <> {item.after}</>}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Button variant="accent" onClick={submit} disabled={!response.value.trim()}>
                Controleer
                <ArrowRight aria-hidden className="size-4" strokeWidth={2.75} />
              </Button>
              <Hint className="hidden items-center gap-1.5 sm:flex">
                of <Kbd>Enter</Kbd>
              </Hint>
            </div>
          </motion.div>
        )}
      </section>

      <InlineFeedback className="mt-4" tone={last ? (last.ok ? 'right' : 'wrong') : 'info'} id={count}>
        {feedback ?? (step.items.some((entry) => entry.say) && !canSpeak ? 'Geen Nederlandse stem gevonden: lees de opdracht goed.' : null)}
      </InlineFeedback>

      {locked && missedFirst.length > 0 && (
        <section className="mt-4 rounded-card border-2 border-line bg-surface p-4 sm:p-5" aria-label="Woorden om te onthouden">
          <h2 className="font-display text-body font-bold text-ink">Deze gingen de eerste keer mis</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {missedFirst.map(({ entry, typed }, i) => (
              <li key={i} className="inline-flex items-center gap-1.5 rounded-tile border-2 border-line bg-sunken px-2.5 py-1 text-small">
                <span className="font-serif text-red-ink line-through decoration-2">{typed}</span>
                <ArrowRight aria-hidden className="size-3.5 text-ink-muted" strokeWidth={2.75} />
                <span className="font-serif font-bold text-green-ink">{entry.a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
