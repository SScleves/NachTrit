// Panel 10: no helmet. A helmet would make him look enthusiastic.
// A wet canal quay at night. The man stands deadpan beside a never-used helmet (price tag still on),
// a dog has brought it over. The lantern behind them throws a cone onto the helmet. Bike in half-light.
// Key light: the lantern. Loops: mill sails, lamp flicker, blinks, water, mist, moth, bubble hold (8 s cycle).
(function () {
  const A = window.NRART;
  // A cycling helmet in profile, facing right: domed shell, vents, visor lip, loose strap + buckle, shop tag.
  const helmet = (g, x, y) => {
    A.shadow(g, x + 2, y, 15, 3, 0.7);
    for (let i = 0; i < 13; i++) {
      const u = (12.5 - i) / 12.5, hw = Math.round(13 * Math.sqrt(Math.max(0, 1 - u * u)));
      A.hline(g, x - hw, y - 13 + i, hw * 2 + 1, i < 3 ? 'paper6' : i < 9 ? 'paper5' : i < 12 ? 'paper3' : 'paper1');
    }
    A.hline(g, x - 13, y, 27, 'slate2');
    for (let k = 0; k < 4; k++) { const vx = x - 6 + k * 4, vy = y - 12 + (k === 0 || k === 3 ? 2 : 0); A.vline(g, vx, vy, 4, 'night2'); A.vline(g, vx + 1, vy + 1, 3, 'paper3'); }
    A.hline(g, x + 5, y - 6, 12, 'steel1'); A.hline(g, x + 7, y - 5, 10, 'steel0'); A.hline(g, x + 5, y - 7, 6, 'slate2');   // visor lip
    A.px(g, x - 12, y - 2, 'paper1');
    A.px(g, x + 4, y - 12, 'amber7'); A.px(g, x + 5, y - 11, 'amber6'); A.px(g, x + 3, y - 11, 'amber4');   // key light
    A.line(g, x + 3, y, x + 9, y + 2, 'night1'); A.line(g, x + 9, y + 2, x + 15, y + 1, 'night1');       // loose strap
    A.rect(g, x + 15, y, 3, 3, 'steel4'); A.px(g, x + 16, y + 1, 'night2');                                // buckle
    A.line(g, x - 9, y - 3, x - 14, y + 1, 'paper5');                                                      // string
    A.rect(g, x - 18, y + 1, 5, 6, 'paper6'); A.rect(g, x - 17, y + 3, 3, 1, 'red4'); A.px(g, x - 16, y + 5, 'slate3'); A.px(g, x - 18, y + 1, 'paper4');
  };
  A.panels[9] = {
    text: 'No helmet. A helmet would make him look enthusiastic.',
    nl: 'Geen helm. Met een helm zou hij enthousiast overkomen.',
    draw(g, t) {
      A.camera(g, t, { x: -6, period: 8 }); A.key(g, 168, 90, 2);
      const tm = t % 8;
      // sky: one continuous ramp into the fog, stars only in the clear top
      A.depth(g, 0);
      A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist1', 'mist2'], 0, 118);
      A.stars(g, t, { n: 26, y0: 2, y1: 40, seed: 9 });
      A.moon(g, 298, 24, 4, { halo: 0.2 });
      // far layer 1: mill and church, solid shapes a step darker than the fog
      A.depth(g, 0.2);
      A.windmill(g, 52, 112, 0.8, -t * 0.5, { tone: 'mist1', stage: true });
      A.church(g, 284, 112, 0.8);
      A.tree(g, 100, 112, 0.7); A.tree(g, 232, 112, 0.6);
      // far layer 2: gabled houses, darker, a few amber windows
      A.depth(g, 0.4);
      [[10, 24, 40, 'step'], [34, 22, 34, 'bell'], [206, 22, 38, 'roof'], [226, 26, 44, 'neck'], [258, 24, 36, 'step'], [286, 30, 42, 'bell']].forEach(([x, w, h, gb], i) =>
        A.canalHouse(g, x, 116, w, h, { gable: gb, lit: 0.3, t, seed: 70 + i, brick: 'night1', trim: 'night2' }));
      A.drawbridge(g, 140, 116, 56);
      A.haze(g, -10, 60, 340, 58, { top: 0.1, bottom: 0.45, color: 'mist3' });
      // a tall thin hunched zombie crossing the drawbridge, no helmet (nobody here wears one)
      A.zombie(g, 152 + Math.round(Math.sin(t * Math.PI / 4) * 8), 113, { variant: 'plain', pose: 'walk', t, height: 24, hunch: 0.8, tone: 'night1', glow: 1 });
      // far quay and canal
      A.rect(g, -20, 116, 360, 3, 'slate2'); A.hline(g, -20, 116, 360, 'slate4');
      A.rect(g, -20, 119, 360, 18, 'night1');
      A.boat(g, 250, 128, { kind: 'sloep', len: 42 });
      A.depth(g, 0.7); A.reeds(g, 6, 136, 30, 14, { t });
      A.lamp(g, 70, 119, { style: 'modern', h: 22, on: true });
      A.water(g, -20, 119, 360, 18, { t, amp: 0.8, dark: 0.55, color: 'night2', gaps: 0.25, glints: 6 });
      A.streak(g, 78, 122, 12, { t, seed: 4 });
      // near quay: cobbles all the way down (one hline per stone, cheap)
      A.depth(g, 1);
      A.rect(g, -20, 137, 360, 3, 'slate3'); A.hline(g, -20, 137, 360, 'slate5');
      A.rect(g, -20, 140, 360, 42, 'slate1');
      for (let r = 0; r < 8; r++) {
        A.hline(g, -20, 144 + r * 5, 360, 'slate0');
        for (let c = -4; c < 68; c++) {
          const x = c * 5 + (r & 1) * 2, y = 140 + r * 5, h = A.hash(c, r);
          A.hline(g, x + 1, y, 3, h > 0.5 ? 'slate3' : 'slate2'); if (h > 0.8) A.hline(g, x + 1, y + 1, 2, 'slate2');
        }
      }
      A.bollard(g, 60, 148); A.bollard(g, 86, 148);
      A.fingerpost(g, 300, 158, {});
      A.canalHouse(g, -30, 140, 50, 100, { gable: 'roof', lit: 0.5, t, seed: 3, brick: 'brick0' });
      A.tulips(g, 22, 152, 16, { t });
      // the lantern, behind and between them, with a cone falling on the helmet
      const [lx, ly] = A.lamp(g, 182, 161, { t, style: 'lantern', h: 62, flicker: 0.04, light: false });
      A.glow(g, lx, ly, 26, { color: 'amber6', strength: 0.5, power: 1.6 });
      A.cone(g, lx, ly + 2, 2.1, 0.17, 90, { color: 'amber7', strength: 0.2, width: 4, fade: 0.7, edge: 0.6 });
      A.glow(g, 142, 170, 34, { ry: 9, strength: 0.55, power: 1.1, color: 'amber5' });
      A.glow(g, 182, 163, 22, { ry: 4, strength: 0.3, power: 1, color: 'amber5' });
      // bike overlaps the lamp, in half-light
      A.omafiets(g, 208, 163, { t, facing: 'left', basket: 'book' });
      A.tint(g, 190, 140, 50, 26, 'night0', 0.4, 'mul');
      // cast: man a little behind, helmet low and close, dog beside it
      A.man(g, 110, 164, { t, facing: 'right', face: Math.floor(t * 0.5) % 4 === 3 ? 'blink' : 'side' });
      [[166, 4, 100, 92], [170, 5, 94, 108], [175, 5, 98, 100]].forEach(([y, h, x, w]) => A.water(g, x, y, w, h, { t, amp: 0.6, dark: 0.5, color: 'slate1', gaps: 0.3, glints: 3, stretch: 1.1 }));
      A.streak(g, 183, 167, 12, { t, seed: 2, width: 2 });
      helmet(g, 134, 170);
      A.dog(g, 166, 170, { t, coat: 'brown', pose: 'sit', look: 'up', facing: 'left' });
      A.water(g, 118, 175, 56, 5, { t, amp: 0.4, dark: 0.55, color: 'slate1', gaps: 0.3, glints: 3 });
      // foreground framing, cropped by the frame
      [[8, 190, 28], [30, 192, 24], [306, 190, 30]].forEach(([bx, by, bh]) => {
        A.rect(g, bx, by - bh + 2, 7, bh, 'night0'); A.rect(g, bx + 1, by - bh, 5, 2, 'night0'); A.vline(g, bx + 5, by - bh + 3, bh - 4, 'slate1'); A.hline(g, bx, by - bh + 8, 7, 'slate0');
      });
      const mx = lx + Math.round(Math.sin(t * 5.1) * 6), my = ly + 8 + Math.round(Math.cos(t * 3.7) * 5); A.px(g, mx, my, 'paper6');
      if (tm > 2.5 && tm < 6.5) A.say(g, 112, 121, 'nee.', {});
      A.mist(g, t, 118, 44, { amount: 0.3, speed: 4, seed: 4 });
    },
  };
})();
