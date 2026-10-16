/** Small, explicit teaching models. These do not parse arbitrary Dutch grammar. */
export type FieldId = 'voorveld' | 'eerste-pool' | 'middenveld' | 'tweede-pool' | 'achterveld';
export const FIELDS: { id: FieldId; title: string; hint: string }[] = [
  { id: 'voorveld', title: 'Voorveld', hint: 'Eén zinsdeel vóór de persoonsvorm' },
  { id: 'eerste-pool', title: 'Eerste pool', hint: 'Persoonsvorm van de hoofdzin' },
  { id: 'middenveld', title: 'Middenveld', hint: 'Tussen de werkwoorden' },
  { id: 'tweede-pool', title: 'Tweede pool', hint: 'Overige werkwoorden' },
  { id: 'achterveld', title: 'Achterveld', hint: 'Wat achter de tweede pool staat' },
];
export const FIELD_CHUNKS = ['de onderzoeker', 'heeft', 'het verslag', 'zorgvuldig', 'gelezen', 'gisteren'];
export type FieldPlacement = Record<FieldId, number[]>;
export const emptyFields = (): FieldPlacement => ({ voorveld: [], 'eerste-pool': [], middenveld: [], 'tweede-pool': [], achterveld: [] });
export function moveChunk(fields: FieldPlacement, chunk: number, target: FieldId | null): FieldPlacement {
  const result = emptyFields();
  for (const { id } of FIELDS) result[id] = fields[id].filter(value => value !== chunk);
  if (target && Number.isInteger(chunk) && chunk >= 0 && chunk < FIELD_CHUNKS.length) result[target].push(chunk);
  return result;
}
export function checkFields(fields: FieldPlacement): { correct: boolean; feedback: string } {
  const sequence = FIELDS.flatMap(field => fields[field.id]);
  if (sequence.length !== FIELD_CHUNKS.length || new Set(sequence).size !== FIELD_CHUNKS.length || sequence.some(index => !FIELD_CHUNKS[index])) return { correct: false, feedback: 'Gebruik elk bouwstuk precies één keer. Lees daarna de hele zin hardop.' };
  if (fields['eerste-pool'].join() !== '1') return { correct: false, feedback: 'Zet de zin in de verleden tijd. Welk werkwoord verandert? Zet dat in de eerste pool.' };
  if (fields['tweede-pool'].join() !== '4') return { correct: false, feedback: 'Zoek het werkwoord dat na de tijdproef gelijk blijft en samen met de persoonsvorm het gezegde vormt.' };
  if (fields.voorveld.length !== 1 || [1, 4].includes(fields.voorveld[0]!)) return { correct: false, feedback: 'Probeer één volledig bouwstuk vóór de persoonsvorm te zetten. Tel zinsdelen, niet de losse woorden.' };
  if (fields.achterveld.some(index => index !== 5)) return { correct: false, feedback: 'Bewaar voor deze oefening het onderwerp, het voorwerp en de wijze vóór gelezen. Alleen de losse tijdsbepaling mag als nagedachte volgen. Dit is een begrensde oefening; andere contexten kunnen meer toestaan.' };
  const subject = fields.middenveld.indexOf(0), object = fields.middenveld.indexOf(2);
  if (subject >= 0 && object >= 0 && subject > object) return { correct: false, feedback: 'Gebruik hier de neutrale lezing: wie leest wat? Zet het onderwerp vóór het voorwerp in het middenveld. Een andere nadruk vraagt extra context.' };
  return { correct: true, feedback: 'De persoonsvorm volgt op één zinsdeel. De andere werkwoordsvorm sluit de tang. Vergelijk nu een ander voorveld: de structuur blijft, het vertrekpunt voor de lezer verandert.' };
}
export const PARADIGM = [
  { label: 'ik', present: 'werk', past: 'werkte' },
  { label: 'jij (vóór de persoonsvorm)', present: 'werkt', past: 'werkte' },
  { label: 'zij (één persoon)', present: 'werkt', past: 'werkte' },
  { label: 'wij', present: 'werken', past: 'werkten' },
  { label: 'jullie', present: 'werken', past: 'werkten' },
  { label: 'zij (meer personen)', present: 'werken', past: 'werkten' },
];
export type TextToken = { text: string; start: number; end: number };
export type TextSentence = { text: string; start: number; end: number; words: TextToken[] };
export function tokenizeText(text: string): TextToken[] {
  return Array.from(text.matchAll(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu), match => ({ text: match[0], start: match.index, end: match.index + match[0].length }));
}
export function inspectWriting(text: string) {
  // A transparent punctuation splitter, deliberately not presented as a parser.
  const sentences: TextSentence[] = Array.from(text.matchAll(/[^.!?\n]+(?:[.!?]+|(?=\n|$))/g))
    .filter(match => match[0].trim())
    .map(match => ({ text: match[0].trim(), start: match.index, end: match.index + match[0].length, words: tokenizeText(match[0]).map(word => ({ ...word, start: word.start + match.index, end: word.end + match.index })) }));
  const words = tokenizeText(text);
  const references = words.filter(word => /^(hij|zij|ze|het|dit|dat|deze|die|daarmee|daarom|hierdoor|daarvan)$/i.test(word.text));
  const connections = words.filter(word => /^(echter|bovendien|daarom|dus|omdat|doordat|maar|vervolgens|kortom|bijvoorbeeld|mits|toch)$/i.test(word.text));
  return { sentences, words, references, connections, paragraphs: text.trim() ? text.trim().split(/\n\s*\n/).length : 0 };
}
export function bracketDistance(words: TextToken[], first: number | null, last: number | null): number | null {
  if (first === null || last === null || first < 0 || last <= first || last >= words.length) return null;
  return last - first - 1;
}
export type Quantifier = 'alle' | 'sommige' | 'geen' | 'niet-alle';
/** The legacy key 'sommige' is the tool's existential test, labeled 'Minstens één' in the UI. */
export function quantifierHolds(quantifier: Quantifier, total: number, selected: number) {
  if (total < 1 || selected < 0 || selected > total) return false;
  return quantifier === 'alle' ? selected === total : quantifier === 'sommige' ? selected > 0 : quantifier === 'geen' ? selected === 0 : selected < total;
}
