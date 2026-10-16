import type { ThingId } from '@/content/things';
import type { THREE } from '../stage';
import type { ToyScene } from '../toy-canvas';
import { GREEN, ORANGE, animateProp, hop, labelMat, makeProp, shake, type Prop } from './props';

/**
 * De sorteertafel: achter op tafel staan de voorwerpen in een boog, vooraan liggen de bakken
 * (gekleurde matten met een naam). Kies een voorwerp en een bak; is het goed, dan wandelt het
 * voorwerp naar zijn bak. Met `rings` zijn de bakken ringen om één midden: het midden is de
 * kern van de categorie, hoe verder naar buiten, hoe meer aan de rand (prototypetheorie).
 */
export type BinsProps = {
  items: readonly ThingId[];
  bins: readonly string[];
  rings: boolean;
  /** Per voorwerp: in welke bak het al staat, of null. */
  placed: readonly (number | null)[];
  selected: number | null;
  wrong: { item: number; n: number } | null;
};

const MAT_COLORS = ['#3dbcf5', '#ffa42e', '#d496ff', '#2fcfb6'];
const RING_COLORS = ['#ffd23f', '#ffa42e', '#ff98d6', '#8fa0b4'];

type Item = Prop & { home: THREE.Vector3; at: THREE.Vector3 };

