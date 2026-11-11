// Task label derivation (src/tasks.js): the nine labels, the pure-reorder rule, the rule id map and the task override.
import test from 'node:test';
import assert from 'node:assert/strict';
import { TASKS, TASK_OF_RULE, taskOf, isPureReorder, wordBag } from '../../src/tasks.js';
import { taskOf as qaTaskOf } from '../lib/tasks.mjs';
import { itemToEntry } from '../../src/forks.js';
import { content_, lanesOf, withSeed, forksOfEntry } from './helpers.mjs';

const fork = (o, r, entry = {}, extra = {}) => ({ o, a: 0, r, entry, ...extra });
test('nine labels, each with a short English label and a colour', () => {
  assert.deepEqual(Object.keys(TASKS).sort(), ['comp', 'dehet', 'listen', 'meaning', 'order', 'past', 'spell', 'verb', 'word']);
  for (const [k, t] of Object.entries(TASKS)) { assert.match(t.color, /^#[0-9a-f]{6}$/, k); assert.ok(t.label.length > 2 && t.label.length <= 12, k); assert.ok(!t.label.includes('!')); }
  assert.equal(new Set(Object.values(TASKS).map(t => t.color)).size, 9, 'every label its own colour');
});
test('every label can be reached', () => {
  assert.equal(taskOf(fork(['Ik fiets nu', 'Nu ik fiets'], 'woord')), 'order');
  assert.equal(taskOf(fork(['fietste', 'fietsen'], 'imp')), 'past');
  assert.equal(taskOf(fork(['kan', 'kunt'], 'modal')), 'verb');
  assert.equal(taskOf(fork(['groter', 'grootste'], 'vergelijk')), 'comp');
  assert.equal(taskOf(fork(['de', 'het'], 'dehet', { dehet: true })), 'dehet');
  assert.equal(taskOf(fork(['de brug', 'de kerk'], 'woord', { listen: true })), 'listen');
  assert.equal(taskOf(fork(['I am tired.', 'I am cold.'], 'woord', {}, { read: true })), 'meaning');
  assert.equal(taskOf(fork(['de hond', 'de kat'], 'woord', { word: true })), 'word');
  assert.equal(taskOf(fork(['werkte', 'werkde'], 'imp', {}, { task: 'spell' })), 'spell');
});
test('the task override: on the fork or on the entry; an unknown task falls back to word', () => {
  assert.equal(taskOf(fork(['a b', 'b a'], 'imp', { task: 'verb' })), 'verb');
  assert.equal(taskOf(fork(['a b', 'b a'], 'imp', {}, { task: 'past' })), 'past');
  assert.equal(taskOf(fork(['a', 'b'], 'imp', {}, { task: 'nonsense' })), 'word');
  assert.equal(taskOf(fork(['x'], 'woord', { read: true, task: 'spell' }, { read: true })), 'spell', 'override beats read');
});
test('pure reorder beats the rule id; single words and different words are not a reorder', () => {
  assert.equal(taskOf(fork(['Gisteren fietste ik.', 'Gisteren ik fietste.'], 'imp')), 'order');
  assert.equal(taskOf(fork(['fietste', 'fietsen'], 'v2')), 'order', 'by the rule id map');
  assert.equal(taskOf(fork(['fietste', 'fietsen'], 'imp')), 'past');
  assert.equal(isPureReorder(['ik', 'ik']), false, 'one word is not a reorder');
  assert.equal(isPureReorder(['dat ik kom', 'dat kom ik', 'ik kom dat']), true);
  assert.equal(isPureReorder(['dat ik kom', 'dat ik kwam']), false);
  assert.equal(wordBag('Kom ik, nu?'), wordBag('nu ik kom.'), 'case and punctuation do not count');
  assert.equal(taskOf(fork(['de brug op', 'op de brug'], 'woord', { dehet: true })), 'dehet', 'entry kinds come before the reorder test');
});
test('the rule id map: every listed id goes to a label that exists, unknown ids to word', () => {
  for (const [r, t] of Object.entries(TASK_OF_RULE)) assert.ok(TASKS[t], `${r} -> ${t}`);
  assert.equal(TASK_OF_RULE.v2, 'order'); assert.equal(TASK_OF_RULE.perf, 'past'); assert.equal(TASK_OF_RULE.sep, 'verb'); assert.equal(TASK_OF_RULE.vergelijk, 'comp');
  assert.equal(taskOf(fork(['a', 'b'], 'no-such-rule')), 'word');
});
test('every rule id the content uses is a rule in data.js', () => {
  const { levels, RULES } = content_(), missing = new Set();
  for (const lv of levels) for (const it of lv.items) for (const p of it.parts || []) if (typeof p !== 'string' && !RULES[p.r]) missing.add(p.r);
  assert.deepEqual([...missing], []);
});
test('the qa tools label every fork of the content as the game does', () => {
  const { levels } = content_(), diff = [];
  withSeed(7, () => {
    for (const lv of levels) for (const item of lv.items) {
      const e = itemToEntry(item, lv.items, lanesOf(lv));
      for (const f of forksOfEntry(e)) {
        const raw = { o: f.o, a: f.a, r: f.r, task: f.task, read: f.read, entry: item };
        const game = taskOf(f), qa = qaTaskOf(raw);
        if (game !== qa) diff.push(`L${lv.id} ${e.nl}: game ${game}, qa ${qa}`);
      }
    }
  });
  assert.deepEqual(diff.slice(0, 10), [], `${diff.length} forks labelled differently`);
});
test('one id per rule: the seven merged groups stay merged (11 Nov 2026)', () => {
  const retired = new Set(['pres', 'vgl', 'objpron', 'eris', 'imper', 'conditie', 'alsdan', 'voorwaarde', 'vnwadv', 'erop']);
  const { levels, RULES } = content_(), used = new Set();
  for (const lv of levels) for (const it of lv.items) for (const p of it.parts || [it]) if (p && p.r) used.add(p.r);
  assert.deepEqual([...used].filter(r => retired.has(r)), []);
  assert.deepEqual(Object.keys(RULES).filter(r => retired.has(r)), []);
  for (const r of retired) assert.equal(TASK_OF_RULE[r], undefined, r);
});
