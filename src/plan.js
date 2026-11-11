// The planner: what goes on the road ahead. Filler between forks (obstacles, the dead, wisps), and each fork placed so its
// signs stay legible for its whole reading budget at the tier's speed (planFork, planSentence, placeFork). The pure rules it
// uses are in forks.js (the level queue), reading.js (budget, legibility) and tasks.js (the task label). A missed item that
// comes back (src/review.js, put in the queue by src/flow.js) rides on review road: a quiet stretch, half fare.
import { taskOf } from './tasks.js?v=43';
import { legDist, READ_AHEAD, readBudget, wordsIn } from './reading.js?v=43';
import { clamp, FARES, LOOK, pick, rnd, ROAD_W, THREE } from './engine.js?v=43';
import { camera, scene } from './render.js?v=43';
import { mistTex } from './road.js?v=43';
import { PG } from './props.js?v=43';
import { PROPS } from './houses.js?v=43';
import { footprint, scenery } from './scenery.js?v=43';
import { bigSign, G, signFit, signpost } from './signs.js?v=43';
import { ghostFigure } from './cast.js?v=43';
import { cart, fence, HINT_HALO_MAT, puddle, roadArrow, TEACH_HALO_MAT, wisp, zombie, zombieBike } from './zombies.js?v=43';
import { BASE, L, LANE_X, S } from './state.js?v=43';

// itemToEntry and levelQueue (level items to the entries the planner rides) are in src/forks.js

