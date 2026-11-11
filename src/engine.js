// The engine's ground floor: which renderer runs (the WebGL path by default, the node path on ?renderer=webgpu), three.js and its
// addons loaded for that path, the legacy light units patched into the WebGL shaders, and the constants and small helpers every
// other module uses.

// Two render paths. Where the browser has WebGPU the game runs the node pipeline: WebGPURenderer with node materials and a TSL post
// chain. Without it, the game falls back to WebGL2 through the old WebGLRenderer path (GLSL patches, EffectComposer), not through
// WebGPURenderer's own WebGL2 backend: on an Intel iGPU that backend measured slower than the tuned old path.
// A software (fallback) WebGPU adapter does not count. ?renderer=webgl forces the old path, ?renderer=webgpu the node path, ?renderer=webgl2 the node path on WebGPURenderer's WebGL2 backend.
const RENDERER_Q = new URLSearchParams(location.search).get('renderer');
const GPU_PREF = new URLSearchParams(location.search).get('gpu') === 'low' ? 'low-power' : 'high-performance';   // ?gpu=low: the integrated GPU on a two-GPU machine
// Default is the old WebGL path: on the Intel laptop GPU the node path measured ~31 fps with 0.5 s hitches against 58-60 (11 Nov). WebGPU is opt-in.
const NODES = RENDERER_Q === 'webgpu' || RENDERER_Q === 'webgl2' || (RENDERER_Q === 'auto' &&
  await (async () => { try { const a = navigator.gpu && await navigator.gpu.requestAdapter({ powerPreference: GPU_PREF }); return !!a && !(a.info && a.info.isFallbackAdapter); } catch (e) { return false; } })());
const [THREE, TSL, ADD] = NODES
  ? await Promise.all([import('three/webgpu'), import('three/tsl'), import('three/addons/tsl/display/BloomNode.js')])
  : await Promise.all([import('three'), null, Promise.all(['EffectComposer', 'ShaderPass', 'UnrealBloomPass', 'TexturePass'].map(n => import(`three/addons/postprocessing/${n}.js`))).then(ms => Object.assign({}, ...ms))]);
const { EffectComposer, ShaderPass, UnrealBloomPass, TexturePass } = NODES ? {} : ADD;
const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
const POST = !/post=0/.test(location.search);   // ?post=0 turns the whole look pipeline off
// three r155 made lights physical (r165 removed the old mode): every intensity in the game, the towns and the intro shots was tuned
// in the legacy units, where direct and hemisphere light carry a factor PI and a spot fades linearly to zero at its distance.
// Patch those two things back into the shader chunks once, before anything compiles, so every number keeps its meaning.
if (!NODES) (() => {
  const C = THREE.ShaderChunk, rep = (k, a, b) => { if (!C[k].includes(a)) { console.warn('legacy lights: chunk changed', k, a); return; } C[k] = C[k].split(a).join(b); };
  rep('lights_pars_begin', 'float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );', 'if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );\n\treturn 1.0;\n\tfloat distanceFalloff = 1.0;');
  rep('lights_pars_begin', 'light.color = directionalLight.color;', 'light.color = directionalLight.color * PI;');
  rep('lights_pars_begin', 'light.color = pointLight.color;', 'light.color = pointLight.color * PI;');
  rep('lights_pars_begin', 'light.color = spotLight.color * spotAttenuation;', 'light.color = spotLight.color * spotAttenuation * PI;');
  rep('lights_pars_begin', 'vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );', 'vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight ) * PI;');
  rep('lights_pars_begin', 'vec3 irradiance = ambientLightColor;', 'vec3 irradiance = ambientLightColor * PI;');
})();

// ---------- constants ----------
const LANES3 = [-2.2, 0, 2.2], LANES2 = [-1.5, 1.5];
const ROAD_W = 8;
const BASE_SPEED = 14, MAX_SPEED = 40;
const LOOK = 170;              // how far ahead we plan, in track units
const BG = 0x0b0f14;

const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t);
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const today = () => new Date().toISOString().slice(0, 10);
// fares.js fills this; without it the game runs with no money instead of a black page
const FARES = window.FARES || { fareFor: () => 0, payCents: () => 0, euroToWords: () => '', fmtEuro: c => '€ 0,00', FLAT: {}, REFUSE: [], TIPS: [] };

export { $, ADD, BASE_SPEED, clamp, EffectComposer, FARES, GLTFLoader, GPU_PREF, LANES2, LANES3, lerp, LOOK, MAX_SPEED, NODES, pick, POST,
  RENDERER_Q, rnd, ROAD_W, ShaderPass, smooth, TexturePass, THREE, today, TSL, UnrealBloomPass };
