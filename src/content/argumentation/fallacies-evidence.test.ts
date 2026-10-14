import { describe, expect, it } from 'vitest';
import { wordCount } from '@/lib/argumentation/learning';
import { evidenceFallacies } from './fallacies-evidence';
import { fallacyBookGuides } from './fallacy-book-guides';

const seed = (slug: string) => evidenceFallacies.find((item) => item.slug === slug)!;
const chosen = (question: ReturnType<typeof seed>['core']) => question.options[question.answer].text;

describe('authored evidence lessons', () => {
  it('provides all fourteen assigned lessons at their intended level', () => {
    expect(evidenceFallacies.filter((item) => item.level === 'bachelor')).toHaveLength(9);
    expect(evidenceFallacies.filter((item) => item.level === 'master')).toHaveLength(5);
    expect(new Set(evidenceFallacies.map((item) => item.slug)).size).toBe(14);
    expect(evidenceFallacies.some((item) => ['overlevingsbias', 'ecologische-drogreden'].includes(item.slug))).toBe(false);
  });

  it('teaches each pattern before asking for distinct transfer and self-explanation', () => {
    for (const item of evidenceFallacies) {
      for (const section of item.sections) expect(wordCount(section.body), `${item.slug}:${section.title}`).toBeGreaterThanOrEqual(100);
      expect(wordCount(item.deepDive.body), item.slug).toBeGreaterThanOrEqual(150);
      expect(wordCount(item.writing.model), item.slug).toBeGreaterThanOrEqual(90);
      expect(wordCount(item.writing.model), item.slug).toBeLessThanOrEqual(120);
      const cases = [item.starter.scenario, item.inquiry.scenario, item.core.scenario, ...item.assessment.map((entry) => entry.scenario), item.puzzle.scenario, item.writing.scenario];
      expect(new Set(cases).size, item.slug).toBe(cases.length);
      for (const question of [item.starter, item.core, ...item.assessment]) {
        for (const option of question.options) expect(option.feedback.length, `${item.slug}:${option.text}`).toBeGreaterThan(60);
      }
    }
  });

  it('keeps premises and assumed bridges separate in every authored contrast', () => {
    for (const item of evidenceFallacies) {
      expect(item.illustration.variants, item.slug).toHaveLength(2);
      for (const variant of item.illustration.variants) {
        expect(variant.caption.length, item.slug).toBeGreaterThan(60);
        const picture = variant.data;
        if (picture.family !== 'flow') throw new Error('Expected explicit premise/bridge contrast');
        const ids = picture.nodes.map((node) => node.id);
        expect(picture.rows.flat().sort()).toEqual([...ids].sort());
        expect(picture.edges.every((edge) => ids.includes(edge.from) && ids.includes(edge.to))).toBe(true);
        expect(picture.edges).not.toContainEqual(expect.objectContaining({ from: 'p', to: 'i' }));
        expect(picture.edges).toContainEqual(expect.objectContaining({ from: 'i', to: 'c', kind: 'authorize' }));
        expect(picture.nodes.find((node) => node.id === 'i')?.label).toBe('Verzwegen aanname');
      }
    }
  });

  it('checks the numerical base-rate cases with independent counts and the positive denominator', () => {
    const base = seed('basisfrequentie-negeren');
    const coreTrue = 100 * 0.8, coreFalse = 900 * 0.1;
    expect(coreTrue + coreFalse).toBe(170);
    expect(chosen(base.core)).toContain('80/170');
    expect(chosen(base.core)).toContain((100 * coreTrue / (coreTrue + coreFalse)).toFixed(1).replace('.', ','));
    const rareTrue = 40 * 0.9, rareFalse = 7960 * 0.05;
    expect(rareFalse).toBe(398);
    expect(chosen(base.assessment[0])).toContain('36 + 398');
    expect(chosen(base.assessment[0])).toContain((100 * rareTrue / (rareTrue + rareFalse)).toFixed(1).replace('.', ','));
    expect(chosen(base.assessment[2])).toContain((100 * 85 / 205).toFixed(1).replace('.', ','));
    expect(base.inquiry.model).toContain('190/288');
    expect(base.inquiry.model).toContain((100 * 190 / 288).toFixed(1).replace('.', ','));
    expect(base.writing.model).toContain('90/185');
    expect(base.writing.model).toContain((100 * 90 / 185).toFixed(1).replace('.', ','));
  });

  it('distinguishes independent repetition from removal without replacement', () => {
    const gambler = seed('gokkersdrogreden');
    expect(chosen(gambler.starter)).toBe('1/2.');
    expect(Math.pow(0.5, 6)).toBe(1 / 64);
    expect(gambler.sections[1]!.body).toContain('1/64');
    const greenRemaining = 6 - 3, yellowRemaining = 4;
    expect(chosen(gambler.core)).toBe(`${yellowRemaining}/${greenRemaining + yellowRemaining}.`);
    expect(chosen(gambler.assessment[1])).toContain('2/3');
    expect(gambler.inquiry.model).toContain('blijft de volgende S-kans 1/4');
  });

  it('evaluates the sunk-cost comparison from the decision point without adding the sunk amount', () => {
    const sunk = seed('verzonken-kosten');
    expect(18000 - 10000).toBe(8000);
    expect(sunk.inquiry.model).toContain('8.000');
    expect(12000 - 16000).toBe(-4000);
    expect(sunk.writing.model).toContain('vier duizend euro negatief verschil');
    expect(sunk.writing.model).toContain('bij beide opties verloren');
    expect(chosen(sunk.core)).toContain('toekomstige boete');
  });

  it('grounds each topic in two real supplied editions while marking derived labels honestly', () => {
    expect(Object.keys(fallacyBookGuides)).toHaveLength(10);
    for (const entries of Object.values(fallacyBookGuides)) {
      expect(entries).toHaveLength(2);
      expect(new Set(entries.map((entry) => entry.sourceId)).size).toBe(2);
      for (const entry of entries) {
        expect(entry.fileName).toMatch(/\.(pdf|epub)$/);
        expect(entry.pages).toMatch(/PDF-pagina|EPUB/);
        expect(entry.chapter).toContain('Hoofdstuk');
        expect(entry.concepts.length).toBeGreaterThanOrEqual(3);
      }
    }
    expect(fallacyBookGuides.generalization.some((entry) => entry.note?.includes('Niet ieder hedendaags label'))).toBe(true);
    expect(fallacyBookGuides.probability.some((entry) => entry.note?.includes('eigen toepassingen'))).toBe(true);
  });
});
