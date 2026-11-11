// What stands behind the street and what only one town has: the landmarks (tower, lighthouse, crane, sheep, the flag), the
// second row of houses, tree cards, the painted skyline cards and their haze tint, the canal bridge, and each town's shops and
// signs.
import { pick, rnd, THREE } from './engine.js?v=43';
import { scene } from './render.js?v=43';
import { M, Mat } from './materials.js?v=43';
import { PG, PM } from './props.js?v=43';
import { kadd, kat, kb, kbuild, kit, ktube, PK } from './kit.js?v=43';
import { bikeRow, ducks, moorings, T3, townId, townStyle, windmill } from './furniture.js?v=43';
import { boat, brickMat, graffitiWall, house, reeds } from './houses.js?v=43';
import { allWords, MIST_BANDS, SHOP_SIGNS, theme, townKit, zombieParts } from './main.js?v=43';   // later modules, through the hub

// ---------- landmarks and props only one town has ----------
function tower(w, h, mat, spireH) { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mat); t.position.y = h / 2; g.add(t); if (spireH) { const sp = new THREE.Mesh(new THREE.ConeGeometry(w * 0.72, spireH, 4), PM.roof); sp.rotation.y = Math.PI / 4; sp.position.y = h + spireH / 2; g.add(sp); } for (let i = 0; i < 2; i++) { const win = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.2, w * 0.5), PM.window); win.position.set(0, h * 0.75 - i * w * 0.7, w / 2 + 0.01); g.add(win); } return g; }
function flagNL() { const g = new THREE.Group(); const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 4, 5), PM.pole); pole.position.y = 2; g.add(pole); [[0xb8282a, 3.7], [0xe8e4d8, 3.4], [0x2b4a9e, 3.1]].forEach(([c, y]) => { const b = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.3), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); b.position.set(0.72, y, 0); g.add(b); }); return g; }
function sheep() { const g = new THREE.Group(); const wool = Mat({ color: 0xd8d4c8 }); const b = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), wool); b.position.y = 0.6; b.scale.set(1.3, 1, 1); g.add(b); const h = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.26, 0.3), Mat({ color: 0x1a1a1e })); h.position.set(0.6, 0.62, 0); g.add(h); for (const sx of [-0.3, 0.3]) for (const sz of [-0.18, 0.18]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), Mat({ color: 0x1a1a1e })); l.position.set(sx, 0.18, sz); g.add(l); } g.rotation.y = rnd(0, 6); return g; }
function lighthouse(col) { const g = new THREE.Group(); for (let i = 0; i < 4; i++) { const band = new THREE.Mesh(new THREE.CylinderGeometry(1.2 - i * 0.12, 1.32 - i * 0.12, 3, 12), Mat({ color: i % 2 ? 0xe8e4d8 : col })); band.position.y = 1.5 + i * 3; g.add(band); } const top = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.4, 12), new THREE.MeshBasicMaterial({ color: 0xfff1c0 })); top.position.y = 13.7; g.add(top); const cap = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.2, 12), PM.roof); cap.position.y = 15; g.add(cap); return g; }
function crane() { const g = new THREE.Group(); const legs = Mat({ color: 0x3d4652 }); for (const sx of [-1.5, 1.5]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.3, 16, 0.3), legs); l.position.set(sx, 8, 0); g.add(l); } const beam = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 0.4), legs); beam.position.set(2, 16, 0); g.add(beam); const cab = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 1.2), legs); cab.position.set(0, 14.5, 0); g.add(cab); const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 8, 4), PM.pole); hook.position.set(7, 12, 0); g.add(hook); return g; }
const LANDMARK = {
  alblasserdam: () => { const g = new THREE.Group(); const t = tower(3.5, 14, brickMat(0x5a3630), 7); g.add(t); return g; },
  kinderdijk: () => { const g = new THREE.Group(); for (let i = 0; i < 3; i++) { const m = windmill(); m.position.set(i * 9, 0, -i * 6); m.scale.setScalar(1.2); g.add(m); } return g; },
  gouda: () => { const g = new THREE.Group(); const hall = new THREE.Mesh(new THREE.BoxGeometry(7, 11, 12), Mat({ color: 0x8a8a80 })); hall.position.y = 5.5; g.add(hall); for (let i = 0; i < 4; i++) { const pin = new THREE.Mesh(new THREE.ConeGeometry(0.5, 3, 4), PM.roof); pin.position.set(-3 + i * 2, 12.5, -6); g.add(pin); } const roof = new THREE.Mesh(new THREE.ConeGeometry(5.2, 4, 4), PM.roof); roof.rotation.y = Math.PI / 4; roof.scale.z = 1.9; roof.position.y = 13; g.add(roof); const sm = tower(1.6, 18, Mat({ color: 0x8a8a80 }), 3); sm.position.set(0, 0, -6.5); g.add(sm); return g; },
  zeeland: () => { const g = new THREE.Group(); for (let i = 0; i < 7; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(1.4, 9, 2.4), Mat({ color: 0x8a8a80 })); p.position.set(0, 4.5, -i * 7); g.add(p); const gate = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.4, 5), Mat({ color: 0x3d4652 })); gate.position.set(0, 2.5, -i * 7 - 3.5); g.add(gate); } const deck = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 48), Mat({ color: 0x6e7580 })); deck.position.set(0, 9.3, -21); g.add(deck); return g; },
  utrecht: () => { const g = new THREE.Group(); const base = tower(4, 22, brickMat(0x7a6a5a), 0); g.add(base); const mid = new THREE.Mesh(new THREE.BoxGeometry(3.4, 8, 3.4), brickMat(0x7a6a5a)); mid.position.y = 26; g.add(mid); const lantern = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 7, 8), Mat({ color: 0x9a8a7a })); lantern.position.y = 33.5; g.add(lantern); const cap = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3, 8), PM.roof); cap.position.y = 38.5; g.add(cap); return g; },
  denhaag: () => { const g = new THREE.Group(); const hall = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 14), brickMat(0x6b4a40)); hall.position.y = 4; g.add(hall); const roof = new THREE.Mesh(new THREE.ConeGeometry(4.4, 5, 4), PM.roof); roof.rotation.y = Math.PI / 4; roof.scale.z = 2.4; roof.position.y = 10.5; g.add(roof); for (const sz of [-6, 6]) { const t = tower(1.2, 12, brickMat(0x6b4a40), 5); t.position.set(-3, 0, sz); g.add(t); } const f = flagNL(); f.position.set(-3, 10, 0); g.add(f); return g; },
  rotterdam: () => { const g = new THREE.Group(); const pylon = new THREE.Mesh(new THREE.BoxGeometry(1.6, 34, 2.2), Mat({ color: 0x9fb8d0 })); pylon.position.y = 17; pylon.rotation.z = -0.18; g.add(pylon); for (let i = 0; i < 8; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 20 + i * 2, 3), Mat({ color: 0x9fb8d0 })); c.position.set(6 + i * 1.5, 16 - i * 0.8, 0); c.rotation.z = 0.9 + i * 0.03; g.add(c); } const deck = new THREE.Mesh(new THREE.BoxGeometry(40, 0.8, 4), Mat({ color: 0x6e7580 })); deck.position.set(12, 7, 0); g.add(deck); const cr = crane(); cr.position.set(-18, 0, -10); g.add(cr); return g; },
  urk: () => lighthouse(0xb8282a),
  texel: () => lighthouse(0xb8282a),
  groningen: () => { const g = new THREE.Group(); const t = tower(4, 20, brickMat(0x8a7a66), 0); g.add(t); const t2 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 10, 3.2), brickMat(0x8a7a66)); t2.position.y = 25; g.add(t2); const t3 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 6, 8), brickMat(0x8a7a66)); t3.position.y = 33; g.add(t3); const cap = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3, 8), PM.roof); cap.position.y = 37.5; g.add(cap); return g; },
  maastricht: () => { const g = new THREE.Group(); const t = tower(3, 22, Mat({ color: 0xb8282a }), 9); g.add(t); for (let i = 0; i < 4; i++) { const arch = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.6, 6, 12, Math.PI), Mat({ color: 0x9a927f })); arch.position.set(-12 + i * 5.2, 1.2, -4); g.add(arch); } const deck = new THREE.Mesh(new THREE.BoxGeometry(22, 0.6, 3), Mat({ color: 0x9a927f })); deck.position.set(-4, 4.2, -4); g.add(deck); return g; },
  nijmegen: () => { const g = new THREE.Group(); const arch = new THREE.Mesh(new THREE.TorusGeometry(14, 0.7, 8, 24, Math.PI), Mat({ color: 0x2e4a3a })); arch.position.set(-6, 1, -6); g.add(arch); const deck = new THREE.Mesh(new THREE.BoxGeometry(32, 0.6, 3.5), Mat({ color: 0x3d4652 })); deck.position.set(-6, 6, -6); g.add(deck); const t = tower(3.4, 20, brickMat(0x6b5a44), 0); t.position.set(10, 0, 4); g.add(t); const lantern = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 5, 8), Mat({ color: 0x9a8a7a })); lantern.position.set(10, 22.5, 4); g.add(lantern); return g; },
  amsterdam: () => { const g = new THREE.Group(); const t = tower(3.2, 22, brickMat(0x3b2f2b), 0); g.add(t); const lantern = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 6, 8), Mat({ color: 0xd8d4c8 })); lantern.position.y = 25; g.add(lantern); const crown = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 6), Mat({ color: 0x2b4a9e })); crown.position.y = 29.5; g.add(crown); return g; },
};
const TOWN_EXTRA = {   // roadside props only this town has
  kinderdijk: [{ make: boat, n: 2, gap: 90, water: 0.6, xr: [9.6, 13] }, { make: ducks, n: 2, gap: 80, water: -0.02, xr: [10, 14] }],
  zeeland: [{ make: reeds, n: 10, gap: 12, side: 'both', xr: [5, 6], y: -0.5 }],
  denhaag: [{ make: flagNL, n: 3, gap: 60, side: 'both', xr: [4.8, 5.2], r: 0.3 }],
  rotterdam: [{ make: crane, n: 2, gap: 140, side: 'both', xr: [14, 20], r: 3 }],
  urk: [{ make: boat, n: 4, gap: 50, water: 0.6, xr: [9.6, 14] }, { make: moorings, n: 3, gap: 60, water: 0, xr: [8.1, 8.4] }],
  texel: [{ make: sheep, n: 8, gap: 16, side: 'both', xr: [5.5, 9], r: 0.6 }],
  groningen: [{ make: bikeRow, n: 6, gap: 22, side: 'both', xr: [4.8, 5.0], r: 0.4 }],
  nijmegen: [{ make: bikeRow, n: 6, gap: 22, side: 'both', xr: [4.8, 5.0], r: 0.4 }, { make: boat, n: 2, gap: 90, water: 0.6, xr: [9.6, 13] }],
  utrecht: [{ make: bikeRow, n: 10, gap: 14, side: 'both', xr: [4.8, 5.0], r: 0.4 }],
  amsterdam: [{ make: bikeRow, n: 12, gap: 12, side: 'both', xr: [4.8, 5.0], r: 0.4 }, { make: boat, n: 3, gap: 70, water: 0.6, xr: [9.6, 13] }],
};

