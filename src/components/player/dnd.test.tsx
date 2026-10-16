import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PracticeDnd } from './dnd';

describe('sleepbediening bij vrijgegeven feedback', () => {
  it('wisselt tussen oefenen en vergrendelde feedback zonder de React-hookvolgorde te veranderen', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const props = { onDrop: vi.fn(), renderOverlay: () => null };
    const { rerender, unmount } = render(<PracticeDnd {...props} disabled={false}><p>Oefenblokken</p></PracticeDnd>);
    try {
      rerender(<PracticeDnd {...props} disabled><p>Feedback</p></PracticeDnd>);
      rerender(<PracticeDnd {...props} disabled={false}><p>Nieuwe opdracht</p></PracticeDnd>);
      expect(error.mock.calls.filter((args) => /changed size between renders|order of Hooks|dependency array/iu.test(args.join(' ')))).toEqual([]);
    } finally {
      unmount();
      error.mockRestore();
    }
  });
});
