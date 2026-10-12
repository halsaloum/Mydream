'use client';

import { ExternalLink, Image as ImageIcon, Play, Video, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { argumentMedia, type ArgumentMedia } from '@/content/argumentation/media';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { ARGUMENT_MAP_PRESETS } from '@/lib/argumentation/maps';
import { useArgumentation } from '@/state/argumentation';
import { ArgumentDiagram } from './map-workshop';

export function MediaCard({ item }: { item: ArgumentMedia }) {
  const [open, setOpen] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const note = useArgumentation((state) => state.workshopNotes[`media:${item.id}`] ?? '');
  const preset = item.illustration ? ARGUMENT_MAP_PRESETS.find((entry) => entry.id === item.illustration) : undefined;
  return <article className="overflow-hidden rounded-card border-2 border-line bg-surface shadow-slab-sm">
    {!open && item.youtubeId && <button type="button" aria-label={`Speel ${item.title} af`} onClick={() => setOpen(true)} className="group relative block aspect-video w-full overflow-hidden bg-navy-ink text-white"><div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-ink to-blue-ink"><Video className="size-16 opacity-30" /></div>{!previewFailed && <Image unoptimized fill sizes="(min-width: 1024px) 640px, 100vw" src={`https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`} alt="" referrerPolicy="no-referrer" onError={() => setPreviewFailed(true)} className="object-cover transition-transform duration-300 group-hover:scale-[1.03] calm:transition-none calm:group-hover:scale-100" />}<span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" /><span aria-hidden="true" className="absolute inset-0 grid place-items-center"><span className="grid size-16 place-items-center rounded-full border-2 border-white/60 bg-white/95 text-blue-ink shadow-xl transition-transform group-hover:scale-110 calm:transition-none calm:group-hover:scale-100"><Play className="ml-1 size-7 fill-current" /></span></span><span className="absolute right-4 bottom-3 left-4 text-left text-caption font-semibold">{item.provider}</span></button>}
    <div className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 text-caption font-bold text-ink-muted"><span className={cn('inline-flex items-center gap-1.5 rounded-chip px-2 py-1', item.kind === 'video' ? 'bg-blue-soft text-blue-ink' : 'bg-purple-soft text-purple-ink')}>{item.kind === 'video' ? <Video aria-hidden className="size-3.5" /> : <ImageIcon aria-hidden className="size-3.5" />}{item.kind === 'video' ? 'Video' : 'Visuele uitleg'}</span><span>{item.language}</span>{item.minutes && <span>≈ {item.minutes} min</span>}</div>
      <p className="mt-3 text-caption font-bold text-blue-ink">{item.level === 'basis' ? 'Vanaf nul' : item.level === 'bachelor' ? 'Verder bouwen' : 'Verdiepen'}</p>
      <p className="mt-4 text-caption font-semibold text-ink-muted">{item.provider}</p>
      <h3 className="mt-2 font-display text-title-sm leading-snug font-bold">{item.title}</h3>
      <p className="mt-3 text-small leading-relaxed text-ink-soft">{item.description}</p>
      <div className="mt-5 rounded-control border border-blue-line bg-blue-soft/60 p-4"><h4 className="text-small font-bold text-blue-ink">{item.kind === 'video' ? 'Kijk met deze vraag' : 'Let hierop in het schema'}</h4><p className="mt-2 text-small leading-relaxed text-ink-soft">{item.watchFor}</p></div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {(item.youtubeId || preset) && <Button variant="secondary" size="sm" onClick={() => setOpen(!open)}>{open ? <X aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}{open ? 'Sluiten' : item.youtubeId ? 'Bekijk de video hier' : 'Bekijk een oefenkaart'}</Button>}
        <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-small font-bold text-blue-ink underline underline-offset-4">{item.kind === 'video' ? 'Open de originele video' : 'Open de originele illustraties'}<ExternalLink aria-hidden className="size-3.5" /></a>
      </div>
      {open && item.youtubeId && <div className="mt-5"><div className="aspect-video overflow-hidden rounded-control border border-line bg-ink"><iframe title={item.title} src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?rel=0`} loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen className="h-full w-full border-0" referrerPolicy="strict-origin-when-cross-origin" /></div><p className="mt-2 text-caption text-ink-muted">Je kunt ook de oorspronkelijke pagina openen als de video hier niet afspeelt.</p></div>}
      {open && preset && <div className="mt-5"><ArgumentDiagram nodes={preset.nodes} inferences={preset.inferences} attacks={preset.attacks} title="Eigen oefenkaart bij de uitleg" /><p className="mt-2 text-caption text-ink-muted">Dit is een eigen werksituatie in onze kaart. De originele diagramvoorbeelden staan bij de gelinkte maker.</p></div>}
      <details className="mt-5 border-t border-line pt-4"><summary className="cursor-pointer font-display text-small font-bold">Pas dit toe in jouw werk</summary><label htmlFor={`media-note-${item.id}`} className="mt-4 block text-small font-semibold leading-relaxed">{item.question}</label><textarea id={`media-note-${item.id}`} value={note} onChange={(event) => useArgumentation.getState().saveWorkshopNote(`media:${item.id}`, event.target.value)} rows={5} placeholder="Formuleer je eigen voorbeeld, onderbouwing en reactie…" className="mt-3 w-full resize-y rounded-control border-2 border-line bg-sunken p-3 text-small leading-relaxed" /><p className="mt-2 text-caption text-ink-muted">Je toepassing wordt in deze browser bewaard en meegenomen in je voortgangsexport. Een video bekijken geeft geen automatische kennisscore.</p></details>
    </div>
  </article>;
}

export function ArgumentMediaView() {
  const [filter, setFilter] = useState('all');
  const [level, setLevel] = useState('all');
  const shown = argumentMedia.filter((item) => (level === 'all' || item.level === level) && (filter === 'all' || (filter === 'nl' ? item.language === 'Nederlands' : item.kind === filter)));
  return <div className="space-y-6">
    <div><p className="mb-2 text-caption font-bold tracking-wider text-blue-ink uppercase">Uitleg van goede makers</p><h2 className="font-serif text-headline">Kijk, vergelijk en pas toe.</h2><p className="mt-3 max-w-2xl text-body leading-relaxed text-ink-muted">Geselecteerde video’s en diagrammen voor overtuigende voorstellen, kritische gesprekken en betere besluiten. Pauzeer bij een argument, maak je eigen analyse en vertaal het naar jouw werk.</p></div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter video’s en voorbeelden">{[['all', 'Alles'], ['nl', 'Nederlands'], ['video', 'Video’s'], ['illustration', 'Illustraties']].map(([value, label]) => <Button key={value} variant={filter === value ? 'accent' : 'secondary'} size="sm" aria-pressed={filter === value} onClick={() => setFilter(value!)}>{label}</Button>)}</div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Kies het niveau van de uitleg">{[['all', 'Alle niveaus'], ['basis', 'Vanaf nul'], ['bachelor', 'Verder bouwen'], ['master', 'Verdiepen']].map(([value, label]) => <Button key={value} variant={level === value ? 'accent' : 'ghost'} size="sm" aria-pressed={level === value} onClick={() => setLevel(value!)}>{label}</Button>)}</div>
    <div className="grid items-start gap-5 lg:grid-cols-2">{shown.map((item) => <MediaCard key={item.id} item={item} />)}</div>
    {!shown.length && <p className="rounded-card border border-line bg-surface p-6 text-ink-muted">Er staat voor deze combinatie nog geen bron klaar. Kies ‘Alle niveaus’ of ‘Alles’ om meer uitleg te vinden.</p>}
  </div>;
}
