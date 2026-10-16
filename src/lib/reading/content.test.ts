import { describe, expect, it } from 'vitest';
import { collectReadingParts, readingWord } from './content';

function texts(html: string) {
  const scope = document.createElement('main');
  scope.innerHTML = html;
  document.body.append(scope);
  try { return collectReadingParts(scope).map((part) => part.text).join(' '); }
  finally { scope.remove(); }
}

describe('zichtbare lesteksten voor de leesmodus', () => {
  it('leest opdrachten, inhoudsknoppen, labels en feedback zonder bediening of verborgen uitwerkingen', () => {
    const text = texts('<h1>Zinsbouw</h1><p>Bouw een <button>hele zin</button>.</p><label>Omdat de trein niet rijdt.</label><footer><p role="status">Je verklaring klopt.</p><button data-readaloud-ignore>Volgende</button></footer><div hidden>Geheime uitwerking</div><p aria-hidden="true">Oude selectie</p><div data-readaloud-ignore><p>Leesmodus</p></div>');
    expect(text).toBe('Zinsbouw Bouw een hele zin. Omdat de trein niet rijdt. Je verklaring klopt.');
  });

  it('onthult gesloten native en bewaard gemonteerde uitwerkingen niet', () => {
    const html = '<details><summary>Bekijk de uitwerking</summary><p>Verborgen model</p><details open><summary>Meer</summary><p>Ook verborgen</p></details></details><div data-readaloud-hidden="true"><p>Verborgen feedback</p></div><div data-closed><p>Verborgen regel</p></div><p class="text-transparent">Verborgen dicteewoord</p><details open><summary>Toelichting</summary><p>Nu vrijgegeven.</p></details>';
    const text = texts(html);
    expect(text).toContain('Bekijk de uitwerking');
    expect(text).toContain('Nu vrijgegeven.');
    expect(text).not.toMatch(/Verborgen|Ook verborgen/);
  });

  it('leest alleen de actuele animatiestap en het actieve uitlegdeel', () => {
    const text = texts('<div data-reading-step="2"><article data-step-pos="1"><p>Vorige opdracht</p></article><article data-step-pos="2"><div data-reading-panel="1"><section data-reading-panel-index="0"><p>Vorige uitleg</p></section><section data-reading-panel-index="1"><p>Actuele uitleg.</p></section></div></article></div>');
    expect(text).toBe('Actuele uitleg.');
  });

  it('houdt antwoordopties en losse letterknoppen uit elkaar zonder zinsleestekens te veranderen', () => {
    const scope = document.createElement('main');
    scope.innerHTML = '<label>A. De trein rijdt.</label><label>B. De trein rijdt niet.</label><div><button>a</button><button>b</button><button>c</button></div><p>Lees <button>boek</button>, daarna verder.</p>';
    document.body.append(scope);
    try {
      expect(collectReadingParts(scope).map((part) => part.text)).toEqual(['A. De trein rijdt.', 'B. De trein rijdt niet.', 'a b c', 'Lees boek, daarna verder.']);
    } finally { scope.remove(); }
  });

  it('leest geselecteerde waarden, invulplekken en zinvolle beeldbeschrijvingen zonder ingevulde privétekst', () => {
    const text = texts('<p>De docent <input placeholder="antwoord" value="Geheime eigen tekst"> het boek.</p><select><option>Niet gekozen</option><option selected>Onderwerp</option></select><textarea>Eigen analyse</textarea><svg role="img" aria-label="Het onderwerp is verbonden met leest"><title>Dubbele beschrijving</title></svg><svg aria-hidden="true"><title>Decoratie</title></svg><p><span class="sr-only">Juist:</span> een onderwerp.</p>');
    expect(text).toContain('De docent invulvak het boek.');
    expect(text).toContain('Onderwerp');
    expect(text).toContain('Het onderwerp is verbonden met leest');
    expect(text).toContain('Juist: een onderwerp.');
    expect(text).not.toMatch(/Niet gekozen|Geheime|Eigen analyse|Dubbele|Decoratie/);
  });
});

describe('werkelijk gesproken woord', () => {
  it('markeert precies de gemelde herhaling en bewaart UTF-16-posities', () => {
    expect(readingWord('Ik zie dat dat helpt.', 11)).toEqual({ start: 11, end: 14 });
    expect(readingWord('📚 Noor leest.', 3, 4)).toEqual({ start: 3, end: 7 });
  });
  it('verzint geen woordpositie bij ongeldige grenzen of leestekens', () => {
    expect(readingWord('Noor leest.', -1)).toBeNull();
    expect(readingWord('Noor leest.', 50)).toBeNull();
    expect(readingWord('Noor leest.', 4)).toBeNull();
    expect(readingWord('Noor leest.', 10)).toBeNull();
  });
});
