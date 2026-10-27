// Kinderdijk en Dordrecht: one chapter of two places.
// Kinderdijk is the mill field: two rows of mills along long black water, the eight round brick mills of the Nederwaard
// (1738) whose sails sweep low over the ground, the eight octagonal thatched mills of the Overwaard (1740) in one straight
// line; narrow unlit embankments between the reeds, a mill or two floodlit, one with its sails set in mourning, the cradle
// with the cat of the 1421 flood afloat on the boezem. Dordrecht is the oldest town of Holland: cobbled harbour quays with
// moored sailing barges, the iron double drawbridge Damiatebrug, merchant houses with Dordtse stepped gables, the stubby
// leaning tower of the Grote Kerk with its four clock faces over every roof, and the Groothoofdspoort where three rivers meet.
// Warm white lanterns in the old town, no lamps at all among the mills. The dead: millers.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  const WATER = -0.95, HARBOUR = -1.3;
  const SHOPS = ['BAKKER', 'SLAGER', 'KAAS', 'BOEKHANDEL', 'CAFÉ', 'APOTHEEK', 'FIETSEN', 'BLOEMEN', 'KAPPER', 'DROP', 'ANTIEK', 'KOFFIEBRANDERIJ'];
  const SIGNS = ['Grote Kerk', 'Groothoofd', 'Damiatebrug', 'Voorstraat', 'Wolwevershaven', 'Nederwaard', 'Overwaard', 'Kyck over den Dyck'];
  const BRICK = [0x5a3a30, 0x4a3530, 0x6b4a3c, 0x5e4438, 0x3f3330];
  let MT = null, DM = null, seq = 0;
  const _v = {};

  function kat(K, k, x, y, z, ry, rz) {   // where the next kit parts go (the game's kat is not in the town kit)
    if (!_v.q) { const { THREE } = K; _v.q = new THREE.Quaternion(); _v.e = new THREE.Euler(0, 0, 0, 'YXZ'); _v.p = new THREE.Vector3(); _v.s = new THREE.Vector3(1, 1, 1); }
    _v.e.set(0, ry || 0, rz || 0, 'YXZ'); _v.q.setFromEuler(_v.e); _v.p.set(x, y, z); k.base.compose(_v.p, _v.q, _v.s); return k;
  }
  // all the town's light on one canvas: 8 x 2 cells of 128. Row 0: glows (warm lantern, cold, red, green), a floodlight
  // beam, a soft wash, a warm panel, lit windows; row 1: their reflections on the water, a band of light, solid white
  function lightCanvas() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 256; const g = c.getContext('2d');
    const rgba = (rgb, a) => `rgba(${rgb},${a})`;
    ['255,206,140', '226,236,255', '255,60,46', '70,255,140'].forEach((rgb, i) => {
      const x = i * 128 + 64, r = g.createRadialGradient(x, 64, 0, x, 64, 62);
      r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.1, rgba(rgb, 0.9)); r.addColorStop(0.3, rgba(rgb, 0.34)); r.addColorStop(0.62, rgba(rgb, 0.08)); r.addColorStop(1, rgba(rgb, 0));
      g.fillStyle = r; g.fillRect(i * 128, 0, 128, 128);
      for (let y = 0; y < 128; y += 2) {
        const t = y / 127, a = Math.pow(Math.sin(t * Math.PI), 1.3) * Math.max(0, 0.45 + 0.55 * Math.sin(y * 0.7 + i * 2) * Math.sin(y * 0.21 + i));
        if (a < 0.03) continue;
        const w = 9 + 8 * Math.sin(y * 0.37 + i), lg = g.createLinearGradient(x - w, 0, x + w, 0);
        lg.addColorStop(0, rgba(rgb, 0)); lg.addColorStop(0.5, rgba(rgb, a)); lg.addColorStop(1, rgba(rgb, 0));
        g.fillStyle = lg; g.fillRect(x - w, 128 + y, w * 2, 2);
      }
    });
    for (let y = 0; y < 128; y++) {
      const t = y / 127, hw = 5 + 57 * t, a = Math.pow(1 - t, 1.4) * 0.6, lg = g.createLinearGradient(576 - hw, 0, 576 + hw, 0);
      lg.addColorStop(0, 'rgba(255,236,200,0)'); lg.addColorStop(0.5, `rgba(255,236,200,${a})`); lg.addColorStop(1, 'rgba(255,236,200,0)');
      g.fillStyle = lg; g.fillRect(512, y, 128, 1);
    }
    { const r = g.createRadialGradient(704, 64, 0, 704, 64, 64); r.addColorStop(0, 'rgba(255,240,215,0.32)'); r.addColorStop(0.55, 'rgba(255,240,215,0.12)'); r.addColorStop(1, 'rgba(255,240,215,0)'); g.fillStyle = r; g.fillRect(640, 0, 128, 128); }
    g.save(); g.filter = 'blur(6px)'; g.fillStyle = 'rgba(255,214,160,0.5)'; g.fillRect(782, 14, 100, 100); g.restore();
    { const lg = g.createLinearGradient(0, 128, 0, 256); lg.addColorStop(0, 'rgba(255,228,176,0)'); lg.addColorStop(0.28, 'rgba(255,228,176,0.9)'); lg.addColorStop(0.72, 'rgba(255,214,150,0.9)'); lg.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = lg; g.fillRect(514, 128, 124, 128); }
    g.fillStyle = '#fff'; g.fillRect(644, 132, 120, 120);
    let s = 13; const r = () => (s = s * 16807 % 2147483647) / 2147483647;
    for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) { if (r() < 0.45) continue; g.fillStyle = rgba('255,206,140', 0.55 + r() * 0.4); g.fillRect(900 + i * 20, 10 + j * 30, 13, 18); }
    return c;
  }
  function aq(THREE, col, row) {
    const p = new THREE.PlaneGeometry(1, 1), uv = p.attributes.uv, e = 0.01;
    for (let j = 0; j < uv.count; j++) uv.setXY(j, (col + e + uv.getX(j) * (1 - 2 * e)) / 8, (1 - row + e + uv.getY(j) * (1 - 2 * e)) / 2);
    return p;
  }
  function mats(K) {
    if (MT) return MT;
    const { THREE, Mat } = K, keep = m => { m.userData.shared = true; return m; };
    const lt = new THREE.CanvasTexture(lightCanvas()), Q = (c, r) => aq(THREE, c, r), reed = K.reeds();
    MT = {
      glow: keep(K.GlowMat(lt, 0xffffff, 1, false, { side: THREE.DoubleSide })),
      q: { warm: Q(0, 0), cold: Q(1, 0), red: Q(2, 0), green: Q(3, 0), beam: Q(4, 0), wash: Q(5, 0), panel: Q(6, 0), office: Q(7, 0), sWarm: Q(0, 1), sCold: Q(1, 1), sRed: Q(2, 1), sGreen: Q(3, 1), band: Q(4, 1), solid: Q(5, 1) },
      reed: reed.children[0].material, grass: keep(Mat({ color: 0x18211a })), thatch: keep(Mat({ color: 0x3b352b })), thatchDark: keep(Mat({ color: 0x2c2822 })),
      sail: keep(Mat({ color: 0x2a2219 })), white: keep(Mat({ color: 0xcfcabc })), stone: keep(Mat({ color: 0x8c877a })), tuff: keep(Mat({ color: 0x7c7868 })),
      iron: keep(Mat({ color: 0x24302c })), dark: keep(new THREE.MeshBasicMaterial({ color: 0x0b0d12 })), hull: keep(Mat({ color: 0x16181c })),
      red: keep(Mat({ color: 0x5a2420 })), green: keep(Mat({ color: 0x1f3a2a })), quay: keep(Mat({ color: 0x3a3e45 })), lead: keep(Mat({ color: 0x3c4249 })),
      half: new THREE.CircleGeometry(0.5, 14, 0, Math.PI), oct: new THREE.CylinderGeometry(0.62, 1, 1, 8).translate(0, 0.5, 0),
      round: new THREE.CylinderGeometry(0.7, 1, 1, 16).translate(0, 0.5, 0), cone8: new THREE.ConeGeometry(1, 1, 8).translate(0, 0.5, 0),
      dome: new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), oct8: new THREE.CylinderGeometry(1, 1, 1, 8).translate(0, 0.5, 0),
      signBase: keep(new THREE.MeshBasicMaterial()),
    };
    return MT;
  }
  const STREAK = { warm: 'sWarm', cold: 'sCold', red: 'sRed', green: 'sGreen' };
  function lamp(K, k, col, x, y, z, s, wy, len) {   // a light seen from every side, and its reflection on the water at wy
    const q = MT.q[col];
    K.kadd(k, q, MT.glow, x, y, z, 0, 0, 0, s, s, 1); K.kadd(k, q, MT.glow, x, y, z, 0, Math.PI / 2, 0, s, s, 1);
    if (wy != null) K.kadd(k, MT.q[STREAK[col]], MT.glow, x, wy + 0.03, z, -Math.PI / 2, 0, 0, s * 0.9, len || 9, 1);
  }
  // four sails round the hub at the origin in the x-y plane: the stocks, the rails and the bars of the lattice, cloth rolled up
  function sails(K, k, mat, L, w, a0) {
    for (let i = 0; i < 4; i++) {
      const a = a0 + i * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), px = -s, py = c;
      K.ktube(k, mat, 0, 0, 0, c * L, s * L, 0, 0.16);
      for (const o of [w * 0.12, w]) K.ktube(k, mat, c * L * 0.18 + px * o, s * L * 0.18 + py * o, 0, c * L + px * o, s * L + py * o, 0, 0.05);
      for (let j = 0; j <= 10; j++) { const t = 0.18 + j * 0.082; K.ktube(k, mat, c * L * t, s * L * t, 0, c * L * t + px * w, s * L * t + py * w, 0, 0.04); }
    }
  }
  // ---------- the mill field ----------
  // a Kinderdijk mill, standing on its own patch of embankment in the water, sails toward the wind like all its neighbours.
  // nederwaard: a round brick ground sailer, the sails sweeping down to a metre off the ground; overwaard: octagonal and
  // thatched on a low brick foot. state: turning, at rest (plus or cross), or in mourning (the lower sail set just past the
  // middle, on the right, kept so a year and six weeks); lit: floodlit as in the lighting week. The mills are homes: a few
  // small windows lit
  let mc = 0;
  function mill(K, kind) {
    const M = mats(K), k = K.kit(), ks = K.kit(), g = new K.THREE.Group(), i = mc++, round = kind === 'nederwaard';
    const state = i % 16 === 5 ? 'mourn' : i % 4 === 0 ? 'turn' : i % 2 ? 'plus' : 'cross', lit = i % 8 === 2;
    const H = round ? 13.4 : 14.2, R0 = round ? 4.4 : 4.6, L = round ? 13.6 : 14.2, hubY = H + 1.0, hubZ = R0 * 0.72 + 0.9;
    K.kb(k, M.grass, 0, -0.2, 0, 13, 0.7, 13);   // the patch of land it stands on, just above the water
    if (round) K.kadd(k, M.round, K.brickMat(0x4e352d), 0, 0, 0, 0, 0, 0, R0, H, R0);
    else { K.kadd(k, M.oct, K.brickMat(0x4a3830), 0, 0, 0, 0, Math.PI / 8, 0, R0 + 0.3, 1.6, R0 + 0.3); K.kadd(k, M.oct, M.thatch, 0, 1.6, 0, 0, Math.PI / 8, 0, R0, H - 1.6, R0); }
    K.kadd(k, M.dome, M.thatchDark, 0, H - 0.1, 0, 0, 0, 0, R0 * 0.75, 2.4, R0 * 0.85);   // the cap
    K.kb(k, M.thatchDark, 0, hubY - 0.1, hubZ - 1.2, 1.0, 1.0, 2.6);                     // the wind shaft's head
    K.kb(k, M.dark, 0, 1.15, R0 * 0.98 + 0.02, 1.1, 2.2, 0.08);                          // the door toward the sails
    for (const [y, a] of [[3.5, 0.6], [7.2, -0.9], [9.8, 2.2]]) {                            // small windows round the body, some lit
      const r = R0 * (1 - (y / H) * 0.3) + 0.04, on = Math.random() < 0.45, x = Math.sin(a) * r, z = Math.cos(a) * r;
      K.kadd(k, K.PG['win' + (on ? 0 : 4)], K.PM.winAtlas, x, y, z, 0, a, 0, 0.75, 0.95);
      if (on) K.kadd(k, M.q.warm, M.glow, x * 1.03, y, z * 1.03, 0, a, 0, 1.8, 1.8, 1);
    }
    K.kb(k, M.sail, 0.0, hubY - H * 0.45, -R0 - 1.3, 0.14, H * 0.9, 0.14, -0.35, 0, 0);    // the tail pole down to the ground behind
    if (lit) {   // floodlit: its body washed with warm light from the ground, two lamps in the grass
      for (const a of [0, -Math.PI / 2, Math.PI / 2]) K.kadd(k, M.q.wash, M.glow, Math.sin(a) * (R0 + 0.3), H * 0.45, Math.cos(a) * (R0 + 0.3), 0, a, 0, R0 * 3.2, H * 1.4, 1);
      for (const s of [-1, 1]) { lamp(K, k, 'warm', s * 3.5, 0.4, R0 + 2.5, 1.6); K.kadd(k, M.q.beam, M.glow, s * 2.4, H * 0.42, R0 + 1.6, 0, 0, Math.PI - s * 0.18, 4.5, H * 0.9, 1); }
    }
    K.kbuild(k, g);
    const a0 = state === 'mourn' ? -Math.PI / 2 + 0.2 : state === 'cross' ? Math.PI / 4 : 0;
    sails(K, ks, lit ? M.sailLit || (M.sailLit = Object.assign(K.Mat({ color: 0x9a8a6c, emissive: 0x3a3020, emissiveIntensity: 1 }), { userData: { shared: true } })) : M.sail, L, L * 0.17, state === 'turn' ? Math.random() * 6 : a0);
    const b = K.kbuild(ks); b.position.set(0, hubY, hubZ); g.add(b);
    if (state === 'turn') { g.userData.blades = b; g.userData.spin = -K.rnd(0.25, 0.4); }
    return g;
  }
  // the cradle of the 1421 flood, afloat on the boezem, the cat on its rim keeping it level, eyes alight
  function cradle(K) {
    const M = mats(K), k = K.kit();
    K.kb(k, K.M.wood, 0, 0.12, 0, 0.62, 0.36, 1.05); K.kadd(k, M.dome, K.M.wood, 0, 0.3, 0.32, 0, 0, 0, 0.34, 0.38, 0.22);
    for (const z of [-0.42, 0.42]) K.kb(k, K.M.wood, 0, -0.05, z, 0.8, 0.08, 0.06);
    K.kb(k, K.PM.pole, 0.24, 0.42, -0.25, 0.18, 0.26, 0.22); K.kadd(k, K.KG.ball, K.PM.pole, 0.24, 0.62, -0.32, 0, 0, 0, 0.17, 0.16, 0.17);
    for (const s of [-1, 1]) { K.kb(k, K.PM.pole, 0.24 + s * 0.05, 0.72, -0.3, 0.035, 0.08, 0.03); K.kadd(k, K.KG.ball, K.PM.eyeGlow, 0.24 + s * 0.04, 0.63, -0.4, 0, 0, 0, 0.035, 0.035, 0.035); }
    K.ktube(k, K.PM.pole, 0.24, 0.32, -0.12, 0.28, 0.2, 0.25, 0.025);
    lamp(K, k, 'warm', 0.24, 0.63, -0.42, 0.5, 0, 2.5);
    const g = K.kbuild(k); g.rotation.y = Math.random() * 6; return g;
  }
  // a reed bed along the water: crossed reed cards in one kit
  function reedBank(K) {
    const M = mats(K), k = K.kit();
    for (let i = 0; i < 11; i++) { const x = K.rnd(0.3, 2.6), z = -11 + i * 2.1 + K.rnd(-0.6, 0.6), sx = K.rnd(2.4, 3.4), sy = K.rnd(1.6, 2.5), ry = K.rnd(-0.3, 0.3); for (const d of [-0.62, 0.62]) K.kadd(k, K.PG.reedCard, M.reed, x, WATER - 0.12, z, 0, ry + d, 0, sx, sy, 1); }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function bank(K) {   // the embankment's flank, from the path down into the water
    const M = mats(K), k = K.kit(); K.kb(k, M.grass, 0.86, -0.73, 0, 2.83, 0.2, 24.6, 0, 0, -0.407);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function farWater(K) {   // the water beyond the ribbon, out into the haze
    const g = new K.THREE.Group(), m = new K.THREE.Mesh(new K.THREE.PlaneGeometry(182, 214), K.M.water); m.rotation.x = -Math.PI / 2; g.add(m); return g;
  }
  // ---------- Dordrecht ----------
  function solid(THREE, P, tris, c) {   // triangles turned to face away from the inside point c; flat normals, uvs filled by the kit
    const pos = [];
    for (const t of tris) {
      const a = P[t[0]]; let b = P[t[1]], d = P[t[2]];
      const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const m = [(a[0] + b[0] + d[0]) / 3 - c[0], (a[1] + b[1] + d[1]) / 3 - c[1], (a[2] + b[2] + d[2]) / 3 - c[2]];
      if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] < 0) { const q = b; b = d; d = q; }
      pos.push(...a, ...b, ...d);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
    geo.computeVertexNormals(); return geo;
  }
  function saddle(K) {   // a saddle roof on a unit base, the ridge along x (from the street to the back), one high
    return MT.saddle || (MT.saddle = solid(K.THREE, [[-0.5, 0, -0.5], [0.5, 0, -0.5], [0.5, 0, 0.5], [-0.5, 0, 0.5], [-0.5, 1, 0], [0.5, 1, 0]],
      [[0, 1, 5], [0, 5, 4], [3, 4, 5], [3, 5, 2], [0, 4, 3], [1, 2, 5]], [0, 0.3, 0]));
  }
  function signTex(K, names) {   // the shop names in gold on dark green boards, one canvas for a row of three
    const c = document.createElement('canvas'); c.width = 1536; c.height = 128; const g = c.getContext('2d');
    names.forEach((n, i) => {
      const x0 = i * 512; g.fillStyle = '#15241b'; g.fillRect(x0 + 6, 8, 500, 112); g.strokeStyle = '#a88a48'; g.lineWidth = 5; g.strokeRect(x0 + 14, 15, 484, 98);
      g.fillStyle = '#e8cc80'; g.font = 'bold 54px Georgia, "Times New Roman", serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(n, x0 + 256, 66, 456);
    });
    const t = new K.THREE.CanvasTexture(c); t.colorSpace = K.THREE.SRGBColorSpace; return t;
  }
  function boardGeo(K, i) {   // a unit board showing the i-th third of a sign canvas
    MT.boards = MT.boards || [0, 1, 2].map(j => { const p = new K.THREE.PlaneGeometry(1, 1), uv = p.attributes.uv; for (let q = 0; q < uv.count; q++) uv.setX(q, (j + uv.getX(q)) / 3); return p; });
    return MT.boards[i];
  }
  // three merchant houses with Dordtse gables: stepped, every step capped in white stone, round white arches over the cross
  // windows (two a floor), shutters on the lower lights, white bands between the floors. shops: the ground floor a shop with
  // its name on a board; far: the row across the harbour, its quay wall and lit windows mirrored in the water. Front on -x
  function dordtRow(K, X, o) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), fx = (o.fx || 8.0) - X, w = 6.1, names = [], yaw = -Math.PI / 2;
    if (o.far) { K.kb(k, M.quay, fx - 1.6, -0.75, 0, 3.4, 1.5, 3 * w + 0.4); K.kb(k, M.stone, fx - 3.25, 0.02, 0, 0.3, 0.14, 3 * w + 0.4); }
    for (let i = 0; i < 3; i++) {
      const zc = -w + i * w, plaster = Math.random() < 0.22, wall = plaster ? M.white : K.brickMat(K.pick(BRICK)), floors = K.pick([3, 3, 4]), fh = 3.1, H = floors * fh + 0.3, d = K.rnd(10, 13), gh = K.rnd(5.2, 6.8);
      K.kb(k, wall, fx + d / 2, H / 2, zc, d, H, w - 0.04);
      K.kadd(k, saddle(K), K.PM.roof, fx + d / 2 + 0.4, H - 0.05, zc, 0, 0, 0, d - 0.6, gh - 0.3, w - 0.2);
      for (let s = 0; s < 5; s++) {
        const sw = w * (1 - s / 5) - 0.08, y0 = H + s * gh / 5;
        K.kb(k, wall, fx + 0.25, y0 + gh / 10, zc, 0.5, gh / 5, sw); K.kb(k, M.white, fx + 0.2, y0 + gh / 5, zc, 0.6, 0.13, sw + 0.12);
      }
      K.kb(k, M.white, fx + 0.25, H + gh + 0.45, zc, 0.22, 0.9, 0.22);
      for (const dz of [-1.2, 1.2]) { K.kadd(k, M.half, M.white, fx - 0.02, H + 1.3, zc + dz, 0, yaw, 0, 1.6, 1.6, 1); K.kadd(k, M.half, M.red, fx - 0.04, H + 1.33, zc + dz, 0, yaw, 0, 1.2, 1.2, 1); }
      const lit0 = Math.random() < 0.35; K.kadd(k, K.PG['win' + (lit0 ? 1 : 4)], K.PM.winAtlas, fx - 0.015, H + 0.6, zc, 0, yaw, 0, 0.9, 1.1);
      for (let f = 0; f < floors; f++) {
        const y = f * fh + 1.75;
        if (f) K.kb(k, M.white, fx - 0.05, f * fh + 0.08, zc, 0.12, 0.14, w - 0.04);
        if (o.shops && f === 0) {
          const name = K.pick(SHOPS); names.push(name);
          K.kadd(k, K.PG['shop' + (name === 'CAFÉ' ? 1 : 0)], K.PM.winAtlas, fx - 0.02, 1.35, zc - 0.55, 0, yaw, 0, 3.7, 2.1);
          K.kadd(k, M.q.panel, M.glow, fx - 0.1, 1.4, zc - 0.55, 0, yaw, 0, 4.6, 3.0, 1); K.kadd(k, M.q.warm, M.glow, fx - 1.4, 0.09, zc - 0.55, -Math.PI / 2, 0, 0, 3.6, 2.4, 1);
          K.kb(k, M.green, fx - 0.03, 1.1, zc + 2.25, 0.06, 2.2, 0.95);
          continue;
        }
        if (f === 0 && !o.far) { K.kb(k, M.green, fx - 0.03, 1.15, zc, 0.06, 2.3, 1.0); K.kb(k, M.stone, fx - 0.3, 0.12, zc, 0.6, 0.24, 1.4); }
        for (const dz of f === 0 && !o.far ? [-1.85, 1.85] : [-1.45, 1.45]) {
          const wz = zc + dz, r = Math.random(), lit = r < (o.far ? 0.3 : 0.36);
          K.kadd(k, K.PG['win' + (lit ? K.pick([0, 1, 2]) : r < 0.5 ? 3 : K.pick([4, 5]))], K.PM.winAtlas, fx - 0.015, y, wz, 0, yaw, 0, 1.2, 1.85);
          K.kadd(k, M.half, M.white, fx - 0.02, y + 0.92, wz, 0, yaw, 0, 1.5, 1.5, 1); K.kadd(k, M.half, M.red, fx - 0.035, y + 0.95, wz, 0, yaw, 0, 1.1, 1.1, 1);
          if (lit) { K.kadd(k, M.q.warm, M.glow, fx - 0.09, y, wz, 0, yaw, 0, 2.7, 2.9, 1); if (o.far) K.kadd(k, M.q.sWarm, M.glow, fx - 4, HARBOUR + 0.03, wz, -Math.PI / 2, 0, Math.PI / 2, 1.1, 6.5, 1); }
          else if (!o.far && Math.random() < 0.5) K.kb(k, Math.random() < 0.5 ? M.red : M.green, fx - 0.04, y - 0.45, wz, 0.06, 0.9, 1.2);
        }
      }
    }
    if (o.shops) for (let i = 0; i < 3; i++) K.kadd(k, boardGeo(K, i), MT.signBase, fx - 0.08, 3.0, -w + i * w - 0.4, 0, yaw, 0, 4.4, 0.62, 1);
    if (o.shops) {   // the boards share one canvas, made for this row and cleaned up with it
      const sm = new K.THREE.MeshBasicMaterial({ map: signTex(K, names) });
      const list = k.get(MT.signBase); k.delete(MT.signBase); k.set(sm, list);
      K.kbuild(k, g); g.traverse(m => { if (m.isMesh && m.material === sm) m.userData.ownTex = true; });
    } else K.kbuild(k, g);
    g.userData.faceRoad = true; return g;
  }
  // the tower of the Grote Kerk: 65 m of grey tuff, stubby, never finished and capped in 1626 with four clock faces, leaning
  // 2.25 m; corner buttresses, tall louvred openings, a balustrade and four small turrets on the flat top; floodlit, the
  // clocks lit; scaffolding up the face toward the road (it is there until the end of 2026); the long church behind it
  function groteToren(K) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), W = 15, lean = new K.THREE.Matrix4().makeRotationZ(0.035), at = f => k.base.makeRotationY(f * Math.PI / 2).premultiply(lean);
    at(0);
    K.kb(k, M.tuff, 0, 15, 0, W, 30, W); K.kb(k, M.tuff, 0, 39, 0, W - 1.6, 18, W - 1.6); K.kb(k, M.tuff, 0, 54, 0, W - 2.6, 12, W - 2.6);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.kb(k, M.tuff, sx * (W / 2 + 0.3), 14, sz * (W / 2 + 0.3), 2.0, 28, 2.0);
    for (const y of [30.2, 48.2, 60.2]) K.kb(k, M.stone, 0, y, 0, W - (y > 50 ? 2 : y > 40 ? 1 : 0) + 0.3, 0.5, W - (y > 50 ? 2 : y > 40 ? 1 : 0) + 0.3);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { K.kadd(k, M.oct8, M.tuff, sx * 5.6, 60.4, sz * 5.6, 0, 0, 0, 0.9, 2.2, 0.9); K.kadd(k, M.cone8, K.PM.roof, sx * 5.6, 62.6, sz * 5.6, 0, 0, 0, 1.0, 2.6, 1.0); }
    for (let f = 0; f < 4; f++) {
      at(f); const h1 = (W - 1.6) / 2, h2 = (W - 2.6) / 2;
      for (const z of [-3, 3]) { K.kb(k, M.dark, -h1 - 0.02, 39, z, 0.06, 11, 1.8); K.kb(k, M.dark, -h1 - 0.02, 44.5, z, 0.06, 1.27, 1.27, Math.PI / 4, 0, 0); for (let i = 0; i < 9; i++) K.kb(k, M.stone, -h1 - 0.08, 34.5 + i * 1.1, z, 0.08, 0.12, 1.7); }
      K.kb(k, M.dark, -W / 2 - 0.02, 16, 0, 0.06, 13, 3.2); K.kb(k, M.dark, -W / 2 - 0.02, 22.5, 0, 0.06, 2.26, 2.26, Math.PI / 4, 0, 0);
      K.kadd(k, K.KG.disc, K.PM.bulb, -h2 - 0.03, 54.3, 0, 0, -Math.PI / 2, 0, 7.5, 7.5, 1); K.kadd(k, M.q.warm, M.glow, -h2 - 0.2, 54.3, 0, 0, -Math.PI / 2, 0, 8, 8, 1);
      K.kb(k, M.dark, -h2 - 0.07, 55.0, 0.25, 0.04, 1.7, 0.2, 0.35, 0, 0); K.kb(k, M.dark, -h2 - 0.07, 53.9, -0.45, 0.04, 0.18, 1.3, 0.9, 0, 0);
      K.kadd(k, M.q.wash, M.glow, -W / 2 - 0.7, 22, 0, 0, -Math.PI / 2, 0, W * 1.6, 44, 1);
    }
    at(0);   // the scaffolding up the face toward the road
    for (let i = 0; i < 7; i++) K.kb(k, K.PM.pole, -W / 2 - 1.6, 21, -7.5 + i * 2.5, 0.1, 42, 0.1);
    for (let j = 0; j < 21; j++) for (const x of [-W / 2 - 1.6, -W / 2 - 0.4]) K.kb(k, K.PM.pole, x, 0.6 + j * 2, 0, 0.08, 0.08, 15.5);
    k.base.identity();   // the church behind it does not lean
    K.kb(k, M.tuff, W / 2 + 30, 11, 0, 60, 22, 22); K.kadd(k, saddle(K), K.PM.roof, W / 2 + 30, 21.9, 0, 0, 0, 0, 60, 13, 23);
    for (let i = 0; i < 6; i++) { const x = W / 2 + 6 + i * 9; for (const s of [-1, 1]) { K.kb(k, K.PM.window, x, 9, s * 11.03, 2.2, 8, 0.05); K.kadd(k, M.q.warm, M.glow, x, 9, s * 11.2, 0, 0, 0, 4.5, 10, 1); } }
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }
  // the Damiatebrug (1855): an iron double drawbridge across the harbour, a portal over each leaf with its balance beams,
  // lanterns on the posts. From the quay edge (x 0) to the far quay
  function damiate(K) {
    const M = mats(K), k = K.kit(), L = 26;
    K.kb(k, K.M.wood, L / 2, 0.15, 0, L, 0.25, 4.6); for (const s of [-1, 1]) K.kb(k, M.iron, L / 2, -0.35, s * 2.1, L, 0.7, 0.25);
    for (const x of [1.0, 9.5, 16.5, 25]) K.kb(k, M.quay, x, (HARBOUR - 1.2) / 2, 0, 1.2, 1.4 - HARBOUR, 5);
    for (const s of [-1, 1]) { K.kb(k, M.iron, L / 2, 1.1, s * 2.25, L, 0.08, 0.08); for (let x = 0.5; x < L; x += 1.0) K.kb(k, M.iron, x, 0.65, s * 2.25, 0.05, 0.9, 0.05); }
    for (const [px, dir] of [[9.6, 1], [16.4, -1]]) {
      for (const s of [-1, 1]) { K.kb(k, M.iron, px, 3.5, s * 2.6, 0.34, 6.9, 0.34); lamp(K, k, 'warm', px, 7.3, s * 2.6, 1.3, HARBOUR, 6); }
      K.kb(k, M.iron, px, 6.75, 0, 0.36, 0.42, 5.6);
      for (const s of [-1, 1]) { K.ktube(k, M.iron, px - dir * 4.6, 5.2, s * 2.3, px + dir * 4.0, 8.1, s * 2.3, 0.14); K.ktube(k, M.iron, px - dir * 2, 6.1, s * 2.3, px + dir * 2, 7.45, s * 2.3, 0.07); K.ktube(k, M.iron, px + dir * 3.9, 8.0, s * 2.3, px + dir * 3.5, 0.4, s * 2.3, 0.03); }
      K.kb(k, M.iron, px - dir * 4.7, 5.15, 0, 0.5, 0.5, 4.9); K.kb(k, M.iron, px + dir * 4.0, 8.05, 0, 0.18, 0.18, 4.8);
    }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // a sailing barge moored for the night: round-bowed hull, leeboards, the tall mast, the tan sail furled on its boom, a lit
  // porthole in the deckhouse, the anchor light at the masthead
  function tjalk(K) {
    const M = mats(K), k = K.kit(), L = K.rnd(16, 22), mh = K.rnd(13, 17), mz = -L * 0.18;
    K.kb(k, M.hull, 0, 0.1, 0.6, 4.2, 1.4, L - 3); K.kb(k, M.hull, 0, 0.25, -L / 2 + 1.2, 3.2, 1.5, 2.5); K.kb(k, M.hull, 0, 0.35, -L / 2 - 0.3, 1.8, 1.4, 1.2);
    K.kb(k, K.M.wood, 0, 0.82, 0.6, 4.3, 0.1, L - 2.6);
    for (const s of [-1, 1]) K.kb(k, K.M.wood, s * 2.2, 0.0, -L * 0.12, 0.12, 2.2, 1.3, 0, 0, s * 0.15);
    K.kb(k, K.M.wood, 0, 1.25, L * 0.3, 2.6, 0.9, 3.2);
    for (const s of [-1, 1]) { K.kadd(k, K.KG.disc, K.PM.window, s * 1.31, 1.25, L * 0.3, 0, s * Math.PI / 2, 0, 0.8, 0.8, 1); K.kadd(k, M.q.warm, M.glow, s * 1.4, 1.25, L * 0.3, 0, Math.PI / 2, 0, 1.2, 1.2, 1); }
    K.kadd(k, K.KG.cyl, K.M.wood, 0, mh / 2 + 0.8, mz, 0, 0, 0, 0.26, mh, 0.26);
    K.ktube(k, K.M.wood, 0, 2.6, mz, 0, 3.3, L * 0.32, 0.09); K.ktube(k, M.red, 0, 2.95, mz + 0.4, 0, 3.6, L * 0.3, 0.3);
    K.ktube(k, K.PM.pole, 0, mh + 0.6, mz, 0, 1.0, -L / 2 - 0.5, 0.025); K.ktube(k, K.PM.pole, 0, mh + 0.6, mz, 0, 1.2, L / 2, 0.025);
    lamp(K, k, 'warm', 0, mh + 1.0, mz, 0.9);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function quayWall(K) {   // the harbour's quay wall under the pavement edge, granite on top, bollards, an iron ring
    const M = mats(K), k = K.kit();
    K.kb(k, M.quay, 2.75, (HARBOUR - 0.6) / 2, 0, 0.3, 0.7 - HARBOUR, 24.6); K.kb(k, M.stone, 2.6, 0.1, 0, 0.5, 0.14, 24.6);
    for (const z of [-8, 0, 8]) { K.kadd(k, K.KG.cyl, M.iron, 2.3, 0.45, z, 0, 0, 0, 0.36, 0.7, 0.36); K.kadd(k, K.KG.ball, M.iron, 2.3, 0.82, z, 0, 0, 0, 0.42, 0.25, 0.42); }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // the Groothoofdspoort on the quay where the rivers meet: the gate with its arch, white stone bands, the octagonal drum, the
  // lead dome of 1692 with its lantern, lit
  function groothoofd(K) {
    const M = mats(K), k = K.kit(), b = K.brickMat(0x5c3c30);
    K.kb(k, b, 4.5, 6.5, 0, 9, 13, 15); K.kadd(k, saddle(K), K.PM.roof, 4.5, 12.95, 0, 0, Math.PI / 2, 0, 15.4, 3.2, 9.4);
    K.kb(k, M.dark, -0.02, 2.7, 0, 0.06, 5.4, 4.2); K.kadd(k, M.half, M.dark, -0.03, 5.4, 0, 0, -Math.PI / 2, 0, 4.2, 4.2, 1); K.kadd(k, M.half, M.stone, -0.01, 5.4, 0, 0, -Math.PI / 2, 0, 5.2, 5.2, 1);
    for (const y of [6.9, 12.8]) K.kb(k, M.stone, -0.05, y, 0, 0.14, 0.3, 15);
    for (const dz of [-5, 5]) for (const y of [3.4, 9.6]) { const lit = Math.random() < 0.6; K.kadd(k, K.PG['win' + (lit ? 0 : 4)], K.PM.winAtlas, -0.015, y, dz, 0, -Math.PI / 2, 0, 1.2, 1.8); if (lit) K.kadd(k, M.q.warm, M.glow, -0.1, y, dz, 0, -Math.PI / 2, 0, 2.6, 2.8, 1); }
    K.kadd(k, M.oct8, b, 4.5, 14, 0, 0, Math.PI / 8, 0, 3.5, 3.6, 3.5); K.kadd(k, M.dome, M.lead, 4.5, 17.5, 0, 0, 0, 0, 3.7, 3.4, 3.7);
    K.kadd(k, M.oct8, M.lead, 4.5, 20.6, 0, 0, Math.PI / 8, 0, 0.9, 2.0, 0.9); K.kadd(k, M.dome, M.lead, 4.5, 22.5, 0, 0, 0, 0, 1.0, 0.9, 1.0); K.kb(k, K.PM.pole, 4.5, 24.2, 0, 0.1, 2.2, 0.1);
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; K.kadd(k, M.q.panel, M.glow, 4.5 + Math.sin(a) * 0.95, 21.6, Math.cos(a) * 0.95, 0, a, 0, 0.8, 1.4, 1); }
    K.kadd(k, M.q.wash, M.glow, -0.6, 8, 0, 0, -Math.PI / 2, 0, 20, 18, 1); K.kadd(k, M.q.wash, M.glow, 1.2, 17, 0, 0, -Math.PI / 2, 0, 9, 9, 1);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function festoon(K) {   // a string of bulbs over a café terrace, between two poles at the kerb and the facade
    const M = mats(K), k = K.kit();
    for (const z of [-5, 5]) K.kb(k, K.PM.pole, 0, 1.6, z, 0.07, 3.2, 0.07);
    for (let i = 0; i <= 10; i++) { const t = i / 10, z = -5 + t * 10, y = 3.1 - Math.sin(t * Math.PI) * 0.55; lamp(K, k, 'warm', 0, y, z, 0.55); }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // ships under way where the rivers meet (the same trick as on the Noord: a slow circle out on the water about a pivot)
  function barge(K, k, x, z, ry, convoy) {
    kat(K, k, x, 0, z, ry); const M = MT;
    K.kb(k, M.hull, 0, 0.2, 0, convoy ? 10 : 8, 2, convoy ? 40 : 36); K.kb(k, M.quay, 0, 2.3, 14, 6.5, 2.2, 6); K.kb(k, M.quay, 0, 4.4, 13, 4.2, 2, 3.6);
    for (const s of [-1, 1]) K.kadd(k, M.q.band, M.glow, s * 2.13, 4.5, 13, 0, Math.PI / 2, 0, 3.2, 1.1, 1);
    K.kadd(k, M.q.band, M.glow, 0, 4.5, 11.18, 0, 0, 0, 3.8, 1.1, 1);
    lamp(K, k, 'cold', 0, 6.6, 13, 2.4, 0, 12); lamp(K, k, 'red', -2.3, 5.7, 11.6, 2.2, 0, 9); lamp(K, k, 'green', 2.3, 5.7, 11.6, 2.2, 0, 9);
    lamp(K, k, 'cold', 0, 5.6, -17, 2.6, 0, 12); lamp(K, k, 'warm', 3, 2.2, 15.5, 1.6);
  }
  function shipRing(K) {
    mats(K); const { THREE } = K, root = new THREE.Group(), pivot = new THREE.Group(), blades = new THREE.Group(), up = new THREE.Group(), R = 70, dir = Math.random() < 0.5 ? 1 : -1, k = K.kit();
    for (let i = 0; i < 3; i++) { const a = (i + 0.5) / 3 * Math.PI * 2; barge(K, k, -R * Math.cos(a), R * Math.sin(a), a + (dir > 0 ? Math.PI : 0), i === 1); }
    K.kbuild(k, up); up.rotation.x = Math.PI / 2; blades.add(up); blades.rotation.z = Math.random() * Math.PI * 2;
    pivot.rotation.x = -Math.PI / 2; pivot.position.x = R; pivot.add(blades); root.add(pivot);
    root.userData.blades = blades; root.userData.spin = dir * 0.05; root.userData.faceRoad = true; return root;
  }
  // ---------- the dead: millers ----------
  function dmats(K) {
    if (DM) return DM;
    const { THREE, Mat } = K, keep = m => { m.userData.shared = true; return m; };
    DM = { smock: keep(Mat({ color: 0x3a4250 })), dusty: keep(Mat({ color: 0x8a8a84 })), cap: keep(Mat({ color: 0x15161a })), scarf: keep(Mat({ color: 0x8a2a24 })),
      clog: keep(Mat({ color: 0x9a8460 })), sack: keep(Mat({ color: 0xcdc6b2 })), pipe: keep(Mat({ color: 0x2a1c14 })), tail: new THREE.CylinderGeometry(0.24, 0.36, 1, 8) };
    return DM;
  }
  function miller(k, b, K, D, coat) {   // the smock to the thighs, the black cap with its peak, a red neckerchief, clogs
    const [x, y, z] = b.hd;
    K.ktube(k, coat, ...b.hip, ...b.sh, 0.2); K.kadd(k, D.tail, coat, 0, 0.82, 0.02, -0.12, 0, 0, 1, 0.5, 1);
    for (const sx of [-1, 1]) { K.ktube(k, coat, sx * 0.25, b.sh[1], b.sh[2], sx * 0.28, 1.16, -0.48, 0.08); K.kb(k, D.clog, sx * 0.127, 0.06, -0.03, 0.15, 0.12, 0.34); }
    K.kadd(k, K.KG.dome, D.cap, x, y + 0.07, z + 0.02, -0.25, 0, 0, 0.3, 0.2, 0.32); K.kb(k, D.cap, x, y + 0.08, z - 0.17, 0.24, 0.025, 0.12, -0.25, 0, 0);
    K.kadd(k, K.KG.cyl, D.scarf, b.sh[0], b.sh[1] + 0.02, b.sh[2] - 0.08, 0.6, 0, 0, 0.26, 0.07, 0.2);
  }
  const dress = {
    kd_molenaar(k, b, K) { const D = dmats(K); miller(k, b, K, D, D.smock); K.ktube(k, D.pipe, b.hd[0] + 0.03, b.hd[1] - 0.12, b.hd[2] - 0.12, 0.05, b.hd[1] - 0.2, b.hd[2] - 0.3, 0.015); },
    kd_meelzak(k, b, K) {   // dusted white, a sack of flour on his back
      const D = dmats(K); miller(k, b, K, D, D.dusty);
      K.kadd(k, K.KG.ball, D.sack, 0, 1.55, 0.12, 0.5, 0, 0, 0.62, 0.78, 0.5); K.kb(k, D.sack, 0, 1.9, 0.26, 0.2, 0.12, 0.16, 0.5, 0, 0);
    },
  };

  // ---------- the streets ----------
  const fp = K => K.fingerpost(SIGNS.slice().sort(() => Math.random() - 0.5).slice(0, 3));
  const lantern = K => K.lamppost();
  const glowsDordt = [{ az: 55, el: 0.5, w: 80, h: 12, color: 0xd9c6a8, a: 0.26 }, { az: -35, el: 0.5, w: 50, h: 8, color: 0xf0b888, a: 0.15 }];
  const themes = {
    // Kinderdijk: the path on the embankment between the two rows of mills, water on both sides, reeds, no lamps at all
    dyke: base => Object.assign({}, base, {
      fog: 0x434c56, fogD: 0.0115, night: 0.15, open: true, ground: 0x0b1015, groundY: WATER - 0.1, canal: 1, water: 0x26313c, waterY: WATER, waterK: 0.42,
      curv: 0.0012, verge: 'grass', landmark: false, road: { kind: 'slabs', tone: '#2f3337', lines: false },
      sky: { stars: 360, clouds: 0.5, glows: [{ az: 40, el: 0.5, w: 80, h: 12, color: 0xd9c6a8, a: 0.3 }, { az: -60, el: 0.5, w: 50, h: 8, color: 0xf0b888, a: 0.16 }] },
      spawn: [
        { make: K => mill(K, 'nederwaard'), n: 8, gap: 50, side: 'left', xr: [21, 33], y: WATER, r: 7.5 },
        { make: K => mill(K, 'overwaard'), n: 8, gap: 50, reg: true, side: 'right', xr: [37, 37], y: WATER, r: 7.5 },
        { make: reedBank, n: 10, gap: 22, reg: true, side: 'left', xr: [5.4, 5.4], r: 0.5 }, { make: reedBank, n: 10, gap: 22, reg: true, side: 'right', xr: [5.4, 5.4], r: 0.5 },
        { make: bank, n: 9, gap: 24, reg: true, side: 'left', xr: [5.3, 5.3], r: 0.5 }, { make: bank, n: 9, gap: 24, reg: true, side: 'right', xr: [5.3, 5.3], r: 0.5 },
        { make: farWater, n: 2, gap: 210, side: 'left', xr: [99, 99], y: WATER - 0.03, r: 0.5 }, { make: farWater, n: 2, gap: 210, side: 'right', xr: [112, 112], y: WATER - 0.03, r: 0.5 },
        { make: cradle, n: 1, gap: 260, side: 'right', xr: [10, 13], y: WATER, r: 1.5 },
        { make: K => K.treeCard([3, 2, 3]), n: 5, gap: 60, side: 'both', xr: [14, 18], y: WATER, r: 0.9 },
        { make: fp, n: 1, gap: 220, side: 'left', xr: [4.7, 4.7], r: 0.5 },
        { make: 'zombieWalk', n: 4, gap: 45, side: 'both', xr: [4.8, 5.1], r: 0.6 } ],
    }),
    // Dordrecht, the Wolwevershaven: the cobbled quay, merchant houses with Dordtse gables, sailing barges moored, the
    // Damiatebrug across the harbour, the houses of the far quay in the water, the Grote Kerk over the roofs
    street: base => Object.assign({}, base, {
      fog: 0x4a525c, fogD: 0.0155, night: 0.17, ground: 0x10151a, groundY: HARBOUR - 0.4, canal: 1, water: 0x141b24, waterY: HARBOUR, waterK: 0.3,
      curv: 0.0016, verge: 'tiles', lmX: [31, 34], lmSide: 'left', road: { kind: 'cobbles', tone: '#3e3a3a' }, sky: { stars: 100, clouds: 0.85, glows: glowsDordt },
      spawn: [
        { make: K => dordtRow(K, 9.5, {}), n: 8, gap: 18.6, reg: true, side: 'left', xr: [9.5, 9.5], r: 9 },
        { make: K => dordtRow(K, 34, { far: true, fx: 33.6 }), n: 6, gap: 19, reg: true, side: 'right', xr: [34, 34], r: 9 },
        { make: damiate, n: 1, gap: 230, side: 'right', xr: [7.7, 7.7], r: 3.5 },
        { make: tjalk, n: 4, gap: 45, side: 'right', xr: [10.4, 11], y: HARBOUR, r: 11 },
        { make: tjalk, n: 2, gap: 90, side: 'right', xr: [27.5, 28.5], y: HARBOUR, r: 11 },
        { make: quayWall, n: 9, gap: 24, reg: true, side: 'right', xr: [4.95, 4.95], r: 0.5 },
        { make: lantern, n: 9, gap: 18, reg: true, side: 'left', xr: [4.7, 4.7] }, { make: lantern, n: 5, gap: 34, reg: true, side: 'right', xr: [4.7, 4.7] },
        { make: K => K.bench(), n: 2, gap: 80, side: 'right', xr: [5.4, 5.4], r: 0.9 }, { make: K => K.bikeRow(), n: 4, gap: 40, side: 'left', xr: [4.9, 5.0], r: 0.6 },
        { make: fp, n: 1, gap: 150, side: 'right', xr: [4.7, 4.7], r: 0.5 },
        { make: 'zombieWalk', n: 7, gap: 20, side: 'both', xr: [4.8, 5.4], r: 0.6 } ],
    }),
    // the Voorstraat: shops in the merchant houses on both sides, their names on boards, lanterns, the tower ahead
    shops: base => Object.assign({}, base, {
      fog: 0x4c535c, fogD: 0.016, night: 0.17, ground: 0x1b1f24, groundY: -0.05, canal: 0, curv: 0.002, lmX: [33, 36], lmSide: 'right',
      road: { kind: 'klinkers', tone: '#463935' }, sky: { stars: 80, clouds: 0.9, glows: glowsDordt },
      spawn: [
        { make: K => dordtRow(K, 8.2, { shops: true }), n: 8, gap: 18.6, reg: true, side: 'left', xr: [8.2, 8.2], r: 9 },
        { make: K => dordtRow(K, 8.2, { shops: true }), n: 8, gap: 18.6, reg: true, side: 'right', xr: [8.2, 8.2], r: 9 },
        { make: lantern, n: 12, gap: 13, reg: true, side: 'alt', xr: [4.7, 4.7] },
        { make: K => K.bikeRow(), n: 6, gap: 26, side: 'both', xr: [4.9, 5.0], r: 0.6 }, { make: K => K.crates(), n: 5, gap: 30, side: 'both', xr: [5.0, 5.2], r: 0.5 },
        { make: K => K.bins(), n: 3, gap: 50, side: 'both', xr: [5.0, 5.1], r: 0.5 }, { make: fp, n: 1, gap: 140, side: 'both', xr: [4.7, 4.7], r: 0.5 },
        { make: 'zombieWalk', n: 8, gap: 18, side: 'both', xr: [4.8, 5.4], r: 0.6 } ],
    }),
    // the Nieuwe Haven at night: cafés under strings of bulbs on the left, the harbour and its moored barges on the right
    nightshop: base => Object.assign({}, base, {
      fog: 0x3c4552, fogD: 0.017, night: 0.22, ground: 0x0f1318, groundY: HARBOUR - 0.4, canal: 1, water: 0x121820, waterY: HARBOUR, waterK: 0.28,
      curv: 0.002, verge: 'tiles', lmX: [31, 34], lmSide: 'left', road: { kind: 'cobbles', tone: '#3a3636' }, sky: { stars: 60, clouds: 0.9, glows: glowsDordt },
      spawn: [
        { make: K => dordtRow(K, 9.0, { shops: true }), n: 8, gap: 18.6, reg: true, side: 'left', xr: [9.0, 9.0], r: 9 },
        { make: festoon, n: 6, gap: 30, side: 'left', xr: [5.6, 5.6], r: 0.5 },
        { make: K => dordtRow(K, 34, { far: true, fx: 33.6 }), n: 6, gap: 19, reg: true, side: 'right', xr: [34, 34], r: 9 },
        { make: tjalk, n: 5, gap: 38, side: 'right', xr: [10.4, 11], y: HARBOUR, r: 10 },
        { make: quayWall, n: 9, gap: 24, reg: true, side: 'right', xr: [4.95, 4.95], r: 0.5 },
        { make: lantern, n: 8, gap: 18, reg: true, side: 'right', xr: [4.7, 4.7] },
        { make: K => K.bikeRow(), n: 5, gap: 28, side: 'left', xr: [4.9, 5.0], r: 0.6 }, { make: K => K.bench(), n: 3, gap: 60, side: 'right', xr: [5.4, 5.4], r: 0.9 },
        { make: 'zombieWalk', n: 9, gap: 16, side: 'both', xr: [4.8, 5.4], r: 0.6 } ],
    }),
    // the Groothoofd: the quay where the Merwede splits into the Noord and the Oude Maas, the gate with its dome beside the
    // road, the wide water full of ships, merchant houses on the town side
    square: base => Object.assign({}, base, {
      fog: 0x48515b, fogD: 0.0135, night: 0.16, open: true, ground: 0x0f1418, groundY: -2.0, canal: 1, water: 0x26313c, waterY: -1.6, waterK: 0.36,
      curv: 0.0012, verge: 'tiles', lmX: [31, 34], lmSide: 'left', road: { kind: 'cobbles', tone: '#3c3836' }, sky: { stars: 120, clouds: 0.8, glows: glowsDordt },
      spawn: [
        { make: groothoofd, n: 1, gap: 230, side: 'right', xr: [11, 11], r: 9 },
        { make: K => dordtRow(K, 9.5, {}), n: 8, gap: 18.6, reg: true, side: 'left', xr: [9.5, 9.5], r: 9 },
        { make: shipRing, n: 4, gap: 105, side: 'right', xr: [40, 40], y: -1.6, r: 0.5 },
        { make: farWater, n: 2, gap: 210, side: 'right', xr: [112, 112], y: -1.63, r: 0.5 },
        { make: quayWall, n: 9, gap: 24, reg: true, side: 'right', xr: [4.95, 4.95], r: 0.5 },
        { make: tjalk, n: 2, gap: 110, side: 'right', xr: [10.4, 11], y: -1.6, r: 11 },
        { make: lantern, n: 8, gap: 20, reg: true, side: 'alt', xr: [4.7, 4.7] },
        { make: K => K.bench(), n: 3, gap: 60, side: 'right', xr: [5.4, 5.4], r: 0.9 }, { make: fp, n: 1, gap: 150, side: 'right', xr: [4.7, 4.7], r: 0.5 },
        { make: 'zombieWalk', n: 6, gap: 28, side: 'both', xr: [5.0, 6.0], r: 0.6 } ],
    }),
  };

  // ---------- the far town on the horizon ----------
  const field = th => th && th.key === 'dyke';
  const skyline = {
    near(P, K, th) {
      if (field(th)) { P.trees(0, 0.3, 3, 7, 14); P.trees(0.7, 1, 3, 7, 14); for (let i = 0; i < 3; i++) P.mill(P.X(0.12 + i * 0.07), 22, 0.4 + i, 1); return; }
      P.roofs(0, 0.42, 9, 16, 0.14, ['step', 'step', 'roof', 'step']); P.roofs(0.58, 1, 9, 16, 0.14, ['step', 'roof', 'step']); P.trees(0.42, 0.58, 3, 6, 12);
    },
    mid(P, K, th) {
      if (field(th)) {   // the rows of mills going on into the haze on both sides, the pumping station's chimney
        for (let i = 0; i < 7; i++) P.mill(P.X(0.36 - i * 0.045), 24 - i * 2, 0.2 + i * 0.5, i % 3 ? 0 : 1);
        for (let i = 0; i < 7; i++) P.mill(P.X(0.62 + i * 0.045), 24 - i * 2, 0.6 + i * 0.4, i % 4 ? 0 : 1);
        P.box(P.X(0.53), 14, -5, 7); P.box(P.X(0.53) + 4 * P.m, 1.4, 7, 22); P.trees(0.44, 0.5, 3, 6, 10);
        return;
      }
      P.trees(0, 1, 6, 11, 12); P.roofs(0, 0.4, 9, 15, 0.1, ['step', 'roof']); P.roofs(0.7, 1, 9, 15, 0.1, ['step', 'roof']);
      const t = P.X(0.6);   // the Grote Kerk: the stubby square tower with its clock stage, leaning a little, the long church beside it
      P.box(t + 34 * P.m, 56, -5, 22); P.poly([[t + 6 * P.m, 22], [t + 34 * P.m, 33], [t + 62 * P.m, 22]]);
      P.poly([[t - 8 * P.m, -5], [t + 8 * P.m, -5], [t + 9.6 * P.m, 60], [t - 6.4 * P.m, 60]]); P.box(t + 1.6 * P.m, 13, 60, 62);
      for (const dx of [-5, 5]) P.poly([[t + (dx + 0.6) * P.m, 62], [t + (dx + 1.6) * P.m, 66], [t + (dx + 2.6) * P.m, 62]]);
      P.win(t + 1.3 * P.m, 54, 0.95, 3.6, 3.6); P.win(t + 0.7 * P.m, 39, 0.4, 1.2, 6);
      const gp = P.X(0.8); P.box(gp, 12, -5, 12); P.box(gp, 6, 12, 15); P.g.beginPath(); P.g.ellipse(gp, P.g.canvas.height - 20 * P.m, 3.2 * P.m, 3.4 * P.m, 0, Math.PI, 0); P.g.fill(); P.box(gp, 1, 18, 21);
      P.mill(P.X(0.3), 26, 0.3, 2);   // Kyck over den Dyck, the last mill in the town
    },
    far(P, K, th) {
      P.trees(0, 1, 4, 9, 9);
      if (field(th)) { const t = P.X(0.72); P.box(t, 9, -5, 44); P.box(t, 7, 44, 47); P.win(t, 40, 0.6, 1.5, 1.5); for (let i = 0; i < 5; i++) { const x = P.X(0.15 + i * 0.03), h = P.rr(24, 44); P.box(x, P.rr(5, 9), -5, h); } return; }
      for (let i = 0; i < 6; i++) P.mill(P.X(0.25 + i * 0.025), 16 - i, 0.4 + i * 0.7, 0);
      for (let i = 0; i < 3; i++) { const x = P.X(0.86 + i * 0.03); P.line(x, -5, x, 26, 0.8); P.line(x - 6 * P.m, 26, x + 20 * P.m, 26, 0.8); }
    },
  };

  T.kinderdijk = {
    style: { brick: BRICK, gables: 0.8, height: [9, 12], width: [5.6, 6.2], lamp: 'classic' },
    themes, skyline, shops: SHOPS, signs: SIGNS, extra: [],
    sky: { stars: 100, clouds: 0.85, glows: glowsDordt },
    light: { lamp: 0xffd9a8 },
    lamp: 'classic',
    landmark: groteToren,
    dead: { pool: ['kd_molenaar', 'kd_molenaar', 'kd_meelzak', 'kd_meelzak', 'clogs', 'plain'], dress },
  };
})();
