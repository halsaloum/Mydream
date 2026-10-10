import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CLIP_KEYS } from './clips.generated';
import { clipKey, clipText, hasClip } from './clips';
import { collectSpoken } from './spoken';

/**
 * De pennig-stem moet bij de inhoud passen. `UPDATE_STEM=1` schrijft de lijst met teksten
 * (scripts/stem/teksten.json) waaruit `scripts/stem/maak.py` de bestanden maakt.
 */
const ROOT = join(__dirname, '../../..');
const spoken = collectSpoken();

describe('pennig-stem', () => {
  it('geeft elke tekst een eigen sleutel', () => {
    const byKey = new Map<string, string>();
    for (const { text } of spoken) {
      const key = clipKey(text);
      const other = byKey.get(key);
      expect(other === undefined || other === clipText(text), `${text} en ${other} krijgen dezelfde sleutel`).toBe(true);
      byKey.set(key, clipText(text));
    }
    if (process.env.UPDATE_STEM) {
      const list = spoken.map(({ text, task }) => ({ key: clipKey(text), text: clipText(text), task }));
      writeFileSync(join(ROOT, 'scripts/stem/teksten.json'), `${JSON.stringify(list, null, 1)}\n`);
    }
  });

  it('heeft een bestand voor elk dictee en elke reeks die je moet horen', () => {
    const missing = spoken.filter((entry) => entry.task && !hasClip(entry.text)).map((entry) => entry.text);
    expect(missing, 'Maak de bestanden opnieuw: zie scripts/stem/README.md').toEqual([]);
  });

  it('heeft elk bestand uit de lijst echt in public/stem', () => {
    const keys = CLIP_KEYS.split(' ').filter(Boolean);
    const absent = keys.filter((key) => !existsSync(join(ROOT, 'public/stem', `${key}.mp3`)));
    expect(absent).toEqual([]);
    expect(readFileSync(join(ROOT, 'src/lib/voice/clips.generated.ts'), 'utf8')).toContain('CLIP_KEYS');
  });
});
