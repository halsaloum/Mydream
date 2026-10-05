import { thingModel, type ThingId } from '@/content/things';
import type { THREE } from '../stage';
import type { ToyScene } from '../toy-canvas';

/**
 * De samenstelbank: Meshy-voorwerpen staan in een boog op tafel. Een gekozen voorwerp komt
 * omhoog; bij een goede samenstelling vliegen de twee delen naar het midden, krimpen weg, en
 * de samenstelling springt tevoorschijn en draait een rondje. Een fout voorwerp schudt nee.
 */
export type CompoundProps = {
  /** Wisselt per ronde: dan gaan de oude voorwerpen weg en komen de nieuwe. */
  round: number;
  shelf: readonly ThingId[];
  picked: readonly ThingId[];
  /** De samenstelling, zodra de spelling goed is. */
  result: ThingId | null;
  /** Het voorwerp dat net fout was, met een teller zodat dezelfde fout opnieuw schudt. */
  wrong: { id: ThingId; n: number } | null;
};

type Item = {
  id: ThingId;
  holder: THREE.Group;
  home: THREE.Vector3;
  scale: { x: number; v: number };
  lift: { x: number; v: number };
  fly: { x: number; v: number };
  wobble: { x: number; v: number };
  /** Opzij gaan als de samenstelling in het midden verschijnt. */
  aside: { x: number; v: number };
  /** Gekleurde ring op tafel onder een gekozen voorwerp. */
  ring: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial> | null;
  leaving: boolean;
  loaded: boolean;
  spin: number;
};

const SIZE = 1.15;
const RESULT_SIZE = 1.9;

