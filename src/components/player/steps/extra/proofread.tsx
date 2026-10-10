"use client";

import { Check, MailCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { proofreadAccepts, proofreadErrors, proofreadUnchanged } from '@/engine/kinds';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { Hint, InlineFeedback, Kbd, StepIntro, type StepProps } from '../shared';

const WRONG_TEXT = 'Dat woord klopt. Kijk nog eens naar de werkwoorden, de hoofdletters en de kleine woordjes.';
const KEPT_TEXT = 'Dat woord was al goed. Laat het staan.';
const NOT_YET_TEXT = 'Zo klopt het nog niet. Probeer het nog eens, of laat het woord staan.';

type Msg = { tone: 'right' | 'wrong' | 'info'; text: string; id: number } | null;
type Response = StepProps<'proofread'>['response'];

/**
 * Eindredactie. Met hulp: tik een fout woord aan en de verbetering verschijnt; de stipjes tellen
 * mee. Zonder hulp (`blind`): het aantal fouten blijft geheim, je typt elke verbetering zelf, en
 * je zegt zelf wanneer je klaar bent. Daarna zie je wat je gemist hebt.
 */
export function ProofreadStep({ step, response, onChange, locked, stepKey }: StepProps<'proofread'>) {
  const calm = useCalmMotion();
  const fieldId = useId();
  const [message, setMessage] = useState<Msg>(null);
  const [bad, setBad] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ index: number; value: string } | null>(null);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const editor = useRef<HTMLInputElement>(null);
  const messageId = useRef(0);
  const errors = proofreadErrors(step);
  const found = new Set(response.found);
  const blind = step.blind === true;
  const missed = locked && blind ? errors.filter((index) => !found.has(index)) : [];
  const traps = step.tokens.flatMap((token, index) => ('trap' in token ? [{ t: token.t, trap: token.trap, index }] : []));

  const say = (tone: 'right' | 'wrong' | 'info', text: string) => setMessage({ tone, text, id: (messageId.current += 1) });

  const shake = (index: number) => {
    setBad(index);
    window.setTimeout(() => setBad((value) => (value === index ? null : value)), 450);
  };

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
    if (blind) {
      play('tap');
      setEditing({ index, value: token.t });
      setMessage(null);
      window.requestAnimationFrame(() => editor.current?.select());
      return;
    }
    if ('fix' in token) {
      play('right');
      setBad(null);
      say('right', token.why);
      onChange({ ...response, found: [...response.found, index] });
    } else {
      play('wrong');
      shake(index);
      say('wrong', 'trap' in token ? token.trap : WRONG_TEXT);
      onChange({ ...response, slips: response.slips + 1 });
    }
  };

  const closeEditor = () => {
    const index = editing?.index;
    setEditing(null);
    if (index !== undefined) window.requestAnimationFrame(() => refs.current[index]?.focus());
  };

  /** Kijkt een getypte verbetering na: het nieuwe antwoord, wat de leerling hoort, en of het vakje dicht mag. */
  const judge = (index: number, value: string): { next: Response; msg: Msg; close: boolean } | null => {
    const token = step.tokens[index];
    if (!token) return null;
    if ('fix' in token && proofreadAccepts(token, value)) {
      return { next: { ...response, found: [...response.found, index] }, msg: { tone: 'right', text: token.why, id: 0 }, close: true };
    }
    // Niets veranderd (of alleen de punt erachter weggelaten): je laat het woord staan. Dat kost niets en verraadt niets.
    if (proofreadUnchanged(token, value)) return { next: response, msg: null, close: true };
    const next = { ...response, slips: response.slips + 1 };
    if ('fix' in token) return { next, msg: { tone: 'wrong', text: NOT_YET_TEXT, id: 0 }, close: false };
    return { next, msg: { tone: 'wrong', text: 'trap' in token ? token.trap : KEPT_TEXT, id: 0 }, close: true };
  };

  const submitFix = () => {
    if (!editing || locked) return;
    const result = judge(editing.index, editing.value);
    if (!result) return;
    if (result.msg) {
      play(result.msg.tone === 'right' ? 'right' : 'wrong');
      if (result.msg.tone === 'wrong') shake(editing.index);
      say(result.msg.tone, result.msg.text);
    }
    if (result.next !== response) onChange(result.next);
    if (result.close) closeEditor();
  };

  const finish = () => {
    if (locked) return;
    play('tap');
    // Een verbetering die nog in het vakje staat, telt mee alsof je op Verbeter had getikt.
    const pending = editing ? judge(editing.index, editing.value) : null;
    setEditing(null);
    setMessage(null);
    onChange({ ...(pending?.next ?? response), finished: true });
  };

  const missedSet = new Set(missed);
  const editingToken = editing ? step.tokens[editing.index] : undefined;

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
          {step.greeting && <p className="mb-2 whitespace-pre-line">{step.greeting}</p>}
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1" role="group" aria-label="Tekst, tik fout geschreven woorden aan">
            {step.tokens.map((token, index) => {
              const isFound = found.has(index);
              const isMissed = missedSet.has(index);
              const isBad = bad === index;
              const isOpen = editing?.index === index;
              const fix = 'fix' in token ? token.fix : null;
              return (
                <motion.button
                  key={`${stepKey}:${index}:${token.t}`}
                  ref={(node) => {
                    refs.current[index] = node;
                  }}
                  type="button"
                  disabled={locked}
                  aria-disabled={isFound || undefined}
                  onClick={() => tap(index)}
                  onKeyDown={onTokenKey(index)}
                  animate={isBad && !calm ? { x: [0, -5, 5, -4, 4, 0] } : { x: 0 }}
                  transition={transition.fast}
                  className={cn(
                    'inline-flex min-h-10 items-center gap-1.5 rounded-control px-1.5 text-left transition-colors duration-150 hover:bg-sunken focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                    isBad && 'bg-red-soft',
                    isOpen && 'bg-accent-soft ring-2 ring-accent',
                    (isFound || locked) && 'cursor-default hover:bg-transparent',
                  )}
                  aria-pressed={isFound}
                  aria-label={
                    isFound && fix ? `${token.t}, gevonden fout, verbetering ${fix}` : isMissed && fix ? `${token.t}, gemiste fout, verbetering ${fix}` : token.t
                  }
                >
                  <span className={cn((isFound || isMissed) && 'text-red-ink line-through decoration-2', isMissed && 'underline decoration-wavy')}>{token.t}</span>
                  {(isFound || isMissed) && fix && (
                    <motion.span
                      initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={transition.base}
                      className={cn(
                        'rounded-chip px-2 py-0.5 font-serif text-small font-extrabold',
                        isFound ? 'bg-green-soft text-green-ink' : 'bg-orange-soft text-orange-ink',
                      )}
                    >
                      {fix}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
          {step.signoff && <p className="mt-3 whitespace-pre-line">{step.signoff}</p>}
        </div>
      </div>

      {blind && editing && editingToken && !locked && (
        <div className="mt-4 rounded-card border-2 border-accent-line bg-accent-soft p-4">
          <label htmlFor={fieldId} className="text-small font-bold text-ink">
            Verbeter ‘{editingToken.t}’
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              ref={editor}
              id={fieldId}
              value={editing.value}
              onChange={(event) => setEditing({ ...editing, value: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  submitFix();
                } else if (event.key === 'Escape') {
                  event.preventDefault();
                  closeEditor();
                }
              }}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="done"
              className="min-h-11 min-w-0 flex-1 rounded-control border-2 border-accent bg-surface px-3 font-serif text-[1.15rem] text-ink outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
            />
            <Button variant="accent" onClick={submitFix}>
              Verbeter
            </Button>
            <Button variant="ghost" onClick={closeEditor}>
              Laat staan
            </Button>
          </div>
          <Hint className="mt-2 hidden items-center gap-1.5 sm:flex">
            <Kbd>Enter</Kbd> verbetert · <Kbd>Esc</Kbd> laat het woord staan
          </Hint>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-start gap-3">
        {!blind && (
          <div aria-hidden className="flex gap-1.5 pt-3">
            {errors.map((index, i) => (
              <span key={index} className={cn('size-3.5 rounded-full transition-colors duration-300', i < response.found.length ? 'bg-green' : 'bg-line-strong')} />
            ))}
          </div>
        )}
        <InlineFeedback className="min-w-0 flex-1" tone={message?.tone ?? 'info'} id={message?.id}>
          {message?.text ??
            (!locked &&
              (blind ? 'Tik een woord dat fout is en typ de verbetering. Het aantal fouten blijft geheim.' : 'Begin bij werkwoorden, hoofdletters en kleine woordjes.'))}
        </InlineFeedback>
        {blind && !locked && (
          <Button variant="secondary" onClick={finish}>
            <Check aria-hidden className="size-4" strokeWidth={3} />
            Ik ben klaar
          </Button>
        )}
      </div>

      {locked && missed.length > 0 && (
        <section className="mt-4 rounded-card border-2 border-orange-line bg-orange-soft/50 p-4 sm:p-5" aria-label="Gemiste fouten">
          <h2 className="font-display text-body font-bold text-ink">Deze fouten zag je niet</h2>
          <ul className="mt-2 space-y-1.5 text-small font-semibold text-ink-soft">
            {missed.map((index) => {
              const token = step.tokens[index];
              if (!token || !('fix' in token)) return null;
              return (
                <li key={index}>
                  <span className="font-serif text-red-ink line-through">{token.t}</span> → <span className="font-serif font-bold text-green-ink">{token.fix}</span>: {token.why}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {locked && traps.length > 0 && (
        <section className="mt-4 rounded-card border-2 border-line bg-sunken p-4 sm:p-5" aria-label="Woorden die goed waren">
          <h2 className="font-display text-body font-bold text-ink">Deze woorden lijken fout, maar zijn goed</h2>
          <ul className="mt-2 space-y-1.5 text-small font-semibold text-ink-soft">
            {traps.map(({ t, trap, index }) => (
              <li key={index}>
                <span className="font-serif font-bold text-green-ink">{t}</span>: {trap}
              </li>
            ))}
          </ul>
        </section>
      )}

      {locked && missed.length === 0 && (
        <p role="status" className="mt-4 inline-flex items-center gap-2 rounded-control border-2 border-green-line bg-green-soft px-3.5 py-2.5 text-small font-bold text-green-ink">
          <MailCheck aria-hidden className="size-4" strokeWidth={2.75} />
          {step.header ? 'Deze mail kan weg.' : 'Deze tekst is foutloos.'}
        </p>
      )}
    </div>
  );
}
