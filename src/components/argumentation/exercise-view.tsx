'use client';

import { useDraggable } from '@dnd-kit/core';
import { Check, GripVertical, Lightbulb, Network, X } from 'lucide-react';
import { useMemo, type Ref } from 'react';
import { exerciseDiagram } from '@/content/argumentation/diagrams';
import type { ArgumentExercise, ChoiceExercise, ReflectionExercise, SortExercise } from '@/content/argumentation/types';
import { PracticeDnd, useDropZone } from '@/components/player/dnd';
import { shuffle } from '@/engine/hash';
import { cn } from '@/lib/cn';
import { wordCount, type ArgumentAnswer } from '@/lib/argumentation/learning';
import { ArgumentDiagram } from './map-workshop';

type Props = { exercise: ArgumentExercise; answer: ArgumentAnswer; onChange: (patch: Partial<ArgumentAnswer>) => void; headingRef?: Ref<HTMLHeadingElement> };

function Choice({ exercise, answer, onChange }: Props & { exercise: ChoiceExercise }) {
  const options = useMemo(() => shuffle(exercise.id, exercise.options), [exercise]);
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Kies het best onderbouwde antwoord</legend>
      {options.map((option, index) => {
        const selected = answer.value === option.id;
        const correct = answer.checked && option.id === exercise.answer;
        const wrong = answer.checked && selected && !correct;
        return (
          <label key={option.id} className={cn('flex cursor-pointer items-start gap-3 rounded-control border-2 bg-surface p-4 transition-colors sm:p-5',
            selected ? 'border-blue-ink bg-blue-soft' : 'border-line hover:border-line-strong', correct && 'border-green-ink bg-green-soft', wrong && 'border-red-ink bg-red-soft', answer.checked && 'cursor-default')}>
            <input type="radio" name={exercise.id} value={option.id} checked={selected} disabled={answer.checked}
              onChange={() => onChange({ value: option.id })} className="mt-1 size-4 shrink-0 accent-[var(--color-blue-ink)]" />
            <span className="flex-1 text-body leading-relaxed"><span className="mr-2 font-bold text-ink-muted">{String.fromCharCode(65 + index)}.</span>{option.text}</span>
            {correct ? <Check aria-label="Juist antwoord" className="mt-0.5 size-5 shrink-0 text-green-ink" /> : wrong ? <X aria-label="Onjuist antwoord" className="mt-0.5 size-5 shrink-0 text-red-ink" /> : null}
          </label>
        );
      })}
    </fieldset>
  );
}

