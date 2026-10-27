// Zeeland: no town but the sea defences. The dyke levels ride the Oosterscheldekering: a dead straight road beside a row of hollow
// concrete pillars with their raised steel gates and the hydraulic cylinders on top, black water on both sides and almost no lamps.
// Neeltje Jans is the one lit island now and then (the Topshuis, the radar tower, the spare pillar in its dock), a stretch of sea
// dyke passes the Plompe Toren and black tarred barns with white frames, and far off the Westkapelle light sweeps the haze.
// The shops and the square are Zierikzee under the unfinished Dikke Toren, its old harbour full of hoogaarsen.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  const at = (k, x, y, z, ry) => { k.base.makeRotationY(ry || 0); k.base.setPosition(x, y, z); };   // where the next kit parts go
  const turn = {};   // the copies of one spec are made one after another: this counts them, so a copy knows which one it is
  const nth = (key, n) => { turn[key] = (turn[key] || 0) + 1; return (turn[key] - 1) % n; };
  const WATER = -3.6;

  // ---------- materials and shared parts, made once ----------
  let Z = null;
  function zm(K) {
    if (Z) return Z;
    const THREE = K.THREE, keep = m => { m.userData.shared = true; return m; };
    const canvas = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return c; };
    const tex = (c, srgb) => { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; };
    let s = 23; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    // poured concrete: the lifts of the formwork, rows of tie holes, salt and rust running down
    const conc = tex(canvas(256, 256, (g, w, h) => {
      for (let y = 0; y < h; y += 128) { const v = 144 + r() * 16; g.fillStyle = `rgb(${v | 0},${v + 1 | 0},${v + 3 | 0})`; g.fillRect(0, y, w, 128); g.fillStyle = 'rgba(28,28,30,0.22)'; g.fillRect(0, y, w, 2); }
      for (let y = 40; y < h; y += 128) for (let x = 14; x < w; x += 42) { g.fillStyle = 'rgba(24,24,26,0.55)'; g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.fill(); }
      for (let i = 0; i < 5000; i++) { g.fillStyle = r() < 0.5 ? `rgba(0,0,0,${0.03 + r() * 0.07})` : `rgba(255,255,255,${0.03 + r() * 0.05})`; g.fillRect(r() * w, r() * h, 1 + (r() < 0.3), 1); }
      for (let i = 0; i < 26; i++) {
        const x = r() * w, y0 = r() * h, len = 40 + r() * 160, ww = 2 + r() * 9, c = r() < 0.35 ? '78,50,32' : '26,28,32', gr = g.createLinearGradient(0, y0, 0, y0 + len);
        gr.addColorStop(0, `rgba(${c},${0.16 + r() * 0.22})`); gr.addColorStop(1, `rgba(${c},0)`); g.fillStyle = gr;
        for (const ox of [-w, 0, w]) for (const oy of [-h, 0]) g.fillRect(x - ww / 2 + ox, y0 + oy, ww, len);
      }
    }), true);
    // the lights: a soft round glow on the left half, its broken reflection on rough water on the right half
    const light = tex(canvas(256, 128, g => {
      const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.14, 'rgba(255,255,255,0.72)'); rg.addColorStop(0.4, 'rgba(255,255,255,0.18)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
      for (let y = 0; y < 128; y += 2) {
        const t = y / 127, a = Math.pow(Math.sin(t * Math.PI), 1.2) * Math.max(0, 0.5 + 0.5 * Math.sin(y * 0.9) * Math.sin(y * 0.23)); if (a < 0.03) continue;
        const ww = 9 + 9 * Math.abs(Math.sin(y * 0.37)), gr = g.createLinearGradient(192 - ww, 0, 192 + ww, 0);
        gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(192 - ww, y, ww * 2, 2);
      }
    }));
    // foam where the tide runs through the gates: pale streaks across the current, fading out round the edge
    const foam = tex(canvas(128, 128, g => {
      for (let i = 0; i < 90; i++) { const x = r() * 128, y = r() * 128, w = 8 + r() * 44, a = 0.12 + r() * 0.4, gr = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x - w / 2, y, w, 1 + r() * 2.5); }
      g.globalCompositeOperation = 'destination-in'; const rg = g.createRadialGradient(64, 64, 8, 64, 64, 64); rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
    }));
    // a lighthouse beam: bright at the lantern, gone at the far end
    const beam = new THREE.CanvasTexture(canvas(16, 256, g => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.06, 'rgba(255,255,255,0.8)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.28)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 16, 256); }));
    // road signs: the blue name board of the island and the crosswind warning, as Rijkswaterstaat paints them
    const board = (w, h, draw) => { const t = new THREE.CanvasTexture(canvas(w, h, draw)); t.colorSpace = THREE.SRGBColorSpace; return keep(K.Mat({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.32, side: THREE.DoubleSide })); };
    const nameBoard = board(512, 128, g => { g.fillStyle = '#1f4f9a'; g.fillRect(0, 0, 512, 128); g.strokeStyle = '#e8eef4'; g.lineWidth = 7; g.strokeRect(8, 8, 496, 112); g.fillStyle = '#eef2f6'; g.font = 'bold 62px "Segoe UI", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Neeltje Jans', 256, 68); });
    const windSign = board(256, 230, g => {
      g.fillStyle = '#c8232a'; g.beginPath(); g.moveTo(128, 6); g.lineTo(250, 222); g.lineTo(6, 222); g.closePath(); g.fill();
      g.fillStyle = '#f2f0ea'; g.beginPath(); g.moveTo(128, 40); g.lineTo(220, 204); g.lineTo(36, 204); g.closePath(); g.fill();
      g.fillStyle = '#16181c'; g.fillRect(84, 112, 7, 82); g.beginPath(); g.moveTo(91, 116); g.lineTo(178, 126); g.lineTo(178, 146); g.lineTo(91, 152); g.closePath(); g.fill();
      g.fillStyle = '#f2f0ea'; for (const x of [112, 140, 164]) g.fillRect(x, 112, 9, 44);
    });
    // the jewellery of the Walcheren dress on one tiny palette: gold, blood coral, the white of a pearl
    const pal = new THREE.CanvasTexture(canvas(4, 1, g => { g.fillStyle = '#e0b048'; g.fillRect(0, 0, 1, 1); g.fillStyle = '#c42a24'; g.fillRect(1, 0, 1, 1); g.fillStyle = '#eee8dc'; g.fillRect(2, 0, 1, 1); g.fillStyle = '#9a6a2a'; g.fillRect(3, 0, 1, 1); }));
    pal.magFilter = pal.minFilter = THREE.NearestFilter; pal.colorSpace = THREE.SRGBColorSpace;
    const paint = (geo, u) => { const q = geo.clone(), uv = q.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, u, 0.5); return q; };
    const quad = (u0, u1) => { const p = new THREE.PlaneGeometry(1, 1), uv = p.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, u0 + uv.getX(i) * (u1 - u0)); return p; };
    const tri = new THREE.Shape(); tri.moveTo(-0.5, 0); tri.lineTo(0.5, 0); tri.lineTo(0, 1); tri.closePath();
    Object.assign(K.PG, {   // kept in PG, so the cleanup between levels leaves them
      zl_glow: quad(0, 0.5), zl_streak: quad(0.5, 1), zl_tri: new THREE.ShapeGeometry(tri), zl_cone4: new THREE.ConeGeometry(0.5, 1, 4),
      zl_beam: new THREE.CylinderGeometry(0.5, 8, 120, 14, 1, true).translate(0, -60, 0).rotateZ(Math.PI / 2),
      zl_gold: paint(K.KG.ball, 0.125), zl_coral: paint(new THREE.TorusGeometry(0.5, 0.11, 5, 14), 0.375), zl_pearl: paint(K.KG.ball, 0.625),
      zl_spiral: paint(new THREE.TorusGeometry(0.5, 0.16, 5, 12), 0.125), zl_bead: paint(K.KG.ball, 0.375), zl_basket: paint(new THREE.CylinderGeometry(0.5, 0.42, 1, 9), 0.875),
    });
    const wood = K.M.wood.map;
    Z = {
      conc: keep(K.Mat({ color: 0xb8bcc2, map: conc })), wet: keep(K.Mat({ color: 0x2a312f, map: conc })),
      steel: keep(K.Mat({ color: 0x2c3239 })), rod: keep(K.Mat({ color: 0xb4bcc4 })),
      red: keep(K.GlowMat(light, 0xff3a22, 0.95, false, { side: THREE.DoubleSide })), green: keep(K.GlowMat(light, 0x3aff7a, 0.85, false, { side: THREE.DoubleSide })), yard: keep(K.GlowMat(light, 0xfff0d6, 0.75, false, { side: THREE.DoubleSide })),
      win: keep(K.GlowMat(light, 0xffb466, 0.5, false)), foam: keep(K.GlowMat(foam, 0xa8b8c8, 0.5, false)),
      refl: keep(K.Mat({ color: 0xffd27a, emissive: 0x2a1c06 })),
      beam: keep(K.GlowMat(beam, 0xe6ecff, 0.12, false, { side: THREE.DoubleSide, fog: false })),
      lantern: keep(K.GlowMat(K.glowTex, 0xffe2c8, 0.9, true, { fog: false })), lanternRed: keep(K.GlowMat(K.glowTex, 0xff4a30, 0.55, true, { fog: false })),
      flash: keep(K.GlowMat(K.glowTex, 0xffffff, 0, true, { fog: false })),
      grass: keep(K.Mat({ color: 0x1a221b })), basalt: keep(K.Mat({ color: 0x1d1f23 })), sand: keep(K.Mat({ color: 0x3a3a34 })),
      tar: keep(K.Mat({ color: 0x18191c, map: wood })), white: keep(K.Mat({ color: 0xdcd9ce })), thatch: keep(K.Mat({ color: 0x2b2722 })),
      hull: keep(K.Mat({ color: 0x1a1d22 })), sail: keep(K.Mat({ color: 0x4a2e22 })), buoyR: keep(K.Mat({ color: 0x7a2420 })), buoyG: keep(K.Mat({ color: 0x24502e })),
      cloth: keep(K.Mat({ color: 0x131316 })), navy: keep(K.Mat({ color: 0x1c2539 })), lace: keep(K.Mat({ color: 0xe2ded2 })),
      jewel: keep(new THREE.MeshBasicMaterial({ map: pal })), nameBoard, windSign,
    };
    Z.conc.userData.wuv = Z.wet.userData.wuv = 9; Z.tar.userData.wuv = 1.4;
    return Z;
  }

  // ---------- the Oosterscheldekering ----------
  // a segment of the barrier: three pillars 22 m apart, the gates hanging raised between them, cylinders and a red light on each.
  // Every part sits at or behind the segment's own origin, so nothing in front of the rider vanishes when the segment is sent ahead.
  const PILLAR_Z = [13, 35, 57];
  function pillar(K, k, z, pz, H) {
    K.kb(k, z.wet, 0, WATER + 1.1, pz, 7.6, 3.0, 6.2);   // the tidal foot, dark with weed
    K.kb(k, z.conc, 0, 1.75, pz, 6.4, 5.7, 5.2);
    K.kb(k, z.conc, 0, 7.6, pz, 5.4, 6.0, 4.2);
    K.kb(k, z.conc, 0, 11.6, pz, 7.0, 2.0, 5.6);      // the head
    K.kb(k, z.conc, 0, 12.8, pz, 6.0, 0.4, 4.8);
    K.kb(k, z.steel, 2.73, 5.5, pz, 0.12, 13, 0.4);   // a ladder rail on the road side, down to the water
    K.kb(k, z.steel, 0.3, 14.2, pz, 3.2, 2.4, 2.2); K.kb(k, z.steel, 0.3, 15.45, pz, 3.5, 0.1, 2.5);   // the machine house on the head
    for (const dz of [-1.75, 1.75]) {                 // the two cylinders that lift the gate, and their rods
      K.kadd(k, K.KG.cyl, z.steel, 0, 13 + H / 2, pz + dz, 0, 0, 0, 1.45, H, 1.45); K.kadd(k, K.KG.cyl, z.steel, 0, 13.4, pz + dz, 0, 0, 0, 2.1, 0.8, 2.1);
      K.kadd(k, K.KG.cyl, z.rod, 0, 13 + H + 0.7, pz + dz, 0, 0, 0, 0.5, 1.4, 0.5);
      K.kadd(k, K.KG.cyl, z.steel, 0, 13 + H + 1.5, pz + dz, 0, 0, 0, 1.2, 0.32, 1.2);
    }
    K.kb(k, z.steel, 0, 13 + H + 1.7, pz, 0.6, 0.24, 4.2);
    const ly = 13 + H + 2.3;
    K.kadd(k, K.PG.zl_glow, z.red, 0, ly, pz, 0, 0, 0, 2.2, 2.2); K.kadd(k, K.PG.zl_glow, z.red, 0, ly, pz, 0, Math.PI / 2, 0, 2.2, 2.2);
    K.kadd(k, K.PG.zl_streak, z.red, 1.2, WATER + 0.06, pz + 12, -Math.PI / 2, 0, 0, 1.6, 16);   // its reflection, broken by the waves
    for (let i = 0; i < 3; i++) K.kadd(k, K.KG.plane, z.foam, K.rnd(-6, 3), WATER + 0.05 + i * 0.01, pz + K.rnd(5, 16), -Math.PI / 2, 0, K.rnd(-0.4, 0.4), K.rnd(9, 16), K.rnd(3, 6));
  }
  function gate(K, k, z, pz, open) {   // the steel gate, lifted clear of the water, and the concrete beam over it, to the next pillar 22 m on
    const c = pz - 11, L = 22 - 4.2;
    K.kb(k, z.steel, 0, 6.8, c, 1.4, 4.8, L);
    for (let i = 0; i < 3; i++) K.kb(k, z.steel, 0.8, 5.2 + i * 1.6, c, 0.3, 0.26, L);
    for (let i = -2; i <= 2; i++) K.kb(k, z.steel, 0.8, 6.8, c + i * L / 5, 0.3, 4.6, 0.22);
    K.kb(k, z.conc, 0, 10.0, c, 3.0, 1.6, L);
    if (open) for (const e of [-1, 1]) { K.kadd(k, K.PG.zl_glow, z.green, 1.6, 8.9, c + e * (L / 2 - 0.6), 0, 0, 0, 1.4, 1.4); K.kadd(k, K.PG.zl_glow, z.green, 1.6, 8.9, c + e * (L / 2 - 0.6), 0, Math.PI / 2, 0, 1.4, 1.4); }   // a passage for shipping, marked green
  }  function barrierSegment(K) {
    const i = nth('seg', 6), g = new K.THREE.Group();
    if (i === 3) return g;   // the gap where an island or the sea dyke takes over
    const z = zm(K), k = K.kit();
    for (const pz of PILLAR_Z) pillar(K, k, z, pz, K.rnd(4, 7.5));   // how far the cylinders stand up tells how deep the water is there
    gate(K, k, z, 57, i === 1 || i === 4); gate(K, k, z, 35); if (i !== 2) gate(K, k, z, 13);
    return K.kbuild(k, g);
  }
  // both parapets of the road on the dam, the edge of the deck down to the water, reflectors that light up in the bike lamp
  function parapets(K) {
    const z = zm(K), k = K.kit();
    for (const sx of [-1, 1]) {
      K.kb(k, z.conc, sx * 7.42, 0.2, 22, 0.64, 0.38, 44.02); K.kb(k, z.conc, sx * 7.42, 0.64, 22, 0.26, 0.52, 44.02); K.kb(k, z.conc, sx * 7.42, 0.93, 22, 0.34, 0.07, 44.02);
      K.kb(k, z.wet, sx * 7.8, (0.05 + WATER) / 2, 22, 0.14, 0.05 - WATER, 44.02);
      for (let i = 0; i < 4; i++) K.kadd(k, K.KG.plane, z.refl, sx * 7.27, 0.6, 5.5 + i * 11, 0, sx < 0 ? Math.PI / 2 : -Math.PI / 2, 0, 0.18, 0.1);
    }
    return K.kbuild(k);
  }
  // a road light on a mast: only where people are, on the island
  function mast(K, k, g, x, lz, side) {
    K.kadd(k, K.KG.cyl, K.PM.pole, x, 3.6, lz, 0, 0, 0, 0.2, 7.2, 0.2); K.kb(k, K.PM.pole, x - side * 0.8, 7.15, lz, 1.7, 0.1, 0.12);
    const lamp = new K.THREE.Group(), head = new K.THREE.Mesh(K.PG.bulb, K.PM.lampHead); head.position.set(-side * 1.5, 7.05, 0); head.scale.set(1.7, 0.45, 1.7); lamp.add(head);
    K.lampLights(lamp, -side * 1.5, 7.05, 0, 1.3); if (side < 0) lamp.children.slice(-2).forEach(m => { m.position.x = -m.position.x + 2 * (-side * 1.5); });
    lamp.position.set(x, 0, lz); g.add(lamp);
  }
  function windows(K, k, z, x, y0, z0, z1, gap, lit, face) {   // a row of windows on a wall facing the road (face -1: the wall's -x side)
    for (let wz = z0; wz <= z1; wz += gap) {
      const on = Math.random() < lit;
      K.kadd(k, K.PG['win' + (on ? K.pick([0, 1, 2]) : K.pick([3, 4, 4, 5]))], K.PM.winAtlas, x, y0, wz, 0, face < 0 ? -Math.PI / 2 : Math.PI / 2, 0, 1.3, 1.7);
      if (on) K.kadd(k, K.PG.zl_glow, z.win, x + face * 0.06, y0, wz, 0, face < 0 ? -Math.PI / 2 : Math.PI / 2, 0, 3.4, 3.4);
    }
  }
  // Neeltje Jans: the island halfway, the one lit place. The Topshuis, the radar tower turning, the spare 66th pillar alone in its dock
  function neeltjeJans(K) {
    const THREE = K.THREE, z = zm(K), k = K.kit(), g = new THREE.Group();
    K.kb(k, z.grass, 40, -2.16, 35, 64.6, 3.3, 82); K.kb(k, z.grass, -27, -2.16, 35, 38.6, 3.3, 82);
    K.kadd(k, K.KG.dome, z.sand, -44, -0.7, 30, 0, 0, 0, 22, 10, 74);   // the dune ridge on the sea side
    const tx = 31, tz = 40;   // the Topshuis
    K.kb(k, z.conc, tx, 4.6, tz, 16, 9.2, 46); K.kb(k, z.conc, tx + 4, 11.2, tz + 2, 10, 4, 36); K.kb(k, z.steel, tx, 9.25, tz, 16.8, 0.3, 46.8); K.kb(k, z.steel, tx + 4, 13.3, tz + 2, 10.6, 0.3, 36.6);
    windows(K, k, z, tx - 8.02, 2.4, tz - 21, tz + 21, 2.6, 0.45, -1); windows(K, k, z, tx - 8.02, 6.4, tz - 21, tz + 21, 2.6, 0.55, -1); windows(K, k, z, tx - 1.03, 11.4, tz - 14, tz + 18, 2.8, 0.5, -1);
    for (const lz of [tz - 26, tz + 26]) { K.kadd(k, K.KG.cyl, K.PM.pole, tx - 10, 2, lz, 0, 0, 0, 0.12, 4, 0.12); K.kadd(k, K.PG.zl_glow, z.yard, tx - 10, 4.1, lz, 0, 0, 0, 2.6, 2.6); K.kadd(k, K.PG.zl_glow, z.yard, tx - 10, 4.1, lz, 0, Math.PI / 2, 0, 2.6, 2.6); }
    const rx = 52, rz = 8, rh = 30;   // the radar tower: a lattice mast, a platform, a red light, the scanner turning on top
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) K.ktube(k, z.steel, rx + sx * 2.2, -0.6, rz + sz * 2.2, rx + sx * 0.7, rh, rz + sz * 0.7, 0.16);
    for (let y = 3; y < rh; y += 4.5) { const w = 2.2 - 1.5 * y / rh; for (const [ax, az, bx, bz] of [[-1, -1, 1, -1], [1, -1, 1, 1], [1, 1, -1, 1], [-1, 1, -1, -1]]) K.ktube(k, z.steel, rx + ax * w, y, rz + az * w, rx + bx * w, y + 4.5, rz + bz * w, 0.06); }
    K.kb(k, z.steel, rx, rh + 0.2, rz, 3, 0.4, 3); K.kadd(k, K.KG.cyl, z.steel, rx, rh + 1.1, rz, 0, 0, 0, 0.6, 1.6, 0.6);
    K.kadd(k, K.PG.zl_glow, z.red, rx, rh + 3.6, rz, 0, 0, 0, 2.4, 2.4); K.kadd(k, K.PG.zl_glow, z.red, rx, rh + 3.6, rz, 0, Math.PI / 2, 0, 2.4, 2.4);
    const px = -27, pz = 54;   // the spare pillar, never used, in its dock
    for (const [dx, dz, w, l] of [[-10, 0, 1.2, 26], [10, 0, 1.2, 26], [0, -13, 21, 1.2], [0, 13, 21, 1.2]]) K.kb(k, z.conc, px + dx, -0.7, pz + dz, w, 1.8, l);
    K.kb(k, z.wet, px, 0.6, pz, 11, 4.2, 15); K.kb(k, z.conc, px, 9.2, pz, 8, 13, 9); K.kb(k, z.conc, px, 21.8, pz, 6.2, 12.2, 5.4); K.kb(k, z.conc, px, 29.2, pz, 8, 2.6, 7);
    K.kb(k, z.steel, px + 4.05, 14, pz, 0.12, 24, 0.5);
    K.kadd(k, K.PG.zl_glow, z.yard, px + 6, 0.9, pz - 8, 0, 0, 0, 3, 3);   // a work light in the dock, throwing the pillar up into the dark
    mast(K, k, g, 5.3, 6, 1); mast(K, k, g, 5.3, 40, 1); mast(K, k, g, -5.3, 70, -1);
    K.kadd(k, K.KG.cyl, K.PM.pole, 9, 3, 20, 0, 0, 0, 0.12, 6, 0.12); K.ktube(k, K.PM.pole, 9, 5.9, 20, 9.4, 5.9, 20, 0.05);   // the windsock, straight out in the wind
    for (let i = 0; i < 5; i++) K.kadd(k, K.KG.cyl, i % 2 ? z.white : K.PM.orange, 9.75 + i * 0.62, 5.9 - i * 0.03, 20, 0, 0, Math.PI / 2 + 0.05, 0.62 - i * 0.07, 0.62, 0.62 - i * 0.07);
    K.kb(k, K.PM.pole, 5.0, 1.1, 74, 0.1, 2.2, 0.1); K.kb(k, K.PM.pole, 7.2, 1.1, 74, 0.1, 2.2, 0.1); K.kadd(k, K.KG.plane, z.nameBoard, 6.1, 2.35, 74.06, 0, 0, 0, 3.2, 0.8);
    K.kbuild(k, g);
    const pivot = new THREE.Group(); pivot.rotation.x = -Math.PI / 2; pivot.position.set(rx, rh + 2.2, rz); g.add(pivot);
    const scan = new THREE.Group(); pivot.add(scan); const bar = new THREE.Mesh(K.KG.box, z.steel); bar.scale.set(7, 0.4, 0.9); bar.position.x = 1.2; scan.add(bar);
    g.userData.blades = scan; g.userData.spin = 1.6;
    return g;
  }
  function barn(K, k, z, x, zc, L, W, H, ry) {   // a Zeeland barn: black tarred boards, a deep roof, every edge, corner and door picked out in white
    at(k, x, -0.9, zc, ry);
    K.kb(k, z.tar, 0, H / 2, 0, W, H, L);
    const ridge = W * 0.75, run = W / 2 + 0.5, slope = Math.atan2(ridge, run), sl = Math.hypot(run, ridge);
    for (const sd of [-1, 1]) K.kb(k, z.thatch, sd * run / 2, H + ridge / 2 - 0.1, 0, sl, 0.45, L + 1, 0, 0, -sd * slope);
    for (const ez of [-1, 1]) {
      K.kadd(k, K.PG.zl_tri, z.tar, 0, H, ez * L / 2, 0, ez > 0 ? 0 : Math.PI, 0, W, ridge);
      for (const sd of [-1, 1]) K.ktube(k, z.white, sd * (run + 0.1), H - 0.1, ez * (L / 2 + 0.52), 0, H + ridge + 0.12, ez * (L / 2 + 0.52), 0.12);
      for (const sd of [-1, 1]) K.kb(k, z.white, sd * (W / 2 + 0.03), H / 2, ez * (L / 2 + 0.03), 0.2, H, 0.2);
    }
    const dz = 0, dw = 4.2, dh = 3.6, fx = -W / 2 - 0.05;   // the big doors on the road side, a white frame and the white brace across each leaf
    K.kb(k, z.white, fx, dh, dz, 0.1, 0.2, dw + 0.2); for (const e of [-1, 0, 1]) K.kb(k, z.white, fx, dh / 2, dz + e * dw / 2, 0.1, dh, 0.16);
    for (const e of [-1, 1]) K.ktube(k, z.white, fx, 0.15, dz + e * 0.1, fx, dh - 0.15, dz + e * (dw / 2 - 0.15), 0.07);
    for (const wz of [-L / 2 + 2.2, L / 2 - 2.2]) { K.kadd(k, K.PG.win4, K.PM.winAtlas, fx, 2.3, wz, 0, -Math.PI / 2, 0, 0.9, 1.0); K.kb(k, z.white, fx, 2.3, wz, 0.08, 1.12, 1.12); }
  }
  // a stretch of sea dyke on Schouwen: basalt down to the water, the polder below on the land side with black barns,
  // and the Plompe Toren alone at the water, all that a mermaid's curse left of Koudekerke
  function plompeToren(K) {
    const THREE = K.THREE, z = zm(K), k = K.kit(), g = new THREE.Group();
    K.kb(k, z.basalt, -10.85, -1.8, 35, 7.26, 0.3, 82, 0, 0, 0.519);
    K.kb(k, z.grass, 10.35, -0.46, 35, 5.5, 0.3, 82, 0, 0, -0.17);
    K.kb(k, z.grass, 50, -2.35, 35, 74.4, 2.9, 82);
    for (let i = 0; i < 14; i++) { const bx = K.rnd(8.4, 13.5); K.kb(k, z.basalt, -bx, 0.1 - (bx - 7.7) * 0.571, K.rnd(0, 72), K.rnd(0.4, 0.9), 0.5, K.rnd(0.4, 0.9), 0, K.rnd(0, 3), 0.519); }
    const tx = -21, tz = 42;
    K.kadd(k, K.KG.dome, z.grass, tx, WATER, tz, 0, 0, 0, 18, 8.6, 18);
    const brick = K.brickMat(0x5c3d33);
    K.kb(k, brick, tx, 9.6, tz, 6.6, 19.6, 6.6);
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { K.kb(k, brick, tx + sx * 3.25, 4.6, tz + sz * 3.25, 1.3, 9.6, 1.3); K.kb(k, brick, tx + sx * 3.1, 11.5, tz + sz * 3.1, 1.0, 4.4, 1.0); }
    K.kb(k, brick, tx, 19.8, tz, 7.2, 0.7, 7.2); K.kadd(k, K.PG.zl_cone4, K.PM.roof, tx, 22.4, tz, 0, Math.PI / 4, 0, 9.4, 4.6, 9.4);
    for (const y of [6, 11.5, 16]) for (const f of [-1, 1]) K.kadd(k, K.KG.plane, K.PM.windowOff, tx + 3.32 * f, y, tz, 0, f > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 0.6, y > 15 ? 2.2 : 1.4);
    barn(K, k, z, 27, 12, 20, 11, 4.4, 0); barn(K, k, z, 52, 58, 15, 9, 3.8, 0.35);
    at(k, 36, -0.9, 40, 0); const hb = K.brickMat(0x4a3430);   // the farmhouse by the first barn, still lit
    K.kb(k, hb, 0, 2.2, 0, 7, 4.4, 9); const ridge = 3.4; for (const sd of [-1, 1]) K.kb(k, K.PM.roof, sd * 2, 4.4 + ridge / 2, 0, Math.hypot(4, ridge), 0.2, 9.6, 0, 0, -sd * Math.atan2(ridge, 4));
    for (const ez of [-1, 1]) K.kadd(k, K.PG.zl_tri, hb, 0, 4.4, ez * 4.5, 0, ez > 0 ? 0 : Math.PI, 0, 7, ridge);
    for (const wz of [-2.4, 0, 2.4]) { const on = wz !== 0; K.kadd(k, K.PG['win' + (on ? 0 : 4)], K.PM.winAtlas, -3.52, 1.7, wz, 0, -Math.PI / 2, 0, 1.0, 1.4); if (on) K.kadd(k, K.PG.zl_glow, z.win, -3.6, 1.7, wz, 0, -Math.PI / 2, 0, 3, 3); }
    K.kbuild(k, g);
    for (const [x, zz] of [[44, 30], [30, 52], [62, 46]]) { const t = K.treeCard([3, 3, 1]); t.position.set(x, -0.9, zz); g.add(t); }
    return g;
  }
  function specials(K) {   // copies 1 and 3 of four: the pillars' gap holds Neeltje Jans one time round and the sea dyke the next
    const i = nth('special', 4);
    return i === 1 ? neeltjeJans(K) : i === 3 ? plompeToren(K) : new K.THREE.Group();
  }

  // ---------- the far lights, which stay on the horizon however far you ride ----------
  // A lighthouse painted on the far band (172 m) gets its lantern and beams here as meshes that sit at the same place round the
  // eye every frame, like the painted bands do. The beams turn with the scenery (userData.blades); the flash fires when one points at you.
  function beacon(K, o) {
    const THREE = K.THREE, z = zm(K), g = new THREE.Group(), az = o.az * Math.PI / 180;
    const off = new THREE.Vector3(-o.R * Math.sin(az), o.h, -o.R * Math.cos(az));
    const follow = m => { m.frustumCulled = false; m.renderOrder = 2; m.onBeforeRender = (r, s, cam) => { const e = m.matrixWorld.elements; e[12] = cam.position.x + off.x; e[13] = off.y; e[14] = cam.position.z + off.z; }; return m; };
    const pivot = new THREE.Group(); pivot.rotation.x = -Math.PI / 2; g.add(pivot);
    const spin = new THREE.Group(); pivot.add(spin);
    for (const a of o.beams) { const b = follow(new THREE.Mesh(K.PG.zl_beam, z.beam)); b.rotation.set(0, 0.05, a, 'ZYX'); b.scale.x = 0.72; spin.add(b); }   // a little short of the eye and dipped toward the horizon
    const red = follow(new THREE.Sprite(z.lanternRed)); red.scale.set(o.halo * 2.2, o.halo * 2.2, 1); g.add(red);
    const core = follow(new THREE.Sprite(z.lantern)); core.scale.set(o.halo, o.halo, 1); g.add(core);
    const flash = follow(new THREE.Sprite(z.flash)); flash.scale.set(o.flash, o.flash, 1); g.add(flash);
    const place = flash.onBeforeRender, vl = Math.hypot(off.x, off.z);
    flash.onBeforeRender = (r, s, cam) => {
      place(r, s, cam); const e = spin.matrixWorld.elements; let best = 0;
      for (const a of o.beams) { const ca = Math.cos(a), sa = Math.sin(a), dx = e[0] * ca + e[4] * sa, dz = e[2] * ca + e[6] * sa; const c = -(dx * off.x + dz * off.z) / ((Math.hypot(dx, dz) || 1) * vl); best = Math.max(best, Math.pow(Math.max(0, c), 70)); }
      z.flash.opacity = 0.75 * best;
    };
    g.userData.blades = spin; g.userData.spin = o.spin;
    return g;
  }
  const WESTKAPELLE = { az: -30, R: 172, h: 21.6, beams: [0, Math.PI], spin: 1.047, halo: 3.6, flash: 18 };   // one flash every 3 s

  // ---------- Zierikzee ----------
  // the Dikke Toren: a mass of brick and stone meant to rise 200 m, stopped at 62 when the money ran out, floodlit from its foot
  function dikkeToren(K) {
    const z = zm(K), k = K.kit(), b = K.brickMat(0x6e5e50), s = 16;
    K.kb(k, b, 0, 24, 0, s, 48, s);
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) for (const [y0, y1, w] of [[0, 18, 2.6], [18, 34, 2.1], [34, 47, 1.6]]) K.kb(k, b, sx * (s / 2 + w / 2 - 0.6), (y0 + y1) / 2, sz * (s / 2 + w / 2 - 0.6), w, y1 - y0, w);
    for (const y of [14, 31]) K.kb(k, z.conc, 0, y, 0, s + 0.5, 0.6, s + 0.5);
    for (const f of [-1, 1]) for (const dz of [-3.6, 0, 3.6]) for (const [y, h] of [[22, 9], [38, 7]]) K.kadd(k, K.KG.plane, K.PM.windowOff, f * (s / 2 + 0.02), y, dz, 0, f > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 1.6, h);
    K.kb(k, b, 0, 48.6, 0, s - 2, 1.2, s - 2); K.kadd(k, K.PG.zl_cone4, K.PM.roof, 0, 51.4, 0, 0, Math.PI / 4, 0, 13, 4.6, 13);
    K.kadd(k, K.KG.cyl, K.PM.pole, 0, 55.5, 0, 0, 0, 0, 0.12, 3.6, 0.12); K.kb(k, K.PM.pole, 0.5, 57, 0, 1.6, 0.5, 0.08);   // the ship on the vane
    for (const dz of [-6, 6]) { K.kadd(k, K.PG.zl_glow, z.win, -s / 2 - 1.2, 1.2, dz, 0, -Math.PI / 2, 0, 5, 5); K.kadd(k, K.PG.zl_streak, z.win, -s / 2 - 0.8, 9, dz, 0, -Math.PI / 2, Math.PI, 5, 18); }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // the Zuidhavenpoort: the harbour gate, a square tower with a turret on each corner and a tall spire
  function havenpoort(K) {
    const z = zm(K), k = K.kit(), b = K.brickMat(0x5e4236);
    K.kb(k, z.conc, 0, -0.6, 0, 14, 1.3, 14);   // its stone quay
    K.kb(k, b, 0, 8, 0, 9, 16, 9); K.kadd(k, K.KG.plane, K.PM.windowOff, -4.52, 2.6, 0, 0, -Math.PI / 2, 0, 3.2, 5.2);
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { K.kadd(k, K.KG.cyl, b, sx * 4.4, 9.5, sz * 4.4, 0, 0, 0, 2.2, 19, 2.2); K.kadd(k, K.PG.zl_cone4, K.PM.roof, sx * 4.4, 21, sz * 4.4, 0, Math.PI / 4, 0, 2.8, 4, 2.8); }
    K.kb(k, b, 0, 17, 0, 7, 2, 7); K.kadd(k, K.PG.zl_cone4, K.PM.roof, 0, 23, 0, 0, Math.PI / 4, 0, 8.6, 10, 8.6);
    for (const y of [9, 13]) { K.kadd(k, K.PG.win1, K.PM.winAtlas, -4.53, y, 0, 0, -Math.PI / 2, 0, 1.2, 1.7); K.kadd(k, K.PG.zl_glow, z.win, -4.6, y, 0, 0, -Math.PI / 2, 0, 3.2, 3.2); }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // a hoogaars: the flat Zeeland sailing boat with a leeboard on each side, moored with its brown sail furled on the boom
  function hoogaars(K) {
    const z = zm(K), k = K.kit();
    K.kb(k, z.hull, 0, -0.35, 0.6, 2.8, 1.0, 7.5); K.kb(k, z.hull, 0, -0.2, -3.6, 1.9, 1.2, 2.6, 0.35, Math.PI / 4, 0); K.kb(k, K.M.wood, 0, 0.18, 0.6, 2.9, 0.1, 7.6);
    for (const sx of [-1, 1]) K.kadd(k, K.KG.ball, z.hull, sx * 1.5, -0.1, 0.4, 0, 0, sx * 0.15, 0.2, 2.6, 1.7);
    K.kadd(k, K.KG.cyl, K.M.wood, 0, 4.6, -1.4, 0, 0, 0, 0.2, 9.2, 0.2); K.ktube(k, K.M.wood, 0, 1.6, -1.4, 0, 2.0, 4.2, 0.09);
    K.kadd(k, K.KG.cyl, z.sail, 0, 1.95, 1.4, Math.PI / 2 - 0.07, 0, 0, 0.55, 5.4, 0.55); K.kb(k, K.M.wood, 0, 0.55, 2.6, 1.4, 0.6, 1.6);
    if (Math.random() < 0.5) K.kadd(k, K.PG.zl_glow, z.win, 0, 0.9, 1.81, 0, 0, 0, 1.2, 1.2);
    return K.kbuild(k);
  }
  // the fish stall on the quay: a lit counter of mussels and kibbeling under a striped awning
  function visKraam(K) {
    const z = zm(K), k = K.kit();
    K.kb(k, z.white, 0, 1.2, 0, 2.2, 2.4, 3.6); K.kb(k, z.hull, -1.15, 0.5, 0, 0.1, 1.0, 3.4);
    K.kadd(k, K.PG.shop0, K.PM.winAtlas, -1.12, 1.6, 0, 0, -Math.PI / 2, 0, 3.2, 0.9); K.kadd(k, K.PG.zl_glow, z.win, -1.4, 1.6, 0, 0, -Math.PI / 2, 0, 5, 3.6);
    for (let i = 0; i < 6; i++) K.kb(k, i % 2 ? z.white : z.navy, -1.45, 2.65, -1.5 + i * 0.6, 0.9, 0.06, 0.6, 0, 0, -0.35);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // the Oosterschelde beyond the parapet: a lit buoy rocking on the black water, and the stakes that mark the mussel plots
  function buoy(K) {
    const z = zm(K), k = K.kit(), green = Math.random() < 0.5, m = green ? z.green : z.red, body = green ? z.buoyG : z.buoyR;
    K.kadd(k, K.KG.cyl, body, 0, WATER + 0.9, 0, 0, 0, 0.12, 1.4, 1.8, 1.4); K.kadd(k, K.PG.zl_cone4, body, 0, WATER + 2.4, 0, 0, Math.PI / 4, 0.12, 1.3, 1.4, 1.3);
    K.kadd(k, K.PG.zl_glow, m, 0.3, WATER + 3.5, 0, 0, 0, 0, 2.4, 2.4); K.kadd(k, K.PG.zl_glow, m, 0.3, WATER + 3.5, 0, 0, Math.PI / 2, 0, 2.4, 2.4);
    K.kadd(k, K.PG.zl_streak, m, 0, WATER + 0.06, 9, -Math.PI / 2, 0, 0, 1.6, 16);
    return K.kbuild(k);
  }
  function stakes(K) { const z = zm(K), k = K.kit(); for (let i = 0; i < 16; i++) K.kadd(k, K.KG.cyl, z.basalt, K.rnd(-2, 2) + (i % 2) * 6, WATER + 1.0, i * 2.4, K.rnd(-0.1, 0.1), 0, K.rnd(-0.1, 0.1), 0.14, K.rnd(2.2, 3.4), 0.14); return K.kbuild(k); }
  function signs(K) { const l = T.zeeland.signs.slice().sort(() => Math.random() - 0.5); return K.fingerpost(l.slice(0, 3)); }
  function windSign(K) { const z = zm(K), k = K.kit(); K.kb(k, K.PM.pole, 0, 1.3, 0, 0.08, 2.6, 0.08); K.kadd(k, K.KG.plane, z.windSign, 0, 2.75, 0.05, 0, 0, 0, 1.1, 1.0); return K.kbuild(k); }

  // ---------- the far bands ----------
  const row = (P, f0, f1, h) => { P.g.fillRect(P.X(f0), P.g.canvas.height - 5 * P.m - h * P.m, P.X(f1) - P.X(f0), (h + 5) * P.m); };
  function farTowers(P, lit) {
    const wx = P.X(0.5 - WESTKAPELLE.az / 180);   // Westkapelle Hoog: the church tower that became a lighthouse, its lantern lit by the beacon
    P.box(wx, 6, -5, 17); P.box(wx, 4.8, 17, 19.6); P.box(wx, 2.4, 19.6, 22.4); P.poly([[wx - 1.5 * P.m, 22.4], [wx, 24.2], [wx + 1.5 * P.m, 22.4]]); P.box(wx + 6 * P.m, 9, -5, 5); P.house(wx - 7 * P.m, 6, 3, 'roof', lit);
    const lj = P.X(0.79); P.tower(lj, [[5, 20], [4, 9], [2.8, 7]], 'lantern', true);   // the Lange Jan of Middelburg
    P.roofs(0.75, 0.83, 3, 5, lit, ['roof', 'step', 'roof']);
    const dt = P.X(0.565); P.box(dt, 8, -5, 24); P.box(dt, 6.4, 24, 25); P.poly([[dt - 3.2 * P.m, 25], [dt, 27.4], [dt + 3.2 * P.m, 25]]);   // the Dikke Toren of Zierikzee
    P.roofs(0.545, 0.6, 3, 5, lit, ['roof', 'step']);
  }
  const SKY_DYKE = {
    far: P => { row(P, 0, 1, 1.3); farTowers(P, 0.25); for (let i = 0; i < 26; i++) P.win(P.X(P.rr(0.52, 0.98)), P.rr(0.6, 3), P.rr(0.2, 0.6), 0.7, 0.6); },
    mid: P => {   // the far end of the barrier going on into the haze, and the low shore of Noord-Beveland
      row(P, 0.52, 1, 2.4);
      for (let i = 0; i < 9; i++) { const x = P.X(0.486 - i * 0.0065); P.box(x, 4, -5, 16); P.box(x, 2.4, 16, 19.5); if (i % 2 === 0) P.win(x, 20.4, 0.9, 0.9, 0.9); }
      P.box(P.X(0.452), 0.06 * 2048 / P.m, 8, 10);
      for (const f of [0.6, 0.73, 0.86]) { const x = P.X(f); P.poly([[x - 6 * P.m, 2.4], [x - 6 * P.m, 5.5], [x, 9.5], [x + 6 * P.m, 5.5], [x + 6 * P.m, 2.4]]); }
      P.trees(0.64, 0.7, 4, 8, 8); P.trees(0.8, 0.95, 4, 8, 8);
    },
    near: P => { row(P, 0, 1, 0.3); },
  };
  const SKY_TOWN = {
    far: P => { P.trees(0, 1, 5, 9, 9); P.roofs(0, 1, 5, 9, 0.05, ['roof', 'step']); P.mill(P.X(0.28), 20, 0.5, 1); },
    mid: P => {
      P.roofs(0, 0.5, 8, 13, 0.12, ['step', 'bell', 'roof', 'step']); P.roofs(0.7, 1, 8, 13, 0.12, ['step', 'roof', 'bell']);
      const x = P.X(0.535); P.box(x, 18, -5, 50); P.box(x, 14, 50, 52); P.poly([[x - 7 * P.m, 52], [x, 57], [x + 7 * P.m, 52]]);   // the Dikke Toren over the roofs
      for (const dx of [-9.2, 9.2]) P.box(x + dx * P.m, 2.4, -5, 46);
      P.win(x - 7.5 * P.m, -1, 0.35, 3, 30); P.win(x + 7.5 * P.m, -1, 0.35, 3, 30);
      P.church(P.X(0.38), 28); P.tower(P.X(0.83), [[5, 14]], 'spire', true);
      P.roofs(0.47, 0.51, 9, 12, 0.2, ['step']); P.roofs(0.58, 0.64, 9, 12, 0.2, ['bell']);
    },
    near: P => { P.roofs(0, 0.38, 10, 15, 0.14, ['step', 'roof', 'bell']); P.roofs(0.62, 1, 10, 15, 0.14, ['step', 'roof', 'bell']); P.trees(0.38, 0.62, 4, 7, 12); },
  };
  const band = key => (P, K, th) => (th && th.key === 'dyke' ? SKY_DYKE : SKY_TOWN)[key](P);

  // ---------- the dead: the Walcheren dress, the men in black, the mussel fishers of Yerseke ----------
  function torso(K, k, b, m, sx, sy, sz) { K.kadd(k, K.KG.ball, m, 0, (b.hip[1] + b.sh[1]) / 2 + 0.05, (b.hip[2] + b.sh[2]) / 2 + 0.03, 0.5, 0, 0, sx, sy, sz); K.kb(k, m, 0, b.sh[1], b.sh[2], 0.56, 0.15, 0.22); }
  function sleeves(K, k, b, m, r, full) { for (const sx of [-1, 1]) { const s = [sx * 0.25, b.sh[1], b.sh[2]], e = [sx * 0.28, 1.16, -0.48], h = [sx * 0.262, 0.74, -0.6]; K.ktube(k, m, ...s, ...e, r); if (full) K.ktube(k, m, ...e, ...h, r * 0.9); } }
  function legs(K, k, m, r0, r1, y1) { for (const sx of [-1, 1]) { const hx = sx * 0.11, knee = [hx * 1.1, 0.53, -0.1], foot = [hx * 1.15, 0.07, 0.06]; K.ktube(k, m, hx, 1.0, 0.04, ...knee, r0); K.ktube(k, m, ...knee, foot[0], y1, -0.1 + 0.16 * (0.53 - y1) / 0.46, r1); } }
  const DRESS = {
    walcherse(k, b, K) {   // black jacket and skirt, the lace cap standing out round the head, gold spirals at the temples, blood coral
      const z = zm(K), THREE = K.THREE, hd = b.hd;
      torso(K, k, b, z.cloth, 0.47, 0.6, 0.39); sleeves(K, k, b, z.cloth, 0.075, true);
      const sg = new THREE.CylinderGeometry(0.21, 0.5, 1.02, 12); K.kadd(k, sg, z.cloth, 0, 0.53, -0.03, -0.08, 0, 0, 1, 1, 1); sg.dispose();
      K.kadd(k, K.KG.dome, z.lace, 0, hd[1] - 0.02, hd[2] + 0.04, 0.55, 0, 0, 0.32, 0.36, 0.34);
      for (const sx of [-1, 1]) K.kb(k, z.lace, sx * 0.2, hd[1] + 0.02, hd[2] + 0.08, 0.2, 0.3, 0.025, 0.2, sx * 0.55, sx * 0.25);
      K.kb(k, z.lace, 0, hd[1] - 0.14, hd[2] + 0.14, 0.3, 0.12, 0.05, 0.5, 0, 0);
      for (const sx of [-1, 1]) { K.kadd(k, K.PG.zl_spiral, z.jewel, sx * 0.15, hd[1] + 0.01, hd[2] - 0.06, 0, sx * 0.4, 0, 0.11, 0.11, 0.11); K.kadd(k, K.PG.zl_gold, z.jewel, sx * 0.16, hd[1] - 0.08, hd[2] - 0.05, 0, 0, 0, 0.05, 0.06, 0.05); }
      for (const [dy, rr] of [[0.02, 0.24], [-0.04, 0.28], [-0.1, 0.31]]) K.kadd(k, K.PG.zl_coral, z.jewel, 0, b.sh[1] + dy, b.sh[2] - 0.1, Math.PI / 2 + 0.6, 0, 0, rr, rr, rr);
      K.kadd(k, K.PG.zl_gold, z.jewel, 0, b.sh[1] - 0.14, b.sh[2] - 0.21, 0, 0, 0, 0.06, 0.06, 0.06);
    },
    zeeuwseman(k, b, K) {   // black felt from neck to ankle, two gold buttons at the collar, a round black hat
      const z = zm(K), hd = b.hd;
      torso(K, k, b, z.cloth, 0.46, 0.6, 0.38); sleeves(K, k, b, z.cloth, 0.08, true); legs(K, k, z.cloth, 0.11, 0.095, 0.12);
      for (const sx of [-1, 1]) K.kadd(k, K.PG.zl_gold, z.jewel, sx * 0.05, b.sh[1] + 0.02, b.sh[2] - 0.13, 0, 0, 0, 0.055, 0.055, 0.055);
      K.kadd(k, K.KG.cyl, z.cloth, 0, hd[1] + 0.16, hd[2] + 0.02, 0.32, 0, 0, 0.32, 0.14, 0.32); K.kadd(k, K.KG.cyl, z.cloth, 0, hd[1] + 0.1, hd[2] + 0.02, 0.32, 0, 0, 0.6, 0.025, 0.6);
    },
    mosselvisser(k, b, K) {   // a navy smock, high boots, a cap, a basket of mussels on the hip and the long rake over his shoulder
      const z = zm(K), hd = b.hd;
      torso(K, k, b, z.navy, 0.5, 0.62, 0.42); sleeves(K, k, b, z.navy, 0.085, false);
      const sg = new K.THREE.CylinderGeometry(0.25, 0.33, 0.42, 10); K.kadd(k, sg, z.navy, 0, 0.92, 0.0, 0.1, 0, 0, 1, 1, 1); sg.dispose();
      for (const sx of [-1, 1]) K.ktube(k, z.cloth, sx * 0.125, 0.04, 0.0, sx * 0.12, 0.6, -0.1, 0.1);
      K.kadd(k, K.KG.cyl, z.navy, 0, hd[1] + 0.13, hd[2] + 0.02, 0.3, 0, 0, 0.3, 0.1, 0.32); K.kb(k, z.navy, 0, hd[1] + 0.09, hd[2] - 0.15, 0.22, 0.025, 0.12, 0.35, 0, 0);
      K.kadd(k, K.PG.zl_basket, z.jewel, 0.34, 0.5, -0.56, 0, 0, 0, 0.46, 0.34, 0.46);
      for (let i = 0; i < 5; i++) K.kadd(k, K.KG.ball, z.cloth, 0.34 + K.rnd(-0.12, 0.12), 0.69, -0.56 + K.rnd(-0.12, 0.12), 0, 0, 0, 0.12, 0.07, 0.16);
      K.ktube(k, z.cloth, -0.3, 0.6, -0.62, -0.12, 2.5, 0.35, 0.025); K.kb(k, z.cloth, -0.12, 2.52, 0.38, 0.5, 0.08, 0.1, 0, 0, 0);
    },
  };

  T.zeeland = {
    style: { brick: [0x4e332c, 0x5c3c32, 0x8e897e, 0x9c978c, 0x3c3438], gables: 0.6, height: [6.5, 9.5], width: [3.6, 4.8], lamp: 'classic' },
    sky: { stars: 420, clouds: 0.5 },
    light: { lamp: 0xffdcae },
    road: { kind: 'klinkers', tone: '#4a3a34' },
    extra: [],
    themes: {
      // the Oosterscheldekering: dead straight, open water both sides, the pillars on the sea side, hardly a lamp
      dyke: (base, K) => Object.assign({}, base, {
        fog: 0x46505a, fogD: 0.0118, night: 0.24, open: true, ground: 0x0b1014, groundY: WATER - 0.12, canal: -1, waterY: WATER, waterK: 0.5, curv: 0,
        verge: 'tiles', road: { kind: 'asphalt', tone: '#30353d' }, landmark: false,
        sky: { stars: 460, clouds: 0.42, glows: [{ az: -62, el: 0, w: 46, h: 5, color: 0xffa860, a: 0.07 }] },
        spawn: [
          { make: barrierSegment, n: 6, gap: 66, side: 'left', reg: true, xr: [14.6, 14.6], r: 0.4 },
          { make: buoy, n: 4, gap: 99, side: 'right', xr: [22, 60], r: 0.4 }, { make: stakes, n: 3, gap: 132, side: 'right', xr: [30, 52], r: 0.4 },
          { make: parapets, n: 9, gap: 44, side: 'right', reg: true, xr: [0.01, 0.01], r: 0.3 },
          { make: specials, n: 4, gap: 198, side: 'right', reg: true, xr: [0.01, 0.01], r: 0.3 },
          { make: K => beacon(K, WESTKAPELLE), n: 1, gap: 396, side: 'left', reg: true, xr: [30, 30], r: 0.3 },
          { make: windSign, n: 1, gap: 396, side: 'right', reg: true, xr: [5.2, 5.2], r: 0.3 },
          { make: signs, n: 1, gap: 396, side: 'right', xr: [5.4, 5.4], r: 0.5 },
          { make: 'zombieWalk', n: 3, gap: 132, side: 'both', xr: [5.2, 6.4], r: 0.6 },
        ],
      }),
      // the shopping street of Zierikzee: narrow, gabled, the Dikke Toren standing over the roofs
      shops: (base, K) => Object.assign({}, base, {
        fog: 0x4c535c, fogD: 0.0158, curv: 0.0016, landmark: false, sky: { stars: 380, clouds: 0.55 },
        spawn: [
          { make: K => K.terrace(3, { shops: 0.75, tag: 0.25 }), n: 12, gap: 12, side: 'alt', reg: true, xr: [7.6, 7.9], r: 9 },
          { make: K => K.backRow(), n: 8, gap: 18, side: 'alt', reg: true, xr: [18.5, 20.5], r: 14 },
          { make: K => K.lamppost(), n: 10, gap: 14, side: 'alt', reg: true, xr: [4.7, 4.7] },
          { make: dikkeToren, n: 1, gap: 280, side: 'right', xr: [36, 36], r: 0.4 },
          { make: visKraam, n: 1, gap: 140, side: 'both', xr: [5.6, 5.8], r: 1.4 },
          { make: K => K.bikeRow(), n: 5, gap: 26, side: 'both', xr: [4.9, 5.0], r: 0.6 }, { make: K => K.crates(), n: 4, gap: 32, side: 'both', xr: [5.0, 5.2], r: 0.5 },
          { make: K => K.bollard(), n: 12, gap: 11, side: 'alt', xr: [4.4, 4.4], r: 0.2 }, { make: K => K.bins(), n: 2, gap: 70, side: 'both', xr: [5.0, 5.1], r: 0.5 },
          { make: signs, n: 1, gap: 140, side: 'both', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 8, gap: 18, side: 'both', xr: [4.8, 5.4], r: 0.6 },
        ],
      }),
      // the Oude Haven of Zierikzee: the quay, hoogaarsen on the black water, the harbour gate and the Dikke Toren over it all
      square: (base, K) => Object.assign({}, base, {
        fog: 0x4a525c, fogD: 0.0152, curv: 0.0015, canal: 1, water: 0x161d26, waterY: -0.35, waterK: 0.26, landmark: false, sky: { stars: 420, clouds: 0.5 },
        spawn: [
          { make: K => K.terrace(3, { tag: 0.2, shops: 0.25 }), n: 6, gap: 24, side: 'left', reg: true, xr: [7.9, 8.2], r: 9 },
          { make: K => K.backRow(), n: 5, gap: 30, side: 'left', reg: true, xr: [19, 20.5], r: 14 },
          { make: K => K.terrace(4, { plain: true, lit: 0.3, reflect: 3.2, peer: false }), n: 4, gap: 36, side: 'right', reg: true, xr: [33.5, 34.5], r: 13 },
          { make: K => K.lamppost(), n: 6, gap: 24, side: 'left', reg: true, xr: [4.7, 4.7] }, { make: K => K.lamppost(), n: 3, gap: 48, side: 'right', reg: true, xr: [4.7, 4.7] },
          { make: dikkeToren, n: 1, gap: 280, side: 'left', xr: [36, 36], r: 0.4 },
          { make: havenpoort, n: 1, gap: 280, side: 'right', xr: [16, 18], r: 0.4, y: -0.2 },
          { make: hoogaars, n: 6, gap: 40, side: 'right', xr: [10, 13], y: 0.0, r: 3 },
          { make: K => K.moorings(), n: 5, gap: 34, side: 'right', xr: [8.1, 8.3], y: 0 },
          { make: visKraam, n: 1, gap: 160, side: 'right', xr: [5.8, 6.0], r: 1.4 },
          { make: K => K.bench(), n: 3, gap: 50, side: 'left', xr: [5.0, 5.2], r: 0.9 }, { make: K => K.bollard(), n: 6, gap: 24, side: 'right', xr: [4.4, 4.4], r: 0.2 },
          { make: K => K.bikeRow(), n: 3, gap: 50, side: 'left', xr: [4.9, 5.0], r: 0.6 },
          { make: signs, n: 1, gap: 160, side: 'left', xr: [4.6, 4.6], r: 0.5 },
          { make: 'zombieWalk', n: 6, gap: 26, side: 'both', xr: [4.9, 5.6], r: 0.6 },
        ],
      }),
    },
    skyline: { near: band('near'), mid: band('mid'), far: band('far') },
    dead: { pool: ['walcherse', 'walcherse', 'zeeuwseman', 'zeeuwseman', 'mosselvisser', 'crawler'], dress: DRESS },
    shops: ['BOLUSBAKKER', 'SLAGER', 'VISHANDEL', 'APOTHEEK', 'MOSSELEN', 'CAFÉ DE DIKKE TOREN', 'KLEDING', 'FIETSVERHUUR'],
    signs: ['Zierikzee', 'Middelburg', 'Neeltje Jans', 'Westkapelle', 'Veere', 'Burgh-Haamstede', 'Vlissingen'],
  };
})();
