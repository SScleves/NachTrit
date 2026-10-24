// Panel 1: the night the mist came in, the windmills turned the wrong way.
// Key light: the moon, upper right. The hero mill is one clean black silhouette against the moon
// glow, its sails sweep across the moon; a small far mill turns the right way as the odd one out.
// Loop: 8 s. Everything dynamic is a function of sin/cos(2 pi t / 8) or a hashed step mod 16.
(function () {
  const A = window.NRART, TAU = Math.PI * 2, rnd = Math.round;
  const MOON = [268, 32], VP = [236, 134], HZ = 134;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // mill tower: flat silhouette, one rim column toward the moon, amber windows from the amber ramp only
  function tower(g, x, y, s, o) {
    const bh = rnd(50 * s), b0 = Math.max(3, rnd(11 * s)), b1 = Math.max(2, rnd(5.5 * s)), top = y - bh, ch = Math.max(2, rnd(6 * s));
    const body = o.body, dk = o.dark || body;
    A.poly(g, [x - b0, y, x + b0 + 1, y, x + b1 + 1, top, x - b1, top], body);
    if (o.rim) A.poly(g, [x + rnd(b0 * 0.62), y, x + b0 + 1, y, x + b1 + 1, top, x + rnd(b1 * 0.62), top], o.rim);
    A.poly(g, [x - b1 - 1, top + 1, x + b1 + 2, top + 1, x + b1 + 1, top - ch + 1, x - b1, top - ch], dk);
    if (s >= 0.7) {
      const sy = y - rnd(bh * 0.33), hw = rnd(b0 + 9 * s);
      A.rect(g, x - hw, sy, 2 * hw + 1, 2, dk); A.hline(g, x - hw, sy - 4, 2 * hw + 1, dk);
      for (let xx = x - hw; xx <= x + hw; xx += 4) A.vline(g, xx, sy - 4, 4, dk);
      A.line(g, x - hw, sy + 1, x - b0 + 1, y - 1, dk); A.line(g, x + hw, sy + 1, x + b0 - 1, y - 1, dk);
      A.line(g, x - rnd(hw * 0.55), sy + 1, x - rnd(b0 * 0.6), y - 1, dk); A.line(g, x + rnd(hw * 0.55), sy + 1, x + rnd(b0 * 0.6), y - 1, dk);
      A.rect(g, x - 2, y - 9, 4, 9, dk);
      [[0, 0.55], [-0.35, 0.74], [0.3, 0.4]].forEach(([fx, fy]) => {
        const wx = x + rnd(fx * b0), wy = y - rnd(bh * fy);
        A.ditherRect(g, wx - 2, wy - 2, 6, 7, null, 'amber1', 0.5);
        A.rect(g, wx, wy, 2, 3, 'amber6'); A.px(g, wx, wy, 'amber7');
      });
    }
    return [x + 0.5, top - ch * 0.5];
  }
  // sails: four lattice stocks. trail: a 1-2 px dithered smear behind each trailing edge, so a still frame shows direction
  function sails(g, hx, hy, s, ang, o) {
    const L = 34 * s, sw = Math.max(2, 6 * s), a0 = 0.2 * L, c = o.col, tr = o.trail, wide = s >= 1.2 ? 2 : 1;
    for (let k = 0; k < 4; k++) {
      const an = ang + k * Math.PI / 2, ca = Math.cos(an), sa = Math.sin(an), px = -sa, py = ca;
      if (tr) for (let i = rnd(a0); i <= L; i++) {
        const w = (i & 1) ? 3 : 2, bx = hx + ca * i, by = hy + sa * i;
        A.px(g, bx - px * w, by - py * w, tr);
        if (i % 3 === 0) A.px(g, bx - px * (w + 1), by - py * (w + 1), tr);
      }
      A.line(g, hx - ca * 2 * s, hy - sa * 2 * s, hx + ca * L, hy + sa * L, c, wide);
      const e = [hx + ca * L + px * sw, hy + sa * L + py * sw, hx + ca * a0 + px * sw, hy + sa * a0 + py * sw];
      A.line(g, hx + ca * L, hy + sa * L, e[0], e[1], c); A.line(g, e[0], e[1], e[2], e[3], c); A.line(g, e[2], e[3], hx + ca * a0, hy + sa * a0, c);
      if (s >= 0.45) { const n = Math.max(2, rnd((L - a0) / Math.max(2.5, 3.5 * s))); for (let i = 1; i < n; i++) { const f = a0 + (L - a0) * i / n; A.line(g, hx + ca * f, hy + sa * f, hx + ca * f + px * sw, hy + sa * f + py * sw, c); } }
    }
    A.disc(g, hx - 0.5, hy, Math.max(1, rnd(1.6 * s)), o.col);
  }
  // a lumpy cloud bank: lit underside only near the moon
  function bank(g, x0, x1, cy, hgt, seed) {
    for (let xx = x0; xx < x1; xx++) {
      const env = Math.pow(Math.sin(Math.PI * (xx - x0) / (x1 - x0)), 0.7);
      const L = 0.5 + 0.28 * Math.sin(xx * 0.09 + seed) + 0.17 * Math.sin(xx * 0.23 + seed * 2) + 0.08 * Math.sin(xx * 0.5 + seed);
      const th = Math.max(1, rnd(hgt * env * L)), bot = cy + rnd(Math.sin(xx * 0.13 + seed) * 1.2);
      const pm = clamp(1 - Math.hypot(xx - MOON[0], bot - MOON[1]) / 150, 0, 1);
      for (let r = 0; r < th; r++) {
        const yy = bot - r, down = r < 2, up = r === th - 1;
        let c = r > th * 0.5 ? 'night3' : 'night2';
        if (down) c = pm > 0.55 ? (A.bayer(xx, yy) < 0.5 ? 'mist4' : 'mist3') : pm > 0.25 ? (A.bayer(xx, yy) < 0.5 ? 'night6' : 'night5') : 'night4';
        else if (up && th > 3) c = pm > 0.3 ? 'night5' : 'night3';
        A.px(g, xx, yy, c);
      }
    }
  }
  const DITCH = [[-90, 4.4], [100, 4.4], [236, 2.6], [300, 4.4]];
  const ditchX = (b, d) => VP[0] + (b - VP[0]) * d;
  const ditchHW = (i, d) => i === 2 ? 0.8 + d * 6.5 : 0.6 + d * 4.4;   // the middle one is a wedge that opens toward the viewer
  // the polder's field tones, dark to pale; adjacent steps only, so the dither between them stays soft
  const FIELD = ['night0', 'green0', 'night1', 'green1', 'night2', 'green2', 'night3', 'green3', 'night4', 'mist1', 'mist2'];

  A.panels[0] = {
    text: 'The night the mist came in, the windmills turned the wrong way.',
    nl: 'De nacht dat de mist opkwam, draaiden de molens de verkeerde kant op.',
    draw(g, t) {
      const SAIL = Math.PI / 16; // k * SAIL per second is k quarter-turns per 8 s loop... all k are integers, so the 8 s loop is seamless
      A.camera(g, t, { x: 8, period: 8 }); A.key(g, 268, 30, 1);
      const key = [0, 0.2, 0.5, 0.8, 1].map(d => { A.depth(g, d); return g.ox; }).join(',');
      const cache = A.panels[0]._cache || (A.panels[0]._cache = {});
      let snap = cache[key];
      if (snap) { g.buf.set(snap.buf); g.mask.fill(0); }
      else {
        // ============ STATIC PLATE (cached per camera offset) ============
        A.depth(g, 0);
        A.sky(g, ['night1', 'night1', 'night2', 'night3', 'night4', 'mist1', 'mist2'], 0, 130);
        A.glow(g, 268, 34, 70, { color: 'mist4', strength: 0.22, power: 1.8 });
        A.glow(g, 236, 60, 66, { color: 'night7', strength: 0.75, power: 1.2 }); A.glow(g, 238, 64, 42, { color: 'mist1', strength: 0.55, power: 1.4 });   // the pale backlight that makes the hero mill a clean silhouette
        A.glow(g, 200, 118, 130, { color: 'mist3', strength: 0.2, power: 1.3, ry: 40 });
        A.moon(g, 268, 32, 10, { halo: 0.35 });
        bank(g, -10, 150, 66, 16, 1.3); bank(g, 8, 118, 30, 11, 6.2); bank(g, 70, 170, 14, 6, 3.3); bank(g, 20, 110, 52, 9, 4.1); bank(g, 150, 250, 78, 10, 2.2);
        // far plane: tree line, church, far mill towers, lit farm windows
        A.depth(g, 0.2);
        for (let x = -20; x < 340; x += 4) A.disc(g, x, 122 - rnd(A.hash(x, 2) * 3), 2 + rnd(A.hash(x, 3) * 2), 'night3');
        A.rect(g, -20, 122, 360, 12, 'night3');
        A.church(g, 126, 124, 0.6, { tone: 'night3' });
        [[22, 0.3], [160, 0.3]].forEach(([x, s]) => tower(g, x, 124, s, { body: 'night3' }));
        A.haze(g, -20, 90, 360, 40, { top: 0, bottom: 0.66, color: 'mist2' });
        // midground: left farm, poplars, middle mill tower
        A.depth(g, 0.5);
        A.rect(g, -20, 127, 360, 7, 'night2');
        for (let i = 0; i < 9; i++) {
          const x = 8 + i * 17 + rnd(A.hash(i, 4) * 5), h = 20 + rnd(A.hash(i, 5) * 10);
          if (x > 40 && x < 100) continue;
          A.ellipse(g, x, 127 - h / 2 - 3, 3, h / 2 + 1, 'night2'); A.vline(g, x, 125, 3, 'night1');
        }
        A.rect(g, 6, 114, 34, 14, 'night2');
        A.poly(g, [2, 114, 20, 103, 44, 114], 'night1'); A.hline(g, 2, 114, 42, 'night3');
        A.brick(g, 6, 115, 34, 13, { base: 'night2', only: 'night2', seed: 3 });
        A.rect(g, 12, 119, 5, 5, 'amber5'); A.rect(g, 27, 119, 5, 5, 'amber5');
        A.hline(g, 12, 119, 5, 'amber3'); A.vline(g, 14, 119, 5, 'night1'); A.vline(g, 29, 119, 5, 'night1');
        A.glow(g, 14, 122, 14, { color: 'amber5', strength: 0.3, power: 1.6 }); A.glow(g, 29, 122, 14, { color: 'amber5', strength: 0.3, power: 1.6 });
        tower(g, 98, 130, 0.78, { body: 'night2', dark: 'night1' });
        A.haze(g, -20, 100, 360, 34, { top: 0, bottom: 0.4, color: 'mist2' });
        // hero mill: flat night1, a rim column toward the moon
        A.depth(g, 0.8);
        A.rect(g, -20, 131, 360, 3, 'night1'); A.hline(g, -20, 131, 360, 'night3');
        tower(g, VP[0], 134, 1.35, { body: 'night1', dark: 'night0', rim: 'night3' });
        A.haze(g, -20, 120, 360, 14, { top: 0, bottom: 0.45, color: 'mist3' });   // static mist lying round the mill's feet
        // ============ the polder: fields between ditches converging on the mill ============
        A.depth(g, 1);
        // parcels: perspective bands, each a slightly different tone, like ploughed and grazed strips
        const bandOf = d => Math.floor(11 * Math.pow(d, 1.5));
        for (let yy = HZ; yy < 181; yy++) {
          const d = (yy - HZ) / 46, hz = Math.pow(1 - d, 1.6), band = bandOf(d), edge = bandOf(d) !== bandOf((yy - 1 - HZ) / 46);
          const bt = (A.hash(band, 7) - 0.5) * 0.16;
          for (let xx = -14; xx < 334; xx++) {
            let c = null;
            for (let i = 0; i < DITCH.length && !c; i++) {
              const cx = ditchX(DITCH[i][0], d), hw = ditchHW(i, d), dx = xx - cx;
              if (Math.abs(dx) > hw + 1) continue;
              if (Math.abs(dx) > hw) c = dx > 0 ? 'night0' : (d > 0.15 ? 'night3' : 'night1');
              else if (i === 2) { c = (0.28 + (1 - d) * 0.3) > A.bayer(xx, yy) ? 'night4' : 'night2'; }
              else { const m = clamp(1 - Math.abs(cx - 268) / 80, 0, 1), lv = (1 - d) * 0.75 + m * 0.2 + 0.1; c = lv > A.bayer(xx, yy) ? (m > 0.35 ? 'mist3' : (1 - d) * 0.6 + m > A.bayer(xx + 1, yy) ? 'mist1' : 'night5') : 'night3'; }
            }
            if (!c) {
              const sheen = clamp(1 - Math.abs(xx - 262) / 120, 0, 1) * 0.1 * (1 - d);
              let v = clamp(hz * 0.62 + 0.1 + bt + sheen - d * 0.1 - (edge ? 0.07 : 0) + (A.hash(xx >> 1, yy) - 0.5) * 0.04, 0, 0.999) * (FIELD.length - 1);
              const q = v | 0; c = FIELD[(v - q) > A.bayer(xx, yy) ? q + 1 : q];
            }
            A.px(g, xx, yy, c);
          }
        }
        for (let i = 0; i < 260; i++) {
          const d = 0.25 + 0.75 * Math.pow(A.hash(i, 21), 0.6), yy = HZ + rnd(d * 46), xx = rnd(-10 + A.hash(i, 22) * 340), h = 1 + rnd(d * 3);
          if (DITCH.some((D, k) => Math.abs(xx - ditchX(D[0], d)) < ditchHW(k, d) + 2)) continue;
          A.vline(g, xx, yy - h, h, A.hash(i, 23) < 0.5 ? 'green2' : 'night3');
          if (h > 2 && A.hash(i, 24) < 0.5) A.px(g, xx + 1, yy - h + 1, 'green2');
        }
        A.glow(g, 21, 133, 24, { color: 'amber5', strength: 0.14, power: 1.6, ry: 3 });   // the farm's light on its field
        // foreground frame: tall black reeds and cattails, a crooked mooring post
        for (let i = 0; i < 130; i++) {
          const left = i < 70, x = left ? -12 + A.hash(i, 1) * 62 : 276 + A.hash(i, 2) * 60, edge = left ? Math.min(1, (60 - x) / 50 + 0.2) : Math.min(1, (x - 270) / 50 + 0.2);
          const h = 28 + 26 * A.hash(i, 3) * clamp(edge + 0.3, 0, 1) + (A.hash(i, 9) < 0.15 ? 8 : 0), lean = (left ? 1 : -1) * (A.hash(i, 4) - 0.2) * 7, c = A.hash(i, 5) < 0.5 ? 'night0' : 'night1';
          A.line(g, x, 182, x + lean, 182 - h, c);
          if (A.hash(i, 6) < 0.3) { A.rect(g, x + lean - 1, 182 - h - 1, 2, 5, 'night0'); }
        }
        [[289, 178, 17, 2], [304, 180, 23, -2], [318, 181, 13, 1]].forEach(([x, y, h, lean]) => { A.poly(g, [x - 2, y, x + 2, y, x + 2 + lean, y - h, x - 2 + lean, y - h + 1], 'night0'); A.vline(g, x + 2 + lean, y - h + 1, h - 1, 'night3'); A.hline(g, x - 2 + lean, y - h, 5, 'night2'); });
        snap = cache[key] = { buf: g.buf.slice() };
      }
      // ============ DYNAMIC ============
      const ph = TAU * t / 8, step = Math.floor(t * 2) % 16;
      A.depth(g, 0);
      A.stars(g, t, { n: 26, y0: 2, y1: 36, x1: 205, seed: 4 });
      // a real cloud bank sails in from the right and veils the moon's lower half, then drifts clear (sin loop)
      { const s = 0.5 - 0.5 * Math.cos(ph), xo = rnd(Math.sin(ph) * 6), x0 = 190 + xo, x1 = 330 + xo;
        for (let xx = x0; xx < x1; xx++) {
          const u = (xx - x0) / (x1 - x0), env = Math.pow(Math.sin(Math.PI * u), 0.6), s1 = Math.sin(xx * 0.065 + 1), s2 = Math.sin(xx * 0.14 + 2);
          const lump = 0.55 + 0.3 * s1 * s1 + 0.15 * s2 * s2;
          const bot = rnd((12 + 24 * s) * env * lump + 4 * env); if (bot < 1) continue;
          const pm = clamp(1 - Math.abs(xx - MOON[0]) / 70, 0, 1);
          const sp = bot - 6;   // rows above the lit rim are two flat runs
          if (sp > 0) { const n0 = rnd(bot * 0.4); A.vline(g, xx, 0, Math.min(n0, sp), 'night0'); if (sp > n0) A.vline(g, xx, n0, sp - n0, 'night1'); }
          for (let yy = Math.max(0, sp); yy < bot; yy++) {
            const k = bot - 1 - yy, bz = A.bayer(xx, yy);
            let c;
            if (k > 2) c = bz < 0.5 ? 'night2' : 'night1';
            else if (k === 2) c = bz < 0.5 ? 'night3' : 'night2';
            else if (k === 1) c = pm > 0.1 ? (bz < 0.5 ? 'night5' : 'night4') : (bz < 0.4 ? 'night4' : 'night3');
            else { if (bz > 0.7) continue; c = pm > 0.25 ? (bz < 0.3 ? 'mist2' : 'night6') : 'night5'; }
            A.px(g, xx, yy, c);
          }
        } }
      // far mills: one small one turns the right way (the odd one out); the others turn wrong
      A.depth(g, 0.2);
      sails(g, 22.5, 124 - rnd(15) - 1, 0.3, t * SAIL * 2 + 1, { col: 'night3' });
      sails(g, 160.5, 124 - rnd(15) - 1, 0.3, -t * SAIL * 2 + 0.4, { col: 'night3' });
      A.depth(g, 0.5);
      sails(g, 98.5, 130 - rnd(39) - 2, 0.78, t * SAIL * 2 + 0.4, { col: 'night1' });
      const fl = 0.85 + 0.15 * Math.sin(ph * 5) * Math.sin(ph * 3);
      A.glow(g, 21, 122, 10, { color: 'amber5', strength: 0.22 * fl, power: 1.4, q: 3 });
      // tall, thin, hunched dead on the far bank: one cliche each, eyes the only light
      A.depth(g, 0.7);
      [[128, 136, 'hat', 0], [147, 137, 'bonnet', 1], [284, 136, 'cheese', 2], [303, 137, 'plain', 3]].forEach(([x, y, v, i]) =>
        A.zombie(g, x + rnd(Math.sin(ph + i) * 1.5), y, { variant: v, pose: 'stand', t: t * 0.5 + i, height: 32, tone: 'night1', hunch: 0.3, seed: i + 2 }));
      // the hero mill's sails: wrong way, a quarter turn per 2 s, sweeping across the moon
      A.depth(g, 0.8);
      A.mist(g, t, 124, 14, { amount: 0.4, speed: 4, seed: 3, color: 'mist3' });
      sails(g, VP[0] + 0.5, 62, 1.35, t * SAIL * 4 + 0.35, { col: 'night0', trail: 'night3' });
      // ditches: broken ripple dashes that widen toward the viewer, brightest where the moon looks in
      A.depth(g, 1);
      DITCH.forEach(([b, hwK], i) => {
        for (let yy = HZ + 3; yy < 181; yy += 2) {
          const d = (yy - HZ) / 46, cx = ditchX(b, d), hw = ditchHW(i, d);
          const h = A.hash(yy + i * 61, step), h2 = A.hash(yy * 3 + i * 17, (step + 5) % 16); if (h < 0.35) continue;
          const w = Math.max(1, rnd((1 + d * (hw * 1.7)) * (0.5 + h2))), m = clamp(1 - Math.abs(cx - 268) / 28, 0, 1) * (i === 3 ? 1 : 0.25);
          if (i === 2) { if (h2 < 0.45) A.hline(g, cx - (w >> 1) + rnd((h2 - 0.5) * hw), yy, Math.min(w, rnd(hw * 1.4)), 'night5'); continue; }
          const c = m > 0.4 ? (h2 < 0.5 ? 'paper5' : 'mist6') : m > 0.1 ? 'mist4' : 'mist2';
          A.hline(g, cx + rnd((h2 - 0.5) * hw) - (w >> 1), yy, Math.min(w, rnd(hw * 2)), c);
        }
      });
      [[10, 0.7], [17, 0.9], [25, 1.2]].forEach(([dy, wk], j) => {
        const yy = HZ + dy, d = (yy - HZ) / 46, sh = Math.sin(ph * 4 + j * 2.1), w = Math.max(1, rnd((1.2 + d * 5) * wk * (0.75 + 0.25 * sh)));
        A.hline(g, VP[0] + rnd(sh * d * 2) - (w >> 1), yy + (sh > 0.6 ? 1 : 0), w, j === 1 ? 'amber5' : 'amber4');
        if (w > 2) A.hline(g, VP[0] + rnd(sh * d * 2) - (w >> 1) - 1, yy + 2, w + 2, 'amber2');
      });
      A.mist(g, t, 137, 12, { amount: 0.55, speed: 6, seed: 11, color: 'mist3' });
      // the duck, dim, only its eyes glow
      { const bob = Math.sin(ph * 2) > 0.5 ? 1 : 0, d = 0.8, cx = ditchX(300, d), y = HZ + 46 * d + bob;
        A.ellipse(g, cx - 1, y, 3, 1, 'mist2'); A.disc(g, cx - 4, y - 2, 1, 'mist2'); A.px(g, cx - 5, y - 2, 'eye4'); A.glow(g, cx - 5, y - 2, 3, { color: 'eye3', strength: 0.3, q: 3 }); }
      // foreground: reeds sway, a fingerpost marked Molen
      A.reeds(g, -14, 182, 30, 40, { t, seed: 2, tone: 'night0', dense: 0.8 });
      A.reeds(g, 292, 182, 36, 38, { t, seed: 5, tone: 'night0', dense: 0.8 });
      A.fingerpost(g, 277, 178, { signs: [['Molen', 'left']], tone: 'wood1' });
    },
  };
})();
