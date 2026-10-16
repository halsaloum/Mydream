import { describe, expect, it } from 'vitest';
import { ARGUMENT_MAP_PRESETS, analyzeArgumentMap, argumentMapRanks, deactivateArgumentNode, validateArgumentMap, type ArgumentMap } from './maps';

const preset = (id: string): ArgumentMap => ARGUMENT_MAP_PRESETS.find((item) => item.id === id)!;

describe('argument-map support and attack grammar', () => {
  it('keeps each researched example structurally valid', () => {
    for (const map of ARGUMENT_MAP_PRESETS) expect(validateArgumentMap(map), map.id).toEqual([]);
  });

  it('distinguishes a linked dependency from convergent independent inferences', () => {
    expect(analyzeArgumentMap(preset('linked')).completeRoutes('c')).toBe(1);
    expect(analyzeArgumentMap(deactivateArgumentNode(preset('linked'), 'p1')).completeRoutes('c')).toBe(0);
    expect(analyzeArgumentMap(preset('convergent')).completeRoutes('c')).toBe(2);
    expect(analyzeArgumentMap(deactivateArgumentNode(preset('convergent'), 'p1')).completeRoutes('c')).toBe(1);
  });

  it('propagates missing support through a serial intermediate conclusion', () => {
    const map = deactivateArgumentNode(preset('serial'), 'p1');
    const analysis = analyzeArgumentMap(map);
    expect(analysis.completeRoutes('m')).toBe(0);
    expect(analysis.completeRoutes('c')).toBe(0);
    expect(analysis.inferences.find((step) => step.id === 'i2')?.missing).toContain('m');
  });

  it('does not count blank propositions or a disabled destination as complete support', () => {
    const map = preset('linked');
    expect(analyzeArgumentMap({ ...map, nodes: map.nodes.map((node) => node.id === 'p2' ? { ...node, text: '   ' } : node) }).completeRoutes('c')).toBe(0);
    const disabledDestination = analyzeArgumentMap(deactivateArgumentNode(map, 'c'));
    expect(disabledDestination.completeRoutes('c')).toBe(0);
    expect(disabledDestination.inferences[0]?.complete).toBe(false);
  });

  it('places visible inference connectors between content nodes, including a warrant authorization', () => {
    const serial = argumentMapRanks(preset('serial'));
    const rank = (id: string) => serial.find((item) => item.id === id)?.rank ?? -1;
    expect(rank('p1')).toBeLessThan(rank('i1'));
    expect(rank('i1')).toBeLessThan(rank('m'));
    expect(rank('m')).toBeLessThan(rank('i2'));
    expect(rank('i2')).toBeLessThan(rank('c'));
    const toulmin = preset('toulmin');
    expect(toulmin.inferences.find((step) => step.id === 'i1')?.from).toEqual(['d']);
    expect(toulmin.inferences.find((step) => step.id === 'i1')?.warrant).toBe('w');
    expect(toulmin.nodes.find((node) => node.id === 'q')?.qualifies).toBe('c');
  });

  it('requires an undercut to target a connector and a rebuttal to target content', () => {
    const map = preset('convergent');
    expect(validateArgumentMap({ ...map, attacks: [{ id: 'a1', from: 'o', to: 'i2', kind: 'undercut' }] })).toEqual([]);
    expect(validateArgumentMap({ ...map, attacks: [{ id: 'a1', from: 'o', to: 'c', kind: 'undercut' }] })).not.toEqual([]);
    expect(validateArgumentMap({ ...map, attacks: [{ id: 'a1', from: 'o', to: 'c', kind: 'rebuttal' }] })).toEqual([]);
  });

  it('records a challenge without automatically deciding its success', () => {
    const map = { ...preset('linked'), attacks: [{ id: 'a1', from: 'o', to: 'i1', kind: 'undercut' as const }] };
    const challenged = analyzeArgumentMap(map);
    expect(challenged.completeRoutes('c')).toBe(1);
    expect(challenged.inferences[0]?.attacks).toHaveLength(1);
    expect(analyzeArgumentMap(deactivateArgumentNode(map, 'o')).inferences[0]?.attacks).toHaveLength(0);
  });

  it('rejects circular justification and repetition as new independent grounds in this workbench', () => {
    const map = preset('linked');
    expect(validateArgumentMap({ ...map, inferences: [...map.inferences, { id: 'i2', from: ['c'], to: 'p1' }] }).join(' ')).toContain('acyclisch');
    expect(validateArgumentMap({ ...map, inferences: [...map.inferences, { id: 'i2', from: ['p2', 'p1'], to: 'c' }] }).join(' ')).toContain('herhalen');
  });
});
