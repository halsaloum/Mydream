import type { ArgumentInquiry } from './inquiries';
import type { LessonIllustrationEntry } from './illustrations';
import type { ArgumentLesson } from './types';

export type FallacyFamily = 'Gesprek en persoon' | 'Taal en aannames' | 'Gezag en gevoel' | 'Bewijs en oorzaken' | 'Logica en besluiten';
export type FallacySourceTopic = 'personal' | 'language' | 'presumption' | 'authority' | 'burden' | 'causality' | 'generalization' | 'formal' | 'probability' | 'decision';
export type FallacyQuestionSeed = {
  scenario: string;
  prompt: string;
  options: [{ text: string; feedback: string }, { text: string; feedback: string }, { text: string; feedback: string }];
  answer: 0 | 1 | 2;
};

/** Each entry has authored theory, contrasting cases and new transfer tasks. */
export type FallacySeed = {
  slug: string;
  name: string;
  aliases: string[];
  family: FallacyFamily;
  level: 'bachelor' | 'master';
  teaser: string;
  criticalQuestion: string;
  sourceTopic: FallacySourceTopic;
  sections: ArgumentLesson['sections'];
  deepDive: ArgumentLesson['deepDive'];
  starter: FallacyQuestionSeed & { bridge: string };
  inquiry: ArgumentInquiry;
  core: FallacyQuestionSeed;
  assessment: [FallacyQuestionSeed, FallacyQuestionSeed, FallacyQuestionSeed];
  puzzle: {
    scenario: string;
    prompt: string;
    categories: string[];
    cards: { text: string; category: number }[];
    explanation: string;
  };
  writing: { scenario: string; prompt: string; model: string; rubric: string[] };
  illustration: LessonIllustrationEntry;
  mediaIds?: string[];
};
