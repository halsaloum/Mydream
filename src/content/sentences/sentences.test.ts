import { describe, expect, it } from 'vitest';
import { emptySentenceAnswer, gradeSentence, normalizeRepair } from '@/lib/sentences/learning';
import { sentenceLessons, sentenceSources } from './index';
import type { SentenceAnswer, SentenceExercise, SentenceToken } from './types';

function unique(ids: string[], context: string) {
  expect(new Set(ids).size, context).toBe(ids.length);
  expect(ids.every((id) => id.trim().length > 0), context).toBe(true);
}

function tokenReferences(tokens: SentenceToken[], references: string[], context: string) {
  unique(tokens.map((token) => token.id), `${context}: token IDs`);
  unique(references, `${context}: geselecteerde token IDs`);
  expect(tokens.every((token) => token.text.trim().length > 0), context).toBe(true);
  expect(references.every((id) => tokens.some((token) => token.id === id)), `${context}: verwijzing buiten de tokenreeks`).toBe(true);
}

function correctAnswer(exercise: SentenceExercise): SentenceAnswer {
  const answer = emptySentenceAnswer();
  if (exercise.support === 'half') {
    answer.boundaries = [...exercise.segmentation!.boundaries];
    answer.segmentationPassed = true;
  }
  if (exercise.kind === 'slots') answer.placements = exercise.accept[0]!;
  if (exercise.kind === 'gate') {
    answer.selected = [...exercise.diagnosis.targets];
    answer.diagnosisPassed = true;
    answer.choice = exercise.answer;
  }
  if (exercise.kind === 'tether') answer.links = exercise.links;
  if (exercise.kind === 'mutate') {
    answer.variant = exercise.target;
    answer.order = exercise.variants.find((variant) => variant.id === exercise.target)!.order;
  }
  if (exercise.kind === 'debug') {
    answer.selected = [...exercise.targets];
    answer.diagnosisPassed = true;
    answer.text = exercise.repairs[0]!;
  }
  return answer;
}

describe('Zinnen: samenhang van de twaalf lessen en hun bronnen', () => {
  it('biedt twaalf opeenvolgende lessen en 120 oefeningen met stabiele unieke sleutels', () => {
    expect(sentenceLessons.map((lesson) => lesson.number)).toEqual(Array.from({ length: 12 }, (_, index) => index + 1));
    unique(sentenceLessons.map((lesson) => lesson.id), 'lessen');
    unique(sentenceLessons.flatMap((lesson) => lesson.rules.map((rule) => rule.id)), 'regels');
    const exercises = sentenceLessons.flatMap((lesson) => [...lesson.arena, ...lesson.debugger]);
    expect(exercises).toHaveLength(120);
    unique(exercises.map((exercise) => exercise.id), 'oefeningen');
    expect(new Set(exercises.map((exercise) => exercise.kind))).toEqual(new Set(['slots', 'gate', 'tether', 'mutate', 'debug']));
  });

  it('gebruikt bestaande bron IDs en echte HTTPS-verwijzingen met secties', () => {
    unique(sentenceSources.map((source) => source.id), 'bronnen');
    for (const source of sentenceSources) {
      expect(new URL(source.url).protocol, source.id).toBe('https:');
      expect(source.title.trim(), source.id).not.toBe('');
      expect(source.section.trim(), source.id).not.toBe('');
    }
    for (const lesson of sentenceLessons) {
      for (const rule of lesson.rules) {
        expect(rule.sourceIds.length, rule.id).toBeGreaterThan(0);
        unique(rule.sourceIds, rule.id);
        expect(rule.sourceIds.every((id) => sentenceSources.some((source) => source.id === id)), rule.id).toBe(true);
        expect([rule.when, rule.then, rule.nuance].every((text) => text.trim().length > 0), rule.id).toBe(true);
      }
    }
  });
});

