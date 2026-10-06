'use client';

import { ArrowRight, Check, Drama, FlaskConical, Inbox, RotateCw } from 'lucide-react';
import { useState } from 'react';
import type { Panel } from '@/content/schema';
import { THINGS, thingIcon, type ThingId } from '@/content/things';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { speak } from '@/lib/speech';
import { ToyCanvas } from '@/lib/toy3d/toy-canvas';
import { Button } from '@/components/ui/button';
import { Tile } from '../tile';
import { TaskBox } from '../steps/shared';
import { ICON, useFlash, useSolve, type WidgetProps } from './widgets';

/**
 * Drie 3D-werkvormen met Meshy-voorwerpen: de sorteertafel (bakken en ringen), de vormmachine
 * (een morfeem doet wat het betekent) en het toneel (een kring die je ronddraait en waarin je
 * aantikt wat de zin vraagt). Het 3D-beeld is een tweede manier om te spelen: alles werkt ook
 * met de knoppen eronder, en zonder WebGL staan daar de iconen.
 */

const loadBins = () => import('@/lib/toy3d/scenes/bins').then((module) => module.binsScene);
const loadMorph = () => import('@/lib/toy3d/scenes/morph').then((module) => module.morphScene);
const loadCast = () => import('@/lib/toy3d/scenes/cast').then((module) => module.castScene);

/** De lak bij elke kleurnaam van de vormmachine. */
export const PAINT: Record<NonNullable<NonNullable<Panel['morph']>['rounds'][number]['paint']>, string> = {
  rood: '#e8423a',
  groen: '#4cb82a',
  blauw: '#2f8fe0',
  geel: '#ffd23f',
  oranje: '#ff9a1f',
  roze: '#ff8fc8',
  paars: '#9b5de5',
  goud: '#e0b02c',
  wit: '#f4f1ea',
  zwart: '#2b2b30',
};

function ThingIcon({ id, className }: { id: ThingId; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- kleine iconen uit /public, geen optimalisatie nodig
    <img src={thingIcon(id)} alt="" width={256} height={256} loading="lazy" decoding="async" className={cn('size-10 shrink-0 object-contain', className)} />
  );
}

/** Naam van een voorwerp op een knop. Twee voorwerpen met hetzelfde woord (bank, slot) krijgen voor schermlezers hun omschrijving erbij. */
function ThingName({ id }: { id: ThingId }) {
  const same = Object.values(THINGS).filter((thing) => thing.word === THINGS[id].word).length > 1;
  return (
    <>
      <span lang="nl">{THINGS[id].word}</span>
      {same && <span className="sr-only"> ({THINGS[id].label})</span>}
    </>
  );
}

const DRAG_HINT = 'Sleep opzij om rond te kijken.';

/* ---------------------------------------------------------------- sorteertafel */

