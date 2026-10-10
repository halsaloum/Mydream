import { describe, expect, it } from 'vitest';
import { clozeSolution, matchesAnswer, normalizeAnswer, parseCloze } from '@/content/cloze';
import { getDemo } from '@/content/demo';
import { StepSchema, type StepKind, type StepOf } from '@/content/schema';
import { evaluate, isComplete } from './grade';
import { extraFeedback, proofreadAccepts, proofreadUnchanged } from './kinds';
import { initialResponse, responseFits } from './responses';
import { DRILL_RETRIES, diffSequence, drillCurrent, drillQueue, drillStats, passageScore, wordDiff, type SpellingResponseOf } from './spelling';

function demo<K extends StepKind>(slug: string): StepOf<K> {
  const step = getDemo(slug)?.step;
  if (!step) throw new Error(`Geen demo ${slug}`);
  return step as StepOf<K>;
}

describe('invultekst lezen', () => {
  it('leest gaten met aanwijzing, uitleg en meer goede antwoorden', () => {
    const parsed = parseCloze("Ik heb {twee} {kinderen|kind|Meervoud: -eren.} en {zo’n~zo'n||Weggelaten letters.} hond.");
    expect('error' in parsed).toBe(false);
    if ('error' in parsed) return;
    expect(parsed.gaps).toEqual([
      { answers: ['twee'], cue: null, note: null },
      { answers: ['kinderen'], cue: 'kind', note: 'Meervoud: -eren.' },
      { answers: ['zo’n', "zo'n"], cue: null, note: 'Weggelaten letters.' },
    ]);
    expect(parsed.parts.map((part) => (part.kind === 'gap' ? `[${part.gap}]` : part.text)).join('')).toBe('Ik heb [0] [1] en [2] hond.');
    expect(clozeSolution('Een {hond|hon_} en een {kat}.')).toBe('Een hond en een kat.');
  });

  it('weigert kapotte markering', () => {
    expect(parseCloze('een {hond')).toEqual({ error: 'Er staat een { zonder }' });
    expect(parseCloze('een hond}')).toEqual({ error: 'Er staat een } zonder {' });
    expect(parseCloze('een {ho{nd}}')).toEqual({ error: 'Gaten mogen niet in elkaar staan' });
    expect(parseCloze('een {|hint}')).toEqual({ error: 'Leeg antwoord in {|hint}' });
    expect('error' in parseCloze('{a|b|c|d}')).toBe(true);
  });

  it('vergelijkt getypte antwoorden: spaties, gekrulde apostrof en slotpunt tellen niet; hoofdletters alleen met caps', () => {
    expect(normalizeAnswer('  auto’s. ', false)).toBe("auto's");
    expect(matchesAnswer('Utrecht', ['utrecht'], false)).toBe(true);
    expect(matchesAnswer('utrecht', ['Utrecht'], true)).toBe(false);
    expect(matchesAnswer('Utrecht.', ['Utrecht'], true)).toBe(true);
    expect(matchesAnswer('', [''], false)).toBe(false);
  });

  it('zonder caps mag een hoofdletter te veel, maar een hoofdletter die hoort moet er staan', () => {
    expect(matchesAnswer('Hand', ['hand'], false)).toBe(true);
    expect(matchesAnswer('België', ['België'], false)).toBe(true);
    expect(matchesAnswer('belgië', ['België'], false)).toBe(false);
    expect(matchesAnswer('Ijsland', ['IJsland'], false)).toBe(false);
    expect(matchesAnswer('IJSLAND', ['IJsland'], false)).toBe(true);
  });

  it('een accent uit twee tekens en een ´ als apostrof tellen gewoon mee', () => {
    expect(matchesAnswer('cafe\u0301', ['café'], false)).toBe(true);
    expect(matchesAnswer('zo´n', ['zo’n'], false)).toBe(true);
    expect(wordDiff('Dat is zo’n café.', 'Dat is zo´n cafe\u0301.').right).toBe(4);
  });

  it('het schema controleert gaten en verraden aanwijzingen', () => {
    const base = { kind: 'cloze', prompt: 'Vul in', why: 'Uitleg.' } as const;
    expect(StepSchema.safeParse({ ...base, text: 'Een {hond|hon_|honden} en een {kat||katten}.' }).success).toBe(true);
    expect(StepSchema.safeParse({ ...base, text: 'Een {hond} zonder tweede gat.' }).success).toBe(false);
    expect(StepSchema.safeParse({ ...base, text: 'Een {hond|hond} en een {kat}.' }).success).toBe(false);
    expect(StepSchema.safeParse({ ...base, text: 'Een {hond~hond} en een {kat}.' }).success).toBe(false);
  });
});

