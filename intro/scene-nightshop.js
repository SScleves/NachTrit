// Level intro scene "nightshop": a nachtwinkel glowing on a wet street in the rain, and the dead
// queuing for it, each head bowed into a cyan phone (the Tikkie never sleeps). The queue starts under
// the end of the shop awning and runs off to the right into the fog, the far ones turning into
// single-tone silhouettes with only their eyes left. The one first in line holds out the bill.
// Key light: the cold fridge light of the shop. Warm notes: the sign, a few windows, two lanterns.
// Loops: one neon letter of the sign dying (the N, so it reads ACHTWINKEL), the K buzzing, the phone glow
// breathing, the queue swaying and blinking, mill sails, lantern flicker, a flickering window, mist, rain,
// puddles and light streaks on the wet road.
// Speed: the static stack (sky, far fog, far houses, the terrace with its shop front, the pavement and the
// near silhouettes) is drawn once into cached layers, composed once per camera offset into one frame that
// a draw copies back in a single call; lights are replayed from cached fields and the queue from cached
// sprite frames. Each frame draws only what moves.
(function () {
  const A = window.NRART;
  const H = A.hash;
  const M = 12, LW = 320 + 2 * M, SENT = 255;      // layer padding for the camera drift; 255 is transparent
  const GY = 154;                                    // the line the queue stands on
  const KERB = 157;                                  // the kerb: the road starts below it
  const WB = 148;                                    // where the walls meet the pavement
  const SIGN = { x: 32, y: 79, w: 118, h: 13, text: 'NACHTWINKEL', size: 10 };
  const DOOR = { x: 148, w: 17, y: 104 };            // the shop door
  const KEY = [158, 126];                            // the key light: the fridge glow around the door
  const BX0 = 20, BX1 = 190;
  const TOPY = 76;                                   // top of the shop front (the fascia over the sign)                         // the shop front runs from here to here

  // ------------------------------------------------------------------ cached lights (same maths as NRART.glow / NRART.cone)
  // glow() and cone() recompute a pow/sqrt field every frame; the field never changes shape, only strength,
  // so each is computed once per camera offset as a list of (pixel, level) pairs and replayed.
  const FIELDS = new Map(), LEVELS = new Map();
  function levelsFor(color, strength, Q) {
    strength = Math.round(strength * 20) / 20;
    const key = color + ':' + strength + ':' + Q; let Ls = LEVELS.get(key);
    if (!Ls) { Ls = []; for (let q = 0; q <= Q; q++) Ls.push(A.lut('add', color, strength * q / Q)); LEVELS.set(key, Ls); }
    return Ls;
  }
  function fieldOf(g, key, bounds, Q, field) {
    key += '|' + g.ox + ',' + g.oy; let F = FIELDS.get(key); if (F) return F;
    const idx = [], qs = [], [x0, y0, x1, y1] = bounds;
    for (let yy = Math.max(0, y0 + g.oy); yy <= Math.min(g.h - 1, y1 + g.oy); yy++) for (let xx = Math.max(0, x0 + g.ox); xx <= Math.min(g.w - 1, x1 + g.ox); xx++) {
      const lv = field(xx - g.ox, yy - g.oy); if (lv <= 0) continue;
      const v = (lv > 1 ? 1 : lv) * Q; let q = v | 0; if (v - q > A.bayer(xx, yy)) q++;
      if (q > 0) { idx.push(yy * g.w + xx); qs.push(q > Q ? Q : q); }
    }
    F = { i: Int32Array.from(idx), q: Uint8Array.from(qs) }; FIELDS.set(key, F); return F;
  }
  function replay(g, F, color, strength, Q) {
    const Ls = levelsFor(color, strength, Q), buf = g.buf, ii = F.i, qq = F.q;
    for (let k = 0; k < ii.length; k++) { const i = ii[k]; buf[i] = Ls[qq[k]][buf[i]]; }
  }
  function glow(g, x, y, r, ry, power, color, strength, Q) {
    Q = Q || 6;
    const F = fieldOf(g, `g${x},${y},${r},${ry},${power}`, [Math.floor(x - r), Math.floor(y - ry), Math.ceil(x + r), Math.ceil(y + ry)], Q, (xx, yy) => {
      const dx = (xx - x) / r, dy = (yy - y) / ry, d2 = dx * dx + dy * dy; if (d2 >= 1) return 0; return Math.pow(1 - Math.sqrt(d2), power);
    });
    replay(g, F, color, strength, Q);
  }
  function coneDown(g, x, y, spread, len, width, fade, edge, color, strength, Q) {
    Q = Q || 6; const w0 = width / 2, tn = Math.tan(spread), hw = w0 + len * tn;
    const F = fieldOf(g, `c${x},${y},${spread},${len},${width},${fade},${edge}`, [Math.floor(x - hw), y, Math.ceil(x + hw), Math.ceil(y + len)], Q, (xx, yy) => {
      const vx = xx + 0.5 - x, u = yy + 0.5 - y; if (u < 0 || u > len) return 0;
      const v = Math.abs(vx), half = w0 + u * tn; if (v > half) return 0;
      const e = 1 - v / half, ef = e >= edge ? 1 : e / edge;
      return Math.pow(1 - u / len, fade) * ef;
    });
    replay(g, F, color, strength, Q);
  }
  // the light of a lantern lamp (the body is drawn static); same look as NRART.lamp
  function lampLight(g, lx, ly, gy, reach, coneS, k) {
    glow(g, lx, ly, 14, 14, 1.6, 'amber6', 0.55 * k, 6);
    coneDown(g, lx, ly + 2, 0.42, reach + 1, 4, 0.6, 0.6, 'amber5', coneS * k, 6);
    glow(g, lx, gy, reach * 0.62, 3, 1, 'amber5', 0.35 * k, 6);
  }

  // ------------------------------------------------------------------ layers
  let LAYERS = null;
  const BASE = new Map(), STAT = new Map();         // camera offsets -> the composed static frame (without / with the lantern light)
  let SCR = null;
  function newLayer() { const s = A.surface(LW, 180); s.buf.fill(SENT); s.ox = M; A.key(s, KEY[0], KEY[1], 1); return s; }
  function compInto(buf, camX, lay, d, y0, y1) {
    const sh = -Math.round(-camX * d);
    for (let y = y0; y < y1; y++) {
      const o = y * 320, p = y * LW + sh + M;
      for (let x = 0; x < 320; x++) { const v = lay[p + x]; if (v !== SENT) buf[o + x] = v; }
    }
  }
  // opaque pixels of a layer as lists, for the near silhouettes that go over everything
  function opaque(buf) {
    const X = [], Y = [], V = [];
    for (let y = 0; y < 180; y++) for (let x = 0; x < LW; x++) { const v = buf[y * LW + x]; if (v !== SENT) { X.push(x - M); Y.push(y); V.push(v); } }
    return { x: Int16Array.from(X), y: Int16Array.from(Y), v: Uint8Array.from(V) };
  }

  // ------------------------------------------------------------------ far silhouettes (one tone, no linework)
  function gable(s, x, w, top, kind, gh, c) {
    const cx = x + w / 2;
    if (kind === 'step') {
      const n = 3, sh = Math.max(2, Math.round(gh / n)), sw = Math.max(2, Math.round(w / 9));
      for (let i = 1; i <= n; i++) { const x0 = x + i * sw, x1 = x + w - i * sw; if (x1 - x0 < 3) break; A.rect(s, x0, top - i * sh, x1 - x0, sh + 1, c); }
    } else if (kind === 'bell' || kind === 'neck' || kind === 'spout') {
      const N = 10, Lp = [], Rp = [];
      for (let i = 0; i <= N; i++) {
        const u = i / N; let f;
        if (kind === 'bell') f = 0.3 + 0.7 * (1 + Math.cos(Math.PI * u)) / 2; else if (kind === 'neck') f = u < 0.42 ? 1 - 0.66 * u / 0.42 : 0.34; else f = 1 - 0.8 * u;
        const hw = w / 2 * f; Lp.push(cx - hw, top - gh * u); Rp.unshift(cx + hw, top - gh * u);
      }
      A.poly(s, Lp.concat(Rp), c);
      if (kind === 'bell') A.disc(s, cx - 0.5, top - gh, Math.max(2, Math.round(w * 0.14)), c);
      if (kind === 'neck') A.poly(s, [cx - w * 0.17 - 1, top - gh, cx + w * 0.17 + 1, top - gh, cx, top - gh - 5], c);
    } else A.poly(s, [x - 1, top + 1, x + w + 1, top + 1, cx, top - gh], c);
  }
  function silHouse(s, x, base, w, h, kind, c) {
    const gh = Math.round(Math.min(h * 0.38, w * 0.9)), top = base - h + gh;
    A.rect(s, x, top, w, base - top, c); gable(s, x, w, top, kind, gh, c);
    A.rect(s, x + Math.round(w * 0.7), top - gh * 0.6 - 3, 3, 5, c);      // a chimney
  }
  function litDots(s, list) { list.forEach(([x, y, k]) => { A.rect(s, x, y, 2, 3, k || 'amber4'); A.glow(s, x + 1, y + 1, 7, { color: 'amber5', strength: 0.3, power: 1.3, q: 4 }); }); }

  // ------------------------------------------------------------------ the near terrace
  // Four narrow canal houses above one shop front. canalHouse gives the gable, the cornice, the brick and
  // the hoist beam; its window grid is painted out and replaced by two or three tall windows.
  const TERRACE = [
    { x: 20, w: 44, top: 22, gable: 'step', brick: 'brick3', trim: 'mist4', cols: 3, seed: 1 },
    { x: 64, w: 38, top: 6, gable: 'bell', brick: 'brick2', trim: 'mist3', cols: 2, seed: 2 },
    { x: 102, w: 42, top: 14, gable: 'neck', brick: 'slate3', trim: 'mist4', cols: 3, seed: 3 },
    { x: 144, w: 46, top: 26, gable: 'spout', brick: 'brick4', trim: 'mist3', cols: 3, seed: 4 },
  ];
  function cells(o) {
    const gy = TOPY + 14, h = gy - o.top, gh = Math.round(Math.min(h * 0.4, o.w)), by = gy - h + gh;
    const res = [], ww = 6, wh = 10, n = o.cols, gap = (o.w - n * ww) / (n + 1);
    for (let j = 0; ; j++) {
      const y = by + 6 + j * 14; if (y + wh > TOPY - 2) break;
      for (let i = 0; i < n; i++) res.push({ x: Math.round(o.x + gap * (i + 1) + ww * i), y, w: ww, h: wh, j, i });
    }
    return res;
  }
  function house(s, o, lit) {
    const gy = TOPY + 14, h = gy - o.top, gh = Math.round(Math.min(h * 0.4, o.w)), by = gy - h + gh;
    A.canalHouse(s, o.x, gy, o.w, h, { gable: o.gable, brick: o.brick, trim: o.trim, lit: 0, door: false, detail: false, seed: o.seed * 11, rim: 0, flicker: 0 });
    A.rect(s, o.x + 1, by + 1, o.w - 2, gy - by - 1, A.col(o.brick));                 // paint the stock window grid out
    A.brick(s, o.x + 1, by + 1, o.w - 2, gy - by - 1, { base: o.brick, only: o.brick, seed: o.seed * 11, bw: 4 });
    cells(o).forEach((c, k) => {
      const hit = lit.find(([j, i]) => j === c.j && i === c.i), on = !!hit && !hit[3];
      A.window(s, c.x, c.y, c.w, c.h, { lit: on ? 0.9 : 0, frame: o.trim, bars: 'cross', seed: o.seed * 7 + k, detail: on ? hit[2] || null : null, glow: 0.3 });
    });
  }

  // ------------------------------------------------------------------ the static layers
  function build() {
    const L = {}; let s;
    // ---- sky: an overcast low fog, no moon, no stars; it ends pale at the horizon and the far planes stand against it
    s = newLayer();
    A.sky(s, ['night2', 'night3', 'night4', 'mist0', 'mist1', 'mist2', 'mist3'], 0, 152, { blend: 8 });
    for (let k = 0; k < 7; k++) for (let i = -4; i <= 4; i++) A.ditherDisc(s, 22 + k * 52 + i * 11, 20 + (k * 17) % 46 + ((i + k) & 1) * 2, 13 - Math.abs(i) * 0.9, 'night3', 0.3, 1.3);
    A.glow(s, 262, 122, 120, { color: 'mist5', strength: 0.42, power: 0.9, ry: 54, q: 6 });
    L.sky = s.buf;
    // ---- far fog: a church spire, a windmill tower, a tree line
    s = newLayer();
    A.rect(s, -20, 126, 360, 24, 'night3');
    for (let i = 0; i < 26; i++) A.disc(s, -10 + i * 14 + H(i, 2) * 6, 125 + H(i, 3) * 2, 3 + H(i, 4) * 3, 'night3');
    A.church(s, 8, 128, 1.15, { tone: 'night3', lit: false });
    const mx = 270, mb = 134, top = mb - 48;                         // a filled stellingmolen in one tone
    A.poly(s, [mx - 10, mb, mx + 11, mb, mx + 5, top, mx - 5, top], 'night3');
    A.rect(s, mx - 14, mb - 17, 29, 2, 'night3'); A.poly(s, [mx - 14, mb - 15, mx - 8, mb - 15, mx - 10, mb, mx - 12, mb], 'night3');
    A.poly(s, [mx - 7, top + 1, mx + 8, top + 1, mx + 4, top - 6, mx - 3, top - 6], 'night3');
    L.hub = [mx, top - 3];
    A.haze(s, -20, 40, 360, 112, { amount: 0.375, color: 'mist3' });
    L.far = s.buf; L.sailTone = s.buf[(mb - 30) * LW + mx + M];
    // ---- far canal houses: filled silhouettes, a few lit windows, no linework
    s = newLayer();
    [[-14, 26, 44, 'bell'], [4, 22, 34, 'step'], [196, 28, 38, 'spout'], [222, 26, 48, 'bell'], [248, 24, 36, 'step'], [272, 30, 42, 'neck'], [300, 26, 52, 'step']]
      .forEach(([x, w, h, gb], i) => silHouse(s, x, 140 + (i % 2), w, h, gb, i % 2 ? 'night4' : 'night3'));
    A.haze(s, -20, 20, 360, 130, { amount: 0.25, color: 'mist3', lights: 0.4 });
    litDots(s, [[8, 120, 'amber4'], [-8, 114, 'amber3'], [232, 112, 'amber4'], [284, 120, 'amber3'], [309, 108, 'amber4']]);
    L.far2 = s.buf;
    // ---- the terrace: four narrow houses over one shop front
    s = newLayer();
    const lits = [[[0, 1, 'tulip'], [1, 2]], [[0, 0, 'cat'], [1, 1, null, 1]], [[1, 1, 'plant'], [0, 2, null, 1]], [[0, 2], [1, 0, 'curtain', 1]]];
    TERRACE.forEach((o, i) => house(s, o, lits[i]));
    A.haze(s, -20, 20, 360, 130, { amount: 0.125, color: 'night1', lights: 0.5 });
    shopFront(s);
    L.build = s.buf;
    // ---- the pavement and the kerb; the wet road is made per camera offset
    s = newLayer();
    A.rect(s, -20, WB, 360, KERB - WB, 'slate2'); A.hline(s, -20, WB, 360, 'slate1');
    A.ditherGradient(s, -20, WB + 1, 360, 8, 'slate2', 'slate3', 'down');
    for (let x = -20; x < 340; x += 11) A.vline(s, x + (x % 3), WB + 1, KERB - WB - 1, 'slate1');
    A.hline(s, -20, GY - 2, 360, 'slate1');
    A.ditherGradient(s, -20, GY - 3, 360, KERB - GY + 3, 'slate2', 'slate3', 'down');                       // the wet sheen near the kerb
    A.glow(s, 86, WB + 4, 66, { ry: 10, color: 'phone3', strength: 0.22, power: 1.2, q: 5 });          // the window on the wet pavement
    A.glow(s, 236, GY - 2, 56, { ry: 9, color: 'amber5', strength: 0.5, power: 1.0, q: 6 });            // the lantern's pool, so the legs of the queue stand against light
    A.glow(s, DOOR.x + 8, WB + 4, 26, { ry: 9, color: 'phone3', strength: 0.3, power: 1.2, q: 5 });     // the door
    L.ground = s.buf;
    // ---- near silhouettes: a leaning bike cut by the corner, two fat bollards, darker and larger than anything else
    s = newLayer();
    A.omafiets(s, 20, 184, { rider: false, t: 0, basket: 'cheese', rim: 0, shadow: false });
    A.tint(s, -6, 150, 60, 34, 'black', 0.625, 'mul');
    A.rect(s, 309, 112, 9, 80, 'night0'); A.rect(s, 308, 114, 11, 3, 'night0'); A.rect(s, 310, 110, 7, 3, 'night0'); A.vline(s, 309, 116, 70, 'slate2'); A.hline(s, 310, 110, 5, 'slate1');
    A.rect(s, 307, 134, 13, 3, 'night0'); A.hline(s, 308, 134, 4, 'slate1');
    A.rect(s, 327, 140, 10, 50, 'night0'); A.rect(s, 326, 142, 12, 3, 'night0'); A.vline(s, 327, 143, 40, 'slate1');
    L.fore = opaque(s.buf);
    return L;
  }

  // the shop front: sign board, striped awning, the cyan window, the dark door
  function shopFront(s) {
    const x0 = BX0, x1 = BX1, w = x1 - x0, ax0 = x0 - 4, ax1 = 216;
    A.rect(s, x0, TOPY, w, WB - TOPY, 'brick1'); A.brick(s, x0, TOPY, w, WB - TOPY, { base: 'brick1', only: 'brick1', seed: 4 });
    // sign board: a dark box with steady marquee bulbs; the letters are live
    A.rect(s, SIGN.x - 2, SIGN.y - 2, SIGN.w + 4, SIGN.h + 4, 'slate0'); A.rect(s, SIGN.x, SIGN.y, SIGN.w, SIGN.h, 'slate1');
    for (let x = SIGN.x + 2; x < SIGN.x + SIGN.w - 1; x += 4) { A.px(s, x, SIGN.y + 1, 'amber7'); A.px(s, x, SIGN.y + SIGN.h - 2, 'amber7'); }
    for (let y = SIGN.y + 1; y < SIGN.y + SIGN.h - 1; y += 4) { A.px(s, SIGN.x + 1, y, 'amber7'); A.px(s, SIGN.x + SIGN.w - 2, y, 'amber7'); }
    A.vline(s, SIGN.x + 8, SIGN.y - 4, 3, 'slate2'); A.vline(s, SIGN.x + SIGN.w - 9, SIGN.y - 4, 3, 'slate2');
    A.glow(s, SIGN.x + SIGN.w / 2, SIGN.y + 6, 62, { ry: 20, color: 'amber6', strength: 0.3, power: 1.3, q: 5 });
    // interior: a cyan fridge light behind glass, dimmed one step so it does not out-shout the queue
    const ix = 29, iy = 109, iw = 112, ih = 37;
    A.rect(s, ix - 2, iy - 2, iw + 4, ih + 3, 'slate1'); A.rect(s, ix, iy, iw, ih, 'phone1');
    A.ditherGradient(s, ix, iy, iw, ih, 'phone1', 'phone0', 'down');
    const cols = ['red3', 'cheese3', 'green5', 'paper3', 'orange2'];
    for (let r = 0; r < 4; r++) {
      const sy = iy + 2 + r * 9;
      A.rect(s, ix, sy + 7, iw, 1, 'phone3'); A.rect(s, ix, sy + 8, iw, 1, 'phone0');
      for (let k = 0; k < 26; k++) {
        const hh = 2 + ((k * 7 + r * 3) % 4), cx = ix + 2 + Math.floor(k * 4.2); if ((k + r) % 6 === 3) continue;
        A.rect(s, cx, sy + 7 - hh, 3, hh, cols[(k * 3 + r) % cols.length]); A.px(s, cx, sy + 7 - hh, 'paper2');
      }
    }
    for (let k = 1; k < 4; k++) A.vline(s, ix + k * 28, iy, ih, 'slate1');
    A.hline(s, ix, iy, iw, 'phone2');
    // door: dark glass with one thin reflection, a warm OPEN glow block, a handle
    A.rect(s, DOOR.x - 1, DOOR.y - 1, DOOR.w + 2, WB - DOOR.y + 1, 'slate0'); A.rect(s, DOOR.x, DOOR.y, DOOR.w, WB - DOOR.y, 'phone0');
    A.rect(s, DOOR.x + 1, DOOR.y + 2, DOOR.w - 2, WB - DOOR.y - 3, 'phone1'); A.vline(s, DOOR.x + 4, DOOR.y + 2, WB - DOOR.y - 3, 'phone2'); A.vline(s, DOOR.x + DOOR.w / 2 + 1, DOOR.y, WB - DOOR.y, 'slate0');
    A.rect(s, DOOR.x + 10, DOOR.y + 7, 5, 3, 'amber5'); A.hline(s, DOOR.x + 10, DOOR.y + 7, 5, 'amber7'); A.glow(s, DOOR.x + 12, DOOR.y + 8, 7, { color: 'amber6', strength: 0.4, power: 1.2, q: 4 });
    A.rect(s, DOOR.x + 8, DOOR.y + 20, 1, 6, 'steel4');
    // pilasters and the plinth
    for (const px of [x0, 142, 166]) { A.rect(s, px, SIGN.y + SIGN.h + 2, px === 166 ? x1 - px : 8, WB - SIGN.y - SIGN.h - 2, 'brick1'); A.vline(s, px, SIGN.y + SIGN.h + 2, WB - SIGN.y - SIGN.h - 2, 'brick2'); }
    A.rect(s, x0, WB - 3, w, 3, 'slate2'); A.hline(s, x0, WB - 3, w, 'slate4');
    // the awning: stripes of dull canvas, scalloped, shaded underneath; it runs on past the corner to a post
    for (let i = 0; i < ax1 - ax0; i += 6) {
      const c = (i / 6) % 2 ? 'brick4' : 'paper1';
      A.rect(s, ax0 + i, 94, 6, 10, c); A.rect(s, ax0 + i, 104, 6, 2, c); A.px(s, ax0 + i + 2, 106, c); A.px(s, ax0 + i + 3, 106, c);
    }
    A.hline(s, ax0, 94, ax1 - ax0, 'slate1'); A.hline(s, ax0, 95, ax1 - ax0, 'paper3');
    A.tint(s, ax0, 97, ax1 - ax0, 10, 'night2', 0.375, 'mix');
    A.tint(s, x0, 107, w, 6, 'black', 0.375, 'mul');
    A.rect(s, 211, 107, 2, GY - 107, 'slate2'); A.vline(s, 211, 107, GY - 107, 'slate3');       // the post
    A.glow(s, 86, 128, 74, { ry: 24, color: 'phone3', strength: 0.14, power: 1.3, q: 4 });
  }

  // ------------------------------------------------------------------ the queue
  const QUEUE = [   // the head of the queue first
    { x: 198, y: GY, h: 52, seed: 5, tall: true },
    { x: 221, y: GY, variant: 'hat', h: 46, seed: 6, shirt: 'brick3' },
    { x: 246, y: GY - 1, variant: 'bonnet', h: 43, seed: 7 },
    { x: 266, y: GY - 1, variant: 'cheese', h: 42, seed: 8 },
    { x: 281, y: GY - 2, variant: 'plain', h: 38, seed: 9, tone: 'night4' },
    { x: 293, y: GY - 3, variant: 'hat', h: 35, seed: 10, tone: 'night5' },
    { x: 303, y: GY - 4, variant: 'woman', h: 32, seed: 11, tone: 'mist0' },
  ];
  const NF = 12, SWAY = 2 * Math.PI / 1.3, BLINK = 4.1;
  const SPR = new Map(); let SC = null;
  // a queue member as a list of pixels, drawn once per sway phase (and once blinking), then stamped
  function sprite(i, phase, blink) {
    const key = i + ':' + phase + ':' + blink; let S = SPR.get(key); if (S) return S;
    const q = QUEUE[i];
    if (!SC) SC = A.surface(80, 100);
    const BG = A.col('night2'), ax = 40, ay = 84;
    SC.buf.fill(BG); SC.mask.fill(0); SC.ox = SC.oy = 0; SC.camX = SC.camY = 0; A.key(SC, ax + KEY[0] - q.x, ay + KEY[1] - q.y, 2);
    let tq = (phase + 0.5) / NF * SWAY;
    const b = tt => ((tt + H(q.seed + 17, 91) * BLINK) % BLINK) < 0.13;
    if (!blink && b(tq)) tq += 0.14;
    const o = { t: tq, seed: q.seed, facing: 'left', phone: true, variant: q.tall ? 'woman' : q.variant, height: q.h, shirt: q.shirt, tone: q.tone, shadow: false,
      hunch: q.tall ? 0.16 : (q.tone ? 0.55 : 0.42), eyes: !blink };
    if (q.tone) { o.glow = 0.5; o.rim = 0; }
    const r = A.zombie(SC, ax, ay, o), id = SC.sn;
    if (q.tall) {                                  // cyan rim on the shop side, a bright 2x3 phone screen in her hand
      const T = A.lut('add', 'phone4', 0.55), w = SC.w, tmp = [];
      for (let y = 0; y < SC.h; y++) for (let x = 1; x < w - 1; x++) { const k = y * w + x; if (SC.mask[k] === id && SC.mask[k - 1] !== id) tmp.push(k); }
      for (const k of tmp) SC.buf[k] = T[SC.buf[k]];
      const hx = r.hand[0], hy = r.hand[1];
      A.rect(SC, hx - 1, hy - 4, 2, 3, 'phone5'); A.px(SC, hx - 1, hy - 5, 'phone4');
    }
    const X = [], Y = [], V = [];
    for (let y = 0; y < SC.h; y++) for (let x = 0; x < SC.w; x++) { const v = SC.buf[y * SC.w + x]; if (v !== BG) { X.push(x - ax); Y.push(y - ay); V.push(v); } }
    S = { x: Int16Array.from(X), y: Int16Array.from(Y), v: Uint8Array.from(V), hand: [r.hand[0] - ax, r.hand[1] - ay], head: [r.head[0] - ax, r.head[1] - ay] };
    SPR.set(key, S); return S;
  }
  // stamp a one-colour pixel list (screen position ox, oy), and a coloured one; small functions so they get optimised
  function stampList(g, S, ox, oy, c) {
    const buf = g.buf, X = S.x, Y = S.y;
    for (let k = 0; k < X.length; k++) { const px = ox + X[k], py = oy + Y[k]; if (px >= 0 && px < 320 && py >= 0 && py < 180) buf[py * 320 + px] = c; }
  }
  function stampFore(g, F, sh) {
    const buf = g.buf, V = F.v, X = F.x, Y = F.y;
    for (let k = 0; k < V.length; k++) { const px = X[k] - sh; if (px >= 0 && px < 320) buf[Y[k] * 320 + px] = V[k]; }
  }
  function stamp(g, S, x, y) {
    const buf = g.buf, w = g.w, h = g.h, X = S.x, Y = S.y, V = S.v, ox = x + g.ox, oy = y + g.oy;
    for (let k = 0; k < V.length; k++) { const px = ox + X[k], py = oy + Y[k]; if (px >= 0 && px < w && py >= 0 && py < h) buf[py * w + px] = V[k]; }
  }

  // ------------------------------------------------------------------ the static frame for one camera offset
  const LAMPS = [{ x: 10, seed: 3, h: 58, reach: 56, cone: 0.26, flick: 0.12 }, { x: 233, seed: 7, h: 58, reach: 60, cone: 0.3, flick: 0.07 }];
  // the worn dashed line down the middle of the road and flecks of tarmac, from world x0 to the right
  function roadDeco(g, x0) {
    for (let x = -14, k = 0; x < 330; x += 23, k++) if (x + 11 > x0) A.hline(g, x + (k % 3) * 2, 172, 11, 'slate4');
    for (let y = KERB + 4; y < 180; y += 3) for (let x = (y * 13) % 29; x < 340; x += 29 + (y % 7)) if (x > x0 && H(x, y) < 0.5) A.hline(g, x - 20, y, 2 + Math.floor(H(y, x) * 5), 'slate1');
  }
  const sigOf = camX => [0.15, 0.4, 0.7, 1].map(d => -Math.round(-camX * d)).join(',');
  // the frame without the lantern light: layers composed with their parallax, the road, the sprites that do not move
  function base(camX) {
    const sig = sigOf(camX); let S = BASE.get(sig); if (S) return S;
    const L = LAYERS; if (!SCR) SCR = A.surface(320, 180);
    const T = SCR; T.buf.fill(A.col('night1')); T.mask.fill(0); T.camX = camX; T.camY = 0; A.key(T, KEY[0], KEY[1], 1);
    compInto(T.buf, camX, L.sky, 0, 0, 180); compInto(T.buf, camX, L.far, 0.15, 0, 150); compInto(T.buf, camX, L.far2, 0.4, 0, 150);
    compInto(T.buf, camX, L.build, 0.7, 0, 150); compInto(T.buf, camX, L.ground, 1, 140, 180);
    A.depth(T, 1);
    A.tulips(T, 26, WB, 24, { t: 0, rim: 0 }); A.bollard(T, 60, GY + 1); A.bollard(T, 76, GY + 1);
    LAMPS.forEach(l => A.lamp(T, l.x, GY, { style: 'lantern', h: l.h, light: false, rim: 0 }));
    QUEUE.forEach(q => { if (!q.tone) A.shadow(T, q.x + (q.tall ? 2 : 0), q.y, q.h / 5, 2, 0.5); });
    glow(T, DOOR.x + 14, GY - 8, 28, 22, 1.4, 'phone3', 0.14, 4);          // the cold door light on the pavement and the head of the queue
    // the wet road: a dark, unbroken reflection, with puddles that catch the sky
    A.water(T, -20, KERB + 1, 360, 180 - KERB - 1, { t: 0, amp: 0.5, dark: 0.74, color: 'slate1', gaps: 0, glints: 0, stretch: 1.5 });
    [[78, 168, 19, 3], [136, 175, 14, 2], [214, 172, 16, 2]].forEach(([x, y, rx, ry]) => { A.ellipse(T, x, y, rx, ry, 'night3'); A.ditherRect(T, x - rx + 2, y - ry + 1, 2 * rx - 4, 2 * ry - 1, 'night3', 'mist0', 0.5); A.hline(T, x - rx + 4, y - ry, rx - 2, 'mist1'); });
    roadDeco(T, -20);
    A.hline(T, -20, KERB, 360, 'slate4'); A.hline(T, -20, KERB + 1, 360, 'slate0');
    S = T.buf.slice(); BASE.set(sig, S); return S;
  }
  // plus the light of the two lanterns; a flicker is the dim variant (bit i set: lamp i dim)
  function stat(g, dim) {
    const key = sigOf(g.camX) + ':' + dim; let S = STAT.get(key); if (S) return S;
    const B = base(g.camX), T = SCR; T.buf.set(B); T.camX = g.camX; A.depth(T, 1);
    LAMPS.forEach((l, i) => lampLight(T, l.x + 1, GY - l.h - 3, GY, l.reach, l.cone, (dim >> i) & 1 ? 0.35 : 1));
    S = T.buf.slice(); STAT.set(key, S); return S;
  }
  // everything the camera drift can reach, built up front (the scene's loading cost) so no frame ever stalls on it
  function warm() {
    const seen = new Set(), probe = { camX: 0 };
    for (let k = 0; k <= 1.0001; k += 0.01) {
      probe.camX = -6 * k; const sig = sigOf(probe.camX); if (seen.has(sig)) continue; seen.add(sig);
      for (let d = 0; d < 4; d++) stat(probe, d);
    }
  }

  // ------------------------------------------------------------------ small live helpers
  let NL = null;       // the sign's letter positions, measured once
  function letters() {
    if (NL) return NL;
    const str = SIGN.text, tw = A.textWidth(str, SIGN.size, true), x0 = SIGN.x + SIGN.w / 2 - tw / 2;
    NL = { xs: str.split('').map((c, i) => x0 + A.textWidth(str.slice(0, i), SIGN.size, true)) };
    return NL;
  }
  // the N stutters and dies every 5 s; the K buzzes a little later. 0 dead, 1 dim, 2 on
  function neon(t) {
    const p = t % 5, q = (t + 2.1) % 5;
    return { n: (p > 3.1 && p < 3.18) || (p > 3.3 && p < 3.38) || (p > 3.55 && p < 4.05) ? 0 : (p > 3.0 && p < 3.1) ? 1 : 2,
      k: (q > 4.2 && q < 4.3) || (q > 4.4 && q < 4.45) ? 1 : 2 };
  }

  // the mill's sails: four filled blades in the colour of the tower, one cached stamp per angle step
  const NA = 16, SAILS = [];
  function sails(a) {
    let S = SAILS[a]; if (S) return S;
    const sc = A.surface(100, 100), BG = A.col('night0'); sc.buf.fill(BG);
    const an0 = -(a / NA) * Math.PI / 2, c = 'night3';
    for (let k = 0; k < 4; k++) {
      const an = an0 + k * Math.PI / 2, ca = Math.cos(an), sa = Math.sin(an), px = -sa, py = ca, a0 = 5, Ln = 33, sw = 6;
      A.line(sc, 50, 50, 50 + ca * Ln, 50 + sa * Ln, c, 2);
      A.poly(sc, [50 + ca * a0, 50 + sa * a0, 50 + ca * Ln, 50 + sa * Ln, 50 + ca * Ln + px * sw, 50 + sa * Ln + py * sw, 50 + ca * a0 + px * sw, 50 + sa * a0 + py * sw], c);
    }
    A.disc(sc, 50, 50, 2, c);
    const X = [], Y = [];
    for (let y = 0; y < 100; y++) for (let x = 0; x < 100; x++) if (sc.buf[y * 100 + x] !== BG) { X.push(x - 50); Y.push(y - 50); }
    S = { x: Int16Array.from(X), y: Int16Array.from(Y) }; SAILS[a] = S; return S;
  }
  // rain: slanted streaks that loop forever, written straight into the frame (same look as NRART.rain)
  const DROPS = [];
  for (let i = 0; i < 46; i++) {
    const r1 = H(i, 3), r2 = H(i, 4), r3 = H(i, 5), near = r3 > 0.7, l = Math.round(5 * (near ? 1.4 : 0.8)), sp = 170 * (0.75 + 0.5 * r3);
    DROPS.push({ r1, r2, near, l, sp, span: 180 + l });
  }
  const RAIN_N = A.col('mist5'), RAIN_F = A.col('mist3');
  function rain(g, t) {
    const buf = g.buf, w = g.w, h = g.h, sl = 0.2;
    for (const d of DROPS) {
      const yy = Math.floor(((d.r2 * d.span + t * d.sp) % d.span) - d.l), xx = Math.floor((((d.r1 * w + yy * sl) % w) + w) % w), c = d.near ? RAIN_N : RAIN_F;
      for (let k = 0; k <= d.l; k++) { const px = xx + Math.round(k * sl), py = yy + k; if (px >= 0 && px < w && py >= 0 && py < h) buf[py * w + px] = c; }
    }
    for (let i = 0; i < 8; i++) {
      const k = Math.floor(t * 9) + i * 7; if (H(k, 12) < 0.5) continue;
      const sx = Math.floor(H(k, 13) * w), sy = KERB + 4 + Math.floor(H(k, 14) * 3);
      if (sy < h) { buf[sy * w + sx] = RAIN_N; if (sx > 0) buf[(sy - 1) * w + sx - 1] = RAIN_F; if (sx < w - 1) buf[(sy - 1) * w + sx + 1] = RAIN_F; }
    }
  }

  // ------------------------------------------------------------------ the scene
  A.scenes.nightshop = (g, t) => {
    A.camera(g, t, { x: -6, period: 8 }); A.key(g, KEY[0], KEY[1], 2);
    if (!LAYERS) { LAYERS = build(); warm(); }
    const L = LAYERS;
    const dim = LAMPS.reduce((m, l, i) => m | (A.hash(Math.floor(t * 9), l.seed + 2) < l.flick ? 1 << i : 0), 0);
    g.buf.set(stat(g, dim));
    // ---- far plane: the mill's sails, filled blades in one tone, turning anticlockwise
    A.depth(g, 0.15);
    stampList(g, sails(Math.floor(((t / 4) % 1) * NA) % NA), L.hub[0] + g.ox, L.hub[1] + g.oy, L.sailTone);
    A.depth(g, 0.4);
    A.mist(g, t, 122, 24, { amount: 0.34, speed: 4, seed: 1 });
    // ---- the terrace: a window that flickers, and the sign
    A.depth(g, 0.7);
    {
      const o = TERRACE[2], c = cells(o).find(c => c.j === 0 && c.i === 0);
      if (c) A.window(g, c.x, c.y, c.w, c.h, { lit: 0.9, frame: o.trim, bars: 'cross', t, seed: 33, flicker: 1, detail: 'cat', glow: 0 });
    }
    const nl = letters(), st = neon(t), ty = SIGN.y + SIGN.h - 3;
    SIGN.text.split('').forEach((ch, i) => {
      const lvl = i === 0 ? st.n : i === 9 ? st.k : 2;
      A.text(nl.xs[i], ty, ch, lvl === 2 ? 'amber8' : lvl === 1 ? 'amber5' : 'amber1', SIGN.size, true, { shadow: lvl > 0 });
    });
    if (st.n === 2) glow(g, Math.round(nl.xs[0] + 3), SIGN.y + 6, 16, 10, 1.3, 'amber7', 0.3, 4);
    if (st.k === 2) glow(g, Math.round(nl.xs[9] + 3), SIGN.y + 6, 12, 9, 1.3, 'amber7', 0.2, 4);
    // ---- the street: lantern light, then the queue
    A.depth(g, 1);
    let z1 = null;
    for (let i = QUEUE.length - 1; i >= 0; i--) {
      const q = QUEUE[i], tt = t + i * 1.7, phase = Math.floor((((tt % SWAY) + SWAY) % SWAY) / SWAY * NF) % NF;
      const blink = ((tt + H(q.seed + 17, 91) * BLINK) % BLINK) < 0.13;
      const S = sprite(i, phase, blink); stamp(g, S, q.x, q.y);
      if (q.tall) z1 = { x: q.x, y: q.y, hand: S.hand, head: S.head };
    }
    // her phone glow breathes
    const pg = 0.35 + 0.15 * Math.sin(t * 2 * Math.PI / 3);
    if (z1) glow(g, z1.x + z1.hand[0], z1.y + z1.hand[1] - 3, 13, 13, 1.3, 'phone4', pg, 5);
    // ---- the wet road: the queue's reflection, long thin streaks, a puddle that rings
    A.water(g, 176, KERB + 1, 144, 180 - KERB - 1, { t, amp: 0.5, dark: 0.74, color: 'slate1', gaps: 0, glints: 5, stretch: 1.5 });
    roadDeco(g, 176);
    A.streak(g, 94, KERB + 2, 22, { color: 'amber6', strength: 0.5, width: 1, t, seed: 1 });
    A.streak(g, DOOR.x + 8, KERB + 2, 20, { color: 'phone4', strength: 0.45, width: 1, t, seed: 2 });
    A.streak(g, 234, KERB + 2, 18, { color: 'amber6', strength: 0.55, width: 1, t, seed: 3 });
    A.streak(g, 11, KERB + 2, 16, { color: 'amber6', strength: 0.5, width: 1, t, seed: 4 });
    A.hline(g, 176, KERB, 150, 'slate4'); A.hline(g, 176, KERB + 1, 150, 'slate0');
    // ---- near silhouettes, the bill, rain
    stampFore(g, L.fore, -Math.round(-g.camX));
    if (z1) {
      const bob = Math.sin(t * 2 * Math.PI / 4) > 0.3 ? 1 : 0, hx = z1.x + z1.head[0], hy = z1.y + z1.head[1], bx = hx - 18, by = hy - 26 + bob;
      // the Tikkie card: a lit phone screen floating over her hand, joined to it by a thin line
      A.rect(g, bx + 1, by, 27, 15, 'phone4'); A.rect(g, bx, by + 1, 29, 13, 'phone4'); A.hline(g, bx + 1, by + 14, 27, 'phone2'); A.hline(g, bx + 1, by, 27, 'phone5');
      A.vline(g, z1.x + z1.hand[0], by + 15, z1.y + z1.hand[1] - 6 - by - 15, 'phone3');
      A.text(bx + 14.5, by + 5.5, 'Tikkie', 'phone1', 4.5, true, { align: 'center' });
      A.text(bx + 14.5, by + 12.5, '€4,50', 'night1', 7.5, true, { align: 'center' });
    }
    rain(g, t);
  };
  // the shared night grade, last: the deepest darks lift into the concept art's blue-grey haze (NRART.grade)
  { const draw = A.scenes.nightshop; A.scenes.nightshop = (g, t) => { draw(g, t); A.grade(g); }; }
})();
