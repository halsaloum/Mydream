'use client';

import { useEffect } from 'react';
import { Button, ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function AppError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      title="Dit scherm kon niet laden"
      mood="sad"
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => retry()}>
            Probeer opnieuw
          </Button>
          <ButtonLink href="/" variant="secondary" size="lg">
            Naar Leren
          </ButtonLink>
        </div>
      }
    >
      Er ging iets mis bij het tonen van deze pagina. Je voortgang is bewaard.
    </EmptyState>
  );
}