// ---------- depth: what stands behind the street ----------
// a terrace: n houses wall to wall, facades on one line, merged into one kit, so a street reads as rows of gables instead of houses standing alone
function terrace(n, opts = {}) {
  const g = new THREE.Group(), k = kit(), len = n * 6.05, st = townStyle, pal = [pick(st.brick), pick(st.brick)];
  for (let i = 0; i < n; i++) {
    const w = rnd(st.width[0], st.width[1]) * (opts.plain ? 1.25 : 1), shop = opts.shops && Math.random() < opts.shops;
    house(Object.assign({}, opts, { k, g, w, brick: pal[i % 2], ox: w / 2 - 2.2, oz: -len / 2 + 3 + i * 6.05, sign: shop ? pick(townShops()) : null, lit: opts.lit != null ? opts.lit : shop ? 0.55 : undefined }));
  }
  if (opts.tag && Math.random() < opts.tag) {   // a garden wall closes the alley after the row, with one of the town's words sprayed on it
    const pool = allWords(), wall = graffitiWall(pool.length ? pick(pool) : 'gezellig');
    wall.position.set(-2.0, 0, len / 2 + 2.9); wall.scale.z = 0.92; g.add(wall);
  }
  kbuild(k, g); g.userData.faceRoad = true; return g;
}
// the second row, lower in detail and fainter: windows and roofs only, fog does the rest
function backRow() { return terrace(5, { plain: true, lit: 0.22, tall: 1.12, peer: false }); }

