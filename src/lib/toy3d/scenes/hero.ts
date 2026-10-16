import type { ToyScene } from '../toy-canvas';
import { buildPim } from '../pim';

/**
 * De startpagina: Pim (een Meshy-model) zweeft boven vier glanzende letterblokken die samen
 * "boek" spellen, het voorbeeld dat door alle niveaus groeit. Tik een blok en het springt op;
 * tik Pim en hij springt en draait een rondje. Lukt het model niet, dan staat Pim er als codefiguurtje.
 */
export type HeroProps = { letters: readonly string[] };

export const heroScene: ToyScene<HeroProps> = {
  options: () => ({ camera: { fov: 28, distance: 9.2, height: 2.6, target: [0, 1.05, 0] }, yaw: -0.18, sway: 0.22, yawLimit: [-1.2, 0.9] }),
  mount: (stage, kit, props) => {
    const { THREE, TOY_COLORS, toyMaterial, roundedBox, textTexture, fontFamily, springTo, loadThing } = kit;

    // Pim: een houder die zweeft en springt; het model komt erin zodra het geladen is.
    const pim = new THREE.Group();
    pim.position.set(0, 1.1, -0.6);
    pim.userData.tap = 'pim';
    stage.world.add(pim);
    stage.tappable.push(pim);
    const appear = { x: 0, v: 0 };
    let shown = false;
    loadThing('/models/dingen/pim.glb', 2.3)
      .then(async (model) => {
        model.rotation.y = -0.15;
        await stage.prepare(model);
        pim.add(model);
      })
      .catch(() => {
        const figure = buildPim();
        figure.group.scale.setScalar(0.8);
        pim.add(figure.group);
      })
      .finally(() => {
        shown = true;
        stage.wake();
      });

    const serif = fontFamily('serif');
    const blocks = props.letters.map((letter, i) => {
      const n = props.letters.length;
      const group = new THREE.Group();
      const angle = (i - (n - 1) / 2) * 0.3;
      group.position.set(Math.sin(angle) * 3.6, 0.45, Math.cos(angle) * 3.6 - 2.3);
      group.rotation.y = angle * 0.9;
      const cube = new THREE.Mesh(roundedBox(0.9, 0.9, 0.9, 0.16), toyMaterial(TOY_COLORS[i % TOY_COLORS.length]!));
      cube.castShadow = true;
      cube.receiveShadow = true;
      group.add(cube);
      const face = textTexture(
        (ctx, w, h) => {
          ctx.fillStyle = '#ffffff';
          ctx.font = `600 ${h * 0.78}px ${serif}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0,0,0,0.18)';
          ctx.shadowOffsetY = h * 0.03;
          ctx.fillText(letter, w / 2, h * 0.47);
        },
        256,
        256,
      );
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.72, 0.72),
        new THREE.MeshPhysicalMaterial({ map: face, transparent: true, roughness: 0.3, clearcoat: 1 }),
      );
      plane.position.z = 0.452;
      group.add(plane);
      group.userData.tap = `letter:${i}`;
      stage.world.add(group);
      stage.tappable.push(group);
      return { group, base: group.position.y, baseRot: group.rotation.y, y: 0, vy: 0, spin: { x: 0, v: 0 }, spinTarget: 0, phase: i * 1.3 };
    });

    const hop = { y: 0, vy: 0, turn: { x: 0, v: 0 }, turnTarget: 0 };
    let still = false;

    stage.onFrame((dt, time, calm) => {
      still = calm;
      const size = calm ? Number(shown) : springTo(appear, shown ? 1 : 0, dt, 140, 12);
      pim.scale.setScalar(Math.max(0.001, size));
      hop.vy -= 22 * dt;
      hop.y = Math.max(0, hop.y + hop.vy * dt);
      if (hop.y === 0) hop.vy = 0;
      const bob = calm ? 0 : Math.sin(time * 1.6) * 0.07;
      pim.position.y = 1.1 + bob + hop.y;
      pim.rotation.y = springTo(hop.turn, hop.turnTarget, dt, 60, 9) + (calm ? 0 : Math.sin(time * 0.7) * 0.18);
      pim.rotation.z = calm ? 0 : Math.sin(time * 1.1) * 0.05;

      for (const block of blocks) {
        block.vy -= 26 * dt;
        block.y = Math.max(0, block.y + block.vy * dt);
        if (block.y === 0) block.vy = block.vy < -3 ? -block.vy * 0.3 : 0;
        const float = calm ? 0 : Math.sin(time * 1.3 + block.phase) * 0.04;
        block.group.position.y = block.base + block.y + float;
        block.group.rotation.y = block.baseRot + springTo(block.spin, block.spinTarget, dt, 90, 11);
      }
    });

    return {
      update: () => {},
      tap: (id) => {
        // Rustige beweging: geen sprongetjes; het woord en het geluid komen wel.
        if (still) return;
        if (id === 'pim') {
          hop.vy = 7;
          hop.turnTarget += Math.PI * 2;
          return;
        }
        const block = blocks[Number(id.split(':')[1])];
        if (!block) return;
        block.vy = 6.5;
        block.spinTarget += Math.PI * 2;
      },
    };
  },
};
