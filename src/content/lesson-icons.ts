import { thingIcon } from './things';

/**
 * Plaatjes-iconen per les, in dezelfde glanzende speelgoedstijl als de 3D-voorwerpen (gemaakt met
 * Meshy, zie `scripts/meshy-iconen.mjs`). Een les zonder plaatje houdt zijn tekstteken (`icon`).
 * Twee lessen gebruiken het icoon van een bestaand voorwerp, omdat dat precies hun onderwerp is.
 */
const MADE = [
  'd0',
  'd1',
  'd2',
  'd3',
  'd4',
  'd5',
  'd6',
  'd7',
  'd8',
  'd9',
  'd11',
  'd12',
  'd13',
  'd14',
  'd15',
  'd16',
  'd17',
  'd18',
  'd19',
  'd21',
  'd22',
  'd23',
  'd24',
  'w1',
  'w2',
  'w3',
  'w4',
  'w5',
  'w6',
  'w7',
  'w8',
  'w9',
  'w10',
  'w11',
  'w12',
  'w13',
  'w14',
  'w15',
  'w16',
  'w18',
  'w19',
  'w20',
  'w21',
  'w22',
  'w23',
  'w24',
  'w25',
  'w26',
] as const;

const FROM_THINGS: Readonly<Record<string, string>> = {
  d10: thingIcon('pannenkoek'),
  w17: thingIcon('pinguin'),
};

export const LESSON_ICONS: Readonly<Record<string, string>> = {
  ...Object.fromEntries(MADE.map((id) => [id, `/iconen/lessen/${id}.webp`])),
  ...FROM_THINGS,
};

export const lessonIcon = (lessonId: string): string | undefined => LESSON_ICONS[lessonId];
