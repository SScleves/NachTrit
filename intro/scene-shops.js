// Level intro scene "shops": a shopping street at night. The street runs away to the left into
// the fog (a canal, a mill and a spire stand in the gap); KAAS is big and close on the right,
// SLAGER and BAKKER step back into the haze. Cold blue facades, amber only in the windows and
// the lamp. A dead man in a bucket hat holds his phone out to the man in the orange jacket:
// "Tikkie?" The bakery cat watches. Key light: the butcher's window.
// Loops: phone pulse and lurch, flickering butcher's tube, dead neon OPEN, swinging signs,
// cat blink and stare, mill sails, mist, drizzle, glints on the wet road.
(function () {
  const A = window.NRART;
  const R = Math.round, S = Math.sin, hash = A.hash;
  const KERB = 158;                                   // kerb line: pavement above, wet road below
  const amberOf = f => f > 0.8 ? 'amber5' : f > 0.55 ? 'amber4' : 'amber3';

  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
  // ---- cheap local light: a dithered elliptical pool and a lamp cone, straight on the buffer
  function pool(g, cx, cy, rx, ry, color, st) {
    st = Math.round(st * 20) / 20;   // same 1/20 steps as the toolkit's levels(): a bounded, cached set of lookups
    const T = [0, 1, 2, 3].map(q => A.lut('add', color, st * q / 3)), buf = g.buf, gw = g.w;
    cx += g.ox + 0.5; cy += g.oy + 0.5;
    const x0 = Math.max(0, Math.floor(cx - rx)), x1 = Math.min(gw - 1, Math.ceil(cx + rx)), y0 = Math.max(0, Math.floor(cy - ry)), y1 = Math.min(g.h - 1, Math.ceil(cy + ry));
    for (let y = y0; y <= y1; y++) {
      const dy = (y + 0.5 - cy) / ry, dy2 = dy * dy; if (dy2 >= 1) continue;
      for (let x = x0; x <= x1; x++) {
        const dx = (x + 0.5 - cx) / rx, d2 = dx * dx + dy2; if (d2 >= 1) continue;
        const v = (1 - d2) * 3; let q = v | 0; if (v - q > BAY[((y & 3) << 2) | (x & 3)]) q++;
        if (q > 0) { const i = y * gw + x; buf[i] = T[q > 3 ? 3 : q][buf[i]]; }
      }
    }
  }
  function cone(g, x, y, len, spread, color, st) {
    st = Math.round(st * 20) / 20;   // same 1/20 steps as the toolkit's levels(): a bounded, cached set of lookups
    const T = [0, 1, 2, 3].map(q => A.lut('add', color, st * q / 3)), buf = g.buf, gw = g.w;
    x += g.ox; y += g.oy;
    for (let yy = Math.max(0, y); yy < Math.min(g.h, y + len); yy++) {
      const u = (yy - y) / len, half = 3 + (yy - y) * spread, x0 = Math.max(0, Math.floor(x - half)), x1 = Math.min(gw - 1, Math.ceil(x + half));
      for (let xx = x0; xx <= x1; xx++) {
        const e = 1 - Math.abs(xx + 0.5 - x) / half; if (e <= 0) continue;
        const v = (1 - u) * (e > 0.5 ? 1 : e * 2) * 3; let q = v | 0; if (v - q > BAY[((yy & 3) << 2) | (xx & 3)]) q++;
        if (q > 0) { const i = yy * gw + xx; buf[i] = T[q > 3 ? 3 : q][buf[i]]; }
      }
    }
  }
  // a street lantern: a single warm pane in a black frame, a cap on top
  function lantern(g, t, x, y, h, flick) {
    const dip = flick && hash(Math.floor(t * 9), 2) < flick, lit = dip ? 0.55 : 1;
    A.rect(g, x, y - h, 2, h, 'slate1'); A.rect(g, x - 1, y - 4, 4, 4, 'slate1'); A.hline(g, x - 1, y - 5, 4, 'slate2'); A.hline(g, x - 1, y - h + 1, 4, 'slate2');
    A.rect(g, x - 2, y - h - 8, 6, 8, 'slate1'); A.rect(g, x - 1, y - h - 7, 4, 6, dip ? 'amber5' : 'amber7'); A.rect(g, x, y - h - 6, 2, 4, dip ? 'amber6' : 'amber8');
    A.poly(g, [x - 3, y - h - 8, x + 5, y - h - 8, x + 3, y - h - 10, x - 1, y - h - 10], 'slate1'); A.rect(g, x, y - h - 12, 2, 2, 'slate1');
    pool(g, x + 1, y - h - 4, 15, 15, 'amber6', 0.55 * lit);
    cone(g, x + 1, y - h - 2, h + 4, 0.42, 'amber5', 0.3 * lit);
    pool(g, x + 1, y - 1, 26, 3, 'amber5', 0.35 * lit);
  }
  // the mill, plain and cheap: a tower, a cap, a gallery, four sails that turn anticlockwise
  function mill(g, t, x, y, s, ang, tone, sail) {
    const bh = R(46 * s), b0 = R(10 * s), b1 = R(5 * s), top = y - bh, st = A.step(tone, -1);
    A.poly(g, [x - b0, y, x + b0, y, x + b1, top, x - b1, top], tone);
    A.poly(g, [x - b0, y, x - R(b0 * 0.4), y, x - R(b1 * 0.4), top, x - b1, top], st);
    A.poly(g, [x - b1 - 1, top + 1, x + b1 + 1, top + 1, x + b1, top - R(5 * s), x - b1, top - R(5 * s)], st);
    const gy = y - R(15 * s), gw = b0 + R(8 * s); A.rect(g, x - gw, gy, 2 * gw, 2, st); A.line(g, x - gw, gy + 1, x - b0, y - 1, st); A.line(g, x + gw, gy + 1, x + b0, y - 1, st);
    A.rect(g, x - 1, y - R(28 * s), 2, 3, 'amber5'); A.rect(g, x + 3, y - R(36 * s), 2, 2, hash(Math.floor(t * 2), 5) < 0.1 ? 'amber3' : 'amber5');
    const hx = x, hy = top - R(2.5 * s), L = R(32 * s);
    for (let k = 0; k < 4; k++) {
      const a = ang + k * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a), px = -sa * 5 * s, py = ca * 5 * s;
      A.line(g, hx, hy, hx + ca * L, hy + sa * L, sail, 2);
      A.line(g, hx + ca * L * 0.3 + px, hy + sa * L * 0.3 + py, hx + ca * L + px, hy + sa * L + py, sail);
      A.line(g, hx + ca * L + px, hy + sa * L + py, hx + ca * L, hy + sa * L, sail);
      for (let i = 1; i < 4; i++) { const f = 0.3 + 0.7 * i / 4; A.line(g, hx + ca * L * f, hy + sa * L * f, hx + ca * L * f + px, hy + sa * L * f + py, sail); }
    }
    A.disc(g, hx, hy, 2, st);
  }
  // the courses of a brick wall: mortar lines and sparse joints written straight into the buffer;
  // a plain rect for the wall, row extents for the gable
  function bricks(g, x, y0, w, y1, pts, wall, seed, bw) {
    const mortar = A.col(A.step(wall, -1)), lite = A.col(A.step(wall, 1)), buf = g.buf, gw = g.w, gh = g.h, ox = g.ox, oy = g.oy;
    for (let y = y1 - 3, c = 0; y > y0; y -= 3, c++) {
      let xa = x, xb = x + w - 1;
      if (pts) { const xs = []; for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) { const yi = pts[i + 1], yj = pts[j + 1]; if ((yi <= y && yj > y) || (yj <= y && yi > y)) xs.push(pts[i] + (y - yi) / (yj - yi) * (pts[j] - pts[i])); } if (xs.length < 2) continue; xa = Math.ceil(Math.min(...xs)) + 1; xb = Math.floor(Math.max(...xs)) - 1; }
      const sy = y + oy; if (xb <= xa || sy < 1 || sy >= gh) continue;
      const row = sy * gw + ox, row1 = row - gw;
      for (let xx = Math.max(xa, -ox); xx <= xb && xx + ox < gw; xx++) buf[row + xx] = mortar;
      if (pts) continue;
      for (let jx = x + ((c & 1) ? (bw >> 1) : 0); jx < x + w; jx += bw) if (jx + ox >= 0 && jx + ox < gw && ((jx * 7 + c * 13 + seed) & 3) !== 0) { buf[row1 + jx] = mortar; buf[row1 - gw + jx] = mortar; }
      if ((c + seed) % 3 === 0) { const lx = xa + ((c * 31 + seed * 7) % Math.max(1, xb - xa)); if (lx + ox >= 0 && lx + ox < gw) buf[row1 + lx] = lite; }
    }
  }

  // ---- gable outlines: flat point lists, left side going up, then the right side coming down
  function outline(shape, cx, W, E, gh) {
    const h = W / 2;
    if (shape === 'step') {
      const n = 4, hw = k => h - k * (h - 3) / n, L = [cx - h, E];
      for (let k = 0; k < n; k++) { const y = E - gh * (k + 1) / n; L.push(cx - hw(k), y, cx - hw(k + 1), y); }
      const Rr = []; for (let i = L.length - 2; i >= 0; i -= 2) Rr.push(2 * cx - L[i] - 1, L[i + 1]);
      return L.concat(Rr);
    }
    let f;
    if (shape === 'bell') {
      const nw = W * 0.27;
      f = u => {
        if (u < 0.1) return h;
        if (u < 0.5) { const s = (u - 0.1) / 0.4; return h - (h - nw) * (1 - (1 - s) * (1 - s)); }
        if (u < 0.62) return nw + W * 0.05 * S(Math.PI * (u - 0.5) / 0.12);
        const s = (u - 0.62) / 0.38; return (nw + 0.6) * Math.sqrt(Math.max(0, 1 - s * s));
      };
    } else { // neck
      const nw = W * 0.27;
      f = u => {
        if (u < 0.34) { const s = u / 0.34; return nw + (h - nw) * (1 - s) * (1 - s); }
        if (u < 0.8) return nw;
        if (u < 0.86) return nw + 1.6;
        return (nw + 1.6) * (1 - (u - 0.86) / 0.14);
      };
    }
    const N = 14, L = [], Rr = [];
    for (let i = 0; i <= N; i++) { const u = i / N, y = E - gh * u, w2 = f(u); L.push(cx - w2, y); Rr.unshift(cx + w2 - 1, y); }
    for (let i = 0; i < Rr.length; i += 2) L.push(Rr[i], Rr[i + 1]);
    return L;
  }

  // ---- one window: frame, glass (lit by amber level or dark), bars, sill
  function win(g, x, y, w, h, lit, frame, o) {
    o = o || {};
    A.rect(g, x - 1, y - 1, w + 2, h + 2, frame);
    if (lit) {
      A.rect(g, x, y, w, h, amberOf(lit));
      A.rect(g, x, y, w, Math.max(1, h >> 2), lit > 0.8 ? 'amber4' : 'amber3');
      if (h > 6) A.ditherRect(g, x, y + (h >> 1), w, h - (h >> 1), null, lit > 0.8 ? 'amber6' : 'amber4', 0.4);
      if (o.curtain) { A.vline(g, x, y, h, 'amber3'); A.vline(g, x + w - 1, y, h, 'amber3'); }
    } else {
      A.rect(g, x, y, w, h, o.glass || 'night1');
      A.px(g, x + w - 1, y, 'night3'); if (h > 5) { A.px(g, x + w - 2, y + 1, 'night2'); A.px(g, x + w - 1, y + 1, 'night2'); }
    }
    if (w >= 5) A.vline(g, x + (w >> 1), y, h, o.bar || (lit ? 'wood2' : frame));
    if (h >= 7) A.hline(g, x, y + R(h * 0.38), w, o.bar || (lit ? 'wood2' : frame));
    if (o.sill !== false) A.hline(g, x - 2, y + h + 1, w + 4, o.sillc || frame);
  }

  // ---- the three little icons for the hanging signs
  function icon(g, kind, x, y) {
    if (kind === 'bread') {
      A.ellipse(g, x + 4, y + 4, 4, 3, 'wood5'); A.hline(g, x + 1, y + 2, 7, 'wood6'); A.hline(g, x + 1, y + 6, 7, 'wood4');
      A.line(g, x + 2, y + 3, x + 3, y + 5, 'amber7'); A.line(g, x + 4, y + 2, x + 5, y + 5, 'amber7'); A.line(g, x + 6, y + 3, x + 7, y + 5, 'amber7');
    } else if (kind === 'pig') {
      A.rect(g, x + 1, y + 1, 7, 6, 'red5'); A.rect(g, x, y + 2, 9, 4, 'red5');
      A.px(g, x, y, 'red4'); A.px(g, x + 1, y, 'red4'); A.px(g, x + 7, y, 'red4'); A.px(g, x + 8, y, 'red4');
      A.rect(g, x + 3, y + 4, 3, 2, 'red3'); A.px(g, x + 3, y + 5, 'night0'); A.px(g, x + 5, y + 5, 'night0');
      A.px(g, x + 2, y + 2, 'night0'); A.px(g, x + 6, y + 2, 'night0');
    } else {
      A.poly(g, [x, y + 8, x + 10, y + 8, x + 10, y + 2], 'cheese4');
      A.hline(g, x, y + 8, 11, 'cheese3'); A.line(g, x, y + 8, x + 10, y + 2, 'cheese5');
      A.px(g, x + 6, y + 6, 'cheese2'); A.px(g, x + 8, y + 4, 'cheese2'); A.px(g, x + 3, y + 7, 'cheese2');
    }
  }
  function hanging(g, t, kind, bx, y, i, s) {
    const sw = Math.round(S(t * 1.5 + i * 1.9) * 1.1), L = R(10 * s) + 2, H = R(9 * s) + 3;
    A.hline(g, bx - L - 2, y, L + 3, 'slate2'); A.px(g, bx - L - 2, y + 1, 'slate2'); A.px(g, bx, y + 1, 'slate2');
    A.vline(g, bx - L + 1 + sw, y + 1, 3, 'slate2'); A.vline(g, bx - 2 + sw, y + 1, 3, 'slate2');
    const sx = bx - L + sw, sy = y + 4;
    A.rect(g, sx, sy, L, H, 'wood2'); A.rect(g, sx + 1, sy + 1, L - 2, H - 2, 'wood0');
    icon(g, kind, sx + ((L - (kind === 'cheese' ? 11 : 9)) >> 1) + 1, sy + 1 + ((H - 10) >> 1) + (kind === 'cheese' ? 0 : 1));
  }

  // ---- a canal house front: wall, gable, upper windows; returns the geometry of the shop below
  function house(g, t, o) {
    const { x, w, base, s, shape, wall, trim, seed } = o;
    const gf = R(48 * s), fh = R(23 * s), nF = 2, gh = R(o.gh * s);
    const E = base - gf - nF * fh, cx = x + (w >> 1), apex = E - gh;
    const ol = outline(shape, cx, w, E, gh);
    A.rect(g, x, E, w, base - E, wall); A.poly(g, ol, wall);
    bricks(g, x, E, w, base, null, wall, seed, s > 0.9 ? 5 : 4); bricks(g, x, apex, w, E, ol, wall, seed + 3, 4);
    // coping along the gable, cornice on the eaves, string courses between floors
    for (let i = 0; i + 3 < ol.length; i += 2) A.line(g, ol[i], ol[i + 1], ol[i + 2], ol[i + 3], trim);
    A.rect(g, x - 1, E, w + 2, 2, trim); A.hline(g, x - 1, E + 2, w + 2, 'slate1');
    for (let f = 1; f < nF; f++) A.hline(g, x, base - gf - f * fh, w, 'slate3');
    A.hline(g, x, base - gf, w, 'slate4');
    // windows: tall, two per floor
    const ww = Math.max(4, R(6 * s)), wh = R(11 * s), cols = 2, gap = R((w - cols * ww) / (cols + 1));
    for (let f = 0; f < nF; f++) for (let c = 0; c < cols; c++) {
      const lit = o.lit[f] ? o.lit[f][c] || 0 : 0;
      win(g, x + gap + c * (ww + gap), base - gf - (f + 1) * fh + R(5 * s), ww, wh, lit, trim, { curtain: lit && hash(seed, f * 3 + c) < 0.5, sillc: o.sillc || 'slate2', glass: o.glass });
    }
    // the attic window in the gable (a little loft light, or none)
    const aw = Math.max(3, R(4 * s)), ah = Math.max(4, R(6 * s));
    win(g, cx - (aw >> 1), E - R(gh * 0.52), aw, ah, o.attic || 0, trim, { sill: false, glass: o.glass });
    // the hoist beam at the top of the gable, with a hook
    const hy = apex + (shape === 'bell' ? 1 : 3);
    A.rect(g, cx - 1, hy, R(6 * s) + 2, 2, 'wood2'); A.hline(g, cx - 1, hy, R(6 * s) + 2, 'wood3'); A.px(g, cx + R(6 * s), hy + 2, 'slate3'); A.vline(g, cx + R(6 * s), hy + 3, 2, 'slate3');
    if (shape === 'bell') A.px(g, cx - 1, apex - 1, trim);
    return { top: base - gf, E, apex, cx };
  }

  // ---- the shop front under the house: fascia board, awning, window, door
  function shopfront(g, t, o) {
    const { x, w, base, s, top } = o, sn = o.name;
    const fy = top + 2, fh = R(8 * s) + 1, ay = fy + fh + 1, ah = R(5 * s) + 1;
    // fascia board with its painted name
    A.rect(g, x + 4, fy, w - 8, fh, o.board); A.hline(g, x + 4, fy, w - 8, o.edge); A.hline(g, x + 4, fy + fh - 1, w - 8, o.edge);
    A.vline(g, x + 4, fy, fh, o.edge); A.vline(g, x + w - 5, fy, fh, o.edge);
    A.text(x + (w >> 1) + (o.textDx || 0) + 0.5, fy + fh - 2.2, sn, o.ink, o.size, true, { align: 'center' });
    // the window
    const ww = o.winW, wx = o.winX, wy = ay + ah + 1, riser = R(7 * s), wh = base - riser - wy;
    A.rect(g, wx - 2, wy - 1, ww + 4, wh + 3, 'wood1');
    A.rect(g, wx, wy, ww, wh, o.glassC || 'amber5');
    const lit = o.lit == null ? 1 : o.lit;
    if (lit < 1) A.rect(g, wx, wy, ww, wh, amberOf(lit));
    if (o.glassC) A.ditherGradient(g, wx, wy + 3, ww, wh - 3, o.glassC, o.glassC2, 'down');
    A.rect(g, wx, wy, ww, 3, lit < 1 ? amberOf(lit * 0.8) : 'amber6'); if (!o.glassC) A.ditherRect(g, wx, wy + wh - 5, ww, 5, null, 'amber4', 0.35);
    // under-awning shade, soft
    A.ditherGradient(g, wx, wy, ww, 5, null, 'night0', 'up');
    o.content(g, t, wx, wy, ww, wh);
    A.rect(g, wx - 3, wy + wh + 1, ww + 6, 2, 'slate3'); A.hline(g, wx - 3, wy + wh + 1, ww + 6, 'slate5');
    A.rect(g, x + 3, base - riser + 3, w - 6, riser - 3, 'night1');
    A.rect(g, wx - 2, base - riser + 2, ww + 4, 1, 'slate2');
    // awning
    const ax = wx - 3, aw = ww + 6;
    for (let k = 0; k < aw; k += 4) A.rect(g, ax + k, ay, Math.min(4, aw - k), ah + 1, ((k >> 2) & 1) ? o.aw[1] : o.aw[0]);
    A.hline(g, ax, ay, aw, 'slate4'); A.hline(g, ax, ay + 1, aw, 'slate2');
    // the door and a kerb step
    const dx = o.doorX, dw = o.doorW, dy = ay + 1;
    A.rect(g, dx - 1, dy - 1, dw + 2, base - dy + 1, 'wood1');
    A.rect(g, dx, dy + 3, dw, base - dy - 3, o.door);
    A.rect(g, dx, dy, dw, 3, o.fan || 'night1'); A.vline(g, dx + (dw >> 1), dy, 3, 'wood1');
    A.px(g, dx + dw - 2, dy + R((base - dy) * 0.55), 'cheese3');
    A.hline(g, dx - 2, base, dw + 4, 'slate4');
  }

  // ---- 3x5 neon letters for the dead OPEN sign
  const GLYPH = { O: ['111', '101', '101', '101', '111'], P: ['111', '101', '111', '100', '100'], E: ['111', '100', '111', '100', '111'], N: ['101', '111', '111', '111', '101'] };
  function neon(g, t, x, y) {
    A.rect(g, x - 2, y - 2, 19, 9, 'night0'); A.hline(g, x - 2, y - 2, 19, 'slate2'); A.hline(g, x - 2, y + 6, 19, 'slate2');
    A.vline(g, x - 2, y - 2, 9, 'slate2'); A.vline(g, x + 16, y - 2, 9, 'slate2');
    'OPEN'.split('').forEach((ch, i) => {
      // O is long dead, P hums to life now and then, E is dead, N stutters
      const on = i === 1 ? hash(Math.floor(t * 8), 4) < 0.18 && ((t * 0.5) % 4) < 1.1 : i === 3 ? hash(Math.floor(t * 11), 9) < 0.3 && ((t * 0.5 + 2) % 5) < 1.6 : false;
      const c = on ? 'red5' : 'red1';
      GLYPH[ch].forEach((row, r) => { for (let q = 0; q < 3; q++) if (row[q] === '1') A.px(g, x + i * 4 + q, y + r, c); });
    });
  }

  // ---- shop window contents
  function bakery(g, t, wx, wy, ww, wh) {
    const sy = wy + wh - 6;
    A.rect(g, wx, sy + 3, ww, 1, 'wood3');
    for (let k = 0; k < 4; k++) { const bx = wx + 2 + k * 5; A.ellipse(g, bx + 2, sy + 1, 2, 2, 'wood5'); A.hline(g, bx + 1, sy, 3, 'amber7'); A.px(g, bx + 2, sy + 1, 'wood3'); }
    A.rect(g, wx + 1, sy - 4, 4, 2, 'wood4'); A.px(g, wx + 2, sy - 5, 'wood5');
    A.hline(g, wx, wy + 4, ww, 'wood2');
    // the cat on the sill, watching the street; it blinks and every few seconds looks away
    const cx = wx + ww - 7, cy = sy + 3;
    A.rect(g, cx, cy - 5, 5, 5, 'night0'); A.rect(g, cx + 1, cy - 7, 3, 2, 'night0'); A.px(g, cx + 1, cy - 8, 'night0'); A.px(g, cx + 3, cy - 8, 'night0');
    A.px(g, cx - 1, cy - 1, 'night0'); A.px(g, cx - 2, cy - 2, 'night0'); A.px(g, cx - 2, cy - 3, 'night0');
    const blink = ((t + 1.3) % 4.2) < 0.18, away = ((t + 0.5) % 7) > 5.6;
    if (!blink) { A.px(g, cx + (away ? 0 : 1), cy - 6, 'eye4'); A.px(g, cx + (away ? 2 : 3), cy - 6, 'eye3'); }
  }
  function butcher(g, t, wx, wy, ww, wh) {
    A.hline(g, wx, wy + 3, ww, 'steel3');
    for (let k = 0; k < 6; k++) {
      const hx = wx + 3 + k * 6; A.vline(g, hx, wy + 3, 2, 'steel2');
      if (k & 1) { A.rect(g, hx - 1, wy + 5, 3, 6, 'red3'); A.px(g, hx - 1, wy + 5, 'red5'); A.px(g, hx, wy + 11, 'red2'); }
      else { A.rect(g, hx - 1, wy + 5, 3, 3, 'red4'); A.rect(g, hx - 1, wy + 8, 3, 2, 'red2'); A.px(g, hx, wy + 5, 'paper3'); }
    }
    A.rect(g, wx, wy + wh - 4, ww, 4, 'paper2'); A.hline(g, wx, wy + wh - 4, ww, 'paper4');
    for (let k = 0; k < 4; k++) { A.ellipse(g, wx + 5 + k * 8, wy + wh - 5, 3, 1, 'red3'); A.px(g, wx + 4 + k * 8, wy + wh - 6, 'red5'); }
  }
  function cheese(g, t, wx, wy, ww, wh) {
    for (let r = 0; r < 2; r++) for (let k = 0; k < 4 - r; k++) {
      const cx = wx + 3 + r * 4 + k * 9, cy = wy + wh - 5 - r * 4;
      A.rect(g, cx, cy, 8, 4, 'cheese4'); A.hline(g, cx, cy, 8, 'cheese6'); A.hline(g, cx, cy + 3, 8, 'cheese2'); A.vline(g, cx + 7, cy + 1, 3, 'cheese3'); A.px(g, cx + 3, cy + 1, 'cheese2'); A.px(g, cx + 5, cy + 2, 'cheese3');
    }
    A.poly(g, [wx + ww - 14, wy + wh - 1, wx + ww - 3, wy + wh - 1, wx + ww - 3, wy + wh - 9], 'cheese4'); A.px(g, wx + ww - 7, wy + wh - 4, 'cheese2'); A.hline(g, wx + ww - 14, wy + wh - 1, 12, 'cheese3');
    A.hline(g, wx, wy + wh - 1, ww, 'wood2');
    neon(g, t, wx + ww - 22, wy + 3);
  }

  // ---- far skyline: dark roofs with a chimney or two
  function farRoofs(g, tone) {
    [[-22, 40, 12, 'gab'], [14, 26, 15, 'stp'], [-4, 30, 9, 'gab'], [52, 32, 12, 'gab'], [84, 20, 18, 'stp'], [248, 30, 10, 'gab'], [300, 36, 14, 'gab']].forEach(([x, w, h, k], i) => {
      const y = 130;
      A.rect(g, x, y - h, w, h, tone);
      if (k === 'gab') A.poly(g, [x - 1, y - h, x + w / 2, y - h - R(w * 0.42), x + w + 1, y - h], tone);
      else { A.rect(g, x + 3, y - h - 3, w - 6, 3, tone); A.rect(g, x + 7, y - h - 6, w - 14, 3, tone); }
      A.rect(g, x + R(w * 0.7), y - h - R(w * 0.3) - 3, 2, 4, tone);
      if (hash(i, 77) < 0.6) A.px(g, x + 5 + R(hash(i, 5) * (w - 10)), y - h + 4, 'amber4');
    });
  }

  // a light's slick on the wet road: a broken column that fades and wobbles with the water
  function slick(g, t, x, w, len, color, st, seed) {
    for (let r = 0; r < len; r++) {
      if (hash(r + seed * 17, Math.floor(t * 3) + seed) < 0.22 + 0.2 * r / len) continue;
      const jit = Math.round(S(r * 0.8 + t * 2.2 + seed) * (0.4 + r / len * 1.6)), f = 1 - r / len;
      A.ditherRect(g, x + jit + (r >> 3), KERB + 2 + r, w - (r >> 2), 1, null, color, st * f * (0.6 + 0.4 * f));
    }
  }
  // a cheese cart: two wheels, a bed, three rows of wheels that glow
  function cart(g, x, y) {
    const x0 = x - 14;
    A.ring(g, x0 + 5, y - 4, 3, 'wood1'); A.ring(g, x0 + 23, y - 4, 3, 'wood1');
    A.rect(g, x0, y - 9, 29, 3, 'wood3'); A.hline(g, x0, y - 9, 29, 'wood4'); A.line(g, x0 + 28, y - 8, x0 + 36, y - 4, 'wood2');
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - r; i++) {
      const cx = x0 + 2 + r * 3 + i * 7, cy = y - 12 - r * 4;
      A.rect(g, cx, cy, 6, 3, 'cheese4'); A.hline(g, cx, cy, 6, 'cheese6'); A.hline(g, cx, cy + 2, 6, 'cheese2'); A.px(g, cx + 3, cy + 1, 'cheese3');
    }
    pool(g, x, y - 14, 22, 12, 'cheese4', 0.2);
  }

  // ---- a far arch over the canal with one dead walker on it, dark against the pale fog
  function farBridge(g, t, x, y, w) {
    A.rect(g, x, y - 7, w, 3, 'night3'); A.hline(g, x, y - 7, w, 'night4'); A.rect(g, x, y - 10, w, 1, 'night3');
    for (let i = 0; i <= w; i += 4) A.vline(g, x + i, y - 10, 3, 'night3');
    for (const cx of [x + (w >> 2), x + (w >> 1), x + w - (w >> 2)]) { A.rect(g, cx - 5, y - 4, 11, 4, 'night3'); A.rect(g, cx - 3, y - 4, 7, 4, 'night4'); }
    const wx = x + 8 + ((t * 2.2) % (w - 16));
    A.rect(g, wx, y - 18, 2, 8, 'night2'); A.px(g, wx + 1, y - 19, 'night2'); A.px(g, wx + 1, y - 18, 'eye3'); A.px(g, wx - 1, y - 14, 'night2');
  }

  A.scenes.shops = (g, t) => {
    A.camera(g, t, { x: 6, period: 8 }); A.key(g, 196, 132, 1);
    // ================= layer 0: the sky, flat grey-blue haze, palest at the horizon
    A.depth(g, 0);
    const bands = [[-10, 'night1'], [10, 'night2'], [34, 'night3'], [60, 'mist0'], [84, 'mist1'], [106, 'mist2'], [124, 'mist3']];
    bands.forEach(([y, c], k) => { const y2 = k + 1 < bands.length ? bands[k + 1][0] : 134; A.rect(g, -20, y, k < 3 ? 360 : 190, y2 - y + 1, c); });
    for (let k = 1; k < bands.length; k++) A.ditherGradient(g, -20, bands[k][0] - 2, k < 3 ? 360 : 190, 4, bands[k - 1][1], bands[k][1], 'down');
    A.stars(g, t, { n: 14, seed: 3, y1: 36 });
    // ================= layer 1: the far bank, the mill, the spire: dark shapes in the fog
    A.depth(g, 0.18);
    farRoofs(g, 'night3');
    A.tree(g, 4, 130, 0.9, { tone: 'night3', seed: 4, t }); A.tree(g, 118, 130, 0.8, { tone: 'night3', seed: 6, t });
    A.church(g, 82, 130, 0.9, { tone: 'night3', clock: false });
    mill(g, t, 36, 130, 0.9, -t * 0.45, 'night3', 'night2');
    A.mist(g, t, 120, 14, { amount: 0.4, speed: 3, seed: 9, color: 'mist3' });
    A.depth(g, 0.3);
    farBridge(g, t, 8, 135, 56);
    // the canal mirrors the sky, the mill and the bridge
    A.depth(g, 0.4);
    A.water(g, -20, 135, 128, 12, { t, amp: 0.8, dark: 0.4, color: 'night3', gaps: 0.2, glints: 5, stretch: 1.2 });
    A.boat(g, 66, 146, { kind: 'sloep', len: 26, tone: 'slate4', t });
    // ================= layer 2: the shops, far to near, each a step darker and bluer
    // BAKKER (far): a klokgevel, one lit window in the flat above
    A.depth(g, 0.62);
    const bk = house(g, t, { x: 98, w: 56, base: 144, s: 0.74, shape: 'bell', gh: 34, wall: 'night5', trim: 'mist2', glass: 'night3', sillc: 'mist1', seed: 11, lit: [[0, 0.7], [0, 0]], attic: 0 });
    shopfront(g, t, { x: 98, w: 56, base: 144, s: 0.74, top: bk.top, name: 'BAKKER', board: 'green1', edge: 'slate4', ink: 'amber4', size: 5.5,
      aw: ['green2', 'slate4'], winX: 120, winW: 24, doorX: 104, doorW: 10, door: 'night2', fan: 'amber3', content: bakery });
    // SLAGER (mid): a trapgevel, a dying tube in the window
    A.depth(g, 0.74);
    const flick = hash(Math.floor(t * 9), 21) < 0.1 ? 0.5 : (hash(Math.floor(t * 3), 22) < 0.08 ? 0.7 : 1);
    const sl = house(g, t, { x: 154, w: 62, base: 148, s: 0.86, shape: 'step', gh: 26, wall: 'night4', trim: 'mist1', glass: 'night2', seed: 31, lit: [[0, 0], [0, 0.8]], attic: 0 });
    shopfront(g, t, { x: 154, w: 62, base: 148, s: 0.86, top: sl.top, name: 'SLAGER', board: 'red1', edge: 'slate3', ink: 'paper3', size: 5, textDx: 9,
      aw: ['night3', 'paper1'], winX: 185, winW: 26, doorX: 159, doorW: 11, door: 'night1', fan: 'night1', lit: flick, content: butcher });
    // the sliver of a neighbour between SLAGER and KAAS, in shadow
    A.depth(g, 0.82);
    A.rect(g, 216, 74, 22, 76, 'night2'); A.poly(g, [215, 74, 227, 58, 239, 74], 'night2'); bricks(g, 216, 60, 22, 150, null, 'night2', 5, 3);
    win(g, 220, 86, 4, 8, 0, 'slate3'); win(g, 229, 86, 4, 8, 0, 'slate3'); win(g, 224, 108, 4, 8, 0.55, 'slate3');
    A.hline(g, 215, 74, 24, 'slate3');
    // KAAS (near, big): a halsgevel
    A.depth(g, 0.92);
    const ka = house(g, t, { x: 238, w: 80, base: 153, s: 1, shape: 'neck', gh: 34, wall: 'night2', trim: 'slate4', seed: 51, lit: [[0.85, 0], [0, 0]], attic: 0.6 });
    shopfront(g, t, { x: 238, w: 80, base: 153, s: 1, top: ka.top, name: 'KAAS', board: 'night1', edge: 'slate3', ink: 'cheese3', size: 8,
      aw: ['night4', 'paper1'], winX: 246, winW: 44, doorX: 299, doorW: 12, door: 'night1', fan: 'amber3', glassC: 'amber3', glassC2: 'amber5', content: cheese });
    // the right-hand neighbour, cropped by the frame
    A.rect(g, 318, 82, 30, 72, 'night2'); A.poly(g, [317, 82, 333, 62, 349, 82], 'night2'); bricks(g, 318, 64, 30, 154, null, 'night2', 8, 4);
    win(g, 324, 98, 6, 10, 0, 'slate3'); win(g, 324, 122, 6, 10, 0.5, 'slate3');
    // hanging signs on their brackets (a loaf, a pig, a cheese)
    A.depth(g, 0.62); hanging(g, t, 'bread', 114, 98, 0, 0.74);
    A.depth(g, 0.74); hanging(g, t, 'pig', 215, 104, 1, 0.86);
    A.depth(g, 0.92); hanging(g, t, 'cheese', 241, 98, 2, 1);

    // ================= layer 3: pavement, kerb, wet road
    A.depth(g, 1);
    A.rect(g, -20, 146, 380, KERB - 146, 'slate2'); A.rect(g, -20, 146, 380, 2, 'slate3'); A.ditherGradient(g, -20, 148, 380, 3, 'slate3', 'slate2', 'down');
    for (let k = 0; k < 40; k++) A.px(g, ((k * 41) % 380) - 20, 149 + ((k * 13) % 8), k & 1 ? 'slate4' : 'slate1');
    A.hline(g, -20, KERB - 1, 380, 'slate5'); A.hline(g, -20, KERB, 380, 'slate1');
    // the quay of the canal on the left, a low rail
    A.hline(g, -20, 146, 120, 'slate4'); A.fence(g, -20, 148, 30, 4, { tone: 'slate1', gap: 4 });
    // warm pools thrown on the pavement by the windows
    pool(g, 133, 144, 24, 8, 'amber4', 0.3); pool(g, 198, 146, 30, 9, 'amber4', 0.36); pool(g, 266, 152, 40, 8, 'amber4', 0.3);
    // the lantern between SLAGER and KAAS
    lantern(g, t, 228, KERB - 1, 50, 0.08);
    // far lamps along the canal, just dots in the fog
    [[48, 142], [86, 142]].forEach(([lx, ly]) => { A.vline(g, lx, ly - 14, 14, 'night5'); A.rect(g, lx - 1, ly - 17, 3, 3, 'amber6'); pool(g, lx, ly - 15, 7, 7, 'amber5', 0.5); });
    A.bollard(g, 62, 151); A.bollard(g, 100, 151);
    // the cheese cart at the kerb, below the KAAS window
    cart(g, 268, KERB + 8);

    // ================= the beat: the hero, his dogs, the dead man asking for his Tikkie
    A.omafiets(g, 30, 155, { facing: 'right', rider: false, basket: 'book', t });
    A.dog(g, 94, 155, { coat: 'brown', pose: 'sit', look: 'up', facing: 'right', t, seed: 3 });
    A.dog(g, 76, 155, { coat: 'golden', pose: 'lie', facing: 'right', t, seed: 5 });
    A.man(g, 114, 155, { facing: 'right', pose: 'stand', face: 'deadpan', t, seed: 2 });
    // the zombie lurches in and out of his hunch
    const lurch = 0.4 + 0.1 * S(t * 0.9) + 0.06 * S(t * 2.3);
    const zx = 188 + Math.round(S(t * 0.9 - 0.4) * 1.2);
    const z = A.zombie(g, zx, 155, { t, seed: 7, variant: 'hat', phone: true, facing: 'left', hunch: lurch, height: 52, glow: 0.4 });
    // his arm held out and the phone: the one bright cool thing in the frame
    const pulse = 0.5 + 0.5 * S(t * 3.4);
    const hx = z.hand[0], hy = z.hand[1];
    const px0 = hx - 24, py0 = hy - 2;
    A.line(g, hx - 2, hy - 1, px0 + 6, py0 + 3, 'zombie5', 2); A.line(g, hx - 6, hy - 2, px0 + 6, py0 + 3, 'zombie4', 1);
    A.rect(g, px0, py0 - 4, 7, 11, 'slate0'); A.rect(g, px0 + 1, py0 - 3, 5, 9, pulse > 0.5 ? 'phone4' : 'phone3');
    A.hline(g, px0 + 1, py0 - 3, 5, 'phone5'); A.rect(g, px0 + 1, py0 + 2, 5, 1, 'phone2'); A.rect(g, px0 + 2, py0, 3, 1, 'phone5');
    A.rect(g, px0 + 5, py0 + 3, 3, 3, 'zombie6'); A.px(g, px0 + 5, py0 + 6, 'zombie5');
    pool(g, px0 + 3, py0, 10, 10, 'phone4', 0.14 + 0.12 * pulse);
    A.px(g, z.head[0] - 5, z.head[1] + 4, 'phone2'); A.px(g, z.head[0] - 4, z.head[1] + 5, 'phone2');

    // ================= the wet street: it mirrors everything above, with gold streaks under the lights
    A.water(g, -20, KERB + 1, 380, 22, { t, amp: 0.5, dark: 0.5, color: 'slate1', gaps: 0.3, glints: 6, stretch: 0.85 });
    slick(g, t, 122, 22, 18, 'amber5', 0.75, 1); slick(g, t, 187, 22, 22, 'amber6', 0.85, 2); slick(g, t, 248, 40, 24, 'amber6', 0.85, 3);
    slick(g, t, 226, 5, 24, 'amber7', 0.95, 4); slick(g, t, 254, 30, 18, 'cheese5', 0.55, 5);
    slick(g, t, px0 + 1, 5, 14, 'phone4', 0.35 + 0.35 * pulse, 6);
    for (let k = -20, i = 0; k < 340; k += 26, i++) A.hline(g, k, 172, 10 + (k > 0 ? R(k / 60) : 0), 'mist2');
    A.rect(g, -20, 178, 380, 2, 'night0');
    // low ground mist, drizzle
    A.rain(g, t, { n: 22, len: 5, speed: 120, slant: 0.2, color: 'mist3', far: 'mist1', h: 160, splash: KERB + 4, seed: 6 });
    // reeds frame the left foreground
    A.reeds(g, -14, 154, 26, 30, { t, seed: 3, tone: 'night2', dense: 0.7 });
    // ---- the joke: one bubble above the dead man's hat, clear of the lamp
    A.say(g, z.head[0], z.head[1] - 5, 'Tikkie?', { dx: -4 });
  };
  // the shared night grade, last: the deepest darks lift into the concept art's blue-grey haze (NRART.grade)
  { const draw = A.scenes.shops; A.scenes.shops = (g, t) => { draw(g, t); A.grade(g); }; }
})();
