import type { LessonInput } from '../../schema';

export const LES_W25: LessonInput = {
  id: 'w25',
  stage: 'master',
  domain: 'morf',
  title: 'Nog te schrijven',
  skill: 'Woorden',
  icon: '?',
  steps: [{ kind: 'explain', id: 'uitleg', title: 'Nog te schrijven', panels: [{ text: 'Nog te schrijven.', quiz: { q: 'Klaar?', options: ['ja', 'nee'], answer: 'nee', why: 'Nog niet.' } }] }],
};
