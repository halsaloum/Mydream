"use client";

import { Play, Turtle } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { normalizeSpaces } from '@/engine/kinds';
import { diffSequence, wordDiff } from '@/engine/spelling';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play as playCue } from '@/lib/sound';
import { speak, stopSpeaking } from '@/lib/speech';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/field';
import { StepIntro, type StepProps } from '../shared';
import { flashMs } from '../spelling/passage';

const HEIGHTS = [10, 18, 28, 40, 52, 36, 24, 44, 56, 38, 22, 30, 48, 34, 18, 26, 42, 54, 32, 20, 14, 24, 36, 46, 28, 16, 10, 8];

export function DictationStep({ step, response, onChange, locked, onSubmit }: StepProps<'dictation'>) {
  const calm = useCalmMotion();
  const [slow, setSlow] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);
  const flashTimer = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };

  useEffect(() => {
    return () => {
      clearTimer();
      if (flashTimer.current !== null) window.clearTimeout(flashTimer.current);
      stopSpeaking();
    };
  }, []);

  // Zonder geluid staat de zin even in beeld en verdwijnt dan: kijken, afdekken, opschrijven.
  const flash = () => {
    if (flashTimer.current !== null) window.clearTimeout(flashTimer.current);
    setVisible(true);
    flashTimer.current = window.setTimeout(() => setVisible(false), flashMs(step.sentence));
  };

  const playSentence = () => {
    if (locked) return;
    playCue('tap');
    clearTimer();
    setPlaying(true);
    onChange({ ...response, plays: response.plays + 1 });
    // Met een Nederlandse stem: de stem van de instellingen, langzaam is nog eens een stuk trager.
    // Zonder Nederlandse stem staat de zin er meteen bij, zodat je toch verder kunt.
    const spoken = speak(step.sentence, {
      slower: slow ? 0.7 : 1,
      onEnd: () => {
        clearTimer();
        setPlaying(false);
      },
      onError: () => {
        setPlaying(false);
        onChange({ ...response, plays: response.plays + 1, shown: true });
        flash();
      },
    });
    if (!spoken) {
      onChange({ ...response, plays: response.plays + 1, shown: true });
      flash();
    }
    const ms = spoken ? (slow ? 12000 : 8000) : slow ? 4200 : 2800;
    timer.current = window.setTimeout(() => setPlaying(false), ms);
  };

  const showSentence = () => {
    if (locked) return;
    playCue('tap');
    onChange({ ...response, shown: true });
    flash();
  };

  const submit = () => {
    if (locked || normalizeSpaces(response.value).length === 0) return;
    onSubmit();
  };

  const diff = useMemo(() => (locked ? diffSequence(wordDiff(step.sentence, response.value)) : []), [locked, step.sentence, response.value]);

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-card border-2 border-line bg-sunken p-4">
        <Button variant="primary" size="lg" onClick={playSentence} disabled={locked} aria-label="Speel de zin af" className="size-16 rounded-full px-0">
          <Play aria-hidden className="size-7 fill-current" strokeWidth={0} />
        </Button>
        <div className="flex h-16 min-w-0 flex-1 items-center justify-between gap-1" aria-hidden>
          {HEIGHTS.map((height, index) => (
            <motion.span
              key={index}
              animate={playing && !calm ? { scaleY: [0.35, 1, 0.45] } : { scaleY: 1 }}
              transition={playing && !calm ? { duration: 0.48, repeat: Infinity, repeatType: 'reverse', delay: ((index * 37) % 300) / 1000 } : transition.fast}
              className={cn('w-1.5 origin-center rounded-full', playing ? 'bg-green' : 'bg-line-strong')}
              style={{ height }}
            />
          ))}
        </div>
        <Button variant={slow ? 'primary' : 'secondary'} onClick={() => setSlow((value) => !value)} disabled={locked} aria-pressed={slow}>
          <Turtle aria-hidden className="size-4" strokeWidth={2.75} />
          langzaam
        </Button>
      </div>

      <div className="mt-3 min-h-12">
        {visible && !locked ? (
          <motion.p
            initial={calm ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition.base}
            className="inline-flex min-h-11 items-center rounded-control border-2 border-line bg-surface px-3 font-serif text-[1.2rem] text-ink"
            lang="nl"
          >
            {step.sentence}
          </motion.p>
        ) : (
          <button type="button" onClick={showSentence} disabled={locked} className="min-h-11 text-small font-bold text-ink-muted underline underline-offset-4 hover:text-ink disabled:no-underline disabled:opacity-60">
            {response.shown ? 'Kijk nog even' : 'Geen geluid? Laat de zin even zien'}
          </button>
        )}
      </div>

      <TextField
        label="Jouw zin"
        value={response.value}
        disabled={locked}
        onChange={(value) => onChange({ ...response, value })}
        placeholder="Typ hier wat je hoort"
        inputClassName="min-h-14 font-serif text-[1.35rem]"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            submit();
          }
        }}
      />

      {locked && (
        <div className="mt-5 rounded-card border-2 border-line bg-surface p-4" role="status" aria-label="Dictee nagekeken">
          <div className="flex flex-wrap items-end gap-2">
            {diff.map((entry, index) => {
              if (entry.kind === 'extra') {
                return (
                  <span
                    key={`x:${entry.word}:${index}`}
                    className="rounded-control border-2 border-red-line bg-red-soft px-3 py-1.5 font-serif text-[1.25rem] text-red-ink line-through decoration-2"
                  >
                    {entry.word}
                  </span>
                );
              }
              const item = entry.mark;
              const typed = item.typed ?? 'mist';
              return (
                <motion.span
                  key={`${item.word}:${index}`}
                  initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={transition.base}
                  className="inline-flex flex-col items-center gap-1"
                >
                  <span className={cn('min-h-4 text-caption font-bold', item.ok ? 'text-transparent' : 'text-red-ink line-through decoration-2')}>{item.ok ? 'goed' : typed}</span>
                  <span
                    className={cn(
                      'rounded-control border-2 px-3 py-1.5 font-serif text-[1.25rem] leading-tight',
                      item.ok ? 'border-green-line bg-green-soft text-green-ink' : 'border-red-line bg-red-soft text-red-ink',
                    )}
                  >
                    {item.word}
                  </span>
                </motion.span>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
