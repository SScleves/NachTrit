// Panel 6: the only ones who still understand him are two dogs and a grammar book he never opened.
// His living room at night. Key light: the floor lamp, right. Outside the window, the dead.
// Loops: tails, blinks, the dust on the book, the eyes outside, mist past the window.
(function () {
  const A = window.NRART;
  A.panels[5] = {
    text: 'Now the only ones who still understand him are two dogs and a grammar book he never opened.',
    nl: 'Nu begrijpen alleen twee honden hem nog, en een grammaticaboek dat hij nooit heeft opengeslagen.',
    draw(g, t) {
      const TAU = Math.PI * 2, H = A.hash;
      A.camera(g, t, { x: -5, period: 8 }); A.key(g, 276, 50, 2);
      const talk = (t % 4) < 1.4;
      // ---- 1. through the window: a wet street, far gables, a mill turning the right way, the watcher
      A.depth(g, 0.3);
      A.sky(g, ['night1', 'night2', 'night3', 'mist1'], 14, 100);
      A.church(g, 100, 78, 0.45);
      A.canalHouse(g, 18, 86, 20, 38, { gable: 'bell', brick: 'night2', lit: 0.3, t, seed: 21 });
      A.canalHouse(g, 66, 86, 18, 30, { gable: 'step', brick: 'night2', lit: 0.2, t, seed: 22 });
      A.windmill(g, 46, 88, 0.62, -t * 0.4, { tone: 'night2', t });
      A.haze(g, 12, 18, 94, 70, { top: 0.35, bottom: 0.6, color: 'mist2' });
      A.rect(g, 12, 86, 94, 16, 'night2'); A.ditherRect(g, 12, 86, 94, 6, null, 'mist1', 0.35);   // the wet street
      A.lamp(g, 28, 90, { style: 'lantern', h: 34, on: true, flicker: 0.3, t });
      A.streak(g, 28, 92, 8, { t, seed: 4, strength: 0.5, color: 'amber5' });
      A.haze(g, 12, 60, 94, 40, { top: 0.1, bottom: 0.3, color: 'mist2' });
      A.depth(g, 0.55);
      const wz = A.zombie(g, 88, 106, { t, seed: 9, variant: 'hat', height: 58, hunch: 0.5, tone: 'night1', glow: 0.7 });
      A.mist(g, t, 74, 22, { amount: 0.3, speed: 6, seed: 6, color: 'mist3' });
      A.depth(g, 0.8);
      // a hand on the glass, and the eyes blinking out there
      for (let k = 0; k < 4; k++) A.px(g, 74 + k, 70 + (k & 1), 'night3');
      // ---- 2. the wall: flat night3 with a sparse stripe, panelling
      const wall = (x, y, w, h) => { A.rect(g, x, y, w, h, 'night3'); for (let xx = x - ((x % 16) + 16) % 16; xx < x + w; xx += 16) { const a = Math.max(x, xx); if (a < x + w) A.vline(g, a, y, h, 'night2'); } };
      wall(-20, 0, 34, 130); wall(106, 0, 240, 130); wall(14, 0, 92, 18); wall(14, 102, 92, 28);
      A.rect(g, -20, 108, 360, 22, 'wood1');
      for (let xx = -16; xx < 330; xx += 22) { A.rect(g, xx, 111, 18, 15, 'wood2'); A.hline(g, xx, 111, 18, 'wood3'); A.hline(g, xx, 125, 18, 'wood0'); A.vline(g, xx + 17, 111, 15, 'wood0'); }
      A.hline(g, -20, 108, 360, 'wood4'); A.hline(g, -20, 107, 360, 'wood2'); A.hline(g, -20, 128, 360, 'wood3'); A.rect(g, -20, 129, 360, 2, 'wood0');
      // window frame, mullion, sill (cold glint on the glass)
      A.rect(g, 12, 16, 94, 2, 'wood3'); A.rect(g, 12, 100, 94, 4, 'wood3'); A.hline(g, 10, 104, 98, 'wood5'); A.rect(g, 12, 16, 2, 86, 'wood3'); A.rect(g, 104, 16, 2, 86, 'wood3'); A.rect(g, 57, 16, 3, 86, 'wood3'); A.rect(g, 12, 56, 94, 2, 'wood3');
      A.vline(g, 13, 18, 82, 'wood5'); A.vline(g, 58, 18, 82, 'wood5'); A.hline(g, 14, 17, 90, 'wood5');
      A.ditherRect(g, 14, 18, 43, 38, null, 'mist5', 0.07);
      // curtains: slate, one low step
      const curtain = (x0, w) => { A.rect(g, x0, 12, w, 92, 'slate1'); for (let k = 0; k < w; k += 3) { A.vline(g, x0 + k, 14, 90, 'slate0'); A.vline(g, x0 + k + 1, 14, 90, 'slate2'); } };
      curtain(6, 8); curtain(100, 10);
      A.rect(g, 3, 10, 112, 2, 'wood3'); A.rect(g, 1, 9, 3, 4, 'wood4'); A.rect(g, 114, 9, 3, 4, 'wood4'); A.hline(g, 3, 10, 112, 'wood4');
      A.rect(g, 22, 112, 76, 14, 'steel1');
      for (let xx = 23; xx < 97; xx += 5) { A.rect(g, xx, 113, 3, 12, 'steel2'); A.vline(g, xx, 113, 12, 'steel3'); A.vline(g, xx + 2, 113, 12, 'steel0'); }
      A.hline(g, 22, 112, 76, 'steel3'); A.hline(g, 22, 126, 76, 'steel0');
      // shelf with a Delft tile instead of mountains
      A.rect(g, 150, 30, 26, 26, 'wood4'); A.rect(g, 152, 32, 22, 22, 'paper3'); A.hline(g, 150, 30, 26, 'wood6');
      A.rect(g, 153, 33, 20, 20, 'paper4'); A.rect(g, 159, 39, 8, 8, 'blue3'); A.disc(g, 163, 43, 2, 'paper4'); A.px(g, 163, 36, 'blue3'); A.px(g, 163, 50, 'blue3'); A.px(g, 156, 43, 'blue3'); A.px(g, 170, 43, 'blue3');
      A.ditherRect(g, 150, 30, 26, 26, null, 'night3', 0.45);
      A.rect(g, 196, 62, 34, 2, 'wood4'); A.hline(g, 196, 62, 34, 'wood5');
      const bk = ['slate3', 'blue3', 'paper2', 'green3', 'wood5', 'slate2'];
      for (let k = 0; k < 6; k++) { const bh = 8 + (k * 7 % 5); A.rect(g, 198 + k * 3, 62 - bh, 3, bh, bk[k]); A.vline(g, 198 + k * 3, 62 - bh, bh, 'night1'); }
      // the floor
      A.rect(g, -20, 131, 360, 50, 'wood2');
      for (let r = 0; r < 12; r++) {
        const y0 = 131 + Math.round(r * r * 0.22 + r * 2.6), h = Math.round(2.6 + r * 0.5);
        A.rect(g, -20, y0, 360, Math.max(2, h), (r & 1) ? 'wood2' : 'wood1'); A.hline(g, -20, y0, 360, 'wood0');
        for (let xx = -20 + Math.floor(H(r, 3) * 40); xx < 330; xx += 46 + Math.floor(H(r, 5) * 30)) A.vline(g, xx, y0, Math.max(2, h), 'wood0');
      }
      // ---- 3. light: the dimmer lamp, the cold window patch on the floor with the watcher cast into the room
      A.ditherRect(g, -20, 131, 360, 50, null, 'night0', 0.35);
      for (let r = 0; r < 34; r += 2) { const yy = 134 + r, x0 = 14 + r * 0.9, w = 46 - r * 0.2; A.ditherRect(g, x0, yy, w, 2, null, 'mist4', 0.2 - r * 0.003); }
      A.poly(g, [58, 138, 66, 138, 70, 152, 76, 170, 70, 170, 64, 156], 'night0');   // the watcher's long shadow
      A.disc(g, 64, 138, 2, 'night0');
      A.rect(g, 275, 56, 2, 76, 'slate1'); A.vline(g, 276, 56, 76, 'slate3'); A.rect(g, 268, 131, 16, 2, 'slate2'); A.rect(g, 270, 129, 12, 2, 'slate1');
      A.poly(g, [266, 56, 286, 56, 282, 40, 270, 40], 'amber4'); A.hline(g, 266, 56, 21, 'amber5'); A.hline(g, 270, 40, 13, 'amber2'); A.vline(g, 272, 42, 14, 'amber5'); A.vline(g, 280, 42, 14, 'amber3'); A.rect(g, 273, 56, 6, 2, 'amber6');
      A.glow(g, 276, 56, 80, { ry: 64, color: 'amber4', strength: 0.26, power: 1.2 });
      A.cone(g, 277, 54, Math.PI / 2, 0.5, 80, { color: 'amber5', strength: 0.16, width: 20 });
      // the sofa
      A.depth(g, 1);
      const SX = 120, SW = 144;
      A.rect(g, SX, 90, SW, 42, 'teal2'); A.rect(g, SX, 90, SW, 3, 'teal3'); A.hline(g, SX, 90, SW, 'teal4');
      for (let xx = SX + 6; xx < SX + SW - 6; xx += 24) { A.vline(g, xx, 94, 24, 'teal1'); for (let yy = 98; yy < 116; yy += 9) A.px(g, xx + 12, yy, 'teal3'); }
      A.ditherRect(g, SX, 94, SW, 28, null, 'teal1', 0.4);
      A.rect(g, SX - 8, 102, 12, 32, 'teal3'); A.rect(g, SX - 8, 102, 12, 2, 'teal4'); A.rect(g, SX + SW - 4, 102, 12, 32, 'teal3'); A.rect(g, SX + SW - 4, 102, 12, 2, 'teal4');
      A.rect(g, SX + 4, 118, SW - 8, 11, 'teal3'); A.hline(g, SX + 4, 118, SW - 8, 'teal4'); A.vline(g, SX + 76, 119, 10, 'teal1'); A.hline(g, SX + 4, 128, SW - 8, 'teal1');
      A.rect(g, SX - 6, 134, 4, 5, 'wood1'); A.rect(g, SX + SW + 2, 134, 4, 5, 'wood1');
      A.rect(g, SX + 108, 102, 16, 14, 'teal2'); A.hline(g, SX + 108, 102, 16, 'teal4'); A.vline(g, SX + 123, 103, 13, 'teal1');   // a teal cushion
      A.shadow(g, SX + SW / 2, 139, 80, 3, 0.6);
      // the rug: night slate
      A.ellipse(g, 160, 164, 100, 15, 'night2'); A.ellipse(g, 160, 164, 94, 12, 'night3'); A.ellipse(g, 160, 164, 70, 8, 'night2');
      A.ditherRect(g, 100, 158, 120, 12, null, 'night4', 0.12);
      // the man: seated on the sofa, side view, pointing at the book; the dogs lean in on him
      A.man(g, 218, 134, { t, facing: 'left', pose: 'sit', floor: 14, face: talk ? 'talk' : 'deadpan', arm: 'point' });
      const tilt = talk ? 1 : 0;
      A.dog(g, 196, 121 - tilt, { t, coat: 'black', pose: 'sit', facing: 'right', look: 'up', seed: 5 });
      A.dog(g, 196, 150 - tilt, { t, coat: 'brown', pose: 'sit', facing: 'right', look: 'up', seed: 2 });
      // ---- 4. the table and the book, big and hot
      A.shadow(g, 112, 176, 56, 3, 0.5);
      A.rect(g, 60, 156, 104, 5, 'wood4'); A.hline(g, 60, 156, 104, 'wood6'); A.hline(g, 60, 160, 104, 'wood1');
      A.rect(g, 66, 161, 5, 18, 'wood2'); A.rect(g, 152, 161, 5, 18, 'wood2'); A.vline(g, 66, 161, 18, 'wood4'); A.vline(g, 152, 161, 18, 'wood4');
      const pulse = 0.5 + 0.5 * Math.sin(t * TAU / 4);
      A.glow(g, 100, 152, 56, { ry: 28, color: 'amber5', strength: 0.22 + 0.18 * pulse, power: 1.2 });
      A.hline(g, 76, 158, 22, 'amber5'); A.hline(g, 80, 159, 14, 'amber3');   // the lacquer reflection, a short smear
      // the grammar book, 3/4: cover top, page block, gold band, dust, price sticker
      const bx = 82, by = 147, lift = (t % 6) < 0.5 ? 1 : 0;
      A.rect(g, bx, by + 6, 40, 3, 'paper4'); A.hline(g, bx, by + 7, 40, 'paper3'); A.hline(g, bx, by + 8, 40, 'wood1');
      A.poly(g, [bx + 3, by, bx + 40, by, bx + 40, by + 6, bx, by + 6], 'blue3'); A.hline(g, bx, by + 6, 41, 'blue4');
      A.hline(g, bx + 3, by, 37, 'blue5'); A.rect(g, bx + 8, by + 2, 20, 2, 'amber6'); A.hline(g, bx + 8, by + 2, 20, 'amber8'); A.px(g, bx + 11, by + 3, 'blue3'); A.px(g, bx + 16, by + 3, 'blue3'); A.px(g, bx + 21, by + 3, 'blue3');
      A.rect(g, bx + 32, by + 3, 4, 2, 'cheese5'); A.px(g, bx + 33, by + 4, 'wood3');   // price sticker, still on
      A.ditherRect(g, bx + 2, by, 38, 6, null, 'mist5', 0.22);   // dust
      if (lift) { A.hline(g, bx + 34, by - 1, 6, 'blue5'); A.px(g, bx + 40, by, 'paper5'); }
      A.ellipse(g, bx + 18, by + 6, 6, 1, 'wood3');
      // the cup stands ON the book as a coaster, a ring stain beside it
      A.rect(g, bx + 26, by - 5, 7, 6, 'paper5'); A.hline(g, bx + 26, by - 5, 7, 'paper6'); A.rect(g, bx + 33, by - 4, 2, 3, 'paper4'); A.hline(g, bx + 27, by - 4, 5, 'wood3');
      for (let i = 0; i < 4; i++) { const ph = (t / 3 + i / 4) % 1; A.px(g, bx + 29 + Math.sin(ph * TAU * 1.5 + i) * 2, by - 7 - ph * 14, ph < 0.55 ? 'mist6' : 'mist4'); }
      A.glow(g, bx + 16, by + 2, 20, { ry: 8, color: 'amber7', strength: 0.2 + 0.2 * pulse, power: 1.2 });
      A.streak(g, bx + 14, 160, 5, { t, seed: 8, strength: 0.3 + 0.2 * pulse, color: 'amber6' });
      // dust in the lamp light
      for (let i = 0; i < 14; i++) { const ph = (t * 0.12 + H(i, 1)) % 1, dx = 276 + (H(i, 2) - 0.5) * 70 + Math.sin(t * 0.8 + i) * 3, dy = 50 + ph * 90; A.px(g, dx, dy, ph < 0.8 ? 'amber5' : 'amber3'); }
      A.depth(g, 1);
      A.glow(g, 160, 90, 190, { ry: 120, mode: 'mul', color: 'black', strength: 0.4, power: 0.8, q: 4 });
    },
  };
})();
