import { describe, expect, it } from 'vitest';
import { judgeAnswer, normalizeAnswer } from './models';

describe('antwoorden bij het 3D-model', () => {
  it('maakt antwoorden vergelijkbaar', () => {
    expect(normalizeAnswer('  Het   Stuur. ')).toBe('het stuur');
    expect(normalizeAnswer('’t stuur')).toBe("'t stuur");
  });

  it('keurt goede antwoorden en alternatieven goed', () => {
    const trapper = { answer: 'de trapper', also: ['het pedaal'] };
    expect(judgeAnswer(trapper, 'De trapper')).toEqual({ ok: true });
    expect(judgeAnswer(trapper, 'het pedaal')).toEqual({ ok: true });
  });

  it('geeft de uitleg van een bekende valkuil', () => {
    const pomp = { answer: 'bandenpomp', traps: [{ w: 'bandpomp', note: 'Meervoud banden.' }] };
    expect(judgeAnswer(pomp, 'bandpomp')).toEqual({ ok: false, tip: 'Meervoud banden.' });
    expect(judgeAnswer(pomp, 'pomp')).toEqual({ ok: false, tip: null });
    expect(judgeAnswer(pomp, '   ')).toEqual({ ok: false, tip: null });
  });

  it('herkent een goed woord met een verkeerd of ontbrekend lidwoord', () => {
    const stuur = { answer: 'het stuur' };
    expect(judgeAnswer(stuur, 'de stuur')).toMatchObject({ ok: false, tip: expect.stringMatching(/lidwoord niet/) });
    expect(judgeAnswer(stuur, 'stuur')).toMatchObject({ ok: false, tip: expect.stringMatching(/de of het/) });
    expect(judgeAnswer(stuur, 'een stuur')).toMatchObject({ ok: false, tip: expect.stringMatching(/bepaalde lidwoord/) });
    expect(judgeAnswer({ answer: 'kettingkast' }, 'de kettingkast')).toMatchObject({ ok: false, tip: expect.stringMatching(/zonder lidwoord/) });
  });
});
