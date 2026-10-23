// Level intro scene "square": a village church on a wet cobbled square. Key light: the church door
// and the lit arched windows. Loops: the swinging bell and its note, lamp + window flicker, drifting
// mist, the dead wandering.
(function () {
  const A = window.NRART;
  const hs = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  // pointed (gothic) arch filled with colour c; lit windows get a mullion
  const archFill = (g, x, y, w, h, c) => {
    const r = Math.floor(w / 2);
    A.rect(g, x, y + r, w, h - r, c);
    for (let i = 0; i < r; i++) A.hline(g, x + Math.floor(i * 0.8), y + r - i - 1 + (i > r - 3 ? 0 : 0), w - Math.floor(i * 1.6) - 0, c);
    A.hline(g, x + (w >> 1) - 1, y, 2, c);
  };
  const gothic = (g, x, y, w, h, lit, t, seed) => {
    archFill(g, x - 1, y - 1, w + 2, h + 1, 'night1');
    const flick = lit && hs(Math.floor(t * 6), seed) < 0.06 ? 0.55 : 1;
    archFill(g, x, y, w, h, flick < 1 ? 'amber4' : lit ? 'amber6' : 'night3');
    if (lit) {
      A.vline(g, x + (w >> 1), y + 3, h - 3, 'brick1'); A.hline(g, x, y + (h >> 1), w, 'brick1');
      A.hline(g, x + 1, y + h - 2, w - 2, 'amber8');
    }
    A.hline(g, x - 1, y + h, w + 2, 'mist2');
  };
  A.scenes.square = (g, t) => {
    const T = Math.PI * 2;
    A.camera(g, t, { x: 6, period: 8 }); A.key(g, 166, 100, 1);
    // ---- sky and far world
    A.depth(g, 0);
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0'], 0, 130);
    A.stars(g, t, { n: 40, y1: 60, seed: 5 });
    A.moon && A.moon(g, 236, 26, 7, {});
    A.depth(g, 0.2);
    // far skyline: a second spire, roofs, the windmill, all pale and flat
    A.church(g, 22, 118, 1.0, { tone: 'night3', lit: false, clock: false });
    A.windmill(g, 212, 104, 0.8, -t * 0.35, { tone: 'night3', lit: true, t });
    for (let i = 0; i < 9; i++) { const x = -10 + i * 38 + (i % 2) * 6, w = 24 + (i % 3) * 6, h = 14 + (i * 7) % 12; A.rect(g, x, 118 - h, w, h, 'night3'); A.poly(g, [x - 1, 118 - h, x + w + 1, 118 - h, x + w / 2, 118 - h - 9], 'night3'); if (i % 3 == 1) A.px(g, x + 5, 118 - h + 5, 'amber4'); }
    A.haze(g, -20, 70, 360, 58, { top: 0.2, bottom: 0.6, color: 'mist2' });
    A.depth(g, 0.4);
    A.mist(g, t, 96, 26, { amount: 0.25, speed: 3, seed: 7, color: 'mist3' });
    // flanking canal houses
    [[-14, 40, 78, 'step'], [28, 32, 92, 'bell'], [246, 34, 90, 'neck'], [284, 40, 76, 'spout']].forEach(([x, w, h, gb], i) => A.canalHouse(g, x, 128, w, h, { gable: gb, lit: 0.45, t, seed: 70 + i }));
    A.haze(g, -20, 60, 360, 70, { top: 0.25, bottom: 0.4, color: 'mist2' });
    A.depth(g, 0.62);
    // ---- the church: tower in the middle, nave behind to both sides
    const cx = 166, by = 128;
    // nave
    A.rect(g, 92, by - 36, 148, 36, 'brick2');
    A.brick(g, 92, by - 36, 148, 36, { base: 'brick2', only: 'brick2', seed: 4 });
    A.poly(g, [88, by - 36, 244, by - 36, 224, by - 62, 108, by - 62], 'slate2');
    A.tiles(g, 88, by - 62, 156, 26, { base: 'slate2', only: 'slate2' });
    A.hline(g, 88, by - 36, 156, 'slate1'); A.hline(g, 108, by - 62, 116, 'slate3');
    // buttresses
    [100, 128, 204, 232].forEach(x => { A.rect(g, x, by - 30, 4, 30, 'brick1'); A.poly(g, [x, by - 30, x + 4, by - 30, x + 4, by - 34], 'brick1'); A.hline(g, x, by - 30, 4, 'mist2'); });
    // nave windows
    [110, 140, 192, 218].forEach((x, i) => gothic(g, x, by - 30, 7, 20, true, t, i + 1));
    // tower
    const tx = cx - 17;
    A.rect(g, tx, by - 84, 34, 84, 'brick2');
    A.brick(g, tx, by - 84, 34, 84, { base: 'brick2', only: 'brick2', seed: 9 });
    A.rect(g, tx - 2, by - 84, 38, 3, 'slate3'); A.hline(g, tx - 2, by - 81, 38, 'slate1');
    // belfry with swinging bell
    archFill(g, cx - 8, by - 78, 16, 22, 'night0');
    A.glow(g, cx, by - 68, 11, { color: 'amber5', strength: 0.5, power: 1.2 });
    const sw = Math.sin(t * T / 2) * 4;   // 2 s swing
    A.line(g, cx, by - 76, Math.round(cx + sw), by - 69, 'wood1');
    const bx = Math.round(cx + sw);
    A.rect(g, bx - 3, by - 69, 7, 5, 'amber5'); A.rect(g, bx - 4, by - 64, 9, 2, 'amber6'); A.px(g, bx, by - 62, 'amber8'); A.vline(g, bx - 2, by - 68, 4, 'amber7');
    A.vline(g, cx - 8, by - 62, 6, 'night2'); A.vline(g, cx + 7, by - 62, 6, 'night2');
    for (let y = by - 55; y < by - 51; y += 2) A.hline(g, cx - 8, y, 16, 'night1');
    // clock
    A.disc(g, cx, by - 42, 7, 'paper3'); A.ring(g, cx, by - 42, 7, 'slate1'); A.disc(g, cx, by - 42, 5, 'paper4');
    const ma = -Math.PI / 2 + (t / 60) * T * 4, ha = -Math.PI / 2 + 0.9;
    A.line(g, cx, by - 42, Math.round(cx + Math.cos(ma) * 4.5), Math.round(by - 42 + Math.sin(ma) * 4.5), 'night1');
    A.line(g, cx, by - 42, Math.round(cx + Math.cos(ha) * 3), Math.round(by - 42 + Math.sin(ha) * 3), 'night1');
    A.glow(g, cx, by - 42, 12, { color: 'amber5', strength: 0.3 });
    // spire
    A.poly(g, [tx - 2, by - 84, tx + 36, by - 84, cx, by - 124], 'slate2');
    A.poly(g, [cx, by - 124, cx + 19, by - 84, cx + 9, by - 84], 'slate3');
    A.tiles(g, tx, by - 118, 36, 34, { base: 'slate2', only: 'slate2' });
    A.vline(g, cx, by - 134, 11, 'slate1'); A.px(g, cx, by - 135, 'amber6'); A.hline(g, cx - 2, by - 130, 5, 'slate1');
    [tx - 2, tx + 32].forEach(x => { A.rect(g, x, by - 92, 4, 9, 'brick1'); A.poly(g, [x - 1, by - 92, x + 5, by - 92, x + 2, by - 99], 'slate2'); });
    // porch and great door
    A.rect(g, cx - 12, by - 26, 24, 26, 'brick1');
    A.poly(g, [cx - 14, by - 26, cx + 14, by - 26, cx, by - 38], 'slate2');
    A.tiles(g, cx - 14, by - 36, 28, 10, { base: 'slate2', only: 'slate2' });
    archFill(g, cx - 8, by - 24, 16, 24, 'night0');
    archFill(g, cx - 7, by - 23, 14, 23, 'amber6');
    A.vline(g, cx, by - 23, 23, 'wood1'); A.hline(g, cx - 7, by - 12, 14, 'wood1');
    for (let i = 0; i < 6; i++) A.px(g, cx - 5 + (i & 1) * 7, by - 20 + i * 3, 'wood2');
    A.rect(g, cx - 10, by - 2, 20, 2, 'mist2'); A.rect(g, cx - 13, by, 26, 1, 'mist1');
    // church light falls on the square
    A.depth(g, 0.8);
    A.glow(g, cx, by - 12, 28, { color: 'amber6', strength: 0.3, power: 1.6, ry: 22, q: 4 });
    A.glow(g, cx, by + 3, 56, { ry: 8, color: 'amber5', strength: 0.5, power: 1.1, q: 4 });
    A.cone(g, cx, by - 10, Math.PI / 2, 0.5, 48, { color: 'amber5', strength: 0.3, width: 14, fade: 0.8 });
    A.haze(g, 80, by - 70, 180, 70, { amount: 0.14, color: 'mist2' });
    // trees either side, rattling slightly
    A.tree(g, 66, 134, 1.2, { tone: 'night2', t, seed: 3 }); A.tree(g, 262, 134, 1.1, { tone: 'night2', t, seed: 6 });
    // ---- the square: wet cobbles
    A.depth(g, 1);
    A.rect(g, -20, by, 360, 60, 'slate2');
    for (let y = by + 1; y < 180; y += 3) { const d = (y - by) / 52; const w = 3 + Math.floor(d * 5); for (let x = -20 + ((y / 3 | 0) % 2) * (w >> 1); x < 340; x += w + 1) { A.hline(g, x, y, w, hs(x, y) < 0.15 ? 'slate1' : 'slate3'); } A.hline(g, -20, y + 2, 360, 'slate1'); }
    A.shadow(g, cx, by + 2, 24, 3, 0.4);
    // low wall + bollards to lead the eye in
    A.bollard(g, 96, by + 20); A.bollard(g, 236, by + 20);
    A.depth(g, 1);
    // reflect the church into the wet ground before the foreground goes in
    A.water(g, 20, by + 4, 280, 22, { t, amp: 0.6, dark: 0.62, color: 'slate1', gaps: 0.35, glints: 5, stretch: 1.4 });
    // lamps with streaks
    A.lamp(g, 36, 164, { t, style: 'lantern', h: 44, seed: 4, flicker: 0.05 });
    A.lamp(g, 292, 164, { t, style: 'lantern', h: 44, seed: 5, flicker: 0.04 });
    A.streak(g, 38, 166, 12, { t, seed: 1 }); A.streak(g, 294, 166, 12, { t, seed: 2 });
    A.streak(g, cx, by + 6, 24, { t, seed: 3, width: 3, strength: 0.55 });
    A.tulips(g, 120, 160, 22);
    A.mist(g, t, 130, 30, { amount: 0.22, speed: 4, seed: 2 });
    // the dead of the village, drawn to the bell
    A.zombie(g, 96 + ((t * 4) % 24), 156, { t, seed: 3, variant: 'bonnet', pose: 'walk', height: 36 });
    A.zombie(g, 208, 150, { t, seed: 4, variant: 'hat', pose: 'stand', facing: 'left', height: 34 });
    A.zombie(g, 150, 172, { t, seed: 9, variant: 'plain', pose: 'stand', height: 52 });
    A.cheeseCart(g, 250, 174, {});
    // bell note rising from the belfry
    const k = (t % 2) / 2;
    if (k < 0.7) A.text(Math.round(cx + 12 + k * 14), Math.round(by - 90 - k * 22 + Math.sin(k * 9) * 2), '♪', 'amber7', 9, true);
  };
})();
