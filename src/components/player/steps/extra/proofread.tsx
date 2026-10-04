"use client";

import { MailCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { proofreadErrors } from '@/engine/kinds';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { InlineFeedback, StepIntro, type StepProps } from '../shared';

const WRONG_TEXT = 'Dat woord klopt. Kijk nog eens naar de werkwoorden, de hoofdletters en de kleine woordjes.';

type Msg = { tone: 'right' | 'wrong'; text: string; id: number } | null;

export function ProofreadStep({ step, response, onChange, locked, stepKey }: StepProps<'proofread'>) {
  const calm = useCalmMotion();
  const [message, setMessage] = useState<Msg>(null);
  const [bad, setBad] = useState<number | null>(null);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const messageId = useRef(0);
  const errors = proofreadErrors(step);
  const found = new Set(response.found);

  const focusBy = (index: number, delta: number) => {
    const len = step.tokens.length;
    if (!len) return;
    const next = (index + delta + len) % len;
    refs.current[next]?.focus();
  };

  const onTokenKey = (index: number) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusBy(index, 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusBy(index, -1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      refs.current[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      refs.current[step.tokens.length - 1]?.focus();
    }
  };

  const tap = (index: number) => {
    if (locked || found.has(index)) return;
    const token = step.tokens[index];
    if (!token) return;
    if ('fix' in token) {
      play('right');
      setBad(null);
      setMessage({ tone: 'right', text: token.why, id: (messageId.current += 1) });
      onChange({ ...response, found: [...response.found, index] });
    } else {
      play('wrong');
      setBad(index);
      setMessage({ tone: 'wrong', text: WRONG_TEXT, id: (messageId.current += 1) });
      onChange({ ...response, slips: response.slips + 1 });
      window.setTimeout(() => setBad((value) => (value === index ? null : value)), 450);
    }
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />

      <div className="mt-6 overflow-hidden rounded-card border-2 border-line bg-surface shadow-[0_4px_0_var(--color-line)]">
        {step.header && (
          <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-1 border-b-2 border-line bg-sunken px-4 py-3 text-small sm:px-5">
            {step.header.to && (
              <>
                <dt className="font-bold text-ink-muted">Aan</dt>
                <dd className="min-w-0 font-semibold text-ink">{step.header.to}</dd>
              </>
            )}
            {step.header.subject && (
              <>
                <dt className="font-bold text-ink-muted">Onderwerp</dt>
                <dd className="min-w-0 font-semibold text-ink">{step.header.subject}</dd>
              </>
            )}
          </dl>
        )}
        <div className="px-4 py-4 text-[1.12rem] leading-relaxed text-ink sm:px-5 sm:text-[1.2rem]" lang="nl">
          <p className="mb-2">Beste Karin,</p>
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1" role="group" aria-label="Mailtekst, tik fout geschreven woorden aan">
            {step.tokens.map((token, index) => {
              const isFound = found.has(index);
              const isBad = bad === index;
              return (
                <motion.button
                  key={`${stepKey}:${index}:${token.t}`}
                  ref={(node) => {
                    refs.current[index] = node;
                  }}
                  type="button"
                  disabled={locked || isFound}
                  onClick={() => tap(index)}
                  onKeyDown={onTokenKey(index)}
                  animate={isBad && !calm ? { x: [0, -5, 5, -4, 4, 0] } : { x: 0 }}
                  transition={transition.fast}
                  className={cn(
                    'inline-flex min-h-10 items-center gap-1.5 rounded-control px-1.5 text-left transition-colors duration-150 hover:bg-sunken focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                    isBad && 'bg-red-soft',
                    isFound && 'cursor-default hover:bg-transparent',
                  )}
                  aria-pressed={isFound}
                  aria-label={isFound && 'fix' in token ? `${token.t}, gevonden fout, verbetering ${token.fix}` : token.t}
                >
                  <span className={cn(isFound && 'text-red-ink line-through decoration-2')}>{token.t}</span>
                  {isFound && 'fix' in token && (
                    <motion.span
                      initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={transition.base}
                      className="rounded-chip bg-green-soft px-2 py-0.5 font-serif text-small font-extrabold text-green-ink"
                    >
                      {token.fix}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
          <p className="mt-3">Groet,<br />Sam</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-start gap-3">
        <div aria-hidden className="flex gap-1.5 pt-3">
          {errors.map((index, i) => (
            <span key={index} className={cn('size-3.5 rounded-full transition-colors duration-300', i < response.found.length ? 'bg-green' : 'bg-line-strong')} />
          ))}
        </div>
        <InlineFeedback className="min-w-0 flex-1" tone={message?.tone ?? 'info'} id={message?.id}>
          {message?.text ?? (!locked && 'Begin bij werkwoorden, hoofdletters en kleine woordjes.')}
        </InlineFeedback>
      </div>

      {locked && (
        <p role="status" className="mt-4 inline-flex items-center gap-2 rounded-control border-2 border-green-line bg-green-soft px-3.5 py-2.5 text-small font-bold text-green-ink">
          <MailCheck aria-hidden className="size-4" strokeWidth={2.75} />
          Deze mail kan weg.
        </p>
      )}
    </div>
  );
}
