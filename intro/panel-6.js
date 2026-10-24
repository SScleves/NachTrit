// Panel 6: "Or the Tikkie of one cent that is still open. Probably all of it."
// Three in the morning. On the nightstand a phone glows Tikkie cyan: Sanne asks one cent for the bitterballen, open
// since 2019. Around it the rest of the evidence, because it was probably all of it: the cheese gone blue, the paper
// with the poll, the tourist's beer stein the phone leans on. He sleeps. A grey hand comes out of the dark to pay,
// hovers over the button, the reminder pings, and the hand goes back.
// Key light: the phone. Outside the window the mist slides past a far skyline, a mill turns the right way round and one
// of the dead stands in the fog with its eyes on the glow.
// Loop 6 s: reminder pings at 0 and 3 (the phone shivers, a ring goes out, the clock colon blinks every second),
// the hand reaches (0.6 to 2.4), hovers and trembles, flinches at the ping (3.0), withdraws (3.4 to 5.2); flies circle the cheese.
(function () {
  const A = window.NRART, PER = 6;
  const sm = k => k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k);
  const lerp = (a, b, k) => a + (b - a) * k;
  const WX = 16, WY = 14, WW = 92, WH = 78;             // the window
  const TOP = 128, FRONT = 140;                          // nightstand: top surface, front face
  const PX = 176, PY = 50, PW = 52, PH = 90;             // the phone, propped up
  const SX = PX + 3, SY = PY + 6, SW = PW - 6, SH = PH - 12;   // its screen
  function reach(T) { if (T < 0.6) return 0; if (T < 2.4) return sm((T - 0.6) / 1.8); if (T < 3.4) return 1; if (T < 5.2) return 1 - sm((T - 3.4) / 1.8); return 0; }
  function ping(T) { const a = T % 3; return a < 0.45 ? 1 - a / 0.45 : 0; }

  function outside(g, T) {
    A.sky(g, ['night1', 'night2', 'night3', 'mist0', 'mist1'], WY - 4, WY + WH);
    A.glow(g, 36, 30, 34, { color: 'mist3', strength: 0.28, power: 1.6 });
    A.moon(g, 36, 30, 5, { halo: 0.3 });
    // far roofs, a spire and the mill on the dyke: one flat cold tone, a lit window or two
    const base = WY + WH;
    for (let x = WX - 4, i = 0; x < WX + WW + 4; i++) { const w = 9 + (A.hash(i, 3) * 8 | 0), h = 8 + (A.hash(i, 4) * 9 | 0); A.rect(g, x, base - 14 - h, w, h + 14, 'night3'); A.poly(g, [x, base - 14 - h, x + w / 2, base - 20 - h, x + w, base - 14 - h], 'night3'); if (A.hash(i, 5) < 0.3) A.rect(g, x + 3, base - 10 - h, 2, 2, 'amber4'); x += w + 1; }
    A.rect(g, 50, base - 46, 5, 30, 'night3'); A.poly(g, [49, base - 46, 52, base - 60, 56, base - 46], 'night3');
    A.windmill(g, 92, base - 14, 0.38, -T / PER * Math.PI * 0.5, { tone: 'night3', stage: false, lit: 0, t: T });
    A.haze(g, WX - 4, WY + 30, WW + 8, WH - 30, { top: 0.1, bottom: 0.55, color: 'mist2' });
    // one of the dead in the fog by the canal, watching the glow; its eyes close now and then
    A.zombie(g, 74, base + 1, { tone: 'night2', height: 22, t: T, seed: 9, facing: 'right', eyes: !(T > 4.1 && T < 4.35), glow: 0.4 });
    A.mist(g, T, base - 22, 16, { amount: 0.55, speed: 5, color: 'mist3', seed: 4 });
    A.mist(g, T * 0.7, base - 8, 12, { amount: 0.5, speed: 3, color: 'mist2', seed: 9 });
  }

  function room(g) {
    // the wall: dark, a faint wallpaper stripe that only shows where the light reaches
    A.rect(g, -20, -20, 360, WY + 20, 'night1'); A.rect(g, -20, WY - 4, WX + 20, WH + 8, 'night1'); A.rect(g, WX + WW, WY - 4, 240, WH + 8, 'night1'); A.rect(g, -20, WY + WH, 360, 120, 'night1');
    for (let x = 0; x < 320; x += 7) if (x < WX - 3 || x > WX + WW + 2) A.ditherRect(g, x, -2, 2, 184, null, 'night2', 0.35); else { A.ditherRect(g, x, -2, 2, WY - 2, null, 'night2', 0.35); A.ditherRect(g, x, WY + WH + 3, 2, 90, null, 'night2', 0.35); }
    A.ditherGradient(g, 0, 0, 320, WY - 4, 'night0', null, 'down'); A.ditherGradient(g, 0, WY - 4, WX - 4, 30, 'night0', null, 'down'); A.ditherGradient(g, WX + WW + 4, WY - 4, 320, 30, 'night0', null, 'down');   // darker toward the ceiling, never over the glass
    // moonlight on the wall round the window
    A.glow(g, WX + WW / 2, WY + WH / 2, 74, { color: 'mist2', strength: 0.22, power: 1.4, ry: 62 });
    // window frame and bars
    A.rect(g, WX - 4, WY - 4, WW + 8, 4, 'wood2'); A.rect(g, WX - 4, WY + WH, WW + 8, 5, 'wood2'); A.rect(g, WX - 4, WY, 4, WH, 'wood2'); A.rect(g, WX + WW, WY, 4, WH, 'wood2');
    A.hline(g, WX - 4, WY + WH, WW + 8, 'wood4'); A.hline(g, WX - 6, WY + WH + 4, WW + 12, 'wood1');
    A.rect(g, WX + WW / 2 - 1, WY, 3, WH, 'wood1'); A.rect(g, WX, WY + 26, WW, 3, 'wood1'); A.hline(g, WX, WY + 26, WW, 'wood3');
    // a curtain, half drawn, and its rod
    A.rect(g, WX - 8, WY - 9, WW + 30, 2, 'slate2'); A.hline(g, WX - 8, WY - 9, WW + 30, 'slate4');
    A.poly(g, [WX + WW - 14, WY - 7, WX + WW + 18, WY - 7, WX + WW + 20, WY + WH + 14, WX + WW + 2, WY + WH + 14, WX + WW - 4, WY + 40], 'red1');
    for (let i = 0; i < 6; i++) A.line(g, WX + WW - 10 + i * 5, WY - 7, WX + WW + 3 + i * 3, WY + WH + 13, i % 2 ? 'red0' : 'red2');
    // the bed: a dark duvet the phone light only just reaches, a sleeper's dark hair on the pillow
    A.poly(g, [-10, 116, 104, 112, 118, 180, -10, 180], 'night2'); A.ditherGradient(g, -10, 112, 128, 68, 'night3', 'night1', 'down');
    A.ellipse(g, 26, 118, 22, 6, 'mist0'); A.ellipse(g, 26, 117, 20, 4, 'mist1');
    A.ellipse(g, 34, 117, 8, 5, 'slate0'); A.ellipse(g, 32, 115, 5, 2, 'slate2');
    A.poly(g, [8, 126, 60, 120, 98, 132, 108, 150, 40, 158, 4, 146], 'night3'); A.line(g, 10, 140, 92, 134, 'night2', 2); A.line(g, 30, 128, 70, 124, 'night4');   // his shoulder and back under the duvet
    // the nightstand
    A.rect(g, 116, TOP, 204, FRONT - TOP, 'wood3'); A.hline(g, 116, TOP, 204, 'wood5'); A.hline(g, 116, FRONT - 1, 204, 'wood4');
    A.rect(g, 118, FRONT, 202, 44, 'wood1'); A.vline(g, 118, FRONT, 44, 'wood2');
    A.rect(g, 140, FRONT + 8, 150, 18, 'wood2'); A.hline(g, 140, FRONT + 8, 150, 'wood0'); A.hline(g, 140, FRONT + 25, 150, 'wood3'); A.rect(g, 212, FRONT + 15, 8, 3, 'steel3');
    for (let x = 120; x < 320; x += 9) A.px(g, x + (x % 3), TOP + 4 + (x % 5), 'wood2');
    // the paper, propped against the wall: the poll, Flemish winning
    A.poly(g, [124, 82, 160, 80, 163, TOP, 127, TOP], 'paper4'); A.poly(g, [124, 82, 160, 80, 161, 86, 125, 88], 'paper5');
    for (let y = 104; y < 126; y += 3) A.hline(g, 130, y, 26, 'paper2');
    A.rect(g, 132, 92, 9, 10, 'night1'); A.rect(g, 134, 94, 2, 8, 'cheese5'); A.rect(g, 136, 94, 2, 8, 'red4');   // Belgium, high
    A.rect(g, 146, 99, 6, 3, 'orange4');                                                                       // the Netherlands, low
    // the cheese on a plate: a wedge gone blue-green, white fuzz
    A.ellipse(g, 166, TOP + 2, 16, 3, 'paper3'); A.ellipse(g, 166, TOP + 1, 13, 2, 'paper4');
    A.poly(g, [154, TOP, 176, TOP, 176, TOP - 11], 'cheese4'); A.poly(g, [168, TOP - 7, 176, TOP - 11, 176, TOP], 'cheese3'); A.hline(g, 154, TOP, 22, 'cheese2');
    for (const [x, y, r] of [[163, TOP - 3, 2], [170, TOP - 6, 2], [173, TOP - 2, 1]]) { A.disc(g, x, y, r, 'teal3'); A.px(g, x, y - r, 'paper6'); A.px(g, x - 1, y, 'green4'); }
    // the beer stein the phone leans on: glass, amber beer, foam, a pewter lid
    A.rect(g, 226, 100, 24, TOP - 100, 'steel2'); A.rect(g, 228, 108, 20, TOP - 110, 'amber3'); A.ditherGradient(g, 228, 108, 20, TOP - 110, 'amber4', 'amber2', 'down');
    A.rect(g, 228, 102, 20, 6, 'paper5'); A.hline(g, 228, 102, 20, 'paper6');
    A.ellipse(g, 238, 99, 13, 3, 'steel4'); A.ellipse(g, 238, 98, 11, 2, 'steel5'); A.rect(g, 248, 95, 4, 3, 'steel3');
    A.ring(g, 253, 113, 7, 'steel3', 2); A.vline(g, 229, 104, 22, 'paper3'); A.vline(g, 246, 106, 20, 'steel4');
    for (let y = 110; y < TOP - 4; y += 6) A.px(g, 236 + (y % 5), y, 'amber6');                                   // bubbles
    // the alarm clock
    A.rect(g, 262, TOP - 14, 40, 14, 'slate1'); A.rect(g, 264, TOP - 12, 36, 10, 'slate0'); A.hline(g, 262, TOP - 14, 40, 'slate3');
  }

  function phone(g, T, dx) {
    const x = PX + dx, sx = SX + dx;
    A.rect(g, x, PY, PW, PH, 'slate0'); A.rect(g, x + 1, PY - 1, PW - 2, PH + 2, 'slate0');
    A.vline(g, x, PY + 2, PH - 4, 'slate3'); A.hline(g, x + 2, PY - 1, PW - 4, 'slate3');
    A.rect(g, sx, SY, SW, SH, 'phone1'); A.ditherGradient(g, sx, SY + 12, SW, SH - 12, 'phone2', 'phone1', 'down');
    A.rect(g, sx, SY, SW, 4, 'phone0'); A.rect(g, sx + SW - 7, SY + 1, 5, 2, 'phone4');                    // status bar, battery
    A.rect(g, sx, SY + 4, SW, 11, 'phone3'); A.hline(g, sx, SY + 14, SW, 'phone4');                       // header
    A.disc(g, sx + SW / 2, SY + 25, 7, 'phone4'); A.disc(g, sx + SW / 2, SY + 25, 6, 'phone5');           // avatar
    A.rect(g, sx + 5, SY + SH - 12, SW - 10, 8, 'phone4'); A.hline(g, sx + 5, SY + SH - 12, SW - 10, 'phone5');   // the button
    const c = sx + SW / 2;
    A.text(sx + 2, SY + 3.2, '03:00', 'phone4', 3, false);
    A.text(c, SY + 12.5, 'Tikkie', 'paper6', 7, true, { align: 'center' });
    A.text(c, SY + 28, 'S', 'phone1', 8, true, { align: 'center' });
    A.text(c, SY + 40, 'Sanne vraagt', 'phone5', 4.5, false, { align: 'center' });
    A.text(c, SY + 51, '€ 0,01', 'paper6', 10, true, { align: 'center' });
    A.text(c, SY + 57.5, 'voor de bitterballen', 'phone4', 3.6, false, { align: 'center' });
    A.text(c, SY + 63, 'open sinds 2019', 'red6', 3.6, true, { align: 'center' });
    A.text(c, SY + SH - 6, 'Betalen', 'phone0', 5, true, { align: 'center' });
  }

  function hand(g, T) {
    const r = reach(T); if (r <= 0.01) return;
    const hover = T >= 2.4 && T < 3.4, flinch = T >= 3.0 && T < 3.25 ? 3 : 0, tr = hover ? Math.round(Math.sin(T * 40) * 0.6) : 0;
    const tx = Math.round(lerp(330, 206, r)) + tr + flinch, ty = Math.round(lerp(204, SY + SH - 3, r)) + flinch;   // the fingertip, a breath below the button
    const wx = tx + 20, wy = ty + 16, ax = 372, ay = 236, dl = Math.hypot(wx - ax, wy - ay), nx = -(wy - ay) / dl, ny = (wx - ax) / dl;
    A.begin(g);
    A.poly(g, [ax + nx * 9, ay + ny * 9, wx + nx * 5, wy + ny * 5, wx - nx * 5, wy - ny * 5, ax - nx * 9, ay - ny * 9], 'zombie3');   // the arm, out of the dark
    A.poly(g, [ax - nx * 9, ay - ny * 9, wx - nx * 5, wy - ny * 5, wx - nx * 2, wy - ny * 2, ax - nx * 3, ay - ny * 3], 'zombie2');
    A.poly(g, [wx - 6, wy - 4, wx + 2, wy - 7, wx + 6, wy + 1, wx - 1, wy + 6, wx - 8, wy + 3], 'zombie4');                 // the back of the hand
    for (const [fx, fy] of [[-7, 4], [-4, 6], [-1, 7]]) A.ellipse(g, wx + fx, wy + fy, 2, 2, 'zombie3');                      // three curled fingers
    A.line(g, wx - 6, wy - 3, tx, ty, 'zombie5', 2); A.line(g, wx - 5, wy - 1, tx + 1, ty + 1, 'zombie4');                   // the finger that will not press
    A.px(g, tx, ty, 'zombie1'); A.px(g, tx - 1, ty, 'zombie6');
    A.end(g, 2, 'phone4');
  }

  // the phone's light: cold cyan over everything it can reach, a pool on the nightstand, a glint on the stein
  function lights(g) {
    A.glow(g, PX + PW / 2, PY + 40, 124, { color: 'phone3', strength: 0.36, power: 1.7, ry: 96 });
    A.glow(g, PX + PW / 2, TOP + 6, 60, { color: 'phone4', strength: 0.3, power: 1.2, ry: 10 });
    A.vline(g, 248, 104, 22, 'phone4');
  }
  // speed: the room never moves, so it is painted once. Painted a second time over another colour, every pixel that
  // differs is window glass: each frame draws the live view outside, copies the room over the rest, then the moving parts.
  let plate = null, glass = null;
  function build(g) {
    outside(g, 0); room(g); lights(g);
    const first = g.buf.slice();
    g.buf.fill(A.col('red6')); room(g); lights(g);
    glass = new Uint8Array(first.length); for (let i = 0; i < first.length; i++) glass[i] = first[i] !== g.buf[i] ? 1 : 0;
    plate = first;
  }

  A.panels[5] = {
    text: 'Or the Tikkie of one cent that is still open. Probably all of it.',
    nl: 'Of aan het Tikkie van één cent dat nog steeds openstaat. Waarschijnlijk allemaal.',
    draw(g, t) {
      const T = ((t % PER) + PER) % PER, pg = ping(T), dx = pg > 0.55 ? (Math.floor(T * 30) % 2 ? 1 : -1) : 0;
      A.key(g, PX + PW / 2, PY + PH / 2, 2);
      if (!plate || plate.length !== g.buf.length) build(g);
      outside(g, T);
      const buf = g.buf; for (let i = 0; i < buf.length; i++) if (!glass[i]) buf[i] = plate[i];
      g.mask.fill(0);
      if (pg > 0) A.ring(g, PX + PW / 2, PY + PH / 2, Math.round(lerp(64, 40, pg)), pg > 0.5 ? 'phone4' : 'phone3', 1);
      phone(g, T, dx);
      // flies over the cheese
      for (let i = 0; i < 3; i++) { const a = T / PER * Math.PI * 2 * (i + 1) + i * 2.1; A.px(g, Math.round(166 + Math.cos(a) * (6 + i * 3)), Math.round(TOP - 16 - i * 3 + Math.sin(a * 1.7) * 3), 'night0'); }
      // the clock: 03:00, the colon blinks every second
      A.text(282, TOP - 4.2, Math.floor(T * 2) % 2 ? '03:00' : '03 00', 'red5', 7, true, { align: 'center' });
      A.text(142, 86.6, 'VLAAMS WINT', 'night1', 4, true, { align: 'center' });   // the paper's headline
      hand(g, T);
      // the dog on the bed, sitting up, with both eyes on the phone
      A.dog(g, 100, 141, { coat: 'brown', pose: 'sit', look: 'up', facing: 'right', t: T, seed: 4, eyes: true });
    },
  };
})();
