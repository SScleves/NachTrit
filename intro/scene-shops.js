// Level intro scene "shops": the bakker, the slager and the kaasboer, shut for the night;
// the dead still want their Tikkie paid. Key light: the cheese shop window. Loops: the hanging
// signs swinging, the zombie's phone, window flicker, mist.
(function () {
  const A = window.NRART;
  const SHOPS = [['BAKKER', 4, 'brick3'], ['SLAGER', 110, 'night4'], ['KAAS', 216, 'brick2']];
  A.scenes.shops = (g, t) => {
    A.camera(g, t, { x: 7, period: 8 }); A.key(g, 268, 110, 1);
    A.depth(g, 0);
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0'], 0, 60);
    A.depth(g, 0.7);
    SHOPS.forEach(([name, x, brick], i) => {
      A.canalHouse(g, x, 146, 100, 140, { gable: ['bell', 'step', 'neck'][i], brick, lit: 0.35, t, seed: 100 + i, door: false, hoist: true });
      A.rect(g, x + 8, 98, 84, 10, 'slate0'); A.hline(g, x + 8, 108, 84, 'slate2');
      A.text(x + 50, 106, name, 'paper5', 8, true, { align: 'center' });
      const lit = i === 2 ? 1 : 0.55;
      A.window(g, x + 10, 112, 58, 30, { lit, t, seed: x, bars: 'v', frame: 'wood1' });
      A.rect(g, x + 74, 112, 16, 30, 'wood1'); A.rect(g, x + 76, 114, 12, 26, i === 1 ? 'red1' : 'green1');
      // what's in the window
      if (i === 0) for (let k = 0; k < 5; k++) { A.ellipse(g, x + 18 + k * 10, 136, 4, 2, 'wood4'); A.hline(g, x + 16 + k * 10, 135, 4, 'wood5'); }
      if (i === 1) for (let k = 0; k < 4; k++) { A.vline(g, x + 20 + k * 12, 116, 4, 'steel3'); A.rect(g, x + 18 + k * 12, 120, 5, 8, 'red3'); A.px(g, x + 19 + k * 12, 121, 'red5'); }
      if (i === 2) for (let r = 0; r < 3; r++) for (let k = 0; k < 6 - r * 2; k++) { A.rect(g, x + 14 + r * 8 + k * 8, 136 - r * 4, 7, 3, 'cheese3'); A.hline(g, x + 14 + r * 8 + k * 8, 136 - r * 4, 7, 'cheese5'); }
      const sw = Math.round(Math.sin(t * 1.6 + i) * 1.5);
      A.hline(g, x + 92, 92, 10, 'slate1'); A.line(g, x + 98, 92, x + 98 + sw, 96, 'slate2');
      const sx = x + 93 + sw; A.rect(g, sx, 96, 11, 9, 'wood2'); A.rect(g, sx + 2, 98, 7, 5, i === 2 ? 'cheese4' : i === 1 ? 'red3' : 'wood5');
    });
    A.haze(g, -20, 0, 360, 150, { top: 0.2, bottom: 0.32, color: 'mist2' });
    A.rect(g, -20, 146, 360, 4, 'slate3'); A.hline(g, -20, 146, 360, 'slate5'); A.rect(g, -20, 150, 360, 30, 'slate1');
    A.depth(g, 1);
    A.cheeseCart(g, 290, 160, {});
    A.bollard(g, 100, 158); A.bollard(g, 210, 158);
    const z = A.zombie(g, 160, 160, { t, seed: 7, variant: 'phone', facing: 'right' });
    A.water(g, -20, 160, 360, 20, { t, amp: 0.6, dark: 0.5, color: 'slate1', gaps: 0.3, glints: 8 });
    A.say(g, z.head[0], z.head[1], 'Tikkie?', {});
    A.mist(g, t, 136, 22, { amount: 0.3, speed: 5, seed: 4 });
  };
})();
