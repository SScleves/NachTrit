// The rider on his omafiets: the bike group (primitives first, the rider model in their place once it loads), the beam, the
// two dogs that run beside him, riderTick (the wheels, the pedalling legs, the dogs), his face canvas, the passenger on the
// rack, and the follower that shows at the end.
import { clamp, ROAD_W, THREE } from './engine.js?v=44';
import { scene } from './render.js?v=44';
import { GlowMat, glowTex, M, Mat, TINT } from './materials.js?v=44';
import { PM } from './props.js?v=44';
import { kadd, kb, kbuild, KG, kit, ktube, MODELS } from './kit.js?v=44';
import { modelClone } from './models.js?v=44';
import { add, ghostFigure, S } from './main.js?v=44';   // later modules, through the hub

// ---------- the bike ----------
// Santi's retro-future omafiets (concept-art/G-omafiets-retro-future.png): a black frame, a sprung leather saddle, a round warm
// headlamp, amber light strips on the chain case, fork and pedals, a red light bar on the rack. Every glow is a self-lit
// strip with an additive halo and the bloom pass: no light is added. The wheels and their spin are as they were.
const bike = new THREE.Group();
{
  const steel = Mat({ color: 0x3b4a56 });
  const frameMat = Mat({ color: 0x16181e });
  const leather = Mat({ color: 0x5a3420 }, TINT.warm);
  const NEON = new THREE.MeshBasicMaterial({ color: 0xffe2a8 });                                      // the strips' hot cores
  const NEON_HALO = GlowMat(glowTex, 0xff9a2e, 0.6, false, { side: THREE.DoubleSide });              // their amber spill
  const TAIL = new THREE.MeshBasicMaterial({ color: 0xffb0a0 }), TAIL_HALO = GlowMat(glowTex, 0xff2a14, 0.95, true);
  const HEAD_HALO = GlowMat(glowTex, 0xffcf86, 0.7, true);
  const tube = (a, b, r = 0.035) => { const d = new THREE.Vector3().subVectors(b, a); const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 6), frameMat); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); return m; };
  const P = (x, y, z) => new THREE.Vector3(x, y, z);
  const rear = P(0, 0.34, 0.62), front = P(0, 0.34, -0.62), crank = P(0, 0.36, 0.08), seat = P(0, 0.98, 0.3), head = P(0, 0.95, -0.5);
  [tube(rear, seat), tube(rear, crank), tube(crank, head, 0.03), tube(seat, head, 0.03), tube(head, front), tube(seat, P(0, 1.02, 0.3), 0.02)].forEach(t => bike.add(t));
  const wg = new THREE.TorusGeometry(0.34, 0.035, 8, 22);
  const w1 = new THREE.Mesh(wg, steel); w1.position.copy(front); bike.add(w1);
  const w2 = new THREE.Mesh(wg, steel); w2.position.copy(rear); bike.add(w2);
  bike.userData.wheels = [w1, w2];
  for (const w of [w1, w2]) { const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 8), steel); hub.rotation.z = Math.PI / 2; hub.position.copy(w.position); bike.add(hub); for (let i = 0; i < 6; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.62, 0.01), steel); sp.position.copy(w.position); sp.rotation.x = i * Math.PI / 6; w.add(sp); sp.position.set(0, 0, 0); } }
  for (const w of [w1, w2]) { const mg = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.03, 6, 16, Math.PI * 0.9), M.dark); mg.position.copy(w.position); mg.rotation.y = Math.PI / 2; mg.rotation.z = Math.PI * 0.05; bike.add(mg); }
  const bars = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 6, 12, Math.PI), steel); bars.position.set(0, 1.0, -0.5); bars.rotation.x = Math.PI / 2; bars.rotation.z = Math.PI; bike.add(bars);
  // the static parts go through the kit: one mesh per material
  const k = kit(), springG = new THREE.TorusGeometry(0.022, 0.006, 4, 10);
  kb(k, frameMat, 0.06, 0.34, 0.35, 0.04, 0.13, 0.62);                                                  // the chain case, crank to rear axle
  kb(k, NEON, 0.085, 0.35, 0.36, 0.012, 0.018, 0.44); kadd(k, KG.plane, NEON_HALO, 0.092, 0.35, 0.36, 0, Math.PI / 2, 0, 0.62, 0.16);
  ktube(k, NEON, 0.035, 0.86, -0.53, 0.035, 0.46, -0.6, 0.008);                                          // down the fork
  kb(k, leather, 0, 1.03, 0.3, 0.17, 0.06, 0.27);                                                        // the saddle, leather, on springs
  for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) kadd(k, springG, steel, sx * 0.05, 0.99 - i * 0.017, 0.4, Math.PI / 2, 0, 0);
  kb(k, NEON, 0, 1.0, 0.44, 0.1, 0.01, 0.012); kadd(k, KG.plane, NEON_HALO, 0, 1.0, 0.452, 0, 0, 0, 0.2, 0.07);
  for (const sx of [-1, 1]) {
    kadd(k, KG.cyl, leather, sx * 0.3, 1.0, -0.48, Math.PI / 2, 0, 0, 0.055, 0.12, 0.055);               // grips
    kb(k, frameMat, sx * 0.15, 0.4, 0.05, 0.1, 0.025, 0.07);                                            // pedals under his feet, a strip on each
    kb(k, NEON, sx * 0.15, 0.4, 0.09, 0.08, 0.012, 0.012); kadd(k, KG.plane, NEON_HALO, sx * 0.15, 0.4, 0.096, 0, 0, 0, 0.2, 0.07);
    kb(k, frameMat, sx * 0.08, 0.74, 0.74, 0.02, 0.02, 0.6);                                            // the rear rack
    ktube(k, frameMat, sx * 0.08, 0.74, 0.98, sx * 0.05, 0.36, 0.64, 0.012);
  }
  kb(k, frameMat, 0, 0.74, 1.03, 0.18, 0.02, 0.02);
  kb(k, frameMat, 0, 0.88, -0.74, 0.03, 0.03, 0.14);                                                     // the headlamp bracket
  kadd(k, KG.cyl, frameMat, 0, 0.88, -0.82, Math.PI / 2, 0, 0, 0.17, 0.11, 0.17);                        // and its round housing
  kbuild(k, bike); springG.dispose();
  const tail = new THREE.Mesh(KG.box, TAIL); tail.scale.set(0.05, 0.16, 0.025); tail.position.set(0, 0.84, 1.04); bike.add(tail);   // the red light bar
  const tailGlow = new THREE.Sprite(TAIL_HALO); tailGlow.scale.set(0.5, 0.7, 1); tailGlow.position.set(0, 0.84, 1.07); bike.add(tailGlow);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.5, 4, 8), M.shirt); torso.position.set(0, 1.42, 0.2); torso.rotation.x = -0.12; bike.add(torso);
  const headG = new THREE.Group(); headG.position.set(0, 1.92, 0.1); bike.add(headG); bike.userData.head = headG;
  const headM = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), Mat({ color: 0xd9b48c })); headG.add(headM);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), M.rider); hair.position.y = 0.03; headG.add(hair);
  const faceC = document.createElement('canvas'); faceC.width = faceC.height = 128; const faceTex = new THREE.CanvasTexture(faceC); faceTex.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.28), new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, depthTest: false })); face.position.set(0, -0.01, -0.17); face.rotation.y = Math.PI; face.renderOrder = 20; headG.add(face);
  bike.userData.faceC = faceC; bike.userData.faceTex = faceTex;
  for (const sx of [-1, 1]) { const arm = tube(P(sx * 0.2, 1.6, 0.15), P(sx * 0.26, 1.02, -0.45), 0.045); arm.material = M.shirt; bike.add(arm); const leg = tube(P(sx * 0.1, 1.05, 0.28), P(sx * 0.12, 0.42, 0.05), 0.055); leg.material = M.rider; bike.add(leg); }
  // the headlamp's lens: its warmth follows the lamp meter (update() sets the colour), a soft halo round it
  const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.068, 16), new THREE.MeshBasicMaterial({ color: 0xffd28a })); lamp.position.set(0, 0.88, -0.877); lamp.rotation.y = Math.PI; bike.add(lamp);
  const lampGlow = new THREE.Sprite(HEAD_HALO); lampGlow.scale.set(0.42, 0.42, 1); lampGlow.position.set(0, 0.88, -0.9); bike.add(lampGlow);
  bike.userData.lampMesh = lamp; bike.userData.lampGlow = lampGlow;
  // what the model replaces when it arrives (riderModel), and the materials it is drawn with
  bike.userData.prim = bike.children.filter(c => ![headG, lamp, lampGlow, tail, tailGlow].includes(c)).concat([headM, hair]);
  bike.userData.mats = { frame: frameMat, steel, leather, neon: NEON, tyre: M.dark, skin: headM.material, hair: M.rider, jacket: M.shirt };
}
// the beam fades in over its first metres and thins out at the far end: without the fade its narrow start drew two pale strips beside the rider's head
const beamFade = (() => { const c = document.createElement('canvas'); c.width = 4; c.height = 64; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, '#000'); gr.addColorStop(0.12, '#000'); gr.addColorStop(0.4, '#fff'); gr.addColorStop(1, '#555'); g.fillStyle = gr; g.fillRect(0, 0, 4, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const beam = new THREE.Mesh(new THREE.ConeGeometry(2.4, 26, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe2b4, map: beamFade, transparent: true, opacity: 0.05, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide }));
beam.rotation.x = Math.PI / 2; beam.position.set(0, 0.9, -13.8); bike.add(beam);
scene.add(bike);

// the rider on his omafiets: the model takes the place of the primitive body and bike; the lamp lens, tail light, halos, beam and
// face canvas stay the game's own. The legs follow the pedals (two-bone IK in the y-z plane), and two dogs run beside him
const dogs = new THREE.Group(); dogs.visible = false; scene.add(dogs);
function riderModel() {
  const u = bike.userData, R = MODELS.rider.scene, md = modelClone(R, u.mats), head = md.getObjectByName('head');
  for (const c of u.prim) c.visible = false;
  for (const c of head.children.slice()) u.head.add(c);   // the head node sits where the face canvas's head is
  head.parent.remove(head); bike.add(md);
  const n = s => md.getObjectByName(s);
  u.model = { wf: n('wheel_f'), wr: n('wheel_r'), crank: n('crank'), pL: n('pedal_L'), pR: n('pedal_R'), legs: ['R', 'L'].map(s => [n('thigh_' + s), n('shin_' + s), n('foot_' + s)]), dogs: [] };
  u.model.wf.rotation.y = u.model.wr.rotation.y = Math.PI / 2;   // the wheels stand across the bike (see riderTick)
  if (!MODELS.dog) return;
  const dark = { dog: Mat({ color: 0x24201d }), dogDark: Mat({ color: 0x141210 }), dogPale: Mat({ color: 0x9a7a52 }) };
  for (const [x, z, mats, ph] of [[-0.85, -0.1, null, 0], [0.85, 0.45, dark, 2.1]]) {
    const d = modelClone(MODELS.dog.scene, mats), m = s => d.getObjectByName(s); d.position.set(x, 0, z); dogs.add(d);
    u.model.dogs.push({ d, body: m('body'), tail: m('tail'), legs: [m('leg_fl'), m('leg_fr'), m('leg_bl'), m('leg_br')], ph, z });
  }
  dogs.visible = true;
}
const RL1 = 0.46, RL2 = 0.44;
function legIK(L, a, s) {   // ankle onto the pedal at crank angle a; s: 1 right pedal, -1 left
  const ty = 0.36 - 0.17 * s * Math.cos(a) + 0.07, tz = 0.08 - 0.17 * s * Math.sin(a) + 0.01, dy = ty - 1.07, dz = tz - 0.26;
  const d = clamp(Math.hypot(dy, dz), 0.3, (RL1 + RL2) * 0.985), base = Math.atan2(-dz, -dy);
  const hip = Math.acos(clamp((RL1 * RL1 + d * d - RL2 * RL2) / (2 * RL1 * d), -1, 1)), knee = Math.acos(clamp((RL1 * RL1 + RL2 * RL2 - d * d) / (2 * RL1 * RL2), -1, 1));
  L[0].rotation.x = base + hip; L[1].rotation.x = -(Math.PI - knee); L[2].rotation.x = -(L[0].rotation.x + L[1].rotation.x) + 0.12;
}
let cineDogs = true;   // the dogs run beside him; a shot shows them only when it says dogs: true (shots 8 and 14, the title, the level cards)
let _dogT = 0;
function riderTick(dw, dt) {   // dw: how far the wheels turn this frame
  const md = bike.userData.model;
  if (!md) { const W = bike.userData.wheels; for (let i = 0; i < W.length; i++) W[i].rotation.x += dw; return; }
  md.wf.rotation.x += dw; md.wr.rotation.x += dw;                        // Santi's call (11 Nov): the wheels face the eye and tumble end over end, as the first bike's did. It makes no sense and stays
  const c = md.crank; c.rotation.x -= Math.min(dw / 2.4, 11 * dt); md.pL.rotation.x = md.pR.rotation.x = -c.rotation.x;
  legIK(md.legs[0], c.rotation.x, 1); legIK(md.legs[1], c.rotation.x, -1);
  // the dogs: they keep to his side with a little lag, gallop as fast as he rides, drift forward and back
  dogs.visible = bike.visible && cineDogs; dogs.position.x += (bike.position.x - dogs.position.x) * Math.min(1, dt * 5); dogs.position.z = bike.position.z; dogs.rotation.x = bike.rotation.x;
  _dogT += dt;
  for (let i = 0; i < md.dogs.length; i++) {   // index loops: nothing allocated per frame
    const D = md.dogs[i]; D.ph += dw * 0.42 + dt * 0.4; const p = D.ph, run = Math.min(1, dw / Math.max(dt, 1e-4) / 12);
    D.d.position.z = D.z + Math.sin(_dogT * 0.37 + D.z * 5) * 0.35;
    D.legs[0].rotation.x = Math.sin(p) * 0.75 * run; D.legs[1].rotation.x = Math.sin(p + 0.35) * 0.75 * run;
    D.legs[2].rotation.x = Math.sin(p + Math.PI) * 0.65 * run; D.legs[3].rotation.x = Math.sin(p + Math.PI + 0.35) * 0.65 * run;
    D.body.position.y = 0.46 + Math.abs(Math.sin(p)) * 0.045 * run; D.body.rotation.x = Math.sin(p) * 0.07 * run;
    D.tail.rotation.z = Math.sin(_dogT * 9 + D.z * 3) * 0.45;
  }
}

// expressions: deadpan by default, he looks back at you when something happens
let faceState = { name: '', until: 0, look: 0 };
function setFaceState(f) { faceState = f; }
function drawFace(name) {
  const c = bike.userData.faceC, g = c.getContext('2d'); g.clearRect(0, 0, 128, 128);
  g.fillStyle = '#c9a279'; g.beginPath(); g.arc(64, 68, 58, 0, 7); g.fill();   // an unlit skin disc so the face reads in the dark
  g.fillStyle = '#1a1416'; g.lineCap = 'round'; g.strokeStyle = '#1a1416'; g.lineWidth = 11;
  const eye = (x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  if (name === 'ouch') {
    g.beginPath(); g.moveTo(22, 44); g.lineTo(54, 60); g.moveTo(106, 44); g.lineTo(74, 60); g.stroke();
    g.beginPath(); g.moveTo(34, 100); g.quadraticCurveTo(64, 78, 94, 100); g.stroke();
    g.fillStyle = '#b8282a'; g.beginPath(); g.arc(64, 112, 10, 0, 7); g.fill();
  } else if (name === 'smug') {
    eye(40, 58, 10); eye(88, 58, 10);
    g.beginPath(); g.moveTo(20, 40); g.lineTo(56, 32); g.moveTo(72, 42); g.lineTo(108, 46); g.stroke();
    g.beginPath(); g.moveTo(38, 90); g.quadraticCurveTo(70, 116, 100, 86); g.stroke();
  } else if (name === 'worry') {
    eye(40, 60, 15); eye(88, 60, 15); g.fillStyle = '#fff'; eye(45, 55, 5); eye(93, 55, 5); g.fillStyle = '#1a1416';
    g.beginPath(); g.moveTo(16, 42); g.lineTo(56, 30); g.moveTo(112, 42); g.lineTo(72, 30); g.stroke();
    g.beginPath(); g.arc(64, 100, 10, 0, 7); g.fill();
  } else if (name === 'scream') {
    eye(40, 54, 16); eye(88, 54, 16); g.beginPath(); g.ellipse(64, 100, 16, 22, 0, 0, 7); g.fill();
  } else {
    eye(40, 60, 10); eye(88, 60, 10);
    g.beginPath(); g.moveTo(22, 42); g.lineTo(58, 42); g.moveTo(70, 42); g.lineTo(106, 42); g.stroke();
    g.beginPath(); g.moveTo(40, 96); g.lineTo(88, 96); g.stroke();
  }
  bike.userData.faceTex.needsUpdate = true;
}
function setFace(name, secs, lookBack = true) { faceState = { name, until: S.t + secs, look: lookBack ? 1 : 0 }; drawFace(name); }
drawFace('deadpan');

// the passenger on the achterop (back rack), Dutch style, sitting sideways
let rackGhost = null;
function setRackGhost(g) { rackGhost = g; }
function mountPassenger(variant, coat) {
  if (rackGhost) bike.remove(rackGhost);
  rackGhost = ghostFigure(true, variant, true, coat); rackGhost.scale.setScalar(0.6); rackGhost.position.set(0.1, 0.22, 0.78); rackGhost.rotation.y = Math.PI / 2; rackGhost.traverse(m => { if (m.material && m.material.transparent) m.material.opacity = 0.8; }); bike.add(rackGhost);
}
function dropPassenger() {
  if (!rackGhost) return; const v = rackGhost.userData.variant, c = rackGhost.userData.coat; bike.remove(rackGhost); rackGhost = null;
  const g = ghostFigure(true, v, false, c); g.scale.setScalar(0.9); const side = Math.random() < 0.5 ? -1 : 1;
  add(g, S.dist + 2, null, 'dropped', { bx: side * (ROAD_W / 2 + 1.2), born: S.t });
}

// the follower, only shown at the end
const follower = new THREE.Group();
{
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.9, 4.2, 7), M.shade);
  body.position.y = 2.1; follower.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), M.shade); head.position.y = 4.4; follower.add(head);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), M.eye); e.position.set(s * 0.14, 4.45, -0.35); follower.add(e); }
  const glow = new THREE.PointLight(0xff2010, 0, 12); glow.position.y = 4.4; follower.add(glow); follower.userData.glow = glow;
}
follower.visible = false; scene.add(follower);

