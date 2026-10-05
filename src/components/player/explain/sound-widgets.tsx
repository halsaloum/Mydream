'use client';

import { Grid3x3, MoveHorizontal, Scale, Shapes, Volume2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { evaluateTableau } from '@/content/tableau';
import { DIPHTHONGS, VOWEL_INFO, VOWELS, type Vowel } from '@/content/vowels';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { speak, useCanSpeak } from '@/lib/speech';
import { Button } from '@/components/ui/button';
import { TaskBox } from '../steps/shared';
import { ICON, SHAKE, useFlash, useSolve, type WidgetProps } from './widgets';

/**
 * Experimenten voor klanken: de klinkerkaart, de klanktabel (zoals de IPA-tabel) en het
 * OT-tableau. Ze werken zoals de andere experimenten: zelfcontrolerend, "opgelost" wordt
 * bewaard, en alles werkt met aanraken, muis en toetsenbord.
 */

/** Luisterknop voor een voorbeeldwoord; alleen als de browser kan voorlezen. */
function ListenButton({ word }: { word: string }) {
  const canSpeak = useCanSpeak();
  if (!canSpeak) return null;
  return (
    <Button variant="secondary" size="sm" onClick={() => speak(word)} aria-label={`Luister naar ${word}`}>
      <Volume2 aria-hidden className="size-4" strokeWidth={2.75} />
      Luister
    </Button>
  );
}

/** Wat er over een aangetikte klank te zeggen valt, onder de kaart of tabel. */
export function SoundCard({ symbol, word, lines }: { symbol: string; word: string | undefined; lines: string[] }) {
  const calm = useCalmMotion();
  return (
    <motion.div
      key={symbol}
      initial={calm ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: transition.fast }}
      transition={transition.base}
      className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-tile border-2 border-line bg-surface px-4 py-3 shadow-slab-sm"
    >
      <span className="font-serif text-[2.5rem] leading-none text-accent-ink" lang="nl">
        /{symbol}/
      </span>
      <span className="min-w-[11rem] flex-1">
        {word && (
          <span className="block text-body text-ink">
            zoals in <span className="example-mark">{word}</span>
          </span>
        )}
        {lines.map((line) => (
          <span key={line} className="block text-small font-semibold text-ink-muted">
            {line}
          </span>
        ))}
      </span>
      {word && <ListenButton word={word} />}
    </motion.div>
  );
}

/** Of een brede tabel opzij moet scrollen (smal scherm); dan komt er een korte hint bij. */
function useOverflow() {
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setOverflow(element.scrollWidth > element.clientWidth + 1));
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, []);
  return { ref, overflow };
}

function ScrollHint({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p aria-hidden className="mt-2 flex items-center gap-1.5 text-caption font-semibold text-ink-muted">
      <MoveHorizontal className="size-4" strokeWidth={2.5} />
      Schuif de tabel opzij om alles te zien.
    </p>
  );
}

/* ------------------------------------------------------------------ klinkerkaart */

/** Plek op de kaart (viewBox 400 × 350): links is voor in de mond, boven is de tong hoog. */
export const VOWEL_SPOTS: Record<Vowel, { x: number; y: number }> = {
  i: { x: 72, y: 48 },
  y: { x: 130, y: 48 },
  u: { x: 347, y: 48 },
  ɪ: { x: 102, y: 101 },
  ʏ: { x: 167, y: 101 },
  eː: { x: 110, y: 154 },
  øː: { x: 168, y: 154 },
  oː: { x: 347, y: 154 },
  ə: { x: 237, y: 207 },
  ɛ: { x: 150, y: 260 },
  ɔ: { x: 347, y: 260 },
  aː: { x: 207, y: 313 },
  ɑ: { x: 332, y: 313 },
  // Tweeklanken hebben geen vaste plek: hun knop staat onder de kaart, hun glijbaan erop.
  ɛi: { x: 0, y: 0 },
  œy: { x: 0, y: 0 },
  ʌu: { x: 0, y: 0 },
};

