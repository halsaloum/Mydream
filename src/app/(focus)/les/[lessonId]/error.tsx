'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Button, ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useSessions } from '@/state/sessions';

/** Als de player toch vastloopt: opnieuw proberen, of de les vers beginnen. */
export default function LessonError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { lessonId } = useParams<{ lessonId: string }>();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="inhoud" className="mx-auto grid min-h-dvh w-full max-w-xl place-items-center px-gutter">
      <EmptyState
        title="Er ging iets mis in deze les"
        mood="sad"
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => retry()}>
              Probeer opnieuw
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                useSessions.getState().discard(lessonId);
                retry();
              }}
            >
              Les vers beginnen
            </Button>
            <ButtonLink href="/" variant="ghost" size="lg">
              Naar Leren
            </ButtonLink>
          </div>
        }
      >
        Je eerdere resultaten zijn bewaard. Lukt opnieuw proberen niet, begin de les dan vers.
      </EmptyState>
    </main>
  );
}
