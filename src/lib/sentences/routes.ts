import type { Route } from 'next';
export function sentenceLessonHref(id: string): Route {
  return `/zinnen/les/${encodeURIComponent(id)}` as Route;
}
