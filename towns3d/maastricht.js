// Maastricht: the far south, almost another country. A valley ringed by dark hill rims above a warm lit town. The streets climb and dip
// on cobbles past Mosan houses in bands of brick and pale stone, yellow marl and slate with tall shutters, and the houses of a row step up
// the slope one by one. The Vrijthof's café terraces under the Sint-Servaas and the red tower of the Sint-Jan, the Helpoort, the Sint
// Servaasbrug on the skyline; the dead in carnival costume, with a brass band. API: towns3d/README.md; research: Opus 5.5 DT/research, part 3.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  let K = null, THREE = null;
  const C = {};   // materials, textures and geometries: made once on first use and kept

  // ---------- hills: the streets climb and dip, and a row of houses steps with them ----------
  const HILLS = { street: { amp: 7, len: 340 }, shops: { amp: 6, len: 340 }, square: { amp: 4, len: 400 } };
  const HU = { d: { value: 0 }, a: { value: 0 }, l: { value: 420 } };
  let phase = null;
  function hillTick() {   // the engine's own ground profile (README: hills) at the bike; ?hillphase= read as the engine reads it
    if (phase == null) phase = parseFloat(new URLSearchParams(location.search).get('hillphase')) || 0;
    const S = window.NR; HU.d.value = (S && typeof S.dist === 'number' ? S.dist : 0) + phase;
  }
  function useHills(h) { HU.a.value = h ? h.amp : 0; HU.l.value = h ? h.len : 420; }
  // a row is one merged mesh per material; in the vertex shader each 6 m slot of it (one house) is lifted to the ground under its own
  // middle, so the houses step up the street instead of the whole row floating at one end and sinking at the other
  const STEP_HEAD = 'uniform float uHD, uHA, uHL;\nfloat nrHill(float d) { return uHA * sin(d * 6.2832 / uHL) + uHA * 0.3 * sin(d * 6.2832 / (uHL * 0.37) + 1.7); }\n';
  const STEP_BODY = '\nif (uHA > 0.0) { vec4 nrS = modelMatrix * vec4(0.0, 0.0, floor(position.z / 6.0 + 0.5) * 6.0, 1.0); transformed.y += nrHill(uHD - nrS.z) - nrHill(uHD - modelMatrix[3].z); }';
  function keep(m) { m.userData.shared = true; return m; }
  function step(m) {
    const prev = m.onBeforeCompile, prevKey = Object.prototype.hasOwnProperty.call(m, 'customProgramCacheKey') ? m.customProgramCacheKey : null;
    m.onBeforeCompile = (sh, r) => {
      if (prev) prev(sh, r);
      sh.uniforms.uHD = HU.d; sh.uniforms.uHA = HU.a; sh.uniforms.uHL = HU.l;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\n' + STEP_HEAD).replace('#include <begin_vertex>', '#include <begin_vertex>' + STEP_BODY);
    };
    m.customProgramCacheKey = () => (prevKey ? prevKey() : '') + 'nrStepMaas';
    return keep(m);
  }
  function wuv(m, s) { m.userData.wuv = s; return m; }

  // ---------- one palette for every flat-coloured part: stone bands, shutters, doors, iron and the costumes are one material ----------
  const PAL = [0xa39d8f, 0xa8956a, 0xb7b0a0, 0x3d434a, 0x4f6258, 0x8c928b, 0x2e231b, 0x131518, 0xc8291e, 0xe6b41e, 0x22903a, 0xdedad0, 0xd0a238, 0x2c4ca8, 0xc63c88, 0x5c2620];
  const STONE = 0, MARL = 1, PLASTER = 2, NAMUR = 3, SHUT = 4, SHUT2 = 5, DOOR = 6, IRON = 7, RED = 8, YEL = 9, GRN = 10, WHITE = 11, BRASS = 12, BLUE = 13, PINK = 14, AWN = 15;
  const LPAL = [0xffd28a, 0xfff0cc, 0xff6448, 0xffb45c];   // lights: lantern glass, bulbs, the red floodlight, amber
  const LANT = 0, BULB = 1;
  function palTex(cols) {
    const c = document.createElement('canvas'); c.width = 64; c.height = 4; const g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, 64, 4); cols.forEach((col, i) => { g.fillStyle = '#' + col.toString(16).padStart(6, '0'); g.fillRect(i * 4, 0, 4, 4); });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; return t;
  }
  const PGEO = new Map();
  function pgeo(base, i) {   // a copy of a unit part whose UVs all point at one palette cell; the kit copies it, it is never drawn itself
    const key = base.uuid + ':' + i; let q = PGEO.get(key);
    if (!q) { q = base.clone(); const uv = q.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, (i + 0.5) / 16, 0.5); PGEO.set(key, q); }
    return q;
  }
  const pb = (k, i, x, y, z, sx, sy, sz, rx, ry, rz, m) => K.kadd(k, pgeo(K.KG.box, i), m || C.pal, x, y, z, rx, ry, rz, sx, sy, sz);
  const pa = (k, geo, i, x, y, z, rx, ry, rz, sx, sy, sz, m) => K.kadd(k, pgeo(geo, i), m || C.pal, x, y, z, rx, ry, rz, sx, sy, sz);
  let _q, _e, _d, _up;
  function pt(k, i, ax, ay, az, bx, by, bz, r, m) {   // a palette tube from a to b
    _d.set(bx - ax, by - ay, bz - az); const len = _d.length(); _q.setFromUnitVectors(_up, _d.multiplyScalar(1 / len)); _e.setFromQuaternion(_q, 'XYZ');
    K.kadd(k, pgeo(K.KG.cyl6, i), m || C.pal, (ax + bx) / 2, (ay + by) / 2, (az + bz) / 2, _e.x, _e.y, _e.z, r * 2, len, r * 2);
  }
  function build(k, g) { K.kbuild(k, g); g.traverse(m => { if (m.isMesh) m.onBeforeRender = hillTick; }); return g; }

  // ---------- shop and café signs: one atlas, so every sign in a row is part of one mesh ----------
  const SHOPS = ['VLAAI', 'BAKKERIJ', 'BOEKHANDEL', 'APOTHEEK', 'WIJNHANDEL', 'CHOCOLATERIE', 'SLAGERIJ', 'KAPPER', 'HOEDEN', 'ANTIQUAIR', 'KAASHANDEL', 'BLOEMEN'];
  const CAFES = ['CAFÉ SJENG', 'CAFÉ TOT GAW', "IN 'T MOOSWIEF", 'EETCAFÉ', 'BRASSERIE', 'BIERCAFÉ', 'ZUURVLEES', 'CAFÉ DE PREUVERIJ'];
  const SIGNS = SHOPS.concat(CAFES), SROWS = Math.ceil(SIGNS.length / 2);
  function signTex() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = SROWS * 64; const g = c.getContext('2d');
    SIGNS.forEach((s, i) => {
      const x = (i % 2) * 512, y = Math.floor(i / 2) * 64;
      g.fillStyle = '#16181c'; g.fillRect(x, y, 512, 64); g.strokeStyle = '#7d6c48'; g.lineWidth = 3; g.strokeRect(x + 5, y + 5, 502, 54);
      let fs = 38; g.font = `bold ${fs}px Georgia, serif`; while (g.measureText(s).width > 460 && fs > 18) { fs -= 2; g.font = `bold ${fs}px Georgia, serif`; }
      g.fillStyle = '#e4cf98'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, x + 256, y + 34);
    });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  const SGEO = [];
  function signGeo(i) {
    if (!SGEO[i]) { const q = new THREE.PlaneGeometry(1, 1), uv = q.attributes.uv, u0 = (i % 2) * 0.5, v1 = 1 - Math.floor(i / 2) / SROWS, v0 = v1 - 1 / SROWS; for (let j = 0; j < uv.count; j++) uv.setXY(j, u0 + uv.getX(j) * 0.5, v0 + uv.getY(j) * (v1 - v0)); SGEO[i] = q; }
    return SGEO[i];
  }
  // slate: small dark plates in courses, for the tall roofs
  function slateTex() {
    const N = 256, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'); let s = 23; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    g.fillStyle = 'rgb(60,64,74)'; g.fillRect(0, 0, N, N);
    for (let row = 0; row < N / 16; row++) for (let x = -32; x < N; x += 32) {
      const v = 150 + (r() - 0.5) * 46, xx = x + (row % 2 ? 16 : 0);
      g.fillStyle = `rgb(${v - 10 | 0},${v - 5 | 0},${v + 8 | 0})`; g.fillRect(xx + 1, row * 16, 30, 14); g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(xx + 1, row * 16 + 13, 30, 2);
    }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  function init(K0) {
    if (C.pal) return; K = K0; THREE = K.THREE;
    _q = new THREE.Quaternion(); _e = new THREE.Euler(); _d = new THREE.Vector3(); _up = new THREE.Vector3(0, 1, 0);
    const warm = 0x7a5a64, cool = 0x5d5f8e, DS = THREE.DoubleSide, pt0 = palTex(PAL), lt = palTex(LPAL), bt = K.brickMat(0x808080).map, st = slateTex();
    C.pal = step(K.Mat({ map: pt0, emissive: 0xffffff, emissiveMap: pt0, emissiveIntensity: 0.05 }, warm));
    C.palE = step(new THREE.MeshBasicMaterial({ map: lt }));
    C.palR = keep(K.Mat({ map: pt0, emissive: 0xffffff, emissiveMap: pt0, emissiveIntensity: 0.05 }, warm));
    C.palER = keep(new THREE.MeshBasicMaterial({ map: lt }));
    C.palC = keep(K.Mat({ map: pt0, emissive: 0xffffff, emissiveMap: pt0, emissiveIntensity: 0.3, side: DS }, warm));   // carnival: the one place where the dead are colourful
    C.brick = [0x6c4436, 0x5a3a30, 0x7a5040].map(c => wuv(step(K.Mat({ color: c, map: bt, side: DS }, warm)), 2.6));
    C.marl = wuv(step(K.Mat({ color: 0xb39b62, map: bt, side: DS }, warm)), 5.4);
    C.slate = wuv(step(K.Mat({ color: 0x8a909c, map: st }, cool)), 2.2);
    C.win = step(new THREE.MeshBasicMaterial({ map: K.PM.winAtlas.map }));
    C.glow = step(K.GlowMat(K.glowTex, 0xffb466, 0.42, false, { side: DS }));
    C.sign = step(new THREE.MeshBasicMaterial({ map: signTex(), color: 0xcfc6b2 }));
    C.stoneR = wuv(keep(K.Mat({ color: 0x8c8474, map: bt, side: DS, emissive: 0x1c1712 }, warm)), 6.5);
    C.marlR = wuv(keep(K.Mat({ color: 0xa8956a, map: bt, side: DS, emissive: 0x1a1508 }, warm)), 5.4);
    C.redR = wuv(keep(K.Mat({ color: 0xa83a28, map: bt, emissive: 0x6a1a10, emissiveIntensity: 0.9 }, warm)), 6.5);
    C.slateR = wuv(keep(K.Mat({ color: 0x8a909c, map: st }, cool)), 2.2);
    C.winR = keep(new THREE.MeshBasicMaterial({ map: K.PM.winAtlas.map }));
    C.glowR = keep(K.GlowMat(K.glowTex, 0xffb466, 0.45, false, { side: DS }));
    C.flood = keep(K.GlowMat(K.glowTex, 0xff6a44, 0.16, false, { side: DS }));
    const tri = new THREE.BufferGeometry(); tri.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, 0, 0, 0.5, 0, 0, 0, 1, 0], 3));
    tri.setAttribute('normal', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 0, 0, 1], 3)); tri.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2)); C.tri = tri;
    C.hex = new THREE.CylinderGeometry(0.5, 0.4, 1, 6); C.cone6 = new THREE.ConeGeometry(0.5, 1, 6); C.cone8 = new THREE.ConeGeometry(0.5, 1, 8); C.cone4 = new THREE.ConeGeometry(0.5, 1, 4);
    C.oct = new THREE.CylinderGeometry(0.5, 0.5, 1, 8); C.torus = new THREE.TorusGeometry(0.36, 0.05, 6, 16); C.bell = new THREE.CylinderGeometry(0.34, 0.07, 0.5, 12, 1, true);
    C.sheet = new THREE.CylinderGeometry(0.2, 0.44, 1.2, 10, 1, true); C.para = new THREE.ConeGeometry(0.5, 1, 10, 1, true);
    C.gable = gableGeo(2.95, 4.5, 5);
    const ar = new THREE.Shape(); ar.moveTo(-1.6, -0.2); ar.lineTo(1.6, -0.2); ar.lineTo(1.6, 3.6); ar.quadraticCurveTo(1.45, 5.3, 0, 6.0); ar.quadraticCurveTo(-1.45, 5.3, -1.6, 3.6); ar.closePath(); C.arch = new THREE.ShapeGeometry(ar);
  }
  // a Mosan stepped gable: the lowest step as wide as the house, so the roof behind never shows past it
  function gableGeo(hw, top, n) {
    const sw = hw * 0.28, w = i => hw - (hw - sw) * i / (n - 1), s = new THREE.Shape(); s.moveTo(-hw, -0.3); s.lineTo(hw, -0.3);
    for (let i = 0; i < n; i++) { s.lineTo(w(i), top * (i + 1) / n); if (i < n - 1) s.lineTo(w(i + 1), top * (i + 1) / n); }
    for (let i = n - 1; i >= 0; i--) { s.lineTo(-w(i), top * (i + 1) / n); if (i > 0) s.lineTo(-w(i), top * i / n); }
    s.lineTo(-hw, -0.3); return new THREE.ShapeGeometry(s);
  }

  // ---------- the houses: Maaslandse renaissance, marl and plaster under tall slate roofs ----------
  const FX = -1.6, HF = 2.95;   // the street facade (local x; the road is toward -x) and half a frontage: every part of a house stays in its 6 m slot
  const GF = 3.5, FH = 2.9;     // ground floor and upper floor heights
  const YAW = -Math.PI / 2;
  function win(k, x0, y, z, lit, shut, wh) {   // a tall window with a stone surround, shutters beside it when the house has them
    const r0 = Math.random(), on = r0 < lit, cell = on ? K.pick([0, 0, 1, 1, 2]) : r0 < lit + 0.18 ? 3 : Math.random() < 0.7 ? 4 : 5;
    K.kadd(k, K.PG['win' + cell], C.win, x0 - 0.07, y, z, 0, YAW, 0, 1.0, wh);
    if (on) K.kadd(k, K.KG.plane, C.glow, x0 - 0.13, y, z, 0, YAW, 0, 2.5, 2.8);
    pb(k, STONE, x0 - 0.07, y + wh / 2 + 0.11, z, 0.14, 0.22, 1.36); pb(k, STONE, x0 - 0.1, y - wh / 2 - 0.05, z, 0.2, 0.1, 1.3);
    for (const s of [-1, 1]) pb(k, STONE, x0 - 0.05, y, z + s * 0.58, 0.1, wh, 0.14);
    if (shut >= 0) for (const s of [-1, 1]) { pb(k, shut, x0 - 0.09, y, z + s * 0.92, 0.04, wh + 0.05, 0.5); pb(k, IRON, x0 - 0.12, y, z + s * 0.92, 0.02, 0.05, 0.44); }
  }
  function door(k, x0, z, lamp, side) {   // a tall wooden door in a stone frame, a fanlight, a step of blue stone; sometimes a lantern on a bracket
    pb(k, DOOR, x0 - 0.05, 1.25, z, 0.08, 2.5, 1.12); pb(k, STONE, x0 - 0.08, 2.64, z, 0.14, 0.26, 1.52);
    for (const s of [-1, 1]) pb(k, STONE, x0 - 0.07, 1.3, z + s * 0.66, 0.12, 2.6, 0.16);
    K.kadd(k, K.PG.fan0, C.win, x0 - 0.07, 2.97, z, 0, YAW, 0, 1.0, 0.36); pb(k, NAMUR, x0 - 0.32, 0.1, z, 0.5, 0.22, 1.5);
    if (lamp) {
      const lz = z + side * 1.0;
      pb(k, IRON, x0 - 0.3, 3.5, lz, 0.55, 0.05, 0.05); pa(k, K.KG.box, LANT, x0 - 0.55, 3.24, lz, 0, 0, 0, 0.24, 0.36, 0.24, C.palE);
      pb(k, IRON, x0 - 0.55, 3.47, lz, 0.32, 0.1, 0.32); pb(k, IRON, x0 - 0.55, 3.02, lz, 0.26, 0.06, 0.26);
      K.kadd(k, K.KG.plane, C.glow, x0 - 0.62, 3.2, lz, 0, YAW, 0, 2.6, 2.6);
    }
  }
  function table(k, x, z, m) {   // a round café table with two chairs
    pa(k, K.KG.cyl, IRON, x, 0.74, z, 0, 0, 0, 0.66, 0.04, 0.66, m); pb(k, IRON, x, 0.37, z, 0.05, 0.72, 0.05, 0, 0, 0, m);
    for (const s of [-1, 1]) { pb(k, IRON, x, 0.46, z + s * 0.56, 0.42, 0.04, 0.4, 0, 0, 0, m); pb(k, IRON, x, 0.7, z + s * 0.76, 0.42, 0.5, 0.04, 0, 0, 0, m); pb(k, IRON, x, 0.23, z + s * 0.56, 0.36, 0.46, 0.03, 0, 0, 0, m); }
  }
  function shopFront(k, x0, oz, cafe, si, tables) {   // a lit shop window or café across the ground floor, the name board above, the door beside it
    const z = oz - 0.45;
    K.kadd(k, K.PG[cafe ? 'shop1' : 'shop0'], C.win, x0 - 0.07, 1.55, z, 0, YAW, 0, 3.7, 2.1);
    K.kadd(k, K.KG.plane, C.glow, x0 - 0.15, 1.6, z, 0, YAW, 0, 6.2, 4.2);
    pb(k, DOOR, x0 - 0.07, 0.25, z, 0.12, 0.5, 3.95); pb(k, DOOR, x0 - 0.07, 2.66, z, 0.12, 0.16, 3.95);
    for (const dz of [-1.92, -0.62, 0.62, 1.92]) pb(k, DOOR, x0 - 0.09, 1.45, z + dz, 0.08, 2.4, 0.09);
    K.kadd(k, signGeo(si), C.sign, x0 - 0.12, 3.08, z, 0, YAW, 0, 3.6, 0.45);
    pb(k, DOOR, x0 - 0.05, 1.2, oz + 2.3, 0.08, 2.4, 0.86); K.kadd(k, K.PG.fan3, C.win, x0 - 0.06, 2.6, oz + 2.3, 0, YAW, 0, 0.8, 0.3);
    if (!cafe) return;
    pb(k, AWN, x0 - 0.75, 3.04, z, 1.55, 0.06, 4.1, 0, 0, 0.32); pb(k, AWN, x0 - 1.48, 2.8, z, 0.04, 0.28, 4.1);   // the awning over the terrace
    for (let i = 0; i < 7; i++) pa(k, K.KG.ball, BULB, x0 - 1.52, 2.6 - Math.sin(i / 6 * Math.PI) * 0.12, z - 1.8 + i * 0.6, 0, 0, 0, 0.1, 0.1, 0.1, C.palE);
    for (const dz of [-1.1, 1.1]) K.kadd(k, K.KG.plane, C.glow, x0 - 1.56, 2.5, z + dz, 0, YAW, 0, 2.6, 2.4);
    if (tables) for (const dz of [-1.3, 1.1]) table(k, x0 - 1.7, oz + dz);
  }
  function eavesRoof(k, x0, x1, xm, h, oz, wall, cell, lit, bays) {   // a tall slate roof, its eaves to the street, dormers in it
    const rh = K.rnd(2.9, 4.1), run = xm - x0 + 0.3, a = Math.atan2(rh, run), sl = Math.hypot(run, rh) + 0.1;
    K.kb(k, C.slate, xm - run / 2, h + rh / 2, oz, sl, 0.14, 2 * HF, 0, 0, a); K.kb(k, C.slate, xm + run / 2, h + rh / 2, oz, sl, 0.14, 2 * HF, 0, 0, -a);
    K.kb(k, C.slate, xm, h + rh + 0.02, oz, 0.34, 0.12, 2 * HF);
    for (const s of [-1, 1]) { if (wall) K.kadd(k, C.tri, wall, xm, h - 0.05, oz + s * (HF - 0.01), 0, 0, 0, 2 * run, rh + 0.05, 1); else pa(k, C.tri, cell, xm, h - 0.05, oz + s * (HF - 0.01), 0, 0, 0, 2 * run, rh + 0.05, 1); }
    const n = Math.random() < 0.8 ? (bays === 3 ? 2 : 1) : 0, zs = bays === 3 ? [-1.5, 1.5] : [K.pick([-1.4, 1.4])];
    for (let i = 0; i < n; i++) {
      const z = oz + zs[i], xd = x0 + 0.9, yd = h + (xd - (x0 - 0.3)) * Math.tan(a), on = Math.random() < lit * 0.8;
      K.kb(k, C.slate, xd + 0.75, yd + 0.5, z, 1.5, 1.6, 1.25);
      K.kadd(k, K.PG['win' + (on ? K.pick([0, 1, 2]) : K.pick([3, 4, 4]))], C.win, xd - 0.01, yd + 0.55, z, 0, YAW, 0, 0.78, 1.0);
      if (on) K.kadd(k, K.KG.plane, C.glow, xd - 0.06, yd + 0.55, z, 0, YAW, 0, 1.8, 1.9);
      K.kb(k, C.slate, xd + 0.65, yd + 1.36, z, 1.8, 0.1, 1.45);
    }
    if (Math.random() < 0.8) { const cz = oz + K.pick([-2.35, 2.35]); K.kb(k, wall || C.brick[1], xm + 0.3, h + rh + 0.1, cz, 0.62, 2.0, 0.62); pb(k, NAMUR, xm + 0.3, h + rh + 1.14, cz, 0.78, 0.1, 0.78); }
  }
  function gableRoof(k, x0, x1, xm, h, oz, wall, lit) {   // the stepped gable to the street, brick banded with stone, copings on every step
    const ridge = 3.5, run = 2.88, slope = Math.atan2(ridge, run), sl = Math.hypot(run, ridge), top = 4.5, n = 5, sw = HF * 0.28, w = i => HF - (HF - sw) * i / (n - 1);
    for (const s of [-1, 1]) K.kb(k, C.slate, xm + 0.25, h + ridge / 2 - 0.02, oz + s * run / 2, x1 - x0 - 0.2, 0.12, sl, s * slope, 0, 0);
    K.kadd(k, C.gable, wall, x0 - 0.03, h, oz, 0, Math.PI / 2, 0);
    for (let i = 0; i < n; i++) {
      const v = h + top * (i + 1) / n, ww = w(i), wn = i < n - 1 ? w(i + 1) : 0;
      for (const s of [-1, 1]) pb(k, STONE, x0 - 0.06, v + 0.05, oz + s * (ww + wn) / 2, 0.3, 0.12, ww - wn + 0.12);
      for (let y = h + top * i / n + 0.3; y < v - 0.1; y += 0.6) pb(k, STONE, x0 - 0.06, y, oz, 0.05, 0.16, 2 * ww - 0.06);
    }
    win(k, x0, h + 1.5, oz, lit * 0.7, -1, 1.3);
  }
  // one house in the row, centred at local z = oz. kind: 'band' (brick and stone courses), 'marl', 'plaster', 'white', 'gable'
  function house(k, oz, o) {
    const D = 6.4, x0 = FX, x1 = FX + D, xm = x0 + D / 2, kind = o.kind, nu = o.floors, lit = o.lit, h = GF + nu * FH + 0.35;
    const wall = kind === 'marl' ? C.marl : kind === 'band' || kind === 'gable' ? o.brick : null, cell = kind === 'white' ? WHITE : PLASTER;
    if (wall) K.kb(k, wall, xm, (h - 2.2) / 2, oz, D, h + 2.2, 2 * HF); else pb(k, cell, xm, (h - 2.2) / 2, oz, D, h + 2.2, 2 * HF);
    pb(k, NAMUR, x0 - 0.04, -0.55, oz, 0.1, 2.3, 2 * HF);   // a plinth of blue Namur stone, deep enough to fill the step on a slope
    if (kind === 'band' || kind === 'gable') for (let y = 0.95; y < h - 0.25; y += 0.62) pb(k, STONE, x0 - 0.025, y, oz, 0.05, 0.17, 2 * HF);
    else for (const y of [GF - 0.15, h - 0.32]) pb(k, kind === 'marl' ? STONE : NAMUR, x0 - 0.04, y, oz, 0.08, 0.22, 2 * HF);
    if (kind !== 'gable') pb(k, kind === 'band' || kind === 'marl' ? STONE : DOOR, x0 - 0.15, h - 0.08, oz, 0.32, 0.2, 2 * HF);
    const bays = kind === 'band' ? 3 : 2, dzs = bays === 3 ? [-1.95, 0, 1.95] : [-1.4, 1.4];
    const shut = bays === 3 ? -1 : Math.random() < 0.85 ? (kind === 'white' ? SHUT : K.pick([SHUT, SHUT, SHUT2])) : -1;
    const di = Math.random() < 0.5 ? 0 : bays - 1;
    for (let f = 0; f <= nu; f++) {
      const wy = f === 0 ? 1.9 : GF + (f - 1) * FH + FH * 0.5, wh = f === 0 ? 1.9 : f === nu ? 1.5 : 1.75;
      for (let b = 0; b < bays; b++) if (!(f === 0 && (o.front || b === di))) win(k, x0, wy, oz + dzs[b], lit, shut, wh);
    }
    if (o.front) shopFront(k, x0, oz, o.front === 'cafe', o.sign, o.tables);
    else door(k, x0, oz + dzs[di], Math.random() < 0.32, dzs[di] > 0 ? -1 : 1);
    if (kind === 'gable') gableRoof(k, x0, x1, xm, h, oz, wall, lit); else eavesRoof(k, x0, x1, xm, h, oz, wall, cell, lit, bays);
  }
  let shopI = 0, cafeI = 0;
  // a row of n houses wall to wall (n odd, so the slots sit at 0, 6, 12 m either side of the middle)
  function row(K0, n, o) {
    init(K0); useHills(o.hills);
    const g = new THREE.Group(), k = K.kit(), brick = K.pick(C.brick);
    for (let i = 0; i < n; i++) {
      const front = o.shops && Math.random() < o.shops ? 'shop' : o.cafes && Math.random() < o.cafes ? 'cafe' : null;
      const sign = front === 'shop' ? (shopI++) % SHOPS.length : front === 'cafe' ? SHOPS.length + (cafeI++) % CAFES.length : 0;
      house(k, (i - (n - 1) / 2) * 6, { kind: K.pick(o.kinds), floors: K.pick(o.floors || [2, 2, 3]), lit: o.lit == null ? 0.4 : o.lit, brick: Math.random() < 0.3 ? K.pick(C.brick) : brick, front, sign, tables: o.tables });
    }
    build(k, g); g.userData.faceRoad = true; return g;
  }
  // the town climbing behind the street: plainer, taller and higher up the hill; windows and roofs, the haze does the rest
  function backRow(K0, n, o) {
    init(K0); useHills(o.hills);
    const g = new THREE.Group(), k = K.kit(), x0 = FX, D = 7, xm = x0 + D / 2;
    for (let i = 0; i < n; i++) {
      const oz = (i - (n - 1) / 2) * 6, kind = K.pick(['band', 'marl', 'plaster', 'marl']), nu = K.pick([2, 3, 3, 4]), h = GF + nu * FH + 0.3;
      const wall = kind === 'marl' ? C.marl : kind === 'band' ? K.pick(C.brick) : null;
      if (wall) K.kb(k, wall, xm, (h - 4) / 2, oz, D, h + 4, 2 * HF); else pb(k, PLASTER, xm, (h - 4) / 2, oz, D, h + 4, 2 * HF);
      for (let f = 0; f <= nu; f++) for (const dz of [-1.4, 1.4]) {
        const y = f === 0 ? 1.9 : GF + (f - 1) * FH + FH * 0.5, r0 = Math.random(), on = r0 < 0.24;
        K.kadd(k, K.PG['win' + (on ? K.pick([0, 1, 2]) : r0 < 0.4 ? 3 : 4)], C.win, x0 - 0.03, y, oz + dz, 0, YAW, 0, 1.0, 1.6);
        if (on) K.kadd(k, K.KG.plane, C.glow, x0 - 0.08, y, oz + dz, 0, YAW, 0, 2.3, 2.6);
      }
      const rh = K.rnd(3, 4.4), run = D / 2 + 0.3, a = Math.atan2(rh, run), sl = Math.hypot(run, rh) + 0.1;
      K.kb(k, C.slate, xm - run / 2, h + rh / 2, oz, sl, 0.14, 2 * HF, 0, 0, a); K.kb(k, C.slate, xm + run / 2, h + rh / 2, oz, sl, 0.14, 2 * HF, 0, 0, -a);
      for (const s of [-1, 1]) { if (wall) K.kadd(k, C.tri, wall, xm, h - 0.05, oz + s * (HF - 0.01), 0, 0, 0, 2 * run, rh + 0.05, 1); else pa(k, C.tri, PLASTER, xm, h - 0.05, oz + s * (HF - 0.01), 0, 0, 0, 2 * run, rh + 0.05, 1); }
    }
    build(k, g); g.userData.faceRoad = true; return g;
  }
  // ---------- street furniture ----------
  function lamp(K0) {   // a cast-iron post with a six-sided lantern under a crown, warm gold
    init(K0); const g = new THREE.Group(), k = K.kit();
    pb(k, IRON, 0, 0.35, 0, 0.36, 0.7, 0.36); pa(k, K.KG.cyl, IRON, 0, 0.78, 0, 0, 0, 0, 0.3, 0.16, 0.3); pa(k, K.KG.cyl, IRON, 0, 2.1, 0, 0, 0, 0, 0.12, 2.6, 0.12);
    pa(k, K.KG.cyl, IRON, 0, 3.4, 0, 0, 0, 0, 0.24, 0.1, 0.24); pa(k, K.KG.cyl, IRON, 0, 3.5, 0, 0, 0, 0, 0.44, 0.06, 0.44);
    pa(k, C.hex, LANT, 0, 3.8, 0, 0, 0, 0, 0.42, 0.56, 0.42, C.palE);
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; pb(k, IRON, Math.cos(a) * 0.2, 3.8, Math.sin(a) * 0.2, 0.03, 0.58, 0.03); }
    pa(k, C.cone6, IRON, 0, 4.22, 0, 0, 0, 0, 0.58, 0.32, 0.58); pa(k, K.KG.ball, IRON, 0, 4.45, 0, 0, 0, 0, 0.1, 0.16, 0.1);
    build(k, g); K.lampLights(g, 0, 3.8, 1); g.userData.faceRoad = true; return g;
  }
  function bunting(K0, H) {   // carnival: strings of red, yellow and green pennants and bulbs from house to house, high over the street
    init(K0); useHills(H); const g = new THREE.Group(), k = K.kit(), cols = [RED, YEL, GRN];
    for (const [dz, y0] of [[0, 8.4], [1.4, 8.1]]) {
      const sag = y => y0 - 1.0 * (1 - y * y);
      for (let i = 0; i <= 24; i++) {
        const u = -1 + i / 12, x = u * 6.4, y = sag(u);
        if (i < 24) { const u2 = -1 + (i + 1) / 12; pt(k, IRON, x, y, dz, u2 * 6.4, sag(u2), dz, 0.012, C.palR); }
        if (i % 2) pa(k, C.cone4, cols[i % 3], x, y - 0.26, dz, Math.PI, 0, 0, 0.36, 0.46, 0.05, C.palR);
        else pa(k, K.KG.ball, BULB, x, y - 0.05, dz, 0, 0, 0, 0.09, 0.09, 0.09, C.palER);
      }
    }
    build(k, g); return g;
  }
  // ---------- the Helpoort: the oldest city gate in the country, in the row of houses ----------
  function helpoort(K0, H) {
    init(K0); useHills(H);
    const g = new THREE.Group(), k = K.kit(), S = C.stoneR, x0 = FX;
    for (const s of [-1, 1]) {   // the city wall running off both ways, marl over blue stone, with its battlements
      K.kb(k, S, x0 + 1.2, 1.6, s * 10, 2.4, 7.2, 8); pb(k, NAMUR, x0 - 0.03, -0.6, s * 10, 0.1, 2.4, 8, 0, 0, 0, C.palR);
      for (let i = 0; i < 4; i++) K.kb(k, S, x0 + 0.4, 5.6, s * (7 + i * 2), 0.8, 0.8, 1.0);
    }
    K.kb(k, S, x0 + 3.2, 4, 0, 6.4, 12, 7.4);   // the gate house
    pa(k, C.arch, IRON, x0 - 0.03, 0, 0, 0, YAW, 0, 1, 1, 1, C.palR);   // the dark pointed arch through it
    pa(k, K.KG.box, LANT, x0 + 0.5, 4.2, 0, 0, 0, 0, 0.26, 0.4, 0.26, C.palER); pb(k, IRON, x0 + 0.5, 5.0, 0, 0.04, 1.2, 0.04, 0, 0, 0, C.palR);
    K.kadd(k, K.KG.plane, C.glowR, x0 - 0.2, 3.4, 0, 0, YAW, 0, 3.2, 4.4);
    for (const s of [-1, 1]) K.kadd(k, K.PG.win3, C.winR, x0 - 0.04, 7.6, s * 1.6, 0, YAW, 0, 0.7, 1.1);
    K.kadd(k, C.cone4, C.slateR, x0 + 3.2, 12.0, 0, 0, Math.PI / 4, 0, 9.6, 4.2, 10.6);
    for (const s of [-1, 1]) {   // two round towers under slate cones
      K.kadd(k, C.oct, S, x0 + 2.2, 4.25, s * 5.0, 0, 0, 0, 4.4, 12.5, 4.4);
      K.kadd(k, C.cone8, C.slateR, x0 + 2.2, 13.2, s * 5.0, 0, 0, 0, 5.2, 5.4, 5.2);
      K.kadd(k, K.PG.win4, C.winR, x0 - 0.02, 7.5, s * 5.0, 0, YAW, 0, 0.5, 0.9);
    }
    build(k, g); g.userData.faceRoad = true; return g;
  }
  // ---------- the landmark: the Sint-Servaas's west front and the red tower of the Sint-Jan beside it ----------
  function servaasJan(K0) {
    init(K0);
    const g = new THREE.Group(), k = K.kit(), S = C.stoneR, M = C.marlR;
    // Sint-Servaas: the Romanesque westwork, a massive block between two towers, the long nave behind it
    K.kb(k, S, 7, 12, 10, 14, 28, 15); K.kadd(k, C.tri, S, 7, 26, 10, 0, Math.PI / 2, 0, 15, 6, 1);
    for (const s of [-1, 1]) { K.kb(k, S, 4.4, 15.5, 10 + s * 8.6, 7, 35, 6.6); K.kadd(k, C.cone4, C.slateR, 4.4, 35.6, 10 + s * 8.6, 0, Math.PI / 4, 0, 7.6, 5.6, 7.6); }
    K.kb(k, S, 30, 9, 10, 34, 22, 13);
    for (const s of [-1, 1]) K.kb(k, C.slateR, 30, 22.4, 10 + s * 3.4, 34, 0.3, 7.8, s * 0.72, 0, 0);
    for (let i = 0; i < 3; i++) K.kadd(k, K.PG.win3, C.winR, -0.04, 6 + i * 6.5, 10, 0, YAW, 0, 1.4, 2.6);
    for (const s of [-1, 1]) for (const y of [12, 22]) K.kadd(k, K.PG.win3, C.winR, 0.86, y, 10 + s * 8.6, 0, YAW, 0, 0.9, 1.8);
    K.kadd(k, K.KG.plane, C.glowR, -0.3, 3.2, 10, 0, YAW, 0, 9, 5);
    // Sint-Jan: the Gothic tower painted red and floodlit, an eight-sided top and a slate spire; the nave in pale marl
    K.kb(k, C.redR, 4.5, 16, -14, 8, 36, 8); K.kadd(k, C.oct, C.redR, 4.5, 37.5, -14, 0, Math.PI / 8, 0, 7.2, 7, 7.2);
    for (const s of [-1, 1]) for (const y of [22, 29]) K.kadd(k, K.PG.win4, C.winR, 0.46, y, -14 + s * 2, 0, YAW, 0, 0.9, 2.6);
    K.kadd(k, C.cone8, C.slateR, 4.5, 46, -14, 0, Math.PI / 8, 0, 7.6, 10, 7.6); pb(k, BRASS, 4.5, 51.6, -14, 0.12, 1.4, 0.12, 0, 0, 0, C.palR);
    K.kb(k, M, 18, 8, -14, 19, 20, 11); for (const s of [-1, 1]) K.kb(k, C.slateR, 18, 20.2, -14 + s * 2.9, 19, 0.3, 6.6, s * 0.8, 0, 0);
    for (let i = 0; i < 3; i++) K.kadd(k, K.PG.win3, C.winR, 8.46, 9, -16.5 + i * 2.6, 0, YAW, 0, 1.2, 4);
    K.kadd(k, K.KG.plane, C.flood, -0.4, 16, -14, 0, YAW, 0, 11, 26);   // the floodlight in the haze in front of the red tower
    build(k, g); g.userData.faceRoad = true; return g;
  }
  // ---------- the Vrijthof: café terraces on the square, parasols and strings of bulbs ----------
  function vrijthof(K0, H) {
    init(K0); useHills(H); const g = new THREE.Group(), k = K.kit();
    for (const tx of [0.8, 2.7]) for (const tz of [-2.0, 0, 2.0]) table(k, tx, tz);
    for (const pz of [-1.1, 1.3]) { pb(k, IRON, 1.75, 1.35, pz, 0.06, 2.7, 0.06); pa(k, C.para, K.pick([PLASTER, WHITE, AWN]), 1.75, 2.78, pz, 0, 0, 0, 3.6, 0.7, 3.6); }
    for (let i = 0; i < 9; i++) pa(k, K.KG.ball, BULB, 0.1, 2.55 - Math.sin(i / 8 * Math.PI) * 0.3, -2.6 + i * 0.65, 0, 0, 0, 0.1, 0.1, 0.1, C.palE);
    for (const pz of [-1.1, 1.3]) K.kadd(k, K.KG.plane, C.glow, 1.75, 1.9, pz, 0, 0, 0, 3.4, 2.6);
    pb(k, IRON, 3.9, 0.55, 0, 0.6, 1.1, 2.2);   // a menu board and the waiter's station
    build(k, g); g.userData.faceRoad = true; return g;
  }
  // ---------- the far town: hill rims all round, the lit valley, the two churches and the old bridge, painted on the bands ----------
  const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const Yh = (P, h) => P.g.canvas.height - (5 + h) * P.m;
  function ridge(P, prof, n) { const g = P.g, H = g.canvas.height; g.beginPath(); g.moveTo(0, H); for (let i = 0; i <= n; i++) g.lineTo(P.X(i / n), Yh(P, prof(i / n))); g.lineTo(P.X(1), H); g.closePath(); g.fill(); }
  const SKY = {
    near(P) {   // the hill rims close in on both sides, dark, wooded along the crest, a few farm lights; the lower town lit between them
      const rim = f => { const e = Math.abs(f - 0.5) * 2; return 2 + 40 * sstep(0.16, 0.62, e) + 2.4 * Math.sin(f * 41) + 1.5 * Math.sin(f * 97); };
      ridge(P, rim, 180);
      for (let f = 0.01; f < 0.99; f += 0.004) { const e = rim(f); if (e > 9 && P.r() < 0.75) P.tree(P.X(f), e + P.rr(2.5, 6), P.rr(3.5, 6.5)); }
      for (let i = 0; i < 46; i++) { const f = P.r(), e = rim(f); if (e > 12) P.win(P.X(f), P.rr(3, e - 5), P.rr(0.35, 0.85), 0.9, 0.9); }
      P.roofs(0.26, 0.42, 4, 10, 0.32, ['roof', 'roof', 'step']); P.roofs(0.58, 0.74, 4, 10, 0.32, ['roof', 'step', 'roof']); P.roofs(0.42, 0.58, 1, 4, 0.3, ['roof']);
    },
    mid(P) {   // the town in the valley, lit; the Sint Servaasbrug low on the left; the Sint-Servaas and the red tower of the Sint-Jan side by side
      P.trees(0.18, 0.82, 5, 10, 13); P.roofs(0.2, 0.82, 6, 14, 0.34, ['roof', 'roof', 'step', 'bell', 'roof']);
      const b0 = P.X(0.3), b1 = P.X(0.45), bw = (b1 - b0) / 7;
      P.box((b0 + b1) / 2, (b1 - b0) / P.m, -5, 8); P.g.save(); P.g.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < 7; i++) { P.g.beginPath(); P.g.ellipse(b0 + bw * (i + 0.5), Yh(P, -1), bw * 0.4, 6.2 * P.m, 0, Math.PI, 0); P.g.fill(); }
      P.g.restore();
      for (let i = 0; i <= 14; i++) { const x = b0 + (b1 - b0) * i / 14; P.box(x, 0.25, 8, 10.4); P.win(x, 10.4, 0.95, 0.7, 0.7); }
      const sx = P.X(0.6);
      P.box(sx + 15 * P.m, 28, -5, 17); P.poly([[sx + 1 * P.m, 17], [sx + 15 * P.m, 24], [sx + 29 * P.m, 17]]);
      P.box(sx, 15, -5, 23); P.poly([[sx - 7.5 * P.m, 23], [sx, 27], [sx + 7.5 * P.m, 23]]);
      for (const d of [-6.5, 6.5]) { P.box(sx + d * P.m, 5.5, -5, 30); P.poly([[sx + (d - 3.2) * P.m, 30], [sx + d * P.m, 36], [sx + (d + 3.2) * P.m, 30]]); P.win(sx + d * P.m, 24, 0.4, 0.8, 2); }
      for (let i = 0; i < 3; i++) P.win(sx + (i - 1) * 3 * P.m, 9, 0.35, 1, 3);
      const jx = P.X(0.527); P.box(jx + 9 * P.m, 16, -5, 14); P.poly([[jx + 1 * P.m, 14], [jx + 9 * P.m, 20], [jx + 17 * P.m, 14]]);
      P.box(jx, 6.5, -5, 27); P.box(jx, 5.2, 27, 32.5); P.poly([[jx - 2.9 * P.m, 32.5], [jx, 44], [jx + 2.9 * P.m, 32.5]]);
      const w = P.w; w.fillStyle = 'rgba(255,96,64,0.5)'; w.fillRect(jx - 3.25 * P.m, Yh(P, 27), 6.5 * P.m, 30 * P.m); w.fillRect(jx - 2.6 * P.m, Yh(P, 32.5), 5.2 * P.m, 5.5 * P.m);
      w.fillStyle = 'rgba(255,120,80,0.22)'; w.beginPath(); w.moveTo(jx - 2.9 * P.m, Yh(P, 32.5)); w.lineTo(jx, Yh(P, 44)); w.lineTo(jx + 2.9 * P.m, Yh(P, 32.5)); w.fill();
      for (const y of [18, 23]) P.win(jx, y, 0.5, 1.2, 3);
      P.trees(0.64, 0.74, 7, 12, 8);
    },
    far(P) {   // the plateaus round the valley: the Sint-Pietersberg's long flat top with the quarry cut into it, D'n Observant's cone of spoil
      const prof = f => {
        let h = 11 + 3.5 * Math.sin(f * 11 + 1) + 1.8 * Math.sin(f * 29);
        h = Math.max(h, 19 * sstep(0.1, 0.18, f) * (1 - sstep(0.36, 0.44, f)));
        const top = 25 * sstep(0.5, 0.55, f) * (1 - sstep(0.86, 0.92, f));
        h = Math.max(h, top - 9 * sstep(0.6, 0.612, f) * (1 - sstep(0.665, 0.677, f)));
        return Math.max(h, 37 - Math.abs(f - 0.71) * 520);
      };
      ridge(P, prof, 420);
      for (let i = 0; i < 18; i++) { const f = P.rr(0.05, 0.95), e = prof(f); P.win(P.X(f), P.rr(1, Math.max(2, e - 6)), P.rr(0.3, 0.7), 0.8, 0.8); }
    },
  };

  // ---------- the dead: carnival. Home made costumes, plumes, a jester, the old bedsheet, a brass band ----------
  const DEAD = {
    mestreechter_veren(k, b, K0) {   // a home made headdress of tall plumes in red, yellow and green, a cape and puffed sleeves
      init(K0); const [hx, hy, hz] = b.hd, m = C.palC, cols = [RED, YEL, GRN, WHITE, GRN, YEL, RED];
      pa(k, K.KG.cyl, YEL, hx, hy + 0.1, hz + 0.02, 0.35, 0, 0, 0.29, 0.08, 0.31, m);
      for (let i = 0; i < 7; i++) { const a = (i - 3) * 0.27; pb(k, cols[i], hx + Math.sin(a) * 0.4, hy + 0.16 + Math.cos(a) * 0.4, hz + 0.12, 0.08, 0.82, 0.025, 0.3, 0, -a, m); }
      pb(k, RED, 0, 1.2, 0.1, 0.62, 1.15, 0.04, -0.5, 0, 0, m);
      for (const s of [-1, 1]) pa(k, K.KG.ball, GRN, s * 0.27, b.sh[1] - 0.02, b.sh[2], 0, 0, 0, 0.24, 0.2, 0.24, m);
    },
    mestreechter_nar(k, b, K0) {   // a jester: a three-pointed cap with bells, a white ruff, a tunic half red and half green
      init(K0); const [hx, hy, hz] = b.hd, m = C.palC;
      pa(k, K.KG.dome, RED, hx, hy + 0.02, hz + 0.02, 0.3, 0, 0, 0.3, 0.3, 0.32, m);
      for (const [dx, col, up] of [[-1, GRN, 0], [0, YEL, 0.16], [1, RED, 0]]) {
        const ex = hx + dx * 0.34, ey = hy + 0.24 + up, ez = hz + 0.16;
        pt(k, col, hx + dx * 0.06, hy + 0.12, hz + 0.02, ex, ey, ez, 0.05, m); pa(k, K.KG.ball, YEL, ex, ey - 0.03, ez, 0, 0, 0, 0.1, 0.1, 0.1, m);
      }
      pa(k, K.KG.cyl, WHITE, 0, 1.64, -0.47, -Math.PI / 2, 0, 0, 0.48, 0.08, 0.48, m);
      for (const [s, col] of [[-1, RED], [1, GRN]]) pb(k, col, s * 0.11, 1.33, -0.13, 0.23, 0.62, 0.38, 0.55, 0, 0, m);
    },
    zate_hermenieke(k, b, K0) {   // a carnival band player: a shako with a red plume, a blue jacket, a sousaphone round him and its bell over his shoulder
      init(K0); const [hx, hy, hz] = b.hd, m = C.palC;
      pa(k, K.KG.cyl, BLUE, hx, hy + 0.17, hz + 0.02, 0.35, 0, 0, 0.26, 0.28, 0.28, m); pb(k, IRON, hx, hy + 0.06, hz - 0.14, 0.24, 0.03, 0.12, 0.35, 0, 0, m);
      pa(k, K.KG.ball, RED, hx, hy + 0.38, hz + 0.08, 0, 0, 0, 0.1, 0.22, 0.1, m);
      for (const s of [-1, 1]) { pb(k, BLUE, s * 0.11, 1.33, -0.13, 0.24, 0.62, 0.4, 0.55, 0, 0, m); pb(k, YEL, s * 0.27, 1.67, -0.36, 0.14, 0.05, 0.16, 0, 0, 0, m); }
      pa(k, C.torus, BRASS, 0.02, 1.3, -0.1, Math.PI / 2 + 0.45, 0, 0.5, 1, 1, 1, m);
      pa(k, C.bell, BRASS, -0.24, 2.0, -0.42, -0.95, 0, 0.25, 1, 1, 1, m); pt(k, BRASS, -0.3, 1.5, -0.3, -0.24, 1.86, -0.34, 0.06, m);
    },
    zate_trommelaer(k, b, K0) {   // the band's drummer: a red shako with a white plume, a big drum on his belly, the sticks raised
      init(K0); const [hx, hy, hz] = b.hd, m = C.palC;
      pa(k, K.KG.cyl, RED, hx, hy + 0.17, hz + 0.02, 0.35, 0, 0, 0.26, 0.28, 0.28, m); pa(k, K.KG.ball, WHITE, hx, hy + 0.38, hz + 0.08, 0, 0, 0, 0.1, 0.22, 0.1, m);
      for (const s of [-1, 1]) pb(k, GRN, s * 0.11, 1.33, -0.13, 0.24, 0.62, 0.4, 0.55, 0, 0, m);
      pa(k, K.KG.cyl, WHITE, 0, 0.98, -0.5, 0, 0, Math.PI / 2, 0.64, 0.34, 0.64, m);
      for (const s of [-1, 1]) pa(k, K.KG.cyl, RED, s * 0.17, 0.98, -0.5, 0, 0, Math.PI / 2, 0.68, 0.05, 0.68, m);
      pt(k, IRON, -0.22, 1.62, -0.36, 0.2, 1.1, -0.5, 0.02, m);
      for (const s of [-1, 1]) pt(k, DOOR, s * 0.26, 0.66, -0.6, s * 0.2, 1.0, -0.86, 0.015, m);
    },
    mestreechter_laken(k, b, K0) {   // the old way: a bedsheet and a pillowcase had to do; the eyes still burn through
      init(K0); const [hx, hy, hz] = b.hd, m = C.palC;
      pa(k, C.sheet, WHITE, 0, 1.06, -0.16, -0.18, 0, 0, 1, 1, 1, m);
      pb(k, WHITE, hx, hy + 0.03, hz + 0.05, 0.3, 0.36, 0.26, 0.2, 0, 0, m);
      for (const s of [-1, 1]) pb(k, WHITE, hx + s * 0.14, hy + 0.22, hz + 0.05, 0.08, 0.1, 0.2, 0.2, 0, s * 0.5, m);
    },
  };

  // ---------- the streets ----------
  const SIGNPOST = ['Vrijthof', 'Helpoort', 'Sint-Pietersberg', 'Wyck', 'Jekerkwartier', 'Markt', 'Sint Servaasbrug', 'Station'];
  const fingerpost = K0 => K0.fingerpost(SIGNPOST.slice().sort(() => Math.random() - 0.5).slice(0, 3));
  const ROW_KINDS = ['band', 'marl', 'plaster', 'band', 'marl', 'white', 'gable'];
  function street(base) {   // a steep street of Mosan houses on cobbles; the Helpoort in the row, the churches over the roofs
    const H = HILLS.street; let n = 0;
    return Object.assign({}, base, { fog: 0x4e525a, fogD: 0.0165, night: 0.17, hills: H, curv: 0.0032, lmX: [32, 40], spawn: [
      { make: K0 => (n++ % 8 === 3 ? helpoort(K0, H) : row(K0, 5, { hills: H, kinds: ROW_KINDS })), n: 8, gap: 16, side: 'alt', reg: true, xr: [7.9, 8.1], r: 15 },
      { make: K0 => backRow(K0, 5, { hills: H }), n: 6, gap: 22, side: 'alt', reg: true, xr: [19.5, 21], y: 1.2, r: 15 },
      { make: lamp, n: 10, gap: 13, side: 'alt', reg: true, xr: [4.7, 4.7] },
      { make: K0 => bunting(K0, H), n: 2, gap: 64, side: 'left', xr: [0, 0], r: 0.4 },
      { make: K0 => K0.treeCard([1, 3]), n: 4, gap: 32, side: 'both', xr: [13, 15.5], r: 0.9 },
      { make: K0 => K0.bollard(), n: 8, gap: 16, side: 'alt', xr: [4.4, 4.4], r: 0.2 },
      { make: K0 => K0.bench(), n: 1, gap: 128, side: 'both', xr: [4.9, 4.9], r: 0.9 },
      { make: K0 => K0.bikeRow(), n: 2, gap: 64, side: 'both', xr: [4.9, 5.0], r: 0.6 },
      { make: K0 => K0.bins(), n: 2, gap: 64, side: 'both', xr: [5.0, 5.1], r: 0.5 },
      { make: fingerpost, n: 1, gap: 128, side: 'both', xr: [4.6, 4.6], r: 0.5 },
      { make: 'zombieWalk', n: 8, gap: 16, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] });
  }
  function shops(base) {   // the lanes round the Markt: shop fronts and name boards in the marl and stone, bunting overhead
    const H = HILLS.shops;
    return Object.assign({}, base, { fog: 0x50535a, fogD: 0.016, night: 0.17, hills: H, curv: 0.0025, lmX: [32, 40], spawn: [
      { make: K0 => row(K0, 5, { hills: H, kinds: ['band', 'marl', 'plaster', 'white', 'gable', 'marl'], shops: 0.7, lit: 0.45 }), n: 8, gap: 16, side: 'alt', reg: true, xr: [7.9, 8.1], r: 15 },
      { make: K0 => backRow(K0, 5, { hills: H }), n: 6, gap: 22, side: 'alt', reg: true, xr: [19.5, 21], y: 1.2, r: 15 },
      { make: lamp, n: 10, gap: 13, side: 'alt', reg: true, xr: [4.7, 4.7] },
      { make: K0 => bunting(K0, H), n: 3, gap: 42, side: 'left', xr: [0, 0], r: 0.4 },
      { make: K0 => K0.crates(), n: 3, gap: 40, side: 'both', xr: [5.0, 5.2], r: 0.5 },
      { make: K0 => K0.bikeRow(), n: 2, gap: 64, side: 'both', xr: [4.9, 5.0], r: 0.6 },
      { make: K0 => K0.bollard(), n: 8, gap: 16, side: 'alt', xr: [4.4, 4.4], r: 0.2 },
      { make: fingerpost, n: 1, gap: 128, side: 'both', xr: [4.6, 4.6], r: 0.5 },
      { make: 'zombieWalk', n: 9, gap: 14, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] });
  }
  function square(base) {   // the Vrijthof: café fronts on the left, terraces under parasols on the square, the Sint-Servaas and the red Sint-Jan across it
    const H = HILLS.square;
    return Object.assign({}, base, { fog: 0x4f535b, fogD: 0.0155, night: 0.17, hills: H, curv: 0.002, lmX: [30, 36], lmSide: 'right', spawn: [
      { make: K0 => row(K0, 5, { hills: H, kinds: ['band', 'marl', 'white', 'plaster', 'gable'], cafes: 0.65, tables: true, lit: 0.5 }), n: 5, gap: 32, side: 'left', reg: true, xr: [9.8, 10.1], r: 15 },
      { make: K0 => backRow(K0, 5, { hills: H }), n: 4, gap: 40, side: 'left', reg: true, xr: [22, 24], y: 1.4, r: 15 },
      { make: K0 => vrijthof(K0, H), n: 6, gap: 20, side: 'right', xr: [6.6, 8.6], r: 3.4 },
      { make: K0 => K0.treeCard([1, 1, 3]), n: 5, gap: 26, side: 'right', xr: [13, 17], r: 0.9 },
      { make: servaasJan, n: 1, gap: 160, side: 'right', xr: [32, 38], r: 12, y: 0.25 },
      { make: lamp, n: 8, gap: 16, side: 'alt', reg: true, xr: [4.7, 4.7] },
      { make: K0 => bunting(K0, H), n: 2, gap: 80, side: 'left', xr: [0, 0], r: 0.4 },
      { make: K0 => K0.bench(), n: 2, gap: 64, side: 'right', xr: [5.2, 5.4], r: 0.9 },
      { make: fingerpost, n: 1, gap: 128, side: 'left', xr: [4.6, 4.6], r: 0.5 },
      { make: 'zombieWalk', n: 7, gap: 18, side: 'both', xr: [5.0, 6.0], r: 0.6 } ] });
  }

  T.maastricht = {
    style: { brick: [0x6c4436, 0x5a3a30, 0x7a5040, 0x8a7a5a], gables: 0.35, height: [7, 10], width: [4.5, 6], lamp: 'classic' },
    themes: { street, shops, square },
    // a warm valley: the lit town glows low in the haze all round, a few stars over the hills
    sky: { stars: 140, clouds: 0.5, glows: [{ az: 0, el: 1.5, w: 140, h: 9, color: 0xffa050, a: 0.17 }, { az: 55, el: 1, w: 70, h: 6, color: 0xff9a48, a: 0.1 }, { az: -55, el: 1, w: 70, h: 6, color: 0xff9a48, a: 0.1 }] },
    light: { lamp: 0xffb04c, windows: 0xffae5c },
    road: { kind: 'cobbles', tone: '#4c4740' },
    dead: { pool: ['mestreechter_veren', 'mestreechter_veren', 'mestreechter_nar', 'mestreechter_nar', 'zate_hermenieke', 'zate_trommelaer', 'mestreechter_laken', 'plain'], dress: DEAD },
    lamp: K0 => lamp(K0),
    landmark: K0 => servaasJan(K0),
    skyline: SKY,
    extra: [],
    shops: SHOPS.concat(CAFES),
    signs: SIGNPOST,
  };
})();
