// Level intro scene "dyke" (polder borrows it): the mills along the water at Kinderdijk.
// Key light: the moon, upper left. Loops: four mills turning, the water, reeds, the duck, mist.
(function () {
  const A = window.NRART;
  A.scenes.dyke = (g, t) => {
    A.camera(g, t, { x: -8, period: 8 }); A.key(g, 60, 26, 1);
    A.depth(g, 0);
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'night4', 'mist0'], 0, 118);
    A.stars(g, t, { n: 40, y1: 60, seed: 11 });
    A.moon(g, 60, 26, 8, {});
    A.depth(g, 0.2);
    [[330, 0.24], [300, 0.28], [266, 0.32]].forEach(([x, s], i) => A.windmill(g, x, 112, s, -t * 0.9 + i, { tone: 'night3', t, seed: i }));
    A.rect(g, -20, 111, 360, 6, 'night3');
    A.haze(g, -20, 50, 360, 70, { top: 0.35, bottom: 0.65, color: 'mist2' });
    A.depth(g, 0.45);
    A.windmill(g, 220, 116, 0.5, -t * 0.8 + 0.3, { tone: 'night3', t, seed: 4 });
    A.windmill(g, 160, 118, 0.72, -t * 0.7 + 1, { tone: 'night3', t, seed: 5 });
    A.rect(g, -20, 115, 360, 5, 'night2');
    A.haze(g, 120, 40, 140, 82, { amount: 0.3, color: 'mist2' });
    A.mist(g, t, 100, 20, { amount: 0.45, speed: 3, seed: 2, color: 'mist3' });
    A.depth(g, 0.75);
    A.windmill(g, 86, 122, 1.05, -t * 0.6 + 2, { tone: 'night2', t, seed: 6, lit: 0.8 });
    A.rect(g, -20, 120, 360, 4, 'night1'); A.hline(g, -20, 120, 360, 'night3');
    A.fingerpost(g, 290, 124, { signs: [['Molen', 'left'], ['Dorp', 'right']] });
    A.depth(g, 1);
    A.water(g, -20, 124, 360, 56, { t, amp: 1.3, dark: 0.5, color: 'night1', glints: 16 });
    A.streak(g, 60, 128, 34, { t, color: 'mist6', strength: 0.35, seed: 3 });
    A.duck(g, 200, 146, { t, facing: 'right' });
    A.boat(g, 252, 160, { t, kind: 'sloep', len: 34 });
    A.reeds(g, -14, 181, 70, 34, { t, seed: 3, tone: 'green1' });
    A.reeds(g, 280, 181, 60, 26, { t, seed: 8, tone: 'green1' });
    A.mist(g, t, 128, 22, { amount: 0.3, speed: 6, seed: 6 });
  };
  A.scenes.polder = (g, t) => A.scenes.dyke(g, t);
})();
