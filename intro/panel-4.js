// Panel 4: the language left. A real one-point-perspective street, vanishing point (200,108), deep in mist.
// Left: gabled houses behind a picket fence. Right: a canal with a little arched bridge. Far end: the mill and the spire.
// The Dutch words drift down the centre line and into the fog; English phone-talkers keep their backs turned.
// Story (16 s loop): 'hallo?' drifts up to a talker, gets 'sorry, English?', droops and leaves. 'gezellig' goes first and
// the windows go out behind it. 'de' and 'het' squabble off as a pair. 'doei' is last and smallest: it hangs at the
// vanishing point, waving, until the mist closes. Then the windows come back on and the loop starts again.
// Speed: the street, houses, lamps and water are painted once (twice: windows dark and windows lit) and cached.
// Each frame copies the cache, switches windows by copying their pixels from the lit copy, and draws only what moves.
(function () {
  const A = window.NRART;
  const VX = 200, VY = 108, F = 45, CH = 1.6, T = 16, TAU = Math.PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const sm = (a, b, x) => { const k = cl((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
  const hash = A.hash, rnd = Math.round;
  // projection: lateral metres (negative = left), distance d, height above the pavement
  const PX = (lat, d) => VX + lat * F / d, PY = (h, d) => VY + (CH - h) * F / d, GY = d => VY + CH * F / d;
  const pj = (lat, d, h) => [PX(lat, d), PY(h, d)];

  // ---------------------------------------------------------------- 3x5 pixel letters for words that go into the mist
  const FONT = {
    a: '.#.' + '#.#' + '###' + '#.#' + '#.#', d: '##.' + '#.#' + '#.#' + '#.#' + '##.', e: '###' + '#..' + '##.' + '#..' + '###',
    f: '###' + '#..' + '##.' + '#..' + '#..', g: '.##' + '#..' + '#.#' + '#.#' + '.##', h: '#.#' + '#.#' + '###' + '#.#' + '#.#',
    i: '###' + '.#.' + '.#.' + '.#.' + '###', k: '#.#' + '#.#' + '##.' + '#.#' + '#.#', l: '#..' + '#..' + '#..' + '#..' + '###',
    o: '.#.' + '#.#' + '#.#' + '#.#' + '.#.', r: '##.' + '#.#' + '##.' + '#.#' + '#.#', s: '.##' + '#..' + '.#.' + '..#' + '##.',
    t: '###' + '.#.' + '.#.' + '.#.' + '.#.', z: '###' + '..#' + '.#.' + '#..' + '###', '?': '##.' + '..#' + '.#.' + '...' + '.#.',
  };
  // a word drawn into the pixel buffer so the fog can swallow it. h: letter height 5..1 (it shrinks as it recedes)
  const pixWord = (g, str, cx, cy, h, c, keepP, seed) => {
    const lw = h >= 4 ? 3 : 2, adv = lw + 1, w = str.length * adv - 1, x0 = rnd(cx - w / 2), y0 = rnd(cy - h / 2);
    for (let n = 0; n < str.length; n++) {
      const p = FONT[str[n]], lx = x0 + n * adv; if (!p) continue;
      if (h <= 1) { if (hash(n + seed, 5) < keepP) { A.px(g, lx, y0, c); if (hash(n + seed, 6) < 0.6) A.px(g, lx + 1, y0, c); } continue; }
      for (let r = 0; r < h; r++) {
        const sr = Math.min(4, Math.floor((r + 0.5) * 5 / h));
        for (let k = 0; k < lw; k++) {
          const sc = lw === 3 ? k : (k === 0 ? 0 : 2);
          if (p[sr * 3 + sc] === '#' && (keepP >= 1 || hash(lx + k + seed, y0 + r) < keepP)) A.px(g, lx + k, y0 + r, c);
        }
      }
    }
  };

  // ---------------------------------------------------------------- fast glow for the per-frame lights
  // Same look as NRART.glow (radial falloff, 4x4 Bayer between levels), but the falloff field is cached, so a frame only does lookups.
  const FIELD = new Map(), LEV = new Map();
  const fieldOf = (rx, ry, pw) => {
    const key = rx + '|' + ry + '|' + pw; let f = FIELD.get(key); if (f) return f;
    const w = 2 * rx + 1, h = 2 * ry + 1; f = new Float32Array(w * h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const d = Math.sqrt(((i - rx) / rx) * ((i - rx) / rx) + ((j - ry) / ry) * ((j - ry) / ry)); f[j * w + i] = d >= 1 ? 0 : Math.pow(1 - d, pw); }
    FIELD.set(key, f); return f;
  };
  const levelsOf = (mode, color, strength, Q) => {
    strength = Math.round(strength * 20) / 20; const key = mode + color + strength + Q; let L = LEV.get(key); if (L) return L;
    L = []; for (let q = 0; q <= Q; q++) L.push(A.lut(mode, color, strength * q / Q)); LEV.set(key, L); return L;
  };
  const fglow = (g, x, y, rx, ry, color, strength, power, mode, Q) => {
    if (strength < 0.03) return;
    x = rnd(x); y = rnd(y); rx = Math.max(1, rnd(rx)); ry = Math.max(1, rnd(ry)); Q = Q || 4;
    const f = fieldOf(rx, ry, power || 1.3), Ls = levelsOf(mode || 'add', color, strength, Q), w = 2 * rx + 1, B = g.buf, gw = g.w, gh = g.h;
    const j0 = Math.max(0, ry - y), j1 = Math.min(2 * ry, gh - 1 - y + ry), i0 = Math.max(0, rx - x), i1 = Math.min(2 * rx, gw - 1 - x + rx);
    for (let j = j0; j <= j1; j++) {
      const yy = y - ry + j, row = yy * gw, by = (yy & 3) << 2;
      for (let i = i0; i <= i1; i++) {
        const lv = f[j * w + i]; if (lv <= 0) continue;
        const xx = x - rx + i, v = lv * Q; let q = v | 0; if (v - q > A.bayer(xx, yy)) q++;
        if (q > 0) B[row + xx] = Ls[q > Q ? Q : q][B[row + xx]];
      }
    }
  };

  // ---------------------------------------------------------------- street geometry
  const KERB = 3.3, QUAY = 4.3, BANK = 9.0;           // lateral metres: kerb, canal edge, far bank
  const LFRONT = 6.4, RFRONT = 9.4;                    // house frontage lines
  const GABLES = ['step', 'bell', 'neck', 'spout', 'roof'];
  const PROFILE = {
    step: [[0, 0], [0, .34], [.15, .34], [.15, .67], [.3, .67], [.3, 1], [.7, 1], [.7, .67], [.85, .67], [.85, .34], [1, .34], [1, 0]],
    neck: [[0, 0], [0, .45], [.3, .55], [.3, .85], [.5, 1], [.7, .85], [.7, .55], [1, .45], [1, 0]],
    spout: [[0, 0], [0, .3], [.3, .6], [.3, 1], [.7, 1], [.7, .6], [1, .3], [1, 0]],
    roof: [[0, 0], [.08, .8], [.92, .8], [1, 0]],
    bell: (() => { const a = [[0, 0]]; for (let i = 1; i < 12; i++) { const u = i / 12; a.push([u, Math.pow(Math.sin(Math.PI * u), 0.55)]); } a.push([1, 0]); return a; })(),
  };
  const HOUSES = [];
  const addRow = (side, lat, spans, seed0, bricks) => {
    for (let i = 0; i + 1 < spans.length; i++) {
      const s = seed0 + i * 7;
      HOUSES.push({ side, lat: side * lat, d0: spans[i], d1: spans[i + 1], H: 6.4 + hash(s, 1) * 2.8, gh: 1.8 + hash(s, 2) * 2.2,
        gb: GABLES[Math.floor(hash(s, 3) * 5)], brick: bricks[Math.floor(hash(s, 4) * bricks.length)], seed: s, doorAt: hash(s, 5) < 0.5 ? 0 : 1 });
    }
  };
  addRow(-1, LFRONT, [1.5, 5.4, 9.6, 14.2, 19.8, 26.4, 35, 47, 65, 93, 135, 210], 11, ['brick1', 'slate2', 'brick2', 'slate2', 'brick1']);
  const NR0 = HOUSES.length;
  addRow(1, RFRONT, [4.4, 8.2, 12.2, 16.6, 21.6, 27.6, 35, 45, 59, 79, 109, 150, 230], 29, ['slate2', 'slate3', 'slate2', 'brick1', 'slate3']);
  HOUSES[NR0].gb = 'step'; HOUSES[NR0 + 1].gb = 'neck'; HOUSES[NR0].H = 6.6;
  // windows: one list for the whole street, filled while painting the dark pass
  const WIN = [];
  const layoutWindows = (h) => {
    const out = [], w = h.d1 - h.d0, ncol = w >= 6.5 ? 3 : w >= 3.2 ? 2 : 1;
    const floors = [[0.8, 2.3], [3.1, 4.7], [5.4, 7.0]];
    const doorCol = h.doorAt ? ncol - 1 : 0;
    for (let f = 0; f < 3; f++) {
      if (floors[f][1] > h.H - 0.6) break;
      for (let c = 0; c < ncol; c++) {
        const cu = h.d0 + (c + 0.5) / ncol * w, ww = Math.min(1.0, w / ncol * 0.42);
        if (f === 0 && c === doorCol) { out.push({ door: true, da: cu - 0.55, db: cu + 0.55, h0: 0.12, h1: 2.35 }); continue; }
        const sd = h.seed * 13 + f * 5 + c;
        out.push({ da: cu - ww / 2, db: cu + ww / 2, h0: floors[f][0], h1: floors[f][1], seed: sd, detail: hash(sd, 8) < 0.22 ? (['plant', 'cat', 'tulip'][Math.floor(hash(sd, 9) * 3)]) : null });
      }
    }
    return out;
  };

  // ---------------------------------------------------------------- the static painting
  const quad = (g, a, b, c, d, col) => A.poly(g, [a, b, c, d], col);
  const quadBBox = pts => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return [Math.floor(x0), Math.floor(y0), Math.ceil(x1), Math.ceil(y1)]; };
  // fill a quad; if it is under 2 px in either direction, drop a small rect instead so far windows never vanish
  const quadSafe = (g, pts, col) => {
    const bb = quadBBox(pts);
    if (bb[2] - bb[0] < 3 || bb[3] - bb[1] < 3) A.rect(g, bb[0], bb[1], Math.max(1, bb[2] - bb[0] - 1), Math.max(1, bb[3] - bb[1] - 1), col);
    else A.poly(g, pts, col);
    return bb;
  };
  const dashLine = (g, x0, y0, x1, y1, c, keep, seed) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0; if (n < 1) return;
    for (let i = 0; i <= n; i++) { const x = rnd(x0 + (x1 - x0) * i / n), y = rnd(y0 + (y1 - y0) * i / n); if (hash(x + seed, y) < keep) A.px(g, x, y, c); }
  };
  const speckle = (g, x0, y0, x1, y1, base, seed) => {
    const lo = A.step(base, -1), hi = A.step(base, 1), B = g.buf, bi = A.col(base);
    for (let y = Math.max(0, y0); y <= Math.min(g.h - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(g.w - 1, x1); x++) {
      if (B[y * g.w + x] !== bi) continue; const r = hash(x * 3 + seed, y * 5);
      if (r < 0.09) B[y * g.w + x] = lo; else if (r > 0.95) B[y * g.w + x] = hi;
    }
  };

  const paintHouse = (g, h, lit, record) => {
    const { lat, d0, d1, H, gh } = h, P = (d, hh) => pj(lat, d, hh), base = A.col(h.brick), trim = 'slate5';
    // wall and gable
    const wall = [P(d0, 0), P(d1, 0), P(d1, H), P(d0, H)];
    A.poly(g, wall, base);
    const prof = PROFILE[h.gb], gp = prof.map(([u, v]) => P(d0 + (d1 - d0) * u, H + gh * v));
    A.poly(g, gp, base);
    let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
    for (const [x, y] of wall.concat(gp)) { bx0 = Math.min(bx0, x); by0 = Math.min(by0, y); bx1 = Math.max(bx1, x); by1 = Math.max(by1, y); }
    // brick courses: convergent dashed lines are the strongest perspective cue on a wall
    const dark = A.step(base, -1), stp = d0 < 6 ? 0.28 : d0 < 15 ? 0.6 : 1.4;
    if (d0 < 40) for (let hh = stp; hh < H; hh += stp) dashLine(g, ...P(d0, hh), ...P(d1, hh), dark, 0.55, h.seed + (hh * 10 | 0));
    if (d0 < 14) speckle(g, bx0 | 0, by0 | 0, Math.ceil(bx1), Math.ceil(by1), base, h.seed);
    // plinth, cornice and the gable's top edge
    quad(g, P(d0, 0), P(d1, 0), P(d1, 0.55), P(d0, 0.55), A.step(base, -2));
    A.line(g, ...P(d0, H), ...P(d1, H), trim);
    for (let i = 0; i + 1 < gp.length; i++) if (prof[i][1] > 0 || prof[i + 1][1] > 0) A.line(g, ...gp[i], ...gp[i + 1], A.step(trim, 1));
    A.line(g, ...P(d0, 0), ...P(d0, H + (h.gb === 'roof' ? gh * 0.7 : gh * 0.3)), dark);
    // windows
    for (const w of layoutWindows(h)) {
      const a = [P(w.da, w.h0), P(w.db, w.h0), P(w.db, w.h1), P(w.da, w.h1)];
      if (w.door) {
        quadSafe(g, [P(w.da - 0.1, 0.12), P(w.db + 0.1, 0.12), P(w.db + 0.1, w.h1 + 0.1), P(w.da - 0.1, w.h1 + 0.1)], trim);
        quadSafe(g, a, h.seed % 3 === 0 ? 'green2' : 'wood1');
        if (w.da > 7) quadSafe(g, [P(w.da, w.h1 - 0.45), P(w.db, w.h1 - 0.45), P(w.db, w.h1 - 0.1), P(w.da, w.h1 - 0.1)], 'amber3');
        else A.line(g, ...P((w.da + w.db) / 2, 0.12), ...P((w.da + w.db) / 2, w.h1), 'slate1');
        continue;
      }
      const e = 0.09, fr = [P(w.da - e, w.h0 - e), P(w.db + e, w.h0 - e), P(w.db + e, w.h1 + e), P(w.da - e, w.h1 + e)];
      const bb = quadSafe(g, fr, trim), ww = bb[2] - bb[0], hh = bb[3] - bb[1];
      if (lit) {
        const nr = w.da < 7, fr2 = w.da > 11, c0 = nr ? 'amber3' : fr2 ? 'amber3' : 'amber5', c1 = nr ? 'amber2' : fr2 ? 'amber2' : 'amber4', c2 = nr ? 'amber4' : fr2 ? 'amber4' : 'amber6';
        quadSafe(g, a, c0);
        if (ww > 5) { quad(g, P(w.da, (w.h0 + w.h1) / 2 + 0.2), P(w.db, (w.h0 + w.h1) / 2 + 0.2), P(w.db, w.h1), P(w.da, w.h1), c1); quad(g, P(w.da, w.h0), P(w.db, w.h0), P(w.db, w.h0 + 0.35), P(w.da, w.h0 + 0.35), c2); }
        if (w.detail && ww >= 12) {
          const dm = (w.da + w.db) / 2, sx = Math.max(1, ww / 12);
          if (w.detail === 'plant') { quad(g, P(dm - .12, w.h0), P(dm + .12, w.h0), P(dm + .1, w.h0 + .3), P(dm - .1, w.h0 + .3), 'wood1'); for (const [ax, ay] of [[-.2, .8], [.22, .75], [0, .95]]) A.line(g, ...P(dm, w.h0 + .3), ...P(dm + ax, w.h0 + ay), 'green1'); }
          else if (w.detail === 'cat') { const c0 = P(dm, w.h0), cx = rnd(c0[0]), cy = rnd(c0[1]), r = rnd(2 + sx); A.ellipse(g, cx, cy - 2, r, 2, 'night0'); A.disc(g, cx + r, cy - 4, 1, 'night0'); A.px(g, cx + r + 1, cy - 5, 'night0'); A.px(g, cx + r - 1, cy - 5, 'night0'); A.px(g, cx + r + 1, cy - 4, 'eye3'); }
          else { quad(g, P(dm - .12, w.h0), P(dm + .12, w.h0), P(dm + .1, w.h0 + .28), P(dm - .1, w.h0 + .28), 'wood2'); A.line(g, ...P(dm, w.h0 + .28), ...P(dm, w.h0 + .75), 'green2'); const t0 = P(dm, w.h0 + .8); A.rect(g, t0[0] - 1, t0[1] - 1, 2, 2, 'red4'); }
        }
      } else {
        quadSafe(g, a, 'night2');
        if (ww > 5) { const q = P(w.da, w.h1); A.px(g, rnd(q[0]) + 1, rnd(q[1]) + 1, 'mist1'); }
      }
      if (ww >= 5 && hh >= 8) {
        A.line(g, ...P((w.da + w.db) / 2, w.h0), ...P((w.da + w.db) / 2, w.h1), trim);
        A.line(g, ...P(w.da, w.h0 + (w.h1 - w.h0) * 0.55), ...P(w.db, w.h0 + (w.h1 - w.h0) * 0.55), trim);
      }
      if (record) {
        const bw = quadBBox(a);
        WIN.push({ x0: bb[0] - 1, y0: bb[1] - 1, x1: bb[2] + 1, y1: bb[3] + 1, d: (w.da + w.db) / 2, seed: w.seed, keep: false, cx: (bw[0] + bw[2]) / 2, cy: (bw[1] + bw[3]) / 2, ww: bw[2] - bw[0], hh: bw[3] - bw[1] });
      }
    }
  };

  // a ground strip between two lateral lines, from distance d0 to d1, at height h
  const strip = (g, la, lb, d0, d1, h, c) => A.poly(g, [pj(la, d0, h), pj(lb, d0, h), pj(lb, d1, h), pj(la, d1, h)], c);
  const face = (g, lat, d0, d1, h0, h1, c) => A.poly(g, [pj(lat, d0, h0), pj(lat, d1, h0), pj(lat, d1, h1), pj(lat, d0, h1)], c);

  // a wet-ground reflection of a light: a soft elongated glow under it plus a thin broken core
  const wetStreak = (g, x, y, len, wd, strength, color, t, seed) => {
    fglow(g, x, y + 1, wd + 2, len, color, strength * 0.5, 1.4);
    wstreak(g, x, y + 2, len, wd, color, strength, t, seed);
  };
  // an airy winter-ish tree like the big one in the concept art: thin trunk, forked branches, leaf clumps
  const bigTree = (g, x, y, ht, seed, tone) => {
    const c = tone || 'night0';
    for (let k = 0; k < ht; k++) { const w = ht > 60 ? (k < ht * 0.3 ? 4 : 3) : (k < ht * 0.3 ? 2 : 1); A.rect(g, x - (w >> 1) + (k > ht * 0.5 ? rnd((k - ht * 0.5) * 0.05) : 0), y - k, w, 1, c); }
    const tips = [];
    const fork = (bx, by, ang, len, depth) => {
      const ex = bx + Math.cos(ang) * len, ey = by + Math.sin(ang) * len;
      A.line(g, bx, by, ex, ey, c, depth > 0 ? 2 : 1);
      if (depth === 0) { tips.push([ex, ey]); return; }
      if (depth === 1) tips.push([ex, ey, 1]);
      fork(ex, ey, ang - 0.5 - hash(seed + depth, 1) * 0.3, len * 0.72, depth - 1);
      fork(ex, ey, ang + 0.5 + hash(seed + depth, 2) * 0.3, len * 0.72, depth - 1);
    };
    const top = y - ht * 0.72;
    fork(x, top, -Math.PI / 2 - 0.55, ht * 0.34, 3); fork(x, top, -Math.PI / 2 + 0.5, ht * 0.36, 3); fork(x, y - ht * 0.45, -Math.PI + 0.55, ht * 0.3, 2); fork(x, y - ht * 0.5, -0.5, ht * 0.28, 2);
    const k = ht / 118;
    tips.forEach((tp, i) => { const tx = tp[0], ty = tp[1]; const r = Math.max(1, rnd((4 + Math.floor(hash(seed + i, 5) * 4)) * k * (tp[2] ? 0.7 : 1))); A.disc(g, tx, ty, r, c); if (hash(seed + i, 6) < 0.6) A.disc(g, tx + rnd(5 * k), ty + rnd(3 * k), Math.max(1, r - 2), c); if (hash(seed + i, 7) < 0.5) A.disc(g, tx - rnd(5 * k), ty + rnd(4 * k), Math.max(1, r - 2), c); });
  };
  // a puddle on wet ground: a pale sheen with the lamp's colour in it
  const puddle = (g, lat, d, rx) => {
    const x = rnd(PX(lat, d)), y = rnd(GY(d));
    A.glow(g, x, y, rx, { ry: Math.max(1, rx * 0.2), mode: 'mix', color: 'mist4', strength: 0.55, power: 0.5, q: 4 });
    A.glow(g, x + rnd(rx * 0.2), y, rx * 0.5, { ry: Math.max(1, rx * 0.1), color: 'amber5', strength: 0.4, power: 1, q: 4 });
  };
  // a wet reflection streak drawn straight into the buffer (same look as NRART.streak, without the per-row field closures)
  const wstreak = (g, x, y, len, wd, color, strength, t, seed) => {
    const Q = 5, Ls = levelsOf('add', color, strength, Q), B = g.buf, gw = g.w, ph = Math.floor(t * 3) + seed;
    x = rnd(x); y = rnd(y);
    for (let k = 0; k < len; k++) {
      const yy = y + k; if (yy < 0 || yy >= g.h) continue;
      const f = 1 - k / len, w = wd + rnd(1.6 * k / len * wd), x0 = x - (w >> 1) + (((k + ph) % 7) === 0 ? 1 : 0);
      const lv = Math.pow(f, 1.1) * (((k + ph) % 4) === 3 ? 0.35 : 1) * (0.75 + 0.25 * hash(k + seed * 9, ph >> 1));
      for (let xx = x0; xx < x0 + w; xx++) {
        if (xx < 0 || xx >= gw) continue;
        const edge = (xx === x0 || xx === x0 + w - 1) && w > 2 ? 0.55 : 1, v = lv * edge * Q; let q = v | 0; if (v - q > A.bayer(xx, yy)) q++;
        if (q > 0) B[yy * gw + xx] = Ls[q > Q ? Q : q][B[yy * gw + xx]];
      }
    }
  };
  const lampAt = (g, lat, d, o) => {
    const h = rnd(4.4 * F / d), x = rnd(PX(lat, d)), y = rnd(GY(d));
    if (h >= 26) {
      A.lamp(g, x, y, { style: 'lantern', h, light: false, seed: o.seed });
      const lx = x + 1, ly = y - h - 3;
      A.glow(g, lx, ly, Math.max(8, h * 0.28), { color: 'amber6', strength: 0.6, power: 1.5 });
      A.cone(g, lx, ly + 2, Math.PI / 2, 0.4, Math.min(h, 180 - ly) + 4, { color: 'amber5', strength: o.cone || 0.3, width: 4, fade: 0.6, edge: 0.6 });
      A.glow(g, lx, y, h * 0.55, { ry: Math.max(2, h * 0.07), color: 'amber5', strength: 0.42, power: 1 });
      wetStreak(g, x, y, Math.min(h * 0.5, 180 - y), h > 50 ? 4 : 1, 0.6, 'amber6', 0, o.seed);
    } else {
      A.rect(g, x, y - h, 1, h, 'slate1'); A.rect(g, x - 1, y - h - 2, 3, 2, 'amber7'); A.px(g, x, y - h - 3, 'slate1');
      A.glow(g, x, y - h - 1, Math.max(3, h * 0.55), { color: 'amber6', strength: 0.6, power: 1.4, q: 4 });
      A.glow(g, x, y, Math.max(3, h * 0.6), { ry: 1, color: 'amber5', strength: 0.4, power: 1, q: 4 });
      if (h > 8) wetStreak(g, x, y, rnd(h * 0.7), 1, 0.4, 'amber5', 0, o.seed);
    }
  };
  const fogAt = (g, d, a) => {
    const yb = GY(d), y0 = VY - 96;
    A.haze(g, 0, y0, g.w, yb - y0 + 1, { top: 0, bottom: a, color: 'mist3', lights: 0.12 });
  };

  // the mill's tower (static) and its sails (live), at the end of the street
  const MILL = { x: 199, y: 108, s: 0.82 };
  const millTower = (g) => {
    const { x, y, s } = MILL, bh = rnd(50 * s), b0 = rnd(11 * s), b1 = rnd(5.5 * s), top = y - bh;
    A.poly(g, [[x - b0, y], [x + b0 + 1, y], [x + b1 + 1, top], [x - b1, top]], 'night4');
    A.poly(g, [[x + rnd(b0 * 0.45), y], [x + b0 + 1, y], [x + b1 + 1, top], [x + rnd(b1 * 0.45), top]], 'night5');
    A.poly(g, [[x - b0, y], [x - rnd(b0 * 0.4), y], [x - rnd(b1 * 0.4), top], [x - b1, top]], 'night3');
    const sy = y - rnd(bh * 0.33), hw = b0 + 7;
    A.rect(g, x - hw, sy, 2 * hw + 1, 1, 'night2'); A.hline(g, x - hw, sy - 3, 2 * hw + 1, 'night3');
    A.line(g, x - hw, sy + 1, x - b0 + 1, y - 1, 'night3'); A.line(g, x + hw, sy + 1, x + b0 - 1, y - 1, 'night3');
    const cw = b1 + 2; A.poly(g, [[x - cw, top + 1], [x + cw + 1, top + 1], [x + b1 + 1, top - 5], [x - b1, top - 5]], 'night2');
    A.rect(g, x, y - rnd(bh * 0.55), 2, 3, 'amber6'); A.rect(g, x - 3, y - rnd(bh * 0.75), 1, 2, 'amber5'); A.rect(g, x + 2, y - rnd(bh * 0.42), 1, 2, 'amber5');
    A.glow(g, x + 1, y - rnd(bh * 0.55) + 1, 6, { color: 'amber5', strength: 0.3, q: 3 });
    return [x + 0.5, top - 2];
  };
  const sails = (g, hx, hy, angle, L, c1, c2) => {
    const sw = 5;
    for (let k = 0; k < 4; k++) {
      const an = angle + k * Math.PI / 2, ca = Math.cos(an), sa = Math.sin(an), px = -sa, py = ca, a0 = 0.2 * L;
      A.poly(g, [[hx + ca * a0, hy + sa * a0], [hx + ca * L, hy + sa * L], [hx + ca * L + px * sw, hy + sa * L + py * sw], [hx + ca * a0 + px * sw, hy + sa * a0 + py * sw]], 'mist1');
      A.line(g, hx, hy, hx + ca * L, hy + sa * L, c1);
      A.line(g, hx + ca * L, hy + sa * L, hx + ca * L + px * sw, hy + sa * L + py * sw, c2);
      A.line(g, hx + ca * L + px * sw, hy + sa * L + py * sw, hx + ca * a0 + px * sw, hy + sa * a0 + py * sw, c2);
      A.line(g, hx + ca * a0 + px * sw, hy + sa * a0 + py * sw, hx + ca * a0, hy + sa * a0, c2);
      for (let i = 1; i < 6; i += 2) { const f = a0 + (L - a0) * i / 6; A.line(g, hx + ca * f, hy + sa * f, hx + ca * f + px * sw, hy + sa * f + py * sw, c2); }
    }
    A.rect(g, rnd(hx) - 1, rnd(hy) - 1, 2, 2, c1);
  };

  let HUB = [0, 0];
  const paintStatic = (g, lit) => {
    g.buf.fill(A.C.night1); g.mask.fill(0); A.depth(g, 1); A.key(g, VX, 70, 1);
    // ---- sky: cold night above, pale fog on the horizon
    const SKY = ['night0', 'night1', 'night2', 'night3', 'mist0', 'mist1', 'mist2', 'mist3'], sg = (VY + 6) / (SKY.length - 1);
    for (let i = 0; i + 1 < SKY.length; i++) A.ditherGradient(g, 0, rnd(i * sg), g.w, Math.ceil(sg) + 1, SKY[i], SKY[i + 1], 'down');
    A.stars(g, 1.3, { n: 26, y0: 2, y1: 56, seed: 11 });
    A.haze(g, 0, 40, g.w, 70, { top: 0.0, bottom: 0.55, color: 'mist3' });
    // ---- far skyline: spire and mill, almost lost in the fog
    A.church(g, 170, 108, 0.8, { tone: 'night4', clock: false });
    HUB = millTower(g);
    A.haze(g, 0, 40, g.w, 72, { top: 0.15, bottom: 0.7, color: 'mist4' });
    // ---- ground: road, pavements, kerbs, canal
    A.rect(g, 0, VY, g.w, 80, 'slate1');
    strip(g, -KERB, KERB, 0.9, 900, 0, 'slate1');
    strip(g, -LFRONT - 3, -KERB, 0.9, 900, 0.12, 'slate2');
    strip(g, KERB, QUAY, 0.9, 900, 0.12, 'slate2');
    face(g, QUAY, 0.9, 900, 0.12, -0.6, 'slate0');
    strip(g, QUAY, BANK, 0.9, 900, -0.6, 'night2');
    face(g, BANK, 0.9, 900, -0.6, 0, 'night0');
    strip(g, BANK, BANK + 8, 0.9, 900, 0, 'slate1');
    A.ditherGradient(g, 0, VY, g.w, 60, 'slate1', 'slate2', 'up');
    for (let d = 1.2; d < 14; d += d < 6 ? 0.55 : 1.4) {
      A.line(g, ...pj(-LFRONT - 3, d, 0.12), ...pj(-KERB, d, 0.12), 'slate1'); A.line(g, ...pj(KERB, d, 0.12), ...pj(QUAY, d, 0.12), 'slate1');
    }
    for (const s of [-1, 1]) {
      A.line(g, ...pj(s * KERB, 0.9, 0.12), ...pj(s * KERB, 400, 0.12), 'slate5');
      A.line(g, ...pj(s * KERB, 0.9, 0), ...pj(s * KERB, 400, 0), 'slate0');
    }
    A.line(g, ...pj(QUAY, 0.9, 0.12), ...pj(QUAY, 400, 0.12), 'slate4');
    A.glow(g, VX, VY + 12, 70, { ry: 16, mode: 'mix', color: 'mist3', strength: 0.3, power: 0.9, q: 5 });
    for (let d = 1.6; d < 70; d += d < 8 ? 2.6 : d < 20 ? 4.5 : 9) quad(g, pj(-0.07, d, 0), pj(0.07, d, 0), pj(0.07, d + 1.3 + d * 0.03, 0), pj(-0.07, d + 1.3 + d * 0.03, 0), 'mist5');
    // ---- the painter's pass: everything from far to near, fog after each depth band
    const items = [];
    HOUSES.forEach(h => items.push({ d: h.d1, fn: () => paintHouse(g, h, lit, !lit && !WIN.done) }));
    const FD = [1, 1.4, 1.9, 2.6, 3.5, 4.7, 6.3, 8.5, 11.5, 15, 20, 27, 36, 50, 70, 100, 150, 230, 400];
    for (let i = 0; i + 1 < FD.length; i++) {
      const d0 = FD[i], d1 = FD[i + 1];
      items.push({ d: d1, fn: () => {
        face(g, -5.1, d0, d1, 0, 1.45, 'green0'); face(g, -5.1, d0, d1, 1.1, 1.45, 'green1');
        if (d0 < 12) { const bb = quadBBox([pj(-5.1, d0, 0), pj(-5.1, d1, 0), pj(-5.1, d1, 1.45), pj(-5.1, d0, 1.45)]); speckle(g, bb[0], bb[1], bb[2], bb[3], 'green0', d0 * 7 | 0); }
        if (d0 < 26) { for (let d = d0; d < d1; d += Math.max(0.05, d * d / 42)) A.line(g, ...pj(-4.8, d, 0), ...pj(-4.8, d, 0.95), 'slate3'); A.line(g, ...pj(-4.8, d0, 0.7), ...pj(-4.8, d1, 0.7), 'slate2'); A.line(g, ...pj(-4.8, d0, 0.25), ...pj(-4.8, d1, 0.25), 'slate2'); }
        else face(g, -4.8, d0, d1, 0, 0.9, 'slate2');
      } });
    }
    for (const [d0, d1] of [[1, 2.4], [2.4, 4.2], [4.2, 7], [7, 11], [11, 18], [18, 30], [30, 60]]) items.push({ d: d1, fn: () => {
      A.line(g, ...pj(QUAY - 0.05, d0, 0.95), ...pj(QUAY - 0.05, d1, 0.95), 'slate4'); A.line(g, ...pj(QUAY - 0.05, d0, 0.5), ...pj(QUAY - 0.05, d1, 0.5), 'slate3');
      for (let d = d0; d < d1; d += 1.1) A.line(g, ...pj(QUAY - 0.05, d, 0.1), ...pj(QUAY - 0.05, d, 1.0), 'slate4');
    } });
    [[-KERB - 0.2, 2.4, 1], [KERB + 0.2, 4.9, 2], [-KERB - 0.2, 9.4, 3], [KERB + 0.2, 15.5, 4], [-KERB - 0.2, 26, 5], [KERB + 0.2, 42, 6]].forEach(([lat, d, k]) => items.push({ d, fn: () => lampAt(g, lat, d, { seed: k, cone: k === 1 ? 0.34 : 0.26 }) }));
    items.push({ d: 1.9, fn: () => bigTree(g, rnd(PX(-5.5, 1.75)), rnd(GY(1.75)) + 6, 118, 7) });
    items.push({ d: 3.8, fn: () => bigTree(g, rnd(PX(9.7, 3.8)), rnd(GY(3.8)), rnd(7 * F / 3.8), 9, 'night1') });

    items.push({ d: 10, fn: () => { const x0 = rnd(PX(QUAY, 10)), x1 = rnd(PX(BANK, 10)); A.archBridge(g, x0, rnd(PY(-0.5, 10)), x1 - x0, 6, { brick: 'brick2' }); } });
    [1.7, 3.1, 4.6, 6.4, 8.9].forEach(d => items.push({ d, fn: () => { const x = rnd(PX(-KERB + 0.15, d)), y = rnd(GY(d)); A.bollard(g, x, y, { h: Math.max(3, rnd(0.95 * F / d)) }); } }));
    items.push({ d: 2.4, fn: () => A.omafiets(g, rnd(PX(-4.3, 2.1)) + 4, rnd(GY(2.1)) + 1, { rider: false, speed: 0 }) });
    items.push({ d: 1.7, fn: () => A.tulips(g, rnd(PX(-4.3, 1.6)) - 6, rnd(GY(1.5)) - 2, 14) });
    items.push({ d: 2.6, fn: () => { puddle(g, -1.6, 2.7, 15); puddle(g, 1.3, 4.4, 10); puddle(g, -0.4, 7.5, 6); } });
    items.push({ d: 1.4, fn: () => { A.reeds(g, 262, 182, 58, 30, { tone: 'night0', seed: 3, dense: 0.55 }); A.reeds(g, 298, 182, 30, 42, { tone: 'night0', seed: 5, dense: 0.5 }); } });
    items.sort((a, b) => b.d - a.d);
    const FOG = [[70, 0.5], [38, 0.38], [22, 0.3], [13, 0.24], [8, 0.18], [4.8, 0.1], [3, 0.05]];
    let bi = 0;
    for (const it of items) {
      while (bi < FOG.length && it.d < FOG[bi][0]) { fogAt(g, FOG[bi][0], FOG[bi][1]); bi++; }
      it.fn();
    }
    while (bi < FOG.length) { fogAt(g, FOG[bi][0], FOG[bi][1]); bi++; }
    // ---- the canal: mirror the far bank, darkened, with broken lines
    const Lm = A.lut('mix', 'mist3', 0.4), Ld = A.lut('mix', 'night2', 0.5), Lg = A.lut('mix', 'night2', 0.72), B = g.buf, gw = g.w;
    for (let y = VY + 1; y < 180; y++) for (let x = VX + 6; x < gw; x++) {
      const dd = (x - VX), yb = VY + 0.2444 * dd, yq = VY + 0.5238 * dd;
      if (y <= yb + 1 || y >= yq) continue;
      const ym = VY + 0.2416 * dd, ys = rnd(2 * ym - y); if (ys < 0 || ys >= y) continue;
      const off = rnd(Math.sin(y * 0.9 + x * 0.05) * 1.2), sx = cl(x + off, 0, gw - 1), c = B[ys * gw + sx];
      let v = (hash(y, 3) < 0.2) ? Lg[c] : Ld[c];
      if (0.75 * Math.pow(1 - (y - yb) / (yq - yb), 0.8) > A.bayer(x, y)) v = Lm[v];
      B[y * gw + x] = v;
    }
    if (!lit) WIN.done = true;
  };

  // ---------------------------------------------------------------- the phone-talkers (alive, drawn every frame)
  const TALK = [
    { x: PX(-3.9, 3.6), y: GY(3.6), h: 23, mode: 'ear', face: 1, coat: 'mist2', legs: 'night3', hair: 'wood3', k: 0 },
    { x: PX(3.9, 3.7), y: GY(3.7), h: 22, mode: 'chest', face: -1, coat: 'red3', legs: 'night1', hair: 'night0', k: 2 },
    { x: PX(-4.1, 7.6), y: GY(7.6), h: 11, mode: 'ear', face: 1, coat: 'slate4', legs: 'night1', hair: 'paper2', k: 4 },
    { x: PX(3.8, 10.5), y: GY(10.5), h: 8, mode: 'ear', face: -1, coat: 'steel2', legs: 'night1', hair: 'night1', k: 6 },
  ];
  const talker = (g, o, t) => {
    const { mode } = o, x = o.x, h = o.h, y = o.y, dir = o.face, w = Math.max(1, rnd(h / 8)), hd = Math.max(1, rnd(h / 9));
    const hy = rnd(y - h * 0.82), ty = rnd(y - h * 0.74), cx = rnd(x);
    fglow(g, cx, rnd(y), h / 3, 2, 'black', 0.55, 0.6, 'mul', 4);
    A.begin(g);
    A.rect(g, cx - w, rnd(y - h * 0.42), 2 * w, rnd(h * 0.42), o.legs);
    if (h > 16) A.rect(g, cx - w - 1, rnd(y) - 1, 2 * w + 2, 1, 'slate0');
    A.poly(g, [[cx - w - 1.5, ty], [cx + w + 1.5, ty], [cx + w + 2, rnd(y - h * 0.38)], [cx - w - 2, rnd(y - h * 0.38)]], o.coat);
    A.rect(g, cx - 1, rnd(ty - 1), 2, 2, o.coat);
    A.disc(g, cx, hy - 1, hd + (h > 16 ? 1 : 0), o.hair);
    if (h > 16) A.hline(g, cx - hd, hy - hd - 1, 2 * hd + 1, A.step(o.hair, 1));
    let gx, gy2;
    if (mode === 'ear') {
      const px = cx + dir * (hd + 2), py = hy - 1;
      A.line(g, cx + dir * (w + 1), ty + 1, px, py + 3, o.coat); A.line(g, cx + dir * (w + 1), ty + 2, px, py + 4, A.step(o.coat, -1));
      A.rect(g, px - (dir < 0 ? 0 : 1), py - 1, 2, h > 16 ? 4 : 2, 'slate0'); A.px(g, px, py, 'phone5');
      gx = px; gy2 = py;
    } else {
      const px = cx + dir * (w + 3), py = rnd(y - h * 0.62);
      A.line(g, cx + dir * (w + 1), ty + 2, px, py, o.coat); A.rect(g, px - 1, py - 2, 3, 3, 'phone3'); A.px(g, px, py - 1, 'phone5');
      gx = px; gy2 = py - 1;
    }
    A.end(g);
    const pulse = 0.82 + 0.18 * Math.sin(t * TAU / 2.5 + o.k);
    fglow(g, gx, gy2, Math.max(4, h / 2.6), Math.max(4, h / 2.6), 'phone4', 0.85 * pulse, 1.2, 'add', 5);
    A.px(g, gx, gy2, 'phone5');
  };

  // ---------------------------------------------------------------- the words
  const WORDS = [
    { w: 'hallo?', t0: 0, kind: 'hello' },
    { w: 'gezellig', t0: 0.9, lane: 1.1, v: 0.8, a: 0.36, tmax: 11 },
    { w: 'de', t0: 3.9, lane: -0.8, v: 0.8, a: 0.4, tmax: 10.5, kind: 'pairA' },
    { w: 'het', t0: 4.2, lane: 0.8, v: 0.8, a: 0.4, tmax: 10.5, kind: 'pairB' },
    { w: 'lekker', t0: 6.3, lane: 1.3, v: 0.9, a: 0.55, tmax: 8.5 },
    { w: 'fiets', t0: 7.3, lane: -2.7, v: 0.9, a: 0.6, tmax: 7.2 },
    { w: 'doei', t0: 8.4, kind: 'last' },
  ];
  const DOEI_END = 15.5;
  const wordState = (W, t) => {
    const tau = (((t - W.t0) % T) + T) % T;
    let d, lat, e = 1;
    if (W.kind === 'hello') {
      if (tau > 14.6) return null;
      const arrive = sm(0.2, 2.2, tau), rec = Math.max(0, tau - 5.6);
      d = 3.9 - 0.55 * arrive + (tau > 5.6 ? 0.8 * rec + 0.52 * rec * rec : 0);
      lat = tau > 5.6 ? -3.1 * (1 - sm(5.6, 9.5, tau)) - 0.4 * sm(5.6, 9.5, tau) : -1.2 - 1.9 * arrive;
      e = 1 - sm(13.2, 14.6, tau);
    } else if (W.kind === 'last') {
      if (tau > DOEI_END - W.t0) return null;
      const ph = tau * 9.5 / (DOEI_END - W.t0);          // the whole walk is squeezed into the time that is left
      d = ph < 6 ? 3.6 + 0.7 * ph + 0.25 * ph * ph : 16.8 + 9.2 * sm(6, 9.2, ph) + 0.35 * Math.max(0, ph - 9.2);
      lat = 0.0; e = 1 - sm(8.6, 9.5, ph);
      return { tau: ph, d, lat, e, grow: sm(0, 1.3, ph) };
    } else {
      if (tau > W.tmax) return null;
      d = 2.9 + W.v * tau + W.a * tau * tau; lat = W.lane;
      if (W.kind === 'pairB') lat = W.lane - 1.5 * Math.exp(-Math.pow((tau - 2.1) * 1.5, 2)) + 0.5 * sm(2, 4, tau);
      if (W.kind === 'pairA') lat = W.lane - 0.55 * Math.exp(-Math.pow((tau - 2.35) * 1.6, 2));
      e = 1 - sm(W.tmax - 1.4, W.tmax, tau);
    }
    return { tau, d, lat, e, grow: sm(0, 1.3, tau) };
  };

  const cache = new WeakMap(), TW = new Map();
  const tw = (str) => { let v = TW.get(str); if (v === undefined) { v = Math.ceil(A.textWidth(str, 5, true)) + 8; TW.set(str, v); } return v; };
  // a speech bubble whose text width is measured once
  const speak = (g, x, y, str) => {
    const w = tw(str), h = 10, bx = Math.max(2, Math.min(A.W - w - 2, x - w / 2)), by = y - 3 - h;
    A.bubble(g, bx, by, w, h, { text: str, tail: [x, y - 1], size: 5 });
  };
  const POST = { x: rnd(PX(3.8, 2.0)), y: rnd(GY(2.0)) + 4 };
  A.panels[3] = {
    text: 'The language had been ignored for years. Every time someone tried, the Dutch switched to English. One night it left.',
    nl: 'De taal werd al jaren genegeerd. Elke keer als iemand een poging deed, schakelden de Nederlanders over op Engels. Op een nacht is hij vertrokken.',
    draw(g, t) {
      t = ((t % T) + T) % T;
      let c = cache.get(g);
      if (!c) {
        const L0 = A.labels.length;
        paintStatic(g, false); const dark = g.buf.slice();
        paintStatic(g, true); const lit = g.buf.slice();
        // the fingerpost's pixels go into the cache; its text labels are kept and re-posted every frame
        g.buf.set(dark); A.fingerpost(g, POST.x, POST.y, { signs: [['Nederlands', 'left'], ['Engels', 'right']] });
        const post = A.labels.slice(L0); const postBuf = g.buf.slice(); A.labels.length = L0;
        for (let i = 0; i < dark.length; i++) if (postBuf[i] !== dark[i]) { dark[i] = postBuf[i]; lit[i] = postBuf[i]; }
        // window records: who stays lit, and a sparse patch of the light each window spills on the wall around it
        const scratch = new Uint8Array(dark.length), pseudo = { buf: scratch, w: g.w, h: g.h };
        WIN.forEach((w, i) => {
          w.keep = hash(i, 91) < 0.07 && w.ww >= 2; w.j = hash(i, 92); w.patch = null;
          if (w.ww < 4) return;
          scratch.set(dark); const r = Math.min(22, rnd(4 + w.ww * 0.8)); fglow(pseudo, w.cx, w.cy, r, r, 'amber5', 0.24, 1.2, 'add', 3);
          const idx = [], val = [];
          for (let y = Math.max(0, rnd(w.cy) - r); y <= Math.min(g.h - 1, rnd(w.cy) + r); y++) for (let x = Math.max(0, rnd(w.cx) - r); x <= Math.min(g.w - 1, rnd(w.cx) + r); x++) { const k = y * g.w + x; if (scratch[k] !== dark[k]) { idx.push(k); val.push(scratch[k]); } }
          w.patch = { idx: Uint32Array.from(idx), val: Uint8Array.from(val) };
        });
        c = { dark, lit, post }; cache.set(g, c);
      }
      g.buf.set(c.dark); g.mask.fill(0);
      for (const l of c.post) A.labels.push(l);
      const st = WORDS.map(W => wordState(W, t));
      const gz = st[1];
      // the "dark front": how far the lead word has got; windows behind it go out. At the end the street relights.
      const front = gz ? gz.d : (t > 0.9 + 11 ? 400 : 0);
      const relight = sm(14.9, 15.95, t);
      // ---- windows: copy lit pixels from the lit pass; a window that is dying flickers on and off
      const B = g.buf, LB = c.lit, gw = g.w;
      for (const w of WIN) {
        let lv = 1;
        if (!w.keep) {
          const off = front > w.d + 0.8 + w.j * 1.6;
          lv = off ? 0 : 1;
          if (!off && front > w.d + 0.2 + w.j * 1.6) lv = hash(w.seed | 0, Math.floor(t * 9)) < 0.5 ? 1 : 0;
          if (t > 14.9 && off) { const r = (relight - w.j * 0.6) / 0.4; lv = r <= 0 ? 0 : r >= 1 ? 1 : (hash(w.seed | 0, Math.floor(t * 14)) < r ? 1 : 0); }
        } else if (hash(w.seed | 0, Math.floor(t * 5)) < 0.05) lv = 0;
        if (lv <= 0) continue;
        if (w.patch) { const { idx, val } = w.patch; for (let k = 0; k < idx.length; k++) B[idx[k]] = val[k]; }
        const x0 = Math.max(0, w.x0), x1 = Math.min(gw - 1, w.x1), y0 = Math.max(0, w.y0), y1 = Math.min(g.h - 1, w.y1);
        if (x1 < x0) continue;
        if (lv >= 1) for (let y = y0; y <= y1; y++) B.set(LB.subarray(y * gw + x0, y * gw + x1 + 1), y * gw + x0);
        else for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (lv > A.bayer(x, y)) B[y * gw + x] = LB[y * gw + x];
      }
      for (const [lx, ly, r] of [[PX(-KERB - 0.2, 2.4) + 1, GY(2.4) - 4.4 * F / 2.4 - 3, 9], [PX(KERB + 0.2, 4.9) + 1, GY(4.9) - 4.4 * F / 4.9 - 3, 6]]) {
        const fl = 0.8 + 0.2 * Math.sin(t * 7 + lx) * Math.sin(t * 2.3);
        fglow(g, lx, ly, r, r, 'amber7', 0.35 * fl, 1.5);
      }
      // ---- glints on the canal
      for (let i = 0; i < 7; i++) {
        const k = Math.floor(t * 2.2 + i * 0.43);
        if (hash(i, k) < 0.4) continue;
        const dd = 24 + hash(i, 3) * 90, yy = VY + (0.2444 + (0.18 + hash(i, k + 9) * 0.7) * 0.2794) * dd;
        A.rect(g, VX + dd, yy, 1 + (hash(i, k + 5) < 0.4 ? 1 : 0), 1, 'mist5');
      }
      // ---- the mill's sails turn the right way (anticlockwise)
      sails(g, HUB[0], HUB[1] - 1, -t * 0.32, 24, 'night4', 'night3');
      // ---- key light follows the lead word
      const leadI = st[1] ? 1 : st[4] ? 4 : st[0] ? 0 : -1;
      const lk = leadI >= 0 ? { x: PX(st[leadI].lat, st[leadI].d), y: PY(1.0, st[leadI].d) } : { x: VX, y: 100 };
      A.key(g, lk.x, lk.y, 1);
      // ---- the people, talking English into their phones with their backs turned
      TALK.forEach(o => talker(g, o, t));
      // ---- the words
      const over = [];
      const order = st.map((s, i) => [s, i]).filter(p => p[0]).sort((a, b) => b[0].d - a[0].d);
      for (const [s, i] of order) {
        const W = WORDS[i], d = s.d, x = rnd(PX(s.lat, d)), gy = rnd(GY(d));
        const bob = Math.sin(t * 1.4 + i * 2.1) * (d < 6 ? 1.4 : 0.6);
        let hy = PY(W.kind === 'last' ? 1.05 + 1.9 * sm(5, 7, s.tau) : 1.05, d) + bob; if (W.kind === 'hello' && s.tau > 5.6) hy += 2 * sm(5.6, 6.6, s.tau);
        const cy = rnd(hy), e = s.e * s.grow;
        const rx = cl(rnd(80 / d), 2, 26), ry = cl(rnd(rx * 0.2), 1, 5);
        fglow(g, x, gy, rx, ry, 'amber5', 0.6 * e, 1.1);
        const sl = cl(rnd(110 / d), 2, 22);
        if (d < 34) wetStreak(g, x, gy, sl, d < 5 ? 2 : 1, 0.7 * e, d < 8 ? 'amber6' : 'amber5', t, i * 5 + 3);
        const tone = d < 5.5 ? 'amber7' : d < 10 ? 'amber6' : d < 18 ? 'amber5' : d < 30 ? 'amber4' : 'mist5';
        if (d < 4.9) {
          const size = Math.max(6, Math.min(10, rnd(29 / d))), fs = rnd(6 + (size - 6) * s.grow);
          fglow(g, x, cy, 7 + fs, 4 + fs * 0.5, 'amber5', 0.5 * e, 1.3);
          over.push([x, cy + fs * 0.35, W.w, tone, fs]);
        } else {
          const h = d < 7 ? 5 : d < 9.5 ? 4 : d < 14 ? 3 : d < 22 ? 2 : 1, hh = W.kind === 'last' ? Math.max(4, h) : h;
          fglow(g, x, cy, cl(rnd(70 / d), 3, 14), cl(rnd(30 / d), 2, 6), 'amber5', 0.45 * e, 1.3, 'add', 3);
          let keepP = 1, col = tone;
          if (W.kind === 'last') { const f = sm(8.5, 9.5, s.tau); col = f > 0.8 ? 'mist5' : f > 0.5 ? 'amber4' : f > 0.2 ? 'amber5' : 'amber6'; keepP = 1 - sm(9.0, 9.5, s.tau); }
          else keepP = s.e > 0.5 ? 1 : 0.55 * s.e + 0.25;
          const wave = (W.kind === 'last' && s.tau > 6.5) ? (Math.sin(t * 5) > 0.2 ? 1 : 0) : 0;
          pixWord(g, W.w, x, cy - wave, hh, col, keepP, i * 17);
          if (W.kind === 'last') fglow(g, x, cy, 14, 8, 'amber5', 0.5 * (1 - sm(8.8, 9.5, s.tau)), 1.2, 'add', 4);
        }
      }
      // ---- the fog closes over the end of the street, thickest while 'doei' hangs there
      const ds = st[6], dl = ds ? sm(5.8, 8.8, ds.tau) : 0, closing = ds ? sm(8.4, 9.1, ds.tau) : 0;
      for (let k = 0; k < 2; k++) {
        const cx = VX + 18 * Math.sin(t * 0.35 + k * 2.6), cyy = VY + 3 + k * 2 + Math.sin(t * 0.5 + k) * 2;
        fglow(g, cx, cyy, 52 - k * 14, 19 - k * 4, 'mist4', 0.2 + 0.1 * dl + 0.45 * closing, 0.8, 'mix', 5);
      }
      over.forEach(([x, y, w, col, fs]) => A.text(x, y, w, col, fs, true, { align: 'center', shadow: true }));
      // ---- the one-line story
      const hs = st[0], t1 = TALK[0], t2 = TALK[1];
      const head = (o) => [rnd(o.x), rnd(o.y - o.h * 0.82) - Math.max(1, rnd(o.h / 9)) - 3];
      if (hs && hs.tau > 2.8 && hs.tau < 5.7) { const [hx, hy] = head(t1); speak(g, hx, hy, 'sorry, English?'); }
      else if (t < 2.6 || (t > 10.2 && t < 12.6)) { const [hx, hy] = head(t2); speak(g, hx, hy, t < 2.6 ? 'omg, same' : 'yeah no, so fine'); }
    },
  };
})();
