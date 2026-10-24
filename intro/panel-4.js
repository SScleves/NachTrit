// Panel 4: "Others blame the worldwide poll in which Flemish was voted the nicer Dutch."
// A market square at night in the fog, and over it the results screen of the worldwide poll, Eurovision style:
// WERELDPEILING, "Welk Nederlands is het mooist?", VLAAMS 87% on a gold bar against NEDERLANDS 13%, each with its flag.
// The dead stand on the wet cobbles and look up at it. One checks it on his phone, one holds a Dutch flag that has given
// up and asks for a recount. The screen recounts: 88%.
// Key light: the screen, cold blue-white: its glow in the fog, its mirror on the wet cobbles, rims on the dead.
// Amber only in a few windows round the square and one lantern.
// Layers: sky and the church tower / the houses round the square / the screen on its truss / the crowd under it /
// the dead in front, the wet cobbles and the ground fog.
// Loop 6 s: "Hertelling." (0.4 to 2.6), the screen refreshes (3.0 to 3.4) and shows the recount (3.4 to 5.9); a light
// runs along the winning bar every 3 s, sparkles round the 87%, the LIVE dot blinks; the reflections shimmer; fog drifts
// (its noise blended across the loop, so the drift has no seam).
// Speed: everything but the three dead in front, the screen's live bits and the fog is painted once into a plate.
(function () {
  const A = window.NRART, PER = 6, TAU = Math.PI * 2;
  const GY = 124;                                          // where the houses meet the square; the mirror line of the wet cobbles
  const SX = 112, SY = 24, SW = 176, SH = 80;              // the screen
  const KX = SX + SW / 2, KY = SY + SH / 2;                // the key light
  const BX = 186, BL = 66, R1 = SY + 25, R2 = SY + 45;     // the bars (start, full length) and the two result rows
  const W1 = Math.round(BL * 0.87), W2 = Math.round(BL * 0.13);
  const ZT = TAU / (1.3 * PER);                            // sprite time per second: the sprites' sway repeats every 6 s

  // a band of fog drifting sideways that loops in 6 s: its shape is the same noise one loop apart, blended across the
  // loop. One pass, written straight into the buffer through the toolkit's fog lookups.
  const FOGL = {}, BAY = new Float32Array(320 * 180);
  for (let i = 0; i < BAY.length; i++) BAY[i] = A.bayer(i % 320, (i / 320) | 0);
  function fog(g, T, y, h, amt, color, seed, sp) {
    const Q = 8, L = FOGL[color] || (FOGL[color] = Array.from({ length: Q + 1 }, (_, q) => A.lut('mix', color, q / Q)));
    const buf = g.buf, w = T / PER, d1 = T * sp, d2 = (T - PER) * sp;
    for (let x = 0; x < 320; x++) {
      const n = (1 - w) * A.wave(x + d1, 320, seed) + w * A.wave(x + d2, 320, seed);
      const m = (1 - w) * A.wave(x * 0.5 + 40 + d1 * 0.5, 320, seed + 3) + w * A.wave(x * 0.5 + 40 + d2 * 0.5, 320, seed + 3);
      const th = Math.max(0.5, h * (0.35 + 0.65 * n) / 2), cy = y + h / 2 + (m - 0.5) * h * 0.5, a = amt * (0.55 + 0.45 * n);
      for (let yy = Math.max(0, Math.ceil(cy - th)), y1 = Math.min(179, Math.floor(cy + th)); yy <= y1; yy++) {
        const d = (yy + 0.5 - cy) / th, v = a * (1 - d * d) * Q; if (v <= 0) continue;
        const i = yy * 320 + x; let q = v | 0; if (v - q > BAY[i]) q++;
        if (q > 0) buf[i] = L[q > Q ? Q : q][buf[i]];
      }
    }
  }
  // a figure's reflection on the wet cobbles: its own pixels mirrored under its feet, darkened, broken by the joints
  const REF = A.lut('mix', 'night1', 0.55);
  function reflect(g, x0, x1, y0, yf) {
    const buf = g.buf, mask = g.mask;
    x0 = Math.max(0, Math.round(x0)); x1 = Math.min(319, Math.round(x1));
    for (let y = yf - 1, r = 0; y >= y0 && yf + r < 180; y--, r++) {
      if (r % 4 === 3) continue;
      const so = y * 320, dd = (yf + r) * 320;
      for (let x = x0; x <= x1; x++) if (mask[so + x] && !mask[dd + x]) buf[dd + x] = REF[buf[so + x]];
    }
  }
  function dead(g, x, y, o) {
    const h = o.height || 50, x0 = Math.max(0, x - 16), x1 = Math.min(319, x + 16), y0 = Math.max(0, y - h - 6);
    for (let yy = y0; yy < Math.min(180, y + h); yy++) g.mask.fill(0, yy * 320 + x0, yy * 320 + x1 + 1);   // only this figure is mirrored
    const r = A.zombie(g, x, y, o); reflect(g, x0, x1, y0, y); return r;
  }

  function far(g) {
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0'], 0, GY);
    A.church(g, 46, GY - 4, 1.7, { tone: 'night3' });
    A.haze(g, 0, 0, 320, GY, { top: 0.06, bottom: 0.45, color: 'mist2' });
  }
  function houses(g) {
    [[-4, 36, 84, 'neck'], [32, 34, 74, 'step'], [66, 40, 90, 'bell'], [104, 38, 88, 'step'], [142, 30, 80, 'spout'], [172, 36, 92, 'neck'],
      [208, 32, 78, 'bell'], [240, 34, 86, 'step'], [274, 26, 76, 'neck'], [300, 34, 84, 'step']]
      .forEach(([x, w, h, gable], i) => A.canalHouse(g, x, GY, w, h, { gable, lit: 0.08, seed: 31 + i * 5, detail: false, rim: 0 }));
    A.lamp(g, 92, 130, { style: 'lantern', h: 30 });
    A.haze(g, 0, 20, 320, GY - 16, { top: 0.32, bottom: 0.6, color: 'mist2', lights: 0.55 });
  }
  function truss(g) {
    for (const x of [SX - 13, SX + SW + 6]) {
      A.rect(g, x, 9, 7, 119, 'slate1'); A.vline(g, x, 9, 119, 'slate2'); A.vline(g, x + 6, 9, 119, 'slate2');
      for (let y = 12; y < 124; y += 6) { A.line(g, x + 1, y, x + 5, y + 5, 'slate3'); A.line(g, x + 5, y, x + 1, y + 5, 'slate2'); }
      A.vline(g, x < KX ? x + 6 : x, 15, 112, 'mist2');                                         // the edge the screen lights
      A.rect(g, x - 2, 126, 11, 2, 'slate0');
    }
    A.rect(g, SX - 13, 8, SW + 26, 7, 'slate1'); A.hline(g, SX - 13, 8, SW + 26, 'slate3'); A.hline(g, SX - 13, 14, SW + 26, 'mist2');
    for (let x = SX - 12; x < SX + SW + 12; x += 6) { A.line(g, x, 9, x + 5, 13, 'slate3'); A.line(g, x + 5, 9, x, 13, 'slate2'); }
    for (const x of [SX + 30, SX + SW - 32]) A.vline(g, x, 15, SY - 18, 'slate2');               // the hangers
  }
  function screen(g) {
    A.rect(g, SX - 3, SY - 3, SW + 6, SH + 6, 'slate0'); A.hline(g, SX - 3, SY - 3, SW + 6, 'slate2');
    A.ditherGradient(g, SX, SY, SW, SH, 'blue2', 'blue0', 'down');
    for (let y = SY + 1; y < SY + SH; y += 2) A.ditherRect(g, SX, y, SW, 1, null, 'blue0', 0.35);   // the LED rows
    // header
    A.rect(g, SX, SY, SW, 19, 'blue3'); A.ditherGradient(g, SX, SY + 8, SW, 11, null, 'blue2', 'down'); A.hline(g, SX, SY + 19, SW, 'blue5');
    // the winner's row, lit up, a gold mark at its edge
    A.rect(g, SX + 3, R1, SW - 6, 16, 'blue3'); A.hline(g, SX + 3, R1, SW - 6, 'blue5'); A.rect(g, SX + 3, R1, 2, 16, 'cheese5');
    A.rect(g, SX + 8, R1 + 4, 4, 9, 'night0'); A.rect(g, SX + 12, R1 + 4, 4, 9, 'cheese5'); A.rect(g, SX + 16, R1 + 4, 4, 9, 'red4');   // Belgium
    A.rect(g, BX, R1 + 4, W1, 9, 'cheese4'); A.hline(g, BX, R1 + 4, W1, 'cheese6'); A.hline(g, BX, R1 + 12, W1, 'cheese2');
    // the other row
    A.rect(g, SX + 3, R2, SW - 6, 16, 'blue1'); A.hline(g, SX + 3, R2, SW - 6, 'blue2');
    A.rect(g, SX + 8, R2 + 4, 12, 3, 'red4'); A.rect(g, SX + 8, R2 + 7, 12, 3, 'paper6'); A.rect(g, SX + 8, R2 + 10, 12, 3, 'blue4');   // the Netherlands
    A.rect(g, BX, R2 + 4, W2, 9, 'mist4'); A.hline(g, BX, R2 + 4, W2, 'mist5');
    A.hline(g, SX + 4, SY + SH - 12, SW - 8, 'blue2');
  }
  // the wet square: the scene mirrored, the joints between the cobbles dark, the far rows lost in the fog
  function square(g) {
    A.water(g, 0, GY, 320, 180 - GY, { t: 0, amp: 1.3, dark: 0.22, color: 'night1', gaps: 0.32, glints: 0, stretch: 0.75 });
    const buf = g.buf, joint = A.lut('mul', 'black', 0.34), dry = A.lut('mix', 'slate3', 0.25);
    for (let y = GY, row = 0; y < 180; row++) {
      const k = (y - GY) / (180 - GY), rh = Math.round(2 + k * 4), sw = rh * 2 + 2, off = (row & 1) * (sw >> 1);
      for (let x = 0; x < 320; x++) buf[y * 320 + x] = joint[buf[y * 320 + x]];
      for (let x = -off; x < 320; x += sw) {
        if (x >= 0) for (let yy = y + 1; yy < Math.min(180, y + rh); yy++) buf[yy * 320 + x] = joint[buf[yy * 320 + x]];
        if (A.hash(x + 500, row) < 0.3) for (let xx = Math.max(0, x + 1); xx < Math.min(320, x + sw - 1); xx++) if (y + 1 < 180) buf[(y + 1) * 320 + xx] = dry[buf[(y + 1) * 320 + xx]];
      }
      y += rh;
    }
    A.haze(g, 0, GY, 320, 18, { top: 0.4, bottom: 0, color: 'mist2' });
    A.glow(g, KX, GY + 16, 150, { color: 'blue5', strength: 0.28, power: 1.2, ry: 28 });         // the screen's light on the wet stones
    A.glow(g, KX, GY + 26, 96, { color: 'mist6', strength: 0.16, power: 1.4, ry: 20 });
    for (const x of [SX - 13, SX + SW + 6]) { A.rect(g, x, GY - 2, 7, 4, 'slate1'); A.rect(g, x - 2, 126, 11, 2, 'slate0'); }
  }
  // the crowd under the screen, small and grey in the fog, and two of the dead nearer: they stand still, so they are painted
  function crowd(g) {
    for (let i = 0; i < 9; i++) {
      const x = 126 + i * 19 + Math.round(A.hash(i, 3) * 8), y = 133 + Math.round(A.hash(i, 4) * 4), h = 24 + Math.round(A.hash(i, 6) * 6);
      A.zombie(g, x, y, { tone: A.hash(i, 5) < 0.5 ? 'mist1' : 'night4', height: h, facing: x < KX ? 'right' : 'left', seed: 20 + i, hunch: 0.15 + A.hash(i, 7) * 0.3, glow: 0.25 });
    }
    A.haze(g, 110, 100, 190, 40, { amount: 0.25, color: 'mist2' });
    dead(g, 152, 149, { variant: 'bonnet', height: 42, facing: 'right', seed: 12, hunch: 0.12 });
    dead(g, 246, 151, { height: 44, facing: 'left', seed: 9, hunch: 0.2 });
  }

  let plate = null, bub = null;
  function build(g) {
    A.key(g, KX, KY, 2);
    g.mask.fill(0);
    far(g); houses(g);
    A.glow(g, KX, KY + 8, 210, { color: 'blue5', strength: 0.42, power: 1.6, ry: 130 });         // the screen's light in the fog
    A.glow(g, KX, KY, 130, { color: 'mist6', strength: 0.2, power: 2, ry: 74 });
    truss(g); screen(g); square(g); crowd(g);
    plate = g.buf.slice();
    bub = { str: 'Hertelling.', w: Math.ceil(A.textWidth('Hertelling.', 5.5, true)) + 8, h: 10 };
  }

  // the screen's live bits: the light along the gold bar, sparkles, LIVE, and the recount
  function screenLive(g, T) {
    const refresh = T >= 3.0 && T < 3.4, recount = T >= 3.4 && T < 5.9;
    if (refresh) {
      A.rect(g, SX + 3, R1, SW - 6, R2 + 16 - R1, 'blue0');
      const y = Math.round(R1 + (T - 3.0) / 0.4 * (R2 + 15 - R1)); A.hline(g, SX + 3, y, SW - 6, 'paper6'); A.hline(g, SX + 3, y - 1, SW - 6, 'blue4');
      A.tint(g, SX + 3, GY + Math.floor((123 - R2 - 16) * 0.75), SW - 6, 180, 'night1', 0.6, 'mix');   // and in the wet cobbles
    } else {
      const s = (T % 3) / 0.9;
      if (s < 1) { const x = BX + Math.round(s * (W1 - 3)); A.rect(g, x, R1 + 4, 2, 9, 'cheese6'); A.vline(g, x + 1, R1 + 5, 7, 'paper6'); }
      [[SX + SW - 30, R1 + 2], [SX + SW - 4, R1 + 3], [SX + SW - 16, R1 + 15], [SX + SW - 36, R1 + 13]].forEach(([x, y], i) => {
        const p = (T * 1.5 + i * 0.37) % 1; if (p > 0.28) return;
        A.px(g, x, y, 'paper6'); if (p < 0.18) { A.px(g, x - 1, y, 'cheese6'); A.px(g, x + 1, y, 'cheese6'); A.px(g, x, y - 1, 'cheese6'); A.px(g, x, y + 1, 'cheese6'); }
      });
    }
    if (T % 1 < 0.6) { A.disc(g, SX + SW - 26, SY + SH - 6, 1, 'red5'); A.px(g, SX + SW - 26, SY + SH - 6, 'red6'); }
    // words
    A.text(KX, SY + 10, 'WERELDPEILING', 'paper6', 8, true, { align: 'center' });
    A.text(KX, SY + 16.6, 'Welk Nederlands is het mooist?', 'mist7', 4.6, false, { align: 'center' });
    if (!refresh) {
      A.text(SX + 24, R1 + 11.4, 'VLAAMS', 'paper6', 6.4, true);
      A.text(SX + 24, R2 + 11.4, 'NEDERLANDS', 'mist6', 6.4, true);
      A.text(SX + SW - 5, R1 + 12.6, recount ? '88%' : '87%', 'cheese6', 9, true, { align: 'right' });
      A.text(SX + SW - 5, R2 + 12.6, recount ? '12%' : '13%', 'mist6', 9, true, { align: 'right' });
    }
    A.text(SX + 6, SY + SH - 3.6, refresh ? 'Hertelling...' : recount ? 'Na hertelling' : '8.000.000.000 stemmen', recount ? 'cheese6' : 'mist6', 4.4, recount);
    A.text(SX + SW - 23, SY + SH - 3.6, 'LIVE', 'paper6', 4.4, true);
  }

  // a Dutch flag on a stick that has given up: it hangs down off the top, its stripes along the droop
  function limpFlag(g, hx, hy) {
    const sx = hx + 3, sy = hy - 15;
    A.line(g, hx + 1, hy + 1, sx, sy, 'wood3');
    A.line(g, sx + 1, sy, sx + 4, sy + 8, 'red4', 2); A.line(g, sx + 1, sy + 2, sx + 3, sy + 9, 'paper5', 2); A.line(g, sx + 1, sy + 4, sx + 2, sy + 10, 'blue3', 2);
  }

  A.panels[3] = {
    text: 'Others blame the worldwide poll in which Flemish was voted the nicer Dutch.',
    nl: 'Anderen geven de schuld aan de wereldwijde peiling waarin Vlaams het mooiste Nederlands werd genoemd.',
    draw(g, t) {
      const T = ((t % PER) + PER) % PER, zt = T * ZT;
      if (!plate || plate.length !== g.buf.length) build(g);
      A.key(g, KX, KY, 2);
      g.buf.set(plate); g.mask.fill(0);
      screenLive(g, T);
      fog(g, T, 104, 32, 0.34, 'mist3', 3, 5);                                    // fog over the crowd under the screen
      // the dead in front, looking up: the phone, the flag and the recount, and a woman who says nothing
      dead(g, 34, 179, { variant: 'phone', height: 66, facing: 'right', t: zt, seed: 2, hunch: 0.18 });
      const z = dead(g, 104, 172, { height: 60, facing: 'right', t: zt, seed: 5, hunch: 0.1 });
      limpFlag(g, z.hand[0], z.hand[1]);
      dead(g, 290, 178, { variant: 'woman', height: 66, facing: 'left', t: zt, seed: 8, hunch: 0.15 });
      // the screen's light shimmering in the wet cobbles
      [[BX + 30, 0.4], [SX + SW - 16, 0.35], [SX + 14, 0.3], [KX - 30, 0.25]].forEach(([x, s], i) => A.streak(g, x, GY + 14, 36, { color: 'mist6', strength: s, t: T * 1.0472, seed: i + 1 }));
      fog(g, T, 152, 28, 0.28, 'mist2', 7, 6);                                    // ground fog
      if (T > 0.4 && T < 2.6) A.bubble(g, Math.max(2, z.head[0] - bub.w / 2 + 4), z.head[1] - 3 - bub.h, bub.w, bub.h, { text: bub.str, size: 5.5, tail: [z.head[0] + 2, z.head[1] - 1] });
    },
  };
})();
