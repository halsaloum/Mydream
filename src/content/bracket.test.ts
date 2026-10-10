import { describe, expect, it } from 'vitest';
import { isNode, parseBracket, spanText } from './bracket';

describe('woordboom in haakjes', () => {
  it('leest bladeren en knopen, van binnen naar buiten', () => {
    const tree = parseBracket('[[on [lees baar]] heid]');
    expect(tree?.leaves).toEqual(['on', 'lees', 'baar', 'heid']);
    expect(tree?.nodes.map((node) => spanText(tree, node))).toEqual(['leesbaar', 'onleesbaar', 'onleesbaarheid']);
    expect(tree && isNode(tree, { from: 1, to: 3 })).toBe(true);
    expect(tree && isNode(tree, { from: 0, to: 2 })).toBe(false);
  });

  it('weigert bomen die niet binair of niet gesloten zijn', () => {
    expect(parseBracket('[on lees baar]')).toBeNull();
    expect(parseBracket('[on [lees baar]')).toBeNull();
    expect(parseBracket('[on]')).toBeNull();
    expect(parseBracket('lees')).toBeNull();
    expect(parseBracket('[on lees] baar')).toBeNull();
  });
});
