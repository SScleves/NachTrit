// Intro panel 6 in 3D: "Or the Tikkie of one cent that is still open. Probably all of it."
// Three in the morning in his bedroom, in a dike house on the street of Alblasserdam where he lives. Two beats:
// 1. 0 to 3.7 s: the dark room. On the nightstand by the bed his phone lights up: Tikkie, Sanne asks one cent for the
//    bitterballen, open since 2019. Its cold screen is the only strong light; it glows on the wall and on him asleep.
//    Round it lies the rest of the evidence, because it was probably all of it: the cheese gone blue, the paper with the
//    poll, the tourist's beer stein the phone leans on. A slow push in.
// 2. From 3.7 s: wider, out through his window. Across the street the same request lights up one dark window after
//    another, on into the mist, a dead figure bent over a cold screen in every one of them; the dead out in the road and on
//    the verges get it too, their phones glowing in their hands, and the Tikkie pings again over a window and over one of
//    them. When the windows are all lit, the dead in the street lift their heads to his window.
// The house is shared with shot 12: window.NRHOME stages the street, clears a place in the row and builds rooms there.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const DEG = Math.PI / 180;

  // ======================================================================================================================
  // window.NRHOME: his home. The dike street of Alblasserdam (the town's street theme), always dealt from the same seed, so
  // the houses across and the lamps stand in the same places in shots 6 and 12. The room takes the place of the dike house
  // of the inner row (left of the road) nearest RZ, its front on that row's line at x FX. Everything is built in the house's
  // own frame, as the town builds its houses: the street front on minus x, the room toward plus x, z along the street;
  // W.add turns the frame round for the left of the road (world = FX - x, y, RZ - z).
  // ======================================================================================================================
  const H = window.NRHOME = window.NRHOME || {};
  Object.assign(H, {
    SEED: 615, RZ: -20, FX: -8.2, WT: 0.3,
    rng(a) { return () => { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; },
    // what a shot owns and gives back in dispose
    begin() { return { mats: [], tex: [], geo: [], hidden: [], props: [], light: null, light0: null, hemi: null, hemi0: null, moon: null, moon0: null }; },
    canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; },
    tex(st, W, c, colour, repeat) {
      const t = new W.THREE.CanvasTexture(c); if (colour) t.colorSpace = W.THREE.SRGBColorSpace;
      if (repeat) t.wrapS = t.wrapT = W.THREE.RepeatWrapping;
      st.tex.push(t); return t;
    },
    mat(st, m) { st.mats.push(m); return m; },
    geo(st, g) { st.geo.push(g); return g; },
    // the street: staged and stopped, without the rider; the dike house that stood here and the walking dead go (they would
    // walk through the set), and the ground mist that drifts on this side of the road
    stage(W, st, o = {}) {
      W.stage({ town: 'alblasserdam', theme: 'street', seed: H.SEED, rider: false, fog: o.fog || 1 });
      W.speed(0);
      const box = new W.THREE.Box3(), gone = [];
      for (const ch of W.scene.children) {
        if (!ch.isGroup || !ch.visible || !ch.userData.faceRoad || ch.position.x > -6.5 || ch.position.x < -12) continue;
        box.setFromObject(ch);
        if (box.max.y > 3.5 && box.max.z > H.RZ - 4.5 && box.min.z < H.RZ + 4.5) gone.push(ch);
      }
      W.hide(m => gone.includes(m) || (m.userData && m.userData.shuffle !== undefined) ||
        (m.isSprite && m.userData && m.userData.band && m.position.x < -5.5 && Math.abs(m.position.z - H.RZ) < 26));
      // the game's lights: the clue light (a spot that stands idle in a shot) becomes the room's key light; the sky light is
      // dimmed through its colours (the game sets its strength every frame, not its colours). Both are given back in end().
      const L = st.light = W.scene.children.find(m => m.isSpotLight && m !== W.lampLight) || null;
      if (L) st.light0 = { color: L.color.getHex(), intensity: L.intensity, angle: L.angle, penumbra: L.penumbra, distance: L.distance, decay: L.decay, pos: L.position.clone(), tgt: L.target.position.clone() };
      const hemi = st.hemi = W.scene.children.find(m => m.isHemisphereLight) || null;
      if (hemi) { st.hemi0 = [hemi.color.getHex(), hemi.groundColor.getHex()]; if (o.sky) { hemi.color.multiplyScalar(o.sky); hemi.groundColor.multiplyScalar(o.sky); } }
      // the moonlight would shine straight through the walls into the room (there are no shadows): it is turned down
      const moon = st.moon = W.scene.children.find(m => m.isDirectionalLight) || null;
      if (moon) { st.moon0 = moon.intensity; if (o.moon != null) moon.intensity *= o.moon; }
    },
    // house frame to world
    P(W, x, y, z) { return new W.THREE.Vector3(H.FX - x, y, H.RZ - z); },
    // the key light: a spot at a, aimed at b (house frame)
    key(W, st, a, b, o) {
      const L = st.light; if (!L) return;
      L.position.copy(H.P(W, ...a)); L.target.position.copy(H.P(W, ...b)); L.target.updateMatrixWorld();
      L.color.setHex(o.color); L.angle = o.angle; L.penumbra = o.penumbra == null ? 1 : o.penumbra; L.distance = o.distance; L.decay = o.decay || 1; L.intensity = o.intensity;
    },
    // wallpaper: 'stripe' (a cool pinstripe with a small damask dot) or 'flower' (big warm seventies flowers)
    paper(st, W, kind) {
      const [c, g] = H.canvas(256, 256), r = H.rng(kind === 'flower' ? 31 : 37);
      if (kind === 'flower') {
        g.fillStyle = '#b08a52'; g.fillRect(0, 0, 256, 256);
        for (let x = 0; x < 256; x += 4) { g.fillStyle = `rgba(90,60,30,${(0.04 + 0.04 * Math.sin(x * 0.4)).toFixed(3)})`; g.fillRect(x, 0, 2, 256); }
        for (const [cx, cy, s] of [[64, 64, 1], [192, 192, 1], [192, 64, 0.62], [64, 192, 0.62]]) {
          for (const [ox, oy] of [[0, 0], [256, 0], [-256, 0], [0, 256], [0, -256]]) {
            const x = cx + ox, y = cy + oy;
            for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g.fillStyle = i % 2 ? '#7a4a22' : '#8e5a2a'; g.beginPath(); g.ellipse(x + Math.cos(a) * 26 * s, y + Math.sin(a) * 26 * s, 20 * s, 12 * s, a, 0, 7); g.fill(); }
            g.fillStyle = '#c89a5a'; g.beginPath(); g.arc(x, y, 13 * s, 0, 7); g.fill(); g.fillStyle = '#6a3a1a'; g.beginPath(); g.arc(x, y, 6 * s, 0, 7); g.fill();
          }
        }
      } else {
        g.fillStyle = '#8a92a0'; g.fillRect(0, 0, 256, 256);
        for (let x = 0; x < 256; x += 32) { g.fillStyle = 'rgba(40,46,60,0.35)'; g.fillRect(x, 0, 3, 256); g.fillStyle = 'rgba(220,226,236,0.12)'; g.fillRect(x + 16, 0, 1, 256); }
        for (let y = 0; y < 256; y += 32) for (let x = 0; x < 256; x += 32) { const ox = (y / 32) % 2 ? 16 : 0; g.fillStyle = 'rgba(40,46,60,0.22)'; g.beginPath(); g.ellipse(x + ox + 8, y + 16, 3, 5, 0, 0, 7); g.fill(); }
      }
      for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(0,0,0,${(0.02 + r() * 0.04).toFixed(3)})`; g.fillRect(r() * 256, r() * 256, 2, 2); }
      return H.tex(st, W, c, true, true);
    },
    // the room: a box of walls round the house frame's origin (the front wall's outer face at x 0), the windows cut in the
    // front wall. spec: { D depth, Z half width, Y ceiling, wins: [{ z0, z1, y0, y1, tr transom, bars }], paper, tint,
    // glow (the walls' own faint light, so the dark still has a shape) }
    room(W, st, s) {
      const THREE = W.THREE, WT = H.WT, X1 = WT + s.D, Z = s.Z, Y = s.Y, k = W.kit(), g = new THREE.Group();
      g.name = 'nrhome-room';
      const wall = H.mat(st, W.Mat({ color: s.tint, map: H.paper(st, W, s.paper), emissive: s.glow || 0x000000, emissiveIntensity: 1 }, W.TINT.warm)); wall.userData.wuv = 0.9;
      const ceil = H.mat(st, W.Mat({ color: s.ceil || 0x3a3c42, emissive: s.glow || 0x000000, emissiveIntensity: 0.7 }));
      const paint = H.mat(st, W.Mat({ color: s.frame || 0xcfc8b6, emissive: s.glow || 0x000000, emissiveIntensity: 0.6 }));
      const stone = H.mat(st, W.Mat({ color: 0x77736a }));
      const floor = s.floor || W.M.wood;
      // floor, ceiling, back and side walls
      W.kb(k, floor, X1 / 2, -0.05, 0, X1 + 0.6, 0.1, 2 * Z + 0.6);
      W.kb(k, ceil, X1 / 2, Y + 0.08, 0, X1 + 0.6, 0.16, 2 * Z + 0.6);
      W.kb(k, wall, X1 + 0.15, Y / 2, 0, 0.3, Y, 2 * Z + 0.6);
      for (const sz of [-1, 1]) W.kb(k, wall, X1 / 2, Y / 2, sz * (Z + 0.15), X1 + 0.6, Y, 0.3);
      // the front wall, round its windows
      const wins = (s.wins || []).slice().sort((a, b) => a.z0 - b.z0);
      let z = -Z - 0.3;
      for (const w of wins) {
        if (w.z0 > z) W.kb(k, wall, WT / 2, Y / 2, (z + w.z0) / 2, WT, Y, w.z0 - z);
        W.kb(k, wall, WT / 2, w.y0 / 2, (w.z0 + w.z1) / 2, WT, w.y0, w.z1 - w.z0);
        W.kb(k, wall, WT / 2, (w.y1 + Y) / 2, (w.z0 + w.z1) / 2, WT, Y - w.y1, w.z1 - w.z0);
        z = w.z1;
      }
      W.kb(k, wall, WT / 2, Y / 2, (z + Z + 0.3) / 2, WT, Y, Z + 0.3 - z);
      // skirting boards and a picture rail
      W.kb(k, paint, X1 - 0.01, 0.06, 0, 0.03, 0.12, 2 * Z);
      for (const sz of [-1, 1]) W.kb(k, paint, X1 / 2 + WT / 2, 0.06, sz * (Z - 0.01), s.D, 0.12, 0.03);
      W.kb(k, paint, WT + 0.01, 0.06, 0, 0.03, 0.12, 2 * Z);
      // the windows: a painted frame in the reveal, a transom with its top light, glazing bars, the stone sill inside
      const glass = [];
      for (const w of wins) {
        const zc = (w.z0 + w.z1) / 2, wd = w.z1 - w.z0, gx = WT * 0.45, fr = 0.06;
        W.kb(k, paint, gx, w.y0 + fr / 2, zc, 0.1, fr, wd);
        W.kb(k, paint, gx, w.y1 - fr / 2, zc, 0.1, fr, wd);
        for (const sz of [-1, 1]) W.kb(k, paint, gx, (w.y0 + w.y1) / 2, zc + sz * (wd / 2 - fr / 2), 0.1, w.y1 - w.y0, fr);
        if (w.tr) W.kb(k, paint, gx, w.tr, zc, 0.1, 0.07, wd);
        const bars = w.bars == null ? 1 : w.bars;
        for (let i = 1; i <= bars; i++) W.kb(k, paint, gx, ((w.tr || w.y1) + w.y0) / 2, w.z0 + wd * i / (bars + 1), 0.08, (w.tr || w.y1) - w.y0, 0.05);
        if (w.tr && w.top) for (let i = 1; i < w.top; i++) W.kb(k, paint, gx, (w.tr + w.y1) / 2, w.z0 + wd * i / w.top, 0.06, w.y1 - w.tr, 0.035);
        W.kb(k, stone, WT + 0.08, w.y0 - 0.02, zc, 0.2, 0.04, wd + 0.16);
        // the reveal round the glass on the inside, painted
        W.kb(k, paint, WT * 0.75, w.y0 + 0.002, zc, WT * 0.5, 0.004, wd);
        glass.push({ x: gx, zc, wd, y0: w.y0, y1: w.y1, tr: w.tr });
      }
      W.kbuild(k, g);
      // the glass itself: a faint cold sheen, and a few soft streaks of what it reflects
      const [c, gc] = H.canvas(128, 128);
      gc.fillStyle = '#000'; gc.fillRect(0, 0, 128, 128);
      for (const [x, w, a] of [[30, 16, 0.5], [58, 6, 0.35], [96, 22, 0.4]]) { const gr = gc.createLinearGradient(x - w, 0, x + w, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); gc.save(); gc.translate(64, 64); gc.rotate(-0.5); gc.translate(-64, -64); gc.fillStyle = gr; gc.fillRect(x - w, -40, w * 2, 208); gc.restore(); }
      const sheen = H.mat(st, W.GlowMat(H.tex(st, W, c, false), s.sheen || 0x7f93aa, s.sheenA == null ? 0.07 : s.sheenA));
      for (const q of glass) { const m = new THREE.Mesh(W.KG.plane, sheen); m.position.set(q.x - 0.01, (q.y0 + q.y1) / 2, q.zc); m.rotation.y = Math.PI / 2; m.scale.set(q.wd, q.y1 - q.y0, 1); m.renderOrder = 5; g.add(m); }
      st.props.push(W.add(g, H.FX, 0, H.RZ, Math.PI));
      return { g, glass, X1, Z, Y, paint, wall, stone };
    },
    // the lens for this screen: at least fov, wide enough that halfW degrees show either side of the middle and halfV above and
    // below it in the picture band (an upright phone sees only a narrow slice of a wide shot)
    lens(W, fov, halfW, halfV) {
      const { asp, band } = H.view(W);
      return Math.min(70, Math.max(fov, 2 * Math.atan(Math.tan(halfW * DEG) / asp) / DEG, 2 * Math.atan(Math.tan(halfV * DEG) / band) / DEG));
    },
    // the screen: its aspect, the picture band's share of the height, and how far it is an upright phone (narrow, 0 to 1) or a
    // phone on its side with a short band under the captions (short, 0 to 1)
    view(W) {
      const asp = W.camera.aspect || 1.6, v = W.camera.view, band = v && v.enabled ? W.clamp((0.82 * innerHeight - 2 * v.offsetY) / innerHeight, 0.2, 1) : 0.7;
      return { asp, band, narrow: W.clamp((1.2 - asp) / 0.6, 0, 1), short: W.clamp((0.64 - band) / 0.15, 0, 1) };
    },
    end(W, st) {
      if (!st) return;
      const L = st.light, l0 = st.light0;
      if (L && l0) { L.color.setHex(l0.color); L.intensity = l0.intensity; L.angle = l0.angle; L.penumbra = l0.penumbra; L.distance = l0.distance; L.decay = l0.decay; L.position.copy(l0.pos); L.target.position.copy(l0.tgt); L.target.updateMatrixWorld(); }
      if (st.hemi && st.hemi0) { st.hemi.color.setHex(st.hemi0[0]); st.hemi.groundColor.setHex(st.hemi0[1]); }
      if (st.moon && st.moon0 != null) st.moon.intensity = st.moon0;
      for (const o of st.hidden) o.visible = true;
      // the kits built fresh geometry for this shot; the game's shared parts are left alone
      const PG = Object.values(W.PG);
      for (const p of st.props) p.traverse(m => { if (m.isMesh && m.geometry && m.geometry.userData.kit && !PG.includes(m.geometry)) m.geometry.dispose(); });
      for (const x of st.geo) x.dispose();
      for (const x of st.mats) x.dispose();
      for (const x of st.tex) x.dispose();
    },
  });

  // ======================================================================================================================
  // Shot 6: the bedroom
  // ======================================================================================================================
  const CUT = 3.7, WAVE = 2.9, WT0 = H.WT;   // the cut to the window; when the first window across lights up (seen already in beat 1)
  // the bedroom in the house frame: the bed's head against the front wall, the nightstand between it and the window
  const ROOM = { D: 3.8, Z: 2.1, Y: 2.6, paper: 'stripe', tint: 0x343a48, ceil: 0x24262c, frame: 0xa8a294,
    wins: [{ z0: -1.05, z1: 0.35, y0: 0.92, y1: 2.22, tr: 1.88, bars: 0, top: 3 }] };
  const NS = { x0: 0.31, x1: 0.75, z0: 0.38, z1: 0.9, top: 0.58 };   // the nightstand
  const PHONE = [0.585, NS.top, 0.62];                               // the foot of the phone, leaning back on the stein
  // the eye in the house frame: beat 1 pushes in on the phone; beat 2 looks out through the glass, across and up the street
  const CAM1 = [3.6, 1.32, -1.0], CAM1E = [1.4, 0.98, 0.02], LOOK1 = [0.5, 1.02, 0.22], LOOK1E = [0.56, 0.74, 0.6];
  const CAM2 = [1.38, 1.42, -1.02], CAM2E = [1.02, 1.4, -0.92];
  let st = null;

  // ---- canvases
  // the Tikkie on his phone, as the painting has it: Sanne asks one cent for the bitterballen, open since 2019
  function screenTex(W) {
    const [c, g] = H.canvas(256, 512);
    let gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#c4f4ff'); gr.addColorStop(1, '#7cc9e4');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 512);
    g.fillStyle = '#2a6f8c'; g.fillRect(0, 0, 256, 30); g.fillStyle = '#d8f8ff'; g.font = '600 18px "Segoe UI", system-ui, sans-serif'; g.textBaseline = 'middle'; g.fillText('03:00', 14, 16);
    g.fillRect(214, 9, 26, 13); g.fillStyle = '#2a6f8c'; g.fillRect(229, 12, 9, 7);
    g.fillStyle = '#3d9cc0'; g.fillRect(0, 30, 256, 62); g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.font = '800 40px "Segoe UI", system-ui, sans-serif'; g.fillText('Tikkie', 128, 62);
    g.fillStyle = '#ffffff'; g.beginPath(); g.arc(128, 146, 38, 0, 7); g.fill(); g.fillStyle = '#3d9cc0'; g.font = '800 44px "Segoe UI", system-ui, sans-serif'; g.fillText('S', 128, 148);
    g.fillStyle = '#123a4c'; g.font = '600 24px "Segoe UI", system-ui, sans-serif'; g.fillText('Sanne vraagt', 128, 214);
    g.font = '800 70px "Segoe UI", system-ui, sans-serif'; g.fillText('€ 0,01', 128, 278);
    g.font = '500 21px "Segoe UI", system-ui, sans-serif'; g.fillText('voor de bitterballen', 128, 330);
    g.fillStyle = '#b8282a'; g.font = '700 21px "Segoe UI", system-ui, sans-serif'; g.fillText('open sinds 2019', 128, 362);
    g.fillStyle = '#123a4c'; g.beginPath(); g.roundRect ? g.roundRect(30, 420, 196, 56, 14) : g.rect(30, 420, 196, 56); g.fill();
    g.fillStyle = '#ffffff'; g.font = '800 30px "Segoe UI", system-ui, sans-serif'; g.fillText('Betalen', 128, 449);
    return H.tex(st, W, c, true);
  }
  // the morning paper against the wall: the poll, Flemish winning
  function paperTex(W) {
    const [c, g] = H.canvas(256, 320);
    g.fillStyle = '#d8d2c2'; g.fillRect(0, 0, 256, 320);
    g.fillStyle = '#1c1c20'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '700 24px Georgia, serif'; g.fillText('DE DIJKBODE', 128, 24); g.fillRect(14, 40, 228, 3);
    g.font = '900 46px "Segoe UI", system-ui, sans-serif'; g.fillText('VLAAMS', 128, 82); g.fillText('WINT', 128, 128);
    g.font = '500 15px "Segoe UI", system-ui, sans-serif'; g.fillText('Wereldpeiling: mooiste Nederlands', 128, 164);
    g.fillStyle = '#e8b830'; g.fillRect(40, 186, 52, 110); g.fillStyle = '#b8282a'; g.fillRect(40, 186, 52, 34);
    g.fillStyle = '#e07a2a'; g.fillRect(150, 268, 52, 28);
    g.fillStyle = '#1c1c20'; g.font = '700 15px "Segoe UI", system-ui, sans-serif'; g.fillText('87%', 66, 176); g.fillText('13%', 176, 258);
    for (let y = 196; y < 300; y += 9) { g.fillStyle = 'rgba(30,30,34,0.25)'; g.fillRect(102, y, 40, 3); }
    return H.tex(st, W, c, true);
  }
  // the alarm clock's face: 03:00 in red, the colon drawn apart so it can blink
  function clockTex(W) {
    const [c, g] = H.canvas(128, 64);
    g.fillStyle = '#100808'; g.fillRect(0, 0, 128, 64);
    g.fillStyle = '#ff3a22'; g.font = '700 42px "Segoe UI", system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('03', 34, 34); g.fillText('00', 94, 34);
    return H.tex(st, W, c, true);
  }
  // a soft round wash with no visible edge, for light on a wall (dithered, so the dark room shows no rings)
  function softTex(W) {
    const [c, g] = H.canvas(256, 256), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128), r = H.rng(9);
    for (let i = 0; i <= 16; i++) { const u = i / 16; gr.addColorStop(u, `rgba(255,255,255,${(Math.pow(1 - u, 1.7) * (1 - u * u * 0.3)).toFixed(3)})`); }
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    const im = g.getImageData(0, 0, 256, 256), d = im.data;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) d[i] = Math.max(0, Math.min(255, d[i] + (r() - 0.5) * 6));
    g.putImageData(im, 0, 0);
    return H.tex(st, W, c, false);
  }
  // a thin ring for the ping
  function ringTex(W) {
    const [c, g] = H.canvas(128, 128);
    const gr = g.createRadialGradient(64, 64, 40, 64, 64, 62); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return H.tex(st, W, c, false);
  }
  // the windows across the street, lit by a phone: a card over the glazed part of each window. The room behind goes cold blue
  // from the screen; the one holding it stays a black shape bent over it, the screen bright at its chest, its chin and nose
  // caught from below, two small yellow eyes. Three cells (bare head, Sunday hat, yard helmet); the window's bars stay dark.
  const CARD = { pw: 0.83, ph: 1.39 };
  function cardTex(W) {
    const cw = 128, chh = 214, [c, g] = H.canvas(cw * 3, chh);
    const ty = chh * 0.32, mx = cw / 2;
    for (let i = 0; i < 3; i++) {
      g.save(); g.translate(i * cw, 0); g.beginPath(); g.rect(0, 0, cw, chh); g.clip();
      const fx = cw * (i === 1 ? 0.7 : 0.3), phy = chh * 0.62, hy = phy - 44;   // the figure stands in one pane, its phone at the chest
      g.fillStyle = '#0b141c'; g.fillRect(0, 0, cw, chh);
      let gr = g.createRadialGradient(fx, phy, 2, fx, phy, 150); gr.addColorStop(0, 'rgb(205,248,255)'); gr.addColorStop(0.18, 'rgb(120,214,246)'); gr.addColorStop(0.55, 'rgb(48,128,170)'); gr.addColorStop(1, 'rgb(18,52,76)');
      g.fillStyle = gr; g.fillRect(0, 0, cw, chh);
      g.fillStyle = '#05080b';
      g.beginPath(); g.moveTo(fx - 30, chh + 4); g.lineTo(fx - 27, hy + 26); g.quadraticCurveTo(fx - 22, hy + 13, fx - 8, hy + 13); g.lineTo(fx + 8, hy + 13); g.quadraticCurveTo(fx + 22, hy + 13, fx + 27, hy + 26); g.lineTo(fx + 30, chh + 4); g.fill();
      g.beginPath(); g.ellipse(fx, hy + 6, 10.5, 12.5, 0, 0, 7); g.fill();
      if (i === 1) { g.beginPath(); g.ellipse(fx, hy - 4, 17, 3.5, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(fx, hy - 7, 10, 7, 0, Math.PI, 0); g.fill(); }
      if (i === 2) { g.beginPath(); g.ellipse(fx, hy - 1, 12.5, 10, 0, Math.PI, 0); g.fill(); g.fillRect(fx - 14, hy - 2, 28, 3); }
      g.beginPath(); g.ellipse(fx - 5, phy + 4, 7, 5, 0.3, 0, 7); g.ellipse(fx + 5, phy + 4, 7, 5, -0.3, 0, 7); g.fill();
      g.fillStyle = '#f0fdff'; g.fillRect(fx - 4, phy - 8, 8, 12);
      g.fillStyle = 'rgb(140,220,245)'; g.beginPath(); g.ellipse(fx, hy + 15, 6.5, 2.6, 0, 0, Math.PI); g.fill(); g.fillRect(fx - 1, hy + 8, 2, 4);
      g.fillStyle = '#ffd040'; g.fillRect(fx - 5, hy + 5, 2, 2); g.fillRect(fx + 3, hy + 5, 2, 2);
      g.fillStyle = '#12161a'; g.fillRect(0, ty - 3, cw, 6); g.fillRect(mx - 3, ty, 6, chh - ty);
      for (const f of [1 / 3, 2 / 3]) g.fillRect(cw * f - 2, 0, 4, ty);
      g.restore();
    }
    return H.tex(st, W, c, true);
  }

  // ---- the set
  function build(W) {
    const THREE = W.THREE, P = (x, y, z) => H.P(W, x, y, z);
    H.stage(W, st, { fog: 1.45, sky: 0.5, moon: 0.15 });
    const R = st.room = H.room(W, st, ROOM), g = R.g;
    const mk = (o, warm) => H.mat(st, W.Mat(o, warm ? W.TINT.warm : W.TINT.cool));
    const M = st.M = {
      wood: mk({ color: 0x2c2018 }, 1), stand: mk({ color: 0x3a2a1e }, 1), sheet: mk({ color: 0x8e96a4 }), duvet: mk({ color: 0x4a566a }),
      edge: mk({ color: 0xaab0ba }), pillow: mk({ color: 0xb8bcc4 }), hair: mk({ color: 0x1a1412 }), curtain: mk({ color: 0x4a1a1a }, 1),
      beer: mk({ color: 0xc8862a, emissive: 0x3a1e06, emissiveIntensity: 1 }), foam: mk({ color: 0xe0d8c4 }), plate: mk({ color: 0xcfcac0 }),
      cheese: mk({ color: 0xb09640, emissive: 0x2a2208, emissiveIntensity: 1 }), mould: mk({ color: 0x4a8a9a, emissive: 0x0e2a32, emissiveIntensity: 1 }), fuzz: mk({ color: 0xd6dad6 }), black: mk({ color: 0x141518 }),
    };
    const k = W.kit();
    // the bed: its head against the front wall, him asleep on his side under a grey duvet
    const bz0 = 0.98, bz1 = 2.08, bzc = (bz0 + bz1) / 2, bx1 = 2.36;
    for (const [x, z] of [[0.36, bz0 + 0.04], [0.36, bz1 - 0.04], [bx1 - 0.04, bz0 + 0.04], [bx1 - 0.04, bz1 - 0.04]]) W.kb(k, M.wood, x, 0.12, z, 0.06, 0.24, 0.06);
    W.kb(k, M.wood, (0.37 + bx1) / 2, 0.24, bzc, bx1 - 0.37, 0.1, bz1 - bz0);
    W.kb(k, M.wood, 0.34, 0.39, bzc, 0.05, 0.78, bz1 - bz0 + 0.06);
    W.kb(k, M.wood, bx1 - 0.02, 0.34, bzc, 0.05, 0.62, bz1 - bz0 + 0.06);
    W.kb(k, M.sheet, (0.37 + bx1) / 2, 0.38, bzc, bx1 - 0.42, 0.18, bz1 - bz0 - 0.04);
    W.kb(k, M.duvet, 1.6, 0.5, bzc, 1.44, 0.08, bz1 - bz0 + 0.06);
    for (const sz of [-1, 1]) W.kb(k, M.duvet, 1.6, 0.38, bzc + sz * (bz1 - bz0 + 0.06) / 2, 1.44, 0.26, 0.03);
    W.kadd(k, W.KG.ball, M.duvet, 1.42, 0.55, bzc - 0.08, 0, 0, 0, 1.36, 0.24, 0.56);   // him under it, on his side
    W.kadd(k, W.KG.ball, M.duvet, 0.98, 0.6, bzc - 0.1, 0, 0, 0.2, 0.46, 0.32, 0.54);    // his shoulder
    W.kb(k, M.edge, 0.86, 0.6, bzc, 0.12, 0.07, bz1 - bz0 + 0.04, 0, 0, 0.35);           // the sheet turned down over it
    W.kadd(k, W.KG.ball, M.pillow, 0.56, 0.52, bzc + 0.05, 0, 0, 0, 0.34, 0.15, 0.78);
    W.kadd(k, W.KG.ball, M.hair, 0.66, 0.66, bzc - 0.12, 0, 0, 0, 0.23, 0.22, 0.25);    // the back of his head
    // the nightstand, its drawer and knob
    const nx = (NS.x0 + NS.x1) / 2, nz = (NS.z0 + NS.z1) / 2;
    W.kb(k, M.stand, nx, (NS.top - 0.03) / 2, nz, NS.x1 - NS.x0, NS.top - 0.03, NS.z1 - NS.z0);
    W.kb(k, M.stand, nx + 0.01, NS.top - 0.015, nz, NS.x1 - NS.x0 + 0.03, 0.03, NS.z1 - NS.z0 + 0.03);
    W.kb(k, M.wood, NS.x1 + 0.006, 0.4, nz, 0.012, 0.15, NS.z1 - NS.z0 - 0.08);
    W.kadd(k, W.KG.ball, R.paint, NS.x1 + 0.02, 0.4, nz, 0, 0, 0, 0.03, 0.03, 0.03);
    // the evidence on it: the tourist's stein (the phone leans on it), the cheese gone blue on its plate, the alarm clock
    const s0 = [0.45, NS.top, 0.69];
    W.kadd(k, W.KG.cyl, M.beer, s0[0], s0[1] + 0.075, s0[2], 0, 0, 0, 0.104, 0.15, 0.104);
    W.kadd(k, W.KG.cyl, M.foam, s0[0], s0[1] + 0.162, s0[2], 0, 0, 0, 0.108, 0.026, 0.108);
    W.kadd(k, W.KG.cyl, W.PM.silver, s0[0], s0[1] + 0.006, s0[2], 0, 0, 0, 0.118, 0.012, 0.118);
    W.kadd(k, W.KG.cyl, W.PM.silver, s0[0] - 0.01, s0[1] + 0.185, s0[2], 0, 0, 0.35, 0.116, 0.014, 0.116);
    for (const [a, b] of [[[0, 0.035, 0.05], [0, 0.035, 0.085]], [[0, 0.035, 0.085], [0, 0.135, 0.085]], [[0, 0.135, 0.085], [0, 0.135, 0.05]]]) W.ktube(k, W.PM.silver, s0[0] + a[0], s0[1] + a[1], s0[2] + a[2], s0[0] + b[0], s0[1] + b[1], s0[2] + b[2], 0.008);
    const p0 = [0.6, NS.top, 0.47];
    W.kadd(k, W.KG.cyl, M.plate, p0[0], p0[1] + 0.006, p0[2], 0, 0, 0, 0.2, 0.012, 0.2);
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0.12, 0); sh.absarc(0, 0, 0.12, 0, 0.9, false); sh.lineTo(0, 0);
    const wedge = H.geo(st, new THREE.ExtrudeGeometry(sh, { depth: 0.06, bevelEnabled: false }).rotateX(-Math.PI / 2));
    W.kadd(k, wedge, M.cheese, p0[0] - 0.05, p0[1] + 0.012, p0[2] + 0.03, 0, 2.2, 0);
    for (const [x, y, z, s] of [[0.02, 0.05, 0.0, 0.03], [-0.03, 0.06, -0.04, 0.024], [0.0, 0.04, 0.05, 0.02], [-0.06, 0.035, 0.02, 0.026]]) {
      W.kadd(k, W.KG.ball, M.mould, p0[0] + x, p0[1] + y, p0[2] + z, 0, 0, 0, s, s * 0.7, s);
      W.kadd(k, W.KG.ball, M.fuzz, p0[0] + x + 0.004, p0[1] + y + 0.01, p0[2] + z, 0, 0, 0, s * 0.45, s * 0.45, s * 0.45);
    }
    const c0 = [0.62, NS.top, 0.84];
    W.kb(k, M.black, c0[0], c0[1] + 0.04, c0[2], 0.07, 0.08, 0.14, 0, 0, 0.12);
    // the curtain, drawn back to the right of the window, and its rod
    const pleat = H.geo(st, new THREE.PlaneGeometry(0.46, 2.36, 14, 1));
    { const p = pleat.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 52) * 0.035); pleat.computeVertexNormals(); }
    W.kadd(k, pleat, M.curtain, WT0 + 0.1, 1.2, -1.42, 0, Math.PI / 2, 0);
    W.ktube(k, M.black, WT0 + 0.1, 2.42, -1.7, WT0 + 0.1, 2.42, 0.55, 0.012);
    W.kbuild(k, g);
    g.updateMatrixWorld(true);
    // the phone: its foot on the nightstand, its screen turned to the eye at the end of the push, leaning back on the stein
    const ph = st.phone = new THREE.Group(); ph.position.set(...PHONE); g.add(ph);
    ph.lookAt(P(CAM1E[0], 0.95, CAM1E[2])); ph.rotateX(-0.32); st.phoneQ = ph.quaternion.clone();
    ph.scale.setScalar(1.2);
    const body = new THREE.Mesh(W.KG.box, M.black); body.scale.set(0.077, 0.157, 0.009); body.position.set(0, 0.079, 0); ph.add(body);
    st.screenMat = H.mat(st, new THREE.MeshBasicMaterial({ map: screenTex(W), color: 0x000000 }));
    const scr = new THREE.Mesh(W.KG.plane, st.screenMat); scr.scale.set(0.068, 0.138, 1); scr.position.set(0, 0.079, 0.0048); ph.add(scr);
    const glow = (col, op, sprite) => H.mat(st, W.GlowMat(W.glowTex, col, op, sprite));
    st.halo = new THREE.Sprite(glow(0x8fe4ff, 0, true)); st.halo.position.set(0, 0.08, 0.04); st.halo.scale.set(0.5, 0.5, 1); ph.add(st.halo);
    st.ring = new THREE.Sprite(H.mat(st, W.GlowMat(ringTex(W), 0x9fe8ff, 0, true))); st.ring.position.set(0, 0.08, 0.02); ph.add(st.ring);
    // its light: on the wall behind and round it, in a pool on the nightstand, and (the clue light) on the bed and on him
    st.wallGlow = new THREE.Mesh(W.KG.plane, H.mat(st, W.GlowMat(softTex(W), 0x4fc4ec, 0))); st.wallGlow.position.set(WT0 + 0.004, 0.84, 0.62); st.wallGlow.rotation.y = Math.PI / 2; st.wallGlow.scale.set(1.1, 0.9, 1); g.add(st.wallGlow);
    st.pool = new THREE.Mesh(W.KG.plane, glow(0x6fd8f5, 0)); st.pool.position.set(0.56, NS.top + 0.003, 0.62); st.pool.rotation.x = -Math.PI / 2; st.pool.scale.set(0.5, 0.6, 1); st.pool.renderOrder = 2; g.add(st.pool);
    ph.updateMatrixWorld(true);
    const sc = g.worldToLocal(scr.getWorldPosition(new THREE.Vector3())), sn = new THREE.Vector3(0, 0, 1).applyQuaternion(ph.quaternion);
    st.key = [[sc.x + sn.x * 0.12, sc.y + sn.y * 0.12, sc.z + sn.z * 0.12], [1.5, 0.5, 1.25]];
    st.sayAt = P(sc.x, sc.y + 0.2, sc.z);
    // the paper against the wall, the clock's red face and its colon
    const pt = paperTex(W), paper = new THREE.Mesh(W.KG.plane, mk({ map: pt, emissive: 0xffffff, emissiveMap: pt, emissiveIntensity: 0.035 }));
    paper.rotation.order = 'YXZ'; paper.rotation.set(-0.13, Math.PI / 2, 0); paper.position.set(WT0 + 0.035, NS.top + 0.15, 0.5); paper.scale.set(0.24, 0.3, 1); g.add(paper);
    const face = new THREE.Mesh(W.KG.plane, H.mat(st, new THREE.MeshBasicMaterial({ map: clockTex(W) })));
    face.rotation.order = 'YXZ'; face.rotation.set(0.12, Math.PI / 2, 0); face.position.set(c0[0] + 0.037, c0[1] + 0.042, c0[2]); face.scale.set(0.12, 0.06, 1); g.add(face);
    st.colon = new THREE.Group(); st.colon.position.copy(face.position); st.colon.rotation.copy(face.rotation); g.add(st.colon);
    const red = H.mat(st, new THREE.MeshBasicMaterial({ color: 0xff3a22 }));
    for (const y of [-0.008, 0.01]) { const d = new THREE.Mesh(W.KG.box, red); d.scale.set(0.006, 0.006, 0.002); d.position.set(0, y, 0.002); st.colon.add(d); }
    const cg = new THREE.Sprite(glow(0xff3a22, 0.25, true)); cg.position.set(c0[0] + 0.06, c0[1] + 0.04, c0[2]); cg.scale.set(0.22, 0.14, 1); g.add(cg);
    // the street lamp's cold light through the window, a faint shape of the panes on the floor and the bed's foot
    const [lc, lg] = H.canvas(128, 128);
    lg.fillStyle = '#000'; lg.fillRect(0, 0, 128, 128); lg.filter = 'blur(4px)'; lg.fillStyle = '#fff';
    for (const [x, y, w, h] of [[14, 10, 46, 34], [68, 10, 46, 34], [14, 50, 46, 68], [68, 50, 46, 68]]) lg.fillRect(x, y, w, h);
    const slab = new THREE.Mesh(W.KG.plane, H.mat(st, W.GlowMat(H.tex(st, W, lc, false), 0x6f86a8, 0.13)));
    slab.rotation.order = 'YXZ'; slab.rotation.set(-Math.PI / 2, 0.42, 0); slab.position.set(1.55, 0.012, -0.55); slab.scale.set(1.3, 1.9, 1); slab.renderOrder = 2; g.add(slab);

    // ---- the street: the same request in window after window across the road, near to far
    const ctex = cardTex(W), cells = [0, 1, 2].map(i => { const q = H.geo(st, new THREE.PlaneGeometry(CARD.pw, CARD.ph)), uv = q.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, (i + uv.getX(j)) / 3); return q; });
    const wins = windowsAcross(W, H.RZ - 72, H.RZ + 9).sort((a, b) => b.z - a.z);
    const r = H.rng(66);
    wins.forEach(w => {
      const m = W.add(new THREE.Mesh(cells[Math.floor(r() * 3)], H.mat(st, new THREE.MeshBasicMaterial({ map: ctex }))), w.x - 0.008, w.y, w.z, -Math.PI / 2);
      const h = W.add(new THREE.Mesh(W.KG.plane, glow(0x56c6f0, 0)), w.x - 0.05, w.y, w.z, -Math.PI / 2); h.scale.set(2.6, 2.8, 1);
      m.visible = h.visible = false;
      st.cards.push({ m, h, t0: WAVE + Math.max(0, H.RZ + 9 - w.z) * 0.04 + r() * 0.12, k: 0.8 + r() * 0.2, ph: r() * 6 });
    });
    // his own phone, seen in the glass from the window: a faint cold glow in the pane
    st.mirror = new THREE.Sprite(glow(0x6fd8f5, 0, true)); st.mirror.position.set(2 * 0.135 - 0.62, 0.8, 0.62); st.mirror.scale.set(0.7, 0.7, 1); g.add(st.mirror);
    // the dead out in the street got it too: on the verges and in the road, each bent over its own cold screen
    st.dead = [];
    const deadPhone = H.mat(st, new THREE.MeshBasicMaterial({ color: 0x9fe8ff }));
    for (const [v, x, z, yaw] of [['phone', 5.9, -10.5, -0.5], ['alb_zondag', 5.3, -4.6, 0.9], ['alb_werfman', 1.4, -8.2, -2.2], ['alb_kerkganger', 5.5, -16.5, 0.3],
      ['alb_zondag', 2.2, -18.5, 2.4], ['phone', 5.2, -25.5, -0.9], ['plain', -1.8, -13.5, 1.6]]) {
      const d = W.add(W.zombie(v), x, 0, H.RZ + z);
      d.rotation.order = 'YXZ'; d.rotation.y = yaw; d.rotation.x = -0.16;
      const dp = d.children.find(m => m.material === W.PK.phone); if (dp) dp.material = deadPhone;
      const hand = new THREE.Sprite(glow(0x8fe4ff, 0, true)); hand.position.set(0.27, 0.78, -0.72); hand.scale.set(0.9, 0.9, 1); d.add(hand);
      const face = new THREE.Sprite(glow(0x5fc8ec, 0, true)); face.position.set(0, 1.5, -0.7); face.scale.set(0.8, 0.8, 1); d.add(face);
      const toHim = Math.atan2(-(H.FX - x), -(H.RZ - (H.RZ + z)));
      st.dead.push({ d, hand, face, yaw, toHim, t0: WAVE + Math.max(0, 9 - z) * 0.04 + 0.05, sway: 1.1 + st.dead.length * 0.17 });
    }

    W.say('Tikkie: €0,01', [st.sayAt.x, st.sayAt.y, st.sayAt.z], { from: 0.6, to: CUT - 0.1, dy: 0 });
    // and across the street the same ping, once in a window and once out in the road
    let near = null; for (const c of st.cards) if (c.m.position.y > 3 && (!near || Math.abs(c.m.position.z - H.RZ + 2.5) < Math.abs(near.m.position.z - H.RZ + 2.5))) near = c;
    if (near) W.say('Tikkie: €0,01', [near.m.position.x, near.m.position.y + 0.95, near.m.position.z], { from: Math.max(CUT + 0.3, near.t0 + 0.2), to: 6.6, dy: 0 });
    const road = st.dead[2]; if (road) W.say('Tikkie: €0,01', road.d, { from: 4.9, to: 7.2, dy: 2.25 });
  }

  // the panes of the houses across the road, read from the town's own merged window quads (the window atlas): every quad of
  // window size that faces the road, with its centre in the world and its atlas cell (0 to 2 lit, 3 dim, 4 and 5 dark)
  function windowsAcross(W, zMin, zMax) {
    const THREE = W.THREE, out = [], v = new THREE.Vector3(), n = new THREE.Vector3(), nm = new THREE.Matrix3();
    for (const gr of W.scene.children) {
      if (!gr.isGroup || !gr.visible || !gr.userData.faceRoad || gr.position.x < 7 || gr.position.x > 12) continue;
      gr.updateMatrixWorld(true);
      gr.traverse(m => {
        if (!m.isMesh || m.material !== W.PM.winAtlas) return;
        const p = m.geometry.attributes.position, no = m.geometry.attributes.normal, uv = m.geometry.attributes.uv;
        if (!p || !no || !uv) return;
        nm.getNormalMatrix(m.matrixWorld);
        for (let i = 0; i + 5 < p.count; i += 6) {
          let y0 = 1e9, y1 = -1e9, z0 = 1e9, z1 = -1e9, x = 0, u = 0;
          for (let j = i; j < i + 6; j++) { v.fromBufferAttribute(p, j).applyMatrix4(m.matrixWorld); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); z0 = Math.min(z0, v.z); z1 = Math.max(z1, v.z); x += v.x / 6; u += uv.getX(j) / 6; }
          n.fromBufferAttribute(no, i).applyMatrix3(nm).normalize();
          const h = y1 - y0, w = z1 - z0, zc = (z0 + z1) / 2;
          if (n.x > -0.9 || h < 1.2 || h > 1.9 || w < 0.8 || w > 1.3 || zc < zMin || zc > zMax) continue;
          out.push({ x, y: (y0 + y1) / 2, z: zc, w, h, cell: Math.floor(u * 6) });
        }
      });
    }
    return out;
  }

  const PING1 = 0.35, PING2 = 3.1, LOOKUP = 6.3;
  const ease = (W, t, t0, len) => W.smooth(W.clamp((t - t0) / len, 0, 1));
  C[5] = {
    hold: 8.2,
    build(W) {
      st = H.begin(); st.cards = [];
      const rand0 = Math.random; Math.random = H.rng(606);   // the same room, street and dead every time the shot is built
      try { build(W); } finally { Math.random = rand0; }
      this.update(W, 0, 0);
    },
    update(W, t, dt) {
      if (!st || !st.room) return;
      // the phone: dark, then the Tikkie at the first ping; the reminder pings just before the cut
      const on = t >= PING1 ? 1 : 0, ping = (t >= PING1 ? Math.exp(-(t - PING1) * 4) : 0) + (t >= PING2 ? Math.exp(-(t - PING2) * 4) : 0);
      const wake = on * Math.min(1, (t - PING1) / 0.12);
      st.screenMat.color.setScalar(0.06 + 0.84 * wake + 0.1 * Math.min(1, ping));
      st.halo.material.opacity = wake * (0.42 + 0.45 * ping);
      st.wallGlow.material.opacity = wake * (0.36 + 0.3 * ping);
      st.pool.material.opacity = wake * (0.4 + 0.3 * ping);
      let ru = -1; for (const p of [PING1, PING2]) if (t >= p && t < p + 0.7) ru = (t - p) / 0.7;
      st.ring.material.opacity = ru < 0 ? 0 : 0.75 * (1 - ru); const rs = 0.08 + 0.55 * Math.max(0, ru); st.ring.scale.set(rs, rs, 1);
      const buzz = [PING1, PING2].some(p => t >= p && t < p + 0.45);
      st.phone.quaternion.copy(st.phoneQ); st.phone.position.set(PHONE[0], PHONE[1], PHONE[2] + (buzz ? Math.sin(t * 95) * 0.0025 : 0));
      if (buzz) st.phone.rotateZ(Math.sin(t * 80) * 0.02);
      H.key(W, st, st.key[0], st.key[1], { color: 0x8fdcff, angle: 1.05, distance: 3.6, decay: 1, intensity: wake * (1.9 + 1.3 * Math.min(1, ping)) * (t >= CUT ? 0.3 : 1) });
      st.colon.visible = Math.floor(t * 2) % 2 === 0;
      // across the street: each window wakes with a flicker and then glows on, breathing a little, as screens do
      for (const c of st.cards) {
        const u = t - c.t0;
        c.m.visible = c.h.visible = u >= 0;
        if (u < 0) continue;
        const f = u < 0.3 ? (Math.floor(u * 26) % 2 ? 0.45 : 1.0) : 0.94 + 0.06 * Math.sin(t * 2.2 + c.ph);
        c.m.material.color.setScalar(c.k * f); c.h.material.opacity = 0.32 * f * (u < 0.3 ? 1.4 : 1);
      }
      st.mirror.material.opacity = t >= CUT ? 0.22 * wake : 0;
      // the dead wake to their phones with the windows; when the last windows are lit they lift their heads to his window
      for (let i = 0; i < st.dead.length; i++) {
        const D = st.dead[i], u = t - D.t0, on = u < 0 ? 0 : Math.min(1, u / 0.2), up = ease(W, t, LOOKUP + i * 0.16, 0.9);
        D.hand.material.opacity = 0.6 * on; D.face.material.opacity = 0.32 * on * (1 - 0.5 * up);
        let dy = D.toHim - D.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        D.d.rotation.y = D.yaw + dy * up; D.d.rotation.x = W.lerp(-0.16, 0.05, up); D.d.rotation.z = Math.sin(t * D.sway + i) * 0.03;
      }
      if (t >= CUT) { st.halo.material.opacity = 0; st.wallGlow.material.opacity = 0; st.pool.material.opacity = 0; }
      // the eye
      if (t < CUT) {   // beat 1: the dark room, a slow push in on the phone (an upright phone keeps the phone in the middle)
        const k = 0.75 * ease(W, t, 0, CUT) + 0.25 * W.clamp(t / CUT, 0, 1), nar = H.view(W).narrow;
        const c = i => W.lerp(CAM1[i], CAM1E[i], k), l = i => W.lerp(W.lerp(LOOK1[i], LOOK1E[i], k), LOOK1E[i], nar);
        const a = H.P(W, c(0), c(1), c(2)), b = H.P(W, l(0), l(1), l(2));
        W.cam(a.x, a.y, a.z, b.x, b.y, b.z, H.lens(W, W.lerp(50, 38, k), 15, 9));
        W.drift(t, 0.45);
        return;
      }
      // beat 2: out through the glass, across and up the street as the windows wake one after another; never quite still
      const s = t - CUT, k = ease(W, s, 0, 5.2) + 0.01 * Math.max(0, s - 5.2);
      const c = i => W.lerp(CAM2[i], CAM2E[i], k), a = H.P(W, c(0), c(1), c(2));
      W.cam(a.x, a.y, a.z, 8.2, W.lerp(2.4, 2.2, k), H.RZ - W.lerp(10, 15, k), H.lens(W, W.lerp(44, 40, k), 17, 10));
      W.drift(t, 0.4);
    },
    dispose(W) { H.end(W, st); st = null; },
  };
})();
