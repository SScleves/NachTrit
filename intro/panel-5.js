// Panel 5: two years here and he never practised; everyone was so nice about it.
// Before the mist: a café terrace on a wet, mild evening, the warmest panel of the intro. Right third opens onto a canal.
// Beat: 0..1.1 "Hoi!" alone; 1.1..1.4 blink; 1.4+ "Oh, English is fine!" and the whole café beams.
// Loops: pendant sway, candle flicker, steam, far mill sails (anticlockwise), mist, blinks and talk, a waving patron.
(function () {
  const A = window.NRART;
  const H = A.hash;
  function steam(g, x, y, t, seed) {
    for (let i = 0; i < 5; i++) {
      const k = ((t * 0.8 + i / 5 + seed * 0.13) % 1), yy = y - k * 9, xx = x + Math.sin(k * 6 + i + seed) * 1.5;
      if (k < 0.85) A.px(g, xx, yy, k < 0.4 ? 'mist6' : 'mist4');
    }
  }
  function cobbles(g, x, y, w, h, base) {
    A.rect(g, x, y, w, h, base);
    for (let r = 0; r < h; r += 3) for (let c = -8; c < w; c += 6) {
      const xx = x + c + ((r / 3) & 1 ? 3 : 0), v = H(c + 50, r);
      A.hline(g, xx, y + r + 2, 6, 'slate1'); A.vline(g, xx, y + r, 3, 'slate1');
      if (v < 0.3) A.hline(g, xx + 1, y + r, 4, 'slate5'); else if (v < 0.5) A.hline(g, xx + 1, y + r, 3, 'slate4');
    }
  }
  function pendant(g, x, t, seed) {
    const sway = Math.round(Math.sin(t * Math.PI * 2 / 4 + seed));
    A.vline(g, x, 69, 18, 'wood1');
    A.poly(g, [x - 4 + sway, 94, x + 4 + sway, 94, x + 2 + sway, 88, x - 2 + sway, 88], 'wood3');
    A.hline(g, x - 3 + sway, 94, 7, 'amber8');
  }
  // a far-bank house drawn locally: flat facade, a gable, a grid of small windows, no per-window glow
  function house(g, x, by, w, h, gable, brickC, litP, seed) {
    const top = by - h;
    A.rect(g, x, top, w, h, brickC);
    if (gable === 'step') for (let i = 0; i < 3; i++) A.rect(g, x + 2 + i * 3, top - 3 * (i + 1), w - 4 - i * 6, 3, brickC);
    else if (gable === 'bell') { A.poly(g, [x + 2, top, x + w - 2, top, x + w - 7, top - 7, x + w / 2, top - 13, x + 7, top - 7], brickC); A.disc(g, x + w / 2, top - 12, 2, brickC); }
    A.brick(g, x, top - 14, w, h + 14, { base: brickC, only: brickC, seed });
    A.hline(g, x, top, w, 'night5');
    const cols = Math.floor((w - 3) / 6), rows = Math.floor((h - 8) / 10), x0 = x + Math.floor((w - (cols * 6 - 3)) / 2);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const wx = x0 + c * 6, wy = top + 5 + r * 10, lit = A.hash(seed * 9 + c, r + 2) < litP;
      A.rect(g, wx - 1, wy - 1, 5, 7, 'night5'); A.rect(g, wx, wy, 3, 5, lit ? 'amber4' : 'night1');
      if (lit) { A.hline(g, wx, wy, 3, 'amber6'); A.px(g, wx + 1, wy + 4, 'amber3'); }
    }
    A.rect(g, x, by - 3, w, 3, 'night1');
  }
  // the moon without the big glow: a dithered halo and the disc with its dark side
  function moon(g, x, y, r) {
    A.ditherDisc(g, x, y, r * 2, 'night5', 0.5, 2, null);
    A.disc(g, x, y, r, 'paper5');
    for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
      if (xx * xx + yy * yy > r * r + r) continue;
      if ((xx + 4) * (xx + 4) + yy * yy > r * r + r) A.px(g, x + xx, y + yy, xx > 0 ? 'paper3' : 'paper4');
    }
    A.px(g, x - 3, y - 2, 'paper4'); A.px(g, x + 1, y + 2, 'paper4'); A.px(g, x - 1, y + 4, 'paper3');
  }
  // a patron in the window, drawn locally: dark bob, a scarf, eyes on the door, a glass that goes up for the English
  function patron(g, x, y, t, seed, up) {
    const k = seed % 3, hair = ['wood1', 'night1', 'wood2'][k], top = ['red2', 'green3', 'teal3'][k], edge = ['red3', 'green4', 'teal4'][k];
    A.rect(g, x - 7, y - 24, 14, 24, top); A.rect(g, x - 7, y - 24, 2, 24, edge); A.rect(g, x - 3, y - 24, 6, 3, 'paper4');
    A.rect(g, x - 4, y - 36, 8, 10, 'skin4'); A.rect(g, x - 5, y - 38, 10, 4, hair); A.rect(g, x - 5, y - 36, 2, 9, hair); A.rect(g, x + 3, y - 36, 2, 9, hair);
    A.px(g, x - 1, y - 32, 'night1'); A.px(g, x + 2, y - 32, 'night1');
    A.hline(g, x - 2, y - 29, 4, 'red3'); A.px(g, x - 3, y - 30, 'red3'); A.px(g, x + 2, y - 30, 'red3');
    const w = up ? (Math.sin(t * 3 + seed) > 0 ? 0 : 1) : 0;
    if (up) { A.rect(g, x + 7, y - 27 - w, 2, 12, top); A.rect(g, x + 6, y - 32 - w, 4, 5, 'cheese4'); A.hline(g, x + 6, y - 32 - w, 4, 'paper6'); }
    else { A.rect(g, x + 7, y - 20, 2, 7, top); A.rect(g, x + 6, y - 18, 4, 5, 'cheese4'); A.hline(g, x + 6, y - 18, 4, 'paper6'); }
  }
  // a long reflection on wet ground: dashes that thin, darken and wobble with the distance, broken by ripples
  function bar(g, x, y, w, len, t, seed, bright) {
    for (let k = 0; k < len; k++) {
      const f = k / len, ph = Math.floor(t * 1.5 + k * 0.5 + seed);
      if ((k + ph) % 4 === 3 || H(k + seed * 7, ph) > 0.92 - f * 0.5) continue;               // ripples cut the bar into pieces
      const ww = Math.max(2, Math.round(w * (1 - 0.3 * f))), off = f > 0.5 ? Math.round(Math.sin(k * 0.5 + t * 1.5 + seed)) : 0;
      const c = bright ? (f < 0.3 ? 'amber5' : f < 0.6 ? 'amber4' : 'amber3') : (f < 0.25 ? 'amber3' : f < 0.6 ? 'amber2' : 'amber1');
      A.hline(g, x - ww / 2 + off, y + k, ww, c);
    }
  }
  // the barman, drawn locally: white shirt, apron, a polite smile
  function barman(g, x, y, t) {
    A.rect(g, x - 7, y - 20, 14, 20, 'paper4'); A.rect(g, x - 5, y - 12, 10, 12, 'paper3'); A.vline(g, x - 7, y - 20, 20, 'paper2');
    A.rect(g, x - 2, y - 20, 4, 2, 'red3');
    A.rect(g, x - 3, y - 29, 6, 8, 'skin4'); A.rect(g, x - 4, y - 31, 8, 3, 'wood1'); A.rect(g, x - 4, y - 28, 1, 2, 'wood1');
    A.px(g, x - 2, y - 26, 'night1'); A.px(g, x + 1, y - 26, 'night1');
    A.hline(g, x - 1, y - 23, 3, 'red3'); A.px(g, x - 2, y - 24, 'red3'); A.px(g, x + 2, y - 24, 'red3');
    const w = Math.sin(t * 5) > 0 ? 0 : 1;
    A.rect(g, x + 7, y - 17 - w, 2, 6, 'paper3'); A.rect(g, x + 7, y - 19 - w, 2, 2, 'skin4');
  }

  // ---- static layers are painted once per camera offset and copied back each frame (the camera drifts a few pixels, so there are only a handful)
  const cacheA = new Map(), cacheB = new Map();
  const offs = (g, ds) => ds.map(d => { A.depth(g, d); return g.ox; }).join(',');

  // far town and the bank, the bridge: everything in the canal vista that never moves (the mill, mist, water and stars come later)
  function paintVista(g) {
    A.depth(g, 0);
    A.sky(g, ['night2', 'night4', 'night5', 'mist2', 'mist4'], 0, 128);   // moonlit fog: palest at the horizon
    A.glow(g, 288, 122, 70, { ry: 46, color: 'mist5', strength: 0.4, power: 1.2 });   // the fog glows where the moon lights it
    moon(g, 292, 24, 8);
    A.depth(g, 0.25);                                          // far town: dark silhouettes on the pale fog
    A.church(g, 254, 124, 1.15, { tone: 'night3' });
    A.canalHouse(g, 268, 124, 22, 30, { gable: 'step', brick: 'night3', lit: 0, glow: 0, door: false, hoist: false, seed: 21 });
    A.haze(g, 220, 60, 110, 66, { top: 0.0, bottom: 0.4, color: 'mist3', lights: 0.7 });
    A.depth(g, 0.5);                                           // the near bank, the bridge, the canal
    A.rect(g, 205, 128, 130, 26, 'night2');
    house(g, 212, 134, 30, 46, 'step', 'night3', 0.75, 3);
    A.rect(g, 284, 124, 46, 11, 'night2'); A.hline(g, 284, 124, 46, 'night4');                       // the far quay under the mill
    A.archBridge(g, 240, 135, 48, 12, { brick: 'brick2' });
    for (const lx of [246, 264]) { A.vline(g, lx, 109, 3, 'slate1'); A.px(g, lx, 108, 'amber7'); }   // lanterns on the bridge rail
  }

  // the café wall, the ground and everything on them that holds still
  function paintWall(g, nice) {
    A.depth(g, 0.85);
    A.rect(g, -20, 0, 242, 152, 'brick2'); A.rect(g, -20, 0, 242, 40, 'brick1');
    A.ditherGradient(g, -20, 40, 242, 6, 'brick1', 'brick2', 'down');
    A.brick(g, -20, 0, 242, 40, { base: 'brick1', only: 'brick1', seed: 4 });        // brick only where it shows
    A.brick(g, -20, 40, 242, 26, { base: 'brick2', only: 'brick2', seed: 4 });
    A.brick(g, -20, 66, 23, 72, { base: 'brick2', only: 'brick2', seed: 4 }); A.brick(g, 102, 66, 120, 24, { base: 'brick2', only: 'brick2', seed: 4 });
    A.brick(g, 146, 90, 76, 48, { base: 'brick2', only: 'brick2', seed: 4 }); A.brick(g, 102, 90, 8, 48, { base: 'brick2', only: 'brick2', seed: 4 });
    A.vline(g, 221, 0, 152, 'brick3'); A.vline(g, 222, 0, 152, 'brick1');   // the corner of the house
    A.rect(g, -20, 138, 242, 14, 'wood1'); for (let x = -20; x < 222; x += 9) A.vline(g, x, 138, 14, 'wood0'); A.hline(g, -20, 138, 242, 'wood3');
    // upper windows (their light is added below, once)
    A.window(g, 40, 10, 20, 30, { lit: 1, seed: 4, frame: 'paper2', detail: 'cat', glow: 0 });
    A.window(g, 160, 12, 20, 30, { lit: 0.6, seed: 5, frame: 'paper2', detail: 'tulip', glow: 0 });
    A.window(g, 196, 12, 16, 30, { lit: 0, frame: 'paper2' });
    A.glow(g, 50, 25, 39, { strength: 0.12, color: 'amber5', power: 1.2, q: 4 }); A.glow(g, 170, 27, 39, { strength: 0.1, color: 'amber5', power: 1.2, q: 4 });
    // awning: dark, so the faces lead
    A.poly(g, [-2, 40, 108, 40, 114, 54, -8, 54], 'red1');
    for (let x = -8; x < 114; x += 14) A.poly(g, [x, 40, x + 7, 40, x + 9, 54, x + 2, 54], 'paper2');
    for (let x = -8; x < 114; x += 7) A.px(g, x + 3, 55, x % 14 ? 'paper1' : 'red1');
    A.hline(g, -2, 40, 110, 'red2');
    A.rect(g, 28, 56, 56, 10, 'wood1'); A.hline(g, 28, 56, 56, 'wood2');
    A.text(56, 64, 'CAFÉ', 'amber6', 8, true, { align: 'center' });
    // big front window: flat amber bands, shelves and bottles; the people come later, in front
    A.rect(g, 3, 66, 99, 68, 'wood2'); A.rect(g, 6, 69, 93, 61, 'amber3');
    A.rect(g, 6, 88, 93, 20, 'amber4'); A.rect(g, 6, 108, 93, 22, 'amber5');
    A.ditherGradient(g, 6, 85, 93, 3, 'amber3', 'amber4', 'down'); A.ditherGradient(g, 6, 105, 93, 3, 'amber4', 'amber5', 'down');
    for (let i = 0; i < 2; i++) { A.rect(g, 10, 80 + i * 12, 86, 2, 'wood3'); for (let j = 0; j < 17; j++) A.rect(g, 11 + j * 5, 74 + i * 12 + (j & 1), 2, 6 - (j & 1), ['red3', 'green3', 'paper4', 'cheese4', 'teal3'][(i + j) % 5]); }
    // door, dark enough that the hero stands out on brick
    A.rect(g, 110, 90, 36, 48, 'wood1'); A.rect(g, 113, 93, 30, 45, 'amber1'); A.rect(g, 113, 93, 30, 20, 'amber2');
    A.vline(g, 128, 93, 45, 'wood1'); A.hline(g, 113, 113, 30, 'wood1'); A.rect(g, 117, 98, 7, 9, 'amber4'); A.rect(g, 133, 98, 7, 9, 'amber4');
    // hanging wall lantern between the two of them, above the candle
    A.rect(g, 176, 78, 8, 10, 'amber7'); A.rect(g, 175, 77, 10, 2, 'night1'); A.rect(g, 175, 88, 10, 2, 'night1'); A.vline(g, 180, 66, 11, 'night1');
    A.glow(g, 180, 83, 34, { ry: 28, color: 'amber5', strength: 0.4, power: 1.4 });
    A.glow(g, 54, 106, 66, { ry: 50, color: 'amber5', strength: 0.32, power: 1.3 });      // the window's spill, one glow
    // pavement and quay
    cobbles(g, -20, 150, 350, 12, 'slate3');
    A.ditherGradient(g, -20, 150, 350, 4, 'slate3', null, 'up');
    A.hline(g, -20, 162, 350, 'slate1');
    A.rect(g, 222, 150, 100, 2, 'slate4'); A.hline(g, 222, 150, 100, 'slate5');   // quay coping
    A.depth(g, 1);
    A.rect(g, -20, 163, 350, 20, 'night2');
    A.rect(g, 6, 148, 28, 6, 'wood2'); A.hline(g, 6, 148, 28, 'wood4');
    A.omafiets(g, 66, 160, { t: 0, facing: 'right', basket: null });
    A.bollard(g, 236, 162); A.bollard(g, 262, 162); A.bollard(g, 108, 162);
  }
  const copyWall = (g, B) => {
    const w = g.w, edge = Math.min(w - 1, B.edge);
    for (let y = 0; y < 148; y++) g.buf.set(B.buf.subarray(y * w, y * w + edge + 1), y * w);
    g.buf.set(B.buf.subarray(148 * w), 148 * w);
  };

  A.panels[4] = {
    text: 'Two years here and he never practised. Everyone spoke English. Everyone was so nice about it.',
    nl: 'Twee jaar hier en nooit geoefend. Iedereen sprak Engels. Iedereen deed er zo aardig over.',
    draw(g, t) {
      const T1 = 1.1, T2 = 1.4, nice = t >= T2;                 // 'Hoi!' alone, then the deflation
      A.camera(g, t, { x: 5, period: 8 }); A.key(g, 60, 100, 1);
      // ---- 1. the vista: cached sky, far town, bank and bridge; then what moves (stars, mill, mist, water, a moored sloep)
      const kA = offs(g, [0.25, 0.5]);
      if (cacheA.has(kA)) g.buf.set(cacheA.get(kA)); else { paintVista(g); cacheA.set(kA, g.buf.slice()); }
      A.depth(g, 0); A.stars(g, t, { n: 9, y0: 0, y1: 60, x0: 224, x1: 270 });
      A.depth(g, 0.3);
      A.windmill(g, 304, 124, 0.85, -t * Math.PI * 2 / 16, { tone: 'night3', t, lit: 1 });
      A.depth(g, 0.5);
      A.mist(g, t, 124, 12, { amount: 0.2, speed: 3, seed: 7 });
      A.water(g, 205, 135, 130, 15, { t, amp: 0.7, speed: 0.6, color: 'night2', dark: 0.3, glints: 4, gaps: 0.12 });
      A.depth(g, 0.8);
      A.boat(g, 272, 147, { kind: 'barge', len: 40, mast: true, t });
      A.streak(g, 233, 135, 14, { t, seed: 11, width: 2, strength: 0.7 });
      A.water(g, 252, 148, 40, 3, { t, amp: 0.4, speed: 0.6, color: 'night2', dark: 0.3, glints: 0 });
      A.reeds(g, 300, 150, 22, 14, { t });
      // ---- 2. the wall and ground, cached the same way and copied over (right of the corner the vista shows through)
      const kB = offs(g, [0.85, 1]);
      let B = cacheB.get(kB);
      if (B) copyWall(g, B);
      else { paintWall(g, nice); B = { buf: g.buf.slice(), edge: 222 + (A.depth(g, 0.85), g.ox) }; cacheB.set(kB, B); }
      A.depth(g, 0.85);
      // ---- 3. the window: everyone in the café, turned toward the door, beaming
      A.friend(g, 18, 128, { t, seed: 6, face: nice ? 'smile' : 'blink', arm: 'drink', shadow: false });
      patron(g, 38, 118, t, 1, nice);
      A.friend(g, 62, 128, { t, seed: 9, face: 'smile', arm: 'wave', shadow: false });
      barman(g, 76, 118, t);
      patron(g, 90, 118, t, 2, false);
      A.rect(g, 6, 118, 93, 12, 'wood2'); A.hline(g, 6, 118, 93, 'wood4');
      for (let i = 0; i < 4; i++) A.rect(g, 14 + i * 22, 115, 3, 3, 'paper5');
      A.vline(g, 51, 69, 61, 'wood2'); A.vline(g, 52, 69, 61, 'wood1');
      pendant(g, 28, t, 0); pendant(g, 76, t, 2);
      // ---- 4. the street: mist behind the people, the lamp, dogs, the two of them at the table
      A.depth(g, 1);
      A.tulips(g, 8, 148, 24, { t });
      A.mist(g, t, 148, 12, { amount: 0.16, speed: 4, seed: 3 });
      A.lamp(g, 232, 152, { t, style: 'lantern', h: 46, flicker: 0.05, light: false });
      A.glow(g, 233, 103, 12, { color: 'amber6', strength: 0.5, power: 1.6, q: 4 });
      A.dog(g, 166, 160, { coat: 'brown', pose: 'lie', t, shadow: false });
      A.dog(g, 183, 160, { coat: 'golden', pose: 'lie', t, look: 'up', shadow: false });
      A.shadow(g, 208, 156, 11, 2, 0.8);
      const f = A.friend(g, 208, 156, { t, face: nice ? (t < 3.2 ? 'talk' : 'smile') : 'smile', arm: nice && t > 3.4 ? 'drink' : 'down', shadow: false });
      const mx = 140, seat = 148;
      A.rect(g, mx - 8, seat - 18, 16, 2, 'wood3'); A.rect(g, mx - 8, seat - 18, 2, 20, 'wood2'); A.rect(g, mx + 6, seat - 18, 2, 20, 'wood2'); A.rect(g, mx - 8, seat, 16, 2, 'wood2');
      A.vline(g, mx - 7, seat + 2, 10, 'wood1'); A.vline(g, mx + 6, seat + 2, 10, 'wood1');
      A.shadow(g, mx, 160, 11, 2, 0.8);
      const manFace = t < T1 ? (Math.sin(t * 10) > 0 ? 'talk' : 'smug') : t < T2 ? 'blink' : t < 3.6 ? 'deadpan' : 'worry';
      A.man(g, mx, seat, { t, pose: 'sit', facing: 'front', face: manFace, floor: 12 });
      steam(g, mx + 15, 138, t, 1);
      // table in front of both
      A.shadow(g, 166, 160, 24, 2, 0.6);
      A.rect(g, 165, 146, 3, 14, 'wood1'); A.rect(g, 158, 158, 17, 2, 'wood1');
      A.ellipse(g, 166, 142, 19, 3, 'wood3'); A.hline(g, 149, 141, 35, 'wood5'); A.hline(g, 152, 144, 29, 'wood1');
      A.rect(g, 153, 135, 4, 6, 'cheese4'); A.rect(g, 153, 135, 4, 1, 'paper6');
      A.rect(g, 176, 136, 4, 5, 'cheese4'); A.rect(g, 176, 136, 4, 1, 'paper6');
      A.rect(g, 165, 136, 3, 5, 'paper5'); A.px(g, 166, 135, 'night1');
      const fl = Math.round(Math.sin(t * Math.PI * 2 * 3) * 0.6 + Math.sin(t * Math.PI * 2 * 5) * 0.4);
      A.px(g, 166 + (fl > 0 ? 1 : 0), 134, 'amber8'); A.px(g, 166, 133, 'amber7');
      A.glow(g, 166, 135, 18, { color: 'amber6', strength: 0.5 + 0.08 * fl, power: 1.3, q: 4 });
      // ---- 5. wet street reflecting everything above
      A.water(g, -20, 163, 350, 17, { t, amp: 0.6, speed: 0.5, color: 'night2', dark: 0.3, glints: 5, gaps: 0.1 });
      // long, thin, broken reflections of the window, the door, the lantern and the candle, from the kerb down to the bottom edge
      [[18, 9], [40, 7], [64, 10], [88, 7]].forEach(([sx, w], i) => bar(g, sx, 163, w, 17, t, i + 1, false));
      bar(g, 128, 163, 8, 17, t, 8, false); bar(g, 180, 163, 3, 17, t, 10, true); bar(g, 232, 163, 4, 17, t, 11, true);
      A.ellipse(g, 166, 172, 26, 4, 'night3'); A.ellipse(g, 166, 172, 22, 3, 'night4');
      A.rect(g, 138, 166, 5, 6, 'orange3'); A.rect(g, 202, 166, 5, 7, 'blue2');
      A.streak(g, 166, 166, 8, { t, seed: 9, width: 2, strength: 0.8 });
      A.px(g, 150 + Math.round(Math.sin(t * 1.5) * 3), 174, 'mist5'); A.px(g, 182 - Math.round(Math.sin(t * 1.5) * 3), 170, 'mist4');
      // ---- 6. speech: two steps
      A.say(g, mx, seat - 28, 'Hoi!', {});
      if (nice) A.say(g, f.head[0], f.head[1], 'Oh, English is fine!', { dx: 14 });
    },
  };
})();
