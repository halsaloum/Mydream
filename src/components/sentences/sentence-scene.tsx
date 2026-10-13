'use client';

import { useId } from 'react';
import type { DiscoveryVariant } from '@/content/sentences/types';

type Scene = DiscoveryVariant['scene'];
type SceneProps = { scene: Scene; variantId?: string; caption?: string };

const ink = '#31536b';
const blue = '#12668b';
const orange = '#b45309';
const green = '#35691d';

function Person({ x, y, color = blue, pose = 'standing' }: { x: number; y: number; color?: string; pose?: 'standing' | 'walking' | 'seated' }) {
  return <g transform={`translate(${x} ${y})`} stroke={color} strokeWidth="4" strokeLinecap="round" fill="none">
    <circle cy="-27" r="7" fill="#fff" />
    <path d="M0-19V4M-12-6 0-14 12-6" />
    <path d={pose === 'walking' ? 'M0 4-11 22M0 4 12 14' : pose === 'seated' ? 'M0 4 14 4 14 20M0 4-3 20' : 'M0 4-7 24M0 4 7 24'} />
  </g>;
}

function Label({ x, y, children, color = ink }: { x: number; y: number; children: string; color?: string }) {
  return <text x={x} y={y} fill={color} fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="system-ui, sans-serif">{children}</text>;
}

function Bus({ x = 134, y = 88 }: { x?: number; y?: number }) {
  return <g transform={`translate(${x} ${y})`} stroke={ink} strokeWidth="3" strokeLinejoin="round">
    <rect width="173" height="69" rx="11" fill="#cbeaf2" />
    {[12, 49, 86, 123].map((left) => <rect key={left} x={left} y="11" width="29" height="22" rx="3" fill="#fff" />)}
    <path d="M13 43H159" fill="none" />
    <circle cx="34" cy="70" r="13" fill={ink} /><circle cx="139" cy="70" r="13" fill={ink} />
    <circle cx="34" cy="70" r="5" fill="#fff" /><circle cx="139" cy="70" r="5" fill="#fff" />
  </g>;
}

