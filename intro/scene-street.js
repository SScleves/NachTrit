// Level intro scene "street" (also the fallback for themes without a scene of their own).
// His own street at night after the mist: terraced gabled houses, wet cobbles, two lanterns, the
// dogs and the omafiets waiting under the right lantern. Key light: that lantern (focal point).
// Far planes: fogged mill, church and a drawbridge. A zombie peers over the left fence.
// Loops: lantern flicker + dog tails/breath, window flicker, drifting mist, zombie eyes blink, ripples.
(function () {
  const A = window.NRART;
  const H = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  const FAR = [[-10, 30, 56, 'step'], [18, 26, 64, 'bell'], [42, 32, 52, 'neck'], [72, 28, 66, 'spout'], [214, 30, 60, 'bell'], [242, 28, 52, 'step'], [268, 34, 68, 'neck'], [300, 30, 56, 'spout']];
  const NEAR = [[-16, 44, 112, 'bell'], [26, 38, 94, 'step'], [62, 40, 116, 'neck'], [100, 34, 88, 'spout'],
    [226, 40, 100, 'roof'], [264, 36, 112, 'step'], [298, 40, 92, 'bell']];
  const GY = 140;
  A.scenes.street = (g, t) => {
    A.camera(g, t, { x: 8, period: 8 }); A.key(g, 226, 100, 1);
    // ---- sky
    A.depth(g, 0);
    A.sky(g, ['night1', 'night2', 'night3', 'night4', 'mist1'], 0, 124);
    A.stars(g, t, { n: 34, y1: 50, seed: 2 });
    A.moon(g, 262, 24, 6, { halo: 0.3 });
    for (let i = 0; i < 4; i++) A.ditherRect(g, ((i * 97 + t * 2) % 400) - 40, 20 + i * 11, 80, 2, null, 'night3', 0.3);
    A.glow(g, 172, 108, 100, { color: 'mist4', strength: 0.32, power: 1.2, ry: 50 });
    // ---- far fog layer: mill, church, trees, drawbridge
    A.depth(g, 0.25);
    A.rect(g, -20, 112, 360, 14, 'night3');
    for (let i = 0; i < 24; i++) A.disc(g, -10 + i * 15 + H(i, 2) * 6, 111 + H(i, 3) * 2, 3 + H(i, 4) * 3, 'night3');
    A.church(g, 205, 114, 0.9, { tone: 'night2' });
    A.windmill(g, 150, 114, 0.85, -t * 0.55, { tone: 'night2', t, lit: 1 });
    A.haze(g, -20, 70, 360, 56, { top: 0.05, bottom: 0.25, color: 'mist3' });
    A.depth(g, 0.45);
    FAR.forEach(([x, w, h, gb], i) => A.canalHouse(g, x, 128, w, h, { gable: gb, lit: 0.35, t, seed: i * 3 + 11, brick: 'slate3' }));
    A.drawbridge(g, 128, 128, 60);
    A.haze(g, -20, 60, 360, 70, { top: 0.2, bottom: 0.4, color: 'mist2' });
    // far lamps with cones in the fog and tiny zombie silhouettes
    A.depth(g, 0.6);
    A.lamp(g, 196, 131, { t, style: 'lantern', h: 20, seed: 5 }); A.lamp(g, 120, 131, { t, style: 'lantern', h: 20, seed: 6 });
    A.zombie(g, 142, 132, { variant: 'hat', t: t + 1, pose: 'walk', height: 22, tone: 'night4' });
    A.zombie(g, 172, 132, { variant: 'plain', t, pose: 'walk', height: 20, tone: 'night4' });
    A.mist(g, t, 100, 36, { amount: 0.3, speed: 4, seed: 5, color: 'mist3' });
    // ---- near row: terraced houses
    A.depth(g, 0.8);
    NEAR.forEach(([x, w, h, gb], i) => A.canalHouse(g, x, GY, w, h, { gable: gb, lit: 0.38, t, seed: i * 7 + 60, door: true, trim: 'paper2', detail: true }));
    A.haze(g, -20, 30, 360, 112, { top: 0.12, bottom: 0.3, color: 'mist2' });
    // a Dutch flag hanging out of a window, hoist beam bunting of tulip colours
    A.depth(g, 0.8);
    A.rect(g, 226, 78, 1, 3, 'night1'); A.rect(g, 216, 78, 10, 2, 'red3'); A.rect(g, 216, 80, 10, 2, 'paper3'); A.rect(g, 216, 82, 10, 2, 'blue3');
    // ---- pavement and wet cobbles
    A.depth(g, 1);
    A.rect(g, -20, GY, 360, 8, 'slate3'); A.hline(g, -20, GY, 360, 'slate5'); A.hline(g, -20, GY + 7, 360, 'slate1');
    for (let x = -20; x < 340; x += 9) A.vline(g, x + (x % 2), GY + 1, 6, 'slate2');
    A.rect(g, -20, GY + 8, 360, 40, 'slate1');
    for (let y = GY + 10; y < 180; y += 3) for (let x = -20 + (y % 6); x < 340; x += 6 + (y > 160 ? 2 : 0)) A.hline(g, x, y, 4, (x + y) % 5 ? 'slate2' : 'night3');
    // fence and hedge on the left, zombie peeking over, tulips
    A.zombie(g, 46, GY + 4, { variant: 'plain', t, pose: 'stand', height: 52, hunch: 0.45, glow: 1, hair: 'night2' });
    A.fence(g, -4, GY + 2, 62, 12);
    A.tulips(g, 66, GY + 3, 22, { t });
    // ---- lights: left lantern, right lantern = key
    A.lamp(g, 92, 152, { t, style: 'lantern', h: 46, seed: 1, flicker: 0.04, reach: 40 });
    A.lamp(g, 248, 152, { t, style: 'lantern', h: 46, seed: 2, flicker: 0.07, reach: 50 });
    A.glow(g, 226, 170, 70, { color: 'amber5', strength: 0.22, power: 1.4, ry: 14 });
    A.cone(g, 248, 104, Math.PI / 2, 0.55, 50, { color: 'amber5', strength: 0.3 }); A.cone(g, 92, 104, Math.PI / 2, 0.5, 44, { color: 'amber5', strength: 0.22 });
    A.bollard(g, 132, 153); A.bollard(g, 146, 153);
    // ---- the hero's set: omafiets with the grammar book, the dogs
    A.shadow(g, 196, 166, 26, 3, 0.5);
    A.omafiets(g, 196, 166, { t, facing: 'left', basket: 'book' });
    A.dog(g, 146, 167, { t, coat: 'brown', pose: 'walk', seed: 2, look: 'up' });
    A.dog(g, 166, 168, { t, coat: 'grey', pose: 'sit', seed: 7 });
    // ---- reflections on the wet street, then streaks under the lamps and the windows
    A.water(g, -20, 168, 360, 12, { t, amp: 0.7, dark: 0.55, color: 'slate1', gaps: 0.3, glints: 8 });
    A.streak(g, 248, 169, 11, { t, seed: 2, strength: 0.7 }); A.streak(g, 92, 169, 11, { t, seed: 1, strength: 0.55 });
    A.streak(g, 232, 170, 9, { t, seed: 4, strength: 0.3, color: 'amber4' });
    A.mist(g, t, 128, 24, { amount: 0.25, speed: 5, seed: 1 });
    A.mist(g, t, 156, 18, { amount: 0.18, speed: -3, seed: 8, color: 'mist4' });
  };
})();
