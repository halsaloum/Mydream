import { argumentMedia } from './media';
import { fallacyMedia } from './fallacies';
import { targetedFallacyMedia } from './fallacy-media';

const related: Record<string, string[]> = {
  'basis-standpunt-en-reden': ['wiphi-eerste-redenen', 'oxford-argument-herkennen'],
  'basis-redenen-beoordelen': ['wiphi-eerste-redenen', 'wiphi-deugdelijkheid'],
  'basis-verzwegen-stap': ['hku-argumentkaart', 'hku-redenen-op-rij'],
  'basis-argument-of-uitleg': ['oxford-argument-herkennen', 'hku-redenen-op-rij'],
  'basis-verborgen-premissen': ['hku-argumentkaart', 'wiphi-geldigheid'],
  'basis-argumentstructuur': ['hku-argumentkaart', 'hku-redenen-op-rij'],
  'basis-kritiek-en-herstel': ['oxford-drogredenen', 'wiphi-stropop'],
  'basis-voorwaarden-en-gevolgen': ['wiphi-geldigheid', 'wiphi-deugdelijkheid'],
  'basis-checkpoint': ['wiphi-eerste-redenen', 'hku-redenen-op-rij'],
  'bachelor-persoon-en-expertise': ['galef-eigen-overtuiging', 'oxford-waarschijnlijke-steun'],
  'bachelor-stropop-analogie': ['wiphi-stropop', 'sutorius-woordkeuze'],
  'bachelor-dilemma-helling-cirkel': ['oxford-drogredenen', 'hku-argumentkaart'],
  'bachelor-causaliteit-statistiek': ['wiphi-samenhang-en-oorzaak', 'hku-oorzakenkaart'],
  'bachelor-geldigheid-en-tegenvoorbeelden': ['wiphi-geldigheid', 'hku-venn-tegenvoorbeeld'],
  'bachelor-checkpoint': ['galef-eigen-overtuiging', 'oxford-drogredenen'],
  'master-toulmin-bewijslast': ['purdue-toulmin', 'dhar-productief-oneens'],
  'master-weerlegbare-argumenten': ['hku-argumentkaart', 'dhar-productief-oneens'],
  'master-belangen-en-besluiten': ['dhar-productief-oneens', 'sutorius-verhaal'],
  'master-bayes-basisfrequentie': ['wiphi-basisfrequentie', 'oxford-waarschijnlijke-steun'],
  'master-sterke-redeneringen': ['purdue-toulmin', 'wiphi-deugdelijkheid'],
  'master-checkpoint': ['dhar-productief-oneens', 'purdue-toulmin'],
};

export function mediaForLesson(lessonId: string) {
  const ids = lessonId.startsWith('drogreden-')
    ? [...new Set([...(targetedFallacyMedia[lessonId.slice('drogreden-'.length)] ?? []), ...(fallacyMedia[lessonId] ?? [])])]
    : related[lessonId] ?? [];
  return ids.flatMap((id) => {
    const item = argumentMedia.find((source) => source.id === id);
    return item ? [item] : [];
  });
}
