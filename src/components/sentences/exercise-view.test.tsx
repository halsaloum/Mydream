import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { segmentation, tokens } from '@/content/sentences/helpers';
import type { DebugExercise, GateExercise, MutatorExercise, SentenceAnswer, SentenceExercise, SlotExercise, TetherExercise } from '@/content/sentences/types';
import { diagnosisCorrect, emptySentenceAnswer, segmentationCorrect } from '@/lib/sentences/learning';
import { SentenceExerciseView } from './exercise-view';

vi.mock('@/lib/motion', () => ({ useCalmMotion: () => true, spring: { layout: { duration: 0 } } }));

const base = { ruleId: 'v2', support: 'volledig' as const, explanation: 'De persoonsvorm houdt zijn positie.', hint: 'Tel zinsdelen, geen losse woorden.' };
const slots: SlotExercise = {
  ...base, id: 'test-slots', kind: 'slots', prompt: 'Zet vandaag voorop.',
  blocks: [{ id: 'subject', text: 'de leerlingen', role: 'onderwerp' }, { id: 'verb', text: 'lezen', role: 'persoonsvorm' }, { id: 'today', text: 'vandaag', role: 'tijd' }, { id: 'object', text: 'een boek', role: 'voorwerp' }],
  slots: [{ id: 'front', label: 'Voorveld', capacity: 1 }, { id: 'pv', label: 'Persoonsvorm', capacity: 1 }, { id: 'middle', label: 'Middenveld' }],
  initial: { front: ['subject'], pv: ['verb'], middle: ['today', 'object'] },
  accept: [{ front: ['today'], pv: ['verb'], middle: ['subject', 'object'] }],
  collision: { front: 'front', middle: 'middle', subject: 'subject' },
};
const gate: GateExercise = {
  ...base, id: 'test-gate', kind: 'gate', prompt: 'Onderzoek de persoonsvorm.',
  diagnosis: { prompt: 'Kies de persoonsvorm.', tokens: tokens('Vandaag leest Noor'), targets: ['w1'], feedback: 'Leest is de persoonsvorm.' },
  options: [{ id: 'a', text: 'De persoonsvorm is tweede.', feedback: 'Je telt de zinsdelen.' }, { id: 'b', text: 'Het onderwerp is altijd eerste.', feedback: 'Inversie maakt een andere volgorde mogelijk.' }, { id: 'c', text: 'Elk woord is een zinsdeel.', feedback: 'Een zinsdeel kan uit meer woorden bestaan.' }], answer: 'a',
};
const tether: TetherExercise = {
  ...base, id: 'test-tether', kind: 'tether', prompt: 'Verbind het afhankelijke woord met zijn kern.',
  tokens: tokens('de jonge leerling leest'), links: [{ from: 'w1', to: 'w2' }],
  distractorFeedback: { 'w1:w3': 'Jonge beschrijft de leerling, niet de handeling.' },
};
const mutator: MutatorExercise = {
  ...base, id: 'test-mutate', kind: 'mutate', prompt: 'Maak er een vraag van.', original: 'Noor leest vandaag.', target: 'question',
  variants: [{ id: 'question', label: 'Maak een vraag', blocks: [{ id: 'n', text: 'Noor' }, { id: 'l', text: 'Leest' }, { id: 't', text: 'vandaag?' }], order: ['l', 'n', 't'], note: 'De persoonsvorm verandert van plaats.' }, { id: 'front', label: 'Begin met tijd', blocks: [{ id: 'n', text: 'Noor' }, { id: 'l', text: 'leest' }, { id: 't', text: 'Vandaag' }], order: ['t', 'l', 'n'], note: 'Kijk wat het onderwerp doet.' }],
};
const debug: DebugExercise = {
  ...base, support: 'zelfstandig', id: 'test-debug', kind: 'debug', prompt: 'Onderzoek en herstel de zin.',
  tokens: tokens('Vandaag Noor leest een boek.'), targets: ['w1', 'w2'], instruction: 'Herstel de volgorde zonder woorden te schrappen.', repairs: ['Vandaag leest Noor een boek.'],
};

function Harness({ exercise, initial = emptySentenceAnswer(), disabled = false }: { exercise: SentenceExercise; initial?: SentenceAnswer; disabled?: boolean }) {
  const [answer, setAnswer] = useState(initial);
  return <>
    <SentenceExerciseView exercise={exercise} answer={answer} disabled={disabled}
      onChange={(patch) => setAnswer((current) => ({ ...current, ...patch, checked: false, correct: false }))}
      onDiagnose={() => { const correct = diagnosisCorrect(exercise, answer); setAnswer({ ...answer, diagnosisPassed: correct }); return correct; }}
      onSegment={() => { const correct = segmentationCorrect(exercise, answer); setAnswer({ ...answer, segmentationPassed: correct }); return correct; }} />
    <pre aria-label="Saved answer">{JSON.stringify(answer)}</pre>
  </>;
}

