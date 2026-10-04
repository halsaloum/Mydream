import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata: Metadata = { title: 'Niet gevonden' };

export default function NotFound() {
  return (
    <main id="inhoud" className="mx-auto grid min-h-dvh w-full max-w-xl place-items-center px-gutter">
      <EmptyState
        title="Deze pagina bestaat niet"
        mood="think"
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg">
              Naar Leren
            </ButtonLink>
            <ButtonLink href="/lessen" variant="secondary" size="lg">
              Alle lessen
            </ButtonLink>
          </div>
        }
      >
        De link klopt niet of de pagina is verplaatst. Pim helpt je terug op weg.
      </EmptyState>
    </main>
  );
}
