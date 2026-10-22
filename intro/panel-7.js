// Panel 7: page one, de or het. There is no rule. There is never a rule.
// The book fills the frame under a desk lamp. Key light: the lamp, top centre.
// Loops: the red question mark in the gutter blinking, the lamp's hum (a slow flicker), dust.
(function () {
  const A = window.NRART;
  const DE = ['de hond', 'de vrouw', 'de fiets', 'de nacht', 'de molen'], HET = ['het huis', 'het brood', 'het ei', 'het water', 'het meisje'];
  A.panels[6] = {
    text: 'Page one: de or het. There is no rule. There is never a rule.',
    nl: 'Pagina één: de of het. Er is geen regel. Er is nooit een regel.',
    draw(g, t) {
      A.camera(g, t, { x: 0, y: 4, period: 8 }); A.key(g, 160, -20, 1);
      A.depth(g, 0.4);
      A.rect(g, -20, -20, 360, 220, 'wood1'); for (let y = -16; y < 200; y += 7) A.hline(g, -20, y, 360, 'wood0');
      A.depth(g, 1);
      A.book(g, 160, 170, { open: true, w: 236, h: 146, lines: false });
      // hands holding the edges
      A.rect(g, 36, 150, 8, 12, 'skin3'); A.rect(g, 37, 150, 6, 2, 'skin4'); A.rect(g, 30, 158, 10, 14, 'orange3');
      A.rect(g, 276, 150, 8, 12, 'skin3'); A.rect(g, 277, 150, 6, 2, 'skin4'); A.rect(g, 280, 158, 10, 14, 'orange3');
      const hum = (t % 5) < 0.08 ? 0.18 : 0.3;
      A.glow(g, 160, 30, 220, { ry: 170, color: 'amber6', strength: hum, power: 1.2 });
      A.text(100, 56, 'DE', 'night1', 20, true, { align: 'center' }); A.text(220, 56, 'HET', 'night1', 20, true, { align: 'center' });
      A.hline(g, 70, 62, 60, 'paper2'); A.hline(g, 190, 62, 60, 'paper2');
      DE.forEach((w, i) => A.text(64, 80 + i * 14, w, 'slate3', 8));
      HET.forEach((w, i) => A.text(184, 80 + i * 14, w, 'slate3', 8));
      A.text(64, 158, 'regel: —', 'slate4', 6); A.text(184, 158, 'regel: —', 'slate4', 6);
      if (Math.floor(t * 1.5) % 2) A.text(160, 140, '?', 'red4', 16, true, { align: 'center' });
    },
  };
})();