// trees as painted silhouette cards that turn to face the eye: the tall forked tree of the reference's foreground, a round lime, a poplar, a bare polder tree
const treeTex = (() => {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d');
  g.fillStyle = g.strokeStyle = '#fff'; g.lineCap = 'round';
  let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647, rr = (a, b) => a + r() * (b - a);
  const limb = (x, y, a, len, wd, depth, ends) => {
    const x2 = x + Math.sin(a) * len, y2 = y - Math.cos(a) * len; g.lineWidth = wd; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
    if (depth > 0) { const n = 2 + (r() < 0.4 ? 1 : 0); for (let i = 0; i < n; i++) limb(x2, y2, a + rr(-0.75, 0.75), len * rr(0.6, 0.82), Math.max(1.5, wd * 0.66), depth - 1, ends); } else ends.push([x2, y2]);
  };
  const clump = (x, y, rad, n, r0, r1) => { for (let i = 0; i < n; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * rad; g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.85, rr(r0 || 4, r1 || 11), 0, 7); g.fill(); } };
  const holes = (x, y, rad, n) => { g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < n; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * rad; g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, rr(2, 6), 0, 7); g.fill(); } g.globalCompositeOperation = 'source-over'; };
  const cell = (i, draw) => { g.save(); g.beginPath(); g.rect(i * 256 + 2, 0, 252, 512); g.clip(); draw(i * 256 + 128); g.restore(); };
  cell(0, cx => {   // tall, forked, leaves in loose clumps with sky between them
    g.lineWidth = 16; g.beginPath(); g.moveTo(cx - 6, 512); g.quadraticCurveTo(cx + 4, 380, cx - 4, 300); g.stroke();
    const e = []; for (const a of [-0.55, -0.1, 0.45]) limb(cx - 4, 300, a, rr(70, 95), 9, 2, e);
    for (const [x, y] of e) clump(x, y, rr(18, 30), 26, 4, 10);
    holes(cx, 170, 110, 40);
  });
  cell(1, cx => {   // a round lime tree
    g.lineWidth = 13; g.beginPath(); g.moveTo(cx, 512); g.lineTo(cx + 2, 330); g.stroke();
    const e = []; for (const a of [-0.5, 0, 0.5]) limb(cx + 2, 330, a, 60, 7, 2, e);
    clump(cx, 220, 92, 190, 7, 16); for (const [x, y] of e) clump(x, y, 18, 10, 4, 9);
    holes(cx, 220, 95, 26);
  });
  cell(2, cx => {   // a poplar: a tall narrow column
    g.lineWidth = 9; g.beginPath(); g.moveTo(cx, 512); g.lineTo(cx, 420); g.stroke();
    for (let y = 470; y > 30; y -= 8) { const t = (470 - y) / 440, wd = 46 * Math.pow(Math.sin(Math.min(1, t * 1.15) * Math.PI), 0.55) + 6; clump(cx + Math.sin(y * 0.03) * 4, y, wd, 7, 4, 9); }
    holes(cx, 250, 40, 14);
  });
  cell(3, cx => {   // bare, wind-bent, a few last leaves
    const e = []; limb(cx, 512, 0.08, 150, 14, 0, []); limb(cx + Math.sin(0.08) * 150, 512 - Math.cos(0.08) * 150, 0.1, 80, 9, 4, e);
    limb(cx + 6, 420, -0.8, 70, 6, 3, e);
    for (const [x, y] of e) if (r() < 0.3) clump(x, y, 8, 5, 3, 6);
  });
  const t = new THREE.CanvasTexture(c); return t;
})();
const TREE_SIZE = [[8.5, 15], [8, 11], [3.6, 13], [7, 11]];
const TREE_MAT = new THREE.MeshBasicMaterial({ map: treeTex, color: 0x0f1317, alphaTest: 0.5, side: THREE.DoubleSide });
[0, 1, 2, 3].forEach(i => { const p = new THREE.PlaneGeometry(1, 1); p.translate(0, 0.5, 0); const uv = p.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, (i + uv.getX(j)) / 4); PG['tree' + i] = p; });
function treeCard(kinds) {
  const v = pick(kinds || [0, 1, 1, 2]), s = rnd(0.8, 1.2), g = new THREE.Group(), m = new THREE.Mesh(PG['tree' + v], TREE_MAT);
  m.scale.set(TREE_SIZE[v][0] * s * (Math.random() < 0.5 ? -1 : 1), TREE_SIZE[v][1] * s, 1); g.add(m); g.userData.bill = true; return g;
}

