import { z } from 'zod';

/** Semantische accentkleuren. De app vertaalt ze naar ontwerptokens (zie globals.css). */
export const ACCENTS = ['green', 'teal', 'orange', 'yellow', 'blue', 'purple', 'navy', 'pink', 'red', 'rose', 'slate'] as const;

export const AccentSchema = z.enum(ACCENTS).describe('Semantische accentkleur; de app vertaalt die naar ontwerptokens.');

export type Accent = z.infer<typeof AccentSchema>;
