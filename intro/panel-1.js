// Panel 1: the night the mist came in, the windmills turned the wrong way.
// Key light: the moon, upper right. Layers: sky and moon, far skyline, the middle mill, the dyke
// and the big mill, the ditch that mirrors it all, reeds. Loops: sails, mist, water, duck, stars.
// Dutch mills turn anticlockwise seen from the front; these turn clockwise (positive angle).
(function () {
  const A = window.NRART;
  A.panels[0] = {
    text: 'The night the mist came in, the windmills turned the wrong way.',
    nl: 'De nacht dat de mist opkwam, draaiden de molens de verkeerde kant op.',
    draw(g, t) {
      A.camera(g, t, { x: 8, period: 8 }); A.key(g, 268, 30, 1);
      A.depth(g, 0);
      A.sky(g, ['night0', 'night1', 'night2', 'night3', 'night4', 'mist0'], 0, 126);
      A.stars(g, t, { n: 46, y1: 64, seed: 4 });
      A.moon(g, 268, 32, 9, { halo: 0.3 });
      // far skyline: a tree line, a church, three small mills
      A.depth(g, 0.2);
      for (let x = -20; x < 340; x += 5) A.disc(g, x, 121 - Math.round(A.hash(x, 2) * 3), 2 + Math.round(A.hash(x, 3) * 2), 'night3');
      A.rect(g, -20, 121, 360, 8, 'night3');
      A.church(g, 128, 123, 0.55, { tone: 'night3' });
      [[26, 0.3, 1.1], [96, 0.26, 0.9], [306, 0.34, 1.3]].forEach(([x, s, sp], i) => A.windmill(g, x, 123, s, t * sp + i, { tone: 'night3', t, seed: i, lit: 0.4 }));
      A.haze(g, -20, 60, 360, 70, { top: 0.3, bottom: 0.62, color: 'mist2' });
      A.mist(g, t, 104, 18, { amount: 0.5, speed: 3, seed: 1, color: 'mist3' });
      // the middle mill
      A.depth(g, 0.5);
      A.rect(g, -20, 127, 360, 4, 'night2');
      A.windmill(g, 62, 128, 0.72, t * 0.8 + 0.4, { tone: 'night3', t, seed: 7, lit: 0.7 });
      A.haze(g, 0, 60, 130, 72, { amount: 0.3, color: 'mist2' });
      // the dyke and the big mill
      A.depth(g, 0.8);
      A.poly(g, [-20, 130, 340, 130, 340, 136, -20, 136], 'night1'); A.hline(g, -20, 130, 360, 'night3');
      A.windmill(g, 204, 131, 1.45, t * 0.7, { tone: 'night2', t, seed: 3, lit: 0.9 });
      A.mist(g, t, 116, 18, { amount: 0.35, speed: 5, seed: 3 });
      // the ditch mirrors it all
      A.depth(g, 1);
      A.water(g, -20, 136, 360, 44, { t, amp: 1.2, dark: 0.5, color: 'night1', glints: 14 });
      A.streak(g, 268, 140, 30, { t, color: 'mist6', strength: 0.35, seed: 2 });
      A.duck(g, 146, 158, { t, facing: 'left' });
      A.reeds(g, -14, 181, 74, 36, { t, seed: 2, tone: 'green1' });
      A.reeds(g, 258, 181, 80, 30, { t, seed: 5, tone: 'green1' });
      A.mist(g, t, 140, 22, { amount: 0.28, speed: 7, seed: 5 });
    },
  };
})();
