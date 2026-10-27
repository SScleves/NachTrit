// Intro panel 7 in 3D: "The language had been ignored for years. Every time someone tried, the Dutch switched to English. One night it left."
// A shopping street in Gouda, the night the language left. The shot builds the street itself (the theme's own houses, lamps
// and props are hidden) so its windows, signs and lamps can go out; intro3d/shot-11.js builds the same street from the same
// seed and brings them back. The eye stands near the start of the street and looks along it, toward plus z, where the mist
// closes the far end. Two beats:
// 1. 0 to 4.9 s: lit windows, tulip lamps on their wires, painted shop signs in Dutch. People stand in the street on their
//    phones ("omg, same"). A small glowing 'hallo?' drifts out of the baker's door to the nearest of them. Without looking
//    up she says "Sorry, English?", and the hanging signs turn over one by one down the street: BAKKER to BAKERY, KAAS to
//    CHEESE, FIETSEN to BIKES and on into the mist. 'hallo?' droops.
// 2. From 4.9 s: the language leaves. Glowing Dutch words drift out of the windows and doors, rise over the street and stream
//    away down it into the mist like a flock, 'gezellig' in front, 'de' and 'het' squabbling as a pair. Behind them the
//    street goes dark, window by window, then the lamps. 'doei' is the last and the smallest: it hangs down the street,
//    waving, until the mist closes. The eye rises to watch them go and keeps drifting over the dark street.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const SEED = 711, DEG = Math.PI / 180;
  // ---- the street, the same in shot 11. Down the street is plus z; the houses stand as the game's terraces do
  const FX = 5.7, PITCH = 6.05, NH = 17, ROW0 = { '-1': -88, '1': -89 };   // house fronts, one house per 6.05 m, houses per row, the first house
  const SHOPS = [   // [side, house, Dutch, English, board]: they turn in this order, the nearest first
    [-1, 4, 'BAKKER', 'BAKERY', '#3c2216'], [1, 4, 'KAAS', 'CHEESE', '#1c2c3e'], [-1, 6, 'FIETSEN', 'BIKES', '#1b3626'], [1, 6, 'SLAGER', 'BUTCHER', '#40161a'],
    [-1, 8, 'BLOEMEN', 'FLOWERS', '#2c2444'], [1, 8, 'APOTHEEK', 'PHARMACY', '#163b37'], [-1, 10, 'KAPPER', 'BARBER', '#2a2a34'], [1, 10, 'FRIET', 'FRIES', '#3e2b10'],
  ];
  const LAMPZ = [-63, -47, -31, -15, 1];                                     // Gouda's tulips on wires across the street
  const BW = 1.7, BH = 0.62, SIGN_Y = 3.3;                                   // a hanging sign's board, and its height
  const WIN_RGB = [1.0, 0.62, 0.27];                                         // window light: candle amber
  const CELL = i => [i / 6, 0.5, (i + 1) / 6, 1], SHOP_UV = [0, 0, 0.5, 0.5];   // the game's window atlas: lit panes 0 to 2, a shop
  // ---- this shot
  const T_HALLO = 1.25, T_SORRY = 2.6, T_FLIP = 2.95, FLIP_GAP = 0.32, T_GO = 4.9, DOEI_Z = -52;
  const A_AT = [1.6, -71], B_AT = [-2.3, -61], C_AT = [2.6, -50];         // the people on their phones
  const MIN_HALF_W = 21, MIN_HALF_V = 13;                                     // a narrow or short picture widens the lens until this much shows
  const WORDS = ['gezellig', 'de', 'het', 'doei', 'hallo?', 'lekker', 'dank je wel', 'alsjeblieft', 'fiets', 'kaas', 'brood', 'koffie', 'gewoon', 'nou',
    'toch', 'even', 'jammer', 'proost', 'eet smakelijk', 'welterusten', 'goedemorgen', 'tot ziens', 'borrel', 'mooi', 'lief', 'ja', 'nee', 'hoor',
    'gedoe', 'uitwaaien', 'graag', 'natuurlijk', 'misschien', 'straks', 'echt', 'huis', 'regen', 'gracht', 'stroopwafel', 'hagelslag', 'oma', 'fijn'];
  let st = null;

  function rng(a) { return () => { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hash(a, b) { let h = Math.imul((a | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul((b | 0) + 0x7f4a7c15, 0xc2b2ae35); h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return (h >>> 0) / 4294967296; }
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
  function ownTex(W, c, colour) { const t = new W.THREE.CanvasTexture(c); if (colour) t.colorSpace = W.THREE.SRGBColorSpace; st.tex.push(t); return t; }
  function ownMat(m) { st.mats.push(m); return m; }
  function ownGeo(g) { st.geo.push(g); return g; }
  const ease = (W, t, t0, len) => W.smooth(W.clamp((t - t0) / len, 0, 1));

  // ---- quads: a centre, a right and an up vector, half sizes and an uv rectangle [u0, v0, u1, v1]
  function putQuad(P, U, i, cx, cy, cz, rx, ry, rz, ux, uy, uz, hw, hh, uv) {
    const p = i * 12;
    P[p] = cx - rx * hw - ux * hh; P[p + 1] = cy - ry * hw - uy * hh; P[p + 2] = cz - rz * hw - uz * hh;
    P[p + 3] = cx + rx * hw - ux * hh; P[p + 4] = cy + ry * hw - uy * hh; P[p + 5] = cz + rz * hw - uz * hh;
    P[p + 6] = cx + rx * hw + ux * hh; P[p + 7] = cy + ry * hw + uy * hh; P[p + 8] = cz + rz * hw + uz * hh;
    P[p + 9] = cx - rx * hw + ux * hh; P[p + 10] = cy - ry * hw + uy * hh; P[p + 11] = cz - rz * hw + uz * hh;
    if (U && uv) { const t = i * 8; U[t] = uv[0]; U[t + 1] = uv[1]; U[t + 2] = uv[2]; U[t + 3] = uv[1]; U[t + 4] = uv[2]; U[t + 5] = uv[3]; U[t + 6] = uv[0]; U[t + 7] = uv[3]; }
  }
  function quadColor(A, size, i, r, g, b, a) { for (let k = 0; k < 4; k++) { const o = (i * 4 + k) * size; A[o] = r; A[o + 1] = g; A[o + 2] = b; if (size === 4) A[o + 3] = a; } }
  function quadMesh(W, n, colorSize, mat, dynamic) {
    const THREE = W.THREE, g = new THREE.BufferGeometry(), use = a => { if (dynamic) a.setUsage(THREE.DynamicDrawUsage); return a; };
    g.setAttribute('position', use(new THREE.BufferAttribute(new Float32Array(n * 12), 3)));
    g.setAttribute('uv', use(new THREE.BufferAttribute(new Float32Array(n * 8), 2)));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 4 * colorSize), colorSize).setUsage(THREE.DynamicDrawUsage));
    const idx = n * 4 > 65535 ? new Uint32Array(n * 6) : new Uint16Array(n * 6);
    for (let i = 0; i < n; i++) idx.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3], i * 6);
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    const m = new THREE.Mesh(ownGeo(g), mat); m.frustumCulled = false; return m;
  }

  // ---- canvases: the glow of a window on the brick and its streak on the wet stones (as the game's window atlas has them), the words
  function glowAtlas(W, streak) {
    const [c, g] = canvas(256, 128), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,255,255,.9)'); r.addColorStop(0.3, 'rgba(255,255,255,.45)'); r.addColorStop(0.65, 'rgba(255,255,255,.1)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    if (streak && streak.image) g.drawImage(streak.image, 128, 0, 128, 128);
    return ownTex(W, c, false);
  }
  function wordAtlas(W) {
    const CW = 2048, CH = 1024, RH = 100, FS = 60, PAD = 30, [c, g] = canvas(CW, CH), cells = {};
    g.font = `600 ${FS}px "Segoe UI", system-ui, sans-serif`; g.textBaseline = 'middle';
    let x = 0, y = 0;
    for (const w of WORDS) {
      const tw = Math.ceil(g.measureText(w).width) + PAD * 2;
      if (x + tw > CW) { x = 0; y += RH; }
      g.save(); g.shadowColor = 'rgba(255,186,96,1)'; g.shadowBlur = 14; g.fillStyle = '#ffe9c8'; g.fillText(w, x + PAD, y + RH / 2); g.restore();
      g.fillStyle = '#fffaf0'; g.fillText(w, x + PAD, y + RH / 2);
      cells[w] = [x / CW, 1 - (y + RH) / CH, (x + tw) / CW, 1 - y / CH, tw / RH];
      x += tw;
    }
    const hx = CW - 128, hy = CH - 128, r = g.createRadialGradient(hx + 64, hy + 64, 0, hx + 64, hy + 64, 64);   // a soft round glow: halos, motes, light on the stones
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.2, 'rgba(255,255,255,.6)'); r.addColorStop(0.5, 'rgba(255,255,255,.16)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(hx, hy, 128, 128);
    cells.halo = [(hx + 2) / CW, 1 - (hy + 126) / CH, (hx + 126) / CW, 1 - (hy + 2) / CH, 1];
    const t = ownTex(W, c, true); t.anisotropy = 4;
    return { tex: t, cells };
  }
  // a shop's board: in Dutch the painted board with a gilt edge and gilt capitals, in English a flat grey board, plain white letters
  function fit(g, text, weight, family, size, maxW, spacing) {
    let fs = size;
    for (;;) { g.font = `${weight} ${fs}px ${family}`; if ('letterSpacing' in g) g.letterSpacing = Math.round(fs * spacing) + 'px'; if (g.measureText(text).width <= maxW || fs < 14) return fs; fs = Math.floor(fs * 0.93); }
  }
  function paintBoard(g, w, h, text, en, col) {
    g.setTransform(1, 0, 0, 1, 0, 0); g.shadowColor = 'rgba(0,0,0,0)'; g.clearRect(0, 0, w, h);
    const m = h * 0.09; g.textAlign = 'center'; g.textBaseline = 'middle';
    if (!en) {
      g.fillStyle = col; g.fillRect(0, 0, w, h);
      let gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0.10)'); gr.addColorStop(1, 'rgba(0,0,0,0.32)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#b8924a'; g.lineWidth = h * 0.035; g.strokeRect(m, m, w - 2 * m, h - 2 * m);
      g.strokeStyle = 'rgba(184,146,74,0.5)'; g.lineWidth = h * 0.012; g.strokeRect(m * 1.75, m * 1.75, w - 3.5 * m, h - 3.5 * m);
      const fs = fit(g, text, 'bold', 'Georgia, "Times New Roman", serif', Math.round(h * 0.56), w - 5 * m, 0.08);
      gr = g.createLinearGradient(0, h / 2 - fs / 2, 0, h / 2 + fs / 2); gr.addColorStop(0, '#f8e09c'); gr.addColorStop(0.55, '#dcae58'); gr.addColorStop(1, '#a87a34');
      g.fillStyle = gr; g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 4; g.shadowOffsetX = 2; g.shadowOffsetY = 3;
      g.fillText(text, w / 2, h / 2 + fs * 0.05);
    } else {
      g.fillStyle = '#2b2e34'; g.fillRect(0, 0, w, h);
      const fs = fit(g, text, '600', '"Segoe UI", Arial, sans-serif', Math.round(h * 0.5), w - 4 * m, 0.02);
      g.fillStyle = '#f1f1ec'; g.fillText(text, w / 2, h / 2 + fs * 0.04);
    }
    g.shadowColor = 'rgba(0,0,0,0)'; if ('letterSpacing' in g) g.letterSpacing = '0px';
  }
  function paintSign(S, lang) {
    S.lang = lang; const en = lang === 'en', text = en ? S.en : S.nl;
    paintBoard(S.g, 512, 192, text, en, S.col); S.tex.needsUpdate = true;
    if (S.fc) { paintBoard(S.fc.g, 512, 136, text, en, S.col); S.fc.t.needsUpdate = true; }
  }

  // ---- the street
  // the light of a window: its pane in the lit layer, its glow on the brick, and for the lower floors its streak on the stones
  function addWin(s, y, z, w, h, r, uv, litQ, glowQ, shop) {
    const win = { id: st.win.length, s, x: s * (FX - 0.045), y, z, r, shop: !!shop, lv: -1, on0: false, tOff: 1e9, tOn: 1e9 };
    win.li = litQ.length; litQ.push([win.x, y, z, w, h, s, uv]);
    win.gq = [glowQ.length]; glowQ.push([0, s * (FX - 0.08), y + (shop ? 0.1 : 0), z, shop ? 6.2 : 2.5, shop ? 4.2 : 2.9, s, shop ? 0.55 : 0.42]);
    if (r < 2) { win.gq.push(glowQ.length); glowQ.push([1, s * (FX - (shop ? 1.0 : 0.95)), 0.09, z, shop ? 2.6 : 0.9, shop ? 4.5 : 3.2 + r * 1.6, s, shop ? 0.5 : 0.4]); }
    st.win.push(win); return win;
  }
  // the textures of the game's lamp light (halo, cone, pool and its reflection), taken from one of the town's own lamps
  function lampTextures(W) {
    const ref = W.lamppost(), T = {};
    ref.traverse(m => {
      if (m.isSprite) { if (m.center.y > 0.9) T.cone = m.material.map; else T.halo = m.material.map; }
      else if (m.isMesh && m.geometry === W.PG.pool) T.pool = m.material.map;
      else if (m.isMesh && m.geometry === W.PG.streak) T.streak = m.material.map;
    });
    ref.traverse(m => { if (m.isMesh && m.geometry && m.geometry.userData.kit) m.geometry.dispose(); });
    T.halo = T.halo || W.glowTex; T.cone = T.cone || W.glowTex; T.pool = T.pool || W.glowTex; T.streak = T.streak || W.glowTex;
    return T;
  }
  // the theme's own street goes (its houses, lamps, props and dead), and with it the ground mist standing across the road in
  // front of this low eye: on an upright phone the line where such a bank meets the stones would show
  function clearStreet(W) {
    W.hide((m, o) => o ? Math.abs(o.bx) < 30 : !!(m.isSprite && m.userData.band && m.position.z > -86 && m.position.z < -44));
  }
  function street(W) {
    const THREE = W.THREE, T = lampTextures(W), litQ = [], glowQ = [];
    st.houses = []; st.win = []; st.signs = []; st.lamps = []; st.icons = {};
    st.plane = ownGeo(new THREE.PlaneGeometry(1, 1));
    // the two rows: the game's houses, one kit per side, so a side is one mesh per material
    for (const s of [-1, 1]) {
      const g = new THREE.Group(), k = W.kit();
      for (let i = 0; i < NH; i++) {
        const Zh = ROW0[s] + i * PITCH, oz = s < 0 ? -Zh : Zh, shop = SHOPS.find(p => p[0] === s && p[1] === i) || null;
        const h = W.rnd(7.4, 9.6), w = W.rnd(3.6, 4.4), n0 = g.children.length;
        W.house({ k, g, w, h, ox: w / 2 - 2.2, oz, gable: W.pick(['step', 'step', 'bell', 'neck', 'spout']), sign: shop ? shop[2] : null, lit: 0, peer: false });
        k.base.identity();
        const H = { s, i, Zh, shop, win: [], door: [s * (FX - 0.35), 1.3, s < 0 ? Zh - 2.1 : Zh + 2.1] };
        if (shop) H.fascia = g.children.slice(n0).find(m => m.isMesh && m.userData.ownTex);
        // every window gets a dark pane of the atlas over the house's own, and a place in the light layer
        const rows = Math.max(1, Math.round((h - 1.2) / 2.3));
        for (let r = 0; r < rows; r++) for (let c = 0; c < 3; c++) {
          const zc = -1.95 + c * 2.1, y = 1.9 + r * 2.3;
          if (r === 0 && (shop || Math.abs(zc - 2.1) < 1.0)) continue;
          W.kadd(k, W.PG[Math.random() < 0.72 ? 'win4' : 'win5'], W.PM.winAtlas, -2.222, y, oz + zc, 0, -Math.PI / 2, 0, 0.95, 1.5);
          H.win.push(addWin(s, y, s < 0 ? Zh - zc : Zh + zc, 0.95, 1.5, r, CELL(W.pick([0, 0, 1, 1, 2])), litQ, glowQ));
        }
        if (shop) {   // dark glass over the shop's own lit interior; the light layer brings the interior back
          W.kadd(k, W.PG.win4, W.PM.winAtlas, -2.232, 1.4, oz - 0.6, 0, -Math.PI / 2, 0, 3.6, 1.8);
          H.shopWin = addWin(s, 1.4, s < 0 ? Zh + 0.6 : Zh - 0.6, 3.6, 1.8, 0, SHOP_UV, litQ, glowQ, true); H.win.push(H.shopWin);
        }
        st.houses.push(H);
      }
      W.kbuild(k, g);
      g.traverse(m => {
        if (!m.isMesh || !m.material) return;
        if (m.material.blending === THREE.AdditiveBlending) m.visible = false;   // the houses' own window glow: ours can go out
        else if (m.material === W.PK.sign) { m.material = st.icons[s] = ownMat(W.PK.sign.clone()); }   // the hanging trade signs, to dim with their side of the street
      });
      st.props.push(W.add(g, s * 7.9, 0, 0, s < 0 ? Math.PI : 0));
    }
    // the light layer: every pane in one mesh, and every glow and streak in another, coloured per window
    const lit = quadMesh(W, litQ.length, 4, ownMat(new THREE.MeshBasicMaterial({ map: W.PM.winAtlas.map, vertexColors: true, transparent: true, depthWrite: false })));
    const LP = lit.geometry.attributes.position.array, LU = lit.geometry.attributes.uv.array;
    litQ.forEach((q, i) => putQuad(LP, LU, i, q[0], q[1], q[2], 0, 0, q[5], 0, 1, 0, q[3] / 2, q[4] / 2, q[6]));
    lit.renderOrder = -1; st.litCol = lit.geometry.attributes.color; st.props.push(W.add(lit, 0, 0, 0));
    const glow = quadMesh(W, glowQ.length, 3, ownMat(W.GlowMat(glowAtlas(W, T.streak), 0xffffff, 1, false, { vertexColors: true })));
    const GP = glow.geometry.attributes.position.array, GU = glow.geometry.attributes.uv.array;
    glowQ.forEach((q, i) => {
      if (q[0] === 0) putQuad(GP, GU, i, q[1], q[2], q[3], 0, 0, q[6], 0, 1, 0, q[4] / 2, q[5] / 2, [0, 0, 0.5, 1]);
      else putQuad(GP, GU, i, q[1], q[2], q[3], 1, 0, 0, 0, 0, -1, q[4] / 2, q[5] / 2, [0.5, 0, 1, 1]);
    });
    st.glowK = glowQ.map(q => q[7]); glow.renderOrder = -1; st.glowCol = glow.geometry.attributes.color; st.props.push(W.add(glow, 0, 0, 0));
    // the hanging signs: an iron bracket from the wall, a board that turns on a swivel; the board over the window gets the same paint
    const kb = W.kit();
    SHOPS.forEach((p, n) => {
      const [s, i, nl, en, col] = p, H = st.houses.find(h => h.s === s && h.i === i);
      const z = s < 0 ? H.Zh - 2.65 : H.Zh + 2.65, x = s * (FX - 1.15);
      W.kb(kb, W.PM.pole, s * (FX - 1.05), 3.98, z, 2.1, 0.05, 0.05);
      W.ktube(kb, W.PM.pole, s * FX, 3.32, z, s * (FX - 1.4), 3.97, z, 0.02);
      W.kb(kb, W.PM.pole, x, 3.8, z, 0.025, 0.34, 0.025);
      W.kadd(kb, W.KG.ball, W.PM.pole, s * (FX - 2.13), 3.98, z, 0, 0, 0, 0.09, 0.09, 0.09);
      W.kb(kb, W.PM.pole, s * (FX - 0.03), 3.66, z, 0.06, 0.74, 0.16);
      const [c, g] = canvas(512, 192), tex = ownTex(W, c, true), mat = ownMat(new THREE.MeshBasicMaterial({ map: tex, color: 0xdddddd }));
      tex.anisotropy = 4;
      const pv = new THREE.Group(), frame = new THREE.Mesh(W.KG.box, W.M.wood); frame.scale.set(BW + 0.1, BH + 0.1, 0.045); pv.add(frame);
      for (const sd of [-1, 1]) { const f = new THREE.Mesh(st.plane, mat); f.scale.set(BW, BH, 1); f.position.z = sd * 0.026; if (sd < 0) f.rotation.y = Math.PI; pv.add(f); }
      st.props.push(W.add(pv, x, SIGN_Y, z, 0));
      let fc = null;
      if (H.fascia) {
        const [c2, g2] = canvas(512, 136), t2 = ownTex(W, c2, true), old = H.fascia.material;
        if (old.map) old.map.dispose(); old.dispose();
        H.fascia.material = ownMat(new THREE.MeshBasicMaterial({ map: t2, color: 0xcccccc })); fc = { g: g2, t: t2, m: H.fascia.material };
      }
      const S = { n, s, nl, en, col, pv, g, tex, mat, fc, H, x, y: SIGN_Y, z, lang: '', dir: n % 2 ? 1 : -1, t0: 1e9, b: -1 };
      paintSign(S, 'nl'); st.signs.push(S);
    });
    st.props.push(W.add(W.kbuild(kb), 0, 0, 0));
    // the lamps: a tulip hanging from a wire, facade to facade; the light round it (the game's lamp light) is ours to put out
    const kl = W.kit(), y0 = 7.75, ym = 7.05, hy = ym - 0.66;
    for (const z of LAMPZ) {
      W.ktube(kl, W.PM.pole, -FX, y0, z, 0, ym, z, 0.013); W.ktube(kl, W.PM.pole, 0, ym, z, FX, y0, z, 0.013);
      for (const s of [-1, 1]) W.kb(kl, W.PM.pole, s * (FX - 0.05), y0, z, 0.1, 0.1, 0.1);
      W.kb(kl, W.PM.pole, 0, ym - 0.15, z, 0.04, 0.3, 0.04);
      W.kadd(kl, W.KG.dome, W.PM.pole, 0, ym - 0.56, z, 0, 0, 0, 0.6, 0.64, 0.6);
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; W.kadd(kl, W.KG.cyl, W.PM.pole, Math.cos(a) * 0.26, ym - 0.66, z + Math.sin(a) * 0.26, Math.cos(a) * 0.5, 0, -Math.sin(a) * 0.5, 0.1, 0.22, 0.1); }
    }
    st.props.push(W.add(W.kbuild(kl), 0, 0, 0));
    st.glassOff = ownMat(new THREE.MeshBasicMaterial({ color: 0x1a1c20 }));
    for (const z of LAMPZ) {
      const L = { z, lv: -1, tOn: 1e9, tOff: 1e9, on: ownMat(new THREE.MeshBasicMaterial({ color: 0xffe6b4, fog: false })) };
      L.glass = W.add(new THREE.Mesh(W.KG.ball, L.on), 0, ym - 0.62, z); L.glass.scale.set(0.38, 0.26, 0.38);
      L.halo = W.add(new THREE.Sprite(ownMat(W.GlowMat(T.halo, 0xffd29a, 0.8, true))), 0, hy - 0.08, z); L.halo.scale.set(2.7, 2.7, 1);
      L.cone = new THREE.Sprite(ownMat(W.GlowMat(T.cone, 0xd8c49c, 0.42, true))); L.cone.center.set(0.5, 1); L.cone.scale.set(3.4, 6.0, 1); L.cone.renderOrder = 4; W.add(L.cone, 0, hy - 0.2, z);
      L.pool = W.add(new THREE.Mesh(W.PG.pool, ownMat(W.GlowMat(T.pool, 0xb4a07a, 0.95))), 0, 0.11, z); L.pool.scale.setScalar(1.15); L.pool.renderOrder = 2;
      L.streak = W.add(new THREE.Mesh(W.PG.streak, ownMat(W.GlowMat(T.streak, 0xd8c49a, 0.9))), 0, 0.12, z - 5); L.streak.renderOrder = 3;
      st.lamps.push(L);
    }
    // the church at the end of the street, deep in the mist: the tower toward us
    const ch = W.church(); ch.traverse(m => { if (m.isMesh) { ownGeo(m.geometry); if (m.material === W.PM.window) m.visible = false; } });
    W.add(ch, 0, 0, 17, Math.PI);
    // the street's furniture: bikes at the kerb, cheese stacked by the cheese shop, a bin, a bench
    for (const [make, x, z, ry] of [[W.bikeRow, -4.95, -75, Math.PI], [W.bikeRow, 4.95, -57.5, 0], [W.bins, 5.05, -78.5, 0], [cheese, 5.05, -60.6, 0], [W.bikeRow, -4.95, -47, Math.PI], [W.bench, -5.0, -36, Math.PI]]) {
      st.props.push(W.add(make(), x, 0, z, ry));
    }
    function cheese() {   // wheels on a pallet, more on top, left out after the market
      const k = W.kit(), cm = st.cheeseMat || (st.cheeseMat = ownMat(W.Mat({ color: 0xb98a36 }))); W.kb(k, W.M.wood, 0, 0.08, 0, 1.2, 0.16, 2.0);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) W.kadd(k, W.KG.cyl, cm, -0.28 + c * 0.56, 0.3, -0.62 + r * 0.62, 0, 0, 0, 0.54, 0.26, 0.54);
      for (let r = 0; r < 2; r++) W.kadd(k, W.KG.cyl, cm, 0.02, 0.56, -0.31 + r * 0.62, 0, 0, 0, 0.52, 0.25, 0.52);
      return W.kbuild(k);
    }
  }
  function setWin(win, lv) {
    if (win.lv === lv) return; win.lv = lv;
    const b = 0.45 + 0.4 * lv; quadColor(st.litCol.array, 4, win.li, b, b, b, lv);
    for (const q of win.gq) { const k = st.glowK[q] * lv; quadColor(st.glowCol.array, 3, q, WIN_RGB[0] * k, WIN_RGB[1] * k, WIN_RGB[2] * k); }
    st.dirty = true;
  }
  function setLamp(L, lv) {
    if (L.lv === lv) return; L.lv = lv;
    L.glass.material = lv > 0.02 ? L.on : st.glassOff; L.on.color.setRGB(0.15 + 0.85 * lv, 0.13 + 0.77 * lv, 0.11 + 0.6 * lv);
    L.halo.material.opacity = 0.75 * lv; L.cone.material.opacity = 0.3 * lv; L.pool.material.opacity = 0.95 * lv; L.streak.material.opacity = 0.9 * lv;   // never hidden: a dark lamp's shaders are ready before it catches
  }
  function setSign(S, b) {
    if (Math.abs(S.b - b) < 0.004) return; S.b = b;
    S.mat.color.setScalar(b); if (S.fc) S.fc.m.color.setScalar(b * 0.92);
  }
  // the trade signs of a side go dark with its shops
  function dimIcons() {
    for (const s of [-1, 1]) {
      const m = st.icons[s]; if (!m) continue;
      let a = 0, n = 0; for (const H of st.houses) if (H.s === s && H.shopWin) { a += Math.max(0, H.shopWin.lv); n++; }
      m.color.setHex(0xd8ccb0).multiplyScalar(0.28 + 0.72 * (n ? a / n : 1));
    }
  }
  // a board's turn: half a turn in one unit of k, then a short wobble on the swivel
  function flipAngle(k) {
    if (k <= 0) return 0;
    if (k < 1) return Math.PI * (1 - Math.cos(Math.PI * k)) / 2;
    const s = k - 1; return Math.PI + 0.24 * Math.sin(s * 11) * Math.exp(-s * 5);
  }

  // ---- people: the living, from the game's passenger figure; no aura, no glowing eyes, dark winter coats, a phone before the face
  function person(W, o) {
    const THREE = W.THREE, g = W.ghostFigure(true, 'plain', false, 0);
    const drop = []; g.traverse(m => { if (m.isSprite) drop.push(m); });
    for (const s of drop) { s.parent.remove(s); s.material.dispose(); }   // a clone; its texture is the shared glow
    let arm = null;
    g.traverse(m => {
      if (!m.isMesh) return;
      if (m.geometry === W.PG.pEye) { m.visible = false; return; }
      const mt = m.material; if (!st.mats.includes(mt)) st.mats.push(mt);   // ghostFigure(true) cloned these for this figure
      mt.transparent = false; mt.opacity = 1; mt.needsUpdate = true;
      if (m.geometry === W.PG.pHead) { mt.color.set(o.skin); if (mt.emissive) { mt.emissive.set(0x1e140e); mt.emissiveIntensity = 1; } }
      else if (m.geometry === W.PG.pHair) { mt.color.set(o.hair); if (mt.emissive) mt.emissive.set(0x000000); }
      else if (m.geometry === W.PG.pLimb) { mt.color.set(0x16181d); if (mt.emissive) mt.emissive.set(0x000000); }
      else { mt.color.set(o.coat); if (mt.emissive) { mt.emissive.set(o.coat); mt.emissiveIntensity = 0.16; } if (m.geometry === W.PG.pArm && m.position.x > 0) arm = m; }
    });
    if (arm) {   // the right arm bends up to the phone
      const pv = new THREE.Group(); pv.position.set(0.27, 1.76, 0.03); g.remove(arm); pv.add(arm);
      arm.position.set(0, -0.25, 0); arm.rotation.set(0, 0, 0); arm.scale.set(1, 0.68, 1); pv.rotation.set(-1.25, 0, -0.42); g.add(pv);
    }
    const ph = new THREE.Group(); ph.position.set(0.08, 1.64, 0.45); ph.rotation.x = 0.6;
    const body = new THREE.Mesh(W.KG.box, W.PM.pole); body.scale.set(0.075, 0.15, 0.012); ph.add(body);
    const scr = new THREE.Mesh(st.plane, W.PK.phone); scr.scale.set(0.064, 0.13, 1); scr.position.z = -0.007; scr.rotation.y = Math.PI; ph.add(scr);
    const gl = new THREE.Sprite(st.phoneGlow); gl.scale.set(1.1, 1.1, 1); gl.position.z = -0.14; ph.add(gl);
    g.add(ph);
    g.scale.setScalar(o.scale || 0.9);
    return { g, ph, ry: 0 };
  }

  // ---- the words. Each has a source (a window or a door), a time it comes out and its place in the stream
  function departures(W) {
    const R = Math.random, srcs = [];
    for (const H of st.houses) {
      if (H.Zh > -30 || H.Zh < -72) continue;
      for (const w of H.win) if (w.on0 && !w.shop && w.z > -69 && w.y < 6.6) srcs.push({ x: w.x - w.s * 0.2, y: w.y, z: w.z, win: w, side: w.s });
      if (H.door[2] > -69) srcs.push({ x: H.door[0], y: H.door[1], z: H.door[2], side: H.s, door: true });
    }
    const near = (side, z0, z1, door) => { const i = srcs.findIndex(p => p.side === side && p.z > z0 && p.z < z1 && !!p.door === !!door && !p.used); if (i < 0) return srcs.find(p => !p.used); return srcs[i]; };
    const bakker = st.houses.find(h => h.s === -1 && h.i === 4);
    const W0 = (text, src, e, o) => { if (src) src.used = true; const wd = Object.assign({ id: st.words.length, text, src, e, lx: 0, ly: 3.4, v0: 2.6, acc: 3.0, size: 1, ph: R() * 6.28, J: 1.15 }, o); st.words.push(wd); if (src && src.win) src.win.tOff = Math.min(src.win.tOff, e + 0.3); return wd; };
    // the parts: 'hallo?' from the baker's door to her, 'gezellig' first away, the pair, 'doei' last of all
    st.hallo = W0('hallo?', null, T_GO + 0.05, { lx: 0.9, ly: 1.95, v0: 1.0, acc: 1.5, size: 0.8, J: 1.4, hallo: true });
    st.halloSrc = { x: bakker.door[0] + 0.15, y: 1.35, z: bakker.door[2] };
    W0('gezellig', near(-1, -73, -60, false), T_GO - 0.05, { lx: 0.1, ly: 4.6, v0: 3.0, acc: 3.4, size: 1.45, J: 1.0 });
    const pair = { lx: -0.5, ly: 3.3, v0: 1.8, acc: 2.2, size: 1.0, J: 1.2 };
    W0('de', near(1, -66, -52, false), T_GO + 0.3, Object.assign({ pair: 0 }, pair));
    W0('het', near(1, -66, -52, false), T_GO + 0.36, Object.assign({ pair: 1 }, pair));
    const rest = WORDS.filter(w => !['gezellig', 'de', 'het', 'doei', 'hallo?'].includes(w));
    srcs.sort((a, b) => (a.z + R() * 26) - (b.z + R() * 26));
    let n = 0;
    for (const text of rest) {
      const src = srcs.find(p => !p.used); if (!src) break;
      const rank = n++ / rest.length, e = T_GO + 0.05 + 1.9 * rank + R() * 0.3;
      W0(text, src, e, { lx: (R() * 2 - 1) * 3.2, ly: 2.5 + R() * 4.2, v0: 1.2 + R() * 1.2, acc: 1.6 + R() * 1.4, size: 0.74 + R() * 0.3 });
    }
    W0('doei', near(-1, -70, -58, true), T_GO + 1.2, { lx: 0.2, ly: 2.7, v0: 1.8, acc: 1.4, size: 0.95, doei: true, J: 1.3 });
  }
  // where a word is at t: o gets x, y, z, size, brightness, roll; false when it is not out (yet, or any more)
  function wordAt(W, wd, t, o) {
    if (wd.hallo && t < wd.e) return halloAt(W, t, o);
    const u = t - wd.e; if (u < 0) return false;
    const src = wd.hallo ? st.halloEnd : wd.src, k = W.smooth(Math.min(1, u / wd.J));
    const d = wd.v0 * u + 0.5 * wd.acc * u * u;
    let zS = src.z + 1.2 + d, hang = 0;
    if (wd.doei && zS > DOEI_Z - 3) { hang = W.smooth(W.clamp((zS - DOEI_Z + 3) / 7, 0, 1)); zS = DOEI_Z - 3 * Math.exp(-(zS - DOEI_Z + 3) / 3); }
    const conv = W.clamp((zS - src.z) / 70, 0, 1);
    // the stream sways as one, a slow wave running down it; each word bobs on its own as well
    let sx = wd.lx * (1 - 0.25 * conv) + 1.2 * Math.sin(1.05 * t - 0.11 * zS) + 0.45 * Math.sin(0.5 * t + 0.07 * zS + 1.3) + 0.12 * Math.sin(2.3 * t + wd.ph);
    let sy = wd.ly + 1.4 * conv + 0.5 * Math.sin(0.9 * t - 0.08 * zS + 0.7) + 0.1 * Math.sin(1.9 * t + wd.ph * 1.7);
    o.roll = 0.06 * Math.sin(1.3 * t + wd.ph);
    if (wd.pair != null) {   // de and het: round and round each other, and every so often a shove
      const shove = Math.pow(Math.max(0, Math.sin(2.1 * u)), 10), a = 4.2 * u + wd.pair * Math.PI, r = 0.42 + 0.3 * shove;
      sx += r * Math.cos(a); sy += 0.16 * Math.sin(2 * a); zS += 0.3 * Math.sin(a); o.roll += (wd.pair ? 1 : -1) * 0.35 * shove;
    }
    if (hang) { const wv = Math.sin(2 * Math.PI * 1.1 * t); sx = W.lerp(sx, 0.45 * wv, hang); sy = W.lerp(sy, 2.6 + 0.1 * Math.abs(wv), hang); o.roll = W.lerp(o.roll, 0.32 * Math.sin(2 * Math.PI * 1.1 * t + 0.6), hang); }
    if (wd.hallo) o.roll = W.lerp(-0.3, o.roll, k);   // it lifts its head as it goes
    o.x = W.lerp(src.x, sx, k); o.y = W.lerp(src.y, sy, k) + 0.7 * Math.sin(Math.PI * k) * (wd.hallo ? 0.2 : 1); o.z = W.lerp(src.z, zS, k);
    o.sc = wd.size * (wd.hallo ? 0.86 : 0.3 + 0.7 * W.smooth(Math.min(1, u / 0.7)));
    o.br = (wd.hallo ? 0.58 : W.smooth(Math.min(1, u / 0.45))) * (1 - W.smooth(W.clamp((o.z + 38) / 32, 0, 1)));   // swallowed by the mist down the street
    if (wd.doei) o.br *= 1 - ease(W, t, 10.3, 0.9);
    return o.br > 0.004;
  }
  // 'hallo?' before it leaves: out of the baker's door, across to her, a hopeful bob, then it droops
  function halloAt(W, t, o) {
    if (t < T_HALLO) return false;
    const s = st.halloSrc, d = st.halloTo, k = W.smooth(W.clamp((t - T_HALLO) / 1.25, 0, 1)), a = (1 - k) * (1 - k), b = 2 * (1 - k) * k, c = k * k;
    const mx = (s.x + d.x) / 2, my = Math.max(s.y, d.y) + 1.1, mz = (s.z + d.z) / 2;
    const droop = ease(W, t, 3.05, 0.8), hop = t > T_HALLO + 1.25 ? 0.07 * Math.abs(Math.sin(9 * t)) * (1 - droop) : 0;
    o.x = a * s.x + b * mx + c * d.x; o.y = a * s.y + b * my + c * d.y + hop + 0.04 * Math.sin(2.2 * t) - 0.5 * droop; o.z = a * s.z + b * mz + c * d.z;
    o.sc = 0.8 * (0.35 + 0.65 * W.smooth(W.clamp((t - T_HALLO) / 0.5, 0, 1))) * (1 - 0.14 * droop);
    o.br = W.smooth(W.clamp((t - T_HALLO) / 0.4, 0, 1)) * (1 - 0.42 * droop);
    o.roll = -0.3 * droop + 0.05 * Math.sin(2.7 * t);
    return true;
  }
  function drawWords(W, t) {
    const cam = W.camera; cam.updateMatrixWorld(); const e = cam.matrixWorld.elements;
    const rx = e[0], ry = e[1], rz = e[2], ux = e[4], uy = e[5], uz = e[6];
    const P = st.fxPos.array, U = st.fxUv.array, Cc = st.fxCol.array, cells = st.atlas.cells, halo = cells.halo, o = st.o1, o2 = st.o2;
    let q = 0;
    const put = (x, y, z, Rx, Ry, Rz, Ux, Uy, Uz, hw, hh, uv, r, g, b) => { if (q >= st.fxN) return; putQuad(P, U, q, x, y, z, Rx, Ry, Rz, Ux, Uy, Uz, hw, hh, uv); quadColor(Cc, 3, q, r, g, b); q++; };
    let pool = 0;
    for (const wd of st.words) {
      if (!wordAt(W, wd, t, o)) continue;
      const cell = cells[wd.text], H = 0.78 * o.sc, hw = H * cell[4] / 2, hh = H / 2, b = o.br;
      const cr = Math.cos(o.roll), sr = Math.sin(o.roll);
      put(o.x, o.y, o.z, rx, ry, rz, ux, uy, uz, hw * 1.15 + 0.3 * o.sc, hh * 2.4, halo, 0.3 * b, 0.17 * b, 0.06 * b);
      put(o.x, o.y, o.z, rx * cr + ux * sr, ry * cr + uy * sr, rz * cr + uz * sr, ux * cr - rx * sr, uy * cr - ry * sr, uz * cr - rz * sr, hw, hh, cell, 1.2 * b, 0.93 * b, 0.62 * b);
      if (pool < 26 && o.y < 7) { pool++; const k = b * W.clamp(1.25 - o.y / 6, 0.15, 1) * o.sc; put(o.x, 0.07, o.z, 1, 0, 0, 0, 0, -1, 1.9, 1.9, halo, 0.2 * k, 0.12 * k, 0.045 * k); }
      for (let m = 1; m <= 3; m++) {   // motes: where it was a moment ago, scattered a little
        if (!wordAt(W, wd, t - 0.08 * m, o2)) continue;
        const j = hash(wd.id * 7 + m, Math.floor(t * 7)), j2 = hash(wd.id * 13 + m, Math.floor(t * 7) + 99), f = o2.br * (1 - m / 4), sz = (0.045 + 0.035 * j) * o.sc;
        put(o2.x + (j - 0.5) * 0.4 * o.sc, o2.y + (j2 - 0.5) * 0.3 * o.sc, o2.z, rx, ry, rz, ux, uy, uz, sz, sz, halo, 0.95 * f, 0.62 * f, 0.26 * f);
      }
    }
    for (let i = q; i < st.fxUsed; i++) { putQuad(P, null, i, 0, -50, 0, 0, 0, 0, 0, 0, 0, 0, 0, null); quadColor(Cc, 3, i, 0, 0, 0); }
    st.fxUsed = q;
    st.fxPos.needsUpdate = true; st.fxUv.needsUpdate = true; st.fxCol.needsUpdate = true;
  }

  // ---- the set
  function build(W) {
    const THREE = W.THREE;
    W.stage({ town: 'gouda', theme: 'shops', fog: 1.15, rider: false, seed: SEED });
    W.speed(0);
    clearStreet(W);   // this is the night before: the street is ours
    Math.random = rng(SEED);   // the street, call for call the same as in shot 11
    street(W);
    Math.random = rng(SEED + 7);
    // which windows are lit tonight; the shops all are
    for (const w of st.win) w.on0 = w.shop || Math.random() < 0.52;
    // the people
    st.phoneGlow = ownMat(W.GlowMat(W.glowTex, 0x7cc6ff, 0.62, true));
    st.A = person(W, { coat: 0x26303e, skin: 0xc9a07c, hair: 0x2a1c14 }); st.A.ry = 0.22; W.add(st.A.g, A_AT[0], 0, A_AT[1], st.A.ry);
    st.B = person(W, { coat: 0x40282e, skin: 0xe0b896, hair: 0x6a4a2a }); st.B.ry = Math.PI - 0.35; W.add(st.B.g, B_AT[0], 0, B_AT[1], st.B.ry);
    st.C = person(W, { coat: 0x333828, skin: 0x8f5e3e, hair: 0x141010, scale: 0.94 }); st.C.ry = 0.7; W.add(st.C.g, C_AT[0], 0, C_AT[1], st.C.ry);
    st.halloTo = { x: A_AT[0] - 0.95, y: 1.98, z: A_AT[1] + 0.35 };
    st.halloEnd = { x: st.halloTo.x, y: st.halloTo.y - 0.5, z: st.halloTo.z };
    // the words
    st.atlas = wordAtlas(W); st.words = [];
    departures(W);
    for (const w of st.win) if (w.on0 && w.tOff > 1e8) w.tOff = darkAt(w.z) + Math.random() * 0.7 + (w.shop ? 0.2 : 0);
    for (const L of st.lamps) L.tOff = darkAt(L.z + 2) + 0.4;
    st.fxN = st.words.length * 6 + 8; st.fxUsed = st.fxN; st.o1 = {}; st.o2 = {};
    const fx = quadMesh(W, st.fxN, 3, ownMat(W.GlowMat(st.atlas.tex, 0xffffff, 1, false, { vertexColors: true })), true);
    st.fxPos = fx.geometry.attributes.position; st.fxUv = fx.geometry.attributes.uv; st.fxCol = fx.geometry.attributes.color;
    fx.renderOrder = 5; st.props.push(W.add(fx, 0, 0, 0));
    // the signs turn in order, nearest first
    st.signs.forEach((S, i) => { S.t0 = T_FLIP + i * FLIP_GAP; });
    W.say('omg, same', st.B.g, { from: 0.45, to: 1.95, dy: 2.2 });
    W.say('Sorry, English?', st.A.g, { from: T_SORRY, to: 4.45, dy: 2.25 });
  }
  // the dark comes down the street behind the words: when it reaches z
  function darkAt(z) { const a = 1.6, b = 3.0, c = -86 - z; return 5.15 + (-b + Math.sqrt(Math.max(0, b * b - 4 * a * c))) / (2 * a); }

  C[6] = {
    hold: 11.5,
    build(W) {
      st = { mats: [], tex: [], geo: [], props: [] };
      const rand0 = Math.random;
      try { build(W); } finally { Math.random = rand0; }
      this.update(W, 0, 0);
    },
    update(W, t, dt) {
      if (!st || !st.fxPos) return;
      // the eye: low in the street, a slow push; when the words go it rises to watch them down the street
      const k1 = ease(W, t, 0, 4.9), k2 = ease(W, t, 4.7, 5.8), late = Math.max(0, t - 10.5);
      const cx = W.lerp(W.lerp(0.32, 0.24, k1), 0.06, k2), cy = W.lerp(W.lerp(1.62, 1.72, k1), 3.3, k2), cz = W.lerp(W.lerp(-80.6, -79.7, k1), -79.0, k2) + 0.05 * late;
      const lx = W.lerp(-0.15, 0.1, k2), ly = W.lerp(2.7, 2.45, k2), lz = W.lerp(-58, -36, k2);
      const asp = W.camera.aspect || 1.6, v = W.camera.view, band = v && v.enabled ? W.clamp((0.82 * innerHeight - 2 * v.offsetY) / innerHeight, 0.2, 1) : 0.7;
      const fov = Math.max(W.lerp(50, 45, k2), 2 * Math.atan(Math.tan(MIN_HALF_W * DEG) / asp) / DEG, 2 * Math.atan(Math.tan(MIN_HALF_V * DEG) / band) / DEG);
      W.cam(cx, cy, cz, lx, ly, lz, fov);
      W.drift(t, 0.7);
      // the mist closes over the end of the street once 'doei' hangs there
      W.fog(1.15 + 0.75 * ease(W, t, 8.9, 2.1));
      // the windows: lit until the dark reaches them (or their word leaves); a window going out flickers first
      for (const w of st.win) {
        let lv = 0;
        if (w.on0) lv = t < w.tOff - 0.3 ? 1 : t >= w.tOff ? 0 : (hash(w.id, Math.floor(t * 16)) < 0.5 ? 1 : 0.18);
        setWin(w, lv);
      }
      for (const L of st.lamps) setLamp(L, t < L.tOff - 0.45 ? 1 : t >= L.tOff ? 0 : (hash(L.z | 0, Math.floor(t * 13)) < 0.55 ? 1 : 0.1));
      if (st.dirty) { st.litCol.needsUpdate = true; st.glowCol.needsUpdate = true; st.dirty = false; }
      dimIcons();
      // the signs turn to English, one after another down the street, and go dark with their shop
      for (const S of st.signs) {
        const k = (t - S.t0) / 0.5;
        S.pv.rotation.y = S.dir * flipAngle(k); S.pv.rotation.z = 0.02 * Math.sin(t * 1.6 + S.n * 1.3);
        if (S.lang === 'nl' && k >= 0.5) paintSign(S, 'en');
        const w = S.H.shopWin, flash = S.lang === 'en' && t - S.t0 < 0.75 ? 0.12 * Math.sin((t - S.t0) * 30) : 0;
        setSign(S, 0.2 + 0.66 * Math.max(0, w ? w.lv : 1) + flash);
      }
      // the people sway a little and never look up
      for (const [P, i] of [[st.A, 0], [st.B, 1], [st.C, 2]]) { P.g.rotation.z = 0.025 * Math.sin(t * (0.7 + 0.2 * i) + i * 2); P.g.rotation.y = P.ry + 0.04 * Math.sin(t * 0.5 + i); }
      drawWords(W, t);
    },
    dispose(W) {
      if (!st) return;
      // the kits built fresh geometry for this shot (the shop boards too); the game's shared parts are left alone
      for (const p of st.props) p.traverse(m => { if (m.isMesh && m.geometry && (m.geometry.userData.kit || m.userData.ownTex)) m.geometry.dispose(); });
      for (const g of st.geo) g.dispose();
      for (const m of st.mats) m.dispose();
      for (const t of st.tex) t.dispose();
      st = null;
    },
  };
})();
