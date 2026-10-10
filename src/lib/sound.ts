import { useSettings } from '@/state/settings';

/**
 * Geluid via Web Audio: korte, zachte tonen zonder geluidsbestanden.
 * Volgt de instellingen (aan/uit en volume) en start pas na een gebruikersactie.
 */
export type Cue = 'tap' | 'select' | 'place' | 'remove' | 'right' | 'wrong' | 'win' | 'solved';

let context: AudioContext | null = null;
let master: AudioNode | null = null;

/**
 * Alle tonen gaan door één zachte keten: een filter haalt het schelle boven de 5 kHz weg,
 * een compressor houdt akkoorden (zoals bij "win") even luid als losse tonen, zonder kraak.
 */
function output(ctx: AudioContext): AudioNode {
  if (master) return master;
  try {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 5000;
    filter.Q.value = 0.5;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.ratio.value = 4;
    filter.connect(compressor).connect(ctx.destination);
    master = filter;
  } catch {
    master = ctx.destination;
  }
  return master;
}

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    context ??= new Ctor();
    if (context.state === 'suspended') void context.resume();
    return context;
  } catch {
    return null;
  }
}

function tone(ctx: AudioContext, gain: number, freq: number, start: number, length: number, type: OscillatorType = 'triangle') {
  const at = ctx.currentTime + start;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, at);
  env.gain.linearRampToValueAtTime(gain, at + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, at + length);
  env.connect(output(ctx));
  // Een zachte sinus een octaaf lager geeft de toon body, als een klokje in plaats van een piep.
  const layers: [OscillatorType, number, number][] = [
    [type, freq, 1],
    ['sine', freq / 2, 0.35],
  ];
  for (const [shape, frequency, share] of layers) {
    const osc = ctx.createOscillator();
    const level = ctx.createGain();
    osc.type = shape;
    osc.frequency.setValueAtTime(frequency, at);
    level.gain.value = share;
    osc.connect(level).connect(env);
    osc.start(at);
    osc.stop(at + length + 0.02);
  }
}

/** Kleine toonhoogtevariatie, zodat herhaalde tikken niet mechanisch klinken. */
const vary = (freq: number) => freq * (1 + (Math.random() - 0.5) * 0.04);

export function play(cue: Cue, volumeOverride?: number) {
  const { enabled, volume } = useSettings.getState().sound;
  const level = volumeOverride ?? volume;
  if ((!enabled && volumeOverride === undefined) || level <= 0) return;
  const ctx = audio();
  if (!ctx) return;
  const g = (base: number) => base * level;
  switch (cue) {
    case 'tap':
      tone(ctx, g(0.05), vary(660), 0, 0.06);
      break;
    case 'select':
      tone(ctx, g(0.06), vary(740), 0, 0.07);
      tone(ctx, g(0.04), vary(990), 0.04, 0.08);
      break;
    case 'place':
      tone(ctx, g(0.06), 587, 0, 0.07);
      tone(ctx, g(0.06), 880, 0.05, 0.1);
      break;
    case 'remove':
      tone(ctx, g(0.05), 698, 0, 0.07);
      tone(ctx, g(0.05), 466, 0.05, 0.1);
      break;
    case 'right':
      tone(ctx, g(0.12), 784, 0, 0.12);
      tone(ctx, g(0.12), 1175, 0.09, 0.24);
      break;
    case 'solved':
      tone(ctx, g(0.09), 659, 0, 0.1);
      tone(ctx, g(0.09), 988, 0.08, 0.2);
      break;
    case 'wrong':
      tone(ctx, g(0.08), 262, 0, 0.16, 'sine');
      tone(ctx, g(0.07), 208, 0.12, 0.26, 'sine');
      break;
    case 'win':
      [523, 659, 784, 1047].forEach((freq, i) => tone(ctx, g(0.1), freq, i * 0.11, 0.34));
      break;
  }
}
