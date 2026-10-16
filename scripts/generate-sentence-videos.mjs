#!/usr/bin/env node
/**
 * Render the twelve authored walkthroughs as real local, silent instructional videos.
 * Run: node scripts/generate-sentence-videos.mjs [--only zinnen-01,zinnen-02]
 * Requires the existing Playwright/TypeScript dev dependencies, Chromium and ffmpeg.
 * No fonts, stock footage, audio or other network resources are downloaded.
 */
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import { chromium } from 'playwright';

const project = fileURLToPath(new URL('../', import.meta.url));
const output = join(project, 'public/videos/zinnen');
const sources = ['foundation', 'structure', 'composition'].map((group) => join(project, `src/content/sentences/teaching-${group}.ts`));
const width = 1280;
const height = 720;
const fps = 12;
const durations = [6, 12, 12, 12, 12, 5];
const totalSeconds = durations.reduce((sum, duration) => sum + duration, 0);
const onlyIndex = process.argv.indexOf('--only');
const requested = onlyIndex === -1 ? null : new Set((process.argv[onlyIndex + 1] ?? '').split(',').filter(Boolean));
if (requested && (!requested.size || [...requested].some((id) => !/^zinnen-(?:0[1-9]|1[0-2])$/.test(id)))) throw new Error('--only expects lesson IDs zinnen-01 through zinnen-12.');

function html(text) {
  return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function matches(sentence, focus) {
  const lower = sentence.toLocaleLowerCase('nl-NL');
  const target = focus.toLocaleLowerCase('nl-NL');
  const found = [];
  let offset = 0;
  while (target && offset <= lower.length) {
    const start = lower.indexOf(target, offset);
    if (start === -1) break;
    found.push({ start, end: start + target.length });
    offset = start + target.length;
  }
  return found;
}

function highlighted(sentence, focus) {
  const ranges = focus.flatMap((part) => matches(sentence, part)).sort((a, b) => a.start - b.start || b.end - a.end);
  let cursor = 0;
  let rendered = '';
  for (const range of ranges) {
    if (range.start < cursor) continue;
    rendered += html(sentence.slice(cursor, range.start));
    rendered += `<mark>${html(sentence.slice(range.start, range.end))}</mark>`;
    cursor = range.end;
  }
  return rendered + html(sentence.slice(cursor));
}

async function loadTeaching() {
  const all = [];
  const hashes = [];
  for (const source of sources) {
    const input = await readFile(source, 'utf8');
    hashes.push(createHash('sha256').update(input).digest('hex'));
    const compiled = ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: false } }).outputText;
    const compiledModule = { exports: {} };
    vm.runInNewContext(compiled, { module: compiledModule, exports: compiledModule.exports }, { filename: source, timeout: 5000 });
    for (const value of Object.values(compiledModule.exports)) {
      if (Array.isArray(value) && value.every((entry) => entry?.lessonId && entry?.walkthrough)) all.push(...value);
    }
  }
  all.sort((a, b) => a.lessonId.localeCompare(b.lessonId));
  if (all.length !== 12 || new Set(all.map((entry) => entry.lessonId)).size !== 12) throw new Error('The three teaching exports must contain twelve unique sentence modules.');
  for (const [index, entry] of all.entries()) {
    if (entry.lessonId !== `zinnen-${String(index + 1).padStart(2, '0')}`) throw new Error(`Unexpected module ID: ${entry.lessonId}`);
    if (entry.walkthrough.steps.length !== 4) throw new Error(`${entry.lessonId} needs exactly four worked steps.`);
    for (const [stepIndex, step] of entry.walkthrough.steps.entries()) {
      if (!step.title?.trim() || !step.explanation?.trim() || !step.sentence?.trim() || !step.focus.length) throw new Error(`${entry.lessonId}, step ${stepIndex + 1}: incomplete teaching data.`);
      for (const focus of step.focus) {
        if (!focus.trim() || !matches(step.sentence, focus).length) throw new Error(`${entry.lessonId}, step ${stepIndex + 1}: focus “${focus}” is absent from the sentence.`);
      }
    }
  }
  return { entries: requested ? all.filter((entry) => requested.has(entry.lessonId)) : all, sourceHash: createHash('sha256').update(hashes.join(':')).digest('hex') };
}

