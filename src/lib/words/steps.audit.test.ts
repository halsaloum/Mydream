// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { WORDS, wholeWord, type BankWord } from '@/content/words';
import { recallMeaning, wordTaskStep, type Task } from './steps';

describe('ophalen zonder een zichtbaar antwoord', () => {
  it('verbergt letterlijke antwoorden in omschrijvingen, ook bij alternatieven en hoofdletters', () => {
    expect(recallMeaning('Voor nu: zo blijft het voorlopig, niet voor altijd.', ['voor nu', 'voorlopig'])).toBe('…: zo blijft het …, niet voor altijd.');
    expect(recallMeaning('Werk samen aan een werkplan.', ['werk'])).toBe('… samen aan een werkplan.');
  });

  it('geeft in elke ophaalvariant voor alle bankwoorden geen antwoordkopie in de betekenis', () => {
    const tasks: Task[] = ['recall0', 'recall1', 'recall2', 'free0', 'free1', 'free2'];
    for (const word of WORDS) {
      for (const task of tasks) {
        const step = wordTaskStep(word as BankWord, task);
        if (step.kind !== 'recall') throw new Error(`${word.id}/${task} is geen ophaaltaak`);
        for (const answer of step.answers) expect(wholeWord(answer).test(step.clue), `${word.id}/${task}: ${answer}`).toBe(false);
        // Narrow the requested response to the studied target without disclosing its spelling.
        expect(step.prompt, `${word.id}/${task}`).toContain('geleerde woord');
        if (task.startsWith('free')) expect(step.cue, `${word.id}/${task}`).toBeUndefined();
      }
    }
  });
});
