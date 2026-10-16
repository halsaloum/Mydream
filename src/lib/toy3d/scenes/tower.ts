import type { ToyScene } from '../toy-canvas';

/**
 * De niveautoren in echte 3D: negen gelakte platen, letter onderaan en alinea bovenaan.
 * Bereikte niveaus hebben hun kleur, de rest is nog ongeverfd. Het gekozen niveau schuift
 * naar voren. Op de voorkant staan het nummer, de naam en hoeveel lessen af zijn.
 */
export type TowerProps = {
  layers: readonly { name: string; accent: string }[];
  selected: number;
  ratios: readonly number[];
};

const W = 2.7;
const H = 0.5;
const D = 1.55;
const GAP = 0.05;
/** Het naambordje op de voorkant: bijna zo hoog als de plaat, zodat de tekst leesbaar blijft. */
const LABEL_W = W - 0.14;
const LABEL_H = H * 0.78;

export const towerScene: ToyScene<TowerProps> = {
  options: (props) => {
    const top = props.layers.length * (H + GAP);
    return {
      camera: { fov: 30, distance: 11.5, height: top * 0.7 + 1.5, target: [0, top / 2 - 0.1, 0] },
      fitAspect: 0.7,
      yaw: -0.4,
      sway: 0.25,
      yawLimit: [-1.4, 0.6],
    };
  },
  mount: (stage, kit, initial) => {
    const { THREE, TOY_ACCENTS, TOY_CREAM, toyMaterial, roundedBox, textTexture, redraw, fontFamily, springTo } = kit;
    const display = fontFamily('display');
    const geometry = roundedBox(W, H, D, 0.09);

    const drawFront = (index: number, name: string, ratio: number, reached: boolean) => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const ink = reached ? '#ffffff' : '#6b6459';
      ctx.fillStyle = reached ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.06)';
      ctx.beginPath();
      ctx.arc(h * 0.5, h * 0.5, h * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = ink;
      ctx.font = `800 ${h * 0.42}px ${display}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(index + 1), h * 0.5, h * 0.53);
      ctx.textAlign = 'left';
      ctx.font = `800 ${h * 0.5}px ${display}`;
      const maxText = w - h * 1.05 - (ratio > 0 ? w * 0.2 : 0);
      let label = name;
      while (ctx.measureText(label).width > maxText && label.length > 4) label = `${label.slice(0, -2)}…`;
      ctx.fillText(label, h * 1.0, h * 0.55);
      if (ratio > 0) {
        const bw = w * 0.15;
        const x = w - bw - h * 0.3;
        ctx.fillStyle = reached ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.roundRect(x, h * 0.42, bw, h * 0.18, h * 0.09);
        ctx.fill();
        ctx.fillStyle = reached ? '#ffffff' : '#58cc02';
        ctx.beginPath();
        ctx.roundRect(x, h * 0.42, Math.max(h * 0.18, bw * ratio), h * 0.18, h * 0.09);
        ctx.fill();
      }
    };

    const slabs = initial.layers.map((layer, index) => {
      const group = new THREE.Group();
      const material = toyMaterial(TOY_CREAM, { rough: 0.42 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      const texture = textTexture(() => {}, 1024, Math.round((1024 * LABEL_H) / LABEL_W));
      const front = new THREE.Mesh(
        new THREE.PlaneGeometry(LABEL_W, LABEL_H),
        new THREE.MeshPhysicalMaterial({ map: texture, transparent: true, roughness: 0.35, clearcoat: 1 }),
      );
      front.position.z = D / 2 + 0.002;
      group.add(front);
      group.position.y = H / 2 + index * (H + GAP);
      group.userData.tap = `layer:${index}`;
      stage.world.add(group);
      stage.tappable.push(group);
      return {
        group,
        material,
        texture,
        color: new THREE.Color(TOY_CREAM),
        base: group.position.y,
        z: { x: 0, v: 0 },
        lift: { x: 0, v: 0 },
        key: '',
        accent: TOY_ACCENTS[layer.accent] ?? TOY_CREAM,
      };
    });

    let props = initial;
    const target = new THREE.Color();
    const apply = (next: TowerProps) => {
      props = next;
      slabs.forEach((slab, index) => {
        const reached = index <= next.selected;
        const ratio = next.ratios[index] ?? 0;
        const key = `${reached}:${Math.round(ratio * 100)}`;
        if (key !== slab.key) {
          slab.key = key;
          redraw(slab.texture, drawFront(index, next.layers[index]?.name ?? '', ratio, reached));
        }
      });
    };
    apply(initial);

    stage.onFrame((dt, time, calm) => {
      slabs.forEach((slab, index) => {
        const active = index === props.selected;
        const reached = index <= props.selected;
        target.set(reached ? slab.accent : TOY_CREAM);
        // Bij rustige beweging staat alles meteen op zijn plek: geen schuiven en geen kleurverloop.
        if (calm) {
          Object.assign(slab.z, { x: active ? 0.55 : 0, v: 0 });
          Object.assign(slab.lift, { x: active ? 0.04 : 0, v: 0 });
          slab.color.copy(target);
        } else {
          springTo(slab.z, active ? 0.55 : 0, dt, 160, 16);
          springTo(slab.lift, active ? 0.04 : 0, dt, 160, 16);
          slab.color.lerp(target, Math.min(1, dt * 8));
        }
        slab.material.color.copy(slab.color);
        slab.group.position.z = slab.z.x;
        const breathe = active && !calm ? Math.sin(time * 2.2) * 0.025 : 0;
        slab.group.position.y = slab.base + slab.lift.x + breathe;
      });
    });

    return { update: apply };
  },
};
