/* Nachtrit world map art: window.NRMAP
 *
 * A classic script, loaded before the module (like fares.js). It paints the map screen as a
 * night diorama after reference/F-map-concept.png: the country as a raised slab of dark slate
 * in dark water, dressed with silhouettes, each town a small lit vignette built from its
 * landmarks. Canvas 2D, painted once per size and progress state, then cached.
 *
 * index.html calls:
 *   NRMAP.layout(W, H, box, towns, f)  -> { sc, P, nodes }  projection + town spots in px
 *   NRMAP.paint(canvas, lay, towns, states)  paints the static diorama (cached by key)
 *   NRMAP.badge(t, i, state, cur, f), NRMAP.cyclist(f), NRMAP.lamps(path, step)
 * states[i]: 'locked' | 'open' | 'saved'. Saved towns burn brightest: their windows light up.
 */
(function () {
  'use strict';
  const NRMAP = window.NRMAP = {};

  // ---------------------------------------------------------------- geography (lon, lat)
  // Traced from the real coast and borders, simplified. Clockwise from Hoek van Holland.
  const MAINLAND = [
    [4.12, 51.98], [4.2, 52.05], [4.27, 52.11], [4.33, 52.16], [4.4, 52.22], [4.45, 52.28], [4.5, 52.35], [4.53, 52.41], [4.57, 52.46],
    [4.6, 52.55], [4.62, 52.62], [4.64, 52.69], [4.67, 52.76], [4.7, 52.86], [4.72, 52.93], [4.76, 52.97], [4.8, 52.96], [4.86, 52.92],
    [4.94, 52.92], [5.02, 52.95], [5.08, 52.97], [5.16, 53.01], [5.25, 53.06], [5.34, 53.09], [5.4, 53.13], [5.41, 53.18], [5.44, 53.24],
    [5.52, 53.3], [5.62, 53.33], [5.75, 53.36], [5.9, 53.38], [6.05, 53.39], [6.2, 53.4], [6.32, 53.4], [6.45, 53.42], [6.6, 53.44],
    [6.72, 53.45], [6.83, 53.44], [6.9, 53.38], [6.95, 53.32], [7.05, 53.3], [7.12, 53.25], [7.2, 53.24], [7.21, 53.15], [7.2, 53.05],
    [7.2, 52.98], [7.1, 52.88], [7.05, 52.78], [7.05, 52.65], [6.9, 52.64], [6.73, 52.63], [6.7, 52.56], [6.75, 52.48], [6.98, 52.45],
    [7.05, 52.36], [7.06, 52.24], [6.98, 52.2], [6.86, 52.12], [6.75, 52.05], [6.72, 51.97], [6.6, 51.9], [6.42, 51.83], [6.25, 51.86],
    [6.1, 51.85], [5.97, 51.81], [5.96, 51.74], [6.03, 51.68], [6.1, 51.62], [6.18, 51.53], [6.22, 51.45], [6.22, 51.36], [6.17, 51.3],
    [6.08, 51.23], [6.08, 51.17], [5.97, 51.1], [5.88, 51.05], [5.95, 51.02], [6.06, 50.93], [6.05, 50.85], [6.03, 50.77], [5.9, 50.75],
    [5.78, 50.76], [5.67, 50.76], [5.63, 50.82], [5.67, 50.9], [5.72, 50.97], [5.76, 51.05], [5.82, 51.15], [5.7, 51.2], [5.56, 51.22],
    [5.48, 51.29], [5.33, 51.27], [5.22, 51.27], [5.12, 51.33], [5.08, 51.4], [5.02, 51.47], [4.92, 51.43], [4.83, 51.43], [4.78, 51.5],
    [4.67, 51.44], [4.55, 51.43], [4.43, 51.45], [4.38, 51.4], [4.3, 51.38], [4.29, 51.45], [4.3, 51.52], [4.27, 51.58], [4.3, 51.62],
    [4.38, 51.64], [4.48, 51.67], [4.58, 51.69], [4.66, 51.7], [4.72, 51.72], [4.66, 51.74], [4.56, 51.73], [4.46, 51.73], [4.36, 51.75],
    [4.26, 51.78], [4.16, 51.81], [4.08, 51.84], [4.03, 51.88], [4.0, 51.93], [4.05, 51.96],
  ];
  const ISLANDS = [
    // Zeeuws-Vlaanderen
    [[3.36, 51.37], [3.4, 51.31], [3.52, 51.28], [3.62, 51.28], [3.76, 51.26], [3.86, 51.21], [3.98, 51.22], [4.1, 51.26], [4.2, 51.3],
      [4.24, 51.36], [4.16, 51.38], [4.05, 51.39], [3.95, 51.39], [3.84, 51.38], [3.74, 51.35], [3.62, 51.38], [3.5, 51.4], [3.42, 51.39]],
    // Walcheren and Zuid-Beveland
    [[3.44, 51.54], [3.46, 51.49], [3.53, 51.45], [3.6, 51.44], [3.7, 51.45], [3.8, 51.42], [3.92, 51.41], [4.02, 51.42], [4.12, 51.41],
      [4.2, 51.43], [4.2, 51.47], [4.1, 51.5], [4.0, 51.53], [3.9, 51.55], [3.8, 51.53], [3.7, 51.56], [3.6, 51.59], [3.5, 51.58]],
    // Noord-Beveland
    [[3.66, 51.6], [3.78, 51.58], [3.9, 51.56], [3.96, 51.59], [3.86, 51.62], [3.72, 51.63]],
    // Schouwen-Duiveland
    [[3.68, 51.7], [3.74, 51.66], [3.88, 51.64], [4.04, 51.62], [4.1, 51.66], [4.02, 51.71], [3.88, 51.74], [3.74, 51.74]],
    // Tholen
    [[4.04, 51.55], [4.17, 51.52], [4.25, 51.56], [4.2, 51.63], [4.08, 51.62]],
    // Goeree-Overflakkee
    [[3.84, 51.82], [3.93, 51.79], [4.03, 51.75], [4.13, 51.7], [4.25, 51.66], [4.37, 51.64], [4.44, 51.66], [4.4, 51.7], [4.3, 51.73],
      [4.2, 51.77], [4.1, 51.8], [4.0, 51.84], [3.9, 51.85]],
    // the Wadden: Texel, Vlieland, Terschelling, Ameland, Schiermonnikoog
    [[4.72, 53.0], [4.78, 52.99], [4.86, 53.03], [4.92, 53.1], [4.92, 53.16], [4.87, 53.19], [4.82, 53.16], [4.76, 53.1], [4.71, 53.04]],
    [[4.92, 53.24], [5.02, 53.27], [5.12, 53.3], [5.11, 53.33], [5.0, 53.3], [4.9, 53.27]],
    [[5.16, 53.36], [5.3, 53.38], [5.45, 53.41], [5.6, 53.45], [5.58, 53.47], [5.42, 53.44], [5.26, 53.41], [5.15, 53.39]],
    [[5.63, 53.45], [5.78, 53.45], [5.92, 53.47], [5.88, 53.5], [5.72, 53.49], [5.62, 53.47]],
    [[6.1, 53.47], [6.22, 53.46], [6.33, 53.48], [6.25, 53.51], [6.12, 53.5]],
  ];
  const IJSSELMEER = [[5.06, 52.92], [5.1, 52.84], [5.13, 52.77], [5.22, 52.74], [5.3, 52.7], [5.18, 52.66], [5.07, 52.63], [5.08, 52.55],
    [5.06, 52.48], [5.04, 52.42], [5.03, 52.38], [5.12, 52.34], [5.25, 52.31], [5.42, 52.27], [5.56, 52.33], [5.7, 52.42], [5.85, 52.51],
    [5.9, 52.58], [5.78, 52.62], [5.64, 52.62], [5.58, 52.66], [5.6, 52.74], [5.7, 52.84], [5.55, 52.84], [5.38, 52.88], [5.42, 52.98],
    [5.37, 53.05], [5.25, 53.02], [5.13, 52.97]];
  const FLEVOLAND = [[5.13, 52.38], [5.22, 52.35], [5.35, 52.32], [5.5, 52.32], [5.63, 52.38], [5.78, 52.48], [5.82, 52.56], [5.72, 52.59],
    [5.55, 52.59], [5.45, 52.55], [5.4, 52.5], [5.3, 52.47], [5.2, 52.45], [5.12, 52.42]];
  const RIVERS = [   // [width in map units, points]
    [0.02, [[6.08, 51.86], [5.87, 51.85], [5.6, 51.84], [5.3, 51.81], [5.0, 51.83], [4.85, 51.82], [4.7, 51.81], [4.6, 51.83], [4.5, 51.86], [4.4, 51.88], [4.3, 51.9], [4.2, 51.93], [4.08, 51.97]]],
    [0.014, [[6.0, 51.96], [5.85, 51.97], [5.6, 51.96], [5.35, 51.97], [5.1, 51.96], [4.9, 51.94], [4.75, 51.9], [4.64, 51.88], [4.52, 51.9], [4.42, 51.9]]],
    [0.015, [[5.69, 50.76], [5.71, 50.9], [5.78, 51.05], [5.92, 51.17], [6.05, 51.28], [6.15, 51.37], [6.12, 51.5], [6.0, 51.64], [5.82, 51.75], [5.6, 51.77], [5.35, 51.74], [5.1, 51.74], [4.9, 51.72], [4.75, 51.71]]],
    [0.011, [[6.1, 51.97], [6.2, 52.14], [6.16, 52.27], [6.12, 52.42], [6.05, 52.51], [5.9, 52.56]]],
    [0.009, [[4.58, 52.46], [4.75, 52.43], [4.9, 52.4], [5.0, 52.39]]],
    [0.008, [[6.57, 53.22], [6.75, 53.27], [6.92, 53.32]]],
    [0.007, [[5.12, 52.09], [5.1, 51.98]]],
  ];
  const lonlat = t => t.lonlat || [3.3 + t.pos[0] * 3.9, 53.55 - t.pos[1] * 2.8];

  // ---------------------------------------------------------------- projection
  // Equirectangular at 52 N, then a fisheye on the Randstad so its seven towns get room,
  // then a slight tilt. nodePositions in index.html places the towns with the same function.
  const FC = [4.68, 51.98], FK = 2.6, FR = 1.25, TILT = 0.9;
  const base = (lon, lat) => [(lon - 5.2) * 0.62, -(lat - 52.15)];
  const FC0 = base(FC[0], FC[1]);
  function world(lon, lat) {
    let [x, y] = base(lon, lat); const dx = x - FC0[0], dy = y - FC0[1], r = Math.hypot(dx, dy);
    if (r > 1e-9 && r < FR) { const s = (FK + 1) / (FK * r / FR + 1); x = FC0[0] + dx * s; y = FC0[1] + dy * s; }
    return [x, y * TILT];
  }
  NRMAP.world = world;
  let BX0 = 1e9, BY0 = 1e9, BX1 = -1e9, BY1 = -1e9;
  for (const poly of [MAINLAND, ...ISLANDS]) for (const p of poly) { const [x, y] = world(p[0], p[1]); BX0 = Math.min(BX0, x); BX1 = Math.max(BX1, x); BY0 = Math.min(BY0, y); BY1 = Math.max(BY1, y); }

  NRMAP.layout = function (W, H, box, towns, f) {
    const bw = BX1 - BX0, bh = (BY1 - BY0) * 1.04;
    const sc = Math.min(box.w / bw, box.h / bh);
    const ox = box.x + (box.w - bw * sc) / 2 - BX0 * sc, oy = box.y + (box.h - bh * sc) / 2 - BY0 * sc;
    const P = (lon, lat) => { const [x, y] = world(lon, lat); return [ox + x * sc, oy + y * sc]; };
    const nodes = towns.map(t => P(...lonlat(t)));
    // push apart so badges and labels never overlap: an ellipse the size of a label
    const ax = 8.6 * f, ay = 5.0 * f;
    for (let it = 0; it < 300; it++) {
      let moved = false;
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const dx = (nodes[j][0] - nodes[i][0]) / ax, dy = (nodes[j][1] - nodes[i][1]) / ay; const d = Math.hypot(dx, dy) || 0.01;
        if (d < 1) { const push = (1 - d) / 2 + 0.01, ux = dx / d, uy = dy / d; nodes[i][0] -= ux * push * ax; nodes[i][1] -= uy * push * ay; nodes[j][0] += ux * push * ax; nodes[j][1] += uy * push * ay; moved = true; }
      }
      for (const p of nodes) { p[0] = Math.min(box.x + box.w - ax * 0.55, Math.max(box.x + ax * 0.55, p[0])); p[1] = Math.min(box.y + box.h - ay * 0.9, Math.max(box.y + f * 2.4, p[1])); }
      if (!moved) break;
    }
    return { W, H, box, sc, P, nodes, f };
  };

  // ---------------------------------------------------------------- helpers
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function trace(c, pts, dx, dy) {
    dx = dx || 0; dy = dy || 0; const n = pts.length;
    c.moveTo((pts[n - 1][0] + pts[0][0]) / 2 + dx, (pts[n - 1][1] + pts[0][1]) / 2 + dy);
    for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; c.quadraticCurveTo(p[0] + dx, p[1] + dy, (p[0] + q[0]) / 2 + dx, (p[1] + q[1]) / 2 + dy); }
    c.closePath();
  }
  function inPoly(pts, x, y) { let ins = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const a = pts[i], b = pts[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) ins = !ins; } return ins; }
  function segDist(px, py, a, b) { const vx = b[0] - a[0], vy = b[1] - a[1]; const t = Math.max(0, Math.min(1, ((px - a[0]) * vx + (py - a[1]) * vy) / (vx * vx + vy * vy || 1))); return Math.hypot(px - a[0] - vx * t, py - a[1] - vy * t); }
  function glow(c, x, y, r, a, col) {
    const g = c.createRadialGradient(x, y, 0, x, y, r); col = col || '255,178,80';
    g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(0.35, `rgba(${col},${a * 0.35})`); g.addColorStop(1, `rgba(${col},0)`);
    c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const SIL = '#0d1319', SIL2 = '#141c25', BLD = '#161d26', BLD2 = '#1c2430', WATER = '#0e1620';

  // ---------------------------------------------------------------- dressing silhouettes
  function tree(c, x, y, s, r) {
    c.fillStyle = SIL; c.fillRect(x - s * 0.06, y - s * 0.5, s * 0.12, s * 0.5);
    const k = 0.3 + r() * 0.15; c.beginPath();
    c.arc(x, y - s * 0.75, s * k, 0, 7); c.arc(x - s * 0.18, y - s * 0.55, s * k * 0.8, 0, 7); c.arc(x + s * 0.2, y - s * 0.58, s * k * 0.75, 0, 7); c.fill();
  }
  function poplar(c, x, y, s) { c.fillStyle = SIL; c.beginPath(); c.ellipse(x, y - s * 0.75, s * 0.14, s * 0.7, 0, 0, 7); c.fill(); c.fillRect(x - s * 0.03, y - s * 0.12, s * 0.06, s * 0.12); }
  function pine(c, x, y, s) { c.fillStyle = SIL; c.beginPath(); c.moveTo(x, y - s * 1.3); c.lineTo(x + s * 0.32, y - s * 0.15); c.lineTo(x - s * 0.32, y - s * 0.15); c.fill(); c.fillRect(x - s * 0.04, y - s * 0.2, s * 0.08, s * 0.2); }
  function mill(c, x, y, s, a, light, lights) {
    c.fillStyle = SIL; c.beginPath(); c.moveTo(x - s * 0.28, y); c.lineTo(x - s * 0.15, y - s * 1.2); c.lineTo(x + s * 0.15, y - s * 1.2); c.lineTo(x + s * 0.28, y); c.fill();
    c.beginPath(); c.moveTo(x - s * 0.2, y - s * 1.18); c.quadraticCurveTo(x, y - s * 1.48, x + s * 0.2, y - s * 1.18); c.fill();
    const hx = x, hy = y - s * 1.25; c.strokeStyle = SIL; c.lineCap = 'butt';
    for (let k = 0; k < 4; k++) {
      const ang = a + k * Math.PI / 2, ex = hx + Math.cos(ang) * s * 0.95, ey = hy + Math.sin(ang) * s * 0.95;
      c.lineWidth = Math.max(0.8, s * 0.05); c.beginPath(); c.moveTo(hx, hy); c.lineTo(ex, ey); c.stroke();
      const nx = -Math.sin(ang) * s * 0.11, ny = Math.cos(ang) * s * 0.11; c.lineWidth = Math.max(0.5, s * 0.025);
      c.beginPath(); c.moveTo(hx + Math.cos(ang) * s * 0.25 + nx, hy + Math.sin(ang) * s * 0.25 + ny); c.lineTo(ex + nx, ey + ny); c.lineTo(ex, ey); c.stroke();
      for (let q = 0.35; q < 0.95; q += 0.15) { const bx = hx + Math.cos(ang) * s * q, by = hy + Math.sin(ang) * s * q; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + nx, by + ny); c.stroke(); }
    }
    if (light) { c.fillStyle = '#e8a040'; c.fillRect(x - s * 0.04, y - s * 0.55, s * 0.08, s * 0.12); lights && lights.push([x, y - s * 0.5, s * 0.6, 0.35]); }
  }
  function cow(c, x, y, s, flip) {
    const d = flip ? -1 : 1; c.fillStyle = SIL; c.beginPath(); c.ellipse(x, y - s * 0.32, s * 0.32, s * 0.15, 0, 0, 7); c.fill();
    c.fillRect(x + d * s * 0.26, y - s * 0.46, d * s * 0.16, s * 0.12);
    for (const lx of [-0.24, -0.12, 0.12, 0.22]) c.fillRect(x + lx * s, y - s * 0.2, s * 0.05, s * 0.2);
  }
  function sheep(c, x, y, s) { c.fillStyle = '#2a333d'; c.beginPath(); c.ellipse(x, y - s * 0.2, s * 0.2, s * 0.12, 0, 0, 7); c.fill(); c.fillStyle = SIL; c.fillRect(x + s * 0.16, y - s * 0.28, s * 0.08, s * 0.1); }
  function farm(c, x, y, s, r, lights) {
    const w = s * (0.7 + r() * 0.4), h = s * 0.45; c.fillStyle = SIL2; c.fillRect(x - w / 2, y - h, w, h);
    c.fillStyle = SIL; c.beginPath(); c.moveTo(x - w / 2 - s * 0.06, y - h); c.lineTo(x, y - h - s * 0.5); c.lineTo(x + w / 2 + s * 0.06, y - h); c.fill();
    if (r() < 0.22) { c.fillStyle = '#f0a848'; c.fillRect(x - s * 0.08, y - h * 0.7, s * 0.1, s * 0.12); lights.push([x - s * 0.03, y - h * 0.6, s * 0.9, 0.3]); }
  }
  function church(c, x, y, s, r, lights) {
    c.fillStyle = SIL2; c.fillRect(x - s * 0.1, y - s * 0.5, s * 0.7, s * 0.5); c.fillStyle = SIL; c.beginPath(); c.moveTo(x - s * 0.1, y - s * 0.5); c.lineTo(x + s * 0.25, y - s * 0.8); c.lineTo(x + s * 0.6, y - s * 0.5); c.fill();
    c.fillRect(x - s * 0.3, y - s * 1.2, s * 0.24, s * 1.2); c.beginPath(); c.moveTo(x - s * 0.32, y - s * 1.2); c.lineTo(x - s * 0.18, y - s * 1.9); c.lineTo(x - s * 0.04, y - s * 1.2); c.fill();
    if (r() < 0.5) { c.fillStyle = '#e09a40'; c.fillRect(x + s * 0.1, y - s * 0.35, s * 0.06, s * 0.14); c.fillRect(x + s * 0.3, y - s * 0.35, s * 0.06, s * 0.14); lights.push([x + s * 0.2, y - s * 0.3, s * 0.8, 0.25]); }
  }
  function tulips(c, x, y, s, r, a) {
    const w = s * (2 + r() * 1.6), h = s * (0.8 + r() * 0.5), rows = Math.max(3, Math.round(h / (s * 0.18)));
    c.save(); c.translate(x, y); c.transform(1, 0, -0.35, 1, 0, 0);
    c.fillStyle = 'rgba(40,14,16,.55)'; c.fillRect(-w / 2, -h, w, h);
    for (let i = 0; i < rows; i++) {
      const yy = -h + (i + 0.5) * h / rows; c.fillStyle = i % 2 ? `rgba(196,48,44,${a})` : `rgba(160,34,36,${a})`;
      for (let xx = -w / 2 + s * 0.08; xx < w / 2; xx += s * 0.12) { c.beginPath(); c.arc(xx + (r() - 0.5) * s * 0.04, yy, s * 0.055, 0, 7); c.fill(); }
    }
    c.restore();
  }
  function reeds(c, x, y, s, r) { c.strokeStyle = SIL; c.lineWidth = Math.max(0.6, s * 0.04); c.beginPath(); for (let i = 0; i < 6; i++) { const xx = x + (r() - 0.5) * s * 0.6; c.moveTo(xx, y); c.lineTo(xx + (r() - 0.5) * s * 0.15, y - s * (0.3 + r() * 0.35)); } c.stroke(); }
  function lamp(c, x, y, s, lights, a) { c.fillStyle = SIL; c.fillRect(x - s * 0.025, y - s * 0.8, s * 0.05, s * 0.8); c.fillStyle = '#ffd88a'; c.beginPath(); c.arc(x, y - s * 0.82, s * 0.06, 0, 7); c.fill(); lights.push([x, y - s * 0.82, s * 1.1, a == null ? 0.55 : a]); }
  function boat(c, x, y, s, r, lights, flip) {
    const d = flip ? -1 : 1, sail = r() < 0.75;
    const draw = (sy, col) => {
      c.fillStyle = col; c.beginPath(); c.moveTo(x - s * 0.5, y); c.lineTo(x + s * 0.5, y); c.lineTo(x + s * 0.38, y + sy * s * 0.14); c.lineTo(x - s * 0.4, y + sy * s * 0.14); c.fill();
      if (sail) { c.beginPath(); c.moveTo(x + d * s * 0.02, y - sy * s * 0.02); c.lineTo(x + d * s * 0.02, y - sy * s * 1.15); c.lineTo(x + d * s * 0.42, y - sy * s * 0.08); c.fill(); c.beginPath(); c.moveTo(x - d * s * 0.04, y - sy * s * 0.1); c.lineTo(x - d * s * 0.04, y - sy * s * 0.9); c.lineTo(x - d * s * 0.36, y - sy * s * 0.1); c.fill(); }
      else { c.fillRect(x - s * 0.2, y - sy * s * 0.25, s * 0.3, sy * s * 0.25); c.fillRect(x - s * 0.02, y - sy * s * 0.7, s * 0.04, sy * s * 0.7); }
    };
    c.save(); c.globalAlpha = 0.25; draw(-1, '#1a2633'); c.restore(); draw(1, SIL);
    if (r() < 0.4) { c.fillStyle = '#ffcf7a'; c.beginPath(); c.arc(x + s * 0.3, y - s * 0.12, s * 0.04, 0, 7); c.fill(); lights.push([x + s * 0.3, y - s * 0.12, s * 0.8, 0.4]); lights.push([x + s * 0.3, y + s * 0.4, s * 0.5, 0.12]); }
  }

  // ---------------------------------------------------------------- town vignette pieces
  // each piece draws at centre x on ground line y; u is the vignette unit; L carries the light
  function win(c, x, y, w, h, L) {
    const on = L.r() < L.lit;
    c.fillStyle = on ? (L.hot ? (L.r() < 0.5 ? '#ffd27a' : '#ffb347') : (L.r() < 0.5 ? '#e0943a' : '#c97c2c')) : '#1f2630';
    c.fillRect(x, y, w, h); if (on && L.r() < 0.35) L.lights.push([x + w / 2, y + h / 2, w * 5, L.hot ? 0.3 : 0.16]);
  }
  function windows(c, x0, y0, w, h, u, L, cols, rows) {
    cols = cols || Math.max(1, Math.floor(w / (u * 0.9))); rows = rows || Math.max(1, Math.floor(h / (u * 1.1)));
    const ww = u * 0.32, wh = u * 0.5, gx = w / cols, gy = h / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) win(c, x0 + gx * (i + 0.5) - ww / 2, y0 + gy * (j + 0.5) - wh / 2, ww, wh, L);
  }
  function gableHouse(c, x, y, w, h, u, L, kind) {
    c.fillStyle = L.r() < 0.5 ? BLD : BLD2; c.fillRect(x - w / 2, y - h, w, h); c.beginPath();
    if (kind === 0) { c.moveTo(x - w / 2, y - h); c.lineTo(x, y - h - w * 0.75); c.lineTo(x + w / 2, y - h); }
    else if (kind === 1) { const st = w / 6; c.moveTo(x - w / 2, y - h); for (let i = 0; i < 3; i++) { c.lineTo(x - w / 2 + st * i, y - h - st * 1.2 * (i + 1)); c.lineTo(x - w / 2 + st * (i + 1), y - h - st * 1.2 * (i + 1)); } c.lineTo(x + w / 2 - st * 2, y - h - st * 3.6); for (let i = 2; i >= 0; i--) { c.lineTo(x + w / 2 - st * i, y - h - st * 1.2 * (i + 1)); c.lineTo(x + w / 2 - st * i, y - h - st * 1.2 * i); } }
    else { c.moveTo(x - w / 2, y - h); c.quadraticCurveTo(x - w / 2, y - h - w * 0.4, x - w * 0.22, y - h - w * 0.5); c.lineTo(x - w * 0.2, y - h - w * 0.8); c.lineTo(x + w * 0.2, y - h - w * 0.8); c.lineTo(x + w * 0.22, y - h - w * 0.5); c.quadraticCurveTo(x + w / 2, y - h - w * 0.4, x + w / 2, y - h); }
    c.closePath(); c.fill();
    windows(c, x - w / 2, y - h + u * 0.2, w, h - u * 0.4, u, L, Math.max(1, Math.round(w / (u * 0.8))), Math.max(1, Math.round(h / (u * 1.1))));
  }
  function towerShape(c, x, y, w, h, top, u, L) {
    c.fillStyle = BLD2; const b = h * (top === 'flat' ? 0.92 : 0.62);
    c.fillRect(x - w / 2, y - b, w, b);
    windows(c, x - w / 2, y - b + u * 0.4, w, b * 0.7, u, L, 1, Math.max(2, Math.round(b / (u * 2))));
    const ty = y - b; c.fillStyle = BLD;
    if (top === 'spire') { c.beginPath(); c.moveTo(x - w * 0.55, ty); c.lineTo(x, ty - (h - b)); c.lineTo(x + w * 0.55, ty); c.fill(); }
    else if (top === 'flat') { for (let i = 0; i < 4; i++) c.fillRect(x - w / 2 + i * w / 3.5, ty - u * 0.5, w / 7, u * 0.5); win(c, x - u * 0.4, ty + u * 0.6, u * 0.8, u * 0.8, { ...L, lit: Math.max(L.lit, 0.6) }); }
    else if (top === 'octagon' || top === 'lantern' || top === 'stages') {
      const s1 = (h - b) * 0.5; c.fillRect(x - w * 0.38, ty - s1, w * 0.76, s1);
      c.fillStyle = L.lit > 0.5 ? 'rgba(255,190,100,.85)' : 'rgba(150,100,50,.6)'; c.fillRect(x - w * 0.2, ty - s1 * 0.85, w * 0.12, s1 * 0.6); c.fillRect(x + w * 0.08, ty - s1 * 0.85, w * 0.12, s1 * 0.6);
      L.lights.push([x, ty - s1 * 0.5, w * 2.2, L.hot ? 0.35 : 0.18]);
      c.fillStyle = BLD; const s2 = (h - b) - s1;
      if (top === 'lantern') { c.fillRect(x - w * 0.22, ty - s1 - s2 * 0.5, w * 0.44, s2 * 0.5); c.beginPath(); c.arc(x, ty - s1 - s2 * 0.5, w * 0.22, Math.PI, 0); c.fill(); c.fillRect(x - u * 0.06, ty - s1 - s2, u * 0.12, s2 * 0.5); }
      else if (top === 'stages') { c.fillRect(x - w * 0.27, ty - s1 - s2 * 0.45, w * 0.54, s2 * 0.45); c.beginPath(); c.ellipse(x, ty - s1 - s2 * 0.55, w * 0.2, s2 * 0.18, 0, 0, 7); c.fill(); c.fillRect(x - u * 0.06, ty - s1 - s2, u * 0.12, s2 * 0.4); }
      else { c.beginPath(); c.moveTo(x - w * 0.32, ty - s1); c.lineTo(x, ty - h + b); c.lineTo(x + w * 0.32, ty - s1); c.fill(); }
    } else if (top === 'dome') { c.beginPath(); c.arc(x, ty, w * 0.5, Math.PI, 0); c.fill(); c.fillRect(x - u * 0.06, ty - w * 0.5 - (h - b) * 0.4, u * 0.12, (h - b) * 0.4); }
    else if (top === 'disk') { c.fillRect(x - w * 0.25, ty - (h - b), w * 0.5, h - b); c.beginPath(); c.ellipse(x, ty - (h - b) * 0.2, w * 1.1, u * 0.35, 0, 0, 7); c.fill(); c.fillStyle = '#ffcf7a'; c.fillRect(x - w, ty - (h - b) * 0.2 - u * 0.05, w * 2, u * 0.1); L.lights.push([x, ty - (h - b) * 0.2, w * 3, 0.3]); }
  }
  function waterPatch(c, x, y, w, h) { c.fillStyle = WATER; c.beginPath(); c.ellipse(x, y, w / 2, h / 2, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(120,150,180,.12)'; c.lineWidth = 1; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(x - w * 0.3 + i * 3, y + i * h * 0.12); c.lineTo(x - w * 0.1 + i * 3, y + i * h * 0.12); c.stroke(); } }
  const PIECES = {
    houses: { w: 7, h: 4.5, draw(c, x, y, u, L) { const n = 4; for (let i = 0; i < n; i++) { const w = u * (1.4 + L.r() * 0.4), h = u * (2.4 + L.r() * 1.6); gableHouse(c, x - u * 2.6 + i * u * 1.75, y - (i % 2) * u * 0.15, w, h, u, L, (i + (L.r() * 3 | 0)) % 3); } } },
    hall: { w: 6, h: 5, draw(c, x, y, u, L) { const w = u * 5, h = u * 2.8; c.fillStyle = BLD; c.fillRect(x - w / 2, y - h, w, h); c.fillStyle = BLD2; c.beginPath(); c.moveTo(x - w / 2 - u * 0.2, y - h); c.lineTo(x - w * 0.3, y - h - u * 1.5); c.lineTo(x + w * 0.3, y - h - u * 1.5); c.lineTo(x + w / 2 + u * 0.2, y - h); c.fill(); for (const sx of [-1, 1]) { c.fillRect(x + sx * w * 0.42 - u * 0.3, y - h - u * 2.4, u * 0.6, u * 2.4); c.beginPath(); c.moveTo(x + sx * w * 0.42 - u * 0.35, y - h - u * 2.4); c.lineTo(x + sx * w * 0.42, y - h - u * 3.4); c.lineTo(x + sx * w * 0.42 + u * 0.35, y - h - u * 2.4); c.fill(); } windows(c, x - w / 2 + u * 0.3, y - h + u * 0.3, w - u * 0.6, h - u * 0.5, u, L, 6, 2); } },
    church: { w: 7, h: 8, draw(c, x, y, u, L) { const nw = u * 5, nh = u * 2.6; c.fillStyle = BLD; c.fillRect(x - u * 0.6, y - nh, nw, nh); c.fillStyle = BLD2; c.beginPath(); c.moveTo(x - u * 0.6, y - nh); c.lineTo(x - u * 0.6 + nw / 2, y - nh - u * 1.8); c.lineTo(x - u * 0.6 + nw, y - nh); c.fill(); for (let i = 0; i < 4; i++) { const wx = x + u * 0.2 + i * u * 1.1; const on = L.r() < L.lit; c.fillStyle = on ? (L.hot ? '#ffc060' : '#c98030') : '#1f2630'; c.beginPath(); c.moveTo(wx, y - u * 0.5); c.lineTo(wx, y - nh + u * 0.9); c.arc(wx + u * 0.22, y - nh + u * 0.9, u * 0.22, Math.PI, 0); c.lineTo(wx + u * 0.44, y - u * 0.5); c.fill(); if (on) L.lights.push([wx + u * 0.2, y - nh * 0.6, u * 1.6, L.hot ? 0.3 : 0.15]); } towerShape(c, x - u * 1.6, y, u * 1.5, u * 8, 'spire', u, L); } },
    tower: { w: 2.6, h: 10, draw(c, x, y, u, L, e) { towerShape(c, x, y, u * (e.wide || 1.9), u * e.th, e.top, u, L); } },
    mill: { w: 4, h: 6, draw(c, x, y, u, L) { mill(c, x, y, u * 4.2, 0.5 + L.r(), L.r() < L.lit, L.lights); } },
    mills: { w: 9, h: 6, draw(c, x, y, u, L) { mill(c, x - u * 3, y + u * 0.4, u * 3.4, 0.3, L.r() < L.lit, L.lights); mill(c, x + u * 3, y + u * 0.2, u * 3.8, 0.9, L.r() < L.lit, L.lights); mill(c, x, y - u * 0.4, u * 4.6, 0.6, L.r() < L.lit, L.lights); } },
    lighthouse: { w: 3, h: 9, draw(c, x, y, u, L, e) { const h = u * 7; c.fillStyle = e.red ? '#3a1e1e' : '#2c343e'; c.beginPath(); c.moveTo(x - u * 0.8, y); c.lineTo(x - u * 0.45, y - h); c.lineTo(x + u * 0.45, y - h); c.lineTo(x + u * 0.8, y); c.fill(); c.fillStyle = BLD; c.fillRect(x - u * 0.7, y - h - u * 0.3, u * 1.4, u * 0.3); c.fillStyle = '#ffe2a0'; c.fillRect(x - u * 0.4, y - h - u * 1.2, u * 0.8, u * 0.9); c.fillStyle = BLD; c.beginPath(); c.moveTo(x - u * 0.6, y - h - u * 1.2); c.lineTo(x, y - h - u * 1.9); c.lineTo(x + u * 0.6, y - h - u * 1.2); c.fill(); L.lights.push([x, y - h - u * 0.75, u * 4, 0.7]); L.beams.push([x, y - h - u * 0.75, u * 16]); } },
    archbridge: { w: 11, h: 4, water: true, draw(c, x, y, u, L) { const w = u * 10, dy = y - u * 0.6; c.fillStyle = BLD; c.fillRect(x - w / 2, dy, w, u * 0.45); for (const px of [-0.5, 0.5]) c.fillRect(x + px * w - u * 0.3, dy, u * 0.6, u * 1.4); c.lineWidth = u * 0.45; c.strokeStyle = L.lit > 0.5 ? '#d8963c' : '#5a4a36'; c.beginPath(); c.moveTo(x - w * 0.42, dy); c.quadraticCurveTo(x, dy - u * 6, x + w * 0.42, dy); c.stroke(); c.lineWidth = Math.max(0.6, u * 0.1); for (let i = 1; i < 10; i++) { const t = i / 10, ax = x - w * 0.42 + w * 0.84 * t, ay = dy - u * 6 * 2 * t * (1 - t) ; c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax, dy); c.stroke(); } if (L.lit > 0.3) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(255,170,70,${0.25 * L.lit})`; c.lineWidth = u * 1.4; c.beginPath(); c.moveTo(x - w * 0.42, dy); c.quadraticCurveTo(x, dy - u * 6, x + w * 0.42, dy); c.stroke(); c.restore(); } for (let i = 0; i <= 6; i++) L.lights.push([x - w * 0.45 + i * w * 0.15, dy - u * 0.2, u * 1.2, 0.5 * L.lit + 0.1]); for (let i = 0; i <= 6; i++) L.refl.push([x - w * 0.45 + i * w * 0.15, dy + u * 0.8, u * 2.4]); } },
    stonebridge: { w: 8, h: 2.5, water: true, draw(c, x, y, u, L) { const w = u * 7, dy = y - u * 0.5; c.fillStyle = BLD2; c.beginPath(); c.moveTo(x - w / 2, dy + u * 0.8); c.lineTo(x - w / 2, dy - u * 0.4); c.lineTo(x + w / 2, dy - u * 0.4); c.lineTo(x + w / 2, dy + u * 0.8); for (let i = 3; i >= 0; i--) { const ax = x - w / 2 + (i + 0.5) * w / 4; c.lineTo(ax + w / 9, dy + u * 0.8); c.arc(ax, dy + u * 0.8, w / 9, 0, Math.PI, true); } c.fill(); for (let i = 0; i < 3; i++) lamp(c, x - w / 2 + (i + 0.5) * w / 3, dy - u * 0.4, u * 1.6, L.lights, 0.35 + 0.4 * L.lit); for (let i = 0; i < 3; i++) L.refl.push([x - w / 2 + (i + 0.5) * w / 3, dy + u * 1.2, u * 2]); } },
    drawbridge: { w: 5, h: 3, water: true, draw(c, x, y, u, L) { const dy = y - u * 0.4; c.fillStyle = '#26303a'; c.fillRect(x - u * 2.2, dy, u * 4.4, u * 0.3); c.strokeStyle = '#2e3844'; c.lineWidth = u * 0.22; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(x + s * u * 0.6, dy); c.lineTo(x + s * u * 0.6, dy - u * 2.2); c.lineTo(x + s * u * 2.2, dy - u * 1.4); c.stroke(); } lamp(c, x, dy, u * 1.4, L.lights, 0.5); L.refl.push([x, dy + u, u * 1.6]); } },
    boats: { w: 7, h: 5, water: true, draw(c, x, y, u, L) { for (let i = 0; i < 3; i++) { const bx = x - u * 2.4 + i * u * 2.4, by = y - u * 0.1 + (i % 2) * u * 0.3; c.fillStyle = SIL; c.beginPath(); c.moveTo(bx - u * 1.1, by - u * 0.6); c.lineTo(bx + u * 1.1, by - u * 0.6); c.lineTo(bx + u * 0.8, by); c.lineTo(bx - u * 0.9, by); c.fill(); c.fillRect(bx - u * 0.3, by - u * 1.3, u * 0.8, u * 0.7); c.fillRect(bx - u * 0.05, by - u * 3.4, u * 0.12, u * 2.8); c.strokeStyle = SIL; c.lineWidth = Math.max(0.6, u * 0.08); c.beginPath(); c.moveTo(bx, by - u * 3.2); c.lineTo(bx - u * 1.2, by - u * 0.6); c.moveTo(bx, by - u * 3.2); c.lineTo(bx + u * 1.3, by - u * 1.0); c.stroke(); win(c, bx, by - u * 1.1, u * 0.3, u * 0.3, L); if (L.r() < 0.6) { L.lights.push([bx, by - u * 3.4, u * 1.5, 0.45]); c.fillStyle = '#ffd890'; c.fillRect(bx - u * 0.1, by - u * 3.5, u * 0.2, u * 0.2); } L.refl.push([bx, by + u * 0.8, u * 1.6]); } } },
    cheese: { w: 5, h: 2, draw(c, x, y, u, L) { const rows = [[-1.6, 0], [0, 0], [1.6, 0], [-0.8, -0.9], [0.8, -0.9], [0, -1.8]]; for (const [ox, oy] of rows) { const cx = x + ox * u, cy = y + oy * u - u * 0.45; c.fillStyle = '#9a6420'; c.beginPath(); c.ellipse(cx, cy + u * 0.18, u * 0.8, u * 0.4, 0, 0, Math.PI); c.lineTo(cx - u * 0.8, cy - u * 0.2); c.fill(); c.fillRect(cx - u * 0.8, cy - u * 0.2, u * 1.6, u * 0.4); c.fillStyle = L.lit > 0.5 ? '#f2b84a' : '#c48a30'; c.beginPath(); c.ellipse(cx, cy - u * 0.2, u * 0.8, u * 0.32, 0, 0, 7); c.fill(); } L.lights.push([x, y - u * 1.2, u * 4, 0.35]); } },
    cranes: { w: 5, h: 7, draw(c, x, y, u, L) { c.strokeStyle = SIL; c.lineWidth = Math.max(0.8, u * 0.18); for (const [dx, h, a] of [[-1.2, 6, 1], [1.4, 5, -1]]) { c.beginPath(); c.moveTo(x + dx * u, y); c.lineTo(x + dx * u, y - h * u); c.lineTo(x + (dx + a * 2.6) * u, y - (h - 0.4) * u); c.moveTo(x + dx * u, y - h * u); c.lineTo(x + (dx - a * 0.8) * u, y - (h - 0.6) * u); c.stroke(); L.lights.push([x + dx * u, y - h * u, u * 1.2, 0.5, '255,90,60']); } } },
    barrier: { w: 11, h: 2.5, water: true, draw(c, x, y, u, L) { const w = u * 10, dy = y - u * 0.5; c.fillStyle = BLD2; c.fillRect(x - w / 2, dy - u * 0.9, w, u * 0.35); for (let i = 0; i <= 8; i++) { const px = x - w / 2 + i * w / 8; c.fillRect(px - u * 0.25, dy - u * 1.4, u * 0.5, u * 1.9); if (i % 2 === 0) { L.lights.push([px, dy - u * 1.5, u * 1.3, 0.3 + 0.4 * L.lit]); c.fillStyle = '#ffd890'; c.fillRect(px - u * 0.1, dy - u * 1.6, u * 0.2, u * 0.2); c.fillStyle = BLD2; L.refl.push([px, dy + u * 0.8, u * 1.8]); } } } },
    erasmus: { w: 9, h: 9, water: true, draw(c, x, y, u, L) { const w = u * 9, dy = y - u * 0.6; c.fillStyle = BLD; c.fillRect(x - w / 2, dy, w, u * 0.35); const tx = x - u * 1.0, ty = dy - u * 8; c.strokeStyle = '#3c5266'; c.lineWidth = u * 0.4; c.beginPath(); c.moveTo(x - u * 2, dy + u * 0.3); c.lineTo(x - u * 1.2, dy - u * 3); c.lineTo(tx, ty); c.stroke(); c.lineWidth = Math.max(0.5, u * 0.06); c.strokeStyle = 'rgba(160,190,215,.6)'; for (let i = 1; i <= 7; i++) { c.beginPath(); c.moveTo(tx, ty + i * u * 0.3); c.lineTo(x - u * 1.0 + i * u * 0.75, dy); c.stroke(); c.beginPath(); c.moveTo(tx, ty + i * u * 0.3); c.lineTo(x - u * 1.6 - i * u * 0.35, dy); c.stroke(); } L.lights.push([tx, ty, u * 1.6, 0.4, '200,225,255']); for (let i = 0; i < 5; i++) L.refl.push([x - w / 2 + i * w / 4, dy + u, u * 2]); } },
    mast: { w: 2, h: 11, draw(c, x, y, u, L) { towerShape(c, x, y, u * 0.9, u * 11, 'disk', u, L); } },
    cubes: { w: 4, h: 3, draw(c, x, y, u, L) { for (let i = 0; i < 3; i++) { const cx = x - u * 1.3 + i * u * 1.3, cy = y - u * 1.6; c.fillStyle = BLD2; c.fillRect(cx - u * 0.1, cy, u * 0.2, u * 1.6); c.fillStyle = i % 2 ? '#5a4a22' : '#4a3d1e'; c.beginPath(); c.moveTo(cx, cy - u * 1.2); c.lineTo(cx + u * 0.65, cy - u * 0.6); c.lineTo(cx, cy); c.lineTo(cx - u * 0.65, cy - u * 0.6); c.fill(); win(c, cx - u * 0.15, cy - u * 0.75, u * 0.3, u * 0.3, L); } } },
    gate: { w: 4, h: 4, draw(c, x, y, u, L) { c.fillStyle = BLD2; c.fillRect(x - u * 1.2, y - u * 2.2, u * 2.4, u * 2.2); for (const s of [-1, 1]) { c.fillRect(x + s * u * 1.3 - u * 0.6, y - u * 3.2, u * 1.2, u * 3.2); c.fillStyle = BLD; c.beginPath(); c.moveTo(x + s * u * 1.3 - u * 0.7, y - u * 3.2); c.lineTo(x + s * u * 1.3, y - u * 4.2); c.lineTo(x + s * u * 1.3 + u * 0.7, y - u * 3.2); c.fill(); c.fillStyle = BLD2; } c.fillStyle = '#0a0e13'; c.beginPath(); c.moveTo(x - u * 0.5, y); c.lineTo(x - u * 0.5, y - u * 1.1); c.arc(x, y - u * 1.1, u * 0.5, Math.PI, 0); c.lineTo(x + u * 0.5, y); c.fill(); L.lights.push([x, y - u * 0.6, u * 1.6, 0.3]); } },
    dome: { w: 6, h: 5, draw(c, x, y, u, L) { const w = u * 5.6, h = u * 2.2; c.fillStyle = '#26303b'; c.fillRect(x - w / 2, y - h, w, h); c.beginPath(); c.arc(x, y - h, u * 1.3, Math.PI, 0); c.fill(); c.fillRect(x - u * 0.1, y - h - u * 2, u * 0.2, u * 0.8); windows(c, x - w / 2 + u * 0.2, y - h + u * 0.2, w - u * 0.4, h - u * 0.3, u, L, 7, 2); } },
    wheel: { w: 5, h: 6, water: true, draw(c, x, y, u, L) { const r = u * 2.2, cy = y - r - u * 0.6; c.strokeStyle = '#2e3a46'; c.lineWidth = Math.max(0.7, u * 0.12); c.beginPath(); c.arc(x, cy, r, 0, 7); c.stroke(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(x, cy); c.lineTo(x + Math.cos(a) * r, cy + Math.sin(a) * r); c.stroke(); if (L.r() < L.lit + 0.2) L.lights.push([x + Math.cos(a) * r, cy + Math.sin(a) * r, u * 0.7, 0.45, '255,200,140']); } c.beginPath(); c.moveTo(x - u, y - u * 0.4); c.lineTo(x, cy); c.lineTo(x + u, y - u * 0.4); c.stroke(); c.fillStyle = BLD; c.fillRect(x - u * 2.5, y - u * 0.5, u * 5, u * 0.3); } },
    barn: { w: 4, h: 3, draw(c, x, y, u, L) { c.fillStyle = BLD; c.beginPath(); c.moveTo(x - u * 1.8, y); c.lineTo(x - u * 1.8, y - u * 0.6); c.lineTo(x + u * 0.4, y - u * 2.6); c.lineTo(x + u * 1.6, y - u * 1.4); c.lineTo(x + u * 1.6, y); c.fill(); win(c, x + u * 0.6, y - u * 0.9, u * 0.4, u * 0.4, L); for (let i = 0; i < 4; i++) sheep(c, x - u * 2.6 + i * u * 0.9, y + u * 0.9 + (i % 2) * u * 0.3, u * 1.2); } },
    trees: { w: 3, h: 3, draw(c, x, y, u, L) { for (let i = 0; i < 3; i++) tree(c, x - u + i * u, y + (i % 2) * u * 0.3, u * 2.2, L.r); } },
    market: { w: 5, h: 2.5, draw(c, x, y, u, L) { for (let i = 0; i < 3; i++) { const sx = x - u * 1.8 + i * u * 1.8; c.fillStyle = i % 2 ? '#5a2a26' : '#3a3f48'; c.beginPath(); c.moveTo(sx - u * 0.8, y - u * 1.2); c.lineTo(sx, y - u * 1.7); c.lineTo(sx + u * 0.8, y - u * 1.2); c.fill(); c.fillStyle = BLD; c.fillRect(sx - u * 0.7, y - u * 1.2, u * 1.4, u * 1.0); L.lights.push([sx, y - u * 0.8, u * 1.4, 0.3]); } } },
  };
  // landmark text -> pieces. Read from content/towns.js: each landmark's name and look.
  function piecesFor(t) {
    const out = [], have = new Set();
    const add = (k, extra) => { const key = k + (extra && extra.key || ''); if (have.has(key)) return; have.add(key); out.push({ k, ...PIECES[k], ...(extra || {}) }); };
    for (const lm of (t.landmarks || [])) {
      const s = (lm.name + ' ' + (lm.look || '')).toLowerCase(); const m = /(\d{2,3}) metres/.exec(s); const metres = m ? +m[1] : 60;
      const th = Math.min(13, 5 + metres / 12);
      if (/lighthouse|vuurtoren/.test(s)) add('lighthouse', { red: /red/.test(s) });
      else if (/cable-stayed|erasmus/.test(s)) add('erasmus');
      else if (/euromast|platform near the top/.test(s)) add('mast');
      else if (/cube/.test(s)) add('cubes');
      else if (/mills|molens/.test(s)) add('mills');
      else if (/\bmill\b|molen/.test(s)) add('mill');
      else if (/barrier|kering|caisson|pillars/.test(s)) add('barrier');
      else if (/ferris|pier/.test(s)) add('wheel');
      else if (/dome/.test(s) && /hotel|kurhaus|gate/.test(s) === false) add('dome');
      else if (/kurhaus/.test(s)) add('dome');
      else if (/arch bridge|arch road bridge|arch rising|pale arch/.test(s) && !/stone/.test(s)) add('archbridge');
      else if (/drawbridge/.test(s)) add('drawbridge');
      else if (/bridge|brug/.test(s)) add('stonebridge');
      else if (/harbou?r|haven|cutter|ferry|veerboot/.test(s)) add('boats');
      else if (/octagon/.test(s) && /tower|toren/.test(s)) add('tower', { th, top: 'octagon', key: 'o' });
      else if (/lantern/.test(s)) add('tower', { th, top: 'lantern', key: 'l', wide: 2.2 });
      else if (/martini|d'ol/.test(s)) add('tower', { th, top: 'stages', key: 's' });
      else if (/flat unfinished|wide square church tower|never finished/.test(s)) add('tower', { th: th * 0.85, top: 'flat', key: 'f', wide: 2.6 });
      else if (/tower|toren|spire/.test(s) && !/church\b.*nave/.test(s)) add('tower', { th, top: 'spire', key: 'p' + out.length });
      else if (/church|kerk|basiliek|basilica|chapel/.test(s)) add('church');
      else if (/cheese|kaas|weigh house|waag/.test(s)) { if (/cheese/.test(s)) add('cheese'); add('hall', { key: 'w' }); }
      else if (/gate|poort/.test(s)) add('gate');
      else if (/barn|schapenboet/.test(s)) add('barn');
      else if (/market|markt|stalls/.test(s)) { add('market'); add('houses'); }
      else if (/canal|gracht|wharves/.test(s)) add('houses');
      else if (/town hall|stadhuis|palace|parliament|museum|university|building|station|post office|binnenhof|paleis/.test(s)) add('hall', { key: 'h' + out.length });
    }
    if (!out.some(e => e.k === 'houses')) add('houses');
    return out;
  }

  function paintTown(c, t, node, vw, state, seed, lights, beams, refl) {
    const L = { r: mulberry(seed), lit: state === 'saved' ? 0.95 : state === 'open' ? 0.62 : 0.38, hot: state === 'saved', lights, beams, refl };
    let els = piecesFor(t);
    const u0 = vw / 17;
    // keep it to a width of ~24 units: the hero first, then by importance
    const hero = els.reduce((a, e) => ((e.th || e.h) > (a.th || a.h) ? e : a), els[0]);
    els = [hero, ...els.filter(e => e !== hero)];
    let used = 0; const keep = []; for (const e of els) { if (used + e.w > 24 || (e.water && keep.some(k => k.water))) continue; keep.push(e); used += e.w; }
    const water = keep.filter(e => e.water), land = keep.filter(e => !e.water);
    const [nx, ny] = node; const u = u0;
    // ground glow
    c.save(); c.globalCompositeOperation = 'lighter';
    const ga = state === 'saved' ? 0.42 : state === 'open' ? 0.26 : 0.14;
    c.translate(nx, ny - u * 2.5); c.scale(1, 0.6); glow(c, 0, 0, vw * 0.85, ga); c.restore();
    // water pieces sit in front, on a patch of water
    const placed = [];
    let off = 0; land.forEach((e, i) => { const side = i === 0 ? 0 : (i % 2 ? 1 : -1); if (i === 1 || i === 2) off = (hero.w / 2 + e.w / 2) * 0.8; else if (i > 2) off = (hero.w / 2 + land[i - 2].w + e.w / 2) * 0.8; placed.push({ e, x: nx + side * off * u, y: ny - u * 1.6 + (i ? u * 0.4 + (i > 2 ? u * 0.5 : 0) : 0) }); });
    water.forEach((e) => { const side = (seed >> 3) % 2 ? 1 : -1; placed.push({ e, x: nx + side * (vw * 0.42 + e.w * u * 0.35), y: ny + u * 1.2, water: true }); });
    for (const p of placed) if (p.water) waterPatch(c, p.x, p.y + u * 0.4, p.e.w * u * 1.15, u * 3);
    // trees and lamps around the edges
    const tr = L.r; const extras = [];
    for (let i = 0; i < 4; i++) extras.push({ x: nx + (i < 2 ? -1 : 1) * (vw * 0.5 + tr() * vw * 0.15), y: ny - u * 1.2 + tr() * u * 1.4, tree: true });
    for (let i = 0; i < 4; i++) extras.push({ x: nx + (i - 1.5) * vw * 0.28 + (tr() - 0.5) * u, y: ny - u * 0.2, lamp: true });
    const all = [...placed, ...extras].sort((a, b) => a.y - b.y);
    for (const p of all) {
      if (p.tree) tree(c, p.x, p.y, u * 2.4, tr);
      else if (p.lamp) lamp(c, p.x, p.y, u * 2, lights, 0.3 + 0.45 * L.lit);
      else p.e.draw(c, p.x, p.y, u, L, p.e);
    }
  }

  // ---------------------------------------------------------------- the painting
  let cacheKey = '';
  NRMAP.paint = function (canvas, lay, towns, states) {
    const dpr = Math.min(2, window.devicePixelRatio || 1); const { W, H, sc, P, nodes } = lay;
    const key = [W, H, dpr, sc.toFixed(2), states.join(','), nodes.map(n => n.map(v => v | 0).join(':')).join(',')].join('|');
    if (key === cacheKey && canvas.width === Math.round(W * dpr)) return; cacheKey = key;
    const t0 = performance.now(); canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const c = canvas.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = mulberry(1953);
    const proj = poly => poly.map(p => P(p[0], p[1]));
    const land = [MAINLAND, ...ISLANDS].map(proj), lake = proj(IJSSELMEER), flevo = proj(FLEVOLAND);
    const D = Math.max(4, sc * 0.034), s = Math.max(6, sc * 0.062);
    const lights = [], beams = [], refl = [];
    // page and sea
    const bg = c.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, Math.max(W, H) * 0.75);
    bg.addColorStop(0, '#18212b'); bg.addColorStop(0.6, '#121922'); bg.addColorStop(1, '#090d13'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(140,170,200,.05)'; c.lineWidth = 1;
    for (let i = 0; i < (W * H) / 900; i++) { const x = r() * W, y = r() * H, l = 4 + r() * 14; c.beginPath(); c.moveTo(x, y); c.lineTo(x + l, y); c.stroke(); }
    // shallow water halo and the slab's shadow
    c.save(); c.strokeStyle = 'rgba(70,95,120,.035)'; c.lineJoin = 'round';
    for (const lw of [sc * 0.14, sc * 0.07]) { c.lineWidth = lw; c.beginPath(); for (const p of land) trace(c, p); c.stroke(); }
    c.restore();
    c.save(); c.shadowColor = 'rgba(0,0,0,.7)'; c.shadowBlur = sc * 0.1; c.shadowOffsetY = D * 1.6; c.fillStyle = '#0b1016'; c.beginPath(); for (const p of land) trace(c, p, 0, D); c.fill(); c.restore();
    // the side wall: stacked copies, darker the deeper
    const slab = (polys, holes) => {
      for (let k = Math.ceil(D); k >= 1; k--) { const t = k / D; c.fillStyle = `rgb(${Math.round(20 - 9 * t)},${Math.round(27 - 11 * t)},${Math.round(36 - 14 * t)})`; c.beginPath(); for (const p of polys) trace(c, p, 0, k); c.fill(); }
      const g = c.createLinearGradient(0, lay.box.y, W * 0.3, lay.box.y + lay.box.h); g.addColorStop(0, '#36414e'); g.addColorStop(0.5, '#2b3541'); g.addColorStop(1, '#232c37');
      c.fillStyle = g; c.beginPath(); for (const p of polys) trace(c, p); c.fill();
    };
    slab(land);
    // texture on the land: field patches, ditches, speckle
    c.save(); c.beginPath(); for (const p of land) trace(c, p); c.clip();
    for (let i = 0; i < (W * H) / 260; i++) {
      const x = r() * W, y = r() * H; c.save(); c.translate(x, y); c.rotate((r() - 0.5) * 0.5);
      c.fillStyle = r() < 0.5 ? `rgba(255,255,255,${0.012 + r() * 0.025})` : `rgba(0,0,0,${0.03 + r() * 0.05})`; c.fillRect(0, 0, s * (1 + r() * 2.5), s * (0.5 + r() * 1.2)); c.restore();
    }
    c.strokeStyle = 'rgba(12,18,26,.35)'; c.lineWidth = 1;
    for (let i = 0; i < (W * H) / 2200; i++) { const x = r() * W, y = r() * H, a = (r() < 0.5 ? 0 : Math.PI / 2) + (r() - 0.5) * 0.3, l = s * (1.5 + r() * 3); c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
    c.restore();
    // the lake: wall on its north bank, water in it, then Flevoland on top
    c.save(); c.beginPath(); trace(c, lake); c.clip(); c.fillStyle = '#0c1117'; c.fill();
    c.fillStyle = WATER; c.beginPath(); trace(c, lake, 0, D); c.fill();
    c.strokeStyle = 'rgba(140,170,200,.06)'; for (let i = 0; i < 160; i++) { const x = r() * W, y = r() * H, l = 4 + r() * 10; c.beginPath(); c.moveTo(x, y); c.lineTo(x + l, y); c.stroke(); }
    c.restore();
    c.save(); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = sc * 0.04; c.shadowOffsetY = D; c.fillStyle = '#0b1016'; c.beginPath(); trace(c, flevo, 0, D * 0.5); c.fill(); c.restore();
    slab([flevo]);
    // rim light on the top edges
    c.strokeStyle = 'rgba(170,190,210,.20)'; c.lineWidth = 1; c.beginPath(); for (const p of [...land, flevo]) trace(c, p); c.stroke();
    c.strokeStyle = 'rgba(170,190,210,.10)'; c.beginPath(); trace(c, lake); c.stroke();
    // rivers cut into the land
    const rivers = RIVERS.map(([w, pts]) => [Math.max(2, w * sc), proj(pts)]);
    c.save(); c.beginPath(); for (const p of [...land, flevo]) trace(c, p); c.clip(); c.lineJoin = c.lineCap = 'round';
    for (const [w, pts] of rivers) {
      const line = (dy) => { c.beginPath(); pts.forEach((p, i) => { if (!i) c.moveTo(p[0], p[1] + dy); else { const q = pts[i - 1]; c.quadraticCurveTo(q[0], q[1] + dy, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + dy); } }); const e = pts[pts.length - 1]; c.lineTo(e[0], e[1] + dy); c.stroke(); };
      c.strokeStyle = '#0b1016'; c.lineWidth = w + 2; line(0); c.strokeStyle = WATER; c.lineWidth = w; line(1); c.strokeStyle = 'rgba(150,180,210,.10)'; c.lineWidth = 1; line(w * 0.3);
    }
    // small canals in the polders
    c.strokeStyle = '#111a24'; c.lineWidth = Math.max(1, sc * 0.006);
    for (let i = 0; i < 70; i++) { const x = lay.box.x + r() * lay.box.w, y = lay.box.y + r() * lay.box.h, l = s * (2 + r() * 5), a = r() < 0.5 ? 0.15 : Math.PI / 2 + 0.15; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
    c.restore();
    // where things may stand
    const fl = (x, y) => (land.some(p => inPoly(p, x, y)) && !inPoly(lake, x, y)) || inPoly(flevo, x, y);
    const nearRiver = (x, y, m) => rivers.some(([w, pts]) => { for (let i = 1; i < pts.length; i++) if (segDist(x, y, pts[i - 1], pts[i]) < w / 2 + m) return true; return false; });
    const vw = nodes.map((n, i) => { let d = 1e9; nodes.forEach((m, j) => { if (j !== i) d = Math.min(d, Math.hypot(n[0] - m[0], (n[1] - m[1]) * 1.4)); }); return Math.max(sc * 0.3, Math.min(sc * 0.5, d * 1.15)); });
    const f = lay.f;
    const busy = (x, y) => nodes.some((n, i) => { const dx = x - n[0], dy = y - n[1]; return (Math.abs(dx) < vw[i] * 0.62 && dy > -vw[i] * 0.5 && dy < f * 3.4) || (Math.abs(dx) < f * 4.2 && dy > 0 && dy < f * 3.8); });
    // the dressing: a jittered grid of silhouettes
    const items = [];
    const g = s * 1.25;
    for (let y = lay.box.y; y < lay.box.y + lay.box.h; y += g) for (let x = lay.box.x; x < lay.box.x + lay.box.w; x += g) {
      const px = x + r() * g, py = y + r() * g; if (!fl(px, py) || !fl(px, py + s * 0.4) || nearRiver(px, py, s * 0.4) || busy(px, py)) continue;
      const roll = r(); if (roll < 0.42) continue;
      const north = py < P(5.5, 52.9)[1], flevoHere = inPoly(flevo, px, py), south = py > P(5, 51.6)[1];
      let k;
      const q = r();
      if (flevoHere || (q < 0.07 && !north)) k = 'tulips';
      else if (q < 0.42) k = south && r() < 0.3 ? 'pine' : 'tree';
      else if (q < 0.5) k = 'poplar';
      else if (q < 0.58) k = 'mill';
      else if (q < 0.7) k = north ? (r() < 0.5 ? 'sheep' : 'cow') : 'cow';
      else if (q < 0.82) k = 'farm';
      else if (q < 0.86) k = 'church';
      else if (q < 0.875) k = 'lamp';
      else k = 'reeds';
      items.push({ k, x: px, y: py, s: s * (0.8 + r() * 0.5), a: r() * 6, f: r() < 0.5 });
    }
    for (const it of items) if (it.k === 'tulips') tulips(c, it.x, it.y, it.s, r, 0.8);
    items.sort((a, b) => a.y - b.y);
    for (const it of items) {
      const { x, y } = it, z = it.s;
      if (it.k === 'tree') tree(c, x, y, z * 1.1, r); else if (it.k === 'pine') pine(c, x, y, z); else if (it.k === 'poplar') { poplar(c, x, y, z); poplar(c, x + z * 0.3, y + z * 0.1, z * 0.9); }
      else if (it.k === 'mill') mill(c, x, y, z * 1.05, it.a, r() < 0.12, lights); else if (it.k === 'cow') { cow(c, x, y, z, it.f); if (r() < 0.5) cow(c, x + z * 0.6, y + z * 0.2, z * 0.9, !it.f); }
      else if (it.k === 'sheep') { sheep(c, x, y, z); sheep(c, x + z * 0.4, y + z * 0.15, z); } else if (it.k === 'farm') farm(c, x, y, z, r, lights); else if (it.k === 'church') church(c, x, y, z * 0.9, r, lights);
      else if (it.k === 'lamp') lamp(c, x, y, z, lights, 0.35); else if (it.k === 'reeds') reeds(c, x, y, z, r);
    }
    // boats on the sea and the lake
    let nb = 0; for (let i = 0; i < 4000 && nb < 16; i++) {
      const x = lay.box.x + r() * lay.box.w, y = lay.box.y + r() * lay.box.h;
      const inLake = inPoly(lake, x, y) && !inPoly(flevo, x, y);
      if ((fl(x, y) && !inLake) || fl(x, y - s) || fl(x, y + s * 0.3)) continue;
      const near = [[-2, 0], [2, 0], [0, 2], [0, -2], [-1.5, 1.5], [1.5, -1.5]].some(([dx, dy]) => fl(x + dx * s * 1.6, y + dy * s * 1.6));
      if (!near && !inLake) continue; if (busy(x, y)) continue;
      boat(c, x, y, s * (0.9 + r() * 0.4), r, lights, r() < 0.5); nb++;
    }
    // the town vignettes, back to front
    const order = towns.map((t, i) => i).sort((a, b) => nodes[a][1] - nodes[b][1]);
    for (const i of order) paintTown(c, towns[i], nodes[i], vw[i], states[i], 77 + i * 131, lights, beams, refl);
    // light: lighthouse beams, window and lamp glows, reflections in the water
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const [x, y, len] of beams) { const gr = c.createLinearGradient(x, y, x + len, y - len * 0.3); gr.addColorStop(0, 'rgba(255,230,170,.35)'); gr.addColorStop(1, 'rgba(255,230,170,0)'); c.fillStyle = gr; c.beginPath(); c.moveTo(x, y); c.lineTo(x + len, y - len * 0.42); c.lineTo(x + len, y - len * 0.12); c.closePath(); c.fill(); }
    for (const [x, y, rr, a, col] of lights) glow(c, x, y, rr, a, col);
    NRMAP.ms = { pre: Math.round(performance.now() - t0), lights: lights.length };
    for (const [x, y, len] of refl) { const gr = c.createLinearGradient(x, y, x, y + len); gr.addColorStop(0, 'rgba(255,170,70,.35)'); gr.addColorStop(1, 'rgba(255,170,70,0)'); c.fillStyle = gr; for (let k = 0; k < 4; k++) c.fillRect(x - len * 0.12 + (k % 2) * len * 0.05, y + k * len * 0.22, len * (0.22 - k * 0.04), Math.max(1, len * 0.06)); }
    c.restore(); NRMAP.ms.all = Math.round(performance.now() - t0);
  };

  // ---------------------------------------------------------------- overlay helpers (SVG strings, px)
  const LOCK = 'M-3.8,-0.4 h7.6 v6 h-7.6 z';
  const SHACKLE = 'M-2.3,-0.4 v-2 a2.3,2.3 0 0 1 4.6,0 v2';
  const HOUSE = 'M-5.6,0.4 L0,-5 L5.6,0.4 M-3.8,-1.2 v6.2 h7.6 v-6.2 M-1.2,5 v-3.2 h2.4 v3.2';
  const OPEN = 'M-3.8,-0.4 h7.6 v6 h-7.6 z';
  const SHACKLE_OPEN = 'M-2.3,-0.4 v-2.4 a2.3,2.3 0 0 1 4.5,-0.6';
  NRMAP.badge = function (t, i, state, cur, f, col) {
    const R = f * 1.3, home = t.tier === 1, green = '#7fd36a', locked = state === 'locked';
    const ring = cur ? green : locked ? '#8a94a3' : (col || '#c9b78f'), ink = locked ? '#cfd5de' : '#f2e2b8', k = (R / 11) * 1.25;
    let icon;
    if (home || cur) icon = `<path d="${HOUSE}" transform="scale(${k})" fill="none" stroke="${cur ? '#eaffdf' : '#e8e4d8'}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    else icon = `<g transform="scale(${k})"><path d="${locked ? SHACKLE : SHACKLE_OPEN}" fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${LOCK}" fill="${ink}"/><circle cy="2.4" r=".9" fill="#1b2430"/></g>`;
    return `${cur ? `<circle r="${R * 2.2}" fill="url(#nrgreen)"/>` : `<circle r="${R * 1.6}" fill="url(#nrshade)"/>`}` +
      `<circle r="${R}" fill="${cur ? '#16231a' : '#1d2632'}" stroke="${ring}" stroke-width="${cur ? 2.6 : 1.5}"/>` + icon +
      `<g transform="translate(${-R * 1.1} ${-R * 1.05})"><circle r="${f * 0.85}" fill="#0c1016" stroke="rgba(255,255,255,.2)" stroke-width="1"/><text class="num" y="${f * 0.33}" text-anchor="middle" style="font-size:${(f * 0.95).toFixed(1)}px">${t.tier}</text></g>`;
  };
  NRMAP.cyclist = function (f) {   // drawn facing right, wheels on y=0
    const k = f / 11;
    return `<g transform="scale(${k})"><circle cx="18" cy="-12" r="22" fill="url(#nrlamp)"/>` +
      `<g fill="none" stroke="#0a0d12" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="-8" cy="-6" r="6"/><circle cx="9" cy="-6" r="6"/><path d="M-8,-6 L-2,-15 L6,-15 L9,-6 M-2,-15 L0,-6 L6,-15 M-3,-17 h3 M6,-15 L5,-19 h3"/></g>` +
      `<g fill="none" stroke="#f2c06a" stroke-width="0.9" opacity=".75"><circle cx="-8" cy="-6" r="6"/><circle cx="9" cy="-6" r="6"/></g>` +
      `<path d="M-3,-17 L1,-28 L5,-26 L4,-18 L7,-12 M1,-27 L7,-20 L8,-19" fill="none" stroke="#0a0d12" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M-2,-18 L1,-28 L5,-26 Z" fill="#c4502a"/><circle cx="2.6" cy="-31.5" r="3" fill="#0a0d12" stroke="#f2c06a" stroke-width=".8"/>` +
      `<circle cx="8.6" cy="-18.6" r="1.4" fill="#fff2c4"/></g>`;
  };
  NRMAP.defs = `<filter id="nrblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
    <radialGradient id="nrgreen"><stop offset="0" stop-color="#8fe07a" stop-opacity=".55"/><stop offset=".5" stop-color="#7fd36a" stop-opacity=".18"/><stop offset="1" stop-color="#7fd36a" stop-opacity="0"/></radialGradient>
    <radialGradient id="nrshade"><stop offset=".5" stop-color="#05080c" stop-opacity=".55"/><stop offset="1" stop-color="#05080c" stop-opacity="0"/></radialGradient>
    <radialGradient id="nrlamp"><stop offset="0" stop-color="#ffd27a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
    <radialGradient id="nrdot"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".9"/><stop offset=".3" stop-color="#ffb347" stop-opacity=".35"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>`;
})();
