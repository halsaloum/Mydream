import type { BookId } from './types';
export const BOOKS: Record<BookId, { title: string; author: string; description: string; url?: string }> = {
  lieber: { title: 'Introducing Morphology', author: 'Rochelle Lieber', description: 'Woordfamilies, morfologische analyse, affixen, woordvorming en het raakvlak met syntaxis.' },
  haspelmath: { title: 'Understanding Morphology', author: 'Martin Haspelmath & Andrea D. Sims', description: 'Woordvorm, lexeem, paradigma, allomorfie en de grenzen van eenvoudige woordmodellen.' },
  'natural-syntax': { title: 'The Syntax of Natural Language', author: 'Michael Diercks, Beatrice Santorini & Anthony Kroch', description: 'Constituenten, structuur, grammaticale functies, selectie en syntactische afhankelijkheden.' },
  tallerman: { title: 'Understanding Syntax', author: 'Maggie Tallerman · zesde editie', description: 'Syntactisch bewijs, woordsoorten, rollen, zinsverbanden en vergelijking van grammaticale systemen.' },
  kroeger: { title: 'Analyzing Meaning', author: 'Paul R. Kroeger', description: 'Woord- en zinsbetekenis, gevolgtrekkingen, context, bereik, tijd en taalhandelingen.', url: 'https://langsci-press.org/catalog/book/231' },
  ontleed: { title: 'Ontleed — van nul tot de volle zin', author: 'Aangeleverd ontwerpdocument', description: 'Ontdekken, testen, bouwen, zelf verklaren en toepassen op eigen Nederlandse zinnen.' },
  leerlijn: { title: 'Alles op zinsniveau — leerlijn Nederlands', author: 'Aangeleverde Nederlandse leerlijn', description: 'Van woordvorm via zinsdelen en velden naar betekenis en bewuste zinskeuzes.' },
  ans: { title: 'Algemene Nederlandse Spraakkunst', author: 'Instituut voor de Nederlandse Taal', description: 'Aanvullende verificatie van Nederlandse woordorde en werkwoordgroepen.', url: 'https://e-ans.ivdnt.org/topics/pid/ans21010101lingtopic' },
};
