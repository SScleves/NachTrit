// Voice hash lookup: voice/hash.js (the browser's sha1, loaded as the browser does) and the file choice with its fallback
// across voices (src/voice.js voiceFileOf, which index.html's voiceFile calls).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';
import { VOICES, VOICE_ALL, voiceFileOf } from '../../src/voice.js';
import { ROOT } from './helpers.mjs';

const ctx = { window: {}, TextEncoder }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'voice', 'hash.js'), 'utf8'), ctx, { filename: 'voice/hash.js' });
const voiceId = ctx.window.voiceId;
const sha = (v, t) => crypto.createHash('sha1').update(v + '|' + t.trim(), 'utf8').digest('hex').slice(0, 12);

test('voiceId is the first 12 hex of sha1(voice|text) over UTF-8, at every block boundary', () => {
  const texts = ['', 'de hond', 'één', 'Ik heb €2,50 betaald.', 'ë ï ü ö é è', 'Wat zeg je?'];
  for (let n = 40; n <= 140; n++) texts.push('a'.repeat(n), 'é'.repeat(n >> 1));
  for (const v of VOICE_ALL) for (const t of texts) assert.equal(voiceId(v, t), sha(v, t), `${v} | ${t.length} chars`);
});
test('voiceId trims the text', () => { assert.equal(voiceId(VOICES.rider, '  de hond \n'), voiceId(VOICES.rider, 'de hond')); });
test('every rendered line in voice/lines.json has the id the browser computes', () => {
  const lines = JSON.parse(fs.readFileSync(path.join(ROOT, 'voice', 'lines.json'), 'utf8'));
  assert.ok(lines.length > 1000);
  const bad = lines.filter(l => voiceId(l.voice, l.text) !== l.id);
  assert.deepEqual(bad.slice(0, 5), []);
});
test('the voices: every role speaks with one of the three rendered voices', () => {
  for (const v of Object.values(VOICES)) assert.ok(VOICE_ALL.includes(v), v);
});
test('voiceFileOf: before ids.json arrives only the asked voice is tried', () => {
  assert.equal(voiceFileOf('de hond', VOICES.passenger, null, voiceId), voiceId(VOICES.passenger, 'de hond'));
});
test('voiceFileOf: the asked voice first, then the others in VOICE_ALL order', () => {
  const t = 'de brug', id = v => voiceId(v, t);
  assert.equal(voiceFileOf(t, VOICES.rider, new Set([id(VOICES.rider), id(VOICES.passenger)]), voiceId), id(VOICES.rider));
  assert.equal(voiceFileOf(t, VOICES.rider, new Set([id(VOICES.passenger)]), voiceId), id(VOICES.passenger), 'a listen line exists only as a passenger');
  assert.equal(voiceFileOf(t, VOICES.town, new Set([id(VOICES.rider), id(VOICES.passenger)]), voiceId), id(VOICES.rider), 'Maarten comes first in VOICE_ALL');
  assert.equal(voiceFileOf(t, VOICES.rider, new Set(['000000000000']), voiceId), null, 'not rendered: speech synthesis takes over');
});
test('voiceFileOf: no text or no hash gives null', () => {
  assert.equal(voiceFileOf('', VOICES.rider, null, voiceId), null);
  assert.equal(voiceFileOf('de hond', VOICES.rider, null, undefined), null);
});
test('the rendered ids: ids.json lists only files that exist', () => {
  const ids = JSON.parse(fs.readFileSync(path.join(ROOT, 'voice', 'ids.json'), 'utf8'));
  const missing = ids.filter(id => !fs.existsSync(path.join(ROOT, 'voice', id + '.mp3')));
  assert.deepEqual(missing.slice(0, 5), []);
});
