'use client';

import { BrainCircuit, CalendarClock, Coins, KeyRound, Link2, MessageSquareText, Mic, PenLine, Repeat2, Shuffle, Split, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Disclosure } from '@/components/ui/disclosure';

type Method = { icon: ReactNode; title: string; text: string; source: string };

const ICON = 'size-5';

/** De methodes achter een ronde, met het onderzoek waar ze op steunen. */
const METHODS: readonly Method[] = [
  {
    icon: <Sparkles aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Eerst raden',
    text: 'Je raadt de betekenis uit een zin voordat je de uitleg ziet. Ook een foute gok helpt: de uitleg daarna onthoud je beter.',
    source: 'Kornell, Hays & Bjork (2009); Potts & Shanks (2014)',
  },
  {
    icon: <KeyRound aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Zelf ophalen, niet herlezen',
    text: 'Je typt het woord zelf, vanuit de betekenis. Een woord ophalen uit je geheugen zet het veel vaster dan het nog eens lezen.',
    source: 'Karpicke & Roediger (2008); Roediger & Karpicke (2006)',
  },
  {
    icon: <PenLine aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Van betekenis naar woord',
    text: 'Je wilt de woorden zelf gebruiken. Daarom oefen je vooral de weg van betekenis of situatie naar het Nederlandse woord: wat je oefent, kun je straks.',
    source: 'Steinel, Hulstijn & Steinel (2007); Webb (2009)',
  },
  {
    icon: <CalendarClock aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Herhalen net voor je het vergeet',
    text: 'Een nieuw woord komt morgen terug, daarna na steeds langere tijd. Het schema (FSRS) rekent per woord uit wanneer je het bijna zou vergeten. Wat je niet meer wist, komt sneller terug.',
    source: 'Cepeda e.a. (2006, 2008); FSRS-5 van open-spaced-repetition',
  },
  {
    icon: <Repeat2 aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Drie dagen goed',
    text: 'Een woord zit pas echt als je het op drie verschillende dagen goed ophaalde. Daarom zie je bij elk woord drie stipjes.',
    source: 'Rawson & Dunlosky (2022), successive relearning',
  },
  {
    icon: <Shuffle aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Elke keer een andere zin',
    text: 'Je ziet een woord steeds in een nieuwe zin, situatie of gesprek. Zo leer je het gebruiken, niet één zin uit je hoofd.',
    source: 'Joe (1998); Frances, Martin & Duñabeitia (2020)',
  },
  {
    icon: <Link2 aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Vaste combinaties',
    text: 'Je leert het woord samen met de woorden die erbij horen: draagvlak creëren, een besluit nemen. Je maakt de combinatie zelf af in plaats van te kiezen uit foute combinaties.',
    source: 'Boers & Lindstromberg (2012); Webb & Kagimoto (2011); Boers e.a. (2014)',
  },
  {
    icon: <MessageSquareText aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Denken in situaties',
    text: 'In gesprekken en situaties van je werk kies je het woord dat precies past, tussen woorden die erop lijken. Vergelijken en kiezen maakt het woord scherp.',
    source: 'Laufer & Hulstijn (2001); Yanagisawa & Webb (2021)',
  },
  {
    icon: <BrainCircuit aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Zelf gebruiken over je eigen werk',
    text: 'Je schrijft je eigen zin, en aan het eind een korte tekst met een paar woorden samen. Daarna vergelijk je met een voorbeeld. Schrijven over jezelf en je werk onthoud je het best.',
    source: 'Zou (2017); Kim (2008); Rogers, Kuiper & Kirker (1977)',
  },
  {
    icon: <Mic aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Hardop zeggen',
    text: 'Op de woordkaart zeg je het woord en een zin hardop. Wat je zelf uitspreekt, onthoud je beter dan wat je alleen leest.',
    source: 'MacLeod e.a. (2010); Forrin & MacLeod (2018)',
  },
  {
    icon: <Coins aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Hoe zeker ben je?',
    text: 'Soms zet je in hoe zeker je bent. Een fout waar je zeker van was, verrast je. Juist zo’n fout verbeter je daarna blijvend.',
    source: 'Butterfield & Metcalfe (2001); Butler, Fazio & Marsh (2011)',
  },
  {
    icon: <Split aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Geen lijkende woorden op één dag',
    text: 'Woorden die op elkaar lijken (synoniemen, tegenstellingen) leer je op verschillende dagen. Samen geleerd verwar je ze. Het verschil oefen je later, als ze allebei zitten.',
    source: 'Tinkham (1993, 1997); Nakata & Suzuki (2019)',
  },
];

export function Methods() {
  return (
    <section aria-labelledby="zo-leer-je" className="rounded-card border-2 border-line bg-surface p-5 shadow-slab sm:p-6">
      <h2 id="zo-leer-je" className="font-display text-title font-extrabold">
        Zo leer je hier
      </h2>
      <p className="mt-1 max-w-2xl text-body text-ink-muted">
        Elke ronde gebruikt methodes die in onderzoek het best werken om woorden te onthouden én te gebruiken. Moeilijk voelt het soms, en dat is goed: wat moeite kost, blijft langer.
      </p>
      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {METHODS.slice(0, 4).map((method) => (
          <MethodItem key={method.title} method={method} />
        ))}
      </ul>
      <Disclosure summary="Alle methodes en het onderzoek" className="mt-4">
        <ul className="-ml-8 grid gap-3 md:grid-cols-2">
          {METHODS.slice(4).map((method) => (
            <MethodItem key={method.title} method={method} />
          ))}
        </ul>
      </Disclosure>
    </section>
  );
}

function MethodItem({ method }: { method: Method }) {
  return (
    <li className="flex gap-3 rounded-tile border-2 border-line bg-surface p-4" data-accent="teal">
      <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent-soft text-accent-ink">{method.icon}</span>
      <div className="min-w-0">
        <h3 className="font-display text-body font-extrabold text-ink">{method.title}</h3>
        <p className="mt-1 text-small leading-relaxed text-ink-soft">{method.text}</p>
        <p className="mt-1.5 text-caption font-semibold text-ink-muted">{method.source}</p>
      </div>
    </li>
  );
}
