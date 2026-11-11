// The game's entry and hub (PLAN.md phase 2). index.html loads this module. It imports the game's modules in the order their
// code ran when it was one script, and re-exports them. A module imports what comes before it directly and what comes after it
// from here, so every module is evaluated once, in that order, and the random draws and scene objects are made as before.
// The pure rules (tasks, reading, lamp, forks, voice) are shared with the unit tests in qa/test.
import { HOLD_AT, legDist, READ_AHEAD, READ_THR } from './reading.js?v=38';
import { lampLoss, lampReadK, refuelRight, TUNE } from './lamp.js?v=38';
import { levelQueue } from './forks.js?v=38';
import { VOICES } from './voice.js?v=38';
import { $, BASE_SPEED, clamp, FARES, LANES2, LANES3, lerp, MAX_SPEED, NODES, pick, rnd, ROAD_W, smooth, THREE, today } from './engine.js?v=38';
export * from './engine.js?v=38';
import { MSAA, NODEFX, setMSAA } from './render-nodes.js?v=38';
export * from './render-nodes.js?v=38';
import { bloomPass, camera, clueLight, composer, DPR, gradePass, hemiLight, inkPass, lampLight, nodePost, postSize, render, renderer, scene, setDPR } from './render.js?v=38';
export * from './render.js?v=38';
import { aurora, skyDome } from './sky.js?v=38';
export * from './sky.js?v=38';
import { GlowMat, glowTex, M, Mat, TINT } from './materials.js?v=38';
export * from './materials.js?v=38';
import { bend, hillAt, hills, keepBehind, KERB_W, kerbL, kerbR, landL, landR, RIB_STEP, rise, roadRib, setBehind, setHillPhase, setRoadLook,
  updateRibbon, verge, vergeL, vergeR, waterRib } from './road.js?v=38';
export * from './road.js?v=38';
import { LAMP_CONE_MAT, LAMP_HALO_MAT, LAMP_POOL_MAT, LAMP_STREAK_MAT, PG, PM, WIN_GLOW_MAT } from './props.js?v=38';
export * from './props.js?v=38';
import { kadd, kb, kbuild, KG, kit, ktube, PK } from './kit.js?v=38';
export * from './kit.js?v=38';
import { bikeRow, bins, crates, ducks, lamppost, moorings, setTownId, setTownStyle, townId, townStyleOf, windmill } from './furniture.js?v=38';
export * from './furniture.js?v=38';
import { bench, bikeProp, boat, bollard, bridge, cheeseCart, church, drawbridge, house, PICTO, PICTO_ALIAS, reeds, tulipBox } from './houses.js?v=38';
export * from './houses.js?v=38';
import { backRow, canalBridge, flagNL, LANDMARK, skyBands, terrace, tintFar, tower, treeCard } from './backdrop.js?v=38';
export * from './backdrop.js?v=38';
import { buildScenery, scenery, sceneryPlace, theme, THEMES, wieven } from './scenery.js?v=38';
export * from './scenery.js?v=38';
import { modelsReady } from './models.js?v=38';
export * from './models.js?v=38';
import { beam, bike, dogs, drawFace, dropPassenger, faceState, follower, mountPassenger, rackGhost, riderTick, setCineDogs, setFace, setFaceState,
  setRackGhost } from './rider.js?v=38';
export * from './rider.js?v=38';
import { bigSign, G, labelTexture, signFit, signpost } from './signs.js?v=38';
export * from './signs.js?v=38';
import { ghostFigure } from './cast.js?v=38';
export * from './cast.js?v=38';
import { cart, fence, puddle, roadArrow, TEACH_HALO_MAT, wisp, zombie, zombieParts } from './zombies.js?v=38';
export * from './zombies.js?v=38';
import { BASE, DISTRICT_NEED, L, LANE_X, MAXS, nightDepth, progress, S, saveProgress, saveScores, scores, setL, setLaneX, setSpeeds, UNLOCK_ALL,
  unlocked } from './state.js?v=38';
export * from './state.js?v=38';
import { plan, signFrac } from './plan.js?v=38';
export * from './plan.js?v=38';
import { assembled, card, cardSeq, fareRow, flash, forkCard, hideCard, say, setToastT, showCard, toast, toastT } from './hud.js?v=38';
export * from './hud.js?v=38';
import { audioCtx, bark, chime, initAudio, thump, tick } from './audio.js?v=38';
export * from './audio.js?v=38';
import { speak, speakSeq } from './speech.js?v=38';
export * from './speech.js?v=38';
import { goKnown, goNow, TOUCH } from './input.js?v=38';
export * from './input.js?v=38';
import { introSeen, setIntroSeen, showIntro, showLevelIntro, startArt } from './intro.js?v=38';
export * from './intro.js?v=38';
// ---------- the rest of the game: not yet in its own module ----------
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

// the lamp's numbers (drain, wisp, right-answer refuel, cap, go-key bonus) are TUNE in src/lamp.js; the bots change them through NRTUNE
window.NRTUNE = TUNE;
window.NR = S; // debug handle
window.NRsetDPR = v => { setDPR(v); renderer.setPixelRatio(DPR); postSize(); };
window.NRpost = () => ({ composer, inkPass, bloomPass, gradePass, renderer, THREE });
window.NRface = (n, secs) => setFace(n, secs || 3);
window.NRbike = () => ({ bike, faceState, dogs });   // dogs: the pair that runs beside him (qa/intro-sheet.mjs checks where they show)
window.NRsnap = async () => { render(); const url = renderer.domElement.toDataURL('image/png'); const r = await fetch('http://localhost:8766/shot', { method: 'POST', body: url }); return r.text(); };
window.NRstep = (n, each) => { for (let i = 0; i < (n || 60); i++) { update(1 / 60); if (each) each(); } render(); };   // each: qa bots sample every frame
window.NRcam = () => camera;
window.NRbright = () => { render(); const c = renderer.domElement, t = document.createElement('canvas'); t.width = 64; t.height = 36; const g = t.getContext('2d'); g.drawImage(c, 0, 0, 64, 36); const d = g.getImageData(0, 0, 64, 36).data; let sum = 0; for (let i = 0; i < d.length; i += 4) sum += d[i] + d[i + 1] + d[i + 2]; return Math.round(sum / (d.length / 4) / 3); };
// which backend really runs, and on what: 'webgpu', 'webgl2 (WebGPURenderer fallback)' or 'webgl2 (WebGLRenderer)'
window.NRbackend = async () => {
  const glName = gl => { const e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); };
  if (!NODES) return { backend: 'webgl2 (WebGLRenderer)', adapter: glName(renderer.getContext()) };
  const b = renderer.backend;
  if (b.isWebGPUBackend) { const i = b.device.adapterInfo || {}; return { backend: 'webgpu', adapter: [i.vendor, i.architecture, i.device, i.description].filter(Boolean).join(' ') || 'unknown adapter' }; }
  return { backend: 'webgl2 (WebGPURenderer fallback)', adapter: glName(b.gl) };
};
window.NRinfo = () => ({ geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures, programs: (renderer.info.programs || []).length, calls: renderer.info.render.drawCalls != null ? renderer.info.render.drawCalls : renderer.info.render.calls, dpr: DPR, post: !!composer, msaa: NODES ? MSAA : 0 });
window.NRfare = () => ({ cents: S.cents, missed: S.missed, tips: S.tips, tikkie: S.tikkie, cleanRow: S.cleanRow, score: S.score, paid: S.paid });
window.NRfareFns = { paidLine, payTikkie };   // qa: the toast line and the Tikkie, called directly
window.goLevel = id => { const lv = LEVELS.find(l => l.id === id); if (lv && !lv.soon) { openMission(lv); return true; } return false; };

