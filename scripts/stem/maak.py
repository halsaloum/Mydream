"""Maakt de geluidsbestanden van de pennig-stem (zie README.md in deze map).

Leest scripts/stem/teksten.json (alles wat pennig voorleest), spreekt elke tekst in met een
Nederlandse Piper-stem en zet het resultaat als mp3 in public/stem/<sleutel>.mp3. Bestaande
bestanden worden overgeslagen, bestanden die niet meer nodig zijn verwijderd. Daarna schrijft
het src/lib/voice/clips.generated.ts, zodat de app weet welke teksten een bestand hebben.

Gebruik: python3 scripts/stem/maak.py --model /pad/naar/nl_NL-stem.onnx [--opnieuw]
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIST = ROOT / 'scripts/stem/teksten.json'
OUT = ROOT / 'public/stem'
INDEX = ROOT / 'src/lib/voice/clips.generated.ts'

# Rustig en duidelijk: iets langzamer dan gewoon praten (het tempo "Rustig" in de app).
LENGTH_SCALE = 1.12
# Stilte voor en na elke tekst, in seconden; de app zet zelf pauzes tussen woorden van een paar.
PAD = 0.08


_voice = None


def _load(model: str):
    global _voice
    if _voice is None:
        from piper import PiperVoice  # noqa: PLC0415 (pas laden in de werker)

        _voice = PiperVoice.load(model)
    return _voice


def synthesize(model: str, text: str, target: Path) -> None:
    from piper import SynthesisConfig  # noqa: PLC0415

    voice = _load(model)
    config = SynthesisConfig(length_scale=LENGTH_SCALE, noise_scale=0.6, noise_w_scale=0.7)
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'stem.wav'
        with wave.open(str(wav), 'wb') as handle:
            voice.synthesize_wav(text, handle, syn_config=config)
        filters = f'adelay={int(PAD * 1000)}:all=1,apad=pad_dur={PAD},loudnorm=I=-18:TP=-1.5:LRA=11'
        subprocess.run(
            ['ffmpeg', '-v', 'error', '-y', '-i', str(wav), '-af', filters, '-ac', '1', '-ar', '22050', '-b:a', '40k', str(target)],
            check=True,
        )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', required=True, help='Pad naar het .onnx-bestand van de stem (met .onnx.json ernaast).')
    parser.add_argument('--opnieuw', action='store_true', help='Alle bestanden opnieuw maken, ook als ze al bestaan.')
    parser.add_argument('--werkers', type=int, default=max(1, (os.cpu_count() or 2) // 2))
    args = parser.parse_args()

    entries = json.loads(LIST.read_text(encoding='utf8'))
    OUT.mkdir(parents=True, exist_ok=True)
    wanted = {entry['key']: entry['text'] for entry in entries}

    todo = [(key, text) for key, text in wanted.items() if args.opnieuw or not (OUT / f'{key}.mp3').exists()]
    print(f'{len(wanted)} teksten, {len(todo)} te maken', flush=True)
    failed: list[str] = []
    with concurrent.futures.ProcessPoolExecutor(max_workers=args.werkers) as pool:
        jobs = {pool.submit(synthesize, args.model, text, OUT / f'{key}.mp3'): text for key, text in todo}
        for done, job in enumerate(concurrent.futures.as_completed(jobs), 1):
            try:
                job.result()
            except Exception as error:  # noqa: BLE001
                failed.append(f'{jobs[job]}: {error}')
            if done % 200 == 0:
                print(f'  {done}/{len(todo)}', flush=True)

    for stale in OUT.glob('*.mp3'):
        if stale.stem not in wanted:
            stale.unlink()

    present = sorted(key for key in wanted if (OUT / f'{key}.mp3').exists())
    model_id = Path(args.model).name.removesuffix('.onnx')
    version = hashlib.sha1(f'{model_id}|{LENGTH_SCALE}|{PAD}'.encode()).hexdigest()[:8]
    INDEX.write_text(
        '// Gemaakt door scripts/stem/maak.py: niet met de hand aanpassen.\n'
        f'// De sleutels van alle teksten waarvoor public/stem/ een bestand heeft (zie clips.ts). Stem: {model_id}.\n'
        f"export const CLIP_VERSION = '{version}';\n"
        f"export const CLIP_KEYS =\n  '{' '.join(present)}';\n",
        encoding='utf8',
    )
    print(f'{len(present)} bestanden in public/stem, {len(failed)} mislukt')
    for line in failed[:20]:
        print('  mislukt:', line)
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
