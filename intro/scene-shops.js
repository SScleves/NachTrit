// Level intro scene "shops": the bakker, the slager and the kaasboer, shut for the night;
// the dead still want their Tikkie paid. Key light: the cheese shop window. Loops: the hanging
// signs swinging, the zombie's phone, window flicker, mist, the windmill turning, the cat blinking.
(function () {
  const A = window.NRART;
  const SHOPS = [
    { name: 'BAKKER', x: 4, w: 100, h: 108, brick: 'brick3', gable: 'bell', aw: ['red3', 'paper4'] },
    { name: 'SLAGER', x: 108, w: 100, h: 98, brick: 'night4', gable: 'step', aw: ['green2', 'paper4'] },
    { name: 'KAAS', x: 212, w: 108, h: 106, brick: 'brick2', gable: 'neck', aw: ['cheese3', 'paper5'] },
  ];
  const GY = 140, WY = 150; // shopfront ground, kerb
  function awning(g, x, w, c, t, i) {
    const y = 109, sway = Math.round(Math.sin(t * 0.9 + i * 2) * 0.5);
    for (let k = 0; k < w; k++) {
      const col = (k >> 2) & 1 ? c[1] : c[0];
      const drop = 8 + ((k >> 2) & 1 ? 0 : 0) + (((k & 3) === 0 || (k & 3) === 3) ? -1 : 0);
      A.vline(g, x + k, y + Math.round(k * 0.0), drop, col);
      A.px(g, x + k, y, 'night0');
    }
    A.hline(g, x, y + 1, w, 'paper6');
    A.ditherRect(g, x, y + 2, w, 5, null, 'night0', 0.2);
    A.hline(g, x, y + 8 + sway, w, 'night0');
    A.ditherRect(g, x + 2, y + 9, w - 4, 7, null, 'night0', 0.55);
  }
  A.scenes.shops = (g, t) => {
    A.camera(g, t, { x: 7, period: 8 }); A.key(g, 268, 110, 2);
    // ---- layer 0: sky and the far town
    A.depth(g, 0);
    A.sky(g, ['night1', 'night2', 'night3', 'mist1', 'mist2', 'mist2'], 0, 90, { blend: 10 });
    A.stars(g, t, { n: 22, seed: 3, y1: 40 });
    A.depth(g, 0.18);
    A.church(g, 160, 80, 1.0, { tone: 'night2' });
    A.windmill(g, 96, 90, 0.95, -t * 0.45, { tone: 'night2', stage: true, t, lit: 0.6 });
    A.haze(g, -20, 0, 360, 100, { top: 0.1, bottom: 0.4, color: 'mist2' });
    A.depth(g, 0.4);
    // the far roofs behind the shops
    [[-20, 40, 70, 'roof'], [150, 36, 66, 'step'], [180, 30, 62, 'roof'], [300, 40, 70, 'roof']].forEach(([x, w, h, gb], i) =>
      A.canalHouse(g, x, 132, w, h, { gable: gb, lit: 0, t, seed: 40 + i, brick: 'night2' }));
        A.mist(g, t, 70, 24, { amount: 0.3, speed: 3, seed: 9, color: 'mist2' });
    // ---- layer 1: the three shops
    A.depth(g, 0.75);
    SHOPS.forEach((s, i) => {
      const { x, w } = s;
      A.canalHouse(g, x, GY + 6, w, s.h + 6, { gable: s.gable, brick: s.brick, lit: 0.2, t, seed: 100 + i, door: false, hoist: true });
      A.rect(g, x, 96, w, GY - 96, s.brick); A.brick(g, x, 96, w, GY - 96, { base: s.brick, only: s.brick, seed: 50 + i, bw: 5 });
      A.rect(g, x, GY - 2, w, 2, 'slate2'); A.rect(g, x, GY, w, 2, 'night0');
      // fascia with the name
      A.rect(g, x + 8, 97, w - 16, 11, 'night0'); A.hline(g, x + 8, 97, w - 16, 'wood3'); A.hline(g, x + 8, 107, w - 16, 'wood3');
      A.vline(g, x + 8, 97, 11, 'wood3'); A.vline(g, x + w - 9, 97, 11, 'wood3');
      A.text(x + w / 2, 105, s.name, i === 2 ? 'cheese5' : 'paper6', 8, true, { align: 'center' });
      // display window
      const wx = x + 10, ww = w - 36, wy = 117, wh = 20;
      A.rect(g, wx - 2, wy - 2, ww + 4, wh + 4, 'wood1');
      A.rect(g, wx, wy, ww, wh, 'amber4');
      A.rect(g, wx, wy, ww, 6, i === 2 ? 'amber5' : 'amber4'); A.rect(g, wx, wy + 6, ww, wh - 6, i === 2 ? 'amber6' : 'amber5');
      A.vline(g, wx + (ww >> 1), wy, wh, 'wood1');
      A.rect(g, wx - 3, wy + wh + 2, ww + 6, 2, 'wood3'); A.hline(g, wx - 3, wy + wh + 2, ww + 6, 'wood4');
      A.rect(g, wx - 1, wy + wh + 4, ww + 2, 4, 'wood1');
      for (let k = 0; k < 4; k++) A.rect(g, wx - 1 + k * 20, wy + wh + 4, 1, 4, 'wood0');
      A.rect(g, wx, wy + 11, ww, 1, 'wood2'); // shelf
      // door
      const dx = x + w - 22;
      A.rect(g, dx - 1, 112, 16, 28, 'wood1'); A.rect(g, dx + 1, 114, 12, 26, i === 1 ? 'red1' : i === 0 ? 'green1' : 'blue1');
      A.rect(g, dx + 1, 114, 12, 6, 'amber4'); A.ditherRect(g, dx + 1, 117, 12, 3, null, 'amber6', 0.5);
      A.vline(g, dx + 7, 114, 6, 'wood1'); A.px(g, dx + 11, 128, 'cheese4');
      A.rect(g, dx - 2, GY - 2, 18, 2, 'slate3'); A.rect(g, dx - 3, GY, 20, 2, 'slate2');
      // contents
      if (i === 0) {
        for (let k = 0; k < 5; k++) { A.ellipse(g, wx + 6 + k * 8, wy + 9, 4, 2, 'wood4'); A.hline(g, wx + 4 + k * 8, wy + 8, 4, 'wood5'); A.px(g, wx + 6 + k * 8, wy + 8, 'wood2'); }
        A.rect(g, wx + 6, wy + 14, 14, 5, 'paper3'); A.hline(g, wx + 6, wy + 14, 14, 'paper6'); A.px(g, wx + 12, wy + 12, 'red4'); A.rect(g, wx + 12, wy + 13, 1, 1, 'red5');
        for (let k = 0; k < 6; k++) { A.ellipse(g, wx + 26 + k * 6, wy + 17, 3, 2, 'wood5'); A.px(g, wx + 26 + k * 6, wy + 16, 'amber7'); }
        // cat silhouette
        A.rect(g, wx + 44, wy + 3, 5, 5, 'night0'); A.px(g, wx + 44, wy + 2, 'night0'); A.px(g, wx + 48, wy + 2, 'night0');
        if (((t + 1.3) % 4.2) > 0.2) { A.px(g, wx + 45, wy + 4, 'eye4'); A.px(g, wx + 47, wy + 4, 'eye4'); }
      }
      if (i === 1) {
        A.hline(g, wx, wy + 1, ww, 'steel2');
        for (let k = 0; k < 8; k++) { const hx = wx + 5 + k * 6; A.vline(g, hx, wy + 1, 3, 'steel3'); A.rect(g, hx - 1, wy + 4, 3, 5, k % 3 === 0 ? 'red2' : 'red3'); A.px(g, hx - 1, wy + 4, 'red5'); }
        for (let k = 0; k < 3; k++) { A.ellipse(g, wx + 10 + k * 14, wy + 16, 5, 3, 'red3'); A.px(g, wx + 8 + k * 14, wy + 15, 'red5'); A.px(g, wx + 11 + k * 14, wy + 14, 'paper3'); }
        for (let k = 0; k < 9; k++) A.px(g, wx + 4 + k * 5, wy + 12 + (k & 1), 'green3');
      }
      if (i === 2) {
        for (let r = 0; r < 4; r++) for (let k = 0; k < 6 - r; k++) { const cx = wx + 5 + r * 4 + k * 8, cy = wy + 17 - r * 4; A.rect(g, cx, cy, 7, 3, 'cheese3'); A.hline(g, cx, cy, 7, 'cheese5'); A.px(g, cx + 6, cy + 2, 'cheese2'); A.px(g, cx + 2, cy + 1, 'cheese2'); }
        A.poly(g, [wx + ww - 12, wy + 18, wx + ww - 3, wy + 18, wx + ww - 3, wy + 10], 'cheese4'); A.px(g, wx + ww - 6, wy + 15, 'cheese2');
      }
      awning(g, wx - 4, ww + 8, s.aw, t, i);
      // warm light thrown on the pavement by the window
      A.glow(g, wx + ww / 2, GY + 2, ww * 0.9, { ry: 14, color: i === 2 ? 'cheese5' : 'amber5', strength: i === 2 ? 0.5 : 0.3, power: 1.1 });
      A.glow(g, wx + ww / 2, 126, ww * 0.8, { ry: 20, color: 'amber5', strength: 0.2 * (i === 2 ? 1.4 : 1), power: 1.2, q: 4 });
      // hanging sign on its bracket: loop 1
      const bx = x + w - 3, sw = Math.round(Math.sin(t * 1.6 + i * 1.7) * 1.5);
      A.hline(g, bx - 9, 88, 10, 'slate1'); A.px(g, bx - 9, 89, 'slate1'); A.line(g, bx - 3, 88, bx - 3 + sw, 92, 'slate2'); A.line(g, bx - 8, 88, bx - 8 + sw, 92, 'slate2');
      const sx = bx - 11 + sw; A.rect(g, sx, 92, 11, 9, 'wood2'); A.rect(g, sx + 1, 93, 9, 7, 'wood1'); A.rect(g, sx + 2, 94, 7, 5, i === 2 ? 'cheese4' : i === 1 ? 'red3' : 'wood5');
    });
    // neon OPEN that has been dead for years, loop: flicker
    A.haze(g, -20, 60, 360, 90, { top: 0.0, bottom: 0.22, color: 'mist1', lights: 0.6 });
    // ---- pavement and wet street
    A.depth(g, 1);
    A.rect(g, -20, GY, 380, WY - GY, 'slate2');
    A.ditherGradient(g, -20, GY, 380, WY - GY, 'slate3', 'slate1', 'down');
    for (let k = 0; k < 90; k++) { const px = ((k * 37) % 360) - 20, py = GY + 1 + ((k * 13) % (WY - GY - 2)); A.px(g, px, py, k & 1 ? 'slate4' : 'slate1'); }
    for (let k = -20; k < 340; k += 12) A.vline(g, k, GY + 4, WY - GY - 4, 'slate1');
    A.hline(g, -20, WY - 1, 380, 'slate5'); A.hline(g, -20, WY, 380, 'night0');
    // lamp posts between the shops
    A.bollard(g, 62, WY); A.bollard(g, 154, WY); A.bollard(g, 262, WY - 0);
    A.omafiets(g, 112, WY - 1, { rider: false, t, basket: 'cheese' });
    A.zombie(g, 82, WY - 1, { t, seed: 3, variant: 'bonnet', facing: 'right', tone: 'night3' });
    A.tulips(g, 22, GY, 26, { t, seed: 5 });
    A.cheeseCart(g, 300, WY - 1, {});
    // the zombie, feet on the kerb so the wet street reflects him
    A.depth(g, 1);
    A.glow(g, 196, WY - 34, 34, { ry: 40, color: 'amber5', strength: 0.4, power: 1.1, q: 4 });
    const z = A.zombie(g, 192, WY - 1, { t, seed: 7, variant: 'phone', facing: 'right' });
    A.glow(g, 192, WY - 40, 18, { ry: 12, color: 'phone4', strength: 0.18 + 0.1 * Math.sin(t * 3.1), power: 1.3, q: 4 });
    A.lamp(g, 106, WY - 1, { style: 'lantern', h: 62, t, seed: 1, flicker: 0.25, reach: 56, cone: 0.28 });
    A.lamp(g, 214, WY - 1, { style: 'lantern', h: 62, t, seed: 2, reach: 56, cone: 0.3 });
    // wet street reflecting everything above
    A.water(g, -20, WY + 1, 380, 31, { t, amp: 0.5, dark: 0.55, color: 'slate1', gaps: 0.3, glints: 8, stretch: 1.5 });
    A.rect(g, -20, 178, 380, 2, 'night0');
    A.streak(g, 106, WY + 3, 24, { t, seed: 1, color: 'amber6' }); A.streak(g, 214, WY + 3, 24, { t, seed: 2, color: 'amber6' });
    A.say(g, z.head[0], z.head[1], 'Tikkie?', {});
    A.mist(g, t, 146, 18, { amount: 0.28, speed: 5, seed: 4 });
  };
})();
