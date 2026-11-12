// The themes (what lines the road per place) and buildScenery, which dresses the world for a theme and a town: houses, props,
// the backdrop, the dead, the mist bands, the sky and the light. Also the recycling of scenery ahead as the ride rolls on.
import { clamp, lerp, pick, rnd, ROAD_W, smooth, THREE } from './engine.js?v=44';
import { scene } from './render.js?v=44';
import { aurora, paintSky, skyDome } from './sky.js?v=44';
import { GlowMat, glowTex, M, Mat } from './materials.js?v=44';
import { ground, hills, KERB_W, LAND_MAT, landL, landR, setHills } from './road.js?v=44';
import { PG, PM, setTownLight } from './props.js?v=44';
import { kadd, kb, kbuild, KG, kit, kmerge, ktube, PK } from './kit.js?v=44';
import { bakfiets, bikeLaneSign, bikeRow, bins, crates, deadTree, ducks, fencePost, lampLights, lamppost, moorings, T3, TOWN_STYLE, townId,
  townStyle, tree, windmill } from './furniture.js?v=44';
import { bench, bikeProp, boat, bollard, brickMat, bridge, cheeseCart, church, dogProp, drawbridge, fingerpost, graffitiWall, house, reeds, seeded,
  surfUV, tulipBox } from './houses.js?v=44';
import { backRow, canalBridge, crane, flagNL, GRACHT_TOWNS, LANDMARK, lighthouse, paintSkyline, sheep, SKY_MARKS, terrace, tintFar, tower,
  TOWN_EXTRA, townShops, townSigns, treeCard } from './backdrop.js?v=44';
import { deadPool, fence, G, ghostFigure, labelTexture, TOWN_OF, wisp, zombie, ZOMBIE_VARIANTS, zombieParts } from './main.js?v=44';   // later modules, through the hub

