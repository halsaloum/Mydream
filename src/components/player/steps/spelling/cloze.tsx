'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Fragment, useMemo, useRef, type KeyboardEvent } from 'react';
import { clozeOf, type ClozePart } from '@/content/cloze';
import { clozeResults } from '@/engine/spelling';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { Hint, Kbd, StepIntro, type StepProps } from '../shared';

type Piece = { kind: 'text'; text: string } | { kind: 'br' } | { kind: 'gap'; gap: number };

/** De tekst in alinea's: een lege regel begint een nieuwe alinea, een enkele regelovergang een nieuwe regel. */
function paragraphs(parts: readonly ClozePart[]): Piece[][] {
  const result: Piece[][] = [[]];
  for (const part of parts) {
    if (part.kind === 'gap') {
      result[result.length - 1]!.push(part);
      continue;
    }
    part.text.split(/\n{2,}/).forEach((block, b) => {
      if (b > 0) result.push([]);
      block.split('\n').forEach((line, l) => {
        if (l > 0) result[result.length - 1]!.push({ kind: 'br' });
        if (line) result[result.length - 1]!.push({ kind: 'text', text: line });
      });
    });
  }
  return result.filter((paragraph) => paragraph.length > 0);
}

/** Invultekst: elk gat typ je zelf. Enter springt naar het volgende vakje; in het laatste vakje controleert Enter. */
export function ClozeStep({ step, response, onChange, locked, onSubmit }: StepProps<'cloze'>) {
  const calm = useCalmMotion();
  const parsed = useMemo(() => clozeOf(step.text), [step.text]);
  const blocks = useMemo(() => paragraphs(parsed.parts), [parsed]);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const total = parsed.gaps.length;
  const results = locked ? clozeResults(step, response.values) : null;
  const wrong = results ? parsed.gaps.flatMap((gap, i) => (results[i] ? [] : [{ gap, i }])) : [];

  const setValue = (i: number, value: string) => {
    const values = parsed.gaps.map((_, g) => response.values[g] ?? '');
    values[i] = value;
    onChange({ kind: 'cloze', values });
  };

  const onKey = (i: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const empty = parsed.gaps.findIndex((_, g) => g > i && !(response.values[g] ?? '').trim());
    const next = empty !== -1 ? empty : parsed.gaps.findIndex((_, g) => !(response.values[g] ?? '').trim());
    if (next !== -1 && next !== i) inputs.current[next]?.focus();
    else onSubmit();
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <article className="mt-6 overflow-hidden rounded-card border-2 border-line bg-surface shadow-[0_4px_0_var(--color-line)]">
        <header className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-line bg-sunken px-4 py-3 sm:px-5">
          <h2 className="font-display text-body font-bold text-ink">{step.title ?? 'Vul de tekst aan'}</h2>
          <p className="text-small font-bold text-ink-muted tabular-nums">
            {results ? `${results.filter(Boolean).length} van ${total} goed` : `${total} vakjes`}
          </p>
        </header>
        <div className="space-y-4 px-4 py-5 font-serif text-[1.15rem] leading-[2.4] text-ink sm:px-5 sm:text-[1.25rem]" lang="nl">
          {blocks.map((block, b) => (
            <p key={b}>
              {block.map((piece, p) => {
                if (piece.kind === 'text') return <Fragment key={p}>{piece.text}</Fragment>;
                if (piece.kind === 'br') return <br key={p} />;
                const gap = parsed.gaps[piece.gap]!;
                const value = response.values[piece.gap] ?? '';
                const ok = results?.[piece.gap];
                const size = Math.max(4, gap.cue?.length ?? 0, value.length) + 2;
                return (
                  <span key={p} className="inline-flex items-baseline gap-1">
                    <input
                      ref={(node) => {
                        inputs.current[piece.gap] = node;
                      }}
                      value={value}
                      onChange={(event) => setValue(piece.gap, event.target.value)}
                      onKeyDown={onKey(piece.gap)}
                      readOnly={locked}
                      placeholder={gap.cue ?? ''}
                      aria-label={`Vakje ${piece.gap + 1} van ${total}${gap.cue ? `, aanwijzing: ${gap.cue}` : ''}`}
                      aria-invalid={ok === false || undefined}
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint={piece.gap === total - 1 ? 'done' : 'next'}
                      style={{ width: `${size}ch` }}
                      className={cn(
                        'mx-0.5 inline-block max-w-full rounded-control border-2 px-1.5 py-0 text-center font-serif leading-normal outline-none transition-colors duration-200 placeholder:font-sans placeholder:text-[0.8em] placeholder:text-ink-muted/80 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                        ok === undefined && 'border-accent-line bg-surface text-accent-ink focus:border-accent',
                        ok === true && 'border-green bg-green-soft text-green-ink',
                        ok === false && 'border-red bg-red-soft text-red-ink line-through decoration-2',
                      )}
                    />
                    {ok === false && (
                      <motion.span
                        initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={transition.base}
                        className="rounded-chip bg-green-soft px-1.5 font-extrabold text-green-ink"
                      >
                        {gap.answers[0]}
                      </motion.span>
                    )}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      </article>

      {!locked && (
        <Hint className="mt-4 hidden items-center gap-1.5 sm:flex">
          <Kbd>Enter</Kbd> gaat naar het volgende vakje. Alles ingevuld? Dan controleert <Kbd>Enter</Kbd>.
        </Hint>
      )}

      {locked && wrong.length > 0 && (
        <section className="mt-5 rounded-card border-2 border-line bg-sunken p-4 sm:p-5" aria-label="Wat er fout ging">
          <h2 className="font-display text-body font-bold text-ink">Zo moest het</h2>
          <ul className="mt-3 space-y-2.5">
            {wrong.map(({ gap, i }) => (
              <li key={i} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small">
                <span className="rounded-chip bg-red-soft px-2 py-0.5 font-serif text-[1.05rem] text-red-ink line-through decoration-2">
                  {(response.values[i] ?? '').trim() || 'leeg'}
                </span>
                <ArrowRight aria-hidden className="size-4 text-ink-muted" strokeWidth={2.75} />
                <span className="rounded-chip bg-green-soft px-2 py-0.5 font-serif text-[1.05rem] font-bold text-green-ink">{gap.answers[0]}</span>
                {gap.note && <span className="basis-full font-semibold text-ink-soft sm:basis-auto">{gap.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
