#!/usr/bin/env node
/**
 * De 3D-modellen van pennig, gemaakt met Meshy (https://docs.meshy.ai). Zo kun je ze opnieuw
 * maken of een nieuwe versie binnenhalen.
 *
 *   node scripts/meshy.mjs status <taakId>          stand van een Meshy-taak
 *   node scripts/meshy.mjs fetch <taakId> <naam>    GLB en voorbeeldplaatje naar public/models/<naam>.*
 *
 * Achter een proxy: zet NODE_USE_ENV_PROXY=1, dan gebruikt fetch HTTPS_PROXY.
 *
 * De sleutel staat in MESHY_API_KEY (nooit in de repo). Het model gaat daarna door gltf-transform:
 * kleinere textures (WebP, max. 1024 px) en gekwantiseerde punten (geen decoder van buiten nodig), zodat het snel laadt.
 *
 * De stippen op het model (`AT` in `src/content/packs/deel-3d.ts`) zijn plekken in meters. Meet
 * ze in de browser op de les: `document.querySelector('model-viewer').positionAndNormalFromPoint(x, y)`
 * geeft voor een punt op het scherm de plek en de richting op het model.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Hoe elk model gemaakt is: eerst de vorm (preview), dan de kleuren (refine). */
export const RECIPES = {
  fiets: {
    preview: {
      mode: 'preview',
      prompt:
        'cute stylized 3D icon of a classic Dutch city bicycle (omafiets), side view, soft rounded chunky shapes, glossy smooth plastic toy look, clearly separated parts: curved handlebar with a round bell, saddle, two pedals, chain guard, two wheels with spokes, front lamp, rear luggage carrier, kickstand, mudguards, clean simple game asset, no background',
      art_style: 'realistic',
      should_remesh: true,
      target_polycount: 30000,
      topology: 'triangle',
    },
    refine: {
      mode: 'refine',
      enable_pbr: true,
      texture_prompt:
        'playful glossy toy-like 3D icon style, smooth clean surfaces, soft studio look: mint green frame, cream white mudguards and chain guard, caramel brown leather saddle and handle grips, shiny silver handlebar and round silver bell, black rubber tyres with silver spokes, warm yellow front lamp, dark grey pedals and kickstand',
    },
    /** De taak waar `public/models/fiets.glb` van komt. */
    task: '01a10d4f-0216-72fb-b3be-6581a0bf5dbb',
  },
};

const API = 'https://api.meshy.ai/openapi/v2/text-to-3d';
const headers = process.env.MESHY_API_KEY ? { Authorization: `Bearer ${process.env.MESHY_API_KEY}` } : {};

async function task(id) {
  const response = await fetch(`${API}/${id}`, { headers });
  if (!response.ok) throw new Error(`Meshy ${response.status}: ${await response.text()}`);
  return response.json();
}

async function download(url, file) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Downloaden mislukt (${response.status}): ${new URL(url).host}`);
  writeFileSync(file, Buffer.from(await response.arrayBuffer()));
}

const [command, id, name] = process.argv.slice(2);
if (command === 'status' && id) {
  const { status, progress, task_error: error } = await task(id);
  console.log(status, progress, error?.message ?? '');
} else if (command === 'fetch' && id && name) {
  const result = await task(id);
  if (result.status !== 'SUCCEEDED') throw new Error(`Taak is nog niet klaar: ${result.status}`);
  const dir = join(process.cwd(), 'public', 'models');
  mkdirSync(dir, { recursive: true });
  const raw = join(dir, `${name}.raw.glb`);
  await download(result.model_urls.glb, raw);
  await download(result.thumbnail_url, join(dir, `${name}.png`));
  const run = (...args) => execFileSync('npx', ['-y', '@gltf-transform/cli@4', ...args], { stdio: 'inherit' });
  run('optimize', raw, join(dir, `${name}.glb`), '--compress', 'quantize', '--texture-compress', 'webp', '--texture-size', '1024');
  execFileSync('rm', [raw]);
  console.log(`Klaar: public/models/${name}.glb en ${name}.png.`);
} else {
  console.log('Gebruik: node scripts/meshy.mjs status <taakId> | fetch <taakId> <naam>');
  process.exitCode = 1;
}