for (const lesson of sentenceLessons) {
  describe(`${lesson.id}: ${lesson.title}`, () => {
    const exercises = [...lesson.arena, ...lesson.debugger];

    it('bouwt steun af van drie volledige via drie halve naar vier zelfstandige oefeningen', () => {
      expect(lesson.arena).toHaveLength(6);
      expect(lesson.debugger).toHaveLength(4);
      expect(lesson.arena.map((exercise) => exercise.support)).toEqual(['volledig', 'volledig', 'volledig', 'half', 'half', 'half']);
      expect(lesson.debugger.every((exercise) => exercise.kind === 'debug' && exercise.support === 'zelfstandig')).toBe(true);
      unique(lesson.discovery.variants.map((variant) => variant.id), `${lesson.id}: ontdekkingen`);
      expect(lesson.discovery.variants.length).toBeGreaterThanOrEqual(2);
      expect(lesson.summary.transfer.trim()).not.toBe('');
      for (const exercise of exercises) {
        expect(lesson.rules.some((rule) => rule.id === exercise.ruleId), exercise.id).toBe(true);
        expect([exercise.prompt, exercise.hint, exercise.explanation].every((text) => text.trim().length > 0), exercise.id).toBe(true);
        if (exercise.support === 'half') {
          expect(exercise.segmentation, exercise.id).toBeDefined();
          const segmentation = exercise.segmentation!;
          unique(segmentation.tokens.map((token) => token.id), `${exercise.id}: segmentatietokens`);
          expect(segmentation.boundaries.length, exercise.id).toBeGreaterThan(0);
          expect(new Set(segmentation.boundaries).size, exercise.id).toBe(segmentation.boundaries.length);
          expect(segmentation.boundaries.every((boundary) => Number.isInteger(boundary) && boundary > 0 && boundary < segmentation.tokens.length), exercise.id).toBe(true);
        }
      }
    });

    it('verbindt diagnoses en lijnen met bestaande woorden, zonder dubbele of ontbrekende doelen', () => {
      for (const exercise of exercises) {
        if (exercise.kind === 'gate') {
          expect(exercise.diagnosis.targets.length, exercise.id).toBeGreaterThan(0);
          tokenReferences(exercise.diagnosis.tokens, exercise.diagnosis.targets, exercise.id);
          unique(exercise.options.map((option) => option.id), exercise.id);
          expect(exercise.options.length, exercise.id).toBeGreaterThanOrEqual(2);
          expect(exercise.options.filter((option) => option.id === exercise.answer), exercise.id).toHaveLength(1);
        }
        if (exercise.kind === 'debug') {
          expect(exercise.targets.length, exercise.id).toBeGreaterThan(0);
          tokenReferences(exercise.tokens, exercise.targets, exercise.id);
          expect(exercise.repairs.length, exercise.id).toBeGreaterThan(0);
          unique(exercise.repairs.map(normalizeRepair), `${exercise.id}: herstelantwoorden`);
          expect(exercise.instruction.trim(), exercise.id).not.toBe('');
        }
        if (exercise.kind === 'tether') {
          unique(exercise.tokens.map((token) => token.id), exercise.id);
          expect(exercise.links.length, exercise.id).toBeGreaterThan(0);
          unique(exercise.links.map((link) => JSON.stringify([link.from, link.to])), exercise.id);
          for (const link of exercise.links) {
            tokenReferences(exercise.tokens, [link.from, link.to], exercise.id);
            expect(link.from, exercise.id).not.toBe(link.to);
          }
          expect(Object.keys(exercise.distractorFeedback ?? {}).every((id) => exercise.tokens.some((token) => token.id === id)), exercise.id).toBe(true);
        }
      }
    });

    it('gebruikt ieder bouwblok precies eenmaal in alle toegestane vakken en transformaties', () => {
      for (const exercise of exercises) {
        if (exercise.kind === 'slots') {
          unique(exercise.blocks.map((block) => block.id), exercise.id);
          unique(exercise.slots.map((slot) => slot.id), exercise.id);
          expect(exercise.accept.length, exercise.id).toBeGreaterThan(0);
          const blockIds = exercise.blocks.map((block) => block.id).sort();
          const initial = Object.values(exercise.initial).flat();
          unique(initial, `${exercise.id}: beginplaatsing`);
          expect(initial.every((id) => blockIds.includes(id)), exercise.id).toBe(true);
          expect(Object.keys(exercise.initial).every((id) => exercise.slots.some((slot) => slot.id === id)), exercise.id).toBe(true);
          for (const placements of exercise.accept) {
            expect(Object.keys(placements).sort(), exercise.id).toEqual(exercise.slots.map((slot) => slot.id).sort());
            expect(Object.values(placements).flat().sort(), exercise.id).toEqual(blockIds);
            expect(exercise.slots.every((slot) => slot.capacity === undefined || placements[slot.id]!.length <= slot.capacity), exercise.id).toBe(true);
            expect(gradeSentence(exercise, { ...correctAnswer(exercise), placements }), exercise.id).toBe(true);
          }
          expect(gradeSentence(exercise, { ...correctAnswer(exercise), placements: {} }), `${exercise.id}: start al opgelost`).toBe(false);
        }
        if (exercise.kind === 'mutate') {
          unique(exercise.variants.map((variant) => variant.id), exercise.id);
          expect(exercise.variants.filter((variant) => variant.id === exercise.target), exercise.id).toHaveLength(1);
          for (const variant of exercise.variants) {
            unique(variant.blocks.map((block) => block.id), `${exercise.id}: ${variant.id}`);
            expect([...variant.order].sort(), `${exercise.id}: ${variant.id}`).toEqual(variant.blocks.map((block) => block.id).sort());
            expect(gradeSentence(exercise, { ...correctAnswer(exercise), variant: variant.id, order: variant.order }), `${exercise.id}: ${variant.id}`).toBe(variant.id === exercise.target);
          }
        }
      }
    });

    it('kan iedere authored oplossing werkelijk beoordelen en laat alle expliciete herstelvarianten toe', () => {
      for (const exercise of exercises) {
        const answer = correctAnswer(exercise);
        expect(gradeSentence(exercise, answer), exercise.id).toBe(true);
        if (exercise.kind === 'debug') {
          for (const text of exercise.repairs) expect(gradeSentence(exercise, { ...answer, text }), `${exercise.id}: ${text}`).toBe(true);
          expect(gradeSentence(exercise, { ...answer, text: 'Een andere inhoudelijke mededeling.' }), exercise.id).toBe(false);
        }
        if (exercise.kind === 'tether') {
          expect(gradeSentence(exercise, { ...answer, links: exercise.links.slice(1) }), `${exercise.id}: ontbrekende lijn`).toBe(false);
          expect(gradeSentence(exercise, { ...answer, links: [...exercise.links, exercise.links[0]!] }), `${exercise.id}: dubbele lijn`).toBe(false);
        }
      }
    });

    it('laat juiste controle-vlaggen onjuiste diagnose of segmentatie nooit overslaan', () => {
      for (const exercise of exercises) {
        const answer = { ...correctAnswer(exercise), checked: true, correct: true };
        if (exercise.kind === 'gate' || exercise.kind === 'debug') {
          expect(gradeSentence(exercise, { ...answer, selected: [], diagnosisPassed: true }), exercise.id).toBe(false);
          expect(gradeSentence(exercise, { ...answer, diagnosisPassed: false }), exercise.id).toBe(false);
        }
        if (exercise.support === 'half') {
          expect(gradeSentence(exercise, { ...answer, boundaries: [], segmentationPassed: true }), exercise.id).toBe(false);
          expect(gradeSentence(exercise, { ...answer, segmentationPassed: false }), exercise.id).toBe(false);
        }
      }
    });
  });
}

