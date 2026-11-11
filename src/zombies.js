// The dead and what else stands in the road: the zombies in their variants (shapes, rags, pools, level of detail), the
// zombie on a bike, fences, carts, puddles, the wisps that fill the lamp, the road arrows and the halos of the first-ride
// teaching forks.
import { pick, rnd, THREE } from './engine.js?v=42';
import { camera } from './render.js?v=42';
import { GlowMat, glowTex, M, Mat } from './materials.js?v=42';
import { PG, PM, streakTex } from './props.js?v=42';
import { kadd, kb, KG, kit, kmerge, PK } from './kit.js?v=42';
import { T3, TOWN3D } from './furniture.js?v=42';
import { bikeProp } from './houses.js?v=42';
import { townKit } from './scenery.js?v=42';
import { G } from './signs.js?v=42';
import { _gs, _lathe, _ss, limbRings, orient, partsGeo, shellGeo, sweepGeo } from './cast.js?v=42';

// ---------- the dead: the sheet's shape, tall and thin, knees bent, the back bowed forward, a small head pushed out in front, long arms
// dangling to the knees, eyes glowing yellow. The joints stay where every town's dress expects them (hip, sh, hd, and knee, foot,
// elbow and hand); between them it is swept and smooth: ribs, a knobbed spine, shoulder blades, bony knees and elbows, long-fingered
// hands, a skull with deep sockets. Each variant is merged once into a few shared geometries (kept in PG so cleanup leaves them).
// The skin takes a two-texel ramp: a vertex's u runs from 0.25 (its own colour) to 0.75 (near black), so the sockets and the open mouth
// go dark inside the one skin mesh while every spawn keeps its own skin colour
const DEAD_SKIN_TEX = (() => { const t = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255, 30, 27, 29, 255]), 2, 1); t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t; })();
for (const m of PK.skin) { m.map = DEAD_SKIN_TEX; m.userData.shared = true; }
const SKIN_UV = () => [0.25, 0.5];
// their rags: a palette with a column per cloth, darker toward the torn hem. Three palettes, so a crowd is not dressed alike: a spawn
// takes one at no extra draw call
const RAG_W = 6;
function ragTex(cols) {
  const d = new Uint8Array(RAG_W * 16);
  cols.forEach((hex, c) => [0.42, 0.66, 0.88, 1].forEach((k, row) => { const i = (row * RAG_W + c) * 4; d[i] = (hex >> 16 & 255) * k; d[i + 1] = (hex >> 8 & 255) * k; d[i + 2] = (hex & 255) * k; d[i + 3] = 255; }));
  const t = new THREE.DataTexture(d, RAG_W, 4); t.magFilter = t.minFilter = THREE.LinearFilter; t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; return t;
}
const DEAD_RAGS = [   // three shirts, two trousers, the strips
  [0x35302a, 0x30332d, 0x3b332b, 0x201f1d, 0x262422, 0x221e1b],
  [0x2a2f38, 0x353533, 0x302b25, 0x1b1d22, 0x23211e, 0x1e2024],
  [0x3a2a24, 0x34332b, 0x30282d, 0x24211e, 0x1f2022, 0x261e1a],
].map(p => { const m = Mat({ map: ragTex(p) }); m.userData.shared = true; return m; });
const ragUV = (col, v0, v1) => t => [(col + 0.5) / RAG_W, 0.125 + 0.75 * (v0 + (v1 - v0) * t)];
// the torso along the bowed back, t from the hip (0) to the shoulders (1): across, front to back, the chest pushed forward of the spine
const TORSO = [[-0.09, 0.1, 0.072, 0], [-0.02, 0.13, 0.09, 0], [0.08, 0.122, 0.085, -0.004], [0.18, 0.104, 0.073, -0.012], [0.28, 0.108, 0.077, -0.008],
  [0.38, 0.128, 0.092, 0.006], [0.48, 0.143, 0.102, 0.014], [0.58, 0.15, 0.108, 0.018], [0.68, 0.151, 0.108, 0.018], [0.78, 0.146, 0.104, 0.014],
  [0.87, 0.134, 0.096, 0.008], [0.95, 0.116, 0.086, 0], [1.02, 0.09, 0.072, -0.006]];
