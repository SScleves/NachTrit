// The node render path, opt-in with ?renderer=webgpu (or webgl2): the legacy light units and the cel lighting model as nodes,
// the fog and vertex helpers the towns use through W.NODE, and the post chain built in TSL. On the default WebGL path NODEFX is
// null and nothing here runs.
import { ADD, NODES, THREE, TSL } from './engine.js?v=40';
import { camera, renderer, scene } from './main.js?v=40';   // later modules, through the hub

// ---------- the node path's own pieces: legacy light units, the cel lighting model, fog and vertex helpers for node materials ----------
// FOG_D / FOG_C follow scene.fog every frame; NODEFX is also handed to the towns (W.NODE) for their own patches.
const NODEFX = NODES ? (() => {
  const T = TSL, PI = Math.PI;
  // the same legacy units as the WebGL path: PI on direct and hemisphere light, a spot fading linearly to its distance
  class LegacySpot extends THREE.SpotLightNode {
    update(frame) { super.update(frame); this.color.multiplyScalar(PI); }
    setupDirect(builder) {
      const { colorNode, cutoffDistanceNode: cut, decayExponentNode: dec, light } = this;
      const lv = this.getLightVector(builder), dir = lv.normalize();
      const sa = this.getSpotAttenuation(builder, dir.dot(T.lightTargetDirection(light)));
      const att = T.select(cut.greaterThan(0).and(dec.greaterThan(0)), T.pow(T.saturate(lv.length().div(cut).oneMinus()), dec), T.float(1));
      return { lightColor: colorNode.mul(sa).mul(att), lightDirection: dir };
    }
  }
  class LegacyDir extends THREE.DirectionalLightNode { update(frame) { super.update(frame); this.color.multiplyScalar(PI); } }
  class LegacyHemi extends THREE.HemisphereLightNode { update(frame) { super.update(frame); this.colorNode.value.multiplyScalar(PI); this.groundColorNode.value.multiplyScalar(PI); } }
  THREE.SpotLight.registerNode(LegacySpot); THREE.DirectionalLight.registerNode(LegacyDir); THREE.HemisphereLight.registerNode(LegacyHemi);
  const FOG_D = T.uniform(0.016), FOG_C = T.uniform(new THREE.Color(0x4a545e));
  const fogF = () => T.densityFogFactor(FOG_D);
  // the Kyoto cel trick as a lighting model: the ramp's dark bands lean to a tint instead of only going darker
  let ramp = null;
  class CelModel extends THREE.LightingModel {
    constructor(tint) { super(); this.tint = tint; }
    direct({ lightDirection, lightColor, reflectedLight }) {
      const band = T.vec3(T.texture(ramp, T.vec2(T.normalView.dot(lightDirection).mul(0.5).add(0.5), 0.5)).r);
      reflectedLight.directDiffuse.addAssign(band.mul(T.mix(this.tint, T.vec3(1), band)).mul(lightColor).mul(T.diffuseColor.rgb).mul(1 / PI));
    }
    indirect(builder) {
      const { ambientOcclusion, irradiance, reflectedLight } = builder.context;
      reflectedLight.indirectDiffuse.addAssign(irradiance.mul(T.diffuseColor.rgb).mul(1 / PI));
      reflectedLight.indirectDiffuse.mulAssign(ambientOcclusion);
    }
  }
  class CelMaterial extends THREE.MeshToonNodeMaterial {
    constructor(o, tint) { super(); this.celTint = tint; this.setValues(o || {}); }
    setupLightingModel() { return new CelModel(T.color(this.celTint)); }
    copy(src) { super.copy(src); this.celTint = src.celTint; return this; }
  }
  const base = m => m.colorNode || T.materialColor;
  return {
    T, FOG_D, FOG_C, CelMaterial,
    setRamp(t) { ramp = t; },
    // light that is not a light: dims toward black in the haze; keep is what is left at full haze
    fogDim(m, keep) { m.fog = false; m.colorNode = base(m).mul(T.float(1).sub(fogF().mul(1 - (keep == null ? 0.15 : keep)))); return m; },
    // the haze takes only part of this colour
    fogThin(m, part) { m.fog = false; m.colorNode = T.vec4(T.mix(base(m).rgb, FOG_C, fogF().mul(part)), base(m).a); return m; },
    // walls darken toward their foot (object y)
    damp(m, low) { m.colorNode = base(m).mul(T.vec4(T.vec3(T.mix(low, 1, T.smoothstep(0.05, 1.9, T.positionLocal.y))), 1)); return m; },
    // multiply the colour by a node (a factor computed per vertex or per pixel)
    tintBy(m, f) { m.colorNode = base(m).mul(T.vec4(T.vec3(f), 1)); return m; },
    // a uniform whose value is read from a plain { value } object every frame (the towns keep theirs that way)
    live(obj) { return T.uniform(obj.value).onRenderUpdate(() => obj.value); },
    // WebGPU draws point primitives one pixel wide: a Points cloud (positions, optional colours, a PointsMaterial) becomes one
    // instanced sprite draw with the same size, map, colours and fog; userData.pts keeps the source geometry for code that animates it
    points(geo, mat) {
      const pos = geo.attributes.position, col = geo.attributes.color;
      const m = new THREE.PointsNodeMaterial({ map: mat.map, color: mat.color, opacity: mat.opacity, transparent: mat.transparent, depthWrite: mat.depthWrite, depthTest: mat.depthTest, blending: mat.blending, sizeAttenuation: mat.sizeAttenuation, size: mat.size, fog: mat.fog });
      m.positionNode = T.instancedBufferAttribute(pos);
      let c = mat.colorNode || T.materialColor;
      if (col && mat.vertexColors) c = c.mul(T.vec4(T.instancedBufferAttribute(col), 1));
      m.colorNode = c; m.userData = mat.userData;
      const s = new THREE.Sprite(m); s.count = pos.count; s.frustumCulled = false; s.userData.pts = geo; return s;
    },
    // hill towns (Nijmegen, Maastricht): each 6 m slot of a merged row is lifted to the hill under its own middle; HU = { d, a, l } plain uniforms
    hillStep(m, HU) {
      const U = HU._node || (HU._node = { d: this.live(HU.d), a: this.live(HU.a), l: this.live(HU.l) });
      const hill = d => U.a.mul(T.sin(d.mul(6.2832).div(U.l))).add(U.a.mul(0.3).mul(T.sin(d.mul(6.2832).div(U.l.mul(0.37)).add(1.7))));
      const slot = T.modelWorldMatrix.mul(T.vec4(0, 0, T.floor(T.positionLocal.z.div(6).add(0.5)).mul(6), 1));
      const off = T.select(U.a.greaterThan(0), hill(U.d.sub(slot.z)).sub(hill(U.d.sub(T.modelPosition.z))), T.float(0));
      m.positionNode = (m.positionNode || T.positionLocal).add(T.vec3(0, off, 0)); return m;
    },
    // Nijmegen's bridge lamps coming on pair by pair: n is a plain { value } uniform, pairs are dx apart from x0, unlit ones at dim
    march(m, n, x0, dx, dim) {
      const u = n._node || (n._node = this.live(n));
      const on = T.varying(T.clamp(u.sub(T.floor(T.float(x0).sub(T.positionLocal.x).div(dx).add(0.5))), 0, 1));
      return this.tintBy(m, T.mix(dim, 1, on));
    },
  };
})() : null;

