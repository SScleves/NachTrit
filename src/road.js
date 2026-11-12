// The road and the ground: the road textures per lane count and town look, the ribbons (road, kerbs, verges, the land of a
// hill town, the canal) whose rows follow the bend and the hills every frame, and bend(), hillAt() and rise().
import { LANES2, LANES3, ROAD_W, THREE } from './engine.js?v=44';
import { MAX_ANISO, scene } from './render.js?v=44';
import { M, Mat } from './materials.js?v=44';
import { S, T3 } from './main.js?v=44';   // later modules, through the hub

// ---------- world ----------
// road: wet asphalt with reflective paint. One colour map and one paint mask per lane count, swapped in start().
const ROAD_TEX_W = 512, ROAD_TEX_H = 512;   // the texture spans the road width (8 units) and 6 units of length
// look (a town's or a theme's road): kind 'asphalt' (default), 'klinkers' (brick pavers), 'cobbles', 'slabs' (concrete plates); tone: the base
// colour ('#5a2f2b' is a red bike path); lines: false leaves the lane paint off (the faint mask that shows the lanes in the dark stays)
function roadCanvas(lanes, paintOnly, look = {}) {
  const c = document.createElement('canvas'); c.width = ROAD_TEX_W; c.height = ROAD_TEX_H;
  const g = c.getContext('2d');
  const W = ROAD_TEX_W, H = ROAD_TEX_H, px = W / ROAD_W, py = H / 6;   // pixels per unit across and along
  const kind = look.kind || 'asphalt';
  if (paintOnly) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); }
  else if (kind === 'klinkers' || kind === 'cobbles') {   // pavers: rows across the road, joints dark and wet
    let seed = 31 + lanes; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    g.fillStyle = '#16141a'; g.fillRect(0, 0, W, H);
    const base = look.tone || (kind === 'klinkers' ? '#4c3430' : '#3e3c40'), bc = [parseInt(base.slice(1, 3), 16), parseInt(base.slice(3, 5), 16), parseInt(base.slice(5, 7), 16)];
    const bw = (kind === 'klinkers' ? 0.21 : 0.15) * px, bh = (kind === 'klinkers' ? 0.1 : 0.13) * py, rows = Math.round(H / bh);
    for (let row = 0; row < rows; row++) {
      const y = row * H / rows, hh = H / rows, off = (row % 2) * bw * 0.5;
      for (let x = -off; x < W; x += bw) {
        const v = 0.78 + r() * 0.4, col = bc.map(cc => Math.min(255, Math.round(cc * v)));
        g.fillStyle = `rgb(${col.join(',')})`;
        if (kind === 'cobbles') { g.beginPath(); g.ellipse(x + bw / 2 + (r() - 0.5) * 2, y + hh / 2, bw * 0.46, hh * 0.44, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(200,205,215,0.07)'; g.beginPath(); g.ellipse(x + bw * 0.42, y + hh * 0.38, bw * 0.22, hh * 0.16, 0, 0, 7); g.fill(); }
        else { g.fillRect(x + 1, y + 1, bw - 2, hh - 2); if (r() < 0.25) { g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(x + 1, y + hh * 0.5, bw - 2, hh * 0.5 - 1); } }
      }
    }
  } else {
    g.fillStyle = look.tone || '#353a44'; g.fillRect(0, 0, W, H);
    // aggregate: fine light and dark grit, a few larger stones, faint wheel-worn bands in each lane
    let seed = 7 + lanes; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 9000; i++) { const v = r(); g.fillStyle = v < 0.5 ? `rgba(16,18,24,${0.25 + r() * 0.3})` : `rgba(150,156,168,${0.10 + r() * 0.18})`; g.fillRect(r() * W, r() * H, 1 + (r() < 0.15), 1 + (r() < 0.15)); }
    for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(120,126,138,${0.12 + r() * 0.15})`; g.beginPath(); g.arc(r() * W, r() * H, 1 + r() * 1.6, 0, 7); g.fill(); }
    const laneX = lanes === 2 ? LANES2 : LANES3;
    for (const lx of laneX) for (const off of [-0.45, 0.45]) { const x = (lx + off + ROAD_W / 2) * px; g.fillStyle = 'rgba(70,78,92,0.10)'; g.fillRect(x - 10, 0, 20, H); }
    if (kind === 'slabs') { g.fillStyle = 'rgba(10,12,16,0.75)'; g.fillRect(0, 0, W, 3); g.fillRect(0, H / 2, W, 3); g.fillRect(W / 2 - 1, 0, 3, H); }   // concrete plates, 4 m wide, 3 m long
  }
  if (look.lines === false && !paintOnly) { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, MAX_ANISO); return t; }
  const paint = paintOnly ? '#ffffff' : '#cdd1ca';
  g.fillStyle = paint;
  const lineW = Math.round(0.13 * px);
  // solid edge lines just inside each kerb
  for (const ex of [-3.72, 3.72]) g.fillRect(Math.round((ex + ROAD_W / 2) * px - lineW / 2), 0, lineW, H);
  // dashed lane lines: one dash per 6 units, 2.6 long
  const dashX = lanes === 2 ? [0] : [-1.1, 1.1];
  const dashL = Math.round(H * 2.6 / 6);
  for (const dx of dashX) g.fillRect(Math.round((dx + ROAD_W / 2) * px - lineW / 2), Math.round((H - dashL) / 2), lineW, dashL);
  if (!paintOnly) {   // worn paint: a few speckles knocked out of the lines
    g.fillStyle = 'rgba(53,58,68,0.55)';
    let seed = 99; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 260; i++) { const ex = [-3.72, 3.72, ...dashX][Math.floor(r() * (2 + dashX.length))]; g.fillRect((ex + ROAD_W / 2) * px - lineW / 2 + r() * lineW, r() * H, 1.5, 1.5); }
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, MAX_ANISO);
  return t;
}
const ROAD_LOOK = { 2: { map: roadCanvas(2, false), paint: roadCanvas(2, true) }, 3: { map: roadCanvas(3, false), paint: roadCanvas(3, true) } };
const ROAD_LOOKS = {};   // a town's own road, painted once on first use
function roadLookFor(lanes, look) { if (!look) return ROAD_LOOK[lanes]; const key = lanes + JSON.stringify(look); return ROAD_LOOKS[key] || (ROAD_LOOKS[key] = { map: roadCanvas(lanes, false, look), paint: roadCanvas(lanes, true, look) }); }
const roadTex = ROAD_LOOK[3].map;
const mistTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 4, 64, 64, 64); r.addColorStop(0, 'rgba(210,220,255,.45)'); r.addColorStop(1, 'rgba(210,220,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
})();
// pale kerb stones, pavement tiles and a grass verge, all scrolling with the road
function stripTex(w, h, draw, aniso) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
  if (aniso) t.anisotropy = Math.min(8, MAX_ANISO); return t;
}
const kerbTex = stripTex(32, 256, (g, w, h) => {
  g.fillStyle = '#b4b2aa'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 500; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(90,90,86,.25)' : 'rgba(230,228,220,.25)'; g.fillRect(Math.random() * w, Math.random() * h, 1, 1); }
  g.fillStyle = '#6e6c66'; for (let y = 0; y < h; y += 64) g.fillRect(0, y, w, 3);   // a joint every metre
  g.fillStyle = 'rgba(240,238,230,.5)'; g.fillRect(0, 0, 3, h);                        // the worn road-side edge catches light
}, true);
const tileTex = stripTex(256, 256, (g, w, h) => {
  g.fillStyle = '#4e5058'; g.fillRect(0, 0, w, h);
  const n = 6, s = w / n;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const v = 70 + Math.floor(Math.random() * 18); g.fillStyle = `rgb(${v},${v + 2},${v + 8})`; g.fillRect(x * s + 2, y * s + 2, s - 4, s - 4); }
  for (let i = 0; i < 1500; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(30,32,38,.25)' : 'rgba(170,172,180,.15)'; g.fillRect(Math.random() * w, Math.random() * h, 1, 1); }
}, true);
const grassTex = stripTex(64, 256, (g, w, h) => {
  g.fillStyle = '#1f2c20'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 1400; i++) { const v = Math.random(); g.fillStyle = v < 0.5 ? 'rgba(12,20,12,.5)' : 'rgba(70,92,62,.35)'; g.fillRect(Math.random() * w, Math.random() * h, 1, 2 + Math.random() * 3); }
}, false);
const KERB_W = 0.5;
const VERGE = { tiles: { w: 3.2, y: 0.05, mat: Mat({ map: tileTex }) }, grass: { w: 0.8, y: 0.0, mat: Mat({ map: grassTex }) } };
let verge = VERGE.tiles;
// the road is one ribbon whose vertices follow the bend every frame
const RIB_ROWS = 120, RIB_STEP = 2.5;
let ribZ0 = 10, keepBehind = 20;   // the ribbons start, and scenery is sent back ahead, this far behind the bike; an intro shot looks back, so it keeps 40
function setBehind(z0, keep) { ribZ0 = z0; keepBehind = keep; }   // the intro sets both (an imported binding is read-only)
function makeRibbon(width, material) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(RIB_ROWS * 2 * 3), uv = new Float32Array(RIB_ROWS * 2 * 2), nrm = new Float32Array(RIB_ROWS * 2 * 3);
  const idx = [];
  for (let i = 0; i < RIB_ROWS; i++) { nrm.set([0, 1, 0, 0, 1, 0], i * 6); uv.set([0, i, 1, i], i * 4); if (i) idx.push((i - 1) * 2, (i - 1) * 2 + 1, i * 2, (i - 1) * 2 + 1, i * 2 + 1, i * 2); }   // counter-clockwise from above, so the ribbon faces up and is not culled
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3)); geo.setIndex(idx);
  const m = new THREE.Mesh(geo, material); m.frustumCulled = false; m.userData.width = width; scene.add(m); return m;
}
function updateRibbon(m, xc, y, scroll, vScale, flat) {
  const a = m.geometry.attributes.position.array, u = m.geometry.attributes.uv.array, w = m.userData.width;
  for (let i = 0; i < RIB_ROWS; i++) {
    const z = ribZ0 + scroll - i * RIB_STEP; const xo = xc + bend(z), yy = flat || !hills ? y : y + rise(z);   // water stays level on a hill
    a[i * 6] = xo - w / 2; a[i * 6 + 1] = yy; a[i * 6 + 2] = z; a[i * 6 + 3] = xo + w / 2; a[i * 6 + 4] = yy; a[i * 6 + 5] = z;
    const v = (S.dist + 10 - z) / vScale; u[i * 4 + 1] = v; u[i * 4 + 3] = v;
  }
  m.geometry.attributes.position.needsUpdate = true; m.geometry.attributes.uv.needsUpdate = true;
}
// wet asphalt; the paint mask glows faintly so the lines read beyond the bike lamp
const roadRib = makeRibbon(ROAD_W, new THREE.MeshPhongMaterial({ map: roadTex, emissive: 0xdfe4e0, emissiveMap: ROAD_LOOK[3].paint, emissiveIntensity: 0.22, specular: 0x7a8aa0, shininess: 90 }));
const kerbMat = Mat({ map: kerbTex });
const kerbL = makeRibbon(KERB_W, kerbMat), kerbR = makeRibbon(KERB_W, kerbMat);
// beyond the kerb: pavement tiles in town, a grass verge on the dyke and in the polder
const vergeL = makeRibbon(VERGE.tiles.w, VERGE.tiles.mat), vergeR = makeRibbon(VERGE.tiles.w, VERGE.tiles.mat);
// a hill town has no flat ground plane: the land beside the street is two wide ribbons that climb with the road
const LAND_MAT = Mat({ color: 0x1b1f25 });
const landL = makeRibbon(60, LAND_MAT), landR = makeRibbon(60, LAND_MAT); landL.visible = landR.visible = false;
let hills = null;   // the theme's hills ({ grade: [lo, hi], len: [lo, hi] }), set by buildScenery; null on flat land
function setHills(h) { hills = h; }
function setRoadLook(lanes, th) {
  const look = roadLookFor(lanes === 2 ? 2 : 3, th.road || T3().road);
  roadRib.material.map = look.map; roadRib.material.emissiveMap = look.paint;   // same shader, only the textures change
  verge = th.verge ? (VERGE[th.verge] || VERGE.tiles) : (th.key === 'polder' || th.key === 'dyke') ? VERGE.grass : VERGE.tiles;
  for (const v of [vergeL, vergeR]) { v.material = verge.mat; v.userData.width = verge.w; }
}
// the bend: x offset of anything at relative distance z ahead of the bike
function bend(z) { return z < 0 ? S.curv * z * z : 0; }
// the hill: y offset of anything at relative distance z (negative is ahead). Hill towns have a ground profile along the road, two slow waves
// (hills: { amp, len } in metres), so climbs, crests and dips follow each other and stay put as you ride; flat land returns 0
let hillPhase = 0;   // ?hillphase=metres shifts the waves under the bike, to look at a crest or a dip
function setHillPhase(m) { hillPhase = m; }
function hillAt(d) { const H = hills, x = d + hillPhase; return H.amp * Math.sin(x * 6.2832 / H.len) + H.amp * 0.3 * Math.sin(x * 6.2832 / (H.len * 0.37) + 1.7); }
function rise(z) { return hills ? hillAt(S.dist - z) - hillAt(S.dist) : 0; }

const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), M.ground);
ground.rotation.x = -Math.PI / 2; ground.position.set(0, -0.9, -150); scene.add(ground);
// the canal is a second ribbon on one side when the theme has one
const waterRib = makeRibbon(26, M.water); waterRib.visible = false;

export { bend, ground, hillAt, hills, keepBehind, KERB_W, kerbL, kerbR, LAND_MAT, landL, landR, mistTex, RIB_STEP, rise, roadRib, setBehind,
  setHillPhase, setHills, setRoadLook, updateRibbon, verge, vergeL, vergeR, waterRib };
