import { lessonCoreChecks } from '@/content/argumentation/core-checks';
import { argumentInquiries } from '@/content/argumentation/inquiries';
import { lessonScaffolds } from '@/content/argumentation/scaffolds';
import type { ArgumentLab, ArgumentLesson } from '@/content/argumentation/types';
import type { ArgumentSession } from '@/state/argumentation';
import { ARGUMENT_MAP_PRESETS } from './maps';
import type { TheoryPage } from './theory-pages';

type ReadingOption = { id: string; text: string; feedback: string };

/** Keep paragraph boundaries, numbers and logical notation as authored. */
const paragraphs = (...parts: (string | undefined | false)[]): string => parts
  .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
  .map((part) => part.trim())
  .join('\n\n');

const optionsText = (options: ReadingOption[], lettered = false): string => options
  .map((option, index) => lettered ? `${String.fromCharCode(65 + index)}. ${option.text}` : option.text)
  .join('\n\n');

/** Answer values are lookup keys only: never speak a learner's saved writing. */
const selectedOption = (options: ReadingOption[], session: ArgumentSession, key: string) => options
  .find((option) => option.id === session.answers[key]?.value);

const objectivesText = (lesson: ArgumentLesson) => paragraphs('Na deze les kun je', ...lesson.objectives);

// These are the fixed LabFrame introductions. Dynamic results/predictions live in
// local component state, so they cannot safely be reconstructed from a session.
const labIntroductions: Record<ArgumentLab, { title: string; description: string }> = {
  structure: {
    title: 'Het argument als bouwwerk',
    description: 'Verwijder een reden of voeg een bezwaar toe. Ontdek welke verbinding een argument draagt en welke aanname om uitleg vraagt.',
  },
  causality: {
    title: 'Wanneer gemiddelden misleiden',
    description: 'Een teamleider vergelijkt 1.000 medewerkers met een training en 1.000 zonder. Het voorbeeld is fictief. Verander hun ervaring en beoordeel waarom één totaal je op het verkeerde been kan zetten.',
  },
  bayes: {
    title: 'Van een signaal naar een conclusie',
    description: 'Een spamfilter markeert een e-mail. Hoe zeker weet je nu dat het spam is? Stel het model in, leg een voorspelling vast en bekijk daarna de exacte aantallen.',
  },
};

/**
 * Provider-authored text for exactly the current reading page.
 * Reveal predicates mirror TheoryReader, FoundationView, LessonWarmup,
 * CoreCheckView and CasePreparation. No exercises, notes, edited maps or
 * textarea contents are read; feedback is resolved from authored choices.
 */
