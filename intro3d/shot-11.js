// Intro panel 11 in 3D: "Every word said right brings a piece of it back. Someone has to say them."
// The street of shot 7 (intro3d/shot-7.js builds it from the same seed), later the same night: the language has gone, the
// windows and the tulip lamps are out, the hanging signs still say BAKERY, CHEESE and BIKES, and the changed stand in the
// street with their eyes lit. The eye stands where it stood in shot 7. Two beats:
// 1. 0 to 2.9 s: far down the street, deep in the mist, a small light. One glowing word comes up the street out of it,
//    'hallo', alone, and lands in the nearest lamp: the lamp catches and burns. Then a few more: 'brood' turns BAKERY back
//    into BAKKER, 'lekker', 'de' and 'het' warm the windows they land in, 'fiets' turns BIKES back into FIETSEN, 'gezellig'
//    lights a whole house.
// 2. From 2.9 s: the light in the mist is his lamp. He rides up the street on his omafiets, and the windows warm and the lamps
//    over the street catch as he passes. He says "Kaas." and the word flies to the cheese shop: CHEESE turns back into KAAS.
//    The eye comes round to his left, low, and he brakes in front of us under a lamp that burns again: the shot ends on him,
//    the dead turned to his light. After that it keeps a slow drift.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const SEED = 711, DEG = Math.PI / 180;
  // ---- the street, the same in shot 7. Down the street is plus z; the houses stand as the game's terraces do
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
  const MIN_HALF_W = 21, MIN_HALF_V = 13;                                     // a narrow or short picture widens the lens until this much shows
  const WORDS = ['hallo', 'brood', 'lekker', 'de', 'het', 'fiets', 'gezellig', 'kaas'];
  // the words that come back: [word, start, flight, [x, height] where it leaves him, what it lands in, which]. He says them
  // riding up the street in the mist, so they come out of it from a light far away, the first one alone
  const BACK = [
    ['hallo', 0.05, 2.0, [0.2, 2.6], 'lamp', 0],
    ['brood', 1.15, 1.85, [-0.6, 2.4], 'sign', 0],
    ['lekker', 1.45, 1.8, [0.5, 2.9], 'win', 1, 5, 1],
    ['de', 1.8, 1.7, [-0.3, 2.5], 'win', -1, 7, 2],
    ['het', 1.86, 1.7, [0.1, 2.6], 'win', 1, 7, 1],
    ['fiets', 2.15, 1.7, [-0.7, 2.3], 'sign', 2],
    ['gezellig', 2.45, 1.6, [0.4, 2.8], 'house', -1, 5],
  ];
  // him: in the mist until TA, then up the street and braking to a stop at ZB by TB; "Kaas." at TK
  const TA = 2.9, ZA = -28, VA = 9, TB = 7.6, ZB = -73, VB = 1.2, TK = 5.4;
  const DEAD = [[2.6, -66, 'phone', 0.1], [-4.85, -53, 'bonnet', -0.35], [4.7, -45, 'plain', 0.4], [-1.9, -37, 'hat', -0.15]];   // [x, z, variant, turn]
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

  // ---- him: where he is along the street at t
  function heroZ(t) {
    if (t <= TA) return ZA + VA * (TA - t);
    if (t <= TB) { const T = TB - TA, s = (t - TA) / T, s2 = s * s, s3 = s2 * s; return (2 * s3 - 3 * s2 + 1) * ZA - (s3 - 2 * s2 + s) * T * VA + (-2 * s3 + 3 * s2) * ZB - (s3 - s2) * T * VB; }
    return ZB - VB * (1 - Math.exp(-(t - TB) * 0.6)) / 0.6;
  }

  // ---- what comes back, and when
  function plan() {
    const houseOf = (s, i) => st.houses.find(h => h.s === s && h.i === i);
    st.back = [];
    for (const [text, t0, T, from, kind, a, b, c] of BACK) {
      const r = { id: st.back.length, text, t0, T, ta: t0 + T, from: { x: from[0], y: from[1], z: heroZ(t0) - 1.5 }, kind, ph: Math.random() * 6.28 };
      if (kind === 'lamp') { r.L = st.lamps[a]; r.to = { x: 0, y: 6.42, z: r.L.z }; r.L.tOn = Math.min(r.L.tOn, r.ta + 0.04); }
      else if (kind === 'sign') { r.S = st.signs[a]; r.to = { x: r.S.x, y: r.S.y, z: r.S.z }; r.S.t0 = r.ta; if (r.S.H.shopWin) r.S.H.shopWin.tOn = Math.min(r.S.H.shopWin.tOn, r.ta + 0.3); }
      else {   // a window, and some of its neighbours with it; 'house': the whole house, one window after another
        const H = houseOf(a, b), ws = H.win.filter(w => !w.shop);
        const w = kind === 'win' ? (ws.filter(x => x.r === c).sort((p, q) => Math.abs(p.z - H.Zh) - Math.abs(q.z - H.Zh))[0] || ws[0]) : (ws.filter(x => x.r === 1)[1] || ws[0]);
        r.to = { x: w.x - w.s * 0.15, y: w.y, z: w.z }; w.tOn = Math.min(w.tOn, r.ta);
        ws.forEach((x, j) => { if (x !== w && (kind === 'house' || hash(x.id, 4) < 0.4)) x.tOn = Math.min(x.tOn, r.ta + 0.12 + (kind === 'house' ? 0.1 * j : 0.3 * hash(x.id, 3))); });
      }
      st.back.push(r);
    }
    // his word: out of his mouth, ahead of him to the cheese shop's sign
    const S = st.signs[1], zk = heroZ(TK);
    st.back.push({ id: st.back.length, text: 'kaas', t0: TK + 0.08, T: 0.7, ta: TK + 0.78, from: { x: 0.04, y: 1.98, z: zk - 0.3 }, to: { x: S.x, y: S.y, z: S.z }, kind: 'sign', S, ph: 1, his: true });
    S.t0 = TK + 0.78; if (S.H.shopWin) S.H.shopWin.tOn = Math.min(S.H.shopWin.tOn, TK + 1.0);
    // as he passes, some windows warm and the lamps over the street catch
    const tab = []; for (let t = 0; t <= 10; t += 0.02) tab.push([t, heroZ(t)]);
    const passAt = z => { for (const [t, hz] of tab) if (hz <= z) return t; return 1e9; };
    for (const w of st.win) if (!w.shop && w.z > -70 && w.z < -12 && hash(w.id, 9) < 0.42) w.tOn = Math.min(w.tOn, passAt(w.z) + 0.1 + 0.5 * hash(w.id, 10));
    for (const L of st.lamps) if (L.z < -10 && L.tOn > 1e8) L.tOn = passAt(L.z) + 0.05;
  }
  // a light that comes back catches with a flicker before it holds
  const catching = (id, t, t0) => t < t0 ? 0 : t >= t0 + 0.42 ? 1 : (hash(id, Math.floor(t * 15)) < 0.2 + 1.9 * (t - t0) ? 1 : 0.12);

  // ---- the words in flight: fast out of the mist, slowing as they come in, a tail of motes; then they sink into what they light
  function backAt(W, r, t, o) {
    if (t < r.t0) return false;
    const u = (t - r.t0) / r.T;
    if (u >= 1) { const d = (t - r.ta) / 0.28; if (d >= 1) return false; o.x = r.to.x; o.y = r.to.y; o.z = r.to.z; o.sc = (r.his ? 0.85 : 1.4) * (1 - 0.85 * d); o.br = 1 - d; o.roll = 0; return true; }
    const e = 1 - Math.pow(1 - u, 2.6), a = (1 - e) * (1 - e), b = 2 * (1 - e) * e, c = e * e, f = r.from, to = r.to;
    const mx = (f.x + to.x) * 0.3, my = Math.max(f.y, to.y) + (r.his ? 0.8 : 0.6), mz = (f.z + to.z) / 2;
    o.x = a * f.x + b * mx + c * to.x; o.y = a * f.y + b * my + c * to.y; o.z = a * f.z + b * mz + c * to.z;
    if (r.text === 'de' || r.text === 'het') { const s = r.text === 'de' ? 1 : -1, an = 7 * t, rr = 0.5 * (1 - e); o.x += s * rr * Math.cos(an); o.y += s * rr * 0.4 * Math.sin(2 * an); }
    o.sc = r.his ? 0.85 * (0.35 + 0.65 * W.smooth(Math.min(1, u * 3))) : 1.4;
    o.br = W.smooth(Math.min(1, u * 4));
    o.roll = 0.05 * Math.sin(2 * t + r.ph);
    return true;
  }
  function drawWords(W, t) {
    const cam = W.camera; cam.updateMatrixWorld(); const e = cam.matrixWorld.elements;
    const rx = e[0], ry = e[1], rz = e[2], ux = e[4], uy = e[5], uz = e[6];
    const P = st.fxPos.array, U = st.fxUv.array, Cc = st.fxCol.array, cells = st.atlas.cells, halo = cells.halo, o = st.o1, o2 = st.o2;
    let q = 0;
    const put = (x, y, z, Rx, Ry, Rz, Ux, Uy, Uz, hw, hh, uv, r, g, b) => { if (q >= st.fxN) return; putQuad(P, U, q, x, y, z, Rx, Ry, Rz, Ux, Uy, Uz, hw, hh, uv); quadColor(Cc, 3, q, r, g, b); q++; };
    for (const r of st.back) {
      if (t >= r.ta && t < r.ta + 0.5) { const d = (t - r.ta) / 0.5, k = Math.pow(1 - d, 1.5), s = 0.8 + 1.4 * d; put(r.to.x, r.to.y, r.to.z, rx, ry, rz, ux, uy, uz, s, s, halo, 1.0 * k, 0.7 * k, 0.32 * k); }   // the moment it lands
      if (!backAt(W, r, t, o)) continue;
      const cell = cells[r.text], H = 0.78 * o.sc, hw = H * cell[4] / 2, hh = H / 2, b = o.br, cr = Math.cos(o.roll), sr = Math.sin(o.roll);
      put(o.x, o.y, o.z, rx, ry, rz, ux, uy, uz, hw * 1.15 + 0.3 * o.sc, hh * 2.4, halo, 0.3 * b, 0.17 * b, 0.06 * b);
      put(o.x, o.y, o.z, rx * cr + ux * sr, ry * cr + uy * sr, rz * cr + uz * sr, ux * cr - rx * sr, uy * cr - ry * sr, uz * cr - rz * sr, hw, hh, cell, 1.2 * b, 0.93 * b, 0.62 * b);
      if (o.y < 7) { const k = b * W.clamp(1.25 - o.y / 6, 0.15, 1) * o.sc; put(o.x, 0.07, o.z, 1, 0, 0, 0, 0, -1, 1.9, 1.9, halo, 0.2 * k, 0.12 * k, 0.045 * k); }
      for (let m = 1; m <= 4; m++) {   // its tail: where it was a moment ago
        const tm = t - 0.05 * m; if (tm >= r.ta || !backAt(W, r, tm, o2)) continue;
        const j = hash(r.id * 7 + m, Math.floor(t * 8)), j2 = hash(r.id * 13 + m, Math.floor(t * 8) + 99), f = o2.br * (1 - m / 5), sz = (0.05 + 0.04 * j) * o.sc;
        put(o2.x + (j - 0.5) * 0.3, o2.y + (j2 - 0.5) * 0.25, o2.z, rx, ry, rz, ux, uy, uz, sz, sz, halo, 0.95 * f, 0.62 * f, 0.26 * f);
      }
    }
    for (let i = q; i < st.fxUsed; i++) { putQuad(P, null, i, 0, -50, 0, 0, 0, 0, 0, 0, 0, 0, 0, null); quadColor(Cc, 3, i, 0, 0, 0); }
    st.fxUsed = q;
    st.fxPos.needsUpdate = true; st.fxUv.needsUpdate = true; st.fxCol.needsUpdate = true;
  }

  // ---- the set
  function build(W) {
    W.stage({ town: 'gouda', theme: 'shops', fog: 1.55, seed: SEED });
    W.speed(0);
    clearStreet(W);
    Math.random = rng(SEED);   // the street, call for call the same as in shot 7
    street(W);
    Math.random = rng(SEED + 11);
    for (const S of st.signs) paintSign(S, 'en');   // the night the language left, they all turned
    // the changed, standing in the dark street with their eyes lit
    st.dead = DEAD.map(([x, z, v, ry], i) => { const d = W.zombie(v); W.add(d, x, 0, z, ry); d.userData.sway = 1.1 + i * 0.3; d.userData.home = ry; return d; });
    // him: far down the street in the mist, riding. His lamp is the game's own light: here a narrow cone that reaches only round
    // him, so the street stays dark until he is in it (dispose puts it back)
    W.face('worry');
    W.ride(heroZ(0));
    const LL = W.lampLight; st.light0 = { distance: LL.distance, decay: LL.decay, angle: LL.angle, penumbra: LL.penumbra };
    LL.distance = 14; LL.decay = 1.6; LL.angle = 0.2; LL.penumbra = 1;
    st.atlas = wordAtlas(W);
    plan();
    st.fxN = st.back.length * 9 + 8; st.fxUsed = st.fxN; st.o1 = {}; st.o2 = {};
    const fx = quadMesh(W, st.fxN, 3, ownMat(W.GlowMat(st.atlas.tex, 0xffffff, 1, false, { vertexColors: true })), true);
    st.fxPos = fx.geometry.attributes.position; st.fxUv = fx.geometry.attributes.uv; st.fxCol = fx.geometry.attributes.color;
    fx.renderOrder = 5; st.props.push(W.add(fx, 0, 0, 0));
    W.say('Kaas.', W.bike, { from: TK, to: 7.4, dy: 2.35 });
  }

  C[10] = {
    hold: 8.6,
    build(W) {
      st = { mats: [], tex: [], geo: [], props: [] };
      const rand0 = Math.random;
      try { build(W); } finally { Math.random = rand0; }
      this.update(W, 0, 0);
    },
    update(W, t, dt) {
      if (!st || !st.fxPos) return;
      // him: up the street, the wheels turning at his speed; the street stays where it is
      const bz = heroZ(t), v = (heroZ(Math.max(0, t - 0.05)) - bz) / 0.05;
      W.speed(t > 0.05 ? Math.max(0, v) : VA, 0); W.ride(bz);
      W.lampLight.target.position.set(W.bike.position.x, 0.75, bz - 12);
      W.lampLight.intensity = 2.4;   // seen from in front his lamp's glare on the wet stones would burn white: a narrow soft cone, aimed level
      W.beam.visible = false;   // its cone in the haze, seen end on, is a hard grey shape
      if (t >= TK && t - dt < TK) W.face('deadpan');
      if (t >= TK + 1.15 && t - dt < TK + 1.15) W.face('smug');
      // the eye: as at the start of shot 7, then it follows him in and comes round a little to his left, low, and ends on him
      const h = ease(W, t, 2.9, 4.9), k0 = ease(W, t, 0, 3.2), late = Math.max(0, t - TB);
      const cx = W.lerp(0.32, 1.25, h) + 0.04 * late, cy = W.lerp(W.lerp(1.62, 1.7, k0), 1.28, h), cz = W.lerp(W.lerp(-80.6, -80.1, k0), -80.6, h) - 0.2 * late;
      const lx = W.lerp(-0.15, -0.05, h), ly = W.lerp(2.7, 1.3, h), lz = W.lerp(-58, Math.max(bz, ZB - 0.4), h);
      const asp = W.camera.aspect || 1.6, vw = W.camera.view, band = vw && vw.enabled ? W.clamp((0.82 * innerHeight - 2 * vw.offsetY) / innerHeight, 0.2, 1) : 0.7;
      const halfW = W.lerp(MIN_HALF_W, 11.5, h);   // on an upright phone the end is on him, not on the width of the street
      const fov = Math.max(W.lerp(50, 39, ease(W, t, 4.0, 3.8)), 2 * Math.atan(Math.tan(halfW * DEG) / asp) / DEG, 2 * Math.atan(Math.tan(MIN_HALF_V * DEG) / band) / DEG);
      W.cam(cx, cy, cz, lx, ly, lz, fov);
      W.drift(t, 0.7);
      // the mist thins a little as the street comes back
      W.fog(1.55 - 0.4 * ease(W, t, 1.4, 5));
      // windows, lamps and signs come back
      for (const w of st.win) setWin(w, catching(w.id, t, w.tOn));
      for (const L of st.lamps) setLamp(L, catching(1000 + (L.z | 0), t, L.tOn));
      if (st.dirty) { st.litCol.needsUpdate = true; st.glowCol.needsUpdate = true; st.dirty = false; }
      dimIcons();
      for (const S of st.signs) {
        const k = (t - S.t0) / 0.5;
        S.pv.rotation.y = S.dir * flipAngle(k); S.pv.rotation.z = 0.02 * Math.sin(t * 1.6 + S.n * 1.3);
        if (S.lang === 'en' && k >= 0.5) paintSign(S, 'nl');
        const w = S.H.shopWin, flash = S.lang === 'nl' && t - S.t0 < 0.75 ? 0.12 * Math.sin((t - S.t0) * 30) : 0;
        setSign(S, 0.2 + 0.66 * Math.max(0, w ? w.lv : 0) + flash);
      }
      // the dead sway, and turn to his lamp as it comes near
      const bx = W.bike.position.x;
      for (const d of st.dead) {
        const near = W.clamp(1 - (Math.abs(bz - d.position.z) - 6) / 22, 0, 1), want = Math.atan2(-(bx - d.position.x), -(bz - d.position.z));
        let dr = W.lerp(d.userData.home, want, near) - d.rotation.y; dr = Math.atan2(Math.sin(dr), Math.cos(dr));
        d.rotation.y += dr * Math.min(1, dt * 2.2);
        d.rotation.z = Math.sin(t * d.userData.sway + d.position.z) * 0.05;
      }
      drawWords(W, t);
    },
    dispose(W) {
      if (W && W.lampLight && st && st.light0) Object.assign(W.lampLight, st.light0);
      if (W && W.beam) W.beam.visible = true;
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
