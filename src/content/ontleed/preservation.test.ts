import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { argumentLessons, argumentModules } from '../argumentation';
import { getLessonEntry } from '../catalog';

const root = process.cwd();
const readJson = (name: string) => JSON.parse(readFileSync(path.join(root, 'docs/rebuild', name), 'utf8'));
const manifest = readJson('preservation-manifest.json') as {
  createdBeforeRebuild: boolean;
  dedicated: { path: string; sha256: string; bytes: number }[];
};

describe('the user-protected argumentation and fallacy course', () => {
  it('preserves all 107 dedicated files byte for byte', () => {
    expect(manifest.createdBeforeRebuild).toBe(true);
    expect(manifest.dedicated).toHaveLength(107);
    for (const entry of manifest.dedicated) {
      const contents = readFileSync(path.join(root, entry.path));
      expect(contents.byteLength, entry.path).toBe(entry.bytes);
      expect(createHash('sha256').update(contents).digest('hex'), entry.path).toBe(entry.sha256);
    }
  });

  it('preserves the resolved contemporary modules and all 69 lessons', () => {
    const original = readJson('original-argument-course.json');
    expect(original.lessons).toHaveLength(69);
    expect(argumentModules).toEqual(original.modules);
    expect(argumentLessons).toEqual(original.lessons);
  });

  it('preserves all 16 legacy argument lessons and their resolved metadata', () => {
    const original = readJson('original-argument-catalog.json') as {
      entries: { lesson: { id: string }; layerId: string; domain: unknown; also: unknown }[];
    };
    expect(original.entries).toHaveLength(16);
    expect(original.entries.map(entry => entry.lesson.id)).toEqual(Array.from({ length: 16 }, (_, index) => `a${index + 20}`));
    for (const saved of original.entries) {
      const entry = getLessonEntry(saved.lesson.id);
      expect(entry, saved.lesson.id).toBeDefined();
      expect(entry!.lesson, saved.lesson.id).toEqual(saved.lesson);
      expect(entry!.layer.id, saved.lesson.id).toBe(saved.layerId);
      expect(entry!.domain, saved.lesson.id).toEqual(saved.domain);
      expect(entry!.also, saved.lesson.id).toEqual(saved.also);
    }
  });
});
