// Intro panel 10 in 3D: "Page one: de or het. There is no rule. There is never a rule."
// Close on the grammar book on the coffee table, under the low lamp of his front room, his hands at its edges. In two beats:
// 1. 0 to 1.7 s: the book shut, still in its dust, the price sticker on. His right hand lifts the cover, it swings over and slaps
//    down on the table; dust puffs up into the lamplight. The dark dog watches over the far edge of the table.
// 2. From 1.7 s: page one. DE of HET in big letters, under it the rules, every one crossed out in red pencil with the word that
//    breaks it, and the reader's note in the margin: het? His left hand holds the book open, his right rests on the page's edge,
//    the dog tilts its head. The camera pushes in slowly until the page fills the picture, then drifts.
// The set stands round him where he is (the game keeps him at the middle of the road; he is hidden here, only his hands and
// sleeves are seen). The lamp's light is his bike lamp's spot hung in the shade and aimed straight down at the book; its place,
// aim and strength are set every frame. The street world is hidden for the shot and given back at the end.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const DEG = Math.PI / 180;
  const TOP = 0.42;                                             // the table top
  const BW = 0.17, BH = 0.245, BT = 0.03, BOARD = 0.0035;       // the book: width (x), height (z), thickness, its boards
  const SHUT = Math.PI - Math.asin((BT - BOARD) / BW);          // the cover lying open, its free edge on the table
  const PEND = { y: 0.72, z: -0.3 };                            // the bottom of the lamp's shade, on the road's middle line
  const LAMP = 1.0;                                            // the strength of the lamp's light (the game's spot)
  const MIN_HALF_W = 16, MIN_HALF_V = 12.5;
  let st = null;

  function rng(a) { return () => { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
  function ownTex(W, c, colour, repeat) { const t = new W.THREE.CanvasTexture(c); if (colour) t.colorSpace = W.THREE.SRGBColorSpace; if (repeat) t.wrapS = t.wrapT = W.THREE.RepeatWrapping; t.anisotropy = 8; st.tex.push(t); return t; }
  function ownMat(m) { st.mats.push(m); return m; }
  function ownGeo(g) { st.geo.push(g); return g; }
  const ease = (W, t, t0, len) => W.smooth(W.clamp((t - t0) / len, 0, 1));
  const SERIF = 'Georgia, "Times New Roman", serif', HAND = '"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive';

  // ---- canvases
  // the cover, as on the shelf: dark blue cloth, the gold band, the price sticker never peeled off, and the dust of two years
  function coverTex(W) {
    const [c, g] = canvas(512, 740), r = rng(11);
    g.fillStyle = '#263454'; g.fillRect(0, 0, 512, 740);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '10,18,40' : '70,96,150'},${(0.12 + r() * 0.2).toFixed(3)})`; g.fillRect(r() * 512, r() * 740, 1.5, 1 + r() * 3); }
    g.strokeStyle = 'rgba(214,170,84,0.75)'; g.lineWidth = 5; g.strokeRect(28, 28, 456, 684);
    const gr = g.createLinearGradient(0, 172, 0, 300); gr.addColorStop(0, '#f2cf78'); gr.addColorStop(0.5, '#d9a443'); gr.addColorStop(1, '#a8741f');
    g.fillStyle = gr; g.fillRect(28, 176, 456, 124);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#3a2408'; g.font = `bold 56px ${SERIF}`; g.fillText('GRAMMATICA', 256, 240);
    g.fillStyle = '#d9b060'; g.font = `italic 38px ${SERIF}`; g.fillText('Nederlands', 256, 364); g.font = `30px ${SERIF}`; g.fillText('deel 1', 256, 416);
    g.strokeStyle = '#d9b060'; g.lineWidth = 4; g.beginPath(); g.moveTo(256, 600); g.lineTo(256, 548); g.stroke();
    g.fillStyle = '#d9b060'; g.beginPath(); g.moveTo(236, 524); g.lineTo(246, 544); g.lineTo(256, 520); g.lineTo(266, 544); g.lineTo(276, 524); g.lineTo(272, 552); g.quadraticCurveTo(256, 568, 240, 552); g.closePath(); g.fill();
    g.save(); g.translate(392, 644); g.rotate(-0.06); g.fillStyle = '#f0cf4a'; g.fillRect(-68, -30, 136, 60); g.fillStyle = '#b8282a'; g.font = 'bold 34px "Segoe UI", system-ui, sans-serif'; g.fillText('€ 24,95', 0, 2); g.restore();
    for (let i = 0; i < 16000; i++) { const y = Math.pow(r(), 1.4) * 740; g.fillStyle = `rgba(196,190,176,${(0.05 + r() * 0.12).toFixed(3)})`; g.fillRect(r() * 512, y, 1 + r() * 3, 1 + r() * 3); }
    const dg = g.createLinearGradient(0, 0, 0, 740); dg.addColorStop(0, 'rgba(190,184,170,0.42)'); dg.addColorStop(1, 'rgba(190,184,170,0.16)');
    g.fillStyle = dg; g.fillRect(0, 0, 512, 740);
    return ownTex(W, c, true);
  }
  // the inside of the cover: a cream endpaper with a bookplate whose name line was never filled in
  function endTex(W) {
    const [c, g] = canvas(512, 740), r = rng(5);
    g.fillStyle = '#e6dcc4'; g.fillRect(0, 0, 512, 740);
    for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(150,130,100,${(r() * 0.08).toFixed(3)})`; g.fillRect(r() * 512, r() * 740, 2, 2); }
    g.strokeStyle = 'rgba(60,70,110,0.55)'; g.lineWidth = 3; g.strokeRect(126, 250, 260, 170);
    g.fillStyle = 'rgba(50,60,100,0.75)'; g.textAlign = 'center'; g.font = `italic 28px ${SERIF}`; g.fillText('Dit boek is van', 256, 300);
    g.fillRect(156, 376, 200, 2);
    const sh = g.createLinearGradient(512, 0, 400, 0); sh.addColorStop(0, 'rgba(60,40,20,0.35)'); sh.addColorStop(1, 'rgba(60,40,20,0)'); g.fillStyle = sh; g.fillRect(400, 0, 112, 740);
    return ownTex(W, c, true);
  }
  // page one. The rules are real, and so is every word that breaks them
  function pageTex(W) {
    const PW = 768, PH = 1100, [c, g] = canvas(PW, PH), r = rng(7);
    g.fillStyle = '#efe8d6'; g.fillRect(0, 0, PW, PH);
    for (let i = 0; i < 40; i++) { const x = r() * PW, y = r() * PH, rad = 20 + r() * 70, f = g.createRadialGradient(x, y, 0, x, y, rad); f.addColorStop(0, `rgba(180,150,100,${(r() * 0.05).toFixed(3)})`); f.addColorStop(1, 'rgba(180,150,100,0)'); g.fillStyle = f; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
    const gut = g.createLinearGradient(0, 0, 90, 0); gut.addColorStop(0, 'rgba(70,50,30,0.32)'); gut.addColorStop(1, 'rgba(70,50,30,0)'); g.fillStyle = gut; g.fillRect(0, 0, 90, PH);
    const ink = '#2b2a2e', grey = '#5a5852', red = '#b8282a';
    g.textBaseline = 'alphabetic';
    g.fillStyle = grey; g.font = `22px ${SERIF}`; g.textAlign = 'left'; g.fillText('HOOFDSTUK 1', 84, 74); g.textAlign = 'right'; g.fillText('LIDWOORDEN', PW - 70, 74);
    g.fillRect(84, 88, PW - 154, 2);
    // the title
    g.fillStyle = ink; g.textAlign = 'center';
    g.font = `bold 128px ${SERIF}`; const wDE = g.measureText('DE').width, wHET = g.measureText('HET').width;
    g.font = `italic 64px ${SERIF}`; const wOF = g.measureText('of').width;
    const gap = 26, tw = wDE + wOF + wHET + gap * 2, x0 = (PW - tw) / 2 + 8, ty = 262;
    g.textAlign = 'left'; g.font = `bold 128px ${SERIF}`; g.fillText('DE', x0, ty); g.fillText('HET', x0 + wDE + wOF + gap * 2, ty);
    g.font = `italic 64px ${SERIF}`; g.fillStyle = grey; g.fillText('of', x0 + wDE + gap, ty - 4);
    g.fillStyle = ink; g.font = `italic 27px ${SERIF}`; g.textAlign = 'center'; g.fillText('Elk zelfstandig naamwoord heeft de of het.', PW / 2 + 8, 330);
    g.fillText('Onthoud de volgende regels.', PW / 2 + 8, 366);
    g.fillRect(PW / 2 - 60, 404, 136, 2);
    // the rules, each struck through in red pencil, the word that breaks it scribbled after it
    const rules = [['1. Personen krijgen de.', 'het meisje'], ['2. Dieren krijgen de.', 'het paard'], ['3. Woorden op -ing krijgen de.', 'het ding'], ['4. Woorden met ge- krijgen het.', 'de gedachte'], ['5. Woorden op -um krijgen het.', 'de datum']];
    g.textAlign = 'left';
    const pencil = (pts, w, a) => { g.strokeStyle = red; g.globalAlpha = a || 0.9; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.globalAlpha = 1; };
    rules.forEach(([rule, but], i) => {
      const y = 482 + i * 82;
      g.fillStyle = ink; g.font = `30px ${SERIF}`; g.fillText(rule, 96, y); const w = g.measureText(rule).width;
      const wob = []; for (let k = 0; k <= 12; k++) wob.push([88 + (w + 22) * k / 12, y - 10 + Math.sin(k * 1.7 + i) * 2.2 + (k / 12 - 0.5) * (i % 2 ? 4 : -3)]);
      pencil(wob, 4.2); pencil(wob.map(([x, yy]) => [x + 3, yy + 3]), 2, 0.55);
      g.save(); g.translate(96 + w + 36, y - 2); g.rotate(-0.05 - (i % 3) * 0.02); g.fillStyle = red; g.globalAlpha = 0.92; g.font = `30px ${HAND}`; g.fillText(but, 0, 0); g.restore();
    });
    // and the reader's own note in the margin, circled, with an arrow up to the title
    g.save(); g.translate(560, 952); g.rotate(-0.09); g.fillStyle = red; g.globalAlpha = 0.95; g.font = `bold 52px ${HAND}`; g.textAlign = 'center'; g.fillText('het?', 0, 0); g.restore();
    const ring = []; for (let k = 0; k <= 40; k++) { const a = -0.4 + k / 40 * 6.9; ring.push([560 + Math.cos(a) * (88 + k * 0.4), 936 + Math.sin(a) * (46 + k * 0.2)]); } pencil(ring, 3.4);
    g.fillStyle = grey; g.font = `italic 22px ${SERIF}`; g.textAlign = 'left'; g.fillText('Uitzonderingen: zie blz. 2 t/m 340.', 96, 900);
    g.textAlign = 'center'; g.font = `24px ${SERIF}`; g.fillText('1', PW / 2 + 8, PH - 50);
    g.globalCompositeOperation = 'multiply'; const lf = g.createRadialGradient(PW * 0.45, -PH * 0.15, PH * 0.3, PW * 0.45, -PH * 0.15, PH * 1.35); lf.addColorStop(0, '#ffffff'); lf.addColorStop(1, '#b8ab98'); g.fillStyle = lf; g.fillRect(0, 0, PW, PH); g.globalCompositeOperation = 'source-over';
    return ownTex(W, c, true);
  }
  function woodTex(W) {   // the table top: warm planks along x, a long grain, a few rings of old mugs
    const [c, g] = canvas(1024, 512), r = rng(3);
    g.fillStyle = '#3c3028'; g.fillRect(0, 0, 1024, 512);
    for (let b = 0; b < 4; b++) {
      const y = b * 128, tone = 0.8 + r() * 0.3; g.fillStyle = `rgb(${Math.round(66 * tone)},${Math.round(52 * tone)},${Math.round(44 * tone)})`; g.fillRect(0, y, 1024, 128);
      for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '40,24,12' : '140,100,64'},${(0.1 + r() * 0.18).toFixed(3)})`; g.fillRect(0, y + r() * 126, 1024, 1 + r() * 2); }
      g.fillStyle = 'rgba(20,12,6,0.9)'; g.fillRect(0, y, 1024, 3);
    }
    for (const [x, y, rad] of [[760, 150, 46], [790, 176, 44], [250, 380, 42]]) { g.strokeStyle = 'rgba(30,18,8,0.35)'; g.lineWidth = 5; g.beginPath(); g.arc(x, y, rad, 0, 6.1); g.stroke(); }
    return ownTex(W, c, true, true);
  }
  function floorTex(W) {
    const [c, g] = canvas(256, 512), r = rng(9);
    g.fillStyle = '#272629'; g.fillRect(0, 0, 256, 512);
    for (let b = 0; b < 4; b++) { const x = b * 64, tone = 0.8 + r() * 0.35; g.fillStyle = `rgb(${Math.round(44 * tone)},${Math.round(40 * tone)},${Math.round(42 * tone)})`; g.fillRect(x, 0, 64, 512); g.fillStyle = 'rgba(16,10,6,0.95)'; g.fillRect(x, 0, 3, 512); }
    return ownTex(W, c, true, true);
  }
  function shaftTex(W) {   // a cone of light seen from the side: narrow and bright under the shade, wide and faint at the table
    const [c, g] = canvas(128, 128);
    for (let y = 0; y < 128; y++) { const u = y / 127, hw = (0.16 + 0.32 * u) * 128, a = (0.85 - 0.55 * u), gr = g.createLinearGradient(64 - hw, 0, 64 + hw, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${a.toFixed(3)})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(64 - hw, y, hw * 2, 1); }
    return ownTex(W, c, false);
  }
  function slabTex(W) {   // the cold light of the street through a window off to the left: two panes and the bar between them
    const [a, ga] = canvas(128, 128), [c, g] = canvas(128, 128);
    ga.fillStyle = '#000'; ga.fillRect(0, 0, 128, 128); ga.fillStyle = '#fff'; ga.fillRect(10, 18, 50, 92); ga.fillRect(68, 18, 50, 92);
    g.fillStyle = '#000'; g.fillRect(0, 0, 128, 128); g.filter = 'blur(5px)'; g.drawImage(a, 0, 0); g.filter = 'none';
    return ownTex(W, c, false);
  }
  function puffTex(W) {   // one soft lump of dust
    const [c, g] = canvas(64, 64), f = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    f.addColorStop(0, 'rgba(255,255,255,0.9)'); f.addColorStop(0.4, 'rgba(255,255,255,0.45)'); f.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = f; g.fillRect(0, 0, 64, 64); return ownTex(W, c, false);
  }

  // ---- the dark dog with the white bib, sitting, its head on a neck pivot (it looks and tilts), ears that lift on a tilt
  function dog(W) {
    const T = W.THREE, root = new T.Group(), ball = W.KG.ball;
    const [k0, k1, k2] = [0x1a1e26, 0x2e3440, 0x4b5360].map(c => ownMat(W.Mat({ color: c }, W.TINT.warm)));
    const bib = ownMat(W.Mat({ color: 0xcfc8b8 }, W.TINT.warm));
    const kb = W.kit(), B = (m, x, y, z, sx, sy, sz, rx) => W.kadd(kb, ball, m, x, y, z, rx || 0, 0, 0, sx, sy, sz);
    for (const s of [-1, 1]) { B(k1, s * 0.1, 0.14, 0.1, 0.2, 0.26, 0.32); B(k0, s * 0.13, 0.035, -0.03, 0.08, 0.06, 0.17); }
    B(k1, 0, 0.3, 0.0, 0.3, 0.5, 0.3, -0.35); B(k1, 0, 0.45, -0.1, 0.27, 0.3, 0.26); B(bib, 0, 0.44, -0.19, 0.17, 0.25, 0.09);
    for (const s of [-1, 1]) { W.ktube(kb, k1, s * 0.065, 0.42, -0.13, s * 0.066, 0.04, -0.16, 0.036); B(bib, s * 0.066, 0.03, -0.19, 0.075, 0.055, 0.1); }
    B(k1, 0, 0.57, -0.14, 0.17, 0.2, 0.18);
    W.kbuild(kb, root);
    const head = new T.Group(); head.position.set(0, 0.64, -0.17); head.rotation.order = 'YXZ'; head.scale.setScalar(1.15); root.add(head);
    const kh = W.kit(), H = (m, x, y, z, sx, sy, sz) => W.kadd(kh, ball, m, x, y, z, 0, 0, 0, sx, sy, sz);
    H(k1, 0, 0.05, -0.04, 0.2, 0.18, 0.21); H(k2, 0, 0.11, -0.06, 0.12, 0.05, 0.12); H(k2, 0, 0.0, -0.15, 0.12, 0.1, 0.17); H(k0, 0, -0.035, -0.13, 0.1, 0.05, 0.13);
    H(st.noseMat, 0, 0.012, -0.236, 0.05, 0.04, 0.04);
    for (const s of [-1, 1]) { H(st.eyeMat, s * 0.052, 0.07, -0.122, 0.04, 0.042, 0.03); H(st.glintMat, s * 0.054, 0.08, -0.135, 0.012, 0.012, 0.008); }
    W.kbuild(kh, head);
    for (const s of [-1, 1]) { const e = new T.Sprite(st.eyeGlow); e.position.set(s * 0.052, 0.07, -0.13); e.scale.set(0.08, 0.08, 1); head.add(e); }
    const ears = [];
    for (const s of [-1, 1]) { const ep = new T.Group(); ep.position.set(s * 0.085, 0.12, -0.02); head.add(ep); const ke = W.kit(); W.kadd(ke, ball, k0, s * 0.02, -0.07, 0, 0, 0, s * 0.22, 0.045, 0.17, 0.1); W.kbuild(ke, ep); ep.userData.s = s; ears.push(ep); }
    root.scale.setScalar(1.08);
    return { root, head, ears };
  }

  // ---- his hands: a palm, four fingers and a thumb, the orange sleeve and its cuff. In the hand's frame the fingers point along
  // its minus x for the right hand (s = 1) and plus x for the left (s = -1), the palm faces down, the sleeve runs back up its arm
  function hand(W, s) {
    const T = W.THREE, g = new T.Group(), k = W.kit(), skin = st.skinMat, f = -s;
    W.kadd(k, st.ballGeo, skin, f * 0.046, 0.003, 0.002, 0, 0, 0.05 * f, 0.1, 0.028, 0.08);                      // the palm, flat
    W.kadd(k, st.ballGeo, skin, f * 0.08, 0.004, 0.001, 0, 0, 0, 0.03, 0.026, 0.074);                              // the knuckles
    // four fingers lying together, each a little apart from the next and shorter at the sides, curling down to the tips
    [[-0.0245, 0.05], [-0.0082, 0.058], [0.0082, 0.056], [0.0245, 0.045]].forEach(([z, len]) => {
      const a = [f * 0.084, 0.003, z], m = [f * (0.084 + len * 0.55), 0.0, z * 1.03], b = [f * (0.084 + len), -0.009, z * 1.05];
      seg(W, k, skin, a, m, 0.0086); seg(W, k, skin, m, b, 0.0078);
    });
    seg(W, k, skin, [f * 0.032, -0.002, 0.03], [f * 0.058, -0.006, 0.047], 0.0102); seg(W, k, skin, [f * 0.058, -0.006, 0.047], [f * 0.077, -0.009, 0.052], 0.009);   // the thumb, near side
    seg(W, k, skin, [f * 0.004, 0.004, 0.001], [-f * 0.03, 0.014, 0.014], 0.022, true);                              // the wrist
    seg(W, k, st.cuffMat, [-f * 0.012, 0.01, 0.006], [-f * 0.056, 0.036, 0.038], 0.042, true);                       // the cuff
    seg(W, k, W.M.shirt, [-f * 0.05, 0.034, 0.035], [-f * 0.38, 0.21, 0.27], 0.046, true);                           // the sleeve of his orange coat
    W.kbuild(k, g);
    return g;
  }  // a smooth limb part from a to b: a long ball, or a cylinder (cyl) for the sleeve, in the kit
  const _q = { q: null, e: null, d: null, up: null };
  function seg(W, k, m, a, b, r, cyl) {
    const T = W.THREE; if (!_q.q) { _q.q = new T.Quaternion(); _q.e = new T.Euler(); _q.d = new T.Vector3(); _q.up = new T.Vector3(0, 1, 0); }
    _q.d.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const len = _q.d.length(); _q.q.setFromUnitVectors(_q.up, _q.d.normalize()); _q.e.setFromQuaternion(_q.q, 'XYZ');
    W.kadd(k, cyl ? st.cylGeo : st.ballGeo, m, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, _q.e.x, _q.e.y, _q.e.z, 2 * r, cyl ? len : len + 1.2 * r, 2 * r);
  }
  function build(W) {
    const THREE = W.THREE, r = rng(23);
    W.stage({ town: 'alblasserdam', theme: 'street', fog: 0.8, seed: 1010 });
    W.speed(0);
    W.beam.visible = false;
    // he is kept where the game keeps him, but nothing of the bike or of him shows: only the hands built here
    for (const ch of W.bike.children) if (ch.visible) { ch.visible = false; st.bikeHidden.push(ch); }
    const glow = (col, op) => ownMat(W.GlowMat(W.glowTex, col, op, true));
    const flat = (col, op) => ownMat(W.GlowMat(W.glowTex, col, op));
    st.noseMat = ownMat(new THREE.MeshBasicMaterial({ color: 0x0c0a0a }));
    st.eyeMat = ownMat(new THREE.MeshBasicMaterial({ color: 0x1c1008 }));
    st.glintMat = ownMat(new THREE.MeshBasicMaterial({ color: 0xfff2d8 }));
    st.eyeGlow = glow(0xffc27a, 0.28);
    st.skinMat = ownMat(W.Mat({ color: 0xb98c6a }, W.TINT.warm));
    st.ballGeo = ownGeo(new THREE.SphereGeometry(0.5, 14, 10)); st.cylGeo = ownGeo(new THREE.CylinderGeometry(0.5, 0.5, 1, 14));
    st.cuffMat = ownMat(W.Mat({ color: 0x9a4a18 }, W.TINT.warm));

    const set = st.set = new THREE.Group(); set.name = 'shot10-table';
    const k = W.kit(), wood = ownMat(W.Mat({ color: 0xffffff, map: woodTex(W) }, W.TINT.warm)), fm = ownMat(W.Mat({ color: 0xffffff, map: floorTex(W) }, W.TINT.warm));
    wood.userData.wuv = 1.2; fm.userData.wuv = 2.2;
    // the floor, the rug, the table and its legs; a far wall in the dark
    W.kb(k, fm, 0, -0.05, -1.5, 7, 0.1, 7);
    W.kb(k, fm, 0, -0.29, -1.5, 7, 0.1, 7);   // under the floor, the dog's haunches sink into nothing
    const rug = ownMat(W.Mat({ color: 0x232a3a })), rug2 = ownMat(W.Mat({ color: 0x323a50 }));
    W.kadd(k, W.KG.cyl, rug, 0, 0.006, -0.3, 0, 0, 0, 3.0, 0.012, 1.8); W.kadd(k, W.KG.cyl, rug2, 0, 0.01, -0.3, 0, 0, 0, 2.6, 0.012, 1.44);
    W.kb(k, wood, -0.04, TOP - 0.02, -0.06, 1.1, 0.04, 0.62);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) W.kb(k, W.M.wood, -0.04 + sx * 0.49, (TOP - 0.04) / 2, -0.06 + sz * 0.25, 0.05, TOP - 0.04, 0.05);
    W.kb(k, ownMat(W.Mat({ color: 0x353d52 })), 0, 1.3, -3.6, 7, 2.6, 0.1);
    // the mug, its coffee long cold
    const mug = ownMat(W.Mat({ color: 0x6a2a24 }, W.TINT.warm));
    W.kadd(k, W.KG.cyl, mug, 0.34, TOP + 0.05, -0.14, 0, 0, 0, 0.085, 0.1, 0.085);
    W.kadd(k, W.KG.cyl, ownMat(W.Mat({ color: 0x24160e }, W.TINT.warm)), 0.34, TOP + 0.097, -0.14, 0, 0, 0, 0.07, 0.006, 0.07);
    W.ktube(k, mug, 0.385, TOP + 0.07, -0.14, 0.405, TOP + 0.05, -0.14, 0.012);
    // the lamp's cord
    W.ktube(k, W.PM.pole, 0, 2.6, PEND.z, 0, PEND.y + 0.22, PEND.z, 0.006);
    W.kbuild(k, set);

    // the lamp: a cloth drum, hot inside, its bulb, its glow; the warm pool it throws on the table
    const drum = ownGeo(new THREE.CylinderGeometry(0.17, 0.22, 0.22, 24, 1, true));
    const so = new THREE.Mesh(drum, ownMat(new THREE.MeshBasicMaterial({ color: 0x8e5426 }))); so.position.set(0, PEND.y + 0.11, PEND.z); set.add(so);
    const si = new THREE.Mesh(drum, ownMat(new THREE.MeshBasicMaterial({ color: 0xffcc84, side: THREE.BackSide }))); si.position.copy(so.position); set.add(si);
    const bulb = new THREE.Mesh(W.KG.ball, ownMat(new THREE.MeshBasicMaterial({ color: 0xfff3d6 }))); bulb.scale.set(0.07, 0.09, 0.07); bulb.position.set(0, PEND.y + 0.06, PEND.z); set.add(bulb);
    st.lampGlow = new THREE.Sprite(glow(0xffb866, 0.6)); st.lampGlow.position.set(0, PEND.y + 0.04, PEND.z); st.lampGlow.scale.set(0.9, 0.9, 1); set.add(st.lampGlow);
    // a soft shaft of light from the shade down to the book, the dust shows in it
    st.shaft = new THREE.Mesh(W.KG.plane, ownMat(W.GlowMat(shaftTex(W), 0xffc888, 0.16))); st.shaft.scale.set(0.9, PEND.y - TOP, 1); st.shaft.position.set(0, (PEND.y + TOP) / 2, PEND.z + 0.12); set.add(st.shaft);
    st.pool = new THREE.Mesh(W.KG.plane, flat(0xffa04a, 0.16)); st.pool.rotation.x = -Math.PI / 2; st.pool.scale.set(1.2, 1.0, 1); st.pool.position.set(-0.03, TOP + 0.002, -0.06); set.add(st.pool);

    // the book: the back board, the block of pages with page one on top, the spine, and the front board on its hinge
    const book = st.book = new THREE.Group(); set.add(book);
    const cloth = ownMat(W.Mat({ color: 0x263454 })), paper = ownMat(W.Mat({ color: 0xa89c86 }, W.TINT.warm));
    const kbk = W.kit();
    W.kb(kbk, cloth, 0, BOARD / 2, 0, BW, BOARD, BH);
    W.kb(kbk, paper, 0.004, BT / 2, 0, BW - 0.016, BT - 2 * BOARD, BH - 0.014);
    W.kb(kbk, cloth, -BW / 2 - 0.002, BT / 2, 0, 0.006, BT, BH);
    W.kbuild(kbk, book);
    st.pageMat = ownMat(new THREE.MeshBasicMaterial({ map: pageTex(W), color: 0xeadfca }));
    const page = new THREE.Mesh(ownGeo(new THREE.PlaneGeometry(BW - 0.012, BH - 0.01).rotateX(-Math.PI / 2)), st.pageMat); page.position.set(0.004, BT - BOARD + 0.0006, 0); book.add(page);
    const hinge = st.hinge = new THREE.Group(); hinge.position.set(-BW / 2, BT - BOARD / 2, 0); book.add(hinge);
    const kc = W.kit(); W.kb(kc, cloth, BW / 2, 0, 0, BW, BOARD, BH); W.kbuild(kc, hinge);
    st.coverMat = ownMat(new THREE.MeshBasicMaterial({ map: coverTex(W), color: 0xb0aaa0 }));
    const front = new THREE.Mesh(ownGeo(new THREE.PlaneGeometry(BW, BH).rotateX(-Math.PI / 2)), st.coverMat); front.position.set(BW / 2, BOARD / 2 + 0.0005, 0); hinge.add(front);
    const inside = new THREE.Mesh(ownGeo(new THREE.PlaneGeometry(BW, BH).rotateZ(Math.PI).rotateX(Math.PI / 2)), ownMat(new THREE.MeshBasicMaterial({ map: endTex(W), color: 0xc8bba6 }))); inside.position.set(BW / 2, -BOARD / 2 - 0.0005, 0); hinge.add(inside);
    book.position.set(0, TOP, 0);

    // dust: fine grains lifted off the cover as it moves and thrown up where it lands, a few soft clouds of it, and the motes that
    // hang in the light afterwards. The grains are one cloud of points; each fades on its own through its colour (they add light)
    const pt = puffTex(W), N = 180;
    st.dust = [];
    for (let i = 0; i < N; i++) {
      const kind = i < 50 ? 0 : i < 150 ? 1 : 2;   // 0: off the cover as it lifts, 1: where it lands, 2: motes in the light
      st.dust.push({ kind, t0: kind === 0 ? 0.52 + r() * 0.4 : kind === 1 ? 1.42 + r() * 0.1 : 1.0 + r() * 1.5,
        x: kind === 1 ? -BW * (0.5 + r() * 1.05) : (r() - 0.5) * (kind === 2 ? 0.5 : BW), z: (r() - 0.5) * (kind === 2 ? 0.4 : BH),
        vx: (r() - 0.5) * 0.16 + (kind === 1 ? -0.05 : 0), vy: kind === 2 ? 0 : 0.05 + r() * 0.12, vz: (r() - 0.5) * 0.16,
        life: kind === 2 ? 99 : 1.4 + r() * 1.6, b: kind === 2 ? 0.25 + r() * 0.35 : 0.4 + r() * 0.6, ph: r() * 6.28, y0: kind === 2 ? 0.04 + r() * 0.14 : 0 });
    }
    const dg = ownGeo(new THREE.BufferGeometry());
    dg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); dg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    st.grains = new THREE.Points(dg, ownMat(new THREE.PointsMaterial({ map: pt, size: 0.011, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })));
    st.grains.frustumCulled = false; set.add(st.grains);
    st.clouds = [];
    for (let i = 0; i < 12; i++) {
      const late = i >= 3, s = new THREE.Sprite(ownMat(W.GlowMat(pt, 0xe6c49a, 0, true)));
      s.userData = { t0: late ? 1.43 + r() * 0.1 : 0.62 + r() * 0.3, x: late ? -BW * (0.4 + r() * 1.1) : (r() - 0.5) * BW, z: (r() - 0.5) * BH * 1.2, vx: (r() - 0.5) * 0.06 - (late ? 0.03 : 0), vy: 0.04 + r() * 0.05, size: 0.07 + r() * 0.07, life: 2.2 + r() * 1.2, op: late ? 0.22 + r() * 0.16 : 0.1 + r() * 0.08 };
      s.visible = false; set.add(s); st.clouds.push(s);
    }
    // the cold light of the street through the window off to the left, across the table
    const slab = new THREE.Mesh(W.KG.plane, ownMat(W.GlowMat(slabTex(W), 0x8aa0c0, 0.34))); slab.rotation.set(-Math.PI / 2, 0, 0.35); slab.scale.set(0.42, 0.56, 1); slab.position.set(-0.44, TOP + 0.003, -0.16); set.add(slab);
    // the dark dog on the far side of the table, watching
    st.dog = dog(W); st.dog.root.position.set(0.24, -0.19, -0.76); st.dog.root.rotation.y = Math.PI + 0.3; set.add(st.dog.root);

    // his hands at the edges of the book: the left holds its bottom corner, the right lies by the cover's edge
    st.left = hand(W, -1); set.add(st.left);
    st.right = hand(W, 1); set.add(st.right);
    // soft contact shadows under them, so they rest on the table and the page
    const sh = canvas(64, 64), shg = sh[1].createRadialGradient(32, 32, 0, 32, 32, 32); shg.addColorStop(0, 'rgba(0,0,0,0.55)'); shg.addColorStop(1, 'rgba(0,0,0,0)'); sh[1].fillStyle = shg; sh[1].fillRect(0, 0, 64, 64);
    const shm = ownMat(new THREE.MeshBasicMaterial({ map: ownTex(W, sh[0], false), color: 0x000000, transparent: true, depthWrite: false }));
    st.shadows = [st.left, st.right].map(() => { const m = new THREE.Mesh(W.KG.plane, shm); m.rotation.x = -Math.PI / 2; m.scale.set(0.2, 0.13, 1); m.renderOrder = 1; set.add(m); return m; });

    st.props.push(W.add(set, 0, 0, 0, 0)); set.updateMatrixWorld(true);

    // the lamp's light: his bike lamp's spot hung in the shade, warm, aimed down at the book from the road's middle line
    const L = W.lampLight;
    st.lampWas = { color: L.color.getHex(), angle: L.angle, penumbra: L.penumbra, distance: L.distance, decay: L.decay, y: L.position.y };
    L.color.set(0xffc28a); L.angle = 0.95; L.penumbra = 1; L.distance = 4; L.decay = 1;
    const P = [0, PEND.y + 0.06, PEND.z], A = [0, TOP, -0.02], u = (0.2 - P[1]) / (A[1] - P[1]);
    st.lampAt = { p: P, t: [0, 0.2, P[2] + u * (A[2] - P[2])] };

    // the street world is not seen from here: all of it is hidden, the sky and the lights stay
    const sky = o => o.isMesh && o.geometry && o.geometry.type === 'SphereGeometry' && o.geometry.parameters.radius >= 250;
    W.hide(o => (o.isMesh || o.isGroup || o.isSprite || o.isPoints || o.isLine) && !o.isLight && o !== W.bike && !sky(o));
  }

  // the cover's angle over time: still, a flick lifts it, it swings over on its own and slaps down with a small bounce
  function coverAngle(W, t) {
    if (t < 0.5) return 0;
    if (t < 0.8) return 0.55 * W.smooth((t - 0.5) / 0.3);
    if (t < 1.42) { const u = (t - 0.8) / 0.62; return 0.55 + (SHUT - 0.55) * (u < 0.5 ? 2 * u * u * 0.9 + u * 0.1 : 1 - Math.pow(1 - u, 2.6) * 0.9 - (1 - u) * 0.1); }
    const b = t - 1.42; return SHUT - 0.07 * Math.exp(-b * 9) * Math.abs(Math.sin(b * 16));
  }

  C[9] = {
    hold: 8.5,
    build(W) {
      st = { mats: [], tex: [], geo: [], props: [], bikeHidden: [] };
      try { build(W); } catch (e) { this.dispose(W); throw e; }
      this.update(W, 0, 0);
    },
    update(W, t, dt) {
      if (!st || !st.set) return;
      // the cover and the hand that flicks it: the fingertips lift its edge, it swings over and slaps down on the table
      const a = coverAngle(W, t); st.hinge.rotation.z = a;
      const ex = -BW / 2 + BW * Math.cos(Math.min(a, 0.5)), ey = TOP + BT + BW * Math.sin(Math.min(a, 0.5));   // the cover's free edge, while he still holds it
      const reach = ease(W, t, 0.3, 0.2), hold = 1 - ease(W, t, 0.78, 0.35), settle = ease(W, t, 1.75, 0.6);
      const rdx = Math.cos(-0.35), rdz = Math.sin(-0.35), tip = 0.15;   // the right hand's fingers point along (-rdx, -rdz)
      let rx = BW / 2 + 0.012, ry = TOP + 0.003, rz = 0.035, rt = 0.04;   // its fingertips: by the cover's edge
      if (t > 0.3) { const k = reach * hold; rx = W.lerp(rx, ex + 0.004, k); ry = W.lerp(ry, ey - 0.006, k); rt = W.lerp(rt, -0.35, k * Math.min(1, a / 0.3)); }
      rx = W.lerp(rx, BW / 2 - 0.004, settle); ry = W.lerp(ry, TOP + BT + 0.004, settle); rz = W.lerp(rz, 0.02, settle); rt = W.lerp(rt, -0.13, settle);   // then on the page's edge, holding it
      st.right.position.set(rx + tip * rdx, ry + tip * Math.sin(rt) + 0.016 * Math.cos(rt) + Math.sin(t * 1.3) * 0.0015, rz - tip * rdz);
      st.right.rotation.set(0, -0.35, rt);
      // the left hand waits on the table, then lifts over onto the open cover and holds the book open by the gutter
      const lm = ease(W, t, 1.62, 0.6), lyaw = W.lerp(0.42, 0.35, lm), ldx = Math.cos(lyaw), ldz = -Math.sin(lyaw);
      const lfx = W.lerp(-0.15, -0.1, lm), lfz = W.lerp(0.1, 0.085, lm), lfy = W.lerp(TOP + 0.003, TOP + 0.009, lm) + 0.03 * Math.sin(Math.PI * lm);   // its fingertips
      st.left.position.set(lfx - tip * ldx, lfy + 0.016 + Math.sin(t * 1.1 + 1) * 0.0015, lfz - tip * ldz); st.left.rotation.set(0, lyaw, 0.03);
      // their soft shadows on the table, or on the page and the cover they rest on
      st.shadows.forEach((m, i) => { const h = i ? st.right : st.left, s = i ? 1 : -1, ry = h.rotation.y, y = i ? (settle > 0.5 ? TOP + BT + 0.0015 : TOP + 0.0015) : TOP + 0.0015 + (lm > 0.5 ? 2 * BOARD + 0.001 : 0); m.position.set(h.position.x - s * 0.06 * Math.cos(ry), y, h.position.z + s * 0.06 * Math.sin(ry)); m.rotation.z = ry; });
      // dust: lifted off the cover as it moves, thrown up where it lands; it rises and spreads in the warm light and fades
      const pos = st.grains.geometry.attributes.position, col = st.grains.geometry.attributes.color;
      st.dust.forEach((u, i) => {
        let x = 0, y = -10, z = 0, b = 0;
        const age = t - u.t0;
        if (age >= 0 && age <= u.life) {
          if (u.kind === 2) { const ph = (t * 0.03 + u.ph / 6.28) % 1; x = u.x + Math.sin(t * 0.5 + u.ph) * 0.03; y = TOP + u.y0 + ph * 0.2; z = u.z + Math.cos(t * 0.4 + u.ph) * 0.02; b = u.b * Math.sin(Math.PI * ph) * W.clamp(age / 1.2, 0, 1); }
          else { const k = age / u.life, drag = (1 - Math.exp(-age * 2.5)) / 2.5; x = u.x + u.vx * drag; y = TOP + BT + 0.004 + u.vy * drag + 0.01 * age; z = u.z + u.vz * drag; b = u.b * Math.min(1, age * 8) * (1 - k) * (1 - k); }
        }
        pos.setXYZ(i, x, y, z); col.setXYZ(i, 0.95 * b, 0.82 * b, 0.62 * b);
      });
      pos.needsUpdate = true; col.needsUpdate = true;
      for (const s of st.clouds) {
        const u = s.userData, age = t - u.t0; if (age < 0 || age > u.life) { s.visible = false; continue; }
        const k = age / u.life, sz = u.size * (1 + 1.8 * k); s.visible = true; s.position.set(u.x + u.vx * age, TOP + BT + 0.02 + u.vy * age, u.z); s.scale.set(sz, sz, 1); s.material.opacity = u.op * Math.min(1, age * 5) * (1 - k);
      }
      // the lamp hums
      const hum = 1 + 0.02 * Math.sin(t * 7.3) * Math.sin(t * 2.3);
      st.lampGlow.material.opacity = 0.6 * hum;
      const L = W.lampLight; L.position.set(...st.lampAt.p); L.target.position.set(...st.lampAt.t); L.intensity = LAMP * hum;
      // the dog: on the book; when page one shows, a tilt of the head
      const d = st.dog, tilt = 0.45 * ease(W, t, 2.0, 0.25) * (1 - ease(W, t, 3.2, 0.35));
      const p = d.root.worldToLocal(st.set.localToWorld(new W.THREE.Vector3(-0.05, TOP + 0.02, 0)));
      const dx = p.x - d.head.position.x, dy = p.y - d.head.position.y, dz = p.z - d.head.position.z;
      d.head.rotation.set(Math.max(-0.04, Math.atan2(dy, Math.hypot(dx, dz))) + Math.sin(t * 2) * 0.01, Math.atan2(-dx, -dz) + Math.sin(t * 0.7) * 0.03, tilt);
      for (const e of d.ears) e.rotation.set(-0.2 * tilt * 2, 0, e.userData.s * 2 * tilt);
      // the eye: from his side of the table, a slow push in that tilts down until page one fills the picture, then a drift
      const k1 = ease(W, t, 0.9, 6.6), late = Math.max(0, t - 7.5) * 0.004;
      const A0 = [0.0, 0.66, 0.52], L0 = [-0.03, TOP + 0.07, -0.12];
      const A1 = [0.004, TOP + 0.43 - late, 0.065], L1 = [0.004, TOP + BT, -0.004];
      const cp = [0, 1, 2].map(i => W.lerp(A0[i], A1[i], k1)), lk = [0, 1, 2].map(i => W.lerp(L0[i], L1[i], k1));
      const asp = W.camera.aspect || 1.6, band = W.band(), f = document.getElementById('intro').classList.contains('cine') ? W.clamp(band.height / innerHeight, 0.3, 1) : 0.66;
      // at the end the page fills the picture: as big as it can be and still be read whole, its height on a wide screen, its width on an upright phone
      const fov0 = Math.max(44, 2 * Math.atan(Math.tan(MIN_HALF_W * DEG) / asp) / DEG, 2 * Math.atan(Math.tan(MIN_HALF_V * DEG) / f) / DEG);
      const dist = A1[1] - TOP - BT, fov1 = 0.97 * Math.max(2 * Math.atan((BH - 0.012) / 2 / dist / f) / DEG, 2 * Math.atan((BW - 0.014) / 2 / dist / asp) / DEG);
      const fov = W.lerp(fov0, fov1, k1);
      W.cam(...cp, ...lk, Math.min(fov, 70));
      W.drift(t, 0.25);
    },
    dispose(W) {
      if (!st) return;
      if (W && W.bike) for (const ch of st.bikeHidden) ch.visible = true;
      if (W && W.lampLight && st.lampWas) { const L = W.lampLight, o = st.lampWas; L.color.setHex(o.color); L.angle = o.angle; L.penumbra = o.penumbra; L.distance = o.distance; L.decay = o.decay; L.position.set(0, o.y, 0.4); L.target.position.set(0, 0.2, -20); }
      for (const p of st.props) p.traverse(m => { if (m.isMesh && m.geometry && m.geometry.userData.kit) m.geometry.dispose(); });
      for (const g of st.geo) g.dispose();
      for (const m of st.mats) m.dispose();
      for (const t of st.tex) t.dispose();
      st = null;
    },
  };
})();
