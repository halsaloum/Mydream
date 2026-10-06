#!/usr/bin/env node
/**
 * De 3D-voorwerpen van pennig ("dingen"), gemaakt met Meshy (https://docs.meshy.ai) in de stijl
 * van glanzend speelgoed: eerst een plaatje in die stijl (text-to-image), daarna een 3D-model
 * uit dat plaatje (image-to-3d). Zo lijken alle voorwerpen op elkaar.
 *
 *   node scripts/meshy-dingen.mjs plaatje <naam…>   maak het voorbeeldplaatje (alle namen: --alle)
 *   node scripts/meshy-dingen.mjs model <naam…>     maak het 3D-model uit het plaatje
 *   node scripts/meshy-dingen.mjs ophalen <naam…>   GLB en icoon naar public/models/dingen/
 *   node scripts/meshy-dingen.mjs stand             welke taken er lopen
 *
 * De sleutel staat in MESHY_API_KEY (nooit in de repo); achter de proxy van de ontwikkelomgeving
 * zet die hem er zelf bij. Zet NODE_USE_ENV_PROXY=1, dan gebruikt fetch HTTPS_PROXY.
 *
 * Elk model gaat door gltf-transform: textures als WebP van max. 1024 px en gekwantiseerde punten
 * (geen decoder van buiten nodig). Het icoon is het voorbeeldplaatje zonder achtergrond, 256 px als WebP.
 * De taak-id's staan in scripts/meshy-dingen.json, zodat je een model later opnieuw kunt ophalen.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const STYLE =
  '3D icon in a playful glossy toy style: soft rounded chunky shapes, smooth clean surfaces with a subtle glossy sheen, saturated but soft colors, soft studio lighting, centered, three-quarter view from slightly above, the whole object fully visible, isolated on a plain white background, no text, no letters, no logo';

/** Wat elk voorwerp is. De Nederlandse naam is de sleutel; `prompt` beschrijft het voor Meshy. */
export const DINGEN = {
  pim: 'a cute yellow wooden pencil character standing upright on its sharpened point, hexagonal yellow body, red rounded eraser on top with a silver metal band, light wood tip with a dark graphite point, big friendly round cartoon eyes and a small smile on the yellow body, small pink cheeks',
  boek: 'a single closed hardcover book lying flat, blue cover with a cream page block, slightly rounded spine',
  kast: 'a small empty wooden cabinet with two open shelves, warm light wood, rounded edges, nothing on the shelves',
  boekenkast: 'a small wooden bookcase with three shelves full of colorful books standing upright, warm light wood, rounded edges',
  pan: 'a single round frying pan with a long handle, glossy black pan and a warm wooden handle',
  koek: 'a single round golden brown cookie with a few sugar crystals',
  pannenkoek: 'a stack of three thick golden Dutch pancakes on a plate with a small pat of butter and powdered sugar',
  zon: 'a cheerful round yellow sun with short rounded rays, no face',
  bloem: 'a single simple flower with pink rounded petals, a yellow center and a short green stem with one leaf',
  zonnebloem: 'a single sunflower with big yellow petals, a dark brown seed center and a green stem with two leaves',
  pot: 'an empty terracotta flower pot, rounded rim, warm orange clay',
  bloempot: 'a terracotta flower pot with a pink flower and green leaves growing out of it',
  visser: 'a friendly toy fisherman figure in a yellow raincoat and yellow rain hat, holding a small fishing rod, chunky rounded toy proportions',
  boot: 'a small simple wooden rowing boat, red hull with a white stripe, empty',
  vissersboot: 'a small fishing boat with a little white wheelhouse, a blue hull, a fishing net and a mast',
  ster: 'a shiny golden star trophy on a small round base, rounded star points',
  mus: 'a small plump brown house sparrow bird standing, brown and grey feathers, short beak, chunky rounded toy proportions',
  roodborst: 'a small plump European robin bird standing, bright orange-red breast and face, brown back, white belly, short thin beak, chunky rounded toy proportions',
  pinguin: 'a standing penguin, black back and white belly, small orange beak and orange feet, short flippers, chunky rounded toy proportions',
  struisvogel: 'a standing ostrich, fluffy black body feathers with white wing tips, long pink neck and long pink legs, small head, chunky rounded toy proportions',
  kip: 'a standing white hen with a red comb and wattle, small yellow beak, yellow legs, chunky rounded toy proportions',
  vleermuis: 'a small brown bat with its leathery wings spread open, big ears, furry round body, chunky rounded toy proportions',
  muis: 'a small grey mouse animal sitting, big round pink ears, long thin tail, chunky rounded toy proportions',
  computermuis: 'a single white computer mouse with a grey scroll wheel and a short curled cable, no logo',
  zitbank: 'a small cozy three-seat sofa with soft green cushions and short wooden legs',
  geldbank: 'a small classical bank building with white columns, a triangular roof, a big round golden vault door in front and a few gold coins on the steps',
  hangslot: 'a single closed brass padlock with a silver shackle and a keyhole',
  kasteel: 'a small fairytale castle with two round towers, pointed blue roofs, stone walls, a wooden gate and little flags',
  glas: 'a single empty clear drinking glass, simple tumbler shape, slightly blue tint',
  ei: 'a single whole brown chicken egg standing upright',
  mes: 'a single kitchen knife lying flat, shiny silver blade and a red handle with rivets',
  huis: 'a small cozy house with a red tiled roof, a chimney, cream walls, a blue door and two windows',
  munten: 'a small stack of shiny gold coins with two coins lying next to it',
  vis: 'a single fresh fish lying on its side, silver blue scales, orange fins, round eye',
};

