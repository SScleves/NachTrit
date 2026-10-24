// Panel 3: "Nobody agrees on what caused it. Some say it was the cheese."
// Gouda, the Kaaswaag, three in the morning. The square is still laid out for market day: rows of wheels on the cobbles,
// a barrow, a lantern. In the middle lies one wheel as wide as a car, gone blue-green with mould, a wedge cut out of it,
// giving off a faint sick light. The dead stand round it in the fog. One leans in, sniffs twice and gives his verdict.
// Key light: the wheel itself (cold teal). Amber only in the Waag's windows and open door and in the lantern.
// Layers: sky, far tower and mill / the Waag and the houses / the market / the wheel and the dead / ground fog.
// Loop 6 s: the sniffer leans in (0 to 1.2), sniffs at 1.5 and 2.5 (spores go up his nose), straightens (3.2 to 4.4)
// and pronounces (3.6 to 5.8); spores rise off the wheel and its light breathes twice; the far mill turns a quarter; the
// fog drifts (its noise blended across the loop, so the drift has no seam).
// Speed: what stands still is painted once, the dead at the back included: the far town alone, the scene without the
// wheel, the whole scene, and the last two again lit by a breath in. From those come nine finished frames, one per breath
// level (dim to bright, dithered); each frame copies one back and adds the sails, the fog, the two dead in front and the
// spores, putting the wheel back over the fog that lies behind it.
(function () {
  const A = window.NRART, PER = 6, TAU = Math.PI * 2;
  const sm = k => k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k);
  const GY = 122;                                        // the foot of the Waag and the houses
  const CX = 172, TY = 127, RX = 44, RY = 14, SH = 19;   // the wheel: middle of the top face, radii, height of the side
  const BOT = TY + SH, TH1 = 1.2, TH2 = 1.92;           // the wedge that was cut out, from 69 to 110 degrees (90 faces us)
  const ZT = TAU / (1.3 * PER);                          // sprite time per second: the sprites' sway repeats every 6 s
  const rim = th => [CX + RX * Math.cos(th), TY + RY * Math.sin(th)];

  // one step of a ramp for a 0..1 value, Bayer-dithered between steps
  function shade(g, x, y, ramp, v) {
    const n = ramp.length - 1, f = Math.max(0, Math.min(1, v)) * n, i = Math.floor(f);
    A.px(g, x, y, ramp[Math.min(n, i + (f - i > A.bayer(x, y) ? 1 : 0))]);
  }
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
  function lean(T) { if (T < 1.2) return sm(T / 1.2); if (T < 3.2) return 1; if (T < 4.4) return 1 - sm((T - 3.2) / 1.2); return 0; }
  function sniffAt(T) { for (const s of [1.5, 2.5]) { const d = T - s; if (d >= 0 && d < 0.5) return d / 0.5; } return -1; }

  const MX = 290, MY = 54;                               // the hub of the far mill
  function far(g) {
    A.rect(g, 0, 0, 320, 180, 'night1');
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0'], 0, GY);
    A.church(g, 54, GY - 4, 1.6, { tone: 'night3' });                      // St. Jan, over the roofs
    A.poly(g, [MX - 9, GY, MX + 9, GY, MX + 4, MY + 3, MX - 4, MY + 3], 'night3'); A.poly(g, [MX - 6, MY + 4, MX + 6, MY + 4, MX + 4, MY - 3, MX - 4, MY - 3], 'night3');
    A.haze(g, 0, 0, 320, GY, { top: 0.08, bottom: 0.5, color: 'mist2' });
  }
  // its sails, live: a quarter turn per loop, anticlockwise as real mills turn
  function sails(g, T) {
    const a0 = -T / PER * Math.PI / 2;
    for (let k = 0; k < 4; k++) {
      const a = a0 + k * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), x1 = MX + c * 31, y1 = MY + s * 31;
      A.poly(g, [MX + c * 6, MY + s * 6, x1, y1, x1 - s * 6, y1 + c * 6, MX + c * 6 - s * 5, MY + s * 6 + c * 5], 'mist0');
      A.line(g, MX, MY, x1, y1, 'night4');
    }
    A.disc(g, MX, MY, 1, 'mist0');
  }

  function houses(g) {
    [[-6, 40, 80, 'step'], [34, 34, 70, 'bell'], [68, 40, 86, 'neck'], [238, 30, 76, 'spout'], [268, 28, 66, 'step'], [296, 30, 84, 'bell']]
      .forEach(([x, w, h, gable], i) => A.canalHouse(g, x, GY, w, h, { gable, lit: 0.07, seed: 11 + i * 7, detail: false, rim: 0 }));
  }

  function waag(g) {
    const x0 = 108, x1 = 236, top = 56, ap = 34;
    A.rect(g, x0, top, x1 - x0, GY - top, 'mist1');
    for (let x = x0; x <= x1 - 3; x += 32) A.rect(g, x, top + 3, 3, GY - top - 9, 'mist2');                  // pilasters
    A.poly(g, [x0 - 5, top, CX, ap, x1 + 5, top], 'mist1');                                                  // the pediment
    A.line(g, x0 - 5, top - 1, CX, ap, 'mist3'); A.line(g, CX, ap, x1 + 5, top - 1, 'mist2');
    A.ring(g, CX, top - 8, 5, 'mist3', 1); A.disc(g, CX, top - 8, 3, 'mist2'); A.vline(g, CX, top - 11, 6, 'mist0');   // the town arms
    A.rect(g, x0 - 5, top, x1 - x0 + 10, 3, 'mist3'); A.hline(g, x0 - 5, top + 3, x1 - x0 + 10, 'night3');   // cornice
    A.rect(g, x0 - 2, GY - 6, x1 - x0 + 4, 6, 'mist0'); A.hline(g, x0 - 2, GY - 6, x1 - x0 + 4, 'mist2');     // plinth
    for (const [x, lit] of [[116, 0], [140, 0.9], [192, 0], [216, 0.75]]) A.window(g, x, 66, 12, 20, { lit, frame: 'mist3', bars: 'cross' });
    for (const [x, lit] of [[116, 0.7], [140, 0], [192, 0], [216, 0]]) A.window(g, x, 94, 12, 18, { lit, frame: 'mist3', bars: 't' });
    // the weighing relief over the door: a beam, two pans, a porter at each end
    A.rect(g, 154, 68, 36, 16, 'mist0'); A.hline(g, 154, 68, 36, 'night3'); A.hline(g, 154, 83, 36, 'mist2');
    A.hline(g, 162, 72, 20, 'mist2'); A.vline(g, CX, 70, 3, 'mist2'); A.rect(g, 161, 75, 5, 2, 'mist2'); A.rect(g, 178, 75, 5, 2, 'mist2');
    A.vline(g, 161, 72, 3, 'mist2'); A.vline(g, 183, 72, 3, 'mist2');
    for (const x of [157, 186]) { A.disc(g, x, 75, 1, 'mist2'); A.rect(g, x - 1, 77, 3, 5, 'mist2'); }
    // the door stands open, a lamp lit inside
    A.disc(g, CX, 104, 11, 'mist3'); A.rect(g, CX - 11, 104, 23, GY - 104, 'mist3');
    A.disc(g, CX, 104, 9, 'amber3'); A.rect(g, CX - 9, 104, 19, GY - 104, 'amber3');
    A.ditherGradient(g, CX - 9, 100, 19, GY - 100, 'amber3', 'amber5', 'down');
    A.rect(g, CX - 2, 101, 5, 6, 'amber6'); A.px(g, CX, 103, 'amber8');
  }

  function smallWheel(g, x, y, dim) {
    const c = dim ? ['cheese0', 'cheese1', 'cheese2', 'cheese3'] : ['cheese1', 'cheese2', 'cheese3', 'cheese4'];
    A.ellipse(g, x, y - 1, 5, 1, c[0]); A.rect(g, x - 5, y - 4, 11, 3, c[1]); A.px(g, x - 6, y - 3, c[0]); A.px(g, x + 6, y - 3, c[0]);
    A.ellipse(g, x, y - 5, 5, 1, c[2]); A.hline(g, x - 2, y - 6, 5, c[3]);
  }
  function market(g) {
    for (let r = 0; r < 3; r++) {
      const y = GY + 7 + r * 5;
      for (let x = 10 + r * 5; x < 112; x += 14) smallWheel(g, x, y);
      for (let x = 240 + r * 4; x < 318; x += 14) smallWheel(g, x, y);
    }
    A.haze(g, 0, GY, 320, 20, { top: 0.7, bottom: 0.45, color: 'mist2' });
    // a barrow set down for the morning, and a stack
    A.line(g, 34, 146, 92, 146, 'wood2', 2); A.rect(g, 42, 143, 42, 3, 'wood3'); A.hline(g, 42, 143, 42, 'wood4');
    A.vline(g, 46, 147, 5, 'wood1'); A.vline(g, 80, 147, 5, 'wood1');
    for (let k = 0; k < 5; k++) smallWheel(g, 47 + k * 8, 143);
    for (let k = 0; k < 4; k++) smallWheel(g, 51 + k * 8, 139);
    for (let r = 0; r < 4; r++) for (let k = 0; k < 4 - r; k++) smallWheel(g, 286 + r * 6 + k * 12, 156 - r * 4, 1);
    A.lamp(g, 16, 162, { style: 'lantern', h: 50 });
  }

  function cobbles(g) {
    A.rect(g, 0, GY, 320, 180 - GY, 'slate1');
    for (let y = GY, row = 0; y < 180; row++) {
      const k = (y - GY) / (180 - GY), rh = Math.round(2 + k * 4), sw = rh * 2 + 2, off = (row & 1) * (sw >> 1);
      for (let x = -off; x < 320; x += sw) {
        const v = A.hash(x + 400, row + 7), c = v < 0.35 ? 'slate2' : v < 0.85 ? 'slate3' : 'mist0';
        A.rect(g, x + 1, y + 1, sw - 1, rh - 1, c); A.hline(g, x + 2, y + 1, sw - 3, v < 0.35 ? 'slate3' : 'mist0');
      }
      y += rh;
    }
    A.haze(g, 0, GY, 320, 34, { top: 0.6, bottom: 0.05, color: 'mist2' });
  }

  // where the mould has taken the wax: smooth blotches (above 0.5), more of it on the top face
  const mould = (x, y, bias) => 0.5 + bias + 0.26 * Math.sin(x * 0.23 + y * 0.17) + 0.2 * Math.sin(x * 0.09 - y * 0.37 + 1.3) + 0.16 * Math.sin((x - y) * 0.31 + 2.1);
  const SIDE_M = ['teal0', 'teal1', 'teal2', 'teal3', 'teal4', 'teal5', 'green7'], SIDE_W = ['cheese0', 'cheese1', 'cheese2', 'cheese3', 'cheese4'];
  const TOP_M = ['teal3', 'teal4', 'teal5', 'green7', 'mist4', 'mist5'], TOP_W = ['cheese2', 'cheese3', 'cheese4', 'cheese5'];
  function skin(g, x, y, v, m, mouldRamp, waxRamp) {
    if (Math.abs(m - 0.5) < 0.035 && A.bayer(x, y) < 0.6) A.px(g, x, y, A.bayer(x + 1, y) < 0.5 ? 'paper4' : 'mist5');   // the white edge of a colony
    else if (m > 0.5) shade(g, x, y, mouldRamp, v + 0.12);
    else shade(g, x, y, waxRamp, v);
  }
  function wheel(g) {
    A.shadow(g, CX, BOT + RY, RX + 10, 5, 0.75);
    // the side, bulging a little, rounded off at the ground, darker toward the ends and the bottom
    for (let y = TY; y <= BOT + RY; y++) for (let x = CX - RX - 3; x <= CX + RX + 3; x++) {
      const u = (x - CX) / RX, bulge = y <= BOT ? 2.5 * Math.sin(Math.PI * (y - TY) / SH) : 0;
      if (Math.abs(x - CX) > RX + bulge + 0.5) continue;
      if (y > BOT && u * u + ((y - BOT) / (RY + 0.5)) ** 2 > 1) continue;
      const front = Math.sqrt(Math.max(0, 1 - u * u)), v = (y - TY) / (SH + RY);
      skin(g, x, y, 0.12 + 0.62 * front * (1 - 0.7 * v) + (y - TY < 3 ? 0.15 : 0), mould(x, y, 0.02), SIDE_M, SIDE_W);
    }
    // the top face, its light coming from the middle, a bright lip along the front edge
    for (let y = TY - RY; y <= TY + RY; y++) for (let x = CX - RX; x <= CX + RX; x++) {
      const dx = (x - CX) / (RX + 0.5), dy = (y - TY) / (RY + 0.5), d = dx * dx + dy * dy; if (d > 1) continue;
      const lip = dy > 0 && d > 0.8 ? 0.25 : 0;
      skin(g, x, y, 0.9 - 0.65 * Math.sqrt(d) + lip, mould(x, y * 2, 0.22), TOP_M, TOP_W);
    }
    // dark pits in the mould
    for (let i = 0; i < 24; i++) {
      const u = A.hash(i, 34) * 1.8 - 0.9, x = CX + u * RX, y = TY + 3 + A.hash(i, 35) * (SH - 4 + RY * Math.sqrt(1 - u * u));
      if (mould(Math.round(x), Math.round(y), 0.02) > 0.56) { A.px(g, x, y, 'teal0'); A.px(g, x + 1, y, 'teal1'); }
    }
    // the wedge that is gone: the floor of the gap, then the two cut faces of yellow paste with blue veins
    const [ax, ay] = rim(TH1), [bx, by] = rim(TH2);
    A.poly(g, [bx, by + SH, CX, BOT, ax, ay + SH, ax, BOT + RY * Math.sin(TH1) + 1, bx, BOT + RY * Math.sin(TH2) + 1], 'night1');
    A.poly(g, [CX, TY, ax, ay, ax, ay + SH, CX, BOT], 'cheese5'); A.ditherGradient(g, CX, TY + 8, ax - CX, SH + 4, null, 'cheese4', 'down');   // in the light
    A.poly(g, [CX, TY, bx, by, bx, by + SH, CX, BOT], 'cheese3'); A.ditherGradient(g, bx, TY + 8, CX - bx, SH + 6, null, 'cheese2', 'down');   // in its own shade
    for (const [x0, y0, x1, y1, x2, y2] of [[CX + 4, TY + 8, CX + 10, TY + 13, CX + 8, TY + 21], [CX + 13, TY + 14, CX + 15, TY + 20, CX + 14, TY + 26], [CX - 4, TY + 9, CX - 9, TY + 15, CX - 7, TY + 22]]) {
      A.line(g, x0, y0, x1, y1, 'blue3'); A.line(g, x1, y1, x2, y2, 'blue2');
    }
    for (const [x, y] of [[CX + 6, TY + 17], [CX + 12, TY + 23], [CX - 11, TY + 19], [CX - 3, TY + 25]]) A.px(g, x, y, 'cheese2');   // holes
    A.line(g, CX, TY, ax, ay, 'cheese2'); A.line(g, CX, TY, bx, by, 'cheese1');                           // the wax along the cut
    A.vline(g, ax, ay, SH, 'cheese2'); A.vline(g, bx, by, SH, 'cheese1');
    A.vline(g, CX, TY + 1, SH - 1, 'cheese1'); A.vline(g, CX + 1, TY + 2, SH - 2, 'cheese3');               // the inside corner
    for (const [x, y] of [[CX + 5, TY + 4], [CX + 13, TY + 9], [CX - 7, TY + 7]]) { A.px(g, x, y, 'green5'); A.px(g, x + 1, y + 1, 'green6'); }
  }

  function lights(g) {
    A.glow(g, CX, TY + 2, 124, { color: 'teal5', strength: 0.34, power: 1.6, ry: 80 });                      // the wheel's sick light in the fog
    A.glow(g, CX, BOT + RY + 3, 92, { color: 'teal5', strength: 0.3, power: 1.1, ry: 13 });                  // and on the cobbles
    A.glow(g, CX, TY - 2, 40, { color: 'green7', strength: 0.3, power: 1.8, ry: 22 });                       // the mould's own glow
    A.glow(g, CX, 104, 24, { color: 'amber5', strength: 0.28, power: 1.4 });                                 // the open door
  }

  // the dead at the back stand still in the fog: painted into the plate with everything else that does not move
  function backDead(g) {
    A.zombie(g, 92, 136, { tone: 'mist1', height: 38, facing: 'right', seed: 3, hunch: 0.5, glow: 0.3 });
    A.zombie(g, 204, 131, { variant: 'cheese', height: 42, facing: 'left', seed: 6, hunch: 0.55 });
    A.zombie(g, 272, 137, { variant: 'bonnet', height: 42, facing: 'left', seed: 12, hunch: 0.35 });
  }
  // the extra light of a breath in: the scene is painted dim and bright, each frame blends the two with a dither
  const breathe = g => A.glow(g, CX, TY + 4, 78, { color: 'teal5', strength: 0.22, power: 1.3, ry: 46 });

  // mode 0: the far town only; 1: everything but the wheel; 2: everything; 3: everything over a blank (finds the far pixels)
  function paint(g, mode) {
    if (mode === 3) g.buf.fill(A.col('red6')); else far(g);
    if (mode) { houses(g); waag(g); }
    A.haze(g, 0, 26, 320, GY - 26, { top: 0.3, bottom: 0.62, color: 'mist2', lights: 0.6 });
    if (mode) { cobbles(g); market(g); backDead(g); }
    if (mode >= 2) wheel(g);
    lights(g);
  }
  const LV = 9;                                          // breath levels, each painted in advance
  let plates = null, isFar = null, wheelIdx = null, label = null;
  function build(g) {
    A.key(g, CX, TY + 4, 2);
    paint(g, 0); const farP = g.buf.slice();
    paint(g, 3); const blank = g.buf.slice();
    paint(g, 1); const midP = g.buf.slice(); breathe(g); const midB = g.buf.slice();
    paint(g, 2); const allP = g.buf.slice(); breathe(g); const allB = g.buf.slice();
    isFar = new Uint8Array(allP.length); const idx = [];
    for (let i = 0; i < allP.length; i++) { isFar[i] = allP[i] !== blank[i] ? 1 : 0; if (allP[i] !== midP[i] || allB[i] !== midB[i]) idx.push(i); }
    wheelIdx = Int32Array.from(idx);
    // one frame per breath level: the far town where it shows, everything nearer dithered from dim to bright
    plates = [];
    for (let k = 0; k < LV; k++) {
      const lv = k / (LV - 1), p = new Uint8Array(allP.length);
      for (let i = 0; i < p.length; i++) p[i] = isFar[i] ? farP[i] : lv > BAY[i] ? allB[i] : allP[i];
      plates.push(p);
    }
    label = { str: 'Extra belegen.', w: Math.ceil(A.textWidth('Extra belegen.', 5, true)) + 8, h: 10 };
  }

  A.panels[2] = {
    text: 'Nobody agrees on what caused it. Some say it was the cheese.',
    nl: 'Niemand is het eens over de oorzaak. Sommigen zeggen: de kaas.',
    draw(g, t) {
      const T = ((t % PER) + PER) % PER, zt = T * ZT, br = 0.5 - 0.5 * Math.cos(T / PER * TAU * 2);   // two breaths per loop
      if (!plates || plates[0].length !== g.buf.length) build(g);
      A.key(g, CX, TY + 4, 2);
      const buf = g.buf, P = plates[Math.round(br * (LV - 1))];
      // the frame for this breath, the mill's sails over the roofs (put back wherever something nearer stands in front)
      buf.set(P); sails(g, T);
      for (let y = MY - 33; y <= MY + 33; y++) for (let x = MX - 33, i = y * 320 + x; x < 320; x++, i++) if (!isFar[i]) buf[i] = P[i];
      g.mask.fill(0);
      fog(g, T, 96, 30, 0.38, 'mist3', 5, 5);                                    // along the foot of the Waag, over the dead at the back
      for (let k = 0; k < wheelIdx.length; k++) { const i = wheelIdx[k]; buf[i] = P[i]; }
      // the sniffer and the woman across from him
      const l = lean(T), sn = sniffAt(T), dip = sn >= 0 && Math.sin(sn * TAU * 2) > 0 ? 1 : 0;
      const z = A.zombie(g, 117 + dip, 158, { height: 52, facing: 'right', t: zt, seed: 4, hunch: 0.6 + 0.38 * l + 0.1 * dip, clogs: true });
      A.zombie(g, 242, 161, { variant: 'woman', height: 56, facing: 'left', t: zt, seed: 8, hunch: 0.28 });
      // spores rising off the wheel, and drawn up his nose when he sniffs
      for (let i = 0; i < 18; i++) {
        const p = (T / PER * 2 + A.hash(i, 61)) % 1, x0 = CX + (A.hash(i, 62) * 1.6 - 0.8) * RX, y0 = TY + (A.hash(i, 63) * 1.2 - 0.6) * RY;
        const x = x0 + Math.sin(p * TAU + i) * 3, y = y0 - 2 - p * 46, c = p < 0.35 ? 'mist7' : p < 0.7 ? 'mist5' : 'green7';
        A.px(g, x, y, c); if (p < 0.5 && i % 3 === 0) A.px(g, x + 1, y, 'mist4');
      }
      const nose = [z.head[0] + 4, z.head[1] + 5];
      if (sn >= 0) for (let i = 0; i < 5; i++) {
        const k = Math.min(1, sn * 1.6 - i * 0.16); if (k <= 0 || k >= 1) continue;
        const sx = CX - 28 + i * 7, sy = TY - 3 + (i & 1) * 3;
        A.px(g, sx + (nose[0] - sx) * k, sy + (nose[1] - sy) * k - Math.sin(k * Math.PI) * 4, k < 0.5 ? 'mist7' : 'mist5');
      }
      fog(g, T, 150, 26, 0.3, 'mist2', 8, 6);                                    // ground fog round their feet
      A.text(CX, 63.6, 'KAASWAAG', 'mist4', 4.6, true, { align: 'center' });
      // his verdict, once he has straightened up
      if (T > 3.6 && T < 5.8) A.bubble(g, Math.max(2, nose[0] - label.w / 2 - 6), z.head[1] - 3 - label.h, label.w, label.h, { text: label.str, size: 5, tail: [nose[0], z.head[1] - 1] });
    },
  };
})();
