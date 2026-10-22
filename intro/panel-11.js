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
      A.camera(g, t, { x: 10, period: 8 }); A.key(g, 320, 120, 2);
      A.depth(g, 0);
      A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0', 'mist1'], 0, 140);
      A.depth(g, 0.25);
      A.windmill(g, 250, 130, 0.62, -t * 0.5, { tone: 'night3', t, seed: 2 });
      A.church(g, 170, 130, 0.7, { tone: 'night3' });
      for (let x = -20; x < 340; x += 6) A.disc(g, x, 128 - Math.round(A.hash(x, 5) * 3), 2 + Math.round(A.hash(x, 6) * 2), 'night3');
      A.rect(g, -20, 128, 360, 8, 'night3');
      A.haze(g, -20, 40, 360, 100, { top: 0.35, bottom: 0.7, color: 'mist2' });
      // the dead waiting in the road, in fog, eyes first
      A.depth(g, 0.55);
      A.rect(g, -20, 136, 360, 8, 'night2');
      [[210, 34, 1], [236, 30, 2], [262, 38, 3], [292, 28, 4], [312, 36, 5]].forEach(([x, h, s]) => A.zombie(g, x, 144, { t, seed: s + 20, facing: 'left', tone: 'night1', height: h, glow: 0.45 }));
      A.lamp(g, 40, 144, { t, style: 'modern', h: 34, flicker: 0.05, seed: 3 });
      A.haze(g, -20, 60, 360, 86, { top: 0.2, bottom: 0.5, color: 'mist2' });
      A.mist(g, t, 118, 24, { amount: 0.45, speed: 5, seed: 7, color: 'mist3' });
      A.depth(g, 1);
      A.rect(g, -20, 144, 360, 36, 'slate1'); for (let x = -20; x < 340; x += 18) A.hline(g, x, 151, 8, 'slate3');
      A.omafiets(g, 96, 158, { t, rider: true, beam: 230, speed: 1.2, basket: 'dog', face: 'deadpan' });
      A.water(g, -20, 160, 360, 20, { t, amp: 0.6, dark: 0.5, color: 'slate1', gaps: 0.3, glints: 10 });
      A.streak(g, 122, 162, 16, { t, seed: 5, color: 'paper6', width: 3 });
      A.mist(g, t, 146, 20, { amount: 0.25, speed: 9, seed: 9 });
    },
  };
})();
