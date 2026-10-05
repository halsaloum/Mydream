'use client';

import { Input } from '@base-ui/react/input';
import { Bike, Check, Focus, LoaderCircle } from 'lucide-react';
import { AnimatePresence, motion, useAnimate } from 'motion/react';
import { useEffect, useId, useRef, useState, type CSSProperties, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { judgeAnswer, MODELS } from '@/content/models';
import { cn } from '@/lib/cn';
import { transition, useCalmMotion } from '@/lib/motion';
import { play } from '@/lib/sound';
import { Button } from '@/components/ui/button';
import { TaskBox } from '../steps/shared';
import { CONTROL, Controls } from './space-widgets';
import { ICON, SHAKE, useSolve, type WidgetProps } from './widgets';

/**
 * Een echt 3D-model (gemaakt met Meshy) om rond te draaien. Op het model staan genummerde stippen;
 * tik er een, en schrijf op hoe dat onderdeel heet. Het model draait met `<model-viewer>` (WebGL);
 * dat pakket laadt pas als deze opdracht op het scherm komt. Lukt 3D niet, dan blijft de opdracht
 * werken met de afbeelding en de knoppen onder het model.
 */

type ModelViewerElement = HTMLElement & { cameraTarget: string; fieldOfView: string; cameraOrbit: string; autoRotate: boolean };

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<HTMLAttributes<ModelViewerElement>, ModelViewerElement> & Record<string, unknown>;
    }
  }
}

type Part = WidgetProps<'model'>['data']['parts'][number];
type Load = 'loading' | 'ready' | 'failed';

/** Laadt `<model-viewer>` één keer, alleen in de browser. */
let viewerModule: Promise<unknown> | null = null;
function useViewer(): Load {
  const [state, setState] = useState<Load>('loading');
  useEffect(() => {
    let live = true;
    viewerModule ??= import('@google/model-viewer');
    viewerModule.then(
      () => live && setState('ready'),
      () => live && setState('failed'),
    );
    return () => {
      live = false;
    };
  }, []);
  return state;
}

const metres = ([x, y, z]: readonly [number, number, number]) => `${x}m ${y}m ${z}m`;