function progressDiagram(stepIndex) {
  const circles = [0, 1, 2, 3].map((index) => {
    const x = 390 + index * 145;
    const active = index === stepIndex;
    const finished = index < stepIndex;
    return `${index < 3 ? `<path d="M${x + 25} 31H${x + 120}" stroke="${finished ? '#147dac' : '#d8e2e7'}" stroke-width="7" stroke-linecap="round"/><path d="m${x + 112} 24 9 7-9 7" fill="none" stroke="${finished ? '#147dac' : '#d8e2e7'}" stroke-width="4"/>` : ''}<circle cx="${x}" cy="31" r="${active ? 27 : 23}" fill="${active ? '#147dac' : finished ? '#d7eef7' : '#f1f4f5'}" stroke="${active ? '#095574' : '#d8e2e7'}" stroke-width="3"/><text x="${x}" y="40" text-anchor="middle" font-size="26" font-weight="800" fill="${active ? '#fff' : '#335665'}">${index + 1}</text>`;
  }).join('');
  return `<svg viewBox="0 0 900 64" aria-label="Vier denkstappen" class="process">${circles}</svg>`;
}

/** Brief scene setting; the complete context/result stays in the written lesson transcript. */
function firstSentence(text) {
  return text.match(/^.*?[.!?](?:\s|$)/u)?.[0].trim() ?? text;
}

