import { HomeView } from '@/components/home/home-view';

const DIRECTION = `<!--
THESIS: De interface is de constructie zelf: elk scherm toont waar je staat in acht bouwlagen, van letter tot alinea. Geen gamified dashboard met XP-tellers.
OWN-WORLD: Licht canvas, witte platen met 2px randen en tastbare slagschaduwen; groen, blauw, paars en oranje als domeinaccenten met donkere teksttinten; Fraunces voor taalvoorbeelden, Bricolage Grotesque voor koppen, Figtree voor bediening; Pim het potlood als enige personage.
STORY: De leerling ziet direct welke les volgt en waarom (laag en domein), oefent in een gerichte player waarin feedback de regel uitlegt en blijft staan, en ziet fouten gericht terugkomen.
FIRST VIEWPORT: Links de cursustitel en het dagdoel, rechts "Verder met jouw les" met de hoofdknop; daaronder de bouwlagen: het groeiende voorbeeld groot in Fraunces boven een trap van acht lagen.
FORM: Bouwlagen als trap; vastgelegde wereld uit de brief, geen seed.
-->`;

export default function HomePage() {
  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION }} />
      <HomeView />
    </>
  );
}
