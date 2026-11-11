// Speech: the rendered Dutch lines (voice/<id>.mp3, listed in voice/ids.json) fetched and played through the audio context,
// with speechSynthesis when a file is missing or fails; speak and speakSeq. Which file plays a line is voiceFileOf in voice.js.
import { voiceFileOf, VOICES } from './voice.js?v=42';
import { $ } from './engine.js?v=42';
import { persist, S, SAVE } from './state.js?v=42';
import { audioCtx, nlVoice } from './audio.js?v=42';

// ---------- voice: pre-rendered neural Dutch (voice/<id>.mp3), speechSynthesis when a file is missing or fails ----------
// id = voiceId(voice, text) from voice/hash.js, the same sha1 qa/voice-batch.mjs used. voice/ids.json lists the rendered ids.
// VOICES, VOICE_ALL and the file choice (voiceFileOf) are in src/voice.js
let voiceIds = null;   // Set of rendered ids; null until ids.json arrives (then only the asked voice is tried)
fetch('voice/ids.json').then(r => r.ok ? r.json() : null).then(a => { if (Array.isArray(a)) voiceIds = new Set(a); }).catch(() => {});
const voiceBuf = new Map();   // id -> Promise<AudioBuffer|null>, the last 80 lines
let voiceGen = 0, voiceSrc = null, voiceEl = null;
// the file for this text: the asked voice first, then any voice that has it (a listen line exists only as a passenger)
function voiceFile(text, voice) { return voiceFileOf(text, voice, voiceIds, window.voiceId); }
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
// force: a line the player asked for (the end card's speaker buttons) plays even with the voice off
function speak(text, whisper = false, voice = VOICES.rider, force = false) {
  if ((!S.voice && !force) || !text) return;
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
$('snd').onclick = () => { S.voice = !S.voice; $('snd').textContent = S.voice ? '🔊' : '🔇'; if (!S.voice) voiceStop(); SAVE.settings.voice = S.voice ? 1 : 0; persist(); };
if (!S.voice) $('snd').textContent = '🔇';   // the voice setting is kept in the save

export { speak, speakSeq, voiceTalking };
