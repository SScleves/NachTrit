// Intro panel 8 in 3D: "Two years here and he never practised. Everyone spoke English. Everyone was so nice about it."
// A memory from before the mist and the only warm shot of the intro: a café on the canal street of Alblasserdam, a mild wet night.
// 1. 0 to 2.6 s: he has stopped his omafiets by the terrace where his friends sit and tries his Dutch: "Hoi."
// 2. From 2.6 s: a friend answers "Oh, English is fine." Everyone beams and the faces in the café window turn to him; his
//    own face goes flat and he looks at us while the camera pushes in. It ends on a slow drift, so a long hold never freezes.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const BEAT = 2.6, SEED = 808, DEG = Math.PI / 180;
  // the eye as offsets from him: across the road and ahead of him at about 48 degrees, so his face reads, the café stands
  // behind him and the street runs off to the left into the haze
  const CAM1 = [4.45, 1.05, -4.95], LOOK1 = [-0.6, 1.82, 0.65], FOV1 = 42;
  const CAM2 = [3.2, 1.32, -3.5], LOOK2 = [-0.25, 1.9, 0.28], FOV2 = 38;
  // on a wide screen the middle of the picture moves this far left of him (metres at his distance), so the street and its haze
  // get a third of the picture; on an upright phone he stays in the middle
  const SHIFT1 = 1.25, SHIFT2 = 0.45;
  const MIN_HALF_W = 19, MIN_HALF_V = 12.5;   // a narrow or short picture widens the lens until this much shows round the middle
  // the bay window of the café, in the frame of its row of houses (facades at x -2.2, the street toward minus x)
  const FX = -2.2, BX = -2.8, BZ0 = -2.55, BZ1 = 2.8, BZC = (BZ0 + BZ1) / 2, BW = BZ1 - BZ0;
  const SKIN = ['#e6bd98', '#c99572', '#8f5e3e', '#f2d0b2'];
  const FACE = { chat: 0, talk: 1, beam: 2, look: 3 };
  let st = null;

  function rng(a) { return () => { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
  function ownTex(W, c, colour) { const t = new W.THREE.CanvasTexture(c); if (colour) t.colorSpace = W.THREE.SRGBColorSpace; st.tex.push(t); return t; }
  function ownMat(m) { st.mats.push(m); return m; }
  function ownGeo(g) { st.geo.push(g); return g; }
  const ease = (W, t, t0, len) => W.smooth(W.clamp((t - t0) / len, 0, 1));
  const turnTo = (a, b, k) => { let d = b - a; d = Math.atan2(Math.sin(d), Math.cos(d)); return a + d * k; };

  // ---- canvases: faces, the room behind the glass, the light the window throws on the wet stones and its streaks on the road
  // four skin tones in rows, four faces in columns: chatting, talking, beaming, looking up at him
  function faceSheet(W) {
    const [c, g] = canvas(512, 512), ink = '#1c1214';
    const dot = (x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
    const line = (a, b, cx, d) => { g.beginPath(); g.moveTo(a, b); g.lineTo(cx, d); g.stroke(); };
    for (let r = 0; r < 4; r++) for (let e = 0; e < 4; e++) {
      g.save(); g.translate(e * 128 + 64, r * 128 + 64);
      g.fillStyle = '#2b1a14'; dot(0, 0, 61); g.fillStyle = SKIN[r]; dot(0, 0, 57);
      g.strokeStyle = ink; g.fillStyle = ink; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 7;
      if (e === FACE.beam) {   // shut, happy eyes, raised brows, red cheeks and a wide open smile
        for (const s of [-1, 1]) { g.beginPath(); g.arc(s * 21, -1, 11, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
        line(-35, -30, -12, -35); line(12, -35, 35, -30);
        g.fillStyle = 'rgba(222,92,92,0.55)'; dot(-37, 17, 10); dot(37, 17, 10);
        g.fillStyle = '#3c0f12'; g.beginPath(); g.moveTo(-30, 9); g.lineTo(30, 9); g.quadraticCurveTo(28, 48, 0, 48); g.quadraticCurveTo(-28, 48, -30, 9); g.fill();
        g.fillStyle = '#f6f0e4'; g.fillRect(-26, 10, 52, 9);
        g.fillStyle = '#cf4e58'; g.beginPath(); g.ellipse(0, 40, 14, 7, 0, 0, 7); g.fill();
      } else {
        const lift = e === FACE.look ? 7 : 0;
        for (const s of [-1, 1]) { g.fillStyle = ink; dot(s * 21, -5, 8.5); g.fillStyle = '#fff'; dot(s * 21 + 3, -8, 2.8); }
        line(-35, -25 - lift, -12, -29 - lift); line(12, -29 - lift, 35, -25 - lift);
        if (e === FACE.talk) { g.fillStyle = '#3c0f12'; g.beginPath(); g.ellipse(0, 25, 12, 14, 0, 0, 7); g.fill(); g.fillStyle = '#cf4e58'; g.beginPath(); g.ellipse(0, 32, 7, 5, 0, 0, 7); g.fill(); }
        else { g.beginPath(); g.moveTo(-20, 18); g.quadraticCurveTo(0, 36, 20, 18); g.stroke(); }
      }
      g.restore();
    }
    return ownTex(W, c, true);
  }
  // the café behind the glass: a warm wall, the long mirror of the back bar with its bottles, the counter, lamps, people at the bar
  function roomTex(W) {
    const [c, g] = canvas(1024, 512), r = rng(17);
    let gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#ffd89c'); gr.addColorStop(0.5, '#f0a052'); gr.addColorStop(1, '#8e4a20');
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    g.fillStyle = '#4e2610'; g.fillRect(60, 64, 904, 238);
    gr = g.createLinearGradient(0, 76, 0, 290); gr.addColorStop(0, '#ffe8bc'); gr.addColorStop(1, '#df9850');
    g.fillStyle = gr; g.fillRect(72, 76, 880, 214);
    const glass = ['#7a2a1e', '#2f5a3a', '#c8a050', '#6a3a7a', '#e8dcc0', '#3a6a7a', '#b05a2a', '#e0c070'];
    for (const y of [168, 258]) {
      g.fillStyle = '#4a2410'; g.fillRect(72, y, 880, 9);
      for (let x = 84; x < 936; x += 14 + r() * 12) {
        const h = 32 + r() * 28, w = 9 + r() * 6; g.fillStyle = glass[Math.floor(r() * glass.length)];
        g.fillRect(x, y - h, w, h); g.fillRect(x + w * 0.3, y - h - 12, w * 0.4, 12);
        g.fillStyle = 'rgba(255,242,214,0.4)'; g.fillRect(x + 1.5, y - h + 4, 2, h - 8);
      }
    }
    for (const [x, s] of [[190, 1], [292, 0.92], [628, 1.05], [748, 0.96], [880, 0.9]]) {   // regulars at the bar, soft in the light
      g.fillStyle = 'rgba(78,36,16,0.72)'; g.beginPath(); g.ellipse(x, 336, 36 * s, 58 * s, 0, Math.PI, 0); g.fill();
      g.beginPath(); g.arc(x, 336 - 74 * s, 20 * s, 0, 7); g.fill();
    }
    g.fillStyle = '#42200c'; g.fillRect(0, 336, 1024, 176);
    g.fillStyle = '#7a3c18'; g.fillRect(0, 326, 1024, 16); g.fillStyle = 'rgba(255,216,150,0.55)'; g.fillRect(0, 326, 1024, 4);
    for (let x = 24; x < 1024; x += 84) { g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(x, 362, 64, 120); g.fillStyle = 'rgba(255,190,120,0.14)'; g.fillRect(x + 4, 366, 56, 4); }
    for (const x of [150, 512, 874]) {
      const gl = g.createRadialGradient(x, 44, 0, x, 44, 200); gl.addColorStop(0, 'rgba(255,248,226,0.95)'); gl.addColorStop(0.35, 'rgba(255,226,170,0.42)'); gl.addColorStop(1, 'rgba(255,210,140,0)');
      g.fillStyle = gl; g.fillRect(x - 200, 0, 400, 320);
      g.fillStyle = '#3a1a0a'; g.fillRect(x - 1, 0, 3, 24); g.beginPath(); g.moveTo(x - 32, 48); g.lineTo(x + 32, 48); g.lineTo(x + 15, 24); g.lineTo(x - 15, 24); g.fill();
      g.fillStyle = '#fff6e0'; g.fillRect(x - 26, 46, 52, 5);
    }
    return ownTex(W, c, true);
  }
  // the window's light lying on the wet pavement: its panes fan out from the glass (canvas right) toward the road (left)
  function spillTex(W) {
    const [a, ga] = canvas(256, 256), [c, g] = canvas(256, 256), panes = 5;
    ga.fillStyle = '#000'; ga.fillRect(0, 0, 256, 256);
    for (let i = 0; i < panes; i++) for (let x = 0; x < 256; x += 2) {
      const f = x / 255, y0 = 14 + 228 * i / panes + 6, y1 = 14 + 228 * (i + 1) / panes - 6, sp = (1 - f) * 22;
      ga.fillStyle = `rgba(255,255,255,${(Math.pow(f, 1.05) * 0.95).toFixed(3)})`; ga.fillRect(x, y0 - sp, 2, y1 - y0 + sp * 2);
    }
    g.fillStyle = '#000'; g.fillRect(0, 0, 256, 256); g.filter = 'blur(5px)'; g.drawImage(a, 0, 0); g.filter = 'none';
    return ownTex(W, c, false);
  }
  // a light's long reflection on the wet road, from its source (canvas bottom) toward the eye (top): it peaks where the road
  // mirrors the window, about halfway, and uneven ripples break it up
  function streakTex(W) {
    const [c, g] = canvas(64, 256), r = rng(23);
    g.fillStyle = '#000'; g.fillRect(0, 0, 64, 256);
    let n = 0.6, gap = 0;
    for (let y = 254; y >= 0; y -= 2) {
      n = W.clamp(n + (r() - 0.5) * 0.32, 0.15, 1); if (gap > 0) gap--; else if (r() < 0.05) gap = 1 + Math.floor(r() * 3);
      const d = (255 - y) / 255, env = 0.3 * Math.exp(-Math.pow(d / 0.1, 2)) + Math.exp(-Math.pow((d - 0.56) / 0.3, 2)) * W.smooth(W.clamp((1 - d) / 0.12, 0, 1));
      const k = env * n * (gap ? 0.15 : 1), w = 9 + 12 * Math.sin(Math.PI * d) * (0.7 + 0.3 * n), x = 32 + (r() - 0.5) * 3 * d;
      if (k < 0.02) continue;
      const gr = g.createLinearGradient(x - w, 0, x + w, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${Math.min(1, k).toFixed(3)})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(x - w, y, w * 2, 2);
    }
    return ownTex(W, c, false);
  }

  // the awning over the bay: dark red and cream stripes running out from the wall, a scalloped edge
  function awningTex(W) {
    const [c, g] = canvas(128, 512);
    for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#c8b894' : '#7a1e1a'; g.fillRect(0, i * 32, 128, 32); }
    for (let x = 0; x < 128; x += 2) { g.fillStyle = `rgba(0,0,0,${(0.28 * (1 - x / 128)).toFixed(3)})`; g.fillRect(x, 0, 2, 512); }
    return ownTex(W, c, true);
  }
  function valanceTex(W) {
    const [c, g] = canvas(512, 64);
    for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#c8b894' : '#7a1e1a'; g.fillRect(i * 32, 0, 32, 40); g.beginPath(); g.arc(i * 32 + 16, 40, 16, 0, Math.PI); g.fill(); }
    return ownTex(W, c, true);
  }

  // ---- people: the living, from the game's passenger figure. The aura and the glowing eyes go, the skin warms, a face is drawn on
  function person(W, o) {
    const THREE = W.THREE, g = W.ghostFigure(true, 'plain', !!o.seated, o.coat);
    const auras = []; g.traverse(m => { if (m.isSprite) auras.push(m); });
    for (const s of auras) { g.remove(s); s.material.dispose(); }   // a clone; its texture is the shared glow, so only the material goes
    const P = { g, tone: o.tone, expr: -1, arm: null };
    g.traverse(m => {
      if (!m.isMesh) return;
      if (m.geometry === W.PG.pEye) { m.visible = false; return; }   // the shared glowing eyes: the drawn face has its own
      const mt = m.material; if (!st.mats.includes(mt)) st.mats.push(mt);   // ghostFigure(true) cloned these for this figure
      mt.transparent = false; mt.opacity = 1; mt.needsUpdate = true;
      if (m.geometry === W.PG.pHead) { mt.color.set(SKIN[o.tone]); mt.emissive.set(0x6a3416); mt.emissiveIntensity = 0.55; }
      else if (m.geometry === W.PG.pHair) { mt.color.set(o.hair); mt.emissive.set(0x24120a); mt.emissiveIntensity = 1; }
      else if (m.geometry === W.PG.pLimb) { mt.color.set(0x272a31); mt.emissive.set(0x180c06); mt.emissiveIntensity = 1; if (o.inside) m.visible = false; }
      else { mt.emissive.set(o.warm || 0x5a2a0e); mt.emissiveIntensity = 1; if (m.geometry === W.PG.pArm && m.position.x > 0) P.armMesh = m; }
    });
    // the right arm hangs from a shoulder pivot, so it can hold a glass, raise it or wave
    if (P.armMesh) {
      const pv = new THREE.Group(); pv.position.set(0.27, 1.76, 0.03); g.remove(P.armMesh); pv.add(P.armMesh);
      P.armMesh.position.set(0, -0.36, 0); P.armMesh.rotation.set(0, 0, 0); g.add(pv); P.arm = pv;
      if (o.glass) { const gl = beer(W); gl.position.set(0, -0.74, 0.06); pv.add(gl); }
    }
    const face = new THREE.Mesh(st.faceGeo[o.tone][FACE.chat], st.faceMat);
    face.position.set(0, 2.03, 0.19); face.scale.setScalar(0.27); g.add(face); P.face = face;
    g.scale.setScalar(o.scale || 0.92);
    return P;
  }
  function setFace(P, e) { if (P.expr !== e) { P.expr = e; P.face.geometry = st.faceGeo[P.tone][e]; } }
  function beer(W) {   // a glass of beer with its head of foam
    const k = W.kit(); W.kadd(k, W.KG.cyl, st.beerMat, 0, 0.07, 0, 0, 0, 0, 0.085, 0.15, 0.085); W.kadd(k, W.KG.cyl, st.foamMat, 0, 0.16, 0, 0, 0, 0, 0.088, 0.035, 0.088);
    return W.kbuild(k);
  }

  // ---- the set
  function build(W) {
    const THREE = W.THREE;
    W.stage({ town: 'alblasserdam', theme: 'street', fog: 0.85 });   // a canal town: the street runs along the water, as in concept D
    W.speed(0);
    W.face('smug');
    W.beam.visible = false;   // he has stopped: his lamp still burns, but its cone in the haze would cut across the café
    // the café takes over the row of houses nearest the middle: same place, same line, so the street runs on unbroken
    let row0 = null;
    for (const o of W.scene.children) {
      if (!o.isGroup || !o.visible || !o.userData.faceRoad || o.position.x > -7.3 || o.position.x < -9.3) continue;
      if (!row0 || Math.abs(o.position.z + 6) < Math.abs(row0.position.z + 6)) row0 = o;
    }
    const RX = row0 ? row0.position.x : -8.05, RZ = row0 ? row0.position.z : -6;
    // he stops where the eye's line through him runs on to the middle of the bay window
    const dl = Math.hypot(CAM1[0], CAM1[2]), dx = -CAM1[0] / dl, dz = -CAM1[2] / dl;
    const zh = RZ - BZC - (RX - BX) / dx * dz;
    W.ride(zh);
    st.zh = zh; st.RX = RX; st.RZ = RZ;
    // clear the stage: the dead (this is before the mist), whatever stands on the café's pavement, and what stands round the eye
    const camZ = zh + CAM1[2];
    for (const o of W.scene.children) {
      if (!o.isGroup || o === W.bike || !o.visible) continue;
      const x = o.position.x, z = o.position.z, u = o.userData;
      const dead = u.shuffle !== undefined || (u.variant !== undefined && u.lean !== undefined);
      const pave = x < -3.9 && x > -7.3 && Math.abs(z - RZ) < 9.5;
      const eye = x > 2.5 && x < 13 && z > camZ - 9 && z < camZ + 7;
      if (o === row0 || dead || pave || eye) { o.visible = false; st.hidden.push(o); continue; }
      // the garden walls that close the alleys carry big sprayed words: they would pull the eye off the café
      if (u.faceRoad && Math.abs(x) > 7.3 && Math.abs(x) < 9.3) for (const ch of o.children) if (ch.isGroup && ch.userData.faceRoad && ch.visible) { ch.visible = false; st.hidden.push(ch); }
    }

    // shared bits of my own
    st.faceMat = ownMat(new THREE.MeshBasicMaterial({ map: faceSheet(W), alphaTest: 0.5, color: 0xf2e6d8 }));
    st.faceGeo = [];
    for (let r = 0; r < 4; r++) { st.faceGeo.push([]); for (let e = 0; e < 4; e++) { const p = ownGeo(new THREE.PlaneGeometry(1, 1)), uv = p.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, (e + uv.getX(j)) / 4, 1 - (r + 1 - uv.getY(j)) / 4); st.faceGeo[r].push(p); } }
    st.beerMat = ownMat(W.Mat({ color: 0xd9962c, emissive: 0x9a5a12, emissiveIntensity: 0.9 }));
    st.foamMat = ownMat(W.Mat({ color: 0xf2ead8, emissive: 0x6a5a44, emissiveIntensity: 0.8 }));
    const glow = (col, op) => ownMat(W.GlowMat(W.glowTex, col, op, true));

    // the row: a narrow neighbour, the café, a tall neighbour; one kit, so the whole row is one mesh per material
    const row = new THREE.Group(), k = W.kit(); row.name = 'shot8-cafe';
    for (const hs of [
      { w: 4.4, h: 6.6, brick: 0x4a3630, gable: 'roof', lit: 0.12, oz: -6.05 },
      { w: 4.8, h: 7.0, brick: 0x5a4038, gable: 'step', lit: 0.2, oz: 0, sign: 'CAFÉ' },
      { w: 4.2, h: 7.8, brick: 0x3e3a44, gable: 'roof', lit: 0, oz: 6.05 },
    ]) W.house(Object.assign({ k, g: row, ox: hs.w / 2 - 2.2, peer: false }, hs));
    W.kbuild(k, row);
    row.traverse(m => { if (m.isMesh && m.userData.ownTex && m.material.emissive) { m.material.emissive.set(0xffc27a); m.material.emissiveIntensity = 0.85; } });   // the board over the door burns warm

    // the bay window: a panelled base, a sill, slim mullions, a fascia and a lead roof; the lit room behind the glass
    const kb = W.kit(), frame = ownMat(W.Mat({ color: 0x1d2924 })), sill = ownMat(W.Mat({ color: 0x8a8272 })), shade = ownMat(W.Mat({ color: 0x2a1c12 }));
    W.kb(kb, W.M.wood, (BX + FX) / 2, 0.39, BZC, FX - BX, 0.78, BW);
    for (let i = 0; i < 5; i++) W.kb(kb, frame, BX - 0.02, 0.4, BZ0 + BW * (i + 0.5) / 5, 0.03, 0.48, BW / 5 - 0.2);
    W.kb(kb, sill, (BX + FX) / 2 - 0.04, 0.81, BZC, FX - BX + 0.12, 0.06, BW + 0.14);
    for (let i = 0; i <= 5; i++) W.kb(kb, frame, BX, 1.72, BZ0 + BW * i / 5, 0.08, 1.84, 0.08);
    W.kb(kb, frame, BX, 2.2, BZC, 0.06, 0.06, BW);
    for (const z of [BZ0, BZ1]) { W.kb(kb, frame, (BX + FX) / 2, 2.2, z, FX - BX, 0.06, 0.06); W.kb(kb, frame, (BX + FX) / 2, 1.72, z, 0.06, 1.84, 0.06); }
    W.kb(kb, frame, (BX + FX) / 2 - 0.05, 2.82, BZC, FX - BX + 0.14, 0.4, BW + 0.18);
    W.kb(kb, W.PM.roof, (BX + FX) / 2 - 0.06, 3.05, BZC, FX - BX + 0.24, 0.07, BW + 0.28);
    W.kadd(kb, W.KG.plane, ownMat(new THREE.MeshBasicMaterial({ map: roomTex(W) })), FX - 0.03, 1.72, BZC, 0, -Math.PI / 2, 0, BW - 0.04, 1.84, 1);
    const wall = ownMat(new THREE.MeshBasicMaterial({ color: 0xb8692c }));
    W.kadd(kb, W.KG.plane, wall, (BX + FX) / 2, 1.72, BZ0 + 0.04, 0, 0, 0, FX - BX, 1.84, 1);
    W.kadd(kb, W.KG.plane, wall, (BX + FX) / 2, 2.62, BZC, Math.PI / 2, 0, 0, FX - BX, BW, 1);
    for (const z of [BZ0 + 1.2, BZC + 0.2, BZ1 - 1.1]) { W.kadd(kb, W.KG.dome, shade, -2.55, 2.42, z, 0, 0, 0, 0.36, 0.2, 0.36); W.kadd(kb, W.KG.ball, W.PM.lampHead, -2.55, 2.38, z, 0, 0, 0, 0.12, 0.08, 0.12); }
    W.kbuild(kb, row);
    for (const z of [BZ0 + 1.2, BZC + 0.2, BZ1 - 1.1]) { const s = new THREE.Sprite(glow(0xffc77e, 0.75)); s.position.set(-2.6, 2.32, z); s.scale.set(1.1, 1.1, 1); row.add(s); }
    const halo = new THREE.Sprite(glow(0xffa04a, 0.38)); halo.position.set(BX - 0.7, 1.75, BZC); halo.scale.set(BW * 1.55, 4.2, 1); row.add(halo);
    // a string of bulbs in two swags along the front of the bay
    const kl = W.kit(), bulbs = 13, pt = u => { const s = (u * 2) % 1; return [BX - 0.12, 2.74 - 0.88 * s * (1 - s), W.lerp(BZ0 - 0.05, BZ1 + 0.05, u)]; };
    for (let i = 0; i < 40; i++) { const a = pt(i / 40), b = pt((i + 1) / 40); W.ktube(kl, W.PM.pole, a[0], a[1], a[2], b[0], b[1], b[2], 0.007); }
    for (let i = 0; i < bulbs; i++) { const p = pt(i / (bulbs - 1)); W.kadd(kl, W.KG.ball, W.PM.lampHead, p[0], p[1] - 0.05, p[2], 0, 0, 0, 0.07, 0.09, 0.07); const s = new THREE.Sprite(glow(0xffc070, 0.6)); s.position.set(p[0] - 0.02, p[1] - 0.05, p[2]); s.scale.set(0.42, 0.42, 1); row.add(s); }
    W.kbuild(kl, row);
    // the awning: out from above the bay and down, its underside warm from the window under it
    const at = awningTex(W), vt = valanceTex(W), AW = BW + 0.06, AL = 1.05, tilt = 0.32;
    const aw = new THREE.Mesh(ownGeo(new THREE.PlaneGeometry(AL, AW).rotateX(-Math.PI / 2)), ownMat(W.Mat({ map: at, emissive: 0xffffff, emissiveMap: at, emissiveIntensity: 0.32, side: THREE.DoubleSide })));
    aw.position.set(BX + 0.1 - AL / 2 * Math.cos(tilt), 3.2 - AL / 2 * Math.sin(tilt), BZC); aw.rotation.z = tilt; row.add(aw);
    const va = new THREE.Mesh(ownGeo(new THREE.PlaneGeometry(AW, 0.24)), ownMat(W.Mat({ map: vt, emissive: 0xffffff, emissiveMap: vt, emissiveIntensity: 0.32, alphaTest: 0.5, side: THREE.DoubleSide })));
    va.position.set(BX + 0.1 - AL * Math.cos(tilt) - 0.005, 3.2 - AL * Math.sin(tilt) - 0.12, BZC); va.rotation.y = -Math.PI / 2; row.add(va);
    const sheen = new THREE.Mesh(ownGeo(new THREE.PlaneGeometry(1, 1)), ownMat(W.GlowMat(W.glowTex, 0xffb46a, 0.22)));
    sheen.position.set(BX - 0.02, 1.7, BZC); sheen.rotation.y = -Math.PI / 2; sheen.scale.set(BW * 1.1, 2.4, 1); row.add(sheen);
    // its light on the pavement, fanned out by the mullions, and on into the road
    const spill = new THREE.Mesh(ownGeo(new THREE.PlaneGeometry(4.4, BW + 0.8).rotateX(-Math.PI / 2)), ownMat(W.GlowMat(spillTex(W), 0xffa452, 0.95)));
    spill.position.set(BX - 2.2, 0.1, BZC); spill.renderOrder = 2; row.add(spill);

    // the terrace and the people on it, placed by where they fall in the picture: degrees right of him, seen from the first eye
    const camL = { x: RX - CAM1[0], z: RZ - (zh + CAM1[2]) }, dL = { x: -dx, z: -dz }, rL = { x: dz, z: -dx };
    const zAt = (deg, X) => { const a = deg * DEG, ux = dL.x * Math.cos(a) + rL.x * Math.sin(a), uz = dL.z * Math.cos(a) + rL.z * Math.sin(a); return camL.z + (X - camL.x) / ux * uz; };
    const him = { x: RX, z: RZ - zh };   // where he is in the row's frame
    const yawTo = (p, q) => Math.atan2(q.x - p.x, q.z - p.z);
    const kt = W.kit();
    const table = (x, z) => {
      W.kadd(kt, W.KG.cyl, W.M.wood, x, 0.74, z, 0, 0, 0, 0.66, 0.04, 0.66); W.kadd(kt, W.KG.cyl, W.PM.pole, x, 0.37, z, 0, 0, 0, 0.05, 0.72, 0.05); W.kadd(kt, W.KG.cyl, W.PM.pole, x, 0.02, z, 0, 0, 0, 0.42, 0.03, 0.42);
      W.kadd(kt, W.KG.cyl, st.candleMat, x + 0.06, 0.81, z - 0.05, 0, 0, 0, 0.07, 0.1, 0.07);
      const s = new THREE.Sprite(glow(0xffa848, 0.9)); s.position.set(x + 0.06, 0.86, z - 0.05); s.scale.set(0.6, 0.6, 1); row.add(s); st.candles.push(s);
    };
    const chair = (x, z, yaw) => {
      const c = Math.cos(yaw), s = Math.sin(yaw), at = (ox, oz) => [x + ox * c + oz * s, z - ox * s + oz * c];
      let p = at(0, 0); W.kadd(kt, W.KG.cyl, W.M.wood, p[0], 0.46, p[1], 0, 0, 0, 0.4, 0.04, 0.4);
      for (const [ox, oz] of [[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]]) { p = at(ox, oz); W.ktube(kt, W.PM.pole, p[0], 0, p[1], p[0], 0.45, p[1], 0.015); }
      p = at(0, -0.19); W.kb(kt, W.M.wood, p[0], 0.76, p[1], 0.38, 0.22, 0.03, -0.12, yaw, 0);
      for (const ox of [-0.16, 0.16]) { const q = at(ox, -0.18); W.ktube(kt, W.PM.pole, q[0], 0.46, q[1], q[0], 0.86, q[1], 0.012); }
    };
    st.candleMat = ownMat(new THREE.MeshBasicMaterial({ color: 0xffb860 }));
    // his friends: two at the near table, one has stood up from the far table to greet him and holds her beer
    const A = { x: -3.4, z: zAt(-13.5, -3.4) }, B = { x: -3.45, z: zAt(-9.6, -3.45) }, T1 = { x: -4.0, z: zAt(-11.4, -4.0) };
    const Cs = { x: -4.3, z: zAt(11.4, -4.3) }, T2 = { x: -3.75, z: zAt(15.2, -3.75) };
    table(T1.x, T1.z); table(T2.x, T2.z);
    chair(A.x + 0.05, A.z, yawTo(A, B)); chair(B.x, B.z, yawTo(B, A)); chair(T2.x - 0.05, T2.z + 0.55, Math.PI); chair(T2.x + 0.5, T2.z - 0.1, -Math.PI / 2);
    for (const [x, z] of [[T1.x - 0.12, T1.z + 0.14], [T1.x + 0.1, T1.z - 0.16], [T2.x - 0.1, T2.z + 0.12]]) {
      W.kadd(kt, W.KG.cyl, st.beerMat, x, 0.84, z, 0, 0, 0, 0.085, 0.15, 0.085); W.kadd(kt, W.KG.cyl, st.foamMat, x, 0.93, z, 0, 0, 0, 0.088, 0.035, 0.088);
    }
    W.kbuild(kt, row);
    const seatY = s => 0.52 - 0.92 * s;
    const mk = (o, p, yaw) => { const P = person(W, o); P.g.position.set(p.x, o.seated ? seatY(o.scale || 0.92) : 0, p.z); P.g.rotation.y = yaw; row.add(P.g); P.home = yaw; P.toHim = yawTo(p, him); return P; };
    st.A = mk({ seated: true, coat: 1, tone: 3, hair: 0x6a4a2a, scale: 0.9, glass: true }, A, yawTo(A, B));
    st.B = mk({ seated: true, coat: 5, tone: 1, hair: 0x1a1412, scale: 0.9 }, B, yawTo(B, A));
    st.C = mk({ coat: 2, tone: 0, hair: 0x8a5a2a, scale: 0.9, glass: true, warm: 0x6a3410 }, Cs, yawTo(Cs, him));
    st.friends = [st.A, st.B, st.C];
    // the regulars in the window: one with her back to the street, a pair deep in talk and one listening; they turn to him in turn
    const IX = -2.5, inZ = deg => W.clamp(zAt(deg, IX), BZ0 + 0.4, BZ1 - 0.4);
    const pin = [[-3.9, 4, 2, 0x3a2a1c], [3.2, 0, 1, 0x141010], [5.3, 3, 0, 0x5a3a20], [7.5, 4, 3, 0x2a2018]].map(([deg, coat, tone, hair]) => ({ x: IX, z: inZ(deg), coat, tone, hair }));
    const faces = [{ x: 0, z: pin[0].z }, pin[2], pin[1], pin[2]];
    st.inside = pin.map((p, i) => { const P = mk({ seated: true, inside: true, coat: p.coat, tone: p.tone, hair: p.hair, scale: 0.86, glass: i === 1 || i === 2, warm: 0x7a3c12 }, p, yawTo(p, faces[i])); P.g.position.y = 0.66 - 0.92 * 0.86; return P; });
    st.props.push(W.add(row, RX, 0, RZ, Math.PI));
    st.row = row;

    // reflections of the window and the door on the wet road, laid toward the eye each frame: three panes and a soft wash under them
    const stx = streakTex(W), sg = ownGeo(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2).translate(0, 0, -0.5)), sm = ownMat(W.GlowMat(stx, 0xffb458, 0.6));
    const wash = ownMat(W.GlowMat(stx, 0xff9a40, 0.22));
    for (const [lz, w, m0] of [[BZC, 4.2, wash], [BZ0 + 1.1, 0.75, sm], [BZC + 0.35, 0.85, sm], [BZ1 - 0.75, 0.7, sm], [BZ1 + 0.15, 0.35, sm]]) {
      const m = new THREE.Mesh(sg, m0); m.scale.set(w, 1, 10); m.renderOrder = 3;
      W.add(m, RX - BX + 0.15, 0.11, RZ - lz); st.streaks.push(m);
    }
    // a warm rim round him from the window behind, and a street lamp down the street
    st.rim = W.add(new THREE.Sprite(glow(0xffa04a, 0.3)), -1.2, 1.45, zh + 0.65); st.rim.scale.set(2.4, 3.2, 1);
    st.props.push(W.add(W.lamppost(), -4.75, 0, RZ + 7.2, Math.PI));

    W.say('Hoi.', W.bike, { from: 0.3, to: 2.5, dy: 2.45 });
    W.say('Oh, English is fine.', st.C.g, { from: 2.65, to: 7.0, dy: 2.32 });
  }

  C[7] = {
    hold: 9,
    build(W) {
      st = { mats: [], tex: [], geo: [], hidden: [], candles: [], streaks: [], props: [] };
      const rand0 = Math.random; Math.random = rng(SEED);   // the same square, café and faces every time the shot is built
      try { build(W); } finally { Math.random = rand0; }
      this.update(W, 0, 0);
    },
    update(W, t, dt) {
      if (!st || !st.row) return;
      const zh = st.zh;
      for (const o of st.hidden) if (o.visible) o.visible = false;   // a shuffling zombie sent round by the street comes back visible
      // him: hopeful while he tries, then flat, and he turns from them to us
      if (t >= 3.0 && t - dt < 3.0) W.face('deadpan');
      const look = ease(W, t, 3.05, 0.55);
      W.bike.userData.head.rotation.y = W.lerp(-0.42, -0.98, look) + Math.sin(t * 1.4) * 0.04 * (1 - look);
      // his friends: two in talk who look up at his "Hoi.", one already on her feet; then the answer and the beaming
      const { A, B, C: Cf } = st;
      const notice = ease(W, t, 0.95, 0.5);
      A.g.rotation.y = turnTo(A.home, A.toHim, notice) + Math.sin(t * 1.1) * 0.05;
      B.g.rotation.y = turnTo(B.home, B.toHim, ease(W, t, 1.15, 0.5)) + Math.sin(t * 0.9 + 1) * 0.05;
      Cf.g.rotation.y = Cf.home + Math.sin(t * 0.8 + 2) * 0.04;
      setFace(A, t < 0.95 ? (Math.floor(t * 7) % 2 ? FACE.talk : FACE.chat) : t < 2.85 ? FACE.look : FACE.beam);
      setFace(B, t < 1.15 ? FACE.chat : t < 2.95 ? FACE.look : FACE.beam);
      setFace(Cf, t < 2.65 ? FACE.look : t < 3.55 ? (Math.floor(t * 8) % 2 ? FACE.talk : FACE.chat) : FACE.beam);
      // her arm: the beer held low, an easy open gesture with the answer, then the glass goes up
      const ges = ease(W, t, 2.65, 0.35) * (1 - ease(W, t, 4.0, 0.5)), toast = ease(W, t, 4.2, 0.6);
      if (Cf.arm) Cf.arm.rotation.set(W.lerp(W.lerp(-0.35, -1.15, ges), -2.25, toast), 0, W.lerp(W.lerp(0.1, 0.45, ges), 0.2, toast));
      if (A.arm) { const up = ease(W, t, 3.3, 0.6); A.arm.rotation.set(W.lerp(-0.5, -2.2, up), 0, W.lerp(0.1, 0.25, up)); }
      // the window: the faces turn to him one after the other, beaming; one raises a glass, one waves
      st.inside.forEach((P, i) => {
        const t0 = 2.8 + [0.15, 0.0, 0.3, 0.45][i], k = ease(W, t, t0, 0.45);
        P.g.rotation.y = turnTo(P.home, P.toHim, k) + Math.sin(t * (0.9 + i * 0.2) + i) * 0.06 * (1 - k);
        setFace(P, k > 0.5 ? FACE.beam : (i % 2 === 0 && Math.floor(t * 6 + i) % 2) ? FACE.talk : FACE.chat);
        if (P.arm && (i === 1 || i === 2)) { const up = ease(W, t, t0 + 0.5, 0.5); P.arm.rotation.set(W.lerp(-0.45, -2.1, up), 0, W.lerp(0.1, 0.2, up)); }
        else if (P.arm && i === 0) P.arm.rotation.set(-0.4, 0, 0.1);
      });
      const wv = st.inside[3]; if (wv && wv.arm) { const up = ease(W, t, 3.6, 0.4); wv.arm.rotation.set(-0.3 * up, 0, W.lerp(0.1, 2.5, up) + Math.sin(t * 9) * 0.25 * up); }
      // candles
      st.candles.forEach((s, i) => { const f = 0.6 * (1 + 0.1 * Math.sin(t * 17 + i * 3) + 0.06 * Math.sin(t * 29 + i)); s.scale.set(f, f, 1); });
      // the eye: a slow creep while he tries, then a push in on him; afterwards it keeps drifting
      const k1 = W.clamp(t / BEAT, 0, 1), k2 = ease(W, t, BEAT + 0.15, 6.4), late = Math.min(Math.max(0, t - 9), 6);
      const c = i => W.lerp(CAM1[i] + [-0.12, 0, 0.1][i] * k1, CAM2[i], k2), l = i => W.lerp(LOOK1[i], LOOK2[i], k2);
      const asp = W.camera.aspect || 1.6, v = W.camera.view, band = v && v.enabled ? W.clamp((0.82 * innerHeight - 2 * v.offsetY) / innerHeight, 0.2, 1) : 0.7;
      const cx = c(0) - 0.05 * late, cz = c(2) + 0.04 * late, lx = l(0), lz = l(2);
      // the middle of the picture slides left of him on a wide screen: sideways to the line of sight, at his distance
      const sx = lz - cz, sz = -(lx - cx), sn = Math.hypot(sx, sz) || 1, sh = W.lerp(SHIFT1, SHIFT2, k2) * W.clamp((asp - 0.8) / 0.8, 0, 1);
      const fov = Math.max(W.lerp(FOV1, FOV2, k2), 2 * Math.atan(Math.tan(MIN_HALF_W * DEG) / asp) / DEG, 2 * Math.atan(Math.tan(MIN_HALF_V * DEG) / band) / DEG);
      W.cam(cx, c(1) + 0.012 * late, zh + cz, lx + sx / sn * sh, l(1), zh + lz + sz / sn * sh, fov);
      W.drift(t, 0.7);
      // the road holds the window's light in long streaks that run from the café to the eye
      const cp = W.camera.position;
      for (const m of st.streaks) { const ex = cp.x - m.position.x, ez = cp.z - m.position.z; m.rotation.y = Math.atan2(-ex, -ez); m.scale.z = Math.hypot(ex, ez) * 0.82; }
    },
    dispose(W) {
      if (W && W.beam) W.beam.visible = true;
      if (!st) return;
      for (const o of st.hidden) o.visible = true;
      // the kits built fresh geometry for this shot (the house sign's board too); the game's shared parts are left alone
      for (const p of st.props) p.traverse(m => { if (m.isMesh && m.geometry && (m.geometry.userData.kit || m.userData.ownTex)) m.geometry.dispose(); });
      for (const g of st.geo) g.dispose();
      for (const m of st.mats) m.dispose();
      for (const t of st.tex) t.dispose();
      st = null;
    },
  };
})();
