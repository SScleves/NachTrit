/* Nachtrit intro art toolkit: window.NRART
 *
 * A classic script. index.html and intro/gallery.html load it before intro/panel-*.js and
 * intro/scene-*.js. Read ART-BIBLE.md (repo root) before drawing anything.
 *
 * How it works
 * - Every piece draws into a 320x180 buffer of palette indices (a "surface", called g).
 *   NRART.paint(ctx, draw, t) runs draw(g, t) and turns the buffer into canvas pixels once.
 *   Nothing is ever anti-aliased: there are no arcs, gradients, alpha or smoothing anywhere.
 * - Colours are palette entries, named by ramp and step, dark to light: 'night0'..'night7',
 *   'amber0'..'amber8' and so on (see RAMP_DEFS). Pass the name or NRART.C.night3.
 * - Light, fog and reflections are palette lookups: they move each pixel to the nearest
 *   palette colour of "this pixel lit / fogged / mirrored", with a 4x4 Bayer dither between
 *   strength levels. Draw a layer, then fog or light it, then draw the next layer on top.
 * - Characters and props are drawing functions (man, dog, zombie, omafiets, canalHouse, ...).
 *   They track their own pixels, so each one gets a rim light from the key light (NRART.key).
 * - Crisp words never go into the pixels: NRART.text() records a label that the page draws
 *   on the hi-res overlay canvas after the frame.
 * - Coordinates are pixels on the 320x180 grid, x right, y down. Sprites stand on (x, y):
 *   x is the centre line, y the first row below their feet (the ground line).
 */
