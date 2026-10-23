// Panel 3: nobody agrees on what caused it. A wall of rumours in the mist: one hero exhibit
// (the mouldy cheese), the poll where Flemish wins, the millionth tourist, a conspiracy string.
// Amber only in pools (one bare bulb per board) inside a cold blue-grey night.
(function () {
  const A = window.NRART;
  const h01 = (a, b) => { let n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return n - Math.floor(n); };
  const ease = u => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, u)));
  // a pinned paper with a real headline (or a drawer callback for an icon)
  function note(g, x, y, str, o) {
    o = o || {}; const w = o.w || Math.ceil(A.textWidth(str, o.size || 5, true)) + 5, h = o.h || 9;
    A.rect(g, x + 1, y + 1, w, h, 'night0'); A.rect(g, x, y, w, h, o.tone || 'paper3'); A.hline(g, x, y, w, 'paper5');
    A.px(g, x + (w >> 1), y, 'red5');
    A.text(x + w / 2, y + h - 2, str, o.ink || 'night1', o.size || 5, true, { align: 'center' });
    return w;
  }
  function board(g, x, y, w, h, t, ph) {
    A.rect(g, x - 3, y - 3, w + 6, h + 6, 'wood1');
    A.hline(g, x - 3, y - 3, w + 6, 'wood3'); A.hline(g, x - 3, y - 2, w + 6, 'wood2');
    A.vline(g, x - 3, y - 3, h + 6, 'wood2'); A.vline(g, x + w + 2, y - 3, h + 6, 'wood0'); A.hline(g, x - 3, y + h + 2, w + 6, 'wood0');
    for (const [a, b] of [[x - 2, y - 2], [x + w + 1, y - 2], [x - 2, y + h + 1], [x + w + 1, y + h + 1]]) A.px(g, a, b, 'steel3');
    A.rect(g, x, y, w, h, 'night2');
    A.ditherGradient(g, x, y, w, h, 'night3', 'night1', 'down');
    const fl = 0.85 + 0.15 * Math.sin(t * 7 + ph * 5) * Math.sin(t * 3.1 + ph);
    const bx = x + (w >> 1) + Math.round(Math.sin(t * 0.9 + ph) * 1.2);
    A.glow(g, bx, y + 4, w * 0.45, { ry: h * 0.55, color: 'amber5', strength: 0.35 * fl, power: 1.1, q: 4 });
    return { bx, fl, y };
  }
  function bulb(g, f) {
    const by = f.y - 6;
    A.rect(g, f.bx - 5, 41, 11, 2, 'steel2'); A.hline(g, f.bx - 5, 41, 11, 'steel4'); // bracket under the coping
    A.vline(g, f.bx, 43, by - 45, 'slate3'); A.rect(g, f.bx - 1, by - 3, 3, 2, 'steel2');
    A.disc(g, f.bx, by, 2, 'amber7'); A.px(g, f.bx, by, 'amber8');
    A.glow(g, f.bx, by, 8, { color: 'amber7', strength: 0.5 * f.fl, power: 1.6, q: 4 });
  }
  function mould(g, x, y, r, s) {
    A.disc(g, x, y, r, 'green3'); A.disc(g, x, y - 1, Math.max(1, r - 2), 'green5');
    A.disc(g, x - 1, y - 1, Math.max(1, r - 4), 'green6');
    for (let i = 0; i < 7; i++) { const a = h01(s, i) * 6.28; A.px(g, Math.round(x + Math.cos(a) * (r + 1)), Math.round(y + Math.sin(a) * (r + 1) * 0.7), 'green4'); }
    A.px(g, x - 1, y - 1, 'green7');
  }
  function fly(g, x, y, t, k) { const a = t * 6 + k * 2; A.rect(g, x + Math.round(Math.cos(a) * 5), y + Math.round(Math.sin(a * 1.3) * 3), 2, 2, 'night0'); }
  // the millionth tourist: sunhat, camera on a strap, rucksack, shorts, white socks, head back, mouth wide
  function tourist(g, x, y, t, flash) {
    const sh = Math.round(Math.sin(t * 13) * 0.6 + 0.4);
    A.shadow(g, x, y, 10, 2, 0.6);
    A.rect(g, x - 4, y - 3, 4, 3, 'slate0'); A.rect(g, x + 1, y - 3, 4, 3, 'slate0');
    A.rect(g, x - 3, y - 7, 3, 4, 'paper6'); A.rect(g, x + 1, y - 7, 3, 4, 'paper6');
    A.rect(g, x - 3, y - 14, 3, 7, 'skin4'); A.rect(g, x + 1, y - 14, 3, 7, 'skin4');
    A.rect(g, x - 5, y - 22, 10, 8, 'wood3'); A.hline(g, x - 5, y - 22, 10, 'wood5');
    A.rect(g, x - 10, y - 34, 5, 13, 'blue3'); A.rect(g, x - 10, y - 34, 5, 2, 'blue5'); A.vline(g, x - 10, y - 34, 13, 'blue2'); // rucksack
    A.rect(g, x - 5, y - 35, 11, 14, 'teal4'); A.vline(g, x + 5, y - 35, 14, 'teal2');
    for (let i = 0; i < 4; i++) A.px(g, x - 3 + i * 3, y - 31 + (i % 2) * 5, 'paper5'); // loud shirt
    A.line(g, x - 3, y - 35, x + 4, y - 27, 'night0'); // strap
    A.rect(g, x + 2, y - 29, 6, 5, 'slate0'); A.hline(g, x + 2, y - 29, 6, 'steel3'); A.disc(g, x + 5, y - 26, 1, flash ? 'paper7' : 'steel4');
    A.rect(g, x + 6, y - 33, 3, 5, 'skin4'); // far arm holding his belly, near arm hanging
    A.rect(g, x - 8, y - 30, 3, 8, 'skin4'); A.rect(g, x - 9, y - 26, 4, 3, 'skin4');
    A.rect(g, x - 2, y - 38 + sh, 5, 3, 'skin4'); // neck, head thrown back
    A.rect(g, x - 5, y - 44 + sh, 10, 7, 'skin4'); A.hline(g, x - 5, y - 44 + sh, 10, 'skin5');
    A.rect(g, x - 3, y - 41 + sh, 7, 4, 'night0'); A.rect(g, x - 2, y - 40 + sh, 5, 2, 'red4'); A.hline(g, x - 2, y - 41 + sh, 5, 'paper6'); // wide laugh
    A.px(g, x - 3, y - 44 + sh, 'night0'); A.px(g, x + 3, y - 44 + sh, 'night0'); // squeezed eyes
    A.ellipse(g, x - 1, y - 45 + sh, 9, 2, 'paper5'); A.rect(g, x - 5, y - 50 + sh, 9, 5, 'paper4'); A.hline(g, x - 5, y - 47 + sh, 9, 'blue3'); // sunhat
  }

  A.panels[2] = {
    text: 'Nobody agrees on what caused it. Bad cheese, some say. Others blame a worldwide poll that called Flemish the nicer Dutch. Or the millionth tourist who said it sounds like a drunk German. Probably all of it.',
    nl: 'Niemand is het eens over de oorzaak. Slechte kaas, zeggen sommigen. Anderen geven de schuld aan een wereldwijde peiling waarin Vlaams het mooiste Nederlands werd genoemd. Of aan de miljoenste toerist die zei dat het klinkt als een dronken Duitser. Waarschijnlijk allemaal.',
    draw(g, t) {
      A.key(g, 68, 60, 1);
      // ---- far layer: a real foggy skyline above the wall
      A.depth(g, 0);
      A.sky(g, ['night0', 'night1', 'night2', 'night3', 'night4', 'mist0'], 0, 140);
      A.stars(g, t, { n: 12, y1: 24, seed: 6 });
      A.moon && A.moon(g, 304, 11, 5);
      A.depth(g, 0.25);
      A.church(g, 82, 52, 0.9);
      A.windmill(g, 240, 62, 1.0, -t * 0.35, { tone: 'mist1', stage: true, lit: 0.8, t });
      A.haze(g, -20, 0, 360, 45, { top: 0.3, bottom: 0.65, color: 'mist2' });
      for (let i = 0; i < 6; i++) A.canalHouse(g, -8 + i * 60, 30 + (i * 5) % 9, 28 + (i % 3) * 5, 24, { gable: ['step', 'bell', 'neck', 'spout'][i % 4], brick: 'slate1', lit: 0.3, t, seed: i + 3 });
      A.haze(g, -20, 6, 360, 40, { top: 0.35, bottom: 0.6, color: 'mist2' });
      A.mist(g, t, 20, 24, { amount: 0.35, speed: 3, seed: 2, color: 'mist3' });
      // ---- the wall: cold brick, coping, deep corners
      A.depth(g, 0.9);
      A.rect(g, -10, 43, 340, 100, 'night1');
      A.brick(g, -10, 43, 340, 100, { base: 'slate1', only: 'slate1', seed: 5, bw: 6 });
      A.rect(g, -10, 39, 340, 4, 'slate2'); A.hline(g, -10, 39, 340, 'slate4'); A.hline(g, -10, 42, 340, 'slate0');
      A.glow(g, 0, 90, 110, { ry: 90, color: 'night0', mode: 'mix', strength: 0.85, power: 0.8, q: 4 });
      A.glow(g, 320, 90, 110, { ry: 90, color: 'night0', mode: 'mix', strength: 0.85, power: 0.8, q: 4 });
      // ---- boards, no longer a triptych: a big hero, a mid poll, a tourist board cropped by the edge
      const f1 = board(g, 8, 54, 124, 82, t, 0), f2 = board(g, 146, 62, 82, 64, t, 1.7), f3 = board(g, 240, 52, 90, 80, t, 3.4);
      // 1. HERO: the mouldy cheese
      A.rect(g, 8, 118, 124, 18, 'wood2'); for (let i = 0; i < 5; i++) A.hline(g, 8, 119 + i * 3, 124, i % 2 ? 'wood1' : 'wood3');
      A.hline(g, 8, 118, 124, 'wood5'); A.shadow(g, 56, 118, 40, 3, 0.6);
      A.ellipse(g, 56, 116, 38, 7, 'cheese2'); A.rect(g, 18, 88, 76, 28, 'cheese3');
      A.rect(g, 18, 88, 76, 4, 'cheese2'); A.vline(g, 19, 90, 24, 'cheese5'); A.rect(g, 84, 90, 10, 26, 'cheese2');
      A.ellipse(g, 56, 88, 38, 9, 'cheese5'); A.ellipse(g, 56, 88, 30, 6, 'cheese4');
      for (const [mx, my, r, s] of [[44, 86, 7, 1], [66, 89, 6, 2], [30, 100, 5, 3], [78, 104, 6, 4], [52, 108, 4, 5], [88, 94, 4, 6], [58, 98, 3, 7]]) mould(g, mx, my, r, s);
      // cut wedge showing veined insides
      A.poly(g, [96, 118, 126, 118, 126, 102, 96, 108], 'cheese5'); A.hline(g, 96, 117, 30, 'cheese2'); A.hline(g, 96, 118, 30, 'cheese2');
      for (const [hx, hy] of [[102, 111], [110, 108], [118, 112], [108, 114]]) A.disc(g, hx, hy, 1, 'cheese3');
      A.line(g, 98, 112, 112, 106, 'green5'); A.line(g, 106, 116, 122, 110, 'green4'); A.line(g, 112, 106, 124, 104, 'green6');
      for (let i = 0; i < 4; i++) { const ph = (t * 0.4 + i / 4) % 1; for (let k = 0; k < 10; k++) { const sx = 32 + i * 16 + Math.round(Math.sin(k * 0.7 + t * 2 + i * 2) * 2.5), sy = Math.round(80 - ph * 22 - k * 2); A.rect(g, sx, sy, 2, 2, ph < 0.7 ? 'green6' : 'green3'); } }
      fly(g, 28, 70, t, 1); fly(g, 80, 66, t, 2); fly(g, 56, 62, t, 3); fly(g, 110, 90, t, 4);
      A.text(70, 68, 'KAAS?', 'paper4', 9, true, { align: 'center', shadow: true });
      // 2. the poll: Vlaams in black/yellow/red wins by a landslide
      const u = (t % 12) / 12, grow = 0.18 + 0.82 * (u < 0.25 ? ease(u / 0.25) : u < 0.75 ? 1 : ease((1 - u) / 0.25));
      A.rect(g, 152, 80, 70, 40, 'night1'); A.rect(g, 151, 79, 72, 1, 'steel3');
      for (let i = 0; i < 3; i++) A.hline(g, 154, 86 + i * 11, 66, 'night3');
      const base = 118, bh1 = Math.round(32 * grow), bh2 = Math.max(2, Math.round(4 * grow));
      for (let s = 0; s < 3; s++) A.rect(g, 158 + s * 8, base - bh1, 8, bh1, ['night0', 'cheese5', 'red4'][s]);
      A.vline(g, 158, base - bh1, bh1, 'slate3');
      A.rect(g, 196, base - bh2, 16, bh2, 'blue2'); A.hline(g, 196, base - bh2, 16, 'slate4');
      A.hline(g, 151, base, 72, 'paper3');
      if (grow > 0.6) { const cy = base - bh1 - 8 + Math.round(Math.sin(t * 3)); A.poly(g, [166, cy + 6, 167, cy, 170, cy + 4, 173, cy - 1, 176, cy + 4, 179, cy, 180, cy + 6], 'paper6'); A.px(g, 173, cy - 2, 'red5'); A.text(173, cy - 3, '87%', 'paper5', 7, true, { align: 'center', shadow: true }); }
      A.text(204, base - bh2 - 2, '13%', 'slate5', 5, true, { align: 'center' });
      A.text(173, 126, 'Vlaams', 'paper5', 5, true, { align: 'center' }); A.text(204, 126, 'NL', 'slate5', 5, true, { align: 'center' });
      A.text(187, 74, 'de peiling', 'paper4', 8, true, { align: 'center', shadow: true });
      // 3. the tourist
      A.rect(g, 240, 120, 80, 16, 'slate2'); A.hline(g, 240, 120, 80, 'slate4'); A.hline(g, 240, 121, 80, 'slate1');
      A.rect(g, 248, 62, 20, 26, 'night1'); A.rect(g, 249, 63, 18, 24, 'night3'); A.ditherGradient(g, 249, 63, 18, 24, 'night4', 'mist1', 'down');
      A.windmill(g, 258, 86, 0.3, -t * 0.5, { tone: 'night1', sail: 'night0', t });
      const flash = (t % 2.5) < 0.3;
      tourist(g, 286, 120, t, flash);
      A.say(g, 288, 76, 'drunk German!', { size: 6 });
      A.text(290, 62, '#1.000.000', 'paper4', 7, true, { align: 'center', shadow: true });
      if (flash) { A.glow(g, 293, 94, 60, { ry: 58, color: 'paper6', strength: 1, power: 0.5, q: 4 }); A.glow(g, 293, 94, 9, { color: 'paper7', strength: 1, power: 0.4, q: 4 }); }
      for (const f of [f1, f2, f3]) bulb(g, f);
      // ---- pinned clippings and the red string of the conspiracy
      let nx = 3; nx += note(g, nx, 44, 'OOSTENRIJK?') + 3; note(g, nx, 44, 'Ik spreek liever Engels');
      note(g, 240, 44, 'HAGELSLAG!', { tone: 'paper2' });
      // banner across the coping
      const bw = 72, bcx = 187;
      A.poly(g, [bcx - bw / 2, 33, bcx + bw / 2, 34, bcx + bw / 2 - 2, 38, bcx + bw / 2 + 1, 42, bcx + bw / 2 - 3, 46, bcx - bw / 2 + 2, 46, bcx - bw / 2 - 1, 41], 'paper3');
      A.hline(g, bcx - bw / 2, 33, bw, 'paper5');
      A.text(bcx, 44, 'GERUCHTEN', 'red3', 9, true, { align: 'center' });
      // owl poster with a red X (language app), 5G mast
      A.rect(g, 135, 90, 15, 24, 'night0'); A.rect(g, 134, 89, 15, 24, 'paper3'); A.px(g, 141, 89, 'red5');
      A.disc(g, 141, 100, 5, 'green5'); A.rect(g, 138, 96, 2, 2, 'paper6'); A.rect(g, 142, 96, 2, 2, 'paper6'); A.px(g, 139, 97, 'night0'); A.px(g, 143, 97, 'night0'); A.px(g, 141, 100, 'cheese5');
      A.line(g, 135, 90, 148, 111, 'red5'); A.line(g, 148, 90, 135, 111, 'red5');
      A.rect(g, 228, 92, 12, 22, 'night0'); A.rect(g, 227, 91, 12, 22, 'paper2'); A.px(g, 233, 91, 'red5');
      A.line(g, 233, 94, 230, 108, 'night1'); A.line(g, 233, 94, 236, 108, 'night1'); A.hline(g, 231, 101, 5, 'night1');
      A.ring && A.ring(g, 233, 94, 3, 'red4'); A.text(233, 112, '5G', 'red3', 5, true, { align: 'center' });
      const pins = [[70, 54], [141, 90], [187, 66], [233, 92], [288, 56]];
      for (let i = 0; i < pins.length - 1; i++) { const [a, b] = pins[i], [c, d] = pins[i + 1]; A.line(g, a, b, (a + c) >> 1, ((b + d) >> 1) + 4, 'red3'); A.line(g, (a + c) >> 1, ((b + d) >> 1) + 4, c, d, 'red3'); }
      A.line(g, 70, 54, 24, 53, 'red3');
      for (const [a, b] of pins) { A.rect(g, a - 1, b - 1, 3, 3, 'red5'); A.px(g, a - 1, b - 1, 'paper6'); }
      // fog drifting in front of the wall, thicker toward the edges
      A.mist(g, t, 62, 56, { amount: 0.35, speed: 3, seed: 4, color: 'mist3' });
      A.ditherRect(g, 0, 43, 32, 100, null, 'mist2', 0.3); A.ditherRect(g, 32, 43, 28, 100, null, 'mist2', 0.14);
      A.ditherRect(g, 288, 43, 32, 100, null, 'mist2', 0.2);
      // ---- foreground: wet cobbles, puddles only
      A.depth(g, 1);
      A.rect(g, -10, 138, 340, 50, 'slate1');
      A.rect(g, -10, 136, 340, 3, 'slate3'); A.hline(g, -10, 136, 340, 'slate4'); A.hline(g, -10, 139, 340, 'slate0');
      for (let r = 0, yy = 141; yy < 180; r++, yy += 4 + (r > 4)) {
        A.hline(g, 0, yy, 320, 'slate0');
        for (let xx = -(r % 2) * 5; xx < 320; xx += 10) { A.vline(g, xx, yy, 4, 'slate0'); if (h01(xx, r) > 0.6) A.hline(g, xx + 2, yy + 1, 5, 'slate2'); }
      }
      A.ditherGradient(g, 0, 139, 320, 40, 'night0', 'slate1', 'down');
      for (const [px, py, pw, ph] of [[24, 150, 56, 12], [150, 158, 64, 12], [244, 146, 56, 10]]) A.water(g, px, py, pw, ph, { t, amp: 0.8, dark: 0.5, color: 'slate2', gaps: 0.3, glints: 4, glint: 'amber5' });
      [f1.bx, f2.bx, f3.bx].forEach((x, i) => A.streak(g, x, 146, 26, { t, color: 'amber5', strength: 0.3, seed: i + 1 }));
      // ---- watchers
      A.mist(g, t, 140, 20, { amount: 0.25, speed: 4, seed: 6 });
      const sway = Math.round(Math.sin(t * 0.8) * 1.2);
      A.zombie(g, 36 + sway, 172, { variant: 'hat', t, facing: 'right', pose: 'stand', height: 52, hunch: 0.8 });
      const pz = A.zombie(g, 296, 164, { variant: 'phone', t, facing: 'left', pose: 'stand', height: 42, hunch: 0.7 });
      const ph0 = (pz && pz.hand) || { x: 290, y: 150 };
      A.glow(g, ph0.x, ph0.y, 16, { color: 'phone5', strength: 0.6, power: 1.2, q: 4 });
      A.dog(g, 196, 176, { coat: 'brown', pose: 'sit', look: 'up', t });
      const m = t % 9, face = m < 3 ? 'back' : m < 4.5 ? 'left' : m < 7.5 ? 'back' : 'right';
      A.man(g, 170, 177, { facing: face, pose: 'stand', t });
      A.mist(g, t, 160, 20, { amount: 0.22, speed: 7, seed: 11 });
    },
  };
})();
