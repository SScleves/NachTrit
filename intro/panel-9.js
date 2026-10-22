// Panel 9: "..." Nothing is said. The dark room; the window the only light; the dead outside
// looking in; the dogs' eyes catching it; his jacket the one warm edge in the dark.
// Key light: the window, upper left. Loops: blinking eyes (dogs and dead), mist past the glass.
(function () {
  const A = window.NRART;
  A.panels[8] = {
    text: '...',
    nl: '...',
    draw(g, t) {
      A.camera(g, t, { x: 4, period: 8 }); A.key(g, 80, 50, 2);
      A.depth(g, 0.3);
      A.sky(g, ['night1', 'night2', 'night3', 'mist0'], 20, 112);
      A.canalHouse(g, 44, 116, 30, 80, { gable: 'step', brick: 'night3', lit: 0, t, seed: 41 });
      for (let i = 0; i < 3; i++) A.zombie(g, 62 + i * 20, 118, { t: t + i, seed: 12 + i, facing: i === 1 ? 'right' : 'left', tone: 'night0', height: 42 + i * 3, glow: 0.5 });
      A.haze(g, 40, 20, 90, 92, { top: 0.25, bottom: 0.45, color: 'mist1' });
      A.mist(g, t, 70, 30, { amount: 0.45, speed: 4, seed: 3, color: 'mist2' });
      A.depth(g, 0.8);
      A.rect(g, -20, -10, 60, 200, 'night0'); A.rect(g, 128, -10, 220, 200, 'night0'); A.rect(g, 40, -10, 88, 30, 'night0'); A.rect(g, 40, 112, 88, 80, 'night0');
      A.rect(g, 40, 20, 88, 2, 'night1'); A.rect(g, 40, 64, 88, 2, 'night1'); A.rect(g, 83, 20, 2, 92, 'night1'); A.rect(g, 38, 110, 92, 3, 'night2');
      A.cone(g, 84, 66, 0.95, 0.42, 150, { color: 'mist3', strength: 0.22, width: 60, fade: 1.4 });
      A.depth(g, 1);
      A.man(g, 186, 150, { t, facing: 'left', pose: 'sit', floor: 8, rim: 2 });
      A.tint(g, 150, 100, 80, 70, 'night0', 0.55, 'mix');
      A.dog(g, 134, 166, { t, coat: 'black', pose: 'lie', facing: 'right', seed: 4, rim: 1 });
      A.dog(g, 238, 164, { t, coat: 'brown', pose: 'sit', facing: 'left', seed: 9, rim: 1 });
      A.tint(g, 110, 140, 150, 40, 'night0', 0.5, 'mix');
      [[148, 159, 3.3], [228, 145, 4.6]].forEach(([x, y, per], i) => { if ((t + i) % per > 0.15) { A.px(g, x, y, 'paper5'); A.px(g, x - 3, y, 'paper3'); } });
    },
  };
})();
