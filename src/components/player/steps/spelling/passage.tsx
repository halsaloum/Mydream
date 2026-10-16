'use client';

import { Eye, Play, Turtle } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { diffSequence, passageDiffs } from '@/engine/spelling';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play as playCue } from '@/lib/sound';
import { speak, stopSpeaking, useCanSpeak } from '@/lib/speech';
import { Hint, Kbd, StepIntro, type StepProps } from '../shared';

/** Zo lang staat een zin in beeld als je hem niet kunt horen: kijken, afdekken, opschrijven. */
export const flashMs = (sentence: string) => 2500 + 300 * sentence.split(/\s+/).length;

/**
 * Tekstdictee: zin voor zin luisteren en typen. Zonder Nederlandse stem (of met "Kijk even")
 * staat de zin een paar seconden in beeld en verdwijnt dan weer: dan typ je hem uit je hoofd.
 */
export function PassageStep({ step, response, onChange, locked, onSubmit }: StepProps<'passage'>) {
  const calm = useCalmMotion();
  const canSpeak = useCanSpeak();
  const [slow, setSlow] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [visible, setVisible] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const diffs = useMemo(() => (locked ? passageDiffs(step, response.values) : null), [locked, step, response.values]);
  const lockedRef = useRef(locked);

  // Nagekeken: geen stem en geen timer meer die later nog een vakje pakt.
  useEffect(() => {
    lockedRef.current = locked;
    if (!locked) return;
    if (timer.current !== null) window.clearTimeout(timer.current);
    stopSpeaking();
  }, [locked]);
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      stopSpeaking();
    },
    [],
  );

  /** Na het luisteren of kijken naar het vakje van die zin, behalve als je al in een ander vakje typt. */
  const focusAfter = (i: number) => {
    if (lockedRef.current) return;
    const active = document.activeElement;
    if (active instanceof HTMLInputElement && active !== inputs.current[i]) return;
    inputs.current[i]?.focus({ preventScroll: true });
  };

  const bump = (list: readonly number[], i: number) => step.sentences.map((_, s) => (list[s] ?? 0) + (s === i ? 1 : 0));

  const flash = (i: number, base = response) => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setVisible(i);
    onChange({ ...base, peeks: bump(base.peeks, i) });
    timer.current = window.setTimeout(
      () => {
        setVisible(null);
        focusAfter(i);
      },
      flashMs(step.sentences[i] ?? ''),
    );
  };

  const listen = (i: number) => {
    if (locked) return;
    playCue('tap');
    const played = { ...response, plays: bump(response.plays, i) };
    const spoken =
      canSpeak &&
      speak(step.sentences[i] ?? '', {
        slower: slow ? 0.7 : 1,
        onEnd: () => {
          setPlaying(null);
          focusAfter(i);
        },
        onError: () => setPlaying(null),
      });
    if (spoken) {
      setPlaying(i);
      onChange(played);
    } else flash(i, played);
  };

  const setValue = (i: number, value: string) => {
    const values = step.sentences.map((_, s) => response.values[s] ?? '');
    values[i] = value;
    onChange({ ...response, values });
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <section className="mt-6 overflow-hidden rounded-card border-2 border-line bg-surface shadow-[0_4px_0_var(--color-line)]" aria-label="Dictee">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line bg-sunken px-4 py-3 sm:px-5">
          <h2 className="font-display text-body font-bold text-ink">{step.title ?? `Dictee van ${step.sentences.length} zinnen`}</h2>
          {canSpeak && (
            <Button variant={slow ? 'primary' : 'secondary'} size="sm" onClick={() => setSlow((value) => !value)} disabled={locked} aria-pressed={slow}>
              <Turtle aria-hidden className="size-4" strokeWidth={2.75} />
              langzaam
            </Button>
          )}
        </header>

        <ol className="divide-y-2 divide-line">
          {step.sentences.map((sentence, i) => {
            const diff = diffs?.[i];
            const perfect = diff ? diff.right === diff.marks.length && diff.extra.length === 0 : false;
            return (
              <li key={i} className="px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3">
                  <Button
                    variant={!locked && playing === i ? 'primary' : 'accent'}
                    onClick={() => listen(i)}
                    disabled={locked}
                    aria-label={canSpeak ? `Speel zin ${i + 1} af` : `Laat zin ${i + 1} even zien`}
                    className="size-12 shrink-0 rounded-full px-0"
                  >
                    {canSpeak ? <Play aria-hidden className="size-5 fill-current" strokeWidth={0} /> : <Eye aria-hidden className="size-5" strokeWidth={2.5} />}
                  </Button>
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">Zin {i + 1}</span>
                    <input
                      ref={(node) => {
                        inputs.current[i] = node;
                      }}
                      value={response.values[i] ?? ''}
                      onChange={(event) => setValue(i, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter') return;
                        event.preventDefault();
                        const next = step.sentences.findIndex((_, s) => s !== i && !(response.values[s] ?? '').trim());
                        if (next !== -1) inputs.current[next]?.focus();
                        else onSubmit();
                      }}
                      readOnly={locked || visible === i}
                      placeholder={visible === i ? 'Kijk goed, typ straks uit je hoofd' : `Zin ${i + 1}`}
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint={i === step.sentences.length - 1 ? 'done' : 'next'}
                      className={cn(
                        'min-h-12 w-full rounded-control border-2 bg-surface px-3 font-serif text-[1.15rem] text-ink outline-none transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus sm:text-[1.25rem]',
                        !diff && 'border-line focus:border-focus',
                        diff && perfect && 'border-green bg-green-soft text-green-ink',
                        diff && !perfect && 'border-red-line',
                      )}
                    />
                  </label>
                </div>

                {!locked && canSpeak && (
                  <button
                    type="button"
                    onClick={() => flash(i)}
                    className="mt-2 ml-15 text-caption font-bold text-ink-muted underline underline-offset-4 hover:text-ink"
                  >
                    Geen geluid? Kijk even
                  </button>
                )}
                {visible === i && !locked && (
                  <motion.p
                    initial={calm ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={transition.base}
                    className="mt-2 ml-15 rounded-control border-2 border-line bg-sunken px-3 py-2 font-serif text-[1.1rem] text-ink"
                    lang="nl"
                  >
                    {sentence}
                  </motion.p>
                )}

                {diff && !perfect && (
                  <div className="mt-3 flex flex-wrap items-end gap-1.5 sm:ml-15" aria-label={`Zin ${i + 1} nagekeken`}>
                    {diffSequence(diff).map((entry, m) =>
                      entry.kind === 'extra' ? (
                        <span
                          key={`x${m}`}
                          className="rounded-control border-2 border-red-line bg-red-soft px-2 py-0.5 font-serif text-[1.05rem] text-red-ink line-through decoration-2"
                        >
                          {entry.word}
                        </span>
                      ) : (
                        <span key={m} className="inline-flex flex-col items-center gap-0.5">
                          <span className={cn('min-h-4 text-caption font-bold', entry.mark.ok ? 'text-transparent' : 'text-red-ink line-through decoration-2')}>
                            {entry.mark.ok ? 'goed' : (entry.mark.typed ?? 'mist')}
                          </span>
                          <span
                            className={cn(
                              'rounded-control border-2 px-2 py-0.5 font-serif text-[1.05rem] leading-tight',
                              entry.mark.ok ? 'border-green-line bg-green-soft text-green-ink' : 'border-red-line bg-red-soft text-red-ink',
                            )}
                          >
                            {entry.mark.word}
                          </span>
                        </span>
                      ),
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {!locked && (
        <Hint className="mt-4 hidden items-center gap-1.5 sm:flex">
          <Kbd>Enter</Kbd> gaat naar de volgende zin. Alles getypt? Dan controleert <Kbd>Enter</Kbd>.
        </Hint>
      )}
    </div>
  );
}