describe('invultekst nakijken', () => {
  const step = demo<'cloze'>('invultekst');

  it('is pas compleet als elk vakje iets heeft', () => {
    const empty = initialResponse(step);
    expect(empty).toEqual({ kind: 'cloze', values: ['', '', '', ''] });
    expect(isComplete(step, { kind: 'cloze', values: ['gisteravond', 'badkamer', 'grond', ''] })).toBe(false);
    expect(isComplete(step, { kind: 'cloze', values: ['gisteravond', 'badkamer', 'grond', 'hout'] })).toBe(true);
  });

  it('score is het deel goede gaten; lang werk komt niet terug in de les maar gaat naar de herhaling', () => {
    expect(evaluate(step, { kind: 'cloze', values: ['Gisteravond', ' badkamer ', 'grond', 'hout'] })).toEqual({
      score: 1,
      correct: true,
      requeue: false,
      review: 'clear',
    });
    expect(evaluate(step, { kind: 'cloze', values: ['gisteravont', 'badkamer', 'gront', 'hout'] })).toEqual({
      score: 0.5,
      correct: false,
      requeue: false,
      review: 'miss',
    });
  });

  it('past niet meer bij een tekst met een ander aantal gaten', () => {
    expect(responseFits(step, { kind: 'cloze', values: ['a', 'b', 'c', 'd'] })).toBe(true);
    expect(responseFits(step, { kind: 'cloze', values: ['a'] })).toBe(false);
  });
});

describe('reeks', () => {
  const step = demo<'drill'>('reeks');
  type R = SpellingResponseOf<'drill'>;
  const answer = (r: R, ok: boolean, typed = 'x'): R => {
    const item = drillCurrent(step, r);
    if (item === null) throw new Error('reeks is al klaar');
    return { ...r, answers: [...r.answers, { item, typed, ok }] };
  };

  it('zet een fout woord achteraan, hoogstens twee keer', () => {
    let r = initialResponse(step) as R;
    r = answer(r, false);
    expect(drillQueue(step, r.answers)).toEqual([0, 1, 2, 3, 4, 0]);
    for (let i = 0; i < 4; i++) r = answer(r, true);
    expect(drillCurrent(step, r)).toBe(0);
    r = answer(r, false);
    expect(drillCurrent(step, r)).toBe(0);
    r = answer(r, false);
    expect(DRILL_RETRIES).toBe(2);
    expect(drillCurrent(step, r)).toBeNull();
    expect(isComplete(step, r)).toBe(true);
  });

  it('score = deel in één keer goed; foutloos is pas helemaal goed', () => {
    let r = initialResponse(step) as R;
    r = answer(r, false);
    for (let i = 0; i < 4; i++) r = answer(r, true);
    r = answer(r, true);
    expect(drillStats(step, r.answers)).toMatchObject({ firstTry: 4, total: 5, best: 5 });
    expect(evaluate(step, r)).toMatchObject({ score: 0.8, correct: false, requeue: false, review: 'miss' });
    expect(extraFeedback(step, r, evaluate(step, r))).toEqual({ title: 'Reeks klaar', body: '4 van de 5 in één keer goed. Langste reeks: 5 op rij.' });
  });

  it('een opgeslagen antwoord dat niet meer bij de volgorde past, begint opnieuw', () => {
    expect(responseFits(step, { kind: 'drill', answers: [{ item: 0, typed: 'hand', ok: true }], value: '' })).toBe(true);
    expect(responseFits(step, { kind: 'drill', answers: [{ item: 3, typed: 'vind', ok: true }], value: '' })).toBe(false);
  });

  it('het schema weigert dubbele opdrachten', () => {
    const item = { q: 'Eén …, twee handen', a: 'hand', why: 'handen.' };
    expect(StepSchema.safeParse({ kind: 'drill', prompt: 'Reeks', items: [item, item, { ...item, q: 'b' }, { ...item, q: 'c' }] }).success).toBe(false);
  });
});