// the far town: painted silhouettes on three bands round the horizon, the reference's depth trick: the nearer band darker, the farther ones paler.
// Their colour is the haze times a factor, set every frame, so they dim with the night; lit windows are a second, additive copy of each band.
const SKY_CW = 2048, SKY_CH = 384;
const skyBands = [{ R: 92, kS: 0.52, wk: 0.85 }, { R: 130, kS: 0.68, wk: 0.6 }, { R: 172, kS: 0.83, wk: 0.38 }].map((B, i) => {
  B.m = SKY_CW / (Math.PI * B.R); B.h = SKY_CH / B.m; B.kLin = Math.pow(B.kS, 2.2);   // pixels per metre: the canvas spans half the circle and repeats once
  const geo = new THREE.CylinderGeometry(B.R, B.R, B.h, 96, 1, true); geo.translate(0, B.h / 2 - 5, 0);
  const tex = c => { const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.repeat.x = -2; t.offset.x = 0.5; t.colorSpace = THREE.SRGBColorSpace; return t; };   // canvas middle straight ahead, left to right on screen
  B.sil = document.createElement('canvas'); B.lit = document.createElement('canvas'); B.sil.width = B.lit.width = SKY_CW; B.sil.height = B.lit.height = SKY_CH;
  B.a = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex(B.sil), transparent: true, depthWrite: false, fog: false, side: THREE.BackSide }));
  B.b = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex(B.lit), color: 0xffb466, transparent: true, depthWrite: false, fog: false, side: THREE.BackSide, blending: THREE.AdditiveBlending }));
  B.a.renderOrder = -7 - i; B.b.renderOrder = -6.5 - i;   // the farthest first, each band's windows right after it
  for (const m of [B.a, B.b]) { m.frustumCulled = false; scene.add(m); }
  return B;
});
function skyPainter(B, seed) {
  const g = B.sil.getContext('2d'), w = B.lit.getContext('2d'), m = B.m, base = SKY_CH - 5 * m;
  g.clearRect(0, 0, SKY_CW, SKY_CH); w.globalCompositeOperation = 'source-over'; w.fillStyle = '#000'; w.fillRect(0, 0, SKY_CW, SKY_CH); g.fillStyle = '#fff'; g.strokeStyle = '#fff';
  let s = seed % 2147483646 + 1; const r = () => (s = (s * 16807) % 2147483647) / 2147483647, rr = (a, b) => a + r() * (b - a);
  const X = f => f * SKY_CW, Y = hm => base - hm * m;
  const P = {
    r, rr, X, m, g, w,
    poly(pts) { g.beginPath(); pts.forEach(([x, h], i) => i ? g.lineTo(x, Y(h)) : g.moveTo(x, Y(h))); g.closePath(); g.fill(); },
    box(x, wd, h0, h1) { g.fillRect(x - wd * m / 2, Y(h1), wd * m, (h1 - h0) * m); },
    line(x0, h0, x1, h1, wd) { g.lineWidth = Math.max(1, wd * m); g.beginPath(); g.moveTo(x0, Y(h0)); g.lineTo(x1, Y(h1)); g.stroke(); },
    win(x, h, a, wd, hh) { const ww = Math.max(2, (wd || 0.9) * m), wh = Math.max(2, (hh || 1.3) * m); w.fillStyle = `rgba(255,255,255,${a == null ? 0.9 : a})`; w.fillRect(x - ww / 2, Y(h) - wh, ww, wh); },
    house(x, wd, h, kind, litP) {
      const rh = kind === 'flat' ? 0 : wd * rr(0.6, 0.95), hw = wd * m / 2;
      P.box(x, wd, -5, h);
      if (kind === 'step') { const n = 3 + Math.floor(r() * 2); for (let i = 0; i < n; i++) P.box(x, wd * (1 - i / n) * 0.96, h, h + rh * (i + 1) / n); }
      else if (kind === 'bell') { g.beginPath(); g.moveTo(x - hw, Y(h)); g.quadraticCurveTo(x - hw * 0.9, Y(h + rh * 0.75), x - hw * 0.36, Y(h + rh * 0.9)); g.lineTo(x - hw * 0.36, Y(h + rh)); g.lineTo(x + hw * 0.36, Y(h + rh)); g.lineTo(x + hw * 0.36, Y(h + rh * 0.9)); g.quadraticCurveTo(x + hw * 0.9, Y(h + rh * 0.75), x + hw, Y(h)); g.fill(); }
      else if (kind !== 'flat') P.poly([[x - hw - 0.4 * m, h], [x, h + rh], [x + hw + 0.4 * m, h]]);
      if (r() < 0.6) P.box(x + rr(-0.3, 0.3) * wd * m, 0.7, h, h + rh * 0.55 + 1.3);
      for (let fy = 1.4; fy < h - 1.2; fy += 2.8) for (let fx = -wd / 2 + 1.2; fx < wd / 2 - 0.7; fx += 2.1) if (r() < litP) P.win(x + fx * m, fy, rr(0.45, 1));
    },
    roofs(x0, x1, h0, h1, litP, kinds) { let x = X(x0); while (x < X(x1)) { const wd = rr(5, 9); P.house(x + wd * m / 2, wd, rr(h0, h1), kinds[Math.floor(r() * kinds.length)], litP); x += wd * m * rr(0.92, 1.5); } },
    tree(x, h, wd) { P.box(x, Math.max(0.5, wd * 0.08), -5, h * 0.5); const cr = wd / 2; for (let i = 0; i < 20; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * cr * 0.72; g.beginPath(); g.arc(x + Math.cos(a) * d * m, Y(h - cr + Math.sin(a) * d * 0.9), cr * rr(0.32, 0.52) * m, 0, 7); g.fill(); } },
    conifer(x, h, wd) { P.poly([[x - wd * m / 2, h * 0.12], [x, h], [x + wd * m / 2, h * 0.12]]); P.box(x, Math.max(0.4, wd * 0.1), -5, h * 0.15); },
    trees(x0, x1, h0, h1, gap) { let x = X(x0); while (x < X(x1)) { const h = rr(h0, h1); if (r() < 0.22) P.conifer(x, h * 1.15, h * 0.42); else P.tree(x, h, h * rr(0.7, 1.05)); x += rr(0.3, 1) * gap * m; } },
    church(x, h) { const tw = Math.max(3, h * 0.13); P.box(x + (tw * 0.5 + h * 0.22) * m, h * 0.44, -5, h * 0.3); P.poly([[x + tw * 0.5 * m, h * 0.3], [x + (tw * 0.5 + h * 0.22) * m, h * 0.42], [x + (tw * 0.5 + h * 0.44) * m, h * 0.3]]); P.box(x, tw, -5, h * 0.58); P.box(x, tw * 1.15, h * 0.56, h * 0.6); P.poly([[x - tw * 0.52 * m, h * 0.6], [x, h], [x + tw * 0.52 * m, h * 0.6]]); P.win(x, h * 0.42, 0.45, 0.8, 1.8); },
    mill(x, h, a, litN) {
      const hub = h * 0.76, L = h * 0.56, sw = h * 0.09;
      P.poly([[x - h * 0.19 * m, -5], [x - h * 0.19 * m, 0], [x - h * 0.11 * m, h * 0.72], [x + h * 0.11 * m, h * 0.72], [x + h * 0.19 * m, 0], [x + h * 0.19 * m, -5]]);
      P.box(x, h * 0.56, h * 0.3, h * 0.33); P.line(x - h * 0.26 * m, h * 0.31, x - h * 0.2 * m, 0, 0.3); P.line(x + h * 0.26 * m, h * 0.31, x + h * 0.2 * m, 0, 0.3);
      P.poly([[x - h * 0.14 * m, h * 0.71], [x - h * 0.1 * m, h * 0.79], [x, h * 0.82], [x + h * 0.1 * m, h * 0.79], [x + h * 0.14 * m, h * 0.71]]);
      for (let i = 0; i < 4; i++) {   // four sails: a stock and a lattice of bars
        g.save(); g.translate(x, Y(hub)); g.rotate(a + i * Math.PI / 2);
        g.fillRect(-0.2 * m, 0, 0.4 * m, L * m); g.fillRect(0.2 * m, L * 0.18 * m, 0.25 * m, L * 0.82 * m); g.fillRect(0.2 * m + sw * m, L * 0.18 * m, 0.25 * m, L * 0.82 * m);
        for (let j = 0; j < 8; j++) g.fillRect(0.2 * m, L * (0.2 + j * 0.1) * m, sw * m + 0.25 * m, Math.max(1, 0.22 * m));
        g.restore();
      }
      for (let i = 0; i < (litN == null ? 2 : litN); i++) P.win(x + (i % 2 ? 0.25 : -0.15) * h * 0.1 * m, h * (0.12 + i * 0.17), 0.95, 0.9, 1.2);
    },
    tower(x, tiers, top, lit) {   // tiers: [width, height] stacked; top: 'spire' | 'lantern' | 'crown' | 'onion' | 'flat'
      let h = 0; for (const [wd, th] of tiers) { P.box(x, wd, h === 0 ? -5 : h, h + th); if (lit) P.win(x, h + th * 0.45, 0.6, wd * 0.12, th * 0.3); h += th; }
      const tw = tiers[tiers.length - 1][0];
      if (top === 'spire') P.poly([[x - tw * 0.55 * m, h], [x, h + tw * 2.6], [x + tw * 0.55 * m, h]]);
      else if (top === 'lantern') { P.box(x, tw * 0.62, h, h + tw * 0.9); P.poly([[x - tw * 0.36 * m, h + tw * 0.9], [x, h + tw * 1.9], [x + tw * 0.36 * m, h + tw * 0.9]]); }
      else if (top === 'crown') { P.box(x, tw * 0.6, h, h + tw * 0.7); g.beginPath(); g.ellipse(x, Y(h + tw * 0.95), tw * 0.42 * m, tw * 0.38 * m, 0, 0, 7); g.fill(); P.line(x, h + tw * 1.2, x, h + tw * 2.1, 0.35); }
      else if (top === 'onion') { g.beginPath(); g.ellipse(x, Y(h + tw * 0.45), tw * 0.5 * m, tw * 0.5 * m, 0, 0, 7); g.fill(); P.poly([[x - tw * 0.2 * m, h + tw * 0.8], [x, h + tw * 1.8], [x + tw * 0.2 * m, h + tw * 0.8]]); }
      return h;
    },
  };
  return P;
}
// each town's own skyline: what Santi should recognise at a glance (mid band, a little right of the road like the windmill in the reference)
const SKY_MARKS = {
  alblasserdam: P => { P.church(P.X(0.63), 36); P.mill(P.X(0.78), 24, 0.35, 3); P.mill(P.X(0.86), 19, 1.1, 1); },
  kinderdijk: P => { for (let i = 0; i < 6; i++) P.mill(P.X(0.57 + i * 0.055), 28 - i * 2.6, i * 0.7 + 0.2, i < 2 ? 3 : 1); P.church(P.X(0.3), 32); },
  gouda: P => {   // the stadhuis alone on the Markt: a Gothic hall with a stepped gable, pinnacles and a slim tower; the long roof of the Sint-Jan beside it
    const x = P.X(0.62); P.box(x, 13, -5, 13); for (let i = 0; i < 5; i++) P.box(x, 13 * (1 - i / 5), 13 + i * 2.2, 15.2 + i * 2.2);
    for (const dx of [-6.2, -2.4, 2.4, 6.2]) P.poly([[x + (dx - 0.5) * P.m, 13], [x + dx * P.m, 21], [x + (dx + 0.5) * P.m, 13]]);
    P.tower(x, [[1.6, 26]], 'spire'); for (let i = 0; i < 4; i++) P.win(x + (-4.5 + i * 3) * P.m, 6, 0.8, 1.2, 2.4);
    const sj = P.X(0.33); P.box(sj + 14 * P.m, 40, -5, 14); P.poly([[sj - 6 * P.m, 14], [sj + 14 * P.m, 24], [sj + 34 * P.m, 14]]); P.tower(sj - 8 * P.m, [[7, 30]], 'lantern', true);
  },
  zeeland: P => {   // the storm barrier: piers in a long row with their gates, the deck on top; the Lange Jan of Middelburg far left
    for (let i = 0; i < 16; i++) { const x = P.X(0.55 + i * 0.028); P.box(x, 3.4, -5, 13); P.box(x, 5, 13, 15); if (i % 4 === 0) P.win(x, 14, 0.7, 0.8, 0.8); }
    P.box(P.X(0.76), 0.44 * 2048 / P.m, 7, 8.5); P.tower(P.X(0.3), [[6, 28], [4.5, 12]], 'lantern', true);
  },
  utrecht: P => { const x = P.X(0.6); P.box(x + 14 * P.m, 22, -5, 18); P.tower(x, [[12, 44], [9, 18], [6, 12]], 'spire', true); },
  denhaag: P => {   // the Ridderzaal between its two turrets, the Torentje, and the Pier's big wheel out by the sea
    const x = P.X(0.6); P.box(x, 16, -5, 14); P.poly([[x - 8 * P.m, 14], [x, 28], [x + 8 * P.m, 14]]);
    for (const dx of [-9, 9]) P.tower(x + dx * P.m, [[2.6, 22]], 'spire'); P.tower(P.X(0.53), [[5, 12]], 'spire', true);
    const wx = P.X(0.84), wy = 26, R = 20; P.g.lineWidth = Math.max(1, 0.8 * P.m); P.g.beginPath(); P.g.arc(wx, P.g.canvas.height - 5 * P.m - wy * P.m, R * P.m, 0, 7); P.g.stroke();
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; P.line(wx, wy, wx + Math.cos(a) * R * P.m, wy + Math.sin(a) * R, 0.25); } P.line(wx, wy, wx - 10 * P.m, -2, 0.8); P.line(wx, wy, wx + 10 * P.m, -2, 0.8);
  },
  rotterdam: P => {   // the Erasmusbrug's bent pylon and its cables, towers with lit floors, the Euromast, harbour cranes
    const x = P.X(0.62); P.poly([[x - 2 * P.m, 10], [x + 2 * P.m, 10], [x + 3.6 * P.m, 58], [x + 1.4 * P.m, 70], [x - 0.6 * P.m, 66]]);
    for (let i = 1; i <= 8; i++) { P.line(x + 2.4 * P.m, 66 - i * 3.5, x + (8 + i * 6) * P.m, 10, 0.18); P.line(x, 66 - i * 3.5, x - (6 + i * 4) * P.m, 10, 0.18); } P.box(x + 10 * P.m, 80, 9, 11);
    for (let i = 0; i < 7; i++) { const bx = P.X(0.24 + i * 0.03), bh = P.rr(36, 90), bw = P.rr(10, 16); P.box(bx, bw, -5, bh); for (let f = 4; f < bh - 2; f += 3.5) for (let c = -bw / 2 + 1.5; c < bw / 2 - 1; c += 2.4) if (P.r() < 0.18) P.win(bx + c * P.m, f, P.rr(0.4, 0.9), 1, 1.1); }
    P.box(P.X(0.16), 3, -5, 100); P.box(P.X(0.16), 11, 62, 66);
    for (const cx of [0.82, 0.88]) { const c = P.X(cx); P.line(c, -5, c, 40, 1.2); P.line(c - 8 * P.m, 40, c + 30 * P.m, 40, 1.2); P.line(c, 48, c + 28 * P.m, 40, 0.3); }
  },
  urk: P => { const x = P.X(0.64); P.box(x, 4.2, -5, 17); P.box(x, 3, 17, 20); P.win(x, 17.6, 1, 2.4, 2); P.poly([[x - 1.8 * P.m, 20], [x, 22.5], [x + 1.8 * P.m, 20]]); P.church(P.X(0.52), 20); for (let i = 0; i < 9; i++) P.line(P.X(0.72 + i * 0.022), -2, P.X(0.72 + i * 0.022), P.rr(12, 18), 0.35); },
  texel: P => {
    P.g.beginPath(); P.g.moveTo(0, P.g.canvas.height); for (let i = 0; i <= 40; i++) { const x = i / 40 * 2048; P.g.lineTo(x, P.g.canvas.height - 5 * P.m - (7 + 5 * Math.sin(i * 0.9) + 3 * Math.sin(i * 2.3)) * P.m); } P.g.lineTo(2048, P.g.canvas.height); P.g.fill();
    const x = P.X(0.63); P.box(x, 4.5, -5, 30); P.box(x, 3.4, 30, 34); P.win(x, 30.6, 1, 2.8, 2.6); P.poly([[x - 2 * P.m, 34], [x, 36.5], [x + 2 * P.m, 34]]);
  },
  groningen: P => { P.tower(P.X(0.6), [[10, 34], [8, 18], [6, 12], [4, 8]], 'onion', true); P.box(P.X(0.6) - 16 * P.m, 24, -5, 16); P.poly([[P.X(0.6) - 28 * P.m, 16], [P.X(0.6) - 16 * P.m, 26], [P.X(0.6) - 4 * P.m, 16]]); },
  maastricht: P => {   // the red tower of the Sint-Jan beside the Servaas, the old bridge's arches, the hills behind
    P.tower(P.X(0.6), [[8, 46]], 'spire', true); P.tower(P.X(0.64), [[9, 30], [7, 10]], 'onion');
    for (let i = 0; i < 7; i++) { const x = P.X(0.3 + i * 0.022); P.box(x, 10, 5, 8); P.box(x - 4.5 * P.m, 2, -5, 6); }
  },
  nijmegen: P => {   // the Waalbrug's great arch over the river, the Stevenskerk with its lantern on the hill
    const x = P.X(0.66), span = 70; P.g.lineWidth = Math.max(1.5, 1.6 * P.m); P.g.beginPath(); P.g.ellipse(x, P.g.canvas.height - 5 * P.m - 10 * P.m, span / 2 * P.m, 26 * P.m, 0, Math.PI, 0); P.g.stroke();
    P.box(x, span + 30, 9, 11); for (let i = -6; i <= 6; i++) P.line(x + i * 5 * P.m, 10, x + i * 5 * P.m, 10 + 26 * Math.sqrt(1 - Math.pow(i / 7, 2)), 0.2);
    P.box(P.X(0.36), 30, -5, 18); P.tower(P.X(0.36), [[9, 36], [6, 8]], 'lantern', true);
  },
  amsterdam: P => { P.tower(P.X(0.6), [[8, 40], [6.5, 10], [5, 8]], 'crown', true); P.roofs(0.52, 0.58, 12, 16, 0.25, ['bell', 'step']); P.roofs(0.64, 0.72, 12, 16, 0.25, ['bell', 'step', 'bell']); },
};
// a town's skyline (towns3d skyline): a function paints its landmark on the middle band as SKY_MARKS do; an object { near, mid, far } of
// functions (P, K, theme) paints any of the three bands in place of the default rooftops and trees
function paintSkyline(id, open, wide) {
  let hash = 7; for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) % 2147483000;
  const kinds = townStyle.gables > 0.5 ? ['step', 'bell', 'roof', 'step', 'roof'] : townStyle.gables > 0.1 ? ['roof', 'roof', 'step', 'roof'] : ['flat', 'roof', 'flat'];
  const own = T3().skyline;
  skyBands.forEach((B, i) => {
    const P = skyPainter(B, hash + i * 7919), ownBand = own && typeof own === 'object' ? own[['near', 'mid', 'far'][i]] : null;
    if (ownBand) ownBand(P, townKit(), theme);
    else if (i === 2) {   // farthest: a low line of trees and roofs, spires and mills only as shapes in the haze
      P.trees(0, 1, 5, 10, 10); if (!open) P.roofs(0, 1, 6, 12, 0.04, kinds);
      P.church(P.X(0.47), 40); P.church(P.X(0.24), 30); P.church(P.X(0.92), 34);
      if (open || id === 'alblasserdam' || id === 'kinderdijk' || id === 'gouda') { P.mill(P.X(0.37), 22, 0.4, 1); P.mill(P.X(0.7), 19, 1.2, 1); }
    } else if (i === 1) {   // middle: the town's own landmark on the horizon, roofs and trees round it
      P.trees(0, 1, 7, 13, 13); if (!open) { P.roofs(0, 0.5, 8, 14, 0.1, kinds); P.roofs(0.72, 1, 8, 14, 0.1, kinds); }
      else { P.mill(P.X(0.34), 26, 0.9, 2); P.roofs(0.4, 0.45, 5, 7, 0.3, ['roof']); }
      const sh = wide ? 0 : -0.085 * SKY_CW; P.g.save(); P.g.translate(sh, 0); P.w.save(); P.w.translate(sh, 0); (typeof own === 'function' ? own : SKY_MARKS[id] || SKY_MARKS.alblasserdam)(P, townKit(), theme); P.g.restore(); P.w.restore();
    } else {   // nearest and darkest: rooftops and trees at the sides, the middle kept low so the road runs on into the haze
      if (!open) { P.roofs(0, 0.4, 10, 17, 0.12, kinds); P.roofs(0.6, 1, 10, 17, 0.12, kinds); }
      P.trees(0, 0.42, 9, 17, 9); P.trees(0.58, 1, 9, 17, 9); P.trees(0.42, 0.58, 4, 7, 12);
      if (open) { P.house(P.X(0.3), 9, 4, 'roof', 0.6); P.mill(P.X(0.8), 30, 0.2, 2); }
    }
    for (const c of [B.sil, B.lit]) {   // the feet of everything melt into the ground mist
      const x = c.getContext('2d'); x.save(); x.globalCompositeOperation = 'destination-out';
      const gr = x.createLinearGradient(0, SKY_CH - 12 * B.m, 0, SKY_CH - 3 * B.m); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,1)');
      x.fillStyle = gr; x.fillRect(0, 0, SKY_CW, SKY_CH); x.restore();
    }
    B.a.material.map.needsUpdate = true; B.b.material.map.needsUpdate = true;
  });
}
// the far bands and the ground mist take their colour from the haze, so they dim and darken with it
function tintFar(town) {
  for (const B of skyBands) { B.a.material.color.copy(scene.fog.color).multiplyScalar(B.kLin); if (town != null) B.b.material.opacity = B.wk * town; }
  for (const B of MIST_BANDS) B.mat.color.copy(scene.fog.color).multiplyScalar(B.k);
  M.water.color.copy(scene.fog.color).multiplyScalar(theme.waterK || 0.26); M.puddle.color.copy(scene.fog.color).multiplyScalar(0.8);
}