/** Draai het model en schrijf de onderdelen op. */
export function ModelWidget({ data, solved, onSolved }: WidgetProps<'model'>) {
  const calm = useCalmMotion();
  const model = MODELS[data.model];
  const viewer = useViewer();
  const element = useRef<ModelViewerElement>(null);
  const [shown, setShown] = useState(false);
  const [broken, setBroken] = useState(false);
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [wrong, setWrong] = useState<{ tip: string | null } | null>(null);
  const { box, solve } = useSolve(onSolved);
  const inputId = useId();
  const [shake, animate] = useAnimate<HTMLDivElement>();
  const found = solved ? data.parts.map((part) => part.id) : done;
  const part = data.parts.find((item) => item.id === current) ?? null;
  const number = (item: Part) => data.parts.indexOf(item) + 1;

  useEffect(() => {
    const node = element.current;
    if (!node || viewer !== 'ready') return;
    const onLoad = () => setShown(true);
    const onError = () => setBroken(true);
    const onCamera = (event: Event) => {
      if ((event as CustomEvent<{ source: string }>).detail?.source === 'user-interaction') setTouched(true);
    };
    node.addEventListener('load', onLoad);
    node.addEventListener('error', onError);
    node.addEventListener('camera-change', onCamera);
    return () => {
      node.removeEventListener('load', onLoad);
      node.removeEventListener('error', onError);
      node.removeEventListener('camera-change', onCamera);
    };
  }, [viewer]);

  const focus = (item: Part | null) => {
    const node = element.current;
    if (!node || !shown) return;
    node.cameraTarget = item ? metres(item.at) : 'auto auto auto';
    node.fieldOfView = item ? '16deg' : 'auto';
  };

  const choose = (item: Part) => {
    play('tap');
    setTouched(true);
    setCurrent(item.id);
    setTyped('');
    setWrong(null);
    focus(item);
  };

  const check = () => {
    if (!part || solved || found.includes(part.id)) return;
    const verdict = judgeAnswer(part, typed);
    if (!verdict.ok) {
      if (!typed.trim()) return;
      play('wrong');
      setWrong({ tip: verdict.tip ?? part.hint ?? null });
      if (!calm && shake.current) void animate(shake.current, SHAKE, { duration: 0.32 });
      return;
    }
    const next = [...done, part.id];
    setDone(next);
    setWrong(null);
    if (data.parts.every((item) => next.includes(item.id))) solve();
    else play('select');
  };

  const failed = viewer === 'failed' || broken;
  const spin = !calm && !touched && !solved;
  const left = data.parts.length - found.length;

  return (
    <div ref={box}>
      <TaskBox
        icon={<Bike aria-hidden className={ICON} strokeWidth={2.5} />}
        title={data.q}
        solved={solved}
        status={solved ? data.note : `${found.length} van ${data.parts.length} onderdelen goed${left > 0 && found.length > 0 ? `, nog ${left}` : ''}`}
      >
        <div
          className="relative mx-auto aspect-[4/3] w-full max-w-[34rem] overflow-hidden rounded-tile bg-[radial-gradient(ellipse_at_50%_45%,var(--color-surface)_0%,transparent_75%)]"
        >
          {viewer === 'ready' && !broken ? (
            <model-viewer
              ref={element}
              src={model.src}
              poster={model.poster}
              alt={model.alt}
              camera-orbit={model.orbit}
              camera-controls=""
              touch-action="pan-y"
              interaction-prompt="none"
              auto-rotate={spin ? '' : undefined}
              auto-rotate-delay="0"
              rotation-per-second="18deg"
              interpolation-decay={calm ? '20' : '120'}
              shadow-intensity="1"
              shadow-softness="0.9"
              exposure="1.05"
              environment-image="neutral"
              min-field-of-view="12deg"
              style={{ width: '100%', height: '100%', backgroundColor: 'transparent', '--poster-color': 'transparent' } as CSSProperties}
            >
              {data.parts.map((item) => {
                const ok = found.includes(item.id);
                const active = current === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    slot={`hotspot-${item.id}`}
                    data-position={metres(item.at)}
                    data-normal={item.normal ? metres(item.normal) : undefined}
                    aria-label={`Onderdeel ${number(item)}${ok ? `: ${item.answer}` : ''}`}
                    aria-pressed={active}
                    onClick={() => choose(item)}
                    className={cn(
                      'slab grid h-8 min-w-8 place-items-center rounded-full border-2 px-1.5 text-small leading-none font-bold whitespace-nowrap opacity-55 transition-[opacity,background-color,border-color,color] duration-200 [--lift:2px] outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus data-[visible]:opacity-100',
                      ok ? 'border-green bg-green text-green-on [--slab:var(--color-green-deep)]' : 'border-accent bg-surface text-accent-ink [--slab:var(--accent)]',
                      active && !ok && 'bg-accent text-accent-on opacity-100',
                      active && 'opacity-100',
                    )}
                  >
                    {ok ? (
                      <span lang="nl" className="font-serif text-[0.95rem] font-normal">
                        {item.answer}
                      </span>
                    ) : (
                      number(item)
                    )}
                  </button>
                );
              })}
            </model-viewer>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={model.poster} alt={model.alt} className="size-full object-contain" />
          )}
          {viewer === 'ready' && !shown && !broken && (
            <span className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5 text-caption font-semibold text-ink-muted">
              <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" strokeWidth={2.5} />
              3D-model laden…
            </span>
          )}
        </div>
        <p aria-hidden className="mt-1 text-center text-caption font-semibold text-ink-muted">
          {failed ? '3D lukt hier niet; kies een onderdeel met de knoppen.' : 'Sleep om te draaien, knijp of scroll om te zoomen, tik een stip.'}
        </p>

        <Controls label="Kies een onderdeel">
          {data.parts.map((item) => {
            const ok = found.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={current === item.id}
                aria-label={`Onderdeel ${number(item)}${ok ? `: ${item.answer}, goed` : ''}`}
                onClick={() => choose(item)}
                className={cn(CONTROL, ok && 'border-green bg-green-soft text-green-ink')}
              >
                {ok && <Check aria-hidden className="size-4" strokeWidth={3} />}
                {ok ? <span lang="nl">{item.answer}</span> : `Stip ${number(item)}`}
              </button>
            );
          })}
          {shown && current && (
            <button
              type="button"
              onClick={() => {
                play('tap');
                setCurrent(null);
                focus(null);
              }}
              className={CONTROL}
            >
              <Focus aria-hidden className="size-4" strokeWidth={2.5} />
              Heel model
            </button>
          )}
        </Controls>

        <div aria-live="polite" className="mt-4 min-h-[6.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            {part ? (
              <motion.div
                key={part.id}
                initial={calm ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: transition.fast }}
                transition={transition.base}
                className="rounded-tile border-2 border-line bg-surface p-4"
              >
                <label htmlFor={inputId} className="block text-small font-bold text-ink">
                  <span className="mr-1.5 inline-grid size-6 place-items-center rounded-full bg-accent-soft text-caption text-accent-ink">{number(part)}</span>
                  {part.ask}
                </label>
                {found.includes(part.id) ? (
                  <p className="mt-3 text-small font-semibold text-green-ink">
                    <span lang="nl" className="font-serif text-example text-ink">
                      {part.answer}
                    </span>
                    <span className="mt-1 block">{part.note}</span>
                  </p>
                ) : (
                  <form
                    className="mt-3 flex flex-wrap items-center gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      check();
                    }}
                  >
                    <div ref={shake} className="min-w-0 flex-1">
                      <Input
                        id={inputId}
                        value={typed}
                        onValueChange={(value) => {
                          setTyped(value);
                          setWrong(null);
                        }}
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        enterKeyHint="done"
                        lang="nl"
                        placeholder="Typ het woord"
                        className={cn(
                          'w-full rounded-control border-2 bg-surface px-3 py-1.5 font-serif text-example outline-none transition-colors duration-200 placeholder:text-ink-muted/70 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
                          wrong ? 'border-red bg-red-soft text-red-ink' : 'border-accent text-accent-ink',
                        )}
                      />
                    </div>
                    <Button type="submit" variant="accent" size="sm">
                      Controleer
                    </Button>
                    {wrong && <p className="w-full text-small font-semibold text-red-ink">{wrong.tip ?? 'Nog niet goed. Kijk nog eens goed naar het onderdeel.'}</p>}
                  </form>
                )}
              </motion.div>
            ) : (
              <p className="text-small font-semibold text-ink-muted">Tik een stip op het model of een knop hierboven.</p>
            )}
          </AnimatePresence>
        </div>
      </TaskBox>
    </div>
  );
}
