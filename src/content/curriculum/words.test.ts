// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { writeStatus } from '@/engine/words';
import { StepSchema } from '../schema';
import { WORD_UPGRADES } from './words';

describe('toepassing in alle woordlessen', () => {
  it('biedt voor alle 26 lessen geldige interactieve stappen met unieke, stabiele ids', () => {
    expect(Object.keys(WORD_UPGRADES).sort()).toEqual(Array.from({ length: 26 }, (_, i) => `w${i + 1}`).sort());
    for (const [lessonId, upgrade] of Object.entries(WORD_UPGRADES)) {
      const ids = upgrade.steps.map((step) => step.id);
      expect(new Set(ids).size, lessonId).toBe(ids.length);
      for (const step of upgrade.steps) {
        expect(step.id, lessonId).toMatch(/^(toepassen|transfer)-w\d+-/);
        expect(StepSchema.safeParse(step).success, `${lessonId}/${step.id}`).toBe(true);
      }
    }
  });

  it('laat de eigen voorbeeldteksten daadwerkelijk voldoen aan de schrijfvoorwaarden', () => {
    for (const upgrade of Object.values(WORD_UPGRADES)) {
      for (const input of upgrade.steps) {
        const step = StepSchema.parse(input);
        if (step.kind !== 'use') continue;
        expect(step.models.length, step.id).toBeGreaterThan(0);
        for (const model of step.models) expect(writeStatus(step, model).ready, `${step.id}: ${model}`).toBe(true);
      }
    }
  });

  it('richt de correctie op het verkeerde werkwoord en laat een correcte ik-vorm staan', () => {
    const step = WORD_UPGRADES.w1!.steps.find((item) => item.id === 'transfer-w1-redactie');
    expect(step?.kind).toBe('fix');
    if (step?.kind !== 'fix') return;
    expect(step.sentence.split(' ')[step.wrong]).toBe('noteerd');
    expect(step.answer).toBe('noteert');
  });
});