/** Glijbanen van de tweeklanken: van het beginpunt naar het eindpunt, met een bocht. */
const GLIDES: Record<string, { from: [number, number]; via: [number, number]; to: [number, number]; start: string }> = {
  ɛi: { from: [150, 262], via: [196, 170], to: [80, 62], start: 'ɛ' },
  œy: { from: [196, 262], via: [236, 160], to: [134, 62], start: 'œ' },
  ʌu: { from: [292, 262], via: [262, 150], to: [340, 62], start: 'ʌ' },
};

export const MONOPHTHONGS = VOWELS.filter((vowel) => !DIPHTHONGS.includes(vowel));

/** Knoppen op de kaart: kleiner als de kaart smal is (telefoon), zodat ze elkaar niet raken. */
const CHART_BUTTON =
  'absolute -translate-x-1/2 -translate-y-1/2 h-[1.875rem] min-w-[1.875rem] px-1 text-[1.05rem] @min-[22rem]:h-10 @min-[22rem]:min-w-10 @min-[22rem]:px-1.5 @min-[22rem]:text-[1.25rem]';

/** Assen van de kaart als gewone tekst, zodat ze ook op een smal scherm leesbaar blijven. */
const AXIS = 'pointer-events-none absolute pb-0.5 text-[0.6875rem] leading-none font-bold text-ink-muted @min-[22rem]:text-caption';

