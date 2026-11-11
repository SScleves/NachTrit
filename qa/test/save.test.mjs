// The save (src/save.js): migration from the keys the live site (NR_VERSION 42 and before) leaves, the mirror of the old
// keys, junk, the file and the paste code round trips, and the size for a player who has finished all 105 levels.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { SAVE_KEY, OLD, emptySave, normalize, fromOld, loadSave, writeSave, savedBytes, toFile, fromFile, encodeCode, decodeCode, contentPrint } from '../../src/save.js';
import { itemKey, buildIndex, noteItem, noteRule, selectDue, reviewCap } from '../../src/learn.js';
import { entryText, levelQueue } from '../../src/forks.js';
import { ROOT, content_, lanesOf, withSeed, forksOfEntry } from './helpers.mjs';
import { TOWN_OF } from '../lib/load.mjs';

const ctx = { window: {}, TextEncoder }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'voice', 'hash.js'), 'utf8'), ctx, { filename: 'voice/hash.js' });
const keyOf = nl => itemKey(nl, ctx.window.voiceId);
let ix = null; const index = () => ix || (ix = buildIndex(content_().levels, content_().towns, TOWN_OF, keyOf, entryText));

// localStorage as a Map
class Store { constructor(o = {}) { this.m = new Map(Object.entries(o)); } getItem(k) { return this.m.has(k) ? this.m.get(k) : null; } setItem(k, v) { this.m.set(k, String(v)); } removeItem(k) { this.m.delete(k); } }
// what the live site leaves after a few evenings: the exact strings its code writes
const LIVE = {
  'nachtrit.progress': JSON.stringify({ 1: 3, 2: 2, 3: 3, 4: 1, 5: 3, 41: 2, 1001: 1 }),
  'nachtrit.scores': JSON.stringify({ 1: 2435, 2: 2210, 3: 2604, 4: 1803, 5: 2980, 41: 2140, 1001: 1622, endless: 812 }),
  'nachtrit.intro': 'short', 'nachtrit.taught': '1', 'nachtrit.go': '1', 'nachtrit.lamphint': '1', 'nachtrit.unlock': '1', 'nachtrit.lost': '2',
};

