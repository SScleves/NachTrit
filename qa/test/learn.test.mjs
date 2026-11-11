// The learner model (src/learn.js): item keys, box moves, what is due, the spaced review's pick and where it goes, the
// practice pick, the content index the word book reads, the rules list. Plus the acceptance in pure form: a miss on level 3
// is picked for review within the next two rides.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';
import { INTERVALS, itemKey, noteItem, noteRule, isDue, overdue, selectDue, reviewCap, duePositions, weakest, buildIndex, bookWords, ruleRows, kindOf, meaningOf, WORD_KINDS } from '../../src/learn.js';
import { entryText, levelQueue } from '../../src/forks.js';
import { ROOT, content_, lanesOf, withSeed } from './helpers.mjs';
import { TOWN_OF } from '../lib/load.mjs';

const ctx = { window: {}, TextEncoder }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'voice', 'hash.js'), 'utf8'), ctx, { filename: 'voice/hash.js' });
export const voiceId = ctx.window.voiceId;
const keyOf = nl => itemKey(nl, voiceId);
const index = () => { const c = content_(); return buildIndex(c.levels, c.towns, TOWN_OF, keyOf, entryText); };

test('itemKey: 36 bits of sha1("|" + text), base 36, trimmed and single-spaced', () => {
  const sha = crypto.createHash('sha1').update('|de hond', 'utf8').digest('hex');
  assert.equal(keyOf('de hond'), parseInt(sha.slice(0, 9), 16).toString(36));
  assert.equal(keyOf('  de   hond \n'), keyOf('de hond'));
  assert.notEqual(keyOf('de hond'), keyOf('De hond'), 'case is part of the Dutch text');
  assert.ok(/^[0-9a-z]{1,7}$/.test(keyOf('Ik heb het koud.')));
});
test('itemKey: no two Dutch texts of the content share a key', () => {
  const texts = new Set(); for (const lv of content_().levels) for (const it of lv.items) texts.add(entryText(it).trim().replace(/\s+/g, ' '));
  const keys = new Map(); for (const t of texts) { const k = keyOf(t); assert.ok(!keys.has(k) || keys.get(k) === t, `${t} and ${keys.get(k)}`); keys.set(k, t); }
  assert.ok(keys.size > 3000);
});
test('itemKey: an item keeps its key when other items change (the key is its own text, nothing else)', () => {
  const c = content_(), lv = c.levels[2], before = lv.items.map(entryText).map(keyOf);
  const edited = lv.items.map((it, i) => i === 0 ? Object.assign({}, it, { nl: (it.nl || '') + ' x', parts: it.parts }) : it);
  assert.deepEqual(edited.slice(1).map(entryText).map(keyOf), before.slice(1));
});
test('entryText is the nl the game rides (itemToEntry), for every kind', () => {
  const c = content_();
  for (const lv of c.levels.slice(0, 40)) {
    const q = withSeed(7, () => levelQueue(lv, lanesOf(lv)));
    for (const e of q) { const it = lv.items.find(i => entryText(i) === e.nl); assert.ok(it, `L${lv.id}: ${e.nl}`); }
  }
});

test('noteItem: right on the first try moves up a box (to 5 at most), wrong goes to box 1; seen, right, last ride', () => {
  const items = {};
  assert.deepEqual(noteItem(items, 'a', true, 1), [2, 1, 1, 1], 'a new item starts in box 1 and moves up');
  noteItem(items, 'a', true, 3); noteItem(items, 'a', true, 7); noteItem(items, 'a', true, 9);
  assert.deepEqual(items.a, [5, 4, 4, 9]);
  noteItem(items, 'a', true, 12); assert.equal(items.a[0], 5, 'box 5 is the top');
  noteItem(items, 'a', false, 13); assert.deepEqual(items.a, [1, 6, 5, 13]);
  assert.deepEqual(noteItem(items, 'b', false, 4), [1, 1, 0, 4]);
});
test('intervals in rides: 1, 2, 4, 8, 16', () => {
  assert.deepEqual(INTERVALS, [1, 2, 4, 8, 16]);
  for (let box = 1; box <= 5; box++) {
    const r = [box, 1, 1, 10];
    assert.equal(isDue(r, 10 + INTERVALS[box - 1] - 1), false, `box ${box} not yet`);
    assert.equal(isDue(r, 10 + INTERVALS[box - 1]), true, `box ${box} due`);
    assert.equal(overdue(r, 10 + INTERVALS[box - 1] + 3), 3);
  }
  assert.equal(isDue([1, 1, 0, 5], 5), false, 'never in the ride it was missed');
});
test('noteRule: seen and right per rule', () => {
  const rules = {}; noteRule(rules, 'v2', true); noteRule(rules, 'v2', false); noteRule(rules, 'dehet', true);
  assert.deepEqual(rules, { v2: [2, 1], dehet: [1, 1] });
});

