// Panel 3 (new, placeholder): nobody agrees on what caused it. Three suspects, three frames:
// bad cheese, the poll that called Flemish the nicer Dutch, the millionth tourist.
// Key light: a bare bulb over each frame. Loops: stink drifting off the cheese, the bars
// growing, the tourist's camera flash.
(function () {
  const A = window.NRART;
  function frame(g, x, y, w, h) {
    A.rect(g, x - 2, y - 2, w + 4, h + 4, 'night0'); A.rect(g, x, y, w, h, 'night2');
    A.ditherGradient(g, x, y, w, h, 'night3', 'night1', 'down');
    A.glow(g, x + w / 2, y + 4, w * 0.7, { ry: h * 0.9, color: 'amber5', strength: 0.32, power: 1.3 });
  }
  A.panels[2] = {
    text: 'Nobody agrees on what caused it. Bad cheese, some say. Others blame a worldwide poll that called Flemish the nicer Dutch. Or the millionth tourist who said it sounds like a drunk German. Probably all of it.',
    nl: 'Niemand is het eens over de oorzaak. Slechte kaas, zeggen sommigen. Anderen geven de schuld aan een wereldwijde peiling waarin Vlaams het mooiste Nederlands werd genoemd. Of aan de miljoenste toerist die zei dat het klinkt als een dronken Duitser. Waarschijnlijk allemaal.',
    draw(g, t) {
      A.key(g, 160, 0, 1);
      A.rect(g, 0, 0, 320, 180, 'night0');
      // 1. bad cheese
      frame(g, 10, 28, 94, 124);
      A.rect(g, 10, 120, 94, 32, 'wood1'); A.hline(g, 10, 120, 94, 'wood2');
      A.ellipse(g, 57, 122, 26, 4, 'paper2'); A.ellipse(g, 57, 121, 24, 3, 'paper4');
      A.rect(g, 40, 104, 34, 15, 'cheese3'); A.ellipse(g, 57, 104, 17, 4, 'cheese5'); A.ellipse(g, 57, 118, 17, 3, 'cheese2'); A.rect(g, 40, 104, 34, 13, 'cheese3');
      A.ellipse(g, 57, 104, 17, 4, 'cheese4'); A.poly(g, [57, 104, 74, 102, 74, 117, 57, 119], 'cheese5');
      for (let i = 0; i < 3; i++) { const ph = (t * 0.5 + i / 3) % 1; for (let k = 0; k < 8; k++) A.px(g, 50 + i * 7 + Math.round(Math.sin(k * 0.8 + t * 2 + i) * 2), 98 - ph * 40 - k * 2, ph < 0.7 ? 'green5' : 'green3'); }
      A.text(57, 46, 'kaas?', 'paper5', 9, true, { align: 'center' });
      // 2. the poll
      frame(g, 113, 28, 94, 124);
      const grow = Math.min(1, (t % 6) / 1.5);
      A.rect(g, 126, 140 - Math.round(78 * grow), 26, Math.round(78 * grow), 'cheese4'); A.vline(g, 126, 140 - Math.round(78 * grow), Math.round(78 * grow), 'cheese5');
      A.rect(g, 132, 140 - Math.round(78 * grow) + 3, 4, 3, 'night0'); A.rect(g, 136, 140 - Math.round(78 * grow) + 3, 4, 3, 'cheese5'); A.rect(g, 140, 140 - Math.round(78 * grow) + 3, 4, 3, 'red4');
      A.rect(g, 168, 140 - Math.round(30 * grow), 26, Math.round(30 * grow), 'orange3'); A.vline(g, 168, 140 - Math.round(30 * grow), Math.round(30 * grow), 'orange4');
      A.hline(g, 120, 140, 82, 'paper3');
      A.text(139, 149, 'Vlaams', 'paper5', 6, true, { align: 'center' }); A.text(181, 149, 'NL', 'paper5', 6, true, { align: 'center' });
      A.text(160, 46, 'de peiling', 'paper5', 9, true, { align: 'center' });
      // 3. the millionth tourist
      frame(g, 216, 28, 94, 124);
      A.rect(g, 216, 140, 94, 12, 'slate2');
      const flash = (t % 3) < 0.12;
      A.friend(g, 262, 141, { t, face: 'talk', arm: 'drink' });
      A.rect(g, 247, 108, 7, 5, 'slate0'); A.px(g, 249, 109, flash ? 'paper6' : 'steel3');
      if (flash) A.glow(g, 250, 110, 26, { color: 'paper6', strength: 0.6 });
      A.say(g, 262, 92, 'drunk German!', { size: 6 });
      A.text(263, 46, '#1.000.000', 'paper5', 8, true, { align: 'center' });
      A.mist(g, t, 140, 30, { amount: 0.25, speed: 4, seed: 9 });
    },
  };
})();
