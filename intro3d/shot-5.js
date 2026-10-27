// Intro panel 5 in 3D: "Or the millionth tourist who said it sounds like a drunk German."
// Amsterdam at night, on a canal. Over the water a hump-backed brick bridge strung with bulbs, and over its crown, on two
// flag poles, a banner in the national colours for the millionth tourist; the confetti is still coming down. Two beats:
// 1. 0 to 2.9 s: he holds his phone up for a selfie under the banner, the flash goes at 0.9 s, and he says it.
// 2. From 2.9 s: the camera backs away over the black water while the city turns to him. The locals on the bridge come
//    round one by one and lean in, eyes open in the dark under the arch, on the far quay and in the lit windows, all of
//    them on him. He notices nothing and takes a second photo at 6.3 s.
// The lights of the bridge, the lanterns and the windows lie in the water as rippled streaks, one batch re-aimed at the
// eye every frame; the eyes are one batch of glows. The theme's own canal side is dealt at random, so it is cleared and
// this set is built in its place.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  // the set in world metres: open water from x 7.75 to 31.15; the bridge crosses it on the line z = ZB
  const ZB = -20, XA = 4.6, XB = 34.4, XC = (XA + XB) / 2, HL = (XB - XA) / 2;
  const YC = 2.2, BW = 3.8, RA = 4.7, HA = 2.0, SPRING = -0.4;      // deck at the crown, deck width, the arch: half span, rise, springing
  const WX0 = 7.75, WX1 = 31.15, FQ = 36.6;                            // the banks; the far quay's facades
  const TX = XC + 0.2, TZ = ZB + 0.85;                                 // the tourist
  const FLASH = 0.9, FLASH2 = 6.3, CUT = 2.9, END = 7.6;
  const deckY = x => { const u = Math.min(1, Math.abs(x - XC) / HL); return 0.06 + (YC - 0.06) * Math.pow(1 - u * u, 1.5); };
  const seq = s => () => (s = (s * 16807) % 2147483647) / 2147483647;   // a fixed sequence: every run lights the same windows
  const eyeA = (t, on) => { const k = t - on; return k < 0 || (k > 0.1 && k < 0.17) ? 0 : Math.min(1, k / 0.08); };   // on, a blink, on
  const pulse = (t, at, k) => (t >= at ? Math.exp(-(t - at) * k) : 0);
  let st = null;

  // the bridge body: one extruded profile, the arch cut out of it, then coping, railings, bulbs and their halos
  function bridge(W, k, z0, brick, bulbM, haloM, lights, dense) {
    const T = W.THREE, sh = new T.Shape();
    sh.moveTo(XA, -0.45); sh.lineTo(XC - RA, -0.45);
    for (let i = 1; i < 32; i++) { const th = Math.PI * (1 - i / 32); sh.lineTo(XC + RA * Math.cos(th), SPRING + HA * Math.sin(th)); }
    sh.lineTo(XC + RA, -0.45); sh.lineTo(XB, -0.45);
    for (let i = 0; i <= 60; i++) { const x = XB - (XB - XA) * i / 60; sh.lineTo(x, deckY(x)); }
    const body = new T.ExtrudeGeometry(sh, { depth: BW, bevelEnabled: false, curveSegments: 1 });
    W.kadd(k, body, brick, 0, 0, z0 - BW / 2); body.dispose();
    const N = 40;
    for (const s of [-1, 1]) for (let i = 0; i < N; i++) {
      const x0 = XA + (XB - XA) * i / N, x1 = XA + (XB - XA) * (i + 1) / N, y0 = deckY(x0), y1 = deckY(x1);
      const len = Math.hypot(x1 - x0, y1 - y0) + 0.02, a = Math.atan2(y1 - y0, x1 - x0), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      W.kb(k, W.PM.stone, mx, my + 0.08, z0 + s * (BW / 2 - 0.05), len, 0.18, 0.36, 0, 0, a);
      W.kb(k, W.PM.pole, mx, my + 1.06, z0 + s * (BW / 2 - 0.1), len, 0.06, 0.06, 0, 0, a);
      W.kb(k, W.PM.pole, mx, my + 0.3, z0 + s * (BW / 2 - 0.1), len, 0.04, 0.04, 0, 0, a);
      for (let j = 0; j < 4; j++) { const x = x0 + (x1 - x0) * (j + 0.5) / 4; W.kb(k, W.PM.pole, x, deckY(x) + 0.64, z0 + s * (BW / 2 - 0.1), 0.026, 0.84, 0.026); }
    }
    // the Amsterdam bulbs: round the arch and along the cornice, on the face toward the eye
    const fz = z0 + BW / 2 + 0.06, pts = [];
    for (let i = 0; i < 25; i++) { const th = Math.PI * (0.06 + 0.88 * i / 24); pts.push([XC + (RA + 0.3) * Math.cos(th), SPRING + (HA + 0.3) * Math.sin(th)]); }
    for (let x = 6.3; x < 32.8; x += 0.62) pts.push([x, deckY(x) - 0.15]);
    pts.forEach(([x, y], i) => {
      W.kadd(k, W.KG.ball, bulbM, x, y, fz, 0, 0, 0, 0.08, 0.08, 0.08); W.kadd(k, W.KG.plane, haloM, x, y, fz + 0.04, 0, 0, 0, 0.27, 0.27);
      if (lights && (dense ? i < 25 || i % 2 === 0 : i % 3 === 0)) lights.push({ p: new T.Vector3(x, y, fz), I: !dense ? 0.45 : i < 25 ? 1.5 : 0.6, s: i < 25 ? 0.011 : 0.03, w: i < 25 ? 0.2 : 0.12, c: [1, 0.74, 0.44] });
    });
  }

  function build(W) {
    const T = W.THREE, rnd = seq(7);
    W.stage({ town: 'amsterdam', theme: 'gracht', rider: false, fog: 1.15 });
    W.speed(0);
    st = { geos: [], mats: [], props: [], dead: [], eyes: [], lights: [], trees: [], hidden: [], v: new T.Vector3(), v2: new T.Vector3() };
    // the theme's canal side is cleared for this set, and the walkers too; the nearest band of the game's ground mist stands
    // upright and cuts a hard line where it meets the water, so this shot lays its own on the canal. All of it comes back in dispose.
    for (const o of W.scene.children) if (o.visible && ((o.isGroup && (o.userData.shuffle || (o.position.x > 4.3 && o.position.x < 70))) || (o.isSprite && o.userData.band && o.userData.band.z0 > 0))) { o.visible = false; st.hidden.push(o); }
    const own = m => (st.mats.push(m), m);
    const add = (o, x, y, z, ry) => (st.props.push(o), W.add(o, x, y, z, ry));
    const lights = st.lights;

    // ---- the far quay: a stone quay and a row of canal houses, merged into one kit
    const qk = W.kit(), quay = new T.Group();
    W.kb(qk, W.PM.stone, 39, -0.02, ZB - 40, 15.7, 0.16, 170); W.kb(qk, W.PM.stone, 31.4, 0.07, ZB - 40, 0.5, 0.14, 170);
    W.kbuild(qk, quay); add(quay, 0, 0, 0);
    const rk = W.kit(), row = new T.Group();
    const H = [11.6, 10.2, 12.6, 9.6, 11.2, 12.2, 10.4, 12.8, 10.6, 11.8, 9.8, 12.4, 11.0, 10.4];
    const GAB = ['bell', 'neck', 'step', 'spout', 'bell', 'step', 'neck', 'bell', 'spout', 'neck', 'step', 'bell', 'neck', 'step'];
    const BR = [0x3b2f2b, 0x4a3a35, 0x2e2a30, 0x5a4038, 0x1f1c22];
    const wins = [];
    for (let i = 0; i < H.length; i++) {
      const w = 3.5 + (i % 3) * 0.35, oz = ZB + 13 - i * 6.05;
      W.house({ k: rk, g: row, w, h: H[i], gable: GAB[i], brick: BR[i % 5], lit: 0, peer: false, ox: FQ + w / 2, oz });
      const rows = Math.max(1, Math.round((H[i] - 1.2) / 2.3));
      for (let r = 0; r < rows; r++) for (let c = 0; c < 3; c++) if (!(r === 0 && c === 2)) wins.push({ y: 1.9 + r * 2.3, z: oz - 1.95 + c * 2.1, r });
    }
    rk.base.identity();
    const winHalo = own(W.GlowMat(W.glowTex, 0xffb466, 0.5));
    const sil = (() => {   // head and shoulders, all its UVs on the atlas's one dark texel, so it costs no draw call
      const s = new T.Shape(); s.moveTo(-0.36, 0); s.lineTo(0.36, 0); s.quadraticCurveTo(0.36, 0.42, 0.12, 0.47); s.lineTo(0.08, 0.55);
      s.absellipse(0, 0.7, 0.12, 0.15, -1.1, Math.PI + 1.1, false); s.lineTo(-0.12, 0.47); s.quadraticCurveTo(-0.36, 0.42, -0.36, 0);
      const g = new T.ShapeGeometry(s), uv = g.attributes.uv, du = W.PG.catA.attributes.uv.getX(0), dv = W.PG.catA.attributes.uv.getY(0);
      for (let j = 0; j < uv.count; j++) uv.setXY(j, du, dv); return g;
    })();
    const watchers = [];
    for (const wn of wins) {
      const lit = rnd() < (wn.r === 0 ? 0.2 : 0.33); if (!lit) continue;
      W.kadd(rk, W.PG['win' + [0, 0, 1, 1, 2][Math.floor(rnd() * 5)]], W.PM.winAtlas, FQ - 0.02, wn.y, wn.z, 0, -Math.PI / 2, 0, 0.95, 1.5);
      W.kadd(rk, W.KG.plane, winHalo, FQ - 0.07, wn.y, wn.z, 0, -Math.PI / 2, 0, 2.2, 2.6);
      lights.push({ p: new T.Vector3(FQ - 0.2, wn.y, wn.z), w: 0.6, I: 0.55, s: 0.032, c: [1, 0.6, 0.26] });
      if (wn.r >= 1 && wn.z < ZB - 7 && wn.z > ZB - 48 && rnd() < 0.55) watchers.push(wn);
    }
    watchers.forEach((wn, i) => {
      W.kadd(rk, sil, W.PM.winAtlas, FQ - 0.03, wn.y - 0.74, wn.z, 0, -Math.PI / 2, 0, 1, 1, 1);
      st.eyes.push({ a: new T.Vector3(FQ - 0.06, wn.y - 0.05, wn.z - 0.055), b: new T.Vector3(FQ - 0.06, wn.y - 0.05, wn.z + 0.055), k: 1, on: 4.3 + i * 0.24 });
    });
    sil.dispose();
    W.kbuild(rk, row); add(row, 0, 0, 0);
    let brick = null; row.traverse(m => { if (!brick && m.isMesh && m.material.userData.wuv === 2.6 && m.material.side === T.FrontSide) brick = m.material; });

    // ---- the bridge, and a second one down the canal in the haze
    const bulbM = own(new T.MeshBasicMaterial({ color: 0xfff2dc, fog: false })), haloM = own(W.GlowMat(W.glowTex, 0xffa456, 0.42));
    const bulbFar = own(new T.MeshBasicMaterial({ color: 0xffd29a })), haloFar = own(W.GlowMat(W.glowTex, 0xffb258, 0.45));
    const bk = W.kit(); bridge(W, bk, ZB, brick, bulbM, haloM, lights, true); const br = W.kbuild(bk, new T.Group()); add(br, 0, 0, 0);
    const bk2 = W.kit(); bridge(W, bk2, ZB - 46, brick, bulbFar, haloFar, lights, false); add(W.kbuild(bk2, new T.Group()), 0, 0, 0);

    // ---- lanterns: two either side of him, two at the bridge's feet, more along both quays
    const lantern = (x, y, z, decals, ry) => {
      const l = W.lamppost(); l.traverse(m => { if (m.geometry === W.PG.pool || (!decals && m.geometry === W.PG.streak)) m.visible = false; });
      add(l, x, y, z, ry || 0); lights.push({ p: new T.Vector3(x, y + 3.37, z), w: 0.6, I: 2.1, s: 0.075, c: [1, 0.8, 0.52] }); return l;
    };
    for (const x of [XC - 2.6, XC + 2.6, 8.7, 30.3]) lantern(x, deckY(x), ZB + 1.78, false);
    for (const z of [ZB + 12, ZB - 9, ZB - 31, ZB - 56]) lantern(7.25, 0.05, z, true);
    for (const z of [ZB + 9, ZB - 12, ZB - 33, ZB - 58]) lantern(31.9, 0.06, z, true, Math.PI);

    // ---- the banner for the occasion on two flag poles, high enough to leave room for his words, and bunting down to the bridge's feet
    const bc = document.createElement('canvas'); bc.width = 1024; bc.height = 200; const g = bc.getContext('2d');
    g.fillStyle = '#8e2b26'; g.fillRect(0, 0, 1024, 46); g.fillStyle = '#ddd6c6'; g.fillRect(0, 46, 1024, 108); g.fillStyle = '#26396a'; g.fillRect(0, 154, 1024, 46);
    let fs = 92; do { g.font = `900 ${fs}px "Segoe UI", system-ui, sans-serif`; fs -= 2; } while (g.measureText('1.000.000e TOERIST').width > 940);
    g.fillStyle = '#161a2a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('1.000.000e TOERIST', 512, 103);
    const btex = new T.CanvasTexture(bc); btex.colorSpace = T.SRGBColorSpace; btex.anisotropy = 4;
    const bgeo = new T.PlaneGeometry(4.7, 0.9, 16, 1), bp = bgeo.attributes.position;
    for (let i = 0; i < bp.count; i++) { const u = bp.getX(i) / 4.7 + 0.5; bp.setY(i, bp.getY(i) - 0.12 * Math.sin(Math.PI * u)); bp.setZ(i, 0.05 * Math.sin(Math.PI * 2 * u)); }
    bgeo.computeVertexNormals(); st.geos.push(bgeo);
    const banner = new T.Mesh(bgeo, W.Mat({ map: btex, emissive: 0xffffff, emissiveMap: btex, emissiveIntensity: 0.55, side: T.DoubleSide }));
    banner.userData.ownTex = true; add(banner, XC, YC + 4.1, ZB + 1.8, 0);
    const tri = new T.BufferGeometry();
    tri.setAttribute('position', new T.Float32BufferAttribute([-0.12, 0, 0, 0.12, 0, 0, 0, -0.3, 0], 3)); tri.setAttribute('normal', new T.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 0, 0, 1], 3)); tri.setAttribute('uv', new T.Float32BufferAttribute([0, 1, 1, 1, 0.5, 0], 2));
    const flagM = [0x8a2a26, 0xcfc8b8, 0x2a3c6a].map(c => own(W.Mat({ color: c, emissive: c, emissiveIntensity: 0.3, side: T.DoubleSide })));
    const fk = W.kit(), poleM = own(W.Mat({ color: 0xb4b8bc }));
    for (const s of [-1, 1]) {
      const x = XC + s * 2.42; W.kadd(fk, W.KG.cyl, poleM, x, YC + 2.38, ZB + 1.8, 0, 0, 0, 0.07, 4.75, 0.07); W.kadd(fk, W.KG.ball, poleM, x, YC + 4.79, ZB + 1.8, 0, 0, 0, 0.11, 0.11, 0.11);
      flagM.forEach((m, j) => W.kb(fk, m, x + s * 0.31, YC + 4.62 - j * 0.11, ZB + 1.8, 0.56, 0.11, 0.012));
    }
    const string = (ax, ay, bx, by, z, sag) => {
      const n = Math.max(4, Math.round(Math.hypot(bx - ax, by - ay) / 0.5)); let px = ax, py = ay;
      for (let i = 1; i <= n; i++) { const u = i / n, x = ax + (bx - ax) * u, y = ay + (by - ay) * u - sag * Math.sin(Math.PI * u); W.ktube(fk, W.PM.pole, px, py, z, x, y, z, 0.012); if (i < n) W.kadd(fk, tri, flagM[i % 3], x, y, z); px = x; py = y; }
    };
    string(XC - 2.42, YC + 4.68, 8.7, deckY(8.7) + 3.95, ZB + 1.8, 0.6); string(XC + 2.42, YC + 4.68, 30.3, deckY(30.3) + 3.95, ZB + 1.8, 0.6);
    add(W.kbuild(fk, new T.Group()), 0, 0, 0); tri.dispose();

    // ---- the millionth tourist: a pale soul in a teal coat, a cream bucket hat, the phone up for the selfie
    const tour = W.ghostFigure(false, 'phone', false, 5); tour.scale.setScalar(0.9);
    const hk = W.kit(); W.kadd(hk, W.KG.cyl, W.PK.linen, 0, 2.22, 0.01, 0, 0, 0, 0.38, 0.18, 0.38); W.kadd(hk, W.KG.cyl, W.PK.linen, 0, 2.13, 0.01, 0, 0, 0, 0.62, 0.035, 0.62); W.kbuild(hk, tour);
    const aura = own(W.GlowMat(W.glowTex, 0x8fb0e0, 0.28, true)); tour.traverse(m => { if (m.isSprite) { m.material = aura; m.scale.set(1.6, 2.6, 1); } });
    add(tour, TX, YC, TZ, -0.22); st.tour = tour;   // turned a little toward his phone
    st.flashM = own(W.GlowMat(W.glowTex, 0xffffff, 0, true)); st.flashS = new T.Sprite(st.flashM); add(st.flashS, 0, -50, 0);
    W.say('It sounds like a drunk German.', tour, { from: 1.1, to: 3.8, dy: 2.2 });

    // ---- the locals: on the bridge with their backs to us, and on the far quay looking at the water
    const dead = (x, y, z, v, s, yaw0, at) => {
      const d = W.zombie(v); d.rotation.order = 'YXZ'; d.rotation.set(0, yaw0, 0); d.scale.setScalar(s);
      const eyes = []; d.traverse(m => { if (!m.isMesh) return; if (m.material === W.PM.eyeGlow) { eyes.push(m); m.visible = false; } else if (m.material.map === W.glowTex) m.visible = false; });
      add(d, x, y, z);
      let dr = Math.atan2(-(TX - x), -(TZ - z)) - yaw0; dr = Math.atan2(Math.sin(dr), Math.cos(dr));
      st.dead.push({ d, yaw0, dr, at, eyes, sway: 0.9 + rnd() * 0.7, ph: rnd() * 6 });
      st.eyes.push({ d, k: s, on: at + 0.62 });
    };
    for (const [x, z, v, s, at] of [[XC - 1.5, ZB - 1.05, 'bonnet', 1.06, 2.3], [XC + 1.65, ZB - 0.95, 'hat', 1.1, 2.75], [XC - 4.4, ZB - 0.75, 'plain', 1.05, 3.2], [XC + 4.5, ZB - 0.6, 'scarf', 1.04, 3.5]]) dead(x, deckY(x), z, v, s, 0, at);
    for (const [x, z, v, s, at] of [[XC - 7.6, ZB - 1.0, 'hat', 1.05, 3.9], [XC + 7.5, ZB - 0.9, 'bonnet', 1.04, 4.3], [XC + 10.7, ZB - 0.8, 'plain', 1.02, 4.85], [XC - 10.4, ZB - 0.9, 'scarf', 1.03, 5.2]]) dead(x, deckY(x), z, v, s, 0, at);
    for (const [x, z, v, at] of [[32.2, ZB - 7.5, 'bonnet', 4.25], [32.4, ZB - 16, 'hat', 4.8], [32.0, ZB - 27, 'plain', 5.1]]) dead(x, 0.06, z, v, 1.05, Math.PI / 2, at);
    // under the arch, in the dark over the water: nothing but eyes, opening one pair at a time and bobbing a little
    [[XC - 2.8, 0.62, ZB + 0.9, 3.55], [XC + 1.0, 0.9, ZB + 0.2, 3.85], [XC + 3.2, 0.48, ZB + 1.2, 4.15], [XC - 0.9, 0.36, ZB + 1.5, 4.45], [XC + 2.1, 1.1, ZB - 0.6, 5.0]].forEach(([x, y, z, on], i) => {
      st.eyes.push({ a: new T.Vector3(x - 0.06, y, z), b: new T.Vector3(x + 0.06, y, z), k: 1, on, bob: i + 1 });
    });

    // ---- boats along the quays, trees on the far quay
    for (const [x, z] of [[9.5, ZB + 8.5], [9.6, ZB - 13], [29.4, ZB - 19]]) add(W.boat(), x, 0.6, z, 0);
    for (const [x, z] of [[33.8, ZB - 52], [6.2, ZB - 40]]) st.trees.push(add(W.treeCard([1]), x, 0.06, z, 0));

    // ---- mist off the water: flat layers lying on the canal, so they meet it without an edge; in beat 2 they thicken and climb
    const mc = document.createElement('canvas'); mc.width = mc.height = 256; const mg = mc.getContext('2d');
    for (let i = 0; i < 80; i++) { const x = 34 + rnd() * 188, y = 34 + rnd() * 188, r = 16 + rnd() * 44, gr = mg.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,255,255,${(0.08 + rnd() * 0.14).toFixed(3)})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); mg.fillStyle = gr; mg.fillRect(x - r, y - r, 2 * r, 2 * r); }
    st.mist = [0, 1].map(i => {
      const tex = new T.CanvasTexture(mc); tex.wrapS = T.RepeatWrapping; tex.repeat.set(i ? 1.4 : 1, 1); tex.offset.set(i * 0.37, i * 0.21);
      const geo = new T.PlaneGeometry(31, 66); st.geos.push(geo);
      const pl = new T.Mesh(geo, new T.MeshBasicMaterial({ map: tex, color: 0x7d8996, transparent: true, opacity: 0, depthWrite: false }));
      pl.rotation.x = -Math.PI / 2; pl.renderOrder = 2; pl.userData.ownTex = true; return add(pl, XC, 0.2, ZB - 6);
    });

    // ---- the water: the lights as rippled streaks, one quad strip of five rows per light, re-aimed every frame
    const rc = document.createElement('canvas'); rc.width = 64; rc.height = 256; const rg = rc.getContext('2d');
    rg.fillStyle = '#000'; rg.fillRect(0, 0, 64, 256);
    // ripples: short bright dashes of changing width with dark water between them; every frequency fits 256 px, so it tiles
    const TAU = Math.PI * 2 / 256;
    for (let y = 0; y < 256; y++) {
      const s = 0.62 * Math.sin(y * TAU * 13) + 0.38 * Math.sin(y * TAU * 5 + 1) + 0.3 * Math.sin(y * TAU * 31 + 2);
      const a = Math.pow(Math.max(0, Math.min(1, s)), 1.4), w = 5 + 20 * Math.abs(Math.sin(y * TAU * 7 + 2)) * (0.4 + 0.6 * a), c = 32 + 5 * Math.sin(y * TAU * 3);
      if (a < 0.02) continue;
      const gr = rg.createLinearGradient(c - w, 0, c + w, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${a.toFixed(3)})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      rg.fillStyle = gr; rg.fillRect(0, y, 64, 1);
    }
    const rtex = new T.CanvasTexture(rc); rtex.wrapT = T.RepeatWrapping;
    const NL = lights.length, rpos = new Float32Array(NL * 30), rcol = new Float32Array(NL * 30), ruv = new Float32Array(NL * 20), ridx = [];
    for (let i = 0; i < NL; i++) { const o = i * 10; for (let r = 0; r < 4; r++) { const a = o + r * 2; ridx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } lights[i].seed = rnd() * 10; }
    const rgeo = new T.BufferGeometry(); rgeo.setAttribute('position', new T.BufferAttribute(rpos, 3)); rgeo.setAttribute('color', new T.BufferAttribute(rcol, 3)); rgeo.setAttribute('uv', new T.BufferAttribute(ruv, 2)); rgeo.setIndex(ridx); st.geos.push(rgeo);
    const refl = new T.Mesh(rgeo, W.GlowMat(rtex, 0xffffff, 1, false, { vertexColors: true, side: T.DoubleSide }));
    refl.userData.ownTex = true; refl.frustumCulled = false; refl.renderOrder = 3; add(refl, 0, 0, 0); st.refl = { pos: rpos, col: rcol, uv: ruv, geo: rgeo };

    // ---- the eyes: a soft glow and two hot points per pair, camera-facing, one batch
    const NE = st.eyes.length * 3, epos = new Float32Array(NE * 12), ecol = new Float32Array(NE * 12), euv = new Float32Array(NE * 8), eidx = [];
    for (let i = 0; i < NE; i++) { euv.set([0, 0, 1, 0, 1, 1, 0, 1], i * 8); const a = i * 4; eidx.push(a, a + 1, a + 2, a, a + 2, a + 3); }
    const egeo = new T.BufferGeometry(); egeo.setAttribute('position', new T.BufferAttribute(epos, 3)); egeo.setAttribute('color', new T.BufferAttribute(ecol, 3)); egeo.setAttribute('uv', new T.BufferAttribute(euv, 2)); egeo.setIndex(eidx); st.geos.push(egeo);
    const eyeM = own(W.GlowMat(W.glowTex, 0xffffff, 1, false, { vertexColors: true, side: T.DoubleSide }));
    const eyes = new T.Mesh(egeo, eyeM); eyes.frustumCulled = false; eyes.renderOrder = 6; add(eyes, 0, 0, 0); st.eye = { pos: epos, col: ecol, geo: egeo };

    // ---- confetti, still coming down round the banner
    const NC = 72, cpos = new Float32Array(NC * 12), ccol = new Float32Array(NC * 12), cidx = [];
    for (let i = 0; i < NC; i++) { const a = i * 4; cidx.push(a, a + 1, a + 2, a, a + 2, a + 3); }
    const cgeo = new T.BufferGeometry(); cgeo.setAttribute('position', new T.BufferAttribute(cpos, 3)); cgeo.setAttribute('color', new T.BufferAttribute(ccol, 3)); cgeo.setIndex(cidx); st.geos.push(cgeo);
    const conf = new T.Mesh(cgeo, own(new T.MeshBasicMaterial({ vertexColors: true, side: T.DoubleSide }))); conf.frustumCulled = false; add(conf, 0, 0, 0);
    const CC = [[0.52, 0.15, 0.13], [0.74, 0.71, 0.66], [0.16, 0.23, 0.46]];
    st.conf = { pos: cpos, col: ccol, geo: cgeo, p: [] };
    for (let i = 0; i < NC; i++) st.conf.p.push({ x: XC + (rnd() - 0.5) * 9.5, z: ZB + 0.4 + rnd() * 3.6, y0: rnd() * 6, v: 0.3 + rnd() * 0.22, ph: rnd() * 6.28, w: 2 + rnd() * 3, c: CC[i % 3] });

    // ---- his flash borrows the game's lamp light: saved here, given back in dispose
    st.lamp = { pos: W.lampLight.position.clone(), tgt: W.lampLight.target.position.clone(), angle: W.lampLight.angle, distance: W.lampLight.distance, penumbra: W.lampLight.penumbra };
    camera(W, 0, 0); st.band = null;   // the letterbox is laid out after build: the band is measured from the first frame on
  }

  // 1: a long lens from the water on him and the banner; 2: the lens widens and the camera backs away low over the water,
  // then keeps drifting back slower and slower if the panel stays up. An upright phone sees only the middle, so there the
  // lens is widened until the banner fits across.
  function camera(W, t, dt) {
    const L = W.lerp;
    let px, py, pz, lx, ly, lz, fov;
    if (t < CUT) { const k = W.smooth(t / CUT); px = L(18.75, 18.85, k); py = L(2.05, 2.1, k); pz = L(ZB + 16.6, ZB + 15.6, k); lx = TX; ly = YC + 2.05; lz = ZB + 1; fov = 37; }
    else {
      const k = W.smooth(W.clamp((t - CUT) / (END - CUT), 0, 1)), s = Math.max(0, t - END), e = s * s / (s + 1);
      px = L(18.85, 18.3, k) - 0.04 * e; py = L(2.1, 1.7, k) + 0.02 * e; pz = L(ZB + 15.6, ZB + 19.5, k) + 0.12 * e;
      lx = L(TX, XC, k); ly = L(YC + 2.05, 1.95, k); lz = L(ZB + 1, ZB, k); fov = L(37, 47, k);
    }
    // the picture is the band between the top bar and the captions: where it is short (a phone on its side) the lens widens
    // too. The band shrinks when the Dutch line comes in, so the lens follows it slowly instead of jumping.
    const asp = innerWidth / innerHeight, box = document.querySelector('#intro .box'), now = box ? (box.getBoundingClientRect().top - innerHeight * 0.09) / innerHeight : 0.71;
    st.band = st.band == null || !dt ? now : st.band + (now - st.band) * Math.min(1, dt * 1.6);
    const band = st.band, ts = Math.max(asp < 1 ? Math.pow(1 / asp, 0.6) : 1, band > 0.1 && band < 0.71 ? Math.pow(0.71 / band, 0.55) : 1);
    if (ts > 1) fov = 2 * Math.atan(Math.tan(fov * Math.PI / 360) * ts) * 360 / (2 * Math.PI);
    W.cam(px, py, pz, lx, ly, lz, fov); W.drift(t, 0.55); W.camera.updateMatrixWorld();
  }

  function update(W, t, dt) {
    for (const o of st.hidden) o.visible = false;   // a walker that wanders out behind the eye is sent ahead and shown again
    camera(W, t, dt);
    const cam = W.camera.position, v = st.v;
    if (t >= FLASH && t - dt < FLASH) W.flash();
    const f = Math.max(pulse(t, FLASH, 9), 0.6 * pulse(t, FLASH2, 10));
    // the game's lamp light is his phone: its screen lights his face, and the flash fires from it over him, the locals and the banner
    const phone = st.tour.localToWorld(v.set(0.45, 2.42, 0.16));
    W.lampLight.position.set(phone.x, phone.y + 0.25, phone.z + 0.5); W.lampLight.target.position.set(TX, YC + 1.0 - 0.1 * f, TZ - 3 * f);
    W.lampLight.angle = 0.3 + 0.5 * f; W.lampLight.distance = 28; W.lampLight.penumbra = 0.8; W.lampLight.intensity = 9 + 70 * f;
    st.flashS.position.copy(phone); st.flashS.scale.setScalar(0.25 + 2.6 * f); st.flashM.opacity = Math.min(1, f * 1.4);
    // the locals come round, lean in, and their eyes open
    for (const D of st.dead) {
      const k = W.smooth(W.clamp((t - D.at) / 0.9, 0, 1)), l = W.smooth(W.clamp((t - D.at - 0.45) / 0.7, 0, 1));
      D.d.rotation.y = D.yaw0 + D.dr * k; D.d.rotation.x = -0.24 * l; D.d.rotation.z = Math.sin(t * D.sway + D.ph) * 0.035;
      D.d.updateMatrixWorld();
      const on = eyeA(t, D.at + 0.62) > 0; for (const m of D.eyes) m.visible = on;
    }
    for (const tr of st.trees) tr.rotation.y = Math.atan2(cam.x - tr.position.x, cam.z - tr.position.z);
    const mk = W.smooth(W.clamp((t - 2.6) / 4, 0, 1));
    st.mist.forEach((pl, i) => { pl.position.y = (i ? 0.42 : 0.18) + (i ? 0.5 : 0.24) * mk; pl.material.opacity = (i ? 0.1 : 0.12) * mk; pl.material.map.offset.x = (i * 0.37 + t * (i ? 0.006 : 0.004)) % 1; });
    eyes(W, t); water(W, t); confetti(W, t, f);
  }

  // camera-facing quads: the right and up of the eye, from its matrix
  function quad(P, Cc, q, x, y, z, s, m, r, g, b) {
    const rx = m[0] * s, ry = m[1] * s, rz = m[2] * s, ux = m[4] * s, uy = m[5] * s, uz = m[6] * s, o = q * 12;
    P[o] = x - rx - ux; P[o + 1] = y - ry - uy; P[o + 2] = z - rz - uz; P[o + 3] = x + rx - ux; P[o + 4] = y + ry - uy; P[o + 5] = z + rz - uz;
    P[o + 6] = x + rx + ux; P[o + 7] = y + ry + uy; P[o + 8] = z + rz + uz; P[o + 9] = x - rx + ux; P[o + 10] = y - ry + uy; P[o + 11] = z - rz + uz;
    for (let j = 0; j < 4; j++) { Cc[o + j * 3] = r; Cc[o + j * 3 + 1] = g; Cc[o + j * 3 + 2] = b; }
  }
  // eyes keep a least size on screen, a cartoon's eyes: the pair always spreads across the picture, far off enlarged
  function eyes(W, t) {
    const E = st.eye, m = W.camera.matrixWorld.elements, a = st.v, b = st.v2, cam = W.camera.position, px = Math.tan(W.camera.fov * Math.PI / 360) / (innerHeight / 2);
    st.eyes.forEach((it, i) => {
      if (it.d) { it.d.localToWorld(a.set(-0.052, 1.71, -0.79)); it.d.localToWorld(b.set(0.052, 1.71, -0.79)); } else { a.copy(it.a); b.copy(it.b); if (it.bob) { const y = 0.05 * Math.sin(t * 1.3 + it.bob * 1.7); a.y += y; b.y += y; } }
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, mz = (a.z + b.z) / 2, dist = Math.hypot(mx - cam.x, my - cam.y, mz - cam.z);
      const sp = dist * px * Math.min(1.2, Math.max(0.55, innerHeight / 800)), hs = Math.max(0.06 * it.k, sp * 8.5), dot = Math.max(0.08 * it.k, sp * 15), halo = Math.max(0.3 * it.k, sp * 28);
      const al = eyeA(t, it.on), h = al * (0.42 + 0.07 * Math.sin(t * 3 + i)), q = i * 3, e = al * (0.9 + 0.1 * Math.sin(t * 7 + i * 2));
      quad(E.pos, E.col, q, mx, my, mz, halo, m, h * 0.92, h * 0.76, h * 0.05);
      quad(E.pos, E.col, q + 1, mx - m[0] * hs, my - m[1] * hs, mz - m[2] * hs, dot, m, e, e * 0.97, e * 0.28);
      quad(E.pos, E.col, q + 2, mx + m[0] * hs, my + m[1] * hs, mz + m[2] * hs, dot, m, e, e * 0.97, e * 0.28);
    });
    E.geo.attributes.position.needsUpdate = true; E.geo.attributes.color.needsUpdate = true;
  }
  // a light at height h, seen from an eye at height H: its image lies on the water where the line to its mirror image
  // (x, -h, z) crosses y = 0; ripples spread that into a streak between the angles am - s and am + s, clipped to the banks
  const FADE = [0, 0.75, 1, 0.6, 0];
  function water(W, t) {
    const R = st.refl, cam = W.camera.position, H = Math.max(0.3, cam.y), P = R.pos, Cc = R.col, U = R.uv, ds = [0, 0, 0, 0, 0];
    st.lights.forEach((L, i) => {
      let dx = L.p.x - cam.x, dz = L.p.z - cam.z; const D = Math.hypot(dx, dz) || 1e-3; dx /= D; dz /= D;
      const am = Math.atan((H + L.p.y) / D), dm = H / Math.tan(am);
      let dn = H / Math.tan(Math.min(1.5, am + L.s)), df = Math.min(D, H / Math.tan(Math.max(0.01, am - L.s)));
      if (Math.abs(dx) > 1e-4) { const a = (WX0 - cam.x) / dx, b = (WX1 - cam.x) / dx; dn = Math.max(dn, Math.min(a, b)); df = Math.min(df, Math.max(a, b)); }
      const on = df > dn + 0.05 && dm >= dn && dm <= df ? L.I * (0.85 + 0.15 * Math.sin(t * 2.3 + L.seed * 7)) : 0;
      ds[0] = dn; ds[2] = on ? dm : dn; ds[4] = on ? df : dn; ds[1] = (ds[0] + ds[2]) / 2; ds[3] = (ds[2] + ds[4]) / 2;
      const hx = -dz * L.w / 2, hz = dx * L.w / 2, o = i * 30, ou = i * 20;
      for (let r = 0; r < 5; r++) {
        const d = ds[r], x = cam.x + dx * d, z = cam.z + dz * d, c = FADE[r] * on, j = o + r * 6, v = d * 0.8 + L.seed + t * 0.3;
        P[j] = x - hx; P[j + 1] = 0.012; P[j + 2] = z - hz; P[j + 3] = x + hx; P[j + 4] = 0.012; P[j + 5] = z + hz;
        Cc[j] = L.c[0] * c; Cc[j + 1] = L.c[1] * c; Cc[j + 2] = L.c[2] * c; Cc[j + 3] = L.c[0] * c; Cc[j + 4] = L.c[1] * c; Cc[j + 5] = L.c[2] * c;
        U[ou + r * 4] = 0; U[ou + r * 4 + 1] = v; U[ou + r * 4 + 2] = 1; U[ou + r * 4 + 3] = v;
      }
    });
    const A = R.geo.attributes; A.position.needsUpdate = true; A.color.needsUpdate = true; A.uv.needsUpdate = true;
  }
  function confetti(W, t, f) {
    const K = st.conf, P = K.pos, Cc = K.col, top = YC + 5.2, span = YC + 5.4;
    K.p.forEach((p, i) => {
      const y = top - ((p.y0 + p.v * t) % span), x = p.x + Math.sin(t * 1.3 + p.ph) * 0.25, z = p.z + Math.cos(t * 1.1 + p.ph) * 0.2;
      const th = t * p.w + p.ph, be = Math.sin(t * p.w * 0.7 + p.ph) * 1.3, c = Math.cos(th), s = Math.sin(th), sb = Math.sin(be), cb = Math.cos(be);
      const e1x = c * 0.055, e1z = s * 0.055, e2x = -s * sb * 0.038, e2y = cb * 0.038, e2z = c * sb * 0.038, o = i * 12;
      P[o] = x - e1x - e2x; P[o + 1] = y - e2y; P[o + 2] = z - e1z - e2z; P[o + 3] = x + e1x - e2x; P[o + 4] = y - e2y; P[o + 5] = z + e1z - e2z;
      P[o + 6] = x + e1x + e2x; P[o + 7] = y + e2y; P[o + 8] = z + e1z + e2z; P[o + 9] = x - e1x + e2x; P[o + 10] = y + e2y; P[o + 11] = z - e1z + e2z;
      const k = (0.5 + 0.5 * Math.abs(cb)) * (1 + 2.6 * f);
      for (let j = 0; j < 4; j++) { Cc[o + j * 3] = p.c[0] * k; Cc[o + j * 3 + 1] = p.c[1] * k; Cc[o + j * 3 + 2] = p.c[2] * k; }
    });
    K.geo.attributes.position.needsUpdate = true; K.geo.attributes.color.needsUpdate = true;
  }

  function dispose(W) {
    if (!st) return;
    for (const o of st.hidden) o.visible = true;
    const L = st.lamp; W.lampLight.position.copy(L.pos); W.lampLight.target.position.copy(L.tgt); W.lampLight.angle = L.angle; W.lampLight.distance = L.distance; W.lampLight.penumbra = L.penumbra;
    const shared = new Set(Object.values(W.PG));
    for (const o of st.props) o.traverse(m => { if (m.geometry && m.geometry.userData.kit && !shared.has(m.geometry)) m.geometry.dispose(); });
    for (const g of st.geos) g.dispose();
    for (const m of st.mats) m.dispose();
    st = null;
  }

  C[4] = { hold: 7.5, build, update, dispose };
})();