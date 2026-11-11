// The cast's own shapes: smooth swept tubes and shells built once (sweepGeo, shellGeo, lathes), and the passengers: the dead
// who still want a lift, in a coloured coat with a pale calm face (ghostFigure).
import { pick, THREE } from './engine.js?v=42';
import { GlowMat, glowTex, Mat } from './materials.js?v=42';
import { PG, PM } from './props.js?v=42';
import { kadd, kit, kmerge, PK } from './kit.js?v=42';
import './signs.js?v=42';   // keeps the order the game's code runs in

// ---------- the cast's own shapes: smooth swept tubes and shells, built once and kept (PG) or copied into the kits ----------
// sweepGeo(rings, seg, o) runs a tube through ring centres [x, y, z, rx, rz, fwd]: rx across, rz toward fwd (o.fwd, default -z, the
// way the dead face). o.mod(t, th, j) scales a ring round its angle th (0 one side, PI/2 the front, PI the other side, 3PI/2 the back),
// o.drop(t, th, j) moves a ring point back along the tube (a torn hem), o.cap0 and o.cap1 round the ends off, o.arc [a0, a1] (or a
// function of t) leaves it open for cloth, o.dense (0 to 1) crowds a closed ring's points toward the front, o.uv(t, j) gives the
// texture spot, o.shade(v) darkens a vertex on the skin's ramp (0 to 1) and o.warp(v) moves every vertex last. Indexed and without a
// seam, so the normals come out smooth.
const _cT = new THREE.Vector3(), _cX = new THREE.Vector3(), _cF = new THREE.Vector3(), _cH = new THREE.Vector3(), _cV = new THREE.Vector3(), _cA = new THREE.Vector3(), _cB = new THREE.Vector3(), _cM = new THREE.Matrix4();
function sweepGeo(rings, seg, o = {}) {
  const n = rings.length, open = !!o.arc, cols = open ? seg + 1 : seg, pos = [], uv = [], idx = [], fw = o.fwd || [0, 0, -1];
  const tex = (t, j) => o.uv ? o.uv(t, j) : [j / seg, t];
  for (let i = 0; i < n; i++) {
    const r = rings[i], a = rings[Math.max(0, i - 1)], b = rings[Math.min(n - 1, i + 1)], t = i / Math.max(1, n - 1), arc = typeof o.arc === 'function' ? o.arc(t) : o.arc;
    _cT.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize(); if (i === 0) _cA.copy(_cT); if (i === n - 1) _cB.copy(_cT);
    _cH.fromArray(r[5] || fw); _cX.crossVectors(_cT, _cH).normalize(); _cF.crossVectors(_cX, _cT);
    for (let j = 0; j < cols; j++) {
      const ph = j / seg * Math.PI * 2, th = open ? arc[0] + (arc[1] - arc[0]) * j / seg : o.dense ? ph - o.dense * Math.sin(ph - Math.PI / 2) : ph, m = o.mod ? o.mod(t, th, j) : 1, d = o.drop ? o.drop(t, th, j) : 0;
      const c = Math.cos(th) * r[3] * m, s = Math.sin(th) * r[4] * m;
      pos.push(r[0] + _cX.x * c + _cF.x * s - _cT.x * d, r[1] + _cX.y * c + _cF.y * s - _cT.y * d, r[2] + _cX.z * c + _cF.z * s - _cT.z * d);
      uv.push(...tex(t, j));
    }
  }
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < seg; j++) { const a = i * cols + j, b = i * cols + (j + 1) % cols; idx.push(a, a + cols, b, b, a + cols, b + cols); }
  if (!open) [[0, o.cap0, _cA], [n - 1, o.cap1, _cB]].forEach(([e, len, T]) => {
    if (len == null) return; const r = rings[e], sg = e ? 1 : -1, p = pos.length / 3;
    pos.push(r[0] + T.x * len * sg, r[1] + T.y * len * sg, r[2] + T.z * len * sg); uv.push(...tex(e ? 1 : 0, 0));
    for (let j = 0; j < seg; j++) { const a = e * cols + j, b = e * cols + (j + 1) % cols; if (e) idx.push(p, b, a); else idx.push(p, a, b); }
  });
  for (let i = 0; i < pos.length; i += 3) {
    _cV.fromArray(pos, i);
    if (o.shade) uv[i / 3 * 2] = 0.25 + 0.5 * THREE.MathUtils.clamp(o.shade(_cV), 0, 1);
    if (o.warp) { o.warp(_cV); _cV.toArray(pos, i); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}
function shellGeo(rx, ry, rz, seg, nr, o = {}) {   // an ellipsoid: rings up its y axis and a pole at each end; o as for sweepGeo
  const rings = []; for (let i = 1; i <= nr; i++) { const ph = Math.PI * i / (nr + 1), s = Math.sin(ph); rings.push([0, -Math.cos(ph) * ry, 0, rx * s, rz * s]); }
  return sweepGeo(rings, seg, Object.assign({ cap0: ry + rings[0][1], cap1: ry - rings[nr - 1][1] }, o));
}
// rings along a chain of joints: segs is [[from, to, [[u, rx, rz, back], ...]], ...], u the share of the way from joint to joint
function limbRings(segs) { const out = []; for (const [a, b, list] of segs) for (const [u, rx, rz, dz] of list) out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u + (dz || 0), rx, rz || rx]); return out; }
// a few shapes merged into one geometry: add(geo, x, y, z, rx, ry, rz, sx, sy, sz) places one and disposes it
const _pk = { userData: {} };
function partsGeo(build) { const k = kit(); build((geo, x, y, z, rx, ry, rz, sx, sy, sz) => { kadd(k, geo, _pk, x || 0, y || 0, z || 0, rx, ry, rz, sx, sy, sz); geo.dispose(); }); return kmerge(k.get(_pk)); }
// turns a shape built round the origin onto three axes (its y along ay) at the point o
function orient(geo, o, ax, ay, az) { if (ax.clone().cross(ay).dot(az) < 0) ax = ax.clone().negate(); return geo.applyMatrix4(_cM.makeBasis(ax, ay, az).setPosition(o[0], o[1], o[2])); }
const _gs = (x, w) => Math.exp(-(x * x) / (w * w)), _ss = THREE.MathUtils.smoothstep, _lathe = pts => new THREE.LatheGeometry(pts.map(([r, h]) => new THREE.Vector2(r, h)), 18);