test('selectDue: only due items, weakest box first, then lowest share right, then most overdue, then play order', () => {
  const items = { a: [3, 2, 2, 1], b: [1, 3, 2, 9], c: [1, 1, 0, 9], d: [2, 1, 1, 5], e: [1, 1, 0, 10], f: [5, 9, 9, 9] };
  // ride 10: a (box 3, 4 rides) due since 5; b, c box 1 due; d (box 2) due by 3; e missed this ride: not due; f not due
  assert.deepEqual(selectDue(items, 10, ['a', 'b', 'c', 'd', 'e', 'f'], 9), ['c', 'b', 'd', 'a']);
  assert.deepEqual(selectDue(items, 10, ['a', 'b', 'c', 'd', 'e', 'f'], 2), ['c', 'b']);
  assert.deepEqual(selectDue(items, 10, ['a', 'b', 'c', 'd'], 9, new Set(['c'])), ['b', 'd', 'a'], 'skip: already in this ride');
  assert.deepEqual(selectDue(items, 10, ['d', 'a'], 0), []);
  assert.deepEqual(selectDue(items, 10, ['x', 'y'], 5), [], 'never met: never due');
  assert.deepEqual(selectDue({ p: [1, 1, 0, 3], q: [1, 1, 0, 1] }, 4, ['p', 'q'], 1), ['q'], 'equal box and share: the most overdue');
  assert.deepEqual(selectDue({ p: [1, 1, 0, 3], q: [1, 1, 0, 3] }, 4, ['q', 'p'], 1), ['q'], 'all equal: play order');
});
test('selectDue gives the same pick every time (no randomness)', () => {
  const items = {}; for (let i = 0; i < 300; i++) items['k' + i] = [1 + (i % 5), 3, i % 3, i % 17];
  const cands = Object.keys(items), a = selectDue(items, 40, cands, 5), b = selectDue(items, 40, cands, 5);
  assert.deepEqual(a, b); assert.equal(a.length, 5);
});
test('reviewCap: a quarter of the deliveries, rounded down', () => {
  assert.equal(reviewCap(20), 5); assert.equal(reviewCap(10), 2); assert.equal(reviewCap(3), 0); assert.equal(reviewCap(24), 6);
});
test('duePositions: spread through the queue, never the first delivery, all distinct', () => {
  assert.deepEqual(duePositions(20, 5), [3, 6, 10, 13, 16]);
  assert.deepEqual(duePositions(10, 2), [3, 6]);
  assert.deepEqual(duePositions(10, 0), []);
  for (let n = 4; n <= 30; n++) { const p = duePositions(n, reviewCap(n)); assert.equal(p.length, reviewCap(n)); assert.ok(p.every(x => x > 0 && x < n)); assert.equal(new Set(p).size, p.length); }
});
test('weakest: lowest box, lowest share right, most recent, only keys that can ride', () => {
  const items = { a: [2, 2, 1, 4], b: [1, 2, 1, 3], c: [1, 3, 0, 2], d: [5, 5, 5, 9], gone: [1, 1, 0, 9] };
  assert.deepEqual(weakest(items, ['a', 'b', 'c', 'd', 'x'], 3), ['c', 'b', 'a']);
  assert.deepEqual(weakest(items, ['a', 'b', 'c', 'd'], 20), ['c', 'b', 'a', 'd']);
});

