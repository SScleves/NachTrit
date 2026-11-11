// Street props from the concept sheet's ENVIRONMENT PROPS and the reference village: the park bench, the tall slim
// modern lamp (its lit head stays the game's own), the parked omafiets that stands at every railing and lamppost,
// the wooden drawbridge with its balance beams. Each matches the frame of the primitive it replaces in index.html.
import { Model, box, cyl, ball, rod, tube, ring, place, lathe, THREE } from './lib.mjs';

// bench: slats along z (1.6 m), the seat facing -x, the back on +x; cast-iron ends with armrests
async function bench() {
  const m = new Model('bench'), n = m.root;
  for (let i = 0; i < 4; i++) m.add(n, 'wood', box(0.1, 0.035, 1.7, -0.17 + i * 0.12, 0.45, 0));
  for (let i = 0; i < 3; i++) m.add(n, 'wood', box(0.035, 0.1, 1.7, 0.27 + i * 0.012, 0.6 + i * 0.13, 0, 0, 0, -0.18));
  for (const z of [-0.7, 0.7]) {
    m.add(n, 'iron', tube([[-0.26, 0.0, z], [-0.22, 0.2, z], [-0.2, 0.43, z]], 0.025, 6, 5), tube([[0.2, 0.0, z], [0.18, 0.2, z], [0.15, 0.43, z]], 0.025, 6, 5));
    m.add(n, 'iron', box(0.5, 0.04, 0.04, -0.02, 0.42, z), tube([[0.2, 0.43, z], [0.25, 0.65, z], [0.31, 0.92, z]], 0.022, 6, 4));
    m.add(n, 'iron', tube([[-0.24, 0.43, z], [-0.25, 0.62, z], [-0.1, 0.66, z], [0.18, 0.64, z]], 0.02, 8, 4), ball(0.035, -0.25, 0.62, z, 1, 1, 1, 5, 4));
  }
  return m.save();
}

// the modern street lamp of the reference village: a tapered pole on a plinth, the arm curving out to a flat head at
// (-0.8, 4.0) where the game puts its glowing lens and light decals
async function lamp() {
  const m = new Model('lamp'), n = m.root;
  m.add(n, 'iron', cyl(0.06, 0.1, 4.1, 8, 0, 2.05, 0), cyl(0.15, 0.17, 0.5, 8, 0, 0.25, 0), cyl(0.12, 0.15, 0.06, 8, 0, 0.53, 0));
  m.add(n, 'iron', tube([[0, 3.95, 0], [0, 4.18, 0], [-0.25, 4.28, 0], [-0.62, 4.2, 0], [-0.8, 4.14, 0]], 0.04, 10, 6));
  m.add(n, 'iron', place(lathe([[0.001, 0.0], [0.34, 0.0], [0.33, 0.05], [0.2, 0.11], [0.001, 0.12]], 12), -0.8, 4.04, 0, 0, 0, 0, 1, 1, 0.75));
  m.add(n, 'iron', box(0.12, 0.3, 0.02, 0, 1.4, -0.08));                // the door plate on the pole
  return m.save();
}

