import type { LessonInput, StepInput } from '../../schema';
import { ONDERZOEK_D5 } from './d5';
import { ONDERZOEK_D6 } from './d6';
import { ONDERZOEK_D7 } from './d7';
import { ONDERZOEK_D8 } from './d8';
import { ONDERZOEK_D9 } from './d9';
import { ONDERZOEK_D10 } from './d10';
import { ONDERZOEK_D11 } from './d11';
import { ONDERZOEK_D12 } from './d12';
import { ONDERZOEK_D13 } from './d13';
import { ONDERZOEK_D14 } from './d14';
import { ONDERZOEK_D15 } from './d15';
import { ONDERZOEK_D16 } from './d16';
import { ONDERZOEK_D17 } from './d17';
import { ONDERZOEK_D18 } from './d18';
import { ONDERZOEK_D19 } from './d19';
import { ONDERZOEK_W7 } from './w7';
import { ONDERZOEK_W8 } from './w8';
import { ONDERZOEK_W9 } from './w9';
import { ONDERZOEK_W10 } from './w10';
import { ONDERZOEK_W11 } from './w11';
import { ONDERZOEK_W12 } from './w12';
import { ONDERZOEK_W13 } from './w13';
import { ONDERZOEK_W14 } from './w14';
import { ONDERZOEK_W15 } from './w15';
import { ONDERZOEK_W16 } from './w16';
import { ONDERZOEK_W17 } from './w17';
import { ONDERZOEK_W18 } from './w18';
import { ONDERZOEK_W19 } from './w19';
import { ONDERZOEK_W20 } from './w20';
import { ONDERZOEK_W21 } from './w21';
import { ONDERZOEK_W22 } from './w22';

/**
 * De onderzoeksronde per les: een derde uitleg (id `onderzoek`) op het niveau van een
 * werkcollege, gevolgd door zwaardere oefeningen. Ze komt achter de bestaande stappen, zodat
 * de ids van eerdere stappen en dus de voortgang blijven kloppen.
 */
export const ONDERZOEK: Readonly<Record<string, readonly StepInput[]>> = {
  d5: ONDERZOEK_D5,
  d6: ONDERZOEK_D6,
  d7: ONDERZOEK_D7,
  d8: ONDERZOEK_D8,
  d9: ONDERZOEK_D9,
  d10: ONDERZOEK_D10,
  d11: ONDERZOEK_D11,
  d12: ONDERZOEK_D12,
  d13: ONDERZOEK_D13,
  d14: ONDERZOEK_D14,
  d15: ONDERZOEK_D15,
  d16: ONDERZOEK_D16,
  d17: ONDERZOEK_D17,
  d18: ONDERZOEK_D18,
  d19: ONDERZOEK_D19,
  w7: ONDERZOEK_W7,
  w8: ONDERZOEK_W8,
  w9: ONDERZOEK_W9,
  w10: ONDERZOEK_W10,
  w11: ONDERZOEK_W11,
  w12: ONDERZOEK_W12,
  w13: ONDERZOEK_W13,
  w14: ONDERZOEK_W14,
  w15: ONDERZOEK_W15,
  w16: ONDERZOEK_W16,
  w17: ONDERZOEK_W17,
  w18: ONDERZOEK_W18,
  w19: ONDERZOEK_W19,
  w20: ONDERZOEK_W20,
  w21: ONDERZOEK_W21,
  w22: ONDERZOEK_W22,
};

/** Zet de onderzoeksronde achter elke les die er een heeft. */
export function withResearch(lessons: readonly LessonInput[], research: Readonly<Record<string, readonly StepInput[]>> = ONDERZOEK): LessonInput[] {
  return lessons.map((lesson) => {
    const extra = research[lesson.id];
    return extra && extra.length > 0 ? { ...lesson, steps: [...lesson.steps, ...extra] } : lesson;
  });
}
