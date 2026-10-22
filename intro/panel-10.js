// Panel 10: no helmet. A helmet would make him look enthusiastic.
// The man by his omafiets under a street lamp, holding the helmet away from himself.
// Key light: the lantern, right. Loops: "nee." coming and going, blinks, ripples, mist, a moth.
(function () {
  const A = window.NRART;
  A.panels[9] = {
    text: 'No helmet. A helmet would make him look enthusiastic.',
    nl: 'Geen helm. Met een helm zou hij enthousiast overkomen.',
    draw(g, t) {
      A.camera(g, t, { x: -6, period: 8 }); A.key(g, 236, 50, 2);
      A.depth(g, 0);
      A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0'], 0, 130);
      A.stars(g, t, { n: 24, y1: 50, seed: 9 });
      A.depth(g, 0.4);
      [[-10, 40, 92, 'bell'], [32, 34, 100, 'step'], [68, 36, 84, 'roof'], [250, 36, 96, 'neck'], [288, 40, 90, 'step']].forEach(([x, w, h, gb], i) =>
        A.canalHouse(g, x, 134, w, h, { gable: gb, lit: 0.3, t, seed: 50 + i }));
      A.haze(g, -20, 30, 360, 110, { top: 0.35, bottom: 0.5, color: 'mist2' });
      A.rect(g, -20, 134, 360, 6, 'slate3'); A.hline(g, -20, 134, 360, 'slate5'); A.rect(g, -20, 140, 360, 40, 'slate1');
      A.depth(g, 1);
      A.lamp(g, 232, 152, { t, style: 'lantern', h: 52, flicker: 0.03, reach: 60 });
      A.omafiets(g, 196, 156, { t, facing: 'left', basket: 'book' });
      A.man(g, 128, 156, { t, facing: 'front', hold: 'helmet' });
      A.water(g, -20, 156, 360, 24, { t, amp: 0.6, dark: 0.5, color: 'slate1', gaps: 0.3, glints: 8 });
      A.streak(g, 233, 158, 22, { t, seed: 2, width: 2 });
      const mx = 233 + Math.round(Math.sin(t * 5.1) * 5), my = 96 + Math.round(Math.cos(t * 3.7) * 4); A.px(g, mx, my, 'paper5');
      if (Math.floor(t * 2) % 3 === 0) A.say(g, 126, 114, 'nee.', {});
      A.mist(g, t, 124, 20, { amount: 0.3, speed: 4, seed: 4 });
    },
  };
})();
