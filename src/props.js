// Shared prop materials (PM) and geometries (PG), and what makes street light: the lamp pool, streak, cone and halo, the lit
// window glow, and setTownLight for a town's lamp and window colour.
import { THREE } from './engine.js?v=43';
import { GlowMat, glowTex, Mat } from './materials.js?v=43';
import './road.js?v=43';   // keeps the order the game's code runs in

// ---------- props ----------
const PM = {
  wall: Mat({ color: 0x2e3540 }),
  wall2: Mat({ color: 0x3a343c }),
  roof: Mat({ color: 0x15171b }),
  window: new THREE.MeshBasicMaterial({ color: 0xe8a458 }),
  windowDim: new THREE.MeshBasicMaterial({ color: 0x8a5c2c }),
  orange: Mat({ color: 0xd9792a }),
  cheese: Mat({ color: 0xe0b040, emissive: 0x6a4a10, emissiveIntensity: 0.6 }),
  tulip: new THREE.MeshBasicMaterial({ color: 0xc8302a }),
  bollard: Mat({ color: 0x4a2a2c }),
  eyeGlow: new THREE.MeshBasicMaterial({ color: 0xffd36a }),
  windowOff: new THREE.MeshBasicMaterial({ color: 0x0c0d10 }),
  pole: Mat({ color: 0x1b1d21 }),
  bulb: new THREE.MeshBasicMaterial({ color: 0xcfd6d8 }),
  lampHead: new THREE.MeshBasicMaterial({ color: 0xffe6b4, fog: false }),
  stone: Mat({ color: 0x3e434c }),
  reed: Mat({ color: 0x2a3326 }),
  leaf: Mat({ color: 0x1d2a22 }),
  dog: Mat({ color: 0x6b5340 }),
  silver: Mat({ color: 0x9aa4ae }),
  boat: Mat({ color: 0x1e2229 }),
};
const PG = {
  win: new THREE.PlaneGeometry(0.7, 1.0),
  pole: new THREE.CylinderGeometry(0.06, 0.08, 4.2, 6),
  lantPole: new THREE.CylinderGeometry(0.055, 0.1, 3.0, 8), lantCap: new THREE.ConeGeometry(0.37, 0.32, 4), lantGlass: new THREE.BoxGeometry(0.32, 0.5, 0.32),
  bulb: new THREE.SphereGeometry(0.16, 6, 6),
  pool: new THREE.PlaneGeometry(6.5, 6.5).rotateX(-Math.PI / 2),
  streak: new THREE.PlaneGeometry(1.3, 13).rotateX(-Math.PI / 2),   // long, as a lamp's reflection runs down a wet road toward the eye
  wisp: new THREE.PlaneGeometry(0.9, 2.6).rotateX(-Math.PI / 2),
  winGlow: (() => { const q = new THREE.PlaneGeometry(1, 1), uv = q.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * 0.5); return q; })(),          // left half of the window atlas: the halo
  winStreak: (() => { const q = new THREE.PlaneGeometry(1, 1), uv = q.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, 0.5 + uv.getX(i) * 0.5); return q; })(), // right half: the reflection
};
// a soft pool of lamplight: radial falloff
const poolTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 2, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.25, 'rgba(255,255,255,.6)'); r.addColorStop(0.6, 'rgba(255,255,255,.18)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
})();
// reflection streaks on wet asphalt: a bright core and two faint side streaks, broken by ripples, fading at both ends
const streakTex = (() => {
  const c = document.createElement('canvas'); c.width = 64; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, 64, 256);
  for (const [x, w, a] of [[32, 7, 1], [20, 3, 0.35], [45, 2, 0.3]]) {
    for (let y = 0; y < 256; y += 2) {
      const t = y / 255, fade = Math.pow(Math.sin(t * Math.PI), 1.6), rip = 0.55 + 0.45 * Math.sin(y * 0.55 + x) * Math.sin(y * 0.13);
      const ww = w * (0.7 + 0.5 * Math.sin(y * 0.21 + x));
      const k = a * fade * Math.max(0, rip); if (k <= 0.01) continue;
      const gr = g.createLinearGradient(x - ww, 0, x + ww, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, `rgba(255,255,255,${k})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(x - ww, y, ww * 2, 2);
    }
  }
  return new THREE.CanvasTexture(c);
})();
const LAMP_POOL_MAT = GlowMat(poolTex, 0xb0a07c, 1);
const LAMP_STREAK_MAT = GlowMat(streakTex, 0xd8c49a, 1);
// the visible cone of lamplight in the haze, painted soft-edged on a sprite that hangs from the lamp head: brightest under the head, gone near the ground
const coneTex = (() => {
  const W = 128, H = 128, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  for (let y = 0; y < H; y++) {
    const t = y / (H - 1), hw = (0.05 + 0.43 * t) * W, a = Math.pow(1 - t, 1.25) * 0.95;
    const r = g.createLinearGradient(W / 2 - hw, 0, W / 2 + hw, 0);
    r.addColorStop(0, 'rgba(255,255,255,0)'); r.addColorStop(0.18, `rgba(255,255,255,${a * 0.6})`); r.addColorStop(0.5, `rgba(255,255,255,${a})`); r.addColorStop(0.82, `rgba(255,255,255,${a * 0.6})`); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, y, W, 1);
  }
  return new THREE.CanvasTexture(c);
})();
const LAMP_CONE_MAT = GlowMat(coneTex, 0xd6c49c, 0.42, true);
const LAMP_HALO_MAT = GlowMat(glowTex, 0xffdca0, 0.85, true);
// lit windows: one atlas, a halo on the left and a wet reflection streak on the right, so a whole house of them is one draw call
const winTex = (() => {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,.9)'); r.addColorStop(0.3, 'rgba(255,255,255,.45)'); r.addColorStop(0.65, 'rgba(255,255,255,.1)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  g.drawImage(streakTex.image, 128, 0, 128, 128);
  return new THREE.CanvasTexture(c);
})();
const WIN_GLOW_MAT = GlowMat(winTex, 0xffb466, 0.55);
// a town's street light colour (light.lamp): orange sodium by a port, a cold LED in a new district. The halo, the cone, the pool and
// the reflection take its hue at their own brightness; null puts the warm white back. light.windows does the same for the window glow.
const LAMP_BASE = [[LAMP_HALO_MAT, 0xffdca0], [LAMP_CONE_MAT, 0xd6c49c], [LAMP_POOL_MAT, 0xb0a07c], [LAMP_STREAK_MAT, 0xd8c49a], [WIN_GLOW_MAT, 0xffb466]].map(([m, c]) => [m, new THREE.Color(c)]);
const _tint = new THREE.Color(), lum = c => c.r * 0.3 + c.g * 0.55 + c.b * 0.15;
function setTownLight(o = {}) {
  LAMP_BASE.forEach(([m, c], i) => {
    const hex = i === 4 ? o.windows : o.lamp; m.color.copy(c);
    if (hex != null) { _tint.set(hex); m.color.copy(_tint).multiplyScalar(lum(c) / Math.max(0.02, lum(_tint))); }
  });
}

export { LAMP_CONE_MAT, LAMP_HALO_MAT, LAMP_POOL_MAT, LAMP_STREAK_MAT, PG, PM, setTownLight, streakTex, WIN_GLOW_MAT };
