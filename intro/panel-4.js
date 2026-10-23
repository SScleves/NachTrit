// Panel 4: the language left. One-point perspective street, vanishing point (200,108) in mist.
// Dutch words drift down the centre line into the fog; the English phone-talkers keep their backs turned.
// Story: 'hallo?' drifts up to a talker, gets 'sorry, English?', turns and leaves. 'de' and 'het' squabble off together.
// 'doei' goes last, hangs at the vanishing point, then the mist closes. Windows go out as 'gezellig' passes.
(function () {
  const hash8 = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >> 13)) * 1274126177 | 0; return ((h ^ (h >> 16)) >>> 0) / 4294967296; };
  const A = window.NRART;
  const VX = 200, VY = 108, T = 18, TAU = Math.PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const sm = (a, b, x) => { const k = cl((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
  // 3x5 pixel letters for the far words, which go into the pixel buffer so the mist can eat them
  const FONT = {
    a: '.#.#.####.##.#', d: '##.#.##.##.#.##.'.slice(0, 15), e: '###' + '#..' + '##.' + '#..' + '###', f: '###' + '#..' + '##.' + '#..' + '#..',
    g: '.##' + '#..' + '#.#' + '#.#' + '.##', h: '#.#' + '#.#' + '###' + '#.#' + '#.#', i: '###' + '.#.' + '.#.' + '.#.' + '###',
    k: '#.#' + '#.#' + '##.' + '#.#' + '#.#', l: '#..' + '#..' + '#..' + '#..' + '###', o: '.#.' + '#.#' + '#.#' + '#.#' + '.#.',
    r: '##.' + '#.#' + '##.' + '#.#' + '#.#', s: '.##' + '#..' + '.#.' + '..#' + '##.', t: '###' + '.#.' + '.#.' + '.#.' + '.#.',
    z: '###' + '..#' + '.#.' + '#..' + '###', '?': '##.' + '..#' + '.#.' + '...' + '.#.',
  };
  FONT.a = '.#.' + '#.#' + '###' + '#.#' + '#.#'; FONT.d = '##.' + '#.#' + '#.#' + '#.#' + '##.';
  const glyphs = (g, str, cx, y, c) => {
    const w = str.length * 4 - 1; let x0 = Math.round(cx - w / 2);
    for (const ch of str) { const p = FONT[ch]; if (p) for (let i = 0; i < 15; i++) if (p[i] === '#') A.px(g, x0 + (i % 3), y + ((i / 3) | 0), c); x0 += 4; }
  };
  // a local phone-talker: a back-turned silhouette, phone at the ear, cyan underglow on the face
  const talker = (g, x, y, h, o) => {
    const f = o.face, dir = f === 'left' ? -1 : 1, w = Math.max(2, Math.round(h / 7));
    const hd = Math.max(2, Math.round(h / 5));
    A.shadow(g, x, y, h / 3, 1.5, 0.5);
    A.rect(g, x - w, y - h * 0.38, w * 2, h * 0.38, o.legs);
    A.rect(g, x - w - 1, y - h * 0.74, w * 2 + 2, h * 0.38, o.coat);
    A.hline(g, x - w - 1, y - h * 0.74, w * 2 + 2, o.rim);
    const hx = x, hy = y - h * 0.74 - hd;
    A.disc(g, hx, hy, hd, o.hair);
    A.rect(g, hx + (dir > 0 ? 0 : -hd), hy - 1, hd, hd + 1, 'slate1');
    // arm up to the ear, phone
    const px = hx + dir * (hd + 1);
    A.line(g, x + dir * w, y - h * 0.68, px, hy + 1, o.coat);
    A.rect(g, px - (dir < 0 ? 0 : 1), hy - 1, 1, 3, 'slate0'); A.px(g, px + dir * 0, hy, 'phone6');
    const pulse = 0.8 + 0.2 * Math.sin(t0 * TAU / 2.5 + o.k);
    A.glow(g, hx + dir * hd * 0.6, hy + 1, Math.max(4, h / 3.2), { color: 'phone5', strength: 0.8 * pulse, power: 1.2, q: 4 });
    A.px(g, hx + dir * hd * 0.6, hy, 'phone5');
  };
  let t0 = 0;
  const WORDS = [
    { w: 'hallo?', s: 0.5, D: 12, lane: -36, kind: 'hover' },
    { w: 'gezellig', s: 4, D: 11, lane: 14 },
    { w: 'de', s: 7.5, D: 11, lane: -7, kind: 'pairA' },
    { w: 'het', s: 8.2, D: 11, lane: 8, kind: 'pairB' },
    { w: 'lekker', s: 11.5, D: 11, lane: 3 },
    { w: 'fiets', s: 14.5, D: 11, lane: 26 },
    { w: 'doei', s: 13, D: 15, lane: 0, kind: 'last' },
  ];
  // street geometry: kerb and house frontage lines converge on (VX, VY)
  const kerbHW = y => (y - VY) * 0.5 + 3, frontHW = y => (y - VY) * 0.72 + 14;
  const hLeft = [113, 117, 123, 131, 142, 157, 176, 234], hRight = [113, 117, 123, 131, 142, 158, 190];
  const GABLES = ['step', 'bell', 'neck', 'spout', 'roof'];
  const houseAt = (side, y, i) => {
    const w = (y - VY) * 0.5 + 8, h = (y - VY) * (y > 200 ? 0.95 : 1.3) + 16, hw = frontHW(y);
    return { x: side < 0 ? VX - hw - w : VX + hw, y, w, h, gb: GABLES[(i * 2 + (side > 0 ? 1 : 0)) % 5], uh: 1 - Math.pow((y - VY) / 68, 1 / 1.6), seed: i * 13 + (side > 0 ? 7 : 3) };
  };
  const HOUSES = [];
  hLeft.forEach((y, i) => HOUSES.push(houseAt(-1, y, i))); hRight.forEach((y, i) => HOUSES.push(houseAt(1, y, i)));
  HOUSES.sort((a, b) => a.y - b.y);
  const wordState = (W, t) => {
    const ph = (((t - W.s) % T) + T) % T / W.D;
    if (ph >= 1) return null;
    let u, lat = W.lane;
    if (W.kind === 'hover') {
      u = ph < 0.12 ? ph * 0.8 : ph < 0.38 ? 0.096 + (ph - 0.12) * 0.12 : 0.127 + (ph - 0.38) * (0.8 / 0.62);
      lat = W.lane * (1 - sm(0.4, 0.62, ph));
    } else if (W.kind === 'last') {
      u = 0.94 * sm(0, 1, Math.min(1, ph / 0.74)) * 0.55 + 0.94 * Math.min(1, ph / 0.74) * 0.45; if (ph > 0.74) u = 0.94;
    } else u = ph * 0.97;
    const bump = Math.exp(-Math.pow((ph - 0.3) * 9, 2));
    if (W.kind === 'pairB') lat = W.lane - 17 * bump; if (W.kind === 'pairA') lat = W.lane - 5 * Math.exp(-Math.pow((ph - 0.34) * 9, 2));
    return { ph, u, lat };
  };
  A.panels[3] = {
    text: 'The language had been ignored for years. Every time someone tried, the Dutch switched to English. One night it left.',
    nl: 'De taal werd al jaren genegeerd. Elke keer als iemand een poging deed, schakelden de Nederlanders over op Engels. Op een nacht is hij vertrokken.',
    draw(g, t) {
      t0 = t;
      const st = WORDS.map(W => wordState(W, t));
      const place = (s) => { const k = Math.pow(1 - s.u, 1.6), gy = VY + 68 * k; return { k, gy, x: VX + s.lat * k }; };
      const lead = st[1] ? place(st[1]) : { x: VX, gy: 130, k: 0.3 };
      A.camera(g, t, { x: 5, period: 8 }); A.key(g, lead.x, lead.gy - 14, 1);
      // ---- sky and the far skyline the words are heading for
      A.depth(g, 0);
      A.sky(g, ['night0', 'night1', 'night2', 'mist0', 'mist2'], -4, 112);
      A.stars(g, t, { n: 22, h: 40, y1: 50 });
      A.haze(g, -20, 30, 360, 82, { top: 0, bottom: 0.7, color: 'mist3' });
      A.depth(g, 0.2);
      A.church(g, 168, 113, 0.75, { tone: 'night3' });
      A.windmill(g, 250, 114, 0.6, -t * 0.4, { tone: 'night3', t });
      A.haze(g, -20, 60, 360, 60, { top: 0.35, bottom: 0.7, color: 'mist4' });
      A.rect(g, -20, VY - 1, 360, 90, 'night1');
      A.depth(g, 0.4);
      A.archBridge(g, VX - 28, VY + 3, 56, 7);
      A.haze(g, -20, 90, 360, 40, { top: 0.4, bottom: 0.7, color: 'mist4' });
      // ---- ground: pavements, kerbs, wet road
      A.depth(g, 1);
      A.rect(g, -20, VY + 1, 360, 90, 'night1');
      for (const s of [-1, 1]) {
        A.poly(g, [[VX, VY], [VX + s * kerbHW(190), 190], [VX + s * frontHW(190), 190]], 'night2');
        A.line(g, VX + s * 3, VY, VX + s * kerbHW(190), 190, 'slate3');
        A.line(g, VX + s * 3 + 0, VY + 1, VX + s * (kerbHW(190) - 1), 190, 'night0');
      }
      // ---- houses, far to near, hazed in groups
      let g1 = false, g2 = false;
      const lg = st[1] ? st[1].u : -1, q = (((t - 4) % T) + T) % T / T;
      HOUSES.forEach((H, i) => {
        if (!g1 && H.y > 124) { g1 = true; A.haze(g, -20, 0, 360, 130, { top: 0.35, bottom: 0.6, color: 'mist4' }); }
        if (!g2 && H.y > 150) { g2 = true; A.haze(g, -20, 0, 360, 160, { top: 0.1, bottom: 0.32, color: 'mist3' }); }
        let lit = 0.85;
        const keep = H.seed === 3 + 6 * 13 || H.seed === 7 + 5 * 13;
        if (!keep) { if (q < 11 / T) lit = lg > H.uh ? Math.max(0, 0.85 - (lg - H.uh) * 14) : 0.85; else lit = q < 0.86 ? 0 : 0.85 * sm(0.86, 0.97, q); }
        if (hash8(i, Math.floor(t * 6)) < 0.04) lit *= 0.6;
        A.canalHouse(g, H.x, H.y, H.w, H.h, { gable: H.gb, lit, t, seed: H.seed, brick: H.y > 124 ? undefined : 'slate' });
      });
      A.haze(g, -20, 0, 360, 190, { top: 0, bottom: 0.14, color: 'mist2' });
      // wet road over the houses' feet
      A.poly(g, [[VX, VY], [VX + kerbHW(190) - 1, 190], [VX - kerbHW(190) + 1, 190]], 'night1');
      A.ditherGradient(g, 100, 128, 200, 62, 'night1', 'night0', 'down');
      for (let k = 0; k < 7; k++) { const y = VY + 68 * Math.pow(0.88, k * 1.0) * 0 + 6 + k * k * 1.9; const len = 2 + (y - VY) * 0.1; A.rect(g, VX - 1, y, Math.max(1, (y - VY) / 34), len, 'mist3'); }
      // ---- the street furniture
      const L1 = A.lamp(g, 163, 182, { style: 'lantern', h: 76, flicker: 0.1, t, seed: 3, reach: 56, cone: 0.3 });
      A.lamp(g, VX + kerbHW(146) + 1, 146, { style: 'lantern', h: 34, t, seed: 5, reach: 30, cone: 0.2 });
      A.lamp(g, VX - kerbHW(126) - 1, 126, { style: 'lantern', h: 19, t, seed: 7, reach: 14, cone: 0.15 });
      A.streak(g, 163, 183, 9, { t, seed: 1, width: 2 });
      A.streak(g, VX + kerbHW(146) + 1, 147, 8, { t, seed: 2, width: 2 });
      A.glow(g, 163, 184, 24, { ry: 3, color: 'amber5', strength: 0.55, power: 1.2 });
      [[VX - kerbHW(160) - 4, 160, 7], [VX + kerbHW(164) + 4, 164, 7], [VX + kerbHW(133) + 3, 133, 4], [VX - kerbHW(118) - 3, 118, 3]].forEach(([x, y, h]) => A.bollard(g, x, y, { h }));
      A.tulips(g, 224, 160, 12);
      A.omafiets(g, 147, 188, { rider: false, t: 0, speed: 0 });
      A.fingerpost(g, 250, 188, { signs: [['Nederlands', 'left'], ['Engels', 'right']] });
      // the phone-talkers, backs turned on the leaving words
      talker(g, 126, 176, 27, { face: 'left', coat: 'teal3', legs: 'night2', hair: 'wood2', rim: 'teal5', k: 0 });
      talker(g, 277, 170, 21, { face: 'right', coat: 'red3', legs: 'night1', hair: 'night0', rim: 'red5', k: 2 });
      talker(g, 183, 124, 10, { face: 'left', coat: 'slate3', legs: 'night1', hair: 'paper2', rim: 'slate5', k: 4 });
      // ---- wet fog over everything, then the words go into it
      A.mist(g, t, 100, 30, { amount: 0.4, speed: 5, seed: 4 });
      // words: near ones live on the overlay, far ones in the pixel buffer so the mist takes them
      const over = [];
      const wetLen = (s) => Math.round(4 + 14 * s);
      WORDS.forEach((W, i) => {
        const s = st[i]; if (!s) return;
        const p = place(s), sc = p.k, grow = sm(0, 0.07, s.u);
        const float = Math.sin(t * 1.3 + i * 2) * 1.5 * sc;
        const y = Math.round(p.gy - 4 - 8 * sc - float), x = Math.round(p.x);
        const e = (W.kind === 'last' && s.ph > 0.9) ? 1 - sm(0.9, 1, s.ph) : 1;
        // ground pool and wet streak beneath
        A.glow(g, x, p.gy + 1, 4 + 20 * sc, { ry: 1 + 3 * sc, color: 'amber5', strength: 0.55 * grow * e, power: 1.1, q: 4 });
        if (sc > 0.08) A.streak(g, x, Math.round(p.gy + 2), wetLen(sc), { color: sc > 0.5 ? 'amber6' : 'amber5', strength: 0.7 * grow, t, seed: i * 5, width: sc > 0.6 ? 2 : 1 });
        if (sc > 0.5) {
          const size = Math.round(6 + 4 * sm(0, 0.07, s.u)) > 0 ? Math.max(5, Math.round(10 * sc * (0.85 + 0.15 * grow))) : 6;
          const fs = s.u < 0.07 ? Math.round(6 + 4 * grow) : size;
          A.glow(g, x, y - fs * 0.4, 6 + 12 * sc, { color: 'amber5', strength: 0.5 * grow, ry: 4 + 6 * sc, power: 1.3, q: 4 });
          over.push([x, y, W.w, sc > 0.75 ? 'amber7' : 'amber6', fs]);
        } else if (sc > 0.28) {
          A.glow(g, x, y - 2, 7, { color: 'amber5', strength: 0.35 * e, power: 1.3, q: 3 });
          glyphs(g, W.w, x, y - 4, sc > 0.4 ? 'amber6' : 'amber5');
        } else {
          const len = Math.round(W.w.length * (1.0 + 4 * sc)), c = W.kind === 'last' ? 'amber5' : sc > 0.15 ? 'amber5' : 'amber4';
          if (W.kind === 'last' && sc < 0.12) {
            const hang = 1 - sm(0.86, 0.99, s.ph); const wave = Math.round(Math.sin(t * 5)) ;
            if (hang > 0.05) { A.glow(g, x, y, 8, { color: 'amber5', strength: 0.45 * hang, q: 3 }); glyphs(g, W.w, x, y - 4 + wave, hang > 0.6 ? 'amber5' : hang > 0.3 ? 'amber3' : 'mist5'); }
          } else {
            A.glow(g, x, y, 4 + 6 * sc, { color: 'amber5', strength: 0.3 * e, q: 3 });
            for (let k = 0; k < len; k++) if (hash8(k + i * 7, 3) > 0.25) A.px(g, x - (len >> 1) + k, y + (k & 1), c);
          }
        }
      });
      // the closing mist: a dense bank at the vanishing point, thickest while doei hangs there
      const dl = st[6] ? sm(0.7, 0.98, st[6].ph) : 0;
      A.glow(g, VX, VY + 2, 54, { mode: 'mix', color: 'mist4', strength: 0.5 + 0.3 * dl, ry: 22, power: 0.9, q: 6 });
      A.mist(g, t * 0.7, 118, 22, { amount: 0.3, speed: 8, seed: 9, color: 'mist4' });
      A.haze(g, -20, 150, 360, 40, { top: 0.0, bottom: 0.12, color: 'mist2' });
      // overlay text last: near words only
      over.forEach(([x, y, w, c, fs]) => A.text(x, y, w, A.hex(c), fs, true, { align: 'center' }));
      // the one-line story: 'hallo?' asks, the talker answers in English
      const hs = st[0];
      if (hs && hs.ph > 0.2 && hs.ph < 0.42) A.say(g, 124, 176 - 27 - 5, 'sorry, English?', { size: 5 });
      const b = Math.floor(t / 3) % 6;
      if (!(hs && hs.ph > 0.18 && hs.ph < 0.44)) {
        if (b === 1 || b === 4) A.say(g, 277, 170 - 21 - 8, b === 1 ? 'omg, same' : 'yeah no, so fine', { size: 5 });
      }
    },
  };
})();
