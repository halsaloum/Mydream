# De pennig-stem

pennig leest voor met eigen Nederlandse geluidsbestanden in `public/stem/`, zodat elk dictee en
elk voorbeeld op elk apparaat Nederlands klinkt. Wat geen bestand heeft, leest de stem van het
apparaat voor (zie `src/lib/speech.ts` en `src/lib/voice/clips.ts`).

De bestanden komen van een Nederlandse [Piper](https://github.com/rhasspy/piper)-stem. Na nieuwe
of veranderde lessen maak je ze zo opnieuw (alleen wat nieuw is wordt ingesproken):

```sh
# 1. Lijst van alles wat pennig voorleest
UPDATE_STEM=1 npx vitest run src/lib/voice/spoken.test.ts

# 2. Inspreken (eenmalig: python3 -m pip install piper-tts; ffmpeg moet er zijn)
python3 scripts/stem/maak.py --model /pad/naar/nl_NL-stem.onnx
```

Het stembestand (`.onnx` met `.onnx.json` ernaast) komt van huggingface.co/rhasspy/piper-voices;
in dit project staat een kopie in de gedeelde projectmap onder `stem/`.

De test `src/lib/voice/spoken.test.ts` faalt als een dictee of reeks geen bestand heeft.
