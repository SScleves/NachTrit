// The lamp maths (src/lamp.js): drain, night depth, refuel. The numbers are the ones HANDOVER.md section 6 documents.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { TUNE, nightAt, lampReadK, lampLoss, refuelRight } from '../../src/lamp.js';
import { ROOT, content_ } from './helpers.mjs';

const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg || ''} ${a} != ${b}`);
test('TUNE is what HANDOVER.md section 6 says', () => {
  const doc = fs.readFileSync(path.join(ROOT, 'Opus 5.5 DT', 'HANDOVER.md'), 'utf8');
  const m = /`TUNE = (\{[^}]*\})`/.exec(doc); assert.ok(m, 'HANDOVER.md has no `TUNE = { ... }` line');
  const doc_ = Function(`return (${m[1]})`)();
  assert.deepEqual({ ...TUNE }, doc_);
});
test('night runs 0 to 1 over a level (95 m a delivery) and over 2600 m in endless', () => {
  near(nightAt(0, 20), 0); near(nightAt(950, 20), 0.5); near(nightAt(1900, 20), 1); near(nightAt(5000, 20), 1);
  near(nightAt(1300, 0), 0.5, 'endless'); near(nightAt(1300, null), 0.5, 'endless'); near(nightAt(9999, null), 1);
});
test('the share of the drain: none while the first gate holds, by speed at a fork, all of it on open road', () => {
  assert.equal(lampReadK(true, true, 0.5), 0); assert.equal(lampReadK(true, false, 1), 0);
  assert.equal(lampReadK(false, false, 0.1), 1);
  near(lampReadK(false, true, 0.425), 0.5); assert.equal(lampReadK(false, true, 1), 1); assert.equal(lampReadK(false, true, 0), 0);
});
test('drain per second: min(lampDecay, cap) x drain x (0.6 + 1.1 x night)', () => {
  const lv = { lampDecay: 0.4 };
  near(lampLoss(1, 1, lv, 12, 0), 0.4 * 2.8 * 0.6); near(lampLoss(1, 1, lv, 12, 1), 0.4 * 2.8 * 1.7);
  near(lampLoss(0.5, 0.5, lv, 12, 1), 0.25 * 0.4 * 2.8 * 1.7, 'dt and readK scale it');
  near(lampLoss(1, 1, { lampDecay: 0.9 }, 12, 0), 0.6 * 2.8 * 0.6, 'lampDecay above the cap is capped');
  assert.equal(lampLoss(1, 0, lv, 12, 1), 0);
});
test('endless drains by speed, not lampDecay: slower riders lose more', () => {
  near(lampLoss(1, 1, null, 12, 0), 1.7 * 0.6); near(lampLoss(1, 1, null, 17, 0), 1.1 * 0.6);
});
test('a right answer refuels 3, plus 0.3 a streak step up to four', () => {
  near(refuelRight(0), 3); near(refuelRight(1), 3.3); near(refuelRight(4), 4.2); near(refuelRight(12), 4.2);
});
test('every level drains, and no level drains faster than the cap allows', () => {
  const { levels } = content_(), worst = TUNE.cap * TUNE.drain * 1.7;
  for (const lv of levels) {
    assert.ok(lv.lampDecay > 0, `L${lv.id} has no lampDecay`);
    assert.ok(lampLoss(1, 1, lv, lv.speed, 1) <= worst + 1e-9, `L${lv.id}`);
  }
});
test('a whole level at cruise with no refuel: the loss is the closed form of the drain over the night ramp', () => {
  // ride D = deliveries x 95 m at v m/s: night goes 0 to 1 linearly, so the mean factor is 0.6 + 0.55
  const lv = { lampDecay: 0.5, deliveries: 20 }, v = 10, D = lv.deliveries * 95, dt = 1 / 60;
  let lost = 0; for (let d = 0; d < D; d += v * dt) lost += lampLoss(dt, 1, lv, v, nightAt(d, lv.deliveries));
  const want = 0.5 * TUNE.drain * (0.6 + 0.55) * (D / v);
  assert.ok(Math.abs(lost - want) / want < 0.002, `${lost} vs ${want}`);
});
