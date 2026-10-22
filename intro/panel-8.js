// Panel 8 (new, placeholder): every word said right brings a piece of it back; someone has to say them.
// He says a word; it hangs in the air like a lamp, its reflection on the wet street, and a
// window behind the changed neighbour lights up. Key light: the word. Loops: the word pulsing,
// the window coming back on, the zombie's sway, mist, ripples.
(function () {
  const A = window.NRART;
  A.panels[7] = {
    text: 'Every word said right brings a piece of it back. Someone has to say them.',
    nl: 'Elk woord dat goed gezegd wordt, brengt een stukje terug. Iemand moet ze zeggen.',
    draw(g, t) {
      A.camera(g, t, { x: 6, period: 8 }); A.key(g, 170, 80, 2);
      const ph = (t % 6) / 6, back = ph > 0.45;
      A.depth(g, 0);
      A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0'], 0, 120);
      A.depth(g, 0.3);
      A.windmill(g, 40, 118, 0.42, -t * 0.4, { tone: 'night3', t });
      A.church(g, 300, 118, 0.6, { tone: 'night3' });
      A.rect(g, -20, 116, 360, 6, 'night3');
      A.haze(g, -20, 40, 360, 86, { top: 0.3, bottom: 0.6, color: 'mist2' });
      A.depth(g, 0.6);
      A.canalHouse(g, 150, 140, 40, 96, { gable: 'step', lit: 0.1, t, seed: 31 });
      A.canalHouse(g, 192, 140, 36, 90, { gable: 'bell', lit: back ? 0.75 : 0.0, t, seed: 32 });
      A.canalHouse(g, 230, 140, 38, 100, { gable: 'neck', lit: 0.05, t, seed: 33 });
      A.canalHouse(g, 270, 140, 34, 86, { gable: 'spout', lit: 0.1, t, seed: 34 });
      A.canalHouse(g, 106, 140, 42, 82, { gable: 'roof', lit: 0.1, t, seed: 35 });
      A.haze(g, -20, 30, 360, 112, { amount: 0.25, color: 'mist2' });
      A.rect(g, -20, 140, 360, 4, 'slate3'); A.hline(g, -20, 140, 360, 'slate5'); A.rect(g, -20, 144, 360, 36, 'slate1');
      A.depth(g, 1);
      A.lamp(g, 120, 146, { t, style: 'lantern', h: 38 });
      A.omafiets(g, 64, 154, { t, rider: true, speed: 0, face: 'talk', basket: 'book' });
      A.zombie(g, 236, 154, { t, seed: 6, facing: 'left', variant: 'bonnet' });
      A.water(g, -20, 154, 360, 26, { t, amp: 0.6, dark: 0.5, color: 'slate1', gaps: 0.3, glints: 6 });
      A.streak(g, 120, 156, 22, { t, seed: 1 });
      const wy = 96 + Math.sin(t * 1.6) * 2, k = 0.75 + 0.25 * Math.sin(t * 3);
      A.glow(g, 160, wy - 3, 34, { color: 'amber6', strength: 0.5 * k, power: 1.5 });
      A.streak(g, 160, 157, 20, { t, seed: 3, width: 3, strength: 0.6 * k });
      A.text(160, wy, 'de fiets', 'amber7', 11, true, { align: 'center', shadow: true });
      A.text(160, 170, 'de fiets', 'amber2', 7, true, { align: 'center' });
      A.mist(g, t, 126, 22, { amount: 0.3, speed: 5, seed: 8 });
    },
  };
})();
