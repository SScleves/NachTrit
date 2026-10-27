// Den Haag and Scheveningen: government by the sea.
// The street levels ride the dead straight Scheveningseweg: the tram on its grass bed under the wires beside the woods, red and beige
// trams at the stop and passing, stately villas behind front gardens, the Peace Palace and the government towers of Centraal on the
// horizon. The shops level puts shops in the villas' ground floors. The square levels run along the Hofvijver: the Ridderzaal between
// its two turrets across the water and mirrored in it, the Binnenhof and the Torentje, the fountain, the flag island, the towers behind.
// The dyke level is the boulevard of Scheveningen: beach and surf, the Pier with its lit wheel, the Kurhaus, the red lighthouse with
// its two flashes every ten seconds, dunes and a light blue footbridge. A bright city sky with the orange glow of the Westland
// greenhouses low in the south. The dead: civil servants with briefcases, Scheveningen women in black skirts, striped aprons and
// pastel shawls.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  const C = {};          // materials, textures and template geometry, made once on first use and kept
  let cur = 'street';    // the theme being built: its skyline is painted before its spawns, so the painter notes it here
  const YAW = -Math.PI / 2, HALF = Math.PI / 2;   // YAW turns a quad to face minus x, the street

  function tex(K, w, h, draw, colour) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new K.THREE.CanvasTexture(c); if (colour) { t.colorSpace = K.THREE.SRGBColorSpace; t.wrapS = t.wrapT = K.THREE.RepeatWrapping; } return t;
  }
  function init(K) {
    if (C.ok) return C;
    const { THREE, Mat, GlowMat, glowTex } = K, keep = m => { m.userData.shared = true; return m; };
    C.walls = [0x5a3a32, 0x684538, 0x76685a, 0x4c3a36, 0x5e4a3e].map(c => K.brickMat(c));
    C.stone = K.brickMat(0x8a8274);
    C.plaster = keep(Mat({ color: 0x8c877c }));
    C.trim = keep(Mat({ color: 0xbab4a6 }));
    C.grass = keep(Mat({ color: 0x17221a }));
    C.sand = keep(Mat({ color: 0x6a6252 }));
    C.land = keep(Mat({ color: 0x24252b }));
    C.red = keep(Mat({ color: 0x8e2420 }));
    C.beige = keep(Mat({ color: 0xc4ad84 }));
    C.blue = keep(Mat({ color: 0x8aaec4 }));
    C.corten = keep(Mat({ color: 0x5c2e1a }, 0x7a5a64));
    C.copper = keep(Mat({ color: 0x3c564e }));
    C.awning = keep(Mat({ color: 0x2c3b33 }));
    C.lit = keep(new THREE.MeshBasicMaterial({ color: 0xffd9a6 }));
    C.amber = keep(new THREE.MeshBasicMaterial({ color: 0xffb860 }));
    C.ad = keep(new THREE.MeshBasicMaterial({ color: 0xdde8f2 }));
    C.glass = keep(new THREE.MeshBasicMaterial({ color: 0x1e2731 }));
    C.bulb = keep(GlowMat(glowTex, 0xfff0d2, 0.95, false, { side: THREE.DoubleSide }));
    C.redLamp = keep(GlowMat(glowTex, 0xff4030, 0.9, false, { side: THREE.DoubleSide }));
    C.flash = keep(GlowMat(glowTex, 0xfff6e0, 1, false, { side: THREE.DoubleSide }));
    C.halo = keep(GlowMat(glowTex, 0xfff0d8, 0.9, true));
    C.beam = keep(GlowMat(tex(K, 128, 32, (g, w, h) => {   // a lighthouse beam: bright at the lamp, gone at the far end, soft at the edges
      for (let x = 0; x < w; x++) { const a = Math.pow(1 - x / w, 1.6); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x, 0, 1, h); }
    }), 0xfff2d6, 0.5, false, { side: THREE.DoubleSide }));
    C.spray = keep(GlowMat(tex(K, 64, 128, (g, w, h) => {   // the fountain's plume: a narrow bright jet that spreads and fades as it falls
      for (let y = 0; y < h; y++) { const t = y / h, hw = (0.08 + 0.4 * Math.pow(t, 0.8)) * w, a = 0.25 + 0.75 * t; const gr = g.createLinearGradient(w / 2 - hw, 0, w / 2 + hw, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, y, w, 1); }
    }), 0xe2ecf8, 0.75, false, { side: THREE.DoubleSide }));
    C.foam = keep(GlowMat(tex(K, 32, 512, (g, w, h) => {   // a line of surf: broken white along its length, soft across
      let on = 0; for (let y = 0; y < h; y += 2) { if (Math.random() < 0.06) on = Math.random() < 0.7 ? Math.random() * 0.9 + 0.1 : 0; const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${on})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, y, w, 2); }
    }), 0xd6e2ea, 0.7, false));
    C.flagR = keep(new THREE.MeshBasicMaterial({ color: 0x9a2624, side: THREE.DoubleSide }));
    C.flagW = keep(new THREE.MeshBasicMaterial({ color: 0xc8c4b8, side: THREE.DoubleSide }));
    C.flagB = keep(new THREE.MeshBasicMaterial({ color: 0x2a4280, side: THREE.DoubleSide }));
    C.dest = keep(new THREE.MeshBasicMaterial({ map: K.labelTexture('1 Scheveningen', { bg: '#120e0a', fg: '#ffa834' }) }));
    // the dead
    C.suit = keep(Mat({ color: 0x1a2030 })); C.shirt = keep(Mat({ color: 0xcfd0ca })); C.leather = keep(Mat({ color: 0x4e2c1a }, 0x7a5a64));
    C.skirt = keep(Mat({ color: 0x0e1014 }));
    C.apron = keep(Mat({ map: tex(K, 32, 32, g => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#d6dae2' : '#34548e'; g.fillRect(i * 4, 0, 4, 32); } }, true) }));
    C.shawls = [0xcc9cac, 0x98b8cc].map(c => keep(Mat({ color: c })));
    // template geometry, copied into kits and never drawn itself
    C.cone8 = new THREE.ConeGeometry(0.5, 1, 8); C.cyl12 = new THREE.CylinderGeometry(0.4, 0.5, 1, 12); C.skirtGeo = new THREE.CylinderGeometry(0.2, 0.46, 1, 12);
    const trap = (bw, tw, h) => { const s = new THREE.Shape(); s.moveTo(-bw / 2, 0); s.lineTo(bw / 2, 0); s.lineTo(tw / 2, h); s.lineTo(-tw / 2, h); s.closePath(); return new THREE.ShapeGeometry(s); };
    C.mansardEnd = trap(10.5, 7.5, 3.1); C.hofEnd = trap(11.6, 4.0, 6.0);
    const tri = new THREE.Shape(); tri.moveTo(-8, 0); tri.lineTo(8, 0); tri.lineTo(0, 12); tri.closePath(); C.gable = new THREE.ShapeGeometry(tri);
    const lan = new THREE.Shape(); lan.moveTo(-2, 0); lan.lineTo(2, 0); lan.lineTo(2, 6); lan.quadraticCurveTo(2, 9, 0, 10.5); lan.quadraticCurveTo(-2, 9, -2, 6); lan.closePath(); C.lancet = new THREE.ShapeGeometry(lan);
    // the window glow of every house in the game, taken from one probe house so it dims and tints with the rest of the town
    const probe = K.house({ lit: 1, plain: true, gable: 'roof' });
    probe.traverse(m => { if (m.isMesh && !C.glow && m.material && m.material.blending === THREE.AdditiveBlending) C.glow = m.material; if (m.isMesh && m.geometry && m.geometry.userData.kit) m.geometry.dispose(); });
    C.glow = C.glow || keep(GlowMat(glowTex, 0xffb466, 0.55)); C.mirror = keep(GlowMat(C.glow.map, 0xffb466, 0.95));   // windows mirrored in the pond
    C.ok = true; return C;
  }

  // one window of the game's atlas on a front facing minus x; a lit one gets its glow on the wall, a lintel when asked
  function win(K, k, x, y, z, w, h, litP, lintel) {
    const lit = Math.random() < litP, cell = lit ? K.pick([0, 0, 1, 1, 2]) : K.pick([3, 4, 4, 5]);
    K.kadd(k, K.PG['win' + cell], K.PM.winAtlas, x - 0.012, y, z, 0, YAW, 0, w, h);
    if (lit) K.kadd(k, K.PG.winGlow, C.glow, x - 0.07, y, z, 0, YAW, 0, w * 2.4, h * 1.45);
    if (lintel) K.kb(k, C.trim, x - 0.06, y + h / 2 + 0.12, z, 0.12, 0.2, w + 0.3);
    return lit;
  }

  // a pair or a row of Hague herenhuizen under one cornice: three storeys over a raised ground floor, a bay window with a balcony on
  // each, white stucco bands and lintels on dark brick, a mansard roof with dormers and tall chimneys, steps up to the door, and in
  // front a garden behind a low wall with railings or a hedge. The street front is local x 0; the house runs back to plus x.
  // o.n houses; o.garden false: no garden; o.shop: shops in the ground floor; o.plain: the far row, windows and roofs only
  function villa(K, o = {}) {
    const c = init(K), k = K.kit(), { kb, kadd, rnd, pick, PM, PG, KG } = K;
    const n = o.n || (Math.random() < 0.55 ? 2 : 3), W = 7, L = n * W, D = 11, H = rnd(10.4, 11.4) + (o.plain ? 1.6 : 0);
    const wall = o.wall || (Math.random() < 0.2 ? c.plaster : pick(c.walls)), litP = o.lit != null ? o.lit : 0.42, full = !o.plain;
    kb(k, wall, D / 2, H / 2, 0, D, H, L);
    kb(k, c.trim, -0.06, 0.5, 0, 0.14, 1.0, L);
    if (full) for (const y of [4.25, 7.45]) kb(k, c.trim, -0.07, y, 0, 0.16, 0.18, L);
    kb(k, c.trim, -0.32, H - 0.12, 0, 0.66, 0.3, L + 0.5); kb(k, c.trim, -0.16, H - 0.42, 0, 0.32, 0.22, L + 0.3);
    // the mansard: steep slates front and back, a flat top, closed at the ends
    const rh = 3.1, rs = 1.5, sl = Math.hypot(rh, rs), a = Math.atan2(rs, rh);
    kb(k, PM.roof, 0.25 + rs / 2, H + rh / 2, 0, 0.16, sl, L + 0.1, 0, 0, -a); kb(k, PM.roof, D - 0.25 - rs / 2, H + rh / 2, 0, 0.16, sl, L + 0.1, 0, 0, a);
    kb(k, PM.roof, D / 2, H + rh, 0, D - 0.5 - 2 * rs, 0.14, L + 0.1);
    kadd(k, c.mansardEnd, PM.roof, D / 2, H, L / 2 + 0.05); kadd(k, c.mansardEnd, PM.roof, D / 2, H, -L / 2 - 0.05, 0, Math.PI, 0);
    for (let i = 0; i < n; i++) {
      const zc = -L / 2 + W / 2 + i * W, flip = i % 2 ? -1 : 1, zd = zc + flip * 2.2, zb = zc - flip * 1.0;
      if (Math.random() < 0.8) { const cz = zc + rnd(-2.5, 2.5), cx = rnd(3, D - 3); kb(k, wall, cx, H + rh + 0.8, cz, 0.7, 2.2, 1.0); kb(k, c.trim, cx, H + rh + 1.95, cz, 0.9, 0.14, 1.2); }
      // a dormer in the slates
      kb(k, c.trim, 0.95, H + 1.4, zb, 1.0, 1.6, 1.4); win(K, k, 0.44, H + 1.35, zb, 0.8, 1.1, litP * 0.6); kb(k, PM.roof, 0.95, H + 2.28, zb, 1.2, 0.12, 1.6);
      if (o.shop) {   // a shopfront: the lit interior, its glow and its streak on the pavement, the sign and an awning over it
        const ki = Math.random() < 0.5 ? 1 : 0, sz = zc - flip * 0.6;
        kadd(k, PG['shop' + ki], PM.winAtlas, -0.03, 1.75, sz, 0, YAW, 0, 4.4, 2.5);
        kadd(k, PG.winGlow, c.glow, -0.09, 1.9, sz, 0, YAW, 0, 7, 4.6); kadd(k, PG.winStreak, c.glow, -1.0, 0.09, sz, -HALF, 0, 0, 2.6, 4.6);
        for (const dz of [-2.25, 2.25]) kb(k, PM.pole, -0.05, 1.6, sz + dz, 0.1, 3.2, 0.14);
        kb(k, PM.pole, -0.05, 3.2, sz, 0.12, 0.14, 4.7); kb(k, c.awning, -0.75, 3.0, sz, 1.5, 0.08, 4.8, 0, 0, 0.35);
        kadd(k, KG.plane, PM.pole, -0.02, 1.45, zd, 0, YAW, 0, 1.1, 2.6);
        const t = K.labelTexture(pick(T.denhaag.shops), { bg: '#1b1d21', fg: '#d8d0bc' });
        const sg = new K.THREE.Mesh(new K.THREE.PlaneGeometry(3.6, 0.8), K.Mat({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.45 }));
        sg.position.set(-0.08, 3.75, sz); sg.rotation.y = YAW; sg.userData.ownTex = true; o.g = o.g || new K.THREE.Group(); o.g.add(sg);
      } else if (full) {
        // the bay window over two floors with a balcony on it, the door up its steps with a fanlight
        kb(k, c.trim, -0.45, 4.1, zb, 0.9, 6.2, 2.9); kb(k, c.trim, -0.47, 7.27, zb, 1.0, 0.12, 3.0);
        for (const y of [2.6, 5.85]) for (const dz of [-0.68, 0.68]) win(K, k, -0.9, y, zb + dz, 1.0, 1.9, litP);
        for (let b = -1.4; b <= 1.41; b += 0.2) kb(k, PM.pole, -0.85, 7.75, zb + b, 0.03, 0.9, 0.03);
        kb(k, PM.pole, -0.85, 8.2, zb, 0.05, 0.05, 2.9);
        kadd(k, KG.plane, PM.pole, -0.02, 2.25, zd, 0, YAW, 0, 1.15, 2.45); kadd(k, PG.fan0, PM.winAtlas, -0.02, 3.72, zd, 0, YAW, 0, 1.15, 0.45);
        for (const dz of [-0.72, 0.72]) kb(k, c.trim, -0.06, 2.35, zd + dz, 0.12, 2.9, 0.24); kb(k, c.trim, -0.07, 4.05, zd, 0.14, 0.26, 1.7);
        for (let s = 0; s < 4; s++) kb(k, c.trim, -(1.25 - s * 0.3) / 2, (s + 1) * 0.125, zd, 1.25 - s * 0.3, (s + 1) * 0.25, 1.5);
        if (Math.random() < 0.5) kadd(k, KG.ball, c.lit, -0.12, 2.9, zd + flip * 0.95, 0, 0, 0, 0.16, 0.2, 0.16);
      }
      if (full && !o.shop) win(K, k, 0, 5.85, zd, 0.95, 1.8, litP, true);
      else if (full) for (const dz of [-1.6, 1.6]) win(K, k, 0, 5.85, zc + dz, 0.95, 1.8, litP, true);
      if (full) { win(K, k, 0, 9.0, zd, 0.9, 1.7, litP, true); for (const dz of [-0.6, 0.6]) win(K, k, 0, 9.0, zb + dz, 0.85, 1.7, litP); }
      else for (const dz of [-2.3, 0, 2.3]) for (const y of [2.6, 5.85, 9.0, 12.2]) if (y < H - 1.2) win(K, k, 0, y, zc + dz, 0.9, 1.7, litP);
      // the front garden: a low wall with railings or a hedge, a pale path to the steps, shrubs
      if (full && !o.shop && o.garden !== false) {
        const hedge = Math.random() < 0.4;
        for (const [z0, z1] of [[zc - W / 2 + 0.1, zd - 0.8], [zd + 0.8, zc + W / 2 - 0.1]]) {
          const zl = z1 - z0, zm = (z0 + z1) / 2; if (zl < 0.3) continue;
          if (hedge) kb(k, PM.leaf, -3.0, 0.55, zm, 0.6, 1.1, zl);
          else { kb(k, c.trim, -3.0, 0.22, zm, 0.32, 0.44, zl); kb(k, PM.pole, -3.0, 1.12, zm, 0.05, 0.05, zl); for (let z = z0 + 0.15; z < z1; z += 0.3) kb(k, PM.pole, -3.0, 0.78, z, 0.035, 0.7, 0.035); }
        }
        kb(k, c.trim, -2.1, 0.02, zd, 1.9, 0.04, 1.3);
        for (let s = 0; s < 2; s++) { const sz = zb + rnd(-1.6, 1.6); kadd(k, KG.ball, PM.leaf, rnd(-2.4, -1.4), 0.45, sz, 0, 0, 0, rnd(0.9, 1.5), rnd(0.8, 1.3), rnd(0.9, 1.5)); }
      }
    }
    const g = K.kbuild(k, o.g); g.userData.faceRoad = true; return g;
  }
  // thirty metres of the tram's own track beside the road: grass between the rails (it has grown there since 1973), a kerb on the
  // pavement side, a mast between the two tracks holding the wires. It lies behind its anchor, so a row of them joins up as they recycle
  const TRACK = 12.2, TRACKS = [-1.6, 1.6];   // the bed's middle, the two tracks either side of it
  function track(K) {
    const c = init(K), k = K.kit(), L = 30, { kb, PM } = K;
    kb(k, c.grass, 0.45, 0.03, L / 2, 8.1, 0.06, L); kb(k, c.trim, 4.4, 0.1, L / 2, 0.2, 0.2, L);
    for (const tx of TRACKS) for (const rx of [-0.72, 0.72]) kb(k, c.trim, tx + rx, 0.1, L / 2, 0.08, 0.1, L);
    kb(k, PM.pole, 0, 3.3, 0.6, 0.22, 6.6, 0.22); kb(k, PM.pole, 0, 6.15, 0.6, 4.2, 0.1, 0.1);
    for (const tx of TRACKS) { kb(k, PM.pole, tx, 5.75, L / 2, 0.03, 0.03, L); kb(k, PM.pole, tx, 5.95, 0.6, 0.03, 0.4, 0.03); }
    return K.kbuild(k);
  }
  // a Hague tram along local z: two red cars with beige bands on three bogies, lit inside, its pantograph up to the wire.
  // moving: it runs toward the rider on its own (the game moves scenery only with the road, so the tram moves itself as it is drawn)
  function tram(K, moving) {
    const c = init(K), k = K.kit(), { kb, kadd, ktube, PM, KG } = K, W = 2.5;
    for (const [z0, z1] of [[-14, -0.35], [0.35, 14]]) {
      const zl = z1 - z0, zc = (z0 + z1) / 2;
      kb(k, c.red, 0, 1.95, zc, W, 2.9, zl); kb(k, c.beige, 0, 1.05, zc, W + 0.03, 0.42, zl); kb(k, c.beige, 0, 3.12, zc, W + 0.03, 0.16, zl);
      for (const s of [-1, 1]) kb(k, c.lit, s * (W / 2 + 0.012), 2.2, zc, 0.01, 1.05, zl - 1.0);
      for (let z = z0 + 1.2; z < z1 - 1; z += 1.7) for (const s of [-1, 1]) kb(k, PM.pole, s * (W / 2 + 0.02), 2.2, z, 0.02, 1.07, 0.14);
      kb(k, PM.pole, 0, 3.48, zc, W - 0.4, 0.16, zl - 0.6);
    }
    kb(k, PM.pole, 0, 1.95, 0, W - 0.3, 2.7, 0.7);
    for (const z of [-11, 0, 11]) kb(k, K.M.dark, 0, 0.32, z, W - 0.5, 0.5, 2.4);
    for (const s of [-1, 1]) {
      const ry = s > 0 ? 0 : Math.PI;
      kb(k, c.glass, 0, 2.35, s * 14.01, W - 0.4, 1.25, 0.02); kadd(k, KG.plane, c.dest, 0, 3.15, s * 14.03, 0, ry, 0, 1.6, 0.34);
      for (const x of [-0.85, 0.85]) kadd(k, KG.plane, s > 0 ? c.flash : c.redLamp, x, 0.95, s * 14.06, 0, ry, 0, 0.8, 0.8);
    }
    ktube(k, PM.pole, 0, 3.56, -6.6, 0, 4.7, -5.6, 0.03); ktube(k, PM.pole, 0, 4.7, -5.6, 0, 5.72, -6.6, 0.03); kb(k, PM.pole, 0, 5.74, -6.6, 1.6, 0.05, 0.08);
    const g = K.kbuild(k);
    if (!moving) return g;
    const o = new K.THREE.Group(); o.add(g); let last = 0;
    const body = g.children.find(m => m.material === c.red) || g.children[0];
    body.onBeforeRender = () => {   // about 30 km/h toward the rider; behind the camera it waits for its anchor to come round again
      const now = performance.now(), dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
      g.position.z += 8.5 * dt; if (g.position.z > 160) g.position.z -= 320;
    };
    return o;
  }
  // a tram stop on its platform between the pavement and the track: a shelter with a lit poster, the stop's red sign, often a tram in
  function tramStop(K) {
    const c = init(K), k = K.kit(), { kb, PM } = K;
    kb(k, c.trim, 0, 0.15, 0, 1.8, 0.3, 22);
    for (const z of [-2.1, 2.1]) for (const x of [-0.75, 0.75]) kb(k, PM.pole, x, 1.55, z, 0.07, 2.5, 0.07);
    kb(k, PM.pole, 0, 2.82, 0, 1.8, 0.08, 4.6); kb(k, c.glass, -0.75, 1.5, 0, 0.03, 2.0, 4.1);
    kb(k, c.ad, 0, 1.45, 2.12, 1.2, 1.8, 0.05); kb(k, PM.pole, -0.45, 0.75, 0, 0.4, 0.06, 3.2);
    kb(k, PM.pole, 0.55, 1.5, -5, 0.07, 3.0, 0.07); kb(k, c.red, 0.55, 2.85, -5, 0.05, 0.5, 0.5); kb(k, c.trim, 0.55, 2.85, -5, 0.06, 0.16, 0.36);
    const g = K.kbuild(k);
    if (Math.random() < 0.6) { const t = tram(K, false); t.position.set(8.6 - TRACK + TRACKS[1], 0, -1); g.add(t); }   // on the near track
    return g;
  }
  // the Hague street lamp: a fluted iron post, a four-paned lantern under a crown, warm white
  function lamp(K) {
    const k = K.kit(), { kb, kadd, PM, PG, KG } = K;
    kadd(k, KG.cyl, PM.pole, 0, 0.35, 0, 0, 0, 0, 0.34, 0.7, 0.34); kadd(k, KG.cyl, PM.pole, 0, 2.6, 0, 0, 0, 0, 0.14, 4.0, 0.14);
    kadd(k, KG.cyl, PM.pole, 0, 4.62, 0, 0, 0, 0, 0.24, 0.12, 0.24); kb(k, PM.pole, 0, 4.72, 0, 0.44, 0.05, 0.44);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) kb(k, PM.pole, sx * 0.19, 5.03, sz * 0.19, 0.03, 0.6, 0.03);
    kb(k, PM.pole, 0, 5.35, 0, 0.5, 0.06, 0.5); kadd(k, PG.lantCap, PM.pole, 0, 5.52, 0, 0, Math.PI / 4, 0); kadd(k, KG.ball, PM.pole, 0, 5.74, 0, 0, 0, 0, 0.12, 0.16, 0.12);
    const g = K.kbuild(k), glass = new K.THREE.Mesh(PG.lantGlass, PM.lampHead); glass.position.set(0, 5.03, 0); glass.scale.set(1.15, 1.1, 1.15); g.add(glass);
    K.lampLights(g, 0, 5.03, 1, 1.15); g.userData.faceRoad = true; return g;
  }
  function bigTree(K, kinds, s) { const t = K.treeCard(kinds || [0, 1, 1]); t.scale.setScalar((s || 1.45) * K.rnd(0.85, 1.15)); return t; }
  // the Binnenhof across the Hofvijver, front to the water at local x 0: a long pale wing with a steep slate roof and dormers, lit
  // windows mirrored on the pond, its quay. kind 'ridderzaal': the Gothic hall's gable between its two turrets, its great window lit
  // and long in the water, low wings either side. kind 'torentje': the little octagonal tower on the corner by the water
  function binnenhof(K, kind) {
    const c = init(K), k = K.kit(), { kb, kadd, rnd, PM, PG, KG } = K, L = 30, R = 11;
    const mirror = (z, y, w) => kadd(k, PG.winStreak, c.mirror, -1 - 0.7 * R, 0.04, z + 0.7 * R, -HALF, 0, 2.36, w || 1.0, R * 2 - 1);   // slanting toward the rider
    kb(k, c.trim, -1.0, -0.3, 0, 2.0, 0.7, L);
    if (kind === 'ridderzaal') {
      const hall = c.walls[1];
      kb(k, hall, 15, 6, 0, 30, 12, 16);
      for (const s of [-1, 1]) kb(k, PM.roof, 15, 18, s * 4, 30.2, 0.3, 14.42, s * 0.983, 0, 0);
      kadd(k, c.gable, hall, -0.02, 12, 0, 0, YAW, 0);
      kadd(k, c.lancet, c.amber, -0.06, 3.6, 0, 0, YAW, 0); kadd(k, PG.winGlow, c.glow, -0.12, 8.6, 0, 0, YAW, 0, 8, 13);
      for (const z of [-0.68, 0.68]) kb(k, PM.pole, -0.09, 8.4, z, 0.04, 9.6, 0.12); kb(k, PM.pole, -0.09, 10.2, 0, 0.04, 0.12, 4);
      kadd(k, KG.disc, c.amber, -0.06, 17.6, 0, 0, YAW, 0, 4.2, 4.2); kadd(k, PG.winGlow, c.glow, -0.12, 17.6, 0, 0, YAW, 0, 5, 5);
      kadd(k, PG.winStreak, c.mirror, -1 - 0.7 * R, 0.04, 0.7 * R, -HALF, 0, 2.36, 3.4, R * 2 - 1);
      for (const s of [-1, 1]) {   // the turrets
        kadd(k, KG.cyl, hall, 0.4, 11.5, s * 8.5, 0, 0, 0, 2.7, 23, 2.7); kadd(k, KG.cyl, c.trim, 0.4, 23.1, s * 8.5, 0, 0, 0, 3.2, 0.35, 3.2);
        kadd(k, c.cone8, PM.roof, 0.4, 26.8, s * 8.5, 0, 0, 0, 3.0, 7.4, 3.0); kadd(k, KG.ball, c.trim, 0.4, 30.6, s * 8.5, 0, 0, 0, 0.3, 0.3, 0.3);
        for (const y of [5, 9.5, 14, 18.5]) kb(k, c.amber, -0.93, y, s * 8.5, 0.02, 1.0, 0.32);
        mirror(s * 8.5, 0, 0.5);
        kb(k, c.stone, 5, 5, s * 12.3, 10, 10, 6.6); kb(k, PM.roof, 5, 10.1, s * 12.3, 10.4, 0.2, 7);
        for (const y of [2.5, 6.2]) for (const dz of [-1.5, 1.5]) if (win(K, k, 0, y, s * 12.3 + dz, 0.95, 1.8, 0.5) && y < 3) mirror(s * 12.3 + dz);
      }
    } else {
      const H = rnd(12, 14), wall = Math.random() < 0.5 ? c.stone : c.walls[2];
      kb(k, wall, 6, H / 2, 0, 12, H, L);
      kb(k, c.trim, -0.2, H - 0.15, 0, 0.4, 0.3, L + 0.3);
      const a = Math.atan2(3.8, 6), sl = Math.hypot(3.8, 6);
      kb(k, PM.roof, 2.1, H + 3, 0, 0.2, sl, L, 0, 0, -a); kb(k, PM.roof, 9.9, H + 3, 0, 0.2, sl, L, 0, 0, a); kb(k, PM.roof, 6, H + 6, 0, 4.4, 0.16, L);
      kadd(k, c.hofEnd, PM.roof, 6, H, L / 2); kadd(k, c.hofEnd, PM.roof, 6, H, -L / 2, 0, Math.PI, 0);
      for (let z = -12.5; z <= 12.6; z += 2.5) for (const y of [2.4, 5.8, 9.2]) if (y < H - 1.5 && win(K, k, 0, y, z, 0.95, 1.9, 0.48, true) && y < 6) mirror(z);
      for (let z = -11; z <= 11.1; z += 5.5) { kb(k, c.trim, 1.75, H + 1.6, z, 1.0, 1.5, 1.3); win(K, k, 1.24, H + 1.55, z, 0.75, 1.0, 0.35); }
      if (kind === 'torentje') {
        const z = L / 2 - 2.6;
        kadd(k, KG.cyl, c.walls[0], -0.6, 7, z, 0, 0, 0, 5.2, 14, 5.2); kadd(k, c.cone8, PM.roof, -0.6, 17.8, z, 0, 0, 0, 5.8, 7.6, 5.8);
        kadd(k, KG.ball, c.trim, -0.6, 21.8, z, 0, 0, 0, 0.35, 0.35, 0.35);
        for (const y of [4, 8, 11.5]) if (win(K, k, -3.0, y, z, 0.9, 1.6, 0.8) && y < 5) mirror(z);
      }
    }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // the fountain in the Hofvijver: a white jet lit from below, the spray falling round it
  function fountain(K) {
    const c = init(K), k = K.kit(), { kadd, KG } = K;
    for (const ry of [0, HALF, HALF / 2, -HALF / 2]) kadd(k, KG.plane, c.spray, 0, 4.2, 0, 0, ry, 0, ry % HALF ? 3.2 : 1.6, ry % HALF ? 3.4 : 8.4);
    kadd(k, KG.plane, c.flash, 0, 0.06, 0, -HALF, 0, 0, 5, 5); kadd(k, KG.plane, c.flash, 0, 1.0, 0, 0, 0, 0, 3, 2.2);
    return K.kbuild(k);
  }
  // the little island in the pond with its flagpole and the flag hanging still, two shrubs and a stone rim
  function flagIsland(K) {
    const c = init(K), k = K.kit(), { kb, kadd, KG, PM } = K;
    kadd(k, KG.cyl, c.trim, 0, -0.08, 0, 0, 0, 0, 7.6, 0.3, 7.6); kadd(k, KG.cyl, c.grass, 0, 0.05, 0, 0, 0, 0, 7.0, 0.2, 7.0);
    for (const [x, z, s] of [[-1.6, 1.4, 1.6], [1.4, -1.2, 1.2], [1.8, 1.6, 0.9]]) kadd(k, KG.ball, PM.leaf, x, s * 0.5, z, 0, 0, 0, s * 1.5, s, s * 1.5);
    kb(k, PM.pole, 0, 4.6, 0, 0.12, 9.2, 0.12); kadd(k, KG.ball, c.trim, 0, 9.25, 0, 0, 0, 0, 0.22, 0.22, 0.22);
    kb(k, c.flagR, 1.2, 8.75, 0, 2.3, 0.5, 0.02); kb(k, c.flagW, 1.2, 8.25, 0, 2.3, 0.5, 0.02); kb(k, c.flagB, 1.2, 7.75, 0, 2.3, 0.5, 0.02);
    kadd(k, KG.plane, c.flash, 0.4, 0.4, 0.5, 0, 0, 0, 1.2, 1.2);
    return K.kbuild(k);
  }
  // ---- Scheveningen ----
  // a hundred metres of beach below the boulevard on the sea side: the sea wall, the sand, the surf in lines on the black water
  function beach(K) {
    const c = init(K), k = K.kit(), L = 100, { kb, kadd, KG } = K;
    kb(k, c.trim, -7.75, -0.35, L / 2, 0.12, 0.8, L); kb(k, c.sand, -12.3, -0.66, L / 2, 9.2, 0.1, L);
    for (const [x, w] of [[-17.2, 2.2], [-18.6, 1.2], [-21, 1.6], [-24.5, 1.4], [-29, 1.1], [-36, 1.0]]) kadd(k, KG.plane, c.foam, x, -0.68, L / 2 + K.rnd(-8, 8), -HALF, 0, 0, w, L * K.rnd(0.8, 1));
    return K.kbuild(k);
  }
  // the boulevard's land on the town side, level with the road, under the hotels and the dunes
  function land(K) { const k = K.kit(); K.kb(k, init(K).land, 62, -0.04, 50, 108, 0.06, 100); return K.kbuild(k); }
  // the Pier: a long covered promenade on concrete legs out over the beach and the sea, lit along its sides, and on its island the
  // big wheel, its rim and spokes outlined in bulbs, turning slowly. Built for the sea side, from the boulevard out to minus x
  function pier(K) {
    const c = init(K), k = K.kit(), { kb, kadd, ktube, KG, PM, THREE } = K;
    const x0 = -8, x1 = -150, xl = x0 - x1, xm = (x0 + x1) / 2, dy = 7.5;
    kb(k, c.trim, xm, dy, 0, xl, 0.5, 9); kb(k, c.trim, xm, dy + 3.4, 0, xl, 0.3, 9.4);
    for (const s of [-1, 1]) { kb(k, c.lit, xm, dy + 1.7, s * 4.52, xl - 2, 1.4, 0.02); kb(k, PM.pole, xm, dy + 3.9, s * 4.6, xl, 0.05, 0.05); }
    for (let x = x0 - 3; x > x1; x -= 4.5) { for (const s of [-1, 1]) kb(k, PM.pole, x, dy + 1.7, s * 4.55, 0.25, 3.0, 0.08); kadd(k, KG.plane, c.bulb, x, dy + 4.3, 4.7, 0, 0, 0, 0.9, 0.9); }
    for (let x = x0 - 6; x > x1; x -= 12) for (const s of [-1, 1]) kb(k, c.trim, x, (dy - 1.2) / 2 - 0.2, s * 3.2, 0.9, dy + 0.4, 0.9);
    const wx = -30, hub = 20, R = 14;
    for (const s of [-1, 1]) { ktube(k, PM.pole, wx - 9, dy + 3.6, s * 2.6, wx, hub, s * 1.4, 0.35); ktube(k, PM.pole, wx + 9, dy + 3.6, s * 2.6, wx, hub, s * 1.4, 0.35); }
    kb(k, c.trim, wx, dy + 1.6, 0, 26, 3.6, 16);
    for (let x = wx - 12; x < wx + 12; x += 2.4) kb(k, c.lit, x, dy + 1.8, 8.02, 1.4, 1.6, 0.02);
    const g = K.kbuild(k);
    const kw = K.kit(), torus = new THREE.TorusGeometry(R, 0.22, 4, 40);
    for (const z of [-1.2, 1.2]) kadd(kw, torus, PM.pole, 0, 0, z); torus.dispose();
    for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, x = Math.cos(a) * R, y = Math.sin(a) * R; for (const z of [-1.2, 1.2]) ktube(kw, PM.pole, 0, 0, z * 0.4, x, y, z, 0.06);
      kb(kw, c.lit, x, y - 1.0, 0, 1.2, 1.4, 1.6); for (let j = 1; j < 5; j++) kadd(kw, KG.plane, c.bulb, x * j / 5, y * j / 5, 1.35, 0, 0, 0, 0.55, 0.55); }
    for (let i = 0; i < 48; i++) { const a = i * Math.PI / 24; kadd(kw, KG.plane, c.bulb, Math.cos(a) * R, Math.sin(a) * R, 1.4, 0, 0, 0, 0.8, 0.8); }
    kadd(kw, KG.cyl, PM.pole, 0, 0, 0, HALF, 0, 0, 1.4, 3.2, 1.4);
    const wheel = K.kbuild(kw); wheel.position.set(wx, hub, 0); g.add(wheel);
    g.userData.blades = wheel; g.userData.spin = 0.07;
    return g;
  }
  // the Kurhaus (1887): a long pale front with rows of tall lit windows, its great dome on a drum in the middle, a domed tower
  // at each end and the glazed terrace along the ground floor
  function kurhaus(K) {
    const c = init(K), k = K.kit(), { kb, kadd, KG, PM } = K, L = 64, D = 18, H = 15;
    kb(k, c.plaster, D / 2, H / 2, 0, D, H, L); kb(k, c.trim, -0.25, H - 0.2, 0, 0.5, 0.4, L + 0.4); kb(k, c.trim, -0.15, 4.4, 0, 0.3, 0.2, L);
    kb(k, PM.roof, D / 2, H + 0.6, 0, D - 2, 1.2, L - 2);
    for (let z = -L / 2 + 2.5; z < L / 2 - 2; z += 2.6) for (const y of [6.2, 9.6, 12.8]) win(K, k, 0, y, z, 1.0, 2.0, 0.5, true);
    kb(k, c.lit, -1.6, 1.6, 0, 0.04, 2.4, L - 10); kb(k, PM.pole, -1.6, 3.0, 0, 3.2, 0.12, L - 9);
    for (let z = -L / 2 + 5; z < L / 2 - 4; z += 2.2) kb(k, PM.pole, -1.62, 1.6, z, 0.06, 2.5, 0.08);
    kadd(k, K.PG.winGlow, c.glow, -1.7, 1.8, 0, 0, YAW, 0, L - 6, 5);
    kadd(k, KG.cyl, c.plaster, D / 2 - 2, H + 3, 0, 0, 0, 0, 13, 6, 13); kadd(k, KG.dome, c.copper, D / 2 - 2, H + 5.9, 0, 0, 0, 0, 14, 16, 14);
    kadd(k, KG.cyl, c.trim, D / 2 - 2, H + 14.4, 0, 0, 0, 0, 1.8, 2.4, 1.8); kadd(k, c.cone8, c.copper, D / 2 - 2, H + 16.4, 0, 0, 0, 0, 1.6, 1.8, 1.6);
    for (const y of [H + 1.6, H + 4.2]) for (const dz of [-2.6, 0, 2.6]) win(K, k, 0.3, y, dz, 0.9, 1.6, 0.7);
    for (const s of [-1, 1]) { kb(k, c.plaster, 4, H + 2.5, s * (L / 2 - 3), 8, 5, 6); kadd(k, KG.dome, c.copper, 4, H + 5, s * (L / 2 - 3), 0, 0, 0, 7, 7, 7); win(K, k, 0, H + 2.4, s * (L / 2 - 3), 0.9, 1.8, 0.8); }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // the lighthouse of Scheveningen: red cast iron, twelve sided, a gallery and the lantern, and the beam turning once in ten seconds
  // with two arms close together, so each turn throws two flashes
  function lighthouse(K) {
    const c = init(K), k = K.kit(), { kb, kadd, KG, PM, THREE } = K, H = 24;
    kadd(k, c.cyl12, c.red, 0, H / 2, 0, 0, 0, 0, 4.2, H, 4.2); kadd(k, KG.cyl, c.trim, 0, 0.5, 0, 0, 0, 0, 6, 1.0, 6);
    for (const y of [6, 12, 18]) kb(k, c.lit, -2.12 + 0.42 * y / H, y, 0, 0.04, 1.0, 0.45);
    kadd(k, KG.cyl, PM.pole, 0, H + 0.15, 0, 0, 0, 0, 4.6, 0.3, 4.6); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; kb(k, PM.pole, Math.cos(a) * 2.25, H + 0.7, Math.sin(a) * 2.25, 0.05, 0.9, 0.05); }
    kadd(k, c.cyl12, c.lit, 0, H + 1.4, 0, 0, 0, 0, 2.6, 2.2, 2.6); kadd(k, c.cone8, c.red, 0, H + 3.2, 0, 0, 0, 0, 3.0, 1.6, 3.0); kadd(k, KG.ball, PM.pole, 0, H + 4.1, 0, 0, 0, 0, 0.4, 0.5, 0.4);
    const g = K.kbuild(k);
    const halo = new THREE.Sprite(c.halo); halo.scale.set(9, 9, 1); halo.position.set(0, H + 1.4, 0); g.add(halo);
    const kb2 = K.kit();
    for (const a of [0, 0.42]) { kb2.base.makeRotationZ(a); kadd(kb2, KG.plane, c.beam, 32, 0, 0, HALF, 0, 0, 64, 3.2); kadd(kb2, KG.plane, c.flash, 1.6, 0, 0, 0, HALF, 0, 7, 7); }
    const beams = K.kbuild(kb2), up = new THREE.Group(); up.rotation.x = -HALF; up.position.set(0, H + 1.4, 0); up.add(beams); g.add(up);
    g.userData.blades = beams; g.userData.spin = Math.PI / 5;
    return g;
  }
  // a boulevard block: flats and a hotel over glazed cafés, balconies in long white bands, a flat roof
  function hotel(K) {
    const c = init(K), k = K.kit(), { kb, rnd, PM } = K, L = rnd(22, 34), D = 14, H = rnd(13, 19), wall = Math.random() < 0.5 ? c.plaster : K.pick(c.walls);
    kb(k, wall, D / 2, H / 2, 0, D, H, L); kb(k, PM.roof, D / 2, H + 0.4, 0, D + 0.3, 0.8, L + 0.3);
    for (let z = -L / 2 + 3; z < L / 2 - 2.5; z += 4.6) K.kadd(k, K.PG['shop' + (Math.random() < 0.6 ? 1 : 0)], PM.winAtlas, -0.03, 1.6, z, 0, YAW, 0, 4.2, 2.3); kb(k, PM.pole, -1.5, 3.25, 0, 3.0, 0.15, L - 1);
    K.kadd(k, K.PG.winGlow, c.glow, -0.1, 1.9, 0, 0, YAW, 0, L - 2, 5); for (let z = -L / 2 + 4; z < L / 2 - 3; z += 6) K.kadd(k, K.PG.winStreak, c.glow, -1.2, 0.09, z, -HALF, 0, 0, 2.0, 4.5);
    for (let y = 4.8; y < H - 1.5; y += 3.1) { kb(k, c.trim, -0.7, y - 1.2, 0, 1.4, 0.16, L - 1); kb(k, PM.pole, -1.35, y - 0.65, 0, 0.04, 0.04, L - 1);
      for (let z = -L / 2 + 1.8; z < L / 2 - 1.2; z += 2.3) win(K, k, 0, y, z, 1.1, 1.9, 0.45); }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // a dune of pale sand with marram grass on its back
  function dune(K) {
    const c = init(K), k = K.kit(), { kadd, KG, rnd } = K, w = rnd(18, 30), h = rnd(5, 9);
    kadd(k, KG.ball, c.sand, 0, -0.5, 0, 0, 0, 0, rnd(16, 24), h * 2, w); kadd(k, KG.ball, c.sand, rnd(4, 8), -0.5, rnd(-6, 6), 0, 0, 0, rnd(12, 18), h * 1.4, w * 0.7);
    const g = K.kbuild(k);
    for (let i = 0; i < 3; i++) { const r = K.reeds(); r.position.set(rnd(-4, 4), h * rnd(0.55, 0.9) - 0.5, rnd(-w / 3, w / 3)); r.scale.multiplyScalar(rnd(0.9, 1.4)); g.add(r); }
    return g;
  }
  // a light blue steel footbridge over the cycle path, deck at six metres, steps down on the town side
  function footbridge(K) {
    const c = init(K), k = K.kit(), { kb, ktube, PM } = K;
    kb(k, c.blue, 0, 6.1, 0, 22, 0.35, 2.6);
    for (const z of [-1.25, 1.25]) { kb(k, c.blue, 0, 7.15, z, 22, 0.08, 0.08); for (let x = -10.5; x <= 10.6; x += 1.5) kb(k, c.blue, x, 6.65, z, 0.06, 1.0, 0.06); }
    for (const x of [-10, 10]) for (const z of [-0.9, 0.9]) kb(k, c.blue, x, 2.7, z, 0.3, 6.6, 0.3);
    for (let i = 0; i < 14; i++) kb(k, c.blue, 11.4 + i * 0.4, 5.75 - i * 0.42, 0, 0.42, 0.12, 2.4);
    ktube(k, PM.pole, 11.2, 6.2, 1.25, 17, 0.4, 1.25, 0.04);
    return K.kbuild(k);
  }
  // one of the boulevard's long blocks of rusted Corten steel
  function corten(K) { const k = K.kit(); K.kb(k, init(K).corten, 0, 0.8, 0, 1.4, 1.6, 15); K.kb(k, init(K).corten, 0, 1.62, 0, 1.6, 0.06, 15.2); return K.kbuild(k); }
  // a beach pavilion on the sand: wooden walls, lit windows, a terrace under strings of bulbs
  function pavilion(K) {
    const c = init(K), k = K.kit(), { kb, kadd, KG, PM } = K, y0 = -0.6;
    kb(k, K.M.wood, 0, y0 + 0.25, 0, 10, 0.5, 16); kb(k, K.M.wood, -1.5, y0 + 2.2, 0, 6, 3.4, 14); kb(k, PM.roof, -1.5, y0 + 4.05, 0, 7, 0.3, 15);
    kb(k, c.lit, 1.52, y0 + 2.0, 0, 0.04, 1.8, 12); kadd(k, K.PG.winGlow, c.glow, 1.6, y0 + 2.1, 0, 0, -YAW, 0, 12, 4);
    for (const z of [-7, 0, 7]) kb(k, PM.pole, 4.6, y0 + 1.7, z, 0.08, 2.4, 0.08);
    for (let z = -7; z <= 7.01; z += 0.8) kadd(k, KG.plane, c.bulb, 4.6, y0 + 2.75 - Math.sin((z + 7) / 7 * Math.PI) * 0.25, z, 0, HALF, 0, 0.5, 0.5);
    kb(k, PM.pole, -4.0, y0 + 6, 6, 0.06, 4, 0.06); kb(k, c.flagR, -4.0, y0 + 7.6, 5.3, 0.02, 0.5, 1.3);
    return K.kbuild(k);
  }
  // the boulevard lamp: a tall slim pole, a flat head on a short arm
  function boulevardLamp(K) {
    const k = K.kit(), { kb, kadd, PM, PG } = K;
    kadd(k, PG.pole, PM.pole, 0, 2.73, 0, 0, 0, 0, 1, 1.3, 1); kb(k, PM.pole, -0.45, 5.4, 0, 1.0, 0.07, 0.07);
    const g = K.kbuild(k), head = new K.THREE.Mesh(PG.bulb, PM.lampHead); head.position.set(-0.9, 5.3, 0); head.scale.set(1.7, 0.4, 1.7); g.add(head);
    K.lampLights(g, -0.9, 5.3, 0, 1.15); g.userData.faceRoad = true; return g;
  }
  // ---- the far town, painted on the three bands round the horizon ----
  const Yp = (P, h) => P.g.canvas.height - (5 + h) * P.m;
  function glow(P, x, h, w, hh, col) { P.w.fillStyle = col; P.w.fillRect(x - w * P.m / 2, Yp(P, h) - hh * P.m, w * P.m, hh * P.m); }
  const OFFICE = a => `rgba(200,255,255,${a})`, HOME = a => `rgba(255,240,214,${a})`;
  function floors(P, x, w, h0, h1, share, col, fh = 3.3, cw = 2.4) {   // lit floors across a tower: whole office floors and single windows
    for (let f = h0 + 1.2; f < h1 - 1.6; f += fh) {
      if (P.r() < share * 0.22) { glow(P, x, f, w * 0.8, fh * 0.38, col(P.rr(0.3, 0.6))); continue; }
      for (let c = -w / 2 + cw * 0.7; c < w / 2 - cw * 0.5; c += cw) if (P.r() < share) glow(P, x + c * P.m, f, cw * 0.48, fh * 0.4, col(P.rr(0.45, 0.95)));
    }
  }
  function mansards(P, f0, f1, h0, h1, litP) {   // Hague villas: mansard roofs, chimneys, rows of tall lit windows
    let x = P.X(f0); const m = P.m;
    while (x < P.X(f1)) {
      const w = P.rr(10, 16), h = P.rr(h0, h1);
      P.poly([[x - w / 2 * m, -5], [x - w / 2 * m, h], [x - (w / 2 - 1.4) * m, h + 3], [x + (w / 2 - 1.4) * m, h + 3], [x + w / 2 * m, h], [x + w / 2 * m, -5]]);
      for (let i = 0; i < 2; i++) if (P.r() < 0.7) P.box(x + P.rr(-w / 3, w / 3) * m, 0.8, h + 2, h + 4.6);
      for (let fy = 1.8; fy < h - 1; fy += 3.2) for (let fx = -w / 2 + 1.4; fx < w / 2 - 1; fx += 2.2) if (P.r() < litP) P.win(x + fx * m, fy, P.rr(0.4, 0.9), 0.9, 1.7);
      x += w * m * P.rr(1.0, 1.3);
    }
  }
  // the government towers by Centraal: the JuBi twins, the Hoftoren with its slanting pen nib, the Strijkijzer's narrow wedge and open
  // crown, De Kroon, the two pitched roofs of Castalia; offices lit floor by floor
  function govTowers(P, cx, s) {
    const m = P.m, X = dx => cx + dx * m;
    for (const dx of [-24, -15]) { P.box(X(dx), 7, -5, 60 * s); P.box(X(dx), 5.4, 60 * s, 62.5 * s); floors(P, X(dx), 7, 0, 60 * s, 0.35, OFFICE, 3.3, 1.8); }
    P.poly([[X(-8.5), -5], [X(-8.5), 51 * s], [X(-4), 61 * s], [X(-0.5), 57 * s], [X(-0.5), -5]]); floors(P, X(-4.5), 7.5, 0, 50 * s, 0.4, OFFICE, 3.3, 1.8); glow(P, X(-4.5), 54 * s, 5, 3, OFFICE(0.35));
    const x3 = X(6); P.poly([[x3 - 2.5 * m, -5], [x3 - 2.5 * m, 50 * s], [x3 + 3.5 * m, 50 * s], [x3 + 3.5 * m, -5]]);
    for (let i = 0; i < 5; i++) P.box(x3 + (-2.2 + i * 1.3) * m, 0.45, 50 * s, 55 * s); P.box(x3 + 0.5 * m, 6, 54.6 * s, 55.6 * s); floors(P, x3 + 0.5 * m, 6, 0, 50 * s, 0.5, HOME, 3, 1.6);
    const x4 = X(15); P.box(x4, 8.5, -5, 45 * s); for (let i = 0; i < 4; i++) P.poly([[x4 + (-4.25 + i * 2.1) * m, 45 * s], [x4 + (-3.2 + i * 2.1) * m, 48.5 * s], [x4 + (-2.15 + i * 2.1) * m, 45 * s]]); floors(P, x4, 8.5, 0, 45 * s, 0.45, HOME, 3, 1.8);
    for (const dx of [24, 31]) { const xx = X(dx); P.box(xx, 6, -5, 34 * s); P.poly([[xx - 3 * m, 34 * s], [xx, 41 * s], [xx + 3 * m, 34 * s]]); floors(P, xx, 6, 0, 34 * s, 0.3, OFFICE, 3.3, 1.8); }
    P.box(X(-33), 10, -5, 40 * s); floors(P, X(-33), 10, 0, 40 * s, 0.3, OFFICE);
  }
  function vredespaleis(P, x) {   // the Peace Palace where the Scheveningseweg begins: a long steep roof and its tall clock tower
    const m = P.m;
    P.box(x, 32, -5, 13); P.poly([[x - 16 * m, 13], [x - 13 * m, 19], [x + 13 * m, 19], [x + 16 * m, 13]]);
    P.box(x - 13.5 * m, 6, -5, 29); P.box(x - 13.5 * m, 4.6, 29, 35); P.poly([[x - 15.8 * m, 35], [x - 13.5 * m, 47], [x - 11.2 * m, 35]]);
    P.box(x + 14 * m, 4, -5, 21); P.poly([[x + 12 * m, 21], [x + 14 * m, 26], [x + 16 * m, 21]]);
    for (let i = 0; i < 12; i++) if (P.r() < 0.45) P.win(x + (-13 + i * 2.4) * m, P.r() < 0.5 ? 3 : 7.5, P.rr(0.4, 0.8), 1.1, 2.2);
    glow(P, x - 13.5 * m, 31.2, 2.4, 2.4, HOME(0.75));
  }
  function binnenhofBand(P, f0, f1) {   // the Binnenhof's long roofs over the water, the Ridderzaal's gable and turrets among them
    const m = P.m; let x = P.X(f0);
    while (x < P.X(f1)) { const w = P.rr(18, 30), h = P.rr(10, 13); P.box(x, w, -5, h); P.poly([[x - w / 2 * m, h], [x - (w / 2 - 3) * m, h + 5], [x + (w / 2 - 3) * m, h + 5], [x + w / 2 * m, h]]);
      for (let fx = -w / 2 + 1.5; fx < w / 2 - 1; fx += 2.4) for (const fy of [2.5, 6, 9]) if (fy < h - 1 && P.r() < 0.4) P.win(x + fx * m, fy, P.rr(0.5, 0.95), 0.9, 1.8); x += w * m * P.rr(1.02, 1.1); }
    const r = P.X((f0 + f1) / 2); P.box(r, 16, -5, 12); P.poly([[r - 8 * m, 12], [r, 25], [r + 8 * m, 12]]);
    for (const dx of [-8.6, 8.6]) { P.box(r + dx * m, 2.4, -5, 24); P.poly([[r + (dx - 1.4) * m, 24], [r + dx * m, 31], [r + (dx + 1.4) * m, 24]]); }
    glow(P, r, 4.5, 3.2, 8.5, HOME(0.85));
  }
  function wheel(P, x, hub, R) {   // the Pier's wheel: rim and spokes on the dark, bulbs and gondolas lit
    P.g.lineWidth = Math.max(1, 0.5 * P.m); P.g.beginPath(); P.g.arc(x, Yp(P, hub), R * P.m, 0, 7); P.g.stroke();
    for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; P.line(x, hub, x + Math.cos(a) * R * P.m, hub + Math.sin(a) * R, 0.2); glow(P, x + Math.cos(a) * R * P.m, hub + Math.sin(a) * R - 1, 1.2, 1.2, HOME(0.9)); }
    for (let i = 0; i < 40; i++) { const a = i * Math.PI / 20; glow(P, x + Math.cos(a) * R * P.m, hub + Math.sin(a) * R, 0.5, 0.5, HOME(0.8)); }
    P.line(x, hub, x - R * 0.55 * P.m, 7, 0.6); P.line(x, hub, x + R * 0.55 * P.m, 7, 0.6);
  }
  const SKY = {
    near(P, K, th) {
      cur = th.key; C.bh = -1;
      if (cur === 'dyke') {   // dunes rolling inland, the boulevard's flats over them; on the sea side nothing but the dark
        P.g.beginPath(); P.g.moveTo(P.X(0.56), P.g.canvas.height); for (let i = 0; i <= 40; i++) { const f = 0.56 + i * 0.011; P.g.lineTo(P.X(f), Yp(P, 4 + 5 * Math.sin(i * 0.7) + 3 * Math.sin(i * 1.9))); } P.g.lineTo(P.X(1), P.g.canvas.height); P.g.fill();
        for (let i = 0; i < 6; i++) { const x = P.X(P.rr(0.62, 0.98)), w = P.rr(14, 24), h = P.rr(14, 24); P.box(x, w, -5, h); for (let fy = 3; fy < h - 1; fy += 3) for (let fx = -w / 2 + 1.2; fx < w / 2 - 1; fx += 2.2) if (P.r() < 0.35) P.win(x + fx * P.m, fy, P.rr(0.4, 0.9), 1.1, 1.4); }
        return;
      }
      if (cur === 'square') { mansards(P, 0, 0.4, 10, 15, 0.14); P.trees(0, 0.42, 9, 18, 10); P.trees(0.42, 0.6, 4, 7, 12); return; }
      P.trees(0, 0.42, 12, 24, 7); mansards(P, 0.6, 1, 10, 16, 0.16); P.trees(0.58, 1, 10, 19, 10); P.trees(0.42, 0.58, 4, 8, 12);
    },
    mid(P, K, th) {
      if (cur === 'dyke') {
        P.box((P.X(0.1) + P.X(0.27)) / 2, (P.X(0.27) - P.X(0.1)) / P.m, 7, 9); for (let i = 0; i < 14; i++) P.box(P.X(0.1 + i * 0.012), 0.6, -5, 7);
        for (let i = 0; i < 20; i++) glow(P, P.X(0.1 + i * 0.008), 9.6, 0.5, 0.5, HOME(0.7));
        wheel(P, P.X(0.2), 22, 13);
        const kx = P.X(0.64); P.box(kx, 46, -5, 15); P.box(kx, 12, 15, 19); P.g.beginPath(); P.g.ellipse(kx, Yp(P, 19), 6.5 * P.m, 9 * P.m, 0, Math.PI, 0); P.g.fill(); P.box(kx, 1.4, 27, 31);
        for (const dx of [-21, 21]) { P.box(kx + dx * P.m, 6, 15, 19); P.g.beginPath(); P.g.ellipse(kx + dx * P.m, Yp(P, 19), 3.2 * P.m, 3.6 * P.m, 0, Math.PI, 0); P.g.fill(); }
        for (let i = 0; i < 18; i++) for (const fy of [6, 9.5, 13]) if (P.r() < 0.5) P.win(kx + (-21 + i * 2.5) * P.m, fy, P.rr(0.5, 0.95), 1, 1.8);
        const lx = P.X(0.76); P.poly([[lx - 2.2 * P.m, -5], [lx - 1.7 * P.m, 30], [lx + 1.7 * P.m, 30], [lx + 2.2 * P.m, -5]]); P.box(lx, 2.6, 30, 33); P.poly([[lx - 1.6 * P.m, 33], [lx, 35.5], [lx + 1.6 * P.m, 33]]); glow(P, lx, 30.3, 2.6, 2.4, HOME(1));
        mansards(P, 0.8, 1, 12, 18, 0.18); return;
      }
      if (cur === 'square') { P.trees(0, 0.5, 7, 13, 13); mansards(P, 0.05, 0.4, 12, 17, 0.12); P.tower(P.X(0.36), [[8, 34], [6.5, 12]], 'spire', true); binnenhofBand(P, 0.47, 0.66); mansards(P, 0.7, 1, 12, 16, 0.12); return; }
      P.trees(0, 1, 7, 13, 13); mansards(P, 0, 0.36, 11, 16, 0.12); mansards(P, 0.72, 1, 11, 16, 0.12);
      vredespaleis(P, P.X(0.34)); govTowers(P, P.X(0.56), 0.66);
    },
    far(P, K, th) {
      P.trees(0, 1, 5, 10, 10);
      if (cur === 'dyke') { for (let i = 0; i < 8; i++) glow(P, P.X(P.rr(0.02, 0.4)), P.rr(0.2, 1.2), 0.9, 0.6, i % 3 ? HOME(0.9) : 'rgba(255,90,70,0.9)'); govTowers(P, P.X(0.86), 0.55); return; }
      P.roofs(0, 1, 6, 12, 0.05, ['flat', 'roof', 'flat']);
      if (cur === 'square') govTowers(P, P.X(0.64), 1.0);
      else { P.tower(P.X(0.22), [[7, 40], [5.5, 14]], 'spire', true); P.box(P.X(0.8), 12, -5, 34); floors(P, P.X(0.8), 12, 0, 34, 0.3, OFFICE); }
    },
  };
  // ---- the dead in Hague dress, on the shared body ----
  // a civil servant: dark suit, white collar and a tie, a briefcase hanging from the right hand, hair with a neat parting
  function ambtenaar(k, b, K) {
    const c = init(K), { kb, kadd, ktube, KG } = K, [, hy, hz] = b.hip, [, sy, sz] = b.sh, [, dy, dz] = b.hd;
    ktube(k, c.suit, 0, hy - 0.08, hz + 0.02, 0, sy - 0.02, sz + 0.02, 0.2); kb(k, c.suit, 0, hy - 0.12, hz - 0.02, 0.44, 0.34, 0.3); kb(k, c.suit, 0, sy, sz, 0.58, 0.16, 0.24);
    for (const s of [-1, 1]) {
      ktube(k, c.suit, s * 0.25, sy, sz, s * 0.28, 1.16, -0.48, 0.085); ktube(k, c.suit, s * 0.28, 1.16, -0.48, s * 0.268, 0.82, -0.58, 0.075);
      ktube(k, c.suit, s * 0.11, hy, hz, s * 0.121, 0.53, -0.1, 0.105); ktube(k, c.suit, s * 0.121, 0.53, -0.1, s * 0.125, 0.12, 0.05, 0.085);
    }
    kb(k, c.shirt, 0, sy - 0.03, sz - 0.12, 0.2, 0.1, 0.1); ktube(k, c.leather, 0, sy - 0.07, sz - 0.13, 0, 1.25, -0.36, 0.03);
    kb(k, c.leather, 0.27, 0.43, -0.6, 0.11, 0.38, 0.48); kb(k, c.leather, 0.27, 0.65, -0.6, 0.04, 0.06, 0.18);
    kadd(k, KG.dome, c.suit, 0, dy + 0.03, dz + 0.03, -0.35, 0, 0.12, 0.25, 0.2, 0.28);
  }
  // a Scheveningen woman: the long black skirt and jacket, the striped apron, a pastel shawl folded over the back, the white cap with
  // its silver ornaments at the temples
  function scheveningse(shawl) {
    return (k, b, K) => {
      const c = init(K), { kb, kadd, ktube, KG, PK, PM } = K, [, hy, hz] = b.hip, [, sy, sz] = b.sh, [, dy, dz] = b.hd;
      kadd(k, c.skirtGeo, c.skirt, 0, 0.55, -0.02, -0.08, 0, 0, 1, 1.02, 1); kadd(k, KG.plane, c.apron, 0, 0.62, -0.36, 0.24, Math.PI, 0, 0.46, 0.86);
      ktube(k, c.skirt, 0, hy, hz, 0, sy - 0.05, sz, 0.17);
      ktube(k, c.shawls[shawl], 0, sy + 0.02, sz + 0.02, 0, hy + 0.3, hz - 0.06, 0.21); kb(k, c.shawls[shawl], 0, sy + 0.01, sz, 0.6, 0.12, 0.3);
      kadd(k, KG.dome, PK.linen, 0, dy - 0.01, dz + 0.02, 0.5, 0, 0, 0.29, 0.3, 0.31);
      for (const s of [-1, 1]) kadd(k, KG.ball, PM.silver, s * 0.13, dy - 0.01, dz - 0.04, 0, 0, 0, 0.07, 0.09, 0.05);
    };
  }

  const post = K => K.fingerpost(T.denhaag.signs.slice().sort(() => Math.random() - 0.5).slice(0, 3));
  const BH = ['plain', 'torentje', 'plain', 'ridderzaal'];
  T.denhaag = {
    style: { brick: [0x5a3a32, 0x684538, 0x76685a, 0x4c3a36], gables: 0.1, height: [9, 12], width: [5, 6.5], lamp: 'classic' },
    light: { lamp: 0xffe4bc },
    road: { kind: 'asphalt', tone: '#343840' },
    // a bright city: few stars, the sky lit from below; the Westland's greenhouses burn orange low in the south
    sky: { stars: 50, clouds: 1, glows: [{ az: -34, el: 1.0, w: 120, h: 6, color: 0xff7426, a: 0.45 }, { az: -26, el: 3.5, w: 170, h: 15, color: 0xff9a50, a: 0.13 }, { az: 30, el: 3, w: 150, h: 14, color: 0xffd8a8, a: 0.1 }] },
    lamp: K => lamp(K),
    extra: [],
    skyline: SKY,
    shops: ['HAAGSE HOPJES', 'BOEKHANDEL', 'KAPPER', 'APOTHEEK', 'BLOEMEN', 'CAFÉ', 'VISHANDEL', 'BAKKER'],
    signs: ['Scheveningen', 'Binnenhof', 'Centraal', 'Kurhaus', 'Vredespaleis', 'Malieveld'],
    dead: {
      get pool() { return cur === 'dyke' ? ['dhScheveningse', 'dhScheveningse2', 'dhScheveningse', 'dhAmbtenaar', 'plain', 'crawler'] : ['dhAmbtenaar', 'dhAmbtenaar', 'dhAmbtenaar', 'dhScheveningse', 'dhScheveningse2', 'plain', 'crawler']; },
      dress: { dhAmbtenaar: ambtenaar, dhScheveningse: scheveningse(0), dhScheveningse2: scheveningse(1) },
    },
    themes: {
      // the Scheveningseweg: dead straight, the tram beside it under its wires, the woods, villas behind their gardens
      street: (base, K) => Object.assign({}, base, {
        fog: 0x4f5864, fogD: 0.0152, curv: 0, ground: 0x18201b, landmark: false,
        spawn: [
          { make: track, n: 10, gap: 30, side: 'left', reg: true, xr: [TRACK, TRACK], r: 0.1 },
          { make: K => tram(K, true), n: 1, gap: 300, side: 'left', xr: [TRACK + 1.6, TRACK + 1.6], r: 0.1 },
          { make: tramStop, n: 1, gap: 150, side: 'left', xr: [8.6, 8.6], r: 0.5 },
          { make: K => villa(K), n: 9, gap: 23, side: 'right', reg: true, xr: [9.4, 9.8], r: 10 },
          { make: K => villa(K, { plain: true, n: 3 }), n: 5, gap: 40, side: 'left', reg: true, xr: [27, 29], r: 14 },
          { make: lamp, n: 10, gap: 15, side: 'alt', reg: true, xr: [4.7, 4.7] },
          { make: K => bigTree(K, [1, 1, 0], 1.25), n: 12, gap: 13, side: 'right', reg: true, xr: [5.9, 6.2], r: 0.9 },
          { make: K => bigTree(K, [0, 0, 1, 2], 1.6), n: 14, gap: 11, side: 'left', xr: [17, 23], r: 0.9 },
          { make: K.bench, n: 2, gap: 80, side: 'right', xr: [4.9, 4.9], r: 0.9 }, { make: post, n: 1, gap: 140, side: 'right', xr: [4.6, 4.6], r: 0.5 },
          { make: K.bikeRow, n: 3, gap: 50, side: 'right', xr: [4.9, 5.0], r: 0.6 }, { make: K.bins, n: 2, gap: 70, side: 'both', xr: [5.0, 5.1], r: 0.5 },
          { make: 'zombieWalk', n: 8, gap: 18, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] }),
      // a shopping street of the same stately houses, shops in their ground floors under awnings
      shops: (base, K) => Object.assign({}, base, {
        fog: 0x515a64, fogD: 0.0155, curv: 0.0016, landmark: false,
        spawn: [
          { make: K => villa(K, { shop: true }), n: 7, gap: 22, side: 'right', reg: true, xr: [7.7, 7.9], r: 10 },
          { make: K => villa(K, { shop: true }), n: 7, gap: 22, side: 'left', reg: true, xr: [7.7, 7.9], r: 10 },
          { make: K => villa(K, { plain: true, n: 3 }), n: 6, gap: 32, side: 'alt', reg: true, xr: [22, 24], r: 14 },
          { make: lamp, n: 10, gap: 15, side: 'alt', reg: true, xr: [4.7, 4.7] },
          { make: K => bigTree(K, [1, 2], 1.1), n: 6, gap: 26, side: 'both', xr: [5.6, 5.8], r: 0.9 },
          { make: K.bikeRow, n: 5, gap: 28, side: 'both', xr: [4.9, 5.0], r: 0.6 }, { make: K.crates, n: 4, gap: 34, side: 'both', xr: [5.0, 5.2], r: 0.5 },
          { make: K.bins, n: 2, gap: 70, side: 'both', xr: [5.0, 5.1], r: 0.5 }, { make: K.bakfiets, n: 1, gap: 140, side: 'both', xr: [5.0, 5.1], r: 0.7 },
          { make: post, n: 1, gap: 140, side: 'both', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 8, gap: 18, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] }),
      // the Lange Vijverberg along the Hofvijver: the Binnenhof across the water with the Ridderzaal and the Torentje, mirrored
      square: (base, K) => Object.assign({}, base, {
        fog: 0x4f5862, fogD: 0.015, curv: 0.0012, canal: 1, water: 0x141c25, waterY: 0.0, ground: 0x1c2026, groundY: -0.05, landmark: false,
        road: { kind: 'klinkers', tone: '#4a423c' },
        spawn: [
          { make: K => binnenhof(K, BH[(C.bh = (C.bh + 1) || 0) % 4]), n: 8, gap: 31, side: 'right', reg: true, xr: [33, 33], r: 15 },
          { make: fountain, n: 2, gap: 120, side: 'right', xr: [16, 19], r: 0.5 }, { make: flagIsland, n: 1, gap: 240, side: 'right', xr: [23, 24], r: 0.5 },
          { make: K => villa(K, { garden: false, n: 3 }), n: 8, gap: 23, side: 'left', reg: true, xr: [8.4, 8.8], r: 11 },
          { make: K => villa(K, { plain: true, n: 3 }), n: 4, gap: 45, side: 'left', reg: true, xr: [26, 28], r: 14 },
          { make: lamp, n: 8, gap: 18, side: 'alt', reg: true, xr: [4.7, 4.7] },
          { make: K => bigTree(K, [1], 1.3), n: 14, gap: 12, side: 'right', reg: true, xr: [6.3, 6.5], r: 0.9 },
          { make: K.bench, n: 3, gap: 50, side: 'right', xr: [5.2, 5.2], r: 0.9 }, { make: K.bikeRow, n: 3, gap: 50, side: 'left', xr: [4.9, 5.0], r: 0.6 },
          { make: post, n: 1, gap: 150, side: 'right', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 6, gap: 28, side: 'both', xr: [5.0, 6.0], r: 0.6 } ] }),
      // the boulevard of Scheveningen: the beach and the black sea on the left, the Pier and its wheel, the Kurhaus, the lighthouse
      dyke: (base, K) => Object.assign({}, base, {
        fog: 0x4c5662, fogD: 0.0135, night: 0.16, open: true, curv: 0, canal: -1, water: 0x16202a, waterY: -0.75, ground: 0x0c1218, groundY: -1.2, verge: 'tiles', landmark: false,
        road: { kind: 'klinkers', tone: '#4a4540' },
        sky: { stars: 140, glows: [{ az: -60, el: 1.2, w: 90, h: 6, color: 0xff7426, a: 0.38 }, { az: -28, el: 3, w: 120, h: 14, color: 0xffcf9a, a: 0.12 }] },
        spawn: [
          { make: beach, n: 3, gap: 100, side: 'left', reg: true, xr: [0.01, 0.01], r: 0.1 },
          { make: land, n: 3, gap: 100, side: 'right', reg: true, xr: [0.01, 0.01], r: 0.1 },
          { make: pier, n: 3, gap: 90, side: 'left', reg: true, xr: [0.01, 0.01], r: 0.1 },
          { make: kurhaus, n: 1, gap: 260, side: 'right', xr: [12.5, 13], r: 34 },
          { make: lighthouse, n: 1, gap: 260, side: 'right', xr: [10, 11], r: 6 },
          { make: hotel, n: 5, gap: 50, side: 'right', xr: [12, 13], r: 16 },
          { make: dune, n: 4, gap: 60, side: 'right', xr: [14, 16], r: 12 },
          { make: footbridge, n: 1, gap: 190, side: 'right', xr: [0.01, 0.01], r: 0.1 },
          { make: corten, n: 2, gap: 110, side: 'left', xr: [6.6, 6.6], r: 0.5 }, { make: pavilion, n: 2, gap: 120, side: 'left', xr: [12, 13], r: 0.5 },
          { make: boulevardLamp, n: 8, gap: 24, side: 'alt', reg: true, xr: [4.7, 4.7] },
          { make: K.bench, n: 3, gap: 60, side: 'left', xr: [5.2, 5.2], r: 0.9 }, { make: K.bins, n: 2, gap: 80, side: 'right', xr: [5.0, 5.1], r: 0.5 },
          { make: post, n: 1, gap: 180, side: 'right', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 5, gap: 40, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] }),
    },
  };
})();
