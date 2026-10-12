import { describe, expect, it } from 'vitest';
import { argumentLessons } from '@/content/argumentation';
import { lessonCoreChecks } from '@/content/argumentation/core-checks';
import { argumentInquiries } from '@/content/argumentation/inquiries';
import { lessonScaffolds } from '@/content/argumentation/scaffolds';
import type { ArgumentLesson } from '@/content/argumentation/types';
import type { ArgumentSession } from '@/state/argumentation';
import { emptyArgumentAnswer } from './learning';
import { ARGUMENT_MAP_PRESETS } from './maps';
import { readingText } from './reading-text';
import { theoryPages, type TheoryPage } from './theory-pages';

const firstLesson = argumentLessons.find((lesson) => lesson.id === 'basis-standpunt-en-reden')!;
const session = (patch: Partial<ArgumentSession> = {}): ArgumentSession => ({
  signature: 'reading-test', cursor: 0, resumeCursor: 1, theoryPage: 0,
  startedAt: '2026-10-12T12:00:00.000Z', answers: {}, firstTry: {}, firstConfidence: {}, finished: false,
  ...patch,
});
const answerSession = (key: string, value: string, checked = false) => session({
  answers: { [key]: { ...emptyArgumentAnswer(), value, checked, reasoning: 'MIJN PRIVÉANALYSE' } },
});
function currentPage(lesson: ArgumentLesson, kind: TheoryPage['kind'], sectionIndex?: number): TheoryPage {
  const page = theoryPages(lesson).find((item) => item.kind === kind && (sectionIndex === undefined || item.kind === 'section' && item.sectionIndex === sectionIndex));
  if (!page) throw new Error(`Missing ${kind} page in ${lesson.id}`);
  return page;
}

