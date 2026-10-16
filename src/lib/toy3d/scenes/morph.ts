import type { ThingId } from '@/content/things';
import type { THREE } from '../stage';
import type { ToyScene } from '../toy-canvas';
import { animateProp, hop, makeProp, removeProp, shake, type Prop } from './props';

/**
 * De vormmachine: één voorwerp op een draaischijf. Kies je de goede vorm, dan doet het
 * voorwerp wat het morfeem betekent: het verkleinwoord maakt het klein, het meervoud maakt er
 * meer van, een bijvoeglijk naamwoord geeft het een kleur. Zo zie je dat een morfeem een vorm
 * én een betekenis is.
 */
export type MorphEffect = 'klein' | 'veel' | 'klein-veel' | 'kleur';

export type MorphProps = {
  round: number;
  thing: ThingId;
  effect: MorphEffect;
  /** Kleur bij `kleur`, als CSS-kleur. */
  color: string | null;
  done: boolean;
  wrong: number;
};

type Set = { round: number; main: Prop; copies: Prop[]; leaving: boolean; tinted: boolean; hopped: boolean };

const SIZE = 1.7;

export const morphScene: ToyScene<MorphProps> = {
  options: () => ({ camera: { fov: 30, distance: 6.4, height: 2.4, target: [0, 0.65, 0] }, fitAspect: 1.6, yaw: 0, sway: 0.25, yawLimit: [-1.3, 1.3] }),
  mount: (stage, kit, initial) => {
    const Three = kit.THREE;
    let props = initial;
    let sets: Set[] = [];
    let lastWrong = initial.wrong;

    // De draaischijf: een ronde, gelakte sokkel.
    const plinth = new Three.Mesh(new Three.CylinderGeometry(1.25, 1.35, 0.18, 64), kit.toyMaterial('#f3ede2', { rough: 0.35 }));
    plinth.position.y = 0.09;
    plinth.receiveShadow = true;
    plinth.castShadow = true;
    stage.world.add(plinth);
    const rim = new Three.Mesh(new Three.TorusGeometry(1.3, 0.05, 16, 80), kit.toyMaterial('#3dbcf5'));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.18;
    stage.world.add(rim);

    const make = (next: MorphProps): Set => {
      const main = makeProp(stage, kit, next.thing, SIZE, 'ding');
      main.holder.position.set(0, 0.18, 0);
      main.ring.visible = false;
      // Voor het meervoud staan er al twee klaar, nog onzichtbaar.
      const copies =
        next.effect === 'veel' || next.effect === 'klein-veel'
          ? [-1, 1].map((side) => {
              const small = next.effect === 'klein-veel';
              const copy = makeProp(stage, kit, next.thing, SIZE * (small ? 0.42 : 0.78), null);
              copy.holder.position.set(side * (small ? 0.62 : 1.95), 0, small ? 0.25 : -0.45);
              copy.holder.userData.base = small ? 0.18 : 0;
              return copy;
            })
          : [];
      return { round: next.round, main, copies, leaving: false, tinted: false, hopped: false };
    };

    const tint = (set: Set, color: string) => {
      if (set.tinted || !set.main.model) return;
      set.tinted = true;
      set.main.model.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        const old = mesh.material as THREE.MeshPhysicalMaterial;
        // Nieuwe lak in één kleur; de vorm (normal map) blijft, zodat je het voorwerp herkent.
        mesh.material = new Three.MeshPhysicalMaterial({ color, normalMap: old.normalMap, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12 });
        old.dispose();
      });
    };

    const apply = (next: MorphProps) => {
      props = next;
      const current = sets.find((set) => !set.leaving);
      if (!current || current.round !== next.round) {
        for (const set of sets) set.leaving = true;
        sets.push(make(next));
      }
      const live = sets.find((set) => !set.leaving)!;
      if (next.wrong !== lastWrong) {
        lastWrong = next.wrong;
        shake(live.main);
      }
      if (next.done && !live.hopped) {
        live.hopped = true;
        hop(live.main);
        live.copies.forEach(hop);
      }
    };
    apply(initial);

    let turn = 0;
    stage.onFrame((dt, time, calm) => {
      turn += calm ? 0 : dt * 0.5;
      for (const set of [...sets]) {
        const live = !set.leaving;
        const done = live && props.done;
        const small = done && (props.effect === 'klein' || props.effect === 'klein-veel');
        const size = animateProp(kit, set.main, dt, time, calm, { show: !live ? 0 : small ? 0.42 : 1, lifted: false, glow: null, bob: false });
        set.main.holder.position.y += 0.18;
        set.main.holder.rotation.y = turn + Math.sin(time * 0.8) * 0.2;
        if (done && props.effect === 'kleur' && props.color) tint(set, props.color);
        set.copies.forEach((copy, i) => {
          animateProp(kit, copy, dt, time, calm, { show: done ? 1 : 0, lifted: false, glow: null, bob: false });
          copy.holder.position.y += copy.holder.userData.base as number;
          copy.holder.rotation.y = turn * 0.8 + (i ? 0.6 : -0.6);
          copy.ring.visible = false;
        });
        if (set.leaving && size < 0.01) {
          removeProp(stage, set.main);
          set.copies.forEach((copy) => removeProp(stage, copy));
          sets = sets.filter((other) => other !== set);
        }
      }
      rim.material.color.set(props.done ? '#58cc02' : '#3dbcf5');
    });

    return { update: apply };
  },
};
