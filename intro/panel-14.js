// Panel 11: Fak. Oké. One man, one omafiets, three hundred and sixty words. Nachtrit.
// The title moment. The rider stays put on screen and the world rolls past him in layers:
// skyline barely, canal and far bridge slowly, the house row a little faster, the pavement
// faster, the road, quay and reeds at wheel speed. NACHTRIT hangs in the sky like a lamp.
// Value plan: the town behind (left) is warm and calm; ahead (right) is nearly black, and only
// the dynamo beam cuts into it. The dead stand at the kerb and their eyes find the light.
// Key light: his bike lamp, pointing right.
// Loops: wheels, pedals and road at one speed, the layers, mill sails (anticlockwise), mill
// windows, eyes blinking, dog ears and tail, book dust, title glow, ripples, mist.
(function () {
  const A = window.NRART;
  const hash = A.hash;
  const smooth = (a, b, x) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };

  // ground speeds, px per second. The wheel turns at V_ROAD / 56 of omafiets speed 1.
  const V_ROAD = 70, V_PAV = 46, V_HOUSE = 22, V_FAR = 8, V_SKY = 2;
  // seamless scrolling: an item at x0 (t = 0) slides left at v and wraps inside [-m, P - m)
  const scroll = (x0, v, t, P, m) => ((((x0 - v * t + m) % P) + P) % P) - m;

  // the dog's head over the basket rim (the shared omafiets only draws a blob)
  function dogHead(g, x, y, t) {
    const fl = Math.sin(t * 9) > 0.3 ? 1 : 0, bx = x + 15, by = y - 34;
    A.begin(g);
    A.rect(g, bx + 1, by, 7, 7, 'fur3'); A.rect(g, bx + 2, by - 1, 5, 1, 'fur3');          // skull
    A.rect(g, bx + 7, by + 3, 4, 3, 'fur4'); A.px(g, bx + 10, by + 3, 'slate0');          // snout, nose
    A.hline(g, bx + 7, by + 5, 3, 'fur2');
    A.px(g, bx + 5, by + 2, 'slate0');                                                     // eye
    A.rect(g, bx - 1, by + 1 + fl, 3, 5, 'fur1'); A.px(g, bx - 1, by + 6 + fl, 'fur1');    // the ear, flapping in the wind
    A.px(g, bx + 1, by, 'fur2');
    if (Math.sin(t * 3) > 0.2) A.px(g, bx + 9, by + 6, 'red4');                            // tongue
    A.end(g, 0);
  }

  // title letters, spaced by hand so the wordmark can breathe
  let letterW = null;
  const TITLE = 'NACHTRIT', TSIZE = 30, TSPACE = 5;
  function wordmark() {
    if (!letterW) letterW = TITLE.split('').map(ch => A.textWidth(ch, TSIZE, true));
    const total = letterW.reduce((a, b) => a + b, 0) + TSPACE * (TITLE.length - 1);
    let x = 160 - total / 2;
    TITLE.split('').forEach((ch, i) => {
      A.text(x, 60, ch, 'amber3', TSIZE, true);                                 // the shade of the lit edge, one row under
      A.text(x, 59, ch, 'amber7', TSIZE, true, { shadow: true });
      x += letterW[i] + TSPACE;
    });
    return total;
  }

  // a fingerpost with pixel lettering (a 3x5 face), so the words sit in the world, behind the rider, and dim into the dark
  const GLYPH = {
    D: ['##.', '#.#', '#.#', '#.#', '##.'], O: ['###', '#.#', '#.#', '#.#', '###'], R: ['##.', '#.#', '##.', '#.#', '#.#'], P: ['##.', '#.#', '##.', '#..', '#..'],
    M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'], L: ['#..', '#..', '#..', '#..', '###'], E: ['###', '#..', '##.', '#..', '###'], N: ['#..#', '##.#', '#.##', '#..#', '#..#'],
  };
  const wordW = w => w.split('').reduce((a, ch) => a + GLYPH[ch][0].length + 1, -1);
  function word(g, x, y, w, c) {
    w.split('').forEach(ch => {
      const gl = GLYPH[ch];
      gl.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] === '#') A.px(g, x + i, y + j, c); });
      x += gl[0].length + 1;
    });
  }
  function fingerpost(g, x, y, dim) {
    const c = A.C[dim ? 'wood1' : 'wood3'], k = dim ? 'mist1' : 'paper4';
    A.begin(g); A.rect(g, x, y - 32, 2, 32, 'wood2');
    [['DORP', 'left'], ['MOLEN', 'right']].forEach(([txt, dir], i) => {
      const tw = wordW(txt) + 5, sy = y - 31 + i * 9, right = dir === 'right', bx = right ? x + 1 : x + 1 - tw;
      A.rect(g, bx, sy, tw, 7, c); A.hline(g, bx, sy, tw, dim ? 'wood2' : 'wood4'); A.hline(g, bx, sy + 6, tw, dim ? 'wood0' : 'wood2');
      if (right) { A.vline(g, bx + tw, sy + 1, 5, c); A.vline(g, bx + tw + 1, sy + 2, 3, c); A.px(g, bx + tw + 2, sy + 3, c); }
      else { A.vline(g, bx - 1, sy + 1, 5, c); A.vline(g, bx - 2, sy + 2, 3, c); A.px(g, bx - 3, sy + 3, c); }
      word(g, bx + 2 + (right ? 0 : 1), sy + 1, txt, k);
    });
    A.end(g, 0);
  }

  // a canal house, cheap: brick, a gable, a grid of windows with warm halos. d: 0 lit and near, 1 black and far ahead
  function house(g, x, y, w, h, gb, sd, d, t) {
    const base = d > 0.62 ? A.step(sd % 2 ? 'night5' : 'night4', d > 0.85 ? 0 : 1) : A.step(sd % 2 ? 'brick3' : 'slate3', -Math.round(1.6 * d)), dk = A.step(base, -1), trim = d > 0.62 ? A.step(base, 1) : A.step('slate5', -Math.round(2 * d));
    const gh = Math.min(Math.round(h * 0.34), Math.round(w * 0.55)), by = y - h + gh;
    A.rect(g, x, by, w, y - by, base);
    A.ditherRect(g, x, by, w, y - by, null, dk, 0.22);
    if (gb === 'step') {
      const n = 3, sw = Math.max(2, Math.floor(w / 8)), sh = Math.round(gh / (n + 1));
      for (let i = 0; i <= n; i++) { A.rect(g, x + i * sw, by - (i + 1) * sh, w - 2 * i * sw, sh + 1, base); A.hline(g, x + i * sw, by - (i + 1) * sh, w - 2 * i * sw, trim); }
    } else if (gb === 'roof') {
      A.poly(g, [x - 2, by + 1, x + w + 2, by + 1, x + w - 5, by - gh, x + 5, by - gh], A.step('slate2', -Math.round(d)));
      A.rect(g, x + w - 9, by - gh - 4, 3, 5, dk);
    } else {
      const k = gb === 'bell' ? 7 : 5;
      A.poly(g, [x, by, x + w, by, x + w - 3, by - Math.round(gh * 0.55), x + w / 2 + k * 0.3, by - gh, x + w / 2 - k * 0.3, by - gh, x + 3, by - Math.round(gh * 0.55)], base);
      A.hline(g, x + w / 2 - 2, by - gh, 4, trim);
      if (gb === 'neck') A.px(g, x + w / 2, by - gh - 1, base);
    }
    A.hline(g, x, by, w, trim);
    A.rect(g, x, y - 3, w, 3, dk);
    const cols = Math.max(1, Math.floor((w - 3) / 7)), gx0 = x + Math.floor((w - (cols * 7 - 3)) / 2), rows = Math.max(1, Math.floor((y - by - 14) / 11));
    const litP = 0.62 * (1 - 0.9 * d);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const wx = gx0 + i * 7, wy = by + 4 + j * 11, k = sd * 31 + j * 7 + i, on = hash(k, 1) < litP && !(hash(Math.floor(t * 6) + k, 3) < 0.03);
      if (on) {
        A.ditherRect(g, wx - 1, wy - 1, 6, 8, null, 'amber2', 0.3);
        A.rect(g, wx, wy, 4, 6, 'amber5'); A.rect(g, wx + 1, wy + 3, 2, 3, 'amber6'); A.hline(g, wx, wy, 4, 'amber4'); A.vline(g, wx + 2, wy, 6, 'amber3');
        if (hash(k, 2) < 0.2) { A.px(g, wx + 1, wy + 4, 'night0'); A.px(g, wx + 1, wy + 3, 'night0'); }   // a cat in the window
      } else { A.rect(g, wx, wy, 4, 6, 'night2'); A.px(g, wx + 3, wy, 'mist0'); }
      A.hline(g, wx - 1, wy + 6, 6, trim);
    }
    const dx = x + (hash(sd, 3) < 0.5 ? 2 : w - 6);
    A.rect(g, dx, y - 11, 4, 8, 'wood1'); A.hline(g, dx, y - 11, 4, hash(sd, 4) < litP ? 'amber5' : 'night2');
  }

  // ---- cheap light: add-lighting through the toolkit's own lookup tables, with a Bayer dither between levels
  const LQ = 5, lutSets = {};
  const levelsOf = (c, st) => lutSets[c + st] || (lutSets[c + st] = Array.from({ length: LQ + 1 }, (_, q) => A.lut('add', c, st * q / LQ)));
  // a light shaft from (x0, y0) running right with a slope, widening with distance and dimming into the fog
  function shaft(g, x0, y0, slope, tn, len, w0, color, strength, fade, edge) {
    const Ls = levelsOf(color, strength), buf = g.buf, W = g.w;
    for (let dx = 0; dx < len; dx++) {
      const x = x0 + dx; if (x < 0 || x >= W) continue;
      const fa = Math.pow(1 - dx / len, fade), cy = y0 + dx * slope, hw = w0 / 2 + dx * tn;
      for (let y = Math.max(0, Math.floor(cy - hw)); y <= Math.min(g.h - 1, Math.ceil(cy + hw)); y++) {
        const e = 1 - Math.abs(y + 0.5 - cy) / hw; if (e <= 0) continue;
        const v = fa * (e >= edge ? 1 : e / edge) * LQ; let q = v | 0; if (v - q > A.bayer(x, y)) q++;
        if (q > 0) buf[y * W + x] = Ls[q > LQ ? LQ : q][buf[y * W + x]];
      }
    }
  }
  // a downward lamp cone, the same trick turned on its side
  function coneDown(g, x0, y0, tn, len, w0, color, strength, fade) {
    const Ls = levelsOf(color, strength), buf = g.buf, W = g.w;
    for (let dy = 0; dy < len; dy++) {
      const y = y0 + dy; if (y < 0 || y >= g.h) continue;
      const fa = Math.pow(1 - dy / len, fade), hw = w0 / 2 + dy * tn;
      for (let x = Math.max(0, Math.floor(x0 - hw)); x <= Math.min(W - 1, Math.ceil(x0 + hw)); x++) {
        const e = 1 - Math.abs(x + 0.5 - x0) / hw; if (e <= 0) continue;
        const v = fa * Math.min(1, e / 0.6) * LQ; let q = v | 0; if (v - q > A.bayer(x, y)) q++;
        if (q > 0) buf[y * W + x] = Ls[q > LQ ? LQ : q][buf[y * W + x]];
      }
    }
  }
  // a drifting fog band: per-column thickness, dithered through the same tables ('mix' toward fog)
  const mixSets = {};
  const mixOf = (c, Q) => mixSets[c] || (mixSets[c] = Array.from({ length: Q + 1 }, (_, q) => A.lut('mix', c, q / Q)));
  function fog(g, t, y, h, amt, speed, seed, color) {
    const Q = 6, Ls = mixOf(color, Q), buf = g.buf, W = g.w;
    let n = 0, n2 = 0;
    for (let x = 90; x < W; x++) {
      if (!(x & 1)) { const sx = x + t * speed; n = A.wave(sx, W, seed); n2 = A.wave(sx * 0.5 + 40, W, seed + 3); }
      const th = Math.max(0.5, h * (0.35 + 0.65 * n) / 2), cy = y + h / 2 + (n2 - 0.5) * h * 0.5;
      for (let yy = Math.max(0, Math.ceil(cy - th)); yy <= Math.min(g.h - 1, Math.floor(cy + th)); yy++) {
        const d = Math.abs(yy + 0.5 - cy) / th; if (d >= 1) continue;
        const v = amt * (0.55 + 0.45 * n) * (1 - d * d) * Q; let q = v | 0; if (v - q > A.bayer(x, yy)) q++;
        if (q > 0) buf[yy * W + x] = Ls[q > Q ? Q : q][buf[yy * W + x]];
      }
    }
  }

  const dark = x => smooth(100, 250, x);          // how far into the black ahead a screen x is
  const DK = Array.from({ length: 320 }, (_, x) => dark(x));
  const DKF = Array.from({ length: 320 }, (_, x) => smooth(205, 335, x));
  const SPECK = Array.from({ length: 512 }, (_, u) => hash(u, 9)), SPY = Array.from({ length: 512 }, (_, u) => Math.floor(hash(u, 8) * 10));

  // a bare street tree: a thin trunk and a few swaying branches, a silhouette
  function bareTree(g, x, y, h, c, t) {
    A.rect(g, x, y - h, 2, h, c); A.px(g, x - 1, y - 1, c); A.px(g, x + 2, y - 1, c); A.px(g, x - 1, y - 2, c);
    [[0.5, -9, 10], [0.58, 10, 11], [0.74, -7, 9], [0.82, 8, 8], [1, -4, 8], [1, 5, 7]].forEach(([f, dx, dy], i) => {
      const bx = x + 1, by = y - h * f, ex = bx + dx + Math.sin(t * 0.8 + i) * 0.7, ey = by - dy;
      A.line(g, bx, by, ex, ey, c);
      A.line(g, (bx + ex) / 2, (by + ey) / 2, (bx + ex) / 2 + dx * 0.4, (by + ey) / 2 - 3, c);
      A.line(g, ex, ey, ex + (dx > 0 ? 3 : -3), ey - 2, c);
    });
  }

  // ---- the static backdrop, drawn once with the toolkit and then copied each frame:
  // sky, moon, the title's glow, the far canal, pavement and road bases
  const SKY = [['night0', 24], ['night1', 42], ['night2', 58], ['night4', 74], ['mist0', 90], ['mist1', 108], ['mist2', 148]];
  // ---- scrolling strips drawn once and blitted with an offset (index 0 is transparent)
  const HP = 440, HY0 = 96, HY1 = 150, PF = 372;
  const HOUSES = [[-50, 36, 40, 'step', 3], [-12, 32, 34, 'bell', 4], [24, 40, 44, 'neck', 5], [68, 30, 36, 'spout', 6],
    [102, 38, 42, 'step', 9], [144, 30, 33, 'roof', 11], [178, 38, 46, 'bell', 12], [220, 32, 36, 'neck', 14]];
  const houseStrips = [];
  function houseStrip(k) {                          // k: 0 warm and lit ... 2 fogged and black ahead
    if (houseStrips[k]) return houseStrips[k];
    const g = A.surface(HP, 180), d = [0, 0.5, 1][k];
    HOUSES.forEach(([x0, w, h, gb, sd]) => [-HP, 0, HP].forEach(o => house(g, x0 + 20 + o, 148, w, h, gb, sd, d, 0)));
    return (houseStrips[k] = g.buf);
  }
  let skyStrip = null;
  function skylineStrip() {                         // treeline and church, the far plane that barely moves
    if (skyStrip) return skyStrip;
    const g = A.surface(PF, 180);
    for (let k = 0; k < 62; k++) A.disc(g, k * 6, 134 - Math.round(hash(k, 5) * 4), 3 + Math.round(hash(k, 6) * 2), 'night3');
    A.rect(g, 0, 134, PF, 4, 'night3');
    [160, 160 + PF, 160 - PF].forEach(x => A.church(g, x, 134, 0.9, { tone: 'night2' }));
    return (skyStrip = g.buf);
  }
  const FP = 480, furn = [];
  function furnitureStrip(k) {                      // bare tree, fingerpost, bollards and chain, tulip box: lit, then dimmed for the dark ahead
    if (furn[k]) return furn[k];
    const g = A.surface(FP, 180), dim = k === 1;
    [-FP, 0, FP].forEach(o => {
      bareTree(g, 142 + o, 152, 40, A.C[dim ? 'night0' : 'night1'], 0);
      A.tulips(g, 430 + o, 152, 18, { t: 0, seed: 5, rim: 0, colors: dim ? ['red1', 'red2', 'red1', 'red2'] : undefined });
      fingerpost(g, 214 + o, 152, dim);
      [0, 11, 22].forEach(d => A.bollard(g, 66 + d + o, 152, { h: 9, tone: dim ? 'slate1' : 'slate2', rim: 0 }));
      A.line(g, 67 + o, 146, 78 + o, 146, 'steel1'); A.line(g, 78 + o, 146, 89 + o, 146, 'steel1');
    });
    return (furn[k] = g.buf);
  }
  let quayS = null, bargeS = null, bridgeS = null;
  function quayStrip() {
    if (quayS) return quayS;
    const g = A.surface(FP, 180);
    [20, 180, 340].forEach(b => [-FP, 0, FP].forEach(o => A.bollard(g, b + o, 167, { h: 9, tone: 'slate2', rim: 0 })));
    return (quayS = g.buf);
  }
  function bargeStrip() {                           // a moored barge with a lit cabin, in front of the quay
    if (bargeS) return bargeS;
    const g = A.surface(FP, 180);
    [-FP, 0, FP].forEach(o => A.boat(g, 276 + o, 179, { kind: 'barge', len: 56, tone: 'night5', t: 0, rim: 0 }));
    return (bargeS = g.buf);
  }
  function bridgeStrip() {                          // far canal glints and the far drawbridge
    if (bridgeS) return bridgeS;
    const g = A.surface(PF, 180);
    for (let i = 0; i < 10; i++) A.hline(g, Math.round(i * 37.2), 140 + (i % 3) * 2, 6 + (i % 4) * 3, 'mist1');
    [-PF, 0, PF].forEach(o => A.drawbridge(g, 244 + o, 139, 62, { tone: 'night4', rim: 0 }));
    return (bridgeS = g.buf);
  }
  // the dead are baked: a few sway frames each, in three tones (costume, dusk, silhouette), drawn once with the shared zombie
  const baked = {};
  function dead(i, tone, frame, N) {
    const key = i + ':' + tone + ':' + frame; if (baked[key]) return baked[key];
    const [, , h, v, hu, pose, sd, sh] = DEAD[i], g = A.surface(64, 64);
    const o = { seed: sd, facing: 'left', variant: v, height: h, hunch: hu, pose, carry: sd === 26 ? 'cheese' : undefined, clogs: v !== 'plain', socks: v === 'hat' || v === 'cheese',
      t: frame * 4.83 / N, glow: 0, shadow: false, rim: 0 };
    if (tone === 2) o.tone = 'night1'; else { o.pants = 'night2'; if (tone === 1) o.shirt = 'night4'; else if (sh) o.shirt = sh; }
    const r = A.zombie(g, 32, 60, o);
    let x0 = 64, y0 = 64, x1 = -1, y1 = -1;
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) if (g.buf[y * 64 + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return (baked[key] = { buf: g.buf, x0, y0, x1, y1, hx: r.head[0] - 32, hy: r.head[1] - 60 });
  }
  function stamp(g, spr, x, y) {                    // x, y: the feet
    const bx = Math.round(x) - 32, by = Math.round(y) - 60, buf = g.buf, W = g.w;
    for (let j = spr.y0; j <= spr.y1; j++) {
      const yy = by + j; if (yy < 0 || yy >= g.h) continue;
      for (let i = spr.x0; i <= spr.x1; i++) { const xx = bx + i; if (xx < 0 || xx >= W) continue; const c = spr.buf[j * 64 + i]; if (c) buf[yy * W + xx] = c; }
    }
  }

  // copy a strip to the screen at a scroll offset; the strip variant at each screen pixel (a dithered
  // blend across the screen, by `amount`) is worked out once, since it never depends on the scroll
  const selCache = new Map();
  function selector(amount, n, y0, y1, xa, xb) {
    const key = [n, y0, y1, xa, xb].join(), hit = selCache.get(key); if (hit) return hit;
    const w = xb - xa, sel = new Uint8Array((y1 - y0) * w);
    for (let y = y0; y < y1; y++) for (let x = xa; x < xb; x++) {
      const v = amount ? amount[x] * n : 0, f = v | 0; let k = f + (v - f > A.bayer(x, y) ? 1 : 0); if (k > n) k = n; sel[(y - y0) * w + x - xa] = k;
    }
    selCache.set(key, sel); return sel;
  }
  function blit(g, strips, period, off, y0, y1, amount, xa, xb) {
    const buf = g.buf, W = g.w; xa = xa || 0; xb = xb == null ? W : xb;
    const w = xb - xa, one = strips.length === 1, sel = one ? null : selector(amount, strips.length - 1, y0, y1, xa, xb), s0 = strips[0];
    for (let y = y0; y < y1; y++) {
      const row = y * period, o2 = y * W + xa, si = (y - y0) * w; let wx = (off + xa) % period;
      if (one) { for (let x = 0; x < w; x++, wx = wx + 1 === period ? 0 : wx + 1) { const c = s0[row + wx]; if (c) buf[o2 + x] = c; } continue; }
      for (let x = 0; x < w; x++, wx = wx + 1 === period ? 0 : wx + 1) {
        const c = strips[sel[si + x]][row + wx]; if (c) buf[o2 + x] = c;
      }
    }
  }

  const backs = {};
  function backdrop(variant) {
    if (backs[variant]) return backs[variant];
    const g = A.surface(320, 180);
    let y0 = 0;
    SKY.forEach(([c, y1], k) => {
      A.rect(g, 0, y0, 320, y1 - y0, c);
      if (k < SKY.length - 1) A.ditherGradient(g, 0, y1 - 14, 320, 14, c, SKY[k + 1][0], 'down');
      y0 = y1;
    });
    A.disc(g, 286, 20, 5, 'paper4'); A.disc(g, 285, 19, 4, 'paper5'); A.px(g, 283, 18, 'paper3'); A.px(g, 287, 22, 'paper3'); A.px(g, 285, 22, 'paper3');
    // the word is a lamp: warm dithered ellipses behind it, a thin amber rule under it
    [['amber0', 108, 22, 0.1], ['amber0', 96, 20, 0.2], ['amber0', 84, 18, 0.3], ['amber1', 72, 16, 0.2], ['amber1', 60, 14, 0.3], ['amber2', 48, 11, 0.16]].forEach(([c, rx, ry, lv]) => {
      for (let yy = -ry; yy <= ry; yy++) {
        const hw = Math.round(rx * Math.sqrt(1 - (yy * yy) / (ry * ry + 1)));
        A.ditherRect(g, 160 - hw, 46 + yy, hw * 2, 1, null, c, lv + 0.04 * variant);
      }
    });
    A.hline(g, 160 - 46, 67, 92, 'amber4'); A.hline(g, 160 - 26, 67, 52, 'amber6'); A.hline(g, 160 - 8, 67, 16, 'amber7');
    A.ditherRect(g, 160 - 66, 67, 20, 1, null, 'amber3', 0.5); A.ditherRect(g, 160 + 46, 67, 20, 1, null, 'amber3', 0.5);
    // ground and far canal
    A.rect(g, 0, 134, 320, 4, 'night3');
    A.rect(g, 0, 138, 320, 10, 'night3'); A.ditherGradient(g, 0, 138, 320, 10, 'night3', 'mist0', 'up');
    // pavement and kerb
    A.rect(g, 0, 148, 320, 5, 'night3');
    A.hline(g, 0, 148, 320, 'slate3'); A.hline(g, 0, 152, 320, 'slate4'); A.hline(g, 0, 153, 320, 'slate1');
    A.ditherGradient(g, 110, 148, 210, 5, null, 'night0', 'right');
    // wet asphalt, darkening into the black ahead
    A.rect(g, 0, 154, 320, 13, 'night2'); A.ditherGradient(g, 0, 154, 320, 13, 'night2', 'night1', 'down');
    A.ditherGradient(g, 110, 154, 210, 13, null, 'night0', 'right');
    return (backs[variant] = g.buf.slice());
  }

  // x0 (world, t = 0), baseline, height, variant, hunch, pose, seed, shirt
  const DEAD = [[186, 152, 48, 'hat', 0.4, 'stand', 21, 'paper1'], [236, 150, 46, 'plain', 0.5, 'stand', 22, 'mist3'], [282, 153, 50, 'bonnet', 0.2, 'stand', 23, null],
    [326, 151, 47, 'cheese', 0.45, 'walk', 24, 'brick5'], [420, 152, 48, 'plain', 0.35, 'stand', 25, 'mist2'], [470, 150, 44, 'plain', 0.55, 'stand', 26, 'paper1'],
    [56, 151, 49, 'woman', 0.25, 'stand', 27, null], [96, 152, 47, 'plain', 0.45, 'stand', 28, 'mist3'], [376, 150, 45, 'hat', 0.5, 'stand', 29, 'mist2']];

  A.panels[13] = {
    text: 'Fak. Oké. One man, one omafiets, three hundred and sixty words. Nachtrit.',
    nl: 'Fak. Oké. Eén man, één omafiets, driehonderdzestig woorden. Nachtrit.',
    draw(g, t) {
      const BX = 100, BY = 161;                       // the omafiets: fixed on screen
      const LX = BX + 25, LY = BY - 19;               // the dynamo lamp
      A.key(g, LX, LY, 2); A.depth(g, 0);
      const offRoad = Math.round(V_ROAD * t), offPav = Math.round(V_PAV * t), offFar = Math.round(V_FAR * t), offSky = Math.round(V_SKY * t);

      // ---- sky, moon, title glow, ground bases: copied; the glow flickers like a lamp between two copies
      const flick = (Math.sin(t * 2.1) + Math.sin(t * 5.3 + 1)) * 0.5 > 0.35 ? 1 : 0;
      g.buf.set(backdrop(flick));
      A.stars(g, t, { n: 30, y0: 2, y1: 78, seed: 11 });
      wordmark();
      A.text(160, 78, 'learn Dutch on the run', 'mist6', 6, false, { align: 'center', shadow: true });

      // ---- far plane: treeline, mill and spire, dark shapes on the pale fog (skyline: barely moves)
      blit(g, [skylineStrip()], PF, offSky, 126, 140, null);
      { const sx = scroll(160, V_SKY, t, PF, 30); if (sx > -10 && sx < 330) blit(g, [skylineStrip()], PF, offSky, 78, 126, null, Math.max(0, Math.round(sx) - 6), Math.min(320, Math.round(sx) + 7)); }
      const mx = scroll(262, V_SKY, t, PF, 30);
      A.windmill(g, mx, 134, 0.86, -t * 0.4, { tone: 'night2', sail: 'night2', t, seed: 2, lit: 0, rim: 0 });
      [[0, 25], [-3, 33], [2, 19]].forEach(([dx, h], i) => {                    // the mill's lit windows, one flickers
        if (i === 2 && Math.sin(t * 1.3) < -0.4) return;
        A.ditherRect(g, mx + dx - 1, 134 - h - 1, 4, 5, null, 'amber2', 0.4); A.rect(g, mx + dx, 134 - h, 2, 3, i === 1 ? 'amber5' : 'amber6');
      });

      // ---- far canal glints and the far drawbridge, behind the houses (canal: slow)
      blit(g, [bridgeStrip()], PF, offFar, 100, 148, null);

      // ---- the town: house row, a little faster than the canal
      blit(g, [houseStrip(0), houseStrip(1), houseStrip(2)], HP, Math.round(V_HOUSE * t), HY0, HY1, DK);

      // ---- pavement seams, then pavement furniture (pavement speed)
      for (let x = 11 - (offPav % 11); x < 320; x += 11) if (hash(x, 4) < 1 - 0.8 * dark(x)) A.vline(g, x, 149, 3, 'night2');
      const PP = 480, pm = 50;
      const lampX = scroll(30, V_PAV, t, PP, pm);
      blit(g, [furnitureStrip(0), furnitureStrip(1)], FP, offPav, 100, 153, DKF);
      // the lantern: dead out in the dark ahead, stuttering back to life as it nears the town, steady behind
      const lampOn = lampX < 150 ? 1 : lampX < 215 ? (Math.sin(t * 17 + lampX * 0.3) > -0.25 ? 1 : 0) : 0;
      const lp = A.lamp(g, lampX, 152, { t, style: 'lantern', h: 38, on: !!lampOn, flicker: lampX < 150 ? 0.05 : 0, seed: 12, light: false });
      if (lampOn) {
        A.glow(g, lp[0], lp[1], 11, { color: 'amber6', strength: 0.5, power: 1.6, q: 4 });
        coneDown(g, lp[0], lp[1] + 2, 0.5, 30, 4, 'amber5', 0.26, 0.6);
        A.streak(g, lampX, 155, 11, { t, seed: 3, color: 'amber5', strength: 0.55, width: 2 });
      }

      // ---- the dead at the kerb: staggered in depth and height, hunched, in their Dutch costume
      const ZP = 480, zm = 40;
      DEAD.forEach(([x0, y, h, v, hu, pose, sd], i) => {
        const x = scroll(x0, V_PAV, t, ZP, zm) - (pose === 'walk' ? 5 * Math.sin(t * 0.8 + sd) : 0);
        if (x < -30 || x > 345) return;
        const d = DK[Math.max(0, Math.min(319, Math.round(x)))], N = pose === 'walk' ? 16 : 4, frame = Math.floor((t % 4.83) / 4.83 * N) % N;
        const sp = dead(i, d > 0.88 ? 2 : d > 0.55 ? 1 : 0, frame, N);
        stamp(g, sp, x, y);
        if (x > 40 && !(Math.sin(t * 1.7 + sd * 3) > 0.96)) A.glow(g, x + sp.hx - 1, y + sp.hy + 4, 4, { color: 'amber5', strength: 0.4, power: 1.3, q: 4 });
      });

      // ---- the road: cobble specks and centre dashes at wheel speed
      for (let x = 0; x < 320; x++) {
        const sp = SPECK[(x + offRoad) & 511];
        if (sp >= 0 && sp < 0.07 * (1 - 0.85 * DK[x])) A.px(g, x, 155 + SPY[(x + offRoad) & 511], 'slate2');
      }
      const dm = ((offRoad % 30) + 30) % 30;
      for (let x = -30 - dm; x < 330; x += 30) A.hline(g, x + 30, 158, 12, dark(x + 36) > 0.6 ? 'slate2' : 'slate4');

      // mist for the beam to cut into
      fog(g, t, 132, 22, 0.34, 7, 7, 'mist3');

      // the lamp's warm glare on the wet road: one hard streak, under the man and the dog
      [['amber7', 0, 34], ['amber6', 34, 62], ['amber5', 62, 84]].forEach(([c, a0, a1]) => A.hline(g, LX + 8 + a0, 156, a1 - a0, c));
      for (let i = 84; i < 116; i++) if (1 - (i - 84) / 32 > A.bayer(LX + 8 + i, 156)) A.px(g, LX + 8 + i, 156, 'amber4');
      A.hline(g, LX + 8, 157, 30, 'amber4');

      // ---- the one man and his one lamp
      A.omafiets(g, BX, BY, { t, rider: true, beam: false, speed: V_ROAD / 56, basket: 'crate', face: 'deadpan' });
      dogHead(g, BX, BY, t);
      A.book(g, BX - 13, BY - 19, { w: 12, h: 4, t, dust: true });
      A.dog(g, BX + 36, BY + 5, { coat: 'golden', pose: 'walk', t, seed: 4, facing: 'right' });

      // the beam: the omafiets' warm amber lamp, a tight bright core, a shaft that thins out into the black
      A.glow(g, LX + 1, LY, 5, { color: 'amber8', strength: 0.6, power: 1.2, q: 4 });
      shaft(g, LX, LY, 0.05, 0.055, 150, 3, 'amber6', 0.42, 1.1, 0.3);
      shaft(g, LX, LY, 0.05, 0.02, 44, 3, 'amber7', 0.36, 0.7, 0.35);


      // ---- quay and canal in front, with the bike, the beam and the lantern mirrored in it
      A.hline(g, 0, 167, 320, 'slate3'); A.hline(g, 0, 168, 320, 'slate1');
      blit(g, [quayStrip()], FP, offRoad, 156, 168, null);
      A.water(g, 0, 169, 320, 11, { t, amp: 0.6, dark: 0.4, color: 'night2', gaps: 0.3, glints: 6 });
      A.streak(g, lampX, 170, 10, { t, seed: 8, color: 'amber5', strength: 0.5, width: 2 });
      A.streak(g, LX + 6, 170, 9, { t, seed: 5, color: 'amber7', strength: 0.45, width: 2 });
      blit(g, [bargeStrip()], FP, offRoad, 160, 180, null);

      // ---- foreground reeds at full speed
      A.reeds(g, scroll(280, V_ROAD * 1.3, t, 440, 40), 181, 44, 22, { t, seed: 4, tone: 'night0', dense: 0.85 });
      A.reeds(g, scroll(10, V_ROAD * 1.3, t, 440, 40), 181, 22, 14, { t, seed: 6, tone: 'night0', dense: 0.8 });
      A.grade(g);
    },
  };
})();
