// Panel 3: nobody agrees on what caused it. A wall of rumours in the mist: a hero exhibit (the
// mouldy cheese), the poll where Flemish wins, the millionth tourist laughing, a red string of
// conspiracy between them. Amber only in pools (one bare bulb per board) inside a cold blue night.
//
// Speed: the wall, boards and cobbles never change, so they are painted once into a cache and
// copied back each frame; only the animated parts and the light run live. Static words are
// recorded at build time and replayed every frame (labels are cleared by the caller).
(function () {
  const A = window.NRART;
  const W = 320, H = 180, WALL = 39;
  const h01 = (a, b) => { let n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return n - Math.floor(n); };
  const ease = u => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, u)));
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);

  // ---------------------------------------------------------------- local fast light
  const lvl = new Map(), falls = new Map();
  function levelsOf(mode, c, s, Q) {
    s = Math.round(s * 20) / 20; const k = mode + c + s + Q; let L = lvl.get(k);
    if (!L) { L = []; for (let q = 0; q <= Q; q++) L.push(A.lut(mode, c, s * q / Q)); lvl.set(k, L); }
    return L;
  }
  function fallTab(pw) {
    // indexed by the squared distance (0..1 in 256 steps), so the inner loop needs no sqrt
    let T = falls.get(pw); if (!T) { T = new Float32Array(257); for (let i = 0; i <= 256; i++) T[i] = Math.pow(1 - Math.sqrt(i / 256), pw); falls.set(pw, T); }
    return T;
  }
  // an elliptical light (add), shade (mul) or fog (mix), dithered between palette levels
  function glow(g, x, y, rx, ry, o) {
    const Q = o.q || 4, Ls = levelsOf(o.mode || 'add', o.color || 'amber5', o.strength == null ? 0.5 : o.strength, Q), tab = fallTab(o.power == null ? 1.2 : o.power);
    const buf = g.buf, c = o.clip || [0, 0, W - 1, H - 1], ref = o.ref, refOff = WALL * W; x = Math.round(x); y = Math.round(y);
    for (let yy = Math.max(c[1], Math.ceil(y - ry)), ye = Math.min(c[3], Math.floor(y + ry)); yy <= ye; yy++) {
      const dy = (yy - y) / ry, dy2 = dy * dy; if (dy2 >= 1) continue;
      const hx = Math.floor(rx * Math.sqrt(1 - dy2)), xa = Math.max(c[0], x - hx), xb = Math.min(c[2], x + hx);
      for (let xx = xa; xx <= xb; xx++) {
        const dx = (xx - x) / rx, d2 = dx * dx + dy2; if (d2 >= 1) continue;
        const v = tab[(d2 * 256) | 0] * Q; let q = v | 0; if (v - q > BAY[((yy & 3) << 2) | (xx & 3)]) q++;
        if (q > 0) { const i = yy * W + xx; if (ref && buf[i] === ref[i - refOff]) continue; buf[i] = Ls[q > Q ? Q : q][buf[i]]; }
      }
    }
  }
  const shadow = (g, x, y, rx, ry, s) => glow(g, x, y, rx, ry, { mode: 'mul', color: 'black', strength: s == null ? 0.55 : s, power: 0.6 });
  // an even wash over a rect, dithered (fog, flash)
  function wash(g, x, y, w, h, color, amount, mode) {
    const Q = 8, Ls = levelsOf(mode || 'mix', color, 1, Q), buf = g.buf, v = Math.min(1, amount) * Q, qb = v | 0, fr = v - qb;
    for (let yy = Math.max(0, y), ye = Math.min(H, y + h); yy < ye; yy++) for (let xx = Math.max(0, x), xe = Math.min(W, x + w); xx < xe; xx++) {
      const q = qb + (fr > BAY[((yy & 3) << 2) | (xx & 3)] ? 1 : 0); if (q > 0) { const i = yy * W + xx; buf[i] = Ls[q > Q ? Q : q][buf[i]]; }
    }
  }
  // drifting mist band, a cheaper copy of NRART.mist (same look, noise from a table)
  const NZ1 = {}, NZ2 = {};
  function noiseTab(store, seed, k, off, len) {
    const key = seed; if (store[key]) return store[key];
    const tab = new Float32Array(W * 4 * len); for (let i = 0; i < tab.length; i++) tab[i] = A.wave(i / 4 * k + off, W, seed); store[key] = tab; return tab;
  }
  function fog(g, t, y, h, o) {
    const amt = o.amount, sp = o.speed, seed = o.seed || 0, Ls = levelsOf('mix', o.color || 'mist5', 1, 8), buf = g.buf;
    const n1 = noiseTab(NZ1, seed, 1, 0, 1), n2 = noiseTab(NZ2, seed + 3, 0.5, 40, 2), cy0 = y + h / 2;
    for (let xx = 0; xx < W; xx++) {
      const pi = Math.round((xx + t * sp) * 4), ix = ((pi % (W * 4)) + W * 4) % (W * 4), ix2 = ((pi % (W * 8)) + W * 8) % (W * 8), n = n1[ix], n2v = n2[ix2];
      const th = Math.max(0.5, h * (0.35 + 0.65 * n) / 2), cy = cy0 + (n2v - 0.5) * h * 0.5, inv = 1 / th;
      const r0 = Math.max(0, Math.ceil(cy - th)), r1 = Math.min(H - 1, Math.floor(cy + th)), k = amt * (0.55 + 0.45 * n) * 8;
      for (let yy = r0; yy <= r1; yy++) {
        const d = (yy + 0.5 - cy) * inv, d2 = d * d; if (d2 >= 1) continue;
        const v = k * (1 - d2); let q = v | 0; if (v - q > BAY[((yy & 3) << 2) | (xx & 3)]) q++;
        if (q > 0) { const i = yy * W + xx; buf[i] = Ls[q > 8 ? 8 : q][buf[i]]; }
      }
    }
  }
  const EDGE_L = [], EDGE_R = [];
  for (let i = 0; i < 76; i++) { EDGE_L.push(Math.pow(1 - i / 76, 1.3) * 0.62); EDGE_R.push(Math.pow((i + 1) / 76, 1.3) * 0.55); }
  // fog that thickens toward both edges of the wall: the exhibits dissolve at the sides
  function edgeFog(g, y0, y1, xa, xb, ref) {
    const Ls = levelsOf('mix', 'mist2', 1, 8), buf = g.buf, refOff = WALL * W;
    for (let xx = Math.max(0, xa); xx < Math.min(W, xb); xx++) {
      const e = xx < 76 ? EDGE_L[xx] : xx >= 244 ? EDGE_R[xx - 244] : 0; if (e <= 0) continue;
      for (let yy = y0; yy < y1; yy++) {
        const v = e * (0.85 + 0.15 * Math.sin(yy * 0.37 + xx * 0.11)) * 8; let q = v | 0; if (v - q > BAY[((yy & 3) << 2) | (xx & 3)]) q++;
        if (q > 0) { const i = yy * W + xx; if (ref && buf[i] === ref[i - refOff]) continue; buf[i] = Ls[q > 8 ? 8 : q][buf[i]]; }
      }
    }
  }

  // ---------------------------------------------------------------- text: recorded once, replayed
  let building = false; const statics = [];
  const T = (x, y, s, c, sz, b, o) => { if (building) statics.push([x, y, s, c, sz, b, o]); else A.text(x, y, s, c, sz, b, o); };

  // ---------------------------------------------------------------- small drawing helpers
  function tpoly(g, x, y, w, h, a, c) { // a tilted paper: a is the rise across the width in px
    A.poly(g, [x, y + a, x + w, y, x + w, y + h - a, x, y + h], c);
  }
  // a pinned paper with a real headline (str may be an array of lines)
  function note(g, x, y, str, o) {
    o = o || {}; const lines = Array.isArray(str) ? str : [str], sz = o.size || 5, tilt = o.tilt || 0;
    const w = o.w || Math.ceil(Math.max(...lines.map(s => A.textWidth(s, sz, true)))) + 6, h = o.h || 9;
    if (tilt) { tpoly(g, x + 1, y + 1, w, h, tilt, 'night0'); tpoly(g, x, y, w, h, tilt, o.tone || 'paper3'); A.line(g, x, y + tilt, x + w - 1, y, 'paper5'); }
    else { A.rect(g, x + 1, y + 1, w, h, 'night0'); A.rect(g, x, y, w, h, o.tone || 'paper3'); A.hline(g, x, y, w, 'paper5'); }
    const py = y + (tilt > 0 ? tilt >> 1 : 0) - 1;
    A.rect(g, x + (w >> 1) - 1, py, 3, 3, 'red5'); A.px(g, x + (w >> 1) - 1, py, 'paper6');
    lines.forEach((s, i) => T(x + w / 2, y + h - 2 - (lines.length - 1 - i) * (sz + 1) + (tilt ? tilt >> 1 : 0), s, o.ink || 'night1', sz, true, { align: 'center' }));
    return w;
  }
  // a wooden board with a flat three-step backdrop (dither only at the two seams)
  function frame(g, x, y, w, h) {
    A.rect(g, x - 3, y - 3, w + 6, h + 6, 'wood1');
    A.hline(g, x - 3, y - 3, w + 6, 'wood3'); A.hline(g, x - 3, y - 2, w + 6, 'wood2');
    A.vline(g, x - 3, y - 3, h + 6, 'wood2'); A.vline(g, x + w + 2, y - 3, h + 6, 'wood0'); A.hline(g, x - 3, y + h + 2, w + 6, 'wood0');
    for (const [a, b] of [[x - 2, y - 2], [x + w + 1, y - 2], [x - 2, y + h + 1], [x + w + 1, y + h + 1]]) A.px(g, a, b, 'steel3');
    const a = Math.round(h * 0.36), b = Math.round(h * 0.7);
    A.rect(g, x, y, w, a, 'night3'); A.rect(g, x, y + a, w, b - a, 'night2'); A.rect(g, x, y + b, w, h - b, 'night1');
    A.ditherGradient(g, x, y + a - 3, w, 6, 'night3', 'night2', 'down'); A.ditherGradient(g, x, y + b - 3, w, 6, 'night2', 'night1', 'down');
    A.hline(g, x, y, w, 'night1'); A.hline(g, x, y + 1, w, 'night2'); // the top rail shades the board
  }
  function bulbStatic(g, bx, by) {
    A.vline(g, bx, 43, by - 45, 'slate3'); A.rect(g, bx - 1, by - 3, 3, 2, 'steel2');
    A.disc(g, bx, by, 2, 'amber7'); A.px(g, bx, by, 'amber8');
  }
  // the flicker is live: a small bright halo and a soft pool that breathe with the bulb
  function bulbLive(g, bx, by, fl) {
    glow(g, bx, by, 9, 9, { color: 'amber7', strength: 0.55 * fl, power: 1.6 });
    glow(g, bx, by + 6, 26, 20, { color: 'amber5', strength: 0.16 * fl, power: 1.2, q: 4 });
  }
  const POOLS = [[69, 56, 62, 46, 0.22], [187, 66, 40, 32, 0.34], [283, 52, 44, 40, 0.3]];
  const BULBS = [[69, 48], [187, 62], [283, 54]];
  const VIGN = [[0, 43, 110, 70], [320, 43, 110, 70], [0, 131, 100, 60], [320, 131, 100, 60]];
  // re-apply the baked pools, vignette and edge fog to a live object: only the pixels the object
  // changed (compared with the cache) are lit, so the background is not lit twice. clip = the rect it moves in.
  function relight(g, clip) {
    const ref = cache.wall;
    for (const [x, y, rx, ry, st] of POOLS) glow(g, x, y, rx, ry, { color: 'amber5', strength: st, power: 1.1, q: 5, clip, ref });
    for (const [x, y, rx, ry] of VIGN) glow(g, x, y, rx, ry, { mode: 'mix', color: 'night0', strength: 0.8, power: 1, q: 5, clip, ref });
    edgeFog(g, clip[1], clip[3] + 1, clip[0], clip[2] + 1, ref);
  }
  function bracket(g, bx) { A.rect(g, bx - 6, 41, 13, 2, 'steel2'); A.hline(g, bx - 6, 41, 13, 'steel4'); A.px(g, bx - 5, 43, 'steel1'); A.px(g, bx + 5, 43, 'steel1'); }
  function star(g, x, y, r, c) { A.hline(g, x - r, y, 2 * r + 1, c); A.vline(g, x, y - r, 2 * r + 1, c); A.line(g, x - (r >> 1), y - (r >> 1), x + (r >> 1), y + (r >> 1), c); A.line(g, x - (r >> 1), y + (r >> 1), x + (r >> 1), y - (r >> 1), c); }
  // the speech bubble as pixels plus a recorded word, so it can live in the cache
  function sayStatic(g, x, y, str, sz) {
    const w = Math.ceil(A.textWidth(str, sz, true)) + 8, h = Math.round(sz * 1.5) + 2, bx = 244, by = 72;
    A.bubble(g, bx, by, w, h, {}); A.poly(g, [bx + w - 1, by + 2, bx + w - 1, by + h - 3, x, y], 'paper6'); A.line(g, bx + w - 1, by + h - 3, x, y, 'paper3');
    T(bx + w / 2, by + h / 2 + sz * 0.36, str, 'night1', sz, true, { align: 'center' });
  }

  // ---------------------------------------------------------------- the cheese
  function bloom(g, x, y, r, s) { // blue-green mould: white fuzz, a blue-green body, olive centre, spores
    A.ditherDisc(g, x, y, r + 3, 'mist6', 0.7, 0.6);
    A.disc(g, x, y, r + 1, 'mist5'); A.disc(g, x, y, r, 'teal5'); A.disc(g, x - 1, y - 1, Math.max(1, r - 2), 'teal4');
    A.disc(g, x - 1, y, Math.max(1, r - 4), 'green7');
    for (let i = 0; i < r + 4; i++) A.px(g, x + Math.round((h01(s, i) - 0.5) * 2 * (r + 3)), y + Math.round((h01(s, i + 9) - 0.5) * 2 * (r + 2) * 0.8), h01(s, i + 3) < 0.5 ? 'mist7' : 'teal5');
    A.px(g, x - 2, y - 2, 'mist7'); A.px(g, x + 1, y - 2, 'mist6');
  }
  function hole(g, x, y, rx, ry) { A.ellipse(g, x, y, rx, ry, 'cheese2'); A.hline(g, x - rx + 1, y - ry, Math.max(1, rx * 2 - 1), 'cheese1'); }
  function cheeseStatic(g) {
    // shelf: planks
    A.rect(g, 8, 112, 124, 15, 'wood2');
    for (let i = 0; i < 5; i++) A.hline(g, 8, 114 + i * 3, 124, i % 2 ? 'wood1' : 'wood3');
    A.hline(g, 8, 112, 124, 'wood5'); A.hline(g, 8, 113, 124, 'wood4');
    shadow(g, 56, 113, 44, 4, 0.65);
    // wheel: rind side, then the top
    A.ellipse(g, 56, 109, 41, 9, 'cheese2');
    A.rect(g, 15, 88, 82, 21, 'cheese3');
    A.vline(g, 15, 90, 20, 'cheese5'); A.vline(g, 16, 91, 18, 'cheese4');
    A.ditherGradient(g, 74, 90, 22, 20, 'cheese3', 'cheese1', 'right'); A.rect(g, 91, 90, 6, 20, 'cheese1'); A.vline(g, 90, 91, 18, 'cheese2');
    A.ellipse(g, 56, 109, 41, 7, 'cheese2'); A.rect(g, 15, 88, 82, 18, 'cheese4');
    A.vline(g, 15, 90, 18, 'cheese6'); A.vline(g, 16, 91, 16, 'cheese5');
    A.ditherGradient(g, 70, 90, 26, 18, 'cheese4', 'cheese2', 'right'); A.rect(g, 91, 90, 6, 18, 'cheese2'); A.vline(g, 90, 91, 16, 'cheese3');
    A.ellipse(g, 56, 88, 41, 11, 'cheese5'); A.ellipse(g, 56, 88, 37, 9, 'cheese6');
    A.ellipse(g, 56, 87, 31, 7, 'cheese6'); A.hline(g, 22, 81, 30, 'paper5');
    for (const [hx, hy, a, b] of [[30, 86, 3, 1], [74, 90, 3, 2], [58, 93, 2, 1]]) hole(g, hx, hy, a, b);
        for (const [hx, hy, a, b] of [[28, 98, 3, 2], [46, 102, 2, 2], [66, 96, 3, 2], [82, 101, 2, 2]]) hole(g, hx, hy, a, b);
    // the mould: big blue-green blooms, fuzzy, creeping over the edge
    for (const [mx, my, r, s] of [[40, 86, 8, 1], [66, 90, 7, 2], [24, 99, 6, 3], [54, 103, 7, 4], [80, 103, 6, 5], [88, 93, 5, 6], [52, 84, 4, 7], [34, 107, 4, 8], [70, 108, 4, 9]]) bloom(g, mx, my, r, s);
    // the cut slice: pale veined inside, standing on the shelf
    A.poly(g, [100, 113, 128, 113, 128, 100, 100, 104], 'cheese6');
    A.poly(g, [100, 104, 128, 100, 126, 97, 103, 100], 'cheese4');
    A.rect(g, 124, 100, 4, 13, 'cheese3'); A.hline(g, 100, 113, 28, 'cheese2'); A.hline(g, 100, 114, 28, 'cheese1');
    for (const [hx, hy, r] of [[105, 109, 2], [113, 106, 2], [120, 109, 1], [109, 111, 1], [117, 111, 2]]) { A.disc(g, hx, hy, r, 'cheese3'); A.px(g, hx, hy + 1, 'cheese4'); }
    A.line(g, 101, 111, 111, 105, 'teal5'); A.line(g, 107, 113, 121, 106, 'green7'); A.line(g, 112, 104, 124, 103, 'teal5'); A.line(g, 114, 109, 120, 112, 'green6');
    A.px(g, 119, 105, 'mist5'); A.px(g, 105, 106, 'mist5');
    // paper tag tied on: best before
    A.line(g, 30, 99, 24, 120, 'paper2'); A.rect(g, 14, 118, 18, 9, 'paper3'); A.hline(g, 14, 118, 18, 'paper5'); A.px(g, 23, 118, 'red5');
    T(23, 125, '1987', 'night1', 5, true, { align: 'center' });
    T(66, 67, 'KAAS?', 'paper4', 10, true, { align: 'center', shadow: true });
  }
  function cheeseLive(g, t) {
    // stink: thick wavy green lines (2 px) climbing off the mould, fading as they rise
    for (let i = 0; i < 4; i++) {
      const ph = (t * 0.35 + i * 0.27) % 1;
      for (let k = 0; k < 16; k++) {
        const u = k / 16, sy = Math.round(80 - u * 24 - ph * 4), sx = 33 + i * 17 + Math.round(Math.sin(k * 0.6 + t * 2 + i * 2) * (1.5 + u * 2));
        const c = u < 0.5 ? 'green7' : u < 0.8 ? 'green6' : 'green5'; A.rect(g, sx, sy, 3, 1, c);
        if (u < 0.6) A.px(g, sx + 1, sy - 1, 'mist4');
      }
    }
    // flies, 2 px, with a wing flick
    for (let k = 0; k < 4; k++) {
      const a = t * (5 + k) + k * 2, fx = [30, 84, 56, 112][k] + Math.round(Math.cos(a) * 6), fy = [72, 70, 62, 94][k] + Math.round(Math.sin(a * 1.3) * 4);
      A.rect(g, fx, fy, 2, 2, 'night0'); if (Math.sin(a * 9) > 0) A.px(g, fx + 1, fy - 1, 'paper4'); else A.px(g, fx - 1, fy - 1, 'paper4');
    }
  }

  // ---------------------------------------------------------------- the poll
  const PB = { x: 146, y: 62, w: 82, h: 64 }, BASE = 118;
  function pollStatic(g) {
    const x = PB.x;
    A.rect(g, x + 6, 84, 70, 35, 'night1'); A.rect(g, x + 5, 83, 72, 1, 'steel3'); // the chart card
    for (let i = 0; i < 3; i++) A.hline(g, x + 8, 92 + i * 9, 66, 'night3');
    A.hline(g, x + 5, BASE, 72, 'paper3');
    T(x + 41, 73, 'PEILING', 'paper4', 8, true, { align: 'center', shadow: true });
    T(x + 41, 80, 'welk Nederlands is mooier?', 'slate6', 4, true, { align: 'center' });
    T(x + 22, 126, 'Vlaams', 'paper5', 5, true, { align: 'center' }); T(x + 58, 126, 'NL', 'slate5', 5, true, { align: 'center' });
  }
  function pollLive(g, t) {
    const x = PB.x, u = (t % 12) / 12, grow = 0.3 + 0.7 * (u < 0.2 ? ease(u / 0.2) : u < 0.75 ? 1 : ease((1 - u) / 0.25));
    const bh = Math.round(20 * grow), nl = 3, bx = x + 10;
    A.rect(g, bx - 1, BASE - bh - 1, 26, bh + 1, 'paper3'); // paper outline so the black stripe reads
    for (let s = 0; s < 3; s++) A.rect(g, bx + s * 8, BASE - bh, 8, bh, ['night0', 'cheese5', 'red4'][s]);
    A.vline(g, bx + 8, BASE - bh, bh, 'cheese6'); A.vline(g, bx + 16, BASE - bh, bh, 'red5');
    A.rect(g, x + 50, BASE - nl, 16, nl, 'blue2'); A.hline(g, x + 50, BASE - nl, 16, 'slate4');
    A.px(g, x + 66, BASE - nl - 1, 'blue1'); // a sad little droop
    if (grow > 0.55) {
      const cy = BASE - bh - 8 + Math.round(Math.sin(t * 3));
      A.poly(g, [bx + 3, cy + 7, bx + 3, cy + 1, bx + 7, cy + 4, bx + 12, cy - 1, bx + 17, cy + 4, bx + 21, cy + 1, bx + 21, cy + 7], 'paper6');
      A.hline(g, bx + 3, cy + 7, 19, 'paper4'); A.px(g, bx + 12, cy - 2, 'red5'); A.px(g, bx + 3, cy, 'red5'); A.px(g, bx + 21, cy, 'red5');
      A.text(bx + 36, cy + 5, '87%', 'paper6', 8, true, { align: 'center', shadow: true });
    }
    A.text(x + 58, BASE - nl - 3, '13%', 'slate5', 5, true, { align: 'center' });
  }

  // ---------------------------------------------------------------- the millionth tourist
  function tourist(g, x, y, t, fi) {
    const bob = Math.sin(t * 14) > 0.2 ? -1 : 0, hb = Math.sin(t * 7 + 1) > 0.5 ? -1 : 0;
    const r = (dx, dy, w, h, c) => A.rect(g, x + dx, y + dy + (dy < -18 ? bob : 0), w, h, c);
    shadow(g, x, y, 12, 2, 0.6);
    // sneakers, white socks, bare calves, khaki shorts
    r(-6, -2, 5, 2, 'paper5'); r(1, -2, 5, 2, 'paper5'); r(-6, -1, 5, 1, 'paper3'); r(1, -1, 5, 1, 'paper3');
    r(-5, -9, 3, 7, 'paper6'); r(2, -9, 3, 7, 'paper6'); r(-5, -9, 3, 1, 'paper4'); r(2, -9, 3, 1, 'paper4');
    r(-5, -16, 3, 7, 'skin4'); r(2, -16, 3, 7, 'skin4');
    r(-6, -25, 12, 9, 'wood5'); r(-6, -25, 12, 1, 'wood6'); r(-1, -18, 2, 2, 'wood3'); r(-6, -17, 5, 1, 'wood4'); r(1, -17, 5, 1, 'wood4');
    // rucksack behind
    r(-13, -43, 7, 20, 'blue3'); r(-13, -43, 7, 3, 'blue5'); r(-13, -43, 1, 20, 'blue2'); r(-12, -36, 5, 4, 'blue2'); r(-12, -36, 5, 1, 'blue4');
    // loud shirt, belly out
    r(-7, -44, 14, 20, 'teal4'); r(-8, -34, 15, 10, 'teal4'); r(6, -44, 2, 20, 'teal2'); r(-8, -26, 16, 1, 'teal3');
    for (const [dx, dy, c] of [[-4, -41, 'paper5'], [0, -43, 'red5'], [3, -39, 'paper5'], [-5, -35, 'red4'], [-1, -37, 'paper4'], [4, -33, 'red5'], [-3, -30, 'paper5'], [1, -29, 'red4'], [5, -27, 'paper4'], [-6, -28, 'paper4']]) r(dx, dy, 2, 2, c);
    // strap and camera on his chest
    A.line(g, x - 5, y - 44 + bob, x + 1, y - 36 + bob, 'night0'); A.line(g, x + 5, y - 44 + bob, x + 3, y - 36 + bob, 'night0');
    r(-1, -37, 9, 6, 'slate1'); r(-1, -37, 9, 1, 'steel3'); r(0, -36, 2, 1, 'steel4'); r(1, -35, 5, 4, 'slate0');
    A.disc(g, x + 4, y - 33 + bob, 2, fi ? 'paper6' : 'steel3'); A.px(g, x + 4, y - 33 + bob, fi ? 'paper6' : 'night0');
    r(6, -37, 2, 1, fi ? 'paper6' : 'steel4');
    // both hands on his belly (the classic laugh)
    r(-10, -42, 3, 10, 'skin4'); r(-10, -33, 9, 3, 'skin4'); r(-2, -34, 3, 4, 'skin5');
    r(7, -41, 3, 6, 'skin4'); r(3, -34, 6, 3, 'skin4'); r(2, -35, 2, 2, 'skin5');
    // head thrown back: chin up, mouth a wide dark O, eyes squeezed, tears
    r(-2, -48, 5, 4, 'skin3');
    const hy = hb + bob;
    A.ellipse(g, x + 2, y - 52 + hy, 6, 6, 'skin4'); A.hline(g, x - 3, y - 57 + hy, 11, 'skin5');
    A.rect(g, x - 1, y - 54 + hy, 9, 1, 'skin3');
    A.ellipse(g, x + 3, y - 50 + hy, 3, 3, 'night0'); A.hline(g, x + 1, y - 52 + hy, 5, 'paper6'); A.hline(g, x + 1, y - 51 + hy, 5, 'paper5'); A.rect(g, x + 2, y - 49 + hy, 3, 2, 'red4'); A.px(g, x + 3, y - 48 + hy, 'red5');
    A.px(g, x - 2, y - 55 + hy, 'night0'); A.px(g, x - 3, y - 56 + hy, 'night0'); A.px(g, x - 3, y - 54 + hy, 'night0');
    A.px(g, x + 5, y - 55 + hy, 'night0'); A.px(g, x + 6, y - 56 + hy, 'night0'); A.px(g, x + 6, y - 54 + hy, 'night0');
    A.px(g, x - 3, y - 53 + hy, 'blue5'); A.px(g, x + 6, y - 53 + hy, 'blue5');
    A.px(g, x + 2, y - 54 + hy, 'skin2'); // nose
    // sunhat, knocked back by the laugh
    A.ellipse(g, x + 1, y - 59 + hy, 11, 2, 'paper4'); A.hline(g, x - 10, y - 59 + hy, 23, 'paper5');
    A.rect(g, x - 5, y - 66 + hy, 10, 7, 'paper4'); A.hline(g, x - 5, y - 66 + hy, 10, 'paper5'); A.hline(g, x - 5, y - 61 + hy, 10, 'blue3'); A.hline(g, x - 5, y - 60 + hy, 10, 'blue2');
    A.vline(g, x + 4, y - 65 + hy, 5, 'paper3');
  }

  // ---------------------------------------------------------------- tiny paper icons
  function poster5G(g, x, y) {
    A.rect(g, x + 1, y + 1, 12, 23, 'night0'); A.rect(g, x, y, 12, 23, 'paper2'); A.px(g, x + 6, y, 'red5');
    A.line(g, x + 6, y + 5, x + 3, y + 18, 'night1'); A.line(g, x + 6, y + 5, x + 9, y + 18, 'night1'); A.hline(g, x + 4, y + 12, 5, 'night1'); A.hline(g, x + 3, y + 16, 7, 'night1');
    A.ring(g, x + 6, y + 4, 3, 'red4'); A.ring(g, x + 6, y + 4, 5, 'red3');
    T(x + 6, y + 22, '5G!', 'red3', 5, true, { align: 'center' });
  }
  function posterOwl(g, x, y) { // a green language-app owl, crossed out
    tpoly(g, x + 1, y + 1, 16, 26, 2, 'night0'); tpoly(g, x, y, 16, 26, 2, 'paper3'); A.px(g, x + 8, y + 2, 'red5');
    A.ellipse(g, x + 8, y + 12, 5, 6, 'green6'); A.ellipse(g, x + 8, y + 14, 3, 3, 'green7');
    A.rect(g, x + 4, y + 7, 3, 3, 'paper6'); A.rect(g, x + 9, y + 7, 3, 3, 'paper6'); A.px(g, x + 5, y + 8, 'night0'); A.px(g, x + 10, y + 8, 'night0'); A.px(g, x + 7, y + 10, 'cheese5'); A.px(g, x + 8, y + 10, 'cheese5');
    A.px(g, x + 3, y + 5, 'green6'); A.px(g, x + 12, y + 5, 'green6');
    A.line(g, x + 1, y + 2, x + 14, y + 24, 'red5'); A.line(g, x + 14, y + 2, x + 1, y + 24, 'red5'); A.line(g, x + 2, y + 2, x + 15, y + 24, 'red4');
  }
  function polaroid(g, x, y) { // a grey photo of a dark street, two eyes in the dark
    tpoly(g, x + 1, y + 1, 18, 21, -2, 'night0'); tpoly(g, x, y, 18, 21, -2, 'paper5');
    A.rect(g, x + 2, y + 2, 14, 13, 'night2'); A.ditherGradient(g, x + 2, y + 2, 14, 13, 'mist1', 'night1', 'down');
    A.rect(g, x + 6, y + 8, 5, 7, 'night0'); A.rect(g, x + 7, y + 6, 3, 3, 'night0'); A.px(g, x + 7, y + 7, 'eye3'); A.px(g, x + 9, y + 7, 'eye3');
    A.rect(g, x + 3, y + 10, 2, 5, 'night0'); A.px(g, x + 3, y + 3, 'amber5');
    A.px(g, x + 8, y, 'red5');
  }

  // ---------------------------------------------------------------- the static scene
  let cache = null;
  function build(g) {
    building = true; statics.length = 0;
    A.key(g, 68, 60, 1);
    // ---- far layer: a foggy skyline above the wall
    A.depth(g, 0);
    A.sky(g, ['night2', 'night4', 'mist0', 'mist1'], 0, 46);
    A.moon(g, 148, 12, 5);
    A.depth(g, 0.25);
    A.church(g, 84, 52, 0.95, { tone: 'night4' });
    A.haze(g, -20, 0, 360, 50, { top: 0.25, bottom: 0.6, color: 'mist2' });
    for (let i = 0; i < 8; i++) A.canalHouse(g, -8 + i * 44, 33 + (i * 5) % 7, 26 + (i % 3) * 5, 25, { gable: ['step', 'bell', 'neck', 'spout'][i % 4], brick: 'slate1', lit: 0.35, t: 0, seed: i + 3 });
    A.haze(g, -20, 4, 360, 40, { top: 0.3, bottom: 0.5, color: 'mist2' });
    const sky = g.buf.slice(0, WALL * W);
    // ---- the wall: cold brick, coping, brackets
    A.depth(g, 0.9);
    A.rect(g, -10, 43, 340, 90, 'night2');
    A.brick(g, -10, 43, 340, 90, { base: 'night2', only: 'night2', seed: 5, bw: 7, vary: 0.2 });
    A.rect(g, -10, 39, 340, 4, 'slate2'); A.hline(g, -10, 39, 340, 'slate4'); A.hline(g, -10, 40, 340, 'slate3'); A.hline(g, -10, 42, 340, 'slate0');
    for (let x = 6; x < 320; x += 28) A.vline(g, x, 40, 2, 'slate1');
    A.rect(g, -10, 131, 340, 3, 'slate3'); A.hline(g, -10, 131, 340, 'slate5'); A.hline(g, -10, 134, 340, 'slate0'); // the ledge
    // ---- boards
    frame(g, 8, 54, 122, 72); frame(g, PB.x, PB.y, PB.w, PB.h); frame(g, 242, 50, 82, 76);
    cheeseStatic(g);
    pollStatic(g);
    // the tourist board: a shelf and a postcard
    A.rect(g, 242, 116, 82, 10, 'wood2'); A.hline(g, 242, 116, 82, 'wood5'); A.hline(g, 242, 117, 82, 'wood4'); A.hline(g, 242, 121, 82, 'wood1'); A.hline(g, 242, 124, 82, 'wood1');
    A.rect(g, 247, 88, 25, 28, 'paper3'); A.rect(g, 249, 90, 21, 19, 'night3'); A.ditherGradient(g, 249, 90, 21, 19, 'mist1', 'mist0', 'down');
    A.windmill(g, 260, 109, 0.28, 0.5, { tone: 'night1', sail: 'night0', stage: false });
    A.rect(g, 249, 105, 21, 4, 'night1'); for (let i = 0; i < 7; i++) { A.px(g, 250 + i * 3, 105, i % 2 ? 'red4' : 'cheese4'); A.px(g, 250 + i * 3, 106, 'red3'); }
    A.px(g, 259, 87, 'red5'); T(259, 114, 'HOLLAND!', 'night1', 4, true, { align: 'center' });
    T(263, 62, 'toerist', 'paper4', 6, true, { align: 'center', shadow: true }); T(263, 69, '#1.000.000', 'paper5', 6, true, { align: 'center', shadow: true });
    // ---- clippings and posters, overlapping the boards
    note(g, 4, 45, 'OOSTENRIJK?', { tilt: 1 });
    note(g, 142, 49, ['Ik spreek', 'liever Engels'], { h: 16, tilt: 2 });
    note(g, 195, 52, 'TIKKIE?!', { tone: 'paper2', w: 33, tilt: -1 });
    note(g, 238, 44, 'HAGELSLAG!', { tone: 'paper2', tilt: 1 });
    posterOwl(g, 130, 84); poster5G(g, 229, 91);
    polaroid(g, 112, 56);
    for (const bx of [69, 187, 283]) bracket(g, bx);
    sayStatic(g, 297, 77, 'drunk German!', 6);
    for (const [bx, by] of BULBS) bulbStatic(g, bx, by);
    // ---- the three amber pools (baked; the bulbs flicker live on top)
    for (const [x, y, rx, ry, st] of POOLS) glow(g, x, y, rx, ry, { color: 'amber5', strength: st, power: 1.1, q: 5 });
    // ---- wall vignette: real night0 in the corners, over everything on the wall
    for (const [x, y, rx, ry] of VIGN) glow(g, x, y, rx, ry, { mode: 'mix', color: 'night0', strength: 0.8, power: 1, q: 5 });
    edgeFog(g, 43, 133, 0, W);
    // ---- wet cobbles: slate with shaded joints, darker toward the bottom, no mirror
    A.depth(g, 1);
    A.rect(g, -10, 134, 340, 50, 'slate2');
    for (let r = 0, yy = 135; yy < 182; r++, yy += 4 + (r > 3 ? 1 : 0)) {
      A.hline(g, 0, yy, 320, 'slate0');
      for (let xx = -(r % 2) * 5; xx < 330; xx += 10) {
        A.vline(g, xx, yy, 4, 'slate0');
        const v = h01(xx, r); if (v > 0.55) A.hline(g, xx + 2, yy + 1, 5, 'slate3'); else if (v < 0.2) A.hline(g, xx + 2, yy + 2, 4, 'slate1'); else A.hline(g, xx + 2, yy + 1, 3, 'slate1');
      }
    }
    A.ditherGradient(g, 0, 134, 320, 12, 'slate0', 'slate2', 'down');
    glow(g, 160, 186, 260, 42, { mode: 'mix', color: 'night0', strength: 0.5, power: 0.9, q: 4 });
    for (const [bx] of BULBS) glow(g, bx, 136, 52, 15, { color: 'amber5', strength: 0.3, power: 1.2, q: 4 });
    // litter from the rumour mill
    tpoly(g, 214, 166, 11, 6, 1, 'paper3'); A.hline(g, 215, 168, 7, 'paper1'); tpoly(g, 100, 172, 10, 5, -1, 'paper2'); A.hline(g, 102, 174, 6, 'paper1');
    A.rect(g, 262, 159, 6, 3, 'cheese3'); A.hline(g, 262, 159, 6, 'cheese4'); A.px(g, 264, 160, 'teal4');
    A.omafiets(g, 236, 177, { facing: 'left', t: 0, basket: 'cheese', rider: false });
    cache = { sky, wall: g.buf.slice(WALL * W) };
    building = false;
  }
  const PINS = [[26, 49], [71, 66], [121, 57], [138, 86], [161, 52], [187, 60], [211, 52], [235, 93], [253, 44], [262, 62]];
  function sagLine(g, a, b, sag, c) {
    let px = a[0], py = a[1];
    for (let i = 1; i <= 9; i++) {
      const u = i / 9, x = Math.round(a[0] + (b[0] - a[0]) * u), y = Math.round(a[1] + (b[1] - a[1]) * u + Math.sin(u * Math.PI) * sag);
      A.line(g, px, py, x, y, c); px = x; py = y;
    }
  }
  function banner(g) {
    const bw = 76, bcx = 187;
    A.poly(g, [bcx - bw / 2, 31, bcx + bw / 2, 32, bcx + bw / 2 - 2, 37, bcx + bw / 2 + 1, 42, bcx + bw / 2 - 3, 47, bcx - bw / 2 + 2, 47, bcx - bw / 2 - 1, 41], 'paper3');
    A.hline(g, bcx - bw / 2, 31, bw, 'paper5'); A.hline(g, bcx - bw / 2 + 2, 47, bw - 4, 'paper2');
    A.text(bcx, 44, 'GERUCHTEN', 'red3', 10, true, { align: 'center' });
  }

  A.panels[4] = {
    text: 'Or the millionth tourist who said it sounds like a drunk German.',
    nl: 'Of aan de miljoenste toerist die zei dat het klinkt als een dronken Duitser.',
    draw(g, t) {
      if (!cache || cache.wall.length !== (H - WALL) * W) build(g);
      for (const s of statics) A.text.apply(null, s);
      // ---- far layer: cached skyline, live stars, the turning mill, drifting mist
      g.buf.set(cache.sky, 0);
      A.stars(g, t, { n: 14, y1: 22, seed: 6, x0: 0, x1: 130 }); A.stars(g, t, { n: 6, y1: 18, seed: 9, x0: 160, x1: 230 });
      A.windmill(g, 270, 62, 0.8, -t * 0.35, { tone: 'night3', sail: 'night2', stage: true, lit: 0, t });
      fog(g, t, 14, 26, { amount: 0.4, speed: 3, seed: 2, color: 'mist3' });
      g.buf.set(cache.wall, WALL * W);
      banner(g);
      // ---- exhibits, live parts (each one is lit and fogged to match the baked wall)
      const fl1 = 0.85 + 0.15 * Math.sin(t * 7) * Math.sin(t * 3.1), fl2 = 0.85 + 0.15 * Math.sin(t * 6 + 1.7) * Math.sin(t * 2.7 + 1.7), fl3 = 0.85 + 0.15 * Math.sin(t * 8 + 3.4) * Math.sin(t * 3.3 + 3.4);
      const q = v => Math.round(v * 10) / 10;
      cheeseLive(g, t);
      pollLive(g, t); relight(g, [150, 84, 224, 119]);
      const fp = (t + 0.9) % 2.5, fi = fp < 0.3 ? (fp < 0.08 ? 1 : 1 - (fp - 0.08) / 0.22) : 0;
      tourist(g, 296, 125, t, fi > 0.4);
      glow(g, 296, 92, 26, 40, { color: 'amber5', strength: 0.3, power: 1, q: 5, clip: [280, 56, 316, 127], ref: cache.wall });
      // the flash: a bright star on the camera and the whole board blown out for a moment
      if (fi > 0) {
        wash(g, 238, 46, 82, 86, 'paper6', 0.6 * fi, 'mix');
        glow(g, 300, 92, 38, 34, { color: 'paper6', strength: 0.8 * fi, power: 0.8, q: 4 });
        star(g, 300, 92, 6 + Math.round(fi * 4), 'paper6');
      }
      bulbLive(g, 69, 48, q(fl1)); bulbLive(g, 187, 62, q(fl2)); bulbLive(g, 283, 54, q(fl3));
      // ---- the red string: every rumour tied to the next, with a few crossovers
      for (let i = 0; i < PINS.length - 1; i++) sagLine(g, PINS[i], PINS[i + 1], 3 + (i % 3) * 2, 'red3');
      sagLine(g, PINS[1], PINS[3], 7, 'red2'); sagLine(g, PINS[4], PINS[6], 4, 'red2');
      for (const [a, b] of PINS) { A.rect(g, a - 1, b - 1, 3, 3, 'red5'); A.px(g, a - 1, b - 1, 'paper6'); }
      // ---- fog drifting in front of the wall
      fog(g, t, 62, 56, { amount: 0.32, speed: 3, seed: 4, color: 'mist3' });
      // ---- floor: puddles under the bulbs, streaks
      for (const [px, py, pw, ph] of [[30, 142, 56, 12], [150, 148, 72, 11], [244, 142, 62, 10]]) A.water(g, px, py, pw, ph, { t, amp: 0.8, dark: 0.3, color: 'slate3', gaps: 0.3, glints: 4, glint: 'amber5' });
      [69, 187, 283].forEach((x, i) => A.streak(g, x, 137, 28, { t, color: 'amber5', strength: 0.3, seed: i + 1 }));
      fog(g, t, 142, 30, { amount: 0.24, speed: 4, seed: 6 });
      // ---- watchers: the hat zombie creeps closer to the cheese; the phone zombie reads the poll
      const creep = Math.round(ease((t % 12) / 12) * 3);
      A.zombie(g, 40 + creep, 173, { variant: 'hat', t, facing: 'right', pose: 'stand', height: 52, hunch: 0.8 });
      const pz = A.zombie(g, 292, 166, { variant: 'phone', t, facing: 'left', pose: 'stand', height: 44, hunch: 0.7 });
      const hand = (pz && pz.hand) || [286, 150], pul = 0.7 + 0.3 * Math.sin(t * 5);
      glow(g, hand[0], hand[1], 17, 13, { color: 'phone3', strength: 0.5 * (Math.round(pul * 10) / 10), power: 1.3, q: 4 });
      if ((t % 6) > 3.6 && (t % 6) < 5.6) A.say(g, (pz && pz.head ? pz.head[0] : 286), (pz && pz.head ? pz.head[1] : 130) - 2, 'tikkie?', { size: 5, dy: 3, dx: -6 });
      A.dog(g, 196, 177, { coat: 'brown', pose: 'sit', look: 'up', t });
      // ---- the hero studies the wall: poll, then the cheese (pointing), poll, then the tourist
      const m = t % 12, face = m < 3 ? 'back' : m < 5.5 ? 'left' : m < 8 ? 'back' : m < 10.5 ? 'right' : 'back';
      A.man(g, 168, 179, { facing: face, pose: 'stand', t, arm: face === 'left' ? 'point' : null, face: face === 'right' ? 'worry' : 'deadpan' });
    },
  };
})();