test('migration: the live site\'s keys load without loss', () => {
  const st = new Store(LIVE), { save, migrated } = loadSave(st);
  assert.equal(migrated, true);
  assert.deepEqual(save.stars, { 1: 3, 2: 2, 3: 3, 4: 1, 5: 3, 41: 2, 1001: 1 });
  assert.deepEqual(save.scores, { 1: 2435, 2: 2210, 3: 2604, 4: 1803, 5: 2980, 41: 2140, 1001: 1622, endless: 812 });
  assert.deepEqual(save.flags, { intro: 1, taught: 1, go: 1, lamphint: 1, unlock: 1, lost: 2 });
  assert.equal(save.v, 1); assert.equal(save.ride, 0); assert.deepEqual(save.items, {});
  assert.ok(Object.values(save.stars).every(v => typeof v === 'number'));
});
test('migration: after the first write the save exists, the old keys stay readable and say the same', () => {
  const st = new Store(LIVE), { save } = loadSave(st);
  save.stars[6] = 2; save.scores[6] = 1999; save.ride = 1;
  assert.ok(writeSave(st, save));
  assert.ok(st.getItem(SAVE_KEY));
  assert.deepEqual(JSON.parse(st.getItem(OLD.progress)), save.stars, 'an older page reads its stars from nachtrit.progress');
  assert.deepEqual(JSON.parse(st.getItem(OLD.scores)), save.scores);
  for (const k of ['intro', 'taught', 'go', 'lamphint', 'unlock', 'lost']) assert.equal(st.getItem(OLD[k]), LIVE[OLD[k]], k);
  const again = loadSave(st);
  assert.equal(again.migrated, false); assert.deepEqual(again.save, save, 'loading twice changes nothing');
});
test('migration: stars and scores earned on an older page after the save existed are merged in (higher wins)', () => {
  const st = new Store(LIVE); const { save } = loadSave(st); writeSave(st, save);
  const p = JSON.parse(st.getItem(OLD.progress)); p[4] = 3; p[7] = 1; st.setItem(OLD.progress, JSON.stringify(p));   // the old page wrote here
  const s = JSON.parse(st.getItem(OLD.scores)); s[4] = 100; st.setItem(OLD.scores, JSON.stringify(s));
  const { save: m } = loadSave(st);
  assert.equal(m.stars[4], 3); assert.equal(m.stars[7], 1); assert.equal(m.scores[4], 1803, 'a lower old score does not win');
});
test('migration: intro full, the qa tools\' "1", and nothing at all', () => {
  assert.equal(fromOld(k => k === OLD.intro ? 'full' : null).flags.intro, 2);
  assert.equal(fromOld(k => k === OLD.intro ? '1' : null).flags.intro, 1);
  const { save, migrated } = loadSave(new Store());
  assert.equal(migrated, false); assert.deepEqual(save, emptySave());
});
test('unlock off: writing flag 0 removes the old key, so the next load does not bring it back', () => {
  const st = new Store(LIVE), { save } = loadSave(st); save.flags.unlock = 0; writeSave(st, save);
  assert.equal(st.getItem(OLD.unlock), null); assert.equal(loadSave(st).save.flags.unlock, 0);
});
test('junk: broken JSON, non-numbers, a storage that throws', () => {
  const st = new Store({ [SAVE_KEY]: '{not json', 'nachtrit.progress': '{"1":3,"2":"x","3":null,"4":7}', 'nachtrit.scores': '[1,2]' });
  const { save } = loadSave(st);
  assert.deepEqual(save.stars, { 1: 3 }); assert.deepEqual(save.scores, {});
  const bad = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() {} };
  assert.deepEqual(loadSave(bad).save, emptySave()); assert.equal(writeSave(bad, emptySave()), false); assert.equal(writeSave(null, emptySave()), false);
  const n = normalize({ v: 1, items: { ok1: [9, 3, 7, 2], 'BAD KEY': [1, 1, 1, 1], short: [1, 2], neg: [1, -1, 0, 0] }, rules: { v2: [3, 5], 'x y': [1, 1] }, future: { keep: 1 } });
  assert.deepEqual(n.items, { ok1: [5, 3, 3, 2] }, 'box at most 5, right at most seen');
  assert.deepEqual(n.rules, { v2: [3, 3] }); assert.deepEqual(n.future, { keep: 1 }, 'a newer version\'s fields are kept');
});

// a player who has finished all 105 levels: every level in play order twice (a first ride and a replay for stars), 15 % of
// first tries wrong, the spaced review each ride as the game picks it; 3 stars and a best score everywhere
function veteran() {
  const c = content_(), ixx = index(), s = emptySave();
  let rnd = 99; const r01 = () => { rnd = (rnd * 1103515245 + 12345) % 2147483648; return rnd / 2147483648; };
  for (const pass of [0, 1]) for (const lv of c.levels) {
    s.ride++;
    const q = withSeed(s.ride, () => levelQueue(lv, lanesOf(lv))), order = ixx.levelOrder.get(lv.id), inRide = new Set(q.map(e => keyOf(e.nl)));
    const due = selectDue(s.items, s.ride, ixx.rows.filter(x => x.order < order).map(x => x.key), reviewCap(lv.deliveries), inRide);
    for (const k of due) noteItem(s.items, k, r01() > 0.15, s.ride);
    for (const e of q) { const ok = r01() > 0.15; noteItem(s.items, keyOf(e.nl), ok, s.ride); for (const f of forksOfEntry(e)) noteRule(s.rules, f.r, ok); }
    s.stars[lv.id] = 3; s.scores[lv.id] = 2000 + Math.floor(r01() * 1500) * 1 + pass;
  }
  for (let t = 1; t <= 13; t++) { s.stars[1000 + t] = 2; s.scores[1000 + t] = 1500 + t; }
  s.scores.endless = 1234; s.flags = { intro: 1, taught: 1, go: 1, lamphint: 1 }; s.settings = { voice: 1 };
  return normalize(s);
}

