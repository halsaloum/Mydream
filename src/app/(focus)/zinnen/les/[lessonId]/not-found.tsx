import { ButtonLink } from '@/components/ui/button';
export default function MissingSentenceLesson() {
  return <main className="mx-auto max-w-2xl px-gutter py-16"><h1 className="font-display text-headline font-bold">Deze zinles bestaat niet.</h1><p className="mt-4 text-body text-ink-soft">Kies een van de twaalf modules in de afdeling Zinnen.</p><ButtonLink href="/zinnen" className="mt-6">Naar Zinnen</ButtonLink></main>;
}
