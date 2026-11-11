// The reading budget per fork and the legible distance (src/reading.js). PLAN.md section 2: every fork keeps its reading
// budget at every tier; only speed and obstacles scale.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readBudget, legDist, wordsIn, READ_THR, READ_AHEAD } from '../../src/reading.js';
import { levelQueue } from '../../src/forks.js';
import { content_, lanesOf, withSeed, forksOfEntry } from './helpers.mjs';

const build = (o, extra = {}) => ({ o, entry: {}, ...extra });
test('wordsIn counts words over every option', () => {
  assert.equal(wordsIn(['de hond', ' het  huis ']), 4); assert.equal(wordsIn(['ja']), 1); assert.equal(wordsIn([]), 0);
});
test('de/het and word forks get the minimum, 3 s', () => {
  assert.equal(readBudget({ o: ['de', 'het'], entry: { dehet: true } }), 3);
  assert.equal(readBudget({ o: ['de hond', 'de kat', 'de koe'], entry: { word: true } }), 3);
});
test('a build fork: 0.35 s a word plus 1.2 s, between 3 and 7 s', () => {
  assert.equal(readBudget(build(['ik', 'jij'])), 3, 'the floor');
  assert.ok(Math.abs(readBudget(build(['dat ik morgen kom', 'dat ik kom morgen', 'dat morgen ik kom'])) - (0.35 * 12 + 1.2)) < 1e-9);
  assert.equal(readBudget(build(['een zin van tien woorden die heel lang door blijft gaan', 'een andere zin van tien woorden die ook lang doorgaat'])), 7, 'the cap');
});
test('reading and listening take one and a half times as long; the first fork of a task type 1.5 s more', () => {
  const o = ['I am tired.', 'I am cold.', 'I am late.'], b = 0.35 * 9 + 1.2;
  assert.ok(Math.abs(readBudget({ o, read: true, entry: {} }) - b * 1.5) < 1e-9);
  assert.ok(Math.abs(readBudget({ o, entry: { listen: true } }) - b * 1.5) < 1e-9);
  assert.ok(Math.abs(readBudget({ o, read: true, entry: {}, firstTask: true }) - (b * 1.5 + 1.5)) < 1e-9);
  assert.equal(readBudget({ o: ['de', 'het'], entry: { dehet: true }, firstTask: true }), 4.5);
});
test('legDist: bigger letters read from further off, always between READ_AHEAD and 40 m', () => {
  let last = 0;
  for (let em = 0.01; em < 1.2; em += 0.01) {
    const d = legDist(em);
    assert.ok(d > READ_AHEAD && d <= 40, `em ${em}: ${d}`); assert.ok(d >= last, `not monotonic at em ${em}`); last = d;
  }
  assert.equal(legDist(0.0001), READ_AHEAD + 0.5); assert.equal(legDist(10), 40);
  assert.equal(READ_THR, 0.0125); assert.equal(READ_AHEAD, 3);
});
test('legDist is the furthest half metre where the letters reach READ_THR of the screen through the fork camera', () => {
  // the fork camera as legDist models it: it widens (fov 70 to 82) and closes in as the gate nears
  const frac = (em, a) => { const fz = Math.min(1, Math.max(0, 1 - a / 46)), sf = 1 - fz, half = (60 + sf * 10 + fz * 22) * Math.PI / 360; return em / (2 * Math.tan(half) * (a + 6.4 + sf * 2.6 - fz * 2.4)); };
  assert.ok(frac(0.06, READ_AHEAD + 0.5) < READ_THR && legDist(0.06) === READ_AHEAD + 0.5, 'never legible: the floor');
  for (const em of [0.2, 0.22, 0.25, 0.28, 0.3, 0.35, 0.4, 0.6]) {   // the game's signs: about 0.2 to 0.3 m (signFit px / 250 x 1.02)
    const d = legDist(em);
    assert.ok(frac(em, d) >= READ_THR, `em ${em}: not legible at ${d}`);
    if (d < 40) assert.ok(frac(em, d + 0.5) < READ_THR, `em ${em}: legible further out than ${d}`);
    assert.equal(d * 2, Math.round(d * 2), `em ${em}: ${d} is not on the half-metre grid`);
  }
});
test('every fork in the content has a budget within the rule: 3 to 7 s, read and listen up to 10.5, plus 1.5 for a first', () => {
  const { levels } = content_(), bad = [], seen = { n: 0, max: 0 };
  withSeed(11, () => {
    for (const lv of levels) {
      const tasks = new Set();
      for (const e of levelQueue(lv, lanesOf(lv))) for (const f of forksOfEntry(e)) {
        const kind = f.read || e.listen ? 'slow' : e.dehet || e.word ? 'min' : 'build';
        f.firstTask = !tasks.has(kind); tasks.add(kind);
        const b = readBudget(f), lo = kind === 'min' ? 3 : kind === 'slow' ? 4.5 : 3, hi = (kind === 'min' ? 3 : kind === 'slow' ? 10.5 : 7) + (f.firstTask ? 1.5 : 0);
        if (!(b >= lo && b <= hi + 1e-9)) bad.push(`L${lv.id} ${kind} ${JSON.stringify(f.o).slice(0, 60)}: ${b}`);
        seen.n++; seen.max = Math.max(seen.max, b);
      }
    }
  });
  assert.ok(seen.n > 1000, `only ${seen.n} forks`);
  assert.deepEqual(bad.slice(0, 10), [], `${bad.length} forks outside the rule`);
});
// the why card after a wrong answer (PLAN.md 3d point 1): the reading budget of the why line, 0.35 s a word, at least 3 s
import { whyBudget } from '../../src/reading.js';
test('the why card stays 0.35 s a word of the why line, at least 3 s', () => {
  assert.equal(whyBudget(''), 3); assert.equal(whyBudget(undefined), 3); assert.equal(whyBudget('de hond = the dog'), 3, 'short lines get the floor');
  const w = 'A fronted time phrase pushes the subject behind the verb: bel ik. The separable prefix terug sits at the end.';
  assert.ok(Math.abs(whyBudget(w) - 0.35 * 20) < 1e-9, `20 words: ${whyBudget(w)}`);
  assert.ok(Math.abs(whyBudget('one two three four five six seven eight nine') - 3.15) < 1e-9, 'nine words: just over the floor');
});
