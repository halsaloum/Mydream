import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Het speelgoedtheater: één WebGL-scène in de stijl van glanzende speelgoedvoorwerpen
 * (zachte studiolampen, gelakte kleuren, een zachte schaduw op de vloer). Elk 3D-onderdeel
 * van pennig bouwt hierop. Dit bestand laadt pas in de browser, via `ToyCanvas`.
 *
 * Draaien: horizontaal slepen draait de wereld (verticaal scrollen blijft werken op de
 * telefoon), even tikken kiest een voorwerp. Bij rustige beweging staat alles stil
 * behalve wat de leerling zelf doet.
 */

export { THREE };

/** De merkkleuren, een tikje zachter: glanzend speelgoed, geen neon. */
export const TOY_COLORS = ['#3dbcf5', '#ffa42e', '#6fcf2c', '#d496ff', '#ff98d6', '#2fcfb6', '#ffd23f'];

/** Accentnamen uit de inhoud als speelgoedkleur. */
export const TOY_ACCENTS: Record<string, string> = {
  green: '#6fcf2c',
  teal: '#2fcfb6',
  orange: '#ffa42e',
  yellow: '#ffd23f',
  blue: '#3dbcf5',
  purple: '#d496ff',
  navy: '#5b7fe0',
  pink: '#ff98d6',
  red: '#ff6464',
  rose: '#ff7f9e',
  slate: '#8fa0b4',
};

/** Onbereikt: room-wit, zoals ongeverfd speelgoed. */
export const TOY_CREAM = '#f3ede2';

export type StageOptions = {
  calm: boolean;
  /** Camera: afstand, hoogte en waar hij naar kijkt. */
  camera?: { fov?: number; distance?: number; height?: number; target?: [number, number, number] };
  /** Begindraaiing van de wereld in radialen, en hoe ver je mag draaien (yaw). */
  yaw?: number;
  yawLimit?: [number, number];
  pitch?: number;
  /** Zachte heen-en-weerbeweging als niemand draait (radialen). */
  sway?: number;
  /** Rustig ronddraaien als niemand draait (radialen per seconde). */
  spin?: number;
  shadow?: boolean;
  /** Onder deze breedte/hoogte-verhouding gaat de camera verder weg, zodat alles in beeld blijft. */
  fitAspect?: number;
  /** De vloer waar de schaduw op valt. */
  floorY?: number;
  onTap?: (object: THREE.Object3D | null) => void;
};

export type Stage = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Alles wat meedraait als je sleept. */
  world: THREE.Group;
  /** Objecten die je kunt aantikken; `userData.tap` zegt wat het is. */
  tappable: THREE.Object3D[];
  /** Elke beeldje: tijdstap, verstreken tijd en of de beweging rustig moet. */
  onFrame: (callback: (dt: number, time: number, calm: boolean) => void) => () => void;
  /** Klaar zodra het eerste beeldje getekend is. */
  shown: Promise<void>;
  /** Bouw de shaders van een nieuw voorwerp vooraf (waar het kan op de achtergrond), zodat het beeld niet hapert. */
  prepare: (object: THREE.Object3D) => Promise<void>;
  setCalm: (calm: boolean) => void;
  /** Er gebeurt iets (nieuwe props, een model is geladen): teken weer op volle snelheid. */
  wake: () => void;
  /** Duw de wereld in een richting (bv. bij een fout antwoord). */
  nudge: (yaw: number) => void;
  dispose: () => void;
};

/** Glanzend speelgoedmateriaal: gelakt plastic met een heldere toplaag. */
export function toyMaterial(color: THREE.ColorRepresentation, { rough = 0.38, coat = 1, map }: { rough?: number; coat?: number; map?: THREE.Texture } = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: rough,
    metalness: 0,
    clearcoat: coat,
    clearcoatRoughness: 0.14,
    sheen: 0.15,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color('#ffffff'),
    map: map ?? null,
  });
}

/** Een blok met afgeronde randen, zoals een speelgoedblokje. */
export function roundedBox(width: number, height: number, depth: number, radius = 0.12) {
  return new RoundedBoxGeometry(width, height, depth, 5, Math.min(radius, width / 2, height / 2, depth / 2) * 0.999);
}

