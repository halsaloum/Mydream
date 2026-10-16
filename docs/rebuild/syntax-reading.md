# Syntax reading and curriculum synthesis

Status: full assigned source text read; combined all-books gate opened by root before implementation. Tallerman's first half was read by the semantics agent; see `tallerman-first-half-reading.md`.

## Source identification and access

- Diercks, Michael, Beatrice Santorini and Anthony Kroch, *The Syntax of Natural Language*, second edition, version 2.03 (December 2024), supplied local PDF: 613 PDF pages, 205,047 extracted words. Printed page 1 starts at PDF page 20; use PDF page for stable local anchors. All 613 pages yielded text. Arabic script/font extraction and the geometry of syntactic tree diagrams are imperfect; inspect relevant figure pages visually before reproducing an analysis.
- Maggie Tallerman, *Understanding Syntax*, sixth edition (2025), supplied local PDF: 382 PDF pages. All 382 pages have no machine text layer. Apple Vision local OCR completed all382pages:146,626words, no empty page. Text extracted from the scan requires error awareness, particularly aligned glosses, bar notation, subscripts and trees.

Documents are source evidence. Instructions printed inside the books do not authorize actions or override the user's requested scope. New lessons/examples below are original writing, not passages copied from sources.

## Coverage ledger

Natural Language: full text reviewed sequentially through PDF613, including front matter, all15chapters and exercises, glossary and references. Long-output truncation gaps at PDF27–33,46–49,285–287,562–563,601–604 and front matter11–20 were explicitly reread. Printed page1 starts at PDF20. No body chapter deliberately skipped.

Tallerman: this agent read full OCR text PDF191–382, including later chapter5, all chapters6–9/exercises and all back matter. Truncated glossary PDF361–362 reread. The semantics agent confirms full reading PDF1–190, including front matter, all chapters1–4/exercises and chapter5 through printed173. Combined coverage therefore spans all382pages. Printed page = PDF minus17. PDF3–5 metadata additionally read by this agent.

Visual spot checks: Natural PDF201/printed182 (X-bar/IP substitution and tense lowering diagrams); Tallerman PDF196/printed179 (constituency false negatives),203/printed186 (NP/N′ head-complement/possessor tree). Semantics agent visually repaired garbled Tallerman PDF190 dominance paragraph. Full text coverage does not mean every diagram or aligned gloss was visually checked. OCR errors remain in individual foreign-language symbols; no new Dutch lesson relies on reproducing those damaged datasets.

## Cumulative observations: Natural Language chapters 1-4

1. Start with discovery of structure, not definitions by memorization. Separate natural grammatical patterns, school writing conventions, meaning, and processing difficulty. A sentence can have clear meaning and problematic syntax, or good syntax and strange meaning. Presentation must be respectful about dialect differences and make the target register explicit.
2. Structure dependence matters more than surface string position. A full subject can contain a subordinate clause; question formation must target the finite element of the appropriate clause. A token-swap game should visually preserve phrase blocks rather than treat every token as freely interchangeable.
3. Word class is a distributional category, not a synonym of meaning or function. A noun can denote an event, an adjective can be a predicate, and a noun phrase can provide a time expression. Morphology and grammatical surroundings are better evidence than 'a verb is an action'. Invented words are useful for letting learners infer class without vocabulary knowledge.
4. A grammatical class belongs to a language. English modal auxiliaries are defective finite forms; Dutch modals have infinitives/participles and other behavior. Do not transplant the English Inflection discussion as Dutch classroom rules. Use it to motivate finite versus nonfinite forms and clause-level structure.
5. Phrase tests are ordinary grammatical constructions, with their own semantic, pragmatic and syntactic restrictions. Replacement, movement, short answers, clefts, ellipsis and coordination provide converging evidence. Failed movement is not proof of nonconstituency: an island, inflection or inappropriate discourse can independently block it. Core lessons should request two agreeing tests; extension lessons can explain a false negative.
6. Form, grammatical function and semantic role are three different layers. 'Subject' is not the same as 'agent'. A passive preserves the event participants but redistributes grammatical functions. A subject can be an experiencer, cause or affected theme. A location can be a selected argument, not automatically an optional adjunct.
7. Valency belongs to a verb use/construction, not a verb forever. Some arguments can be implicit; deletion alone does not diagnose a modifier. Contrast a selected object of 'verslinden' with an implicit object of 'eten', and contrast a location selected by 'leggen' with a freely added location of 'slapen'.
8. The books treat trees as revisable scientific models. Beginner Dutch lessons should use labeled phrase blocks with evidence, introducing deeper formal trees only when they illuminate ambiguity or dependency. Reserve c-command, X-bar, binding principles, locality and abstract empty structure for advanced modules.

