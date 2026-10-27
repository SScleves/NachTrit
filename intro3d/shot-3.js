// Intro panel 3 in 3D: "Nobody agrees on what caused it. Some say it was the cheese."
// Gouda, the Markt at three in the morning. The suspect stands on the wet cobbles before the stadhuis: a pile of cheese
// wheels glowing a faint sick yellow, a wisp of mist curling up out of it into the haze, as if the mist came from the cheese.
// 1. 0 to 3 s: a slow, low push-in on the pile. Two of the dead with cheese stacked on their backs shuffle past behind it.
// 2. From 3 s: the second one stops beside the pile, leans in and sniffs twice (3.75 and 4.35 s: a thread of the mist goes
//    up its nose), straightens, turns its yellow eyes to the camera and at 5.4 s gives the painting's verdict, Extra belegen,
//    with a slow nod. The push-in ends on the two of them, the pile and its judge, and keeps creeping in if the panel holds.
// The set hides what the game puts in its way (see clearSet) and puts it back in dispose.
(function () {
  const C = window.NRCINE = window.NRCINE || [];
  const PZ = -10, GY = 0.09;                 // the pile's middle along the road; the cobbles lie just over the road and kerbs
  const R = 0.3, HT = 0.11, D = 0.62;        // a wheel: its radius and half its thickness; the spacing in a row
  const TOP = GY + 2 * R + 3 * D * 0.866;    // the top of the pile
  const SICK = 0xb9c24e;                     // the cheese's own light: yellow gone a little green
  const NW = 40, NS = 16, NP = 12;           // segments in a wisp and in the sniffed thread; soft puffs round the wisp
  let own = [], hidden = [], st = null, seed = 1;
  const keep = x => { own.push(x); return x; };
  const rr = (a, b) => { seed = (seed * 16807) % 2147483647; return a + (seed / 2147483647) * (b - a); };
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
  function tex(W, c, srgb, wrap) {
    const t = new W.THREE.CanvasTexture(c); if (srgb) t.colorSpace = W.THREE.SRGBColorSpace;
    if (wrap) { t.wrapS = t.wrapT = W.THREE.RepeatWrapping; t.anisotropy = 8; }
    return keep(t);
  }
  function rounded(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

  // ---------- canvas textures ----------
  // wet setts in staggered rows, 2 m to a tile; every row covers exactly one width, so the tile repeats without a seam
  function cobbleTex(W) {
    const N = 512, rows = 16, rh = N / rows, [c, g] = canvas(N, N);
    g.fillStyle = '#121519'; g.fillRect(0, 0, N, N);
    for (let y = 0; y < rows; y++) {
      const x0 = -rr(0, rh * 1.6); let x = x0;
      while (x < x0 + N - 1) {
        let w = rh * rr(1.3, 1.9); if (x + w > x0 + N - rh * 0.9) w = x0 + N - x;
        const v = Math.round(rr(38, 56)), b = Math.round(rr(6, 14));
        for (const ox of x < 0 ? [0, N] : [0]) {
          const sx = x + ox + 2, sy = y * rh + 2;
          g.fillStyle = `rgb(${v},${v + 3},${v + b})`; rounded(g, sx, sy, w - 4, rh - 4, 5); g.fill();
          g.fillStyle = 'rgba(190,200,215,0.08)'; g.fillRect(sx + 3, sy + 1, w - 10, 2);   // the wet top edge catches the sky
        }
        x += w;
      }
    }
    for (let i = 0; i < 2600; i++) { g.fillStyle = rr(0, 1) < 0.5 ? 'rgba(8,10,14,0.35)' : 'rgba(150,160,175,0.12)'; g.fillRect(rr(0, N), rr(0, N), 1.5, 1.5); }
    return tex(W, c, true, true);
  }
  // the faces of the wheels, four in one texture: waxed rind, the casein mark, and on two of them blue-green mould
  function faceTex(W) {
    const [c, g] = canvas(256, 256);
    g.fillStyle = '#e9d48e'; g.fillRect(0, 0, 256, 256);
    for (let q = 0; q < 4; q++) {
      const cx = (q % 2) * 128 + 64, cy = (q >> 1) * 128 + 64, gr = g.createRadialGradient(cx - 8, cy - 10, 4, cx, cy, 64);
      gr.addColorStop(0, '#f2d672'); gr.addColorStop(0.72, '#dcb94e'); gr.addColorStop(0.92, '#a8892f'); gr.addColorStop(1, '#6a5420');
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, 64, 0, 7); g.fill();
      for (let i = 0; i < 24; i++) { const a = rr(0, 7), d = rr(0, 50); g.fillStyle = rr(0, 1) < 0.5 ? 'rgba(255,240,170,0.1)' : 'rgba(120,84,24,0.08)'; g.beginPath(); g.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, rr(4, 11), 0, 7); g.fill(); }
      g.fillStyle = 'rgba(244,236,214,0.9)'; g.beginPath(); g.ellipse(cx + 12, cy - 20, 10, 6, 0.25, 0, 7); g.fill();
      g.fillStyle = 'rgba(150,130,90,0.8)'; g.fillRect(cx + 5, cy - 21, 14, 1.5);
      if (q > 1) for (let i = 0; i < (q === 3 ? 5 : 2); i++) {
        const rad = rr(4, q === 3 ? 12 : 8), a = rr(0, 7), d = rr(8, 62 - rad), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
        g.fillStyle = 'rgba(200,210,190,0.3)'; g.beginPath(); g.arc(x, y, rad + 1.5, 0, 7); g.fill();
        const m = g.createRadialGradient(x, y, 0, x, y, rad); m.addColorStop(0, 'rgba(38,76,70,0.95)'); m.addColorStop(1, 'rgba(70,108,92,0.6)');
        g.fillStyle = m; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
      }
    }
    return tex(W, c, true, false);
  }
  // a broad soft puff of mist, a little uneven
  function puffTex(W) {
    const [c, g] = canvas(128, 128);
    for (let i = 0; i < 14; i++) {
      const a = rr(0, 7), d = rr(0, 18), x = 64 + Math.cos(a) * d, y = 64 + Math.sin(a) * d, rad = rr(30, 50), gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, `rgba(255,255,255,${rr(0.08, 0.14).toFixed(3)})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    }
    g.globalCompositeOperation = 'destination-in';
    const m = g.createRadialGradient(64, 64, 8, 64, 64, 64); m.addColorStop(0, '#000'); m.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = m; g.fillRect(0, 0, 128, 128);
    return tex(W, c, false, false);
  }
  // the filaments of a wisp, running along it: soft across, wavy strands along, repeating along its length
  function wispTex(W) {
    const w = 64, h = 256, [c, g] = canvas(w, h), img = g.createImageData(w, h), d = img.data, TAU = Math.PI * 2;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const u = (x + 0.5) / w, v = y / h, s = u + 0.08 * Math.sin(TAU * v + 1.3) + 0.04 * Math.sin(TAU * 3 * v);
      const fil = 0.5 + 0.28 * Math.sin(TAU * 3.2 * s + 0.6) + 0.22 * Math.sin(TAU * (2 * v + 1.6 * s));
      const a = Math.pow(Math.sin(Math.PI * u), 1.5) * Math.max(0, Math.min(1, fil)), i = (y * w + x) * 4;
      d[i] = d[i + 1] = d[i + 2] = 255; d[i + 3] = Math.round(a * 255);
    }
    g.putImageData(img, 0, 0);
    const t = tex(W, c, false, false); t.wrapT = W.THREE.RepeatWrapping; return t;
  }
  // light in the haze: broad and soft, no hot centre
  function haloTex(W) {
    const [c, g] = canvas(128, 128), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,255,255,0.8)'); r.addColorStop(0.3, 'rgba(255,255,255,0.58)'); r.addColorStop(0.6, 'rgba(255,255,255,0.22)'); r.addColorStop(0.85, 'rgba(255,255,255,0.05)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    return tex(W, c, false, false);
  }
  // a reflection on wet stone: broken by ripples, strongest at the far end (the pile), gone toward the eye
  function streakTex(W) {
    const [c, g] = canvas(64, 256);
    for (let y = 0; y < 256; y += 2) {
      const t = y / 255, rip = 0.55 + 0.45 * Math.sin(y * 0.47) * Math.sin(y * 0.13 + 1), w = 8 + 4 * Math.sin(y * 0.21);
      const k = Math.pow(Math.sin(t * Math.PI), 1.3) * (1 - 0.65 * t) * Math.max(0, rip);
      const gr = g.createLinearGradient(32 - w * 2, 0, 32 + w * 2, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${k.toFixed(3)})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, y, 64, 2);
    }
    return tex(W, c, false, false);
  }

  // ---------- the set ----------
  // a Gouda wheel: a bulging rind turned on a lathe and two flat faces. wheel(x, y, z, flat, pitch, yaw, q, mats) adds one
  // to the kit: on edge with its faces to the camera, or lying down; q picks the face, mats is [rind, face]
  function wheels(W, k) {
    const T = W.THREE;
    const side = keep(new T.LatheGeometry([[0.236, -HT], [0.266, -HT + 0.012], [0.289, -0.07], [R, -0.025], [R, 0.025], [0.289, 0.07], [0.266, HT - 0.012], [0.236, HT]].map(([x, y]) => new T.Vector2(x, y)), 24));
    const disc = [0, 1, 2, 3].map(q => { const d = new T.CircleGeometry(0.237, 24), uv = d.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, (q % 2) * 0.5 + uv.getX(i) * 0.5, 0.5 - (q >> 1) * 0.5 + uv.getY(i) * 0.5); return keep(d); });   // the canvas is flipped: its top row is v = 1
    const e = new T.Euler(), qt = new T.Quaternion(), p = new T.Vector3(), one = new T.Vector3(1, 1, 1);
    return (x, y, z, flat, pitch, yaw, q, mats) => {
      e.set((flat ? -Math.PI / 2 : 0) + pitch, yaw, 0, 'YXZ'); qt.setFromEuler(e); p.set(x, y, z); k.base.compose(p, qt, one);
      W.kadd(k, side, mats[0], 0, 0, 0, Math.PI / 2, 0, 0);
      W.kadd(k, disc[q], mats[1], 0, 0, HT); W.kadd(k, disc[(q + 1) % 4], mats[1], 0, 0, -HT, 0, Math.PI, 0);
      k.base.identity();
    };
  }
  // the stadhuis, alone on the Markt: a Gothic hall with a stepped gable full of pinnacles, two corner turrets and a slim
  // ridge turret; a few windows still lit. Its market front faces plus z.
  function stadhuis(W, stone, cone) {
    const k = W.kit(), roof = W.PM.roof, win = W.PM.winAtlas, w = 10, eave = 10, d = 20, ridge = 7;
    W.kb(k, stone, 0, eave / 2, -d / 2, w, eave, d);
    W.kb(k, stone, 0, 0.6, 0.5, 4.6, 1.2, 1.2);                                                 // the bordes, the stair before the door
    const sl = Math.hypot(w / 2, ridge) + 0.3, a = Math.atan2(ridge, w / 2);
    for (const s of [-1, 1]) W.kb(k, roof, s * w / 4, eave + ridge / 2, -d / 2 - 0.4, sl, 0.3, d - 0.8, 0, 0, -s * a);
    const steps = 6, hs = ridge * 1.2 / steps;
    for (let i = 0; i < steps; i++) {
      const ww = w * (1 - i / steps) + 0.2, y = eave + (i + 0.5) * hs; W.kb(k, stone, 0, y, -0.25, ww, hs, 0.5);
      for (const s of [-1, 1]) W.kadd(k, cone, roof, s * (ww / 2 - 0.12), eave + (i + 1) * hs + 0.45, -0.25, 0, 0, 0, 0.28, 0.9, 0.28);
    }
    W.kadd(k, cone, roof, 0, eave + ridge * 1.2 + 0.7, -0.25, 0, 0, 0, 0.36, 1.4, 0.36);
    for (const s of [-1, 1]) {                                                                   // the corner turrets
      W.kadd(k, W.KG.cyl, stone, s * (w / 2 + 0.15), eave + 0.5, 0.15, 0, 0, 0, 1.3, 9, 1.3);
      W.kadd(k, cone, roof, s * (w / 2 + 0.15), eave + 7.2, 0.15, 0, 0, 0, 1.6, 4.4, 1.6);
    }
    W.kadd(k, W.KG.cyl, stone, 0, eave + ridge + 1.3, -7, 0, 0, 0, 1.3, 2.8, 1.3);               // the ridge turret
    W.kadd(k, cone, roof, 0, eave + ridge + 5.4, -7, 0, 0, 0, 1.5, 5.6, 1.5);
    const lit = new Set(['0,1', '1,2']);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) W.kadd(k, W.PG['win' + (lit.has(r + ',' + c) ? (r + c) % 3 : 4)], win, -3.3 + c * 2.2, 3.4 + r * 3.6, 0.03, 0, 0, 0, 1.0, 2.4, 1);
    W.kadd(k, W.PG.win1, win, 0, eave + 2.4, 0.03, 0, 0, 0, 0.8, 1.5, 1);                          // up in the gable
    for (let i = 0; i < 5; i++) W.kadd(k, W.PG['win' + (i === 2 ? 2 : 4)], win, w / 2 + 0.03, 5.2, -3.5 - i * 3.3, 0, Math.PI / 2, 0, 1.0, 2.6, 1);   // the long side
    const g = W.kbuild(k); g.traverse(m => { if (m.isMesh) keep(m.geometry); });
    return g;
  }
  // a strip of mist that turns to the eye: the mesh is rebuilt along a path every frame (lay), with its texture running along it
  function ribbon(W, n, map) {
    const T = W.THREE, geo = keep(new T.BufferGeometry()), idx = [];
    geo.setAttribute('position', new T.BufferAttribute(new Float32Array((n + 1) * 6), 3));
    geo.setAttribute('uv', new T.BufferAttribute(new Float32Array((n + 1) * 4), 2));
    geo.setAttribute('color', new T.BufferAttribute(new Float32Array((n + 1) * 8), 4));
    for (let i = 0; i < n; i++) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    geo.setIndex(idx);
    const m = new T.Mesh(geo, keep(new T.MeshBasicMaterial({ map, transparent: true, depthWrite: false, vertexColors: true, side: T.DoubleSide })));
    m.frustumCulled = false; m.renderOrder = 5; m.userData.n = n;
    return W.add(m, 0, 0, 0);
  }
  const _r = {};
  // lay a ribbon along path(out, s) for s from 0 to 1: its width wid(s), colour col(out, s) and alpha alp(s); v0 scrolls its strands
  function lay(rb, path, wid, col, alp, v0, vlen, eye) {
    const n = rb.userData.n, g = rb.geometry, pos = g.attributes.position.array, uv = g.attributes.uv.array, cl = g.attributes.color.array;
    const A = _r.a, B = _r.b, Tn = _r.t, E = _r.e, S = _r.s, c = _r.c;
    for (let i = 0; i <= n; i++) {
      const s = i / n; path(A, s); path(B, Math.min(1, s + 0.5 / n)); if (i === n) { path(B, s); path(A, s - 0.5 / n); }
      Tn.subVectors(B, A).normalize(); E.subVectors(eye, A).normalize(); S.crossVectors(Tn, E).normalize().multiplyScalar(wid(s) / 2);
      path(A, s);
      pos[i * 6] = A.x - S.x; pos[i * 6 + 1] = A.y - S.y; pos[i * 6 + 2] = A.z - S.z; pos[i * 6 + 3] = A.x + S.x; pos[i * 6 + 4] = A.y + S.y; pos[i * 6 + 5] = A.z + S.z;
      const v = v0 + s * vlen; uv[i * 4] = 0; uv[i * 4 + 1] = v; uv[i * 4 + 2] = 1; uv[i * 4 + 3] = v;
      col(c, s); const a = alp(s); for (const o of [0, 4]) { cl[i * 8 + o] = c.r; cl[i * 8 + o + 1] = c.g; cl[i * 8 + o + 2] = c.b; cl[i * 8 + o + 3] = a; }
    }
    g.attributes.position.needsUpdate = g.attributes.uv.needsUpdate = g.attributes.color.needsUpdate = true;
  }

  // what the game's set puts where this shot stands, hidden while it plays: its own town hall (ours is placed), a church too
  // close to the lens with a window like a slab of orange, the dead that shuffle along the kerbs, near the set the blue
  // bike-lane signs, the red tulips, the sprayed words and the white fingerposts, the furniture on the carriers' path, and any
  // lamp whose halo would hang right behind the pile, beside the wisp
  function clearSet(W) {
    hidden = [];
    const cams = [[1.2, 0.4], [1.1, -2.6]], bearing = (cx, cz, x, z) => Math.atan2(x - cx, cz - z);
    for (const o of W.scene.children) {
      if (!o.visible || o.userData.cineWorld != null) continue;
      const c0 = o.children && o.children[0], gp = c0 && c0.geometry && c0.geometry.parameters;
      const hall = gp && gp.width === 7 && gp.height === 11 && gp.depth === 12;
      const church = gp && gp.width === 8 && gp.height === 9 && gp.depth === 16 && o.position.z > -60;
      let sign = false, tulips = false, lamp = false, finger = false;
      o.traverse(m => {
        if (m.material === W.PK.bikeSign) sign = true; if (m.material === W.PM.tulip) tulips = true; if (m.material === W.PM.lampHead) lamp = true;
        const q = m.geometry && m.geometry.parameters; if (q && q.radiusTop === 0.05 && q.radiusBottom === 0.06 && q.height === 2.6) finger = true;
      });
      const dead = o.userData.shuffle != null && o.position.z > -75, near = o.position.z > -45, x = o.position.x, z = o.position.z;
      const behind = lamp && z < PZ - 2 && cams.some(([cx, cz]) => Math.abs(bearing(cx, cz, x, z) - bearing(cx, cz, 0, PZ)) < 0.16);
      const path = !lamp && x > 2.5 && x < 8 && z > -19 && z < -5;   // where the carriers walk: their silhouettes stay clean
      if (hall || church || dead || behind || path || (near && (sign || tulips || finger))) { o.visible = false; hidden.push(o); continue; }
      if (near) o.traverse(m => { const q = m.geometry && m.geometry.parameters; if (m.isMesh && q && q.width === 4.6 && q.height === 2.2 && m.visible) { m.visible = false; hidden.push(m); } });   // a word sprayed on a garden wall
    }
  }

  function walker(W, variant, x, z, heading) {
    const g = new W.THREE.Group(), zb = W.zombie(variant); zb.rotation.set(0, 0, 0); g.add(zb);
    W.add(g, x, GY, z, heading);
    return { g, zb };
  }
  // a shuffling step: the body rocks side to side and dips a little with each foot, as much as it is walking
  function shuffle(a, t, walk, ph) {
    const s = t * 1.9 + ph;
    a.zb.rotation.z = Math.sin(s) * 0.075 * walk + Math.sin(t * 0.7 + ph) * 0.02;
    a.zb.position.y = -Math.abs(Math.sin(s)) * 0.035 * walk;
  }
  const turnTo = (cur, want, k) => { let d = want - cur; d = Math.atan2(Math.sin(d), Math.cos(d)); return cur + d * k; };
  const SNIFFS = [3.75, 4.35];
  function sniffK(t) { for (const s of SNIFFS) { const d = t - s; if (d >= 0 && d < 0.42) return Math.sin(Math.PI * d / 0.42); } return 0; }
  // the wisp at height h (0 to 1) at time t: a twist climbs it while the column widens and leans away into the haze
  function mistAt(out, h, t, j, lean) {
    const tw = 5.2 * h - 0.85 * t + j, amp = 0.06 + 0.75 * h;
    return out.set(0.05 + Math.sin(tw) * amp - lean * h * h, TOP - 0.55 + 6.8 * Math.pow(h, 0.9), PZ + Math.cos(tw) * amp * 0.45);
  }
  // the thread a sniff draws off the top of the pile: from the top (s = 0) in a low arc to his nose (s = 1)
  function streamAt(out, s, nose) {
    const x0 = 0.05, y0 = TOP - 0.1, z0 = PZ, u = 1 - s, cx = (x0 + nose.x) / 2, cy = Math.max(y0, nose.y) + 0.4, cz = (z0 + nose.z) / 2 + 0.25;
    return out.set(u * u * x0 + 2 * u * s * cx + s * s * nose.x, u * u * y0 + 2 * u * s * cy + s * s * nose.y, u * u * z0 + 2 * u * s * cz + s * s * nose.z);
  }

  // the push-in: low, slow, from a wide view of the market to the pile and its judge; past the hold it keeps creeping in
  function camAt(W, t) {
    const k = W.smooth(W.clamp(t / 7.8, 0, 1)), kl = W.smooth(W.clamp((t - 2.0) / 4.8, 0, 1)), late = Math.max(0, t - 7.8);
    W.cam(W.lerp(1.2, 1.15, k) + late * 0.025, W.lerp(0.75, 0.92, k), W.lerp(0.4, -2.6, k) - late * 0.06,
      W.lerp(0.05, 1.45, kl), W.lerp(1.35, 1.5, kl), PZ - 0.5 * kl, W.lerp(41, 38, k));
    W.drift(t, 0.7);
  }

  C[2] = {
    hold: 7.5,
    build(W) {
      const T = W.THREE; own = []; seed = 7;
      W.stage({ town: 'gouda', theme: 'square', rider: false, fog: 1.1 });
      W.speed(0);
      clearSet(W);
      st = {};
      _r.a = new T.Vector3(); _r.b = new T.Vector3(); _r.t = new T.Vector3(); _r.e = new T.Vector3(); _r.s = new T.Vector3(); _r.c = new T.Color();

      // the cobbles of the Markt over road, kerbs and pavement
      const ct = cobbleTex(W); ct.repeat.set(18, 46);
      const ground = new T.Mesh(keep(new T.PlaneGeometry(36, 92).rotateX(-Math.PI / 2)), keep(new T.MeshPhongMaterial({ map: ct, specular: 0x3c4654, shininess: 34 })));
      W.add(ground, 8.3, GY, -37);
      // puddles hold the sky
      const pk = W.kit();
      for (const [x, z, sx, sz] of [[0.3, PZ + 3.4, 1.2, 0.55], [-2.6, PZ + 6.2, 0.8, 0.4], [2.7, PZ + 1.6, 0.7, 0.35], [-0.9, PZ - 3.5, 1.1, 0.45]]) W.kadd(pk, W.KG.disc, W.M.puddle, x, GY + 0.006, z, -Math.PI / 2, 0, 0, sx * 3.3, sz * 3.3, 1);
      const pud = W.kbuild(pk); pud.traverse(m => { if (m.isMesh) { keep(m.geometry); m.renderOrder = 1; } }); W.add(pud, 0, 0, 0);

      // the suspect, and the market laid out round it, its cheese glowing less
      const ft = faceTex(W);
      const sus = st.sus = [keep(W.Mat({ color: 0xcf9f36, emissive: SICK, emissiveIntensity: 0.3 })), keep(W.Mat({ map: ft, emissive: 0xdde67a, emissiveMap: ft, emissiveIntensity: 0.55 }))];
      const mkt = [keep(W.Mat({ color: 0xcf9f36, emissive: SICK, emissiveIntensity: 0.1 })), keep(W.Mat({ map: ft, emissive: 0xdde67a, emissiveMap: ft, emissiveIntensity: 0.2 }))];
      const k = W.kit(), wheel = wheels(W, k);
      const mould = [0, 2, 1, 0, 3, 1, 0, 2, 0, 1];
      let n = 0;
      for (let L = 0; L < 2; L++) for (let row = 0; row < 4; row++) for (let i = 0; i < 4 - row; i++, n++)
        wheel((i - (3 - row) / 2) * D + (L ? 0.05 : 0) + rr(-0.02, 0.02), GY + R + 0.005 + row * D * 0.866, PZ + (L ? -0.135 : 0.135) + rr(-0.02, 0.02), false, rr(-0.04, 0.04), rr(-0.09, 0.09), L ? (n % 4) : mould[n % 10], sus);
      for (const [x, z, m] of [[-2.7, PZ - 0.6, 5], [-3.35, PZ + 0.1, 3], [-1.6, PZ - 5.5, 4]])   // stacks set out for market day
        for (let i = 0; i < m; i++) wheel(x + rr(-0.03, 0.03), GY + HT + i * 2.04 * HT, z + rr(-0.03, 0.03), true, rr(-0.02, 0.02), rr(0, 6), (i + m) % 4, mkt);
      const cheese = W.kbuild(k); cheese.traverse(m => { if (m.isMesh) keep(m.geometry); }); W.add(cheese, 0, 0, 0);

      // its sick light: in the haze behind it, over its faces, in a pool on the cobbles and a reflection running toward the eye
      const flat = keep(new T.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)), ht = haloTex(W);
      st.halo = new T.Sprite(keep(W.GlowMat(ht, SICK, 0.26, true))); st.halo.scale.set(9, 7.5, 1); W.add(st.halo, 0, 1.2, PZ - 4.8);
      st.core = new T.Sprite(keep(W.GlowMat(W.glowTex, 0xe8ec90, 0.1, true))); st.core.scale.set(2.8, 2.6, 1); W.add(st.core, 0, 1.2, PZ + 0.6);
      st.pool = new T.Mesh(flat, keep(W.GlowMat(ht, SICK, 0.3))); st.pool.scale.set(6, 1, 3.8); st.pool.renderOrder = 2; W.add(st.pool, 0, GY + 0.02, PZ + 1.0);
      st.refl = new T.Mesh(flat, keep(W.GlowMat(streakTex(W), 0xd2d65e, 0.3))); st.refl.scale.set(1.5, 1, 6.5); st.refl.renderOrder = 3; W.add(st.refl, 0.05, GY + 0.025, PZ + 3.6);

      // the mist that comes out of it: two strands twisting round each other, soft puffs round them, and the thread a sniff draws
      const wt = wispTex(W);
      st.wisps = [ribbon(W, NW, wt), ribbon(W, NW, wt)];
      st.thread = ribbon(W, NS, wt);
      const pt = puffTex(W); st.puffs = [];
      for (let i = 0; i < NP; i++) {
        const m = keep(new T.SpriteMaterial({ map: pt, transparent: true, depthWrite: false, opacity: 0, color: 0xd6da9c }));
        const s = new T.Sprite(m); s.renderOrder = 4; W.add(s, 0, TOP, PZ);
        st.puffs.push({ s, m, off: i / NP, j: rr(-0.5, 0.5), rot: rr(0, 6.3), spin: rr(-0.2, 0.2) });
      }
      st.pale = new T.Color(0xe6e8b0); st.mist = new T.Color(0x8e9aa8); st.nose = new T.Vector3(); st.v = new T.Vector3(); st.eye = new T.Vector3();

      // a sign over the market
      const sk = W.kit(), lt = W.labelTexture('KAASMARKT', { bg: '#241c15', fg: '#e8dcc0' });
      W.kb(sk, W.M.wood, 0, 1.4, 0, 0.12, 2.8, 0.12); W.kb(sk, W.M.wood, 0.55, 2.72, 0, 1.25, 0.08, 0.08);
      const post = W.kbuild(sk); post.traverse(m => { if (m.isMesh) keep(m.geometry); });
      const board = new T.Mesh(keep(new T.PlaneGeometry(1.2, 0.58)), (W.Mat({ map: lt, emissive: 0xffffff, emissiveMap: lt, emissiveIntensity: 0.14, side: T.DoubleSide })));
      board.position.set(0.62, 2.3, 0); board.userData.ownTex = true; post.add(board);   // ownTex: the shot's end disposes its texture and material
      W.add(post, -4.6, GY, PZ - 3.4, 0.42);

      // the stadhuis in the haze behind it
      const cone = keep(new T.ConeGeometry(0.5, 1, 8));
      W.add(stadhuis(W, keep(W.Mat({ color: 0x8e908a })), cone), 2.8, GY, -64, -0.3);

      // the dead: two cheese carriers shuffling past behind the pile, and three more standing round it in the fog
      st.A = walker(W, 'cheese', 2.6, -14.2, Math.PI / 2);   // far enough back that the pile hides him while he passes behind it
      st.B = walker(W, 'cheese', 4.2, -11.0, Math.PI / 2);
      st.head = new T.Object3D(); st.head.position.set(0, 1.62, -0.86); st.B.zb.add(st.head);
      st.round = [];
      for (const [v, x, z] of [['bonnet', -4.8, -18.5], ['plain', 7.2, -24], ['plain', -1.9, -27]]) {
        const a = walker(W, v, x, z, 0); a.g.rotation.y = Math.atan2(-(0 - x), -(PZ - z)); st.round.push(a);
      }
      W.say('Extra belegen.', st.head, { from: 5.4, to: 9.8, dy: 0.62 });
      W.ride(90);                                    // he is not in this shot: his lamp waits far behind the lens, out of reach
      camAt(W, 0);
    },
    update(W, t, dt) {
      if (!st) return;
      // the light breathes, slowly
      const br = 0.5 + 0.5 * Math.sin(t * 1.05 - 1.2);
      st.halo.material.opacity = 0.26 * (0.8 + 0.3 * br); st.core.material.opacity = 0.1 * (0.7 + 0.4 * br);
      st.pool.material.opacity = 0.3 * (0.8 + 0.3 * br); st.refl.material.opacity = 0.3 * (0.85 + 0.25 * br);
      st.sus[0].emissiveIntensity = 0.3 * (0.85 + 0.25 * br); st.sus[1].emissiveIntensity = 0.55 * (0.85 + 0.25 * br);

      // A shuffles across the square and, if the panel holds, turns down it into the fog; B shuffles, slows, stops beside the pile
      const A = st.A, B = st.B;
      if (t < 9.5) A.g.position.x = 2.6 - 0.62 * t;
      else { const h = A.g.rotation.y = turnTo(A.g.rotation.y, 0.25, Math.min(1, dt * 0.8)); A.g.position.x -= Math.sin(h) * 0.62 * dt; A.g.position.z -= Math.cos(h) * 0.62 * dt; }
      shuffle(A, t, 1, 0.4);
      const v = 0.85, ts = 1.8, td = 1.2, tt = Math.min(t, ts + td);
      const s = tt < ts ? v * tt : v * ts + v * (tt - ts) - v * (tt - ts) * (tt - ts) / (2 * td);
      B.g.position.x = 4.2 - s;
      const walking = t < ts ? 1 : Math.max(0, 1 - (t - ts) / td);
      shuffle(B, t, walking, 2.1);
      const bx = B.g.position.x, bz = B.g.position.z, cp = W.camera.position;
      if (t > 2.5 && t < 4.85) B.g.rotation.y = turnTo(B.g.rotation.y, Math.atan2(bx, -(PZ - bz)), Math.min(1, dt * 3));
      if (t >= 4.85) B.g.rotation.y = turnTo(B.g.rotation.y, Math.atan2(-(cp.x - bx), -(cp.z - bz)) - 0.4, Math.min(1, dt * 4.2));   // three quarters to us: his eyes on the lens, the cheese on his back off to the side
      const lean = W.smooth(W.clamp((t - 2.95) / 0.7, 0, 1)) * (1 - W.smooth(W.clamp((t - 4.75) / 0.6, 0, 1)));
      const nod = Math.max(0, Math.sin(Math.PI * W.clamp((t - 5.6) / 0.8, 0, 1)));   // the verdict comes with a slow nod
      B.zb.rotation.x = -0.34 * lean - 0.12 * sniffK(t) + 0.05 * W.smooth(W.clamp((t - 5.0) / 0.6, 0, 1)) - 0.12 * nod;
      for (const a of st.round) shuffle(a, t * 0.5, 0.25, a.g.position.x);

      // the mist
      const eye = st.eye.copy(cp), pale = st.pale, mist = st.mist, ma = 0.5;
      st.halo.position.set(-cp.x, 1.2 - cp.y, PZ - cp.z).normalize().multiplyScalar(4.8).add(st.v.set(0, 1.2, PZ));   // kept centred behind the pile
      const tint = (c, h) => c.copy(pale).lerp(mist, Math.min(1, h * 1.5));
      [[0, 1.7, 0.16, 2.0, ma], [2.3, 1.3, 0.1, 1.3, ma * 0.7]].forEach(([j, ln, w0, w1, a0], i) => lay(st.wisps[i],
        (o, h) => mistAt(o, h, t, j, ln), h => w0 + w1 * h, tint, h => a0 * W.smooth(W.clamp(h / 0.07, 0, 1)) * Math.pow(1 - h, 1.25), -0.22 * t + i * 0.37, 2.2, eye));
      // a sniff draws a thread off the top of the pile and up his nose; while it runs, the puffs at the foot of the wisp thin
      st.head.getWorldPosition(st.nose);
      const pull = Math.max(sniffK(t - 0.06), sniffK(t + 0.1));
      st.thread.visible = pull > 0.01;
      if (st.thread.visible) lay(st.thread, (o, s2) => streamAt(o, s2, st.nose), s2 => 0.32 - 0.26 * s2, (c, s2) => c.copy(pale).lerp(mist, 0.2 * s2),
        s2 => pull * 0.75 * W.smooth(W.clamp(s2 / 0.1, 0, 1)) * W.smooth(W.clamp((1 - s2) / 0.12, 0, 1)), -1.9 * t, 1.1, eye);
      for (let i = 0; i < NP; i++) {
        const p = st.puffs[i], h = (t / 9 + p.off) % 1, a = mistAt(st.v, h, t, p.j, 1.7);
        p.s.position.copy(a); const sc = 0.9 + 3.2 * h; p.s.scale.set(sc, sc * 0.9, 1);
        p.m.opacity = 0.22 * W.smooth(W.clamp(h / 0.1, 0, 1)) * Math.pow(1 - h, 1.4) * (1 - 0.6 * pull * (h < 0.2 ? 1 : 0));
        tint(p.m.color, h); p.m.rotation = p.rot + t * p.spin;
      }
      camAt(W, t);
    },
    dispose() {
      for (const o of hidden) o.visible = true;
      for (const x of own) x.dispose();
      own = []; hidden = []; st = null;
    },
  };
})();