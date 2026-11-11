// The loop: update(dt), one step of the world (the ride, the bend, the lamp and the night, forks and their reading time, the
// dead, the camera, the HUD), the animation loop that lowers the resolution on a slow GPU, the warm-up that compiles every
// material first, and the boot: ?map, ?cine, ?shot and ?level, then the title.
import { HOLD_AT, READ_AHEAD, READ_THR } from './reading.js?v=40';
import { lampLoss, lampReadK, TUNE } from './lamp.js?v=40';
import { VOICES } from './voice.js?v=40';
import { $, clamp, FARES, lerp, NODES, rnd, ROAD_W, smooth, THREE } from './engine.js?v=40';
import { MSAA, setMSAA } from './render-nodes.js?v=40';
import { camera, clueLight, composer, DPR, gradePass, hemiLight, lampLight, nodePost, postSize, render, renderer, scene, setDPR } from './render.js?v=40';
import { aurora, skyDome } from './sky.js?v=40';
import { bend, hillAt, hills, keepBehind, KERB_W, kerbL, kerbR, landL, landR, RIB_STEP, rise, roadRib, setHillPhase, updateRibbon, verge, vergeL,
  vergeR, waterRib } from './road.js?v=40';
import { LAMP_CONE_MAT, LAMP_HALO_MAT, LAMP_POOL_MAT, LAMP_STREAK_MAT, PG, WIN_GLOW_MAT } from './props.js?v=40';
import { skyBands, tintFar } from './backdrop.js?v=40';
import { scenery, sceneryPlace, theme, wieven } from './scenery.js?v=40';
import { modelsReady } from './models.js?v=40';
import { beam, bike, drawFace, faceState, follower, mountPassenger, rackGhost, riderTick, setFace, setFaceState } from './rider.js?v=40';
import { bigSign, G, signpost } from './signs.js?v=40';
import { ghostFigure } from './cast.js?v=40';
import { cart, fence, puddle, roadArrow, TEACH_HALO_MAT, wisp } from './zombies.js?v=40';
import { BASE, L, LANE_X, MAXS, nightDepth, S } from './state.js?v=40';
import { plan, signFrac } from './plan.js?v=40';
import { card, fareRow, flash, forkCard, say, setToastT, showCard, toast, toastT } from './hud.js?v=40';
import { bark, chime, thump, tick } from './audio.js?v=40';
import { speak } from './speech.js?v=40';
import { goKnown, TOUCH } from './input.js?v=40';
import { setIntroSeen, showIntro, startArt } from './intro.js?v=40';
import { cineBegin, cineTick, setCineFrozen } from './cine.js?v=40';
import { openMap, openTown, towns } from './map.js?v=40';
import { die, lampHinted, levelDone, resolveFork, setLampHinted, showSummary, start } from './flow.js?v=40';
import { payTikkie } from './wallet.js?v=40';
import './debug.js?v=40';   // keeps the order the game's code runs in

let frameAcc = 0, frameN = 0, rideFrames = 0;

// ---------- warm-up: compile every material variant once so nothing stalls mid-ride ----------
function warmUp() {
  const tmp = [signpost('warm'), bigSign('warm'), ghostFigure(), fence(), cart(), puddle(), wisp(), roadArrow(), new THREE.Sprite(TEACH_HALO_MAT)];
  tmp.forEach(o => { o.position.set(0, -50, -5); scene.add(o); });
  follower.visible = true;
  if (!NODES) renderer.compile(scene, camera);
  renderer.render(scene, camera);
  follower.visible = false;
  tmp.forEach(o => { scene.remove(o); o.traverse(m => { if (m.material && m.material.map && !m.material.userData.shared) { m.material.map.dispose(); m.material.dispose(); } }); });
}