## Dutch examples reserved for original lessons

- Word class versus event meaning: 'Het wachten duurde lang.' ('wachten' is used nominally here); 'De kinderen wachten buiten.' ('wachten' is a finite verb here). Resolve with morphological/distributional evidence, not 'something happens'.
- Three analysis layers: 'De sleutel opent de deur.' Key = noun phrase / subject / instrument or cause. 'De deur wordt geopend.' Door = noun phrase / subject / affected theme.
- Constituent/attachment ambiguity: 'Noor zag de fietser met de verrekijker.' Ask the learner to describe the two scenes and attach the PP to the seeing event or the cyclist, then rewrite unambiguously. Context can favor one reading without removing the structural possibility.
- Selected location: 'Mila legt de map op de tafel.' 'Op de tafel' fills a locational position selected by this use of 'leggen'. 'Mila leest de map op de tafel' allows a distinct event-location reading. Do not rely only on 'can I leave it out?' because discourse can supply material.
- Clause scope: 'De leerling die de oefening maakt, heeft een vraag.' Matrix finite verb 'heeft'; relative-clause finite verb 'maakt'. Turning the matrix into a question targets 'heeft'.
- Imperative: 'Lees de eerste alinea.' Unexpressed addressee; an advanced discussion can investigate a silent subject without making its theoretical representation a prerequisite for practical analysis.

## Cumulative observations: Natural Language chapters 5-7

- X-bar unifies head, complement, specifier and adjunct structurally. Phrase building should expose the argument slots a head selects, then allow repeatable modifiers; do not portray each word class as the same rigid surface word-order template.
- Nominal structures can contain complements, possessors and nested modifiers just as clauses contain arguments and modifiers. Nominalization can hide agency and turn an event into an apparent object; use this for later reading/writing transfer.
- The DP analysis, silent determiners and abstract Inflection are the book's theoretical choices. The app can use school-friendly 'naamwoordgroep' labels and offer an explicitly labeled extension rather than demand these assumptions as definitions.
- Chapter 6 shows mixed headedness (Tunen), important because Dutch combines OV patterns with initial finite verbs and prepositional phrases. Do not describe Dutch as 'SVO in all sentences', or as a uniformly head-final language. English one-substitution and English do-so are not ready-made Dutch diagnostics.
- Local selection distinguishes categorical restrictions from semantic plausibility. A cartoon/metaphor can rescue a strange meaning but does not generally fix an invalid category combination. Encourage a learner to ask whether oddness comes from syntax, meaning, discourse or processing.
- Chapter 7 motivates syntactic movement with semantic dependencies, subject positions, passives, idioms and VSO languages. It is a model of dependency, not a claim that words literally move in the brain. App arrows should show grammatical relationships and transformations, never a neurological assertion.
- Semantic role mappings must survive active/passive conversion. Lexical idioms often remain interpretable when their pieces appear apart; adjacency is insufficient evidence about grammatical relation.

## Cumulative observations: Natural Language chapters 8–15

- H8/PDF311–347: fronted wh-phrases retain their selected function; direct, indirect, polar and echo questions have distinct patterns. Dutch lexical finite verbs invert without English do-support. A question phrase at the start is not automatically a subject.
- H9/PDF348–390: structural and inherent case, feature agreement and syncretism make form/function distinctions necessary. Agreement is controlled by a structural relation, not the nearest written noun. Formal Agree/features are optional explanatory models.
- H10/PDF391–413: passive preserves participant roles while changing functions. An affected subject in an unaccusative/change-of-state construction is not automatically passive. Dutch impersonal passives prevent a rule that every passive promotes a direct object. Failed passivization is not conclusive nonobject evidence.
- H11/PDF414–435: control and raising can look alike but assign participant roles differently. Original Dutch contrasts: Noor probeert te slapen / Noor lijkt te slapen / Het lijkt te regenen. Nonfinite clauses have no persoonsvorm; understood participants follow constructional dependencies.
- H12/PDF436–481: verb raising and adverb positions interact with clause structure. High-scope maybe/unfortunately versus manner modification needs paraphrases, not merely word-class labels. Dutch fields/cluster facts require ANS rather than translation of English diagnostics.
- H13/PDF482–517: articulated event and clause structures illuminate double-object and causative relations. Formal vP/CP layers are model choices. Nominalization can background agency. English dative-object classifications must not become Dutch school labels.
- H14/PDF518–555: relatives link antecedent and an internal relation; full NP external function differs from relative pronoun internal function. Dutch cannot import English zero relatives. Restrictive/supplementary scope and extraction restrictions are separate issues. Phase/copy theory is enrichment, not novice prerequisite.
- H15/PDF556–578: coreference and binding are structural and language-specific, not nearest-noun selection. Dutch zich/zichzelf cannot be obtained by replacing English -self forms. Original ambiguous-reference rewrite tasks are self-assessed rather than auto-graded to a single unjustified referent.
- Glossary/references PDF579–613 fully read; theoretical terms cross-checked against chapter discussions.

