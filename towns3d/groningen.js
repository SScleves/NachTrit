// Groningen: this town's own look (Opus 5.5 DT/TOWNS-IDENTITY.md section 10; research and sources in
// Opus 5.5 DT/research/towns-urk-texel-groningen.md section 3).
// The Martinitoren over a river of bicycles. A bright city under low clouds glowing orange from its own light; warm white
// lamps hanging on wires over the middle of the street, a soft wash of light on the facades, string lights in the trees,
// bikes heaped against every wall and railing, wide red bike paths. The Grote Markt with its bars open late under the tower,
// lit warm at the foot and cool at the top; the Diepenring with houseboats and the Groninger Museum on its islands (a yellow
// tower, a silver cylinder, a pale blue block), amber lights on the bridges. The dead are students, with bikes and backpacks.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  const SHOPS = ['FIETSENMAKER', 'CAFÉ', 'STUDENTENKROEG', 'FRIET', 'KOFFIEBAR', 'BOEKHANDEL', 'KAPPER', 'FIETSENSTALLING'];
  const POSTS = ['Martinitoren', 'Grote Markt', 'Station', 'Museum', 'Vismarkt', 'Zernike', 'Forum'];
  // the paint atlas: 8 by 4 swatches, so a heap of bikes, a student or a museum is one material
  const S = { black: 0, denim: 1, grey: 2, navy: 3, red: 4, yellow: 5, teal: 6, white: 7, silver: 8, gold: 9, paleBlue: 10, brick: 11, sand: 12, darkStone: 13, copper: 14, bikeBlack: 15,
    bikeRed: 16, bikeBlue: 17, bikeGreen: 18, tyre: 19, wood: 20, canvas: 21, scarf: 22, crate: 23, beanie: 24, olive: 25, boatBlue: 26, boatGreen: 27, roof: 28, glass: 29, amber: 30, rust: 31 };
  let U = null;   // materials, textures and shapes: made on first use and kept for good

  function paintAtlas(THREE) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
    let s = 29; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const cell = (i, f) => { g.save(); g.translate((i % 8) * 64, Math.floor(i / 8) * 64); g.beginPath(); g.rect(0, 0, 64, 64); g.clip(); f(); g.restore(); };
    const flat = (i, col, grain) => cell(i, () => { g.fillStyle = col; g.fillRect(0, 0, 64, 64); for (let j = 0; j < (grain || 0); j++) { g.fillStyle = r() < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.07)'; g.fillRect(r() * 64, r() * 64, 2, 2); } });
    flat(S.black, '#141518', 40); flat(S.denim, '#2c4468', 70); flat(S.grey, '#5c6068', 50); flat(S.navy, '#1e2a46', 50);
    flat(S.red, '#b0322a', 30); flat(S.yellow, '#d8a428', 30); flat(S.teal, '#2a7a7a', 30); flat(S.white, '#e8e6de', 20);
    cell(S.silver, () => { const gr = g.createLinearGradient(0, 0, 64, 0); gr.addColorStop(0, '#9aa2aa'); gr.addColorStop(0.5, '#e4e8ec'); gr.addColorStop(1, '#8a929a'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    flat(S.gold, '#e2b62a', 20); flat(S.paleBlue, '#9ebedc', 20); flat(S.brick, '#6a3a30', 90); flat(S.sand, '#8e897e', 90); flat(S.darkStone, '#4a4844', 90); flat(S.copper, '#4f7a66', 40);
    flat(S.bikeBlack, '#17191d', 10); flat(S.bikeRed, '#8a2a26', 10); flat(S.bikeBlue, '#2a4a7c', 10); flat(S.bikeGreen, '#2f5a3a', 10); flat(S.tyre, '#0d0e11', 0);
    flat(S.wood, '#4a3424', 60); flat(S.canvas, '#3a3f48', 30);
    cell(S.scarf, () => { for (let y = 0, j = 0; y < 64; y += 8, j++) { g.fillStyle = j % 2 ? '#e8e6de' : '#2f7a3e'; g.fillRect(0, y, 64, 8); } });
    flat(S.crate, '#c8a636', 20); flat(S.beanie, '#9a2a2a', 40); flat(S.olive, '#3a4a32', 40); flat(S.boatBlue, '#2a4a6a', 50); flat(S.boatGreen, '#3a5a3a', 50);
    flat(S.roof, '#25272c', 60); flat(S.glass, '#1a2028', 10); flat(S.amber, '#f0a040', 0); flat(S.rust, '#5a3a2a', 60);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; return t;
  }
  function gradTex(THREE, stops) {   // a vertical gradient, bottom (v 0) to top (v 1), for washes of light
    const c = document.createElement('canvas'); c.width = 8; c.height = 128; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 128, 0, 0);
    for (const [t, a] of stops) gr.addColorStop(t, `rgba(255,255,255,${a})`); g.fillStyle = gr; g.fillRect(0, 0, 8, 128);
    return new THREE.CanvasTexture(c);
  }

  function mats(K) {
    if (U) return U;
    const THREE = K.THREE, paint = paintAtlas(THREE), wash = gradTex(THREE, [[0, 0.95], [0.35, 0.45], [1, 0]]), soft = gradTex(THREE, [[0, 0], [0.25, 0.8], [0.75, 0.8], [1, 0]]);
    U = {
      THREE, geo: {},
      paint: K.Mat({ map: paint }),
      dress: K.Mat({ map: paint, emissive: 0xffffff, emissiveMap: paint, emissiveIntensity: 0.16 }),
      lit: K.Mat({ map: paint, emissive: 0xffffff, emissiveMap: paint, emissiveIntensity: 0.55 }),   // the museum's colours, lit
      stone: K.brickMat(0x8c877a),
      wash: K.GlowMat(wash, 0xffc890, 0.3),          // the soft warm light on the facades
      washWarm: K.GlowMat(wash, 0xffbe7a, 0.55),     // the Martinitoren's foot
      washCool: K.GlowMat(soft, 0xc8dcff, 0.42),     // its upper stages
      crown: K.GlowMat(K.glowTex, 0xd6e6ff, 0.9, true),
      bulb: K.GlowMat(K.glowTex, 0xffd890, 0.95, false, { side: THREE.DoubleSide }),
      amber: K.GlowMat(K.glowTex, 0xffa030, 0.95, false, { side: THREE.DoubleSide }),
      winGlow: K.GlowMat(K.glowTex, 0xffb466, 0.42),
      v: new THREE.Vector3(), q: new THREE.Quaternion(), e: new THREE.Euler(), up: new THREE.Vector3(0, 1, 0), one: new THREE.Vector3(1, 1, 1),
    };
    for (const m of [U.paint, U.dress, U.lit, U.wash, U.washWarm, U.washCool]) m.userData.shared = true;
    U.cyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 10);
    U.oct = new THREE.CylinderGeometry(0.5, 0.5, 1, 8); U.torus = new THREE.TorusGeometry(0.5, 0.16, 6, 14);
    U.dome = new THREE.SphereGeometry(0.5, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);
    U.tri = (() => { const sh = new THREE.Shape(); sh.moveTo(-0.5, 0); sh.lineTo(0.5, 0); sh.lineTo(0, 1); sh.closePath(); return new THREE.ShapeGeometry(sh); })();
    return U;
  }
  function sw(base, i) {   // a copy of a unit shape whose UVs all fall inside swatch i of the paint atlas
    const key = base.uuid + '/' + i; let g = U.geo[key]; if (g) return g;
    g = base.index ? base.toNonIndexed() : base.clone();
    const uv = g.attributes.uv, c = i % 8, row = Math.floor(i / 8);
    for (let j = 0; j < uv.count; j++) uv.setXY(j, (c + 0.12 + uv.getX(j) * 0.76) / 8, 1 - (row + 0.12 + (1 - uv.getY(j)) * 0.76) / 4);
    return (U.geo[key] = g);
  }
  function tube(K, k, geo, mat, a, b, r) {   // a unit shape stretched from a to b
    const v = U.v.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]), len = v.length();
    U.q.setFromUnitVectors(U.up, v.multiplyScalar(1 / len)); U.e.setFromQuaternion(U.q, 'XYZ');
    K.kadd(k, geo, mat, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, U.e.x, U.e.y, U.e.z, r * 2, len, r * 2);
  }
  function place(k, x, y, z, ry, rz) { U.e.set(0, ry || 0, rz || 0, 'YXZ'); U.q.setFromEuler(U.e); k.base.compose(U.v.set(x, y, z), U.q, U.one); }   // where the next parts go, as the kit's own kat
  const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const off = (p, n, d) => [p[0] + n[0] * d, p[1] + n[1] * d, p[2] + n[2] * d];

  // ---------- bikes: an omafiets along z, front at -z, wheels on y 0; heaps of them are one mesh ----------
  const BIKES = [S.bikeBlack, S.bikeBlack, S.bikeBlack, S.bikeRed, S.bikeBlue, S.bikeGreen, S.silver];
  function bike(K, k, col, crate) {
    const P = U.paint, F = sw(U.cyl, col), R = 0.33, rz = 0.55, fz = -0.55, hz = -0.4, bb = [0, 0.3, 0.08];
    for (const z of [rz, fz]) K.kadd(k, sw(K.KG.wheel, S.tyre), P, 0, R, z);
    tube(K, k, F, P, [0, R, rz], bb, 0.018); tube(K, k, F, P, [0, R, rz], [0, 0.84, 0.22], 0.016); tube(K, k, F, P, bb, [0, 0.84, 0.22], 0.02);
    tube(K, k, F, P, bb, [0, 0.62, hz], 0.024); tube(K, k, F, P, [0, 0.45, 0.16], [0, 0.74, hz - 0.02], 0.018);
    tube(K, k, F, P, [0, 0.6, hz], [0, 0.98, hz + 0.08], 0.022); tube(K, k, F, P, [0, 0.62, hz], [0, R, fz], 0.016);
    K.kadd(k, sw(K.KG.box, S.bikeBlack), P, 0, 1.0, hz + 0.12, 0, 0, 0, 0.52, 0.03, 0.03);
    K.kadd(k, sw(K.KG.box, S.black), P, 0, 0.9, 0.24, 0, 0, 0, 0.12, 0.05, 0.24);
    K.kadd(k, sw(K.KG.box, col), P, 0, 0.7, rz - 0.04, 0, 0, 0, 0.16, 0.025, 0.42);
    if (crate) K.kadd(k, sw(K.KG.box, crate), P, 0, 0.88, fz - 0.02, 0, 0, 0, 0.36, 0.26, 0.32);   // a crate on the front carrier
  }
  // a heap of bikes against a wall or a railing: leaning on each other, one fallen over, a crate here and there (one draw call)
  function fietsen(K, n, rack) {
    mats(K); const k = K.kit();
    if (rack) for (let i = 0; i < Math.ceil(n / 2); i++) tube(K, k, sw(U.cyl, S.silver), U.paint, [0.42, 0, i * 1.2 - n * 0.3], [0.42, 0.75, i * 1.2 - n * 0.3], 0.03);
    for (let i = 0; i < n; i++) {
      const fallen = Math.random() < 0.12, z = i * 0.58 - n * 0.29 + K.rnd(-0.08, 0.08);
      if (fallen) place(k, -0.3, 0.04, z, K.rnd(0.2, 0.6), 1.45); else place(k, K.rnd(0, 0.15), 0, z, 0.3 + K.rnd(-0.18, 0.18), -0.14 + K.rnd(-0.06, 0.06));
      bike(K, k, K.pick(BIKES), Math.random() < 0.2 ? K.pick([S.crate, S.red, S.black]) : 0);
    }
    k.base.identity();
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }

  // ---------- the dead: students, a quarter of the city, with bikes and backpacks ----------
  function torso(b) {
    const ay = b.sh[1] - b.hip[1], az = b.sh[2] - b.hip[2], L = Math.hypot(ay, az);
    return { at: t => [0, b.hip[1] + ay * t, b.hip[2] + az * t], lean: Math.atan2(az, ay), nf: [0, az / L, -ay / L] };
  }
  function limbs(b, sx) {
    const hx = sx * 0.11, shx = sx * 0.25;
    return { hip: [hx, b.hip[1], b.hip[2]], knee: [hx * 1.1, 0.53, -0.1], foot: [hx * 1.15, 0.07, 0.06], sh: [shx, b.sh[1], b.sh[2]], elbow: [shx * 1.12, 1.16, -0.48], hand: [shx * 1.05, 0.7, -0.6] };
  }
  // v: 'student' (hoodie, backpack), 'fiets' (walking the bike home), 'corps' (blazer, the green and white scarf, a crate of beer: the bars close at 5), 'muts' (puffer jacket, beanie, tote bag)
  function student(k, b, K, v) {
    mats(K); const D = U.dress, B = K.KG.box, t = torso(b), hd = b.hd;
    const top = v === 'corps' ? S.navy : v === 'muts' ? S.olive : K.pick([S.grey, S.navy, S.red]);
    for (const sx of [-1, 1]) {   // jeans and white trainers
      const L = limbs(b, sx);
      tube(K, k, sw(U.cyl, v === 'corps' ? S.grey : S.denim), D, L.hip, L.knee, 0.088); tube(K, k, sw(U.cyl, v === 'corps' ? S.grey : S.denim), D, L.knee, lerp3(L.knee, L.foot, 0.85), 0.072);
      K.kadd(k, sw(B, v === 'corps' ? S.black : S.white), D, L.foot[0], 0.06, L.foot[2] - 0.08, 0, 0, 0, 0.14, 0.11, 0.3);
      tube(K, k, sw(U.cyl, top), D, L.sh, L.elbow, v === 'muts' ? 0.1 : 0.08); tube(K, k, sw(U.cyl, top), D, L.elbow, lerp3(L.elbow, L.hand, 0.82), v === 'muts' ? 0.09 : 0.068);
    }
    tube(K, k, sw(U.cyl, top), D, t.at(-0.04), t.at(0.98), v === 'muts' ? 0.215 : 0.175);
    K.kadd(k, sw(B, top), D, 0, b.sh[1] + 0.01, b.sh[2], 0, 0, 0, 0.58, 0.15, 0.24);
    if (v === 'student' || v === 'fiets') {   // the hood down on the back, the backpack over it
      K.kadd(k, sw(U.dome, top), D, 0, hd[1] - 0.04, hd[2] + 0.2, 1.9, 0, 0, 0.3, 0.2, 0.26);
      const bp = off(t.at(0.55), t.nf, -0.25);
      K.kadd(k, sw(B, K.pick([S.red, S.yellow, S.teal, S.black])), D, 0, bp[1], bp[2], t.lean, 0, 0, 0.36, 0.44, 0.2);
      for (const sx of [-1, 1]) tube(K, k, sw(U.cyl, S.black), D, [sx * 0.12, b.sh[1] + 0.06, b.sh[2] + 0.02], off(t.at(0.4), t.nf, 0.17).map((c, i) => i ? c : sx * 0.13), 0.02);
    }
    if (v === 'corps') {   // the club scarf, and a crate of beer held out in front
      K.kadd(k, sw(U.torus, S.scarf), D, 0, b.sh[1] - 0.02, b.sh[2] - 0.08, 0, 0, 0, 0.3, 0.3, 0.3);
      tube(K, k, sw(U.cyl, S.scarf), D, [0.06, b.sh[1] - 0.04, b.sh[2] - 0.16], [0.08, b.sh[1] - 0.5, b.sh[2] - 0.1], 0.045);
      K.kadd(k, sw(B, S.crate), D, 0, 0.66, -0.66, 0, 0, 0, 0.44, 0.3, 0.32);
      for (let i = 0; i < 6; i++) K.kadd(k, sw(U.cyl, S.olive), D, -0.13 + (i % 3) * 0.13, 0.86, -0.72 + Math.floor(i / 3) * 0.12, 0, 0, 0, 0.06, 0.12, 0.06);
    }
    if (v === 'muts') {   // a beanie with a pompom, a tote bag on the shoulder
      K.kadd(k, sw(U.dome, S.beanie), D, 0, hd[1] + 0.03, hd[2] + 0.02, 0.35, 0, 0, 0.26, 0.26, 0.27);
      K.kadd(k, sw(K.KG.ball, S.white), D, 0, hd[1] + 0.17, hd[2] + 0.06, 0, 0, 0, 0.09, 0.09, 0.09);
      K.kadd(k, sw(B, S.canvas), D, -0.33, 0.95, -0.25, 0, 0, 0.12, 0.08, 0.38, 0.32);
      tube(K, k, sw(U.cyl, S.canvas), D, [-0.3, 1.14, -0.25], [-0.2, b.sh[1] + 0.05, b.sh[2]], 0.015);
    }
    if (v === 'fiets') {   // walking the bike home, a hand on the bars
      const kb = k.base.clone(); place(k, 0.5, 0, -0.35, 0, 0); bike(K, k, K.pick(BIKES), Math.random() < 0.4 ? S.crate : 0); k.base.copy(kb);
    }
  }

  // ---------- the city ----------
  let shopTurn = 0;
  // a terrace of the town's brick houses (the game's own house builder), a soft wash of warm light up each front
  function gronRow(K, n, o) {
    o = o || {}; mats(K);
    const g = new U.THREE.Group(), k = K.kit(), st = K.style, len = n * 6.05, pal = [K.pick(st.brick), K.pick(st.brick)];
    for (let i = 0; i < n; i++) {
      const w = K.rnd(st.width[0], st.width[1]) * (o.plain ? 1.25 : 1), shop = o.shops && Math.random() < o.shops, oz = -len / 2 + 3 + i * 6.05;
      K.house(Object.assign({}, o, { k, g, w, brick: pal[i % 2], ox: w / 2 - 2.2, oz, sign: shop ? SHOPS[shopTurn++ % SHOPS.length] : null, lit: o.lit != null ? o.lit : shop ? 0.6 : 0.45 }));
      k.base.identity();
      if (!o.plain) K.kadd(k, K.KG.plane, U.wash, -2.34, 3.3, oz, 0, -Math.PI / 2, 0, 6.2, 6.6);
    }
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }
  // warm white lamps hanging on a wire over the middle of the street, the wire held by the house fronts (or by two masts on a square)
  function hangLamp(K, masts) {
    mats(K); const g = new U.THREE.Group(), k = K.kit(), P = U.paint, BK = sw(U.cyl, S.bikeBlack), x0 = masts ? 0 : 1.0, x1 = masts ? -9.4 : -10.4, mid = -4.7, top = 7.9, hy = 6.5;
    if (masts) for (const x of [x0, x1]) K.kadd(k, BK, P, x, top / 2, 0, 0, 0, 0, 0.13, top, 0.13);
    else for (const x of [x0, x1]) K.kadd(k, sw(K.KG.box, S.bikeBlack), P, x, top - 0.1, 0, 0, 0, 0, 0.3, 0.3, 0.12);
    tube(K, k, BK, P, [x0, top - 0.1, 0], [mid, hy + 0.55, 0], 0.012); tube(K, k, BK, P, [x1, top - 0.1, 0], [mid, hy + 0.55, 0], 0.012);
    K.kadd(k, sw(U.dome, S.bikeBlack), P, mid, hy + 0.1, 0, 0, 0, 0, 1.0, 0.55, 1.0);
    K.kbuild(k, g);
    const b = new U.THREE.Mesh(K.PG.bulb, K.PM.lampHead); b.position.set(mid, hy, 0); b.scale.set(1.8, 0.5, 1.8); g.add(b);
    K.lampLights(g, mid, hy, 0, 0.95);
    g.userData.faceRoad = true; return g;
  }
  // a lime on the square with a string of small warm bulbs through its crown
  function lightTree(K) {
    mats(K); const g = new U.THREE.Group(), t = K.treeCard([1, 1, 0]), k = K.kit(); t.userData.bill = false; g.add(t);
    for (let i = 0; i < 34; i++) { const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()); K.kadd(k, K.KG.plane, U.bulb, Math.cos(a) * d * 3.1, 7.2 + Math.sin(a) * d * 2.5, 0.3, 0, 0, 0, 0.3, 0.3); }
    K.kbuild(k, g); g.userData.bill = true; return g;
  }
  // the Martinitoren, d'Olle Grieze: sandstone stages, galleries, the octagon, the open crown, the cupola and the horse on the vane
  // (at 0.8 of its 97 m); lit warm at the foot and cool at the top, the crown shining through the haze
  function martini(K) {
    mats(K); const THREE = U.THREE, g = new THREE.Group(), k = K.kit(), St = U.stone, P = U.paint, s = 0.8, q = Math.PI / 2;
    const stage = (w, y0, y1) => K.kb(k, St, 0, (y0 + y1) / 2 * s, 0, w * s, (y1 - y0) * s, w * s);
    stage(13, 0, 40); for (const cx of [-1, 1]) for (const cz of [-1, 1]) K.kb(k, St, cx * 6.4 * s, 19 * s, cz * 6.4 * s, 1.8 * s, 38 * s, 1.8 * s);
    stage(14.6, 40, 41.4); stage(10.6, 41.4, 55); stage(12, 55, 56.2);
    K.kadd(k, U.oct, St, 0, 61.5 * s, 0, 0, Math.PI / 8, 0, 9.4 * s, 10.6 * s, 9.4 * s);
    K.kadd(k, U.oct, St, 0, 67.3 * s, 0, 0, Math.PI / 8, 0, 10.6 * s, 1.0 * s, 10.6 * s);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + Math.PI / 8; K.kb(k, St, Math.cos(a) * 3.3 * s, 72.5 * s, Math.sin(a) * 3.3 * s, 0.8 * s, 9.4 * s, 0.8 * s); }
    K.kadd(k, U.oct, St, 0, 77.6 * s, 0, 0, Math.PI / 8, 0, 8.2 * s, 0.9 * s, 8.2 * s);
    K.kadd(k, sw(U.dome, S.copper), P, 0, 78 * s, 0, 0, 0, 0, 6.6 * s, 5 * s, 6.6 * s);
    K.kadd(k, sw(U.oct, S.copper), P, 0, 82.8 * s, 0, 0, 0, 0, 1.8 * s, 3.4 * s, 1.8 * s);
    K.kadd(k, sw(U.cyl, S.darkStone), P, 0, 89 * s, 0, 0, 0, 0, 0.24 * s, 9 * s, 0.24 * s);
    K.kadd(k, sw(K.KG.box, S.darkStone), P, 0.3 * s, 93.2 * s, 0, 0, 0, 0, 1.7 * s, 0.8 * s, 0.25 * s);
    for (const [y, h, w] of [[24, 11, 1.9], [48, 8, 1.7]]) for (const dz of [-1.9, 1.9]) {   // tall lancets on the faces toward the street and the rider
      K.kadd(k, sw(K.KG.box, S.glass), P, -6.52 * (y < 40 ? 1 : 0.82) * s, y * s, dz * s, 0, 0, 0, 0.1, h * s, w * s);
      K.kadd(k, sw(K.KG.box, S.glass), P, dz * s, y * s, 6.52 * (y < 40 ? 1 : 0.82) * s, 0, 0, 0, w * s, h * s, 0.1);
    }
    // the light: a warm wash up the foot, cool light on the upper stages, the crown lit from inside
    for (const [m, y, w, h] of [[U.washWarm, 16, 14, 32], [U.washCool, 48.2, 11, 14], [U.washCool, 61.5, 9.6, 11]]) {
      const d = (y < 40 ? 7.35 : y < 56 ? 5.5 : 4.9) * s;
      K.kadd(k, K.KG.plane, m, -d, y * s, 0, 0, -q, 0, w * s, h * s); K.kadd(k, K.KG.plane, m, 0, y * s, d, 0, 0, 0, w * s, h * s);
    }
    // the Martinikerk against its foot: a long nave under a steep roof, away from the street
    K.kb(k, St, 6.5 * s + 18, 8, 0, 36, 16, 17);
    const al = Math.atan2(9, 8.5), sl = Math.hypot(8.5, 9);
    for (const sd of [-1, 1]) K.kb(k, K.PM.roof, 6.5 * s + 18, 16 + 4.5, sd * 4.25, 36.4, 0.3, sl, sd * al, 0, 0);
    K.kbuild(k, g);
    const crown = new THREE.Sprite(U.crown); crown.scale.set(15, 15, 1); crown.position.y = 72.5 * s; g.add(crown);
    const glint = new THREE.Sprite(U.crown); glint.scale.set(6, 6, 1); glint.position.y = 83 * s; g.add(glint);
    return g;
  }
  // the Groninger Museum on its islands in the canal: a yellow tower, a silver cylinder, a pale blue block set askew, on a brick base
  function museum(K) {
    mats(K); const k = K.kit(), P = U.paint, L = U.lit, B = K.KG.box;
    K.kadd(k, sw(B, S.brick), P, 0, 0.2, 0, 0, 0, 0, 15, 2.6, 30);
    K.kadd(k, sw(B, S.gold), L, 1.2, 1.5 + 11, -1.5, 0, 0.12, 0, 4.4, 22, 4.4);
    K.kadd(k, sw(U.cyl, S.silver), L, -2.2, 1.5 + 4.5, 8.5, 0, 0, 0, 11, 9, 11);
    K.kadd(k, sw(B, S.paleBlue), L, 0.6, 1.5 + 4.2, -10.5, 0, 0.35, 0.06, 12, 8.4, 9);
    K.kadd(k, sw(B, S.gold), L, 4.2, 1.5 + 2.2, 2.5, 0, -0.2, 0, 5, 4.4, 6);
    for (let i = 0; i < 5; i++) K.kadd(k, sw(B, S.amber), L, 3.32, 4.2, 5.2 + i * 1.3, 0, 0, 0, 0.1, 1.2, 0.8);   // a band of lit glass in the cylinder
    K.kadd(k, K.KG.plane, U.washWarm, 3.55, 9, -1.5, 0, Math.PI / 2, 0, 5, 18);
    return K.kbuild(k);
  }
  function woonboot(K) {   // a houseboat on the Diepenring: flat hull, a boxy cabin, warm windows, a chimney, plants on deck
    mats(K); const k = K.kit(), P = U.paint, hull = K.pick([S.boatBlue, S.boatGreen, S.rust, S.navy]);
    K.kadd(k, sw(K.KG.box, S.black), P, 0, 0.15, 0, 0, 0, 0, 4.4, 1.1, 16);
    K.kadd(k, sw(K.KG.box, hull), P, -0.2, 1.8, 0, 0, 0, 0, 3.8, 2.3, 13);
    K.kadd(k, sw(K.KG.box, S.roof), P, -0.2, 3.02, 0, 0, 0, 0, 4.3, 0.18, 13.6);
    for (let i = 0; i < 4; i++) { const z = -4.5 + i * 3, lit = Math.random() < 0.6; K.kadd(k, K.PG['win' + (lit ? K.pick([0, 1, 2]) : 5)], K.PM.winAtlas, 1.72, 1.9, z, 0, Math.PI / 2, 0, 1.1, 0.9); if (lit) { K.kadd(k, K.KG.plane, U.winGlow, 1.78, 1.9, z, 0, Math.PI / 2, 0, 2.6, 2.0); K.kadd(k, K.PG.streak, U.winGlow, 3.4, 0.04, z, 0, 0, 0, 0.7, 1, 0.35); } }
    K.kadd(k, sw(U.cyl, S.black), P, -0.9, 3.7, 4.2, 0, 0, 0, 0.22, 1.3, 0.22);
    for (let i = 0; i < 4; i++) K.kadd(k, sw(K.KG.ball, S.boatGreen), P, 1.6, 0.95, -6.5 + i * 0.5, 0, 0, 0, 0.5, 0.45, 0.5);
    return K.kbuild(k);
  }
  function brug(K) {   // a brick bridge over the canal, amber lights along both parapets
    mats(K); const k = K.kit(), P = U.paint, L = 26;
    K.kadd(k, sw(K.KG.box, S.darkStone), P, -L / 2, -0.25, 0, 0, 0, 0, L, 0.5, 4.2);
    for (const z of [-2.1, 2.1]) {
      K.kadd(k, sw(K.KG.box, S.brick), P, -L / 2, 0.45, z, 0, 0, 0, L, 0.9, 0.35);
      for (let x = -1.2; x > -L; x -= 3.2) { K.kadd(k, K.KG.plane, U.amber, x, 1.08, z, 0, 0, 0, 0.55, 0.55); K.kadd(k, K.KG.plane, U.amber, x, 1.08, z, 0, Math.PI / 2, 0, 0.55, 0.55); }
    }
    for (const x of [-8.5, -17.5]) K.kadd(k, sw(K.KG.box, S.darkStone), P, x, -1.2, 0, 0, 0, 0, 1.4, 1.9, 4.4);
    return K.kbuild(k);
  }
  function terras(K) {   // a bar's terrace on the Grote Markt at two in the morning: tables, chairs, a tea light on each, the parasol folded
    mats(K); const k = K.kit(), P = U.paint;
    for (let i = 0; i < 3; i++) {
      const z = (i - 1) * 2.2, x = K.rnd(-0.3, 0.3);
      K.kadd(k, sw(U.cyl, S.black), P, x, 0.36, z, 0, 0, 0, 0.08, 0.72, 0.08); K.kadd(k, sw(U.cyl, S.black), P, x, 0.74, z, 0, 0, 0, 0.7, 0.04, 0.7);
      for (const sd of [-1, 1]) { const cz = z + sd * 0.55; K.kadd(k, sw(K.KG.box, S.wood), P, x, 0.45, cz, 0, 0, 0, 0.42, 0.05, 0.42); K.kadd(k, sw(K.KG.box, S.wood), P, x, 0.7, cz + sd * 0.2, 0, 0, 0, 0.42, 0.5, 0.04); K.kadd(k, sw(K.KG.box, S.black), P, x, 0.22, cz, 0, 0, 0, 0.04, 0.44, 0.04); }
      K.kadd(k, K.KG.plane, U.bulb, x, 0.86, z, 0, 0, 0, 0.32, 0.32); K.kadd(k, K.KG.plane, U.bulb, x, 0.86, z, 0, Math.PI / 2, 0, 0.32, 0.32);
    }
    K.kadd(k, sw(U.cyl, S.canvas), P, 0.9, 1.5, 0, 0, 0, 0, 0.26, 3.0, 0.26);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function stadhuis(K) {   // the white town hall on the Grote Markt: columns, a pediment, tall windows
    mats(K); const k = K.kit(), P = U.paint, W = 26, yaw = -Math.PI / 2;
    K.kadd(k, sw(K.KG.box, S.white), P, 7, 7, 0, 0, 0, 0, 14, 14, W);
    for (let i = 0; i < 6; i++) K.kadd(k, sw(U.cyl, S.white), P, -1.2, 5.6, -6.25 + i * 2.5, 0, 0, 0, 0.9, 11.2, 0.9);
    K.kadd(k, sw(K.KG.box, S.white), P, -1.0, 11.6, 0, 0, 0, 0, 2.4, 0.9, 15.5);
    K.kadd(k, sw(U.tri, S.white), P, -2.1, 12.04, 0, 0, yaw, 0, 15.5, 3.2, 1);
    K.kb(k, K.PM.roof, 7, 14.4, 0, 14.4, 0.8, W + 0.4);
    for (const y of [4, 9]) for (let z = -11.5; z <= 11.6; z += 2.88) { const lit = Math.random() < 0.3; K.kadd(k, K.PG['win' + (lit ? 3 : 4)], K.PM.winAtlas, -0.02, y, z, 0, yaw, 0, 1.1, 2.2); }
    K.kadd(k, K.KG.plane, U.wash, -2.6, 6, 0, 0, yaw, 0, 18, 12);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }

  function mast(K) {   // the tall lamp masts along the Diepenring
    mats(K); const g = new U.THREE.Group(), k = K.kit(), P = U.paint;
    K.kadd(k, sw(U.cyl, S.bikeBlack), P, 0, 4.5, 0, 0, 0, 0, 0.16, 9, 0.16); K.kadd(k, sw(K.KG.box, S.bikeBlack), P, -0.7, 9.0, 0, 0, 0, 0, 1.6, 0.14, 0.4);
    K.kbuild(k, g);
    const b = new U.THREE.Mesh(K.PG.bulb, K.PM.lampHead); b.position.set(-1.3, 8.9, 0); b.scale.set(1.6, 0.4, 1.4); g.add(b);
    K.lampLights(g, -1.3, 8.9, 0, 1.3);
    g.userData.faceRoad = true; return g;
  }
  const heap = lo => K => fietsen(K, lo + Math.floor(Math.random() * 6), Math.random() < 0.4);

  // ---------- the far town, painted ----------
  const Yof = (P, h) => P.g.canvas.height - 5 * P.m - h * P.m;
  function martiniP(P, x, s) {   // the Martinitoren as the city sees it from everywhere: stages, galleries, the open crown, the cupola
    const b = (w, h0, h1) => P.box(x, w * s, h0 * s, h1 * s), pin = (dx, h0, h1) => P.poly([[x + (dx - 0.6) * s * P.m, h0 * s], [x + dx * s * P.m, h1 * s], [x + (dx + 0.6) * s * P.m, h0 * s]]);
    b(13, -6, 40); b(14.6, 40, 41.4); for (const dx of [-6.6, 6.6]) pin(dx, 41.4, 45);
    b(10.6, 41.4, 55); b(12, 55, 56.2); for (const dx of [-5.4, 5.4]) pin(dx, 56.2, 59.4);
    b(9.4, 56.2, 66.8); b(10.6, 66.8, 67.8);
    for (const dx of [-3.3, -1.1, 1.1, 3.3]) P.box(x + dx * s * P.m, 0.8 * s, 67.8 * s, 77.2 * s);
    b(8.2, 77.2, 78.1);
    P.g.beginPath(); P.g.ellipse(x, Yof(P, 78.1 * s), 3.3 * s * P.m, 4.4 * s * P.m, 0, Math.PI, 0); P.g.fill();
    b(1.8, 82, 86); P.line(x, 86 * s, x, 95 * s, 0.3 * s);
    const gr = P.w.createLinearGradient(0, Yof(P, 0), 0, Yof(P, 34 * s)); gr.addColorStop(0, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    P.w.fillStyle = gr; P.w.fillRect(x - 6.5 * s * P.m, Yof(P, 34 * s), 13 * s * P.m, 34 * s * P.m);
    P.w.fillStyle = 'rgba(175,215,255,0.95)'; for (const dx of [-2.2, 0, 2.2]) P.w.fillRect(x + (dx - 0.7) * s * P.m, Yof(P, 76.6 * s), 1.4 * s * P.m, 8.4 * s * P.m);
  }
  const KINDS = ['step', 'bell', 'roof', 'step', 'roof'];
  const skyline = {
    near(P, K, th) {
      if (th.key === 'square') { P.roofs(0, 0.36, 10, 17, 0.35, KINDS); P.trees(0.4, 1, 6, 11, 10); return; }   // the Markt opens out on the right
      P.roofs(0, 0.4, 10, 17, 0.35, KINDS); P.roofs(0.6, 1, 10, 17, 0.35, KINDS); P.trees(0.42, 0.58, 4, 7, 12);
    },
    mid(P) {   // roofs full of lit student rooms, the Akerk's lantern, the Academiegebouw, the angular Forum, and the old grey one over everything
      P.trees(0, 1, 7, 12, 14); P.roofs(0, 1, 10, 19, 0.32, KINDS.concat(['flat']));
      P.tower(P.X(0.33), [[7.5, 28], [5.5, 10]], 'lantern', true); P.tower(P.X(0.7), [[6, 25]], 'onion', true);
      const fx = P.X(0.82); P.poly([[fx - 14 * P.m, -5], [fx - 14 * P.m, 30], [fx - 5 * P.m, 41], [fx + 9 * P.m, 37], [fx + 14 * P.m, 25], [fx + 14 * P.m, -5]]);
      for (let fy = 3; fy < 30; fy += 3.4) for (let dx = -12; dx < 13; dx += 2.6) if (P.r() < 0.45) P.win(fx + dx * P.m, fy, P.rr(0.5, 1), 1.6, 1.4);
      martiniP(P, P.X(0.6), 0.74);
    },
    far(P) { P.trees(0, 1, 5, 9, 11); P.roofs(0, 1, 7, 12, 0.1, ['roof', 'step']); P.tower(P.X(0.44), [[6, 30]], 'spire'); P.tower(P.X(0.9), [[5, 24]], 'spire'); },
  };

  const signs3 = () => POSTS.slice().sort(() => Math.random() - 0.5).slice(0, 3);
  const city = { fog: 0x5a555a, fogD: 0.0155, night: 0.2 };
  // a street of the old city: tall brick houses with shaped gables, lamps on wires over the middle, bikes heaped along both sides
  function cityStreet(base, K, shops) {
    return Object.assign({}, base, city, {
      curv: 0.0025, road: shops ? { kind: 'klinkers', tone: '#4c3a36' } : { tone: '#5a2f2b' }, lmSide: 'right', lmX: [37, 42],
      spawn: [
        { make: K => gronRow(K, 3, { shops: shops ? 0.8 : 0.15 }), n: 12, gap: 12, side: 'alt', reg: true, xr: [7.9, 8.2], r: 9 },
        { make: K => K.backRow(), n: 9, gap: 16, side: 'alt', reg: true, xr: [18.5, 20.5], r: 14 },
        { make: K => hangLamp(K, false), n: 12, gap: 13, side: 'alt', reg: true, xr: [4.7, 4.7] },
        { make: heap(6), n: shops ? 9 : 11, gap: 14, side: 'both', xr: [4.9, 5.0], r: 0.6 },
        { make: K => K.bins(), n: 3, gap: 50, side: 'both', xr: [5.0, 5.1], r: 0.5 },
        { make: lightTree, n: 4, gap: 45, side: 'both', xr: [12, 14.5], r: 0.9 },
        { make: K => K.fingerpost(signs3()), n: 2, gap: 75, side: 'both', xr: [4.6, 4.6], r: 0.5 },
        { make: 'zombieWalk', n: 9, gap: 16, side: 'both', xr: [4.8, 5.4], r: 0.6 },
      ],
    });
  }

  T.groningen = {
    style: { brick: [0x5c2e28, 0x4a2a26, 0x6e3a30, 0x3e2a28], gables: 0.6, height: [8, 11], width: [3.6, 4.8], lamp: 'classic' },
    light: { lamp: 0xffe2bc },
    sky: { stars: 30, clouds: 1, glows: [{ az: 0, el: 7, w: 130, h: 13, color: 0xff9a52, a: 0.16 }, { az: 95, el: 6, w: 120, h: 12, color: 0xff9a52, a: 0.16 }, { az: -95, el: 6, w: 120, h: 12, color: 0xff9a52, a: 0.16 }, { az: 180, el: 6, w: 140, h: 12, color: 0xff9a52, a: 0.14 }] },
    road: { tone: '#5a2f2b' },
    shops: SHOPS, signs: POSTS, extra: [],
    landmark: martini,
    skyline,
    dead: {
      pool: ['grunnstudent', 'grunnstudent', 'grunnfiets', 'grunnfiets', 'grunncorps', 'grunnmuts'],
      dress: {
        grunnstudent(k, b, K) { student(k, b, K, 'student'); }, grunnfiets(k, b, K) { student(k, b, K, 'fiets'); },
        grunncorps(k, b, K) { student(k, b, K, 'corps'); }, grunnmuts(k, b, K) { student(k, b, K, 'muts'); },
      },
    },
    themes: {
      street: (base, K) => cityStreet(base, K, false),
      shops: (base, K) => cityStreet(base, K, true),
      // the Grote Markt: bars along the left open till five, the tower and the town hall across the square on the right, limes full of lights
      square: (base, K) => Object.assign({}, base, city, {
        curv: 0.0018, road: { kind: 'klinkers', tone: '#3e3838' }, lmSide: 'right', lmX: [26, 31],
        spawn: [
          { make: K => gronRow(K, 3, { shops: 0.7 }), n: 6, gap: 24, side: 'left', reg: true, xr: [9.6, 10], r: 9 },
          { make: K => K.backRow(), n: 4, gap: 36, side: 'left', reg: true, xr: [21, 22.5], r: 14 },
          { make: K => gronRow(K, 4, { plain: true, lit: 0.5 }), n: 3, gap: 55, side: 'right', reg: true, xr: [44, 48], r: 14 },
          { make: stadhuis, n: 1, gap: 220, side: 'right', xr: [30, 34], r: 14 },
          { make: lightTree, n: 7, gap: 20, side: 'right', xr: [8, 22], r: 0.9 },
          { make: lightTree, n: 4, gap: 36, side: 'left', xr: [6.4, 6.8], r: 0.9 },
          { make: terras, n: 4, gap: 34, side: 'left', xr: [6.8, 7.1], r: 1.2 },
          { make: K => hangLamp(K, true), n: 8, gap: 17, side: 'alt', reg: true, xr: [4.7, 4.7] },
          { make: heap(5), n: 8, gap: 18, side: 'both', xr: [4.9, 5.0], r: 0.6 },
          { make: K => K.bench(), n: 3, gap: 50, side: 'right', xr: [5.2, 5.4], r: 0.9 },
          { make: K => K.fingerpost(signs3()), n: 1, gap: 150, side: 'both', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 8, gap: 24, side: 'both', xr: [5.0, 6.4], r: 0.6 },
        ],
      }),
      // the Diepenring: the red bike path along the canal ring, houseboats and limes with lights on the quay, the museum on its islands,
      // amber lights on the bridges, tall masts, the city's houses on the right and the tower over their roofs
      dyke: (base, K) => Object.assign({}, base, city, {
        open: false, water: 0x1a2028, ground: 0x1b1f25, groundY: -0.05, waterY: -1.1, canal: -1, curv: 0.0022, verge: 'tiles', road: { tone: '#5a2f2b' }, landmark: false,
        spawn: [
          { make: K => gronRow(K, 3, { shops: 0.15 }), n: 6, gap: 26, side: 'right', reg: true, xr: [7.9, 8.2], r: 9 },
          { make: K => K.backRow(), n: 6, gap: 26, side: 'right', reg: true, xr: [18.5, 20.5], r: 14 },
          { make: K => gronRow(K, 4, { plain: true, lit: 0.4, reflect: 3.2 }), n: 4, gap: 38, side: 'left', reg: true, xr: [35.5, 36.5], r: 13 },
          { make: museum, n: 1, gap: 220, side: 'left', xr: [18, 20], y: -1.1, r: 14 },
          { make: woonboot, n: 5, gap: 34, side: 'left', xr: [9.6, 10.4], y: -1.1, r: 8 },
          { make: brug, n: 1, gap: 160, side: 'left', xr: [5.1, 5.1], r: 3 },
          { make: lightTree, n: 4, gap: 40, side: 'left', xr: [6.6, 7.2], r: 0.9 },
          { make: mast, n: 4, gap: 52, side: 'left', reg: true, xr: [4.75, 4.75] },
          { make: K => hangLamp(K, false), n: 6, gap: 28, side: 'right', reg: true, xr: [4.7, 4.7] },
          { make: heap(6), n: 7, gap: 24, side: 'right', xr: [4.9, 5.0], r: 0.6 },
          { make: K => K.fingerpost(signs3()), n: 1, gap: 160, side: 'right', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 6, gap: 30, side: 'both', xr: [4.8, 5.2], r: 0.6 },
        ],
      }),
    },
  };
})();
