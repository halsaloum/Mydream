'use client';

import { Check, PencilLine, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { inspectFix, inspectLabel, inspectRepair, inspectSelect, inspectVerdicts, type Note } from '@/engine/argument';
import { permutation } from '@/engine/hash';
import { play } from '@/lib/sound';
import { Tile } from '../../tile';
import { InlineFeedback, Stage, StepIntro, type StepProps } from '../shared';

/** Een oordeel zonder onderbouwde verbetering rondt een gebrekkige redenering niet af. */
export function InspectStep({ step, response, onChange, locked, seed }: StepProps<'inspect'>) {
  const [note, setNote] = useState<Note | null>(null);
  const selected = response.sel;
  const row = selected === null ? undefined : step.rows[selected];
  const judged = selected !== null && response.judged.includes(selected);
  const fixed = selected !== null && response.fixed.includes(selected);
  const verdicts = inspectVerdicts(step);
  const verdictOrder = useMemo(() => permutation(`${seed}:inspect-verdicts`, step.fallacies.length + 1), [seed, step.fallacies.length]);
  const fixCount = row && 'fallacy' in row ? row.fixes.length : 0;
  const fixOrder = useMemo(() => permutation(`${seed}:inspect-fixes:${selected}`, fixCount), [seed, selected, fixCount]);
  const complete = step.rows.every((item, index) => response.judged.includes(index) && (!('fallacy' in item) || response.fixed.includes(index)));

  const select = (index: number) => {
    if (locked) return;
    onChange(inspectSelect(response, index));
    setNote(null);
    play('select');
  };

  const label = (index: number) => {
    if (locked || selected === null || !row || judged) return;
    const move = inspectLabel(step, response, index);
    if (move.response === response) return;
    const feedback: Note = move.note ?? { tone: 'right', text: row.why };
    onChange(move.response);
    setNote(feedback);
    play(feedback.tone === 'wrong' ? 'wrong' : 'right');
  };

  const repair = (index: number) => {
    if (locked || selected === null || !row || !('fallacy' in row) || !judged || fixed) return;
    const move = inspectFix(step, response, index);
    if (move.response === response) return;
    const feedback: Note = move.note ?? { tone: 'right', text: row.fixes[index]!.why };
    onChange(move.response);
    setNote(feedback);
    play(feedback.tone === 'wrong' ? 'wrong' : 'right');
  };

  return (
    <div>
      <StepIntro prompt={step.prompt} intro={step.intro} />
      <section className="mt-6" aria-label="Zinnen onderzoeken">
        <h2 className="font-display text-title-sm font-extrabold text-ink">{step.heading ?? 'De tekst onder de loep'}</h2>
        <p className="mt-2 text-small text-ink-soft">Kies een zin, geef je oordeel en herstel een drogreden waar dat nodig is. Een zin kan ook in orde zijn.</p>
        <ol className="mt-4 space-y-3">
          {step.rows.map((item, index) => {
            const itemJudged = response.judged.includes(index);
            const itemFixed = response.fixed.includes(index);
            const repaired = itemFixed ? inspectRepair(step, index) : undefined;
            const finished = itemJudged && (!('fallacy' in item) || itemFixed);
            return (
              <li key={index}>
                <Tile size="block" disabled={locked} aria-pressed={selected === index} aria-label={`Zin ${index + 1}: ${repaired?.t ?? item.t}`} state={finished ? 'correct' : selected === index ? 'held' : 'idle'} onClick={() => select(index)}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sunken font-display text-small font-bold">{finished ? <Check aria-hidden className="size-5" /> : index + 1}</span>
                  <span>
                    {repaired && <span className="mb-2 block text-small text-ink-muted line-through">{item.t}</span>}
                    <span>{repaired?.t ?? item.t}</span>
                    <span className="mt-2 block font-sans text-caption font-bold text-ink-soft">{finished ? (repaired ? 'Verbeterd' : 'Beoordeeld') : itemJudged ? 'Nog herstellen' : 'Nog beoordelen'}</span>
                  </span>
                </Tile>
                {itemJudged && <p className="mt-2 px-2 text-small text-ink-soft"><strong>{'fallacy' in item ? item.fallacy : item.role}: </strong>{repaired?.why ?? item.why}</p>}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-small font-semibold text-ink-muted" role="status">{response.judged.length} van {step.rows.length} zinnen beoordeeld · {response.fixed.length} verbeterd</p>
      </section>

      {row && selected !== null ? (
        <section className="mt-6" aria-label={`Beoordeling van zin ${selected + 1}`}>
          <h2 className="flex items-center gap-2 font-display text-title-sm font-extrabold text-ink">
            {judged && 'fallacy' in row && !fixed ? <PencilLine aria-hidden className="size-5" /> : <Search aria-hidden className="size-5" />}
            {judged && 'fallacy' in row && !fixed ? `Herstel zin ${selected + 1}` : `Onderzoek zin ${selected + 1}`}
          </h2>
          <Stage className="mt-3"><p className="font-serif text-example text-ink">{fixed ? inspectRepair(step, selected)?.t : row.t}</p></Stage>
          {!judged && (
            <fieldset className="mt-4">
              <legend className="mb-3 text-body font-semibold text-ink">Welk oordeel past bij deze zin?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {verdictOrder.map((index) => {
                  const tried = response.tried.includes(`l${selected}-${index}`);
                  return <Tile key={index} size="block" disabled={locked || tried} state={tried ? 'wrong' : 'idle'} onClick={() => label(index)}>{verdicts[index]}</Tile>;
                })}
              </div>
              {!note && response.tried.some((key) => key.startsWith(`l${selected}-`)) && <p className="mt-3 text-small text-ink-soft">{row.hint}</p>}
            </fieldset>
          )}
          {judged && 'fallacy' in row && !fixed && (
            <fieldset className="mt-4">
              <legend className="mb-3 text-body font-semibold text-ink">Welke versie herstelt de redenering?</legend>
              <div className="grid gap-3">
                {fixOrder.map((index) => {
                  const option = row.fixes[index]!;
                  const tried = response.tried.includes(`f${selected}-${index}`);
                  return (
                    <div key={index}>
                      <Tile size="block" disabled={locked || tried} state={tried ? 'wrong' : 'idle'} onClick={() => repair(index)}>{option.t}</Tile>
                      {tried && <p className="mt-2 px-2 text-small text-red-ink">{option.why}</p>}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          )}
          {judged && (!('fallacy' in row) || fixed) && <p className="mt-3 text-body font-semibold text-green-ink">{complete ? 'Alle zinnen zijn onderzocht; de drogredenen zijn hersteld.' : 'Deze zin is klaar. Kies een andere zin om verder te onderzoeken.'}</p>}
        </section>
      ) : <p className="mt-6 rounded-control border-2 border-dashed border-line p-4 text-body text-ink-soft">Kies hierboven een zin om je beoordeling te beginnen.</p>}
      <InlineFeedback className="mt-4" tone={note?.tone ?? 'info'} id={`${selected}:${response.judged.length}:${response.fixed.length}:${response.mistakes}`}>{note?.text}</InlineFeedback>
    </div>
  );
}
