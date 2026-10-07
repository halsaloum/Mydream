#!/usr/bin/env node
/**
 * De les-iconen van pennig, gemaakt met Meshy (text-to-image) in dezelfde stijl van glanzend speelgoed
 * als de 3D-voorwerpen (zie scripts/meshy-dingen.mjs). Elk icoon is een voorwerp dat het onderwerp van
 * de les laat zien, zonder letters.
 *
 *   node scripts/meshy-iconen.mjs plaatje <les-id…>   maak het plaatje (alle lessen: --alle)
 *   node scripts/meshy-iconen.mjs ophalen <les-id…>   haal het op als 256 px WebP zonder achtergrond
 *   node scripts/meshy-iconen.mjs stand               welke taken er zijn
 *
 * Zet NODE_USE_ENV_PROXY=1, dan gebruikt fetch HTTPS_PROXY. De sleutel staat in MESHY_API_KEY of
 * wordt door de proxy van de ontwikkelomgeving toegevoegd; nooit in de repo.
 * Een les die een bestaand 3D-voorwerp als icoon gebruikt, staat in src/content/lesson-icons.ts.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const STYLE =
  '3D icon in a playful glossy toy style: soft rounded chunky shapes, smooth clean surfaces with a subtle glossy sheen, saturated but soft colors, soft studio lighting, centered, three-quarter view from slightly above, the whole object fully visible, isolated on a plain white background, no text, no letters, no numbers, no logo';

/** Per les: het voorwerp op het icoon. Lessen die nog niet in de app staan, hebben hun icoon al. */
export const ICONEN = {
  // Het betekenisvolle woorddeel
  d0: 'a pair of orange-handled scissors cutting a short ribbon in two',
  d1: 'a short tree stump with roots and one fresh green sprout growing from its side',
  d2: 'two toy building bricks, one red and one blue, clicking together',
  d3: 'a small wooden ship steering wheel with rounded handles',
  d4: 'a very small cute baby teacup on a tiny saucer',
  d5: 'a single jigsaw puzzle piece, glossy teal',
  d6: 'a bendy drinking straw bent at the neck, red and white stripes',
  d7: 'a golden royal crown with rounded points and a few colored gems',
  d8: 'a small toy tree with a clearly visible trunk splitting into two branches that each split into two again, round green leaf clusters at the ends',
  d9: 'a toy train with a locomotive and three linked colorful wagons in a row',
  d11: 'a single golden key with a rounded bow',
  d12: 'a winners podium with three steps in gold, silver and bronze colors, no numbers',
  d13: 'a small toy machine made of three interlocking colorful gears',
  d14: 'a black graduation cap with a golden tassel',
  d15: 'a small toy factory building with a chimney puffing round white clouds',
  d16: 'a wooden ruler lying flat with tick marks only, no numbers',
  d17: 'a small wooden card index box full of colorful index cards',
  d18: 'a colorful butterfly sitting next to its empty cocoon on a twig',
  d19: 'a kitchen blender with colorful fruit pieces inside',
  d21: 'a magic wand with a star tip and a few sparkles',
  d22: 'a white chef baker hat with a wooden rolling pin in front of it',
  d23: 'a single shiny metal paperclip, slightly blue',
  d24: 'a toy delivery truck with a big cargo box, rounded cab',
  // Het woord
  w1: 'a silver stopwatch with a button on top',
  w2: 'a brown luggage tag hanging from a short string, blank',
  w3: 'a toy shape sorter box with a colorful circle, square and triangle block on top',
  w4: 'two apples side by side that look almost the same, one red and one green',
  w5: 'a black top hat with a ribbon band',
  w6: 'a round hand mirror with a pink frame and handle',
  w7: 'an empty white speech bubble with a soft outline, puffy',
  w8: 'a brown detective deerstalker hat',
  w9: 'a cute green chameleon on a short branch, curled tail',
  w10: 'a blue dumbbell with round weights',
  w11: 'a golden balance scale with two pans',
  w12: 'a crystal ball on a small golden stand, glowing softly purple',
  w13: 'a round spider web with a small cute spider in it',
  w14: 'a red pocket knife with several tools folded out',
  w15: 'a ball-and-stick molecule model with one central ball and three bonded balls',
  w16: 'a wooden signpost with two arrow signs pointing in different directions, blank signs',
  w18: 'a red horseshoe magnet with silver tips',
  w19: 'a bar chart made of colorful toy blocks, bars getting steeply lower from left to right',
  w20: 'a red and white striped road barrier gate',
  w21: 'a vintage suitcase covered in colorful travel stickers without text',
  w22: 'a cute pink brain',
  w23: 'a magnifying glass with a red handle',
  w24: 'a wooden boomerang',
  w25: 'a red map location pin',
  w26: 'an hourglass with golden sand and wooden frame',
};

