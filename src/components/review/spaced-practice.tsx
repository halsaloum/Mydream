'use client';

import { ArrowRight, CalendarClock } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { LessonPlayer, type PlayerMeta } from '@/components/player/lesson-player';
import type { PlayerController } from '@/components/player/use-session';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState, PageSkeleton } from '@/components/ui/empty-state';
import { Disclosure } from '@/components/ui/disclosure';
import { dayKey } from '@/lib/dates';
import { lookupPracticeStep } from '@/lib/practice/catalog';
import { completedPracticeTopics, duePracticeTopics, PRACTICE_BATCH } from '@/lib/practice/schedule';
import { useArgumentation } from '@/state/argumentation';
import { useHydrated } from '@/state/hydration';
import { usePractice, usePracticeDueCount } from '@/state/practice';
import { useProgress } from '@/state/progress';
import { useSentences } from '@/state/sentences';
import type { SessionAction } from '@/engine/session';

export function SpacedPracticeReminder() {
  const hydrated = useHydrated();
  const count = usePracticeDueCount();
  const running = usePractice((state) => state.session !== null && state.session.phase !== 'done');
  if (!hydrated || (!count && !running)) return null;
  return <section aria-label="Tijd om eerdere lessen op te halen" className="flex flex-col gap-3 rounded-card border-2 border-blue-line bg-blue-soft p-5 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-body font-semibold text-blue-ink">{running ? 'Je zelfstandige kennischeck staat nog open.' : `${count} eerder geleerde onderwerpen staan klaar om op te halen.`}</p>
    <ButtonLink href="/herhalen" variant="secondary">{running ? 'Ga verder met ophalen' : 'Bekijk mijn kennischeck'}<ArrowRight aria-hidden className="size-4" /></ButtonLink>
  </section>;
}

export function SpacedPracticeCard() {
  const hydrated = useHydrated();
  const lessons = useProgress((state) => state.lessons);
  const argumentsRecords = useArgumentation((state) => state.records);
  const sentenceRecords = useSentences((state) => state.records);
  const records = usePractice((state) => state.records);
  const session = usePractice((state) => state.session);
  if (!hydrated) return null;
  const topics = completedPracticeTopics({ lessons }, { records: argumentsRecords }, { records: sentenceRecords }, records);
  const due = duePracticeTopics(topics);
  const running = session && session.phase !== 'done';
  const upcoming = topics.filter((topic) => topic.schedule.due > dayKey()).sort((a, b) => a.schedule.due.localeCompare(b.schedule.due))[0];
  return <section aria-labelledby="gespreid-ophalen" className="mb-8 rounded-card border-2 border-blue-line bg-blue-soft p-5 sm:p-6">
    <h2 id="gespreid-ophalen" className="flex items-center gap-2 font-display text-title-sm font-extrabold text-blue-ink"><CalendarClock aria-hidden className="size-5" />Wat weet je nog zonder uitleg?</h2>
    <p className="mt-3 max-w-3xl text-body leading-relaxed text-ink-soft">Haal eerder geleerde stof op vóór je de uitleg terugziet. Korte checks over schrijven, Zinnen en argumentatie komen op latere dagen terug. Na je antwoord krijg je uitleg; bij een fout volgt sneller een nieuwe check.</p>
    <p role="status" className="mt-3 text-small font-semibold text-blue-ink">{running ? 'Je kennischeck is nog bezig.' : due.length ? `${due.length} ${due.length === 1 ? 'leerpunt' : 'leerpunten'} klaar · deze ronde maximaal ${PRACTICE_BATCH}` : upcoming ? `Volgende kennischeck: ${new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' }).format(new Date(`${upcoming.schedule.due}T12:00:00`))}.` : 'Rond eerst een les af. Daarna verschijnt hier je eerste kennischeck.'}</p>
    {(running || due.length > 0) && <ButtonLink href="/herhalen/kennis" onClick={() => { if (!running) usePractice.getState().discard(); }} className="mt-4">{running ? 'Verder met mijn kennischeck' : 'Start mijn kennischeck'}<ArrowRight aria-hidden className="size-4" /></ButtonLink>}
    <p className="mt-4 text-caption leading-relaxed text-ink-muted">Een check oefent enkele leerpunten en toetst geen volledige lesbeheersing. Goed ophalen op verschillende dagen telt zwaarder dan direct opnieuw antwoorden. De woordenronde heeft daarnaast haar eigen herhaalschema.</p>
    <Disclosure summary="Onderzoek achter deze aanpak" className="mt-4">
      <p className="text-small leading-relaxed text-ink-soft">Onderzoek ondersteunt actief ophalen en herhaling met tussenpozen. Daarom probeer je eerst zelf een antwoord te maken en vergelijk je daarna met de uitleg. De vragen wisselen, zodat je ook een andere toepassing moet herkennen. Het interval wordt langer na goede antwoorden op verschillende dagen en korter bij fouten.</p>
      <p className="mt-3 text-small leading-relaxed text-ink-soft">De precieze intervallen zijn een praktische keuze. Deze app is niet onderzocht in een leerexperiment; een rondescore bewijst geen blijvende beheersing of kwaliteit van je eigen tekst.</p>
      <ul className="mt-3 space-y-2 text-small text-blue-ink">
        <li><a href="https://doi.org/10.1177/1529100612453266" target="_blank" rel="noreferrer" className="underline underline-offset-4">Dunlosky e.a. (2013): overzicht van leertechnieken</a></li>
        <li><a href="https://doi.org/10.1037/0033-2909.132.3.354" target="_blank" rel="noreferrer" className="underline underline-offset-4">Cepeda e.a. (2006): gespreide oefening</a></li>
        <li><a href="https://doi.org/10.3102/0034654307313795" target="_blank" rel="noreferrer" className="underline underline-offset-4">Shute (2008): gerichte leerfeedback</a></li>
      </ul>
    </Disclosure>
  </section>;
}

export function SpacedPracticeRoute() {
  const hydrated = useHydrated();
  const session = usePractice((state) => state.session);
  useEffect(() => { if (hydrated) usePractice.getState().start(); }, [hydrated]);
  const dispatch = useCallback((action: SessionAction) => usePractice.getState().dispatch(action), []);
  const discard = useCallback(() => usePractice.getState().discard(), []);
  const restart = useCallback(() => { usePractice.getState().discard(); usePractice.getState().start(); }, []);
  if (!hydrated) return <PageSkeleton blocks={['h-16', 'h-80']} />;
  if (!session) return <main id="inhoud" className="mx-auto grid min-h-dvh max-w-xl place-items-center px-gutter"><EmptyState title="Je hoeft nu niets op te halen" mood="idle" action={<ButtonLink href="/herhalen">Naar herhalen</ButtonLink>}>Je volgende kennischeck komt op een latere dag. Je kunt ondertussen een les oefenen.</EmptyState></main>;
  const controller: PlayerController = { session, dispatch, lookup: lookupPracticeStep, counts: false, discard, restart };
  const meta: PlayerMeta = {
    mode: 'review', title: 'Zelfstandig ophalen', context: 'Gespreide kennischeck', accent: 'blue', independent: true,
    exit: { href: '/herhalen', label: 'Kennischeck sluiten (je voortgang is bewaard)' },
    finish: { title: 'Kennischeck afgerond', context: 'De score gaat over deze opdrachten, niet over volledige lesbeheersing.', learned: [], primary: { href: '/herhalen', label: 'Bekijk mijn volgende herhaling' }, secondary: { href: '/', label: 'Naar Leren' }, again: false },
  };
  return <LessonPlayer controller={controller} meta={meta} />;
}
