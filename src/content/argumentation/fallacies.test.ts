import { describe, expect, it } from 'vitest';
import { argumentLessons } from './curriculum';
import { fallacyLessons, fallacySeeds } from './fallacies';
import { lessonCoreChecks } from './core-checks';
import { argumentInquiries } from './inquiries';
import { lessonIllustrations } from './illustrations';
import { argumentSourceGuide } from './source-guide';
import { mediaForLesson } from './lesson-media';
import { wordCount, emptyArgumentAnswer, answerReady, gradeArgument } from '@/lib/argumentation/learning';
import { theoryPages } from '@/lib/argumentation/theory-pages';

const required = [
  'stropop', 'ad-hominem-belediging', 'ad-hominem-belang', 'tu-quoque', 'genetische-drogreden', 'schuld-door-associatie', 'putvergiftigen', 'rode-haring', 'whataboutism', 'doelpalen-verschuiven', 'dubbelzinnigheid', 'amfibolie', 'suggestieve-vraag', 'cirkelredenering', 'vals-dilemma', 'hellend-vlak',
  'verkeerde-autoriteit', 'populariteit', 'traditie', 'nieuwheid', 'natuur', 'medelijden', 'angst', 'dreiging', 'wensdenken', 'beroep-op-onwetendheid', 'bewijslast-omkeren', 'speciale-uitzondering', 'geen-echte-schot', 'onfeilbare-oplossing', 'drogreden-drogreden', 'middenweg',
  'overhaaste-generalisatie', 'cherry-picking', 'anekdotisch-bewijs', 'post-hoc', 'samenhang-oorzaak', 'enkele-oorzaak', 'zwakke-analogie', 'compositie', 'divisie', 'gevolg-bevestigen', 'antecedent-ontkennen', 'gokkersdrogreden', 'verzonken-kosten', 'basisfrequentie-negeren', 'overlevingsbias', 'ecologische-drogreden',
];

describe('afzonderlijke drogredenlessen met kritische toepassing', () => {
  it('dekt alle 48 afgesproken patronen met een eigen stabiele lesroute', () => {
    expect(fallacySeeds.map((seed) => seed.slug).sort()).toEqual([...required].sort());
    expect(new Set(fallacySeeds.map((seed) => seed.name)).size).toBe(48);
    expect(fallacyLessons).toHaveLength(48);
    expect(argumentLessons).toHaveLength(69);
    for (const lesson of fallacyLessons) {
      expect(argumentLessons).toContain(lesson);
      expect(lesson.id).toBe(`drogreden-${lesson.fallacy!.slug}`);
      expect(lesson.fallacy!.aliases.length, lesson.id).toBeGreaterThan(0);
      const index = argumentLessons.indexOf(lesson);
      const checkpoint = argumentLessons.findIndex((item) => item.moduleId === lesson.moduleId && item.checkpoint);
      expect(index, lesson.id).toBeLessThan(checkpoint);
      expect(index, lesson.id).toBeGreaterThan(argumentLessons.findIndex((item) => item.id === 'basis-checkpoint'));
    }
  });

  it('biedt per patroon diepte, een contextgrens en verschillend nieuw oefenmateriaal', () => {
    for (const seed of fallacySeeds) {
      const lesson = fallacyLessons.find((item) => item.fallacy?.slug === seed.slug)!;
      expect(lesson.sections, lesson.id).toHaveLength(3);
      expect(wordCount(lesson.sections.map((section) => section.body).join(' ') + ' ' + lesson.deepDive.body), lesson.id).toBeGreaterThanOrEqual(350);
      expect(seed.criticalQuestion.length, lesson.id).toBeGreaterThan(25);
      const cases = [seed.starter.scenario, seed.inquiry.scenario, seed.core.scenario, ...seed.assessment.map((item) => item.scenario), seed.puzzle.scenario, seed.writing.scenario];
      expect(new Set(cases).size, lesson.id).toBe(cases.length);
      expect(lesson.exercises.map((item) => item.kind), lesson.id).toEqual(['choice', 'choice', 'sort', 'choice', 'reflection']);
      expect(seed.puzzle.cards.length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(seed.puzzle.cards.every((card) => Number.isInteger(card.category) && card.category >= 0 && card.category < seed.puzzle.categories.length), lesson.id).toBe(true);
      const puzzle = lesson.exercises[2]!;
      if (puzzle.kind === 'sort') {
        const correct = Object.fromEntries(puzzle.cards.map((card) => [card.id, card.category]));
        expect(gradeArgument(puzzle, { ...emptyArgumentAnswer(), placements: correct })).toBe(1);
        const changed = { ...correct, [puzzle.cards[0]!.id]: puzzle.categories.find((category) => category.id !== puzzle.cards[0]!.category)!.id };
        expect(gradeArgument(puzzle, { ...emptyArgumentAnswer(), placements: changed })).toBeLessThan(1);
      }
      const writing = lesson.exercises[4]!;
      if (writing.kind === 'reflection') {
        expect(wordCount(writing.model), lesson.id).toBeGreaterThanOrEqual(80);
        expect(writing.rubric.length, lesson.id).toBeGreaterThanOrEqual(4);
        expect(answerReady(writing, { ...emptyArgumentAnswer(), value: writing.model }), lesson.id).toBe(true);
        expect(gradeArgument(writing, { ...emptyArgumentAnswer(), value: writing.model })).toBeNull();
      }
    }
  });

  it('integreert vergelijking, feedback, literatuur en uitsluitend gerichte aanvullende media', () => {
    for (const lesson of fallacyLessons) {
      const id = lesson.id;
      expect(lessonCoreChecks[id]).toBeDefined();
      expect(argumentInquiries[id]).toBeDefined();
      expect(lessonIllustrations[id]!.variants.length).toBeGreaterThanOrEqual(2);
      expect(argumentSourceGuide[id]).toHaveLength(2);
      const pages = theoryPages(lesson);
      expect(pages.filter((page) => page.kind === 'inquiry')).toHaveLength(1);
      expect(pages.filter((page) => page.kind === 'section')).toHaveLength(3);
      expect(pages.filter((page) => page.kind === 'media')).toHaveLength(mediaForLesson(id).length);
      expect(mediaForLesson(id).every((item) => !item.minutes || item.minutes < 20), id).toBe(true);
    }
  });

  it('maakt het beslissende vraagverschil zichtbaar bij lastige verwante patronen', () => {
    const bySlug = (slug: string) => fallacySeeds.find((seed) => seed.slug === slug)!;
    for (const [a, b] of [['ad-hominem-belediging', 'ad-hominem-belang'], ['post-hoc', 'samenhang-oorzaak'], ['compositie', 'divisie'], ['gevolg-bevestigen', 'antecedent-ontkennen'], ['beroep-op-onwetendheid', 'bewijslast-omkeren']]) {
      expect(bySlug(a!).criticalQuestion).not.toBe(bySlug(b!).criticalQuestion);
      expect(bySlug(a!).sections[1]!.body).not.toBe(bySlug(b!).sections[1]!.body);
    }
  });
});
