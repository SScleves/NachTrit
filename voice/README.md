# voice: pre-rendered Dutch lines

Every Dutch line the game can speak, rendered once with Microsoft's neural Dutch voices through the Edge read-aloud
service (the open-source `edge-tts` Python package; free, no account). Files are `voice/<id>.mp3`, 24 kHz mono, 32 kbps,
re-encoded from the 48 kbps edge-tts output with ffmpeg because the first render came to 85 MB (59 MB now). The renderer re-encodes new files the same way when ffmpeg is installed.

## Files

- `lines.json`: `[{id, text, voice, kind}]`, one entry per voice and text. Written by `qa/voice-batch.mjs`.
- `<id>.mp3`: one per line. Written by `qa/voice-render.py`.
- `ids.json`: the ids that have a file. Written at the end of every render; the browser loads it so it never asks for a file that does not exist.
- `hash.js`: `window.voiceId(voice, text)` for the browser.
- `failed.json`: only present when the last render had lines that kept failing.

## The id

`id` is the first 12 hex characters of SHA-1 over the UTF-8 bytes of `voice + '|' + text`, where `text` is trimmed.
The voice is the full Edge name, for example `nl-NL-FennaNeural`.

Python:

```python
import hashlib
def voice_id(voice, text):
    return hashlib.sha1((voice + '|' + text.strip()).encode('utf-8')).hexdigest()[:12]
```

Node (what `qa/voice-batch.mjs` uses):

```js
crypto.createHash('sha1').update(voice + '|' + text, 'utf8').digest('hex').slice(0, 12)
```

Browser: `voice/hash.js` is a small synchronous SHA-1, because `crypto.subtle` is missing on plain http
(the game is often opened on a LAN or Meshnet address) and is async. `npm run voice:check` checks that it gives
the same id as `lines.json` for every line.

## Who speaks what

| voice | lines |
|---|---|
| Maarten (`nl-NL-MaartenNeural`) | the narrator: the 14 intro panels (and the older fallback panels in index.html), each level's `introNl`, the town rumour card, "Je bent te laat."; the rider: every word, look and de/het answer, every build sentence, and the right option at each fork before the last (whispered) |
| Fenna (`nl-NL-FennaNeural`) | the passengers: read items, listen items, every fare amount (`euroToWords` for 0,10 to 30,00 euro in 10 cent steps), the tip lines and the refusals |
| Colette (`nl-NL-ColetteNeural`) | the towns: `rumourNl`, `blurbNl`, `jokeNl`, the town vocabulary and any other Dutch field in content/towns.js. Not spoken by the game yet; there for a town screen |

The level missions are English only (`where`, `carry`, `want`), so there is nothing to render for them.
Wrong answers are not spoken: index.html only speaks the right option, so wrong fork options are not rendered.

## How the hook works

The drop-in code is in `Opus 5.5 DT/reports/dt-voice-files.md`. It replaces `speak`, `speakSeq` and the mute button
handler in index.html and keeps their signatures, so no call site has to change.

1. `voice/hash.js` loads as a classic script; the hook fetches `voice/ids.json` once.
2. For a line it hashes the asked voice and the text. If that id is not in `ids.json`, it tries the other two voices
   (a listen line exists only in Fenna's voice, the rider asks for Maarten first). No file: speechSynthesis, as before.
3. The file is fetched and decoded into an AudioBuffer on the game's `audioCtx` and played through a gain node.
   The last 80 buffers are kept. Whispered lines play at 0.6 volume and slightly lower; in a sequence the passenger's
   lines play a little lower, like the old pitch 0.75.
4. A fetch or decode failure falls back to speechSynthesis for that one line.
5. Every new `speak` or `speakSeq` stops what is playing. The mute button (`S.voice`) stops it too, and nothing plays while muted.
6. `voiceTalking()` replaces `speechSynthesis.speaking` in the intro, so a panel waits for the recorded line.

## Re-running after a content change

```sh
npm run voice          # lines.json, then render the missing files, then check
npm run voice:lines    # only rebuild lines.json
npm run voice:render   # only render missing files (add -- --limit 10 to try a few)
npm run voice:check    # lines without a file, files without a line, hash parity, ids.json up to date
```

The render step needs the venv at `../venv` (next to the repo checkout):

```sh
python3 -m venv --without-pip ../venv
python3 -m pip --python ../venv/bin/python install edge-tts
```

(`--without-pip` plus the system pip's `--python` option works where the python3-venv package is not installed.)
A changed text gets a new id, so its old file turns up under "files without a line"; delete those files and run
`npm run voice:render` again so `ids.json` is rewritten.
