'use client';

import { Brackets } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { tokenize } from '@/content/text';
import { cn } from '@/lib/cn';
import { useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { TaskBox } from '../steps/shared';
import { ICON, SHAKE, useFlash, useSolve, type WidgetProps } from './widgets';

/**
 * Experiment voor het niveau "De woordgroep": de groepenjager. De leerling tikt het eerste en
 * het laatste woord van een woordgroep aan. Een gevonden groep krijgt haar soort en kern; een
 * stuk dat over een groepsgrens loopt, wordt uitgelegd. Opgelost als alle gevraagde groepen er zijn.
 */

type Group = WidgetProps<'phrase'>['data']['groups'][number];

const keyOf = (from: number, to: number) => `${from}-${to}`;

export function PhraseWidget({ data, solved, onSolved }: WidgetProps<'phrase'>) {
  const words = tokenize(data.sentence);
  const [found, setFound] = useState<string[]>([]);
  const [anchor, setAnchor] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { flash, flashKey, trigger } = useFlash<string>();
  const { box, solve } = useSolve(onSolved);
  const calm = useCalmMotion();

  const done = solved ? data.groups.map((group) => keyOf(...group.span)) : found;
  const shownGroups = data.groups.filter((group) => done.includes(keyOf(...group.span)));
  // Leestekens aan de rand horen bij de zin, niet bij de groep.
  const text = (from: number, to: number) =>
    words
      .slice(from, to + 1)
      .join(' ')
      .replace(/^[“‘"(]+|[.,;:!?”’")]+$/gu, '');
  const describe = (group: Group) => `[${text(...group.span)}] · ${group.cat} · kern: ${text(group.head, group.head)}`;
  const flashed = flash?.split('-').map(Number);

  const tap = (i: number) => {
    if (solved) return;
    if (anchor === null) {
      setAnchor(i);
      setMessage(`Begin bij “${words[i] ?? ''}”. Tik nu het laatste woord van de groep (of hetzelfde woord voor een groep van één woord).`);
      play('select');
      return;
    }
    const from = Math.min(anchor, i);
    const to = Math.max(anchor, i);
    const key = keyOf(from, to);
    setAnchor(null);
    const group = data.groups.find((candidate) => keyOf(...candidate.span) === key);
    if (group) {
      if (found.includes(key)) {
        setMessage(`[${text(from, to)}] had je al gevonden.`);
        return;
      }
      const next = [...found, key];
      setFound(next);
      setMessage(`${describe(group)}. ${group.note}`);
      if (next.length === data.groups.length) solve();
      else play('place');
      return;
    }
    trigger(key);
    const trap = data.traps?.find((candidate) => keyOf(...candidate.span) === key);
    setMessage(trap ? trap.note : `[${text(from, to)}] is geen van de gezochte groepen. Kun je het hele stuk vooraan zetten of door één woord vervangen?`);
  };

  const progress = `${shownGroups.length} van ${data.groups.length} gevonden`;
  const status = solved ? data.note : message ? `${message} · ${progress}` : `Tik het eerste en dan het laatste woord van een groep. ${progress}.`;

  return (
    <div ref={box}>
      <TaskBox icon={<Brackets aria-hidden className={ICON} strokeWidth={2.5} />} title={data.q ?? 'Vind de woordgroepen'} solved={solved} status={status}>
        <p className="font-serif text-example leading-[2.1] text-ink" lang="nl">
          {words.map((word, i) => {
            const inGroup = shownGroups.some((group) => group.span[0] <= i && i <= group.span[1]);
            const isHead = shownGroups.some((group) => group.head === i);
            const isAnchor = anchor === i;
            const bad = flashed !== undefined && flashed[0]! <= i && i <= flashed[1]!;
            return (
              <span key={i}>
                <motion.button
                  type="button"
                  aria-pressed={isAnchor}
                  disabled={solved}
                  onClick={() => tap(i)}
                  animate={bad && !calm ? SHAKE : { x: 0 }}
                  transition={{ duration: 0.32 }}
                  data-flash={bad ? flashKey : undefined}
                  className={cn(
                    'rounded-chip px-1.5 transition-colors duration-200 outline-none focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-focus',
                    inGroup && 'shadow-[inset_0_-0.28em_0_var(--accent-line)]',
                    isHead && 'font-bold text-accent-ink',
                    isAnchor && 'bg-accent text-accent-on',
                    bad && 'bg-red-soft text-red-ink',
                    !isAnchor && !bad && !solved && 'hover:bg-surface',
                  )}
                >
                  {word}
                </motion.button>{' '}
              </span>
            );
          })}
        </p>
        {shownGroups.length > 0 && (
          <ul className="mt-3 space-y-1.5" aria-label="Gevonden groepen">
            {data.groups
              .filter((group) => shownGroups.includes(group))
              .map((group) => (
                <li key={keyOf(...group.span)} className="flex flex-wrap items-baseline gap-x-2 text-small text-ink-soft">
                  <span className="font-serif text-body text-ink" lang="nl">
                    [{text(...group.span)}]
                  </span>
                  <span className="rounded-chip bg-accent-soft px-1.5 font-extrabold text-accent-ink">{group.cat}</span>
                  <span>kern: {text(group.head, group.head)}</span>
                </li>
              ))}
          </ul>
        )}
      </TaskBox>
    </div>
  );
}
