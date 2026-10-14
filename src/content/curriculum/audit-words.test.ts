// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { isCorrect } from '@/engine/grade';
import { StepSchema, type StepInput } from '../schema';
import { DEEL_LESSONS } from '../packs/deel';
import { LES_D24 } from '../packs/nieuw/d24';
import { LES_W24 } from '../packs/nieuw/w24';
import { ONDERZOEK_D15 } from '../packs/onderzoek/d15';
import { MORPHOLOGY_UPGRADES } from './morphology';
import { WORD_UPGRADES } from './words';

const getStep = (steps: StepInput[], id: string) => {
  const input = steps.find((step) => step.id === id);
  if (!input) throw new Error(`Missing authored exercise ${id}`);
  return StepSchema.parse(input);
};

describe('woordaudit: zelfstandig toepassen met inhoudelijke tegenvoorbeelden', () => {
  it.each([
    ['d0', 'transfer-zelf-ontleden', 'vogel-s', 'vo-gels'],
    ['d1', 'toepassen-verkleinwoord', 'tulpje', 'tulpetje'],
    ['d3', 'toepassen-nieuwe-context', 'herstarten', 'verstarten'],
    ['d5', 'transfer-zelf-morfemen', 'on-werk-baar', 'onwerk-baar'],
    ['d6', 'transfer-afleiding-daarna-buiging', 'roeiers', 'roeier'],
    ['d7', 'transfer-hoofd-in-bericht', 'het krantenrek', 'de krantenrek'],
    ['d8', 'transfer-bereik-zelf-preciseren', '[[zomer regen] jas]', '[zomer [regen jas]]'],
    ['d10', 'transfer-tussenletter-zelf', 'dorpsplein', 'dorpenplein'],
    ['d13', 'transfer-paradigma-zelf-aanvullen', 'is', 'bent'],
  ])('%s/%s geeft credit voor de bedoelde toepassing en corrigeert de specifieke misvatting', (lessonId, stepId, solution, misconception) => {
    const step = getStep(MORPHOLOGY_UPGRADES[lessonId]!.steps, stepId);
    expect(step.kind).toBe('type');
    expect(isCorrect(step, { kind: 'type', value: solution })).toBe(true);
    expect(isCorrect(step, { kind: 'type', value: misconception })).toBe(false);
    if (step.kind === 'type') {
      expect(`${step.prompt} ${step.hint} ${step.before} ${step.after}`).not.toContain(solution);
      expect(step.why.length).toBeGreaterThan(80);
    }
  });

  it('oefent een nieuwe werkwoordsvorm zonder het antwoord in de recall-cue te tonen', () => {
    const step = getStep(WORD_UPGRADES.w10!.steps, 'transfer-w10-redactie');
    expect(step.kind).toBe('recall');
    if (step.kind !== 'recall') return;
    expect(step.answers).toEqual(['verloren']);
    expect(`${step.prompt} ${step.clue} ${step.before} ${step.after}`).not.toContain('verloren');
  });

  it.each([
    [DEEL_LESSONS.find((lesson) => lesson.id === 'd9')!.steps, 'los', 'De belastingdienst stuurde een brief.', 'De belastingdienst dienst stuurde een brief.'],
    [LES_D24.steps, 'afstandsloop', 'Ze traint al maanden voor de langeafstandsloop van zondag.', 'Ze traint al maanden voor de langeafstandsloop afstandsloop van zondag.'],
  ])('een samengevoegde woordgrens laat geen dubbel tweede deel in de zin staan', (steps, id, solution, duplicated) => {
    const step = getStep(steps, id);
    expect(step.kind).toBe('rewrite');
    expect(isCorrect(step, { kind: 'rewrite', value: solution })).toBe(true);
    expect(isCorrect(step, { kind: 'rewrite', value: duplicated })).toBe(false);
  });

  it('corrigeert een verkeerd die na boek, zonder informeel wat als universele fout te scoren', () => {
    const step = getStep(LES_W24.steps, 'boek-wat');
    expect(step.kind).toBe('fix');
    if (step.kind !== 'fix') return;
    expect(step.sentence.split(' ')[step.wrong]).toBe('die');
    expect(isCorrect(step, { kind: 'fix', index: step.wrong, value: 'dat' })).toBe(true);
  });

  it('houdt geldige oude hapaxen in de productiviteitsteller en maakt de noemer expliciet', () => {
    const step = getStep(ONDERZOEK_D15, 'schoon-p');
    expect(step.kind).toBe('bet');
    if (step.kind !== 'bet') return;
    expect(step.answer).toBe('0,020');
    expect(step.prompt).toContain('1000 geldige voorkomens');
    expect(step.why).toContain('ook de twee oude woorden');
  });

  it('laat de leerling zelf een voornaamwoordelijk bijwoord produceren zonder overbodige woorden', () => {
    const step = getStep(WORD_UPGRADES.w25!.steps, 'transfer-w25-zelf-vervangen');
    expect(isCorrect(step, { kind: 'rewrite', value: 'Dat plan is haalbaar. Wij werken eraan.' })).toBe(true);
    expect(isCorrect(step, { kind: 'rewrite', value: 'Dat plan is haalbaar. Wij werken eraan dat plan.' })).toBe(false);
  });
});
