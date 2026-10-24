// Panel 6: the only ones who still understand him are two dogs and a grammar book he never opened.
// A low camera, dog height. Back plane: the cold window with the watcher. Midground: the sofa, the man
// and his two dogs. Foreground: the coffee table with the book, the one hot spot in the frame.
// Key light: the dimmed floor lamp, right. Loops: synced head tilts and tails on his talk frames,
// the book's glint and pulse and its cover that lifts a pixel and gives up, the mill, breath on the glass.
(function () {
  const A = window.NRART;
  const TAU = Math.PI * 2, H = A.hash;

  // A scanline slab for light pools: from row y0 to y1 the span runs from (xa0, xb0) to (xa1, xb1).
  function slab(g, y0, y1, xa0, xb0, xa1, xb1, level, c) {
    const n = Math.max(1, y1 - y0);
    for (let y = y0; y < y1; y += 1) {
      const f = (y - y0) / n, xa = xa0 + (xa1 - xa0) * f, xb = xb0 + (xb1 - xb0) * f;
      A.ditherRect(g, xa, y, xb - xa, 1, null, c, level);
    }
  }

  // A light or fog shape whose pixels never change: worked out once, then applied as a short list of
  // (offset, level) entries, so the lamp and the book's glow cost almost nothing per frame.
  const FIELDS = {};
  function cfield(g, key, x, y, bw, bh, fn, mode, color, strength, Q) {
    Q = Q || 4;
    let e = FIELDS[key];
    if (!e) {
      const dx = [], dy = [], q = [];
      for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
        const lv = fn(i, j); if (lv <= 0) continue;
        const v = Math.min(1, lv) * Q; let k = v | 0; if (v - k > A.bayer(i, j)) k++;
        if (k > 0) { dx.push(i); dy.push(j); q.push(Math.min(Q, k)); }
      }
      e = FIELDS[key] = { dx: Int16Array.from(dx), dy: Int16Array.from(dy), q: Uint8Array.from(q) };
    }
    const Ls = [null]; for (let k = 1; k <= Q; k++) Ls.push(A.lut(mode, color, Math.round(strength * 20) / 20 * k / Q));
    const buf = g.buf, w = g.w, h = g.h, ox = Math.round(x) + g.ox, oy = Math.round(y) + g.oy;
    for (let n = 0; n < e.q.length; n++) {
      const X = ox + e.dx[n], Y = oy + e.dy[n]; if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
      const i = Y * w + X; buf[i] = Ls[e.q[n]][buf[i]];
    }
  }
  // a radial glow as a cached field: (cx, cy) the centre, rx ry the reach
  function cglow(g, key, cx, cy, rx, ry, color, strength, power, Q) {
    cfield(g, key, cx - rx, cy - ry, 2 * rx + 1, 2 * ry + 1, (i, j) => {
      const dx = (i - rx) / rx, dy = (j - ry) / ry, d2 = dx * dx + dy * dy; return d2 >= 1 ? 0 : Math.pow(1 - Math.sqrt(d2), power);
    }, 'add', color, strength, Q);
  }

  // a banded sky for the window only: flat colour, a short dithered seam between bands
  function skyBand(g, x, y, w, h, stops) {
    const seg = h / (stops.length - 1), bl = 5;
    for (let k = 0; k < stops.length - 1; k++) {
      const y0 = y + Math.round(k * seg), y1 = y + Math.round((k + 1) * seg);
      A.rect(g, x, y0, w, y1 - y0, stops[k]);
      if (k < stops.length - 2) A.ditherGradient(g, x, y1 - bl, w, bl, stops[k], stops[k + 1]);
    }
  }
  // A cheap contact shadow: dithered rows of night0, no per-pixel falloff maths.
  function fshadow(g, x, y, rx, ry, level) {
    for (let j = -ry; j <= ry; j++) { const w = Math.round(rx * Math.sqrt(1 - (j * j) / ((ry + 0.5) * (ry + 0.5)))); A.ditherRect(g, x - w, y + j, 2 * w, 1, null, 'night0', level); }
  }

  // The dogs are local so that their heads can tilt together: the shared dog cannot do that.
  const COAT = {
    brown: ['fur2', 'fur3', 'fur4', 'fur5', 'fur6'],
    dark: ['slate1', 'slate2', 'slate3', 'slate4', 'slate5'],
  };
  // eyes toward the man: a pale eye with the pupil pushed up and to the right, the brow up on a tilt
  function eye(P, x, y, tilt) {
    P.p(x - 1, y + 1, 'paper3'); P.p(x, y + 1, 'slate0'); P.p(x - 1, y, 'paper4'); P.p(x, y, 'slate0');
    if (tilt) P.p(x - 1, y - 1, 'fur5');   // one brow up
  }
  // Brown dog on the sofa, lying with its chin on his knee. Faces right. (x, y): where it lies.
  function dogKnee(g, x, y, t, tilt, rim) {
    const [k0, k1, k2, k3] = COAT.brown, P = A.pen(g, x, y, false);
    const thump = tilt ? (Math.sin(t * 17) > 0 ? 1 : 0) : (Math.sin(t * 3.2) > 0.82 ? 1 : 0);
    A.begin(g);
    P.r(-10, -6, 17, 6, k1); P.r(-9, -7, 14, 1, k1); P.r(-7, -6, 8, 1, k2); P.r(-10, -1, 17, 1, k0);   // back and belly
    P.r(-10, -5, 2, 4, k0);                                                      // the haunch
    P.r(4, -3, 7, 3, k1); P.r(4, -3, 7, 1, k2);                                    // front paws forward
    // the head, lifted a little to look at him, chin on the knee
    const hy = -11 - (tilt ? 2 : 0), mz = hy + 2 + (tilt ? -1 : 1);
    P.r(3, hy, 7, 6, k1); P.r(4, hy - 1, 5, 1, k1); P.r(4, hy, 5, 1, k2); P.r(3, hy + 5, 6, 1, k0);
    P.r(9, mz, 4, 3, k1); P.r(9, mz, 4, 1, k2); P.p(12, mz, 'slate0');
    eye(P, 8, hy + 1, tilt);
    if (tilt) { P.r(4, hy - 4, 3, 5, k1); P.r(5, hy - 5, 1, 1, k1); P.p(5, hy - 3, k3); P.p(5, hy - 2, k3); P.p(2, hy + 4, k1); }   // ear up, head cocked
    else { P.r(3, hy, 2, 6, k0); P.p(3, hy + 6, k0); P.p(4, hy, k1); }               // ear down
    P.l(-10, -3, -13, -4 - thump * 3, k1, 2); P.p(-13, -5 - thump * 3, k2);
    A.end(g, rim);
  }
  // Dark dog on the rug, sitting up at his feet, face to his face. Faces right.
  function dogUp(g, x, y, t, tilt, rim) {
    const [k0, k1, k2, k3] = COAT.dark, P = A.pen(g, x, y, false);
    const thump = tilt ? (Math.sin(t * 17 + 1) > 0 ? 1 : 0) : 0;
    fshadow(g, x, y, 10, 2, 0.6);
    A.begin(g);
    P.r(-6, -7, 8, 7, k2); P.r(-5, -8, 6, 1, k2); P.r(-6, -7, 2, 7, k1); P.r(-7, -2, 3, 2, k1);   // haunch
    P.r(-1, -13, 6, 8, k2); P.r(0, -14, 4, 1, k2); P.r(3, -12, 2, 6, k3);                       // chest
    P.r(2, -6, 2, 6, k2); P.r(4, -6, 1, 6, k1); P.r(1, -1, 4, 1, k3); P.r(-3, -1, 3, 1, k3);     // legs and paws
    P.r(1, -12, 3, 3, 'paper2');                                                                // a white bib
    const hx = 1 + (tilt ? 1 : 0), hy = -20 - (tilt ? 1 : 0);
    P.r(hx, hy, 6, 5, k2); P.r(hx + 1, hy - 1, 4, 1, k2); P.r(hx + 1, hy, 4, 1, k3);
    // the muzzle points up toward his face, higher still on a tilt
    const my = tilt ? hy - 2 : hy;
    P.r(hx + 5, my + 1, 3, 3, k2); P.r(hx + 5, my + 1, 3, 1, k3); P.p(hx + 8, my + 1, 'slate0'); P.r(hx + 5, my + 3, 3, 1, k1);
    eye(P, hx + 4, hy + 1, tilt);
    if (tilt) { P.r(hx + 1, hy - 5, 3, 6, k1); P.p(hx + 2, hy - 6, k1); P.p(hx + 2, hy - 4, k3); P.p(hx + 2, hy - 3, k3); P.p(hx, hy + 5, k1); }
    else { P.r(hx + 1, hy + 1, 2, 4, k1); P.p(hx + 1, hy + 5, k1); P.p(hx + 2, hy + 1, k0); }
    P.l(-6, -1, -10, -1 - thump, k1, 2);
    A.end(g, rim);
  }

  A.panels[8] = {
    text: 'Now the only ones who still understand him are two dogs and a grammar book he never opened.',
    nl: 'Nu begrijpen alleen twee honden hem nog, en een grammaticaboek dat hij nooit heeft opengeslagen.',
    draw(g, t) {
      A.camera(g, t, { x: -5, period: 8 }); A.key(g, 300, 50, 1);
      const talk = (t % 4) < 1.4, tilt = talk && (t * 4 % 1) < 0.8 ? 1 : 0;
      const pulse = 0.5 + 0.5 * Math.sin(t * TAU / 4);

      // ============ 1. the cold back plane, seen through the window ============
      const WX = 14, WY = 16, WW = 98, WB = 106;      // the pane: left, top, width, bottom
      A.depth(g, 0.3);
      skyBand(g, WX - 4, 12, WW + 8, 82, ['night4', 'night5', 'mist0', 'mist1', 'mist2', 'mist3']);
      A.church(g, 100, 88, 0.55, { tone: 'mist1' });
      A.canalHouse(g, 66, 90, 15, 26, { gable: 'bell', brick: 'mist0', lit: 0, t, seed: 31, trim: 'mist1' });
      A.canalHouse(g, 80, 90, 13, 32, { gable: 'step', brick: 'mist0', lit: 0, t, seed: 32, trim: 'mist1' });
      A.canalHouse(g, 94, 90, 18, 22, { gable: 'neck', brick: 'mist0', lit: 0, t, seed: 33, trim: 'mist1' });
      // the mill, fully in the left pane, turning anticlockwise: a quarter turn every 8 s
      A.windmill(g, 42, 92, 0.74, -t * Math.PI / 16, { tone: 'night2', sail: 'night2', lit: 0, t, stage: true });
      cfield(g, 'hz1', WX - 4, 50, WW + 8, 44, (i, j) => 0.12 + 0.28 * j / 44, 'mix', 'mist2', 1, 8);
      // the wet street, a lamp, its reflection
      A.rect(g, WX - 4, 92, WW + 8, 18, 'night2'); A.ditherRect(g, WX - 4, 92, WW + 8, 6, 'night2', 'mist1', 0.3);
      {   // the street lamp, drawn flat: pole, lantern, a cached glow and cone
        const fl = H(Math.floor(t * 9), 4) < 0.25 ? 0.6 : 1;
        A.rect(g, 24, 66, 2, 28, 'slate1'); A.rect(g, 22, 90, 6, 4, 'slate1'); A.rect(g, 22, 58, 6, 7, fl < 1 ? 'amber4' : 'amber7'); A.rect(g, 22, 58, 6, 1, 'slate1'); A.rect(g, 21, 57, 8, 1, 'slate1'); A.rect(g, 24, 59, 2, 5, fl < 1 ? 'amber5' : 'amber8');
        cglow(g, 'sl1', 25, 61, 14, 14, 'amber6', 0.5 * fl, 1.6);
        cfield(g, 'sl2', 25 - 16, 64, 33, 28, (i, j) => { const half = 3 + j * 0.45, v = Math.abs(i - 16); return v > half ? 0 : (1 - j / 28) * (v / half < 0.5 ? 1 : (1 - v / half) / 0.5); }, 'add', 'amber5', 0.3 * fl);
      }
      A.water(g, WX - 4, 94, WW + 8, 14, { t, amp: 1, stretch: 2, dark: 0.55, color: 'night2', gaps: 0.25, glints: 4 });
      A.streak(g, 24, 96, 12, { t, seed: 4, strength: 0.6, color: 'amber5' });
      cfield(g, 'hz2', WX - 4, 88, WW + 8, 22, (i, j) => 0.1 + 0.3 * j / 22, 'mix', 'mist2', 1, 8);
      // the watcher: one hunched woman right at the glass, eyes on the man
      A.depth(g, 0.55);
      A.zombie(g, 80, 108, { t, seed: 9, variant: 'hat', height: 70, hunch: 0.5, tone: 'night1', glow: 0.45, clogs: true, socks: false });
      A.mist(g, t, 88, 22, { amount: 0.32, speed: 5, seed: 6, color: 'mist3' });
      A.depth(g, 1);
      // a handprint smeared on the glass where he passed, the fingers dragging down
      const HPX = 104, HPY = 82;
      A.ditherRect(g, HPX, HPY, 6, 5, null, 'mist6', 0.5);
      [[0, 3], [2, 4], [4, 4], [5, 2]].forEach(([fx, fl]) => A.vline(g, HPX + fx, HPY - fl, fl, 'mist5'));
      A.px(g, HPX - 1, HPY + 3, 'mist5'); A.px(g, HPX - 2, HPY + 2, 'mist4');
      A.vline(g, HPX + 2, HPY + 5, 4 + Math.round(pulse * 2), 'mist4'); A.vline(g, HPX + 4, HPY + 5, 2, 'mist4');

      // ============ 2. the wall: flat night3, a sparse stripe, wainscot ============
      const wall = (x, y, w, h) => { A.rect(g, x, y, w, h, 'night3'); for (let xx = x - ((x % 24) + 24) % 24; xx < x + w; xx += 24) if (xx >= x) A.vline(g, xx, y, h, 'night2'); };
      wall(-20, 0, 34, 132); wall(112, 0, 240, 132); wall(WX, 0, WW, WY); wall(WX, WB + 2, WW, 26);
      A.ditherGradient(g, 0, 0, 320, 16, null, 'night1', 'up');                       // the ceiling goes dark
      A.rect(g, -20, 108, 360, 24, 'wood1');
      for (let xx = -16; xx < 330; xx += 24) { A.rect(g, xx, 111, 20, 17, 'wood2'); A.hline(g, xx, 111, 20, 'wood3'); A.hline(g, xx, 127, 20, 'wood0'); A.vline(g, xx + 19, 111, 17, 'wood0'); }
      A.hline(g, -20, 108, 360, 'wood3'); A.hline(g, -20, 107, 360, 'wood2'); A.rect(g, -20, 129, 360, 3, 'wood0'); A.hline(g, -20, 129, 360, 'wood2');
      // the window: frame, mullion, a high transom, a low sill
      const fr = 'wood3';
      A.rect(g, WX - 2, WY - 2, WW + 4, 2, fr); A.rect(g, WX - 2, WB, WW + 4, 3, fr); A.hline(g, WX - 3, WB + 3, WW + 6, 'wood5');
      A.rect(g, WX - 2, WY - 2, 2, WB - WY + 4, fr); A.rect(g, WX + WW, WY - 2, 2, WB - WY + 4, fr);
      A.rect(g, 62, WY, 3, WB - WY, fr); A.rect(g, WX, 40, WW, 2, fr);
      A.vline(g, WX, WY, WB - WY, 'wood4'); A.vline(g, 62, WY, WB - WY, 'wood4'); A.hline(g, WX, WY - 1, WW, 'wood4');
      // curtains: slate, one low step, pushed to the sides
      const curtain = (x0, w) => { A.rect(g, x0, 10, w, 98, 'slate1'); for (let k = 0; k < w; k += 3) { A.vline(g, x0 + k, 12, 96, 'slate0'); A.vline(g, x0 + k + 1, 12, 96, 'slate2'); } };
      curtain(4, 8); curtain(114, 9);
      A.rect(g, 1, 8, 125, 2, 'wood3'); A.rect(g, 0, 7, 3, 4, 'wood4'); A.rect(g, 125, 7, 3, 4, 'wood4'); A.hline(g, 1, 8, 125, 'wood4');
      // the radiator under the window, quiet slate
      A.rect(g, 26, 112, 72, 14, 'steel1');
      for (let xx = 27; xx < 96; xx += 5) { A.rect(g, xx, 113, 3, 12, 'steel2'); A.vline(g, xx, 113, 12, 'steel3'); A.vline(g, xx + 2, 113, 12, 'steel0'); }
      A.hline(g, 26, 112, 72, 'steel3'); A.hline(g, 26, 126, 72, 'steel0');
      // a Delft tile with a windmill: the Netherlands has no mountains
      A.rect(g, 170, 26, 28, 28, 'wood3'); A.rect(g, 172, 28, 24, 24, 'paper1'); A.hline(g, 170, 26, 28, 'wood5');
      A.rect(g, 173, 29, 22, 22, 'paper2');
      A.windmill(g, 184, 50, 0.28, -t * Math.PI / 16 + 0.5, { tone: 'blue2', sail: 'blue2', stage: false, lit: 0, rim: 0 });
      for (const [cx, cy] of [[174, 30], [193, 30], [174, 49], [193, 49]]) { A.px(g, cx, cy, 'blue3'); A.px(g, cx + 1, cy, 'blue3'); A.px(g, cx, cy + 1, 'blue3'); }

      // ============ 3. the floor, the rug, the cold light from the glass ============
      A.rect(g, 0, 132, 320, 50, 'wood1');
      for (let r = 0; r < 11; r++) {
        const y0 = 132 + Math.round(r * r * 0.22 + r * 2.6), h = Math.round(2.6 + r * 0.5);
        A.rect(g, -20, y0, 360, Math.max(2, h), (r & 1) ? 'wood1' : 'wood0'); A.hline(g, -20, y0, 360, 'wood0');
        for (let xx = -20 + Math.floor(H(r, 3) * 40); xx < 330; xx += 46 + Math.floor(H(r, 5) * 30)) A.vline(g, xx, y0, Math.max(2, h), 'wood0');
      }
      A.ditherGradient(g, 0, 150, 320, 30, null, 'night0', 'down');
      // the rug: night slate, low
      A.ellipse(g, 196, 158, 92, 14, 'night2'); A.ellipse(g, 196, 158, 86, 11, 'night3'); A.ellipse(g, 196, 158, 66, 7, 'night2');
      A.ditherRect(g, 140, 153, 112, 10, null, 'night4', 0.1);
      // the window's cold patch on the floor: two soft slabs of moonlight with the mullion between them, the watcher cast into the room
      const patch = (key, xa0, xb0, xa1, xb1) => cfield(g, key, -20, 134, 160, 46, (i, j) => {
        const f = j / 46, xa = xa0 + (xa1 - xa0) * f + 20, xb = xb0 + (xb1 - xb0) * f + 20;
        if (i < xa || i > xb) return 0;
        return (1 - f * 0.55) * Math.min(1, Math.min(i - xa, xb - i) / 3.5);
      }, 'add', 'mist5', 0.3, 5);
      patch('fl1', 18, 60, -14, 28); patch('fl2', 67, 113, 35, 81);
      A.poly(g, [74, 134, 86, 134, 74, 148, 56, 166, 44, 180, 24, 180, 34, 164, 56, 148], 'wood0');   // her long shadow, stretched
      A.disc(g, 36, 174, 3, 'wood0');                                                                  // the head

      // ============ 4. the lamp, dimmed: warm, but not the star ============
      A.depth(g, 1);
      A.rect(g, 300, 54, 2, 80, 'slate1'); A.vline(g, 301, 54, 80, 'slate3'); A.rect(g, 293, 132, 16, 2, 'slate2'); A.rect(g, 295, 130, 12, 2, 'slate1');
      A.poly(g, [290, 54, 312, 54, 307, 38, 295, 38], 'amber2'); A.hline(g, 290, 54, 23, 'amber3'); A.hline(g, 295, 38, 13, 'amber1'); A.vline(g, 297, 40, 14, 'amber3'); A.vline(g, 305, 40, 14, 'amber1'); A.rect(g, 298, 54, 6, 2, 'amber5');

      // ============ 5. the sofa, the man, the two dogs that understand him ============
      const SX = 146, SW = 140;
      A.rect(g, SX, 84, SW, 46, 'teal1'); A.rect(g, SX, 84, SW, 3, 'teal3'); A.hline(g, SX, 84, SW, 'teal4');
      for (let xx = SX + 12; xx < SX + SW - 8; xx += 24) { A.vline(g, xx, 90, 30, 'teal0'); for (let yy = 96; yy < 118; yy += 10) A.px(g, xx + 12, yy, 'teal2'); }
            A.rect(g, SX - 8, 102, 12, 38, 'teal3'); A.rect(g, SX - 8, 102, 12, 2, 'teal4'); A.vline(g, SX - 8, 104, 36, 'teal2');
      A.rect(g, SX + SW - 4, 102, 12, 38, 'teal3'); A.rect(g, SX + SW - 4, 102, 12, 2, 'teal4');
      A.rect(g, SX + 4, 122, SW - 8, 4, 'teal3');                                           // the cushion top, seen low
      A.rect(g, SX + 4, 126, SW - 8, 11, 'teal2'); A.hline(g, SX + 4, 126, SW - 8, 'teal3'); A.vline(g, SX + 72, 127, 10, 'teal1'); A.hline(g, SX + 4, 136, SW - 8, 'teal1');
      A.rect(g, SX - 6, 138, 4, 4, 'wood1'); A.rect(g, SX + SW + 2, 138, 4, 4, 'wood1');
            fshadow(g, SX + SW / 2, 141, 78, 2, 0.7);
      // the cushion that is not orange: a quiet slate square
      A.rect(g, SX + 100, 104, 17, 18, 'slate2'); A.hline(g, SX + 100, 104, 17, 'slate4'); A.vline(g, SX + 116, 105, 17, 'slate1');
      // brown dog on the sofa, chin on his knee
      const MX = 240, MY = 124;
      dogKnee(g, MX - 22, MY, t, tilt, 1);
      // the man: side view, seated, facing the dogs; the near arm gestures, the other rests on his knee
      A.man(g, MX, MY, { t, facing: 'left', pose: 'sit', floor: 16, face: talk ? 'talk' : 'deadpan', seed: 3, shadow: false });
      A.begin(g);
      {
        const P = A.pen(g, MX, MY, true), lift = talk ? Math.round(Math.sin(t * 7) * 1.2) : 0;
        P.l(1, -11, 6, -9, 'orange4', 2); P.l(6, -9, 9, -19 - lift, 'orange4', 2); P.r(8, -22 - lift, 3, 3, 'skin4'); P.p(9, -24 - lift, 'skin4'); P.p(9, -25 - lift, 'skin3');
      }
      A.end(g, 1);
      // the dark dog at his feet, same moment, same tilt
      dogUp(g, 219, 149, t, tilt, 2);

      // a chewed clog, the dogs' toy: one small yellow note, dimmed
      A.rect(g, 234, 156, 9, 3, 'cheese2'); A.rect(g, 235, 155, 5, 1, 'cheese3'); A.rect(g, 234, 158, 9, 1, 'cheese1'); A.px(g, 242, 157, 'wood1'); A.px(g, 240, 155, 'wood0'); A.px(g, 236, 158, 'wood0');
      // ============ 6. light: the dimmed lamp, then the book ============
      cglow(g, 'lamp', 301, 58, 56, 50, 'amber4', 0.14, 1.4);
      cglow(g, 'pool', 238, 116, 74, 40, 'amber5', 0.2, 1.2);                     // the lamp's warmth on the three of them
      cfield(g, 'cone', 301 - 40, 56, 81, 72, (i, j) => { const u = j / 71, half = 9 + j * 0.45, v = Math.abs(i - 40); return v > half ? 0 : Math.pow(1 - u, 1) * (v / half < 0.5 ? 1 : (1 - v / half) / 0.5); }, 'add', 'amber4', 0.1);
      for (let i = 0; i < 10; i++) { const ph = (t * 0.1 + H(i, 1)) % 1, dx = 301 + (H(i, 2) - 0.5) * 40 + Math.sin(t * 0.8 + i) * 3, dy = 56 + ph * 70; A.px(g, dx, dy, ph < 0.8 ? 'amber5' : 'amber3'); }

      // ============ 7. the table and the book, foreground, big and hot ============
      A.depth(g, 1.35);
      fshadow(g, 146, 177, 62, 3, 0.7);
      A.rect(g, 80, 146, 130, 12, 'wood2'); A.rect(g, 80, 146, 130, 1, 'wood4');         // the tabletop seen low and from a little above
      A.rect(g, 80, 158, 130, 5, 'wood1'); A.hline(g, 80, 158, 130, 'wood3'); A.hline(g, 80, 162, 130, 'wood0');
      A.rect(g, 86, 163, 6, 16, 'wood1'); A.rect(g, 198, 163, 6, 16, 'wood1'); A.vline(g, 86, 163, 16, 'wood2'); A.vline(g, 198, 163, 16, 'wood2');
      A.ditherRect(g, 80, 146, 130, 12, null, 'wood3', 0.08);
      // a lacquer smear on the top edge, the lamp in the wood
      A.hline(g, 170, 148, 22, 'wood5'); A.hline(g, 176, 149, 12, 'wood6');
      // the grammar book, 3/4: cover top, page block, gold band, shrink-wrap glint, dust, price sticker
      const bx = 110, by = 146;                       // by: the front edge of the cover
      const lifted = (t % 6) < 0.55 ? ((t % 6) < 0.25 ? 2 : 1) : 0;   // the cover lifts, then gives up
      cglow(g, 'bk1', bx + 22, by - 2, 42, 16, 'amber5', 0.18 + 0.14 * pulse, 1.3, 5);
      A.rect(g, bx, by + 1, 42, 4, 'paper4'); A.hline(g, bx, by + 2, 42, 'paper3'); A.hline(g, bx, by + 4, 42, 'paper2');          // page block
      for (let i = 4; i < 40; i += 3) A.px(g, bx + i, by + 3, 'paper3');
      A.poly(g, [bx + 5, by - 9 - lifted, bx + 43, by - 9, bx + 42, by + 1, bx, by + 1], 'blue3');                                    // cover, 3/4
      A.poly(g, [bx + 5, by - 9 - lifted, bx + 43, by - 9, bx + 43, by - 8, bx + 5, by - 8 - lifted], 'blue5');
      A.hline(g, bx, by + 1, 42, 'blue2'); A.vline(g, bx, by - 1, 3, 'blue2');
      if (lifted) { A.rect(g, bx + 4, by + 1 - lifted, 36, lifted, 'night0'); }
      A.rect(g, bx + 9, by - 6, 26, 3, 'amber6'); A.hline(g, bx + 9, by - 6, 26, 'amber8'); A.hline(g, bx + 9, by - 4, 26, 'amber4');     // the gold title band
      A.text(bx + 22, by - 3.7, 'GRAMMATICA', 'amber1', 2.6, true, { align: 'center' });                                         // unread
      A.rect(g, bx + 34, by - 3, 5, 4, 'cheese5'); A.px(g, bx + 35, by - 2, 'red4'); A.px(g, bx + 37, by - 2, 'red4'); A.hline(g, bx + 34, by - 3, 5, 'cheese6');   // price sticker, still on
      A.ellipse(g, bx + 14, by - 3, 7, 2, 'blue4');                                                                               // the cup's ring stain, years of it
      A.ditherRect(g, bx + 4, by - 9, 38, 10, null, 'mist5', 0.2);                                                                // dust
      // the shrink-wrap glint sweeps across once every four seconds
      const gk = (t % 4) / 4; if (gk < 0.45) { const gx = bx + 6 + gk / 0.45 * 36; A.line(g, gx + 2, by - 9, gx - 3, by, 'paper6'); A.line(g, gx + 3, by - 9, gx - 2, by, 'paper5'); }
      // the cup stands on the book as a coaster
      A.rect(g, bx + 24, by - 17, 9, 9, 'paper5'); A.rect(g, bx + 24, by - 17, 9, 1, 'paper6'); A.vline(g, bx + 24, by - 16, 8, 'paper4'); A.rect(g, bx + 25, by - 16, 7, 1, 'wood3');
      A.rect(g, bx + 33, by - 15, 3, 5, 'paper4'); A.rect(g, bx + 34, by - 14, 1, 3, 'night3');
      A.hline(g, bx + 24, by - 9, 9, 'paper3');
      fshadow(g, bx + 28, by - 8, 8, 1, 0.5);
      for (let i = 0; i < 4; i++) { const ph = (t / 3 + i / 4) % 1; A.px(g, bx + 28 + Math.sin(ph * TAU * 1.5 + i) * 2, by - 19 - ph * 16, ph < 0.55 ? 'mist6' : 'mist4'); }
      cglow(g, 'bk2', bx + 20, by - 4, 24, 10, 'amber7', 0.2 + 0.22 * pulse, 1.2, 5);
      A.streak(g, bx + 18, by + 6, 8, { t, seed: 8, strength: 0.3 + 0.2 * pulse, color: 'amber6' });
      // dust rising from the book, lit by its own faint glow
      for (let i = 0; i < 9; i++) { const ph = (t * 0.2 + H(i, 7)) % 1; A.px(g, bx + 6 + H(i, 8) * 34 + Math.sin(t + i) * 2, by - 10 - ph * 30, ph < 0.6 ? 'amber6' : 'amber4'); }

      // ============ 8. the edges: a cheap vignette ============
      A.depth(g, 1);
      A.ditherGradient(g, 0, 0, 10, 180, null, 'night0', 'left'); A.ditherGradient(g, 310, 0, 10, 180, null, 'night0', 'right');
          },
  };
})();
