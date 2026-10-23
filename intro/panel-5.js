// Panel 5: two years here and he never practised; everyone was so nice about it.
// Before the mist: a café terrace on a wet, mild evening, the warmest panel of the intro. Right third opens onto a canal.
// Beat: 0..1.1 "Hoi!" alone; 1.1..1.4 blink; 1.4+ "Oh, English is fine!" and the whole café beams.
// Loops: pendant sway, candle flicker, steam, far mill sails (anticlockwise), mist, blinks and talk, a waving patron.
(function () {
  const A = window.NRART;
  const H = A.hash;
  function steam(g, x, y, t, seed) {
    for (let i = 0; i < 5; i++) {
      const k = ((t * 0.8 + i / 5 + seed * 0.13) % 1), yy = y - k * 9, xx = x + Math.sin(k * 6 + i + seed) * 1.5;
      if (k < 0.85) A.px(g, xx, yy, k < 0.4 ? 'mist6' : 'mist4');
    }
  }
  function cobbles(g, x, y, w, h, base) {
    A.rect(g, x, y, w, h, base);
    for (let r = 0; r < h; r += 3) for (let c = -8; c < w; c += 6) {
      const xx = x + c + ((r / 3) & 1 ? 3 : 0), v = H(c + 50, r);
      A.hline(g, xx, y + r + 2, 6, 'slate1'); A.vline(g, xx, y + r, 3, 'slate1');
      if (v < 0.3) A.hline(g, xx + 1, y + r, 4, 'slate5'); else if (v < 0.5) A.hline(g, xx + 1, y + r, 3, 'slate4');
    }
  }
  function pendant(g, x, t, seed) {
    const sway = Math.round(Math.sin(t * Math.PI * 2 / 4 + seed));
    A.vline(g, x, 69, 18, 'wood1');
    A.poly(g, [x - 4 + sway, 94, x + 4 + sway, 94, x + 2 + sway, 88, x - 2 + sway, 88], 'wood3');
    A.hline(g, x - 3 + sway, 94, 7, 'amber8');
  }
  // the barman, drawn locally: white shirt, apron, a polite smile
  function barman(g, x, y, t) {
    A.rect(g, x - 7, y - 20, 14, 20, 'paper4'); A.rect(g, x - 5, y - 12, 10, 12, 'paper3'); A.vline(g, x - 7, y - 20, 20, 'paper2');
    A.rect(g, x - 2, y - 20, 4, 2, 'red3');
    A.rect(g, x - 3, y - 29, 6, 8, 'skin4'); A.rect(g, x - 4, y - 31, 8, 3, 'wood1'); A.rect(g, x - 4, y - 28, 1, 2, 'wood1');
    A.px(g, x - 2, y - 26, 'night1'); A.px(g, x + 1, y - 26, 'night1');
    A.hline(g, x - 1, y - 23, 3, 'red3'); A.px(g, x - 2, y - 24, 'red3'); A.px(g, x + 2, y - 24, 'red3');
    const w = Math.sin(t * 5) > 0 ? 0 : 1;
    A.rect(g, x + 7, y - 17 - w, 2, 6, 'paper3'); A.rect(g, x + 7, y - 19 - w, 2, 2, 'skin4');
  }
  A.panels[4] = {
    text: 'Two years here and he never practised. Everyone spoke English. Everyone was so nice about it.',
    nl: 'Twee jaar hier en nooit geoefend. Iedereen sprak Engels. Iedereen deed er zo aardig over.',
    draw(g, t) {
      const T1 = 1.1, T2 = 1.4, nice = t >= T2;                 // 'Hoi!' alone, then the deflation
      A.camera(g, t, { x: 5, period: 8 }); A.key(g, 60, 100, 1);
      // ---- sky and far town (layers 0, 0.25, 0.5): only the right third, where the wall opens
      A.depth(g, 0);
      A.sky(g, ['night2', 'night3', 'night4', 'night5', 'mist1'], 0, 130);
      A.stars(g, t, { n: 16, h: 50 });
      A.moon(g, 272, 24, 8);
      A.depth(g, 0.25);
      A.church(g, 262, 124, 1.0);
      A.windmill(g, 306, 124, 0.6, -t * Math.PI * 2 / 16, { tone: 'night3', t });
      for (let i = 0; i < 4; i++) A.canalHouse(g, 214 + i * 30, 126, 28, 40 + (i % 3) * 8, { gable: ['bell', 'step', 'neck', 'spout'][i], brick: 'night3', lit: 0.15, t, seed: i + 20 });
      A.haze(g, 214, 70, 140, 60, { top: 0.4, bottom: 0.8, color: 'mist2' });
      A.depth(g, 0.5);
      for (let i = 0; i < 4; i++) A.canalHouse(g, 216 + i * 29, 136, 27, 50 + ((i + 1) % 3) * 8, { gable: ['step', 'neck', 'bell', 'roof'][i], brick: i % 2 ? 'brick1' : 'night2', lit: 0.8, t, seed: i + 3 });
      A.haze(g, 214, 90, 140, 50, { top: 0.15, bottom: 0.5, color: 'mist1' });
      A.archBridge(g, 236, 142, 86, 14, { t });
      A.rect(g, 214, 138, 110, 16, 'night2');                  // canal, mirrored below
      A.mist(g, t, 124, 14, { amount: 0.22, speed: 3, seed: 7 });
      // ---- the café wall (0.85), only where it shows
      A.depth(g, 0.85);
      A.rect(g, -20, 0, 242, 152, 'brick2'); A.rect(g, -20, 0, 242, 40, 'brick1');
      A.ditherGradient(g, -20, 40, 242, 6, 'brick1', 'brick2', 'down');
      A.brick(g, -20, 0, 242, 152, { base: 'brick2', only: 'brick2', seed: 4 });
      A.brick(g, -20, 0, 242, 40, { base: 'brick1', only: 'brick1', seed: 4 });
      A.vline(g, 221, 0, 152, 'brick3'); A.vline(g, 222, 0, 152, 'brick1');   // the corner of the house
      A.rect(g, -20, 138, 242, 14, 'wood1'); for (let x = -20; x < 222; x += 9) A.vline(g, x, 138, 14, 'wood0'); A.hline(g, -20, 138, 242, 'wood3');
      // upper windows
      A.window(g, 40, 10, 20, 30, { lit: 1, t, seed: 4, frame: 'paper2', detail: 'cat', glow: 0.12 });
      A.window(g, 160, 12, 20, 30, { lit: 0.6, t, seed: 5, frame: 'paper2', detail: 'tulip' });
      A.window(g, 196, 12, 16, 30, { lit: 0, t, frame: 'paper2' });
      // awning: dark, so the faces lead
      A.poly(g, [-2, 40, 108, 40, 114, 54, -8, 54], 'red1');
      for (let x = -8; x < 114; x += 14) A.poly(g, [x, 40, x + 7, 40, x + 9, 54, x + 2, 54], 'paper2');
      for (let x = -8; x < 114; x += 7) A.px(g, x + 3, 55, x % 14 ? 'paper1' : 'red1');
      A.hline(g, -2, 40, 110, 'red2');
      A.rect(g, 28, 56, 56, 10, 'wood1'); A.hline(g, 28, 56, 56, 'wood2');
      A.text(56, 64, 'CAFÉ', 'amber6', 8, true, { align: 'center' });
      // big front window: flat amber bands, a warm interior full of people being kind
      A.rect(g, 3, 66, 99, 68, 'wood2'); A.rect(g, 6, 69, 93, 61, 'amber3');
      A.rect(g, 6, 88, 93, 20, 'amber4'); A.rect(g, 6, 108, 93, 22, 'amber5');
      A.ditherGradient(g, 6, 85, 93, 3, 'amber3', 'amber4', 'down'); A.ditherGradient(g, 6, 105, 93, 3, 'amber4', 'amber5', 'down');
      for (let i = 0; i < 2; i++) { A.rect(g, 10, 80 + i * 12, 86, 2, 'wood3'); for (let j = 0; j < 17; j++) A.rect(g, 11 + j * 5, 74 + i * 12 + (j & 1), 2, 6 - (j & 1), ['red3', 'green3', 'paper4', 'cheese4', 'teal3'][(i + j) % 5]); }
      barman(g, 72, 118, t);
      A.friend(g, 22, 128, { t, seed: 6, face: nice ? 'smile' : 'blink', arm: 'drink', shadow: false });
      A.friend(g, 46, 128, { t, seed: 9, face: 'smile', arm: 'wave', shadow: false });
      A.friend(g, 92, 128, { t, seed: 2, face: 'smile', arm: nice ? 'drink' : 'down', shadow: false });
      A.rect(g, 6, 118, 93, 12, 'wood2'); A.hline(g, 6, 118, 93, 'wood4');
      for (let i = 0; i < 4; i++) A.rect(g, 14 + i * 22, 115, 3, 3, 'paper5');
      A.vline(g, 51, 69, 61, 'wood2'); A.vline(g, 52, 69, 61, 'wood1');
      pendant(g, 28, t, 0); pendant(g, 76, t, 2);
      // door, dark enough that the hero stands out on brick
      A.rect(g, 110, 90, 36, 48, 'wood1'); A.rect(g, 113, 93, 30, 45, 'amber1'); A.rect(g, 113, 93, 30, 20, 'amber2');
      A.vline(g, 128, 93, 45, 'wood1'); A.hline(g, 113, 113, 30, 'wood1'); A.rect(g, 117, 98, 7, 9, 'amber4'); A.rect(g, 133, 98, 7, 9, 'amber4');
      // hanging wall lantern between the two of them, above the candle
      A.rect(g, 176, 78, 8, 10, 'amber7'); A.rect(g, 175, 77, 10, 2, 'night1'); A.rect(g, 175, 88, 10, 2, 'night1'); A.vline(g, 180, 66, 11, 'night1');
      A.glow(g, 180, 83, 34, { ry: 28, color: 'amber5', strength: 0.4, power: 1.4 });
      // window spill across the front: one glow
      A.glow(g, 54, 106, 66, { ry: 50, color: 'amber5', strength: 0.32, power: 1.3 });
      // ---- pavement and quay
      cobbles(g, -20, 150, 350, 12, 'slate3');
      A.ditherGradient(g, -20, 150, 350, 4, 'slate3', null, 'up');
      A.hline(g, -20, 162, 350, 'slate1');
      A.rect(g, 222, 150, 100, 2, 'slate4');   // quay lip
      // ---- near layer
      A.depth(g, 1);
      A.rect(g, -20, 163, 350, 20, 'night2');
      A.rect(g, 6, 148, 28, 6, 'wood2'); A.hline(g, 6, 148, 28, 'wood4'); A.tulips(g, 8, 148, 24);
      A.omafiets(g, 66, 160, { t, facing: 'right', basket: null });
      A.bollard(g, 236, 162); A.bollard(g, 262, 162); A.bollard(g, 108, 162);
      A.lamp(g, 302, 162, { t, style: 'lantern', h: 58, flicker: 0.05, reach: 56, cone: 0.3 });
      A.mist(g, t, 148, 12, { amount: 0.16, speed: 4, seed: 3 });   // behind the people
      // dogs under the table
      A.dog(g, 166, 160, { coat: 'brown', pose: 'lie', t });
      A.dog(g, 192, 160, { coat: 'golden', pose: 'lie', t, look: 'up' });
      // the friend stands behind the table; the man sits on a bistro chair in front of dark brick
      A.shadow(g, 208, 156, 11, 2, 0.8);
      const f = A.friend(g, 208, 156, { t, face: nice ? (t < 3.2 ? 'talk' : 'smile') : 'smile', arm: nice && t > 3.4 ? 'drink' : 'down' });
      const mx = 140, seat = 148;
      A.rect(g, mx - 8, seat - 18, 16, 2, 'wood3'); A.rect(g, mx - 8, seat - 18, 2, 20, 'wood2'); A.rect(g, mx + 6, seat - 18, 2, 20, 'wood2'); A.rect(g, mx - 8, seat, 16, 2, 'wood2');
      A.vline(g, mx - 7, seat + 2, 10, 'wood1'); A.vline(g, mx + 6, seat + 2, 10, 'wood1');
      A.shadow(g, mx, 160, 11, 2, 0.8);
      const manFace = t < T1 ? (Math.sin(t * 10) > 0 ? 'talk' : 'smug') : t < T2 ? 'blink' : t < 3.6 ? 'deadpan' : 'worry';
      A.man(g, mx, seat, { t, pose: 'sit', facing: 'front', face: manFace, floor: 12 });
      steam(g, mx + 15, 138, t, 1);
      // table in front of both
      A.shadow(g, 166, 160, 24, 2, 0.6);
      A.rect(g, 165, 146, 3, 14, 'wood1'); A.rect(g, 158, 158, 17, 2, 'wood1');
      A.ellipse(g, 166, 142, 19, 3, 'wood3'); A.hline(g, 149, 141, 35, 'wood5'); A.hline(g, 152, 144, 29, 'wood1');
      A.rect(g, 153, 135, 4, 6, 'cheese4'); A.rect(g, 153, 135, 4, 1, 'paper6');
      A.rect(g, 176, 136, 4, 5, 'cheese4'); A.rect(g, 176, 136, 4, 1, 'paper6');
      A.rect(g, 165, 136, 3, 5, 'paper5'); A.px(g, 166, 135, 'night1');
      const fl = Math.round(Math.sin(t * Math.PI * 2 * 3) * 0.6 + Math.sin(t * Math.PI * 2 * 5) * 0.4);
      A.px(g, 166 + (fl > 0 ? 1 : 0), 134, 'amber8'); A.px(g, 166, 133, 'amber7');
      A.glow(g, 166, 135, 24, { color: 'amber6', strength: 0.5 + 0.08 * fl, power: 1.3 });
      // ---- wet street reflecting everything above
      A.water(g, -20, 163, 350, 17, { t, amp: 0.6, speed: 0.5, color: 'night2', dark: 0.3, glints: 5, gaps: 0.1 });
      // the canal, mirrored
      A.water(g, 222, 154, 100, 8, { t, amp: 0.7, speed: 0.6, color: 'night2', dark: 0.35, glints: 6, stretch: 1 });
      // wide, broken window reflection
      for (const [sx, w, s] of [[18, 9, 1], [40, 7, 2], [64, 10, 3], [88, 7, 4]]) A.streak(g, sx, 163, 17, { t, seed: s, width: w, strength: 0.34 });
      A.streak(g, 128, 163, 17, { t, seed: 5, width: 6, strength: 0.28, color: 'amber5' });
      A.streak(g, 180, 163, 17, { t, seed: 6, width: 2, strength: 0.5 });
      A.streak(g, 302, 163, 17, { t, seed: 7, width: 3, strength: 0.6 });
      // puddle under the table: candle, orange jacket, blue sweater
      A.ellipse(g, 166, 172, 26, 4, 'night3'); A.ellipse(g, 166, 172, 22, 3, 'night4');
      A.rect(g, 138, 166, 5, 6, 'orange3'); A.rect(g, 202, 166, 5, 7, 'blue2');
      A.streak(g, 166, 166, 8, { t, seed: 9, width: 2, strength: 0.8 });
      A.px(g, 150 + Math.round(Math.sin(t * 1.5) * 3), 174, 'mist5'); A.px(g, 182 - Math.round(Math.sin(t * 1.5) * 3), 170, 'mist4');
      // ---- speech: two steps
      A.say(g, mx, seat - 28, 'Hoi!', {});
      if (nice) A.say(g, f.head[0], f.head[1], 'Oh, English is fine!', { dx: 14 });
    },
  };
})();
