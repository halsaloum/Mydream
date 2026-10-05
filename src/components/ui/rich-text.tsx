'use client';

import { Volume2 } from 'lucide-react';
import { parseRich } from '@/content/text';
import { cn } from '@/lib/cn';
import { speak, speakableExample, useCanSpeak } from '@/lib/speech';
import { useSettings } from '@/state/settings';

/**
 * Lesinhoud met `*taalvoorbeelden*` als gemarkeerde voorbeelden in het accent van de les.
 * Met `listen` kun je uitspreekbare voorbeelden aantikken om ze in het Nederlands te horen.
 */
export function RichText({ text, className, listen = false }: { text: string; className?: string; listen?: boolean }) {
  const canSpeak = useCanSpeak();
  const enabled = useSettings((state) => state.speech.examples);
  const audible = listen && canSpeak && enabled;
  return (
    <span className={className}>
      {parseRich(text).map((segment, i) => {
        if (!segment.emphasis) return <span key={i}>{segment.text}</span>;
        const spoken = audible ? speakableExample(segment.text) : null;
        if (spoken === null) {
          return (
            <em key={i} className={cn('example-mark')}>
              {segment.text}
            </em>
          );
        }
        return <ListenMark key={i} text={segment.text} spoken={spoken} />;
      })}
    </span>
  );
}

/** Een taalvoorbeeld dat je kunt aantikken: het ziet eruit als elk voorbeeld, met een klein luidsprekertje. */
function ListenMark({ text, spoken }: { text: string; spoken: string }) {
  return (
    <button
      type="button"
      lang="nl"
      onClick={() => speak(spoken)}
      title={`Tik om ${spoken} te horen`}
      aria-label={`${text}, tik om te horen`}
      className="example-mark example-listen"
    >
      {text}
      <Volume2 aria-hidden className="example-listen-icon" strokeWidth={2.75} />
    </button>
  );
}
