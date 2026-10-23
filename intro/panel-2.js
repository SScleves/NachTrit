// Panel 2: everyone had changed; they still split the bill, the women still taller.
// Key light: the amber lantern, upper left, over a cold blue night. The gag is one silhouette:
// a tall cold woman bent over a small orange man, her Tikkie screen throwing cyan onto his face,
// a second woman on his other side, a third screen aimed at him from the right.
// Layers (far is lightest and bluest): sky, church and mill in fog, far gables, canal and bridge,
// near houses (dark, almost no windows), pavement, the cast, the wet street.
// Loops: mill sails, Tikkie pings that the man glances at, lamp flicker on the rim light, sway, mist.
(function () {
  const A = window.NRART, hash = A.hash;


  // ---- fast local light and fog (the shared glow/haze are general; the same maths with tables, for the 3 ms budget)
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
  const LIGHT = new Uint8Array(256);
  ['amber4', 'amber5', 'amber6', 'amber7', 'amber8', 'eye2', 'eye3', 'eye4', 'phone2', 'phone3', 'phone4', 'phone5'].forEach(n => { LIGHT[A.C[n]] = 1; });
  const lvlMap = new Map(), powMap = new Map();
  function levels(mode, c, s, Q) {
    s = Math.round(s * 20) / 20; const k = mode + c + s + Q; let L = lvlMap.get(k);
    if (!L) { L = []; for (let q = 0; q <= Q; q++) L.push(A.lut(mode, c, s * q / Q)); lvlMap.set(k, L); }
    return L;
  }
  function falloff(pw) {
    let T = powMap.get(pw); if (!T) { T = new Float32Array(65); for (let i = 0; i < 65; i++) T[i] = Math.pow(1 - Math.sqrt(Math.min(1, i / 64)), pw); powMap.set(pw, T); }
    return T;
  }
  // radial light: like A.glow
  const DX2 = new Float32Array(400);
  function glow(g, x, y, r, ry, color, strength, pw, Q) {
    Q = Q || 4; const Ls = levels('add', color, strength, Q), T = falloff(pw), buf = g.buf, gw = g.w;
    const cx = Math.round(x) + g.ox, cy = Math.round(y) + g.oy;
    const x0 = Math.max(0, cx - r), x1 = Math.min(gw - 1, cx + r), y0 = Math.max(0, cy - ry), y1 = Math.min(g.h - 1, cy + ry);
    for (let xx = x0; xx <= x1; xx++) { const dx = (xx - cx) / r; DX2[xx] = dx * dx; }
    const iry = 1 / ry;
    for (let yy = y0; yy <= y1; yy++) {
      const dy = (yy - cy) * iry, dy2 = dy * dy; if (dy2 >= 1) continue;
      const lim = 1 - dy2, row = yy * gw, br = (yy & 3) << 2;
      for (let xx = x0; xx <= x1; xx++) {
        const d2 = DX2[xx] + dy2; if (d2 >= 1) continue;
        const v = T[(d2 * 64) | 0] * Q; let q = v | 0; if (v - q > BAYER[br | (xx & 3)]) q++;
        if (q > 0) { const i = row + xx; buf[i] = Ls[q > Q ? Q : q][buf[i]]; }
      }
    }
  }
  // drifting mist: like A.mist
  function mist(g, t, y, h, amt, sp, seed, color, lights, xa, xb) {
    const Q = 8, Ls = levels('mix', color, 1, Q), buf = g.buf, gw = g.w, cy0 = y + g.oy + h / 2;
    for (let xx = xa; xx < xb; xx++) {
      const sx = xx - g.ox + t * sp, n = A.wave(sx, gw, seed), n2 = A.wave(sx * 0.5 + 40, gw, seed + 3);
      const th = Math.max(0.5, h * (0.35 + 0.65 * n) / 2), cy = cy0 + (n2 - 0.5) * h * 0.5, a = amt * (0.55 + 0.45 * n);
      const r0 = Math.max(0, Math.ceil(cy - th)), r1 = Math.min(g.h - 1, Math.floor(cy + th));
      for (let yy = r0; yy <= r1; yy++) {
        const d = Math.abs(yy + 0.5 - cy) / th; if (d >= 1) continue;
        const i = yy * gw + xx, c = buf[i]; let lv = a * (1 - d * d); if (LIGHT[c]) lv *= lights;
        const v = lv * Q; let q = v | 0; if (v - q > BAYER[((yy & 3) << 2) | (xx & 3)]) q++;
        if (q > 0) buf[i] = Ls[q > Q ? Q : q][c];
      }
    }
  }
  // a downward light cone from (x, y): like A.cone at PI/2
  function coneDown(g, x, y, len, spread, color, strength, w0, fade) {
    const Q = 5, Ls = levels('add', color, strength, Q), buf = g.buf, gw = g.w, ax = Math.round(x) + g.ox + 0.5, ay = Math.round(y) + g.oy;
    for (let u = 0; u < len; u++) {
      const yy = ay + u; if (yy < 0 || yy >= g.h) continue;
      const half = w0 / 2 + u * spread, fd = Math.pow(1 - u / len, fade);
      for (let xx = Math.floor(ax - half); xx <= Math.ceil(ax + half); xx++) {
        if (xx < 0 || xx >= gw) continue;
        const e = 1 - Math.abs(xx + 0.5 - ax) / half; if (e <= 0) continue;
        const v = fd * (e >= 0.6 ? 1 : e / 0.6) * Q; let q = v | 0; if (v - q > BAYER[((yy & 3) << 2) | (xx & 3)]) q++;
        if (q > 0) { const i = yy * gw + xx; buf[i] = Ls[q > Q ? Q : q][buf[i]]; }
      }
    }
  }
  // a light cone at any angle, linear falloff: like A.cone
  function cone(g, x, y, ang, spread, len, color, strength, width) {
    const Q = 4, Ls = levels('add', color, strength, Q), ca = Math.cos(ang), sa = Math.sin(ang), tn = Math.tan(spread), w0 = width / 2;
    const ax = Math.round(x) + g.ox, ay = Math.round(y) + g.oy, hw = w0 + len * tn, ex = ax + ca * len, ey = ay + sa * len, buf = g.buf, gw = g.w;
    const xa = [ax - sa * w0, ax + sa * w0, ex - sa * hw, ex + sa * hw], ya = [ay + ca * w0, ay - ca * w0, ey + ca * hw, ey - ca * hw];
    const x0 = Math.max(0, Math.floor(Math.min(...xa))), x1 = Math.min(gw - 1, Math.ceil(Math.max(...xa))), y0 = Math.max(0, Math.floor(Math.min(...ya))), y1 = Math.min(g.h - 1, Math.ceil(Math.max(...ya)));
    for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) {
      const vx = xx + 0.5 - ax, vy = yy + 0.5 - ay, u = vx * ca + vy * sa; if (u < 0 || u > len) continue;
      const v = Math.abs(vy * ca - vx * sa), half = w0 + u * tn; if (v > half) continue;
      const e = 1 - v / half, lv = (1 - u / len) * (e >= 0.5 ? 1 : e * 2) * Q; let q = lv | 0; if (lv - q > BAYER[((yy & 3) << 2) | (xx & 3)]) q++;
      if (q > 0) { const i = yy * gw + xx; buf[i] = Ls[q > Q ? Q : q][buf[i]]; }
    }
  }
  // fog toward a colour, thickening down a vertical gradient; lit pixels keep most of themselves
  function haze(g, x, y, w, h, color, a0, a1, lights) {
    const Q = 8, Ls = levels('mix', color, 1, Q), buf = g.buf, gw = g.w;
    x = Math.round(x) + g.ox; y = Math.round(y) + g.oy;
    const x0 = Math.max(0, x), x1 = Math.min(gw, x + w);
    for (let yy = Math.max(0, y); yy < Math.min(g.h, y + h); yy++) {
      const a = a0 + (a1 - a0) * (yy - y + 0.5) / h, v = a * Q, vl = v * lights, o = yy * gw;
      for (let xx = x0; xx < x1; xx++) {
        const i = o + xx, c = buf[i], vv = LIGHT[c] ? vl : v; let q = vv | 0; if (vv - q > BAYER[((yy & 3) << 2) | (xx & 3)]) q++;
        if (q > 0) buf[i] = Ls[q > Q ? Q : q][c];
      }
    }
  }
  const PAPER = new Uint8Array(256), DIMPAPER = new Uint8Array(256);
  for (let k = 2; k <= 6; k++) { PAPER[A.C['paper' + k]] = 1; DIMPAPER[A.C['paper' + k]] = A.step(A.C['paper' + k], -2); }

  // A house as a silhouette: body, gable, a grid of dark windows. Cheap on purpose, and cached with its layer.
  // o.lit lists [col, row] windows that will glow; their positions go to o.out for the live pass.
  function house(g, x, y, w, h, gable, o) {
    const base = o.base, trim = o.trim, glass = o.glass;
    const gh = Math.round(gable === 'roof' ? Math.min(h * 0.34, w * 0.6) : Math.min(h * 0.36, w * 0.9)), by = y - h + gh, cx = x + w / 2;
    A.begin(g);
    A.rect(g, x, by, w, y - by, base);
    if (gable === 'step') {
      const n = 3, sw = Math.max(2, Math.floor(w / 8)), sh = gh / n;
      for (let i = 0; i < n; i++) A.rect(g, x + (i + 1) * sw, Math.round(by - (i + 1) * sh), w - 2 * (i + 1) * sw, Math.ceil(sh) + 1, base);
    } else if (gable === 'bell') {
      A.poly(g, [x, by, x + w * 0.2, by - gh * 0.35, x + w * 0.3, by - gh * 0.78, cx - 2, by - gh, cx + 2, by - gh, x + w * 0.7, by - gh * 0.78, x + w * 0.8, by - gh * 0.35, x + w, by], base);
    } else if (gable === 'spout') {
      A.poly(g, [x, by, x + w, by, x + w * 0.62, by - gh, x + w * 0.38, by - gh], base);
    } else if (gable === 'neck') {
      A.rect(g, x + w * 0.22, by - gh * 0.6, w * 0.56, gh * 0.6, base);
      A.poly(g, [x + w * 0.22, by - gh * 0.6, x + w * 0.78, by - gh * 0.6, cx, by - gh], base);
    } else {
      A.poly(g, [x - 1, by, x + w + 1, by, cx, by - gh], base);
      A.rect(g, x + w * 0.68, by - gh * 0.7, 3, 6, base);
    }
    A.hline(g, x, by, w, trim);
    const ww = 4, wh = 6, cols = Math.max(1, Math.floor((w - 3) / 7)), gw = cols * ww + (cols - 1) * 3, x0 = x + Math.round((w - gw) / 2);
    const rows = Math.max(1, Math.floor((y - by - 16) / 10));
    if (!o.bare) for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const wx = x0 + c * 7, wy = by + 4 + r * 10;
      A.rect(g, wx, wy, ww, wh, glass); A.hline(g, wx - 1, wy + wh, ww + 2, trim);
    }
    A.rect(g, x, y - 3, w, 3, o.plinth);
    A.end(g, 1);
    if (o.fog) haze(g, x, by + 1, w, y - by - 1, 'mist2', o.fog(by + 1), o.fog(y), 0.3);
    (o.lit || []).forEach(l => {
      const wx = x0 + l[0] * 7, wy = by + 4 + l[1] * 10;
      if (l[2]) { o.out.push([wx, wy]); return; }
      A.window(g, wx, wy, ww, wh, { lit: 0.9, frame: trim, glow: 0, sill: false, bars: 'cross' });
      glow(g, wx + 2, wy + 3, 9, 9, 'amber5', 0.3, 1.2);
    });
  }

  // Static layers are drawn once per camera offset into a scratch surface, on two different backgrounds;
  // a pixel that comes out the same on both belongs to the layer (opaque). The live frame pastes those.
  const layers = new Map();
  function scratch(g, camX) {
    const s = A.surface(g.w, g.h); s.camX = camX == null ? g.camX : camX; s.camY = 0; s.keyX = 40; s.keyY = 90; s.rimK = 1; return s;
  }
  // A still layer is drawn once, 16 px wider than the frame (so a camera shift never shows an edge), with the camera
  // at rest, on two different backgrounds; a pixel that comes out the same on both belongs to the layer (opaque).
  // The live frame pastes those, shifted by the layer's share of the camera drift.
  const PAD = 8, LW = 320 + 2 * PAD;
  function layer(key, draw) {
    let c = layers.get(key); if (c) return c;
    const mk = bg => { const s = A.surface(LW, 180); s.keyX = 40 + PAD; s.keyY = 90; s.rimK = 1; s.buf.fill(bg); draw(s); return s; };
    const s1 = mk(1), s2 = mk(2), a = s1.buf, b = s2.buf, runs = [];
    for (let y = 0; y < 180; y++) {
      let x = 0; const o = y * LW;
      while (x < LW) { while (x < LW && a[o + x] !== b[o + x]) x++; if (x >= LW) break; const st = x; while (x < LW && a[o + x] === b[o + x]) x++; runs.push(o + st, o + x); }
    }
    c = { a, runs }; layers.set(key, c); return c;
  }
  function paste(g, c, d) {
    const buf = g.buf, a = c.a, r = c.runs, w = g.w, dx = Math.round(-g.camX * d) - PAD;
    for (let k = 0; k < r.length; k += 2) {
      const s0 = r[k], y = (s0 / LW) | 0, lx = s0 - y * LW, len = r[k + 1] - s0, row = y * w;
      let x0 = lx + dx, x1 = x0 + len, from = s0;
      if (x0 < 0) { from -= x0; x0 = 0; } if (x1 > w) x1 = w;
      if (x1 <= x0) continue;
      if (x1 - x0 > 40) buf.set(a.subarray(from, from + x1 - x0), row + x0); else for (let i = 0; i < x1 - x0; i++) buf[row + x0 + i] = a[from + i];
    }
  }
  // Far shapes are drawn in two marker colours, then repainted as a darker copy of the sky behind them:
  // distance as a soft silhouette that is lighter toward the horizon, with no fog dither on it.
  const MARK0 = A.C.paper0, MARK1 = A.C.paper1, FAR0 = A.lut('mix', 'night0', 0.42), FAR1 = A.lut('mix', 'night0', 0.3);
  function farTone(buf, under, x0, y0, x1, y1) {
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const i = y * 320 + x, c = buf[i];
      if (c === MARK0) buf[i] = FAR0[under[i]]; else if (c === MARK1) buf[i] = FAR1[under[i]];
    }
  }
  // the sky and the far town, drawn once per far offset (sky is still; stars twinkle on top)
  let skyCache = null;
  function backdrop(g) {
    const key = 'bg' + Math.round(-g.camX * 0.15);
    let c = layers.get(key); if (c) return c;
    const s = scratch(g);
    if (!skyCache) {
      A.depth(s, 0);
      A.sky(s, ['night0', 'night1', 'night2', 'night3', 'night4', 'mist0', 'mist1', 'mist2'], 0, 128);
      A.moon(s, 262, 26, 6, { halo: 0.25 });
      skyCache = s.buf.slice();
    } else s.buf.set(skyCache);
    A.depth(s, 0.15);
    for (let x = 136; x < 280; x += 5) A.disc(s, x, 119 - Math.round(hash(x, 2) * 3), 2 + Math.round(hash(x, 3) * 2), 'paper0');
    A.rect(s, 136, 119, 144, 13, 'paper0');
    A.church(s, 226, 131, 1, { tone: 'paper0', rim: 0 });
    farTone(s.buf, skyCache, 0, 0, s.w, s.h);
    A.depth(s, 1); glow(s, 152, 124, 50, 30, 'mist4', 0.26, 1.2, 3);
    c = { a: s.buf }; layers.set(key, c); return c;
  }

  const MIDLIT = [], NEARLIT = [];
  const LIFT = s => { s.ox = PAD; glow(s, 152, 124, 50, 30, 'mist4', 0.26, 1.2, 3); };   // the lift behind the figures
  const D = (s, d) => { A.depth(s, d); s.ox = PAD; s.oy = 0; };
  function midBank(s) {
    D(s, 0.4);
    [[150, 28, 56, 'bell'], [178, 26, 44, 'step'], [204, 22, 38, 'roof']].forEach(([x, w, h, gb]) =>
      house(s, x, 130, w, h, gb, { base: 'night4', trim: 'night5', glass: 'night3', plinth: 'night3', bare: true }));
    D(s, 0.65);
    A.rect(s, 136, 130, 144, 4, 'night3');
    bridge(s, 172, 134, 84, 9, 'night3', 'night4');
    FAR.forEach(([lx, lh]) => { A.vline(s, lx, 130 - lh, lh, 'night4'); A.rect(s, lx - 1, 129 - lh, 3, 2, 'amber6'); });
    LIFT(s);
  }
  function nearStreet(s) {
    D(s, 0.85);
    NEARLIT.length = 0;
    const NEAR = { base: 'night2', trim: 'night4', glass: 'night0', plinth: 'night1', fog: y => 0.05 + 0.5 * Math.max(0, Math.min(1, (y - 50) / 96)), out: NEARLIT };
    house(s, -16, 146, 38, 98, 'bell', NEAR);
    house(s, 22, 146, 34, 104, 'step', Object.assign({ lit: [[0, 7]] }, NEAR));
    house(s, 56, 146, 30, 90, 'spout', NEAR);
    house(s, 86, 146, 36, 100, 'roof', Object.assign({ lit: [[2, 1], [3, 2]] }, NEAR));
    house(s, 122, 146, 30, 96, 'step', Object.assign({ lit: [[1, 1], [2, 3, true]] }, NEAR));
    house(s, 270, 146, 36, 92, 'neck', Object.assign({ lit: [[1, 2]] }, NEAR));
    house(s, 306, 146, 34, 100, 'bell', NEAR);
    D(s, 1);
    A.rect(s, -20, 147, 360, 8, 'slate3'); A.hline(s, -20, 147, 360, 'slate5'); A.hline(s, -20, 154, 360, 'slate1');
    for (let x = -20; x < 340; x += 9) A.vline(s, x + ((x / 9) & 1) * 4, 148, 6, 'slate2');
    A.rect(s, -20, 155, 360, 25, 'slate0');
    A.ditherGradient(s, -20, 155, 360, 12, 'slate1', 'slate0', 'down');
    LAMPS.forEach(([x, seed]) => A.lamp(s, x, 153, { style: 'lantern', h: 46, seed, light: false }));
    A.tulips(s, 6, 147, 14, { t: 0 }); A.tulips(s, 302, 147, 14, { t: 0, seed: 5 });
    A.bollard(s, 78, 153); A.bollard(s, 238, 153);
    A.omafiets(s, 272, 153, { facing: 'left', rim: 1 });
    const bid = s.sn, DK = A.lut('mix', 'night0', 0.55);   // a parked bike in the dark: a shape, not a prize
    for (let y = 120; y < 156; y++) for (let x = 240 + PAD; x < 300 + PAD; x++) { const i = y * LW + x; if (s.mask[i] === bid) s.buf[i] = DK[s.buf[i]]; }
    LIFT(s);
  }
  const LAMPS = [[40, 1], [292, 2]];
  const FAR = [[158, 25], [186, 20], [214, 16], [240, 13]];

  // A lamp's reflection on wet asphalt: a straight bright pillar that thins, breaks and fades with a Bayer dither.
  function pillar(g, x, y, len, w, t, seed, k, colors) {
    for (let r = 0; r < len; r++) {
      const f = 1 - r / len, brk = Math.sin(r * 1.7 + t * 2.4 + seed * 2) > 0.62 - f * 0.5, ww = f > 0.55 ? w : Math.max(1, w - 2), off = Math.round(Math.sin(r * 0.8 + t * 2 + seed) * 0.6);
      if (brk && r > 3) continue;
      const c = colors[Math.min(colors.length - 1, Math.floor((1 - f) * colors.length))];
      for (let i = 0; i < ww; i++) {
        const xx = x - (ww >> 1) + i + off;
        if (f * k * 1.3 > A.bayer(xx, y + r)) A.px(g, xx, y + r, c);
      }
    }
  }

  // The far bridge: a silhouette with an arch and a railing (no brick texture; it is in fog)
  function bridge(g, x, y, w, h, base, rail) {
    const ry = h * 0.82, rx = w * 0.32;
    for (let i = 0; i < w; i++) {
      const dx = (i + 0.5 - w / 2) / rx, hump = Math.round(Math.max(0, 1 - Math.pow((i + 0.5 - w / 2) / (w / 2), 2)) * 3);
      const top = y - h - hump, ab = Math.abs(dx) < 1 ? Math.round(y - ry * Math.sqrt(1 - dx * dx)) : y;
      A.vline(g, x + i, top, ab - top, base);
      if (i % 3 === 0) A.vline(g, x + i, top - 5, 5, rail);
      A.px(g, x + i, top - 5, rail);
    }
  }

  const UNDER = new Uint8Array(320 * 140);
  let bubble = null;      // the speech bubble's size, measured once
  A.panels[1] = {
    text: 'By morning everyone had changed. Two things had not: they still split the bill, and the women were still taller than him.',
    nl: 'De volgende ochtend was iedereen veranderd. Twee dingen niet: ze deelden de rekening nog steeds, en de vrouwen waren nog steeds langer dan hij.',
    draw(g, t) {
      A.camera(g, t, { x: -6, period: 8 });
      const dip = hash(Math.floor(t * 9), 3) < 0.2;            // the left lantern stutters; the rim light follows it
      A.key(g, 40, 90, dip ? 1 : 2);

      // ---- sky, the far town and the mid fog: still, drawn once per camera offset. Stars twinkle only where the sky shows.
      const bg = backdrop(g);
      g.buf.set(bg.a); g.mask.fill(0);
      A.depth(g, 0);
      for (let i = 0; i < 34; i++) {
        const x = Math.floor(hash(i, 7) * 320), y = 4 + Math.floor(hash(i, 8) * 66), b = hash(i, 9), tw = Math.sin(t * (0.8 + 2.4 * hash(i, 10)) + i * 1.7);
        if (tw < -0.55 || g.buf[y * 320 + x] !== skyCache[y * 320 + x]) continue;
        A.px(g, x, y, b > 0.9 ? 'paper6' : b > 0.55 && tw >= 0 ? 'mist6' : 'mist4');
      }
      // ---- far: the mill turns anticlockwise, fogged with the same fog as the town behind it
      A.depth(g, 0.15);
      UNDER.set(g.buf.subarray(0, 320 * 140)); const under = UNDER;
      A.windmill(g, 254, 131, 0.95, -t * 0.5, { tone: 'paper0', sail: 'paper0', cloth: 0.6, t, seed: 3, lit: 0.3, rim: 0 });
      farTone(g.buf, under, 210, 36, 300, 134);

      // ---- mid gables, the canal bank and the arched bridge (still), then the live canal: lamps, a walker, water
      paste(g, layer('mid', midBank), 0.5);
      A.depth(g, 0.65);
      A.zombie(g, 214, 125, { variant: 'hat', t: t + 2.3, height: 12, pose: 'walk', tone: 'night3', seed: 9 });
      FAR.forEach(([lx, lh], k) => {
        glow(g, lx, 130 - lh + 1, 12 - k * 2, 12 - k * 2, 'amber5', 0.4 - k * 0.04, 1.5);
        coneDown(g, lx, 131 - lh, lh - 1, 0.45, 'amber4', 0.22, 2, 0.8);
      });
      A.water(g, 136, 134, 144, 12, { t, amp: 0.6, dark: 0.35, color: 'night3', glints: 0 });
      FAR.forEach(([lx], k) => A.streak(g, lx, 135, 10 - k, { t, color: 'amber5', strength: 0.55, seed: k + 3, width: 2 }));

      // ---- near houses (dark, cold, six lit windows) and the flat dark street, still
      paste(g, layer('near', nearStreet), 0.95);
      A.depth(g, 0.85);
      NEARLIT.forEach(([wx, wy]) => {       // the window behind the man's head is live: it stutters like the lamp
        A.window(g, wx, wy, 4, 6, { lit: dip ? 0.5 : 0.9, frame: 'night4', glow: 0, sill: false, bars: 'cross' });
        glow(g, wx + 2, wy + 3, 9, 9, 'amber5', dip ? 0.15 : 0.3, 1.2);
      });
      A.depth(g, 1);
      const lamp = (x, k, cone) => {         // the lamps are in the still layer; their light and the stutter are live
        const lx = x + 1, ly = 104;
        if (k < 1) { A.rect(g, lx - 3, ly - 3, 6, 6, 'amber4'); A.rect(g, lx - 1, ly - 2, 2, 5, 'slate1'); }
        glow(g, lx, ly, 14, 14, 'amber6', 0.55 * k, 1.6);
        coneDown(g, lx, ly + 2, 53, 0.447, 'amber5', cone * k, 4, 0.6);
        glow(g, lx, 153, 32, 3, 'amber5', 0.35 * k, 1);
        return [lx, ly];
      };
      const l1 = lamp(40, dip ? 0.35 : 1, 0.35), l2 = lamp(292, 1, 0.3);

      // ---- a pale fog band and a lift behind the figures, so they read as dark shapes
      mist(g, t, 108, 36, 0.42, 4, 2, 'mist4', 0.5, 56, 262);

      // ---- the cast
      const sway = k => Math.round(Math.sin(t * 0.8 + k * 2.1) * 0.7);
      const ping = Math.floor(t / 1.5) % 3, pt = t % 1.5, flash = pt < 0.3;
      const on = k => flash && ping === k;
      const z1 = A.zombie(g, 121 + sway(0), 153, { variant: 'bonnet', t, seed: 2, phone: true, height: 72, hunch: 0.3, shirt: 'night4', pants: 'night3' });
      // dim the bonnet and apron a little, so white does not outshine the orange
      const zid = g.sn;
      for (let yy = 60; yy < 153; yy++) for (let xx = 100; xx < 140; xx++) {
        const i = yy * g.w + xx;
        if (g.mask[i] === zid) { const c = g.buf[i]; if (PAPER[c]) g.buf[i] = DIMPAPER[c]; }
      }
      const z2 = A.zombie(g, 207 + sway(2), 153, { variant: 'phone', t, seed: 5, facing: 'left', height: 56, shirt: 'night4' });
      // the tall woman: 70 px against his 40. Her own arm is drawn here, so the phone hangs at his head, not at her face.
      const WH = 80, WX = 160 + sway(1), WSEED = 8, WHUNCH = 0.25;
      const w = A.tallWoman(g, WX, 153, { t, facing: 'left', seed: WSEED, phone: false, height: WH, hunch: WHUNCH, shirt: 'teal2' });
      const wa = 0.08 + WHUNCH * 0.7 + Math.sin(t * 1.3 + WSEED * 1.7) * 0.04, wLeg = Math.round(WH * 0.42), wTor = Math.round(WH * 0.34);
      const wsx = WX - Math.round(Math.sin(wa) * wTor) - 1, wsy = 153 - wLeg - Math.round(Math.cos(wa) * wTor);
      const wh = [wsx - 3, wsy + 16], we = [wsx + 5, wsy + 14];
      A.line(g, wsx, wsy + 2, we[0], we[1], 'teal4', 2); A.line(g, we[0], we[1], wh[0], wh[1], 'teal5', 2);
      A.rect(g, wh[0] - 1, wh[1] - 1, 3, 3, 'zombie6');
      w.hand = [wh[0], wh[1] - 2];
      const manX = 148, manTop = 153 - 40 + (Math.sin(t * 2.2 + 1) > 0.55 ? 1 : 0);
      A.man(g, manX, 153, { t, facing: 'front', face: flash ? 'worry' : 'deadpan' });

      // local phones, 4x6, aimed at the man, with a Tikkie bar
      const phone = (hx, hy, lit) => {
        A.rect(g, hx - 2, hy - 3, 4, 6, 'slate0');
        A.rect(g, hx - 1, hy - 2, 2, 4, lit ? 'phone5' : 'phone3');
        A.hline(g, hx - 1, hy - 2, 2, 'phone5');
        A.px(g, hx - 1, hy, 'phone4'); A.px(g, hx, hy + 1, lit ? 'phone4' : 'phone2');
      };
      const P = [[z1.hand[0] + 1, z1.hand[1] - 2], [w.hand[0], w.hand[1] - 2], [z2.hand[0], z2.hand[1] - 2]];
      P.forEach(([hx, hy], k) => {
        const ang = Math.atan2(manTop + 8 - hy, manX - hx);
        cone(g, hx, hy, ang, 0.28, 32, 'phone2', on(k) ? 0.45 : 0.28, 3);
        glow(g, hx + Math.cos(ang) * 3, hy + Math.sin(ang) * 3, 9, 8, 'phone2', on(k) ? 0.6 : 0.3, 1.6);
        phone(hx, hy, on(k));
      });
      // cyan on the man's hair and brow from above; on the zombies' faces from below
      for (let dx = -3; dx <= 2; dx++) A.px(g, manX + dx, manTop, 'phone2');
      for (let dx = 0; dx <= 3; dx++) A.px(g, manX + dx, manTop + 1, flash ? 'phone3' : 'phone2');
      A.px(g, manX + 3, manTop + 2, 'phone2'); A.px(g, manX + 1, manTop + 3, 'phone3'); A.px(g, manX + 2, manTop + 3, 'phone3'); A.px(g, manX + 2, manTop + 4, 'phone3');
      [z1.head, w.head, z2.head].forEach(h => glow(g, h[0], h[1] + 6, 6, 5, 'phone2', 0.25, 1.4));
      // the man glances toward whichever phone just pinged
      if (pt > 0.15 && pt < 0.7) {
        const bob = Math.sin(t * 2.2 + 1) > 0.55 ? 1 : 0, ey = 153 - 40 + 6 + bob, dir = ping === 0 ? -1 : 1;
        A.px(g, manX - 2, ey, 'skin4'); A.px(g, manX + 1, ey, 'skin4');
        A.px(g, manX - 2 + dir, ey, 'slate0'); A.px(g, manX + 1 + dir, ey, 'slate0');
      }
      // the lantern's stutter, felt on the cast
      glow(g, 124, 138, 48, 22, 'amber5', dip ? 0.08 : 0.2, 1.4, 3);

      // ---- wet street: dark mirror under the cast, strong lamp pillars, the man's orange, three cyan pinpoints
      A.water(g, -20, 155, 360, 22, { t, amp: 0.5, dark: 0.62, color: 'slate0', gaps: 0.1, glints: 0, stretch: 1.3 });
      const AMB = ['amber7', 'amber6', 'amber5', 'amber4', 'amber3'];
      pillar(g, l1[0], 156, 24, 4, t, 1, dip ? 0.6 : 1, AMB); pillar(g, l2[0], 156, 24, 4, t, 2, 1, AMB);
      pillar(g, manX, 157, 14, 3, t, 5, 0.7, ['orange5', 'orange4', 'orange3', 'orange2']);
      P.forEach(([hx], k) => pillar(g, hx, 156, 16, 1, t, 6 + k, on(k) ? 1.2 : 0.8, ['phone5', 'phone4', 'phone3', 'phone2']));

      // ---- one bubble, over the man, from the woman's phone
      if (!bubble) bubble = Math.ceil(A.textWidth('Tikkie: €4,50', 7, true)) + 8;
      const bw = bubble, bh = 12, bx = Math.max(2, Math.min(A.W - bw - 2, w.head[0] - bw / 2 - 12)), by = w.head[1] - 6 - bh;
      A.bubble(g, bx, by, bw, bh, { text: 'Tikkie: €4,50', tail: [w.head[0], w.head[1] - 1] });
    },
  };
})();
