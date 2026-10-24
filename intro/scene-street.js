// Level intro scene "street" (also the fallback for themes without a scene of their own).
// HIS street at night after the mist: dark terraced brick houses with gables, and ONE warm focal
// point: his open front door (the key light). He stands in it, backlit; its amber spill runs over
// the pavement and the wet road onto the dogs, who stare at the doorway (the brown one holds the
// leash in its mouth). A cat watches a zombie from a lit window on the left; the far end of the
// street is a fogged canal with a half-raised drawbridge, a mill and two far zombies crossing.
// Loops: door-light flicker, tail wag + paw tap, leash sway, mill sails, far zombies on an 8 s wrap,
// flag wave, tulip sway, lantern flicker, drifting mist, eye blink, puddle ripples, breath.
// Speed: the static stack (sky, far houses, bridge, near houses, ground) is drawn once per camera
// offset into cached layers; each frame copies them back and draws only what moves.
(function () {
  const A = window.NRART;
  const H = A.hash;
  const GY = 140;                       // the house line (front of the pavement)
  const GF = 36, UF = 21;               // ground floor and upper floor heights
  const KX = 230;                       // the hero door: centre x

  const FAR = [[-10, 30, 56, 'step'], [18, 26, 64, 'bell'], [42, 32, 52, 'neck'], [72, 28, 66, 'spout'], [214, 30, 60, 'bell'], [242, 28, 52, 'step'], [268, 34, 68, 'neck'], [300, 30, 56, 'spout']];
  // x, width, upper floors, gable, brick, extras
  const NEAR = [
    { x: -14, w: 38, f: 3, gable: 'bell', brick: 'brick2', door: 'right', seed: 3, shutters: false, lit: [] },
    { x: 24, w: 44, f: 2, gable: 'step', brick: 'brick3', door: 'right', seed: 5, lit: [], big: true },
    { x: 68, w: 34, f: 3, gable: 'neck', brick: 'night4', door: 'left', seed: 8, lit: [[1, 1, 'cat']] },
    { x: 102, w: 34, f: 2, gable: 'pitch', brick: 'brick2', door: 'left', seed: 12, shutters: true, lit: [] },
    { x: 210, w: 40, f: 2, gable: 'step', brick: 'brick3', door: 'hero', seed: 21, lit: [[2, 0]] },
    { x: 250, w: 36, f: 3, gable: 'neck', brick: 'brick2', door: 'left', seed: 24, shutters: true, lit: [] },
    { x: 286, w: 44, f: 2, gable: 'bell', brick: 'brick4', door: 'right', seed: 27, lit: [] },
  ];

  // ------------------------------------------------------------------ small local helpers
  // pixel loop over a sprite's own pixels (by mask id) with a colour table, in world coords
  function recolor(g, id, x0, y0, x1, y1, tab) {
    x0 = Math.max(0, x0 + g.ox); x1 = Math.min(g.w - 1, x1 + g.ox); y0 = Math.max(0, y0 + g.oy); y1 = Math.min(g.h - 1, y1 + g.oy);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const i = y * g.w + x; if (g.mask[i] === id) g.buf[i] = tab[g.buf[i]]; }
  }
  function getpx(g, x, y) { x += g.ox; y += g.oy; return x < 0 || y < 0 || x >= g.w || y >= g.h ? 0 : g.buf[y * g.w + x]; }

  function gableShape(g, x, w, top, gable, gh, base, cop) {
    const cx = x + w / 2;
    if (gable === 'step') {
      const n = 3, sh = Math.round(gh / n), sw = Math.max(3, Math.round(w / 9));
      for (let i = 1; i <= n; i++) {
        const x0 = x + i * sw, x1 = x + w - i * sw; if (x1 - x0 < 4) break;
        A.rect(g, x0, top - i * sh, x1 - x0, sh + 1, base); A.hline(g, x0, top - i * sh, x1 - x0, cop);
      }
    } else if (gable === 'bell' || gable === 'neck') {
      const N = 12, Lp = [], Rp = [];
      for (let i = 0; i <= N; i++) {
        const u = i / N; let f;
        if (gable === 'bell') f = 0.30 + 0.70 * (1 + Math.cos(Math.PI * u)) / 2; else f = u < 0.42 ? 1 - 0.66 * u / 0.42 : 0.34;
        const hw = w / 2 * f; Lp.push(cx - hw, top - gh * u); Rp.unshift(cx + hw, top - gh * u);
      }
      A.poly(g, Lp.concat(Rp), base);
      if (gable === 'bell') A.disc(g, cx - 0.5, top - gh, Math.round(w * 0.15), base);
      else A.poly(g, [cx - w * 0.17 - 1, top - gh, cx + w * 0.17 + 1, top - gh, cx, top - gh - 6], base);
      A.hline(g, cx - Math.round(w * 0.12), top - gh - (gable === 'bell' ? Math.round(w * 0.15) : 6), Math.round(w * 0.24), cop);
    } else {   // pitch: a gable end under a tiled roof
      const rc = A.col('slate2');
      A.poly(g, [x - 2, top + 1, x + w + 2, top + 1, cx, top - gh], rc);
      A.tiles(g, x - 2, top - gh, w + 4, gh + 2, { base: rc, only: rc });
      A.line(g, x - 2, top + 1, cx, top - gh, 'slate3'); A.line(g, x + w + 2, top + 1, cx, top - gh, 'slate1');
      A.rect(g, x + Math.round(w * 0.72), top - gh + 4, 4, 9, A.step(base, -1)); A.hline(g, x + Math.round(w * 0.72) - 1, top - gh + 3, 6, A.step(base, 1));
    }
  }

  function house(g, o, t) {
    const x = o.x, w = o.w, f = o.f, seed = o.seed, base = A.col(o.brick), dk = A.step(base, -1), lt = A.step(base, 1);
    const wallH = GF + f * UF, top = GY - wallH, cx = x + w / 2;
    const gh = o.gable === 'step' ? 18 : o.gable === 'pitch' ? Math.round(w * 0.5) : Math.round(w * 0.6);
    A.begin(g);
    A.rect(g, x, top, w, wallH, base);
    gableShape(g, x, w, top, o.gable, gh, base, A.step(base, 1));
    A.brick(g, x, top - gh - 8, w, wallH + gh + 8, { base, only: base, seed, bw: w >= 36 ? 4 : 3 });
    // stone bands at the floor lines on some houses, a plinth
    if (H(seed, 2) < 0.7) for (let k = 0; k <= f; k++) A.hline(g, x, GY - GF - k * UF, w, lt);
    A.rect(g, x, GY - 4, w, 4, A.step(base, -2));
    // the hoisting beam at the top of the gable
    if (o.gable !== 'pitch') { const hy = top - gh + (o.gable === 'step' ? 0 : 3); A.hline(g, cx - 3, hy - 2, 7, 'wood2'); A.vline(g, cx + 3, hy - 2, 3, 'wood1'); A.px(g, cx + 3, hy + 1, 'steel1'); }
    // attic window
    if (o.gable !== 'pitch') A.window(g, Math.round(cx) - 2, top - Math.round(gh * 0.5) - 2, 4, 6, { lit: 0, frame: 'night4', sill: false, bars: 'v' });
    else A.window(g, Math.round(cx) - 2, top - Math.round(gh * 0.4), 5, 6, { lit: 0, frame: 'night4', sill: false, bars: 'v' });
    // upper windows: 2-3 bays, a different size on the top floor, sills, some shutters
    const bays = w >= 42 ? 3 : 2, ww = bays === 3 ? 6 : 8;
    for (let k = 1; k <= f; k++) {
      const topFloor = k === f, wh = topFloor ? 9 : 11, wy = GY - GF - k * UF + (topFloor ? 6 : 5);
      for (let b = 0; b < bays; b++) {
        const wx = x + Math.round((b + 0.5) * w / bays - ww / 2);
        const L = (o.lit || []).find(q => q[0] === k && q[1] === b);
        if (o.shutters) { A.rect(g, wx - 2, wy, 2, wh, 'green1'); A.rect(g, wx + ww, wy, 2, wh, 'green1'); }
        A.window(g, wx, wy, ww, wh, { lit: L ? 0.9 : 0, frame: 'night4', bars: 'cross', t, seed: seed * 7 + k * 3 + b, glow: L ? 0.32 : 0, detail: L && L[2] === 'cat' ? 'cat' : null });
        if (!L && H(seed + k, b + 9) < 0.18) A.rect(g, wx + 1, wy + 1, ww - 2, 3, 'night1');     // a curtain
      }
    }
    // drainpipe
    A.vline(g, o.door === 'right' ? x + 1 : x + w - 2, top + 4, wallH - 4, 'slate3'); A.vline(g, o.door === 'right' ? x + 2 : x + w - 1, top + 4, wallH - 4, 'slate1');
    // ground floor: a door with a fanlight and a stoop, a wide window beside it
    const dw = o.door === 'hero' ? 16 : 9, dh = o.door === 'hero' ? 38 : 29;
    const dx = o.door === 'hero' ? KX - 8 : o.door === 'left' ? x + 4 : x + w - 4 - dw;
    if (o.door !== 'hero') {
      A.rect(g, dx - 1, GY - dh - 5, dw + 2, dh + 5, 'night5'); A.rect(g, dx, GY - dh - 4, dw, 3, 'night2'); A.px(g, dx + 1, GY - dh - 4, 'mist0');
      A.rect(g, dx, GY - dh, dw, dh, H(seed, 4) < 0.5 ? 'green2' : 'wood1'); A.hline(g, dx, GY - dh + 13, dw, 'night0'); A.rect(g, dx + 2, GY - dh + 3, dw - 4, 8, A.step(H(seed, 4) < 0.5 ? 'green2' : 'wood1', 1));
      A.px(g, dx + dw - 2, GY - 14, 'cheese4');
      A.rect(g, dx - 2, GY - 2, dw + 4, 2, 'slate3'); A.hline(g, dx - 2, GY - 2, dw + 4, 'slate4');
    }
    const sx = o.door === 'hero' ? x + 2 : (o.door === 'left' ? dx + dw + 4 : x + 3), swd = (o.door === 'hero' ? 0 : (o.door === 'left' ? x + w - 3 : dx - 4) - sx);
    if (swd >= 6 && !o.big) {
      A.window(g, sx, GY - GF + 9, swd, 15, { lit: 0, frame: 'night4', bars: 'cross', seed });
      if (H(seed, 6) < 0.5) { A.rect(g, sx + 1, GY - GF + 22, 3, 2, 'wood2'); A.px(g, sx + 2, GY - GF + 21, 'green4'); A.px(g, sx + 1, GY - GF + 20, 'red4'); }   // a tulip pot on the sill
    }
    if (o.big) {
      // the living-room window, lit: a plant on the sill and a cat sitting in it (concept D)
      const lx = 36, lw = 28, ly = GY - GF + 2, lh = 25;
      A.rect(g, lx - 1, ly - 1, lw + 2, lh + 2, 'night5'); A.rect(g, lx, ly, lw, lh, 'amber5');
      A.ditherGradient(g, lx, ly, lw, lh, 'amber4', 'amber6', 'down'); A.ditherRect(g, lx, ly + lh - 7, lw, 7, null, 'amber7', 0.4);
      A.vline(g, lx + 14, ly, lh, 'night5'); A.hline(g, lx, ly + 7, lw, 'night5');
      // plant and cat silhouettes
      A.rect(g, lx + 3, ly + lh - 5, 4, 5, 'brick1'); A.rect(g, lx + 4, ly + lh - 9, 1, 4, 'green2'); A.rect(g, lx + 2, ly + lh - 9, 1, 2, 'green2'); A.rect(g, lx + 6, ly + lh - 8, 1, 3, 'green2');
      A.hline(g, lx - 2, ly + lh + 1, lw + 4, 'night3'); A.hline(g, lx - 2, ly + lh + 2, lw + 4, 'night1');
      A.glow(g, lx + lw / 2, ly + lh / 2, 34, { color: 'amber5', strength: 0.28, power: 1.3, ry: 28, q: 4 });
      A.rect(g, x + 4, GY - dh - 5, dw + 2, dh + 5, 'night5');
    }
    if (o.big) { const d2 = x + 4; A.rect(g, d2, GY - 29 - 5, 11, 34, 'night5'); A.rect(g, d2 + 1, GY - 29 - 4, 9, 3, 'night2'); A.rect(g, d2 + 1, GY - 29, 9, 29, 'wood1'); A.hline(g, d2 + 1, GY - 16, 9, 'night0'); A.px(g, d2 + 8, GY - 14, 'cheese4'); A.rect(g, d2 - 1, GY - 2, 13, 2, 'slate3'); }
    A.end(g);
  }

  // the hero's open front door: drawn into the cached stack, lit from inside
  function heroDoor(g) {
    const dx = KX - 8, dw = 16, dh = 38, top = GY - dh;
    A.begin(g);
    A.rect(g, dx - 2, top - 6, dw + 4, dh + 6, 'night5'); A.rect(g, dx - 1, top - 5, dw + 2, 3, 'night3');
    A.rect(g, dx, top - 4, dw, 3, 'amber5'); A.vline(g, dx + 8, top - 4, 3, 'night5'); A.vline(g, dx + 4, top - 4, 3, 'night5'); A.vline(g, dx + 12, top - 4, 3, 'night5');
    A.rect(g, dx, top, dw, dh, 'amber5');
    A.ditherGradient(g, dx, top, dw, dh, 'amber4', 'amber6', 'down');
    A.ditherRect(g, dx, GY - 14, dw, 14, null, 'amber7', 0.55);
    // the hallway behind him: a runner, a coat hook, a framed picture, the stairs
    A.rect(g, dx, GY - 3, dw, 3, 'red3'); A.hline(g, dx, GY - 3, dw, 'red4');
    A.rect(g, dx + 1, top + 5, 3, 4, 'amber3'); A.hline(g, dx + 1, top + 5, 3, 'amber2');
    A.rect(g, dx + 12, top + 6, 3, 1, 'amber3'); A.rect(g, dx + 13, top + 7, 2, 5, 'amber2');
    for (let i = 0; i < 6; i++) A.hline(g, dx + 9 + i, GY - 10 - i * 2 - 2, 7 - i, 'amber3');
    // the door leaf, swung in against the right jamb
    A.rect(g, dx + dw - 2, top, 2, dh, 'wood2'); A.vline(g, dx + dw - 3, top, dh, 'wood1');
    // stoop: two steps in the light
    A.rect(g, dx - 3, GY - 2, dw + 6, 2, 'slate4'); A.hline(g, dx - 3, GY - 2, dw + 6, 'amber3');
    A.end(g, 0);
    A.glow(g, KX, GY - 22, 36, { color: 'amber5', strength: 0.4, power: 1.1, ry: 34, q: 5 });
  }

  // a drawbridge half raised: portal, balance beam with counterweight, chain, the leaf up in the fog
  function bridge(g, x, y, w) {
    const c = A.col('night1'), d = A.col('night0'), l = A.col('night3'), hx = x + Math.round(w * 0.46);
    A.begin(g);
    A.rect(g, hx, y, x + w - hx, 2, d); A.hline(g, hx, y, x + w - hx, l);
    for (let i = hx; i <= x + w; i += 5) A.vline(g, i, y - 4, 4, d); A.hline(g, hx, y - 4, x + w - hx, c);
    A.rect(g, x, y, 4, 2, d);
    // the raised leaf
    const L = Math.round(w * 0.44), tx = hx - Math.round(L * 0.82), ty = y - Math.round(L * 0.58);
    A.line(g, hx, y, tx, ty, c, 2); A.line(g, hx, y - 4, tx, ty - 4, d);
    for (let i = 1; i < 6; i++) { const fx = hx + (tx - hx) * i / 6, fy = y + (ty - y) * i / 6; A.vline(g, fx, fy - 4, 4, d); }
    // portal posts and the balance beam
    const ph = 30;
    A.rect(g, hx + 1, y - ph, 2, ph, c); A.rect(g, hx + 7, y - ph, 2, ph, c); A.vline(g, hx + 3, y - ph, ph, l); A.vline(g, hx + 9, y - ph, ph, l);
    A.line(g, hx - 15, y - ph - 6, hx + 20, y - ph + 2, c, 2); A.line(g, hx - 15, y - ph - 7, hx + 20, y - ph + 1, l);
    A.rect(g, hx + 17, y - ph + 2, 7, 7, d); A.rect(g, hx + 18, y - ph + 3, 5, 3, c);
    A.line(g, hx - 15, y - ph - 5, tx, ty - 2, 'steel2'); A.line(g, hx - 14, y - ph - 5, tx + 1, ty - 2, 'night3');
    A.rect(g, hx - 2, y - ph - 3, 14, 2, d);
    A.end(g, 0);
  }

  // ------------------------------------------------------------------ cached lights
  // glow()/cone() recompute a pow/sqrt field every frame. The fields never change shape, only strength,
  // so each one is computed once per camera offset as a list of (pixel, level) pairs and replayed.
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
  // a glow at world (x, y): same maths as NRART.glow
  function glow(g, x, y, r, ry, power, color, strength, Q) {
    Q = Q || 6;
    const F = fieldOf(g, `g${x},${y},${r},${ry},${power}`, [Math.floor(x - r), Math.floor(y - ry), Math.ceil(x + r), Math.ceil(y + ry)], Q, (xx, yy) => {
      const dx = (xx - x) / r, dy = (yy - y) / ry, d2 = dx * dx + dy * dy; if (d2 >= 1) return 0; return Math.pow(1 - Math.sqrt(d2), power);
    });
    replay(g, F, color, strength, Q);
  }
  // a cone at world (x, y) pointing down: same maths as NRART.cone
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
  // a lantern lamp whose light is replayed from cache; same look as NRART.lamp
  function lamp(g, x, y, t, h, seed, flicker, reach, coneS) {
    const [lx, ly] = A.lamp(g, x, y, { t, style: 'lantern', h, seed, flicker, light: false });
    const k = flicker && A.hash(Math.floor(t * 9), seed + 2) < flicker ? 0.35 : 1;
    glow(g, lx, ly, 14, 14, 1.6, 'amber6', 0.55 * k, 6);
    coneDown(g, lx, ly + 2, 0.42, reach + 1, 4, 0.6, 0.6, 'amber5', coneS * k, 6);
    glow(g, lx, y, reach * 0.62, 3, 1, 'amber5', 0.35 * k, 6);
  }

  // the mill's tower (static, in the far layer) and its sails (moving, a seamless turn, anticlockwise)
  function millBody(g, x, y, sc) {
    const base = A.col('night3'), dk = A.step(base, -1), dk2 = A.step(base, -2), lt = A.step(base, 1);
    const bh = Math.round(50 * sc), b0 = Math.round(11 * sc), b1 = Math.round(5.5 * sc), top = y - bh;
    A.begin(g);
    A.poly(g, [x - b0, y, x + b0 + 1, y, x + b1 + 1, top, x - b1, top], base);
    A.poly(g, [x - b0, y, x - Math.round(b0 * 0.4), y, x - Math.round(b1 * 0.4), top, x - b1, top], dk);
    A.poly(g, [x + Math.round(b0 * 0.45), y, x + b0 + 1, y, x + b1 + 1, top, x + Math.round(b1 * 0.45), top], lt);
    for (let yy = top + 2; yy < y; yy += 3) for (let xx = x - b0; xx <= x + b0; xx += 2) if (H(xx, yy + 1) < 0.3) A.px(g, xx, yy, dk2);
    const sy = y - Math.round(bh * 0.33), hw = b0 + 9;
    A.rect(g, x - hw, sy, 2 * hw + 1, 1, dk2); A.hline(g, x - hw, sy - 4, 2 * hw + 1, dk);
    for (let xx = x - hw; xx <= x + hw; xx += 4) A.vline(g, xx, sy - 4, 4, dk);
    A.line(g, x - hw, sy + 1, x - b0 + 1, y - 1, dk2); A.line(g, x + hw, sy + 1, x + b0 - 1, y - 1, dk2);
    A.rect(g, x - 2, y - 7, 4, 7, dk2);
    [[0, 0.55], [-0.3, 0.75], [0.25, 0.42]].forEach(([fx, fy]) => { const wx = x + Math.round(fx * b0), wy = y - Math.round(bh * fy); A.rect(g, wx, wy, 2, 3, 'amber5'); A.glow(g, wx + 1, wy + 1, 6, { color: 'amber5', strength: 0.3, q: 3 }); });
    const cw = b1 + 2, ch = 6;
    A.poly(g, [x - cw, top + 1, x + cw + 1, top + 1, x + b1 + 1, top - ch + 1, x - b1 + 1, top - ch, x - b1, top - ch + 1], dk);
    A.hline(g, x - cw, top, 2 * cw + 1, dk2);
    A.end(g, 0);
  }
  function sails(g, hx, hy, L, angle) {
    const sc = 'night1', sw = 6;
    for (let k = 0; k < 4; k++) {
      const an = angle + k * Math.PI / 2, ca = Math.cos(an), sa = Math.sin(an), px = -sa, py = ca, a0 = 0.2 * L;
      A.line(g, hx - ca * 2, hy - sa * 2, hx + ca * L, hy + sa * L, sc, 2);
      const x1 = hx + ca * L, y1 = hy + sa * L, x2 = x1 + px * sw, y2 = y1 + py * sw, x3 = hx + ca * a0 + px * sw, y3 = hy + sa * a0 + py * sw;
      A.line(g, x1, y1, x2, y2, sc); A.line(g, x2, y2, x3, y3, sc);
      for (let i = 1; i < 5; i++) { const f = a0 + (L - a0) * i / 5; A.line(g, hx + ca * f, hy + sa * f, hx + ca * f + px * sw, hy + sa * f + py * sw, sc); }
    }
    A.disc(g, hx - 0.5, hy, 2, 'night0');
  }
  // a drifting mist band, same look as NRART.mist but from per-seed tables and with fewer rows
  const FOG = new Map();
  function fog(g, t, y, h, amt, sp, seed, color) {
    let T = FOG.get(seed); if (!T) { T = { n: new Float32Array(320), n2: new Float32Array(320) }; for (let x = 0; x < 320; x++) { T.n[x] = A.wave(x, 320, seed); T.n2[x] = A.wave(x * 0.5 + 40, 320, seed + 3); } FOG.set(seed, T); }
    const Q = 6, Ls = []; for (let q = 0; q <= Q; q++) Ls.push(A.lut('mix', color, q / Q));
    const buf = g.buf, w = g.w, sh = Math.round(t * sp), cy0 = y + g.oy + h / 2;
    for (let xx = 0; xx < w; xx++) {
      const k = (((xx - g.ox + sh) % 320) + 320) % 320, n = T.n[k], n2 = T.n2[k];
      const th = Math.max(0.5, h * (0.35 + 0.65 * n) / 2), cy = cy0 + (n2 - 0.5) * h * 0.5, am = amt * (0.55 + 0.45 * n) * Q;
      const r0 = Math.max(0, Math.ceil(cy - th)), r1 = Math.min(g.h - 1, Math.floor(cy + th)), inv = 1 / th;
      for (let yy = r0; yy <= r1; yy++) {
        const d = (yy + 0.5 - cy) * inv, v = am * (1 - d * d); let q = v | 0; if (v - q > A.bayer(xx, yy)) q++;
        if (q > 0) { const i = yy * w + xx; buf[i] = Ls[q > Q ? Q : q][buf[i]]; }
      }
    }
  }

  // ------------------------------------------------------------------ the static stack (cached)
  // Five layers (sky, far fog, far houses, near terrace, ground), each drawn once at camera 0 onto its
  // own padded surface that starts transparent (palette index 255 passes through every light and fog
  // lookup untouched). A frame composites them with each layer's own parallax shift and draws only
  // what moves (mill sails, far zombies, mist, lamps, the dogs, the man, the light) in between.
  const LW = 332, SENT = 255;
  let LAYERS = null, RUNS = null;
  function newLayer() { const s = A.surface(LW, 180); s.buf.fill(SENT); A.key(s, KX, 118, 1); return s; }
  function build() {
    const L = {};
    // ---- sky: gradient, broad low clouds, a dim moon, the pale horizon the far planes stand against
    let s = newLayer();
    A.sky(s, ['night0', 'night1', 'night2', 'night3', 'night4', 'mist1', 'mist2'], 0, 134, { blend: 12 });
    [[30, 30, 5], [118, 22, 6], [214, 38, 5], [300, 26, 6], [70, 56, 5], [170, 50, 5], [262, 62, 5]].forEach(([cx, cy, n], k) => {
      for (let i = -n; i <= n; i++) A.ditherDisc(s, cx + i * 11, cy + ((i + k) & 1) * 2, 13 - Math.abs(i) * 0.8, 'night3', 0.3, 1.3);
    });
    A.glow(s, 172, 100, 170, { color: 'mist4', strength: 0.55, power: 1.5, ry: 70, q: 6 });
    A.moon(s, 298, 38, 5, { halo: 0.05 });
    { const tab = A.lut('mix', 'night3', 0.5); for (let y = 28; y < 49; y++) for (let x = 288; x < 309; x++) s.buf[y * LW + x] = tab[s.buf[y * LW + x]]; }   // a dim, thin-clouded moon
    L.sky = s.buf;
    // ---- far fog: tree line and church
    s = newLayer();
    A.rect(s, -20, 112, 360, 16, 'night3');
    for (let i = 0; i < 24; i++) A.disc(s, -10 + i * 15 + H(i, 2) * 6, 111 + H(i, 3) * 2, 3 + H(i, 4) * 3, 'night3');
    A.church(s, 132, 114, 0.85, { tone: 'night2' });
    millBody(s, 172, 113, 0.95);
    A.haze(s, -20, 70, 360, 60, { top: 0.1, bottom: 0.4, color: 'mist3' });
    L.far = s.buf;
    // ---- far houses and the bridge
    s = newLayer();
    FAR.forEach(([x, w, h, gb], i) => A.canalHouse(s, x, 128, w, h, { gable: gb, lit: 0.12, flicker: 0, t: 0, seed: i * 3 + 11, brick: 'slate3', trim: 'slate4', door: false, detail: false }));
    A.haze(s, -20, 50, 360, 90, { top: 0.3, bottom: 0.52, color: 'mist3' });
    bridge(s, 120, 128, 74);
    A.haze(s, 100, 60, 110, 80, { top: 0.05, bottom: 0.12, color: 'mist3' });
    L.mid = s.buf;
    // ---- near terrace and his open door
    s = newLayer();
    NEAR.forEach(o => house(s, o, 0));
    A.haze(s, -20, 20, 360, 124, { top: 0.38, bottom: 0.46, color: 'night1', lights: 0.25 });   // the terrace is nearly black
    heroDoor(s);
    L.near = s.buf;
    // ---- the pavement, the kerb and the wet road
    s = newLayer();
    A.rect(s, -20, GY, 360, 8, 'slate3'); A.hline(s, -20, GY, 360, 'slate4'); A.hline(s, -20, GY + 7, 360, 'slate1');
    A.ditherGradient(s, -20, GY + 1, 360, 6, 'slate3', 'slate2', 'down');
    for (let x = -20; x < 340; x += 9) A.vline(s, x + (x % 2), GY + 1, 6, 'slate2');
    A.rect(s, -20, GY + 8, 360, 40, 'slate1');
    A.ditherGradient(s, -20, GY + 8, 360, 40, 'slate1', 'slate0', 'down');
    A.hline(s, -20, GY + 8, 360, 'slate4'); A.hline(s, -20, GY + 9, 360, 'slate2');
    for (let y = GY + 12; y < 180; y += 3) for (let x = -20 + (y * 7) % 31; x < 340; x += 31 + (y % 5) * 6) if (H(x, y) < 0.7) A.hline(s, x, y, 3 + Math.floor(H(y, x) * 9), 'slate2');
    L.ground = s.buf;
    return L;
  }
  // Runs of opaque pixels per row, so a layer is copied with a few memcpy-like set() calls
  function runsOf(lay) {
    const rows = [];
    for (let y = 0; y < 180; y++) {
      const r = []; let x = 0;
      while (x < LW) {
        while (x < LW && lay[y * LW + x] === SENT) x++;
        const a = x; while (x < LW && lay[y * LW + x] !== SENT) x++;
        if (x > a) r.push(a, x);
      }
      rows.push(r);
    }
    return rows;
  }
  // copy a layer into the frame with its parallax shift: opaque runs only (SENT is transparent)
  function comp(g, lay, runs, d, y0, y1) {
    const sh = -Math.round(-g.camX * d), buf = g.buf, w = g.w;
    for (let y = y0; y < y1; y++) {
      const r = runs[y], o = y * w, p = y * LW;
      for (let k = 0; k < r.length; k += 2) {
        let a = r[k] - sh, b = r[k + 1] - sh; if (a < 0) a = 0; if (b > w) b = w; if (b <= a) continue;
        buf.set(lay.subarray(p + a + sh, p + b + sh), o + a);
      }
    }
  }

  A.scenes.street = (g, t) => {
    A.camera(g, t, { x: 8, period: 8 }); A.key(g, KX, 118, 1);
    if (!LAYERS) { LAYERS = build(); RUNS = {}; for (const k in LAYERS) RUNS[k] = runsOf(LAYERS[k]); }
    const L = LAYERS;
    comp(g, L.sky, RUNS.sky, 0, 0, 180);
    // ---- the far plane: twinkling stars, the mill, the lit canal below the bridge
    A.depth(g, 0);
    A.stars(g, t, { n: 30, y0: 6, y1: 50, seed: 2 });
    comp(g, L.far, RUNS.far, 0.25, 0, 140);
    A.depth(g, 0.25);
    sails(g, 172.5, 62, 32, -t * 3 * Math.PI / 16);      // a quarter turn per 8/3 s: the 4-fold mill loops on the 8 s wrap
    comp(g, L.mid, RUNS.mid, 0.45, 0, 140);
    A.depth(g, 0.45);
    A.rect(g, 128, 129, 80, 11, 'night2');
    A.water(g, 130, 129, 78, 11, { t, amp: 0.5, dark: 0.55, color: 'night2', gaps: 0.2, glints: 2 });
    A.depth(g, 0.6);
    lamp(g, 156, 131, t, 22, 5, 0.03, 24, 0.5);
    lamp(g, 196, 131, t, 22, 6, 0.05, 24, 0.5);
    // two far zombies cross the end of the street on a seamless 8 s wrap, one each way
    const u1 = (t / 8) % 1, u2 = ((t + 4) / 8) % 1;
    A.zombie(g, 108 + u1 * 150, 134, { variant: 'plain', t: t * 1.8 + 1, pose: 'walk', height: 32, hunch: 0.4, tone: 'night4', glow: 0.1, seed: 4, shadow: false });
    A.zombie(g, 258 - u2 * 150, 139, { variant: 'hat', t: t * 1.8, pose: 'walk', facing: 'left', height: 34, hunch: 0.4, tone: 'night5', glow: 0.1, seed: 9, shadow: false });
    fog(g, t, 112, 26, 0.26, 4, 5, 'mist3');
    comp(g, L.near, RUNS.near, 0.8, 0, 140);
    comp(g, L.ground, RUNS.ground, 1, GY, 180);

    // ---- the zombie at the fence: head dark against the lit window, long arms hooked over the rail
    A.depth(g, 0.8);
    const z = A.zombie(g, 45, GY + 6, { variant: 'plain', t, pose: 'stand', height: 44, hunch: 0.5, glow: 0.2, tone: 'night0', seed: 5, shadow: false });
    A.depth(g, 1);
    A.fence(g, -4, GY + 2, 62, 12);
    A.rect(g, z.hand[0] - 1, GY - 1, 3, 2, 'zombie5'); A.px(g, z.hand[0] + 2, GY - 1, 'zombie4'); A.px(g, z.hand[0] - 1, GY + 1, 'zombie3');
    A.tulips(g, 66, GY + 3, 22, { t });

    // ---- the left lantern (a quieter second light) and the bollards
    lamp(g, 106, 151, t, 46, 1, 0.05, 44, 0.5);
    A.bollard(g, 168, 150); A.bollard(g, 194, 150);

    // ---- his door's light first: the dogs and the man stand in it as silhouettes with a warm rim
    const fl = 0.92 + 0.08 * Math.sin(t * Math.PI / 2) + (H(Math.floor(t * 8), 4) < 0.08 ? -0.12 : 0);
    A.depth(g, 0.9);
    coneDown(g, KX, GY - 1, 0.42, 42, 18, 0.7, 0.5, 'amber6', 0.42 * fl, 6);
    glow(g, KX, GY + 14, 70, 30, 1.5, 'amber5', 0.7 * fl, 6);
    glow(g, KX, GY + 3, 24, 5, 1.2, 'amber6', 0.3 * fl, 5);

    A.depth(g, 0.8);
    A.man(g, KX, GY - 2, { facing: 'front', pose: 'stand', t, face: 'deadpan', arm: 'wave', shadow: false });
    recolor(g, g.sn, KX - 14, GY - 48, KX + 14, GY, A.lut('mix', 'night0', 0.62));
    // a flag out of his window, on a bracket, with a wave
    const fx = 214, fy = 84;
    A.rect(g, fx - 13, fy, 14, 1, 'steel3'); A.rect(g, fx, fy - 1, 3, 5, 'steel2'); A.line(g, fx, fy + 4, fx - 6, fy, 'steel2');
    for (let i = 0; i < 11; i++) {
      const wv = Math.round(Math.sin(t * Math.PI - i * 0.7) * (0.3 + i * 0.1));
      A.vline(g, fx - 12 + i, fy + 1 + wv, 2, 'red3'); A.vline(g, fx - 12 + i, fy + 3 + wv, 2, 'paper3'); A.vline(g, fx - 12 + i, fy + 5 + wv, 2, 'blue3');
    }

    A.depth(g, 1);
    // the omafiets leans on the next house with the grammar book in its basket (a paper edge)
    A.omafiets(g, 292, 149, { t, facing: 'left', basket: 'book', rim: 2, shadow: false });
    A.hline(g, 292 - 16, 149 - 29, 5, 'paper4'); A.hline(g, 292 - 20, 149 - 28, 6, 'paper3');
    // the dogs flank the door: the brown one stands, wagging, holding the leash, tapping a paw; the grey one sits and stares
    const bx = 204, by = 160;
    const bg = []; for (let yy = -7; yy <= 0; yy++) for (let xx = 2; xx <= 6; xx++) bg.push(getpx(g, bx + xx, by + yy));
    A.dog(g, bx, by, { t: t * 1.9074, coat: 'brown', pose: 'stand', seed: 2, rim: 3, shadow: false });
    if (Math.sin(t * 9 * Math.PI / 4) > 0.25) {      // tap: the near front paw lifts
      let k = 0; for (let yy = -7; yy <= 0; yy++) for (let xx = 2; xx <= 6; xx++) { if (xx >= 3 && xx <= 6 && yy >= -3) A.px(g, bx + xx, by + yy, bg[k]); k++; }
      A.rect(g, bx + 5, by - 6, 3, 2, 'fur2'); A.px(g, bx + 7, by - 5, 'fur3');
    }
    // the leash: from its mouth, swaying, down to a handle loop on the ground
    const sw = Math.round(Math.sin(t * 3 * Math.PI / 4) * 1.2);
    A.line(g, bx + 13, by - 14, bx + 15 + sw, by - 9, 'red4'); A.line(g, bx + 15 + sw, by - 9, bx + 16 + sw, by - 3, 'red3');
    A.ring(g, bx + 17 + sw, by - 2, 2, 'red4');
    A.dog(g, 254, 162, { t, coat: 'grey', pose: 'sit', look: 'up', seed: 7, facing: 'left', rim: 3, shadow: false });
    recolor(g, g.sn, 238, 135, 272, 164, A.lut('mix', 'night0', 0.22));
    // a faint breath of the brown dog in the cold
    for (let k = 0; k < 3; k++) { const ph = (t * 0.5 + k / 3) % 1; if (ph < 0.8) A.px(g, bx + 14 + ph * 6 + k, by - 17 - ph * 6, ph < 0.4 ? 'mist6' : 'mist4'); }

    // ---- the wet street: a mirror puddle under the dogs, long streaks under every light
    puddle(g, t, 232, 164, 48, 15);
    A.depth(g, 0.9);
    streak(g, t, KX, GY + 9, 40, 3, 3); streak(g, t, KX - 6, GY + 12, 30, 4, 1); streak(g, t, KX + 7, GY + 12, 30, 5, 1);
    A.depth(g, 1);
    streak(g, t, 107, 152, 28, 1, 2); streak(g, t, 59, 152, 20, 6, 1);
    fog(g, t, 152, 18, 0.16, -3, 8, 'mist4');
  };

  // a long broken reflection of a light on wet ground, painted in the amber ramp (never brown)
  function streak(g, t, x, y0, len, seed, w) {
    for (let k = 0; k < len; k++) {
      const f = 1 - k / len, wob = Math.round(Math.sin(k * 0.9 + t * 3 + seed) * (0.3 + k / len) * 1.2);
      if (H(Math.floor(k / 2) + seed * 37, Math.floor(t * 5 + seed)) >= 0.4 + f * 0.6) continue;
      A.rect(g, x + wob - (w >> 1), y0 + k, w, 1, f > 0.6 ? 'amber6' : f > 0.3 ? 'amber5' : 'amber4');
    }
  }

  // a flat puddle: mirrors what stands on its top edge (the dogs, the spill) into an ellipse
  function puddle(g, t, cx, y0, rx, h) {
    const tab = A.lut('mix', 'night1', 0.3), tab2 = A.lut('mix', 'night1', 0.5), buf = g.buf;
    cx += g.ox; y0 += g.oy;
    for (let r = 0; r < h; r++) {
      const e = (r + 0.5 - h / 2) / (h / 2), hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - e * e)) + (H(r, 3) - 0.5) * 3);
      const yy = y0 + r, sy = y0 - 1 - Math.floor(r * 0.9); if (yy < 0 || yy >= g.h || sy < 0) continue;
      const off = Math.round(Math.sin(r * 1.3 + t * 2.1) * 0.5);
      const rowOff = ((r + Math.floor(t * 3)) & 7) === 0;
      for (let xx = cx - hw; xx <= cx + hw; xx++) {
        if (xx < 0 || xx >= g.w) continue;
        const sx = Math.max(0, Math.min(g.w - 1, xx + off));
        buf[yy * g.w + xx] = (rowOff ? tab2 : tab)[buf[sy * g.w + sx]];
      }
    }
  }
  // the shared night grade, last: the deepest darks lift into the concept art's blue-grey haze (NRART.grade)
  { const draw = A.scenes.street; A.scenes.street = (g, t) => { draw(g, t); A.grade(g); }; }
})();
