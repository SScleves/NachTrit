// Intro panel 4 in 3D: "Others blame the worldwide poll in which Flemish was voted the nicer Dutch."
// A square in Utrecht at night, closed at its far end by a row of gabled houses and a plain block with a big public screen on its
// front, the only bright thing in the frame, cold blue-white: WERELDPEILING, Het mooiste Nederlands, Vlaams on a long bar,
// Nederlands on a short one. The dead fill the square in front of it, as for a match.
// 1. 0 to 4.4 s: low, from behind four of the dead, across the crowd to the screen. The count runs: both bars grow, Vlaams fast
//    and Nederlands hardly at all; the percentages hold at about 87 against 13. The dead stand in silhouette against the screen,
//    its glow in the haze and its long reflection on the wet stones.
// 2. From 4.4 s: the reverse angle on the four, in the screen's cold light, the street behind them going into the fog. The count
//    ends and the light pulses twice. The one with the little Dutch flag sags, and the flag crumples with him; he lifts his head
//    to ask for a Hertelling, the light flickers as the screen recounts, and he sinks a little further. The one with the phone
//    checks the result there. After the hold the camera eases in a little more and never stops.
// The screen's light is the game's clue light, a spot that stands idle in a shot: in the first beat it lays a pool on the square
// under the screen, behind the crowd, and keeps off the stones near the eye, where its mirror image would sit; in the second it
// falls on the faces of the four. The rider is off the set, so his lamp is parked far behind the street with W.ride.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const CUT = 4.4, FINAL = 5.2, SAG = 5.4, ASK = 6.2, RECOUNT = 7.65, SINK = 8.0;
  const SZ = 28.0, SY = 7.4, SW = 11.2, SH = 6.3;          // the screen: its plane, the height of its middle, its size
  const FZ = 28.3;                                          // the street fronts of the row that closes the square
  const TW = 1024, TH = 576, BL = 760, PX = 0.75;           // the screen's layout, a full bar on it, and the scale it is painted at
  const VL = 87, NL = 13;                                   // the result
  const LIGHT = 0xd2deff;
  const FONT = '"Segoe UI", system-ui, sans-serif';
  // the four in front, by world x; the one with the flag stands in the middle of the picture. lean: how far back they lean to look
  // up at the screen (the one with the phone checks it there instead), roll: how they hang to one side
  const FRONT = [
    { x: 1.85, z: 7.0, v: 'bonnet', c: 0x23272d, lean: 0.15, roll: -0.035 },
    { x: 1.0, z: 6.6, v: 'scarf', c: 0x21252b, lean: 0.1, roll: 0.045 },
    { x: -0.3, z: 5.6, v: 'plain', c: 0x24282e, lean: 0.12, roll: 0, flag: true },
    { x: -1.75, z: 6.5, v: 'phone', c: 0x252930, lean: -0.13, roll: 0.03 },
  ];
  // the crowd between them and the screen, the game's own dead
  const CROWD = [[-3.2, 14.6, 'hat'], [2.7, 15.3, 'plain'], [-0.9, 16.9, 'bonnet'], [1.2, 18.4, 'plain'], [-2.5, 19.7, 'clogs'],
    [3.4, 20.7, 'scarf'], [-0.1, 22.0, 'plain'], [-3.7, 23.1, 'plain'], [2.1, 23.8, 'hat']];
  let st = null;

  const clamp01 = x => Math.max(0, Math.min(1, x));
  const out3 = x => 1 - Math.pow(1 - x, 3);
  const bump = (x, w) => (x > 0 && x < w ? Math.sin(x / w * Math.PI) : 0);
  const dots = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  // a phone on its side shows a short, wide picture: a longer lens there keeps the screen's words big enough to read
  const lens = fov => (innerWidth > innerHeight * 1.3 && innerHeight < 560 ? fov * (0.7 + 0.3 * clamp01((innerHeight - 360) / 200)) : fov);
  // an upright phone shows only the middle of the picture: the second beat looks a little toward the flag there, so it stays in
  const toFlag = () => (innerWidth < innerHeight ? -0.45 : 0);
  // how much of the world has been counted: a quarter at once, most of it in the first two seconds, all of it at FINAL
  function counted(t) {
    if (t >= FINAL) return 1;
    return 0.25 + 0.57 * out3(clamp01(t / 1.7)) + 0.18 * (t > 1.7 ? (t - 1.7) / (FINAL - 1.7) : 0);
  }
  function screenState(t) {
    const c = counted(t), fin = t >= FINAL, v = fin ? VL : Math.round(84 + 3 * out3(clamp01(t / 3.6)));
    return {
      vBar: VL / 100 * c, nBar: NL / 100 * c, vPct: v, nPct: 100 - v, win: fin, live: !fin && (t % 1) < 0.62,
      foot: fin ? 'Uitslag: 8.000.000.000 stemmen' : 'Geteld: ' + dots(Math.round(c * 8000) * 1e6) + ' stemmen',
    };
  }

  // ---------- the screen, painted on its own canvas ----------
  function flag(g, kind, x, y, w, h) {
    const cols = kind === 'BE' ? ['#18181b', '#efcb3c', '#d6363e'] : ['#cc3440', '#eef0f6', '#2f55ae'];
    for (let i = 0; i < 3; i++) { g.fillStyle = cols[i]; if (kind === 'BE') g.fillRect(x + i * w / 3, y, w / 3 + 0.5, h); else g.fillRect(x, y + i * h / 3, w, h / 3 + 0.5); }
    g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 2; g.strokeRect(x, y, w, h);
  }
  function fit(g, text, size, weight, maxW) {
    let s = size; g.font = `${weight} ${s}px ${FONT}`;
    while (g.measureText(text).width > maxW && s > 20) { s -= 2; g.font = `${weight} ${s}px ${FONT}`; }
  }
  function row(g, y, name, kind, bar, pct, lead, win) {
    if (win) { g.fillStyle = 'rgba(150,190,255,0.16)'; g.fillRect(12, y - 6, TW - 24, 140); }
    flag(g, kind, 36, y + 10, 72, 48);
    g.textAlign = 'left'; g.textBaseline = 'middle'; fit(g, name, 66, 700, 560);
    g.fillStyle = lead ? '#e4eeff' : '#a6bee6'; g.fillText(name, 126, y + 36);
    g.fillStyle = 'rgba(90,130,210,0.2)'; g.fillRect(36, y + 76, BL, 52);
    const len = Math.round(bar * BL);
    if (len > 0) {
      const gr = g.createLinearGradient(0, y + 76, 0, y + 128);
      if (lead) { gr.addColorStop(0, '#f4f9ff'); gr.addColorStop(1, '#86b4ff'); } else { gr.addColorStop(0, '#7092cc'); gr.addColorStop(1, '#3c5a92'); }
      g.fillStyle = gr; g.fillRect(36, y + 76, len, 52);
    }
    g.textAlign = 'right'; g.font = `800 88px ${FONT}`; g.fillStyle = lead ? '#f0f6ff' : '#8ea8d4'; g.fillText(pct + '%', TW - 30, y + 100);
  }
  function drawScreen(g, s) {
    g.setTransform(PX, 0, 0, PX, 0, 0);   // laid out at 1024 x 576, painted at three quarters of that
    const bg = g.createLinearGradient(0, 0, 0, TH); bg.addColorStop(0, '#0d1f46'); bg.addColorStop(1, '#06112c');
    g.fillStyle = bg; g.fillRect(0, 0, TW, TH);
    const hb = g.createLinearGradient(0, 0, 0, 158); hb.addColorStop(0, '#1e3e7c'); hb.addColorStop(1, '#122a5a');
    g.fillStyle = hb; g.fillRect(0, 0, TW, 158); g.fillStyle = '#6f9cf0'; g.fillRect(0, 158, TW, 5);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    fit(g, 'WERELDPEILING', 98, 800, TW - 60); g.fillStyle = '#dbe8ff'; g.fillText('WERELDPEILING', TW / 2, 64);
    fit(g, 'Het mooiste Nederlands', 52, 600, TW - 80); g.fillStyle = '#9ebcf2'; g.fillText('Het mooiste Nederlands', TW / 2, 128);
    row(g, 178, 'Vlaams', 'BE', s.vBar, s.vPct, true, s.win);
    row(g, 326, 'Nederlands', 'NL', s.nBar, s.nPct, false, false);
    g.fillStyle = '#28467e'; g.fillRect(0, 476, TW, 3);
    g.textAlign = 'left'; g.font = `600 40px ${FONT}`; g.fillStyle = '#86a6dc'; g.fillText(s.foot, 36, 527);
    g.textAlign = 'right'; g.font = `700 40px ${FONT}`; g.fillStyle = '#c8d8f6'; g.fillText(s.win ? 'UITSLAG' : 'LIVE', TW - 30, 527);
    if (s.live) { g.fillStyle = '#ff4a4a'; g.beginPath(); g.arc(TW - 160, 527, 11, 0, 7); g.fill(); }
  }
  // the screen in the wet stones: a soft column of its light, brightest at its foot, broken by the joints and the ripples
  function paintReflection(c) {
    const g = c.getContext('2d'), w = c.width, h = c.height;
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) {
      const v = y / (h - 1), a = 0.3 + 0.7 * Math.pow(v, 1.2), rip = 0.5 + 0.5 * Math.sin(y * 0.33) * Math.sin(y * 0.071 + 1.3);
      if (a * rip < 0.01) continue;
      const gr = g.createLinearGradient(0, 0, w, 0);
      gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.15, `rgba(255,255,255,${0.55 * a * rip})`); gr.addColorStop(0.5, `rgba(255,255,255,${0.75 * a * rip})`);
      gr.addColorStop(0.85, `rgba(255,255,255,${0.55 * a * rip})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, y, w, 2);
      for (const [x, sw, k] of [[0.3, 0.05, 0.9], [0.52, 0.07, 1], [0.74, 0.04, 0.7]]) {
        const rr = 0.5 + 0.5 * Math.sin(y * 0.5 + x * 40);
        g.fillStyle = `rgba(255,255,255,${k * a * rr * 0.7})`; g.fillRect((x - sw / 2) * w, y, sw * w, 2);
      }
    }
  }

  // ---------- props ----------
  function track(W) {
    const shared = new Set([...Object.values(W.PG), ...Object.values(W.KG)]);
    return o => { o.traverse(m => { if (m.geometry && !shared.has(m.geometry)) st.geos.push(m.geometry); }); return o; };
  }
  // a little Dutch flag on a stick that has given up, in his right hand. The cloth hangs off the top of the stick in two halves, the
  // fly half bent further down, so it reads as cloth that has stopped trying. It hangs to the eye's left in the second beat, so when
  // it droops the red stays on top
  function limpFlag(W, keep, cols) {
    const T = W.THREE, pivot = new T.Group(); pivot.position.set(0.27, 0.62, -0.62);
    const k = W.kit(); W.ktube(k, W.M.wood, 0, -0.06, 0, 0.12, 1.2, -0.22, 0.017); pivot.add(keep(W.kbuild(k)));
    const half = [];
    for (let s = 0, parent = pivot; s < 2; s++) {
      const g = new T.Group(); if (s) g.position.x = 0.21; else g.position.set(0.12, 1.2, -0.22);
      const kk = W.kit(); cols.forEach((m, j) => W.kb(kk, m, 0.105, -0.06 - j * 0.12, 0, 0.21, 0.12, 0.012));
      parent.add(keep(W.kbuild(kk, g))); half.push(g); parent = g;
    }
    return { pivot, cloth: half[0], tip: half[1] };
  }

  function restore(W) {
    if (!st) return;
    const K = st.light, o = st.light0;
    if (K && o) { K.color.setHex(o.color); K.intensity = o.intensity; K.angle = o.angle; K.penumbra = o.penumbra; K.distance = o.distance; K.decay = o.decay; K.position.copy(o.p); K.target.position.copy(o.tp); }
    for (const c of st.hidden) c.visible = true;
    for (const c of st.near) c.visible = true;
    st.hidden = []; st.near = [];
  }

  function step(W, t, dt) {
    const K = st.light;
    // the screen, while it can be seen: repainted twenty times a second while the bars shoot up, ten times after, when the counter
    // is all that moves (every repaint is a texture upload)
    if (t < CUT + 0.05) {
      const s = screenState(t), key = [t < 1.8 ? Math.floor(t * 20) : 100 + Math.floor(t * 10), s.live, s.win].join('|');
      if (key !== st.key) { st.key = key; drawScreen(st.g, s); st.tex.needsUpdate = true; }
    }
    // its light: the count ends in two pulses, the recount flickers
    let k = 1 + 0.6 * bump(t - FINAL, 0.22) + 0.45 * bump(t - FINAL - 0.34, 0.22);
    if (t > RECOUNT && t < RECOUNT + 0.42) k *= [0.3, 0.85, 0.25, 0.7, 0.4, 0.95][Math.min(5, Math.floor((t - RECOUNT) / 0.07))];
    if (K) {   // r152 legacy lights: the falloff is (1 - d / distance) ^ decay
      K.color.setHex(LIGHT); K.penumbra = 0.85; K.position.set(0, SY, SZ - 0.6);
      if (t < CUT) { K.angle = 0.27; K.distance = 30; K.decay = 1; K.target.position.set(0, 0, 16.5); K.intensity = 3.6; }
      else { K.angle = 0.16; K.distance = 45; K.decay = 1; K.target.position.set(-0.3, 1.5, 6.2); K.intensity = 5.0 * k; }
    }
    for (const c of st.near) c.visible = t >= CUT;
    st.rim.visible = t < CUT;
    for (const s of st.backs) s.visible = t < CUT;
    // the four: they look up at the screen and sway, start at the result; the one with the flag sags, then sinks further
    st.front.forEach((d, i) => {
      const f = d.userData.flag, sag = f ? W.smooth(clamp01((t - SAG) / 0.75)) : 0, sink = f ? W.smooth(clamp01((t - SINK) / 0.5)) : 0;
      const ask = f ? W.smooth(clamp01((t - ASK) / 0.35)) * (1 - W.smooth(clamp01((t - RECOUNT) / 0.3))) : 0;   // he lifts his head to ask
      d.rotation.x = d.userData.lean + 0.05 * bump(t - FINAL, 0.6) - 0.28 * sag + 0.09 * ask - 0.1 * sink;
      d.rotation.z = d.userData.roll + 0.025 * Math.sin(t * 0.9 + i * 1.7) + 0.05 * sag;
      d.scale.y = 1 - 0.07 * sag - 0.04 * sink;
      if (f) {
        f.pivot.rotation.z = -0.5 * sag - 0.3 * sink;
        f.cloth.rotation.z = -(0.25 + 0.2 * sag + 0.1 * sink + 0.03 * Math.sin(t * 1.3));
        f.tip.rotation.z = -(0.4 + 0.45 * sag + 0.15 * sink + 0.05 * Math.sin(t * 1.3 + 0.8)); f.tip.rotation.y = 0.3 + 0.08 * Math.sin(t * 0.9);
      }
    });
    st.crowd.forEach((d, i) => { d.rotation.z = 0.03 * Math.sin(t * 0.8 + i * 2.1); });
    if (t < CUT) {   // behind the four, low, drifting across them toward the screen
      st.refl.material.opacity = 1;
      const e = W.smooth(clamp01(t / CUT));
      W.fog(1.3);
      W.cam(W.lerp(0.6, -0.1, e), W.lerp(1.12, 1.2, e), W.lerp(-0.7, 0.3, e), 0, W.lerp(6.8, 6.95, e), SZ, lens(50));
      W.drift(t, 0.5);
      return;
    }
    // on the four, from the screen's side; a slow push in, and after the hold a slower one that eases out and never reaches them
    st.refl.material.opacity = 0;
    const e = W.smooth(clamp01((t - CUT) / 4.4)), late = 0.6 * (1 - Math.exp(-Math.max(0, t - 8.8) / 10)), fx = toFlag();
    W.fog(1.5);
    W.cam(W.lerp(-0.05, -0.25, e) + fx, W.lerp(1.9, 1.84, e), W.lerp(11.4, 10.6, e) - late, -0.35 + fx, 1.45, 6.1, lens(40));
    W.drift(t, 0.6);
  }

  C[3] = {
    hold: 8.5,
    build(W) {
      const T = W.THREE;
      W.stage({ town: 'utrecht', theme: 'square', rider: false, fog: 1.3 });
      W.speed(0);
      W.ride(300);   // he is off the set: his lamp is parked far behind the street, where it lights nothing
      st = { geos: [], mats: [], hidden: [], near: [], backs: [], front: [], crowd: [], key: '', light: null, light0: null };
      const keep = track(W), mat = m => (st.mats.push(m), m);
      // the set is dressed: whatever the square put in front of the screen, where the row stands, shuffling into it, or as a big
      // dark mass beside the eye (the church, the near trees on the open side) goes for the length of the shot, and so do the
      // signposts at the kerb (the bike-lane sign and the fingerpost), which would stand beside the heads in the second beat
      for (const c of W.scene.children) {
        if (!c.isGroup || !c.visible || c === W.bike) continue;
        const p = c.position;
        if ((Math.abs(p.x) < 9.5 && p.z > 9 && p.z < 45) || (Math.abs(p.x) < 21 && p.z > FZ && p.z < 45) || (c.userData.shuffle && Math.abs(p.x) < 9.5 && p.z > -2)
          || (p.x > 5 && p.x < 16 && p.z > -12 && p.z < 45) || Math.abs(Math.abs(p.x) - 4.6) < 0.02) { c.visible = false; st.hidden.push(c); }
        // the row along the near side of the square and its trees: the first beat looks past them to the screen, the second sees them
        // behind the four
        else if (p.x < -7 && p.x > -12.5 && p.z > -8 && p.z < 32) st.near.push(c);
      }
      const K = st.light = W.scene.children.find(o => o.isSpotLight && o !== W.lampLight) || null;
      if (K) st.light0 = { color: K.color.getHex(), intensity: K.intensity, angle: K.angle, penumbra: K.penumbra, distance: K.distance, decay: K.decay, p: K.position.clone(), tp: K.target.position.clone() };
      // the row at the end: two gabled houses either side of a plain block that carries the screen
      for (const [x, o] of [[-16.65, { h: 9.4, gable: 'bell' }], [-10.6, { h: 11.4, gable: 'step' }], [10.6, { h: 10.8, gable: 'spout' }], [16.65, { h: 9.8, gable: 'neck' }]]) {
        W.add(keep(W.house(Object.assign({ w: 6, lit: 0.14, peer: false }, o))), x, 0, FZ + 3, -Math.PI / 2);
      }
      const k = W.kit();
      W.kb(k, W.PM.wall, 0, 6.7, FZ + 4, 15.2, 13.4, 8);                                                                // the block
      W.kb(k, W.PM.roof, 0, 13.5, FZ + 3.9, 15.8, 0.3, 8.4);                                                            // its cornice
      W.kb(k, W.PM.pole, 0, SY, SZ + 0.14, SW + 0.36, SH + 0.36, 0.22);                                                 // the casing
      const lobby = mat(new T.MeshBasicMaterial({ color: 0x22304a }));                                                 // the lobby glass, cold and dim
      for (const x of [-4.4, -1.45, 1.45, 4.4]) W.kadd(k, W.KG.plane, lobby, x, 1.25, FZ - 0.02, 0, Math.PI, 0, 1.8, 2.3);
      W.kb(k, W.PM.stone, 0, 0.07, 27.8, 39.4, 0.14, 1.6);                                                              // the stoep
      W.add(keep(W.kbuild(k)), 0, 0, 0);
      // the screen
      const cv = document.createElement('canvas'); cv.width = TW * PX; cv.height = TH * PX; st.g = cv.getContext('2d');
      st.tex = new T.CanvasTexture(cv); st.tex.colorSpace = T.SRGBColorSpace; st.tex.anisotropy = 4;
      drawScreen(st.g, screenState(0)); st.key = '';
      const scr = new T.Mesh(new T.PlaneGeometry(SW, SH), new T.MeshBasicMaterial({ map: st.tex, fog: false }));
      st.geos.push(scr.geometry); scr.material.color.setScalar(1.1); scr.userData.ownTex = true;
      W.add(scr, 0, SY, SZ, Math.PI);
      // its glow in the haze round it, the haze it lights over the crowd, and its long light on the wet stones
      const halo = new T.Sprite(mat(W.GlowMat(W.glowTex, 0x86aaff, 0.5, true))); halo.scale.set(30, 17, 1); W.add(halo, 0, SY, SZ + 0.27);
      const haze = new T.Sprite(mat(W.GlowMat(W.glowTex, 0x6a8ed6, 0.3, true))); haze.scale.set(26, 9, 1); W.add(haze, 0, 2.7, 19);
      st.rim = new T.Sprite(mat(W.GlowMat(W.glowTex, 0x8fb0ee, 0.2, true))); st.rim.scale.set(7.5, 2.6, 1); W.add(st.rim, 0.1, 1.85, 8.8);   // the glow behind the four's shoulders
      const rc = document.createElement('canvas'); rc.width = 128; rc.height = 512; paintReflection(rc);
      st.refl = new T.Mesh(new T.PlaneGeometry(1, 1), W.GlowMat(new T.CanvasTexture(rc), 0xa8c2ff, 1));
      st.geos.push(st.refl.geometry); st.refl.userData.ownTex = true; st.refl.rotation.x = -Math.PI / 2; st.refl.scale.set(8, 20, 1); st.refl.renderOrder = 3;
      W.add(st.refl, 0, 0.03, 17);
      // the crowd, facing the screen
      CROWD.forEach(([x, z, v]) => {
        const d = W.zombie(v); W.add(d, x, 0, z);
        d.rotation.order = 'YXZ'; d.rotation.set(0.08, Math.atan2(x, -(SZ - z)) + W.rnd(-0.2, 0.2), 0);
        st.crowd.push(d);
      });
      // the four, in their own skin, a shade lighter than the game's so the screen's light shows on their faces; their linen and
      // orange a shade darker than the game's, so the same light does not burn them out; the glow round their eyes fainter, so
      // their faces show the screen's light round the yellow eyes
      const swap = new Map([[W.PK.linen, mat(W.Mat({ color: 0x8a8c92 }))], [W.PM.orange, mat(W.Mat({ color: 0x7a4626 }))]]);
      const eyeGlow = mat(W.GlowMat(W.glowTex, 0xffbf40, 0.5, false, { side: T.DoubleSide }));
      const cloth = [mat(W.Mat({ color: 0x8a242a })), swap.get(W.PK.linen), mat(W.Mat({ color: 0x24407e }))];
      const back = mat(W.GlowMat(W.glowTex, 0x9ab8f0, 0.45, true));
      for (const o of FRONT) {
        const skin = mat(W.Mat({ color: o.c })), d = new T.Group(); d.rotation.order = 'YXZ';
        for (const [geo, m] of W.zombieParts(o.v)) d.add(new T.Mesh(geo, !m ? skin : m.map === W.glowTex ? eyeGlow : swap.get(m) || m));
        if (o.flag) { d.userData.flag = limpFlag(W, keep, cloth); d.add(d.userData.flag.pivot); }
        W.add(d, o.x, 0, o.z);
        d.rotation.y = Math.atan2(o.x, -(SZ - o.z)); d.userData.lean = o.lean; d.userData.roll = o.roll;
        st.front.push(d);
        st.backs.push(W.add(new T.Sprite(back), o.x, 1.66, o.z + 0.9));   // the screen's glow in the haze just past his head and shoulders
      }
      W.say('Hertelling.', st.front[2], { from: ASK, to: RECOUNT + 0.2, dy: 2.0 });
      step(W, 0, 0);
    },
    update(W, t, dt) {
      try { step(W, t, dt); } catch (e) { restore(W); throw e; }
    },
    dispose(W) {
      restore(W);
      if (st) { for (const g of st.geos) g.dispose(); for (const m of st.mats) m.dispose(); }
      st = null;
    },
  };
})();
