// Panel 11: Fak. Oké. One man, one omafiets, three hundred and sixty words. Nachtrit.
// He rides out into the fog; his lamp finds the dead standing in the road ahead.
// Key light: his bike lamp, pointing right. Loops: wheels and pedals, the beam's shimmer, eyes
// blinking in the fog, street lamps flickering behind, ripples, mist.
(function () {
  const A = window.NRART;
  A.panels[10] = {
    text: 'Fak. Oké. One man, one omafiets, three hundred and sixty words. Nachtrit.',
    nl: 'Fak. Oké. Eén man, één omafiets, driehonderdzestig woorden. Nachtrit.',
    draw(g, t) {
      A.camera(g, t, { x: 10, period: 8 }); A.key(g, 120, 140, 2);
      A.depth(g, 0);
      A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0', 'mist1'], 0, 140);
      A.stars(g, t, { n: 26, y0: 0, y1: 55, seed: 11 });
      A.moon(g, 226, 30, 6, { halo: 0.2, phase: 0.3 });
      // far plane: mill, spire, roofs, all in fog
      A.depth(g, 0.2);
      A.windmill(g, 262, 134, 0.62, -t * 0.5, { tone: 'night3', t, seed: 2, lit: 0.6 });
      A.church(g, 168, 134, 0.7, { tone: 'night3' });
      for (let x = -20; x < 340; x += 6) A.disc(g, x, 130 - Math.round(A.hash(x, 5) * 4), 2 + Math.round(A.hash(x, 6) * 2), 'night3');
      A.rect(g, -20, 130, 360, 8, 'night3');
      A.haze(g, -20, 30, 360, 108, { top: 0.35, bottom: 0.75, color: 'mist2' });
      // mid-far: drawbridge over the canal and the first row of roofs
      A.depth(g, 0.4);
      [[-4, 44, 'step', 3], [48, 36, 'bell', 4], [96, 40, 'neck', 5]].forEach(([x, h, gb, sd]) =>
        A.canalHouse(g, x, 138, 40, h, { gable: gb, brick: 'brick2', lit: 0.5, t, seed: sd }));
      A.drawbridge(g, 196, 132, 70, { tone: 'night3' });
      A.zombie(g, 214, 132, { t, seed: 31, variant: 'plain', tone: 'night2', height: 24, glow: 0.6 });
      A.zombie(g, 246, 132, { t, seed: 32, variant: 'hat', tone: 'night2', height: 22, glow: 0.6 });
      A.rect(g, -20, 133, 360, 8, 'night2');
      A.haze(g, -20, 90, 360, 52, { top: 0.25, bottom: 0.6, color: 'mist3' });
      // the road ahead: lamps shrinking into the dark, the dead standing in it
      A.depth(g, 0.6);
      A.rect(g, -20, 138, 360, 10, 'night2');
      A.hline(g, -20, 138, 360, 'slate3');
      [[300, 12, 8], [262, 16, 7], [214, 22, 6], [158, 28, 5]].forEach(([x, h, s], i) =>
        A.lamp(g, x, 142, { t, style: 'modern', h, flicker: 0.04, seed: s, reach: h, cone: 0.3 }));
      [[200, 34, 1], [228, 30, 2], [258, 38, 3], [286, 28, 4], [312, 36, 5]].forEach(([x, h, s], i) =>
        A.zombie(g, x, 146, { t, seed: s + 20, facing: 'left', variant: i % 2 ? 'hat' : 'plain', tone: 'night1', height: h, glow: 0.5 }));
      A.haze(g, -20, 100, 360, 50, { top: 0.15, bottom: 0.5, color: 'mist2' });
      A.mist(g, t, 124, 24, { amount: 0.45, speed: 6, seed: 7, color: 'mist3' });
      // wet road and reflections
      A.depth(g, 1);
      A.rect(g, -20, 148, 360, 32, 'slate1');
      A.ditherGradient(g, -20, 148, 360, 32, 'slate1', 'night1', 'v');
      for (let x = -20; x < 340; x += 22) A.hline(g, x, 158, 10, 'slate3');
      for (let x = -14; x < 340; x += 7) if (A.hash(x, 9) < 0.5) A.px(g, x, 150 + Math.floor(A.hash(x, 8) * 4), 'slate2');
      A.hline(g, -20, 148, 360, 'slate3');
      
      A.lamp(g, 62, 150, { t, style: 'lantern', h: 36, flicker: 0.06, seed: 12, reach: 34, cone: 0.3 });
      A.omafiets(g, 112, 160, { t, rider: true, beam: 230, speed: 1.2, basket: 'dog', face: 'deadpan' });
      A.cone(g, 128, 143, 0.05, 0.1, 190, { color: 'paper5', strength: 0.4, width: 3 });
      A.water(g, -20, 162, 360, 18, { t, amp: 0.7, dark: 0.55, color: 'slate1', gaps: 0.3, glints: 10 });
      [[13, 4], [30, 6], [64, 8], [88, 2]].forEach(([x, sd]) => A.streak(g, x, 163, 12, { t, seed: sd, color: 'amber5', strength: 0.5, width: 2 }));
      A.streak(g, 130, 163, 14, { t, seed: 5, color: 'paper6', width: 3 });
      // puddle mirroring the town's windows, kerb, cobbles
      for (let x = 150; x < 300; x += 5) A.px(g, x, 156 + (x % 3), 'slate2');
      A.ditherRect(g, 20, 164, 40, 3, 'slate1', 'amber3', 0.25);
      A.depth(g, 1.3);
      A.tree(g, -4, 184, 1.1, { tone: 'night0', t, seed: 3 });
      A.depth(g, 1);
      A.reeds(g, 276, 180, 50, 26, { t, seed: 4, tone: 'night2', dense: 0.8 });
      A.reeds(g, -8, 180, 26, 18, { t, seed: 6, tone: 'night2', dense: 0.8 });
      A.mist(g, t, 156, 20, { amount: 0.25, speed: 9, seed: 9 });
    },
  };
})();
