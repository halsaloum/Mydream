import { describe, expect, it } from 'vitest';
import { argumentLessons } from '@/content/argumentation';
import { argumentInquiries } from '@/content/argumentation/inquiries';
import { foundationForLesson } from '@/content/argumentation/foundations';
import { mediaForLesson } from '@/content/argumentation/lesson-media';
import { ARGUMENT_MAP_PRESETS } from './maps';
import { theoryPages } from './theory-pages';

describe('one-content-page reading order', () => {
  it('preserves every section, extra text, lab and separate media item for every lesson', () => {
    for (const lesson of argumentLessons) {
      const pages = theoryPages(lesson);
      const foundations = foundationForLesson(lesson.id);
      expect(pages.filter((page) => page.kind === 'concept').map((page) => page.foundation), lesson.id).toEqual(foundations);
      expect(pages.slice(0, foundations.length).every((page) => page.kind === 'concept'), lesson.id).toBe(true);
      expect(pages[foundations.length]?.kind, lesson.id).toBe('start');
      expect(pages.at(-1)?.kind, lesson.id).toBe('recap');
      expect(new Set(pages.map((page) => page.id)).size, lesson.id).toBe(pages.length);
      const sections = pages.filter((page) => page.kind === 'section');
      expect(sections.map((page) => page.sectionIndex), lesson.id).toEqual(lesson.sections.map((_, index) => index));
      expect(sections.map((page) => page.title), lesson.id).toEqual(lesson.sections.map((section) => section.title));
      expect(pages.filter((page) => page.kind === 'deepDive'), lesson.id).toHaveLength(1);
      expect(pages.find((page) => page.kind === 'deepDive')?.title).toBe(lesson.deepDive.title);
      expect(pages.filter((page) => page.kind === 'lab').length, lesson.id).toBe(lesson.lab ? 1 : 0);
      const mediaPages = pages.filter((page) => page.kind === 'media');
      expect(mediaPages.map((page) => page.item), lesson.id).toEqual(mediaForLesson(lesson.id));
      expect(mediaPages.every((page) => page.title === page.item.title), lesson.id).toBe(true);
    }
  });

  it('introduces an argument and its roles before the first warmup', () => {
    const firstLesson = argumentLessons[0]!;
    const first = theoryPages(firstLesson);
    expect(first.filter((page) => page.kind === 'concept').map((page) => page.title.toLocaleLowerCase('nl-NL'))).toEqual(['argument', 'conclusie', 'premisse', 'gevolgtrekking']);
    expect(first[foundationForLesson(firstLesson.id).length]?.kind).toBe('start');
  });

  it('places the learner’s reconstruction after the first explanation, before later content', () => {
    for (const lesson of argumentLessons.filter((item) => argumentInquiries[item.id])) {
      const pages = theoryPages(lesson);
      const firstSection = pages.findIndex((page) => page.kind === 'section');
      const inquiry = pages.findIndex((page) => page.kind === 'inquiry');
      expect(inquiry, lesson.id).toBe(firstSection + 1);
      expect(inquiry, lesson.id).toBeLessThan(pages.findIndex((page) => page.kind === 'deepDive'));
    }
  });

  it('places each relevant map case on its own page after the explanations', () => {
    const expected: Record<string, string[]> = {
      'basis-argumentstructuur': ['linked', 'convergent'],
      'basis-verborgen-premissen': ['serial'],
      'master-toulmin-bewijslast': ['toulmin'],
      'master-weerlegbare-argumenten': ['toulmin'],
    };
    for (const lesson of argumentLessons) {
      const pages = theoryPages(lesson);
      const workshops = pages.filter((page) => page.kind === 'workshop');
      expect(workshops.map((page) => page.presetId), lesson.id).toEqual(expected[lesson.id] ?? []);
      for (const page of workshops) {
        expect(ARGUMENT_MAP_PRESETS.some((preset) => preset.id === page.presetId)).toBe(true);
        expect(pages.indexOf(page)).toBeGreaterThan(pages.findLastIndex((item) => item.kind === 'section'));
        expect(pages.indexOf(page)).toBeLessThan(pages.findIndex((item) => item.kind === 'deepDive'));
        expect(pages.indexOf(page)).toBeLessThan(pages.findIndex((item) => item.kind === 'media'));
      }
    }
  });

  it('keeps page IDs stable when wording is improved and does not mutate the lesson', () => {
    const lesson = argumentLessons[0]!;
    const original = JSON.stringify(lesson);
    const edited = { ...lesson, sections: lesson.sections.map((section) => ({ ...section, title: `${section.title} · aangescherpt`, body: `${section.body}\nExtra zin.` })) };
    expect(theoryPages(edited).map((page) => page.id)).toEqual(theoryPages(lesson).map((page) => page.id));
    expect(JSON.stringify(lesson)).toBe(original);
  });
});