// ---------- update ----------
const clock = { last: performance.now(), getDelta() { const n = performance.now(), d = (n - this.last) / 1000; this.last = n; return d; } };   // THREE.Clock is deprecated since r183
function update(dt) {
  S.t += dt;
  // intro camera
  if (S.mode === 'intro') {
    S.introT += dt; const k = smooth(clamp(S.introT / 3.6, 0, 1));
    camera.position.set(0, lerp(22, 2.85, k), lerp(14, 6.4, k));
    camera.lookAt(0, lerp(0, 1.25, k), lerp(-30, -8, k));
    if (S.introT > 3.6) { S.mode = 'ride'; say(L ? L.mission.where : 'Ride through the right sign.', 'good', null, 2.2); }
  }
  if (S.mode === 'dying') {
    if (S.dieT >= 10) return;
    S.dieT += dt; const k = smooth(clamp(S.dieT / 1.6, 0, 1));
    camera.position.set(lerp(camera.position.x, 0, 0.1), lerp(3.2, 1.6, k), lerp(7, 2, k));
    camera.lookAt(0, lerp(1, 4, k), lerp(-8, 11, k));
    follower.position.z = lerp(11, 5.5, smooth(clamp((S.dieT - 1.2) / 2.0, 0, 1)));
    follower.userData.glow.intensity = k * 2.5;
    scene.fog.density = lerp(scene.fog.density, 0.12, dt * 0.8);
    scene.fog.color.multiplyScalar(1 - dt * 0.9); skyDome.material.color.multiplyScalar(1 - dt * 0.9); tintFar();   // the haze closes in and goes dark
    lampLight.intensity = lerp(lampLight.intensity, 0, dt * 2);
    if (S.dieT > 1.0 && S.dieT - dt <= 1.0) thump(0.9);
    if (S.dieT > 2.2 && S.dieT - dt <= 2.2) thump(1.0);
    if (S.dieT > 3.4) showSummary();
    return;
  }
  const riding = S.mode === 'ride', cine = S.mode === 'cine';   // cine: an intro shot, the world moves at the shot's pace and nothing is played
  if (cine) S.dist += (S.cineSpeed || 0) * dt;
  // hill towns: the grade under the bike, from the ground profile (it tilts the bike and slows him uphill)
  S.grade = hills ? (hillAt(S.dist + 1.5) - hillAt(S.dist - 1.5)) / 3 : 0;
  const hillK = hills ? clamp(1 - S.grade * 1.6, 0.8, 1.15) : 1;   // slower uphill, a little faster down
  if (riding) {
    S.slow = lerp(S.slow, S.slowTarget, dt * 3);
    if (!L || L.ramp) S.speed = clamp(S.speed + dt * 0.08, BASE, MAXS);      // slow ramp with time
    const v = S.speed * S.slow * (S.stumble > 0 ? 0.6 : 1) * hillK;
    S.dist += v * dt;
    // reading costs little lamp: while a fork is armed the drain scales with the speed against cruise (0.85), so slowing to read is cheap; nothing while the first gate holds
    const readK = lampReadK(S.held, S.activeFork && L, S.slow);
    S.lamp -= lampLoss(dt, readK, L, S.speed, nightDepth());
    S.lampMin = Math.min(S.lampMin, S.lamp);
    S.stumble = Math.max(0, S.stumble - dt * 1.5);
    if (S.lamp <= 0) { S.lamp = 0; die(); return; }
    if (!lampHinted && L && S.lamp < 50 && toastT <= 0) { setLampHinted(true); try { localStorage.setItem('nachtrit.lamphint', '1'); } catch (e) {} say('The lamp is going.', 'bad', 'Ride through the lights to fill it.', 3.6); }
    plan();
  }
  S.speedNorm = MAXS > BASE ? (S.speed - BASE) / (MAXS - BASE) : 0;

  // lane movement + lean
  const tx = LANE_X[S.lane]; const dx = tx - S.x;
  S.x += dx * Math.min(1, dt * 9);
  S.lean = lerp(S.lean, clamp(dx * 0.6, -1, 1), dt * 8);
  bike.position.x = S.x; bike.rotation.z = -S.lean * 0.4; bike.rotation.y = -S.lean * 0.15; bike.rotation.x = Math.atan(S.grade) * 0.85;
  bike.position.y = (S.stumble > 0 ? Math.sin(S.t * 40) * 0.05 * S.stumble : 0) + Math.sin(S.t * 6) * 0.01;
  if (rackGhost) rackGhost.position.y = 0.5 + Math.sin(S.t * 3) * 0.04;
  riderTick(S.speed * S.slow * hillK * dt * 1.4, dt);
  if (faceState.name && S.t > faceState.until) { setFaceState({ name: '', until: 0, look: 0 }); drawFace('deadpan'); }
  if (!faceState.name && riding && S.t > (S.nextGlance || 0)) { S.nextGlance = S.t + rnd(6, 11); setFace('deadpan', 1.4); }
  const headTarget = faceState.look ? Math.PI * 0.9 : (S.activeFork ? S.lean * 0.3 : Math.sin(S.t * 0.7) * 0.15);
  bike.userData.head.rotation.y = lerp(bike.userData.head.rotation.y, headTarget, dt * 6);
  lampLight.position.x = S.x; lampLight.target.position.x = S.x + S.lean * 1.5 + bend(-20) * 0.8; lampLight.target.position.y = 0.2 + (hills ? rise(-20) : 0);

  // lamp look
  const Lf = S.lamp / 100;
  lampLight.intensity = cine && !bike.visible ? 0 : 0.8 + Lf * 4.0;   // a shot without the rider has no bike lamp either
  const nd = nightDepth(), nightK = lerp(1, theme.night || 0.17, nd);
  hemiLight.intensity = 0.6 - 0.4 * nd;
  scene.fog.color.copy(theme.fogC).multiplyScalar(nightK); skyDome.material.color.setScalar(nightK);   // the haze and the sky dim together as the night deepens
  const town = 1 - 0.45 * nd; tintFar(town); LAMP_POOL_MAT.opacity = town; LAMP_STREAK_MAT.opacity = town; LAMP_CONE_MAT.opacity = 0.42 * town; LAMP_HALO_MAT.opacity = 0.85 * town; WIN_GLOW_MAT.opacity = 0.55 * town;   // the town's lights burn lower too; the wisps do not
  bike.userData.lampMesh.material.color.setHSL(0.1, 0.85, 0.3 + Lf * 0.55); bike.userData.lampGlow.material.opacity = 0.2 + Lf * 0.6;   // the headlamp burns as warm as the lamp is full
  beam.material.opacity = 0.02 + Lf * 0.04;
  scene.fog.density = (theme.fogD * (1.28 - 0.4 * Lf) + S.forkZoom * 0.002 + 0.004 * nd) * (cine ? (S.fogMul || 1) : 1);   // a weak lamp thickens the haze; about 70 percent fogged at 70 m; a shot can thicken it
  const lw = Math.round(S.lamp); if (lw !== S.lampLast) { S.lampLast = lw; $('lampfill').style.width = lw + '%'; }
  const danger = 1 - Lf;
  const vo = Math.round(Math.pow(danger, 1.6) * 95) / 100; if (vo !== S.vigLast) { S.vigLast = vo; $('vignette').style.opacity = composer ? 0 : vo; }
  if (gradePass) gradePass.uniforms.danger.value = Math.pow(danger, 1.6);
  if (riding) {
    S.heartT += dt; const period = 1.25 - danger * 0.85;
    if (danger > 0.3 && S.heartT > period) { S.heartT = 0; thump(0.15 + danger * 0.5); setTimeout(() => thump(0.1 + danger * 0.3), 130); }
  }

  // the bend drifts slowly
  if (riding) { if (S.dist > S.curvNextAt) { S.curvNextAt = S.dist + rnd(70, 130); S.curvTarget = (Math.random() < 0.3 ? 0 : rnd(-1, 1)) * theme.curv; } S.curv = lerp(S.curv, S.curvTarget, dt * 0.6); }
  // road + canal ribbons
  const scroll = S.dist % RIB_STEP;
  updateRibbon(roadRib, 0, 0, scroll, 6);
  updateRibbon(kerbL, -ROAD_W / 2 - 0.25, 0.08, scroll, 4); updateRibbon(kerbR, ROAD_W / 2 + 0.25, 0.08, scroll, 4);
  const vx = ROAD_W / 2 + KERB_W + verge.w / 2; updateRibbon(vergeL, -vx, verge.y, scroll, 3.2); updateRibbon(vergeR, vx, verge.y, scroll, 3.2);
  waterRib.visible = !!theme.canal;
  if (theme.canal) updateRibbon(waterRib, theme.canal * (ROAD_W / 2 + 1.2 + 13), theme.waterY != null ? theme.waterY : -0.6, scroll, 6, true);
  if (hills) { const lx = ROAD_W / 2 + KERB_W + verge.w + 30; updateRibbon(landL, -lx, (theme.groundY || 0) - 0.02, scroll, 8); updateRibbon(landR, lx, (theme.groundY || 0) - 0.02, scroll, 8); }
  // scenery
  const adv = riding ? S.speed * S.slow * hillK * dt : cine ? (S.cineSpeed || 0) * dt : 0;
  for (const o of scenery) {
    o.z += adv;
    if (o.mesh.userData.blades) o.mesh.userData.blades.rotation.z += o.mesh.userData.spin * dt;
    if (o.mesh.userData.shuffle) { o.z += o.mesh.userData.shuffle * dt * (riding || cine ? 1 : 0); o.mesh.rotation.z = Math.sin(S.t * 2 + o.i) * 0.06; o.mesh.rotation.y = Math.PI; }
    if (o.z > keepBehind) { o.z -= o.span; sceneryPlace(o); }
    o.mesh.position.z = o.z; o.mesh.position.x = o.bx + bend(o.z);
    if (hills) o.mesh.position.y = (o.sp.y || 0) + rise(o.z);
    if (o.mesh.userData.bill) o.mesh.rotation.y = Math.atan2(camera.position.x - o.mesh.position.x, camera.position.z - o.z);   // tree cards turn to the eye
  }
  for (const w of wieven) {
    const B = w.userData.band;
    w.position.z += adv * 0.9; w.userData.bx += Math.sin(S.t * w.userData.drift + w.position.z * 0.05) * dt * 0.5;
    if (w.position.z > B.z0) { w.position.z -= B.len; w.userData.bx = B.side ? (Math.random() < 0.5 ? -1 : 1) * rnd(B.side, 16) : rnd(-18, 18); }
    w.position.x = w.userData.bx + bend(w.position.z);
    if (hills) w.position.y = w.scale.y * 0.12 + rise(w.position.z);
  }
  // the far town turns a little with the bend of the road, and stays round the eye
  const farYaw = -Math.atan(bend(-120) / 120) * 0.7;
  for (const B of skyBands) { B.a.position.set(camera.position.x, 0, camera.position.z); B.b.position.copy(B.a.position); B.a.rotation.y = B.b.rotation.y = farYaw; }
  if (aurora.visible) { aurora.position.set(camera.position.x, 0, camera.position.z); aurora.material.map.offset.x = S.t * 0.0035; aurora.material.opacity = aurora.userData.k * (0.6 + 0.4 * Math.sin(S.t * 0.31) * Math.sin(S.t * 0.13 + 1.3)); }   // the curtains drift and breathe

  // objects
  let nearestGate = null;
  for (const o of S.objs) {
    const z = S.dist - o.d;
    if (o.mesh) {
      o.mesh.position.z = z; o.mesh.position.x = o.bx + bend(z);
      if (o.type === 'wisp' && !o.hit) { o.mesh.position.y = 1.0 + Math.sin(S.t * 3 + o.d) * 0.15; const u = o.mesh.userData; if (u.refl) { u.refl.position.y = 0.04 - o.mesh.position.y; const p = 1.85 + Math.sin(S.t * 5 + o.d * 1.7) * 0.22; u.halo.scale.set(p, p, 1); } }
      if (o.type === 'passenger') { o.mesh.position.y = 0.15 + Math.sin(S.t * 1.5 + o.d) * 0.08; o.mesh.rotation.y = Math.atan2(S.x - o.mesh.position.x, -z) + Math.PI; }
      if (o.zombie && !o.hit) o.mesh.rotation.z = Math.sin(S.t * (o.mesh.userData.lean || 1)) * 0.08;
      if (o.drift && !o.hit && riding) o.d += o.drift * dt;
      if (o.type === 'dropped') { const age = S.t - o.born; o.mesh.position.x = o.bx + bend(z) + Math.sign(o.bx) * age * 0.9; o.mesh.rotation.y = o.bx < 0 ? -Math.PI / 2 : Math.PI / 2; o.mesh.traverse(m => { if (m.material && m.material.transparent) m.material.opacity = Math.max(0, 0.6 - age * 0.2); }); }
      if (o.type === 'lookprop' && o.mesh.userData.marker) { const mk = o.mesh.userData.marker; mk.rotation.y += dt * 2; mk.position.y += Math.sin(S.t * 4) * dt * 0.6; if (mk.userData.world) { const inv = 1 / (o.mesh.scale.x || 1); const local = new THREE.Vector3(mk.userData.world.dx, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), -o.mesh.rotation.y); mk.position.x = local.x * inv; mk.position.z = local.z * inv; } }
      if (hills) { if ((o.type === 'wisp' && !o.hit) || o.type === 'passenger') o.mesh.position.y += rise(z); else { if (o.y0 == null) o.y0 = o.mesh.position.y; o.mesh.position.y = o.y0 + rise(z); } }
    }
    if (o.type === 'gate' && !o.gate.resolved) {
      if (z >= 0.5) { if (riding) { if (!o.gate.armed) { o.gate.armed = true; S.activeFork = o.gate; } resolveFork(o.gate); } }
      else if (!nearestGate || o.d < nearestGate.d) nearestGate = o;
    }
    if (!riding) continue;
    // collisions at the bike
    const pz = o.pz === undefined ? z : o.pz; o.pz = z;
    if (!o.hit && z > -0.9 && pz < 0.9 && o.lane === S.lane) {
      if (o.type === 'wisp') { o.hit = true; o.mesh.visible = false; S.lamp = clamp(S.lamp + TUNE.wisp, 0, 100); S.speed = clamp(S.speed + 0.15, BASE, MAXS); chime(true); }
      else if (o.type === 'puddle') { o.hit = true; S.speed = clamp(S.speed - 2, BASE, MAXS); S.stumble = 0.6; }
      else if (o.type === 'obstacle') {
        o.hit = true; S.stumble = 1; flash('#000', 0.6); thump(0.8);
        if (o.zombie) { S.lamp = clamp(S.lamp - 8, 0, 100); S.speed = BASE; say('€4,50', 'bad', 'Tikkie.', 1.4); setFace('ouch', 1.5); o.mesh.rotation.z = 1.2; payTikkie(); }
        else if (!o.forkFence) { S.lamp = clamp(S.lamp - 10, 0, 100); S.speed = BASE; say('Au.', 'bad', null, 1); setFace('ouch', 1.5); }
      }
    }
    if (o.type === 'passenger' && !o.hit && z > -2) {
      o.hit = true; o.mesh.visible = false; mountPassenger(o.mesh.userData.variant, o.mesh.userData.coat); S.riding = o.st; S.slowTarget = 0.6; setTimeout(() => { if (S.activeFork == null) S.slowTarget = 1; }, 1800);
      const fr = fareRow(o.st.fare, o.st.wrong, o.st.forks.length);
      if (!o.st.carded) forkCard(o.st.fork0, fr); o.st.carded = true; thump(0.5);
    }
    if (o.type === 'finish' && !o.hit && z > 0) { o.hit = true; levelDone(); return; }
  }
  // the clue light sits on the thing you are being asked about
  let clue = null; for (const o of S.objs) if (o.type === 'lookprop') { const z = S.dist - o.d; if (z > -40 && z < 4 && (!clue || o.d < clue.d)) clue = o; }
  if (clue) { const z = S.dist - clue.d; clueLight.intensity = lerp(clueLight.intensity, 1.4, dt * 4); clueLight.position.set(clue.mesh.position.x * 0.5, 9, z + 3); clueLight.target.position.set(clue.mesh.position.x, 1, z); }
  else clueLight.intensity = lerp(clueLight.intensity, 0, dt * 4);
  // fork approach
  if (riding && nearestGate) {
    const g = nearestGate.gate; const z = S.dist - g.d;   // negative while ahead
    if (!g.armed && z > -g.armD) {   // the card and the voice come up here, before the signs read: the English first
      g.armed = true; S.activeFork = g; g.laneN0 = S.laneN; setFace('worry', 2.0, false);
      const f = g.fork;
      const fr = f.read ? fareRow(f.fare, 0, 1) : fareRow(f.st.fare, f.st.wrong, f.st.forks.length);
      if (f.st && f.idx === 0 && f.st.carded) {}   // the passenger's pickup showed this card already
      else if (f.read) { showCard('What does it say?', f.entry.nl, 'Ride through the right meaning.', fr, f); speak(f.entry.nl, false, VOICES.passenger); }
      else if (f.entry.look) showCard('Look', f.entry.side === 'links' ? '← What is that, on your left?' : 'What is that, on your right? →', 'The thing under the marker.', fr, f);
      else forkCard(f, fr);
      if (f.st && f.idx === 0) f.st.carded = true;
      // the go hint, until he has used ↑ once: never on the teaching forks, at most six times a ride
      if (!g.teach && !goKnown() && S.goHints < 6) { S.goHints++; card.querySelector('.gohint').textContent = TOUCH ? 'Swipe up once you have chosen: the bike stops waiting.' : '↑ or W once you have chosen: the bike stops waiting.'; }
      for (const p of g.posts) p.mesh.userData.board.material.emissiveIntensity = (L && L.hint === 'glow') ? (p.oi === g.fork.a ? 1.0 : 0.25) : 0.6;
      const cells = $('lanes').children, NLn = LANE_X.length;
      for (let i = 0; i < 3; i++) {
        const p = g.posts.find(q => q.lane === i); cells[i].style.display = i < NLn ? '' : 'none'; cells[i].textContent = p ? p.fork.o[p.oi] : '✕';
        if (g.teach && i < NLn) { const s = document.createElement('span'); s.className = 'side'; s.textContent = i === 0 ? '◀ left lane' : i === NLn - 1 ? 'right lane ▶' : '▲ middle'; cells[i].prepend(s); }
      }
      if (g.teach && S.taught === 0) say('Ride through the right word.', 'good', 'The lit sign is the answer, this once.', 3.4);
      $('lanes').style.opacity = 1;
    }
    if (g.armed) {
      // legible time so far: the smallest sign's letters on screen at READ_THR or more, READ_AHEAD m or more ahead
      g.legNow = false;
      if (z <= -READ_AHEAD) {
        camera.updateMatrixWorld(); let m = 1; g.legNow = false; for (const p of g.posts) m = Math.min(m, signFrac(p));
        if (m >= READ_THR) { g.legT += dt; g.legNow = true; if (!g.legOn) { g.legOn = true; if (g.teach) { const p = g.posts.find(q => q.oi === g.fork.a); bark(LANE_X.length > 1 ? (p.lane / (LANE_X.length - 1)) * 1.6 - 0.8 : 0); } } }
      }
      // the approach: cruise, then slow from slowD so the signs stay legible for the budget at this speed (forkSlow is the ceiling)
      let k = z > -g.slowD ? (L ? L.forkSlow : 0.55) : (L ? 0.85 : 0.9);
      if (-z <= g.legD + 1) g.inT += dt;   // seconds inside reading range: the wait ends after budget x 1.6 + 2 s even if the letters flicker at the edge of legible
      const need = g.inT > g.budget * 1.6 + 2 ? 0 : g.budget * (g.legD < 6 ? 1.35 : 1.08) + (g.legD < 6 ? 0.5 : 0.25) - g.legT;   // a little over, so the eased speed never comes up short; more where the letters only read close, at the edge of the threshold
      if (z > -g.slowD && need > 0) {
        const room = (g.legT > 0 ? -z : Math.min(-z, g.legD)) - READ_AHEAD - 1;   // stop 1 m short of the last legible point if it must
        const far = g.legT > 0 ? 0 : Math.max(0, -z - g.legD);   // not yet in reading range: close the gap at half of it a second, then read at the planned pace
        k = Math.min(k, room > 0 ? (room / need + far * 0.5) / Math.max(1, S.speed * hillK) : g.legNow ? 0 : g.legT === 0 && -z > READ_AHEAD + 4 ? k : 0.6 / Math.max(1, S.speed * hillK));   // small letters: creep until they read, then wait   // never waits on a sign that does not read
      }
      // the very first gate of a first ride waits, just off the signs, until he steers (a key, a swipe, or NR.lane set by the harness)
      if (g.hold && S.laneN !== g.laneN0) { g.hold = false; if (S.held) { S.held = false; setToastT(Math.min(toastT, 1.2)); } }
      if (g.hold) { k = Math.min(k, Math.max(0, -z - HOLD_AT) / 12); if (!S.held && S.slow < 0.12) { S.held = true; say('Ride through the lit sign.', 'good', 'The bike waits. Steer with ← → or a swipe.', 600); } }
      if (g.go) k = L ? 0.85 : 0.9;   // he pressed go: reading time was the most he could wait, never forced; S.slow eases back up
      S.slowTarget = k;
    }
    if (g.armed) { const cells = $('lanes').children; for (let i = 0; i < 3; i++) cells[i].classList.toggle('here', i === S.lane); }
    S.forkZoom = lerp(S.forkZoom, g.armed ? clamp(1 - (-z) / 46, 0, 1) : 0, dt * 4);
  } else S.forkZoom = lerp(S.forkZoom, 0, dt * 4);

  // cleanup
  for (let i = S.objs.length - 1; i >= 0; i--) {
    const o = S.objs[i]; if (S.dist - o.d > 14) {
      if (o.mesh) { scene.remove(o.mesh); o.mesh.traverse(m => { if (m.material && m.material.map && !m.material.userData.shared) { m.material.map.dispose(); m.material.dispose(); } if (m.geometry && !Object.values(G).includes(m.geometry) && !Object.values(PG).includes(m.geometry)) m.geometry.dispose(); }); }
      S.objs.splice(i, 1); }
  }

  // chase camera: pull back with speed, dolly zoom at forks
  if (riding) {
    const sn = S.speedNorm, fz = S.forkZoom;
    const lk = faceState.look && !S.activeFork ? 1 : 0;   // reaction shot: dolly in while he looks back (not while a fork's signs are up: it put him over the middle sign)
    const sf = sn * (1 - fz);   // at a fork the bike crawls: the pull-back for speed fades with the fork zoom, so the signs read (legDist assumes this camera)
    const ty = 2.85 + sn * 0.8 - fz * 0.6 - lk * 0.8, tz = 6.4 + sf * 2.6 - fz * 2.4 - lk * 2.4;   // low and close, nearer pavement height as in the reference
    const follow = camera.aspect < 1 ? 0.85 : 0.45;   // phones: keep the bike in frame
    camera.position.x = lerp(camera.position.x, S.x * follow, dt * 4);
    camera.position.y = lerp(camera.position.y, ty, dt * (lk ? 5 : 2.5));
    camera.position.z = lerp(camera.position.z, tz, dt * (lk ? 5 : 2.5));
    camera.fov = lerp(camera.fov, 60 + sf * 10 + fz * 22, dt * 3); camera.updateProjectionMatrix();
    camera.lookAt(S.x * (camera.aspect < 1 ? 0.7 : 0.3) + bend(-14) * 0.6, 1.25 + fz * 0.4 + (hills ? rise(-14) * 0.75 : 0), -8 - fz * 6);
  }

  // HUD
  const hud = `${S.souls}|${S.streak}|${Math.round(S.dist)}`; if (hud !== S.hudLast) { S.hudLast = hud; $('souls').textContent = S.souls; $('streak').textContent = S.streak; $('streakpill').classList.toggle('on', S.streak >= 3); $('dist').textContent = Math.round(S.dist) + ' m'; }
  // wallet: counts toward the real amount, a tick per whole euro crossed, written only when the shown amount changes
  if (S.walletShown !== S.cents) {
    const diff = S.cents - S.walletShown, step = Math.max(100, Math.abs(diff) / 0.5) * dt, prev = S.walletShown;
    S.walletShown = Math.abs(diff) <= step ? S.cents : S.walletShown + Math.sign(diff) * step;
    if (Math.floor(prev / 100) !== Math.floor(S.walletShown / 100) && S.t - S.tickT > 0.07) { S.tickT = S.t; tick(); }
    const shown = Math.round(S.walletShown / 10) * 10;
    if (shown !== S.walletLast) { S.walletLast = shown; $('wallet').textContent = FARES.fmtEuro(shown); }
  }
  if (S.fxT > 0) { S.fxT -= dt; if (S.fxT <= 0) { $('walletfx').textContent = ''; $('walletfx').className = ''; } }
  if (toastT > 0) { setToastT(toastT - dt); if (toastT <= 0) toast.style.opacity = 0; }
}