function saved(): SentenceAnswer {
  return JSON.parse(screen.getByLabelText('Saved answer').textContent ?? '{}') as SentenceAnswer;
}

describe('interactive sentence engines', () => {
  it('makes front-field collision move the old subject into the middle, then supports real ordering within that slot', () => {
    render(<Harness exercise={slots} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Plaats vandaag in' }), { target: { value: 'front' } });
    expect(saved().placements).toEqual({ front: ['today'], pv: ['verb'], middle: ['subject', 'object'] });
    expect(screen.getByRole('button', { name: 'Kies blok vandaag' })).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('schuift naar het midden');
    fireEvent.click(screen.getByRole('button', { name: 'de leerlingen later in Middenveld' }));
    expect(saved().placements.middle).toEqual(['object', 'subject']);
    fireEvent.click(screen.getByRole('button', { name: 'de leerlingen eerder in Middenveld' }));
    expect(saved().placements.middle).toEqual(['subject', 'object']);
  });

  it('allows touch/keyboard placement without dragging and capacity one never contains two blocks', () => {
    render(<Harness exercise={slots} />);
    fireEvent.click(screen.getByRole('button', { name: 'Kies blok vandaag' }));
    fireEvent.click(within(screen.getByRole('region', { name: 'Zinsplek 1' })).getByRole('button', { name: 'Zet gekozen blok hier' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Plaats een boek in' }), { target: { value: 'pv' } });
    expect(saved().placements.front).toEqual(['today']);
    expect(saved().placements.pv).toEqual(['object']);
    expect(within(screen.getByRole('region', { name: 'Losse blokken' })).getByRole('button', { name: 'Kies blok lezen' })).toBeVisible();
  });

  it('accepts an HTML drag into the front slot and applies the same collision and inversion', () => {
    render(<Harness exercise={slots} />);
    const dataTransfer = { setData: vi.fn(), getData: () => 'today', effectAllowed: '', dropEffect: '' };
    fireEvent.dragStart(screen.getByRole('button', { name: 'Kies blok vandaag' }), { dataTransfer });
    expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'today');
    const front = screen.getByRole('region', { name: 'Zinsplek 1' });
    fireEvent.dragOver(front, { dataTransfer });
    fireEvent.drop(front, { dataTransfer });
    expect(saved().placements).toEqual({ front: ['today'], pv: ['verb'], middle: ['subject', 'object'] });
  });

  it('keeps three explanatory choices locked until the learner makes a correct token diagnosis', () => {
    render(<Harness exercise={gate} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled());
    fireEvent.click(screen.getByRole('button', { name: 'Vandaag kiezen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Controleer mijn diagnose' }));
    expect(screen.getByRole('status')).toHaveTextContent('nog niet volledig');
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled());
    fireEvent.click(screen.getByRole('button', { name: 'Vandaag kiezen' }));
    fireEvent.click(screen.getByRole('button', { name: 'leest kiezen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Controleer mijn diagnose' }));
    expect(screen.getByRole('status')).toHaveTextContent('Leest is de persoonsvorm.');
    fireEvent.click(screen.getByRole('radio', { name: /De persoonsvorm is tweede/ }));
    expect(saved().choice).toBe('a');
  });

  it('requires the learner to segment the actual words before the scaffolded exercise opens', () => {
    const half: SlotExercise = { ...slots, support: 'half', segmentation: segmentation(['de leerlingen', 'lezen', 'vandaag', 'een boek']) };
    render(<Harness exercise={half} />);
    expect(screen.queryByRole('combobox', { name: 'Plaats vandaag in' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Grens na de (woord 1)' }));
    fireEvent.click(screen.getByRole('button', { name: 'Controleer mijn bouwblokken' }));
    expect(screen.queryByRole('combobox', { name: 'Plaats vandaag in' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(half.segmentation!.feedback);
    fireEvent.click(screen.getByRole('button', { name: 'Grens na de (woord 1)' }));
    ['Grens na leerlingen (woord 2)', 'Grens na lezen (woord 3)', 'Grens na vandaag (woord 4)'].forEach((name) => fireEvent.click(screen.getByRole('button', { name })));
    fireEvent.click(screen.getByRole('button', { name: 'Controleer mijn bouwblokken' }));
    expect(saved().boundaries).toEqual([2, 3, 4]);
    expect(saved().segmentationPassed).toBe(true);
    expect(screen.getByRole('combobox', { name: 'Plaats vandaag in' })).toBeEnabled();
  });

  it('builds a directed dependency from two word selections and lets the learner remove and replace it', () => {
    render(<Harness exercise={tether} />);
    fireEvent.click(screen.getByRole('button', { name: 'Verbind vanaf of naar jonge' }));
    fireEvent.click(screen.getByRole('button', { name: 'Verbind vanaf of naar leest' }));
    expect(saved().links).toEqual([{ from: 'w1', to: 'w3' }]);
    fireEvent.click(screen.getByRole('button', { name: 'Verwijder verbinding jonge naar leest' }));
    expect(saved().links).toEqual([]);
    fireEvent.click(screen.getByRole('button', { name: 'Verbind vanaf of naar jonge' }));
    fireEvent.click(screen.getByRole('button', { name: 'Verbind vanaf of naar leerling' }));
    expect(saved().links).toEqual([{ from: 'w1', to: 'w2' }]);
  });

  it('reports the specific cause of a wrong dependency instead of coloring the original words as a solution', () => {
    render(<Harness exercise={tether} initial={{ ...emptySentenceAnswer(), checked: true, links: [{ from: 'w1', to: 'w3' }] }} />);
    expect(screen.getByText('Jonge beschrijft de leerling, niet de handeling.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Verbind vanaf of naar jonge' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Verbind vanaf of naar leerling' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('supports authored distractor-token feedback while keeping an edge-specific explanation more precise', () => {
    const initial = { ...emptySentenceAnswer(), checked: true, links: [{ from: 'w1', to: 'w3' }] };
    const view = render(<Harness exercise={{ ...tether, distractorFeedback: { ...tether.distractorFeedback, w3: 'Leest noemt de handeling.' } }} initial={initial} />);
    expect(screen.getByText('Jonge beschrijft de leerling, niet de handeling.')).toBeVisible();
    expect(screen.queryByText('Leest noemt de handeling.')).not.toBeInTheDocument();
    view.unmount();
    render(<Harness exercise={{ ...tether, distractorFeedback: { w3: 'Leest noemt de handeling.' } }} initial={initial} />);
    expect(screen.getByText('Leest noemt de handeling.')).toBeVisible();
  });

  it('also connects a dependency with a pointer gesture and allows the next independent tap', () => {
    render(<Harness exercise={tether} />);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Verbind vanaf of naar jonge' }));
    fireEvent.pointerUp(screen.getByRole('button', { name: 'Verbind vanaf of naar leerling' }));
    expect(saved().links).toEqual([{ from: 'w1', to: 'w2' }]);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Verbind vanaf of naar de' }));
    fireEvent.pointerUp(screen.getByRole('button', { name: 'Verbind vanaf of naar de' }));
    fireEvent.click(screen.getByRole('button', { name: 'Verbind vanaf of naar de' }));
    expect(screen.getByRole('button', { name: 'Verbind vanaf of naar de' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('starts mutation reconstruction in a stable unsolved order, moves actual blocks, and preserves a saved order', () => {
    const view = render(<Harness exercise={mutator} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Maak een vraag' }));
    const initial = [...saved().order];
    expect(initial).not.toEqual(['l', 'n', 't']);
    expect([...initial].sort()).toEqual(['l', 'n', 't'].sort());
    const firstText = mutator.variants[0]!.blocks.find((block) => block.id === initial[0])!.text;
    fireEvent.click(screen.getByRole('button', { name: `${firstText} naar achteren` }));
    expect(saved().order[1]).toBe(initial[0]);
    const draft = saved();
    view.unmount();
    render(<Harness exercise={mutator} initial={draft} />);
    expect(saved().order).toEqual(draft.order);
    expect(within(screen.getByRole('list')).getAllByRole('listitem')[1]).toHaveTextContent(firstText);
  });

  it('shows plain debugger tokens and unlocks a constrained text repair only after the correct evidence is selected', () => {
    render(<Harness exercise={debug} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.queryByText(debug.hint)).not.toBeInTheDocument();
    expect(screen.queryByText(debug.instruction)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Noor kiezen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Controleer mijn diagnose' }));
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.queryByText(debug.instruction)).not.toBeInTheDocument();
    expect(screen.getByText('Ik heb geprobeerd: toon een denkstap')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'leest kiezen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Controleer mijn diagnose' }));
    expect(screen.getByRole('textbox')).toBeEnabled();
    expect(screen.getByText(debug.instruction)).toBeVisible();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Vandaag leest Noor een boek.' } });
    expect(saved().text).toBe('Vandaag leest Noor een boek.');
    expect(saved().diagnosisPassed).toBe(true);
  });

  it('exposes optional independent help only after a failed attempt and disables every finished control', () => {
    const first = render(<Harness exercise={debug} initial={{ ...emptySentenceAnswer(), checked: true, text: 'Mijn poging.' }} />);
    expect(screen.getByText('Ik heb geprobeerd: toon een denkstap')).toBeVisible();
    first.unmount();
    render(<Harness exercise={slots} disabled />);
    screen.getAllByRole('button').forEach((button) => expect(button).toBeDisabled());
    screen.getAllByRole('combobox').forEach((select) => expect(select).toBeDisabled());
  });
});