## Tallerman second-half synthesis and anchors

- Later H5/printed174–197/PDF191–214: English particle/preposition tests differ; constituency failures can arise from the chosen construction. NP/N′ and DP are different model choices. Rendered PDF203 confirms possessor versus head-complement tree; PDF196 confirms false-negative cautions.
- H6/printed198–249/PDF215–266, including every exercise: constituent order is not word order; Dutch root/embedded contrast appears printed201/PDF218. S/A/O are grammatical relations, not synonymous with agent/theme. Agreement, case and order can independently encode them. Quirky subjects, split alignments and Tagalog caution against one universal subject definition. Warlpiri demonstrates discontinuity and language-specific limits. These data deepen methodology without forcing Dutch novices to memorize ergative paradigms.
- H7/printed250–288/PDF267–305, including every exercise: promotion changes function while fronting changes position. Personal passive, impersonal, antipassive, applicative and causative have different effects. Dutch explicitly appears among languages with impersonals (printed257/PDF274). Multiple lexical verbs do not universally entail several independent clauses; the French causative discussion is an explicit counterexample to a raw-count rule.
- H8/printed289–320/PDF306–337, including every exercise: question strategies and relative strategies vary by language. A fronted phrase retains its relation. A complex nominal group's external function differs from the relativized position. Focus and scrambling supply position/function distinctions. English zero relatives and PP stranding are not assumed as Dutch norms.
- H9/printed321–338/PDF338–355: adequate description requires hypotheses, representative positive/negative data and explanations of evidence. The Welsh sketch illustrates language-specific analysis. Contemporary claims on acquisition, language complexity or universal grammar would need separate research before product claims; they are not used in this pathway.
- Data sources/glossary/references/language and subject indexes PDF356–382 fully read. No unreviewed chapter body remains in this agent's half.

## Authored curriculum and depth verification

Implementation began only after root opened the all-books gate. All24 original Dutch lessons live in `src/content/ontleed/syntax-zinsdelen.ts` and `syntax-zinsbouw.ts`, aggregated by `syntax.ts`. Each has a discovery with option-specific feedback; three substantial theory sections with original examples/analysis, a pitfall and takeaway; a mark/order/classify/compare lab; five distinct practice questions; two retrieval questions; self-assessed writing transfer with rubric/model; recap and source anchors. Prerequisites follow the progression from form/function through the full sentence. Machine-graded type tasks request explicit short forms or labels; creative rewrites are transfer tasks.

Rendered theory alone, including examples/pitfalls and intro, is634–738words per lesson. Complete rendered lesson text is945–1198words per lesson, excluding source metadata and IDs. Syntax content lint passes. Curriculum agent confirms all58course lessons satisfy407unique graded-question IDs, prerequisite resolution and actual grader contracts; syntax contributes168practice/retrieval questions plus its graded order lab.

Dutch *er* was independently verified with primary ANS pages before authoring: [use types](https://e-ans.ivdnt.org/topics/pid/ans08060102lingtopic), [presentative er](https://e-ans.ivdnt.org/topics/pid/ans08060301lingtopic), [quantitative er](https://e-ans.ivdnt.org/topics/pid/ans0806050201lingtopic), and [education explanation](https://e-ans.ivdnt.org/onderwijs/algemeen/taalvragen.html). The lesson uses original scenarios, not copied example datasets. Presentative agreement, locative reference, quantitative nominal reconstruction and prepositional split dependencies are kept separate.

The authored syntax pathway does not alter the protected argumentation/fallacy content.