const LOG = join(process.cwd(), 'scripts', 'meshy-dingen.json');
const OUT = join(process.cwd(), 'public', 'models', 'dingen');
const API = 'https://api.meshy.ai/openapi/v1';
const headers = { 'Content-Type': 'application/json', ...(process.env.MESHY_API_KEY ? { Authorization: `Bearer ${process.env.MESHY_API_KEY}` } : {}) };

const log = () => (existsSync(LOG) ? JSON.parse(readFileSync(LOG, 'utf8')) : {});
const save = (data) => writeFileSync(LOG, `${JSON.stringify(data, null, 2)}\n`);

async function api(path, body) {
  const response = await fetch(`${API}${path}`, body ? { method: 'POST', headers, body: JSON.stringify(body) } : { headers });
  if (!response.ok) throw new Error(`Meshy ${response.status} op ${path}: ${await response.text()}`);
  return response.json();
}

async function wait(path) {
  for (;;) {
    const task = await api(path);
    if (task.status === 'SUCCEEDED') return task;
    if (task.status === 'FAILED' || task.status === 'CANCELED') throw new Error(`${path}: ${task.status} ${task.task_error?.message ?? ''}`);
    await new Promise((resolve) => setTimeout(resolve, 8000));
  }
}

async function download(url, file) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Downloaden mislukt (${response.status}): ${new URL(url).host}`);
  writeFileSync(file, Buffer.from(await response.arrayBuffer()));
}

async function image(name) {
  const { result } = await api('/text-to-image', { ai_model: 'nano-banana-pro', prompt: `${DINGEN[name]}. ${STYLE}`, aspect_ratio: '1:1' });
  const data = log();
  data[name] = { ...data[name], image: result };
  save(data);
  const task = await wait(`/text-to-image/${result}`);
  console.log(`${name}: plaatje klaar ${task.image_urls[0]}`);
}

async function model(name) {
  const entry = log()[name];
  if (!entry?.image) throw new Error(`${name}: maak eerst een plaatje`);
  const picture = await api(`/text-to-image/${entry.image}`);
  const { result } = await api('/image-to-3d', {
    image_url: picture.image_urls[0],
    ai_model: 'latest',
    should_texture: true,
    enable_pbr: true,
    should_remesh: true,
    topology: 'triangle',
    target_polycount: 12000,
  });
  const data = log();
  data[name] = { ...data[name], model: result };
  save(data);
  await wait(`/image-to-3d/${result}`);
  console.log(`${name}: model klaar`);
}

async function fetchModel(name) {
  const entry = log()[name];
  if (!entry?.model) throw new Error(`${name}: maak eerst een model`);
  const task = await api(`/image-to-3d/${entry.model}`);
  const picture = await api(`/text-to-image/${entry.image}`);
  mkdirSync(OUT, { recursive: true });
  const raw = join(OUT, `${name}.raw.glb`);
  const png = join(OUT, `${name}.raw.png`);
  await download(task.model_urls.glb, raw);
  await download(picture.image_urls[0], png);
  const run = (...args) => execFileSync('npx', ['-y', '@gltf-transform/cli@4', ...args], { stdio: 'inherit' });
  run('optimize', raw, join(OUT, `${name}.glb`), '--compress', 'quantize', '--texture-compress', 'webp', '--texture-size', '1024');
  // Icoon: de witte achtergrond wordt doorzichtig (vullen vanuit de hoeken), bijgesneden en gecentreerd.
  const corners = ['0,0', '1023,0', '0,1023', '1023,1023'].flatMap((at) => ['-draw', `color ${at} floodfill`]);
  execFileSync('convert', [
    png,
    '-alpha',
    'set',
    '-fuzz',
    '6%',
    '-fill',
    'none',
    ...corners,
    '-trim',
    '+repage',
    '-resize',
    '232x232',
    '-background',
    'none',
    '-gravity',
    'center',
    '-extent',
    '256x256',
    '-quality',
    '85',
    join(OUT, `${name}.webp`),
  ]);
  rmSync(raw);
  rmSync(png);
  console.log(`${name}: public/models/dingen/${name}.glb en .webp`);
}

const [command, ...rest] = process.argv.slice(2);
const names = rest.includes('--alle') ? Object.keys(DINGEN) : rest;
const unknown = names.filter((name) => !(name in DINGEN));
if (unknown.length) throw new Error(`Onbekend: ${unknown.join(', ')}`);

const each = async (fn) => {
  const results = await Promise.allSettled(names.map(fn));
  results.forEach((result, i) => result.status === 'rejected' && console.error(`${names[i]}: ${result.reason.message}`));
  if (results.some((result) => result.status === 'rejected')) process.exitCode = 1;
};

if (command === 'plaatje') await each(image);
else if (command === 'model') await each(model);
else if (command === 'ophalen') await each(fetchModel);
else if (command === 'stand') console.log(log());
else {
  console.log('Gebruik: plaatje | model | ophalen <naam…> of --alle, of stand');
  process.exitCode = 1;
}
