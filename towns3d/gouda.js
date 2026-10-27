// Gouda, tier 3. The Gothic stadhuis stands alone in the middle of the triangular Markt: pale stone, pinnacles on every step
// of its gable, red and white shutters, and on candle night (Gouda bij Kaarslicht) every window full of candles, the tall
// Norwegian tree lit beside it and the Waag with its cheese beyond. Narrow canals (Westhaven, Oosthaven) between brick quays,
// low brick bridges and lime trees; the long body of the Sint-Jan with its coloured glass glowing faintly; warm white tulip
// lanterns (3000 K); the round stone mill De Roode Leeuw and pollard willows along the dike. The dead carry cheese.
// Research: Opus 5.5 DT/research/towns-alblasserdam-kinderdijk-gouda.md, section 3. API: towns3d/README.md.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
  const rng = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const GW = -0.5;   // canal water in the gracht levels: half a metre below the quay
  let R = null;      // what the town makes once and keeps: textures, materials, unit geometries

  // ---------- painted once ----------
  // a window shape with a pointed arch: x0..x1 wide, the arch springs at sp and peaks at y0
  function archPath(g, x0, y0, x1, y1, sp) { const cx = (x0 + x1) / 2, k = y0 + (sp - y0) * 0.25; g.beginPath(); g.moveTo(x0, y1); g.lineTo(x0, sp); g.quadraticCurveTo(x0, k, cx, y0); g.quadraticCurveTo(x1, k, x1, sp); g.lineTo(x1, y1); g.closePath(); }
  function ashlar() {   // pale Gobertange limestone in courses, thin joints, soot running down
    const N = 256, [c, g] = cv(N, N), r = rng(23);
    g.fillStyle = 'rgb(132,130,124)'; g.fillRect(0, 0, N, N);
    for (let row = 0; row < N / 32; row++) {
      let x = -r() * 50;
      while (x < N) {
        const bw = 46 + r() * 56, v = 202 + (r() - 0.5) * 34, h = (r() - 0.5) * 8, col = `rgb(${v + h | 0},${v - 2 | 0},${v - 10 - h | 0})`;
        for (const ox of [0, -N, N]) { const xx = x + ox; if (xx + bw < 0 || xx > N) continue; g.fillStyle = col; g.fillRect(xx + 1.5, row * 32 + 1.5, bw - 3, 29); g.fillStyle = 'rgba(255,255,255,0.07)'; g.fillRect(xx + 1.5, row * 32 + 1.5, bw - 3, 2); }
        x += bw;
      }
    }
    for (let i = 0; i < 5000; i++) { g.fillStyle = r() < 0.5 ? `rgba(0,0,0,${0.04 + r() * 0.07})` : `rgba(255,255,255,${0.03 + r() * 0.05})`; g.fillRect(r() * N, r() * N, 1 + (r() < 0.2), 1); }
    for (let i = 0; i < 10; i++) { const x = r() * N, w = 5 + r() * 20, gr = g.createLinearGradient(x - w, 0, x + w, 0); gr.addColorStop(0, 'rgba(30,26,22,0)'); gr.addColorStop(0.5, `rgba(30,26,22,${0.05 + r() * 0.08})`); gr.addColorStop(1, 'rgba(30,26,22,0)'); g.fillStyle = gr; for (const ox of [-N, 0, N]) g.fillRect(x - w + ox, 0, w * 2, N); }
    return c;
  }
  function shutter() {   // the stadhuis shutters: red and white hourglass panels in a dark frame
    const [c, g] = cv(64, 256);
    g.fillStyle = '#2a1c18'; g.fillRect(0, 0, 64, 256);
    for (const y0 of [5, 131]) {
      const x0 = 6, w = 52, h = 120, cx = x0 + w / 2, cy = y0 + h / 2;
      g.fillStyle = '#e4ddcc'; g.fillRect(x0, y0, w, h); g.fillStyle = '#a8271f';
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + w, y0); g.lineTo(cx, cy); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(x0, y0 + h); g.lineTo(x0 + w, y0 + h); g.lineTo(cx, cy); g.closePath(); g.fill();
    }
    return c;
  }
  function candleAtlas() {   // three cells: a candle flame in its halo, a soft pool of candlelight, a reflection streak on water
    const [c, g] = cv(192, 64);
    let gr = g.createRadialGradient(32, 30, 0, 32, 30, 31); gr.addColorStop(0, 'rgba(255,214,150,0.8)'); gr.addColorStop(0.25, 'rgba(255,170,90,0.34)'); gr.addColorStop(1, 'rgba(255,150,70,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    g.fillStyle = 'rgba(255,236,210,0.5)'; g.fillRect(29.5, 37, 5, 18);
    gr = g.createRadialGradient(32, 29, 0, 32, 29, 9); gr.addColorStop(0, 'rgba(255,255,240,1)'); gr.addColorStop(0.5, 'rgba(255,224,150,0.95)'); gr.addColorStop(1, 'rgba(255,160,60,0)'); g.fillStyle = gr;
    g.beginPath(); g.ellipse(32, 29, 3.8, 8.5, 0, 0, 7); g.fill();
    gr = g.createRadialGradient(96, 32, 0, 96, 32, 32); gr.addColorStop(0, 'rgba(255,204,140,0.9)'); gr.addColorStop(0.4, 'rgba(255,184,112,0.4)'); gr.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = gr; g.fillRect(64, 0, 64, 64);
    for (let y = 0; y < 64; y += 2) { const t = y / 63, k = Math.max(0, Math.pow(Math.sin(t * Math.PI), 1.5) * (0.55 + 0.45 * Math.sin(y * 0.9))), w = 5 + 3 * Math.sin(y * 0.4); gr = g.createLinearGradient(160 - w, 0, 160 + w, 0); gr.addColorStop(0, 'rgba(255,190,110,0)'); gr.addColorStop(0.5, `rgba(255,190,110,${k * 0.85})`); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(140, y, 40, 2); }
    return c;
  }
  function stadWindow() {   // a window of the stadhuis on candle night: leaded glass, a stone cross, candles on three sills
    const W = 128, H = 256, [c, g] = cv(W, H), r = rng(5);
    archPath(g, 4, 2, W - 4, H - 2, 70); g.fillStyle = '#d2ccbb'; g.fill();
    archPath(g, 13, 14, W - 13, H - 10, 76); g.save(); g.clip();
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#191c25'); gr.addColorStop(1, '#2b2320'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(8,8,12,0.6)'; g.lineWidth = 1.5;
    for (let x = 13; x < W; x += 12) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    for (let y = 10; y < H; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    for (const y of [232, 160, 92]) {
      const gl = g.createLinearGradient(0, y - 64, 0, y + 4); gl.addColorStop(0, 'rgba(255,170,80,0)'); gl.addColorStop(1, 'rgba(255,170,80,0.5)'); g.fillStyle = gl; g.fillRect(0, y - 64, W, 68);
      for (let i = 0; i < 6; i++) {
        const x = 21 + i * 17.2 + (r() - 0.5) * 3, fy = y - 14 - r() * 3, h = g.createRadialGradient(x, fy, 0, x, fy, 12);
        h.addColorStop(0, 'rgba(255,232,172,0.95)'); h.addColorStop(1, 'rgba(255,160,70,0)'); g.fillStyle = h; g.fillRect(x - 12, fy - 12, 24, 24);
        g.fillStyle = '#fff8e4'; g.beginPath(); g.ellipse(x, fy, 2.3, 5.2, 0, 0, 7); g.fill();
        g.fillStyle = 'rgba(242,230,206,0.95)'; g.fillRect(x - 2, fy + 5, 4, 8);
      }
    }
    g.restore();
    g.fillStyle = '#d2ccbb'; g.fillRect(W / 2 - 4, 22, 8, H - 32); g.fillRect(13, 122, W - 26, 7);
    return c;
  }
  function stainedGlass() {   // a window of the Sint-Jan: coloured panes lit faintly from inside, lead, a little tracery
    const W = 128, H = 256, [c, g] = cv(W, H), r = rng(77), pal = [[46, 70, 150], [150, 40, 46], [190, 150, 60], [50, 110, 70], [100, 64, 130], [70, 120, 170]];
    archPath(g, 6, 2, W - 6, H - 2, 66); g.fillStyle = '#3e3a36'; g.fill();
    archPath(g, 14, 12, W - 14, H - 8, 72); g.save(); g.clip();
    for (let y = 0; y < H; y += 14) for (let x = 0; x < W; x += 12) { const p = pal[Math.floor(r() * pal.length)], k = 0.55 + r() * 0.5; g.fillStyle = `rgb(${p[0] * k | 0},${p[1] * k | 0},${p[2] * k | 0})`; g.fillRect(x, y, 12, 14); }
    const gl = g.createRadialGradient(W / 2, H * 0.6, 10, W / 2, H * 0.6, H * 0.6); gl.addColorStop(0, 'rgba(255,220,160,0.25)'); gl.addColorStop(1, 'rgba(0,0,0,0.4)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(12,10,12,0.8)'; g.lineWidth = 2;
    for (let x = 0; x < W; x += 12) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    for (let y = 0; y < H; y += 14) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.restore();
    g.fillStyle = '#3e3a36'; g.fillRect(W / 2 - 3, 44, 6, H - 50); g.strokeStyle = '#3e3a36'; g.lineWidth = 5; g.beginPath(); g.arc(W / 2, 46, 15, 0, 7); g.stroke();
    return c;
  }
  function firCards() {   // the tree from Kongsberg: a tall spruce in tiers, and its lights on a second card of the same shape
    const W = 256, H = 512, [c, g] = cv(W, H), [c2, g2] = cv(W, H), r = rng(31), cx = W / 2, half = y => 6 + (y - 24) / (H - 60) * 116;
    g.fillStyle = '#fff'; g.fillRect(cx - 7, H - 40, 14, 40);
    for (let i = 0; i < 16; i++) {
      const y = 24 + i * 28, w = half(y + 28), w0 = half(y);
      g.beginPath(); g.moveTo(cx, y - 6); g.lineTo(cx - w0 * 0.6, y + 8); g.quadraticCurveTo(cx - w * 0.7, y + 26, cx - w, y + 36); g.quadraticCurveTo(cx, y + 26, cx + w, y + 36); g.quadraticCurveTo(cx + w * 0.7, y + 26, cx + w0 * 0.6, y + 8); g.closePath(); g.fill();
    }
    for (let i = 0; i < 760; i++) {
      const y = 30 + Math.pow(r(), 0.8) * (H - 90), w = half(y) * 0.85, x = cx + (r() * 2 - 1) * w, rad = 1.6 + r() * 2.2, a = 0.55 + r() * 0.45;
      const gr = g2.createRadialGradient(x, y, 0, x, y, rad * 2.2); gr.addColorStop(0, `rgba(255,238,196,${a})`); gr.addColorStop(0.4, `rgba(255,214,150,${a * 0.6})`); gr.addColorStop(1, 'rgba(255,200,120,0)'); g2.fillStyle = gr; g2.fillRect(x - rad * 2.2, y - rad * 2.2, rad * 4.4, rad * 4.4);
    }
    const st = g2.createRadialGradient(cx, 18, 0, cx, 18, 16); st.addColorStop(0, 'rgba(255,248,220,1)'); st.addColorStop(1, 'rgba(255,220,150,0)'); g2.fillStyle = st; g2.fillRect(cx - 16, 2, 32, 32);
    return [c, c2];
  }
  function relief() {   // the Waag's marble: the great balance with cheese in its pans, the weighers beside it
    const [c, g] = cv(256, 128), r = rng(9);
    g.fillStyle = '#d6d2c8'; g.fillRect(0, 0, 256, 128);
    for (let i = 0; i < 30; i++) { g.strokeStyle = `rgba(150,146,140,${0.1 + r() * 0.15})`; g.lineWidth = 1; g.beginPath(); g.moveTo(r() * 256, r() * 128); g.quadraticCurveTo(r() * 256, r() * 128, r() * 256, r() * 128); g.stroke(); }
    g.strokeStyle = '#a8a298'; g.lineWidth = 6; g.strokeRect(3, 3, 250, 122);
    g.strokeStyle = '#8f897f'; g.lineWidth = 4; g.beginPath(); g.moveTo(128, 18); g.lineTo(128, 72); g.moveTo(70, 34); g.lineTo(186, 34);
    for (const x of [70, 186]) { g.moveTo(x, 34); g.lineTo(x - 10, 70); g.moveTo(x, 34); g.lineTo(x + 10, 70); } g.stroke();
    g.fillStyle = '#8f897f'; g.fillRect(52, 70, 36, 5); g.fillRect(168, 70, 36, 5);
    g.fillStyle = '#c2b080'; for (const [x, y] of [[62, 63], [78, 63], [70, 55], [178, 63], [194, 63]]) { g.beginPath(); g.ellipse(x, y, 8, 5, 0, 0, 7); g.fill(); }
    g.fillStyle = '#7d776e'; for (const [x, h] of [[30, 76], [104, 70], [152, 72], [226, 78]]) { g.beginPath(); g.arc(x, 120 - h, 8, 0, 7); g.fill(); g.fillRect(x - 9, 128 - h, 18, h - 12); }
    return c;
  }
  function willowCard() {   // a pollard willow: a stump of a trunk, a knotted head, a crown of thin straight shoots
    const [c, g] = cv(256, 256), r = rng(13); g.fillStyle = g.strokeStyle = '#fff'; g.lineCap = 'round';
    g.beginPath(); g.moveTo(106, 256); g.quadraticCurveTo(100, 200, 112, 150); g.lineTo(146, 150); g.quadraticCurveTo(158, 200, 150, 256); g.fill();
    g.beginPath(); g.ellipse(128, 146, 36, 20, 0, 0, 7); g.fill();
    for (let i = 0; i < 80; i++) { const a = (r() - 0.5) * 2.5, len = 50 + r() * 90, x0 = 128 + (r() - 0.5) * 54, y0 = 142; g.lineWidth = 1.5 + r() * 2; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + Math.sin(a) * len * 0.4, y0 - len * 0.6, x0 + Math.sin(a) * len, y0 - Math.cos(a) * len); g.stroke(); }
    return c;
  }
  function res(K) {
    if (R) return R;
    const THREE = K.THREE, keep = m => { m.userData.shared = true; return m; };
    const tex = (c, srgb, wrap) => { const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; if (wrap) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; } return t; };
    const quad = (u0, v0, u1, v1) => { const p = new THREE.PlaneGeometry(1, 1), uv = p.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, u0 + uv.getX(j) * (u1 - u0), v0 + uv.getY(j) * (v1 - v0)); return p; };
    const stone = keep(K.Mat({ color: 0xded8c6, map: tex(ashlar(), true, true) })); stone.userData.wuv = 2.6;
    const [fc, lc] = firCards(), ct = tex(candleAtlas());
    const tri = new THREE.Shape(); tri.moveTo(-0.5, 0); tri.lineTo(0.5, 0); tri.lineTo(0, 1); tri.closePath();
    const half = new THREE.Shape(); half.moveTo(-1, 0); half.absarc(0, 0, 1, Math.PI, 0, true); half.lineTo(-1, 0);
    R = {
      stone,
      shutter: keep(K.Mat({ map: tex(shutter(), true) })),
      candle: keep(K.GlowMat(ct, 0xffffff, 1, false)),
      candle2: keep(K.GlowMat(ct, 0xffffff, 1, false, { side: THREE.DoubleSide })),
      stadWin: keep(new THREE.MeshBasicMaterial({ map: tex(stadWindow(), true), alphaTest: 0.5 })),
      glass: keep(new THREE.MeshBasicMaterial({ map: tex(stainedGlass(), true), alphaTest: 0.5, color: 0xcfcfcf })),
      fir: keep(new THREE.MeshBasicMaterial({ map: tex(fc), color: 0x0b120f, alphaTest: 0.5, side: THREE.DoubleSide })),
      firLights: keep(K.GlowMat(tex(lc), 0xfff0d0, 1, false, { side: THREE.DoubleSide })),
      relief: keep(K.Mat({ map: tex(relief(), true) })),
      willow: keep(new THREE.MeshBasicMaterial({ map: tex(willowCard()), color: 0x0e1310, alphaTest: 0.5, side: THREE.DoubleSide })),
      kaasSign: keep(K.Mat({ map: K.labelTexture('BOERENKAAS', { bg: '#e8e2d0', fg: '#8a1e1a' }), emissive: 0xffffff, emissiveIntensity: 0.25 })),
      hat: keep(K.Mat({ color: 0xc9a85a })), band: keep(K.Mat({ color: 0x9a2a24 })), skirt: keep(K.Mat({ color: 0x24345a })),
      coat: keep(K.Mat({ color: 0x2a2420 })), brass: keep(K.Mat({ color: 0x9a7a3a })), bodice: keep(K.Mat({ color: 0x17171d })),
      flameQ: quad(0, 0, 1 / 3, 1), poolQ: quad(1 / 3, 0, 2 / 3, 1), streakQ: quad(2 / 3, 0, 1, 1),
      cone8: new THREE.ConeGeometry(0.5, 1, 8), cone4: new THREE.ConeGeometry(0.5, 1, 4), oct: new THREE.CylinderGeometry(0.5, 0.5, 1, 8),
      taper: new THREE.CylinderGeometry(0.64, 1, 1, 14), tri: new THREE.ShapeGeometry(tri), arch: new THREE.ShapeGeometry(half, 10),
    };
    K.PG.goudaWillow = R.willowQ = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0);
    R.treeMat = K.treeCard([1]).children[0].material;   // the game's shared tree card material, for lime trees merged into a kit   // a card mesh, not a kit part: kept in PG so cleanup leaves it
    return R;
  }
  const at = (k, x, y, z, ry) => { k.base.makeRotationY(ry || 0); k.base.setPosition(x, y, z); };
  // a long strip keeps to the bend of the road: the game moves its middle, this shears the rest along the curve as the road does
  function bendFollow(g) {
    g.traverse(o => { if (!o.isMesh) return; o.frustumCulled = false; o.onBeforeRender = () => { const S = window.NR, p = g.position; if (!S || !S.curv || !(p.z < 0)) return; o.matrixWorld.set(1, 0, 2 * S.curv * p.z, p.x, 0, 1, 0, p.y, 0, 0, 1, p.z, 0, 0, 0, 1); }; });
    return g;
  }
  // ---------- the Markt ----------
  // the stadhuis (1448 to 1450) in a kit, its long side to the road (minus x) and its front gable toward the rider (plus z):
  // pale stone, pinnacles on every step, two corner turrets and an open one on top, tall windows full of candles, red and
  // white shutters, the bordes of 1603 before the door. Adapted from the intro's stadhuis (intro3d/shot-3.js)
  function stadhuis(K, k, R, ox, oz) {
    const w = 10, d = 22, eave = 11, ridge = 8, st = R.stone, roof = K.PM.roof, yaw = -Math.PI / 2, fz = d / 2 - 0.2;
    at(k, ox, 0, oz);
    K.kb(k, K.PM.stone, 0, 0.45, 0, w + 0.4, 0.9, d + 0.4);
    K.kb(k, st, 0, eave / 2, 0, w, eave, d);
    K.kb(k, st, 0, eave + 0.15, 0, w + 0.5, 0.3, d + 0.5);
    const sl = Math.hypot(w / 2, ridge) + 0.4, a = Math.atan2(ridge, w / 2);
    for (const s of [-1, 1]) K.kb(k, roof, s * w / 4, eave + ridge / 2 + 0.1, -0.4, sl, 0.32, d - 0.9, 0, 0, -s * a);
    K.kb(k, roof, 0, eave + ridge + 0.1, -0.4, 0.4, 0.34, d - 0.9);
    const steps = 6, hs = (ridge + 1.6) / steps;
    for (let i = 0; i < steps; i++) {
      const ww = w * (1 - i / steps) + 0.3;
      K.kb(k, st, 0, eave + (i + 0.5) * hs, fz, ww, hs, 0.7);
      for (const s of [-1, 1]) K.kadd(k, R.cone8, st, s * (ww / 2 - 0.15), eave + (i + 1) * hs + 0.75, fz, 0, 0, 0, 0.34, 1.5, 0.34);
    }
    for (const s of [-1, 1]) K.kadd(k, K.KG.plane, R.stadWin, s * 1.7, eave + 1.5, fz + 0.36, 0, 0, 0, 1.0, 2.0, 1);
    const gt = eave + steps * hs;
    K.kadd(k, R.oct, st, 0, gt + 1.4, fz, 0, 0, 0, 1.4, 2.8, 1.4);
    K.kadd(k, K.KG.plane, R.stadWin, 0, gt + 1.4, fz + 0.71, 0, 0, 0, 0.6, 1.6, 1);
    K.kadd(k, R.cone8, roof, 0, gt + 4.6, fz, 0, 0, 0, 1.6, 3.6, 1.6);
    for (const s of [-1, 1]) {
      const tx = s * (w / 2 + 0.25), tz = d / 2 + 0.05;
      K.kadd(k, R.oct, st, tx, 10, tz, 0, 0, 0, 1.5, 9, 1.5);
      K.kadd(k, R.cone8, st, tx, 5.05, tz, Math.PI, 0, 0, 1.5, 0.9, 1.5);
      K.kadd(k, R.cone8, roof, tx, 16.7, tz, 0, 0, 0, 1.75, 4.4, 1.75);
    }
    K.kadd(k, R.tri, st, 0, eave + 0.3, -d / 2 + 0.02, 0, Math.PI, 0, w, ridge, 1);
    K.kadd(k, R.oct, st, 0, eave + ridge + 1.2, -d / 2 + 4.5, 0, 0, 0, 1.2, 2.4, 1.2);
    K.kadd(k, R.cone8, roof, 0, eave + ridge + 4.6, -d / 2 + 4.5, 0, 0, 0, 1.4, 4.4, 1.4);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) {
      const y = r ? 8.2 : 4.0, z = -8.5 + c * 3.4, wx = -w / 2 - 0.03;
      K.kadd(k, K.KG.plane, R.stadWin, wx, y, z, 0, yaw, 0, 1.5, 3.2, 1);
      K.kadd(k, R.poolQ, R.candle, wx - 0.06, y - 0.3, z, 0, yaw, 0, 3.0, 4.0, 1);
      for (const s of [-1, 1]) K.kb(k, R.shutter, wx - 0.05, y + 0.05, z + s * 1.12, 0.06, 2.9, 0.7);
    }
    for (const [x, y] of [[-3.1, 4.4], [3.1, 4.4], [-3.1, 8.4], [0, 8.4], [3.1, 8.4]]) {
      K.kadd(k, K.KG.plane, R.stadWin, x, y, d / 2 + 0.03, 0, 0, 0, 1.4, 3.0, 1); K.kadd(k, R.poolQ, R.candle, x, y - 0.3, d / 2 + 0.1, 0, 0, 0, 2.8, 3.8, 1);
      for (const s of [-1, 1]) K.kb(k, R.shutter, x + s * 1.05, y + 0.05, d / 2 + 0.06, 0.66, 2.7, 0.06);
    }
    K.kb(k, K.M.wood, 0, 3.6, d / 2 + 0.04, 1.6, 2.6, 0.06);
    K.kb(k, st, 0, 1.15, d / 2 + 1.3, 4.6, 2.3, 2.6); K.kb(k, st, 0, 2.75, d / 2 + 2.5, 4.6, 0.9, 0.25);
    for (let i = 0; i < 5; i++) { const hh = 1.9 - i * 0.4; for (const s of [-1, 1]) K.kb(k, st, s * (2.48 + i * 0.36), hh / 2, d / 2 + 1.3, 0.36, hh, 2.0); }
  }
  function kerstboom(K, k, R, x, z, h) {   // the tree from Kongsberg, lit: two crossed cards so it keeps its shape from every side
    at(k, x, 0, z);
    for (const ry of [0, Math.PI / 2]) { K.kadd(k, K.KG.plane, R.fir, 0, h / 2, 0, 0, ry, 0, h * 0.52, h, 1); K.kadd(k, K.KG.plane, R.firLights, 0, h / 2, 0, 0, ry, 0, h * 0.52, h, 1); }
    K.kadd(k, K.KG.cyl, K.M.wood, 0, 0.45, 0, 0, 0, 0, 2.2, 0.9, 2.2);
  }
  function waag(K, k, R, x, z) {   // the Waag of 1668: a square stone house under a pediment, the marble of the cheese weighing over the door, cheese stacked before it
    const st = R.stone, yaw = -Math.PI / 2; at(k, x, 0, z);
    K.kb(k, K.PM.stone, 0, 0.4, 0, 12.4, 0.8, 12.4); K.kb(k, st, 0, 5.5, 0, 12, 11, 12); K.kb(k, st, 0, 11.2, 0, 12.8, 0.5, 12.8);
    K.kadd(k, R.tri, st, -6.12, 11.45, 0, 0, yaw, 0, 12.8, 3.4, 1);
    K.kadd(k, R.cone4, K.PM.roof, 0, 13.4, 0, 0, Math.PI / 4, 0, 17.6, 4.0, 17.6);
    K.kadd(k, K.KG.plane, R.relief, -6.04, 6.9, 0, 0, yaw, 0, 7.2, 3.4, 1);
    K.kb(k, K.M.wood, -6.03, 1.9, 0, 0.06, 3.6, 2.4);
    for (const zz of [-4, 4]) for (const [y, cell] of [[3.2, 3], [9.2, 0]]) K.kadd(k, K.PG['win' + cell], K.PM.winAtlas, -6.03, y, zz, 0, yaw, 0, 1.6, 2.6);
    for (let p = 0; p < 3; p++) {
      const pz = -4.2 + p * 4.2; K.kb(k, K.M.wood, -9.2, 0.1, pz, 2.2, 0.2, 3.2);
      for (let i = 0; i < 6; i++) K.kadd(k, K.KG.cyl, K.PM.cheese, -9.7 + (i % 2) * 1.0, 0.33, pz - 1.0 + Math.floor(i / 2) * 1.0, 0, 0, 0, 0.92, 0.26, 0.92);
      for (let i = 0; i < 3; i++) K.kadd(k, K.KG.cyl, K.PM.cheese, -9.2 + K.rnd(-0.3, 0.3), 0.6, pz - 1.0 + i * 1.0, 0, 0, 0, 0.88, 0.26, 0.88);
    }
  }
  // the whole Markt as one landmark and one kit: the stadhuis alone in the middle, the tree lit beside it, the Waag beyond
  function markt(K) { const R = res(K), k = K.kit(); stadhuis(K, k, R, 0, 0); kerstboom(K, k, R, 11, 7, 22); waag(K, k, R, 17, -46); return K.kbuild(k); }
  // ---------- streets and canals ----------
  // a Gouda terrace: the game's houses wall to wall in one kit, and candles on the sills of the dark windows (Kaarslicht)
  function row(K, n, o = {}) {
    const R = res(K), g = new K.THREE.Group(), k = K.kit(), st = K.style, len = n * 6.05, pal = [K.pick(st.brick), K.pick(st.brick)], yaw = -Math.PI / 2;
    for (let i = 0; i < n; i++) {
      const w = K.rnd(st.width[0], st.width[1]) * (o.plain ? 1.25 : 1), h = K.rnd(st.height[0], st.height[1]) * (o.tall || 1), oz = -len / 2 + 3 + i * 6.05, shop = !!o.shops && Math.random() < o.shops;
      K.house({ k, g, w, h, brick: pal[i % 2], ox: w / 2 - 2.2, oz, sign: shop ? K.pick(T.gouda.shops) : null, lit: shop ? 0.55 : o.lit, plain: o.plain, peer: o.peer });
      const rows = Math.max(1, Math.round((h - 1.2) / 2.3));
      k.base.identity();
      for (let r = 0; r < rows; r++) for (let c = 0; c < 3; c++) {
        if ((r === 0 && (shop || c === 2)) || Math.random() > (o.candles || 0)) continue;
        const y = 1.48 + r * 2.3, z = oz - 1.95 + c * 2.1;
        K.kadd(k, R.flameQ, R.candle, -2.27, y, z + K.rnd(-0.2, 0.2), 0, yaw, 0, 0.62, 0.62, 1);
        if (Math.random() < 0.45) K.kadd(k, R.flameQ, R.candle, -2.27, y - 0.04, z + (Math.random() < 0.5 ? -0.3 : 0.3), 0, yaw, 0, 0.5, 0.5, 1);
      }
    }
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }
  // thirty metres of the canal in one kit, standing at the middle of the road: the land under the near houses (the ground lies
  // low so the water can), the pale coping of the near quay, the far quay wall with its coping and street. Across the water
  // stand canal houses with lime trees before them and their light broken up on the water ('houses'), or the canal passes the
  // Markt: its cobbles open up with candle lanterns and candlelit houses on the far side ('open'), then the stadhuis stands
  // there alone with the lit tree beside it, its candles doubled in the canal ('stadhuis')
  function farQuay(K, mode) {
    const R = res(K), g = new K.THREE.Group(), k = K.kit(), st = K.style, pal = [K.pick(st.brick), K.pick(st.brick)], L = 30.1, markt = mode === 'open' || mode === 'stadhuis';
    K.kb(k, K.PM.pole, -24, -0.6, 0, 33, 1.16, L);
    K.kb(k, R.stone, 7.9, 0.0, 0, 0.44, 0.26, L);
    K.kb(k, K.brickMat(pal[0]), 16.95, -0.62, 0, 0.7, 1.28, L);
    K.kb(k, R.stone, 16.75, 0.0, 0, 0.5, 0.24, L);
    if (markt) K.kb(k, K.PM.stone, 31.2, -0.6, 0, 28.4, 1.16, L); else K.kb(k, K.PM.pole, 24.5, -0.6, 0, 15, 1.16, L);
    for (let z = -12; z < 15; z += 6) K.kadd(k, K.KG.cyl, K.PM.pole, 17.2, 0.32, z + K.rnd(-1.2, 1.2), 0, 0, 0, 0.24, 0.64, 0.24);
    k.base.identity();
    if (mode === 'stadhuis') {
      stadhuis(K, k, R, 26.5, -3); kerstboom(K, k, R, 34, 14, 20); k.base.identity();
      for (let c = 0; c < 6; c++) K.kadd(k, R.streakQ, R.candle, K.rnd(12.4, 15.6), GW + 0.03, -11.5 + c * 3.4, -Math.PI / 2, 0, 0, 1.6, K.rnd(7, 11), 1);
      for (const z of [12, -14]) candleLanternIn(K, R, k, 19.2, 0, z);
    } else if (mode === 'open') {
      for (const z of [-12, -2, 8]) candleLanternIn(K, R, k, 19.2, 0, z + K.rnd(-1, 1));
      cheeseIn(K, k, 23, -6); cheeseIn(K, k, 25.5, 4);
      for (let i = 0; i < 4; i++) {
        const w = K.rnd(st.width[0], st.width[1]) * 1.1, h = K.rnd(st.height[0], st.height[1]), oz = -10 + i * 6.05;
        K.house({ k, g, w, h, brick: pal[i % 2], ox: 38 + w / 2, oz, plain: true, lit: 0.18, peer: false }); k.base.identity();
        for (let r = 0; r < 3; r++) for (const dz of [-1.95, 0.15, 2.25]) if (Math.random() < 0.5) K.kadd(k, R.flameQ, R.candle, 37.93, 1.48 + r * 2.3, oz + dz, 0, -Math.PI / 2, 0, 0.62, 0.62, 1);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        const w = K.rnd(st.width[0], st.width[1]) * 1.2, h = K.rnd(st.height[0], st.height[1]) * K.rnd(0.95, 1.15), oz = -12 + i * 6;
        K.house({ k, g, w, h, brick: pal[i % 2], ox: 23.6 + w / 2, oz, plain: true, lit: 0.32, peer: false });
        k.base.identity();
        for (const dz of [-1.95, 0.15, 2.25]) if (Math.random() < 0.55) K.kadd(k, R.streakQ, R.candle, K.rnd(12.6, 15.8), GW + 0.03, oz + dz, -Math.PI / 2, 0, 0, 1.5, K.rnd(6, 10), 1);
      }
      for (const z of [K.rnd(-13, -4), K.rnd(3, 12)]) { const s = K.rnd(0.85, 1.1); for (const ry of [0, Math.PI / 2]) K.kadd(k, K.PG.tree1, R.treeMat, 19.4, 0, z, 0, ry, 0, 8 * s, 11 * s, 1); }
    }
    K.kbuild(k, g); return bendFollow(g);
  }
  function candleLanternIn(K, R, k, x, y, z) {   // candle night: a candle in a lantern on an iron stand, its light on the cobbles
    K.kb(k, K.PM.pole, x, y + 0.45, z, 0.05, 0.9, 0.05); K.kb(k, K.PM.pole, x, y + 0.9, z, 0.36, 0.04, 0.36);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.kb(k, K.PM.pole, x + sx * 0.15, y + 1.12, z + sz * 0.15, 0.025, 0.44, 0.025);
    K.kadd(k, R.cone4, K.PM.pole, x, y + 1.44, z, 0, Math.PI / 4, 0, 0.52, 0.22, 0.52);
    for (const ry of [0, Math.PI / 2]) K.kadd(k, R.flameQ, R.candle2, x, y + 1.1, z, 0, ry, 0, 0.55, 0.55, 1);
    K.kadd(k, R.poolQ, R.candle2, x, y + 0.04, z, -Math.PI / 2, 0, 0, 3.0, 3.0, 1);
  }
  function cheeseIn(K, k, x, z) {   // Thursday's cheese left out on its pallet
    K.kb(k, K.M.wood, x, 0.08, z, 1.6, 0.16, 2.4);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) K.kadd(k, K.KG.cyl, K.PM.cheese, x - 0.38 + c * 0.76, 0.27, z - 0.8 + r * 0.8, 0, 0, 0, 0.7, 0.2, 0.7);
    for (let i = 0; i < 2; i++) K.kadd(k, K.KG.cyl, K.PM.cheese, x + K.rnd(-0.3, 0.3), 0.47, z - 0.4 + i * 0.8, 0, 0, 0, 0.66, 0.2, 0.66);
  }
  // a shopping street opens onto the Markt: the houses on the right stop, the cobbles run back to the stadhuis standing alone
  // with the tree beside it and candle lanterns before it. It takes the place of a terrace on the right (x about 7.8)
  function marktOpening(K) {
    const R = res(K), k = K.kit();
    K.kb(k, K.PM.stone, 17, 0.0, -24, 34.4, 0.06, 78);
    stadhuis(K, k, R, 13.5, -12); kerstboom(K, k, R, 21, 5, 20); k.base.identity();
    for (const z of [9, -3, -15, -27]) candleLanternIn(K, R, k, 2.2, 0, z);
    cheeseIn(K, k, 5.2, 2); cheeseIn(K, k, 5.6, -33);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // where the dike passes the edge of the town: a gap between two rows of houses opens onto the Markt, raised on its cobbles
  // above the polder, the stadhuis alone in the middle with the lit tree, candle lanterns along the edge. Built for the right
  // side and stood at town level (y -0.05): the cobbled ground runs down to the polder
  function marktRand(K) {
    const R = res(K), k = K.kit(), st = K.style, pal = [K.pick(st.brick), K.pick(st.brick)];
    K.kb(k, K.PM.stone, 9, -0.45, -3, 30, 0.9, 66);
    stadhuis(K, k, R, 9, -3); kerstboom(K, k, R, 17.5, 12, 20); k.base.identity();
    for (const z of [11, 1, -9, -19]) candleLanternIn(K, R, k, -4.6, 0, z);
    const g = new K.THREE.Group();
    for (const [z0, dir] of [[15, 1], [-24.2, -1]]) for (let i = 0; i < 3; i++) {
      const w = K.rnd(st.width[0], st.width[1]), oz = z0 + i * 6.05 * dir;
      K.house({ k, g, w, brick: pal[i % 2], ox: -5.8 + w / 2, oz, lit: 0.3, peer: false }); k.base.identity();
    }
    K.kbuild(k, g); return g;
  }
  const empty = K => new K.THREE.Group();
  const seq = list => { let i = 0; return K => list[i++ % list.length](K); };   // a spawn whose copies differ in turn: the game makes them in order, n at a time
  // a low brick bridge over the canal as on the Westhaven: a humped deck, brick parapets with pale caps, a lantern at each end, the arch dark over the water
  function brug(K) {
    const R = res(K), k = K.kit(), b = K.brickMat(0x6a3e33), L = 9.4, half = L / 2, rise = 0.6, sl = Math.hypot(half, rise) + 0.1, a = Math.atan2(rise, half);
    K.kb(k, b, 0, -0.35, 0, L, 1.1, 3.4); K.kb(k, b, 0, 0.4, 0, L * 0.6, 0.4, 3.4);
    for (const s of [-1, 1]) {
      K.kb(k, K.PM.stone, s * half / 2, rise / 2 + 0.02, 0, sl, 0.12, 3.0, 0, 0, -s * a);
      for (const e of [-1, 1]) { K.kb(k, b, s * half / 2, rise / 2 + 0.5, e * 1.6, sl, 0.9, 0.3, 0, 0, -s * a); K.kb(k, R.stone, s * half / 2, rise / 2 + 1.0, e * 1.6, sl, 0.1, 0.42, 0, 0, -s * a); }
      K.kb(k, K.PM.pole, s * (half - 0.3), 1.4, 1.6, 0.1, 2.6, 0.1); tulipHead(K, R, k, s * (half - 0.3), 2.9);
      K.kadd(k, R.poolQ, R.candle, s * (half - 0.3), 2.3, 1.85, 0, 0, 0, 2.2, 2.2, 1);
    }
    for (const e of [-1, 1]) K.kadd(k, R.arch, K.PM.windowOff, 0, GW, e * 1.72, 0, e > 0 ? 0 : Math.PI, 0, 2.7, 0.95, 1);
    K.kadd(k, R.streakQ, R.candle, -half + 0.3, GW + 0.03, 4.5, -Math.PI / 2, 0, 0, 1.0, 6, 1); K.kadd(k, R.streakQ, R.candle, half - 0.3, GW + 0.03, 4.5, -Math.PI / 2, 0, 0, 1.0, 6, 1);
    return K.kbuild(k);
  }
  // Gouda's lantern since 2018: a tulip hanging from a swan neck, warm white. tulipHead hangs one at (x, y) in a kit
  function tulipHead(K, R, k, x, y) {
    K.kb(k, K.PM.pole, x, y - 0.14, 0, 0.04, 0.3, 0.04);
    K.kadd(k, K.KG.dome, K.PM.pole, x, y - 0.56, 0, 0, 0, 0, 0.6, 0.64, 0.6);
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; K.kadd(k, R.cone8, K.PM.pole, x + Math.cos(a) * 0.26, y - 0.62, Math.sin(a) * 0.26, Math.PI, 0, 0, 0.13, 0.22, 0.13); }
    K.kadd(k, K.KG.ball, K.PM.lampHead, x, y - 0.62, 0, 0, 0, 0, 0.38, 0.26, 0.38);
  }
  function tulipLamp(K) {
    const R = res(K), k = K.kit(), g = new K.THREE.Group(), hx = -1.15;
    K.kadd(k, K.KG.cyl, K.PM.pole, 0, 0.35, 0, 0, 0, 0, 0.28, 0.7, 0.28); K.kadd(k, K.KG.cyl, K.PM.pole, 0, 2.55, 0, 0, 0, 0, 0.12, 4.5, 0.12);
    K.ktube(k, K.PM.pole, 0, 4.75, 0, -0.42, 5.18, 0, 0.04); K.ktube(k, K.PM.pole, -0.42, 5.18, 0, -0.95, 5.22, 0, 0.04); K.ktube(k, K.PM.pole, -0.95, 5.22, 0, hx, 5.06, 0, 0.035); K.ktube(k, K.PM.pole, 0, 4.25, 0, -0.62, 5.12, 0, 0.02);
    tulipHead(K, R, k, hx, 5.06); K.kbuild(k, g); K.lampLights(g, hx, 4.44, 1, 1.0); g.userData.faceRoad = true; return g;
  }
  function wireLamp(K) {   // a tulip on a wire across the shopping street, facade to facade, high over the traffic
    const R = res(K), k = K.kit(), g = new K.THREE.Group(), y0 = 7.8, ym = 7.1;
    K.ktube(k, K.PM.pole, -7.5, y0, 0, 0, ym, 0, 0.014); K.ktube(k, K.PM.pole, 0, ym, 0, 7.5, y0, 0, 0.014);
    for (const s of [-1, 1]) K.kb(k, K.PM.pole, s * 7.55, y0, 0, 0.3, 0.08, 0.08);
    tulipHead(K, R, k, 0, ym); K.kbuild(k, g); K.lampLights(g, 0, ym - 0.66, 1, 1.2); return g;
  }
  function cheesePile(K) {   // Thursday's market left out in the night: wheels in rows on a pallet, more on top
    const k = K.kit(); K.kb(k, K.M.wood, 0, 0.08, 0, 1.6, 0.16, 2.4);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) K.kadd(k, K.KG.cyl, K.PM.cheese, -0.38 + c * 0.76, 0.27, -0.8 + r * 0.8, 0, 0, 0, 0.7, 0.2, 0.7);
    for (let i = 0; i < 3; i++) if (Math.random() < 0.8) K.kadd(k, K.KG.cyl, K.PM.cheese, K.rnd(-0.3, 0.3), 0.47, -0.8 + i * 0.8, 0, 0, 0, 0.66, 0.2, 0.66);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function candleLantern(K) {   // candle night: a lantern with a candle in it on an iron stand, its light on the cobbles
    const R = res(K), k = K.kit();
    K.kb(k, K.PM.pole, 0, 0.45, 0, 0.05, 0.9, 0.05); K.kb(k, K.PM.pole, 0, 0.9, 0, 0.36, 0.04, 0.36);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.kb(k, K.PM.pole, sx * 0.15, 1.12, sz * 0.15, 0.025, 0.44, 0.025);
    K.kadd(k, R.cone4, K.PM.pole, 0, 1.44, 0, 0, Math.PI / 4, 0, 0.52, 0.22, 0.52);
    for (const ry of [0, Math.PI / 2]) K.kadd(k, R.flameQ, R.candle2, 0, 1.1, 0, 0, ry, 0, 0.55, 0.55, 1);
    K.kadd(k, R.poolQ, R.candle2, 0, 0.03, 0, -Math.PI / 2, 0, 0, 3.0, 3.0, 1);
    return K.kbuild(k);
  }
  // the Sint-Jan, the longest church in the country, its long body to the road: rows of tall windows of coloured glass lit
  // faintly from inside (the Goudse Glazen), the transept's great window, the short tower at its west end
  function sintJan(K) {
    const R = res(K), k = K.kit(), b = K.brickMat(0x7e6c5c), roof = K.PM.roof, L = 84, yaw = -Math.PI / 2;
    K.kb(k, b, 0, 6, 0, 26, 12, L); K.kb(k, b, 0, 18, 0, 13, 12, L);
    for (const s of [-1, 1]) { K.kb(k, roof, s * 9.75, 14, 0, Math.hypot(6.5, 4) + 0.3, 0.3, L, 0, 0, -s * Math.atan2(4, 6.5)); K.kb(k, roof, s * 3.25, 28.5, 0, Math.hypot(6.5, 9) + 0.3, 0.32, L + 0.6, 0, 0, -s * Math.atan2(9, 6.5)); }
    K.kb(k, b, 0, 12, -18, 34, 24, 12);
    for (const s of [-1, 1]) K.kb(k, roof, 0, 28, -18 + s * 3, 34.6, 0.3, Math.hypot(6, 8) + 0.3, s * Math.atan2(8, 6), 0, 0);
    K.kadd(k, R.tri, b, -17.02, 24, -18, 0, yaw, 0, 12, 8, 1);
    K.kadd(k, K.KG.plane, R.glass, -17.05, 12.5, -18, 0, yaw, 0, 6, 14);
    K.kb(k, b, 0, 20, L / 2 + 5, 10, 40, 10); K.kb(k, b, 0, 43, L / 2 + 5, 7.6, 6, 7.6);
    K.kadd(k, R.oct, b, 0, 47.5, L / 2 + 5, 0, 0, 0, 5, 3, 5); K.kadd(k, R.cone8, roof, 0, 52, L / 2 + 5, 0, 0, 0, 5.4, 6, 5.4);
    for (let z = -38; z <= 38; z += 6.5) { if (Math.abs(z + 18) < 7) continue; K.kadd(k, K.KG.plane, R.glass, -13.03, 6.2, z, 0, yaw, 0, 3.0, 8.4); K.kadd(k, K.KG.plane, R.glass, -6.53, 20, z, 0, yaw, 0, 2.6, 6.2); }
    for (const y of [30, 36]) K.kadd(k, K.KG.plane, K.PM.windowOff, -5.03, y, L / 2 + 5, 0, yaw, 0, 1.4, 3.2);
    return K.kbuild(k);
  }
  // ---------- the dike ----------
  // De Roode Leeuw on the Vest: a round stone mill with a stage round its waist, its sails turning toward the rider
  function roodeLeeuw(K) {
    const THREE = K.THREE, R = res(K), g = new THREE.Group(), k = K.kit(), body = K.brickMat(0x5a3b33), H = 15, yaw = -Math.PI / 2;
    K.kadd(k, R.taper, body, 0, H / 2, 0, 0, 0, 0, 3.6, H, 3.6);
    K.kadd(k, K.KG.cyl, K.M.wood, 0, 7, 0, 0, 0, 0, 10.4, 0.22, 10.4);
    for (let i = 0; i < 12; i++) {
      const a0 = i / 12 * Math.PI * 2, a1 = (i + 1) / 12 * Math.PI * 2, c = Math.cos(a0), s = Math.sin(a0);
      K.ktube(k, K.M.wood, c * 3.1, 5.0, s * 3.1, c * 5.0, 6.9, s * 5.0, 0.07); K.kb(k, K.M.wood, c * 5.05, 7.6, s * 5.05, 0.07, 1.1, 0.07);
      K.ktube(k, K.M.wood, c * 5.05, 8.1, s * 5.05, Math.cos(a1) * 5.05, 8.1, Math.sin(a1) * 5.05, 0.04);
    }
    K.kadd(k, K.KG.ball, K.PM.roof, 0, H + 0.3, 0, 0, 0, 0, 5.0, 3.4, 6.2);
    for (const [y, cell] of [[3.2, 0], [10.4, 1], [12.6, 4]]) K.kadd(k, K.PG['win' + cell], K.PM.winAtlas, -(3.6 - 1.3 * y / H) - 0.04, y, 0, 0, yaw, 0, 0.8, 1.2);
    K.kb(k, K.M.wood, -2.95, 8.1, 0, 0.08, 2.0, 1.0);
    K.kbuild(k, g);
    const blades = new THREE.Group(), kb2 = K.kit(); blades.position.set(0, H + 0.9, 3.0);
    for (let i = 0; i < 4; i++) {
      kb2.base.makeRotationZ(i * Math.PI / 2); K.kb(kb2, K.M.wood, 0, 5.9, 0, 0.32, 11.6, 0.3);
      for (const x of [0.95, 1.9]) K.kb(kb2, K.M.wood, x, 6.7, 0, 0.1, 9.8, 0.1);
      for (let j = 0; j < 12; j++) K.kb(kb2, K.M.wood, 0.95, 2.2 + j * 0.82, 0, 1.95, 0.08, 0.08);
    }
    kb2.base.identity(); K.kadd(kb2, K.KG.cyl, K.PM.pole, 0, 0, -0.4, Math.PI / 2, 0, 0, 0.8, 1.4, 0.8);
    K.kbuild(kb2, blades); g.add(blades); g.userData.blades = blades; g.userData.spin = 0.32;
    return g;
  }
  function willow(K) {   // a pollard willow by the ditch, a card that turns to the eye
    const R = res(K), g = new K.THREE.Group(), m = new K.THREE.Mesh(R.willowQ, R.willow), s = K.rnd(0.85, 1.25);
    m.scale.set(5.6 * s * (Math.random() < 0.5 ? -1 : 1), 5.0 * s, 1); g.add(m); g.userData.bill = true; return g;
  }
  // a cheese farm below the dike: a long house under one big roof, lit windows, and up on the dike at the road its sign
  function boerderij(K) {
    const R = res(K), k = K.kit(), b = K.brickMat(0x5a3a32), yaw = -Math.PI / 2, ra = Math.atan2(5.6, 4.8), sl = Math.hypot(4.8, 5.6) + 0.4;
    K.kb(k, b, 0, 2.2, 0, 9, 4.4, 20);
    for (const s of [-1, 1]) { K.kb(k, K.PM.roof, s * 2.4, 7.25, 0, sl, 0.32, 20.8, 0, 0, -s * ra); K.kadd(k, R.tri, b, 0, 4.4, s * 10.02, 0, s > 0 ? 0 : Math.PI, 0, 9, 5.6, 1); }
    for (let i = 0; i < 4; i++) { const z = -7 + i * 4.2, lit = i === 1 || i === 2; K.kadd(k, K.PG['win' + (lit ? i - 1 : 4)], K.PM.winAtlas, -4.52, 2.0, z, 0, yaw, 0, 1.0, 1.4); for (const s of [-1, 1]) K.kb(k, K.PK.shutters[0], -4.55, 2.0, z + s * 0.68, 0.05, 1.4, 0.36); }
    K.kb(k, K.M.wood, -4.52, 1.2, 8, 0.05, 2.4, 1.2);
    for (const x of [-13.1, -14.1]) K.kb(k, K.M.wood, x, 1.5, 6, 0.1, 1.8, 0.1);
    for (const s of [1, -1]) K.kadd(k, K.KG.plane, R.kaasSign, -13.6, 2.25, 6 + s * 0.06, 0, s > 0 ? 0 : Math.PI, 0, 1.7, 0.83);
    return K.kbuild(k);
  }
  function waterToren(K) {   // the water tower of 1883 on the IJssel: an eight-sided brick shaft, the tank as a wider drum, a low cap
    const R = res(K), k = K.kit(), b = K.brickMat(0x6a4a3c);
    K.kadd(k, R.oct, b, 0, 12, 0, 0, 0, 0, 7, 24, 7); K.kadd(k, R.oct, b, 0, 27, 0, 0, 0, 0, 9.6, 6, 9.6); K.kadd(k, R.cone8, K.PM.roof, 0, 31.4, 0, 0, 0, 0, 10.4, 2.8, 10.4);
    for (const y of [8, 14, 20]) K.kadd(k, K.PG.win3, K.PM.winAtlas, 3.52, y, 0, 0, Math.PI / 2, 0, 0.8, 1.6);
    return K.kbuild(k);
  }
  function fenceRun(K) {   // the dike's fence in one piece of 30 m: posts and two wires
    const k = K.kit(); for (let z = -13.5; z < 15; z += 3) K.kb(k, K.M.wood, 4.75, 0.5, z, 0.12, 1.0, 0.12);
    for (const y of [0.45, 0.85]) K.kb(k, K.PM.pole, 4.75, y, 0, 0.03, 0.03, 30.1);
    return bendFollow(K.kbuild(k));
  }

  // ---------- the dead of Gouda ----------
  // the shared body: hip [0, 1.0, 0.04], shoulders [0, 1.62, -0.36], head [0, 1.68, -0.64], hands hanging at about (+-0.26, 0.7, -0.6)
  const DRESS = {
    goudsedrager(k, b, K) {   // a cheese carrier of the Thursday market: white smock and trousers, a lacquered straw hat, the berrie full of cheese
      const R = res(K), W = K.PK.linen, { hip, sh, hd } = b;
      K.ktube(k, W, ...hip, ...sh, 0.2); K.kadd(k, K.KG.cyl, W, 0, 0.9, 0.0, 0.25, 0, 0, 0.5, 0.36, 0.44);
      for (const sx of [-1, 1]) { K.ktube(k, W, sx * 0.11, 1.0, 0.04, sx * 0.121, 0.53, -0.1, 0.1); K.ktube(k, W, sx * 0.121, 0.53, -0.1, sx * 0.126, 0.14, 0.06, 0.085); K.ktube(k, W, sx * 0.25, 1.62, -0.36, sx * 0.28, 1.16, -0.48, 0.075); }
      K.kadd(k, K.KG.cyl, R.hat, hd[0], hd[1] + 0.12, hd[2] + 0.02, 0.35, 0, 0, 0.64, 0.03, 0.64); K.kadd(k, K.KG.cyl, R.hat, hd[0], hd[1] + 0.2, hd[2], 0.35, 0, 0, 0.3, 0.13, 0.3);
      K.kadd(k, K.KG.cyl, R.band, hd[0], hd[1] + 0.16, hd[2] + 0.01, 0.35, 0, 0, 0.31, 0.045, 0.31);
      for (const sx of [-1, 1]) { K.kb(k, K.M.wood, sx * 0.3, 0.74, -0.95, 0.06, 0.06, 1.5); K.ktube(k, K.PK.rope, sx * 0.24, 1.6, -0.36, sx * 0.3, 0.77, -0.3, 0.022); }
      K.kb(k, K.M.wood, 0, 0.72, -1.0, 0.6, 0.04, 1.0);
      for (let i = 0; i < 6; i++) K.kadd(k, K.KG.cyl, K.PM.cheese, (i % 2 - 0.5) * 0.3, 0.8, -0.72 - Math.floor(i / 2) * 0.3, 0, 0, 0, 0.3, 0.1, 0.3);
      for (let i = 0; i < 3; i++) K.kadd(k, K.KG.cyl, K.PM.cheese, 0, 0.9, -0.72 - i * 0.3, 0, 0, 0, 0.29, 0.1, 0.29);
    },
    kaasmeisje(k, b, K) {   // a kaasmeisje of the market: a white cap, a dark bodice, a long blue skirt with a white apron, a cheese held before her
      const R = res(K), W = K.PK.linen, { hip, sh, hd } = b;
      K.kadd(k, R.taper, R.skirt, 0, 0.56, -0.04, -0.08, 0, 0, 0.47, 1.02, 0.47);
      K.kb(k, W, 0, 0.6, -0.42, 0.42, 0.86, 0.025, 0.24, 0, 0);
      K.ktube(k, R.bodice, ...hip, ...sh, 0.17); K.kb(k, W, 0, sh[1] + 0.02, sh[2] + 0.02, 0.52, 0.06, 0.24);
      for (const sx of [-1, 1]) K.ktube(k, R.bodice, sx * 0.25, 1.62, -0.36, sx * 0.28, 1.16, -0.48, 0.07);
      K.kadd(k, K.KG.dome, W, hd[0], hd[1] + 0.02, hd[2] + 0.04, 0.5, 0, 0, 0.3, 0.32, 0.32); K.kb(k, W, 0, hd[1] + 0.2, hd[2] + 0.14, 0.05, 0.12, 0.16, 0.5, 0, 0);
      K.kadd(k, K.KG.cyl, K.PM.cheese, 0, 0.82, -0.66, 0, 0, Math.PI / 2, 0.44, 0.15, 0.44);
    },
    kaarsdrager(k, b, K) {   // one of candle night: a long dark coat, a wide hat, a candle burning in the right hand
      const R = res(K), { hip, sh, hd } = b;
      K.ktube(k, R.coat, ...hip, ...sh, 0.19); K.kadd(k, R.taper, R.coat, 0, 0.78, -0.02, -0.1, 0, 0, 0.36, 0.62, 0.36);
      for (const sx of [-1, 1]) K.ktube(k, R.coat, sx * 0.25, 1.62, -0.36, sx * 0.28, 1.16, -0.48, 0.075);
      K.kadd(k, K.KG.cyl, R.coat, hd[0], hd[1] + 0.12, hd[2] + 0.02, 0.3, 0, 0, 0.72, 0.025, 0.72); K.kadd(k, K.KG.cyl, R.coat, hd[0], hd[1] + 0.22, hd[2], 0.3, 0, 0, 0.3, 0.18, 0.3);
      K.kadd(k, K.KG.cyl, R.brass, 0.27, 0.74, -0.62, 0, 0, 0, 0.16, 0.03, 0.16); K.kb(k, K.PK.linen, 0.27, 0.9, -0.62, 0.07, 0.3, 0.07);
      for (const ry of [0, Math.PI / 2]) K.kadd(k, R.flameQ, R.candle2, 0.27, 1.1, -0.62, 0, ry, 0, 0.6, 0.6, 1);
    },
  };
  const fingerpost = K => K.fingerpost(T.gouda.signs.slice().sort(() => Math.random() - 0.5).slice(0, 3));

  T.gouda = {
    style: { brick: [0x6b3f33, 0x7a4c3c, 0x5c3a33, 0x8c8272, 0x4e3530], gables: 0.75, height: [7, 9.5], width: [3.5, 4.5], lamp: 'classic' },
    sky: { stars: 50, clouds: 0.85, glows: [{ az: 62, el: 1, w: 90, h: 9, color: 0xff9a52, a: 0.2 }, { az: -78, el: 1, w: 70, h: 7, color: 0xffb070, a: 0.13 }] },
    light: { lamp: 0xffcf98, windows: 0xffa448 },   // warm white tulips (3000 K), candlelit windows
    road: { kind: 'klinkers', tone: '#4b342e' },
    lamp: tulipLamp,
    landmark: markt,
    extra: [],
    shops: ['KAASHANDEL', 'SIROOPWAFELS', 'KAARSEN', 'GOUDSE PIJPEN', 'KAAS EN WIJN', 'BAKKERIJ', 'CAFÉ DE ZALM'],
    signs: ['Markt', 'Waag', 'Sint-Jan', 'Westhaven', 'Oosthaven', 'Turfmarkt', 'Roode Leeuw', 'Kleiweg'],
    dead: { pool: ['goudsedrager', 'goudsedrager', 'kaasmeisje', 'kaarsdrager', 'cheese', 'plain'], dress: DRESS },
    themes: {
      // the Markt on candle night: the stadhuis alone on the cobbles beside the ride, the tree and the Waag beyond; candles in
      // the windows of the Markt houses, candle lanterns on the cobbles, the far side of the square across the open space
      square: (base, K) => Object.assign({}, base, {
        fog: 0x4d5258, fogD: 0.0148, night: 0.18, ground: 0x1d1e22, curv: 0.0016, landmark: false,
        road: { kind: 'cobbles', tone: '#4a4541', lines: false },
        spawn: [
          { make: seq([empty, markt]), n: 2, gap: 115, side: 'right', reg: true, xr: [17, 18], r: 14 },
          { make: K => row(K, 3, { candles: 0.55, lit: 0.12 }), n: 6, gap: 24, side: 'left', reg: true, xr: [9.6, 10], r: 9 },
          { make: K.backRow, n: 5, gap: 30, side: 'left', reg: true, xr: [21, 22.5], r: 14 },
          { make: K => row(K, 4, { plain: true, lit: 0.08, candles: 0.5 }), n: 4, gap: 36, side: 'right', reg: true, xr: [46, 48], r: 14 },
          { make: tulipLamp, n: 8, gap: 18, side: 'left', reg: true, xr: [4.7, 4.7] },
          { make: candleLantern, n: 7, gap: 20, side: 'right', reg: true, xr: [5.3, 5.3], r: 0.3 },
          { make: cheesePile, n: 3, gap: 70, side: 'right', xr: [7.5, 9.5], r: 1.2 },
          { make: () => K.treeCard([1, 1, 0]), n: 4, gap: 40, side: 'left', xr: [5.6, 6], r: 0.9 },
          { make: K.bench, n: 3, gap: 50, side: 'left', xr: [5.0, 5.1], r: 0.9 },
          { make: K.bikeRow, n: 3, gap: 50, side: 'left', xr: [4.9, 5.0], r: 0.6 },
          { make: fingerpost, n: 1, gap: 150, side: 'right', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 7, gap: 22, side: 'both', xr: [4.9, 5.6], r: 0.6 },
        ] }),
      // Westhaven and Oosthaven: the canal half a metre below the brick quay, a low brick bridge now and then, lime trees, the
      // canal houses across the water and above their roofs the long Sint-Jan with its coloured glass
      gracht: (base, K) => Object.assign({}, base, {
        fog: 0x4b5258, fogD: 0.0152, night: 0.18, ground: 0x15191e, groundY: -1.05, water: 0x161d26, waterY: GW, waterK: 0.3, canal: 1, curv: 0.0012, landmark: false,
        spawn: [
          { make: seq([farQuay, farQuay, K => farQuay(K, 'open'), K => farQuay(K, 'stadhuis'), farQuay, farQuay, farQuay]), n: 7, gap: 30, side: 'right', reg: true, xr: [0, 0], r: 0.5 },
          { make: brug, n: 1, gap: 160, side: 'right', xr: [12.3, 12.3], r: 3 },
          { make: K => row(K, 3, { candles: 0.22 }), n: 6, gap: 24, side: 'left', reg: true, xr: [7.9, 8.2], r: 9 },
          { make: K.backRow, n: 4, gap: 36, side: 'left', reg: true, xr: [19, 20.5], r: 14 },
          { make: tulipLamp, n: 8, gap: 18, side: 'left', reg: true, xr: [4.7, 4.7] },
          { make: tulipLamp, n: 3, gap: 50, side: 'right', reg: true, xr: [4.7, 4.7] },
          { make: () => K.treeCard([1, 1, 2]), n: 6, gap: 26, side: 'right', xr: [6.6, 7.1], r: 0.9 },
          { make: () => K.treeCard([0, 1]), n: 3, gap: 48, side: 'left', xr: [5.5, 5.8], r: 0.9 },
          { make: sintJan, n: 1, gap: 240, side: 'right', xr: [54, 58], r: 12 },
          { make: K.boat, n: 3, gap: 50, side: 'right', xr: [9.4, 10.2], y: GW + 0.6, r: 2.5 },
          { make: K.boat, n: 2, gap: 80, side: 'right', xr: [14.6, 15.4], y: GW + 0.6, r: 2.5 },
          { make: K.moorings, n: 4, gap: 40, side: 'right', xr: [8.3, 8.5], y: GW, r: 0.5 },
          { make: K.ducks, n: 2, gap: 60, side: 'right', xr: [11, 14], y: GW - 0.02 },
          { make: K.bikeRow, n: 4, gap: 30, side: 'both', xr: [4.9, 5.0], r: 0.6 },
          { make: K.bench, n: 2, gap: 70, side: 'right', xr: [5.4, 5.5], r: 0.9 },
          { make: fingerpost, n: 2, gap: 80, side: 'right', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 7, gap: 20, side: 'both', xr: [4.8, 5.4], r: 0.6 },
        ] }),
      // the shopping streets off the Markt (Kleiweg, Lange Groenendaal): cheese, candles and syrup waffles in the windows,
      // tulip lanterns on wires across the street, the Sint-Jan rising behind the roofs
      shops: (base, K) => { const r3 = K => row(K, 3, { shops: 0.8, candles: 0.2, lit: 0.45 }); return Object.assign({}, base, {
        fog: 0x4e5359, fogD: 0.016, night: 0.18, curv: 0.0022, landmark: false,
        spawn: [
          { make: seq([r3, r3, r3, r3, r3, empty, r3, marktOpening, r3, empty, r3, r3]), n: 12, gap: 12, side: 'alt', reg: true, xr: [7.6, 7.9], r: 9 },
          { make: seq([K.backRow, K.backRow, K.backRow, empty, K.backRow, empty, K.backRow, K.backRow]), n: 8, gap: 18, side: 'alt', reg: true, xr: [18.5, 20.5], r: 14 },
          { make: wireLamp, n: 7, gap: 20, side: 'right', reg: true, xr: [0, 0], r: 0.5 },
          { make: tulipLamp, n: 4, gap: 36, side: 'alt', reg: true, xr: [4.7, 4.7] },
          { make: sintJan, n: 1, gap: 240, side: 'right', xr: [48, 52], r: 12 },
          { make: K.cheeseCart, n: 2, gap: 80, side: 'both', xr: [5.4, 5.6], r: 0.9 },
          { make: cheesePile, n: 2, gap: 90, side: 'both', xr: [5.6, 5.8], r: 1.2 },
          { make: K.crates, n: 4, gap: 32, side: 'both', xr: [5.0, 5.2], r: 0.5 },
          { make: K.bikeRow, n: 5, gap: 26, side: 'both', xr: [4.9, 5.0], r: 0.6 },
          { make: K.bins, n: 2, gap: 60, side: 'both', xr: [5.0, 5.1], r: 0.5 },
          { make: K.bakfiets, n: 1, gap: 150, side: 'both', xr: [5.0, 5.1], r: 0.7 },
          { make: fingerpost, n: 1, gap: 140, side: 'both', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 8, gap: 18, side: 'both', xr: [4.8, 5.4], r: 0.6 },
        ] }); },
      // along the IJssel into town: the river black on the left with barges and the water tower across it, the polder on the
      // right with pollard willows, a cheese farm and its sign, and De Roode Leeuw turning by the road
      dyke: (base, K) => Object.assign({}, base, {
        fog: 0x4a5359, fogD: 0.0142, night: 0.17, water: 0x2f3a44, curv: 0.0035, landmark: false, road: { kind: 'asphalt', tone: '#353a44' },
        spawn: [
          { make: seq([empty, marktRand]), n: 2, gap: 100, side: 'right', reg: true, xr: [21, 21], y: -0.05, r: 30 },
          { make: roodeLeeuw, n: 1, gap: 190, side: 'right', xr: [17, 18], y: -0.6, r: 6 },
          { make: boerderij, n: 1, gap: 210, side: 'right', xr: [19, 19], y: -0.6, r: 11 },
          { make: K.windmill, n: 2, gap: 130, side: 'right', xr: [34, 50], y: -0.6, r: 4 },
          { make: willow, n: 16, gap: 13, side: 'right', xr: [7, 11], y: -0.7, r: 0.9 },
          { make: fenceRun, n: 8, gap: 30, side: 'right', reg: true, xr: [0, 0], r: 0.5 },
          { make: tulipLamp, n: 5, gap: 40, side: 'right', reg: true, xr: [4.7, 4.7] },
          { make: K => row(K, 2, { lit: 0.45, candles: 0.3 }), n: 2, gap: 120, side: 'right', xr: [22, 24], y: -0.6, r: 6 },
          { make: waterToren, n: 1, gap: 240, side: 'left', xr: [44, 48], y: -0.6, r: 8 },
          { make: K.reeds, n: 30, gap: 5, side: 'left', xr: [4.8, 5.6], y: -0.7 },
          { make: K.boat, n: 4, gap: 50, side: 'left', xr: [9, 14], y: 0, r: 2.5 },
          { make: K.moorings, n: 4, gap: 40, side: 'left', xr: [5.8, 6.2], y: -0.6 },
          { make: K.ducks, n: 2, gap: 70, side: 'left', xr: [7, 12], y: -0.62 },
          { make: K.bikeRow, n: 2, gap: 80, side: 'right', xr: [4.9, 5.0], r: 0.6 },
          { make: fingerpost, n: 1, gap: 180, side: 'right', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 4, gap: 50, side: 'right', xr: [4.8, 5.1], r: 0.6 },
        ] }),
    },
    // the painted far town: stepped gables near; the Sint-Jan's long roof, the stadhuis with its pinnacles at the end of the road,
    // the Gouwekerk's spire and the water tower in the middle band; polder, mills and a church far off
    skyline: {
      near(P, K, th) {
        if (th.open) { P.trees(0, 1, 5, 11, 15); for (let i = 0; i < 5; i++) P.house(P.X(0.1 + i * 0.2 + P.rr(-0.04, 0.04)), 9, 3.5, 'roof', 0.5); return; }
        P.roofs(0, 0.4, 9, 16, 0.1, ['step', 'step', 'bell', 'roof']); P.roofs(0.6, 1, 9, 16, 0.1, ['step', 'bell', 'roof', 'step']);
        P.trees(0, 0.4, 8, 15, 10); P.trees(0.6, 1, 8, 15, 10); P.trees(0.4, 0.6, 4, 7, 12);
      },
      mid(P, K, th) {
        const m = P.m, kinds = ['step', 'bell', 'roof'];
        P.trees(0, 1, 6, 12, 13); if (!th.open) { P.roofs(0, 0.2, 8, 13, 0.06, kinds); P.roofs(0.8, 1, 8, 13, 0.06, kinds); }
        const sj = P.X(0.32);
        P.box(sj, 46, -5, 14); P.poly([[sj - 23 * m, 14], [sj - 19 * m, 22], [sj + 19 * m, 22], [sj + 23 * m, 14]]); P.poly([[sj + 1 * m, 14], [sj + 7 * m, 25], [sj + 13 * m, 14]]);
        P.tower(sj - 28 * m, [[8, 30], [6, 6]], 'lantern', true);
        for (let i = 0; i < 7; i++) P.win(sj + (-19 + i * 6.2) * m, 4.5, 0.32, 1.5, 6);
        const x = P.X(0.53);
        P.box(x, 13, -5, 12);
        for (let i = 0; i < 6; i++) { const ww = 13 * (1 - i / 6); P.box(x, ww, 12 + i * 1.6, 13.6 + i * 1.6); for (const s of [-1, 1]) P.poly([[x + s * (ww / 2 - 0.5) * m, 13.6 + i * 1.6], [x + s * (ww / 2 - 0.25) * m, 15.6 + i * 1.6], [x + s * (ww / 2) * m, 13.6 + i * 1.6]]); }
        for (const s of [-1, 1]) { P.box(x + s * 6.8 * m, 1.8, 6, 18); P.poly([[x + s * 7.8 * m, 18], [x + s * 6.8 * m, 24], [x + s * 5.8 * m, 18]]); }
        P.box(x, 1.6, 21, 24); P.poly([[x - 1 * m, 24], [x, 29], [x + 1 * m, 24]]);
        for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) P.win(x + (-4.8 + c * 2.4) * m, 3 + r * 4.4, 0.95, 1.1, 2.6);
        P.tower(P.X(0.68), [[5, 22], [3.8, 9]], 'spire', false);
        const wt = P.X(0.86); P.box(wt, 6, -5, 22); P.box(wt, 8.5, 22, 27); P.poly([[wt - 4.6 * m, 27], [wt, 30], [wt + 4.6 * m, 27]]);
      },
      far(P) { P.trees(0, 1, 5, 10, 10); P.roofs(0, 1, 5, 9, 0.03, ['roof', 'step']); P.mill(P.X(0.16), 20, 0.5, 1); P.mill(P.X(0.92), 17, 1.1, 1); P.church(P.X(0.44), 30); },
    },
  };
})();
