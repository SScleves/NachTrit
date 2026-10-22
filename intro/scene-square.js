// Level intro scene "square": the market square, town hall and carillon tower, trees, lanterns.
// Key light: the town hall's lit windows. Loops: the carillon note, lamp flicker, the dead
// wandering, window flicker, mist.
(function () {
  const A = window.NRART;
  A.scenes.square = (g, t) => {
    A.camera(g, t, { x: 6, period: 8 }); A.key(g, 160, 60, 1);
    A.depth(g, 0);
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0'], 0, 130);
    A.stars(g, t, { n: 34, y1: 50, seed: 5 });
    A.depth(g, 0.3);
    [[-12, 34, 80, 'step'], [22, 30, 90, 'bell'], [252, 32, 86, 'neck'], [286, 38, 80, 'step']].forEach(([x, w, h, gb], i) => A.canalHouse(g, x, 128, w, h, { gable: gb, lit: 0.35, t, seed: 70 + i }));
    A.haze(g, -20, 30, 360, 100, { top: 0.35, bottom: 0.5, color: 'mist2' });
    A.depth(g, 0.55);
    // the town hall: a wide step-gabled front and a tower in the middle
    A.rect(g, 152, 18, 18, 40, 'night4'); A.poly(g, [150, 18, 172, 18, 161, -6], 'night3'); A.vline(g, 161, -10, 4, 'night3');
    A.ring(g, 161, 30, 4, 'paper2'); A.px(g, 161, 30, 'paper3'); A.line(g, 161, 30, 161, 27, 'paper3'); A.line(g, 161, 30, 163, 31, 'paper3');
    A.window(g, 157, 40, 8, 12, { lit: 0.9, t, seed: 3, frame: 'paper2' });
    A.canalHouse(g, 104, 128, 114, 96, { gable: 'step', brick: 'brick3', lit: 0.7, t, seed: 80, hoist: false });
    A.haze(g, 100, 0, 120, 128, { amount: 0.15, color: 'mist2' });
    A.tree(g, 74, 132, 1.1, { tone: 'night2', t, seed: 3 }); A.tree(g, 246, 132, 1, { tone: 'night2', t, seed: 6 });
    A.rect(g, -20, 128, 360, 52, 'slate2'); for (let y = 130; y < 180; y += 3) for (let x = -20 + (y % 6); x < 340; x += 6) A.hline(g, x, y, 4, 'slate3');
    A.depth(g, 1);
    A.lamp(g, 40, 160, { t, style: 'lantern', h: 42, seed: 4 });
    A.lamp(g, 286, 160, { t, style: 'lantern', h: 42, seed: 5, flicker: 0.04 });
    A.zombie(g, 120 + ((t * 4) % 60), 164, { t, seed: 3, variant: 'bonnet', pose: 'walk' });
    A.zombie(g, 220, 168, { t, seed: 4, variant: 'cheese', facing: 'left' });
    A.cheeseCart(g, 250, 172, {});
    A.water(g, -20, 172, 360, 8, { t, amp: 0.5, dark: 0.55, color: 'slate1', gaps: 0.35, glints: 4 });
    A.mist(g, t, 120, 26, { amount: 0.3, speed: 4, seed: 2 });
    if (Math.floor(t * 2) % 2) A.text(176, 14, '♪', 'amber7', 9, true);
  };
})();