window.NRread = { signFit, legDist, READ_THR, READ_AHEAD };   // qa: how far off a sign text reads (em = signFit(t).px / 250 * 1.02, x1.3 on tier 1)
window.NRgo = goNow;   // qa

// ---------- game flow ----------
// ---------- the cinematic intro: 3D shots in the game's own world ----------
// intro3d/shot-N.js registers window.NRCINE[N-1] = { build(W), update(W, t, dt), dispose(W) }: a few seconds staged from the
// game's own builders, its camera and actors moved by update(); the intro's captions run over it in letterbox. A panel
// without a shot keeps its pixel painting. ?cine=N plays the intro from panel N; ?cine=N&t=S freezes shot N at S seconds.
const CINE = window.NRCINE = window.NRCINE || [];
let cineShot = null, cineT = 0, cineFrozen = false, cineTitleAt = Infinity, cineDy = 0;
const cineProps = [], cineSays = [], cineHidden = [], _cineV = new THREE.Vector3();
const W = {
  THREE, NODE: NODEFX, scene, camera, bike, beam, lampLight, render, ROAD_W, KERB_W,
  house, terrace, backRow, lamppost, treeCard, reeds, boat, moorings, ducks, canalBridge, drawbridge, bridge, windmill, church, tower, LANDMARK,
  zombie, zombieParts, ghostFigure, bikeProp, bikeRow, fence, bollard, bench, tulipBox, cheeseCart, crates, bins, flagNL, wisp, labelTexture,
  kit, kb, kadd, ktube, kbuild, Mat, GlowMat, glowTex, M, PM, PK, PG, KG, THEMES, TINT,
  rnd, pick, lerp, smooth, clamp,
  // the set: a town and one of the game's themes (street, gracht, shops, square, nightshop, dyke, polder), the hero or not.
  // The world is rolled on by o.preroll metres (default 50) so the road behind him is built too, for shots that look back.
  // o.seed makes the set the same on every play (the scenery's random choices come from it); rider: false also puts his lamp out.
  stage(o = {}) {
    const rand = Math.random; if (o.seed != null) { let s = (o.seed | 0) % 2147483646 + 1; Math.random = () => (s = (s * 16807) % 2147483647) / 2147483647; }
    try {
      setTownId(o.town || 'alblasserdam'); setTownStyle(townStyleOf(townId));
      setL(null); setLaneX(LANES3); setSpeeds(BASE_SPEED, MAX_SPEED);
      buildScenery(THEMES[o.theme || 'street'] || THEMES.street); setRoadLook(3, theme);
      reset(); for (const ob of S.objs) if (ob.mesh) scene.remove(ob.mesh); S.objs = []; S.planCursor = 1e9;   // no forks, no wisps: nothing is played
      S.mode = 'cine'; S.fogMul = o.fog || 1; S.lamp = o.lamp == null ? 92 : o.lamp; S.lane = 1; S.x = 0; setBehind(40, 40);
      W.ride(0); bike.rotation.set(0, 0, 0); bike.visible = o.rider !== false; hideCard();
      const pre = o.preroll == null ? 50 : o.preroll; S.cineSpeed = pre / 0.5; for (let i = 0; i < 10; i++) update(0.05);
      S.cineSpeed = 0; S.speed = 0; S.t = 0;
    } finally { Math.random = rand; }
  },
  // hides what a set does not need: test(object) gets every scenery piece and every object in the scene; all of it comes back when the shot ends
  hide(test) {
    for (const o of scenery) if (!o.cineHidden && test(o.mesh, o)) { o.cineHidden = true; o.mesh.visible = false; cineHidden.push(o); }
    for (const ch of scene.children) if (ch.visible && !cineProps.includes(ch) && !scenery.some(o => o.mesh === ch) && test(ch)) { ch.visible = false; cineHidden.push({ mesh: ch }); }
  },
  // the picture between the top bar and the captions, in CSS pixels, measured now: { top, bottom, height, width, portrait }.
  // A shot object with its own band() sets its own picture (the title screen: the screen under the title).
  band() {
    if (cineShot && cineShot.band) return cineShot.band();
    const top = Math.round(innerHeight * 0.09), bottom = Math.round($('intro').querySelector('.box').getBoundingClientRect().top); return { top, bottom, height: bottom - top, width: innerWidth, portrait: innerWidth < bottom - top };
  },
  // the wheels turn at v; the world rolls past at world (default v). W.speed(7, 0) stops the street while he rides on (see ride)
  speed(v, world) { S.speed = v; S.slow = 1; S.cineSpeed = world == null ? v : world; },
  fog(mul) { S.fogMul = mul; },                                                   // thicker (> 1) or thinner haze than the theme's
  cam(px, py, pz, lx, ly, lz, fov) { camera.position.set(px, py, pz); if (fov && camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); } camera.lookAt(lx, ly, lz); },
  // after cam(): a hand-held drift, a = 1 is a calm operator; it moves the eye a few centimetres and rolls it a little
  drift(t, a = 1) { camera.position.x += a * 0.03 * (Math.sin(t * 0.9) + 0.5 * Math.sin(t * 2.3 + 1)); camera.position.y += a * 0.02 * Math.sin(t * 1.3 + 2); camera.rotateZ(a * 0.004 * Math.sin(t * 0.7)); },
  face(name, secs) { setFace(name, secs || 99, false); },
  // the rider, his lamp and its light at z along the road (0 is home; negative is ahead): a stopped street, a rider riding away
  ride(z) { bike.position.z = z; lampLight.position.z = z + 0.4; lampLight.target.position.z = z - 20; },
  // a prop stands in the street and rolls past with it; o.ride keeps it beside the rider instead
  add(obj, x, y, z, ry, o = {}) { obj.position.set(x || 0, y || 0, z || 0); if (ry != null) obj.rotation.y = ry; obj.userData.cineWorld = !o.ride; scene.add(obj); cineProps.push(obj); return obj; },
  // a speech bubble over an actor (an Object3D it follows, or a fixed [x, y, z]), shown between from and to seconds
  say(text, at, o = {}) {
    const el = document.createElement('div'); el.className = 'cinesay'; el.textContent = text; el.style.opacity = 0; $('intro').appendChild(el);
    cineSays.push({ el, at, dy: o.dy == null ? 2.5 : o.dy, from: o.from || 0, to: o.to == null ? 99 : o.to }); return el;
  },
  title(main, sub, at) { $('cinetitle').querySelector('h1').textContent = main; $('cinetitle').querySelector('.sub').textContent = sub || ''; cineTitleAt = at || 0; },
  flash() { const f = $('cineflash'); f.style.transition = 'none'; f.style.opacity = 0.9; requestAnimationFrame(() => { f.style.transition = 'opacity .5s ease-out'; f.style.opacity = 0; }); },
};
window.NRW = W;   // the world handle: the shots, QA camera shots and the console use it
function cineBegin(i) {
  const shot = typeof i === 'object' ? i : CINE[i]; if (!shot) return false;   // an intro panel's index, or a shot object (the level cards)
  cineEnd(); cineShot = shot; cineT = 0; cineTitleAt = Infinity; setCineDogs(typeof i === 'object' || i === 7 || i === 13);
  try { shot.build(W); } catch (e) { console.error(`cine shot ${typeof i === 'object' ? 'card' : i + 1}: ${e && e.message}`); cineEnd(); return false; }
  $('intro').classList.add('cine'); document.body.classList.add('cine'); cineFrame(); return true;
}
function cineEnd() {
  if (cineShot && cineShot.dispose) try { cineShot.dispose(W); } catch (e) {}
  for (const p of cineProps) { scene.remove(p); p.traverse(m => { if (m.userData.ownTex && m.material) { if (m.material.map) m.material.map.dispose(); m.material.dispose(); } }); }
  cineProps.length = 0; for (const s of cineSays) s.el.remove(); cineSays.length = 0;
  for (const o of cineHidden) { o.mesh.visible = true; o.cineHidden = false; } cineHidden.length = 0;
  $('cinetitle').style.opacity = 0; cineShot = null; setCineDogs(true); cineFrozen = false; S.fogMul = 1; S.cineSpeed = 0; bike.visible = true; beam.visible = true; W.ride(0); bike.rotation.set(0, 0, 0);
  setBehind(10, 20); cineDy = 0; camera.clearViewOffset();
  if (S.mode === 'cine') S.mode = 'start';
  $('intro').classList.remove('cine'); document.body.classList.remove('cine');
}
// the projection is centred on the shot's picture (W.band: between the top bar and the captions), so a shot's lookAt point is its middle
function cineFrame() {
  const b = W.band(), dy = Math.round((innerHeight - b.top - b.bottom) / 2);
  if (dy !== cineDy) { cineDy = dy; camera.setViewOffset(innerWidth, innerHeight, 0, dy, innerWidth, innerHeight); }
}
function cineTick(dt) {
  if (!cineShot || cineFrozen) return;
  cineT += dt; update(dt);
  const adv = (S.cineSpeed || 0) * dt; for (const p of cineProps) if (p.userData.cineWorld) p.position.z += adv;
  try { cineShot.update(W, cineT, dt); } catch (e) { console.error(`cine update: ${e && e.message}`); cineEnd(); return; }   // a broken shot cleans up after itself; the panel falls back to its painting
  cineFrame();
  if (cineT >= cineTitleAt) $('cinetitle').style.opacity = 1;
  for (const s of cineSays) {   // bubbles ride on their actors, hidden off screen or behind the eye
    if (Array.isArray(s.at)) _cineV.set(s.at[0], s.at[1], s.at[2]); else s.at.getWorldPosition(_cineV);
    _cineV.y += s.dy; _cineV.project(camera);
    const on = cineT >= s.from && cineT < s.to && _cineV.z < 1 && Math.abs(_cineV.x) < 1.1 && Math.abs(_cineV.y) < 1.1;
    s.el.style.opacity = on ? 1 : 0;
    if (on) s.el.style.transform = `translate(${Math.round((_cineV.x + 1) / 2 * innerWidth)}px, ${Math.round((1 - _cineV.y) / 2 * innerHeight)}px) translate(-50%, -100%)`;
  }
}

