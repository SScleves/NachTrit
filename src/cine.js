// The cinematic intro: 3D shots staged in the game's own world. intro3d/shot-N.js registers window.NRCINE[N-1]; W is the
// handle a shot gets (the world's builders, stage, hide, cam, say, title), also window.NRW. cineBegin, cineTick and cineEnd run a
// shot and put everything back after it.
import { $, BASE_SPEED, clamp, LANES3, lerp, MAX_SPEED, pick, rnd, ROAD_W, smooth, THREE } from './engine.js?v=44';
import { NODEFX } from './render-nodes.js?v=44';
import { camera, lampLight, render, scene } from './render.js?v=44';
import { GlowMat, glowTex, M, Mat, TINT } from './materials.js?v=44';
import { KERB_W, setBehind, setRoadLook } from './road.js?v=44';
import { PG, PM } from './props.js?v=44';
import { kadd, kb, kbuild, KG, kit, ktube, PK } from './kit.js?v=44';
import { bikeRow, bins, crates, ducks, lamppost, moorings, setTownId, setTownStyle, townId, townStyleOf, windmill } from './furniture.js?v=44';
import { bench, bikeProp, boat, bollard, bridge, cheeseCart, church, drawbridge, house, reeds, tulipBox } from './houses.js?v=44';
import { backRow, canalBridge, flagNL, LANDMARK, terrace, tower, treeCard } from './backdrop.js?v=44';
import { buildScenery, scenery, theme, THEMES } from './scenery.js?v=44';
import { beam, bike, rider, setFace } from './rider.js?v=44';
import { labelTexture } from './signs.js?v=44';
import { ghostFigure } from './cast.js?v=44';
import { fence, wisp, zombie, zombieParts } from './zombies.js?v=44';
import { S, setL, setLaneX, setSpeeds } from './state.js?v=44';
import { hideCard } from './hud.js?v=44';
import './intro.js?v=44';   // keeps the order the game's code runs in
import { reset, update } from './main.js?v=44';   // later modules, through the hub

// ---------- the cinematic intro: 3D shots in the game's own world ----------
// intro3d/shot-N.js registers window.NRCINE[N-1] = { build(W), update(W, t, dt), dispose(W) }: a few seconds staged from the
// game's own builders, its camera and actors moved by update(); the intro's captions run over it in letterbox. A panel
// without a shot keeps its pixel painting. ?cine=N plays the intro from panel N; ?cine=N&t=S freezes shot N at S seconds.
const CINE = window.NRCINE = window.NRCINE || [];
let cineShot = null, cineT = 0, cineFrozen = false, cineTitleAt = Infinity, cineDy = 0;
function setCineFrozen(v) { cineFrozen = v; }   // ?cine=N&t=S holds a shot (an imported binding is read-only)
const cineProps = [], cineSays = [], cineHidden = [], _cineV = new THREE.Vector3();
const W = {
  THREE, NODE: NODEFX, scene, camera, rider, bike, beam, lampLight, render, ROAD_W, KERB_W,
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
  cineEnd(); cineShot = shot; cineT = 0; cineTitleAt = Infinity; rider.showDogs(!!shot.dogs);   // a shot that wants the dogs beside him says dogs: true
  try { shot.build(W); } catch (e) { console.error(`cine shot ${typeof i === 'object' ? 'card' : i + 1}: ${e && e.message}`); cineEnd(); return false; }
  $('intro').classList.add('cine'); document.body.classList.add('cine'); cineFrame(); return true;
}
function cineEnd() {
  if (cineShot && cineShot.dispose) try { cineShot.dispose(W); } catch (e) {}
  if (cineShot) rider.restore();   // whatever the shot did to him and did not undo itself
  for (const p of cineProps) { scene.remove(p); p.traverse(m => { if (m.userData.ownTex && m.material) { if (m.material.map) m.material.map.dispose(); m.material.dispose(); } }); }
  cineProps.length = 0; for (const s of cineSays) s.el.remove(); cineSays.length = 0;
  for (const o of cineHidden) { o.mesh.visible = true; o.cineHidden = false; } cineHidden.length = 0;
  $('cinetitle').style.opacity = 0; cineShot = null; cineFrozen = false; S.fogMul = 1; S.cineSpeed = 0; bike.visible = true; beam.visible = true; W.ride(0); bike.rotation.set(0, 0, 0);
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

export { CINE, cineBegin, cineEnd, cineShot, cineTick, setCineFrozen };
