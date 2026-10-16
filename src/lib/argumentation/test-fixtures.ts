import type { ArgumentLesson, ChoiceExercise, ReflectionExercise, SortExercise } from '@/content/argumentation/types';

export const choice: ChoiceExercise = { id: 'choice', kind: 'choice', prompt: 'Toets de gevolgtrekking.', explanation: 'De premisse draagt de conclusie.', options: [{ id: 'a', text: 'A', feedback: 'A' }, { id: 'b', text: 'B', feedback: 'B' }], answer: 'b' };
export const map: SortExercise = { id: 'map', kind: 'map', prompt: 'Reconstrueer.', explanation: 'Twee rollen.', categories: [{ id: 'premise', label: 'Premisse' }, { id: 'conclusion', label: 'Conclusie' }], cards: [{ id: '1', text: 'Reden', category: 'premise' }, { id: '2', text: 'Standpunt', category: 'conclusion' }] };
export const reflection: ReflectionExercise = { id: 'reflection', kind: 'reflection', prompt: 'Analyseer.', explanation: 'Zelfcontrole.', minWords: 3, model: 'Een beargumenteerde analyse.', rubric: ['Premisse juist gereconstrueerd.'] };
export const testArgumentLesson: ArgumentLesson = { id: 'test-lesson', moduleId: 'basis', title: 'Een testles', teaser: 'Analyse.', minutes: 30, objectives: ['Reconstrueren'], sections: [], deepDive: { title: 'Verdieping', body: 'Inhoud' }, sourceIds: [], exercises: [choice, map, reflection] };

