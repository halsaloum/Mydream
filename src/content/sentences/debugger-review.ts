import type { DebugExercise } from './types';

type DebuggerReview = Pick<DebugExercise, 'prompt' | 'instruction'> & Partial<Pick<DebugExercise, 'targets' | 'repairs'>>;

/**
 * Independent practice separates finding the problem from producing a repair.
 * The repair constraints become visible only after the learner's diagnosis.
 * They delimit the assessment without spelling out the answer to copy.
 */
export const debuggerReview: Readonly<Record<string, DebuggerReview>> = {
  'zinnen-01-debugger-1': {
    prompt: 'Controleer de naamwoordgroep over het gelezen boek. Selecteer de twee woorden die als nabepaling verkeerd staan.',
    instruction: 'Herschrijf de hele zin. Verplaats alleen de geselecteerde voorzetselgroep naar de gewone plaats voor een nabepaling bij de kern. Behoud de volgorde van alle andere woorden.',
  },
  'zinnen-01-debugger-2': {
    prompt: 'Controleer de naamwoordgroep. Selecteer de twee naast elkaar staande woorden waarvan de onderlinge volgorde niet klopt.',
    instruction: 'Herschrijf de hele zin en wissel alleen de geselecteerde woorden om. Laat alle andere woorden op hun plaats.',
  },
  'zinnen-01-debugger-3': {
    prompt: 'Het onderwerp is door een werkwoord onderbroken. Selecteer dat werkwoord én de twee woorden van de nabepaling die daardoor uiteengetrokken is.',
    instruction: 'Herschrijf de hele zin. Verplaats alleen de persoonsvorm zodat het volledige onderwerp weer bijeen staat. Behoud de volgorde van de overige woorden.',
  },
  'zinnen-01-debugger-4': {
    prompt: 'Controleer de naamwoordgroep over het boek. Selecteer de twee woorden van de verkeerd geplaatste voorzetselnabepaling.',
    instruction: 'Herschrijf de hele zin. Verplaats uitsluitend de geselecteerde voorzetselgroep naar de gewone plaats voor een nabepaling. Behoud de volgorde van de overige woorden.',
    targets: ['w3', 'w4'],
  },
  'zinnen-02-debugger-1': {
    prompt: 'Controleer de overeenkomst tussen onderwerp en persoonsvorm. Selecteer alleen de werkwoordsvorm die niet bij het onderwerp past.',
    instruction: 'Herschrijf de hele zin in de tegenwoordige tijd. Herstel alleen de geselecteerde persoonsvorm; behoud het onderwerp en alle andere woorden.',
  },
  'zinnen-02-debugger-2': {
    prompt: 'Controleer een bericht over de bezoekersaantallen. Selecteer de persoonsvorm die niet bij deze hoeveelheidsconstructie past.',
    instruction: 'Herschrijf de hele zin in de tegenwoordige tijd. Verander alleen de persoonsvorm; behoud de hele hoeveelheidsuitdrukking.',
  },
  'zinnen-02-debugger-3': {
    prompt: 'Controleer wie vandaag samenwerken. Selecteer de persoonsvorm die niet bij het samengestelde onderwerp past.',
    instruction: 'Herschrijf de hele zin in de tegenwoordige tijd. Verander uitsluitend de geselecteerde persoonsvorm; behoud de woordvolgorde.',
  },
  'zinnen-02-debugger-4': {
    prompt: 'Controleer de identificerende zin over meerdere broers. Selecteer het werkwoord waarvan het getal niet past.',
    instruction: 'Herschrijf de hele zin. Herstel alleen het koppelwerkwoord in de tegenwoordige tijd; behoud beide naamwoordelijke delen.',
  },
  'zinnen-03-debugger-1': {
    prompt: 'Controleer de voltooide tijd van deze belhandeling. Selecteer de verkeerde werkwoordsvorm.',
    instruction: 'Herschrijf de hele zin. Gebruik de juiste deelwoordvorm van het scheidbare werkwoord; verander verder niets.',
  },
  'zinnen-03-debugger-2': {
    prompt: 'De bedoeling is een uitspraak over de toestand van de docent. Selecteer het werkwoord dat in deze constructie niet past.',
    instruction: 'Herschrijf de hele zin met een koppelwerkwoord in de tegenwoordige tijd. Verander alleen het geselecteerde werkwoord.',
  },
  'zinnen-03-debugger-3': {
    prompt: 'Controleer het verslag van een voltooide fietstocht. Selecteer de werkwoordsvorm die niet in deze werkwoordgroep past.',
    instruction: 'Herschrijf de hele zin in de voltooide tijd. Herstel uitsluitend de geselecteerde vorm; behoud het hulpwerkwoord en de overige woorden.',
  },
  'zinnen-03-debugger-4': {
    prompt: 'Controleer de passieve verfhandeling. Selecteer de werkwoordsvorm die niet bij de passieve constructie past.',
    instruction: 'Herschrijf de hele zin als onvoltooid passief. Verander alleen de geselecteerde vorm; behoud de uitvoerder.',
  },
  'zinnen-04-debugger-1': {
    prompt: 'Noor betwijfelt of het voorstel goed is. Selecteer het voorzetsel dat niet past bij het onderzochte vaste patroon van twijfelen.',
    instruction: 'Herschrijf de hele zin met het vaste complementpatroon van twijfelen dat je in deze module hebt onderzocht. Vervang uitsluitend het geselecteerde voorzetsel.',
  },
  'zinnen-04-debugger-2': {
    prompt: 'Controleer de verbinding die trots zijn aanvult. Selecteer het ongeschikte voorzetsel.',
    instruction: 'Herschrijf de hele zin. Gebruik het passende vaste voorzetsel bij trots zijn; verander geen andere woorden.',
  },
  'zinnen-04-debugger-3': {
    prompt: 'De bedoeling is dat Sam het boek ontvangt. Selecteer het voorzetsel dat de verkeerde groep als ontvanger aanwijst.',
    instruction: 'Herschrijf de hele zin. Verplaats alleen het geselecteerde voorzetsel zodat het de ontvanger inleidt. Behoud de onderlinge volgorde van alle overige woorden.',
  },
  'zinnen-04-debugger-4': {
    prompt: 'De bedoeling is dat Noor hulp verwacht. Selecteer het voorzetsel dat niet bij die betekenis van rekenen past.',
    instruction: 'Herschrijf de hele zin met het vaste voorzetselpatroon voor hulp verwachten. Verander uitsluitend het geselecteerde voorzetsel.',
  },
  'zin05-debug-01': {
    prompt: 'Er worden meerdere deuren geschilderd. Selecteer de persoonsvorm die niet bij het passieve onderwerp past.',
    instruction: 'Herschrijf de hele zin als onvoltooid passief in de tegenwoordige tijd. Herstel alleen de persoonsvorm en behoud alle andere woorden.',
  },
  'zin05-debug-02': {
    prompt: 'De brief is al af. Selecteer de werkwoordsvorm die niet in dit voltooide passief past.',
    instruction: 'Herschrijf de hele zin met de juiste werkwoordsvorm voor het voltooide passief. Verander alleen de geselecteerde vorm.',
  },
  'zin05-debug-03': {
    prompt: 'Het antwoord laat het zelfstandig naamwoord pennen weg. Selecteer het woord waarbij de hoeveelheid nog een verwijswoord nodig heeft.',
    instruction: 'Herschrijf de vraag en het antwoord. Voeg in het antwoord één noodzakelijk kwantitatief verwijswoord toe. Behoud de overige woorden en hun volgorde.',
  },
  'zin05-debug-04': {
    prompt: 'De bedoeling is: We hebben op dat plan gerekend. Selecteer het voorzetsel waarvan de verwijzing in de verkorte zin ontbreekt.',
    instruction: 'Herschrijf de hele verkorte zin. Vorm bij het geselecteerde voorzetsel het passende verwijswoord naar dat plan. Behoud de overige woorden en hun volgorde.',
    repairs: ['We hebben erop gerekend.', 'We hebben daarop gerekend.'],
  },
  'zin06-debug-01': {
    prompt: 'Controleer deze gewone mededelende hoofdzin. Selecteer de persoonsvorm die te laat staat.',
    instruction: 'Herschrijf de hele zin met hetzelfde tijdszinsdeel vooraan. Verplaats alleen de persoonsvorm naar haar gewone hoofdzinpositie.',
  },
  'zin06-debug-02': {
    prompt: 'De volgorde klopt. Selecteer de persoonsvorm die niet bij de persoon van het onderwerp past.',
    instruction: 'Herschrijf de hele zin in dezelfde tijd. Herstel uitsluitend de persoonsvorm; behoud de volgorde van alle woorden.',
  },
  'zin06-debug-03': {
    prompt: 'Deze korte mededeling vraagt een neutrale woordvolgorde. Selecteer het werkwoordelijke deel dat vóór het voorwerp is beland.',
    instruction: 'Herschrijf de hele zin in gewone neutrale volgorde. Verplaats uitsluitend het geselecteerde werkwoordelijke deel naar de tweede pool; verander verder niets.',
  },
  'zin06-debug-04': {
    prompt: 'Dit moet een mededeling met het onderwerp vooraan zijn. Selecteer de persoonsvorm die op de vraagpositie staat.',
    instruction: 'Herschrijf de hele zin als mededeling met hetzelfde onderwerp voorop. Behoud alle woorden en verander alleen de plaats van de persoonsvorm en de benodigde hoofdletter.',
  },
  'zin07-debug-01': {
    prompt: 'De bijzin beschrijft een voltooide schrijfhandeling. Selecteer de werkwoordsvorm die niet in de eindgroep past.',
    instruction: 'Herschrijf de hele zin in dezelfde voltooide tijd. Gebruik de juiste deelwoordvorm. Beide gewone volgordes van hulpwerkwoord en deelwoord zijn toegestaan; behoud de overige woorden.',
  },
  'zin07-debug-02': {
    prompt: 'De spreker heeft altijd de wens gehad om te zwemmen. Selecteer de vorm die niet bij deze combinatie van hulpwerkwoord en infinitief past.',
    instruction: 'Herschrijf de hele zin. Pas de vervangende infinitief toe in de werkwoordgroep. Verander alleen de geselecteerde vorm.',
  },
  'zin07-debug-03': {
    prompt: 'Controleer de te-constructie met een scheidbaar werkwoord. Selecteer het werkwoord waarvan het scheidbare deel verkeerd bij te staat.',
    instruction: 'Herschrijf de hele zin. Zet te op de juiste plaats binnen het scheidbare werkwoord; behoud alle andere woorden en hun volgorde.',
  },
  'zin07-debug-04': {
    prompt: 'Controleer de bijzin met één scheidbaar werkwoord. Selecteer het losse scheidbare deel dat bij de persoonsvorm hoort.',
    instruction: 'Herschrijf de hele zin. Verbind het geselecteerde scheidbare deel met de persoonsvorm op de passende bijzinpositie; behoud de overige woorden.',
  },
  'zin08-debug-01': {
    prompt: 'Controleer de bouw na het verbindingswoord. Selecteer de persoonsvorm waarvan de positie niet past bij het soort deelzin.',
    instruction: 'Herschrijf de hele zin. Herstel uitsluitend de woordvolgorde van de tweede deelzin; behoud het verbindingswoord en alle overige woorden.',
  },
  'zin08-debug-02': {
    prompt: 'Controleer de mededeling over een gevolg. Selecteer de persoonsvorm die te laat in de tweede hoofdzin staat.',
    instruction: 'Herschrijf de hele zin. Behoud daarom in het voorveld van de tweede hoofdzin. Verplaats alleen de persoonsvorm naar de passende positie.',
  },
  'zin08-debug-03': {
    prompt: 'De afspraak is: meegaan, behalve bij ziekte. Selecteer het verbindingswoord dat deze afspraak onbedoeld omkeert.',
    instruction: 'Herschrijf de hele zin. Vervang uitsluitend het verbindingswoord door één voegwoord dat de bedoelde uitzondering uitdrukt.',
  },
  'zin08-debug-04': {
    prompt: 'Controleer de bouw van de vooropgeplaatste reden. Selecteer de persoonsvorm die nog op een hoofdzinpositie staat.',
    instruction: 'Herschrijf de hele zin. Herstel alleen de positie van de persoonsvorm binnen de vooropgeplaatste bijzin; behoud de overige woorden en de komma.',
  },
  'zinnen-09-debug-1': {
    prompt: 'Controleer de hoofdzin na de voorwaarde. Selecteer het onderwerp dat nog vóór de persoonsvorm staat.',
    instruction: 'Herschrijf de hele zin met de voorwaarde als voorveld. Herstel de gewone hoofdzinvolgorde; behoud alle woorden, hun tijd en de komma. Voeg geen steunwoord toe.',
  },
  'zinnen-09-debug-2': {
    prompt: 'De school betreurt een afgelasting. Selecteer het voorlopige woord dat niet bij deze constructie past.',
    instruction: 'Herschrijf de hele zin. Vervang uitsluitend het geselecteerde voorlopige woord door het passende voorlopige onderwerp.',
  },
  'zinnen-09-debug-3': {
    prompt: 'De spreker neemt aan dat het rooster gecontroleerd wordt. Selecteer het scheidbare werkwoorddeel waarbij de vaste voorzetselverwijzing ontbreekt.',
    instruction: 'Herschrijf de hele zin. Voeg uitsluitend het ontbrekende voorzetselbijwoord vóór het geselecteerde werkwoorddeel toe; behoud de overige woorden.',
  },
  'zinnen-09-debug-4': {
    prompt: 'Controleer de congruentie van de grote zin. Selecteer de persoonsvorm die zich onterecht naar het onderwerp binnen de bijzin richt.',
    instruction: 'Herschrijf de hele zin in de tegenwoordige tijd. Herstel uitsluitend de persoonsvorm van de rompzin. Een leeskomma na de vooropgeplaatste bijzin mag; verander verder niets.',
    repairs: ['Dat alle leden akkoord zijn, verbaast mij niet.', 'Dat alle leden akkoord zijn verbaast mij niet.'],
  },
  'zinnen-10-debug-1': {
    prompt: 'Controleer de uitnodiging. Selecteer de betrekkelijke vorm die niet bij het antecedent past.',
    instruction: 'Herschrijf de hele zin. Vervang uitsluitend de geselecteerde verwijzing door de passende betrekkelijke vorm; behoud de woordvolgorde.',
  },
  'zinnen-10-debug-2': {
    prompt: 'Controleer een zakelijke profieltekst. Selecteer het verwijswoord dat na het voorzetsel niet naar deze persoon kan verwijzen.',
    instruction: 'Herschrijf de hele zin. Behoud het voorzetsel en vervang uitsluitend het geselecteerde woord door de verzorgde betrekkelijke verwijzing naar een persoon.',
  },
  'zinnen-10-debug-3': {
    prompt: 'De bedoeling is dat het hele uitlopen de organisatie verraste. Selecteer de betrekkelijke vorm die die verwijzing niet kan maken.',
    instruction: 'Herschrijf de hele zin. Verwijs naar de hele voorafgaande mededeling door alleen de geselecteerde betrekkelijke vorm te vervangen.',
  },
  'zinnen-10-debug-4': {
    prompt: 'De context is: we spreken over het onderwerp. Selecteer het verwijswoord dat een andere voorzetselrelatie uitdrukt.',
    instruction: 'Herschrijf de hele zin. Vervang uitsluitend het geselecteerde verwijswoord door de passende waar-vorm; behoud de bedoelde voorzetselrelatie en de overige woorden.',
  },
  'zinnen-11-debug-1': {
    prompt: 'Controleer wie het verslag gelezen kan hebben. Selecteer alleen de kern van het zichtbare onderwerp dat geen logische lezer is.',
    instruction: 'Herschrijf de hele zin met een volledige tijdsbijzin in plaats van de beknopte aanloop. Begin met Nadat, maak ik als lezer zichtbaar en gebruik de voltooid verleden tijd. Behoud de mededeling over het verdwijnen van de twijfel letterlijk.',
    repairs: ['Nadat ik het verslag had gelezen, verdween mijn twijfel.', 'Nadat ik het verslag gelezen had, verdween mijn twijfel.'],
  },
  'zinnen-11-debug-2': {
    prompt: 'Controleer de tweede mededeling in de woonadvertentie. Selecteer de persoonsvorm waarvoor een eigen onderwerp ontbreekt.',
    instruction: 'Herschrijf de hele zin. Voeg uitsluitend een persoonlijk voornaamwoord als onderwerp van de tweede mededeling toe. Verwijs naar de woning; behoud de overige woorden en hun volgorde.',
    repairs: ['Deze woning heb ik opgeknapt en zij ligt vlak bij het park.', 'Deze woning heb ik opgeknapt en ze ligt vlak bij het park.'],
  },
  'zinnen-11-debug-3': {
    prompt: 'Controleer de twee werkwoordgroepen in het dagverslag. Selecteer het deelwoord dat nog een ander hulpwerkwoord nodig heeft.',
    instruction: 'Herschrijf de hele zin. Voeg alleen het ontbrekende hulpwerkwoord direct na en toe, in de tegenwoordige tijd en passend bij ik. Behoud de overige woorden.',
  },
  'zinnen-11-debug-4': {
    prompt: 'De afspraak is dat alleen de leerlingen de oefening maken. Selecteer alleen de kern van de onderwerpgroep die de uitvoerder in de tweede mededeling verkeerd aanwijst.',
    instruction: 'Typ alleen de tweede mededeling, beginnend met Dat betekent. Noem de bedoelde uitvoerders als onderwerp en pas de persoonsvorm aan. Behoud de overige woorden van die mededeling.',
  },
  'zinnen-12-debug-1': {
    prompt: 'Noor is de enige bedoelde persoon; de bijzin geeft extra informatie. Selecteer het woord waarachter de openingskomma ontbreekt.',
    instruction: 'Herschrijf de hele zin met de bedoelde extra informatie. Voeg alleen de ontbrekende komma toe; behoud de overige woorden en de bestaande komma.',
  },
  'zinnen-12-debug-2': {
    prompt: 'Controleer het eenvoudige roosterbericht. Selecteer het woord waaraan een onnodige routinekomma vastzit.',
    instruction: 'Herschrijf de hele zin en verwijder uitsluitend de onnodige komma; behoud alle woorden en hun volgorde.',
  },
  'zinnen-12-debug-3': {
    prompt: 'Controleer de aankondiging van drie documenten. Selecteer het woord met het leesteken dat een zelfstandige tweede mededeling suggereert.',
    instruction: 'Herschrijf de hele zin. Vervang uitsluitend het ongeschikte teken door het passende aankondigende leesteken voor de lijst.',
  },
  'zinnen-12-debug-4': {
    prompt: 'Controleer de onderbreking in het vergaderbericht. Selecteer het eerste woord waarmee de rompzin verdergaat na de tussengedachte.',
    instruction: 'Herschrijf de hele zin. Voeg alleen het ontbrekende sluitende gedachtestreepje toe, met spaties eromheen; behoud alle andere woorden en leestekens.',
  },
};

export function reviewedDebugger(exercise: DebugExercise): DebugExercise {
  const review = debuggerReview[exercise.id];
  if (!review) throw new Error(`Geen zelfstandige reparatie-instructie voor ${exercise.id}`);
  return { ...exercise, ...review };
}
