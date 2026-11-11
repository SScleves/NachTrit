// Street furniture, each piece one merged kit (parked bikes, bakfiets, bins, moorings, ducks, signs, the windmill, trees,
// fences, lamp posts), the house style per town, and a town's own look: towns3d/<id>.js registers window.NRTOWNS3D[id], T3()
// reads the current town's, and townId is the town the world is dressed as.
import { pick, rnd, THREE } from './engine.js?v=38';
import { M } from './materials.js?v=38';
import { LAMP_CONE_MAT, LAMP_HALO_MAT, LAMP_POOL_MAT, LAMP_STREAK_MAT, PG, PM } from './props.js?v=38';
import { kadd, kat, kb, kBike, kbuild, kCrate, KG, kit, ktube, MODELS, PK } from './kit.js?v=38';
import { kModel, townKit, windmillModel } from './main.js?v=38';   // later modules, through the hub

// ---------- street furniture: each one a single merged kit ----------
function bikeRow() {   // bikes chained to a railing at the kerb; one of them sometimes lies on the ground
  const k = kit(), n = 3 + Math.floor(Math.random() * 3), mats = [pick(PK.bikes), pick(PK.bikes)];
  for (const z of [-n * 0.55 - 0.2, 0, n * 0.55 + 0.2]) kb(k, PM.pole, 0.45, 0.45, z, 0.05, 0.9, 0.05);
  kb(k, PM.pole, 0.45, 0.86, 0, 0.04, 0.04, n * 1.1 + 0.4);
  const fallen = Math.random() < 0.25 ? Math.floor(Math.random() * n) : -1;
  for (let i = 0; i < n; i++) {
    const z = -n * 0.55 + 0.55 + i * 1.1;
    if (i === fallen) kat(k, -0.5, 0.03, z, rnd(0.2, 0.6), 1.5); else kat(k, 0.08, 0, z, 0.32 + rnd(-0.08, 0.08), -0.12);
    kBike(k, mats[i % 2], false, Math.random() < 0.35);
  }
  const g = kbuild(k); g.userData.faceRoad = true; return g;
}
function bakfiets() { const k = kit(); kat(k, 0, 0, 0, rnd(-0.2, 0.2), -0.05); kBike(k, pick(PK.bikes), true); if (Math.random() < 0.5) { kat(k, 0, 0, 0, 0, 0); kb(k, PK.kliko[0], 0, 0.82, -0.82, 0.62, 0.06, 0.76); } const g = kbuild(k); g.userData.faceRoad = true; return g; }
function bins() {   // the street bin from the sheet on its post, and a kliko or two put out for the morning
  const k = kit();
  kb(k, PM.pole, 0, 0.35, 0, 0.08, 0.7, 0.08); kadd(k, KG.cyl, PK.kliko[1], 0, 0.85, 0, 0, 0, 0, 0.5, 0.6, 0.5); kadd(k, KG.cyl, PM.pole, 0, 1.18, 0, 0, 0, 0, 0.56, 0.06, 0.56); kb(k, PM.pole, -0.2, 0.92, 0, 0.12, 0.16, 0.2);
  const n = Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) { const z = 0.75 + i * 0.75, m = pick(PK.kliko), ry = rnd(-0.2, 0.2); kb(k, m, 0.4, 0.52, z, 0.62, 0.95, 0.66, 0, ry, 0); kb(k, PM.pole, 0.4, 1.02, z, 0.68, 0.06, 0.72, 0, ry, 0.05); kadd(k, KG.cyl, PM.pole, 0.7, 0.08, z, Math.PI / 2, 0, 0, 0.16, 0.7, 0.16); }
  const g = kbuild(k); g.userData.faceRoad = true; return g;
}
function crates() {   // a stack of crates outside a shop: oranges, tulips, cheese, or empty
  const k = kit(), fills = [PM.orange, PM.tulip, PM.cheese, null];
  const n = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) kCrate(k, rnd(-0.05, 0.05), 0, i * 0.6 - (n - 1) * 0.3, rnd(-0.15, 0.15), pick(fills));
  if (Math.random() < 0.6) kCrate(k, 0, 0.4, (Math.floor(Math.random() * n) - (n - 1) / 2) * 0.6, rnd(-0.3, 0.3), Math.random() < 0.5 ? PM.orange : null);
  const g = kbuild(k); g.userData.faceRoad = true; return g;
}
function moorings() {   // mooring posts in a row at the canal edge, a rope sagging between two of them
  const k = kit(), n = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) { const z = i * 1.8 - n * 0.9, h = rnd(1.8, 2.4); kadd(k, KG.cyl, M.wood, rnd(-0.2, 0.2), h / 2 - 0.7, z, 0, 0, rnd(-0.06, 0.06), 0.26, h, 0.26); kadd(k, KG.cyl, PM.pole, 0, h - 0.68, z, 0, 0, 0, 0.3, 0.06, 0.3); }
  ktube(k, PK.rope, 0, 0.9, -n * 0.9, 0, 0.6, -n * 0.9 + 0.9, 0.025); ktube(k, PK.rope, 0, 0.6, -n * 0.9 + 0.9, 0, 0.9, -n * 0.9 + 1.8, 0.025);
  return kbuild(k);
}
function ducks() {   // white ducks on the black water, eyes glowing
  const k = kit(), n = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    kat(k, rnd(-1.5, 1.5), 0, rnd(-2, 2), rnd(0, 6.28), 0);
    kadd(k, KG.ball, PK.duck, 0, 0.1, 0, 0, 0, 0, 0.42, 0.3, 0.62); kb(k, PK.duck, 0, 0.2, 0.3, 0.12, 0.1, 0.14, -0.6, 0, 0);
    kadd(k, KG.ball, PK.duck, 0, 0.38, -0.24, 0, 0, 0, 0.22, 0.24, 0.22); kb(k, PM.orange, 0, 0.36, -0.4, 0.09, 0.04, 0.14);
    for (const sx of [-1, 1]) kadd(k, KG.ball, PM.eyeGlow, sx * 0.08, 0.42, -0.31, 0, 0, 0, 0.045, 0.045, 0.045);
  }
  const g = kbuild(k); g.scale.setScalar(1.3); return g;
}
function bikeLaneSign() { const k = kit(); kb(k, PM.pole, 0, 1.1, 0, 0.07, 2.2, 0.07); kadd(k, KG.disc, PK.bikeSign, 0, 2.3, 0.045); kadd(k, KG.disc, PK.bikeSign, 0, 2.3, -0.045, 0, Math.PI, 0); return kbuild(k); }
function windmill() {
  if (MODELS.windmill) return windmillModel();
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.0, 7, 8), M.mill); body.position.y = 3.5; g.add(body);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.6, 8), M.dark); cap.position.y = 7.6; g.add(cap);
  const blades = new THREE.Group(); blades.position.set(0, 6.6, 1.7);
  for (let i = 0; i < 4; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5.5, 0.12), M.wood);
    b.position.y = 2.6; const p = new THREE.Group(); p.add(b); p.rotation.z = i * Math.PI / 2; blades.add(p);
  }
  g.add(blades); g.userData.blades = blades; g.userData.spin = rnd(0.15, 0.4) * (Math.random() < 0.5 ? 1 : -1);
  return g;
}
function deadTree() {
  const g = new THREE.Group();
  const h = rnd(3, 5);
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, h, 5), M.dark); t.position.y = h / 2; g.add(t);
  for (let i = 0; i < 3; i++) {
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, rnd(1.2, 2.2), 4), M.dark);
    br.position.set(0, rnd(1.8, 3.5), 0); br.rotation.z = rnd(0.5, 1.2) * (i % 2 ? 1 : -1); br.rotation.y = rnd(0, 6); g.add(br);
  }
  g.rotation.z = rnd(-0.15, 0.15);
  return g;
}
function tree() {
  const g = new THREE.Group();
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 3, 6), M.dark); t.position.y = 1.5; g.add(t);
  const c = new THREE.Mesh(new THREE.SphereGeometry(rnd(1.6, 2.4), 7, 6), PM.leaf); c.position.y = rnd(3.6, 4.4); c.scale.y = 1.2; g.add(c);
  return g;
}
function fencePost() { const m = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.0, 0.12), M.wood); m.position.y = 0.5; return m; }
function lamppost() {
  const own = T3().lamp; if (typeof own === 'function') return own(townKit());   // a town's own lamp (towns3d), lit with lampLights
  // two lamps from the sheet: the tall slim modern lamp with a flat head (newer towns, the reference village), and the classic lantern of the old centres
  const g = new THREE.Group(); const k = kit(), classic = (typeof own === 'string' ? own : townStyle.lamp) === 'classic';
  const hx = classic ? 0 : -0.8, hy = classic ? 3.37 : 4.0;
  if (classic) {
    kadd(k, PG.lantPole, PM.pole, 0, 1.6, 0); kadd(k, KG.cyl, PM.pole, 0, 0.22, 0, 0, 0, 0, 0.3, 0.44, 0.3); kadd(k, KG.cyl, PM.pole, 0, 3.0, 0, 0, 0, 0, 0.2, 0.1, 0.2);
    kb(k, PM.pole, 0, 3.1, 0, 0.42, 0.05, 0.42); kb(k, PM.pole, 0, 3.65, 0, 0.48, 0.06, 0.48); kadd(k, PG.lantCap, PM.pole, 0, 3.84, 0, 0, Math.PI / 4, 0); kadd(k, KG.ball, PM.pole, 0, 4.04, 0, 0, 0, 0, 0.1, 0.12, 0.1);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) kb(k, PM.pole, sx * 0.18, 3.37, sz * 0.18, 0.03, 0.56, 0.03);
    kb(k, PM.pole, 0, 2.7, 0, 0.5, 0.04, 0.04);   // the ladder bar
  } else if (MODELS.lamp) kModel(k, MODELS.lamp, 0, 0, 0); else { kadd(k, PG.pole, PM.pole, 0, 2.1, 0); kb(k, PM.pole, -0.4, 4.1, 0, 0.9, 0.06, 0.06); }
  if (Math.random() < 0.3) { kat(k, 0.26, 0, rnd(-0.2, 0.2), rnd(-0.15, 0.15), 0.12); kBike(k, pick(PK.bikes), false, Math.random() < 0.4); }   // a bike locked to the lamppost
  kbuild(k, g);
  if (classic) { const b = new THREE.Mesh(PG.lantGlass, PM.lampHead); b.position.set(0, hy, 0); g.add(b); }
  else { const b = new THREE.Mesh(PG.bulb, PM.lampHead); b.position.set(hx, hy, 0); b.scale.set(1.5, 0.45, 1.5); g.add(b); }
  lampLights(g, hx, hy, classic ? 1 : 0);
  g.userData.faceRoad = true;
  return g;
}
// the light of a street lamp whose head is at (hx, hy): the halo, the cone in the haze, the pool on the ground and its long reflection on the
// wet road (additive decals, no real light). lantern 1 sizes it for a lantern, 0 for a flat modern head; s scales it all
function lampLights(g, hx, hy, lantern = 0, s = 1) {
  const c = lantern ? 1 : 0;
  const glow = new THREE.Sprite(LAMP_HALO_MAT); glow.scale.set((c ? 2.6 : 2.2) * s, (c ? 2.6 : 2.2) * s, 1); glow.position.set(hx, hy - 0.08, 0); g.add(glow);
  const cone = new THREE.Sprite(LAMP_CONE_MAT); cone.center.set(0.5, 1); cone.scale.set((c ? 3.2 : 3.6) * s, (c ? 3.3 : 3.9) * s * hy / (c ? 3.37 : 4.0), 1); cone.position.set(hx, hy - (c ? 0.2 : 0.02), 0); cone.renderOrder = 4; g.add(cone);
  const pool = new THREE.Mesh(PG.pool, LAMP_POOL_MAT); pool.position.set(hx - (c ? 0.7 : 0.5), 0.11, 0); pool.scale.setScalar(s); pool.renderOrder = 2; g.add(pool);
  const streak = new THREE.Mesh(PG.streak, LAMP_STREAK_MAT); streak.position.set(hx - (c ? 0.8 : 0.45), 0.12, 0); streak.scale.setScalar(s); streak.renderOrder = 3; g.add(streak);
  return g;
}
// houses face the road with their -x side; sceneryPlace turns them for the left side
// a Dutch townhouse: narrow, tall, big windows in rows with pale frames, a gable on the street side, a hoisting beam at the top
let townStyle = { brick: [0x3b2f2b, 0x4a3a35, 0x2e2a30, 0x5a4038], gables: 0.6, height: [7, 10], width: [3.4, 4.6] };
const TOWN_STYLE = {
  alblasserdam: { brick: [0x4a3630, 0x5a4038, 0x3e3a44, 0x6a5a50], gables: 0.3, height: [6, 8.5], width: [4, 5.2] },
  kinderdijk:   { brick: [0x4a3630, 0x5a4038, 0x6b5a44], gables: 0.5, height: [6, 9], width: [3.6, 4.8] , lamp: 'classic' },
  gouda:        { brick: [0x6a4a3a, 0x7a5a46, 0x5a4a44, 0x8a7a66], gables: 0.7, height: [7, 10], width: [3.4, 4.4] , lamp: 'classic' },
  zeeland:      { brick: [0x3e3a44, 0x6b6a5f, 0x8a8a80], gables: 0.4, height: [5, 7], width: [4, 5.5] },
  utrecht:      { brick: [0x5a3e36, 0x6b4a40, 0x4a3a3a], gables: 0.6, height: [8, 11], width: [3.4, 4.4] , lamp: 'classic' },
  denhaag:      { brick: [0x7b7568, 0x8a8478, 0x5a5a60, 0xa09a8a], gables: 0.3, height: [8, 12], width: [4, 5.5] , lamp: 'classic' },
  rotterdam:    { brick: [0x5a5f66, 0x3d4652, 0x6e7580, 0x2f3540], gables: 0.05, height: [9, 16], width: [4.5, 7] },
  urk:          { brick: [0x3a3f48, 0x6b6a5f, 0x2f3338, 0x8a8a80], gables: 0.2, height: [4.5, 6.5], width: [4, 5.5] },
  texel:        { brick: [0x3a4a3c, 0x5a5a4a, 0x6b6a5f], gables: 0.15, height: [4.5, 6.5], width: [4.5, 6] },
  groningen:    { brick: [0x5c2e28, 0x4a2a26, 0x6e3a30, 0x3e2a28], gables: 0.5, height: [7, 10], width: [3.6, 4.8] , lamp: 'classic' },
  maastricht:   { brick: [0x8a8370, 0x6f6a5a, 0x9a927f, 0x5a5048], gables: 0.3, height: [7, 10], width: [3.8, 5] , lamp: 'classic' },
  amsterdam:    { brick: [0x3b2f2b, 0x4a3a35, 0x2e2a30, 0x5a4038, 0x1f1c22], gables: 0.9, height: [9, 13], width: [3.2, 4.2] , lamp: 'classic' },
};
// ---------- a town's own look: towns3d/<id>.js registers window.NRTOWNS3D[id]; towns3d/README.md lists what it can set ----------
let townId = 'alblasserdam';
const TOWN3D = window.NRTOWNS3D = window.NRTOWNS3D || {};
const T3 = () => TOWN3D[townId] || {};
function townStyleOf(id) { return Object.assign({}, TOWN_STYLE[id] || TOWN_STYLE.alblasserdam, (TOWN3D[id] && TOWN3D[id].style) || {}); }
// a ride and an intro shot set the town through these (an imported binding is read-only)
function setTownId(id) { townId = id; }
function setTownStyle(st) { townStyle = st; }

export { bakfiets, bikeLaneSign, bikeRow, bins, crates, deadTree, ducks, fencePost, lampLights, lamppost, moorings, setTownId, setTownStyle, T3,
  TOWN_STYLE, TOWN3D, townId, townStyle, townStyleOf, tree, windmill };
