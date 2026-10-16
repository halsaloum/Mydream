import type { ThingId } from '@/content/things';
import type { ToyScene } from '../toy-canvas';
import { GREEN, ORANGE, animateProp, hop, makeProp, removeProp, shake, type Prop } from './props';

/**
 * Het toneel: de voorwerpen staan in een kring op een draaischijf. Draai de kring rond en tik
 * aan wat de opdracht vraagt (de argumenten van een werkwoord, het hoofd van een woord, het ding
 * waar een zin over gaat). Is het goed, dan draait de kring het antwoord naar je toe: zo zie je
 * letterlijk vanuit welk perspectief een werkwoord de scène bekijkt.
 */
export type CastProps = {
  round: number;
  cast: readonly ThingId[];
  selected: readonly ThingId[];
  /** Na een goed antwoord: wat goed was (krijgt een groene ring), en wat naar voren draait. */
  solved: readonly ThingId[];
  focus: ThingId | null;
  wrong: { id: ThingId; n: number } | null;
};

type Member = Prop & { angle: number; leaving: boolean; round: number };

export const castScene: ToyScene<CastProps> = {
  options: () => ({ camera: { fov: 30, distance: 7, height: 3.1, target: [0, 0.55, 0.2] }, fitAspect: 1.8, yaw: 0 }),
  mount: (stage, kit, initial) => {
    const Three = kit.THREE;
    let props = initial;
    let members: Member[] = [];
    let round = -1;
    let lastWrong = 0;
    let lastFocus: ThingId | null = null;
    let hopped = '';

    // De draaischijf.
    const disc = new Three.Mesh(new Three.CylinderGeometry(2.75, 2.85, 0.16, 80), kit.toyMaterial('#f3ede2', { rough: 0.4 }));
    disc.position.y = -0.08;
    disc.receiveShadow = true;
    stage.world.add(disc);
    const rim = new Three.Mesh(new Three.TorusGeometry(2.8, 0.05, 16, 120), kit.toyMaterial('#d496ff'));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0;
    stage.world.add(rim);

    const radius = (n: number) => (n <= 3 ? 1.6 : n <= 4 ? 1.85 : n <= 5 ? 2.05 : 2.2);
    const sizeFor = (n: number) => (n <= 3 ? 1.55 : n <= 4 ? 1.45 : n <= 5 ? 1.3 : 1.15);

    const apply = (next: CastProps) => {
      props = next;
      if (next.round !== round) {
        round = next.round;
        for (const member of members) member.leaving = true;
        const n = next.cast.length;
        const fresh = next.cast.map((id, i) => {
          const angle = (i / n) * Math.PI * 2;
          const prop = makeProp(stage, kit, id, sizeFor(n), `cast:${id}`);
          prop.holder.position.set(Math.sin(angle) * radius(n), 0, Math.cos(angle) * radius(n));
          prop.holder.rotation.y = angle;
          return Object.assign(prop, { angle, leaving: false, round: next.round });
        });
        members = [...members, ...fresh];
        lastFocus = null;
        stage.turnTo(0);
      }
      if (next.wrong && next.wrong.n !== lastWrong) {
        lastWrong = next.wrong.n;
        const member = members.find((m) => !m.leaving && m.id === next.wrong?.id);
        if (member) shake(member);
      }
      if (next.focus !== lastFocus) {
        lastFocus = next.focus;
        const member = members.find((m) => !m.leaving && m.id === next.focus);
        if (member) stage.turnTo(-member.angle);
      }
      const key = `${next.round}:${next.solved.join(',')}`;
      if (next.solved.length && key !== hopped) {
        hopped = key;
        for (const member of members) if (!member.leaving && next.solved.includes(member.id)) hop(member);
      }
    };
    apply(initial);

    stage.onFrame((dt, time, calm) => {
      for (const member of [...members]) {
        const picked = !member.leaving && props.selected.includes(member.id);
        const right = !member.leaving && props.solved.includes(member.id);
        const dimmed = props.solved.length > 0 && !right && !member.leaving;
        const size = animateProp(kit, member, dt, time, calm, {
          show: member.leaving ? 0 : dimmed ? 0.8 : 1,
          lifted: picked && !right,
          glow: right ? GREEN : picked ? ORANGE : null,
        });
        member.holder.rotation.y = member.angle + (picked && !right && !calm ? Math.sin(time * 2.4) * 0.3 : 0);
        if (member.leaving && size < 0.01) {
          removeProp(stage, member);
          members = members.filter((other) => other !== member);
        }
      }
    });

    return { update: apply };
  },
};
