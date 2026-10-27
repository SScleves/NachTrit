// Intro panel 2 in 3D: "By morning everyone had changed. Two things had not: they still split the bill, and the women were still taller than him."
// Two beats on the square at the end of the night, the street and his wheels still, the haze a little thinner than at night.
// 1. 0 to 4.5 s: a café terrace under a string of bulbs. Three of the dead lean in round a small table; one holds up a phone
//    and a bubble over it says Tikkie: €4,50. The screen pings and the other two lean in on it.
// 2. From 4.5 s: him on his stopped omafiets in the road beside a dead woman in a bonnet who stands a head taller. At his eye
//    level the camera pushes in on the two faces; he looks up at her, deadpan, glances at us, and looks up at her again.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const CUT = 4.5, PAVE = 0.05;                    // the pavement tiles stand 5 cm above the road
  const T = [6.4, 8.0];                            // the café table, on the pavement right of the road
  const CAM1 = [10.06, 1.25, 10.95];               // the first camera, low on the terrace, looking across the street
  const Z2 = 3;                                    // where he stands in the second beat: 3 m back, so no lamp stands behind her head
  const HER = [-1.15, Z2 - 0.25];
  let cast = null, own = [], hidden = [], lampWas = null, coat = [], lens = [], trees = [], walker = null;

  // the set is built from a fixed seed, so the square looks the same every time the panel plays
  function seeded(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const at = (a, r) => [T[0] + r * Math.sin(a), T[1] + r * Math.cos(a)];
  const yawTo = (x, z, tx, tz) => Math.atan2(-(tx - x), -(tz - z));   // the turn that makes a zombie at x, z face tx, tz

  // a round bistro table with three beers and the bill on a saucer, and three chairs, one pushed back; ac points to the camera
  function terraceSet(W, ac, seat) {
    const k = W.kit(), KG = W.KG, iron = W.PM.pole, TOP = 0.62;
    W.kadd(k, KG.cyl, W.PM.stone, T[0], TOP, T[1], 0, 0, 0, 0.74, 0.035, 0.74);
    W.kadd(k, KG.cyl, iron, T[0], TOP / 2, T[1], 0, 0, 0, 0.05, TOP, 0.05);
    W.kadd(k, KG.cyl, iron, T[0], 0.02, T[1], 0, 0, 0, 0.44, 0.04, 0.44);
    const [ux, uz] = [Math.sin(ac), Math.cos(ac)], [vx, vz] = [Math.cos(ac), -Math.sin(ac)];
    for (const [r, f] of [[-0.16, -0.12], [0.15, -0.16], [0.02, 0.1]]) {
      const x = T[0] + vx * r + ux * f, z = T[1] + vz * r + uz * f;
      W.kadd(k, KG.cyl, W.PM.cheese, x, TOP + 0.085, z, 0, 0, 0, 0.065, 0.14, 0.065);
      W.kadd(k, KG.cyl, W.PK.linen, x, TOP + 0.165, z, 0, 0, 0, 0.068, 0.025, 0.068);
    }
    W.kb(k, W.PK.linen, T[0] + vx * 0.05 + ux * 0.2, TOP + 0.022, T[1] + vz * 0.05 + uz * 0.2, 0.1, 0.004, 0.17, 0, ac + 0.4, 0);
    const chair = (a, r, turn) => {
      const [cx, cz] = at(a, r), f = a + (turn || 0);       // the back of the seat away from the table
      const P = (x, z) => [cx + x * Math.cos(f) + z * Math.sin(f), cz - x * Math.sin(f) + z * Math.cos(f)];
      for (const [lx, lz] of [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]]) {
        const [x0, z0] = P(lx * 1.18, lz * 1.18), [x1, z1] = P(lx, lz); W.ktube(k, iron, x0, 0, z0, x1, 0.45, z1, 0.014);
      }
      W.kadd(k, KG.cyl, seat, cx, 0.46, cz, 0, f, 0, 0.42, 0.04, 0.42);
      for (const sx of [-0.15, 0.15]) { const [x0, z0] = P(sx, 0.19); W.ktube(k, iron, x0, 0.46, z0, x0, 0.88, z0, 0.014); }
      const [bx, bz] = P(0, 0.2); W.kadd(k, KG.box, seat, bx, 0.82, bz, 0, f, 0, 0.36, 0.1, 0.03);
    };
    chair(ac + Math.PI + 0.62, 0.9); chair(ac + Math.PI - 1.0, 0.9); chair(ac + 0.55, 1.1, 0.9);
    return W.kbuild(k);
  }

  // the dressing at fixed places: two closed parasols with a string of bulbs between them, their light on the wet tiles,
  // bikes at the kerb, trees that frame both beats without standing behind a head, and one of the dead far down the street
  function dress(W) {
    const THREE = W.THREE, KG = W.KG, pole = W.PM.pole, R = Math.random; Math.random = seeded(11);
    try {
      const k = W.kit(), cone = new THREE.ConeGeometry(0.2, 1.3, 8), tops = [];
      for (const [x, z] of [[5.35, 9.7], [7.7, 6.0]]) {
        W.kadd(k, KG.cyl, pole, x, 0.04, z, 0, 0, 0, 0.5, 0.08, 0.5);
        W.ktube(k, pole, x, 0, z, x, 2.62, z, 0.025);
        W.kadd(k, cone, W.PK.shutters[0], x, 1.93, z);                   // the folded canopy hangs from the hub, gathered at the rib tips
        W.kadd(k, KG.cyl, pole, x, 1.72, z, 0, 0, 0, 0.3, 0.05, 0.3);    // the strap round it
        W.kadd(k, KG.ball, pole, x, 2.64, z, 0, 0, 0, 0.07, 0.07, 0.07);
        tops.push([x, 2.55, z]);
      }
      cone.dispose();
      const [p, q] = tops, bulbs = [], N = 9;                             // the wire sags between the two tops, a bulb every 30 cm
      let prev = null;
      for (let i = 0; i <= N; i++) {
        const u = i / N, x = W.lerp(p[0], q[0], u), z = W.lerp(p[2], q[2], u), y = W.lerp(p[1], q[1], u) - Math.sin(u * Math.PI) * 0.42;
        if (prev) W.ktube(k, pole, prev[0], prev[1], prev[2], x, y, z, 0.008);
        prev = [x, y, z];
        if (i > 0 && i < N) bulbs.push([x, y - 0.06, z]);
      }
      const bulbM = new THREE.MeshBasicMaterial({ color: 0xffc070 }); own.push(bulbM);
      for (const [x, y, z] of bulbs) W.kadd(k, KG.ball, bulbM, x, y, z, 0, 0, 0, 0.065, 0.085, 0.065);
      own.push(W.add(W.kbuild(k), 0, PAVE, 0));
      // a glow card round each bulb, turned to the first camera, and a streak of its light on the wet tiles below
      const haloM = W.GlowMat(W.glowTex, 0xffa548, 0.55), wetM = W.GlowMat(W.glowTex, 0xffa548, 0.55); own.push(haloM, wetM);
      const hk = W.kit(), face = Math.atan2(CAM1[0] - T[0], CAM1[2] - T[1]);
      for (const [x, y, z] of bulbs) {
        W.kadd(hk, KG.plane, haloM, x, y, z, 0, face, 0, 0.55, 0.55, 1);
        W.kadd(hk, KG.plane, wetM, x + Math.sin(face) * 0.4, 0.015, z + Math.cos(face) * 0.4, -Math.PI / 2, 0, face, 0.3, 3.4, 1);
      }
      const halo = W.add(W.kbuild(hk), 0, PAVE, 0); halo.renderOrder = 4; own.push(halo);
      own.push(W.add(W.bikeRow(), 4.95, PAVE, 1.6, 0));
      trees = [];
      for (const [x, z, kind, s] of [[7.6, 13.4, 1, 1.0], [-7.8, 13, 0, 1.0], [8.9, 25, 1, 1.05], [-6.6, 31, 1, 1.1], [6.4, 21, 0, 0.95], [-7.4, -12, 1, 1.0], [9.0, 2.4, 1, 0.95]]) {
        const tr = W.add(W.treeCard([kind]), x, 0, z); tr.children[0].scale.set((kind ? 8 : 8.5) * s, (kind ? 11 : 15) * s, 1); trees.push(tr);
      }
      walker = W.add(W.zombie('plain'), 3.5, 0, 27.4, 0);
    } finally { Math.random = R; }
  }

  C[1] = {
    hold: 10,
    build(W) {
      const THREE = W.THREE, R = Math.random; Math.random = seeded(7);
      own = []; hidden = []; coat = []; lens = [];
      try {
        W.stage({ town: 'alblasserdam', theme: 'square', fog: 0.85 });
        const ac = Math.atan2(CAM1[0] - T[0], CAM1[2] - T[1]);
        const seat = W.Mat({ color: 0x2b2622 }); own.push(seat);
        own.push(W.add(terraceSet(W, ac, seat), 0, PAVE, 0));
        // the one with the phone sits on the left of the table; its phone, still in its hand, is turned up to the eye so the screen reads
        const hp = at(ac - 1.45, 0.95);
        const holder = W.add(W.zombie('phone'), hp[0], PAVE, hp[1]);
        holder.rotation.y = yawTo(hp[0], hp[1], T[0], T[1]) + 0.25;
        holder.updateMatrixWorld(true);
        const pm = holder.children.find(m => m.material === W.PK.phone);
        const c0 = new THREE.Vector3(0.27, 0.72, -0.74), c1 = new THREE.Vector3(0.27, 0.8, -0.7);   // the screen in the builder, and where it is held
        const toEye = holder.worldToLocal(new THREE.Vector3(...CAM1)).sub(c1).normalize().add(new THREE.Vector3(0, 0.7, 0)).normalize();
        const qs = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), toEye).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.9, 0, 0)));
        pm.quaternion.copy(qs); pm.position.copy(c1).sub(c0.clone().applyQuaternion(qs));
        holder.updateMatrixWorld(true);
        const phone = holder.localToWorld(c1.clone());
        const others = [[ac + 1.25, 1.05, 0], [ac + Math.PI - 0.45, 1.1, -0.06]].map(([a, r, bow]) => {
          const [x, z] = at(a, r), d = W.add(W.zombie('plain'), x, PAVE, z);
          d.rotation.order = 'YXZ'; d.rotation.y = yawTo(x, z, phone.x, phone.z); d.rotation.x = d.userData.bow = bow; return d;
        });
        const glowM = W.GlowMat(W.glowTex, 0x9fe8ff, 0.45, true), poolM = W.GlowMat(W.glowTex, 0x7fd8f0, 0.4); own.push(glowM, poolM);
        const glow = W.add(new THREE.Sprite(glowM), phone.x, phone.y + 0.02, phone.z); glow.scale.set(0.55, 0.55, 1);
        const pool = W.add(new THREE.Mesh(W.KG.plane, poolM), phone.x, 0.645 + PAVE, phone.z); pool.rotation.x = -Math.PI / 2; pool.scale.set(0.9, 0.9, 1);
        // the tall woman in the road beside him: the bonnet a little dimmer, so white does not outshine his orange; the skirt near black,
        // so she stands out from the wet road as a silhouette
        const her = W.add(W.zombie('bonnet'), HER[0], 0, HER[1]);
        const linen = W.Mat({ color: 0x8e9196 }), skirt = W.Mat({ color: 0x0c0d11 }); own.push(linen, skirt);
        her.traverse(m => { if (m.isMesh && m.material === W.PK.linen) m.material = linen; if (m.isMesh && m.material === W.PK.skirt) m.material = skirt; });
        her.scale.setScalar(1.34); her.rotation.order = 'YXZ';
        her.rotation.y = yawTo(HER[0], HER[1], 0.7, Z2 - 2.2);
        cast = { holder, others, her, glow };
      } finally { Math.random = R; }
      // the near street is set by hand: the props, trees and walkers the town put round both set-ups are hidden, and given back at the
      // end, so nothing random stands in front of the table; the near ground mist goes too, so it does not sit in front of him
      const box = new THREE.Box3(), size = new THREE.Vector3();
      const isLamp = o => { let y = false; o.traverse(m => { if (m.material === W.PM.lampHead) y = true; }); return y; };
      for (const o of W.scene.children) {
        if (!o.visible || o.userData.cineWorld != null || o === W.bike) continue;
        const { x, z } = o.position;
        if (o.isSprite && o.userData.band) { if (o.userData.band.side && z > -12) { o.visible = false; hidden.push(o); } continue; }
        if (!o.isGroup || Math.abs(x) > 13 || z < -24 || z > 36 || isLamp(o)) continue;
        box.setFromObject(o).getSize(size);
        if (!o.userData.bill && (Math.max(size.x, size.z) > 5 || size.y > 7)) continue;   // houses, rows, the church and the tower stay
        o.visible = false; hidden.push(o);
      }
      dress(W);
      W.speed(0);
      W.ride(Z2);
      W.face('deadpan');
      const u = W.bike.userData;
      u.head.rotation.order = 'YXZ';   // he turns to her, then looks up
      // his lamp, stopped: the spot moves from his back to the headlamp and lights a small pool on the road just ahead of him,
      // not a beam down the street and a disc on his coat; the game sets only its strength every frame
      const L = W.lampLight;
      lampWas = { y: L.position.y, ty: L.target.position.y, angle: L.angle, pen: L.penumbra };
      L.position.y = 0.88; L.position.z = Z2 - 0.95; L.target.position.z = Z2 - 2.7; L.angle = 0.3; L.penumbra = 0.9;
      W.beam.visible = false;
      // and it burns low and amber: his own lens and halo stand in for the game's, which it brightens every frame
      const lensM = new THREE.MeshBasicMaterial({ color: 0xd8902e }), lensHalo = W.GlowMat(W.glowTex, 0xff9a3a, 0.3, true); own.push(lensM, lensHalo);
      const disc = new THREE.Mesh(W.KG.disc, lensM); disc.position.copy(u.lampMesh.position); disc.rotation.y = Math.PI; disc.scale.setScalar(0.068 / 0.3);
      const halo = new THREE.Sprite(lensHalo); halo.position.copy(u.lampGlow.position); halo.scale.set(0.5, 0.5, 1);
      lens = [disc, halo]; for (const o of lens) W.bike.add(o);
      u.lampMesh.visible = false; u.lampGlow.visible = false;
      // his coat a little self-lit, so the orange stays the one saturated colour in the frame: his own copy, given back at the end
      const warm = W.Mat({ color: W.M.shirt.color.getHex() }); warm.emissive.copy(W.M.shirt.color).multiplyScalar(0.28); own.push(warm);
      W.bike.traverse(m => { if (m.isMesh && m.material === W.M.shirt) { coat.push(m); m.material = warm; } });
      W.say('Tikkie: €4,50', [cast.glow.position.x, cast.glow.position.y + 0.28, cast.glow.position.z], { from: 0.4, to: CUT - 0.15, dy: 0 });
      this.update(W, 0, 0);
    },
    update(W, t) {
      if (!cast) return;
      const { holder, others, her, glow } = cast, cam = W.camera.position;
      // the Tikkie pings every 1.6 s from 0.4 s, with the bubble: the screen flares and the two across lean in on it
      const pt = t < 0.4 ? 9 : (t - 0.4) % 1.6, ping = Math.exp(-pt * 5);
      glow.material.opacity = 0.4 + 0.35 * ping;
      holder.rotation.z = Math.sin(t * 1.1) * 0.03;
      others.forEach((d, i) => { d.rotation.z = Math.sin(t * (1.3 + i * 0.4) + i) * 0.035; d.rotation.x = d.userData.bow - 0.06 * Math.exp(-pt * 2.2); });
      // she stands up straight at first, then bends a little to look down at him
      her.rotation.z = Math.sin(t * 0.9 + 1) * 0.025;
      her.rotation.x = W.lerp(0.06, -0.06, W.smooth(W.clamp((t - CUT) / 6, 0, 1)));
      for (const tr of trees) tr.rotation.y = Math.atan2(cam.x - tr.position.x, cam.z - tr.position.z);
      walker.position.z = 27.4 - t * 0.2; walker.rotation.z = Math.sin(t * 2.1) * 0.06;
      const two = t >= CUT;
      W.bike.visible = her.visible = two;
      W.lampLight.target.position.y = two ? 0 : 60;   // until he is in the picture his lamp lights nothing
      if (!two) {   // low on the terrace, a slow push in over the table
        const k = W.smooth(W.clamp(t / CUT, 0, 1));
        W.cam(W.lerp(CAM1[0], CAM1[0] - 0.3, k), W.lerp(CAM1[1], CAM1[1] - 0.06, k), W.lerp(CAM1[2], CAM1[2] - 0.35, k), T[0], 1.3, T[1], 42);
        W.drift(t, 0.7);
        return;
      }
      // the two of them at his eye level, the whole of her over the whole of him, pushing in to the two faces; past the planned
      // ten seconds the push goes on, very slowly
      const s = t - CUT, k = W.smooth(W.clamp(s / 7.5, 0, 1)), late = Math.max(0, s - 7.5) * 0.03;
      // he looks up at her; late in the beat a deadpan glance at us, then back up at her
      const g = W.smooth(W.clamp((s - 3.3) / 0.35, 0, 1)) * (1 - W.smooth(W.clamp((s - 4.9) / 0.45, 0, 1)));
      W.bike.userData.head.rotation.y = W.lerp(0.62, -0.08, g); W.bike.userData.head.rotation.x = W.lerp(0.5, 0.04, g);
      W.cam(W.lerp(0.35, 0.15, k), W.lerp(1.92, 1.94, k), Z2 + W.lerp(-7.8, -5.3, k) + late, W.lerp(-0.45, -0.38, k), W.lerp(1.35, 1.98, k), Z2 - 0.2, 34);
      W.drift(t, 0.5);
    },
    dispose(W) {
      const u = W.bike.userData;
      for (const m of coat) m.material = W.M.shirt;
      for (const o of lens) W.bike.remove(o);
      u.lampMesh.visible = true; u.lampGlow.visible = true; W.beam.visible = true;
      if (lampWas) { const L = W.lampLight; L.position.y = lampWas.y; L.target.position.y = lampWas.ty; L.angle = lampWas.angle; L.penumbra = lampWas.pen; }
      u.head.rotation.x = 0; u.head.rotation.order = 'XYZ';
      for (const o of hidden) o.visible = true;
      // only what this shot made: its own materials, and the merged geometry of its own kits and its bike row
      const PG = Object.values(W.PG);
      for (const o of own) {
        if (o.isMaterial) o.dispose();
        else o.traverse(m => { if (m.isMesh && m.geometry && m.geometry.userData.kit && !PG.includes(m.geometry)) m.geometry.dispose(); });
      }
      cast = null; own = []; hidden = []; coat = []; lens = []; trees = []; walker = null; lampWas = null;
    },
  };
})();