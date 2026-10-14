// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { clozeOf, clozeSolution, matchesAnswer } from '../cloze';
import { StepSchema } from '../schema';
import { criteriaStatus, isComplete, isCorrect } from '../../engine/grade';
import { proofreadAccepts } from '../../engine/kinds';
import { FOUNDATION_UPGRADES } from './foundations';
import { LES_L26 } from '../packs/praktijk/l26';
import { LES_L27 } from '../packs/praktijk/l27';

const sequence = (prefix: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => `${prefix}${from + index}`);
const requiredLessons = [
  'l1', 'l2', 'l4', ...sequence('l', 20, 27),
  'k1', 'l3', ...sequence('k', 30, 40),
  'g1', 'g2', 'g3', ...sequence('g', 20, 28),
];
const introductoryLessons = ['l1', 'l2', 'l4', 'k1', 'l3', 'g1', 'g2', 'g3'];

describe('Praktische basis: iedere les heeft begeleiding en toepassing', () => {
  it('dekt alle 36 bestaande lessen van de eerste drie niveaus', () => {
    expect(Object.keys(FOUNDATION_UPGRADES).sort()).toEqual(requiredLessons.sort());
  });

  it.each(requiredLessons)('%s heeft geldige, oplosbare stappen en eigen begeleiding', (lessonId) => {
    const upgrade = FOUNDATION_UPGRADES[lessonId]!;
    expect(upgrade.guidance.goal.split(/\s+/).length).toBeGreaterThanOrEqual(8);
    expect(upgrade.guidance.startingPoint.trim().length).toBeGreaterThan(20);
    expect(upgrade.guidance.strategy.length).toBeGreaterThanOrEqual(3);
    expect(upgrade.guidance.selfCheck.length).toBeGreaterThanOrEqual(2);
    expect(new Set(upgrade.guidance.strategy).size).toBe(upgrade.guidance.strategy.length);
    expect(upgrade.steps.length).toBeGreaterThanOrEqual(2);
    const ids = upgrade.steps.map((step) => step.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const step of upgrade.steps) {
      expect(step.id).toMatch(/^(toepassen|transfer)-/);
      const parsed = StepSchema.safeParse(step);
      expect(parsed.success, `${lessonId}/${step.id}: ${parsed.success ? '' : parsed.error.message}`).toBe(true);
      if (step.kind === 'choice' || step.kind === 'bet') expect(step.options.length).toBeGreaterThanOrEqual(4);
      if (step.kind === 'cloze') {
        const gaps = clozeOf(step.text).gaps;
        expect(gaps.length).toBeGreaterThanOrEqual(2);
        expect(gaps.every((gap) => Boolean(gap.note))).toBe(true);
      }
    }
  });

  it.each(introductoryLessons)('%s bouwt de korte basisles uit met uitleg en gevarieerde handelingen', (lessonId) => {
    const steps = FOUNDATION_UPGRADES[lessonId]!.steps;
    const explanation = steps.find((step) => step.kind === 'explain');
    expect(explanation?.kind).toBe('explain');
    if (explanation?.kind !== 'explain') return;
    expect(explanation.panels.length).toBeGreaterThanOrEqual(2);
    expect(explanation.panels.every((panel) => Object.keys(panel).some((key) => !['text', 'rule', 'deep', 'show'].includes(key)))).toBe(true);
    expect(steps.filter((step) => step.kind !== 'explain').length).toBeGreaterThanOrEqual(4);
    expect(new Set(steps.map((step) => step.kind)).size).toBeGreaterThanOrEqual(4);
  });
});

describe('Antwoorden en zelfcontrole sluiten aan op de bedoelde spelling', () => {
  it('accepteert bij de brief alleen de noodzakelijke hoofdletter Van', () => {
    const step = FOUNDATION_UPGRADES.l21!.steps.find((item) => item.id === 'transfer-formele-bevestiging')!;
    expect(step.kind).toBe('cloze');
    if (step.kind !== 'cloze') return;
    const answers = clozeOf(step.text).gaps[0]!.answers;
    expect(matchesAnswer('Van', answers, step.caps ?? false)).toBe(true);
    expect(matchesAnswer('van', answers, step.caps ?? false)).toBe(false);
  });

  it('maakt verlenging afhankelijk van de juiste lettergreep, ook binnen een samenstelling', () => {
    const step = FOUNDATION_UPGRADES.g21!.steps.find((item) => item.id === 'toepassen-inrichting-magazijn')!;
    expect(step.kind).toBe('cloze');
    if (step.kind !== 'cloze') return;
    expect(clozeOf(step.text).gaps.map((gap) => gap.answers)).toEqual([['schuren'], ['loodsen'], ['laden'], ['theepotten']]);
    expect(clozeSolution(step.text)).toContain('twee schuren naast drie loodsen');
  });

  it('verwerpt in de correctietaak een onveranderde foute hoofdletter', () => {
    const step = FOUNDATION_UPGRADES.l22!.steps.find((item) => item.id === 'toepassen-programma-buurthuis')!;
    expect(step.kind).toBe('proofread');
    if (step.kind !== 'proofread') return;
    const token = step.tokens.find((item) => item.t === 'spaanse')!;
    expect('fix' in token).toBe(true);
    if (!('fix' in token)) return;
    expect(proofreadAccepts(token, 'Spaanse')).toBe(true);
    expect(proofreadAccepts(token, 'spaanse')).toBe(false);
  });

  it('biedt bij iedere open schrijftaak een haalbaar voorbeeld met inhoudelijke zelfcontrole', () => {
    const writingSteps = Object.values(FOUNDATION_UPGRADES).flatMap((upgrade) => upgrade.steps).filter((step) => step.kind === 'write');
    expect(writingSteps.length).toBeGreaterThanOrEqual(5);
    for (const input of writingSteps) {
      const step = StepSchema.parse(input);
      if (step.kind !== 'write') continue;
      expect(step.rubric, step.id).toBeDefined();
      const sample = step.rubric!.example;
      const status = criteriaStatus(step, sample);
      expect(status.enoughWords, `${step.id}: voorbeeld is te kort`).toBe(true);
      expect(status.criteria.filter((criterion) => !criterion.met), step.id).toEqual([]);
      expect(isComplete(step, { kind: 'write', value: sample }), 'Alleen een tekst typen rondt de zelfcontrole niet af').toBe(false);
      expect(isComplete(step, { kind: 'write', value: sample, reviewed: true, selfChecks: step.rubric!.criteria.map(() => true) })).toBe(true);
    }
  });
});

