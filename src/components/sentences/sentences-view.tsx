'use client';

import { ArrowRight, Blocks, BookOpen, Check, MoveRight, ScanLine } from 'lucide-react';
import { useState } from 'react';
import { sentenceLessons } from '@/content/sentences';
import { getLayer } from '@/content/catalog';
import { PageHeader } from '@/components/shell/app-shell';
import { ButtonLink } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { PageSkeleton } from '@/components/ui/empty-state';
import { sentenceLessonHref } from '@/lib/sentences/routes';
import { lessonProgress } from '@/lib/sentences/learning';
import { useHydrated } from '@/state/hydration';
import { useSentences } from '@/state/sentences';
import { cn } from '@/lib/cn';

const parts = [
  { title: '1. De bouwstenen', description: 'Zie welke woorden bij elkaar horen en welke rol een blok in de zin vervult.', from: 1, to: 4 },
  { title: '2. De zin in beweging', description: 'Verander perspectief en volgorde. Onderzoek wat meegaat en wat hetzelfde blijft.', from: 5, to: 8 },
  { title: '3. Verbinden en verfijnen', description: 'Verbind zinnen, verwijs precies en maak je bedoeling zichtbaar met leestekens.', from: 9, to: 12 },
];

export function SentencesView() {
  const hydrated = useHydrated();
  const records = useSentences((state) => state.records);
  const sessions = useSentences((state) => state.sessions);
  const [query, setQuery] = useState('');
  const next = sentenceLessons.find((lesson) => !records[lesson.id]) ?? sentenceLessons[0]!;
  const done = sentenceLessons.filter((lesson) => records[lesson.id]).length;
  const oldCount = getLayer('zinnen')?.lessons.length ?? 0;
  const filtered = sentenceLessons.filter((lesson) => `${lesson.title} ${lesson.teaser} ${lesson.objectives.join(' ')}`.toLocaleLowerCase('nl-NL').includes(query.toLocaleLowerCase('nl-NL').trim()));
  return <div className="space-y-9" data-accent="navy">
    <PageHeader title="Zinnen" description="Woordgroepen, enkelvoudige en samengestelde zinnen vormen samen één afdeling. Van je eerste bouwblok tot een zin die precies zegt wat je bedoelt." />
    <section className="grid gap-6 rounded-sheet border-2 border-blue-line bg-blue-soft/60 p-5 sm:p-8 lg:grid-cols-[1.3fr_1fr]" aria-labelledby="zinnen-start">
      <div><p className="text-caption font-bold tracking-wider text-blue-ink uppercase">De Nederlandse Zins-Codex</p><h2 id="zinnen-start" className="mt-3 font-display text-title font-extrabold">Je leert door de zin zelf te veranderen.</h2><p className="mt-4 text-body leading-relaxed text-ink-soft">Begin zonder voorkennis. Eerst zie je de blokken en verbindingen, daarna maak je ze zelf. In de laatste ronde repareer je gewone tekst zonder hulplijnen.</p><ButtonLink href={sentenceLessonHref(next.id)} className="mt-5">{done === 12 ? 'Herhaal de eerste module' : sessions[next.id] ? 'Verder met jouw module' : 'Begin met jouw eerste module'}<ArrowRight aria-hidden className="size-4" /></ButtonLink></div>
      <div className="space-y-4 rounded-card border border-blue-line bg-white p-5"><p className="font-display text-body font-bold">Jouw leerpad</p><p className="text-small text-ink-muted">{done} van 12 modules afgerond · 120 bouw- en reparatieopdrachten</p><ProgressBar value={done} max={12} label="Voortgang van de Zins-Codex" /><ul className="space-y-3 text-small text-ink-soft"><li className="flex gap-2"><Blocks aria-hidden className="size-5 shrink-0 text-blue-ink" />Bouw en verschuif volledige zinsdelen.</li><li className="flex gap-2"><MoveRight aria-hidden className="size-5 shrink-0 text-purple-ink" />Leg verbanden en verander de constructie.</li><li className="flex gap-2"><ScanLine aria-hidden className="size-5 shrink-0 text-orange-ink" />Vind het foutpunt en schrijf de reparatie zelf.</li></ul><ButtonLink href="/zinnen/codex" variant="secondary" size="sm" className="w-full"><BookOpen aria-hidden className="size-4" />Mijn persoonlijke Codex</ButtonLink></div>
    </section>
    <section aria-labelledby="module-zoeken"><h2 id="module-zoeken" className="font-display text-title-sm font-bold">Kies je module</h2><label htmlFor="zinnen-zoeken" className="mt-4 block text-small font-semibold">Zoek op onderwerp</label><input id="zinnen-zoeken" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Bijvoorbeeld: onderwerp, verwijzen of komma" className="mt-2 min-h-12 w-full rounded-control border-2 border-line bg-white px-4 text-body outline-offset-4 focus:border-blue-line" /><p role="status" className="mt-2 text-caption text-ink-muted">{filtered.length} van 12 modules</p></section>
    {!hydrated ? <PageSkeleton blocks={['h-28', 'h-28', 'h-28']} /> : filtered.length === 0 ? <p className="rounded-card border border-line bg-surface p-6 text-ink-soft">Geen module past bij je zoekterm. Probeer bijvoorbeeld ‘zin’ of ‘werkwoord’.</p> : parts.map((part) => {
      const lessons = filtered.filter((lesson) => lesson.number >= part.from && lesson.number <= part.to);
      if (!lessons.length) return null;
      return <section key={part.title} aria-labelledby={`deel-${part.from}`}><h2 id={`deel-${part.from}`} className="font-display text-title font-extrabold">{part.title}</h2><p className="mt-2 max-w-3xl text-body leading-relaxed text-ink-soft">{part.description}</p><ol className="mt-5 grid gap-4 md:grid-cols-2">{lessons.map((lesson) => {
        const record = records[lesson.id];
        const session = sessions[lesson.id];
        const progress = lessonProgress(lesson, session?.answers ?? {});
        return <li key={lesson.id} className={cn('flex flex-col rounded-card border-2 bg-white p-5 shadow-slab-sm', record ? 'border-green-line' : lesson.id === next.id ? 'border-blue-line' : 'border-line')}><div className="flex items-start gap-3"><span aria-hidden className={cn('grid size-10 shrink-0 place-items-center rounded-control font-display font-extrabold', record ? 'bg-green-soft text-green-ink' : 'bg-blue-soft text-blue-ink')}>{record ? <Check className="size-5" /> : lesson.number}</span><div><p className="text-caption font-bold text-ink-muted">Module {lesson.number} · ≈ {lesson.minutes} min</p><h3 className="mt-1 font-display text-title-sm font-bold leading-snug">{lesson.title}</h3></div></div><p className="mt-3 flex-1 text-small leading-relaxed text-ink-soft">{lesson.teaser}</p><p className="mt-4 text-caption font-semibold text-ink-muted">{record ? 'Afgerond · spiekkaart bewaard' : `${progress.solved} van 10 opdrachten opgelost`}</p><ProgressBar value={record ? 10 : progress.solved} max={10} size="sm" label={`Voortgang: ${lesson.title}`} /><ButtonLink href={sentenceLessonHref(lesson.id)} variant={lesson.id === next.id ? 'accent' : 'secondary'} className="mt-4 w-full">{record ? 'Bekijk en herhaal' : session ? 'Verder oefenen' : 'Open de module'}<span className="sr-only">: {lesson.title}</span><ArrowRight aria-hidden className="size-4" /></ButtonLink></li>;
      })}</ol></section>;
    })}
    <section aria-labelledby="bestaande-zinlessen" className="rounded-card border-2 border-line bg-surface p-5 sm:p-6"><h2 id="bestaande-zinlessen" className="font-display text-title-sm font-bold">Meer oefenen en verdiepen</h2><p className="mt-3 text-body leading-relaxed text-ink-soft">De {oldCount} eerdere lessen over woordgroepen en zinsbouw staan samen in de bibliotheek. Je afgeronde lessen en lopende opdrachten blijven bewaard. Gebruik ze voor extra oefening en verdieping naast dit leerpad.</p><ButtonLink href="/lessen?niveau=zinnen" variant="secondary" className="mt-4">Bekijk de {oldCount} aanvullende lessen<ArrowRight aria-hidden className="size-4" /></ButtonLink></section>
  </div>;
}
