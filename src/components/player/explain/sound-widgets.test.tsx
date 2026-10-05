import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CONSONANT_TABLE } from '@/content/packs/tables';
import { GridWidget, TableauWidget, VowelsWidget } from './sound-widgets';
import type { WidgetProps } from './widgets';

// jsdom heeft geen canvas; de confetti doet hier niet ter zake.
vi.mock('@/lib/confetti', () => ({ celebrate: vi.fn(), originOf: () => undefined }));

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Rendert een experiment zoals de uitlegstap: "opgelost" blijft staan zodra het experiment het meldt. */
function show(widget: (solved: boolean, onSolved: () => void) => ReactNode) {
  const onSolved = vi.fn();
  function Harness() {
    const [solved, setSolved] = useState(false);
    return widget(solved, () => {
      onSolved();
      setSolved(true);
    });
  }
  render(<Harness />);
  return onSolved;
}

const HOOG: WidgetProps<'vowels'>['data'] = {
  q: 'Tik de hoge klinkers achter in de mond en voor in de mond',
  targets: ['i', 'u'],
  note: 'Hoog: je tong komt dicht bij je gehemelte.',
};

const HOND: WidgetProps<'tableau'>['data'] = {
  input: '/hɔnd/',
  constraints: [
    { name: 'IDENT(voice)', note: 'Verander de stem van een klank niet.' },
    { name: '∗VOICED-CODA', note: 'Geen stemhebbende klank aan het eind van een lettergreep.' },
  ],
  candidates: [
    { form: '[hɔnd]', marks: [0, 1] },
    { form: '[hɔnt]', marks: [1, 0] },
  ],
  winner: 1,
  goal: 'Laat [hɔnt] winnen',
  note: 'In het Nederlands staat ∗VOICED-CODA boven IDENT(voice).',
};

describe('klankexperimenten', () => {
  it('klinkerkaart: een foute klinker telt niet, alle gevraagde klinkers lossen op', async () => {
    const user = userEvent.setup();
    const onSolved = show((solved, done) => <VowelsWidget data={HOOG} solved={solved} onSolved={done} />);

    await user.click(screen.getByRole('button', { name: '/aː/ zoals in baan' }));
    expect(screen.getByRole('status')).toHaveTextContent('/aː/ hoort er niet bij. 0 van 2 gevonden.');
    expect(await screen.findByText('open · voor · gespannen')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '/i/ zoals in piet' }));
    expect(screen.getByRole('button', { name: '/i/ zoals in piet, gevonden' })).toHaveAttribute('aria-pressed', 'true');
    expect(onSolved).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: '/u/ zoals in boek' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent(HOOG.note);
  });

  it('klinkerkaart: tweeklanken staan er alleen bij als de les dat vraagt', () => {
    show((solved, done) => <VowelsWidget data={HOOG} solved={solved} onSolved={done} />);
    expect(screen.queryByRole('group', { name: 'Tweeklanken' })).not.toBeInTheDocument();

    show((solved, done) => <VowelsWidget data={{ ...HOOG, targets: ['œy'], glides: true }} solved={solved} onSolved={done} />);
    expect(screen.getByRole('group', { name: 'Tweeklanken' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '/œy/ zoals in huis' })).toBeInTheDocument();
  });

  it('klinkerkaart: leest het voorbeeldwoord voor als de browser kan praten', async () => {
    const speak = vi.fn();
    vi.stubGlobal('speechSynthesis', { speak, cancel: vi.fn(), getVoices: () => [] });
    vi.stubGlobal(
      'SpeechSynthesisUtterance',
      class {
        lang = '';
        rate = 1;
        text: string;
        constructor(text: string) {
          this.text = text;
        }
      },
    );
    const user = userEvent.setup();
    show((solved, done) => <VowelsWidget data={HOOG} solved={solved} onSolved={done} />);

    await user.click(screen.getByRole('button', { name: '/i/ zoals in piet' }));
    await user.click(await screen.findByRole('button', { name: 'Luister naar piet' }));
    expect(speak).toHaveBeenCalledWith(expect.objectContaining({ text: 'piet', lang: 'nl-NL' }));

    // Hoor het verschil: het minimale paar piet – pit.
    await user.click(screen.getByRole('button', { name: 'Luister naar pit, met /ɪ/' }));
    expect(speak).toHaveBeenLastCalledWith(expect.objectContaining({ text: 'pit' }));
    expect(screen.getByRole('button', { name: 'Vergelijk piet, pit, piet' })).toBeInTheDocument();
  });

  it('klinkerkaart: geen luisterknop als er alleen anderstalige stemmen zijn', async () => {
    vi.stubGlobal('speechSynthesis', { speak: vi.fn(), cancel: vi.fn(), getVoices: () => [{ name: 'English', lang: 'en-US', voiceURI: 'en' }] });
    vi.stubGlobal('SpeechSynthesisUtterance', class {});
    const user = userEvent.setup();
    show((solved, done) => <VowelsWidget data={HOOG} solved={solved} onSolved={done} />);

    await user.click(screen.getByRole('button', { name: '/i/ zoals in piet' }));
    expect(screen.queryByRole('button', { name: 'Luister naar piet' })).not.toBeInTheDocument();
  });

  it('klanktabel: zegt waar een klank staat en lost op met alle lipklanken', async () => {
    const user = userEvent.setup();
    const onSolved = show((solved, done) => (
      <GridWidget
        data={{ ...CONSONANT_TABLE, q: 'Tik alle klanken die je met twee lippen maakt', targets: ['p', 'b', 'm'], note: 'Twee lippen: p, b en m.' }}
        solved={solved}
        onSolved={done}
      />
    ));

    await user.click(screen.getByRole('button', { name: '/t/, plofklank, tandkas, zoals in tak' }));
    expect(screen.getByRole('status')).toHaveTextContent('/t/ hoort er niet bij.');
    expect(await screen.findByText('plofklank · tandkas')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '/p/, plofklank, lippen, zoals in pak' }));
    await user.click(screen.getByRole('button', { name: '/b/, plofklank, lippen, zoals in bak' }));
    expect(onSolved).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: '/m/, neusklank, lippen, zoals in mat' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Twee lippen: p, b en m.');
  });

  it('OT-tableau: twee eisen wisselen laat de andere kandidaat winnen', async () => {
    const user = userEvent.setup();
    const onSolved = show((solved, done) => <TableauWidget data={HOND} solved={solved} onSolved={done} />);

    expect(screen.getByRole('status')).toHaveTextContent('Nu wint [hɔnd]. Laat [hɔnt] winnen');
    expect(screen.getByRole('rowheader', { name: '[hɔnd], wint' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '∗VOICED-CODA, plek 2 in de rangorde' }));
    expect(screen.getByRole('status')).toHaveTextContent('∗VOICED-CODA vastgepakt.');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: '∗VOICED-CODA, plek 2 in de rangorde' })).toHaveAttribute('aria-pressed', 'false');

    await user.click(screen.getByRole('button', { name: '∗VOICED-CODA, plek 2 in de rangorde' }));
    await user.click(screen.getByRole('button', { name: 'IDENT(voice), plek 1 in de rangorde' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '∗VOICED-CODA, plek 1 in de rangorde' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: '[hɔnt], wint' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(HOND.note);
  });
});
