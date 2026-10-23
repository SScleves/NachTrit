// Panel 8: every word said right brings a piece of it back; someone has to say them.
// Story in one 8 s loop: the hero says "de fiets", amber motes carry it into the mist where the word
// sharpens into gold (0-1.5 s), a thread of motes crosses to the one dark window (2-3.3 s), the window
// catches with a flicker and stays lit. The loop resets under a mist pass, never through darkness.
// Seamless parts: mill turns one quarter (sails repeat every PI/2), everything else is hidden by the mist pass.
(function () {
  const A0 = window.NRART; const PR = window.__pr = {}; let n=0;
  const A = new Proxy(A0,{get(o,k){const f=o[k]; if(typeof f!=='function'||k==='col')return f; return (...a)=>{const s0=performance.now();const r=f(...a);PR[k]=(PR[k]||0)+performance.now()-s0;return r;};}});

  const TAU = Math.PI * 2;
  const sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  const WX = 206, WY = 66;               // the word, in open fog
  const WIN = { x: 70, y: 104, w: 20, h: 22 };
  const MOUTH = [109, 116];
  const bez = (a, b, c, u) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * c;
  A.panels[7] = {
    text: 'Every word said right brings a piece of it back. Someone has to say them.',
    nl: 'Elk woord dat goed gezegd wordt, brengt een stukje terug. Iemand moet ze zeggen.',
    draw(g, t) { if(++n%200===0){console.error('PROF '+Object.entries(PR).sort((a,b)=>b[1]-a[1]).slice(0,8).map(e=>e[0]+':'+(e[1]/200).toFixed(2)).join(' ')); for(const k in PR)PR[k]=0;}
      const T = t % 8;
      // the mist pass that hides the loop seam: thick at the end of the loop and the start of the next
      const pass = Math.max(sm((T - 6.9) / 0.9), 1 - sm(T / 0.7)) ;
      const L = sm(T / 1.5) * (1 - pass * 0.9);                 // how much of the word is back
      const k = 0.85 + 0.15 * Math.sin(T * TAU / 4);            // it breathes
      const lit0 = sm((T - 3.3) / 0.35);
      // the window catches with a flicker, then holds
      const stut = T < 4.1 ? (Math.sin(T * 41) + Math.sin(T * 23 + 1) > -0.4 ? 1 : 0.25) : 1;
      const wake = lit0 * stut * (1 - pass * 0.85);
      const fl = 1 + 0.05 * Math.sin(T * TAU / 2) + 0.03 * Math.sin(T * TAU + 1);
      A.camera(g, t, { x: 6, period: 8 }); A.key(g, WX, WY, 2);

      // ---- sky blended into the fog with an overlapping falloff
      A.depth(g, 0);
      A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist1', 'mist2'], 0, 130, { blend: 18 });
      A.glow(g, 262, 80, 40, { color: 'mist3', strength: 0.3, power: 2 });
      A.depth(g, 0.25);
      for (let i = 0; i < 9; i++) A.tree(g, 180 + i * 17 + (i % 2) * 5, 122, 0.5 + (i % 3) * 0.12, { tone: 'night2' });
      A.church(g, 250, 124, 0.9, { tone: 'night2', lit: false });
      A.haze(g, -6, 24, 332, 100, { top: 0.0, bottom: 0.62, color: 'mist2' });
      A.windmill(g, 288, 126, 0.95, -T / 8 * (TAU / 4), { tone: 'night1', t, lit: 0, stage: true });

      // ---- mid: far houses, bridge, quay receding toward the mill
      A.depth(g, 0.5);
      A.canalHouse(g, 150, 128, 26, 52, { gable: 'step', lit: 0, t, seed: 41, brick: 'night2', trim: 'night3' });
      A.canalHouse(g, 232, 128, 24, 40, { gable: 'roof', lit: 0, t, seed: 42, brick: 'night2', trim: 'night3' });
      A.haze(g, -6, 70, 332, 56, { amount: 0.4, color: 'mist2', lights: 0.1 });
      A.rect(g, 100, 124, 240, 8, 'night3');
      A.drawbridge(g, 196, 126, 70, { tone: 'night3' });
      A.zombie(g, 228, 126, { t, variant: 'plain', height: 22, hunch: 0.8, tone: 'night2', pose: 'walk', glow: 0.8 });
      A.haze(g, 190, 96, 90, 36, { amount: 0.3, color: 'mist2', lights: 0.5 });
      // quay: its top edge climbs toward the mill so it recedes instead of running parallel to the frame
      A.poly(g, [100, 142, 340, 127, 340, 148, 100, 148], 'night2');
      A.line(g, 100, 142, 340, 127, 'slate3');
      for (let i = 0; i < 7; i++) { const bx = 112 + i * 34; A.bollard(g, bx, 142 - (bx - 100) * 0.0625); }

      // ---- near: the dark row, silhouettes, no window wallpaper
      A.depth(g, 0.85);
      A.canalHouse(g, -8, 146, 62, 126, { gable: 'roof', lit: 0, t, seed: 51, brick: 'night2', trim: 'night3' });
      A.canalHouse(g, 54, 146, 56, 110, { gable: 'bell', lit: 0, t, seed: 52, brick: 'night2', trim: 'night3' });
      A.canalHouse(g, 110, 146, 44, 96, { gable: 'step', lit: 0, t, seed: 53, brick: 'night2', trim: 'night3' });
      A.tint(g, -10, 57, 66, 90, 'night0', 0.8, 'mix');
      A.tint(g, 54, 80, 56, 67, 'night0', 0.8, 'mix');
      A.tint(g, 110, 88, 44, 59, 'night0', 0.8, 'mix');
      // the one window that comes back
      const { x: wx, y: wy, w: ww, h: wh } = WIN;
      A.rect(g, wx - 2, wy - 2, ww + 4, wh + 4, 'night0');
      A.rect(g, wx, wy, ww, wh, 'night1');
      if (wake > 0.04) {
        const lv = Math.min(1, wake * fl);
        A.window(g, wx, wy, ww, wh, { lit: lv, t, seed: 7, frame: 'wood3', flicker: 0.1, detail: 'tulip' });
        A.glow(g, wx + ww / 2, wy + wh / 2, 34, { color: 'amber6', strength: 0.55 * lv, power: 1.6 });
        A.cone(g, wx + ww / 2, wy + wh, Math.PI / 2 + 0.7, 0.35, 34, { color: 'amber5', strength: 0.3 * lv, width: 10, fade: 1 });
      } else A.window(g, wx, wy, ww, wh, { lit: 0, t, seed: 7, frame: 'slate2' });
      A.rect(g, wx - 3, wy + wh + 2, ww + 6, 2, 'slate3');
      A.rect(g, 126, 130, 14, 16, 'night1'); A.hline(g, 126, 130, 14, 'slate2');   // door
      A.lamp(g, 156, 148, { t, style: 'lantern', h: 44, on: false });             // a dead lamp

      // ---- the street: dark wet cobbles that run toward the viewer
      A.rect(g, -20, 146, 360, 8, 'slate1');
      A.hline(g, -20, 146, 360, 'slate3'); A.hline(g, -20, 147, 360, 'slate2');
      A.rect(g, -20, 154, 360, 30, 'night1');
      A.ditherRect(g, -20, 154, 360, 6, 'slate1', 'night1', 0.35);
      for (const [ry, step_, off] of [[158, 14, 0], [163, 18, 7], [169, 24, 3], [176, 32, 12]]) {
        A.hline(g, -20, ry, 360, 'night2');
        for (let x = -20 + off; x < 340; x += step_) A.vline(g, x, ry, ry === 176 ? 6 : 4, 'night2');
      }
      A.hline(g, -20, 152, 360, 'slate4');                                       // kerb highlight

      A.depth(g, 1);
      A.fingerpost(g, 22, 152, { signs: [['Fiets', 'right'], ['Molen', 'right']] });
      // the hero stops and says the word; the book he never opened lies open in the basket
      A.omafiets(g, 112, 156, { t, rider: true, speed: 0, face: T < 1.6 ? 'talk' : 'deadpan', basket: 'book' });
      A.book(g, 131, 133, { open: true, w: 10, h: 5, t, dust: false });
      A.glow(g, 131, 131, 9, { color: 'amber5', strength: 0.25, power: 1.5 });
      A.dog(g, 142, 157, { coat: 'brown', pose: 'sit', look: 'up', t });
      // the changed neighbour, nearer, watching the window
      const zh = A.zombie(g, 232, 158, { t, seed: 6, facing: 'left', variant: 'bonnet', tone: 'night3', glow: 1 });
      if (lit0 > 0.5 && T < 5.5) A.px(g, zh.head[0] - 3, zh.head[1] + 1, 'amber6'); A.px(g, zh.head[0] - 5, zh.head[1] + 1, 'amber6');
      A.cheeseCart(g, 304, 156, { glow: 0.1 });
      A.tint(g, 290, 140, 30, 18, 'night0', 0.55, 'mix');

      // ---- the word: sharpens out of the mist, a golden lamp
      if (L > 0.03) {
        A.glow(g, WX, WY, 28, { color: 'amber5', mode: 'mix', strength: 0.4 * L * k, power: 1.8 });
        A.glow(g, WX, WY, 12, { color: 'amber7', mode: 'mix', strength: 0.55 * L * k, power: 1.6 });
      }
      if (T < 1.8) A.ditherDisc(g, WX, WY, 26, 'mist3', 0.7 * (1 - sm(T / 1.5)), 0.8);   // mist gathers, then clears

      // wet street: reflections, ripples, streaks
      A.water(g, -20, 156, 360, 16, { t, amp: 0.7, dark: 0.5, color: 'night1', gaps: 0.45, glints: 6, stretch: 1.4 });
      A.streak(g, WX, 158, 20, { t, seed: 1, width: 4, strength: 0.6 * L * k });
      A.streak(g, WX + 1, 158, 20, { t, seed: 5, width: 1, strength: 0.5 * L * k });
      if (wake > 0.04) A.streak(g, wx + ww / 2, 158, 14, { t, seed: 4, width: 6, strength: 0.4 * wake });
      // puddle: a mirror holding the sky and the word
      A.ellipse(g, 200, 170, 22, 3, 'slate2'); A.ellipse(g, 199, 170, 17, 2, 'mist1');
      A.ditherRect(g, 184, 169, 30, 1, 'mist1', 'slate2', 0.4);
      if (L > 0.3) A.rect(g, WX - 2, 170, 4, 1, 'amber4');

      // ---- motes: mouth to word (0.2-1.6 s), word to window (1.9-3.4 s)
      for (let i = 0; i < 7; i++) {
        const u = (T - 0.2 - i * 0.1) / 1.2; if (u <= 0 || u >= 1) continue;
        const x = bez(MOUTH[0], 150, WX - 8, u), y = bez(MOUTH[1], 70, WY + 6, u);
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
        A.px(g, WX - 18 + i * 7 + Math.sin(u * TAU + i) * 2, WY + 6 - u * 24, Math.sin(u * Math.PI) > 0.5 ? 'amber6' : 'amber3');
      }
      // wake-up spark on the window
      if (T > 3.3 && T < 3.9) A.glow(g, wx + ww / 2, wy + wh / 2, 12, { color: 'amber8', strength: 0.5 * (1 - (T - 3.3) / 0.6), power: 1 });

      // the word itself (text overlay)
      if (L > 0.12) {
        const c = L < 0.3 ? 'amber2' : L < 0.5 ? 'amber3' : L < 0.7 ? 'amber5' : L < 0.9 ? 'amber6' : 'amber7';
        A.text(WX, WY, 'de fiets', c, 12, true, { align: 'center', shadow: L > 0.5 });
      }

      // foreground: a dead lamppost cuts the frame, reeds, drifting mist
      A.depth(g, 1);
      A.rect(g, 311, 28, 3, 160, 'night0'); A.rect(g, 301, 26, 14, 3, 'night0'); A.vline(g, 311, 29, 150, 'night1');
      A.reeds(g, 296, 180, 40, 34, { t });
      A.reeds(g, -4, 180, 26, 24, { t });
      A.mist(g, t, 128, 26, { amount: 0.25, speed: 5, seed: 8 });
      A.mist(g, t, 150, 18, { amount: 0.18, speed: -3, seed: 4, color: 'mist4' });
      if (pass > 0.02) A.ditherRect(g, -6, 30, 332, 120, null, 'mist3', 0.8 * pass);
    },
  };
})();