/** De lettertypen van de app, zodat tekst in 3D hetzelfde oogt als de rest. */
export function fontFamily(kind: 'serif' | 'display' | 'sans'): string {
  if (typeof document === 'undefined') return 'serif';
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--font-${kind}`).trim();
  return value || (kind === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif');
}

/** Tekst op een doorzichtig vlakje, om op een blok te plakken. */
export function textTexture(draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void, width = 512, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Werk een bestaande teksttextuur bij (bv. een voortgangsbalkje). */
export function redraw(texture: THREE.CanvasTexture, draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void) {
  const canvas = texture.image as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(ctx, canvas.width, canvas.height);
  texture.needsUpdate = true;
}

/** Een veer naar een doelwaarde; zo bewegen alle blokken zacht en tastbaar. */
export function springTo(state: { v: number; x: number }, target: number, dt: number, stiffness = 170, damping = 18) {
  const step = Math.min(dt, 1 / 30);
  const force = (target - state.x) * stiffness - state.v * damping;
  state.v += force * step;
  state.x += state.v * step;
  return state.x;
}

const models = new Map<string, Promise<GLTF>>();

/**
 * Een Meshy-model als speelgoed: staat met zijn onderkant op y = 0, midden op de as, en past in
 * een kubus van `size`. De lak krijgt een heldere toplaag, zodat het glanst zoals de rest.
 * Modellen worden één keer geladen en daarna gekloond.
 */
export async function loadThing(url: string, size = 1): Promise<THREE.Group> {
  let loading = models.get(url);
  if (!loading) {
    loading = new GLTFLoader().loadAsync(url);
    models.set(url, loading);
    loading.catch(() => models.delete(url));
  }
  const gltf = await loading;
  const model = gltf.scene.clone(true);
  model.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const source = mesh.material as THREE.MeshStandardMaterial;
    const lacquer = new THREE.MeshPhysicalMaterial({
      map: source.map,
      normalMap: source.normalMap,
      roughnessMap: source.roughnessMap,
      metalnessMap: source.metalnessMap,
      color: source.color,
      roughness: Math.min(source.roughness ?? 0.5, 0.6),
      metalness: source.metalness ?? 0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.18,
    });
    mesh.material = lacquer;
  });
  const box = new THREE.Box3().setFromObject(model);
  const dimensions = box.getSize(new THREE.Vector3());
  const scale = size / Math.max(dimensions.x, dimensions.y, dimensions.z, 1e-6);
  const center = box.getCenter(new THREE.Vector3());
  model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
  model.scale.setScalar(scale);
  const holder = new THREE.Group();
  holder.add(model);
  return holder;
}

export function createStage(canvas: HTMLCanvasElement, options: StageOptions): Stage {
  let calm = options.calm;
  // Scherpe schermen hebben genoeg pixels: dan geen extra anti-aliasing en hooguit 1,5× zoveel pixels.
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: ratio < 1.5, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(ratio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = options.shadow !== false;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  scene.environmentIntensity = 0.85;
  room.dispose();

  const cam = options.camera ?? {};
  const target = new THREE.Vector3(...(cam.target ?? [0, 0, 0]));
  const camera = new THREE.PerspectiveCamera(cam.fov ?? 30, 1, 0.1, 100);
  camera.position.set(0, cam.height ?? 2.2, cam.distance ?? 8);
  camera.lookAt(target);

  // Studiolicht: een zachte koepel, een warme hoofdlamp met schaduw en een koel strijklicht.
  scene.add(new THREE.HemisphereLight('#fffaf0', '#e9dcc4', 1.1));
  const key = new THREE.DirectionalLight('#fff4e0', 2.1);
  key.position.set(3.5, 7, 5);
  key.castShadow = options.shadow !== false;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -6;
  key.shadow.camera.right = 6;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  key.shadow.radius = 8;
  key.shadow.blurSamples = 16;
  key.shadow.bias = -0.0006;
  scene.add(key);
  const rim = new THREE.DirectionalLight('#dbeeff', 0.9);
  rim.position.set(-5, 3, -4);
  scene.add(rim);

  const world = new THREE.Group();
  scene.add(world);

  if (options.shadow !== false) {
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ color: '#5a3c14', opacity: 0.22 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = options.floorY ?? 0;
    floor.receiveShadow = true;
    world.add(floor);
  }

  const tappable: THREE.Object3D[] = [];
  const callbacks = new Set<(dt: number, time: number, calm: boolean) => void>();

  // Draaien met een veer: slepen zet het doel, de wereld volgt zacht.
  const limit = options.yawLimit ?? [-Infinity, Infinity];
  const baseYaw = options.yaw ?? 0;
  const yaw = { x: baseYaw, v: 0 };
  let yawTarget = baseYaw;
  let lastInput = -Infinity;
  world.rotation.x = options.pitch ?? 0;

  const pointer = { id: -1, startX: 0, startY: 0, lastX: 0, moved: false, startYaw: 0 };
  const raycaster = new THREE.Raycaster();

  const pick = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(tappable, true)[0];
    let object: THREE.Object3D | null = hit?.object ?? null;
    while (object && object.userData.tap === undefined) object = object.parent;
    return object;
  };

  // Zuinig tekenen: volle snelheid zolang er iets gebeurt, daarna half zo vaak, en na een tijdje
  // (bij rustige beweging meteen) helemaal niet meer tot er weer iets gebeurt.
  let lastActivity = performance.now();
  const wake = () => {
    lastActivity = performance.now();
  };

  const onDown = (event: PointerEvent) => {
    wake();
    pointer.id = event.pointerId;
    pointer.startX = pointer.lastX = event.clientX;
    pointer.startY = event.clientY;
    pointer.moved = false;
    pointer.startYaw = yawTarget;
  };
  const onMove = (event: PointerEvent) => {
    wake();
    if (event.pointerId !== pointer.id) {
      const over = pick(event.clientX, event.clientY);
      canvas.style.cursor = over ? 'pointer' : 'grab';
      return;
    }
    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;
    if (!pointer.moved && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
      pointer.moved = true;
      canvas.setPointerCapture?.(event.pointerId);
      canvas.style.cursor = 'grabbing';
    }
    if (pointer.moved) {
      yawTarget = Math.min(limit[1], Math.max(limit[0], pointer.startYaw + dx * 0.012));
      lastInput = performance.now();
    }
  };
  const onUp = (event: PointerEvent) => {
    if (event.pointerId !== pointer.id) return;
    pointer.id = -1;
    canvas.style.cursor = 'grab';
    if (!pointer.moved && Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) < 8) {
      options.onTap?.(pick(event.clientX, event.clientY));
    }
    lastInput = performance.now();
  };
  const onCancel = () => {
    pointer.id = -1;
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);
  canvas.style.touchAction = 'pan-y';
  canvas.style.cursor = 'grab';

  const resize = () => {
    wake();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Smalle schermen: iets verder weg, zodat alles in beeld blijft.
    camera.position.z = (cam.distance ?? 8) * Math.max(1, (options.fitAspect ?? 1.25) / camera.aspect);
    camera.updateProjectionMatrix();
    camera.lookAt(target);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  let visible = true;
  const seen = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    if (visible) wake();
  });
  seen.observe(canvas);

  // Eerst de shaders bouwen, dan pas tekenen. Kan de browser dat op de achtergrond (de meeste
  // telefoons en computers), dan blijft de pagina vloeiend terwijl de 3D opstart.
  let disposed = false;
  const prepare = (object: THREE.Object3D) =>
    new Promise<void>((resolve) => {
      let materials: Set<THREE.Material>;
      try {
        materials = renderer.compile(object, camera, scene);
      } catch {
        return resolve();
      }
      const check = () => {
        if (disposed) return;
        for (const material of materials) {
          const program = (renderer.properties.get(material) as { currentProgram?: { isReady: () => boolean } }).currentProgram;
          if (!program || program.isReady()) materials.delete(material);
        }
        if (materials.size) setTimeout(check, 16);
        else resolve();
      };
      check();
    });
  let warm: 'cold' | 'warming' | 'warm' = 'cold';
  let drawn = false;
  let firstFrame = () => {};
  const shown = new Promise<void>((resolve) => (firstFrame = resolve));

  const timer = new THREE.Timer();
  let time = 0;
  let frame = 0;
  let pending = 0;
  let tick = 0;
  const loop = () => {
    frame = requestAnimationFrame(loop);
    timer.update();
    pending += timer.getDelta();
    if (warm !== 'warm') {
      if (warm === 'cold') {
        warm = 'warming';
        void prepare(scene).then(() => {
          warm = 'warm';
          wake();
        });
      }
      return void (pending = 0);
    }
    // Buiten beeld niets tekenen, behalve het allereerste beeldje: dan staat het klaar als je erheen scrolt.
    if (drawn && (!visible || document.hidden)) return void (pending = 0);
    const quiet = performance.now() - lastActivity;
    if (quiet > (calm ? 1500 : 20000)) return void (pending = 0);
    if (quiet > 3000 && tick++ % 2) return;
    const dt = Math.min(pending, 0.1);
    pending = 0;
    time += dt;
    const idle = performance.now() - lastInput > 2500 && pointer.id === -1;
    if (idle && !calm) {
      if (options.spin) yawTarget += options.spin * dt;
      else if (options.sway) yawTarget = baseYaw + Math.sin(time * 0.45) * options.sway;
    }
    world.rotation.y = springTo(yaw, yawTarget, dt, 120, 16);
    for (const callback of callbacks) callback(dt, time, calm);
    renderer.render(scene, camera);
    drawn = true;
    firstFrame();
  };
  frame = requestAnimationFrame(loop);

  return {
    scene,
    camera,
    world,
    tappable,
    onFrame: (callback) => {
      callbacks.add(callback);
      return () => callbacks.delete(callback);
    },
    shown,
    prepare,
    setCalm: (value) => {
      if (value !== calm) wake();
      calm = value;
    },
    wake,
    nudge: (amount) => {
      wake();
      yawTarget = Math.min(limit[1], Math.max(limit[0], yawTarget + amount));
      lastInput = performance.now();
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      seen.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
        for (const material of materials) {
          for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose();
          material.dispose();
        }
      });
      scene.environment?.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