function frame(entry, slide) {
  const { walkthrough } = entry;
  const number = Number(entry.lessonId.split('-')[1]);
  const intro = slide === 0;
  const end = slide === 5;
  const step = !intro && !end ? walkthrough.steps[slide - 1] : null;
  const title = intro ? walkthrough.title : end ? 'Kijk wat er nu klopt' : step.title;
  const sentence = intro ? walkthrough.startSentence : end ? walkthrough.steps.at(-1).sentence : step.sentence;
  const explanation = intro ? firstSentence(walkthrough.situation) : end ? firstSentence(walkthrough.result) : step.explanation;
  const focus = intro ? [] : end ? walkthrough.steps.at(-1).focus : step.focus;
  const label = intro ? 'Eén voorbeeld, vier denkstappen' : end ? 'Van voorbeeld naar zelf toepassen' : `Denkstap ${slide} van 4`;
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}
    body{font-family:Arial,"DejaVu Sans",sans-serif;color:#20333f;background:#f7f6f0}
    .frame{position:relative;width:100%;height:100%;padding:36px 60px 42px;background:radial-gradient(ellipse at 95% 0%,#ddf1f7 0,transparent 47%),#f7f6f0}
    header{height:63px;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
    .brand{display:flex;align-items:center;gap:13px;font-size:29px;font-weight:800;color:#096282;white-space:nowrap}
    .brand svg{width:35px;height:45px}.process{width:670px;height:61px;overflow:visible}
    .kicker{font-size:22px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#147dac;margin:0 0 12px}
    h1{margin:0;font-size:49px;line-height:1.12;font-weight:800;height:112px;max-width:1130px}
    .sentence{display:flex;align-items:center;justify-content:center;height:207px;margin:15px 0 20px;padding:24px 36px;background:#fff;border:3px solid #dce5e8;border-radius:30px;box-shadow:0 7px 0 #e2e3de}
    .sentence p{margin:0;font-family:Georgia,"DejaVu Serif",serif;font-size:61px;line-height:1.22;text-align:center;max-height:153px;overflow:visible;width:100%}
    mark{background:#ffdc73;color:#3a310d;padding:2px 5px;border-radius:8px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
    .explanation{margin:0;max-height:150px;overflow:visible;font-size:32px;line-height:1.36;color:#334b59}
    footer{position:absolute;bottom:20px;left:60px;right:60px;display:flex;align-items:center;justify-content:space-between;font-size:19px;color:#527080}
    .footer-note{display:flex;align-items:center;gap:9px}.footer-note svg{height:21px;width:21px}.corner{font-weight:700;color:#096282}
    .accent-line{position:absolute;left:60px;right:60px;bottom:54px;height:5px;border-radius:8px;background:#dce7e8;overflow:hidden}
    .accent-line span{display:block;height:100%;background:#147dac;width:${Math.round(slide / 5 * 100)}%}
  </style></head><body><article class="frame"><header><div class="brand"><svg viewBox="0 0 36 48" aria-hidden="true"><path d="M11 3h14v31l-7 10-7-10Z" fill="#ffdc73" stroke="#20333f" stroke-width="3"/><path d="M11 9h14V3H11Z" fill="#ee6b55"/><path d="m15 38 3 6 3-6" fill="#20333f"/></svg>Zinnen · module ${number}</div>${progressDiagram(intro ? -1 : end ? 4 : slide - 1)}</header><p class="kicker">${html(label)}</p><h1 data-fit>${html(title)}</h1><section class="sentence" aria-label="De voorbeeldzin"><p data-fit>${highlighted(sentence, focus)}</p></section><p class="explanation" data-fit>${html(explanation)}</p><div class="accent-line" aria-hidden="true"><span></span></div><footer><span class="footer-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m17 9 5 6m0-6-5 6" stroke="currentColor" stroke-width="2"/></svg>Uitleg in beeld · zonder geluid</span><span class="corner">Pauzeer gerust om rustig te lezen</span></footer></article></body></html>`;
}

function command(binary, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { cwd: project, stdio: ['ignore', 'pipe', 'pipe'] });
    let outputText = '';
    child.stdout.on('data', (data) => { outputText += data; });
    child.stderr.on('data', (data) => { outputText += data; });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve(outputText) : reject(new Error(`${binary} exited ${code}: ${outputText.slice(-5000)}`)));
  });
}

function cueTime(seconds) {
  const milliseconds = Math.round(seconds * 1000);
  return `${String(Math.floor(milliseconds / 3600000)).padStart(2, '0')}:${String(Math.floor(milliseconds / 60000) % 60).padStart(2, '0')}:${String(Math.floor(milliseconds / 1000) % 60).padStart(2, '0')}.${String(milliseconds % 1000).padStart(3, '0')}`;
}

function captionChunks(text) {
  const chunks = [];
  let current = '';
  for (const word of text.replace(/\s+/g, ' ').trim().split(' ')) {
    if (current && current.length + word.length + 1 > 96) { chunks.push(current); current = ''; }
    current += `${current ? ' ' : ''}${word}`;
  }
  if (current) chunks.push(current);
  return chunks;
}

/** WebVTT recognises &amp;, &lt; and &gt;; quotes remain ordinary caption text. */
function captionText(text) {
  return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function captions(entry) {
  const { walkthrough } = entry;
  const texts = [`${walkthrough.title}. ${firstSentence(walkthrough.situation)} Voorbeeld: ${walkthrough.startSentence}`, ...walkthrough.steps.map((step, index) => `Stap ${index + 1}: ${step.title}. ${step.explanation}`), `Resultaat: ${firstSentence(walkthrough.result)}`];
  let at = 0;
  let sequence = 1;
  let result = 'WEBVTT\n\nNOTE Stille lesvideo met uitleg in beeld. Deze tekst volgt alle vier denkstappen.\n\n';
  for (const [index, text] of texts.entries()) {
    const chunks = captionChunks(text);
    const length = durations[index];
    for (const [chunkIndex, chunk] of chunks.entries()) {
      result += `${sequence++}\n${cueTime(at + length * chunkIndex / chunks.length)} --> ${cueTime(at + length * (chunkIndex + 1) / chunks.length)}\n${captionText(chunk)}\n\n`;
    }
    at += length;
  }
  return result;
}

async function renderVideo(browser, entry, directory, sourceHash) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.route('http://**/*', (route) => route.abort());
  await page.route('https://**/*', (route) => route.abort());
  const images = [];
  const fitted = [];
  try {
    for (let slide = 0; slide < durations.length; slide++) {
      await page.setContent(frame(entry, slide), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const sizes = await page.evaluate(() => [...document.querySelectorAll('[data-fit]')].map((element) => {
        const maximum = element.parentElement.classList.contains('sentence') ? 153 : element.tagName === 'H1' ? 112 : 150;
        const minimum = element.tagName === 'H1' ? 36 : element.parentElement.classList.contains('sentence') ? 40 : 25;
        let size = parseFloat(getComputedStyle(element).fontSize);
        while ((element.scrollHeight > maximum + 1 || element.scrollWidth > element.clientWidth + 1) && size > minimum) {
          size--;
          element.style.fontSize = `${size}px`;
        }
        return { tag: element.tagName, size, height: element.scrollHeight, maximum, width: element.scrollWidth, available: element.clientWidth, valid: element.scrollHeight <= maximum + 1 && element.scrollWidth <= element.clientWidth + 1 };
      }));
      if (sizes.some((item) => !item.valid)) throw new Error(`${entry.lessonId}, slide ${slide}: authored text does not fit at a readable font size: ${JSON.stringify(sizes)}`);
      fitted.push(sizes);
      const image = join(directory, `${entry.lessonId}-${slide}.png`);
      await page.screenshot({ path: image });
      images.push(image);
      if (slide === 1) await page.screenshot({ path: join(output, `${entry.lessonId}.jpg`), type: 'jpeg', quality: 87 });
    }
  } finally { await page.close(); }

  // Each scene stays readable. Short fades provide an encoded scene transition,
  // rather than relying on a web animation or pretending a static poster is a video.
  const args = ['-y', '-hide_banner', '-loglevel', 'error'];
  for (const [index, image] of images.entries()) args.push('-loop', '1', '-framerate', String(fps), '-t', String(durations[index]), '-i', image);
  const filters = durations.map((duration, index) => `[${index}:v]fps=${fps},format=yuv420p,fade=t=in:st=0:d=0.25,fade=t=out:st=${duration - 0.25}:d=0.25,setpts=PTS-STARTPTS[v${index}]`);
  filters.push(`${durations.map((_, index) => `[v${index}]`).join('')}concat=n=${durations.length}:v=1:a=0,tpad=stop_mode=clone:stop_duration=${1 / fps}[video]`);
  const video = join(output, `${entry.lessonId}.mp4`);
  args.push('-filter_complex_threads', '1', '-filter_complex', filters.join(';'), '-map', '[video]', '-t', String(totalSeconds), '-an', '-c:v', 'libx264', '-preset', 'medium', '-tune', 'stillimage', '-crf', '25', '-threads', '2', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-metadata', `title=${entry.walkthrough.title}`, '-metadata', 'comment=Stille Nederlandse lesvideo: uitleg en vier denkstappen in beeld.', video);
  await command('ffmpeg', args);
  await writeFile(join(output, `${entry.lessonId}.vtt`), captions(entry));
  const probe = JSON.parse(await command('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size:stream=codec_name,codec_type,width,height,pix_fmt,r_frame_rate', '-of', 'json', video]));
  const stream = probe.streams.find((item) => item.codec_type === 'video');
  if (stream?.codec_name !== 'h264' || stream.pix_fmt !== 'yuv420p' || stream.width !== width || stream.height !== height || Math.abs(Number(probe.format.duration) - totalSeconds) > 0.1 || probe.streams.some((item) => item.codec_type === 'audio')) throw new Error(`${entry.lessonId}: incompatible output: ${JSON.stringify(probe)}`);
  // Decode the actual encoded stream, including its last frame.
  await command('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', video, '-f', 'null', '-']);
  const bytes = (await stat(video)).size;
  console.log(`${entry.lessonId}: ${probe.format.duration}s · ${(bytes / 1024).toFixed(0)} KiB · readable fonts ${Math.min(...fitted.flat().map((item) => item.size))}–${Math.max(...fitted.flat().map((item) => item.size))}px`);
  return { lessonId: entry.lessonId, title: entry.walkthrough.title, src: `/videos/zinnen/${entry.lessonId}.mp4`, poster: `/videos/zinnen/${entry.lessonId}.jpg`, captions: `/videos/zinnen/${entry.lessonId}.vtt`, durationSeconds: Number(probe.format.duration), silent: true, width, height, fps, bytes, sourceHash, fittedFonts: fitted, steps: 4 };
}

const { entries, sourceHash } = await loadTeaching();
await mkdir(output, { recursive: true });
const temporary = await mkdtemp(join(tmpdir(), 'mydream-zinnen-videos-'));
const browser = await chromium.launch({ executablePath: process.env.SENTENCE_VIDEO_CHROMIUM ?? '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
try {
  const generated = [];
  // Encode at most two independent clips at a time to keep memory/CPU bounded.
  for (let index = 0; index < entries.length; index += 2) {
    generated.push(...await Promise.all(entries.slice(index, index + 2).map((entry) => renderVideo(browser, entry, temporary, sourceHash))));
  }
  let previous = [];
  if (requested) {
    try { previous = JSON.parse(await readFile(join(output, 'manifest.json'), 'utf8')).videos.filter((video) => !requested.has(video.lessonId)); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const videos = [...previous, ...generated].sort((a, b) => a.lessonId.localeCompare(b.lessonId));
  const totalBytes = videos.reduce((sum, video) => sum + video.bytes, 0);
  await writeFile(join(output, 'manifest.json'), JSON.stringify({ format: 1, description: 'Twaalf lokale, stille lesvideo’s met Nederlandse uitleg in beeld en ondertitels.', generatedBy: 'scripts/generate-sentence-videos.mjs', videos, totalBytes }, null, 2));
  console.log(`Ready: ${videos.length} clips · ${(totalBytes / 1024 / 1024).toFixed(2)} MiB total.`);
} finally {
  await browser.close();
  await rm(temporary, { recursive: true, force: true });
}
