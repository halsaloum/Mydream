/** Optional enrichment. Lessons and completion never depend on watching a video. */
export type LessonVideo = {
  /** The original, eleven-character YouTube video ID. */
  id: string;
  title: string;
  creator: string;
  description: string;
  focusQuestion: string;
  watchUrl: string;
};

/** Titles and creators verified against YouTube; see docs/rebuild/media-sources.md. */
export const LESSON_VIDEOS: LessonVideo[] = [
  {
    id: 'WV7uaqUGuzI',
    title: 'Inleiding in de Morfologie (2/10): Woordvorming',
    creator: 'Marc van Oostendorp',
    description: 'Verdiep je in de vraag welke bestaande woorden als basis voor nieuwe woorden kunnen dienen.',
    focusQuestion: 'Welke eigenschappen van de basis kunnen bepalen of een nieuw woord mogelijk is?',
    watchUrl: 'https://www.youtube.com/watch?v=WV7uaqUGuzI',
  },
  {
    id: 'b4GZ1yaj5JA',
    title: 'Woordsoorten: uitleg van lidwoord, bijvoeglijk naamwoord, zelfstandig naamwoord',
    creator: 'VantaalnaarNederlands',
    description: 'Fris drie woordsoorten op die vaak samen in een naamwoordgroep voorkomen.',
    focusQuestion: 'Welke aanwijzingen helpen je een lidwoord, bijvoeglijk naamwoord en zelfstandig naamwoord te onderscheiden?',
    watchUrl: 'https://www.youtube.com/watch?v=b4GZ1yaj5JA',
  },
  {
    id: '5A3Efwb9xqE',
    title: 'onderwerp en persoonsvorm',
    creator: 'de buro-juf',
    description: 'Een toegankelijke herhaling van onderwerp en persoonsvorm als vertrekpunt voor je eigen zinsanalyse.',
    focusQuestion: 'Hoe kun je jouw gevonden onderwerp controleren door het getal van de zin te veranderen?',
    watchUrl: 'https://www.youtube.com/watch?v=5A3Efwb9xqE',
  },
  {
    id: '1OQwWpUH240',
    title: 'Formuleerfouten: incongruentie (geen congruentie)',
    creator: 'Arnoud Kuijpers',
    description: 'Onderzoek de overeenkomst tussen onderwerp en persoonsvorm. Verbind die met de kern van de volledige naamwoordgroep.',
    focusQuestion: 'Waarom schrijf je ‘De doos met de nieuwe labels staat klaar’, ook al is labels meervoud?',
    watchUrl: 'https://www.youtube.com/watch?v=1OQwWpUH240',
  },
  {
    id: 'nKhbGj7u3jk',
    title: 'Woordvolgorde 1',
    creator: 'Lest Best',
    description: 'Bekijk waar het onderwerp en de werkwoorden staan in eenvoudige Nederlandse zinnen.',
    focusQuestion: 'Wat gebeurt er met de plaats van het onderwerp als je een hoofdzin met morgen begint?',
    watchUrl: 'https://www.youtube.com/watch?v=nKhbGj7u3jk',
  },
  {
    id: 'l_InNYyGmwk',
    title: 'Grammatica samengestelde zinnen - hoofdzinnen & bijzinnen',
    creator: 'Ruud Hermans',
    description: 'Vergelijk hoofd- en bijzinnen en gebruik hun opbouw om samengestelde zinnen te onderzoeken.',
    focusQuestion: 'Welk verschil in woordvolgorde helpt je een hoofdzin van een bijzin te onderscheiden?',
    watchUrl: 'https://www.youtube.com/watch?v=l_InNYyGmwk',
  },
  {
    id: 'aixN2-VdGXY',
    title: 'Homoniemen, homofonen, synoniemen',
    creator: 'Kenneth Beyers',
    description: 'Vergelijk woorden op betekenis, uitspraak en vorm: welke overeenkomst is telkens doorslaggevend?',
    focusQuestion: 'Kunnen twee woorden hetzelfde klinken en toch iets anders betekenen? Bedenk een eigen voorbeeld.',
    watchUrl: 'https://www.youtube.com/watch?v=aixN2-VdGXY',
  },
  {
    id: '4F81-tWCfJw',
    title: 'Lezen deel 5: Tekstopbouw: Alinea en Tekstverbanden (met signaalwoorden)',
    creator: 'Arnoud Kuijpers',
    description: 'Verken hoe een alinea een deelonderwerp uitwerkt en hoe zinnen met elkaar samenhangen.',
    focusQuestion: 'Welke zin draagt de hoofdgedachte van jouw alinea, en wat voegen de andere zinnen toe?',
    watchUrl: 'https://www.youtube.com/watch?v=4F81-tWCfJw',
  },
  {
    id: 'i34z5g3DQsE',
    title: 'Tekstverbanden & signaalwoorden',
    creator: 'Ruud Hermans',
    description: 'Oefen het herkennen van verbanden tussen tekstdelen met behulp van signaalwoorden.',
    focusQuestion: 'Welk verband legt het signaalwoord, en blijft dat verband duidelijk als je het woord weglaat?',
    watchUrl: 'https://www.youtube.com/watch?v=i34z5g3DQsE',
  },
];

/** Deliberate lesson-level matches; absence is preferable to an unrelated video. */
const LESSON_VIDEO_IDS: Record<string, readonly string[]> = {
  'basis-woordsoorten': ['b4GZ1yaj5JA'],
  'woordbouw-bases-affixen': ['WV7uaqUGuzI'],
  'woordbouw-productiviteit': ['WV7uaqUGuzI'],
  'zinsdelen-persoonsvorm': ['5A3Efwb9xqE'],
  'zinsdelen-onderwerp': ['5A3Efwb9xqE', '1OQwWpUH240'],
  'zinsdelen-naamwoordgroep': ['1OQwWpUH240'],
  'zinsbouw-v2': ['nKhbGj7u3jk'],
  'zinsbouw-inversie': ['nKhbGj7u3jk'],
  'zinsbouw-nevenschikking': ['l_InNYyGmwk'],
  'zinsbouw-bijzinnen': ['l_InNYyGmwk'],
  'betekenis-relaties': ['aixN2-VdGXY'],
  'alinea-kernzin': ['4F81-tWCfJw'],
  'alinea-relaties': ['i34z5g3DQsE'],
  'alinea-overgang': ['i34z5g3DQsE'],
};

export function getLessonVideos(lessonId: string): LessonVideo[] {
  const ids = Object.hasOwn(LESSON_VIDEO_IDS, lessonId) ? (LESSON_VIDEO_IDS[lessonId] ?? []) : [];
  return ids.flatMap((id) => {
    const video = LESSON_VIDEOS.find((candidate) => candidate.id === id);
    return video ? [video] : [];
  });
}
