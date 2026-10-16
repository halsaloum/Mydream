import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { LessonVideo } from '@/content/ontleed/media';
import { LessonVideos } from './lesson-media';

const videos: LessonVideo[] = [
  { id: 'testvideo01', title: 'De persoonsvorm', creator: 'Testdocent', description: 'Een uitleg bij de tijdproef.', focusQuestion: 'Welk woord verandert als je de tijd verandert?', watchUrl: 'https://www.youtube.com/watch?v=testvideo01' },
  { id: 'testvideo02', title: 'Nog een tijdproef', creator: 'Testdocent', description: 'Vergelijk twee zinnen.', focusQuestion: 'Wat verandert er?', watchUrl: 'https://www.youtube.com/watch?v=testvideo02' },
];

describe('optionele lesvideo', () => {
  it('laadt pas na een klik één speler, verwijdert hem bij sluiten en houdt de externe uitweg bij laadfouten beschikbaar', () => {
    const { container } = render(<div className="ontleed"><LessonVideos videos={videos}/></div>);
    const directLink = screen.getAllByRole('link', { name: 'Open op YouTube' })[0]!;
    expect(directLink).toHaveAttribute('href', videos[0]!.watchUrl);
    expect(directLink).toHaveAttribute('target', '_blank');
    expect(container.querySelector('iframe')).not.toBeInTheDocument();

    fireEvent.error(screen.getByRole('img', { name: 'Videovoorbeeld: De persoonsvorm' }));
    expect(screen.getByRole('button', { name: 'Bekijk De persoonsvorm' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Bekijk De persoonsvorm' }));
    const firstFrame = screen.getByTitle('De persoonsvorm');
    expect(firstFrame).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/testvideo01?rel=0');
    expect(firstFrame).toHaveAttribute('loading', 'lazy');
    expect(firstFrame.getAttribute('src')).not.toContain('autoplay');
    expect(screen.getByRole('status')).toHaveTextContent('Videospeler laden…');
    fireEvent.load(firstFrame);
    expect(screen.queryByText('Videospeler laden…')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Bekijk Nog een tijdproef' }));
    expect(container.querySelectorAll('iframe')).toHaveLength(1);
    expect(firstFrame).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Video sluiten' }));
    expect(container.querySelector('iframe')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Bekijk De persoonsvorm' }));
    fireEvent.error(screen.getByTitle('De persoonsvorm'));
    expect(container.querySelector('iframe')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('De speler kon niet worden geladen.');
    expect(directLink).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Video sluiten' }));
    expect(screen.getByRole('button', { name: 'Bekijk De persoonsvorm' })).toBeVisible();
    expect(screen.queryByText('De speler kon niet worden geladen.')).not.toBeInTheDocument();
  });
});
