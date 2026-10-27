// Rotterdam: Manhattan aan de Maas. A city of towers rebuilt after 1940, and the big skyline is the point of the chapter: De
// Zalmhaven, the Maastoren, the three linked blocks of De Rotterdam, New Orleans, Montevideo with its giant M, De Link with its green
// pixel front, the Delftse Poort, the Euromast alone like a needle, tower cranes still building, all with lit floors on the three bands
// round the horizon. Near the road: flat roofed rebuilt blocks over shops under long canopies, high rise behind them, red bike lanes,
// white LED light, the red flame lamps of the Brandgrens set in the pavement where the 1940 fire stopped. The squares bring the yellow
// cube houses on their columns, the Markthal's arch with its painted ceiling glowing through the glass, the Witte Huis. The haven
// level runs along the wide black Maas to the Erasmusbrug: its white bent pylon and the harp of lit cables over the road, ships'
// lights on the water. The dead are dockers and builders in hi-vis, and a Feyenoord supporter.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  const C = {};          // materials, textures and template geometry, made once on first use and kept
  let cur = 'street';    // the theme being built: its skyline is painted before its spawns, so the painter notes it here
  const YAW = -Math.PI / 2, HALF = Math.PI / 2;   // YAW turns a quad to face minus x, the street

  function tex(K, w, h, draw, colour) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new K.THREE.CanvasTexture(c); if (colour) { t.colorSpace = K.THREE.SRGBColorSpace; t.wrapS = t.wrapT = K.THREE.RepeatWrapping; t.anisotropy = 4; } return t;
  }
  // a tower's curtain wall at night: dark glass in a grid, offices lit white floor by floor, some flats warm, ceiling lights in rows
  function officeTex(K, seed, warm) {
    let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    return tex(K, 256, 256, (g, w, h) => {
      g.fillStyle = '#141a22'; g.fillRect(0, 0, w, h);
      for (let f = 0; f < 8; f++) {
        const floorLit = r() < 0.3, y = f * 32;
        g.fillStyle = '#232a33'; g.fillRect(0, y + 26, w, 6);
        for (let c = 0; c < 8; c++) {
          const x = c * 32, on = floorLit ? r() < 0.85 : r() < 0.22, home = warm && r() < 0.6;
          g.fillStyle = on ? (home ? `rgb(${236 + r() * 19 | 0},${196 + r() * 30 | 0},${140 + r() * 30 | 0})` : `rgb(${200 + r() * 30 | 0},${222 + r() * 20 | 0},${236 + r() * 19 | 0})`) : (r() < 0.3 ? '#2c3540' : '#1a2029');
          g.fillRect(x + 2, y + 3, 28, 22);
          if (on && !home) { g.fillStyle = 'rgba(255,255,255,0.55)'; g.fillRect(x + 2, y + 4, 28, 3); }
          g.fillStyle = '#10151b'; g.fillRect(x + 15, y + 3, 2, 22);
        }
      }
    }, true);
  }
  function init(K) {
    if (C.ok) return C;
    const { THREE, Mat, GlowMat, glowTex } = K, keep = m => { m.userData.shared = true; return m; };
    C.walls = [0x5c4c40, 0x6e5a44, 0x4e4844, 0x665e56].map(c => K.brickMat(c));
    C.concrete = keep(Mat({ color: 0x7c7a74 })); C.darkConc = keep(Mat({ color: 0x45464a }));
    C.red = keep(Mat({ color: 0x5e2622 }, 0x7a5a64));
    C.yellow = keep(Mat({ color: 0xd0a424 }, 0x7a5a64));
    C.white = keep(Mat({ color: 0xc4c2ba }));
    C.swan = keep(Mat({ color: 0xc6d6e2 }));
    C.paving = keep(Mat({ color: 0x2c2e34 }));
    C.office = [officeTex(K, 11, false), officeTex(K, 29, true), officeTex(K, 53, false)].map(t => keep(new THREE.MeshBasicMaterial({ map: t })));
    C.lit = keep(new THREE.MeshBasicMaterial({ color: 0xe6eef6 }));
    C.warm = keep(new THREE.MeshBasicMaterial({ color: 0xffd9a6 }));
    C.glass = keep(new THREE.MeshBasicMaterial({ color: 0x1c2530 })); C.under = keep(new THREE.MeshBasicMaterial({ color: 0x7a8896 }));
    C.shell = keep(new THREE.MeshBasicMaterial({ map: (() => { const t = tex(K, 256, 256, g => {   // the Markthal's stone shell and the square windows of the flats in it
      g.fillStyle = '#3a3834'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const on = Math.random() < 0.4; g.fillStyle = on ? '#f0cc92' : '#1a2027'; g.fillRect(i * 64 + 18, j * 64 + 18, 28, 28); }
    }, true); t.repeat.set(1 / 16, 1 / 16); return t; })() }));
    const white = tex(K, 4, 4, g => { g.fillStyle = '#fff'; g.fillRect(0, 0, 4, 4); });
    C.cable = keep(GlowMat(white, 0xe4f0ff, 0.85));
    C.bulb = keep(GlowMat(glowTex, 0xeef4ff, 0.95, false, { side: THREE.DoubleSide }));
    C.redLamp = keep(GlowMat(glowTex, 0xff3826, 0.95, false, { side: THREE.DoubleSide }));
    C.greenLamp = keep(GlowMat(glowTex, 0x40ff70, 0.95, false, { side: THREE.DoubleSide }));
    C.flame = keep(GlowMat(tex(K, 64, 64, (g, w, h) => {   // a Brandgrens lamp seen from above: a flame in a ring of light
      const rg = g.createRadialGradient(32, 32, 2, 32, 32, 32); rg.addColorStop(0, 'rgba(255,255,255,0.9)'); rg.addColorStop(0.35, 'rgba(255,255,255,0.45)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(255,255,255,1)'; g.beginPath(); g.moveTo(32, 12); g.quadraticCurveTo(44, 28, 38, 42); g.quadraticCurveTo(32, 50, 26, 42); g.quadraticCurveTo(22, 30, 32, 12); g.fill();
    }), 0xff4a1c, 1.0, false));
    // the dead
    C.hivisY = keep(Mat({ color: 0xc6e02a, emissive: 0x5a6a08, emissiveIntensity: 0.7 }));
    C.hivisO = keep(Mat({ color: 0xf07020, emissive: 0x7a2c06, emissiveIntensity: 0.7 }));
    C.reflect = keep(new THREE.MeshBasicMaterial({ color: 0xd2d8de }));
    C.jeans = keep(Mat({ color: 0x24324a })); C.helmetW = keep(Mat({ color: 0xd8d8d0 })); C.helmetY = keep(Mat({ color: 0xe0b020 }));
    C.feyRed = keep(Mat({ color: 0xb01e1e })); C.feyWhite = keep(Mat({ color: 0xe0ddd4 }));
    // template geometry, copied into kits and never drawn itself
    C.hex = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
    // the window glow of every house in the game, taken from one probe house so it dims and tints with the rest of the town
    const probe = K.house({ lit: 1, plain: true, gable: 'roof' });
    probe.traverse(m => { if (m.isMesh && !C.glow && m.material && m.material.blending === THREE.AdditiveBlending) C.glow = m.material; if (m.isMesh && m.geometry && m.geometry.userData.kit) m.geometry.dispose(); });
    C.glow = C.glow || keep(GlowMat(glowTex, 0xffb466, 0.55)); C.mirror = keep(GlowMat(C.glow.map, 0xffe2b8, 0.9));
    C.ok = true; return C;
  }
  // a box whose sides carry a facade texture in metres (one repeat is 24 m: eight floors of 3 m), shifted so no two towers match
  function facadeBox(K, w, h, d) {
    const g = new K.THREE.BoxGeometry(w, h, d), p = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv, ou = Math.random(), ov = Math.floor(Math.random() * 8) / 8;
    for (let i = 0; i < p.count; i++) {
      const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i));
      if (ay > 0.5) uv.setXY(i, 0.01, 0.01); else uv.setXY(i, (ax > 0.5 ? p.getZ(i) + d / 2 : p.getX(i) + w / 2) / 24 + ou, (p.getY(i) + h / 2) / 24 + ov);
    }
    return g;
  }
  // one window of the game's atlas on a front facing minus x; a lit one gets its glow on the wall
  function win(K, k, x, y, z, w, h, litP) {
    const lit = Math.random() < litP, cell = lit ? K.pick([0, 0, 1, 2]) : K.pick([3, 4, 4, 5]);
    K.kadd(k, K.PG['win' + cell], K.PM.winAtlas, x - 0.012, y, z, 0, YAW, 0, w, h);
    if (lit) K.kadd(k, K.PG.winGlow, C.glow, x - 0.07, y, z, 0, YAW, 0, w * 2.4, h * 1.45);
    return lit;
  }

  // a rebuilt block of the fifties: flat roofed, four or five floors of brick between concrete bands, shops in the ground floor under
  // one long canopy, sometimes a recessed top floor or gallery balconies. Street front at local x 0, the block runs back to plus x
  function block(K, o = {}) {
    const c = init(K), k = K.kit(), { kb, kadd, rnd, pick, PM, PG } = K;
    const L = o.L || rnd(24, 34), D = 12, fl = o.floors || (3 + Math.floor(Math.random() * 3)), H = 4.4 + fl * 3, wall = pick(c.walls), litP = 0.4;
    kb(k, wall, D / 2, H / 2, 0, D, H, L); kb(k, c.concrete, D / 2, H + 0.25, 0, D + 0.2, 0.5, L + 0.2);
    kb(k, c.concrete, -0.1, 4.3, 0, 0.2, 0.25, L);
    const gallery = Math.random() < 0.35; let grp;
    for (let f = 0; f < fl; f++) {
      const y = 6.0 + f * 3;
      if (gallery) { kb(k, c.concrete, -0.7, y - 1.45, 0, 1.4, 0.18, L); kb(k, PM.pole, -1.38, y - 0.85, 0, 0.04, 0.05, L); for (let z = -L / 2 + 0.4; z < L / 2; z += 1.6) kb(k, PM.pole, -1.38, y - 1.1, z, 0.03, 0.55, 0.03); }
      else kb(k, c.concrete, -0.06, y - 1.45, 0, 0.12, 0.16, L);
      for (let z = -L / 2 + 1.5; z < L / 2 - 1; z += 2.2) win(K, k, 0, y, z, 1.5, 1.6, litP);
    }
    if (o.shops !== false) {   // shops under the canopy: lit interiors and their glow and streaks, the signs above
      for (let z = -L / 2 + 2.6; z < L / 2 - 2; z += 5.2) {
        kadd(k, PG['shop' + (Math.random() < 0.5 ? 1 : 0)], PM.winAtlas, -0.03, 1.7, z, 0, YAW, 0, 4.6, 2.6);
        kadd(k, PG.winGlow, c.glow, -0.09, 1.9, z, 0, YAW, 0, 6.5, 4.4); kadd(k, PG.winStreak, c.glow, -1.4, 0.09, z, -HALF, 0, 0, 2.6, 4.6);
        kb(k, PM.pole, -0.06, 1.6, z + 2.55, 0.12, 3.2, 0.16);
      }
      kb(k, c.darkConc, -1.4, 3.35, 0, 2.8, 0.22, L); kb(k, c.lit, -2.79, 3.32, 0, 0.02, 0.1, L - 0.4);   // the canopy and its lit edge
      if (Math.random() < 0.7) {
        const t = K.labelTexture(pick(T.rotterdam.shops), { bg: '#111418', fg: '#e8eef4' });
        const sg = new K.THREE.Mesh(new K.THREE.PlaneGeometry(4.4, 0.85), K.Mat({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.55 }));
        sg.position.set(-0.08, 4.0, rnd(-L / 4, L / 4)); sg.rotation.y = YAW; sg.userData.ownTex = true; grp = new K.THREE.Group(); grp.add(sg);
      }
    } else for (let z = -L / 2 + 1.5; z < L / 2 - 1; z += 2.2) win(K, k, 0, 2.2, z, 1.5, 1.8, litP);
    const g = K.kbuild(k, grp); g.userData.faceRoad = true; return g;
  }
  // a high rise: a tall box of lit offices or flats, its glass lobby lit at the foot, sometimes a lit crown. Front at local x 0
  function tower(K, o = {}) {
    const c = init(K), k = K.kit(), { kb, kadd, rnd, pick } = K;
    const w = rnd(14, 22), d = rnd(14, 22), h = o.low ? rnd(28, 50) : rnd(40, 95), geo = facadeBox(K, d, h, w);
    kadd(k, geo, pick(c.office), d / 2, h / 2, 0); geo.dispose();
    kb(k, c.darkConc, d / 2, 2.4, 0, d + 0.6, 4.8, w + 0.6); kb(k, c.lit, -0.32, 2.0, 0, 0.02, 3.0, w * 0.7);
    kadd(k, K.PG.winGlow, c.glow, -0.4, 2.2, 0, 0, YAW, 0, w * 0.9, 5);
    if (Math.random() < 0.4) kb(k, c.lit, d / 2, h + 1.2, 0, d * 0.7, 2.4, w * 0.7);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // thirty metres of red bike lane on both sides of the road, and on the right the Brandgrens: a red flame set in the paving every
  // three metres. It lies behind its anchor, so a row of them joins up as they recycle
  function lanes(K, brand) {
    const c = init(K), k = K.kit(), L = 30, { kb, kadd, KG } = K;
    for (const s of [-1, 1]) kb(k, c.red, s * 6.0, 0.075, L / 2, 2.0, 0.03, L);
    if (brand) for (let z = 1.5; z < L; z += 3) kadd(k, KG.plane, c.flame, 7.35, 0.1, z, -HALF, 0, 0, 0.7, 0.7);
    return K.kbuild(k);
  }
  // the white LED street light: a tall slim mast, a long arm, a flat head over the road
  function ledLamp(K) {
    const k = K.kit(), { kb, kadd, KG, PM, PG } = K;
    kadd(k, KG.cyl, PM.pole, 0, 4, 0, 0, 0, 0, 0.17, 8, 0.17); kb(k, PM.pole, -0.85, 7.95, 0, 1.8, 0.07, 0.09);
    const g = K.kbuild(k), head = new K.THREE.Mesh(PG.bulb, PM.lampHead); head.position.set(-1.65, 7.85, 0); head.scale.set(2.6, 0.32, 1.3); g.add(head);
    K.lampLights(g, -1.65, 7.85, 0, 1.3); g.userData.faceRoad = true; return g;
  }
  // the cube houses at Blaak (Piet Blom, 1984): yellow cubes tipped onto one corner, each on a hexagonal column, windows in every face
  function cubes(K) {
    const c = init(K), k = K.kit(), { kb, kadd, KG, THREE } = K, s = 6.4, cy = 5.2 + s * 0.866;
    const q = new THREE.Quaternion(), qy = new THREE.Quaternion(), e = new THREE.Euler(-0.6155, 0, Math.PI / 4, 'XYZ'), v = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < 4; i++) {
      const z = -11.25 + i * 7.5, x = (i % 2) * 1.2;
      kadd(k, c.hex, c.concrete, x, 3.0, z, 0, i * 0.5, 0, 2.6, 6.0, 2.6); kadd(k, c.hex, c.darkConc, x, 1.2, z, 0, i * 0.5, 0, 3.4, 2.4, 3.4);
      qy.setFromAxisAngle(v.set(0, 1, 0), i * 0.5 + 0.3); q.setFromEuler(e).premultiply(qy);
      k.base.compose(v.set(x, cy, z), q, one);
      kb(k, c.yellow, 0, 0, 0, s, s, s);
      for (const [nx, ny, nz] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
        const lit = Math.random() < 0.55, rx = ny ? -ny * HALF : 0, ry = nx ? nx * HALF : nz < 0 ? Math.PI : 0, off = s / 2 + 0.03;
        kadd(k, KG.plane, lit ? c.warm : c.glass, nx * off, ny * off, nz * off, rx, ry, 0, 1.7, 1.7);
        if (lit) kadd(k, K.PG.winGlow, c.glow, nx * (off + 0.05), ny * (off + 0.05), nz * (off + 0.05), rx, ry, 0, 4, 4);
      }
      k.base.identity();
    }
    kb(k, c.darkConc, 0.6, 5.0, 0, 3, 0.4, 28);   // the walkway between the columns
    return K.kbuild(k);
  }
  // the Markthal (2014): a great horseshoe arch of grey stone with flats in its shell, its end glazed with a cable net, and behind the
  // glass the painted ceiling, giant fruit and flowers, lit. Its glazed end faces the rider coming up the street (plus z)
  function markthal(K) {
    const c = init(K), k = K.kit(), { kb, kadd, KG, THREE } = K, ox = 17, oy = 21, ix = 12.5, iy = 16, D = 44;
    if (!C.arch) {
      const sh = new THREE.Shape(); sh.moveTo(-ox, 0); sh.absellipse(0, 0, ox, oy, Math.PI, 0, true); sh.lineTo(ix, 0); sh.absellipse(0, 0, ix, iy, 0, Math.PI, false); sh.closePath();
      C.arch = new THREE.ExtrudeGeometry(sh, { depth: D, bevelEnabled: false, curveSegments: 20 });
      C.mural = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.5, map: tex(K, 512, 330, (g, w, h) => {
        const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f2c27a'); gr.addColorStop(1, '#b8743a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        const blob = (x, y, rx, ry, col) => { g.fillStyle = col; g.beginPath(); g.ellipse(x, y, rx, ry, Math.random(), 0, 7); g.fill(); };
        for (let i = 0; i < 26; i++) { const x = Math.random() * w, y = Math.random() * h * 0.8, r = 18 + Math.random() * 40;
          const k2 = i % 6; if (k2 === 0) blob(x, y, r, r, '#c8302a'); else if (k2 === 1) blob(x, y, r * 0.8, r, '#8cb43a'); else if (k2 === 2) blob(x, y, r, r * 0.7, '#f0d040');
          else if (k2 === 3) { for (let j = 0; j < 6; j++) blob(x + Math.cos(j) * r * 0.6, y + Math.sin(j) * r * 0.6, r * 0.45, r * 0.3, '#e46aa0'); blob(x, y, r * 0.3, r * 0.3, '#f8e070'); }
          else if (k2 === 4) blob(x, y, r * 1.4, r * 0.5, '#6aa0c8'); else for (let j = 0; j < 7; j++) blob(x + (j % 3) * 10, y + j * 6, 9, 9, '#7a3c8a'); }
        g.strokeStyle = 'rgba(30,30,34,0.55)'; g.lineWidth = 2; for (let x = 0; x < w; x += 26) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 26) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
        g.globalCompositeOperation = 'destination-in'; g.fillStyle = '#fff'; g.beginPath(); g.ellipse(w / 2, h, w / 2, h, 0, Math.PI, 0); g.fill();
      }, true) }); C.mural.userData.shared = true;
    }
    const cx = ox;   // the near leg stands on the line of the street front, the arch beyond it
    kadd(k, C.arch, c.shell, cx, 0, -D / 2); kadd(k, KG.plane, C.mural, cx, iy / 2, D / 2 - 0.6, 0, 0, 0, ix * 2, iy);
    kadd(k, K.PG.winGlow, c.glow, cx, iy / 2, D / 2 + 0.2, 0, 0, 0, ix * 2.6, iy * 1.5);
    for (let i = 0; i < 15; i++) { const a = Math.PI * (i + 0.5) / 15, rx = (ox + ix) / 2, ry = (oy + iy) / 2; kadd(k, KG.plane, Math.random() < 0.5 ? c.warm : c.glass, cx + Math.cos(a) * rx, Math.sin(a) * ry, D / 2 + 0.05, 0, 0, 0, 1.4, 1.4); }
    kadd(k, K.PG.winStreak, C.mirror, cx, 0.09, D / 2 + 9, -HALF, 0, 0, ix * 1.6, 16);
    return K.kbuild(k);
  }
  // the Witte Huis (1898), once the tallest office building in Europe: white stone, a steep roof, a turret on each corner
  function witteHuis(K) {
    const c = init(K), k = K.kit(), { kb, kadd, KG, PM } = K, W = 20, H = 27;
    kb(k, c.white, W / 2, H / 2, 0, W, H, W); kb(k, c.concrete, -0.2, H - 0.3, 0, 0.4, 0.5, W + 0.4);
    for (const y of [2.6, 5.6, 8.6, 11.6, 14.6, 17.6, 20.6, 23.6]) for (let z = -7.5; z <= 7.6; z += 2.5) win(K, k, 0, y, z, 1.1, 2.0, 0.45);
    kadd(k, KG.cyl, PM.roof, W / 2, H + 5, 0, 0, Math.PI / 4, 0, 0.5, 10, 0.5); kadd(k, K.PG.lantCap, PM.roof, W / 2, H + 4.5, 0, 0, Math.PI / 4, 0, 39, 28, 39);
    for (const sx of [0.6, W - 0.6]) for (const sz of [-W / 2 + 0.6, W / 2 - 0.6]) { kadd(k, KG.cyl, c.white, sx, H + 2.5, sz, 0, 0, 0, 3.2, 5, 3.2); kadd(k, KG.dome, PM.roof, sx, H + 5, sz, 0, 0, 0, 3.4, 4, 3.4); kadd(k, KG.cyl, PM.roof, sx, H + 7.3, sz, 0, 0, 0, 0.2, 2, 0.2); }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // ---- the Maas ----
  // the Erasmusbrug, the swan: its white pylon in the river bent like a neck, the harp of lit cables fanning down to the deck, the
  // deck crossing high over the quay road and on over the water, lamps along it and light under it. Built for the river side (minus x)
  function erasmusbrug(K) {
    const c = init(K), k = K.kit(), { kb, kadd, ktube, KG, PM } = K, dy = 12.5, px = -34;
    kb(k, c.swan, -80, dy, 0, 240, 1.2, 13); kb(k, c.darkConc, -80, dy - 0.9, 0, 240, 0.6, 9);
    for (const s of [-1, 1]) { kb(k, c.red, -80, dy + 0.62, s * 5.6, 240, 0.04, 2.2); kb(k, PM.pole, -80, dy + 1.4, s * 6.5, 240, 0.05, 0.05); }
    for (let x = 34; x > -196; x -= 6) for (const s of [-1, 1]) kadd(k, KG.plane, c.bulb, x, dy + 1.8, s * 6.55, 0, 0, 0, 0.7, 0.7);
    for (const x of [26, 10]) for (const s of [-1, 1]) kb(k, c.swan, x, dy / 2, s * 4, 1.6, dy, 1.6);
    for (const s of [-1, 1]) kb(k, c.under, -80, dy - 1.25, s * 3, 236, 0.04, 1.0);
    // the pylon: two legs from the water to the deck, then one shaft leaning back with a kink near the top
    for (const s of [-1, 1]) ktube(k, c.swan, px - 6, -1, s * 5, px, dy, s * 1.2, 0.9);
    const a = [px, dy, 0], b = [px + 7, 40, 0], t = [px + 3, 56, 0];
    ktube(k, c.swan, ...a, ...b, 1.3); ktube(k, c.swan, ...b, ...t, 1.0);
    for (let i = 0; i < 9; i++) {   // the harp over the river and the backstays over the quay, lit white
      const u = 0.25 + i * 0.09, hx = b[0] + (t[0] - b[0]) * u, hy = b[1] + (t[1] - b[1]) * u;
      for (const s of [-1, 1]) { ktube(k, c.cable, hx, hy, s * 0.6, px - 14 - i * 10, dy + 0.6, s * 5.8, 0.09); ktube(k, c.cable, hx, hy, s * 0.6, px + 16 + i * 4.2, dy + 0.6, s * 5.8, 0.09); }
    }
    kadd(k, KG.plane, c.bulb, t[0], t[1] + 1, 1.2, 0, 0, 0, 2.4, 2.4);
    for (let x = -50; x > -190; x -= 20) kadd(k, K.PG.winStreak, C.mirror, x, -0.7, 9, -HALF, 0, 0, 1.6, 18);
    return K.kbuild(k);
  }
  // a Rhine barge on the Maas: long dark hull, containers, the lit wheelhouse aft, its sidelights and masthead light; it moves
  // upriver on its own as it is drawn, and waits behind the camera for its anchor to come round again
  function ship(K) {
    const c = init(K), k = K.kit(), { kb, kadd, KG, PM, pick } = K, L = 70;
    kb(k, K.M.dark, 0, 0.2, 0, 9, 2.2, L); kb(k, K.M.dark, 0, 0.2, -L / 2 - 2, 6, 2.2, 4);
    for (let z = -L / 2 + 6; z < L / 2 - 14; z += 6.4) if (Math.random() < 0.75) kb(k, pick([c.red, c.darkConc, PM.boat]), 0, 2.4, z, 8.4, 2.1, 6.0);
    for (let z = -L / 2 + 2; z < L / 2 - 10; z += 5) for (const s of [-1, 1]) kadd(k, KG.plane, c.bulb, s * 4.55, 1.5, z, 0, s * HALF, 0, 0.5, 0.5);
    kb(k, c.white, 0, 3.4, L / 2 - 6, 7, 3.2, 6); kb(k, c.warm, 0, 4.2, L / 2 - 9.02, 5.6, 1.0, 0.02); for (const s of [-1, 1]) kb(k, c.warm, s * 3.52, 4.2, L / 2 - 6, 0.02, 1.0, 4.4);
    kadd(k, KG.plane, c.redLamp, -3.6, 5.0, L / 2 - 8, 0, YAW, 0, 1.4, 1.4); kadd(k, KG.plane, c.greenLamp, 3.6, 5.0, L / 2 - 8, 0, -YAW, 0, 1.4, 1.4);
    kb(k, PM.pole, 0, 7.5, -L / 2 + 1, 0.15, 7, 0.15); kadd(k, KG.plane, c.bulb, 0, 11.2, -L / 2 + 1, 0, 0, 0, 1.6, 1.6); kadd(k, KG.plane, c.bulb, 0, 6.2, L / 2 - 4, 0, 0, 0, 1.4, 1.4);
    kadd(k, K.PG.winStreak, C.mirror, 0, -0.66, L / 2 + 6, -HALF, 0, 0, 2.4, 14);
    const g = K.kbuild(k), o = new K.THREE.Group(); o.add(g); let last = 0;
    g.children[0].onBeforeRender = () => { const now = performance.now(), dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now; g.position.z -= 3 * dt; if (g.position.z < -200) g.position.z += 400; };
    return o;
  }
  // the quay along the Maas: its stone edge and bollards on the river side; on the town side the land, level with the road
  function quay(K) {
    const c = init(K), k = K.kit(), L = 100, { kb, kadd, KG, PM } = K;
    kb(k, c.darkConc, -7.75, -0.45, L / 2, 0.14, 0.9, L); kb(k, c.concrete, -7.6, 0.06, L / 2, 0.3, 0.08, L);
    for (let z = 4; z < L; z += 12) kadd(k, KG.cyl, PM.pole, -7.2, 0.4, z, 0, 0, 0, 0.36, 0.8, 0.36);
    for (let i = 0; i < 9; i++) kadd(k, K.PG.winStreak, C.mirror, K.rnd(-30, -11), -0.71, K.rnd(5, L - 5), -HALF, 0, 0, K.rnd(1.0, 2.2), K.rnd(10, 18));   // the far shore's lights in the black water
    kb(k, c.paving, 62, -0.04, L / 2, 108, 0.06, L);
    return K.kbuild(k);
  }
  // ---- the skyline, painted on the three bands round the horizon ----
  const Yp = (P, h) => P.g.canvas.height - (5 + h) * P.m;
  function glow(P, x, h, w, hh, col) { P.w.fillStyle = col; P.w.fillRect(x - w * P.m / 2, Yp(P, h) - hh * P.m, w * P.m, hh * P.m); }
  function litLine(P, x0, h0, x1, h1, wd, col) { const w = P.w; w.strokeStyle = col; w.lineWidth = Math.max(1, wd * P.m); w.beginPath(); w.moveTo(x0, Yp(P, h0)); w.lineTo(x1, Yp(P, h1)); w.stroke(); }
  const OFFICE = a => `rgba(196,255,255,${a})`, HOME = a => `rgba(255,236,206,${a})`, RED = a => `rgba(255,46,34,${a})`;
  function floors(P, x, w, h0, h1, share, col, fh = 3.2, cw = 2.2) {   // lit floors across a tower: whole office floors and single windows
    for (let f = h0 + 1.2; f < h1 - 1.4; f += fh) {
      if (P.r() < share * 0.22) { glow(P, x, f, w * 0.8, fh * 0.38, col(P.rr(0.3, 0.6))); continue; }
      for (let c = -w / 2 + cw * 0.7; c < w / 2 - cw * 0.5; c += cw) if (P.r() < share) glow(P, x + c * P.m, f, cw * 0.46, fh * 0.4, col(P.rr(0.5, 1)));
    }
  }
  function silverTop(P, x, w, h0, h1) {   // a facade fading from dark stone to pale silver toward the top
    const g = P.g, gr = g.createLinearGradient(0, Yp(P, h0), 0, Yp(P, h1)); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0.42)');
    g.fillStyle = gr; g.fillRect(x - w * P.m / 2, Yp(P, h1), w * P.m, (h1 - h0) * P.m); g.fillStyle = '#fff';
  }
  function blocks(P, f0, f1, h0, h1, share) {   // modern blocks and slabs, flat roofed, some with a setback, lit floor by floor
    let x = P.X(f0);
    while (x < P.X(f1)) { const w = P.rr(12, 24), h = P.rr(h0, h1); P.box(x, w, -5, h); if (P.r() < 0.4) P.box(x + P.rr(-3, 3) * P.m, w * 0.6, h, h + P.rr(3, 8)); floors(P, x, w, 0, h, share, P.r() < 0.5 ? OFFICE : HOME); x += w * P.m * P.rr(0.9, 1.35); }
  }
  function zalmhaven(P, x, s) {   // De Zalmhaven, 215 m, the tallest in the country: slim, its glass crown lit, two lower companions
    const m = P.m; P.box(x, 11 * s, -5, 88 * s); P.box(x, 9 * s, 88 * s, 93 * s); P.line(x, 93 * s, x, 98 * s, 0.4); floors(P, x, 11 * s, 0, 86 * s, 0.4, HOME, 3, 1.8);
    glow(P, x, 88.4 * s, 9 * s, 4.4 * s, OFFICE(0.8)); glow(P, x, 97.5 * s, 0.9, 0.9, RED(1));
    for (const dx of [-11, 10]) { P.box(x + dx * s * m, 8 * s, -5, 30 * s); floors(P, x + dx * s * m, 8 * s, 0, 30 * s, 0.4, HOME, 3, 1.8); }
  }
  function maastoren(P, x, s) {   // the Maastoren: a tall slab and a lower one, dark stone at the foot to silver at the top, a lit room on top
    const m = P.m; P.box(x, 13 * s, -5, 36 * s); silverTop(P, x, 13 * s, 36 * s, 70 * s); P.box(x + 10.5 * m * s, 9 * s, -5, 45 * s);
    floors(P, x, 13 * s, 0, 70 * s, 0.32, OFFICE); floors(P, x + 10.5 * m * s, 9 * s, 0, 45 * s, 0.3, OFFICE);
    P.box(x, 6 * s, 70 * s, 73.5 * s); glow(P, x, 70.4 * s, 6 * s, 2.6 * s, OFFICE(0.85)); P.line(x + 3 * m * s, 73 * s, x + 3 * m * s, 79 * s, 0.3);
  }
  function deRotterdam(P, x, s) {   // De Rotterdam: three linked towers on one base, their upper halves shifted
    const m = P.m; P.box(x, 46 * s, -5, 13 * s);
    for (const dx of [-15, 0, 15]) { const xx = x + dx * m * s, sh = (dx === 0 ? -3 : 3) * m * s; P.box(xx, 12 * s, 13 * s, 40 * s); P.box(xx + sh, 12 * s, 40 * s, 62 * s);
      floors(P, xx, 12 * s, 13 * s, 40 * s, 0.45, dx ? HOME : OFFICE, 3, 2); floors(P, xx + sh, 12 * s, 40 * s, 62 * s, 0.4, HOME, 3, 2); }
  }
  function newOrleans(P, x, s) { const m = P.m; P.box(x, 10 * s, -5, 60 * s); P.box(x, 8 * s, 60 * s, 64 * s); P.poly([[x - 4 * m * s, 64 * s], [x, 67 * s], [x + 4 * m * s, 64 * s]]); floors(P, x, 10 * s, 0, 60 * s, 0.4, HOME, 3, 1.8); glow(P, x, 61 * s, 6 * s, 2 * s, HOME(0.6)); }
  function montevideo(P, x, s) {   // Montevideo: interlocking blocks over the quay, and on the roof its giant M
    const m = P.m; P.box(x, 16 * s, -5, 30 * s); P.box(x - 2 * m * s, 12 * s, 30 * s, 52 * s); P.box(x + 3.5 * m * s, 8 * s, 44 * s, 55 * s);
    floors(P, x, 16 * s, 0, 30 * s, 0.4, HOME, 3, 2); floors(P, x - 2 * m * s, 12 * s, 30 * s, 52 * s, 0.4, HOME, 3, 2);
    const mx = x + 1 * m * s, y0 = 56 * s, y1 = 63 * s, hw = 4.4 * s * m;
    for (const [a, b, c2, d] of [[mx - hw, y0, mx - hw, y1], [mx - hw, y1, mx, y0 + 2.5 * s], [mx, y0 + 2.5 * s, mx + hw, y1], [mx + hw, y1, mx + hw, y0]]) { P.line(a, b, c2, d, 0.9 * s); litLine(P, a, b, c2, d, 0.3 * s, HOME(0.45)); }
  }
  function deLink(P, x, s) {   // De Link: the front leans like the bridge's cables, and its 896 green lamps play across it
    const m = P.m, w = 16 * s, h = 44 * s, lean = 4 * s; P.poly([[x - w / 2 * m, -5], [x + (lean - w / 2) * m, h], [x + (lean + w / 2) * m, h], [x + w / 2 * m, -5]]);
    for (let fy = 2; fy < h - 1; fy += 1.7 * s) for (let fx = -w / 2 + 1; fx < w / 2 - 0.6; fx += 1.5 * s) if (P.r() < 0.62) glow(P, x + (fx + lean * fy / h) * m, fy, 0.6 * s, 0.6 * s, `rgba(60,255,110,${P.rr(0.55, 1)})`);
  }
  function euromast(P, x, s) {   // the Euromast: a concrete shaft, the crow's nest, the thin Space Tower and its cabin, a red light on top
    const m = P.m; P.box(x, 3.4 * s, -5, 47 * s); P.g.beginPath(); P.g.ellipse(x, Yp(P, 48.5 * s), 6.5 * m * s, 2.2 * m * s, 0, 0, 7); P.g.fill();
    P.box(x, 1.5 * s, 50 * s, 84 * s); P.box(x, 3.4 * s, 66 * s, 68 * s); P.line(x, 84 * s, x, 89 * s, 0.25);
    glow(P, x, 47.8 * s, 10 * s, 1.1 * s, HOME(0.85)); glow(P, x, 66.4 * s, 2.6 * s, 1.0 * s, HOME(0.6)); glow(P, x, 88.6 * s, 1.0, 1.0, RED(1));
  }
  function delftsePoort(P, x, s) { const m = P.m; P.box(x, 13 * s, -5, 76 * s); P.box(x + 13 * m * s, 12 * s, -5, 47 * s); floors(P, x, 13 * s, 0, 76 * s, 0.28, OFFICE); floors(P, x + 13 * m * s, 12 * s, 0, 47 * s, 0.28, OFFICE); }
  function millennium(P, x, s) { const m = P.m; P.box(x, 12 * s, -5, 58 * s); P.poly([[x - 6 * m * s, 58 * s], [x, 62 * s], [x + 6 * m * s, 58 * s]]); P.line(x, 62 * s, x, 72 * s, 0.5 * s); floors(P, x, 12 * s, 0, 58 * s, 0.35, OFFICE); glow(P, x, 71.5 * s, 0.8, 0.8, RED(1)); }
  function wpc(P, x, s) { const m = P.m; P.box(x, 12 * s, -5, 52 * s); P.poly([[x - 6 * m * s, 52 * s], [x + 6 * m * s, 58 * s], [x + 6 * m * s, 52 * s]]); floors(P, x, 12 * s, 0, 52 * s, 0.35, OFFICE); }
  function crane(P, x, h, jib, dir) {   // a tower crane: lattice mast, jib and counter jib, red lights
    const m = P.m; P.line(x, -5, x, h, 0.9); for (let y = 1; y < h - 1; y += 3) P.line(x - 0.5 * m, y, x + 0.5 * m, y + 2.6, 0.15);
    P.line(x - dir * jib * 0.3 * m, h, x + dir * jib * m, h, 0.7); P.line(x, h + 5, x + dir * jib * 0.7 * m, h, 0.15); P.line(x, h + 5, x - dir * jib * 0.3 * m, h, 0.15); P.box(x - dir * jib * 0.25 * m, 2.5, h - 2.2, h);
    P.line(x, h, x, h + 5, 0.4); P.line(x + dir * jib * 0.6 * m, h, x + dir * jib * 0.6 * m, h * 0.55, 0.08);
    glow(P, x, h + 5, 0.9, 0.9, RED(1)); glow(P, x + dir * jib * m, h, 0.7, 0.7, RED(0.9));
  }
  function swan(P, x, s, k) {   // the Erasmusbrug: the bent white pylon, the harp of lit cables, the deck
    const m = P.m; P.poly([[x - 1.5 * m * s, 10 * s], [x + 1.5 * m * s, 10 * s], [x + 5.5 * m * s, 44 * s], [x + 2.6 * m * s, 64 * s], [x + 0.8 * m * s, 63 * s], [x + 3.3 * m * s, 45 * s]]);
    litLine(P, x, 10 * s, x + 4.4 * m * s, 44.5 * s, 0.8 * s, OFFICE(0.4 * k)); litLine(P, x + 4.4 * m * s, 44.5 * s, x + 1.7 * m * s, 63.5 * s, 0.7 * s, OFFICE(0.4 * k));
    for (let i = 1; i <= 9; i++) { const hy = 46 * s + i * 1.8 * s, hx = x + (4.4 - i * 0.24) * m * s, x1 = x - (8 + i * 7) * m * s, x2 = x + (10 + i * 3.5) * m * s;
      P.line(hx, hy, x1, 10 * s, 0.12); P.line(hx, hy, x2, 10 * s, 0.12); litLine(P, hx, hy, x1, 10 * s, 0.14, OFFICE(0.55 * k)); litLine(P, hx, hy, x2, 10 * s, 0.14, OFFICE(0.55 * k)); }
    P.box(x - 10 * m * s, 150 * s, 9 * s, 11 * s); for (let i = -12; i < 8; i++) glow(P, x + i * 7 * m * s, 11.3 * s, 0.6, 0.6, OFFICE(0.8 * k));
  }
  function willemsbrug(P, x, s) {   // the Willemsbrug's two red yokes, the deck hung from them
    const m = P.m; P.box(x, 120 * s, 5 * s, 7 * s);
    for (const dx of [-28, 28]) { const xx = x + dx * m * s;
      for (const [a, b, c2, d] of [[xx - 6 * m * s, 6 * s, xx - 3 * m * s, 31 * s], [xx + 6 * m * s, 6 * s, xx + 3 * m * s, 31 * s], [xx - 3.6 * m * s, 30 * s, xx + 3.6 * m * s, 30 * s]]) { P.line(a, b, c2, d, 1.2 * s); litLine(P, a, b, c2, d, 0.8 * s, RED(0.75)); }
      for (let i = 1; i < 6; i++) { P.line(xx, 29 * s, xx - i * 5 * m * s, 6 * s, 0.12); P.line(xx, 29 * s, xx + i * 5 * m * s, 6 * s, 0.12); } }
  }
  function cubesSil(P, x, s) { const m = P.m; for (let i = 0; i < 6; i++) { const cx = x + i * 7.5 * m * s, cy = 10 * s, r = 4.5 * s; P.box(cx, 1.5 * s, -5, cy - r + 0.5); P.poly([[cx, cy - r], [cx + r * m, cy], [cx, cy + r], [cx - r * m, cy]]); if (P.r() < 0.7) P.win(cx, cy - 0.7 * s, 0.85, 1.4 * s, 1.4 * s); } }
  function markthalSil(P, x, s) { const g = P.g; g.beginPath(); g.ellipse(x, Yp(P, -1), 21 * P.m * s, 25 * P.m * s, 0, Math.PI, 0); g.fill(); glow(P, x, 0, 26 * s, 17 * s, 'rgba(255,190,110,0.35)'); }
  const SKY = {
    near(P, K, th) {
      cur = th.key;
      if (cur === 'dyke') { blocks(P, 0.6, 1, 16, 44, 0.32); crane(P, P.X(0.66), 40, 22, -1); for (let i = 0; i < 16; i++) glow(P, P.X(0.08 + i * 0.026), 0.4, 0.8, 0.4, i % 4 ? HOME(0.7) : RED(0.8)); return; }
      blocks(P, 0, 0.38, 14, 36, 0.32); blocks(P, 0.62, 1, 14, 36, 0.32); blocks(P, 0.4, 0.6, 6, 13, 0.25);
      crane(P, P.X(0.31), 44, 24, 1); crane(P, P.X(0.74), 40, 20, -1);
      if (cur === 'square') { cubesSil(P, P.X(0.6), 1); markthalSil(P, P.X(0.4), 1); }
    },
    mid(P, K, th) {
      if (cur === 'dyke') {   // across the Maas, the classic view from the bridge: the swan, De Link, the towers of the Kop van Zuid
        blocks(P, 0.25, 0.8, 8, 20, 0.3);
        maastoren(P, P.X(0.34), 0.75); swan(P, P.X(0.42), 0.9, 1); deLink(P, P.X(0.5), 1); deRotterdam(P, P.X(0.57), 0.75); newOrleans(P, P.X(0.64), 0.78); wpc(P, P.X(0.68), 0.7); montevideo(P, P.X(0.72), 0.78);
        return;
      }
      blocks(P, 0, 1, 18, 40, 0.32);
      millennium(P, P.X(0.49), 0.75); delftsePoort(P, P.X(0.565), 0.72); P.box(P.X(0.64), 14, -5, 40); floors(P, P.X(0.64), 14, 0, 40, 0.4, OFFICE);
      wpc(P, P.X(0.37), 0.65); crane(P, P.X(0.42), 46, 26, 1);
      if (cur === 'street' || cur === 'shops') swan(P, P.X(0.74), 0.7, 0.8);
    },
    far(P, K, th) {
      if (cur === 'dyke') { willemsbrug(P, P.X(0.14), 1); blocks(P, 0.55, 1, 20, 50, 0.25); zalmhaven(P, P.X(0.84), 0.85); euromast(P, P.X(0.94), 0.9); return; }
      blocks(P, 0, 1, 22, 48, 0.28);
      zalmhaven(P, P.X(0.45), 0.78); euromast(P, P.X(0.33), 0.8); P.box(P.X(0.6), 14, -5, 52); floors(P, P.X(0.6), 14, 0, 52, 0.35, HOME, 3, 2);
      for (const f of [0.86, 0.9, 0.94]) { const x = P.X(f); P.box(x, 2, -5, 30); P.line(x - 14 * P.m, 30, x + 22 * P.m, 30, 1.2); glow(P, x, 31, 0.8, 0.8, RED(1)); }
    },
  };
  // ---- the dead in hi-vis, on the shared body ----
  const along = (b, t) => [0, b.hip[1] + (b.sh[1] - b.hip[1]) * t, b.hip[2] + (b.sh[2] - b.hip[2]) * t];
  function helmet(k, b, K, mat) { const [, dy, dz] = b.hd; K.kadd(k, K.KG.dome, mat, 0, dy + 0.06, dz + 0.01, -0.3, 0, 0, 0.32, 0.27, 0.35); K.kadd(k, K.KG.cyl, mat, 0, dy + 0.05, dz - 0.03, -0.3, 0, 0, 0.38, 0.03, 0.42); }
  function bands(k, b, K, ts) { for (const t of ts) K.ktube(k, C.reflect, ...along(b, t), ...along(b, t + 0.07), 0.215); }
  // a docker: orange overalls with silver bands, a white helmet
  function havenwerker(k, b, K) {
    const c = init(K), { ktube } = K;
    ktube(k, c.hivisO, ...along(b, -0.1), ...along(b, 1.02), 0.2);
    for (const s of [-1, 1]) {
      ktube(k, c.hivisO, s * 0.25, b.sh[1], b.sh[2], s * 0.28, 1.16, -0.48, 0.085); ktube(k, c.hivisO, s * 0.28, 1.16, -0.48, s * 0.268, 0.8, -0.58, 0.075);
      ktube(k, c.hivisO, s * 0.11, b.hip[1], b.hip[2], s * 0.121, 0.53, -0.1, 0.105); ktube(k, c.hivisO, s * 0.121, 0.53, -0.1, s * 0.125, 0.14, 0.05, 0.088);
      ktube(k, c.reflect, s * 0.121, 0.4, -0.04, s * 0.123, 0.33, -0.01, 0.095);
    }
    bands(k, b, K, [0.3, 0.55]); helmet(k, b, K, c.helmetW);
  }
  // a builder: a yellow hi-vis vest over a dark jacket, jeans, a yellow helmet
  function bouwvakker(k, b, K) {
    const c = init(K), { ktube } = K;
    ktube(k, c.hivisY, ...along(b, 0.05), ...along(b, 1.0), 0.205);
    for (const s of [-1, 1]) { ktube(k, c.jeans, s * 0.11, b.hip[1], b.hip[2], s * 0.121, 0.53, -0.1, 0.1); ktube(k, c.jeans, s * 0.121, 0.53, -0.1, s * 0.125, 0.14, 0.05, 0.085); }
    bands(k, b, K, [0.32, 0.6]); helmet(k, b, K, c.helmetY);
  }
  // a Feyenoord supporter: red shirt, the red and white scarf round the neck, its ends hanging
  function supporter(k, b, K) {
    const c = init(K), { ktube, kb } = K, [, sy, sz] = b.sh;
    ktube(k, c.feyRed, ...along(b, 0.05), ...along(b, 1.0), 0.2);
    for (const s of [-1, 1]) ktube(k, c.jeans, s * 0.11, b.hip[1], b.hip[2], s * 0.121, 0.53, -0.1, 0.1);
    ktube(k, c.feyWhite, -0.16, sy + 0.04, sz - 0.08, 0.16, sy + 0.04, sz - 0.08, 0.07);
    for (let i = 0; i < 4; i++) kb(k, i % 2 ? c.feyRed : c.feyWhite, 0.08, sy - 0.12 - i * 0.12, sz - 0.2 + i * 0.03, 0.13, 0.12, 0.05);
  }
  function tree(K) { const t = K.treeCard([1, 0, 1]); t.scale.setScalar(K.rnd(1.05, 1.3)); return t; }
  const post = K => K.fingerpost(T.rotterdam.signs.slice().sort(() => Math.random() - 0.5).slice(0, 3));
  const street = (K, extra, front, o) => [   // what lines a Rotterdam street: red lanes, rebuilt blocks over shops, high rise behind
    { make: K => lanes(K, o.brand), n: 10, gap: 30, side: 'right', reg: true, xr: [0.01, 0.01], r: 0.1 },
    ...extra,
    { make: K => block(K, front), n: o.rightN || 8, gap: o.rightGap || 33, side: 'right', reg: !o.rightGap, xr: [10.5, 11], r: 17 },
    { make: K => block(K, front), n: 8, gap: 33, side: 'left', reg: true, xr: [10.5, 11], r: 17 },
    { make: K => tower(K, o.tower), n: 6, gap: 46, side: 'alt', xr: [30, 36], r: 12 },
    { make: ledLamp, n: 10, gap: 16, side: 'alt', reg: true, xr: [4.7, 4.7] },
    { make: tree, n: 12, gap: 14, side: 'both', xr: [8.4, 8.8], r: 0.9 },
    { make: K.bikeRow, n: 4, gap: 40, side: 'both', xr: [7.5, 7.6], r: 0.6 }, { make: K.bins, n: 3, gap: 50, side: 'both', xr: [7.6, 7.7], r: 0.5 },
    { make: K.bench, n: 2, gap: 80, side: 'both', xr: [7.6, 7.6], r: 0.9 }, { make: post, n: 1, gap: 150, side: 'right', xr: [4.6, 4.6], r: 0.5 },
    { make: 'zombieWalk', n: 8, gap: 18, side: 'both', xr: [4.8, 5.4], r: 0.6 } ];
  T.rotterdam = {
    style: { brick: [0x5c4c40, 0x6e5a44, 0x4e4844], gables: 0, height: [12, 18], width: [7, 10], lamp: 'modern' },
    light: { lamp: 0xdfe8ff, windows: 0xffd2a0 },
    road: { kind: 'asphalt', tone: '#2f333b' },
    // a city lit white from below, few stars; the port's orange glow low on one side
    sky: { stars: 30, clouds: 1, glows: [{ az: 5, el: 4, w: 210, h: 16, color: 0xffd6b0, a: 0.13 }, { az: -45, el: 1.2, w: 110, h: 7, color: 0xffa050, a: 0.32 }] },
    lamp: K => ledLamp(K),
    extra: [],
    skyline: SKY,
    shops: ['DE MARKTHAL', 'KAPSALON', 'SUPERMARKT', 'FRIET', 'KAPPER', 'WATERTAXI', 'CAFÉ', 'FIETSENMAKER'],
    signs: ['Erasmusbrug', 'Markthal', 'Kop van Zuid', 'Centraal', 'Euromast', 'Blaak'],
    dead: {
      get pool() { return cur === 'dyke' ? ['rdHavenwerker', 'rdHavenwerker', 'rdHavenwerker', 'rdBouwvakker', 'rdSupporter', 'plain', 'crawler'] : ['rdBouwvakker', 'rdBouwvakker', 'rdHavenwerker', 'rdHavenwerker', 'rdSupporter', 'plain', 'phone', 'crawler']; },
      dress: { rdHavenwerker: havenwerker, rdBouwvakker: bouwvakker, rdSupporter: supporter },
    },
    themes: {
      // a rebuilt boulevard: flat roofed blocks over shops, high rise behind, red lanes and the Brandgrens's flames in the pavement
      street: (base, K) => Object.assign({}, base, { fog: 0x4a5461, fogD: 0.0145, curv: 0, ground: 0x2a2c32, landmark: false, spawn: street(K, [], {}, { brand: true }) }),
      // the Lijnbaan: low shop pavilions under long canopies, slabs of flats behind them, the Markthal's arch
      shops: (base, K) => Object.assign({}, base, { fog: 0x4c5562, fogD: 0.015, curv: 0, ground: 0x2a2c32, landmark: false,
        spawn: street(K, [{ make: markthal, n: 1, gap: 260, side: 'right', xr: [10.5, 10.5], r: 23 }], { floors: 1 }, { tower: { low: true }, rightN: 6, rightGap: 42 }) }),
      // Blaak and the Binnenrotte: the cube houses, the Markthal, the Witte Huis between the blocks, the towers over them
      square: (base, K) => Object.assign({}, base, { fog: 0x4a5462, fogD: 0.0145, curv: 0, ground: 0x2a2c32, landmark: false,
        spawn: street(K, [{ make: markthal, n: 1, gap: 240, side: 'right', xr: [10.5, 10.5], r: 23 }, { make: cubes, n: 1, gap: 240, side: 'right', xr: [11, 12], r: 15 },
          { make: witteHuis, n: 1, gap: 240, side: 'right', xr: [11, 11.5], r: 11 }], {}, { brand: true, rightN: 5, rightGap: 48 }) }),
      // De haven: along the wide black Maas on the red bike path, ships' lights on the water, the Erasmusbrug over the road
      dyke: (base, K) => Object.assign({}, base, {
        fog: 0x48525e, fogD: 0.0128, night: 0.16, open: true, curv: 0, canal: -1, water: 0x10161e, waterY: -0.75, waterK: 0.15, ground: 0x0a0f14, groundY: -1.2, verge: 'tiles', landmark: false,
        road: { kind: 'asphalt', tone: '#5a2f2b' },
        spawn: [
          { make: quay, n: 3, gap: 100, side: 'left', reg: true, xr: [0.01, 0.01], r: 0.1 },
          { make: erasmusbrug, n: 2, gap: 160, side: 'left', xr: [0.01, 0.01], r: 0.1 },
          { make: ship, n: 3, gap: 100, side: 'left', xr: [20, 32], r: 0.5 },
          { make: K => tower(K), n: 6, gap: 45, side: 'right', reg: true, xr: [14, 15], r: 12 },
          { make: K => block(K, { shops: false }), n: 4, gap: 70, side: 'right', xr: [14, 15], r: 16 },
          { make: ledLamp, n: 10, gap: 16, side: 'alt', reg: true, xr: [4.7, 4.7] },
          { make: tree, n: 8, gap: 25, side: 'right', xr: [9, 11], r: 0.9 },
          { make: K.bench, n: 3, gap: 60, side: 'left', xr: [5.4, 5.4], r: 0.9 }, { make: post, n: 1, gap: 180, side: 'right', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 6, gap: 30, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] }),
    },
  };
})();
