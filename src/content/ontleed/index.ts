import { MORPHOLOGY_LESSONS } from './morphology';
import { SYNTAX_LESSONS } from './syntax';
import { SEMANTICS_LESSONS } from './semantics';
import { CAPSTONE_LESSONS } from './capstone';
import { ALINEA_LESSONS } from './alinea';
import { withProductionRetrieval } from './production';
import { withSectionTeaching } from './teaching';
import type { CoursePart, OntleedLesson } from './types';
export const PARTS: CoursePart[] = [
  { id:'basis',number:'01',title:'Het woord begrijpen',description:'Wat tel je als een woord? Ontdek vorm, familie en grammaticaal gedrag.',question:'Wat is eigenlijk een woord?',color:'green' },
  { id:'woordbouw',number:'02',title:'Woorden van binnen',description:'Onderzoek bouwstenen, woordfamilies, paradigma’s en nieuwe woorden.',question:'Hoe ontstaat een woord?',color:'purple' },
  { id:'zinsdelen',number:'03',title:'Wat hoort bij elkaar?',description:'Bewijs welke woorden een eenheid vormen en welke functie die heeft.',question:'Welke stukken reizen samen?',color:'blue' },
  { id:'zinsbouw',number:'04',title:'De zin in elkaar',description:'Bouw hoofd- en bijzinnen. Maak bewuste keuzes in volgorde en verwijzing.',question:'Waarom staat dit hier?',color:'yellow' },
  { id:'betekenis',number:'05',title:'Meer dan woorden',description:'Onderzoek wat je zegt, wat volgt en wat je lezer erbij denkt.',question:'Wat betekent je zin precies?',color:'pink' },
  { id:'volle-zin',number:'06',title:'De volle zin',description:'Combineer, toets en herschrijf. Gebruik alles in een zin van jezelf.',question:'Hoe maak je al die keuzes samen?',color:'green' },
  { id:'alinea',number:'07',title:'Van zin naar samenhang',description:'Bouw een alinea met een kern, heldere verwijzingen en een samenhangende gedachtegang.',question:'Hoe neem je de lezer mee?',color:'purple' },
];
export const COURSE_LEVELS: { id: string; number: string; title: string; description: string; parts: CoursePart['id'][] }[] = [
  { id: 'woord', number: '01', title: 'Woord', description: 'Van bouwsteen tot betekenis. Onderzoek hoe een woord werkt en welke vorm je nodig hebt.', parts: ['basis', 'woordbouw'] },
  { id: 'zin', number: '02', title: 'Zin', description: 'Van structuur tot bedoeling. Bouw, ontleed en herschrijf wat je precies wilt zeggen.', parts: ['zinsdelen', 'zinsbouw', 'betekenis', 'volle-zin'] },
  { id: 'alinea', number: '03', title: 'Alinea', description: 'Van losse zinnen tot een geheel. Verbind informatie, stuur de aandacht en herzie je eigen tekst.', parts: ['alinea'] },
];
export const ontleedLessons: OntleedLesson[] = [...MORPHOLOGY_LESSONS,...SYNTAX_LESSONS,...SEMANTICS_LESSONS,...CAPSTONE_LESSONS,...ALINEA_LESSONS].map(withSectionTeaching).map(withProductionRetrieval);
const byId = new Map(ontleedLessons.map(lesson=>[lesson.id,lesson]));
export function getOntleedLesson(id:string) { return byId.get(id); }
export function getPart(id:string) { return PARTS.find(part=>part.id===id); }
export function getLessonLevel(id:string) { const lesson = byId.get(id); return lesson && COURSE_LEVELS.find(level => (level.parts as string[]).includes(lesson.part)); }
export function nextOntleedLesson(id:string) { return ontleedLessons[ontleedLessons.findIndex(lesson=>lesson.id===id)+1]; }
/** The protected legacy argument lessons remain in the original catalog/player. */
export function isProtectedArgumentLesson(id:string) { return /^a(?:2\d|3[0-5])$/.test(id); }
