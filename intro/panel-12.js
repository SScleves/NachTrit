// Panel 9: "..." The scare beat. About 85% black.
// What is lit: the window (moon, fog, a skyline that watches), one slab of moonlight thrown across the
// floor toward the camera, and eyes. The slab is the true projection of what stands at the glass, so the
// head, neck, arms and fingers lie on the boards and reach for the man's feet as it leans in.
// Loop 6 s: black, dogs open (0.8, 1.2), the thing at the glass (1.0), his glint (1.6), the high pair (2.0),
// the thing leans in and the palms slide (1 to 5.7), dogs look up at the high pair (3.4),
// slow blink of the high pair (4.3), shared blink (5.7 to 6.8), the lean eases back in the dark.
(function () {
  const A = window.NRART, C = A.C;
  const WX = 40, WY = 18, WW = 92, WH = 94, FL = 120, PER = 6;
  const SY0 = FL + 1, SY1 = 176, SXL0 = 46, SXR0 = 128, SXL1 = 112, SXR1 = 216;
  const lerp = (a, b, k) => a + (b - a) * k;
  const sm = k => k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k);
  const NB = 4;                                           // lean steps (cached shadows)

  // the lean: 0 at the start, 1 just before the shared blink; eases back while every eye is shut
  function lean(T) {
    if (T < 0.8) return 1 - sm((T + 0.3) / 1.1);
    if (T < 1.0) return 0;
    if (T < 5.7) return sm((T - 1.0) / 4.7);
    return 1 - sm((T - 5.7) / 1.1);
  }
  // an eye lit between a and b: 0 shut, 1 a dim spark, 2 half, 3 full; same on the way out
  function lvl(T, a, b, blink) {
    if (T < a || T >= b) return 0;
    if (blink && T >= blink[0] && T < blink[1]) { const m = (blink[0] + blink[1]) / 2; return Math.abs(T - m) < (blink[1] - blink[0]) * 0.28 ? 0 : 1; }
    const d = T - a; return d < 0.1 ? 1 : d < 0.2 ? 2 : 3;
  }

  // ---------- the thing at the glass, as shapes in window coordinates (drawn and projected from one source)
  function shape(k) {
    const c = k / NB, hy = 50 + Math.round(2 * c), py = 64 + Math.round(3 * c);
    return { hx: 88, hy, rx: 12 + Math.round(c), ry: 15 + Math.round(c), py,
      sh: [76, hy + 12, 100, hy + 12, 113, 88, 122, 114, 56, 114, 63, 88] };
  }
  function inPoly(p, x, y) {
    let r = false;
    for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2)
      if ((p[i + 1] > y) !== (p[j + 1] > y) && x < (p[j] - p[i]) * (y - p[i + 1]) / (p[j + 1] - p[i + 1]) + p[i]) r = !r;
    return r;
  }
  function segD(x, y, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(x - ax - dx * t, y - ay - dy * t);
  }
  function blocked(s, x, y) {                              // is the light blocked at window point (x, y)?
    if (inPoly(s.sh, x, y)) return true;
    const ex = (x - s.hx) / (s.rx + 0.5), ey = (y - s.hy) / (s.ry + 0.5);
    if (ex * ex + ey * ey < 1) return true;
    if (segD(x, y, 62, 104, 68, s.py + 3) < 2.2 || segD(x, y, 114, 104, 108, s.py + 3) < 2.2) return true;
    for (const px of [68, 108]) {                          // palm and four fingers
      const dx = (x - px) / 4.5, dy = (y - s.py) / 5.5;
      if (dx * dx + dy * dy < 1) return true;
      const f = Math.round(x - px);
      if ((f === -3 || f === -1 || f === 1 || f === 3) && y > s.py - 10 && y < s.py - 3) return true;
    }
    return false;
  }

  // ---------- the moonlight slab: baked once per lean step
  const slabs = [];
  const seamX = [];                                        // floor seams (vanishing point), per row
  const VX = 86, VY = 40;
  for (let y = SY0; y <= SY1; y++) { const r = []; for (let i = -9; i <= 9; i++) r.push(Math.round(VX + (86 + i * 24 - VX) * (y - VY) / (180 - VY))); seamX[y] = r; }
  const RAMPC = [C.night1, C.night2, C.night3, C.slate3, C.mist3, C.mist4];
  function bakeSlab(k) {
    const s = shape(k), out = [];
    for (let y = SY0; y <= SY1; y++) {
      const v = (y - SY0) / (SY1 - SY0), xl = lerp(SXL0, SXL1, v), xr = lerp(SXR0, SXR1, v), vf = 1 - v * 0.5;
      const wy = WY + WH - Math.pow(v, 1.25) * WH;          // far floor is high in the window
      for (let x = Math.floor(xl) - 4; x <= xr + 4; x++) {
        let e = Math.min(x - xl, xr - x) / 5 + 0.1; if (e <= 0) continue; if (e > 1) e = 1;
        const u = (x - xl) / (xr - xl), wx = WX + u * WW;
        if (u < 0.09) continue;                            // curtain edge
        if (wy > WY + 65 && wy < WY + 68.5) continue;      // cross-bar
        if (wx > WX + 71 && wx < WX + 74) continue;        // vertical mullion
        if (blocked(s, wx, wy)) continue;                  // the thing at the glass
        const q = e * vf * 0.92 * 6, qi = q | 0, ci = qi + (q - qi > A.bayer(x, y) ? 1 : 0);
        if (ci < 1) continue;
        let c = RAMPC[Math.min(5, ci - 1)];
        if (seamX[y].indexOf(x) >= 0) c = A.step(c, -2);   // the gap between two boards
        out.push(x | (y << 9) | (c << 18));
      }
    }
    return Int32Array.from(out);
  }

  // ---------- the window background: sky, moon, a skyline that watches. Baked once.
  const WINX0 = WX - 2, WINW = WW + 4, WINY0 = WY - 2, WINH = WH + 4;
  let bgCache = null;
  function drawBg(g) {
    A.sky(g, ['night4', 'mist1', 'mist2', 'mist2', 'mist2'], WY, WY + WH, { blend: 8 });
    A.glow(g, 66, 34, 26, { color: 'mist5', strength: 0.34, power: 1.6 });
    A.moon(g, 66, 32, 5, { halo: 0.3 });
    // far fog line: church, roofs, the mill. Flat, pale, low contrast.
    const far = 'mist0', mid = 'night3';
    A.poly(g, [51, 82, 51, 56, 53, 56, 54, 48, 55, 56, 57, 56, 57, 82], far);   // church tower
    A.poly(g, [53, 48, 54, 40, 55, 48], far); A.px(g, 54, 38, far);
    for (const [x0, w, h, st] of [[40, 11, 12, 1], [58, 10, 9, 0], [68, 9, 13, 1], [104, 10, 11, 0], [114, 9, 15, 1]]) {
      A.rect(g, x0, 84 - h, w, h, far);
      if (st) { A.rect(g, x0 + 1, 84 - h - 2, w - 2, 2, far); A.rect(g, x0 + 3, 84 - h - 4, w - 6, 2, far); } else A.poly(g, [x0, 84 - h, x0 + w / 2, 84 - h - 5, x0 + w, 84 - h], far);
    }
    // nearer, darker houses frame the window: no lit windows, they are asleep or worse
    A.poly(g, [40, 112, 40, 70, 46, 70, 46, 66, 52, 66, 52, 62, 58, 62, 58, 112], mid);
    A.poly(g, [124, 112, 124, 76, 128, 70, 132, 76, 132, 112], mid);
    // the ground of the street, a pale wet slab under the fog
    A.rect(g, WX, WY + 84, WW, 10, 'mist1'); A.ditherGradient(g, WX, WY + 78, WW, 6, 'mist2', 'mist1', 'down');
    // far dead standing in the street, watching the house (tiny, the eyes are added live)
    for (const [x, h] of [[127, 14]]) {
      A.ellipse(g, x, 100 - h + 2, 2, 2, 'night2'); A.rect(g, x - 2, 100 - h + 4, 5, h - 4, 'night2'); A.vline(g, x - 2, 100 - 4, 4, 'night1'); A.vline(g, x + 2, 100 - 4, 4, 'night1');
    }
  }
  function blitBg(g) {
    if (!bgCache) {
      drawBg(g);
      bgCache = new Uint8Array(WINW * WINH);
      for (let y = 0; y < WINH; y++) bgCache.set(g.buf.subarray((WINY0 + y) * g.w + WINX0, (WINY0 + y) * g.w + WINX0 + WINW), y * WINW);
    } else for (let y = 0; y < WINH; y++) g.buf.set(bgCache.subarray(y * WINW, (y + 1) * WINW), (WINY0 + y) * g.w + WINX0);
  }

  // eyes: a pair of pixels with side glints; lvl 1..3 lights them up
  const EYE = ['', 'eye1', 'eye3', 'eye4'], EYES = ['', 'eye0', 'eye2', 'eye3'];
  function pair(g, x, y, gap, l, bloom, w, h) {
    if (!l) return;
    w = w || 1; h = h || 1;
    for (const ex of [x, x + gap]) {
      A.rect(g, ex, y, w, h, EYE[l]);
      if (l > 1) { A.px(g, ex - 1, y, EYES[l]); A.px(g, ex + w, y, EYES[l]); }
      if (l > 2 && bloom) { A.rect(g, ex, y - 1, w, 1, 'eye0'); A.rect(g, ex, y + h, w, 1, 'eye0'); }
    }
  }
  const DOG = ['', 'teal3', 'steel4', 'paper6'];
  function dogEyes(g, x, y, dx, l) { if (!l) return; A.px(g, x, y, DOG[l]); A.px(g, x + dx, y, DOG[l]); if (l > 2) A.px(g, x - Math.sign(dx), y, 'teal2'); }
  // a black silhouette with a thin cold rim on the side that faces the window
  function rimmed(g, rim, f) { f(rim, -1, -1); f('night0', 0, 0); }

  A.panels[11] = {
    text: '...',
    nl: '',
    draw(g, t) {
      const T = ((t % PER) + PER) % PER, LN = lean(T), k = Math.round(LN * NB);
      A.rect(g, -20, -20, 360, 220, 'night0');
      // ---- outside: moonlit fog, so the head stands as a silhouette against it
      blitBg(g);
      const swy = Math.sin(T / PER * Math.PI * 2);
      A.windmill(g, 121, 84, 0.55, -T / PER * Math.PI * 0.5, { tone: 'night3', stage: false, lit: 0, t });
      // wisps of fog drifting behind the head (sway, so it loops)
      for (const [cx, cy, rx, ry, ph] of [[96, 80, 16, 3, 0], [62, 72, 12, 2, 2]]) {
        const ox = Math.round(Math.sin(T / PER * Math.PI * 2 + ph) * 4);
        for (let yy = -ry; yy <= ry; yy++) for (let xx = -rx; xx <= rx; xx++) {
          const d = Math.hypot(xx / rx, yy / ry); if (d >= 1) continue;
          if ((1 - d) * 0.9 > A.bayer(cx + ox + xx, cy + yy)) A.px(g, cx + ox + xx, cy + yy, 'mist2');
        }
      }
      // far dead: their eyes open with the others
      const watch = lvl(T, 1.4, 5.7);
      if (watch > 1) for (const x of [127]) { A.px(g, x - 1, 90, 'eye1'); A.px(g, x + 1, 90, 'eye1'); }
      // the thing at the glass: head, shoulders, two arms, two palms. Its lean is the same shape the slab projects.
      const s = shape(k), hx = s.hx, hy = s.hy, py = s.py;
      A.poly(g, s.sh, 'night0');
      A.line(g, 62, 104, 68, py + 3, 'night0', 3); A.line(g, 114, 104, 108, py + 3, 'night0', 3);
      [[68, 0], [108, 1]].forEach(([px, right]) => {
        A.ditherDisc(g, px, py + 2, 8, 'mist3', 0.3, 1.2);                       // fog smear where the palm drags
        A.ellipse(g, px, py, 4, 5, 'night0');
        for (let f = -3; f <= 3; f += 2) A.vline(g, px + f, py - 10 + (Math.abs(f) === 3 ? 2 : 0), 6, 'night0');
        A.px(g, px + (right ? -5 : 5), py + 1, 'night0');
      });
      A.ellipse(g, hx, hy, s.rx, s.ry, 'night0');
      A.ellipse(g, hx, hy + 2, s.rx - 2, s.ry - 2, 'night1');                    // faint face plane, flattened on the glass
      A.vline(g, hx, hy, 6, 'night2'); A.hline(g, hx - 2, hy + 6, 5, 'night2'); A.px(g, hx - 7, hy + 4, 'night2'); A.px(g, hx + 7, hy + 4, 'night2');   // the nose flattened on the glass
      A.ellipse(g, hx - 5, hy - 2, 4, 2, 'night0'); A.ellipse(g, hx + 5, hy - 2, 4, 2, 'night0');   // sockets
      A.rect(g, hx - 2, hy + 8, 4, 4 + Math.round(1.5 * (0.5 + 0.5 * Math.sin(T / PER * Math.PI * 4 - 1))) + (k > 2 ? 1 : 0), 'night0');              // slack mouth
      for (let i = 0; i < 6; i++) A.px(g, hx - s.rx + (i < 1 || i > 4 ? 1 : 0), hy - 9 + i * 2, 'mist3');   // moon rim on the left
      A.px(g, hx - s.rx + 2, hy - 11, 'mist4'); A.px(g, hx - s.rx + 4, hy - 13, 'mist3');
      pair(g, hx - 6, hy - 3, 10, lvl(T, 1.0, 5.7, [2.9, 3.2]), true, 2, k > 1 ? 2 : 1);
      // ---- the room: black, with the window frame and a few pixels of wall
      A.rect(g, -20, -10, 60, 200, 'night0'); A.rect(g, WX + WW, -10, 260, 200, 'night0'); A.rect(g, WX, -10, WW, WY + 10, 'night0');
      [[WX - 10, 10, 'right'], [WX + WW + 2, 12, 'left']].forEach(([x, w, d]) => {
        A.ditherGradient(g, x, WY - 8, w, WH + 8, null, 'night1', d);
        for (let y = WY - 8; y < FL; y += 3) { A.hline(g, x, y, w, 'night0'); for (let xx = x + ((y / 3) & 1) * 3; xx < x + w; xx += 6) A.px(g, xx, y + 1, 'night0'); }
      });
      A.rect(g, WX - 3, WY - 3, WW + 6, 3, 'night1'); A.rect(g, WX - 3, WY - 3, 3, WH + 6, 'night1'); A.rect(g, WX + WW, WY - 3, 3, WH + 6, 'night1');
      A.hline(g, WX, WY - 1, WW, 'slate2');
      A.rect(g, WX + 72, WY, 2, WH, 'night1'); A.rect(g, WX, WY + 66, WW, 2, 'night1');
      A.hline(g, WX, WY + 66, WW, 'slate1');
      A.rect(g, WX - 6, WY + WH, WW + 12, 4, 'night1'); A.hline(g, WX - 6, WY + WH, WW + 12, 'slate3');
      const sw = Math.round(swy * 0.9);
      A.rect(g, WX, WY, 6 + sw, WH, 'night0'); A.ditherRect(g, WX + 6 + sw, WY, 4, WH, null, 'night0', 0.5);
      A.vline(g, WX + 4 + sw, WY, WH, 'night1');
      A.rect(g, 0, FL - 2, 320, 2, 'night0');
      A.hline(g, WX - 6, FL - 1, WW + 12, 'night1');
      // ---- floor: black, boards converge on the window; they only show near the light
      for (let i = -9; i <= 9; i++) {
        const bx = 86 + i * 24;
        if (bx > 250) continue;
        A.line(g, VX + (bx - VX) * (FL - VY) / (180 - VY), FL, bx, 179, 'night1');
      }
      // ---- the slab
      if (!slabs[k]) slabs[k] = bakeSlab(k);
      const sl = slabs[k], buf = g.buf, gw = g.w;
      for (let i = 0; i < sl.length; i++) { const p = sl[i]; buf[((p >> 9) & 511) * gw + (p & 511)] = p >> 18; }
      // dust in the shaft, slow and few
      for (let i = 0; i < 7; i++) {
        const u = (i * 0.19 + T / PER * (1 + (i % 2))) % 1;
        const y = 126 + u * 46, x = lerp(SXL0, SXL1, (y - SY0) / 55) + 14 + ((i * 31) % 70) + Math.sin(T / PER * Math.PI * 2 + i) * 2;
        A.px(g, x, y, i % 3 ? 'mist4' : 'paper3');
      }
      // ---- dogs and man: black cut-outs, a cold rim, eyes
      const up = sm((T - 3.4) / 0.5) * (T < 5.7 ? 1 : 0);
      // dog A lies in the slab, head to the right; it lifts its head toward the high pair
      const ah = Math.round(up * 2);
      rimmed(g, 'slate3', (c, o, oy) => {
        A.ellipse(g, 100 + o, 168 + oy, 9, 3, c); A.ellipse(g, 109 + o, 166 - ah + oy, 4, 3, c); A.rect(g, 112 + o, 167 - ah + oy, 5, 2, c);
        A.px(g, 107 + o, 162 - ah + oy, c); A.px(g, 108 + o, 163 - ah + oy, c); A.line(g, 91 + o, 167 + oy, 88 + o, 165 + oy, c);
        A.rect(g, 106 + o, 169 + oy, 7, 2, c);                                  // forepaws
      });
      dogEyes(g, 112, 165 - ah, 2, lvl(T, 0.8, 5.7, [5.7, 5.7]));
      // dog B sits in the dark, facing the window; its head turns up and right toward the high pair
      const bx = 226, by = 150, hx2 = Math.round(lerp(bx - 2, bx + 1, up)), hy2 = Math.round(lerp(by + 1, by - 3, up));
      rimmed(g, 'slate2', (c, o, oy) => {
        A.poly(g, [bx + o, by + 16 + oy, bx + 10 + o, by + 16 + oy, bx + 9 + o, by + 6 + oy, bx + 4 + o, by - 1 + oy, bx - 1 + o, by + 1 + oy, bx - 3 + o, by + 6 + oy], c);
        A.disc(g, hx2 + 1 + o, hy2 + oy, 3, c);
        A.line(g, hx2 + o, hy2 + 1 + oy, Math.round(lerp(bx - 7, bx + 5, up)) + o, Math.round(lerp(by + 3, by - 7, up)) + oy, c, 2);   // muzzle
        A.px(g, hx2 + 2 + o, hy2 - 4 + oy, c); A.px(g, hx2 + 3 + o, hy2 - 3 + oy, c);                                                   // ear
      });
      dogEyes(g, hx2 - 1, hy2 - 1, 3, lvl(T, 1.2, 5.7, [5.7, 5.7]));
      // man: sits on the floor, back to the wall, in black. A sliver of orange where the jacket meets the light.
      const mx = 176, my = 150;
      const manShape = (c, o) => {
        A.disc(g, mx, my - 13, 4, c); A.rect(g, mx - 2, my - 9, 5, 3, c);
        A.poly(g, [mx - 6 + o, my + 12, mx - 7 + o, my + 1, mx - 5 + o, my - 6, mx - 2 + o, my - 8, mx + 3, my - 8, mx + 6, my - 5, mx + 8, my + 4, mx + 9, my + 12], c);
        A.rect(g, mx - 9 + o, my + 6, 18, 6, c);                               // knees and shins
      };
      manShape('slate3', -1);                                                  // cold edge on top of him
      A.poly(g, [mx - 6, my - 5, mx - 8, my + 1, mx - 8, my + 12, mx - 6, my + 12], 'orange4');   // the jacket edge toward the window
      manShape('night0', 0);
      A.line(g, mx - 6, my - 6, mx - 4, my - 8, 'orange6'); A.px(g, mx - 3, my - 8, 'orange6');
      A.vline(g, mx - 7, my - 2, 5, 'orange4'); A.vline(g, mx - 8, my + 2, 4, 'orange3'); A.px(g, mx - 9, my + 7, 'orange2');
      A.px(g, mx - 3, my - 15, 'slate2'); A.px(g, mx - 2, my - 16, 'slate2');   // the crown of his head, no more
      if (lvl(T, 1.6, 5.7) > 1) A.px(g, mx - 1, my - 13, 'steel4');            // the shine of his eye
      // ---- eyes in the black: one pair, too high and too wide for a dog
      pair(g, 267, 48, 7, lvl(T, 2.0, 5.7, [4.3, 4.75]), true);
      // ---- it says it through the glass while it leans in: a dim bubble, so the room stays dark
      if (T > 2.4 && T < 5.5) A.say(g, hx + 10, hy + 6, 'Gezellig.', { size: 7, dx: 30, dy: 28, fill: 'mist4', edge: 'mist2', color: 'night0' });
    },
  };
})();
