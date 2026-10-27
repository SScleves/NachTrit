// Intro panel 12 in 3D: "..." (the dead man at the window: Gezellig.)
// The scare beat, at his home in Alblasserdam: the front room of his dike house on a night of mist, warm and low-lit,
// as Dutch front rooms are, with nothing over the glass. Two beats:
// 1. 0 to 3.6 s: the room, the lamp on the windowsill, the plants and a tea light, him sunk in his armchair with his back
//    to us and a cup on its arm. A dark shape rises into the window and presses its face on the
//    glass: the nose and lips go flat and pale, the yellow eyes light, its breath fogs the pane. It says it: Gezellig.
// 2. From 3.6 s: closer on the glass. A second one, a woman in her Sunday hat, rises into the other pane and presses her
//    face beside his. Both breathe on the glass; the camera creeps in and never quite stops.
// The house and the street are window.NRHOME from shot 6 (the same street, the same lamp across); without it a plain room
// stands in the same place.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const CUT = 3.6;
  // the front room in the house frame (front on minus x, the room toward plus x): a wide window with a centre post and a top light
  const ROOM = { D: 4.4, Z: 2.4, Y: 2.65, paper: 'flower', tint: 0x6a5444, glow: 0x2a1408, ceil: 0x3a2e26, frame: 0x8e8676,
    wins: [{ z0: -1.25, z1: 1.25, y0: 0.8, y1: 2.3, tr: 1.96, bars: 1, top: 4 }], sheen: 0x9a8a78, sheenA: 0.06 };
  const GLASS = 0.135;   // the glass, in the middle of the wall's depth
  // the two at the glass: where each face presses (house frame), and when each one rises, presses and lights its eyes
  const DEAD = [{ z: -0.6, y: 1.6, rise: 0.4, eyes: 1.05, breath: 1.3, kind: 'man' }, { z: 0.62, y: 1.56, rise: 3.85, eyes: 4.75, breath: 5.0, kind: 'woman' }];
  const CAM1 = [4.05, 1.42, 0.78], CAM1E = [3.05, 1.45, 0.45], LOOK1 = [0.2, 1.2, -0.2], LOOK1E = [0.2, 1.32, -0.34];
  const CAM2 = [1.95, 1.46, 0.02], CAM2E = [1.62, 1.49, 0.0], LOOK2 = [0.0, 1.5, 0.0];
  let H = null, st = null;

  // ---- when shot 6 is missing: a plain room in the same place, the same street outside
  function plainHome() {
    const P = {
      SEED: 615, RZ: -20, FX: -8.2, WT: 0.3,
      rng(a) { return () => { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; },
      begin() { return { mats: [], tex: [], geo: [], hidden: [], props: [] }; },
      canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; },
      tex(s, W, c, colour) { const t = new W.THREE.CanvasTexture(c); if (colour) t.colorSpace = W.THREE.SRGBColorSpace; s.tex.push(t); return t; },
      mat(s, m) { s.mats.push(m); return m; },
      geo(s, g) { s.geo.push(g); return g; },
      P(W, x, y, z) { return new W.THREE.Vector3(P.FX - x, y, P.RZ - z); },
      stage(W) {
        W.stage({ town: 'alblasserdam', theme: 'street', seed: P.SEED, rider: false, fog: 1.4 }); W.speed(0);
        W.hide(m => (m.userData && m.userData.shuffle !== undefined) || (m.isGroup && m.userData.faceRoad && m.position.x < -6.5 && m.position.x > -12 && Math.abs(m.position.z - P.RZ) < 12));
      },
      key() {},
      room(W, s, spec) {
        const k = W.kit(), g = new W.THREE.Group(), WT = P.WT, X1 = WT + spec.D, w = spec.wins[0], wall = P.mat(s, W.Mat({ color: 0x6a5242, emissive: 0x1c0f06 }));
        W.kb(k, W.M.wood, X1 / 2, -0.05, 0, X1 + 0.6, 0.1, 2 * spec.Z + 0.6); W.kb(k, wall, X1 / 2, spec.Y + 0.08, 0, X1 + 0.6, 0.16, 2 * spec.Z + 0.6);
        W.kb(k, wall, X1 + 0.15, spec.Y / 2, 0, 0.3, spec.Y, 2 * spec.Z + 0.6);
        for (const sz of [-1, 1]) { W.kb(k, wall, X1 / 2, spec.Y / 2, sz * (spec.Z + 0.15), X1 + 0.6, spec.Y, 0.3); W.kb(k, wall, WT / 2, spec.Y / 2, sz * (spec.Z + 0.3 + (sz > 0 ? w.z1 : -w.z0)) / 2, WT, spec.Y, spec.Z + 0.3 - (sz > 0 ? w.z1 : -w.z0)); }
        W.kb(k, wall, WT / 2, w.y0 / 2, 0, WT, w.y0, w.z1 - w.z0); W.kb(k, wall, WT / 2, (w.y1 + spec.Y) / 2, 0, WT, spec.Y - w.y1, w.z1 - w.z0);
        W.kbuild(k, g); s.props.push(W.add(g, P.FX, 0, P.RZ, Math.PI));
        return { g, glass: [], paint: wall, wall, stone: wall };
      },
      lens(W, fov) { return fov; },
      view(W) { return { asp: W.camera.aspect || 1.6, band: 0.7, narrow: W.clamp((1.2 - (W.camera.aspect || 1.6)) / 0.6, 0, 1), short: 0 }; },
      end(W, s) {
        if (!s) return;
        const PG = Object.values(W.PG);
        for (const p of s.props) p.traverse(m => { if (m.isMesh && m.geometry && m.geometry.userData.kit && !PG.includes(m.geometry)) m.geometry.dispose(); });
        for (const x of s.geo) x.dispose(); for (const x of s.mats) x.dispose(); for (const x of s.tex) x.dispose();
      },
    };
    return P;
  }

  // ---- canvases
  // breath on the glass: a soft pale cloud with a few beads of water in it, no edge
  function breathTex(W) {
    const [c, g] = H.canvas(128, 128), r = H.rng(5);
    const gr = g.createRadialGradient(64, 70, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 70; i++) { const a = r() * 6.28, d = r() * 44, x = 64 + Math.cos(a) * d, y = 66 + Math.sin(a) * d * 0.8; g.fillStyle = `rgba(255,255,255,${(0.35 + r() * 0.5).toFixed(2)})`; g.beginPath(); g.arc(x, y, 0.8 + r() * 1.6, 0, 7); g.fill(); }
    return H.tex(st, W, c, false);
  }
  // a soft round wash with no visible edge
  function softTex(W) {
    const [c, g] = H.canvas(128, 128), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (let i = 0; i <= 12; i++) { const u = i / 12; gr.addColorStop(u, `rgba(255,255,255,${(Math.pow(1 - u, 1.8)).toFixed(3)})`); }
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return H.tex(st, W, c, false);
  }

  // ---- one of the dead at the glass, in its own frame: the origin where its face meets the glass, the body out toward minus x.
  // The nose, the lips and the palms are pressed flat and pale on the pane; the eyes are its own, so they can light.
  function deadAtGlass(W, M, o) {
    const THREE = W.THREE, k = W.kit(), g = new THREE.Group(), sk = W.PK.skin[0], woman = o.kind === 'woman';
    W.kadd(k, W.KG.ball, sk, -0.11, 0, 0, 0, 0, 0, 0.2, 0.26, 0.21);
    for (const s of [-1, 1]) W.kadd(k, W.KG.ball, sk, -0.055, -0.012, s * 0.068, 0, 0, 0, 0.08, 0.06, 0.06);   // cheekbones
    W.kadd(k, W.KG.ball, sk, -0.1, -0.11, 0, 0, 0, 0, 0.15, 0.1, 0.14);
    W.kadd(k, W.KG.ball, M.pale, -0.012, -0.016, 0, 0, 0, 0, 0.02, 0.05, 0.034);           // the nose, flat on the glass
    W.kadd(k, W.KG.ball, M.pale, -0.01, -0.088, 0, 0, 0, 0, 0.018, 0.024, 0.062);          // the lips
    W.kadd(k, W.KG.ball, W.PK.jaw, -0.004, -0.09, 0, 0, 0, 0, 0.012, 0.008, 0.042);       // the slack mouth between them
    W.ktube(k, sk, -0.16, -0.12, 0, -0.23, -0.33, 0, 0.055);
    W.kb(k, M.coat, -0.3, -0.42, 0, 0.26, 0.16, 0.56); W.kb(k, M.coat, -0.34, -0.85, 0, 0.3, 0.74, 0.48);
    W.kb(k, M.collar, -0.19, -0.31, 0, 0.06, 0.03, 0.12);
    if (woman) {
      W.kadd(k, W.KG.dome, M.hat, -0.16, 0.1, 0, 0, 0, 0.3, 0.28, 0.2, 0.29); W.kadd(k, W.KG.cyl, M.hat, -0.17, 0.09, 0, 0, 0, 0.3, 0.36, 0.02, 0.38);
      W.kadd(k, W.KG.cyl, M.ribbon, -0.16, 0.12, 0, 0, 0, 0.3, 0.285, 0.04, 0.295);
    } else {
      W.kadd(k, W.KG.dome, M.hat, -0.18, 0.12, 0, 0, 0, 0.32, 0.25, 0.22, 0.26); W.kadd(k, W.KG.cyl, M.hat, -0.19, 0.1, 0, 0, 0, 0.32, 0.4, 0.02, 0.42);
    }
    const hands = woman ? [[-1, -0.17, -0.31], [1, -0.21, 0.33]] : [[-1, -0.26, -0.35], [1, 0.0, 0.3]];   // [side, height, across] of each palm
    for (const [s, hy, z] of hands) {
      W.ktube(k, M.coat, -0.3, -0.38, s * 0.27, -0.24, -0.56, s * 0.42, 0.06); W.ktube(k, M.coat, -0.24, -0.56, s * 0.42, -0.08, hy - 0.16, z * 1.06, 0.05);
      W.ktube(k, sk, -0.08, hy - 0.16, z * 1.06, -0.035, hy - 0.05, z, 0.035);
      W.kadd(k, W.KG.ball, sk, -0.035, hy, z, 0, 0, 0, 0.04, 0.1, 0.07);
      W.kadd(k, W.KG.ball, M.pale, -0.008, hy, z, 0, 0, 0, 0.01, 0.095, 0.07);           // the palm, flat on the glass
      for (let f = 0; f < 4; f++) { const fz = z + (f - 1.5) * 0.017 * s, len = [0.07, 0.085, 0.08, 0.06][f]; W.ktube(k, M.pale, -0.008, hy + 0.04, fz, -0.008, hy + 0.04 + len, fz + (f - 1.5) * 0.01 * s, 0.0075); }
    }
    W.kbuild(k, g);
    const eyeMat = H.mat(st, new THREE.MeshBasicMaterial({ color: 0x000000 })), glowMat = H.mat(st, W.GlowMat(W.glowTex, 0xffbf40, 0, false, { side: THREE.DoubleSide }));
    for (const s of [-1, 1]) { const e = new THREE.Mesh(W.KG.ball, eyeMat); e.position.set(-0.03, 0.026, s * 0.048); e.scale.set(0.03, 0.024, 0.034); g.add(e); }
    const eg = new THREE.Mesh(W.KG.plane, glowMat); eg.position.set(-0.002, 0.026, 0); eg.rotation.y = Math.PI / 2; eg.scale.set(0.34, 0.15, 1); g.add(eg);
    return { g, eyeMat, glowMat };
  }

  // ---- the set
  function build(W) {
    const THREE = W.THREE;
    H.stage(W, st, { fog: 1.35, sky: 0.55, moon: 0.15 });
    const R = st.room = H.room(W, st, ROOM), g = R.g;
    const mk = (o, warm) => H.mat(st, W.Mat(o, warm ? W.TINT.warm : W.TINT.cool));
    const glow = (col, op, sprite) => H.mat(st, W.GlowMat(W.glowTex, col, op, sprite));
    const M = st.M = {
      coat: mk({ color: 0x0f1115 }), hat: mk({ color: 0x0b0c0f }), ribbon: mk({ color: 0x4a2a3a }), pale: mk({ color: 0x5e645e, emissive: 0x120a05, emissiveIntensity: 1 }), collar: mk({ color: 0x8a8a84 }),
      chair: mk({ color: 0x5a2c22, emissive: 0x160805, emissiveIntensity: 1 }, 1), wood: mk({ color: 0x3a281c, emissive: 0x120804, emissiveIntensity: 1 }, 1),
      pot: mk({ color: 0x7a4028 }, 1), leaf: mk({ color: 0x2c4628 }), cream: mk({ color: 0xd8ccb0, emissive: 0x2a1a0c, emissiveIntensity: 1 }),
      hair: mk({ color: 0x1a1412 }),
    };
    const k = W.kit(), sill = ROOM.wins[0].y0;
    // the windowsill: a lamp on the left, the plants, a tea light in a glass
    W.kadd(k, W.KG.cyl, M.cream, 0.42, sill + 0.09, 0.98, 0, 0, 0, 0.13, 0.18, 0.13);
    W.kadd(k, W.KG.cyl, M.wood, 0.42, sill + 0.24, 0.98, 0, 0, 0, 0.02, 0.14, 0.02);
    for (const [z, h] of [[-1.02, 0.36], [0.25, 0.22]]) {
      W.kadd(k, W.KG.cyl, M.pot, 0.42, sill + 0.07, z, 0, 0, 0, 0.17, 0.14, 0.17);
      if (h > 0.3) for (let i = 0; i < 7; i++) { const a = i * 0.9; W.kb(k, M.leaf, 0.42 + Math.cos(a) * 0.03, sill + 0.14 + h / 2, z + Math.sin(a) * 0.03, 0.012, h * (0.75 + 0.3 * ((i * 37) % 10) / 10), 0.045, Math.sin(a) * 0.18, a, Math.cos(a) * 0.18); }
      else for (let i = 0; i < 6; i++) { const a = i * 1.05; W.kadd(k, W.KG.ball, M.leaf, 0.42 + Math.cos(a) * 0.07, sill + 0.2 + (i % 3) * 0.04, z + Math.sin(a) * 0.08, 0, 0, 0, 0.11, 0.08, 0.11); }
    }
    W.kadd(k, W.KG.cyl, M.cream, 0.42, sill + 0.03, -0.22, 0, 0, 0, 0.07, 0.06, 0.07);
    // his armchair, its back to us, facing the window: a high back with wings and a rounded top; the top of his head over it and
    // his orange collar, a cup on the arm
    const ax = 1.75, az = -0.5;
    W.kb(k, M.chair, ax, 0.38, az, 0.72, 0.16, 0.74); W.kb(k, M.chair, ax + 0.32, 0.66, az, 0.16, 0.74, 0.74);
    W.kadd(k, W.KG.cyl, M.chair, ax + 0.32, 1.03, az, Math.PI / 2, 0, 0, 0.18, 0.66, 0.16);
    for (const s of [-1, 1]) { W.kb(k, M.chair, ax + 0.02, 0.56, az + s * 0.36, 0.7, 0.24, 0.12); W.kb(k, M.chair, ax + 0.2, 0.86, az + s * 0.36, 0.28, 0.36, 0.1, 0, 0, -0.15); W.kadd(k, W.KG.cyl, M.chair, ax - 0.33, 0.68, az + s * 0.36, 0, 0, Math.PI / 2, 0.14, 0.12, 0.14); }
    for (const [x, z] of [[-0.3, -0.3], [-0.3, 0.3], [0.32, -0.3], [0.32, 0.3]]) W.kb(k, M.wood, ax + x, 0.12, az + z, 0.05, 0.24, 0.05);
    W.kadd(k, W.KG.ball, M.hair, ax + 0.12, 1.15, az + 0.02, 0, 0, 0, 0.22, 0.24, 0.21);
    W.kb(k, W.M.shirt, ax + 0.17, 1.05, az + 0.02, 0.14, 0.05, 0.28);
    W.kadd(k, W.KG.cyl, M.cream, ax - 0.1, 0.71, az - 0.37, 0, 0, 0, 0.16, 0.012, 0.16); W.kadd(k, W.KG.cyl, M.cream, ax - 0.1, 0.75, az - 0.37, 0, 0, 0, 0.08, 0.07, 0.08);
    // the standard lamp in the corner
    W.kadd(k, W.KG.cyl, M.wood, 0.7, 0.02, 2.05, 0, 0, 0, 0.3, 0.04, 0.3); W.kadd(k, W.KG.cyl, M.wood, 0.7, 0.8, 2.05, 0, 0, 0, 0.03, 1.56, 0.03);
    W.kbuild(k, g);

    // light: the lamp on the sill (the clue light) lights the sill and the faces out on the glass from below; glows for the
    // shades, the candle, and the warm wash they throw on the wall and the ceiling
    const shadeGeo = H.geo(st, new THREE.CylinderGeometry(0.08, 0.15, 0.17, 14, 1, true));
    const shadeMat = H.mat(st, new THREE.MeshBasicMaterial({ color: 0xf0b868, side: THREE.DoubleSide }));
    const shade = new THREE.Mesh(shadeGeo, shadeMat); shade.position.set(0.42, sill + 0.36, 0.98); g.add(shade);
    const big = new THREE.Mesh(H.geo(st, new THREE.CylinderGeometry(0.17, 0.3, 0.3, 16, 1, true)), shadeMat); big.position.set(0.7, 1.64, 2.05); g.add(big);
    st.glows = [];
    for (const [x, y, z, s, op] of [[0.44, sill + 0.34, 0.98, 0.9, 0.7], [0.72, 1.6, 2.05, 1.5, 0.6], [0.4, sill + 0.1, -0.22, 0.32, 0.9]]) {
      const sp = new THREE.Sprite(glow(0xffb45a, op, true)); sp.position.set(x, y, z); sp.scale.set(s, s, 1); g.add(sp); st.glows.push({ sp, s, op });
    }
    const wash = new THREE.Mesh(W.KG.plane, H.mat(st, W.GlowMat(softTex(W), 0xc87a3a, 0.5))); wash.position.set(0.31, 1.25, 1.5); wash.rotation.y = Math.PI / 2; wash.scale.set(2.4, 2.3, 1); g.add(wash);
    const wash2 = new THREE.Mesh(W.KG.plane, H.mat(st, W.GlowMat(softTex(W), 0xb86a30, 0.3))); wash2.position.set(0.9, ROOM.Y - 0.01, 1.7); wash2.rotation.x = Math.PI / 2; wash2.scale.set(2.2, 2.0, 1); g.add(wash2);
    const pool = new THREE.Mesh(W.KG.plane, H.mat(st, W.GlowMat(softTex(W), 0xffb060, 0.45))); pool.position.set(0.45, sill + 0.005, 0.7); pool.rotation.x = -Math.PI / 2; pool.scale.set(0.5, 1.4, 1); pool.renderOrder = 2; g.add(pool);

    // the two at the glass, and their breath on it
    const bt = breathTex(W);
    st.dead = DEAD.map(d => {
      const f = deadAtGlass(W, M, d); f.g.position.set(GLASS - 0.25, d.y - 1.0, d.z); g.add(f.g);
      const bm = H.mat(st, new THREE.MeshBasicMaterial({ map: bt, color: 0xc4ccd4, transparent: true, opacity: 0, depthWrite: false }));
      const breath = new THREE.Mesh(W.KG.plane, bm); breath.position.set(GLASS - 0.004, d.y - 0.08, d.z); breath.rotation.y = Math.PI / 2; breath.renderOrder = 6; g.add(breath);
      return Object.assign({ fog: breath }, f, d);
    });
    st.say = H.P(W, GLASS, DEAD[0].y + 0.33, DEAD[0].z); st.say2 = H.P(W, GLASS, DEAD[1].y + 0.2, DEAD[1].z);
    W.say('Gezellig.', [st.say.x, st.say.y, st.say.z], { from: 1.55, to: CUT - 0.05, dy: 0 });
    W.say('Gezellig.', [st.say2.x, st.say2.y, st.say2.z], { from: 5.5, to: 7.6, dy: 0 });
  }

  const ease = (W, t, t0, len) => W.smooth(W.clamp((t - t0) / len, 0, 1));
  C[11] = {
    hold: 7.6,
    build(W) {
      H = window.NRHOME || plainHome();
      st = H.begin();
      const rand0 = Math.random; Math.random = H.rng(1212);   // the same room and the same two every time
      try { build(W); } finally { Math.random = rand0; }
      this.update(W, 0, 0);
    },
    update(W, t, dt) {
      if (!st || !st.room) return;
      const sill = ROOM.wins[0].y0;
      // the two: each rises into its pane, leans in and presses its face on the glass, lights its eyes, and breathes
      for (const d of st.dead) {
        const up = ease(W, t, d.rise, 0.55), press = ease(W, t, d.rise + 0.42, 0.28), u = t - d.breath, ph = u > 0 ? (u % 2.3) / 2.3 : -1;
        const draw = ph < 0 ? 0 : ph < 0.16 ? ph / 0.16 : 1 - (ph - 0.16) / 0.84;   // out fast, the fog fades slowly
        d.g.position.set(GLASS - 0.26 * (1 - press) - 0.006 * draw, d.y - 1.05 * (1 - up) + 0.006 * Math.sin(t * 1.7 + d.z), d.z + 0.008 * Math.sin(t * 0.9 + d.y));
        const e = t < d.eyes ? 0 : t - d.eyes < 0.28 ? (Math.floor((t - d.eyes) * 22) % 2 ? 0.35 : 1) : (Math.abs(t - d.eyes - 2.4) < 0.07 ? 0.1 : 1);
        d.eyeMat.color.setRGB(e, 0.83 * e, 0.42 * e); d.glowMat.opacity = 0.95 * e;
        d.fog.material.opacity = ph < 0 ? 0 : 0.08 + 0.4 * draw; const bs = 0.18 + 0.07 * draw; d.fog.scale.set(bs * 1.35, bs, 1);
      }
      // the lamps; the tea light flickers
      const fl = 1 + 0.06 * Math.sin(t * 13) * Math.sin(t * 7.3 + 1);
      const tl = st.glows[2]; tl.sp.scale.setScalar(tl.s * (1 + 0.15 * Math.sin(t * 19) * Math.sin(t * 11.7))); tl.sp.material.opacity = tl.op * fl;
      H.key(W, st, [0.46, sill + 0.26, 0.9], [-0.35, 1.55, -0.1], { color: 0xffb466, angle: 1.2, distance: 3.6, decay: 2, intensity: 1.7 * fl });
      // the eye: in the room, creeping in; a small start when the face hits the glass. A phone on its side has a short picture
      // under the captions, so the eye looks a little higher; an upright one sees a narrow slice, so the eye stands further back
      const jolt = Math.exp(-Math.max(0, t - 0.95) * 9) * (t > 0.95 ? 1 : 0), vw = H.view(W);
      if (t < CUT) {
        const k = ease(W, t, 0, CUT), c = i => W.lerp(CAM1[i], CAM1E[i], k), l = i => W.lerp(LOOK1[i], LOOK1E[i], k);
        const a = H.P(W, c(0) + 0.02 * jolt, c(1) - 0.015 * jolt, c(2)), b = H.P(W, l(0), l(1) + 0.18 * vw.short, l(2));
        W.cam(a.x, a.y, a.z, b.x, b.y, b.z, H.lens(W, W.lerp(40, 35, k), 16, 11));
        W.drift(t, 0.5);
        return;
      }
      const s = t - CUT, k = ease(W, s, 0, 4.2) + 0.012 * Math.max(0, s - 4.2), c = i => W.lerp(CAM2[i], CAM2E[i], k);
      const a = H.P(W, c(0) + 0.85 * vw.narrow, c(1), c(2)), b = H.P(W, LOOK2[0], LOOK2[1] + 0.07 * vw.short, LOOK2[2]);
      W.cam(a.x, a.y, a.z, b.x, b.y, b.z, H.lens(W, W.lerp(42, 38, k), 17, 13));
      W.drift(t, 0.45);
    },
    dispose(W) { if (H) H.end(W, st); st = null; },
  };
})();
