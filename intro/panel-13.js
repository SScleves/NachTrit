// Panel 10: no helmet. A helmet would make him look enthusiastic.
// A wet canal quay at night. The man stands deadpan beside a never-used helmet (price tag still on); a dog
// has brought it over and looks up at him. The lantern behind them throws a cone onto the helmet. The bike
// stands in half-light behind the lamp. A far zombie crosses the drawbridge bare-headed (nobody wears one).
// Key light: the lantern. Loops (8 s): mill sails, canal water, mist, far zombie, star twinkle, lamp dip, moth,
// blinks, dog tail, puddle ripples, and the "nee." bubble (held 4 s after a beat of silence, never strobed).
//
// Speed: everything that does not move is painted once into a cached buffer and copied back each frame.
// The mill sails are 16 pre-painted frames of the mill's patch (the sails repeat every quarter turn).
(function () {
  const A = window.NRART;
  const K = 16, MILL = { x: 60, y: 114, s: 0.9 }, PATCH = { x: 20, y: 26, w: 82, h: 80 };
  const LAMP = { x: 162, y: 161, h: 62 }, HELM = { x: 124, y: 170 }, MAN = { x: 96, y: 160 }, DOG = { x: 150, y: 170 };
  const NEAR_LAMP = { x: 70, y: 143, h: 28 };
  const rnd = Math.round;

  // ---------------------------------------------------------------- the helmet (profile, facing right, ~30 px long)
  // A road helmet resting on its crown: domed shell, four vent slots, darker visor lip, shell stripe, a hint of
  // foam under the rim, one amber specular from the lantern. Never used: the strap and tag come in helmetTrail().
  const shell = dx => {                      // shell height at column dx (-16..10): an aero dome, peak at -2, long tail
    const u = dx < -2 ? (dx + 2) / 14.5 : (dx + 2) / 12.5; if (Math.abs(u) >= 1) return 0;
    return Math.max(1, rnd(15 * Math.sqrt(1 - u * u)));
  };
  const helmetBody = (g, x, y) => {
    A.shadow(g, x + 1, y, 17, 3, 0.75);
    // outline first (night1), then the shell: lit along the crown toward the lantern (upper right), turning away below
    for (let dx = -16; dx <= 11; dx++) { const h = shell(dx) || 1; A.vline(g, x + dx, y - 3 - h, h + 2, 'night1'); }
    for (let dx = -15; dx <= 10; dx++) {
      const h = shell(dx) - 1; if (h < 1) continue;
      for (let r = 0; r < h; r++) {             // r = 0 is the shell bottom, h-1 the crown
        const f = r / Math.max(1, h - 1) + (dx + 2) * 0.012;
        A.px(g, x + dx, y - 3 - r, f > 0.86 ? 'paper6' : f > 0.62 ? 'paper5' : f > 0.36 ? 'paper4' : f > 0.14 ? 'paper3' : 'paper2');
      }
    }
    // the rim underneath: dark padding showing at the front, so it reads as hollow
    A.hline(g, x - 14, y - 3, 24, 'night1'); A.hline(g, x - 9, y - 2, 18, 'night1'); A.hline(g, x + 1, y - 3, 8, 'slate4');
    // shell stripe hugging the rim (the "enthusiasm"): a red band with a highlight
    for (let dx = -12; dx <= 9; dx++) { A.px(g, x + dx, y - 4, 'red4'); A.px(g, x + dx, y - 5, dx > -4 ? 'red5' : 'red4'); }
    // vents run front to back, so in profile they are slots along the dome: two rows of dark dashes, a lit lip above each
    for (const [fr, x0, x1] of [[0.74, -10, 6], [0.44, -13, 8]]) for (let dx = x0; dx <= x1; dx++) {
      if (((dx - x0) % 6) > 3) continue;
      const yy = y - 3 - rnd((shell(dx) - 1) * fr);
      A.px(g, x + dx, yy, 'night2'); A.px(g, x + dx, yy - 1, fr > 0.6 ? 'paper6' : 'paper5');
    }
    // visor lip at the front: a dark, glossy peak
    A.rect(g, x + 8, y - 7, 8, 2, 'night1'); A.hline(g, x + 9, y - 8, 5, 'night1'); A.hline(g, x + 9, y - 7, 6, 'steel1'); A.hline(g, x + 12, y - 7, 3, 'steel3');
    A.px(g, x + 16, y - 6, 'night1');
    // rear tail pin
    A.rect(g, x - 16, y - 5, 2, 2, 'night1'); A.px(g, x - 15, y - 5, 'steel3');
    // the lantern's glint on the crown
    A.px(g, x + 1, y - 17, 'amber8'); A.px(g, x + 2, y - 16, 'amber7'); A.px(g, x, y - 17, 'amber6'); A.px(g, x + 3, y - 15, 'amber5');
  };
  // the loose chin strap with its buckle, and the shop tag still on a string
  const helmetTrail = (g, x, y) => {
    A.line(g, x + 1, y - 2, x + 6, y + 1, 'night1'); A.line(g, x + 6, y + 1, x + 12, y + 3, 'night1'); A.line(g, x + 12, y + 3, x + 18, y + 2, 'night1');
    A.line(g, x + 2, y - 2, x + 7, y + 2, 'slate4'); A.line(g, x + 7, y + 2, x + 12, y + 4, 'slate4'); A.line(g, x + 13, y + 4, x + 18, y + 3, 'slate3');
    A.rect(g, x + 18, y + 1, 4, 3, 'steel4'); A.hline(g, x + 18, y + 1, 4, 'steel6'); A.px(g, x + 19, y + 2, 'night1'); A.px(g, x + 20, y + 2, 'night1');
    // tag on a string from the left vent
    A.line(g, x - 9, y - 4, x - 14, y + 1, 'paper3'); A.line(g, x - 14, y + 1, x - 17, y + 3, 'paper3');
    A.rect(g, x - 31, y + 1, 16, 8, 'night1'); A.rect(g, x - 30, y + 2, 14, 6, 'paper6'); A.px(g, x - 16, y + 2, 'night1'); A.px(g, x - 17, y + 2, 'slate3');
    A.hline(g, x - 30, y + 7, 14, 'paper3'); A.rect(g, x - 30, y + 2, 1, 6, 'red4');
    A.text(x - 22, y + 7, '€59,95', 'night1', 3.6, true, { align: 'center' });
  };

  // ---------------------------------------------------------------- a wet puddle that mirrors what stands above it
  const puddle = (g, cx, cy, rx, ry, baseY, t, seed, dark) => {
    const L = A.lut('mix', 'night2', dark == null ? 0.5 : dark), buf = g.buf, w = g.w;
    for (let yy = cy - ry; yy <= cy + ry; yy++) {
      if (yy < 0 || yy >= g.h) continue;
      const dy = (yy - cy) / ry, e = rx * Math.sqrt(Math.max(0, 1 - dy * dy)) * (1 + 0.16 * Math.sin(yy * 1.7 + seed));
      const x0 = Math.max(0, rnd(cx - e)), x1 = Math.min(w - 1, rnd(cx + e)), sy = 2 * baseY - yy - 1;
      const off = rnd(Math.sin(yy * 1.3 + t * (Math.PI / 4) * 2 + seed) * 0.62);
      for (let xx = x0; xx <= x1; xx++) {
        const sx = Math.max(0, Math.min(w - 1, xx + off));
        buf[yy * w + xx] = sy < 0 ? A.C.night1 : L[buf[sy * w + sx]];
      }
    }
  };

  // ---------------------------------------------------------------- big dark bollard for the near frame (cropped by the bottom)
  const bigBollard = (g, x, baseY, h) => {
    const top = baseY - h;
    A.rect(g, x + 1, top + 4, 8, h, 'night0'); A.rect(g, x + 2, top + 1, 6, 4, 'night0'); A.rect(g, x + 3, top, 4, 2, 'night0');
    A.vline(g, x + 8, top + 5, h - 2, 'slate2'); A.vline(g, x + 7, top + 5, h - 2, 'slate1');     // lamp-lit right edge
    A.px(g, x + 7, top + 1, 'slate2');
    A.hline(g, x + 1, top + 11, 8, 'slate0'); A.hline(g, x + 1, top + 12, 8, 'night1');            // the collar
    A.rect(g, x + 1, top + 9, 8, 1, 'red2');
  };

  // ---------------------------------------------------------------- stars (kept out of the haze)
  const STARS = [];
  for (let i = 0; i < 34; i++) {
    const x = Math.floor(A.hash(i, 9) * 320), y = 2 + Math.floor(A.hash(i, 10) * 30), b = A.hash(i, 11);
    if (Math.abs(x - 298) < 9 && y < 36) continue;
    STARS.push([x, y, b]);
  }
  const TWINK = STARS.filter(([x, y]) => (x > 104 || y < 24) && y < 26).slice(0, 7);

  // ---------------------------------------------------------------- the painted layers
  // layers 0-2: sky, mill and church, houses: everything the mill patch can touch
  const far = (g, k) => {
    A.key(g, LAMP.x, 96, 2);
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist1', 'mist2'], 0, 118);
    for (const [x, y, b] of STARS) A.px(g, x, y, b > 0.9 ? 'paper6' : b > 0.55 ? 'mist6' : 'mist4');
    A.moon(g, 298, 24, 3, { halo: 0.16 });
    A.haze(g, 0, 20, 320, 98, { top: 0, bottom: 0.3, color: 'mist3' });
    // far layer: mill, church, trees, solid shapes a step darker than the fog
    A.windmill(g, MILL.x, MILL.y, MILL.s, -(k / K) * Math.PI / 2, { tone: 'night2', sail: 'night0', cloth: 1, stage: true, lit: 0.7 });
    A.church(g, 270, 114, 0.85, { tone: 'night2' });
    A.tree(g, 104, 114, 0.75, { tone: 'night2' }); A.tree(g, 190, 114, 0.6, { tone: 'night2' }); A.tree(g, 308, 114, 0.7, { tone: 'night2' });
    A.haze(g, 0, 40, 320, 78, { top: 0.05, bottom: 0.36, color: 'mist3' });
    // mid layer: canal houses and the drawbridge, a step darker, a few amber windows
    [[88, 24, 40, 'step'], [112, 22, 34, 'bell'], [134, 26, 46, 'neck'], [162, 22, 30, 'roof'], [258, 24, 36, 'step'], [282, 30, 44, 'bell']].forEach(([x, w, h, gb], i) =>
      A.canalHouse(g, x, 116, w, h, { gable: gb, lit: 0.34, t: 0, seed: 70 + i, brick: 'night1', trim: 'night2' }));
    A.drawbridge(g, 196, 116, 56, { tone: 'night4' });
    A.haze(g, 0, 56, 320, 62, { top: 0.04, bottom: 0.3, color: 'mist3' });
  };

  const paintBase = g => {
    far(g, 0);
    // far quay, canal
    A.rect(g, 0, 116, 320, 3, 'mist0'); A.hline(g, 0, 116, 320, 'mist2'); A.hline(g, 0, 118, 320, 'night2');
    A.rect(g, 0, 119, 320, 18, 'night1');
    A.water(g, 0, 119, 320, 18, { t: 0, amp: 0.8, dark: 0.55, color: 'night2', gaps: 0.25, glints: 6 });
    // near quay: lip, then cobbles all the way down, in perspective (bigger stones toward us)
    A.rect(g, 0, 137, 320, 3, 'slate3'); A.hline(g, 0, 137, 320, 'slate5'); A.hline(g, 0, 139, 320, 'slate1');
    A.rect(g, 0, 140, 320, 40, 'slate1');
    let y = 140;
    [4, 4, 5, 5, 6, 6, 7, 7].forEach((h, r) => {
      const sw = 5 + (r >> 1), off = (r & 1) * (sw >> 1);
      A.hline(g, 0, y, 320, 'slate0');
      for (let c = -1; c * sw < 330; c++) {
        const x = c * sw - off, hh = A.hash(c, r + 40);
        A.hline(g, x + 1, y + 1, sw - 2, hh > 0.55 ? 'slate3' : 'slate2');
        if (h > 4) A.hline(g, x + 1, y + 2, sw - 2, hh > 0.8 ? 'slate2' : 'slate1');
        if (hh > 0.7) A.px(g, x + 1, y + 1, 'slate4');
        A.vline(g, x, y, h, 'slate0');
      }
      y += h;
    });
    // wet sheen: broken pale dashes along the joints, brighter under the lantern
    for (let i = 0; i < 60; i++) {
      const sx = rnd(A.hash(i, 61) * 320), sy = 142 + rnd(A.hash(i, 62) * 36), sl = 4 + rnd(A.hash(i, 63) * 8), warm = Math.abs(sx - LAMP.x) < 40;
      A.hline(g, sx, sy, sl, warm ? 'slate5' : 'slate4');
    }
    // street furniture on the quay
    A.bollard(g, 46, 150); A.bollard(g, 52, 150);
    A.fingerpost(g, 288, 161, {});
    // the big near house on the left, a lit window with a cat, a tulip planter
    A.canalHouse(g, -30, 140, 50, 100, { gable: 'roof', lit: 0.5, t: 0, seed: 3, brick: 'brick0' });
    A.window(g, 6, 112, 9, 12, { lit: 0.95, t: 0, seed: 3, frame: 'night2', detail: 'cat', bars: 'v' });
    A.tulips(g, 24, 154, 18, { t: 0 });
    // the tall modern lamp on the quay edge: cold light, a counterpoint to the lantern's amber
    A.lamp(g, NEAR_LAMP.x, NEAR_LAMP.y, { style: 'modern', h: NEAR_LAMP.h, on: true, reach: 24, cone: 0.22 });
    // bike first, so the lantern post overlaps it; then push it into half-light
    A.omafiets(g, 198, 160, { facing: 'left', basket: 'book', t: 0 });
    A.tint(g, 160, 128, 60, 34, 'night0', 0.42, 'mul');
    // the lantern, between man and helmet, with a visible cone falling on the helmet like a spotlight
    const [lx, ly] = A.lamp(g, LAMP.x, LAMP.y, { t: 0, style: 'lantern', h: LAMP.h, light: false });
    const ang = Math.atan2(HELM.y - 6 - ly, HELM.x - lx);
    A.glow(g, lx, ly, 20, { color: 'amber6', strength: 0.5, power: 1.6 });
    A.cone(g, lx - 1, ly + 3, ang, 0.19, 84, { color: 'amber7', strength: 0.42, width: 4, fade: 0.55, edge: 0.55 });
    A.glow(g, HELM.x + 4, HELM.y - 4, 30, { ry: 13, strength: 0.5, power: 1, color: 'amber6' });
    A.glow(g, lx, LAMP.y + 2, 30, { ry: 6, strength: 0.28, power: 1, color: 'amber5' });
    helmetBody(g, HELM.x, HELM.y);
    A.clogs(g, 236, 174); A.tint(g, 230, 166, 20, 10, 'night0', 0.3, 'mul');   // a pair of clogs somebody left by the bike
    // near frame: a big dark bollard pair at the bottom left and one at the right, cropped by the frame
    bigBollard(g, 6, 192, 40); bigBollard(g, 30, 196, 38); bigBollard(g, 306, 196, 40);
    A.line(g, 14, 160, 22, 164, 'night1'); A.line(g, 22, 164, 30, 160, 'night1');          // the chain between the pair
    return { lx, ly };
  };

  // ---------------------------------------------------------------- cache
  let cache = null;
  const takePatch = S => {
    const rows = [];
    for (let r = 0; r < PATCH.h; r++) rows.push(S.buf.slice((PATCH.y + r) * S.w + PATCH.x, (PATCH.y + r) * S.w + PATCH.x + PATCH.w));
    return rows;
  };
  const build = g => {
    const S = A.surface(g.w, g.h), n0 = A.labels.length;
    S.buf.fill(A.C.night1);
    const lamp = paintBase(S);
    const labels = A.labels.splice(n0);
    cache = { w: g.w, h: g.h, base: S.buf.slice(), labels, lamp, patch: new Array(K).fill(null), S };
    cache.patch[0] = takePatch(S);
  };
  const buildPatch = k => { const S = cache.S; S.buf.fill(A.C.night1); far(S, k); cache.patch[k] = takePatch(S); };
  const putPatch = (g, k) => {
    let p = cache.patch[k]; for (let j = k; !p && j > 0; j--) p = cache.patch[j];
    for (let r = 0; r < PATCH.h; r++) g.buf.set(p[r], (PATCH.y + r) * g.w + PATCH.x);
  };

  A.panels[12] = {
    text: 'No helmet. A helmet would make him look enthusiastic.',
    nl: 'Geen helm. Met een helm zou hij enthousiast overkomen.',
    draw(g, t) {
      if (!cache || cache.w !== g.w || cache.h !== g.h) build(g);
      const tm = t % 8, T = t * Math.PI / 4;   // one full turn of every sine per 8 s loop
      // the sail frame we need first, then a few more each draw until all 16 exist
      const need = Math.floor((tm / 8) * 2 * K) % K;
      if (!cache.patch[need]) buildPatch(need);
      for (let k = 0, n = 0; k < K && n < 3; k++) if (!cache.patch[k]) { buildPatch(k); n++; }
      g.buf.set(cache.base);
      putPatch(g, need);
      A.key(g, LAMP.x, 96, 2);
      for (const l of cache.labels) A.labels.push(l);

      // star twinkle
      for (let i = 0; i < TWINK.length; i++) {
        const [x, y] = TWINK[i], s = Math.sin(T * 2 + i * 1.9);
        A.px(g, x, y, s > 0.4 ? 'paper6' : s > -0.5 ? 'mist6' : 'mist3');
      }
      // far zombie on the drawbridge, bare-headed, walking to and fro (nobody here wears a helmet)
      A.zombie(g, 224 + rnd(Math.sin(T) * 12), 113, { variant: 'plain', pose: 'walk', t, height: 26, hunch: 0.85, tone: 'night2', glow: 1 });
      // the canal, then what floats on it
      A.water(g, 0, 119, 320, 18, { t, amp: 0.8, dark: 0.55, color: 'night2', gaps: 0.25, glints: 6 });
      A.boat(g, 252, 130, { kind: 'barge', len: 56, t });
      A.streak(g, 244, 131, 5, { t, seed: 5, strength: 0.5 }); A.streak(g, 262, 131, 5, { t, seed: 6, strength: 0.5 });
      A.reeds(g, 24, 137, 36, 15, { t });
      A.duck(g, 134, 133, { t, facing: 'left' });
      A.streak(g, NEAR_LAMP.x + 9, 120, 15, { t, seed: 1, color: 'paper5', strength: 0.4 });
      // restore the modern lamp's post where the water rippled over it
      for (let yy = 119; yy < 137; yy++) { const i = yy * g.w + NEAR_LAMP.x; g.buf[i] = cache.base[i]; g.buf[i + 1] = cache.base[i + 1]; }
      A.mist(g, t, 128, 18, { amount: 0.34, speed: 4, seed: 4 });

      // lantern dips now and then
      if (A.hash(Math.floor(t * 9), 6) < 0.05) {
        A.glow(g, cache.lamp.lx, cache.lamp.ly, 18, { mode: 'mul', color: 'night0', strength: 0.32, power: 1.2 });
        A.rect(g, cache.lamp.lx - 1, cache.lamp.ly - 3, 4, 5, 'amber4');
      }

      // cast: man a little behind, dog beside the helmet looking up at him
      const blink = tm > 2.7 && tm < 2.95;
      A.man(g, MAN.x, MAN.y, { t, facing: 'right', face: blink ? 'blink' : 'deadpan' });
      A.dog(g, DOG.x, DOG.y, { t, coat: 'brown', pose: 'sit', look: 'up', facing: 'left' });
      A.glow(g, DOG.x + 2, DOG.y - 8, 14, { ry: 10, strength: 0.3, power: 1, color: 'amber5' });

      // wet ground under them, mirroring man, helmet, dog, lantern and bike
      puddle(g, 98, 167, 21, 6, MAN.y, t, 1, 0.6);
      puddle(g, 128, 176, 29, 5, HELM.y, t, 3, 0.62);
      puddle(g, 194, 166, 24, 5, LAMP.y, t, 5, 0.65);
      A.streak(g, LAMP.x + 1, LAMP.y + 2, 12, { t, seed: 2, width: 2, strength: 0.7 });
      A.streak(g, HELM.x + 4, HELM.y + 1, 7, { t, seed: 8, strength: 0.35 });
      helmetTrail(g, HELM.x, HELM.y);

      // a moth at the lantern
      A.px(g, cache.lamp.lx + rnd(Math.sin(T * 5) * 6), cache.lamp.ly + 8 + rnd(Math.cos(T * 3) * 5), 'paper6');
      // deadpan: silence, then "nee." held for 4 s; never strobed
      if (tm >= 3 && tm < 7) A.say(g, MAN.x + 1, MAN.y - 41, 'nee.', {});
    },
  };
})();
