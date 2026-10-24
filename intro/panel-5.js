// Panel 5: "Or the millionth tourist who said it sounds like a drunk German."
// Night on a canal. Over the lit brick bridge hangs a banner in the national colours for the millionth tourist and the
// confetti is still coming down. He has his camera up, the flash goes, and he says it. The tall locals on the bridge turn
// round to him one by one, lean in, and their eyes go yellow, and at that very moment the mist starts to rise off the
// canal. In the dark under the bridge more eyes open.
// Key light: his flash. Layers: the sky and a far spire, the canal houses, the bridge and the people on it, the canal and
// its mist, two mooring piles and a moored sloep in front.
// Loop 6 s: the flash at 0 (one white frame that also hides the restart) and a second photo at 3.4; the locals turn at
// 1.0, 1.4, 1.8 and 2.2, their eyes coming on a beat later; the eyes under the bridge from 2.7; from 1.0 the mist climbs
// off the water and its wisps slide along; the confetti falls on its own seamless cycle; the water ripples.
(function () {
  const A = window.NRART, PER = 6, W = 320, H = 180;
  const sm = k => k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k);
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
  const WL = 150, AC = 165, AR = 60, ACR = 126;                     // the waterline; the arch: centre, half span, crown
  const deck = x => 112 - Math.round(3 * Math.max(0, 1 - ((x - AC) / 170) ** 2));
  const archY = (x, ar, cr) => { const u = (x + 0.5 - AC) / ar; return Math.abs(u) >= 1 ? WL : Math.round(WL - (WL - cr) * Math.sqrt(1 - u * u)); };
  const TX = 62, LANT = [134, 262];                                  // the tourist; the two bridge lanterns
  const LINE = 'Sounds like a drunk German.'; let bubbleW = 0;
  const LOCALS = [
    { x: 168, v: 'woman', h: 60, seed: 3, shirt: 'teal2', turn: 1.0 },
    { x: 202, v: 'plain', h: 57, seed: 7, shirt: 'night4', pants: 'slate2', turn: 1.4 },
    { x: 236, v: 'woman', h: 64, seed: 12, shirt: 'brick2', hair: 'long', turn: 1.8 },
    { x: 292, v: 'plain', h: 56, seed: 21, shirt: 'green2', turn: 2.2 },
  ];
  const HOUSES = [[-8, 30, 74, 'step', 'brick2'], [22, 26, 86, 'bell', 'brick3'], [48, 32, 70, 'neck', 'slate2'], [80, 24, 90, 'spout', 'brick1'],
    [104, 34, 80, 'step', 'brick3'], [138, 28, 92, 'bell', 'brick2'], [166, 36, 76, 'neck', 'slate3'], [202, 26, 88, 'step', 'brick2'],
    [228, 32, 82, 'bell', 'brick1'], [260, 28, 94, 'spout', 'brick3'], [288, 38, 78, 'neck', 'brick2']];
  function flashes(T) {
    const big = T < 0.05 ? 1 : T < 0.4 ? (1 - (T - 0.05) / 0.35) ** 2 : 0, d = T - 3.4;
    return [big, d >= 0 && d < 0.3 ? (1 - d / 0.3) ** 2 : 0];
  }

  // ---------------------------------------------------------------- the millionth tourist, side view, facing right
  const TOURIST = [
    '........HHHH........', '.......HHHHHH.......', '.......hbbbbh.......', '....HHHHHHHHHHHH....', '....h..rSSSSSS......',
    '.......rSSSSSSS.....', '.......rsSSSSSSS....', '.......rsSSSSSS.....', '........sSSSSSS.....', '........sSSSSSS.....',
    '.........sSSSSs.....', '..........sSSs......', '...kBBBB.TTTTTT.....', '..kBBBBBzTTTTTTT....', '..kBBKBBzTRTTWTT....',
    '..kBBBBBTzTTTTTRT...', '..kBBBBBTTzWTTTTT...', '..kBBKBBTTTzTTRTTT..', '..kBBBBBTRTTTTTTWT..', '..kBBBBBTTTTWTTTTT..',
    '..kBBBBBTTTTTTRTTT..', '..kBBBBBtTWTTTTTTT..', '..kBBBBBtTTTTRTTTt..', '..kkBBBBttTTTTTTTt..', '...kkkkkttttttttt...',
    '......PPPPPPPPPP....', '......PPPPPPPPPP....', '......pPPPpPPPPP....', '......pPPP.pPPPP....', '.......sS...SSS.....',
    '.......sS...SSS.....', '.......sS...SSS.....', '.......sS...SSS.....', '.......sS...SSS.....', '.......XX...XXX.....',
    '.......XX...XXX.....', '......wwwww.wwwwww..', '......xxxxx.xxxxxx..',
  ];
  const TCOL = { H: 'paper4', h: 'paper2', b: 'red3', r: 'wood1', S: 'skin4', s: 'skin3', T: 'teal4', t: 'teal2', R: 'red4', W: 'paper5',
    B: 'blue3', k: 'blue1', K: 'blue4', z: 'night1', P: 'wood5', p: 'wood4', X: 'paper6', w: 'paper5', x: 'paper2' };
  let TLEG = null;
  function tourist(g, x, y, T, firing) {
    if (!TLEG) { TLEG = {}; for (const k in TCOL) TLEG[k] = A.col(TCOL[k]); }
    const P = A.pen(g, x, y, false), talk = T > 0.25 && T < 1.5 && Math.floor(T * 9) % 2 === 0;
    A.shadow(g, x + 1, y, 10, 2, 0.5);
    A.begin(g);
    P.map(-9, -38, TOURIST, TLEG);
    P.l(0, -25, 2, -20, 'teal2', 2); P.l(2, -20, 2, -29, 'skin3', 2);                                 // far arm up to the camera
    P.r(3, -32, 6, 4, 'slate2'); P.r(3, -32, 6, 1, 'slate4'); P.r(3, -29, 6, 1, 'slate1'); P.r(2, -31, 1, 3, 'skin3');   // the camera body
    P.r(9, -31, 3, 3, 'steel3'); P.r(9, -31, 3, 1, 'steel5'); P.r(11, -30, 1, 2, 'blue4'); P.p(11, -30, 'paper5');      // the lens
    P.r(5, -35, 3, 3, 'steel4'); P.r(5, -35, 3, 1, 'steel5'); P.r(7, -35, 1, 3, firing ? 'paper6' : 'paper4');          // the flash
    if (talk) { P.r(4, -28, 2, 1, 'night0'); P.p(4, -27, 'red1'); } else P.r(4, -28, 2, 1, 'skin2');
    P.l(2, -25, 5, -19, 'teal4', 2); P.l(5, -19, 9, -28, 'skin4', 2); P.r(8, -28, 3, 1, 'skin4');   // near arm, the hand under the lens
    A.end(g);
  }

  // ---------------------------------------------------------------- the locals: tall and upright, then they turn, lean in, and the eyes come on
  function local(g, L, T) {
    const k = T - L.turn, lit = k >= 0.18 && !(k >= 0.26 && k < 0.32);
    return A.zombie(g, L.x, deck(L.x), { variant: L.v, t: T, seed: L.seed, facing: k >= 0 ? 'left' : 'right', height: L.h,
      hunch: 0.02 + 0.34 * sm(k / 0.45), shirt: L.shirt, pants: L.pants, hair: L.hair, eyes: lit, glow: 0.25 + 0.5 * sm((k - 0.18) / 0.6), rim: 3 });
  }

  // ---------------------------------------------------------------- the static plate
  function backdrop(g) {
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist1'], 0, 104);
    A.glow(g, 304, 11, 40, { color: 'mist3', strength: 0.25, power: 1.6 });
    A.moon(g, 304, 11, 6, { halo: 0.3 });
    // far: a church tower and low roofs, one flat cold tone, then the fog over them
    for (let x = -4, i = 0; x < W; i++) { const w = 10 + (A.hash(i, 3) * 10 | 0), h = 10 + (A.hash(i, 4) * 14 | 0); A.rect(g, x, 92 - h, w, h + 12, 'night3'); A.poly(g, [x, 92 - h, x + w / 2, 86 - h, x + w, 92 - h], 'night3'); x += w + 1; }
    A.rect(g, 61, 18, 10, 86, 'night3'); A.poly(g, [60, 18, 66, 0, 72, 18], 'night3'); A.disc(g, 66, 26, 2, 'amber2');
    A.haze(g, 0, 0, W, 104, { amount: 0.45, color: 'mist2' });
    // the canal houses on the far side, then the fog between them and the bridge
    HOUSES.forEach(([x, w, h, gable, brick], i) => A.canalHouse(g, x, 104, w, h, { gable, brick, lit: 0.36, t: 0, seed: 40 + i * 7 }));
    A.haze(g, 0, 0, W, 104, { top: 0.26, bottom: 0.68, color: 'mist2' });
    A.mist(g, 0, 64, 40, { amount: 0.4, speed: 0, color: 'mist3', seed: 2 });
    A.rect(g, 0, 104, W, 9, 'night2');                                                               // the far quay
  }
  function bridge(g) {
    for (let x = 0; x < W; x++) { const d = deck(x); A.vline(g, x, d + 2, WL - d - 2, 'brick2'); A.px(g, x, d, 'slate2'); A.px(g, x, d + 1, 'mist2'); }
    A.brick(g, 0, 108, W, WL - 108, { base: 'brick2', only: 'brick2', seed: 5, bw: 4, bh: 2 });
    A.rect(g, 0, WL - 3, W, 3, 'slate0'); A.hline(g, 0, WL - 3, W, 'slate1');                         // the wet stone foot
    // through the arch the canal goes on into the dark: a far quay, a few lit windows
    for (let x = AC - AR; x < AC + AR; x++) { const a = archY(x, AR, ACR); A.vline(g, x, a, WL - a, 'night1'); }
    A.rect(g, AC - 44, 134, 30, 10, 'night2'); A.rect(g, AC + 6, 131, 34, 13, 'night2'); A.rect(g, AC - 14, 137, 20, 7, 'night2');
    A.px(g, AC - 34, 137, 'amber3'); A.px(g, AC + 18, 135, 'amber4'); A.px(g, AC + 26, 138, 'amber3');
    A.rect(g, AC - AR, 144, 2 * AR, WL - 144, 'night0'); A.hline(g, AC + 16, 146, 4, 'amber2'); A.hline(g, AC - 36, 147, 3, 'amber1');
    for (let x = AC - AR; x < AC + AR; x++) { const a = archY(x, AR, ACR); A.vline(g, x, a, 3, 'night0'); }   // the soffit
    // the stone ring, voussoirs alternating, a keystone
    for (let x = AC - AR - 4; x < AC + AR + 4; x++) {
      const o = archY(x, AR + 4, ACR - 4), a = archY(x, AR, ACR);
      for (let y = o; y < a; y++) A.px(g, x, y, Math.floor(Math.atan2((WL - y) / (WL - ACR), (x + 0.5 - AC) / AR) / Math.PI * 23) % 2 ? 'mist2' : 'mist1');
    }
    A.rect(g, AC - 2, ACR - 5, 5, 6, 'mist3');
    // the bridge lights: bulbs along the ring and under the coping
    for (let k = 1; k < 20; k++) { const th = Math.PI * k / 20, x = AC + (AR + 6) * Math.cos(th), y = WL - (WL - ACR + 6) * Math.sin(th); A.px(g, x, y, 'amber8'); A.glow(g, x, y, 3, { color: 'amber6', strength: 0.35, q: 3 }); }
    for (let x = 4; x < W; x += 8) A.px(g, x, deck(x) + 3, 'amber7');
  }
  function railing(g) {
    for (let x = 0; x < W; x++) {
      if (LANT.some(l => x >= l - 2 && x <= l + 4)) continue;
      const d = deck(x);
      A.px(g, x, d - 12, 'slate2'); A.px(g, x, d - 11, 'slate0'); A.px(g, x, d - 1, 'slate0');
      if (x % 5 === 0) A.vline(g, x, d - 10, 9, 'slate0');
    }
  }
  function banner(g) {
    const x0 = LANT[0] + 3, x1 = LANT[1] + 3;
    for (const x of [x0, x1]) {
      A.vline(g, x, 14, deck(x) - 14, 'paper2'); A.px(g, x, 13, 'paper4');
      A.rect(g, x + 1, 14, 5, 1, 'red3'); A.rect(g, x + 1, 15, 5, 1, 'paper4'); A.rect(g, x + 1, 16, 5, 1, 'blue2');   // a little flag
    }
    for (let x = x0 + 1; x < x1; x++) {
      const s = Math.round(1.2 * Math.sin(Math.PI * (x - x0) / (x1 - x0)));
      A.vline(g, x, 20 + s, 2, 'red3'); A.vline(g, x, 22 + s, 9, (x - x0) % 13 === 9 ? 'paper4' : 'paper5'); A.vline(g, x, 31 + s, 2, 'blue2');
    }
    // bunting from the pole tops down to the ends of the bridge
    for (const [ax, ay, bx, by] of [[x0, 15, -2, 52], [x1, 15, W + 2, 50]]) {
      const n = Math.round(Math.hypot(bx - ax, by - ay) / 7);
      for (let i = 0; i <= n * 7; i++) { const u = i / (n * 7); A.px(g, ax + (bx - ax) * u, ay + (by - ay) * u + Math.sin(u * Math.PI) * 6, 'slate2'); }
      for (let i = 1; i < n; i++) { const u = i / n, px = ax + (bx - ax) * u, py = ay + (by - ay) * u + Math.sin(u * Math.PI) * 6; A.poly(g, [px - 1.5, py, px + 2.5, py, px + 0.5, py + 3.5], ['red4', 'paper5', 'blue3'][i % 3]); }
    }
  }
  // speed: everything that never moves is painted once. The railing runs in front of the people, so its pixels are
  // recorded (drawn once over a blank buffer) and copied back from the plate after they are drawn.
  let plate = null, rail = null;
  function build(g) {
    A.key(g, TX + 7, deck(TX) - 34, 1);
    backdrop(g); bridge(g);
    A.omafiets(g, 104, deck(104), { facing: 'left', t: 0, lamp: false, shadow: false });            // parked against the railing, of course
    const keep = g.buf; g.buf = new Uint8Array(keep.length).fill(255); railing(g);
    const idx = []; for (let i = 0; i < g.buf.length; i++) if (g.buf[i] !== 255) idx.push(i);
    rail = Int32Array.from(idx); g.buf = keep; railing(g);
    for (const x of LANT) A.lamp(g, x, deck(x), { style: 'lantern', h: 44, reach: 26, cone: 0.25 });
    banner(g);
    plate = g.buf.slice();
  }

  // ---------------------------------------------------------------- live: eyes under the bridge, mist, confetti
  const DEEP = [[126, 143, 2.7], [147, 140, 3.05], [189, 142, 3.4], [207, 139, 3.75]];   // x, y, when they open
  function deepEyes(g, T, halo) {
    for (const [x, y, s] of DEEP) {
      const k = T - s; if (k < 0 || (k > 0.06 && k < 0.12)) continue;
      if (halo) A.glow(g, x + 1, y, 4, { color: 'eye3', strength: 0.3 + 0.2 * sm(k / 0.5), power: 1.4, q: 4 });
      A.px(g, x, y, 'eye4'); A.px(g, x + 2, y, 'eye4');
    }
  }
  // the mist off the canal: a thin wavy layer lying on the water; from the moment it is said it thickens and climbs, its
  // top reaching the people's knees, throwing up wisps as it slides along. Lights and eyes keep most of themselves.
  // palette lookups for 0..8 eighths of a mix toward colour c, in one flat table: table[(q << 8) | colour]
  const table = (c, s) => { const t = new Uint8Array(9 * 256); for (let q = 0; q <= 8; q++) t.set(A.lut('mix', c, s * q / 8), q << 8); return t; };
  let FOG = null, CREST = null, BRIGHT = null;
  function mist(g, T) {
    if (!FOG) {
      FOG = table('mist4', 0.56); CREST = table('mist5', 0.56);
      BRIGHT = new Uint8Array(256); for (const c of ['amber6', 'amber7', 'amber8', 'eye2', 'eye3', 'eye4', 'paper6']) BRIGHT[A.col(c)] = 1;
    }
    const dens = (0.4 + 0.6 * sm((T - 1.0) / 1.4)) * 8, wisp = 0.35 + 0.65 * sm((T - 1.0) / 1.2);
    const lvl = WL + 8 - 68 * sm((T - 1.0) / 4.8), buf = g.buf, gw = g.w, gh = g.h;
    for (let x = 0; x < gw; x++) {
      let e = lvl + 3.5 * Math.sin(x * 0.06 + T * 1.1) + 2.5 * Math.sin(x * 0.17 - T * 1.9);
      for (let k = 0; k < 6; k++) {
        const d = (x - (((k * 61 + 23 + T * 6) % 360) - 20)) / 5;
        if (d > -3 && d < 3) e -= wisp * (9 + 5 * Math.sin(T * 1.7 + k * 2)) * Math.exp(-d * d);
      }
      const thick = (0.84 + 0.16 * Math.sin(x * 0.045 - T * 0.9)) * dens, bx = x & 3;   // thicker and thinner patches sliding along
      const yDeep = Math.min(gh, Math.max(0, Math.ceil(e + 44)));
      for (let y = Math.max(0, Math.ceil(e - 9)); y < yDeep; y++) {
        const i = y * gw + x, c = buf[i], below = y - e;
        let v = (below < 0 ? (below + 9) / 9 * 0.7 : 0.7 + below * 0.0068) * thick; if (BRIGHT[c]) v *= 0.3;
        let q = v | 0; if (v - q > BAY[((y & 3) << 2) | bx]) q++;
        if (q > 0) buf[i] = (below < 3 ? CREST : FOG)[((q > 8 ? 8 : q) << 8) | c];
      }
      // deep in the bank the density is even: two lookups and the dither between them
      const q0 = thick | 0, fr = thick - q0, o0 = q0 << 8, o1 = (q0 < 8 ? q0 + 1 : 8) << 8, ob = Math.round(thick * 0.3) << 8;
      for (let y = yDeep; y < gh; y++) { const i = y * gw + x, c = buf[i]; buf[i] = FOG[(BRIGHT[c] ? ob : fr > BAY[((y & 3) << 2) | bx] ? o1 : o0) | c]; }
    }
  }
  // the flash: at full strength the frame is blown out white; as it fades it falls off from the camera
  let FLASH = null, D2 = null;
  function flash(g, f, fx, fy, reach, base) {
    const buf = g.buf, gw = g.w, n = buf.length;
    if (!FLASH) FLASH = table('paper6', 1);
    if (!D2 || D2.length !== n) { D2 = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i % gw, y = (i / gw) | 0, dx = x < fx ? (x - fx) * 2.4 : x - fx; D2[i] = dx * dx + (y - fy) * (y - fy) * 1.7; } }   // thrown forward, little behind him
    const k = 1 / (reach * reach), f8 = f * 8, gh = g.h;
    for (let y = 0, i = 0; y < gh; y++) {
      const by = (y & 3) << 2;
      for (let x = 0; x < gw; x++, i++) {
        const d = D2[i] * k, v = f8 * (base - (d < 1 ? d : 1)); if (v <= 0) continue;
        let q = v | 0; if (v - q > BAY[by | (x & 3)]) q++;
        buf[i] = FLASH[((q > 8 ? 8 : q) << 8) | buf[i]];
      }
    }
  }
  const CONF = [];
  for (let i = 0; i < 46; i++) CONF.push({ x: 12 + A.hash(i, 1) * 300, y0: A.hash(i, 2) * 260, v: 30 + A.hash(i, 3) * 14, k: 1 + (A.hash(i, 4) * 3 | 0), a: 2 + A.hash(i, 5) * 5, ph: A.hash(i, 6) * 6.28, c: i % 3 });
  const CC = [['red4', 'red2'], ['paper6', 'paper3'], ['blue4', 'blue2']];
  function confetti(g, T) {
    const w = Math.PI * 2 / PER;
    for (const c of CONF) {
      const y = ((c.y0 + c.v * T) % (c.v * PER)) - 20; if (y < -2 || y > H) continue;
      const x = Math.round(c.x + Math.sin(T * w * c.k + c.ph) * c.a), spin = Math.sin(T * w * (c.k + 2) * 2 + c.ph), col = CC[c.c][spin > 0 ? 0 : 1];
      if (Math.abs(spin) < 0.3) A.px(g, x, y, col); else if ((c.k + c.c) % 2) A.rect(g, x, y, 2, 1, col); else A.rect(g, x, y, 1, 2, col);
    }
  }

  // two wooden mooring piles in the near water, bottom left, a rope sagging between them
  function piles(g) {
    A.begin(g);
    for (const [x, top, w] of [[10, 128, 6], [34, 140, 5]]) {
      A.rect(g, x, top, w, H - top, 'wood1'); A.vline(g, x + w - 1, top, H - top, 'wood0'); A.hline(g, x, top, w, 'wood2');
      for (let y = top + 6; y < H; y += 9) A.hline(g, x, y, w, 'wood0');
      A.rect(g, x, WL + 4, w, 3, 'green1');                                                           // the green line at the water
    }
    for (let i = 0; i <= 18; i++) A.px(g, 16 + i, 134 + Math.round(Math.sin(i / 18 * Math.PI) * 5) + Math.round(i * 0.4), 'wood3');
    A.end(g);
  }

  A.panels[4] = {
    text: 'Or the millionth tourist who said it sounds like a drunk German.',
    nl: 'Of aan de miljoenste toerist die zei dat het klinkt als een dronken Duitser.',
    draw(g, t) {
      const T = ((t % PER) + PER) % PER, [big, small] = flashes(T), ty = deck(TX), fx = TX + 7, fy = ty - 34;
      if (!plate || plate.length !== g.buf.length) build(g);
      if (big >= 1) { g.buf.fill(A.col('paper6')); return; }                                       // the shutter: one white frame
      const buf = g.buf; buf.set(plate); g.mask.fill(0);
      deepEyes(g, T, true);
      A.key(g, fx, fy, 2 + Math.round(Math.max(big, small)));
      tourist(g, TX, ty, T, big > 0.2 || small > 0.2);
      const heads = LOCALS.map(L => local(g, L, T));
      for (let j = 0; j < rail.length; j++) buf[rail[j]] = plate[rail[j]];                       // the railing, in front of them
      // the turn: a few motion lines where the head came round
      LOCALS.forEach((L, i) => {
        const k = T - L.turn; if (k < 0 || k > 0.28) return;
        const [hx, hy] = heads[i].head; for (const [a, b, c, d] of [[5, -2, 9, -5], [6, 2, 10, 2], [5, 6, 9, 9]]) A.line(g, hx + a, hy + b, hx + c, hy + d, 'paper5');
      });
      A.water(g, 0, WL, W, H - WL, { t: T, amp: 1.2, speed: 1.6, dark: 0.5, color: 'night1', glints: 12, glint: 'mist4' });
      LANT.forEach((x, i) => A.streak(g, x + 1, WL + 1, 28, { color: 'amber6', strength: 0.5, width: 2, t: T, seed: i * 3 + 1 }));
      mist(g, T); deepEyes(g, T, false);
      // in front: two mooring piles and a moored sloep
      piles(g);
      A.boat(g, 278, 178, { len: 78, kind: 'sloep', tone: 'night3', t: T });
      confetti(g, T);
      // the flash: blown out at 0 and fading back from the camera; the photo at 3.4 only throws its light over the bridge
      if (big > 0) flash(g, big, fx, fy, 300, 1.35);
      if (small > 0) flash(g, small, fx, fy, 250, 0.8);
      if (Math.max(big, small) > 0.3) { A.hline(g, fx - 5, fy, 11, 'paper6'); A.vline(g, fx, fy - 5, 11, 'paper6'); A.disc(g, fx, fy, 1, 'paper6'); }
      A.text(LANT[0] + 3 + (LANT[1] - LANT[0]) / 2, 29.6, '1.000.000e toerist', 'night1', 7.4, true, { align: 'center' });
      if (T >= 0.2) {
        if (!bubbleW) bubbleW = Math.ceil(A.textWidth(LINE, 7, true)) + 10;
        A.bubble(g, Math.max(3, Math.round(TX + 2 - bubbleW * 0.45)), ty - 59, bubbleW, 13, { tail: [TX + 3, ty - 40], text: LINE, size: 7 });
      }
    },
  };
})();
