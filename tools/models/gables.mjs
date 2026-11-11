// The four canal-house gables of the concept sheet's ARCHITECTURE panel: step (trapgevel), neck (halsgevel),
// bell (klokgevel), spout (tuitgevel). One file, one node per type. Each is the piece above the eaves: brick extruded
// 0.3 m with sandstone copings, cornices, claw pieces, a hoist beam and wall anchors.
// Frame: facade at z = 0 facing +z, x across the street front (6.1 m, the game's house depth), y = 0 at the eaves,
// the gable rising to TOP = 4.0 (the game scales y for variety). Window slots: 'slot_window_<n>' empties with w, h.
import { Model, box, cyl, ball, rod, tube, slab, place, THREE } from './lib.mjs';

const HW = 3.05, TOP = 4.0, D = 0.3;
const mirror = pts => pts.concat(pts.slice().reverse().map(([x, y]) => [-x, y]));

function band(m, n, y, w) { m.add(n, 'stone', box(w, 0.14, D + 0.12, 0, y, -D / 2 + 0.06), box(w + 0.1, 0.06, D + 0.18, 0, y + 0.09, -D / 2 + 0.09)); }
function hoist(m, n, y) { m.add(n, 'wood', box(0.16, 0.16, 1.0, 0, y, 0.45)); m.add(n, 'iron', rod([0, y - 0.08, 0.85], [0, y - 0.6, 0.85], 0.012, 3)); }
function anchors(m, n, pts) { for (const [x, y] of pts) m.add(n, 'iron', box(0.05, 0.32, 0.03, x, y, 0.02), box(0.18, 0.04, 0.03, x, y, 0.025)); }

function step(m, n) {
  const steps = 5, sw = HW * 0.24, y0 = 0.45, right = [[HW, -0.3], [HW, y0]];
  const xs = i => HW - (HW - sw) * i / steps, ys = i => y0 + (TOP - y0) * i / steps;
  for (let i = 1; i <= steps; i++) right.push([xs(i), ys(i - 1)], [xs(i), ys(i)]);
  const outline = right.concat(right.slice().reverse().map(([x, y]) => [-x, y]));
  m.add(n, 'brick', slab(outline.reverse(), D));
  for (const s of [-1, 1]) {
    m.add(n, 'stone', box(0.34, 0.1, D + 0.1, s * (HW - 0.12), y0 + 0.05, -D / 2));
    for (let i = 1; i < steps; i++) { const w = xs(i) - xs(i + 1); m.add(n, 'stone', box(w + 0.12, 0.1, D + 0.1, s * (xs(i) - w / 2 + 0.04), ys(i) + 0.05, -D / 2)); }
  }
  m.add(n, 'stone', box(sw * 2 + 0.14, 0.12, D + 0.12, 0, TOP + 0.06, -D / 2), cyl(0.05, 0.12, 0.36, 6, 0, TOP + 0.3, -D / 2), ball(0.08, 0, TOP + 0.52, -D / 2, 1, 1, 1, 6, 4));
  band(m, n, -0.3, HW * 2 + 0.1);
  hoist(m, n, TOP - 0.45);
  anchors(m, n, [[-1.6, 0.9], [1.6, 0.9]]);
  m.slot('window', n, [-0.75, 0.72, 0.012], 0.8, 1.15); m.slot('window', n, [0.75, 0.72, 0.012], 0.8, 1.15); m.slot('window', n, [0, 2.0, 0.012], 0.7, 0.95);
}

function neck(m, n) {
  const sh = TOP * 0.42, nw = HW * 0.3, nt = TOP * 0.86;
  m.add(n, 'brick', slab(mirror([[HW, -0.3], [HW, sh], [nw, sh], [nw, nt]]).reverse(), D));
  // claw pieces filling the shoulders: a sandstone scroll on each side
  for (const s of [-1, 1]) {
    const claw = []; for (let i = 0; i <= 8; i++) { const t = i / 8; claw.push([nw + 1.3 * (1 - t) * (1 - t * 0.2), sh + 0.02 + (nt - sh) * 0.7 * Math.pow(t, 0.7)]); }
    m.add(n, 'stone', slab([[nw, sh], ...claw, [nw, sh + (nt - sh) * 0.7]].map(([x, y]) => [x * s, y]), D - 0.04));
    m.add(n, 'stone', box(0.4, 0.12, D + 0.1, s * (HW - 0.2), sh + 0.06, -D / 2), place(new THREE.ConeGeometry(0.13, 0.5, 6), s * (HW - 0.2), sh + 0.37, -D / 2));   // shoulder cap and obelisk
    m.add(n, 'stone', box(0.1, nt - sh, 0.06, s * nw, (sh + nt) / 2, 0.03));                   // the neck's stone edge
  }
  // the cornice on the neck and a round pediment over it
  m.add(n, 'stone', box(nw * 2 + 0.4, 0.16, D + 0.16, 0, nt + 0.08, -D / 2 + 0.04));
  const ped = []; for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI; ped.push([Math.cos(a) * (nw + 0.1), nt + 0.16 + Math.sin(a) * 0.55]); }
  m.add(n, 'stone', slab(ped, D));
  band(m, n, -0.3, HW * 2 + 0.1);
  hoist(m, n, nt - 0.35);
  anchors(m, n, [[-2.2, 0.5], [2.2, 0.5]]);
  m.slot('window', n, [-0.62, 0.62, 0.012], 0.8, 1.1); m.slot('window', n, [0.62, 0.62, 0.012], 0.8, 1.1); m.slot('window', n, [0, 1.85, 0.012], 0.75, 1.0);
}