function Bicycle({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <circle cx="0" r="24" /><circle cx="100" r="24" />
    <path d="M0 0 32-43 52 0H0M32-43H81L52 0M81-43 100 0M75-58H88M27-47H39" />
  </g>;
}

function SceneDrawing({ scene, variantId }: { scene: Scene; variantId: string }) {
  if (scene === 'bus') {
    const onRoof = /(?:place|plaats|locatie|bwb|bovenop|zitten|zit-op|op-de-bus)/.test(variantId);
    const waiting = /(?:verwachten|wachten|waiting|vast-voorzetsel|vv)/.test(variantId);
    return <>
      <path d="M18 188H342" stroke="#aac8d3" strokeWidth="3" />
      <Bus />
      <path d="M58 72V183M42 73H77V97H42Z" fill="#fff" stroke={ink} strokeWidth="3" />
      <Label x={60} y={90}>BUS</Label>
      <Person x={onRoof ? 222 : 92} y={onRoof ? 56 : 147} pose={onRoof ? 'seated' : 'standing'} color={onRoof ? orange : blue} />
      <Label x={onRoof ? 226 : 90} y={onRoof ? 20 : 212} color={onRoof ? orange : blue}>{onRoof ? 'Letterlijke plaats: op de bus' : waiting ? 'Bij de halte: wachten op de bus' : 'Een persoon en een bus als zincontext'}</Label>
    </>;
  }
  if (scene === 'bicycle') {
    const faulty = /(?:fout|fault|zwevend|ketting-onderwerp|ketting-fietst|los)/.test(variantId);
    const cycling = variantId === 'handeling';
    return <>
      <path d="M16 190H344" stroke="#aac8d3" strokeWidth="3" />
      <path d="M23 186 37 50 51 186M302 186 317 50 332 186" stroke="#86af92" strokeWidth="5" fill="none" />
      <g stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="123" cy="163" r="28" /><circle cx="245" cy="163" r="28" />
        <path d="M123 163 161 112 184 163H123M161 112 222 112 184 163M222 112 245 163M214 94 229 94M156 109 145 109" />
      </g>
      {faulty ? <g stroke={orange} strokeWidth="4" strokeLinecap="round" fill="#fff"><ellipse cx="176" cy="86" rx="18" ry="11" /><path d="M165 84H189M176 98 167 117M176 98 192 113" /><Label x={185} y={57} color={orange}>De ketting als fietser?</Label></g> : <>
        <Person x={183} y={110} pose="seated" />
        {!cycling && <path d="M167 172q10 13 22 0t22 0" stroke={orange} strokeWidth="4" fill="none" />}
        <Label x={191} y={52}>De persoon fietst</Label>
      </>}
      <Label x={183} y={214} color={faulty ? orange : blue}>{faulty ? 'De getekende absurditeit helpt de fout zien' : cycling ? 'Moe beschrijft de fietser tijdens de handeling' : 'Een fietser verliest een ketting'}</Label>
    </>;
  }
  if (scene === 'students') {
    const all = /(?:all|alle|uitbreidend|uitbreiding|met-komma|metkomma|extra)/.test(variantId);
    const explanation = variantId === 'verklaring';
    return <>
      <rect x="14" y="20" width="332" height="177" rx="14" fill="#fff" stroke="#aac8d3" strokeWidth="2" />
      {!explanation && <><path d="M180 23V193" stroke="#aac8d3" strokeWidth="2" strokeDasharray="5 6" /><Label x={94} y={42}>Later aangekomen</Label><Label x={266} y={42}>Overige leerlingen</Label></>}
      {explanation && <Label x={180} y={42}>Bericht: de lestijd is veranderd</Label>}
      {Array.from({ length: 10 }, (_, index) => {
        const outside = all || index < 3;
        const sideIndex = outside ? index : index - 3;
        const x = explanation ? 56 + (index % 5) * 60 : outside ? 46 + (sideIndex % 4) * 33 : 205 + (sideIndex % 4) * 33;
        const y = explanation ? 91 + Math.floor(index / 5) * 59 : 89 + Math.floor(sideIndex / 4) * 45;
        return <g key={index} transform={`translate(${x} ${y})`} stroke={explanation ? blue : outside ? orange : blue} strokeWidth="2.5" fill="none"><circle cy="-9" r="5" fill="#fff" /><path d="M0-3V12M-8 3H8M0 12-5 20M0 12 5 20" />{(outside || explanation) && <g strokeWidth="1.5"><rect x="7" y="3" width="14" height="10" rx="1" fill="#fff" /><path d="M7 3 14 9 21 3" /></g>}</g>;
      })}
      <Label x={180} y={218} color={all ? orange : blue}>{explanation ? 'Iedere leerling krijgt een bericht met een verklaring' : all ? 'Alle 10 leerlingen kwamen later en krijgen een bericht' : '3 van de 10 kwamen later; alleen zij krijgen een bericht'}</Label>
    </>;
  }
  if (scene === 'classroom') return <>
    <rect x="28" y="26" width="218" height="83" rx="8" fill="#e2eee7" stroke={green} strokeWidth="3" />
    <path d="M48 51H220M48 73H178M48 92H202" stroke="#84b190" strokeWidth="4" strokeLinecap="round" />
    <Person x={282} y={116} />
    {[64, 169].map((x) => <g key={x}><Person x={x} y={151} pose="seated" color={x === 64 ? orange : blue} /><path d={`M${x - 31} 143H${x + 40}M${x - 23} 145V187M${x + 33} 145V187`} stroke={ink} strokeWidth="4" /></g>)}
    <Label x={180} y={215}>Wie, wat en welke informatie horen bij elkaar?</Label>
  </>;
  if (scene === 'office') return <>
    <rect x="29" y="31" width="88" height="81" rx="8" fill="#fff" stroke={ink} strokeWidth="3" />
    <path d="M29 51H117M48 28V42M94 28V42" stroke={blue} strokeWidth="4" />
    {[49, 72, 94].map((x) => <rect key={x} x={x - 6} y="67" width="12" height="12" rx="2" fill={x === 72 ? '#d99149' : '#cbeaf2'} />)}
    <Person x={163} y={124} pose="seated" />
    <path d="M138 133H315M150 135V187M302 135V187" stroke={ink} strokeWidth="4" />
    <rect x="216" y="79" width="65" height="44" rx="5" fill="#e2eee7" stroke={ink} strokeWidth="3" />
    <path d="M249 124V133M235 133H264" stroke={ink} strokeWidth="3" />
    <Label x={180} y={215}>Dezelfde gebeurtenis, anders geordende informatie</Label>
  </>;
  if (scene === 'library' && /(?:een-doos|twee-dozen)/.test(variantId)) {
    const count = variantId === 'twee-dozen' ? 2 : 1;
    return <>
      <path d="M35 162H326M53 164V204M308 164V204" stroke={ink} strokeWidth="4" />
      {Array.from({ length: count }, (_, index) => {
        const x = count === 1 ? 132 : 48 + index * 153;
        return <g key={index} transform={`translate(${x} 89)`}>
          <path d="M0 28 19 12H82L101 28V68H0Z" fill="#f4dfc7" stroke={ink} strokeWidth="3" />
          {[24, 35, 46, 57, 68].map((left) => <rect key={left} x={left} y="-15" width="9" height="46" rx="2" fill={left === 46 ? '#e8dfef' : '#cbeaf2'} stroke={ink} strokeWidth="1.5" />)}
          <path d="M0 29H101M50 30V66" stroke={ink} strokeWidth="2" />
        </g>;
      })}
      <Label x={180} y={39}>De boeken zitten binnen de doosgroep</Label>
      <Label x={180} y={225}>{count === 1 ? 'Eén doos staat' : 'Twee dozen staan'}</Label>
    </>;
  }
  if (scene === 'library') return <>
    <rect x="22" y="30" width="316" height="135" rx="8" fill="#fff" stroke={ink} strokeWidth="3" />
    {[52, 101].map((y) => <g key={y}>{Array.from({ length: 10 }, (_, index) => <rect key={index} x={35 + index * 30} y={y} width="21" height="42" rx="2" fill={['#cbeaf2', '#e8dfef', '#f4dfc7'][index % 3]} stroke={ink} strokeWidth="1.5" />)}<path d={`M28 ${y + 48}H333`} stroke={ink} strokeWidth="3" /></g>)}
    <path d="M142 153q24-8 39 2 15-10 39-2v42q-26-7-39 1-13-8-39-1Z" fill="#fff" stroke={blue} strokeWidth="3" /><path d="M181 156V195" stroke={blue} strokeWidth="2" />
    <Label x={180} y={218}>Een boek, een lezer en de bouw van hun zin</Label>
  </>;
  if (scene === 'station') return <>
    <path d="M21 185H340M27 202H334" stroke={ink} strokeWidth="3" />
    <rect x="45" y="83" width="272" height="88" rx="17" fill="#cbeaf2" stroke={ink} strokeWidth="3" />
    {[65, 121, 177, 233].map((x) => <rect key={x} x={x} y="99" width="39" height="27" rx="4" fill="#fff" stroke={ink} strokeWidth="2" />)}
    <circle cx="94" cy="172" r="10" fill={ink} /><circle cx="270" cy="172" r="10" fill={ink} />
    <circle cx="69" cy="40" r="19" fill="#fff" stroke={ink} strokeWidth="3" /><path d="M69 28V40L81 47" stroke={blue} strokeWidth="3" fill="none" />
    <Label x={226} y={49}>Een gebeurtenis in de tijd</Label>
    <Label x={180} y={224}>Lees wanneer iets gebeurt en hoe de delen samenhangen</Label>
  </>;
  if (variantId === 'er-presentatief') return <>
    <rect x="175" y="93" width="145" height="100" rx="6" fill="#cbeaf2" stroke={ink} strokeWidth="3" />
    <Person x={94} y={135} />
    <Label x={95} y={196}>Een klant</Label><Label x={248} y={73}>De balie</Label>
    <Label x={180} y={221}>Er introduceert een nog onbekende klant</Label>
  </>;
  if (variantId === 'er-kwantitatief' || variantId === 'er-samenval') return <>
    {[44, 153, 262].map((x) => <g key={x}><Bicycle x={x} y={153} scale={0.6} /><circle cx={x + 31} cy="85" r="12" fill="#e2eee7" /><path d={`M${x + 25} 85l4 5 8-10`} stroke={green} strokeWidth="3" fill="none" /></g>)}
    <Label x={180} y={43}>De fietsen zijn eerder genoemd</Label>
    <Label x={180} y={218}>Drie gerepareerde fietsen: er + drie</Label>
  </>;
  return <>
    {variantId === 'actief' && <rect x="59" y="63" width="88" height="123" rx="18" fill="#cbeaf2" />}
    {(variantId === 'passief' || variantId === 'voltooid') && <rect x="180" y="91" width="161" height="99" rx="18" fill="#cbeaf2" />}
    <Person x={104} y={116} />
    <Bicycle x={208} y={156} scale={0.85} />
    <path d="M116 109 163 133M163 133l6-13 7 4-4 14" stroke={blue} strokeWidth="4" strokeLinecap="round" fill="none" />
    <Label x={105} y={171}>De monteur</Label><Label x={260} y={215}>De fiets</Label>
    <path d="M145 116H199M191 108 199 116 191 124" stroke={orange} strokeWidth="3" fill="none" />
    <Label x={174} y={43} color={orange}>{variantId === 'voltooid' ? 'De reparatie is afgerond' : variantId === 'er-locatief' ? 'In die werkplaats: daar → er' : variantId === 'er-prepositioneel' ? 'Verwacht resultaat: rekenen op' : 'Dezelfde reparatie'}</Label>
    {variantId === 'voltooid' && <g><circle cx="287" cy="72" r="13" fill="#e2eee7" /><path d="M280 72l5 5 9-12" stroke={green} strokeWidth="3" fill="none" /></g>}
    {variantId === 'actief' && <Label x={105} y={196} color={blue}>onderwerp</Label>}
    {variantId === 'passief' && <Label x={267} y={79} color={blue}>onderwerp</Label>}
  </>;
}

const descriptions: Record<Scene, string> = {
  classroom: 'Een docent, twee leerlingen en een bord geven de zinsdelen een concrete situatie.',
  office: 'Een kalender en een collega aan een bureau laten zien dat een zin tijd, persoon en handeling kan verbinden.',
  bus: 'De positie van een persoon ten opzichte van een bushalte en een bus maakt een vaste verbinding of letterlijke plaats zichtbaar.',
  bicycle: 'Een fietser en een losse ketting tonen waarom je moet controleren wie de beschreven handeling uitvoert.',
  students: 'Tien leerlingen staan in een schema. Een envelop laat zien wie een bericht ontvangt: een geselecteerde subgroep of de hele groep.',
  library: 'Boeken en een open boek plaatsen de voorbeeldzin in een herkenbare leessituatie.',
  station: 'Een trein en een klok plaatsen gebeurtenissen in tijd en ruimte.',
  workshop: 'Een monteur, fietsen en een balie geven een concrete context aan repareren en de verschillende functies van er.',
};

const photoContexts: Record<Scene, { position: string; title: string; description: string }> = {
  classroom: { position: '0% 0%', title: 'In de les', description: 'Volwassen cursisten luisteren naar een docent in een lichte klas.' },
  office: { position: '33.333333% 0%', title: 'Op kantoor', description: 'Een collega werkt met een computer en documenten aan een bureau.' },
  bus: { position: '66.666667% 0%', title: 'Bij de bushalte', description: 'Een reiziger wacht naast een stadsbus bij een halte.' },
  bicycle: { position: '100% 0%', title: 'Op het fietspad', description: 'Een fietser staat naast zijn fiets en controleert de ketting.' },
  students: { position: '0% 100%', title: 'Samen leren', description: 'Een groep volwassen studenten praat buiten een onderwijsgebouw.' },
  library: { position: '33.333333% 100%', title: 'In de bibliotheek', description: 'Een lezer bestudeert een open boek tussen de boekenkasten.' },
  station: { position: '66.666667% 100%', title: 'Op het station', description: 'Een reiziger met bagage wacht op een perron naast een trein.' },
  workshop: { position: '100% 100%', title: 'In de werkplaats', description: 'Een fietsenmaker repareert een fiets met gereedschap in de werkplaats.' },
};

export function SentenceScene({ scene, variantId = '', caption }: SceneProps) {
  const id = useId();
  const photo = photoContexts[scene];
  return <div className="min-w-0 space-y-4">
    <figure className="overflow-hidden rounded-card border-2 border-line bg-surface">
      <div role="img" aria-label={`Illustratieve contextfoto: ${photo.title}. ${photo.description}`} className="aspect-square w-full bg-sunken bg-no-repeat" style={{ backgroundImage: 'url(/images/sentences/context-grid.png)', backgroundSize: '400% 200%', backgroundPosition: photo.position }} />
      <figcaption className="border-t border-line px-4 py-3 text-small leading-relaxed text-ink-soft"><span className="mb-1 block text-caption font-bold text-blue-ink">Illustratieve contextfoto · {photo.title}</span>De voorbeeldzin en tekening bepalen welke personen en aantallen worden bedoeld.</figcaption>
    </figure>
    <figure className="min-w-0 overflow-hidden rounded-card border-2 border-line bg-surface">
    <svg viewBox="0 0 360 238" role="img" aria-labelledby={`${id}-title ${id}-description`} className="block h-auto w-full">
      <title id={`${id}-title`}>Situatie-illustratie bij de voorbeeldzin</title>
      <desc id={`${id}-description`}>{descriptions[scene]} {caption}</desc>
      <rect width="360" height="238" fill="#f1f7f8" />
      <SceneDrawing scene={scene} variantId={variantId.toLowerCase()} />
    </svg>
    <figcaption className="border-t border-line px-4 py-3 text-small leading-relaxed text-ink-soft">
      <span className="mb-1 block text-caption font-bold text-ink-muted">Schematische situatie</span>
      {caption ?? descriptions[scene]}
    </figcaption>
    </figure>
  </div>;
}
