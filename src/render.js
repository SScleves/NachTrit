// The renderer, the scene, the camera and the four lights; the WebGL post chain (scene target, ink lines from depth, bloom, the
// grade) and render(), which draws a frame through whichever chain runs. The node chain itself is in render-nodes.js.
import { EffectComposer, GPU_PREF, NODES, POST, RENDERER_Q, ShaderPass, TexturePass, THREE, UnrealBloomPass } from './engine.js?v=42';
import { buildNodePost, NODEFX } from './render-nodes.js?v=42';
import { flag, MIST_Q, setFlag } from './main.js?v=42';   // later modules, through the hub

// ---------- renderer / scene ----------
const renderer = NODES ? new THREE.WebGPURenderer({ antialias: !POST, powerPreference: GPU_PREF, forceWebGL: RENDERER_Q === 'webgl2' }) : new THREE.WebGLRenderer({ antialias: true, powerPreference: GPU_PREF });
if (NODES) await renderer.init();   // WebGPU when the browser has it, otherwise its WebGL2 backend
const MAX_ANISO = NODES ? renderer.getMaxAnisotropy() : renderer.capabilities.getMaxAnisotropy();
let DPR = Math.min(devicePixelRatio, POST ? 1.0 : 1.5); renderer.setPixelRatio(DPR);
function setDPR(v) { DPR = v; }   // the loop and NRsetDPR lower it (an imported binding is read-only)
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = false;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
let composer = null, inkPass = null, bloomPass = null, gradePass = null, sceneRT = null;
function pictureLost(e) {
  if (e && e.preventDefault) e.preventDefault();
  setFlag('lost', flag('lost') + 1);
  document.getElementById('err').textContent = 'The graphics card dropped the picture. Reloading in a lighter mode.';
  setTimeout(() => { const u = new URL(location.href); u.searchParams.set('post', '0'); location.href = u.toString(); }, 1200);
}
renderer.domElement.addEventListener('webglcontextlost', pictureLost);
if (NODES) renderer.onDeviceLost = pictureLost;   // WebGPU's version of a lost context
// the haze: one colour shared by the fog and the background, so far things dissolve into the sky; buildScenery keys it per theme
scene.fog = new THREE.FogExp2(0x4a545e, 0.016);
scene.background = scene.fog.color;

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 400);
camera.position.set(0, 22, 14);
camera.lookAt(0, 0, -30);

