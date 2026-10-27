// Intro panel 1 in 3D: "The night the mist came in, the windmills turned the wrong way."
// The establishing shot of the film: Kinderdijk at night, in two beats.
// 1. 0 to 4 s: low over the boezem, a slow sideways dolly along the row of mills on the far dyke. The moon hangs over
//    them and their sails turn the right way, anticlockwise seen from the front. The mist is still thin.
// 2. From 4 s: closer on one mill, the moon at its shoulder. Its sails slow, stop and start to turn the wrong way, its
//    lit window flickers, and down the row the other mills follow, one after another, while the mist closes in.
// The set stands on the empty ground beyond the start of the road (z above 50), turned to face the painted moon of the
// sky dome, so the game's own moonlight backlights every mill. The road world, 200 m off in the mist, and the far town
// painted round the horizon (its mills cannot turn) are hidden for the shot and given back in dispose. The set brings its own
// dyke, mills and trees, which fade as the mist thickens, and its own water over nothing: a mirrored copy of the set below it
// shows through the ripples as the reflections.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const DEG = Math.PI / 180, MOON_AZ = 24 * DEG, MOON_EL = 17 * DEG;   // the sky dome's moon and the game's moonlight
  const O = [0, 0, 262], WY = -0.6, CUT = 4.0;   // the set's origin in the world, the water level, the cut between the beats
  // the far dyke in the set's frame: it runs from the near left away to the far right, so the row recedes into the mist
  const BANK = { x: -14.5, z: -22.4, yaw: 0.8 }, MS = 0.8;   // MS: the mills' scale
  const ROW = [[0, 1], [27, 2], [58, 1], [92, 0], [129, 1], [168, 0]], HERO = 1;   // [place along the dyke, lit windows]
  let st = null;

  // ---------- helpers in the set's own frame: x along the dyke, minus z toward the moon ----------
  const cA = Math.cos(MOON_AZ), sA = Math.sin(MOON_AZ);
  const wx = (x, z) => O[0] + x * cA + z * sA, wz = (x, z) => O[2] - x * sA + z * cA;
  function seeded(n) { let s = n; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  // ---------- canvas textures (own, disposed with their meshes or in dispose) ----------
  function canvasTex(T, w, h, paint, srgb) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d'), w, h);
    const t = new T.CanvasTexture(c); if (srgb !== false) t.colorSpace = T.SRGBColorSpace; return t;
  }
  function thatchTex(T) {   // reed thatch: dense vertical straws and a few binding rows
    return canvasTex(T, 128, 256, (g, w, h) => {
      const r = seeded(17); g.fillStyle = '#6a6458'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) { const x = r() * w, y = r() * h, l = 6 + r() * 26, v = 70 + r() * 70 | 0; g.fillStyle = `rgba(${v},${v - 6},${v - 16},0.55)`; g.fillRect(x, y, 1, l); }
      for (let y = 18; y < h; y += 44) { g.fillStyle = 'rgba(30,26,22,0.35)'; g.fillRect(0, y, w, 3); }
    });
  }
  function moonTex(T) {   // a pale cold disc with soft maria and a soft limb; cold, so the warm grade leaves it near white
    return canvasTex(T, 128, 128, (g) => {
      const r = seeded(5); g.clearRect(0, 0, 128, 128);
      g.save(); g.beginPath(); g.arc(64, 64, 60, 0, 7); g.clip();
      const gr = g.createRadialGradient(56, 58, 4, 64, 64, 62); gr.addColorStop(0, '#eef3fb'); gr.addColorStop(0.75, '#d8e2f0'); gr.addColorStop(1, '#b6c3d8');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
      for (const [x, y, rad, a] of [[46, 50, 20, 0.16], [76, 44, 14, 0.13], [70, 78, 18, 0.12], [40, 82, 10, 0.1], [88, 66, 9, 0.1]]) {
        const m = g.createRadialGradient(x, y, 0, x, y, rad); m.addColorStop(0, `rgba(120,134,160,${a})`); m.addColorStop(1, 'rgba(120,134,160,0)'); g.fillStyle = m; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
      for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(150,162,184,${0.05 + r() * 0.08})`; g.beginPath(); g.arc(20 + r() * 88, 20 + r() * 88, 1 + r() * 3, 0, 7); g.fill(); }
      g.restore();
      g.globalCompositeOperation = 'destination-in'; const e = g.createRadialGradient(64, 64, 57, 64, 64, 61); e.addColorStop(0, 'rgba(0,0,0,1)'); e.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = e; g.fillRect(0, 0, 128, 128);
    });
  }
  function haloTex(T) {   // the moon's halo in the haze: a long soft falloff, no visible edge
    return canvasTex(T, 256, 256, (g) => {
      const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      for (let i = 0; i <= 12; i++) { const u = i / 12; gr.addColorStop(u, `rgba(255,255,255,${Math.pow(1 - u, 2.6).toFixed(3)})`); }
      g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    });
  }
  function mistTex(T) {   // a long low bank of mist: soft lumps, no edges
    return canvasTex(T, 256, 64, (g) => {
      const r = seeded(29);
      for (let i = 0; i < 90; i++) { const x = 24 + r() * 208, y = 30 + r() * 20, rad = 10 + r() * 22, rg = g.createRadialGradient(x, y, 0, x, y, rad); rg.addColorStop(0, `rgba(255,255,255,${0.08 + r() * 0.1})`); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
      g.globalCompositeOperation = 'destination-in';
      const hz = g.createLinearGradient(0, 0, 256, 0); hz.addColorStop(0, 'rgba(0,0,0,0)'); hz.addColorStop(0.25, 'rgba(0,0,0,1)'); hz.addColorStop(0.75, 'rgba(0,0,0,1)'); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, 256, 64);
      const vt = g.createLinearGradient(0, 0, 0, 64); vt.addColorStop(0, 'rgba(0,0,0,0)'); vt.addColorStop(0.5, 'rgba(0,0,0,1)'); vt.addColorStop(0.85, 'rgba(0,0,0,1)'); vt.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = vt; g.fillRect(0, 0, 256, 64);
    });
  }
  function pathTex(T) {   // the moon's road on the water: broken ripple dashes, densest on the middle line
    return canvasTex(T, 64, 512, (g) => {
      const r = seeded(41); g.fillStyle = '#000'; g.fillRect(0, 0, 64, 512);
      for (let i = 0; i < 700; i++) {
        const y = r() * 512, d = (r() + r() + r() - 1.5) / 1.5, x = 32 + d * 30, w = 2 + r() * 14 * (1 - Math.abs(d)), a = (0.25 + r() * 0.75) * (1 - Math.abs(d)) * Math.pow(Math.sin(Math.PI * y / 512), 0.6);
        g.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`; g.fillRect(x - w / 2, y, w, 1 + (r() < 0.3 ? 1 : 0));
      }
    }, false);
  }

  function cloudTex(T) {   // a long ragged cloud bank: lumpy top, flatter underside, soft everywhere
    return canvasTex(T, 512, 128, (g) => {
      const r = seeded(23);
      for (let i = 0; i < 160; i++) { const u = r(), x = 30 + u * 452, env = Math.sin(Math.PI * u), y = 78 - env * (14 + r() * 26), rad = 8 + env * (12 + r() * 22), rg = g.createRadialGradient(x, y, 0, x, y, rad); rg.addColorStop(0, `rgba(255,255,255,${(0.1 + r() * 0.12).toFixed(3)})`); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 128); vt.addColorStop(0, 'rgba(0,0,0,1)'); vt.addColorStop(0.7, 'rgba(0,0,0,1)'); vt.addColorStop(0.92, 'rgba(0,0,0,0)'); g.fillStyle = vt; g.fillRect(0, 0, 512, 128);
    });
  }
  function rippleTex(T) {   // the water's skin: soft wavering ripples; rgb is their light, alpha how much of the mirror below shows through
    const N = 256, layer = (seed, n, a) => {   // soft horizontal dashes, wrapped on all sides, added up on black
      const c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), r = seeded(seed);
      g.fillStyle = '#000'; g.fillRect(0, 0, N, N); g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const x = r() * N, y = r() * N, rx = 8 + r() * 46, ry = 0.8 + r() * 2.2, k = a * (0.4 + r() * 0.6);
        for (const ox of [-N, 0, N]) for (const oy of [-N, 0, N]) {
          if (x + ox + rx < 0 || x + ox - rx > N || y + oy + ry < 0 || y + oy - ry > N) continue;
          g.save(); g.translate(x + ox, y + oy); g.scale(rx, ry);
          const gr = g.createRadialGradient(0, 0, 0, 0, 0, 1); gr.addColorStop(0, `rgba(255,255,255,${k.toFixed(3)})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
          g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 1, 0, 7); g.fill(); g.restore();
        }
      }
      return g.getImageData(0, 0, N, N).data;
    };
    const L = layer(131, 240, 0.55), D = layer(977, 200, 0.6);
    return canvasTex(T, N, N, (g) => {
      const im = g.createImageData(N, N), d = im.data;
      for (let i = 0; i < d.length; i += 4) {
        const l = Math.min(1, L[i] / 255), k = Math.min(1, D[i] / 255);
        const v = 112 + 92 * l - 62 * k; d[i] = v; d[i + 1] = v + 4; d[i + 2] = v + 10;
        d[i + 3] = Math.max(40, Math.min(250, 152 - 92 * l + 86 * k));
      }
      g.putImageData(im, 0, 0);
    });
  }
  // ---------- a Kinderdijk mill: a thatched achtkante grondzeiler, its sails in a group of their own ----------
  // lit: lit windows (0 to 2); door: a lit door; own: windows on own unfogged materials (to flicker); n, bar: lattice bars per sail and their size
  function mill(W, G, o) {
    const T = W.THREE, k = W.kit(), P8 = Math.PI / 8, root = new T.Group();
    const BH = 12.6, RB = 4.0, RT = 2.3, Y0 = 0.9, TOP = Y0 + BH, HUB = [0, 15.4, 3.7], R = 13.5;
    const slope = Math.atan(((RB - RT) * Math.cos(P8)) / BH), apo = y => (RB + (RT - RB) * (y - Y0) / BH) * Math.cos(P8);
    W.kadd(k, G.foot, W.PM.stone, 0, Y0 / 2, 0, 0, P8, 0);
    W.kadd(k, G.body, G.thatch, 0, Y0 + BH / 2, 0, 0, P8, 0);
    W.kadd(k, G.band, W.M.dark, 0, TOP, 0, 0, P8, 0);
    W.kadd(k, W.KG.dome, G.thatch, 0, TOP + 0.1, 0.3, 0, 0, 0, 5.2, 5.6, 6.6);          // the cap, a long thatched hood
    W.kadd(k, W.KG.box, W.M.dark, 0, TOP + 1.0, 2.8, 0.25, 0, 0, 2.2, 1.6, 1.4);         // the breast board under the shaft
    W.ktube(k, W.M.wood, 0, TOP + 1.4, 0.8, HUB[0], HUB[1], HUB[2] - 0.2, 0.36);          // the windshaft, rising to the front
    W.kadd(k, W.KG.box, W.M.dark, HUB[0], HUB[1], HUB[2], -0.17, 0, 0, 0.95, 0.95, 0.7);
    // the tail to the ground at the back and its two struts (no winch wheel: at this size it reads as a bicycle wheel)
    W.ktube(k, W.M.wood, 0, TOP + 1.1, -2.6, 0, 0.5, -10.6, 0.2);
    for (const sx of [-1, 1]) W.ktube(k, W.M.wood, sx * 1.9, TOP - 0.6, -1.8, 0, 3.4, -9.4, 0.12);
    W.kb(k, W.M.wood, 0, 3.4, -9.4, 2.2, 0.16, 0.16);
    // the door and the windows on the front faces of the octagon
    const winAt = [[0, 7.4], [0, 10.9], [-1, 4.6]], lit = o.lit || 0, glows = [];
    W.kadd(k, W.KG.box, W.M.dark, 0, Y0 + 1.1, apo(Y0 + 1.1) + 0.02, -slope, 0, 0, 1.2, 2.2, 0.08);
    winAt.forEach(([face, y], i) => {
      const a = face * Math.PI / 4, d = apo(y) + 0.04, x = Math.sin(a) * d, z = Math.cos(a) * d, on = i < lit;
      if (!on) { W.kadd(k, W.KG.box, W.M.dark, x, y, z, -slope, a, 0, 0.7, 0.95, 0.06); return; }
      glows.push({ x, y, z, a, i });
    });
    W.kbuild(k, root);
    // windows: the lit ones on the shared atlas, or on own materials when they are to flicker
    const wins = [];
    for (const gw of glows) {
      const pane = new T.Mesh(W.PG['win' + (gw.i === 0 ? 2 : 1)], o.own ? G.paneOwn(gw.i) : W.PM.winAtlas);
      pane.position.set(gw.x, gw.y, gw.z + 0.02); pane.rotation.set(-slope, gw.a, 0, 'YXZ'); pane.scale.set(0.72, 1.0, 1); root.add(pane);
      const glow = new T.Mesh(W.PG.winGlow, o.own ? G.glowOwn(gw.i) : G.glow);
      glow.position.set(gw.x, gw.y, gw.z + 0.1); glow.rotation.copy(pane.rotation); glow.scale.set(2.6, 2.8, 1); root.add(glow);
      wins.push({ pane, glow, i: gw.i });
    }
    if (o.door) {   // the door stands ajar: a warm slit and its spill on the dyke
      const d = new T.Mesh(W.KG.plane, G.doorMat); d.position.set(0.3, Y0 + 1.0, apo(Y0 + 1.0) + 0.08); d.rotation.x = -slope; d.scale.set(0.42, 1.9, 1); root.add(d);
      const dg = new T.Mesh(W.PG.winGlow, G.glow); dg.position.set(0.3, Y0 + 1.0, apo(Y0 + 1.0) + 0.14); dg.rotation.x = -slope; dg.scale.set(2.2, 3.2, 1); root.add(dg);
      const sp = new T.Mesh(W.KG.plane, G.glow); sp.rotation.x = -Math.PI / 2; sp.position.set(0.3, 0.08, apo(Y0) + 1.0); sp.scale.set(2.2, 2.0, 1); root.add(sp);
    }
    // the sails: four stocks, the lattice on the trailing side (they are built to turn anticlockwise seen from the front)
    const tilt = new T.Group(); tilt.position.set(HUB[0], HUB[1], HUB[2] + 0.4); tilt.rotation.x = -0.17; root.add(tilt);
    const spin = new T.Group(); spin.name = 'spin'; tilt.add(spin);
    const sk = W.kit(), n = o.n || 22, r0 = 2.3, sw = 2.3, bar = o.bar || 0.11;
    for (let q = 0; q < 4; q++) {
      const a = q * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a);
      const P = (x, y) => [x * ca - y * sa, x * sa + y * ca];   // arm frame (x across, y out along the stock) to the sail plane
      const put = (mat, x, y, z, sx, sy, sz) => { const [px, py] = P(x, y); W.kb(sk, mat, px, py, z, sx, sy, sz, 0, 0, a); };
      put(W.M.wood, 0, R / 2 - 0.4, 0, 0.42, R + 0.8, 0.42);                                   // the stock
      put(W.M.wood, 0.24 + sw, (r0 + R) / 2, 0.22, bar * 1.3, R - r0, bar * 1.4);              // the outer rail
      put(W.M.wood, 0.24 + sw * 0.5, (r0 + R) / 2, 0.22, bar * 0.7, R - r0, bar * 0.7);        // the middle lath
      for (let i = 0; i < n; i++) { const y = r0 + (R - r0) * i / (n - 1); put(W.M.wood, 0.12 + sw / 2, y, 0.22, sw + 0.24, bar, bar); }
      put(W.M.wood, -0.48, (r0 + R) / 2 + 0.6, 0.12, 0.5, R - r0 - 1.2, 0.07);                // the leading board
    }
    W.kbuild(sk, spin);
    return { root, spin, wins };
  }

  C[0] = {
    hold: 8.5,
    build(W) {
      const T = W.THREE;
      W.stage({ town: 'kinderdijk', theme: 'dyke', rider: false, preroll: 650 });   // a long preroll is a deeper night: haze, sky and skylight dim together
      W.speed(0);
      W.fog(0.6);
      const G = {}, own = [];   // own: materials, textures and geometries that no prop with ownTex carries
      st = { G, own, hidden: [], mills: [], cards: [], mist: [], clouds: [], streaks: [], reeds: [] };
      // the road world lies 200 m off in the mist and its far town painted round the horizon cannot turn its mills: all of it is
      // hidden for the shot (it costs draw calls and shows nothing) and given back in dispose. Only the sky dome stays.
      const sky = m => m.isMesh && m.geometry && m.geometry.type === 'SphereGeometry' && m.geometry.parameters.radius >= 250;
      W.scene.children.forEach(m => { if ((m.isMesh || m.isGroup || m.isSprite || m.isPoints || m.isLine) && m.visible && !sky(m)) { m.visible = false; st.hidden.push(m); } });
      // geometry templates (the kit copies them) and own materials
      G.foot = new T.CylinderGeometry(4.25, 4.45, 0.9, 8); G.body = new T.CylinderGeometry(2.3, 4.0, 12.6, 8, 1); G.band = new T.CylinderGeometry(2.42, 2.42, 0.35, 8);
      own.push(G.foot, G.body, G.band);
      const tt = thatchTex(T); tt.wrapS = tt.wrapT = T.RepeatWrapping; tt.repeat.set(3, 2);
      G.thatch = W.Mat({ color: 0x2e2c29, map: tt }); own.push(G.thatch, tt);
      G.glow = W.GlowMat(W.glowTex, 0xffb466, 0.55); own.push(G.glow);
      G.doorMat = new T.MeshBasicMaterial({ color: 0xe8a458, fog: false }); own.push(G.doorMat);
      const paneOwn = [], glowOwn = [];   // the hero's windows: own materials, unfogged, so they burn through the mist and can flicker
      G.paneOwn = i => paneOwn[i] || (paneOwn[i] = new T.MeshBasicMaterial({ map: W.PM.winAtlas.map, fog: false }), own.push(paneOwn[i]), paneOwn[i]);
      G.glowOwn = i => glowOwn[i] || (glowOwn[i] = W.GlowMat(W.glowTex, 0xffb466, 0.6, false, { fog: false }), own.push(glowOwn[i]), glowOwn[i]);
      G.streak = W.GlowMat(null, 0xffb466, 0.45); own.push(G.streak);

      // ---------- the set, turned to the moon; the bank inside it ----------
      const set = st.set = W.add(new T.Group(), O[0], O[1], O[2], MOON_AZ);
      const bank = st.bank = new T.Group(); bank.position.set(BANK.x, 0, BANK.z); bank.rotation.y = BANK.yaw; set.add(bank);
      const mirror = o => { const r = o.clone(); r.scale.y = -o.scale.y; r.position.y = 2 * WY - o.position.y; o.parent.add(r); return r; };   // its reflection under the water
      // the boezem: own water over nothing, so the mirrored set below shows through its ripples
      const rt = rippleTex(T); rt.wrapS = rt.wrapT = T.RepeatWrapping; rt.repeat.set(16, 52); own.push(rt);
      G.water = new T.MeshBasicMaterial({ color: 0x2c3742, map: rt, transparent: true, opacity: 1, depthWrite: false }); own.push(G.water);
      const wg = new T.PlaneGeometry(700, 420); own.push(wg);
      const water = new T.Mesh(wg, G.water); water.rotation.x = -Math.PI / 2; water.position.set(0, WY, -170); water.renderOrder = -0.5; set.add(water);
      // the dyke: a long bank with a sloping front into the water, the polder behind it lower down
      const sh = new T.Shape(); sh.moveTo(4.4, -1.3); sh.lineTo(0, 0.6); sh.lineTo(-7, 0.6); sh.lineTo(-13, -1.3); sh.closePath();
      const dg = new T.ExtrudeGeometry(sh, { depth: 700, bevelEnabled: false }); dg.rotateY(-Math.PI / 2); dg.translate(300, 0, 0); own.push(dg);
      G.dyke = W.Mat({ color: 0x0f1411 }); own.push(G.dyke);
      const dyke = new T.Mesh(dg, G.dyke); bank.add(dyke); mirror(dyke);
      const lg = new T.PlaneGeometry(800, 460); own.push(lg);
      const land = new T.Mesh(lg, W.M.ground); land.rotation.x = -Math.PI / 2; land.position.set(0, -0.95, -242); bank.add(land);
      // the row on the dyke, all facing the same wind (toward the eye), each with its reflection
      ROW.forEach(([s, lit], i) => {
        const hero = i === HERO, M = mill(W, G, { lit, own: hero, door: hero, n: hero ? 22 : 16, bar: hero ? 0.11 : 0.15 });
        M.root.scale.setScalar(MS); M.root.position.set(s, 0.55, -4.6); M.root.rotation.y = -BANK.yaw + (i % 2 ? 0.06 : -0.04);
        bank.add(M.root);
        const r = mirror(M.root);
        st.mills.push({ M, rs: r.getObjectByName('spin'), hero, rank: Math.abs(i - HERO), ang: 0.35 + i * 0.47 });
      });
      st.hero = st.mills[HERO];
      // a second row far off across the polder, small and pale
      [[-20, -70, 0.7], [70, -95, 0.66], [150, -120, 0.66]].forEach(([s, z, sc], i) => {
        const M = mill(W, G, { lit: i === 0 ? 1 : 0, n: 10, bar: 0.22 }); M.root.scale.setScalar(sc); M.root.position.set(s, -0.9, z); M.root.rotation.y = -BANK.yaw; bank.add(M.root);
        st.mills.push({ M, rs: null, hero: false, rank: 3 + i, ang: i * 0.9 });
      });
      // trees along the polder behind the near part of the dyke, and their reflections
      const rr = seeded(7);
      for (let s = -50; s < 80; s += 9 + rr() * 12) {
        if (rr() < 0.35) continue;
        const c = W.treeCard([2]); c.position.set(s, -0.9, -42 - rr() * 30); c.scale.setScalar(0.65 + rr() * 0.3); bank.add(c);
        st.cards.push(c, mirror(c));
      }
      // reeds along the foot of the dyke, so the waterline is not a ruled line
      for (let s = -14; s < 66; s += 2.2 + rr() * 3.4) { if (rr() < 0.3) continue; const rd = W.reeds(); rd.position.set(s, WY - 0.15, 3.0 + rr() * 1.2); rd.scale.setScalar(0.75 + rr() * 0.5); bank.add(rd); st.reeds.push(rd, mirror(rd)); }
      // a lantern on the dyke by the hero's foot, its light on the path, and its reflection
      const lamp = W.lamppost(); lamp.position.set(19, 0.6, -1.2); lamp.rotation.y = -Math.PI / 2; bank.add(lamp);
      lamp.children.forEach(ch => { if (ch.isMesh && ch.geometry === W.PG.streak) ch.visible = false; });
      mirror(lamp).children.forEach(ch => { if (ch.isSprite && ch.center.y === 1) ch.visible = false; });
      // light on the water: the moon's road and the long streaks under the lit windows and the lantern
      const ptex = pathTex(T); own.push(ptex); G.streak.map = ptex;
      const pm = W.GlowMat(ptex, 0xb8c8de, 0.7); own.push(pm);
      const pg = new T.PlaneGeometry(1, 1); own.push(pg);
      st.path = new T.Mesh(pg, pm); st.path.rotation.x = -Math.PI / 2; st.path.renderOrder = -0.4; set.add(st.path);
      const lights = [[19, 4.2, -1.2, 1.0]];   // [along the dyke, height, across, strength]: the lantern
      ROW.forEach(([s, lit], i) => { if (lit) lights.push([s, (i === HERO ? 7.4 : 10.9) * MS + 0.55, -4.6 + 3.2 * MS, i === HERO ? 0.9 : 0.6]); });
      for (const [s, h, bz, k] of lights) {
        const q = new T.Mesh(pg, G.streak); q.rotation.x = -Math.PI / 2; q.renderOrder = -0.4; set.add(q);
        const p = new T.Vector3(s, 0, bz).applyAxisAngle(new T.Vector3(0, 1, 0), BANK.yaw).add(bank.position);
        st.streaks.push({ q, x: p.x, z: p.z, h, k });
      }
      // the moon: a disc and its halo, kept at the same bearing from the eye; dark cloud banks in the sky
      st.moon = W.add(new T.Sprite(new T.SpriteMaterial({ map: moonTex(T), transparent: true, depthWrite: false, fog: false })), 0, 0, 0);
      st.moon.renderOrder = -11; st.moon.userData.ownTex = true;
      const ct = cloudTex(T); own.push(ct);
      [[14, 27, 150, 1.0], [-22, 31, 190, 0.9], [-5, 11.5, 120, 0.75], [30, 22, 130, 0.8]].forEach(([az, el, w, a]) => {
        const sm = new T.SpriteMaterial({ map: ct, transparent: true, depthWrite: false, fog: false, opacity: a }); own.push(sm);
        const s = W.add(new T.Sprite(sm), 0, 0, 0); s.renderOrder = -10.8; s.scale.set(w, w * 0.2, 1); st.clouds.push({ s, az: az * DEG, el: el * DEG });
      });
      const sr = seeded(3), sp = [];
      for (let i = 0; i < 70; i++) { const a = MOON_AZ + (sr() - 0.5) * 1.6, e = (14 + sr() * 34) * DEG; if (Math.abs(a - MOON_AZ) < 0.12 && Math.abs(e - MOON_EL) < 0.12) continue; sp.push(-Math.sin(a) * Math.cos(e) * 240, Math.sin(e) * 240, -Math.cos(a) * Math.cos(e) * 240); }
      const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3)); own.push(sg);
      st.stars = W.add(new T.Points(sg, new T.PointsMaterial({ color: 0xc8d2e0, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.5, depthWrite: false, fog: false })), 0, 0, 0);
      st.stars.renderOrder = -10.9; st.stars.userData.ownTex = true;
      st.halo = W.add(new T.Sprite(new T.SpriteMaterial({ map: haloTex(T), color: 0x9fb2cc, transparent: true, depthWrite: false, fog: false, blending: T.AdditiveBlending, opacity: 0.5 })), 0, 0, 0);
      st.halo.renderOrder = -10.5; st.halo.userData.ownTex = true;
      // mist: long low banks along the foot of the dyke and out over the water, thin now, thick at the end, drifting along the bank
      const mt = mistTex(T); own.push(mt);
      const mr = seeded(11);
      for (let i = 0; i < 14; i++) {
        const sm = new T.SpriteMaterial({ map: mt, transparent: true, depthWrite: false, fog: false, opacity: 0 }); own.push(sm);
        const s = new T.Sprite(sm), w = 22 + mr() * 30; s.scale.set(w, w * 0.11, 1);
        s.position.set(-20 + mr() * 180, WY + w * 0.02, 3.8 + mr() * 5); s.userData.vx = -(0.4 + mr() * 0.6); s.userData.k = 0.6 + mr() * 0.4; s.userData.t0 = mr() * 3; bank.add(s); st.mist.push(s);
      }
      this.update(W, 0, 0);
    },
    update(W, t, dt) {
      if (!st) return;
      // the mist comes in: thin at the start, thick by the end, still thickening if the panel stays up
      const fk = W.smooth(W.clamp(t / 8.5, 0, 1)), fog = 0.6 + 0.9 * fk + 0.03 * Math.max(0, t - 8.5);
      W.fog(fog);
      st.G.water.color.copy(W.M.water.color).multiplyScalar(0.7);
      // sails: the right way at first; the hero slows, stops and turns the wrong way, the others follow down the row
      for (const m of st.mills) {
        const d = m.hero ? 0 : 0.5 + 0.45 * m.rank, t1 = 4.5 + d, t2 = t1 + 0.9, t3 = t2 + 0.5, t4 = t3 + 1.3, w0 = 0.42, w1 = -0.62;
        let w = w0;
        if (t >= t1 && t < t2) w = w0 * (1 - W.smooth((t - t1) / (t2 - t1)));
        else if (t >= t2 && t < t3) w = 0;
        else if (t >= t3) w = w1 * W.smooth(W.clamp((t - t3) / (t4 - t3), 0, 1));
        m.ang += w * dt;
        const shake = t > t2 - 0.15 && t < t3 + 0.1 ? 0.011 * Math.sin((t - t2) * 47) * Math.sin(Math.PI * W.clamp((t - t2 + 0.15) / (t3 - t2 + 0.25), 0, 1)) : 0;   // the sails strain against the brake
        m.M.spin.rotation.z = m.ang + shake; if (m.rs) m.rs.rotation.z = m.ang + shake;
      }
      // the hero's lit windows flicker as its sails stop
      for (const wn of st.hero.M.wins) {
        let f = 1;
        if (t > 5.1 && t < 6.7) { const u = (t - 5.1) * 9 + wn.i * 3.1; f = 0.25 + 0.75 * Math.max(0, Math.sin(u * 1.7) * Math.sin(u * 0.63 + 1)); }
        wn.pane.material.color.setScalar(0.3 + 0.7 * f); wn.glow.material.opacity = 0.6 * f;
      }
      // camera, in the set's frame: [eye x, y, z, look azimuth (plus is left of the moon), look elevation, fov,
      // lowest and highest elevation that must show]
      let c;
      if (t < CUT) {   // beat 1: low over the water, sliding right along the row
        const k = 0.7 * W.smooth(t / CUT) + 0.3 * (t / CUT);
        c = [W.lerp(-3, 2.5, k), W.lerp(0.15, 0.3, k), 8, 0, 8.5, 50, -0.5, 19.5];
      } else {         // beat 2: closer on the hero, the moon at its shoulder; a slow push in that never quite stops
        const s = t - CUT, k = W.smooth(W.clamp(s / 5, 0, 1)) + 0.015 * Math.max(0, s - 5);
        c = [W.lerp(5.1, 4.5, k), W.lerp(0.2, 0.25, k), W.lerp(-5.9, -10.4, k), 3, 7.5, 44, 0.5, 23.5];
      }
      // the picture is the band between the top bar and the captions; on a short band (a phone on its side) widen the view and lift
      // it until the moon and the hub are in, rather than lose them off the top
      const box = document.querySelector('#intro .box'), H = innerHeight, f = W.clamp(((box ? box.getBoundingClientRect().top : H * 0.75) - H * 0.09) / H, 0.15, 1);
      const need = (c[7] - c[6]) / 2 * DEG; let half = Math.atan(f * Math.tan(c[5] / 2 * DEG));
      if (half < need) { c[5] = Math.min(64, 2 * Math.atan(Math.tan(need) / f) / DEG); half = Math.atan(f * Math.tan(c[5] / 2 * DEG)); }
      const hd = half / DEG; c[4] = 2 * hd >= c[7] - c[6] ? W.clamp(c[4], c[7] - hd, c[6] + hd) : c[7] - hd;
      const az = c[3] * DEG, el = c[4] * DEG, lx = c[0] - 40 * Math.sin(az) * Math.cos(el), ly = c[1] + 40 * Math.sin(el), lz = c[2] - 40 * Math.cos(az) * Math.cos(el);
      W.cam(wx(c[0], c[2]), c[1], wz(c[0], c[2]), wx(lx, lz), ly, wz(lx, lz), c[5]);
      W.drift(t, 0.5);
      // the moon, its halo and the clouds stay at their bearings from the eye; the mist veils the moon as it thickens
      const p = W.camera.position, D = 250, mr = 1.35 * DEG;
      const at = (o, az2, el2, d) => o.position.set(p.x - Math.sin(az2) * Math.cos(el2) * d, p.y + Math.sin(el2) * d, p.z - Math.cos(az2) * Math.cos(el2) * d);
      st.stars.position.copy(p); st.stars.material.opacity = 0.55 * (1 - W.clamp(fk * 1.6, 0, 1));
      at(st.moon, MOON_AZ, MOON_EL, D); st.moon.scale.setScalar(2 * D * Math.tan(mr)); st.moon.material.opacity = 1 - 0.3 * fk;
      st.halo.position.copy(st.moon.position); st.halo.scale.setScalar(2 * D * Math.tan(mr * (9 + 5 * fk))); st.halo.material.opacity = 0.36 + 0.16 * fk;
      for (const cl of st.clouds) { at(cl.s, MOON_AZ + cl.az - 0.004 * t, cl.el, 230); cl.s.material.color.copy(W.scene.fog.color).multiplyScalar(0.55); }
      // light on the water: the moon's road under the moon, the streaks from each light toward the eye
      st.path.position.set(c[0], WY + 0.02, c[2] - 34); st.path.scale.set(4.2, 64, 1); st.path.material.opacity = 1.0 - 0.45 * fk;
      for (const s of st.streaks) {
        const dx = c[0] - s.x, dz = c[2] - s.z, L = Math.hypot(dx, dz), len = Math.min(L - 2, 4 + s.h * 2.2);
        s.q.position.set(s.x + dx / L * (len / 2 + 2.5), WY + 0.03, s.z + dz / L * (len / 2 + 2.5)); s.q.rotation.set(-Math.PI / 2, Math.atan2(dx, dz), 0, 'YXZ'); s.q.scale.set(s.k, len, 1);
      }
      // the mist banks drift in from the right and thicken
      for (const s of st.mist) { s.position.x += s.userData.vx * dt; s.material.opacity = W.clamp(0.1 + 0.45 * fk + 0.06 * Math.sin(t * 0.7 + s.userData.t0 * 2), 0, 0.6) * s.userData.k; s.material.color.copy(W.scene.fog.color).multiplyScalar(1.45); }
      // tree cards and reeds turn to the eye (in their own frames)
      const bx = (c[0] - BANK.x) * Math.cos(BANK.yaw) - (c[2] - BANK.z) * Math.sin(BANK.yaw), bz = (c[0] - BANK.x) * Math.sin(BANK.yaw) + (c[2] - BANK.z) * Math.cos(BANK.yaw);
      for (const cd of st.cards) cd.rotation.y = Math.atan2(bx - cd.position.x, bz - cd.position.z);
      for (const rd of st.reeds) rd.rotation.y = Math.atan2(bx - rd.position.x, bz - rd.position.z);
    },
    dispose(W) {
      if (!st) return;
      for (const m of st.hidden) m.visible = true;
      if (st.set) st.set.traverse(m => { if (m.geometry && m.geometry.userData.kit) st.own.push(m.geometry); });
      for (const o of new Set(st.own)) if (o && o.dispose) o.dispose();
      st = null;
    },
  };
})();