describe('reading only the current lesson page', () => {
  it('reads one concept and only the feedback attached to the selected visible choice', () => {
    const page = currentPage(firstLesson, 'concept');
    if (page.kind !== 'concept') throw new Error('Expected a concept');
    const concept = page.foundation;
    const before = readingText(firstLesson, page, session());
    expect(before).toContain(concept.body);
    expect(before).toContain(concept.example);
    expect(before).toContain(concept.scenario);
    expect(before).toContain(concept.question);
    for (const option of concept.options) {
      expect(before).toContain(option.text);
      expect(before).not.toContain(option.id);
      expect(before).not.toContain(option.feedback);
    }
    const chosen = concept.options.find((option) => option.id !== concept.answer)!;
    const after = readingText(firstLesson, page, answerSession(`foundation-${concept.id}`, chosen.id));
    expect(after).toContain(chosen.feedback);
    for (const other of concept.options.filter((option) => option.id !== chosen.id)) expect(after).not.toContain(other.feedback);
    expect(after).not.toContain('MIJN PRIVÉANALYSE');
    expect(after).not.toContain(firstLesson.sections[0]!.body);
    expect(after).not.toContain(firstLesson.deepDive.body);
  });

  it('reveals the warmup bridge only with the correct selected option and includes the objectives', () => {
    const page = currentPage(firstLesson, 'start');
    const scaffold = lessonScaffolds[firstLesson.id]!;
    const incorrect = scaffold.options.find((option) => option.id !== scaffold.answer)!;
    const before = readingText(firstLesson, page, session());
    expect(before).toContain(scaffold.context);
    expect(before).toContain(scaffold.question);
    expect(before).not.toContain(scaffold.bridge);
    const wrong = readingText(firstLesson, page, answerSession(`warmup-${firstLesson.id}`, incorrect.id));
    expect(wrong).toContain(incorrect.feedback);
    expect(wrong).not.toContain(scaffold.bridge);
    const right = readingText(firstLesson, page, answerSession(`warmup-${firstLesson.id}`, scaffold.answer));
    expect(right).toContain(scaffold.bridge);
    for (const objective of firstLesson.objectives) expect(right).toContain(objective);
    expect(right).not.toContain(firstLesson.sections[0]!.body);
  });

  it('keeps the first worked example on the inquiry page and hides its model until checked', () => {
    const lesson: ArgumentLesson = {
      ...firstLesson,
      sections: firstLesson.sections.map((section, index) => ({ ...section, example: `WERKVOORBEELD ${index}` })),
    };
    const inquiry = argumentInquiries[lesson.id]!;
    const inquiryPage = currentPage(lesson, 'inquiry');
    const firstSection = currentPage(lesson, 'section', 0);
    const writing = answerSession(`inquiry-${lesson.id}`, 'MIJN PRIVÉHERZIENING');
    const before = readingText(lesson, inquiryPage, writing);
    expect(before).toContain(inquiry.scenario);
    expect(before).toContain(inquiry.prompt);
    expect(before).not.toContain(inquiry.model);
    expect(before).not.toContain(inquiry.followUp);
    expect(before).not.toContain('WERKVOORBEELD 0');
    const checked = answerSession(`inquiry-${lesson.id}`, 'MIJN PRIVÉHERZIENING', true);
    const after = readingText(lesson, inquiryPage, checked);
    expect(after).toContain(inquiry.model);
    expect(after).toContain(inquiry.followUp);
    expect(after).toContain('WERKVOORBEELD 0');
    expect(after).not.toContain('MIJN PRIVÉHERZIENING');
    expect(after).not.toContain('MIJN PRIVÉANALYSE');
    expect(after).not.toContain('WERKVOORBEELD 1');
    expect(readingText(lesson, firstSection, checked)).not.toContain('WERKVOORBEELD 0');
    expect(readingText(lesson, firstSection, session({ finished: true }))).not.toContain('WERKVOORBEELD 0');
    expect(readingText(lesson, inquiryPage, session({ finished: true }))).toContain(inquiry.model);
  });

  it('withholds the second worked example after an incorrect core choice, but speaks the chosen feedback', () => {
    const lesson: ArgumentLesson = {
      ...firstLesson,
      sections: firstLesson.sections.map((section, index) => ({ ...section, example: `GELEIDE UITWERKING ${index}` })),
    };
    const page = currentPage(lesson, 'section', 1);
    const check = lessonCoreChecks[lesson.id]!;
    const incorrect = check.options.find((option) => option.id !== check.answer)!;
    const before = readingText(lesson, page, session());
    expect(before).toContain(check.scenario);
    expect(before).toContain(check.prompt);
    expect(before).not.toContain('GELEIDE UITWERKING 1');
    const wrong = readingText(lesson, page, answerSession(`core-${lesson.id}`, incorrect.id, true));
    expect(wrong).toContain(incorrect.feedback);
    expect(wrong).not.toContain('GELEIDE UITWERKING 1');
    const right = readingText(lesson, page, answerSession(`core-${lesson.id}`, check.answer));
    expect(right).toContain('GELEIDE UITWERKING 1');
    expect(right).not.toContain('GELEIDE UITWERKING 0');
    expect(right).not.toContain(lesson.deepDive.body);
    expect(readingText(lesson, page, session({ finished: true }))).toContain('GELEIDE UITWERKING 1');
  });

  it('reads a current section example normally when no inquiry or core check governs it', () => {
    const lesson: ArgumentLesson = { ...firstLesson, id: 'standalone-reading-test' };
    const text = readingText(lesson, currentPage(lesson, 'section', 0), session());
    expect(text).toContain(lesson.sections[0]!.body);
    expect(text).toContain(lesson.sections[0]!.example);
    expect(text).toContain(lesson.sections[0]!.takeaway);
    expect(text).not.toContain(lesson.sections[1]!.body);
  });

  it('never reads exercise answers, reflection models or private writing on any lesson page', () => {
    for (const original of argumentLessons) {
      const lesson: ArgumentLesson = {
        ...original,
        exercises: [{ id: 'private-reflection', kind: 'reflection', prompt: 'LATER TE OEFENEN VRAAG', explanation: 'LATER TE LEZEN FEEDBACK', model: 'VERBORGEN REFLECTIEMODEL', rubric: ['RUBRIEK'], minWords: 5 }],
      };
      const privateAnswer = { ...emptyArgumentAnswer(), value: 'PRIVÉVELD', reasoning: 'PRIVÉANALYSE', placements: { PRIVATE: 'PRIVÉKAART' }, rubric: { PRIVATE: true } };
      const keys = ['private-reflection', `warmup-${lesson.id}`, `core-${lesson.id}`, `inquiry-${lesson.id}`, ...theoryPages(lesson).flatMap((page) => page.kind === 'concept' ? [`foundation-${page.foundation.id}`] : [])];
      const stored = session({ answers: Object.fromEntries(keys.map((key) => [key, { ...privateAnswer }])) });
      const snapshot = JSON.stringify({ lesson, stored });
      for (const page of theoryPages(lesson)) {
        const text = readingText(lesson, page, stored);
        expect(text, `${lesson.id}:${page.id}`).not.toMatch(/PRIVÉ|VERBORGEN REFLECTIEMODEL|LATER TE OEFENEN VRAAG|LATER TE LEZEN FEEDBACK/);
      }
      expect(JSON.stringify({ lesson, stored })).toBe(snapshot);
    }
  });

  it('keeps the full authored deep dive, paragraph breaks, digits and formula notation', () => {
    const body = 'Als U → (B ∧ M) en ¬B, dan ¬U.\n\n90/585 ≈ 15,4%; de sensitiviteit is 90%.';
    const lesson: ArgumentLesson = { ...firstLesson, deepDive: { title: 'Dieper kijken', body } };
    const page = currentPage(lesson, 'deepDive');
    expect(readingText(lesson, page, session())).toBe(`Dieper kijken\n\n${body}`);
  });

  it('reads media watch prompts without video IDs, URLs or other pages', () => {
    const page = theoryPages(firstLesson).find((item) => item.kind === 'media');
    if (!page || page.kind !== 'media') throw new Error('Expected first-lesson media');
    const text = readingText(firstLesson, page, session());
    expect(text).toContain(page.item.provider);
    expect(text).toContain(page.item.description);
    expect(text).toContain(page.item.watchFor);
    expect(text).toContain(page.item.question);
    expect(text).not.toContain(page.item.url);
    if (page.item.youtubeId) expect(text).not.toContain(page.item.youtubeId);
    expect(text).not.toContain(firstLesson.deepDive.body);
  });

  it('limits maps and labs to the selected provider introduction, and recap to the takeaways', () => {
    const mapLesson = argumentLessons.find((lesson) => lesson.id === 'basis-argumentstructuur')!;
    const mapPage = currentPage(mapLesson, 'workshop');
    if (mapPage.kind !== 'workshop') throw new Error('Expected a workshop');
    const preset = ARGUMENT_MAP_PRESETS.find((item) => item.id === mapPage.presetId)!;
    const mapText = readingText(mapLesson, mapPage, session());
    expect(mapText).toContain(preset.description);
    expect(mapText).toContain(preset.investigation);
    for (const node of preset.nodes) expect(mapText).not.toContain(node.text);
    const bayes = argumentLessons.find((lesson) => lesson.lab === 'bayes')!;
    const labText = readingText(bayes, currentPage(bayes, 'lab'), session());
    expect(labText).toContain('Van een signaal naar een conclusie');
    expect(labText).toContain('Een spamfilter markeert een e-mail.');
    expect(labText).not.toContain('81,8%');
    const recap = readingText(firstLesson, currentPage(firstLesson, 'recap'), session());
    for (const section of firstLesson.sections) {
      expect(recap).toContain(section.takeaway);
      expect(recap).not.toContain(section.body);
      expect(recap).not.toContain(section.example);
    }
  });
});
