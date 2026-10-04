import { parseRich } from '@/content/text';
import { cn } from '@/lib/cn';

/** Lesinhoud met `*taalvoorbeelden*` als gemarkeerde voorbeelden in het accent van de les. */
export function RichText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {parseRich(text).map((segment, i) =>
        segment.emphasis ? (
          <em key={i} className={cn('example-mark')}>
            {segment.text}
          </em>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </span>
  );
}