// ---------- planning ----------
function nextEntry() {
  if (!S.sentencePool.length) S.sentencePool = SENTENCES.slice().sort(() => Math.random() - 0.5);
  return S.sentencePool.pop();
}
function add(obj, d, lane, type, extra = {}) {
  const bx = lane == null ? (extra.bx != null ? extra.bx : obj.position.x) : LANE_X[lane];
  obj.position.x = bx;
  scene.add(obj);
  const o = Object.assign({ mesh: obj, d, lane, type, hit: false, bx }, extra);
  S.objs.push(o); return o;
}
function planFiller(len, quiet) {
  const start = S.planCursor, end = start + len;
  if (quiet) { S.planCursor = end; return; }   // review road: nothing to dodge and nothing to collect, the lamp holds there
  let d = start + 10;
  while (d < end - 8) {
    const gap = 11 + S.speed * 0.5;
    const obRate = !L ? 0.72 : L.obstacles === 'none' ? 0 : L.obstacles === 'puddles' ? 0.35 : L.obstacles === 'light' ? 0.5 : 0.72;
    if (S.wispEasy && d < 200) {   // tier 1, the first 200 m: the first wisps are unmissable, in the lane he starts in
      for (let i = 0; i < 5; i++) add(wisp(), d + i * 2.2, LANE_X.length === 2 ? 0 : 1, 'wisp');
    } else if (Math.random() < obRate) {
      const lane = Math.floor(Math.random() * LANE_X.length);
      const kind = Math.random(); const ob = L ? L.obstacles : 'normal';
      if (ob === 'puddles') { if (kind < 0.55) add(puddle(), d, lane, 'puddle'); else add(zombie(), d, lane, 'obstacle', { zombie: true }); }
      else if (kind < 0.35) add(fence(), d, lane, 'obstacle');
      else if (kind < 0.5) add(zombie(), d, lane, 'obstacle', { zombie: true });
      else if (kind < 0.6) add(zombieBike(), d + 20, lane, 'obstacle', { zombie: true, drift: -2.5 });
      else if (kind < 0.75) add(cart(), d, lane, 'obstacle');
      else add(puddle(), d, lane, 'puddle');
      S.lastObstacleD = d;
      // wisps in a free lane, just after
      if (Math.random() < 0.7) {
        const free = [...Array(LANE_X.length).keys()].filter(l => l !== lane); const wl = pick(free);
        for (let i = 0; i < 4; i++) add(wisp(), d + 4 + i * 2.2, wl, 'wisp');
      }
    } else {
      const wl = Math.floor(Math.random() * LANE_X.length);
      for (let i = 0; i < 5; i++) add(wisp(), d + i * 2.2, wl, 'wisp');
    }
    d += gap;
  }
  S.planCursor = end;
}
const _rv = new THREE.Vector3();
function signFrac(p) {
  const m = p.mesh, b = m.userData.board, y = m.position.y + b.position.y * m.scale.y, em = (b.material.map.userData.fontPx || 60) / 250 * 1.02 * m.scale.y;
  _rv.set(m.position.x, y, m.position.z).project(camera); if (_rv.z > 1 || Math.abs(_rv.x) > 1 || Math.abs(_rv.y) > 1) return 0;
  const y0 = _rv.y; _rv.set(m.position.x, y + em, m.position.z).project(camera); return (_rv.y - y0) / 2;
}
// ---------- reading time: every fork's signs stay legible for its budget, at any tier's speed ----------
// READ_THR, READ_AHEAD, HOLD_AT, wordsIn, readBudget and legDist are in src/reading.js
// TASKS and taskOf (the fork's task label) are in src/tasks.js
// the fork's reading plan, before it is placed: the options it shows, its budget, where it reads, where it slows, where the card comes up
function planFork(fork) {
  if (fork.plan) return fork.plan;
  const NL = LANE_X.length;
  if (fork.o.length > NL) { // keep the answer, drop extra distractors
    const keep = [fork.a]; const rest = fork.o.map((t, i) => i).filter(i => i !== fork.a).sort(() => Math.random() - 0.5);
    while (keep.length < NL) keep.push(rest.pop());
    const o = keep.map(i => fork.o[i]); fork.a = 0; fork.o = o;
  }
  fork.taskId = taskOf(fork);
  if (L && !S.tasksSeen.has(fork.taskId)) { S.tasksSeen.add(fork.taskId); fork.firstTask = true; }   // planned in ride order: the first of its kind this level
  const scale = S.fareTier === 1 && L ? 1.3 : 1;
  const fits = fork.o.map(signFit);
  const em = Math.min(...fits.map(f => f.px)) / 250 * 1.02 * scale;
  const budget = fork.budget = readBudget(fork), legD = legDist(em);
  const vc = Math.max(S.speed, BASE) * 0.85, vPlan = Math.max(0.3, (legD - READ_AHEAD) / budget);
  const teach = S.teachPlan > 0, minSlow = teach || fork.firstTask ? 30 : S.fareTier === 1 && L ? 22 : 13;
  const slowD = Math.max(minSlow, legD + Math.max(0, vc - vPlan) / 3 + 2);   // S.slow eases at rate 3: about (vc - vPlan) / 3 m to settle
  const lead = fork.idx === 0 && !fork.read ? clamp(0.15 * wordsIn([fork.entry.en || '']) + 0.6, 1.2, 2.5) : 1.2;   // the card first: the English, then the signs
  return (fork.plan = { fits, scale, budget, legD, slowD, armD: Math.max(38, slowD + vc * lead), vc });
}
function planSentence(entry) {
  const forkGap = 48;
  S.lastWords = wordsIn([entry.nl || '']);   // the filler after it scales with this
  if (entry.read) {
    const d0 = S.planCursor + 14;
    add(bigSign(entry.nl), d0, null, 'readsign', { nl: entry.nl }).mesh.position.x = 0;
    const fork = { entry, idx: 0, o: entry.o, a: entry.a, r: entry.r, w: entry.w, read: true, fare: (entry.again ? FARES.halfFare(FARES.FLAT.read || 0) : FARES.FLAT.read || 0) * S.fareK };
    const dF = d0 + Math.max(34, planFork(fork).slowD + 6);
    placeFork(fork, dF);
    S.planCursor = dF + 10;
    return;
  }
  // fareFor gives passengers their tier fare, look entries FLAT.look and de/het entries FLAT.dehet
  const st = { entry, chosen: [], forks: entry.parts.filter(p => typeof p !== 'string'), wrong: 0, fare: FARES.fareFor(entry, S.fareTier) || 0, lostAt: -1 };
  if (entry.again) st.fare = FARES.halfFare(st.fare);   // a returned item pays half
  st.fare *= S.fareK;   // a trophy ride pays double
  if (entry.look) { // the thing stands beside the road, the signs come right after it
    const d0 = S.planCursor + 16; const pr = PROPS[entry.prop] || PROPS.boom; const side = entry.side === 'links' ? -1 : 1;
    const mesh = pr.make(entry.value); if (pr.scale) mesh.scale.setScalar(pr.scale); if (mesh.userData.faceRoad) mesh.rotation.y = side < 0 ? Math.PI : 0; if (entry.prop === 'water' && side > 0) mesh.rotation.y = Math.PI;
    // a marker floats over it and a soft light sits on it, so you know what is being asked
    const box = new THREE.Box3().setFromObject(mesh); const tall = box.max.y > 5.5; const top = tall ? 3.4 : box.max.y + 0.9;
    const mk = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.1, 4), new THREE.MeshBasicMaterial({ color: 0xe8e4d8 })); mk.rotation.x = Math.PI; mk.scale.setScalar(1 / (pr.scale || 1));
    const sc = pr.scale || 1; mk.position.set(0, top / sc, 0); if (tall) { const toRoad = -(pr.off + 1.2); mk.position.set((mesh.userData.faceRoad ? -1 : -side) * 0 + (side < 0 ? toRoad : -toRoad) * 0, top / sc, 0); mk.userData.world = { dx: -side * (pr.off + 1.4) }; }
    mesh.add(mk); mesh.userData.marker = mk;
    const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistTex, transparent: true, depthWrite: false, opacity: 0.3, color: 0xdfe6ea })); gl.scale.set(4.5, 3.5, 1); gl.position.y = Math.min(top * 0.5, 3); mesh.add(gl);
    add(mesh, d0 + 12, null, 'lookprop', { bx: side * (ROAD_W / 2 + pr.off), entry });   // beside you when you reach the signs
    const zNow = S.dist - (d0 + 12); for (const q of scenery) { if ((Math.sign(q.bx) || 1) === side && Math.abs(q.z - zNow) < footprint(q.sp) + 4 && footprint(q.sp) >= 1) q.mesh.visible = false; }
    placeFork({ entry, st, idx: 0, o: st.forks[0].o, a: st.forks[0].a, r: 'woord', w: st.forks[0].w, read: false }, d0 + 14);   // its gate arms from its own armD during the filler
    S.planCursor = d0 + 14 + 10; return;
  }
  const d0 = S.planCursor + 12;
  const forks = st.forks.map((f, i) => ({ entry, st, idx: i, o: f.o, a: f.a, r: f.r, w: f.w, task: f.task, read: false, fixed: !!f.fixed }));
  forks.forEach(planFork); st.fork0 = forks[0];
  // the passenger stands before the slow zone; each later gate far enough on to slow for its own signs
  const g = ghostFigure(); add(g, d0, null, 'passenger', { st, bx: ROAD_W / 2 + 1.0 });
  let d = d0 + Math.max(L ? 38 : 54, forks[0].plan.slowD + 10);   // the card may come up before the pickup (armD reaches back into the filler)
  forks.forEach((fork, i) => {
    placeFork(fork, d);
    if (i < forks.length - 1) d += Math.max(forkGap, forks[i + 1].plan.slowD + 8);
  });
  S.planCursor = d + 12;
}
function placeFork(fork, d) {
  const NL = LANE_X.length, P = planFork(fork);
  const n = fork.o.length;
  const hold = S.teachPlan === 3;   // the very first gate of a first ride waits for the player
  const teach = S.teachPlan > 0; if (teach) S.teachPlan--;
  const allLanes = [...Array(NL).keys()];
  const lanes = fork.fixed ? allLanes.slice(0, n) : allLanes.slice().sort(() => Math.random() - 0.5).slice(0, n);
  const order = fork.fixed ? fork.o.map((t, i) => i) : fork.o.map((t, i) => i).sort(() => Math.random() - 0.5);
  const posts = [];
  lanes.forEach((lane, k) => {
    const oi = order[k];
    const sp = signpost(fork.o[oi], P.fits[oi]);
    if (L && L.hint === 'glow') sp.userData.board.material.emissiveIntensity = oi === fork.a ? 0.75 : 0.12;
    if (S.fareTier === 1 && L) sp.scale.setScalar(1.3);   // tier 1: bigger boards, readable from further off
    // the right sign glows: a warm glow card just in front of its board, so the light lies over the board itself
    if (oi === fork.a && (teach || (L && L.hint === 'glow'))) { const h = new THREE.Sprite(teach ? TEACH_HALO_MAT : HINT_HALO_MAT); h.scale.set(4.6, 2.6, 1); h.position.set(0, sp.userData.board.position.y, 0.3); sp.add(h); }
    posts.push(add(sp, d, lane, 'sign', { fork, oi }));
    if (teach) for (const k of [5, 15]) add(roadArrow(), d - k, lane, 'decal');   // arrows on the road into each option's lane
  });
  for (const lane of allLanes) if (!lanes.includes(lane)) add(fence(), d, lane, 'obstacle', { forkFence: true, fork });
  const gate = { fork, d, posts, armed: false, resolved: false, teach, hold, budget: P.budget, legD: P.legD, slowD: P.slowD, armD: P.armD, legT: 0, legOn: false, laneN0: 0, inT: 0 };
  S.objs.push({ mesh: null, d, lane: null, type: 'gate', gate });
}
function plan() {
  while (S.planCursor < S.dist + LOOK) {
    if (!L) { planFiller(rnd(55, 85)); planSentence(nextEntry()); continue; }
    if (S.queue.length) {   // 0.1 s a word over four at the level's speed: long sentences never back to back
      const len = rnd(L.filler[0], L.filler[1]) + Math.max(0, (S.lastWords || 0) - 4) * 0.1 * BASE, e = S.queue.shift(), from = S.planCursor;
      planFiller(len, !!e.again); planSentence(e); S.plannedN++;
      if (e.again) S.reviewRoad.push([from, S.planCursor]);   // the road a return adds: the lamp does not drain on it (src/loop.js)
      continue;
    }
    if (!S.finishPlanned) { S.finishPlanned = true; planFiller(30); const d = S.planCursor + 10; add(bigSign('THUIS'), d, null, 'finish', {}).mesh.position.x = 0; S.planCursor = d + 60; }
    else S.planCursor += 60;
  }
}

// a missed item went back in the queue after the finish was planned: take the finish sign away and plan on from where its
// run-in began, so the return rides before THUIS
function unplanFinish() {
  const i = S.objs.findIndex(o => o.type === 'finish' && !o.hit); if (i < 0) return false;
  const o = S.objs[i]; S.objs.splice(i, 1); scene.remove(o.mesh);
  o.mesh.traverse(m => { if (m.material && m.material.map && !m.material.userData.shared) { m.material.map.dispose(); m.material.dispose(); } if (m.geometry && !Object.values(G).includes(m.geometry) && !Object.values(PG).includes(m.geometry)) m.geometry.dispose(); });
  S.finishPlanned = false; S.planCursor = o.d - 10;
  return true;
}

export { add, plan, signFrac, unplanFinish };
