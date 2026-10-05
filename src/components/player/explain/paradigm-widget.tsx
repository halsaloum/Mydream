'use client';

import { Table2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { TaskBox } from '../steps/shared';
import { ICON, SHAKE, useFlash, useSolve, type WidgetProps } from './widgets';

/**
 * Experiment voor het niveau "Het woord": het paradigma. Een woord is een hele rij vormen
 * (rijden, reed, gereden). De leerling kiest een leeg vakje en zet er de goede vorm in; de
 * keuzes staan op alfabet, zodat hun volgorde niets verraadt.
 */

type Data = WidgetProps<'paradigm'>['data'];
type Blank = { key: string; row: number; col: number; fill: string; hint?: string };

function blanksOf(data: Data): Blank[] {
  return data.rows.flatMap((row, r) =>
    row.cells.flatMap((cell, c) => (typeof cell === 'string' ? [] : [{ key: `${r}:${c}`, row: r, col: c, fill: cell.fill, hint: cell.hint }])),
  );
}

/** Vul alle lege vakjes. Opgelost als de hele tabel klopt. */
export function ParadigmWidget({ data, solved, onSolved }: WidgetProps<'paradigm'>) {
  const blanks = useMemo(() => blanksOf(data), [data]);
  const pool = useMemo(
    () => [...new Set([...blanks.map((blank) => blank.fill), ...(data.extra ?? [])])].sort((a, b) => a.localeCompare(b, 'nl')),
    [blanks, data.extra],
  );
  const [filled, setFilled] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(blanks[0]?.key ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const { flash, flashKey, trigger } = useFlash<string>();
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();
  const done = solved ? blanks.map((blank) => blank.key) : filled;
  const target = blanks.find((blank) => blank.key === current);
  const name = (blank: Blank) => `${data.rows[blank.row]?.label}, ${data.cols[blank.col]}`;

  const choose = (form: string) => {
    if (solved || !target) return;
    if (form !== target.fill) {
      trigger(target.key);
      setMessage(target.hint ?? `${form} past niet bij ${name(target)}.`);
      return;
    }
    const next = [...filled, target.key];
    setFilled(next);
    setMessage(null);
    const open = blanks.filter((blank) => !next.includes(blank.key));
    // Verder met het volgende lege vakje in leesvolgorde, anders het eerste dat nog open is.
    const after = open.find((blank) => blanks.indexOf(blank) > blanks.indexOf(target)) ?? open[0];
    setCurrent(after?.key ?? null);
    if (open.length === 0) solve();
    else play('place');
  };

  const status = solved
    ? data.note
    : (message ?? (target ? `Kies een vorm voor ${name(target)}. ${done.length} van ${blanks.length} ingevuld.` : 'Tik een leeg vakje aan.'));

  return (
    <div ref={box}>
      <TaskBox icon={<Table2 aria-hidden className={ICON} strokeWidth={2.5} />} title={data.q ?? 'Vul het paradigma in'} solved={solved} status={status}>
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <table className="w-full border-separate border-spacing-1 text-left" lang="nl">
            <thead>
              <tr>
                <td />
                {data.cols.map((col) => (
                  <th key={col} scope="col" className="px-1 pb-1 align-bottom text-caption leading-tight font-extrabold text-ink-muted">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, r) => (
                <tr key={row.label}>
                  <th scope="row" className="pr-2 font-serif text-[1.05rem] leading-tight font-bold whitespace-nowrap text-ink">
                    {row.label}
                  </th>
                  {row.cells.map((cell, c) => {
                    if (typeof cell === 'string')
                      return (
                        <td key={c} className="rounded-chip bg-surface px-2 py-1.5 font-serif text-[1.05rem] text-ink-soft">
                          {cell}
                        </td>
                      );
                    const key = `${r}:${c}`;
                    const hit = done.includes(key);
                    const bad = flash === key;
                    const active = current === key && !solved;
                    return (
                      <td key={c} className="p-0">
                        <motion.button
                          type="button"
                          disabled={hit}
                          aria-pressed={active}
                          aria-label={`${row.label}, ${data.cols[c]}: ${hit ? cell.fill : 'leeg'}`}
                          onClick={() => {
                            play('tap');
                            setCurrent(key);
                            setMessage(null);
                          }}
                          animate={bad && !calm ? SHAKE : { x: 0 }}
                          transition={{ duration: 0.32 }}
                          data-flash={bad ? flashKey : undefined}
                          className={cn(
                            'flex min-h-10 w-full min-w-20 items-center rounded-chip border-2 px-2 py-1 font-serif text-[1.05rem] transition-colors duration-200 outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                            hit && 'border-green bg-green-soft text-green-ink',
                            bad && 'border-red bg-red-soft text-red-ink',
                            !hit && !bad && active && 'border-accent border-dashed bg-accent-soft text-accent-ink',
                            !hit && !bad && !active && 'border-line-strong border-dashed bg-surface text-ink-muted hover:border-accent',
                          )}
                        >
                          {hit ? cell.fill : '…'}
                        </motion.button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!solved && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Vormen om te kiezen" lang="nl">
            {pool.map((form) => (
              <li key={form}>
                <button
                  type="button"
                  disabled={!target}
                  onClick={() => choose(form)}
                  className="min-h-11 rounded-control border-2 border-line-strong bg-surface px-3 font-serif text-[1.05rem] text-ink shadow-slab-sm transition-colors duration-200 outline-none hover:border-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-50"
                >
                  {form}
                </button>
              </li>
            ))}
          </ul>
        )}
      </TaskBox>
    </div>
  );
}
