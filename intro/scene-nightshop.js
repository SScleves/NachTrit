// Level intro scene "nightshop": a nachtwinkel glowing on a wet street in the rain, the dead
// queuing for it. Key light: the shop window. Loops: the sign flickering, rain + mist, the phone glow, windmill sails.
(function () {
  const A = window.NRART;
  const GY = 152; // pavement line the cast stands on
  A.scenes.nightshop = (g, t) => {
    const R = A.rect, H = A.hline, V = A.vline, P = A.px;
    A.camera(g, t, { x: -6, period: 8 }); A.key(g, 160, 110, 2);
    // ---- sky and far silhouettes
    A.depth(g, 0);
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'night4'], 0, 140);
    A.stars(g, t, {});
    A.moon && A.moon(g, 286, 22, 7, {});
    A.depth(g, 0.2);
    A.windmill(g, 30, 132, 1.0, -(t / 8) * Math.PI / 2, { tone: 'mist1', sail: 'mist1', lit: 0.6, t });
    A.church(g, 312, 100, 1.1, {});
    A.haze(g, -20, 60, 360, 90, { top: 0.35, bottom: 0.7, color: 'mist2' });
    // far canal houses
    A.depth(g, 0.4);
    [[-16, 40, 70, 'bell'], [26, 34, 60, 'step'], [246, 36, 78, 'neck'], [284, 34, 66, 'spout']].forEach(([x, w, h, gb], i) =>
      A.canalHouse(g, x, 148, w, h, { gable: gb, lit: 0.3, t, seed: 90 + i, brick: i % 2 ? 'night4' : 'slate3' }));
    A.haze(g, -20, 40, 360, 112, { top: 0.25, bottom: 0.5, color: 'mist2' });
    A.mist(g, t, 118, 28, { amount: 0.3, speed: 4, seed: 1 });
    // ---- the shop building
    A.depth(g, 0.7);
    const bx = 74, bw = 176, by = 40;
    R(g, bx, by, bw, GY - by, 'brick2'); A.brick(g, bx, by, bw, GY - by, { base: 'brick2', only: 'brick2', seed: 12, vary: 0.3 });
    // cornice and roof edge
    R(g, bx - 3, by - 5, bw + 6, 5, 'slate2'); H(g, bx - 3, by - 5, bw + 6, 'slate4'); H(g, bx - 3, by, bw + 6, 'slate0');
    R(g, bx + 18, by - 12, 8, 7, 'brick1'); R(g, bx + 17, by - 13, 10, 2, 'slate2'); // chimney
    for (let i = 0; i < 8; i++) V(g, bx + 4 + i * 22, by - 5, 5, 'slate3');
    // upstairs windows, a few lit, a cat
    for (let i = 0; i < 6; i++) {
      const lit = [1, 0, 0, 1, 0, 1][i];
      A.window(g, bx + 12 + i * 28, by + 10, 12, 18, { lit: lit ? 0.9 : 0, t, seed: 3 + i, flicker: 0.5, detail: i === 3 ? 'cat' : i === 0 ? 'tulip' : null, frame: 'paper1', glow: 0.3 });
      A.window(g, bx + 12 + i * 28, by + 36, 12, 18, { lit: i === 2 ? 0.8 : 0, t, seed: 20 + i, frame: 'paper1', detail: i === 2 ? 'plant' : null });
    }
    // shop front: dark pilasters and an amber-lit fascia
    R(g, bx, 84, bw, GY - 84, 'brick1');
    A.brick(g, bx, 84, bw, GY - 84, { base: 'brick1', only: 'brick1', seed: 4 });
    // interior (cyan fridge light) behind glass
    const ix = 92, iy = 104, iw = 132, ih = 46;
    R(g, ix - 3, iy - 3, iw + 6, ih + 6, 'slate1');
    R(g, ix, iy, iw, ih, 'phone1');
    A.ditherGradient(g, ix, iy, iw, ih, 'phone2', 'phone1', 'down');
    const cols = ['red4', 'cheese4', 'green5', 'paper4', 'orange3'];
    for (let s = 0; s < 4; s++) {
      const sy = iy + 6 + s * 11;
      R(g, ix, sy + 5, iw, 1, 'phone4'); R(g, ix, sy + 6, iw, 1, 'phone0');
      for (let k = 0; k < 30; k++) {
        const hh = 2 + ((k * 7 + s * 3) % 4), cx = ix + 2 + k * 4.3 | 0;
        if ((k + s) % 7 === 3) continue;
        R(g, cx, sy + 5 - hh, 3, hh, cols[(k * 3 + s) % cols.length]); P(g, cx, sy + 5 - hh, 'paper3');
      }
    }
    // fridge door divider and a lone shopkeeper silhouette? no: the shop is empty
    for (let k = 1; k < 4; k++) V(g, ix + k * 33, iy, ih, 'slate1');
    // glass glare: diagonal streaks
    for (let k = 0; k < 3; k++) A.line(g, ix + 14 + k * 40, iy + ih, ix + 34 + k * 40, iy, 'phone3');
    A.glow(g, ix + iw / 2, iy + ih / 2, 100, { ry: 36, color: 'phone3', strength: 0.35, power: 1.2 });
    // door
    R(g, 230, 100, 16, 52, 'slate0'); R(g, 232, 102, 12, 50, 'phone2'); A.ditherGradient(g, 232, 102, 12, 50, 'phone3', 'phone1', 'down'); V(g, 238, 102, 50, 'slate1'); R(g, 235, 128, 1, 6, 'steel4');
    H(g, 230, 100, 16, 'slate3');
    // OPEN sign: small, in the door
    R(g, 233, 107, 10, 5, 'brick3'); H(g, 233, 107, 10, 'red5');
    // awning: striped canvas, scalloped
    for (let i = 0; i < bw + 4; i += 6) {
      const c = (i / 6) % 2 ? 'brick4' : 'paper2';
      R(g, bx - 2 + i, 91, 6, 10, c); R(g, bx - 2 + i, 101, 6, 2, c); P(g, bx - 2 + i + 2, 103, c); P(g, bx - 2 + i + 3, 103, c);
    }
    H(g, bx - 2, 91, bw + 4, 'slate1'); H(g, bx - 2, 92, bw + 4, 'paper4');
    A.tint(g, bx - 2, 94, bw + 4, 10, 'night2', 0.28, 'mix');
    // sign board with flicker
    const ph = t % 3.1, on = ph > 0.25 && !(ph > 1.4 && ph < 1.5) && !(ph > 1.62 && ph < 1.68);
    R(g, 100, 66, 120, 20, 'slate0'); R(g, 101, 67, 118, 18, 'slate1');
    for (let x = 102; x < 218; x += 4) { P(g, x, 68, on ? 'amber7' : 'amber1'); P(g, x, 83, on ? 'amber7' : 'amber1'); }
    for (let y = 68; y < 84; y += 4) { P(g, 102, y, on ? 'amber7' : 'amber1'); P(g, 217, y, on ? 'amber7' : 'amber1'); }
    V(g, 110, 56, 10, 'slate2'); V(g, 210, 56, 10, 'slate2'); // brackets
    A.text(160, 82, 'NACHTWINKEL', on ? 'amber8' : 'amber2', 12, true, { align: 'center', shadow: true });
    if (on) { A.glow(g, 160, 76, 80, { ry: 24, color: 'amber6', strength: 0.5, power: 1.3 }); A.glow(g, 160, 100, 90, { ry: 20, color: 'amber5', strength: 0.18 }); }
    // stoop, step and a price board
    R(g, bx, GY - 3, bw, 3, 'slate3'); H(g, bx, GY - 3, bw, 'slate5');
    // sidewalk tiles
    A.depth(g, 1);
    // pavement tiles
    A.tiles && A.tiles(g, -20, GY - 3, 360, 4, { base: 'slate2', th: 1, tw: 5 });
    // ---- foreground left: lamp, bike, bollards, fence, tulips
    A.fence(g, 6, GY, 50, 12, {});
    A.tulips(g, 66, GY, 26, {});
    A.lamp(g, 62, GY, { style: 'lantern', h: 62, flicker: 0.12, t, reach: 70 });
    A.omafiets(g, 28, GY, { rider: false, t, basket: 'cheese' });
    A.bollard(g, 90, GY); A.bollard(g, 108, GY);
    // right: second lamp (modern, far) and bollards
    A.bollard(g, 262, GY);
    A.cone(g, 238, 110, Math.PI / 2 + 0.5, 0.5, 60, { color: 'phone3', strength: 0.3 });
    // ---- cast
    const z = A.tallWoman(g, 258, GY + 1, { t, seed: 5, facing: 'left' });
    A.zombie(g, 292, GY + 1, { t, seed: 6, variant: 'hat', facing: 'left', height: 54 });
    // phone glow breathes
    const pg = 0.35 + 0.15 * Math.sin(t * 2 * Math.PI / 3);
    if (z && z.hand) { A.glow(g, z.hand[0], z.hand[1], 22, { color: 'phone3', strength: pg, power: 1.3 }); }
    // ---- wet ground
    A.shadow(g, 258, GY, 10, 2, 0.5);
    A.water(g, -20, GY + 1, 360, 180 - GY, { t, amp: 0.8, dark: 0.42, color: 'slate1', gaps: 0.35, glints: 12, stretch: 1.4 });
    // light streaks on the wet road
    A.streak(g, 160, GY + 3, 24, { color: 'amber6', strength: 0.75, width: 3, t, seed: 1 });
    A.streak(g, 130, GY + 4, 20, { color: 'phone4', strength: 0.55, width: 4, t, seed: 2 });
    A.streak(g, 185, GY + 4, 20, { color: 'phone4', strength: 0.55, width: 4, t, seed: 3 });
    A.streak(g, 63, GY + 3, 18, { color: 'amber6', strength: 0.6, width: 1, t, seed: 4 });
    A.glow(g, 160, GY + 8, 100, { ry: 14, color: 'phone3', strength: 0.22, power: 1.4 });
    // ---- foreground mist, rain
    A.mist(g, t, 140, 22, { amount: 0.28, speed: 6, seed: 2 });
    A.say(g, z.head[0], z.head[1], '€4,50', {});
    A.rain(g, t, { n: 120, speed: 170, slant: 0.2, splash: 160 });
    A.haze(g, 0, 0, 320, 14, { top: 0.35, bottom: 0, color: 'night0' });
  };
})();
