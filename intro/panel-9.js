// Panel 9: "..." The scare beat. ~85% black. One shaped slab of moonlight thrown across the floor
// toward the camera (with the mullion cross and the long shadow of the thing at the glass reaching
// for his feet), a head with two palms on the pane, and eyes: the dogs, the thing at the glass,
// and one pair far too high in the black. Orange is only a sliver of his jacket.
// Loop 6 s: black, dogs open, head opens, high pair opens (t 2), dogs look up (3.4),
// slow blink of the high pair (4.3), shared blink (5.7), reset.
(function () {
  const A = window.NRART;
  const WX = 40, WY = 18, WW = 92, WH = 94, FL = 120, PER = 6;
  // light slab on the floor (parallelogram thrown toward the viewer)
  const SY0 = FL + 1, SY1 = 176, SXL0 = 46, SXR0 = 128, SXL1 = 112, SXR1 = 216;
  const lerp = (a, b, k) => a + (b - a) * k;
  const sm = k => k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k);
  // an eye on when T in [a, b): returns 0 closed, 1 open
  const win = (T, a, b) => T >= a && T < b ? 1 : 0;
  function pair(g, x, y, gap, c, side, bloom) {
    A.px(g, x, y, c); A.px(g, x + gap, y, c);
    if (side) { A.px(g, x - 1, y, side); A.px(g, x + gap + 1, y, side); }
    if (bloom) { A.px(g, x, y - 1, bloom); A.px(g, x + gap, y - 1, bloom); A.px(g, x, y + 1, bloom); A.px(g, x + gap, y + 1, bloom); }
  }
  function dogEyes(g, x, y, dx, up, on) {   // tied to the head anchor; eyeshine, no yellow
    if (!on) return;
    const ey = y - (up ? 2 : 0), ex = x + (up ? Math.sign(dx) * 0 : 0);
    A.px(g, ex, ey, 'paper6'); A.px(g, ex + dx, ey, 'paper5');
    A.px(g, ex - Math.sign(dx), ey, 'teal2'); A.px(g, ex + dx * 2 / 1 - dx + Math.sign(dx), ey + 0, 'teal1');
  }
  A.panels[8] = {
    text: '...',
    nl: '...',
    draw(g, t) {
      const T = ((t % PER) + PER) % PER;
      A.key(g, 84, 40, 2);
      A.rect(g, -20, -20, 360, 220, 'night0');
      // ---- outside: moonlit fog, so the head stands as a silhouette
      A.sky(g, ['night3', 'mist0', 'mist1', 'mist2'], WY, WY + WH, { blend: 8 });
      A.moon(g, 62, 30, 4, { halo: 0.2 });
      A.depth(g, 0.3);
      A.windmill(g, 120, 102, 0.5, -t * (Math.PI * 2 / PER) * 0.25, { tone: 'night3', stage: true, lit: 0, t });
      A.canalHouse(g, 42, 104, 16, 30, { gable: 'step', brick: 'night3', lit: 0, t, seed: 41, door: false });
      A.canalHouse(g, 104, 104, 16, 26, { gable: 'bell', brick: 'night3', lit: 0, t, seed: 17, door: false });
      A.haze(g, WX, 70, WW, 42, { top: 0.1, bottom: 0.6, color: 'mist2' });
      A.depth(g, 0.8);
      // the thing at the glass: head, shoulders, two arms, two palms
      const sl = Math.sin(T / PER * Math.PI * 2), hs = sl * 1.2;            // palms slide a hair
      const hx = 88, hy = 50 + Math.round(sl * 0.5);
      A.poly(g, [76, hy + 12, 100, hy + 12, 118, 84, 128, 114, 50, 114, 58, 84], 'night0');
      A.line(g, 60, 104, 68, 66 + hs, 'night0', 3); A.line(g, 116, 104, 108, 66 - hs, 'night0', 3);
      [[68, 64 + hs], [108, 64 - hs]].forEach(([px, py], k) => {
        A.ditherDisc(g, px, py + 1, 7, 'mist4', 0.35, 1.2);                   // smear on the pane
        A.ellipse(g, px, py, 4, 5, 'night0');
        for (let f = -3; f <= 3; f += 2) A.vline(g, px + f, py - 9 + (Math.abs(f) === 3 ? 2 : 0), 5, 'night0');
        A.px(g, px + (k ? -4 : 4), py + 1, 'night0');
      });
      A.ellipse(g, hx, hy, 12, 15, 'night0');
      A.ellipse(g, hx, hy + 2, 10, 13, 'night1');                             // faint face plane
      A.rect(g, hx - 7, hy - 3, 5, 3, 'night0'); A.rect(g, hx + 3, hy - 3, 5, 3, 'night0');
      A.rect(g, hx - 2, hy + 8, 4, 5, 'night0');                              // slack mouth
      for (let i = 0; i < 5; i++) A.px(g, hx - 11 + (i < 2 ? i : 0) - (i > 2 ? 0 : 0), hy - 8 + i * 2, 'mist3'); // moon rim
      if (win(T, 1.0, 5.7)) pair(g, hx - 5, hy - 2, 10, 'eye4', 'eye2', 'eye0');
      // ---- glass: one cold veil, nothing else
      A.ditherGradient(g, WX, WY + 82, WW, 12, null, 'mist2', 'down');
      // ---- the room
      A.rect(g, -20, -10, 60, 200, 'night0'); A.rect(g, WX + WW, -10, 260, 200, 'night0');
      A.rect(g, WX, -10, WW, WY + 10, 'night0');
      // wall reveals next to the frame: brick only a few pixels deep
      [[WX - 10, 10, 'right'], [WX + WW + 2, 12, 'left']].forEach(([x, w, d]) => {
        A.ditherGradient(g, x, WY - 8, w, WH + 8, null, 'night1', d);
        for (let y = WY - 8; y < FL; y += 3) { A.hline(g, x, y, w, 'night0'); for (let xx = x + ((y / 3) & 1) * 3; xx < x + w; xx += 6) A.px(g, xx, y + 1, 'night0'); }
      });
      A.rect(g, WX - 3, WY - 3, WW + 6, 3, 'night1'); A.rect(g, WX - 3, WY - 3, 3, WH + 6, 'night1'); A.rect(g, WX + WW, WY - 3, 3, WH + 6, 'night1');
      A.hline(g, WX, WY - 1, WW, 'slate2');
      A.rect(g, WX + 72, WY, 2, WH, 'night1'); A.rect(g, WX, WY + 66, WW, 2, 'night1');
      A.hline(g, WX, WY + 66, WW, 'slate1');
      A.rect(g, WX - 6, WY + WH, WW + 12, 4, 'night1'); A.hline(g, WX - 6, WY + WH, WW + 12, 'slate3');
      const sw = Math.round(Math.sin(T / PER * Math.PI * 2) * 0.9);
      A.rect(g, WX, WY, 6 + sw, WH, 'night0'); A.ditherRect(g, WX + 6 + sw, WY, 4, WH, null, 'night0', 0.5);
      A.vline(g, WX + 4 + sw, WY, WH, 'night1');
      // skirting and floor line
      A.rect(g, 0, FL - 2, 320, 2, 'night0');
      A.hline(g, WX - 6, FL - 1, WW + 12, 'night1');
      // ---- floor: black, seams converge on a vanishing point; visible only in the light
      const VX = 86, VY = 40;
      for (let i = -9; i <= 9; i++) {
        const bx = 86 + i * 24;
        A.line(g, VX + (bx - VX) * (FL - VY) / (180 - VY), FL, bx, 179, 'night1');
      }
      // ---- the moonlight slab, with mullion cross, curtain edge and the long head shadow
      const hsx = [76, 100], reach = 0.9 + 0.1 * sl;   // the shadow creeps a little
      for (let y = SY0; y <= SY1; y++) {
        const v = (y - SY0) / (SY1 - SY0), xl = lerp(SXL0, SXL1, v), xr = lerp(SXR0, SXR1, v);
        const vf = 1 - v * 0.55;
        for (let x = Math.floor(xl) - 4; x <= xr + 4; x++) {
          let e = Math.min(x - xl, xr - x) / 5 + 0.1; if (e <= 0) continue; if (e > 1) e = 1;
          const lv = e * vf * 0.95;
          // shadows
          const u = (x - xl) / (xr - xl);
          let dark = 0;
          if (v > 0.42 && v < 0.5) dark = 1;                        // cross-bar
          if (u > 0.74 && u < 0.78) dark = 1;                       // vertical mullion
          if (u < 0.08) dark = 1;                                   // curtain edge
          // head shadow: shoulders at the sill widening into a reaching head at the man's feet
          const hc = lerp(0.5, 0.96 * reach, sm(v * 1.1)), hw = lerp(0.2, 0.05, sm(v));
          if (Math.abs(u - hc) < hw) dark = 1;
          const hd = Math.hypot((x - lerp(xl, xr, 0.97 * reach)) / 6, (y - 168) / 5); if (hd < 1) dark = 1;
          if (dark) continue;
          const q = lv * 5, qi = q | 0, c = qi + (q - qi > A.bayer(x, y) ? 1 : 0);
          if (c > 0) A.px(g, x, y, c < 2 ? 'night1' : c < 3 ? 'night2' : c < 4 ? 'night3' : c < 5 ? 'slate3' : 'mist3');
        }
      }
      // dust, only inside the slab, seamless
      for (let i = 0; i < 9; i++) {
        const u = (i * 0.173 + T / PER * (1 + (i % 2))) % 1;
        const y = 128 + u * 40, x = lerp(SXL0, SXL1, (y - SY0) / 55) + 14 + ((i * 29) % 60) + Math.sin(T / PER * Math.PI * 2 + i) * 2;
        A.px(g, x, y, i % 3 ? 'mist5' : 'paper4');
      }
      // ---- dogs and man: black cut-outs, only eyes and a rim
      const up = sm((T - 3.4) / 0.5) * (T < 5.7 ? 1 : 0);
      // dog A lying in the slab (a black shape against the light), head to the right
      A.ellipse(g, 100, 168, 9, 3, 'night0'); A.ellipse(g, 110, 166, 4, 3, 'night0'); A.rect(g, 112, 168, 4, 2, 'night0'); A.px(g, 95, 165, 'night0');
      A.px(g, 108, 163, 'night0'); A.px(g, 109, 162, 'night0');
      dogEyes(g, 112, 166 - Math.round(up * 1.0), 2, 0, win(T, 0.8, 5.7));
      // dog B sits in the dark, facing left: a rim of cold light on its back, eyes tied to the head
      const bx = 226, by = 150;
      A.poly(g, [bx, by + 16, bx + 10, by + 16, bx + 9, by + 6, bx + 4, by - 2, bx - 1, by - 2, bx - 3, by + 4], 'night0');
      A.vline(g, bx - 3, by + 4, 12, 'slate1'); A.px(g, bx - 2, by - 1, 'slate2');
      dogEyes(g, bx - 2, by + 1 - Math.round(up * 2), -3, 0, win(T, 1.2, 5.7));
      // man: seated on the floor against the wall, almost entirely black; orange sliver on the window side
      const mx = 182, my = 150;
      A.ellipse(g, mx + 1, my + 13, 10, 3, 'night0');                        // legs / hem
      A.poly(g, [mx - 6, my + 12, mx - 6, my - 2, mx - 3, my - 9, mx + 4, my - 9, mx + 7, my - 2, mx + 8, my + 12], 'night0');
      A.ellipse(g, mx, my - 13, 4, 4, 'night0');                             // head
      A.line(g, mx - 6, my - 2, mx - 4, my - 8, 'orange5'); A.line(g, mx - 6, my - 1, mx - 6, my + 8, 'orange4');  // shoulder + sleeve edge
      A.px(g, mx - 3, my - 9, 'orange6');
      A.px(g, mx - 6, my + 9, 'orange2');
      if (win(T, 1.6, 5.7)) A.px(g, mx - 2, my - 13, 'steel4');             // glint of his eye
      // ---- eyes in the black: one pair, far too high, far too wide for a dog
      const hi = (T >= 2.0 && T < 5.7) && !(T >= 4.3 && T < 4.75) ? 1 : 0;
      if (hi) pair(g, 267, 48, 7, 'eye4', 'eye3', 'eye0');
      // the room's black pass: nothing else lit outside the window and slab
    },
  };
})();
