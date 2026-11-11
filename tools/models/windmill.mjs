// A stellingmolen as in concept A and D: brick base, thatched octagonal body, the stage (stelling) with its braces and
// railing, a wooden cap, the tail with its winch wheel, four lattice sails. Faces +z (the sails are on the +z side).
// Same size as the primitive mill it replaces: about 8.5 m to the cap, sails 5.4 m long on a hub at y 6.9.
// Moving node: sails (the game turns it about z). Window slots: small lit windows up the body.
import { Model, box, cyl, ball, rod, tube, place, lathe, THREE } from './lib.mjs';

export async function build() {
  const m = new Model('windmill'), R = m.root, mill = m.node('mill', R);
  const oct = (rt, rb, h, y) => { const g = new THREE.CylinderGeometry(rt, rb, h, 8, 1); g.rotateY(Math.PI / 8); g.translate(0, y + h / 2, 0); return g; };
  m.add(mill, 'brick', oct(2.05, 2.2, 2.7, 0));                                    // the brick base up to the stage
  m.add(mill, 'thatch', oct(1.25, 2.0, 4.6, 2.7));                                 // the thatched body
  m.add(mill, 'mill', oct(1.32, 1.32, 0.25, 7.25));                                // the cap ring
  // the cap: a boat-shaped wooden hood, ridge from front to back
  const cap = new THREE.Shape([[-1.35, 0], [1.35, 0], [1.2, 0.55], [0.6, 1.0], [-0.6, 1.0], [-1.2, 0.55]].map(([x, y]) => new THREE.Vector2(x, y)));
  const capG = new THREE.ExtrudeGeometry(cap, { depth: 3.0, bevelEnabled: false }); capG.translate(0, 7.5, -1.6);
  m.add(mill, 'roof', capG);
  m.add(mill, 'mill', rod([0, 6.9, 0.4], [0, 6.95, 1.75], 0.22, 8));               // the windshaft, out of the cap at the front
  // door and the stage door, dark wood
  m.add(mill, 'wood', box(0.8, 1.6, 0.1, 0, 0.8, 2.08), box(0.7, 1.3, 0.1, 0, 3.4, 1.72, -0.09, 0, 0));
  // the stage: an octagonal deck on beams, a railing, braces down to the base
  const deck = oct(2.95, 2.95, 0.14, 2.7);
  m.add(mill, 'wood', deck);
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2 + Math.PI / 8, c = Math.cos(a), s = Math.sin(a);
    m.add(mill, 'wood', rod([c * 2.85, 2.7, s * 2.85], [c * 1.95, 1.0, s * 1.95], 0.07, 4));               // brace
    m.add(mill, 'wood', rod([c * 2.85, 2.84, s * 2.85], [c * 2.85, 3.75, s * 2.85], 0.045, 4));            // railing post
    const a2 = a + Math.PI / 4, c2 = Math.cos(a2), s2 = Math.sin(a2);
    m.add(mill, 'wood', rod([c * 2.85, 3.72, s * 2.85], [c2 * 2.85, 3.72, s2 * 2.85], 0.03, 4), rod([c * 2.85, 3.25, s * 2.85], [c2 * 2.85, 3.25, s2 * 2.85], 0.02, 3));
  }
  // the tail: a long beam from the back of the cap down to the stage, struts, and the winch wheel at its foot
  m.add(mill, 'wood', rod([0, 7.6, -1.4], [0, 3.2, -4.0], 0.12, 5), rod([0.8, 7.4, -1.2], [0, 4.4, -3.3], 0.06, 4), rod([-0.8, 7.4, -1.2], [0, 4.4, -3.3], 0.06, 4));
  const wheel = new THREE.TorusGeometry(0.55, 0.05, 4, 14); place(wheel, 0, 3.6, -3.75, 0, Math.PI / 2, 0);
  m.add(mill, 'wood', wheel);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; m.add(mill, 'wood', rod([0, 3.6 + Math.sin(a) * 0.55, -3.75 + Math.cos(a) * 0.55], [0, 3.6 - Math.sin(a) * 0.55, -3.75 - Math.cos(a) * 0.55], 0.02, 3)); }
  // small windows up the body on the front and the sides
  for (const [y, a] of [[4.2, 0], [5.6, 0], [4.6, Math.PI / 2], [1.4, -Math.PI / 2], [6.3, -Math.PI / 2.4]]) {
    const r = y < 2.7 ? 2.12 : 2.0 - (y - 2.7) / 4.6 * 0.75 + 0.04;
    m.slot('window', mill, [Math.sin(a) * r, y, Math.cos(a) * r], 0.36, 0.5, [0, a, 0]);
  }
  // the sails: four stocks through the hub, a lattice of sail bars on the trailing side of each
  const sails = m.node('sails', R, [0, 6.95, 1.85]);
  m.add(sails, 'mill', cyl(0.3, 0.3, 0.3, 8, 0, 0, 0, Math.PI / 2, 0, 0));
  for (let i = 0; i < 4; i++) {
    const parts = [];
    parts.push(box(0.16, 10.8, 0.14, 0, 0, 0.1));                                               // the stock, both directions
    for (const side of [1]) {
      parts.push(box(0.07, 4.3, 0.07, side * 1.55, 3.25, 0.12));                                 // the outer edge bar
      parts.push(box(0.05, 4.3, 0.05, side * 0.8, 3.25, 0.12));
      for (let k = 0; k <= 13; k++) parts.push(box(1.6, 0.05, 0.05, side * 0.8, 1.1 + k * 0.32, 0.12));
    }
    for (const p of parts) p.rotateZ(i * Math.PI / 2);
    // only two stocks: each stock box spans both sails, so draw it on two of the four
    m.add(sails, 'wood', ...(i < 2 ? parts : parts.slice(1)));
  }
  return m.save();
}
if (import.meta.url === `file://${process.argv[1]}`) build();