describe('dictee woord voor woord', () => {
  it('een vergeten woord maakt de woorden erna niet fout', () => {
    const diff = wordDiff('Mijn vriend woont in een grote stad.', 'Mijn vrient woont in grote stad.');
    expect(diff.marks.map((mark) => [mark.word, mark.ok, mark.typed])).toEqual([
      ['Mijn', true, 'Mijn'],
      ['vriend', false, 'vrient'],
      ['woont', true, 'woont'],
      ['in', true, 'in'],
      ['een', false, null],
      ['grote', true, 'grote'],
      ['stad.', true, 'stad.'],
    ]);
    expect(diff.extra).toEqual([]);
  });

  it('een woord te veel staat op de plek waar het getypt is', () => {
    const order = diffSequence(wordDiff('Ik loop naar huis.', 'Ik loop de naar huis.')).map((entry) => (entry.kind === 'extra' ? `+${entry.word}` : entry.mark.word));
    expect(order).toEqual(['Ik', 'loop', '+de', 'naar', 'huis.']);
  });

  it("telt woorden te veel apart en ziet ’ en ' als gelijk", () => {
    const diff = wordDiff("We gaan 's avonds.", 'We gaan ’s avonds weg.');
    expect(diff.right).toBe(3);
    expect(diff.marks.at(-1)).toEqual({ word: 'avonds.', ok: false, typed: 'avonds' });
    expect(diff.extra).toEqual(['weg.']);
  });

  it('tekstdictee: score is het deel goede woorden', () => {
    const step = demo<'passage'>('tekstdictee');
    const perfect = [...step.sentences];
    expect(evaluate(step, { kind: 'passage', values: perfect, plays: [1, 1, 1], peeks: [0, 0, 0] })).toMatchObject({ score: 1, correct: true, requeue: false });
    const values = ['Mijn vrient woont in een grote stat.', step.sentences[1]!, step.sentences[2]!];
    const score = passageScore(step, values);
    expect(score).toMatchObject({ right: score.total - 2, extra: 0 });
    expect(evaluate(step, { kind: 'passage', values, plays: [1, 1, 1], peeks: [0, 0, 0] })).toMatchObject({ correct: false, review: 'miss', requeue: false });
    expect(isComplete(step, { kind: 'passage', values: ['a', '', 'c'], plays: [0, 0, 0], peeks: [0, 0, 0] })).toBe(false);
  });
});

