// Alblasserdam, the hero's home and the first chapter: a dike village on the tidal Noord.
// The road runs on the dike. On the river side the black water is full of moving ship lights (barges, push convoys, the
// Waterbus); the Oceanco superyacht yard stands on the foreshore with its pale halls and a navy blue hull beside the road,
// the container cranes of the terminal beyond it, and the steel arch of the 1939 Brug over de Noord crosses over the dike.
// On the polder side low 19th century dike houses with high hipped roofs step down into the black polder. The square is the
// Kerkplein under the 15th century Oude Toren; the night shops stand in the centre rebuilt after the bombing of 1940.
// White LED street light, no orange. Rotterdam glows to the northwest, Dordrecht to the southwest. The dead: women in Sunday
// hats and men in church black (the Bible belt), shipyard workers in navy overalls and white helmets.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  const RIVER = -1.8, POLDER = -3.0;   // the river stands higher than the polder behind the dike
  const BRICK = [0x5b3b31, 0x4c352f, 0x6a4a3d, 0x8f8c83, 0x7f7b70, 0x5b3b31, 0x9a978e];   // brown brick, and the white and cream painted ones
  const SHOPS = ['BAKKERIJ', 'SLAGERIJ', 'VISHANDEL', 'DROGIST', 'FIETSEN', 'BLOEMEN', 'NACHTWINKEL', 'KAPPER', 'CAFETARIA', 'BOEKHANDEL'];
  const SIGNS = ['Oude Toren', 'Kinderdijk', 'Waterbus', 'Werf', 'Brug', 'De Blokker', 'Cortgene', 'Polder'];
  let MT = null, DM = null;   // materials and unit shapes, made once on first use and kept for good (never disposed)
  const _v = {};

  // where the next kit parts go: at (x, y, z), turned by ry about the vertical (the game's own kat is not in the town kit)
  function kat(K, k, x, y, z, ry) {
    if (!_v.q) { const { THREE } = K; _v.q = new THREE.Quaternion(); _v.e = new THREE.Euler(); _v.p = new THREE.Vector3(); _v.s = new THREE.Vector3(1, 1, 1); }
    _v.e.set(0, ry || 0, 0); _v.q.setFromEuler(_v.e); _v.p.set(x, y, z); k.base.compose(_v.p, _v.q, _v.s); return k;
  }
  // every light of the town on one canvas, so a whole ship, yard or bridge of lights is one draw call. 8 x 2 cells of 128:
  // row 0: glows (cold LED, warm, red, green), a floodlight beam, a soft wash, a dim cold panel, lit office windows;
  // row 1: their broken reflections on the water, a band of lit windows, solid white, a dim warm panel, a hall's high windows
  function lightCanvas() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 256; const g = c.getContext('2d');
    const rgba = (rgb, a) => `rgba(${rgb},${a})`;
    ['226,236,255', '255,190,110', '255,60,46', '70,255,140'].forEach((rgb, i) => {
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
      const t = y / 127, hw = 5 + 57 * t, a = Math.pow(1 - t, 1.4) * 0.55, lg = g.createLinearGradient(576 - hw, 0, 576 + hw, 0);
      lg.addColorStop(0, 'rgba(230,238,255,0)'); lg.addColorStop(0.5, `rgba(230,238,255,${a})`); lg.addColorStop(1, 'rgba(230,238,255,0)');
      g.fillStyle = lg; g.fillRect(512, y, 128, 1);
    }
    { const r = g.createRadialGradient(704, 64, 0, 704, 64, 64); r.addColorStop(0, 'rgba(255,255,255,0.24)'); r.addColorStop(0.55, 'rgba(255,255,255,0.09)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(640, 0, 128, 128); }
    const panel = (cx, cy, rgb, a) => { g.save(); g.filter = 'blur(6px)'; g.fillStyle = rgba(rgb, a); g.fillRect(cx * 128 + 14, cy * 128 + 14, 100, 100); g.restore(); };
    panel(6, 0, '214,226,255', 0.42); panel(6, 1, '255,214,160', 0.5);
    { const lg = g.createLinearGradient(0, 128, 0, 256); lg.addColorStop(0, 'rgba(255,228,176,0)'); lg.addColorStop(0.28, 'rgba(255,228,176,0.9)'); lg.addColorStop(0.72, 'rgba(255,214,150,0.9)'); lg.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = lg; g.fillRect(514, 128, 124, 128); }
    g.fillStyle = '#fff'; g.fillRect(644, 132, 120, 120);
    let s = 9; const r = () => (s = s * 16807 % 2147483647) / 2147483647;
    for (const [row, rgb] of [[0, '255,206,140'], [1, '220,232,255']]) for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) {
      if (r() < 0.45) continue; g.fillStyle = rgba(rgb, 0.55 + r() * 0.4); g.fillRect(900 + i * 20, row * 128 + 10 + j * 30, 13, 18);
    }
    return c;
  }
  function aq(THREE, col, row) {   // a unit card showing one cell of the light canvas
    const p = new THREE.PlaneGeometry(1, 1), uv = p.attributes.uv, e = 0.01;
    for (let j = 0; j < uv.count; j++) uv.setXY(j, (col + e + uv.getX(j) * (1 - 2 * e)) / 8, (1 - row + e + uv.getY(j) * (1 - 2 * e)) / 2);
    return p;
  }
  // a closed shape from triangles, each turned to face away from the inside point c; flat normals, uvs filled by the kit
  function solidGeo(THREE, P, tris, c) {
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
  // a hipped roof on a unit base (x across, the ridge along z), one high; rf: the ridge as a share of the length
  function hipGeo(THREE, rf) {
    const r = rf / 2, P = [[-0.5, 0, -0.5], [0.5, 0, -0.5], [0.5, 0, 0.5], [-0.5, 0, 0.5], [0, 1, -r], [0, 1, r]];
    return solidGeo(THREE, P, [[0, 3, 5], [0, 5, 4], [1, 4, 5], [1, 5, 2], [0, 4, 1], [3, 2, 5]], [0, 0.25, 0]);
  }
  // a yacht's plan, pointed at the bow (-z), extruded upward: 1 wide, 1 long, 1 high, standing on y 0
  function hullGeo(THREE) {
    const s = new THREE.Shape(); s.moveTo(-0.5, 0); s.lineTo(0.5, 0); s.lineTo(0.5, 0.55); s.quadraticCurveTo(0.5, 0.88, 0, 1); s.quadraticCurveTo(-0.5, 0.88, -0.5, 0.55); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false, curveSegments: 6 });
    g.rotateX(-Math.PI / 2); g.translate(0, 0, 0.5); return g;
  }
  function mats(K) {
    if (MT) return MT;
    const { THREE, Mat, PM } = K, keep = m => { m.userData.shared = true; return m; };
    const lt = new THREE.CanvasTexture(lightCanvas());
    const tile = keep(Mat({ color: 0x4f3530, map: PM.roof.map })); tile.userData.wuv = 3.2;
    const Q = (c, r) => aq(THREE, c, r);
    MT = {
      glow: keep(K.GlowMat(lt, 0xffffff, 1, false, { side: THREE.DoubleSide })),
      q: { cold: Q(0, 0), warm: Q(1, 0), red: Q(2, 0), green: Q(3, 0), beam: Q(4, 0), wash: Q(5, 0), hall: Q(6, 0), office: Q(7, 0),
        sCold: Q(0, 1), sWarm: Q(1, 1), sRed: Q(2, 1), sGreen: Q(3, 1), band: Q(4, 1), solid: Q(5, 1), warmPanel: Q(6, 1), hallWin: Q(7, 1) },
      grass: keep(Mat({ color: 0x19221a })), rock: keep(Mat({ color: 0x23272c })), quay: keep(Mat({ color: 0x3a3f46 })),
      clad: keep(Mat({ color: 0xaab3bc })), navy: keep(Mat({ color: 0x163060, emissive: 0x06102a, emissiveIntensity: 1 })),
      white: keep(Mat({ color: 0xd2d8dd, emissive: 0x1a2027, emissiveIntensity: 1 })), steel: keep(Mat({ color: 0x4b5862 })),
      crane: keep(Mat({ color: 0x627684 })), dark: keep(new THREE.MeshBasicMaterial({ color: 0x0b0d12 })), green: keep(Mat({ color: 0x264a31 })),
      hull: keep(Mat({ color: 0x14171c })), deck: keep(Mat({ color: 0x2d3238 })), lampGrey: keep(Mat({ color: 0x6c7378 })),
      contA: keep(Mat({ color: 0x4e2b26 })), contB: keep(Mat({ color: 0x1f2d3e })), thatch: keep(Mat({ color: 0x3a3226 })),
      cream: keep(Mat({ color: 0xb8b2a2 })), tile,
      hip: hipGeo(THREE, 0.34), hipLong: hipGeo(THREE, 0.9), hipFarm: hipGeo(THREE, 0.55), hull3: hullGeo(THREE),
      oct: new THREE.ConeGeometry(1, 1, 8).translate(0, 0.5, 0), cone4: new THREE.ConeGeometry(1, 1, 4).translate(0, 0.5, 0),
    };
    return MT;
  }
  // the yard's name on its hall, lit: made once, shared by every yard
  function signMat(K) {
    if (MT.sign) return MT.sign;
    const c = document.createElement('canvas'); c.width = 1024; c.height = 160; const g = c.getContext('2d');
    g.font = 'bold 116px "Segoe UI", system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = 'rgba(150,180,255,0.9)'; g.shadowBlur = 16; g.fillStyle = '#e2eaff';
    const word = 'OCEANCO'; for (let i = 0; i < word.length; i++) g.fillText(word[i], 512 + (i - 3) * 132, 84);
    const t = new K.THREE.CanvasTexture(c); t.colorSpace = K.THREE.SRGBColorSpace;
    MT.sign = new K.THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }); MT.sign.userData.shared = true;
    return MT.sign;
  }
  const STREAK = { cold: 'sCold', warm: 'sWarm', red: 'sRed', green: 'sGreen' };
  // a light seen from every side (two crossed glow cards) and, given the water's height wy, its broken reflection below
  function lampAt(K, k, col, x, y, z, s, wy, len) {
    const q = MT.q[col];
    K.kadd(k, q, MT.glow, x, y, z, 0, 0, 0, s, s, 1); K.kadd(k, q, MT.glow, x, y, z, 0, Math.PI / 2, 0, s, s, 1);
    if (wy != null) K.kadd(k, MT.q[STREAK[col]], MT.glow, x, wy + 0.03, z, -Math.PI / 2, 0, 0, s * 0.9, len || 9, 1);
  }
  const lamp = lampAt;
  // ---------- the river ----------
  // a ship in the kit at (x, z) on the water (y 0), turned by ry, its bow toward its own -z: what you see at night is lights
  function ship(K, k, kind, x, z, ry) {
    const M = MT, f = _v.ls || 1, lamp = (K, k, col, x, y, z, s, wy, len) => lampAt(K, k, col, x, y, z, s * f, wy, len); kat(K, k, x, 0, z, ry);
    if (kind === 'waterbus') {   // the fast catamaran to Rotterdam and Dordrecht: a long cabin lit all along
      for (const sx of [-1, 1]) K.kb(k, M.white, sx * 3.1, 0.4, 0, 2.2, 1.6, 30);
      K.kb(k, M.white, 0, 1.45, 0.5, 8.6, 0.5, 29); K.kb(k, M.deck, 0, 2.85, 2, 7.6, 2.4, 20);
      for (const sx of [-1, 1]) K.kadd(k, M.q.band, M.glow, sx * 3.83, 2.95, 2, 0, Math.PI / 2, 0, 19, 1.6, 1);
      K.kadd(k, M.q.band, M.glow, 0, 2.95, -8.03, 0, 0, 0, 7, 1.6, 1);
      K.kb(k, M.deck, 0, 4.6, -5.6, 4.4, 1.2, 4); K.kadd(k, M.q.band, M.glow, 0, 4.7, -7.62, 0, 0, 0, 4, 0.9, 1);
      K.kb(k, M.steel, 0, 6.2, -5.6, 0.1, 2.2, 0.1); lamp(K, k, 'cold', 0, 7.4, -5.6, 1.6, 0, 11);
      lamp(K, k, 'red', -4.3, 3.6, -7.6, 1.2, 0, 8); lamp(K, k, 'green', 4.3, 3.6, -7.6, 1.2, 0, 8); lamp(K, k, 'cold', 0, 2.2, 15.2, 1.1);
      K.kadd(k, M.q.sWarm, M.glow, -4, 0.03, 2, -Math.PI / 2, 0, 0, 3, 18, 1); K.kadd(k, M.q.sWarm, M.glow, 4, 0.03, 2, -Math.PI / 2, 0, 0, 3, 18, 1);
      return;
    }
    if (kind === 'convoy') {   // a push convoy: the pusher with its wheelhouse high up, one loaded barge ahead
      K.kb(k, M.hull, 0, 0.1, 13, 9, 2.0, 14); K.kb(k, M.steel, 0, 2.5, 15, 7, 2.8, 8); K.kb(k, M.steel, 0, 6.1, 13.5, 4.6, 2.6, 4.2);
      for (const sx of [-1, 1]) K.kadd(k, M.q.band, M.glow, sx * 2.33, 6.2, 13.5, 0, Math.PI / 2, 0, 3.6, 1.2, 1);
      K.kadd(k, M.q.band, M.glow, 0, 6.2, 11.38, 0, 0, 0, 4.2, 1.2, 1);
      K.kb(k, M.steel, 0, 9.4, 14, 0.14, 4, 0.14); for (let i = 0; i < 3; i++) lamp(K, k, 'cold', 0, 9.2 + i * 1.1, 13.6, 1.2, i ? null : 0, 12);
      lamp(K, k, 'red', -2.5, 7.4, 11.5, 1.2, 0, 8); lamp(K, k, 'green', 2.5, 7.4, 11.5, 1.2, 0, 8);
      K.kb(k, M.hull, 0, -0.1, -9, 10, 1.6, 30); K.kb(k, M.deck, 0, 1.0, -9, 9, 0.7, 28);
      for (const sx of [-1, 1]) lamp(K, k, 'cold', sx * 4.6, 1.8, -23.8, 1.1, 0, 7);
      return;
    }
    // a Rhine barge: a long low hull, the hold under its hatches, the house and the raised wheelhouse aft, a car on deck
    K.kb(k, M.hull, 0, 0.2, 2, 8, 2.0, 38); K.kb(k, M.hull, 0, 0.35, -18.6, 6.2, 2.3, 5); K.kb(k, M.hull, 0, 0.3, -21.6, 3.4, 2.0, 2.4);
    K.kb(k, M.deck, 0, 1.55, -2, 6.6, 0.7, 27);
    K.kb(k, M.steel, 0, 2.3, 16.5, 7, 2.2, 6); K.kb(k, M.steel, 0, 4.4, 15, 4.2, 2.0, 3.6);
    for (const sx of [-1, 1]) K.kadd(k, M.q.band, M.glow, sx * 2.13, 4.5, 15, 0, Math.PI / 2, 0, 3.2, 1.1, 1);
    K.kadd(k, M.q.band, M.glow, 0, 4.5, 13.18, 0, 0, 0, 3.8, 1.1, 1);
    for (const sx of [-1, 1]) K.kadd(k, M.q.warm, M.glow, sx * 3.52, 2.4, 17, 0, Math.PI / 2, 0, 1.4, 1.4, 1);
    K.kb(k, M.deck, 1.6, 3.85, 18.6, 1.6, 0.9, 3.2);
    K.kb(k, M.steel, 0, 3.5, -19.5, 0.16, 5, 0.16); lamp(K, k, 'cold', 0, 6.1, -19.5, 1.7, 0, 12);
    lamp(K, k, 'cold', 0, 6.4, 15, 1.3); lamp(K, k, 'red', -2.3, 5.7, 13.6, 1.3, 0, 9); lamp(K, k, 'green', 2.3, 5.7, 13.6, 1.3, 0, 9);
    lamp(K, k, 'cold', 0, 2.4, 19.7, 1.1, 0, 7);
  }
  // ships under way. The game turns userData.blades about its z every frame; nested in a parent turned to lie flat, that is a
  // turn about the vertical: the ships sail a wide circle out on the river, the near side of it 52 m from the road, so one
  // passes now and then, upstream or down. The root stands on that near side; what is behind the eye when the scenery
  // recycles is far out of view, so no ship ever pops.
  function shipRing(K, kinds, w, R, ls) {
    mats(K); const { THREE } = K, root = new THREE.Group(), pivot = new THREE.Group(), blades = new THREE.Group(), up = new THREE.Group();
    R = R || 75; const dir = Math.random() < 0.5 ? 1 : -1, k = K.kit(); _v.ls = ls || 2;
    kinds.forEach((kd, i) => { const a = (i + 0.5) / kinds.length * Math.PI * 2; ship(K, k, kd, -R * Math.cos(a), R * Math.sin(a), a + (dir > 0 ? Math.PI : 0)); });
    _v.ls = 1;
    K.kbuild(k, up); up.rotation.x = Math.PI / 2; blades.add(up); blades.rotation.z = Math.random() * Math.PI * 2;
    pivot.rotation.x = -Math.PI / 2; pivot.position.x = R; pivot.add(blades); root.add(pivot);
    root.userData.blades = blades; root.userData.spin = dir * w; root.userData.faceRoad = true;
    return root;
  }
  function mooredBarge(K) {   // a barge moored against the dike for the night, her wheelhouse and portholes lit
    mats(K); const k = K.kit(); ship(K, k, 'barge', 2.2, 0, Math.random() < 0.5 ? 0 : Math.PI); kat(K, k, 0, 0, 0, 0);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function dolphin(K) {   // a mooring dolphin: three steel piles in the water with a small light on top
    const M = mats(K), k = K.kit();
    for (const [dx, dz] of [[0, 0], [0.7, 0.4], [0.7, -0.4]]) K.kadd(k, K.KG.cyl, M.steel, dx, RIVER + 1.2, dz, 0, 0, 0, 0.6, 5.6, 0.6);
    K.kb(k, M.steel, 0.4, RIVER + 4.1, 0, 1.6, 0.2, 1.4); lamp(K, k, Math.random() < 0.5 ? 'green' : 'cold', 0.4, RIVER + 4.6, 0, 1.3, RIVER, 8);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function farRiver(K) {   // the river beyond the canal ribbon, out to the far bank in the haze
    const g = new K.THREE.Group(), m = new K.THREE.Mesh(new K.THREE.PlaneGeometry(180, 214), K.M.water); m.rotation.x = -Math.PI / 2; g.add(m); return g;
  }
  // the dike's slope beside the verge: grass down to the polder, or grass and a basalt toe into the river. Front on -x
  function slope(K, river) {
    const M = mats(K), k = K.kit(), L = 24.6;
    if (river) { K.kb(k, M.grass, 1.01, -0.78, 0, 3.15, 0.2, L, 0, 0, -0.398); K.kb(k, M.rock, 3.42, -2.06, 0, 2.58, 0.3, L, 0, 0, -0.55); }
    else K.kb(k, M.grass, 2.51, -1.63, 0, 6.58, 0.2, L, 0, 0, -0.46);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // the street light: white LED, a slim galvanised pole and a flat head with the panel lit underneath
  function ledLamp(K) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), hx = -1.15, hy = 5.25;
    K.kadd(k, K.KG.cyl, M.lampGrey, 0, 2.75, 0, 0, 0, 0, 0.14, 5.5, 0.14);
    K.ktube(k, M.lampGrey, 0, 5.3, 0, hx + 0.3, 5.42, 0, 0.045);
    K.kb(k, M.lampGrey, hx, hy + 0.07, 0, 0.8, 0.1, 0.34);
    K.kadd(k, M.q.solid, M.glow, hx, hy + 0.01, 0, Math.PI / 2, 0, 0, 0.66, 0.24, 1);
    K.kbuild(k, g); K.lampLights(g, hx, hy, 0, 1.05);
    g.userData.faceRoad = true; return g;
  }
  // ---------- the yard, the bridge, the terminal: all on the river side, front on -x; X is where the root stands ----------
  // the Oceanco yard on the foreshore: a quay along the road with the fence and the gatehouse, the fitting-out basin with a
  // navy superyacht in it, floodlit, scaffolding round her bow and a gantry over her; behind, the pale halls with the name,
  // one great door open on the lit hall, the offices lit along the foot
  // off: how much further out the whole yard stands (behind the houses of the dike street it stands 6 m further out)
  function yard(K, X, off) {
    off = off || 0; const M = mats(K), k = K.kit(), g = new K.THREE.Group(), qx = x => x + off - X, yx = qx(19.4), front = !off;
    if (front) K.kb(k, M.quay, qx(8.5), -1.2, 0, 6.4, 1.5, 98); K.kb(k, M.quay, qx(33.5), -1.2, 0, 13, 1.5, 98);
    for (const z of [-48, 48]) K.kb(k, M.quay, qx(19.5), -1.2, z, 16, 1.5, 3);
    if (front) {
    for (let z = -47.5; z <= 47.5; z += 2.5) if (z < -3.5 || z > 4) K.kb(k, K.PM.pole, qx(6.2), 0.8, z, 0.09, 2.5, 0.09);
    for (const y of [-0.3, 0.85, 1.95]) for (const [z0, z1] of [[-47.5, -3.5], [4, 47.5]]) K.kb(k, K.PM.pole, qx(6.2), y, (z0 + z1) / 2, 0.05, 0.06, z1 - z0);
    K.kb(k, M.white, qx(8.4), 0.85, 7.4, 2.6, 2.6, 2.6); K.kb(k, K.PM.roof, qx(8.4), 2.25, 7.4, 3.0, 0.2, 3.0);
    K.kadd(k, K.PG.win0, K.PM.winAtlas, qx(7.08), 1.1, 7.4, 0, -Math.PI / 2, 0, 1.4, 1.0); lamp(K, k, 'warm', qx(6.95), 1.1, 7.4, 2.2);
    K.kadd(k, K.KG.cyl, M.lampGrey, qx(6.6), 2.6, 1.2, 0, 0, 0, 0.12, 5.2, 0.12); lamp(K, k, 'cold', qx(6.6), 5.3, 1.2, 1.8);
    }
    // the yacht, bow ahead: a navy hull with a white sheer line, three white decks stepped back, dark glass all round, a mast
    K.kadd(k, M.hull3, M.navy, yx, RIVER - 0.7, 0, 0, 0, 0, 10.6, 7.6, 76);
    K.kadd(k, M.hull3, M.white, yx, RIVER + 6.85, 0.2, 0, 0, 0, 10.75, 0.32, 76.3);
    let y = RIVER + 7.15;
    for (const [b, h, L, dz] of [[8.8, 2.5, 50, 7], [7.4, 2.3, 36, 10], [5.6, 2.1, 20, 12.5]]) {
      K.kadd(k, M.hull3, M.white, yx, y, dz, 0, 0, 0, b, h, L);
      K.kadd(k, M.hull3, M.dark, yx, y + h * 0.3, dz - 0.15, 0, 0, 0, b + 0.1, h * 0.42, L * 0.95);
      for (let i = 0; i < 4; i++) if (Math.random() < 0.55) K.kadd(k, M.q.warm, M.glow, yx - b / 2 - 0.12, y + h * 0.5, dz - L * 0.33 + i * L * 0.2, 0, -Math.PI / 2, 0, 2.6, 1.7);
      y += h;
    }
    K.kb(k, M.white, yx, y + 2.6, 13, 0.5, 5.2, 0.5); K.kb(k, M.white, yx, y + 4.6, 13, 4.2, 0.35, 0.6); lamp(K, k, 'cold', yx, y + 5.4, 13, 1.1);
    for (let i = 0; i < 6; i++) for (const s of [-1, 1]) K.kb(k, K.PM.pole, yx + s * 6, 4.0, -37.5 + i * 2.4, 0.09, 11.5, 0.09);
    for (let j = 0; j < 5; j++) for (const s of [-1, 1]) K.kb(k, K.PM.pole, yx + s * 6, RIVER + 1 + j * 2.4, -31.5, 0.08, 0.08, 12.4);
    // floodlights on masts along the road quay, their beams on her side, and her side washed with their light
    if (front) for (const z of [-30, -2, 26]) {
      K.kadd(k, K.KG.cyl, M.steel, qx(10.4), 8, z, 0, 0, 0, 0.32, 17.5, 0.32); K.kb(k, M.steel, qx(10.9), 16.8, z, 1.4, 0.25, 2.0);
      for (const dz of [-0.6, 0.6]) lamp(K, k, 'cold', qx(11.4), 16.6, z + dz, 2.4);
      K.kadd(k, M.q.beam, M.glow, qx(12.8), 12.4, z, 0, 0, 0.42, 4.2, 9.5, 1);
    }
    K.kadd(k, M.q.wash, M.glow, yx - 5.4, RIVER + 4.2, -4, 0, -Math.PI / 2, 0, 52, 4.2, 1);
    const cz = 18;   // the gantry over the basin
    for (const x of [10.9, 28.2]) for (const dz of [-2.2, 2.2]) K.kb(k, M.crane, qx(x), 11.2, cz + dz, 0.8, 24.4, 0.8);
    K.kb(k, M.crane, qx(19.5), 23.8, cz, 19.4, 1.7, 5.6); K.kb(k, M.crane, qx(16.5), 22.2, cz, 3, 1.8, 3.4);
    for (const x of [10.9, 28.2]) lamp(K, k, 'red', qx(x), 25.1, cz, 1.3);
    // the halls
    K.kb(k, M.clad, qx(34), 16, -24, 12, 33, 44); K.kb(k, M.clad, qx(34.2), 12.8, 24, 11.4, 26.6, 42);
    K.kb(k, M.steel, qx(34), 32.7, -24, 12.6, 0.6, 44.6); K.kb(k, M.steel, qx(34.2), 26.3, 24, 12, 0.6, 42.6);
    for (let z = -45; z <= -3; z += 3.5) K.kb(k, M.steel, qx(27.92), 16, z, 0.12, 33, 0.22);
    for (let z = 4; z <= 44; z += 3.5) K.kb(k, M.steel, qx(28.42), 12.8, z, 0.12, 26.6, 0.22);
    K.kadd(k, M.q.hall, M.glow, qx(27.85), 11, -23, 0, -Math.PI / 2, 0, 22, 23, 1);
    K.kadd(k, M.q.office, M.glow, qx(28.35), 3.6, 24, 0, -Math.PI / 2, 0, 34, 5.5, 1);
    K.kadd(k, M.q.hallWin, M.glow, qx(28.35), 21, 24, 0, -Math.PI / 2, 0, 36, 4, 1);
    lamp(K, k, 'red', qx(28.2), 33.4, -45.6, 1.4); lamp(K, k, 'red', qx(28.2), 33.4, -2.4, 1.4); lamp(K, k, 'red', qx(28.7), 27, 44.6, 1.4);
    for (let z = -40; z <= 40; z += 13) { lamp(K, k, 'cold', qx(27.4), 12.5, z, 1.7); K.kadd(k, M.q.beam, M.glow, qx(27.2), 7.6, z, 0, Math.PI / 2, 0, 5, 10, 1); }
    K.kbuild(k, g);
    const sg = new K.THREE.Mesh(new K.THREE.PlaneGeometry(26, 4.2), signMat(K)); sg.position.set(qx(27.75), 27.6, -24); sg.rotation.y = -Math.PI / 2; g.add(sg);
    g.userData.faceRoad = true; return g;
  }
  // the Brug over de Noord (1939): over the dike on slim piers, the bascule span with its portal and the bridge keeper's
  // house, then the steel arch over the river; white lamps along the deck, red and green lights under the spans
  function bridgeNoord(K) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), X = 12, qx = x => x - X, D = 10.4, top = D + 1.2;
    K.kb(k, M.steel, qx(95), D + 0.6, 0, 270, 1.2, 13); K.kb(k, M.steel, qx(-14), D - 0.7, 0, 52, 1.4, 9);
    for (const s of [-1, 1]) { K.kb(k, K.PM.pole, qx(95), D + 2.1, s * 6.4, 270, 0.08, 0.08); for (let x = -38; x < 228; x += 3) K.kb(k, K.PM.pole, qx(x), D + 1.65, s * 6.4, 0.06, 0.9, 0.06); }
    for (const [x, w] of [[16, 2.6], [30, 3.2], [132, 3.2]]) K.kb(k, M.quay, qx(x), (POLDER + D) / 2, 0, w, D - POLDER, 10);
    for (const x of [-6.4, -30, 6.7]) for (const z of [-4.2, 4.2]) K.kadd(k, K.KG.cyl, M.quay, qx(x), (POLDER + D) / 2, z, 0, 0, 0, 1.3, D - POLDER, 1.3);
    for (const s of [-1, 1]) K.kb(k, M.steel, qx(16), D + 7, s * 6.2, 1.2, 12, 1.2);
    K.kb(k, M.steel, qx(16), D + 13, 0, 1.6, 1.4, 13.8); lamp(K, k, 'red', qx(16), D + 14.2, 0, 1.6);
    K.kb(k, K.brickMat(0x5a4038), qx(16), D + 2.6, 8.8, 4.2, 3.4, 4); K.kb(k, K.PM.roof, qx(16), D + 4.4, 8.8, 4.8, 0.3, 4.6);
    for (const dx of [-1, 1]) K.kadd(k, K.PG.win0, K.PM.winAtlas, qx(16) + dx * 1.0, D + 2.8, 6.78, 0, Math.PI, 0, 1.2, 1.1);
    lamp(K, k, 'warm', qx(16), D + 2.8, 6.6, 3);
    const ax0 = 30, ax1 = 132, ac = (ax0 + ax1) / 2, hs = (ax1 - ax0) / 2, rise = 27, archY = x => top + rise * (1 - Math.pow((x - ac) / hs, 2));
    for (const s of [-1, 1]) {
      let px = ax0, py = archY(ax0);
      for (let i = 1; i <= 18; i++) { const x = ax0 + (ax1 - ax0) * i / 18, y = archY(x); K.ktube(k, M.steel, qx(px), py, s * 6, qx(x), y, s * 6, 0.6); px = x; py = y; }
      for (let x = ax0 + 6; x < ax1 - 3; x += 6) K.ktube(k, M.steel, qx(x), top, s * 6, qx(x), archY(x), s * 6, 0.07);
    }
    for (let x = ax0 + 15; x < ax1 - 10; x += 12) K.ktube(k, M.steel, qx(x), archY(x) - 0.3, -6, qx(x), archY(x) - 0.3, 6, 0.25);
    for (let x = -36; x < 228; x += 18) for (const s of [-1, 1]) { K.kb(k, M.lampGrey, qx(x), D + 2.8, s * 6.7, 0.12, 3, 0.12); lamp(K, k, 'cold', qx(x), D + 4.3, s * 6.7, 1.6, x > 8 ? RIVER : null, 14); }
    lamp(K, k, 'red', qx(ac), top + rise + 0.9, 0, 1.8); lamp(K, k, 'green', qx(ac), D - 0.6, 0, 1.7, RIVER, 12);
    for (const x of [16, 30, 132]) lamp(K, k, 'red', qx(x), D - 0.6, 0, 1.4, RIVER, 10);
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }
  // the container terminal: its quay, containers stacked two and three high, two quay cranes with their booms over the
  // water, the drivers' cabins lit, red lights on top, white floodlights under the booms
  function terminal(K) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), X = 12, qx = x => x - X;
    K.kb(k, M.quay, qx(21.7), -1.2, 0, 32.6, 1.5, 66);
    const cm = [M.contA, M.contB, M.steel, M.contA, M.deck];   // rust red, dark blue, grey: dark seams between them
    for (let row = 0; row < 4; row++) for (let i = 0; i < 4; i++) {
      const h = row ? 1 + Math.floor(Math.random() * 3) : 1 + (Math.random() < 0.5 ? 1 : 0), x = 16 + row * 2.7, z = -22 + i * 13.4;
      for (let j = 0; j < h; j++) { const y = 0.85 + j * 2.6; K.kb(k, K.pick(cm), qx(x), y, z, 2.44, 2.5, 12.1); for (const e of [-1, 1]) K.kb(k, M.dark, qx(x), y, z + e * 6.02, 2.5, 2.56, 0.1); K.kb(k, M.dark, qx(x), y + 1.27, z, 2.48, 0.06, 12.14); }
    }
    for (const cz of [-14, 16]) {
      for (const x of [27, 36]) for (const dz of [-7, 7]) K.kb(k, M.crane, qx(x), 14.3, cz + dz, 1.1, 29.5, 1.1);
      for (const dz of [-7, 7]) { K.kb(k, M.crane, qx(31.5), 12, cz + dz, 10, 1.0, 1.0); K.kb(k, M.crane, qx(31.5), 28.6, cz + dz, 10, 1.0, 1.0); }
      K.kb(k, M.crane, qx(43), 30, cz, 46, 1.8, 3.2); K.kb(k, M.crane, qx(24), 32, cz, 8, 3.2, 8);
      for (const dz of [-1.6, 1.6]) { K.ktube(k, M.crane, qx(36), 30, cz + dz, qx(36), 45, cz + dz, 0.45); K.ktube(k, M.crane, qx(36), 45, cz + dz, qx(65), 31, cz + dz, 0.22); K.ktube(k, M.crane, qx(36), 45, cz + dz, qx(21), 31, cz + dz, 0.22); }
      K.kb(k, M.white, qx(41), 27.6, cz, 2.6, 2.2, 2.6); K.kadd(k, M.q.band, M.glow, qx(39.68), 27.6, cz, 0, -Math.PI / 2, 0, 2.2, 1.4, 1);
      lamp(K, k, 'red', qx(36), 45.8, cz, 1.7); lamp(K, k, 'red', qx(66), 31.4, cz, 1.5);
      for (const x of [29, 46, 58]) { lamp(K, k, 'cold', qx(x), 28.6, cz, 1.8, x > 38 ? RIVER : null, 16); K.kadd(k, M.q.beam, M.glow, qx(x), 22, cz, 0, Math.PI / 2, 0, 9, 13, 1); }
    }
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }
  // ---------- the houses and the landmarks ----------
  // a row of dike houses. inner: against the polder side of the dike, the floor at the road and a storey below it toward the
  // polder, so from the road one low storey under a high hipped roof, a plank landing over the slope to the door; outer: on
  // the river side, two storeys; town: two storeys standing on the street. Front on -x; X: the row's distance from the road
  function dikeRow(K, X, kind) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), town = kind === 'town', outer = kind === 'outer', low = kind === 'low', tall = town || outer;
    const fx = (town ? 9.4 : low ? 11.8 : 8.2) - X, vx = 5.3 - X, base = town ? -0.05 : outer ? RIVER - 0.5 : POLDER, fy = low ? POLDER : 0, rows = tall ? [1.6, 4.1] : [fy + 1.55];
    const n = Math.random() < 0.4 ? 1 : 2, walls = [K.brickMat(K.pick(BRICK)), K.brickMat(K.pick(BRICK))], roof = Math.random() < 0.55 ? M.tile : K.PM.roof;
    let z = -n * 5.9;
    for (let i = 0; i < n; i++) {
      const w = K.rnd(8.4, 10.2), d = K.rnd(7, 8.6), zc = z + w / 2, wm = walls[i % 2], eave = tall ? K.rnd(5.4, 6.0) : low ? POLDER + K.rnd(2.5, 2.9) : K.rnd(2.9, 3.3), rh = tall ? K.rnd(3.4, 4.4) : K.rnd(4.3, 5.3);
      z += w + K.rnd(1.4, 3.0);
      K.kb(k, wm, fx + d / 2, (base + eave) / 2, zc, d, eave - base, w);
      K.kadd(k, tall && Math.random() < 0.5 ? M.hipLong : M.hip, roof, fx + d / 2, eave - 0.06, zc, 0, 0, 0, d + 0.8, rh, w + 0.8);
      K.kb(k, M.cream, fx - 0.1, eave - 0.12, zc, 0.12, 0.24, w + 0.6);
      for (const s of [-1, 1]) if (Math.random() < 0.85) { K.kb(k, wm, fx + d / 2, eave + rh + 0.05, zc + s * w * 0.17, 0.6, 1.9, 0.6); K.kb(k, roof, fx + d / 2, eave + rh + 1.05, zc + s * w * 0.17, 0.78, 0.1, 0.78); }
      const cols = w > 9.2 ? [-3.4, -1.7, 1.7, 3.4] : [-2.5, 2.5];
      for (const wy of rows) for (const dz of wy > 3 ? cols.concat([0]) : cols) {
        const wz = zc + dz, r = Math.random(), lit = r < 0.36;
        if (!lit && r > 0.84) { K.kb(k, M.green, fx - 0.05, wy, wz, 0.07, 1.6, 1.12); continue; }   // the shutters closed
        K.kadd(k, K.PG['win' + (lit ? K.pick([0, 0, 1, 2]) : r < 0.5 ? 3 : K.pick([4, 5]))], K.PM.winAtlas, fx - 0.012, wy, wz, 0, -Math.PI / 2, 0, 1.05, 1.6);
        if (lit) K.kadd(k, M.q.warm, M.glow, fx - 0.09, wy, wz, 0, -Math.PI / 2, 0, 2.7, 2.7, 1);
        if (wy < 3 && Math.random() < 0.75) for (const s of [-1, 1]) K.kb(k, M.green, fx - 0.05, wy, wz + s * 0.86, 0.06, 1.62, 0.6);
      }
      K.kadd(k, K.PG.frameSolid, K.PM.winAtlas, fx - 0.015, fy + 1.25, zc, 0, -Math.PI / 2, 0, 1.25, 2.6);
      K.kb(k, M.green, fx - 0.04, fy + 1.05, zc, 0.07, 2.1, 0.98); K.kadd(k, K.PG.fan0, K.PM.winAtlas, fx - 0.03, fy + 2.33, zc, 0, -Math.PI / 2, 0, 0.95, 0.3);
      if (Math.random() < 0.6) lamp(K, k, 'warm', fx - 0.22, fy + 2.25, zc + 0.9, 0.75);
      if (!town && !low) {   // the landing from the verge to the door, with its railings
        const lx = (vx + fx) / 2, ll = fx - vx + 0.1;
        K.kb(k, K.M.wood, lx, -0.08, zc, ll, 0.12, 1.3);
        for (const s of [-1, 1]) { K.kb(k, K.PM.pole, lx, 0.82, zc + s * 0.68, ll, 0.05, 0.05); K.kb(k, K.PM.pole, vx + 0.1, 0.4, zc + s * 0.68, 0.05, 0.85, 0.05); }
      }
      if (!tall && Math.random() < 0.45) {   // a dormer in the roof over the door
        const lit = Math.random() < 0.4;
        K.kb(k, M.cream, fx + 1.7, eave + 1.75, zc, 1.9, 1.5, 1.9); K.kb(k, roof, fx + 1.6, eave + 2.55, zc, 2.3, 0.12, 2.3);
        K.kadd(k, K.PG['win' + (lit ? 0 : 4)], K.PM.winAtlas, fx + 0.74, eave + 1.75, zc, 0, -Math.PI / 2, 0, 0.95, 1.0);
        if (lit) K.kadd(k, M.q.warm, M.glow, fx + 0.68, eave + 1.75, zc, 0, -Math.PI / 2, 0, 2.2, 2.2, 1);
      }
      // the end walls: on the polder side a window of the lower storey shows below the road, lit as often as not
      for (const e of [-1, 1]) for (const [xw, wy] of tall ? [[fx + d * 0.3, 1.6], [fx + d * 0.7, 4.1]] : low ? [[fx + d * 0.3, fy + 1.5], [fx + d * 0.7, fy + 1.5]] : [[fx + d * 0.32, 1.55], [fx + d * 0.68, -1.3]]) {
        const lit = Math.random() < (wy < 0 ? 0.55 : 0.4);
        K.kadd(k, K.PG['win' + (lit ? K.pick([0, 1]) : 4)], K.PM.winAtlas, xw, wy, zc + e * (w / 2 + 0.012), 0, e < 0 ? Math.PI : 0, 0, 1.0, 1.5);
        if (lit) K.kadd(k, M.q.warm, M.glow, xw, wy, zc + e * (w / 2 + 0.09), 0, 0, 0, 2.5, 2.5, 1);
      }
    }
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }
  // the 17th century farm on the dike: low walls in the polder and a great thatched hipped roof that comes down to the road
  function farm(K) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), X = 13, fx = 9 - X, w = 22, d = 12, eave = POLDER + 3.0, rh = 7.4, b = K.brickMat(0x4e3a32);
    K.kb(k, b, fx + d / 2, (POLDER + eave) / 2, 0, d, eave - POLDER, w);
    K.kadd(k, M.hipFarm, M.thatch, fx + d / 2, eave - 0.4, 0, 0, 0, 0, d + 1.8, rh, w + 1.8);
    K.kb(k, K.PM.roof, fx + d / 2, eave - 0.4 + rh + 0.05, 0, 0.5, 0.3, (w + 1.8) * 0.55);
    K.kb(k, b, fx + d * 0.7, eave + rh - 0.2, -3, 0.7, 1.8, 0.7);
    for (const e of [-1, 1]) {
      K.kb(k, K.M.wood, fx + d / 2, POLDER + 1.4, e * (w / 2 + 0.03), 3.4, 2.8, 0.1);
      for (const dx of [-3.6, 3.6]) { const lit = Math.random() < 0.6; K.kadd(k, K.PG['win' + (lit ? 0 : 4)], K.PM.winAtlas, fx + d / 2 + dx, POLDER + 1.6, e * (w / 2 + 0.02), 0, e < 0 ? Math.PI : 0, 0, 0.9, 1.1); if (lit) K.kadd(k, M.q.warm, M.glow, fx + d / 2 + dx, POLDER + 1.6, e * (w / 2 + 0.1), 0, 0, 0, 2.2, 2.2, 1); }
    }
    for (const dz of [-6, -2, 2, 6]) { const lit = Math.random() < 0.5; K.kadd(k, K.PG['win' + (lit ? 1 : 5)], K.PM.winAtlas, fx - 0.02, POLDER + 1.6, dz, 0, -Math.PI / 2, 0, 0.9, 1.1); if (lit) K.kadd(k, M.q.warm, M.glow, fx - 0.1, POLDER + 1.6, dz, 0, -Math.PI / 2, 0, 2.2, 2.2, 1); }
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }
  // four sails in the kit round the hub at the origin, in the x-y plane: a stock, the rails and the bars of the lattice
  function sails(K, k, mat, L, w, a0) {
    for (let i = 0; i < 4; i++) {
      const a = a0 + i * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), px = -s, py = c;
      K.ktube(k, mat, 0, 0, 0, c * L, s * L, 0, 0.11);
      for (const o of [w * 0.15, w]) K.ktube(k, mat, c * L * 0.2 + px * o, s * L * 0.2 + py * o, 0, c * L + px * o, s * L + py * o, 0, 0.04);
      for (let j = 0; j <= 8; j++) { const t = 0.2 + j * 0.1; K.ktube(k, mat, c * L * t, s * L * t, 0, c * L * t + px * w, s * L * t + py * w, 0, 0.035); }
    }
  }
  // De Blokker, the little wipmolen of 1630: a tarred pyramid with the mill house on top, its sails in the polder wind
  function wipmolen(K) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), b = new K.THREE.Group(), ks = K.kit();
    K.kadd(k, M.cone4, M.thatch, 0, POLDER, 0, 0, Math.PI / 4, 0, 4.4, 7, 4.4);
    K.kb(k, K.M.wood, 0, POLDER + 7.6, 0, 2.6, 2.8, 3.2); K.kadd(k, M.hipLong, M.thatch, 0, POLDER + 8.95, 0, 0, Math.PI / 2, 0, 3.0, 1.7, 3.8);
    K.kb(k, M.dark, 0, POLDER + 7.4, 1.61, 0.7, 1.2, 0.04);
    K.kbuild(k, g);
    sails(K, ks, K.M.wood, 8.5, 1.5, 0.3); K.kbuild(ks, b); b.position.set(0, POLDER + 8.3, 1.9); g.add(b);
    g.userData.blades = b; g.userData.spin = K.rnd(0.12, 0.2) * (Math.random() < 0.5 ? 1 : -1);
    return g;
  }
  // the Oude Toren: 15th century brick, two pointed niches a stage on every face, a lit clock, the belfry with the 1659 bell
  // lit behind its louvres, a frieze of small round arches under the parapet, a short octagonal spire between four little
  // corner spires; floodlit from its foot, the old churchyard round it
  function oudeToren(K) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), b = K.brickMat(0x5d392d), W = 7.2, h = W / 2;
    K.kb(k, b, 0, 12, 0, W, 26, W); K.kb(k, b, 0, 0.4, 0, W + 0.6, 2.8, W + 0.6);
    for (const y of [8.6, 17.2]) K.kb(k, M.quay, 0, y, 0, W + 0.24, 0.32, W + 0.24);
    K.kb(k, M.quay, 0, 25.2, 0, W + 0.45, 0.5, W + 0.45);
    for (let f = 0; f < 4; f++) {
      kat(K, k, 0, 0, 0, f * Math.PI / 2);
      for (const z of [-1.6, 1.6]) for (const [y0, y1] of [[2.4, 7.8], [9.4, 16.2]]) { K.kb(k, M.dark, -h - 0.02, (y0 + y1) / 2, z, 0.06, y1 - y0, 1.05); K.kb(k, M.dark, -h - 0.02, y1, z, 0.06, 0.74, 0.74, Math.PI / 4, 0, 0); }
      for (const z of [-1.5, 1.5]) {   // the belfry: louvres in front of the warm light where the bell hangs
        K.kb(k, M.dark, -h - 0.02, 20.9, z, 0.06, 5.2, 1.3); K.kb(k, M.dark, -h - 0.02, 23.5, z, 0.06, 0.92, 0.92, Math.PI / 4, 0, 0);
        K.kadd(k, M.q.warmPanel, M.glow, -h - 0.05, 20.9, z, 0, -Math.PI / 2, 0, 1.6, 5.6, 1);
        for (let i = 0; i < 6; i++) K.kb(k, M.quay, -h - 0.1, 18.8 + i * 0.8, z, 0.08, 0.1, 1.2);
      }
      K.kadd(k, K.KG.disc, K.PM.bulb, -h - 0.04, 13, 0, 0, -Math.PI / 2, 0, 3.2, 3.2, 1); K.kadd(k, M.q.warm, M.glow, -h - 0.12, 13, 0, 0, -Math.PI / 2, 0, 3.4, 3.4, 1);   // the clock face, lit
      K.kb(k, M.dark, -h - 0.08, 13.3, 0.1, 0.03, 0.75, 0.09, 0.3, 0, 0); K.kb(k, M.dark, -h - 0.08, 12.85, -0.2, 0.03, 0.09, 0.55, 0.5, 0, 0);
      for (let i = 0; i < 7; i++) K.kb(k, M.dark, -h - 0.02, 24.45, -2.7 + i * 0.9, 0.05, 0.5, 0.42);   // the frieze of small arches
      K.kadd(k, M.q.wash, M.glow, -h - 0.4, 9, 0, 0, -Math.PI / 2, 0, 13, 22, 1);
    }
    kat(K, k, 0, 0, 0, 0);
    K.kadd(k, M.oct, K.PM.roof, 0, 25.45, 0, 0, Math.PI / 8, 0, 3.0, 10.5, 3.0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.kadd(k, M.cone4, K.PM.roof, sx * 2.95, 25.45, sz * 2.95, 0, Math.PI / 4, 0, 0.45, 2.6, 0.45);
    K.kb(k, K.PM.pole, 0, 37, 0, 0.1, 2.4, 0.1); K.kb(k, K.PM.pole, 0, 37.5, 0, 0.9, 0.1, 0.1); K.kb(k, K.PM.pole, 0.1, 38.2, 0, 0.5, 0.35, 0.06);
    for (const [x, z] of [[-8, -6], [-8, -3], [-8.5, 4], [-7.5, 7], [6, -8], [3, 8.5], [-3, -8.5], [7.5, 5]]) K.kb(k, M.quay, x, 0.45, z, 0.18, 0.9 + Math.random() * 0.4, 0.7, 0, Math.random() * 0.3, Math.random() * 0.2 - 0.1);
    for (const [x0, z0, x1, z1] of [[-10, -10, -10, 10], [-10, 10, 10, 10], [10, -10, 10, 10], [-10, -10, -2, -10], [2, -10, 10, -10]]) K.kb(k, b, (x0 + x1) / 2, 0.45, (z0 + z1) / 2, Math.abs(x1 - x0) + 0.5, 0.9, Math.abs(z1 - z0) + 0.5);
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }
  // the Grote Kerk on Cortgene (1899): a neo-Gothic hall, its tall pointed windows lit for the evening service, the tower with
  // a needle spire and a lit clock at the end toward the road
  function groteKerk(K) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), b = K.brickMat(0x6a4436), fx = 2;
    K.kb(k, b, fx + 7, 6, 0, 14, 12, 26); K.kadd(k, M.hipLong, K.PM.roof, fx + 7, 11.9, 0, 0, 0, 0, 15, 8, 27);
    for (let i = 0; i < 5; i++) {
      const z = -10 + i * 5;
      K.kb(k, b, fx - 0.4, 4.5, z - 2.5, 0.8, 9, 0.7);
      K.kb(k, K.PM.window, fx - 0.03, 6, z, 0.05, 5, 1.4); K.kb(k, K.PM.window, fx - 0.03, 8.5, z, 0.05, 0.99, 0.99, Math.PI / 4, 0, 0);
      K.kb(k, M.dark, fx - 0.06, 6.5, z, 0.03, 6, 0.08); K.kb(k, M.dark, fx - 0.06, 7.2, z, 0.03, 0.08, 1.4);
      K.kadd(k, M.q.warm, M.glow, fx - 0.15, 6.5, z, 0, -Math.PI / 2, 0, 4.2, 8, 1);
    }
    K.kb(k, b, fx + 4, 14, -16, 6.4, 28, 6.4); K.kb(k, M.quay, fx + 4, 28.1, -16, 7, 0.4, 7);
    K.kadd(k, M.oct, K.PM.roof, fx + 4, 28.2, -16, 0, Math.PI / 8, 0, 3.2, 22, 3.2);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.kadd(k, M.cone4, K.PM.roof, fx + 4 + sx * 2.9, 28.2, -16 + sz * 2.9, 0, Math.PI / 4, 0, 0.5, 3.4, 0.5);
    K.kadd(k, K.KG.disc, K.PM.bulb, fx + 0.76, 22, -16, 0, -Math.PI / 2, 0, 3.6, 3.6, 1); K.kadd(k, M.q.warm, M.glow, fx + 0.68, 22, -16, 0, -Math.PI / 2, 0, 3.8, 3.8, 1); K.kb(k, M.dark, fx + 0.72, 22.3, -16, 0.03, 0.9, 0.1, 0.4, 0, 0);
    K.kb(k, M.dark, fx + 0.76, 2.4, -16, 0.06, 4.6, 2.2); K.kb(k, M.dark, fx + 0.76, 4.7, -16, 0.06, 1.6, 1.6, Math.PI / 4, 0, 0);
    K.kadd(k, M.q.wash, M.glow, fx + 0.5, 12, -16, 0, -Math.PI / 2, 0, 12, 24, 1);
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }
  // the shop names on the long fascia over a post-war row, painted once per row (its own texture, cleaned up with it)
  function fasciaTex(K, names) {
    const c = document.createElement('canvas'); c.width = 1536; c.height = 64; const g = c.getContext('2d');
    g.fillStyle = '#15171b'; g.fillRect(0, 0, 1536, 64); g.font = 'bold 40px "Segoe UI", system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    names.forEach((n, i) => { g.fillStyle = n === 'NACHTWINKEL' ? '#ffffff' : '#e6dac0'; g.fillText(n, 256 + i * 512, 34); });
    const t = new K.THREE.CanvasTexture(c); t.colorSpace = K.THREE.SRGBColorSpace; return t;
  }
  // the centre rebuilt after May 1940: a brick block with a flat roof, three shops under one long canopy and one fascia with
  // their names, white downlights in the canopy, bands of steel windows above. Front on -x
  function postwarRow(K, X) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), fx = 7.9 - X, uw = 7, L = 21, H = K.rnd(8.6, 10.8), b = K.brickMat(K.pick([0x5d3f34, 0x4f3b35, 0x6c4c3c, 0x56443c]));
    K.kb(k, b, fx + 5, H / 2, 0, 10, H, L); K.kb(k, M.quay, fx + 5, H + 0.18, 0, 10.4, 0.36, L + 0.3);
    K.kb(k, M.quay, fx - 0.06, 3.0, 0, 0.14, 0.4, L); K.kb(k, M.steel, fx - 0.85, 3.25, 0, 1.7, 0.16, L - 0.2);
    const names = [];
    for (let i = 0; i < 3; i++) {
      const zc = -L / 2 + uw / 2 + i * uw, name = K.pick(SHOPS); names.push(name);
      K.kadd(k, K.PG['shop' + (name === 'CAFETARIA' ? 1 : 0)], K.PM.winAtlas, fx - 0.02, 1.45, zc - 0.7, 0, -Math.PI / 2, 0, uw - 2.4, 2.2);
      K.kb(k, M.dark, fx - 0.02, 1.1, zc + uw / 2 - 1.0, 0.04, 2.2, 1.0);
      for (const dz of [-2, 1]) lamp(K, k, 'cold', fx - 1.2, 3.12, zc + dz, 0.7);
      K.kadd(k, M.q.warm, M.glow, fx - 1.6, 0.09, zc - 0.7, -Math.PI / 2, 0, 0, 4.2, 2.6, 1);
    }
    for (const wy of [4.7, 7.3]) if (wy < H - 1.2) for (let z = -L / 2 + 1.4; z < L / 2 - 1; z += 2.3) {
      const r = Math.random(), lit = r < 0.3;
      K.kadd(k, K.PG['win' + (lit ? K.pick([0, 1, 2]) : r < 0.5 ? 3 : K.pick([4, 5]))], K.PM.winAtlas, fx - 0.012, wy, z, 0, -Math.PI / 2, 0, 1.6, 1.5);
      if (lit) K.kadd(k, M.q.warm, M.glow, fx - 0.09, wy, z, 0, -Math.PI / 2, 0, 2.6, 2.4, 1);
    }
    K.kbuild(k, g);
    const sign = new K.THREE.Mesh(new K.THREE.PlaneGeometry(L - 0.4, 0.62), new K.THREE.MeshBasicMaterial({ map: fasciaTex(K, names) }));
    sign.position.set(fx - 1.71, 3.52, 0); sign.rotation.y = -Math.PI / 2; sign.userData.ownTex = true; g.add(sign);
    g.userData.faceRoad = true; return g;
  }
  // behind the shops: a post-war block of flats, four storeys of windows, a few lit
  function flats(K) {
    const M = mats(K), k = K.kit(), g = new K.THREE.Group(), b = K.brickMat(K.pick([0x4f3b35, 0x5d3f34, 0x6a6258])), H = 12.5;
    K.kb(k, b, 5, H / 2, 0, 10, H, 30); K.kb(k, M.quay, 5, H + 0.15, 0, 10.4, 0.3, 30.4);
    for (const y of [3.4, 9.2]) K.kadd(k, M.q.office, M.glow, -0.04, y, 0, 0, -Math.PI / 2, 0, 28, 5.6, 1);
    K.kbuild(k, g); g.userData.faceRoad = true; return g;
  }
  // ---------- the dead of Alblasserdam ----------
  function dmats(K) {
    if (DM) return DM;
    const { THREE, Mat } = K, keep = m => { m.userData.shared = true; return m; };
    DM = {
      hat: keep(Mat({ color: 0x1b2030 })), band: keep(Mat({ color: 0x4a2a3a })), coat: keep(Mat({ color: 0x1c2233 })), collar: keep(Mat({ color: 0xd8d4c8 })),
      book: keep(Mat({ color: 0x0e0f12 })), bag: keep(Mat({ color: 0x2a1f1c })), suit: keep(Mat({ color: 0x111317 })), boot: keep(Mat({ color: 0x14110f })),
      overall: keep(Mat({ color: 0x223a62 })), reflect: keep(Mat({ color: 0xc8ccc0, emissive: 0x4a4e46, emissiveIntensity: 1 })),
      helmet: keep(Mat({ color: 0xe4e6e2, emissive: 0x2a2c2a, emissiveIntensity: 1 })),
      skirt: new THREE.CylinderGeometry(0.21, 0.46, 1, 10), tail: new THREE.CylinderGeometry(0.24, 0.32, 1, 8),
    };
    return DM;
  }
  const limbs = sx => { const hx = sx * 0.11, shx = sx * 0.25; return { hx, shx, knee: [hx * 1.1, 0.53, -0.1], foot: [hx * 1.15, 0.07, 0.06], elbow: [shx * 1.12, 1.16, -0.48] }; };
  const dress = {
    alb_zondag(k, b, K) {   // Sunday: a felt hat with a narrow brim and a ribbon, a long dark coat, a white collar, the psalm book, a handbag
      const D = dmats(K), [x, y, z] = b.hd;
      K.kadd(k, K.KG.dome, D.hat, x, y + 0.08, z + 0.03, -0.22, 0, 0, 0.34, 0.34, 0.36); K.kadd(k, K.KG.cyl, D.hat, x, y + 0.08, z + 0.03, -0.22, 0, 0, 0.5, 0.025, 0.52);
      K.kadd(k, K.KG.cyl, D.band, x, y + 0.115, z + 0.03, -0.22, 0, 0, 0.35, 0.045, 0.37);
      K.kadd(k, D.skirt, D.coat, 0, 0.62, -0.04, -0.1, 0, 0, 1, 1, 1); K.ktube(k, D.coat, ...b.hip, ...b.sh, 0.2);
      K.kadd(k, K.KG.cyl, D.collar, b.sh[0], b.sh[1] + 0.02, b.sh[2] - 0.06, 0.55, 0, 0, 0.3, 0.05, 0.22);
      K.kb(k, D.book, 0.27, 0.62, -0.62, 0.13, 0.18, 0.05, 0.3, 0, 0); K.kb(k, D.bag, -0.31, 0.82, -0.52, 0.09, 0.24, 0.3);
    },
    alb_kerkganger(k, b, K) {   // church black: a black hat, a black coat to the knees, a white collar, the psalm book to the chest
      const D = dmats(K), [x, y, z] = b.hd;
      K.kadd(k, K.KG.dome, D.suit, x, y + 0.09, z + 0.02, -0.18, 0, 0, 0.3, 0.3, 0.33); K.kadd(k, K.KG.cyl, D.suit, x, y + 0.09, z + 0.02, -0.18, 0, 0, 0.56, 0.03, 0.58);
      K.ktube(k, D.suit, ...b.hip, ...b.sh, 0.2); K.kadd(k, D.tail, D.suit, 0, 0.78, 0.02, -0.12, 0, 0, 1, 0.55, 1);
      for (const sx of [-1, 1]) { const L = limbs(sx); K.ktube(k, D.suit, L.shx, b.sh[1], b.sh[2], ...L.elbow, 0.075); }
      K.kb(k, D.collar, 0, b.sh[1] + 0.06, b.sh[2] - 0.1, 0.16, 0.08, 0.08); K.kb(k, D.book, 0.2, 0.95, -0.66, 0.16, 0.2, 0.05, 0.6, 0, 0);
    },
    alb_werfman(k, b, K) {   // from the yard: navy overalls with reflective bands, a white helmet, safety boots
      const D = dmats(K), [x, y, z] = b.hd;
      K.ktube(k, D.overall, ...b.hip, ...b.sh, 0.2);
      K.kadd(k, K.KG.ball, D.overall, 0, (b.hip[1] + b.sh[1]) / 2 + 0.05, (b.hip[2] + b.sh[2]) / 2 + 0.04, 0.5, 0, 0, 0.5, 0.64, 0.4);
      for (const sx of [-1, 1]) {
        const L = limbs(sx);
        K.ktube(k, D.overall, L.hx, b.hip[1], b.hip[2], ...L.knee, 0.11); K.ktube(k, D.overall, ...L.knee, L.foot[0], 0.2, L.foot[2], 0.085);
        K.ktube(k, D.reflect, L.knee[0], 0.36, -0.045, L.knee[0] * 1.02, 0.28, -0.02, 0.092);
        K.ktube(k, D.overall, L.shx, b.sh[1], b.sh[2], ...L.elbow, 0.08); K.ktube(k, D.reflect, L.elbow[0] * 0.97, 1.27, -0.45, L.elbow[0], 1.2, -0.47, 0.087);
        K.kb(k, D.boot, L.foot[0], 0.08, L.foot[2] - 0.08, 0.15, 0.16, 0.3);
      }
      K.kb(k, D.reflect, 0, 1.3, -0.33, 0.46, 0.055, 0.07, 0.55, 0, 0);
      K.kadd(k, K.KG.dome, D.helmet, x, y + 0.07, z, -0.15, 0, 0, 0.36, 0.32, 0.4); K.kb(k, D.helmet, x, y + 0.08, z - 0.2, 0.28, 0.03, 0.12, -0.15, 0, 0);
    },
  };

  // ---------- the streets: each kind of street as it is here ----------
  const fp = K => K.fingerpost(SIGNS.slice().sort(() => Math.random() - 0.5).slice(0, 3));
  let seq = 0;   // the dike's three set pieces come in turn, about 200 m apart, open river between them
  let kind = 0;
  const river = near => [   // what every street along the Noord has on its water: ships under way and the river out to the far bank
    { make: K => shipRing(K, [['barge', 'convoy', 'waterbus', 'barge', 'convoy', 'barge'], ['convoy', 'barge', 'barge', 'waterbus', 'barge', 'convoy'], ['waterbus', 'barge', 'convoy', 'barge', 'barge', 'convoy']][kind++ % 3], 0.05, 75, 2.6), n: 6, gap: 70, side: 'right', xr: [near, near], y: RIVER, r: 0.5 },
    { make: K => shipRing(K, ['barge', 'convoy', 'barge', 'waterbus', 'barge'], 0.05, 60, 3.4), n: 2, gap: 230, side: 'right', xr: [near + 18, near + 18], y: RIVER, r: 0.5 },
    { make: farRiver, n: 2, gap: 210, side: 'right', xr: [110, 110], y: RIVER - 0.03, r: 0.5 },
  ];
  const themes = {
    // on the dike: the river and the yard on the right, the dike houses stepping down into the polder on the left
    dyke: base => Object.assign({}, base, {
      fog: 0x48525c, fogD: 0.0112, night: 0.15, open: true, stars: true, ground: 0x0e1311, groundY: POLDER, canal: 1, water: 0x2a3540, waterY: RIVER, waterK: 0.36,
      curv: 0.0008, landmark: false, spawn: river(42).concat([
        { make: K => [bridgeNoord, K => yard(K, 12), terminal][seq++ % 3](K), n: 3, gap: 155, reg: true, side: 'right', xr: [12, 12], r: 50 },
        { make: mooredBarge, n: 1, gap: 260, side: 'right', xr: [12.5, 12.5], y: RIVER, r: 23 },
        { make: dolphin, n: 5, gap: 60, side: 'right', xr: [10, 10.5], r: 1.5 },
        { make: K => slope(K, true), n: 9, gap: 24, reg: true, side: 'right', xr: [5.3, 5.3], r: 0.5 },
        { make: K => dikeRow(K, 9, Math.random() < 0.5 ? 'low' : 'inner'), n: 6, gap: 32, reg: true, side: 'left', xr: [9, 9], r: 12 },
        { make: farm, n: 1, gap: 300, side: 'left', xr: [13, 13], r: 13 },
        { make: wipmolen, n: 1, gap: 330, side: 'left', xr: [50, 58], r: 6 },
        { make: K => slope(K, false), n: 9, gap: 24, reg: true, side: 'left', xr: [5.3, 5.3], r: 0.5 },
        { make: ledLamp, n: 6, gap: 32, reg: true, side: 'left', xr: [4.75, 4.75] },
        { make: K => K.treeCard([3, 3, 1, 2]), n: 7, gap: 30, side: 'left', xr: [22, 36], y: POLDER, r: 0.9 },
        { make: fp, n: 1, gap: 200, side: 'left', xr: [4.7, 4.7], r: 0.5 },
        { make: K => K.bikeRow(), n: 2, gap: 100, side: 'left', xr: [4.9, 5.0], r: 0.6 },
        { make: 'zombieWalk', n: 4, gap: 45, side: 'both', xr: [4.8, 5.1], r: 0.6 } ]),
    }),
    // home: the dike street of Oost-Kinderdijk, dike houses on both sides, the yard's halls over the roofs on the river side
    street: base => Object.assign({}, base, {
      fog: 0x4a535e, fogD: 0.0145, night: 0.16, ground: 0x111614, groundY: POLDER, canal: 1, water: 0x1f2833, waterY: RIVER, waterK: 0.3,
      curv: 0.0009, verge: 'grass', lmX: [24, 28], lmSide: 'left', spawn: river(60).concat([
        { make: K => yard(K, 30, 6), n: 1, gap: 230, side: 'right', xr: [30, 30], r: 49 },
        { make: K => dikeRow(K, 9, 'inner'), n: 8, gap: 23, reg: true, side: 'left', xr: [9, 9], r: 10 },
        { make: K => dikeRow(K, 9.4, 'outer'), n: 6, gap: 29, reg: true, side: 'right', xr: [9.4, 9.4], r: 10 },
        { make: K => slope(K, false), n: 9, gap: 24, reg: true, side: 'left', xr: [5.3, 5.3], r: 0.5 },
        { make: K => slope(K, true), n: 9, gap: 24, reg: true, side: 'right', xr: [5.3, 5.3], r: 0.5 },
        { make: ledLamp, n: 10, gap: 18, reg: true, side: 'alt', xr: [4.75, 4.75] },
        { make: K => K.treeCard([1, 2, 1, 3]), n: 6, gap: 30, side: 'left', xr: [19, 27], y: POLDER, r: 0.9 },
        { make: K => K.bikeRow(), n: 4, gap: 50, side: 'both', xr: [4.9, 5.0], r: 0.6 }, { make: K => K.bins(), n: 3, gap: 60, side: 'both', xr: [5.0, 5.1], r: 0.5 },
        { make: fp, n: 2, gap: 90, side: 'both', xr: [4.7, 4.7], r: 0.5 },
        { make: 'zombieWalk', n: 7, gap: 20, side: 'both', xr: [4.8, 5.3], r: 0.6 } ]),
    }),
    // the Kerkplein: the Oude Toren beside the road in its churchyard, the Grote Kerk across, lime trees, klinkers
    square: base => Object.assign({}, base, {
      fog: 0x4a535e, fogD: 0.0155, night: 0.17, ground: 0x1b1f24, groundY: -0.05, canal: 0, curv: 0.0015, landmark: false,
      road: { kind: 'klinkers', tone: '#4b3b35' }, spawn: [
        { make: oudeToren, n: 1, gap: 250, side: 'right', xr: [14, 14], r: 13 },
        { make: groteKerk, n: 1, gap: 250, side: 'left', xr: [13, 13], r: 17 },
        { make: K => dikeRow(K, 11, 'town'), n: 7, gap: 26, reg: true, side: 'left', xr: [11, 11], r: 10 },
        { make: K => dikeRow(K, 11, 'town'), n: 5, gap: 34, reg: true, side: 'right', xr: [11, 11], r: 10 },
        { make: K => K.treeCard([1, 1, 1, 0]), n: 14, gap: 12, side: 'both', xr: [5.6, 8.5], r: 0.9 },
        { make: ledLamp, n: 10, gap: 15, reg: true, side: 'alt', xr: [4.75, 4.75] },
        { make: K => K.bench(), n: 4, gap: 40, side: 'both', xr: [5.0, 5.2], r: 0.9 }, { make: K => K.bikeRow(), n: 4, gap: 40, side: 'both', xr: [4.9, 5.0], r: 0.6 },
        { make: fp, n: 1, gap: 150, side: 'both', xr: [4.7, 4.7], r: 0.5 },
        { make: 'zombieWalk', n: 7, gap: 24, side: 'both', xr: [5.0, 6.0], r: 0.6 } ],
    }),
    // the centre rebuilt after 1940: flat-roofed brick rows of shops under long canopies, the Oude Toren at the end
    nightshop: base => Object.assign({}, base, {
      fog: 0x3c4552, fogD: 0.0165, night: 0.22, ground: 0x171a20, groundY: -0.05, canal: 0, curv: 0.0022, lmX: [17, 21], lmSide: 'right',
      road: { kind: 'klinkers', tone: '#3e3a3a' }, spawn: [
        { make: K => postwarRow(K, 7.9), n: 8, gap: 22.5, reg: true, side: 'left', xr: [7.9, 7.9], r: 10.5 },
        { make: K => postwarRow(K, 7.9), n: 8, gap: 22.5, reg: true, side: 'right', xr: [7.9, 7.9], r: 10.5 },
        { make: flats, n: 5, gap: 34, reg: true, side: 'alt', xr: [20, 21], r: 15 },
        { make: ledLamp, n: 8, gap: 20, reg: true, side: 'alt', xr: [4.75, 4.75] },
        { make: K => K.bikeRow(), n: 5, gap: 26, side: 'both', xr: [4.9, 5.0], r: 0.6 }, { make: K => K.bins(), n: 4, gap: 30, side: 'both', xr: [5.0, 5.1], r: 0.5 },
        { make: K => K.crates(), n: 3, gap: 40, side: 'both', xr: [5.0, 5.2], r: 0.5 },
        { make: 'zombieWalk', n: 9, gap: 16, side: 'both', xr: [4.8, 5.4], r: 0.6 } ],
    }),
  };

  // ---------- the far town on the horizon ----------
  const skyline = {
    near(P, K, th) {   // on the dike: across the Noord the far bank, a low dike with the houses and sheds of Hendrik-Ido-Ambacht
      if (th && th.waterY < -1) {
        P.box(P.X(0.8), 0.42 * 2048 / P.m, -5, 1.6); P.roofs(0.6, 1, 2.5, 6, 0.2, ['roof', 'flat', 'roof', 'flat']);
        for (let i = 0; i < 28; i++) P.win(P.X(0.58 + i * 0.015), 0.6 + P.r() * 1.2, 0.4 + P.r() * 0.5, 0.45, 0.45);
        P.trees(0, 0.42, 6, 12, 8); P.house(P.X(0.2), 10, 3, 'roof', 0.5); P.house(P.X(0.32), 8, 3, 'roof', 0.5);
      } else { P.roofs(0, 0.42, 8, 14, 0.14, ['roof', 'roof', 'flat']); P.roofs(0.58, 1, 8, 14, 0.14, ['flat', 'roof', 'flat']); P.trees(0, 1, 7, 12, 11); }
      P.trees(0.42, 0.58, 3, 6, 12);
    },
    mid(P, K, th) {   // the Oude Toren, the Grote Kerk's needle, the yard's pale halls, two cranes and the arch of the bridge
      const town = !(th && th.waterY < -1); P.trees(0, 1, 6, 11, 12);
      const ot = P.X(town ? 0.56 : 0.36); P.box(ot, 7, -5, 26); P.box(ot, 7.6, 25.4, 26.2); P.poly([[ot - 3.3 * P.m, 26], [ot, 36], [ot + 3.3 * P.m, 26]]); P.win(ot, 13, 0.9, 1.7, 1.7); P.win(ot, 20.5, 0.5, 1, 3);
      const gk = P.X(town ? 0.44 : 0.27); P.box(gk + 11 * P.m, 22, -5, 12); P.poly([[gk + 0.5 * P.m, 12], [gk + 11 * P.m, 19], [gk + 22 * P.m, 12]]); P.box(gk, 6, -5, 27); P.poly([[gk - 3 * P.m, 27], [gk, 50], [gk + 3 * P.m, 27]]);
      for (let i = 0; i < 3; i++) P.win(gk + (6 + i * 5) * P.m, 6, 0.6, 1.1, 3.2);
      const ha = P.X(0.66); P.box(ha, 30, -5, 31); P.box(ha + 26 * P.m, 24, -5, 25); for (let i = 0; i < 9; i++) P.win(ha + (-12 + i * 3) * P.m, 4, 0.6, 1.4, 1.2);
      for (const c of [0.8, 0.84]) { const x = P.X(c); P.line(x, -5, x, 30, 1.0); P.line(x + 6 * P.m, -5, x + 6 * P.m, 30, 1.0); P.line(x - 8 * P.m, 30, x + 34 * P.m, 30, 1.4); P.line(x + 6 * P.m, 30, x + 6 * P.m, 44, 0.8); P.line(x + 6 * P.m, 44, x + 34 * P.m, 31, 0.3); P.win(x + 6 * P.m, 44, 0.9, 0.8, 0.8); }
      const bx = P.X(0.93); P.box(bx, 0.12 * 2048 / P.m, 9.5, 11); P.g.lineWidth = Math.max(1.5, 1.2 * P.m); P.g.beginPath(); P.g.ellipse(bx + 20 * P.m, P.g.canvas.height - 16 * P.m, 45 * P.m, 24 * P.m, 0, Math.PI, 0); P.g.stroke();
    },
    far(P) {   // the Kinderdijk mills in a row to the north, Rotterdam's towers far off, the polder's trees
      P.trees(0, 1, 4, 9, 9);
      for (let i = 0; i < 7; i++) P.mill(P.X(0.5 + i * 0.022), 18 - i * 1.2, 0.3 + i * 0.6, i < 2 ? 1 : 0);
      for (let i = 0; i < 6; i++) { const x = P.X(0.13 + i * 0.022), h = P.rr(28, 60); P.box(x, P.rr(6, 11), -5, h); for (let f = 6; f < h - 3; f += 5) if (P.r() < 0.4) P.win(x, f, 0.4, 0.8, 0.8); }
      P.church(P.X(0.38), 30);
    },
  };

  T.alblasserdam = {
    style: { brick: [0x5b3b31, 0x4c352f, 0x6a4a3d, 0x8f8c83], gables: 0.12, height: [5, 6.5], width: [5.5, 7], lamp: 'modern' },
    themes, skyline, shops: SHOPS, signs: SIGNS, extra: [],
    sky: { stars: 150, clouds: 0.75, glows: [
      { az: 42, el: 0.5, w: 74, h: 12, color: 0xd9c6a8, a: 0.3 },    // Rotterdam, to the northwest
      { az: -48, el: 0.5, w: 46, h: 8, color: 0xf0b888, a: 0.2 } ] }, // Dordrecht, to the southwest
    light: { lamp: 0xdfe8ff },
    lamp: ledLamp,
    landmark: oudeToren,
    dead: { pool: ['alb_zondag', 'alb_zondag', 'alb_kerkganger', 'alb_werfman', 'alb_werfman', 'plain'], dress },
  };
})();
