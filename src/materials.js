// The shared materials: Mat (toon bands with a cool or warm shadow tint, Lambert with ?post=0, the cel node material on the
// node path), GlowMat and glowTex for light that is not a light, and M, the materials every builder shares.
import { NODES, POST, THREE } from './engine.js?v=42';
import { NODEFX } from './render-nodes.js?v=42';
import './sky.js?v=42';   // keeps the order the game's code runs in

// materials: toon bands when the look pipeline is on, plain Lambert otherwise
const toonRamp = (() => { const data = new Uint8Array([80, 80, 80, 255, 140, 140, 140, 255, 205, 205, 205, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
if (NODES) NODEFX.setRamp(toonRamp);
// the Kyoto trick: the darker toon bands lean toward a cool blue-violet instead of just going darker; brick and timber take a warmer one
const TINT = { cool: 0x5d5f8e, warm: 0x7a5a64 };
const TOON_LINE = /vec3 irradiance = getGradientIrradiance\( ([\w.]+), directLight\.direction \) \* directLight\.color;/;
const toonTinted = !NODES && TOON_LINE.test(THREE.ShaderChunk.lights_toon_pars_fragment) ? 'uniform vec3 uShadowTint;\n' + THREE.ShaderChunk.lights_toon_pars_fragment.replace(TOON_LINE,
  'vec3 celBand = getGradientIrradiance( $1, directLight.direction ); vec3 irradiance = celBand * mix( uShadowTint, vec3( 1.0 ), celBand ) * directLight.color;') : null;
function Mat(opts = {}, tint = TINT.cool) {
  if (!POST) return new THREE.MeshLambertMaterial(opts);
  if (NODES) return new NODEFX.CelMaterial(opts, tint);
  const m = new THREE.MeshToonMaterial(Object.assign({ gradientMap: toonRamp }, opts));
  if (toonTinted) { const u = { value: new THREE.Color(tint) }; m.onBeforeCompile = sh => { sh.uniforms.uShadowTint = u; sh.fragmentShader = sh.fragmentShader.replace('#include <lights_toon_pars_fragment>', toonTinted); }; m.customProgramCacheKey = () => 'cel' + tint; }
  return m;
}
// light that is not a light: additive, no depth writes, and fog that dims it toward black instead of washing it toward the haze
function glowFog(m, keep) {
  if (NODES) return NODEFX.fogDim(m, keep || 0.15);
  const k = (1 - (keep || 0.15)).toFixed(2);
  m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <fog_fragment>', `#ifdef FOG_EXP2
    gl_FragColor.rgb *= 1.0 - ${k} * (1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth ));
  #endif`); };
  m.customProgramCacheKey = () => 'glowFog' + k; return m;
}
function GlowMat(map, color, opacity, sprite, extra) {
  const o = Object.assign({ map, color, opacity, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }, extra || {});
  return glowFog(sprite ? new THREE.SpriteMaterial(o) : new THREE.MeshBasicMaterial(o));
}
const glowTex = (() => {   // a soft round glow with a hot centre
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.12, 'rgba(255,255,255,.75)'); r.addColorStop(0.35, 'rgba(255,255,255,.22)'); r.addColorStop(0.7, 'rgba(255,255,255,.05)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
})();
const M = {
  road: new THREE.MeshPhongMaterial({ color: 0x2c313b, specular: 0x6a7a90, shininess: 90 }),   // wet
  ground: Mat({ color: 0x141f16 }),
  water: new THREE.MeshBasicMaterial({ color: 0x2c3742 }),   // unlit: it holds the sky, tintFar() colours it from the haze every frame
  wood: Mat({ color: 0x3b2a1c }, TINT.warm),
  dark: Mat({ color: 0x15161b }),
  mill: Mat({ color: 0x2a2520 }),
  bike: Mat({ color: 0x8c8c94 }),
  rider: Mat({ color: 0x14161b }),
  shirt: Mat({ color: 0xd9792a }),
  ghost: Mat({ color: 0xb9c4d6, emissive: 0x6f7fa8, emissiveIntensity: 0.35, transparent: true, opacity: 0.6, side: THREE.DoubleSide }),
  wisp: new THREE.MeshBasicMaterial({ color: 0xffe08a }),
  puddle: new THREE.MeshBasicMaterial({ color: 0x3a4450, transparent: true, depthWrite: false }),   // the sky in a puddle, not a hole in the road
  eye: new THREE.MeshBasicMaterial({ color: 0xff2a1a }),
  hay: Mat({ color: 0x4a3d20 }),
  shade: Mat({ color: 0x050507 }),
  board: Mat({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.0, side: THREE.DoubleSide }),
};

export { GlowMat, glowTex, M, Mat, TINT };
