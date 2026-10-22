// Panel 5: two years here and he never practised; everyone was so nice about it.
// Before the mist: a café terrace on a mild evening, the warmest panel of the intro.
// Key light: the café window, left. Loops: blinks, the friend talking, a flickering lamp, mist.
(function () {
  const A = window.NRART;
  A.panels[4] = {
    text: 'Two years here and he never practised. Everyone spoke English. Everyone was so nice about it.',
    nl: 'Twee jaar hier en nooit geoefend. Iedereen sprak Engels. Iedereen deed er zo aardig over.',
    draw(g, t) {
      A.camera(g, t, { x: 5, period: 8 }); A.key(g, 60, 70, 1);
      A.depth(g, 0);
      A.sky(g, ['night3', 'night4', 'night5', 'night6', 'mist1'], 0, 70);
      A.depth(g, 0.6);
      // the café: brick front, a big lit window, a striped awning
      A.rect(g, -20, 0, 250, 150, 'brick3'); A.brick(g, -20, 0, 250, 150, { base: 'brick3', only: 'brick3', seed: 4 });
      A.window(g, 8, 70, 92, 54, { lit: 1, t, seed: 3, bars: 'cross', frame: 'wood1', glow: 0.2 });
      for (let i = 0; i < 5; i++) A.rect(g, 16 + i * 18, 100, 8, 3, 'wood2');
      A.window(g, 116, 22, 18, 28, { lit: 1, t, seed: 4, frame: 'paper2' }); A.window(g, 152, 22, 18, 28, { lit: 0, t, frame: 'paper2' });
      A.rect(g, 0, 56, 210, 8, 'red3'); for (let x = 0; x < 210; x += 12) A.rect(g, x, 56, 6, 8, 'paper4');
      for (let x = 0; x < 210; x += 6) A.px(g, x + 2, 64, x % 12 ? 'paper3' : 'red2');
      A.text(150, 92, 'CAFÉ', 'amber7', 10, true, { align: 'center', shadow: true });
      A.rect(g, 230, 0, 120, 150, 'night4'); A.brick(g, 230, 0, 120, 150, { base: 'night4', only: 'night4', seed: 8 });
      A.windows(g, 244, 20, { cols: 3, rows: 3, w: 10, h: 16, gx: 10, gy: 10, lit: 0.5, t, seed: 6 });
      A.rect(g, -20, 150, 360, 30, 'slate2'); for (let y = 152; y < 180; y += 4) for (let x = -20 + (y % 8); x < 340; x += 8) A.hline(g, x, y, 6, 'slate3');
      A.depth(g, 1);
      A.glow(g, 54, 150, 70, { ry: 10, color: 'amber5', strength: 0.3 });
      A.omafiets(g, 40, 160, { t, facing: 'right', basket: null });
      A.lamp(g, 300, 160, { t, style: 'lantern', h: 40, flicker: 0.04 });
      // the terrace table and two beers
      A.rect(g, 150, 136, 30, 3, 'wood3'); A.hline(g, 150, 136, 30, 'wood5'); A.rect(g, 163, 139, 3, 20, 'wood1'); A.rect(g, 158, 158, 13, 2, 'wood1');
      A.rect(g, 155, 129, 4, 7, 'cheese4'); A.rect(g, 155, 129, 4, 1, 'paper6'); A.rect(g, 170, 130, 4, 6, 'cheese4'); A.rect(g, 170, 130, 4, 1, 'paper6');
      A.man(g, 128, 160, { t, facing: 'right', face: 'talk' });
      const f = A.friend(g, 200, 160, { t, face: 'talk', arm: 'drink' });
      A.say(g, 134, 116, 'Hoi!', {});
      A.say(g, f.head[0], f.head[1], 'Oh, English is fine!', { dx: 20 });
      A.mist(g, t, 150, 16, { amount: 0.2, speed: 4, seed: 3 });
    },
  };
})();
