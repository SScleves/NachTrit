// Story payoff and stakes (PLAN.md phase 5): the glyph's target, the dead lamps, the bus stop rules, the town dawn (src/payoff.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { canRestart, capStars, CHECKPOINT, deadAtStart, GLYPH, glyphNear, halfway, ownDraws, pickGlyphTarget, townDawn } from '../../src/payoff.js';

const c = (z, lit = false, lamp = true, busy = false) => ({ z, lit, lamp, busy });

test('a ride starts with two lamps in three dead, the first of each three lit', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(deadAtStart), [false, true, true, false, true, true, false]);
});
test('the word flies to the nearest dark lamp or blank sign ahead, inside the range', () => {
  const near = glyphNear(12);
  assert.ok(near < GLYPH.zNear, 'the range moves out with the speed');
  assert.deepEqual(pickGlyphTarget([c(-60), c(-35), c(-50, false, false), c(-5)], near, GLYPH.zFar), { i: 1, relight: true }, 'the nearest dark one in range; -5 is too close');
  assert.deepEqual(pickGlyphTarget([c(-60), c(-40, false, false)], near, GLYPH.zFar), { i: 1, relight: true }, 'a blank shop sign counts');
  assert.deepEqual(pickGlyphTarget([c(-90), c(10)], near, GLYPH.zFar), { i: -1, relight: false }, 'nothing in range');
});
test('a target a word is already flying to is skipped; with every one lit, the nearest lit lamp flares', () => {
  const near = glyphNear(12);
  assert.deepEqual(pickGlyphTarget([c(-35, false, true, true), c(-45)], near, GLYPH.zFar), { i: 1, relight: true });
  assert.deepEqual(pickGlyphTarget([c(-35, true), c(-45, true), c(-30, true, false)], near, GLYPH.zFar), { i: 0, relight: false }, 'a lit sign does not flare, a lit lamp does');
  assert.deepEqual(pickGlyphTarget([c(-35, true, false)], near, GLYPH.zFar), { i: -1, relight: false });
});
test('the bus stop stands after half the deliveries, rounded up', () => {
  assert.deepEqual([4, 12, 15, 20, 25].map(halfway), [2, 6, 8, 10, 13]);
});
test('a restart needs the stop passed and not used; once a ride', () => {
  assert.equal(canRestart(null), false);
  assert.equal(canRestart({ passed: false, used: false }), false, 'died before the stop: the ride is over');
  assert.equal(canRestart({ passed: true, used: false }), true);
  assert.equal(canRestart({ passed: true, used: true }), false, 'once a ride');
  assert.equal(CHECKPOINT.lamp, 50, 'half a lamp');
});
test('a ride that used the bus stop earns two stars at most', () => {
  assert.deepEqual([0, 1, 2, 3].map(s => capStars(s, true)), [0, 1, 2, 2]);
  assert.deepEqual([0, 1, 2, 3].map(s => capStars(s, false)), [0, 1, 2, 3]);
});
test('a town dawns when every place in it has three stars; bonus, trophy and soon places do not count', () => {
  const lv = [{ id: 11 }, { id: 12 }, { id: 13, soon: true }, { id: 1003 }];
  assert.equal(townDawn(lv, { 11: 3, 12: 3 }), true);
  assert.equal(townDawn(lv, { 11: 3, 12: 2, 1003: 3 }), false);
  assert.equal(townDawn(lv, { 11: 3 }), false, 'a place not ridden');
  assert.equal(townDawn([{ id: 13, soon: true }], {}), false, 'no places: no dawn');
  assert.equal(townDawn([], {}), false);
});
test('ownDraws leaves the game\'s Math.random sequence where it was', () => {
  let a = 1; const seeded = () => { a = (a * 16807) % 2147483647; return a / 2147483647; };
  const keep = Math.random; Math.random = seeded;
  try {
    const first = Math.random();
    const inner = ownDraws(() => [Math.random(), Math.random()]);
    const second = Math.random();
    a = 1; const ref = [seeded(), seeded()];
    assert.deepEqual([first, second], ref, 'the draws inside did not use the game\'s generator');
    assert.ok(inner.every(x => x >= 0 && x < 1));
    assert.equal(Math.random, seeded, 'restored');
    assert.throws(() => ownDraws(() => { throw new Error('x'); })); assert.equal(Math.random, seeded, 'restored after a throw');
  } finally { Math.random = keep; }
});
