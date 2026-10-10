/**
 * Het voorbeeld dat door de niveaus groeit, letterlijk overgenomen uit de oorspronkelijke
 * `Home.tsx` (map "src (3)", regels 11–23). Eén entry per niveau in `build.ts`, in dezelfde volgorde.
 */
/** Hetzelfde voorbeeld, op elke laag anders ontleed. hi = nieuw op deze laag. */
export type Seg = { t: string; tag?: string; hi?: boolean; gap?: boolean }
export const BUILD: { segs: Seg[]; tip: string }[] = [
  { segs: [{ t: 'B', tag: 'hoofdletter', hi: true }, { t: 'b', tag: 'kleine letter' }, { t: '·', gap: true }, { t: 'o', tag: 'klinker' }, { t: 'e', tag: 'klinker' }, { t: 'k', tag: 'medeklinker' }], tip: 'Losse tekens met een vaste vorm. b en B zijn één letter in twee vormen.' },
  { segs: [{ t: 'b', tag: 'klank' }, { t: 'oe', tag: '2 letters · 1 klank', hi: true }, { t: 'k', tag: 'klank' }], tip: 'Klank en schrift lopen niet gelijk. oe is twee letters, maar je hoort één klank.' },
  { segs: [{ t: 'boe', tag: 'lettergreep', hi: true }, { t: 'ken', tag: 'lettergreep' }], tip: 'Klankgroepen rond één klinker. Zo knip je op klank: boe-ken. Belangrijk voor spelling en afbreken.' },
  { segs: [{ t: 'boek', tag: 'stam', hi: true }, { t: 'en', tag: 'uitgang · meervoud' }], tip: 'Knip je op betekenis, dan krijg je boek + en. Andere grens dan boe-ken: twee brillen op één woord.' },
  { segs: [{ t: 'boek', tag: 'zelfst. nw. · betekenis', hi: true }], tip: 'Een woord heeft een betekenis, een soort en een vorm die kan veranderen: boek, boeken, boekje.' },
  { segs: [{ t: 'het', tag: 'lidwoord' }, { t: 'rode', tag: 'bijv. nw.' }, { t: 'boek', tag: 'kern', hi: true }], tip: 'Woorden vormen samen een groep rond een kern, en krijgen samen betekenis.' },
  { segs: [{ t: 'Ik', tag: 'onderwerp' }, { t: 'lees', tag: 'persoonsvorm · plek 2', hi: true }, { t: 'het boek', tag: 'lijdend vw.' }, { t: '.', tag: 'punt' }], tip: 'Zinsdelen in een vaste volgorde. Wie is ik? Dat hangt af van wie het schrijft.' },
  { segs: [{ t: 'Ik lees het boek', tag: 'hoofdzin' }, { t: 'omdat', tag: 'oorzaak', hi: true }, { t: 'ik wil leren.', tag: 'bijzin · leren achteraan' }], tip: 'Een verbindingswoord legt een relatie: oorzaak, tegenstelling, gevolg.' },
  { segs: [{ t: 'Ik lees het boek omdat ik wil leren.', tag: 'hoofdgedachte' }, { t: 'Het', tag: '↩ verwijst terug', hi: true }, { t: 'helpt me beter schrijven.', tag: 'uitwerking' }], tip: 'Samenhangende zinnen over één onderwerp, verbonden door verwijzingen. Hier komt alles samen.' },
]
