// Panel 4 (new, placeholder): the language was ignored for years; one night it left.
// The words lift off a dark canal street as glowing letters and drift away into the mist.
// Key light: the words themselves, warm. Loops: drifting words, windows going out, water.
(function () {
  const A = window.NRART;
  const WORDS = ['gezellig', 'de', 'het', 'lekker', 'fiets', 'hoi', 'dank je', 'kaas', 'molen', 'huis', 'gracht', 'doei'];
  A.panels[3] = {
    text: 'The language had been ignored for years. Every time someone tried, the Dutch switched to English. One night it left.',
    nl: 'De taal werd al jaren genegeerd. Elke keer als iemand een poging deed, schakelden de Nederlanders over op Engels. Op een nacht is hij vertrokken.',
    draw(g, t) {
      A.camera(g, t, { x: 6, period: 8 }); A.key(g, 300, 40, 1);
      A.depth(g, 0);
      A.sky(g, ['night0', 'night1', 'night2', 'night3', 'mist0'], 0, 120);
      A.depth(g, 0.4);
      A.church(g, 280, 112, 0.7, { tone: 'night3' });
      A.windmill(g, 230, 112, 0.4, -t * 0.3, { tone: 'night3', t });
      A.rect(g, -20, 110, 360, 8, 'night3');
      A.haze(g, -20, 40, 360, 80, { top: 0.25, bottom: 0.55, color: 'mist2' });
      A.depth(g, 0.7);
      const lightsOut = (t % 8) / 8;
      [[-10, 34, 92, 'step'], [24, 30, 84, 'bell'], [54, 36, 100, 'neck'], [90, 30, 80, 'spout'], [120, 34, 90, 'step']].forEach(([x, w, h, gb], i) =>
        A.canalHouse(g, x, 128, w, h, { gable: gb, lit: Math.max(0, 0.7 - lightsOut * (1 + i * 0.3)), t, seed: i * 13 + 3 }));
      A.rect(g, -20, 128, 360, 4, 'slate2'); A.hline(g, -20, 128, 360, 'slate4');
      A.depth(g, 1);
      A.water(g, -20, 132, 360, 48, { t, amp: 1.2, dark: 0.5, color: 'night1' });
      A.boat(g, 70, 140, { t, kind: 'sloep', len: 36 });
      A.mist(g, t, 96, 30, { amount: 0.4, speed: 6, seed: 4 });
      // the words leave, up and to the right, fading as they go
      WORDS.forEach((w, i) => {
        const ph = (t / 9 + i / WORDS.length) % 1, x = 60 + ph * 300 + Math.sin(i * 2.1) * 16, y = 126 - ph * 96 + Math.sin(t * 1.2 + i) * 3;
        const c = ph < 0.35 ? 'amber7' : ph < 0.65 ? 'amber6' : 'amber4';
        A.glow(g, x, y - 3, 10 + (1 - ph) * 6, { color: 'amber5', strength: 0.4 * (1 - ph), q: 4 });
        if (ph < 0.9) A.text(x, y, w, A.hex(c), 7 - Math.round(ph * 2), true, { align: 'center' });
      });
    },
  };
})();