function AssignCard({ card, index, exercise, answer, onChange }: {
  card: SortExercise['cards'][number]; index: number; exercise: SortExercise; answer: ArgumentAnswer; onChange: Props['onChange'];
}) {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({ id: card.id, disabled: answer.checked, data: { label: card.text, kind: 'argument', index } });
  const placed = answer.placements[card.id];
  const correct = placed === card.category;
  return (
    <div ref={setNodeRef} className={cn('rounded-control border-2 border-line bg-surface p-4', isDragging && 'opacity-40', answer.checked && (correct ? 'border-green-line' : 'border-red-line'))}>
      <div className="flex items-start gap-2">
        <button type="button" {...listeners} {...attributes} disabled={answer.checked} aria-label={`Sleep kaart ${index + 1}. Je kunt ook de keuzelijst gebruiken.`}
          className="-ml-1 grid min-h-11 min-w-8 touch-none place-items-center rounded-control text-ink-muted hover:bg-sunken disabled:opacity-30">
          <GripVertical aria-hidden className="size-4" />
        </button>
        <p className="pt-2 text-small leading-relaxed"><span className="mr-2 font-bold text-blue-ink">{index + 1}.</span>{card.text}</p>
      </div>
      <label className="mt-3 block text-caption font-bold text-ink-muted">
        Plaats kaart {index + 1} bij
        <select aria-label={`Plaats kaart ${index + 1} bij`} value={placed ?? ''} disabled={answer.checked}
          onChange={(event) => onChange({ placements: { ...answer.placements, [card.id]: event.target.value } })}
          className="mt-1 block min-h-11 w-full rounded-control border border-line-strong bg-sunken px-3 text-small font-medium text-ink">
          <option value="">Kies een onderdeel…</option>
          {exercise.categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
        </select>
      </label>
      {answer.checked && <p className={cn('mt-2 text-caption font-semibold', correct ? 'text-green-ink' : 'text-red-ink')}>
        {correct ? 'Goed geplaatst.' : `Hoort bij: ${exercise.categories.find((category) => category.id === card.category)?.label}.`}
      </p>}
    </div>
  );
}

function AssignmentZone({ category, exercise, answer, index }: { category: SortExercise['categories'][number]; exercise: SortExercise; answer: ArgumentAnswer; index: number }) {
  const { setNodeRef, isOver } = useDropZone(`zone:${category.id}`, { label: category.label, kind: 'argument-zone', index }, answer.checked);
  const cards = exercise.cards.filter((card) => answer.placements[card.id] === category.id);
  return (
    <div ref={setNodeRef} data-testid={`argument-zone-${category.id}`} className={cn('min-h-28 rounded-card border-2 border-dashed border-blue-line bg-blue-soft/40 p-4 transition-colors', isOver && 'border-blue-ink bg-blue-soft')}>
      <h3 className="mb-3 font-display text-small font-bold text-blue-ink">{category.label}</h3>
      {cards.length ? <ul className="space-y-2">{cards.map((card) => <li key={card.id} className="rounded-control border border-blue-line bg-surface px-3 py-2 text-small leading-relaxed">{card.text}</li>)}</ul>
        : <p className="text-caption text-ink-muted">Sleep hierheen of kies hieronder.</p>}
    </div>
  );
}

function Assignment({ exercise, answer, onChange }: Props & { exercise: SortExercise }) {
  const cards = useMemo(() => shuffle(exercise.id, exercise.cards), [exercise]);
  const diagram = exerciseDiagram(exercise, answer.placements);
  return (
    <PracticeDnd disabled={answer.checked} animateDrop={false}
      onDrop={(id, target) => { if (target?.startsWith('zone:')) onChange({ placements: { ...answer.placements, [id]: target.slice(5) } }); }}
      renderOverlay={(id) => <div className="max-w-xs rounded-control border-2 border-blue-line bg-surface p-4 text-small shadow-float">{exercise.cards.find((card) => card.id === id)?.text}</div>}>
      {exercise.kind === 'map' && exercise.claim && (
        <div className="mx-auto mb-5 max-w-xl rounded-card border-2 border-blue-ink bg-blue-soft p-5 text-center">
          <Network aria-hidden className="mx-auto mb-2 size-5 text-blue-ink" />
          <p className="text-caption font-bold tracking-wider text-blue-ink uppercase">Te beoordelen standpunt</p>
          <p className="mt-2 font-display text-lead font-bold">{exercise.claim}</p>
          <p className="mt-2 text-caption text-ink-muted">Reconstrueer de functie van elk onderdeel in het schema.</p>
        </div>
      )}
      {diagram && <section className="mb-6 space-y-3" aria-label="Jouw argumentkaart"><h3 className="font-display font-bold text-blue-ink">Je reconstructie wordt een argumentkaart</h3><p className="text-small leading-relaxed text-ink-muted">Plaats de uitspraken met de kaartjes of keuzelijsten. De kaart toont je gekozen reconstructie, ook als een uitspraak nog op de verkeerde plek staat.</p><ArgumentDiagram {...diagram.map} /><p className="text-small leading-relaxed text-ink-muted">{diagram.note}</p></section>}
      <div className={cn('mb-5 grid gap-3', exercise.categories.length > 3 ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
        {exercise.categories.map((category, index) => <AssignmentZone key={category.id} category={category} index={index} exercise={exercise} answer={answer} />)}
      </div>
      <p className="mb-3 text-small text-ink-muted">Elk kaartje krijgt één plaats. Met de keuzelijsten kun je alles ook zonder slepen doen.</p>
      <div className="grid gap-3 sm:grid-cols-2">{cards.map((card, index) => <AssignCard key={card.id} card={card} index={index} exercise={exercise} answer={answer} onChange={onChange} />)}</div>
    </PracticeDnd>
  );
}

function Reflection({ exercise, answer, onChange }: Props & { exercise: ReflectionExercise }) {
  const words = wordCount(answer.value);
  return (
    <div>
      <label htmlFor={`response-${exercise.id}`} className="mb-2 block font-bold">Jouw analyse</label>
      <textarea id={`response-${exercise.id}`} value={answer.value} readOnly={answer.checked}
        onChange={(event) => onChange({ value: event.target.value })} rows={8}
        placeholder="Formuleer je conclusie, onderbouw je analyse en bespreek een mogelijke tegenwerping…"
        className="w-full resize-y rounded-card border-2 border-line-strong bg-surface p-4 text-body leading-relaxed focus:border-blue-ink" />
      <p className="mt-2 text-caption text-ink-muted">{words} woorden · minimaal {exercise.minWords}. Je analyse blijft lokaal bewaard.</p>
      <p className="mt-2 text-small text-ink-muted">Deze opdracht beoordeel je zelf aan de hand van een model en criteria. Ze telt niet mee in je objectieve toetsscore.</p>
      {answer.checked && (
        <div className="mt-6 space-y-5">
          <div className="rounded-card border border-blue-line bg-blue-soft p-5">
            <h3 className="flex items-center gap-2 font-display font-bold text-blue-ink"><Lightbulb aria-hidden className="size-5" />Een mogelijke uitwerking</h3>
            <p className="mt-3 whitespace-pre-line text-body leading-relaxed text-ink-soft">{exercise.model}</p>
          </div>
          <fieldset>
            <legend className="mb-3 font-display font-bold">Controleer je eigen werk</legend>
            <p className="mb-3 text-small text-ink-muted">Vink een criterium aan als jouw tekst eraan voldoet. Kies ‘Herzien’ om je analyse te verbeteren.</p>
            {exercise.rubric.map((item, index) => <label key={item} className="mb-2 flex cursor-pointer items-start gap-3 rounded-control border border-line bg-surface p-4 text-small leading-relaxed">
              <input type="checkbox" checked={answer.rubric[String(index)] ?? false} onChange={(event) => onChange({ rubric: { ...answer.rubric, [String(index)]: event.target.checked } })} className="mt-1 size-4 shrink-0 accent-[var(--color-blue-ink)]" />
              {item}
            </label>)}
          </fieldset>
        </div>
      )}
    </div>
  );
}

export function ArgumentExerciseView({ exercise, answer, onChange, headingRef }: Props) {
  return (
    <div className="space-y-6">
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-title font-bold leading-snug outline-none">{exercise.prompt}</h2>
      {exercise.scenario && <div className="rounded-card border-l-4 border-blue-ink bg-sunken p-5 sm:p-6"><p className="mb-2 text-caption font-bold tracking-wider text-blue-ink uppercase">Casus</p><p className="whitespace-pre-line text-body leading-relaxed text-ink-soft">{exercise.scenario}</p></div>}
      {exercise.kind === 'choice' ? <Choice exercise={exercise} answer={answer} onChange={onChange} />
        : exercise.kind === 'reflection' ? <Reflection exercise={exercise} answer={answer} onChange={onChange} />
          : <Assignment exercise={exercise} answer={answer} onChange={onChange} />}
      {exercise.kind !== 'reflection' && <div className="space-y-5 border-t border-line pt-5">
        <fieldset><legend className="mb-2 font-display text-small font-bold">Hoe zeker ben je van je antwoord?</legend><p className="mb-3 text-caption text-ink-muted">Leg je verwachting vast voordat je de feedback ziet. Je zekerheid verandert je score niet.</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{['Ik twijfel', 'Voorlopig', 'Redelijk zeker', 'Zeer zeker'].map((label, index) => <label key={label} className={cn('flex min-h-12 cursor-pointer items-center gap-2 rounded-control border p-3 text-small', answer.confidence === index ? 'border-purple-line bg-purple-soft' : 'border-line bg-surface', answer.checked && 'cursor-default')}><input type="radio" name={`confidence-${exercise.id}`} checked={answer.confidence === index} disabled={answer.checked} onChange={() => onChange({ confidence: index })} className="size-4 shrink-0 accent-[var(--color-purple-ink)]" />{label}</label>)}</div></fieldset>
        <details className="rounded-control border border-line bg-sunken p-4"><summary className="cursor-pointer text-small font-bold">Denk hardop: waarom deze analyse?</summary><label htmlFor={`reasoning-${exercise.id}`} className="mt-3 block text-caption text-ink-muted">Welke aanname of verbinding is doorslaggevend? Welke andere interpretatie heb je verworpen?</label><textarea id={`reasoning-${exercise.id}`} value={answer.reasoning} readOnly={answer.checked} onChange={(event) => onChange({ reasoning: event.target.value })} rows={4} className="mt-2 w-full resize-y rounded-control border border-line-strong bg-surface p-3 text-small leading-relaxed" /><p className="mt-2 text-caption text-ink-muted">Je onderbouwing wordt bij afronden opgenomen in je lokale studieportfolio. Dit is zelfuitleg; de tekst wordt niet automatisch inhoudelijk beoordeeld.</p></details>
      </div>}
    </div>
  );
}
