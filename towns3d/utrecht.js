// Utrecht, tier 5. One tall tower over a canal on two levels. The upper quay of the Oudegracht with iron railings over the drop,
// the wharves two metres below with their arched cellar doors glowing at the waterline, terrace candles and festoons on the
// wharf, brick bridges at street level (Gaardbrug, Bakkerbrug), bikes on every railing. The Dom tower (112 m, two square
// stages and an open octagon lit from inside) stands over every level, near enough to read: a tower in the sky that keeps its
// place over the roofs as you ride, as the real one does. The square levels are the Domplein: the plan of the lost nave in
// the paving before what is left of the Domkerk. Cool white light on the street, warm gold down on the water. The dead are students.
// Research: Opus 5.5 DT/research/towns-utrecht-nijmegen-maastricht-amsterdam.md, section 1. API: towns3d/README.md.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
  const rng = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const UW = -2.35, WT = -2.0, UG = -2.6;   // the water, the top of the wharves, the ground under it all: the street stays at 0
  let R = null;

  // ---------- painted once ----------
  function glowAtlas() {   // three cells: a small flame in its halo, a soft round glow, a reflection streak on the water
    const [c, g] = cv(192, 64);
    let gr = g.createRadialGradient(32, 30, 0, 32, 30, 31); gr.addColorStop(0, 'rgba(255,214,150,0.8)'); gr.addColorStop(0.25, 'rgba(255,170,90,0.34)'); gr.addColorStop(1, 'rgba(255,150,70,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    gr = g.createRadialGradient(32, 29, 0, 32, 29, 9); gr.addColorStop(0, 'rgba(255,255,240,1)'); gr.addColorStop(0.5, 'rgba(255,224,150,0.95)'); gr.addColorStop(1, 'rgba(255,160,60,0)'); g.fillStyle = gr;
    g.beginPath(); g.ellipse(32, 29, 3.8, 8.5, 0, 0, 7); g.fill();
    gr = g.createRadialGradient(96, 32, 0, 96, 32, 32); gr.addColorStop(0, 'rgba(255,214,150,1)'); gr.addColorStop(0.35, 'rgba(255,190,120,0.45)'); gr.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = gr; g.fillRect(64, 0, 64, 64);
    for (let y = 0; y < 64; y += 2) { const t = y / 63, k = Math.max(0, Math.pow(Math.sin(t * Math.PI), 1.5) * (0.55 + 0.45 * Math.sin(y * 0.9))), w = 5 + 3 * Math.sin(y * 0.4); gr = g.createLinearGradient(160 - w, 0, 160 + w, 0); gr.addColorStop(0, 'rgba(255,190,110,0)'); gr.addColorStop(0.5, `rgba(255,190,110,${k * 0.9})`); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(140, y, 40, 2); }
    return c;
  }
  function cellarDoors() {   // two cells: a wharf cellar under the street, its round brick arch, a glazed door lit from inside; and one shut and dark
    const [c, g] = cv(256, 128), r = rng(3);
    for (const cell of [0, 1]) {
      const x0 = cell * 128; g.save(); g.translate(x0, 0);
      g.fillStyle = '#3b2622'; g.fillRect(0, 0, 128, 128);
      for (let y = 0; y < 128; y += 8) for (let x = (y / 8) % 2 ? -8 : 0; x < 128; x += 16) { const v = 52 + r() * 22; g.fillStyle = `rgb(${v + 14 | 0},${v * 0.62 | 0},${v * 0.52 | 0})`; g.fillRect(x + 1, y + 1, 14, 6); }
      g.fillStyle = '#5a4a40'; g.beginPath(); g.moveTo(22, 128); g.lineTo(22, 58); g.arc(64, 58, 42, Math.PI, 0); g.lineTo(106, 128); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(30, 128); g.lineTo(30, 60); g.arc(64, 60, 34, Math.PI, 0); g.lineTo(98, 128); g.closePath();
      if (cell === 0) {
        const gl = g.createLinearGradient(0, 26, 0, 128); gl.addColorStop(0, '#ffe2a8'); gl.addColorStop(0.6, '#f0a85a'); gl.addColorStop(1, '#a8602c'); g.fillStyle = gl; g.fill();
        g.fillStyle = 'rgba(70,34,14,0.8)'; for (const x of [46, 64, 82]) g.fillRect(x - 2, 30, 4, 98); g.fillRect(30, 76, 68, 4); g.fillRect(30, 102, 68, 3);
        g.fillStyle = 'rgba(90,44,20,0.55)'; g.fillRect(36, 108, 18, 20); g.fillRect(74, 110, 18, 18);   // chairs inside
      } else { g.fillStyle = '#1c1512'; g.fill(); g.fillStyle = 'rgba(70,50,36,0.6)'; for (let x = 34; x < 96; x += 9) g.fillRect(x, 40, 3, 88); }
      g.restore();
    }
    return c;
  }
  function domGrad() {   // the Dom's stone, lit from below: bright at the foot of every face, fading up into the dark
    const [c, g] = cv(16, 256), gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, '#8d8a84'); gr.addColorStop(0.55, '#c9c2b4'); gr.addColorStop(1, '#f2e6cc'); g.fillStyle = gr; g.fillRect(0, 0, 16, 256);
    for (let y = 4; y < 256; y += 9) { g.fillStyle = 'rgba(0,0,0,0.08)'; g.fillRect(0, y, 16, 1); }
    return c;
  }
  function navePlan() {   // the Domplein: dark paving, and in pale stone the outline of the nave that fell in 1674, its pillars marked
    const [c, g] = cv(512, 256), r = rng(19);
    g.fillStyle = '#26282c'; g.fillRect(0, 0, 512, 256);
    for (let y = 0; y < 256; y += 16) for (let x = (y / 16) % 2 ? -12 : 0; x < 512; x += 24) { const v = 36 + r() * 14; g.fillStyle = `rgb(${v | 0},${v + 1 | 0},${v + 4 | 0})`; g.fillRect(x + 1, y + 1, 22, 14); }
    g.fillStyle = '#cdc6b6';
    for (const y of [20, 228]) g.fillRect(8, y, 496, 8);
    for (let x = 30; x < 500; x += 58) for (const y of [84, 164]) g.fillRect(x, y, 16, 16);
    g.fillRect(8, 20, 8, 216);
    return c;
  }
  function stoneTex() {   // pale grey-yellow sandstone in courses (Bentheim), for the Domkerk
    const N = 256, [c, g] = cv(N, N), r = rng(41);
    g.fillStyle = 'rgb(120,118,110)'; g.fillRect(0, 0, N, N);
    for (let row = 0; row < N / 32; row++) { let x = -r() * 50; while (x < N) { const bw = 40 + r() * 60, v = 196 + (r() - 0.5) * 30; for (const ox of [0, -N, N]) { const xx = x + ox; if (xx + bw < 0 || xx > N) continue; g.fillStyle = `rgb(${v | 0},${v - 6 | 0},${v - 22 | 0})`; g.fillRect(xx + 1.5, row * 32 + 1.5, bw - 3, 29); } x += bw; } }
    for (let i = 0; i < 4000; i++) { g.fillStyle = r() < 0.5 ? `rgba(0,0,0,${0.04 + r() * 0.08})` : `rgba(255,255,255,${0.03 + r() * 0.04})`; g.fillRect(r() * N, r() * N, 1, 1); }
    return c;
  }
  function churchGlass() {   // a tall Gothic window of the Domkerk, lit warm from inside, with its tracery
    const W = 128, H = 256, [c, g] = cv(W, H);
    g.beginPath(); g.moveTo(6, H - 2); g.lineTo(6, 64); g.quadraticCurveTo(6, 16, W / 2, 2); g.quadraticCurveTo(W - 6, 16, W - 6, 64); g.lineTo(W - 6, H - 2); g.closePath();
    const gl = g.createLinearGradient(0, 0, 0, H); gl.addColorStop(0, '#f6d9a0'); gl.addColorStop(1, '#c47e3c'); g.fillStyle = gl; g.fill();
    g.fillStyle = 'rgba(60,40,26,0.85)'; for (const x of [34, 64, 94]) g.fillRect(x - 3, 40, 6, H - 40); for (let y = 70; y < H; y += 46) g.fillRect(6, y, W - 12, 4);
    g.strokeStyle = 'rgba(60,40,26,0.85)'; g.lineWidth = 5; g.beginPath(); g.arc(W / 2, 46, 18, 0, 7); g.stroke();
    return c;
  }
  function fsSignTex() {   // the cycle street sign: red, a white bicycle, fietsstraat, auto te gast
    const [c, g] = cv(128, 176);
    g.fillStyle = '#f2efe6'; g.fillRect(0, 0, 128, 176); g.fillStyle = '#b3262a'; g.fillRect(6, 6, 116, 164);
    g.strokeStyle = '#f2efe6'; g.lineWidth = 5; g.lineCap = g.lineJoin = 'round';
    for (const x of [38, 90]) { g.beginPath(); g.arc(x, 70, 17, 0, 7); g.stroke(); }
    g.beginPath(); g.moveTo(38, 70); g.lineTo(56, 46); g.lineTo(82, 46); g.lineTo(90, 70); g.moveTo(56, 46); g.lineTo(64, 70); g.lineTo(38, 70); g.moveTo(82, 46); g.lineTo(78, 36); g.lineTo(88, 36); g.stroke();
    g.fillStyle = '#f2efe6'; g.textAlign = 'center'; g.font = 'bold 22px "Segoe UI", sans-serif'; g.fillText('fietsstraat', 64, 120); g.font = '17px "Segoe UI", sans-serif'; g.fillText('auto te gast', 64, 150);
    return c;
  }
  function res(K) {
    if (R) return R;
    const THREE = K.THREE, keep = m => { m.userData.shared = true; return m; };
    const tex = (c, srgb, wrap) => { const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; if (wrap) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; } return t; };
    const quad = (u0, v0, u1, v1) => { const p = new THREE.PlaneGeometry(1, 1), uv = p.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, u0 + uv.getX(j) * (u1 - u0), v0 + uv.getY(j) * (v1 - v0)); return p; };
    const ga = tex(glowAtlas()), half = new THREE.Shape(); half.moveTo(-1, 0); half.absarc(0, 0, 1, Math.PI, 0, true); half.lineTo(-1, 0);
    const stone = keep(K.Mat({ color: 0xcfc6b0, map: tex(stoneTex(), true, true) })); stone.userData.wuv = 2.6;
    const tri = new THREE.Shape(); tri.moveTo(-0.5, 0); tri.lineTo(0.5, 0); tri.lineTo(0, 1); tri.closePath();
    R = {
      stone,
      glow: keep(K.GlowMat(ga, 0xffffff, 1, false)),
      door: keep(new THREE.MeshBasicMaterial({ map: tex(cellarDoors(), true) })),
      glass: keep(new THREE.MeshBasicMaterial({ map: tex(churchGlass(), true), alphaTest: 0.5, color: 0xc8c0b0 })),
      plan: keep(new THREE.MeshBasicMaterial({ map: tex(navePlan(), true), color: 0x9a9a9a })),
      fsSign: (() => { const t = tex(fsSignTex(), true); return keep(K.Mat({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.3 })); })(),
      // the Dom keeps its own haze: it stands far beyond the fog, so it takes no fog and is coloured from the haze every frame
      domStone: keep(new THREE.MeshBasicMaterial({ map: tex(domGrad(), true), fog: false })),
      domDark: keep(new THREE.MeshBasicMaterial({ color: 0x15171c, fog: false })),
      domGlow: keep(new THREE.MeshBasicMaterial({ map: K.glowTex, color: 0xffd08c, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })),
      domHalo: keep(new THREE.SpriteMaterial({ map: K.glowTex, color: 0xffc47c, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })),
      jacket: keep(K.Mat({ color: 0x2c3a4c })), hoodie: keep(K.Mat({ color: 0x5a4a52 })), crate: keep(K.Mat({ color: 0x2f6a3a })), bottle: keep(K.Mat({ color: 0x4a3a20 })),
      pack: keep(K.Mat({ color: 0x8a3a2a })), phones: keep(K.Mat({ color: 0xd8d8d0 })), frame: keep(K.Mat({ color: 0x14161a })),
      flameQ: quad(0, 0, 1 / 3, 1), poolQ: quad(1 / 3, 0, 2 / 3, 1), streakQ: quad(2 / 3, 0, 1, 1), doorLitQ: quad(0, 0, 0.5, 1), doorDarkQ: quad(0.5, 0, 1, 1),
      cone8: new THREE.ConeGeometry(0.5, 1, 8), oct: new THREE.CylinderGeometry(0.5, 0.5, 1, 8), arch: new THREE.ShapeGeometry(half, 12), tri: new THREE.ShapeGeometry(tri),
    };
    return R;
  }
  // a long strip keeps to the bend of the road: the game moves its middle, this shears the rest along the curve as the road does
  function bendFollow(g) {
    g.traverse(o => { if (!o.isMesh) return; o.frustumCulled = false; o.onBeforeRender = () => { const S = window.NR, p = g.position; if (!S || !S.curv || !(p.z < 0)) return; o.matrixWorld.set(1, 0, 2 * S.curv * p.z, p.x, 0, 1, 0, p.y, 0, 0, 1, p.z, 0, 0, 0, 1); }; });
    return g;
  }
  // ---------- the Dom ----------
  // the tower at its true 112 m: a square stage of 38.6 m with blind arcades and the passage at its foot, a lighter square stage
  // of 29.5 m with tall paired openings, the open octagon of 26 m lit from inside, the crown and its cross. It is drawn as part
  // of the sky: o.d metres away at o.az degrees (positive left), turned with the far town when the road bends, so it keeps its
  // place over the roofs in every frame and stays whole and readable; the painted rooftops of the far town stand before its foot.
  // It takes no fog: its stone is coloured from the haze every frame, so it dims with the night while its lantern keeps burning
  function dom(K, o) {
    const R = res(K), THREE = K.THREE, g = new THREE.Group(), k = K.kit(), S = R.domStone, D = R.domDark, G = R.domGlow;
    const face = (w, fn) => { for (let f = 0; f < 4; f++) { const a = f * Math.PI / 2; fn(a, Math.sin(a), Math.cos(a), Math.cos(a), -Math.sin(a), w / 2 + 0.06); } };
    K.kb(k, S, 0, 19.3, 0, 16, 38.6, 16);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { K.kb(k, S, sx * 7.7, 19, sz * 7.7, 1.9, 38, 1.9); K.kadd(k, R.cone8, S, sx * 7.4, 42, sz * 7.4, 0, 0, 0, 1.5, 6.5, 1.5); }
    K.kb(k, S, 0, 38.8, 0, 16.9, 0.9, 16.9);
    face(16, (a, nx, nz, tx, tz, r) => {
      K.kadd(k, K.KG.plane, D, nx * r, 4.6, nz * r, 0, a, 0, 4.6, 9.2);
      for (const t of [-4.2, 0, 4.2]) K.kadd(k, K.KG.plane, D, nx * r + tx * t, 25, nz * r + tz * t, 0, a, 0, 1.5, 15);
    });
    K.kb(k, S, 0, 53.35, 0, 13.4, 29.5, 13.4);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.kadd(k, R.cone8, S, sx * 6.3, 71.2, sz * 6.3, 0, 0, 0, 1.3, 6.5, 1.3);
    K.kb(k, S, 0, 68.3, 0, 14.2, 0.9, 14.2);
    face(13.4, (a, nx, nz, tx, tz, r) => { for (const t of [-4.3, -2.5, 2.5, 4.3]) K.kadd(k, K.KG.plane, D, nx * r + tx * t, 53, nz * r + tz * t, 0, a, 0, 1.25, 17); });
    K.kadd(k, R.oct, S, 0, 81.1, 0, 0, 0, 0, 11.2, 25.4, 11.2);
    for (let i = 0; i < 8; i++) {
      const th = Math.PI / 8 + i * Math.PI / 4, c = Math.cos(Math.PI / 4 * i), s = Math.sin(Math.PI / 4 * i);
      K.kadd(k, K.KG.plane, G, Math.sin(th) * 5.24, 80.5, Math.cos(th) * 5.24, 0, th, 0, 3.4, 21);
      K.kadd(k, R.cone8, S, s * 6.1, 72, c * 6.1, 0, 0, 0, 0.9, 7, 0.9);
      K.kadd(k, K.KG.plane, G, Math.sin(th) * 3.12, 97.2, Math.cos(th) * 3.12, 0, th, 0, 1.8, 5.2);
    }
    K.kadd(k, R.oct, S, 0, 94, 0, 0, 0, 0, 12.4, 0.9, 12.4);
    K.kadd(k, R.oct, S, 0, 97.3, 0, 0, 0, 0, 6.6, 6.6, 6.6);
    K.kadd(k, R.cone8, S, 0, 104.9, 0, 0, 0, 0, 7.4, 8.6, 7.4);
    K.kb(k, D, 0, 110.4, 0, 0.35, 3.4, 0.35); K.kb(k, D, 0, 110.9, 0, 1.8, 0.3, 0.3);
    K.kbuild(k, g);
    const halo = new THREE.Sprite(R.domHalo); halo.scale.set(80, 80, 1); halo.position.set(0, 84, 0); g.add(halo);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), up = new THREE.Vector3(0, 1, 0), fc = new THREE.Color();
    const place = (obj, cam) => {
      const N = window.NR, yaw = N && N.curv ? -Math.atan(N.curv * 120) * 0.7 : 0, a = o.az * Math.PI / 180 + yaw;
      p.set(cam.position.x - Math.sin(a) * o.d, -4, cam.position.z - Math.cos(a) * o.d); q.setFromAxisAngle(up, a + (o.turn == null ? 0.55 : o.turn));
      m4.compose(p, q, one); obj.matrixWorld.multiplyMatrices(m4, obj.matrix);
      fc.copy(K.scene.fog.color); S.color.setRGB(fc.r * 2.9, fc.g * 2.55, fc.b * 2.1); D.color.copy(fc).multiplyScalar(0.45);
    };
    g.traverse(m => { if (m.isMesh || m.isSprite) { m.frustumCulled = false; m.onBeforeRender = (r, s, cam) => place(m, cam); } });
    return g;
  }
  // ---------- the Oudegracht on two levels ----------
  // thirty metres of it in one kit, standing at the middle of the road. Our street stays at 0: the land under the houses on the
  // left (the ground lies low so the water can), the iron railing over the drop on the right, the wharf two metres down; across
  // the water the far wharf with its terraces, the quay wall with the arched cellar doors glowing at the waterline, a festoon of
  // bulbs along it, the railing and the street above, and the tall houses of the far side
  function werf(K) {
    const R = res(K), g = new K.THREE.Group(), k = K.kit(), st = K.style, pal = [K.pick(st.brick), K.pick(st.brick)], L = 30.1, bw = K.brickMat(pal[0]), P = K.PM.pole;
    K.kb(k, P, -24, -1.3, 0, 33, 2.56, L);
    K.kb(k, K.PM.stone, 7.85, 0.0, 0, 0.36, 0.2, L); K.kb(k, bw, 8.15, -1.1, 0, 0.5, 2.2, L); K.kb(k, K.PM.stone, 9.4, -2.3, 0, 2.5, 0.6, L);
    for (let z = -14; z < 15.5; z += 2) K.kb(k, P, 7.62, 0.55, z, 0.05, 1.1, 0.05);
    for (const y of [1.05, 0.55]) K.kb(k, P, 7.62, y, 0, 0.05, 0.05, L);
    K.kb(k, K.PM.stone, 22.9, -2.3, 0, 5.0, 0.6, L); K.kb(k, bw, 20.45, -2.45, 0, 0.12, 0.3, L);
    K.kb(k, bw, 25.7, -1.0, 0, 0.6, 2.06, L); K.kb(k, K.PM.stone, 25.6, 0.03, 0, 0.62, 0.16, L);
    for (let z = -14; z < 15.5; z += 2) K.kb(k, P, 25.5, 0.6, z, 0.05, 1.1, 0.05);
    for (const y of [1.1, 0.6]) K.kb(k, P, 25.5, y, 0, 0.05, 0.05, L);
    K.kb(k, K.PM.stone, 30.2, -1.3, 0, 9, 2.56, L);
    for (let z = -12.6; z < 14; z += 4.2) {
      const lit = Math.random() < 0.75;
      K.kadd(k, lit ? R.doorLitQ : R.doorDarkQ, R.door, 25.38, -1.0, z, 0, -Math.PI / 2, 0, 2.2, 2.0);
      if (lit) { K.kadd(k, R.poolQ, R.glow, 24.3, WT + 0.02, z, -Math.PI / 2, 0, 0, 3.4, 3.4, 1); K.kadd(k, R.streakQ, R.glow, K.rnd(17.5, 19.8), UW + 0.03, z, -Math.PI / 2, 0, 0, 1.6, K.rnd(6, 10), 1); }
    }
    for (let i = 0; i < 4; i++) {
      const z = -12 + i * 7.5 + K.rnd(-1, 1), x = K.rnd(21.8, 23.4);
      K.kadd(k, K.KG.cyl, K.M.wood, x, WT + 0.75, z, 0, 0, 0, 0.9, 0.05, 0.9); K.kb(k, P, x, WT + 0.37, z, 0.06, 0.74, 0.06);
      for (const s of [-1, 1]) { K.kb(k, K.M.wood, x, WT + 0.45, z + s * 0.7, 0.45, 0.05, 0.45); K.kb(k, K.M.wood, x, WT + 0.7, z + s * 0.92, 0.45, 0.5, 0.05); }
      K.kadd(k, R.flameQ, R.glow, x - 0.1, WT + 0.95, z, 0, -Math.PI / 2, 0, 0.7, 0.7, 1);
      if (Math.random() < 0.5) { K.kb(k, P, x + 0.1, WT + 1.3, z + 0.1, 0.05, 2.6, 0.05); K.kadd(k, R.cone8, K.PK.linen, x + 0.1, WT + 2.1, z + 0.1, 0, 0, 0, 0.3, 1.6, 0.3); }
    }
    for (let z = -14.6; z < 15; z += 0.9) { const t = ((z + 15) % 3.6) / 3.6; K.kadd(k, R.poolQ, R.glow, 25.3, -0.42 - 0.34 * Math.sin(t * Math.PI), z, 0, -Math.PI / 2, 0, 0.42, 0.42, 1); }
    for (let i = 0; i < 5; i++) {
      const w = K.rnd(st.width[0], st.width[1]) * 1.2, h = K.rnd(st.height[0], st.height[1]) * K.rnd(0.95, 1.12);
      K.house({ k, g, w, h, brick: pal[i % 2], ox: 34.7 + w / 2, oz: -12 + i * 6, plain: true, lit: 0.35, peer: false });
    }
    k.base.identity(); K.kbuild(k, g); return bendFollow(g);
  }
  // a brick bridge at street level over the sunken canal (Gaardbrug, Bakkerbrug): a broad deck, iron railings, a wide arch over
  // the water and a low one over each wharf, a lamp at each end. It stands centred over the trench (x 16.6)
  function utBrug(K) {
    const R = res(K), k = K.kit(), b = K.brickMat(0x5e3a32), x0 = -8.9, x1 = 9.3, W = 7, P = K.PM.pole;
    K.kb(k, K.PM.stone, 0.2, -0.25, 0, x1 - x0, 0.5, W); K.kb(k, b, 0.2, -1.6, 0, x1 - x0, 2.3, W - 0.2);
    for (const e of [-1, 1]) {
      const z = e * (W / 2 - 0.08), ry = e > 0 ? 0 : Math.PI;
      K.kadd(k, R.arch, K.PM.windowOff, -1.1, UW, z, 0, ry, 0, 4.9, 1.85, 1);
      for (const ax of [-7.2, 6.3]) K.kadd(k, R.arch, K.PM.windowOff, ax, WT, z, 0, ry, 0, 1.2, 1.5, 1);
      for (let x = x0 + 0.3; x < x1; x += 1.2) K.kb(k, P, x, 0.5, e * 3.4, 0.05, 1.0, 0.05);
      for (const y of [1.0, 0.12]) K.kb(k, P, 0.2, y, e * 3.4, x1 - x0, 0.05, 0.05);
    }
    for (const x of [x0 + 0.6, x1 - 0.6]) {
      K.kadd(k, K.KG.cyl, P, x, 1.9, 3.4, 0, 0, 0, 0.12, 3.8, 0.12); K.kadd(k, K.KG.cyl, K.PM.lampHead, x, 4.0, 3.4, 0, 0, 0, 0.34, 0.6, 0.34);
      K.kadd(k, R.cone8, P, x, 4.45, 3.4, 0, 0, 0, 0.5, 0.3, 0.5); K.kadd(k, R.poolQ, R.glow, x, 4.0, 3.62, 0, 0, 0, 2.4, 2.4, 1);
      K.kadd(k, R.streakQ, R.glow, x < 0 ? 4.2 : -0.6, UW + 0.03, 6.5, -Math.PI / 2, 0, 0, 1.4, 7, 1);
    }
    return K.kbuild(k);
  }
  // the street lamp: a black mast with a short arm and a drum of white light under a little cap
  function utLamp(K) {
    const R = res(K), k = K.kit(), g = new K.THREE.Group(), hx = -0.55, P = K.PM.pole;
    K.kadd(k, K.KG.cyl, P, 0, 0.3, 0, 0, 0, 0, 0.3, 0.6, 0.3); K.kadd(k, K.KG.cyl, P, 0, 2.4, 0, 0, 0, 0, 0.13, 4.6, 0.13);
    K.ktube(k, P, 0, 4.4, 0, hx, 4.95, 0, 0.04);
    K.kadd(k, K.KG.cyl, P, hx, 5.0, 0, 0, 0, 0, 0.5, 0.08, 0.5); K.kadd(k, R.cone8, P, hx, 5.18, 0, 0, 0, 0, 0.5, 0.3, 0.5);
    K.kadd(k, K.KG.cyl, K.PM.lampHead, hx, 4.65, 0, 0, 0, 0, 0.36, 0.62, 0.36); K.kadd(k, K.KG.cyl, P, hx, 4.3, 0, 0, 0, 0, 0.42, 0.08, 0.42);
    K.kbuild(k, g); K.lampLights(g, hx, 4.6, 1, 1.0); g.userData.faceRoad = true; return g;
  }
  // ---------- the Domplein ----------
  // the plan of the nave that fell in 1674 in the paving, pale stones for its walls and pillars, and at its far end what stands of
  // the Domkerk: the transept and the wall that closed it, the great window lit warm, turrets and buttresses, the choir behind
  function domplein(K) {
    const R = res(K), k = K.kit(), st = R.stone, roof = K.PM.roof, yaw = -Math.PI / 2, cx = 44;
    K.kadd(k, K.KG.plane, R.plan, 17.5, 0.03, 0, -Math.PI / 2, 0, 0, 39, 18, 1);
    K.kb(k, st, cx, 13, 0, 16, 26, 46);
    for (const s of [-1, 1]) K.kb(k, roof, cx + s * 4, 31, 0, Math.hypot(8, 10) + 0.4, 0.4, 46.6, 0, 0, -s * Math.atan2(10, 8));
    K.kb(k, st, cx - 2, 15, 0, 13, 30, 19);
    K.kadd(k, R.tri, st, cx - 8.52, 30, 0, 0, yaw, 0, 19, 11, 1);
    K.kadd(k, K.KG.plane, R.glass, cx - 8.56, 15.5, 0, 0, yaw, 0, 7, 18);
    for (const s of [-1, 1]) {
      K.kadd(k, K.KG.plane, R.glass, cx - 8.05, 12, s * 15.5, 0, yaw, 0, 5, 13);
      K.kadd(k, R.oct, st, cx - 8.5, 17, s * 9.8, 0, 0, 0, 2.4, 34, 2.4); K.kadd(k, R.cone8, roof, cx - 8.5, 37, s * 9.8, 0, 0, 0, 2.8, 6, 2.8);
      for (const z of [12, 19.5]) { K.kb(k, st, cx - 8.9, 11, s * z, 1.8, 22, 1.4); K.kadd(k, R.cone8, st, cx - 8.9, 24, s * z, 0, 0, 0, 1.2, 4.4, 1.2); }
    }
    K.kb(k, st, cx + 23, 12, 0, 30, 24, 18);
    for (const s of [-1, 1]) K.kb(k, roof, cx + 23, 28, s * 4.5, 30.4, 0.4, Math.hypot(9, 8) + 0.4, s * Math.atan2(8, 9), 0, 0);
    return K.kbuild(k);
  }
  // ---------- small things of Utrecht ----------
  function kratten(K) {   // crates of beer stacked by a door: the beer comes by boat, the empties go back on it
    const R = res(K), k = K.kit(), n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) { const y = 0.15 + i * 0.31, ry = K.rnd(-0.15, 0.15); K.kb(k, R.crate, 0, y, 0, 0.42, 0.3, 0.32, 0, ry, 0); }
    for (let b = 0; b < 6; b++) K.kadd(k, K.KG.cyl, R.bottle, -0.12 + (b % 3) * 0.12, 0.15 + (n - 1) * 0.31 + 0.17, -0.06 + Math.floor(b / 3) * 0.12, 0, 0, 0, 0.06, 0.08, 0.06);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function bierboot(K) {   // the beer boat on its rounds of the wharf cellars: a low electric barge stacked with crates
    const R = res(K), k = K.kit();
    K.kb(k, K.PM.boat, 0, -0.2, 0, 2.2, 0.55, 8); K.kb(k, K.PM.boat, 0, -0.2, -4.4, 1.56, 0.55, 1.56, 0, Math.PI / 4, 0);
    K.kb(k, K.M.wood, 0, 0.1, 0, 2.3, 0.06, 8.1);
    for (let i = 0; i < 12; i++) K.kb(k, R.crate, -0.5 + (i % 3) * 0.5, 0.3 + Math.floor(i / 6) * 0.31, -2.6 + Math.floor(i / 3) % 2 * 0.36 + (i % 6 < 3 ? 0 : 0.72) + Math.floor(i / 6) * 1.6, 0.44, 0.3, 0.34);
    K.kb(k, K.PM.pole, 0, 0.7, 2.8, 0.8, 1.0, 0.9); K.kadd(k, R.flameQ, R.glow, 0, 1.0, 3.3, 0, 0, 0, 0.8, 0.8, 1);
    return K.kbuild(k);
  }
  function fietsstraat(K) {   // the sign of a cycle street: bikes first, cars are guests
    const R = res(K), k = K.kit(); K.kb(k, K.PM.pole, 0, 1.2, 0, 0.07, 2.4, 0.07);
    for (const s of [1, -1]) K.kadd(k, K.KG.plane, R.fsSign, 0, 2.15, s * 0.045, 0, s > 0 ? 0 : Math.PI, 0, 0.62, 0.86);
    return K.kbuild(k);
  }
  // ---------- the dead of Utrecht: students ----------
  // the shared body: hip [0, 1.0, 0.04], shoulders [0, 1.62, -0.36], head [0, 1.68, -0.64], hands hanging at about (+-0.26, 0.7, -0.6)
  const sleeves = (K, k, m) => { for (const sx of [-1, 1]) K.ktube(k, m, sx * 0.25, 1.62, -0.36, sx * 0.28, 1.16, -0.48, 0.072); };
  const DRESS = {
    utregfietser(k, b, K) {   // a student walking his old steel bike: a jacket, a backpack, the bike at his right hand
      const R = res(K), F = R.frame, { hip, sh } = b, x = 0.62;
      K.ktube(k, R.jacket, ...hip, ...sh, 0.19); sleeves(K, k, R.jacket); K.kb(k, R.pack, 0, 1.42, 0.08, 0.36, 0.44, 0.2, 0.5, 0, 0);
      for (const z of [0.25, -0.85]) K.kadd(k, K.KG.wheel, F, x, 0.33, z);
      const bb = [x, 0.3, -0.25];
      K.ktube(k, F, x, 0.33, 0.25, ...bb, 0.018); K.ktube(k, F, ...bb, x, 0.86, 0.05, 0.02); K.ktube(k, F, ...bb, x, 0.56, -0.7, 0.022);
      K.ktube(k, F, x, 0.56, -0.7, x, 0.98, -0.74, 0.022); K.ktube(k, F, x, 0.56, -0.7, x, 0.33, -0.85, 0.018); K.ktube(k, F, x, 0.33, 0.25, x, 0.86, 0.05, 0.016);
      K.kb(k, F, x, 0.9, 0.06, 0.12, 0.05, 0.24); K.kb(k, F, x, 1.0, -0.7, 0.56, 0.03, 0.03); K.kb(k, F, x, 0.72, 0.32, 0.22, 0.03, 0.42);
    },
    utregkrat(k, b, K) {   // a student with a crate of beer on his shoulder and the scarf of his club
      const R = res(K), { hip, sh, hd } = b;
      K.ktube(k, R.hoodie, ...hip, ...sh, 0.2); sleeves(K, k, R.hoodie);
      K.kb(k, R.crate, 0.2, 1.9, -0.34, 0.44, 0.32, 0.34, 0, 0, -0.3);
      for (let i = 0; i < 6; i++) K.kadd(k, K.KG.cyl, R.bottle, 0.08 + (i % 3) * 0.12 + 0.06 * (1 - i % 3) * 0, 2.08 - (i % 3) * 0.035, -0.4 + Math.floor(i / 3) * 0.12, 0, 0, -0.3, 0.06, 0.1, 0.06);
      K.kb(k, R.pack, 0, sh[1] + 0.02, sh[2] - 0.12, 0.36, 0.1, 0.16); K.kb(k, R.pack, -0.12, 1.3, -0.5, 0.1, 0.5, 0.05, 0.2, 0, 0);
      K.kadd(k, K.KG.ball, R.hoodie, hd[0], hd[1] + 0.07, hd[2] + 0.05, 0, 0, 0, 0.26, 0.2, 0.28);
    },
    utregkoptelefoon(k, b, K) {   // a student with the hood up, big headphones over it and a tote bag of books
      const R = res(K), { hip, sh, hd } = b;
      K.ktube(k, R.hoodie, ...hip, ...sh, 0.21); sleeves(K, k, R.hoodie);
      K.kadd(k, K.KG.dome, R.hoodie, hd[0], hd[1] - 0.06, hd[2] + 0.05, 0.45, 0, 0, 0.36, 0.38, 0.4); K.ktube(k, R.hoodie, 0, sh[1] + 0.02, sh[2] + 0.02, 0, hd[1] - 0.02, hd[2] + 0.14, 0.13);
      for (const sx of [-1, 1]) K.kadd(k, K.KG.cyl, R.phones, sx * 0.19, hd[1], hd[2], 0, 0, Math.PI / 2, 0.16, 0.06, 0.16);
      K.ktube(k, R.phones, -0.19, hd[1] + 0.05, hd[2], 0, hd[1] + 0.25, hd[2] + 0.02, 0.018); K.ktube(k, R.phones, 0, hd[1] + 0.25, hd[2] + 0.02, 0.19, hd[1] + 0.05, hd[2], 0.018);
      K.kb(k, K.PK.linen, -0.34, 0.86, -0.18, 0.06, 0.38, 0.32); K.ktube(k, K.PK.linen, -0.3, 1.06, -0.2, -0.22, 1.62, -0.36, 0.015);
    },
  };
  const fingerpost = K => K.fingerpost(T.utrecht.signs.slice().sort(() => Math.random() - 0.5).slice(0, 3));
  const domAt = o => K => dom(K, o);   // the Dom as a spawn: one per level, its place in the sky set per kind of street

  T.utrecht = {
    style: { brick: [0x5e3a32, 0x6e4438, 0x4a3430, 0x7a5040, 0x3e2e2c], gables: 0.65, height: [9, 12.5], width: [3.4, 4.4], lamp: 'classic' },
    sky: { stars: 25, clouds: 1, glows: [{ az: 30, el: 1, w: 80, h: 10, color: 0xffa060, a: 0.2 }, { az: 115, el: 1, w: 80, h: 9, color: 0xff9a50, a: 0.16 }, { az: -55, el: 1, w: 90, h: 9, color: 0xffb070, a: 0.14 }] },
    light: { lamp: 0xe6ecff, windows: 0xffb060 },   // cool white on the street; the warm light is down on the water
    road: { kind: 'klinkers', tone: '#55372f' },
    lamp: utLamp,
    landmark: domAt({ d: 262, az: -14 }),
    extra: [],
    shops: ['FIETSENMAKER', 'FIETSENSTALLING', 'CAFÉ HET TERRAS', 'BOEKHANDEL', 'KOFFIEBAR', 'TWEEDEHANDS FIETSEN', 'BAKKER', 'DE WERFKELDER'],
    signs: ['Domtoren', 'Oudegracht', 'Neude', 'Domplein', 'Janskerkhof', 'Centraal', 'Ganzenmarkt', 'Vismarkt'],
    dead: { pool: ['utregfietser', 'utregfietser', 'utregkrat', 'utregkoptelefoon', 'phone', 'plain'], dress: DRESS },
    themes: {
      // the upper quay of the Oudegracht: houses on the left, on the right the railing over the drop, the canal two metres down,
      // the far wharf with its glowing cellars and terraces, a brick bridge now and then, the beer boat, the Dom over it all
      gracht: (base, K) => Object.assign({}, base, {
        fog: 0x47505b, fogD: 0.015, night: 0.17, ground: 0x111418, groundY: UG, water: 0x10151c, waterY: UW, waterK: 0.2, canal: 1, curv: 0.0012, landmark: false,
        spawn: [
          { make: domAt({ d: 250, az: -13 }), n: 1, gap: 1000, side: 'right', xr: [0, 0], r: 0.5 },
          { make: werf, n: 8, gap: 30, side: 'right', reg: true, xr: [0, 0], r: 0.5 },
          { make: utBrug, n: 1, gap: 170, side: 'right', xr: [16.6, 16.6], r: 3 },
          { make: () => K.terrace(3, { tall: 1.05 }), n: 6, gap: 24, side: 'left', reg: true, xr: [7.9, 8.2], r: 9 },
          { make: K.backRow, n: 4, gap: 36, side: 'left', reg: true, xr: [19, 20.5], r: 14 },
          { make: utLamp, n: 8, gap: 18, side: 'left', reg: true, xr: [4.7, 4.7] },
          { make: utLamp, n: 5, gap: 30, side: 'right', reg: true, xr: [4.7, 4.7] },
          { make: () => K.treeCard([1, 0, 1]), n: 7, gap: 28, side: 'right', xr: [21.5, 23.5], y: WT, r: 0.9 },
          { make: () => K.treeCard([0, 1]), n: 3, gap: 48, side: 'left', xr: [5.5, 5.8], r: 0.9 },
          { make: K.bikeRow, n: 8, gap: 18, side: 'right', xr: [6.9, 7.0], r: 0.6 },
          { make: K.bikeRow, n: 3, gap: 48, side: 'left', xr: [4.9, 5.0], r: 0.6 },
          { make: bierboot, n: 1, gap: 150, side: 'right', xr: [13.4, 14], y: UW + 0.3, r: 3 },
          { make: K.boat, n: 2, gap: 70, side: 'right', xr: [12.6, 13.4], y: UW + 0.6, r: 2.5 },
          { make: kratten, n: 2, gap: 70, side: 'left', xr: [5.0, 5.1], r: 0.5 },
          { make: fingerpost, n: 1, gap: 150, side: 'left', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 7, gap: 20, side: 'both', xr: [4.8, 5.6], r: 0.6 },
        ] }),
      // a street of shops toward the Dom (Zadelstraat, Steenweg): a red cycle street, bikes against every wall, the Dom at its end
      shops: (base, K) => Object.assign({}, base, {
        fog: 0x4a525d, fogD: 0.016, night: 0.18, curv: 0.002, landmark: false,
        road: { kind: 'asphalt', tone: '#5a2f2b' },
        spawn: [
          { make: domAt({ d: 250, az: 3, turn: 0.4 }), n: 1, gap: 1000, side: 'right', xr: [0, 0], r: 0.5 },
          { make: () => K.terrace(3, { shops: 0.75, tag: 0.35, tall: 1.05 }), n: 12, gap: 12, side: 'alt', reg: true, xr: [7.6, 7.9], r: 9 },
          { make: K.backRow, n: 8, gap: 18, side: 'alt', reg: true, xr: [18.5, 20.5], r: 14 },
          { make: utLamp, n: 12, gap: 12, side: 'alt', reg: true, xr: [4.7, 4.7] },
          { make: K.bikeRow, n: 9, gap: 16, side: 'both', xr: [4.9, 5.0], r: 0.6 },
          { make: kratten, n: 3, gap: 50, side: 'both', xr: [5.0, 5.1], r: 0.5 },
          { make: K.bakfiets, n: 2, gap: 80, side: 'both', xr: [5.0, 5.1], r: 0.7 },
          { make: K.bins, n: 2, gap: 70, side: 'both', xr: [5.0, 5.1], r: 0.5 },
          { make: fietsstraat, n: 2, gap: 90, side: 'both', xr: [4.6, 4.6], r: 0.3 },
          { make: fingerpost, n: 1, gap: 140, side: 'both', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 8, gap: 18, side: 'both', xr: [4.8, 5.4], r: 0.6 },
        ] }),
      // the Domplein and round it: the plan of the lost nave in the paving, the Domkerk at its end, the Dom close over the square
      square: (base, K) => Object.assign({}, base, {
        fog: 0x48515c, fogD: 0.0155, night: 0.17, curv: 0.0015, landmark: false,
        road: { kind: 'slabs', tone: '#3c3f45' },
        spawn: [
          { make: domAt({ d: 222, az: -21, turn: 0.7 }), n: 1, gap: 1000, side: 'right', xr: [0, 0], r: 0.5 },
          { make: domplein, n: 1, gap: 200, side: 'right', xr: [10, 10], r: 14 },
          { make: () => K.terrace(3, { tall: 1.12, tag: 0.2 }), n: 6, gap: 24, side: 'left', reg: true, xr: [9.6, 10], r: 9 },
          { make: K.backRow, n: 4, gap: 36, side: 'left', reg: true, xr: [21, 22.5], r: 14 },
          { make: () => K.treeCard([1, 1, 2]), n: 5, gap: 34, side: 'right', xr: [11, 17], r: 0.9 },
          { make: K.bikeRow, n: 5, gap: 30, side: 'right', xr: [8.5, 12], r: 0.6 },
          { make: utLamp, n: 9, gap: 16, side: 'alt', reg: true, xr: [4.7, 4.7] },
          { make: () => K.treeCard([1, 1, 0]), n: 6, gap: 26, side: 'left', xr: [5.6, 7], r: 0.9 },
          { make: K.bikeRow, n: 6, gap: 24, side: 'both', xr: [4.9, 5.0], r: 0.6 },
          { make: K.bench, n: 2, gap: 70, side: 'left', xr: [5.0, 5.1], r: 0.9 },
          { make: fingerpost, n: 1, gap: 150, side: 'right', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 6, gap: 26, side: 'both', xr: [5.0, 6.0], r: 0.6 },
        ] }),
    },
    // the painted far town: tall gables near, church towers lower than the Dom in the middle (the Buurkerk, the Jacobikerk, the two
    // towers of the Nicolaikerk, the Janskerk, the bank tower by the station), low roofs far off. The Dom itself is not painted
    skyline: {
      near(P) { P.roofs(0, 0.4, 11, 18, 0.12, ['bell', 'step', 'roof', 'bell']); P.roofs(0.6, 1, 11, 18, 0.12, ['step', 'bell', 'roof']); P.trees(0, 0.4, 9, 16, 9); P.trees(0.6, 1, 9, 16, 9); P.trees(0.42, 0.58, 4, 7, 12); },
      mid(P) {
        P.trees(0, 1, 7, 13, 13); P.roofs(0, 0.46, 9, 15, 0.12, ['bell', 'step', 'roof']); P.roofs(0.54, 1, 9, 15, 0.12, ['bell', 'step', 'roof']);
        P.tower(P.X(0.34), [[7, 26], [5, 8]], 'spire', true); P.tower(P.X(0.22), [[6, 24]], 'spire', false);
        for (const dx of [-3.4, 3.4]) P.tower(P.X(0.8) + dx * P.m, [[4, 30]], 'spire', false);
        P.church(P.X(0.68), 30);
        const rb = P.X(0.1); P.box(rb, 14, -5, 48); P.win(rb, 46.5, 0.9, 0.8, 0.8);
      },
      far(P) { P.trees(0, 1, 5, 10, 11); P.roofs(0, 1, 6, 11, 0.06, ['roof', 'flat', 'step']); },
    },
  };
})();