// The node chain (WebGPU or its WebGL2 fallback): one scene pass, then ink lines from depth, a ground mist from the reconstructed world
// height, bloom on what is bright (lamp, windows, wisps), and the grade toward the concept art. Every step reads the scene pass's
// textures, which are finished before the chain runs: nothing samples a target it is drawing into.
// the old WebGL post path had no anti-aliasing at all; the node path renders the scene with 4x MSAA (?msaa=0 to compare), and a slow
// laptop gives that up first, before the resolution drops (see loop)
let MSAA = +(new URLSearchParams(location.search).get('msaa') ?? 4);
function setMSAA(v) { MSAA = v; }   // the loop drops it on a slow GPU (an imported binding is read-only)
function buildNodePost(composer) {   // the chain it replaces; returns the new one and its passes
  if (composer && composer.dispose) composer.dispose();
  const T = TSL, U = NODEFX, OFF = new URLSearchParams(location.search).get('fx') || '';   // ?fx=-ink,-mist,-bloom drops a stage (for measuring)
  const LO = new URLSearchParams(location.search).get('hdr') !== '1';   // 8-bit scene target as on the WebGL path (half the bandwidth of half-float on an iGPU); ?hdr=1 for half float
  const sp = T.pass(scene, camera, Object.assign(LO ? { type: THREE.UnsignedByteType } : {}, MSAA ? { samples: MSAA } : {}));
  const col = sp.getTextureNode('output'), dep = sp.getTextureNode('depth');
  const res = T.uniform(new THREE.Vector2(1, 1)).onRenderUpdate(() => renderer.getDrawingBufferSize(_resV));
  const near = T.uniform(camera.near), far = T.uniform(camera.far);
  const projInv = T.uniform(new THREE.Matrix4()).onRenderUpdate(() => camera.projectionMatrixInverse), camWorld = T.uniform(new THREE.Matrix4()).onRenderUpdate(() => camera.matrixWorld);
  const time = T.uniform(0), danger = T.uniform(0), ink = T.uniform(0.9), mist = T.uniform(1), wetK = T.uniform(1.3), sat = T.uniform(0.74);
  const lin = d => T.perspectiveDepthToViewZ(d, near, far).negate();
  const P = T.uv(), px = T.vec2(1).div(res);
  const d0 = dep.sample(P).r, c = lin(d0);
  const l = lin(dep.sample(P.sub(T.vec2(px.x, 0))).r), r = lin(dep.sample(P.add(T.vec2(px.x, 0))).r);
  const u = lin(dep.sample(P.sub(T.vec2(0, px.y))).r), dn = lin(dep.sample(P.add(T.vec2(0, px.y))).r);
  const dd = T.abs(c.mul(2).sub(l).sub(r)).add(T.abs(c.mul(2).sub(u).sub(dn)));
  const e = dd.div(c.mul(0.035).add(0.04));
  const inkK = T.smoothstep(0.7, 1.8, e).mul(ink).mul(T.smoothstep(140, 25, c));
  let rgb = OFF.includes('-ink') ? col.rgb : col.rgb.mul(inkK.mul(0.9).oneMinus());
  // ground mist: thicker where the world is low and far, the haze colour, nothing on the sky (no depth there)
  const vp = T.getViewPosition(P, d0, projInv), wp = camWorld.mul(T.vec4(vp, 1)).xyz;
  const low = T.exp(T.max(wp.y.sub(0.2), 0).mul(-0.55)), deep = T.smoothstep(6, 60, c);
  const m = low.mul(deep).mul(0.32).mul(mist).mul(T.step(d0, 0.99999));
  if (!OFF.includes('-mist')) rgb = T.mix(rgb, U.FOG_C.mul(1.08), m);
  const bl = OFF.includes('-bloom') ? null : ADD.bloom(T.vec4(rgb, 1), 0.5, 0.35, 0.78);
  if (bl) bl.setResolutionScale(0.25);   // a quarter, as the WebGL path's bloom
  if (bl) rgb = rgb.add(bl.rgb);
  // wet road: what glows (lamps, windows, wisps) runs down the wet ground below it as soft streaks, as in the concept art; only on
  // ground-level pixels, read from the finished bloom texture
  if (bl && !OFF.includes('-wet')) {
    const bt = bl.getTextureNode(), wet = T.smoothstep(0.45, 0.02, wp.y).mul(T.step(d0, 0.99999)).mul(T.smoothstep(3, 9, c)).mul(wetK);
    let streak = T.vec3(0);
    for (let i = 1; i <= 8; i++) streak = streak.add(bt.sample(P.add(T.vec2(0, 0.006 * i * i + 0.01 * i))).rgb.mul((9 - i) / 36));   // taps reach a third of the screen up
    rgb = rgb.add(streak.mul(wet).mul(T.vec3(1.0, 0.92, 0.8)));
  }
  // the grade, as on the WebGL path
  let g = T.pow(T.max(rgb, 0), T.vec3(1 / 2.2));
  const lum = T.dot(g, T.vec3(0.299, 0.587, 0.114));
  g = g.add(T.vec3(0.028, 0.036, 0.056).mul(T.smoothstep(0, 0.3, lum).oneMinus()));
  g = g.mul(T.mix(T.vec3(0.93, 0.98, 1.07), T.vec3(1.08, 1.0, 0.88), T.smoothstep(0.15, 0.75, lum)));
  g = g.sub(0.3).mul(1.05).add(0.3);
  // toward the concept art's palette: everything leans to the cold grey of the haze except what is warm and lit (windows, lamps,
  // the orange jacket, the eyes), which keeps its full colour
  const lum2 = T.dot(g, T.vec3(0.299, 0.587, 0.114)), warm = T.smoothstep(0.03, 0.16, g.r.sub(g.b)).mul(T.smoothstep(0.18, 0.5, lum2));
  g = T.mix(T.vec3(lum2).mul(T.vec3(0.97, 1.0, 1.05)), g, T.mix(sat, 1.0, warm));
  const v = T.smoothstep(1.2, 0.25, T.length(P.sub(0.5)));
  g = g.mul(T.mix(0.7, 1.0, v));
  g = T.mix(g, T.vec3(0.35, 0.02, 0.02), v.oneMinus().mul(danger).mul(0.9));
  const n = T.fract(T.sin(T.dot(T.floor(P.mul(res)).add(time), T.vec2(12.9898, 78.233))).mul(43758.5453));
  g = g.add(n.sub(0.5).mul(0.035));
  composer = new THREE.RenderPipeline(renderer);
  composer.outputColorTransform = false;   // the grade writes display values itself, as on the WebGL path
  composer.outputNode = T.vec4(T.clamp(g, 0, 1), 1);
  return { composer, gradePass: { uniforms: { time, danger, ink, mist, wet: wetK, sat } }, inkPass: ink, bloomPass: bl, sceneRT: sp };
}
const _resV = new THREE.Vector2();

export { buildNodePost, MSAA, NODEFX, setMSAA };
