import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThinkingPreview } from './thinking-preview';

vi.mock('@/lib/motion', () => ({ useCalmMotion: () => true }));

describe('thinking preview', () => {
  it('explains both choices and resets without awarding lesson progress', async () => {
    const user = userEvent.setup();
    render(<ThinkingPreview />);
    await user.click(screen.getByRole('button', { name: /Iedereen vindt/ }));
    expect(await screen.findByText('Populair is niet hetzelfde als onderbouwd.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: /Een proef liet zien/ }));
    expect(await screen.findByText('Precies. Bewijs maakt het sterker.')).toBeVisible();
    expect(screen.getByRole('button', { name: /Een proef liet zien/ })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Opnieuw ontdekken' }));
    expect(await screen.findByText('Niet alleen lezen. Zelf kiezen, uitproberen en ontdekken waarom.')).toBeVisible();
    expect(screen.getAllByRole('button').every((button) => button.getAttribute('aria-pressed') === 'false')).toBe(true);
  });

  it('supports choosing an answer with the keyboard', async () => {
    const user = userEvent.setup();
    render(<ThinkingPreview />);
    screen.getByRole('button', { name: /Een proef liet zien/ }).focus();
    await user.keyboard('{Enter}');
    expect(await screen.findByText('Precies. Bewijs maakt het sterker.')).toBeVisible();
  });
});
