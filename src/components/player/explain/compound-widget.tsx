'use client';

import { ArrowRight, Blocks, Check, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { Panel } from '@/content/schema';
import { THINGS, thingIcon, type ThingId } from '@/content/things';
import { fingerprint } from '@/engine/hash';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { speak } from '@/lib/speech';
import { ToyCanvas } from '@/lib/toy3d/toy-canvas';
import { Button } from '@/components/ui/button';
import { Tile } from '../tile';
import { TaskBox } from '../steps/shared';
import { ICON, useFlash, useSolve, type WidgetProps } from './widgets';

/**
 * Samenstellingen in 3D. Op tafel staan echte voorwerpen (Meshy-modellen). Kies het eerste en
 * het tweede deel, kies de spelling van de naad, en de twee smelten samen tot het nieuwe ding.
 * Kies je de delen andersom, dan is het andere deel de baas: het hoofd staat rechts.
 * Alles gaat ook met de knoppen onder de tafel; zonder WebGL staan daar de iconen.
 */
type Round = NonNullable<Panel['compound']>['rounds'][number];

const loadBench = () => import('@/lib/toy3d/scenes/compound').then((module) => module.compoundScene);

/** Vaste volgorde per ronde (geen toeval: zo ziet iedereen hetzelfde en blijft het testbaar). */
function shuffled<T>(items: readonly T[], seed: string): T[] {
  return items
    .map((item, i) => ({ item, key: fingerprint(`${seed}:${i}`) }))
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(({ item }) => item);
}

/** De voorwerpen op tafel: de twee delen en twee delen uit andere rondes als afleiders. */
export function shelfFor(rounds: readonly Round[], index: number): ThingId[] {
  const round = rounds[index]!;
  const others = rounds.flatMap((other, i) => (i === index ? [] : other.parts)).filter((id) => !round.parts.includes(id) && id !== round.result);
  const extra = shuffled([...new Set(others)], round.answer).slice(0, 2);
  return shuffled([...round.parts, ...extra], `${round.answer}:tafel`);
}

/** Wat een gekozen paar betekent. */
export function judgePair(round: Round, pair: readonly ThingId[]): 'goed' | 'andersom' | 'fout' {
  const [first, second] = pair;
  if (first === round.parts[0] && second === round.parts[1]) return 'goed';
  if (first === round.parts[1] && second === round.parts[0]) return 'andersom';
  return 'fout';
}

function ThingIcon({ id, className }: { id: ThingId; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- kleine iconen uit /public, geen optimalisatie nodig
    <img src={thingIcon(id)} alt="" width={256} height={256} loading="lazy" decoding="async" className={cn('size-12 shrink-0 object-contain', className)} />
  );
}

type Phase = 'pick' | 'spell' | 'merged';

export function CompoundWidget({ data, solved, onSolved }: WidgetProps<'compound'>) {
  const calm = useCalmMotion();
  const last = data.rounds.length - 1;
  const [index, setIndex] = useState(solved ? last : 0);
  const [picked, setPicked] = useState<ThingId[]>(solved ? [...data.rounds[last]!.parts] : []);
  const [phase, setPhase] = useState<Phase>(solved ? 'merged' : 'pick');
  const [message, setMessage] = useState<string | null>(null);
  const [wrong, setWrong] = useState<{ id: ThingId; n: number } | null>(null);
  const [spelled, setSpelled] = useState<string | null>(solved ? data.rounds[last]!.answer : null);
  const spellFlash = useFlash<string>();
  const { box, solve } = useSolve(onSolved);
  const table = useRef<HTMLDivElement>(null);
  const reveal = useRef(false);
  const round = data.rounds[index]!;
  const shelf = shelfFor(data.rounds, index);

  // Op de telefoon staat de tafel na het spellen vaak boven beeld: schuif terug, zodat je de twee delen ziet samensmelten.
  useEffect(() => {
    if (!reveal.current) return;
    reveal.current = false;
    table.current?.scrollIntoView?.({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' });
  }, [phase, calm]);

  const shake = (id: ThingId, text: string) => {
    play('wrong');
    setWrong((current) => ({ id, n: (current?.n ?? 0) + 1 }));
    setMessage(text);
  };

  const pick = (id: ThingId) => {
    if (phase !== 'pick') return;
    if (picked.includes(id)) {
      play('remove');
      setPicked(picked.filter((other) => other !== id));
      return;
    }
    if (!round.parts.includes(id)) return shake(id, `Een ${THINGS[id].word} hoort hier niet bij. Zoek: ${round.clue.toLowerCase()}.`);
    const next = [...picked, id];
    if (next.length < 2) {
      play('place');
      setPicked(next);
      setMessage(null);
      return;
    }
    const verdict = judgePair(round, next);
    if (verdict === 'goed') {
      play('select');
      setPicked(next);
      setPhase('spell');
      setMessage(null);
    } else {
      setPicked([]);
      shake(id, round.swap ?? 'Andersom: dan is het andere deel de baas. Het laatste deel zegt wat het is.');
    }
  };

  const spell = (option: string) => {
    if (phase !== 'spell') return;
    if (option !== round.answer) {
      spellFlash.trigger(option);
      setMessage(`${option}? Kijk naar de naad tussen ${THINGS[round.parts[0]].word} en ${THINGS[round.parts[1]].word}.`);
      return;
    }
    setSpelled(option);
    setPhase('merged');
    setMessage(null);
    speak(round.answer);
    reveal.current = true;
    if (index === last) solve();
    else play('right');
  };

  const next = () => {
    play('tap');
    setIndex(index + 1);
    setPicked([]);
    setPhase('pick');
    setSpelled(null);
    setMessage(null);
  };

  const merged = phase === 'merged';
  const status =
    solved && index === last
      ? data.note
      : merged
        ? round.note
        : (message ?? (phase === 'spell' ? 'Hoe schrijf je de naad?' : 'Tik eerst het eerste deel, dan het tweede.'));

  return (
    <div ref={box}>
      <TaskBox icon={<Blocks aria-hidden className={ICON} strokeWidth={2.5} />} title={data.q ?? 'Bouw de samenstelling'} solved={solved} status={status}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-display text-body font-bold text-ink">
            <span className="text-ink-muted">Zoek: </span>
            {round.clue}
          </p>
          <p className="text-caption font-bold text-ink-muted tabular-nums">
            Ronde {index + 1} van {data.rounds.length}
          </p>
        </div>

        <div ref={table} className="scroll-mt-24 scroll-mb-4">
          <ToyCanvas
            load={loadBench}
            props={{ round: index, shelf, picked, result: merged ? round.result : null, wrong }}
            onTap={(id) => pick(id.slice('thing:'.length) as ThingId)}
            label={`Een tafel met ${shelf.map((id) => THINGS[id].label).join(', ')}.${merged ? ` In het midden: ${THINGS[round.result].label}.` : ''}`}
            className="-mx-2 mt-2 h-52 sm:h-72"
            fallback={
              <div className="grid size-full place-items-center">
                {merged ? <ThingIcon id={round.result} className="size-40" /> : <ThingIcon id={picked[0] ?? shelf[0]!} className="size-32 opacity-80" />}
              </div>
            }
          />
        </div>

        <div role="group" aria-label="Voorwerpen op tafel" className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {shelf.map((id) => {
            const order = picked.indexOf(id);
            return (
              <Tile
                key={`${index}:${id}`}
                size="block"
                aria-pressed={order >= 0}
                disabled={phase !== 'pick'}
                state={order >= 0 ? 'held' : wrong?.id === id && message ? 'wrong' : phase === 'pick' ? 'idle' : 'muted'}
                onClick={() => pick(id)}
                faceClassName="justify-center gap-2 px-2 py-1.5"
              >
                <ThingIcon id={id} className="size-10" />
                <span lang="nl">{THINGS[id].word}</span>
                {order >= 0 && (
                  <span
                    aria-hidden
                    className="ml-auto grid size-6 shrink-0 place-items-center rounded-full bg-accent font-sans text-caption font-extrabold text-accent-on"
                  >
                    {order + 1}
                  </span>
                )}
                <span className="sr-only">{order >= 0 ? `, gekozen als deel ${order + 1}` : ''}</span>
              </Tile>
            );
          })}
        </div>

        <div aria-live="polite" className="mt-4 flex min-h-12 flex-wrap items-center justify-center gap-2 font-serif text-[1.375rem] text-ink" lang="nl">
          <span
            className={cn(
              'rounded-control border-2 px-3 py-1',
              picked[0] ? 'border-accent-line bg-accent-soft' : 'border-dashed border-line-strong text-ink-muted',
            )}
          >
            {picked[0] ? THINGS[picked[0]].word : 'deel 1'}
          </span>
          <Plus aria-hidden className="size-5 text-ink-muted" strokeWidth={3} />
          <span
            className={cn(
              'rounded-control border-2 px-3 py-1',
              picked[1] ? 'border-accent-line bg-accent-soft' : 'border-dashed border-line-strong text-ink-muted',
            )}
          >
            {picked[1] ? THINGS[picked[1]].word : 'deel 2'}
          </span>
          <ArrowRight aria-hidden className="size-5 text-ink-muted" strokeWidth={3} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={spelled ?? 'leeg'}
              initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={transition.base}
              className={cn(
                'rounded-control border-2 px-3 py-1',
                spelled ? 'border-green bg-green-soft text-green-ink' : 'border-dashed border-line-strong text-ink-muted',
              )}
            >
              {spelled ?? '?'}
            </motion.span>
          </AnimatePresence>
        </div>

        {phase === 'spell' && (
          <div role="group" aria-label="Kies de spelling" className="mt-4 flex flex-wrap justify-center gap-2">
            {round.options.map((option) => (
              <Tile key={`${spellFlash.flashKey}:${option}`} state={spellFlash.flash === option ? 'wrong' : 'idle'} onClick={() => spell(option)}>
                <span lang="nl">{option}</span>
              </Tile>
            ))}
          </div>
        )}

        {merged && index < last && (
          <div className="mt-4 flex justify-center">
            <Button onClick={next}>
              Volgende samenstelling
              <ArrowRight aria-hidden className="size-4" strokeWidth={2.75} />
            </Button>
          </div>
        )}
        {merged && index === last && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-small font-bold text-green-ink">
            <Check aria-hidden className="size-4" strokeWidth={3} />
            Alle {data.rounds.length} samenstellingen gebouwd
          </p>
        )}
      </TaskBox>
    </div>
  );
}