// the passengers: the dead who still want a lift. A person you can read from far off: a long coat in a colour, a pale calm face, hair
// or a hat, one arm up to flag you down, a cool glow round them. Every part is one shared geometry, so a figure is about ten meshes
const PASS_COATS = [0x3f6e8c, 0x8a4a3a, 0x9a7a3a, 0x4f6a48, 0x6a5280, 0x2f6a70];
// the coats share a two-texel ramp: u 0.25 is the coat's own colour, u 0.75 a darker shade of it for the belt, the buttons and the front edge
const PASS_COAT_TEX = (() => { const t = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255, 92, 92, 100, 255]), 2, 1); t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t; })();
const PASS_MAT = {
  skin: Mat({ color: 0x9ba5b5, emissive: 0x3a465e, emissiveIntensity: 0.2, transparent: true, opacity: 0.95 }),
  legs: Mat({ color: 0x262b34, transparent: true, opacity: 0.95 }),
  hair: Mat({ color: 0x2c2622, transparent: true, opacity: 0.95 }),
  coats: PASS_COATS.map(c => { const m = Mat({ color: c, emissive: c, emissiveIntensity: 0.3, map: PASS_COAT_TEX, emissiveMap: PASS_COAT_TEX, transparent: true, opacity: 0.95 }); m.userData.shared = true; return m; }),
  aura: (() => { const m = GlowMat(glowTex, 0x8fb0e0, 0.45, true); m.userData.shared = true; return m; })(),
  eye: new THREE.MeshBasicMaterial({ color: 0x252c3c }),   // the face: calm eyes, brows and a mouth
};
PASS_MAT.hairs = [PASS_MAT.hair].concat([0x5a4636, 0x8a8a8c, 0x17171b, 0x7a5a32].map(c => Mat({ color: c, transparent: true, opacity: 0.95 })));
// a long coat with shoulders, a belt and a turned-up collar, the left sleeve hanging beside it; seated, its skirt lies over the lap and the hand rests there
const P_COAT = [[0, 0.52, 0.02, 0.3, 0.25], [0, 0.7, 0.015, 0.275, 0.225], [0, 0.9, 0.01, 0.247, 0.197], [0, 1.06, 0.006, 0.222, 0.174], [0, 1.085, 0.005, 0.219, 0.171],
  [0, 1.145, 0.004, 0.217, 0.168], [0, 1.17, 0.003, 0.218, 0.168], [0, 1.32, 0, 0.226, 0.172], [0, 1.52, 0, 0.25, 0.172], [0, 1.66, -0.005, 0.272, 0.165], [0, 1.75, -0.01, 0.268, 0.15],
  [0, 1.81, -0.01, 0.215, 0.13], [0, 1.855, -0.005, 0.14, 0.116], [0, 1.94, -0.012, 0.126, 0.118]];
