// The hero on his omafiets (concept-art/G-omafiets-retro-future.png and README: orange jacket, no helmet).
// Same frame of reference as the primitive bike in index.html: front at -z, wheels on y = 0, rear axle z 0.62, front
// axle z -0.62, crank at (0, 0.36, 0.08), saddle top at y 1.06, head centre (0, 1.92, 0.1), so the game's headlamp
// lens, tail light and face canvas still sit right.
// Moving nodes (the game turns them): wheel_f, wheel_r, crank, pedal_L/R (children of crank), thigh_L/R > shin_L/R >
// foot_L/R, head. Everything else is static and merges into one mesh per material.
import { Model, V, box, cyl, ball, rod, tube, lathe, slab, ring, limb, place, THREE } from './lib.mjs';

export async function build() {
  const m = new Model('rider'), R = m.root;
  const frame = m.node('frame', R);

  // ---- wheels: tyre, rim, hub and sixteen spokes, in the y-z plane, turning about x ----
  for (const [name, z] of [['wheel_f', -0.62], ['wheel_r', 0.62]]) {
    const w = m.node(name, R, [0, 0.34, z]);
    m.add(w, 'tyre', ring([0, 0, 0], 0.315, 0.03, 0, Math.PI * 2, 28, 6));
    m.add(w, 'steel', ring([0, 0, 0], 0.285, 0.011, 0, Math.PI * 2, 28, 4), cyl(0.032, 0.032, 0.11, 8, 0, 0, 0, 0, 0, Math.PI / 2));
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, s = i % 2 ? 1 : -1; m.add(w, 'steel', rod([s * 0.035, 0, 0], [s * 0.008, Math.sin(a) * 0.28, Math.cos(a) * 0.28], 0.0045, 3)); }
  }

  // ---- the frame: the double swept down tubes of a step-through, seat tube, stays, fork ----
  const BB = [0, 0.36, 0.08], HT = [0, 0.97, -0.5], HB = [0, 0.74, -0.535];
  m.add(frame, 'frame',
    rod(HB, HT, 0.03, 8),                                                                               // head tube
    tube([[0, 0.9, -0.51], [0, 0.66, -0.4], [0, 0.46, -0.18], [0, 0.39, 0.02], [0, 0.4, 0.12]], 0.024, 16, 6),   // upper swept tube
    tube([[0, 0.78, -0.53], [0, 0.55, -0.42], [0, 0.4, -0.2], [0, 0.35, 0.02]], 0.024, 14, 6),              // lower swept tube
    rod(BB, [0, 0.97, 0.27], 0.024, 6),                                                                  // seat tube
    rod([0, 0.97, 0.27], [0, 1.0, 0.285], 0.016, 6),                                                     // seat post
  );
  for (const s of [-1, 1]) {
    m.add(frame, 'frame', rod([s * 0.02, 0.36, 0.08], [s * 0.055, 0.34, 0.62], 0.014, 5), rod([s * 0.02, 0.9, 0.25], [s * 0.055, 0.34, 0.62], 0.012, 5));   // chain and seat stays
    m.add(frame, 'frame', tube([[s * 0.02, 0.76, -0.535], [s * 0.05, 0.6, -0.56], [s * 0.055, 0.45, -0.6], [s * 0.055, 0.34, -0.625]], 0.015, 8, 5));   // the fork, a little rake
    // the rear rack on its struts
    m.add(frame, 'frame', rod([s * 0.08, 0.745, 0.5], [s * 0.08, 0.745, 1.02], 0.012, 5), rod([s * 0.08, 0.745, 0.98], [s * 0.056, 0.36, 0.64], 0.01, 4), rod([s * 0.08, 0.745, 0.52], [s * 0.03, 0.88, 0.3], 0.01, 4));
  }
  for (let i = 0; i < 4; i++) m.add(frame, 'frame', box(0.16, 0.012, 0.012, 0, 0.745, 0.56 + i * 0.15));
  // mudguards, wide and black, over the top of both wheels
  m.add(frame, 'frame', ring([0, 0.34, 0.62], 0.36, 0.035, Math.PI * 0.05, Math.PI * 0.95, 18, 4), ring([0, 0.34, -0.62], 0.36, 0.035, Math.PI * 0.3, Math.PI * 0.75, 16, 4));
  // the closed chain case from the crank to the rear axle, on the right
  const caseOutline = []; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i / 10 * Math.PI; caseOutline.push([0.54 + Math.cos(a) * 0.075, Math.sin(a) * 0.075]); }
  for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 + i / 10 * Math.PI; caseOutline.push([Math.cos(a) * 0.12, Math.sin(a) * 0.12]); }
  m.add(frame, 'frame', place(slab(caseOutline, 0.045), 0.1, 0.36, 0.08, 0, -Math.PI / 2, 0));
  m.add(frame, 'neon', box(0.008, 0.016, 0.42, 0.102, 0.36, 0.36));                                    // the amber strip along it
  m.add(frame, 'neon', rod([0.04, 0.68, -0.555], [0.06, 0.43, -0.61], 0.007, 4), rod([-0.04, 0.68, -0.555], [-0.06, 0.43, -0.61], 0.007, 4));   // down the fork
  // handlebars swept back to the rider, grips, a bell
  m.add(frame, 'steel', rod(HT, [0, 1.04, -0.5], 0.018, 6), tube([[-0.28, 1.05, -0.33], [-0.24, 1.05, -0.44], [-0.1, 1.04, -0.52], [0, 1.04, -0.52], [0.1, 1.04, -0.52], [0.24, 1.05, -0.44], [0.28, 1.05, -0.33]], 0.014, 18, 5), ball(0.03, 0.14, 1.07, -0.5, 1, 0.6, 1));
  for (const s of [-1, 1]) m.add(frame, 'leather', rod([s * 0.28, 1.05, -0.4], [s * 0.285, 1.05, -0.28], 0.024, 6));
  // the headlamp: a round housing on a bracket (the game's own lens and halo sit at its front)
  m.add(frame, 'frame', rod([0, 0.95, -0.55], [0, 0.88, -0.74], 0.012, 4), cyl(0.088, 0.075, 0.11, 12, 0, 0.88, -0.8, Math.PI / 2, 0, 0));
  m.add(frame, 'steel', ring([0, 0.88, -0.86], 0.08, 0.008, 0, Math.PI * 2, 14, 3).rotateY(0));
  // the sprung leather saddle
  const saddle = lathe([[0.001, 0], [0.12, 0.0], [0.13, 0.03], [0.1, 0.06], [0.001, 0.065]], 10); place(saddle, 0, 1.0, 0.31, 0, 0, 0, 1, 1, 1.2);
  const nose = box(0.07, 0.04, 0.16, 0, 1.04, 0.18);
  m.add(frame, 'leather', saddle, nose);
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) m.add(frame, 'steel', ring([s * 0.06, 0.985 - i * 0.017, 0.4], 0.022, 0.006, 0, Math.PI * 2, 8, 3).rotateZ(0));
  m.add(frame, 'neon', box(0.1, 0.01, 0.012, 0, 1.01, 0.47));
  // the kickstand folded up along the left chain stay
  m.add(frame, 'steel', rod([-0.04, 0.35, 0.3], [-0.05, 0.3, 0.55], 0.01, 4));

  // ---- crank and pedals: the crank turns, each pedal is turned back so it stays level ----
  const crank = m.node('crank', R, BB);
  m.add(crank, 'steel', cyl(0.12, 0.12, 0.012, 18, 0.075, 0, 0, 0, 0, Math.PI / 2), cyl(0.03, 0.03, 0.18, 8, 0, 0, 0, 0, 0, Math.PI / 2));
  m.add(crank, 'frame', rod([0.09, 0, 0], [0.1, -0.17, 0], 0.014, 5), rod([-0.09, 0, 0], [-0.1, 0.17, 0], 0.014, 5));
  for (const [nm, x, y] of [['pedal_R', 0.15, -0.17], ['pedal_L', -0.15, 0.17]]) {
    const p = m.node(nm, crank, [x, y, 0]);
    m.add(p, 'frame', box(0.09, 0.022, 0.07, 0, 0, 0));
    m.add(p, 'neon', box(0.075, 0.01, 0.01, 0, 0, 0.038));
  }

  // ---- the rider: seated upright as on an omafiets, leaning a little forward ----
  const body = m.node('body', R);
  // pelvis on the saddle
  m.add(body, 'trousers', ball(0.15, 0, 1.11, 0.27, 1.12, 0.62, 1.0, 10, 6));
  // the jacket: a body of revolution, oval in section, the hem a little flared; turned a touch forward
  const jk = lathe([[0.15, 0], [0.185, 0.04], [0.19, 0.2], [0.205, 0.4], [0.2, 0.52], [0.15, 0.6], [0.075, 0.64], [0.06, 0.66]], 12);
  place(jk, 0, 1.08, 0.25, -0.12, 0, 0, 1.05, 1, 0.72);
  m.add(body, 'jacket', jk);
  m.add(body, 'jacketDark', place(lathe([[0.19, 0], [0.195, 0.035], [0.19, 0.04]], 12), 0, 1.08, 0.25, -0.12, 0, 0, 1.06, 1, 0.74));   // the hem band
  m.add(body, 'jacket', ball(0.11, 0, 1.69, 0.31, 1.25, 0.6, 0.9, 10, 6));                              // the hood, down on his back
  m.add(body, 'jacketDark', place(new THREE.TorusGeometry(0.075, 0.025, 5, 12), 0, 1.72, 0.18, Math.PI / 2 - 0.2, 0, 0, 1.05, 1, 0.85));   // the collar
  m.add(body, 'jacketDark', box(0.012, 0.5, 0.012, 0, 1.4, 0.08, -0.12, 0, 0));                          // the zip
  m.add(body, 'skin', rod([0, 1.7, 0.17], [0, 1.84, 0.12], 0.055, 8));                                     // neck
  for (const s of [-1, 1]) {
    const sh = [s * 0.2, 1.63, 0.2], el = [s * 0.27, 1.36, -0.03], wr = [s * 0.275, 1.08, -0.3];
    m.add(body, 'jacket', ball(0.08, ...sh, 1, 1, 1, 8, 6), ...limb(sh, el, 0.07, 0.06, 7), ...limb(el, wr, 0.058, 0.05, 7));
    m.add(body, 'jacketDark', rod([s * 0.274, 1.115, -0.26], wr, 0.054, 7));                               // cuff
    m.add(body, 'skin', ball(0.045, s * 0.28, 1.055, -0.33, 1, 0.8, 1.2, 8, 5));                          // hand on the grip
  }
  // legs: thigh from the hip, shin from the knee, the shoe from the ankle. Pointing down at rest; the game bends them onto the pedals
  for (const [s, side] of [[1, 'R'], [-1, 'L']]) {
    const th = m.node('thigh_' + side, R, [s * 0.12, 1.07, 0.26]);
    m.add(th, 'trousers', ...limb([0, 0, 0], [0, -0.46, 0], 0.085, 0.062, 8));
    const sn = m.node('shin_' + side, th, [0, -0.46, 0]);
    m.add(sn, 'trousers', ...limb([0, 0, 0], [0, -0.42, 0], 0.06, 0.045, 7));
    m.add(sn, 'trousers', cyl(0.056, 0.05, 0.08, 7, 0, -0.38, 0));                                     // turn-up
    const ft = m.node('foot_' + side, sn, [0, -0.44, 0]);
    m.add(ft, 'shoe', place(lathe([[0.001, 0], [0.05, 0.01], [0.055, 0.12], [0.04, 0.2], [0.001, 0.22]], 7), 0, -0.03, 0.06, -Math.PI / 2, 0, 0, 0.95, 1, 0.65), box(0.09, 0.022, 0.25, 0, -0.058, -0.05));
  }
  // the head: no helmet, short messy dark hair, ears. The game keeps its face canvas in front of it
  const hd = m.node('head', R, [0, 1.92, 0.1]);
  m.add(hd, 'skin', ball(0.155, 0, 0, 0, 0.94, 1.08, 1.0, 14, 10), ball(0.035, 0.146, -0.01, 0.01, 0.5, 1, 0.8, 6, 4), ball(0.035, -0.146, -0.01, 0.01, 0.5, 1, 0.8, 6, 4), ball(0.03, 0, -0.03, -0.155, 1, 1.1, 1, 6, 4));
  const hair = new THREE.SphereGeometry(0.168, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.58); place(hair, 0, 0.018, 0.012, 0.32, 0, 0, 0.97, 1.05, 1.04);
  m.add(hd, 'hair', hair);
  const tufts = [[0.06, 0.15, -0.09], [-0.05, 0.16, -0.08], [0.0, 0.17, -0.11], [0.1, 0.12, 0.02], [-0.1, 0.13, 0.04], [0.03, 0.15, 0.08], [-0.04, 0.12, 0.13], [0.07, 0.09, 0.13]];
  for (const [x, y, z] of tufts) m.add(hd, 'hair', place(new THREE.ConeGeometry(0.045, 0.09, 5), x, y, z, -0.4 + z * 2, 0, -x * 4));
  return m.save();
}
if (import.meta.url === `file://${process.argv[1]}`) build();