(function () {
  'use strict';
  const W = 320, H = 180;
  const NR = window.NRART = { W, H, panels: [], scenes: {}, labels: [], cur: null, version: 1 };

  // ------------------------------------------------------------------ palette
  // Ramps run dark to light. Hue shifts: shadows lean blue, lights lean warm.
  const RAMP_DEFS = {
    night:  ['#04060b', '#080d18', '#0d1424', '#131d33', '#1a2742', '#233352', '#2e4063', '#3b4f74'], // sky, deep shade
    mist:   ['#2c3a4c', '#3a495c', '#4a596c', '#5d6b7d', '#727f90', '#8995a4', '#a3adba', '#c2c9d2'], // fog, haze, far planes
    slate:  ['#0b0d11', '#12151b', '#1a1e26', '#232833', '#2e3440', '#3b424f', '#4b5360'],            // asphalt, roofs, iron, hair
    brick:  ['#170f10', '#221617', '#2f1e1d', '#3d2724', '#4d322c', '#603f35', '#774e40'],            // walls, cobbles
    wood:   ['#140d09', '#21160e', '#302014', '#422c1b', '#573b24', '#6f4d2f', '#8a643e'],            // posts, boats, basket, furniture
    amber:  ['#2a1a0e', '#4a2c12', '#6e4216', '#96591b', '#bf7524', '#df9a3e', '#f2bf68', '#ffe2a0', '#fff6dc'], // the only warmth: windows, lamps
    orange: ['#2e140b', '#55210f', '#803214', '#ab4719', '#d4621f', '#ef7f2c', '#ffa04d', '#ffc684'], // the hero's jacket, bucket hats
    skin:   ['#2a1814', '#4c2e24', '#7a4c38', '#a6704f', '#c99670', '#e2b892', '#f2d4b0'],
    zombie: ['#0b0f10', '#121819', '#1a2224', '#242e30', '#303b3c', '#3e4a49', '#515e5b', '#6b7872'], // dead skin and rags
    eye:    ['#5a3a08', '#a8741a', '#e8b030', '#ffd86a', '#fff3b0'],                                  // the threat glows yellow
    phone:  ['#0a2a36', '#145060', '#2a8aa0', '#5cc8e0', '#a6efff', '#e6fcff'],                       // Tikkie light
    red:    ['#1e0709', '#3e0d10', '#651418', '#8f1c1f', '#b82a28', '#dc4636', '#f47a5a'],            // blood, tulips, the flag
    green:  ['#070c0a', '#0d1612', '#14201a', '#1c2b22', '#26382b', '#334633', '#46583e', '#5f7048'], // grass, reeds, hedges
    paper:  ['#4a4a4c', '#6e6c66', '#928e84', '#b6b0a2', '#d4cdbc', '#ebe5d6', '#fbf8ee'],            // book, bubbles, bonnets, frames
    steel:  ['#1d2026', '#2e333b', '#454b54', '#626a73', '#848c95', '#aab2ba', '#d0d6dc'],            // bike metal, railings
    teal:   ['#0b151c', '#12222c', '#1a303d', '#24404f', '#2f5163', '#3f6679'],                       // the omafiets frame
    cheese: ['#3a2808', '#6a4a10', '#9a6c18', '#c89222', '#e0b040', '#f2cc5c', '#fde68e'],
    fur:    ['#140e0b', '#241913', '#36261c', '#4b3526', '#634633', '#7d5b43', '#977257'],            // the brown dog
    blue:   ['#0c1830', '#142650', '#1e3a70', '#2b4f8e', '#3e66a8', '#5a84c0'],                       // the flag, a sweater
  };
  // Ramps that a light, fog or shade lookup may only land on when it started there: the hero
  // stays the only orange thing, eyes and phones stay the only glowing yellow and cyan.
  const RESERVED = new Set(['eye', 'phone', 'orange', 'red', 'cheese', 'blue']);

  const PAL_RGB = [], PAL_HEX = [], PAL32 = new Uint32Array(256);
  const RAMP_OF = [], POS_OF = new Uint8Array(256), IS_LIGHT = new Uint8Array(256);
  const RAMPS = {}, C = {}, HEX_IDX = {};
  let PAL_N = 0;
  const SHIFT = [];                  // SHIFT[k + 3][i]: colour i moved k steps along its ramp
  const lutCache = new Map(), lvlCache = new Map();

  function parseHex(h) {
    h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function addColor(hex, rampName, pos) {
    if (PAL_N >= 256) throw new Error('NRART: the palette is full (256 colours)');
    const rgb = parseHex(hex), i = PAL_N++;
    PAL_RGB[i] = rgb; PAL_HEX[i] = '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');
    PAL32[i] = (0xff000000 | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]) >>> 0;
    RAMP_OF[i] = rampName || null; POS_OF[i] = pos || 0;
    return i;
  }
  function buildTables() {
    for (let k = -3; k <= 3; k++) {
      const t = SHIFT[k + 3] || (SHIFT[k + 3] = new Uint8Array(256));
      for (let i = 0; i < 256; i++) {
        const r = i < PAL_N ? RAMP_OF[i] : null;
        if (!r) { t[i] = i; continue; }
        const R = RAMPS[r]; t[i] = R[Math.max(0, Math.min(R.length - 1, POS_OF[i] + k))];
      }
    }
    for (let i = 0; i < PAL_N; i++) {
      const r = RAMP_OF[i], p = POS_OF[i];
      IS_LIGHT[i] = (r === 'amber' && p >= 4) || (r === 'eye' && p >= 2) || (r === 'phone' && p >= 2) ? 1 : 0;
    }
    lutCache.clear(); lvlCache.clear();
  }
  /** Add a ramp (dark to light) and return its palette indices. Names become C[name + step]. */
  function ramp(name, hexes) {
    if (RAMPS[name]) return RAMPS[name];
    const idx = hexes.map((h, k) => addColor(h, name, k));
    RAMPS[name] = idx; idx.forEach((v, k) => { C[name + k] = v; });
    buildTables(); return idx;
  }
  C.black = addColor('#000000');
  for (const k in RAMP_DEFS) ramp(k, RAMP_DEFS[k]);

  /** Resolve a colour: a palette index, a name like 'amber5', or (escape hatch) '#rrggbb'. */
  function col(c) {
    if (typeof c === 'number') return c;
    const v = C[c]; if (v !== undefined) return v;
    if (typeof c === 'string' && c[0] === '#') {
      const k = c.toLowerCase();
      if (HEX_IDX[k] === undefined) { HEX_IDX[k] = addColor(k); buildTables(); }
      return HEX_IDX[k];
    }
    throw new Error('NRART: unknown colour "' + c + '"');
  }
  const hexOf = c => (typeof c === 'string' && c[0] === '#') ? c : PAL_HEX[col(c)];
  /** step(c, k): the colour k steps lighter (k > 0) or darker (k < 0) on its own ramp. */
  const step = (c, k) => SHIFT[Math.max(-3, Math.min(3, k)) + 3][col(c)];

  function nearest(r, g, b, allowA, allowB) {
    let best = 0, bd = 1e12;
    for (let i = 0; i < PAL_N; i++) {
      const rr = RAMP_OF[i]; if (rr && rr !== allowA && rr !== allowB && RESERVED.has(rr)) continue;
      const p = PAL_RGB[i], rm = (r + p[0]) * 0.5, dr = r - p[0], dg = g - p[1], db = b - p[2];
      const d = (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db;
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }
  /** A 256-entry lookup: every palette colour under an operation, snapped back to the palette.
   *  mode 'mix' (toward c by s: fog), 'add' (light of colour c at strength s), 'mul' (shade). */
  function lut(mode, c, s) {
    c = col(c); s = Math.round(s * 1000) / 1000;
    const key = mode + ':' + c + ':' + s; let t = lutCache.get(key); if (t) return t;
    t = new Uint8Array(256); const L = PAL_RGB[c], lr = RAMP_OF[c];
    for (let i = 0; i < 256; i++) {
      if (i >= PAL_N || s <= 0) { t[i] = i; continue; }
      const p = PAL_RGB[i]; let r, gg, b;
      if (mode === 'mix') { r = p[0] + (L[0] - p[0]) * s; gg = p[1] + (L[1] - p[1]) * s; b = p[2] + (L[2] - p[2]) * s; }
      else if (mode === 'add') { r = Math.min(255, p[0] + L[0] * s); gg = Math.min(255, p[1] + L[1] * s); b = Math.min(255, p[2] + L[2] * s); }
      else if (mode === 'mul') { r = p[0] * (1 - s + s * L[0] / 255); gg = p[1] * (1 - s + s * L[1] / 255); b = p[2] * (1 - s + s * L[2] / 255); }
      else throw new Error('NRART: unknown light mode ' + mode);
      t[i] = nearest(r, gg, b, RAMP_OF[i], lr);
    }
    lutCache.set(key, t); return t;
  }
  function levels(mode, c, strength, Q) {
    const key = mode + ':' + col(c) + ':' + strength + ':' + Q; let L = lvlCache.get(key); if (L) return L;
    L = []; for (let q = 0; q <= Q; q++) L.push(lut(mode, c, strength * q / Q));
    lvlCache.set(key, L); return L;
  }

  // ------------------------------------------------------------------ dither and hash
  const BAYER = new Float32Array([0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16));
  /** The 4x4 Bayer threshold at a screen pixel, 0..1. A pixel is "on" at level L when L > bayer(x, y). */
  const bayer = (x, y) => BAYER[((y & 3) << 2) | (x & 3)];
  /** A stable pseudo-random number in [0, 1) for integer inputs. Same inputs, same answer, every frame. */
  function hash(a, b) {
    let h = (Math.imul(a | 0, 374761393) + Math.imul((b | 0) + 1013, 668265263)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296;
  }
  /** Smooth periodic noise along x: loops exactly every `period` pixels. */
  function wave(x, period, seed) {
    const p = x * 6.283185307 / period, s = (seed || 0) * 1.7;
    return 0.5 + 0.28 * Math.sin(p + s) + 0.14 * Math.sin(2 * p + s * 2.3 + 1) + 0.08 * Math.sin(3 * p + s * 0.7 + 2);
  }

  // ------------------------------------------------------------------ surface
  function surface(w, h) {
    w = w || W; h = h || H;
    return { w, h, buf: new Uint8Array(w * h), mask: new Uint8Array(w * h), sa: 0, sn: 0, stack: [],
      bx0: 0, by0: 0, bx1: 0, by1: 0, ox: 0, oy: 0, camX: 0, camY: 0, keyX: w * 0.8, keyY: -60, rimK: 1, t: 0 };
  }
  function reset(g, t) {
    g.buf.fill(C.night1); g.mask.fill(0); g.sa = 0; g.stack.length = 0;
    g.ox = g.oy = 0; g.camX = g.camY = 0; g.keyX = g.w * 0.8; g.keyY = -60; g.rimK = 1; g.t = t || 0;
  }

  // ------------------------------------------------------------------ raw writers (screen coords, resolved colour)
  function bbox(g, x0, y0, x1, y1) {
    if (x0 < g.bx0) g.bx0 = x0; if (y0 < g.by0) g.by0 = y0; if (x1 > g.bx1) g.bx1 = x1; if (y1 > g.by1) g.by1 = y1;
  }
  function P(g, x, y, c) {
    if (x < 0 || y < 0 || x >= g.w || y >= g.h) return;
    const i = y * g.w + x; g.buf[i] = c; g.mask[i] = g.sa;
    if (g.sa) bbox(g, x, y, x, y);
  }
  function R(g, x, y, w, h, c) {
    let x0 = x, y0 = y, x1 = x + w, y1 = y + h;
    if (x0 < 0) x0 = 0; if (y0 < 0) y0 = 0; if (x1 > g.w) x1 = g.w; if (y1 > g.h) y1 = g.h;
    if (x0 >= x1 || y0 >= y1) return;
    const buf = g.buf, mask = g.mask, sa = g.sa, gw = g.w;
    for (let yy = y0; yy < y1; yy++) { const o = yy * gw; for (let xx = o + x0, e = o + x1; xx < e; xx++) { buf[xx] = c; mask[xx] = sa; } }
    if (sa) bbox(g, x0, y0, x1 - 1, y1 - 1);
  }
  function L(g, x0, y0, x1, y1, c) {
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1, dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      P(g, x0, y0, c); if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx; } if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  const spanCache = new Map();
  /** Half widths of a midpoint circle, one per row from -r to r. */
  function spans(r) {
    let s = spanCache.get(r); if (s) return s;
    s = new Int16Array(2 * r + 1).fill(-1);
    const set = (row, hw) => { if (hw > s[row + r]) s[row + r] = hw; };
    let x = r, y = 0, err = 1 - r;
    while (x >= y) {
      set(y, x); set(-y, x); set(x, y); set(-x, y);
      y++; if (err < 0) err += 2 * y + 1; else { x--; err += 2 * (y - x) + 1; }
    }
    spanCache.set(r, s); return s;
  }
  function DISC(g, cx, cy, r, c) {
    if (r <= 0) { P(g, cx, cy, c); return; }
    const s = spans(r);
    for (let k = -r; k <= r; k++) { const hw = s[k + r]; R(g, cx - hw, cy + k, 2 * hw + 1, 1, c); }
  }
  function RING(g, cx, cy, r, c, th) {
    th = th || 1; if (r <= 0) { P(g, cx, cy, c); return; }
    const so = spans(r), ri = r - th, si = ri >= 0 ? spans(ri) : null;
    for (let k = -r; k <= r; k++) {
      const ho = so[k + r], hi = (si && Math.abs(k) <= ri) ? si[k + ri] : -1;
      if (hi < 0) { R(g, cx - ho, cy + k, 2 * ho + 1, 1, c); continue; }
      R(g, cx - ho, cy + k, ho - hi, 1, c); R(g, cx + hi + 1, cy + k, ho - hi, 1, c);
    }
  }
  function ELL(g, cx, cy, rx, ry, c) {
    if (ry <= 0) { R(g, cx - rx, cy, 2 * rx + 1, 1, c); return; }
    for (let k = -ry; k <= ry; k++) {
      const f = 1 - (k * k) / ((ry + 0.5) * (ry + 0.5)); const hw = Math.floor(rx * Math.sqrt(Math.max(0, f)) + 0.5);
      R(g, cx - hw, cy + k, 2 * hw + 1, 1, c);
    }
  }
  /** Scanline fill. pts is a flat list x0, y0, x1, y1, ... in pixel-edge coordinates: the
   *  square (0,0) (4,0) (4,2) (0,2) covers pixels x 0..3, y 0..1. */
  const XS = [];
  function POLY(g, pts, c) {
    const n = pts.length >> 1; if (n < 3) return;
    let minY = 1e9, maxY = -1e9;
    for (let i = 1; i < pts.length; i += 2) { if (pts[i] < minY) minY = pts[i]; if (pts[i] > maxY) maxY = pts[i]; }
    const y0 = Math.max(0, Math.ceil(minY - 0.5)), y1 = Math.min(g.h - 1, Math.floor(maxY - 0.5));
    for (let y = y0; y <= y1; y++) {
      const sy = y + 0.5; XS.length = 0;
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = pts[2 * i], yi = pts[2 * i + 1], xj = pts[2 * j], yj = pts[2 * j + 1];
        if ((yi <= sy && yj > sy) || (yj <= sy && yi > sy)) XS.push(xi + (sy - yi) / (yj - yi) * (xj - xi));
      }
      XS.sort((a, b) => a - b);
      for (let k = 0; k + 1 < XS.length; k += 2) {
        const xa = Math.ceil(XS[k] - 0.5), xb = Math.floor(XS[k + 1] - 0.5);
        if (xb >= xa) R(g, xa, y, xb - xa + 1, 1, c);
      }
    }
  }

  // ------------------------------------------------------------------ public primitives (layer offset applied)
  const rnd = Math.round;
  /** One pixel. */
  NR.px = (g, x, y, c) => P(g, rnd(x) + g.ox, rnd(y) + g.oy, col(c));
  /** A filled rectangle, x y w h in pixels. */
  NR.rect = (g, x, y, w, h, c) => R(g, rnd(x) + g.ox, rnd(y) + g.oy, rnd(w), rnd(h), col(c));
  NR.hline = (g, x, y, w, c) => R(g, rnd(x) + g.ox, rnd(y) + g.oy, rnd(w), 1, col(c));
  NR.vline = (g, x, y, h, c) => R(g, rnd(x) + g.ox, rnd(y) + g.oy, 1, rnd(h), col(c));
  /** Bresenham line, one pixel wide; thick = 2 or 3 stacks parallel lines across the minor axis. */
  NR.line = (g, x0, y0, x1, y1, c, thick) => {
    c = col(c); x0 = rnd(x0) + g.ox; y0 = rnd(y0) + g.oy; x1 = rnd(x1) + g.ox; y1 = rnd(y1) + g.oy;
    const t = thick || 1, steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    for (let k = 0; k < t; k++) { const o = k - (t >> 1); if (steep) L(g, x0 + o, y0, x1 + o, y1, c); else L(g, x0, y0 + o, x1, y1 + o, c); }
  };
  /** Filled midpoint circle of radius r (integer) around pixel (cx, cy). */
  NR.disc = (g, cx, cy, r, c) => DISC(g, rnd(cx) + g.ox, rnd(cy) + g.oy, rnd(r), col(c));
  /** Midpoint circle outline, th pixels thick, filled with rects. */
  NR.ring = (g, cx, cy, r, c, th) => RING(g, rnd(cx) + g.ox, rnd(cy) + g.oy, rnd(r), col(c), th);
  NR.ellipse = (g, cx, cy, rx, ry, c) => ELL(g, rnd(cx) + g.ox, rnd(cy) + g.oy, rnd(rx), rnd(ry), col(c));
  /** Scanline polygon: pts = [x0, y0, x1, y1, ...] or [[x, y], ...]. */
  NR.poly = (g, pts, c) => {
    const f = Array.isArray(pts[0]) ? pts.flat() : pts.slice();
    for (let i = 0; i < f.length; i += 2) { f[i] += g.ox; f[i + 1] += g.oy; }
    POLY(g, f, col(c));
  };

  // ------------------------------------------------------------------ dither
  const keep = c => c === null || c === undefined || c === -1;
  /** Fill a rect with a Bayer mix of two colours: level 0 is all c1, 1 is all c2.
   *  Pass null for either colour to leave those pixels as they are (a screen-door veil). */
  NR.ditherRect = (g, x, y, w, h, c1, c2, level) => {
    const a = keep(c1) ? -1 : col(c1), b = keep(c2) ? -1 : col(c2);
    x = rnd(x) + g.ox; y = rnd(y) + g.oy; w = rnd(w); h = rnd(h);
    for (let yy = Math.max(0, y); yy < Math.min(g.h, y + h); yy++) for (let xx = Math.max(0, x); xx < Math.min(g.w, x + w); xx++) {
      const c = level > bayer(xx, yy) ? b : a; if (c >= 0) P(g, xx, yy, c);
    }
  };
  /** A dithered gradient from c1 to c2 across the rect: dir 'down' (default), 'up', 'right', 'left'. */
  NR.ditherGradient = (g, x, y, w, h, c1, c2, dir) => {
    const a = keep(c1) ? -1 : col(c1), b = keep(c2) ? -1 : col(c2); dir = dir || 'down';
    x = rnd(x) + g.ox; y = rnd(y) + g.oy; w = rnd(w); h = rnd(h);
    for (let yy = Math.max(0, y); yy < Math.min(g.h, y + h); yy++) for (let xx = Math.max(0, x); xx < Math.min(g.w, x + w); xx++) {
      const f = dir === 'down' ? (yy - y + 0.5) / h : dir === 'up' ? 1 - (yy - y + 0.5) / h : dir === 'right' ? (xx - x + 0.5) / w : 1 - (xx - x + 0.5) / w;
      const c = f > bayer(xx, yy) ? b : a; if (c >= 0) P(g, xx, yy, c);
    }
  };
  /** A dithered disc of colour c: at `level` coverage, falling off toward the edge when soft > 0
   *  (soft = falloff power, 1 is linear). c2 (optional) fills the uncovered pixels. */
  NR.ditherDisc = (g, cx, cy, r, c, level, soft, c2) => {
    const a = col(c), b = keep(c2) ? -1 : col(c2); level = level == null ? 0.5 : level;
    cx = rnd(cx) + g.ox; cy = rnd(cy) + g.oy; r = rnd(r);
    for (let yy = cy - r; yy <= cy + r; yy++) for (let xx = cx - r; xx <= cx + r; xx++) {
      const d = Math.hypot(xx - cx, yy - cy) / (r + 0.5); if (d >= 1) continue;
      const lv = soft ? level * Math.pow(1 - d, soft) : level;
      if (lv > bayer(xx, yy)) P(g, xx, yy, a); else if (b >= 0) P(g, xx, yy, b);
    }
  };
  NR.bayer = bayer; NR.hash = hash; NR.wave = wave;

  // ------------------------------------------------------------------ light, shade, fog (palette lookups)
  function applyField(g, x0, y0, x1, y1, Ls, Q, field, lightScale) {
    // field(xx, yy) returns 0..1; pixels move up the lookup levels with a Bayer dither between them
    const buf = g.buf, gw = g.w;
    x0 = Math.max(0, x0); y0 = Math.max(0, y0); x1 = Math.min(gw - 1, x1); y1 = Math.min(g.h - 1, y1);
    for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) {
      let lv = field(xx, yy); if (lv <= 0) continue;
      const i = yy * gw + xx, c = buf[i];
      if (lightScale !== undefined && IS_LIGHT[c]) lv *= lightScale;
      const v = (lv > 1 ? 1 : lv) * Q; let q = v | 0; if (v - q > BAYER[((yy & 3) << 2) | (xx & 3)]) q++;
      if (q > 0) buf[i] = Ls[q > Q ? Q : q][c];
    }
  }
  /** Radial light around (x, y): r is the reach (ry for an ellipse), falling off with `power`.
   *  o: { color: 'amber6', strength: 0.5, mode: 'add' | 'mul' | 'mix', power: 1.5, ry, q: 6 } */
  NR.glow = (g, x, y, r, o) => {
    o = o || {}; const Q = o.q || 6, ry = o.ry || r, pw = o.power == null ? 1.5 : o.power;
    const Ls = levels(o.mode || 'add', o.color || 'amber6', o.strength == null ? 0.5 : o.strength, Q);
    const cx = x + g.ox, cy = y + g.oy;
    applyField(g, Math.floor(cx - r), Math.floor(cy - ry), Math.ceil(cx + r), Math.ceil(cy + ry), Ls, Q, (xx, yy) => {
      const dx = (xx - cx) / r, dy = (yy - cy) / ry, d2 = dx * dx + dy * dy; if (d2 >= 1) return 0;
      return Math.pow(1 - Math.sqrt(d2), pw);
    });
  };
  /** A light cone from (x, y) along `angle` (radians, 0 = right, PI/2 = down), half-angle
   *  `spread`, reaching `len` pixels, with a dithered falloff along it and across its edges.
   *  o: { color: 'paper5', strength: 0.45, mode: 'add', width: 2 (at the source), fade: 1,
   *       edge: 0.5 (soft part of the half width), q: 6 } */
  NR.cone = (g, x, y, angle, spread, len, o) => {
    o = o || {}; const Q = o.q || 6;
    const Ls = levels(o.mode || 'add', o.color || 'paper5', o.strength == null ? 0.45 : o.strength, Q);
    const w0 = (o.width == null ? 2 : o.width) / 2, fade = o.fade == null ? 1 : o.fade, edge = o.edge == null ? 0.5 : o.edge;
    const ax = x + g.ox, ay = y + g.oy, ca = Math.cos(angle), sa = Math.sin(angle), tn = Math.tan(spread);
    const hw = w0 + len * tn, ex = ax + ca * len, ey = ay + sa * len;
    const xs = [ax - sa * w0, ax + sa * w0, ex - sa * hw, ex + sa * hw], ys = [ay + ca * w0, ay - ca * w0, ey + ca * hw, ey - ca * hw];
    applyField(g, Math.floor(Math.min(...xs)), Math.floor(Math.min(...ys)), Math.ceil(Math.max(...xs)), Math.ceil(Math.max(...ys)), Ls, Q, (xx, yy) => {
      const vx = xx + 0.5 - ax, vy = yy + 0.5 - ay, u = vx * ca + vy * sa; if (u < 0 || u > len) return 0;
      const v = Math.abs(vy * ca - vx * sa), half = w0 + u * tn; if (v > half) return 0;
      const e = 1 - v / half, ef = e >= edge ? 1 : e / edge;
      return Math.pow(1 - u / len, fade) * ef;
    });
  };
  /** A soft dark contact shadow on the ground under a sprite. */
  NR.shadow = (g, x, y, rx, ry, strength) => NR.glow(g, x, y, rx, { ry: ry || 2, mode: 'mul', color: 'black', strength: strength == null ? 0.55 : strength, power: 0.6, q: 4 });
  /** Light or shade a rectangle evenly (mode 'add' light, 'mul' shade, 'mix' tint), dithered. */
  NR.tint = (g, x, y, w, h, color, amount, mode) => {
    const Q = 8, Ls = levels(mode || 'mix', color, 1, Q); x = rnd(x) + g.ox; y = rnd(y) + g.oy;
    applyField(g, x, y, x + rnd(w) - 1, y + rnd(h) - 1, Ls, Q, () => amount);
  };
  /** Atmospheric perspective: pull a region toward the fog colour. amount 0..1, or top/bottom
   *  for a vertical gradient (fog thickest near the ground: top 0.2, bottom 0.6).
   *  Lit windows and eyes keep more of themselves (o.lights, default 0.35 of the amount).
   *  o: { amount, top, bottom, color: 'mist3', lights: 0.35 } */
  NR.haze = (g, x, y, w, h, o) => {
    o = typeof o === 'number' ? { amount: o } : (o || {});
    const Q = 8, Ls = levels('mix', o.color || 'mist3', 1, Q);
    const a0 = o.top == null ? (o.amount == null ? 0.5 : o.amount) : o.top, a1 = o.bottom == null ? a0 : o.bottom;
    x = rnd(x) + g.ox; y = rnd(y) + g.oy; w = rnd(w); h = rnd(h);
    applyField(g, x, y, x + w - 1, y + h - 1, Ls, Q, (xx, yy) => a0 + (a1 - a0) * (yy - y + 0.5) / h, o.lights == null ? 0.35 : o.lights);
  };
  /** Drifting mist: a soft band centred h/2 below y that thickens and thins along x and slides
   *  sideways with time. It loops seamlessly. o: { amount: 0.45, speed: 5 (px/s), color: 'mist5', seed } */
  NR.mist = (g, t, y, h, o) => {
    o = o || {}; const amt = o.amount == null ? 0.45 : o.amount, sp = o.speed == null ? 5 : o.speed, seed = o.seed || 0;
    const Q = 8, Ls = levels('mix', o.color || 'mist5', 1, Q), lf = o.lights == null ? 0.3 : o.lights;
    const buf = g.buf, gw = g.w, cy0 = y + g.oy + h / 2;
    for (let xx = 0; xx < gw; xx++) {
      const sx = xx - g.ox + t * sp;
      const n = wave(sx, gw, seed), n2 = wave(sx * 0.5 + 40, gw, seed + 3);
      const th = Math.max(0.5, h * (0.35 + 0.65 * n) / 2), cy = cy0 + (n2 - 0.5) * h * 0.5;
      const r0 = Math.max(0, Math.ceil(cy - th)), r1 = Math.min(g.h - 1, Math.floor(cy + th));
      for (let yy = r0; yy <= r1; yy++) {
        const d = Math.abs(yy + 0.5 - cy) / th; if (d >= 1) continue;
        const i = yy * gw + xx, c = buf[i];
        let lv = amt * (0.55 + 0.45 * n) * (1 - d * d); if (IS_LIGHT[c]) lv *= lf;
        const v = lv * Q; let q = v | 0; if (v - q > BAYER[((yy & 3) << 2) | (xx & 3)]) q++;
        if (q > 0) buf[i] = Ls[q > Q ? Q : q][c];
      }
    }
  };

  // ------------------------------------------------------------------ sky, stars, moon, rain
  /** Sky in flat bands with dithered seams. stops: colours top to bottom, e.g.
   *  ['night1', 'night2', 'night3', 'night5']. o: { blend: rows of dither at each seam (default 6) } */
  NR.sky = (g, stops, y0, y1, o) => {
    y0 = y0 == null ? 0 : y0; y1 = y1 == null ? g.h : y1; o = o || {};
    const cs = stops.map(col), n = cs.length, seg = (y1 - y0) / Math.max(1, n - 1), bl = o.blend == null ? Math.min(6, seg) : o.blend;
    if (n === 1) { NR.rect(g, -g.ox, y0, g.w, y1 - y0, cs[0]); return; }
    for (let yy = Math.max(0, y0 + g.oy); yy < Math.min(g.h, y1 + g.oy); yy++) {
      const f = (yy - g.oy - y0) / seg, k = Math.min(n - 2, Math.floor(f)), within = (f - k) * seg;
      const lv = within < seg - bl ? 0 : (within - (seg - bl)) / bl;
      const o2 = yy * g.w;
      for (let xx = 0; xx < g.w; xx++) { g.buf[o2 + xx] = lv > BAYER[((yy & 3) << 2) | (xx & 3)] ? cs[k + 1] : cs[k]; g.mask[o2 + xx] = 0; }
    }
  };
  /** Stars that twinkle. o: { n: 40, y0: 0, y1: 90, seed: 7, x0: 0, x1: W } */
  NR.stars = (g, t, o) => {
    o = o || {}; const n = o.n || 40, y0 = o.y0 || 0, y1 = o.y1 == null ? 90 : o.y1, seed = o.seed || 7, x0 = o.x0 || 0, x1 = o.x1 == null ? g.w : o.x1;
    const c1 = C.paper6, c2 = C.mist6, c3 = C.mist4;
    for (let i = 0; i < n; i++) {
      const x = x0 + Math.floor(hash(i, seed) * (x1 - x0)), y = y0 + Math.floor(hash(i, seed + 1) * (y1 - y0)), b = hash(i, seed + 2);
      const tw = Math.sin(t * (0.8 + 2.4 * hash(i, seed + 3)) + i * 1.7);
      if (tw < -0.55) continue;
      const c = b > 0.9 ? c1 : b > 0.55 ? c2 : c3; NR.px(g, x, y, tw < 0 && c !== c3 ? c3 : c);
      if (b > 0.96 && tw > 0.4) { NR.px(g, x - 1, y, c3); NR.px(g, x + 1, y, c3); NR.px(g, x, y - 1, c3); NR.px(g, x, y + 1, c3); }
    }
  };
  /** The moon with a soft halo. o: { halo: 0.35, phase: 0.25 (0 full, toward 1 thinner), seed } */
  NR.moon = (g, x, y, r, o) => {
    o = o || {};
    NR.glow(g, x, y, r * 3.4, { color: 'mist6', strength: o.halo == null ? 0.32 : o.halo, power: 2.2 });
    NR.disc(g, x, y, r, 'paper5');
    const ph = o.phase == null ? 0.22 : o.phase, sh = Math.round(r * (1 - ph * 2));
    // the dark side: everything right of a shifted disc edge is in shade
    for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
      if (xx * xx + yy * yy > r * r + r) continue;
      if ((xx + sh) * (xx + sh) + yy * yy > r * r + r) NR.px(g, x + xx, y + yy, xx > 0 ? 'paper3' : 'paper4');
    }
    const cr = [[-0.35, -0.3, 'paper4'], [0.15, 0.25, 'paper4'], [-0.1, 0.45, 'paper3'], [0.35, -0.4, 'paper4']];
    for (const [cx, cy, c] of cr) NR.px(g, x + Math.round(cx * r), y + Math.round(cy * r), c);
    if (r >= 5) NR.px(g, x + Math.round(-0.35 * r) + 1, y + Math.round(-0.3 * r), 'paper4');
  };
  /** Rain: slanted streaks that loop forever. o: { n: 90, len: 5, speed: 150, slant: 0.25,
   *  color: 'mist5', far: 'mist3', x, y, w, h, seed, splash: groundY or null } */
  NR.rain = (g, t, o) => {
    o = o || {}; const n = o.n || 90, len = o.len || 5, sp = o.speed || 150, sl = o.slant == null ? 0.25 : o.slant;
    const x0 = o.x || 0, y0 = o.y || 0, w = o.w || g.w, h = o.h || g.h, seed = o.seed || 3;
    const cn = col(o.color || 'mist5'), cf = col(o.far || 'mist3');
    for (let i = 0; i < n; i++) {
      const r1 = hash(i, seed), r2 = hash(i, seed + 1), r3 = hash(i, seed + 2), near = r3 > 0.7;
      const l = Math.round(len * (near ? 1.4 : 0.8)), s = sp * (0.75 + 0.5 * r3), span = h + l;
      const yy = y0 + ((r2 * span + t * s) % span) - l;
      const xx = x0 + ((((r1 * w + (yy - y0) * sl) % w) + w) % w);
      NR.line(g, xx, yy, xx + l * sl, yy + l, near ? cn : cf);
    }
    if (o.splash != null) {
      for (let i = 0; i < Math.round(n / 6); i++) {
        const k = Math.floor(t * 9) + i * 7; if (hash(k, seed + 9) < 0.5) continue;
        const sx = x0 + Math.floor(hash(k, seed + 10) * w), sy = o.splash + Math.floor(hash(k, seed + 11) * 3);
        NR.px(g, sx - 1, sy - 1, cf); NR.px(g, sx + 1, sy - 1, cf); NR.px(g, sx, sy, cn);
      }
    }
  };

  // ------------------------------------------------------------------ water and wet ground
  /** Mirror what is above the line y into the rect below it, rippled and darkened: canals, puddles
   *  and wet asphalt. Draw everything above first. stretch > 1 drags reflections into long streaks.
   *  o: { t, amp: 1.5 (ripple px), speed: 2, stretch: 1, dark: 0.45, color: 'night2', gaps: 0.18,
   *       glints: 10 (sparkles), glint: 'mist5' } */
  NR.water = (g, x, y, w, h, o) => {
    o = o || {}; const t = o.t || 0, amp = o.amp == null ? 1.5 : o.amp, sp = o.speed == null ? 2 : o.speed;
    const st = o.stretch || 1, gaps = o.gaps == null ? 0.18 : o.gaps, wc = col(o.color || 'night2');
    const Ld = lut('mix', wc, o.dark == null ? 0.45 : o.dark), Lg = lut('mix', wc, Math.min(1, (o.dark == null ? 0.45 : o.dark) + 0.3));
    x = rnd(x) + g.ox; y = rnd(y) + g.oy; w = rnd(w); h = rnd(h);
    const buf = g.buf, mask = g.mask, gw = g.w;
    const xa = Math.max(0, x), xb = Math.min(gw, x + w);
    for (let r = 0; r < h; r++) {
      const yy = y + r; if (yy < 0 || yy >= g.h) continue;
      const d = (r + 0.5) / h, sy = y - 1 - Math.floor(r / st);
      const off = Math.round(Math.sin(r * 0.85 + t * sp * 2.2) * amp * (0.35 + d) + Math.sin(r * 0.31 - t * sp) * amp * 0.5 * d);
      const broken = Math.sin(r * 1.9 + t * sp * 1.3) * Math.sin(r * 0.47 - t * sp * 0.6) > 1 - gaps * 2;
      const o2 = yy * gw;
      for (let xx = xa; xx < xb; xx++) {
        let c;
        if (sy < 0) c = wc;
        else { const sx = Math.max(0, Math.min(gw - 1, xx + off)); c = buf[sy * gw + sx]; c = broken ? Lg[c] : Ld[c]; }
        buf[o2 + xx] = c; mask[o2 + xx] = 0;
      }
    }
    const ng = o.glints == null ? 10 : o.glints, gc = col(o.glint || 'mist5');
    for (let i = 0; i < ng; i++) {
      const k = Math.floor(t * 2.5 + i * 0.37), r1 = hash(i * 31 + k, 5), r2 = hash(i * 31 + k, 6);
      if (hash(i, k) < 0.35) continue;
      const gx = x + Math.floor(r1 * w), gy = y + 1 + Math.floor(r2 * r2 * (h - 2)), gl = 1 + Math.floor(hash(i, 7) * 3);
      R(g, gx, gy, gl, 1, gc);
    }
  };
  /** A light's reflection on wet ground or water: a broken vertical streak under it that
   *  shimmers. o: { color: 'amber6', strength: 0.7, width: 1, t, seed } */
  NR.streak = (g, x, y, len, o) => {
    o = o || {}; const Q = 5, Ls = levels('add', o.color || 'amber6', o.strength == null ? 0.7 : o.strength, Q);
    const t = o.t || 0, seed = o.seed || 0, w = o.width || 1, cx = rnd(x) + g.ox, cy = rnd(y) + g.oy;
    for (let k = 0; k < len; k++) {
      const f = 1 - k / len, wob = Math.round(Math.sin(k * 0.9 + t * 3 + seed) * (0.3 + k / len) * 1.2);
      const on = hash(Math.floor(k / 2) + seed * 37, Math.floor(t * 5 + seed)) < 0.35 + f * 0.6;
      const lv = (on ? 1 : 0.35) * (0.25 + 0.75 * f);
      applyField(g, cx + wob - (w >> 1), cy + k, cx + wob - (w >> 1) + w - 1, cy + k, Ls, Q, () => lv);
    }
  };

  // ------------------------------------------------------------------ texture
  /** Brick in running bond. Only repaints pixels of colour `only` when given (draw a gable shape
   *  in the base colour, then texture just that). o: { base: 'brick3', bw: 4, bh: 2, seed, only, vary: 0.18 } */
  NR.brick = (g, x, y, w, h, o) => {
    o = o || {}; const base = col(o.base || 'brick3'), mortar = step(base, -1), lite = step(base, 1), dark = step(base, -1);
    const bw = o.bw || 4, bh = o.bh || 2, seed = o.seed || 0, only = o.only == null ? -1 : col(o.only), vary = o.vary == null ? 0.18 : o.vary;
    x = rnd(x) + g.ox; y = rnd(y) + g.oy;
    for (let yy = Math.max(0, y); yy < Math.min(g.h, y + rnd(h)); yy++) {
      const ry = yy - y, course = Math.floor(ry / (bh + 1)), rowIn = ry % (bh + 1), shift = (course & 1) ? (bw + 1) >> 1 : 0;
      for (let xx = Math.max(0, x); xx < Math.min(g.w, x + rnd(w)); xx++) {
        const i = yy * g.w + xx; if (only >= 0 && g.buf[i] !== only) continue;
        const rx = xx - x + shift, colIn = rx % (bw + 1), bi = Math.floor(rx / (bw + 1));
        let c = base;
        if (rowIn === bh || colIn === bw) c = mortar;
        else { const hv = hash(bi * 7 + seed, course * 13 + seed); if (hv < vary * 0.5) c = lite; else if (hv < vary) c = dark; }
        g.buf[i] = c;
      }
    }
  };
  /** Roof tiles: rows of scalloped tiles with dark seams. o: { base: 'slate3', th: 2, tw: 3, only } */
  NR.tiles = (g, x, y, w, h, o) => {
    o = o || {}; const base = col(o.base || 'slate3'), seam = step(base, -2), lite = step(base, 1);
    const th = o.th || 2, tw = o.tw || 3, only = o.only == null ? -1 : col(o.only);
    x = rnd(x) + g.ox; y = rnd(y) + g.oy;
    for (let yy = Math.max(0, y); yy < Math.min(g.h, y + rnd(h)); yy++) {
      const ry = yy - y, row = Math.floor(ry / (th + 1)), rowIn = ry % (th + 1);
      for (let xx = Math.max(0, x); xx < Math.min(g.w, x + rnd(w)); xx++) {
        const i = yy * g.w + xx; if (only >= 0 && g.buf[i] !== only) continue;
        const rx = xx - x + ((row & 1) ? (tw >> 1) + 1 : 0), cin = rx % (tw + 1);
        g.buf[i] = rowIn === th ? seam : (cin === tw && rowIn === th - 1) ? seam : (rowIn === 0 && cin === 0) ? lite : base;
      }
    }
  };
  /** One window. o: { lit: true/false or 0..1 brightness, frame: 'paper2', bars: 'cross' | 't' |
   *  'v' | 'none', t, seed, flicker: 0..1 chance this window flickers, detail: 'tulip' | 'cat' |
   *  'plant' | 'curtain' | null, sill: true, glow: 0.25 (light spill on the wall) } */
  NR.window = (g, x, y, w, h, o) => {
    o = o || {}; const t = o.t || 0, seed = o.seed || 0;
    let lit = o.lit === true ? 1 : o.lit === false || o.lit == null ? 0 : o.lit;
    if (lit && o.flicker && hash(seed, 77) < o.flicker) {
      const k = Math.floor(t * 7 + seed); if (hash(k, seed + 5) < 0.18) lit *= 0.45;
    }
    const fr = col(o.frame || 'paper2');
    NR.rect(g, x, y, w, h, fr);
    const gx = x + 1, gy = y + 1, gw2 = w - 2, gh = h - 2;
    if (lit > 0) {
      const b = lit > 0.7 ? 0 : lit > 0.4 ? -1 : -2;
      NR.rect(g, gx, gy, gw2, gh, step('amber5', b));
      NR.rect(g, gx, gy, gw2, 1, step('amber4', b));
      if (gw2 >= 3 && gh >= 4) NR.ditherRect(g, gx + 1, gy + Math.floor(gh / 2), gw2 - 2, Math.ceil(gh / 2) - 1, null, step('amber6', b), 0.5);
    } else {
      NR.rect(g, gx, gy, gw2, gh, 'night2'); NR.px(g, gx + gw2 - 1, gy, 'mist0');
      if (gh > 3) NR.px(g, gx + gw2 - 2, gy + 1, 'night4');
    }
    const bars = o.bars || (w >= 5 && h >= 6 ? 'cross' : 'none');
    const mx = x + (w >> 1) - ((w & 1) ? 0 : 1), my = y + Math.round(h * 0.4);
    if (bars === 'cross' || bars === 'v') NR.vline(g, w & 1 ? mx : mx + 1, gy, gh, fr);
    if (bars === 'cross' || bars === 't') NR.hline(g, gx, my, gw2, fr);
    if (lit > 0 && o.detail && gw2 >= 3) {
      const by = y + h - 2;
      if (o.detail === 'tulip') { NR.px(g, gx + 1, by, 'green3'); NR.px(g, gx + 1, by - 1, 'red4'); NR.px(g, gx + 2, by, 'wood3'); }
      else if (o.detail === 'plant') { NR.px(g, gx + gw2 - 2, by, 'green2'); NR.px(g, gx + gw2 - 2, by - 1, 'green3'); NR.px(g, gx + gw2 - 3, by - 1, 'green2'); }
      else if (o.detail === 'cat') { NR.rect(g, gx + 1, by - 1, 2, 2, 'night0'); NR.px(g, gx + 1, by - 2, 'night0'); NR.px(g, gx + 2, by - 2, 'night0'); if (Math.sin(t * 1.3 + seed) < 0.9) NR.px(g, gx + 2, by - 1, 'eye2'); }
      else if (o.detail === 'curtain') { NR.vline(g, gx, gy, gh, 'amber3'); NR.vline(g, gx + gw2 - 1, gy, gh, 'amber3'); }
    }
    if (o.sill !== false) NR.hline(g, x - (w > 4 ? 1 : 0), y + h, w + (w > 4 ? 2 : 0), 'slate1');
    if (lit > 0 && o.glow !== 0) NR.glow(g, x + w / 2, y + h / 2, Math.max(w, h) * 1.3, { strength: (o.glow == null ? 0.22 : o.glow) * lit, color: 'amber5', power: 1.2, q: 4 });
  };
  /** A grid of windows. o: { cols, rows, w: 4, h: 6, gx: 3, gy: 5, lit: 0.45 (chance), seed, t,
   *  flicker: 0.15, frame, bars, details: true, glow } */
  NR.windows = (g, x, y, o) => {
    o = o || {}; const cols = o.cols || 2, rows = o.rows || 2, w = o.w || 4, h = o.h || 6, gx = o.gx == null ? 3 : o.gx, gy = o.gy == null ? 5 : o.gy;
    const seed = o.seed || 0, p = o.lit == null ? 0.45 : o.lit;
    const det = ['tulip', 'cat', 'plant', 'curtain'];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const s = seed * 131 + j * 17 + i * 5, lit = hash(s, 1) < p;
      NR.window(g, x + i * (w + gx), y + j * (h + gy), w, h, { lit: lit ? 0.75 + 0.25 * hash(s, 2) : 0, t: o.t, seed: s, flicker: o.flicker == null ? 0.15 : o.flicker,
        frame: o.frame, bars: o.bars, glow: o.glow, detail: o.details !== false && hash(s, 3) < 0.3 ? det[Math.floor(hash(s, 4) * det.length)] : null });
    }
  };

  // ------------------------------------------------------------------ camera drift and depth
  /** Slow camera drift: at most 12 px, out over `period` seconds and back, seamless.
   *  Then call NRART.depth(g, d) before each layer: 0 for the sky, ~0.3 far, ~0.6 mid, 1 near.
   *  o: { x: 8, y: 0, period: 8 } */
  NR.camera = (g, t, o) => {
    o = o || {}; const p = o.period || 8, k = (1 - Math.cos(Math.PI * t / p)) / 2;
    const cl = v => Math.max(-12, Math.min(12, v));
    g.camX = cl(o.x == null ? 8 : o.x) * k; g.camY = cl(o.y || 0) * k; NR.depth(g, 1);
  };
  NR.depth = (g, d) => { g.ox = Math.round(-g.camX * d); g.oy = Math.round(-g.camY * d); };
  /** The key light for this piece (screen coords). Sprites put their rim light on the side
   *  facing it. k: rim strength in ramp steps (1 subtle, 2 strong, 0 none). */
  NR.key = (g, x, y, k) => { g.keyX = x; g.keyY = y; if (k != null) g.rimK = k; };

  // ------------------------------------------------------------------ sprites: own pixels, rim light
  /** Start a sprite: every pixel drawn until NRART.end() belongs to it. Sprites nest. */
  NR.begin = g => {
    g.stack.push([g.sa, g.bx0, g.by0, g.bx1, g.by1]);
    g.sn = (g.sn % 250) + 1; g.sa = g.sn; g.bx0 = g.by0 = 1e9; g.bx1 = g.by1 = -1e9; return g.sa;
  };
  /** Finish a sprite and add its rim light: pixels whose neighbour toward the key light is not
   *  part of the sprite move k steps up their ramp. rim: undefined (use the piece's key),
   *  0 / false (none), or a number of steps. rimColor: light the rim with a colour instead. */
  NR.end = (g, rim, rimColor) => {
    const id = g.sa, x0 = Math.max(0, g.bx0), y0 = Math.max(0, g.by0), x1 = Math.min(g.w - 1, g.bx1), y1 = Math.min(g.h - 1, g.by1);
    const k = rim == null || rim === true ? g.rimK : rim === false ? 0 : rim;
    if (k && x1 >= x0) {
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; let dx = g.keyX - cx, dy = g.keyY - cy; const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
      const sx = dx > 0.38 ? 1 : dx < -0.38 ? -1 : 0, sy = dy > 0.38 ? 1 : dy < -0.38 ? -1 : 0;
      const T = rimColor ? lut('add', rimColor, 0.25 * k) : SHIFT[Math.min(3, k) + 3];
      const buf = g.buf, mask = g.mask, gw = g.w;
      for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) {
        const i = yy * gw + xx; if (mask[i] !== id) continue;
        const nx = xx + sx, ny = yy + sy;
        if (nx < 0 || ny < 0 || nx >= gw || ny >= g.h || mask[ny * gw + nx] !== id) buf[i] = T[buf[i]];
      }
    }
    const pr = g.stack.pop() || [0, 1e9, 1e9, -1e9, -1e9];
    g.sa = pr[0];
    if (g.sa) { g.bx0 = Math.min(pr[1], x0); g.by0 = Math.min(pr[2], y0); g.bx1 = Math.max(pr[3], x1); g.by1 = Math.max(pr[4], y1); }
  };

  /** A pen for drawing a sprite relative to its anchor, mirrored when flip is true. Columns are
   *  mirrored around the anchor line, so a shape spanning dx -6..5 still spans -6..5 flipped. */
  function Pen(g, x, y, flip) { this.g = g; this.x = rnd(x) + g.ox; this.y = rnd(y) + g.oy; this.f = !!flip; }
  Pen.prototype.X = function (dx) { return this.f ? this.x - dx - 1 : this.x + dx; };
  Pen.prototype.r = function (dx, dy, w, h, c) { if (w <= 0 || h <= 0) return; R(this.g, this.f ? this.x - dx - w : this.x + dx, this.y + dy, w, h, col(c)); };
  Pen.prototype.p = function (dx, dy, c) { P(this.g, this.X(dx), this.y + dy, col(c)); };
  Pen.prototype.l = function (dx0, dy0, dx1, dy1, c, th) {
    c = col(c); const a = this.X(rnd(dx0)), b = this.y + rnd(dy0), e = this.X(rnd(dx1)), f = this.y + rnd(dy1);
    const t = th || 1, steep = Math.abs(f - b) > Math.abs(e - a);
    for (let k = 0; k < t; k++) { const o = k - (t >> 1); if (steep) L(this.g, a + o, b, e + o, f, c); else L(this.g, a, b + o, e, f + o, c); }
  };
  Pen.prototype.disc = function (dx, dy, r, c) { DISC(this.g, this.X(dx), this.y + dy, r, col(c)); };
  Pen.prototype.ring = function (dx, dy, r, c, th) { RING(this.g, this.X(dx), this.y + dy, r, col(c), th); };
  Pen.prototype.ell = function (dx, dy, rx, ry, c) { ELL(this.g, this.X(dx), this.y + dy, rx, ry, col(c)); };
  Pen.prototype.poly = function (pts, c) {
    const f = pts.slice(); for (let i = 0; i < f.length; i += 2) { f[i] = this.f ? this.x - f[i] : this.x + f[i]; f[i + 1] += this.y; }
    POLY(this.g, f, col(c));
  };
  const mapCache = new WeakMap();
  /** Stamp a pixel map: rows of characters, each looked up in legend (char -> colour); '.' and
   *  ' ' are transparent. (dx, dy) is the map's top-left corner relative to the anchor. */
  Pen.prototype.map = function (dx, dy, rows, legend) {
    let cm = mapCache.get(rows);
    if (!cm) { cm = []; rows.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const ch = row[i]; if (ch !== '.' && ch !== ' ') cm.push(i, j, ch); } }); mapCache.set(rows, cm); }
    for (let k = 0; k < cm.length; k += 3) { const c = legend[cm[k + 2]]; if (c === undefined || c === null) continue; P(this.g, this.X(dx + cm[k]), this.y + dy + cm[k + 1], typeof c === 'number' ? c : col(c)); }
  };
  NR.pen = (g, x, y, flip) => new Pen(g, x, y, flip);

  // ------------------------------------------------------------------ crisp text (hi-res overlay)
  /** Record a crisp label at pixel (x, y) (left end of the baseline) in a palette colour. The page
   *  draws it on the hi-res canvas after the frame. size is in pixels of the 320 grid.
   *  o: { align: 'left' | 'center' | 'right', shadow: true (a dark drop shadow) } */
  NR.text = (x, y, str, color, size, bold, o) => {
    const s = NR.cur, ox = s ? s.ox : 0, oy = s ? s.oy : 0;
    NR.labels.push({ x: x + ox, y: y + oy, str: String(str), color: hexOf(color == null ? 'paper5' : color), size: size || 7, bold: !!bold,
      align: (o && o.align) || 'left', shadow: !!(o && o.shadow) });
  };
  NR.font = (size, bold) => `${bold ? 'bold ' : ''}${size}px "Segoe UI", system-ui, -apple-system, sans-serif`;
  let measureCtx = null;
  /** The width in grid pixels a label will take, for sizing bubbles and signs. */
  NR.textWidth = (str, size, bold) => {
    if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
    measureCtx.font = NR.font((size || 7) * 10, bold); return measureCtx.measureText(String(str)).width / 10;
  };
  /** Draw recorded labels on a hi-res 2D context, k hi-res pixels per grid pixel. */
  NR.drawLabels = (ctx, labels, k) => {
    for (const l of labels) {
      ctx.font = NR.font(l.size * k, l.bold); ctx.textAlign = l.align || 'left'; ctx.textBaseline = 'alphabetic';
      if (l.shadow) { ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillText(l.str, l.x * k + Math.max(1, k * 0.5), l.y * k + Math.max(1, k * 0.5)); }
      ctx.fillStyle = l.color; ctx.fillText(l.str, l.x * k, l.y * k);
    }
    ctx.textAlign = 'left';
  };

  // ------------------------------------------------------------------ paint
  const surfaces = new WeakMap();
  /** Run draw(g, t) on the canvas's surface and put the pixels on the canvas. Labels land in
   *  NRART.labels (the caller clears them before and draws them after). Returns the surface. */
  NR.paint = (ctx, draw, t) => {
    const cv = ctx.canvas; let s = surfaces.get(cv);
    if (!s || s.w !== cv.width || s.h !== cv.height) {
      s = surface(cv.width, cv.height); s.img = ctx.createImageData(cv.width, cv.height); s.u32 = new Uint32Array(s.img.data.buffer); surfaces.set(cv, s);
    }
    reset(s, t); NR.cur = s;
    try { draw(s, t); } finally { NR.cur = null; }
    const buf = s.buf, out = s.u32; for (let i = 0, n = buf.length; i < n; i++) out[i] = PAL32[buf[i]];
    ctx.putImageData(s.img, 0, 0);
    return s;
  };

  Object.assign(NR, { C, RAMPS, RAMP_DEFS, ramp, col, hex: hexOf, step, lut, surface, rgb: i => PAL_RGB[col(i)].slice(), paletteSize: () => PAL_N });
})();

