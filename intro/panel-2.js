// Panel 2: by morning everyone had changed; they still split the bill, the women still taller.
// Key light: grey dawn, upper left. Layers: sky, far gables, near gables, pavement, the cast,
// the wet street. Loops: sway and blinks, the Tikkie glow, mist, ripples on the street.
(function () {
  const A = window.NRART;
  const GABLES = ['step', 'bell', 'neck', 'spout', 'step', 'bell', 'roof', 'neck'];
  A.panels[1] = {
    text: 'By morning everyone had changed. Two things had not: they still split the bill, and the women were still taller than him.',
    nl: 'De volgende ochtend was iedereen veranderd. Twee dingen niet: ze deelden de rekening nog steeds, en de vrouwen waren nog steeds langer dan hij.',
    draw(g, t) {
      A.camera(g, t, { x: -6, period: 8 }); A.key(g, 30, -30, 1);
      A.depth(g, 0);
      A.sky(g, ['mist1', 'mist2', 'mist3', 'mist4'], 0, 130);
      A.depth(g, 0.3);
      for (let i = 0; i < 12; i++) A.canalHouse(g, -16 + i * 29, 132, 28, 52 + Math.round(A.hash(i, 3) * 16), { gable: GABLES[(i + 3) % 8], brick: 'night4', lit: 0.15, t, door: false, detail: false, seed: i + 40 });
      A.haze(g, -20, 40, 360, 96, { top: 0.6, bottom: 0.72, color: 'mist3' });
      A.depth(g, 0.6);
      [[-12, 38, 86], [26, 34, 96], [60, 30, 80], [90, 40, 102], [130, 36, 88], [166, 32, 94], [198, 40, 84], [238, 34, 100], [272, 38, 90], [310, 34, 86]].forEach(([x, w, h], i) =>
        A.canalHouse(g, x, 142, w, h, { gable: GABLES[i % 8], lit: 0.3, t, seed: i * 7 + 1 }));
      A.haze(g, -20, 30, 360, 112, { top: 0.25, bottom: 0.4, color: 'mist2' });
      A.rect(g, -20, 142, 360, 6, 'slate3'); A.hline(g, -20, 142, 360, 'slate5'); A.hline(g, -20, 148, 360, 'slate1');
      A.rect(g, -20, 149, 360, 31, 'slate2');
      A.depth(g, 1);
      A.mist(g, t, 118, 26, { amount: 0.4, speed: 4, seed: 2, color: 'mist4' });
      const z1 = A.zombie(g, 96, 152, { variant: 'hat', t, seed: 2 });
      A.man(g, 148, 152, { t, facing: 'front' });
      A.tallWoman(g, 170, 152, { t, facing: 'left', seed: 8, phone: false });
      const z2 = A.zombie(g, 244, 152, { variant: 'phone', t, seed: 5, facing: 'left' });
      A.water(g, -20, 152, 360, 28, { t, amp: 0.7, dark: 0.55, color: 'slate1', gaps: 0.3, glints: 6, glint: 'mist6' });
      A.say(g, z1.head[0] + 2, z1.head[1], '€4,50', { dx: -8 });
      A.say(g, z2.head[0] - 2, z2.head[1], 'Tikkie?', { dx: 6 });
    },
  };
})();