export const compoundScene: ToyScene<CompoundProps> = {
  // fitAspect: op een smal scherm gaat de camera verder weg, zodat de hele tafel in beeld blijft.
  options: () => ({ camera: { fov: 30, distance: 6.6, height: 2.9, target: [0, 0.3, 0.1] }, fitAspect: 2.1, yaw: 0, sway: 0.12, yawLimit: [-0.9, 0.9] }),
  mount: (stage, kit, initial) => {
    const { loadThing, springTo } = kit;
    const Three = kit.THREE;
    let props = initial;
    let shelf: Item[] = [];
    let results: Item[] = [];
    let lastWrong = 0;
    const center = new Three.Vector3(0, 0.3, 0.5);
    const aside = new Three.Vector3();

    const make = (id: ThingId, home: THREE.Vector3, size: number, tappable: boolean): Item => {
      const holder = new Three.Group();
      holder.position.copy(home);
      holder.scale.setScalar(0.001);
      if (tappable) {
        holder.userData.tap = `thing:${id}`;
        stage.tappable.push(holder);
      }
      stage.world.add(holder);
      let ring: Item['ring'] = null;
      if (tappable) {
        ring = new Three.Mesh(
          new Three.RingGeometry(size * 0.38, size * 0.47, 48),
          new Three.MeshBasicMaterial({ color: '#58cc02', transparent: true, opacity: 0, depthWrite: false }),
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.copy(home).setY(0.01);
        stage.world.add(ring);
      }
      const item: Item = {
        id,
        holder,
        home,
        scale: { x: 0, v: 0 },
        lift: { x: 0, v: 0 },
        fly: { x: 0, v: 0 },
        wobble: { x: 0, v: 0 },
        aside: { x: 0, v: 0 },
        ring,
        leaving: false,
        loaded: false,
        spin: 0,
      };
      // Een onzichtbaar blok maakt het voorwerp al aantikbaar voordat het model er is.
      const hit = new Three.Mesh(new Three.BoxGeometry(size, size, size), new Three.MeshBasicMaterial({ visible: false }));
      hit.position.y = size / 2;
      holder.add(hit);
      // Lukt een model niet, dan blijft die plek leeg; de knoppen onder de tafel werken gewoon.
      void loadThing(thingModel(id), size)
        .then(async (model) => {
          await stage.prepare(model);
          holder.add(model);
          item.loaded = true;
          stage.wake();
        })
        .catch(() => undefined);
      return item;
    };

    const remove = (item: Item) => {
      stage.world.remove(item.holder);
      if (item.ring) stage.world.remove(item.ring);
      const index = stage.tappable.indexOf(item.holder);
      if (index >= 0) stage.tappable.splice(index, 1);
    };

    const layout = (ids: readonly ThingId[]) => {
      const n = ids.length;
      return ids.map((id, i) => {
        const angle = (i - (n - 1) / 2) * (n > 3 ? 0.42 : 0.5);
        const home = new Three.Vector3(Math.sin(angle) * 3.6, 0, Math.cos(angle) * 3.6 - 2.2);
        return make(id, home, SIZE, true);
      });
    };

    let round = -1;
    const apply = (next: CompoundProps) => {
      props = next;
      if (next.round !== round) {
        round = next.round;
        for (const item of [...shelf, ...results]) item.leaving = true;
        shelf = [...shelf.filter((item) => item.leaving), ...layout(next.shelf)];
      }
      if (next.result && !results.some((item) => !item.leaving && item.id === next.result)) {
        results.push(make(next.result, new Three.Vector3(center.x, 0, center.z), RESULT_SIZE, false));
      }
      if (next.wrong && next.wrong.n !== lastWrong) {
        lastWrong = next.wrong.n;
        const item = shelf.find((candidate) => !candidate.leaving && candidate.id === next.wrong?.id);
        if (item) item.wobble.v = 9;
      }
    };
    apply(initial);

    stage.onFrame((dt, time, calm) => {
      const merged = props.result !== null;
      for (const item of [...shelf]) {
        const picked = !item.leaving && props.picked.includes(item.id);
        const gone = item.leaving || (merged && picked);
        const moveAside = merged && !picked && !item.leaving;
        const target = gone ? 0 : item.loaded ? (moveAside ? 0.65 : 1) : 0;
        const size = calm ? target : springTo(item.scale, target, dt, 150, 14);
        item.holder.scale.setScalar(Math.max(0.001, size));
        const lift = calm ? (picked ? 0.5 : 0) : springTo(item.lift, picked ? 0.5 : 0, dt, 170, 15);
        const fly = calm ? (merged && picked ? 1 : 0) : springTo(item.fly, merged && picked ? 1 : 0, dt, 90, 13);
        const away = calm ? Number(moveAside) : springTo(item.aside, moveAside ? 1 : 0, dt, 120, 16);
        // Opzij: naar buiten, voorbij de rand van de samenstelling in het midden, en wat naar achter.
        const out = Math.sign(item.home.x || 1) * Math.max(Math.abs(item.home.x) * 1.25, 1.8);
        aside.set(item.home.x + (out - item.home.x) * away, 0, item.home.z - away * 1.2);
        item.holder.position.lerpVectors(aside, center, Math.min(1, fly));
        item.holder.position.y = lift + (!calm && !picked ? Math.sin(time * 1.4 + item.home.x) * 0.03 : 0);
        item.wobble.v -= item.wobble.x * 260 * Math.min(dt, 1 / 30);
        item.wobble.v *= 1 - Math.min(1, 9 * dt);
        item.wobble.x += item.wobble.v * Math.min(dt, 1 / 30);
        item.holder.rotation.z = calm ? 0 : item.wobble.x * 0.08;
        // Kijk naar de camera, met een klein draaitje als hij gekozen is.
        item.spin += picked && !calm ? dt * 1.4 : 0;
        item.holder.rotation.y = -Math.atan2(item.home.x, 6) + Math.sin(item.spin) * 0.5;
        if (item.ring) {
          const glow = picked && !merged ? 0.55 : 0;
          item.ring.material.opacity += (glow - item.ring.material.opacity) * Math.min(1, dt * 10);
          item.ring.position.set(item.holder.position.x, 0.01, item.holder.position.z);
          item.ring.scale.setScalar(1 + (calm ? 0 : Math.sin(time * 3) * 0.04));
        }
        if (item.leaving && size < 0.01) {
          remove(item);
          shelf = shelf.filter((other) => other !== item);
        }
      }
      for (const item of [...results]) {
        const target = item.leaving ? 0 : item.loaded ? 1 : 0;
        const size = calm ? target : springTo(item.scale, target, dt, 110, 10);
        item.holder.scale.setScalar(Math.max(0.001, size));
        item.spin += calm ? 0 : dt * (size < 0.98 ? 6 : 0.5);
        item.holder.rotation.y = item.spin;
        item.holder.position.y = calm ? 0 : Math.abs(Math.sin(time * 1.6)) * 0.06;
        if (item.leaving && size < 0.01) {
          remove(item);
          results = results.filter((other) => other !== item);
        }
      }
    });

    return { update: apply };
  },
};
