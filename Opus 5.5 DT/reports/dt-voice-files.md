# dt-voice-files: every Dutch line pre-rendered with Microsoft neural voices

Branch `dt/voice-files` in the worktree `/home/santi/dutch-arcade-wt/voice`, two commits, not pushed or merged.
index.html, levels.js and content/ are untouched; the hook below is for whoever owns index.html.

## What was made

- `/home/santi/dutch-arcade-wt/voice/qa/voice-batch.mjs`: loads data.js, levels.js, content (source folders for the bundles, like validate-content), fares.js and the intro panels in a vm and writes `voice/lines.json`.
- `/home/santi/dutch-arcade-wt/voice/qa/voice-render.py`: renders missing lines with edge-tts, 4 at a time, 4 tries each with back-off, `--limit N` for tests, re-encodes to 32 kbps mono with ffmpeg, writes `voice/ids.json` and `voice/failed.json` (only when something failed).
- `/home/santi/dutch-arcade-wt/voice/qa/voice-check.mjs`: lines without a file, files without a line, browser hash parity, ids.json up to date. Currently all zero.
- `/home/santi/dutch-arcade-wt/voice/voice/hash.js`: synchronous SHA-1 for the browser (`window.voiceId`), because `crypto.subtle` is missing on plain http LAN and Meshnet addresses.
- `/home/santi/dutch-arcade-wt/voice/voice/README.md`: id scheme (Python, Node, browser), voice rules, how to re-run.
- package.json: `npm run voice` (lines, render, check), plus `voice:lines`, `voice:render`, `voice:check`.
- venv at `/home/santi/dutch-arcade-wt/venv` (outside the repo). python3-venv is not installed on this machine, so it was made with `python3 -m venv --without-pip` and `python3 -m pip --python venv/bin/python install edge-tts`. Nothing went into the system Python.

## Counts and sizes

- 4,940 lines, 142,296 characters (more than the 3,950 estimate: the fare amounts, the whispered fork options and the endless-mode SENTENCES add up).
- By kind: build sentence 1,792, word 990, read 634, fork option 452, listen 348, fare amount 287, town 161, de/het 109, level intro 105, intro panel 19, town rumour card 13, look 17, refusal 9, tip 3, fixed 1 ("Je bent te laat.").
- By voice: Maarten 3,498, Fenna 1,281, Colette 161.
- Render: 55 minutes at concurrency 4. Raw edge-tts output (24 kHz mono 48 kbps) came to 85.3 MB, above the 80 MB line, so every file was re-encoded with ffmpeg to 32 kbps mono 24 kHz: 59.0 MB now, about 4 hours of speech. The renderer does the same for new files.
- Failed: 2 lines on the first pass ("de souvenirwinkel" and "het kopstootje", Maarten, NoAudioReceived after 4 tries). Both rendered on a re-run. Nothing is missing now.
- Test lines before the batch: 3 per voice, each 2.0 to 2.8 s, 12 to 17 KB, 24 kHz mono. Nobody has listened to any file.

## Voices

| voice | what |
|---|---|
| Maarten | narrator: intro panels (the 14 NRART panels and the 5 fallback PANELS lines that differ), level `introNl`, the town rumour card as showLevelIntro builds it, "Je bent te laat."; rider: word, look and de/het answers, build sentences, the right option at each fork before the last one (the whisper) |
| Fenna | passengers: read items, listen items, `euroToWords` for 0,10 to 30,00 euro in 10 cent steps, the 3 tips, the 9 refusals |
| Colette | towns: `rumourNl`, `blurbNl`, `jokeNl`, vocabulary and every other `nl` or `...Nl` field in the TOWNS data. The game does not speak these yet |

Notes from reading index.html:
- Missions have no Dutch (`where`, `carry`, `want` are English), so nothing was rendered for them.
- Wrong answers are never spoken. On a wrong fork the toast shows the right option but neither `speak` nor `speakSeq` is called, so wrong options are not rendered. On a right fork that is not the last, `speak(fork.o[fork.a], true)` whispers the option; on the last, `speakSeq(settleRide().voice)` says the sentence, then the amount and the tip or a refusal.
- `say()` is the toast, not speech.