function postSize() { if (!composer || NODES) return; buildPost(); }
// the node chain is built in src/render-nodes.js; the passes it returns are kept here, where render() and the debug hooks read them
function nodePost() { ({ composer, gradePass, inkPass, bloomPass, sceneRT } = buildNodePost(composer)); }
function buildPost() {
  if (!POST) return;
  if (NODES) return nodePost();
  if (composer) { try { composer.renderTarget1.dispose(); composer.renderTarget2.dispose(); if (bloomPass) bloomPass.dispose(); if (sceneRT) sceneRT.dispose(); } catch (e) {} composer = null; }
  const w = Math.floor(innerWidth * DPR), h = Math.floor(innerHeight * DPR);
  // the scene renders into its own target; the ink pass reads that depth, never a buffer it is writing to
  sceneRT = new THREE.WebGLRenderTarget(w, h, { depthTexture: new THREE.DepthTexture(w, h), depthBuffer: true });
  composer = new EffectComposer(renderer);
  composer.addPass(new TexturePass(sceneRT.texture));
  inkPass = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, tDepth: { value: sceneRT.depthTexture }, res: { value: new THREE.Vector2(w, h) }, near: { value: camera.near }, far: { value: camera.far }, strength: { value: 0.9 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform sampler2D tDiffuse, tDepth; uniform vec2 res; uniform float near, far, strength; varying vec2 vUv;
      float lin(float d){ float z = d*2.0-1.0; return (2.0*near*far)/(far+near-z*(far-near)); }
      void main(){ vec2 px = 1.0/res; float c = lin(texture2D(tDepth, vUv).x);
        float l = lin(texture2D(tDepth, vUv-vec2(px.x,0.)).x), r = lin(texture2D(tDepth, vUv+vec2(px.x,0.)).x);
        float u = lin(texture2D(tDepth, vUv-vec2(0.,px.y)).x), d = lin(texture2D(tDepth, vUv+vec2(0.,px.y)).x);
        float dd = abs(2.0*c-l-r) + abs(2.0*c-u-d);
        float e = dd / (c*0.035 + 0.04);
        float ink = smoothstep(0.7, 1.8, e) * strength * smoothstep(140.0, 25.0, c);
        vec4 col = texture2D(tDiffuse, vUv); gl_FragColor = vec4(col.rgb * (1.0 - ink*0.9), col.a); }`,
  });
  inkPass.uniforms.tDepth.value = sceneRT.depthTexture;   // ShaderPass clones its uniforms, and r187 refuses to clone a render target's texture (it leaves null)
  composer.addPass(inkPass);
  bloomPass = new UnrealBloomPass(new THREE.Vector2(Math.floor(innerWidth / 4), Math.floor(innerHeight / 4)), 0.42, 0.3, 0.8);   // r187's blur kernels are twice as wide as r152's: less strength and radius for the same glow
  composer.addPass(bloomPass);
  gradePass = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, time: { value: 0 }, res: { value: new THREE.Vector2(w, h) }, danger: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform sampler2D tDiffuse; uniform float time, danger; uniform vec2 res; varying vec2 vUv;
      void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb;
        c = pow(max(c, 0.0), vec3(1.0/2.2));                      // linear to sRGB, the composer has no output pass
        float l = dot(c, vec3(0.299,0.587,0.114));
        c += vec3(0.028, 0.036, 0.056) * (1.0 - smoothstep(0.0, 0.3, l));                  // blacks lift to a cool navy slate, never crushed
        c *= mix(vec3(0.93, 0.98, 1.07), vec3(1.08, 1.0, 0.88), smoothstep(0.15, 0.75, l)); // split tone: cold shadows, warm highlights
        c = (c - 0.3) * 1.05 + 0.3;                                                           // a touch of contrast around the haze value
        float v = smoothstep(1.2, 0.25, length(vUv - 0.5)); c *= mix(0.7, 1.0, v);
        c = mix(c, vec3(0.35, 0.02, 0.02), (1.0 - v) * danger * 0.9);
        float n = fract(sin(dot(floor(vUv * res) + time, vec2(12.9898, 78.233))) * 43758.5453); c += (n - 0.5) * 0.035;
        gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0); }`,
  });
  composer.addPass(gradePass);
}
buildPost();
if (POST) document.querySelectorAll('.css-look').forEach(e => e.style.display = 'none');
const _mR = new THREE.Vector3(), _mU = new THREE.Vector3();
function mistSync() {
  if (!MIST_Q) return;
  camera.updateMatrixWorld(); const e = camera.matrixWorld.elements; _mR.set(e[0], e[1], e[2]); _mU.set(e[4], e[5], e[6]);
  for (const B of MIST_Q) {
    const P = B.q.geometry.attributes.position, a = P.array;
    B.q.material.color.copy(B.mat.color); B.q.material.opacity = B.mat.opacity;
    for (let i = 0; i < B.banks.length; i++) {
      const w = B.banks[i], p = w.position, on = w.visible ? 0.5 : 0, sx = w.scale.x * on, sy = w.scale.y * on, o = i * 12;
      a[o] = p.x - _mR.x * sx - _mU.x * sy; a[o + 1] = p.y - _mR.y * sx - _mU.y * sy; a[o + 2] = p.z - _mR.z * sx - _mU.z * sy;
      a[o + 3] = p.x + _mR.x * sx - _mU.x * sy; a[o + 4] = p.y + _mR.y * sx - _mU.y * sy; a[o + 5] = p.z + _mR.z * sx - _mU.z * sy;
      a[o + 6] = p.x + _mR.x * sx + _mU.x * sy; a[o + 7] = p.y + _mR.y * sx + _mU.y * sy; a[o + 8] = p.z + _mR.z * sx + _mU.z * sy;
      a[o + 9] = p.x - _mR.x * sx + _mU.x * sy; a[o + 10] = p.y - _mR.y * sx + _mU.y * sy; a[o + 11] = p.z - _mR.z * sx + _mU.z * sy;
    }
    P.needsUpdate = true;
  }
}
function render() {
  mistSync();
  if (NODES) { NODEFX.FOG_D.value = scene.fog.density; NODEFX.FOG_C.value.copy(scene.fog.color); if (composer) { gradePass.uniforms.time.value = (performance.now() % 100000) / 1000; composer.render(); } else renderer.render(scene, camera); return; }
  if (composer) { gradePass.uniforms.time.value = (performance.now() % 100000) / 1000; renderer.setRenderTarget(sceneRT); renderer.render(scene, camera); renderer.setRenderTarget(null); composer.render(); } else renderer.render(scene, camera); }
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight); postSize();
});

// lights
// cold slate from above, a dark violet bounce from below; the moon is a cool rim. Warmth comes only from lamps, windows and wisps.
const hemiLight = new THREE.HemisphereLight(0x6c7888, 0x221e2c, 0.6); scene.add(hemiLight);
const moon = new THREE.DirectionalLight(0xa4b4cc, 0.32); moon.position.set(-39, 29, -87); scene.add(moon);   // from the painted moon, ahead and to the left: what faces the road is backlit, a silhouette against the haze
const lampLight = new THREE.SpotLight(0xf2ead6, 4.2, 60, Math.PI / 6, 0.6, 1.0);
lampLight.position.set(0, 1.1, 0.4);
lampLight.target.position.set(0, 0.2, -20);
scene.add(lampLight, lampLight.target);
const clueLight = new THREE.SpotLight(0xe8f0f4, 0, 30, Math.PI / 14, 0.7, 1.0); clueLight.position.set(0, 9, 0); scene.add(clueLight, clueLight.target);

export { bloomPass, camera, clueLight, composer, DPR, gradePass, hemiLight, inkPass, lampLight, MAX_ANISO, nodePost, postSize, render, renderer,
  scene, setDPR };