test('file round trip restores everything', () => {
  const s = veteran(), back = fromFile(toFile(s));
  assert.deepEqual(back, s);
  assert.deepEqual(fromFile(JSON.stringify(s)), s, 'the bare save object loads too');
  assert.throws(() => fromFile('hello'), /not a Nachtrit save/); assert.throws(() => fromFile('{"game":"other"}'), /not a Nachtrit save/);
});
test('paste code round trip restores everything: stars, scores, flags, settings, ride, words, boxes, rules', async () => {
  const s = veteran(), keys = index().keys, code = await encodeCode(s, keys);
  assert.match(code, /^NR1z\.[A-Za-z0-9_-]+$/);
  assert.deepEqual(await decodeCode(code, keys), s);
  assert.deepEqual(await decodeCode(code.replace(/(.{60})/g, '$1\n  '), keys), s, 'line breaks and spaces from a chat app are ignored');
  const empty = emptySave(); assert.deepEqual(await decodeCode(await encodeCode(empty, keys), keys), empty);
});
test('paste code: odd numbers, keys no longer in the content, and the raw form without deflate', async () => {
  const keys = index().keys, s = emptySave();
  s.scores = { 1: 2435.5, endless: 0 }; s.stars = { 1: 3 }; s.ride = 300; s.settings = { voice: 0 };
  s.items = { [keys[0]]: [3, 4, 3, 290], [keys[keys.length - 1]]: [1, 1, 0, 300], gone12: [5, 9, 9, 120] }; s.rules = { v2: [10, 6], 'old-rule': [1, 0] };
  const n = normalize(s);
  assert.deepEqual(await decodeCode(await encodeCode(n, keys), keys), n);
  const CS = globalThis.CompressionStream; globalThis.CompressionStream = undefined;
  try { const raw = await encodeCode(n, keys); assert.match(raw, /^NR1r\./); assert.deepEqual(await decodeCode(raw, keys), n); }
  finally { globalThis.CompressionStream = CS; }
});
test('paste code: a cut code, another game\'s text, and a code from other content are refused in plain words', async () => {
  const s = veteran(), keys = index().keys, code = await encodeCode(s, keys);
  await assert.rejects(decodeCode(code.slice(0, code.length - 40), keys), /incomplete or damaged/);
  await assert.rejects(decodeCode('hello', keys), /not a Nachtrit code/);
  const other = keys.slice(1);
  await assert.rejects(decodeCode(code, other), /another version of the game/);
  assert.notEqual(contentPrint(keys), contentPrint(other));
  const noWords = emptySave(); noWords.stars = { 1: 2 };
  assert.deepEqual((await decodeCode(await encodeCode(noWords, keys), other)).stars, { 1: 2 }, 'a code with no words loads on any content');
});
test('size: a player who has finished all 105 levels', async t => {
  const s = veteran(), keys = index().keys, n = Object.keys(s.items).length;
  const bytes = savedBytes(s), file = toFile(s).length, code = (await encodeCode(s, keys)).length;
  t.diagnostic(`veteran (105 levels twice): ${n} items, ${Object.keys(s.rules).length} rules, nachtrit.save ${bytes} bytes (${(bytes / n).toFixed(1)} a item), file ${file} bytes, paste code ${code} characters`);
  const all = emptySave(); for (const k of keys) all.items[k] = [5, 40, 38, 900]; Object.assign(all.stars, s.stars); Object.assign(all.scores, s.scores);
  const allBytes = savedBytes(all), allCode = (await encodeCode(all, keys)).length;
  t.diagnostic(`every one of the ${keys.length} items met, large counters: nachtrit.save ${allBytes} bytes, paste code ${allCode} characters`);
  assert.ok(Object.values(s.items).every(r => r.length === 4 && r.every(Number.isInteger)), 'numbers only, one short array per item');
  assert.ok(bytes < 80000, `save ${bytes}`); assert.ok(allBytes < 110000, `all ${allBytes}`); assert.ok(code < 16000, `code ${code}`);
});
