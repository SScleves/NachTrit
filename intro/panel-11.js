// Panel 8: every word said right brings a piece of it back; someone has to say them.
// One 8 s loop, read left to right and in time:
//   0-1.5 s   the hero says "de fiets"; amber motes leave his mouth, fog gathers over open sky and the word
//             sharpens out of it into gold, a lamp made of language
//   ~2-3.3 s  a thread of amber motes runs from the word to the one dark window
//   3.3 s     the window catches with a flicker and then stays lit until the loop ends
//   7-8 s     a mist pass hides the reset (the window is never switched off in the open)
// The street is deliberately dark: the word and the window are the only warm notes.
// Loop hygiene: the camera drifts out and back in exactly 8 s, the mill turns one quarter (the sails repeat every
// PI/2), the drifting mist sways out and back, every other motion is a function of T = t % 8 with periods 8, 4, 2, 1.
// Speed: everything that never moves is painted once per camera offset and copied back each frame.
(function () {
  const A = window.NRART;
  const TAU = Math.PI * 2;
  const sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  const bez = (a, b, c, u) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * c;
  const WX = 206, WY = 66;                          // the word, in open fog (the text baseline)
  const WIN = { x: 70, y: 104, w: 20, h: 22 };      // the one window that comes back
  const MOUTH = [109, 116];
  const GROUND = 157;                               // where the cast stands

  // ---------------------------------------------------------------- a cheap light: the falloff is tabulated once
  const BAY = new Float32Array([0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16));
  const falloffs = new Map();
  function falloff(r, ry, pw) {
    const key = r + ':' + ry + ':' + pw; let f = falloffs.get(key); if (f) return f;
    const w = 2 * r + 1, h = 2 * ry + 1, tab = new Float32Array(w * h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const dx = (i - r) / r, dy = (j - ry) / ry, d2 = dx * dx + dy * dy;
      tab[j * w + i] = d2 >= 1 ? 0 : Math.pow(1 - Math.sqrt(d2), pw);
    }
    f = { w, h, tab }; falloffs.set(key, f); return f;
  }
  // light (mode 'add'), fog ('mix') or shade ('mul') around (x, y), like NRART.glow but with the falloff precomputed
  function glow(g, x, y, r, color, strength, o) {
    o = o || {}; const mode = o.mode || 'add', Q = 6, pw = o.power == null ? 1.5 : o.power, ry = o.ry || r;
    const st = Math.round(strength * 20) / 20; if (st <= 0) return;
    const Ls = []; for (let q = 0; q <= Q; q++) Ls.push(A.lut(mode, color, st * q / Q));
    const f = falloff(r, ry, pw), cx = Math.round(x) + g.ox, cy = Math.round(y) + g.oy, buf = g.buf, gw = g.w;
    const x0 = Math.max(0, cx - r), x1 = Math.min(gw - 1, cx + r), y0 = Math.max(0, cy - ry), y1 = Math.min(g.h - 1, cy + ry);
    for (let yy = y0; yy <= y1; yy++) {
      const row = (yy - cy + ry) * f.w + r - cx;
      for (let xx = x0; xx <= x1; xx++) {
        const lv = f.tab[row + xx]; if (lv <= 0) continue;
        const v = lv * Q; let q = v | 0; if (v - q > BAY[((yy & 3) << 2) | (xx & 3)]) q++;
        if (q > 0) { const i = yy * gw + xx; buf[i] = Ls[q > Q ? Q : q][buf[i]]; }
      }
    }
  }

  // fog over a rect: pull pixels toward `color` by an amount that runs top to bottom (a cheap NRART.haze)
  function fog(g, x, y, w, h, color, top, bottom) {
    const Q = 8, Ls = []; for (let q = 0; q <= Q; q++) Ls.push(A.lut('mix', color, q / Q));
    const buf = g.buf, gw = g.w, x0 = Math.max(0, x + g.ox), x1 = Math.min(gw, x + g.ox + w), y0 = Math.max(0, y + g.oy), y1 = Math.min(g.h, y + g.oy + h);
    for (let yy = y0; yy < y1; yy++) {
      const v = (top + (bottom - top) * (yy - y0 + 0.5) / (y1 - y0)) * Q; if (v <= 0) continue;
      const q0 = v | 0, fr = v - q0, A0 = Ls[q0], A1 = Ls[Math.min(Q, q0 + 1)], row = yy * gw, by = (yy & 3) << 2;
      for (let xx = x0; xx < x1; xx++) { const i = row + xx; buf[i] = (fr > BAY[by | (xx & 3)] ? A1 : A0)[buf[i]]; }
    }
  }

  // drifting mist, like NRART.mist but with the noise tabulated (it moves in whole pixels): a soft band that thickens and thins along x
  const noise = new Map();
  function noiseTab(seed, w) {
    const key = seed + ':' + w; let n = noise.get(key); if (n) return n;
    n = { a: new Float32Array(w), b: new Float32Array(w) };
    for (let i = 0; i < w; i++) { n.a[i] = A.wave(i, w, seed); n.b[i] = A.wave(i * 0.5 + 40, w, seed + 3); }
    noise.set(key, n); return n;
  }
  const AMB0 = A.col('amber0'), AMB8 = A.col('amber8');
  function mist(g, shift, y, h, amt, seed, color) {
    const Q = 8, Ls = []; for (let q = 0; q <= Q; q++) Ls.push(A.lut('mix', color, Math.round(q / Q * 20) / 20));
    const gw = g.w, buf = g.buf, nt = noiseTab(seed, gw), cy0 = y + g.oy + h / 2, sh = Math.round(shift);
    for (let xx = 0; xx < gw; xx++) {
      const idx = (((xx - g.ox + sh) % gw) + gw) % gw, n = nt.a[idx], n2 = nt.b[idx];
      const th = Math.max(0.5, h * (0.35 + 0.65 * n) / 2), cy = cy0 + (n2 - 0.5) * h * 0.5;
      const r0 = Math.max(0, Math.ceil(cy - th)), r1 = Math.min(g.h - 1, Math.floor(cy + th)), base = amt * (0.55 + 0.45 * n);
      for (let yy = r0; yy <= r1; yy++) {
        const d = Math.abs(yy + 0.5 - cy) / th; if (d >= 1) continue;
        const i = yy * gw + xx, c = buf[i]; let lv = base * (1 - d * d); if (c >= AMB0 && c <= AMB8) lv *= 0.3;
        const v = lv * Q; let q = v | 0; if (v - q > BAY[((yy & 3) << 2) | (xx & 3)]) q++;
        if (q > 0) buf[i] = Ls[q > Q ? Q : q][c];
      }
    }
  }

  // the windmill is the one big moving thing, so each angle (96 per full turn of the sails' symmetry) is drawn once into its own sprite
  const MILL = { x: 296, y: 126, s: 0.95, steps: 48, w: 96, h: 80, ax: 48, ay: 66 };
  const millSprites = [];
  function millSprite(g, step) {
    let sp = millSprites[step]; if (sp) return sp;
    const m = MILL, sg = A.surface(m.w, m.h); sg.buf.fill(255);
    sg.camX = sg.camY = 0; sg.keyX = WX - m.x + m.ax; sg.keyY = WY - m.y + m.ay; sg.rimK = 2;
    A.windmill(sg, m.ax, m.ay, m.s, -step / m.steps * (TAU / 4), { tone: 'night1', lit: 0, stage: true });
    const px = []; for (let i = 0; i < sg.buf.length; i++) if (sg.buf[i] !== 255) px.push(i % m.w, (i / m.w) | 0, sg.buf[i]);
    sp = millSprites[step] = Int16Array.from(px); return sp;
  }
  function drawMill(g, T) {
    const m = MILL, sp = millSprite(g, Math.floor(T / 8 * m.steps) % m.steps), ox = m.x - m.ax + g.ox, oy = m.y - m.ay + g.oy, buf = g.buf;
    for (let k = 0; k < sp.length; k += 3) {
      const x = sp[k] + ox, y = sp[k + 1] + oy; if (x < 0 || y < 0 || x >= g.w || y >= g.h) continue; buf[y * g.w + x] = sp[k + 2];
    }
  }

  // ---------------------------------------------------------------- the painted, never-moving backdrop
  const DEPTHS = [0, 0.25, 0.5, 0.85, 1];
  const store = new Map();
  function backdropKey(g) { return g.w + 'x' + g.h + ':' + DEPTHS.map(d => Math.round(-g.camX * d)).join(','); }

  function paintBackdrop(g) {
    // sky: five bands that dither fully into each other and into the fog at the horizon
    A.depth(g, 0);
    A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0', 'mist1'], 0, 130, { blend: 26 });
    A.glow(g, 250, 90, 80, { ry: 34, color: 'mist3', strength: 0.16, power: 1.4 });
    // far: trees and the church, one haze pass over both
    A.depth(g, 0.25);
    for (let i = 0; i < 9; i++) A.tree(g, 180 + i * 17 + (i % 2) * 5, 122, 0.5 + (i % 3) * 0.12, { tone: 'night2' });
    A.church(g, 250, 124, 0.9, { tone: 'night2', lit: false });
    A.haze(g, -6, 24, 332, 100, { top: 0.0, bottom: 0.62, color: 'mist2' });

    // mid: far houses, the bridge, a quay that climbs toward the mill so it recedes
    A.depth(g, 0.5);
    A.canalHouse(g, 150, 128, 26, 52, { gable: 'step', lit: 0, seed: 41, brick: 'night2', trim: 'night3', door: false });
    A.canalHouse(g, 232, 128, 24, 40, { gable: 'roof', lit: 0, seed: 42, brick: 'night2', trim: 'night3', door: false });
    A.haze(g, -6, 52, 332, 74, { top: 0.0, bottom: 0.5, color: 'mist2', lights: 0.1 });
    A.rect(g, 100, 124, 240, 8, 'night3');
    A.drawbridge(g, 196, 126, 70, { tone: 'night3' });
    A.haze(g, 190, 84, 90, 48, { top: 0.0, bottom: 0.38, color: 'mist2', lights: 0.5 });
    A.poly(g, [100, 142, 340, 127, 340, 148, 100, 148], 'night2');
    A.line(g, 100, 142, 340, 127, 'slate3');
    for (let i = 0; i < 7; i++) { const bx = 112 + i * 34; A.bollard(g, bx, 142 - (bx - 100) * 0.0625); }

    // near: the dark row of houses, the sky still catching their upper facades, the shade pooling at the street
    A.depth(g, 0.85);
    const LIFT = [1, 2, 3, 4].map(k => A.lut('mix', 'mist1', k * 0.09));
    const skyLit = (id, y0, y1) => {                         // fog-pale at the top of each house, fading down; only its own pixels
      const B = g.buf, M = g.mask, gw = g.w;
      for (let y = Math.max(0, y0); y < Math.min(g.h, y1); y++) {
        const v = 4 * (1 - (y - y0) / (y1 - y0)), row = y * gw;
        for (let x = 0; x < gw; x++) { const i = row + x; if (M[i] !== id) continue; let q = v | 0; if (v - q > A.bayer(x, y)) q++; if (q > 0) B[i] = LIFT[Math.min(3, q - 1)][B[i]]; }
      }
    };
    A.canalHouse(g, -8, 146, 62, 126, { gable: 'roof', lit: 0, seed: 51, brick: 'night2', trim: 'night3', door: false }); skyLit(g.sn, 20, 92);
    A.canalHouse(g, 54, 146, 56, 110, { gable: 'bell', lit: 0, seed: 52, brick: 'night2', trim: 'night3', door: false }); skyLit(g.sn, 36, 100);
    A.canalHouse(g, 110, 146, 44, 96, { gable: 'step', lit: 0, seed: 53, brick: 'night2', trim: 'night3', door: false }); skyLit(g.sn, 50, 106);
    A.tint(g, -10, 96, 66, 51, 'night0', 0.45, 'mix');
    A.tint(g, 54, 104, 56, 43, 'night0', 0.45, 'mix');
    A.tint(g, 110, 110, 44, 37, 'night0', 0.45, 'mix');
    // dead windows: cold glass with one glint, different sizes, nothing like a grid
    for (const [x, y, w, h] of [[63, 88, 6, 9], [96, 86, 5, 8], [118, 100, 6, 9], [136, 104, 5, 8]]) {
      A.rect(g, x - 1, y - 1, w + 2, h + 2, 'night0'); A.rect(g, x, y, w, h, 'night1');
      A.px(g, x + w - 1, y, 'night3'); A.hline(g, x, y + h - 1, w, 'night2');
    }
    // the window that is about to come back, dark and cold
    const { x: wx, y: wy, w: ww, h: wh } = WIN;
    A.rect(g, wx - 2, wy - 2, ww + 4, wh + 4, 'night0');
    A.window(g, wx, wy, ww, wh, { lit: 0, seed: 7, frame: 'slate2' });
    A.rect(g, wx - 3, wy + wh + 2, ww + 6, 2, 'slate3');
    A.rect(g, 126, 130, 14, 16, 'night1'); A.hline(g, 126, 130, 14, 'slate2');           // a door
    A.lamp(g, 156, 148, { style: 'lantern', h: 44, on: false });                         // a dead lamp says it all

    // the street: kerb, wet cobbles that grow toward the viewer
    A.rect(g, -20, 146, 360, 8, 'slate1');
    A.hline(g, -20, 146, 360, 'slate3'); A.hline(g, -20, 147, 360, 'slate2');
    A.rect(g, -20, 154, 360, 30, 'night1');
    A.ditherRect(g, -20, 154, 360, 6, 'slate1', 'night1', 0.35);
    A.hline(g, -20, 152, 360, 'slate4');                                                 // kerb highlight
    for (const [ry, step_, off] of [[160, 14, 0], [165, 18, 7]]) {
      A.hline(g, -20, ry, 360, 'night2');
      for (let x = -20 + off; x < 340; x += step_) A.vline(g, x, ry, 4, 'night2');
    }
    // near plane: big perspective cobbles under the water strip
    A.hline(g, -20, 171, 360, 'slate3');
    for (const [ry, rh, cw, off] of [[172, 4, 9, 0], [176, 5, 13, 6]]) {
      A.rect(g, -20, ry, 360, rh, 'night0');
      for (let x = -20 + off; x < 340; x += cw) {
        A.rect(g, x + 1, ry, cw - 2, rh - 1, ry === 172 ? 'night2' : 'slate1');
        A.hline(g, x + 1, ry, cw - 2, ry === 172 ? 'slate2' : 'slate3');
      }
    }
    A.ditherRect(g, -20, 172, 360, 8, null, 'night0', 0.3);

    // the signpost and the bike leaning in the dark: the Dutch were here (a post, a bike, a word)
    A.depth(g, 1);
    A.rect(g, 12, 122, 2, 31, 'wood1');
    for (const [k, w] of [[0, 20], [1, 22]]) {
      const sy = 124 + k * 8;
      A.rect(g, 14, sy, w, 6, 'wood2'); A.hline(g, 14, sy, w, 'wood3');
      A.vline(g, 14 + w, sy + 1, 4, 'wood2'); A.vline(g, 15 + w, sy + 2, 2, 'wood2');
    }
    A.omafiets(g, 44, GROUND, { rider: false, speed: 0, shadow: false, rim: 1 });
    {   // the parked bike, in the dark: one step down its own ramps (not a fog over it), so it stays a crisp shape
      const id = g.sn, B = g.buf, M = g.mask, gw = g.w;
      for (let y = 120; y < GROUND + 1; y++) for (let x = 10; x < 80; x++) { const i = y * gw + x; if (M[i] === id) B[i] = A.step(B[i], -1); }
    }
    A.tint(g, 14, 120, 24, 34, 'night0', 0.5, 'mix');                                    // the signpost in shade
    A.cheeseCart(g, 304, 156, { glow: 0 });
    A.tint(g, 286, 134, 34, 24, 'night0', 0.55, 'mix');

    // the cobble strip at the very bottom, the near foreground
    A.hline(g, -20, 179, 360, 'night0');
  }

  function backdrop(g) {
    const key = backdropKey(g), hit = store.get(key);
    if (hit) { g.buf.set(hit); g.mask.fill(0); return; }
    paintBackdrop(g);
    if (store.size > 48) store.delete(store.keys().next().value);
    store.set(key, g.buf.slice());
  }

  // a light's reflection on the wet street: a faint broken column of amber, dimmer with distance, a few wider dashes
  function shimmer(g, x, y, len, w, seed, strength, T) {
    if (strength < 0.1) return;
    for (let r = 0; r < len; r++) {
      const f = 1 - r / len, h = A.hash(r + seed * 37, Math.floor(T * 3 + seed));
      if (h > (0.3 + 0.55 * f) * Math.min(1, strength * 1.4)) continue;
      const wob = Math.round(Math.sin(r * 0.9 + T * 3 + seed) * (0.3 + r / len)), c = f > 0.5 ? 'amber4' : 'amber2';
      const dw = h < 0.12 * w ? w : 1 + (r & 1);
      A.hline(g, x + wob - (dw >> 1), y + r, dw, c);
    }
  }

  // ---------------------------------------------------------------- the changed neighbour (the shared bonnet zombie)
  // A tall thin woman in a long skirt and a bonnet, hunched, head pushed forward, facing left. She holds her
  // Tikkie phone up to her face until the window lights, then lowers it; her eyes flare when it catches.
  // (x, y): the ground under her.
  function neighbour(g, x, y, t, phoneUp, flash) {
    const r = A.zombie(g, x, y, { variant: 'bonnet', facing: 'left', t, seed: 6, height: 50, hunch: 0.45, phone: phoneUp, shirt: 'night2', pants: 'night1', glow: flash ? 0.8 : 0.4, shadow: false });
    if (flash) glow(g, r.head[0], r.head[1] + 5, 6, 'amber6', 0.5, { power: 1.2 });
  }

  // ---------------------------------------------------------------- the piece
  const WORD_COLORS = ['mist3', 'mist4', 'mist5', 'mist6', 'amber6', 'amber6', 'amber7', 'amber7'];
  A.panels[10] = {
    text: 'Every word said right brings a piece of it back. Someone has to say them.',
    nl: 'Elk woord dat goed gezegd wordt, brengt een stukje terug. Iemand moet ze zeggen.',
    draw(g, t) {
      const T = t % 8;
      // the mist pass that hides the loop seam: thick at the end of one loop and the start of the next
      const pass = Math.max(sm((T - 6.9) / 0.9), 1 - sm(T / 0.7));
      const L = sm((T - 0.25) / 1.25) * (1 - pass);        // how much of the word is back
      const k = 0.85 + 0.15 * Math.sin(T * TAU / 4);             // it breathes
      const lit0 = sm((T - 3.3) / 0.35);
      // the window catches with a flicker, then holds
      const stut = T < 4.1 ? (Math.sin(T * 41) + Math.sin(T * 23 + 1) > -0.4 ? 1 : 0.25) : 1;
      const wake = lit0 * stut * (1 - sm((pass - 0.5) / 0.5));      // holds until the fog is thick, only then fades under it
      const fl = 1 + 0.05 * Math.sin(T * TAU / 2) + 0.03 * Math.sin(T * TAU + 1);
      const tm = 1.6 * (1 - Math.cos(T * TAU / 8));              // mist drifts out and back, so it loops

      A.camera(g, T * 2, { x: 4, period: 8 });                   // out and back in exactly 8 s
      A.key(g, WX, WY, 2);
      backdrop(g);

      // the mill turns anticlockwise, a quarter turn per loop; a bit of fog over its feet
      A.depth(g, 0.25);
      drawMill(g, T);
      A.depth(g, 0.5);
      fog(g, 266, 52, 60, 74, 'mist2', 0, 0.4);
      // one hunched walker mid-bridge: a clean silhouette, two eye pixels against the fog
      A.zombie(g, 232, 126, { t, seed: 3, variant: 'plain', height: 26, hunch: 0.85, tone: 'night1', pose: 'walk', glow: 1 });
      fog(g, 214, 94, 36, 36, 'mist2', 0, 0.3);

      A.depth(g, 1);
      // ---- the window catches
      const { x: wx, y: wy, w: ww, h: wh } = WIN;
      if (wake > 0.04) {
        const lv = Math.min(1, wake * fl);
        A.window(g, wx, wy, ww, wh, { lit: lv, t, seed: 7, frame: 'wood3', flicker: 0.1, detail: 'tulip', glow: 0 });
        glow(g, wx + ww / 2, wy + wh / 2, 34, 'amber6', 0.55 * lv, { power: 1.6 });
        A.cone(g, wx + ww / 2, wy + wh, Math.PI / 2 + 0.7, 0.35, 34, { color: 'amber5', strength: 0.3 * lv, width: 10, fade: 1 });
        glow(g, wx + ww / 2 + 4, GROUND - 6, 30, 'amber5', 0.33 * lv, { ry: 5, power: 1.2 });   // a pool of light on the street
      }

      // ---- the cast
      A.omafiets(g, 112, GROUND, { t, rider: true, speed: 0, face: T < 1.6 ? 'talk' : 'deadpan', basket: 'book' });
      A.book(g, 131, GROUND - 22, { open: true, w: 10, h: 5, t, dust: false });          // the book he never opened, open at last
      glow(g, 131, GROUND - 24, 10, 'amber5', 0.12 + 0.3 * L, { power: 1.5 });
      A.dog(g, 143, GROUND + 1, { coat: 'brown', pose: 'sit', look: 'up', t });
      A.dog(g, 80, GROUND + 1, { coat: 'black', pose: 'sit', look: 'up', facing: 'left', t, seed: 5 });
      // the changed neighbour, nearer, a dark silhouette: phone up until the window lights, then lowered
      neighbour(g, 228, GROUND + 1, t, T < 3.6, T > 3.3 && T < 3.9);

      // ---- the word: a golden lamp. Fog gathers, then clears from the centre outwards.
      if (T < 2) glow(g, WX, WY - 4, 34, 'mist4', 0.75 * (1 - sm((T - 0.2) / 1.6)), { mode: 'mix', power: 1.2 });
      if (L > 0.03) {
        glow(g, WX, WY - 4, 26, 'amber5', 0.5 * L * k, { power: 2 });
        glow(g, WX, WY - 4, 12, 'amber7', 0.45 * L * k, { power: 1.6 });
      }
      // the little line icon of ref E, a bicycle drawn in light under the word
      if (L > 0.5) {
        const ic = L > 0.85 ? 'amber6' : 'amber4', iy = WY + 13;
        A.ring(g, WX - 5, iy, 2, ic, 1); A.ring(g, WX + 5, iy, 2, ic, 1);
        A.line(g, WX - 5, iy, WX - 1, iy - 3, ic); A.line(g, WX - 1, iy - 3, WX + 4, iy - 3, ic); A.line(g, WX - 1, iy - 3, WX + 1, iy, ic);
        A.line(g, WX + 1, iy, WX + 5, iy, ic); A.line(g, WX + 4, iy - 3, WX + 5, iy, ic); A.px(g, WX + 3, iy - 4, ic);
      }

      // ---- wet street: reflections, ripples, streaks (below the cast's feet, above the cobble strip)
      A.water(g, -20, GROUND + 2, 360, 12, { t, amp: 0.7, dark: 0.5, color: 'night1', gaps: 0.45, glints: 5, stretch: 1.4 });
      shimmer(g, WX, GROUND + 2, 11, 3, 1, L * k, T);
      if (wake > 0.04) shimmer(g, wx + ww / 2, GROUND + 2, 11, 5, 4, wake, T);
      // a puddle that mirrors the sky and the word (a flipped low echo broken by ripples)
      A.ellipse(g, 200, 176, 22, 2, 'slate2'); A.ellipse(g, 199, 176, 19, 1, 'mist0');
      A.ditherRect(g, 181, 176, 38, 1, 'mist1', null, 0.4);
      if (L > 0.3) for (let i = 0; i < 14; i++) {
        const dx = -13 + i * 2, row = 175 + (i & 1);
        if (Math.sin(i * 2.3 + T * 2) > 0.5) continue;
        A.px(g, WX + dx - 3, row, L > 0.8 ? 'amber4' : 'amber2'); A.px(g, WX + dx - 2, row, 'amber2');
      }

      // ---- motes: his mouth to the word (0.2-1.6 s), the word to the window (1.9-3.4 s)
      for (let i = 0; i < 7; i++) {
        const u = (T - 0.2 - i * 0.1) / 1.2; if (u <= 0 || u >= 1) continue;
        const x = bez(MOUTH[0], 150, WX - 8, u), y = bez(MOUTH[1], 70, WY + 2, u);
        A.px(g, x, y, i % 3 === 0 ? 'amber7' : 'amber5');
      }
      for (let i = 0; i < 12; i++) {
        const u = (T - 1.9 - i * 0.09) / 1.3; if (u <= 0 || u >= 1) continue;
        const x = bez(WX - 6, 130, WIN.x + 14, u), y = bez(WY + 6, 80, WIN.y + 8, u) + Math.sin(u * 14 + i) * 1.5;
        A.px(g, x, y, u > 0.8 ? 'amber8' : i % 2 ? 'amber7' : 'amber5');
        if (i % 3 === 0) A.px(g, x - 1, y + 1, 'amber3');
      }
      // a few motes rise off the word once it is back
      if (L > 0.5) for (let i = 0; i < 6; i++) {
        const u = ((T / 4 + i * 0.17) % 1);
        A.px(g, WX - 18 + i * 7 + Math.sin(u * TAU + i) * 2, WY + 4 - u * 24, Math.sin(u * Math.PI) > 0.5 ? 'amber6' : 'amber3');
      }
      // wake-up spark on the window
      if (T > 3.3 && T < 3.9) glow(g, wx + ww / 2, wy + wh / 2, 12, 'amber8', 0.5 * (1 - (T - 3.3) / 0.6), { power: 1 });

      // the word itself (text overlay): it sharpens, a blur of two ghosts closing into one gold word
      if (L > 0.04) {
        const ci = Math.min(WORD_COLORS.length - 1, Math.floor(L * WORD_COLORS.length));
        const blur = 2.2 * (1 - sm(L / 0.85));
        if (blur > 0.2) {
          A.text(WX - blur, WY, 'de fiets', WORD_COLORS[Math.max(0, ci - 2)], 12, true, { align: 'center' });
          A.text(WX + blur, WY, 'de fiets', WORD_COLORS[Math.max(0, ci - 2)], 12, true, { align: 'center' });
        }
        A.text(WX, WY, 'de fiets', WORD_COLORS[ci], 12, true, { align: 'center', shadow: L > 0.6 });
      }
      // the signboards read dimly in the dark
      if (pass < 0.5) {
        A.text(24, 129.5, 'Fiets', 'mist3', 4.5, true, { align: 'center' });
        A.text(25, 137.5, 'Molen', 'mist3', 4.5, true, { align: 'center' });
      }

      // ---- foreground: a dead lamppost cuts the frame, bollards with a chain, reeds, drifting mist
      A.depth(g, 1);
      A.rect(g, 311, 28, 3, 160, 'night0'); A.rect(g, 301, 26, 14, 3, 'night0'); A.vline(g, 311, 29, 150, 'night1');
      for (const bx of [166, 262]) {
        A.rect(g, bx, 163, 5, 17, 'night0'); A.rect(g, bx + 1, 161, 3, 2, 'night0'); A.px(g, bx + 2, 160, 'night0');
        A.hline(g, bx, 168, 5, 'red1'); A.vline(g, bx + 4, 164, 15, 'night2'); A.px(g, bx + 3, 161, 'night2');
      }
      A.line(g, 171, 166, 217, 170, 'night1'); A.line(g, 217, 170, 262, 166, 'night1');
      A.reeds(g, 296, 180, 40, 34, { t });
      A.reeds(g, -4, 180, 26, 24, { t });
      mist(g, tm * 5, 128, 26, 0.25, 8, 'mist5');
      mist(g, -tm * 3, 150, 18, 0.18, 4, 'mist4');
      if (pass > 0.02) {
        fog(g, -6, 0, 332, 180, 'mist3', 0.4 * pass, 0.62 * pass);
        mist(g, tm * 4, 60, 70, 0.8 * pass, 2, 'mist4');
        mist(g, -tm * 3, 120, 50, 0.8 * pass, 6, 'mist4');
      }
      A.grade(g);
    },
  };
})();
