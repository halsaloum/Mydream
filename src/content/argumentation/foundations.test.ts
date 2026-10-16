import { describe, expect, it } from 'vitest';
import { argumentLessons } from './curriculum';
import { argumentFoundations, foundationForLesson } from './foundations';

const ids = (lessonId: string) => foundationForLesson(lessonId).map((concept) => concept.id);

describe('uitgewerkte fundamenten voor argumentatie', () => {
  it('begint vanaf nul en introduceert tien begrippen als afzonderlijke pagina-inhoud', () => {
    expect(argumentFoundations.map((concept) => concept.id).sort()).toEqual([
      'argument', 'bewijslast', 'conclusie', 'drogreden', 'geldigheid', 'gevolgtrekking', 'premisse', 'tegenvoorbeeld', 'verbindingsregel', 'verzwegen-premisse',
    ]);
    expect(ids('basis-standpunt-en-reden')).toEqual(['argument', 'conclusie', 'premisse', 'gevolgtrekking']);
    expect(ids('basis-verzwegen-stap')).toEqual(['verzwegen-premisse', 'verbindingsregel']);
    expect(ids('basis-argument-of-uitleg')).toEqual(['bewijslast']);
    expect(ids('basis-verborgen-premissen')).toEqual(['geldigheid']);
    expect(ids('basis-kritiek-en-herstel')).toEqual(['drogreden']);
    expect(ids('basis-voorwaarden-en-gevolgen')).toEqual(['tegenvoorbeeld']);
    expect(ids('master-toulmin-bewijslast')).toEqual(['bewijslast', 'verbindingsregel']);
    expect(ids('basis-redenen-beoordelen')).toEqual([]);
    expect(ids('onbekende-les')).toEqual([]);
  });

  it('biedt echte uitleg, een nieuwe toepassing en feedback per begrip', () => {
    const suppliedBooks = new Set(['govier', 'groarke', 'tindale', 'walton', 'schemes', 'pragma', 'bowell']);
    const existingScenarios = new Set(argumentLessons.flatMap((lesson) => lesson.exercises.map((exercise) => 'scenario' in exercise ? exercise.scenario : undefined)));
    for (const concept of argumentFoundations) {
      const paragraphs = concept.body.split('\n\n');
      const words = concept.body.trim().split(/\s+/).length;
      expect(paragraphs.length, concept.id).toBeGreaterThanOrEqual(3);
      expect(paragraphs.length, concept.id).toBeLessThanOrEqual(4);
      expect(words, concept.id).toBeGreaterThanOrEqual(150);
      expect(words, concept.id).toBeLessThanOrEqual(230);
      expect(concept.title, concept.id).toBe(concept.term);
      expect(concept.prompt, concept.id).toBe(concept.question);
      expect(concept.example.length, concept.id).toBeGreaterThan(50);
      expect(existingScenarios.has(concept.scenario), concept.id).toBe(false);
      expect(concept.scenario.length, concept.id).toBeGreaterThan(50);
      expect(concept.options.length, concept.id).toBe(3);
      expect(new Set(concept.options.map((option) => option.id)).size, concept.id).toBe(3);
      expect(concept.options.filter((option) => option.id === concept.answer).length, concept.id).toBe(1);
      expect(concept.options.every((option) => option.feedback.length > 50), concept.id).toBe(true);
      expect(concept.sourceIds.length, concept.id).toBeGreaterThanOrEqual(2);
      expect(concept.sourceIds.every((id) => suppliedBooks.has(id)), concept.id).toBe(true);
    }
  });

  it('houdt diagramrollen expliciet en maakt geen afgeleide conclusie van een verbindingsregel', () => {
    for (const concept of argumentFoundations) {
      const picture = concept.diagram;
      const nodeIds = picture.nodes.map((node) => node.id);
      expect(picture.nodes.length, concept.id).toBeGreaterThanOrEqual(2);
      expect(picture.nodes.length, concept.id).toBeLessThanOrEqual(3);
      expect(new Set(nodeIds).size, concept.id).toBe(nodeIds.length);
      expect(picture.rows.flat().sort(), concept.id).toEqual([...nodeIds].sort());
      expect(picture.edges.every((edge) => nodeIds.includes(edge.from) && nodeIds.includes(edge.to)), concept.id).toBe(true);
      expect(picture.legend.length, concept.id).toBeGreaterThan(50);
      for (const rule of picture.nodes.filter((node) => node.label === 'Verbindingsregel')) {
        expect(picture.edges.some((edge) => edge.to === rule.id), concept.id).toBe(false);
        expect(picture.edges.some((edge) => edge.from === rule.id && edge.kind === 'authorize'), concept.id).toBe(true);
      }
    }
  });

  it('houdt de start alledaags en introduceert ieder fundament vóór een latere herhaling', () => {
    const first = argumentFoundations.find((concept) => concept.id === 'argument')!;
    expect(first.body.startsWith('Een argument is een reden')).toBe(true);
    expect(first.body).not.toMatch(/\b(premisse|warrant|deductief)\b/i);
    const introduced = new Set<string>();
    for (const lesson of argumentLessons) {
      for (const concept of foundationForLesson(lesson.id)) introduced.add(concept.id);
      if (lesson.id === 'basis-argument-of-uitleg') expect(introduced.has('bewijslast')).toBe(true);
      if (lesson.id === 'basis-verborgen-premissen') expect(introduced.has('geldigheid')).toBe(true);
      if (lesson.id === 'basis-voorwaarden-en-gevolgen') expect(introduced.has('tegenvoorbeeld')).toBe(true);
      if (lesson.id === 'master-toulmin-bewijslast') expect([...introduced].sort()).toEqual(argumentFoundations.map((concept) => concept.id).sort());
    }
  });
});