// the ophaalbrug from the reference, right across the canal: a plank deck on piles, the portal with its balance beams and chains, and one of the dead crossing
function canalBridge() {
  const k = kit(), L = 27;
  kb(k, M.wood, L / 2 + 0.4, 0.42, 0, L, 0.22, 2.6);
  for (let x = 2; x < L; x += 4) for (const z of [-1.1, 1.1]) kb(k, M.wood, x, -0.2, z, 0.28, 1.2, 0.28);
  for (const z of [-1.25, 1.25]) { kb(k, M.wood, L / 2 + 0.4, 1.15, z, L, 0.08, 0.08); for (let x = 1; x < L; x += 1.8) kb(k, M.wood, x, 0.85, z, 0.08, 0.8, 0.08); }
  for (const z of [-1.5, 1.5]) { kb(k, PM.pole, 12, 3.2, z, 0.28, 5.6, 0.28); ktube(k, PM.pole, 7.8, 5.0, z, 20.5, 7.4, z, 0.13); ktube(k, PM.pole, 20.3, 7.3, z * 0.85, 19.8, 0.6, z * 0.82, 0.025); ktube(k, PM.pole, 12, 1.5, z, 9.6, 3.2, z, 0.06); }
  kb(k, PM.pole, 12, 6.0, 0, 0.26, 0.26, 3.3); kb(k, PM.pole, 8.1, 5.05, 0, 0.6, 0.6, 3.2); for (let x = 9; x < 20; x += 1.6) kb(k, PM.pole, x, 5.3 + (x - 8) * 0.19, 0, 0.08, 0.08, 3.0);
  kat(k, 17.5, 0.53, 0.3, Math.PI / 2, 0); for (const [geo, m] of zombieParts('plain')) kadd(k, geo, m || PK.skin[0], 0, 0, 0);
  const g = kbuild(k); g.userData.faceRoad = true; return g;
}

