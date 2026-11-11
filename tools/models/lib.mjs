// Shared kit for the model scripts: the palette, a few shape helpers on top of three's geometry, and a Model that
// collects parts per node and per material slot and writes a small .glb through glTF-Transform
// (dedup, weld, quantize, prune). Run everything with `npm run models`.
//
// Conventions (the game relies on them):
// - metres, y up; a vehicle or creature faces -z (the way the rider rides); a facade faces +z.
// - every material is named after its SLOT ('brick', 'jacket', 'neon' ...). The game maps slots to its own toon materials
//   (index.html, MODEL_SLOTS), so the colours here are only what other viewers show.
// - a node that the game moves (wheel, crank, leg, sails) is a bare pivot; its mesh sits on a child '<name>_mesh' with an
//   identity transform, so quantization never touches the pivot.
// - window and lamp slots are empty nodes named 'slot_<kind>_<n>' with extras { slot, w, h }: the game puts its own
//   window atlas quads and glow there.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Document, NodeIO, Logger } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, weld, quantize, prune } from '@gltf-transform/functions';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export { THREE };
export const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../assets/models');

// one palette for every model, in sRGB hex. e: self-lit (the game draws it unlit and lets the bloom find it)
export const PALETTE = {
  frame: { c: 0x16181e }, steel: { c: 0x3b4a56 }, tyre: { c: 0x0e0f12 }, leather: { c: 0x5a3420 }, neon: { c: 0xffe2a8, e: 1 },
  jacket: { c: 0xd9792a }, jacketDark: { c: 0x9a4c1a }, trousers: { c: 0x262b38 }, shoe: { c: 0x1a1614 }, skin: { c: 0xd9b48c }, hair: { c: 0x2a1f1a },
  dog: { c: 0x6b5340 }, dogDark: { c: 0x2a2420 }, dogPale: { c: 0xc8b49a }, nose: { c: 0x101010 },
  dead: { c: 0x6f7a6a }, rag: { c: 0x3d4148 }, ragWarm: { c: 0x5a4636 }, hat: { c: 0xc8641e }, bonnet: { c: 0xdcd8cc }, skirt: { c: 0x1e2128 }, sock: { c: 0xb8282a }, clog: { c: 0xc89a3a }, eye: { c: 0xffd23a, e: 1 },
  brick: { c: 0x5e3a2e }, stone: { c: 0x9a968c }, roof: { c: 0x2b2a2e }, wood: { c: 0x4a3a2c }, iron: { c: 0x23262b }, mill: { c: 0x2a2520 },
  sail: { c: 0x5c5650 }, thatch: { c: 0x3a3428 }, white: { c: 0xd8d4c8 }, window: { c: 0xffb35a, e: 1 },
};

const lin = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
function linear(hex) { return [lin(((hex >> 16) & 255) / 255), lin(((hex >> 8) & 255) / 255), lin((hex & 255) / 255)]; }

// ---- shape helpers: each returns a BufferGeometry already placed in the caller's node space ----
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export function place(geo, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
  _e.set(rx, ry, rz, 'XYZ'); _q.setFromEuler(_e); _v.set(x, y, z); _s.set(sx, sy, sz); _m.compose(_v, _q, _s); return geo.applyMatrix4(_m);
}
export const box = (w, h, d, x, y, z, rx, ry, rz) => place(new THREE.BoxGeometry(w, h, d), x, y, z, rx, ry, rz);
export const cyl = (rt, rb, h, seg, x, y, z, rx, ry, rz) => place(new THREE.CylinderGeometry(rt, rb, h, seg || 8), x, y, z, rx, ry, rz);
export const ball = (r, x, y, z, sx = 1, sy = 1, sz = 1, ws = 8, hs = 6) => place(new THREE.SphereGeometry(r, ws, hs), x, y, z, 0, 0, 0, sx, sy, sz);
// a rod from a to b (arrays or vectors), radius r, s sides
export function rod(a, b, r, s = 6, r2) {
  const A = Array.isArray(a) ? V(...a) : a, B = Array.isArray(b) ? V(...b) : b, d = B.clone().sub(A), L = d.length();
  const g = new THREE.CylinderGeometry(r2 == null ? r : r2, r, L, s, 1, true);   // open: the ends hide in joints
  g.translate(0, L / 2, 0); g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.normalize())); g.translate(A.x, A.y, A.z); return g;
}
// a tube along a smooth curve through points
export function tube(points, r, seg = 12, sides = 6) {
  const c = new THREE.CatmullRomCurve3(points.map(p => (Array.isArray(p) ? V(...p) : p)), false, 'centripetal');
  return new THREE.TubeGeometry(c, seg, r, sides, false);
}
// a solid of revolution about y from [radius, y] pairs
export const lathe = (pts, seg = 8) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.0001), y)), seg);
// a flat outline (array of [x, y]) extruded by depth along -z, front face at z = 0
export function slab(outline, depth, holes = []) {
  const s = new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 6 }); g.translate(0, 0, -depth); return g;
}
// a torus arc in the y-z plane (wheels, mudguards), centred at c, radius R, tube r, from angle a0 over arc
export function ring(c, R, r, a0 = 0, arc = Math.PI * 2, seg = 20, sides = 5) {
  const g = new THREE.TorusGeometry(R, r, sides, seg, arc); g.rotateZ(a0); g.rotateY(Math.PI / 2); g.translate(c[0], c[1], c[2]); return g;
}
// a capsule-ish limb between a and b with radii ra and rb (a tapered rod with balls at the ends)
export function limb(a, b, ra, rb, s = 6) { return [rod(a, b, ra, s, rb), ball(ra, a[0], a[1], a[2], 1, 1, 1, s, 4), ball(rb, b[0], b[1], b[2], 1, 1, 1, s, 4)]; }

