import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ArgumentDiagram, ArgumentMapWorkshop } from './map-workshop';
import { ARGUMENT_MAP_PRESETS } from '@/lib/argumentation/maps';
import { EMPTY_ARGUMENTS, useArgumentation } from '@/state/argumentation';

vi.mock('@/state/hydration', () => ({ useHydrated: () => true }));
beforeEach(() => useArgumentation.setState(EMPTY_ARGUMENTS));

describe('a reachable argument-map workbench', () => {
  it('embeds a fixed case and preserves its draft when the surrounding lesson changes case', () => {
    const { rerender } = render(<ArgumentMapWorkshop presetId="convergent" embedded />);
    expect(screen.queryByRole('group', { name: 'Kies een argumentstructuur' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Maak deze kaart je eigen.', level: 3 })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Een kaart van je redenering.', level: 2 })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Afleiding i2')).toBeVisible();
    fireEvent.click(screen.getByRole('link', { name: 'Uitspraken' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Tekst van p1' }), { target: { value: 'Mijn eigen toegangsreden blijft bij deze afzonderlijke casus bewaard.' } });
    rerender(<ArgumentMapWorkshop presetId="linked" embedded />);
    expect(screen.queryByLabelText('Afleiding i2')).not.toBeInTheDocument();
    rerender(<ArgumentMapWorkshop presetId="convergent" embedded />);
    fireEvent.click(screen.getByRole('link', { name: 'Uitspraken' }));
    expect(screen.getByRole('textbox', { name: 'Tekst van p1' })).toHaveValue('Mijn eigen toegangsreden blijft bij deze afzonderlijke casus bewaard.');
    expect(screen.queryByRole('group', { name: 'Kies een argumentstructuur' })).not.toBeInTheDocument();
  });

  it('lets a learner author and connect a genuine new reason, then test its independent support', () => {
    render(<ArgumentMapWorkshop />);
    fireEvent.click(screen.getByRole('link', { name: 'Uitspraken' }));
    const original = screen.getByRole('textbox', { name: 'Tekst van p2' });
    fireEvent.change(original, { target: { value: 'De verplichte avondstudie loopt tot 22.00 uur en er is geen rustige andere plek.' } });
    expect(within(screen.getByRole('article', { name: 'Premisse / data p2' })).getByText('De verplichte avondstudie loopt tot 22.00 uur en er is geen rustige andere plek.')).toBeVisible();
    fireEvent.change(screen.getByRole('textbox', { name: 'Formuleer een volledige uitspraak' }), { target: { value: 'Avondopenstelling maakt de collectie bereikbaar voor werkende studenten.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Voeg mijn uitspraak toe' }));
    const builder = within(screen.getByRole('region', { name: 'Verbind je eigen redenering' }));
    fireEvent.click(builder.getByRole('checkbox', { name: /^n1:/ }));
    fireEvent.change(builder.getByRole('textbox', { name: /^Wat rechtvaardigt de stap/ }), { target: { value: 'I2 · toegang voor werkende studenten' } });
    fireEvent.click(builder.getByRole('button', { name: 'Maak mijn afleiding' }));
    expect(screen.getByLabelText('Afleiding i2')).toHaveTextContent('I2 · toegang voor werkende studenten');
    const prediction = within(screen.getByRole('region', { name: 'Voorspel de tegenproef' }));
    expect(screen.queryByText('Getoetste tegenproef · na jouw voorspelling')).not.toBeInTheDocument();
    fireEvent.click(prediction.getByRole('radio', { name: 'Er blijven volledige afleidingen over, maar minder dan daarvoor.' }));
    expect(screen.queryByText('Getoetste tegenproef · na jouw voorspelling')).not.toBeInTheDocument();
    fireEvent.click(prediction.getByRole('button', { name: 'Leg vast en toon de tegenproef' }));
    expect(prediction.getByText('Je voorspelling past bij deze reconstructie')).toBeVisible();
    expect(prediction.getByText('Van 2 naar 1 volledige afleiding.')).toBeVisible();
    expect(prediction.getByRole('status')).toHaveFocus();
    expect(prediction.getByText('Getoetste tegenproef · na jouw voorspelling')).toBeVisible();
    fireEvent.click(prediction.getByRole('button', { name: 'Voorspel opnieuw' }));
    expect(screen.queryByText('Getoetste tegenproef · na jouw voorspelling')).not.toBeInTheDocument();
    expect(prediction.getAllByRole('radio')[0]).toHaveFocus();
    expect(prediction.getByRole('button', { name: 'Leg vast en toon de tegenproef' })).toBeDisabled();
  });

  it('lets the learner target a contested inference before revealing its case interpretation', () => {
    render(<ArgumentMapWorkshop />);
    fireEvent.click(screen.getByRole('button', { name: 'Convergent' }));
    const attacks = within(screen.getByRole('region', { name: 'Beoordeel wat de tegenwerping raakt' }));
    fireEvent.change(attacks.getByRole('combobox', { name: 'Wat betwist deze tegenwerping?' }), { target: { value: 'undercut:i2' } });
    fireEvent.change(attacks.getByRole('textbox', { name: /^Waarom raakt mijn tegenwerping/ }), { target: { value: 'De observatie kan waar zijn, maar de generalisatie naar gewone weken is onzeker.' } });
    fireEvent.click(attacks.getByRole('button', { name: 'Verbind mijn tegenwerping' }));
    expect(screen.getByLabelText('Afleiding i2')).toHaveTextContent('Betwist');
    expect(attacks.queryByText(/Je gekozen doelwit past bij deze casusduiding/)).not.toBeInTheDocument();
    fireEvent.click(attacks.getByRole('button', { name: 'Vergelijk met casusduiding' }));
    expect(attacks.getByText(/De afzonderlijke toegangsroute i1 kan blijven bestaan/)).toBeVisible();
    fireEvent.click(screen.getByRole('link', { name: 'Uitspraken' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Tekst van p2' }), { target: { value: 'Een volledig andere premisse met een andere rechtvaardiging.' } });
    expect(attacks.getByText(/structureel toegestaan, maar dat beoordeelt haar inhoudelijke relevantie niet/)).toBeVisible();
    expect(attacks.queryByText(/Je gekozen doelwit past bij deze casusduiding/)).not.toBeInTheDocument();
  });

  it('does not treat zero existing routes as routes that disappear', () => {
    render(<ArgumentMapWorkshop />);
    fireEvent.click(screen.getByRole('button', { name: 'Verwijder afleiding i1' }));
    const prediction = within(screen.getByRole('region', { name: 'Voorspel de tegenproef' }));
    fireEvent.click(prediction.getByRole('radio', { name: 'Het aantal volledige afleidingen blijft gelijk.' }));
    fireEvent.click(prediction.getByRole('button', { name: 'Leg vast en toon de tegenproef' }));
    expect(prediction.getByText('Je voorspelling past bij deze reconstructie')).toBeVisible();
    expect(prediction.getByText(/Er bestond al geen volledige afleiding/)).toBeVisible();
  });

  it('rejects a circular connection without changing the working diagram', () => {
    render(<ArgumentMapWorkshop />);
    const builder = within(screen.getByRole('region', { name: 'Verbind je eigen redenering' }));
    fireEvent.click(builder.getByRole('checkbox', { name: /^c:/ }));
    fireEvent.change(builder.getByRole('combobox', { name: 'Doel van de afleiding' }), { target: { value: 'p1' } });
    fireEvent.click(builder.getByRole('button', { name: 'Maak mijn afleiding' }));
    expect(screen.getByRole('status')).toHaveTextContent('acyclisch');
    expect(screen.queryByLabelText('Afleiding i2')).not.toBeInTheDocument();
  });

  it('does not render an inactive objection as an active attack', () => {
    const source = ARGUMENT_MAP_PRESETS.find((item) => item.id === 'linked')!;
    render(<ArgumentDiagram nodes={source.nodes.map((node) => node.id === 'o' ? { ...node, active: false } : node)} inferences={source.inferences} attacks={[{ id: 'a1', from: 'o', to: 'i1', kind: 'undercut' }]} />);
    expect(screen.getByLabelText('Afleiding i1')).not.toHaveTextContent('Betwist');
    expect(screen.queryByText('Undercut op een afleiding:')).not.toBeInTheDocument();
    expect(screen.getByText(/Tegenwerping · o · uitgeschakeld/)).toBeVisible();
  });

  it('restores a learner’s map and reasoning across case switches and remounts', () => {
    const { unmount } = render(<ArgumentMapWorkshop />);
    fireEvent.click(screen.getByRole('link', { name: 'Uitspraken' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Tekst van p1' }), { target: { value: 'Een afspraak geldt alleen wanneer zij voor alle teamleden uitvoerbaar is.' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Mijn verklaring vóór de tegenproef' }), { target: { value: 'Deze algemene regel heeft de concrete situatie als tweede premisse nodig.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convergent' }));
    fireEvent.click(screen.getByRole('button', { name: 'Gekoppeld' }));
    expect(screen.getByRole('textbox', { name: 'Tekst van p1' })).toHaveValue('Een afspraak geldt alleen wanneer zij voor alle teamleden uitvoerbaar is.');
    expect(screen.getByRole('textbox', { name: 'Mijn verklaring vóór de tegenproef' })).toHaveValue('Deze algemene regel heeft de concrete situatie als tweede premisse nodig.');
    expect(useArgumentation.getState().workshops.linked?.nodes.find((node) => node.id === 'p1')?.text).toBe('Een afspraak geldt alleen wanneer zij voor alle teamleden uitvoerbaar is.');
    unmount();
    render(<ArgumentMapWorkshop />);
    fireEvent.click(screen.getByRole('link', { name: 'Uitspraken' }));
    expect(screen.getByRole('textbox', { name: 'Tekst van p1' })).toHaveValue('Een afspraak geldt alleen wanneer zij voor alle teamleden uitvoerbaar is.');
    expect(screen.getByRole('textbox', { name: 'Mijn verklaring vóór de tegenproef' })).toHaveValue('Deze algemene regel heeft de concrete situatie als tweede premisse nodig.');
    fireEvent.click(screen.getByRole('button', { name: 'Herstel de casus' }));
    expect(screen.getByRole('textbox', { name: 'Tekst van p1' })).toHaveValue(ARGUMENT_MAP_PRESETS[0]!.nodes[0]!.text);
    expect(screen.getByRole('textbox', { name: 'Mijn verklaring vóór de tegenproef' })).toHaveValue('');
  });
});