function loop() {
  requestAnimationFrame(loop);
  const raw = clock.getDelta(); const dt = Math.min(0.05, raw);
  if (S.mode !== 'ride') rideFrames = 0; else rideFrames++;
  if (document.hidden || raw > 0.25 || rideFrames < 150) { frameAcc = 0; frameN = 0; }   // the first seconds of a ride still compile pipelines: they do not count
  else if (S.mode === 'ride') { frameAcc += raw; if (++frameN >= 90) { const avg = frameAcc / frameN; frameAcc = 0; frameN = 0;
    if (avg > 0.028 && NODES && MSAA && composer && !window.NRnoAutoDPR) { setMSAA(0); nodePost(); }
    else if (avg > 0.028 && DPR > 0.7 && !window.NRnoAutoDPR) { setDPR(Math.max(0.7, DPR - 0.25)); renderer.setPixelRatio(DPR); postSize(); } } }
  if (S.mode === 'cine') cineTick(dt);
  else if (S.mode !== 'start') update(dt);
  else { // idle drift on the title
    for (const w of wieven) w.position.x += Math.sin(S.t += dt * 0.01) * 0.002;
    camera.position.y = 22 + Math.sin(performance.now() / 2000) * 0.4;
  }
  startArt.watch();
  if (!startArt.live) render();   // under the live start painting the 3D scene cannot be seen
}
const q = new URLSearchParams(location.search);
if (q.has('shot') || q.has('cine') || q.has('level')) await Promise.race([modelsReady, new Promise(r => setTimeout(r, 8000))]);   // a held frame shows the models, not the stand-ins
if (q.has('map')) { setIntroSeen(true); openMap(); if (q.get('map') !== '1') { const t = towns().find(x => x.id === q.get('map')); if (t) openTown(t); } }
// ?cine=N plays the full intro from panel N (shots where they exist); ?cine=N&t=S stages shot N, steps it to S seconds and holds that frame
if (q.has('cine')) {
  const n = Math.max(1, Math.min(14, parseInt(q.get('cine'), 10) || 1)) - 1;
  setIntroSeen(true); $('start').style.display = 'none';
  if (!q.has('t')) showIntro(openMap, null, true, n);
  else {
    const NA = window.NRART, p = NA && NA.panels[n];
    $('intro').style.display = 'flex'; $('pixframe').style.display = 'none'; $('pixtext').textContent = p ? p.text : ''; $('pixnl').textContent = p ? p.nl : ''; $('pixnl').style.opacity = 1;
    if (cineBegin(n)) { const T = parseFloat(q.get('t')) || 0; for (let i = 0; i < Math.round(T * 60); i++) cineTick(1 / 60); setCineFrozen(true); }
  }
}
if (q.has('shot')) {
  start(q.has('level') ? LEVELS.find(l => l.id === +q.get('level')) : null);   // by id: the content bundles append levels out of order
  if (q.has('hillphase')) setHillPhase(parseFloat(q.get('hillphase')) || 0);   // hill towns: where on the waves the ride starts, to look at a crest or a dip
  if (q.has('look')) { const looks = S.queue.filter(e => e.look); if (looks.length) S.queue = looks.concat(looks); }
  const secs = parseFloat(q.get('shot')) || 0;
  for (let i = 0; i < secs * 60; i++) { update(1 / 60); if (q.has('lane') && S.mode === 'ride') S.lane = +q.get('lane'); }
  if (q.has('gate')) { // ride on until the next fork is this close
    const want = parseFloat(q.get('gate')) || 12; let n = 0;
    while (n++ < 60 * 120 && S.mode === 'ride' && !(S.activeFork && S.dist - S.activeFork.d > -want)) { update(1 / 60); if (q.has('lane')) S.lane = +q.get('lane'); }
  }
  render();
  // headless screenshots cannot see WebGL canvases: copy the frame into an image
  const img = new Image(); img.src = renderer.domElement.toDataURL(); img.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:1'; document.body.appendChild(img);
}
startArt.on3d();   // the title screen in 3D, now the world and the shots are up (only while the start screen is still showing)
loop();

export { update, warmUp };
