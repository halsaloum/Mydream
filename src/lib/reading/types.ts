export type ReadingPart = {
  id: string;
  text: string;
  /** Original lesson element; null for explicitly authored compatibility text. */
  element: HTMLElement | null;
};

export type ReadingWord = { start: number; end: number };