function bell(m, n) {
  const sh = 0.15, tw = HW * 0.3, tt = TOP * 0.84, curve = [];
  for (let i = 0; i <= 12; i++) { const t = i / 12; const x = HW + (tw - HW) * (3 * t * t - 2 * t * t * t) + Math.sin(t * Math.PI) * 0.12; curve.push([x, sh + (tt - sh) * t]); }
  m.add(n, 'brick', slab(mirror([[HW, -0.3], ...curve]).reverse(), D));
  for (const s of [-1, 1]) m.add(n, 'stone', tube(curve.map(([x, y]) => [s * x, y, 0.0]), 0.075, 18, 5));   // the stone edge along the bell
  m.add(n, 'stone', box(tw * 2 + 0.36, 0.16, D + 0.16, 0, tt + 0.08, -D / 2 + 0.04));
  const ped = []; for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI; ped.push([Math.cos(a) * (tw + 0.05), tt + 0.16 + Math.sin(a) * 0.45]); }
  m.add(n, 'stone', slab(ped, D), ball(0.09, 0, tt + 0.7, -D / 2, 1, 1, 1, 6, 4));
  for (const s of [-1, 1]) m.add(n, 'stone', box(0.36, 0.1, D + 0.1, s * (HW - 0.15), sh + 0.05, -D / 2), ball(0.13, s * (HW - 0.15), sh + 0.22, -D / 2, 1, 1.2, 1, 6, 4));
  band(m, n, -0.3, HW * 2 + 0.1);
  hoist(m, n, tt - 0.4);
  anchors(m, n, [[-2.0, 0.45], [2.0, 0.45]]);
  m.slot('window', n, [0, 0.95, 0.012], 1.0, 1.4); m.slot('window', n, [0, 2.25, 0.012], 0.55, 0.75);
}

function spout(m, n) {
  const sh = 0.25, tw = 0.62, tt = TOP * 0.92;
  m.add(n, 'brick', slab(mirror([[HW, -0.3], [HW, sh], [tw, tt]]).reverse(), D));
  for (const s of [-1, 1]) m.add(n, 'stone', rod([s * HW, sh, -0.02], [s * tw, tt, -0.02], 0.07, 4));
  m.add(n, 'stone', box(tw * 2 + 0.24, 0.14, D + 0.12, 0, tt + 0.07, -D / 2), box(0.26, 0.4, 0.26, 0, tt + 0.34, -D / 2));
  band(m, n, -0.3, HW * 2 + 0.1);
  // the loading doors up the middle, shutters either side of the lower one
  m.add(n, 'wood', box(1.2, 1.5, 0.05, 0, 0.95, 0.02), box(0.9, 1.1, 0.05, 0, 2.25, 0.02));
  m.add(n, 'iron', box(1.24, 0.04, 0.06, 0, 0.6, 0.05), box(1.24, 0.04, 0.06, 0, 1.3, 0.05), box(0.94, 0.04, 0.06, 0, 2.0, 0.05), box(0.94, 0.04, 0.06, 0, 2.5, 0.05));
  hoist(m, n, tt - 0.25);
  m.slot('window', n, [-1.35, 0.7, 0.012], 0.7, 0.95); m.slot('window', n, [1.35, 0.7, 0.012], 0.7, 0.95);
}

export async function build() {
  const m = new Model('gables');
  for (const [name, fn] of [['step', step], ['neck', neck], ['bell', bell], ['spout', spout]]) fn(m, m.node(name, m.root));
  return m.save();
}
if (import.meta.url === `file://${process.argv[1]}`) build();
