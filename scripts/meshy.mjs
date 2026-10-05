#!/usr/bin/env node
/**
 * De 3D-modellen van pennig, gemaakt met Meshy (https://docs.meshy.ai). Zo kun je ze opnieuw
 * maken of een nieuwe versie binnenhalen.
 *
 *   node scripts/meshy.mjs make <naam>              plaatje maken, daarna het 3D-model (drukt de taak-id's af)
 *   node scripts/meshy.mjs status <taakId>          stand van een Meshy-taak
 *   node scripts/meshy.mjs fetch <taakId> <naam>    het model naar public/models/<naam>.glb
 *
 * Achter een proxy: zet NODE_USE_ENV_PROXY=1, dan gebruikt fetch HTTPS_PROXY.
 *
 * Eerst een plaatje, dan 3D: Meshy maakt van de tekst een plaatje in de stijl van thiings.co
 * (glanzend speelgoed, ronde dikke vormen) en zet dat plaatje om in een model. Zo komt de stijl
 * veel beter over dan bij tekst-naar-3D, en elk onderdeel krijgt een eigen kleur.
 *
 * De sleutel staat in MESHY_API_KEY (nooit in de repo). Het model gaat daarna door gltf-transform:
 * kleinere textures (WebP, max. 1024 px) en gekwantiseerde punten (geen decoder van buiten nodig), zodat het snel laadt.
 *
 * De stippen op het model (`AT` in `src/content/packs/deel-3d.ts`) zijn plekken in meters. Meet
 * ze in de browser op de les: `document.querySelector('model-viewer').positionAndNormalFromPoint(x, y)`
 * geeft voor een punt op het scherm de plek en de richting op het model.
 *
 * Het plaatje dat je ziet zolang het model laadt (`<naam>.webp`), is het model zelf in de
 * beginstand van de camera: `await document.querySelector('model-viewer').toBlob()` op de les.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** De gedeelde stijl, achter elk onderwerp geplakt. */
const STYLE =
  '3D icon in a playful glossy toy style: soft rounded chunky shapes, smooth clean surfaces with a subtle glossy sheen, saturated but soft colors, soft studio lighting, centered, three-quarter view from slightly above, the whole object fully visible, isolated on a plain white background, no text, no letters, no logo';

/** Hoe elk model gemaakt is: het onderwerp van het plaatje, en de taak waar het bestand van komt. */
export const RECIPES = {
  fiets: {
    subject:
      'a classic Dutch city bicycle (omafiets) with a mint green frame, exactly one caramel brown saddle, a curved silver handlebar with one big round silver bell, a round yellow front lamp, a rear luggage carrier, cream mudguards over both wheels, a closed cream chain guard, two chunky pedals, a folded kickstand and two fat black tyres with thick silver hubs and a few thick spokes',
    /** De image-to-3d-taak waar `public/models/fiets.glb` van komt. */
    task: '01a10d66-c4f6-748a-a963-246c32464cae',
  },
};

const IMAGE = { ai_model: 'nano-banana-pro' };
const MODEL = { ai_model: 'latest', should_texture: true, enable_pbr: true, should_remesh: true, target_polycount: 30000, topology: 'triangle', symmetry_mode: 'auto' };

const API = 'https://api.meshy.ai/openapi/v1';
const headers = { 'Content-Type': 'application/json', ...(process.env.MESHY_API_KEY ? { Authorization: `Bearer ${process.env.MESHY_API_KEY}` } : {}) };

async function call(path, body) {
  const response = await fetch(`${API}/${path}`, body ? { method: 'POST', headers, body: JSON.stringify(body) } : { headers });
  if (!response.ok) throw new Error(`Meshy ${response.status}: ${await response.text()}`);
  return response.json();
}

async function wait(path) {
  for (;;) {
    const result = await call(path);
    if (result.status === 'SUCCEEDED') return result;
    if (result.status === 'FAILED' || result.status === 'CANCELED') throw new Error(`${path}: ${result.task_error?.message ?? result.status}`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

async function download(url, file) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Downloaden mislukt (${response.status}): ${new URL(url).host}`);
  writeFileSync(file, Buffer.from(await response.arrayBuffer()));
}

const [command, id, name] = process.argv.slice(2);
if (command === 'make' && id && id in RECIPES) {
  const { result: image } = await call('text-to-image', { ...IMAGE, prompt: `${RECIPES[id].subject}. ${STYLE}` });
  console.log('plaatje', image);
  const { image_urls: [url] } = await wait(`text-to-image/${image}`);
  const { result: model } = await call('image-to-3d', { ...MODEL, image_url: url });
  console.log('model', model, '(zet deze id in RECIPES en haal hem op met fetch)');
} else if (command === 'status' && id) {
  const { status, progress, task_error: error } = await call(`image-to-3d/${id}`);
  console.log(status, progress, error?.message ?? '');
} else if (command === 'fetch' && id && name) {
  const result = await call(`image-to-3d/${id}`);
  if (result.status !== 'SUCCEEDED') throw new Error(`Taak is nog niet klaar: ${result.status}`);
  const dir = join(process.cwd(), 'public', 'models');
  mkdirSync(dir, { recursive: true });
  const raw = join(dir, `${name}.raw.glb`);
  await download(result.model_urls.glb, raw);
  const run = (...args) => execFileSync('npx', ['-y', '@gltf-transform/cli@4', ...args], { stdio: 'inherit' });
  run('optimize', raw, join(dir, `${name}.glb`), '--compress', 'quantize', '--texture-compress', 'webp', '--texture-size', '1024');
  execFileSync('rm', [raw]);
  console.log(`Klaar: public/models/${name}.glb. Maak ook een nieuw ${name}.webp (zie boven).`);
} else {
  console.log(`Gebruik: node scripts/meshy.mjs make <${Object.keys(RECIPES).join('|')}> | status <taakId> | fetch <taakId> <naam>`);
  process.exitCode = 1;
}
