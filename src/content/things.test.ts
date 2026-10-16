import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { THING_IDS, thingIcon, thingModel } from './things';

const file = (url: string) => join(process.cwd(), 'public', url);

describe('3D-voorwerpen', () => {
  it.each(THING_IDS)('%s heeft een model en een icoon, klein genoeg voor de telefoon', (id) => {
    expect(existsSync(file(thingModel(id)))).toBe(true);
    expect(existsSync(file(thingIcon(id)))).toBe(true);
    expect(statSync(file(thingModel(id))).size).toBeLessThan(900_000);
  });
});
