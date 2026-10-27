// Nijmegen: a hill town above a broad river. The streets climb from the Waal into town on dark cobbles, steeper than anywhere else in
// the country, past narrow gabled houses of the Benedenstad that step up the slope, the wooded ridge dark above and the Stevenskerk on its
// own hill. Along the Waalkade the river lies wide and black with barge lights moving on it, and the road runs under the bridges: the
// beige arch of the Waalbrug and De Oversteek, whose 48 pairs of lamps come on pair by pair. The dead are Vierdaagse walkers with number
// bibs and gladioli, and students. API: towns3d/README.md; research: Opus 5.5 DT/research, part 2.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  let K = null, THREE = null;
  const C = {};   // materials, textures and geometries: made once on first use and kept

  // ---------- hills: up from the river and down again; a row of houses steps with the street ----------
  const HILLS = { street: { amp: 7.5, len: 320 }, shops: { amp: 6.5, len: 330 }, square: { amp: 4.5, len: 380 } };
  const HU = { d: { value: 0 }, a: { value: 0 }, l: { value: 320 } };
  let phase = null;
  const now = () => { const S = window.NR; return S && typeof S.t === 'number' ? S.t : performance.now() / 1000; };
  function hillTick() {   // the engine's own ground profile (README: hills) at the bike; ?hillphase= read as the engine reads it
    if (phase == null) phase = parseFloat(new URLSearchParams(location.search).get('hillphase')) || 0;
    const S = window.NR; HU.d.value = (S && typeof S.dist === 'number' ? S.dist : 0) + phase;
  }
  function useHills(h) { HU.a.value = h ? h.amp : 0; HU.l.value = h ? h.len : 320; }
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
    m.customProgramCacheKey = () => (prevKey ? prevKey() : '') + 'nrStepNijm';
    return keep(m);
  }
  function wuv(m, s) { m.userData.wuv = s; return m; }
  // De Oversteek: the lamps come on pair by pair, south to north, at a slow march; each pair's glow knows its place on the deck from x
  const MARCH = { n: { value: 48 } }, PAIRS = 48, PAIR_X0 = 6, PAIR_DX = 3.4;
  function marchTick() { const t = now() % 40; MARCH.n.value = t < 9 ? 1 + t / 9 * PAIRS : PAIRS + 1; }   // the walk takes nine seconds here, then the row stays lit
  function marching(m, dim) {
    const prev = m.onBeforeCompile, prevKey = Object.prototype.hasOwnProperty.call(m, 'customProgramCacheKey') ? m.customProgramCacheKey : null;
    m.onBeforeCompile = (sh, r) => {
      if (prev) prev(sh, r);
      sh.uniforms.uMarch = MARCH.n;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uMarch;\nvarying float vOn;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>\nvOn = clamp(uMarch - floor((${PAIR_X0.toFixed(1)} - position.x) / ${PAIR_DX.toFixed(2)} + 0.5), 0.0, 1.0);`);
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vOn;')
        .replace('#include <dithering_fragment>', `#include <dithering_fragment>\ngl_FragColor.rgb *= mix(${dim.toFixed(2)}, 1.0, vOn);`);
    };
    m.customProgramCacheKey = () => (prevKey ? prevKey() : '') + 'nrMarch' + dim;
    return keep(m);
  }

  // ---------- one palette for every flat-coloured part: frames, doors, iron, bridges and what the walkers carry ----------
  const PAL = [0xa9a397, 0x8e8b84, 0xbab6aa, 0x2f3236, 0x23352c, 0xd2d0c6, 0x2e231b, 0x131518, 0xc8291e, 0xe0701e, 0x4a5a32, 0xe4e2da, 0xc9b48e, 0x2c4ca8, 0xd64a8e, 0x6a1e2a];
  const STONE = 0, CONC = 1, PLASTER = 2, BASALT = 3, DGREEN = 4, FRAME = 5, DOOR = 6, IRON = 7, RED = 8, ORANGE = 9, OLIVE = 10, WHITE = 11, BEIGE = 12, BLUE = 13, PINK = 14, MAROON = 15;
  const LPAL = [0xeef4ff, 0xffd28a, 0x5aff7a, 0xff4a3a, 0xffb45c];   // lights: white LED, warm bulb, green and red navigation lights, amber
  const LED = 0, WARM = 1, NAVG = 2, NAVR = 3;
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
  function build(k, g, tick) { K.kbuild(k, g); g.traverse(m => { if (m.isMesh) m.onBeforeRender = tick || hillTick; }); return g; }

  // ---------- shop and café signs: one atlas, so every sign in a row is part of one mesh ----------
  const SHOPS = ['WANDELSCHOENEN', 'BLARENPLEISTERS', 'SCHOENMAKER', 'APOTHEEK', 'FIETSENMAKER', 'BOEKHANDEL', 'WANDELSPORT', 'DROGISTERIJ', 'BAKKERIJ', 'SLIJTERIJ', 'KAASHANDEL', 'BLOEMEN'];
  const CAFES = ['CAFÉ DE BLAAR', 'IN DE WAAG', 'CAFÉ NIMWÈÈGE', 'STUDENTENCAFÉ', 'CAFÉ DE GLADIOOL', 'EETCAFÉ', 'BRUIN CAFÉ', 'CAFÉ DE KAAI'];
  const SIGNS = SHOPS.concat(CAFES), SROWS = Math.ceil(SIGNS.length / 2);
  function signTex() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = SROWS * 64; const g = c.getContext('2d');
    SIGNS.forEach((s, i) => {
      const x = (i % 2) * 512, y = Math.floor(i / 2) * 64;
      g.fillStyle = '#15191c'; g.fillRect(x, y, 512, 64); g.fillStyle = '#2f4a3c'; g.fillRect(x + 4, y + 4, 504, 4); g.fillRect(x + 4, y + 56, 504, 4);
      let fs = 36; g.font = `bold ${fs}px "Segoe UI", Arial, sans-serif`; while (g.measureText(s).width > 470 && fs > 16) { fs -= 2; g.font = `bold ${fs}px "Segoe UI", Arial, sans-serif`; }
      g.fillStyle = '#e8ece4'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, x + 256, y + 33);
    });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  const SGEO = [];
  function signGeo(i) {
    if (!SGEO[i]) { const q = new THREE.PlaneGeometry(1, 1), uv = q.attributes.uv, u0 = (i % 2) * 0.5, v1 = 1 - Math.floor(i / 2) / SROWS, v0 = v1 - 1 / SROWS; for (let j = 0; j < uv.count; j++) uv.setXY(j, u0 + uv.getX(j) * 0.5, v0 + uv.getY(j) * (v1 - v0)); SGEO[i] = q; }
    return SGEO[i];
  }
  // Dutch gables of the Benedenstad, made once: stepped, bell and spout
  function gableGeo(kind, hw, top) {
    const s = new THREE.Shape(); s.moveTo(-hw, -0.3); s.lineTo(hw, -0.3);
    if (kind === 'step') { const n = 4, sw = hw * 0.3, w = i => hw - (hw - sw) * i / (n - 1); for (let i = 0; i < n; i++) { s.lineTo(w(i), top * (i + 1) / n); if (i < n - 1) s.lineTo(w(i + 1), top * (i + 1) / n); } for (let i = n - 1; i >= 0; i--) { s.lineTo(-w(i), top * (i + 1) / n); if (i > 0) s.lineTo(-w(i), top * i / n); } }
    else if (kind === 'bell') { const tw = hw * 0.36; s.lineTo(hw, top * 0.3); s.quadraticCurveTo(hw * 0.62, top * 0.42, tw, top * 0.8); s.lineTo(tw + 0.15, top * 0.82); s.lineTo(tw + 0.15, top * 0.92); s.quadraticCurveTo(0, top * 1.08, -tw - 0.15, top * 0.92); s.lineTo(-tw - 0.15, top * 0.82); s.lineTo(-tw, top * 0.8); s.quadraticCurveTo(-hw * 0.62, top * 0.42, -hw, top * 0.3); }
    else { s.lineTo(hw, top * 0.18); s.lineTo(0.5, top); s.lineTo(-0.5, top); s.lineTo(-hw, top * 0.18); }
    s.lineTo(-hw, -0.3); return new THREE.ShapeGeometry(s);
  }
  function init(K0) {
    if (C.pal) return; K = K0; THREE = K.THREE;
    _q = new THREE.Quaternion(); _e = new THREE.Euler(); _d = new THREE.Vector3(); _up = new THREE.Vector3(0, 1, 0);
    const warm = 0x7a5a64, cool = 0x5d5f8e, DS = THREE.DoubleSide, pt0 = palTex(PAL), lt = palTex(LPAL), bt = K.brickMat(0x808080).map, rt = K.PM.roof.map;
    C.pal = step(K.Mat({ map: pt0, emissive: 0xffffff, emissiveMap: pt0, emissiveIntensity: 0.05 }, warm));
    C.palE = step(new THREE.MeshBasicMaterial({ map: lt }));
    C.palR = keep(K.Mat({ map: pt0, emissive: 0xffffff, emissiveMap: pt0, emissiveIntensity: 0.05, side: DS }, warm));
    C.palER = keep(new THREE.MeshBasicMaterial({ map: lt }));
    C.palC = keep(K.Mat({ map: pt0, emissive: 0xffffff, emissiveMap: pt0, emissiveIntensity: 0.22, side: DS }, warm));
    C.brick = [0x5a3830, 0x4a302a, 0x6a4232].map(c => wuv(step(K.Mat({ color: c, map: bt, side: DS }, warm)), 2.6));
    C.brickPost = wuv(step(K.Mat({ color: 0x75553f, map: bt, side: DS }, warm)), 2.6);   // the yellow-brown brick of the rebuilding after 1944
    C.plaster = step(K.Mat({ color: 0xb4b0a6, side: DS }, warm));
    C.tiles = wuv(step(K.Mat({ color: 0x5c4038, map: rt }, warm)), 3.2);
    C.win = step(new THREE.MeshBasicMaterial({ map: K.PM.winAtlas.map }));
    C.glow = step(K.GlowMat(K.glowTex, 0xffb466, 0.42, false, { side: DS }));
    C.sign = step(new THREE.MeshBasicMaterial({ map: signTex(), color: 0xd0d4cc }));
    C.brickR = wuv(keep(K.Mat({ color: 0x5c3c32, map: bt, side: DS, emissive: 0x150e0a }, warm)), 3.2);
    C.tilesR = wuv(keep(K.Mat({ color: 0x4c4440, map: rt }, cool)), 3.2);
    C.winR = keep(new THREE.MeshBasicMaterial({ map: K.PM.winAtlas.map }));
    C.glowR = keep(K.GlowMat(K.glowTex, 0xffc070, 0.45, false, { side: DS }));
    C.steel = keep(K.Mat({ color: 0x3c4450, side: DS }, cool));
    C.beige = keep(K.Mat({ color: 0xbfae8a, emissive: 0x2a2418, side: DS }, warm));
    C.ledGlow = marching(keep(K.GlowMat(K.glowTex, 0xe6eeff, 0.75, false, { side: DS })), 0.0);
    C.ledHead = marching(keep(new THREE.MeshBasicMaterial({ color: 0xf2f6ff })), 0.12);
    C.whiteGlow = keep(K.GlowMat(K.glowTex, 0xe6eeff, 0.6, false, { side: DS }));
    C.green = keep(K.GlowMat(K.glowTex, 0x5aff7a, 0.55, false, { side: DS })); C.red = keep(K.GlowMat(K.glowTex, 0xff4a3a, 0.55, false, { side: DS }));
    C.water = keep(K.Mat({ color: 0x1a2128 }, cool));
    C.cone8 = new THREE.ConeGeometry(0.5, 1, 8); C.cone4 = new THREE.ConeGeometry(0.5, 1, 4); C.oct = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
    C.dome = new THREE.SphereGeometry(0.5, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2);
    const tri = new THREE.BufferGeometry(); tri.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, 0, 0, 0.5, 0, 0, 0, 1, 0], 3));
    tri.setAttribute('normal', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 0, 0, 1], 3)); tri.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2)); C.tri = tri;
    C.gables = { step: gableGeo('step', 2.95, 4.2), bell: gableGeo('bell', 2.95, 4.6), spout: gableGeo('spout', 2.95, 4.0) };
  }
  // ---------- the houses: narrow Benedenstad houses with Dutch gables, white plaster, the plain brick of the rebuilding ----------
  const FX = -1.6, HF = 2.95;   // the street facade (local x; the road is toward -x) and half a frontage: every part of a house stays in its 6 m slot
  const GF = 3.4, FH = 2.8, YAW = -Math.PI / 2;
  function win(k, x0, y, z, lit, wh, ww) {   // a sash window in a white frame; the lit ones spill light onto the brick
    const r0 = Math.random(), on = r0 < lit, cell = on ? K.pick([0, 0, 1, 1, 2]) : r0 < lit + 0.18 ? 3 : Math.random() < 0.7 ? 4 : 5;
    K.kadd(k, K.PG['win' + cell], C.win, x0 - 0.06, y, z, 0, YAW, 0, ww, wh);
    if (on) K.kadd(k, K.KG.plane, C.glow, x0 - 0.12, y, z, 0, YAW, 0, 2.3 * ww + 0.3, 2.7);
    pb(k, FRAME, x0 - 0.05, y + wh / 2 + 0.06, z, 0.08, 0.1, ww + 0.2); pb(k, STONE, x0 - 0.08, y - wh / 2 - 0.04, z, 0.16, 0.08, ww + 0.16);
    for (const s of [-1, 1]) pb(k, FRAME, x0 - 0.045, y, z + s * (ww / 2 + 0.05), 0.07, wh, 0.1);
    pb(k, DOOR, x0 - 0.03, y + wh / 2 + 0.2, z, 0.04, 0.22, ww + 0.3);   // the brick arch over it, a darker course
  }
  function door(k, x0, z) {
    pb(k, K.pick([DGREEN, DGREEN, DOOR, MAROON]), x0 - 0.05, 1.15, z, 0.08, 2.3, 1.05); pb(k, FRAME, x0 - 0.06, 2.42, z, 0.1, 0.1, 1.25);
    for (const s of [-1, 1]) pb(k, FRAME, x0 - 0.06, 1.2, z + s * 0.57, 0.09, 2.4, 0.09);
    K.kadd(k, K.PG.fan3, C.win, x0 - 0.06, 2.72, z, 0, YAW, 0, 0.95, 0.42); pb(k, BASALT, x0 - 0.3, 0.1, z, 0.46, 0.2, 1.4);
  }
  function shopFront(k, x0, oz, cafe, si) {   // a lit shop window or café across the ground floor, the name board above it
    const z = oz - 0.45;
    K.kadd(k, K.PG[cafe ? 'shop1' : 'shop0'], C.win, x0 - 0.07, 1.55, z, 0, YAW, 0, 3.7, 2.1);
    K.kadd(k, K.KG.plane, C.glow, x0 - 0.15, 1.6, z, 0, YAW, 0, 6.2, 4.2);
    pb(k, IRON, x0 - 0.07, 0.25, z, 0.12, 0.5, 3.95); pb(k, IRON, x0 - 0.07, 2.66, z, 0.12, 0.16, 3.95);
    for (const dz of [-1.92, 0, 1.92]) pb(k, IRON, x0 - 0.09, 1.45, z + dz, 0.08, 2.4, 0.09);
    K.kadd(k, signGeo(si), C.sign, x0 - 0.12, 3.02, z, 0, YAW, 0, 3.6, 0.45);
    pb(k, DOOR, x0 - 0.05, 1.2, oz + 2.3, 0.08, 2.4, 0.86);
    if (cafe) { pb(k, MAROON, x0 - 0.75, 3.0, z, 1.55, 0.06, 4.1, 0, 0, 0.32); pb(k, MAROON, x0 - 1.48, 2.76, z, 0.04, 0.28, 4.1);
      for (let i = 0; i < 7; i++) pa(k, K.KG.ball, WARM, x0 - 1.52, 2.56 - Math.sin(i / 6 * Math.PI) * 0.12, z - 1.8 + i * 0.6, 0, 0, 0, 0.1, 0.1, 0.1, C.palE); }
  }
  function gableRoof(k, x0, x1, xm, h, oz, wall, lit, kind) {   // pantiles behind a Dutch gable: stepped, bell or spout, with white copings and a hoist beam
    const ridge = 3.4, run = 2.88, slope = Math.atan2(ridge, run), sl = Math.hypot(run, ridge), top = kind === 'bell' ? 4.6 : kind === 'step' ? 4.2 : 4.0;
    for (const s of [-1, 1]) K.kb(k, C.tiles, xm + 0.25, h + ridge / 2 - 0.02, oz + s * run / 2, x1 - x0 - 0.2, 0.12, sl, s * slope, 0, 0);
    K.kadd(k, C.gables[kind], wall, x0 - 0.03, h, oz, 0, Math.PI / 2, 0);
    if (kind === 'step') { const n = 4, sw = HF * 0.3, w = i => HF - (HF - sw) * i / (n - 1); for (let i = 0; i < n; i++) { const v = h + top * (i + 1) / n, ww = w(i), wn = i < n - 1 ? w(i + 1) : 0; for (const s of [-1, 1]) pb(k, FRAME, x0 - 0.06, v + 0.05, oz + s * (ww + wn) / 2, 0.26, 0.1, ww - wn + 0.1); } }
    else pb(k, FRAME, x0 - 0.06, h + top - 0.02, oz, 0.22, 0.12, kind === 'bell' ? 2.4 : 1.2);
    win(k, x0, h + 1.35, oz, lit * 0.7, 1.3, 0.9);
    pb(k, DOOR, x0 - 0.45, h + top - 1.0, oz, 0.9, 0.12, 0.12);   // the hoist beam
  }
  function eavesRoof(k, x0, x1, xm, h, oz, wall) {   // a pantiled roof with its eaves to the street, a dormer, a chimney
    const rh = K.rnd(2.6, 3.4), run = xm - x0 + 0.3, a = Math.atan2(rh, run), sl = Math.hypot(run, rh) + 0.1;
    K.kb(k, C.tiles, xm - run / 2, h + rh / 2, oz, sl, 0.14, 2 * HF, 0, 0, a); K.kb(k, C.tiles, xm + run / 2, h + rh / 2, oz, sl, 0.14, 2 * HF, 0, 0, -a);
    for (const s of [-1, 1]) K.kadd(k, C.tri, wall, xm, h - 0.05, oz + s * (HF - 0.01), 0, 0, 0, 2 * run, rh + 0.05, 1);
    if (Math.random() < 0.6) { const xd = x0 + 0.9, yd = h + (xd - (x0 - 0.3)) * Math.tan(a); pb(k, FRAME, xd + 0.7, yd + 0.5, oz, 1.4, 1.5, 1.4); K.kadd(k, K.PG.win4, C.win, xd - 0.01, yd + 0.55, oz, 0, YAW, 0, 0.8, 0.95); K.kb(k, C.tiles, xd + 0.6, yd + 1.3, oz, 1.7, 0.1, 1.6); }
  }
  // one house in the row, centred at local z = oz. kind: 'step', 'bell', 'spout' (Benedenstad gables), 'white' (plaster), 'post' (rebuilt after 1944)
  function house(k, oz, o) {
    const D = 6.2, x0 = FX, x1 = FX + D, xm = x0 + D / 2, kind = o.kind, lit = o.lit, post = kind === 'post';
    const nu = post ? K.pick([3, 3, 4]) : o.floors, h = GF + nu * FH + (post ? 0.6 : 0.2), wall = post ? C.brickPost : kind === 'white' ? C.plaster : o.brick;
    K.kb(k, wall, xm, (h - 2.2) / 2, oz, D, h + 2.2, 2 * HF);
    pb(k, BASALT, x0 - 0.04, -0.6, oz, 0.1, 2.2, 2 * HF);   // a dark plinth, deep enough to fill the step on a slope
    if (post) { for (let f = 1; f <= nu; f++) pb(k, CONC, x0 - 0.06, GF + (f - 1) * FH - 0.1, oz, 0.14, 0.24, 2 * HF); pb(k, CONC, x0 - 0.1, h - 0.15, oz, 0.3, 0.35, 2 * HF); pb(k, BASALT, xm, h + 0.02, oz, D - 0.3, 0.1, 2 * HF - 0.2); }
    else if (kind === 'white') pb(k, STONE, x0 - 0.1, h - 0.1, oz, 0.26, 0.24, 2 * HF);
    const bays = post ? 3 : 2, dzs = bays === 3 ? [-1.95, 0, 1.95] : [-1.35, 1.35], di = Math.random() < 0.5 ? 0 : bays - 1;
    for (let f = 0; f <= nu; f++) {
      const wy = f === 0 ? 1.8 : GF + (f - 1) * FH + FH * 0.5, wh = post ? 1.5 : f === 0 ? 1.8 : 1.65;
      for (let b = 0; b < bays; b++) if (!(f === 0 && (o.front || b === di))) win(k, x0, wy, oz + dzs[b], lit, wh, post ? 1.4 : 1.0);
    }
    if (o.front) shopFront(k, x0, oz, o.front === 'cafe', o.sign); else door(k, x0, oz + dzs[di]);
    if (kind === 'white') eavesRoof(k, x0, x1, xm, h, oz, wall); else if (!post) gableRoof(k, x0, x1, xm, h, oz, wall, lit, kind);
  }
  let shopI = 0, cafeI = 0;
  // a row of n houses wall to wall (n odd, so the slots sit at 0, 6, 12 m either side of the middle)
  function row(K0, n, o) {
    init(K0); useHills(o.hills);
    const g = new THREE.Group(), k = K.kit(), brick = K.pick(C.brick);
    for (let i = 0; i < n; i++) {
      const front = o.shops && Math.random() < o.shops ? 'shop' : o.cafes && Math.random() < o.cafes ? 'cafe' : null;
      const sign = front === 'shop' ? (shopI++) % SHOPS.length : front === 'cafe' ? SHOPS.length + (cafeI++) % CAFES.length : 0;
      house(k, (i - (n - 1) / 2) * 6, { kind: K.pick(o.kinds), floors: K.pick([1, 2, 2]), lit: o.lit == null ? 0.4 : o.lit, brick: Math.random() < 0.3 ? K.pick(C.brick) : brick, front, sign });
    }
    build(k, g); g.userData.faceRoad = true; return g;
  }
  // the town further up the hill: the plain blocks of the rebuilding, flat roofs, lit stairwells; the haze does the rest
  function backRow(K0, n, o) {
    init(K0); useHills(o.hills);
    const g = new THREE.Group(), k = K.kit(), x0 = FX, D = 8, xm = x0 + D / 2;
    for (let i = 0; i < n; i++) {
      const oz = (i - (n - 1) / 2) * 6, nu = K.pick([3, 4, 4, 5]), h = GF + nu * FH + 0.5, wall = Math.random() < 0.6 ? C.brickPost : K.pick(C.brick);
      K.kb(k, wall, xm, (h - 6) / 2, oz, D, h + 6, 2 * HF);
      for (let f = 1; f <= nu; f++) pb(k, CONC, x0 - 0.05, GF + (f - 1) * FH - 0.1, oz, 0.12, 0.22, 2 * HF);
      pb(k, CONC, x0 - 0.1, h - 0.15, oz, 0.3, 0.35, 2 * HF);
      for (let f = 0; f <= nu; f++) for (const dz of [-1.95, 0, 1.95]) {
        const y = f === 0 ? 1.8 : GF + (f - 1) * FH + FH * 0.5, r0 = Math.random(), on = r0 < (o.lit || 0.22);
        K.kadd(k, K.PG['win' + (on ? K.pick([0, 1, 2]) : r0 < 0.38 ? 3 : 4)], C.win, x0 - 0.03, y, oz + dz, 0, YAW, 0, 1.3, 1.4);
        if (on) K.kadd(k, K.KG.plane, C.glow, x0 - 0.08, y, oz + dz, 0, YAW, 0, 2.4, 2.4);
      }
    }
    build(k, g); g.userData.faceRoad = true; return g;
  }
  // ---------- street lamps: slim masts with a flat LED head, cold white, as the bridge has them ----------
  function lamp(K0) {
    init(K0); const g = new THREE.Group(), k = K.kit();
    pa(k, K.KG.cyl, IRON, 0, 0.3, 0, 0, 0, 0, 0.26, 0.6, 0.26); pa(k, K.KG.cyl, IRON, 0, 2.7, 0, 0, 0, 0, 0.11, 5.4, 0.11);
    pb(k, IRON, -0.5, 5.3, 0, 1.1, 0.06, 0.07); pb(k, IRON, -1.05, 5.26, 0, 0.74, 0.1, 0.3);
    pa(k, K.KG.box, LED, -1.05, 5.2, 0, 0, 0, 0, 0.62, 0.03, 0.24, C.palE);
    build(k, g); K.lampLights(g, -1.05, 5.15, 0, 1.1); g.userData.faceRoad = true; return g;
  }
  // ---------- the Stevenskerk on its own hill: the brick church, the tower with its eight-sided lantern and dome ----------
  function stevenskerk(K0) {
    init(K0);
    const g = new THREE.Group(), k = K.kit(), B = C.brickR;
    pa(k, C.oct, DGREEN, 16, 0.9, 0, 0, Math.PI / 8, 0, 40, 3.4, 34, C.palR);   // the hill it stands on
    for (let i = 0; i < 6; i++) pb(k, STONE, -4.2 + i * 0.5, 0.15 + i * 0.4, 0, 0.6, 0.3, 4, 0, 0, 0, C.palR);   // the steps up
    K.kb(k, B, 19, 9.5, 0, 30, 17, 15); for (const s of [-1, 1]) K.kb(k, C.tilesR, 19, 20.8, s * 3.9, 30.4, 0.3, 9.6, s * 0.78, 0, 0);
    for (let i = 0; i < 5; i++) for (const s of [-1, 1]) K.kadd(k, K.PG[i % 2 ? 'win0' : 'win3'], C.winR, 8 + i * 5, 9, s * 7.56, 0, s > 0 ? 0 : Math.PI, 0, 1.6, 5);
    K.kb(k, B, 4, 15, 0, 9, 30, 9); K.kb(k, B, 4, 32.5, 0, 7.6, 5, 7.6);
    for (const y of [12, 20, 28]) K.kadd(k, K.PG.win3, C.winR, -0.54, y, 0, 0, YAW, 0, 1.4, 3.2);
    K.kadd(k, C.oct, C.beige, 4, 38.5, 0, 0, Math.PI / 8, 0, 6.4, 7, 6.4);   // the lantern, pale, lit from inside
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8; K.kadd(k, K.PG.win1, C.winR, 4 + Math.cos(a) * 3.05, 38.5, Math.sin(a) * 3.05, 0, -a + Math.PI / 2, 0, 0.9, 2.6); }
    K.kadd(k, C.dome, C.tilesR, 4, 42, 0, 0, 0, 0, 6.8, 4.4, 6.8); K.kadd(k, C.oct, C.beige, 4, 45.4, 0, 0, 0, 0, 1.6, 2.4, 1.6); K.kadd(k, C.cone8, C.tilesR, 4, 48, 0, 0, 0, 0, 1.9, 2.8, 1.9);
    K.kadd(k, K.KG.plane, C.glowR, -1, 38, 0, 0, YAW, 0, 9, 9); K.kadd(k, K.KG.plane, C.glowR, -0.6, 10, 0, 0, YAW, 0, 10, 14);
    build(k, g); g.userData.faceRoad = true; return g;
  }
  // ---------- the bridges over the Waal: the road along the quay runs under them ----------
  function bridgeDeck(k, S, xr, xl, dy, w, piers) {   // the deck, its parapets, the piers on the quay, in the river and under the approach
    K.kb(k, S, (xr + xl) / 2, dy, 0, xr - xl, 1.0, w);
    for (const s of [-1, 1]) pb(k, IRON, (xr + xl) / 2, dy + 0.75, s * (w / 2 - 0.1), xr - xl, 0.5, 0.15, 0, 0, 0, C.palR);
    for (const px of piers) pb(k, BASALT, px, (dy - 0.5 - 2.5) / 2, 0, 1.6, dy - 0.5 + 2.5, 6, 0, 0, 0, C.palR);
    pb(k, BASALT, xr + 1.2, dy / 2 - 1.5, 0, 2.6, dy + 3, w + 1, 0, 0, 0, C.palR);   // the abutment on the quay, where the bridge comes down into town
  }
  function oversteek(K0) {   // one steel arch over the river, the deck hung from it, 48 pairs of light masts that come on pair by pair
    init(K0); useHills(null);
    const g = new THREE.Group(), k = K.kit(), kl = K.kit(), XR = 7, XL = PAIR_X0 - PAIRS * PAIR_DX - 6, DY = 9, W = 11, A0 = -24, A1 = XL + 6, AH = 40;
    bridgeDeck(k, C.steel, XR, XL, DY, W, [6.6, -6.6, A0, A1, (A0 + A1) / 2]);
    const ay = u => 2 + (AH - 2) * 4 * u * (1 - u), ax = u => A0 + (A1 - A0) * u;
    for (let i = 0; i < 30; i++) { const u0 = i / 30, u1 = (i + 1) / 30; K.ktube(k, C.steel, ax(u0), ay(u0), 0, ax(u1), ay(u1), 0, 1.1); }
    for (let i = 1; i < 30; i++) { const u = i / 30; if (ay(u) > DY + 1.5) for (const s of [-1, 1]) K.ktube(k, C.steel, ax(u), ay(u) - 0.8, 0, ax(u), DY + 0.5, s * (W / 2 - 0.5), 0.07); }
    for (let i = 0; i < PAIRS; i++) {
      const x = PAIR_X0 - i * PAIR_DX;
      for (const s of [-1, 1]) {
        const z = s * (W / 2 - 0.3); pt(k, IRON, x, DY + 0.5, z, x, DY + 4.4, z, 0.07, C.palR);
        K.kadd(kl, K.KG.box, C.ledHead, x, DY + 4.5, z, 0, 0, 0, 0.5, 0.14, 0.34); K.kadd(kl, K.KG.plane, C.ledGlow, x, DY + 4.3, z + s * 0.2, 0, 0, 0, 2.6, 2.6);
      }
    }
    build(k, g, () => {}); build(kl, g, marchTick); return g;
  }
  function waalbrug(K0) {   // the Waalbrug of 1936: a light beige truss arch, two ribs braced together, the deck through it, warm lamps
    init(K0); useHills(null);
    const g = new THREE.Group(), k = K.kit(), kl = K.kit(), XR = 7, XL = -140, DY = 9, W = 12, A0 = -18, A1 = -134, AH = 36;
    bridgeDeck(k, C.steel, XR, XL, DY, W, [6.6, -6.6, A0, A1]);
    const ay = u => 3 + (AH - 3) * 4 * u * (1 - u), ax = u => A0 + (A1 - A0) * u, low = u => ay(u) - 2.6 * Math.sin(u * Math.PI);
    for (const s of [-1, 1]) {
      const z = s * 4.8;
      for (let i = 0; i < 24; i++) {
        const u0 = i / 24, u1 = (i + 1) / 24;
        K.ktube(k, C.beige, ax(u0), ay(u0), z, ax(u1), ay(u1), z, 0.6); K.ktube(k, C.beige, ax(u0), low(u0), z, ax(u1), low(u1), z, 0.45);
        K.ktube(k, C.beige, ax(u0), ay(u0), z, ax(u1), low(u1), z, 0.22);
        if (low(u1) > DY + 1.2) K.ktube(k, C.beige, ax(u1), low(u1), z, ax(u1), DY + 0.5, z, 0.08);
      }
    }
    for (let i = 2; i < 23; i += 2) { const u = i / 24; if (ay(u) > DY + 6) K.ktube(k, C.beige, ax(u), ay(u), -4.8, ax(u), ay(u), 4.8, 0.3); }
    for (let i = 0; i < 14; i++) for (const s of [-1, 1]) {
      const x = 4 - i * 10, z = s * (W / 2 - 0.3); pt(k, IRON, x, DY + 0.5, z, x, DY + 4, z, 0.06, C.palR);
      pa(k, K.KG.ball, WARM, x, DY + 4.1, z, 0, 0, 0, 0.32, 0.32, 0.32, C.palER); K.kadd(kl, K.KG.plane, C.glowR, x, DY + 4.0, z + s * 0.2, 0, 0, 0, 2.6, 2.6);
    }
    build(k, g, () => {}); build(kl, g, () => {}); return g;
  }
  function barge(K0) {   // a Rhine barge going up or down the Waal: a long low hull, the wheelhouse lit, its navigation lights; it moves on the river
    init(K0); useHills(null);
    const outer = new THREE.Group(), g = new THREE.Group(), k = K.kit(), kl = K.kit(), L = 38, dir = Math.random() < 0.5 ? -1 : 1, v = K.rnd(1.4, 2.8) * dir, st = -dir * (L / 2 - 3);
    pb(k, IRON, 0, 0.2, 0, 6.4, 1.8, L, 0, 0, 0, C.palR); pb(k, BASALT, 0, 1.3, -dir * 3, 5.6, 0.5, L - 12, 0, 0, 0, C.palR);
    pb(k, K.pick([PLASTER, FRAME, DGREEN]), 0, 2.4, st, 4.6, 2.2, 3.4, 0, 0, 0, C.palR); pb(k, IRON, 0, 3.6, st, 5, 0.2, 3.8, 0, 0, 0, C.palR);
    for (const s of [-1, 1]) K.kadd(k, K.PG.win1, C.winR, s * 2.32, 2.6, st, 0, s * Math.PI / 2, 0, 3, 1);
    K.kadd(k, K.PG.win0, C.winR, 0, 2.6, st + dir * -1.72, 0, dir > 0 ? Math.PI : 0, 0, 3.6, 1);
    pb(k, IRON, 0, 5.2, st, 0.12, 3, 0.12, 0, 0, 0, C.palR);
    const bow = dir * -(L / 2 - 1);
    pa(k, K.KG.ball, LED, 0, 6.8, st, 0, 0, 0, 0.3, 0.3, 0.3, C.palER); pa(k, K.KG.ball, LED, 0, 4.2, bow, 0, 0, 0, 0.3, 0.3, 0.3, C.palER);
    pa(k, K.KG.ball, NAVG, 3.3, 2.2, bow + dir * 2, 0, 0, 0, 0.26, 0.26, 0.26, C.palER); pa(k, K.KG.ball, NAVR, -3.3, 2.2, bow + dir * 2, 0, 0, 0, 0.26, 0.26, 0.26, C.palER);
    for (const [x, y, z, m, s] of [[0, 6.8, st, C.whiteGlow, 3], [0, 4.2, bow, C.whiteGlow, 2.6], [3.3, 2.2, bow + dir * 2, C.green, 2.4], [-3.3, 2.2, bow + dir * 2, C.red, 2.4], [0, 2.6, st, C.glowR, 7]]) K.kadd(kl, K.KG.plane, m, x, y, z, 0, 0, 0, s, s);
    outer.add(g);
    const tick = () => { const u = outer.userData, t = now(); if (u.t0 == null || outer.position.z < u.lz - 40) u.t0 = t; u.lz = outer.position.z; g.position.z = (t - u.t0) * v; };
    build(k, g, tick); build(kl, g, tick); return outer;
  }
  function beacon(K0) {   // a light on the head of a groyne: green on this bank
    init(K0); const g = new THREE.Group(), k = K.kit();
    pb(k, BASALT, 0, 0.1, 0, 2.6, 1.2, 1.6, 0, 0, 0, C.palR); pb(k, FRAME, 0, 2, 0, 0.18, 3, 0.18, 0, 0, 0, C.palR);
    pa(k, K.KG.ball, NAVG, 0, 3.6, 0, 0, 0, 0, 0.3, 0.3, 0.3, C.palER); K.kadd(k, K.KG.plane, C.green, 0, 3.6, 0.1, 0, 0, 0, 2.6, 2.6);
    build(k, g, () => {}); return g;
  }
  function railing(K0) {   // the iron railing along the quay edge, 24 m of it
    init(K0); const g = new THREE.Group(), k = K.kit();
    for (let z = -12; z <= 12; z += 2) pb(k, IRON, 0, 0.55, z, 0.07, 1.1, 0.07, 0, 0, 0, C.palR);
    for (const y of [0.5, 1.05]) pb(k, IRON, 0, y, 0, 0.06, 0.06, 24, 0, 0, 0, C.palR);
    build(k, g, () => {}); return g;
  }
  function gladioli(k, x, y, z, n, m) {   // a bunch of gladioli: long green stems with flowers up the top of each
    const cols = [PINK, RED, ORANGE, WHITE, PINK];
    for (let j = 0; j < n; j++) {
      const dx = (j - (n - 1) / 2) * 0.05, tx = x + dx * 2.2, ty = y + 0.8 + (j % 2) * 0.12, tz = z - 0.12 + (j % 3) * 0.05;
      pt(k, DGREEN, x + dx * 0.3, y, z, tx, ty, tz, 0.012, m);
      for (let f = 0; f < 5; f++) { const u = 0.55 + f * 0.1; pa(k, K.KG.ball, cols[j % cols.length], x + dx * 0.3 + (tx - x - dx * 0.3) * u, y + (ty - y) * u, z + (tz - z) * u, 0, 0, 0, 0.09, 0.08, 0.09, m); }
    }
  }
  function gladStall(K0) {   // a flower stall with buckets of gladioli for the walkers
    init(K0); const g = new THREE.Group(), k = K.kit();
    pb(k, DOOR, 0, 0.45, 0, 1.0, 0.9, 2.2, 0, 0, 0, C.palR); pb(k, MAROON, 0.3, 2.3, 0, 1.6, 0.06, 2.6, 0, 0, 0.3, C.palR);
    for (const s of [-1, 1]) pb(k, IRON, 0.7, 1.2, s * 1.2, 0.06, 2.4, 0.06, 0, 0, 0, C.palR);
    for (let i = 0; i < 4; i++) { const z = -0.8 + i * 0.55; pa(k, K.KG.cyl, CONC, -0.15, 1.05, z, 0, 0, 0, 0.36, 0.34, 0.36, C.palR); gladioli(k, -0.15, 1.1, z, 5, C.palR); }
    pa(k, K.KG.ball, WARM, -0.3, 2.1, 0, 0, 0, 0, 0.16, 0.16, 0.16, C.palER); K.kadd(k, K.KG.plane, C.glowR, -0.4, 1.6, 0, 0, YAW, 0, 3.2, 3.2);
    build(k, g, () => {}); g.userData.faceRoad = true; return g;
  }
  function terraceBlock(K0, H) {   // café tables out on the square, under parasols, with a string of bulbs
    init(K0); useHills(H); const g = new THREE.Group(), k = K.kit();
    for (const tx of [0.8, 2.6]) for (const tz of [-2.0, 0, 2.0]) {
      pa(k, K.KG.cyl, IRON, tx, 0.74, tz, 0, 0, 0, 0.66, 0.04, 0.66); pb(k, IRON, tx, 0.37, tz, 0.05, 0.72, 0.05);
      for (const s of [-1, 1]) { pb(k, IRON, tx, 0.46, tz + s * 0.56, 0.42, 0.04, 0.4); pb(k, IRON, tx, 0.7, tz + s * 0.76, 0.42, 0.5, 0.04); }
    }
    for (const pz of [-1.1, 1.3]) { pb(k, IRON, 1.7, 1.35, pz, 0.06, 2.7, 0.06); pa(k, C.cone8, K.pick([MAROON, DGREEN, PLASTER]), 1.7, 2.78, pz, 0, 0, 0, 3.6, 0.6, 3.6); }
    for (let i = 0; i < 9; i++) pa(k, K.KG.ball, WARM, 0.1, 2.55 - Math.sin(i / 8 * Math.PI) * 0.3, -2.6 + i * 0.65, 0, 0, 0, 0.1, 0.1, 0.1, C.palE);
    for (const pz of [-1.1, 1.3]) K.kadd(k, K.KG.plane, C.glow, 1.7, 1.9, pz, 0, 0, 0, 3.4, 2.6);
    build(k, g); g.userData.faceRoad = true; return g;
  }
  // ---------- the far town: the wooded ridge above, the Stevenskerk and the Valkhof, the two bridges over the river, painted on the bands ----------
  const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const Yh = (P, h) => P.g.canvas.height - (5 + h) * P.m;
  function ridge(P, prof, n) { const g = P.g, H = g.canvas.height; g.beginPath(); g.moveTo(0, H); for (let i = 0; i <= n; i++) g.lineTo(P.X(i / n), Yh(P, prof(i / n))); g.lineTo(P.X(1), H); g.closePath(); g.fill(); }
  function archBridge(P, f0, f1, top, deck, lamps, lit) {   // an arch over the river with its deck through it and a row of lamps along it
    const x0 = P.X(f0), x1 = P.X(f1), g = P.g; g.lineWidth = Math.max(1.5, 1.4 * P.m);
    g.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40; g[i ? 'lineTo' : 'moveTo'](x0 + (x1 - x0) * u, Yh(P, 2 + (top - 2) * 4 * u * (1 - u))); } g.stroke();
    P.box((x0 + x1) / 2, (x1 - x0) / P.m * 1.25, deck - 0.6, deck + 0.6);
    for (let i = 1; i < 16; i++) { const u = i / 16, h = 2 + (top - 2) * 4 * u * (1 - u); if (h > deck + 1) P.line(x0 + (x1 - x0) * u, deck, x0 + (x1 - x0) * u, h, 0.15); }
    for (let i = 0; i < lamps; i++) { const x = x0 - (x1 - x0) * 0.12 + (x1 - x0) * 1.24 * i / (lamps - 1); P.win(x, deck + 1.6, lit, 0.55, 0.55); }
  }
  const SKY = {
    near(P, K0, th) {
      if (th && th.key === 'dyke') {   // the riverfront: the Benedenstad climbing the hill on the right, trees on top; the far bank low on the left
        const hill = f => 2 + 30 * sstep(0.56, 0.9, f) + 2 * Math.sin(f * 37);
        ridge(P, hill, 160); for (let f = 0.6; f < 0.99; f += 0.005) if (P.r() < 0.8) P.tree(P.X(f), hill(f) + P.rr(3, 7), P.rr(4, 7));
        for (let i = 0; i < 70; i++) { const f = P.rr(0.56, 0.98), e = hill(f); P.win(P.X(f), P.rr(2, Math.max(3, e - 2)), P.rr(0.4, 0.95), 0.9, 1.1); }
        P.roofs(0.0, 0.42, 1, 3, 0.15, ['flat', 'roof']);
        return;
      }
      // above the street the wooded ridge, dark, crowns all along it; the street's own roofs in front
      const rim = f => { const e = Math.abs(f - 0.5) * 2; return 3 + 42 * sstep(0.12, 0.6, e) + 3 * Math.sin(f * 33) + 2 * Math.sin(f * 71); };
      ridge(P, rim, 180);
      for (let f = 0.005; f < 0.995; f += 0.0028) { const e = rim(f); if (e > 7) P.tree(P.X(f), e + P.rr(4, 9), P.rr(5, 9)); }
      for (let i = 0; i < 12; i++) { const f = P.r(), e = rim(f); if (e > 14) P.win(P.X(f), P.rr(4, e - 6), P.rr(0.3, 0.7), 0.8, 0.8); }
      P.roofs(0.26, 0.42, 4, 11, 0.3, ['step', 'roof', 'bell']); P.roofs(0.58, 0.74, 4, 11, 0.3, ['roof', 'step', 'flat']); P.roofs(0.42, 0.58, 1, 4, 0.3, ['roof']);
    },
    mid(P, K0, th) {   // the town on its hill: the Stevenskerk with its lantern and dome, the Valkhof chapel in the trees, De Oversteek and the Waalbrug
      const dyke = th && th.key === 'dyke';
      P.trees(0.15, 0.85, 5, 10, 13); P.roofs(0.2, 0.8, 6, 13, 0.3, ['step', 'roof', 'flat', 'bell']);
      const sx = P.X(dyke ? 0.66 : 0.522), hb = dyke ? 10 : 6;
      P.poly([[sx - 34 * P.m, -5], [sx - 22 * P.m, hb], [sx + 26 * P.m, hb], [sx + 40 * P.m, -5]]);
      P.box(sx + 15 * P.m, 26, hb - 1, hb + 15); P.poly([[sx + 2 * P.m, hb + 15], [sx + 15 * P.m, hb + 22], [sx + 28 * P.m, hb + 15]]);
      P.box(sx, 8, hb - 1, hb + 26); P.box(sx, 6.4, hb + 26, hb + 33); P.g.beginPath(); P.g.ellipse(sx, Yh(P, hb + 33), 3.4 * P.m, 3.6 * P.m, 0, Math.PI, 0); P.g.fill();
      P.box(sx, 1.4, hb + 36, hb + 39); P.poly([[sx - 1 * P.m, hb + 39], [sx, hb + 42], [sx + 1 * P.m, hb + 39]]);
      P.win(sx, hb + 28.5, 0.85, 4.6, 3.4); for (const y of [10, 17]) P.win(sx, hb + y, 0.4, 1.2, 3); for (let i = 0; i < 4; i++) P.win(sx + (7 + i * 5) * P.m, hb + 6, 0.35, 1.2, 4);
      const vx = P.X(dyke ? 0.78 : 0.6); P.trees(dyke ? 0.74 : 0.57, dyke ? 0.84 : 0.65, 10, 16, 6);
      P.box(vx, 9, -5, 15); P.poly([[vx - 4.5 * P.m, 15], [vx, 19], [vx + 4.5 * P.m, 15]]); P.box(vx, 2.2, 19, 22.5); P.poly([[vx - 1.4 * P.m, 22.5], [vx, 25], [vx + 1.4 * P.m, 22.5]]); P.win(vx, 10, 0.5, 1, 2);
      if (dyke) { archBridge(P, 0.26, 0.47, 40, 9, 48, 0.95); archBridge(P, 0.52, 0.6, 26, 8, 12, 0.7); }
      else { archBridge(P, 0.27, 0.43, 34, 8, 48, 0.9); archBridge(P, 0.7, 0.82, 26, 7, 12, 0.6); }
    },
    far(P, K0, th) {   // beyond: the flat Ooijpolder and the Betuwe, church towers far off, the ridge running out toward Groesbeek
      const prof = f => 4 + 1.2 * Math.sin(f * 17) + 14 * sstep(0.62, 0.9, f) * (th && th.key === 'dyke' ? 0.4 : 1);
      ridge(P, prof, 200); P.trees(0.0, 1, 4, 8, 16);
      for (const f of [0.18, 0.36, 0.47]) P.church(P.X(f), P.rr(18, 26));
      for (let i = 0; i < 16; i++) P.win(P.X(P.rr(0.05, 0.95)), P.rr(1, 3), P.rr(0.3, 0.7), 0.8, 0.8);
    },
  };

  // ---------- the dead: Vierdaagse walkers with their bibs and gladioli, soldiers on the march, students ----------
  const BIB = (k, m) => { pb(k, WHITE, 0, 1.24, -0.37, 0.3, 0.28, 0.02, 0.55, 0, 0, m); for (let i = 0; i < 3; i++) pb(k, IRON, -0.08 + i * 0.08, 1.24, -0.39, 0.05, 0.12, 0.012, 0.55, 0, 0, m); };
  const DEAD = {
    vierdaagse_loper(k, b, K0) {   // a walker on the last day: an orange shirt, a white cap, a number bib, a little backpack, a bunch of gladioli
      init(K0); const [hx, hy, hz] = b.hd, m = C.palC;
      pa(k, K.KG.dome, WHITE, hx, hy + 0.04, hz + 0.02, 0.3, 0, 0, 0.27, 0.22, 0.29, m); pb(k, WHITE, hx, hy + 0.03, hz - 0.16, 0.2, 0.025, 0.14, 0.3, 0, 0, m);
      for (const s of [-1, 1]) pb(k, ORANGE, s * 0.11, 1.33, -0.13, 0.24, 0.62, 0.4, 0.55, 0, 0, m);
      BIB(k, m); pb(k, BLUE, 0, 1.42, 0.13, 0.34, 0.42, 0.2, 0.5, 0, 0, m);
      gladioli(k, 0.27, 0.66, -0.62, 4, m);
    },
    vierdaagse_soldaat(k, b, K0) {   // a soldier on the march: a maroon beret, olive kit, a big pack with a gladiolus stuck in it, boots
      init(K0); const [hx, hy, hz] = b.hd, m = C.palC;
      pa(k, K.KG.ball, MAROON, hx + 0.03, hy + 0.12, hz + 0.02, 0, 0, 0.25, 0.3, 0.1, 0.3, m);
      for (const s of [-1, 1]) { pb(k, OLIVE, s * 0.11, 1.33, -0.13, 0.25, 0.64, 0.42, 0.55, 0, 0, m); pb(k, IRON, s * 0.125, 0.09, -0.04, 0.15, 0.16, 0.32, 0, 0, 0, m); }
      pb(k, OLIVE, 0, 1.46, 0.17, 0.42, 0.56, 0.28, 0.5, 0, 0, m); pa(k, K.KG.cyl, DGREEN, 0, 1.8, 0.04, 0, 0, Math.PI / 2, 0.17, 0.46, 0.17, m);
      BIB(k, m); gladioli(k, 0.14, 1.62, 0.22, 1, m);
    },
    nijmeegse_student(k, b, K0) {   // a student: the hood up, a crate of beer on the shoulder, a long scarf
      init(K0); const [hx, hy, hz] = b.hd, m = C.palC;
      pa(k, K.KG.ball, CONC, hx, hy + 0.03, hz + 0.08, 0, 0, 0, 0.3, 0.33, 0.3, m);
      for (const s of [-1, 1]) pb(k, K.pick([CONC, DGREEN]), s * 0.11, 1.33, -0.13, 0.25, 0.64, 0.42, 0.55, 0, 0, m);
      pb(k, DGREEN, 0.33, 1.86, -0.28, 0.44, 0.3, 0.32, 0, 0, 0.15, m); for (let i = 0; i < 3; i++) pa(k, K.KG.cyl, ORANGE, 0.2 + i * 0.12, 2.03, -0.28, 0, 0, 0.15, 0.06, 0.06, 0.06, m);
      pb(k, MAROON, -0.1, 1.28, -0.47, 0.12, 0.62, 0.03, -0.3, 0, 0, m);
    },
  };

  // ---------- the streets ----------
  const SIGNPOST = ['Waalkade', 'Grote Markt', 'Valkhof', 'Lent', 'Hunnerpark', 'Via Gladiola', 'Benedenstad', 'Station'];
  const fingerpost = K0 => K0.fingerpost(SIGNPOST.slice().sort(() => Math.random() - 0.5).slice(0, 3));
  const OLD = ['step', 'bell', 'spout', 'white', 'step', 'bell', 'post'];
  function street(base) {   // a steep cobbled street of the Benedenstad, gables stepping up the hill, the Stevenskerk over the roofs
    const H = HILLS.street;
    return Object.assign({}, base, { fog: 0x4a5460, fogD: 0.0165, night: 0.17, hills: H, curv: 0.003, lmX: [32, 42], spawn: [
      { make: K0 => row(K0, 5, { hills: H, kinds: OLD }), n: 8, gap: 16, side: 'alt', reg: true, xr: [7.9, 8.1], r: 15 },
      { make: K0 => backRow(K0, 5, { hills: H }), n: 6, gap: 22, side: 'alt', reg: true, xr: [20, 22], y: 2.5, r: 15 },
      { make: lamp, n: 9, gap: 14, side: 'alt', reg: true, xr: [4.7, 4.7] },
      { make: K0 => K0.treeCard([0, 1, 3]), n: 6, gap: 22, side: 'both', xr: [13, 16], r: 0.9 },
      { make: K0 => K0.bikeRow(), n: 4, gap: 32, side: 'both', xr: [4.9, 5.0], r: 0.6 },
      { make: K0 => K0.bollard(), n: 8, gap: 16, side: 'alt', xr: [4.4, 4.4], r: 0.2 },
      { make: K0 => K0.bins(), n: 2, gap: 64, side: 'both', xr: [5.0, 5.1], r: 0.5 },
      { make: gladStall, n: 1, gap: 128, side: 'both', xr: [5.4, 5.7], r: 1.2 },
      { make: fingerpost, n: 1, gap: 128, side: 'both', xr: [4.6, 4.6], r: 0.5 },
      { make: 'zombieWalk', n: 8, gap: 16, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] });
  }
  function shops(base) {   // the Lange Hezelstraat up to the Grote Markt: walking shoes and blister plasters in every window
    const H = HILLS.shops;
    return Object.assign({}, base, { fog: 0x4b5560, fogD: 0.016, night: 0.17, hills: H, curv: 0.0025, lmX: [32, 42], spawn: [
      { make: K0 => row(K0, 5, { hills: H, kinds: OLD, shops: 0.7, lit: 0.45 }), n: 8, gap: 16, side: 'alt', reg: true, xr: [7.9, 8.1], r: 15 },
      { make: K0 => backRow(K0, 5, { hills: H }), n: 6, gap: 22, side: 'alt', reg: true, xr: [20, 22], y: 2.5, r: 15 },
      { make: lamp, n: 9, gap: 14, side: 'alt', reg: true, xr: [4.7, 4.7] },
      { make: K0 => K0.bikeRow(), n: 4, gap: 32, side: 'both', xr: [4.9, 5.0], r: 0.6 },
      { make: K0 => K0.crates(), n: 3, gap: 40, side: 'both', xr: [5.0, 5.2], r: 0.5 },
      { make: gladStall, n: 2, gap: 64, side: 'both', xr: [5.4, 5.7], r: 1.2 },
      { make: K0 => K0.bollard(), n: 8, gap: 16, side: 'alt', xr: [4.4, 4.4], r: 0.2 },
      { make: fingerpost, n: 1, gap: 128, side: 'both', xr: [4.6, 4.6], r: 0.5 },
      { make: 'zombieWalk', n: 9, gap: 14, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] });
  }
  function square(base) {   // the Grote Markt under the Stevenskerk on its hill: café fronts on the left, tables out on the square
    const H = HILLS.square;
    return Object.assign({}, base, { fog: 0x4a5460, fogD: 0.0155, night: 0.17, hills: H, curv: 0.002, lmX: [26, 32], lmSide: 'right', spawn: [
      { make: K0 => row(K0, 5, { hills: H, kinds: OLD, cafes: 0.6, lit: 0.5 }), n: 5, gap: 32, side: 'left', reg: true, xr: [9.8, 10.1], r: 15 },
      { make: K0 => backRow(K0, 5, { hills: H }), n: 4, gap: 40, side: 'left', reg: true, xr: [22, 24], y: 2, r: 15 },
      { make: K0 => terraceBlock(K0, H), n: 5, gap: 24, side: 'right', xr: [6.6, 8.6], r: 3.4 },
      { make: K0 => K0.treeCard([1, 1, 3]), n: 6, gap: 22, side: 'right', xr: [12, 18], r: 0.9 },
      { make: stevenskerk, n: 1, gap: 160, side: 'right', xr: [28, 34], r: 12, y: 0.25 },
      { make: lamp, n: 8, gap: 16, side: 'alt', reg: true, xr: [4.7, 4.7] },
      { make: gladStall, n: 2, gap: 80, side: 'right', xr: [5.4, 5.7], r: 1.2 },
      { make: K0 => K0.bikeRow(), n: 3, gap: 48, side: 'left', xr: [4.9, 5.0], r: 0.6 },
      { make: fingerpost, n: 1, gap: 128, side: 'left', xr: [4.6, 4.6], r: 0.5 },
      { make: 'zombieWalk', n: 7, gap: 18, side: 'both', xr: [5.0, 6.0], r: 0.6 } ] });
  }
  function dyke(base) {   // the Waalkade: flat along the wide black Waal, barges going by, the road under the Waalbrug and De Oversteek
    let nb = 0;
    return Object.assign({}, base, { fog: 0x4a5560, fogD: 0.0115, night: 0.16, open: true, water: 0x2e3a46, waterY: -0.8, ground: 0x0e1419, groundY: -1.2, canal: -1, curv: 0.0022,
      verge: 'tiles', road: { kind: 'klinkers', tone: '#463e3a' }, landmark: false, hills: null, spawn: [
      { make: K0 => (nb++ % 2 ? waalbrug(K0) : oversteek(K0)), n: 2, gap: 150, side: 'left', xr: [0, 0], r: 8 },
      { make: K0 => row(K0, 5, { hills: null, kinds: ['step', 'bell', 'white', 'post', 'spout', 'white'], cafes: 0.45, lit: 0.48 }), n: 6, gap: 32, side: 'right', reg: true, xr: [11, 11.4], r: 15 },
      { make: K0 => backRow(K0, 5, { hills: null, lit: 0.28 }), n: 4, gap: 44, side: 'right', reg: true, xr: [23, 25], y: 4.5, r: 15 },
      { make: K0 => backRow(K0, 5, { hills: null, lit: 0.22 }), n: 3, gap: 60, side: 'right', reg: true, xr: [36, 39], y: 9, r: 15 },
      { make: lamp, n: 9, gap: 16, side: 'alt', reg: true, xr: [4.7, 4.7] },
      { make: railing, n: 8, gap: 24, side: 'left', reg: true, xr: [7.55, 7.55], r: 0.3 },
      { make: barge, n: 3, gap: 70, side: 'left', xr: [16, 34], y: -0.8, r: 2 },
      { make: beacon, n: 5, gap: 40, side: 'left', xr: [10, 13], y: -0.8, r: 0.3 },
      { make: gladStall, n: 2, gap: 100, side: 'right', xr: [5.5, 5.8], r: 1.2 },
      { make: K0 => K0.bench(), n: 2, gap: 80, side: 'right', xr: [5.2, 5.4], r: 0.9 },
      { make: fingerpost, n: 1, gap: 150, side: 'right', xr: [4.6, 4.6], r: 0.5 },
      { make: 'zombieWalk', n: 7, gap: 20, side: 'both', xr: [4.8, 5.6], r: 0.6 } ] });
  }

  T.nijmegen = {
    style: { brick: [0x5a3830, 0x4a302a, 0x6a4232, 0x75553f], gables: 0.6, height: [7, 10], width: [4, 5.5], lamp: 'modern' },
    themes: { street, shops, square, dyke },
    // a wide river sky: the city's light low over the river behind, the bridges' white light, a few stars
    sky: { stars: 120, clouds: 0.7, glows: [{ az: 30, el: 1, w: 120, h: 7, color: 0xffb070, a: 0.12 }, { az: -40, el: 1.5, w: 90, h: 6, color: 0xdfe6ff, a: 0.1 }] },
    light: { lamp: 0xe2eaff, windows: 0xffb466 },
    road: { kind: 'cobbles', tone: '#3c3c40' },
    dead: { pool: ['vierdaagse_loper', 'vierdaagse_loper', 'vierdaagse_soldaat', 'vierdaagse_soldaat', 'nijmeegse_student', 'nijmeegse_student', 'plain'], dress: DEAD },
    lamp: K0 => lamp(K0),
    landmark: K0 => stevenskerk(K0),
    skyline: SKY,
    extra: [],
    shops: SHOPS.concat(CAFES),
    signs: SIGNPOST,
  };
})();