export const binsScene: ToyScene<BinsProps> = {
  options: ({ rings }) =>
    rings
      ? { camera: { fov: 32, distance: 8.6, height: 6.4, target: [0, 0, -0.25] }, fitAspect: 1.7, yaw: 0, sway: 0.08, yawLimit: [-0.6, 0.6] }
      : { camera: { fov: 30, distance: 7.4, height: 3.9, target: [0, 0.35, -0.2] }, fitAspect: 1.45, yaw: 0, sway: 0.08, yawLimit: [-0.6, 0.6] },
  mount: (stage, kit, initial) => {
    const Three = kit.THREE;
    let props = initial;
    const n = initial.items.length;
    const size = n > 6 ? 1.1 : n > 4 ? 1.25 : 1.4;
    const count = initial.bins.length;
    let lastWrong = 0;
    const placedBefore = initial.placed.map((bin) => bin !== null);

    // De bakken: matten naast elkaar, of ringen om één midden.
    const ringCenter = new Three.Vector3(0, 0, 0.55);
    const band = 1.0;
    const mats: THREE.Object3D[] = [];
    if (initial.rings) {
      initial.bins.forEach((label, k) => {
        const inner = k === 0 ? 0 : k * band + 0.02;
        const outer = (k + 1) * band - 0.02;
        const geometry = k === 0 ? new Three.CircleGeometry(outer, 64) : new Three.RingGeometry(inner, outer, 64);
        const disc = new Three.Mesh(geometry, kit.toyMaterial(RING_COLORS[k % RING_COLORS.length]!, { rough: 0.5, coat: 0.6 }));
        disc.rotation.x = -Math.PI / 2;
        disc.position.set(ringCenter.x, 0.01 + (count - k) * 0.004, ringCenter.z);
        disc.receiveShadow = true;
        disc.userData.tap = `bin:${k}`;
        stage.tappable.push(disc);
        stage.world.add(disc);
        mats.push(disc);
        // De naam op de voorkant van de ring.
        const sign = kit.textTexture((ctx, w, h) => {
          ctx.fillStyle = 'rgba(40, 30, 20, 0.82)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = `800 92px ${kit.fontFamily('display')}`;
          ctx.fillText(label, w / 2, h / 2 + 4);
        }, 1024, 160);
        const plate = new Three.Mesh(new Three.PlaneGeometry(2.4, 0.375), new Three.MeshBasicMaterial({ map: sign, transparent: true, depthWrite: false }));
        plate.rotation.x = -Math.PI / 2;
        const middle = k === 0 ? 0.5 * band : (k + 0.5) * band;
        plate.position.set(ringCenter.x, 0.03, ringCenter.z + middle);
        stage.world.add(plate);
      });
    } else {
      const width = Math.min(2.3, 6.4 / count - 0.18);
      initial.bins.forEach((label, k) => {
        const mat = labelMat(kit, label, MAT_COLORS[k % MAT_COLORS.length]!, width, 1.5);
        mat.position.set((k - (count - 1) / 2) * (width + 0.18), 0, 1.15);
        mat.userData.tap = `bin:${k}`;
        stage.tappable.push(mat);
        stage.world.add(mat);
        mats.push(mat);
      });
    }

    // De voorwerpen achter op tafel, in een boog.
    const step = n > 6 ? 0.235 : n > 4 ? 0.27 : 0.33;
    const items: Item[] = initial.items.map((id, i) => {
      const angle = (i - (n - 1) / 2) * step;
      const radius = 5.4;
      const home = new Three.Vector3(Math.sin(angle) * radius, 0, Math.cos(angle) * radius - (initial.rings ? 8.9 : 6.6));
      const prop = makeProp(stage, kit, id, size, `item:${i}`);
      prop.holder.position.copy(home);
      // Object.assign, geen kopie: het model komt later binnen op dit object.
      return Object.assign(prop, { home, at: home.clone() });
    });

    /** Waar een voorwerp staat als het in bak `bin` ligt, als nummer `slot` van `total` in die bak. */
    const spot = (bin: number, slot: number, total: number) => {
      if (props.rings) {
        if (bin === 0) {
          const angle = total === 1 ? 0 : (slot / total) * Math.PI * 2;
          const r = total === 1 ? 0 : band * 0.42;
          return new Three.Vector3(ringCenter.x + Math.sin(angle) * r, 0, ringCenter.z - Math.cos(angle) * r * 0.7);
        }
        const radius = (bin + 0.5) * band;
        // Rondom de ring, maar niet vooraan: daar staat de naam.
        const spread = Math.min(3.6, 1.1 * total);
        const angle = total === 1 ? 0.6 : -spread / 2 + (slot / (total - 1)) * spread;
        return new Three.Vector3(ringCenter.x + Math.sin(angle) * radius, 0, ringCenter.z - Math.cos(angle) * radius);
      }
      const mat = mats[bin]!;
      const width = Math.min(2.3, 6.4 / count - 0.18);
      const columns = Math.max(1, Math.floor(width / (size * 0.72)));
      const col = slot % columns;
      const row = Math.floor(slot / columns);
      const x = mat.position.x + (columns === 1 ? 0 : (col - (columns - 1) / 2) * (width / columns));
      return new Three.Vector3(x, 0, mat.position.z - 0.35 + row * 0.5);
    };

    const apply = (next: BinsProps) => {
      props = next;
      if (next.wrong && next.wrong.n !== lastWrong) {
        lastWrong = next.wrong.n;
        const item = items[next.wrong.item];
        if (item) shake(item);
      }
      next.placed.forEach((bin, i) => {
        if (bin !== null && !placedBefore[i]) {
          placedBefore[i] = true;
          const item = items[i];
          if (item) hop(item);
        }
      });
    };
    apply(initial);

    stage.onFrame((dt, time, calm) => {
      const totals = props.bins.map((_, k) => props.placed.filter((bin) => bin === k).length);
      const seen = props.bins.map(() => 0);
      items.forEach((item, i) => {
        const bin = props.placed[i] ?? null;
        const target = bin === null ? item.home : spot(bin, seen[bin]!++, totals[bin]!);
        // Lopen naar de nieuwe plek: zacht, zonder doorschieten.
        const ease = calm ? 1 : 1 - Math.exp(-dt * 5);
        item.at.lerp(target, ease);
        item.holder.position.x = item.at.x;
        item.holder.position.z = item.at.z;
        const selected = props.selected === i;
        animateProp(kit, item, dt, time, calm, { show: bin === null ? 1 : props.rings ? 0.72 : 0.82, lifted: selected, glow: selected ? ORANGE : bin !== null ? GREEN : null, bob: bin === null });
        // Kijk naar de camera.
        item.holder.rotation.y = -Math.atan2(item.at.x, 7) + (selected && !calm ? Math.sin(time * 2.2) * 0.35 : 0);
      });
      mats.forEach((mat, k) => {
        const hot = props.selected !== null && !props.rings;
        mat.position.y = hot && !calm ? Math.abs(Math.sin(time * 3 + k)) * 0.03 : 0;
      });
    });

    return { update: apply };
  },
};
