// Level intro scene "dyke" (polder borrows it): the dyke road at night, the mills across the river.
//
// The picture is a section through a Dutch dyke, seen from the polder: we stand low, in the fields.
// Above us the crown road runs left to right and narrows into the fog. Behind it the river lies
// HIGHER than the land we stand on (that is the whole joke of a polder). Across the river a big
// stellingmolen, a smaller mill, a barge and a hamlet fade into fog. Below the crown, on our side,
// the grass slope drops to the roofs of the dyke houses ("Ten houses on the dyke").
// Key light: the moon, upper left. Warm light: one lantern on the river kerb, the postman's lamp,
// the lit windows. Focal point: the postman on his omafiets (drawn in right profile, riding toward
// the big mill) and the tall dead man waiting in his headlight.
// Loops: mill sails, river shimmer, mist, clouds, lantern flicker, reeds, the basket dog's ear.
//
// Cost: the still parts of the picture (sky, far banks, mill towers, the dyke, the houses) are drawn
// once per camera position and kept as pixel snapshots; each frame blits them and draws only what moves.
(function () {
  const A = window.NRART;
  const W = 320, SH = 180, HZ = 99, WATER_Y = HZ + 3, SENT = 255;
  const hash = A.hash, bay = A.bayer;
  const K = {}; const k = n => K[n] || (K[n] = A.col(n));
  let LUM = null;
  const lum = () => {
    if (LUM) return LUM;
    LUM = new Int16Array(256);
    for (let i = 0, n = A.paletteSize(); i < n; i++) { const c = A.rgb(i); LUM[i] = c[0] * 3 + c[1] * 5 + c[2] * 2; }
    return LUM;
  };
  const fe = x => 127 - (x + 20) * 0.0222;          // the river edge of the crown (far side)
  const ne = x => 172 - (x + 20) * 0.108;           // the polder edge of the crown (near side)
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const rd = Math.round;

  // ================= local drawing helpers: they write palette indices straight into the surface
  /** rows y0..y1-1 blend from colour a to b, dithered */
  function rowGrad(g, y0, y1, a, b) {
    for (let y = y0; y < y1; y++) {
      const lv = (y - y0 + 0.5) / (y1 - y0), o = y * W;
      if (lv < 0.05) g.buf.fill(a, o, o + W);
      else if (lv > 0.95) g.buf.fill(b, o, o + W);
      else for (let x = 0; x < W; x++) g.buf[o + x] = lv > bay(x, y) ? b : a;
    }
  }
  /** a sky in flat bands with short dithered seams */
  function bands(g, stops, seam) {
    for (let i = 0; i < stops.length - 1; i++) {
      const y0 = stops[i][0], y1 = stops[i + 1][0], a = k(stops[i][1]), b = k(stops[i + 1][1]), s = Math.min(seam, y1 - y0);
      g.buf.fill(a, y0 * W, (y1 - s) * W);
      rowGrad(g, y1 - s, y1, a, b);
    }
  }
  /** a dithered radial patch that only ever lightens: ramp runs low to high */
  function patch(g, cx, cy, rx, ry, ramp, pw) {
    const n = ramp.length, buf = g.buf, L = lum(); cx += g.ox;
    const x0 = Math.max(0, Math.floor(cx - rx)), x1 = Math.min(W - 1, Math.ceil(cx + rx)), y0 = Math.max(0, Math.floor(cy - ry)), y1 = Math.min(SH - 1, Math.ceil(cy + ry));
    for (let y = y0; y <= y1; y++) {
      const dy = (y - cy) / ry, dy2 = dy * dy; if (dy2 >= 1) continue;
      for (let x = x0; x <= x1; x++) {
        const dx = (x - cx) / rx, d2 = dx * dx + dy2; if (d2 >= 1) continue;
        let lv = 1 - d2; if (pw > 1) lv *= lv;
        const s = lv * n; let q = s | 0; if (s - q > bay(x, y)) q++;
        if (q > 0) { const c = ramp[(q > n ? n : q) - 1], i = y * W + x; if (L[buf[i]] < L[c]) buf[i] = c; }
      }
    }
  }
  /** one horizontal dash, optionally dithered against what is there */
  function dash(g, x, y, w, c, lv) {
    x = rd(x + g.ox); y = rd(y);
    if (y < 0 || y >= SH) return;
    for (let i = Math.max(0, x), e = Math.min(W, x + w); i < e; i++) if (lv >= 1 || lv > bay(i, y)) g.buf[y * W + i] = c;
  }
  // light and shade by lookup, cheaper than the shared glow and cone (no pow, no closures)
  const LV = new Map();
  function levels(mode, color, s, Q) {
    s = Math.round(s * 20) / 20; const key = mode + color + s + Q; let L = LV.get(key);
    if (!L) { L = []; for (let q = 0; q <= Q; q++) L.push(A.lut(mode, color, s * q / Q)); LV.set(key, L); }
    return L;
  }
  function glow(g, cx, cy, rx, ry, color, s, Q, mode) {
    const Ls = levels(mode || 'add', color, s, Q), buf = g.buf; cx += g.ox;
    const x0 = Math.max(0, Math.floor(cx - rx)), x1 = Math.min(W - 1, Math.ceil(cx + rx)), y0 = Math.max(0, Math.floor(cy - ry)), y1 = Math.min(SH - 1, Math.ceil(cy + ry));
    for (let y = y0; y <= y1; y++) {
      const dy = (y + 0.5 - cy) / ry, dy2 = dy * dy; if (dy2 >= 1) continue;
      for (let x = x0; x <= x1; x++) {
        const dx = (x + 0.5 - cx) / rx, d2 = dx * dx + dy2; if (d2 >= 1) continue;
        let l = 1 - d2; l *= l;
        const v = l * Q; let q = v | 0; if (v - q > bay(x, y)) q++;
        if (q > 0) { const i = y * W + x; buf[i] = Ls[q > Q ? Q : q][buf[i]]; }
      }
    }
  }
  function cone(g, ax, ay, ang, tn, len, w0, color, s, Q) {
    const Ls = levels('add', color, s, Q), buf = g.buf, ca = Math.cos(ang), sa = Math.sin(ang); ax += g.ox;
    const hw = w0 / 2 + len * tn, ex = ax + ca * len, ey = ay + sa * len;
    const x0 = Math.max(0, Math.floor(Math.min(ax, ex) - hw)), x1 = Math.min(W - 1, Math.ceil(Math.max(ax, ex) + hw));
    const y0 = Math.max(0, Math.floor(Math.min(ay, ey) - hw)), y1 = Math.min(SH - 1, Math.ceil(Math.max(ay, ey) + hw));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const vx = x + 0.5 - ax, vy = y + 0.5 - ay, u = vx * ca + vy * sa; if (u < 0 || u > len) continue;
      const v = Math.abs(vy * ca - vx * sa), half = w0 / 2 + u * tn; if (v > half) continue;
      const e = 1 - v / half, l = (1 - u / len) * (e >= 0.5 ? 1 : e * 2), val = l * Q; let q = val | 0; if (val - q > bay(x, y)) q++;
      if (q > 0) { const i = y * W + x; buf[i] = Ls[q > Q ? Q : q][buf[i]]; }
    }
  }
  /** darken by ramp steps, dithered by level (0..1): the corner vignettes */
  let DN = null;
  function darken(g, x0, y0, x1, y1, fn) {
    if (!DN) DN = [1, 2, 3].map(s => { const t = new Uint8Array(256); for (let i = 0; i < 256; i++) t[i] = A.step(i, -s); return t; });
    for (let y = Math.max(0, y0); y < Math.min(SH, y1); y++) for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) {
      const v = fn(x, y) * 2.4; if (v <= 0) continue; let q = v | 0; if (v - q > bay(x, y)) q++;
      if (q > 0) { const i = y * W + x; g.buf[i] = DN[(q > 3 ? 3 : q) - 1][g.buf[i]]; }
    }
  }

  // drifting mist (the shared one, with its waves tabulated: one lookup per column instead of six sines)
  let LIT = null;
  const WV = new Map();
  function waves(seed) {
    let v = WV.get(seed); if (v) return v;
    v = { a: new Float32Array(320), b: new Float32Array(640) };
    for (let i = 0; i < 320; i++) v.a[i] = A.wave(i, 320, seed);
    for (let i = 0; i < 640; i++) v.b[i] = A.wave(i * 0.5 + 40, 320, seed + 3);
    WV.set(seed, v); return v;
  }
  function mist(g, t, y, h, amt, sp, seed, color) {
    if (!LIT) { LIT = new Uint8Array(256); A.RAMPS.amber.slice(4).concat(A.RAMPS.eye.slice(2), A.RAMPS.phone.slice(2)).forEach(i => { LIT[i] = 1; }); }
    const Ls = levels('mix', color, 1, 8), wv = waves(seed), buf = g.buf, cy0 = y + h / 2, sh = Math.floor(t * sp);
    for (let x = 0; x < W; x++) {
      const si = ((x - g.ox + sh) % 640 + 640) % 640, n = wv.a[si % 320], n2 = wv.b[si];
      const th = Math.max(0.5, h * (0.35 + 0.65 * n) / 2), cy = cy0 + (n2 - 0.5) * h * 0.5;
      const r0 = Math.max(0, Math.ceil(cy - th)), r1 = Math.min(SH - 1, Math.floor(cy + th)), base = amt * (0.55 + 0.45 * n);
      for (let yy = r0; yy <= r1; yy++) {
        const d = Math.abs(yy + 0.5 - cy) / th; if (d >= 1) continue;
        const i = yy * W + x, c = buf[i];
        let lv = base * (1 - d * d); if (LIT[c]) lv *= 0.3;
        const v = lv * 8; let q = v | 0; if (v - q > bay(x, yy)) q++;
        if (q > 0) buf[i] = Ls[q > 8 ? 8 : q][c];
      }
    }
  }
  /** the river: the bank mirrored, rippled and darkened, down to the crown road (columns end where the road begins) */
  function river(g, t, wmax) {
    const Ld = levels('mix', 'mist0', 0.45, 1)[1], Lg = levels('mix', 'mist0', 0.75, 1)[1], buf = g.buf;
    for (let r = 0; r < 26; r++) {
      const yy = WATER_Y + r, d = (r + 0.5) / 26, sy = WATER_Y - 1 - r, o = yy * W, so = sy * W, n = wmax[r];
      const off = rd(Math.sin(r * 0.85 + t * 4.4) * 1.1 * (0.35 + d) + Math.sin(r * 0.31 - t * 2) * 0.55 * d);
      const L = Math.sin(r * 1.9 + t * 2.6) * Math.sin(r * 0.47 - t * 1.2) > 0.8 ? Lg : Ld;
      for (let x = 0; x < n; x++) { let sx = x + off; sx = sx < 0 ? 0 : sx > W - 1 ? W - 1 : sx; buf[o + x] = L[buf[so + sx]]; }
    }
    for (let i = 0; i < 7; i++) {
      const kk = Math.floor(t * 2.5 + i * 0.37);
      if (hash(i, kk) < 0.35) continue;
      const gy = WATER_Y + 1 + Math.floor(hash(i * 31 + kk, 6) ** 2 * 24);
      dash(g, hash(i * 31 + kk, 5) * 320, gy, 1 + Math.floor(hash(i, 7) * 3), k('mist5'), 1);
    }
  }

  // ================= mills: the tower is drawn once, the sails every frame
  /** the tower of a stellingmolen (the same drawing as the shared windmill, without its sails) */
  function tower(g, x, y, s, tone, seed, lit, o) {
    const base = k(tone), dk = A.step(base, -1), dk2 = A.step(base, -2), lt = A.step(base, 1);
    const bh = rd(50 * s), b0 = Math.max(3, rd(11 * s)), b1 = Math.max(2, rd(5.5 * s)), top = y - bh;
    A.begin(g);
    A.poly(g, [x - b0, y, x + b0 + 1, y, x + b1 + 1, top, x - b1, top], base);
    A.poly(g, [x - b0, y, x - rd(b0 * 0.4), y, x - rd(b1 * 0.4), top, x - b1, top], dk);
    A.poly(g, [x + rd(b0 * 0.45), y, x + b0 + 1, y, x + b1 + 1, top, x + rd(b1 * 0.45), top], lt);
    if (s >= 0.7) for (let yy = top + 2; yy < y; yy += 3) for (let xx = x - b0; xx <= x + b0; xx += 2) if (hash(xx, yy + seed) < 0.3) A.px(g, xx, yy, dk2);
    if (o.stage && s >= 0.35) {
      const sy = y - rd(bh * 0.33), hwS = rd(b0 + 9 * s);
      A.rect(g, x - hwS, sy, 2 * hwS + 1, Math.max(1, rd(1.5 * s)), dk2);
      if (s >= 0.6) { A.hline(g, x - hwS, sy - rd(4 * s), 2 * hwS + 1, dk); for (let xx = x - hwS; xx <= x + hwS; xx += Math.max(2, rd(4 * s))) A.vline(g, xx, sy - rd(4 * s), rd(4 * s), dk); }
      A.line(g, x - hwS, sy + 1, x - b0 + 1, y - 1, dk2); A.line(g, x + hwS, sy + 1, x + b0 - 1, y - 1, dk2);
      A.line(g, x - rd(hwS * 0.6), sy + 1, x - rd(b0 * 0.7), y - 1, dk2); A.line(g, x + rd(hwS * 0.6), sy + 1, x + rd(b0 * 0.7), y - 1, dk2);
    }
    A.rect(g, x - rd(2 * s), y - rd(7 * s), Math.max(2, rd(4 * s)), rd(7 * s), o.door ? 'amber6' : dk2);
    if (o.door) { A.hline(g, x - rd(2 * s), y - rd(7 * s) - 1, Math.max(2, rd(4 * s)), 'amber3'); A.px(g, x - rd(2 * s), y - rd(7 * s), 'amber8'); }
    const wins = [];
    [[0, 0.55], [-0.3, 0.75], [0.25, 0.42]].forEach(([fx, fy], i) => {
      const wx = x + rd(fx * b0), wy = y - rd(bh * fy), on = hash(i, seed + 31) < lit, ww = Math.max(1, rd(2 * s)), wh = Math.max(1, rd(3 * s));
      A.rect(g, wx, wy, ww, wh, on ? 'amber6' : dk2);
      if (on) { wins.push([wx, wy, ww, wh]); }
    });
    const cw = b1 + Math.max(1, rd(2.5 * s)), ch = Math.max(2, rd(6 * s));
    A.poly(g, [x - cw, top + 1, x + cw + 1, top + 1, x + b1 + 1, top - ch + 1, x - b1 + 1, top - ch, x - b1, top - ch + 1], dk);
    A.hline(g, x - cw, top, 2 * cw + 1, dk2);
    A.end(g);
    wins.forEach(([wx, wy, ww, wh]) => glow(g, wx + 1 - g.ox, wy + 1, rd(6 * s) + 2, rd(6 * s) + 2, 'amber5', 0.25, 3));
    return wins;
  }
  // sails: rasterised once per angle step (they have four-fold symmetry), then stamped each frame
  const SAILS = new Map();
  function rasterSails(s, far, j, N) {
    const key = s + '|' + far + '|' + j; let v = SAILS.get(key); if (v) return v;
    const pts = [], seen = new Set(), ang = j / N * Math.PI / 2;
    const put = (x, y) => { const kk = (x + 300) * 1000 + (y + 300); if (!seen.has(kk)) { seen.add(kk); pts.push(x, y); } };
    const line = (x0, y0, x1, y1, th) => {
      x0 = rd(x0); y0 = rd(y0); x1 = rd(x1); y1 = rd(y1);
      const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
      for (let q = 0; q < (th || 1); q++) {
        const o = q - ((th || 1) >> 1); let ax = x0, ay = y0, bx = x1, by = y1;
        if (steep) { ax += o; bx += o; } else { ay += o; by += o; }
        const dx = Math.abs(bx - ax), sx = ax < bx ? 1 : -1, dy = -Math.abs(by - ay), sy = ay < by ? 1 : -1; let err = dx + dy;
        for (;;) { put(ax, ay); if (ax === bx && ay === by) break; const e2 = 2 * err; if (e2 >= dy) { err += dy; ax += sx; } if (e2 <= dx) { err += dx; ay += sy; } }
      }
    };
    const L = (far ? 30 : 34) * s, sw = Math.max(2, 6 * s), a0 = 0.2 * L;
    for (let q = 0; q < 4; q++) {
      const an = ang + q * Math.PI / 2, ca = Math.cos(an), sa = Math.sin(an), px = -sa, py = ca;
      if (far) {
        line(0, 0, ca * L, sa * L); line(ca * L * 0.4 - sa * 2 * s, sa * L * 0.4 + ca * 2 * s, ca * L - sa * 2.5 * s, sa * L + ca * 2.5 * s);
        continue;
      }
      const q0 = ca * a0, q1 = sa * a0, q2 = ca * L, q3 = sa * L;
      line(-ca * 2 * s, -sa * 2 * s, q2, q3, s >= 1.4 ? 2 : 1);
      line(q2, q3, q2 + px * sw, q3 + py * sw); line(q2 + px * sw, q3 + py * sw, q0 + px * sw, q1 + py * sw); line(q0 + px * sw, q1 + py * sw, q0, q1);
      if (s >= 0.45) { const n = Math.max(2, rd((L - a0) / Math.max(2.5, 3.5 * s))); for (let i = 1; i < n; i++) { const f = a0 + (L - a0) * i / n; line(ca * f, sa * f, ca * f + px * sw, sa * f + py * sw); } }
    }
    if (!far) { const r = Math.max(1, rd(1.6 * s)); for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) if (xx * xx + yy * yy <= r * r + r) put(xx, yy); }
    v = Int16Array.from(pts); SAILS.set(key, v); return v;
  }
  /** stamp the sails of a mill at angle ang (anticlockwise on screen when ang falls with t) */
  function sails(g, x, y, s, ang, c, far) {
    const N = far ? 16 : 48, q = Math.PI / 2, a = ((ang % q) + q) % q, j = Math.min(N - 1, Math.floor(a / q * N));
    const list = rasterSails(s, far, j, N), bh = rd((far ? 46 : 50) * s), hubY = far ? y - bh : y - bh - Math.max(2, rd(6 * s)) / 2 | 0, ox = g.ox, buf = g.buf;
    for (let i = 0; i < list.length; i += 2) {
      const px = x + list[i] + ox, py = hubY + list[i + 1];
      if (px >= 0 && px < W && py >= 0 && py < SH) buf[py * W + px] = c;
    }
  }
  /** a tiny far mill: a flat tower, the sails come later */
  function farTower(g, x, y, s, c) {
    const h = rd(46 * s), b0 = Math.max(2, rd(9 * s)), b1 = Math.max(1, rd(4.5 * s));
    A.poly(g, [x - b0, y, x + b0 + 1, y, x + b1 + 1, y - h, x - b1, y - h], c);
    A.poly(g, [x - b1 - 1, y - h, x + b1 + 2, y - h, x + 0.5, y - h - 4 * s - 1], c);
  }
  /** a far farmhouse: gabled roof, lit windows (they mirror in the river) */
  function farm(g, x, y, w, h, c, lit) {
    A.rect(g, x, y - h, w, h, c); A.poly(g, [x - 1, y - h, x + w + 1, y - h, x + w / 2, y - h - rd(w * 0.55)], c);
    lit.forEach(([dx, dy]) => A.px(g, x + dx, y - dy, 'amber6'));
  }
  /** a reed blade rising from (x, y), leaning, tapering; a one pixel moon rim on the left of some */
  function blade(g, x, y, h, lean, c, rimc, bw) {
    const ox = g.ox;
    for (let r = 0; r < h; r++) {
      const f = r / h, xx = rd(x + lean * f * f) + ox, w = f < 0.3 ? bw : f < 0.55 ? bw - 1 : f < 0.8 ? 2 : 1, yy = y - r;
      if (yy < 0 || yy >= SH) continue;
      const x0 = xx - (w >> 1);
      for (let i = Math.max(0, x0); i < Math.min(W, x0 + w); i++) g.buf[yy * W + i] = c;
      if (rimc >= 0 && w > 1 && x0 - 1 >= 0 && x0 - 1 < W) g.buf[yy * W + x0 - 1] = rimc;
    }
  }

  // ================= the still layers, each drawn once per camera position
  const CAM_X = -8, CAM_P = 8;
  const offs = camX => ({ o15: rd(-camX * 0.15), o3: rd(-camX * 0.3), o6: rd(-camX * 0.6), o1: rd(-camX) });
  const MILLS = [
    { x: 150, y: HZ + 2, s: 0.62, d: 'o3', sp: 0.65, ph: 0.4, tone: 'night2', sail: 'night1', seed: 5, lit: 0.8 },
    { x: 268, y: HZ + 3, s: 1.0, d: 'o6', sp: 0.55, ph: 1.2, tone: 'night1', sail: 'night0', seed: 6, lit: 1, stage: true, door: true },
  ];
  const EYES = [[58, 97, 0], [111, 98, 3], [232, 98, 5], [292, 97, 8]];   // the dead stand on the far bank too
  const FAR = [[14, 0.22, 0], [190, 0.2, 1], [318, 0.24, 2]];
  let wins = null;
  // stars: most are baked into the sky, a third twinkle each frame (same recipe as the shared stars)
  const STARS = [];
  for (let i = 0; i < 34; i++) {
    const x = 8 + Math.floor(hash(i, 17) * 304), y = 6 + Math.floor(hash(i, 18) * 58), b = hash(i, 19);
    STARS.push({ x, y, b, big: b > 0.96, c: b > 0.9 ? 'paper6' : b > 0.55 ? 'mist6' : 'mist4', f: 0.8 + 2.4 * hash(i, 20), tw: i % 3 === 0 });
  }
  function star(g, st, on) {
    const c = on === 1 ? k(st.c) : k(st.c === 'mist4' ? 'mist4' : 'mist4');
    g.buf[st.y * W + st.x] = c;
    if (st.big && on === 1) { const c3 = k('mist4'); g.buf[st.y * W + st.x - 1] = c3; g.buf[st.y * W + st.x + 1] = c3; g.buf[(st.y - 1) * W + st.x] = c3; g.buf[(st.y + 1) * W + st.x] = c3; }
  }

  /** sky, fog, far bank, near bank, mill towers, barge: everything above the water that stands still */
  function buildFar(g, o) {
    g.oy = 0; g.ox = 0;
    bands(g, [[0, 'night0'], [14, 'night0'], [30, 'night1'], [46, 'night2'], [62, 'night3'], [76, 'night4'], [86, 'night5'], [93, 'mist0'], [100, 'mist1']], 7);
    STARS.forEach(st => { if (!st.tw) star(g, st, 1); });
    // the moon (local: the shared moon spends too much on its halo) and the fog banks that carve the mills out
    patch(g, 40, 24, 30, 26, [k('night2'), k('night3'), k('night4'), k('night5')], 2);
    A.disc(g, 40, 24, 9, 'paper5');
    for (let yy = -9; yy <= 9; yy++) for (let xx = -9; xx <= 9; xx++) {
      if (xx * xx + yy * yy > 90) continue;
      if ((xx + 4) * (xx + 4) + yy * yy > 90) A.px(g, 40 + xx, 24 + yy, xx > 0 ? 'paper3' : 'paper4');
    }
    [[-3, -3, 'paper4'], [1, 2, 'paper4'], [-1, 4, 'paper3'], [3, -4, 'paper4']].forEach(([dx, dy, c]) => A.px(g, 40 + dx, 24 + dy, c));
    patch(g, 270, 98, 80, 62, [k('night4'), k('night5'), k('mist0'), k('mist1'), k('mist2'), k('mist3')], 1);
    patch(g, 200, 100, 62, 44, [k('night5'), k('mist0'), k('mist1'), k('mist2'), k('mist3')], 1);
    // far bank: trees, a spire, tiny mill towers, nearly the colour of the fog
    g.ox = o.o15;
    A.rect(g, -20, HZ - 1, 360, 3, 'night5');
    for (let i = 0; i < 30; i++) A.disc(g, -10 + i * 12 + hash(i, 2) * 6, HZ - 1 - hash(i, 3) * 1.5, 2 + hash(i, 4) * 3, 'night5');
    A.church(g, 96, HZ, 0.8, { tone: 'night5', clock: false, lit: false });
    FAR.forEach(([x, s]) => farTower(g, x, HZ, s, k('night5')));
    g.ox = 0; A.haze(g, 0, 84, 320, 18, { top: 0, bottom: 0.5, color: 'mist2', lights: 0.5 });
    // the near bank across the river: the hamlet and the mid mill's tower
    g.ox = o.o3;
    A.rect(g, -20, HZ, 360, 3, 'night3');
    for (let i = 0; i < 24; i++) A.disc(g, -14 + i * 15 + hash(i, 12) * 6, HZ - hash(i, 13), 2 + hash(i, 14) * 2, 'night3');
    farm(g, 24, HZ + 1, 9, 5, k('night2'), [[2, 3]]);
    farm(g, 196, HZ + 1, 10, 6, k('night2'), [[2, 3], [6, 3]]);
    farm(g, 211, HZ + 1, 8, 5, k('night2'), [[3, 3]]);
    farm(g, 236, HZ + 1, 9, 5, k('night2'), []);
    const m0 = MILLS[0]; tower(g, m0.x, m0.y, m0.s, m0.tone, m0.seed, m0.lit, m0);
    // the big mill, a hard dark shape in the fog bank, with its stage, cap and lit door; a barge moored below it
    g.ox = o.o6;
    A.rect(g, 236, HZ + 1, 70, 3, 'night1');
    for (let i = 0; i < 14; i++) A.rect(g, 238 + i * 5, HZ - hash(i, 7) * 2, 3, 3, 'night1');
    const m1 = MILLS[1]; wins = tower(g, m1.x, m1.y, m1.s, m1.tone, m1.seed, m1.lit, m1);
    A.boat(g, 12, WATER_Y - 1, { t: 0, kind: 'barge', len: 44, tone: 'night3', mast: true });
    // the corners fall off a little
    g.ox = 0;
    darken(g, 0, 0, 44, 34, (x, y) => (1 - x / 44) * (1 - y / 34) * 0.6);
    darken(g, 276, 0, 320, 34, (x, y) => ((x - 276) / 44) * (1 - y / 34) * 0.6);
    return g.buf.slice(0, WATER_Y * W);
  }

  /** the dyke: the river kerb, the crown road, the polder kerb, the slope, the houses, the lantern post.
   *  Drawn over a sentinel colour so only what it covers is blitted later. */
  function buildNear(g, o) {
    g.oy = 0; g.ox = o.o1; g.buf.fill(SENT);
    const ro = [k('slate1'), k('slate2'), k('slate3'), k('night4'), k('night5')];
    const gr = [k('green2'), k('green1'), k('green0')], g1 = k('green1');
    for (let X = 0; X < W; X++) {
      const x = X - g.ox, ya = rd(fe(x)), yb = rd(ne(x)), fogk = clamp((x - 90) / 330, 0, 1);
      g.buf[(ya - 2) * W + X] = k('mist3'); g.buf[(ya - 1) * W + X] = k('night4'); g.buf[ya * W + X] = k('slate0');
      for (let y = ya + 1; y < yb; y++) {
        const f = (y - ya) / (yb - ya), v = (0.85 * Math.pow(1 - f, 1.5) + 0.15) * (1 - 0.35 * fogk) + 0.25 * fogk * (1 - f);
        const s = clamp(v, 0, 0.999) * (ro.length - 1); let q = s | 0; if (s - q > bay(X, y)) q++;
        g.buf[y * W + X] = ro[q];
      }
      g.buf[(yb - 1) * W + X] = k('mist2'); g.buf[yb * W + X] = k('night3'); g.buf[(yb + 1) * W + X] = k('night2');
      for (let y = yb + 2; y < SH; y++) {
        const d = (y - yb) / 30;
        g.buf[y * W + X] = hash(X >> 1, y) < 0.18 ? g1 : d < 0.35 ? gr[0] : d < 1 ? gr[1] : gr[2];
      }
      g.buf[(yb + 2) * W + X] = k('green3');
    }
    // wet glints on the asphalt: broken, pale, denser toward the river edge
    for (let i = 0; i < 70; i++) {
      const x = hash(i, 51) * 340 - 20, f = Math.pow(hash(i, 52), 1.6), ya = fe(x), yb = ne(x), y = ya + 2 + f * (yb - ya - 4);
      dash(g, x, y, 2 + rd(hash(i, 53) * 8 * (0.5 + f)), k(f < 0.5 ? 'night5' : 'night4'), 0.8);
    }
    // the dashed centre line, shorter and fainter into the fog
    for (let x = -22; x < 330;) {
      const len = Math.max(4, rd(15 - (x + 20) * 0.03)), yc = rd((fe(x) + ne(x)) / 2 + 1), th = x < 90 ? 2 : 1;
      for (let j = 0; j < th; j++) dash(g, x, yc + j, len, k(x < 110 ? 'mist4' : x < 220 ? 'mist3' : 'mist2'), 0.85);
      x += len * 2 + 4;
    }
    // puddles that hold the sky
    [[118, 133, 16, 2], [164, 138, 12, 2], [66, 153, 14, 2], [205, 130, 9, 1]].forEach(([x, y, rx, ry], i) => {
      if (y > ne(x) - 4) return;
      A.ellipse(g, x, y, rx, ry, 'night5'); A.ellipse(g, x, y, rx - 2, Math.max(0, ry - 1), 'mist0');
      dash(g, x - rx / 2, y, rx, k('mist3'), 0.6);
    });
    // a cheese cart parked on the polder side of the crown, glowing in the lantern's light
    A.cheeseCart(g, 26, 160, { rows: 2, glow: 0.12 });
    darken(g, 6, 140, 56, 162, () => 0.42);
    // bollards on the river kerb and the lantern post (its glass is drawn each frame)
    [[16, 9], [46, 8], [142, 7], [180, 7], [236, 6], [292, 5]].forEach(([x, h]) => A.bollard(g, x, rd(fe(x)) - 1, { h }));
    A.lamp(g, 70, 127, { style: 'lantern', h: 44, flicker: 0, t: 0, seed: 3, light: false });
    // below the crown, on the polder side: a fence, tulips, the dyke houses
    A.fence(g, 92, 177, 52, 8, { tone: 'paper1' });
    A.tulips(g, 120, 178, 16);
    A.canalHouse(g, 156, 192, 38, 30, { gable: 'roof', brick: 'brick3', lit: 0.6, t: 0, seed: 3 });
    A.canalHouse(g, 196, 192, 40, 33, { gable: 'bell', brick: 'slate3', lit: 0.5, t: 0, seed: 11 });
    A.canalHouse(g, 238, 192, 36, 38, { gable: 'step', brick: 'brick2', lit: 0.4, t: 0, seed: 7 });
    // the dead face at the window is drawn each frame
    g.ox = 0;
    darken(g, 0, 130, 70, 180, (x, y) => (1 - x / 70) * (y - 130) / 50 * 0.9);
    darken(g, 250, 120, 320, 180, (x, y) => ((x - 250) / 70) * 0.5 + (y - 120) / 60 * 0.25);
    // what was covered: runs of pixels that are not the sentinel
    const ys = [], x0s = [], x1s = [];
    for (let y = 0; y < SH; y++) {
      let x = 0;
      while (x < W) {
        if (g.buf[y * W + x] === SENT) { x++; continue; }
        const s = x; while (x < W && g.buf[y * W + x] !== SENT) x++;
        ys.push(y); x0s.push(s); x1s.push(x);
      }
    }
    const wmax = new Int16Array(26);        // for each water row, the columns the river still shows (the road covers the rest)
    for (let r = 0; r < 26; r++) { const yy = WATER_Y + r; let n = 0; while (n < W && yy < rd(fe(n - o.o1)) - 2) n++; wmax[r] = n; }
    return { snap: g.buf.slice(), ys, x0s, x1s, wmax };
  }

  const FAR_CACHE = new Map(), NEAR_CACHE = new Map();
  function farFor(g, o) {
    const key = o.o15 + ',' + o.o3 + ',' + o.o6; let v = FAR_CACHE.get(key);
    if (!v) { v = buildFar(g, o); FAR_CACHE.set(key, v); }
    return v;
  }
  function nearFor(g, o) {
    let v = NEAR_CACHE.get(o.o1);
    if (!v) { v = buildNear(g, o); NEAR_CACHE.set(o.o1, v); }
    return v;
  }
  let warmed = false;
  function warm(g) {      // build every camera position once, so no frame stutters later
    warmed = true;
    for (let i = 0; i <= 64; i++) { const kk = i / 64, o = offs(CAM_X * kk); farFor(g, o); nearFor(g, o); }
  }

  A.scenes.dyke = (g, t) => {
    A.camera(g, t, { x: CAM_X, period: CAM_P }); A.key(g, 40, 24, 1);
    if (!warmed) warm(g);
    g.mask.fill(0);
    const o = offs(g.camX), fl = hash(Math.floor(t * 9), 5) < 0.1 ? 0.6 : 1;

    // ---- the still sky, bank and mills, then what moves in them
    g.ox = g.oy = 0;
    g.buf.set(farFor(g, o));
    STARS.forEach((st, i) => { if (!st.tw) return; const tw = Math.sin(t * st.f + i * 1.7); if (tw > -0.55) star(g, st, tw < 0 ? 0 : 1); });
    [[0, 17, 46, 2.6, 0.9], [150, 31, 60, 3, 0.8], [260, 21, 40, 2.2, 1.1], [60, 44, 70, 3.2, 0.7], [210, 52, 56, 2.8, 1.2]].forEach(([x0, y0, rx, ry, sp]) => {
      const cx = ((x0 + t * sp * 2 + 60) % 440) - 60, cc = y0 < 30 ? [k('night1'), k('night2'), k('night3')] : [k('night2'), k('night3'), k('night4')];
      patch(g, cx, y0, rx, ry, cc, 1); patch(g, cx + rx * 0.5, y0 - 1, rx * 0.5, ry * 0.8, cc, 1);
    });
    g.ox = o.o15; FAR.forEach(([x, s, i]) => sails(g, x, HZ, s, -t * 0.9 + i, k('night5'), true));
    MILLS.forEach(m => {
      g.ox = o[m.d]; sails(g, m.x, m.y, m.s, -t * m.sp + m.ph, k(m.sail));
    });
    // the big mill's windows flicker now and then
    g.ox = o.o3; EYES.forEach(([ex, ey, ph]) => { if (hash(Math.floor(t * 0.7 + ph), 9) < 0.8) { dash(g, ex, ey, 1, k('eye3'), 1); dash(g, ex + 3, ey, 1, k('eye3'), 1); } });
    g.ox = o.o6; (wins || []).forEach(([wx, wy, ww, wh], i) => { if (hash(Math.floor(t * 3) + i, 6) < 0.08) A.rect(g, wx, wy, ww, wh, 'amber4'); });
    
    // ---- the river: higher than the polder. It mirrors the mills, the barge and the lit windows
    g.ox = 0; river(g, t, nearFor(g, o).wmax);
    for (let i = 0; i < 22; i++) {         // broken shimmer, wider as the water comes toward us
      const y = 106 + Math.floor(hash(i, 3) * 20), f = (y - 104) / 22, k2 = Math.floor(t * 1.5 + i * 0.3);
      if (hash(i, k2) < 0.3) continue;
      dash(g, hash(i, 1) * 320 + Math.sin(t * 0.7 + i) * 2, y, 3 + rd(f * 7 * hash(i, 2)), k(f > 0.5 ? 'mist2' : 'mist1'), 0.7);
    }
    for (let i = 0; i < 12; i++) {         // the moon's track in the water
      const y = 105 + i * 2 + Math.floor(hash(i, 9) * 2), w = 2 + rd(hash(i, 8) * 5 * (1 + i * 0.08));
      if (hash(i, Math.floor(t * 2) + 4) < 0.25) continue;
      dash(g, 44 - w / 2 + (hash(i, 10) - 0.5) * 5 + Math.sin(t * 1.3 + i) * 1.2, y, w, k(i < 6 ? 'mist5' : 'mist4'), 0.9);
    }
    A.duck(g, 176, 112, { t, facing: 'left' });
    mist(g, t, 97, 20, 0.42, -3, 5, 'mist2');

    // ---- the dyke: kerbs, road, slope, houses, bollards, the lantern post
    const nr = nearFor(g, o);
    { const b = g.buf, sn = nr.snap, ys = nr.ys, x0s = nr.x0s, x1s = nr.x1s; for (let r = 0, n = ys.length; r < n; r++) { const base = ys[r] * W; for (let i = base + x0s[r], e = base + x1s[r]; i < e; i++) b[i] = sn[i]; } }
    g.ox = o.o1;
    // the lantern: glass, a light shaft in the fog, a pool on the crown, and its reflection on the wet road
    if (fl < 1) { A.rect(g, 68, 77, 6, 6, 'amber4'); A.vline(g, 69, 78, 4, 'amber5'); A.vline(g, 72, 78, 4, 'amber5'); }
    glow(g, 71, 80, 12, 12, 'amber6', 0.5 * fl, 5);
    cone(g, 71, 84, Math.PI / 2 + 0.1, 0.4, 62, 5, 'amber7', 0.2 * fl, 4);
    glow(g, 76, 144, 42, 10, 'amber6', 0.26 * fl, 5);
    for (let y = 129; y < 170; y += 2) {
      const f = (y - 129) / 41, w = rd(4 + f * 12);
      if (hash(Math.floor((y - 129) / 2) + 40, Math.floor(t * 4)) > 0.92 - f * 0.4) continue;
      const cx = 72 + rd(Math.sin(y * 0.7 + t * 3) * (0.5 + f)) + f * 6, cw = Math.max(2, rd(w * 0.4));
      dash(g, cx - w / 2 - 2, y, w + 4, k('amber6'), 0.28 * fl);
      dash(g, cx - w / 2, y, w, k('amber6'), 0.8 * fl); dash(g, cx - cw / 2, y, cw, k('amber7'), 1);
    }
    dash(g, 66, 152, 8, k('amber6'), 0.9);                                   // the lamp in the nearest puddle
    // a dead face at one lit window of the dyke houses
    const wx = 213, wy = 170;
    A.rect(g, wx - 1, wy - 1, 9, 10, 'paper2'); A.rect(g, wx, wy, 7, 8, 'amber5');
    A.rect(g, wx + 2, wy + 2, 4, 5, 'zombie3'); A.rect(g, wx + 1, wy + 6, 6, 2, 'night1');
    A.px(g, wx + 2, wy + 3, 'eye4'); A.px(g, wx + 4, wy + 3, 'eye4');
    glow(g, wx + 3, wy + 3, 5, 5, 'eye3', 0.35 * (0.7 + 0.3 * Math.sin(t * 2)), 3);

    // ---- the postman: right profile, riding toward the big mill
    const hx = 108, hy = 148;
    glow(g, hx + 1, hy, 26, 2, 'black', 0.5, 4, 'mul');
    A.omafiets(g, hx, hy, { rider: true, t, speed: 1.4, facing: 'right', beam: false, basket: null, shadow: false });
    // parcels and letters in the rear rack, a dog in the basket with its ears up
    A.begin(g);
    A.rect(g, hx - 19, hy - 25, 10, 6, 'wood4'); A.hline(g, hx - 19, hy - 25, 10, 'wood5'); A.vline(g, hx - 14, hy - 25, 6, 'paper4'); A.hline(g, hx - 19, hy - 22, 10, 'paper4');
    A.rect(g, hx - 17, hy - 28, 7, 3, 'paper5'); A.hline(g, hx - 17, hy - 28, 7, 'paper6'); A.px(g, hx - 15, hy - 27, 'red4');
    A.rect(g, hx - 11, hy - 30, 4, 2, 'paper4');
    A.end(g);
    A.begin(g);
    const ear = Math.sin(t * 2.2) > 0.9 ? 1 : 0;
    A.rect(g, hx + 15, hy - 33, 6, 6, 'fur3'); A.hline(g, hx + 16, hy - 34, 4, 'fur3');
    A.rect(g, hx + 15, hy - 36 - ear, 2, 3 + ear, 'fur1'); A.rect(g, hx + 19, hy - 37, 2, 4, 'fur1'); A.px(g, hx + 20, hy - 37, 'fur2');
    A.rect(g, hx + 20, hy - 31, 4, 3, 'fur4'); A.px(g, hx + 23, hy - 31, 'slate0'); A.px(g, hx + 18, hy - 32, 'slate0'); A.px(g, hx + 15, hy - 28, 'fur2');
    A.end(g);
    A.px(g, hx + 24, hy - 19, 'paper6'); A.px(g, hx + 25, hy - 19, 'paper6'); glow(g, hx + 25, hy - 19, 6, 6, 'paper6', 0.6, 4);
    // the second dog trots ahead, down in the beam
    glow(g, 155, 148, 11, 2, 'black', 0.5, 4, 'mul');
    A.dog(g, 154, 148, { coat: 'grey', pose: 'walk', facing: 'right', t, shadow: false });

    // ---- the tall dead man waits in the headlight (a bucket hat, striped socks, clogs)
    glow(g, 214, 139, 12, 2, 'black', 0.5, 4, 'mul');
    A.zombie(g, 212, 139, { variant: 'hat', facing: 'left', pose: 'stand', height: 64, hunch: 0.26, t, seed: 4, socks: true, clogs: true, glow: 0.5, shirt: 'brick4', pants: 'slate5', shadow: false });
    // the headlight: a beam angled down onto the road, and the pool where it lands
    cone(g, hx + 25, hy - 19, 0.1, 0.12, 92, 3, 'paper5', 0.4, 5);
    glow(g, 190, 143, 28, 4, 'paper5', 0.3, 4);

    // ---- foreground: big dark reed blades with a moon rim, ground fog
    g.ox = rd(-g.camX * 1.25);
    for (let i = 0; i < 22; i++) {
      const x = 262 + i * 3.4 + hash(i, 1) * 3, h = 34 + rd(hash(i, 2) * 40) + (i > 10 ? 8 : 0);
      blade(g, x, 186, h, -10 + hash(i, 3) * 20 + Math.sin(t * 1.1 + i) * 1.6, k('night0'), i % 2 ? k('mist3') : k('mist1'), 5);
    }
    for (let i = 0; i < 10; i++) blade(g, -12 + i * 5 + hash(i, 4) * 3, 186, 14 + rd(hash(i, 5) * 20), -5 + hash(i, 6) * 10 + Math.sin(t * 1.1 + i) * 1.2, k('night0'), i % 3 ? -1 : k('mist3'), 4);
    g.ox = 0;
    mist(g, t, 152, 18, 0.2, 6, 6, 'mist3');
  };
  A.scenes.polder = (g, t) => A.scenes.dyke(g, t);
  // the shared night grade, last: the deepest darks lift into the concept art's blue-grey haze (NRART.grade)
  { const draw = A.scenes.dyke; A.scenes.dyke = (g, t) => { draw(g, t); A.grade(g); }; }
})();
