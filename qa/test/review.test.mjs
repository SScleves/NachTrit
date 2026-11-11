// Missed items come back in the same ride, and the end card groups the misses by rule (src/review.js, PLAN.md 3a and 3d.4).
import test from 'node:test';
import assert from 'node:assert/strict';
import { AGAIN, shouldReturn, returnSlot, onReviewRoad, markRight, groupMisses, weakLine } from '../../src/review.js';
import { TASKS } from '../../src/tasks.js';

// other forks between the miss and its return, if it goes in at index i
const gapAt = (ahead, qf, i) => ahead + qf.slice(0, i).reduce((a, b) => a + b, 0);

test('the numbers PLAN.md 3a names: six returns a ride, back after 3 to 5 forks, a second miss in the last quarter, twice at most', () => {
  assert.deepEqual({ ...AGAIN }, { cap: 6, gapMin: 3, gapMax: 5, late: 0.75, times: 2 });
});
test('a first and a second miss come back, a third does not; never more than six returns in a ride', () => {
  assert.equal(shouldReturn(1, 0), true); assert.equal(shouldReturn(2, 3), true);
  assert.equal(shouldReturn(3, 0), false, 'missed on its second return: no third');
  assert.equal(shouldReturn(0, 0), false);
  assert.equal(shouldReturn(1, 5), true); assert.equal(shouldReturn(1, 6), false, 'the cap'); assert.equal(shouldReturn(2, 6), false);
});
test('a first miss comes back after 3 to 5 other forks when the queue is one-fork entries', () => {
  for (let ahead = 0; ahead <= 3; ahead++) {
    const qf = Array(12).fill(1), i = returnSlot(ahead, qf, 4, 1), g = gapAt(ahead, qf, i);
    assert.ok(g >= AGAIN.gapMin && g <= AGAIN.gapMax, `ahead ${ahead}: ${g} forks between`);
    assert.equal(g, 3, 'as early as allowed');
  }
});
test('two- and three-fork sentences in the queue: at least 3 forks between, at most 5 when the sentences allow it', () => {
  for (const qf of [[2, 2, 2, 2], [3, 3, 3], [1, 3, 1, 1], [2, 1, 2, 1]]) for (let ahead = 0; ahead <= 2; ahead++) {
    const i = returnSlot(ahead, qf, 3, 1), g = gapAt(ahead, qf, i);
    assert.ok(g >= 3, `${qf} ahead ${ahead}: ${g}`); assert.ok(g <= 5, `${qf} ahead ${ahead}: ${g}`);
  }
});
test('when the road ahead already holds 3 or more forks, the return goes in first in the queue', () => {
  assert.equal(returnSlot(3, [1, 1, 1], 5, 1), 0); assert.equal(returnSlot(6, [2, 2], 5, 1), 0);
});
test('near the end of the queue it goes at the end: the ride grows by it', () => {
  assert.equal(returnSlot(1, [1], 19, 1), 1); assert.equal(returnSlot(0, [], 20, 1), 0); assert.equal(returnSlot(2, [], 20, 2), 0);
});
test('a second miss waits for the last quarter of the ride', () => {
  // 20 entries, the 6th was planned when the return missed: the ride is now 21 long, 3/4 of it is entry 16 (index 10 in the queue)
  const qf = Array(14).fill(1), i = returnSlot(0, qf, 6, 2);
  assert.equal(6 + i, Math.ceil(0.75 * 21)); assert.ok(gapAt(0, qf, i) >= 3);
  // already in the last quarter: the 3-fork rule still holds
  const late = Array(3).fill(1); assert.equal(returnSlot(0, late, 17, 2), 3);
  // a first miss early in the ride is not pushed late
  assert.equal(returnSlot(0, qf, 6, 1), 3);
});
test('review road: [from, to) spans in metres', () => {
  const spans = [[100, 180], [400, 470]];
  assert.equal(onReviewRoad(spans, 99.9), false); assert.equal(onReviewRoad(spans, 100), true); assert.equal(onReviewRoad(spans, 179.9), true);
  assert.equal(onReviewRoad(spans, 180), false); assert.equal(onReviewRoad(spans, 450), true); assert.equal(onReviewRoad([], 450), false);
});
test('markRight finds the right form as a whole word or phrase, any case', () => {
  assert.deepEqual(markRight('Na de standup bel ik je terug.', 'bel ik je terug'), ['Na de standup ', 'bel ik je terug', '.']);
  assert.deepEqual(markRight('Het huis is groot.', 'het'), ['', 'Het', ' huis is groot.']);
  assert.deepEqual(markRight('Ik werkte gisteren.', 'werk'), ['Ik werkte gisteren.', '', ''], 'not inside a longer word');
  assert.deepEqual(markRight('Ik heb het koud.', "I'm cold."), ['Ik heb het koud.', '', ''], 'a reading: not in the sentence');
  assert.deepEqual(markRight('Zij zegt: wat? Ja.', 'wat?'), ['Zij zegt: ', 'wat?', ' Ja.'], 'punctuation in the form');
  assert.deepEqual(markRight('', ''), ['', '', '']);
});
const miss = (task, nl, extra = {}) => ({ task, nl, right: 'x', said: 'y', why: '', again: '', first: true, ...extra });
test('misses group by task label, the most missed rule first, items in the order missed', () => {
  const { groups } = groupMisses([miss('word', 'a'), miss('past', 'b'), miss('past', 'c'), miss('order', 'd'), miss('word', 'e'), miss('past', 'f')],
    { word: { tried: 9, missed: 2 }, past: { tried: 4, missed: 3 }, order: { tried: 2, missed: 1 } }, TASKS);
  assert.deepEqual(groups.map(g => g.label), ['Past tense', 'Which word', 'Word order']);
  assert.deepEqual(groups[0].items.map(m => m.nl), ['b', 'c', 'f']);
  assert.equal(groups[0].color, TASKS.past.color);
});
test('the weakest rule: misses times the share missed on first tries, then the most misses', () => {
  const t = { word: { tried: 10, missed: 3 }, past: { tried: 2, missed: 1 }, order: { tried: 4, missed: 2 } };
  const { weakest } = groupMisses([miss('word', 'a'), miss('word', 'b'), miss('word', 'c'), miss('past', 'd'), miss('order', 'e'), miss('order', 'f')], t, TASKS);
  assert.equal(weakest.task, 'order', '2 of 4 (1.0) beats 1 of 2 (0.5) and 3 of 10 (0.9)');
  assert.equal(weakLine(weakest), 'Weakest rule tonight: Word order, 2 of 4 missed on the first try.');
  const w = (tally, ...tasks) => groupMisses(tasks.map(x => miss(x, x)), tally, TASKS).weakest.task;
  assert.equal(w({ word: { tried: 5, missed: 3 }, dehet: { tried: 1, missed: 1 } }, 'word', 'dehet'), 'word', '3 of 5 beats a single 1 of 1');
  assert.equal(w({ past: { tried: 3, missed: 3 }, word: { tried: 15, missed: 4 } }, 'word', 'past'), 'past', '3 of 3 beats 4 of 15');
  assert.equal(w({ past: { tried: 2, missed: 2 }, word: { tried: 8, missed: 4 } }, 'past', 'word'), 'word', 'a tie (2.0): more misses');
});
test('misses only on returns name no weakest rule; nothing missed gives no line', () => {
  const { groups, weakest } = groupMisses([miss('verb', 'a', { first: false })], { verb: { tried: 3, missed: 0 } }, TASKS);
  assert.equal(groups.length, 1); assert.equal(weakest, null); assert.equal(weakLine(null), '');
  assert.deepEqual(groupMisses([], {}, TASKS), { groups: [], weakest: null });
});
test('an unknown task id falls back to Which word', () => {
  assert.equal(groupMisses([miss('nope', 'a')], {}, TASKS).groups[0].label, 'Which word');
});
test('UI copy: no exclamation marks', () => assert.ok(!/!/.test(weakLine({ label: 'Word order', missed: 1, tried: 2 }))));