/* ======================================================================================
 * THE CAST AND THE PROPS. Shared drawing functions, so every piece draws the same people.
 * Each one draws as a sprite (NRART.begin/end), so it gets a rim light from the key light.
 * Common options: t (seconds, for animation), facing ('right' | 'left', some also 'front' |
 * 'back'), rim (steps of rim light, 0 for none), shadow (false to skip the contact shadow).
 * ====================================================================================== */
(function () {
  'use strict';
  const NR = window.NRART, C = NR.C, col = NR.col, hash = NR.hash, step = NR.step;
  const pen = NR.pen, rnd = Math.round;
  const flipOf = f => f === 'left';
  const blinking = (t, seed, every) => { const per = every || 3.7, ph = (t + hash(seed | 0, 91) * per) % per; return ph < 0.13; };

  // ---------------------------------------------------------------- the man
  // Front, side (facing right; left is the mirror) and back. 40 px tall standing. Orange jacket,
  // no helmet, dark hair, dark jeans. Faces: deadpan (default), worry, smug, talk, shock, side, blink.
  const MAN_FRONT = [
    '...HHHHHH...',
    '..HHHHHHHH..',
    '..HHHHHHHH..',
    '..HHHHHSSH..',
    '..sSSSSSSs..',
    '..sBBSSBBs..',
    '.ssSESSESss.',
    '.ssSSdSSSss.',
    '...sSSSSs...',
    '...sSmmSs...',
    '....ssss....',
    '...oOqqOo...',
    '.oOOOOOOOOo.',
    'oOOOOOzOOOOo',
    'oOqOOOzOOqOo',
    'oOqOOOzOOqOo',
    'oOqOOOzOOqOo',
    'oOqOOOzOOqOo',
    'oOqOOOzOOqOo',
    'oOqOOOzOOqOo',
    'oOqOOOzOOqOo',
    'ooqoooqoooqo',
    'ooqooozoooqo',
    'oqqqqqqqqqqo',
    'sSJJJJJJJJSs',
    '.sJJJJJJJJs.',
    '..JJJJJJJJ..',
    '..JJJjjJJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..jjj..jjj..',
    '.KKKK..KKKK.',
    '.wwww..wwww.',
  ];
  const MAN_BACK = [
    '...HHHHHH...',
    '..HHHHHHHH..',
    '..HHHHHHHH..',
    '..HHHHHHHH..',
    '..HHHHhHHH..',
    '..HHHHHHHH..',
    '.sHHHHHHHHs.',
    '.sHHHHHHHHs.',
    '...HHHHHH...',
    '...sHHHHs...',
    '....ssss....',
    '...oOOOOo...',
    '.oOOqqqqOOo.',
    'oOOOOOOOOOOo',
    'oOqOOOOOOqOo',
    'oOqOOOOOOqOo',
    'oOqOOOOOOqOo',
    'oOqOOOOOOqOo',
    'oOqOOOOOOqOo',
    'oOqOOOOOOqOo',
    'oOqOOOOOOqOo',
    'ooqoooooooqo',
    'ooqoooooooqo',
    'oqqqqqqqqqqo',
    'sSJJJJJJJJSs',
    '.sJJJJJJJJs.',
    '..JJJJJJJJ..',
    '..JJJjjJJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..JJj..jJJ..',
    '..jjj..jjj..',
    '..KKK..KKK..',
    '..www..www..',
  ];
  // side view, facing right, head and torso only (rows 0-25); arms and legs are drawn live
  const MAN_SIDE = [
    '....HHHH....',
    '...HHHHHHH..',
    '..HHHHHHHHH.',
    '..HHHHHHHHS.',
    '..HHHHHHSSS.',
    '..HHHsdSBBS.',
    '..HHHssSSES.',
    '...HHsSSSSSS',
    '...HsSSSSSS.',
    '....sSSSSmS.',
    '.....ssSSs..',
    '.....qOOo...',
    '....oOOOOo..',
    '...oOOOOOOo.',
    '...oOOOOOOo.',
    '...oOOOOOOo.',
    '...oOOOOOOo.',
    '...oOOOOOOo.',
    '...oOOOOOOo.',
    '...oOOOOOOo.',
    '...ooOOOOOo.',
    '...ooooooooo',
    '...ooooooooo',
    '...qqqqqqqq.',
    '...JJJJJJJ..',
    '...JJJJJJJ..',
  ];
  const MAN_LEG = { H: C.slate1, h: C.slate3, S: C.skin4, s: C.skin3, d: C.skin2, B: C.slate1, E: C.slate0, m: C.skin1,
    o: C.orange3, O: C.orange4, q: C.orange2, z: C.orange2, J: C.night5, j: C.night4, K: C.slate1, w: C.paper2 };

  function faceFront(P, top, face, t, seed, blink) {
    // eyes at dx -2 and 1 on row 6, brows row 5, mouth dx -1..0 row 9
    const E = C.slate0, B = C.slate1, S = C.skin4, s = C.skin3, M = C.skin1;
    const y = top;
    if (face === 'worry') { P.p(-3, y + 5, S); P.p(1, y + 5, S); P.p(-2, y + 4, B); P.p(1, y + 4, B); P.p(-3, y + 5, B); P.p(2, y + 5, B); P.p(-2, y + 5, S); P.p(1, y + 5, S); P.p(-1, y + 9, S); P.p(0, y + 9, M); P.p(0, y + 10, s); }
    else if (face === 'smug') { P.p(1, y + 5, S); P.p(2, y + 5, S); P.p(1, y + 4, B); P.p(2, y + 4, B); P.p(-1, y + 9, M); P.p(0, y + 9, M); P.p(1, y + 8, M); }
    else if (face === 'shock') { P.p(-2, y + 5, E); P.p(1, y + 5, E); P.p(-3, y + 4, B); P.p(-2, y + 4, B); P.p(1, y + 4, B); P.p(2, y + 4, B); P.p(-3, y + 5, S); P.p(2, y + 5, S); P.r(-1, y + 9, 2, 2, C.skin0); }
    else if (face === 'talk') { if (Math.sin(t * 13 + seed) > 0) { P.r(-1, y + 9, 2, 1, C.skin0); P.p(-1, y + 10, C.skin1); P.p(0, y + 10, C.skin1); } }
    else if (face === 'side') { P.p(-2, y + 6, S); P.p(1, y + 6, S); P.p(-3, y + 6, E); P.p(0, y + 6, E); }
    if (blink || face === 'blink') { const a = face === 'side' ? [-3, 0] : [-2, 1]; P.p(a[0], y + 6, s); P.p(a[1], y + 6, s); }
  }
  function faceSide(P, top, face, t, seed, blink) {
    // eye at dx 3 row 6, brow dx 2..3 row 5, mouth dx 3 row 9
    const E = C.slate0, B = C.slate1, S = C.skin4, M = C.skin1;
    const y = top;
    if (face === 'worry') { P.p(2, y + 5, S); P.p(3, y + 4, B); P.p(2, y + 4, B); P.p(3, y + 9, S); P.p(3, y + 10, M); }
    else if (face === 'smug') { P.p(2, y + 5, S); P.p(3, y + 5, S); P.p(2, y + 4, B); P.p(3, y + 4, B); P.p(4, y + 8, M); }
    else if (face === 'shock') { P.p(3, y + 5, E); P.p(2, y + 4, B); P.p(3, y + 4, B); P.p(2, y + 5, S); P.p(3, y + 9, C.skin0); P.p(3, y + 10, C.skin0); }
    else if (face === 'talk') { if (Math.sin(t * 13 + seed) > 0) { P.p(3, y + 9, C.skin0); P.p(4, y + 9, C.skin0); } }
    if (blink || face === 'blink') P.p(3, y + 6, C.skin3);
  }
  // two-bone leg or arm: from (ax, ay) to (bx, by) with a joint bent toward +x (bend 1) or -x (-1)
  function joint(ax, ay, bx, by, len, bend) {
    const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1, half = len / 2;
    const k = d >= len ? 0 : Math.sqrt(half * half - (d / 2) * (d / 2));
    return [ax + dx / 2 + (-dy / d) * k * bend, ay + dy / 2 + (dx / d) * k * bend];
  }
  function limb(P, a, b, len, bend, c, th) {
    const k = joint(a[0], a[1], b[0], b[1], len, bend);
    P.l(a[0], a[1], k[0], k[1], c, th); P.l(k[0], k[1], b[0], b[1], c, th); return k;
  }

  /** man(g, x, y, o): the hero. (x, y) is the ground under his feet; for pose 'ride' it is the
   *  saddle top and o.grip / o.pedals ([dx, dy] relative to it) place hands and feet; for 'sit'
   *  it is the seat front edge and o.floor (default 12) is how far below the seat the floor is.
   *  o: { facing: 'front' | 'right' | 'left' | 'back', pose: 'stand' | 'walk' | 'ride' | 'sit',
   *       t, face: 'deadpan' | 'worry' | 'smug' | 'talk' | 'shock' | 'side' | 'blink',
   *       arm: 'down' | 'wave' | 'point' (side views), hold: 'phone' | 'book' | 'helmet' | null,
   *       seed, rim, shadow } */
  NR.man = (g, x, y, o) => {
    o = o || {}; const t = o.t || 0, seed = o.seed || 1, pose = o.pose || 'stand';
    let facing = o.facing || (pose === 'ride' || pose === 'walk' ? 'right' : 'front');
    if (pose === 'ride' && (facing === 'front' || facing === 'back')) facing = 'right';
    const blink = o.face !== 'shock' && blinking(t, seed);
    const face = o.face || 'deadpan';
    if (o.shadow !== false && pose !== 'ride' && pose !== 'sit') NR.shadow(g, x, y, facing === 'front' || facing === 'back' ? 9 : 8, 2);
    NR.begin(g);
    if (facing === 'front' || facing === 'back') {
      const P = pen(g, x, y, false);
      const rows = facing === 'front' ? MAN_FRONT : MAN_BACK;
      const bob = Math.sin(t * 2.2 + seed) > 0.55 ? 1 : 0;
      if (pose === 'sit') {
        const fl = o.floor == null ? 12 : o.floor, top = -36;
        P.map(-6, top + 11, rows.slice(11, 24), MAN_LEG);
        P.map(-6, top + bob, rows.slice(0, 11), MAN_LEG);
        // lap toward us, knees, shins down to the floor
        P.r(-6, -12, 2, 2, C.skin3); P.r(4, -12, 2, 2, C.skin3);
        P.r(-4, -13, 8, 4, C.night5); P.r(-4, -10, 8, 1, C.night4); P.r(-1, -13, 2, 3, C.night4);
        P.r(-4, -9, 3, fl + 9 - 2, C.night4); P.r(1, -9, 3, fl + 9 - 2, C.night4);
        P.r(-4, -9, 1, fl + 7, C.night3); P.r(3, -9, 1, fl + 7, C.night3);
        P.r(-5, fl - 2, 4, 2, C.slate1); P.r(1, fl - 2, 4, 2, C.slate1); P.r(-5, fl - 1, 4, 1, C.paper2); P.r(1, fl - 1, 4, 1, C.paper2);
        if (facing === 'front') faceFront(P, top + bob, face, t, seed, blink);
      } else {
        const walk = pose === 'walk', ph = Math.sin(t * 6 + seed), lift = walk ? (ph > 0 ? 1 : 0) : 0;
        P.map(-6, -40 + 11, rows.slice(11, 38), MAN_LEG);
        if (walk) { P.r(ph > 0 ? -4 : 1, -3, 3, 1, C.night4); }
        P.map(-6, -2 - (walk && ph > 0 ? lift : 0), [rows[38].slice(0, 6), rows[39].slice(0, 6)], MAN_LEG);
        P.map(0, -2 - (walk && ph <= 0 ? 1 : 0), [rows[38].slice(6), rows[39].slice(6)], MAN_LEG);
        P.map(-6, -40 + bob, rows.slice(0, 11), MAN_LEG);
        if (facing === 'front') faceFront(P, -40 + bob, face, t, seed, blink);
        if (o.hold === 'phone') { P.r(3, -20, 3, 4, C.slate0); P.r(4, -19, 1, 2, C.phone4); P.r(2, -17, 2, 2, C.skin4); }
        if (o.hold === 'helmet') { P.r(5, -19, 7, 4, C.paper4); P.r(5, -16, 7, 1, C.paper2); P.r(6, -20, 5, 1, C.paper5); P.r(7, -15, 1, 3, C.orange4); }
        if (o.hold === 'book') { P.r(-8, -18, 4, 7, C.red3); P.r(-8, -18, 1, 7, C.red2); P.r(-5, -17, 1, 5, C.paper4); }
      }
      NR.end(g, o.rim);
      return;
    }
    // side views
    const flip = flipOf(facing), P = pen(g, x, y, flip);
    if (pose === 'ride') {
      const grip = o.grip || [10, -6], ped = o.pedals || [[5, 14], [3, 20]];
      // far leg first, darker
      const hip = [1, 0];
      const far = limb(P, hip, [ped[1][0], ped[1][1] - 1], 19, 1, C.night3, 3); P.r(ped[1][0] - 1, ped[1][1] - 1, 4, 2, C.slate0);
      P.map(-6, -24, MAN_SIDE.slice(0, 24), MAN_LEG);
      faceSide(P, -24, face, t, seed, blink);
      P.r(-3, -2, 7, 3, C.night5);
      limb(P, [hip[0] + 1, hip[1]], [ped[0][0], ped[0][1] - 1], 19, 1, C.night5, 3); P.r(ped[0][0] - 1, ped[0][1] - 1, 4, 2, C.slate1); P.r(ped[0][0] - 1, ped[0][1], 4, 1, C.paper2);
      // arm to the handlebar grip
      const sh = [1, -12];
      limb(P, sh, [grip[0] - 1, grip[1]], 14, -1, C.orange4, 2); P.r(grip[0] - 1, grip[1] - 1, 2, 2, C.skin4);
      NR.end(g, o.rim);
      return far;
    }
    if (pose === 'sit') {
      const fl = o.floor == null ? 12 : o.floor;
      P.map(-6, -24, MAN_SIDE.slice(0, 24), MAN_LEG);
      faceSide(P, -24, face, t, seed, blink);
      P.r(-3, -1, 12, 3, C.night5); P.r(-3, 1, 12, 1, C.night4);
      P.r(7, 1, 3, fl - 3, C.night5); P.r(7, fl - 2, 5, 2, C.slate1); P.r(7, fl - 1, 5, 1, C.paper2);
      P.l(1, -11, 6, -3, C.orange4, 2); P.r(6, -3, 2, 2, C.skin4);
      NR.end(g, o.rim);
      return;
    }
    const walk = pose === 'walk', ph = t * 6 + seed, s = walk ? Math.sin(ph) : 0;
    const bob = walk ? (Math.abs(s) < 0.5 ? -1 : 0) : (Math.sin(t * 2.2 + seed) > 0.6 ? 1 : 0);
    const hipY = -15 + (walk ? bob : 0);
    const nf = [1 + rnd(4 * s), -2 - (walk && Math.cos(ph) > 0 ? rnd(Math.cos(ph) * 2) : 0)];
    const ff = [walk ? 1 - rnd(4 * s) : -2, -2 - (walk && Math.cos(ph) < 0 ? rnd(-Math.cos(ph) * 2) : 0)];
    // far arm, far leg
    const swing = walk ? rnd(-3 * s) : 0;
    P.l(0, -27 + bob, -swing, -17 + bob, C.orange2, 2);
    limb(P, [0, hipY], ff, 14, 1, C.night4, 3); P.r(ff[0] - 1, ff[1], 4, 2, C.slate0);
    // torso and head
    P.map(-6, -40 + bob + (walk ? 0 : 0), MAN_SIDE.slice(0, 11), MAN_LEG);
    P.map(-6, -29 + (walk ? bob : 0), MAN_SIDE.slice(11, 26), MAN_LEG);
    faceSide(P, -40 + bob, face, t, seed, blink);
    // near leg
    limb(P, [1, hipY], nf, 14, 1, C.night5, 3); P.r(nf[0] - 1, nf[1], 4, 2, C.slate1); P.r(nf[0] - 1, nf[1] + 1, 4, 1, C.paper2);
    // near arm
    if (o.arm === 'wave') { P.l(1, -27 + bob, 5, -35 + bob, C.orange4, 2); P.r(5, -38 + bob + (Math.sin(t * 9) > 0 ? 0 : 1), 2, 3, C.skin4); }
    else if (o.arm === 'point') { P.l(1, -27 + bob, 9, -27 + bob, C.orange4, 2); P.r(9, -28 + bob, 2, 2, C.skin4); P.p(11, -28 + bob, C.skin4); }
    else { P.l(1, -27 + bob, 1 + swing, -17 + bob, C.orange4, 2); P.l(0, -27 + bob, swing, -17 + bob, C.orange3, 1); P.r(swing, -17 + bob, 2, 2, C.skin4); }
    if (o.hold === 'phone') { P.r(1 + swing, -19 + bob, 2, 3, C.slate0); P.p(2 + swing, -19 + bob, C.phone4); }
    NR.end(g, o.rim);
  };

  // ---------------------------------------------------------------- the dogs
  const COATS = {
    brown: ['fur1', 'fur2', 'fur3', 'fur4', 'fur5'], black: ['slate0', 'slate1', 'slate2', 'slate3', 'slate4'],
    golden: ['skin1', 'skin2', 'skin3', 'skin4', 'skin5'], grey: ['mist0', 'mist1', 'mist2', 'mist3', 'mist4'],
  };
  /** dog(g, x, y, o): a medium mutt with floppy ears, side view, ~20 px long, ~16 px tall.
   *  o: { coat: 'brown' | 'black' | 'golden' | 'grey', pose: 'stand' | 'walk' | 'sit' | 'lie',
   *       facing: 'right' | 'left', t, seed, look: 'ahead' | 'up' (sit: looking up at someone),
   *       eyes: true (glint), rim, shadow } */
  NR.dog = (g, x, y, o) => {
    o = o || {}; const t = o.t || 0, seed = o.seed || 2, pose = o.pose || 'stand';
    const K = (COATS[o.coat] || COATS.brown).map(col), [k0, k1, k2, k3, k4] = K;
    const flip = flipOf(o.facing), P = pen(g, x, y, flip);
    const wag = Math.sin(t * (pose === 'walk' ? 9 : 7) + seed);
    if (o.shadow !== false) NR.shadow(g, x + (flip ? -1 : 1), y, pose === 'sit' ? 7 : 11, 2);
    NR.begin(g);
    const head = (hx, hy, up) => {
      // skull, muzzle, nose, eye, the floppy ear
      P.r(hx, hy, 6, 5, k2); P.r(hx + 1, hy - 1, 4, 1, k2); P.r(hx + 1, hy, 4, 1, k3);
      P.r(hx + 5, hy + 2, 3, 3, k2); P.r(hx + 5, hy + 2, 3, 1, k3); P.p(hx + 8, hy + 2 - (up ? 1 : 0), C.slate0);
      P.r(hx + 5, hy + 4, 3, 1, k1); P.p(hx + 7, hy + 4, k0);
      if (o.eyes !== false) { P.p(hx + 4, hy + 1, C.slate0); if (!blinking(t, seed + 3, 4.3)) P.p(hx + 4, hy + 1, C.slate0); else P.p(hx + 4, hy + 1, k1); }
      P.r(hx + 1, hy + 1, 2, 4, k1); P.p(hx + 1, hy + 5, k1); P.p(hx + 2, hy + 1, k0);
    };
    if (pose === 'sit') {
      // haunch on the ground, chest up, front legs straight, tail sweeping the floor
      const up = o.look === 'up';
      P.r(-6, -7, 8, 7, k2); P.r(-5, -8, 6, 1, k2); P.r(-6, -7, 2, 7, k1); P.r(-7, -2, 3, 2, k1);
      P.r(-1, -13, 6, 8, k2); P.r(0, -14, 4, 1, k2); P.r(3, -12, 2, 6, k3);
      P.r(2, -6, 2, 6, k2); P.r(4, -6, 1, 6, k1); P.r(1, -1, 4, 1, k3);
      P.r(-3, -1, 3, 1, k3);
      head(1, up ? -20 : -19, up);
      const tx = wag > 0 ? -10 : -9; P.l(-6, -1, tx, -1 - (wag > 0.5 ? 1 : 0), k1, 2);
      NR.end(g, o.rim); return;
    }
    if (pose === 'lie') {
      P.r(-9, -5, 16, 5, k2); P.r(-8, -6, 13, 1, k2); P.r(-9, -1, 16, 1, k1); P.r(-6, -5, 6, 1, k3);
      P.r(5, -2, 6, 2, k2); P.r(9, -2, 2, 1, k3);
      head(3, -8, false);
      P.l(-9, -2, -12 - (wag > 0 ? 1 : 0), -1, k1, 2);
      NR.end(g, o.rim); return;
    }
    const walk = pose === 'walk', ph = t * 9 + seed, s = walk ? Math.sin(ph) : 0;
    const bob = walk && Math.abs(s) > 0.7 ? -1 : 0;
    // far legs (darker), then the body, then near legs
    const leg = (lx, off, c) => { P.r(lx + off, -6 + bob, 2, 6 - bob, c); P.r(lx + off, -1, 3, 1, c); };
    leg(-6, walk ? rnd(-s * 2) : 1, k0); leg(4, walk ? rnd(s * 2) : -1, k0);
    // body: back, chest, belly
    P.r(-9, -12 + bob, 15, 6, k2); P.r(-8, -13 + bob, 12, 1, k2); P.r(-8, -12 + bob, 11, 1, k3);
    P.r(3, -13 + bob, 4, 7, k2); P.r(-7, -6 + bob, 12, 1, k1); P.r(-9, -11 + bob, 1, 4, k1);
    P.r(5, -12 + bob, 2, 5, k3);
    leg(-7, walk ? rnd(s * 2) : 0, k1); leg(3, walk ? rnd(-s * 2) : 0, k1);
    P.r(-7, -7 + bob, 2, 2, k2); P.r(3, -7 + bob, 2, 2, k2);
    // neck and head
    P.r(5, -15 + bob, 3, 4, k2);
    head(5, -18 + bob, false);
    // tail: wags
    const tw = rnd(wag * 2); P.l(-9, -11 + bob, -13, -14 + bob + tw, k2, 2); P.p(-13, -15 + bob + tw, k3);
    NR.end(g, o.rim);
  };

  // ---------------------------------------------------------------- the omafiets
  function arc(P, cx, cy, r, a0, a1, c) {
    const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) * r * 1.5));
    let lx = 1e9, ly = 1e9;
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n, px = rnd(cx + Math.cos(a) * r), py = rnd(cy + Math.sin(a) * r); if (px !== lx || py !== ly) { P.p(px, py, c); lx = px; ly = py; } }
  }
  /** omafiets(g, x, y, o): the black Dutch granny bike, side view, ~46 px long, with a front
   *  basket and a dynamo lamp. (x, y): x is the pedal crank, y the ground.
   *  o: { facing, t, rider: false | true (the man) | function (g, saddleX, saddleY, grip, pedals, flip),
   *       speed: 1 when ridden (wheels and pedals turn), beam: false | length (the lamp's light cone),
   *       basket: null | 'book' | 'dog' | 'cheese', face (the rider's), lamp: true, rim, shadow } */
  NR.omafiets = (g, x, y, o) => {
    o = o || {}; const t = o.t || 0, flip = flipOf(o.facing), P = pen(g, x, y, flip);
    const speed = o.speed == null ? (o.rider ? 1 : 0) : o.speed, a = t * speed * 7, ca = t * speed * 4.2;
    const Rr = [-14, -8], Fr = [15, -8], BB = [0, -8], S = [-5, -23];
    const T = [C.teal1, C.teal2, C.teal3, C.teal4];
    if (o.shadow !== false) NR.shadow(g, x + (flip ? -1 : 1), y, 26, 2, 0.5);
    NR.begin(g);
    // wheels: tyre, rim, a few spokes that turn, hub
    for (const h of [Rr, Fr]) {
      P.ring(h[0], h[1], 8, C.slate0, 2); P.ring(h[0], h[1], 6, C.steel2, 1);
      for (let k = 0; k < 3; k++) { const an = a + k * Math.PI / 3; P.l(h[0] - Math.cos(an) * 5, h[1] - Math.sin(an) * 5, h[0] + Math.cos(an) * 5, h[1] + Math.sin(an) * 5, C.steel1); }
      P.p(h[0], h[1], C.steel4);
    }
    // mudguards
    arc(P, Rr[0], Rr[1], 9, Math.PI * 1.02, Math.PI * 1.98, C.slate1); arc(P, Fr[0], Fr[1], 9, Math.PI * 1.1, Math.PI * 1.9, C.slate1);
    P.p(-23, -9, C.red4); P.p(-23, -10, C.red3);
    // rear rack
    P.l(-6, -19, -21, -19, C.steel3); P.l(-20, -19, -15, -9, C.steel2); P.l(-12, -19, -14, -9, C.steel2);
    // frame: seat tube, seat stays, twin low tubes, head tube, fork
    P.l(BB[0], BB[1], S[0] + 1, S[1] + 2, T[2], 1); P.l(BB[0] + 1, BB[1], S[0] + 2, S[1] + 2, T[1], 1);
    P.l(S[0] + 1, S[1] + 3, Rr[0], Rr[1], T[2]);
    P.l(11, -21, 3, -12, T[2]); P.l(3, -12, BB[0] + 1, BB[1], T[2]);
    P.l(12, -18, 4, -10, T[3]); P.l(4, -10, BB[0] + 2, BB[1] + 1, T[3]);
    P.l(11, -23, 12, -18, T[3], 2); P.l(12, -18, Fr[0], Fr[1], T[2]); P.l(13, -18, Fr[0] + 1, Fr[1], T[1]);
    // chain case
    P.poly([-1, -10, -14, -10, -15, -9, -15, -7, -14, -6, -1, -6, 1, -8], C.slate1); P.l(-1, -10, -14, -10, C.slate2);
    // crank and pedals
    P.disc(0, -8, 2, C.steel3); P.p(0, -8, C.steel5);
    const pd = [[rnd(Math.cos(ca) * 3), -8 + rnd(Math.sin(ca) * 3)], [rnd(-Math.cos(ca) * 3), -8 + rnd(-Math.sin(ca) * 3)]];
    P.l(0, -8, pd[1][0], pd[1][1], C.steel2); P.r(pd[1][0] - 1, pd[1][1], 3, 1, C.slate0);
    // saddle with springs
    P.r(S[0] - 3, S[1] - 1, 7, 2, C.wood2); P.r(S[0] - 2, S[1] - 2, 5, 1, C.wood3); P.p(S[0] - 2, S[1] + 1, C.steel3); P.p(S[0] + 2, S[1] + 1, C.steel3);
    // handlebars swept back, grips
    P.l(11, -23, 11, -26, C.steel3); P.l(11, -26, 6, -26, C.steel4); P.p(5, -25, C.slate0); P.p(6, -25, C.slate0);
    // basket on the front carrier
    P.l(14, -20, 15, -14, C.steel2);
    P.r(13, -27, 11, 7, C.wood3); P.r(13, -27, 11, 1, C.wood5); P.r(13, -21, 11, 1, C.wood2);
    for (let i = 0; i < 11; i += 2) P.r(13 + i, -26, 1, 5, C.wood2);
    for (let j = -25; j < -21; j += 2) for (let i = 0; i < 11; i += 2) P.p(14 + i, j, C.wood4);
    if (o.basket === 'book') { P.r(15, -29, 6, 2, C.red3); P.r(15, -29, 6, 1, C.red4); P.r(15, -28, 1, 1, C.paper4); }
    else if (o.basket === 'cheese') { P.r(15, -30, 7, 3, C.cheese4); P.r(15, -30, 7, 1, C.cheese5); P.p(21, -29, C.cheese3); }
    else if (o.basket === 'dog') { P.r(16, -31, 5, 4, C.fur3); P.r(19, -30, 4, 2, C.fur2); P.p(22, -30, C.slate0); P.p(18, -30, C.slate0); P.r(16, -31, 2, 3, C.fur1); }
    // lamp
    if (o.lamp !== false) { P.r(23, -20, 2, 3, C.steel2); P.p(24, -19, o.beam ? C.paper6 : C.paper3); }
    // the rider
    if (o.rider) {
      const sx = S[0], sy = S[1] - 1, grip = [6 - sx, -25 - sy], pedals = [[pd[0][0] - sx, pd[0][1] - sy], [pd[1][0] - sx, pd[1][1] - sy]];
      if (typeof o.rider === 'function') o.rider(g, x + (flip ? -sx - 1 : sx), y + sy, grip, pedals, flip);
      else NR.man(g, x + (flip ? -sx - 1 : sx), y + sy, { pose: 'ride', facing: flip ? 'left' : 'right', t, grip, pedals, face: o.face, seed: o.seed, rim: o.rim });
    }
    // near crank arm and pedal over the rider's foot
    P.l(0, -8, pd[0][0], pd[0][1], C.steel4); P.r(pd[0][0] - 1, pd[0][1], 3, 1, C.slate1);
    NR.end(g, o.rim);
    if (o.beam) {
      const len = o.beam === true ? 90 : o.beam, lx = x + (flip ? -25 : 25), ly = y - 19;
      NR.glow(g, lx, ly, 6, { color: 'paper6', strength: 0.6 });
      NR.cone(g, lx, ly, flip ? Math.PI - 0.06 : 0.06, 0.2, len, { color: 'paper5', strength: 0.42, width: 3, fade: 1.2 });
    }
  };
})();
