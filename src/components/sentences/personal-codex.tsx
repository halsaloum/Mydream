'use client';

import { ArrowLeft, BookOpen, Search } from 'lucide-react';
import { useState } from 'react';
import { sentenceLessons } from '@/content/sentences';
import { PageHeader } from '@/components/shell/app-shell';
import { ButtonLink } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/empty-state';
import { useHydrated } from '@/state/hydration';
import { useSentences } from '@/state/sentences';
import { sentenceLessonHref } from '@/lib/sentences/routes';
import { SentenceRuleCard } from './rules-view';

export function PersonalCodex() {
  const hydrated = useHydrated();
  const records = useSentences((state) => state.records);
  const sessions = useSentences((state) => state.sessions);
  const [query, setQuery] = useState('');
  const completed = sentenceLessons.filter((lesson) => records[lesson.id]);
  const search = query.trim().toLocaleLowerCase('nl-NL');
  const matching = completed.filter((lesson) => `${lesson.title} ${lesson.summary.points.join(' ')} ${lesson.rules.map((rule) => `${rule.when} ${rule.then} ${rule.nuance}`).join(' ')}`.toLocaleLowerCase('nl-NL').includes(search));
  return <div data-accent="navy">
    <PageHeader title="Mijn Zins-Codex" description="Je verzamelde spiekkaarten, regels en eigen toepassingen. Een kaart komt hier nadat je alle bouw- en reparatieopdrachten van de module hebt opgelost." action={<ButtonLink href="/zinnen" variant="secondary"><ArrowLeft aria-hidden className="size-4" />Naar het leerpad</ButtonLink>} />
    {!hydrated ? <PageSkeleton blocks={['h-28', 'h-36']} /> : completed.length === 0 ? <section className="rounded-card border-2 border-blue-line bg-blue-soft p-6"><BookOpen aria-hidden className="size-9 text-blue-ink" /><h2 className="mt-4 font-display text-title-sm font-bold">Je eerste kaart wacht op je.</h2><p className="mt-3 text-body leading-relaxed text-ink-soft">Begin bij de woordgroep en bouw de zin stap voor stap. De kaarten groeien mee met wat je hebt geoefend.</p><ButtonLink href={sentenceLessonHref(sentenceLessons[0]!.id)} className="mt-5">Begin met module 1</ButtonLink></section> : <>
      <label htmlFor="codex-zoeken" className="block text-small font-bold">Zoek in je verzamelde regels</label><div className="relative mt-2"><Search aria-hidden className="absolute top-4 left-4 size-5 text-ink-muted" /><input id="codex-zoeken" type="search" value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-12 w-full rounded-control border-2 border-line bg-white pr-4 pl-12 text-body" placeholder="Bijvoorbeeld: persoonsvorm of bijzin" /></div><p role="status" className="mt-3 text-small text-ink-muted">{matching.length} kaarten zichtbaar · {completed.length} van 12 verzameld</p>
      <div className="mt-7 space-y-10">{matching.map((lesson) => <section key={lesson.id} aria-labelledby={`codex-${lesson.id}`}><h2 id={`codex-${lesson.id}`} className="font-display text-title font-extrabold">{lesson.number}. {lesson.summary.title}</h2><ul className="mt-4 space-y-2 rounded-card border border-green-line bg-green-soft p-5">{lesson.summary.points.map((point) => <li key={point} className="text-body leading-relaxed text-green-ink">• {point}</li>)}</ul><div className="mt-4 space-y-3">{lesson.rules.map((rule) => <SentenceRuleCard key={rule.id} rule={rule} />)}</div>{sessions[lesson.id]?.transferText && <div className="mt-4 rounded-control border border-purple-line bg-purple-soft p-5"><h3 className="font-display font-bold text-purple-ink">Jouw toepassing</h3><p className="mt-3 whitespace-pre-wrap text-body leading-relaxed text-ink-soft">{sessions[lesson.id]!.transferText}</p></div>}<ButtonLink href={sentenceLessonHref(lesson.id)} variant="secondary" className="mt-4">Terug naar deze module</ButtonLink></section>)}</div>
      {matching.length === 0 && <p className="mt-6 rounded-card border border-line bg-surface p-5 text-ink-soft">Geen verzamelde kaart past bij deze zoekterm.</p>}
    </>}
  </div>;
}
