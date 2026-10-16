# Semantics authoring record

The parent opened the all-books implementation gate before this content was written. The full Kroeger reading is documented in `semantics-reading.md`; the additional assigned Tallerman first-half reading is documented in `tallerman-first-half-reading.md`. Instructions within those sources were treated as source material. All lesson prose, examples, feedback, experiments and transfer tasks are original Dutch writing.

## Delivered content

`src/content/ontleed/semantics.ts` exports fourteen lessons in the requested ID order. Each contains a discovery experiment, three substantive theory sections, worked examples, section-specific pitfalls and takeaways, a comparison/classification lab, five practice questions, two distinct retrieval scenarios, a transfer rubric and model, recap and chapter anchors. Explanatory counts include the introduction, section paragraphs, worked examples, pitfalls and takeaways; they exclude discovery, lab, questions, transfer and recaps. Each lesson has **730–816 explanatory words**.

There are **98 practice/retrieval questions**: 84 choice, ten short typed terms/numbers and four targeted token-marking questions. Fourteen additional discovery questions are included. Choice options and their individual feedback are rotated together using a stable ID-derived offset; the answer position is not invariably the first option. Typed answers use explicit accepted short forms, while creative rewriting remains self-assessed with a rubric.

## Pedagogical checks

- Meaning-based implication is taught as a reading/composition relation, without recreating an argumentation/fallacy curriculum.
- Contextual inference, semantic implication and presupposed background retain different statuses; diagnostic tests include their limitations.
- Quantifier lessons fix domains, distinguish cardinal from proportional descriptions, and separate non-empty overlap from the usual not-all inference.
- Scope distinguishes no obligation from prohibition. Modal source, strength, information source and certainty are not conflated.
- Ambiguity, vagueness and missing detail use different repair methods. A structural ambiguity requires plausible alternative scenarios.
- Composition includes non-intersective modifiers and limits on substitution under reported perspectives.
- Dutch tense/aspect examples do not import English progressive or present-perfect restrictions. A past state need not have ended; an earlier result need not persist now.
- Register and speech acts distinguish form, intended act, effect, social relation and the source of an evaluative perspective.

## Validation

Isolated TypeScript compilation and ESLint pass. Runtime inspection confirms fourteen unique lesson IDs, three sections per lesson, five practice and two retrieval questions each, 98 unique practice/retrieval question IDs, complete feedback/options pairing, valid correct-answer indices and in-range mark targets. Correct positions across choices and discoveries are distributed 28/38/32.

All 107 dedicated argumentation/fallacy files still match the pre-rebuild SHA256 manifest at the time of this check. The parent is editing the shared AppShell boundary; this agent has not changed shared/protected application files.
