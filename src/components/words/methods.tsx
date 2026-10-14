'use client';

import { BrainCircuit, CalendarClock, Coins, KeyRound, Link2, MessageSquareText, Mic, PenLine, Repeat2, Shuffle, Split, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Disclosure } from '@/components/ui/disclosure';

type Method = { icon: ReactNode; title: string; text: string; sources: string[] };

type ResearchSource = { label: string; title: string; url: string };
export const WORD_RESEARCH: Record<string, ResearchSource> = {
  pretesting: { label: 'Kornell, Hays & Bjork (2009)', title: 'Unsuccessful retrieval attempts enhance subsequent learning', url: 'https://doi.org/10.1037/a0015729' },
  retrieval: { label: 'Roediger & Karpicke (2006)', title: 'Test-enhanced learning: Taking memory tests improves long-term retention', url: 'https://doi.org/10.1111/j.1467-9280.2006.01693.x' },
  vocabularyRetrieval: { label: 'Karpicke & Roediger (2008)', title: 'The critical importance of retrieval for learning', url: 'https://doi.org/10.1126/science.1152408' },
  spacing: { label: 'Cepeda e.a. (2006)', title: 'Distributed practice in verbal recall tasks: A review and quantitative synthesis', url: 'https://doi.org/10.1037/0033-2909.132.3.354' },
  relearning: { label: 'Rawson & Dunlosky (2011)', title: 'Optimizing schedules of retrieval practice for durable and efficient learning: How much is enough?', url: 'https://doi.org/10.1037/a0023956' },
  generation: { label: 'Joe (1998)', title: 'What effects do text-based tasks promoting generation have on incidental vocabulary acquisition?', url: 'https://doi.org/10.1093/applin/19.3.357' },
  collocations: { label: 'Boers & Lindstromberg (2012)', title: 'Experimental and intervention studies on formulaic sequences in a second language', url: 'https://doi.org/10.1017/S0267190512000050' },
  involvement: { label: 'Laufer & Hulstijn (2001)', title: 'Incidental vocabulary acquisition in a second language: The construct of task-induced involvement', url: 'https://doi.org/10.1093/applin/22.1.1' },
  selfReference: { label: 'Rogers, Kuiper & Kirker (1977)', title: 'Self-reference and the encoding of personal information', url: 'https://doi.org/10.1037/0022-3514.35.9.677' },
  production: { label: 'MacLeod e.a. (2010)', title: 'The production effect: Delineation of a phenomenon', url: 'https://doi.org/10.1037/a0018785' },
  confidence: { label: 'Butterfield & Metcalfe (2001)', title: 'Errors committed with high confidence are hypercorrected', url: 'https://doi.org/10.1037/0278-7393.27.6.1491' },
  clustering: { label: 'Tinkham (1997)', title: 'The effects of semantic and thematic clustering on the learning of second language vocabulary', url: 'https://doi.org/10.1016/S0346-251X(97)00029-7' },
  review: { label: 'Dunlosky e.a. (2013)', title: 'Improving students’ learning with effective learning techniques', url: 'https://doi.org/10.1177/1529100612453266' },
  scheduler: { label: 'FSRS: uitleg van het algoritme', title: 'FSRS algorithm and estimated memory states; software documentation, not an efficacy trial of this app', url: 'https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm' },
};

const ICON = 'size-5';

