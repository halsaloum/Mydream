import { ButtonLink } from '@/components/ui/button';

export default function ArgumentLessonNotFound() {
  return <main className="mx-auto max-w-xl px-gutter py-20"><h1 className="font-serif text-headline">Deze argumentatieles bestaat niet.</h1><p className="mt-4 mb-7 text-ink-muted">Kies een les uit het leerpad om verder te studeren.</p><ButtonLink href="/argumentatie">Naar het leerpad</ButtonLink></main>;
}