// ---------- themes: what lines the road per place ----------
// street furniture sits on the pavement with a footprint under 1, so it never pushes a house away; houses stand back a little for front gardens
const THEMES = {
  // fog: the horizon haze (sky and fog share it), fogD: its density at the start, night: how far the haze dims by the end of a level
  // depth, in layers: the street row (terraces at x 8), a second row of houses behind it (x 18 to 21), trees between them, then the painted bands of the far town
  polder: { fog: 0x4b555c, fogD: 0.015, night: 0.16, stars: true, open: true, water: 0x35414b, ground: 0x18201b, groundY: -0.9, canal: 1, curv: 0.0035, spawn: [
    { make: windmill, n: 5, gap: 50, side: 'both', xr: [12, 26], y: -0.6 }, { make: () => treeCard([3, 3, 2, 1]), n: 14, gap: 12, side: 'both', xr: [6.5, 16], y: -0.6, r: 0.9 },
    { make: fencePost, n: 36, gap: 4.5, side: 'left', xr: [4.6, 4.6] }, { make: reeds, n: 22, gap: 8, side: 'right', xr: [5.0, 5.8], y: -0.7 },
    { make: ducks, n: 2, gap: 90, side: 'right', xr: [8, 14], y: -0.62 }, { make: moorings, n: 3, gap: 60, side: 'right', xr: [5.6, 5.9], y: -0.6 },
    { make: () => terrace(2, { lit: 0.4, peer: false }), n: 2, gap: 110, side: 'left', xr: [14, 16], y: -0.6, r: 6 },
    { make: () => fingerpost(townSigns()), n: 1, gap: 160, side: 'left', xr: [4.6, 4.6], r: 0.5 } ] },
  street: { fog: 0x4b555f, fogD: 0.016, night: 0.17, ground: 0x1b1f25, groundY: -0.05, canal: 0, curv: 0.003, lmX: [30, 38], spawn: [
    { make: () => terrace(3, { tag: 0.45 }), n: 12, gap: 12, side: 'alt', reg: true, xr: [7.9, 8.2], r: 9, y: 0 },
    { make: backRow, n: 9, gap: 16, side: 'alt', reg: true, xr: [18.5, 20.5], r: 14 },
    { make: lamppost, n: 14, gap: 10, side: 'alt', reg: true, xr: [4.7, 4.7] },
    { make: () => treeCard([0, 1]), n: 5, gap: 28, side: 'both', xr: [5.5, 5.8], r: 0.9 }, { make: () => treeCard([1, 1, 2, 0]), n: 10, gap: 14, side: 'both', xr: [12, 14.5], r: 0.9 },
    { make: bollard, n: 20, gap: 7, side: 'alt', xr: [4.4, 4.4], r: 0.2 },
    { make: bench, n: 2, gap: 70, side: 'both', xr: [4.9, 4.9], r: 0.9 }, { make: () => fingerpost(townSigns()), n: 2, gap: 70, side: 'both', xr: [4.6, 4.6], r: 0.5 },
    { make: bikeRow, n: 6, gap: 24, side: 'both', xr: [4.9, 5.0], r: 0.6 }, { make: bins, n: 4, gap: 36, side: 'both', xr: [5.0, 5.1], r: 0.5 },
    { make: tulipBox, n: 5, gap: 30, side: 'both', xr: [4.8, 4.9], r: 0.4 }, { make: bikeLaneSign, n: 2, gap: 75, side: 'both', xr: [4.6, 4.6], r: 0.3 },
    { make: bakfiets, n: 1, gap: 150, side: 'both', xr: [5.0, 5.1], r: 0.7 },
    { make: 'zombieWalk', n: 8, gap: 18, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] },
  // the reference itself: houses on the left, the canal on the right with reeds, posts, boats and the drawbridge, the far quay and the town across the water
  gracht: { fog: 0x4b555f, fogD: 0.0155, night: 0.17, water: 0x161d26, ground: 0x1b1f25, groundY: -0.05, waterY: 0.0, canal: 1, curv: 0.0018, lmX: [40, 46], lmSide: 'right', spawn: [
    { make: () => terrace(3, { tag: 0.4 }), n: 6, gap: 24, side: 'left', reg: true, xr: [7.9, 8.2], r: 9, y: 0 },
    { make: backRow, n: 5, gap: 30, side: 'left', reg: true, xr: [19, 20.5], r: 14 },
    { make: lamppost, n: 9, gap: 16, side: 'left', reg: true, xr: [4.7, 4.7] }, { make: lamppost, n: 4, gap: 36, side: 'right', reg: true, xr: [4.7, 4.7] },
    { make: () => treeCard([0, 1]), n: 5, gap: 30, side: 'left', xr: [5.5, 5.8], r: 0.9 }, { make: () => treeCard([1, 2, 1]), n: 6, gap: 24, side: 'left', xr: [12, 14.5], r: 0.9 },
    { make: () => terrace(4, { plain: true, lit: 0.25, reflect: 3.2, peer: false }), n: 5, gap: 30, side: 'right', reg: true, xr: [35.5, 36.5], r: 13 },
    { make: () => treeCard([1, 1, 2]), n: 7, gap: 22, side: 'right', xr: [44, 50], r: 0.9 },
    { make: reeds, n: 20, gap: 7, side: 'right', xr: [7.8, 8.4], y: -0.15 }, { make: moorings, n: 5, gap: 30, side: 'right', xr: [8.1, 8.3], y: 0 },
    { make: boat, n: 4, gap: 36, side: 'right', xr: [9.8, 11.5], y: 0.6, r: 2.5 }, { make: ducks, n: 3, gap: 45, side: 'right', xr: [12, 20], y: -0.02 },
    { make: canalBridge, n: 1, gap: 150, side: 'right', xr: [4.6, 4.6], r: 2 },
    { make: bollard, n: 12, gap: 11, side: 'right', xr: [4.4, 4.4], r: 0.2 }, { make: bench, n: 2, gap: 70, side: 'right', xr: [5.2, 5.2], r: 0.9 },
    { make: bikeRow, n: 5, gap: 28, side: 'both', xr: [4.9, 5.0], r: 0.6 }, { make: bins, n: 3, gap: 48, side: 'left', xr: [5.0, 5.1], r: 0.5 },
    { make: tulipBox, n: 4, gap: 36, side: 'left', xr: [4.8, 4.9], r: 0.4 }, { make: () => fingerpost(townSigns()), n: 2, gap: 75, side: 'right', xr: [4.6, 4.6], r: 0.5 },
    { make: bikeLaneSign, n: 1, gap: 150, side: 'left', xr: [4.6, 4.6], r: 0.3 },
    { make: 'zombieWalk', n: 7, gap: 20, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] },
  shops: { fog: 0x4e555d, fogD: 0.016, night: 0.17, ground: 0x1b1f25, groundY: -0.05, canal: 0, curv: 0.0025, lmX: [30, 38], spawn: [
    { make: () => terrace(3, { shops: 0.8, tag: 0.3 }), n: 12, gap: 12, side: 'alt', reg: true, xr: [7.6, 7.9], r: 9, y: 0 },
    { make: backRow, n: 9, gap: 16, side: 'alt', reg: true, xr: [18.5, 20.5], r: 14 },
    { make: lamppost, n: 14, gap: 10, side: 'alt', reg: true, xr: [4.7, 4.7] }, { make: () => treeCard([1, 2]), n: 8, gap: 18, side: 'both', xr: [12, 14.5], r: 0.9 },
    { make: cheeseCart, n: 2, gap: 80, side: 'both', xr: [5.4, 5.6], r: 0.9 },
    { make: bollard, n: 14, gap: 10, side: 'alt', xr: [4.4, 4.4], r: 0.2 }, { make: bikeRow, n: 7, gap: 22, side: 'both', xr: [4.9, 5.0], r: 0.6 },
    { make: crates, n: 5, gap: 30, side: 'both', xr: [5.0, 5.2], r: 0.5 }, { make: bins, n: 3, gap: 50, side: 'both', xr: [5.0, 5.1], r: 0.5 },
    { make: bakfiets, n: 2, gap: 75, side: 'both', xr: [5.0, 5.1], r: 0.7 }, { make: bikeLaneSign, n: 1, gap: 150, side: 'both', xr: [4.6, 4.6], r: 0.3 },
    { make: () => fingerpost(townSigns()), n: 1, gap: 140, side: 'both', xr: [4.6, 4.6], r: 0.5 },
    { make: 'zombieWalk', n: 8, gap: 18, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] },
  dyke: { fog: 0x4a545d, fogD: 0.0145, night: 0.16, open: true, water: 0x37434d, ground: 0x18201b, groundY: -0.9, canal: -1, curv: 0.004, spawn: [
    { make: windmill, n: 4, gap: 60, side: 'right', xr: [12, 26], y: -0.6 }, { make: reeds, n: 40, gap: 4.2, side: 'left', xr: [4.8, 5.6], y: -0.7 }, { make: lamppost, n: 6, gap: 30, side: 'right', reg: true, xr: [4.7, 4.7] },
    { make: boat, n: 5, gap: 40, side: 'left', xr: [9, 13], y: 0 }, { make: moorings, n: 6, gap: 28, side: 'left', xr: [5.8, 6.2], y: -0.6 }, { make: ducks, n: 3, gap: 55, side: 'left', xr: [7, 12], y: -0.62 },
    { make: fencePost, n: 36, gap: 4.5, side: 'right', xr: [4.6, 4.6] },
    { make: drawbridge, n: 1, gap: 160, side: 'left', xr: [4.2, 4.2] }, { make: () => treeCard([1, 0, 2, 1]), n: 10, gap: 16, side: 'right', xr: [6, 12], y: -0.6, r: 0.9 },
    { make: () => terrace(2, { lit: 0.45 }), n: 3, gap: 55, side: 'right', xr: [14, 15], y: -0.6, r: 6 },
    { make: () => fingerpost(townSigns()), n: 1, gap: 180, side: 'right', xr: [4.6, 4.6], r: 0.5 },
    { make: bikeRow, n: 2, gap: 80, side: 'right', xr: [4.9, 5.0], r: 0.6 }, { make: 'zombieWalk', n: 3, gap: 60, side: 'right', xr: [4.8, 5.1], r: 0.6 } ] },
  square: { fog: 0x4a545f, fogD: 0.016, night: 0.17, ground: 0x1c2026, groundY: -0.05, canal: 0, curv: 0.002, lmX: [32, 40], lmSide: 'right', spawn: [
    { make: church, n: 1, gap: 200, side: 'right', xr: [12, 12] }, { make: () => treeCard([1, 1, 1, 0]), n: 14, gap: 12, side: 'both', xr: [5.5, 9], r: 0.9 },
    { make: () => treeCard([1, 2]), n: 8, gap: 20, side: 'right', xr: [14, 24], r: 0.9 },
    { make: lamppost, n: 10, gap: 14, side: 'alt', reg: true, xr: [4.7, 4.7] }, { make: () => terrace(3, { tag: 0.2 }), n: 6, gap: 24, side: 'left', reg: true, xr: [9.6, 10], r: 9 },
    { make: backRow, n: 5, gap: 30, side: 'left', reg: true, xr: [21, 22.5], r: 14 }, { make: backRow, n: 3, gap: 50, side: 'right', reg: true, xr: [28, 30], r: 14 },
    { make: bench, n: 4, gap: 40, side: 'both', xr: [5.0, 5.2], r: 0.9 }, { make: tulipBox, n: 6, gap: 26, side: 'both', xr: [4.6, 4.8], r: 0.4 },
    { make: bikeRow, n: 4, gap: 40, side: 'both', xr: [4.9, 5.0], r: 0.6 }, { make: bins, n: 3, gap: 50, side: 'both', xr: [5.0, 5.1], r: 0.5 },
    { make: bakfiets, n: 1, gap: 160, side: 'both', xr: [5.0, 5.1], r: 0.7 }, { make: bikeLaneSign, n: 1, gap: 150, side: 'both', xr: [4.6, 4.6], r: 0.3 },
    { make: () => fingerpost(townSigns()), n: 1, gap: 150, side: 'both', xr: [4.6, 4.6], r: 0.5 },
    { make: 'zombieWalk', n: 6, gap: 28, side: 'both', xr: [5.0, 6.0], r: 0.6 } ] },
  nightshop: { fog: 0x3c4552, fogD: 0.017, night: 0.22, ground: 0x171a20, groundY: -0.05, canal: 0, curv: 0.0025, lmX: [30, 38], spawn: [
    { make: () => terrace(3, { shops: 0.85, tag: 0.45 }), n: 12, gap: 12, side: 'alt', reg: true, xr: [7.6, 7.9], r: 9 },
    { make: backRow, n: 9, gap: 16, side: 'alt', reg: true, xr: [18.5, 20.5], r: 14 },
    { make: lamppost, n: 8, gap: 18, side: 'alt', reg: true, xr: [4.7, 4.7] }, { make: dogProp, n: 1, gap: 120, side: 'both', xr: [4.8, 5.2] },
    { make: cheeseCart, n: 1, gap: 120, side: 'both', xr: [5.4, 5.6], r: 0.9 }, { make: bollard, n: 12, gap: 12, side: 'alt', xr: [4.4, 4.4], r: 0.2 },
    { make: bikeRow, n: 5, gap: 26, side: 'both', xr: [4.9, 5.0], r: 0.6 }, { make: bins, n: 4, gap: 30, side: 'both', xr: [5.0, 5.1], r: 0.5 },
    { make: crates, n: 4, gap: 32, side: 'both', xr: [5.0, 5.2], r: 0.5 }, { make: () => treeCard([1, 2]), n: 6, gap: 24, side: 'both', xr: [12, 14.5], r: 0.9 },
    { make: 'zombieWalk', n: 9, gap: 16, side: 'both', xr: [4.8, 5.4], r: 0.6 } ] },
};
const SHOP_SIGNS = ['BAKKER', 'SLAGER', 'KAPPER', 'APOTHEEK', 'CAFÉ', 'SUPERMARKT', 'FIETSENMAKER', 'BLOEMEN', 'KAAS', 'FRIET', 'KLOMPEN'];
let scenery = [];
for (const k in THEMES) THEMES[k].key = k;   // a town's own street keeps the key of the kind it replaces
let theme = THEMES.polder;
// what a town file's builders get as K: the game's builders, kit and materials (the same names as on the intro's W)
let _townKit = null;
function townKit() {
  return _townKit || (window.NRTK = _townKit = {
    THREE, scene, kit, kb, kadd, ktube, kbuild, kmerge, KG, PG, PM, PK, M, G, Mat, GlowMat, glowTex, brickMat, labelTexture, surfUV,
    house, terrace, backRow, lamppost, lampLights, treeCard, reeds, boat, moorings, ducks, canalBridge, drawbridge, bridge, windmill, church, tower, lighthouse,
    sheep, crane, flagNL, bench, bollard, bikeRow, bikeProp, bakfiets, bins, crates, tulipBox, cheeseCart, fence, fencePost, fingerpost, graffitiWall,
    zombie, ghostFigure, wisp, THEMES, TOWN_STYLE, LANDMARK, SKY_MARKS, ROAD_W, KERB_W, rnd, pick, lerp, smooth, clamp, seeded,
    get style() { return townStyle; }, get town() { return townId; },
  });
}
function clearScenery() { for (const o of scenery) { scene.remove(o.mesh); o.mesh.traverse(m => { if (m.userData.ownTex && m.material) { (m.userData.ownMap || m.material.map).dispose(); m.material.dispose(); } if (m.geometry && !m.geometry.userData.model && !Object.values(G).includes(m.geometry) && !Object.values(PG).includes(m.geometry)) m.geometry.dispose(); }); } scenery = []; }
function footprint(sp) { return sp.r != null ? sp.r : (sp.make === house || sp.make === 'shop') ? 4.5 : sp.make === church ? 10 : sp.make === windmill ? 4 : sp.make === tree || sp.make === deadTree ? 2.4 : sp.make === 'graffiti' ? 3.5 : sp.make === bridge ? 2 : sp.make === boat ? 2.5 : 0.6; }
function overlaps(z, side, r, except) {
  for (const q of scenery) {
    if (q === except || !q.mesh.visible) continue;
    if ((Math.sign(q.bx) || 1) !== side) continue;
    const qr = footprint(q.sp); if (qr < 1 && r < 1) continue;
    if (except && Math.abs(Math.abs(q.bx) - Math.abs(except.bx)) > (qr < 1 || r < 1 ? 2.2 : 4)) continue;   // a different depth: furniture on the pavement does not push a house away, nor the front row the back row
    if (Math.abs(q.z - z) < r + qr) return q;
  }
  return null;
}
function sceneryPlace(o) {
  const sp = o.sp; let side = sp.side === 'both' ? (Math.random() < 0.5 ? -1 : 1) : sp.side === 'left' ? -1 : sp.side === 'right' ? 1 : (o.i % 2 ? 1 : -1);
  const r = footprint(sp);
  o.bx = side * rnd(sp.xr[0], sp.xr[1]);
  o.mesh.visible = !o.cineHidden;   // a piece an intro shot hid stays hidden when it comes round again
  // flip side once, then push back along the road until it does not sit inside something else
  for (let tries = 0; tries < 6 && overlaps(o.z, side, r, o); tries++) { if (sp.side === 'both' && tries === 0) { side = -side; o.bx = -o.bx; } else o.z -= r + 3; }
  if (overlaps(o.z, side, r, o)) o.mesh.visible = false;
  o.mesh.position.y = sp.y || 0;
  if (o.mesh.userData.faceRoad) o.mesh.rotation.y = side < 0 ? Math.PI : 0;
}
const _townWords = {};
function allWords() {   // the walls of a town carry its own words: the research list in content/towns.js first (twice as often), then the nouns of its levels
  if (_townWords[townId]) return _townWords[townId];
  const ok = s => s && /^(de|het)\s+\S+$/i.test(s), mine = new Set(), rest = new Set();
  let of = null; try { of = TOWN_OF; } catch (e) {}
  for (const lv of LEVELS) { if (!lv.items) continue; const here = (lv.town || (of && of(lv.id))) === townId; for (const it of lv.items) { const nl = it.dehet ? `${it.art} ${it.nl}` : it.nl; if (ok(nl)) (here ? mine : rest).add(nl); } }
  const t = (window.TOWNS || []).find(t => t.id === townId), own = t ? (t.words || []).map(w => w.nl).filter(ok) : [];
  let list = own.concat(own, [...mine]); if (list.length < 6) list = list.concat([...rest]);
  return (_townWords[townId] = list);
}
// called after every buildScenery (a ride, an intro shot, the title): src/dawn.js puts the night back here, so only the ride that
// asks for dawn has it
const sceneryHooks = [];
function buildScenery(th) {
  const td = T3(), K = townKit();
  let key = th.key;
  if (key === 'street' && GRACHT_TOWNS.has(townId) && !(td.themes && td.themes.street)) { th = THEMES.gracht; key = 'gracht'; }   // canal towns: the street runs along the water, as in the reference
  const own = td.themes && td.themes[key];   // the town's own version of this kind of street, made once and kept
  if (own) { td._themes = td._themes || {}; th = td._themes[key] || (td._themes[key] = Object.assign({}, typeof own === 'function' ? own(th, K) : own, { key })); }
  clearScenery(); theme = th;
  setTownLight(td.light || {});
  setHills(th.hills || null); ground.visible = !hills; landL.visible = landR.visible = !!hills; LAND_MAT.color.set(th.ground);
  if (!hills) for (const w of wieven) w.position.y = w.scale.y * 0.12;
  for (const v of new Set(ZOMBIE_VARIANTS.concat(deadPool()))) zombieParts(v);
  ground.material.color.set(th.ground); ground.position.y = th.groundY;
  if (!th.fogC || th._fogHex !== th.fog) { th.fogC = new THREE.Color(th.fog); th._fogHex = th.fog; }
  scene.fog.color.copy(th.fogC); scene.fog.density = th.fogD; skyDome.material.color.setScalar(1);
  const sky = Object.assign({ stars: !!th.stars }, td.sky || {}, th.sky || {}); paintSky(th.fog, sky);
  aurora.userData.k = sky.aurora || 0; aurora.visible = !!sky.aurora; aurora.rotation.y = (sky.auroraAz == null ? 25 : sky.auroraAz) * Math.PI / 180;
  th.waterK = th.waterK || (th.open ? 0.34 : 0.24);   // open water under a wide sky holds more of it than a canal between houses
  paintSkyline(townId, !!th.open, !!(th.open || th.canal)); tintFar(1);
  const wl = th.waterY != null ? th.waterY : -0.6;
  const extra = (th.extra || td.extra || TOWN_EXTRA[townId] || []).filter(sp => sp.water == null || th.canal).map(sp => sp.water == null ? sp : Object.assign({}, sp, { side: th.canal > 0 ? 'right' : 'left', y: wl + sp.water }));
  const lm = td.landmark ? () => td.landmark(K) : LANDMARK[townId];
  const spawn = th.spawn.concat(extra, lm && th.landmark !== false ? [{ make: lm, n: 1, gap: 240, side: th.lmSide || (townId === 'zeeland' ? 'left' : 'both'), xr: th.lmX || [16, 24], r: 12, y: th.groundY + 0.3 }] : []);
  for (const sp of spawn) {
    for (let i = 0; i < sp.n; i++) {
      let mesh;
      if (sp.make === 'graffiti') { const pool = allWords(); const w = pool.length ? pick(pool) : 'gezellig'; mesh = graffitiWall(w); }
      else if (sp.make === 'shop') mesh = house({ sign: pick(townShops()), lit: 0.55 });
      else if (sp.make === 'zombieWalk') { mesh = zombie(); mesh.userData.shuffle = rnd(0.3, 0.7); mesh.userData.faceRoad = false; }
      else mesh = sp.make(K);
      surfUV(mesh);
      const o = { mesh, sp, i, z: -i * sp.gap - (sp.reg ? 0 : rnd(0, sp.gap * 0.5)) - 8, span: sp.n * sp.gap, bx: 0 };   // reg: evenly spaced, so the eye follows the lamps into the fog
      sceneryPlace(o); scene.add(mesh); scenery.push(o);
    }
  }
  for (const f of sceneryHooks) f();
}

// witte wieven: ground mist in three bands, thin near the bike and thicker toward the horizon; long soft banks with no edges, coloured from the haze every frame
const hazeTex = (() => {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64; const g = c.getContext('2d');
  let s = 5; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 110; i++) { const x = 18 + r() * 220, y = 24 + r() * 30, rad = 8 + r() * 22, rg = g.createRadialGradient(x, y, 0, x, y, rad); rg.addColorStop(0, `rgba(255,255,255,${0.07 + r() * 0.09})`); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  g.globalCompositeOperation = 'destination-in';
  const h = g.createLinearGradient(0, 0, 256, 0); h.addColorStop(0, 'rgba(0,0,0,0)'); h.addColorStop(0.3, 'rgba(0,0,0,1)'); h.addColorStop(0.7, 'rgba(0,0,0,1)'); h.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = h; g.fillRect(0, 0, 256, 64);
  const v = g.createLinearGradient(0, 0, 0, 64); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(0.55, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,1)'); g.fillStyle = v; g.fillRect(0, 0, 256, 64);
  return new THREE.CanvasTexture(c);
})();
let MIST_Q = null;   // the ground-mist bands, once built (render can run before they are)
// z0: where a bank is sent back to; len: how deep the band is; k: how much paler than the haze (linear)
const MIST_BANDS = [
  { n: 6, z0: 4, len: 44, w: [9, 15], h: [1.4, 2.2], a: 0.5, k: 1.5, side: 4 },
  { n: 7, z0: -40, len: 50, w: [22, 32], h: [3, 4.5], a: 0.55, k: 1.45 },
  { n: 7, z0: -90, len: 60, w: [40, 60], h: [6, 9], a: 0.6, k: 1.4 },
];
const wieven = [];
for (const B of MIST_BANDS) {
  B.mat = new THREE.SpriteMaterial({ map: hazeTex, transparent: true, depthWrite: false, fog: false, opacity: B.a });
  for (let i = 0; i < B.n; i++) {
    const s = new THREE.Sprite(B.mat); s.scale.set(rnd(B.w[0], B.w[1]), rnd(B.h[0], B.h[1]), 1);
    s.userData.band = B; s.userData.bx = B.side ? (Math.random() < 0.5 ? -1 : 1) * rnd(B.side, 16) : rnd(-18, 18); s.userData.drift = rnd(0.2, 0.6);
    s.position.set(s.userData.bx, s.scale.y * 0.12, B.z0 - (i + Math.random() * 0.7) * B.len / B.n);   // the lower part sinks into the ground, so a bank lies on it with no hard edge
    s.layers.set(1);   // a handle only: the camera draws layer 0, the band's mesh below draws the bank (the shots still test and hide these)
    scene.add(s); wieven.push(s); (B.banks = B.banks || []).push(s);
  }
  // one draw call per band instead of one per bank: camera-facing quads written by mistSync() before every render, from the
  // banks' positions, scales and visibility. A band is one colour and opacity, so the order of its banks does not matter.
  const n = B.n, g = new THREE.BufferGeometry(), uv = new Float32Array(n * 8), idx = [];
  for (let i = 0; i < n; i++) { uv.set([0, 0, 1, 0, 1, 1, 0, 1], i * 8); idx.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3); }
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 12), 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx);
  const zc = B.z0 - B.len / 2;
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 2, zc), 40 + B.len);   // the transparent sort key: the middle of the band, as the banks were
  g.boundingBox = new THREE.Box3(new THREE.Vector3(-45, 0, B.z0 - B.len - 10), new THREE.Vector3(45, 12, B.z0 + 10));
  B.q = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: hazeTex, transparent: true, depthWrite: false, fog: false, opacity: B.a }));
  B.q.frustumCulled = false; B.q.userData.mistBand = true; scene.add(B.q);
}
MIST_Q = MIST_BANDS;

export { allWords, buildScenery, sceneryHooks, footprint, MIST_BANDS, MIST_Q, scenery, sceneryPlace, SHOP_SIGNS, theme, THEMES, townKit, wieven };