describe('Zinnen: betekenisgerichte indexregressies in de vier slotlessen', () => {
  it('selecteert een volledige inhoudsbijzin zonder het gezegde van de rompzin mee te nemen', () => {
    const exercise = sentenceLessons[8]!.arena[0]!;
    if (exercise.kind !== 'gate') throw new Error('Expected the subject-clause diagnosis');
    expect(exercise.diagnosis.targets.map((id) => exercise.diagnosis.tokens.find((token) => token.id === id)!.text).join(' ')).toBe('Dat alle groepen meedoen');
  });

  it('koppelt de betrekkelijke vorm naar brieven en niet naar de tussenliggende directeur', () => {
    const exercise = sentenceLessons[9]!.arena.find((item) => item.kind === 'tether');
    if (exercise?.kind !== 'tether') throw new Error('Expected the antecedent bridge');
    expect(exercise.links.map((link) => [exercise.tokens.find((token) => token.id === link.from)!.text, exercise.tokens.find((token) => token.id === link.to)!.text])).toEqual([['die', 'brieven']]);
  });

  it('maakt de ontvangers van een verzoek tot verzwegen uitvoerders, niet de coach', () => {
    const exercise = sentenceLessons[10]!.arena.find((item) => item.kind === 'tether');
    if (exercise?.kind !== 'tether') throw new Error('Expected the implied-subject bridge');
    expect(exercise.links.map((link) => [exercise.tokens.find((token) => token.id === link.from)!.text, exercise.tokens.find((token) => token.id === link.to)!.text])).toEqual([['ons', 'komen.']]);
  });

  it('verbindt de twee grensstreepjes rond de tussengedachte en niet een buurwoord', () => {
    const exercise = sentenceLessons[11]!.arena.find((item) => item.kind === 'tether');
    if (exercise?.kind !== 'tether') throw new Error('Expected the punctuation bridge');
    expect(exercise.links.map((link) => [exercise.tokens.find((token) => token.id === link.from)!.text, exercise.tokens.find((token) => token.id === link.to)!.text])).toEqual([['—', '—']]);
  });
});
