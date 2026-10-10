'use client';

import { Mountain, Network } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { SONORITY, SYLLABLE_ROLES } from '@/content/schema';
import { cn } from '@/lib/cn';
import { useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { TaskBox } from '../steps/shared';
import { ICON, SHAKE, useFlash, useSolve, type WidgetProps } from './widgets';

/**
 * Experimenten voor de lettergreep: de sonoriteitsberg (knip een woord op de dalen) en de
 * lettergreepboom (hang elke klank aan onset, kern of coda). Zelfcontrolerend, zoals de andere
 * experimenten, en te bedienen met aanraken, muis en toetsenbord.
 */

const sameList = (a: readonly number[], b: readonly number[]) => a.length === b.length && a.every((value, i) => value === b[i]);

/** In welk stuk een klank valt bij deze knippunten (0 = eerste lettergreep). */
const pieceOf = (cuts: readonly number[], index: number) => cuts.filter((cut) => cut <= index).length;

/* ------------------------------------------------------------------ sonoriteitsberg */

/** De klanken als staven van laag (plofklank) naar hoog (klinker). Knip tussen de staven tot elke lettergreep één top heeft. */
export function SonorityWidget({ data, solved, onSolved }: WidgetProps<'sonority'>) {
  const [cuts, setCuts] = useState<number[]>([]);
  const shown = solved ? data.cuts : cuts;
  const { box, solve } = useSolve(onSolved);

  const toggle = (position: number) => {
    if (solved) return;
    const next = cuts.includes(position) ? cuts.filter((c) => c !== position) : [...cuts, position].sort((a, b) => a - b);
    setCuts(next);
    if (sameList(next, data.cuts)) solve();
    else play(next.length > cuts.length ? 'place' : 'remove');
  };

  const pieces = data.segs.reduce<string[]>((acc, seg, i) => {
    const piece = pieceOf(shown, i);
    acc[piece] = (acc[piece] ?? '') + seg.t;
    return acc;
  }, []);

  return (
    <div ref={box}>
      <TaskBox
        icon={<Mountain aria-hidden className={ICON} strokeWidth={2.5} />}
        title={data.q ?? 'Knip de berg in lettergrepen'}
        solved={solved}
        status={solved ? `${pieces.join(' · ')}. ${data.note}` : 'Tik tussen twee staven om te knippen. Elke lettergreep is één bergje met één top.'}
      >
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <div className="mx-auto flex w-max items-stretch gap-2" lang="nl">
            <div aria-hidden className="flex h-36 flex-col justify-between py-0.5 text-right text-[0.6875rem] leading-none font-bold text-ink-muted">
              <span>klinker</span>
              <span>l, r</span>
              <span>plof</span>
            </div>
            <ol className="flex items-end" aria-label="Klanken van laag naar hoog">
              {data.segs.map((seg, i) => {
                const position = i + 1;
                const isCut = shown.includes(position);
                const odd = pieceOf(shown, i) % 2 === 1;
                return (
                  <li key={i} className="flex items-end">
                    <span className="flex w-8 flex-col items-center">
                      <span className="flex h-36 w-full items-end">
                        <span
                          aria-hidden
                          style={{ height: `${(seg.s / SONORITY.length) * 100}%` }}
                          className={cn(
                            'block w-full rounded-t-chip border-2 border-b-0 transition-colors duration-300',
                            solved
                              ? odd
                                ? 'border-teal bg-teal-soft'
                                : 'border-green bg-green-soft'
                              : odd
                                ? 'border-blue bg-blue-soft'
                                : 'border-accent bg-accent-soft',
                          )}
                        />
                      </span>
                      <span className="mt-1 font-serif text-[1.35rem] leading-none text-ink">
                        {seg.t}
                        <span className="sr-only">, {SONORITY[seg.s - 1]}</span>
                      </span>
                    </span>
                    {position < data.segs.length && (
                      <button
                        type="button"
                        aria-pressed={isCut}
                        aria-label={`Knip tussen ${seg.t} en ${data.segs[position]?.t ?? ''}`}
                        disabled={solved}
                        onClick={() => toggle(position)}
                        className={cn(
                          'group/cut relative grid h-44 place-items-end rounded-full pb-7 transition-[width] duration-200 ease-[var(--ease-out-expo)] outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                          'before:absolute before:inset-y-0 before:-inset-x-1.5 before:content-[""]',
                          isCut ? 'w-6' : 'w-2.5',
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            'block h-36 rounded-full transition-[background-color,width] duration-200',
                            isCut ? (solved ? 'w-1.5 bg-green' : 'w-1.5 bg-red') : 'w-0.5 bg-line group-hover/cut:w-1.5 group-hover/cut:bg-blue',
                          )}
                        />
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </TaskBox>
    </div>
  );
}

/* ------------------------------------------------------------------ lettergreepboom */

type Role = (typeof SYLLABLE_ROLES)[number];

const ROLE_LABEL: Record<Role, string> = { onset: 'Onset', kern: 'Kern', coda: 'Coda', appendix: 'Appendix' };

/** Vaste plekken van de knopen (in procenten), los van het antwoord: de boom verraadt niets. */
const NODES = {
  sigma: { x: 50, y: 9, label: 'σ' },
  onset: { x: 20, y: 42, label: 'onset' },
  rijm: { x: 66, y: 42, label: 'rijm' },
  kern: { x: 50, y: 74, label: 'kern' },
  coda: { x: 82, y: 74, label: 'coda' },
} as const;

/** Aan welke knoop een klank met deze plek hangt. Een appendix hangt buiten de rijm, aan de σ. */
const HANGS_FROM: Record<Role, keyof typeof NODES> = { onset: 'onset', kern: 'kern', coda: 'coda', appendix: 'sigma' };

/** Kies een tak en tik de klanken die eraan hangen. Opgelost als elke klank op zijn plek hangt. */
export function TreeWidget({ data, solved, onSolved }: WidgetProps<'tree'>) {
  const roles = SYLLABLE_ROLES.filter((role) => role !== 'appendix' || data.segs.some((seg) => seg.role === 'appendix'));
  const [role, setRole] = useState<Role>('onset');
  const [placed, setPlaced] = useState<number[]>([]);
  const shown = solved ? data.segs.map((_, i) => i) : placed;
  const { flash, flashKey, trigger } = useFlash<number>();
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();
  const n = data.segs.length;
  const xOf = (i: number) => ((i + 0.5) / n) * 100;

  const tap = (i: number) => {
    if (solved || placed.includes(i)) return play('tap');
    if (data.segs[i]?.role !== role) return trigger(i);
    const next = [...placed, i];
    setPlaced(next);
    if (next.length === n) solve();
    else play('select');
  };

  const flashed = flash === null ? undefined : data.segs[flash];
  const status = solved
    ? data.note
    : flashed
      ? `${flashed.t} hangt niet aan de ${ROLE_LABEL[role].toLowerCase()}. ${shown.length} van ${n} klanken op hun plek.`
      : `Kies een tak en tik de klanken die eraan hangen. ${shown.length} van ${n} op hun plek.`;

  const edge = (from: { x: number; y: number }, to: { x: number; y: number }, key: string, className: string, dashed = false) => (
    <line
      key={key}
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      vectorEffect="non-scaling-stroke"
      strokeWidth={dashed ? 2.5 : 3}
      strokeDasharray={dashed ? '6 5' : undefined}
      strokeLinecap="round"
      className={className}
    />
  );

  return (
    <div ref={box}>
      <TaskBox icon={<Network aria-hidden className={ICON} strokeWidth={2.5} />} title={data.q ?? 'Hang elke klank in de boom'} solved={solved} status={status}>
        <div role="group" aria-label="Kies een tak" className="flex flex-wrap gap-2">
          {roles.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={role === option}
              disabled={solved}
              onClick={() => {
                play('select');
                setRole(option);
              }}
              className={cn(
                'slab pressable min-h-11 rounded-control border-2 px-3.5 font-display text-small font-extrabold [--lift:3px] disabled:opacity-60',
                role === option && !solved ? 'border-accent bg-accent-soft text-accent-ink [--slab:var(--accent)]' : 'border-line bg-surface text-ink hover:border-line-strong',
              )}
            >
              {ROLE_LABEL[option]}
            </button>
          ))}
        </div>

        <div className="relative mx-auto mt-4 h-40 w-full max-w-[26rem]" aria-hidden>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            {edge(NODES.sigma, NODES.onset, 's-o', 'stroke-line-strong')}
            {edge(NODES.sigma, NODES.rijm, 's-r', 'stroke-line-strong')}
            {edge(NODES.rijm, NODES.kern, 'r-k', 'stroke-line-strong')}
            {edge(NODES.rijm, NODES.coda, 'r-c', 'stroke-line-strong')}
            {shown.map((i) => {
              const seg = data.segs[i];
              if (!seg) return null;
              return edge(NODES[HANGS_FROM[seg.role]], { x: xOf(i), y: 100 }, `seg-${i}`, solved ? 'stroke-green' : 'stroke-accent', seg.role === 'appendix');
            })}
          </svg>
          {Object.entries(NODES).map(([key, node]) => (
            <span
              key={key}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-surface px-2 py-0.5 text-caption leading-tight font-extrabold',
                key === 'sigma' ? 'font-serif text-[1.1rem]' : '',
                solved ? 'border-green-line text-green-ink' : 'border-line-strong text-ink-soft',
              )}
            >
              {node.label}
            </span>
          ))}
        </div>

        <div className="mx-auto grid w-full max-w-[26rem]" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }} lang="nl">
          {data.segs.map((seg, i) => {
            const hit = shown.includes(i);
            const bad = flash === i;
            return (
              <span key={i} className="grid place-items-center">
                <motion.button
                  type="button"
                  aria-pressed={hit}
                  aria-label={`${seg.t}${hit ? `, ${ROLE_LABEL[seg.role].toLowerCase()}` : ''}`}
                  onClick={() => tap(i)}
                  animate={bad && !calm ? SHAKE : { x: 0 }}
                  transition={{ duration: 0.32 }}
                  data-flash={bad ? flashKey : undefined}
                  className={cn(
                    'grid h-11 min-w-11 place-items-center rounded-control border-2 px-1 font-serif text-[1.35rem] leading-none transition-colors duration-200 outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                    hit && 'border-green bg-green text-green-on',
                    bad && 'border-red bg-red-soft text-red-ink',
                    !hit && !bad && 'border-line-strong bg-surface text-ink hover:border-accent',
                  )}
                >
                  {seg.t}
                </motion.button>
              </span>
            );
          })}
        </div>
      </TaskBox>
    </div>
  );
}
