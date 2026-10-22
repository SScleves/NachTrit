// Panel 6: the only ones who still understand him are two dogs and a grammar book he never opened.
// His living room at night. Key light: the floor lamp, right. Outside the window, the dead.
// Loops: tails, blinks, the dust on the book, the eyes outside, mist past the window.
(function () {
  const A = window.NRART;
  A.panels[5] = {
    text: 'Now the only ones who still understand him are two dogs and a grammar book he never opened.',
    nl: 'Nu begrijpen alleen twee honden hem nog, en een grammaticaboek dat hij nooit heeft opengeslagen.',
    draw(g, t) {
      A.camera(g, t, { x: -5, period: 8 }); A.key(g, 282, 52, 2);
      // through the window: night, mist, a changed neighbour looking in
      A.depth(g, 0.3);
      A.sky(g, ['night1', 'night2', 'night3', 'mist0'], 0, 130);
      A.canalHouse(g, 18, 110, 34, 90, { gable: 'bell', brick: 'night3', lit: 0.3, t, seed: 21 });
      A.canalHouse(g, 54, 110, 30, 84, { gable: 'step', brick: 'night3', lit: 0.2, t, seed: 22 });
      A.zombie(g, 74, 110, { t, seed: 9, facing: 'left', tone: 'night1', height: 44 });
      A.haze(g, 0, 10, 130, 100, { top: 0.35, bottom: 0.55, color: 'mist2' });
      A.mist(g, t, 60, 30, { amount: 0.4, speed: 6, seed: 6, color: 'mist3' });
      // the room: wallpaper around the window
      A.depth(g, 0.8);
      const wall = (x, y, w, h) => { A.rect(g, x, y, w, h, 'night3'); for (let xx = x - ((x % 8) + 8) % 8; xx < x + w; xx += 8) A.ditherRect(g, Math.max(x, xx), y, Math.min(2, x + w - Math.max(x, xx)), h, null, 'night2', 0.5); };
      wall(-20, 0, 34, 130); wall(106, 0, 240, 130); wall(14, 0, 92, 18); wall(14, 102, 92, 28);
      A.rect(g, 12, 16, 94, 2, 'wood2'); A.rect(g, 12, 100, 94, 3, 'wood2'); A.rect(g, 12, 16, 2, 86, 'wood2'); A.rect(g, 104, 16, 2, 86, 'wood2'); A.rect(g, 58, 16, 2, 86, 'wood2');
      A.rect(g, 6, 12, 10, 92, 'brick2'); A.rect(g, 102, 12, 10, 92, 'brick2');
      A.rect(g, -20, 130, 360, 50, 'wood1'); for (let y = 134; y < 180; y += 6) A.hline(g, -20, y, 360, 'wood0');
      // the sofa
      A.rect(g, 128, 92, 112, 40, 'brick2'); A.rect(g, 128, 92, 112, 2, 'brick3'); A.rect(g, 120, 104, 12, 30, 'brick3'); A.rect(g, 236, 104, 12, 30, 'brick3');
      A.rect(g, 132, 118, 104, 10, 'brick3'); A.rect(g, 132, 118, 104, 1, 'brick4'); A.rect(g, 128, 132, 4, 4, 'wood0'); A.rect(g, 236, 132, 4, 4, 'wood0');
      // the floor lamp
      A.rect(g, 280, 54, 2, 80, 'slate1'); A.rect(g, 275, 132, 12, 2, 'slate1');
      A.poly(g, [272, 54, 291, 54, 287, 42, 276, 42], 'amber5'); A.hline(g, 272, 54, 20, 'amber7'); A.hline(g, 276, 42, 12, 'amber4');
      A.glow(g, 281, 58, 120, { ry: 90, color: 'amber5', strength: 0.32, power: 1.1 });
      A.cone(g, 281, 54, Math.PI / 2, 0.55, 80, { color: 'amber6', strength: 0.2, width: 18 });
      A.depth(g, 1);
      A.man(g, 184, 120, { t, facing: 'front', pose: 'sit', floor: 14 });
      // the coffee table, the book
      A.rect(g, 96, 146, 70, 3, 'wood3'); A.hline(g, 96, 146, 70, 'wood5'); A.rect(g, 100, 149, 3, 16, 'wood1'); A.rect(g, 159, 149, 3, 16, 'wood1');
      A.book(g, 124, 146, { t, w: 18 });
      A.dog(g, 70, 168, { t, coat: 'brown', pose: 'sit', look: 'up', seed: 2 });
      A.dog(g, 248, 172, { t, coat: 'black', pose: 'lie', facing: 'left', seed: 5 });
      A.glow(g, 0, 180, 120, { mode: 'mul', color: 'black', strength: 0.5, power: 0.8 });
    },
  };
})();