const LOG = join(process.cwd(), 'scripts', 'meshy-iconen.json');
const OUT = join(process.cwd(), 'public', 'iconen', 'lessen');
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

async function image(id) {
  const { result } = await api('/text-to-image', { ai_model: 'nano-banana-pro', prompt: `${ICONEN[id]}. ${STYLE}`, aspect_ratio: '1:1' });
  const data = log();
  data[id] = result;
  save(data);
  await wait(`/text-to-image/${result}`);
  console.log(`${id}: plaatje klaar`);
}

async function fetchIcon(id) {
  const task = log()[id];
  if (!task) throw new Error(`${id}: maak eerst een plaatje`);
  const picture = await api(`/text-to-image/${task}`);
  mkdirSync(OUT, { recursive: true });
  const png = join(OUT, `${id}.raw.png`);
  const response = await fetch(picture.image_urls[0]);
  if (!response.ok) throw new Error(`Downloaden mislukt (${response.status})`);
  writeFileSync(png, Buffer.from(await response.arrayBuffer()));
  // De witte achtergrond wordt doorzichtig (vullen vanuit de hoeken), bijgesneden en gecentreerd.
  const size = execFileSync('identify', ['-format', '%w %h', png]).toString().split(' ').map(Number);
  const [w, h] = [size[0] - 1, size[1] - 1];
  const corners = ['0,0', `${w},0`, `0,${h}`, `${w},${h}`].flatMap((at) => ['-draw', `color ${at} floodfill`]);
  execFileSync('convert', [png, '-alpha', 'set', '-fuzz', '6%', '-fill', 'none', ...corners, '-trim', '+repage', '-resize', '232x232', '-background', 'none', '-gravity', 'center', '-extent', '256x256', '-quality', '85', join(OUT, `${id}.webp`)]);
  rmSync(png);
  console.log(`${id}: public/iconen/lessen/${id}.webp`);
}

const [command, ...rest] = process.argv.slice(2);
const ids = rest.includes('--alle') ? Object.keys(ICONEN) : rest;
const unknown = ids.filter((id) => !(id in ICONEN));
if (unknown.length) throw new Error(`Onbekend: ${unknown.join(', ')}`);

// Meshy geeft 429 bij te veel tegelijk: in groepjes van vier.
async function each(fn) {
  let failed = false;
  for (let i = 0; i < ids.length; i += 4) {
    const group = ids.slice(i, i + 4);
    const results = await Promise.allSettled(group.map(fn));
    results.forEach((result, j) => {
      if (result.status === 'rejected') {
        failed = true;
        console.error(`${group[j]}: ${result.reason.message}`);
      }
    });
  }
  if (failed) process.exitCode = 1;
}

if (command === 'plaatje') await each(image);
else if (command === 'ophalen') await each(fetchIcon);
else if (command === 'stand') console.log(log());
else {
  console.log('Gebruik: plaatje | ophalen <les-id…> of --alle, of stand');
  process.exitCode = 1;
}
