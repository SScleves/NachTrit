// Amsterdam (tier 13, levels 123 to 130), the finale and the brightest town in the game. The street levels ride a canal quay:
// tall narrow canal houses lean forward over the pavement with stepped, neck and bell gables and a hoist beam at the top, front
// doors up a stoop; across the black water humpback bridges outlined in warm bulbs stand one behind the other like the
// Reguliersgracht, every bulb and window doubled in the canal; houseboats with lit windows, elms, Amsterdammertjes and bikes on
// every railing, and the Westertoren's blue imperial crown over the far roofs. Level 129 (De Wallen) turns the ground floors red
// round the Oude Kerk; 130 (De grachten) brings in the Magere Brug and the first grey of dawn. The shops are a market street with
// tram rails and wires, the square is the Dam and the Stationsplein, the dyke is the Amstel.
(function () {
  'use strict';
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  const PI = Math.PI, rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];

  // which level is being built: the shots pass ?level=, the game names the level on the mission card before the ride
  function levelNow() {
    try {
      const q = new URLSearchParams(location.search);
      if (q.has('level')) return +q.get('level') || 0;
      const el = document.getElementById('m_name'), nm = el ? el.textContent.trim() : '';
      const lv = nm && (window.LEVELS || []).find(l => l.town === 'amsterdam' && l.name === nm);
      return lv ? lv.id : 0;
    } catch (e) { return 0; }
  }
  const isWallen = () => levelNow() === 129, isFinale = () => levelNow() === 130;

  // ---------- made once: textures, materials, the sign sheet ----------
  let R = null;
  function dimFog(m, key) {   // additive points fade to black in the haze, as the game's glows do, instead of turning into haze
    m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <fog_fragment>', '#ifdef FOG_EXP2\n  gl_FragColor.rgb *= 1.0 - 0.85 * (1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth ));\n#endif'); };
    m.customProgramCacheKey = () => 'amsPts' + key; m.userData.shared = true; return m;
  }
  const SHOP = ['KAASHANDEL', 'BLOEMEN', 'STROOPWAFELS', 'PATAT', 'HARING', 'FIETSEN', 'DROGISTERIJ', 'BRUIN CAFÉ', 'TULPENBOLLEN', 'BOEKHANDEL'];
  const NEON = ['NIET FOTOGRAFEREN', 'KAMER VRIJ', 'BAR', 'HOTEL', 'OPEN', 'CAFÉ'];
  function res(K) {
    if (R) return R;
    const THREE = K.THREE, Mat = K.Mat, sh = m => { m.userData.shared = true; return m; };
    const cv = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return c; };
    const ctex = (c, srgb) => { const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; };
    // a halo on the left half and a broken reflection streak on the right half: the layout PG.winGlow and PG.winStreak read
    const glowT = ctex(cv(256, 128, g => {
      const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,.95)'); r.addColorStop(0.28, 'rgba(255,255,255,.45)'); r.addColorStop(0.62, 'rgba(255,255,255,.1)'); r.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = r; g.fillRect(0, 0, 128, 128);
      for (let y = 0; y < 128; y++) {
        const t = y / 127, fade = Math.pow(Math.sin(t * PI), 1.2), rip = Math.abs(Math.sin(y * 0.61) * Math.sin(y * 0.17 + 1.3)), a = fade * (0.35 + 0.65 * rip);
        const w = 22 + 18 * Math.abs(Math.sin(y * 0.29)), x = 192 + 4 * Math.sin(y * 0.4), gr = g.createLinearGradient(x - w, 0, x + w, 0);
        gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${a.toFixed(3)})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr; g.fillRect(x - w, y, w * 2, 1);
      }
    }));
    // a bulb: a hot white core in a warm halo, for the points that outline the bridges
    const bulbT = ctex(cv(64, 64, g => {
      const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.22, 'rgba(255,255,255,0.95)'); r.addColorStop(0.4, 'rgba(255,255,255,0.35)'); r.addColorStop(0.7, 'rgba(255,255,255,0.08)'); r.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = r; g.fillRect(0, 0, 64, 64);
    }));
    // De Wallen: a window lit red, velvet curtains drawn to the sides, a bar stool and a little lamp, a neon tube round the frame
    const redT = ctex(cv(128, 192, (g, w, h) => {
      const bg = g.createRadialGradient(64, 76, 4, 64, 96, 124); bg.addColorStop(0, '#ff9aa8'); bg.addColorStop(0.35, '#e8283e'); bg.addColorStop(1, '#4a0610');
      g.fillStyle = bg; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(60,0,8,0.6)'; g.fillRect(42, 122, 46, 8); g.fillRect(48, 130, 6, 52); g.fillRect(76, 130, 6, 52);
      g.fillStyle = 'rgba(255,226,232,0.85)'; g.beginPath(); g.ellipse(98, 46, 9, 13, 0, 0, 7); g.fill();
      for (const s of [0, 1]) { g.save(); if (s) { g.translate(w, 0); g.scale(-1, 1); } const cg = g.createLinearGradient(0, 0, 36, 0); cg.addColorStop(0, '#300206'); cg.addColorStop(1, '#8a0e1c'); g.fillStyle = cg; g.beginPath(); g.moveTo(0, 0); g.lineTo(36, 0); g.quadraticCurveTo(20, 96, 30, h); g.lineTo(0, h); g.fill(); g.restore(); }
      g.strokeStyle = '#ffd6de'; g.lineWidth = 5; g.strokeRect(3, 3, w - 6, h - 6);
    }), true);
    // the sign sheet: ten shop boards, then six neon words for De Wallen, one row each
    const signT = ctex(cv(1024, 1024, g => {
      g.textAlign = 'center'; g.textBaseline = 'middle';
      SHOP.forEach((s, i) => { const y = i * 64; g.fillStyle = '#1d1916'; g.fillRect(0, y, 1024, 64); g.strokeStyle = '#6e5538'; g.lineWidth = 4; g.strokeRect(4, y + 4, 1016, 56); g.fillStyle = '#ecdcb6'; g.font = 'bold 44px "Segoe UI", system-ui, sans-serif'; g.fillText(s, 512, y + 34); });
      NEON.forEach((s, i) => { const y = (i + 10) * 64; g.fillStyle = '#070508'; g.fillRect(0, y, 1024, 64); g.font = 'bold 46px "Segoe UI", system-ui, sans-serif'; g.shadowColor = i % 2 ? '#ff5ad0' : '#ff2a4a'; g.shadowBlur = 18; g.fillStyle = i % 2 ? '#ff7ad8' : '#ff4a62'; g.fillText(s, 512, y + 34); g.fillText(s, 512, y + 34); g.shadowBlur = 0; g.fillStyle = 'rgba(255,230,240,0.55)'; g.fillText(s, 512, y + 34); });
    }), true);
    const stripes = (a, b) => ctex(cv(64, 64, g => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? b : a; g.fillRect(i * 8, 0, 8, 64); } g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 54, 64, 10); }), true);
    const quad = (u0, v0, u1, v1) => { const p = new THREE.PlaneGeometry(1, 1), uv = p.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, u0 + uv.getX(j) * (u1 - u0), v0 + uv.getY(j) * (v1 - v0)); return p; };
    for (let i = 0; i < 16; i++) K.PG['ams_sign' + i] = quad(0, 1 - (i + 1) / 16, 1, 1 - i / 16);   // kept in PG: the street cleanup leaves them
    const pts = (color, size, key) => dimFog(new THREE.PointsMaterial({ color, size, map: bulbT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }), key);
    R = {
      glow: sh(K.GlowMat(glowT, 0xffb466, 0.55)), bulb: sh(K.GlowMat(glowT, 0xffc27e, 0.8)), bulbW: sh(K.GlowMat(glowT, 0xfff0dc, 0.75)), red: sh(K.GlowMat(glowT, 0xff2a48, 0.85)),
      frame: sh(Mat({ color: 0xcfc8b8 })), plaster: sh(Mat({ color: 0x8c867c })), door: sh(Mat({ color: 0x1a2a23 })), iron: sh(Mat({ color: 0x1b211e })),
      paal: sh(Mat({ color: 0x5e2019 }, 0x7a5a64)), sand: sh(Mat({ color: 0x8a8276 })), white: sh(Mat({ color: 0xd9d6cc })), lead: sh(Mat({ color: 0x2c3137 })),
      tower: sh(Mat({ color: 0x6a3c2c, emissive: 0x3a1a0e, emissiveIntensity: 0.55 }, 0x7a5a64)), stoneLit: sh(Mat({ color: 0x9a9080, emissive: 0x2e2416, emissiveIntensity: 0.5 })),
      crown: sh(new THREE.MeshBasicMaterial({ color: 0x2f5ad6 })), gold: sh(new THREE.MeshBasicMaterial({ color: 0xe2b452 })), clock: sh(new THREE.MeshBasicMaterial({ color: 0xf2e2bc })),
      redWin: sh(new THREE.MeshBasicMaterial({ map: redT })), neon: sh(new THREE.MeshBasicMaterial({ color: 0xff3a5c })), signs: sh(new THREE.MeshBasicMaterial({ map: signT, color: 0xf2e6cc })),
      cabins: [0x22302a, 0x2a2f3c, 0x3c2c22, 0x1d1d22, 0x34302a].map(c => sh(Mat({ color: c }))),
      awnings: [stripes('#7a2a24', '#c8beac'), stripes('#2c4a36', '#c8beac'), stripes('#2a3a5a', '#c8beac')].map(t => sh(Mat({ map: t, side: THREE.DoubleSide }))),
      kase: sh(Mat({ color: 0x2c4a5e })), coat: sh(Mat({ color: 0x1b1d24 })), scarf: sh(Mat({ color: 0x7a2a20 })), umbrella: sh(Mat({ color: 0x9a3a1e })),
      crownGlow: sh(K.GlowMat(K.glowTex, 0x90a8ff, 0.55, true)),
      pts: pts(0xffc77a, 0.85, 'w'), ptsW: pts(0xfff2e2, 0.7, 'l'), ptsR: pts(0xff5a78, 0.8, 'r'),
    };
    return R;
  }
  // the kit's base for the next parts: at (x, y, z), turned ry about the vertical, then leaned rz about its own z (forward over the street)
  let _q = null, _e, _p, _s;
  function at(K, k, x, y, z, ry, rz, rx) {
    if (!_q) { const THREE = K.THREE; _q = new THREE.Quaternion(); _e = new THREE.Euler(); _p = new THREE.Vector3(); _s = new THREE.Vector3(1, 1, 1); }
    _e.set(rx || 0, ry || 0, rz || 0, 'YXZ'); _q.setFromEuler(_e); _p.set(x, y, z); k.base.compose(_p, _q, _s);
  }
  // an omafiets along local z, front at -z, standing at (x, y, z), turned ry and leaned rz; one material, so a rack of them is one draw call
  function bike(K, k, m, x, y, z, ry, rz) {
    at(K, k, x, y, z, ry, rz);
    const R0 = 0.33, bz = 0.55, fz = -0.55, hz = -0.4, bb = [0, 0.3, 0.08], { kadd, ktube, kb, KG } = K;
    kadd(k, KG.wheel, m, 0, R0, bz); kadd(k, KG.wheel, m, 0, R0, fz);
    ktube(k, m, 0, R0, bz, ...bb, 0.018); ktube(k, m, 0, R0, bz, 0, 0.84, 0.22, 0.016); ktube(k, m, ...bb, 0, 0.84, 0.22, 0.02);
    ktube(k, m, ...bb, 0, 0.62, hz, 0.024); ktube(k, m, 0, 0.6, hz, 0, 0.98, hz + 0.08, 0.022); ktube(k, m, 0, 0.62, hz, 0, R0, fz, 0.016);
    kb(k, m, 0, 1.0, hz + 0.12, 0.52, 0.03, 0.03); kb(k, m, 0, 0.9, 0.24, 0.12, 0.05, 0.24); kb(k, m, 0, 0.7, bz - 0.04, 0.16, 0.025, 0.42);
  }

  // ---------- canal houses ----------
  const BRICK = [0x3b2620, 0x4c2a20, 0x2c2422, 0x573a2b, 0x40302a, 0x4a3530, 0x33282a];
  const FLOOR = [[3.0, 2.2], [6.15, 2.05], [9.05, 1.85], [11.75, 1.6], [14.2, 1.4]];   // window centre and height per floor, the raised ground floor first
  const TOP = [4.6, 7.65, 10.45, 13.05, 15.45];
  const GABLES = ['step', 'step', 'neck', 'neck', 'bell', 'bell', 'cornice', 'spout'];
  // the outline above the facade: u across the front, v up; caps are the white stone copings [u0, u1, v]
  function gableShape(type, hw, g) {
    const P = [[-hw, -0.25], [hw, -0.25]], caps = [];
    const mirror = Rt => { P.push(...Rt); P.push(...Rt.slice(0, -1).reverse().map(([u, v]) => [-u, v])); };
    if (type === 'step') {
      const n = g > 3.5 ? 4 : 3, tw = hw * 0.34, xs = i => hw - (hw - tw) * i / n, hs = i => g * i / n;
      for (let i = 0; i < n; i++) { P.push([xs(i), hs(i + 1)]); if (i < n - 1) { P.push([xs(i + 1), hs(i + 1)]); caps.push([xs(i + 1), xs(i), hs(i + 1)], [-xs(i), -xs(i + 1), hs(i + 1)]); } }
      for (let i = n - 1; i >= 0; i--) { if (i < n - 1) P.push([-xs(i + 1), hs(i + 1)]); P.push([-xs(i), hs(i + 1)]); }
      caps.push([-xs(n - 1), xs(n - 1), g]);
    } else if (type === 'neck') {
      const s = g * 0.34, nw = hw * 0.44;
      mirror([[hw, s], [hw * 0.74, s + 0.12], [nw + 0.12, s + 0.5], [nw, s + 0.78], [nw, g * 0.84], [nw + 0.16, g * 0.84], [nw + 0.16, g * 0.88], [0, g]]);
      caps.push([-nw - 0.16, nw + 0.16, g * 0.88], [nw + 0.05, hw, s + 0.02], [-hw, -nw - 0.05, s + 0.02]);
    } else if (type === 'bell') {
      const s = g * 0.22, tw = hw * 0.36, Rt = [];
      for (let i = 0; i <= 6; i++) { const t = i / 6; Rt.push([tw + (hw - tw) * Math.pow(1 - t, 1.7), s + (g * 0.8 - s) * Math.sin(t * PI / 2)]); }
      Rt.push([tw + 0.14, g * 0.8], [tw + 0.14, g * 0.85]);
      for (let i = 1; i < 6; i++) { const a = i / 6 * PI / 2; Rt.push([(tw + 0.14) * Math.cos(a), g * 0.85 + g * 0.15 * Math.sin(a)]); }
      Rt.push([0, g]); mirror(Rt); caps.push([-tw - 0.14, tw + 0.14, g * 0.85]);
    } else if (type === 'spout') { P.push([hw, g * 0.12], [hw * 0.2, g], [-hw * 0.2, g], [-hw, g * 0.12]); caps.push([-hw * 0.2, hw * 0.2, g]); }
    else P.push([hw, 0.4], [-hw, 0.4]);
    return { P, caps };
  }
  // a sash window on the leaning front: a white frame, the pane from the game's atlas, its glow when lit
  function win(K, k, z, y, w, h, o, x0) {
    const r = res(K), x = x0 || 0, lit = Math.random() < (o.lit == null ? 0.35 : o.lit), cell = lit ? pick([0, 0, 1, 2]) : Math.random() < 0.22 ? 3 : pick([4, 4, 5]);
    K.kadd(k, K.KG.plane, r.frame, x - 0.02, y, z, 0, -PI / 2, 0, w + 0.18, h + 0.2);
    K.kadd(k, K.PG['win' + cell], K.PM.winAtlas, x - 0.035, y, z, 0, -PI / 2, 0, w, h);
    if (lit) K.kadd(k, K.PG.winGlow, r.glow, x - 0.09, y, z, 0, -PI / 2, 0, w * 2.4, h * 1.7);
    return lit;
  }
  // one canal house in the row's kit: its front on x = x0 facing the street (-x), centred on zc, f wide, leaning forward by o.lean
  function pand(K, k, x0, zc, f, o) {
    const r = res(K), { kb, kadd, ktube, KG, PG, PM, THREE } = K;
    const nf = o.nf, H = TOP[nf - 1] + 0.3, D = o.far ? 7 : 9, type = o.gable, hw = f / 2;
    const mat = (type === 'cornice' && !o.far && Math.random() < 0.5) ? r.plaster : o.mat;
    at(K, k, x0, 0, zc, 0, o.lean, o.tilt);
    kb(k, mat, D / 2, (H - 1.7) / 2, 0, D, H + 1.7, f - 0.03);   // from 1.7 below the street: lowered water and land never show under it
    // the gable, as thick as a wall, hides a steep roof whose ridge runs back from the street
    const g = type === 'cornice' ? 0.4 : rnd(2.9, 4.3), gs = gableShape(type, hw, g), shp = new THREE.Shape();
    gs.P.forEach(([u, v], i) => i ? shp.lineTo(u, v) : shp.moveTo(u, v));
    const geo = new THREE.ExtrudeGeometry(shp, { depth: 0.34, bevelEnabled: false, curveSegments: 3 }); kadd(k, geo, mat, 0.32, H, 0, 0, -PI / 2, 0); geo.dispose();
    for (const [u0, u1, v] of gs.caps) kb(k, r.frame, 0.15, H + v + 0.05, (u0 + u1) / 2, 0.44, 0.1, u1 - u0 + 0.06);
    const rh = type === 'cornice' ? f * 0.24 : Math.min(g - 0.45, f * 0.5), run = hw + 0.12, sl = Math.hypot(run, rh), sa = Math.atan2(rh, run), rx0 = type === 'cornice' ? 1.0 : 0.25;
    for (const s of [-1, 1]) kb(k, PM.roof, (D + rx0) / 2, H + rh / 2, s * run / 2, D - rx0, 0.1, sl, s * sa, 0, 0);
    if (type === 'cornice') {
      const tri = new THREE.Shape(); tri.moveTo(-run, 0); tri.lineTo(run, 0); tri.lineTo(0, rh); tri.closePath();
      const tg = new THREE.ShapeGeometry(tri); kadd(k, tg, PM.roof, rx0, H, 0, 0, -PI / 2, 0); tg.dispose();
      kb(k, r.frame, -0.2, H + 0.25, 0, 0.5, 0.45, f + 0.1);   // the white cornice
      kb(k, PM.pole, -0.5, H - 0.42, 0, 1.1, 0.16, 0.16); ktube(k, PM.pole, -1.0, H - 0.5, 0, -1.0, H - 1.0, 0, 0.02);   // the hoist beam under it
    } else {
      const yb = H + g * 0.74;
      kb(k, PM.pole, -0.45, yb, 0, 1.2, 0.17, 0.17); ktube(k, PM.pole, -0.98, yb - 0.08, 0, -0.98, yb - 0.62, 0, 0.022); kb(k, PM.pole, -0.98, yb - 0.68, 0, 0.05, 0.14, 0.1);
      const yd = H + g * 0.36;
      if (type === 'spout' || Math.random() < 0.5) { kadd(k, KG.plane, r.frame, -0.05, yd, 0, 0, -PI / 2, 0, 1.0, 1.5); kadd(k, KG.plane, o.far ? PM.pole : r.door, -0.06, yd, 0, 0, -PI / 2, 0, 0.82, 1.32); }
      else win(K, k, 0, yd, 0.7, 0.95, o, -0.03);
    }
    // windows in bays, tall at the bottom and smaller toward the top
    const nb = f < 4.3 ? 2 : 3, bw = f / nb, ww = Math.min(1.2, bw * 0.58), door = o.stoop ? (Math.random() < 0.5 ? 0 : nb - 1) : -1, low = [];
    for (let fl = (o.shop || o.red) ? 1 : 0; fl < nf; fl++) {
      const [y, wh] = FLOOR[fl];
      for (let b = 0; b < nb; b++) { if (fl === 0 && b === door) continue; const z = -hw + bw * (b + 0.5); if (win(K, k, z, y, ww, wh, o) && (fl < 2 || o.far)) low.push([z, y, ww]); }
    }
    if (!o.far && !o.shop && !o.red) for (let b = 0; b < nb; b++) if (b !== door) kadd(k, PG.cellar4, PM.winAtlas, -0.02, 0.62, -hw + bw * (b + 0.5), 0, -PI / 2, 0, ww * 0.85, 0.62);
    let zd = 0;
    if (door >= 0) {   // the front door up the stoop: white frame, fanlight, a lamp beside it
      zd = -hw + bw * (door + 0.5);
      kadd(k, KG.plane, r.frame, -0.02, 2.65, zd, 0, -PI / 2, 0, 1.3, 3.0); kadd(k, KG.plane, r.door, -0.035, 2.45, zd, 0, -PI / 2, 0, 1.0, 2.45);
      kadd(k, PG.fan0, PM.winAtlas, -0.035, 3.92, zd, 0, -PI / 2, 0, 0.98, 0.42);
      if (Math.random() < 0.6) kadd(k, PG.winGlow, r.glow, -0.12, 3.0, zd + (door ? -0.95 : 0.95), 0, -PI / 2, 0, 0.8, 0.8);
    }
    const red = [];
    if (o.shop) {   // a shop at street level: the window, the door, the board above
      kadd(k, KG.plane, r.frame, -0.02, 1.55, -0.45, 0, -PI / 2, 0, f - 1.15, 2.75);
      kadd(k, PG[Math.random() < 0.45 ? 'shop1' : 'shop0'], PM.winAtlas, -0.04, 1.5, -0.45, 0, -PI / 2, 0, f - 1.4, 2.3);
      kadd(k, PG.winGlow, r.glow, -0.1, 1.5, -0.45, 0, -PI / 2, 0, (f - 1.4) * 1.25, 3.0);
      kadd(k, KG.plane, r.door, -0.03, 1.2, hw - 0.55, 0, -PI / 2, 0, 0.8, 2.3);
      kadd(k, K.PG['ams_sign' + Math.floor(Math.random() * SHOP.length)], r.signs, -0.06, 3.3, 0, 0, -PI / 2, 0, Math.min(f - 0.5, 4.4), 0.56);
      low.push([-0.45, 1.5, f - 1.4]);
    }
    if (o.red) {   // De Wallen: the ground floor windows lit red, a neon tube round each, now and then a neon word over the door
      const n = f > 4.6 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const z = n === 1 ? -0.5 : (i ? 0.45 : -1.45);
        kadd(k, KG.plane, r.redWin, -0.04, 1.45, z, 0, -PI / 2, 0, 1.25, 2.2);
        for (const yy of [0.32, 2.58]) kb(k, r.neon, -0.07, yy, z, 0.05, 0.05, 1.37);
        for (const zz of [-0.66, 0.66]) kb(k, r.neon, -0.07, 1.45, z + zz, 0.05, 2.3, 0.05);
        kadd(k, PG.winGlow, r.red, -0.14, 1.45, z, 0, -PI / 2, 0, 3.4, 3.6); red.push(z);
      }
      kadd(k, KG.plane, r.door, -0.03, 1.2, hw - 0.55, 0, -PI / 2, 0, 0.8, 2.3);
      if (Math.random() < 0.45) kadd(k, K.PG['ams_sign' + (10 + Math.floor(Math.random() * NEON.length))], r.signs, -0.08, 3.25, -0.4, 0, -PI / 2, 0, Math.min(f - 0.6, 3.6), 0.5);
    }
    // upright again for what stands on the ground: the stoop, the light of the windows on the wet pavement or in the canal
    at(K, k, x0, 0, zc, 0, 0);
    if (door >= 0) {
      for (let i = 0; i < 4; i++) { const L = 1.0 + (3 - i) * 0.24; kb(k, PM.stone, -L / 2, (i + 1) * 0.15, zd, L, (i + 1) * 0.3, 1.25); }
      for (const s of [-1, 1]) { ktube(k, PM.pole, -1.72, 0.95, zd + s * 0.64, -0.1, 2.15, zd + s * 0.64, 0.025); for (const xx of [-1.6, -0.9, -0.25]) { const yt = 0.95 + (xx + 1.72) * 0.74; kb(k, PM.pole, xx, yt - 0.45, zd + s * 0.64, 0.03, 0.9, 0.03); } }
    }
    for (const [z, y, w] of low) {
      if (o.far) { const L = 2.2 + 0.5 * (y + 1); kadd(k, PG.winStreak, r.glow, -3.25 - L / 2, -0.97, z, -PI / 2, 0, PI / 2, w * 0.9, L); }
      else if (y < 4) kadd(k, PG.winStreak, r.glow, -1.1, 0.075, z, -PI / 2, 0, 0, w * 0.8, 3.4);
    }
    for (const z of red) kadd(k, PG.winStreak, r.red, o.far ? -6.0 : -1.3, o.far ? -0.97 : 0.075, z, -PI / 2, 0, o.far ? PI / 2 : 0, 1.2, o.far ? 5.6 : 4.4);
  }
  // a row of canal houses wall to wall, len long, so the rows join up along the quay. dx moves the fronts toward the street inside
  // the object, so the pavement furniture keeps clear of it in the game's spacing. far: the lower row across the water with its quay
  function row(K, o) {
    const r = res(K), k = K.kit(), g = new K.THREE.Group(), len = o.len, dx = o.dx || 0, pal = [K.brickMat(pick(BRICK)), K.brickMat(pick(BRICK))];
    const ws = []; let sum = 0; for (let i = 0; i < o.n; i++) { const w = rnd(0.75, 1.3); ws.push(w); sum += w; }
    let z = -len / 2;
    ws.forEach((w0, i) => {
      const f = w0 * len / sum, nf = pick(o.far ? [3, 4, 4] : (o.floors || [3, 4, 4, 5]));
      const lean = rnd(0.02, 0.05) * (Math.random() < 0.2 ? 1.5 : 1), tilt = Math.random() < 0.3 ? rnd(-0.022, 0.022) : 0;
      pand(K, k, dx, z + f / 2, f, { mat: pal[i % 2], nf, gable: pick(GABLES), lean, tilt, lit: o.lit, far: o.far, stoop: !o.far && !o.shop && !o.red,
        shop: !!o.shop && Math.random() < o.shop, red: !!o.red && Math.random() < 0.8 });
      z += f;
    });
    at(K, k, 0, 0, 0, 0, 0);
    if (o.far) {   // the far quay: its wall into the black water, the pavement, two lanterns and their light in the canal
      K.kb(k, pal[0], dx - 3.0, -0.66, 0, 0.36, 1.3, len); K.kb(k, K.PM.stone, dx - 1.55, -0.03, 0, 3.3, 0.1, len);
      for (const lz of [-len / 4, len / 4]) {
        K.kb(k, K.PM.pole, dx - 2.7, 1.8, lz, 0.1, 3.6, 0.1); K.kadd(k, K.PG.winGlow, r.glow, dx - 2.76, 3.7, lz, 0, -PI / 2, 0, 1.5, 1.5);
        K.kadd(k, K.PG.winStreak, r.glow, dx - 6.8, -0.97, lz, -PI / 2, 0, PI / 2, 0.7, 7.0);
      }
    }
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }

  // ---------- bridges outlined in bulbs, and their light doubled in the canal ----------
  const BL = 23.7, BW = 7.2, WY = -1.0, SPRING = WY + 0.15;   // across the canal from the road's quay to the far one; the water 1 m below the street
  const TYPES = { drie: { hump: 1.5, arches: [[BL / 2, 8.6, 1.85], [BL / 2 - 7.3, 4.2, 1.25], [BL / 2 + 7.3, 4.2, 1.25]] }, een: { hump: 1.6, arches: [[BL / 2, 12, 1.9]] } };
  const deckY = (x, hump) => 0.06 + hump * Math.sin(PI * Math.min(1, Math.max(0, x / BL)));
  const BRP = {};
  function bridgeParts(K, type) {   // the brick body with its arches and the bulbs, made once per kind; the geometries are kept in PG
    const key = 'ams_br_' + type; if (K.PG[key + 'b'] && BRP[type]) return [K.PG[key + 'b'], K.PG[key + 'p'], BRP[type]];
    const THREE = K.THREE, A = TYPES[type], sh = new THREE.Shape();
    sh.moveTo(-0.4, WY - 0.8); sh.lineTo(BL + 0.4, WY - 0.8); sh.lineTo(BL + 0.4, deckY(BL, A.hump) - 0.04);
    for (let i = 24; i >= 0; i--) { const x = BL * i / 24; sh.lineTo(x, deckY(x, A.hump) - 0.04); }
    sh.lineTo(-0.4, deckY(0, A.hump) - 0.04);
    for (const [cx, s, rise] of A.arches) {
      const h = new THREE.Path(); h.moveTo(cx - s / 2, WY - 0.7); h.lineTo(cx - s / 2, SPRING);
      for (let j = 1; j < 16; j++) { const a = PI - PI * j / 16; h.lineTo(cx + s / 2 * Math.cos(a), SPRING + rise * Math.sin(a)); }
      h.lineTo(cx + s / 2, SPRING); h.lineTo(cx + s / 2, WY - 0.7); sh.holes.push(h);
    }
    const body = new THREE.ExtrudeGeometry(sh, { depth: BW, bevelEnabled: false, curveSegments: 4 }); body.translate(0, 0, -BW / 2);
    const P = [], refl = [], add = (x, y) => { P.push(x, y, BW / 2 + 0.16, x, y, -BW / 2 - 0.16); refl.push([x, y]); };
    for (const [cx, s, rise] of A.arches) { const n = Math.round((s + rise) * 2.3); for (let j = 0; j <= n; j++) { const a = PI - PI * j / n; add(cx + (s / 2 + 0.1) * Math.cos(a), SPRING + (rise + 0.1) * Math.sin(a)); } }
    for (let j = 0; j <= 56; j++) { const x = BL * j / 56; add(x, deckY(x, A.hump) - 0.2); }
    const pts = new THREE.BufferGeometry(); pts.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); pts.computeBoundingSphere();
    K.PG[key + 'b'] = body; K.PG[key + 'p'] = pts; BRP[type] = refl;
    return [body, pts, refl];
  }
  function brug(K, type) {
    const r = res(K), k = K.kit(), { kb, kadd, ktube, PG, PM } = K, t = type || pick(['drie', 'drie', 'een']), A = TYPES[t];
    const [body, ptsGeo, refl] = bridgeParts(K, t);
    kadd(k, body, K.brickMat(0x4a2a22), 0, 0, 0);
    for (const [cx, s, rise] of A.arches) {   // the stone ring round each arch
      const n = Math.round((s + rise) * 1.6);
      for (let j = 0; j <= n; j++) { const a = PI - PI * j / n, x = cx + (s / 2 + 0.28) * Math.cos(a), y = SPRING + (rise + 0.28) * Math.sin(a); for (const zf of [BW / 2 + 0.02, -BW / 2 - 0.02]) kb(k, r.sand, x, y, zf, 0.24, 0.5, 0.1, 0, 0, a - PI / 2); }
    }
    for (const zf of [BW / 2 - 0.18, -BW / 2 + 0.18]) for (let i = 0; i < 16; i++) {   // the stone curb along the hump, the iron railing on it
      const x0 = BL * i / 16, x1 = BL * (i + 1) / 16, y0 = deckY(x0, A.hump), y1 = deckY(x1, A.hump), ang = Math.atan2(y1 - y0, x1 - x0);
      kb(k, r.sand, (x0 + x1) / 2, (y0 + y1) / 2 + 0.1, zf, Math.hypot(x1 - x0, y1 - y0) + 0.03, 0.3, 0.38, 0, 0, ang);
      ktube(k, PM.pole, x0, y0 + 1.08, zf, x1, y1 + 1.08, zf, 0.035);
      for (let b = 0; b < 3; b++) { const tt = (b + 0.5) / 3, x = x0 + (x1 - x0) * tt, y = y0 + (y1 - y0) * tt; kb(k, PM.pole, x, y + 0.66, zf, 0.04, 0.8, 0.04); }
    }
    for (const [x, y] of refl) { const L = 2.4 + (y - WY) * 3.0; kadd(k, PG.winStreak, r.bulb, x, WY + 0.03, BW / 2 + 0.3 + L / 2, -PI / 2, 0, 0, 0.95, L); }
    const nb = 2 + Math.floor(Math.random() * 4);   // bikes chained to the railing at the near end
    for (let i = 0; i < nb; i++) { const x = 0.9 + i * 0.75 + rnd(-0.1, 0.1); bike(K, k, PM.pole, x, deckY(x, A.hump), BW / 2 - 0.55, PI / 2 + rnd(-0.12, 0.12), -0.16); }
    at(K, k, 0, 0, 0, 0, 0);
    const g = K.kbuild(k); g.add(new K.THREE.Points(ptsGeo, r.pts)); g.userData.faceRoad = true; return g;
  }
  // the Magere Brug: a white wooden double drawbridge, its two portal frames and long balance beams outlined in white bulbs
  function magereBrug(K) {
    const r = res(K), k = K.kit(), { kb, kadd, ktube, PG, PM, THREE } = K, L = 27, dy = 1.15, c = L / 2, W = 4.4, P = [], refl = [];
    const yAt = x => Math.min(dy, 0.06 + Math.min(x, L - x) * 0.3), add = (x, y, z, front) => { P.push(x, y, z); if (front) refl.push([x, y]); };
    for (let i = 0; i < L; i++) {
      const x0 = i, x1 = i + 1, y0 = yAt(x0), y1 = yAt(x1), ang = Math.atan2(y1 - y0, 1);
      kb(k, r.white, i + 0.5, (y0 + y1) / 2 - 0.18, 0, 1.03, 0.36, W, 0, 0, ang);
      for (const z of [-W / 2, W / 2]) { kb(k, r.white, i + 0.5, (y0 + y1) / 2 + 0.95, z, 1.03, 0.1, 0.1, 0, 0, ang); kb(k, r.white, i, y0 + 0.45, z, 0.08, 0.9, 0.08); }
      add(i + 0.5, (y0 + y1) / 2 - 0.42, W / 2 + 0.14, true); add(i + 0.5, (y0 + y1) / 2 - 0.42, -W / 2 - 0.14);
      add(i + 0.5, (y0 + y1) / 2 + 1.05, W / 2 + 0.05, true);
    }
    for (let x = 2.5; x < L - 2; x += 3.2) for (const z of [-1.7, 1.7]) kb(k, r.white, x, (WY - 0.5 + yAt(x)) / 2, z, 0.3, yAt(x) - WY + 0.5, 0.3);
    for (const s of [-1, 1]) {
      const gx = c + s * 3.3;   // the portal frame of each leaf, and its balance beam resting on top
      for (const z of [-2.75, 2.75]) {
        kb(k, r.white, gx, dy + 3.1, z, 0.36, 6.2, 0.36); kb(k, r.white, (gx + c + s * 10.5) / 2, dy + 6.95, z, Math.abs(c + s * 10.5 - (c + s * 0.4)) + 0.4, 0.5, 0.4);
        kb(k, r.white, c + s * 10.5, dy + 6.2, z, 0.9, 1.2, 0.55); ktube(k, PM.pole, c + s * 0.6, dy + 6.7, z * 0.85, c + s * 0.45, dy + 0.3, z * 0.85, 0.035);
        for (let y = dy + 0.4; y < dy + 6.2; y += 0.42) add(gx - s * 0.24, y, z + Math.sign(z) * 0.24, z > 0);
        const xa = c + s * 0.3, xb = c + s * 10.6;
        for (let j = 0; j <= 26; j++) { const x = xa + (xb - xa) * j / 26; add(x, dy + 7.24, z + Math.sign(z) * 0.25, z > 0); add(x, dy + 6.66, z + Math.sign(z) * 0.25, z > 0); }
      }
      kb(k, r.white, gx, dy + 6.2, 0, 0.36, 0.4, 5.9);
      for (let j = 0; j <= 12; j++) add(gx, dy + 6.45, -2.75 + 5.5 * j / 12, false);
    }
    for (const [x, y] of refl) { const L2 = 1.2 + (y - WY) * 1.4; kadd(k, PG.winStreak, r.bulbW, x, WY + 0.03, W / 2 + 0.6 + L2 / 2, -PI / 2, 0, 0, 0.55, L2); }
    const g = K.kbuild(k), geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); geo.computeBoundingSphere();
    g.add(new THREE.Points(geo, r.ptsW)); g.userData.faceRoad = true; return g;
  }

  // ---------- on the water and along the quay ----------
  // a houseboat moored along the quay: an ark with a wooden cabin and a roof garden, or an old barge with a wheelhouse; lit windows.
  // far: moored at the far quay; the object stands near the road's quay so the game keeps it clear of the bridges, its boat drawn 17 m out
  function woonboot(K, far) {
    const r = res(K), k = K.kit(), { kb, kadd, PG, PM } = K, ox = far ? 17.2 : 0, qs = far ? 1 : -1, barge = Math.random() < 0.4, L = barge ? rnd(16, 19) : rnd(12, 15), B = barge ? 4.2 : rnd(4.2, 4.8), cab = pick(r.cabins);
    kb(k, PM.boat, ox, -0.05, 0, B, 1.2, L); kb(k, r.sand, ox, 0.57, 0, B + 0.1, 0.07, L + 0.1);   // the hull, a pale rim along its deck
    if (barge) { kb(k, PM.boat, ox, -0.05, -L / 2, B * 0.71, 1.2, B * 0.71, 0, PI / 4, 0); kb(k, cab, ox, 1.1, 1.0, B - 0.8, 1.1, L - 6.5); kb(k, PM.roof, ox, 1.7, 1.0, B - 0.6, 0.1, L - 6.3); kb(k, cab, ox, 1.6, L / 2 - 1.6, B - 0.6, 2.1, 2.2); kb(k, PM.roof, ox, 2.7, L / 2 - 1.6, B - 0.4, 0.1, 2.4); }
    else { kb(k, cab, ox, 1.75, 0.3, B - 0.5, 2.4, L - 2.4); kb(k, PM.roof, ox, 3.0, 0.3, B - 0.2, 0.12, L - 2.0); for (let i = 0; i < 4; i++) kadd(k, K.KG.ball, PM.leaf, ox + rnd(-1.2, 1.2), 3.25, rnd(-L / 2 + 2, L / 2 - 2), 0, 0, 0, rnd(0.6, 1.0), rnd(0.5, 0.8), rnd(0.6, 1.0)); }
    const wy = barge ? 1.15 : 1.75, wh = barge ? 0.7 : 1.3, n = Math.floor((barge ? L - 7 : L - 3) / 1.9);
    for (let i = 0; i < n; i++) for (const side of [-1, 1]) {
      const z = (barge ? 1.0 : 0.3) - (n - 1) * 0.95 + i * 1.9, x = ox + side * ((barge ? B - 0.8 : B - 0.5) / 2 + 0.02), lit = Math.random() < 0.55;
      kadd(k, PG['win' + (lit ? pick([0, 1, 2]) : pick([4, 5]))], PM.winAtlas, x, wy, z, 0, side * PI / 2, 0, 0.9, wh);
      if (lit) { kadd(k, PG.winGlow, r.glow, x + side * 0.06, wy, z, 0, side * PI / 2, 0, 2.2, 2.0); if (side < 0) kadd(k, PG.winStreak, r.glow, x - (far ? 3.0 : 0.9), 0.03, z, -PI / 2, 0, PI / 2, 0.9, far ? 5.0 : 1.6); }
    }
    for (const mz of [-L / 2 + 1.5, L / 2 - 1.5]) { const mx = ox + qs * (B / 2 + 0.7); kadd(k, K.KG.cyl, M_wood(K), mx, 0.25, mz, 0, 0, 0, 0.26, 2.3, 0.26); kadd(k, K.KG.cyl, PM.pole, mx, 1.42, mz, 0, 0, 0, 0.3, 0.06, 0.3); K.ktube(k, K.PK.rope, mx, 1.1, mz, ox + qs * B / 2, 0.62, mz * 0.8, 0.025); }   // mooring posts and lines
    kb(k, M_wood(K), ox + qs * (B / 2 + 0.55), 0.85, rnd(-L / 4, L / 4), 1.3, 0.08, 0.8, 0, 0, -qs * 0.25);   // the gangway up to the quay
    if (Math.random() < 0.6) bike(K, k, PM.pole, ox + rnd(-0.6, 0.6), 0.6, -L / 2 + 1.8, rnd(-0.2, 0.2), 0);
    at(K, k, 0, 0, 0, 0, 0);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  const M_wood = K => K.M.wood;
  // the canal lamp: a slim cast iron post with a ladder bar, a six-sided lantern under a little crown; now and then a bike locked to it
  function lamp(K) {
    const r = res(K), k = K.kit(), g = new K.THREE.Group(), { kadd, kb, KG } = K, cyl6 = K.PG.ams_cyl6 || (K.PG.ams_cyl6 = new K.THREE.CylinderGeometry(0.5, 0.5, 1, 6));
    kadd(k, KG.cyl, r.iron, 0, 0.3, 0, 0, 0, 0, 0.36, 0.6, 0.36); kadd(k, KG.cyl, r.iron, 0, 1.95, 0, 0, 0, 0, 0.13, 2.9, 0.13); kadd(k, KG.cyl, r.iron, 0, 3.42, 0, 0, 0, 0, 0.22, 0.12, 0.22);
    kb(k, r.iron, 0, 3.05, 0, 0.62, 0.05, 0.05); kadd(k, cyl6, r.iron, 0, 3.5, 0, 0, 0, 0, 0.5, 0.06, 0.5);
    for (let i = 0; i < 6; i++) { const a = i * PI / 3; kb(k, r.iron, Math.cos(a) * 0.22, 3.8, Math.sin(a) * 0.22, 0.03, 0.6, 0.03); }
    kadd(k, K.KG.dome, r.iron, 0, 4.1, 0, 0, 0, 0, 0.62, 0.38, 0.62); kadd(k, KG.ball, r.iron, 0, 4.35, 0, 0, 0, 0, 0.12, 0.16, 0.12);
    if (Math.random() < 0.35) bike(K, k, K.PM.pole, 0.3, 0, rnd(-0.2, 0.2), rnd(-0.15, 0.15), 0.12);
    at(K, k, 0, 0, 0, 0, 0); K.kbuild(k, g);
    const glass = new K.THREE.Mesh(cyl6, K.PM.lampHead); glass.position.set(0, 3.8, 0); glass.scale.set(0.42, 0.56, 0.42); g.add(glass);
    K.lampLights(g, 0, 3.78, 1, 1.05); g.userData.faceRoad = true; return g;
  }
  // a lamp on the canal side: its light also lies in the black water below the quay
  function lampKade(K) {
    const g = lamp(K), m = new K.THREE.Mesh(K.PG.winStreak, res(K).glow);
    m.position.set(6.0, -0.97, 0); m.rotation.set(-PI / 2, 0, PI / 2); m.scale.set(1.4, 7.5, 1); m.renderOrder = 3; g.add(m); return g;
  }
  // a row of Amsterdammertjes along the kerb: brown red cast iron posts, three white crosses toward the street
  function paaltjes(K) {
    const r = res(K), k = K.kit(), n = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      const z = (i - (n - 1) / 2) * 1.45;
      K.kadd(k, K.KG.cyl, r.paal, 0, 0.5, z, 0, 0, 0, 0.17, 1.0, 0.17); K.kadd(k, K.KG.cyl, r.paal, 0, 0.9, z, 0, 0, 0, 0.21, 0.05, 0.21); K.kadd(k, K.KG.ball, r.paal, 0, 1.0, z, 0, 0, 0, 0.19, 0.17, 0.19);
      for (const y of [0.42, 0.58, 0.74]) for (const a of [PI / 4, -PI / 4]) K.kb(k, r.frame, -0.087, y, z, 0.012, 0.13, 0.03, a, 0, 0);
    }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // bikes against a rack or each other on the quay, one of them sometimes fallen over
  function fietsen(K) {
    const k = K.kit(), n = 4 + Math.floor(Math.random() * 5), m = pick(K.PK.bikes), fallen = Math.random() < 0.3 ? Math.floor(Math.random() * n) : -1;
    for (let i = 0; i < n; i++) { const z = (i - (n - 1) / 2) * 0.62; if (i === fallen) bike(K, k, m, 0.6, 0.03, z, PI / 2 + rnd(-0.3, 0.3), 1.5); else bike(K, k, i % 3 ? K.PM.pole : m, rnd(-0.08, 0.08), 0, z, PI / 2 + rnd(-0.18, 0.18), rnd(-0.2, -0.08)); }
    at(K, k, 0, 0, 0, 0, 0); K.kb(k, K.PM.pole, 0.45, 0.45, 0, 0.05, 0.05, n * 0.62 + 0.3);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  const cyl6 = K => K.PG.ams_cyl6 || (K.PG.ams_cyl6 = new K.THREE.CylinderGeometry(0.5, 0.5, 1, 6));
  const cyl8 = K => K.PG.ams_cyl8 || (K.PG.ams_cyl8 = new K.THREE.CylinderGeometry(0.5, 0.5, 1, 8));
  const cone = (K, n) => K.PG['ams_cone' + n] || (K.PG['ams_cone' + n] = new K.THREE.ConeGeometry(0.5, 1, n));
  // tram wires over a big street: a mast at each kerb, a span wire between them, two contact wires over the tracks, a lamp hung over the middle
  function tramMast(K) {
    const r = res(K), k = K.kit(), g = new K.THREE.Group(), { kadd, ktube, KG } = K, w = 9.4;
    for (const x of [0, -w]) { kadd(k, KG.cyl, r.iron, x, 3.6, 0, 0, 0, 0, 0.2, 7.2, 0.2); kadd(k, KG.ball, r.iron, x, 7.25, 0, 0, 0, 0, 0.24, 0.24, 0.24); }
    ktube(k, r.iron, 0, 6.75, 0, -w, 6.75, 0, 0.018);
    for (const cx of [-w / 2 - 2.2, -w / 2 + 2.2]) { ktube(k, r.iron, cx, 6.05, -14, cx, 6.05, 14, 0.014); ktube(k, r.iron, cx, 6.05, 0, cx, 6.75, 0, 0.012); }
    ktube(k, r.iron, -w / 2, 6.75, 0, -w / 2, 6.4, 0, 0.015);
    K.kbuild(k, g);
    const glass = new K.THREE.Mesh(cyl6(K), K.PM.lampHead); glass.position.set(-w / 2, 6.2, 0); glass.scale.set(0.5, 0.34, 0.5); g.add(glass);
    K.lampLights(g, -w / 2, 6.12, 0, 0.62); const cn = g.children[g.children.length - 3]; if (cn && cn.isSprite) cn.scale.y *= 0.55;   // a short cone: the lamp hangs high over the middle of the road
    g.userData.faceRoad = true; return g;
  }
  // a market stall at the kerb, the Albert Cuyp: a frame, a striped awning sloping to the street, crates of fruit, cheese or tulips, bulbs under the edge
  function kraam(K) {
    const r = res(K), k = K.kit(), g = new K.THREE.Group(), { kb, kadd } = K, L = rnd(3.0, 4.2), P = [], fill = pick([K.PM.orange, K.PM.cheese, K.PM.tulip, K.PM.orange]);
    for (const x of [-0.7, 0.7]) for (const z of [-L / 2, L / 2]) kb(k, K.PM.pole, x, 1.15, z, 0.05, 2.3, 0.05);
    kb(k, K.M.wood, 0, 0.85, 0, 1.4, 0.08, L);
    for (let i = 0; i < Math.floor(L / 0.6); i++) { const z = -L / 2 + 0.3 + i * 0.6; kb(k, K.M.wood, -0.25, 0.98, z, 0.5, 0.18, 0.5); for (let j = 0; j < 3; j++) kadd(k, K.KG.ball, fill, -0.25 + rnd(-0.12, 0.12), 1.12, z + rnd(-0.15, 0.15), 0, 0, 0, 0.16, 0.14, 0.16); }
    kb(k, pick(r.awnings), -0.05, 2.45, 0, 1.9, 0.04, L + 0.3, 0, 0, 0.32);
    for (let i = 0; i <= Math.round(L / 0.32); i++) P.push(-0.98, 2.1, -L / 2 + i * 0.32);
    K.kbuild(k, g); const geo = new K.THREE.BufferGeometry(); geo.setAttribute('position', new K.THREE.Float32BufferAttribute(P, 3)); geo.computeBoundingSphere(); g.add(new K.THREE.Points(geo, r.pts));
    g.userData.faceRoad = true; return g;
  }
  // a rowing eight of the dead on the Amstel, sculling through the fog
  function roeiboot(K) {
    const k = K.kit(), z0 = K.zombie('plain');
    K.kb(k, K.PM.boat, 0, 0.12, 0, 0.55, 0.3, 11); K.kb(k, K.PM.boat, 0, 0.12, -5.8, 0.39, 0.3, 0.39, 0, PI / 4, 0);
    for (let i = 0; i < 4; i++) {
      const z = -3.2 + i * 2.1; at(K, k, 0, -0.5, z, 0, 0);
      for (const m of z0.children) K.kadd(k, m.geometry, m.material, 0, 0, 0);
      at(K, k, 0, 0, 0, 0, 0); for (const s of [-1, 1]) K.ktube(k, K.M.wood, 0, 0.75, z - 0.4, s * 2.6, 0.02, z + 0.5, 0.03);
    }
    const g = K.kbuild(k); g.rotation.y = PI; return g;
  }

  // ---------- landmarks ----------
  // the Westertoren: brick, then stone, then stages clad in lead, the clock lit, and on top Maximilian's blue imperial crown; the Westerkerk behind
  function westertoren(K) {
    const r = res(K), k = K.kit(), { kb, kadd, ktube, KG, PM, PG, THREE } = K, g = new THREE.Group(), c8 = cyl8(K);
    kb(k, r.tower, 0, 10.5, 0, 9, 27, 9);
    for (const y of [7.5, 15.5, 23.6]) kb(k, r.stoneLit, 0, y, 0, 9.4, 0.5, 9.4);
    for (const [sx, sz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) for (const y of [11.5, 19.5]) kb(k, PM.pole, sx * 4.53, y, sz * 4.53, sx ? 0.06 : 2.0, 4.2, sz ? 0.06 : 2.0);
    kb(k, r.stoneLit, 0, 27.3, 0, 7.4, 7, 7.4); kb(k, r.stoneLit, 0, 31.1, 0, 8.0, 0.5, 8.0);
    kadd(k, c8, r.stoneLit, 0, 34.6, 0, 0, PI / 8, 0, 6.8, 6.4, 6.8);
    for (let i = 0; i < 4; i++) { const a = i * PI / 2, x = Math.sin(a) * 3.2, z = Math.cos(a) * 3.2; kadd(k, KG.disc, r.clock, x, 35, z, 0, a, 0, 3.6, 3.6, 1); kb(k, PM.pole, x + Math.sin(a) * 0.03, 35.25, z + Math.cos(a) * 0.03, 0.08, 0.6, 0.02, 0, a, 0.5); kb(k, PM.pole, x + Math.sin(a) * 0.04, 35.05, z + Math.cos(a) * 0.04, 0.06, 0.85, 0.02, 0, a, -1.9); }
    kadd(k, c8, r.stoneLit, 0, 38.0, 0, 0, PI / 8, 0, 7.4, 0.4, 7.4);
    kadd(k, c8, r.lead, 0, 40.6, 0, 0, PI / 8, 0, 5.4, 5.0, 5.4); kadd(k, c8, r.stoneLit, 0, 43.2, 0, 0, PI / 8, 0, 5.8, 0.3, 5.8);
    kadd(k, c8, r.lead, 0, 45.2, 0, 0, PI / 8, 0, 4.0, 3.8, 4.0); kadd(k, c8, r.lead, 0, 48.0, 0, 0, PI / 8, 0, 2.9, 2.0, 2.9);
    kadd(k, KG.cyl, r.crown, 0, 49.5, 0, 0, 0, 0, 2.8, 1.0, 2.8);
    for (let i = 0; i < 12; i++) { const a = i / 12 * 2 * PI; kadd(k, KG.ball, r.gold, Math.sin(a) * 1.4, 50.05, Math.cos(a) * 1.4, 0, 0, 0, 0.3, 0.3, 0.3); }
    const arc = PG.ams_arc || (PG.ams_arc = new THREE.TorusGeometry(1.25, 0.17, 5, 14, PI));
    kadd(k, arc, r.crown, 0, 50.0, 0); kadd(k, arc, r.crown, 0, 50.0, 0, 0, PI / 2, 0);
    kadd(k, KG.ball, r.gold, 0, 51.45, 0, 0, 0, 0, 0.64, 0.64, 0.64); kb(k, r.gold, 0, 52.3, 0, 0.15, 1.0, 0.15); kb(k, r.gold, 0, 52.45, 0, 0.62, 0.15, 0.15);
    ktube(k, r.gold, 0, 52.8, 0, 0, 55.6, 0, 0.06); kb(k, r.gold, 0.42, 55.1, 0, 0.9, 0.42, 0.05);
    kb(k, r.tower, 18.5, 6, 0, 28, 18, 15); for (const s of [-1, 1]) kb(k, PM.roof, 18.5, 18.1, s * 3.75, 28.4, 0.2, 9.7, s * 0.675, 0, 0);
    const tri = new THREE.Shape(); tri.moveTo(-7.6, 0); tri.lineTo(7.6, 0); tri.lineTo(0, 6.1); tri.closePath(); const tg = new THREE.ShapeGeometry(tri); kadd(k, tg, r.tower, 4.49, 15, 0, 0, -PI / 2, 0); tg.dispose();
    for (const x of [9, 15, 21, 27]) { kadd(k, PG.win2, PM.winAtlas, x, 8, 7.52, 0, 0, 0, 1.6, 4.2); kadd(k, PG.winGlow, r.glow, x, 8, 7.6, 0, 0, 0, 3.6, 6); }
    K.kbuild(k, g);
    const s1 = new THREE.Sprite(r.crownGlow); s1.position.set(0, 50.4, 0); s1.scale.set(9, 9, 1); g.add(s1);
    return g;
  }
  // the Oude Kerk in the middle of De Wallen: a wide low hall of chapels and a slim tower with an open lantern and a spire
  function oudeKerk(K) {
    const r = res(K), k = K.kit(), { kb, kadd, ktube, KG, PM, PG, THREE } = K, g = new THREE.Group(), c8 = cyl8(K);
    kb(k, r.tower, 17, 5, 0, 30, 16, 22); for (const s of [-1, 1]) kb(k, PM.roof, 17, 16.6, s * 5.5, 30.4, 0.2, 13.0, s * 0.56, 0, 0);
    for (const s of [-1, 1]) { kb(k, r.tower, 17, 3, s * 13, 26, 12, 5); kb(k, PM.roof, 17, 9.6, s * 13.5, 26.2, 0.2, 5.6, s * 0.5, 0, 0); }
    kb(k, r.tower, 0, 9.5, 0, 6.6, 25, 6.6); kb(k, r.stoneLit, 0, 22.2, 0, 7.0, 0.4, 7.0);
    kadd(k, c8, r.lead, 0, 24.8, 0, 0, PI / 8, 0, 5.6, 4.8, 5.6);
    for (let i = 0; i < 4; i++) { const a = i * PI / 2; kadd(k, KG.disc, r.clock, Math.sin(a) * 2.62, 25, Math.cos(a) * 2.62, 0, a, 0, 2.6, 2.6, 1); }
    kadd(k, c8, r.lead, 0, 28.6, 0, 0, PI / 8, 0, 4.2, 2.8, 4.2); kadd(k, c8, r.lead, 0, 31.2, 0, 0, PI / 8, 0, 3.0, 2.4, 3.0);
    kadd(k, cone(K, 8), r.lead, 0, 36.6, 0, 0, PI / 8, 0, 2.6, 8.4, 2.6); kadd(k, KG.ball, r.gold, 0, 40.9, 0, 0, 0, 0, 0.5, 0.5, 0.5); ktube(k, r.gold, 0, 41, 0, 0, 43, 0, 0.05);
    for (const x of [8, 14, 20, 26]) { kadd(k, PG.win2, PM.winAtlas, x, 6, 11.02, 0, 0, 0, 1.6, 4.4); kadd(k, PG.winGlow, r.glow, x, 6, 11.1, 0, 0, 0, 3.6, 6); }
    K.kbuild(k, g); return g;
  }
  // Amsterdam Centraal: a long red brick front round two towers, rows of lit windows, a clock in the west tower and a wind dial in the east
  function centraal(K) {
    const r = res(K), k = K.kit(), { kb, kadd, ktube, KG, PM, PG, THREE } = K, g = new THREE.Group(), brick = K.brickMat(0x6a3424), c8 = cyl8(K);
    kb(k, brick, 7, 6.5, 0, 14, 19, 84); for (const y of [4.6, 10.6]) kb(k, r.sand, -0.06, y, 0, 0.3, 0.4, 84.2);
    for (const s of [1, -1]) kb(k, PM.roof, s > 0 ? 3.5 : 10.5, 19, 0, 9.2, 0.2, 84.4, 0, 0, s * 0.708);
    for (let z = -40; z <= 40; z += 2.6) { if (Math.abs(Math.abs(z) - 11) < 5 || Math.abs(z) < 4.5) continue; for (const y of [2.6, 7.6, 12.6]) { const lit = Math.random() < 0.55; kadd(k, PG['win' + (lit ? pick([0, 1, 2]) : 4)], PM.winAtlas, -0.03, y, z, 0, -PI / 2, 0, 1.2, 2.2); if (lit) kadd(k, PG.winGlow, r.glow, -0.09, y, z, 0, -PI / 2, 0, 2.6, 3.4); } }
    for (const tz of [-11, 11]) {
      kb(k, brick, 2, 13, tz, 8, 32, 8); kb(k, r.sand, 2, 24.5, tz, 8.3, 0.5, 8.3); kadd(k, cone(K, 4), PM.roof, 2, 31.5, tz, 0, PI / 4, 0, 11, 5, 11);
      kadd(k, c8, r.lead, 2, 35, tz, 0, PI / 8, 0, 2.2, 2.2, 2.2); kadd(k, cone(K, 8), r.lead, 2, 37.4, tz, 0, 0, 0, 2.2, 2.6, 2.2); ktube(k, r.gold, 2, 38.6, tz, 2, 40.5, tz, 0.05);
      kadd(k, KG.disc, tz < 0 ? r.clock : r.gold, -2.04, 21.5, tz, 0, -PI / 2, 0, 6.2, 6.2, 1);
    }
    kb(k, PM.pole, -0.07, 4.2, 0, 0.1, 7.6, 7.6); kadd(k, PG.winGlow, r.glow, -0.15, 4, 0, 0, -PI / 2, 0, 9, 8);
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }
  // the Paleis op de Dam: a long classical block of pale stone, a pediment, the domed cupola with its ship; the white National Monument across the square
  function paleis(K) {
    const r = res(K), k = K.kit(), { kb, kadd, KG, PM, PG, THREE } = K, g = new THREE.Group(), c8 = cyl8(K);
    kb(k, r.stoneLit, 10, 9.5, 0, 20, 25, 56); kb(k, r.stoneLit, -0.6, 9.5, 0, 1.4, 25, 20); kb(k, r.sand, -0.4, 22.2, 0, 1.2, 0.6, 56.4);
    const tri = new THREE.Shape(); tri.moveTo(-10, 0); tri.lineTo(10, 0); tri.lineTo(0, 4); tri.closePath(); const tg = new THREE.ShapeGeometry(tri); kadd(k, tg, r.stoneLit, -1.31, 22.5, 0, 0, -PI / 2, 0); tg.dispose();
    kb(k, r.lead, 10, 23.4, 0, 19, 2.4, 55);
    kadd(k, c8, r.stoneLit, 10, 27.5, 0, 0, PI / 8, 0, 7, 6, 7); kadd(k, KG.dome, r.lead, 10, 30.5, 0, 0, 0, 0, 7.4, 6, 7.4); kadd(k, c8, r.stoneLit, 10, 34.4, 0, 0, PI / 8, 0, 2.2, 2.4, 2.2);
    kadd(k, KG.dome, r.lead, 10, 35.6, 0, 0, 0, 0, 2.4, 1.6, 2.4); kb(k, r.gold, 10, 37.4, 0, 0.5, 0.45, 1.5); kb(k, r.gold, 10, 38.2, 0, 0.06, 1.3, 0.06); kb(k, r.gold, 10, 38.3, 0.15, 0.04, 0.8, 0.6);
    for (let z = -26; z <= 26; z += 2.6) for (const y of [3, 8, 13, 18]) { const lit = Math.random() < 0.4; kadd(k, PG['win' + (lit ? pick([0, 2]) : 4)], PM.winAtlas, Math.abs(z) < 10 ? -1.33 : -0.03, y, z, 0, -PI / 2, 0, 1.2, 2.4); if (lit) kadd(k, PG.winGlow, r.glow, Math.abs(z) < 10 ? -1.4 : -0.1, y, z, 0, -PI / 2, 0, 2.6, 3.4); }
    const ob = PG.ams_obel || (PG.ams_obel = new THREE.CylinderGeometry(0.42, 0.62, 1, 4));
    kb(k, r.frame, -17, 0.6, 14, 9, 1.2, 9); kb(k, r.frame, -17, 1.6, 14, 6, 0.8, 6); kadd(k, ob, r.stoneLit, -17, 12.5, 14, 0, PI / 4, 0, 4.4, 21, 4.4);
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }

  const elm = K => K.treeCard([0, 0, 1]);
  const lang = K => { const z = K.zombie('mokummer'); z.scale.setScalar(1.14); z.userData.shuffle = rnd(0.3, 0.6); return z; };   // a tall local
  const PLACES = ['Westertoren', 'Dam', 'Centraal', 'Jordaan', 'Magere Brug', 'De Wallen', 'Rijksmuseum', 'Vondelpark', 'Leidseplein', 'Albert Cuyp'];
  const wegwijzer = K => K.fingerpost(PLACES.slice().sort(() => Math.random() - 0.5).slice(0, 3));
  // the landmark of the level: the Oude Kerk in De Wallen, the station and the palace on the squares, the Westertoren over the canals
  function landmark(K) { const lv = levelNow(); return lv === 129 ? oudeKerk(K) : lv === 126 ? centraal(K) : lv === 125 ? paleis(K) : westertoren(K); }

  // tram rails, painted through the road's base colour: a gradient across the road with two tracks in it (the road look has no rails of its own)
  let RAILS = null;
  function rails() {
    if (RAILS) return RAILS;
    const g = document.createElement('canvas').getContext('2d'), gr = g.createLinearGradient(0, 0, 512, 0), base = '#33363d';
    gr.addColorStop(0, base);
    for (const x of [-2.92, -1.48, 1.48, 2.92]) { const o = (x + 4) / 8; gr.addColorStop(o - 0.0048, base); gr.addColorStop(o - 0.0042, '#8c9098'); gr.addColorStop(o + 0.0004, '#8c9098'); gr.addColorStop(o + 0.001, '#111216'); gr.addColorStop(o + 0.0044, '#111216'); gr.addColorStop(o + 0.005, base); }
    gr.addColorStop(1, base); return (RAILS = gr);
  }

  // ---------- the painted town on the horizon ----------
  function gables(P, f0, f1, h0, h1, lit) {   // narrow canal houses shoulder to shoulder, stepped, bell and neck gables
    let x = P.X(f0);
    while (x < P.X(f1)) {
      const wd = P.rr(4.2, 7), h = P.rr(h0, h1), u = P.r(), m = P.m;
      if (u < 0.3) { P.house(x + wd * m / 2, wd, h, 'flat', lit); const nw = wd * 0.45, gg = wd * 0.75; P.poly([[x + (wd - nw) / 2 * m, h - 0.1], [x + (wd - nw) / 2 * m, h + gg * 0.82], [x + wd / 2 * m, h + gg], [x + (wd + nw) / 2 * m, h + gg * 0.82], [x + (wd + nw) / 2 * m, h - 0.1]]); }
      else P.house(x + wd * m / 2, wd, h, u < 0.65 ? 'step' : 'bell', lit);
      x += wd * m * P.rr(0.98, 1.06);
    }
  }
  function redWindows(P, f0, f1, n) { P.w.fillStyle = 'rgba(255,40,70,0.95)'; for (let i = 0; i < n; i++) { const x = P.X(P.rr(f0, f1)); P.w.fillRect(x, P.g.canvas.height - 5 * P.m - P.rr(1, 4) * P.m, 1.3 * P.m, 1.9 * P.m); } }
  const skyline = {
    near(P) { gables(P, 0, 0.4, 11, 17, 0.14); gables(P, 0.6, 1, 11, 17, 0.14); P.trees(0, 0.4, 9, 15, 11); P.trees(0.6, 1, 9, 15, 11); P.trees(0.42, 0.58, 4, 7, 12); if (isWallen()) { redWindows(P, 0, 0.4, 26); redWindows(P, 0.6, 1, 26); } },
    mid(P) {
      P.trees(0, 1, 7, 12, 14); gables(P, 0, 0.5, 9, 15, 0.1); gables(P, 0.7, 1, 9, 15, 0.1);
      if (isWallen()) { const x = P.X(0.6); P.box(x + 12 * P.m, 26, -5, 13); P.tower(x, [[6.6, 24], [5.4, 5], [4, 3], [3, 2.4]], 'spire', true); redWindows(P, 0.5, 0.75, 30); }
      else { const x = P.X(0.56); P.box(x + 15 * P.m, 26, -5, 15); P.poly([[x + 2 * P.m, 15], [x + 15 * P.m, 21], [x + 28 * P.m, 15]]); P.tower(x, [[9, 26], [7.4, 7], [6.6, 6.5], [5.2, 5], [3.9, 3.8], [2.8, 2]], 'crown', true); P.win(x, 33.6, 0.95, 2.4, 2.4); }
      P.tower(P.X(0.32), [[7, 28], [5, 8], [3.6, 6]], 'spire', true);
    },
    far(P) {
      P.trees(0, 1, 5, 9, 10); gables(P, 0, 1, 6, 11, 0.05);
      for (const [f, tiers, top] of [[0.1, [[6, 26], [4, 8]], 'spire'], [0.18, [[5, 20], [3.4, 7]], 'lantern'], [0.36, [[4, 18], [3, 6]], 'onion'], [0.44, [[6, 30], [4.2, 6]], 'spire'], [0.76, [[6, 24], [4, 7]], 'lantern'], [0.84, [[5, 22]], 'spire'], [0.9, [[5, 22]], 'spire']]) P.tower(P.X(f), tiers, top, true);
      if (isWallen()) redWindows(P, 0.3, 0.9, 30);
    },
  };

  // ---------- the dead: tourists with suitcases, phones and selfie sticks, a guide's umbrella, tall locals walking their bikes ----------
  const dress = {
    adamtoerist(k, b, K) {
      const r = res(K), [, hy, hz] = b.hd;
      K.kb(k, r.kase, 0.5, 0.4, 0.45, 0.26, 0.6, 0.44, -0.4, 0, 0); K.ktube(k, r.kase, 0.48, 0.74, 0.3, 0.28, 0.62, -0.56, 0.02);
      for (const z of [0.36, 0.62]) K.kadd(k, K.KG.cyl, K.PM.pole, 0.5, 0.06, z, 0, 0, PI / 2, 0.09, 0.3, 0.09);
      K.kadd(k, K.KG.plane, K.PK.phone, -0.27, 0.72, -0.74, -0.9, 0, 0, 0.13, 0.22);
      K.kadd(k, K.KG.dome, r.kase, 0, hy + 0.04, hz + 0.01, 0.3, 0, 0, 0.27, 0.2, 0.29); K.kb(k, r.kase, 0, hy + 0.05, hz - 0.17, 0.2, 0.025, 0.13);
    },
    mokummer(k, b, K) {
      const r = res(K), [, sy, sz] = b.sh, [, hy, hz] = b.hd, cg = K.PG.ams_coat || (K.PG.ams_coat = new K.THREE.CylinderGeometry(0.2, 0.36, 1, 10)), tg = K.PG.ams_scarf || (K.PG.ams_scarf = new K.THREE.TorusGeometry(0.15, 0.05, 6, 10));
      K.kadd(k, cg, r.coat, 0, (sy + 0.45) / 2 + 0.02, (sz - 0.06) / 2, -0.27, 0, 0, 1, sy - 0.45, 1);
      K.kadd(k, tg, r.scarf, 0, sy + 0.02, sz - 0.1, PI / 2 + 0.6); K.kadd(k, K.KG.dome, r.scarf, 0, hy + 0.03, hz + 0.01, 0.25, 0, 0, 0.27, 0.26, 0.29);
      bike(K, k, K.PM.pole, 0.58, 0, -0.15, 0, 0); at(K, k, 0, 0, 0, 0, 0);
    },
    adamselfie(k, b, K) {
      const r = res(K), [, hy, hz] = b.hd;
      K.ktube(k, K.PM.pole, 0.27, 0.66, -0.62, 0.42, 2.25, -1.25, 0.018); K.kadd(k, K.KG.plane, K.PK.phone, 0.43, 2.3, -1.28, 0.35, PI, 0, 0.12, 0.2);
      K.kb(k, r.kase, 0, 1.42, 0.0, 0.36, 0.48, 0.2, -0.57, 0, 0);
      K.kadd(k, K.KG.cyl, r.kase, 0, hy + 0.12, hz + 0.02, 0.3, 0, 0, 0.26, 0.12, 0.28); K.kadd(k, K.KG.cyl, r.kase, 0, hy + 0.07, hz + 0.02, 0.3, 0, 0, 0.42, 0.02, 0.44);
    },
    adamgids(k, b, K) {
      const r = res(K);
      K.ktube(k, K.PM.pole, 0.27, 0.6, -0.62, 0.3, 2.62, -0.75, 0.02); K.kadd(k, K.KG.dome, r.umbrella, 0.3, 2.42, -0.75, 0, 0, 0, 1.05, 0.42, 1.05);
    },
  };

  // ---------- sky: the brightest town, an orange grey city glow all round, red over De Wallen, the first grey of dawn at the end ----------
  const GLOWS = [{ az: 0, el: 1, w: 200, h: 16, color: 0xf0a064, a: 0.24 }, { az: 75, el: 2, w: 130, h: 12, color: 0xf0a868, a: 0.18 }, { az: -75, el: 2, w: 130, h: 12, color: 0xf0a064, a: 0.18 },
    { az: 180, el: 2, w: 160, h: 14, color: 0xff9a52, a: 0.2 }, { az: 0, el: 9, w: 320, h: 30, color: 0xd88a50, a: 0.1 }];

  // ---------- the streets ----------
  const quay = (base, o) => Object.assign({}, base, { verge: 'tiles', water: 0x0e1218, waterY: -1.0, waterK: 0.2, ground: 0x0b0e12, groundY: -1.15 }, o);
  const themes = {
    // the canal quay: houses on the left, the canal on the right with its bridges, houseboats and elms, the far quay and its houses
    gracht: base => quay(base, { fog: 0x585758, fogD: 0.0148, night: 0.16, canal: 1, curv: 0.0012, landmark: false, road: { kind: 'klinkers', tone: '#4a3a36' }, spawn: [
      { make: K => isWallen() ? oudeKerk(K) : westertoren(K), n: 2, gap: 120, side: 'right', xr: [43, 45], y: 0, r: 12 },
      { make: K => brug(K), n: 3, gap: 48, side: 'right', reg: true, xr: [7.62, 7.62], r: 4.6 },
      { make: K => isFinale() ? magereBrug(K) : brug(K, 'een'), n: 1, gap: 200, side: 'right', xr: [7.62, 7.62], r: 4.6 },
      { make: K => row(K, { len: 22, n: 4, lit: 0.42, red: isWallen(), dx: -1.35 }), n: 7, gap: 22, side: 'left', reg: true, xr: [8.15, 8.15], r: 10.9 },
      { make: K => row(K, { len: 26, n: 5, far: true, lit: 0.4, red: isWallen() }), n: 6, gap: 26, side: 'right', reg: true, xr: [34.5, 34.5], r: 12.9 },
      { make: lamp, n: 8, gap: 18, side: 'left', reg: true, xr: [4.75, 4.75] }, { make: lampKade, n: 4, gap: 36, side: 'right', reg: true, xr: [4.75, 4.75] },
      { make: K => woonboot(K), n: 3, gap: 50, side: 'right', xr: [11.5, 11.9], y: -1.0, r: 8.5 }, { make: K => woonboot(K, true), n: 2, gap: 75, side: 'right', xr: [11.0, 11.0], y: -1.0, r: 8.5 },
      { make: elm, n: 7, gap: 20, side: 'right', xr: [6.8, 7.1], r: 0.9 }, { make: elm, n: 6, gap: 25, side: 'right', xr: [32.0, 32.4], r: 0.9 },
      { make: paaltjes, n: 9, gap: 16, side: 'left', xr: [4.4, 4.4], r: 0.3 }, { make: paaltjes, n: 5, gap: 30, side: 'right', xr: [4.4, 4.4], r: 0.3 },
      { make: fietsen, n: 5, gap: 30, side: 'right', xr: [5.6, 6.3], r: 0.6 }, { make: fietsen, n: 3, gap: 48, side: 'left', xr: [5.3, 5.4], r: 0.6 },
      { make: wegwijzer, n: 1, gap: 150, side: 'right', xr: [4.6, 4.6], r: 0.5 },
      { make: lang, n: 3, gap: 50, side: 'both', xr: [4.9, 5.5], r: 0.6 }, { make: 'zombieWalk', n: 6, gap: 24, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] }),
    // the market street: canal houses with shops on both sides, stalls under striped awnings, tram rails and wires
    shops: base => Object.assign({}, base, { fog: 0x5a5856, fogD: 0.0155, night: 0.16, ground: 0x15171b, groundY: -0.05, canal: 0, curv: 0.0016, lmX: [30, 36], lmSide: 'right', verge: 'tiles', road: { tone: rails(), rails: 1 }, spawn: [
      { make: K => row(K, { len: 20, n: 4, lit: 0.45, shop: 0.85, dx: -1.35, floors: [3, 4, 4] }), n: 7, gap: 20, side: 'left', reg: true, xr: [9.0, 9.0], r: 9.9 },
      { make: K => row(K, { len: 20, n: 4, lit: 0.45, shop: 0.85, dx: -1.35, floors: [3, 4, 4] }), n: 7, gap: 20, side: 'right', reg: true, xr: [9.0, 9.0], r: 9.9 },
      { make: tramMast, n: 5, gap: 28, side: 'alt', reg: true, xr: [4.7, 4.7] }, { make: kraam, n: 8, gap: 18, side: 'both', xr: [5.7, 5.8], r: 0.9 },
      { make: paaltjes, n: 8, gap: 18, side: 'alt', xr: [4.4, 4.4], r: 0.3 }, { make: fietsen, n: 5, gap: 26, side: 'both', xr: [5.3, 5.5], r: 0.6 },
      { make: lamp, n: 4, gap: 36, side: 'alt', reg: true, xr: [4.75, 4.75] }, { make: wegwijzer, n: 1, gap: 150, side: 'both', xr: [4.6, 4.6], r: 0.5 },
      { make: lang, n: 2, gap: 70, side: 'both', xr: [5.0, 5.5], r: 0.6 }, { make: 'zombieWalk', n: 7, gap: 20, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] }),
    // the Damrak and the Dam: a row of houses on the left, tram rails and wires, the open square on the right with the palace or the station
    square: base => Object.assign({}, base, { fog: 0x5a5858, fogD: 0.0145, night: 0.16, ground: 0x1c1c21, groundY: -0.05, canal: 0, curv: 0.0014, landmark: false, verge: 'tiles', road: { tone: rails(), rails: 1 }, spawn: [
      { make: landmark, n: 2, gap: 120, side: 'right', xr: [28, 31], y: 0, r: 12 },
      { make: K => row(K, { len: 22, n: 4, lit: 0.45, shop: 0.5, dx: -1.35 }), n: 7, gap: 22, side: 'left', reg: true, xr: [8.15, 8.15], r: 10.9 },
      { make: tramMast, n: 5, gap: 28, side: 'alt', reg: true, xr: [4.7, 4.7] }, { make: elm, n: 8, gap: 20, side: 'right', xr: [7, 13], r: 0.9 },
      { make: paaltjes, n: 8, gap: 18, side: 'both', xr: [4.4, 4.4], r: 0.3 }, { make: fietsen, n: 6, gap: 24, side: 'both', xr: [5.3, 5.6], r: 0.6 },
      { make: lamp, n: 5, gap: 28, side: 'right', reg: true, xr: [4.75, 4.75] }, { make: kraam, n: 2, gap: 70, side: 'right', xr: [6.0, 6.2], r: 0.9 },
      { make: K => row(K, { len: 26, n: 5, lit: 0.35, floors: [4, 4, 5] }), n: 4, gap: 40, side: 'right', reg: true, xr: [48, 50], r: 12 },
      { make: wegwijzer, n: 1, gap: 150, side: 'right', xr: [4.6, 4.6], r: 0.5 },
      { make: lang, n: 2, gap: 70, side: 'both', xr: [5.0, 6.0], r: 0.6 }, { make: 'zombieWalk', n: 6, gap: 26, side: 'both', xr: [5.0, 6.0], r: 0.6 } ] }),
    // the Amstel: the river on the left with the Magere Brug, houseboats and a rowing eight, the Amsteldijk's houses on the right, the Riekermolen across
    dyke: base => quay(base, { fog: 0x56575a, fogD: 0.0135, night: 0.16, open: true, waterK: 0.26, canal: -1, curv: 0.0016, landmark: false, road: { tone: '#55302b' }, spawn: [
      { make: magereBrug, n: 2, gap: 120, side: 'left', xr: [7.62, 7.62], r: 4 }, { make: K => brug(K, 'drie'), n: 1, gap: 200, side: 'left', xr: [7.62, 7.62], r: 4.6 },
      { make: K => woonboot(K), n: 4, gap: 45, side: 'left', xr: [11.5, 11.9], y: -1.0, r: 8.5 }, { make: roeiboot, n: 2, gap: 90, side: 'left', xr: [16, 22], y: -1.0, r: 3 },
      { make: K => row(K, { len: 24, n: 4, lit: 0.4, dx: -1.35, floors: [3, 3, 4] }), n: 6, gap: 24, side: 'right', reg: true, xr: [9.6, 9.6], r: 11.9 },
      { make: lamp, n: 7, gap: 22, side: 'right', reg: true, xr: [4.75, 4.75] }, { make: lampKade, n: 4, gap: 40, side: 'left', reg: true, xr: [4.75, 4.75] },
      { make: elm, n: 6, gap: 24, side: 'left', xr: [6.8, 7.1], r: 0.9 }, { make: K => K.windmill(), n: 1, gap: 260, side: 'left', xr: [36, 40], y: -1.1, r: 4 },
      { make: fietsen, n: 3, gap: 50, side: 'right', xr: [5.3, 5.6], r: 0.6 }, { make: paaltjes, n: 4, gap: 40, side: 'right', xr: [4.4, 4.4], r: 0.3 },
      { make: wegwijzer, n: 1, gap: 180, side: 'right', xr: [4.6, 4.6], r: 0.5 }, { make: 'zombieWalk', n: 4, gap: 45, side: 'right', xr: [4.8, 5.4], r: 0.6 } ] }),
  };

  T.amsterdam = {
    style: { brick: BRICK, gables: 0.95, height: [10, 13], width: [3.6, 4.6], lamp: 'classic' },
    themes,
    get sky() { const g = GLOWS.slice(); if (isWallen()) g.push({ az: 12, el: 1, w: 90, h: 10, color: 0xff2a50, a: 0.26 }, { az: -30, el: 2, w: 60, h: 8, color: 0xff3a8a, a: 0.14 }); if (isFinale()) g.push({ az: -60, el: 4, w: 150, h: 16, color: 0xb4c4d8, a: 0.2 }, { az: -60, el: 1, w: 100, h: 8, color: 0xe0a8a0, a: 0.12 }); return { stars: 0, clouds: 0.85, glows: g }; },
    light: { lamp: 0xffc07a },
    dead: { pool: ['adamtoerist', 'adamtoerist', 'mokummer', 'mokummer', 'adamselfie', 'adamgids', 'phone', 'plain'], dress },
    lamp,
    landmark,
    skyline,
    extra: [],
    shops: ['KAASHANDEL', 'BLOEMEN', 'STROOPWAFELS', 'PATAT', 'HARING', 'FIETSEN', 'DROGISTERIJ', 'BRUIN CAFÉ'],
    signs: PLACES,
  };
})();
