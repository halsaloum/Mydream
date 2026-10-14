import { chunks } from '@/lib/speech';
import type { ReadingPart, ReadingWord } from './types';

const ids = new WeakMap<HTMLElement, number>();
let nextId = 0;
const blocks = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'DT', 'DD', 'FIGCAPTION', 'LEGEND', 'SUMMARY', 'TR', 'BLOCKQUOTE', 'LABEL']);
const containers = new Set(['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'ASIDE', 'UL', 'OL', 'DL', 'FIGURE', 'FIELDSET', 'TABLE', 'TBODY', 'THEAD', 'TFOOT']);
const ignored = 'script,style,noscript,template,nav,header,[role="tablist"],[data-readaloud-ignore],[data-readaloud-hidden="true"],[hidden],[aria-hidden="true"],[inert]';

function hidden(element: Element): boolean {
  if (element.closest(ignored)) return true;
  if (element.classList.contains('sr-only') && !/^(?:fout|goed|juist|correct|onjuist):?$/iu.test(element.textContent?.trim() ?? '')) return true;
  const html = element instanceof HTMLElement ? element : null;
  if (html?.classList.contains('text-transparent')) return true;
  const style = getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse' || style.opacity === '0') return true;
  if (style.color === 'transparent' || style.color === 'rgba(0, 0, 0, 0)') return true;
  // Kept-mounted collapsibles must not expose their model answers to the speech engine.
  if (html && (html.hasAttribute('data-closed') || html.hasAttribute('data-panel-closed'))) return true;
  if (html && html.style.height === '0px' && /hidden|clip/.test(style.overflow + style.overflowY)) return true;
  if (html?.matches('article[data-step-pos]')) {
    const active = html.closest('[data-reading-step]')?.getAttribute('data-reading-step');
    if (active !== null && active !== undefined && active !== html.getAttribute('data-step-pos')) return true;
  }
  if (html?.hasAttribute('data-reading-panel-index')) {
    const active = html.closest('[data-reading-panel]')?.getAttribute('data-reading-panel');
    if (active !== html.getAttribute('data-reading-panel-index')) return true;
  }
  return false;
}

function imageName(element: Element): string {
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) return labelledBy.split(/\s+/u).map((id) => element.ownerDocument.getElementById(id)?.textContent ?? '').join(' ').trim();
  return element.getAttribute('aria-label') ?? element.getAttribute('alt') ?? element.querySelector('title')?.textContent ?? '';
}

/** Only currently visible lesson content; no answers are read from the lesson's source object. */
export function collectReadingParts(scope: HTMLElement): ReadingPart[] {
  const parts: ReadingPart[] = [];
  let buffer = '';
  let owner: HTMLElement = scope;
  const append = (text: string, element: HTMLElement) => {
    if (!buffer.trim()) owner = element;
    buffer += text;
  };
  const flush = () => {
    const text = buffer.replace(/\s+/gu, ' ').trim();
    buffer = '';
    if (!text) return;
    let id = ids.get(owner);
    if (id === undefined) { id = ++nextId; ids.set(owner, id); }
    for (const [index, chunk] of chunks(text).entries()) parts.push({ id: `${id}:${parts.length}:${index}`, text: chunk, element: owner });
  };
  const visit = (node: Node, parent: HTMLElement) => {
    if (node.nodeType === Node.TEXT_NODE) { append(node.textContent ?? '', parent); return; }
    if (!(node instanceof Element) || hidden(node)) return;
    const element = node instanceof HTMLElement ? node : parent;
    if (node.matches('svg,img,[role="img"]')) {
      const description = imageName(node);
      if (description.trim()) { flush(); append(description, element); flush(); }
      return;
    }
    if (node.tagName === 'BR') { append(' ', element); return; }
    if (node.tagName === 'SELECT') {
      const select = node as HTMLSelectElement;
      append(` ${select.selectedOptions[0]?.textContent ?? ''} `, element);
      return;
    }
    if (node.tagName === 'TEXTAREA') return;
    if (node.tagName === 'INPUT') {
      const input = node as HTMLInputElement;
      if (['text', 'search', 'number', 'email', 'tel', 'url'].includes(input.type)) append(' invulvak ', element);
      return;
    }
    if (node.matches('video,audio,iframe,canvas,option')) return;
    // Separate adjacent content controls, such as alphabet tiles, without changing
    // punctuation around inline examples inside an ordinary sentence.
    if (node.tagName === 'BUTTON' && node.previousSibling instanceof Element && node.previousSibling.tagName === 'BUTTON') append(' ', element);
    const block = blocks.has(node.tagName) || containers.has(node.tagName);
    if (block) flush();
    if (node.tagName === 'DETAILS' && !(node as HTMLDetailsElement).open) {
      const summary = [...node.children].find((child) => child.tagName === 'SUMMARY');
      if (summary) visit(summary, element);
    } else for (const child of node.childNodes) visit(child, element);
    if (block) flush();
  };
  visit(scope, scope);
  flush();
  return parts;
}

/** Native UTF-16 positions map to the actual spoken word, including repeated words. */
export function readingWord(text: string, charIndex: number, charLength = 0): ReadingWord | null {
  if (!Number.isInteger(charIndex) || charIndex < 0 || charIndex >= text.length) return null;
  if (Number.isInteger(charLength) && charLength > 0 && charIndex + charLength <= text.length && /[\p{L}\p{N}]/u.test(text.slice(charIndex, charIndex + charLength))) {
    return { start: charIndex, end: charIndex + charLength };
  }
  if (typeof Intl.Segmenter === 'function') {
    for (const segment of new Intl.Segmenter('nl', { granularity: 'word' }).segment(text)) {
      if (segment.isWordLike && segment.index <= charIndex && charIndex < segment.index + segment.segment.length) return { start: segment.index, end: segment.index + segment.segment.length };
    }
  }
  for (const match of text.matchAll(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)) {
    if (match.index <= charIndex && charIndex < match.index + match[0].length) return { start: match.index, end: match.index + match[0].length };
  }
  return null;
}
