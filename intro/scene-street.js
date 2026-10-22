// Level intro scene "street" (also the fallback for themes without a scene of their own).
// A canal-house street at night, wet cobbles, two lanterns, the dogs, the bike waiting.
// Key light: the right lantern. Loops: tails, lamp flicker, ripples, window flicker, mist.
(function () {
  const A = window.NRART;
  const ROW = [[-14, 36, 88, 'bell'], [22, 30, 96, 'step'], [52, 34, 82, 'neck'], [86, 28, 100, 'spout'], [114, 40, 90, 'step'], [154, 32, 86, 'bell'], [186, 36, 104, 'neck'], [222, 30, 84, 'roof'], [252, 38, 96, 'step'], [290, 34, 88, 'bell']];
  A.scenes.street = (g, t) => {
    A.camera(g, t, { x: 8, period: 8 }); A.key(g, 250, 80, 1);
    A.depth(g, 0);
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0'], 0, 120);
    A.stars(g, t, { n: 30, y1: 40, seed: 2 });
    A.depth(g, 0.3);
    A.church(g, 140, 70, 0.9, { tone: 'night3' });
    A.haze(g, 100, 0, 90, 80, { amount: 0.45, color: 'mist2' });
    A.depth(g, 0.6);
    ROW.forEach(([x, w, h, gb], i) => A.canalHouse(g, x, 138, w, h, { gable: gb, lit: 0.4, t, seed: i * 5 + 60 }));
    A.haze(g, -20, 30, 360, 110, { top: 0.2, bottom: 0.4, color: 'mist2' });
    A.rect(g, -20, 138, 360, 6, 'slate3'); A.hline(g, -20, 138, 360, 'slate5');
    A.rect(g, -20, 144, 360, 36, 'slate1'); for (let y = 146; y < 180; y += 3) for (let x = -20 + (y % 6); x < 340; x += 6) A.hline(g, x, y, 4, 'slate2');
    A.depth(g, 1);
    A.lamp(g, 70, 150, { t, style: 'lantern', h: 40, seed: 1 });
    A.lamp(g, 250, 150, { t, style: 'lantern', h: 40, seed: 2, flicker: 0.05 });
    A.bollard(g, 120, 152); A.bollard(g, 132, 152); A.tulips(g, 2, 146, 22, { t });
    A.omafiets(g, 200, 158, { t, facing: 'left', basket: 'book' });
    A.dog(g, 120, 166, { t, coat: 'brown', pose: 'walk', seed: 2 });
    A.dog(g, 146, 168, { t, coat: 'black', pose: 'stand', seed: 7 });
    A.water(g, -20, 168, 360, 12, { t, amp: 0.5, dark: 0.55, color: 'slate1', gaps: 0.35, glints: 6 });
    A.mist(g, t, 128, 24, { amount: 0.3, speed: 5, seed: 1 });
  };
})();
