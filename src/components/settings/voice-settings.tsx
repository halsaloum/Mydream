'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { AudioLines, Info, TriangleAlert } from 'lucide-react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleRow } from '@/components/ui/controls';
import { Disclosure } from '@/components/ui/disclosure';
import { cn } from '@/lib/cn';
import { canSpeak, pickVoice, rankVoices, speak, useVoices, voiceLabel, type VoiceQuality } from '@/lib/speech';
import { SPEECH_RATES, useSettings, type SpeechRateId } from '@/state/settings';

/** Een zin vol lastige Nederlandse klanken: ui, uu, eu, ij, de g en de sch. */
const SAMPLE = 'Hoi! Zo klinkt je Nederlandse stem. Luister: huis, muur, neus, wijn, gracht, Scheveningen.';

const QUALITY: Record<VoiceQuality, { label: string; className: string }> = {
  top: { label: 'Natuurlijk', className: 'bg-green-soft text-green-ink' },
  goed: { label: 'Goed', className: 'bg-accent-soft text-accent-ink' },
  basis: { label: 'Robotachtig', className: 'bg-sunken text-ink-muted' },
};

const AUTO = 'auto';

/** Instellingen voor de Nederlandse stem: welke stem, hoe snel, en voorbeelden aantikken. */
export function VoiceSettings() {
  const speech = useSettings((state) => state.speech);
  const setSpeech = useSettings((state) => state.setSpeech);
  const voices = useVoices();
  const ranked = rankVoices(voices);
  const active = pickVoice(voices, speech.voice);
  const activeRank = ranked.find((entry) => entry.voice === active);
  const available = canSpeak(voices);
  const label = useId();
  const rateLabel = useId();

  return (
    <div className="flex flex-col gap-5">
      {!available ? (
        <Notice tone="warn">
          Deze browser heeft geen Nederlandse stem. pennig leest daarom niets voor: een Engelse stem leert je de verkeerde klanken. Hieronder staat hoe je
          er gratis een toevoegt.
        </Notice>
      ) : activeRank && activeRank.quality !== 'top' ? (
        <Notice tone="info">
          De beste stem hier klinkt {activeRank.quality === 'goed' ? 'goed, maar nog niet helemaal natuurlijk' : 'robotachtig'}. Met een natuurlijke stem hoor je
          het verschil tussen <em lang="nl">ui</em>, <em lang="nl">uu</em> en <em lang="nl">eu</em> veel beter.
        </Notice>
      ) : null}

      {ranked.length > 0 && (
        <div>
          <p id={label} className="mb-2.5 text-small font-bold text-ink">
            Stem
          </p>
          <RadioGroup
            aria-labelledby={label}
            value={speech.voice && ranked.some((entry) => entry.voice.voiceURI === speech.voice) ? speech.voice : AUTO}
            onValueChange={(next) => {
              const voice = next === AUTO ? null : String(next);
              setSpeech({ voice });
              const chosen = pickVoice(voices, voice);
              if (chosen) speak(`Hoi, ik ben ${voiceLabel(chosen)}.`);
            }}
            className="flex flex-col gap-2"
          >
            <VoiceOption value={AUTO} title="Automatisch" detail={ranked[0] ? `Nu: ${voiceLabel(ranked[0].voice)}` : undefined} />
            {ranked.map((entry) => (
              <VoiceOption
                key={entry.voice.voiceURI}
                value={entry.voice.voiceURI}
                title={voiceLabel(entry.voice)}
                detail={entry.region ?? undefined}
                quality={entry.quality}
              />
            ))}
          </RadioGroup>
        </div>
      )}

      <div>
        <p id={rateLabel} className="mb-2.5 text-small font-bold text-ink">
          Tempo
        </p>
        <RadioGroup
          aria-labelledby={rateLabel}
          value={speech.rate}
          onValueChange={(next) => setSpeech({ rate: String(next) as SpeechRateId })}
          className="flex flex-wrap gap-2"
        >
          {SPEECH_RATES.map((option) => (
            <Radio.Root key={option.id} value={option.id} className={cn(PILL, 'min-h-11 px-4')}>
              {option.label}
            </Radio.Root>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Button variant="secondary" disabled={!available} onClick={() => speak(SAMPLE)}>
          <AudioLines aria-hidden className="size-[1.1rem]" strokeWidth={2.5} />
          Hoor de stem
        </Button>
      </div>

      <div className="border-t-2 border-line">
        <ToggleRow
          label="Voorbeelden aantikken"
          description="Tik een gekleurd voorbeeldwoord in de uitleg aan om het te horen."
          checked={speech.examples}
          onChange={(examples) => setSpeech({ examples })}
        />
      </div>

      <Disclosure summary="Een mooiere Nederlandse stem krijgen" icon={<Info aria-hidden className="size-5" strokeWidth={2.4} />}>
        <ul className="list-disc space-y-2 pl-5 text-small text-ink-soft">
          <li>
            <b>Windows of elke computer:</b> open pennig in Microsoft Edge. Die heeft natuurlijke Nederlandse stemmen (Fenna, Maarten, Colette).
          </li>
          <li>
            <b>Chrome:</b> met internet staat <i>Google Nederlands</i> er vanzelf bij.
          </li>
          <li>
            <b>iPhone en iPad:</b> Instellingen › Toegankelijkheid › Gesproken materiaal › Stemmen › Nederlands. Download Xander of Claire in de versie{' '}
            <i>Verbeterd</i> of <i>Premium</i>.
          </li>
          <li>
            <b>Mac:</b> Systeeminstellingen › Toegankelijkheid › Gesproken materiaal › Systeemstem › Beheer stemmen › Nederlands.
          </li>
          <li>
            <b>Android:</b> Instellingen › Systeem › Talen › Tekst-naar-spraak › Spraakservices van Google › Nederlands installeren.
          </li>
        </ul>
        <p className="mt-3 text-small text-ink-muted">Herlaad pennig daarna; de nieuwe stem staat dan in de lijst en wordt vanzelf gekozen als hij de beste is.</p>
      </Disclosure>
    </div>
  );
}

const PILL = cn(
  'inline-flex items-center rounded-full border-2 text-small font-bold transition-colors duration-150 outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
  'border-line bg-surface text-ink-soft shadow-slab-sm hover:border-line-strong hover:text-ink',
  'data-[checked]:border-green data-[checked]:bg-green-soft data-[checked]:text-green-ink data-[checked]:shadow-[0_2px_0_var(--color-green-line)]',
);

function VoiceOption({ value, title, detail, quality }: { value: string; title: string; detail?: string | undefined; quality?: VoiceQuality }) {
  return (
    <Radio.Root value={value} className={cn(PILL, 'min-h-12 w-full justify-between gap-3 rounded-tile px-4 py-2 text-left')}>
      <span className="min-w-0">
        <span className="block truncate">{title}</span>
        {detail && <span className="block text-caption font-semibold text-ink-muted">{detail}</span>}
      </span>
      {quality && <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-caption font-extrabold', QUALITY[quality].className)}>{QUALITY[quality].label}</span>}
    </Radio.Root>
  );
}

function Notice({ tone, children }: { tone: 'warn' | 'info'; children: React.ReactNode }) {
  const Icon = tone === 'warn' ? TriangleAlert : Info;
  return (
    <p
      className={cn(
        'mt-2 flex gap-2.5 rounded-control px-3.5 py-2.5 text-small',
        tone === 'warn' ? 'border-2 border-red-line bg-red-soft font-semibold text-red-ink' : 'bg-sunken text-ink-soft',
      )}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
      <span>{children}</span>
    </p>
  );
}