// ---------- the rider as a shot poses him ----------
// W.rider: what an intro shot (and later the ending) may do to him. The shots use only this, never bike.children or
// bike.userData, so the bike, the model and the body can change without breaking a shot. restore() undoes all of it; cineEnd
// calls it after every shot's own dispose.
const OWN = new Set(bike.children);   // the bike's own pieces as built above; the model, a passenger and a shot's props come later
const posed = { hidden: [], torso: null, torsoWas: false, limbs: null, coat: null, coated: [], bikeOff: [] };
const isHim = c => c === bike.userData.head || (c.isMesh && (c.material === M.shirt || c.material === M.rider));
function riderParts() {   // { him, bike }: the game's own pieces, the primitives and (once it has loaded) the model's nodes
  const md = bike.userData.model && bike.userData.model.wf.parent, him = [], bk = [];
  for (const c of bike.children) {
    if (c === md) { for (const n of md.children) (n.name === 'body' || n.name.startsWith('thigh_') ? him : bk).push(n); continue; }
    if (OWN.has(c)) (isHim(c) ? him : bk).push(c);
  }
  return { him, bike: bk };
}
function hideAllBut(keep) { for (const ch of bike.children) if (!keep.includes(ch) && ch.visible) { ch.visible = false; posed.hidden.push(ch); } }
function offBike(o, limbsOf) {   // the seated and standing poses: the bike and his riding limbs hidden, his torso and head shown, limbs built
  rider.pose('ride');
  let torso = null;
  for (const ch of bike.children) if (ch.isMesh && (ch.material === M.shirt || ch.material === posed.coat) && ch.geometry && ch.geometry.type === 'CapsuleGeometry') torso = ch;
  hideAllBut([torso, bike.userData.head]);
  if (torso) { posed.torso = torso; posed.torsoWas = torso.visible; torso.visible = true; }   // the rider model hides the game's own torso: these poses need it back
  const k = kit(); limbsOf(k, o.floor == null ? 0 : o.floor, posed.coat || M.shirt, o.skin || bike.userData.mats.skin);
  posed.limbs = kbuild(k); bike.add(posed.limbs);
}
const rider = {
  obj: bike,                          // the group: where he is, what a speech bubble follows, what a shot's rig holds
  head: bike.userData.head,           // the look target: turn it (rotation.order 'YXZ' turns and then tilts); restore() squares it
  lens: bike.userData.lampMesh.position, halo: bike.userData.lampGlow.position,   // where the headlamp's lens and halo sit on the bike (read only)
  // 'ride': on the bike, as the game has him. 'seated': off the bike, sitting: the bike, its lamp and his riding arms and legs
  // hidden, his torso and head kept, legs bent down to o.floor (y in the bike's frame) and hands in his lap (o.skin: their
  // material). 'standing': off the bike, standing on o.floor (default 0), arms down. 'hidden': nothing of him or the bike shows,
  // but he stays where the game keeps him and his lamp still lights (W.stage({ rider: false }) puts that out as well).
  pose(name, o = {}) {
    for (const ch of posed.hidden) ch.visible = true; posed.hidden.length = 0;
    if (posed.torso) { posed.torso.visible = posed.torsoWas; posed.torso = null; }
    if (posed.limbs) { bike.remove(posed.limbs); posed.limbs.traverse(m => { if (m.isMesh && m.geometry) m.geometry.dispose(); }); posed.limbs = null; }
    if (name === 'hidden') hideAllBut([]);
    else if (name === 'seated') offBike(o, (k, fy, shirt, skin) => {
      const legs = M.rider;
      for (const s of [-1, 1]) {   // s = 1 is his right (the bike's plus x)
        const hip = [s * 0.1, 1.04, 0.24], knee = [s * 0.13, 1.05, -0.25], ankle = [s * 0.15, fy + 0.07, -0.31];
        ktube(k, legs, ...hip, ...knee, 0.068); kadd(k, KG.ball, legs, ...knee, 0, 0, 0, 0.14, 0.14, 0.14);
        ktube(k, legs, ...knee, ...ankle, 0.058); kb(k, PM.pole, s * 0.15, fy + 0.03, -0.37, 0.11, 0.08, 0.25);
      }
      // his hands lie in his lap
      for (const s of [-1, 1]) {
        const sh = [s * 0.22, 1.6, 0.18], el = [s * 0.3, 1.22, 0.06], wr = [s * 0.13, 1.1, -0.17];
        ktube(k, shirt, ...sh, ...el, 0.052); kadd(k, KG.ball, shirt, ...el, 0, 0, 0, 0.11, 0.11, 0.11);
        ktube(k, shirt, ...el, ...wr, 0.048);
        kadd(k, KG.ball, skin, wr[0], wr[1] - 0.01, wr[2] - 0.05, 0, 0, 0, 0.09, 0.06, 0.12);
      }
    });
    else if (name === 'standing') offBike(o, (k, fy, shirt, skin) => {
      const legs = M.rider;
      for (const s of [-1, 1]) {   // straight down from the hips the saddle puts him at, feet flat on the floor
        const hip = [s * 0.1, 1.04, 0.24], knee = [s * 0.11, fy + 0.55, 0.22], ankle = [s * 0.11, fy + 0.07, 0.2];
        ktube(k, legs, ...hip, ...knee, 0.068); kadd(k, KG.ball, legs, ...knee, 0, 0, 0, 0.13, 0.13, 0.13);
        ktube(k, legs, ...knee, ...ankle, 0.058); kb(k, PM.pole, s * 0.11, fy + 0.03, 0.14, 0.11, 0.08, 0.25);
        const sh = [s * 0.22, 1.6, 0.18], el = [s * 0.27, 1.3, 0.2], wr = [s * 0.28, 1.04, 0.16];   // arms hanging at his sides
        ktube(k, shirt, ...sh, ...el, 0.052); kadd(k, KG.ball, shirt, ...el, 0, 0, 0, 0.11, 0.11, 0.11);
        ktube(k, shirt, ...el, ...wr, 0.048);
        kadd(k, KG.ball, skin, wr[0], wr[1] - 0.05, wr[2], 0, 0, 0, 0.08, 0.12, 0.06);
      }
    });
  },
  show(on) { bike.visible = on; },    // all of him and the bike; while he is not shown the game puts his lamp's light out
  showBike(on) {                      // the bike with its lamp lens, halo, tail light and beam; not him
    for (const c of posed.bikeOff) c.visible = true; posed.bikeOff.length = 0;
    if (!on) for (const c of riderParts().bike) if (c.visible) { c.visible = false; posed.bikeOff.push(c); }
  },
  showLamp(on) { bike.userData.lampMesh.visible = bike.userData.lampGlow.visible = on; },   // the headlamp's lens and halo (not its light)
  showDogs(on) { cineDogs = on; },    // the two dogs beside him; they show only while he is shown too
  coat(mat) {                         // his coat in another material (a shot's own self-lit copy); null gives the game's back
    for (const m of posed.coated) m.material = M.shirt; posed.coated.length = 0; posed.coat = mat || null;
    if (mat) bike.traverse(m => { if (m.isMesh && m.material === M.shirt) { posed.coated.push(m); m.material = mat; } });
  },
  restore() {
    rider.showBike(true); rider.pose('ride'); rider.coat(null); rider.showLamp(true); rider.showDogs(true); rider.show(true); beam.visible = true;
    rider.head.rotation.set(0, 0, 0); rider.head.rotation.order = 'XYZ';
  },
};

export { beam, bike, dogs, drawFace, dropPassenger, faceState, follower, mountPassenger, rackGhost, rider, riderModel, riderTick, setFace,
  setFaceState, setRackGhost };
