'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { ArrowLeftRight, CaseLower, Check, Disc3, FlaskConical, Hammer, Magnet, MousePointerClick, Scissors, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useId, useRef, useState } from 'react';
import type { Panel } from '@/content/schema';
import { tokenize } from '@/content/text';
import { celebrate, originOf } from '@/lib/confetti';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { PracticeDnd, useClickGuard, useDragTarget } from '../dnd';
import { TaskBox } from '../steps/shared';
import { Tile } from '../tile';

/**
 * De experimenten binnen de uitleg. Elk experiment is een kleine opdracht die zichzelf
 * controleert; "opgelost" wordt in de sessie bewaard, de tussenstand niet (zoals in de
 * oorspronkelijke app). Alles werkt met aanraken, muis en toetsenbord.
 */
type Data<K extends keyof Panel> = NonNullable<Panel[K]>;
export type WidgetProps<K extends keyof Panel> = { data: Data<K>; solved: boolean; onSolved: () => void };

export const ICON = 'size-[1.05rem]';
export const SHAKE = { x: [0, -6, 6, -3, 0] };

export function useSolve(onSolved: () => void) {
  const box = useRef<HTMLDivElement>(null);
  return {
    box,
    solve: () => {
      play('solved');
      void celebrate('spark', originOf(box.current));
      onSolved();
    },
  };
}

