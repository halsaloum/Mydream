# Argumentation and fallacy preservation boundary

The user explicitly excludes the argumentation and fallacy section from the rebuild. This includes both the dedicated contemporary course and the older argument lessons reachable through the shared lesson catalog. Those lesson objects, reading order, exercises, source/media guides, interactions, audio, scoring, progress records and URLs remain intact.

## Dedicated files: preserve byte for byte

`preservation-manifest.json` records SHA-256 hashes and byte sizes for 107 dedicated files before app implementation. It covers:

- `src/content/argumentation/**`: 69 contemporary argumentation/fallacy lessons, all four modules, definitions, diagrams, source guides, media lists, foundations, warmups, inquiries, core checks, scaffold content and fallacy builders.
- `src/components/argumentation/**`: complete course view, reader/player, diagrams, laboratory, exercises, media, checkpoints, page audio and CSS module.
- `src/lib/argumentation/**`: scoring/learning, path locks, duration, routes, theory-page sequencing, readaloud extraction, maps and laboratories.
- `src/state/argumentation.ts` and its tests: persisted `pennig:argumentatie` state, attempts, sessions, writing, review schedule and migration/validation.
- `src/app/(app)/argumentatie/**` and `src/app/(focus)/argumentatie/**`: `/argumentatie`, `/argumentatie/les/[lessonId]`, metadata, static parameters and not-found handling.
- `src/content/packs/argumentatie.ts`, `src/content/packs/argumentatie/**`: **16 older lesson IDs `a20`–`a35`**. They live in the legacy `alinea` layer and their domain is `tekst`, so domain-name filtering is insufficient to protect them.
- `src/content/kinds-argument.ts`, `src/content/demo/argumenten.ts`, `src/engine/argument.ts` and its tests, `src/components/player/steps/argument/**`: older argument/fallacy exercise schemas, sample data, evaluator and views.
- `src/components/home/argumentation-card.tsx` and dedicated argument/fallacy end-to-end tests.

The dedicated contemporary media are externally linked, with URLs and IDs stored in `media.ts`, `fallacy-media.ts` and `lesson-media.ts`. No dedicated `/public` media paths were referenced by these modules, so the local-media manifest is empty; their media source hashes preserve the links and associations.

## Semantic catalog snapshots

- `original-argument-course.json`: full resolved contemporary modules and all 69 lesson objects, saved before the rebuild.
- `original-argument-catalog.json`: full resolved legacy `a20`–`a35` lesson objects plus layer ID, resolved domain and cross-domain metadata. Snapshot captures post-schema/adapter/curriculum content, not only the input seeds. The original domain is `tekst`; it was selected by explicit ID membership in `ARGUMENTATIE_LESSONS`.

After catalog replacement, compare each preserved ID and entire resolved lesson object to this snapshot. Preserve legacy `/les/a20`…`/les/a35` support and the older player whenever these IDs are opened. The legacy lessons must not be silently removed when retiring other shared catalog layers.

## Shared dependencies: isolate the redesign

The manifest separately hashes 35 shared boundary files for review; they are not all forbidden to change, but every change must preserve argument functionality and appearance. Particular hazards:

1. `src/content/catalog.ts` composes `adaptLegacyCourse → withExtraLessons → withCurriculum → withSentenceLayer → CoursePackSchema`. `withExtraLessons` appends legacy argument lessons to the `alinea` layer. `createLearningPath` identifies them by `/^a(?:2\d|3[0-5])$/`, not by the domain. The new catalog should retain the exact resolved objects and provide their legacy route lookup.
2. `src/lib/practice/catalog.ts` adapts contemporary argument choice/sort/map questions for retrieval; question keys include `fingerprint(step)`. Retiring other lessons must preserve these adapted argument questions, hrefs, keys and lookup behavior.
3. `src/components/shell/app-shell.tsx` controls contemporary `/argumentatie` navigation and shared review badges. Keep its original component and use it on the protected route; introduce a separate scoped shell for redesigned sections. `src/app/(focus)/argumentatie` uses its own player header.
4. `src/app/globals.css`, root font setup, shared UI Button/ProgressBar, `motion`, `cn` and provider wrapping affect all argument screens. Leave global design tokens intact; place new styles under `.ontleed` (or similarly scoped new root) to prevent selectors leaking into argument UI.
5. `src/components/reading/lesson-reader.tsx`, `src/lib/reading/**`, `src/lib/speech.ts`, `src/state/settings.ts` support argument speech/highlighting. Keep their behavior and arguments unchanged. New-course reading controls should reuse or isolate them without altering old readaloud content selection.
6. `src/state/hydration.ts` must still rehydrate `useArgumentation`, keep cross-tab updates and publish `useHydrated`; `Providers` must still wrap the protected course. `src/state/transfer.ts` retains `arguments` export/import/reset semantics, with `ArgumentDataSchema` and `EMPTY_ARGUMENTS` unchanged.
7. `src/content/schema.ts`, `src/content/kinds.ts`, `src/engine/kinds.ts`, response/session/plan/hash modules and shared player routing continue to support argument kinds. Removing unrelated kinds can break the legacy argument player even when dedicated files are untouched.
8. `src/lib/plans.ts` and shared catalog lookups determine legacy lesson fingerprints and saved-session fit. Preserve resolved argument step order and exercise content to keep existing sessions meaningful.

## Verification to run after implementation

Compare all 107 dedicated SHA-256 hashes; compare 69 contemporary lesson objects and 16 resolved legacy lesson objects. Run argument/fallacy content, learning, map, state, audio, player and end-to-end checks. Load `/argumentatie`, the first accessible contemporary lesson, a fallacy lesson when available, and `/les/a20`; compare original typography/layout and ensure navigation, starting/restarting, question feedback, local progress and readaloud still work. Review shared-file diffs for indirect impact, particularly catalog, practice keys, hydration and global CSS.
