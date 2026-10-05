'use client';

import { Eye, FlipHorizontal2, FlipVertical2, Move3d, RotateCw, Rotate3d } from 'lucide-react';
import { AnimatePresence, motion, useTransform, type MotionValue } from 'motion/react';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { flipLetter, poseOf, type FlipLetter } from '@/content/flip';
import { VOWEL_INFO, type Vowel } from '@/content/vowels';
import { cn } from '@/lib/cn';
import { spring, transition, useCalmMotion } from '@/lib/motion';
import { useOrbit, type Orbit } from '@/lib/orbit';
import { play } from '@/lib/sound';
import { TaskBox } from '../steps/shared';
import { MONOPHTHONGS, SoundCard, VOWEL_SPOTS } from './sound-widgets';
import { ICON, SHAKE, useFlash, useSolve, type WidgetProps } from './widgets';

/**
 * Experimenten in 3D, alleen waar de derde dimensie iets uitlegt: de klinkerruimte (ronding
 * als derde as naast hoogte en voor-achter) en de draaitegel (b, d, p en q zijn één voorwerp
 * in vier standen). Gebouwd met CSS-3D: alles blijft echte knoppen en tekst, werkt met
 * aanraken, muis en toetsenbord, en staat stil bij rustige beweging.
 */

/** Gedeelde knopstijl voor de standen en bewegingen onder een 3D-ruimte. */
const CONTROL =
  'slab inline-flex min-h-10 items-center gap-1.5 rounded-control border-2 border-line-strong bg-surface px-3 text-small font-bold text-ink transition-[background-color,border-color,color] duration-200 [--lift:2px] outline-none hover:border-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent-ink';

/** Een rij knoppen onder de ruimte. */
function Controls({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="mt-3 flex flex-wrap items-center justify-center gap-2">
      {children}
    </div>
  );
}

