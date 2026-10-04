'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Download, Trash2, Upload, Volume2 } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useId, useRef, useState, type ReactNode } from 'react';
import { PageHeader } from '@/components/shell/app-shell';
import { Button } from '@/components/ui/button';
import { Range, ToggleRow } from '@/components/ui/controls';
import { ConfirmDialog } from '@/components/ui/dialog';
import { PageSkeleton } from '@/components/ui/empty-state';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { notify } from '@/lib/toast';
import { useHydrated } from '@/state/hydration';
import { FOCUS_OPTIONS, GOAL_OPTIONS, START_OPTIONS, useSettings } from '@/state/settings';
import { applyImport, exportData, parseImport, resetEverything, resetProgress, type ImportData } from '@/state/transfer';

type Pending = { kind: 'import'; data: ImportData } | { kind: 'progress' } | { kind: 'all' } | null;

export function SettingsView() {
  const hydrated = useHydrated();
  const router = useRouter();
  const systemCalm = useReducedMotion() === true;
  const settings = useSettings();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending>(null);
  const [importError, setImportError] = useState<string | null>(null);

  if (!hydrated) return <PageSkeleton blocks={['h-14 w-1/2 max-w-sm', 'h-56', 'h-48', 'h-64']} />;

  const download = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pennig-voortgang-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify('Bestand opgeslagen', 'Bewaar het goed; je kunt het later weer importeren.');
  };

  const readFile = async (file: File) => {
    setImportError(null);
    const result = parseImport(await file.text());
    if (!result.ok) setImportError(result.error);
    else setPending({ kind: 'import', data: result.data });
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Instellingen" description="Alles wordt alleen in deze browser bewaard." />

      <div className="flex flex-col gap-6">
        <Section title="Geluid">
          <ToggleRow
            label="Geluidseffecten"
            description="Korte tonen bij kiezen, goed en fout."
            checked={settings.sound.enabled}
            onChange={(enabled) => {
              settings.setSound({ enabled });
              if (enabled) play('select', settings.sound.volume);
            }}
          />
          <div className="flex flex-col gap-4 border-t-2 border-line pt-4 sm:flex-row sm:items-end">
            <Range
              className="flex-1"
              label="Volume"
              value={settings.sound.volume}
              disabled={!settings.sound.enabled}
              onChange={(volume) => settings.setSound({ volume })}
              onCommit={(volume) => play('select', volume)}
            />
            <Button variant="secondary" disabled={!settings.sound.enabled} onClick={() => play('right', settings.sound.volume)}>
              <Volume2 aria-hidden className="size-[1.1rem]" strokeWidth={2.5} />
              Testtoon
            </Button>
          </div>
        </Section>

        <Section title="Beweging en effecten">
          <ToggleRow
            label="Rustige beweging"
            description="Geen verschuivende kaartjes, tellers of confetti; alleen zachte overgangen."
            checked={settings.motion === 'calm'}
            onChange={(calm) => settings.setMotion(calm ? 'calm' : 'system')}
          />
          {systemCalm && settings.motion !== 'calm' && (
            <p className="-mt-1 mb-3 rounded-control bg-sunken px-3.5 py-2.5 text-small text-ink-soft">
              Je apparaat vraagt om minder beweging; pennig volgt dat al, ook met deze schakelaar uit.
            </p>
          )}
          <div className="border-t-2 border-line">
            <ToggleRow
              label="Confetti bij afronden"
              description={settings.motion === 'calm' || systemCalm ? 'Staat uit zolang rustige beweging aan is.' : 'Een kleine beloning als een les of opdracht af is.'}
              checked={settings.effects.confetti}
              onChange={(on) => settings.setConfetti(on)}
            />
          </div>
        </Section>

        <Section title="Leerprofiel" description="Bepaalt je dagdoel en welke les als volgende wordt aangeraden.">
          <div className="flex flex-col gap-6">
            <Segmented
              label="Waar wil je vooral aan werken?"
              value={settings.profile.focus ?? ''}
              onChange={(focus) => settings.setProfile({ focus: focus as (typeof FOCUS_OPTIONS)[number]['id'] })}
              options={FOCUS_OPTIONS.map((option) => ({ value: option.id, label: option.label }))}
            />
            <Segmented
              label="Dagdoel"
              value={settings.profile.goalMinutes ? String(settings.profile.goalMinutes) : ''}
              onChange={(minutes) => settings.setProfile({ goalMinutes: Number(minutes) as (typeof GOAL_OPTIONS)[number]['minutes'] })}
              options={GOAL_OPTIONS.map((option) => ({ value: String(option.minutes), label: option.label }))}
            />
            <Segmented
              label="Startpunt"
              value={settings.profile.start ?? ''}
              onChange={(start) => settings.setProfile({ start: start as (typeof START_OPTIONS)[number]['id'] })}
              options={START_OPTIONS.map((option) => ({ value: option.id, label: option.label }))}
            />
          </div>
        </Section>

        <Section title="Lokale gegevens" description="Je voortgang staat alleen in deze browser. Bewaar een kopie om over te zetten of veilig te stellen.">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={download}>
              <Download aria-hidden className="size-[1.1rem]" strokeWidth={2.5} />
              Exporteer als bestand
            </Button>
            <Button variant="secondary" onClick={() => fileInput.current?.click()}>
              <Upload aria-hidden className="size-[1.1rem]" strokeWidth={2.5} />
              Importeer een bestand
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) void readFile(file);
              }}
            />
          </div>
          {importError && (
            <p role="alert" className="mt-4 rounded-control border-2 border-red-line bg-red-soft px-3.5 py-2.5 text-small font-semibold text-red-ink">
              {importError}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3 border-t-2 border-line pt-6">
            <Button variant="ghost" className="text-red-ink hover:bg-red-soft hover:text-red-ink" onClick={() => setPending({ kind: 'progress' })}>
              <Trash2 aria-hidden className="size-[1.1rem]" strokeWidth={2.5} />
              Voortgang wissen
            </Button>
            <Button variant="ghost" className="text-red-ink hover:bg-red-soft hover:text-red-ink" onClick={() => setPending({ kind: 'all' })}>
              <Trash2 aria-hidden className="size-[1.1rem]" strokeWidth={2.5} />
              Alles wissen en opnieuw beginnen
            </Button>
          </div>
        </Section>
      </div>

      <ConfirmDialog
        open={pending?.kind === 'import'}
        onOpenChange={(open) => !open && setPending(null)}
        title="Gegevens vervangen?"
        description={
          pending?.kind === 'import'
            ? `Je huidige voortgang en instellingen worden vervangen door het bestand van ${new Date(pending.data.exportedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}. Lopende lessen beginnen opnieuw.`
            : ''
        }
        confirmLabel="Vervangen"
        onConfirm={() => {
          if (pending?.kind !== 'import') return;
          applyImport(pending.data);
          notify('Gegevens geïmporteerd', 'Je voortgang en instellingen zijn bijgewerkt.');
        }}
      />
      <ConfirmDialog
        open={pending?.kind === 'progress'}
        onOpenChange={(open) => !open && setPending(null)}
        title="Voortgang wissen?"
        description="Afgeronde lessen, je herhaalstapel, oefentijd en lopende lessen worden gewist. Je instellingen blijven. Dit kun je niet ongedaan maken."
        confirmLabel="Voortgang wissen"
        onConfirm={() => {
          resetProgress();
          notify('Voortgang gewist');
        }}
      />
      <ConfirmDialog
        open={pending?.kind === 'all'}
        onOpenChange={(open) => !open && setPending(null)}
        title="Alles wissen?"
        description="Al je voortgang en instellingen worden gewist en je begint opnieuw bij de welkomstvragen. Dit kun je niet ongedaan maken."
        confirmLabel="Alles wissen"
        onConfirm={() => {
          resetEverything();
          router.replace('/welkom');
        }}
      />
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="rounded-card border-2 border-line bg-surface px-5 py-5 shadow-slab sm:px-7 sm:py-6">
      <h2 id={id} className="font-display text-title-sm font-extrabold">
        {title}
      </h2>
      {description && <p className="mt-1 text-small text-ink-muted">{description}</p>}
      <div className="mt-2">{children}</div>
    </section>
  );
}

/** Compacte keuze op Base UI RadioGroup: één tabstop, pijltjes kiezen. */
function Segmented({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  const id = useId();
  return (
    <div>
      <p id={id} className="mb-2.5 text-small font-bold text-ink">
        {label}
      </p>
      <RadioGroup aria-labelledby={id} value={value} onValueChange={(next) => onChange(String(next))} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Radio.Root
            key={option.value}
            value={option.value}
            className={cn(
              'inline-flex min-h-11 items-center rounded-full border-2 px-4 text-small font-bold transition-colors duration-150 outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus',
              'border-line bg-surface text-ink-soft shadow-slab-sm hover:border-line-strong hover:text-ink',
              'data-[checked]:border-green data-[checked]:bg-green-soft data-[checked]:text-green-ink data-[checked]:shadow-[0_2px_0_var(--color-green-line)]',
            )}
          >
            {option.label}
          </Radio.Root>
        ))}
      </RadioGroup>
    </div>
  );
}
