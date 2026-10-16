'use client';

import { Check, Circle, Eye, PenLine } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useId } from 'react';
import { TextArea } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { RichText } from '@/components/ui/rich-text';
import { RATING_LABELS, RATINGS, writeStatus, type UseRating } from '@/engine/words';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { StepHeading, type StepProps } from '../shared';

const RATING_STYLE: Record<UseRating, string> = {
  2: 'data-[on=true]:border-green data-[on=true]:bg-green-soft data-[on=true]:text-green-ink data-[on=true]:[--slab:var(--color-green)]',
  1: 'data-[on=true]:border-yellow-line data-[on=true]:bg-yellow-soft data-[on=true]:text-yellow-ink data-[on=true]:[--slab:var(--color-yellow-deep)]',
  0: 'data-[on=true]:border-orange-line data-[on=true]:bg-orange-soft data-[on=true]:text-orange-ink data-[on=true]:[--slab:var(--color-orange)]',
};

/**
 * Gebruik het: schrijf zelf een zin (of aan het eind van de ronde een korte tekst) met het woord.
 * Pas als je zelf iets geschreven hebt, zie je een voorbeeld; daarna kijk je je eigen tekst na met
 * een paar vragen en beoordeel je hem eerlijk. Dat oordeel bepaalt wanneer het woord terugkomt.
 */
export function UseStep({ step, response, onChange, locked }: StepProps<'use'>) {
  const calm = useCalmMotion();
  const status = writeStatus(step, response.value);
  const long = step.minWords > 15;
  const reveal = response.compared && status.ready;
  const ratingId = useId();

  return (
    <div>
      <StepHeading>{step.prompt}</StepHeading>

      <div className="mt-6 flex gap-3.5 rounded-card border-2 border-orange-line bg-orange-soft p-4 sm:p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-control bg-surface text-orange-ink shadow-slab-sm">
          <PenLine aria-hidden className="size-5" strokeWidth={2.5} />
        </span>
        <p className="self-center text-lead leading-snug text-ink" lang="nl">
          <span className="sr-only">Situatie: </span>
          <RichText text={step.situation} />
        </p>
      </div>

      <ul aria-label="Gebruik deze woorden" className="mt-5 flex flex-wrap gap-2">
        {status.targets.map((target) => (
          <li
            key={target.word}
            className={cn(
              'inline-flex min-h-9 items-center gap-1.5 rounded-full border-2 px-3 font-serif text-[1.0625rem] transition-colors duration-200',
              target.found ? 'border-green-line bg-green-soft text-green-ink' : 'border-accent-line bg-accent-soft text-accent-ink',
            )}
          >
            {target.found ? (
              <motion.span key="ja" initial={calm ? false : { scale: 0.4 }} animate={{ scale: 1 }} transition={transition.base}>
                <Check aria-hidden className="size-4" strokeWidth={3} />
              </motion.span>
            ) : (
              <Circle aria-hidden className="size-3.5" strokeWidth={3} />
            )}
            <span className="sr-only">{target.found ? 'Gebruikt: ' : 'Nog niet gebruikt: '}</span>
            {target.word}
          </li>
        ))}
        <li
          className={cn(
            'inline-flex min-h-9 items-center rounded-full border-2 px-3 text-small font-bold tabular-nums transition-colors duration-200',
            status.enoughWords ? 'border-green-line bg-green-soft text-green-ink' : 'border-line bg-surface text-ink-muted',
          )}
        >
          {status.words} van {step.minWords} woorden
        </li>
      </ul>

      <TextArea
        className="mt-4"
        label="Jouw tekst"
        hideLabel
        value={response.value}
        onChange={(value) => onChange({ ...response, value })}
        placeholder={long ? 'Schrijf hier je tekst. Gebruik alle woorden hierboven…' : 'Schrijf hier je eigen zin…'}
        rows={long ? 7 : 3}
        disabled={locked}
        textareaClassName="font-serif text-[1.3rem] leading-relaxed"
      />

      {!response.compared && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            disabled={!status.ready || locked}
            onClick={() => {
              play('tap');
              onChange({ ...response, compared: true });
            }}
          >
            <Eye aria-hidden className="size-5" strokeWidth={2.5} />
            Vergelijk met een voorbeeld
          </Button>
          <p className="max-w-[44ch] text-caption font-semibold text-ink-muted">
            {status.ready ? 'Lees je zin eerst één keer hardop. Klinkt het als iets wat je echt zou zeggen?' : 'Eerst zelf schrijven; daarna zie je hoe het ook kan.'}
          </p>
        </div>
      )}

      {response.compared && !status.ready && !locked && (
        <p className="mt-4 text-small font-semibold text-ink-muted">Gebruik weer alle woorden hierboven en schrijf genoeg woorden; dan zie je het voorbeeld weer.</p>
      )}

      <AnimatePresence initial={false}>
        {reveal && (
          <motion.div
            key="vergelijk"
            initial={calm ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={transition.base}
            className="mt-6 space-y-5"
          >
            {step.models.length > 0 && (
              <section>
                <h2 className="text-caption font-extrabold tracking-[0.08em] text-ink-muted uppercase">Zo kan het ook</h2>
                <ul className="mt-2 space-y-2">
                  {step.models.map((model) => (
                    <li key={model} className="rounded-tile border-2 border-line bg-sunken px-4 py-3 font-serif text-[1.1875rem] leading-snug text-ink" lang="nl">
                      <RichText text={model} listen />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-caption font-extrabold tracking-[0.08em] text-ink-muted uppercase">Kijk je eigen tekst na</h2>
              <ul className="mt-2 space-y-1.5">
                {step.checks.map((check) => (
                  <li key={check} className="flex items-start gap-2.5 text-body text-ink">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {check}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby={ratingId}>
              <h2 id={ratingId} className="font-display text-title-sm font-extrabold text-ink">
                Hoe goed gebruikte je het?
              </h2>
              <p className="mt-1 text-small font-semibold text-ink-muted">Wees eerlijk: dit bepaalt wanneer het woord terugkomt, niet je score.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {RATINGS.slice()
                  .reverse()
                  .map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      data-on={response.rating === rating}
                      aria-pressed={response.rating === rating}
                      disabled={locked}
                      onClick={() => {
                        play('select');
                        onChange({ ...response, rating });
                      }}
                      className={cn(
                        'slab pressable flex min-h-20 flex-col items-start gap-1 rounded-tile border-2 border-line bg-surface px-4 py-3 text-left [--lift:4px] [--slab:var(--color-line-strong)] hover:border-line-strong disabled:pointer-events-none',
                        RATING_STYLE[rating],
                        locked && response.rating !== rating && 'opacity-55 shadow-none',
                      )}
                    >
                      <span className="font-display text-body font-extrabold">{RATING_LABELS[rating].label}</span>
                      <span className="text-caption font-semibold text-ink-soft">{RATING_LABELS[rating].text}</span>
                    </button>
                  ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