/** De klinkerkaart: tik een klinker om hem te bekijken en te beluisteren, en vind de gevraagde klinkers. */
export function VowelsWidget({ data, solved, onSolved }: WidgetProps<'vowels'>) {
  const [found, setFound] = useState<Vowel[]>([]);
  const [current, setCurrent] = useState<Vowel | null>(null);
  const shown = solved ? data.targets : found;
  const { flash, flashKey, trigger } = useFlash<Vowel>();
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();
  const markerId = `pijl-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const tap = (vowel: Vowel) => {
    setCurrent(vowel);
    if (solved || found.includes(vowel)) return play('tap');
    if (!data.targets.includes(vowel)) return trigger(vowel);
    const next = [...found, vowel];
    setFound(next);
    if (data.targets.every((target) => next.includes(target))) solve();
    else play('select');
  };

  const vowelButton = (vowel: Vowel, className?: string, style?: CSSProperties) => {
    const hit = shown.includes(vowel);
    const bad = flash === vowel;
    const info = VOWEL_INFO[vowel];
    return (
      <motion.button
        key={vowel}
        type="button"
        aria-pressed={hit}
        aria-label={`/${vowel}/ zoals in ${info.word}${hit ? ', gevonden' : ''}`}
        onClick={() => tap(vowel)}
        animate={bad && !calm ? SHAKE : { x: 0 }}
        transition={{ duration: 0.32 }}
        data-flash={bad ? flashKey : undefined}
        style={style}
        className={cn(
          'slab grid place-items-center rounded-full border-2 font-serif leading-none transition-[background-color,border-color,color,box-shadow] duration-200 [--lift:3px] outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
          hit && 'border-green bg-green text-green-on [--slab:var(--color-green-deep)]',
          bad && 'border-red bg-red-soft text-red-ink [--slab:var(--color-red)]',
          !hit && !bad && 'border-line-strong bg-surface text-ink hover:border-accent',
          current === vowel && !hit && !bad && 'border-accent bg-accent-soft text-accent-ink [--slab:var(--accent)]',
          className,
        )}
      >
        {vowel}
      </motion.button>
    );
  };

  const glide = current && DIPHTHONGS.includes(current) ? current : null;
  const info = current ? VOWEL_INFO[current] : null;

  return (
    <div ref={box}>
      <TaskBox
        icon={<Shapes aria-hidden className={ICON} strokeWidth={2.5} />}
        title={data.q}
        solved={solved}
        status={
          solved
            ? data.note
            : flash
              ? `/${flash}/ hoort er niet bij. ${shown.length} van ${data.targets.length} gevonden.`
              : `${shown.length} van ${data.targets.length} gevonden`
        }
      >
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <div className="@container relative mx-auto aspect-[400/350] w-full max-w-[30rem] min-w-[16rem]" lang="nl">
            <svg viewBox="0 0 400 350" aria-hidden className="absolute inset-0 size-full">
              <defs>
                <marker id={`${markerId}-aan`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                  <path d="M0 0 10 5 0 10z" fill="var(--accent)" />
                </marker>
                <marker id={`${markerId}-uit`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                  <path d="M0 0 10 5 0 10z" fill="var(--color-line-strong)" />
                </marker>
              </defs>
              <polygon points="40,26 372,26 372,330 150,330" fill="var(--color-surface)" stroke="var(--color-line-strong)" strokeWidth="2.5" strokeLinejoin="round" />
              <line x1="86" y1="154" x2="372" y2="154" stroke="var(--color-line)" strokeWidth="2" strokeDasharray="6 6" />
              <line x1="124" y1="260" x2="372" y2="260" stroke="var(--color-line)" strokeWidth="2" strokeDasharray="6 6" />
              <line x1="206" y1="26" x2="261" y2="330" stroke="var(--color-line)" strokeWidth="2" strokeDasharray="6 6" />
              {data.glides &&
                DIPHTHONGS.map((vowel) => {
                  const path = GLIDES[vowel];
                  if (!path) return null;
                  const active = glide === vowel;
                  return (
                    <g key={vowel} opacity={active ? 1 : 0.45}>
                      <path
                        d={`M${path.from.join(' ')} Q${path.via.join(' ')} ${path.to.join(' ')}`}
                        fill="none"
                        stroke={active ? 'var(--accent)' : 'var(--color-line-strong)'}
                        strokeWidth={active ? 5 : 3}
                        strokeLinecap="round"
                        markerEnd={`url(#${markerId}-${active ? 'aan' : 'uit'})`}
                      />
                      {active && (
                        <>
                          <circle cx={path.from[0]} cy={path.from[1]} r="7" fill="var(--accent)" />
                          <text x={path.from[0] + 10} y={path.from[1] + 22} fontSize="16" fill="var(--accent-ink)" className="font-serif">
                            {path.start}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
            </svg>
            <span aria-hidden className={cn(AXIS, 'bottom-[92.6%] left-[10%]')}>
              voor
            </span>
            <span aria-hidden className={cn(AXIS, 'right-[7%] bottom-[92.6%]')}>
              achter
            </span>
            <span aria-hidden className={cn(AXIS, 'top-[13.7%] left-0 -translate-y-1/2')}>
              hoog
            </span>
            <span aria-hidden className={cn(AXIS, 'top-[89.4%] left-0 -translate-y-1/2')}>
              laag
            </span>
            {MONOPHTHONGS.map((vowel) => {
              const spot = VOWEL_SPOTS[vowel];
              return vowelButton(vowel, CHART_BUTTON, { left: `${spot.x / 4}%`, top: `${(spot.y / 350) * 100}%` });
            })}
          </div>
        </div>

        {data.glides && (
          <div role="group" aria-label="Tweeklanken" className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-small font-bold text-ink-muted">Tweeklanken:</span>
            {DIPHTHONGS.map((vowel) => vowelButton(vowel, 'h-10 min-w-10 px-3 text-[1.25rem]'))}
          </div>
        )}

        <div aria-live="polite" className="mt-4 min-h-[5.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            {current && info ? (
              <SoundCard key={current} symbol={current} word={info.word} lines={[info.traits, `Meestal geschreven als ${info.spelling}`]} />
            ) : (
              <p className="text-small font-semibold text-ink-muted">Tik een klinker om te zien hoe je hem maakt.</p>
            )}
          </AnimatePresence>
        </div>
      </TaskBox>
    </div>
  );
}

