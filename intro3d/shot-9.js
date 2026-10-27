// Intro panel 9 in 3D: "Now the only ones who still understand him are two dogs and a grammar book he never opened."
// His small front room in Alblasserdam at night. The room is built round him where he stands in the street (he keeps his place at
// the origin, facing minus z), so the window behind the sofa looks down the game's own street: wet road, lit windows, lamps in the mist.
// One slow push in, in two beats:
// 1. 0 to 4.4 s: low, at the height of the dogs, on him on the sofa, deadpan. The brown dog lies beside him with its chin by his
//    knee, the dark one with the white bib sits on the rug at his feet; they look at him and tilt their heads in turn.
// 2. From 4.4 s: both dogs look up at the shelf over the standing lamp and the camera follows their look: it slides past him, rises
//    and pushes in on the grammar book there, still in its plastic with the price sticker on, under dust, faintly lit. It ends on a
//    slow drift.
// The key light is the standing lamp by the sofa, as in the painting: his bike lamp's spot, hung in its shade and turned warm. The
// glow of that lamp and of the low lamp over the table is faked with sprites and self-lit planes. What the window cannot show is
// hidden for the shot and given back; his bike and his riding arms and legs too, he sits on the sofa with his own seated ones.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const SEED = 909, DEG = Math.PI / 180, BEAT = 4.4;
  // the room in its own frame: the back wall (window, shelf) is z = 0, the room runs toward plus z (toward the eye), x to the right
  // as seen from inside, the floor y = 0. He sits at x = 0; in the world the room's x = 0 is the road's middle, its back wall stands
  // ZW behind him, and its floor FLOOR above the road, so his saddle height is the sofa's seat
  const ZW = 0.88, FLOOR = 0.58, RW = 5.6, RD = 4.7, RH = 2.62;
  const WIN = { x0: -0.9, x1: 0.9, y0: 0.98, y1: 2.36, tr: 1.98 };      // the window behind the sofa: left, right, sill, head, transom
  const SOFA = { x0: -1.15, x1: 1.15, z0: 0.06, z1: 0.98, seat: 0.46 };
  const SHELF = { x0: 1.22, x1: 2.68, y: 1.78, d: 0.22 };
  const BOOK = { x: 1.92, w: 0.17, h: 0.245, t: 0.034, lean: 0.12 };     // the grammar book stands on the shelf, cover out
  const TABLE = { x: 0.02, z: 2.05, w: 0.98, d: 0.52, h: 0.42 };
  const PEND = { y: 1.86, z: 2.62 };                                      // the bottom of the shade of the lamp over the table (x = 0)
  const STAND = { x: 1.5, z: 0.42, y: 1.2 };                              // the standing lamp by the sofa: its shade's bottom
  const LAMP = 2.3;                                                       // the strength of the lamp's light (the game's spot)
  const MIN_HALF_W = 17, MIN_HALF_V = 13;   // a narrow or a short picture widens the lens until this much shows round the middle
  let st = null;

  const L2W = (x, y, z) => [-x, FLOOR + y, ZW - z];   // room frame to world
  function rng(a) { return () => { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
  function ownTex(W, c, colour, repeat) { const t = new W.THREE.CanvasTexture(c); if (colour) t.colorSpace = W.THREE.SRGBColorSpace; if (repeat) t.wrapS = t.wrapT = W.THREE.RepeatWrapping; t.anisotropy = 4; st.tex.push(t); return t; }
  function ownMat(m) { st.mats.push(m); return m; }
  function ownGeo(g) { st.geo.push(g); return g; }
  const ease = (W, t, t0, len) => W.smooth(W.clamp((t - t0) / len, 0, 1));
  const bump = (W, t, t0, len, hold) => ease(W, t, t0, len) * (1 - ease(W, t, t0 + len + hold, len));   // up, hold, down

  // ---- canvases
  function wallTex(W) {   // a cold slate paper with a quiet stripe
    const [c, g] = canvas(256, 256), r = rng(3);
    g.fillStyle = '#3a4862'; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 32) { g.fillStyle = 'rgba(30,36,52,0.35)'; g.fillRect(x, 0, 3, 256); g.fillStyle = 'rgba(150,160,190,0.12)'; g.fillRect(x + 14, 0, 2, 256); }
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '20,24,36' : '170,178,200'},${(0.03 + r() * 0.05).toFixed(3)})`; g.fillRect(r() * 256, r() * 256, 1 + r() * 2, 1 + r() * 3); }
    return ownTex(W, c, true, true);
  }
  function floorTex(W) {   // dark boards, seams and a long grain
    const [c, g] = canvas(256, 512), r = rng(5);
    g.fillStyle = '#4a3324'; g.fillRect(0, 0, 256, 512);
    for (let b = 0; b < 4; b++) {
      const x = b * 64, tone = 0.8 + r() * 0.35;
      g.fillStyle = `rgba(${Math.round(80 * tone)},${Math.round(56 * tone)},${Math.round(38 * tone)},1)`; g.fillRect(x, 0, 64, 512);
      for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '30,20,12' : '120,90,60'},${(0.12 + r() * 0.18).toFixed(3)})`; g.fillRect(x + r() * 62, 0, 1 + r() * 1.5, 512); }
      const cut = r() * 512; g.fillStyle = 'rgba(16,10,6,0.9)'; g.fillRect(x, cut, 64, 3);
      g.fillStyle = 'rgba(16,10,6,0.95)'; g.fillRect(x, 0, 3, 512);
    }
    return ownTex(W, c, true, true);
  }
  // the grammar book's cover: dark blue cloth, a gold band with the title, a price sticker still on, and years of dust
  function coverTex(W) {
    const [c, g] = canvas(256, 370), r = rng(11);
    g.fillStyle = '#263454'; g.fillRect(0, 0, 256, 370);
    for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '10,18,40' : '70,96,150'},${(0.12 + r() * 0.2).toFixed(3)})`; g.fillRect(r() * 256, r() * 370, 1, 1 + r() * 2); }
    g.strokeStyle = 'rgba(214,170,84,0.75)'; g.lineWidth = 3; g.strokeRect(14, 14, 228, 342);
    const gr = g.createLinearGradient(0, 86, 0, 150); gr.addColorStop(0, '#f2cf78'); gr.addColorStop(0.5, '#d9a443'); gr.addColorStop(1, '#a8741f');
    g.fillStyle = gr; g.fillRect(14, 88, 228, 62);
    g.fillStyle = '#3a2408'; g.font = 'bold 28px Georgia, "Times New Roman", serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('GRAMMATICA', 128, 120);
    g.fillStyle = '#d9b060'; g.font = 'italic 19px Georgia, "Times New Roman", serif'; g.fillText('Nederlands', 128, 182); g.font = '15px Georgia, "Times New Roman", serif'; g.fillText('deel 1', 128, 208);
    g.strokeStyle = '#d9b060'; g.lineWidth = 2; g.beginPath(); g.moveTo(128, 300); g.lineTo(128, 274); g.stroke();   // a tulip, the publisher's mark
    g.fillStyle = '#d9b060'; g.beginPath(); g.moveTo(118, 262); g.lineTo(123, 272); g.lineTo(128, 260); g.lineTo(133, 272); g.lineTo(138, 262); g.lineTo(136, 276); g.quadraticCurveTo(128, 284, 120, 276); g.closePath(); g.fill();
    g.save(); g.translate(196, 322); g.rotate(-0.06); g.fillStyle = '#f0cf4a'; g.fillRect(-34, -15, 68, 30); g.fillStyle = '#b8282a'; g.font = 'bold 17px "Segoe UI", system-ui, sans-serif'; g.fillText('€ 24,95', 0, 1); g.restore();
    for (let i = 0; i < 5200; i++) { const y = Math.pow(r(), 1.6) * 370; g.fillStyle = `rgba(196,190,176,${(0.05 + r() * 0.12).toFixed(3)})`; g.fillRect(r() * 256, y, 1 + r() * 2, 1 + r() * 2); }
    const dg = g.createLinearGradient(0, 0, 0, 370); dg.addColorStop(0, 'rgba(190,184,170,0.42)'); dg.addColorStop(0.5, 'rgba(190,184,170,0.2)'); dg.addColorStop(1, 'rgba(190,184,170,0.1)');
    g.fillStyle = dg; g.fillRect(0, 0, 256, 370);
    const sh = g.createLinearGradient(0, 0, 256, 370); sh.addColorStop(0.2, 'rgba(255,255,255,0)'); sh.addColorStop(0.28, 'rgba(255,255,255,0.1)'); sh.addColorStop(0.34, 'rgba(255,255,255,0)');
    g.fillStyle = sh; g.fillRect(0, 0, 256, 370);
    return ownTex(W, c, true);
  }
  // the other books on the shelf: a strip of spines in muted cloth, each with a pale band or two
  function spineTex(W) {
    const [c, g] = canvas(256, 64), r = rng(13), cols = ['#5a2426', '#2a4034', '#6a5226', '#2c3446', '#4a2a3e', '#3a3a30', '#6e3a22', '#24303a'];
    for (let i = 0; i < 8; i++) {
      g.fillStyle = cols[i]; g.fillRect(i * 32, 0, 32, 64);
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(i * 32, 0, 3, 64); g.fillRect(i * 32 + 29, 0, 3, 64);
      g.fillStyle = 'rgba(214,180,110,0.6)'; g.fillRect(i * 32 + 6, 8 + r() * 4, 20, 2); g.fillRect(i * 32 + 6, 44 + r() * 8, 20, 2);
      g.fillStyle = 'rgba(214,180,110,0.35)'; for (let k = 0; k < 4; k++) g.fillRect(i * 32 + 12 + r() * 6, 18 + k * 5, 6, 2);
    }
    return ownTex(W, c, true);
  }
  function delftTex(W) {   // a Delft tile with a windmill: the Netherlands has no mountains
    const [c, g] = canvas(128, 128);
    g.fillStyle = '#3a2618'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#e8e4da'; g.fillRect(10, 10, 108, 108);
    g.strokeStyle = '#3a5aa0'; g.fillStyle = '#3a5aa0'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(56, 98); g.lineTo(60, 60); g.lineTo(68, 60); g.lineTo(72, 98); g.closePath(); g.fill();
    for (let i = 0; i < 4; i++) { const a = 0.5 + i * Math.PI / 2; g.beginPath(); g.moveTo(64, 58); g.lineTo(64 + Math.cos(a) * 34, 58 + Math.sin(a) * 34); g.stroke(); }
    g.lineWidth = 2; g.beginPath(); g.moveTo(16, 100); g.lineTo(112, 100); g.stroke();
    for (const [x, y] of [[18, 18], [110, 18], [18, 110], [110, 110]]) { g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill(); }
    return ownTex(W, c, true);
  }
  function polderTex(W) {   // a small dark painting: a polder at dusk, a mill on the dyke, its reflection
    const [c, g] = canvas(128, 96), r = rng(19);
    let gr = g.createLinearGradient(0, 0, 0, 60); gr.addColorStop(0, '#2a3446'); gr.addColorStop(1, '#8a7a62'); g.fillStyle = gr; g.fillRect(0, 0, 128, 60);
    gr = g.createLinearGradient(0, 60, 0, 96); gr.addColorStop(0, '#5a5448'); gr.addColorStop(1, '#1c2228'); g.fillStyle = gr; g.fillRect(0, 60, 128, 36);
    g.fillStyle = '#16181c'; g.fillRect(0, 56, 128, 6); g.beginPath(); g.moveTo(80, 58); g.lineTo(84, 30); g.lineTo(92, 30); g.lineTo(96, 58); g.fill();
    g.strokeStyle = '#16181c'; g.lineWidth = 2; for (let i = 0; i < 4; i++) { const a = 0.3 + i * Math.PI / 2; g.beginPath(); g.moveTo(88, 31); g.lineTo(88 + Math.cos(a) * 22, 31 + Math.sin(a) * 22); g.stroke(); }
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(255,240,210,${(r() * 0.06).toFixed(3)})`; g.fillRect(r() * 128, r() * 96, 2, 1); }
    return ownTex(W, c, true);
  }

  // ---- the dogs: a brown one and a dark one with a white bib, as in the painting. Each is a body, a head on a neck pivot (it turns,
  // looks up and tilts), two floppy ears on their own pivots (they lift on a tilt) and a tail. They face their own minus z.
  function dog(W, o) {
    const T = W.THREE, root = new T.Group(), ball = W.KG.ball;
    const [k0, k1, k2] = o.coat.map(c => ownMat(W.Mat({ color: c }, W.TINT.warm)));
    const kb = W.kit(), B = (m, x, y, z, sx, sy, sz, rx) => W.kadd(kb, ball, m, x, y, z, rx || 0, 0, 0, sx, sy, sz);
    let neck, tailAt;
    if (o.sit) {
      for (const s of [-1, 1]) { B(k1, s * 0.1, 0.14, 0.1, 0.2, 0.26, 0.32); B(k0, s * 0.13, 0.035, -0.03, 0.08, 0.06, 0.17); }   // haunches, hind feet
      B(k1, 0, 0.3, 0.0, 0.3, 0.5, 0.3, -0.35);                                                // the body, upright
      B(k1, 0, 0.45, -0.1, 0.27, 0.3, 0.26);                                                   // the chest
      if (o.bib) B(st.bibMat, 0, 0.44, -0.19, 0.17, 0.25, 0.09);
      for (const s of [-1, 1]) { W.ktube(kb, k1, s * 0.065, 0.42, -0.13, s * 0.066, 0.04, -0.16, 0.036); B(o.bib ? st.bibMat : k2, s * 0.066, 0.03, -0.19, 0.075, 0.055, 0.1); }
      B(k1, 0, 0.57, -0.14, 0.17, 0.2, 0.18);                                                  // the neck
      neck = [0, 0.64, -0.17]; tailAt = [0, 0.07, 0.24];
    } else {
      B(k1, 0, 0.15, 0.08, 0.36, 0.28, 0.66);                                                  // the body, lying
      B(k1, 0, 0.19, -0.2, 0.3, 0.3, 0.3);                                                     // the chest
      for (const s of [-1, 1]) B(k0, s * 0.11, 0.13, 0.3, 0.17, 0.24, 0.3);                     // haunches
      B(k2, 0.12, 0.17, 0.3, 0.1, 0.18, 0.22);                                                 // the near thigh catches the light
      for (const s of [-1, 1]) { W.ktube(kb, k1, s * 0.07, 0.07, -0.24, s * 0.08, 0.04, -0.47, 0.038); B(k2, s * 0.08, 0.035, -0.5, 0.075, 0.055, 0.1); }
      B(k1, 0, 0.26, -0.3, 0.18, 0.2, 0.2);                                                    // the neck
      neck = [0, 0.29, -0.36]; tailAt = [0, 0.17, 0.4];
    }
    W.kbuild(kb, root);
    // the head: a round skull, a paler muzzle, a wet nose, dark eyes with a warm glint
    const head = new T.Group(); head.position.set(...neck); head.rotation.order = 'YXZ'; root.add(head);
    const kh = W.kit(), H = (m, x, y, z, sx, sy, sz) => W.kadd(kh, ball, m, x, y, z, 0, 0, 0, sx, sy, sz);
    H(k1, 0, 0.05, -0.04, 0.2, 0.18, 0.21);
    H(k2, 0, 0.11, -0.06, 0.12, 0.05, 0.12);                                                   // the lit crown
    H(k2, 0, 0.0, -0.15, 0.12, 0.1, 0.17);
    H(k0, 0, -0.035, -0.13, 0.1, 0.05, 0.13);                                                  // the jaw
    H(st.noseMat, 0, 0.012, -0.236, 0.05, 0.04, 0.04);
    for (const s of [-1, 1]) { H(st.eyeMat, s * 0.052, 0.07, -0.122, 0.04, 0.042, 0.03); H(st.glintMat, s * 0.054, 0.08, -0.135, 0.012, 0.012, 0.008); }
    W.kbuild(kh, head);
    const eyes = [];
    for (const s of [-1, 1]) { const e = new T.Sprite(st.eyeGlow); e.position.set(s * 0.052, 0.07, -0.13); e.scale.set(0.08, 0.08, 1); head.add(e); eyes.push(e); }
    head.scale.setScalar(1.15);
    const ears = [];
    for (const s of [-1, 1]) {
      const ep = new T.Group(); ep.position.set(s * 0.085, 0.12, -0.02); head.add(ep);
      const ke = W.kit(); W.kadd(ke, ball, k0, s * 0.02, -0.07, 0, 0, 0, s * 0.22, 0.045, 0.17, 0.1); W.kbuild(ke, ep);
      ep.userData.s = s; ears.push(ep);
    }
    const tail = new T.Group(); tail.position.set(...tailAt); root.add(tail);
    const kt = W.kit();
    if (o.sit) { W.ktube(kt, k1, 0, 0, 0, 0.12, -0.03, 0.1, 0.03); W.ktube(kt, k1, 0.12, -0.03, 0.1, 0.27, -0.04, 0.13, 0.026); }
    else { W.ktube(kt, k1, 0, 0, 0, 0.02, -0.04, 0.17, 0.03); W.ktube(kt, k1, 0.02, -0.04, 0.17, 0.07, -0.1, 0.32, 0.026); }
    W.kbuild(kt, tail);
    root.scale.setScalar(o.scale || 1);
    return { root, head, ears, tail, eyes, sit: !!o.sit };
  }

  // ---- him: the rider off his bike. The bike, its lamp and his riding arms and legs are hidden; his own torso and head stay, and
  // seated arms and legs go on in the bike's frame (he faces its minus z), from the game's coat and trouser materials. The bike keeps
  // the place the game gives it, so nothing here fights the game's own update
  function seat(W) {
    const b = W.bike, u = b.userData;
    let torso = null;
    for (const ch of b.children) if (ch.isMesh && ch.material === W.M.shirt && ch.geometry && ch.geometry.type === 'CapsuleGeometry') torso = ch;
    for (const ch of b.children) if (ch !== torso && ch !== u.head && ch.visible) { ch.visible = false; st.bikeHidden.push(ch); }
    // his coat a little self-lit, so its orange stays the one saturated colour in the room: his own copy, given back at the end
    const shirt = ownMat(W.Mat({ color: W.M.shirt.color.getHex() })); shirt.emissive.copy(W.M.shirt.color).multiplyScalar(0.28);
    if (torso) { torso.material = shirt; st.coat = torso; }
    const k = W.kit(), legs = W.M.rider, fy = FLOOR;
    for (const s of [-1, 1]) {   // s = 1 is his right (the bike's plus x)
      const hip = [s * 0.1, 1.04, 0.24], knee = [s * 0.13, 1.05, -0.25], ankle = [s * 0.15, fy + 0.07, -0.31];
      W.ktube(k, legs, ...hip, ...knee, 0.068); W.kadd(k, W.KG.ball, legs, ...knee, 0, 0, 0, 0.14, 0.14, 0.14);
      W.ktube(k, legs, ...knee, ...ankle, 0.058); W.kb(k, W.PM.pole, s * 0.15, fy + 0.03, -0.37, 0.11, 0.08, 0.25);
    }
    // his hands lie in his lap
    for (const s of [-1, 1]) {
      const sh = [s * 0.22, 1.6, 0.18], el = [s * 0.3, 1.22, 0.06], wr = [s * 0.13, 1.1, -0.17];
      W.ktube(k, shirt, ...sh, ...el, 0.052); W.kadd(k, W.KG.ball, shirt, ...el, 0, 0, 0, 0.11, 0.11, 0.11);
      W.ktube(k, shirt, ...el, ...wr, 0.048);
      W.kadd(k, W.KG.ball, st.skinMat, wr[0], wr[1] - 0.01, wr[2] - 0.05, 0, 0, 0, 0.09, 0.06, 0.12);
    }
    st.limbs = W.kbuild(k); b.add(st.limbs);
  }

  // ---- the set
  function build(W) {
    const THREE = W.THREE;
    W.stage({ town: 'alblasserdam', theme: 'street', fog: 1.25, seed: SEED });
    W.speed(0);
    W.face('deadpan');
    W.beam.visible = false;
    const glow = (col, op) => ownMat(W.GlowMat(W.glowTex, col, op, true));
    const flat = (col, op) => ownMat(W.GlowMat(W.glowTex, col, op));
    st.noseMat = ownMat(new THREE.MeshBasicMaterial({ color: 0x0c0a0a }));
    st.eyeMat = ownMat(new THREE.MeshBasicMaterial({ color: 0x1c1008 }));
    st.glintMat = ownMat(new THREE.MeshBasicMaterial({ color: 0xfff2d8 }));
    st.eyeGlow = glow(0xffc27a, 0.45);
    st.bibMat = ownMat(W.Mat({ color: 0xcfc8b8 }, W.TINT.warm));
    st.skinMat = ownMat(W.Mat({ color: 0xd9b48c }, W.TINT.warm));
    const r = rng(17);

    const room = st.room = new THREE.Group(); room.name = 'shot9-room';
    // walls, floor and ceiling; the back wall is built round the window opening
    const wm = ownMat(W.Mat({ color: 0xffffff, map: wallTex(W) })); wm.userData.wuv = 1.6;
    const fm = ownMat(W.Mat({ color: 0xffffff, map: floorTex(W) }, W.TINT.warm)); fm.userData.wuv = 2.2;
    const ceil = ownMat(W.Mat({ color: 0x1d2028 })), wood = W.M.wood, trim = ownMat(W.Mat({ color: 0x8e8a80 }));
    const k = W.kit(), T = 0.12;
    W.kb(k, fm, 0, -0.05, RD / 2, RW, 0.1, RD);
    W.kb(k, ceil, 0, RH + 0.05, RD / 2, RW, 0.1, RD);
    W.kb(k, wm, -RW / 2 - T / 2, RH / 2, RD / 2, T, RH, RD); W.kb(k, wm, RW / 2 + T / 2, RH / 2, RD / 2, T, RH, RD);
    W.kb(k, wm, 0, RH / 2, RD + T / 2, RW, RH, T);
    W.kb(k, wm, (WIN.x0 + WIN.x1) / 2, WIN.y0 / 2, -T / 2, WIN.x1 - WIN.x0, WIN.y0, T);
    W.kb(k, wm, (WIN.x0 + WIN.x1) / 2, (WIN.y1 + RH) / 2, -T / 2, WIN.x1 - WIN.x0, RH - WIN.y1, T);
    W.kb(k, wm, (-RW / 2 + WIN.x0) / 2, RH / 2, -T / 2, WIN.x0 + RW / 2, RH, T);
    W.kb(k, wm, (WIN.x1 + RW / 2) / 2, RH / 2, -T / 2, RW / 2 - WIN.x1, RH, T);
    for (const [x, z, w, d] of [[0, 0.015, RW, 0.03], [-RW / 2 + 0.015, RD / 2, 0.03, RD], [RW / 2 - 0.015, RD / 2, 0.03, RD]]) { W.kb(k, wood, x, 0.07, z, w, 0.14, d); W.kb(k, wood, x, 2.2, z, w, 0.035, d); }
    // the window: a pale frame, a mullion and a transom, a deep sill; slate curtains drawn to the sides on a rail
    const wx = (WIN.x0 + WIN.x1) / 2, ww = WIN.x1 - WIN.x0;
    for (const x of [WIN.x0 + 0.03, wx, WIN.x1 - 0.03]) W.kb(k, trim, x, (WIN.y0 + WIN.y1) / 2, -0.06, 0.06, WIN.y1 - WIN.y0, 0.08);
    for (const y of [WIN.y0 + 0.03, WIN.tr, WIN.y1 - 0.03]) W.kb(k, trim, wx, y, -0.06, ww, 0.06, 0.08);
    W.kb(k, trim, wx, WIN.y0 - 0.02, 0.06, ww + 0.16, 0.04, 0.2);
    const curtain = ownMat(W.Mat({ color: 0x2a3140 }));
    for (const x0 of [WIN.x0 - 0.26, WIN.x1 + 0.02]) for (let i = 0; i < 4; i++) W.kb(k, curtain, x0 + i * 0.06 + 0.03, 1.66, 0.1 + (i % 2) * 0.035, 0.065, 1.42, 0.05);
    W.ktube(k, W.PM.pole, WIN.x0 - 0.32, 2.42, 0.1, WIN.x1 + 0.32, 2.42, 0.1, 0.014);
    // the sofa: a low teal one, its back against the back wall, a quiet slate cushion in its far corner
    const cloth = ownMat(W.Mat({ color: 0x2c5163 })), cloth2 = ownMat(W.Mat({ color: 0x223f4e }));
    const sx = (SOFA.x0 + SOFA.x1) / 2, sw = SOFA.x1 - SOFA.x0, sz = (SOFA.z0 + SOFA.z1) / 2, sd = SOFA.z1 - SOFA.z0;
    W.kb(k, cloth2, sx, 0.22, sz, sw, 0.3, sd);
    for (const s of [-1, 1]) W.kb(k, cloth, sx + s * sw / 4, SOFA.seat - 0.07, sz + 0.06, sw / 2 - 0.02, 0.14, sd - 0.12);
    W.kb(k, cloth2, sx, 0.66, SOFA.z0 + 0.13, sw, 0.52, 0.22);
    for (const s of [-1, 1]) W.kb(k, cloth, sx + s * sw / 4, 0.68, SOFA.z0 + 0.27, sw / 2 - 0.04, 0.42, 0.12, -0.12, 0, 0);
    for (const s of [-1, 1]) { W.kb(k, cloth2, sx + s * (sw / 2 + 0.08), 0.4, sz, 0.18, 0.5, sd); W.kb(k, cloth, sx + s * (sw / 2 + 0.08), 0.66, sz, 0.2, 0.06, sd + 0.02); }
    for (const x of [SOFA.x0 + 0.05, SOFA.x1 - 0.05]) for (const z of [SOFA.z0 + 0.1, SOFA.z1 - 0.08]) W.kb(k, wood, x, 0.03, z, 0.05, 0.06, 0.05);
    W.kb(k, ownMat(W.Mat({ color: 0x3e4658 })), SOFA.x1 - 0.3, 0.66, SOFA.z0 + 0.36, 0.34, 0.32, 0.12, -0.25, 0.15, 0.05);
    // the rug, and the clog the dogs chew
    const rug = ownMat(W.Mat({ color: 0x232a3a })), rug2 = ownMat(W.Mat({ color: 0x323a50 }));
    W.kadd(k, W.KG.cyl, rug, 0.1, 0.006, 1.8, 0, 0, 0, 3.0, 0.012, 1.8);
    W.kadd(k, W.KG.cyl, rug2, 0.1, 0.01, 1.8, 0, 0, 0, 2.6, 0.012, 1.44);
    W.kadd(k, W.KG.cyl, rug, 0.1, 0.014, 1.8, 0, 0, 0, 2.0, 0.012, 0.96);
    const clog = ownMat(W.Mat({ color: 0x9a7a2a }, W.TINT.warm));
    W.kb(k, clog, -0.85, 0.05, 1.75, 0.24, 0.08, 0.1, 0, 0.5, 0); W.kadd(k, W.KG.ball, clog, -0.95, 0.06, 1.8, 0, 0.5, 0, 0.13, 0.1, 0.11);
    // the coffee table under the lamp, a mug on it
    W.kb(k, wood, TABLE.x, TABLE.h - 0.025, TABLE.z, TABLE.w, 0.05, TABLE.d);
    for (const sxx of [-1, 1]) for (const szz of [-1, 1]) W.kb(k, wood, TABLE.x + sxx * (TABLE.w / 2 - 0.06), (TABLE.h - 0.05) / 2, TABLE.z + szz * (TABLE.d / 2 - 0.06), 0.05, TABLE.h - 0.05, 0.05);
    const mug = ownMat(W.Mat({ color: 0x6a2a24 }, W.TINT.warm));
    W.kadd(k, W.KG.cyl, mug, TABLE.x + 0.3, TABLE.h + 0.05, TABLE.z - 0.06, 0, 0, 0, 0.09, 0.1, 0.09);
    W.kadd(k, W.KG.cyl, W.PM.roof, TABLE.x + 0.3, TABLE.h + 0.098, TABLE.z - 0.06, 0, 0, 0, 0.075, 0.006, 0.075);
    // a low cabinet on the left with a plant, a small painting of the polder over it
    W.kb(k, wood, -2.25, 0.36, 0.25, 0.9, 0.72, 0.42);
    for (const x of [-2.47, -2.03]) W.kb(k, ownMat(W.Mat({ color: 0x2a1c12 }, W.TINT.warm)), x, 0.36, 0.465, 0.4, 0.6, 0.01);
    W.kadd(k, W.KG.cyl, ownMat(W.Mat({ color: 0x5a3426 }, W.TINT.warm)), -2.5, 0.82, 0.25, 0, 0, 0, 0.2, 0.2, 0.2);
    for (let i = 0; i < 6; i++) W.kadd(k, W.KG.ball, W.PM.leaf, -2.5 + (r() - 0.5) * 0.3, 1.05 + r() * 0.3, 0.25 + (r() - 0.5) * 0.2, 0, r() * 3, 0, 0.26, 0.32, 0.22);
    W.kb(k, wood, -2.05, 1.62, 0.02, 0.56, 0.44, 0.03);
    W.kadd(k, W.KG.plane, ownMat(W.Mat({ color: 0xffffff, map: polderTex(W) })), -2.05, 1.62, 0.037, 0, 0, 0, 0.48, 0.36, 1);
    // the standing lamp at the end of the sofa: a heavy foot, a thin brass pole
    W.kadd(k, W.KG.cyl, W.PM.pole, STAND.x, 0.02, STAND.z, 0, 0, 0, 0.3, 0.04, 0.3);
    W.ktube(k, ownMat(W.Mat({ color: 0x8a6a3a }, W.TINT.warm)), STAND.x, 0.03, STAND.z, STAND.x, STAND.y + 0.12, STAND.z, 0.012);
    // the shelf over the standing lamp: a plank on two brackets
    W.kb(k, wood, (SHELF.x0 + SHELF.x1) / 2, SHELF.y - 0.015, SHELF.d / 2, SHELF.x1 - SHELF.x0, 0.03, SHELF.d);
    for (const x of [SHELF.x0 + 0.2, SHELF.x1 - 0.2]) { W.kb(k, W.PM.pole, x, SHELF.y - 0.12, 0.02, 0.02, 0.2, 0.03); W.ktube(k, W.PM.pole, x, SHELF.y - 0.2, 0.02, x, SHELF.y - 0.03, SHELF.d - 0.04, 0.008); }
    // the lamp's cord from the ceiling
    W.ktube(k, W.PM.pole, 0, RH, PEND.z, 0, PEND.y + 0.24, PEND.z, 0.006);
    W.kbuild(k, room);

    // the books: dark bodies, and the strip of spines in one texture; two lying flat, a pot, and the tile leaning
    const kb2 = W.kit(), spines = ownMat(W.Mat({ color: 0xffffff, map: spineTex(W) }, W.TINT.warm));
    let bx = SHELF.x0 + 0.92;
    const spinePlane = i => { const p = new THREE.PlaneGeometry(1, 1), uv = p.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, (i + uv.getX(j)) / 8); return p; };
    for (let i = 0; i < 5; i++) {
      const w = 0.03 + r() * 0.025, h = 0.19 + r() * 0.07, d = 0.15 + r() * 0.04, lean = i === 4 ? -0.28 : 0;
      W.kb(kb2, W.PM.roof, bx + w / 2, SHELF.y + h / 2, d / 2 + 0.01, w, h, d, 0, 0, lean);
      const sp = spinePlane(i); W.kadd(kb2, sp, spines, bx + w / 2 + (lean ? -h / 2 * Math.sin(lean) : 0), SHELF.y + h / 2, d + 0.012, 0, 0, lean, w, h, 1); sp.dispose();
      bx += w + 0.004 + (i === 3 ? 0.04 : 0);
    }
    W.kadd(kb2, W.KG.cyl, ownMat(W.Mat({ color: 0x6a3a28 }, W.TINT.warm)), SHELF.x1 - 0.1, SHELF.y + 0.06, 0.1, 0, 0, 0, 0.1, 0.12, 0.1);
    W.kadd(kb2, W.KG.ball, W.PM.leaf, SHELF.x1 - 0.1, SHELF.y + 0.16, 0.1, 0, 0, 0, 0.16, 0.14, 0.14);
    W.kadd(kb2, W.KG.plane, ownMat(W.Mat({ color: 0xffffff, map: delftTex(W) })), SHELF.x0 + 0.3, SHELF.y + 0.085, 0.05, -0.18, 0, 0, 0.15, 0.15, 1);
    W.kbuild(kb2, room);

    // the grammar book: standing on the shelf, leaning back against the wall, cover out, dust along its top
    const book = st.book = new THREE.Group(); book.position.set(BOOK.x, SHELF.y, 0.07); book.rotation.x = -BOOK.lean; room.add(book);
    const kbk = W.kit();
    W.kb(kbk, ownMat(W.Mat({ color: 0x263454 })), 0, BOOK.h / 2, 0, BOOK.w, BOOK.h, BOOK.t);
    W.kb(kbk, ownMat(W.Mat({ color: 0xd8cfb8 }, W.TINT.warm)), BOOK.w / 2 + 0.001, BOOK.h / 2, 0, 0.004, BOOK.h - 0.012, BOOK.t - 0.008);
    W.kb(kbk, ownMat(W.Mat({ color: 0x8e887a })), 0, BOOK.h + 0.002, 0, BOOK.w - 0.004, 0.004, BOOK.t - 0.004);
    st.coverMat = ownMat(new THREE.MeshBasicMaterial({ map: coverTex(W), color: 0x8a8a8a }));
    W.kadd(kbk, W.KG.plane, st.coverMat, 0, BOOK.h / 2, BOOK.t / 2 + 0.001, 0, 0, 0, BOOK.w, BOOK.h, 1);
    W.kbuild(kbk, book);
    // its own faint light: a warm breath round it on the wall, a glint that crosses the plastic now and then, dust in the air
    st.bookHalo = new THREE.Sprite(glow(0xffb35a, 0.3)); st.bookHalo.position.set(BOOK.x, SHELF.y + BOOK.h / 2, 0.02); st.bookHalo.scale.set(0.75, 0.75, 1); room.add(st.bookHalo);
    st.glint = new THREE.Mesh(ownGeo(new THREE.PlaneGeometry(0.03, BOOK.h * 0.9)), flat(0xfff0d0, 0)); st.glint.rotation.z = -0.35; st.glint.position.set(0, BOOK.h / 2, BOOK.t / 2 + 0.004); book.add(st.glint);
    st.motes = [];
    for (let i = 0; i < 14; i++) { const s = new THREE.Sprite(glow(0xffd9a0, 0.5)); s.userData = { a: r() * 6.28, sp: 0.04 + r() * 0.05, x: BOOK.x - 0.45 + r() * 0.9, z: 0.12 + r() * 0.5, y0: SHELF.y - 0.3 + r() * 0.6, ph: r() }; s.scale.set(0.012, 0.012, 1); room.add(s); st.motes.push(s); }

    // the lamp over the table: a cloth drum glowing warm, its bulb under it, its warmth on the ceiling, the table and the rug
    const drum = ownGeo(new THREE.CylinderGeometry(0.2, 0.25, 0.24, 20, 1, true));
    const outside = new THREE.Mesh(drum, ownMat(new THREE.MeshBasicMaterial({ color: 0x8e5426 }))); outside.position.set(0, PEND.y + 0.12, PEND.z); room.add(outside);
    const inside = new THREE.Mesh(drum, ownMat(new THREE.MeshBasicMaterial({ color: 0xffcc84, side: THREE.BackSide }))); inside.position.copy(outside.position); room.add(inside);
    const bulb = new THREE.Mesh(W.KG.ball, ownMat(new THREE.MeshBasicMaterial({ color: 0xfff3d6 }))); bulb.scale.set(0.08, 0.1, 0.08); bulb.position.set(0, PEND.y + 0.07, PEND.z); room.add(bulb);
    st.lampGlow = new THREE.Sprite(glow(0xffb866, 0.5)); st.lampGlow.position.set(0, PEND.y + 0.04, PEND.z); st.lampGlow.scale.set(0.9, 0.9, 1); room.add(st.lampGlow);
    const pool = (w, h, x, y, z, rx, ry, col, op) => { const m = new THREE.Mesh(W.KG.plane, flat(col, op)); m.scale.set(w, h, 1); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); room.add(m); return m; };
    pool(2.2, 2.2, 0, RH - 0.005, PEND.z, Math.PI / 2, 0, 0xff9a48, 0.36);
    pool(1.6, 1.2, TABLE.x, TABLE.h + 0.004, TABLE.z, -Math.PI / 2, 0, 0xffa04a, 0.34);
    pool(3.6, 3.2, 0, 0.02, PEND.z - 0.3, -Math.PI / 2, 0, 0xff9040, 0.22);
    // the standing lamp: a pleated shade lit from inside, kept low, its warmth on the wall behind it and on the floor
    const cone = ownGeo(new THREE.CylinderGeometry(0.14, 0.23, 0.3, 18, 1, true));
    const so = new THREE.Mesh(cone, ownMat(new THREE.MeshBasicMaterial({ color: 0xa8662c }))); so.position.set(STAND.x, STAND.y + 0.15, STAND.z); room.add(so);
    const si = new THREE.Mesh(cone, ownMat(new THREE.MeshBasicMaterial({ color: 0xf2b468, side: THREE.BackSide }))); si.position.copy(so.position); room.add(si);
    st.standGlow = new THREE.Sprite(glow(0xffb060, 0.55)); st.standGlow.position.set(STAND.x, STAND.y + 0.1, STAND.z); st.standGlow.scale.set(1.0, 1.0, 1); room.add(st.standGlow);
    pool(1.9, 2.3, STAND.x, 1.25, 0.013, 0, 0, 0xff9444, 0.42);
    pool(1.6, 1.4, STAND.x, 0.021, STAND.z + 0.35, -Math.PI / 2, 0, 0xff9040, 0.3);
    pool(1.2, 1.0, STAND.x, RH - 0.006, STAND.z + 0.2, Math.PI / 2, 0, 0xff9a48, 0.2);

    // the dogs: the brown one along the sofa beside him, its head at his right knee; the dark one on the rug at his feet
    st.brown = dog(W, { coat: [0x36261c, 0x634633, 0x977257] });
    st.brown.root.position.set(-0.84, SOFA.seat - 0.02, 0.7); st.brown.root.rotation.y = -2.07; room.add(st.brown.root);
    st.dark = dog(W, { sit: true, bib: true, coat: [0x1a1e26, 0x2e3440, 0x4b5360], scale: 1.08 });
    const dp = [0.86, 1.42]; st.dark.root.position.set(dp[0], 0.015, dp[1]); st.dark.root.rotation.y = Math.atan2(dp[0], dp[1] - 0.95); room.add(st.dark.root);
    st.dogs = [st.brown, st.dark];

    st.props.push(W.add(room, 0, FLOOR, ZW, Math.PI)); room.updateMatrixWorld(true);
    seat(W);

    // the key light, as in the painting: the standing lamp beside the sofa. It is his bike lamp's spot, hung in its shade, warm and wide,
    // aimed down across him and the dogs; its place, aim and strength are set every frame after the game's own update
    const L = W.lampLight;
    st.lampWas = { color: L.color.getHex(), angle: L.angle, penumbra: L.penumbra, distance: L.distance, decay: L.decay, y: L.position.y };
    L.color.set(0xffb26a); L.angle = 1.2; L.penumbra = 1; L.distance = 5.5; L.decay = 1;
    st.lampAt = { p: L2W(STAND.x, STAND.y + 0.08, STAND.z), t: L2W(-0.25, 0.6, 1.05) };

    hideOutside(W);
    // outside: a lamp on the far pavement where the window looks, and the mist lying in the street
    st.props.push(W.add(W.lamppost(), 4.75, 0, 15.5, 0), W.add(W.lamppost(), -4.75, 0, 27, Math.PI));
    for (const [x, y, z, s, op] of [[1.4, 1.0, 6.5, 6, 0.14], [-2.2, 1.7, 11, 8, 0.16], [2.6, 2.6, 17, 11, 0.16], [-0.8, 0.9, 23, 12, 0.18], [0.5, 4.2, 30, 16, 0.12]]) {
      const m = W.add(new THREE.Sprite(glow(0x8d9bb0, op)), x, y, z); m.scale.set(s, s * 0.55, 1);
    }
  }

  // the street is kept only where the window looks: from the eye's path, through the opening, out into the haze
  function hideOutside(W) {
    const THREE = W.THREE, box = new THREE.Box3(), size = new THREE.Vector3();
    const cams = [[0.05, 4.25], [0.08, 3.7], [0.9, 2.5], [1.8, 0.95]].map(([x, z]) => L2W(x, 0, z));
    const edges = [L2W(WIN.x0, 0, 0), L2W(WIN.x1, 0, 0)];
    const wedge = cams.map(c => { const a = edges.map(e => Math.atan2(e[2] - c[2], e[0] - c[0])); return [c, Math.min(...a) - 0.12, Math.max(...a) + 0.12]; });
    const [rx0, , rz0] = L2W(RW / 2 + 0.3, 0, -0.3), [rx1, , rz1] = L2W(-RW / 2 - 0.3, 0, RD + 0.3);   // the room's footprint in the street
    const keep = o => {
      if (o.isLight || o === W.bike || o.isCamera) return true;
      if (o.isMesh && o.geometry && o.geometry.type === 'SphereGeometry' && o.geometry.parameters.radius >= 250) return true;   // the sky
      box.setFromObject(o); if (box.isEmpty()) return true;
      box.getSize(size); if (size.x > 60 || size.z > 60) return true;   // the road, the verges, the far rings
      if (box.max.x > Math.min(rx0, rx1) && box.min.x < Math.max(rx0, rx1) && box.max.z > Math.min(rz0, rz1) && box.min.z < Math.max(rz0, rz1)) return false;
      for (const [c, a0, a1] of wedge) {
        const as = [[box.min.x, box.min.z], [box.min.x, box.max.z], [box.max.x, box.min.z], [box.max.x, box.max.z]].map(([x, z]) => Math.atan2(z - c[2], x - c[0]));
        if (box.max.z > c[2] && Math.max(...as) >= a0 && Math.min(...as) <= a1) return true;
      }
      return false;
    };
    W.hide(o => (o.isMesh || o.isGroup || o.isSprite || o.isPoints || o.isLine) && !keep(o));
  }

  function lookAngles(W, d, target) {   // yaw and pitch that turn a dog's head to a point in the room frame
    const p = d.root.worldToLocal(st.room.localToWorld(new W.THREE.Vector3(...target)));
    const dx = p.x - d.head.position.x, dy = p.y - d.head.position.y, dz = p.z - d.head.position.z;
    return [Math.atan2(-dx, -dz), Math.atan2(dy, Math.hypot(dx, dz))];
  }

  C[8] = {
    hold: 9,
    build(W) {
      st = { mats: [], tex: [], geo: [], props: [], bikeHidden: [], limbs: null, coat: null };
      try { build(W); } catch (e) { this.dispose(W); throw e; }
      this.update(W, 0, 0);
    },
    update(W, t, dt) {
      if (!st || !st.room) return;
      // him: deadpan; a look down at the brown dog, then back at us
      const head = W.bike.userData.head, glance = bump(W, t, 1.1, 0.4, 1.0);
      head.rotation.order = 'YXZ';
      head.rotation.y = W.lerp(0, -0.55, glance) + Math.sin(t * 0.6) * 0.03;
      head.rotation.x = W.lerp(0, -0.3, glance);
      // the dogs: at him, a tilt each in turn; then both look up at the book, and tilt their heads at it too
      const face = [0, 1.33, ZW + 0.07], bookAt = [BOOK.x, SHELF.y + BOOK.h / 2, 0.06];
      const up = ease(W, t, BEAT, 0.7);
      const tilts = [[[0.7, 0.48], [2.55, -0.42], [6.4, 0.4]], [[1.55, -0.5], [3.35, 0.46], [7.2, -0.42]]];
      st.dogs.forEach((d, i) => {
        const [y0, p0] = lookAngles(W, d, face), [y1, p1] = lookAngles(W, d, bookAt), k = ease(W, t, BEAT + i * 0.25, 0.7);
        let roll = 0; for (const [t0, a] of tilts[i]) roll += a * bump(W, t, t0, 0.22, 0.5);
        d.head.rotation.set(W.lerp(p0, p1, k) + Math.sin(t * 2.1 + i * 2) * 0.012, W.lerp(y0, y1, k) + Math.sin(t * 0.8 + i) * 0.03, roll);
        const perk = Math.min(1, Math.abs(roll) / 0.35) * 1.0 + 0.35 * k;
        for (const e of d.ears) e.rotation.set(-0.2 * perk, 0, e.userData.s * 0.9 * perk);
        d.tail.rotation.set(0, Math.sin(t * (d.sit ? 4 + 6 * perk : 3 + 8 * perk)) * (0.22 + 0.32 * perk), 0);
      });
      st.eyeGlowMat && 0;
      // the book breathes a little light; a glint crosses its plastic every four seconds; the dust drifts in the warm air
      const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 / 4 - 1.2);
      st.bookHalo.material.opacity = 0.16 + 0.12 * pulse + 0.12 * up;
      const gk = ((t + 1.2) % 4) / 4; st.glint.material.opacity = gk < 0.4 ? Math.sin(Math.PI * gk / 0.4) * 0.5 : 0; st.glint.position.x = W.lerp(-BOOK.w * 0.4, BOOK.w * 0.4, Math.min(1, gk / 0.4));
      for (const s of st.motes) { const u = s.userData, ph = (t * u.sp + u.ph) % 1; s.position.set(u.x + Math.sin(t * 0.5 + u.a) * 0.05, u.y0 + ph * 0.5, u.z + Math.cos(t * 0.4 + u.a) * 0.04); s.material.opacity = 0.5 * Math.sin(Math.PI * ph); }
      // the lamp's light: its place, aim and strength, every frame (the game sets them for the bike)
      const L = W.lampLight; L.position.set(...st.lampAt.p); L.target.position.set(...st.lampAt.t); L.intensity = LAMP;
      // the eye: low and slow in on the three of them; then up with the dogs' look to the shelf, and on in toward the book
      const k1 = ease(W, t, 0, BEAT), k2 = ease(W, t, BEAT - 0.2, 4.6), late = Math.max(0, t - 9.1) * 0.025;
      const A0 = [0.05, 1.02, 4.25], A1 = [0.08, 1.04, 3.7], B = [1.8, 1.8, 0.95];
      const LA = [0.0, 1.05, 0.9], LB = [BOOK.x - 0.04, SHELF.y + 0.1, 0.1];
      // the eye slides right and up first, so he leaves the picture while still small; then it pushes in toward the shelf
      const kx = ease(W, t, BEAT - 0.3, 2.3), ky = ease(W, t, BEAT - 0.3, 2.6), kz = ease(W, t, BEAT + 0.5, 4.2), kk = [kx, ky, kz];
      const cp = [0, 1, 2].map(i => W.lerp(W.lerp(A0[i], A1[i], k1), B[i], kk[i])); cp[2] -= late;
      const lk = [0, 1, 2].map(i => W.lerp(LA[i], LB[i], k2));
      const asp = W.camera.aspect || 1.6, band = W.band(), f = document.getElementById('intro').classList.contains('cine') ? W.clamp(band.height / innerHeight, 0.3, 1) : 0.66;
      const fov = Math.max(W.lerp(42, 30, k2), 2 * Math.atan(Math.tan(MIN_HALF_W * DEG) / asp) / DEG, 2 * Math.atan(Math.tan(MIN_HALF_V * DEG) / f) / DEG);
      W.cam(...L2W(...cp), ...L2W(...lk), Math.min(fov, 72));
      W.drift(t, 0.6);
    },
    dispose(W) {
      if (!st) return;
      if (W && W.bike) {
        for (const ch of st.bikeHidden) ch.visible = true;
        if (st.coat) st.coat.material = W.M.shirt;
        if (st.limbs) { W.bike.remove(st.limbs); st.limbs.traverse(m => { if (m.isMesh && m.geometry) m.geometry.dispose(); }); }
        const h = W.bike.userData.head; h.rotation.set(0, 0, 0); h.rotation.order = 'XYZ';
      }
      if (W && W.lampLight && st.lampWas) { const L = W.lampLight, o = st.lampWas; L.color.setHex(o.color); L.angle = o.angle; L.penumbra = o.penumbra; L.distance = o.distance; L.decay = o.decay; L.position.set(0, o.y, 0.4); L.target.position.set(0, 0.2, -20); }
      for (const p of st.props) p.traverse(m => { if (m.isMesh && m.geometry && m.geometry.userData.kit) m.geometry.dispose(); });
      for (const g of st.geo) g.dispose();
      for (const m of st.mats) m.dispose();
      for (const t of st.tex) t.dispose();
      st = null;
    },
  };
})();
