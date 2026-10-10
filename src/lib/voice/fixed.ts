/** Vaste zinnen buiten de lessen die pennig voorleest; ze krijgen ook een bestand van de pennig-stem. */

/** Een zin vol lastige Nederlandse klanken: ui, uu, eu, ij, de g en de sch. */
export const STEM_SAMPLE = 'Hoi! Zo klinkt je Nederlandse stem. Luister: huis, muur, neus, wijn, gracht, Scheveningen.';

/** Wat de pennig-stem zegt als je hem kiest in de instellingen. */
export const STEM_HELLO = 'Hoi, ik ben de stem van pennig.';

/** Het woord op de startpagina, letter voor letter en als geheel. */
export const HERO_LETTERS = ['b', 'o', 'e', 'k'] as const;

export const FIXED_SPOKEN: readonly string[] = [STEM_SAMPLE, STEM_HELLO, ...HERO_LETTERS, HERO_LETTERS.join('')];
