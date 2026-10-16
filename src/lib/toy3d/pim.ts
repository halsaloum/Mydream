import { THREE, toyMaterial } from './stage';

/**
 * Pim het potlood als speelgoedfiguurtje: een zeskantig geel lijf, een houten punt met
 * grafiet, een metalen ring en een rode gum als dop. Ogen en wangetjes zitten op de voorkant.
 * Hoogte ongeveer 2,4 eenheden; de punt staat op y = 0.
 */
export type Pim3D = {
  group: THREE.Group;
  /** Laat de ogen even dichtgaan. */
  blink: (amount: number) => void;
  /** Kijk een kant op (-1 … 1). */
  look: (x: number, y: number) => void;
};

export function buildPim(): Pim3D {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  const yellow = toyMaterial('#ffc800', { rough: 0.3 });
  const stripe = toyMaterial('#ffdb57', { rough: 0.3 });
  const wood = toyMaterial('#f4dcb4', { rough: 0.55, coat: 0.4 });
  const graphite = toyMaterial('#2b2a33', { rough: 0.25 });
  const metal = new THREE.MeshPhysicalMaterial({ color: '#d5dae2', metalness: 0.85, roughness: 0.22, clearcoat: 1 });
  const eraser = toyMaterial('#ff4b4b', { rough: 0.42 });
  const white = toyMaterial('#ffffff', { rough: 0.2 });
  const ink = toyMaterial('#1f1d26', { rough: 0.15 });
  const cheek = toyMaterial('#ff8f8f', { rough: 0.6, coat: 0.2 });

  const shadow = (mesh: THREE.Mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  // Punt: een kegel hout met een donkere grafietpunt.
  const tip = shadow(new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.62, 6), wood));
  tip.rotation.x = Math.PI;
  tip.position.y = 0.31;
  body.add(tip);
  const lead = shadow(new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.18, 12), graphite));
  lead.rotation.x = Math.PI;
  lead.position.y = 0.09;
  body.add(lead);

  // Lijf: zeskant met een lichtere baan.
  const shaft = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.35, 6), yellow));
  shaft.position.y = 0.62 + 0.675;
  shaft.rotation.y = Math.PI / 6;
  body.add(shaft);
  const band = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.425, 0.425, 1.35, 6, 1, true, -Math.PI / 6, Math.PI / 3), stripe));
  band.position.copy(shaft.position);
  band.rotation.y = Math.PI / 6 + Math.PI / 6;
  body.add(band);

  // Ring en gum.
  const ring = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.22, 32), metal));
  ring.position.y = 0.62 + 1.35 + 0.11;
  body.add(ring);
  for (const offset of [-0.06, 0.06]) {
    const groove = new THREE.Mesh(new THREE.TorusGeometry(0.445, 0.018, 8, 40), metal);
    groove.rotation.x = Math.PI / 2;
    groove.position.y = ring.position.y + offset;
    body.add(groove);
  }
  const cap = shadow(new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 0.18, 8, 24), eraser));
  cap.position.y = ring.position.y + 0.11 + 0.2;
  body.add(cap);

  // Gezicht op de voorkant (z+): ogen, pupillen, wangen en een lachje.
  const face = new THREE.Group();
  face.position.set(0, 1.42, 0.37);
  body.add(face);
  const pupils: THREE.Mesh[] = [];
  const eyes: THREE.Group[] = [];
  for (const x of [-0.16, 0.16]) {
    const eye = new THREE.Group();
    eye.position.set(x, 0.08, 0);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), white);
    ball.scale.z = 0.6;
    eye.add(ball);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 12), ink);
    pupil.position.z = 0.06;
    eye.add(pupil);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), white);
    shine.position.set(0.025, 0.03, 0.1);
    pupil.add(shine);
    pupils.push(pupil);
    eyes.push(eye);
    face.add(eye);
  }
  for (const x of [-0.27, 0.27]) {
    const blush = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 8), cheek);
    blush.scale.set(1, 0.6, 0.3);
    blush.position.set(x, -0.1, -0.02);
    face.add(blush);
  }
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.022, 8, 24, Math.PI), ink);
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.08, 0.02);
  face.add(smile);

  return {
    group,
    blink: (amount) => {
      for (const eye of eyes) eye.scale.y = Math.max(0.08, 1 - amount);
    },
    look: (x, y) => {
      for (const pupil of pupils) pupil.position.set(x * 0.045, y * 0.04, 0.06);
    },
  };
}
