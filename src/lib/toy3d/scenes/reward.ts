import { thingModel, type ThingId } from '@/content/things';
import type { ToyScene } from '../toy-canvas';

/**
 * De beloning na een les: een Meshy-voorwerp (de gouden ster, of Pim als het nog niet lukte)
 * valt van boven op zijn plek, stuitert even en draait rustig rond. Tik erop en het springt.
 */
export type RewardProps = { thing: ThingId; drop: boolean };

export const rewardScene: ToyScene<RewardProps> = {
  options: () => ({ camera: { fov: 30, distance: 3.7, height: 1.4, target: [0, 0.66, 0] }, fitAspect: 0.8, spin: 0.6 }),
  mount: (stage, kit, props) => {
    const { THREE, loadThing } = kit;
    const holder = new THREE.Group();
    holder.userData.tap = 'beloning';
    stage.world.add(holder);
    stage.tappable.push(holder);
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.3), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.y = 0.65;
    holder.add(hit);

    // Vallen en stuiteren: begint hoog (of meteen op de grond zonder feestje of bij rustige beweging).
    const fall = { y: props.drop ? 3.2 : 0, vy: 0 };
    let ready = false;
    void loadThing(thingModel(props.thing), 1.3)
      .then(async (model) => {
        await stage.prepare(model);
        holder.add(model);
        ready = true;
        stage.wake();
      })
      .catch(() => undefined);

    let still = false;
    stage.onFrame((dt, _time, calm) => {
      still = calm;
      holder.visible = ready;
      if (!ready) return;
      if (calm) fall.y = 0;
      fall.vy -= 24 * dt;
      fall.y += fall.vy * dt;
      if (fall.y < 0) {
        fall.y = 0;
        fall.vy = fall.vy < -2 ? -fall.vy * 0.42 : 0;
      }
      holder.position.y = fall.y;
      // Bij het neerkomen even platgedrukt, zoals zacht speelgoed.
      const squash = fall.y < 0.05 && Math.abs(fall.vy) > 0.5 ? 0.88 : 1;
      holder.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
    });

    return {
      update: () => {},
      tap: () => {
        if (still) return;
        fall.vy = 6;
        stage.nudge(Math.PI);
      },
    };
  },
};