const BACK = 1.5 * Math.PI, _ang = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
function torsoMod(t, th) {   // the belly sunk under the ribs, the hip bones, the shoulder blades and the spine standing out
  const s = Math.sin(th), c = Math.cos(th);
  return 1 - 0.14 * (s > 0 ? s * s : 0) * _gs(t - 0.22, 0.1) + 0.1 * c * c * _gs(t + 0.01, 0.07)
    + 0.08 * (_gs(_ang(th, BACK - 0.62), 0.36) + _gs(_ang(th, BACK + 0.62), 0.36)) * _gs(t - 0.8, 0.12) + 0.045 * _gs(_ang(th, BACK), 0.3) * _gs(t - 0.6, 0.4);
}
function deadJoints(crawl) {   // the points the body and the clothes hang from, the same ones the towns' dresses use
  const hip = crawl ? [0, 0.72, 0.1] : [0, 1.0, 0.04], sh = crawl ? [0, 0.86, -0.64] : [0, 1.62, -0.36], hd = crawl ? [0, 0.9, -0.94] : [0, 1.68, -0.64];
  const side = sx => { const hx = sx * 0.11, shx = sx * 0.25; return { sx, hipJ: [hx, hip[1], hip[2]], shJ: [shx, sh[1], sh[2]],
    knee: crawl ? [hx * 1.2, 0.32, -0.16] : [hx * 1.1, 0.53, -0.1], foot: crawl ? [hx * 1.2, 0.06, 0.32] : [hx * 1.15, 0.07, 0.06],
    elbow: crawl ? [shx * 1.1, 0.46, -0.76] : [shx * 1.12, 1.16, -0.48], hand: crawl ? [shx, 0.06, -1.0] : [shx * 1.05, 0.7, -0.6] }; };
  const V = a => new THREE.Vector3(...a), H = V(hip), S = V(sh), Dn = S.clone().sub(H).normalize(), Fr = new THREE.Vector3(0, 0, -1).addScaledVector(Dn, Dn.z).normalize();
  const C = H.clone().add(S).multiplyScalar(0.5).addScaledVector(Fr, -0.07), hC = C.clone().sub(H), sC = S.clone().sub(C);
  const spine = t => t < 0 ? H.clone().addScaledVector(hC, 2 * t) : t > 1 ? S.clone().addScaledVector(sC, 2 * (t - 1)) : H.clone().multiplyScalar((1 - t) * (1 - t)).addScaledVector(C, 2 * t * (1 - t)).addScaledVector(S, t * t);
  const tang = t => { const u = THREE.MathUtils.clamp(t, 0, 1); return hC.clone().multiplyScalar(2 * (1 - u)).addScaledVector(sC, 2 * u).normalize(); };
  const prof = t => { let i = 0; while (i < TORSO.length - 2 && TORSO[i + 1][0] < t) i++; const a = TORSO[i], b = TORSO[i + 1], k = THREE.MathUtils.clamp((t - a[0]) / (b[0] - a[0]), 0, 1); return [1, 2, 3].map(q => a[q] + (b[q] - a[q]) * k); };
  const centre = t => spine(t).addScaledVector(Fr, prof(t)[2]);
  // a point on the torso (out 1) or off it, at t round the angle th
  const surf = (t, th, out = 1) => { const T = tang(t), X = T.clone().cross(Fr).normalize(), F = X.clone().cross(T), [rx, rz] = prof(t), m = torsoMod(t, th) * out; return centre(t).addScaledVector(X, Math.cos(th) * rx * m).addScaledVector(F, Math.sin(th) * rz * m); };
  const ring = (t, s, add) => { const c = centre(t), [rx, rz] = prof(t); return [c.x, c.y, c.z, rx * s + add, rz * s + add]; };
  return { crawl, hip, sh, hd, H, S, Dn, Fr, prof, centre, surf, ring, L: side(-1), R: side(1) };
}
// the skull round its middle, the face to -z: a heavy brow over deep sockets, sharp cheekbones over hollow cheeks, a long jaw, the mouth a little open
const SKULL = [   // centre, width, push
  [0.04, 0.016, -0.106, 0.032, 0, 0, 0.038], [-0.04, 0.016, -0.106, 0.032, 0, 0, 0.038],                                // the sockets
  [0.042, 0.054, -0.104, 0.028, 0.004, 0.004, -0.012], [-0.042, 0.054, -0.104, 0.028, -0.004, 0.004, -0.012], [0, 0.05, -0.112, 0.02, 0, 0, -0.006],   // the brow
  [0.066, -0.014, -0.08, 0.022, 0.012, 0, -0.008], [-0.066, -0.014, -0.08, 0.022, -0.012, 0, -0.008],                   // the cheekbones
  [0.066, -0.062, -0.06, 0.028, -0.022, 0, 0.004], [-0.066, -0.062, -0.06, 0.028, 0.022, 0, 0.004],                     // the hollow cheeks
  [0.092, 0.03, -0.035, 0.028, -0.01, 0, 0], [-0.092, 0.03, -0.035, 0.028, 0.01, 0, 0],                                 // the temples
  [0, -0.026, -0.11, 0.016, 0, 0, 0.016], [0, 0.006, -0.118, 0.012, 0, 0, -0.004],                                     // the nose: a hole under a ridge
  [0.014, -0.082, -0.096, 0.02, 0, 0, 0.016], [-0.014, -0.082, -0.096, 0.02, 0, 0, 0.016],                             // the open mouth
  [0.062, -0.1, -0.03, 0.03, 0.014, -0.006, 0], [-0.062, -0.1, -0.03, 0.03, -0.014, -0.006, 0],                        // the corners of the jaw
  [0, -0.122, -0.074, 0.03, 0, -0.016, -0.014], [0, 0.01, 0.11, 0.06, 0, 0, 0.016],                                    // the chin, the back of the skull
];function skullWarp(p) {
  const x = p.x, y = p.y, z = p.z; let dx = 0, dy = 0, dz = 0;
  for (const [cx, cy, cz, w, px, py, pz] of SKULL) { const k = Math.exp(-((x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2) / (w * w)); dx += px * k; dy += py * k; dz += pz * k; }
  const low = _ss(-y, 0.02, 0.11) * _ss(-z, -0.02, 0.07); p.set(x * (1 - 0.3 * low) + dx, y - 0.012 * low + dy, z * (z > 0 ? 1.06 : 1) + dz);
}
function skullShade(p) {   // dark in the sockets, the nose, the mouth, a little in the hollow cheeks
  const g = (cx, cy, cz, w) => Math.exp(-((p.x - cx) ** 2 + (p.y - cy) ** 2 + (p.z - cz) ** 2) / (w * w));
  return 1.6 * (g(0.04, 0.016, -0.104, 0.028) + g(-0.04, 0.016, -0.104, 0.028)) + 1.3 * g(0, -0.026, -0.11, 0.015) + 1.4 * (g(0.013, -0.082, -0.098, 0.019) + g(-0.013, -0.082, -0.098, 0.019))
    + 0.35 * (g(0.066, -0.062, -0.065, 0.03) + g(-0.066, -0.062, -0.065, 0.03)) - 0.15;
}// a long bony hand from the wrist L.hand along d, the palm to n, the thumb to w: a narrow palm, four long fingers curling in, a thumb.
// Far off it is one curled mitten
function deadHand(L, d, n, w, far) {
  w = w.clone().addScaledVector(d, -d.dot(w)).normalize(); n = n.clone().addScaledVector(d, -d.dot(n)).addScaledVector(w, -w.dot(n)).normalize();
  const W = new THREE.Vector3(...L.hand), at = (p, a, b, c) => p.clone().addScaledVector(d, a).addScaledVector(w, b).addScaledVector(n, c), nf = n.toArray();
  if (far) return sweepGeo([[0, 0, 0, 0.022, 0.016], [0.05, 0, 0, 0.036, 0.014], [0.12, 0, 0.015, 0.03, 0.011], [0.17, 0, 0.045, 0.014, 0.008]].map(([a, b, c, r1, r2]) => { const p = at(W, a, b, c); return [p.x, p.y, p.z, r1, r2]; }), 4, { fwd: nf, uv: SKIN_UV, cap1: 0.01 });
  return partsGeo(add => {
    add(orient(shellGeo(0.036, 0.05, 0.014, 5, 4, { uv: SKIN_UV }), at(W, 0.046, 0, 0).toArray(), w, d, n));
    [[0.024, 0.105], [0.008, 0.118], [-0.008, 0.11], [-0.023, 0.088]].forEach(([o, len]) => {
      let p = at(W, 0.088, o, 0), dir = d.clone().addScaledVector(w, o * 1.2).normalize(); const pts = [[p.x, p.y, p.z, 0.0095, 0.0085]];
      [[0.55, 0.42, 0.0078], [0.45, 0.55, 0.0058]].forEach(([f, bend, r]) => { p = p.clone().addScaledVector(dir, len * f); pts.push([p.x, p.y, p.z, r, r * 0.9]); dir = dir.multiplyScalar(Math.cos(bend)).addScaledVector(n, Math.sin(bend)).normalize(); });
      add(sweepGeo(pts, 4, { fwd: nf, uv: SKIN_UV, cap0: 0.005, cap1: 0.006 }));
    });
    const t0 = at(W, 0.028, 0.03, 0.006), t1 = at(t0, 0.03, 0.022, 0.012), t2 = at(t1, 0.026, 0.012, 0.016);
    add(sweepGeo([t0, t1, t2].map((p, i) => [p.x, p.y, p.z, 0.0105 - i * 0.0018, 0.0095 - i * 0.0015]), 4, { fwd: nf, uv: SKIN_UV, cap0: 0.006, cap1: 0.006 }));
  });
}
function deadFoot(L, crawl, far) {   // a bony foot from the heel to long toes; the crawler's lie out behind him
  const [x, , z] = L.foot, sx = L.sx, pts = crawl ? [[x, 0.075, z - 0.03, 0.03, 0.026], [x, 0.055, z + 0.04, 0.036, 0.03], [x, 0.035, z + 0.11, 0.04, 0.022], [x, 0.022, z + 0.17, 0.036, 0.014]]
    : [[x, 0.04, z + 0.035, 0.03, 0.026], [x, 0.055, z - 0.02, 0.036, 0.034], [x + sx * 0.004, 0.042, z - 0.09, 0.042, 0.025], [x + sx * 0.008, 0.027, z - 0.155, 0.042, 0.017], [x + sx * 0.01, 0.02, z - 0.19, 0.034, 0.013]];
  return sweepGeo(far ? [pts[0], pts[2], pts[pts.length - 1]] : pts, far ? 4 : 6, { fwd: [0, 1, 0], uv: SKIN_UV, cap0: 0.022, cap1: 0.014 });
}
// the shared body, built once per posture and per distance: the skin as one geometry and the eyes as another. The far one (seen from
// beyond DEAD_FAR) keeps the silhouette and the face and drops the ribs, the knobs and the fingers
const DEAD_BODY = {}, DEAD_FAR = 12;
function deadBody(crawl, far) {
  const key = (crawl ? 'c' : 's') + (far ? 'f' : 'n'); if (DEAD_BODY[key]) return DEAD_BODY[key];
  const J = deadJoints(crawl), { hd, sh, Fr, Dn } = J, k = kit(), SK = { userData: {} }, EY = { userData: {} }, V = (x, y, z) => new THREE.Vector3(x, y, z), fr = Fr.toArray(), dn = Dn.toArray();
  const put = (geo, x, y, z, rx, ry, rz, sx, sy, sz, key) => { kadd(k, geo, key || SK, x || 0, y || 0, z || 0, rx, ry, rz, sx, sy, sz); geo.dispose(); };
  const skin = (rings, seg, o) => sweepGeo(rings, seg, Object.assign({ uv: SKIN_UV }, o)), blob = (rx, ry, rz, seg, nr) => shellGeo(rx, ry, rz, seg, nr, { uv: SKIN_UV });
  // the torso with its ribs, and the knobs of the spine down the hunched back
  const TT = far ? TORSO.filter((r, i) => i % 2 === 0) : TORSO;
  put(skin(TT.map(([t]) => J.ring(t, 1, 0)), far ? 10 : 16, { fwd: fr, cap0: 0.045, cap1: 0.035, mod: (u, th) => torsoMod(TT[Math.round(u * (TT.length - 1))][0], th) }));
  if (!far) {
    for (const sx of [-1, 1]) for (const [t0, a1] of [[0.5, 1.2], [0.62, 1.34], [0.74, 1.24]]) {
      const pts = []; for (let q = 0; q <= 3; q++) { const u = q / 3, p = J.surf(t0 - 0.07 * (1 - u), Math.PI / 2 + sx * (0.24 + a1 * u)); pts.push([p.x, p.y, p.z, 0.0115, 0.0095]); }
      put(skin(pts, 4, { fwd: dn, cap0: 0.006, cap1: 0.006 }));
    }
    for (const t of [0.62, 0.74, 0.85, 0.95]) { const p = J.surf(t, BACK, 0.97); put(blob(0.017, 0.013, 0.015, 5, 3), p.x, p.y, p.z); }
  }
  // the shoulders: a bony yoke from one to the other over the top of the back, the collarbones in front
  put(skin([-1, -0.6, 0, 0.6, 1].map(u => { const a = Math.abs(u); return [u * 0.25, sh[1] + 0.045 * (1 - a * a) + 0.004, sh[2] + 0.025 * (1 - a), 0.05 + 0.008 * (1 - a), 0.052 + 0.016 * (1 - a)]; }), far ? 6 : 10, { fwd: fr, cap0: 0.028, cap1: 0.028 }));
  if (!far) for (const sx of [-1, 1]) { const a = V(sx * 0.03, sh[1] - 0.012, sh[2]).addScaledVector(Fr, 0.07), b = V(sx * 0.21, sh[1] + 0.012, sh[2]).addScaledVector(Fr, 0.032), m = a.clone().lerp(b, 0.5).addScaledVector(Fr, 0.012); put(skin([a, m, b].map(p => [p.x, p.y, p.z, 0.011, 0.011]), 4, { fwd: dn, cap0: 0.008, cap1: 0.008 })); }
  // the neck rises off the hunched back and runs forward into the skull, the knob at its foot
  const N0 = J.S.clone().addScaledVector(Fr, -0.03).addScaledVector(Dn, 0.005), N2 = V(hd[0], hd[1] - 0.055, hd[2] + 0.065), N1 = N0.clone().lerp(N2, 0.5).addScaledVector(Fr, -0.045), neck = [], nq = far ? 3 : 5;
  for (let q = 0; q <= nq; q++) { const u = q / nq, p = N0.clone().multiplyScalar((1 - u) * (1 - u)).addScaledVector(N1, 2 * u * (1 - u)).addScaledVector(N2, u * u), r = 0.047 - 0.011 * u; neck.push([p.x, p.y, p.z, r, r * 0.94]); }
  put(skin(neck, far ? 6 : 8, { fwd: [0, -1, 0], cap0: 0.02, cap1: 0.02 }));
  if (!far) { const c7 = N0.clone().addScaledVector(Fr, -0.04); put(blob(0.022, 0.018, 0.02, 6, 3), c7.x, c7.y, c7.z); }
  put(shellGeo(0.098, 0.12, 0.112, far ? 10 : 20, far ? 7 : 15, { shade: skullShade, warp: skullWarp, dense: far ? 0.4 : 0.55 }), hd[0], hd[1], hd[2]);
  for (const sx of [-1, 1]) put(shellGeo(0.016, 0.011, 0.01, far ? 4 : 6, far ? 2 : 3), hd[0] + sx * 0.04, hd[1] + 0.017, hd[2] - 0.082, 0, 0, sx * 0.3, 1, 1, 1, EY);
  // long thin arms and legs with knobs at the elbows and knees, the hands hanging at the knees
  for (const L of [J.L, J.R]) {
    const sx = L.sx;
    put(skin(limbRings(far ? [[L.shJ, L.elbow, [[0, 0.05], [0.5, 0.04]]], [L.elbow, L.hand, [[0, 0.036], [0.5, 0.031], [1, 0.021, 0.026]]]]
      : [[L.shJ, L.elbow, [[0, 0.05], [0.22, 0.043], [0.55, 0.038], [0.85, 0.032]]], [L.elbow, L.hand, [[0, 0.036], [0.15, 0.037], [0.45, 0.032], [0.78, 0.026], [1, 0.021, 0.026]]]]), far ? 5 : 7, { cap0: 0.03, cap1: 0.008 }));
    put(skin(limbRings(far ? [[L.hipJ, L.knee, [[0, 0.07], [0.5, 0.057]]], [L.knee, L.foot, [[0, 0.05], [0.4, 0.045], [1, 0.032]]]]
      : [[L.hipJ, L.knee, [[0, 0.07], [0.2, 0.066], [0.5, 0.057], [0.82, 0.046]]], [L.knee, L.foot, [[0, 0.05], [0.15, 0.045], [0.38, 0.046, 0.05, 0.006], [0.68, 0.037], [1, 0.032]]]]), far ? 5 : 7, { cap0: 0.02, cap1: 0.01 }));
    if (!far) {
      const el = V(...L.elbow).add(V(0, 0.012, 0.03)); put(blob(0.026, 0.03, 0.022, 5, 3), el.x, el.y, el.z);
      const kp = V(...L.knee).add(crawl ? V(0, -0.035, -0.03) : V(0, 0.012, -0.044)); put(blob(0.032, 0.036, 0.021, 5, 3), kp.x, kp.y, kp.z, crawl ? 1.0 : 0.25);
    }
    put(crawl ? deadHand(L, V(0, -0.25, -1).normalize(), V(0, -1, 0), V(-sx, 0, 0), far) : deadHand(L, V(...L.hand).sub(V(...L.elbow)).normalize(), V(-sx, 0, 0), V(0, 0, -1), far));
    put(deadFoot(L, crawl, far));
  }
  return (DEAD_BODY[key] = { J, skin: kmerge(k.get(SK)), eyes: kmerge(k.get(EY)) });
}

// the shared costumes' smooth parts: the bucket hat, the bonnet with its wings, the long skirt with a hem that is coming apart
Object.assign(PG, {
  zHat: partsGeo(add => {
    add(_lathe([[0.15, -0.06], [0.146, -0.02], [0.138, 0.035], [0.112, 0.064], [0.06, 0.074], [0.001, 0.075]]));
    add(_lathe([[0.15, -0.068], [0.19, -0.082], [0.232, -0.1], [0.244, -0.104], [0.236, -0.092], [0.2, -0.074], [0.15, -0.062]]));
  }),
  zBonnet: partsGeo(add => {
    add(_lathe([[0.168, 0], [0.165, 0.05], [0.15, 0.11], [0.118, 0.158], [0.07, 0.186], [0.001, 0.194]]));
    for (const s of [-1, 1]) add(shellGeo(0.026, 0.05, 0.01, 8, 4), s * 0.17, -0.03, 0.01, 0, 0, s * 0.62);
  }),
  zSkirt: _lathe([[0.001, -0.5], [0.43, -0.5], [0.44, -0.49], [0.41, -0.4], [0.34, -0.14], [0.27, 0.14], [0.215, 0.38], [0.19, 0.5], [0.001, 0.5]]),
});// the rags of the shared variants: a shirt hanging open over the ribs with torn short sleeves, ragged trousers cut off above the knee,
// strips of cloth hanging from the hems. A town's own dead wear its dress instead. Merged into the variant with the rag material
function deadRags(k, J, v, mat, far) {
  let h = 7; for (const ch of v) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const shirt = h % 3, trou = 3 + (h >> 4) % 2, hr = i => { const s = Math.sin(h % 997 + i * 12.9898) * 43758.5453; return s - Math.floor(s); };
  const put = geo => { kadd(k, geo, mat, 0, 0, 0); geo.dispose(); }, fr = J.Fr.toArray(), sh = J.sh, V = (x, y, z) => new THREE.Vector3(x, y, z);
  const ST = far ? [0.03, 0.3, 0.6, 0.86, 1.02] : [0.03, 0.16, 0.3, 0.45, 0.6, 0.74, 0.86, 0.95, 1.02];
  put(sweepGeo(ST.map(t => J.ring(t, 1.05, 0.01)), far ? 10 : 16, { fwd: fr, uv: ragUV(shirt, 0, 1), arc: t => { const q = Math.round(t * 8), o = 0.5 + 0.42 * (1 - t) + (far ? 0 : 0.2 * hr(q + 30) - 0.06), p = far ? 0 : 0.2 * hr(q + 31) - 0.06; return [Math.PI / 2 + o, Math.PI * 2.5 - p - 0.5 - 0.42 * (1 - t)]; },
    mod: (u, th, j) => (0.5 + 0.5 * torsoMod(ST[Math.round(u * (ST.length - 1))], th)) * (0.97 + 0.07 * hr(j * 9 + Math.round(u * 8))), drop: (u, th, j) => u === 0 ? (j % 2 ? 0.025 : 0.06) + hr(j) * 0.07 : 0 }));
  put(sweepGeo([-1, -0.6, 0, 0.6, 1].map(u => { const a = Math.abs(u); return [u * 0.255, sh[1] + 0.045 * (1 - a * a) + 0.006, sh[2] + 0.025 * (1 - a), 0.056 + 0.008 * (1 - a), 0.058 + 0.016 * (1 - a)]; }), far ? 6 : 8, { fwd: fr, cap0: 0.024, cap1: 0.024, uv: ragUV(shirt, 0.7, 0.7) }));
  const strip = (p, out, w, len, col) => {   // a strip of cloth hanging from p, both faces
    const up = V(0, 1, 0), ac = V(0, 0, 0).crossVectors(up, out).normalize(), at = (a, b, c) => p.clone().addScaledVector(ac, a).addScaledVector(up, b).addScaledVector(out, c);
    const q = [at(-w / 2, 0.012, 0), at(w / 2, 0.012, 0), at(-w * 0.42, -len * 0.5, 0.012), at(w * 0.45, -len * 0.56, 0.014), at(-w * 0.32, -len * 0.84, 0.02), at(w * 0.12, -len, 0.024)], pos = [], uv = [];
    for (const [a, b, c] of [[0, 2, 1], [1, 2, 3], [2, 4, 3], [3, 4, 5]]) for (const tri of [[a, b, c], [a, c, b]]) for (const i of tri) { pos.push(q[i].x, q[i].y, q[i].z); uv.push((col + 0.5) / RAG_W, 0.3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.computeVertexNormals(); put(g);
  };
  const outAt = (t, th) => { const o = J.surf(t, th, 1.3).sub(J.surf(t, th, 1)); o.y = 0; if (o.lengthSq() < 1e-4) o.set(1, 0, 0); return o.normalize(); };
  for (const sx of [-1, 1]) strip(V(sx * 0.2, sh[1] + 0.005, sh[2] + 0.085), V(sx * 0.3, 0, 0.95).normalize(), 0.032, 0.12 + hr(sx + 50) * 0.08, 5);   // torn off the shoulders, behind the arms
  for (const [i, th] of [2.6, 3.5, 4.6, 5.6, 6.6].entries()) strip(J.surf(0.06, th, 1.12), outAt(0.06, th), 0.045 + hr(i + 60) * 0.02, 0.13 + hr(i + 70) * 0.13, i % 2 ? shirt : 5);
  for (const L of [J.L, J.R]) {
    put(sweepGeo(limbRings([[L.shJ, L.elbow, far ? [[-0.04, 0.066], [0.4, 0.056]] : [[-0.04, 0.066], [0.18, 0.06], [0.4, 0.056]]]]), far ? 6 : 8, { uv: ragUV(shirt, 1, 0.4), drop: (u, th, j) => u === 1 ? -(0.015 + hr(j + 20) * 0.06) : 0 }));
    const s = V(...L.shJ).lerp(V(...L.elbow), 0.42).add(V(L.sx * 0.05, 0, 0.01)); strip(s, V(L.sx, 0, 0.2).normalize(), 0.035, 0.1 + hr(L.sx + 80) * 0.06, shirt);
  }
  if (v === 'bonnet') return;   // under her skirt
  const PT = far ? [-0.1, 0.06, 0.16] : [-0.1, -0.03, 0.06, 0.16];
  put(sweepGeo(PT.map(t => J.ring(t, 1.1, 0.012)), far ? 8 : 14, { fwd: fr, cap0: 0.045, uv: ragUV(trou, 0.6, 1), mod: (u, th) => torsoMod(PT[Math.round(u * (PT.length - 1))], th) }));
  for (const L of [J.L, J.R]) {
    put(sweepGeo(limbRings([[L.hipJ, L.knee, far ? [[0, 0.088], [0.84, 0.068]] : [[0, 0.088], [0.3, 0.084], [0.6, 0.074], [0.84, 0.068]]]]), far ? 6 : 9, { uv: ragUV(trou, 1, 0.25), drop: (u, th, j) => u === 1 ? -(0.015 + hr(j + 40) * 0.07) : 0 }));
    const s = V(...L.hipJ).lerp(V(...L.knee), 0.8).add(V(L.sx * 0.07, 0, 0)); strip(s, V(L.sx, 0, -0.3).normalize(), 0.04, 0.1 + hr(L.sx + 90) * 0.07, trou);
  }
}
const ZOMBIE_VARIANTS = ['plain', 'plain', 'hat', 'bonnet', 'cheese', 'phone', 'clogs', 'scarf', 'boxes', 'socks', 'crawler'];
const ZOMBIE_PARTS = {};
// a town's own dead (dead: { pool, dress } in its towns3d file): pool is the variant list a spawn picks from (repeat a name to weight it),
// dress[name](k, body, K) adds that variant's clothes to the kit on the shared body; body has the hip, shoulder and head points and the skin
function deadPool() { const d = T3().dead; return (d && d.pool && d.pool.length) ? d.pool : ZOMBIE_VARIANTS; }
function deadDress(v) { for (const id in TOWN3D) { const d = TOWN3D[id].dead; if (d && d.dress && d.dress[v]) return d.dress[v]; } return null; }
const ZEYE_MAT = GlowMat(glowTex, 0xffbf40, 1, false, { side: THREE.DoubleSide }); ZEYE_MAT.userData.shared = true;
// a variant is built once, near and far together: its costume once, then the full body and the light one (seen from DEAD_FAR metres)
// under the same costume parts, so both match and the costume draws its random numbers once, as before (see zombie)
function zombieParts(v, far) {
  const key = far ? v + '|far' : v; if (ZOMBIE_PARTS[key]) return ZOMBIE_PARTS[key];
  const k = kit(), sk = PK.skin[0], crawl = v === 'crawler', { hip, sh, hd } = deadBody(crawl).J, ownDress = deadDress(v);  if (v === 'hat' || v === 'socks') kadd(k, PG.zHat, PM.orange, 0, hd[1] + 0.155, hd[2] + 0.02, 0.35);
  if (v === 'bonnet') {   // the woman from the sheet: a white bonnet with its wings, a long dark skirt
    kadd(k, PG.zBonnet, PK.linen, 0, hd[1] - 0.01, hd[2] + 0.03, 0.6);
    kadd(k, PG.zSkirt, PK.skirt, 0, 0.55, -0.02, -0.08, 0, 0, 1, 0.98, 1);
  }
  if (v === 'cheese') for (let i = 0; i < 5; i++) kadd(k, KG.cyl, PM.cheese, 0, 1.42 + i * 0.15, 0.1 + i * 0.03, 0.4, 0, 0, 0.5, 0.14, 0.5);   // a tall stack of cheese on his back
  if (v === 'boxes') { for (let i = 0; i < 4; i++) kb(k, M.wood, rnd(-0.04, 0.04), 1.4 + i * 0.3, 0.1 + i * 0.07, 0.5, 0.28, 0.42, 0.4, rnd(-0.15, 0.15), 0); kb(k, PK.rope, 0, 1.45, -0.12, 0.44, 0.04, 0.04, 0.4, 0, 0); }
  if (v === 'phone') kadd(k, KG.plane, PK.phone, 0.27, 0.72, -0.74, -0.9, 0, 0, 0.13, 0.22);
  if (v === 'clogs' || v === 'socks') for (const sx of [-1, 1]) kb(k, PM.cheese, sx * 0.125, 0.05, -0.02, 0.14, 0.1, 0.32);
  if (v === 'socks') for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) kadd(k, KG.cyl, i % 2 ? PK.linen : PK.sock, sx * 0.125, 0.14 + i * 0.07, 0.03, 0.2, 0, 0, 0.12, 0.07, 0.12);
  if (v === 'scarf') { const tg = new THREE.TorusGeometry(0.15, 0.05, 6, 10); kadd(k, tg, PM.orange, 0, sh[1] + 0.02, sh[2] - 0.1, Math.PI / 2 + 0.6); tg.dispose(); }
  if (ownDress) ownDress(k, { hip, sh, hd, crawl, skin: sk }, townKit());   // a town's own dead: their dress on the same body
  for (const f of [false, true]) {   // the body under it, full and light, with the rags of the shared variants; the costume's parts go on both
    const B = deadBody(crawl, f), bk = kit(), name = f ? v + '|far' : v, parts = []; let i = 0;
    kadd(bk, B.skin, sk, 0, 0, 0); kadd(bk, B.eyes, PM.eyeGlow, 0, 0, 0);
    for (const sx of [-1, 1]) kadd(bk, KG.plane, ZEYE_MAT, hd[0] + sx * 0.042, hd[1] + 0.017, hd[2] - 0.125, 0, 0, 0, 0.17, 0.13);   // the glow round each eye
    if (!ownDress) deadRags(bk, B.J, v, DEAD_RAGS[0], f);
    for (const [m, list] of k) { let l = bk.get(m); if (!l) bk.set(m, l = []); l.push(...list); }
    for (const [m, list] of bk) { const geo = kmerge(list); PG['zombie_' + name + '_' + (i++)] = geo; parts.push([geo, m === sk ? null : m]); }
    ZOMBIE_PARTS[name] = parts;
  }
  return ZOMBIE_PARTS[key];
}
// a spawn: its own skin colour and rags. Its meshes swap to the light body past DEAD_FAR metres from the eye and back, so the close
// ones show every bone while a street full of them costs little more than before
const _dlV = new THREE.Vector3(); let _ragN = 0;
function deadLod(force) {
  THREE.Object3D.prototype.updateMatrixWorld.call(this, force);
  const d2 = _dlV.setFromMatrixPosition(this.matrixWorld).distanceToSquared(camera.position), far = this.userData.far ? d2 > (DEAD_FAR - 1) ** 2 : d2 > (DEAD_FAR + 1) ** 2;
  if (far === !!this.userData.far) return;
  this.userData.far = far; for (const m of this.children) { const l = m.userData.lod; if (l) m.geometry = l[far ? 1 : 0]; }
}
function zombie(variant) {
  const v = variant || pick(deadPool()), skin = pick(PK.skin), rag = DEAD_RAGS[_ragN++ % DEAD_RAGS.length]; const g = new THREE.Group();
  const near = zombieParts(v), far = zombieParts(v, true);
  near.forEach(([geo, m], i) => { const mesh = new THREE.Mesh(geo, !m ? skin : m === DEAD_RAGS[0] ? rag : m); if (far[i] && far[i][1] === m) mesh.userData.lod = [geo, far[i][0]]; g.add(mesh); });
  g.updateMatrixWorld = deadLod;
  g.rotation.y = Math.PI + rnd(-0.4, 0.4); g.userData.lean = rnd(0.5, 1.5); g.userData.variant = v;   // turned toward you, so you meet the eyes
  return g;
}
function zombieBike() {
  const g = new THREE.Group(); const b = bikeProp(); b.rotation.set(0, 0, 0); g.add(b);
  const z = zombie('hat'); z.scale.setScalar(0.9); z.position.set(0, 0.45, 0.1); g.add(z);
  return g;
}
function fence() {
  const g = new THREE.Group();
  for (const s of [-1, 1]) { const p = new THREE.Mesh(G.fpost, M.wood); p.position.set(s * 0.9, 0.45, 0); g.add(p); }
  for (const y of [0.35, 0.75]) { const r = new THREE.Mesh(G.rail, M.wood); r.position.y = y; g.add(r); }
  return g;
}
function cart() {
  const g = new THREE.Group();
  const b = new THREE.Mesh(G.cartBody, M.wood); b.position.y = 0.75; g.add(b);
  const hay = new THREE.Mesh(G.hay, M.hay); hay.position.y = 1.4; hay.scale.y = 0.6; g.add(hay);
  for (const s of [-1, 1]) for (const z of [-0.6, 0.6]) { const w = new THREE.Mesh(G.wheel, M.dark); w.rotation.z = Math.PI / 2; w.position.set(s * 0.85, 0.35, z); g.add(w); }
  return g;
}
function puddle() {
  const m = new THREE.Mesh(G.puddle, M.puddle); m.rotation.x = -Math.PI / 2; m.position.y = 0.01; m.scale.x = 1.1; return m;
}
// a wisp is the lamp's fuel: a hot golden core in a soft halo, and its reflection on the wet road; update() bobs it and keeps the reflection down
const WISP_HALO_MAT = GlowMat(glowTex, 0xffc65a, 1, true); WISP_HALO_MAT.userData.shared = true;
const WISP_REFL_MAT = GlowMat(streakTex, 0xffb848, 0.8); WISP_REFL_MAT.userData.shared = true;
// the first ride's training wheels: an arrow painted on the road into each option's lane, a halo behind the right sign.
// One texture, one geometry, two shared materials, made once; the same glow shader as the wisps, so nothing new compiles.
const arrowTex = (() => {
  const c = document.createElement('canvas'); c.width = 64; c.height = 128; const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.beginPath(); g.moveTo(32, 4); g.lineTo(60, 44); g.lineTo(42, 44); g.lineTo(42, 124); g.lineTo(22, 124); g.lineTo(22, 44); g.lineTo(4, 44); g.closePath(); g.fill();
  return new THREE.CanvasTexture(c);
})();
const ARROW_MAT = GlowMat(arrowTex, 0xffd27a, 0.55); ARROW_MAT.userData.shared = true;
const TEACH_HALO_MAT = GlowMat(glowTex, 0xffc870, 0.8, true); TEACH_HALO_MAT.userData.shared = true;   // a teaching fork: the right sign lit
const HINT_HALO_MAT = GlowMat(glowTex, 0xffc870, 0.4, true); HINT_HALO_MAT.userData.shared = true;     // hint 'glow' (tier 1): a softer light
PG.arrow = new THREE.PlaneGeometry(0.9, 2.6).rotateX(-Math.PI / 2);
function roadArrow() { const m = new THREE.Mesh(PG.arrow, ARROW_MAT); m.position.y = 0.03; m.renderOrder = 2; return m; }
function wisp() {
  const g = new THREE.Group(); g.position.y = 1.0;
  g.add(new THREE.Mesh(G.wisp, M.wisp));
  const halo = new THREE.Sprite(WISP_HALO_MAT); halo.scale.set(1.9, 1.9, 1); g.add(halo);
  const refl = new THREE.Mesh(PG.wisp, WISP_REFL_MAT); refl.position.y = -0.96; refl.renderOrder = 3; g.add(refl);
  g.userData.halo = halo; g.userData.refl = refl;
  return g;
}

export { cart, deadPool, fence, HINT_HALO_MAT, puddle, roadArrow, TEACH_HALO_MAT, wisp, zombie, ZOMBIE_VARIANTS, zombieBike, zombieParts };