const coatMod = rings => (t, th) => { const y = rings[Math.round(t * (rings.length - 1))][1]; return 1 - 0.04 * _gs(Math.atan2(Math.cos(th), Math.sin(th)), 0.2) * _ss(-y, -1.06, -0.95) + 0.012 * _ss(y, 1.07, 1.085) * (1 - _ss(y, 1.145, 1.16)); };   // the skirt opens at the front; the belt stands out
const coatShade = p => Math.max(p.y > 1.075 && p.y < 1.155 ? 1 : 0, 0.55 * _gs(p.x, 0.03) * _ss(p.z, 0.05, 0.12) * _ss(-p.y, -1.78, -1.7));
function passCoat(seated) {
  return partsGeo(add => {
    const rings = seated ? [[0, 0.95, 0.03, 0.235, 0.19]].concat(P_COAT.filter(r => r[1] >= 1.06)) : P_COAT;
    add(sweepGeo(rings, 16, { fwd: [0, 0, 1], cap0: seated ? 0.05 : undefined, mod: coatMod(rings), shade: coatShade, dense: 0.4 }));
    for (const y of [1.27, 1.42, 1.57]) add(shellGeo(0.019, 0.019, 0.008, 6, 3, { uv: () => [0.75, 0.5] }), 0, y, 0.174);   // three buttons
    if (seated) add(sweepGeo([[0, 0.985, 0, 0.245, 0.105], [0, 0.975, 0.18, 0.24, 0.1], [0, 0.955, 0.38, 0.23, 0.095], [0, 0.93, 0.52, 0.215, 0.088]], 14, { fwd: [0, 1, 0], cap1: 0.06, uv: () => [0.25, 0.5] }));
    add(sweepGeo(seated ? [[-0.25, 1.75, -0.01, 0.076, 0.076], [-0.285, 1.6, 0.01, 0.073, 0.073], [-0.3, 1.42, 0.05, 0.068, 0.068], [-0.29, 1.3, 0.12, 0.064, 0.064], [-0.25, 1.2, 0.25, 0.063, 0.063], [-0.22, 1.15, 0.33, 0.067, 0.067], [-0.215, 1.145, 0.345, 0.06, 0.06]]
      : [[-0.25, 1.75, -0.01, 0.076, 0.076], [-0.285, 1.6, 0, 0.074, 0.074], [-0.305, 1.42, 0.012, 0.068, 0.068], [-0.31, 1.3, 0.025, 0.064, 0.064], [-0.315, 1.15, 0.045, 0.062, 0.062], [-0.318, 1.075, 0.056, 0.067, 0.067], [-0.318, 1.06, 0.058, 0.06, 0.06]], 10,
      { fwd: [0, 0, 1], cap0: 0.04, cap1: 0, uv: (t, j) => [t > 0.8 ? 0.6 : 0.25, 0.5] }));   // the cuff a shade darker
  });
}// a hand from the wrist (the origin) down along -y, the palm to +z, the thumb to the side th (+1 or -1): a mitten of fingers and a thumb
const passHand = th => partsGeo(add => {
  add(sweepGeo([[0, 0.01, 0, 0.03, 0.018], [0, -0.04, 0.002, 0.043, 0.02], [0, -0.088, 0.007, 0.046, 0.018], [0, -0.128, 0.016, 0.041, 0.015], [0, -0.152, 0.028, 0.031, 0.012]], 10, { fwd: [0, 0, 1], cap0: 0.01, cap1: 0.012 }));
  add(sweepGeo([[th * 0.028, -0.03, 0.008, 0.013, 0.012], [th * 0.05, -0.064, 0.022, 0.012, 0.011], [th * 0.055, -0.09, 0.036, 0.01, 0.009]], 6, { fwd: [0, 0, 1], cap0: 0.006, cap1: 0.009 }));
});
// the head round its middle, the face to +z: a calm oval with a chin, a hint of a nose and ears; nothing comes out past z 0.17,
// where an intro shot may lay a drawn face over it
const passHeadWarp = p => {
  const x = p.x, y = p.y, z = p.z, low = _ss(-y, 0.03, 0.15), fr = _ss(z, -0.02, 0.1);
  p.x *= 1 - 0.17 * low; p.z += 0.008 * _gs(y + 0.125, 0.03) * fr + 0.007 * _gs(x, 0.018) * _gs(y + 0.012, 0.03) * fr;
  for (const sx of [-1, 1]) { p.x += sx * 0.017 * _gs(x - sx * 0.142, 0.03) * _gs(y, 0.04) * _gs(z + 0.005, 0.03); p.z -= 0.006 * _gs(x - sx * 0.052, 0.022) * _gs(y - 0.022, 0.018) * fr; }
  if (z < 0) p.z *= 1 + 0.05 * _ss(-z, 0, 0.12);
};
// hair over the top and the back of the head; whatever would lie over the face sinks inside the head
const passHairWarp = p => {
  const x = p.x, y = p.y, z = p.z, line = z > 0 ? 0.075 - 0.07 * _ss(Math.abs(x), 0.03, 0.13) : -0.03 - 0.08 * _ss(-z, 0, 0.12);
  const face = _ss(z, -0.06, 0.02) * (1 - _ss(y, line - 0.02, line + 0.015)), k = Math.max(face, _ss(-y, 0.08, 0.12));
  p.multiplyScalar(1 - 0.2 * k); p.y += 0.008 * _ss(y, 0.08, 0.16);
};
Object.assign(PG, {
  pLimb: sweepGeo([[0, 0.4, 0, 0.082, 0.08], [0, 0.25, 0, 0.078, 0.076], [0, 0.05, 0, 0.068, 0.066], [0, -0.12, 0, 0.062, 0.062], [0, -0.3, 0.004, 0.064, 0.064], [0, -0.385, 0.016, 0.07, 0.078], [0, -0.418, 0.032, 0.072, 0.092]], 10, { fwd: [0, 0, 1], cap0: 0.035, cap1: 0.018 }),
  pArm: sweepGeo([[0, 0.37, 0, 0.076, 0.076], [0, 0.22, 0.004, 0.073, 0.073], [0, 0, 0.012, 0.067, 0.067], [0, -0.18, 0.016, 0.063, 0.063], [0, -0.33, 0.012, 0.062, 0.062], [0, -0.355, 0.008, 0.067, 0.067], [0, -0.37, 0.004, 0.06, 0.06]], 10, { fwd: [0, 0, 1], cap0: 0.04, cap1: 0, uv: t => [t > 0.8 ? 0.6 : 0.25, 0.5] }),
  pCoat: passCoat(false), pCoatSeat: passCoat(true), pHand: passHand(1), pHandL: passHand(-1),
  pHead: shellGeo(0.142, 0.162, 0.152, 16, 12, { fwd: [0, 0, 1], warp: passHeadWarp }),
  pHair: shellGeo(0.153, 0.172, 0.163, 16, 11, { fwd: [0, 0, 1], warp: passHairWarp }),
  pEye: partsGeo(add => {
    for (const s of [-1, 1]) { add(shellGeo(1, 1, 1, 8, 4), s * 0.052, 0.024, 0.132, 0, 0, s * -0.08, 0.02, 0.011, 0.008); add(shellGeo(1, 1, 1, 6, 3), s * 0.054, 0.062, 0.128, 0, 0, s * 0.1, 0.028, 0.0055, 0.006); }
    add(shellGeo(1, 1, 1, 6, 3), 0, -0.074, 0.134, 0, 0, 0, 0.026, 0.005, 0.006);
  }),
  pHat: partsGeo(add => {   // a soft hat: a rounded crown, a brim that dips at the front
    add(_lathe([[0.162, 0], [0.156, 0.05], [0.146, 0.11], [0.12, 0.14], [0.07, 0.148], [0.001, 0.15]]));
    add(_lathe([[0.155, -0.008], [0.25, -0.022], [0.276, -0.034], [0.282, -0.022], [0.25, -0.004], [0.155, 0.012]]), 0, 0, 0, 0.12);
  }),
  pBonnet: partsGeo(add => {   // the white cap of the sheet's woman: round over the hair, its two wings turned up at the sides
    add(shellGeo(0.168, 0.185, 0.178, 16, 10, { fwd: [0, 0, 1], warp: p => p.multiplyScalar(1 - 0.24 * _ss(p.z, 0, 0.08) * (1 - _ss(p.y, 0.02, 0.08))) }));
    for (const s of [-1, 1]) add(shellGeo(1, 1, 1, 8, 4), s * 0.19, 0.02, 0, 0.2, 0, s * 0.55, 0.075, 0.042, 0.016);
  }),
  pHelmet: shellGeo(0.168, 0.15, 0.188, 16, 9, { fwd: [0, 0, 1], mod: (t, th) => 1 + 0.035 * Math.max(0, Math.cos(th * 6)) * _ss(t, 0.45, 0.8), warp: p => { if (p.y < 0) p.multiplyScalar(1 - 0.22 * _ss(-p.y, 0, 0.04)); if (p.z > 0.14 && p.y > -0.02 && p.y < 0.04) p.z += 0.02; } }),
  pCheese: _lathe([[0.001, -0.1], [0.24, -0.1], [0.27, -0.088], [0.282, -0.05], [0.282, 0.05], [0.27, 0.088], [0.24, 0.1], [0.001, 0.1]]),
  pClogs: partsGeo(add => { for (const s of [-1, 1]) add(sweepGeo([[s * 0.1, 0.05, -0.11, 0.05, 0.048], [s * 0.1, 0.058, -0.03, 0.062, 0.058], [s * 0.1, 0.052, 0.08, 0.056, 0.05], [s * 0.1, 0.048, 0.15, 0.04, 0.036], [s * 0.1, 0.07, 0.205, 0.016, 0.016]], 10, { fwd: [0, 1, 0], cap0: 0.03, cap1: 0.012 })); }),
  pPhone: new THREE.PlaneGeometry(0.13, 0.22),
  pGolf: partsGeo(add => { add(sweepGeo([[0, 0.02, 0, 0.02, 0.02], [0, -0.12, 0.004, 0.012, 0.012], [0, -0.9, 0.05, 0.008, 0.008]], 6, { fwd: [0, 0, 1], cap0: 0.01, cap1: 0.004 })); add(shellGeo(0.03, 0.022, 0.06, 8, 4), 0, -0.93, 0.09, 0.2); }),
});
function ghostFigure(own, variant, seated, coat) {
  const g = new THREE.Group();
  // own: the figure's own materials, so it can fade (set down) or dim (on the rack) alone, its hat and clogs with it
  const mk = (m, fade) => { if (!own) return m; const c = m.clone(); if (fade && !c.transparent) { c.transparent = true; c.opacity = 0.95; } return c; };
  const v = variant || pick(['plain', 'plain', 'hat', 'bonnet', 'cheese', 'clogs', 'helmet', 'phone', 'golf']);
  const ci = coat != null ? coat : Math.floor(Math.random() * PASS_COATS.length);
  g.userData.variant = v; g.userData.coat = ci;
  const skin = mk(PASS_MAT.skin), hands = own ? mk(PASS_MAT.skin) : skin, legs = mk(PASS_MAT.legs), hair = mk(PASS_MAT.hairs[(ci * 3 + v.length) % PASS_MAT.hairs.length]), cm = mk(PASS_MAT.coats[ci]);
  const add = (geo, mat, x, y, z, rx, rz, sx, sy, sz, to) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (rx) m.rotation.x = rx; if (rz) m.rotation.z = rz; if (sx) m.scale.set(sx, sy, sz); (to || g).add(m); return m; };
  for (const sx of [-1, 1]) {
    if (seated) { add(PG.pLimb, legs, sx * 0.1, 0.92, 0.3, Math.PI / 2, 0, 1, 0.55, 1); add(PG.pLimb, legs, sx * 0.1, 0.62, 0.55, 0.15, 0, 1, 0.5, 1); }
    else add(PG.pLimb, legs, sx * 0.1, 0.5, 0, 0, sx * 0.03);
  }
  add(seated ? PG.pCoatSeat : PG.pCoat, cm, 0, 0, 0);
  add(PG.pHead, skin, 0, 2.04, 0.02); if (v !== 'bonnet' && v !== 'helmet' && v !== 'hat') add(PG.pHair, hair, 0, 2.04, 0.02);
  add(PG.pEye, mk(PASS_MAT.eye, true), 0, 2.04, 0.02);
  // the right arm is its own mesh with the hand on it: up to flag you down (the phone in that hand lands where intro shot 5 expects it), or resting forward on the lap
  const arm = seated ? add(PG.pArm, cm, 0.27, 1.44, 0.12, -0.42, -0.08) : add(PG.pArm, cm, 0.34, 1.99, 0.05, 0.15, Math.PI - 0.25);
  add(PG.pHand, hands, 0, -0.37, 0.004, 0, 0, 0, 0, 0, arm);
  const lh = seated ? add(PG.pHandL, hands, -0.215, 1.15, 0.35, -1.25) : add(PG.pHandL, hands, -0.318, 1.06, 0.058, 0.05, 0.04);
  lh.rotation.y = seated ? Math.PI : Math.PI / 2;
  if (!seated) { const au = new THREE.Sprite(mk(PASS_MAT.aura)); au.scale.set(2.0, 3.0, 1); au.position.y = 1.35; g.add(au); }
  if (v === 'hat') add(PG.pHat, mk(PM.orange, true), 0, 2.13, 0, -0.1);
  if (v === 'bonnet') add(PG.pBonnet, mk(PK.linen, true), 0, 2.05, 0, -0.12);
  if (v === 'helmet') add(PG.pHelmet, mk(PK.linen, true), 0, 2.1, 0.01, -0.1);
  if (v === 'cheese') { if (seated) add(PG.pCheese, mk(PM.cheese, true), 0, 1.12, 0.36, 0, 0, 0.8, 0.8, 0.8); else add(PG.pCheese, mk(PM.cheese, true), -0.47, 1.3, 0.1, 0, Math.PI / 2); }
  if (v === 'clogs') add(PG.pClogs, mk(PM.cheese, true), 0, seated ? 0.36 : 0, seated ? 0.56 : 0.03);
  if (v === 'phone') add(PG.pPhone, mk(PK.phone, true), 0, -0.48, 0.07, -0.25, 0, 0, 0, 0, arm);   // in the raised hand, its screen to you
  if (v === 'golf') { if (seated) add(PG.pGolf, mk(PM.silver, true), -0.21, 1.1, 0.42, -0.9, -0.15); else add(PG.pGolf, mk(PM.silver, true), -0.33, 0.97, 0.1, 0.05, -0.08); }
  g.userData.faceRoad = true; g.userData.ghost = true;
  return g;
}

export { _gs, _lathe, _ss, ghostFigure, limbRings, orient, partsGeo, shellGeo, sweepGeo };