export function BinsWidget({ data, solved, onSolved }: WidgetProps<'bins'>) {
  const [placed, setPlaced] = useState<(number | null)[]>(() => data.items.map((item) => (solved ? item.bin : null)));
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [wrong, setWrong] = useState<{ item: number; n: number } | null>(null);
  const [binFlash, setBinFlash] = useState<number | null>(null);
  const { box, solve } = useSolve(onSolved);
  const left = placed.filter((bin) => bin === null).length;

  const choose = (i: number) => {
    if (placed[i] !== null) return;
    play(selected === i ? 'remove' : 'select');
    setSelected(selected === i ? null : i);
    setMessage(null);
  };

  const drop = (bin: number) => {
    if (selected === null) {
      setMessage('Kies eerst een voorwerp.');
      return;
    }
    const item = data.items[selected]!;
    if (item.bin !== bin) {
      play('wrong');
      setWrong((current) => ({ item: selected, n: (current?.n ?? 0) + 1 }));
      setBinFlash(bin);
      window.setTimeout(() => setBinFlash(null), 560);
      setMessage(item.hint ?? `Een ${THINGS[item.thing].word} hoort niet bij ‘${data.bins[bin]}’. Kijk nog eens.`);
      return;
    }
    const next = placed.map((value, i) => (i === selected ? bin : value));
    setPlaced(next);
    setSelected(null);
    setMessage(item.note);
    if (next.every((value) => value !== null)) solve();
    else play('right');
  };

  const status = solved && left === 0 && message === null ? data.note : (message ?? (selected === null ? 'Kies een voorwerp.' : `Waar hoort ${THINGS[data.items[selected]!.thing].word} bij?`));

  return (
    <div ref={box}>
      <TaskBox icon={<Inbox aria-hidden className={ICON} strokeWidth={2.5} />} title={data.q ?? 'Zet elk voorwerp in de goede bak'} solved={solved} status={status}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-caption font-semibold text-ink-muted">{DRAG_HINT}</p>
          <p className="text-caption font-bold text-ink-muted tabular-nums">
            {data.items.length - left} van {data.items.length}
          </p>
        </div>
        <ToyCanvas
          load={loadBins}
          props={{ items: data.items.map((item) => item.thing), bins: data.bins, rings: data.rings ?? false, placed, selected, wrong }}
          onTap={(id) => {
            const [kind, value] = id.split(':');
            if (kind === 'item') choose(Number(value));
            if (kind === 'bin') drop(Number(value));
          }}
          label={`Een tafel met ${data.items.map((item) => THINGS[item.thing].label).join(', ')}, en ${data.rings ? 'ringen' : 'bakken'}: ${data.bins.join(', ')}.`}
          className={cn('-mx-2 mt-2', data.rings ? 'h-72 sm:h-96' : 'h-64 sm:h-80')}
          fallback={
            <div className="grid size-full place-items-center">
              <ThingIcon id={data.items[selected ?? Math.max(0, placed.indexOf(null))]!.thing} className="size-32 opacity-80" />
            </div>
          }
        />

        <div role="group" aria-label="Voorwerpen" className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {data.items.map((item, i) => {
            const bin = placed[i];
            return (
              <Tile
                key={item.thing}
                size="block"
                aria-pressed={selected === i}
                disabled={bin !== null}
                state={bin !== null ? 'correct' : selected === i ? 'held' : wrong?.item === i && message ? 'wrong' : 'idle'}
                onClick={() => choose(i)}
                faceClassName="justify-start gap-2 px-2 py-1.5 text-[1.0625rem]"
              >
                <ThingIcon id={item.thing} />
                <span className="flex min-w-0 flex-col items-start leading-tight break-words">
                  <ThingName id={item.thing} />
                  {bin != null && <span className="font-sans text-caption font-bold">{data.bins[bin]}</span>}
                </span>
              </Tile>
            );
          })}
        </div>

        <div role="group" aria-label="Bakken" className="mt-4 flex flex-wrap justify-center gap-2">
          {data.bins.map((bin, k) => (
            <Tile key={bin} aria-label={`Zet in: ${bin}`} state={binFlash === k ? 'wrong' : selected === null ? 'muted' : 'target'} onClick={() => drop(k)}>
              {bin}
            </Tile>
          ))}
        </div>
      </TaskBox>
    </div>
  );
}

/* ---------------------------------------------------------------- vormmachine */

