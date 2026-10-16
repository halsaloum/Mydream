import { thingModel, type ThingId } from '@/content/things';
import type { Stage, THREE } from '../stage';

/**
 * Gedeelde bouwstenen voor de 3D-oefeningen met Meshy-voorwerpen (sorteertafel, vormmachine,
 * toneel): een voorwerp met een onzichtbaar tikblok, een gloeiende ring op tafel en veren voor
 * groeien, optillen en nee-schudden. Elke scène zet de voorwerpen zelf neer.
 */
type Kit = typeof import('../stage');

export type Spring = { x: number; v: number };

export const spring = (x = 0): Spring => ({ x, v: 0 });

export type Prop = {
  id: ThingId;
  holder: THREE.Group;
  /** Het geladen model (binnen `holder`), of null zolang het laadt. */
  model: THREE.Group | null;
  ring: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
  scale: Spring;
  lift: Spring;
  wobble: Spring;
  hop: Spring;
  loaded: boolean;
  size: number;
};

export const GREEN = '#58cc02';
export const ORANGE = '#ffa42e';

/** Zet een voorwerp in de wereld. Het is meteen aan te tikken (via het tikblok), ook als het model nog laadt. */
export function makeProp(stage: Stage, kit: Kit, id: ThingId, size: number, tap: string | null): Prop {
  const Three = kit.THREE;
  const holder = new Three.Group();
  holder.scale.setScalar(0.001);
  if (tap) {
    holder.userData.tap = tap;
    stage.tappable.push(holder);
  }
  stage.world.add(holder);
  const ring = new Three.Mesh(
    new Three.RingGeometry(size * 0.38, size * 0.48, 48),
    new Three.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0, depthWrite: false }),
  );
  ring.rotation.x = -Math.PI / 2;
  stage.world.add(ring);
  const hit = new Three.Mesh(new Three.BoxGeometry(size * 0.9, size, size * 0.9), new Three.MeshBasicMaterial({ visible: false }));
  hit.position.y = size / 2;
  holder.add(hit);
  const prop: Prop = { id, holder, model: null, ring, scale: spring(), lift: spring(), wobble: spring(), hop: spring(), loaded: false, size };
  // Lukt een model niet, dan blijft de plek leeg; de knoppen onder het beeld werken gewoon.
  void kit
    .loadThing(thingModel(id), size)
    .then(async (model) => {
      await stage.prepare(model);
      holder.add(model);
      prop.model = model;
      prop.loaded = true;
      stage.wake();
    })
    .catch(() => undefined);
  return prop;
}

export function removeProp(stage: Stage, prop: Prop) {
  stage.world.remove(prop.holder);
  stage.world.remove(prop.ring);
  const index = stage.tappable.indexOf(prop.holder);
  if (index >= 0) stage.tappable.splice(index, 1);
}

/** Nee schudden: een korte, gedempte trilling om de lengteas. */
export function shake(prop: Prop) {
  prop.wobble.v = 9;
}

/** Een blij sprongetje. */
export function hop(prop: Prop) {
  prop.hop.v = 7;
}

/**
 * Eén beeldje voor een voorwerp: groeien naar `show` (0 = weg, 1 = gewoon), optillen als het
 * gekozen is, nee schudden, springen, en de ring eronder laten gloeien in `glow` (kleur of null).
 */
export function animateProp(
  kit: Kit,
  prop: Prop,
  dt: number,
  time: number,
  calm: boolean,
  { show, lifted, glow, bob = true }: { show: number; lifted: boolean; glow: string | null; bob?: boolean },
) {
  const { springTo } = kit;
  const target = prop.loaded ? show : 0;
  const size = calm ? target : springTo(prop.scale, target, dt, 150, 14);
  prop.holder.scale.setScalar(Math.max(0.001, size));
  const lift = calm ? (lifted ? 0.35 : 0) : springTo(prop.lift, lifted ? 0.35 : 0, dt, 170, 15);
  const step = Math.min(dt, 1 / 30);
  prop.wobble.v -= prop.wobble.x * 260 * step;
  prop.wobble.v *= 1 - Math.min(1, 9 * dt);
  prop.wobble.x += prop.wobble.v * step;
  prop.hop.v -= 40 * step;
  prop.hop.x = Math.max(0, prop.hop.x + prop.hop.v * step);
  if (prop.hop.x === 0 && prop.hop.v < 0) prop.hop.v = 0;
  const float = !calm && bob && !lifted ? Math.sin(time * 1.4 + prop.holder.position.x * 2 + prop.holder.position.z) * 0.025 : 0;
  prop.holder.position.y = lift + (calm ? 0 : prop.hop.x * 0.12) + float;
  prop.holder.rotation.z = calm ? 0 : prop.wobble.x * 0.08;
  const opacity = glow ? 0.6 : 0;
  if (glow) prop.ring.material.color.set(glow);
  prop.ring.material.opacity += (opacity - prop.ring.material.opacity) * Math.min(1, dt * 10);
  prop.ring.position.set(prop.holder.position.x, 0.012, prop.holder.position.z);
  prop.ring.scale.setScalar(Math.max(0.001, size) * (1 + (calm || !glow ? 0 : Math.sin(time * 3) * 0.04)));
  return size;
}

/** Een tekstbordje dat plat op tafel ligt (bv. de naam van een bak). */
export function labelMat(kit: Kit, text: string, color: string, width: number, depth: number) {
  const Three = kit.THREE;
  const texture = kit.textTexture((ctx, w, h) => {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let px = 104;
    ctx.font = `800 ${px}px ${kit.fontFamily('display')}`;
    while (ctx.measureText(text).width > w * 0.9 && px > 40) {
      px -= 6;
      ctx.font = `800 ${px}px ${kit.fontFamily('display')}`;
    }
    ctx.fillText(text, w / 2, h / 2 + 4);
  }, 1024, 256);
  const group = new Three.Group();
  const base = new Three.Mesh(kit.roundedBox(width, 0.08, depth, 0.04), kit.toyMaterial(color, { rough: 0.45 }));
  base.position.y = 0.04;
  base.receiveShadow = true;
  group.add(base);
  const plate = new Three.Mesh(new Three.PlaneGeometry(width * 0.92, (width * 0.92) / 4), new Three.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
  plate.rotation.x = -Math.PI / 2;
  plate.position.set(0, 0.085, depth / 2 - (width * 0.92) / 8 - 0.04);
  group.add(plate);
  return group;
}