describe('nakijken zonder hulp', () => {
  const step = demo<'proofread'>('nakijken-zonder-hulp');
  const error = (t: string) => {
    const token = step.tokens.find((entry) => entry.t === t);
    if (!token || !('fix' in token)) throw new Error(t);
    return token;
  };

  it('accepteert de verbetering met of zonder slotpunt, maar niet als de punt de fout is', () => {
    expect(proofreadAccepts(error('bet.'), 'bed.')).toBe(true);
    expect(proofreadAccepts(error('bet.'), 'bed')).toBe(true);
    expect(proofreadAccepts(error('bet.'), 'bet')).toBe(false);
    expect(proofreadAccepts({ t: 'stad', fix: 'stad.', why: 'punt' }, 'stad')).toBe(false);
    expect(proofreadAccepts({ t: 'utrecht', fix: 'Utrecht', why: 'naam' }, 'utrecht')).toBe(false);
    expect(proofreadAccepts({ t: 'Gisteravont', fix: 'Gisteravond', why: 'd' }, 'Gisteravond')).toBe(true);
    expect(proofreadAccepts({ t: 'zo n', fix: 'zo’n', why: 'apostrof' }, "zo'n")).toBe(true);
  });

  it('hoofdletters tellen altijd: ook een naam die je met een kleine letter typt is fout', () => {
    expect(proofreadAccepts({ t: 'Gisteravont', fix: 'Gisteravond', why: 'd' }, 'gisteravond')).toBe(false);
    expect(proofreadAccepts({ t: 'Italie,', fix: 'Italië,', why: 'trema' }, 'italië')).toBe(false);
    expect(proofreadAccepts({ t: 'Ijmuiden.', fix: 'IJmuiden.', why: 'IJ' }, 'iJmuiden')).toBe(false);
    expect(proofreadAccepts({ t: '’S', fix: '’s', why: 'klein' }, '’S')).toBe(false);
    expect(proofreadAccepts({ t: '’S', fix: '’s', why: 'klein' }, '’s')).toBe(true);
  });

  it('aanhalingstekens en haakjes om het woord hoef je niet over te typen, een apostrof die erbij hoort wel', () => {
    expect(proofreadAccepts({ t: '‘ideeen’', fix: '‘ideeën’', why: 'trema' }, 'ideeën')).toBe(true);
    expect(proofreadAccepts({ t: '‘ideeen’,', fix: '‘ideeën’,', why: 'trema' }, '‘ideeën’')).toBe(true);
    expect(proofreadAccepts({ t: 'collegaas)', fix: 'collega’s)', also: ['collegae)'], why: 'meervoud' }, 'collegae')).toBe(true);
    expect(proofreadAccepts({ t: 'Max', fix: 'Max’', why: 'bezit' }, 'Max')).toBe(false);
    expect(proofreadAccepts({ t: 'Thomas’s', fix: 'Thomas’', why: 'bezit' }, 'Thomas')).toBe(false);
  });

  it('een woord overtypen zonder de punt erachter is het woord laten staan', () => {
    expect(proofreadUnchanged({ t: 'bet.', fix: 'bed.', why: 'd' }, 'bet')).toBe(true);
    expect(proofreadUnchanged({ t: 'wordt.' }, 'wordt')).toBe(true);
    expect(proofreadUnchanged({ t: 'wordt.' }, 'Wordt.')).toBe(false);
    expect(proofreadUnchanged({ t: 'stad' }, 'stad.')).toBe(true);
  });

  it('is pas klaar als de leerling dat zegt, en een gemiste fout telt mee', () => {
    const errors = step.tokens.filter((token) => 'fix' in token).length;
    const all = step.tokens.flatMap((token, i) => ('fix' in token ? [i] : []));
    expect(isComplete(step, { kind: 'proofread', found: all, slips: 0 })).toBe(false);
    expect(evaluate(step, { kind: 'proofread', found: all, slips: 0, finished: true })).toMatchObject({ score: 1, correct: true });
    const outcome = evaluate(step, { kind: 'proofread', found: all.slice(0, 2), slips: 1, finished: true });
    expect(outcome.score).toBeCloseTo(2 / (errors + 1), 3);
    expect(extraFeedback(step, { kind: 'proofread', found: all.slice(0, 2), slips: 1, finished: true }, outcome).title).toBe('2 fouten over het hoofd gezien');
  });

  it('het schema weigert een token met een tikfout in de sleutel', () => {
    const base = { kind: 'proofread', prompt: 'Kijk na', tokens: [{ t: 'een' }, { t: 'hont', fix: 'hond', why: 'honden' }] } as const;
    expect(StepSchema.safeParse({ ...base, tokens: [...base.tokens, { t: 'kat' }] }).success).toBe(true);
    expect(StepSchema.safeParse({ ...base, tokens: [...base.tokens, { t: 'kat', fx: 'kat' }] }).success).toBe(false);
  });
});
