// The .glb models from tools/models: one loader fetches them all at start (modelsReady), and every user falls back to its
// primitive while a model is missing. Static models go through the kit by slot (kModel, kGable, windmillModel); cloned scene
// graphs (modelClone) take the game's materials by slot name.
import { GLTFLoader, pick, rnd, THREE } from './engine.js?v=44';
import { M, Mat, TINT } from './materials.js?v=44';
import { PG, PM, WIN_GLOW_MAT } from './props.js?v=44';
import { kadd, kbuild, KG, kit, kmerge, MODELS } from './kit.js?v=44';
import { brickMat, WIN_LIT } from './houses.js?v=44';
import './scenery.js?v=44';   // keeps the order the game's code runs in
import { riderModel } from './main.js?v=44';   // later modules, through the hub

// ---------- models ----------
// The .glb files in assets/models are written by tools/models (npm run models) and committed. One loader fetches them all at start;
// each user above (house gables, windmill, lamp, bench, parked bikes, drawbridge, the dog prop) checks MODELS when it builds and
// falls back to its primitive version while the model is missing, so a failed load only costs the look. Static models go
// through the kit like every other prop (one mesh per material for a whole terrace); the rider, his dogs and the mill's sails
// are cloned scene graphs sharing the loaded geometry. Materials come from the game, by the slot name each glTF material carries.
const MODEL_FILES = ['rider', 'dog', 'windmill', 'gables', 'bench', 'lamp', 'bike', 'drawbridge'];
let _slotMats = null;
function slotMat(slot, src) {
  if (!_slotMats) _slotMats = {
    wood: M.wood, iron: PM.pole, frame: PM.pole, steel: PM.pole, tyre: PM.pole, roof: PM.roof, mill: M.mill, window: PM.window, nose: M.dark, shoe: M.dark,
    stone: Mat({ color: 0x6f6b63 }, TINT.warm), brick: brickMat(0x4e3228), thatch: Mat({ color: 0x2f2a22 }), leather: Mat({ color: 0x3a2418 }, TINT.warm),
    dog: PM.dog, dogDark: Mat({ color: 0x2a2420 }), dogPale: Mat({ color: 0xb8a488 }), jacket: M.shirt, jacketDark: Mat({ color: 0x8a4416 }),
    trousers: Mat({ color: 0x232836 }), skin: Mat({ color: 0xd9b48c }), hair: M.rider, neon: new THREE.MeshBasicMaterial({ color: 0xffe2a8 }),
  };
  return _slotMats[slot] || (_slotMats[slot] = src && src.emissive && src.emissive.getHex() ? new THREE.MeshBasicMaterial({ color: src.emissive }) : Mat({ color: src ? src.color : 0x808080 }));
}
function deq(g) {   // a float copy of a (quantized) glTF geometry: the kit's merge wants plain floats
  const o = new THREE.BufferGeometry();
  for (const n of ['position', 'normal', 'uv']) {
    const a = g.attributes[n]; if (!a) continue; const s = a.itemSize, f = new Float32Array(a.count * s);
    for (let i = 0; i < a.count; i++) { f[i * s] = a.getX(i); f[i * s + 1] = a.getY(i); if (s > 2) f[i * s + 2] = a.getZ(i); }
    o.setAttribute(n, new THREE.BufferAttribute(f, s));
  }
  if (g.index) o.setIndex(g.index.clone()); return o;
}
const _mpInv = new THREE.Matrix4(), _mpRel = new THREE.Matrix4();
// every mesh under root (but not under a node skip() names), in root's frame, merged per slot; and the window slots
function modelPart(root, skip) {
  root.updateMatrixWorld(true); _mpInv.copy(root.matrixWorld).invert();
  const by = new Map(), slots = [];
  const walk = o => {
    if (o !== root && skip && skip(o)) return;
    _mpRel.multiplyMatrices(_mpInv, o.matrixWorld);
    if (o.isMesh) { const g = deq(o.geometry).applyMatrix4(_mpRel), nm = o.material.name; if (!by.has(nm)) by.set(nm, { list: [], src: o.material }); by.get(nm).list.push(g.index ? g.toNonIndexed() : g); }
    if (o.userData && o.userData.slot) { const e = _mpRel.elements; slots.push({ kind: o.userData.slot, p: [e[12], e[13], e[14]], ry: Math.atan2(e[8], e[10]), w: o.userData.w, h: o.userData.h }); }
    for (const c of o.children) walk(c);
  };
  walk(root);
  return { geos: [...by].map(([slot, { list, src }]) => [slot, kmerge(list), src]), slots };
}
function kModel(k, part, x, y, z, ry, sx, sy, sz, mats) { for (const [slot, geo, src] of part.geos) kadd(k, geo, (mats && mats[slot]) || slotMat(slot, src), x, y, z, 0, ry || 0, 0, sx, sy, sz); return k; }
function modelClone(node, mats) { const c = node.clone(); c.traverse(o => { if (o.isMesh) o.material = (mats && mats[o.material.name]) || slotMat(o.material.name, o.material); }); return c; }
// a gable from gables.glb on the street facade, with window quads (and glow when lit) in its slots; false while it is not loaded
function kGable(k, type, mat, fx, h, plain, opts) {
  const G = MODELS.gables && MODELS.gables[type]; if (!G) return false;
  const sy = rnd(0.8, 1.05), yaw = -Math.PI / 2, litP = (opts.lit == null ? 0.35 : opts.lit) * 0.8;
  kModel(k, G, fx - 0.02, h, 0, yaw, 1, sy, 1, { brick: mat });
  for (const s of G.slots) {   // the facade's x runs along the house's z, its front (+z) to the street (-x)
    if (plain && Math.random() < 0.5) continue;
    const x = fx - 0.03 - s.p[2], y = h + s.p[1] * sy, z = s.p[0], lit = Math.random() < litP;
    kadd(k, PG['win' + (lit ? pick(WIN_LIT) : Math.random() < 0.5 ? 4 : 3)], PM.winAtlas, x, y, z, 0, yaw, 0, s.w, s.h);
    if (lit) kadd(k, PG.winGlow, WIN_GLOW_MAT, x - 0.05, y, z, 0, yaw, 0, s.w * 2.4, s.h * 2.1);
  }
  return true;
}
function windmillModel() {   // the stellingmolen: body, stage and cap as one kit, lit windows in its slots, the sails cloned to turn
  const W = MODELS.windmill, k = kit(); kModel(k, W, 0, 0, 0);
  for (const s of W.slots) if (Math.random() < 0.6) kadd(k, KG.plane, PM.window, s.p[0], s.p[1], s.p[2], 0, s.ry, 0, s.w, s.h);
  const g = kbuild(k), blades = modelClone(W.sails); g.add(blades);
  g.userData.blades = blades; g.userData.spin = rnd(0.15, 0.4) * (Math.random() < 0.5 ? 1 : -1);
  return g;
}
const modelsReady = (async () => {
  const loader = new GLTFLoader(), v = window.NR_VERSION || 0;
  await Promise.all(MODEL_FILES.map(async name => {
    try {
      const root = (await loader.loadAsync(`assets/models/${name}.glb?v=${v}`)).scene.children[0];
      root.traverse(o => { if (o.geometry) o.geometry.userData.model = true; });   // shared by every clone: clearScenery leaves them alone
      if (name === 'gables') { const G = {}; for (const c of root.children) G[c.name] = modelPart(c); MODELS.gables = G; return; }
      const part = name === 'windmill' ? modelPart(root, o => o.name === 'sails') : name === 'rider' || name === 'dog' ? {} : modelPart(root);
      part.scene = root; if (name === 'windmill') part.sails = root.getObjectByName('sails');
      MODELS[name] = part;
    } catch (e) { console.warn('model ' + name + ' not loaded, the primitive stays:', e && e.message); }
  }));
  if (MODELS.rider) riderModel();
  return MODELS;
})();

export { kGable, kModel, modelClone, modelsReady, windmillModel };
