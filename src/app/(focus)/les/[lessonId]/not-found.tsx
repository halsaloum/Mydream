import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function LessonNotFound() {
  return (
    <main id="inhoud" className="mx-auto grid min-h-dvh w-full max-w-xl place-items-center px-gutter">
      <EmptyState
        title="Deze les bestaat niet"
        mood="think"
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/lessen" size="lg">
              Naar alle lessen
            </ButtonLink>
            <ButtonLink href="/" variant="secondary" size="lg">
              Naar Leren
            </ButtonLink>
          </div>
        }
      >
        De link klopt niet, of de les is verplaatst. In de bibliotheek vind je alle lessen per niveau en vakgebied.
      </EmptyState>
    </main>
  );
}
