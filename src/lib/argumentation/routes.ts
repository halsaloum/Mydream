import type { Route } from 'next';

export function argumentLessonHref(id: string): Route {
  return `/argumentatie/les/${encodeURIComponent(id)}` as Route;
}
