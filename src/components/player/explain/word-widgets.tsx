'use client';

import { Plus, Workflow } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { isNode, parseBracket, spanText, type BracketTree, type Span } from '@/content/bracket';
import { cn } from '@/lib/cn';
import { useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { TaskBox } from '../steps/shared';
import { ICON, SHAKE, useFlash, useSolve, type WidgetProps } from './widgets';

/**
 * Experiment voor het betekenisvolle woorddeel: de woordboom. De leerling plakt steeds twee
 * buren aan elkaar; alleen stappen die in de boom staan lukken. Zo bouw je een woord van
 * binnen naar buiten op, en zie je dat de volgorde van plakken betekenis heeft.
 */

type Info = WidgetProps<'bracket'>['data']['nodes'][number];

/** Een stuk als geneste doos: bladeren als letters, knopen als kader met hun woordsoort. */
function Piece({ tree, span, info, solved, words }: { tree: BracketTree; span: Span; info: Map<string, Info>; solved: boolean; words: boolean }) {
  if (span.to - span.from === 1)
    return <span className={cn('px-0.5 font-serif leading-none text-ink', words ? 'text-[1.15rem]' : 'text-[1.35rem]')}>{tree.leaves[span.from]}</span>;
  const node = tree.nodes.find((candidate) => candidate.from === span.from && candidate.to === span.to);
  if (!node) return null;
  const meta = info.get(spanText(tree, span, words));
  return (
    <span className={cn('inline-flex flex-col items-center rounded-chip border-2 px-1 pt-1 pb-0.5', solved ? 'border-green-line bg-green-soft' : 'border-accent bg-accent-soft')}>
      <span className="flex items-center gap-1">
        <Piece tree={tree} span={{ from: node.from, to: node.split }} info={info} solved={solved} words={words} />
        <Piece tree={tree} span={{ from: node.split, to: node.to }} info={info} solved={solved} words={words} />
      </span>
      {meta && <span className={cn('mt-0.5 text-[0.6875rem] leading-none font-extrabold', solved ? 'text-green-ink' : 'text-accent-ink')}>{meta.cat}</span>}
    </span>
  );
}

/**
 * Plak twee buren aan elkaar tot het hele woord staat. Opgelost als de boom compleet is.
 * Met `words` zijn de bladeren hele woorden en bouw je zo een woordgroep op.
 */
export function BracketWidget({ data, solved, onSolved }: WidgetProps<'bracket'>) {
  const words = data.words ?? false;
  const tree = useMemo(() => parseBracket(data.tree), [data.tree]);
  const info = useMemo(() => new Map(data.nodes.map((node) => [node.w, node])), [data.nodes]);
  const leafSpans = useMemo(() => tree?.leaves.map((_, i) => ({ from: i, to: i + 1 })) ?? [], [tree]);
  const [units, setUnits] = useState<Span[]>(leafSpans);
  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { flash, flashKey, trigger } = useFlash<number>();
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();
  if (!tree) return null;

  const root = { from: 0, to: tree.leaves.length };
  const shown = solved ? [root] : units;
  const label = (span: Span) => {
    const text = spanText(tree, span, words);
    return info.get(text)?.form ?? text;
  };

  const join = (i: number) => {
    const left = units[i];
    const right = units[i + 1];
    if (solved || !left || !right) return;
    const merged = { from: left.from, to: right.to };
    const text = spanText(tree, merged, words);
    if (!isNode(tree, merged)) {
      trigger(i);
      const trap = data.traps?.find((candidate) => candidate.w === text);
      setMessage(trap ? trap.note : `${label(left)} + ${label(right)} is geen stap in dit woord. Welke twee horen eerst bij elkaar?`);
      return;
    }
    const next = [...units.slice(0, i), merged, ...units.slice(i + 2)];
    const meta = info.get(text);
    setUnits(next);
    setLog([...log, `${label(left)} + ${label(right)} → ${label(merged)}${meta ? ` (${meta.cat})` : ''}`]);
    setMessage(meta ? `${label(merged)}: ${meta.note}` : null);
    if (next.length === 1) solve();
    else play('place');
  };

  const status = solved ? data.note : (message ?? 'Tik op een plusje om twee buren aan elkaar te plakken. Begin bij de kern.');
  const title = data.q ?? (words ? 'Bouw de woordgroep van binnen naar buiten' : 'Bouw het woord van binnen naar buiten');

  return (
    <div ref={box}>
      <TaskBox icon={<Workflow aria-hidden className={ICON} strokeWidth={2.5} />} title={title} solved={solved} status={status}>
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <ol className="mx-auto flex w-max items-end gap-1" aria-label={words ? 'Stukken van de woordgroep' : 'Stukken van het woord'} lang="nl">
            {shown.map((span, i) => {
              const bad = flash === i || flash === i - 1;
              return (
                <li key={`${span.from}-${span.to}`} className="flex items-end gap-1">
                  <motion.span
                    animate={bad && !calm ? SHAKE : { x: 0 }}
                    transition={{ duration: 0.32 }}
                    data-flash={bad ? flashKey : undefined}
                    className={cn(
                      'inline-flex min-h-11 items-center rounded-control border-2 px-1.5 py-1',
                      bad ? 'border-red bg-red-soft' : span.to - span.from === 1 ? 'border-line-strong bg-surface' : 'border-transparent',
                    )}
                  >
                    <Piece tree={tree} span={span} info={info} solved={solved} words={words} />
                  </motion.span>
                  {!solved && i < shown.length - 1 && (
                    <button
                      type="button"
                      aria-label={`Plak ${label(span)} en ${label(shown[i + 1] ?? span)}`}
                      onClick={() => join(i)}
                      className="mb-2.5 grid size-8 place-items-center rounded-full border-2 border-line-strong bg-surface text-ink-soft transition-colors duration-200 outline-none hover:border-accent hover:text-accent-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      <Plus aria-hidden className="size-4" strokeWidth={3} />
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        {log.length > 0 && (
          <ol className="mt-3 space-y-1 text-small text-ink-soft" aria-label="Plakstappen">
            {log.map((line, i) => (
              <li key={i} className="tabular-nums">
                <span className="font-extrabold text-ink-muted">{i + 1}.</span> {line}
              </li>
            ))}
          </ol>
        )}
      </TaskBox>
    </div>
  );
}
