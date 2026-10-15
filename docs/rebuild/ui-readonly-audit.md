# Read-only UI audit

Audit scope: the new player, question, lab, library, home, progress, settings, tools, sources and shell components, plus the shared routing/hydration boundaries needed to check preserved argumentation. This is a source-level audit before the parent's actual browser/visual verification. No UI files were changed by this audit.

## Actionable findings at audit time

1. **P1 — Last protected legacy lesson points to a removed lesson.** `LessonRoute` uses the archived catalog's `nextLessonEntry` unconditionally. A read-only SSR catalog lookup confirms `a35 → d5`; the new route serves only new lessons and protected `a20–a35`, so `/les/d5` now returns not-found. Limit legacy argument next selection to protected IDs and return to `/argumentatie` at the end.
2. **P2 — The preserved shell's review counts lead to a different review feature.** Its Herhalen badge still uses legacy progress/practice counts, while `/herhalen` now renders only new Ontleed records. The original `/herhalen/sessie` and `/herhalen/kennis` endpoints remain, but their main entry card has been replaced. Retain a discoverable path for protected argumentation review without exposing removed course content.
3. **P2 — Lab state disappears on returning or reloading.** `LabView` keeps comparison visits, classifications, checked feedback and mark/order answers solely in local React state. The player persists only the `lab='onderzocht'` marker. Return to the step or reload: the experiment appears unanswered while Continue can remain enabled. Persist experiment state or restore a truthful completed experiment representation.
4. **P2 — Completion promises the wrong review date after a repeat.** The completion card always says tomorrow, but re-completing intentionally leaves an existing retrieval schedule intact; it can be seven/twenty-one days away or already overdue. Show the actual saved due date/status.
5. **P2 — Saved feedback and displayed answer can disagree after cross-tab updates.** `QuestionView` initializes local answer from saved once. When the storage listener brings a saved answer into an already mounted question, feedback uses saved correctness while radio/mark/input/order rendering still uses stale local selection. Derive the displayed answer from saved when present; use session identity in keys for restarts.
6. **P2 — Custom radio semantics lack radio keyboard behavior.** Buttons declare radio roles but implement neither arrow selection nor roving tab focus. Use native radios or implement the expected keyboard behavior.
7. **P2 — The transfer word gate is invisible.** The authoritative state and player require twelve words, but the learner is only told to write and check the rubric. A short valid-looking response leaves model and Continue disabled without explaining the length requirement. Show the word count/minimum and remaining criterion count.
8. **P2 — Completed theory cannot be revisited without restarting.** Reopening a completed lesson shows its completion card. The review link labelled Uitleg bekijken therefore cannot reach theory without clearing the session through Les opnieuw doen. Provide a reading path that preserves attempts and schedule.
9. **P2 — Stage changes leave focus behind.** Verder changes the central content while focus remains on the same fixed footer button; there is no heading focus or stage announcement. Focus the new heading/main after advance/back. The hidden 1px file input also needs focus-within treatment on its visible import label.

The home resume condition for restarted completed lessons and the player transfer helper alignment were already corrected by the parent during this audit, so they are not outstanding findings here.

## Boundaries checked

All 107 dedicated argumentation/fallacy files still match their pre-rebuild SHA256 hashes. New CSS selectors remain scoped under `.ontleed`; the protected shell selects its original implementation for `/argumentatie` and descendants. The legacy argument content remains semantically in the archived catalog. The issues above concern shared navigation and new UI behavior rather than mutations of protected content.

Sources and tools describe their limits explicitly: the word-pattern tool does not claim full grammatical analysis; source-reading coverage distinguishes OCR text reading from checking every figure; practical review intervals are not advertised as experimentally established mastery. No additional misleading source or grammar claim was identified in those screens.
