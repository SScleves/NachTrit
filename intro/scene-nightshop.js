// Level intro scene "nightshop": a nachtwinkel glowing on a wet street in the rain, the dead
// queuing for it. Key light: the shop window. Loops: the sign flickering, rain, the phone glow.
(function () {
  const A = window.NRART;
  A.scenes.nightshop = (g, t) => {
    A.camera(g, t, { x: -6, period: 8 }); A.key(g, 160, 110, 2);
    A.depth(g, 0);
    A.sky(g, ['night0', 'night1', 'night2', 'night3'], 0, 120);
    A.depth(g, 0.35);
    [[-14, 36, 96, 'roof'], [22, 34, 90, 'step'], [236, 34, 96, 'bell'], [272, 40, 88, 'neck'], [312, 30, 92, 'step']].forEach(([x, w, h, gb], i) => A.canalHouse(g, x, 140, w, h, { gable: gb, lit: 0.2, t, seed: 90 + i }));
    A.haze(g, -20, 30, 360, 110, { top: 0.35, bottom: 0.5, color: 'mist1' });
    A.depth(g, 0.7);
    // the shop
    A.rect(g, 60, 30, 172, 110, 'night4'); A.brick(g, 60, 30, 172, 110, { base: 'night4', only: 'night4', seed: 12 });
    A.windows(g, 74, 38, { cols: 6, rows: 2, w: 8, h: 12, gx: 18, gy: 8, lit: 0.4, t, seed: 9 });
    const on = (t % 3.1) > 0.25 && !((t % 3.1) > 1.4 && (t % 3.1) < 1.5);
    A.rect(g, 70, 82, 152, 12, 'slate0'); A.hline(g, 70, 94, 152, 'slate2');
    A.text(146, 92, 'NACHTWINKEL', on ? 'amber7' : 'amber2', 9, true, { align: 'center' });
    if (on) A.glow(g, 146, 88, 70, { ry: 14, color: 'amber6', strength: 0.35 });
    A.rect(g, 74, 98, 144, 40, 'amber5'); A.rect(g, 74, 98, 144, 2, 'amber4');
    for (let i = 0; i < 4; i++) { A.rect(g, 80 + i * 34, 104, 26, 30, 'amber3'); for (let k = 0; k < 4; k++) A.hline(g, 80 + i * 34, 108 + k * 7, 26, 'wood2'); for (let k = 0; k < 8; k++) A.px(g, 82 + i * 34 + k * 3, 106 + (k % 4) * 7, ['red4', 'cheese4', 'phone3', 'green4'][k % 4]); }
    A.rect(g, 196, 102, 18, 36, 'night1'); A.rect(g, 197, 103, 16, 34, 'amber4');
    A.glow(g, 146, 120, 110, { ry: 50, color: 'amber5', strength: 0.3 });
    A.rect(g, -20, 140, 360, 4, 'slate3'); A.rect(g, -20, 144, 360, 36, 'slate1');
    A.depth(g, 1);
    const z = A.zombie(g, 262, 150, { t, seed: 5, variant: 'phone', facing: 'left' });
    A.zombie(g, 40, 150, { t, seed: 6, variant: 'plain', facing: 'right' });
    A.water(g, -20, 150, 360, 30, { t, amp: 0.7, dark: 0.45, color: 'slate1', gaps: 0.3, glints: 10, stretch: 1.3 });
    A.say(g, z.head[0], z.head[1], '€4,50', {});
    A.rain(g, t, { n: 110, speed: 170, slant: 0.2, splash: 150 });
  };
})();