// a parked omafiets as kBike draws it: front at -z, wheels radius 0.33 at z 0.55 and -0.55. 'frame' takes the bike's colour
async function bike() {
  const m = new Model('bike'), n = m.root, R = 0.33;
  for (const z of [0.55, -0.55]) {
    m.add(n, 'tyre', ring([0, R, z], 0.31, 0.024, 0, Math.PI * 2, 18, 4));
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; m.add(n, 'steel', rod([0, R, z], [0, R + Math.sin(a) * 0.29, z + Math.cos(a) * 0.29], 0.004, 3)); }
    m.add(n, 'frame', ring([0, R, z], 0.355, 0.026, z > 0 ? Math.PI * 0.05 : Math.PI * 0.3, Math.PI * 0.75, 10, 3));   // mudguards
  }
  const BB = [0, 0.3, 0.08];
  m.add(n, 'frame', rod([0, R, 0.55], BB, 0.016, 4), rod([0, R, 0.55], [0, 0.84, 0.22], 0.014, 4), rod(BB, [0, 0.86, 0.22], 0.02, 5));
  m.add(n, 'frame', tube([[0, 0.86, -0.42], [0, 0.6, -0.3], [0, 0.4, -0.1], [0, 0.32, 0.06]], 0.02, 8, 5), tube([[0, 0.76, -0.44], [0, 0.5, -0.32], [0, 0.34, -0.05]], 0.018, 7, 4));
  m.add(n, 'frame', rod([0, 0.7, -0.44], [0, 0.98, -0.38], 0.022, 5), tube([[0, 0.72, -0.44], [0, 0.5, -0.5], [0, R, -0.55]], 0.016, 6, 4));
  m.add(n, 'frame', box(0.16, 0.022, 0.42, 0, 0.7, 0.5), rod([0.07, 0.7, 0.68], [0.04, R, 0.56], 0.01, 3), rod([-0.07, 0.7, 0.68], [-0.04, R, 0.56], 0.01, 3));   // rack
  m.add(n, 'frame', box(0.03, 0.12, 0.5, 0.05, 0.32, 0.32));                                                             // chain case
  m.add(n, 'steel', tube([[-0.27, 1.0, -0.22], [-0.2, 1.0, -0.36], [0, 0.99, -0.4], [0.2, 1.0, -0.36], [0.27, 1.0, -0.22]], 0.012, 10, 4));
  m.add(n, 'leather', box(0.13, 0.05, 0.24, 0, 0.9, 0.24));
  m.add(n, 'steel', rod([-0.02, 0.3, 0.3], [-0.06, 0.0, 0.45], 0.01, 3));                                                // the stand, down
  return m.save();
}

// the wooden drawbridge of concept A and D: the deck runs from x = 0 to x = -10 at y 0.3, 2.4 m wide; the portal and
// the balance beams with the counterweight stand over its landward end
async function drawbridge() {
  const m = new Model('drawbridge'), n = m.root;
  for (let x = -0.25; x > -10; x -= 0.5) m.add(n, 'wood', box(0.46, 0.1, 2.5, x, 0.38, 0));                            // planks
  m.add(n, 'wood', box(10, 0.22, 0.18, -5, 0.22, -1.1), box(10, 0.22, 0.18, -5, 0.22, 1.1));                             // stringers
  for (const z of [-1.18, 1.18]) {
    for (let x = -0.4; x > -10; x -= 1.2) m.add(n, 'wood', box(0.08, 0.95, 0.08, x, 0.9, z));
    m.add(n, 'wood', box(10, 0.07, 0.1, -5, 1.36, z), box(10, 0.05, 0.05, -5, 0.86, z));
    for (const x of [-2.6, -7.4]) m.add(n, 'wood', box(0.3, 2.2, 0.3, x, -0.8, z));                                       // piles in the water
  }
  // the portal (galg): two posts and a crossbeam, braced
  for (const z of [-1.45, 1.45]) {
    m.add(n, 'wood', box(0.26, 5.1, 0.26, -7.0, 2.55, z), rod([-7.0, 3.6, z], [-5.9, 0.4, z], 0.07, 4), rod([-7.0, 3.6, z], [-8.1, 0.4, z], 0.07, 4));
  }
  m.add(n, 'wood', box(0.3, 0.3, 3.3, -7.0, 5.2, 0));
  // the balance beams, nearly level with the bridge closed, a lattice between them, the counterweight at the back
  for (const z of [-1.2, 1.2]) m.add(n, 'wood', rod([-10.2, 4.9, z], [-0.8, 5.75, z], 0.12, 4));
  for (let i = 0; i < 6; i++) { const x0 = -8.6 + i * 1.3, y0 = 5.05 + (x0 + 10.2) * 0.09, x1 = x0 + 1.3, y1 = y0 + 1.3 * 0.09; m.add(n, 'wood', rod([x0, y0, -1.2], [x1, y1, 1.2], 0.05, 3), rod([x0, y0, 1.2], [x1, y1, -1.2], 0.05, 3)); }
  m.add(n, 'wood', box(1.3, 0.9, 2.6, -9.6, 4.55, 0));
  // the hanging rods from the beam ends to the tip of the deck
  for (const z of [-1.2, 1.2]) m.add(n, 'iron', rod([-0.85, 5.7, z], [-0.6, 0.45, z], 0.03, 4));
  return m.save();
}

export async function build() { let b = 0; for (const f of [bench, lamp, bike, drawbridge]) b += await f(); return b; }
if (import.meta.url === `file://${process.argv[1]}`) build();