/* ------------------------------------------------------------------ klanktabel */

/** Een tabel met klanken (zoals de IPA-tabel). Tik een klank voor uitleg; vind de gevraagde klanken. */
export function GridWidget({ data, solved, onSolved }: WidgetProps<'grid'>) {
  const [found, setFound] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const shown = solved ? data.targets : found;
  const { flash, flashKey, trigger } = useFlash<string>();
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();
  const caption = useId();
  const { ref: scrollRef, overflow } = useOverflow();
  // De kolom met rijkoppen blijft staan als de tabel opzij scrolt; de schaduw dekt de tussenruimte af.
  const pinned = cn(
    'sticky left-0 z-10',
    solved
      ? 'bg-green-soft shadow-[-0.25rem_0_0_var(--color-green-soft),0.25rem_0_0_var(--color-green-soft)]'
      : 'bg-sunken shadow-[-0.25rem_0_0_var(--color-sunken),0.25rem_0_0_var(--color-sunken)]',
  );

  const tap = (symbol: string) => {
    setCurrent(symbol);
    if (solved || found.includes(symbol)) return play('tap');
    if (!data.targets.includes(symbol)) return trigger(symbol);
    const next = [...found, symbol];
    setFound(next);
    if (data.targets.every((target) => next.includes(target))) solve();
    else play('select');
  };

  const cell = data.cells.find((item) => item.t === current);

  return (
    <div ref={box}>
      <TaskBox
        icon={<Grid3x3 aria-hidden className={ICON} strokeWidth={2.5} />}
        title={data.q}
        solved={solved}
        status={
          solved
            ? data.note
            : flash
              ? `/${flash}/ hoort er niet bij. ${shown.length} van ${data.targets.length} gevonden.`
              : `${shown.length} van ${data.targets.length} gevonden`
        }
      >
        <div ref={scrollRef} className="@container -mx-1 overflow-x-auto px-1 pb-1">
          <table aria-describedby={caption} className="w-full border-separate border-spacing-1 text-left" lang="nl">
            <thead>
              <tr>
                <td className={pinned} />
                {data.cols.map((col) => (
                  <th key={col} scope="col" className="px-1 pb-1 align-bottom text-caption leading-tight font-extrabold text-ink-muted">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, r) => (
                <tr key={row}>
                  <th scope="row" className={cn(pinned, 'pr-2 text-caption leading-tight font-extrabold whitespace-nowrap text-ink-muted')}>
                    {row}
                  </th>
                  {data.cols.map((col, c) => (
                    <td key={col} className="rounded-chip bg-surface p-1 align-middle shadow-[inset_0_0_0_2px_var(--color-line)]">
                      <span className="flex min-h-8 flex-wrap justify-center gap-1 @min-[40rem]:min-h-10">
                        {data.cells
                          .filter((item) => item.row === r && item.col === c)
                          .map((item) => {
                            const hit = shown.includes(item.t);
                            const bad = flash === item.t;
                            return (
                              <motion.button
                                key={item.t}
                                type="button"
                                aria-pressed={hit}
                                aria-label={`/${item.t}/, ${row}, ${col}${item.ex ? `, zoals in ${item.ex}` : ''}${hit ? ', gevonden' : ''}`}
                                onClick={() => tap(item.t)}
                                animate={bad && !calm ? SHAKE : { x: 0 }}
                                transition={{ duration: 0.32 }}
                                data-flash={bad ? flashKey : undefined}
                                className={cn(
                                  'grid h-8 min-w-8 place-items-center rounded-control border-2 px-1 font-serif text-[1.05rem] leading-none transition-colors duration-200 outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus @min-[40rem]:h-10 @min-[40rem]:min-w-10 @min-[40rem]:px-1.5 @min-[40rem]:text-[1.25rem]',
                                  hit && 'border-green bg-green text-green-on',
                                  bad && 'border-red bg-red-soft text-red-ink',
                                  !hit && !bad && 'border-transparent bg-sunken text-ink hover:border-accent',
                                  current === item.t && !hit && !bad && 'border-accent bg-accent-soft text-accent-ink',
                                )}
                              >
                                {item.t}
                              </motion.button>
                            );
                          })}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollHint show={overflow} />
        <p id={caption} className="sr-only">
          {`Rijen: ${data.rows.join(', ')}. Kolommen: ${data.cols.join(', ')}.`}
        </p>

        <div aria-live="polite" className="mt-4 min-h-[5.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            {cell ? (
              <SoundCard key={cell.t} symbol={cell.t} word={cell.ex} lines={[`${data.rows[cell.row] ?? ''} · ${data.cols[cell.col] ?? ''}`]} />
            ) : (
              <p className="text-small font-semibold text-ink-muted">Tik een klank om te zien waar hij in de tabel staat.</p>
            )}
          </AnimatePresence>
        </div>
      </TaskBox>
    </div>
  );
}

/* ------------------------------------------------------------------ OT-tableau */

/** Celranden in het tableau; elke cel tekent zijn eigen rand, zodat de vaste eerste kolom hem meeneemt. */
const CELL = 'border-r-2 border-b-2 border-line last:border-r-0';

/** De eerste kolom (invoer en kandidaten) blijft staan als het tableau opzij scrolt. */
const PINNED = 'sticky left-0 z-10 px-2 text-left font-serif text-[1.05rem] font-normal text-ink @min-[36rem]:px-3 @min-[36rem]:text-[1.25rem]';

/** Lange namen van eisen mogen vóór het haakje afbreken: IDENT / (voice). */
function breakable(name: string): ReactNode {
  const at = name.indexOf('(');
  if (at <= 0) return name;
  return (
    <>
      {name.slice(0, at)}
      <wbr />
      {name.slice(at)}
    </>
  );
}

/** Een OT-tableau: wissel eisen van plek en kijk welke kandidaat wint. Opgelost als de goede kandidaat wint. */
export function TableauWidget({ data, solved, onSolved }: WidgetProps<'tableau'>) {
  const target = data.constraints.map((_, i) => i);
  const [order, setOrder] = useState<number[]>(target);
  const [held, setHeld] = useState<number | null>(null);
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();
  const help = useId();
  const { ref: scrollRef, overflow } = useOverflow();
  const marks = data.candidates.map((candidate) => candidate.marks);
  const { winners, fatal } = evaluateTableau(marks, order);
  const winner = winners.length === 1 ? data.candidates[winners[0] ?? -1] : undefined;
  const right = winners.length === 1 && winners[0] === data.winner;

  const swap = (a: number, b: number) => {
    const next = [...order];
    const ia = next.indexOf(a);
    const ib = next.indexOf(b);
    if (ia < 0 || ib < 0) return;
    [next[ia], next[ib]] = [next[ib]!, next[ia]!];
    setOrder(next);
    setHeld(null);
    const result = evaluateTableau(marks, next);
    if (!solved && result.winners.length === 1 && result.winners[0] === data.winner) solve();
    else play('place');
  };

  const tapHeader = (constraint: number) => {
    if (held === null) {
      play('select');
      setHeld(constraint);
    } else if (held === constraint) setHeld(null);
    else swap(held, constraint);
  };

  const heldName = held === null ? null : data.constraints[held]?.name;
  const status = solved
    ? data.note
    : heldName
      ? `${heldName} vastgepakt. Tik de eis waarmee je wilt wisselen.`
      : winner
        ? `Nu wint ${winner.form}. ${data.goal}`
        : `Gelijkspel tussen ${winners.map((i) => data.candidates[i]?.form).join(' en ')}. ${data.goal}`;

  return (
    <div ref={box}>
      <TaskBox icon={<Scale aria-hidden className={ICON} strokeWidth={2.5} />} title={data.goal} solved={solved} status={status}>
        <div ref={scrollRef} className="@container overflow-x-auto rounded-tile border-2 border-line bg-surface">
          <table aria-describedby={help} className="w-full border-separate border-spacing-0 text-center" lang="nl">
            <thead>
              <tr>
                <th scope="col" className={cn(CELL, PINNED, 'bg-surface py-2')}>
                  {data.input}
                </th>
                {order.map((constraint, position) => {
                  const item = data.constraints[constraint];
                  if (!item) return null;
                  return (
                    <th key={item.name} scope="col" className={cn(CELL, 'p-1 @min-[36rem]:p-1.5')}>
                      <motion.button
                        layout={!calm}
                        transition={transition.base}
                        type="button"
                        aria-pressed={held === constraint}
                        aria-label={`${item.name}, plek ${position + 1} in de rangorde`}
                        onClick={() => tapHeader(constraint)}
                        onKeyDown={(event) => {
                          if (event.key === 'Escape') setHeld(null);
                        }}
                        className={cn(
                          'slab pressable min-h-11 w-full rounded-control border-2 px-2 py-1.5 font-display text-caption leading-tight font-extrabold [--lift:3px] @min-[36rem]:px-3 @min-[36rem]:text-small',
                          held === constraint
                            ? 'border-accent bg-accent-soft text-accent-ink [--slab:var(--accent)]'
                            : 'border-line bg-surface text-ink hover:border-line-strong',
                        )}
                      >
                        {breakable(item.name)}
                      </motion.button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>*]:border-b-0">
              {data.candidates.map((candidate, c) => {
                const wins = winners.length === 1 && winners[0] === c;
                const out = fatal[c];
                const tint = wins ? (right ? 'bg-green-soft' : 'bg-accent-soft') : undefined;
                return (
                  <tr key={candidate.form} className={tint}>
                    <th scope="row" className={cn(CELL, PINNED, 'py-2 whitespace-nowrap', tint ?? 'bg-surface')}>
                      <span aria-hidden className={cn('inline-block w-5 @min-[36rem]:w-7', wins ? (right ? 'text-green-ink' : 'text-accent-ink') : 'text-transparent')}>
                        ☞
                      </span>
                      {candidate.form}
                      {wins && <span className="sr-only">, wint</span>}
                    </th>
                    {order.map((constraint, position) => {
                      const count = candidate.marks[constraint] ?? 0;
                      const isFatal = out === position;
                      const shaded = out !== null && out !== undefined && position > out;
                      return (
                        <td
                          key={constraint}
                          className={cn(
                            CELL,
                            'px-2 py-2 font-display text-lead font-extrabold tracking-[0.12em] @min-[36rem]:px-3',
                            isFatal ? 'text-red-ink' : 'text-ink',
                            shaded && 'bg-sunken text-ink-muted',
                          )}
                        >
                          <span aria-hidden>
                            {'*'.repeat(count)}
                            {isFatal && '!'}
                          </span>
                          <span className="sr-only">
                            {count === 0 ? 'geen overtreding' : count === 1 ? '1 overtreding' : `${count} overtredingen`}
                            {isFatal ? ', valt hier af' : ''}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ScrollHint show={overflow} />
        <p id={help} className="sr-only">
          Activeer een eis en daarna een andere eis om ze van plek te wisselen. Links staat de hoogste eis. Escape laat los.
        </p>
        <dl className="mt-4 grid gap-1.5 text-small">
          {data.constraints.map((constraint) => (
            <div key={constraint.name} className="flex flex-wrap gap-x-2">
              <dt className="font-display font-extrabold text-ink">{constraint.name}</dt>
              <dd className="text-ink-soft">{constraint.note}</dd>
            </div>
          ))}
        </dl>
      </TaskBox>
    </div>
  );
}
