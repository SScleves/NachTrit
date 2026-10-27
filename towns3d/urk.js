// Urk: this town's own look (Opus 5.5 DT/TOWNS-IDENTITY.md section 8; research and sources in
// Opus 5.5 DT/research/towns-urk-texel-groningen.md section 1).
// A former island: a lit hill out of a black polder beside a black lake. The dyke levels ride the IJsselmeer dike past wind
// turbines standing in the water, red lights flashing on their nacelles, to the harbour full of kotters with UK numbers, under
// the white lighthouse whose beam turns the wrong way round (anticlockwise, one flash every 5 s), past the Kerkje aan de Zee
// and the woman of the fishermen's monument looking back at the water. The street and shop levels climb the old island
// through ginkies of small whitewashed fishermen's houses with saddle roofs, white and green fences and anchors on the walls,
// lit by lanterns on the house fronts; on Sunday every shop is shut. The dead wear the Urker dress, with pride.
(function () {
  const T = window.NRTOWNS3D = window.NRTOWNS3D || {};
  const GY = -1.4, WY = -0.6;   // on the dyke: the polder floor and the lake, both below the road on the dike top
  const SHOPS = ['VISHANDEL', 'BAKKER', 'SLAGER', 'SCHEEPSBENODIGDHEDEN', 'KAPPER', 'SUPERMARKT', 'BOEKHANDEL'];
  const SIGNS = SHOPS.concat(['ZONDAG GESLOTEN', 'VISAFSLAG', 'URK', 'UK 13', 'UK 52', 'UK 87', 'UK 148', 'UK 165', 'UK 238']);
  const POSTS = ['Vuurtoren', 'Haven', 'Lemmer', 'Emmeloord', 'Oude dorp', 'Visafslag', 'Kerkje'];
  // the paint atlas: 8 by 4 swatches, so a whole costume, boat or turbine is one material
  const S = { black: 0, vest: 1, damask: 2, kraplap: 3, silver: 4, gold: 5, bib: 6, linen: 7, lace: 8, garnet: 9, apron: 10, skirt: 11, silk: 12, green: 13, white: 14, iron: 15,
    navy: 16, hullGreen: 17, hullRed: 18, hullBlack: 19, yellow: 20, turbine: 21, red: 22, copper: 23, stone: 24, marble: 25, grass: 26, wood: 27, net: 28, crateBlue: 29, crateGreen: 30, boom: 31 };
  let shopTurn = 0;   // the shop boards come round in turn, so two neighbours never sell the same
  let U = null;   // materials, textures and shapes: made on first use and kept for good

  function paintAtlas(THREE) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
    let s = 23; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const cell = (i, f) => { g.save(); g.translate((i % 8) * 64, Math.floor(i / 8) * 64); g.beginPath(); g.rect(0, 0, 64, 64); g.clip(); f(); g.restore(); };
    const flat = (i, col, grain) => cell(i, () => { g.fillStyle = col; g.fillRect(0, 0, 64, 64); for (let j = 0; j < (grain || 0); j++) { g.fillStyle = r() < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.07)'; g.fillRect(r() * 64, r() * 64, 2, 2); } });
    const stripes = (i, cols, w) => cell(i, () => { for (let x = 0, j = 0; x < 64; x += w, j++) { g.fillStyle = cols[j % cols.length]; g.fillRect(x, 0, w, 64); } });
    flat(S.black, '#131418', 60);
    stripes(S.vest, ['#b8262c', '#e6e0d4'], 6);
    cell(S.damask, () => { g.fillStyle = '#21357a'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#3d59ab'; for (let y = 6; y < 64; y += 13) for (let x = (Math.round(y / 13) % 2) * 7 + 4; x < 64; x += 14) { g.beginPath(); g.moveTo(x, y - 4); g.lineTo(x + 3, y); g.lineTo(x, y + 4); g.lineTo(x - 3, y); g.fill(); } });
    cell(S.kraplap, () => { g.fillStyle = '#17241f'; g.fillRect(0, 0, 64, 64); const cols = ['#e0403a', '#f0c84a', '#f2eee2', '#46a462', '#e87aa8', '#5a86dc']; for (let i = 0; i < 30; i++) { g.fillStyle = cols[i % 6]; g.beginPath(); g.arc(4 + r() * 56, 4 + r() * 56, 2.5 + r() * 3.5, 0, 7); g.fill(); } g.fillStyle = '#46a462'; for (let i = 0; i < 20; i++) g.fillRect(r() * 60, r() * 60, 5, 2); });
    cell(S.silver, () => { const gr = g.createLinearGradient(0, 0, 64, 64); gr.addColorStop(0, '#f0f2f4'); gr.addColorStop(1, '#8a9096'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    cell(S.gold, () => { const gr = g.createLinearGradient(0, 0, 64, 64); gr.addColorStop(0, '#f2cc5a'); gr.addColorStop(1, '#9a6a18'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    flat(S.bib, '#a8202a', 20); flat(S.linen, '#eeede6', 30);
    cell(S.lace, () => { g.fillStyle = '#ecc848'; g.fillRect(0, 0, 64, 64); g.fillStyle = 'rgba(120,80,10,0.5)'; for (let y = 3; y < 64; y += 7) for (let x = (y % 2) * 3 + 2; x < 64; x += 7) { g.beginPath(); g.arc(x, y, 1.6, 0, 7); g.fill(); } });
    cell(S.garnet, () => { g.fillStyle = '#6a0a12'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#d4343e'; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(r() * 64, r() * 64, 2.2, 0, 7); g.fill(); } });
    stripes(S.apron, ['#1d2a52', '#dcdcd2', '#5a7cb6', '#dcdcd2'], 4);
    flat(S.skirt, '#161b28', 40);
    cell(S.silk, () => { g.fillStyle = '#7e1e3c'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#d4a84a'; for (let i = 0; i < 30; i++) g.fillRect(r() * 64, r() * 64, 3, 3); });
    flat(S.green, '#2b5a3c', 30); flat(S.white, '#e8e6dc', 30); flat(S.iron, '#17191d', 30);
    flat(S.navy, '#1d2c4c', 50); flat(S.hullGreen, '#1f4032', 50); flat(S.hullRed, '#5e2420', 50); flat(S.hullBlack, '#16181c', 50);
    flat(S.yellow, '#d2aa26', 30); flat(S.turbine, '#c9cdd2', 20); flat(S.red, '#a62a26', 30); flat(S.copper, '#4f7a66', 40);
    flat(S.stone, '#5c5f64', 120); flat(S.marble, '#cfcdc6', 30); flat(S.grass, '#1a2a1e', 80); flat(S.wood, '#4a3424', 60);
    cell(S.net, () => { g.fillStyle = '#26352f'; g.fillRect(0, 0, 64, 64); g.strokeStyle = 'rgba(150,170,160,0.35)'; for (let x = -64; x < 64; x += 6) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 64, 64); g.moveTo(x + 64, 0); g.lineTo(x, 64); g.stroke(); } });
    flat(S.crateBlue, '#2c5c8e', 20); flat(S.crateGreen, '#2f6c4c', 20); flat(S.boom, '#d8c890', 20);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; return t;
  }
  // shop boards, the closed card, the auction hall and the hull lettering: 2 by 8 cells of 512 by 128
  function signAtlas(THREE) {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 1024; const g = c.getContext('2d');
    SIGNS.forEach((t, i) => {
      const hull = i >= 9, card = i === 7; g.save(); g.translate((i % 2) * 512, Math.floor(i / 2) * 128);
      if (!hull) { g.fillStyle = card ? '#e6e2d4' : i === 8 ? '#1d2c48' : '#1e3a2b'; g.fillRect(4, 4, 504, 120); g.strokeStyle = card ? '#8a2420' : '#d8cfb4'; g.lineWidth = 5; g.strokeRect(12, 12, 488, 104); }
      g.fillStyle = hull ? '#f2f0e8' : card ? '#7a1c18' : '#e8dfc4'; g.textAlign = 'center'; g.textBaseline = 'middle';
      const font = sz => hull ? `900 ${sz}px "Segoe UI", Arial, sans-serif` : `bold ${sz}px Georgia, "Times New Roman", serif`;
      let size = hull ? 100 : 66; g.font = font(size); while (g.measureText(t).width > 462 && size > 18) { size -= 2; g.font = font(size); }
      g.fillText(t, 256, 68); g.restore();
    });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  function plasterTex(THREE) {   // whitewash over old brick: soft stains, fine grit
    const N = 256, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d');
    let s = 31; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    g.fillStyle = 'rgb(214,212,204)'; g.fillRect(0, 0, N, N);
    for (let i = 0; i < 70; i++) {
      const x = r() * N, y = r() * N, rad = 10 + r() * 40, k = r() < 0.6 ? 0 : 255, a = 0.03 + r() * 0.05;
      for (const ox of [-N, 0, N]) for (const oy of [-N, 0, N]) { const rg = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rad); rg.addColorStop(0, `rgba(${k},${k},${k},${a})`); rg.addColorStop(1, `rgba(${k},${k},${k},0)`); g.fillStyle = rg; g.fillRect(x + ox - rad, y + oy - rad, rad * 2, rad * 2); }
    }
    for (let i = 0; i < 4000; i++) { g.fillStyle = r() < 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'; g.fillRect(r() * N, r() * N, 1, 1); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function beamTex(THREE) {   // bright at the lamp, gone 60 m out
    const c = document.createElement('canvas'); c.width = 4; c.height = 128; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 4, 128);
    return new THREE.CanvasTexture(c);
  }

  function mats(K) {
    if (U) return U;
    const THREE = K.THREE, paint = paintAtlas(THREE), signs = signAtlas(THREE), plaster = plasterTex(THREE);
    U = {
      THREE, geo: {},
      paint: K.Mat({ map: paint }),
      dress: K.Mat({ map: paint, emissive: 0xffffff, emissiveMap: paint, emissiveIntensity: 0.22 }),   // the dress keeps its colours in the dark
      sign: K.Mat({ map: signs, emissive: 0xffffff, emissiveMap: signs, emissiveIntensity: 0.2, alphaTest: 0.5 }),
      plaster: [0xd6d1c2, 0xcac1a9, 0xb4b6ae, 0xd0c9b4].map(col => { const m = K.Mat({ color: col, map: plaster }); m.userData.wuv = 2.6; return m; }),
      brick: K.brickMat(0x6a4236),
      winGlow: K.GlowMat(K.glowTex, 0xffb466, 0.42),
      glowW: K.GlowMat(K.glowTex, 0xf2f0ff, 0.85, false, { side: THREE.DoubleSide }),
      reflect: K.GlowMat(K.glowTex, 0xffb060, 0.28),
      avi: K.GlowMat(K.glowTex, 0xff2a18, 0.95, true),
      lhHalo: K.GlowMat(K.glowTex, 0xfff2d0, 0.9, true),
      lhFlash: K.GlowMat(K.glowTex, 0xfff8e8, 0, true),
      beam: K.GlowMat(beamTex(THREE), 0xfff0d6, 0.24, false, { side: THREE.DoubleSide }),
      lantern: new THREE.MeshBasicMaterial({ color: 0xfff1c4 }),
      v: new THREE.Vector3(), q: new THREE.Quaternion(), e: new THREE.Euler(), up: new THREE.Vector3(0, 1, 0),
    };
    for (const m of [U.paint, U.dress, U.sign, U.beam]) m.userData.shared = true;
    // unit shapes the kits copy from (never drawn themselves)
    U.cyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 10);
    U.flare = new THREE.CylinderGeometry(0.17, 0.34, 1, 12);
    U.skirt = new THREE.CylinderGeometry(0.2, 0.46, 1, 14);
    U.apron = new THREE.CylinderGeometry(0.212, 0.473, 0.9, 10, 1, true, Math.PI - 0.75, 1.5);
    U.jacket = new THREE.CylinderGeometry(0.205, 0.215, 1, 12, 1, true, Math.PI + 0.62, Math.PI * 2 - 1.24);
    U.cape = new THREE.CylinderGeometry(0.14, 0.28, 1, 12, 1, true);
    U.ring = new THREE.TorusGeometry(0.5, 0.1, 5, 16);
    U.thinRing = new THREE.TorusGeometry(0.5, 0.02, 4, 24); U.lace = new THREE.TorusGeometry(0.5, 0.05, 4, 18);
    U.taper = new THREE.CylinderGeometry(0.5, 0.66, 1, 16);
    U.mast = new THREE.CylinderGeometry(0.42, 0.75, 1, 10);
    U.tri = (() => { const sh = new THREE.Shape(); sh.moveTo(-0.5, 0); sh.lineTo(0.5, 0); sh.lineTo(0, 1); sh.closePath(); return new THREE.ShapeGeometry(sh); })();
    U.blade = (() => { const b = new THREE.BoxGeometry(1, 1, 0.3); b.translate(0, 0.5, 0); const p = b.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) > 0.5) p.setX(i, p.getX(i) * 0.28 + 0.12); b.computeVertexNormals(); return b; })();
    return U;
  }
  // a copy of a unit shape whose UVs all fall inside swatch i of the paint atlas
  function sw(base, i) {
    const key = base.uuid + '/' + i; let g = U.geo[key]; if (g) return g;
    g = base.index ? base.toNonIndexed() : base.clone();
    const uv = g.attributes.uv, c = i % 8, row = Math.floor(i / 8);
    for (let j = 0; j < uv.count; j++) uv.setXY(j, (c + 0.12 + uv.getX(j) * 0.76) / 8, 1 - (row + 0.12 + (1 - uv.getY(j)) * 0.76) / 4);
    return (U.geo[key] = g);
  }
  function signGeo(i) {   // a quad showing cell i of the sign atlas
    const key = 'sign' + i; if (U.geo[key]) return U.geo[key];
    const p = new U.THREE.PlaneGeometry(1, 1), uv = p.attributes.uv, c = i % 2, row = Math.floor(i / 2);
    for (let j = 0; j < uv.count; j++) uv.setXY(j, (c + uv.getX(j)) / 2, 1 - (row + 1 - uv.getY(j)) / 8);
    return (U.geo[key] = p);
  }
  // a unit shape stretched from a to b (as the kit's ktube, but any shape and any material)
  function tube(K, k, geo, mat, a, b, r) {
    const v = U.v.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]), len = v.length();
    U.q.setFromUnitVectors(U.up, v.multiplyScalar(1 / len)); U.e.setFromQuaternion(U.q, 'XYZ');
    K.kadd(k, geo, mat, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, U.e.x, U.e.y, U.e.z, r * 2, len, r * 2);
  }
  const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const off = (p, n, d) => [p[0] + n[0] * d, p[1] + n[1] * d, p[2] + n[2] * d];

  // ---------- the dead in the Urker dress, Sunday best worn with pride (the shared body: tall, thin, hunched, yellow eyes) ----------
  function torso(b) {   // points along the bowed back from the hip (t 0) to the shoulders (t 1), its lean as a turn about x, the way the chest faces
    const ay = b.sh[1] - b.hip[1], az = b.sh[2] - b.hip[2], L = Math.hypot(ay, az);
    return { at: t => [0, b.hip[1] + ay * t, b.hip[2] + az * t], lean: Math.atan2(az, ay), nf: [0, az / L, -ay / L] };
  }
  function limbs(b, sx) {   // the joints of one side, as zombieParts places them
    const hx = sx * 0.11, shx = sx * 0.25;
    return { knee: [hx * 1.1, 0.53, -0.1], foot: [hx * 1.15, 0.07, 0.06], sh: [shx, b.sh[1], b.sh[2]], elbow: [shx * 1.12, 1.16, -0.48], hand: [shx * 1.05, 0.7, -0.6] };
  }
  function urkerMan(k, b, K, hat) {
    mats(K); const D = U.dress, B = K.KG.box, ball = K.KG.ball, t = torso(b), hd = b.hd;
    // wide black pleated breeches down past the knee, gathered at the waist, closed with two domed silver buttons
    tube(K, k, sw(U.flare, S.black), D, [0, 0.43, -0.075], [0, 1.05, 0.03], 0.5);
    tube(K, k, sw(U.cyl, S.black), D, t.at(-0.02), t.at(0.07), 0.19);
    const wb = off(t.at(0.03), t.nf, 0.19);
    for (const sx of [-1, 1]) K.kadd(k, sw(ball, S.silver), D, sx * 0.075, wb[1], wb[2], 0, 0, 0, 0.09, 0.09, 0.05);
    // the red and white striped vest, its red bib with gold studs, a collarless black jacket worn open over it
    tube(K, k, sw(U.cyl, S.vest), D, t.at(0.05), t.at(0.96), 0.163);
    const bib = off(t.at(0.66), t.nf, 0.165);
    K.kadd(k, sw(B, S.bib), D, 0, bib[1], bib[2], t.lean, 0, 0, 0.17, 0.25, 0.025);
    for (const sx of [-1, 1]) for (const tt of [0.57, 0.67, 0.77]) { const p = off(t.at(tt), t.nf, 0.18); K.kadd(k, sw(ball, S.gold), D, sx * 0.045, p[1], p[2], 0, 0, 0, 0.032, 0.032, 0.03); }
    tube(K, k, sw(U.jacket, S.black), D, t.at(0.02), t.at(1.0), 0.5);
    K.kadd(k, sw(B, S.black), D, 0, b.sh[1] + 0.01, b.sh[2], 0, 0, 0, 0.56, 0.14, 0.22);
    for (const sx of [-1, 1]) {
      const L = limbs(b, sx), wrist = lerp3(L.elbow, L.hand, 0.8);
      tube(K, k, sw(U.cyl, S.black), D, L.sh, L.elbow, 0.078); tube(K, k, sw(U.cyl, S.black), D, L.elbow, wrist, 0.066);
      tube(K, k, sw(U.cyl, S.black), D, L.knee, lerp3(L.knee, L.foot, 0.85), 0.07);                       // black stockings
      K.kadd(k, sw(B, S.black), D, L.foot[0], 0.05, L.foot[2] - 0.08, 0, 0, 0, 0.13, 0.09, 0.28);           // shoes
      K.kadd(k, sw(B, S.silver), D, L.foot[0], 0.085, L.foot[2] - 0.2, 0, 0, 0, 0.075, 0.045, 0.02);         // and their silver buckles
    }
    // the silk neckerchief through a gold ring
    K.kadd(k, sw(ball, S.silk), D, 0, b.sh[1] - 0.02, b.sh[2] - 0.11, 0, 0, 0, 0.13, 0.08, 0.09);
    K.kadd(k, sw(ball, S.gold), D, 0, b.sh[1] - 0.05, b.sh[2] - 0.16, 0, 0, 0, 0.045, 0.045, 0.03);
    if (hat) {   // the low black hat, and the psalm book under his hand: on his way to church
      K.kadd(k, sw(U.cyl, S.black), D, 0, hd[1] + 0.15, hd[2] + 0.02, 0.3, 0, 0, 0.27, 0.13, 0.28);
      K.kadd(k, sw(U.cyl, S.black), D, 0, hd[1] + 0.09, hd[2] + 0.02, 0.3, 0, 0, 0.47, 0.02, 0.48);
      const L = limbs(b, 1);
      K.kadd(k, sw(B, S.black), D, L.hand[0] + 0.03, L.hand[1] - 0.05, L.hand[2], 0, 0, 0.1, 0.05, 0.2, 0.15);
      K.kadd(k, sw(B, S.gold), D, L.hand[0] + 0.03, L.hand[1] - 0.05, L.hand[2] - 0.077, 0, 0, 0.1, 0.052, 0.19, 0.006);
    } else {   // the old style sailor's cap with its short peak
      K.kadd(k, sw(U.cyl, S.black), D, 0, hd[1] + 0.115, hd[2] + 0.01, 0.3, 0, 0, 0.29, 0.07, 0.3);
      K.kadd(k, sw(U.cyl, S.black), D, 0, hd[1] + 0.155, hd[2] + 0.02, 0.3, 0, 0, 0.32, 0.035, 0.33);
      K.kadd(k, sw(B, S.black), D, 0, hd[1] + 0.07, hd[2] - 0.14, 0.45, 0, 0, 0.21, 0.02, 0.11);
    }
  }
  function urkerVrouw(k, b, K, sunday) {
    mats(K); const D = U.dress, B = K.KG.box, ball = K.KG.ball, t = torso(b), hd = b.hd;
    // the wide skirt over its petticoats and the striped apron; both black on Sunday
    K.kadd(k, sw(U.skirt, sunday ? S.black : S.skirt), D, 0, 0.56, -0.03, -0.1, 0, 0, 1, 1, 1);
    K.kadd(k, sw(U.apron, sunday ? S.black : S.apron), D, 0, 0.6, -0.03, -0.1, 0, 0, 1, 1, 1);
    // the corset in blue damask with the kraplap she embroidered herself; on Sunday a black fringed cloth over it
    tube(K, k, sw(U.cyl, S.damask), D, t.at(0.0), t.at(0.95), 0.165);
    if (sunday) tube(K, k, sw(U.cape, S.black), D, t.at(0.42), t.at(1.04), 0.5);
    else { const kp = off(t.at(0.62), t.nf, 0.166); K.kadd(k, sw(B, S.kraplap), D, 0, kp[1], kp[2], t.lean, 0, 0, 0.27, 0.33, 0.025); }
    for (const sx of [-1, 1]) {
      const L = limbs(b, sx);
      tube(K, k, sw(U.cyl, sunday ? S.black : S.damask), D, L.sh, L.elbow, 0.078);
      if (sunday) tube(K, k, sw(U.cyl, S.black), D, L.elbow, lerp3(L.elbow, L.hand, 0.8), 0.064);
      K.kadd(k, sw(B, S.black), D, L.foot[0], 0.05, L.foot[2] - 0.08, 0, 0, 0, 0.13, 0.09, 0.27);
    }
    // the hul: a white cap with a yellow lace edge round the face, over the silver oorijzer whose knobs show at the temples
    K.kadd(k, sw(K.KG.dome, S.linen), D, 0, hd[1] - 0.005, hd[2] + 0.035, 1.25, 0, 0, 0.27, 0.3, 0.3);
    K.kadd(k, sw(U.lace, S.lace), D, 0, hd[1] - 0.01, hd[2] + 0.02, -0.32, 0, 0, 0.29, 0.31, 0.29);
    for (const sx of [-1, 1]) K.kadd(k, sw(ball, S.silver), D, sx * 0.13, hd[1] - 0.02, hd[2] - 0.02, 0, 0, 0, 0.04, 0.075, 0.075);
    // strands of garnets at the throat
    for (const [y, z, s] of [[1.585, -0.42, 0.21], [1.568, -0.44, 0.25]]) K.kadd(k, sw(U.ring, S.garnet), D, 0, y, z, 0, 0, 0, s, s, s);
    if (sunday) { const L = limbs(b, -1); K.kadd(k, sw(B, S.black), D, L.hand[0] - 0.03, L.hand[1] - 0.05, L.hand[2], 0, 0, -0.1, 0.05, 0.19, 0.14); K.kadd(k, sw(B, S.gold), D, L.hand[0] - 0.03, L.hand[1] - 0.05, L.hand[2] - 0.072, 0, 0, -0.1, 0.052, 0.18, 0.006); }
  }

  // ---------- the old village: small whitewashed fishermen's houses, the pointed gable to the ginkie ----------
  // p: x the house front (it faces -x, the road), y its floor, z its middle, W wide along the road, D deep, h to the eaves
  function oneHouse(K, k, p) {
    const P = U.paint, B = K.KG.box, yaw = -Math.PI / 2, { x, y, z, W, D, h } = p, rh = W * K.rnd(0.46, 0.58);
    K.kb(k, p.wall, x + D / 2, y + h / 2, z, D, h, W);
    K.kadd(k, U.tri, p.gable, x - 0.012, y + h - 0.01, z, 0, yaw, 0, W, rh, 1);
    const run = W / 2 + 0.25, drop = rh + 0.2, al = Math.atan2(drop, run), sl = Math.hypot(run, drop);
    for (const s of [-1, 1]) K.kb(k, K.PM.roof, x + D / 2 - 0.12, y + h + rh - drop / 2, z + s * run / 2, D + 0.36, 0.12, sl, s * al, 0, 0);
    K.kb(k, K.PM.roof, x + D / 2 - 0.12, y + h + rh + 0.04, z, D + 0.36, 0.14, 0.34);
    if (Math.random() < 0.7) { const cz = z + K.rnd(-0.22, 0.22) * W, cx = x + D * K.rnd(0.5, 0.8), cy = y + h + rh * (1 - Math.abs(cz - z) / (W / 2)); K.kb(k, p.wall, cx, cy + 0.3, cz, 0.5, 1.3, 0.5); K.kb(k, K.PM.roof, cx, cy + 0.98, cz, 0.66, 0.1, 0.66); }
    const win = (wy, wz, sx, sy, shut) => {
      const r0 = Math.random(), lit = r0 < p.lit, cell = lit ? K.pick([0, 0, 1, 2]) : r0 < p.lit + 0.15 ? 3 : Math.random() < 0.6 ? 5 : 4;
      K.kadd(k, K.PG['win' + cell], K.PM.winAtlas, x - 0.012, y + wy, z + wz, 0, yaw, 0, sx, sy);
      if (lit) K.kadd(k, K.KG.plane, U.winGlow, x - 0.08, y + wy, z + wz, 0, yaw, 0, sx * 2.6, sy * 2.2);
      if (shut) for (const s of [-1, 1]) K.kadd(k, sw(B, S.green), P, x - 0.04, y + wy, z + wz + s * (sx / 2 + 0.17), 0, 0, 0, 0.05, sy * 0.95, 0.3);
    };
    if (rh > 1.6) win(h + rh * 0.3, 0, 0.62, 0.85, false);   // the attic window in the gable
    const side = Math.random() < 0.5 ? -1 : 1, dz = side * W * 0.28;
    if (p.plain) { win(1.5, -dz, 0.9, 1.2, false); if (W > 5) win(1.5, dz * 0.4, 0.9, 1.2, false); return; }
    K.kadd(k, sw(B, S.black), P, x - 0.03, y + 0.3, z, 0, 0, 0, 0.06, 0.6, W + 0.02);   // the tarred plinth
    // the door: white frame, a green or blue leaf, a fanlight
    K.kadd(k, sw(B, S.white), P, x - 0.02, y + 1.12, z + dz, 0, 0, 0, 0.04, 2.24, 1.12);
    K.kadd(k, sw(B, p.door), P, x - 0.045, y + 1.0, z + dz, 0, 0, 0, 0.04, 1.96, 0.88);
    K.kadd(k, K.PG.fan3, K.PM.winAtlas, x - 0.05, y + 2.08, z + dz, 0, yaw, 0, 0.84, 0.22);
    if (p.shop) {   // a shop, shut: the window dark, the board unlit, the card in the window
      const sz = -dz * 0.35, sw0 = W - 2.4;
      K.kadd(k, sw(B, S.white), P, x - 0.004, y + 1.4, z + sz, 0, 0, 0, 0.03, 1.86, sw0 + 0.2);
      K.kadd(k, K.PG.win4, K.PM.winAtlas, x - 0.03, y + 1.4, z + sz, 0, yaw, 0, sw0, 1.7);
      K.kadd(k, signGeo(7), U.sign, x - 0.045, y + 1.3, z + sz + sw0 / 2 - 0.62, 0, yaw, 0, 0.95, 0.24);
      K.kadd(k, signGeo(p.shop - 1), U.sign, x - 0.07, y + 2.78, z, 0, yaw, 0, Math.min(W - 0.5, 4.4), 0.56);
      if (h > 4.6) for (const wz of [-dz, dz]) win(3.7, wz, 0.85, 1.15, p.shut);
    } else {
      win(1.5, -dz, 0.9, 1.2, p.shut);
      if (W > 5.2) win(1.5, -dz * 0.12, 0.9, 1.2, p.shut);
    }
    if (p.fence) {   // the low fence before the house: white pickets and a green rail, or the other way round
      const a0 = z - side * (W / 2 - 0.12), a1 = z + dz - side * 0.62, za = Math.min(a0, a1), zb = Math.max(a0, a1), fx = x - 0.55;
      const pk = p.fenceGreen ? S.green : S.white, rl = p.fenceGreen ? S.white : S.green;
      for (let fz = za + 0.08; fz < zb; fz += 0.15) K.kadd(k, sw(B, pk), P, fx, y + 0.38, fz, 0, 0, 0, 0.035, 0.72, 0.065);
      for (const ry of [0.22, 0.62]) K.kadd(k, sw(B, rl), P, fx + 0.03, y + ry, (za + zb) / 2, 0, 0, 0, 0.03, 0.06, zb - za);
      for (const fz of [za, zb]) K.kadd(k, sw(B, S.green), P, fx, y + 0.45, fz, 0, 0, 0, 0.09, 0.9, 0.09);
    }
    if (p.anchor) {   // an anchor on the wall, iron black on the whitewash
      const az = z - side * (W / 2 - 0.5), ay = y + 1.45, ax = x - 0.06, I = sw(B, S.iron);
      K.kadd(k, I, P, ax, ay, az, 0, 0, 0, 0.05, 1.0, 0.07); K.kadd(k, I, P, ax, ay + 0.36, az, 0, 0, 0, 0.05, 0.06, 0.52);
      K.kadd(k, sw(U.ring, S.iron), P, ax, ay + 0.57, az, 0, Math.PI / 2, 0, 0.16, 0.16, 0.16);
      for (const s of [-1, 1]) { K.kadd(k, I, P, ax, ay - 0.38, az + s * 0.16, s * 0.93, 0, 0, 0.05, 0.4, 0.06); K.kadd(k, I, P, ax, ay - 0.24, az + s * 0.33, s * 0.5, 0, 0, 0.05, 0.16, 0.13); }
    }
  }
  // a row of n houses wall to wall, now and then a ginkie between two; o.k adds it to a kit at o.ox, o.oy, o.oz (else a group facing the road)
  function urkRow(K, n, o) {
    o = o || {}; mats(K);
    const own = !o.k, k = o.k || K.kit(), fx = (o.ox || 0) - 3, oy = o.oy || 0, oz = o.oz || 0, ws = [], gs = [];
    for (let i = 0; i < n; i++) { ws.push(K.rnd(4.5, 5.9)); gs.push(i < n - 1 && Math.random() < (o.alleys == null ? 0.25 : o.alleys) ? K.rnd(1.0, 1.5) : 0); }
    const len = ws.reduce((a, b) => a + b, 0) + gs.reduce((a, b) => a + b, 0), pal = [K.pick(U.plaster), K.pick(U.plaster)];
    let z = oz - len / 2;
    for (let i = 0; i < n; i++) {
      const W = ws[i], shop = o.shops && Math.random() < o.shops ? 1 + (shopTurn++ % SHOPS.length) : 0;
      oneHouse(K, k, { x: fx, y: oy, z: z + W / 2, W, D: K.rnd(6.5, 8.5), h: shop ? K.rnd(3.4, 5.4) : K.rnd(2.7, 3.4) * (o.tall || 1),
        wall: pal[i % 2], gable: Math.random() < 0.45 ? U.brick : pal[i % 2], door: K.pick([S.green, S.green, S.navy, S.hullRed]), plain: o.plain,
        lit: o.lit == null ? 0.35 : o.lit, shop, fence: !o.plain && !shop && Math.random() < 0.55, fenceGreen: Math.random() < 0.35,
        anchor: !o.plain && !shop && Math.random() < 0.3, shut: Math.random() < 0.5 });
      z += W + gs[i];
    }
    if (o.base) K.kadd(k, sw(K.KG.box, S.stone), U.paint, fx + 3.4, (oy - 1.5) / 2, oz, 0, 0, 0, 9.4, oy + 1.5, len + 0.6);   // the stone terrace the row stands on
    if (!own) return null;
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // the lanterns of the old village hang on the house fronts, on a curled iron arm
  function urkLantern(K) {
    mats(K); const g = new U.THREE.Group(), k = K.kit(), pole = K.PM.pole, hy = 2.75;
    K.kb(k, pole, 0.33, hy + 0.15, 0, 0.05, 0.62, 0.14); K.kb(k, pole, 0.16, hy + 0.42, 0, 0.36, 0.045, 0.045);
    K.ktube(k, pole, 0.31, hy - 0.05, 0, 0.08, hy + 0.4, 0, 0.016);
    K.kadd(k, K.PG.lantCap, pole, 0, hy + 0.33, 0, 0, Math.PI / 4, 0, 0.8, 0.8, 0.8);
    K.kb(k, pole, 0, hy - 0.22, 0, 0.27, 0.05, 0.27); K.kadd(k, K.KG.ball, pole, 0, hy - 0.29, 0, 0, 0, 0, 0.09, 0.09, 0.09);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.kb(k, pole, sx * 0.13, hy, sz * 0.13, 0.025, 0.42, 0.025);
    K.kbuild(k, g);
    const glass = new U.THREE.Mesh(K.PG.lantGlass, K.PM.lampHead); glass.scale.set(0.78, 0.82, 0.78); glass.position.set(0, hy, 0); g.add(glass);
    K.lampLights(g, 0, hy, 1, 0.82);
    g.userData.faceRoad = true; return g;
  }

  // ---------- the lake and the harbour ----------
  // a kotter, bow to -z, waterline at y 0: dark hull with a white sheer, the wheelhouse forward, the outriggers raised upright with
  // their nets, UK and her number on both bows and URK on the transom, the masthead lamp and the lit windows in the black water
  function kotter(K, k, x, z, hull, num) {
    const P = U.paint, B = K.KG.box, q = Math.PI / 2;
    K.kadd(k, sw(B, hull), P, x, 0.3, z + 2, 0, 0, 0, 6, 3.4, 16);
    K.kadd(k, sw(B, hull), P, x, 0.55, z - 6.3, 0, Math.PI / 4, 0, 4.24, 3.9, 4.24);
    K.kadd(k, sw(B, S.white), P, x, 2.04, z + 2, 0, 0, 0, 6.06, 0.14, 16.04);
    K.kadd(k, sw(B, S.white), P, x, 2.52, z - 6.3, 0, Math.PI / 4, 0, 4.3, 0.14, 4.3);
    K.kadd(k, sw(B, S.white), P, x, 3.35, z - 2.4, 0, 0, 0, 3.6, 2.6, 3.4);
    K.kadd(k, sw(B, S.iron), P, x, 4.72, z - 2.4, 0, 0, 0, 3.9, 0.14, 3.8);
    for (const wx of [-1.1, 0, 1.1]) K.kadd(k, K.KG.plane, Math.random() < 0.7 ? K.PM.window : K.PM.windowOff, x + wx, 3.95, z - 0.69, 0, 0, 0, 0.8, 0.55);
    for (const s of [-1, 1]) for (const wz of [-1, 0.2]) K.kadd(k, K.KG.plane, Math.random() < 0.6 ? K.PM.window : K.PM.windowOff, x + s * 1.81, 3.95, z - 2.4 + wz, 0, s * q, 0, 0.9, 0.55);
    K.kadd(k, sw(B, S.iron), P, x, 6.5, z - 2.2, 0, 0, 0, 0.14, 3.6, 0.14); K.kadd(k, sw(B, S.iron), P, x, 7.3, z - 2.2, 0, 0, 0, 1.7, 0.08, 0.22);
    for (const s of [-1, 1]) {
      tube(K, k, sw(U.cyl, S.white), P, [x + s * 2.3, 2.1, z + 1.6], [x, 9.2, z + 1.6], 0.13);
      tube(K, k, sw(U.cyl, S.boom), P, [x + s * 2.7, 2.2, z + 1.4], [x + s * 4.8, 13.5, z + 2.4], 0.11);
      tube(K, k, sw(U.cyl, S.net), P, [x + s * 3.5, 6.5, z + 1.8], [x + s * 4.2, 10.8, z + 2.1], 0.3);
      K.kadd(k, signGeo(num), U.sign, x + s * 3.03, 1.12, z - 4.2, 0, s * q, 0, 2.8, 0.7);
    }
    K.kadd(k, signGeo(9), U.sign, x, 1.35, z + 10.03, 0, 0, 0, 2.2, 0.55);
    for (const [ly, lz, s] of [[8.4, z - 2.2, 1.3], [9.5, z + 1.6, 1.9]]) { K.kadd(k, K.KG.plane, U.glowW, x, ly, lz, 0, 0, 0, s, s); K.kadd(k, K.KG.plane, U.glowW, x, ly, lz, 0, q, 0, s, s); }
    K.kadd(k, K.PG.streak, U.reflect, x, 0.03, z + 7, 0, 0, 0, 1.2, 1, 0.8);
  }
  function kotters(K) {   // two or three moored abreast, as they lie in the harbour on a Saturday night
    mats(K); const k = K.kit(), n = Math.random() < 0.5 ? 2 : 3, hulls = [S.navy, S.hullGreen, S.hullRed, S.hullBlack];
    for (let i = 0; i < n; i++) kotter(K, k, -i * 6.5, K.rnd(-2, 2), K.pick(hulls), 10 + Math.floor(Math.random() * 6));
    return K.kbuild(k);
  }
  // a wind turbine standing in the lake: the yellow foot, the pale mast, the rotor turning, the red light on the nacelle
  function blink() { U.avi.opacity = (performance.now() / 1000) % 2 < 1 ? 0.95 : 0.05; }   // the whole park flashes together, as it does
  function turbine(K) {
    mats(K); const THREE = U.THREE, g = new THREE.Group(), k = K.kit(), P = U.paint, H = K.rnd(40, 47), R = 21;
    K.kadd(k, sw(U.cyl, S.yellow), P, 0, 1.4, 0, 0, 0, 0, 3.2, 4.2, 3.2);
    K.kadd(k, sw(U.mast, S.turbine), P, 0, 3.5 + (H - 3.5) / 2, 0, 0, 0, 0, 2.2, H - 3.5, 2.2);
    K.kadd(k, sw(K.KG.box, S.turbine), P, 0, H + 0.4, 1.5, 0, 0, 0, 2.4, 2.4, 6.2);
    K.kbuild(k, g);
    const bk = K.kit();
    K.kadd(bk, sw(K.KG.ball, S.turbine), P, 0, 0, 0, 0, 0, 0, 1.9, 1.9, 2.6);
    for (let i = 0; i < 3; i++) K.kadd(bk, sw(U.blade, S.turbine), P, 0, 0, 0, 0, 0, i * Math.PI * 2 / 3, 1.7, R, 1);
    const blades = K.kbuild(bk); blades.position.set(0, H + 0.4, -1.9); blades.rotation.z = Math.random() * 6.3; g.add(blades);
    const red = new THREE.Sprite(U.avi); red.scale.set(3.2, 3.2, 1); red.position.set(0, H + 1.9, 2.6); red.onBeforeRender = blink; g.add(red);
    g.rotation.y = 0.5;   // all into the same wind
    g.userData.blades = blades; g.userData.spin = -0.8;
    return g;
  }
  // the open lake beyond the dike: water to the horizon, holding what light there is in the sky
  function lake(K) { mats(K); const g = new U.THREE.Group(), m = new U.THREE.Mesh(new U.THREE.PlaneGeometry(130, 100), K.M.water); m.rotation.x = -Math.PI / 2; g.add(m); return g; }
  function viskisten(K) {   // fish crates stacked on the quay
    mats(K); const k = K.kit(), n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) { const col = Math.random() < 0.6 ? S.crateBlue : S.crateGreen, hh = 1 + Math.floor(Math.random() * 4), cz = i * 0.62 - n * 0.3; for (let j = 0; j < hh; j++) K.kadd(k, sw(K.KG.box, col), U.paint, K.rnd(-0.03, 0.03), 0.15 + j * 0.29, cz, 0, K.rnd(-0.08, 0.08), 0, 0.42, 0.28, 0.58); }
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function bolders(K) {   // iron mooring bollards on the quay edge, white collars
    mats(K); const k = K.kit(), P = U.paint;
    for (const z of [-4, 0, 4]) { K.kadd(k, sw(U.cyl, S.iron), P, 0, 0.32, z, 0, 0, 0, 0.32, 0.64, 0.32); K.kadd(k, sw(U.cyl, S.iron), P, 0, 0.66, z, 0, 0, 0, 0.46, 0.08, 0.46); K.kadd(k, sw(U.cyl, S.white), P, 0, 0.56, z, 0, 0, 0, 0.33, 0.05, 0.33); }
    return K.kbuild(k);
  }
  function afslag(K) {   // the fish auction: a long pale hall below the dike, a band of lit windows, its name over the doors
    mats(K); const k = K.kit(), P = U.paint, yaw = -Math.PI / 2, L = 30;
    K.kadd(k, sw(K.KG.box, S.navy), P, 6, 3.6, 0, 0, 0, 0, 12, 7.2, L);
    K.kb(k, K.PM.roof, 6, 7.35, 0, 12.6, 0.3, L + 0.6);
    for (let i = 0; i < 8; i++) { const z = -L / 2 + 2.2 + i * 3.6, lit = Math.random() < 0.6; K.kadd(k, K.PG['win' + (lit ? 3 : 4)], K.PM.winAtlas, -0.02, 5.0, z, 0, yaw, 0, 2.2, 1.0); if (lit) K.kadd(k, K.KG.plane, U.winGlow, -0.08, 5.0, z, 0, yaw, 0, 4.4, 2.2); }
    for (const z of [-8, 0, 8]) K.kadd(k, sw(K.KG.box, S.iron), P, -0.03, 1.8, z, 0, 0, 0, 0.06, 3.4, 4.2);
    K.kadd(k, signGeo(8), U.sign, -0.07, 6.3, 0, 0, yaw, 0, 6.4, 1.4);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  function farm(K) {   // a polder farm far off the dike: a long roof, one window still lit
    mats(K); const k = K.kit(), yaw = -Math.PI / 2, al = Math.atan2(5, 5.4), sl = Math.hypot(5.4, 5);
    K.kb(k, U.brick, 5, 2, 0, 10, 4, 18);
    for (const s of [-1, 1]) K.kb(k, K.PM.roof, 5 + s * 2.7, 6.5, 0, sl, 0.2, 18.6, 0, 0, -s * al);
    for (const s of [-1, 1]) K.kadd(k, U.tri, U.brick, 5, 4, s * 9, 0, s < 0 ? Math.PI : 0, 0, 10, 5, 1);
    K.kadd(k, K.PG.win1, K.PM.winAtlas, -0.02, 1.8, K.rnd(-5, 5), 0, yaw, 0, 1.0, 1.3);
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }
  // the edge of the old island on the dyke: three stone terraces up the hill, small houses on each, windows lit all the way up
  function townBank(K) {
    mats(K); const k = K.kit();
    for (const [fx, fy, n] of [[3.0, 2.0, 5], [11.0, 3.9, 5], [19.0, 5.8, 4]]) urkRow(K, n, { k, ox: fx + 3, oy: fy, lit: 0.55, plain: true, base: true, alleys: 0.2 });
    const g = K.kbuild(k); g.userData.faceRoad = true; return g;
  }

  // ---------- the old shore: the lighthouse, the Kerkje aan de Zee, the fishermen's monument, the Ommelebommelestien ----------
  function kerkje(K, k, x, y, z, fs) {   // brick, round arched windows on the long side (fs: +1 faces +x, -1 faces -x), the tower with its balustrade, octagonal lantern and onion top
    const P = U.paint, B = K.KG.box, br = U.brick, al = Math.atan2(2.6, 3.4), sl = Math.hypot(3.4, 2.6);
    K.kb(k, br, x, y + 2.6, z, 6.4, 5.2, 11);
    for (const s of [-1, 1]) K.kb(k, K.PM.roof, x + s * 1.7, y + 6.5, z, sl, 0.14, 11.4, 0, 0, -s * al);
    K.kadd(k, U.tri, br, x, y + 5.19, z + 5.5, 0, 0, 0, 6.4, 2.6, 1);
    for (let i = 0; i < 3; i++) {
      const wz = z - 3 + i * 3, lit = i === 1 || Math.random() < 0.3;
      K.kadd(k, sw(K.KG.disc, S.white), P, x + fs * 3.203, y + 3.55, wz, 0, fs * Math.PI / 2, 0, 1.87, 1.87, 1);
      K.kadd(k, sw(K.KG.disc, S.iron), P, x + fs * 3.207, y + 3.55, wz, 0, fs * Math.PI / 2, 0, 1.57, 1.57, 1);
      K.kadd(k, K.PG['win' + (lit ? 3 : 5)], K.PM.winAtlas, x + fs * 3.212, y + 2.5, wz, 0, fs * Math.PI / 2, 0, 0.95, 2.1);
      if (lit) K.kadd(k, K.KG.plane, U.winGlow, x + fs * 3.27, y + 2.6, wz, 0, fs * Math.PI / 2, 0, 2.4, 4.0);
    }
    K.kadd(k, U.tri, br, x, y + 5.19, z - 5.5, 0, Math.PI, 0, 6.4, 2.6, 1);
    const tz = z - 6.9;
    K.kb(k, br, x, y + 3.6, tz, 3.0, 7.2, 3.0);
    K.kadd(k, sw(B, S.white), P, x, y + 7.35, tz, 0, 0, 0, 3.4, 0.3, 3.4);
    K.kadd(k, sw(K.KG.cyl, S.white), P, x, y + 8.3, tz, 0, Math.PI / 8, 0, 2.0, 1.6, 2.0);
    K.kadd(k, sw(K.KG.ball, S.copper), P, x, y + 9.7, tz, 0, 0, 0, 1.9, 2.1, 1.9);
    K.kadd(k, sw(B, S.iron), P, x, y + 11.1, tz, 0, 0, 0, 0.08, 1.0, 0.08); K.kadd(k, sw(B, S.iron), P, x, y + 11.45, tz, 0, 0, 0, 0.05, 0.22, 0.42);
    for (let i = 0; i < 6; i++) K.kadd(k, sw(B, S.stone), P, x + fs * K.rnd(4, 6), y + 0.35, z - 4 + i * 1.7, 0, K.rnd(-0.1, 0.1), 0, 0.12, 0.7, 0.5);   // the churchyard
  }
  function monument(K, k, x, y, z) {   // a fisherman's wife on her plinth, turned to the land, looking back at the water; the names on marble behind her
    const P = U.paint, B = K.KG.box, M = S.marble;
    K.kadd(k, sw(B, S.stone), P, x - 1.7, y + 0.75, z, 0, 0, 0, 0.5, 1.5, 6.4);
    for (let i = 0; i < 6; i++) K.kadd(k, sw(B, M), P, x - 1.43, y + 0.8, z - 2.6 + i * 1.04, 0, 0, 0, 0.04, 1.0, 0.84);
    K.kadd(k, sw(B, S.stone), P, x, y + 0.6, z, 0, 0, 0, 1.3, 1.2, 1.3);
    K.kadd(k, sw(U.skirt, M), P, x, y + 2.05, z, 0, 0, 0, 1.0, 1.7, 1.0);
    K.kadd(k, sw(U.cyl, M), P, x, y + 3.25, z, 0, 0, 0, 0.38, 0.75, 0.34);
    K.kadd(k, sw(U.cape, M), P, x, y + 3.42, z, 0, 0, 0, 1.15, 0.45, 1.15);
    K.kadd(k, sw(K.KG.ball, M), P, x - 0.03, y + 3.86, z, 0, 0, 0, 0.3, 0.34, 0.3);
    K.kadd(k, sw(K.KG.dome, M), P, x + 0.04, y + 3.88, z, 0, 0, -1.15, 0.34, 0.36, 0.34);
    for (const s of [-1, 1]) tube(K, k, sw(U.cyl, M), P, [x, y + 3.5, z + s * 0.22], [x + 0.06, y + 2.65, z + s * 0.3], 0.07);
    K.kadd(k, K.KG.plane, U.winGlow, x + 0.75, y + 2.6, z, 0, Math.PI / 2, 0, 2.6, 4.2);
    K.kadd(k, K.KG.plane, U.winGlow, x + 1.2, y + 0.06, z, -Math.PI / 2, 0, 0, 3.4, 3.4);
  }
  // the white lighthouse: copper dome on a red base, one flash every 5 s, the only Dutch light that turns anticlockwise.
  // shore: on its stone shore in the lake with the Kerkje and the monument (the dyke's landmark; the group stands at GY + 0.3)
  function lighthouse(K, shore) {
    mats(K); const THREE = U.THREE, g = new THREE.Group(), k = K.kit(), P = U.paint, B = K.KG.box, b0 = shore ? 2.4 : 0, wl = WY - GY - 0.3;
    if (shore) {
      K.kadd(k, sw(U.cyl, S.stone), P, 0, 1.15, 0, 0, 0, 0, 16, 2.5, 36);
      K.kadd(k, sw(U.cyl, S.grass), P, 0, 2.41, 0, 0, 0, 0, 15.2, 0.06, 35.2);
      kerkje(K, k, -1.0, b0, 10.5, 1);
      monument(K, k, 4.6, b0, -9);
      K.kadd(k, sw(K.KG.ball, S.stone), P, -9.5, wl + 0.15, -22, 0, 0.4, 0.2, 2.4, 1.4, 1.9); K.kadd(k, sw(K.KG.ball, S.stone), P, -8.4, wl, -21, 0, 1.2, 0, 1.2, 0.8, 1.1);
    }
    K.kadd(k, sw(U.taper, S.white), P, 0, b0 + 8, 0, 0, 0, 0, 3.0, 16, 3.0);
    K.kadd(k, sw(B, S.iron), P, 1.99, b0 + 1.1, 0, 0, 0, 0, 0.1, 2.1, 0.95);
    for (const [wy, cell] of [[5.5, 4], [9.5, 3], [13.2, 4]]) K.kadd(k, K.PG['win' + cell], K.PM.winAtlas, 1.98 - wy * 0.03 + 0.03, b0 + wy, 0, 0, Math.PI / 2, 0, 0.45, 0.75);
    K.kadd(k, sw(U.cyl, S.red), P, 0, b0 + 16.25, 0, 0, 0, 0, 4.3, 0.5, 4.3);
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; K.kadd(k, sw(B, S.iron), P, Math.cos(a) * 2.05, b0 + 16.9, Math.sin(a) * 2.05, 0, 0, 0, 0.05, 0.9, 0.05); }
    K.kadd(k, sw(U.thinRing, S.iron), P, 0, b0 + 17.35, 0, Math.PI / 2, 0, 0, 4.1, 4.1, 4.1);
    K.kadd(k, sw(U.cyl, S.red), P, 0, b0 + 16.9, 0, 0, 0, 0, 2.7, 0.8, 2.7);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; K.kadd(k, sw(B, S.iron), P, Math.cos(a) * 1.17, b0 + 18.1, Math.sin(a) * 1.17, 0, 0, 0, 0.06, 1.6, 0.06); }
    K.kadd(k, sw(K.KG.dome, S.copper), P, 0, b0 + 18.88, 0, 0, 0, 0, 2.7, 2.3, 2.7);
    K.kadd(k, sw(K.KG.ball, S.copper), P, 0, b0 + 20.15, 0, 0, 0, 0, 0.36, 0.36, 0.36);
    K.kadd(k, sw(B, S.iron), P, 0, b0 + 20.75, 0, 0, 0, 0, 0.05, 1.0, 0.05); K.kadd(k, sw(B, S.iron), P, 0.15, b0 + 21.05, 0, 0, 0, 0, 0.6, 0.05, 0.05);
    K.kbuild(k, g);
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.6, 12, 1, true), U.lantern); glass.position.y = b0 + 18.1; g.add(glass);
    // the beam: an open cone of light from the lantern, turned about the vertical (local z of a group laid on its back)
    const axis = new THREE.Group(); axis.rotation.x = -Math.PI / 2; axis.position.y = b0 + 18.1; g.add(axis);
    const rot = new THREE.Group(); rot.rotation.z = Math.random() * 6.3; axis.add(rot);
    const bg = new THREE.CylinderGeometry(0.35, 7.5, 64, 14, 1, true); bg.translate(0, -32, 0); bg.rotateZ(Math.PI / 2);
    const beam = new THREE.Mesh(bg, U.beam); beam.renderOrder = 4; rot.add(beam);
    g.userData.blades = rot; g.userData.spin = Math.PI * 2 / 5;   // positive is anticlockwise seen from above: the wrong way round, once in 5 s
    const halo = new THREE.Sprite(U.lhHalo); halo.scale.set(5, 5, 1); halo.position.y = b0 + 18.1; g.add(halo);
    const flash = new THREE.Sprite(U.lhFlash); flash.scale.set(30, 30, 1); flash.position.y = b0 + 18.1; flash.renderOrder = 5; g.add(flash);
    flash.onBeforeRender = (r, s, cam) => {   // the flash: when the beam points at the eye
      const th = rot.rotation.z, e = g.matrixWorld.elements, c = cam.matrixWorld.elements, dx = c[12] - e[12], dz = c[14] - e[14], d = Math.hypot(dx, dz) || 1;
      U.lhFlash.opacity = Math.pow(Math.max(0, (Math.cos(th) * dx - Math.sin(th) * dz) / d), 30) * 0.95;
    };
    return g;
  }
  function kerkjeAlone(K) { mats(K); const k = K.kit(); kerkje(K, k, 3.4, 0, 0, -1); const g = K.kbuild(k); g.userData.faceRoad = true; return g; }

  // ---------- the far town, painted on the bands round the horizon ----------
  const Yof = (P, h) => P.g.canvas.height - 5 * P.m - h * P.m;
  function redDot(P, x, h, s) { const r = Math.max(1.5, s * P.m); P.w.fillStyle = 'rgba(255,40,26,0.95)'; P.w.fillRect(x - r, Yof(P, h) - r, r * 2, r * 2); }
  function turbineP(P, x, h, a, lit) {   // mast, nacelle, three blades at angle a, and the red light on top
    const R = h * 0.48;
    P.line(x, -3, x, h, Math.max(0.35, h * 0.016));
    P.box(x + h * 0.012 * P.m, h * 0.085, h - h * 0.025, h + h * 0.03);
    for (let i = 0; i < 3; i++) { const b = a + i * Math.PI * 2 / 3; P.line(x, h, x + Math.cos(b) * R * P.m, h + Math.sin(b) * R, Math.max(0.25, h * 0.009)); }
    if (lit) redDot(P, x, h + h * 0.04, h * 0.012);
  }
  function lighthouseP(P, x, base, s) {   // the white tower, its red base, the lantern lit, the dome
    P.box(x, 3.4 * s, base - 1, base + 16 * s); P.box(x, 4.6 * s, base + 16 * s, base + 16.6 * s); P.box(x, 2.6 * s, base + 16.6 * s, base + 18.6 * s);
    P.g.beginPath(); P.g.ellipse(x, Yof(P, base + 18.6 * s), 1.35 * s * P.m, 1.2 * s * P.m, 0, Math.PI, 0); P.g.fill();
    P.win(x, base + 17.0 * s, 1, 2.6 * s, 1.8 * s); P.win(x, base + 9 * s, 0.35, 0.5 * s, 0.8 * s);
  }
  function hillP(P, f0, f1, top, litP) {   // the old island: a low mound covered in small roofs, windows lit all the way up
    const x0 = P.X(f0), x1 = P.X(f1), hAt = t => top * Math.pow(Math.max(0, Math.sin(t * Math.PI)), 0.75), pts = [[x0, -5]];
    for (let i = 0; i <= 30; i++) pts.push([x0 + (x1 - x0) * i / 30, hAt(i / 30)]);
    pts.push([x1, -5]); P.poly(pts);
    for (let t = 0.04; t < 0.96;) { const wd = P.rr(4.5, 7); P.house(x0 + (x1 - x0) * t, wd, hAt(t) + P.rr(2.8, 4.6), 'roof', litP); t += wd * P.m / (x1 - x0) * P.rr(0.85, 1.25); }
    return hAt;
  }
  const skyline = {
    near(P, K, th) {
      if (th.key === 'dyke') { P.trees(0.64, 0.8, 6, 11, 9); P.house(P.X(0.72), 9, 4, 'roof', 0.5); P.trees(0.86, 1, 6, 10, 10); return; }   // polder trees on the right, nothing over the lake
      P.roofs(0, 0.4, 5, 8, 0.16, ['roof']); P.roofs(0.6, 1, 5, 8, 0.16, ['roof']); P.trees(0.42, 0.58, 3, 5, 14);
    },
    mid(P, K, th) {
      if (th.key === 'dyke') {   // turbines out in the lake on the left, the lit hill of Urk ahead on the right
        for (let i = 0; i < 4; i++) turbineP(P, P.X(0.12 + i * 0.09), P.rr(30, 36), P.rr(0, 6.3), true);
        const h = hillP(P, 0.47, 0.92, 15, 0.55);
        lighthouseP(P, P.X(0.53), h(0.13) - 1, 1.15); P.tower(P.X(0.585), [[3.6, h(0.26) + 9]], 'onion');
        return;
      }
      for (let i = 0; i < 3; i++) turbineP(P, P.X(0.06 + i * 0.08), P.rr(28, 33), P.rr(0, 6.3), true);
      P.roofs(0.3, 0.9, 8, 15, 0.22, ['roof']); lighthouseP(P, P.X(0.68), 9, 1.15); P.tower(P.X(0.42), [[3.8, 20]], 'onion');
    },
    far(P) {   // the polder flat to the horizon and the wind park in rows, red lights on every nacelle
      P.box(P.X(0.5), 2048 / P.m, -5, 0.6);
      for (let i = 0; i < 9; i++) turbineP(P, P.X(0.03 + i * 0.05), P.rr(24, 28), P.rr(0, 6.3), true);
    },
  };

  const signs3 = () => POSTS.slice().sort(() => Math.random() - 0.5).slice(0, 3);
  // the old village: houses at the kerb on both sides, lanterns on the fronts, the road climbing and dipping over the old island
  function village(base, K, shops) {
    return Object.assign({}, base, {
      fog: 0x4a535d, fogD: 0.0165, night: 0.18, ground: 0x1a1d22, groundY: -0.05, canal: 0, curv: 0.003, verge: 'tiles',
      hills: { amp: shops ? 1.6 : 2.2, len: 300 }, road: { kind: 'klinkers', tone: '#4a3d38' }, landmark: false,
      sky: { stars: 320, clouds: 0.55, glows: [] },
      spawn: [
        { make: K => urkRow(K, 4, { shops: shops ? 0.75 : 0 }), n: 12, gap: 12, side: 'alt', reg: true, xr: [8.8, 8.95], r: 11 },
        { make: K => urkRow(K, 4, { plain: true, lit: 0.3, oy: 1.6, base: true }), n: 8, gap: 18, side: 'alt', reg: true, xr: [19, 21], r: 14 },
        { make: urkLantern, n: 12, gap: 12, side: 'alt', reg: true, xr: [5.55, 5.55] },
        { make: K => lighthouse(K, false), n: 1, gap: 260, side: 'right', xr: [30, 36], r: 4, y: 3.2 },
        { make: kerkjeAlone, n: 1, gap: 230, side: 'left', xr: [26, 30], r: 9, y: 1.6 },
        { make: viskisten, n: shops ? 3 : 4, gap: 45, side: 'both', xr: [4.75, 4.85], r: 0.5 },
        { make: K => K.bench(), n: 2, gap: 90, side: 'both', xr: [4.9, 4.9], r: 0.9 },
        { make: K => K.fingerpost(signs3()), n: 2, gap: 85, side: 'both', xr: [4.65, 4.65], r: 0.5 },
        { make: K => K.bikeRow(), n: 3, gap: 60, side: 'both', xr: [4.85, 4.95], r: 0.6 },
        { make: 'zombieWalk', n: 8, gap: 18, side: 'both', xr: [4.75, 5.05], r: 0.6 },
      ],
    });
  }

  T.urk = {
    style: { brick: [0xc9c4b4, 0xbab3a0, 0xa9aba4], gables: 0, height: [3.4, 4.4], width: [5, 6] },
    light: { lamp: 0xffc890 },
    sky: { stars: 650, milkyWay: 0.22, milkyWayAz: 40, clouds: 0.4, glows: [{ az: -18, el: 1, w: 50, h: 5, color: 0xffb070, a: 0.13 }] },
    road: { tone: '#2f333a' },
    shops: SHOPS, signs: POSTS, extra: [],
    landmark: K => lighthouse(K, true),
    skyline,
    dead: {
      pool: ['urkerman', 'urkerman', 'urkerhoed', 'urkervrouw', 'urkervrouw', 'urkerzondag'],
      dress: {
        urkerman(k, b, K) { urkerMan(k, b, K, false); }, urkerhoed(k, b, K) { urkerMan(k, b, K, true); },
        urkervrouw(k, b, K) { urkerVrouw(k, b, K, false); }, urkerzondag(k, b, K) { urkerVrouw(k, b, K, true); },
      },
    },
    themes: {
      // the IJsselmeer dike: the black lake on the left with the turbines standing in it and the kotters at the quay, the black polder
      // on the right far below, the old island's lit terraces and the fish auction where the dike meets the town
      dyke: (base, K) => Object.assign({}, base, {
        fog: 0x46515b, fogD: 0.0135, night: 0.15, open: true, water: 0x2f3a44, waterY: WY, waterK: 0.36, ground: 0x0c0f12, groundY: GY, canal: -1, curv: 0.0024,
        lmSide: 'left', lmX: [15.5, 17],
        spawn: [
          { make: turbine, n: 4, gap: 85, side: 'left', xr: [42, 60], y: WY, r: 6 },
          { make: turbine, n: 2, gap: 180, side: 'right', xr: [32, 46], y: GY, r: 6 },
          { make: lake, n: 4, gap: 90, side: 'left', xr: [96, 96], y: WY - 0.03, r: 0.5 },
          { make: kotters, n: 3, gap: 75, side: 'left', xr: [11.5, 12.5], y: WY, r: 12 },
          { make: townBank, n: 2, gap: 165, side: 'right', xr: [12.5, 14], y: GY, r: 15 },
          { make: afslag, n: 1, gap: 270, side: 'right', xr: [17, 20], y: GY, r: 16 },
          { make: K => K.lamppost(), n: 6, gap: 40, side: 'right', reg: true, xr: [4.7, 4.7] },
          { make: K => K.reeds(), n: 10, gap: 26, side: 'left', xr: [5.6, 6.6], y: WY - 0.1 },
          { make: viskisten, n: 4, gap: 55, side: 'left', xr: [4.85, 4.95], r: 0.5 },
          { make: bolders, n: 5, gap: 40, side: 'left', xr: [4.95, 4.95], r: 0.4 },
          { make: K => K.treeCard([2, 2, 3]), n: 8, gap: 30, side: 'right', xr: [22, 40], y: GY, r: 0.9 },
          { make: farm, n: 2, gap: 160, side: 'right', xr: [46, 60], y: GY, r: 8 },
          { make: K => K.fingerpost(signs3()), n: 1, gap: 200, side: 'right', xr: [4.65, 4.65], r: 0.5 },
          { make: 'zombieWalk', n: 4, gap: 50, side: 'both', xr: [4.8, 5.1], r: 0.6 },
        ],
      }),
      street: (base, K) => village(base, K, false),
      shops: (base, K) => village(base, K, true),
    },
  };
})();
