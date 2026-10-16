# Rebuilt Ontleed browser verification

Suite: `e2e/ontleed.spec.ts`. It imports the real lesson arrays and accepted answers rather than maintaining a second curriculum fixture. Tests use fresh browser contexts and do not seed invented progress for the new pathway. The protected legacy player receives only its existing onboarding preference fixture.

## Completed run

Production server: `http://localhost:3137`, following root's final webpack build. Command:

```sh
E2E_BASE_URL=http://localhost:3137 npm run test:e2e -- e2e/ontleed.spec.ts --output=output/rebuild/ontleed-test-results
```

Initial verification passed 10 browser checks in 42.6 seconds. The final serialized production run passed **all 12 browser checks in 21.5 seconds**, across configured Desktop Chrome and Pixel 7 / mobile projects:

- Fresh home displays zero completed lessons and all 58 real lessons. Library exposes every actual lesson link; part, text and completed-status filters work and text/part state survives reload.
- `/les/l1` returns 404 with the new-path notice; protected `/les/a20` returns 200 and mounts the original player's title/progress interface.
- First real lesson runs discovery, all 3 theory sections, classify experiment, all 5 practice questions, writing transfer, rubric and completion. Partial classify input and checked feedback survive reload. A deliberately wrong first answer stays false and immutable after reload and completion.
- Transfer cannot advance with fewer than 12 words even when boxes are checked; a sufficient draft still cannot advance while a required criterion is unchecked. Draft and criteria persist. Completion is counted once; reload does not change the score.
- Completed explanation reading through the UI and `?lezen=1` renders all theory sections without altering the saved draft, answers, completion or retrieval schedule.
- A review round resumes before answering and retains feedback after answering. Repeated reloads do not duplicate the attempt or advance its schedule again. The correct first retrieval changes the interval to 3 days exactly once.
- A three-variant compare experiment preserves its selected variant and visited-variant completion gate across reloads.
- Source page shows the actual book metadata, explicit OCR/figure limitations and Figma/Mobbin links. Home, library, player, explanation reading, review and source screens have no horizontal overflow at either viewport.

The initial sandboxed attempt could not start Chromium because macOS denied its local Mach-port registration. The same authorized local browser command passed after automatic escalation approval. One initial test locator used label matching for the status select; it was corrected to the actual accessible combobox role. These were harness/environment issues; no app assertion needed weakening and no application bug was found in the completed run.

Screenshots from that run:

- `output/rebuild/desktop-home.png`
- `output/rebuild/desktop-lesson.png`
- `output/rebuild/mobiel-home.png`
- `output/rebuild/mobiel-lesson.png`

The final run includes root's correction of the home demo's bracket span. Visual inspection of the lesson screenshot then found a CSS regression after conversion to native radios: an old child-index selector made the letter badge stretch into a wide oval. Root removed the obsolete rule. The suite now asserts a maximum 32-pixel option-letter width at the initial lesson screenshot. After the final CSS-only production restart, both targeted lesson checks passed in 11.8 seconds and refreshed the two lesson screenshots. The final mobile lesson image was visually inspected: letter badges are compact circles and answer text uses the remaining row width. Home screenshots already include the bracket correction. No functional check needed weakening.

Final targeted command:

```sh
E2E_BASE_URL=http://localhost:3137 npm run test:e2e -- e2e/ontleed.spec.ts --grep 'a complete first lesson' --workers=1 --output=/tmp/ontleed-final-badge-results
```

## Additional protected review regression

The additional regression passed in both viewports during the final 12-check run. It seeds only a valid historical `l1` completion and a scored archived question fingerprint. The protected argument review page shows an empty stack, and the protected knowledge/mistake focus routes do not resurface retired language topics. Lint and repository TypeScript verification pass with the test present.
