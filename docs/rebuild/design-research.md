# Design research and preservation contract

## Inspected references

Brilliant's actual web course flow in the user's signed-in Mobbin browser session, inspected on 15 October 2026:
https://mobbin.com/flows/acfd786d-367b-43d6-9058-14dff69bc8b2

Brilliant's quiz flow, including the focused lesson introduction, inspected in the same session:
https://mobbin.com/flows/471e25d8-9d8d-481a-9337-0e284f2f9d13

Reference catalog:
https://mobbin.com/apps/brilliant-web-3f0be8a7-4484-4f9a-8773-a80e3a882db2/bbbbe90f-2c1a-4681-b157-68bd061ba4fd/screens

## Chosen direction

A white canvas, restrained black typography, a clear next lesson, illustrated course families, generous whitespace, thin borders and purposeful green, purple and blue accents. The source screenshots show a compact global header, a prominent recommended course, and course groups arranged as learning paths. The player uses a narrow focused canvas, a small top progress indicator and a persistent continuation control. These are references for an original Dutch learning app, not assets to copy into it.

Product font: Figtree from the existing Next font setup. Use readable sans-serif instruction, stronger typographic hierarchy and large sentence examples. Product identity: Ontleed, van woord tot volle zin. Illustrations are original code-native SVG/block constructions. Figma must contain editable layers, variables and reusable course-card/button components; desktop course overview and focused lesson screen are the required review views.

## Preservation

The existing argumentation and fallacies section is exempt from reconstruction. Its dedicated content, components, player, labs, diagrams, videos, routes and state must remain unchanged. Shared global CSS and the old shell's rendering on argumentation routes remain unchanged. New styles are scoped to the reconstructed app. Keep the catalog argument lesson objects identical and retain all argument lesson IDs and URLs. New lesson IDs and independent storage prevent old writing progress from masquerading as completion of replaced material.
