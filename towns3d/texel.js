// Texel: an almost empty island under a real night sky. The dyke levels ride unlit red paths between the dunes on the sea side and
// the flat polder on the other: turf walls boxing in the fields, sheep, schapenboeten with their roofs cut off against the
// southwest wind, and the red Eierland lighthouse on its dune, two white flashes every 10 s, its beams sweeping over you.
// Above it all the Milky Way and the aurora. The square is the harbour of Oudeschild, the shops are Den Burg and De Koog.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  const at = (k, x, y, z, ry) => { k.base.makeRotationY(ry || 0); k.base.setPosition(x, y, z); };   // where the next kit parts go
  const turn = {};   // the copies of one spec are made one after another: this counts them, so a copy knows which one it is
  const nth = (key, n) => { turn[key] = (turn[key] || 0) + 1; return (turn[key] - 1) % n; };

  // ---------- materials and shared parts, made once ----------
  let X = null;
  function tm(K) {
    if (X) return X;
    const THREE = K.THREE, keep = m => { m.userData.shared = true; return m; };
    const canvas = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return c; };
    const tex = (c, srgb) => { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; };
    let s = 31; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    // a tuunwal: sods stacked in courses, each a little paler or darker, grass hanging over the top
    const turf = tex(canvas(128, 128, (g, w, h) => {
      g.fillStyle = 'rgb(150,142,104)'; g.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 16) {   // courses of sods, each a wavy band, the cut face of earth and roots under a lip of grass
        const v = 132 + r() * 46; g.fillStyle = `rgb(${v | 0},${v - 6 | 0},${v - 44 | 0})`; g.beginPath(); g.moveTo(0, y + 3);
        for (let x = 0; x <= w; x += 8) g.lineTo(x, y + 2 + Math.sin(x * 0.11 + y) * 1.6 + r() * 1.2); g.lineTo(w, y + 15); g.lineTo(0, y + 15); g.fill();
        g.fillStyle = 'rgba(40,46,26,0.5)'; for (let x = 0; x < w; x += 2) g.fillRect(x, y + 1 + Math.sin(x * 0.11 + y) * 1.6, 2, 2 + r() * 2);
      }
      for (let i = 0; i < 2200; i++) { g.fillStyle = r() < 0.55 ? 'rgba(26,22,12,0.28)' : 'rgba(255,246,206,0.12)'; g.fillRect(r() * w, r() * h, 1, 1 + r() * 2); }
    }), true);
    // reed thatch: long straws in rows, combed down the slope
    const thatch = tex(canvas(128, 128, (g, w, h) => {
      g.fillStyle = 'rgb(150,140,118)'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) { const x = r() * w, y = r() * h, l = 8 + r() * 20, v = 100 + r() * 90; g.strokeStyle = `rgba(${v | 0},${v - 12 | 0},${v - 34 | 0},0.7)`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 2, y + l); g.stroke(); }
      for (let y = 0; y < h; y += 32) { g.fillStyle = 'rgba(20,16,10,0.35)'; g.fillRect(0, y, w, 3); }
    }), true);
    // marram grass on the dunes: a tuft of thin blades fanning out, pale at the tips
    const marram = tex(canvas(128, 128, g => {
      for (let i = 0; i < 70; i++) { const x0 = 64 + (r() - 0.5) * 30, a = (r() - 0.5) * 1.5, l = 50 + r() * 70, x1 = x0 + Math.sin(a) * l, y1 = 128 - Math.cos(a) * l; const gr = g.createLinearGradient(0, 128, 0, y1); gr.addColorStop(0, 'rgba(120,124,96,1)'); gr.addColorStop(1, 'rgba(226,222,186,1)'); g.strokeStyle = gr; g.lineWidth = 1.2 + r() * 1.4; g.beginPath(); g.moveTo(x0, 128); g.quadraticCurveTo(x0 + (x1 - x0) * 0.3, 128 - l * 0.5, x1, y1); g.stroke(); }
    }));
    marram.colorSpace = THREE.SRGBColorSpace;
    // the lights: a soft round glow on the left half, a pool of light on the right
    const light = tex(canvas(256, 128, g => {
      for (const cx of [64, 192]) { const rg = g.createRadialGradient(cx, 64, 0, cx, 64, 64); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(cx < 128 ? 0.14 : 0.3, `rgba(255,255,255,${cx < 128 ? 0.72 : 0.5})`); rg.addColorStop(0.45, 'rgba(255,255,255,0.16)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.fillRect(cx - 64, 0, 128, 128); }
    }));
    const beam = new THREE.CanvasTexture(canvas(16, 256, g => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.06, 'rgba(255,255,255,0.8)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.28)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 16, 256); }));
    // the green VRIJ sign of the car park near Den Burg that nobody can switch off
    const vrijTex = new THREE.CanvasTexture(canvas(256, 128, g => { g.fillStyle = '#071a0e'; g.fillRect(0, 0, 256, 128); g.fillStyle = '#3cff7a'; g.font = 'bold 74px "Segoe UI", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('VRIJ', 128, 68); g.strokeStyle = '#1f6a3a'; g.lineWidth = 6; g.strokeRect(6, 6, 244, 116); }));
    vrijTex.colorSpace = THREE.SRGBColorSpace;
    // the number on a fishing cutter's bow
    const txTex = new THREE.CanvasTexture(canvas(256, 64, g => { g.fillStyle = '#1b1f26'; g.fillRect(0, 0, 256, 64); g.fillStyle = '#e8e4d8'; g.font = 'bold 44px "Segoe UI", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TX 38', 128, 34); }));
    txTex.colorSpace = THREE.SRGBColorSpace;
    const quad = (u0, u1) => { const p = new THREE.PlaneGeometry(1, 1), uv = p.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, u0 + uv.getX(i) * (u1 - u0)); return p; };
    const tri = new THREE.Shape(); tri.moveTo(-0.5, 0); tri.lineTo(0.5, 0); tri.lineTo(0, 1); tri.closePath();
    // the roof of a schapenboet: a saddle roof with a gable at the door end and a hip down toward the wind at the other
    // (unit: 1 wide at the eaves, 1 long, the ridge 0.7 up; the hip starts 0.62 along)
    const roof = (() => {
      const A = [-0.5, 0, -0.5], B = [0.5, 0, -0.5], C = [0.5, 0, 0.5], D = [-0.5, 0, 0.5], R1 = [0, 0.7, -0.5], R2 = [0, 0.7, 0.12];
      const tris = [A, D, R2, A, R2, R1, B, R1, R2, B, R2, C, D, C, R2];
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(tris.flat(), 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Array(tris.length * 2).fill(0), 2)); geo.computeVertexNormals(); return geo;
    })();
    Object.assign(K.PG, {   // kept in PG, so the cleanup between levels leaves them
      tx_glow: quad(0, 0.5), tx_pool: quad(0.5, 1), tx_tri: new THREE.ShapeGeometry(tri), tx_roof: roof,
      tx_dome: new THREE.SphereGeometry(0.5, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2),
      tx_beam: new THREE.CylinderGeometry(0.5, 7, 120, 14, 1, true).translate(0, -60, 0).rotateZ(Math.PI / 2),
      tx_tower: new THREE.CylinderGeometry(0.42, 0.5, 1, 18, 1),
    });
    X = {
      turf: keep(K.Mat({ color: 0x9a9670, map: turf })), thatch: keep(K.Mat({ color: 0x6e6252, map: thatch })), boet: K.brickMat(0x46302a),
      dune: keep(K.Mat({ color: 0x6e6c5e })), grass: keep(K.Mat({ color: 0x1c241c })),
      marram: keep(K.Mat({ color: 0xb4b294, map: marram, alphaTest: 0.5, side: THREE.DoubleSide })),
      wool: keep(K.Mat({ color: 0xd6d1c2 })), nose: keep(K.Mat({ color: 0x2a2626 })),
      red: keep(K.Mat({ color: 0xc02a20, emissive: 0x4a0a06 })), black: keep(K.Mat({ color: 0x16171a })), white: keep(K.Mat({ color: 0xdedbd0 })),
      glass: keep(new THREE.MeshBasicMaterial({ color: 0xfff2d6 })), door: keep(new THREE.MeshBasicMaterial({ color: 0xffb468 })),
      win: keep(K.GlowMat(light, 0xffb466, 0.5, false)), pool: keep(K.GlowMat(light, 0xffa850, 0.45, false)), green: keep(K.GlowMat(light, 0x3aff7a, 0.85, false, { side: THREE.DoubleSide })),
      beam: keep(K.GlowMat(beam, 0xeef2ff, 0.2, false, { side: THREE.DoubleSide })), farBeam: keep(K.GlowMat(beam, 0xeef2ff, 0.12, false, { side: THREE.DoubleSide, fog: false })),
      lantern: keep(K.GlowMat(K.glowTex, 0xfff0d8, 0.9, true)), farLantern: keep(K.GlowMat(K.glowTex, 0xfff0d8, 0.85, true, { fog: false })),
      flash: keep(K.GlowMat(K.glowTex, 0xffffff, 0, true)), farFlash: keep(K.GlowMat(K.glowTex, 0xffffff, 0, true, { fog: false })),
      vrij: keep(new THREE.MeshBasicMaterial({ map: vrijTex })), tx: keep(K.Mat({ map: txTex, emissive: 0xffffff, emissiveMap: txTex, emissiveIntensity: 0.25 })),
      hull: keep(K.Mat({ color: 0x1d2a3a })), cabin: keep(K.Mat({ color: 0xd2d0c8 })),
      oil: keep(K.Mat({ color: 0xc89c2c, emissive: 0x2a1e05 })), jumper: keep(K.Mat({ color: 0x4c463e })), dark: keep(K.Mat({ color: 0x1c1e22 })),
    };
    X.turf.userData.wuv = 1.4; X.thatch.userData.wuv = 1.6;
    return X;
  }
  // ---------- the island outside the villages ----------
  function tufts(K, k, z, cx, cz, a, h, c, n) {   // marram scattered over a dune of half sizes a, c and height h
    for (let i = 0; i < n; i++) {
      const u = K.rnd(-0.9, 0.9), v = K.rnd(-0.9, 0.9); if (u * u + v * v > 0.8) continue;
      const y = h * Math.sqrt(1 - u * u - v * v) - 0.2, sz = K.rnd(1.1, 2.0), ry = K.rnd(0, 3);
      K.kadd(k, K.KG.plane, z.marram, cx + u * a, y + sz * 0.38, cz + v * c, 0, ry, 0, sz * 1.5, sz * 0.8); K.kadd(k, K.KG.plane, z.marram, cx + u * a, y + sz * 0.38, cz + v * c, 0, ry + 1.57, 0, sz * 1.5, sz * 0.8);
    }
  }
  function dunes(K) {   // the dunes on the sea side, soft and grey, marram on them
    const z = tm(K), k = K.kit(), n = 2 + (Math.random() < 0.5 ? 1 : 0);
    for (let i = 0; i < n; i++) { const a = K.rnd(8, 14), h = K.rnd(5, 12), c = K.rnd(10, 18), x = K.rnd(-5, 5), zz = K.rnd(4, 30); K.kadd(k, K.PG.tx_dome, z.dune, x, 0, zz, 0, 0, 0, a * 2, h * 2, c * 2); tufts(K, k, z, x, zz, a, h, c, 34); }
    return K.kbuild(k);
  }
  function duneFoot(K) {   // the first low dunes right beside the path
    const z = tm(K), k = K.kit(), a = K.rnd(3, 5), h = K.rnd(1.6, 3.4), c = K.rnd(6, 10);
    K.kadd(k, K.PG.tx_dome, z.dune, 0, 0, c, 0, 0, 0, a * 2, h * 2, c * 2); tufts(K, k, z, 0, c, a, h, c, 14);
    return K.kbuild(k);
  }
  // a tuunwal: sods stacked a metre high along the path, every other one turning off across the field, now and then a gate in the gap
  function tuunwal(K) {
    const z = tm(K), k = K.kit(), i = nth('wal', 10);
    K.kb(k, z.turf, 0, 0.5, 12, 1.1, 1.0, 24); K.kb(k, z.grass, 0, 1.04, 12, 0.95, 0.1, 24);
    if (i % 2 === 0) { K.kb(k, z.turf, 14.5, 0.5, 0.6, 28, 1.0, 1.1); K.kb(k, z.grass, 14.5, 1.04, 0.6, 28, 0.1, 0.95); }
    if (i % 3 === 1) { for (const pz of [24.4, 29.6]) K.kb(k, K.M.wood, 0, 0.7, pz, 0.18, 1.4, 0.18); for (let b = 0; b < 4; b++) K.kb(k, K.M.wood, 0.05, 0.35 + b * 0.27, 27, 0.06, 0.09, 5.0); K.ktube(k, K.M.wood, 0.05, 0.3, 24.6, 0.05, 1.15, 29.4, 0.04); }
    return K.kbuild(k);
  }
  function flock(K) {   // Texel sheep, white faced, some grazing, some looking up at you
    const z = tm(K), k = K.kit(), n = 2 + Math.floor(Math.random() * 5);
    for (let i = 0; i < n; i++) {
      const s = K.rnd(0.85, 1.12), graze = Math.random() < 0.5; at(k, K.rnd(-4, 4), 0, K.rnd(-3, 9), K.rnd(0, 6.28));
      K.kadd(k, K.KG.ball, z.wool, 0, 0.62 * s, 0, 0, 0, 0, 1.2 * s, 0.82 * s, 0.78 * s);
      const hy = (graze ? 0.34 : 0.74) * s, hx = 0.66 * s, tilt = graze ? -0.9 : -0.2;
      K.kb(k, z.wool, hx, hy, 0, 0.36 * s, 0.26 * s, 0.24 * s, 0, 0, tilt); K.kb(k, z.nose, hx + 0.17 * s, hy - (graze ? 0.12 : 0.03) * s, 0, 0.08 * s, 0.12 * s, 0.14 * s, 0, 0, tilt);
      for (const sx of [-1, 1]) K.kb(k, z.wool, hx - 0.06 * s, hy + 0.1 * s, sx * 0.16 * s, 0.08 * s, 0.05 * s, 0.15 * s);
      for (const lx of [-0.32, 0.32]) for (const lz of [-0.17, 0.17]) K.kb(k, z.nose, lx * s, 0.17 * s, lz * s, 0.08 * s, 0.36 * s, 0.08 * s);
    }
    return K.kbuild(k);
  }
  // a schapenboet: a low hay barn with a thatched saddle roof, the gable and its door at one end, the roof cut off and hipped down at
  // the other, turned into the southwest wind. Every boet on the island faces the same way. One in three has its door open on lambing
  function boet(K) {
    const z = tm(K), k = K.kit(), s = K.rnd(0.9, 1.15), W = 6 * s, L = 10 * s, H = 2.4 * s, lit = nth('boet', 3) === 1, rh = (W + 0.8) * 0.8, ridge = rh * 0.7;
    K.kb(k, z.boet, 0, H / 2, 0, W, H, L);
    K.kadd(k, K.PG.tx_roof, z.thatch, 0, H - 0.05, 0, 0, 0, 0, W + 0.8, rh, L + 0.6);
    K.kadd(k, K.PG.tx_tri, z.boet, 0, H - 0.05, -L / 2, 0, Math.PI, 0, W, ridge);
    K.kadd(k, K.KG.plane, lit ? z.door : z.dark, 0, 1.0 * s, -L / 2 - 0.03, 0, Math.PI, 0, 1.4 * s, 2.0 * s); K.kadd(k, K.KG.plane, z.dark, 0, H + ridge * 0.35, -L / 2 - 0.03, 0, Math.PI, 0, 0.8 * s, 0.8 * s);
    for (const sx of [-1, 1]) for (const wz of [-L * 0.2, L * 0.25]) K.kadd(k, K.KG.plane, K.PM.windowOff, sx * (W / 2 + 0.02), 1.5 * s, wz, 0, sx * Math.PI / 2, 0, 0.5, 0.4);
    if (lit) { K.kadd(k, K.PG.tx_glow, z.win, 0, 1.1 * s, -L / 2 - 0.12, 0, Math.PI, 0, 4, 4); K.kadd(k, K.PG.tx_pool, z.pool, 0, 0.06, -L / 2 - 2.6, -Math.PI / 2, 0, 0, 3.4, 5.2); }
    const g = K.kbuild(k); g.rotation.y = Math.PI; return g;   // the door toward the rider, the cut-off end away into the wind
  }
  function farm(K) {   // a low farmhouse under one long thatched roof with its barn, the kitchen still lit
    const z = tm(K), k = K.kit(), g = new K.THREE.Group(), W = 9, L = 20, H = 3.2, rh = (W + 1) * 0.85;
    K.kb(k, z.boet, 0, H / 2, 0, W, H, L);
    K.kadd(k, K.PG.tx_roof, z.thatch, 0, H - 0.05, 0, 0, 0, 0, W + 1, rh, L + 0.8); K.kadd(k, K.PG.tx_tri, z.boet, 0, H - 0.05, -L / 2, 0, Math.PI, 0, W, rh * 0.7);
    for (const wz of [-L / 2 + 2, -L / 2 + 4.6, -L / 2 + 7.2]) { const on = Math.random() < 0.7; K.kadd(k, K.PG['win' + (on ? K.pick([0, 1, 2]) : 4)], K.PM.winAtlas, -W / 2 - 0.02, 1.6, wz, 0, -Math.PI / 2, 0, 1.1, 1.4); if (on) K.kadd(k, K.PG.tx_glow, z.win, -W / 2 - 0.08, 1.6, wz, 0, -Math.PI / 2, 0, 3.2, 3.2); }
    K.kbuild(k, g);
    for (const [x, zz] of [[-7, -14], [6, 13]]) { const t = K.treeCard([3, 1, 0]); t.position.set(x, 0, zz); g.add(t); }
    g.userData.faceRoad = true; return g;
  }
  // the lighthouse turns: beams in a group that the game spins (userData.blades), a flash when one of them points at the eye
  function lamp(K, g, z, y, beams, spin, halo, flashSize, follow) {
    const THREE = K.THREE, f = follow || (m => m);
    const pivot = new THREE.Group(); pivot.rotation.x = -Math.PI / 2; pivot.position.y = y; g.add(pivot);
    const turner = new THREE.Group(); pivot.add(turner);
    for (const a of beams) { const b = f(new THREE.Mesh(K.PG.tx_beam, follow ? z.farBeam : z.beam)); b.rotation.z = a; turner.add(b); }
    const h = f(new THREE.Sprite(follow ? z.farLantern : z.lantern)); h.scale.set(halo, halo, 1); h.position.y = y; g.add(h);
    const fm = follow ? z.farFlash : z.flash, fl = f(new THREE.Sprite(fm)); fl.scale.set(flashSize, flashSize, 1); fl.position.y = y; g.add(fl);
    const place = fl.onBeforeRender;
    fl.onBeforeRender = (r, s, cam) => {
      place.call(fl, r, s, cam); const e = fl.matrixWorld.elements, m = turner.matrixWorld.elements, vx = cam.position.x - e[12], vz = cam.position.z - e[14], vl = Math.hypot(vx, vz) || 1; let best = 0;
      for (const a of beams) { const ca = Math.cos(a), sa = Math.sin(a), dx = m[0] * ca + m[4] * sa, dz = m[2] * ca + m[6] * sa; best = Math.max(best, Math.pow(Math.max(0, (dx * vx + dz * vz) / ((Math.hypot(dx, dz) || 1) * vl)), 60)); }
      fm.opacity = 0.8 * best;
    };
    g.userData.blades = turner; g.userData.spin = spin;
  }
  const EIERLAND = { beams: [0, 0.36], spin: 0.628 };   // two white flashes every 10 s
  // the Eierland lighthouse: bright red, 35 m on its own 20 m dune at the end of the island, a black gallery and lantern
  function eierland(K) {
    const z = tm(K), k = K.kit(), g = new K.THREE.Group(), b = 13.2;
    if (nth('light', 2) === 0) return g;   // the first copy stays empty, so the lighthouse stands 240 m ahead when a level starts
    K.kadd(k, K.PG.tx_dome, z.dune, 0, 0, 0, 0, 0, 0, 46, 28, 40); tufts(K, k, z, 0, 0, 23, 14, 20, 40);
    K.kadd(k, K.PG.tx_tower, z.red, 0, b + 15, 0, 0, 0, 0, 6.6, 30, 6.6);
    for (let i = 0; i < 5; i++) { const a = i * 1.3 + 0.6; K.kadd(k, K.KG.plane, z.black, Math.sin(a) * 3.12, b + 4 + i * 5.2, Math.cos(a) * 3.12, 0, a, 0, 0.6, 1.0); }
    K.kadd(k, K.KG.cyl, z.black, 0, b + 30.2, 0, 0, 0, 0, 7.6, 0.5, 7.6); K.kadd(k, K.KG.cyl, z.black, 0, b + 31.3, 0, 0, 0, 0, 7.3, 0.08, 7.3);
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; K.kb(k, z.black, Math.sin(a) * 3.6, b + 30.8, Math.cos(a) * 3.6, 0.06, 1.0, 0.06); }
    K.kadd(k, K.KG.cyl, z.black, 0, b + 30.6, 0, 0, 0, 0, 3.8, 0.4, 3.8); K.kadd(k, K.KG.cyl, z.glass, 0, b + 32.1, 0, 0, 0, 0, 3.4, 2.6, 3.4);
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; K.kb(k, z.black, Math.sin(a) * 1.72, b + 32.1, Math.cos(a) * 1.72, 0.08, 2.6, 0.08); }
    K.kadd(k, K.KG.dome, z.black, 0, b + 33.3, 0, 0, 0, 0, 4.2, 3.0, 4.2); K.kadd(k, K.KG.ball, z.black, 0, b + 35, 0, 0, 0, 0, 0.6, 0.6, 0.6);
    K.kbuild(k, g);
    lamp(K, g, z, b + 32.1, EIERLAND.beams, EIERLAND.spin, 9, 26);
    return g;
  }
  // the same light seen from the villages: painted on the far band, its lantern and beams kept at that place round the eye
  function farLight(K, o) {
    const THREE = K.THREE, z = tm(K), g = new THREE.Group(), az = o.az * Math.PI / 180, R = 172;
    const follow = m => { m.frustumCulled = false; m.renderOrder = 2; m.onBeforeRender = (r, s, cam) => {
      const S = window.NR, fy = S && S.curv ? -Math.atan(S.curv * 120) * 0.7 : 0, a = az + fy, e = m.matrixWorld.elements;   // the far bands turn a little with the bend: so does the light
      e[12] = cam.position.x - R * Math.sin(a); e[13] = o.h; e[14] = cam.position.z - R * Math.cos(a);
    }; return m; };
    lamp(K, g, z, 0, EIERLAND.beams, EIERLAND.spin, 3.6, 16, follow);
    return g;
  }
  // ---------- the villages ----------
  function cutter(K) {   // a Texel beam trawler in the harbour: dark hull, white wheelhouse lit, the booms raised, TX on the bow
    const z = tm(K), k = K.kit();
    K.kb(k, z.hull, 0, -0.4, 0, 4.2, 1.8, 15); K.kb(k, z.hull, 0, -0.2, -8.2, 3.0, 1.6, 3.2, 0.3, Math.PI / 4, 0);
    K.kb(k, z.cabin, 0, 0.55, 0, 4.3, 0.14, 15.2); K.kb(k, z.cabin, 0, 1.85, -3.2, 3.2, 2.4, 3.6); K.kb(k, z.dark, 0, 3.1, -3.2, 3.5, 0.14, 3.9);
    for (const sx of [-1, 1]) { K.kadd(k, K.PG.win0, K.PM.winAtlas, sx * 1.62, 2.2, -3.2, 0, sx * Math.PI / 2, 0, 1.4, 1.0); K.kadd(k, K.PG.tx_glow, z.win, sx * 1.7, 2.2, -3.2, 0, sx * Math.PI / 2, 0, 3, 3); }
    K.kadd(k, K.KG.cyl, z.dark, 0, 5.4, -0.6, 0, 0, 0, 0.26, 9.4, 0.26);
    for (const sx of [-1, 1]) { K.ktube(k, z.dark, 0, 1.0, 1.4, sx * 3.6, 9.4, 1.4, 0.12); K.ktube(k, z.dark, sx * 3.6, 9.4, 1.4, sx * 3.2, 1.2, 2.8, 0.025); K.kb(k, z.dark, sx * 3.3, 1.4, 2.8, 0.5, 0.5, 1.6); }
    K.kadd(k, K.KG.plane, z.tx, -2.12, -0.1, -6.2, 0, -Math.PI / 2, 0, 2.4, 0.6); K.kadd(k, K.KG.plane, z.tx, 2.12, -0.1, -6.2, 0, Math.PI / 2, 0, 2.4, 0.6);
    K.kadd(k, K.PG.tx_glow, z.win, 0, 10.2, -0.6, 0, 0, 0, 1.4, 1.4);
    return K.kbuild(k);
  }
  function stall(K) {   // the market stall packing up: lamb and sheep cheese under a striped awning, one bulb still on
    const z = tm(K), k = K.kit();
    K.kb(k, K.M.wood, 0, 0.85, 0, 1.4, 0.1, 3.4); for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) K.kb(k, K.M.wood, sx * 0.6, 1.3, sz * 1.6, 0.08, 2.6, 0.08);
    for (let i = 0; i < 6; i++) K.kb(k, i % 2 ? z.white : z.hull, -0.2, 2.62, -1.5 + i * 0.6, 1.9, 0.06, 0.6, 0, 0, -0.25);
    for (let i = 0; i < 6; i++) K.kadd(k, K.KG.cyl, K.PM.cheese, K.rnd(-0.35, 0.35), 0.99, -1.3 + i * 0.5, 0, 0, 0, 0.52, 0.17, 0.52);
    K.kadd(k, K.PG.tx_glow, z.win, -0.3, 2.3, 0, 0, -Math.PI / 2, 0, 3, 3);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function vrij(K) {   // the green VRIJ sign that cannot be switched off
    const z = tm(K), k = K.kit();
    K.kb(k, K.PM.pole, 0, 1.4, 0, 0.1, 2.8, 0.1); K.kb(k, z.dark, 0, 2.9, 0, 0.25, 0.7, 1.3);
    K.kadd(k, K.KG.plane, z.vrij, -0.13, 2.9, 0, 0, -Math.PI / 2, 0, 1.2, 0.6); K.kadd(k, K.PG.tx_glow, z.green, -0.3, 2.9, 0, 0, -Math.PI / 2, 0, 2.6, 2.6);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function harbourDyke(K) {   // the dyke round the harbour on the far side: a long grass bank, a fish hall with a lit window now and then
    const z = tm(K), k = K.kit();
    K.kb(k, z.grass, 0, 1.4, 20, 9, 3.2, 40.04); for (const sx of [-1, 1]) K.kb(k, z.grass, sx * 6.2, 0.6, 20, 5, 0.3, 40.04, 0, 0, sx * -0.55);
    if (Math.random() < 0.5) { K.kb(k, z.boet, -9, 2.2, 20, 7, 4.4, 14); K.kadd(k, K.PG.tx_roof, z.thatch, -9, 4.35, 20, 0, 0, 0, 7.6, 3, 14.4); for (const wz of [15, 25]) { K.kadd(k, K.PG.win0, K.PM.winAtlas, -12.52, 2, wz, 0, -Math.PI / 2, 0, 1.1, 1.3); K.kadd(k, K.PG.tx_glow, z.win, -12.6, 2, wz, 0, -Math.PI / 2, 0, 3, 3); } }
    return K.kbuild(k);
  }
  function signs(K) { const l = T.texel.signs.slice().sort(() => Math.random() - 0.5); return K.fingerpost(l.slice(0, 3)); }
  function traanroeier(K) { const m = K.windmill(); m.scale.setScalar(1.9); return m; }   // the mill by the harbour of Oudeschild
  // ---------- the far bands ----------
  const row = (P, f0, f1, h) => { P.g.fillRect(P.X(f0), P.g.canvas.height - 5 * P.m - h * P.m, P.X(f1) - P.X(f0), (h + 5) * P.m); };
  function duneLine(P, f0, f1, h0, h1, step) {   // a rolling dune crest with marram bristling on it
    const g = P.g, H = g.canvas.height, base = H - 5 * P.m, end = P.X(f1); let x = P.X(f0), i = 0; const top = [];
    g.beginPath(); g.moveTo(x, H);
    while (x <= end + step * P.m) { const hh = h0 + (h1 - h0) * (0.5 + 0.32 * Math.sin(i * 0.9 + f0 * 7) + 0.18 * Math.sin(i * 2.7 + 1)); g.lineTo(Math.min(x, end), base - hh * P.m); top.push([Math.min(x, end), hh]); x += step * P.m; i++; }
    g.lineTo(end, H); g.closePath(); g.fill();
    for (const [tx, th] of top) for (let j = 0; j < 3; j++) P.line(tx + P.rr(-1, 1) * step * P.m * 0.5, th - 0.3, tx + P.rr(-1, 1) * step * P.m * 0.5 + P.rr(-0.4, 0.4) * P.m, th + P.rr(0.5, 1.2), 0.12);
  }
  function boetSil(P, x, s) { const m = P.m; P.box(x, 5 * s, -5, 2 * s); P.poly([[x - 2.9 * s * m, 2 * s], [x - 2.9 * s * m, 2 * s], [x - 2.6 * s * m, 5 * s], [x + 0.8 * s * m, 5 * s], [x + 2.9 * s * m, 2 * s]]); }
  function lighthouseSil(P, f, h) {   // the Eierland lighthouse on its dune, as the villages see it far off
    const x = P.X(f), m = P.m; P.poly([[x - 26 * m, 0], [x - 12 * m, 9], [x, h * 0.32], [x + 12 * m, 9], [x + 26 * m, 0]]);
    P.poly([[x - 2.6 * m, h * 0.3], [x - 2.1 * m, h * 0.92], [x + 2.1 * m, h * 0.92], [x + 2.6 * m, h * 0.3]]); P.box(x, 5.6, h * 0.92, h * 0.94); P.box(x, 2.6, h * 0.94, h); P.poly([[x - 1.6 * m, h], [x, h + 2.2], [x + 1.6 * m, h]]);
  }
  const SKY_DYKE = {
    near: P => { duneLine(P, 0, 0.47, 2, 9, 3); row(P, 0.46, 1, 0.35); row(P, 0.62, 1, 1.6); boetSil(P, P.X(0.71), 1); boetSil(P, P.X(0.88), 0.9); P.house(P.X(0.79), 9, 3, 'roof', 0.6); },
    mid: P => {
      duneLine(P, 0, 0.45, 5, 13, 4); for (let i = 0; i < 12; i++) P.conifer(P.X(P.rr(0.04, 0.4)), P.rr(9, 15), P.rr(3, 5));
      row(P, 0.44, 1, 0.9);
      const dh = P.X(0.66); P.box(dh + 6 * P.m, 14, -5, 6); P.poly([[dh + -1 * P.m, 6], [dh + 6 * P.m, 10], [dh + 13 * P.m, 6]]); P.tower(dh, [[3.6, 15]], 'spire', false); P.win(dh, 14.2, 1, 1.2, 0.9);   // Den Hoorn: the white church, its beacon on the balustrade
      P.mill(P.X(0.82), 15, 0.7, 1); P.house(P.X(0.74), 8, 3, 'roof', 0.5); P.house(P.X(0.92), 9, 3.2, 'roof', 0.4); boetSil(P, P.X(0.57), 1.1);
    },
    far: P => { duneLine(P, 0, 0.42, 3, 8, 6); row(P, 0.4, 1, 0.5); P.poly([[P.X(0.5), 0], [P.X(0.535), 6], [P.X(0.56), 9], [P.X(0.59), 6], [P.X(0.63), 0]]); for (let i = 0; i < 14; i++) P.win(P.X(P.rr(0.53, 0.62)), P.rr(0.4, 4), P.rr(0.25, 0.7), 0.6, 0.5); },
  };
  const SKY_TOWN = {
    near: P => { P.roofs(0, 0.4, 5, 7, 0.1, ['roof']); P.roofs(0.6, 1, 5, 7, 0.1, ['roof']); P.trees(0, 1, 5, 9, 11); },
    mid: (P, th) => {
      P.trees(0, 1, 6, 10, 12); P.roofs(0.36, 0.5, 6, 8, 0.15, ['roof']); P.church(P.X(0.55), 30); P.roofs(0.58, 0.7, 6, 8, 0.15, ['roof']);
      if (th && th.canal) { const x = P.X(0.84); P.box(x, 64, -5, 3.5); P.box(x + 4 * P.m, 40, 3.5, 9); P.box(x + 4 * P.m, 24, 9, 12); for (const y of [4.4, 7.2, 10]) for (let i = -9; i <= 9; i++) if (Math.abs(i) * 2.1 < (y > 9 ? 11 : 19)) P.win(x + (4 + i * 2.1) * P.m, y, 0.85, 1.2, 1.0); }   // the ferry on the Marsdiep, every window lit
    },
    far: (P, th) => { duneLine(P, 0, 0.5, 3, 9, 6); row(P, 0.5, 1, 0.5); lighthouseSil(P, 0.5 - (th && th.lightAz || 0) / 180, 40); },
  };
  const band = key => (P, K, th) => (th && th.key === 'dyke' ? SKY_DYKE : SKY_TOWN)[key](P, th);

  // ---------- the dead: islanders in yellow oilskins, sheep farmers ----------
  function torso(K, k, b, m, sx, sy, sz) { K.kadd(k, K.KG.ball, m, 0, (b.hip[1] + b.sh[1]) / 2 + 0.05, (b.hip[2] + b.sh[2]) / 2 + 0.03, 0.5, 0, 0, sx, sy, sz); K.kb(k, m, 0, b.sh[1], b.sh[2], 0.58, 0.16, 0.23); }
  function sleeves(K, k, b, m, r) { for (const sx of [-1, 1]) { const s = [sx * 0.25, b.sh[1], b.sh[2]], e = [sx * 0.28, 1.16, -0.48], h = [sx * 0.262, 0.74, -0.6]; K.ktube(k, m, ...s, ...e, r); K.ktube(k, m, ...e, ...h, r * 0.9); } }
  const DRESS = {
    texelaar(k, b, K) {   // yellow oilskins to below the knee, a sou'wester with its long back brim, black boots
      const z = tm(K), hd = b.hd;
      torso(K, k, b, z.oil, 0.5, 0.64, 0.42); sleeves(K, k, b, z.oil, 0.085);
      const cg = new K.THREE.CylinderGeometry(0.25, 0.37, 0.66, 10); K.kadd(k, cg, z.oil, 0, 0.76, -0.03, 0.14, 0, 0, 1, 1, 1); cg.dispose();
      for (const sx of [-1, 1]) K.ktube(k, z.dark, sx * 0.125, 0.04, 0.02, sx * 0.12, 0.46, -0.07, 0.095);
      K.kadd(k, K.KG.dome, z.oil, 0, hd[1] + 0.01, hd[2] + 0.02, 0.45, 0, 0, 0.3, 0.32, 0.3); K.kadd(k, K.KG.cyl, z.oil, 0, hd[1] - 0.02, hd[2] + 0.1, 0.45, 0, 0, 0.5, 0.02, 0.66);
    },
    tesselboer(k, b, K) {   // a thick island jumper, a flat cap, his crook, and a lamb born tonight under his arm
      const z = tm(K), THREE = K.THREE, hd = b.hd;
      torso(K, k, b, z.jumper, 0.5, 0.62, 0.42); sleeves(K, k, b, z.jumper, 0.09);
      for (const sx of [-1, 1]) { const hx = sx * 0.11; K.ktube(k, z.dark, hx, 1.0, 0.04, hx * 1.1, 0.53, -0.1, 0.105); K.ktube(k, z.dark, hx * 1.1, 0.53, -0.1, hx * 1.15, 0.1, 0.05, 0.09); }
      K.kadd(k, K.KG.cyl, z.dark, 0, hd[1] + 0.12, hd[2] + 0.03, 0.3, 0, 0, 0.29, 0.07, 0.31); K.kb(k, z.dark, 0, hd[1] + 0.09, hd[2] - 0.15, 0.24, 0.025, 0.14, 0.3, 0, 0);
      K.ktube(k, z.dark, 0.28, 0.4, -0.62, 0.32, 2.35, -0.78, 0.028);
      const hook = new THREE.TorusGeometry(0.11, 0.028, 4, 10, Math.PI); K.kadd(k, hook, z.dark, 0.21, 2.35, -0.78, 0, 0, 0); hook.dispose();
      K.kadd(k, K.KG.ball, z.wool, -0.3, 1.24, -0.44, 0, 0.3, 0, 0.3, 0.24, 0.44); K.kadd(k, K.KG.ball, z.wool, -0.36, 1.3, -0.68, 0, 0, 0, 0.15, 0.14, 0.18);
      for (const [lx, lz] of [[-0.24, -0.3], [-0.36, -0.3], [-0.24, -0.56], [-0.36, -0.56]]) K.kb(k, z.dark, lx, 1.05, lz, 0.04, 0.24, 0.04);
    },
  };

  const LIGHT_SQUARE = -26, LIGHT_SHOPS = 7;   // where the Eierland light stands on the horizon, seen from the harbour and from the street
  T.texel = {
    style: { brick: [0x8a8478, 0x4c3a30, 0x5c4a3c, 0x948f84], gables: 0.12, height: [3.8, 5.0], width: [5, 6.4], lamp: 'modern' },
    sky: { stars: 1400, milkyWay: 0.8, milkyWayAz: 52, aurora: 0.7, auroraAz: -20, clouds: 0.12 },
    light: { lamp: 0xdfe8ff },
    road: { kind: 'klinkers', tone: '#4a3430' },
    extra: [],
    themes: {
      // the unlit island: the red path between the dunes and the polder, sheep, turf walls, boeten, the lighthouse, the sky
      dyke: (base, K) => Object.assign({}, base, {
        fog: 0x303a46, fogD: 0.0096, night: 0.5, open: true, ground: 0x141a15, groundY: -0.9, canal: 0, curv: 0.0007, verge: 'grass',
        road: { kind: 'asphalt', tone: '#4e302c' }, landmark: false,
        sky: { stars: 1300, milkyWay: 1, milkyWayAz: 52, aurora: 0.95, auroraAz: -22, clouds: 0.06 },
        spawn: [
          { make: dunes, n: 6, gap: 50, side: 'left', xr: [18, 30], y: -0.9, r: 0.4 },
          { make: duneFoot, n: 8, gap: 37, side: 'left', xr: [9.5, 12], y: -0.9, r: 0.4 },
          { make: tuunwal, n: 10, gap: 30, side: 'right', reg: true, xr: [9.5, 9.5], y: -0.9, r: 0.3 },
          { make: flock, n: 8, gap: 37, side: 'right', xr: [13, 34], y: -0.9, r: 0.4 },
          { make: flock, n: 3, gap: 100, side: 'left', xr: [6.5, 8.5], y: -0.9, r: 0.4 },
          { make: boet, n: 3, gap: 100, side: 'right', xr: [18, 40], y: -0.9, r: 0.4 },
          { make: farm, n: 1, gap: 300, side: 'right', xr: [36, 44], y: -0.9, r: 0.4 },
          { make: eierland, n: 2, gap: 240, side: 'left', reg: true, xr: [44, 50], y: -0.9, r: 0.4 },
          { make: signs, n: 1, gap: 300, side: 'right', xr: [5.0, 5.0], r: 0.5 },
          { make: 'zombieWalk', n: 3, gap: 100, side: 'both', xr: [5.0, 5.6], r: 0.6 },
        ],
      }),
      // the harbour of Oudeschild: low houses on the quay, beam trawlers with TX on the bow, the mill, the dyke round it all
      square: (base, K) => Object.assign({}, base, {
        fog: 0x36404c, fogD: 0.0132, night: 0.36, canal: 1, waterY: -0.6, waterK: 0.3, curv: 0.0015, landmark: false, lightAz: LIGHT_SQUARE,
        sky: { stars: 1300, milkyWay: 0.7, milkyWayAz: 52, aurora: 0.8, auroraAz: -18, clouds: 0.1 },
        spawn: [
          { make: K => K.terrace(3, { tag: 0.2, shops: 0.25 }), n: 6, gap: 24, side: 'left', reg: true, xr: [7.9, 8.2], r: 9 },
          { make: K => K.backRow(), n: 5, gap: 30, side: 'left', reg: true, xr: [19, 20.5], r: 14 },
          { make: K => K.lamppost(), n: 5, gap: 28, side: 'left', reg: true, xr: [4.7, 4.7] }, { make: K => K.lamppost(), n: 3, gap: 48, side: 'right', reg: true, xr: [4.7, 4.7] },
          { make: cutter, n: 4, gap: 42, side: 'right', xr: [13, 15], y: 0, r: 3 },
          { make: harbourDyke, n: 7, gap: 40, side: 'right', reg: true, xr: [36, 36], y: -0.05, r: 0.4 },
          { make: traanroeier, n: 1, gap: 280, side: 'left', xr: [26, 30], r: 0.4 },
          { make: K => K.moorings(), n: 4, gap: 40, side: 'right', xr: [8.1, 8.3], y: -0.2 },
          { make: K => K.bench(), n: 3, gap: 50, side: 'left', xr: [5.0, 5.2], r: 0.9 }, { make: K => K.bollard(), n: 6, gap: 24, side: 'right', xr: [4.4, 4.4], r: 0.2 },
          { make: K => K.bikeRow(), n: 4, gap: 40, side: 'left', xr: [4.9, 5.0], r: 0.6 },
          { make: K => farLight(K, { az: LIGHT_SQUARE, h: 38.6 }), n: 1, gap: 300, side: 'left', reg: true, xr: [30, 30], r: 0.3 },
          { make: signs, n: 1, gap: 160, side: 'left', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 6, gap: 26, side: 'both', xr: [4.9, 5.6], r: 0.6 },
        ],
      }),
      // Den Burg and De Koog: low shops, a rental bike on every wall, the cheese stall, the green sign, the aurora over the roofs
      shops: (base, K) => Object.assign({}, base, {
        fog: 0x38424e, fogD: 0.0148, night: 0.36, curv: 0.002, landmark: false, lightAz: LIGHT_SHOPS,
        sky: { stars: 1100, milkyWay: 0.55, milkyWayAz: 52, aurora: 0.75, auroraAz: 4, clouds: 0.12 },
        spawn: [
          { make: K => K.terrace(3, { shops: 0.75, tag: 0.25 }), n: 12, gap: 12, side: 'alt', reg: true, xr: [7.6, 7.9], r: 9 },
          { make: K => K.backRow(), n: 8, gap: 18, side: 'alt', reg: true, xr: [18.5, 20.5], r: 14 },
          { make: K => K.lamppost(), n: 8, gap: 18, side: 'alt', reg: true, xr: [4.7, 4.7] },
          { make: K => K.bikeRow(), n: 10, gap: 15, side: 'both', xr: [4.9, 5.0], r: 0.6 },
          { make: stall, n: 1, gap: 140, side: 'both', xr: [5.6, 5.8], r: 1.6 }, { make: vrij, n: 1, gap: 150, side: 'right', xr: [5.0, 5.0], r: 0.4 },
          { make: K => K.crates(), n: 4, gap: 32, side: 'both', xr: [5.0, 5.2], r: 0.5 }, { make: K => K.bins(), n: 2, gap: 70, side: 'both', xr: [5.0, 5.1], r: 0.5 },
          { make: K => farLight(K, { az: LIGHT_SHOPS, h: 38.6 }), n: 1, gap: 300, side: 'left', reg: true, xr: [30, 30], r: 0.3 },
          { make: signs, n: 1, gap: 140, side: 'both', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 8, gap: 18, side: 'both', xr: [4.8, 5.4], r: 0.6 },
        ],
      }),
    },
    skyline: { near: band('near'), mid: band('mid'), far: band('far') },
    dead: { pool: ['texelaar', 'texelaar', 'tesselboer', 'tesselboer', 'plain'], dress: DRESS },
    shops: ['SCHAPENKAAS', 'WOLWINKEL', 'FIETSVERHUUR', 'BAKKER', 'VISHANDEL', 'CAFÉ DE VEERBOOT', 'LAMSVLEES', 'DROGIST'],
    signs: ['De Cocksdorp', 'Den Burg', 'De Koog', 'Oudeschild', "'t Horntje", 'Den Hoorn', 'Vuurtoren', 'Ecomare'],
  };
})();