## The current code (index.html lines 2762 to 2786)

```js
function speak(text, whisper = false) {
  if (!S.voice || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'nl-NL'; if (nlVoice) u.voice = nlVoice;
    u.rate = whisper ? 0.85 : 0.9; u.pitch = whisper ? 0.7 : 0.9; u.volume = whisper ? 0.6 : 1;
    speechSynthesis.speak(u);
  } catch (e) {}
}
// one cancel, then the sentence and the passenger's lines queued back to back; the dead speak the amount lower
function speakSeq(list) {
  if (!S.voice || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    list.forEach((text, i) => {
      if (!text) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'nl-NL'; if (nlVoice) u.voice = nlVoice;
      u.rate = 0.9; u.pitch = i ? 0.75 : 0.9; u.volume = 1;
      speechSynthesis.speak(u);
    });
  } catch (e) {}
}
$('snd').onclick = () => { S.voice = !S.voice; $('snd').textContent = S.voice ? '🔊' : '🔇'; };
```

## The hook

Three edits to index.html:

1. Add `<script src="voice/hash.js"></script>` with the other classic scripts, before `<script type="module">` (for example after `fares.js`).
2. Replace lines 2762 to 2786 above (from `function speak` through the `$('snd').onclick` line) with the block below. `nlVoice` and `pickVoice` above it stay.
3. In the intro loop (line 2974) replace
   `const talking = S.voice && 'speechSynthesis' in window && speechSynthesis.speaking;`
   with
   `const talking = S.voice && voiceTalking();`
   so a panel waits for the recorded line.

