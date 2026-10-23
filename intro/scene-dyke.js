// Level intro scene "dyke" (polder borrows it): the mills along the water at Kinderdijk.
// Key light: the moon, upper left, plus one warm lantern on the road. Focal point: the lit mill
// across the water and the cyclist riding toward it.
// Loops: mill sails, water and reflections, drifting mist and lantern flicker, reeds.
(function () {
  const A = window.NRART;
  const H = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  // the road: a trapezoid running to a vanishing point at the right of centre
  const VX = 176, VY = 117;
  const roadL = y => -60 + (VX + 60) * (y - 180) / (VY - 180) * -1 + 0; // left edge x at row y
  const edgeL = y => { const f = (180 - y) / (180 - VY); return -40 + (VX - 3 + 40) * f; };
  const edgeR = y => { const f = (180 - y) / (180 - VY); return 170 + (VX + 3 - 170) * f; };

  A.scenes.dyke = (g, t) => {
    A.camera(g, t, { x: -8, period: 8 }); A.key(g, 60, 26, 1);
    // ---- sky and far fog
    A.depth(g, 0);
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'night4', 'mist1'], 0, 118);
    A.stars(g, t, { n: 46, y1: 62, seed: 11 });
    // long cloud streaks pulled across the moon
    for (let i = 0; i < 5; i++) A.ditherRect(g, ((i * 83 + t * 1.5) % 380) - 40, 18 + i * 9, 70 + i * 12, 2, null, 'night3', 0.35);
    A.moon(g, 60, 26, 9, {});
    A.depth(g, 0.15);
    // far horizon: low trees, a church spire, tiny mills
    A.rect(g, -20, 108, 380, 12, 'night3');
    for (let i = 0; i < 26; i++) A.disc(g, -10 + i * 14 + H(i, 2) * 6, 107 + H(i, 3) * 2, 3 + H(i, 4) * 3, 'night3');
    A.church(g, 150, 109, 0.8, { tone: 'night1', clock: false, lit: false });
    [[20, 0.2], [292, 0.24], [262, 0.2]].forEach(([x, s], i) => A.windmill(g, x, 109, s, -t * 0.9 + i, { tone: 'night1', t, seed: i }));
    A.haze(g, -20, 70, 380, 52, { top: 0, bottom: 0.5, color: 'mist2' });
    A.depth(g, 0.3);
    // the middle bank: a row of mills and a gabled farm, fading
    A.rect(g, -20, 113, 380, 8, 'night2');
    A.windmill(g, 40, 114, 0.42, -t * 0.8 + 3, { tone: 'night1', t, seed: 9 });
    A.windmill(g, 268, 114, 0.5, -t * 0.75 + 2, { tone: 'night1', t, seed: 4, lit: 0.6 });
    A.haze(g, -20, 80, 380, 42, { top: 0, bottom: 0.55, color: 'mist3' });
    // ---- the focal mill, near bank across the water, lit windows and a balcony
    A.depth(g, 0.6);
    A.rect(g, -20, 119, 380, 6, 'night1'); A.hline(g, -20, 119, 380, 'night3');
    A.windmill(g, 232, 121, 1.12, -t * 0.55 + 1.2, { tone: 'night2', t, seed: 6, lit: 1 });
    A.windmill(g, 130, 120, 0.62, -t * 0.65 + 0.4, { tone: 'night2', t, seed: 5, lit: 0.7 });
    A.mist(g, t, 108, 18, { amount: 0.4, speed: -4, seed: 5, color: 'mist3' });

    // ---- water on the right (mirrors everything above it), then the road drawn over it
    A.depth(g, 1);
    A.rect(g, -20, 123, 380, 60, 'night1');
    A.water(g, 100, 123, 240, 57, { t, amp: 1.3, dark: 0.55, color: 'night1', glints: 18 });
    A.streak(g, 62, 130, 40, { t, color: 'mist6', strength: 0.3, seed: 3, width: 2 });
    A.streak(g, 232, 130, 44, { t, color: 'amber6', strength: 0.5, seed: 8 });
    // a moored sloep and the duck
    A.boat(g, 262, 156, { t, kind: 'sloep', len: 36 });
    A.duck(g, 214, 146, { t, facing: 'right' });
    // ---- the grass bank behind the road (left) and the road itself
    A.rect(g, -20, 122, 190, 60, 'night0');
    A.ditherGradient(g, -20, 122, 190, 12, 'night1', 'night0', 'down');
    for (let y = 119; y < 181; y++) {
      const a = edgeL(y), b = edgeR(y), f = (y - VY) / (180 - VY);
      A.rect(g, a, y, b - a, 1, f < 0.1 ? 'mist1' : f < 0.3 ? 'night3' : 'night2');
      A.ditherRect(g, a, y, b - a, 1, null, 'night3', 0.25 + 0.4 * Math.sin(Math.PI * Math.min(1, (y - 125) / 55)) * 0.5);
    }
    // wet asphalt: lit faintly by the moon, fog thick at the far end
    
    // the dyke edge, a pale kerb on the water side, and a dashed centre line
    for (let y = 119; y < 181; y++) { A.rect(g, edgeR(y) - 1, y, 2, 1, 'night3'); A.px(g, edgeR(y) + 1, y, 'night0'); }
    for (let i = 0; i < 7; i++) {
      const y0 = 126 + i * i * 1.3 + i * 4, f0 = (y0 - VY) / (180 - VY), cx = (edgeL(y0) + edgeR(y0)) / 2 - 1;
      if (y0 < 180) A.rect(g, cx, y0, 1 + f0 * 3, 1 + Math.round(f0 * 3), 'night3');
    }
    // puddles on the road with the sky in them
    [[96, 166, 20, 3], [132, 150, 11, 2], [66, 175, 18, 3]].forEach(([x, y, rx, ry], i) => {
      A.ellipse(g, x, y, rx, ry, 'night2'); A.ditherRect(g, x - rx + 2, y - 1, rx * 2 - 4, 1, null, 'mist5', 0.3 + 0.1 * Math.sin(t * 1.5 + i));
    });
    // ---- the lantern on the left: key light of the foreground
    A.depth(g, 1.1);
    A.fence(g, -12, 160, 44, 10);
    A.bollard(g, 148, 138);
    A.lamp(g, 58, 150, { style: 'lantern', h: 44, flicker: 0.12, t, seed: 3 });
    const fl = H(Math.floor(t * 9), 5) < 0.1 ? 0.6 : 1;
    A.cone(g, 58, 108, Math.PI / 2 + 0.55, 0.5, 62, { color: 'amber5', strength: 0.3 * fl, fade: 1.3, width: 6 });
    A.glow(g, 58, 108, 34, { color: 'amber6', strength: 0.5 * fl, power: 1.6 });
    A.glow(g, 80, 160, 40, { color: 'amber5', strength: 0.32 * fl, power: 1.5, ry: 11 });
    A.streak(g, 59, 152, 28, { t, color: 'amber6', strength: 0.8 * fl, seed: 1, width: 2 });
        // ---- the hero: a small orange cyclist, back to us, riding toward the mills
    A.depth(g, 1);
    A.shadow(g, 112, 152, 14, 2, 0.6);
    A.omafiets(g, 112, 152, { rider: true, t, speed: 1.4, facing: 'right', beam: 36, basket: 'dog' });
    A.streak(g, 112, 153, 14, { t, color: 'amber5', strength: 0.35, seed: 4, width: 3 });
    // a far zombie waiting on the dyke, two eyes in the fog
    A.depth(g, 0.85);
    A.zombie(g, 150, 134, { variant: 'plain', t, height: 30, hunch: 0.5, tone: 'night1', pose: 'stand' });
    
    // ---- foreground reeds, rim lit by the moon, and ground fog
    A.depth(g, 1.25);
    A.reeds(g, -14, 182, 52, 46, { t, seed: 3, tone: 'green1' });
    A.reeds(g, 270, 182, 70, 38, { t, seed: 8, tone: 'green1' });
    for (let i = 0; i < 30; i++) A.vline(g, 4 + i * 5 + H(i, 1) * 4, 181 - 3 - H(i, 2) * 5, 4 + H(i, 2) * 5, 'night0');
    A.reeds(g, 190, 182, 40, 18, { t, seed: 12, tone: 'green1', dense: 0.4 });
    A.depth(g, 1);
    A.mist(g, t, 140, 28, { amount: 0.28, speed: 6, seed: 6 });
    
    // vignette
    A.tint(g, -20, 156, 380, 26, 'night0', 0.4, 'mix');
  };
  A.scenes.polder = (g, t) => A.scenes.dyke(g, t);
})();