export function MorphWidget({ data, solved, onSolved }: WidgetProps<'morph'>) {
  const last = data.rounds.length - 1;
  const [index, setIndex] = useState(solved ? last : 0);
  const [done, setDone] = useState(solved);
  const [wrongs, setWrongs] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const flash = useFlash<string>();
  const { box, solve } = useSolve(onSolved);
  const round = data.rounds[index]!;

  const pick = (option: string) => {
    if (done) return;
    if (option !== round.answer) {
      flash.trigger(option);
      setWrongs(wrongs + 1);
      setMessage(`${option}? Nog niet. Kijk naar ${round.from}.`);
      return;
    }
    setDone(true);
    setMessage(null);
    speak(round.answer);
    if (index === last) solve();
    else play('right');
  };

  const next = () => {
    play('tap');
    setIndex(index + 1);
    setDone(false);
    setMessage(null);
  };

  const status = solved && index === last ? data.note : done ? round.note : (message ?? 'Kies de goede vorm.');

  return (
    <div ref={box}>
      <TaskBox icon={<FlaskConical aria-hidden className={ICON} strokeWidth={2.5} />} title={data.q ?? 'Kies de goede vorm'} solved={solved} status={status}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-display text-body font-bold text-ink" lang="nl">
            <span className="text-ink-muted">{round.from}</span>
            <ArrowRight aria-hidden className="mx-1.5 inline size-4 text-ink-muted" strokeWidth={3} />
            {round.ask}
          </p>
          <p className="text-caption font-bold text-ink-muted tabular-nums">
            Ronde {index + 1} van {data.rounds.length}
          </p>
        </div>
        <ToyCanvas
          load={loadMorph}
          props={{ round: index, thing: round.thing, effect: round.effect, color: round.paint ? PAINT[round.paint] : null, done, wrong: wrongs }}
          label={`${THINGS[round.thing].label} op een draaischijf.`}
          className="-mx-2 mt-2 h-52 sm:h-64"
          fallback={
            <div className="grid size-full place-items-center">
              <ThingIcon id={round.thing} className={cn('size-32 transition-transform duration-500', done && round.effect === 'klein' && 'scale-50')} />
            </div>
          }
        />
        <div role="group" aria-label="Kies de vorm" className="mt-3 flex flex-wrap justify-center gap-2">
          {round.options.map((option) => (
            <Tile
              key={`${index}:${flash.flashKey}:${option}`}
              disabled={done}
              state={done ? (option === round.answer ? 'correct' : 'muted') : flash.flash === option ? 'wrong' : 'idle'}
              onClick={() => pick(option)}
            >
              <span lang="nl">{option}</span>
            </Tile>
          ))}
        </div>
        {done && index < last && (
          <div className="mt-4 flex justify-center">
            <Button onClick={next}>
              Volgende
              <ArrowRight aria-hidden className="size-4" strokeWidth={2.75} />
            </Button>
          </div>
        )}
        {done && index === last && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-small font-bold text-green-ink">
            <Check aria-hidden className="size-4" strokeWidth={3} />
            Alle {data.rounds.length} vormen gemaakt
          </p>
        )}
      </TaskBox>
    </div>
  );
}

/* ---------------------------------------------------------------- toneel */

type Phase = 'tap' | 'then' | 'done';

const sameSet = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((value) => b.includes(value));

