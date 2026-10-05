import { useAnimationFrame, useMotionValue, useSpring, type MotionValue } from 'motion/react';
import { useRef, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { spring, useCalmMotion } from './motion';

/**
 * Draaien in 3D: slepen met muis of vinger, pijltjestoetsen, of een vaste stand kiezen.
 * De hoeken veren mee (bij rustige beweging niet). Een korte tik blijft een tik: pas na een
 * paar pixels slepen pakt de ruimte de aanwijzer, zodat knoppen erin gewoon klikbaar blijven.
 */
export type Orbit = {
  /** Hoek om de liggende as (kantelen), in graden. */
  rotateX: MotionValue<number>;
  /** Hoek om de staande as (ronddraaien), in graden. */
  rotateY: MotionValue<number>;
  /** Naar een vaste stand draaien. */
  turnTo: (x: number, y: number) => void;
  /** Op het element dat je kunt vastpakken. */
  bind: {
    onPointerDown: (event: PointerEvent<HTMLElement>) => void;
    onPointerMove: (event: PointerEvent<HTMLElement>) => void;
    onPointerUp: (event: PointerEvent<HTMLElement>) => void;
    onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
    onClickCapture: (event: MouseEvent<HTMLElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  };
};

type OrbitOptions = {
  initial: { x: number; y: number };
  /** Grenzen voor het kantelen, zodat je niet ondersteboven raakt. */
  limitX?: readonly [number, number];
  /** Rustig vanzelf draaien zolang niemand de ruimte aanraakt (graden per seconde). */
  idleSpin?: number;
  /** Rustig heen en weer wiegen zolang niemand de ruimte aanraakt (graden naar elke kant). */
  idleSway?: number;
  /** Wordt aangeroepen als iemand zelf draait (slepen of pijltjes), niet bij een vaste stand. */
  onGrab?: () => void;
};

const DRAG_START = 5;
const KEY_STEP = 15;

export const clampAngle = (value: number, [min, max]: readonly [number, number]) => Math.min(max, Math.max(min, value));

export function useOrbit({ initial, limitX = [-85, 85], idleSpin = 0, idleSway = 0, onGrab }: OrbitOptions): Orbit {
  const calm = useCalmMotion();
  const x = useMotionValue(initial.x);
  const y = useMotionValue(initial.y);
  const springX = useSpring(x, spring.orbit);
  const springY = useSpring(y, spring.orbit);
  const grabbed = useRef(false);
  const drag = useRef<{ id: number; startX: number; startY: number; fromX: number; fromY: number; moving: boolean } | null>(null);
  const moved = useRef(false);

  const grab = (byHand: boolean) => {
    grabbed.current = true;
    if (byHand) onGrab?.();
  };

  useAnimationFrame((time, delta) => {
    if ((!idleSpin && !idleSway) || calm || grabbed.current || drag.current) return;
    if (idleSway) y.set(initial.y + Math.sin(time / 2200) * idleSway);
    else y.set(y.get() + (idleSpin * Math.min(delta, 64)) / 1000);
  });

  const turnTo = (toX: number, toY: number) => {
    grab(false);
    // Kortste weg naar de nieuwe stand, ook na veel rondjes draaien.
    const current = y.get();
    const target = current + ((((toY - current) % 360) + 540) % 360) - 180;
    x.set(clampAngle(toX, limitX));
    y.set(target);
  };

  const bind: Orbit['bind'] = {
    onPointerDown: (event) => {
      if (event.button !== 0) return;
      moved.current = false;
      drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, fromX: x.get(), fromY: y.get(), moving: false };
    },
    onPointerMove: (event) => {
      const state = drag.current;
      if (!state || state.id !== event.pointerId) return;
      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      if (!state.moving) {
        if (Math.hypot(dx, dy) < DRAG_START) return;
        state.moving = true;
        moved.current = true;
        grab(true);
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }
      y.set(state.fromY + dx * 0.55);
      x.set(clampAngle(state.fromX - dy * 0.45, limitX));
    },
    onPointerUp: (event) => {
      if (drag.current?.id === event.pointerId) drag.current = null;
    },
    onPointerCancel: () => {
      drag.current = null;
    },
    onClickCapture: (event) => {
      // Na slepen is het loslaten geen klik op een knop eronder.
      if (moved.current) {
        event.stopPropagation();
        event.preventDefault();
        moved.current = false;
      }
    },
    onKeyDown: (event) => {
      const turns: Record<string, [number, number]> = {
        ArrowLeft: [0, -KEY_STEP],
        ArrowRight: [0, KEY_STEP],
        ArrowUp: [KEY_STEP, 0],
        ArrowDown: [-KEY_STEP, 0],
      };
      const turn = turns[event.key];
      if (!turn) return;
      event.preventDefault();
      grab(true);
      x.set(clampAngle(x.get() + turn[0], limitX));
      y.set(y.get() + turn[1]);
    },
  };

  return { rotateX: calm ? x : springX, rotateY: calm ? y : springY, turnTo, bind };
}