No call site has to change: when the asked voice has no file for a text, the hook takes whichever voice has one (a listen or read line exists only in Fenna's voice). Optional, for exactness: pass `[VOICES.passenger]` as the second argument of the read-item `speakSeq` at line 3383, in case a read text is also a word answer in Maarten's voice. To cut the first-play delay, call `voicePrefetch(entry.nl)` when a card is shown.

```js
// ---------- voice: pre-rendered neural Dutch (voice/<id>.mp3), speechSynthesis when a file is missing or fails ----------
// id = voiceId(voice, text) from voice/hash.js, the same sha1 qa/voice-batch.mjs used. voice/ids.json lists the rendered ids.
const VOICES = { rider: 'nl-NL-MaartenNeural', narrator: 'nl-NL-MaartenNeural', passenger: 'nl-NL-FennaNeural', town: 'nl-NL-ColetteNeural' };
const VOICE_ALL = ['nl-NL-MaartenNeural', 'nl-NL-FennaNeural', 'nl-NL-ColetteNeural'];
let voiceIds = null;   // Set of rendered ids; null until ids.json arrives (then only the asked voice is tried)
fetch('voice/ids.json').then(r => r.ok ? r.json() : null).then(a => { if (Array.isArray(a)) voiceIds = new Set(a); }).catch(() => {});
const voiceBuf = new Map();   // id -> Promise<AudioBuffer|null>, the last 80 lines
let voiceGen = 0, voiceSrc = null, voiceEl = null;
// the file for this text: the asked voice first, then any voice that has it (a listen line exists only as a passenger)
function voiceFile(text, voice) {
  if (!window.voiceId || !text) return null;
  for (const v of [voice, ...VOICE_ALL.filter(x => x !== voice)]) {
    const id = window.voiceId(v, text);
    if (voiceIds ? voiceIds.has(id) : v === voice) return id;
  }
  return null;
}
function voiceLoad(id) {
  if (voiceBuf.has(id)) { const p = voiceBuf.get(id); voiceBuf.delete(id); voiceBuf.set(id, p); return p; }
  const p = fetch(`voice/${id}.mp3`).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
    .then(b => new Promise((ok, no) => audioCtx.decodeAudioData(b, ok, no))).catch(() => null);
  voiceBuf.set(id, p); if (voiceBuf.size > 80) voiceBuf.delete(voiceBuf.keys().next().value);
  return p;
}
function voicePrefetch(text, voice = VOICES.rider) { const id = audioCtx && voiceFile(text, voice); if (id) voiceLoad(id); }
function voiceStop() {
  voiceGen++;
  if (voiceSrc) { try { voiceSrc.stop(); } catch (e) {} voiceSrc = null; }
  if (voiceEl) { voiceEl.pause(); voiceEl = null; }
  if ('speechSynthesis' in window) try { speechSynthesis.cancel(); } catch (e) {}
}
const voiceTalking = () => !!(voiceSrc || voiceEl) || ('speechSynthesis' in window && speechSynthesis.speaking);
// the old speechSynthesis path, one line; resolves when it ends
function ttsSay(text, rate, pitch, volume) {
  return new Promise(done => {
    if (!('speechSynthesis' in window)) return done();
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'nl-NL'; if (nlVoice) u.voice = nlVoice;
      u.rate = rate; u.pitch = pitch; u.volume = volume; u.onend = u.onerror = () => done();
      speechSynthesis.speak(u);
    } catch (e) { done(); }
  });
}
// one line: the file through WebAudio (or an <audio> element before audioCtx exists), else speechSynthesis
async function voiceSay(text, voice, o, gen) {
  const id = voiceFile(text, voice);
  if (id && audioCtx) {
    const buf = await voiceLoad(id);
    if (gen !== voiceGen) return;
    if (buf) return new Promise(done => {
      const src = audioCtx.createBufferSource(), g = audioCtx.createGain();
      src.buffer = buf; src.detune.value = o.detune; g.gain.value = o.volume;
      src.connect(g).connect(audioCtx.destination); src.onended = () => { if (voiceSrc === src) voiceSrc = null; done(); };
      voiceSrc = src; src.start();
    });
  } else if (id) {
    const ok = await new Promise(done => {
      const el = new Audio(`voice/${id}.mp3`); el.volume = o.volume; el.playbackRate = o.detune ? 0.92 : 1; voiceEl = el;
      el.onended = () => { if (voiceEl === el) voiceEl = null; done(true); };
      el.onerror = () => { if (voiceEl === el) voiceEl = null; done(false); };
      el.play().catch(() => { if (voiceEl === el) voiceEl = null; done(false); });
    });
    if (ok || gen !== voiceGen) return;
  }
  if (gen === voiceGen) return ttsSay(text, o.rate, o.pitch, o.volume);
}
function speak(text, whisper = false, voice = VOICES.rider) {
  if (!S.voice || !text) return;
  voiceStop(); const gen = voiceGen;
  voiceSay(text, voice, whisper ? { volume: 0.6, detune: -150, rate: 0.85, pitch: 0.7 } : { volume: 1, detune: 0, rate: 0.9, pitch: 0.9 }, gen);
}
// one cancel, then the sentence and the passenger's lines back to back; the dead speak the amount lower
async function speakSeq(list, voices = []) {
  if (!S.voice) return;
  voiceStop(); const gen = voiceGen;
  for (let i = 0; i < list.length; i++) {
    if (!list[i]) continue; if (gen !== voiceGen) return;
    await voiceSay(list[i], voices[i] || (i ? VOICES.passenger : VOICES.rider), { volume: 1, detune: i ? -200 : 0, rate: 0.9, pitch: i ? 0.75 : 0.9 }, gen);
  }
}
$('snd').onclick = () => { S.voice = !S.voice; $('snd').textContent = S.voice ? '🔊' : '🔇'; if (!S.voice) voiceStop(); };
```

Behaviour: files go through the game's `audioCtx` (unlocked on the start click), decoded buffers are cached (last 80); before `audioCtx` exists an `<audio>` element is used. A missing id, a failed fetch or a failed decode falls back to the old speechSynthesis line. A new `speak` or `speakSeq` stops what is playing; muting stops it and nothing plays while `S.voice` is false. The hook is syntax-checked but has not been run in a browser.

## Re-running after content changes

`npm run voice` from the repo root (needs `../venv`, see voice/README.md). Only new or changed lines are rendered. A changed text gets a new id; the old file shows up under "files without a line" in `npm run voice:check`; delete it and run `npm run voice:render` again so ids.json is rewritten.
