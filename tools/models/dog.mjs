// One of Santi's two dogs, a medium mutt that runs beside the bike. Faces -z. The game recolours the second dog.
// Moving nodes: body (bobs), leg_fl/fr/bl/br (swing about x at the shoulder or hip), head, tail.
import { Model, box, ball, rod, tube, place, limb, THREE } from './lib.mjs';

export async function build() {
  const m = new Model('dog'), R = m.root;
  const body = m.node('body', R, [0, 0.46, 0]);
  // a deep chest, a tucked waist, the back a little darker
  m.add(body, 'dog', ball(0.17, 0, 0, -0.17, 0.92, 1.08, 1.25, 10, 8), ball(0.15, 0, 0.01, 0.12, 0.85, 0.88, 1.35, 10, 8), rod([0, 0.0, -0.15], [0, 0.0, 0.16], 0.13, 8));
  m.add(body, 'dogDark', ball(0.12, 0, 0.09, 0.0, 0.85, 0.42, 2.2, 8, 5));
  m.add(body, 'dogPale', ball(0.1, 0, -0.08, -0.28, 0.85, 1.0, 0.7, 8, 5));
  m.add(body, 'dog', rod([0, 0.05, -0.27], [0, 0.17, -0.4], 0.085, 8, 0.07));   // the neck
  // head: skull, muzzle, a black nose, ears that flop, dark eyes
  const hd = m.node('head', body, [0, 0.2, -0.44]);
  m.add(hd, 'dog', ball(0.1, 0, 0.02, 0, 0.92, 0.9, 1.05, 10, 7));
  m.add(hd, 'dog', rod([0, -0.015, -0.05], [0, -0.03, -0.16], 0.06, 7, 0.045), ball(0.046, 0, -0.03, -0.16, 1, 0.9, 1, 7, 5));
  m.add(hd, 'dogPale', ball(0.04, 0, -0.06, -0.12, 0.9, 0.6, 1.3, 6, 4));   // the pale chin
  m.add(hd, 'nose', ball(0.024, 0, -0.012, -0.2, 1.2, 0.9, 1, 6, 4), ball(0.012, 0.045, 0.045, -0.085, 1, 1, 1, 5, 3), ball(0.012, -0.045, 0.045, -0.085, 1, 1, 1, 5, 3));
  for (const s of [-1, 1]) m.add(hd, 'dogDark', ball(0.06, s * 0.095, 0.0, 0.02, 0.35, 1.25, 0.8, 6, 5));   // soft ears, folded down
  // legs: upper and lower, a paw; the hind legs have the hock
  for (const [nm, x, y, z, hind] of [['leg_fl', 0.075, -0.04, -0.24, 0], ['leg_fr', -0.075, -0.04, -0.24, 0], ['leg_bl', 0.075, -0.02, 0.2, 1], ['leg_br', -0.075, -0.02, 0.2, 1]]) {
    const L = m.node(nm, body, [x, y, z]);
    const knee = hind ? [0, -0.2, -0.06] : [0, -0.22, 0.01], paw = hind ? [0, -0.42, 0.03] : [0, -0.43, -0.01];
    m.add(L, 'dog', ...limb([0, 0, 0], knee, hind ? 0.06 : 0.05, 0.035, 6), ...limb(knee, paw, 0.032, 0.028, 5));
    m.add(L, 'dog', ball(0.035, paw[0], paw[1] + 0.005, paw[2] - 0.02, 1, 0.6, 1.4, 6, 4));
  }
  const tail = m.node('tail', body, [0, 0.07, 0.31]);
  m.add(tail, 'dog', tube([[0, 0, 0], [0, 0.07, 0.08], [0, 0.16, 0.13], [0, 0.24, 0.12]], 0.025, 8, 5));
  m.add(tail, 'dog', ball(0.026, 0, 0.24, 0.12, 1, 1.4, 1, 5, 4));
  return m.save();
}
if (import.meta.url === `file://${process.argv[1]}`) build();
