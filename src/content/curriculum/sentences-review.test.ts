import { describe, expect, it } from 'vitest';
import { adaptLegacyCourse } from '../adapters/legacy';
import { withExtraLessons } from '../packs';
import { StepSchema } from '../schema';
import { isCorrect, isFormExercise } from '../../engine/grade';
import { recallCorrect } from '../../engine/words';
import { SENTENCE_REVIEW_SOURCES, SENTENCE_REVIEW_UPGRADES } from './sentences-review';
import { WRITING_UPGRADES } from './writing';

const expectedIds = [
  ...Array.from({ length: 18 }, (_, index) => `p${index + 1}`),
  'z1', 'z2', 'z3', 'z20', 'z21', 'z22', 's1', 's2', 's3', 's20', 's21', 's22',
];
const rawLessons = withExtraLessons(adaptLegacyCourse()).layers.flatMap((layer) => layer.lessons);

describe('inhoudelijke herhaling van alle bestaande Zinnen-lessen', () => {
  it('dekt alle dertig lessen af met aanvullende ids die geen bestaande stap vervangen', () => {
    expect(Object.keys(SENTENCE_REVIEW_UPGRADES).sort()).toEqual(expectedIds.sort());
    for (const [id, upgrade] of Object.entries(SENTENCE_REVIEW_UPGRADES)) {
      const raw = rawLessons.find((lesson) => lesson.id === id);
      expect(raw, id).toBeDefined();
      const oldIds = new Set([...raw!.steps, ...(WRITING_UPGRADES[id]?.steps ?? [])].map((step) => step.id));
      for (const step of upgrade.steps) {
        expect(step.id, id).toMatch(/^audit-zinnen-/);
        expect(oldIds.has(step.id), `${id}/${step.id}`).toBe(false);
      }
      expect(new Set(upgrade.steps.map((step) => step.id)).size, id).toBe(upgrade.steps.length);
    }
  });

  it.each(Object.entries(SENTENCE_REVIEW_UPGRADES))('%s vraagt ophalen, zelf bouwen en contextuele toepassing met uitvoerbare antwoorden', (id, upgrade) => {
    expect(upgrade.steps.map((step) => step.kind)).toEqual(['recall', 'rewrite', 'choice']);
    for (const input of upgrade.steps) {
      const step = StepSchema.parse(input);
      if (step.kind === 'recall') {
        for (const answer of step.answers) expect(recallCorrect(step, answer), `${id}: ${answer}`).toBe(true);
        expect(recallCorrect(step, 'ik weet het niet'), id).toBe(false);
      }
      if (step.kind === 'rewrite') {
        for (const value of step.accept) expect(isCorrect(step, { kind: 'rewrite', value }), `${id}: ${value}`).toBe(true);
        expect(isCorrect(step, { kind: 'rewrite', value: step.source }), `${id}: bron is nog geen oplossing`).toBe(false);
      }
      if (step.kind === 'choice') {
        expect(step.options.length).toBeGreaterThanOrEqual(3);
        for (const value of step.options) expect(isCorrect(step, { kind: 'choice', value }), `${id}: ${value}`).toBe(value === step.answer);
      }
    }
  });

  it('accepteert correcte varianten van heel/hele en u kunt/u kan', () => {
    const degree = StepSchema.parse(SENTENCE_REVIEW_UPGRADES.p9!.steps[0]);
    const request = StepSchema.parse(SENTENCE_REVIEW_UPGRADES.s3!.steps[0]);
    expect(degree.kind).toBe('recall');
    expect(request.kind).toBe('recall');
    if (degree.kind === 'recall') {
      expect(recallCorrect(degree, 'heel')).toBe(true);
      expect(recallCorrect(degree, 'hele')).toBe(true);
      expect(recallCorrect(degree, 'heele')).toBe(false);
    }
    if (request.kind === 'recall') {
      expect(recallCorrect(request, 'kunt')).toBe(true);
      expect(recallCorrect(request, 'kan')).toBe(true);
    }
  });

  it('beoordeelt komma’s en hoofdletters bij de vormopdrachten', () => {
    for (const id of ['p6', 'z3', 's2']) {
      const step = StepSchema.parse(SENTENCE_REVIEW_UPGRADES[id]!.steps[1]);
      expect(step.kind).toBe('rewrite');
      if (step.kind !== 'rewrite') throw new Error('Vormopdracht ontbreekt');
      expect(isFormExercise(step), id).toBe(true);
      expect(isCorrect(step, { kind: 'rewrite', value: step.source }), id).toBe(false);
    }
  });

  it('bewaart de oude p9 stap-id en corrigeert fout gespelde heele in plaats van correcte hele', () => {
    const step = rawLessons.find((lesson) => lesson.id === 'p9')!.steps.find((item) => item.id === 'heel-mooi');
    expect(step?.kind).toBe('fix');
    if (step?.kind !== 'fix') throw new Error('Bestaande spellingopdracht ontbreekt');
    expect(step.sentence.split(/\s+/)[step.wrong]).toBe('heele');
    expect(step.answer).toBe('heel');
    expect(step.why).toContain('ook correct');
  });

  it('legt officiële bronsoorten vast en beschrijft theorie als model', () => {
    expect(new URL(SENTENCE_REVIEW_SOURCES.degree).hostname).toBe('taaladvies.net');
    expect(new URL(SENTENCE_REVIEW_SOURCES.spelling).hostname).toBe('woordenlijst.org');
    const theory = JSON.stringify(SENTENCE_REVIEW_UPGRADES.p12);
    expect(theory).toContain('analysemodel');
    expect(theory).toContain('gekozen theoretische beschrijving');
  });
});