/** De methodes achter een ronde, met het onderzoek waar ze op steunen. */
const METHODS: readonly Method[] = [
  {
    icon: <Sparkles aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Eerst betekenis verkennen',
    text: 'Je doet een poging vóór de uitleg. In onderzoek kan zo’n poging, ook als zij fout is, later leren ondersteunen wanneer je daarna de juiste informatie bestudeert. Alleen gokken is geen garantie: lees de feedback en controleer wat je verwarring veroorzaakte.',
    sources: ['pretesting'],
  },
  {
    icon: <KeyRound aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Zelf ophalen, niet herlezen',
    text: 'Je haalt de vorm uit je geheugen op. Onderzoek laat vaak betere latere herinnering zien bij ophalen dan bij alleen herlezen. De winst hangt onder meer af van feedback, oefenniveau en wanneer je opnieuw wordt getest.',
    sources: ['vocabularyRetrieval', 'retrieval'],
  },
  {
    icon: <PenLine aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Van betekenis naar woord',
    text: 'Je oefent ook van betekenis naar Nederlandse vorm, omdat je die richting nodig hebt bij zelf formuleren. Succes in een invulzin bewijst nog geen vrij gebruik in ieder gesprek; daarom zijn er ook context- en schrijfopdrachten.',
    sources: ['vocabularyRetrieval', 'involvement'],
  },
  {
    icon: <CalendarClock aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Herhalen met tussenpozen',
    text: 'Spreiding over tijd helpt het onthouden in veel studies. Een nieuw woord komt hier eerst de volgende dag terug. FSRS schat daarna een oefendatum op basis van je antwoorden en zelfbeoordelingen; het kent je werkelijke vergeetmoment niet. Na een fout wordt eerder herhaald.',
    sources: ['spacing', 'scheduler'],
  },
  {
    icon: <Repeat2 aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Voortgang over oefendagen',
    text: 'Herhaald oefenen op verschillende dagen kan duurzamere herinnering ondersteunen. De drie stipjes zijn hier een praktische voortgangsregel bij je oefenresultaten en zelfbeoordelingen. Drie dagen bewijzen geen volledige beheersing; blijf het woord in nieuwe situaties toepassen.',
    sources: ['relearning'],
  },
  {
    icon: <Shuffle aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Oefenen in verschillende contexten',
    text: 'De ronde wisselt tussen zinnen, situaties en gesprekken, met een beperkt aantal voorbeelden per woord. Die variatie geeft je gelegenheid betekenis en gebruik te vergelijken. Ze garandeert geen overdracht naar elk nieuw gesprek.',
    sources: ['generation', 'involvement'],
  },
  {
    icon: <Link2 aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Vaste combinaties',
    text: 'Je oefent gangbare combinaties zoals draagvlak creëren en een besluit nemen. Zelf aanvullen richt de aandacht op de vorm; lees ook waarom de combinatie past. Onderzoek naar woordcombinaties ondersteunt gerichte oefening, zonder één aanpak voor iedereen als beste aan te wijzen.',
    sources: ['collocations'],
  },
  {
    icon: <MessageSquareText aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Denken in situaties',
    text: 'Je vergelijkt woorden in een beschreven situatie en onderzoekt welk verschil beslissend is. Dat kan diepere verwerking vragen dan alleen een woord aanklikken. Leg voor jezelf uit waarom een alternatief hier minder goed past.',
    sources: ['involvement'],
  },
  {
    icon: <BrainCircuit aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Zelf gebruiken over je eigen werk',
    text: 'Je schrijft eerst zelf en vergelijkt daarna met voorbeelden en criteria. Een relevante persoonlijke context kan helpen bij verwerking, maar zelf schrijven is niet altijd de beste leerwijze. Jij controleert betekenis en gebruik; de app herkent doelwoorden en beoordeelt je inhoud niet automatisch.',
    sources: ['generation', 'selfReference'],
  },
  {
    icon: <Mic aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Hardop zeggen',
    text: 'Hardop uitspreken kan de latere herinnering verbeteren in bepaalde taken. Oefen ook de uitspraak en betekenis in een hele zin. Dit vervangt het later ophalen zonder kaart niet en is geen garantie voor beter onthouden.',
    sources: ['production'],
  },
  {
    icon: <Coins aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Hoe zeker ben je?',
    text: 'Je vergelijkt je zekerheid met de feedback. Sommige studies vinden dat fouten met hoge zekerheid beter worden gecorrigeerd na feedback. Dat is geen belofte van blijvende correctie: controleer later opnieuw of je het woord en het onderscheid kunt ophalen.',
    sources: ['confidence'],
  },
  {
    icon: <Split aria-hidden className={ICON} strokeWidth={2.5} />,
    title: 'Verwante nieuwe woorden spreiden',
    text: 'Bij de eerste aanbieding spreidt de app woorden die de bank als verwant markeert. Onderzoek vindt soms meer verwarring wanneer nieuwe woorden sterk op elkaar lijken. Dat geldt niet voor iedere leerling of taak; later kan expliciet vergelijken juist nuttig zijn.',
    sources: ['clustering'],
  },
];

export function Methods() {
  return (
    <section aria-labelledby="zo-leer-je" className="rounded-card border-2 border-line bg-surface p-5 shadow-slab sm:p-6">
      <h2 id="zo-leer-je" className="font-display text-title font-extrabold">
        Zo leer je hier
      </h2>
      <p className="mt-1 max-w-2xl text-body text-ink-muted">
        De oefeningen sluiten aan bij onderzoek naar ophalen, spreiding en betekenisvol verwerken. Moeite helpt vooral als de taak haalbaar is en je bruikbare feedback krijgt. Deze app heeft zelf geen onderzoek dat een bepaald leereffect bewijst.
      </p>
      <p className="mt-2 text-caption text-ink-muted">Overzicht van leeronderzoek: <a href={WORD_RESEARCH.review!.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">Dunlosky e.a. (2013)</a>. De resultaten gelden voor de onderzochte taken en groepen; de toepassing hier blijft een ontwerpkeuze.</p>
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
        <p className="mt-1.5 text-caption font-semibold text-ink-muted">{method.sources.map((id, index) => <span key={id}>{index > 0 && ' · '}<a href={WORD_RESEARCH[id]!.url} target="_blank" rel="noopener noreferrer" title={WORD_RESEARCH[id]!.title} className="underline underline-offset-4">{WORD_RESEARCH[id]!.label}</a></span>)}</p>
      </div>
    </li>
  );
}