export function CastWidget({ data, solved, onSolved }: WidgetProps<'cast'>) {
  const last = data.rounds.length - 1;
  const [index, setIndex] = useState(solved ? last : 0);
  const [selected, setSelected] = useState<ThingId[]>(solved ? [...data.rounds[last]!.answer] : []);
  const [phase, setPhase] = useState<Phase>(solved ? 'done' : 'tap');
  const [message, setMessage] = useState<string | null>(null);
  const [wrong, setWrong] = useState<{ id: ThingId; n: number } | null>(null);
  const thenFlash = useFlash<string>();
  const { box, solve } = useSolve(onSolved);
  const round = data.rounds[index]!;
  const single = round.answer.length === 1;

  const finish = () => {
    setMessage(null);
    if (index === last) solve();
    else play('right');
    setPhase('done');
  };

  const right = () => {
    if (round.then) {
      play('select');
      setPhase('then');
      setMessage(null);
    } else finish();
  };

  const miss = (id: ThingId | null, text: string) => {
    play('wrong');
    if (id) setWrong((current) => ({ id, n: (current?.n ?? 0) + 1 }));
    setMessage(text);
  };

  const tap = (id: ThingId) => {
    if (phase !== 'tap') return;
    if (single) {
      if (id === round.answer[0]) {
        setSelected([id]);
        right();
      } else miss(id, `Niet ${THINGS[id].word}. ${round.ask}.`);
      return;
    }
    play(selected.includes(id) ? 'remove' : 'place');
    setSelected(selected.includes(id) ? selected.filter((other) => other !== id) : [...selected, id]);
    setMessage(null);
  };

  const check = (choice: ThingId[]) => {
    if (phase !== 'tap') return;
    if (sameSet(choice, round.answer)) {
      setSelected(choice);
      return right();
    }
    const extra = choice.filter((id) => !round.answer.includes(id));
    const missing = round.answer.filter((id) => !choice.includes(id));
    if (extra.length) {
      setSelected(choice.filter((id) => round.answer.includes(id)));
      return miss(extra[0]!, `${THINGS[extra[0]!].word} hoort er niet bij.`);
    }
    miss(null, choice.length === 0 ? 'Er hoort wel iets bij. Kijk nog eens.' : `Er ontbreekt nog ${missing.length === 1 ? 'één' : missing.length}.`);
  };

  const answerThen = (option: string) => {
    if (phase !== 'then' || !round.then) return;
    if (option !== round.then.answer) {
      thenFlash.trigger(option);
      setMessage(`${option}? Nog niet.`);
      return;
    }
    finish();
  };

  const next = () => {
    play('tap');
    setIndex(index + 1);
    setSelected([]);
    setPhase('tap');
    setMessage(null);
  };

  const done = phase === 'done';
  const shown = phase === 'tap' ? [] : round.answer;
  const focus = phase === 'tap' ? null : (round.focus ?? round.answer[0] ?? null);
  const status =
    solved && index === last
      ? data.note
      : done
        ? round.note
        : (message ?? (phase === 'then' ? round.then?.q : single ? `${round.ask}.` : `${round.ask}, en tik dan op Klaar.`));

  return (
    <div ref={box}>
      <TaskBox icon={<Drama aria-hidden className={ICON} strokeWidth={2.5} />} title={data.q ?? 'Tik aan wat de zin vraagt'} solved={solved} status={status}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-serif text-[1.25rem] leading-snug text-ink" lang="nl">
            {round.text}
          </p>
          <p className="text-caption font-bold text-ink-muted tabular-nums">
            Ronde {index + 1} van {data.rounds.length}
          </p>
        </div>
        <p className="mt-1 text-small font-bold text-accent-ink">{round.ask}</p>
        <ToyCanvas
          load={loadCast}
          props={{ round: index, cast: round.cast, selected, solved: shown, focus, wrong }}
          onTap={(id) => tap(id.slice('cast:'.length) as ThingId)}
          label={`Een draaiende kring met ${round.cast.map((id) => THINGS[id].label).join(', ')}.`}
          className="-mx-2 mt-2 h-60 sm:h-80"
          fallback={
            <div className="grid size-full place-items-center">
              <ThingIcon id={focus ?? round.cast[0]!} className="size-32 opacity-80" />
            </div>
          }
        />
        <p className="flex items-center justify-center gap-1.5 text-caption font-semibold text-ink-muted">
          <RotateCw aria-hidden className="size-3.5" strokeWidth={2.5} />
          {DRAG_HINT}
        </p>

        <div role="group" aria-label="Voorwerpen in de kring" className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {round.cast.map((id) => {
            const on = selected.includes(id);
            return (
              <Tile
                key={`${index}:${id}`}
                size="block"
                aria-pressed={on}
                disabled={phase !== 'tap'}
                state={phase !== 'tap' ? (round.answer.includes(id) ? 'correct' : 'muted') : on ? 'held' : wrong?.id === id && message ? 'wrong' : 'idle'}
                onClick={() => tap(id)}
                faceClassName="justify-start gap-2 px-2 py-1.5 text-[1.0625rem]"
              >
                <ThingIcon id={id} />
                <ThingName id={id} />
              </Tile>
            );
          })}
        </div>

        {phase === 'tap' && !single && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button variant="secondary" onClick={() => check([])}>
              Niets
            </Button>
            <Button disabled={selected.length === 0} onClick={() => check(selected)}>
              Klaar
              <Check aria-hidden className="size-4" strokeWidth={2.75} />
            </Button>
          </div>
        )}

        {phase === 'then' && round.then && (
          <div role="group" aria-label={round.then.q} className="mt-4 flex flex-wrap justify-center gap-2">
            {round.then.options.map((option) => (
              <Tile key={`${thenFlash.flashKey}:${option}`} state={thenFlash.flash === option ? 'wrong' : 'idle'} onClick={() => answerThen(option)}>
                <span lang="nl">{option}</span>
              </Tile>
            ))}
          </div>
        )}

        {done && index < last && (
          <div className="mt-4 flex justify-center">
            <Button onClick={next}>
              Volgende
              <ArrowRight aria-hidden className="size-4" strokeWidth={2.75} />
            </Button>
          </div>
        )}
        {done && index === last && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-small font-bold text-green-ink">
            <Check aria-hidden className="size-4" strokeWidth={3} />
            Alle {data.rounds.length} rondes gedaan
          </p>
        )}
      </TaskBox>
    </div>
  );
}
