import { argumentLessons, argumentModules } from './curriculum';
export { argumentLessons, argumentModules } from './curriculum';
export { argumentSources } from './sources';
export const argumentLessonById = new Map(argumentLessons.map((lesson) => [lesson.id, lesson]));
export const argumentModuleById = new Map(argumentModules.map((module) => [module.id, module]));
