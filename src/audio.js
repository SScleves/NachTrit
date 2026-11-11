// Sound: the audio context (made on the first key or tap), the synthesised thump, tick, chime and bark, and the Dutch voice
// speechSynthesis falls back to.
import { clamp } from './engine.js?v=38';
import './hud.js?v=38';   // keeps the order the game's code runs in

// ---------- audio ----------
let audioCtx = null;
function initAudio() {
  if (audioCtx) return;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; }
}
function thump(vol = 0.5) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.18);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
  o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + 0.3);
}
function tick() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(2200, t);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.03, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
  o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + 0.03);
}
function chime(good) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = good ? 'triangle' : 'sawtooth';
  o.frequency.setValueAtTime(good ? 660 : 160, t); if (good) o.frequency.setValueAtTime(880, t + 0.1); else o.frequency.exponentialRampToValueAtTime(70, t + 0.4);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(good ? 0.12 : 0.2, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + (good ? 0.35 : 0.5));
  o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + 0.6);
}
// a soft dog bark from the side of the right sign (the teaching forks): a falling buzz through a band, twice
function bark(pan = 0) {
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime, P = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null, out = audioCtx.createGain();
  out.gain.value = 0.5; if (P) { P.pan.value = clamp(pan, -1, 1); out.connect(P).connect(audioCtx.destination); } else out.connect(audioCtx.destination);
  for (const [dt, f0] of [[0, 520], [0.24, 470]]) {
    const t = t0 + dt, o = audioCtx.createOscillator(), bp = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 0.42, t + 0.13);
    bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 1.4;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(bp).connect(g).connect(out); o.start(t); o.stop(t + 0.2);
  }
}
let nlVoice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  nlVoice = vs.find(v => /^nl[-_]NL/i.test(v.lang)) || vs.find(v => /^nl/i.test(v.lang)) || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

export { audioCtx, bark, chime, initAudio, nlVoice, thump, tick };