function prep(g) {   // every part: non-indexed, position + normal + uv, float
  let q = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(q.attributes)) if (!['position', 'normal', 'uv'].includes(k)) q.deleteAttribute(k);
  if (!q.attributes.normal) q.computeVertexNormals();
  // no textures in the files: the game projects its brick, roof and wood textures from world position, so uv is a zero placeholder
  q.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(q.attributes.position.count * 2), 2));
  q.morphAttributes = {}; q.clearGroups(); return q;
}

export class Model {
  constructor(name) { this.name = name; this.nodes = []; this.root = this.node(name, null); this.extrasRoot = {}; }
  // a pivot node at t (parent space), rotation r as euler [x, y, z]
  node(name, parent, t = [0, 0, 0], r = [0, 0, 0], extras) { const n = { name, parent, t, r, parts: new Map(), extras }; this.nodes.push(n); return n; }
  add(node, slot, ...geos) {
    if (!PALETTE[slot]) throw new Error(`${this.name}: unknown slot ${slot}`);
    let l = node.parts.get(slot); if (!l) node.parts.set(slot, l = []);
    for (const g of geos.flat()) l.push(prep(g));
    return this;
  }
  slot(kind, parent, t, w, h, r = [0, 0, 0]) { const i = this.nodes.filter(n => n.extras && n.extras.slot === kind).length; return this.node(`slot_${kind}_${i}`, parent, t, r, { slot: kind, w, h }); }
  tris() { let n = 0; for (const nd of this.nodes) for (const l of nd.parts.values()) for (const g of l) n += g.attributes.position.count / 3; return n; }

  async save(file) {
    const doc = new Document().setLogger(new Logger(Logger.Verbosity.WARN)), buf = doc.createBuffer(), scene = doc.createScene(this.name), mats = new Map(), gnodes = new Map();
    const mat = slot => {
      if (mats.has(slot)) return mats.get(slot);
      const p = PALETTE[slot], m = doc.createMaterial(slot).setBaseColorFactor([...linear(p.c), 1]).setMetallicFactor(0).setRoughnessFactor(0.9);
      if (p.e) m.setEmissiveFactor(linear(p.c));
      mats.set(slot, m); return m;
    };
    for (const n of this.nodes) {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(n.r[0], n.r[1], n.r[2], 'XYZ'));
      const g = doc.createNode(n.name).setTranslation(n.t).setRotation([q.x, q.y, q.z, q.w]);
      if (n.extras) g.setExtras(n.extras);
      gnodes.set(n, g);
      (n.parent ? gnodes.get(n.parent) : scene).addChild(g);
      if (!n.parts.size) continue;
      const mesh = doc.createMesh(n.name);
      for (const [slot, list] of n.parts) {
        const geo = mergeGeometries(list, false);
        const acc = (name, type) => doc.createAccessor(name).setType(type).setArray(new Float32Array(geo.attributes[name].array)).setBuffer(buf);
        const prim = doc.createPrimitive().setMaterial(mat(slot))
          .setAttribute('POSITION', acc('position', 'VEC3')).setAttribute('NORMAL', acc('normal', 'VEC3')).setAttribute('TEXCOORD_0', acc('uv', 'VEC2'));
        mesh.addPrimitive(prim);
      }
      g.addChild(doc.createNode(n.name + '_mesh').setMesh(mesh));
    }
    await doc.transform(dedup(), weld(), quantize({ quantizePosition: 14, quantizeNormal: 8, quantizeTexcoord: 10 }), prune({ keepLeaves: true, keepAttributes: true }));
    fs.mkdirSync(OUT, { recursive: true });
    const io = new NodeIO().registerExtensions(ALL_EXTENSIONS), bin = await io.writeBinary(doc), out = path.join(OUT, file || this.name + '.glb');
    fs.writeFileSync(out, bin);
    console.log(`${path.basename(out).padEnd(22)} ${String(Math.round(this.tris())).padStart(6)} tris  ${(bin.length / 1024).toFixed(1).padStart(6)} KB`);
    return bin.length;
  }
}
// a seeded random, so a rebuild writes the same bytes
export function seeded(n) { let s = n; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