describe('Zelfstandig ophalen in een andere situatie', () => {
  it.each(requiredLessons)('%s eindigt met een korte eigen poging zonder antwoordkeuzes', (lessonId) => {
    const input = FOUNDATION_UPGRADES[lessonId]!.steps.at(-1)!;
    const step = StepSchema.parse(input);
    expect(step.id).toBe('transfer-zelfstandig-in-een-nieuwe-situatie');
    expect(['type', 'rewrite', 'proofread']).toContain(step.kind);
    if (step.kind === 'type') {
      expect(step.hint).toBe('');
      const taskText = `${step.prompt} ${step.before} ${step.after}`.toLocaleLowerCase('nl');
      const answer = step.answer.toLocaleLowerCase('nl');
      const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const wholeAnswer = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'u');
      expect(wholeAnswer.test(taskText), `${lessonId}: de eindtaak geeft het antwoord weg`).toBe(false);
    }
    if (step.kind === 'proofread') {
      expect(step.blind).toBe(true);
      expect(step.tokens.some((token) => 'fix' in token)).toBe(true);
      expect(step.tokens.some((token) => 'trap' in token)).toBe(true);
      for (const token of step.tokens) {
        if (!('fix' in token)) continue;
        expect(proofreadAccepts(token, token.fix), `${lessonId}: correcte reparatie`).toBe(true);
        expect(proofreadAccepts(token, token.t), `${lessonId}: fout overtypen mag niet slagen`).toBe(false);
      }
    }
  });

  it.each([
    ['l1', '5'], // oe als één geschreven letter tellen
    ['l20', 'mila.bos@web.nl'], // een punt is geen laag streepje
    ['l23', 'premiere'],
    ['l24', 'geirriteerd'],
    ['l25', 'spray’s'], // geen apostrof na de klinkercombinatie ay
    ['l26', 'een bezoekersingang en uitgang'], // de weglating wordt onzichtbaar
    ['k1', 'u'],
    ['k30', 'zon'],
    ['k31', 'lijden'],
    ['k32', 'douw'],
    ['k33', 'groejt'],
    ['k34', 'bragt'],
    ['k35', 'wep'],
    ['k36', 'positiefe'],
    ['k37', 'geduldug'],
    ['k38', 'enquete'],
    ['k39', 'proefte'],
    ['g1', 'muuren'],
    ['g2', 'panen'],
    ['g3', 'gaat onder'],
    ['g20', 'wacht-ru-im-te'],
    ['g21', 'vaazen'],
    ['g22', 'kastten'],
    ['g23', 'schippen'],
    ['g24', 'probleemje'],
    ['g25', 'vind'], // je betekent jouw, de collega is het onderwerp
    ['g26', 'breede'],
    ['g27', 'ïne'], // trema vervalt op de opgegeven afbreekgrens
  ])('%s onderscheidt de bedoelde vorm van de concrete denkfout %s', (lessonId, misconception) => {
    const step = StepSchema.parse(FOUNDATION_UPGRADES[lessonId]!.steps.at(-1));
    expect(step.kind).toBe('type');
    if (step.kind !== 'type') return;
    expect(isCorrect(step, { kind: 'type', value: step.answer })).toBe(true);
    expect(isCorrect(step, { kind: 'type', value: misconception })).toBe(false);
  });

  it('controleert hoofdletters en apostrofs ook als de eindredactie tegelijk woordspelling herstelt', () => {
    const step = StepSchema.parse(FOUNDATION_UPGRADES.l27!.steps.find((input) => input.id === 'transfer-eindredactie-zonder-hulp'));
    expect(step.kind).toBe('rewrite');
    if (step.kind !== 'rewrite') return;
    expect(step.strict).toBe(true);
    const model = step.accept[0]!;
    expect(isCorrect(step, { kind: 'rewrite', value: model })).toBe(true);
    expect(isCorrect(step, { kind: 'rewrite', value: model.toLocaleLowerCase('nl') })).toBe(false);
    expect(isCorrect(step, { kind: 'rewrite', value: model.replace('Mila’s', 'Milas') })).toBe(false);
  });

  it.each([LES_L26, LES_L27])('$id gebruikt toegestane leesbaarheidskoppeltekens niet als spelfout', (lesson) => {
    const wrongForms: string[] = [];
    const visit = (value: unknown) => {
      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }
      if (!value || typeof value !== 'object') return;
      const record = value as Record<string, unknown>;
      if (typeof record.wrong === 'string') wrongForms.push(record.wrong);
      if (typeof record.t === 'string' && (record.ok === false || typeof record.fix === 'string')) wrongForms.push(record.t);
      Object.values(record).forEach(visit);
    };
    visit(lesson);
    expect(wrongForms.filter((form) => /\b(politie-agent|fietsen-rek|klanten-service|energie-leverancier)\b/.test(form))).toEqual([]);
  });
});
