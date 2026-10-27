// Intro panel 14 in 3D: "Fak. Oké. One man, one omafiets, three hundred and sixty words. Nachtrit."
// The reference shot for intro3d/README.md, in two beats.
// 1. 0 to 3.9 s: a low tracking shot from the front left. The street streams away behind him and the dead at the kerb
//    turn their heads to follow his lamp. He says Fak, then Oké.
// 2. From 3.9 s: a cut to behind him. The street stops, he rides on into the mist between the dead, the camera cranes up
//    and the title comes up in the sky.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const CUT = 3.9, V = 7;
  // [x, z when the street stops, variant]: the ones he rides between in the second beat
  const AHEAD = [[-5.0, -9, 'hat'], [5.1, -15, 'bonnet'], [-5.2, -22, 'plain'], [5.0, -29, 'cheese'], [-5.1, -37, 'scarf'], [5.2, -46, 'plain']];
  // [x, z at the start, variant]: the ones he passes in the first beat, seen behind him
  const PASSED = [[-5.1, -3, 'plain'], [5.2, -8, 'hat'], [-5.3, -15, 'bonnet']];
  let dead = [];

  C[13] = {
    hold: 9.5,
    build(W) {
      W.stage({ town: 'alblasserdam', theme: 'street', fog: 1.1 });
      W.speed(V);
      W.face('worry');
      dead = [];
      for (const [x, zc, v] of AHEAD) dead.push(W.add(W.zombie(v), x, 0, zc - V * CUT));
      for (const [x, z, v] of PASSED) dead.push(W.add(W.zombie(v), x, 0, z));
      dead.forEach((d, i) => { d.userData.sway = 1.2 + (i % 3) * 0.35; d.rotation.y = d.position.x < 0 ? -Math.PI / 2 : Math.PI / 2; });
      W.say('Fak.', W.bike, { from: 0.6, to: 2.0, dy: 2.3 });
      W.say('Oké.', W.bike, { from: 2.15, to: 3.75, dy: 2.3 });
      W.title('NACHTRIT', 'Cycle home. Understand the dead before dawn.', 5.2);
      W.cam(-2.9, 0.95, -4.3, 0, 1.15, 0.2, 50);
    },
    update(W, t, dt) {
      if (t >= 2.1 && t - dt < 2.1) W.face('deadpan');
      // the dead turn slowly toward him, the head first in spirit, the body after
      const bx = W.bike.position.x, bz = W.bike.position.z;
      for (const d of dead) {
        const want = Math.atan2(-(bx - d.position.x), -(bz - d.position.z));
        let dr = want - d.rotation.y; dr = Math.atan2(Math.sin(dr), Math.cos(dr));
        d.rotation.y += dr * Math.min(1, dt * 1.8);
        d.rotation.z = Math.sin(t * d.userData.sway + d.position.z) * 0.05;
      }
      if (t < CUT) {   // the front left, low, pushing in a little
        const k = W.smooth(W.clamp(t / CUT, 0, 1));
        W.cam(W.lerp(-2.9, -2.2, k), W.lerp(0.95, 1.1, k), W.lerp(-4.3, -3.5, k), 0, 1.15, 0.2, 50);
        W.drift(t);
        return;
      }
      // the street stops; he rides on, and the camera stays where it was cut to, rising
      if (t - dt < CUT) W.speed(V, 0);
      const s = t - CUT, k = W.smooth(W.clamp(s / 5.2, 0, 1));
      W.ride(-V * s);
      W.fog(1.1 + 0.45 * k);
      W.cam(W.lerp(1.3, 0.35, k), W.lerp(1.25, 3.3, k), W.lerp(5.4, 6.6, k), 0, W.lerp(1.25, 1.6, k), W.lerp(-5, -34, k), W.lerp(52, 46, k));
      W.drift(t, 0.6);
    },
    dispose() { dead = []; },
  };
})();