// each town's shops carry its own trades, from content/towns.js; the hanging sign shows the nearest icon on the sheet
const TOWN_SHOPS = {
  alblasserdam: ['BAKKER', 'SLAGER', 'FIETSENMAKER', 'BLOEMEN', 'FRIET', 'CAFÉ DE WERF', 'KAPPER'],
  kinderdijk: ['CAFÉ DE MOLEN', 'KAAS', 'KLOMPEN', 'BAKKER', 'FIETSVERHUUR', 'BLOEMEN'],
  gouda: ['KAASWINKEL', 'DE WAAG', 'SIROOPWAFELS', 'KAARSEN', 'PIJPEN', 'BAKKER', 'CAFÉ'],
  zeeland: ['MOSSELEN', 'VISHANDEL', 'BAKKER', 'CAFÉ DE DIJK', 'FIETSVERHUUR'],
  utrecht: ['FIETSENMAKER', 'FIETSENSTALLING', 'CAFÉ HET TERRAS', 'BAKKER', 'KAPPER', 'BLOEMEN'],
  denhaag: ['CAFÉ', 'BLOEMEN', 'DE MARKTKRAAM', 'KAPPER', 'APOTHEEK', 'FRIET'],
  rotterdam: ['DE MARKTHAL', 'SUPERMARKT', 'FRIET', 'KAPPER', 'WATERTAXI', 'CAFÉ'],
  urk: ['VISAFSLAG', 'VISHANDEL', 'BAKKER', 'CAFÉ DE KOTTER', 'SUPERMARKT'],
  texel: ['SCHAPENKAAS', 'FIETSVERHUUR', 'VISHANDEL', 'CAFÉ DE VEERBOOT', 'BAKKER'],
  groningen: ['FIETSENMAKER', 'CAFÉ', 'KAPPER', 'FRIET', 'STUDENTENKROEG', 'APOTHEEK'],
  maastricht: ['VLAAI', 'CAFÉ', 'BAKKER', 'APOTHEEK', 'SLAGER', 'BLOEMEN'],
  nijmegen: ['CAFÉ', 'FIETSENMAKER', 'GLADIOLEN', 'BAKKER', 'FRIET', 'KAPPER'],
  amsterdam: ['CAFÉ', 'FIETSENMAKER', 'KAAS', 'BLOEMEN', 'FRIET', 'KAPPER', 'HAARLEMMER HARING'],
};
function townShops() { return T3().shops || TOWN_SHOPS[townId] || SHOP_SIGNS; }
const SIGN_KEYS = [['KAAS', 'KAAS'], ['WAAG', 'KAAS'], ['SIROOP', 'BAKKER'], ['STROOP', 'BAKKER'], ['VLAAI', 'BAKKER'], ['BAKKER', 'BAKKER'], ['SLAGER', 'SLAGER'], ['KAPPER', 'KAPPER'], ['APOTHEEK', 'APOTHEEK'],
  ['FIETS', 'FIETSENMAKER'], ['BLOEM', 'BLOEMEN'], ['GLADIO', 'BLOEMEN'], ['FRIET', 'FRIET'], ['KLOMP', 'KLOMPEN'], ['CAF', 'CAFÉ'], ['KROEG', 'CAFÉ'], ['TERRAS', 'CAFÉ']];
function signIcon(name) { const n = (name || '').toUpperCase(); for (const [k, v] of SIGN_KEYS) if (n.includes(k)) return v; return 'SUPERMARKT'; }
// fingerposts point to the town's own landmarks
function townSigns() {
  if (T3().signs) return T3().signs.slice().sort(() => Math.random() - 0.5).slice(0, 3);
  const t = (window.TOWNS || []).find(t => t.id === townId);
  const names = t && t.landmarks ? t.landmarks.map(l => l.name.replace(/^(De|Het)\s+/, '')).filter(n => n.length <= 16) : [];
  return names.length >= 2 ? names.sort(() => Math.random() - 0.5).slice(0, 3) : ['Dorp', 'Molen', 'Kerk'];
}
const GRACHT_TOWNS = new Set(['alblasserdam', 'kinderdijk', 'gouda', 'utrecht', 'amsterdam']);   // where a 'street' level runs along a canal, as in the reference

export { backRow, canalBridge, crane, flagNL, GRACHT_TOWNS, LANDMARK, lighthouse, paintSkyline, sheep, signIcon, SKY_MARKS, skyBands, terrace,
  tintFar, tower, TOWN_EXTRA, townShops, townSigns, treeCard };