test('buildIndex: every Dutch text once, first occurrence in play order, keys sorted', () => {
  const c = content_(), ix = index();
  assert.equal(ix.levelOrder.size, c.levels.length);
  assert.equal(ix.levelOrder.get(1), 0); assert.equal(ix.levelOrder.get(2), 1); assert.equal(ix.levelOrder.get(41), 5, 'Alblasserdam: 1 to 5, then 41 to 45');
  assert.deepEqual(ix.keys, [...ix.keys].sort()); assert.equal(ix.keys.length, ix.rows.length);
  for (let i = 1; i < ix.rows.length; i++) assert.ok(ix.rows[i].order >= ix.rows[i - 1].order);
  const hond = ix.byKey.get(keyOf('de hond')); assert.equal(hond.level.id, 1); assert.equal(hond.town, 'alblasserdam'); assert.equal(hond.tier, 1);
});
test('bookWords: every word listed exists in the content with its article and its meaning; sentences are not words', () => {
  const c = content_(), ix = index(), items = {};
  for (const row of ix.rows) items[row.key] = [1 + (row.order % 5), 1, 1, 1];
  const words = bookWords(items, ix, entryText);
  const contentWords = new Map(); for (const lv of c.levels) for (const it of lv.items) if (WORD_KINDS.includes(kindOf(it))) { const t = entryText(it); if (!contentWords.has(t)) contentWords.set(t, []); contentWords.get(t).push(it); }
  assert.equal(words.length, contentWords.size, 'every word of the content, once');
  for (const w of words) {
    const its = contentWords.get(w.nl); assert.ok(its, w.nl);
    assert.ok(w.en && its.some(it => meaningOf(it) === w.en), `${w.nl}: ${w.en}`);
    const noun = its.find(it => it.dehet); if (noun) assert.ok(w.nl.startsWith(noun.art + ' '), `${w.nl} has its article`);
  }
  assert.ok(words.find(w => w.nl === 'de hond' && w.en === 'the dog' && w.town === 'alblasserdam'));
  const sentence = c.levels[30].items.find(it => it.parts); assert.ok(!words.some(w => w.nl === entryText(sentence)));
});
test('bookWords: counts only the words met, filters by town and strength', () => {
  const ix = index(), k = t => keyOf(t);
  const items = { [k('de hond')]: [1, 1, 0, 1], [k('het huis')]: [3, 2, 2, 2], [k('Ik heb het koud.')]: [1, 1, 0, 1] };
  assert.deepEqual(bookWords(items, ix, entryText).map(w => w.nl), ['de hond', 'het huis'], 'a reading is in the model, not in the book');
  assert.deepEqual(bookWords(items, ix, entryText, { box: 3 }).map(w => w.nl), ['het huis']);
  assert.deepEqual(bookWords(items, ix, entryText, { town: 'gouda' }), []);
  assert.equal(bookWords({ zzzzzz: [1, 1, 0, 1] }, ix, entryText).length, 0, 'a key no longer in the content is kept in the save but not listed');
});
test('ruleRows: the three weakest on top (seen 3 or more), the rest by how often they came up', () => {
  const rules = { v2: [10, 4], dehet: [8, 7], woord: [30, 29], perf: [3, 0], sep: [2, 0], aux: [5, 5], imp: [6, 3] };
  const { weakest: w, rest } = ruleRows(rules, { v2: { name: 'V2 word order' } });
  assert.deepEqual(w.map(r => r.id), ['perf', 'v2', 'imp']);
  assert.equal(w[1].name, 'V2 word order'); assert.equal(w[0].name, 'perf', 'no name: the id');
  assert.deepEqual(rest.map(r => r.id), ['woord', 'dehet', 'aux', 'sep']);
});

// the acceptance, without a browser: rides 1 to 5 of the first town, all right but on ride 3 (level 3) one wrong item; the
// pick of rides 4 and 5 (as src/flow.js makes it) brings it back
test('spaced review: a miss on level 3 is picked within the next two rides; a first ride picks nothing', () => {
  const c = content_(), ix = index(), items = {}, picked = [];
  const ride = (n, lv, missKey) => withSeed(n, () => {
    const q = levelQueue(lv, lanesOf(lv)), order = ix.levelOrder.get(lv.id), inRide = new Set(q.map(e => keyOf(e.nl)));
    const cands = ix.rows.filter(r => r.order < order).map(r => r.key);
    const due = selectDue(items, n, cands, reviewCap(lv.deliveries), inRide);
    picked.push(due);
    for (const k of due) noteItem(items, k, true, n);
    for (const k of inRide) noteItem(items, k, k !== missKey, n);
    return q;
  });
  const lv = id => c.levels.find(l => l.id === id);
  ride(1, lv(1)); assert.deepEqual(picked[0], [], 'the first ride: nothing is due');
  ride(2, lv(2));
  const q3 = withSeed(3, () => levelQueue(lv(3), lanesOf(lv(3)))), miss = keyOf(q3[4].nl);
  ride(3, lv(3), miss);
  ride(4, lv(4)); ride(5, lv(5));
  assert.ok(picked[3].includes(miss) || picked[4].includes(miss), `missed ${q3[4].nl}, picked ${JSON.stringify(picked.slice(3))}`);
  assert.ok(picked.every((p, i) => p.length <= reviewCap(lv(i + 1).deliveries)));
});
