// The kit: small parts merged into one mesh per material at build time, so a street full of detail costs a handful of draw
// calls. Also MODELS (filled by models.js), the sign pictogram atlas and the small kit builders (parked bike, tulip box, crate).
import { rnd, THREE } from './engine.js?v=39';
import { M, Mat } from './materials.js?v=39';
import { PM } from './props.js?v=39';
import { kModel } from './main.js?v=39';   // later modules, through the hub

// ---------- kit: small parts merged into one mesh per material, so a street full of detail costs a handful of draw calls ----------
// build-time only: kits run when the scenery is built, never inside update()
const _kq = new THREE.Quaternion(), _ke = new THREE.Euler(), _kp = new THREE.Vector3(), _ks = new THREE.Vector3(), _km = new THREE.Matrix4(), _kd = new THREE.Vector3(), _kup = new THREE.Vector3(0, 1, 0);
const MODELS = {};   // the .glb models from tools/models (npm run models), filled by loadModels(); every user falls back to its primitive while a name is missing
function kit() { const k = new Map(); k.base = new THREE.Matrix4(); return k; }
function kat(k, x, y, z, ry, rz) { _ke.set(0, ry || 0, rz || 0, 'YXZ'); _kq.setFromEuler(_ke); _kp.set(x, y, z); _ks.set(1, 1, 1); k.base.compose(_kp, _kq, _ks); return k; }   // where the next parts go: turned about y, then leaned about the part's own z
function kpush(k, geo, mat) { _km.premultiply(k.base); const q = geo.index ? geo.toNonIndexed() : geo.clone(); q.applyMatrix4(_km); if (mat && mat.userData.wuv) worldUV(q, mat.userData.wuv); let l = k.get(mat); if (!l) k.set(mat, l = []); l.push(q); }
// UVs from position, projected along the dominant axis of each vertex normal: one texel size on every wall, roof and plank
function worldUV(q, size) {
  const p = q.attributes.position, n = q.attributes.normal, uv = q.attributes.uv; if (!n || !uv) return; const s = 1 / size;
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    if (ay > ax && ay > az) uv.setXY(i, p.getX(i) * s, p.getZ(i) * s); else if (ax >= az) uv.setXY(i, p.getZ(i) * s, p.getY(i) * s); else uv.setXY(i, p.getX(i) * s, p.getY(i) * s);
  }
  uv.needsUpdate = true;
}
function kadd(k, geo, mat, x, y, z, rx, ry, rz, sx, sy, sz) { _ke.set(rx || 0, ry || 0, rz || 0, 'XYZ'); _kq.setFromEuler(_ke); _kp.set(x, y, z); _ks.set(sx || 1, sy || 1, sz || 1); _km.compose(_kp, _kq, _ks); kpush(k, geo, mat); }
function kb(k, mat, x, y, z, sx, sy, sz, rx, ry, rz) { kadd(k, KG.box, mat, x, y, z, rx, ry, rz, sx, sy, sz); }
function ktube(k, mat, ax, ay, az, bx, by, bz, r) { _kd.set(bx - ax, by - ay, bz - az); const len = _kd.length(); _kq.setFromUnitVectors(_kup, _kd.multiplyScalar(1 / len)); _kp.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2); _ks.set(r * 2, len, r * 2); _km.compose(_kp, _kq, _ks); kpush(k, KG.cyl6, mat); }
function kmerge(list) {
  let n = 0; for (const q of list) n += q.attributes.position.count;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2); let o = 0;
  for (const q of list) { const a = q.attributes; pos.set(a.position.array, o * 3); if (a.normal) nor.set(a.normal.array, o * 3); if (a.uv) uv.set(a.uv.array, o * 2); o += a.position.count; q.dispose(); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.computeBoundingSphere(); geo.userData.kit = true; return geo;
}
function kbuild(k, g) { g = g || new THREE.Group(); for (const [mat, list] of k) g.add(new THREE.Mesh(kmerge(list), mat)); k.clear(); k.base.identity(); return g; }
// unit parts the kits copy from; they are never drawn themselves
const KG = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 8),
  cyl6: new THREE.CylinderGeometry(0.5, 0.5, 1, 5),
  ball: new THREE.SphereGeometry(0.5, 8, 6),
  dome: new THREE.SphereGeometry(0.5, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2),
  plane: new THREE.PlaneGeometry(1, 1),
  disc: new THREE.CircleGeometry(0.3, 20),
  wheel: new THREE.TorusGeometry(0.33, 0.024, 4, 16).rotateY(Math.PI / 2),
  wheelS: new THREE.TorusGeometry(0.22, 0.024, 4, 14).rotateY(Math.PI / 2),
  bollard: new THREE.CylinderGeometry(0.1, 0.13, 0.85, 8),
  capsule: new THREE.CapsuleGeometry(0.15, 0.8, 4, 8),
  cat: (() => {   // a cat sitting on the sill, seen from behind, tail curled round
    const s = new THREE.Shape(); s.moveTo(-0.13, 0); s.lineTo(0.2, 0); s.quadraticCurveTo(0.28, 0.02, 0.25, 0.13); s.lineTo(0.22, 0.13); s.quadraticCurveTo(0.22, 0.05, 0.12, 0.05);
    s.quadraticCurveTo(0.13, 0.18, 0.07, 0.24); s.lineTo(0.075, 0.33); s.lineTo(0.06, 0.42); s.lineTo(0.025, 0.37); s.lineTo(-0.025, 0.37); s.lineTo(-0.06, 0.42); s.lineTo(-0.075, 0.33); s.lineTo(-0.07, 0.24); s.quadraticCurveTo(-0.13, 0.18, -0.13, 0);
    return new THREE.ShapeGeometry(s);
  })(),
  plant: (() => {   // a pot of tulips on the sill
    const pot = new THREE.Shape(); pot.moveTo(-0.1, 0); pot.lineTo(0.1, 0); pot.lineTo(0.13, 0.15); pot.lineTo(-0.13, 0.15);
    const out = [pot];
    for (const [x, h] of [[-0.07, 0.36], [0, 0.42], [0.07, 0.33]]) { const t = new THREE.Shape(); t.moveTo(x - 0.012, 0.14); t.lineTo(x + 0.012, 0.14); t.lineTo(x + 0.012, h - 0.04); t.lineTo(x + 0.04, h - 0.03); t.lineTo(x + 0.035, h + 0.04); t.lineTo(x, h + 0.02); t.lineTo(x - 0.035, h + 0.04); t.lineTo(x - 0.04, h - 0.03); t.lineTo(x - 0.012, h - 0.04); out.push(t); }
    return new THREE.ShapeGeometry(out);
  })(),
};
// hanging shop signs from the concept sheet: a warm icon on a dark board, eleven trades in one texture
const SIGN_ICONS = ['KAAS', 'BAKKER', 'SLAGER', 'KAPPER', 'APOTHEEK', 'CAFÉ', 'SUPERMARKT', 'FIETSENMAKER', 'BLOEMEN', 'FRIET', 'KLOMPEN'];
const signAtlas = (() => {
  const c = document.createElement('canvas'); c.width = 512; c.height = 384; const g = c.getContext('2d');
  const gold = '#f0c060', amber = '#e8a040', dark = '#1b1d21';
  const ln = (pts, w) => { g.lineWidth = w || 6; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); };
  const circ = (x, y, r, fill) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); if (fill) g.fill(); else g.stroke(); };
  const draw = {
    KAAS: () => { g.fillStyle = '#e8b840'; g.beginPath(); g.moveTo(-38, 22); g.lineTo(38, 22); g.lineTo(38, -4); g.lineTo(-38, -26); g.closePath(); g.fill(); g.fillStyle = '#8a6420'; circ(-14, 8, 6, 1); circ(12, 12, 5, 1); circ(22, 0, 4, 1); },
    BAKKER: () => { g.fillStyle = amber; g.beginPath(); g.ellipse(0, 4, 40, 22, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#6a4418'; for (const x of [-18, 0, 18]) ln([[x - 6, -8], [x + 6, 14]], 5); },
    SLAGER: () => { g.fillStyle = '#c87060'; g.beginPath(); g.ellipse(-8, 2, 28, 22, -0.3, 0, Math.PI * 2); g.fill(); g.fillStyle = '#e8dcc0'; g.fillRect(14, -6, 24, 9); circ(40, -7, 6, 1); circ(40, 5, 6, 1); },
    KAPPER: () => { g.strokeStyle = gold; g.lineWidth = 6; circ(-14, 24, 10); circ(14, 24, 10); ln([[-8, 16], [16, -34]]); ln([[8, 16], [-16, -34]]); },
    APOTHEEK: () => { g.fillStyle = '#5fae5a'; g.fillRect(-11, -34, 22, 68); g.fillRect(-34, -11, 68, 22); },
    'CAFÉ': () => { g.fillStyle = gold; g.strokeStyle = gold; g.fillRect(-26, -8, 40, 34); g.lineWidth = 6; g.beginPath(); g.arc(16, 8, 10, -1.4, 1.4); g.stroke(); ln([[-36, 32], [28, 32]], 5); g.lineWidth = 4; for (const x of [-16, -4, 8]) { g.beginPath(); g.moveTo(x, -14); g.quadraticCurveTo(x - 8, -24, x, -34); g.stroke(); } },
    SUPERMARKT: () => { g.fillStyle = gold; g.strokeStyle = gold; g.beginPath(); g.moveTo(-36, -6); g.lineTo(36, -6); g.lineTo(26, 30); g.lineTo(-26, 30); g.closePath(); g.fill(); g.lineWidth = 6; g.beginPath(); g.arc(0, -6, 24, Math.PI, 0); g.stroke(); g.strokeStyle = dark; for (const x of [-14, 0, 14]) ln([[x, 0], [x * 0.8, 26]], 4); },
    FIETSENMAKER: () => { g.strokeStyle = gold; g.lineWidth = 5; circ(-24, 14, 16); circ(24, 14, 16); ln([[-24, 14], [-6, -12], [16, -12], [24, 14]], 5); ln([[-6, -12], [0, 14], [-24, 14]], 5); ln([[16, -12], [12, -24], [22, -24]], 5); ln([[-10, -18], [0, -18]], 5); },
    BLOEMEN: () => { g.strokeStyle = '#5a8a4a'; ln([[0, 36], [0, -4]], 6); g.fillStyle = '#5a8a4a'; g.beginPath(); g.ellipse(-12, 18, 6, 16, 0.5, 0, Math.PI * 2); g.fill(); g.fillStyle = '#d8402e'; g.beginPath(); g.moveTo(-18, -30); g.lineTo(-9, -18); g.lineTo(0, -32); g.lineTo(9, -18); g.lineTo(18, -30); g.lineTo(16, -8); g.quadraticCurveTo(0, 6, -16, -8); g.closePath(); g.fill(); },
    FRIET: () => { g.fillStyle = '#f0d070'; for (let i = 0; i < 7; i++) g.fillRect(-21 + i * 6, -34 + (i % 3) * 6, 5, 34); g.fillStyle = '#c8402e'; g.beginPath(); g.moveTo(-26, -8); g.lineTo(26, -8); g.lineTo(14, 34); g.lineTo(-14, 34); g.closePath(); g.fill(); },
    KLOMPEN: () => { g.fillStyle = '#e8b840'; g.beginPath(); g.moveTo(-40, 18); g.quadraticCurveTo(-42, 0, -26, -4); g.lineTo(-8, -6); g.quadraticCurveTo(0, -24, 22, -22); g.quadraticCurveTo(40, -18, 40, 4); g.quadraticCurveTo(40, 22, 20, 22); g.closePath(); g.fill(); g.fillStyle = '#6a4418'; g.beginPath(); g.ellipse(14, -12, 12, 6, 0, 0, Math.PI * 2); g.fill(); },
  };
  SIGN_ICONS.forEach((name, i) => {
    g.save(); g.translate((i % 4) * 128 + 64, Math.floor(i / 4) * 128 + 64);
    g.fillStyle = dark; g.strokeStyle = '#8a6a30'; g.lineWidth = 5; g.beginPath(); if (g.roundRect) g.roundRect(-58, -58, 116, 116, 18); else g.rect(-58, -58, 116, 116); g.fill(); g.stroke();
    g.lineCap = 'round'; g.lineJoin = 'round'; draw[name](); g.restore();
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const SIGN_GEO = SIGN_ICONS.map((_, i) => { const p = new THREE.PlaneGeometry(0.8, 0.8), uv = p.attributes.uv, c = i % 4, r = Math.floor(i / 4); for (let j = 0; j < uv.count; j++) uv.setXY(j, (c + uv.getX(j)) / 4, 1 - (r + 1 - uv.getY(j)) / 3); return p; });
// the round blue bike-lane sign
const bikeSignTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  g.fillStyle = '#e8e4d8'; g.beginPath(); g.arc(64, 64, 64, 0, Math.PI * 2); g.fill(); g.fillStyle = '#2b4a9e'; g.beginPath(); g.arc(64, 64, 55, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#e8e4d8'; g.lineWidth = 6; g.lineCap = g.lineJoin = 'round';
  for (const x of [40, 88]) { g.beginPath(); g.arc(x, 78, 16, 0, Math.PI * 2); g.stroke(); }
  g.beginPath(); g.moveTo(40, 78); g.lineTo(58, 56); g.lineTo(82, 56); g.lineTo(88, 78); g.moveTo(58, 56); g.lineTo(64, 78); g.lineTo(40, 78); g.moveTo(82, 56); g.lineTo(78, 44); g.lineTo(88, 44); g.moveTo(52, 47); g.lineTo(63, 47); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const PK = {   // shared materials for the street furniture
  shutters: [Mat({ color: 0x24382c }), Mat({ color: 0x3a2622 }), Mat({ color: 0x1f2a3a })],
  bikes: [PM.pole, PM.pole, PM.silver, Mat({ color: 0x5a2422 }), Mat({ color: 0x23324a })],
  kliko: [Mat({ color: 0x3d4652 }), Mat({ color: 0x2f4a36 })],
  duck: Mat({ color: 0xd8d4c8 }),
  rope: Mat({ color: 0x6b5a40 }),
  sign: new THREE.MeshBasicMaterial({ map: signAtlas, color: 0xd8ccb0 }),
  bikeSign: new THREE.MeshBasicMaterial({ map: bikeSignTex, color: 0x9aa4b0 }),
  skin: [Mat({ color: 0x1d2227 }), Mat({ color: 0x23272a }), Mat({ color: 0x1f2129 })],
  linen: Mat({ color: 0xe6e2d6 }), skirt: Mat({ color: 0x1f2630 }), sock: Mat({ color: 0xb8282a }),
  phone: new THREE.MeshBasicMaterial({ color: 0x9fe8ff }),
};
// a quiz prop is cleaned up with its textures, so it gets its own copy of the sign atlas
function signMat(own) { if (!own) return PK.sign; const t = signAtlas.clone(); t.needsUpdate = true; return new THREE.MeshBasicMaterial({ map: t, color: 0xd8ccb0 }); }
// an omafiets along local z, front at -z, standing on y = 0: two wheels, a step-through frame, upright bars, a saddle and a rack; cargo makes it a bakfiets
function kBike(k, mat, cargo, basket) {
  // the model when it is loaded; its saddle takes the pole material, so a kit gains no material and no draw call
  if (!cargo && MODELS.bike) { kModel(k, MODELS.bike, 0, 0, 0, 0, 1, 1, 1, { frame: mat, leather: PM.pole }); if (basket) kb(k, PK.rope, 0, 0.88, -0.53, 0.3, 0.2, 0.26); return; }
  const R = 0.33, rz = 0.55, fz = cargo ? -1.2 : -0.55, hz = cargo ? -0.3 : -0.4;
  kadd(k, KG.wheel, PM.pole, 0, R, rz);
  if (cargo) kadd(k, KG.wheelS, PM.pole, 0, 0.22, fz); else kadd(k, KG.wheel, PM.pole, 0, R, fz);
  const bb = [0, 0.3, 0.08];
  ktube(k, mat, 0, R, rz, ...bb, 0.018); ktube(k, mat, 0, R, rz, 0, 0.84, 0.22, 0.016); ktube(k, mat, ...bb, 0, 0.84, 0.22, 0.02);
  ktube(k, mat, ...bb, 0, 0.62, hz, 0.024); ktube(k, mat, 0, 0.45, 0.16, 0, 0.74, hz - 0.02, 0.018);
  ktube(k, mat, 0, 0.6, hz, 0, 0.98, hz + 0.08, 0.022);
  if (cargo) { ktube(k, mat, ...bb, 0, 0.22, fz, 0.024); kb(k, M.wood, 0, 0.55, -0.82, 0.66, 0.42, 0.8); kb(k, PM.pole, 0, 0.77, -0.82, 0.7, 0.04, 0.84); }
  else ktube(k, mat, 0, 0.62, hz, 0, R, fz, 0.016);
  kb(k, mat, 0, 1.0, hz + 0.12, 0.52, 0.03, 0.03); kb(k, PM.pole, 0, 0.9, 0.24, 0.12, 0.05, 0.24);
  kb(k, mat, 0, 0.7, rz - 0.04, 0.16, 0.025, 0.42); kb(k, mat, 0.05, 0.33, 0.32, 0.03, 0.1, 0.48);
  if (basket) kb(k, PK.rope, 0, 0.88, fz + 0.02, 0.3, 0.2, 0.26);
}
function kTulipBox(k, x, z) {
  kb(k, M.wood, x, 0.18, z, 0.5, 0.35, 1.0);
  for (let i = 0; i < 6; i++) { const tx = x + rnd(-0.15, 0.15), tz = z - 0.42 + i * 0.17; kb(k, PM.reed, tx, 0.5, tz, 0.025, 0.35, 0.025); kadd(k, KG.ball, i % 4 === 3 ? PM.orange : PM.tulip, tx, 0.7, tz, 0, 0, 0, 0.12, 0.17, 0.12); }
}
function kCrate(k, x, y, z, ry, fill) {   // a slatted wooden crate, sometimes full
  kb(k, PM.pole, x, y + 0.19, z, 0.52, 0.36, 0.42, 0, ry, 0);
  for (const sy of [0.06, 0.2, 0.34]) kb(k, M.wood, x, y + sy, z, 0.56, 0.08, 0.46, 0, ry, 0);
  if (fill) for (let i = 0; i < 4; i++) kadd(k, KG.ball, fill, x + (i % 2 - 0.5) * 0.24, y + 0.38, z + (i < 2 ? -0.1 : 0.1), 0, 0, 0, 0.17, 0.15, 0.17);
}

export { kadd, kat, kb, kBike, kbuild, kCrate, KG, kit, kmerge, ktube, kTulipBox, MODELS, PK, SIGN_GEO, SIGN_ICONS, signMat, worldUV };
