// Level intro scene "square": a village church on a wet cobbled square at night, in fog.
// The beat: "Someone is still ringing the church bell. It wants to know who you are."
//   - the tower stands off-centre (x 190); its bell really swings (rotating tilts, a lagging clapper),
//     sound rings expand out of the belfry on every strike, crows burst off the pinnacles
//   - a bell rope runs from the belfry down to the lit door, where a dead ringer hangs off it
//   - the hero (small, orange, seen from behind, with his dog) stands bottom centre, facing the door;
//     every one of the dead turns toward him
// Key light: the open church door. Warm light is amber-ramp stepped (warm()), never mixed toward brick.
// Speed: the whole static world (sky, far town, houses, church, cobbles, trees, lamps) is baked once
// into two cached layers; per frame only the sails, mist, bell, rings, crows, ringer, puddles and the
// dead are drawn. Camera drift is left out on purpose so the baked layers stay registered.
(function () {
  const A = window.NRART, C = A.C;
  const W = 320, H = 180, BY = 134, CX = 190;
  const hs = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const rnd = Math.round;
  const ease = k => k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k);

  // ------------------------------------------------------------------ warm light that steps through the amber ramp
  let LUM = null;
  const lum = () => {
    if (LUM) return LUM; LUM = new Float32Array(256);
    for (let i = 0, n = A.paletteSize(); i < n; i++) { const c = A.rgb(i); LUM[i] = 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]; }
    return LUM;
  };
  const AMB = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(k => C['amber' + k]);
  /** Light the pixels where field() > 0 by raising their brightness toward amber step `max`, landing on
   *  the amber ramp (dithered between neighbouring steps). Dark cold pixels stay cold until the light
   *  is strong enough to reach amber0, so there is no brown mud at the fringe. */
  function warm(g, x0, y0, x1, y1, field, o) {
    o = o || {}; const L = lum(), buf = g.buf, mx = o.max == null ? 5 : o.max, top = L[AMB[mx]], gain = o.gain == null ? 1 : o.gain;
    const flat = o.flat || 0, sharp = o.sharp || 1, ref = o.ref == null ? 34 : o.ref, S = f => { f = (f - 0.5) * sharp + 0.5; return f < 0 ? 0 : f > 1 ? 1 : f; };
    x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0)); x1 = Math.min(W - 1, Math.ceil(x1)); y1 = Math.min(H - 1, Math.ceil(y1));
    for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) {
      const lv = field(xx, yy); if (lv <= 0.02) continue;
      const i = yy * W + xx, p = buf[i], l0 = L[p]; if (l0 >= top) continue;
      const lb = l0 * (1 - flat) + Math.min(l0, ref) * flat, tl = lb + (top - lb) * Math.min(1, lv * gain), b = A.bayer(xx, yy); let c;
      if (tl < L[AMB[0]]) c = S((tl - lb) / (L[AMB[0]] - lb)) > b ? AMB[0] : p;
      else { let k = 0; while (k < mx && L[AMB[k + 1]] <= tl) k++; c = k >= mx ? AMB[mx] : (S((tl - L[AMB[k]]) / (L[AMB[k + 1]] - L[AMB[k]])) > b ? AMB[k + 1] : AMB[k]); }
      if (L[c] > l0) buf[i] = c;
    }
  }
  const radial = (cx, cy, rx, ry, pw) => (x, y) => { const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry, d2 = dx * dx + dy * dy; return d2 >= 1 ? 0 : Math.pow(1 - Math.sqrt(d2), pw); };
  const glowAt = (g, cx, cy, rx, ry, pw, o) => warm(g, cx - rx, cy - ry, cx + rx, cy + ry, radial(cx, cy, rx, ry, pw), o);
  // a downward fan of light from (x, y): half width w0 at the top growing by `spread` per row, `len` rows long
  const fan = (x, y, w0, spread, len, pw) => (xx, yy) => {
    const d = yy - y; if (d < 0 || d > len) return 0; const half = w0 + d * spread, a = Math.abs(xx + 0.5 - x) / half; if (a >= 1) return 0;
    return (1 - a * a) * Math.pow(1 - d / len, pw);
  };

  // fog only the pixels that differ from `ref` (a snapshot taken before the layer was drawn), thicker toward the bottom
  function fogDiff(g, ref, x0, y0, x1, y1, top, bot, color) {
    const Q = 8, Ls = []; for (let q = 0; q <= Q; q++) Ls.push(A.lut('mix', color, q / Q));
    const buf = g.buf;
    for (let y = Math.max(0, y0); y < Math.min(H, y1); y++) {
      const a = top + (bot - top) * (y - y0) / (y1 - y0);
      for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) {
        const i = y * W + x; if (buf[i] === ref[i]) continue;
        const v = a * Q; let q = v | 0; if (v - q > A.bayer(x, y)) q++;
        if (q > 0) buf[i] = Ls[q > Q ? Q : q][buf[i]];
      }
    }
  }

  // ------------------------------------------------------------------ shapes
  // pointed (gothic) arch filled with colour c
  const archFill = (g, x, y, w, h, c) => {
    const r = w >> 1;
    A.rect(g, x, y + r, w, h - r, c);
    for (let i = 0; i < r; i++) A.hline(g, x + Math.floor(i * 0.8), y + r - i - 1, w - Math.floor(i * 1.6), c);
    A.hline(g, x + (w >> 1) - 1, y, 2, c);
  };
  const gothic = (g, x, y, w, h, lit, level) => {
    archFill(g, x - 1, y - 1, w + 2, h + 1, 'night1');
    archFill(g, x, y, w, h, level < 1 ? 'amber4' : lit ? 'amber6' : 'night3');
    if (lit) { A.vline(g, x + (w >> 1), y + 3, h - 3, 'brick1'); A.hline(g, x, y + (h >> 1), w, 'brick1'); A.hline(g, x + 1, y + h - 2, w - 2, 'amber8'); }
    A.hline(g, x - 1, y + h, w + 2, 'slate4');
  };
  // a leafless, gnarled tree cut out against the fog, with an amber rim on the side facing the door
  function bareTree(g, x, y, s, seed) {
    A.begin(g);
    const col = 'night0';
    const limb = (x0, y0, ang, len, th, depth) => {
      let px = x0, py = y0, a = ang; const n = Math.max(2, Math.round(len / 3.2));
      for (let i = 0; i < n; i++) {
        const nx = px + Math.cos(a) * len / n, ny = py + Math.sin(a) * len / n;
        A.line(g, px, py, nx, ny, col, th); px = nx; py = ny; a += (hs(seed + depth * 5 + i, x0 + 3) - 0.5) * 0.7;
      }
      if (depth < 5 && len > 5) {
        const k = 2 + (hs(seed + depth, y0) < 0.35 ? 1 : 0);
        for (let j = 0; j < k; j++) { const da = (j - (k - 1) / 2) * (0.7 + 0.3 * hs(seed + j, depth)) + (hs(seed, depth + j) - 0.5) * 0.4; limb(px, py, a + da, len * (0.66 + 0.14 * hs(seed + j, 9)), Math.max(1, th - 1), depth + 1); }
      }
    };
    // trunk: a wobbling taper
    const tw = 7 * s, th = 96 * s, L = [], R = [];
    for (let i = 0; i <= 10; i++) {
      const u = i / 10, w = tw * (1 - 0.55 * u) / 2, cx = x + Math.sin(u * 3 + seed) * 3 * s * u;
      L.push(cx - w, y - th * u); R.unshift(cx + w, y - th * u);
    }
    A.poly(g, L.concat(R), col);
    const tx = x + Math.sin(3 + seed) * 3 * s;
    limb(tx, y - th, -Math.PI / 2 - 0.35, 30 * s, 3, 1); limb(tx, y - th * 0.9, -Math.PI / 2 + 0.35, 26 * s, 3, 1);
    limb(tx, y - th * 0.62, -Math.PI / 2 + 1.05, 26 * s, 2, 2); limb(tx, y - th * 0.7, -Math.PI / 2 - 0.9, 22 * s, 2, 2);
    A.end(g, 1, 'amber4');
  }

  // ------------------------------------------------------------------ BG layer: sky, stars, the moon, the far town
  function farTown(g) {
    const ref = g.buf.slice();
    // pale flat roofs and a second spire
    for (let i = -1; i < 10; i++) {
      const x = -10 + i * 36 + ((i * 7) % 11), w = 26 + (i % 3) * 6, h = 14 + ((i * 13) % 12), top = 128 - h;
      A.rect(g, x, top, w, h, 'night4');
      if (i % 2) A.poly(g, [x - 1, top, x + w + 1, top, x + w / 2, top - 9], 'night4'); else { A.rect(g, x + 3, top - 4, w - 6, 4, 'night4'); A.rect(g, x + 6, top - 7, w - 12, 3, 'night4'); }
      if (i % 3 === 1) A.rect(g, x + 5, top + 6, 2, 3, 'amber3');
    }
    A.church(g, 252, 126, 1.25, { tone: 'night4', lit: false, clock: false, rim: 0 });
    A.rect(g, 252, 126 - 22, 1, 3, 'amber3');
    fogDiff(g, ref, 0, 40, W, 132, 0.4, 0.62, 'mist2');
  }
  function drawBG(g) {
    A.sky(g, ['night1', 'night2', 'night3', 'night4', 'mist0', 'mist1', 'mist2'], 0, BY + 6, { blend: 12 });
    A.rect(g, 0, BY + 6, W, H, 'mist2');
    A.stars(g, 0, { n: 24, y0: 2, y1: 50, seed: 5 });
    // a dimmed moon, tucked behind the spire so the spire is backlit (the spire is drawn in the mid layer)
    A.moon(g, CX - 7, 31, 10, { halo: 0.24, phase: 0.1 });
    A.glow(g, CX - 7, 31, 13, { mode: 'mix', color: 'mist2', strength: 0.5, power: 0.35, q: 4 });   // a dim, hazed moon
    A.glow(g, 76, 88, 46, { mode: 'mix', color: 'mist3', strength: 0.55, power: 0.8, q: 6, ry: 34 });   // fog glow behind the mill
    farTown(g);
  }

  // ------------------------------------------------------------------ MID layer: everything that holds still
  function houses(g) {
    // cold slate masses; only the windows are warm
    [[-8, 34, 76, 'bell', 'night4', 70], [26, 30, 56, 'step', 'slate3', 71], [254, 34, 68, 'neck', 'slate3', 72], [288, 36, 52, 'spout', 'night4', 73]]
      .forEach(([x, w, h, gb, br, sd]) => A.canalHouse(g, x, BY, w, h, { gable: gb, brick: br, trim: 'mist2', lit: 0.4, t: 0, seed: sd, flicker: 0, rim: 0 }));
    A.haze(g, 0, 30, W, 110, { top: 0.35, bottom: 0.3, color: 'mist2' });
  }
  function church(g) {
    const TX0 = 176, TX1 = 204;
    // --- nave and chapel
    A.rect(g, 98, 104, 78, 30, 'slate3');
    A.poly(g, [94, 104, 180, 104, 168, 80, 106, 80], 'slate2'); A.tiles(g, 94, 80, 86, 25, { base: 'slate2', only: 'slate2' });
    A.hline(g, 94, 104, 86, 'slate4'); A.hline(g, 94, 105, 80, 'slate1'); A.hline(g, 106, 80, 62, 'slate4');
    A.brick(g, 98, 106, 78, 28, { base: 'slate3', only: 'slate3', seed: 4 });
    A.rect(g, 98, 130, 78, 4, 'slate2');
    [98, 122, 146, 168].forEach(x => { A.rect(g, x, 108, 4, 26, 'slate2'); A.poly(g, [x, 108, x + 4, 108, x + 4, 105], 'slate2'); A.hline(g, x, 108, 4, 'slate4'); });
    A.rect(g, 204, 112, 42, 22, 'slate3');
    A.poly(g, [200, 112, 250, 112, 240, 96, 210, 96], 'slate2'); A.tiles(g, 200, 96, 50, 17, { base: 'slate2', only: 'slate2' });
    A.hline(g, 200, 112, 50, 'slate4'); A.hline(g, 200, 113, 46, 'slate1'); A.hline(g, 210, 96, 30, 'slate4');
    A.brick(g, 204, 114, 42, 20, { base: 'slate3', only: 'slate3', seed: 8 });
    A.rect(g, 204, 130, 42, 4, 'slate2');
    [106, 130, 154].forEach(x => gothic(g, x, 108, 8, 20, true, 1));
    [214, 232].forEach(x => gothic(g, x, 117, 7, 13, true, 1));
    // --- tower
    A.rect(g, TX0, 56, 28, 78, 'slate4');
    A.brick(g, TX0, 56, 28, 78, { base: 'slate4', only: 'slate4', seed: 9 });
    A.rect(g, TX0, 56, 2, 78, 'slate5'); A.rect(g, TX1 - 2, 56, 2, 78, 'slate3');
    A.rect(g, TX0 - 2, 54, 32, 3, 'slate5'); A.hline(g, TX0 - 2, 57, 32, 'slate2'); A.hline(g, TX0 - 2, 54, 32, 'slate6');
    A.rect(g, TX0, 130, 28, 4, 'slate3');
    // belfry opening: dark, warmed from within, with the headstock beam
    archFill(g, 178, 59, 24, 28, 'slate2');
    archFill(g, 179, 60, 22, 26, 'night0');
    A.ditherGradient(g, 179, 66, 22, 20, 'night0', 'amber2', 'down');
    A.hline(g, 179, 86, 22, 'slate2');
    A.vline(g, 179, 66, 20, 'slate1'); A.vline(g, 200, 66, 20, 'slate1');
    A.rect(g, 179, 64, 22, 2, 'wood2'); A.hline(g, 179, 64, 22, 'wood4');
    // the clock, stopped at 3:33
    A.disc(g, CX, 95, 6, 'slate1'); A.disc(g, CX, 95, 5, 'paper1'); A.disc(g, CX, 95, 4, 'paper2');
    A.line(g, CX, 95, CX + 2, 95, 'night1'); A.line(g, CX, 95, CX - 1, 98, 'night1');
    A.px(g, CX, 91, 'slate2'); A.px(g, CX + 4, 95, 'slate2'); A.px(g, CX, 99, 'slate2'); A.px(g, CX - 4, 95, 'slate2');
    // spire
    A.poly(g, [TX0 - 2, 56, TX1 + 2, 56, CX, 21], 'slate3');
    A.poly(g, [CX, 21, CX + 16, 56, CX + 5, 56], 'slate2');
    A.tiles(g, TX0 - 2, 22, 32, 35, { base: 'slate3', only: 'slate3' }); A.tiles(g, CX, 22, 16, 35, { base: 'slate2', only: 'slate2' });
    A.vline(g, CX, 24, 32, 'slate4'); A.hline(g, TX0 - 2, 56, 32, 'slate1'); A.hline(g, TX0 + 3, 45, 22, 'slate1');
    A.rect(g, CX - 1, 36, 2, 4, 'amber4');
    // pinnacles at the four corners, where the crows sit
    [TX0 - 3, TX1 - 1].forEach(x => { A.rect(g, x, 47, 4, 9, 'slate4'); A.poly(g, [x - 1, 47, x + 5, 47, x + 2, 40], 'slate3'); A.px(g, x + 2, 39, 'slate5'); A.rect(g, x, 47, 1, 9, 'slate5'); });
    // finial, cross and weathercock, with sky above
    A.disc(g, CX, 20, 1, 'slate5'); A.vline(g, CX, 11, 9, 'slate4'); A.hline(g, CX - 2, 14, 5, 'slate4');
    A.rect(g, CX + 1, 10, 4, 2, 'slate5'); A.px(g, CX + 5, 9, 'slate5'); A.px(g, CX - 1, 9, 'slate5'); A.px(g, CX - 2, 8, 'slate5'); A.px(g, CX + 2, 9, 'slate5');
    // porch and the great door, open on the lit nave
    A.rect(g, 178, 108, 24, 26, 'slate3'); A.brick(g, 178, 108, 24, 26, { base: 'slate3', only: 'slate3', seed: 12 });
    A.poly(g, [175, 108, 205, 108, CX, 99], 'slate2'); A.tiles(g, 175, 99, 30, 10, { base: 'slate2', only: 'slate2' }); A.hline(g, 175, 108, 30, 'slate4');
    archFill(g, 182, 109, 16, 25, 'slate1');
    archFill(g, 183, 110, 14, 24, 'amber6');
    A.ditherRect(g, 184, 118, 12, 16, null, 'amber7', 0.55); A.ditherRect(g, 186, 122, 8, 12, null, 'amber8', 0.5);
    A.vline(g, 183, 114, 20, 'amber4'); A.vline(g, 196, 114, 20, 'amber4'); A.hline(g, 183, 133, 14, 'amber8');
    A.rect(g, CX - 11, BY - 2, 22, 2, 'slate5'); A.rect(g, CX - 14, BY - 1, 28, 1, 'slate4');
    // fog, then the light of the door on its own walls
    A.haze(g, 90, 16, 170, 120, { top: 0.3, bottom: 0.1, color: 'mist3' });
    [106, 130, 154].forEach(x => glowAt(g, x + 4, 118, 8, 15, 2.2, { max: 2, sharp: 3 }));
    [214, 232].forEach(x => glowAt(g, x + 3, 123, 7, 9, 2.2, { max: 2, sharp: 3 }));
  }
  function cobbles(g) {
    A.rect(g, 0, BY, W, H - BY, 'slate1');
    const VPY = BY - 30, VPX = 186; let y = BY, k = 0;
    while (y < H) {
      const h = Math.max(2, rnd(2 + (y - BY) / 13)), s = (y - VPY) / 30, cw = 7 * s, off = (k & 1) ? 0.5 : 0;
      for (let j = Math.floor(-VPX / cw) - 1; j <= Math.ceil((W - VPX) / cw) + 1; j++) {
        const x0 = rnd(VPX + (j + off) * cw), x1 = rnd(VPX + (j + 1 + off) * cw) - 1, hv = hs(j * 7 + (k & 1) * 3, k);
        A.rect(g, x0, y, x1 - x0, h - 1, hv < 0.12 ? 'slate4' : hv < 0.45 ? 'slate3' : 'slate2');
        if (h >= 3 && hv > 0.55) A.hline(g, x0 + 1, y, x1 - x0 - 2, 'slate4');
      }
      y += h; k++;
    }
    // distance fog on the far cobbles, shade toward the camera
    A.haze(g, 0, BY - 2, W, 26, { top: 0.55, bottom: 0, color: 'mist2' });
    A.haze(g, 0, 150, W, 30, { top: 0, bottom: 0.6, color: 'night0', lights: 1 });
  }
  function lights(g) {
    // the open door pours light across the square: flat bands, narrow dithered seams
    const door = fan(CX, BY, 9, 0.5, 22, 1.2);
    warm(g, 0, BY, W, H, (x, y) => door(x, y) * 0.8, { max: 2, flat: 0.8, sharp: 2 });
    // two lamps: a halo, a cone through the fog, a pool, a long wet streak
    [[88, 146, 40], [262, 158, 46]].forEach(([lx, fy, h]) => {
      const hy = fy - h - 3;
      warm(g, lx - 30, hy, lx + 32, fy + 4, fan(lx + 1, hy + 2, 3, 0.34, h + 4, 0.9), { max: 2, gain: 0.8, sharp: 3 });
      glowAt(g, lx + 1, fy + 3, 32, 7, 1.2, { max: 4, flat: 0.8, sharp: 3 });
      // the wet streak: a long smear under the lamp that widens toward us and fades
      warm(g, lx - 6, fy + 5, lx + 8, fy + 40, (x, y) => {
        const k = y - (fy + 5), half = 1 + k * 0.1 + 0.6 * Math.sin(k * 0.5 + lx), a = Math.abs(x + 0.5 - (lx + 1)) / half;
        if (k < 0 || k > 34 || a >= 1) return 0;
        return (1 - a * a) * Math.pow(1 - k / 34, 1.1) * (hs(k >> 1, lx) < 0.3 ? 0.5 : 1);
      }, { max: 5, flat: 0.8, sharp: 2.5 });
    });
  }
  // the pale, sound-muffling bank of mist that sits between the houses and the church
  function mistBank(g) {
    A.haze(g, 0, 78, W, 60, { top: 0, bottom: 0.5, color: 'mist3', lights: 0.5 });
  }
  function drawMid(g) {
    houses(g);
    mistBank(g);
    church(g);
    cobbles(g);
    lights(g);
    bakePuddle(g, 184, 151, 78, 14, 3); bakePuddle(g, 166, 176, 24, 4, 8);
    // light goes on the lanterns themselves, bare trees stand dark at the edges
    A.lamp(g, 88, 146, { style: 'lantern', h: 40, light: false });
    A.lamp(g, 262, 158, { style: 'lantern', h: 46, light: false });
    A.omafiets(g, 54, 150, { rider: false, shadow: true });
    A.tulips(g, 100, 152, 18, { seed: 5 });
    A.bollard(g, 126, 146); A.bollard(g, 218, 144); A.bollard(g, 236, 146);
    A.cheeseCart(g, 290, 172, { glow: 0 });
    A.tint(g, 262, 150, 48, 24, 'night1', 0.3, 'mix');
    // far dead, standing in the mist at the back of the square, turned toward the door and the hero
    [[122, 139, 22, 'plain', 'right', 11], [136, 137, 19, 'hat', 'right', 12], [148, 140, 21, 'plain', 'right', 13],
     [226, 139, 22, 'plain', 'left', 14], [238, 137, 19, 'bonnet', 'left', 15], [250, 140, 21, 'hat', 'left', 16], [74, 138, 20, 'plain', 'right', 17]]
      .forEach(([x, y, h, v, f, sd]) => A.zombie(g, x, y, { variant: v, facing: f, height: h, tone: 'night3', seed: sd, shadow: false, rim: 0, glow: 0.3 }));
    A.haze(g, 60, 130, 210, 14, { top: 0.45, bottom: 0.15, color: 'mist2', lights: 1 });
    [[126, 162, 9], [222, 164, 9], [166, 175, 8], [151, 177, 8]].forEach(([x, y, r]) => A.shadow(g, x, y, r, 2, 0.5));
    bareTree(g, 14, 182, 0.8, 3);
    bareTree(g, 306, 178, 0.55, 8);
  }

  // ------------------------------------------------------------------ cheap drifting mist (tables built once)
  const BAY = new Float32Array(16); for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) BAY[y * 4 + x] = A.bayer(x, y);
  const MISTS = {};
  function mist(g, t, x0, x1, y, h, amount, speed, seed, color, lf) {
    const key = [y, h, amount, seed, color].join(); let M = MISTS[key];
    if (!M) {
      const th = new Float32Array(W), cy = new Float32Array(W), am = new Float32Array(W), inv = new Float32Array(W), cy0 = y + h / 2;
      for (let i = 0; i < W; i++) { const n = A.wave(i, W, seed), n2 = A.wave(i * 0.5 + 40, W, seed + 3); th[i] = Math.max(0.5, h * (0.35 + 0.65 * n) / 2); inv[i] = 1 / th[i]; cy[i] = cy0 + (n2 - 0.5) * h * 0.5; am[i] = amount * (0.55 + 0.45 * n) * 6; }
      const Ls = new Uint8Array(7 * 256); for (let q = 0; q <= 6; q++) Ls.set(A.lut('mix', color, q / 6), q << 8);
      M = MISTS[key] = { th, cy, am, inv, Ls };
    }
    const buf = g.buf, sh = Math.floor(t * speed), lo = AMB[4], hi = AMB[8], Ls = M.Ls;
    for (let x = x0; x < x1; x++) {
      const i = (((x + sh) % W) + W) % W, th = M.th[i], cy = M.cy[i], am = M.am[i], inv = M.inv[i];
      const r0 = Math.max(0, Math.ceil(cy - th)), r1 = Math.min(H - 1, Math.floor(cy + th));
      for (let yy = r0; yy <= r1; yy++) {
        const d = (yy + 0.5 - cy) * inv, v0 = am * (1 - d * d); if (v0 < 0.12) continue;
        const o = yy * W + x, c = buf[o], v = (c >= lo && c <= hi) ? v0 * lf : v0;
        let q = v | 0; if (v - q > BAY[((yy & 3) << 2) | (x & 3)]) q++;
        if (q > 0) buf[o] = Ls[((q > 6 ? 6 : q) << 8) | c];
      }
    }
  }

  // ------------------------------------------------------------------ pre-drawn sprites (the dead): pixel lists per animation frame
  function bakeSprite(g, frames, draw) {
    const out = [];
    for (let k = 0; k < frames; k++) {
      g.buf.fill(0); g.mask.fill(0); g.sa = 0; g.stack.length = 0;
      draw(g, 160, 170, k / frames * 8);
      const dx = [], dy = [], col = []; let e4 = null, e2 = null;
      for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) { const c = g.buf[yy * W + xx]; if (!c) continue; dx.push(xx - 160); dy.push(yy - 170); col.push(c); if (c === C.eye4) e4 = [xx - 160, yy - 170]; if (c === C.eye2) e2 = [xx - 160, yy - 170]; }
      out.push({ dx: Int16Array.from(dx), dy: Int16Array.from(dy), col: Uint8Array.from(col), e4, e2 });
    }
    return out;
  }
  // draw frame f at (x, y), dissolved to `alpha`, with glowing eyes (and a blink) added live
  function putSprite(g, SP, f, x, y, alpha, t, seed) {
    const fr = SP[f], buf = g.buf, n = fr.col.length, dx = fr.dx, dy = fr.dy, col = fr.col;
    for (let j = 0; j < n; j++) {
      const px = x + dx[j], py = y + dy[j]; if (px < 0 || py < 0 || px >= W || py >= H) continue;
      if (alpha < 1 && alpha <= BAY[((py & 3) << 2) | (px & 3)]) continue;
      buf[py * W + px] = col[j];
    }
    if (alpha < 0.5 || !fr.e4) return;
    const blink = ((t + hs(seed, 17) * 4.1) % 4.1) < 0.13;
    if (blink) { buf[(y + fr.e4[1]) * W + x + fr.e4[0]] = C.zombie5; if (fr.e2) buf[(y + fr.e2[1]) * W + x + fr.e2[0]] = C.zombie5; return; }
    A.glow(g, x + (fr.e4[0] + (fr.e2 ? fr.e2[0] : fr.e4[0])) / 2 + 0.5, y + fr.e4[1] + 0.5, 4, { color: 'eye3', strength: 0.3 * alpha, power: 1.4, q: 4 });
    buf[(y + fr.e4[1]) * W + x + fr.e4[0]] = C.eye4; if (fr.e2) buf[(y + fr.e2[1]) * W + x + fr.e2[0]] = C.eye2;
  }
  let SPR = null;

  // ------------------------------------------------------------------ the bake
  let BG = null, MID = null, MIDM = null, MID32 = null, MIDM32 = null, MILL = null;
  const NF = 32;   // the mill is pre-drawn at 32 angles per quarter turn (the sails repeat every 90 degrees)
  function bake(g) {
    const n = W * H, clean = () => { g.mask.fill(0); g.sa = 0; g.stack.length = 0; g.ox = g.oy = 0; };
    A.key(g, CX, 120, 1);
    g.buf.fill(C.night1); clean(); drawBG(g); BG = g.buf.slice(0, n);
    // the mid layer is drawn twice over different backgrounds; pixels that agree are solid, the rest see through
    g.buf.fill(C.night0); clean(); drawMid(g); const m1 = g.buf.slice(0, n);
    g.buf.fill(C.mist7); clean(); drawMid(g); const m2 = g.buf.slice(0, n);
    MID = m1; MIDM = new Uint8Array(n);
    for (let i = 0; i < n; i++) MIDM[i] = m1[i] === m2[i] ? 255 : 0;
    MID32 = new Uint32Array(MID.buffer, 0, n >> 2); MIDM32 = new Uint32Array(MIDM.buffer, 0, n >> 2);
    // the far windmill, fogged, as a list of pixels per angle
    MILL = [];
    for (let k = 0; k < NF; k++) {
      g.buf.set(BG); clean();
      A.windmill(g, 76, 128, 1, -k * (Math.PI / 2) / NF, { tone: 'night1', sail: 'night1', cloth: 0.3, lit: 0.8, t: 0, rim: 0 });
      fogDiff(g, BG, 30, 36, 124, 130, 0.05, 0.6, 'mist2');
      const idx = [], col = [];
      for (let y = 36; y < 130; y++) for (let x = 30; x < 124; x++) { const i = y * W + x; if (g.buf[i] !== BG[i]) { idx.push(i); col.push(g.buf[i]); } }
      MILL.push({ idx: Uint16Array.from(idx), col: Uint8Array.from(col) });
    }
    g.buf.set(BG); clean();
    A.key(g, CX - 160 + 160, 120 - 170 + 100, 1);
    const zk = { facing: 'right', shadow: false, glow: 0 };
    SPR = {
      bonnet: bakeSprite(g, 24, (gg, x, y, ts) => A.zombie(gg, x, y, { t: ts * 0.604, variant: 'bonnet', pose: 'stand', facing: 'right', height: 40, seed: 3, shadow: false, glow: 0 })),
      hat: bakeSprite(g, 24, (gg, x, y, ts) => A.zombie(gg, x, y, { t: ts * 0.604, variant: 'hat', pose: 'stand', facing: 'left', height: 40, seed: 4, shadow: false, glow: 0 })),
      plain: bakeSprite(g, 32, (gg, x, y, ts) => A.zombie(gg, x, y, { t: ts * 0.604, variant: 'plain', pose: 'walk', facing: 'right', height: 32, seed: 21, shadow: false, glow: 0 })),
      cheese: bakeSprite(g, 32, (gg, x, y, ts) => A.zombie(gg, x, y, { t: ts * 0.604, variant: 'cheese', pose: 'walk', facing: 'left', height: 30, seed: 22, shadow: false, glow: 0 })),
    };
    A.key(g, CX, 120, 1); g.buf.set(BG); g.mask.fill(0); g.sa = 0; g.stack.length = 0;
  }

  // ------------------------------------------------------------------ live pieces
  const TH0 = 0.45;                                   // swing amplitude (radians)
  const swing = t => Math.sin(Math.PI * (t - 0.2));   // -1..1; a strike (an extreme) lands at t = 0.7 + k
  function bell(g, t) {
    const px = CX, py = 65, th = Math.round(TH0 * swing(t) / 0.1) * 0.1, thc = TH0 * 1.25 * Math.sin(Math.PI * (t - 0.2) - 0.8);
    const sn = Math.sin(th), cs = Math.cos(th);
    const T = (u, v) => [px + u * cs + v * sn, py - u * sn + v * cs];
    const flat = a => a.reduce((r, p) => r.concat(T(p[0], p[1])), []);
    const Rr = [[2, 0], [2.2, 2], [3.2, 4], [3.8, 6.6], [4.6, 9], [6, 12]];
    const Ll = Rr.map(p => [-p[0], p[1]]);
    A.poly(g, flat(Rr.concat([[6, 12.8]], [[-6, 12.8]], Ll.slice().reverse())), 'amber5');
    A.poly(g, flat([[0, 0]].concat(Ll, [[-6, 12.8], [0, 12.8]])), 'amber6');
    for (let i = 0; i + 1 < Ll.length; i++) { const a = T(Ll[i][0] + 0.9, Ll[i][1] + 0.5), b = T(Ll[i + 1][0] + 0.9, Ll[i + 1][1] + 0.5); A.line(g, a[0], a[1], b[0], b[1], 'amber7'); }
    for (let i = 0; i + 1 < Rr.length; i++) { const a = T(Rr[i][0] - 0.5, Rr[i][1]), b = T(Rr[i + 1][0] - 0.5, Rr[i + 1][1]); A.line(g, a[0], a[1], b[0], b[1], 'amber3'); }
    const l0 = T(-6, 11), l1 = T(6, 11), m0 = T(-5.4, 12.8), m1 = T(5.4, 12.8);
    A.line(g, l0[0], l0[1], l1[0], l1[1], 'amber7'); A.line(g, m0[0], m0[1], m1[0], m1[1], 'amber2');
    const c = [px + 13.5 * Math.sin(thc), py + 13.5 * Math.cos(thc)]; A.disc(g, c[0], c[1], 1, 'amber6');
    const a = T(-4.5, -0.5), b = T(4.5, -0.5); A.line(g, a[0], a[1], b[0], b[1], 'wood3', 2); A.px(g, px, py - 1, 'night0');
  }
  // sound: dithered arcs ((( bell ))) that expand and thin out on every strike
  function rings(g, t) {
    const cx = CX, cy = 72;
    for (let n = 0; n < 2; n++) {
      const kk = Math.floor(t - 0.7) - n, age = t - (0.7 + kk), side = (kk & 1) ? 1 : -1;
      for (let j = 0; j < 3; j++) {
        const a = age - j * 0.14; if (a <= 0 || a > 1.6) continue;
        const lv0 = 1 - a / 1.6, r = 7 + a * 24;
        for (const sd of [-1, 1]) {
          const lv = Math.min(1, (sd === side ? lv0 : lv0 * 0.55) * 1.35), span = 0.6 + a * 0.15, base = sd > 0 ? 0 : Math.PI, steps = Math.ceil(r * span * 3.2);
          for (let i = 0; i <= steps; i++) {
            const an = base + (i / steps * 2 - 1) * span, x = rnd(cx + Math.cos(an) * r), y = rnd(cy + Math.sin(an) * r * 1.15);
            if (x >= 0 && y >= 0 && x < W && y < H && lv > BAY[((y & 3) << 2) | (x & 3)]) g.buf[y * W + x] = lv > 0.62 ? AMB[7] : lv > 0.34 ? AMB[6] : AMB[5];
          }
        }
      }
    }
  }
  // crows on the pinnacles, the weathercock and the belfry roof; each flock bursts off on its own strike
  const BIRDS = [   // perch x, y, flight dx, dy, flock
    [174, 38, 38, -22, 0], [177, 38, 46, -30, 0], [205, 38, -42, -24, 0],
    [CX + 3, 7, -40, -14, 1], [205, 39, -34, -30, 1], [174, 39, 44, -18, 1]];
  function birds(g, t) {
    BIRDS.forEach(([x, y, dx, dy, fl], i) => {
      const age = (((t - 0.7 - fl * 2) % 4) + 4) % 4;
      const s = age < 2 ? ease(age / 2) : age < 2.6 ? 1 : age < 3.6 ? 1 - ease((age - 2.6) / 1) : 0;
      if (s > 0.93) return;
      const bx = x + dx * s + Math.sin(s * 6 + i) * 2 * s, by = y + dy * s - Math.sin(s * Math.PI) * 5;
      if (s <= 0.01) { A.rect(g, bx - 1, by, 3, 2, 'night0'); A.px(g, bx + 1, by - 1, 'night0'); A.px(g, bx + 2, by, 'slate2'); return; }
      const up = (Math.floor(t * 7 + i) & 1) === 0;
      A.hline(g, bx - 1, by, 3, 'night0');
      if (up) { A.px(g, bx - 2, by - 1, 'night0'); A.px(g, bx + 2, by - 1, 'night0'); A.px(g, bx - 3, by - 2, 'night0'); A.px(g, bx + 3, by - 2, 'night0'); }
      else { A.px(g, bx - 2, by + 1, 'night0'); A.px(g, bx + 2, by + 1, 'night0'); A.px(g, bx - 3, by + 2, 'night0'); A.px(g, bx + 3, by + 2, 'night0'); }
    });
  }
  // the dead ringer in the doorway, hanging off the bell rope; the rope runs all the way up to the belfry
  function ringer(g, t) {
    const pull = swing(t), dip = Math.round(pull * 1.6), gy = BY, sw = Math.round(Math.sin(t * Math.PI) * 0.6);
    const pts = [[193, 68], [196, 86], [197 + sw, 100], [196, 109 + dip], [195, gy - 23 + dip]];
    for (let i = 0; i + 1 < pts.length; i++) A.line(g, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 'paper2');
    A.rect(g, 195, gy - 29 + dip, 1, 3, 'red4'); A.px(g, 195, gy - 28 + dip, 'paper4');   // the woollen sally
    // legs, hunched body, arms up on the rope, a small head thrust forward at us
    const c = 'night0';
    A.line(g, 188, gy - 11 + dip, 187, gy, c, 2); A.line(g, 191, gy - 11 + dip, 192, gy, c, 2);
    A.line(g, 189, gy - 11 + dip, 191, gy - 18 + dip, c, 3);
    A.line(g, 190, gy - 17 + dip, 195, gy - 23 + dip, c); A.line(g, 192, gy - 17 + dip, 196, gy - 20 + dip, c);
    A.rect(g, 190, gy - 22 + dip, 4, 4, c);
    const blink = (t * 1 + 0.3) % 3.4 < 0.12;
    if (!blink) { A.px(g, 190, gy - 21 + dip, 'eye4'); A.px(g, 193, gy - 21 + dip, 'eye3'); A.glow(g, 191.5, gy - 21 + dip, 4, { color: 'eye3', strength: 0.3, power: 1.4, q: 4 }); }
  }
  // the lit church windows flicker now and then
  function flicker(g, t) {
    const wins = [[106, 108, 8, 20], [130, 108, 8, 20], [154, 108, 8, 20], [214, 117, 7, 13], [232, 117, 7, 13]];
    wins.forEach(([x, y, w, h], i) => {
      const k = Math.floor(t * 6); if (hs(k, i + 40) < 0.07) { archFill(g, x, y, w, h, 'amber4'); A.vline(g, x + (w >> 1), y + 3, h - 3, 'brick1'); A.hline(g, x, y + (h >> 1), w, 'brick1'); }
    });
  }
  function flares(g, t) {   // the lantern flames breathe; the halo is live so it also lights the sky and the far town
    [[88, 146, 40], [262, 158, 46]].forEach(([lx, fy, h], i) => {
      const f = 0.5 + 0.5 * Math.sin(t * 5.2 + i * 2) * (hs(Math.floor(t * 4), i + 3) > 0.35 ? 1 : 0.3);
      glowAt(g, lx + 1, fy - h - 3, 13, 13, 2, { max: 7, sharp: 2.5, gain: 0.8 + 0.2 * f });
    });
  }
  // wet ground: pale glass with soft, irregular edges; the lit door and windows mirror in it as broken amber columns
  let LP = null;
  const pudCov = (cx, cy, rx, ry, seed) => (x, y) => {
    const dx = (x - cx) / rx, dy = (y - cy) / ry, wob = 1 + 0.14 * Math.sin(x * 0.31 + seed) + 0.1 * Math.sin(x * 0.9 + y * 0.5 + seed * 2);
    const d = Math.sqrt(dx * dx + dy * dy) * wob; return d >= 1 ? 0 : clamp((1 - d) / 0.22, 0, 1);
  };
  const REFL = [[183, 14, 110, 133], [106, 8, 108, 128], [130, 8, 108, 128], [154, 8, 108, 128], [214, 7, 117, 130], [232, 7, 117, 130]];
  let PUD = null;   // baked coverage 0..1 of every puddle, per pixel
  function bakePuddle(g, cx, cy, rx, ry, seed) {
    if (!LP) LP = A.lut('mix', 'mist2', 0.5);
    if (!PUD) PUD = new Float32Array(W * H);
    const buf = g.buf, cov = pudCov(cx, cy, rx, ry, seed);
    for (let yy = cy - ry; yy <= cy + ry; yy++) for (let xx = cx - rx; xx <= cx + rx; xx++) {
      const c = cov(xx, yy); if (c <= 0) continue;
      PUD[yy * W + xx] = Math.max(PUD[yy * W + xx], c);
      if (c > A.bayer(xx, yy)) buf[yy * W + xx] = LP[buf[yy * W + xx]];
    }
  }
  function puddle(g, t) {
    const buf = g.buf, cov = (x, y) => PUD[y * W + x];
    for (const [x0, w, top, bot] of REFL) {
      const door = w > 12, len = BY - top, mid = x0 + w / 2;
      for (let yy = BY + 2; yy < BY + 1 + len; yy++) {
        const d = yy - BY, sy = BY - d; if (sy > bot || sy < top) continue;
        if (hs(yy * 1.3 + x0, Math.floor(t * 2.5) + x0) < 0.1 + d / 80) continue;               // a ripple breaks the image
        const off = Math.sin(yy * 0.9 + t * 2.4 + x0) * 1.2 * (0.3 + d / 22), sc = 1 + d * 0.014;
        const step = Math.max(2, Math.min(6, (door ? 6 : 5) - Math.floor(d / 6))), fade = 1.15 - d / (len + 6);
        for (let xx = x0 - 2; xx < x0 + w + 2; xx++) {
          const px = rnd(xx + off), sx = clamp(rnd(mid + (xx - mid) * sc), 0, W - 1);
          const c = buf[sy * W + sx]; if (c < AMB[4] || c > AMB[8]) continue;                     // only lights mirror: the dark ringer leaves a gap
          if (px < 0 || px >= W || cov(px, yy) <= A.bayer(px, yy) * 0.9 || fade <= A.bayer(px, yy)) continue;
          buf[yy * W + px] = AMB[step];
        }
      }
    }
  }
  // ripple glints that catch the light on the wet ground
  function glints(g, t) {
    for (let i = 0; i < 10; i++) {
      const k = Math.floor(t * 2 + i * 0.37), x = 120 + rnd(hs(i + k * 3, 5) * 130), y = 139 + rnd(hs(i + k * 3, 6) * 22);
      if (hs(i, k) < 0.4) continue;
      A.hline(g, x, y, 1 + rnd(hs(i, 7) * 2), Math.abs(x - 190) < 12 ? 'amber5' : 'mist4');
    }
  }
  // the hero from behind, 26 px, orange jacket, his dog beside him
  const HERO = [
    '...HHHHH...', '..HHHHHHH..', '..HHHHHHh..', '..HHHHHHH..', '..sHHHHHs..', '...sSSSs...',
    '..oOOOOOo..', '.oOOOOOOOo.', 'oOOqOOOqOOo', 'oOqOOOOOqOo', 'oOqOOzOOqOo', 'oOqOOzOOqOo',
    'oOqOOzOOqOo', 'soqOOzOOqos', 'sSooooooSSs', '.qqqqqqqqq.', '..JJJJJJJ..', '..JJJjJJJ..',
    '..JJj.jJJ..', '..JJj.jJJ..', '..JJj.jJJ..', '..JJj.jJJ..', '..JJj.jJJ..', '..jjj.jjj..',
    '..KKK.KKK..', '..www.www..'];
  const HERO_C = { H: C.slate1, h: C.slate3, S: C.skin4, s: C.skin3, o: C.orange3, O: C.orange4, q: C.orange2, z: C.orange2, J: C.night5, j: C.night4, K: C.slate1, w: C.paper2 };
  const HERO_D = { H: C.slate0, h: C.slate1, S: C.orange1, s: C.orange1, o: C.orange1, O: C.orange2, q: C.orange0, z: C.orange0, J: C.night3, j: C.night2, K: C.slate0, w: C.slate1 };
  const HERO_REFL = HERO.slice().reverse().map((r, i) => i % 3 === 2 ? r.replace(/./g, '.') : r);
  function hero(g, x, y, t, reflect) {
    const P = A.pen(g, x, y, false);
    if (reflect) { P.map(-5, 1, HERO_REFL, HERO_D); return; }
    A.begin(g);
    const bob = Math.sin(t * 2.2 + 1) > 0.55 ? 1 : 0;
    P.map(-5, -20, HERO.slice(6), HERO_C);
    P.map(-5, -26 + bob, HERO.slice(0, 6), HERO_C);
    A.end(g, 2);
  }
  const walker = (g, t, name, x0, x1, y, ph) => {
    // a loop of 8 s: dissolve in, shamble toward the target, dissolve out
    const u = (((t / 8 + ph) % 1) + 1) % 1, a = Math.min(clamp(u / 0.18, 0, 1), clamp((1 - u) / 0.18, 0, 1));
    putSprite(g, SPR[name], Math.floor((((t / 8) % 1) + 1) % 1 * SPR[name].length), rnd(x0 + (x1 - x0) * u), y, a, t, name.length);
  };

  A.scenes.square = (g, t) => {
    const PR = window.__sqProf; let last = PR ? performance.now() : 0;
    const lap = n => { if (PR) { const now = performance.now(); PR[n] = (PR[n] || 0) + now - last; last = now; } };
    if (!BG) bake(g);
    A.key(g, CX, 120, 1);
    const buf = g.buf;
    buf.set(BG); lap('bg');
    // the far windmill, sails turning the right way (anticlockwise): half a turn every 8 s
    const mf = MILL[Math.floor((((t / 4) % 1) + 1) % 1 * NF)];
    for (let j = 0, n = mf.idx.length; j < n; j++) buf[mf.idx[j]] = mf.col[j];
    lap('mill');
    mist(g, t, 24, 130, 84, 34, 0.32, 2, 7, 'mist3', 0.5); lap('mist1');
    // the baked world over it: four pixels per step
    const b32 = new Uint32Array(buf.buffer, buf.byteOffset, buf.length >> 2);
    for (let i = 0, n = b32.length; i < n; i++) { const m = MIDM32[i]; if (m) b32[i] = (b32[i] & ~m) | (MID32[i] & m); }
    lap('mid');
    // church life
    bell(g, t); rings(g, t); birds(g, t); lap('bell'); ringer(g, t); flicker(g, t); flares(g, t); lap('ringer');
    mist(g, t, 0, W, 108, 34, 0.26, 3, 3, 'mist3', 0.35); lap('mist2');
    // wet ground
    puddle(g, t); glints(g, t);
    hero(g, 166, 175, t, true); lap('puddle');
    // the dead, drawn toward the bell: far ones in the mist, near ones turned to face the hero
    walker(g, t, 'plain', 58, 104, 152, 0.0);
    walker(g, t, 'cheese', 308, 272, 152, 0.5);
    lap('walkers');
    putSprite(g, SPR.bonnet, Math.floor((t / 8 % 1 + 1) % 1 * 24), 126, 162, 1, t, 3);
    putSprite(g, SPR.hat, Math.floor((t / 8 % 1 + 1) % 1 * 24), 222, 164, 1, t, 4);
    lap('zombies');
    mist(g, t, 0, W, 140, 30, 0.2, 4, 2, 'mist4', 0.3); lap('mist3');
    A.dog(g, 150, 177, { coat: 'golden', pose: 'sit', look: 'up', facing: 'right', t, shadow: false });
    hero(g, 166, 175, t, false); lap('hero');
  };
  // the shared night grade, last: the deepest darks lift into the concept art's blue-grey haze (NRART.grade)
  { const draw = A.scenes.square; A.scenes.square = (g, t) => { draw(g, t); A.grade(g); }; }
})();