/** Kort "nee"-signaal op één element: rood en een schudbeweging, daarna weer neutraal. */
export function useFlash<T>() {
  const [flash, setFlash] = useState<{ value: T; n: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  return {
    flash: flash?.value ?? null,
    flashKey: flash?.n ?? 0,
    trigger: (value: T) => {
      play('wrong');
      window.clearTimeout(timer.current);
      setFlash((current) => ({ value, n: (current?.n ?? 0) + 1 }));
      timer.current = window.setTimeout(() => setFlash(null), 560);
    },
  };
}

const sameList = (a: readonly number[], b: readonly number[]) => a.length === b.length && a.every((value, i) => value === b[i]);

/* ------------------------------------------------------------------ knippen */

function cutsOf(answer: string): number[] {
  const cuts: number[] = [];
  let position = 0;
  for (const part of answer.split('-').slice(0, -1)) {
    position += Array.from(part).length;
    cuts.push(position);
  }
  return cuts;
}

/** Knip een woord in lettergrepen door tussen de letters te tikken. */
export function SplitWidget({ data, solved, onSolved }: WidgetProps<'split'>) {
  const letters = Array.from(data.word);
  const target = cutsOf(data.answer);
  const [cuts, setCuts] = useState<number[]>([]);
  const shown = solved ? target : cuts;
  const { box, solve } = useSolve(onSolved);

  const toggle = (position: number) => {
    if (solved) return;
    const next = cuts.includes(position) ? cuts.filter((c) => c !== position) : [...cuts, position].sort((a, b) => a - b);
    setCuts(next);
    if (sameList(next, target)) solve();
    else play(next.length > cuts.length ? 'place' : 'remove');
  };

  return (
    <div ref={box}>
      <TaskBox
        icon={<Scissors aria-hidden className={ICON} strokeWidth={2.5} />}
        title={data.q ?? 'Knip het woord in lettergrepen'}
        solved={solved}
        status={solved ? `${data.answer} · ${data.note}` : 'Tik tussen de letters om te knippen. Nog eens tikken plakt ze weer.'}
      >
        <div className="flex flex-wrap items-center justify-center py-1 font-serif text-example-lg text-ink" lang="nl">
          {letters.map((letter, i) => {
            const position = i + 1;
            const isCut = shown.includes(position);
            return (
              <span key={i} className="flex items-center">
                <span className={cn('transition-colors duration-200', solved && 'text-green-ink')}>{letter}</span>
                {position < letters.length && (
                  <button
                    type="button"
                    aria-pressed={isCut}
                    aria-label={`Knip tussen ${letter} en ${letters[position]}`}
                    disabled={solved}
                    onClick={() => toggle(position)}
                    className={cn(
                      'group/cut relative mx-0.5 grid h-16 place-items-center rounded-full transition-[width] duration-200 ease-[var(--ease-out-expo)] outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                      'before:absolute before:inset-y-0 before:-inset-x-2 before:content-[""]',
                      isCut ? 'w-7' : 'w-3',
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'block h-12 rounded-full transition-[background-color,width] duration-200',
                        isCut ? (solved ? 'w-1.5 bg-green' : 'w-1.5 bg-red') : 'w-1 bg-line-strong group-hover/cut:w-1.5 group-hover/cut:bg-blue',
                      )}
                    />
                  </button>
                )}
              </span>
            );
          })}
        </div>
      </TaskBox>
    </div>
  );
}

/* ------------------------------------------------------------------ markeren */

/** Tik alle woorden aan die bij de vraag horen. */
export function MarkWidget({ data, solved, onSolved }: WidgetProps<'mark'>) {
  const words = tokenize(data.sentence);
  const [found, setFound] = useState<number[]>([]);
  const shown = solved ? data.targets : found;
  const { flash, flashKey, trigger } = useFlash<number>();
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();

  const tap = (i: number) => {
    if (solved || found.includes(i)) return;
    if (!data.targets.includes(i)) return trigger(i);
    const next = [...found, i];
    setFound(next);
    if (data.targets.every((t) => next.includes(t))) solve();
    else play('select');
  };

  return (
    <div ref={box}>
      <TaskBox
        icon={<MousePointerClick aria-hidden className={ICON} strokeWidth={2.5} />}
        title={data.q}
        solved={solved}
        status={solved ? data.note : flash !== null ? `“${words[flash] ?? ''}” hoort er niet bij. ${shown.length} van ${data.targets.length} gevonden.` : `${shown.length} van ${data.targets.length} gevonden`}
      >
        <p className="font-serif text-example leading-[1.9] text-ink" lang="nl">
          {words.map((word, i) => {
            const hit = shown.includes(i);
            const bad = flash === i;
            return (
              <span key={i}>
                <motion.button
                  type="button"
                  aria-pressed={hit}
                  disabled={solved}
                  onClick={() => tap(i)}
                  animate={bad && !calm ? SHAKE : { x: 0 }}
                  transition={{ duration: 0.32 }}
                  data-flash={bad ? flashKey : undefined}
                  className={cn(
                    'rounded-chip px-1.5 transition-colors duration-200 outline-none focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-focus',
                    hit && 'bg-accent-soft text-accent-ink shadow-[inset_0_-0.32em_0_var(--accent-line)]',
                    bad && 'bg-red-soft text-red-ink',
                    !hit && !bad && !solved && 'hover:bg-surface',
                  )}
                >
                  {word}
                </motion.button>{' '}
              </span>
            );
          })}
        </p>
      </TaskBox>
    </div>
  );
}

/* ------------------------------------------------------------------ bouwen */

const endingLabel = (ending: string) => (ending === '' ? '∅' : ending);
const endingName = (ending: string) => (ending === '' ? 'niets erachter' : ending);

/** Plak de juiste uitgang achter de stam. */
export function BuildWidget({ data, solved, onSolved }: WidgetProps<'build'>) {
  const [ending, setEnding] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();
  const shown = solved ? data.answer : ending;
  const wrong = shown !== null && shown !== data.answer;

  const pick = (next: string) => {
    if (solved) return;
    setEnding(next);
    if (next === data.answer) solve();
    else {
      play('wrong');
      setTries((n) => n + 1);
    }
  };

  return (
    <div ref={box}>
      <TaskBox
        icon={<Hammer aria-hidden className={ICON} strokeWidth={2.5} />}
        title="Bouw het woord"
        solved={solved}
        status={solved ? `${data.stem}${data.answer} · ${data.note}` : tries ? 'Nog niet. Denk aan de regel hierboven.' : 'Kies de uitgang.'}
      >
        {data.before && <p className="text-center text-body text-ink-soft">{data.before}</p>}
        <div className="mt-3 flex items-center justify-center gap-1.5 font-serif text-example-lg text-ink" lang="nl">
          <span className="rounded-tile border-2 border-line bg-surface px-4 py-1 shadow-slab-sm">{data.stem}</span>
          <span
            className={cn(
              'relative grid min-w-[2.2em] place-items-center overflow-hidden rounded-tile border-2 px-3 py-1 transition-colors duration-200',
              shown === null && 'border-dashed border-accent-line bg-surface/60 text-ink-muted',
              shown !== null && !wrong && 'border-green bg-green-soft text-green-ink',
              wrong && 'border-red bg-red-soft text-red-ink',
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={`${shown ?? '?'}-${tries}`}
                initial={calm ? { opacity: 0 } : { y: -16, opacity: 0 }}
                animate={wrong && !calm ? { y: 0, opacity: 1, ...SHAKE } : { y: 0, opacity: 1 }}
                exit={{ opacity: 0, transition: transition.fast }}
                transition={transition.base}
              >
                {shown === null ? '?' : endingLabel(shown)}
              </motion.span>
            </AnimatePresence>
            <span className="sr-only">{shown === null ? '(nog leeg)' : `(${endingName(shown)}${wrong ? ', niet goed' : ''})`}</span>
          </span>
        </div>
        <div role="group" aria-label="Uitgangen" className="mt-5 flex flex-wrap justify-center gap-2.5">
          {data.endings.map((option) => (
            <Tile
              key={option}
              size="lg"
              disabled={solved}
              state={solved ? (option === data.answer ? 'correct' : 'muted') : 'idle'}
              aria-label={endingName(option)}
              onClick={() => pick(option)}
              faceClassName="min-w-14 justify-center"
            >
              {endingLabel(option)}
            </Tile>
          ))}
        </div>
      </TaskBox>
    </div>
  );
}

/* ------------------------------------------------------------------ wisselen */

function orderFromAnswer(blocks: readonly string[], answer: string): number[] {
  const rest = blocks.map((_, i) => i);
  const order: number[] = [];
  let offset = 0;
  while (rest.length) {
    const index = rest.findIndex((i) => answer.startsWith(blocks[i] ?? '', offset));
    if (index < 0) return blocks.map((_, i) => i);
    const block = rest.splice(index, 1)[0]!;
    order.push(block);
    offset += (blocks[block] ?? '').length + 1;
  }
  return order;
}

/** Wissel blokken tot de zin klopt: tik twee blokken, of sleep een blok op een ander. */
export function SwapWidget({ data, solved, onSolved }: WidgetProps<'swap'>) {
  const [order, setOrder] = useState<number[]>(() => data.blocks.map((_, i) => i));
  const [held, setHeld] = useState<number | null>(null);
  const guard = useClickGuard();
  const { box, solve } = useSolve(onSolved);
  const help = useId();
  const shown = solved && !data.accept.includes(order.map((i) => data.blocks[i]).join(' ')) ? orderFromAnswer(data.blocks, data.accept[0] ?? '') : order;

  const swap = (a: number, b: number) => {
    if (a === b) return;
    const next = [...order];
    const ia = next.indexOf(a);
    const ib = next.indexOf(b);
    if (ia < 0 || ib < 0) return;
    [next[ia], next[ib]] = [next[ib]!, next[ia]!];
    setOrder(next);
    setHeld(null);
    if (data.accept.includes(next.map((i) => data.blocks[i]).join(' '))) solve();
    else play('place');
  };

  const tap = (block: number) => {
    if (solved || !guard.allowed()) return;
    if (held === null) {
      play('select');
      setHeld(block);
    } else if (held === block) setHeld(null);
    else swap(held, block);
  };

  return (
    <div ref={box}>
      <TaskBox
        icon={<ArrowLeftRight aria-hidden className={ICON} strokeWidth={2.5} />}
        title="Wissel de blokken"
        solved={solved}
        status={solved ? data.note : held !== null ? `“${data.blocks[held]}” vastgepakt. Kies het blok om mee te wisselen.` : data.goal}
      >
        <PracticeDnd
          disabled={solved}
          animateDrop={false}
          onDrop={(active, over) => {
            guard.afterDrag();
            if (over) swap(Number(active.slice(2)), Number(over.slice(2)));
          }}
          renderOverlay={(active) => (
            <Tile state="held" size="lg">
              {data.blocks[Number(active.slice(2))]}
            </Tile>
          )}
        >
          <ul aria-describedby={help} className="flex flex-wrap gap-2.5" lang="nl">
            {shown.map((block, position) => (
              <SwapBlock
                key={block}
                id={`b-${block}`}
                label={data.blocks[block] ?? ''}
                position={position}
                held={held === block}
                solved={solved}
                onTap={() => tap(block)}
                onEscape={() => setHeld(null)}
              />
            ))}
          </ul>
        </PracticeDnd>
        <p id={help} className="sr-only">
          Activeer een blok om het vast te pakken en daarna een ander blok om ze te wisselen. Escape laat los. Slepen kan ook.
        </p>
      </TaskBox>
    </div>
  );
}

function SwapBlock({
  id,
  label,
  position,
  held,
  solved,
  onTap,
  onEscape,
}: {
  id: string;
  label: string;
  position: number;
  held: boolean;
  solved: boolean;
  onTap: () => void;
  onEscape: () => void;
}) {
  const { setNodeRef: dragRef, listeners: dragListeners, describedBy: dragDescribedBy, isDragging, isOver } = useDragTarget(id, { label, kind: 'blok', index: position }, solved);
  return (
    <li>
      <Tile
        ref={dragRef}
        {...dragListeners}
        aria-describedby={dragDescribedBy}
        aria-pressed={held}
        layout
        size="lg"
        disabled={solved}
        state={solved ? 'correct' : isDragging ? 'dragging' : held ? 'held' : isOver ? 'target' : 'idle'}
        onClick={onTap}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onEscape();
        }}
      >
        {label}
      </Tile>
    </li>
  );
}

/* ------------------------------------------------------------------ alfabet */

const ALPHABET = Array.from('abcdefghijklmnopqrstuvwxyz');

/** Het alfabet: tik alle gevraagde letters aan. */
export function AlphaWidget({ data, solved, onSolved }: WidgetProps<'alpha'>) {
  const [on, setOn] = useState<string[]>([]);
  const shown = solved ? data.targets : on;
  const { flash, flashKey, trigger } = useFlash<string>();
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();

  const tap = (letter: string) => {
    if (solved || on.includes(letter)) return;
    if (!data.targets.includes(letter)) return trigger(letter);
    const next = [...on, letter];
    setOn(next);
    if (data.targets.every((t) => next.includes(t))) solve();
    else play('select');
  };

  return (
    <div ref={box}>
      <TaskBox
        icon={<CaseLower aria-hidden className={ICON} strokeWidth={2.5} />}
        title={data.q}
        solved={solved}
        status={solved ? data.note : flash ? `De ${flash} hoort er niet bij. ${shown.length} van ${data.targets.length} gevonden.` : `${shown.length} van ${data.targets.length} gevonden`}
      >
        <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-9 sm:gap-2">
          {ALPHABET.map((letter, i) => {
            const hit = shown.includes(letter);
            const bad = flash === letter;
            return (
              <motion.button
                key={letter}
                type="button"
                aria-pressed={hit}
                disabled={solved}
                onClick={() => tap(letter)}
                initial={calm ? false : { opacity: 0, scale: 0.92 }}
                animate={bad && !calm ? { opacity: 1, scale: 1, ...SHAKE } : { opacity: 1, scale: 1, x: 0 }}
                transition={bad ? { duration: 0.32 } : { ...transition.base, delay: calm ? 0 : i * 0.012 }}
                data-flash={bad ? flashKey : undefined}
                className={cn(
                  'slab aspect-square min-h-11 rounded-control border-2 font-serif text-[1.5rem] leading-none transition-[background-color,border-color,color,box-shadow] duration-200 [--lift:3px] outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                  hit && 'border-green bg-green text-green-on [--slab:var(--color-green-deep)]',
                  bad && 'border-red bg-red-soft text-red-ink [--slab:var(--color-red)]',
                  !hit && !bad && (solved ? 'border-line bg-surface text-ink-disabled shadow-none' : 'border-line bg-surface text-ink hover:border-line-strong'),
                )}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>
      </TaskBox>
    </div>
  );
}

/* ------------------------------------------------------------------ klinkerwiel */

/** Wissel de klinker en kijk welk woord er ontstaat. */
export function WheelWidget({ data, solved, onSolved }: WidgetProps<'wheel'>) {
  const [current, setCurrent] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();
  const label = useId();
  const real = data.options.filter((option) => option.mean).length;
  const need = Math.min(real, data.need);
  const found = seen.filter((i) => data.options[i]?.mean).length;
  const option = current === null ? undefined : data.options[current];
  const word = option ? `${data.start}${option.v}${data.end}` : '';

  const spin = (i: number) => {
    setCurrent(i);
    if (seen.includes(i)) return play('tap');
    const next = [...seen, i];
    setSeen(next);
    if (!solved && next.filter((k) => data.options[k]?.mean).length >= need) solve();
    else play(data.options[i]?.mean ? 'right' : 'tap');
  };

  return (
    <div ref={box}>
      <TaskBox
        icon={<Disc3 aria-hidden className={ICON} strokeWidth={2.5} />}
        title="Wissel de klinker"
        solved={solved}
        status={solved ? data.note : `${found} van ${need} echte woorden gevonden`}
      >
        <div className="flex items-center justify-center gap-1 font-serif text-[3.25rem] leading-none text-ink" lang="nl" aria-hidden>
          <span>{data.start}</span>
          <span
            className={cn(
              'relative grid h-[1.35em] min-w-[1.2em] place-items-center overflow-hidden rounded-tile border-2 px-2 transition-colors duration-200',
              !option && 'border-dashed border-line-strong bg-surface text-ink-muted',
              option?.mean && 'border-green bg-green-soft text-green-ink',
              option && !option.mean && 'border-red-line bg-red-soft text-red-ink',
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={current ?? 'leeg'}
                initial={calm ? { opacity: 0 } : { y: '70%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={calm ? { opacity: 0 } : { y: '-70%', opacity: 0 }}
                transition={transition.base}
              >
                {option?.v ?? '?'}
              </motion.span>
            </AnimatePresence>
          </span>
          <span>{data.end}</span>
        </div>
        <p aria-live="polite" className="mt-3 min-h-7 text-center text-body font-semibold">
          {option ? (
            <span className={cn('inline-flex items-center gap-1.5', option.mean ? 'text-green-ink' : 'text-red-ink')}>
              {option.mean ? <Check aria-hidden className="size-4" strokeWidth={3} /> : <X aria-hidden className="size-4" strokeWidth={3} />}
              <span>
                <span className="sr-only">{`${word}: `}</span>
                {option.mean ?? 'geen Nederlands woord'}
              </span>
            </span>
          ) : (
            <span className="text-ink-muted">Kies een klinker</span>
          )}
        </p>
        <span id={label} className="sr-only">
          {`Klinker tussen ${data.start} en ${data.end}`}
        </span>
        <RadioGroup
          aria-labelledby={label}
          value={current === null ? '' : String(current)}
          onValueChange={(value) => spin(Number(value))}
          className="mt-4 flex flex-wrap justify-center gap-2"
        >
          {data.options.map((choice, i) => (
            <Radio.Root
              key={choice.v}
              value={String(i)}
              className={cn(
                'slab pressable grid size-13 place-items-center rounded-control border-2 font-serif text-[1.5rem] [--lift:3px]',
                'border-line bg-surface text-ink hover:border-line-strong',
                seen.includes(i) && 'text-ink-muted',
                'data-[checked]:border-blue data-[checked]:bg-blue-soft data-[checked]:text-blue-ink data-[checked]:[--slab:var(--color-blue)]',
              )}
            >
              {choice.v}
            </Radio.Root>
          ))}
        </RadioGroup>
      </TaskBox>
    </div>
  );
}

/* ------------------------------------------------------------------ letters plakken */

/** Plak twee letters samen tot één klank. */
export function BlendWidget({ data, solved, onSolved }: WidgetProps<'blend'>) {
  const [first, setFirst] = useState<number | null>(null);
  const [made, setMade] = useState<string[]>([]);
  const shown = solved ? data.pairs.map((pair) => pair.s) : made;
  const { flash, flashKey, trigger } = useFlash<string>();
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();

  const tap = (i: number) => {
    if (solved) return;
    if (first === null) {
      play('select');
      return setFirst(i);
    }
    if (first === i) return setFirst(null);
    const sound = `${data.letters[first] ?? ''}${data.letters[i] ?? ''}`;
    setFirst(null);
    if (!data.pairs.some((p) => p.s === sound)) return trigger(sound);
    if (made.includes(sound)) return play('tap');
    const next = [...made, sound];
    setMade(next);
    if (next.length >= data.pairs.length) solve();
    else play('right');
  };

  return (
    <div ref={box}>
      <TaskBox
        icon={<Magnet aria-hidden className={ICON} strokeWidth={2.5} />}
        title="Plak twee letters tot één klank"
        solved={solved}
        status={
          solved
            ? data.note
            : flash
              ? `${flash} is hier geen klank. Probeer een ander paar.`
              : first !== null
                ? `${data.letters[first]} gekozen. Tik zijn partner.`
                : 'Tik eerst een letter, dan zijn partner.'
        }
      >
        <motion.div
          animate={flash && !calm ? SHAKE : { x: 0 }}
          transition={{ duration: 0.32 }}
          data-flash={flash ? flashKey : undefined}
          role="group"
          aria-label="Letters"
          className="flex flex-wrap justify-center gap-2.5"
          lang="nl"
        >
          {data.letters.map((letter, i) => (
            <Tile
              key={i}
              size="lg"
              disabled={solved}
              aria-pressed={first === i}
              state={first === i ? 'held' : 'idle'}
              onClick={() => tap(i)}
              faceClassName={cn('min-w-14 justify-center', first === i && '-rotate-3')}
            >
              {letter}
            </Tile>
          ))}
        </motion.div>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2" lang="nl">
          {data.pairs.map((pair) => {
            const got = shown.includes(pair.s);
            return (
              <li
                key={pair.s}
                className={cn(
                  'flex min-h-12 items-center gap-3 rounded-control border-2 px-3 py-2 transition-colors duration-200',
                  got ? 'border-green-line bg-surface' : 'border-dashed border-line-strong',
                )}
              >
                <span
                  className={cn(
                    'grid h-9 min-w-11 place-items-center rounded-chip px-2 font-serif text-[1.25rem] transition-colors duration-200',
                    got ? 'bg-green text-green-on' : 'bg-line text-ink-muted',
                  )}
                >
                  {got ? pair.s : <span aria-hidden>··</span>}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={got ? 'ja' : 'nee'}
                    initial={calm ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={transition.base}
                    className={cn('text-body font-semibold', got ? 'text-ink' : 'text-ink-muted')}
                  >
                    {got ? pair.ex : <span className="sr-only">Nog niet gevonden</span>}
                  </motion.span>
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </TaskBox>
    </div>
  );
}

/* ------------------------------------------------------------------ klikexperiment */

/** Kies een knop en zie het resultaat veranderen. De keuze telt als "uitgeprobeerd". */
export function LabWidget({ data, chosen, onChoose }: { data: Data<'lab'>; chosen: number | undefined; onChoose: (index: number) => void }) {
  const calm = useCalmMotion();
  const label = useId();
  const chip = chosen === undefined ? undefined : data.chips[chosen];
  return (
    <TaskBox
      icon={<FlaskConical aria-hidden className={ICON} strokeWidth={2.5} />}
      title={<span id={label}>{data.label}</span>}
      solved={false}
      status={chip ? 'Probeer gerust de andere ook.' : 'Probeer er een paar uit.'}
    >
      <RadioGroup
        aria-labelledby={label}
        value={chosen === undefined ? '' : String(chosen)}
        onValueChange={(value) => {
          play('select');
          onChoose(Number(value));
        }}
        className="flex flex-wrap gap-2"
      >
        {data.chips.map((item, i) => (
          <Radio.Root
            key={item.k}
            value={String(i)}
            className={cn(
              'slab pressable min-h-11 rounded-control border-2 px-4 py-2 font-display text-body font-bold [--lift:3px]',
              'border-line bg-surface text-ink hover:border-line-strong',
              'data-[checked]:border-accent data-[checked]:bg-accent-soft data-[checked]:text-accent-ink data-[checked]:[--slab:var(--accent)]',
            )}
          >
            {item.k}
          </Radio.Root>
        ))}
      </RadioGroup>
      <div aria-live="polite" className="mt-4 min-h-[6.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          {chip && (
            <motion.div
              key={chosen}
              initial={calm ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: transition.fast }}
              transition={transition.base}
              className="rounded-tile border-2 border-line bg-surface px-4 py-3.5 shadow-slab-sm"
            >
              <p className="font-serif text-example text-ink" lang="nl">
                {chip.out}
              </p>
              <p className="mt-1 text-small font-semibold text-ink-muted">{chip.note}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TaskBox>
  );
}
