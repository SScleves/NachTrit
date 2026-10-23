// Panel 2: everyone had changed; they still split the bill, the women still taller.
// Key light: the amber lantern, upper left, over a cold blue night. Layers: sky and mill, far
// gables in fog, a canal and arched bridge, near gables, the pavement cast, the wet street.
// Loops: mill sails, phone glow and lamp flicker, mist, ripples/reflections, eye blinks.
(function () {
  const A = window.NRART;
  const GABLES = ['step', 'bell', 'neck', 'spout', 'step', 'bell', 'roof', 'neck'];
  A.panels[1] = {
    text: 'By morning everyone had changed. Two things had not: they still split the bill, and the women were still taller than him.',
    nl: 'De volgende ochtend was iedereen veranderd. Twee dingen niet: ze deelden de rekening nog steeds, en de vrouwen waren nog steeds langer dan hij.',
    draw(g, t) {
      A.camera(g, t, { x: -6, period: 8 }); A.key(g, 40, 90, 1);
      const fl = 0.5 + 0.5 * Math.sin(t * 7.1) * Math.sin(t * 3.3 + 1);   // lamp flicker
      // sky, fading into the haze with no ruler edge
      A.depth(g, 0);
      A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist1', 'mist2'], 0, 128);
      A.stars(g, t, { n: 30, y1: 40, seed: 7 });
      A.moon(g, 280, 24, 6, { halo: 0.25 });
      A.ditherGradient(g, -20, 40, 360, 30, null, 'mist1', 'down');
      // far: church and mill, hazed properly, mill tucked behind the right houses
      A.depth(g, 0.15);
      for (let x = -20; x < 340; x += 5) A.disc(g, x, 116 - Math.round(A.hash(x, 2) * 3), 2 + Math.round(A.hash(x, 3) * 2), 'night3');
      A.rect(g, -20, 116, 360, 14, 'night3');
      A.church(g, 112, 131, 1, { tone: 'night3' });
      A.windmill(g, 232, 131, 0.95, -t * 0.5, { tone: 'night3', t, seed: 3, lit: 0.5 });
      A.haze(g, -20, 70, 360, 60, { top: 0.35, bottom: 0.78, color: 'mist2' });
      A.mist(g, t, 100, 18, { amount: 0.4, speed: 3, seed: 1, color: 'mist3' });
      // canal with an arched bridge, lamps receding into fog
      A.depth(g, 0.65);
      A.rect(g, -20, 130, 360, 14, 'night2');
      A.archBridge(g, 166, 134, 90, 10, { lit: false });
      A.zombie(g, 196, 126, { variant: 'hat', t: t + 2.3, height: 14, pose: 'walk', tone: 'night3', seed: 9 });
      [[176, 110, 1], [206, 114, 2], [232, 118, 3]].forEach(([lx, ly, k]) => {
        A.vline(g, lx, ly, 126 - ly, 'night3'); A.rect(g, lx - 1, ly - 1, 3, 2, 'amber5');
        A.glow(g, lx, ly + 1, 10 - k, { color: 'amber5', strength: 0.35, power: 1.5 });
        A.glow(g, lx, 127, 11, { ry: 3, color: 'amber4', strength: 0.18, power: 1 });
      });
      A.water(g, -20, 134, 360, 8, { t, amp: 0.6, dark: 0.5, color: 'night1', glints: 0 });
      // near gables: dark, cold, a few lit windows clustered behind the man
      A.depth(g, 0.85);
      [[-12, 40, 96], [30, 34, 104], [68, 36, 90], [108, 30, 100], [250, 38, 98], [292, 36, 92]].forEach(([x, w, h], i) =>
        A.canalHouse(g, x, 142, w, h, { gable: GABLES[(i * 3 + 1) % 8], brick: 'night2', lit: i === 3 ? 0.3 : 0.1, t, seed: i * 7 + 1, trim: 'night4', glow: 0, detail: false }));
      A.rect(g, -20, 142, 360, 5, 'slate2'); A.hline(g, -20, 142, 360, 'slate4');
      A.fence(g, 128, 142, 60, 8);
      A.tulips(g, 8, 142, 14); A.tulips(g, 300, 142, 14);
      // pavement and flat dark street
      A.depth(g, 1);
      A.rect(g, -20, 147, 360, 8, 'slate3'); A.hline(g, -20, 147, 360, 'slate5'); A.hline(g, -20, 154, 360, 'slate1');
      for (let x = -20; x < 340; x += 9) A.vline(g, x + ((x / 9) & 1) * 4, 148, 6, 'slate2');
      A.rect(g, -20, 155, 360, 25, 'slate0');
      const l1 = A.lamp(g, 40, 153, { style: 'lantern', h: 46, t, seed: 1, flicker: 0.2, cone: 0.35, reach: 52 });
      const l2 = A.lamp(g, 292, 153, { style: 'lantern', h: 46, t, seed: 2, cone: 0.3, reach: 52 });
      A.bollard(g, 78, 153); A.bollard(g, 262, 153);
      // a pale fog band and a warm lift behind the figures so they read as dark shapes
      A.mist(g, t, 112, 36, { amount: 0.4, speed: 4, seed: 2, color: 'mist4', lights: 0.5 });
      A.glow(g, 160, 128, 62, { ry: 26, color: 'mist4', strength: 0.22, power: 1.2 });
      // the cast: man between two looming women
      const sway = k => Math.round(Math.sin(t * 0.9 + k * 2.1) * 0.6);
      const ping = Math.floor(t / 1.5) % 3, pt = t % 1.5, flash = pt < 0.25;
      const z1 = A.zombie(g, 118 + sway(0), 153, { variant: 'bonnet', t, seed: 2, phone: true, height: 62, hunch: 0.1 });
      const glance = flash;
      A.man(g, 148, 153, { t, facing: 'front', face: t % 5 > 4.7 ? 'blink' : (glance ? 'worry' : 'deadpan') });
      const w = A.tallWoman(g, 161 + sway(1), 153, { t, facing: 'left', seed: 8, phone: true, height: 68, hunch: 0 });
      const z2 = A.zombie(g, 202 + sway(2), 153, { variant: 'phone', t, seed: 5, facing: 'left' });
      // local phones, 4x6, screens aimed at the man
      const phone = (hx, hy, dir, on, k) => {
        A.rect(g, hx - 2, hy - 3, 4, 6, 'slate0');
        A.rect(g, hx - 1 + (dir > 0 ? 1 : 0) * 0, hy - 2, 2, 4, on ? 'phone5' : 'phone4');
        A.px(g, hx - 1, hy - 2, 'phone5'); A.rect(g, hx - 1, hy, 2, 1, on ? 'phone2' : 'phone5');
        A.glow(g, hx + dir * -3, hy - 2, 11, { ry: 8, color: 'phone2', strength: on ? 0.6 : 0.35, power: 1.3, q: 4 });
      };
      phone(z1.hand[0] + 1, z1.hand[1] - 1, 1, flash && ping === 0, 0);
      phone(156, 117, -1, flash && ping === 1, 1);
      phone(z2.hand[0] - 1, z2.hand[1] - 1, -1, flash && ping === 2, 2);
      // cyan up-light on the faces
      [w.head, z2.head].forEach(h => A.glow(g, h[0], h[1] + 4, 7, { ry: 6, color: 'phone3', strength: 0.22, power: 1.4, q: 4 }));
      A.glow(g, 148, 119, 9, { ry: 7, color: 'phone2', strength: 0.3 + (flash ? 0.12 : 0), power: 1.4, q: 4 });
      // key rim: the flickering amber wash from the left lamp
      A.glow(g, 120, 140, 60, { color: 'amber5', strength: 0.14 + 0.1 * fl, power: 1.4, ry: 30 });
      // wet street: few strong reflections, only where something stands
      A.water(g, 20, 155, 290, 16, { t, amp: 0.5, dark: 0.6, color: 'slate0', gaps: 0.1, glints: 0, stretch: 1.4 });
      A.streak(g, l1[0], 156, 22, { t, strength: 0.7, seed: 1, width: 3, color: 'amber6', strength: 1 });
      A.streak(g, l2[0], 156, 22, { t, strength: 0.6, seed: 2, width: 3, color: 'amber6', strength: 1 });
      A.streak(g, 148, 158, 10, { t, color: 'orange5', strength: 0.5, seed: 5, width: 2 });
      [z1.hand[0] + 1, w.hand[0] - 1, z2.hand[0] - 1].forEach((hx, i) => A.streak(g, hx, 158, 9, { t, color: 'phone4', strength: 0.6, seed: 6 + i }));
      A.mist(g, t, 162, 14, { amount: 0.14, speed: 6, seed: 5, color: 'mist2' });
      A.say(g, w.head[0], w.head[1], 'Tikkie: €4,50', { dx: -6 });
    },
  };
})();
