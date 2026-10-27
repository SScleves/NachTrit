// Intro panel 13 in 3D: "No helmet. A helmet would make him look enthusiastic."
// Outside his front door on the dike street of Alblasserdam at night, in two beats.
// 1. 0 to 4.9 s: he sits on his omafiets on the stoep by his door. Beside the door a bicycle helmet hangs on a hook, white with
//    a red stripe, never worn, the price tag still on, warm in the light of the door lantern. Behind him, across the street, the
//    dead wait on the verge in bright bicycle helmets with blinking lights. He turns his head and looks at the helmet, deadpan,
//    then at us: "Nee."
// 2. From 4.9 s: from the doorstep behind him, the helmet at the left. He rides off down the street into the mist; his shoulder
//    catches the helmet and it swings and turns on its hook. Across the street more of the dead, far too keen: bouncing on
//    their toes, two of them already on their bikes, one checking the route on her phone. They turn to watch him go; the two
//    on bikes roll after him a metre and stop. It ends on him riding away down the street.
// His house and the neighbour's take the place of the row of dike houses the street put there (same line, same kind), so the
// street runs on unbroken; the town's own dead are sent home for the night. He rides in a rig of his own: the game keeps his
// bike on its lane every frame, and here that lane is the middle of the rig.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const SEED = 1313, CUT = 4.9, GO = 5.2, V = 6.4, DEG = Math.PI / 180;
  // his house: its front faces the road at FX and a brick stoep runs from the verge to it; his bike stands on the stoep facing
  // down the street (minus z), the hook with the helmet on the wall by his left shoulder, the door and its lantern just ahead
  const FX = -6.6, HX = -5.7, ZA = -4.6, ZB = 4.7, DZ = -1.2, XR = 0.7;
  const HOOK = [FX + 0.27, 2.14, -0.02], LANT = [FX, 2.36, -0.52];
  // the first eye: ahead of him, off the stoep toward the road, looking back up the street past him; the second: on his side of
  // the street behind him, high, down the street. Each looks at its subject; a wide screen moves the middle of the picture
  // SHIFT metres (at the subject) toward the street and the dead across it, a narrow one keeps the subject in the middle
  const CAM1 = [-4.85, 1.42, -6.7], CAM1B = [-5.15, 1.5, -5.25], LOOK1 = [-6.0, 1.42, 0.0], FOV1 = 36, FOV1B = 34, SHIFT1 = -1.85;
  const CAM2 = [-4.85, 2.3, 4.7], CAM2B = [-4.5, 2.62, 3.9], FOV2 = 42, FOV2B = 36, SHIFT2 = 2.3;
  const MIN_HALF_W = 9.5, MIN_HALF_V = 12.5;   // a narrow or short picture widens the lens until this much shows round the middle
  // the dead across the street: [x, z, variant, helmet colour, what they do]. The first four stand behind him, in the first
  // picture; the rest ahead, where he rides
  const KEEN = [
    [5.0, 11.0, 'plain', 0xd2f04a, 'cheer'],
    [5.15, 13.4, 'plain', 0xff6aa8, 'bike'],
    [4.95, 16.0, 'phone', 0x5ad2f0, 'phone'],
    [5.1, 19.8, 'plain', 0xf4dc48, 'hop'],
    [5.0, -6.6, 'plain', 0xf2f2ea, 'hop'],
    [5.1, -8.9, 'plain', 0xd2f04a, 'bike'],
    [4.95, -11.3, 'plain', 0xff6aa8, 'cheer'],
    [5.15, -13.5, 'phone', 0x5ad2f0, 'phone'],
    [5.0, -17.4, 'plain', 0xf4dc48, 'hop'],
    [5.2, -20.6, 'plain', 0xff6aa8, 'bike'],
  ];
  let st = null;

  function rng(a) { return () => { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const ease = (W, t, t0, len) => W.smooth(W.clamp((t - t0) / len, 0, 1));
  const turnTo = (a, b, k) => { let d = b - a; d = Math.atan2(Math.sin(d), Math.cos(d)); return a + d * k; };
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
  function ownTex(W, c, colour) { const t = new W.THREE.CanvasTexture(c); if (colour) t.colorSpace = W.THREE.SRGBColorSpace; st.tex.push(t); return t; }
  const ownMat = m => { st.mats.push(m); return m; };
  const ownGeo = g => { st.geo.push(g); return g; };

  // ---- the helmet: a vented shell running out to a point at the back, its front toward -z; half width a, height b, half length
  // c. Its uvs are a map seen from above, the crown in the middle and the rim round the edge, so the vents and the stripe are
  // painted on one canvas
  function shellGeo(W, a, b, c) {
    const TH = Math.PI * 0.53, g = new W.THREE.SphereGeometry(1, 28, 12, 0, Math.PI * 2, 0, TH), p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const th = Math.acos(W.clamp(y, -1, 1)), r = th / TH * 0.5, ph = Math.atan2(z, x);
      uv.setXY(i, 0.5 + r * Math.cos(ph), 0.5 - r * Math.sin(ph));
      const bk = Math.max(0, z), fr = Math.max(0, -z), w = Math.pow((1 - y) / 1.1, 2);
      // the rim: up over the forehead and the ears, down over the back of the head
      const rim = (0.2 * -z + 0.12 * (1 - z * z)) * w;
      z *= 1 + 0.55 * bk * bk; y = y * (1 - 0.14 * y) - 0.22 * bk * bk * bk - 0.1 * fr * fr * y + rim;   // a flatter crown, the tail out and down
      p.setXYZ(i, x * a, y * b, z * c);
    }
    g.computeVertexNormals(); return ownGeo(g);
  }
  // seen from above, the front at the top: big vents in slots running front to back, a dark edge at the rim, and for his own
  // helmet the red stripe round it. White, so a material colour tints it for the helmets of the dead
  function shellTex(W, stripe) {
    const [c, g] = canvas(256, 256);
    g.fillStyle = '#f2f0ea'; g.fillRect(0, 0, 256, 256);
    if (stripe) { g.strokeStyle = '#c42a24'; g.lineWidth = 15; g.beginPath(); g.arc(128, 128, 109, 0, 7); g.stroke(); }
    g.strokeStyle = '#26252a'; g.lineWidth = 6; g.beginPath(); g.arc(128, 128, 125, 0, 7); g.stroke();
    g.fillStyle = '#1b1a1f';
    const slot = (x, y0, y1, w) => { g.beginPath(); g.ellipse(x, (y0 + y1) / 2, w / 2, (y1 - y0) / 2, 0, 0, 7); g.fill(); };
    for (const [dx, rows, w] of [[0, [[34, 86], [100, 152], [166, 208]], 17], [38, [[44, 92], [106, 152], [166, 200]], 16], [76, [[72, 118], [134, 178]], 15]])
      for (const sx of dx ? [-1, 1] : [1]) for (const [a, b] of rows) slot(128 + sx * dx, a, b, w);
    return ownTex(W, c, true);
  }
  function tagTex(W) {   // the shop's price tag, still on it
    const [c, g] = canvas(128, 80);
    g.fillStyle = '#efe9d8'; g.fillRect(0, 0, 128, 80); g.fillStyle = '#b8302a'; g.fillRect(0, 0, 9, 80);
    g.fillStyle = '#2a2420'; g.beginPath(); g.arc(112, 14, 5, 0, 7); g.fill();
    g.font = 'bold 34px "Segoe UI", system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('€59,95', 68, 46);
    return ownTex(W, c, true);
  }

  // his helmet on its hook: the iron hook on the wall, the helmet hanging from it by the inside of its crown, nose down a little,
  // the straps loose under it and the price tag on its string from a side vent. Sized for his head. The pivot swings about the
  // hook (x); the helmet's front points at the road
  function heroHelmet(W) {
    const THREE = W.THREE, [hx, hy, hz] = HOOK, k = W.kit();
    W.kb(k, W.PM.pole, FX + 0.012, hy + 0.03, hz, 0.024, 0.13, 0.075);
    W.ktube(k, W.PM.pole, FX + 0.01, hy, hz, hx + 0.01, hy, hz, 0.013);
    W.ktube(k, W.PM.pole, hx, hy - 0.004, hz, hx + 0.02, hy + 0.06, hz, 0.011);
    st.props.push(W.add(W.kbuild(k), 0, 0, 0));
    const pivot = new THREE.Group(), h = new THREE.Group();
    h.rotation.order = 'YXZ'; h.rotation.set(-0.18, -Math.PI / 2, 0); h.position.set(0.03, -0.215, 0); pivot.add(h);
    const tex = shellTex(W, true);
    h.add(new THREE.Mesh(st.shell, ownMat(W.Mat({ map: tex, emissive: 0x8a5a34, emissiveMap: tex, emissiveIntensity: 0.34 }))));
    h.add(new THREE.Mesh(st.liner, st.linerMat));
    const kv = W.kit();
    W.kb(kv, st.visorMat, 0, 0.06, -0.185, 0.24, 0.014, 0.07, -0.34, 0, 0);
    // the chin strap: a loose loop under the helmet with its buckle at the bottom
    const sp = [[-0.165, -0.02, 0.02], [-0.11, -0.12, 0.0], [-0.03, -0.165, -0.01], [0.03, -0.165, -0.01], [0.11, -0.12, 0.0], [0.165, -0.02, 0.02]];
    for (let i = 0; i < sp.length - 1; i++) W.ktube(kv, st.strapMat, ...sp[i], ...sp[i + 1], 0.007);
    W.kb(kv, st.strapMat, 0, -0.168, -0.01, 0.06, 0.026, 0.016);
    W.kbuild(kv, h);
    // the tag on its string from a side vent, swinging a little after the helmet
    const tagG = new THREE.Group(); tagG.position.set(-0.16, 0.09, 0.07); h.add(tagG);
    const kt = W.kit(); W.ktube(kt, st.strapMat, 0, 0, 0, -0.025, -0.15, 0, 0.002); W.kbuild(kt, tagG);
    const tm = ownMat(new THREE.MeshBasicMaterial({ map: tagTex(W), color: 0xd8cfc0 }));
    for (const s of [-1, 1]) { const tg = new THREE.Mesh(st.unitPlane, tm); tg.position.set(-0.025 + s * 0.002, -0.18, 0); tg.rotation.y = s * Math.PI / 2; tg.scale.set(0.095, 0.058, 1); tagG.add(tg); }
    st.props.push(W.add(pivot, hx, hy, hz));
    st.helmet = { pivot, tag: tagG };
  }

  // ---- the houses: a hipped roof on a unit base (x across, the ridge along z), one high, as the dike houses here have
  function hipGeo(W, rf) {
    const r = rf / 2, P = [[-0.5, 0, -0.5], [0.5, 0, -0.5], [0.5, 0, 0.5], [-0.5, 0, 0.5], [0, 1, -r], [0, 1, r]], c = [0, 0.25, 0], pos = [];
    for (const t of [[0, 3, 5], [0, 5, 4], [1, 4, 5], [1, 5, 2], [0, 4, 1], [3, 2, 5]]) {
      const a = P[t[0]]; let b = P[t[1]], d = P[t[2]];
      const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const m = [(a[0] + b[0] + d[0]) / 3 - c[0], (a[1] + b[1] + d[1]) / 3 - c[1], (a[2] + b[2] + d[2]) / 3 - c[2]];
      if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] < 0) { const q = b; b = d; d = q; }
      pos.push(...a, ...b, ...d);
    }
    const g = new W.THREE.BufferGeometry();
    g.setAttribute('position', new W.THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new W.THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
    g.computeVertexNormals(); return ownGeo(g);
  }
  // a dike house against the polder side of the dike: the floor at the road, one low storey under a high hipped roof seen from
  // the street, the lower storey down in the polder. Its front faces the road at fx, from z0 to z1; o: walls, roof, door, windows
  function dikeHouse(W, k, fx, z0, z1, o) {
    const POLDER = -3.0, d = o.depth, w = z1 - z0, zc = (z0 + z1) / 2, eave = o.eave, rh = o.rh, x = fx - d / 2;
    W.kb(k, o.wall, x, (POLDER + eave) / 2, zc, d, eave - POLDER, w);
    W.kadd(k, st.hip, o.roof, x, eave - 0.06, zc, 0, 0, 0, d + 0.8, rh, w + 0.8);
    W.kb(k, st.cream, fx + 0.1, eave - 0.12, zc, 0.12, 0.24, w + 0.6);
    for (const s of [-1, 1]) { W.kb(k, o.wall, x, eave + rh + 0.05, zc + s * w * 0.17, 0.6, 1.9, 0.6); W.kb(k, o.roof, x, eave + rh + 1.05, zc + s * w * 0.17, 0.78, 0.1, 0.78); }
    for (const [wz, cell] of o.windows) {
      W.kadd(k, W.PG['win' + cell], W.PM.winAtlas, fx + 0.012, 1.55, wz, 0, Math.PI / 2, 0, 1.05, 1.6);
      if (cell < 3) W.kadd(k, W.KG.plane, st.winGlow, fx + 0.09, 1.55, wz, 0, Math.PI / 2, 0, 2.6, 2.6);
      for (const s of [-1, 1]) W.kb(k, st.green, fx + 0.05, 1.55, wz + s * 0.86, 0.06, 1.62, 0.6);
    }
    for (const wz of o.shut || []) W.kb(k, st.green, fx + 0.05, 1.55, wz, 0.07, 1.6, 1.12);   // the shutters closed for the night
    const dz = o.door;
    W.kadd(k, W.PG.frameSolid, W.PM.winAtlas, fx + 0.015, 1.25, dz, 0, Math.PI / 2, 0, 1.25, 2.6);
    W.kb(k, st.green, fx + 0.04, 1.05, dz, 0.07, 2.1, 0.98);
    W.kadd(k, W.PG.fan0, W.PM.winAtlas, fx + 0.03, 2.33, dz, 0, Math.PI / 2, 0, 0.95, 0.3);
    if (o.dormer) {   // a dormer in the roof over the door
      W.kb(k, st.cream, fx - 1.7, eave + 1.75, dz, 1.9, 1.5, 1.9); W.kb(k, o.roof, fx - 1.6, eave + 2.55, dz, 2.3, 0.12, 2.3);
      W.kadd(k, W.PG['win' + o.dormer], W.PM.winAtlas, fx - 0.74, eave + 1.75, dz, 0, Math.PI / 2, 0, 0.95, 1.0);
      if (o.dormer < 3) W.kadd(k, W.KG.plane, st.winGlow, fx - 0.68, eave + 1.75, dz, 0, Math.PI / 2, 0, 2.2, 2.2);
    }
  }

  // ---- the set
  function build(W) {
    const THREE = W.THREE;
    W.stage({ town: 'alblasserdam', theme: 'street', fog: 1.0, seed: SEED });
    W.speed(0); W.ride(0);
    W.face('deadpan');
    W.beam.visible = false;   // stopped by the door: the cone of his lamp would fill the first picture
    st.rig = new THREE.Group(); st.rig.name = 'shot13-rider'; W.scene.remove(W.bike); st.rig.add(W.bike); W.scene.add(st.rig);
    const box = new THREE.Box3(), size = new THREE.Vector3();
    const near = (z, r) => KEEN.some(q => Math.abs(q[1] - z) < r);
    // the town's dead go home; the row of dike houses where his house stands makes room for it; furniture on his stoep and round
    // the dead across the street goes; the near ground mist would stand in front of him
    W.hide((o) => {
      if (!o || o === W.bike || o === st.rig || o.userData.cineWorld != null) return false;
      const u = o.userData, x = o.position.x, z = o.position.z;
      if (o.isSprite) return !!(u.band && u.band.side && z > -16 && z < 14);
      if (!o.isGroup) return false;
      if (u.shuffle !== undefined || (u.variant !== undefined && u.lean !== undefined)) return true;
      box.setFromObject(o); box.getSize(size);
      if (u.faceRoad && x < -7 && x > -11 && box.max.z > -13 && box.min.z < 8) return true;
      if (x < -4 && x > -5.5 && z > 2 && z < 12 && size.y > 4) return true;   // the street light just behind him: it would stand in the middle of the first picture
      if (Math.max(size.x, size.z) > 4 || size.y > 4) return false;
      if (x < 0 && x > -7 && z > -9 && z < 10) return true;
      if (x > 0 && x < 7 && near(z, 2.6)) return true;
      return false;
    });

    // shared bits of my own
    st.shell = shellGeo(W, 0.18, 0.27, 0.168); st.liner = shellGeo(W, 0.168, 0.252, 0.157); st.shellS = shellGeo(W, 0.15, 0.22, 0.14); st.hip = hipGeo(W, 0.34);
    st.unitPlane = ownGeo(new THREE.PlaneGeometry(1, 1));
    st.linerMat = ownMat(W.Mat({ color: 0x151417, side: THREE.BackSide }));
    st.visorMat = ownMat(W.Mat({ color: 0x15161a }));
    st.strapMat = ownMat(W.Mat({ color: 0x1c1d22 }));
    st.green = ownMat(W.Mat({ color: 0x264a31 }));
    st.cream = ownMat(W.Mat({ color: 0xb8b2a2 }));
    st.winGlow = ownMat(W.GlowMat(W.glowTex, 0xffb466, 0.5));
    const TK = window.NRTK, brick = c => (TK && TK.brickMat ? TK.brickMat(c) : ownMat(W.Mat({ color: c })));
    const tile = ownMat(W.Mat({ color: 0x4f3530, map: W.PM.roof.map })); tile.userData.wuv = 3.2;
    const glow = (col, op, sprite) => ownMat(W.GlowMat(W.glowTex, col, op, sprite));

    // his house and the neighbour's, one kit; his stoep in front of his, a plank landing to the neighbour's door
    const k = W.kit();
    dikeHouse(W, k, FX, ZA, ZB, { depth: 7.6, eave: 3.1, rh: 4.9, wall: brick(0x4c352f), roof: tile, door: DZ, dormer: 3,
      windows: [[-3.25, 3], [3.4, 5]], shut: [1.95] });
    dikeHouse(W, k, -8.2, -13.6, -5.9, { depth: 8.0, eave: 3.0, rh: 4.6, wall: brick(0x8f8c83), roof: W.PM.roof, door: -9.75,
      windows: [[-12.0, 1], [-7.5, 0]] });
    W.kb(k, brick(0x463a34), (FX - 5.3) / 2, -1.49, (ZA + ZB) / 2, -5.3 - FX + 0.02, 3.02, ZB - ZA);
    W.kb(k, W.PM.pole, FX + 0.45, 0.035, DZ, 0.5, 0.02, 0.8);   // the doormat
    { const lx = (-5.3 - 8.2) / 2, ll = 8.2 - 5.3 + 0.1, zc = -9.75;
      W.kb(k, W.M.wood, lx, -0.08, zc, ll, 0.12, 1.3);
      for (const s of [-1, 1]) { W.kb(k, W.PM.pole, lx, 0.82, zc + s * 0.68, ll, 0.05, 0.05); W.kb(k, W.PM.pole, -5.4, 0.4, zc + s * 0.68, 0.05, 0.85, 0.05); } }
    // the letterbox and the knob on his door
    W.kb(k, W.PM.silver, FX + 0.085, 0.98, DZ + 0.1, 0.02, 0.05, 0.3);
    W.kadd(k, W.KG.ball, W.PM.silver, FX + 0.1, 1.05, DZ - 0.36, 0, 0, 0, 0.06, 0.06, 0.06);
    st.row = W.add(W.kbuild(k), 0, 0, 0); st.props.push(st.row);

    // the door lantern: a black iron lantern on an arm, its warm light on the wall, the stoep, the helmet and on him
    { const [x0, y0, z0] = LANT, px = x0 + 0.17, kl = W.kit();
      W.kb(kl, W.PM.pole, x0 + 0.012, y0 + 0.22, z0, 0.024, 0.16, 0.08);
      W.ktube(kl, W.PM.pole, x0 + 0.01, y0 + 0.26, z0, px, y0 + 0.26, z0, 0.012); W.ktube(kl, W.PM.pole, px, y0 + 0.26, z0, px, y0 + 0.19, z0, 0.008);
      W.kadd(kl, W.KG.cyl, W.PM.pole, px, y0 + 0.165, z0, 0, Math.PI / 4, 0, 0.24, 0.05, 0.24);
      W.kb(kl, W.PM.pole, px, y0 - 0.15, z0, 0.15, 0.03, 0.15);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) W.kb(kl, W.PM.pole, px + sx * 0.068, y0, z0 + sz * 0.068, 0.018, 0.29, 0.018);
      W.kb(kl, ownMat(new THREE.MeshBasicMaterial({ color: 0xffd39a })), px, y0, z0, 0.125, 0.27, 0.125);
      st.props.push(W.add(W.kbuild(kl), 0, 0, 0));
      const halo = new THREE.Sprite(glow(0xffbf6e, 0.85, true)); halo.scale.set(0.75, 0.75, 1); st.props.push(W.add(halo, px, y0, z0));
      const soft = new THREE.Sprite(glow(0xff9a3c, 0.3, true)); soft.scale.set(2.6, 2.6, 1); st.props.push(W.add(soft, px, y0 - 0.05, z0));
      const wash = new THREE.Mesh(st.unitPlane, glow(0xff9444, 0.22)); wash.rotation.y = Math.PI / 2; wash.scale.set(2.9, 2.7, 1); st.props.push(W.add(wash, FX + 0.02, y0 - 0.35, z0 + 0.2));
      const pool = new THREE.Mesh(st.unitPlane, glow(0xff9444, 0.24)); pool.rotation.x = -Math.PI / 2; pool.scale.set(2.4, 3.4, 1); pool.renderOrder = 2; st.props.push(W.add(pool, FX + 0.8, 0.04, z0 + 0.25));
      st.lantern = { halo, soft }; }

    heroHelmet(W);

    // his coat a little self-lit, so the orange stays the one saturated colour of the frame: his own copy, given back at the end
    const warm = W.Mat({ color: W.M.shirt.color.getHex() }); warm.emissive.copy(W.M.shirt.color).multiplyScalar(0.26); ownMat(warm);
    W.bike.traverse(m => { if (m.isMesh && m.material === W.M.shirt) { st.coat.push(m); m.material = warm; } });

    // the dead across the street
    st.deadTex = shellTex(W, false);
    st.zeye = (W.zombieParts('plain') || []).map(p => p[1]).find(m => m && m.blending === THREE.AdditiveBlending) || null;   // the game's glow round the eyes, shared
    st.ledMat = ownMat(new THREE.MeshBasicMaterial({ color: 0xff6a50 }));
    st.dead = KEEN.map((q, i) => keen(W, q, i));

    W.say('Nee.', W.bike, { from: 3.05, to: CUT - 0.12, dy: 2.42 });
    // the second picture is drawn once now, under the black, so its shaders, textures and buffers are ready at the cut
    if (W.render) { W.cam(CAM2[0], CAM2[1], CAM2[2], HX, 1.25, -7, FOV2); W.render(); }
  }

  // one of the dead in a bright bicycle helmet with a blinking light at the back, on foot or already on a bike
  function keen(W, q, i) {
    const THREE = W.THREE, [x, z, v, col, kind] = q;
    const root = new THREE.Group(), lean = new THREE.Group(); root.add(lean);
    const body = kind === 'cheer' ? cheerFigure(W) : W.zombie(v); body.rotation.set(0, 0, 0);
    if (kind === 'bike') {
      const bike = W.bikeProp(); bike.rotation.set(0, 0, 0); lean.add(bike);
      body.scale.setScalar(0.9); body.position.set(0, 0.45, 0.1);
      const fl = new THREE.Sprite(ownMat(W.GlowMat(W.glowTex, 0xfff0d6, 0.75, true))); fl.position.set(0, 0.86, -0.66); fl.scale.set(0.42, 0.42, 1); lean.add(fl);
      const rl = new THREE.Sprite(ownMat(W.GlowMat(W.glowTex, 0xff2a14, 0.85, true))); rl.position.set(0, 0.74, 0.78); rl.scale.set(0.4, 0.4, 1); lean.add(rl);
    }
    lean.add(body);
    const hm = ownMat(W.Mat({ color: col, map: st.deadTex, emissive: col, emissiveMap: st.deadTex, emissiveIntensity: 0.62 }));
    const hd = body.userData.hd || [0, 1.68, -0.64];
    const h = new THREE.Group(); h.position.set(0, hd[1] + 0.08, hd[2] + 0.04); h.rotation.x = 0.16; body.add(h);
    h.add(new THREE.Mesh(st.shellS, hm));
    const vis = new THREE.Mesh(W.KG.box, st.visorMat); vis.position.set(0, 0.06, -0.17); vis.rotation.x = -0.3; vis.scale.set(0.2, 0.014, 0.06); h.add(vis);
    const led = new THREE.Mesh(W.KG.box, st.ledMat); led.position.set(0, 0.0, 0.215); led.scale.set(0.05, 0.022, 0.014); h.add(led);
    const blink = new THREE.Sprite(ownMat(W.GlowMat(W.glowTex, 0xff3020, 0.9, true))); blink.position.set(0, 0.005, 0.235); blink.scale.set(0.34, 0.34, 1); h.add(blink);
    if (kind === 'phone') { const screen = new THREE.Sprite(ownMat(W.GlowMat(W.glowTex, 0x7fd8f0, 0.5, true))); screen.position.set(0.27, 0.74, -0.74); screen.scale.set(0.5, 0.5, 1); body.add(screen); }
    st.props.push(W.add(root, x, 0, z));
    return { root, lean, body, blink, kind, x, z, ph: i * 1.37 + 0.4, yaw: Math.PI, rolled: false, arms: body.userData.arms || null };
  }
  // one of the dead from the same parts as the game's, but standing up straight with both arms in the air: cheering him on. The
  // arms hang from a pivot at the shoulders, so they can wave
  function cheerFigure(W) {
    const k = W.kit(), ka = W.kit(), sk = W.pick(W.PK.skin), hip = [0, 1.0, 0.0], sh = [0, 1.64, -0.18], hd = [0, 1.79, -0.36];
    W.ktube(k, sk, ...hip, ...sh, 0.15);
    W.kadd(k, W.KG.ball, sk, 0, (hip[1] + sh[1]) / 2 + 0.05, (hip[2] + sh[2]) / 2 + 0.04, 0.3, 0, 0, 0.42, 0.56, 0.34);
    W.kb(k, sk, 0, sh[1], sh[2], 0.5, 0.11, 0.17);
    W.ktube(k, sk, ...sh, 0, hd[1] - 0.05, hd[2] + 0.08, 0.045);
    W.kadd(k, W.KG.ball, sk, ...hd, 0, 0, 0, 0.22, 0.27, 0.25);
    W.kb(k, W.PK.jaw, 0, hd[1] - 0.1, hd[2] - 0.07, 0.12, 0.05, 0.08);
    for (const sx of [-1, 1]) W.kadd(k, W.KG.ball, W.PM.eyeGlow, sx * 0.052, hd[1] + 0.03, hd[2] - 0.12, 0, 0, 0, 0.055, 0.045, 0.04);
    if (st.zeye) W.kadd(k, W.KG.plane, st.zeye, 0, hd[1] + 0.03, hd[2] - 0.16, 0, 0, 0, 0.55, 0.3);
    for (const sx of [-1, 1]) {
      const hx = sx * 0.11, knee = [hx * 1.1, 0.53, -0.08], foot = [hx * 1.15, 0.07, 0.06];
      W.ktube(k, sk, hx, hip[1], hip[2], ...knee, 0.085); W.ktube(k, sk, ...knee, ...foot, 0.062); W.kb(k, sk, foot[0], 0.04, foot[2] - 0.08, 0.11, 0.07, 0.25);
      const elbow = [sx * 0.43, 0.34, -0.06], hand = [sx * 0.37, 0.74, -0.1];
      W.ktube(ka, sk, sx * 0.25, 0, 0, ...elbow, 0.062); W.ktube(ka, sk, ...elbow, ...hand, 0.05); W.kadd(ka, W.KG.ball, sk, hand[0], hand[1] + 0.08, hand[2], 0, 0, 0, 0.08, 0.18, 0.07);
    }
    const g = W.kbuild(k), arms = W.kbuild(ka); arms.position.set(...sh); g.add(arms);
    g.userData.hd = hd; g.userData.arms = arms;
    return g;
  }

  // the lens: wide screens get the design's field of view; a narrow picture widens it until MIN_HALF_W shows on each side of the
  // middle, a short one (a phone on its side) until MIN_HALF_V shows above and below it in the band between the bars
  function lens(W, fov, halfW) {
    const asp = W.camera.aspect || 1.6, v = W.camera.view, band = v && v.enabled ? W.clamp((0.82 * innerHeight - 2 * v.offsetY) / innerHeight, 0.2, 1) : 0.7;
    return Math.max(fov, 2 * Math.atan(Math.tan((halfW || MIN_HALF_W) * DEG) / asp) / DEG, 2 * Math.atan(Math.tan(MIN_HALF_V * DEG) / band) / DEG);
  }
  const wideness = W => W.clamp(((W.camera.aspect || 1.6) - 0.8) / 0.8, 0, 1);
  function shoot(W, c, l, fov, shift, halfW) {
    const sh = shift * wideness(W);
    const fx = l[0] - c[0], fz = l[2] - c[2], n = Math.hypot(fx, fz) || 1;
    W.cam(c[0], c[1], c[2], l[0] - fz / n * sh, l[1], l[2] + fx / n * sh, lens(W, fov, halfW));
  }

  C[12] = {
    hold: 9.6,
    build(W) {
      st = { mats: [], tex: [], geo: [], props: [], coat: [], dead: [], s: 0 };
      const rand0 = Math.random; Math.random = rng(SEED);
      try { build(W); } finally { Math.random = rand0; }
      this.update(W, 0, 0);
    },
    update(W, t, dt) {
      if (!st || !st.helmet) return;
      const b = W.bike, u = b.userData;
      // him: still by the door, then off down the street, out onto the road and to the right of its middle. Pushing off he
      // wobbles toward the wall for a moment, and his shoulder catches the helmet
      let v = 0;
      if (t >= GO) { v = V * ease(W, t, GO, 1.7); st.s += v * dt; }
      const s = st.s, q = W.clamp(s / 11, 0, 1), bx = HX + (XR - HX) * W.smooth(q), bz = -s;
      const dxds = (XR - HX) * 6 * q * (1 - q) / 11, yaw = Math.atan2(-dxds, 1);
      const wob = t > GO ? 0.09 * Math.sin(Math.PI * W.clamp((t - GO) / 0.7, 0, 1)) : 0;
      W.speed(v, 0);
      st.rig.position.set(bx, 0, bz); st.rig.rotation.set(0, yaw, wob - dxds * 0.45 * W.clamp(v / V, 0, 1));
      b.position.set(0, b.position.y, 0); b.rotation.set(0, 0, 0);
      if (t >= GO && !W.beam.visible) W.beam.visible = true;
      u.lampMesh.visible = u.lampGlow.visible = t >= GO + 0.2;   // a dynamo lamp: dark while he stands, it comes on as he pedals
      if (t < GO + 0.2) W.lampLight.intensity = 0;
      // his lamp: parked, it shines away from the house toward the road; riding, down the street ahead of him
      const L = W.lampLight, ride = ease(W, t, GO, 0.8), aim = yaw - 0.36 * (1 - ride), fwx = -Math.sin(yaw), fwz = -Math.cos(yaw);
      L.position.set(bx - fwx * 0.4, 1.1, bz - fwz * 0.4); L.target.position.set(bx - Math.sin(aim) * 20, 0.2, bz - Math.cos(aim) * 20);
      // his head: across at the keen dead, to the helmet, then to us; riding, ahead
      const h = u.head; h.rotation.order = 'YXZ';
      const a1 = ease(W, t, 1.15, 0.42), a2 = ease(W, t, 2.65, 0.36), a3 = ease(W, t, GO - 0.1, 0.6);
      let hy = W.lerp(W.lerp(-0.78, 1.36, a1), -0.1, a2), hx = W.lerp(W.lerp(0.02, -0.04, a1), -0.08, a2);
      hy = W.lerp(hy, 0, a3); hx = W.lerp(hx, 0, a3);
      h.rotation.y = hy + Math.sin(t * 1.3) * 0.015; h.rotation.x = hx;
      // the helmet: still on its hook until his shoulder catches it, then it swings and turns and slowly settles; the tag after it
      const sw = t - GO - 0.32;
      st.helmet.pivot.rotation.x = sw > 0 ? 0.4 * Math.exp(-sw / 2.6) * Math.sin(sw * 7.2) : 0.012 * Math.sin(t * 1.1);
      st.helmet.pivot.rotation.y = sw > 0 ? 0.55 * Math.exp(-sw / 3.2) * Math.sin(sw * 3.1 + 0.2) - 0.11 * Math.exp(-sw / 3.2) : 0;
      st.helmet.tag.rotation.z = sw > 0 ? 0.4 * Math.exp(-sw / 2.2) * Math.sin(sw * 6.1 - 0.9) : 0.02 * Math.sin(t * 1.7);
      // the lantern breathes a little
      const fl = 1 + 0.04 * Math.sin(t * 9.3) * Math.sin(t * 3.1);
      st.lantern.halo.scale.set(0.75 * fl, 0.75 * fl, 1);
      // the dead: turned to him, bouncing on their toes, quicker when he comes past; the ones on bikes roll after him and stop
      for (const d of st.dead) {
        const dx = bx - d.root.position.x, dz = bz - d.root.position.z, dist = Math.hypot(dx, dz);
        const want = Math.atan2(-dx, -dz), near = W.clamp(1 - (dist - 3) / 9, 0, 1);
        if (d.kind === 'bike') {
          if (!d.rolled && d.z < 0 && bz < d.z + 1.5) { d.rolled = true; d.rollT = t; }
          const r = d.rolled ? 1.2 * ease(W, t, d.rollT + 0.25, 1.3) : 0;
          d.root.position.z = d.z - r; d.root.rotation.y = 0;
          d.body.rotation.y = W.clamp(turnTo(0, want, 1), -1.0, 1.0) * 0.9;
          d.lean.position.y = 0.018 * Math.abs(Math.sin(t * 5.2 + d.ph));
          d.lean.rotation.x = 0.03 * Math.sin(t * 5.2 + d.ph);
        } else {
          d.yaw = dt ? turnTo(d.yaw, want, Math.min(1, dt * 3.2)) : want;
          d.root.rotation.y = d.yaw;
          const hop = (d.arms ? 0.07 : 0.05) * (1 + 0.8 * near) * Math.abs(Math.sin(t * (6.6 + near * 2) + d.ph));
          if (d.arms) d.arms.rotation.z = 0.24 * Math.sin(t * 4.4 + d.ph);
          d.lean.position.y = hop;
          d.lean.rotation.x = d.kind === 'phone' ? W.lerp(-0.14, 0.12, ease(W, t, d.z < 0 ? GO + 1.6 : 1.6, 0.6)) : 0.12 - 0.22 * near + 0.04 * Math.sin(t * 3.3 + d.ph);
          d.body.rotation.z = 0.05 * Math.sin(t * 3.3 + d.ph * 2);
        }
        const on = ((t * 1.8 + d.ph) % 1) < 0.32;
        d.blink.material.opacity = on ? 0.95 : 0.06;
      }
      // the eye: first ahead of him looking back past him up the street, then from behind him down it, following him a little
      if (t < CUT) {
        // a slow push in on him, a little faster toward the Nee.
        const k = W.smooth(W.clamp(t / CUT, 0, 1)) * 0.6 + ease(W, t, 2.4, 2.4) * 0.4, c = [0, 1, 2].map(i => W.lerp(CAM1[i], CAM1B[i], k));
        shoot(W, c, LOOK1, W.lerp(FOV1, FOV1B, k), SHIFT1 * (1 - 0.25 * k));
        W.drift(t, 0.5);
      } else {
        // a wide screen looks down the street with the dead across it and turns after him late; a narrow one starts between the
        // helmet and him and follows him sooner
        const wd = wideness(W), s2 = t - CUT, k = W.smooth(W.clamp(s2 / 6.5, 0, 1)), late = Math.max(0, s2 - 6.5);
        const f = ease(W, t, W.lerp(GO + 0.5, GO + 1.5, wd), W.lerp(3.2, 5.5, wd));
        const c = [0, 1, 2].map(i => W.lerp(CAM2[i], CAM2B[i], k));
        c[1] += late * 0.02;
        const l0 = [W.lerp(-6.0, HX, wd), W.lerp(1.62, 1.25, wd), W.lerp(-0.6, -7, wd)];
        const l = [W.lerp(l0[0], bx + 1.5 * (1 - wd), f * W.lerp(1, 0.8, wd)), W.lerp(l0[1], 1.25, f), W.lerp(l0[2], bz - 7, f * W.lerp(1, 0.9, wd))];
        shoot(W, c, l, W.lerp(FOV2, FOV2B, k), SHIFT2 * (1 - f * 0.55), W.lerp(MIN_HALF_W, 13, f));
        W.drift(t, 0.6);
        W.fog(1 + 0.25 * ease(W, t, CUT + 3, 6));
      }
    },
    dispose(W) {
      // first of all he goes back into the scene, out of the rig
      if (W && W.bike && st && st.rig) { st.rig.remove(W.bike); W.scene.add(W.bike); W.scene.remove(st.rig); W.bike.position.set(0, 0, 0); }
      if (W && W.beam) W.beam.visible = true;
      if (!st) return;
      if (W && W.bike) { const u = W.bike.userData, h = u.head; h.rotation.x = 0; h.rotation.order = 'XYZ'; u.lampMesh.visible = u.lampGlow.visible = true; for (const m of st.coat) m.material = W.M.shirt; }
      // the kits built fresh geometry for this shot (the bikes too); the game's shared parts, the zombies' among them, stay
      const PG = W ? Object.values(W.PG) : [];
      for (const p of st.props) p.traverse(m => { if (m.isMesh && m.geometry && m.geometry.userData.kit && !PG.includes(m.geometry)) m.geometry.dispose(); });
      for (const g of st.geo) g.dispose();
      for (const m of st.mats) m.dispose();
      for (const t of st.tex) t.dispose();
      st = null;
    },
  };
})();
