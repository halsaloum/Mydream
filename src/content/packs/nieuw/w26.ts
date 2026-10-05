import type { LessonInput } from '../../schema';

export const LES_W26: LessonInput = {
  id: 'w26',
  stage: 'master',
  domain: 'morf',
  title: 'Nog te schrijven',
  skill: 'Woorden',
  icon: '?',
  steps: [{ kind: 'explain', id: 'uitleg', title: 'Nog te schrijven', panels: [{ text: 'Nog te schrijven.', quiz: { q: 'Klaar?', options: ['ja', 'nee'], answer: 'nee', why: 'Nog niet.' } }] }],
};