/** De draaibare bühne: perspectief, slepen, pijltjestoetsen. */
function Stage({ orbit, label, className, style, children }: { orbit: Orbit; label: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div
      tabIndex={0}
      role="group"
      aria-roledescription="3D-ruimte"
      aria-label={`${label} Sleep of gebruik de pijltjestoetsen om te draaien.`}
      {...orbit.bind}
      style={style}
      className={cn(
        'relative cursor-grab touch-pan-y select-none [perspective:1100px] outline-none active:cursor-grabbing focus-visible:rounded-tile focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Hint onder een 3D-ruimte. */
function DragHint() {
  return (
    <p aria-hidden className="mt-1 flex items-center justify-center gap-1.5 text-caption font-semibold text-ink-muted">
      <Move3d className="size-4" strokeWidth={2.5} />
      Sleep om te draaien
    </p>
  );
}

/* ------------------------------------------------------------------ klinkerruimte */

type Monophthong = (typeof MONOPHTHONGS)[number];

/** Ronde klinkers: de lippen bepalen de derde as. */
const ROUND = new Set<Vowel>(['y', 'ʏ', 'øː', 'u', 'oː', 'ɔ']);

/**
 * Plek in de ruimte, in eenheden van de breedte van de kaart (−0,5 … 0,5). Hoogte en
 * voor-achter komen van de platte klinkerkaart. Daar staan *uu* en *eu* een stukje opzij van
 * *ie* en *ee*, omdat een plat vlak geen ronding kan tonen; hier krijgen ze dezelfde
 * tongstand en liggen ze erachter, in het vlak van de ronde lippen.
 */
const PARTNER: Partial<Record<Vowel, Vowel>> = { y: 'i', øː: 'eː' };
const DEPTH = 0.34;

function spacePoint(vowel: Monophthong): [number, number, number] {
  const spot = VOWEL_SPOTS[PARTNER[vowel] ?? vowel];
  const height = VOWEL_SPOTS[vowel].y;
  return [(spot.x - 206) / 332, (height - 178) / 332, ROUND.has(vowel) ? -DEPTH : DEPTH];
}

/** Een punt na het draaien van de ruimte: hoe ver naar voren (−1 … 1), voor diepte en vervagen. */
function depthOf([x, y, z]: readonly [number, number, number], rx: number, ry: number) {
  const a = (rx * Math.PI) / 180;
  const b = (ry * Math.PI) / 180;
  const z1 = -x * Math.sin(b) + z * Math.cos(b);
  return y * Math.sin(a) + z1 * Math.cos(a);
}

/** Zet iets op een plek in de ruimte en draai het naar de kijker (een "bordje"). */
function useBillboard(orbit: Orbit, [x, y, z]: readonly [number, number, number]) {
  return useTransform(
    [orbit.rotateX, orbit.rotateY] as MotionValue<number>[],
    ([rx, ry]: number[]) =>
      `translate3d(calc(var(--s) * ${x}), calc(var(--s) * ${y}), calc(var(--s) * ${z})) rotateY(${-(ry ?? 0)}deg) rotateX(${-(rx ?? 0)}deg) translate(-50%, -50%)`,
  );
}

function SpaceLabel({ orbit, at, children, className }: { orbit: Orbit; at: readonly [number, number, number]; children: ReactNode; className?: string }) {
  const transform = useBillboard(orbit, at);
  return (
    <motion.span
      aria-hidden
      style={{ transform }}
      className={cn('pointer-events-none absolute top-0 left-0 origin-top-left text-caption leading-none font-bold whitespace-nowrap text-ink-muted', className)}
    >
      {children}
    </motion.span>
  );
}

function SpacePoint({
  orbit,
  vowel,
  hit,
  bad,
  current,
  flashKey,
  onTap,
}: {
  orbit: Orbit;
  vowel: Monophthong;
  hit: boolean;
  bad: boolean;
  current: boolean;
  flashKey: number;
  onTap: () => void;
}) {
  const calm = useCalmMotion();
  const at = spacePoint(vowel);
  const transform = useBillboard(orbit, at);
  // Wat achteraan ligt, wordt iets lichter: zo lees je de diepte ook zonder te draaien.
  const opacity = useTransform([orbit.rotateX, orbit.rotateY] as MotionValue<number>[], ([rx, ry]: number[]) => {
    const depth = depthOf(at, rx ?? 0, ry ?? 0);
    return 0.5 + 0.5 * Math.min(1, Math.max(0, (depth + 0.55) / 1.1));
  });
  const info = VOWEL_INFO[vowel];
  return (
    <motion.div style={{ transform }} className="absolute top-0 left-0 origin-top-left">
      <motion.button
        type="button"
        aria-pressed={hit}
        aria-label={`/${vowel}/ zoals in ${info.word}, ${ROUND.has(vowel) ? 'ronde lippen' : 'platte lippen'}${hit ? ', gevonden' : ''}`}
        onClick={onTap}
        animate={bad && !calm ? SHAKE : { x: 0 }}
        transition={{ duration: 0.32 }}
        data-flash={bad ? flashKey : undefined}
        style={{ opacity: hit || current || bad ? 1 : opacity }}
        className={cn(
          'slab grid h-9 min-w-9 place-items-center rounded-full border-2 px-1.5 font-serif text-[1.15rem] leading-none transition-[background-color,border-color,color,box-shadow] duration-200 [--lift:3px] outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus @min-[24rem]:h-10 @min-[24rem]:min-w-10 @min-[24rem]:text-[1.3rem]',
          hit && 'border-green bg-green text-green-on [--slab:var(--color-green-deep)]',
          bad && 'border-red bg-red-soft text-red-ink [--slab:var(--color-red)]',
          !hit && !bad && 'border-line-strong bg-surface text-ink hover:border-accent',
          current && !hit && !bad && 'border-accent bg-accent-soft text-accent-ink [--slab:var(--accent)]',
        )}
      >
        {vowel}
      </motion.button>
    </motion.div>
  );
}

/** Een vlak van de ruimte: de klinkerkaart als trapezium, voor de platte of de ronde lippen. */
function SpacePlane({ z, round }: { z: number; round: boolean }) {
  return (
    <div
      aria-hidden
      style={{ transform: `translateZ(calc(var(--s) * ${z})) translate(-50%, -50%)` }}
      className="pointer-events-none absolute top-0 left-0 h-[calc(var(--s)*0.916)] w-(--s) origin-top-left"
    >
      <svg viewBox="40 26 332 304" preserveAspectRatio="none" className="size-full overflow-visible">
        <polygon
          points="40,26 372,26 372,330 150,330"
          fill={round ? 'var(--color-purple-soft)' : 'var(--color-surface)'}
          fillOpacity={round ? 0.72 : 0.6}
          stroke={round ? 'var(--color-purple)' : 'var(--color-line-strong)'}
          strokeWidth="3"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <line x1="86" y1="154" x2="372" y2="154" stroke="var(--color-line)" strokeWidth="2" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
        <line x1="124" y1="260" x2="372" y2="260" stroke="var(--color-line)" strokeWidth="2" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/** Een ribbe tussen de twee vlakken, op een hoek van de kaart. */
function SpaceEdge({ x, y }: { x: number; y: number }) {
  return (
    <div
      aria-hidden
      style={{ transform: `translate3d(calc(var(--s) * ${x}), calc(var(--s) * ${y}), 0) rotateY(90deg) translate(-50%, -50%)` }}
      className="pointer-events-none absolute top-0 left-0 h-0.5 w-[calc(var(--s)*0.68)] origin-top-left rounded-full bg-line-strong"
    />
  );
}

/** Hoeken van het trapezium, in dezelfde eenheden als de klinkers. */
const CORNERS: [number, number][] = [
  [40, 26],
  [372, 26],
  [372, 330],
  [150, 330],
].map(([x, y]) => [((x ?? 0) - 206) / 332, ((y ?? 0) - 178) / 332]);

const VIEWS = [
  { id: 'kaart', label: 'Van voren', x: 0, y: 0 },
  { id: 'opzij', label: 'Van opzij', x: 0, y: -90 },
  { id: 'boven', label: 'Van boven', x: -90, y: 0 },
  { id: 'schuin', label: 'Schuin', x: -16, y: -30 },
] as const;

/** De klinkerruimte: draai hem rond en vind de gevraagde klinkers. */
export function VowelSpaceWidget({ data, solved, onSolved }: WidgetProps<'space'>) {
  const [found, setFound] = useState<Vowel[]>([]);
  const [current, setCurrent] = useState<Vowel | null>(null);
  const [view, setView] = useState<string | null>(null);
  const shown = solved ? data.targets : found;
  const { flash, flashKey, trigger } = useFlash<Vowel>();
  const { box, solve } = useSolve(onSolved);
  const orbit = useOrbit({ initial: { x: -16, y: -30 }, limitX: [-90, 90], idleSway: 24, onGrab: () => setView(null) });

  const tap = (vowel: Vowel) => {
    setCurrent(vowel);
    if (solved || found.includes(vowel)) return play('tap');
    if (!data.targets.includes(vowel)) return trigger(vowel);
    const next = [...found, vowel];
    setFound(next);
    if (data.targets.every((target) => next.includes(target))) solve();
    else play('select');
  };

  const info = current ? VOWEL_INFO[current] : null;
  const s = 'min(60cqw, 17rem)';

  return (
    <div ref={box}>
      <TaskBox
        icon={<Rotate3d aria-hidden className={ICON} strokeWidth={2.5} />}
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
        <div className="@container" lang="nl">
          <Stage
            orbit={orbit}
            label="Klinkerruimte: hoogte van boven naar onder, voor en achter van links naar rechts, platte en ronde lippen van voren naar achteren."
            style={{ '--s': s } as CSSProperties}
            className="mx-auto aspect-[1/0.92] w-full max-w-[28rem] overflow-hidden rounded-tile bg-[radial-gradient(ellipse_at_50%_42%,var(--color-surface)_0%,transparent_72%)]"
          >
            <motion.div
              style={{ rotateX: orbit.rotateX, rotateY: orbit.rotateY }}
              className="absolute top-1/2 left-1/2 size-0 [transform-style:preserve-3d]"
            >
              <SpacePlane z={-DEPTH} round />
              {CORNERS.map(([x, y]) => (
                <SpaceEdge key={`${x}:${y}`} x={x} y={y} />
              ))}
              <SpacePlane z={DEPTH} round={false} />
              <SpaceLabel orbit={orbit} at={[-0.66, -0.44, DEPTH]}>
                hoog
              </SpaceLabel>
              <SpaceLabel orbit={orbit} at={[-0.46, 0.5, DEPTH]}>
                laag
              </SpaceLabel>
              <SpaceLabel orbit={orbit} at={[-0.44, -0.56, DEPTH]}>
                voor
              </SpaceLabel>
              <SpaceLabel orbit={orbit} at={[0.44, -0.55, DEPTH]}>
                achter
              </SpaceLabel>
              <SpaceLabel orbit={orbit} at={[0.6, 0.38, DEPTH]} className="text-ink">
                platte lippen
              </SpaceLabel>
              <SpaceLabel orbit={orbit} at={[0.6, 0.38, -DEPTH]} className="text-purple-ink">
                ronde lippen
              </SpaceLabel>
              {MONOPHTHONGS.map((vowel) => (
                <SpacePoint
                  key={vowel}
                  orbit={orbit}
                  vowel={vowel}
                  hit={shown.includes(vowel)}
                  bad={flash === vowel}
                  current={current === vowel}
                  flashKey={flashKey}
                  onTap={() => tap(vowel)}
                />
              ))}
            </motion.div>
          </Stage>
          <DragHint />
        </div>

        <Controls label="Bekijk de ruimte">
          {VIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={view === item.id}
              onClick={() => {
                play('tap');
                orbit.turnTo(item.x, item.y);
                setView(item.id);
              }}
              className={CONTROL}
            >
              {item.id === 'kaart' && <Eye aria-hidden className="size-4" strokeWidth={2.5} />}
              {item.label}
            </button>
          ))}
        </Controls>

        <div aria-live="polite" className="mt-4 min-h-[5.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            {current && info ? (
              <SoundCard key={current} symbol={current} word={info.word} lines={[info.traits, ROUND.has(current) ? 'Ligt in het vlak van de ronde lippen' : 'Ligt in het vlak van de platte lippen']} />
            ) : (
              <p className="text-small font-semibold text-ink-muted">Draai de ruimte en tik een klinker om te zien hoe je hem maakt.</p>
            )}
          </AnimatePresence>
        </div>
      </TaskBox>
    </div>
  );
}

/* ------------------------------------------------------------------ draaitegel */

/** Lettertypes om de spiegelvorm te vergelijken met de echte letter. */
const FACES = [
  { id: 'schreefloos', label: 'Schreefloos', className: 'font-sans font-bold' },
  { id: 'schreef', label: 'Met schreef', className: 'font-serif' },
] as const;

const THICKNESS = 6;

/** Eén laag van de dikke tegel: voorkant, achterkant of een plakje rand daartussen. */
function TileLayer({ z, children, back, edge }: { z: number; children?: ReactNode; back?: boolean; edge?: boolean }) {
  return (
    <div
      aria-hidden
      style={{ transform: `translateZ(${z}px)${back ? ' rotateY(180deg)' : ''}` }}
      className={cn(
        'absolute inset-0 grid place-items-center rounded-[1.6rem] [backface-visibility:hidden]',
        edge ? 'bg-accent-deep [backface-visibility:visible]' : 'border-2 border-accent-line bg-surface shadow-[inset_0_2px_0_rgb(255_255_255/0.7),inset_0_-10px_24px_-14px_var(--accent-deep)]',
      )}
    >
      {children}
    </div>
  );
}

/** De draaitegel: spiegel, kantel of draai de letter en verzamel de gevraagde letters. */
export function FlipWidget({ data, solved, onSolved }: WidgetProps<'flip'>) {
  const calm = useCalmMotion();
  const [turns, setTurns] = useState({ x: 0, y: 0, z: 0 });
  const [seen, setSeen] = useState<FlipLetter[]>([]);
  const [face, setFace] = useState<(typeof FACES)[number]['id']>('schreefloos');
  const [compare, setCompare] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const { box, solve } = useSolve(onSolved);
  const found = solved ? data.targets : data.targets.filter((letter) => seen.includes(letter));
  const pose = poseOf(turns.x, turns.y, turns.z);
  const letter = flipLetter(data.start, pose);
  // Vergelijken heeft alleen zin bij spiegelbeelden: gekanteld staat een letter in zijn
  // letterhokje op een andere hoogte dan de echte letter, door de stok boven en de staart onder.
  const overlay = compare && !pose.tilted;
  const font = FACES.find((item) => item.id === face)!.className;

  const turn = (axis: 'x' | 'y' | 'z', name: string) => {
    const next = { ...turns, [axis]: turns[axis] + 1 };
    setTurns(next);
    const now = flipLetter(data.start, poseOf(next.x, next.y, next.z));
    setLast(name);
    if (solved || seen.includes(now) || !data.targets.includes(now)) return play('tap');
    const nextSeen = [...seen, now];
    setSeen(nextSeen);
    if (data.targets.every((target) => nextSeen.includes(target))) solve();
    else play('select');
  };

  const rotation = { rotateX: turns.x * 180, rotateY: turns.y * 180, rotateZ: turns.z * 180 };
  const glyph = (mirror: boolean) => (
    <span lang="nl" className={cn('block text-[6.5rem] leading-none text-accent-ink select-none', font, mirror && '-scale-x-100')}>
      {data.start}
    </span>
  );

  return (
    <div ref={box}>
      <TaskBox
        icon={<RotateCw aria-hidden className={ICON} strokeWidth={2.5} />}
        title={data.q}
        solved={solved}
        status={solved ? data.note : `${found.length} van ${data.targets.length} gemaakt`}
      >
        <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative mx-auto grid size-56 place-items-center [perspective:900px]">
            <motion.div
              initial={false}
              animate={rotation}
              transition={calm ? { duration: 0 } : spring.flip}
              className="relative size-40 [transform-style:preserve-3d]"
            >
              <TileLayer z={-THICKNESS} back>
                {glyph(true)}
              </TileLayer>
              {Array.from({ length: THICKNESS * 2 - 1 }, (_, k) => (
                <TileLayer key={k} z={k - THICKNESS + 1} edge />
              ))}
              <TileLayer z={THICKNESS}>{glyph(false)}</TileLayer>
            </motion.div>
            <AnimatePresence>
              {overlay && (
                <motion.span
                  key={`${letter}-${face}`}
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { ...transition.slow, delay: calm ? 0 : 0.45 } }}
                  exit={{ opacity: 0, transition: transition.fast }}
                  className={cn(
                    'pointer-events-none absolute inset-0 grid place-items-center text-[6.5rem] leading-none text-transparent [-webkit-text-stroke:2px_var(--color-orange)]',
                    font,
                  )}
                >
                  {letter}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-start">
            <p aria-live="polite" className="text-center sm:text-left">
              <span className="block text-small font-bold text-ink-muted">{last ? `Na ${last} lees je nu` : 'Op de tegel staat'}</span>
              <motion.span
                key={letter}
                initial={calm ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={spring.pop}
                className="inline-block font-serif text-[3rem] leading-none text-ink"
                lang="nl"
              >
                {letter}
              </motion.span>
            </p>
            <ul aria-label="Gemaakte letters" className="flex gap-2">
              {data.targets.map((target) => {
                const done = found.includes(target);
                return (
                  <li
                    key={target}
                    aria-label={`${target}${done ? ', gemaakt' : ', nog niet gemaakt'}`}
                    className={cn(
                      'grid size-10 place-items-center rounded-chip border-2 font-serif text-[1.35rem] leading-none transition-colors duration-300',
                      done ? 'border-green bg-green text-green-on' : 'border-dashed border-line-strong text-ink-muted',
                    )}
                  >
                    {target}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <Controls label="Beweeg de tegel">
          <button type="button" onClick={() => turn('y', 'spiegelen')} className={CONTROL}>
            <FlipHorizontal2 aria-hidden className="size-4" strokeWidth={2.5} />
            Spiegel (staande as)
          </button>
          <button type="button" onClick={() => turn('x', 'kantelen')} className={CONTROL}>
            <FlipVertical2 aria-hidden className="size-4" strokeWidth={2.5} />
            Kantel (liggende as)
          </button>
          <button type="button" onClick={() => turn('z', 'draaien')} className={CONTROL}>
            <RotateCw aria-hidden className="size-4" strokeWidth={2.5} />
            Draai in het vlak
          </button>
        </Controls>
        <Controls label="Vergelijk met de echte letter">
          {FACES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={face === item.id}
              onClick={() => {
                play('tap');
                setFace(item.id);
              }}
              className={CONTROL}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={compare}
            onClick={() => {
              play('tap');
              setCompare((value) => !value);
            }}
            className={CONTROL}
          >
            <Eye aria-hidden className="size-4" strokeWidth={2.5} />
            Echte letter erover
          </button>
        </Controls>
        {compare && pose.tilted && (
          <p className="mt-2 text-center text-caption font-semibold text-ink-muted">Vergelijken werkt bij spiegelbeelden: zet de letter weer rechtop.</p>
        )}
      </TaskBox>
    </div>
  );
}