export function readingText(lesson: ArgumentLesson, page: TheoryPage, session: ArgumentSession): string {
  switch (page.kind) {
    case 'concept': {
      const concept = page.foundation;
      const selected = selectedOption(concept.options, session, `foundation-${concept.id}`);
      return paragraphs(
        page.title,
        concept.teaser,
        concept.body,
        'Zo werkt het in een gesprek',
        concept.example,
        'Probeer een nieuw geval',
        concept.scenario,
        concept.question,
        optionsText(concept.options, true),
        selected && (selected.id === concept.answer ? 'Je past het begrip hier goed toe.' : 'Bekijk dit geval nog eens.'),
        selected?.feedback,
        `Deze begripsoefening telt niet mee in je toetsresultaat. ${session.finished ? 'Je bewaarde keuze blijft zichtbaar.' : 'Gebruik de feedback om je keuze te herzien.'}`,
      );
    }
    case 'start': {
      const scaffold = lessonScaffolds[lesson.id];
      const selected = scaffold && selectedOption(scaffold.options, session, `warmup-${lesson.id}`);
      const correct = selected?.id === scaffold?.answer;
      return paragraphs(
        page.title,
        scaffold?.context,
        scaffold?.question,
        scaffold && optionsText(scaffold.options),
        selected && (correct ? 'Deze eerste stap staat.' : 'Kijk nog eens naar de vraag.'),
        selected?.feedback,
        selected && correct && scaffold?.bridge,
        scaffold && 'Deze startvraag is oefening met begeleiding en telt niet mee in je score. De uitleg helpt je verder; later in de les krijg je meer verantwoordelijkheid.',
        objectivesText(lesson),
        lesson.checkpoint && 'Deze toets meet je eerste antwoord per opdracht. Vanaf 80% is het checkpoint behaald. Je krijgt na elke vraag uitleg en kunt de volledige toets opnieuw maken.',
      );
    }
    case 'section': {
      const section = lesson.sections[page.sectionIndex];
      if (!section) return page.title;
      const inquiry = argumentInquiries[lesson.id];
      const check = page.sectionIndex === 1 ? lessonCoreChecks[lesson.id] : undefined;
      const selected = check && selectedOption(check.options, session, `core-${lesson.id}`);
      const correct = selected?.id === check?.answer;
      // Section zero's example belongs to the inquiry page whenever one exists.
      const showExample = (page.sectionIndex > 0 || !inquiry) && (!check || correct || session.finished);
      return paragraphs(
        page.title,
        section.body,
        check && 'Een nieuw geval',
        check && 'Probeer deze denkstap',
        check?.scenario,
        check?.prompt,
        check && optionsText(check.options, true),
        selected && (correct ? 'Deze stap klopt voor dit geval.' : 'Bekijk de verbinding nog eens.'),
        selected?.feedback,
        check && `Dit is begeleide oefening en telt niet mee in je toetsresultaat. ${session.finished ? 'Je bewaarde keuze blijft hier zichtbaar.' : 'Gebruik de uitleg om je keuze te herzien.'}`,
        showExample && 'Uitgewerkt voorbeeld',
        showExample && section.example,
        section.takeaway,
      );
    }
    case 'inquiry': {
      const inquiry = argumentInquiries[lesson.id];
      if (!inquiry) return page.title;
      const revealed = session.answers[`inquiry-${lesson.id}`]?.checked || session.finished;
      return paragraphs(
        page.title,
        inquiry.scenario,
        inquiry.prompt,
        !revealed && 'Schrijf minstens acht woorden voordat je de uitwerking ziet. Deze denkstap heeft geen automatische score.',
        revealed && 'Een beargumenteerde uitwerking',
        revealed && inquiry.model,
        revealed && inquiry.followUp,
        revealed && 'Je eerste analyse en herziening blijven lokaal bewaard. Je vergelijkt de onderbouwing zelf; de tekst wordt niet automatisch nagekeken.',
        revealed && lesson.sections[0] && 'Uitgewerkt voorbeeld',
        revealed && lesson.sections[0]?.example,
      );
    }
    case 'workshop': {
      const preset = ARGUMENT_MAP_PRESETS.find((entry) => entry.id === page.presetId);
      return paragraphs(
        page.title,
        'Maak deze kaart je eigen.',
        'Maak je eigen afleidingen, voeg verzwegen aannames toe en kies welk doelwit een tegenwerping raakt. Leg daarna een voorspelling vast en toets je reconstructie met een tegenproef.',
        preset?.description,
        preset?.investigation,
        'Je werkkaart en aantekening blijven per voorbeeld beschikbaar. ‘Herstel de casus’ maakt dat voorbeeld opnieuw leeg. Deze oefening geeft geen automatische voltooiing of waarheidsscore.',
      );
    }
    case 'deepDive':
      return paragraphs(page.title, lesson.deepDive.body);
    case 'lab': {
      const intro = lesson.lab && labIntroductions[lesson.lab];
      return paragraphs(
        page.title,
        intro && 'Voorspel eerst wat er verandert. Gebruik daarna het lab om je verklaring te toetsen.',
        intro?.title,
        intro?.description,
        intro && 'Vrij oefenen: verander één instelling, voorspel het effect en vergelijk. Dit laboratorium geeft geen cijfer.',
      );
    }
    case 'media': {
      const item = page.item;
      return paragraphs(
        page.title,
        'Neem de tijd voor een andere uitleg. Pauzeer bij een redenering en vergelijk die met je eigen analyse.',
        item.kind === 'video' ? 'Video' : 'Visuele uitleg',
        item.language,
        item.minutes ? `≈ ${item.minutes} min` : undefined,
        item.level === 'basis' ? 'Vanaf nul' : item.level === 'bachelor' ? 'Verder bouwen' : 'Verdiepen',
        item.provider,
        item.description,
        item.kind === 'video' ? 'Kijk met deze vraag' : 'Let hierop in het schema',
        item.watchFor,
        'Pas dit toe in jouw werk',
        item.question,
      );
    }
    case 'recap':
      return paragraphs(
        page.title,
        objectivesText(lesson),
        'Kijk nog één keer terug',
        'Welke reden draagt het standpunt, welke aanname verbindt beide en waar ligt de grens van de conclusie? Benoem het criterium dat je nu zelf kunt gebruiken.',
        ...lesson.sections.map((section) => section.takeaway),
      );
  }
}
