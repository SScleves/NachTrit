// Panel 7: page one, de or het. There is no rule. There is never a rule.
// A desk at night, seen from above. The open book fills the frame under a banker's lamp (key light, top centre).
// Layers: desk planks with a cold moonlight slab from a window off frame left (far) / cover and paper (mid) /
// the mug, the hands and a dog peeking over the desk edge (near). The paper is lit by hand inside its own ramp,
// so it never turns grey-blue. The big red pencil question mark is the focal point and the only moving red.
// Loops (all seamless): the question mark breathes (3 s) and the pencil goes over it again (6 s), steam off the
// mug, dust in the lamp glow and in the moon slab, the bookmark ribbon, plus a rare lamp dip (never at t=0).
// The static layers are painted once and cached; only the loops are drawn each frame.
(function () {
  const A = window.NRART;
  const DE = ['de hond', 'de vrouw', 'de fiets', 'de nacht', 'de molen'], HET = ['het huis', 'het brood', 'het ei', 'het water', 'het meisje'];
  const CX = 160, X0 = 36, X1 = 284, Y0 = 22, Y1 = 160;           // book page area
  const DEX = 68, HETX = 220, ROW0 = 78, ROWH = 12;
  const TAU = Math.PI * 2, cache = new WeakMap();
  const hash = A.hash;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

  // ---- value noise, for foxing and warp
  function vnoise(x, y, s) {
    const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
    const a = hash(x0 + s, y0), b = hash(x0 + 1 + s, y0), c = hash(x0 + s, y0 + 1), d = hash(x0 + 1 + s, y0 + 1);
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }

  // ---- the paper: lit by hand, always on the paper ramp (plus a little amber under the lamp)
  const LAMP_Y = 12;
  function pageV(x, y, dv) {
    const d = Math.min(1, Math.hypot((x - CX) / 140, (y - LAMP_Y) / 150));
    let v = 1 - 0.6 * Math.pow(d, 1.15);
    const gd = Math.abs(x - CX); if (gd < 22) v -= 0.38 * Math.pow(1 - gd / 22, 1.6);
    const e = Math.min(x - X0, X1 - 1 - x); if (e < 8) v -= 0.2 * (1 - e / 8);
    if (y > 130) v -= 0.15 * (y - 130) / 30;
    v -= 0.09 * Math.max(0, vnoise(x / 23, y / 17, 7) - 0.5) * 2.2 + 0.05 * Math.max(0, vnoise(x / 9, y / 7, 31) - 0.62) * 2;   // foxing
    v += (hash(Math.floor(x / 7), y) - 0.5) * 0.03;                                                                        // grain along the page
    v -= 0.035 * (0.5 + 0.5 * Math.sin(y / 9 + (x < CX ? 0 : 2)));                                                          // slight warp
    if (hash(x, y) < 0.01) v -= 0.1;                                                                                       // a rare fleck
    // pencil smudge under the question mark, and the pale patch where it was rubbed out
    const sx = (x - 163) / 30, sy = (y - 108) / 52, sm = sx * sx + sy * sy;
    if (sm < 1) v -= 0.13 * (1 - sm) * (0.6 + 0.8 * vnoise(x / 5, y / 5, 3));
    if (x > 140 && x < 158 && y > 118 && y < 126 && vnoise(x / 3, y / 3, 9) > 0.3) v += 0.12;
    return v + (dv || 0);
  }
  function paperPx(g, x, y, dv, warmOk) {
    const v = clamp(pageV(x, y, dv), 0, 1), s = 2 + v * 4, i = Math.floor(s);
    const idx = i >= 6 ? 6 : (s - i > A.bayer(x, y) ? i + 1 : i);
    if (warmOk !== false) {
      const d = Math.hypot((x - CX) / 140, (y - LAMP_Y) / 150), w = Math.max(0, 0.4 - d) / 0.4;
      if (idx >= 6 && w > 0.05) { A.px(g, x, y, w * 0.9 > A.bayer(x + 1, y) ? (w > 0.75 && w - 0.55 > A.bayer(x, y + 1) ? 'amber7' : 'amber8') : 'paper6'); return; }
    }
    A.px(g, x, y, 'paper' + idx);
  }

  function wood(g) {
    // far layer: desk planks, horizontal, with long grain streaks, knots and seams
    for (let y = 0; y < 180; y++) {
      const plank = Math.floor(y / 36), py = y % 36;
      for (let x = 0; x < 320; x++) {
        const lane = Math.floor((y + plank * 5) / 2);
        const h = hash(Math.floor((x + plank * 61) / (14 + hash(lane, 3) * 40)), lane + plank * 97);
        let c = 'wood2';
        if (h < 0.22) c = 'wood1'; else if (h > 0.86) c = 'wood3';
        if (hash(x, y * 3) > 0.985) c = 'wood1';
        if (py === 0) c = 'wood0'; else if (py === 1) c = 'wood3';
        A.px(g, x, y, c);
      }
    }
    for (const [kx, ky] of [[22, 104], [250, 22], [200, 170]]) {
      for (let r = 7; r >= 1; r -= 2) A.ring(g, kx, ky, r, r % 4 === 3 ? 'wood1' : 'wood3', 1);
      A.ellipse(g, kx, ky, 2, 1, 'wood0');
    }
  }

  function pencil(g) {
    // a graphite pencil, slate and steel with a wooden tip, lying in the moon slab
    A.shadow(g, 22, 46, 22, 3, 0.55);
    for (let k = -2; k <= 2; k++) A.line(g, 6, 29 + k, 34, 41 + k, k < -1 ? 'steel5' : k < 0 ? 'slate6' : k < 2 ? 'slate5' : 'slate3');
    A.line(g, 6, 27, 34, 39, 'mist6'); A.line(g, 8, 28, 30, 37, 'mist7');
    A.poly(g, [34, 38, 45, 43, 34, 44], 'wood5'); A.poly(g, [40, 41, 45, 43, 40, 43], 'wood6'); A.px(g, 44, 43, 'slate2'); A.px(g, 45, 43, 'slate1');
    A.rect(g, 3, 26, 4, 8, 'red4'); A.rect(g, 7, 26, 2, 9, 'steel5'); A.rect(g, 9, 26, 1, 9, 'steel3'); A.px(g, 3, 26, 'red5');
  }

  function cover(g) {
    // the book's cover, a rim of red cloth around the pages, with gilt line
    A.rect(g, X0 - 7, Y0 - 5, X1 - X0 + 14, Y1 - Y0 + 13, 'red1');
    A.rect(g, X0 - 6, Y0 - 4, X1 - X0 + 12, Y1 - Y0 + 11, 'red2');
    for (let i = 0; i < 400; i++) { const x = X0 - 6 + Math.floor(hash(i, 1) * (X1 - X0 + 12)), y = Y0 - 4 + Math.floor(hash(i, 2) * (Y1 - Y0 + 11)); A.px(g, x, y, hash(i, 3) > 0.5 ? 'red3' : 'red1'); }
    A.hline(g, X0 - 6, Y0 - 4, X1 - X0 + 12, 'red4');
    A.rect(g, X0 - 6, Y0 - 4, 1, Y1 - Y0 + 11, 'red3');
    A.hline(g, X0 - 5, Y1 + 5, X1 - X0 + 10, 'amber4');     // gilt line
    A.hline(g, X0 - 3, Y1 + 4, X1 - X0 + 6, 'red1');
    A.shadow(g, CX, Y1 + 9, 150, 5, 0.7);
    // the cover falls into the dark away from the lamp
    for (let x = X0 - 7; x < X1 + 7; x++) { const f = (Math.abs(x - CX) - 60) / 100; if (f > 0) A.tint(g, x, Y0 - 5, 1, Y1 - Y0 + 14, 'night1', Math.min(0.6, 0.55 * f), 'mul'); }
  }

  function moon(g) {
    // a window off frame left throws a pale slab (two panes, a mullion) over the desk, the pencil and the cover edge
    for (let y = 0; y < 180; y++) {
      const a = -34 + y * 0.55, amt = 0.34 * (1 - y / 215); if (amt <= 0) continue;
      for (const [p, q] of [[0, 15], [19, 33], [37, 52]]) A.tint(g, a + p, y, q - p, 1, 'mist6', amt * (p > 30 ? 0.7 : 1), 'add');
    }
  }

  function pages(g) {
    const edge = x => Y1 - 2 + Math.round(2 * Math.max(0, 1 - Math.abs(x - CX) / 124));  // pages dip toward the gutter
    for (let x = X0; x < X1; x++) {
      const yb = edge(x);
      for (let y = Y0; y < yb; y++) paperPx(g, x, y);
      // page block below: layered leaves
      const cols = [4, 5, 3, 4, 2, 2];
      for (let k = 0; k < 6; k++) { const v = clamp(pageV(x, yb + k, 0) + 0.1, 0, 1); A.px(g, x, yb + k, 'paper' + clamp(Math.round(cols[k] - (1 - v) * 2.5) - (k > 3 ? 1 : 0), 1, 6)); }
      A.px(g, x, yb + 6, 'red1');
    }
    for (const [sx, dir] of [[X0, -1], [X1 - 1, 1]]) for (let k = 1; k <= 4; k++) A.vline(g, sx + dir * k, Y0 + k, Y1 - Y0 - 2 - k, k & 1 ? 'paper2' : 'paper3');
    A.hline(g, X0, Y0 - 1, X1 - X0, 'paper5');                // top edge catches the lamp
    // gutter
    A.vline(g, CX, Y0, Y1 - Y0 + 3, 'paper0'); A.vline(g, CX - 1, Y0, Y1 - Y0 + 3, 'paper1'); A.vline(g, CX + 1, Y0, Y1 - Y0 + 3, 'paper1');
    for (let y = Y0 + 6; y < Y1; y += 9) { A.px(g, CX - 1, y, 'paper0'); A.px(g, CX + 1, y + 4, 'paper0'); } // stitching
  }

  function ink(g, x, y, c) { A.px(g, x, y, c); }
  function printed(g) {
    // printed grammar: running heads, ornament rules, and body paragraphs under the word lists
    const seg = (x0, y, wTot, seed, dv) => {
      let x = x0, k = 0; while (x < x0 + wTot) {
        const w = 4 + Math.floor(hash(k, seed + y) * 10); for (let i = 0; i < w && x + i < x0 + wTot; i++) paperPx(g, x + i, y, dv, false);
        x += w + 3; k++;
      }
    };
    for (let r = 0; r < 3; r++) seg(68, 134 + r * 3, r === 2 ? 38 : 62, 10 + r, -0.3);
    for (let x = 62; x < 136; x++) paperPx(g, x, 36, -0.14, false);
    for (let x = 184; x < 262; x++) paperPx(g, x, 36, -0.14, false);
    for (const [px, rows] of [[DEX, DE], [HETX, HET]]) for (let i = 0; i < rows.length; i++) {
      const y = ROW0 + i * ROWH + 2; for (let x = px; x < px + 56; x++) if ((x + i) % 4 !== 3) paperPx(g, x, y, -0.12, false);
    }
  }

  // ---- pencil marks: graphite ticks that are crossed out, and the red pencil
  const GR = 'slate4';
  const SL = 'slate2';
  function tick(g, x, y) {
    A.line(g, x, y - 4, x + 2, y - 1, GR); A.line(g, x + 1, y - 4, x + 2, y - 2, GR); A.line(g, x + 2, y - 1, x + 7, y - 9, GR); A.line(g, x + 3, y - 1, x + 8, y - 9, GR); A.px(g, x + 2, y, 'slate3');
  }
  function cross(g, x, y) { A.line(g, x, y - 9, x + 6, y - 1, GR); A.line(g, x + 6, y - 9, x, y - 1, GR); }
  function slash(g, x, y, s) {       // one hard diagonal stroke through a mark, longer than the mark
    const d = s & 1;
    A.line(g, x - 1, y - 10 + d, x + 9, y + 1, SL); A.line(g, x, y - 10 + d, x + 10, y + 1, SL);
  }
  function strike(g, x, y, s) {      // a flat strike-through, for the crosses
    const d = s & 1;
    A.line(g, x - 2, y - 5 + d, x + 9, y - 4, SL); A.line(g, x - 2, y - 4 + d, x + 9, y - 3, SL);
  }
  function ruling(g) {
    for (let i = 0; i < 5; i++) {
      const y = ROW0 + i * ROWH + 1, x0 = 42, x1 = 189;
      // DE: tick, crossed out, ticked again (and de molen: crossed out twice)
      tick(g, x0, y); slash(g, x0, y, i); tick(g, x0 + 13, y); if (i === 4) slash(g, x0 + 13, y, 1);
      // HET: every mark crossed out, two of them ticked again, none of it agreeing
      if (i & 1) tick(g, x1, y); else cross(g, x1, y);
      if (i & 1) slash(g, x1, y, i); else strike(g, x1, y, i);
      if (i === 3) { tick(g, x1 + 13, y); slash(g, x1 + 13, y, 0); }
    }
    // red heading underlines: wobbly pencil
    for (const cx of [98, 234]) for (let k = 0; k < 2; k++) for (let x = cx - 20; x < cx + 20; x++) A.px(g, x, 60 + k + Math.round(Math.sin(x * 0.4 + cx) * 0.7), k ? 'red3' : 'red4');
    // the loop round 'het meisje' (the girl is neuter, apparently)
    const tw = A.textWidth('het meisje', 9), cx = HETX + tw / 2, cy = ROW0 + 4 * ROWH - 3, rx = tw / 2 + 8, ry = 9.5;
    for (let pass = 0; pass < 2; pass++) {
      const n = 160; for (let k = 0; k < n; k++) {
        const u = k / n, th = -0.5 + u * (TAU + 1.3 + pass * 0.3), r = 1 + (u - 0.5) * 0.14 * (pass ? -1 : 1);
        const x = cx + Math.cos(th) * rx * r + pass, y = cy + Math.sin(th) * ry * r + pass * 0.6;
        if (hash(k, pass + 40) > 0.1) { A.px(g, Math.round(x), Math.round(y), pass ? 'red3' : 'red4'); if (!pass && u > 0.5) A.px(g, Math.round(x), Math.round(y) + 1, 'red3'); }
      }
    }
    A.line(g, Math.round(cx + rx * 0.7), Math.round(cy + ry + 1), Math.round(cx + rx * 0.7 + 7), Math.round(cy + ry + 6), 'red4');   // the flick, pointing down to the note
  }

  function coffeeRing(g) {
    // an old mug ring on the open left page; the page's own ramp, a stain not a pattern
    const rings = [[134, 146, 14, 10, 0.9], [139, 142, 12, 9, 0.5]];
    for (const [cx, cy, rx, ry, a] of rings) {
      for (let k = 0; k < 360; k++) {
        const th = k / 360 * TAU; if (th > 4.2 && th < 4.9) continue;
        for (let w = 0; w < 2; w++) {
          const x = Math.round(cx + (rx - w) * Math.cos(th)), y = Math.round(cy + (ry - w) * Math.sin(th));
          const d = Math.sin(th * 2 + 1) * 0.3 + a;
          if (d > A.bayer(x, y) + (w ? 0.35 : 0)) A.px(g, x, y, w ? 'wood5' : (hash(x, y) > 0.5 ? 'wood4' : 'wood3'));
        }
      }
    }
    for (const [x, y] of [[120, 154], [146, 150], [142, 137], [126, 139]]) { A.px(g, x, y, 'wood4'); A.px(g, x + 1, y, 'wood5'); }
  }

  // ---- the red pencil question mark
  const QPTS = [[141, 82], [143, 69], [153, 61], [166, 61], [175, 69], [177, 81], [171, 93], [162, 102], [158, 111], [160, 122], [162, 126]];
  const DOT = [160, 143];
  function catmull(pts, per) {
    const out = [], n = pts.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
      for (let k = 0; k < per; k++) {
        const t = k / per, t2 = t * t, t3 = t2 * t;
        out.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                  0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    return out;
  }
  function stamp(grid, cx, cy, r, v) {
    for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y++) for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++) {
      if (x < 0 || y < 0 || x >= 320 || y >= 180) continue;
      const d = Math.hypot(x - cx, y - cy); if (d <= r + 0.3) { const i = y * 320 + x, val = v * (1 - 0.35 * d / (r + 0.5)); if (val > grid[i]) grid[i] = val; }
    }
  }
  let QS = null;   // question mark, built once: path samples, the breathing core pixels
  function buildQ() {
    const widen = ([x, y]) => [CX + (x - CX) * 1.3, y];
    const pathB = catmull(QPTS.map(widen), 22), n = pathB.length;
    const pathC = catmull(QPTS.map(([x, y], i) => widen([x + (hash(i, 11) - 0.5) * 3.2, y + (hash(i, 12) - 0.5) * 3])), 22);
    const rad = u => 1.3 + 3 * Math.sin(Math.PI * Math.pow(u, 0.75));
    const gB = new Float32Array(320 * 180), gC = new Float32Array(320 * 180), gA = new Float32Array(320 * 180);
    pathB.forEach(([x, y], k) => { const u = k / (n - 1); stamp(gB, x, y, rad(u), 1); stamp(gA, x + 2, y + 1.5, rad(u) * 1.15 + 0.6, 1); });
    pathC.forEach(([x, y], k) => { const u = k / (n - 1); stamp(gC, x - 0.5, y, rad(u) * 0.5, 1); });
    const dx = CX + (DOT[0] - CX) * 1.3, dy = DOT[1];
    stamp(gB, dx, dy, 5.4, 1); stamp(gC, dx - 1, dy - 1, 3, 1); stamp(gA, dx + 2, dy + 2, 7, 1);
    QS = { pathB, rad, gB, gC, gA, core: [], dx, dy };
    for (let y = 0; y < 180; y++) for (let x = 0; x < 320; x++) {
      const i = y * 320 + x;
      if ((gB[i] >= 0.6 || gC[i] > 0) && hash(x, y + 5) > 0.07) QS.core.push([x, y, clamp((gC[i] > 0 ? 0.45 : 0.1) + hash(x + 3, y) * 0.3 + (gB[i] > 0.85 ? 0.12 : 0), 0, 1)]);
    }
  }
  function paintQ(g) {
    buildQ();
    const { gB, gA, dx, dy } = QS;
    for (let i = 0; i < gA.length; i++) if (gA[i] > 0 && gB[i] === 0 && hash(i, 2) > 0.45) A.px(g, i % 320, Math.floor(i / 320), 'red1');            // the dent of the pencil
    for (let i = 0; i < gB.length; i++) if (gB[i] > 0 && gB[i] < 0.6 && hash(i, 4) > 0.14) A.px(g, i % 320, Math.floor(i / 320), 'red3');            // soft edge
    // ink bleed round the dot, and emphasis flicks
    for (let k = 0; k < 40; k++) { const th = k / 40 * TAU; if (hash(k, 77) > 0.5) A.px(g, Math.round(dx + Math.cos(th) * 6.8), Math.round(dy + Math.sin(th) * 6.8), 'red2'); }
    A.line(g, 196, 66, 202, 61, 'red3'); A.line(g, 198, 76, 205, 75, 'red3'); A.line(g, 195, 57, 198, 51, 'red3');
  }
  function drawQ(g, t) {
    const pulse = 0.5 + 0.5 * Math.sin(TAU * t / 3 - 1.2), { core, pathB, rad } = QS;
    for (let j = 0; j < core.length; j++) {
      const c = core[j], lvl = 3 + (0.12 + 0.88 * pulse) * 1.7 + c[2] * 1.3;
      let i = Math.floor(lvl); if (lvl - i > A.bayer(c[0], c[1])) i++;
      A.px(g, c[0], c[1], 'red' + clamp(i, 3, 6));
    }
    // the pencil goes over it again: a bright tip and a fading tail running down the stroke
    const n = pathB.length, h = Math.floor(((t % 6) / 6) * 1.3 * n);
    for (let k = 0; k < 14; k++) { const q = h - k; if (q < 0 || q >= n) continue; A.px(g, Math.round(pathB[q][0]), Math.round(pathB[q][1]), k < 3 ? 'red6' : k < 8 ? 'red5' : 'red4'); }
  }

  // ---- near plane
  function hand(g, m, oy, thumb) {
    const X = x => m > 0 ? x : 319 - x, Y = y => y + oy;
    const poly = (pts, c) => A.poly(g, pts.map(([x, y]) => [X(x), Y(y)]).flat(), c);
    const line = (a, b, c, d, col) => A.line(g, X(a), Y(b), X(c), Y(d), col);
    const px = (x, y, c) => A.px(g, X(x), Y(y), c);
    A.shadow(g, X(56), Y(160), 20, 4, 0.55);
    // jacket sleeve: orange4-7 with a lamp rim and a cuff, kept out of the night vignette
    poly([[0, 150], [26, 144], [40, 186], [0, 186]], 'orange4');
    poly([[0, 166], [32, 160], [36, 186], [0, 186]], 'orange3');
    line(0, 149, 26, 143, 'orange7'); line(0, 151, 26, 145, 'orange6');
    line(6, 154, 15, 176, 'orange5'); line(13, 150, 22, 172, 'orange5'); line(4, 170, 18, 168, 'orange2'); line(8, 178, 30, 174, 'orange2');
    poly([[22, 144], [31, 142], [41, 170], [33, 173]], 'orange5'); line(22, 144, 31, 142, 'orange7'); line(33, 173, 41, 170, 'orange2'); line(31, 142, 41, 170, 'orange6');
    // back of the hand
    poly([[31, 145], [47, 141], [55, 151], [47, 166], [36, 168]], 'skin4');
    line(31, 145, 47, 141, 'skin5'); line(47, 141, 55, 151, 'skin5'); line(36, 168, 47, 166, 'skin2'); line(33, 160, 44, 163, 'skin3');
    for (const [kx, ky] of [[48, 143], [52, 147], [54, 151]]) px(kx, ky, 'skin6');
    // fingers: capsules with a lit top, a shaded underside, knuckle creases and a pale nail
    const finger = (a, b, ang, len, w) => {
      const ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca;
      for (let k = 0; k <= len; k++) {
        const tipw = k > len - 2 ? w - (k - (len - 2)) * 0.8 : w;
        for (let o = -tipw / 2; o <= tipw / 2; o += 1) {
          const f = (o + w / 2) / w;                       // 0 = top edge (toward the lamp), 1 = underside
          const c = f < 0.2 ? 'skin6' : f < 0.55 ? 'skin5' : f < 0.85 ? 'skin4' : 'skin2';
          px(Math.round(a + ca * k + nx * o), Math.round(b + sa * k + ny * o), c);
        }
        if (k === Math.round(len * 0.42) || k === Math.round(len * 0.74)) { px(Math.round(a + ca * k + nx * (w * 0.35)), Math.round(b + sa * k + ny * (w * 0.35)), 'skin3'); px(Math.round(a + ca * k - nx * (w * 0.1)), Math.round(b + sa * k - ny * (w * 0.1)), 'skin3'); }
      }
      for (let k = len - 3; k <= len - 1; k++) { px(Math.round(a + ca * k + nx * -0.8), Math.round(b + sa * k + ny * -0.8), 'paper5'); }
      px(Math.round(a + ca * (len - 3) + nx * 1.2), Math.round(b + sa * (len - 3) + ny * 1.2), 'skin3');
    };
    const D = Math.PI / 180;
    finger(50, 144, -38 * D, 15, 4); finger(54, 149, -20 * D, 17, 4); finger(55, 154, -2 * D, 16, 4); finger(53, 159, 18 * D, 12, 3.4);
    if (thumb) finger(40, 151, -64 * D, 16, 5);
  }

  function mug(g) {
    // a big cropped mug in the near dark: only its lit left side and its rim read
    const cx = 310, yr = 74;
    A.shadow(g, cx + 6, yr + 44, 34, 6, 0.75);
    A.rect(g, cx - 25, yr, 52, 40, 'brick4');
    A.rect(g, cx - 25, yr, 4, 40, 'brick6'); A.rect(g, cx - 21, yr, 5, 40, 'brick5'); A.rect(g, cx + 12, yr, 15, 40, 'brick2'); A.rect(g, cx + 20, yr, 7, 40, 'brick1');
    A.ellipse(g, cx, yr + 40, 25, 7, 'brick2');
    A.ellipse(g, cx, yr, 26, 9, 'brick5'); A.ellipse(g, cx, yr, 25, 8, 'amber4'); A.ellipse(g, cx, yr + 1, 22, 6, 'wood1');
    A.ellipse(g, cx + 1, yr + 2, 19, 4, 'wood2');
    A.hline(g, cx - 22, yr - 5, 9, 'amber6'); A.hline(g, cx - 18, yr - 7, 4, 'amber8');     // rim catches the lamp
    A.hline(g, cx - 14, yr + 1, 7, 'amber6'); A.hline(g, cx - 12, yr + 2, 3, 'amber7');     // the lamp in the coffee
    A.tint(g, cx - 27, yr - 10, 54, 56, 'night1', 0.28, 'mul');
    for (let k = 0; k < 3; k++) A.ring(g, cx + 29, yr + 18, 10 - k, k === 0 ? 'brick5' : 'brick2', 1);
  }

  function dogNose(g) {
    // a dog resting its chin on the desk edge, looking up at the book: a dark near-plane shape
    const x = 112, y = 181;
    A.poly(g, [x - 26, y - 8, x - 23, y - 26, x - 11, y - 15], 'fur1'); A.poly(g, [x - 24, y - 10, x - 22, y - 22, x - 14, y - 15], 'fur2');
    A.poly(g, [x + 26, y - 8, x + 23, y - 26, x + 11, y - 15], 'fur1'); A.poly(g, [x + 24, y - 10, x + 22, y - 22, x + 14, y - 15], 'fur2');
    A.ellipse(g, x, y, 26, 18, 'fur1'); A.ellipse(g, x, y + 1, 25, 17, 'fur2');
    A.ellipse(g, x, y - 12, 15, 4, 'fur3'); A.hline(g, x - 9, y - 16, 14, 'fur4'); A.hline(g, x - 5, y - 17, 6, 'fur5');
    for (const ex of [x - 11, x + 11]) { A.ellipse(g, ex, y - 7, 3, 2, 'slate0'); A.px(g, ex - 1, y - 8, 'amber6'); A.px(g, ex, y - 8, 'amber8'); A.hline(g, ex - 4, y - 11, 8, 'fur1'); }
  }

  function lampShade(g) {
    // banker's lamp seen from above: a green enamel dome, a brass rim, a crescent of light leaking underneath
    A.poly(g, [CX - 24, -2, CX + 24, -2, CX + 36, 12, CX - 36, 12], 'green5');
    A.poly(g, [CX - 24, -2, CX - 8, -2, CX - 16, 12, CX - 36, 12], 'green4');
    A.poly(g, [CX + 4, -2, CX + 24, -2, CX + 36, 12, CX + 18, 12], 'green6');
    A.line(g, CX + 24, -2, CX + 36, 12, 'green7'); A.line(g, CX + 22, -2, CX + 33, 11, 'green7'); A.line(g, CX - 22, 1, CX - 31, 11, 'green3');
    A.hline(g, CX + 8, 1, 10, 'green7'); A.hline(g, CX + 12, 4, 8, 'green7');
    A.ellipse(g, CX, 13, 37, 3, 'amber5'); A.ellipse(g, CX, 14, 35, 2, 'amber7'); A.ellipse(g, CX, 14, 18, 1, 'amber8');
    A.hline(g, CX - 36, 12, 12, 'amber6');
  }

  function paintStatic(g) {
    A.depth(g, 0.4); wood(g);
    A.depth(g, 1);
    // the desk: a wide warm pool from the lamp, then the room falls into the dark
    A.glow(g, CX, 20, 200, { ry: 150, color: 'amber6', strength: 0.34, power: 1.1 });
    for (let x = 0; x < 320; x++) { const f = Math.max(0, (Math.abs(x - CX) - 90) / 80); if (f > 0) A.tint(g, x, 0, 1, 180, 'night0', Math.min(0.75, 0.75 * f * f), 'mul'); }
    cover(g); moon(g); A.depth(g, 0.85); pencil(g); A.depth(g, 1); pages(g); printed(g); coffeeRing(g); ruling(g); paintQ(g);
    // top-right corner dog-eared: the missing corner shows the cover, the flap is the page's back, with a shadow under its fold
    A.poly(g, [X1 - 16, Y0, X1, Y0, X1, Y0 + 16], 'red2'); A.hline(g, X1 - 16, Y0 - 1, 17, 'red4');
    for (let k = 1; k <= 3; k++) A.line(g, X1 - 16 + k, Y0 + 16 + k, X1 + k - 1, Y0 + 16 + k, k === 1 ? 'paper2' : 'paper3');
    for (let k = 1; k <= 3; k++) A.line(g, X1 - 16 - k, Y0 + k, X1 - 16 - k, Y0 + 16, k === 1 ? 'paper3' : 'paper4');
    for (let y = 0; y <= 16; y++) for (let x = 0; x <= y; x++) A.px(g, X1 - 16 + x, Y0 + y, 'paper' + (6 - Math.min(2, Math.floor((16 - y + x) / 8))));
    A.line(g, X1 - 16, Y0, X1, Y0 + 16, 'paper3'); A.line(g, X1 - 15, Y0, X1, Y0 + 15, 'paper2');
    A.depth(g, 1); mug(g); dogNose(g); hand(g, 1, 0, true); hand(g, -1, 4, false); lampShade(g);
    A.tint(g, 0, 150, 320, 30, 'night0', 0.0, 'mul');
  }

  // the lamp dip: one step down the paper ramp, dithered, so the paper stays paper
  const DIP = new Uint8Array(256); for (let i = 0; i < 256; i++) DIP[i] = i;
  for (let k = 1; k <= 6; k++) DIP[A.C['paper' + k]] = A.C['paper' + (k - 1)];

  A.panels[9] = {
    text: 'Page one: de or het. There is no rule. There is never a rule.',
    nl: 'Pagina één: de of het. Er is geen regel. Er is nooit een regel.',
    draw(g, t) {
      const c = cache.get(g);
      if (c) { g.buf.set(c.buf); g.mask.set(c.mask); }
      else { paintStatic(g); cache.set(g, { buf: g.buf.slice(), mask: g.mask.slice() }); }
      A.depth(g, 1);

      // loop 1: the lamp hums, now and then it dips (never on the first frame)
      const m = t % 5;
      if ((m > 2.6 && m < 2.66) || (m > 3.1 && m < 3.14)) for (let y = Y0; y < Y1 + 6; y++) for (let x = X0; x < X1; x++) if (((x + y) & 1) === 0) { const i = y * 320 + x; g.buf[i] = DIP[g.buf[i]]; }

      // loop 2: the red pencil question mark, breathing and being gone over again
      drawQ(g, t);

      // loop 3: steam off the big mug, a few soft wisps (dithered blobs that widen as they fade)
      for (let w = 0; w < 3; w++) for (let k = 0; k < 26; k++) {
        const u = (t / 5 + w / 3 + k * 0.018) % 1, y = 66 - u * 52, x = 296 + w * 10 + Math.sin(TAU * (t / 5 + w * 0.3) + k * 0.4) * (2 + k * 0.25), r = 1.5 + k * 0.17;
        const a = Math.sin(Math.PI * (1 - k / 26)) * (1 - u) * 0.55;
        for (let yy = -2; yy <= 2; yy++) for (let xx = -3; xx <= 3; xx++) if (xx * xx / 9 + yy * yy / 4 <= 1 && a * (1 - Math.hypot(xx / 3, yy / 2) * 0.6) > A.bayer(Math.round(x) + xx, Math.round(y) + yy) * 0.7) A.px(g, Math.round(x + xx * r / 2), Math.round(y + yy * r / 3), k < 9 ? 'mist6' : k < 17 ? 'mist5' : 'mist4');
      }

      // loop 4: dust in the air, in the lamp glow and in the moon slab (never on the page), and the ribbon
      const ph = (t % 8) / 8;
      for (let i = 0; i < 6; i++) { const x = 104 + hash(i, 2) * 112 + Math.sin(TAU * (ph + hash(i, 3))) * 4, y = 3 + ((ph + hash(i, 1)) % 1) * 19; if (y < 21) A.px(g, x, y, i & 1 ? 'amber8' : 'amber7'); }
      for (let i = 0; i < 7; i++) { const u = (ph + hash(i, 5)) % 1, y = 8 + u * 140, x = -20 + y * 0.55 + 6 + hash(i, 6) * 40 + Math.sin(TAU * (ph * 2 + hash(i, 7))) * 3; if (u > 0.05 && u < 0.95 && x > 2 && x < 34 - (y > 80 ? 0 : 0)) A.px(g, x, y, i & 1 ? 'mist7' : 'mist6'); }
      const sw = Math.sin(TAU * t / 4) * 2;
      for (let k = 0; k < 18; k++) { const x = CX + 4 + Math.round(sw * (k / 18) * (k / 18)); A.rect(g, x, Y1 + 3 + k, 3, 1, k % 6 < 1 ? 'red5' : 'red3'); A.px(g, x, Y1 + 3 + k, 'red4'); }
      A.poly(g, [CX + 4 + Math.round(sw), Y1 + 21, CX + 7 + Math.round(sw), Y1 + 21, CX + 5 + Math.round(sw), Y1 + 18], 'night1');

      // labels (crisp, hi-res): printed headings in slate, pencilled-in words
      A.text(98, 54, 'DE', 'slate5', 16, true, { align: 'center' }); A.text(234, 54, 'HET', 'slate5', 16, true, { align: 'center' });
      DE.forEach((w, i) => A.text(DEX, ROW0 + i * ROWH, w, 'slate3', 9));
      HET.forEach((w, i) => A.text(HETX, ROW0 + i * ROWH, w, 'slate3', 9));
      for (const x of [78, 186]) {
        A.text(x, 153, 'regel:', 'slate4', 9);
        const rx = x + A.textWidth('regel: ', 9) + 1;     // the dash is red pencil, scribbled
        for (let k = 0; k < 2; k++) A.line(g, Math.round(rx), 150 + k, Math.round(rx + 11), 149 + k * 2, k ? 'red3' : 'red4');
        A.line(g, Math.round(rx + 2), 148, Math.round(rx + 10), 152, 'red3');
      }
      A.text(228, 142, 'het?!', 'red4', 9, true);
      A.text(52, 31, 'HOOFDSTUK 1', 'slate3', 6); A.text(220, 31, 'LIDWOORDEN', 'slate3', 6);
    },
  };
})();
