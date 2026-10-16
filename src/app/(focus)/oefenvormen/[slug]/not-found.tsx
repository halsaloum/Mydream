import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function DemoNotFound() {
  return (
    <main id="inhoud" className="mx-auto grid min-h-dvh w-full max-w-xl place-items-center px-gutter">
      <EmptyState
        title="Deze oefenvorm bestaat niet"
        mood="think"
        action={
          <ButtonLink href="/oefenvormen" size="lg">
            Alle oefenvormen
          </ButtonLink>
        }
      >
        Kies een oefenvorm uit het overzicht.
      </EmptyState>
    </main>
  );
}
