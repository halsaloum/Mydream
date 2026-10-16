import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getDemo } from '@/content/demo';
import type { StepKind, StepOf } from '@/content/schema';
import { ProofreadStep } from '../extra/proofread';
import { renderStep } from '../test-utils';
import { ClozeStep } from './cloze';
import { DrillStep } from './drill';
import { flashMs, PassageStep } from './passage';

function demo<K extends StepKind>(slug: string, kind: K): StepOf<K> {
  const step = getDemo(slug)?.step;
  expect(step?.kind).toBe(kind);
  return step as StepOf<K>;
}

afterEach(() => {
  vi.useRealTimers();
});

describe('lange spellingoefeningen', () => {
  it('invultekst: Enter springt naar het volgende vakje en controleert in het laatste', async () => {
    const user = userEvent.setup();
    const step = demo('invultekst', 'cloze');
    const view = renderStep(ClozeStep, step);

    await user.click(screen.getByRole('textbox', { name: /Vakje 1 van 4/ }));
    await user.keyboard('gisteravond{Enter}badkamer{Enter}gront{Enter}hout{Enter}');

    expect(view.state.locked).toBe(true);
    expect(view.state.correct).toBe(false);
    expect(view.state.response.values).toEqual(['gisteravond', 'badkamer', 'gront', 'hout']);
    expect(screen.getByRole('heading', { name: 'Zo moest het' })).toBeInTheDocument();
    expect(screen.getByText('gronden: dus d.')).toBeInTheDocument();
  });

  it('reeks: een fout woord komt achteraan terug, en de reeks rondt zichzelf af', async () => {
    const user = userEvent.setup();
    const step = demo('reeks', 'drill');
    const view = renderStep(DrillStep, step);

    const field = () => screen.getByLabelText('Jouw antwoord');
    await user.type(field(), 'hant{Enter}');
    expect(await screen.findByText(/Juist: hand\. handen, dus hand\. Dit woord komt straks terug\./)).toBeInTheDocument();
    for (const word of ['paard', 'kaart', 'vind', 'goed']) await user.type(field(), `${word}{Enter}`);
    expect(screen.getByText('Nog een keer')).toBeInTheDocument();
    await user.type(field(), 'hand{Enter}');

    expect(view.state.locked).toBe(true);
    expect(view.state.correct).toBe(false);
    expect(view.state.response.answers).toHaveLength(6);
    expect(screen.getByRole('heading', { name: 'Deze gingen de eerste keer mis' })).toBeInTheDocument();
  });

  it('tekstdictee: zonder stem staat de zin even in beeld en typ je hem daarna uit je hoofd; elk woord wordt nagekeken', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const step = demo('tekstdictee', 'passage');
    const view = renderStep(PassageStep, step);

    await user.click(screen.getByRole('button', { name: 'Laat zin 1 even zien' }));
    expect(view.state.response.peeks).toEqual([1, 0, 0]);
    expect(screen.getByText(step.sentences[0]!)).toBeInTheDocument();
    // Overtypen terwijl de zin in beeld staat kan niet.
    expect(screen.getByRole('textbox', { name: 'Zin 1' })).toHaveAttribute('readonly');
    act(() => vi.advanceTimersByTime(flashMs(step.sentences[0]!) + 50));
    expect(screen.queryByText(step.sentences[0]!)).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Zin 1' })).not.toHaveAttribute('readonly');

    await user.type(screen.getByRole('textbox', { name: 'Zin 1' }), `${step.sentences[0]}{Enter}`);
    await user.keyboard(`${step.sentences[1]}{Enter}Gisteravond hebben we samen gegeeten.{Enter}`);

    expect(view.state.locked).toBe(true);
    expect(view.state.correct).toBe(false);
    expect(screen.getByLabelText('Zin 3 nagekeken')).toHaveTextContent('gegeeten.');
  });

  it('nakijken zonder hulp: je typt de verbetering zelf en zegt zelf dat je klaar bent', async () => {
    const user = userEvent.setup();
    const step = demo('nakijken-zonder-hulp', 'proofread');
    const view = renderStep(ProofreadStep, step);

    expect(screen.queryByText(/fouten te vinden/)).not.toBeInTheDocument();
    expect(screen.getByText('Beste meneer Smit,')).toBeInTheDocument();

    // Een woord dat fout lijkt maar goed is: veranderen kost een misser en je krijgt de reden.
    await user.click(screen.getByRole('button', { name: 'ligt' }));
    const editor = screen.getByLabelText('Verbeter ‘ligt’');
    await user.clear(editor);
    await user.type(editor, 'licht{Enter}');
    expect(view.state.response.slips).toBe(1);
    expect(await screen.findByText(/ligt komt van liggen/)).toBeInTheDocument();

    // Een echte fout: verbeteren met de goede spelling.
    await user.click(screen.getByRole('button', { name: 'gisteravont' }));
    const fix = screen.getByLabelText('Verbeter ‘gisteravont’');
    await user.clear(fix);
    await user.type(fix, 'gisteravond{Enter}');
    expect(view.state.response.found).toHaveLength(1);
    expect(view.state.locked).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Ik ben klaar' }));
    expect(view.state.locked).toBe(true);
    expect(view.state.correct).toBe(false);
    expect(screen.getByRole('heading', { name: 'Deze fouten zag je niet' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Deze woorden lijken fout, maar zijn goed' })).toBeInTheDocument();
  });

  it('nakijken zonder hulp: een woord overtypen zonder de punt kost niets, en een verbetering die nog in het vakje staat telt mee bij ‘Ik ben klaar’', async () => {
    const user = userEvent.setup();
    const step = demo('nakijken-zonder-hulp', 'proofread');
    const view = renderStep(ProofreadStep, step);

    // bet. is een fout; zonder punt overtypen is "laten staan": geen misser, en geen hint dat het fout is.
    await user.click(screen.getByRole('button', { name: 'bet.' }));
    const editor = screen.getByLabelText('Verbeter ‘bet.’');
    await user.clear(editor);
    await user.type(editor, 'bet{Enter}');
    expect(view.state.response.slips).toBe(0);
    expect(screen.queryByLabelText('Verbeter ‘bet.’')).not.toBeInTheDocument();

    // Verbetering getypt, maar meteen op Ik ben klaar getikt.
    await user.click(screen.getByRole('button', { name: 'bet.' }));
    const again = screen.getByLabelText('Verbeter ‘bet.’');
    await user.clear(again);
    await user.type(again, 'bed.');
    await user.click(screen.getByRole('button', { name: 'Ik ben klaar' }));
    expect(view.state.locked).toBe(true);
    const index = step.tokens.findIndex((token) => token.t === 'bet.');
    expect(view.state.response.found).toContain(index);
  });
});