// ---------- the world map ----------
const PLACES = [['thuis', 'Thuis'], ['winkels', 'De winkels'], ['eten', 'Eten en drinken'], ['station', 'Het station'], ['werk', 'Het werk'], ['sport', 'De sport'], ['mensen', 'De mensen'], ['eigen', 'Alleen hier']];
const TOWN_OF = id => id === 41 ? 'alblasserdam' : id <= 5 ? 'alblasserdam' : id <= 10 ? 'kinderdijk' : id <= 15 ? 'gouda' : id <= 20 ? 'utrecht' : id <= 30 ? 'rotterdam' : 'amsterdam';
const PLACE_OF = { 41: 'thuis', 1: 'thuis', 2: 'mensen', 3: 'thuis', 4: 'mensen', 5: 'winkels', 6: 'winkels', 7: 'eten', 8: 'thuis', 9: 'eten', 10: 'station', 11: 'werk', 12: 'station', 13: 'mensen', 14: 'winkels', 15: 'sport' };
const LL = (lon, lat) => [(lon - 3.3) / (7.2 - 3.3), 1 - (lat - 50.75) / (53.55 - 50.75)];
const TOWNS_FALLBACK = [
  { id: 'alblasserdam', name: 'Alblasserdam', tier: 1, cefr: 'A1', pos: LL(4.66, 51.87), blurb: 'Home. The dogs still need a walk.' },
  { id: 'kinderdijk', name: 'Kinderdijk en Dordrecht', tier: 2, cefr: 'A1', pos: LL(4.68, 51.83), blurb: 'Nineteen mills and the oldest city. The water never sleeps.' },
  { id: 'gouda', name: 'Gouda', tier: 3, cefr: 'A1-A2', pos: LL(4.71, 52.01), blurb: 'Cheese, stroopwafels, a town hall in the middle of the square.' },
  { id: 'utrecht', name: 'Utrecht', tier: 4, cefr: 'A2', pos: LL(5.12, 52.09), blurb: 'The Dom, the wharves, more bikes than people.' },
  { id: 'rotterdam', name: 'Rotterdam', tier: 5, cefr: 'A2-B1', pos: LL(4.48, 51.92), blurb: 'Big, loud, rebuilt. The harbour does not stop for the dead.' },
  { id: 'amsterdam', name: 'Amsterdam', tier: 6, cefr: 'B1-B2', pos: LL(4.9, 52.37), blurb: 'Canals, trams, tourists, bells. The hardest night.' },
];
function towns() { return (window.TOWNS && window.TOWNS.length ? window.TOWNS : TOWNS_FALLBACK).slice().sort((a, b) => a.tier - b.tier); }
function townLevels(t) { return LEVELS.filter(l => (l.town || TOWN_OF(l.id)) === t.id); }
function townStars(t) { return townLevels(t).reduce((n, l) => n + (progress[l.id] || 0), 0); }
function townOpen(t) { if (t.tier === 1 || UNLOCK_ALL) return true; const prev = towns().find(x => x.tier === t.tier - 1); return prev ? townStars(prev) >= DISTRICT_NEED : false; }
// the route board: towns in tier order along roads over the real country, painted by map-art.js (window.NRMAP)
const CEFR_COL = { A1: '#8fd16a', 'A1-A2': '#c8d85a', A2: '#ffd27a', 'A2-B1': '#f0a050', B1: '#e87a3a', 'B1-B2': '#d9532a', B2: '#b8282a' };
let mapAt = 0, mapAnim = null, mapNodes = [], mapLay = null, mapBadges = [], mapFxOn = false;
const mapBike = { x: null, y: 0, flip: false, moving: false, cur: 0, from: -1, to: -1, side: 0 }; window.NRmapBike = mapBike;   // debug hook: where the rider is on the map
function mapF() { const W = $('world').clientWidth || innerWidth, H = $('world').clientHeight || innerHeight; return Math.max(8.5, Math.min(13, Math.min(W * 1.1, H) / 64)); }
function nodePositions(n) {   // real geography (lon/lat), a lens on the Randstad, then pushed apart so no badge or label overlaps
  const W = $('world').clientWidth || innerWidth, H = $('world').clientHeight || innerHeight, wb = $('world').getBoundingClientRect();
  const top = $('maphead').getBoundingClientRect().bottom - wb.top + 4, bot = $('mapfoot').getBoundingClientRect().top - wb.top - 2;
  const f = mapF(), box = { x: Math.max(8, W * 0.02), y: top, w: W - 2 * Math.max(8, W * 0.02), h: Math.max(120, bot - top) };
  mapLay = NRMAP.layout(W, H, box, towns().slice(0, n), f); return mapLay.nodes;
}
function townState(t) { return !townOpen(t) ? 'locked' : townStars(t) >= DISTRICT_NEED ? 'saved' : 'open'; }
function drawWorld() {
  const svg = $('nl'); const W = $('world').clientWidth || innerWidth, H = $('world').clientHeight || innerHeight;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.innerHTML = '';
  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const T = towns(); const pts = nodePositions(T.length); mapNodes = pts; const f = mapLay.f;
  const states = T.map(townState);
  NRMAP.paint($('nlart'), mapLay, T, states);   // the country, the roads and the towns, cached until the size or the progress changes
  const openIdx = T.map((t, i) => townOpen(t) ? i : -1).filter(i => i >= 0); if (!openIdx.includes(mapAt)) mapAt = openIdx[openIdx.length - 1] || 0;
  const defs = el('defs', {}); defs.innerHTML = NRMAP.defs; svg.appendChild(defs);
  mapBadges = [];
  T.forEach((t, i) => {
    const [x, y] = pts[i]; const st = states[i]; const stars = townStars(t); const col = CEFR_COL[t.cefr] || '#e8e4d8';
    const g = el('g', { class: 'town' + (st === 'locked' ? ' locked' : ''), transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` });
    g.appendChild(el('circle', { r: f * 2.6, fill: 'transparent' }));
    const b = el('g', {}); g.appendChild(b); mapBadges.push({ b, t, st, col });
    const label = el('text', { y: f * 2.75, 'text-anchor': 'middle', class: 'nm', style: `font-size:${f}px` }); label.textContent = NRMAP.label(t); g.appendChild(label);
    const band = el('text', { y: f * 3.95, 'text-anchor': 'middle', class: 'band', style: `font-size:${(f * 0.88).toFixed(1)}px;fill:${st === 'locked' ? '#aab4c2' : col}` }); band.textContent = t.cefr + (st !== 'locked' && stars ? ' · ★' + stars : ''); g.appendChild(band);
    g.onclick = () => rideTo(i);
    svg.appendChild(g);
  });
  // until the first town is saved, the endless night is a quiet text link, not the biggest thing on the screen
  $('endless').classList.toggle('aslink', !states.includes('saved'));
  if (mapAnim) { cancelAnimationFrame(mapAnim); mapAnim = null; }
  mapBike.from = mapBike.to = -1; placeBike(mapAt); mapFxStart();
}
function markCurrent(cur) { mapBadges.forEach(({ b, t, st, col }, i) => { b.innerHTML = NRMAP.badge(t, i, st, i === cur, mapLay.f, col); }); }
function segLen(i) { return mapLay ? (mapLay.route.nodeS[i] || 0) : 0; }   // road length from the first town to town i
function bikeRest(i, side) {   // where the bike waits at town i: on the road just outside the badge, on the side it came in; null when both sides run under the label
  const R = mapLay.route, f = mapLay.f, s = segLen(i), n = mapLay.nodes[i], B = mapLay.blk[i];
  const sides = [side || (i > 0 ? -1 : 1), -(side || (i > 0 ? -1 : 1))].filter(d => (d < 0 && i > 0) || (d > 0 && i < R.nodeS.length - 1));
  for (const d of sides) { const p = NRMAP.at(R, s + d * f * 2.7); if (!(Math.abs(p.x - n[0]) < B.w / 2 && p.y > n[1] + f * 0.6)) return s + d * f * 2.7; }
  return null;
}
function placeBike(i, s, dir) {   // at rest at town i, or riding at arc length s in direction dir
  if (!mapLay || !mapNodes.length) return;
  const rest = s == null;
  if (rest) {
    s = bikeRest(i, mapBike.side); markCurrent(i);
    if (s == null) { const n = mapLay.nodes[i], f = mapLay.f; Object.assign(mapBike, { x: n[0] + f * 2.6, y: n[1] + f * 0.55, flip: true, moving: false, cur: i }); return; }   // beside the badge, facing it
    dir = s <= segLen(i) ? 1 : -1;
  }
  const p = NRMAP.at(mapLay.route, s);
  mapBike.x = p.x; mapBike.y = p.y; mapBike.flip = p.dx * dir < 0; mapBike.moving = !rest; mapBike.cur = rest ? i : -1;
}
function mapFxStart() {   // the only animation on the map: glow pulse, road lamps, the lighthouse and the cyclist
  if (mapFxOn) return; mapFxOn = true; let last = 0;
  const tick = now => {
    if ($('map').style.display === 'none') { mapFxOn = false; return; }
    if (mapBike.moving || now - last > 32) { last = now; NRMAP.fx($('nlfx'), mapLay, now / 1000, mapBike); }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
let _mapResize = 0;
addEventListener('resize', () => { clearTimeout(_mapResize); _mapResize = setTimeout(() => { if ($('map').style.display !== 'none' && !mapAnim) drawWorld(); }, 150); });
function rideTo(target) {   // ride the road to an open town, through the towns between, then go in
  const T = towns(); if (!townOpen(T[target])) { openTown(T[target]); return; }
  if (mapAnim) return;
  if (target === mapAt) { openTown(T[target]); return; }
  const f = mapLay.f, dir = target > mapAt ? 1 : -1, r0 = bikeRest(mapAt, mapBike.side), r1 = bikeRest(target, -dir), s0 = r0 == null ? segLen(mapAt) : r0, s1 = r1 == null ? segLen(target) : r1;
  const dur = Math.min(4500, Math.max(800, Math.abs(s1 - s0) / (f * 0.04))), t0 = performance.now();
  mapBike.from = mapAt; mapBike.to = target; markCurrent(-1);
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    placeBike(mapAt, s0 + (s1 - s0) * e, dir);
    if (k >= 1) { mapAt = target; mapAnim = null; mapBike.side = -dir; mapBike.from = mapBike.to = -1; placeBike(target); openTown(T[target]); return; }
    mapAnim = requestAnimationFrame(step);
  };
  closeTown();
  mapAnim = requestAnimationFrame(step);
}
addEventListener('keydown', e => {
  if ($('map').style.display === 'none' || S.mode !== 'start') return;
  const T = towns();
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { const n = T.findIndex((t, i) => i > mapAt && townOpen(t)); if (n >= 0) rideTo(n); e.preventDefault(); }
  else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { let n = -1; for (let i = mapAt - 1; i >= 0; i--) if (townOpen(T[i])) { n = i; break; } if (n >= 0) rideTo(n); e.preventDefault(); }
  else if (e.key === 'Enter' || e.key === ' ') {
    const a = document.activeElement, inCard = townCardUp && a && a.tagName === 'BUTTON' && $('town').contains(a) && a.id !== 't_close';
    if (townCardUp && (inCard || townNext)) (inCard ? a : townNext).click(); else openTown(T[mapAt]);
    e.preventDefault();
  }
  else if (e.key === 'Escape' && townCardUp) closeTown();
});
// a de/het bonus level per town, built from every noun with an article in that town and the towns before it
function dehetBonus(t) {
  const seen = new Map();
  for (const lv of LEVELS) {
    if (lv.soon || !lv.items) continue; const lt = towns().find(x => x.id === (lv.town || TOWN_OF(lv.id))); if (!lt || lt.tier > t.tier) continue;
    for (const it of lv.items) {
      const nl = it.dehet ? `${it.art} ${it.nl}` : it.nl; const en = it.dehet ? it.en : (it.w || it.en); if (!nl || !en) continue;
      const m = /^(de|het)\s+(\S.*)$/.exec(nl); if (!m || /^\d/.test(en)) continue;
      if (!seen.has(m[2])) seen.set(m[2], { dehet: true, nl: m[2], art: m[1], en, w: it.w && it.wrong ? '' : (it.w || '') });
    }
  }
  const items = [...seen.values()];
  const tierKnobs = { 1: { lanes: 2, speed: 12, forkSlow: 0.45 }, 2: { lanes: 2, speed: 13, forkSlow: 0.4 }, 3: { lanes: 2, speed: 14, forkSlow: 0.35 } }[t.tier] || { lanes: 2, speed: 15, forkSlow: 0.3 };
  return { id: 1000 + t.tier, act: t.tier, name: 'De of het', theme: 'street', town: t.id, place: 'bonus', ...tierKnobs, maxSpeed: tierKnobs.speed + 3, ramp: true, lampDecay: 0.4 + t.tier * 0.05, hint: null, obstacles: 'puddles', filler: [14, 20], deliveries: Math.min(24, Math.max(12, Math.floor(items.length / 2))), cefr: t.cefr, maxWords: 2,
    intro: `${items.length} nouns from ${t.name} and everything before it. De left, het right. There is still no rule.`, introNl: `${items.length} woorden uit ${t.name} en alles daarvoor. De links, het rechts. Er is nog steeds geen regel.`,
    mission: { where: `Every door in ${t.name}.`, carry: 'A roll of labels. Half say de, half say het.', want: 'The dead hold up a thing. Steer left for de, right for het. Fast, no hints.' },
    items };
}
function openTown(t) {
  const open = townOpen(t);
  { const i = towns().findIndex(x => x.id === t.id); if (open && i >= 0 && i !== mapAt && !mapAnim && mapLay) { mapAt = i; mapBike.side = 0; placeBike(i); } }   // an open town opened directly (a link, ?map=id): the rider is there
  $('t_tier').textContent = `Tier ${t.tier} · ${t.cefr}` + (open ? '' : ` · ${Math.max(0, DISTRICT_NEED - townStars(towns().find(x => x.tier === t.tier - 1) || t))} more stars in the town before`);
  $('t_name').textContent = t.name; $('t_blurb').textContent = t.blurb || ''; $('t_blurbnl').innerHTML = (t.blurbNl || '') + (t.rumour ? `<div style="margin-top:6px;color:#9fb0cc;font-style:normal"><span style="color:var(--dim);font-size:11px;letter-spacing:.12em;text-transform:uppercase">What they say here</span><br>${t.rumour}<br><i>${t.rumourNl}</i></div>` : '');
  // one list in story order: what is done collapses to a row of stars, the first place not played yet is lit and focused so
  // Enter rides it, the rest follow quietly; places that do not exist yet ("Alleen hier" in most towns) are not shown
  const box = $('t_places'); box.innerHTML = '';
  const rows = []; for (const [pid, pname] of PLACES) for (const l of townLevels(t)) if ((l.place || PLACE_OF[l.id]) === pid && !l.soon) rows.push({ l, pname });
  const bonus = dehetBonus(t); rows.push({ l: bonus, pname: 'Bonus', bonus: true });
  const stars = n => '★'.repeat(n) + '☆'.repeat(3 - n);
  const done = rows.filter(r => progress[r.l.id] > 0), todo = rows.filter(r => !(progress[r.l.id] > 0));
  if (done.length) {
    const strip = document.createElement('div'); strip.className = 'tdone';
    for (const r of done) {
      const b = document.createElement('button'); b.className = 'star'; b.title = `${r.pname} · ${r.l.name}` + (scores[r.l.id] ? ` · best ${scores[r.l.id]}` : '');
      b.innerHTML = `${stars(progress[r.l.id])}<span>${r.l.name}</span>`; b.onclick = () => openMission(r.l); strip.appendChild(b);
    }
    box.appendChild(strip);
  }
  const tier = t.tier, later = document.createElement('div'); later.className = 'tlater'; townNext = null;
  todo.forEach((r, i) => {
    const b = document.createElement('button'), next = open && i === 0, words = r.bonus ? `, ${r.l.items.length} words` : '';
    b.className = 'place' + (next ? ' next' : ' later') + (r.bonus ? ' bonus' : '') + (open ? '' : ' locked');
    b.innerHTML = next
      ? `<small>${r.pname}${r.bonus ? '' : ' · next'}</small><b>${r.l.name}${words}</b><span class="go">${r.l.mission ? r.l.mission.where : ''}${missionFares(r.l, tier) ? ` <i>${missionFares(r.l, tier)}</i>` : ''}</span>`
      : `<small>${r.pname}</small>${r.l.name}${words}`;
    if (open) b.onclick = () => openMission(r.l); else b.disabled = true;
    if (next) townNext = b;
    (next ? box : later).appendChild(b);
  });
  if (later.children.length) box.appendChild(later);
  $('town').style.transform = 'translate(-50%,0)'; townCardUp = true; $('town').scrollTop = 0;
  if (townNext) townNext.focus({ preventScroll: true });
}
let townNext = null, townCardUp = false;
function closeTown() { $('town').style.transform = 'translate(-50%,105%)'; townCardUp = false; if (document.activeElement && $('town').contains(document.activeElement)) document.activeElement.blur(); }
$('t_close').onclick = closeTown;

function openMap() {
  startArt.off(); warmUp(); initAudio(); if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  for (const id of ['start', 'summary', 'mission']) $(id).style.display = 'none';
  $('map').style.display = 'flex'; drawWorld(); closeTown();
  S.mode = 'start';
}
let pendingLevel = null;
function openMission(lv) {
  pendingLevel = lv; $('map').style.display = 'none'; townCardUp = false;
  const t = towns().find(x => x.id === (lv.town || TOWN_OF(lv.id))); const pl = PLACES.find(p => p[0] === (lv.place || PLACE_OF[lv.id]));
  $('m_act').textContent = `${t ? t.name : ''} · ${pl ? pl[1] : ''} · tier ${t ? t.tier : lv.act}`; $('m_name').textContent = lv.name;
  $('m_fare').textContent = missionFares(lv, t ? t.tier : (lv.act || 1));
  $('m_lines').innerHTML = `<div>📍 ${lv.mission.where}</div><div>📦 ${lv.mission.carry}</div><div>👻 ${lv.mission.want}</div>`;
  // three words as a teaser, the new ones first (not met on a road already starred); the full list comes at the end of the ride
  const met = new Set(); for (const l of LEVELS) if (progress[l.id] > 0 && l.id !== lv.id && l.items) for (const i of l.items) if (i.nl) met.add(i.nl);
  const cand = lv.place === 'bonus' ? [] : lv.items.filter(i => i.w && i.nl && !/^\d+$/.test(i.w)).filter((v, i, a) => a.findIndex(x => x.nl === v.nl) === i);
  const fresh = cand.filter(i => !met.has(i.nl)), three = (fresh.length ? fresh : cand).slice(0, 3);
  $('m_words').innerHTML = three.length ? `<div style="color:var(--dim);font-size:11px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;text-align:center">${fresh.length ? 'New tonight' : 'Tonight'}</div><div class="wchips">`
    + three.map(i => `<div class="wchip"><span class="pic">${pictogram(i.nl)}</span><div><b>${i.nl}</b><span>${i.w}</span></div></div>`).join('') + '</div>' : '';
  $('mission').style.display = 'flex'; $('mission').scrollTop = 0;
}
// 'Fares here € 1,00 to € 2,90 · best 1284': every fare on this road, signposts and look forks included
function missionFares(lv, tier) {
  const fares = (lv.items || []).map(i => FARES.fareFor(i, tier)).filter(f => f > 0);
  if (!fares.length) return '';
  const lo = Math.min(...fares), hi = Math.max(...fares), best = scores[lv.id];
  return 'Fares here ' + (lo === hi ? FARES.fmtEuro(lo) + ' each' : FARES.fmtEuro(lo) + ' to ' + FARES.fmtEuro(hi)) + (best ? ' · best ' + best : '');
}
function start(lv) {
  startArt.off(); setL(lv || null);
  setLaneX((L && L.lanes === 2) ? LANES2 : LANES3);
  setSpeeds(L ? L.speed : BASE_SPEED, L ? L.maxSpeed : MAX_SPEED);
  for (const id of ['start', 'summary', 'mission', 'map']) $(id).style.display = 'none';
  S.wordPool = L ? L.items.map(i => i.nl).filter(Boolean) : [];
  setTownId(L ? (L.town || TOWN_OF(L.id)) : 'alblasserdam'); const qs = new URLSearchParams(location.search), qt = qs.get('town'); if (qt) setTownId(qt);
  setTownStyle(townStyleOf(townId));
  buildScenery(THEMES[qs.get('theme') || (L && L.theme) || 'polder'] || THEMES.polder);   // ?town= and ?theme= dress any level as another place, for looking at a town's art
  setRoadLook(LANE_X.length, theme);
  $('hud').classList.toggle('endless', !L);
  reset(); S.mode = 'intro'; S.introT = 0;
}
// the town's tier prices the rides; endless rides as tier 6
function fareTier() {
  if (!L) return 6;
  const t = towns().find(t => t.id === (L.town || TOWN_OF(L.id)));
  return t ? t.tier : (L.act || 1);
}
function reset() {
  for (const o of S.objs) if (o.mesh) scene.remove(o.mesh);
  Object.assign(S, { t: 0, dist: 0, speed: BASE, slow: 1, slowTarget: 1, lane: LANE_X.length === 2 ? 0 : 1, x: 0, lean: 0, lamp: L ? 85 : 70, souls: 0, streak: 0, wrongRow: 0, good: 0, bad: 0,
    objs: [], planCursor: 40, activeFork: null, forkZoom: 0, speedNorm: 0, mistakes: [], dieT: 0, stumble: 0, sentencePool: [], queue: L ? levelQueue(L, LANE_X.length) : [], finishPlanned: false, curv: 0, curvTarget: 0, curvNextAt: 60, grade: 0, delivered: 0, deliveriesTotal: L ? L.deliveries : 0, lampMin: 100,
    met: new Map(), tasksSeen: new Set(), goHints: 0, teachPlan: L && !taughtBefore() ? 3 : 0, taught: 0, lastWords: 0, held: false, wispEasy: !!L && fareTier() === 1,
    cents: 0, walletShown: 0, missed: 0, tips: 0, tikkie: 0, cleanRow: 0, tipN: 0, lastRefuse: '', riding: null, fareTier: fareTier(), score: 0, fxT: 0, paid: 0, walletLast: 0, tickT: -1 });
  $('wallet').textContent = '€ 0,00'; $('walletfx').textContent = ''; $('walletfx').className = ''; $('walletpill').classList.remove('shake');
  follower.visible = false; follower.userData.glow.intensity = 0; if (rackGhost) { bike.remove(rackGhost); setRackGhost(null); }
  camera.position.set(0, 22, 14); camera.lookAt(0, 0, -30); camera.fov = 60; camera.updateProjectionMatrix();
  hideCard(); toast.style.opacity = 0; $('vignette').style.opacity = 0; $('lanes').style.opacity = 0;
  plan();
}
// the first three forks of a player's first ride teach the move (nachtrit.taught is set once they are done)
function taughtBefore() { try { return localStorage.getItem('nachtrit.taught') === '1'; } catch (e) { return true; } }
let lampHinted = (() => { try { return localStorage.getItem('nachtrit.lamphint') === '1'; } catch (e) { return true; } })();
// pictograms for the mission card's three words: the game's own drawn pictograms (PICTO, the graffiti ones), painted once per word
const pictoCache = {};
function pictogram(nl) {
  const bare = String(nl).replace(/^(de|het|een)\s+/i, '').toLowerCase().trim(), key = PICTO[bare] ? bare : PICTO_ALIAS[bare];
  if (!key) return '<span style="color:var(--dim)">·</span>';
  if (!pictoCache[key]) { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); g.scale(0.5, 0.5); g.fillStyle = g.strokeStyle = '#ffd27a'; g.lineCap = 'round'; PICTO[key](g); pictoCache[key] = c.toDataURL(); }
  return `<img src="${pictoCache[key]}" width="32" height="32" alt="">`;
}
function die() {
  S.mode = 'dying'; S.dieT = 0; hideCard(); setFace('scream', 9);
  follower.visible = true; follower.position.set(0, 0, 11); follower.lookAt(0, 4, 0);
  speak('Je bent te laat.');
}

function showSummary(won) {
  S.mode = 'dead';
  $('s_souls').textContent = L ? `${S.delivered}/${S.deliveriesTotal}` : S.souls; $('s_dist').textContent = Math.round(S.dist) + ' m';
  $('s_good').textContent = S.good; $('s_bad').textContent = S.bad;
  let stars = 0;
  if (L && won) {
    const ratio = S.delivered / S.deliveriesTotal;
    const three = S.deliveriesTotal >= 16 ? 0.95 : 1;   // long levels allow one miss for three stars
    stars = ratio >= three && S.lampMin >= 40 ? 3 : ratio >= 0.83 ? 2 : ratio >= 0.66 ? 1 : 0;
    if (stars > (progress[L.id] || 0)) { progress[L.id] = stars; saveProgress(); }
  }
  $('sumtitle').textContent = !L ? 'IT HAS YOU.' : !won ? 'IT HAS YOU.' : stars ? 'DELIVERED.' : 'NOT ENOUGH.';
  $('stars').textContent = L && won ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '';
  $('sumline').textContent = !won ? (S.bad === 0 ? 'No mistakes. The lamp just ran out. Ride faster, collect the wisps.' : `${S.mistakes.length} mistake${S.mistakes.length === 1 ? '' : 's'} to practise.`)
    : stars ? (stars === 3 ? 'Every delivery, lamp never below half. The dead are pleased.' : (S.deliveriesTotal >= 16 ? 'Delivered. Three stars allow one miss and need a healthy lamp.' : 'Delivered. Three stars need every one right with a healthy lamp.')) : `You need ${Math.ceil(S.deliveriesTotal * 0.66)} of ${S.deliveriesTotal} right for a star. Stars open the next town.`;
  $('again').textContent = L && won && stars ? 'Next place' : 'Again';
  const wl = [...S.met.entries()];
  $('s_words').innerHTML = wl.length ? `<div style="color:var(--dim);font-size:11px;letter-spacing:.12em;text-transform:uppercase">Words tonight · ${wl.filter(w => w[1].ok).length} of ${wl.length} right</div>`
    + wl.map(([nl, w]) => `<span class="${w.ok ? 'ok' : 'no'}">${w.ok ? '✓' : '✗'}</span> <b>${nl}</b> ${w.en}`).join(' · ') : '';
  $('log').value = S.mistakes.map(m => `- ${today()} — ${m.said} → ${m.should} → [[${m.note}]]`).join('\n') || '(no mistakes)';
  // money: score, best per level (levels only when home, endless on every death), the wallet line
  S.score = S.delivered * 100 + S.cents / 10 + Math.round(clamp(S.lampMin, 0, 100));
  const sk = L ? String(L.id) : 'endless';
  if ((!L || won) && S.score > (scores[sk] || 0)) { scores[sk] = S.score; saveScores(); }
  $('s_wallet').textContent = FARES.fmtEuro(S.cents); $('s_score').textContent = S.score; $('s_best').textContent = scores[sk] || 0;
  const f = FARES.fmtEuro;
  $('s_money').innerHTML = `<div>Fares ${f(S.paid)} · tips ${f(S.tips)} · Tikkie − ${f(S.tikkie)} · missed ${f(S.missed)}</div>`
    + (S.riding ? `<div>Niet afgeleverd · ${f(S.riding.fare)}</div>` : '') + (L && !won ? '<div>Score counts when you get home.</div>' : '');
  $('summary').style.display = 'flex';
}
function levelDone() { S.mode = 'dying'; S.dieT = 10; showSummary(true); }
$('go').onclick = () => { initAudio(); if (!introSeen) { setIntroSeen(true); $('start').style.display = 'none'; showIntro(openMap); } else openMap(); };
$('replay').onclick = () => { $('start').style.display = 'none'; showIntro(openMap, null, true); }; $('tomap').onclick = openMap; $('endless').onclick = () => start(null);
$('m_go').onclick = () => { const lv = pendingLevel; $('mission').style.display = 'none'; showLevelIntro(lv, () => start(lv)); }; $('m_back').onclick = openMap;
$('again').onclick = () => {
  if (L && $('again').textContent === 'Next place') { const next = LEVELS.find(l => l.id === L.id + 1); if (next && !next.soon && L.id < 1000 && unlocked(next)) return openMission(next); return openMap(); }
  start(L);
};
$('copy').onclick = () => { navigator.clipboard?.writeText($('log').value); $('copy').textContent = 'Copied'; setTimeout(() => $('copy').textContent = 'Copy mistakes', 1500); };

function resolveFork(gate) {
  const { fork } = gate; gate.resolved = true; S.activeFork = null; S.slowTarget = 1; $('lanes').style.opacity = 0; hideCard();
  const post = gate.posts.find(p => p.lane === S.lane);
  const chosenIdx = post ? post.oi : -1;
  const ok = chosenIdx === fork.a;
  if (L && (fork.read || (fork.st && fork.st.forks.length === 1))) {   // the words of the ride, for the end card: words met, words right
    const k = fork.entry.nl, was = S.met.get(k); S.met.set(k, { en: fork.read ? fork.o[fork.a] : fork.entry.en, ok: ok && (!was || was.ok) });
  }
  if (gate.teach && ++S.taught >= 3) { try { localStorage.setItem('nachtrit.taught', '1'); } catch (e) {} }
  const rule = RULES[fork.r] || { name: fork.r, note: fork.r };
  if (ok) {
    S.good++; S.streak++; S.wrongRow = 0; setFace('smug', 1.6);
    S.lamp = clamp(S.lamp + refuelRight(S.streak) + (gate.goEarly ? TUNE.fast : 0), 0, 100); S.speed = clamp(S.speed + 1.6, BASE, MAXS);
    flash('#f6e7b0', 0.35); chime(true);
    if (fork.read) { S.souls++; S.delivered++; const tip = payFare(fork.fare, true); say(`<b>${fork.o[fork.a]}</b>`, 'good', whyLine(fork.w, paidLine(fork.fare, tip)), 3); speakSeq([fork.entry.nl, FARES.euroToWords(handed(fork.fare, tip) / 100), tip]); }
    else {
      fork.st.chosen.push(fork.o[fork.a]);
      const done = fork.idx === fork.st.forks.length - 1;
      if (done) { S.souls++; if (fork.st.wrong === 0) S.delivered++; hideCard(); const m = settleRide(fork); say(`<b>${fork.entry.nl}</b>`, 'good', whyLine(L ? fork.w : 'Delivered.', m.line), 3.2); speakSeq(m.voice); dropPassenger(); }
      else { say(`<b>${fork.o[fork.a]}</b>`, 'good', null, 1.6); speak(fork.o[fork.a], true); }
    }
  } else {
    S.bad++; S.streak = 0; S.wrongRow++; S.cleanRow = 0; setFace('ouch', 2.2);
    S.lamp = clamp(S.lamp - (L ? 14 : 22), 0, 100); S.speed = clamp(S.speed - 3, BASE, MAXS);
    flash('#a01010', 0.45); chime(false); S.stumble = 1;
    const saidTxt = chosenIdx >= 0 ? fork.o[chosenIdx] : '(geen keuze)';
    if (fork.read) {
      S.missed += fork.fare;
      say(`<s>${saidTxt}</s> → <b>${fork.o[fork.a]}</b>`, 'bad', whyLine(fork.w, 'Geen cent.'), 3.6);
      S.mistakes.push({ said: `"${fork.entry.nl}" read as "${saidTxt}"`, should: `"${fork.o[fork.a]}"`, note: rule.note });
    } else {
      const wrongSentence = assembled(fork.st, fork.idx, chosenIdx >= 0 ? saidTxt : '___').replace(' …', '');
      S.mistakes.push({ said: wrongSentence, should: fork.entry.nl, note: rule.note });
      fork.st.chosen.push(fork.o[fork.a]); // the sentence continues with the right word
      fork.st.wrong++; if (fork.st.lostAt < 0) fork.st.lostAt = fork.idx;
      const done = fork.idx === fork.st.forks.length - 1;
      if (done) { S.souls++; hideCard(); const m = settleRide(fork); say(`<s>${saidTxt}</s> → <b>${fork.o[fork.a]}</b>`, 'bad', whyLine(fork.w, m.line), 3.6); speakSeq(m.voice); dropPassenger(); }
      else say(`<s>${saidTxt}</s> → <b>${fork.o[fork.a]}</b>`, 'bad', fork.w, 3.6);
    }
    if (S.wrongRow >= 3) S.lamp = 0;
  }
  for (const p of gate.posts) p.mesh.userData.board.material.color.set(p.oi === fork.a ? 0x9fdc7a : 0x7a3a3a);
}
// ---------- fares ----------
const whyLine = (...parts) => parts.filter(Boolean).join(' · ');
// what the passenger names: the fare, or fare + the tip euro when the tip line is 'Klopt zo.' (said over the amount handed over)
const handed = (cents, tip) => cents + (tip && FARES.TIPS.some(t => t.handOver && t.nl === tip) ? 100 : 0);
function paidLine(cents, tip) {   // 'Alsjeblieft. Twee euro dertig.' plus the tip line
  const w = FARES.euroToWords(handed(cents, tip) / 100).replace(/^één/, 'eén');
  return w ? 'Alsjeblieft. ' + w.charAt(0).toUpperCase() + w.slice(1) + '.' + (tip ? ' ' + tip : '') : '';
}
// the last fork of a ride settles the money: full or part pay, or a refusal; returns the toast line and what is said
function settleRide(fork) {
  const st = fork.st, nl = fork.entry.nl; S.riding = null;
  const quiet = fork.entry.dehet || (L && L.id > 1000);   // de/het and bonus fares are not spoken: the next card comes too fast
  const pay = FARES.payCents(st.fare, st.wrong, st.forks.length);
  if (S.wrongRow >= 3) { S.missed += st.fare; return { line: '', voice: [nl] }; }   // the death on the next frame owns this moment
  if (pay > 0) {
    S.missed += st.fare - pay;
    const tip = payFare(pay, st.wrong === 0);
    return { line: paidLine(pay, tip), voice: quiet ? [nl] : [nl, FARES.euroToWords(handed(pay, tip) / 100), tip] };
  }
  const r = refuse(st);
  return { line: '', voice: quiet ? [nl] : [nl, r] };
}
// money in; every third clean ride in a row adds a tip; returns the tip line or ''
function payFare(cents, clean = true) {
  if (!(cents > 0)) return '';
  S.cents += cents; S.paid += cents;
  if (!clean || ++S.cleanRow % 3) return '';
  S.cents += 100; S.tips += 100;
  const later = FARES.TIPS.filter(t => !t.first && t.minTier <= S.fareTier);
  const t = S.tipN === 0 || !later.length ? (FARES.TIPS.find(x => x.first) || FARES.TIPS[0]) : later[(S.tipN - 1) % later.length];
  S.tipN++; walletFx('+ € 1,00', 'tip');
  return t ? t.nl : '';
}
// no pay: a dry line on the card, never the same one twice in a row
function refuse(st) {
  const pool = FARES.REFUSE.filter(r => r.minTier <= S.fareTier && S.fareTier <= (r.maxTier || 99) && r.nl !== S.lastRefuse);
  const r = pool.length ? pick(pool) : null;
  S.missed += st.fare;
  if (!r) return '';
  S.lastRefuse = r.nl;
  card.querySelector('.nl').textContent = st.entry.nl; card.querySelector('.fare').innerHTML = `<span class="no">${r.nl} <i>${r.en}</i></span>`; card.style.opacity = 1;
  const seq = cardSeq; setTimeout(() => { if (cardSeq === seq) hideCard(); }, 2400);
  return r.nl;
}
function walletFx(text, cls) { const fx = $('walletfx'); fx.textContent = text; fx.className = cls; S.fxT = 1.8; }
// a zombie's Tikkie: up to € 4,50 out of the wallet, never below zero
function payTikkie() {
  const taken = Math.min(S.cents, 450); S.cents -= taken; S.tikkie += taken; S.cleanRow = 0;
  if (!taken) return;   // an empty wallet loses nothing: the toast still asks for € 4,50, the pill stays put
  walletFx('− ' + FARES.fmtEuro(taken), 'lost');
  const p = $('walletpill'); p.classList.add('shake'); setTimeout(() => p.classList.remove('shake'), 400);
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
    if (!lampHinted && L && S.lamp < 50 && toastT <= 0) { lampHinted = true; try { localStorage.setItem('nachtrit.lamphint', '1'); } catch (e) {} say('The lamp is going.', 'bad', 'Ride through the lights to fill it.', 3.6); }
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
    if (cineBegin(n)) { const T = parseFloat(q.get('t')) || 0; for (let i = 0; i < Math.round(T * 60); i++) cineTick(1 / 60); cineFrozen = true; }
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



























export { CINE, cineBegin, cineEnd, cineShot, TOWN_OF, townOpen, towns };
