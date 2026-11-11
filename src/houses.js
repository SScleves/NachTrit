// Houses and the props that stand among them: brick, roof tile, wood and window textures painted once and shared, the
// townhouse builder, graffiti walls, pictograms, and the props of the street and the canal (tulip boxes, bollards, benches,
// fingerposts, the cheese cart, the drawbridge, reeds, boats, the church), listed in PROPS.
import { NODES, pick, rnd, THREE } from './engine.js?v=38';
import { NODEFX } from './render-nodes.js?v=38';
import { MAX_ANISO } from './render.js?v=38';
import { M, Mat, TINT } from './materials.js?v=38';
import { PG, PM, WIN_GLOW_MAT } from './props.js?v=38';
import { kadd, kat, kb, kBike, kbuild, kCrate, KG, kit, kTulipBox, MODELS, PK, SIGN_GEO, SIGN_ICONS, signMat, worldUV } from './kit.js?v=38';
import { lamppost, townStyle, tree, windmill } from './furniture.js?v=38';
import { cart, fence, kGable, kModel, labelTexture, modelClone, signIcon, zombie, zombieParts } from './main.js?v=38';   // later modules, through the hub

// ---------- surfaces: brick, roof tiles, wood and window panes, painted once on canvases and shared by every house ----------
// kit parts with a wuv material get UVs from their position (metres per repeat), so a 22 m tower and a 4 m house show bricks of one size
const SURF_ANISO = Math.min(4, MAX_ANISO);
function surfTex(c, wrap) { const t = new THREE.CanvasTexture(c); if (wrap !== false) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = SURF_ANISO; return t; }
function seeded(n) { let s = n; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const brickTex = (() => {   // stretcher bond, 32 courses of 8: per-brick value, a lit top arris, a shadowed underside, rain streaks and soot
  const N = 512, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), r = seeded(41);
  g.fillStyle = 'rgb(128,124,120)'; g.fillRect(0, 0, N, N);
  const ch = 16, bw = 64;
  for (let row = 0; row < N / ch; row++) {
    const off = row % 2 ? bw / 2 : 0, y = row * ch;
    for (let i = 0; i < N / bw; i++) {
      const v = 200 + (r() - 0.5) * 64 - (r() < 0.08 ? 46 : 0), hue = (r() - 0.5) * 18, col = `rgb(${v + hue | 0},${v | 0},${v - hue * 0.7 | 0})`;
      for (const x of [i * bw + off, i * bw + off - N]) {   // the brick that runs off the right edge comes back on the left
        if (x + bw <= 0 || x >= N) continue;
        g.fillStyle = col; g.fillRect(x + 2, y + 2, bw - 3, ch - 3);
        g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(x + 2, y + 2, bw - 3, 2);
        g.fillStyle = 'rgba(0,0,0,0.14)'; g.fillRect(x + 2, y + ch - 3, bw - 3, 2);
      }
    }
  }
  for (let i = 0; i < 9000; i++) { g.fillStyle = r() < 0.5 ? `rgba(0,0,0,${0.05 + r() * 0.08})` : `rgba(255,255,255,${0.03 + r() * 0.05})`; g.fillRect(r() * N, r() * N, 1 + (r() < 0.2), 1); }
  for (let i = 0; i < 14; i++) {   // full height, so the repeat up a wall has no seam
    const x = r() * N, w = 6 + r() * 26, gr = g.createLinearGradient(x - w, 0, x + w, 0);
    gr.addColorStop(0, 'rgba(20,16,14,0)'); gr.addColorStop(0.5, `rgba(20,16,14,${0.05 + r() * 0.09})`); gr.addColorStop(1, 'rgba(20,16,14,0)');
    g.fillStyle = gr; for (const ox of [-N, 0, N]) g.fillRect(x - w + ox, 0, w * 2, N);
  }
  return surfTex(c);
})();
const roofTex = (() => {   // pantile courses down the slope, each lip throwing a dark line on the course below
  const N = 256, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), r = seeded(59);
  g.fillStyle = 'rgb(96,96,100)'; g.fillRect(0, 0, N, N);
  const th = 16, tw = 32;
  for (let row = 0; row < N / th; row++) {
    const off = row % 2 ? tw / 2 : 0, y = row * th;
    for (let i = 0; i < N / tw; i++) {
      const v = 176 + (r() - 0.5) * 70, col = `rgb(${v | 0},${v | 0},${v + 5 | 0})`;
      for (const x of [i * tw + off, i * tw + off - N]) {
        if (x + tw <= 0 || x >= N) continue;
        const gr = g.createLinearGradient(x, 0, x + tw, 0); gr.addColorStop(0, col); gr.addColorStop(0.5, `rgb(${v + 22 | 0},${v + 22 | 0},${v + 26 | 0})`); gr.addColorStop(1, col);
        g.fillStyle = gr; g.fillRect(x + 1, y, tw - 2, th - 3); g.fillStyle = 'rgba(0,0,0,0.38)'; g.fillRect(x + 1, y + th - 4, tw - 2, 3);
      }
    }
  }
  for (let i = 0; i < 2500; i++) { g.fillStyle = r() < 0.6 ? `rgba(0,0,0,${0.06 + r() * 0.1})` : `rgba(120,140,110,${0.05 + r() * 0.08})`; g.fillRect(r() * N, r() * N, 1 + (r() < 0.3), 1); }
  return surfTex(c);
})();
const woodTex = (() => {   // weathered boards: grain lines along u, a seam every 64 px, knots
  const N = 256, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), r = seeded(83);
  g.fillStyle = 'rgb(176,168,160)'; g.fillRect(0, 0, N, N);
  for (let b = 0; b < N / 64; b++) { const v = 186 + (r() - 0.5) * 50; g.fillStyle = `rgb(${v | 0},${v - 6 | 0},${v - 12 | 0})`; g.fillRect(0, b * 64 + 2, N, 60); g.fillStyle = 'rgba(0,0,0,0.45)'; g.fillRect(0, b * 64, N, 2); }
  for (let i = 0; i < 160; i++) { const y = r() * N, a = 0.05 + r() * 0.12; g.strokeStyle = `rgba(40,28,20,${a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= N; x += 16) g.lineTo(x, y + Math.sin(x * 0.03 + i) * 1.6); g.stroke(); }
  for (let i = 0; i < 10; i++) { const x = r() * N, y = r() * N; g.fillStyle = 'rgba(40,26,18,0.45)'; g.beginPath(); g.ellipse(x, y, 5 + r() * 4, 2.2, 0, 0, 7); g.fill(); }
  return surfTex(c);
})();
// the damp rises from the pavement: walls darken toward their foot (object y, so a house on a dyke darkens at its own foot)
function dampen(m, low) {
  if (NODES) return NODEFX.damp(m, low);
  const prev = m.onBeforeCompile, prevKey = Object.prototype.hasOwnProperty.call(m, 'customProgramCacheKey') ? m.customProgramCacheKey : null;
  m.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vLY;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvLY = position.y;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vLY;')
      .replace('#include <map_fragment>', `#include <map_fragment>\ndiffuseColor.rgb *= mix(${low.toFixed(2)}, 1.0, smoothstep(0.05, 1.9, vLY));`);
  };
  m.customProgramCacheKey = () => (prevKey ? prevKey() : '') + 'damp' + low.toFixed(2);
  return m;
}
// shared: a quiz prop is cleaned up with its own textures, never with these
function surfMat(opts, tint, wuv, damp) { const m = Mat(opts, tint); m.userData.shared = true; m.userData.wuv = wuv; return damp ? dampen(m, damp) : m; }
const brickMats = new Map();
function brickMat(col) { if (!brickMats.has(col)) brickMats.set(col, surfMat({ color: col, map: brickTex }, TINT.warm, 2.6, 0.5)); return brickMats.get(col); }
const brickMats2 = new Map();
function brickMat2(col) { if (!brickMats2.has(col)) brickMats2.set(col, surfMat({ color: col, map: brickTex, side: THREE.DoubleSide }, TINT.warm, 2.6, 0.5)); return brickMats2.get(col); }
PM.roof = surfMat({ color: 0x2a2c32, map: roofTex }, TINT.cool, 3.2);   // roofs, chimney caps and spires: slate and pantile courses
M.wood.map = woodTex; M.wood.userData.shared = true; M.wood.userData.wuv = 1.4;
// kit parts already get world UVs; a landmark built from plain meshes gets them here, once, on its own geometries
function surfUV(root) { root.traverse(m => { if (m.isMesh && m.material && m.material.userData && m.material.userData.wuv && m.geometry && !m.geometry.userData.wuvDone && !m.geometry.userData.kit) { worldUV(m.geometry, m.material.userData.wuv); m.geometry.userData.wuvDone = true; } }); return root; }
// lit windows: frame, glazing bars and what is behind the glass in one atlas, so a window is one quad
// cells 0 to 5 are panes (0 to 2 lit, 3 a dim room, 4 and 5 dark), the lower half holds two shop interiors
const winAtlas = (() => {
  const W = 1024, H = 512, cw = W / 6, chh = 256, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), r = seeded(73);
  const FX = 18, FY = 17, gw = cw - FX * 2, gh = chh - FY * 2;
  const warm = k => { const gr = g.createLinearGradient(0, 0, 0, gh); gr.addColorStop(0, `rgb(${255 * k | 0},${224 * k | 0},${164 * k | 0})`); gr.addColorStop(0.55, `rgb(${246 * k | 0},${180 * k | 0},${100 * k | 0})`); gr.addColorStop(1, `rgb(${206 * k | 0},${132 * k | 0},${64 * k | 0})`); g.fillStyle = gr; g.fillRect(0, 0, gw, gh);
    const lamp = g.createRadialGradient(gw * 0.5, gh * 0.16, 0, gw * 0.5, gh * 0.16, gw * 0.95); lamp.addColorStop(0, `rgba(255,244,210,${0.5 * k})`); lamp.addColorStop(1, 'rgba(255,244,210,0)'); g.fillStyle = lamp; g.fillRect(0, 0, gw, gh); };
  const room = () => {   // the room behind: a lampshade, a chair back, the table edge
    g.fillStyle = 'rgba(60,30,14,0.5)'; g.fillRect(0, gh * 0.8, gw, gh * 0.2); g.fillRect(gw * 0.14, gh * 0.58, gw * 0.07, gh * 0.24); g.fillRect(gw * 0.14, gh * 0.58, gw * 0.22, gh * 0.04);
    g.fillStyle = 'rgba(90,44,18,0.45)'; g.beginPath(); g.moveTo(gw * 0.56, gh * 0.08); g.lineTo(gw * 0.78, gh * 0.08); g.lineTo(gw * 0.84, gh * 0.2); g.lineTo(gw * 0.5, gh * 0.2); g.fill(); g.fillRect(gw * 0.665, 0, 3, gh * 0.08);
  };
  const curtains = (col, fold, open) => { for (const s of [0, 1]) { g.save(); if (s) { g.translate(gw, 0); g.scale(-1, 1); } g.fillStyle = col; g.beginPath(); g.moveTo(0, 0); g.lineTo(gw * open, 0); g.quadraticCurveTo(gw * open * 0.55, gh * 0.48, gw * 0.12, gh * 0.55); g.quadraticCurveTo(gw * open * 0.75, gh * 0.75, gw * open * 0.9, gh); g.lineTo(0, gh); g.fill(); g.strokeStyle = fold; g.lineWidth = 3; for (let x = 8; x < gw * open; x += 11) { g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x * 0.6, gh * 0.5, x * 0.8, gh); g.stroke(); } g.restore(); } };
  const pane = (i, paint) => {
    g.save(); g.translate(i * cw, 0); g.fillStyle = '#42403c'; g.fillRect(0, 0, cw, chh);
    g.save(); g.translate(FX, FY); g.beginPath(); g.rect(0, 0, gw, gh); g.clip(); paint(); g.restore();
    g.fillStyle = '#34322f'; g.fillRect(FX, FY + gh * 0.32, gw, 7); g.fillRect(FX + gw / 2 - 3, FY + gh * 0.32, 6, gh * 0.68); for (const t of [1 / 3, 2 / 3]) g.fillRect(FX + gw * t - 2, FY, 4, gh * 0.32);
    g.strokeStyle = 'rgba(0,0,0,0.4)'; g.lineWidth = 4; g.strokeRect(FX + 2, FY + 2, gw - 4, gh - 4);
    g.fillStyle = '#504e49'; g.fillRect(4, chh - FY, cw - 8, 6);   // the sill
    g.restore();
  };
  pane(0, () => { warm(1); room(); });
  pane(1, () => { warm(1); curtains('rgb(150,62,40)', 'rgba(70,20,10,0.5)', 0.36); });
  pane(2, () => { warm(0.95); g.fillStyle = 'rgba(255,240,214,0.82)'; g.beginPath(); g.moveTo(0, gh * 0.56); for (let x = 0; x <= gw; x += gw / 8) g.quadraticCurveTo(x + gw / 16, gh * 0.6, x + gw / 8, gh * 0.56); g.lineTo(gw, gh); g.lineTo(0, gh); g.fill(); g.fillStyle = 'rgba(160,110,60,0.35)'; for (let i = 0; i < 90; i++) g.fillRect(r() * gw, gh * 0.6 + r() * gh * 0.4, 2, 2); });
  pane(3, () => { warm(0.5); const gl = g.createRadialGradient(gw * 0.78, gh * 0.7, 0, gw * 0.78, gh * 0.7, gw * 0.5); gl.addColorStop(0, 'rgba(255,200,120,0.55)'); gl.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gl; g.fillRect(0, 0, gw, gh); g.fillStyle = 'rgba(40,20,10,0.5)'; g.fillRect(0, gh * 0.82, gw, gh * 0.18); });
  pane(4, () => { const gr = g.createLinearGradient(0, 0, 0, gh); gr.addColorStop(0, '#3a4350'); gr.addColorStop(1, '#14171d'); g.fillStyle = gr; g.fillRect(0, 0, gw, gh); g.fillStyle = 'rgba(150,170,190,0.12)'; g.beginPath(); g.moveTo(gw * 0.15, 0); g.lineTo(gw * 0.45, 0); g.lineTo(gw * 0.05, gh * 0.7); g.lineTo(0, gh * 0.62); g.fill(); });
  pane(5, () => { g.fillStyle = '#16181e'; g.fillRect(0, 0, gw, gh); curtains('rgb(44,36,42)', 'rgba(0,0,0,0.5)', 0.52); g.fillStyle = '#0c0d10'; g.fillRect(gw / 2 - 8, gh * 0.6, 16, 16); });   // the dark patch: silhouettes on a sill sample it
  const shop = (i, paint) => { g.save(); g.translate(i * 512, 256); g.beginPath(); g.rect(0, 0, 512, 256); g.clip(); const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, 'rgb(236,200,144)'); gr.addColorStop(1, 'rgb(184,122,60)'); g.fillStyle = gr; g.fillRect(0, 0, 512, 256); paint(); g.restore(); };
  shop(0, () => {   // shelves of goods behind the counter: wheels, jars, loaves
    for (const y of [70, 140]) { g.fillStyle = 'rgba(70,40,18,0.75)'; g.fillRect(0, y, 512, 8); for (let x = 10; x < 500; x += 26 + r() * 10) { const k = r(); g.fillStyle = k < 0.4 ? 'rgb(236,176,60)' : k < 0.7 ? 'rgb(150,70,40)' : 'rgb(190,120,70)'; if (k < 0.4) { g.beginPath(); g.ellipse(x + 11, y - 9, 12, 9, 0, 0, 7); g.fill(); } else g.fillRect(x, y - 20 - r() * 10, 16, 20 + r() * 10); } }
    g.fillStyle = 'rgba(60,32,16,0.85)'; g.fillRect(0, 196, 512, 60); g.fillStyle = 'rgba(255,230,190,0.3)'; g.fillRect(0, 196, 512, 4);
    for (const x of [120, 380]) { const gl = g.createRadialGradient(x, 8, 0, x, 8, 120); gl.addColorStop(0, 'rgba(255,250,230,0.42)'); gl.addColorStop(1, 'rgba(255,250,230,0)'); g.fillStyle = gl; g.fillRect(0, 0, 512, 256); }
  });
  shop(1, () => {   // a cafe: hanging lamps over tables, chair backs, the bar along the back
    g.fillStyle = 'rgba(80,40,18,0.6)'; g.fillRect(0, 120, 512, 30);
    for (const x of [80, 230, 380]) { g.fillStyle = 'rgba(40,22,10,0.8)'; g.fillRect(x - 1, 0, 2, 54); g.beginPath(); g.moveTo(x - 22, 70); g.lineTo(x + 22, 70); g.lineTo(x + 12, 54); g.lineTo(x - 12, 54); g.fill(); const gl = g.createRadialGradient(x, 76, 0, x, 76, 70); gl.addColorStop(0, 'rgba(255,240,200,0.75)'); gl.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gl; g.fillRect(x - 70, 6, 140, 140);
      g.fillStyle = 'rgba(50,26,12,0.85)'; g.fillRect(x - 40, 196, 80, 8); g.fillRect(x - 4, 204, 8, 52); g.fillRect(x - 58, 176, 8, 80); g.fillRect(x + 50, 176, 8, 80); }
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = SURF_ANISO; return t;
})();
PM.winAtlas = new THREE.MeshBasicMaterial({ map: winAtlas }); PM.winAtlas.userData.shared = true;
function atlasQuad(u0, v0, u1, v1) { const p = new THREE.PlaneGeometry(1, 1), uv = p.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, u0 + uv.getX(j) * (u1 - u0), v0 + uv.getY(j) * (v1 - v0)); return p; }
for (let i = 0; i < 6; i++) PG['win' + i] = atlasQuad(i / 6, 0.5, (i + 1) / 6, 1);
for (let i = 0; i < 2; i++) PG['shop' + i] = atlasQuad(i / 2, 0, (i + 1) / 2, 0.5);
// pieces of the atlas for the small parts of a house, so they cost no material of their own:
// the transom of a pane as a fanlight, the lower sash as a cellar window, a frame-coloured patch, one dark texel for silhouettes
{
  const cw = 1 / 6, fx = 18 / 1024, top = 1 - 17 / 512, tr = 1 - 88 / 512;
  for (const i of [0, 3]) PG['fan' + i] = atlasQuad(i * cw + fx, tr, (i + 1) * cw - fx, top);
  for (const i of [3, 4]) PG['cellar' + i] = atlasQuad(i * cw, 0.5, (i + 1) * cw, 1 - 95 / 512);
  PG.frameSolid = atlasQuad(4 * cw + 4 / 1024, 1 - 12 / 512, 4 * cw + 12 / 1024, 1 - 4 / 512);
  const du = 5 * cw + (18 + (1024 / 6 - 36) / 2) / 1024, dv = 1 - (17 + 222 * 0.6 + 8) / 512;
  for (const [key, src] of [['catA', KG.cat], ['plantA', KG.plant]]) { const q = src.clone(), uv = q.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, du, dv); PG[key] = q; }
}
const WIN_LIT = [0, 0, 1, 1, 2];
// water and puddles hold the sky: unlit, coloured from the haze in tintFar(), lighter toward the horizon through the fog
const waterTex = (() => {   // long ripples across the canal, lighter where they catch the sky
  const N = 256, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), r = seeded(131);
  g.fillStyle = 'rgb(176,176,176)'; g.fillRect(0, 0, N, N);
  for (let i = 0; i < 240; i++) { const y = r() * N, x = r() * N, w = 30 + r() * 150, lite = r() < 0.55; g.fillStyle = lite ? `rgba(255,255,255,${0.12 + r() * 0.24})` : `rgba(0,0,0,${0.08 + r() * 0.16})`; for (const ox of [-N, 0, N]) g.fillRect(x - w / 2 + ox, y, w, 2 + (r() < 0.3)); }
  return surfTex(c);
})();
M.water.map = waterTex; M.water.userData.shared = true;
const puddleTex = (() => {   // bright and cold in the middle, a soft wet rim, no hard edge
  const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), r = seeded(151);
  const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(0.55, 'rgba(236,240,248,0.8)'); gr.addColorStop(0.82, 'rgba(170,178,192,0.4)'); gr.addColorStop(1, 'rgba(120,128,140,0)');
  g.fillStyle = gr; g.fillRect(0, 0, N, N);
  g.strokeStyle = 'rgba(60,66,76,0.35)'; g.lineWidth = 1.5; for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(64 + (r() - 0.5) * 30, 64 + (r() - 0.5) * 30, 8 + r() * 26, 4 + r() * 12, r() * 3, 0, 7); g.stroke(); }
  return surfTex(c, false);
})();
M.puddle.map = puddleTex; M.puddle.userData.shared = true;
// reeds as one painted card per clump that turns to the eye: thin geometry blades under the ink pass read as black scribbles
const reedTex = (() => {
  const W = 512, H = 256, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), r = seeded(97);
  g.fillStyle = g.strokeStyle = '#fff'; g.lineCap = 'round';
  for (let i = 0; i < 150; i++) {
    const u = 0.06 + r() * 0.88, x = W * u, h = H * (0.35 + r() * 0.6) * (1 - Math.abs(u - 0.5) * 0.9), lean = (r() - 0.5) * 0.9 + (u - 0.5) * 0.8;
    g.lineWidth = 2.2 + r() * 2.6; g.beginPath(); g.moveTo(x, H); g.quadraticCurveTo(x + lean * h * 0.3, H - h * 0.6, x + lean * h * 0.75, H - h); g.stroke();
    if (r() < 0.12) { g.save(); g.translate(x + lean * h * 0.62, H - h * 0.86); g.rotate(lean * 0.6); g.beginPath(); g.ellipse(0, 0, 5, 15, 0, 0, 7); g.fill(); g.restore(); }   // a bulrush head
  }
  for (let i = 0; i < 260; i++) { const x = W * (0.04 + r() * 0.92), h = 20 + r() * 50; g.lineWidth = 2 + r() * 2; g.beginPath(); g.moveTo(x, H); g.lineTo(x + (r() - 0.5) * 24, H - h); g.stroke(); }   // the dense foot
  g.fillRect(W * 0.08, H - 10, W * 0.84, 10);
  return new THREE.CanvasTexture(c);   // alpha only: the material colour makes it a silhouette
})();
const REED_MAT = new THREE.MeshBasicMaterial({ map: reedTex, color: 0x121815, alphaTest: 0.5, side: THREE.DoubleSide }); REED_MAT.userData.shared = true;
PG.reedCard = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0);
function house(opts = {}) {
  // every part goes into one kit and comes out as one mesh per material: shutters, cellar windows, chimneys and gutters cost no extra draw calls
  // a terrace passes its own kit (opts.k) and where this house stands in it (ox, oz): a whole row is then one mesh per material. plain: the back row, windows and roofs only
  const g = opts.g || new THREE.Group(); const st = townStyle; const k = opts.k || kit(), ox = opts.ox || 0, oz = opts.oz || 0, plain = !!opts.plain; kat(k, ox, 0, oz);
  const w = opts.w || rnd(st.width[0], st.width[1]), h = opts.h || rnd(st.height[0], st.height[1]) * (opts.tall || 1), dpt = 6, fx = -w / 2;   // fx: the street facade
  const mat = brickMat(opts.brick || pick(st.brick)), shop = !!opts.sign, doorZ = dpt / 2 - 0.9;
  kb(k, mat, 0, h / 2, 0, w, h, dpt);
  const gable = opts.gable || (Math.random() < st.gables ? pick(['step', 'step', 'bell', 'neck', 'spout']) : 'roof');
  // a pitched roof of two tiled slabs, the ridge running from the street to the back. No end cap: a dark triangle in front of a shaped gable read as a hole in it
  const ridge = dpt * 0.36, run = dpt / 2 + 0.15, slope = Math.atan2(ridge, run), sl = Math.hypot(run, ridge);
  const front = gable === 'roof' ? 0.15 : -0.06, rl = w + 0.15 + front, rcx = (0.15 - front) / 2;   // overhang the street on a plain roof, stop behind a shaped gable
  for (const s of [-1, 1]) kb(k, PM.roof, rcx, h - 0.02 + ridge / 2, s * run / 2, rl, 0.1, sl, s * slope, 0, 0);
  kb(k, PM.roof, rcx, h + ridge + 0.01, 0, rl, 0.12, 0.3);
  if (gable === 'roof') {   // the plain end is brick up to the ridge, front and back, often with an attic window
    const tri = new THREE.Shape(); tri.moveTo(-dpt / 2, 0); tri.lineTo(dpt / 2, 0); tri.lineTo(0, ridge); tri.closePath();
    const tg = new THREE.ShapeGeometry(tri); kadd(k, tg, brickMat2(mat.color.getHex()), fx - 0.012, h - 0.02, 0, 0, Math.PI / 2, 0); kadd(k, tg, brickMat2(mat.color.getHex()), w / 2 + 0.012, h - 0.02, 0, 0, Math.PI / 2, 0); tg.dispose();
    if (!plain && Math.random() < 0.6) { const lit = Math.random() < 0.35; kadd(k, PG['win' + (lit ? pick(WIN_LIT) : 4)], PM.winAtlas, fx - 0.02, h + ridge * 0.36, 0, 0, -Math.PI / 2, 0, 0.62, 0.9); if (lit) kadd(k, PG.winGlow, WIN_GLOW_MAT, fx - 0.07, h + ridge * 0.36, 0, 0, -Math.PI / 2, 0, 1.9, 2.1); }
  }
  // the gable: a flat shaped facade on the street side that rises above the roof and hides it
  if (gable !== 'roof' && !kGable(k, gable, mat, fx, h, plain, opts)) {
    const hw = dpt / 2 + 0.05, top = ridge + rnd(0.6, 1.4);
    const sh = new THREE.Shape(); sh.moveTo(-hw, -0.3); sh.lineTo(hw, -0.3);
    if (gable === 'step') { const steps = 3 + Math.floor(Math.random() * 3); const sw = hw * 0.3; for (let i = 1; i <= steps; i++) { const u = hw - (hw - sw) * i / steps, v = top * i / steps; sh.lineTo(u, v - top / steps); sh.lineTo(u, v); } sh.lineTo(-sw, top); for (let i = steps - 1; i >= 0; i--) { const u = hw - (hw - sw) * i / steps, v = top * i / steps; sh.lineTo(-u, v + top / steps); sh.lineTo(-u, v); } }
    else if (gable === 'bell') { const tw = hw * 0.38; sh.lineTo(hw, top * 0.35); sh.quadraticCurveTo(hw * 0.55, top * 0.45, tw, top * 0.8); sh.lineTo(tw + 0.15, top * 0.8); sh.lineTo(tw + 0.15, top * 0.9); sh.lineTo(-tw - 0.15, top * 0.9); sh.lineTo(-tw - 0.15, top * 0.8); sh.lineTo(-tw, top * 0.8); sh.quadraticCurveTo(-hw * 0.55, top * 0.45, -hw, top * 0.35); }
    else if (gable === 'neck') { const nw = hw * 0.42; sh.lineTo(hw, top * 0.3); sh.lineTo(nw + 0.2, top * 0.3); sh.lineTo(nw, top * 0.4); sh.lineTo(nw, top * 0.85); sh.lineTo(nw + 0.25, top * 0.85); sh.lineTo(nw + 0.25, top); sh.lineTo(-nw - 0.25, top); sh.lineTo(-nw - 0.25, top * 0.85); sh.lineTo(-nw, top * 0.85); sh.lineTo(-nw, top * 0.4); sh.lineTo(-nw - 0.2, top * 0.3); sh.lineTo(-hw, top * 0.3); }
    else { sh.lineTo(hw, 0.2); sh.lineTo(0.45, top); sh.lineTo(-0.45, top); sh.lineTo(-hw, 0.2); }
    sh.closePath();
    const sg = new THREE.ShapeGeometry(sh); kadd(k, sg, brickMat2(mat.color.getHex()), fx - 0.03, h, 0, 0, Math.PI / 2, 0); sg.dispose();
    kb(k, PM.pole, fx - 0.45, h + top * 0.7, 0, 0.9, 0.12, 0.12);   // hijsbalk
  }
  // chimneys poke up through the roof, behind the gable if there is one
  const nch = Math.random() < 0.8 ? 1 + (Math.random() < 0.35 ? 1 : 0) : 0;
  for (let i = 0; i < nch; i++) {
    const cz = (i ? -1 : 1) * (Math.random() < 0.5 ? 1 : -1) * rnd(0.7, 1.8), cx = gable !== 'roof' ? rnd(0, w / 2 - 0.5) : rnd(-w / 2 + 0.6, w / 2 - 0.6);
    const ry = h + ridge * (1 - Math.abs(cz) / (dpt / 2 + 0.15));
    kb(k, mat, cx, ry + 0.45, cz, 0.55, 1.6, 0.55); kb(k, PM.roof, cx, ry + 1.29, cz, 0.72, 0.1, 0.72);
  }
  // gutters along both eaves and a downpipe at the corner
  if (!plain) { for (const s of [-1, 1]) kb(k, PM.pole, 0, h - 0.06, s * (dpt / 2 + 0.22), w + 0.3, 0.1, 0.12); kb(k, PM.pole, fx - 0.06, h / 2, dpt / 2 - 0.08, 0.08, h, 0.08); }
  // windows in rows with pale frames and glazing bars; shutters beside some, a cat or a pot of tulips in an occasional lit one
  const cols = Math.max(1, Math.round(dpt / 2.1)), rows = Math.max(1, Math.round((h - 1.2) / 2.3));
  const litP = opts.lit == null ? 0.35 : opts.lit;
  const shut = Math.random() < 0.45 ? pick(PK.shutters) : null; let pet = Math.random() < 0.35;
  const yaw = -Math.PI / 2;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const y = 1.9 + r * 2.3, z = -dpt / 2 + 1.05 + c * 2.1;
    if (r === 0 && (shop || Math.abs(z - doorZ) < 1.0)) continue;   // the shop window or the door has this spot
    const r0 = Math.random(), lit = r0 < litP, cell = lit ? pick(WIN_LIT) : r0 < litP + 0.2 ? 3 : Math.random() < 0.7 ? 4 : 5;
    kadd(k, PG['win' + cell], PM.winAtlas, fx - 0.012, y, z, 0, yaw, 0, 0.95, 1.5);   // frame, glazing bars and the room behind, one quad
    if (lit) {   // warm light spilling onto the brick, and its streak on the wet pavement below
      kadd(k, PG.winGlow, WIN_GLOW_MAT, fx - 0.07, y, z, 0, yaw, 0, 2.5, 2.9);
      if (r < 2 && !plain) kadd(k, PG.winStreak, WIN_GLOW_MAT, fx - 0.95, 0.09, z, -Math.PI / 2, 0, 0, 0.9, 3.2 + r * 1.6);
      if (opts.reflect) kadd(k, PG.winStreak, WIN_GLOW_MAT, fx - opts.reflect, 0.04, z, -Math.PI / 2, 0, Math.PI / 2, 1.0, opts.reflect * 2 - 0.6);   // across the water the reflection runs back toward the eye
    }
    if (plain) continue;
    if (lit && pet) { kadd(k, PG.catA, PM.winAtlas, fx - 0.02, y - 0.64, z + 0.08, 0, yaw, 0, 0.9, 0.9); pet = false; }
    else if (lit && Math.random() < 0.2) kadd(k, PG.plantA, PM.winAtlas, fx - 0.02, y - 0.64, z - 0.18, 0, yaw, 0, 0.9, 0.9);
    if (shut && r < 2) for (const s of [-1, 1]) { const sz = z + s * 0.64; if (Math.abs(sz) < dpt / 2 - 0.2 && !(r === 0 && Math.abs(sz - doorZ) < 0.75)) kb(k, shut, fx - 0.04, y, sz, 0.05, 1.4, 0.34); }
    if (r === 0) {   // a cellar window at pavement level, barred
      kadd(k, Math.random() < 0.3 ? PG.cellar3 : PG.cellar4, PM.winAtlas, fx - 0.012, 0.36, z, 0, yaw, 0, 0.72, 0.4);
      for (const bz of [-0.15, 0, 0.15]) kb(k, PM.pole, fx - 0.03, 0.36, z + bz, 0.02, 0.3, 0.02);
    }
  }
  // the door, its frame and fanlight, the stoop and a lamp beside it
  if (!plain) {
  kadd(k, KG.plane, M.wood, fx - 0.01, 1.0, doorZ, 0, yaw, 0, 0.9, 2.0); kadd(k, PG.frameSolid, PM.winAtlas, fx - 0.004, 1.2, doorZ, 0, yaw, 0, 1.1, 2.55);
  kadd(k, Math.random() < 0.5 ? PG.fan3 : PG.fan0, PM.winAtlas, fx - 0.012, 2.27, doorZ, 0, yaw, 0, 0.86, 0.26);
  kb(k, PM.stone, fx - 0.25, 0.12, doorZ, 0.5, 0.25, 1.2);
  if (Math.random() < 0.4) kadd(k, KG.ball, PM.bulb, fx - 0.1, 2.0, doorZ - 0.75, 0, 0, 0, 0.14, 0.14, 0.14);
  // in front: a hedge, a picket fence, or a bike chained to the stoop railing; shops get crates instead
  const front = shop ? 'shop' : pick(['hedge', 'fence', 'fence', 'bike', 'bike', 'none', 'none']);
  const gz0 = -dpt / 2 + 0.05, gz1 = doorZ - 0.7, gl = gz1 - gz0, gzc = (gz0 + gz1) / 2;
  if (front === 'hedge') { const hh = rnd(0.75, 1.0); kb(k, PM.leaf, fx - 0.42, hh / 2, gzc - gl / 4, 0.5, hh, gl / 2); kb(k, PM.leaf, fx - 0.42, hh / 2 + 0.05, gzc + gl / 4, 0.5, hh + 0.1, gl / 2); }
  else if (front === 'fence') {
    for (const ry of [0.3, 0.62]) kb(k, M.wood, fx - 0.5, ry, gzc, 0.04, 0.06, gl);
    for (let z = gz0; z <= gz1; z += 0.16) { kb(k, M.wood, fx - 0.53, 0.38, z, 0.03, 0.76, 0.07); kb(k, M.wood, fx - 0.53, 0.76, z, 0.03, 0.05, 0.05, Math.PI / 4, 0, 0); }
    kb(k, M.wood, fx - 0.25, 0.62, gz0, 0.5, 0.06, 0.04);
    if (opts.peer !== false && Math.random() < 0.18) {   // one of the dead peering over the garden fence, as in the reference
      kat(k, ox + fx - 0.22, 0, oz + gzc + rnd(-0.5, 0.5), Math.PI / 2 + rnd(-0.3, 0.3), 0); for (const [geo, m] of zombieParts(pick(['plain', 'plain', 'bonnet', 'hat']))) kadd(k, geo, m || PK.skin[0], 0, 0, 0); kat(k, ox, 0, oz);
    }
  }
  else if (front === 'bike') {
    kb(k, PM.pole, fx - 0.5, 0.45, doorZ - 0.62, 0.04, 0.9, 0.04); kb(k, PM.pole, fx - 0.27, 0.88, doorZ - 0.62, 0.5, 0.04, 0.04);
    kat(k, ox + fx - 0.42, 0, oz + doorZ - 1.55, 0, -0.14); kBike(k, PM.pole, false, Math.random() < 0.4); kat(k, ox, 0, oz);
  }
  if (front !== 'hedge' && Math.random() < 0.35) kTulipBox(k, fx - 0.27, -dpt / 2 + 1.2);
  }
  if (shop) {
    const tex = labelTexture(opts.sign, { bg: '#1b1d21', fg: '#d4cdb9' });
    const sgn = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.9), Mat({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.45 }));
    sgn.position.set(ox + fx - 0.05, 3.5, oz); sgn.rotation.y = yaw; sgn.userData.ownTex = true; g.add(sgn);
    kadd(k, PG[signIcon(opts.sign) === 'CAFÉ' ? 'shop1' : 'shop0'], PM.winAtlas, fx - 0.02, 1.4, -0.6, 0, yaw, 0, 3.6, 1.8);
    kadd(k, PG.winGlow, WIN_GLOW_MAT, fx - 0.08, 1.5, -0.6, 0, yaw, 0, 6.2, 4.2); kadd(k, PG.winStreak, WIN_GLOW_MAT, fx - 1.0, 0.09, -0.6, -Math.PI / 2, 0, 0, 2.6, 4.5);
    for (const bz of [-1.8, -0.6, 0.6]) kb(k, PM.pole, fx - 0.04, 1.4, bz, 0.04, 1.9, 0.07);
    kb(k, PM.pole, fx - 0.04, 0.48, -0.6, 0.05, 0.08, 3.7); kb(k, PM.pole, fx - 0.04, 2.32, -0.6, 0.05, 0.08, 3.7);
    // the hanging sign from the concept sheet: an iron bracket, two chains and a board with the trade on it
    const ic = SIGN_ICONS.indexOf(signIcon(opts.sign));
    const sz = -dpt / 2 + 0.35, smat = signMat(opts.quiz);
    kb(k, PM.pole, fx - 0.6, 3.1, sz, 1.2, 0.05, 0.05); kb(k, PM.pole, fx - 0.08, 2.85, sz, 0.05, 0.5, 0.05);
    for (const cx of [-0.42, -1.08]) kb(k, PM.pole, fx + cx, 3.0, sz, 0.015, 0.2, 0.015);
    kb(k, PM.pole, fx - 0.75, 2.5, sz, 0.86, 0.86, 0.02);
    kadd(k, SIGN_GEO[ic], smat, fx - 0.75, 2.5, sz + 0.012); kadd(k, SIGN_GEO[ic], smat, fx - 0.75, 2.5, sz - 0.012, 0, Math.PI, 0);
    if (Math.random() < 0.5) { kCrate(k, fx - 0.4, 0, -1.5, rnd(-0.1, 0.1), pick([PM.orange, PM.tulip, PM.cheese])); kCrate(k, fx - 0.4, 0, -0.9, rnd(-0.1, 0.1), pick([PM.orange, PM.cheese, null])); if (Math.random() < 0.5) kCrate(k, fx - 0.4, 0.4, -1.2, rnd(-0.2, 0.2), PM.orange); }
  }
  if (!opts.k) kbuild(k, g);
  g.userData.faceRoad = true;
  return g;
}
// little spray-paint pictures for words we know how to draw
const PICTO = {
  hond: g => { g.fillRect(30, 70, 70, 34); g.fillRect(96, 54, 26, 26); g.fillRect(34, 104, 10, 22); g.fillRect(86, 104, 10, 22); g.fillRect(14, 60, 18, 8); g.fillRect(104, 42, 8, 14); },
  kat: g => { g.fillRect(34, 72, 62, 34); g.fillRect(94, 50, 28, 28); g.fillRect(96, 38, 8, 12); g.fillRect(112, 38, 8, 12); g.fillRect(14, 50, 8, 36); g.fillRect(38, 106, 8, 20); g.fillRect(84, 106, 8, 20); },
  fiets: g => { g.lineWidth = 7; g.beginPath(); g.arc(38, 96, 24, 0, 7); g.arc(102, 96, 24, 0, 7); g.stroke(); g.beginPath(); g.moveTo(38, 96); g.lineTo(60, 50); g.lineTo(96, 50); g.lineTo(102, 96); g.moveTo(60, 50); g.lineTo(78, 96); g.stroke(); },
  huis: g => { g.beginPath(); g.moveTo(20, 70); g.lineTo(70, 24); g.lineTo(120, 70); g.closePath(); g.fill(); g.fillRect(32, 70, 76, 50); g.clearRect(60, 90, 20, 30); },
  kerk: g => { g.fillRect(40, 60, 60, 60); g.fillRect(58, 14, 24, 50); g.beginPath(); g.moveTo(54, 16); g.lineTo(70, 0); g.lineTo(86, 16); g.fill(); g.fillRect(68, 2, 4, 14); g.fillRect(62, 6, 16, 4); },
  molen: g => { g.beginPath(); g.moveTo(50, 124); g.lineTo(58, 60); g.lineTo(82, 60); g.lineTo(90, 124); g.fill(); g.lineWidth = 7; g.beginPath(); g.moveTo(70, 58); g.lineTo(30, 18); g.moveTo(70, 58); g.lineTo(110, 18); g.moveTo(70, 58); g.lineTo(30, 98); g.moveTo(70, 58); g.lineTo(110, 98); g.stroke(); },
  boom: g => { g.fillRect(62, 80, 16, 44); g.beginPath(); g.arc(70, 56, 34, 0, 7); g.fill(); },
  kaas: g => { g.beginPath(); g.moveTo(70, 70); g.arc(70, 70, 48, 0.3, 5.6); g.closePath(); g.fill(); g.clearRect(40, 50, 10, 10); g.clearRect(76, 86, 12, 12); },
  brood: g => { g.beginPath(); g.ellipse(70, 72, 50, 28, 0, 0, 7); g.fill(); g.lineWidth = 5; g.beginPath(); g.moveTo(48, 60); g.lineTo(58, 72); g.moveTo(68, 58); g.lineTo(78, 70); g.moveTo(88, 60); g.lineTo(98, 72); g.stroke(); },
  ei: g => { g.beginPath(); g.ellipse(70, 70, 34, 46, 0, 0, 7); g.fill(); },
  bier: g => { g.fillRect(44, 50, 46, 70); g.fillRect(90, 64, 14, 30); g.clearRect(44, 50, 46, 14); g.fillRect(40, 38, 54, 10); },
  koffie: g => { g.fillRect(36, 56, 60, 50); g.lineWidth = 7; g.beginPath(); g.arc(102, 78, 14, -1.5, 1.5); g.stroke(); g.fillRect(28, 106, 76, 8); g.lineWidth = 4; g.beginPath(); g.moveTo(54, 46); g.quadraticCurveTo(60, 34, 54, 24); g.moveTo(76, 46); g.quadraticCurveTo(82, 34, 76, 24); g.stroke(); },
  thee: g => { g.fillRect(36, 56, 60, 50); g.lineWidth = 7; g.beginPath(); g.arc(102, 78, 14, -1.5, 1.5); g.stroke(); g.fillRect(28, 106, 76, 8); g.fillRect(56, 20, 8, 36); g.fillRect(48, 12, 24, 14); },
  lamp: g => { g.beginPath(); g.arc(70, 54, 30, 0, 7); g.fill(); g.fillRect(58, 84, 24, 16); g.fillRect(52, 100, 36, 8); g.lineWidth = 5; g.beginPath(); g.moveTo(24, 54); g.lineTo(34, 54); g.moveTo(106, 54); g.lineTo(116, 54); g.moveTo(70, 8); g.lineTo(70, 18); g.stroke(); },
  deur: g => { g.fillRect(40, 20, 60, 104); g.clearRect(84, 68, 8, 8); },
  tuin: g => { for (let i = 0; i < 3; i++) { g.fillRect(36 + i * 28, 70, 6, 50); g.beginPath(); g.arc(39 + i * 28, 60, 12, 0, 7); g.fill(); } g.fillRect(20, 118, 100, 6); },
  brug: g => { g.lineWidth = 8; g.beginPath(); g.arc(70, 100, 48, Math.PI, 0); g.stroke(); g.fillRect(14, 100, 112, 8); g.fillRect(30, 60, 6, 40); g.fillRect(104, 60, 6, 40); },
  water: g => { g.lineWidth = 8; for (let y = 48; y <= 96; y += 24) { g.beginPath(); g.moveTo(16, y); for (let x = 16; x <= 124; x += 18) g.quadraticCurveTo(x + 9, y - 12, x + 18, y); g.stroke(); } },
  boot: g => { g.beginPath(); g.moveTo(20, 84); g.lineTo(120, 84); g.lineTo(104, 112); g.lineTo(36, 112); g.closePath(); g.fill(); g.fillRect(66, 24, 6, 60); g.beginPath(); g.moveTo(72, 28); g.lineTo(108, 76); g.lineTo(72, 76); g.fill(); },
  vrouw: g => { g.beginPath(); g.arc(70, 34, 16, 0, 7); g.fill(); g.beginPath(); g.moveTo(70, 52); g.lineTo(40, 110); g.lineTo(100, 110); g.fill(); g.fillRect(60, 110, 6, 16); g.fillRect(74, 110, 6, 16); },
  man: g => { g.beginPath(); g.arc(70, 34, 16, 0, 7); g.fill(); g.fillRect(56, 52, 28, 50); g.fillRect(58, 102, 9, 24); g.fillRect(73, 102, 9, 24); g.fillRect(40, 56, 14, 8); g.fillRect(86, 56, 14, 8); },
  zon: g => { g.beginPath(); g.arc(70, 70, 26, 0, 7); g.fill(); g.lineWidth = 6; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g.beginPath(); g.moveTo(70 + Math.cos(a) * 36, 70 + Math.sin(a) * 36); g.lineTo(70 + Math.cos(a) * 54, 70 + Math.sin(a) * 54); g.stroke(); } },
  maan: g => { g.beginPath(); g.arc(70, 70, 40, 0, 7); g.fill(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(88, 60, 36, 0, 7); g.fill(); g.globalCompositeOperation = 'source-over'; },
  hart: g => { g.beginPath(); g.moveTo(70, 118); g.bezierCurveTo(10, 70, 30, 14, 70, 48); g.bezierCurveTo(110, 14, 130, 70, 70, 118); g.fill(); },
  bal: g => { g.beginPath(); g.arc(70, 70, 40, 0, 7); g.fill(); g.clearRect(56, 30, 6, 80); g.clearRect(30, 66, 80, 6); },
  tasje: g => { g.fillRect(36, 56, 68, 64); g.lineWidth = 7; g.beginPath(); g.arc(70, 56, 20, Math.PI, 0); g.stroke(); },
  melk: g => { g.fillRect(44, 44, 52, 80); g.beginPath(); g.moveTo(44, 44); g.lineTo(56, 20); g.lineTo(84, 20); g.lineTo(96, 44); g.fill(); },
  appel: g => { g.beginPath(); g.arc(58, 76, 32, 0, 7); g.arc(82, 76, 32, 0, 7); g.fill(); g.fillRect(68, 30, 5, 22); },
  wijn: g => { g.beginPath(); g.moveTo(40, 30); g.lineTo(100, 30); g.quadraticCurveTo(100, 84, 70, 86); g.quadraticCurveTo(40, 84, 40, 30); g.fill(); g.fillRect(67, 86, 6, 26); g.fillRect(48, 112, 44, 6); },
  sleutel: g => { g.lineWidth = 8; g.beginPath(); g.arc(44, 60, 22, 0, 7); g.stroke(); g.fillRect(60, 56, 64, 9); g.fillRect(104, 65, 8, 16); g.fillRect(88, 65, 8, 12); },
  klok: g => { g.lineWidth = 8; g.beginPath(); g.arc(70, 70, 44, 0, 7); g.stroke(); g.fillRect(67, 36, 6, 38); g.fillRect(70, 68, 26, 6); },
  trein: g => { g.fillRect(16, 50, 108, 50); g.fillRect(24, 36, 40, 16); g.clearRect(32, 60, 20, 16); g.clearRect(70, 60, 20, 16); g.clearRect(98, 60, 16, 16); g.beginPath(); g.arc(40, 108, 10, 0, 7); g.arc(100, 108, 10, 0, 7); g.fill(); },
  bus: g => { g.fillRect(16, 40, 108, 60); g.clearRect(26, 50, 24, 20); g.clearRect(58, 50, 24, 20); g.clearRect(90, 50, 24, 20); g.beginPath(); g.arc(40, 108, 10, 0, 7); g.arc(100, 108, 10, 0, 7); g.fill(); },
  laptop: g => { g.fillRect(30, 30, 80, 54); g.clearRect(36, 36, 68, 42); g.fillRect(16, 86, 108, 10); },
  golfbaan: g => { g.fillRect(66, 20, 5, 90); g.beginPath(); g.moveTo(71, 22); g.lineTo(110, 36); g.lineTo(71, 50); g.fill(); g.beginPath(); g.arc(50, 112, 8, 0, 7); g.fill(); g.fillRect(20, 118, 100, 6); },
};
PICTO.station = PICTO.trein;
const PICTO_ALIAS = { honden: 'hond', hondje: 'hond', huizen: 'huis', biertje: 'bier', winkel: 'deur', nummer: 'deur', buurman: 'man', buurvrouw: 'vrouw', collega: 'man', docent: 'man', slager: 'man', ober: 'man', kaasmarkt: 'kaas', stroopwafel: 'koffie', zegels: 'tasje', pont: 'boot', dijk: 'water', gracht: 'water', ladder: 'deur', hek: 'deur', bank: 'deur', park: 'boom', riem: 'hond', bushalte: 'bus', kaartje: 'trein', scherm: 'laptop', dashboard: 'laptop', vergadering: 'klok', weekend: 'zon', ochtend: 'zon', nacht: 'maan', avond: 'maan', mist: 'water', straat: 'huis', dorp: 'kerk', plattegrond: 'huis', stoplicht: 'lamp' };
function graffitiTexture(word) {
  const W = 512, H = 250; const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const bare = word.replace(/^(de|het|een)\s+/i, '').toLowerCase(); const key = PICTO[bare] ? bare : PICTO_ALIAS[bare];
  const col = pick(['#cfc6b2', '#d9792a', '#9fe0ff', '#e8e4d8', '#f0c060']);
  g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
  if (key) { g.save(); g.translate(20, 40); g.scale(1.3, 1.3); g.rotate(rnd(-0.06, 0.06)); PICTO[key](g); g.restore(); }
  g.font = `italic 900 ${key ? 64 : 84}px "Segoe UI", system-ui, sans-serif`; g.textBaseline = 'middle'; g.textAlign = key ? 'left' : 'center';
  g.save(); g.translate(key ? 220 : W / 2, H / 2); g.rotate(rnd(-0.05, 0.05)); g.fillText(word, 0, 0); g.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; return t;
}
function graffitiWall(word) {
  const g = new THREE.Group();
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.6, 6), PM.stone); wall.position.y = 1.3; g.add(wall);
  const tex = graffitiTexture(word);
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.2), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  tag.position.set(-0.21, 1.35, 0); tag.rotation.y = -Math.PI / 2; tag.rotation.z = rnd(-0.08, 0.08); tag.userData.ownTex = true; g.add(tag);
  g.userData.faceRoad = true;
  return g;
}
function tulipBox() { const k = kit(); kTulipBox(k, 0, 0); return kbuild(k); }
function bollard() { const k = kit(); kadd(k, KG.bollard, PM.bollard, 0, 0.42, 0); kadd(k, KG.ball, PM.bollard, 0, 0.85, 0, 0, 0, 0, 0.22, 0.22, 0.22); kadd(k, KG.cyl, PM.bulb, 0, 0.6, 0, 0, 0, 0, 0.22, 0.06, 0.22); return kbuild(k); }
function bench() { const k = kit(); if (MODELS.bench) { kModel(k, MODELS.bench, 0, 0, 0); const g = kbuild(k); g.userData.faceRoad = true; return g; } for (let i = 0; i < 3; i++) kb(k, M.wood, -0.15 + i * 0.15, 0.45, 0, 0.12, 0.04, 1.6); for (const z of [-0.65, 0.65]) kb(k, PM.pole, 0, 0.22, z, 0.4, 0.45, 0.06); for (let i = 0; i < 2; i++) kb(k, M.wood, 0.22, 0.65 + i * 0.16, 0, 0.04, 0.12, 1.6); const g = kbuild(k); g.userData.faceRoad = true; return g; }
function fingerpost(words) {
  const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.6, 6), PM.pole); p.position.y = 1.3; g.add(p);
  words.forEach((w, i) => { const tex = labelTexture(w, { bg: '#1e2228', fg: '#e8e4d8' }); const b = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.32), new THREE.MeshBasicMaterial({ map: tex })); b.position.set((i % 2 ? -1 : 1) * 0.7, 2.3 - i * 0.4, 0); b.rotation.y = (i % 2 ? 1 : -1) * 0.25; b.userData.ownTex = true; g.add(b); });
  return g;
}
function cheeseCart() {
  const g = cart(); g.children[1].visible = false;   // hay off
  for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.18, 12), PM.cheese); c.position.set((i % 2 ? 0.38 : -0.38), 1.2 + Math.floor(i / 2) * 0.2, -0.5 + (i % 3) * 0.5); c.rotation.x = Math.PI / 2 * (i % 2 ? 0 : 0); g.add(c); }
  return g;
}
function drawbridge() {
  const g = MODELS.drawbridge ? kbuild(kModel(kit(), MODELS.drawbridge, 0, 0, 0)) : new THREE.Group();
  if (!MODELS.drawbridge) {
  const deck = new THREE.Mesh(new THREE.BoxGeometry(10, 0.25, 2.4), M.wood); deck.position.set(-5, 0.3, 0); g.add(deck);
  for (const sz of [-1, 1]) { const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.5, 0.2), PM.pole); post.position.set(-6.5, 2.4, sz * 1.1); g.add(post); const beam = new THREE.Mesh(new THREE.BoxGeometry(5, 0.14, 0.14), PM.pole); beam.position.set(-5.5, 4.6, sz * 1.1); beam.rotation.z = 0.35; g.add(beam); }
  const cw = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 2.6), PM.pole); cw.position.set(-8.2, 5.4, 0); g.add(cw);
  for (let i = 0; i < 5; i++) for (const sz of [-1, 1]) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), M.wood); r.position.set(-1 - i * 2, 0.85, sz * 1.1); g.add(r); }
  }
  const z = zombie('plain'); z.position.set(-4.5, 0.42, 0.2); z.rotation.y = -Math.PI / 2; g.add(z);
  return g;
}
function reeds() {   // a clump of reeds: one card, dense blades and bulrush heads, one draw call
  const g = new THREE.Group(), m = new THREE.Mesh(PG.reedCard, REED_MAT), s = rnd(0.8, 1.25);
  m.scale.set(rnd(2.6, 3.6) * s * (Math.random() < 0.5 ? -1 : 1), rnd(1.5, 2.1) * s, 1); g.add(m); g.userData.bill = true; return g;
}
function boat() {   // a moored canal boat: pointed bow, a wooden rail, sometimes a cabin with a lit porthole, a mast
  const k = kit();
  kb(k, PM.boat, 0, -0.55, 0.2, 1.6, 0.6, 3.6); kb(k, PM.boat, 0, -0.55, -1.6, 1.13, 0.6, 1.13, 0, Math.PI / 4, 0);
  kb(k, M.wood, 0, -0.22, 0.2, 1.7, 0.08, 3.7);
  if (Math.random() < 0.6) { kb(k, PM.wall2, 0, 0.12, 0.8, 1.1, 0.7, 1.6); kb(k, PM.roof, 0, 0.5, 0.8, 1.24, 0.08, 1.75); for (const sx of [-1, 1]) kadd(k, KG.plane, Math.random() < 0.6 ? PM.window : PM.windowOff, sx * 0.56, 0.15, 0.6, 0, sx * Math.PI / 2, 0, 0.3, 0.22); }
  else kb(k, PM.leaf, 0, -0.12, 0.6, 1.3, 0.25, 1.8);
  kadd(k, KG.cyl, PM.pole, 0, 1.0, -0.6, 0, 0, 0, 0.09, 3, 0.09);
  return kbuild(k);
}
function bridge() {
  const g = new THREE.Group();
  const deck = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 2.4), M.wood); deck.position.set(-6, 0.3, 0); g.add(deck);
  for (let i = 0; i < 6; i++) for (const sdz of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 0.1), M.wood); p.position.set(-1 - i * 2, 0.9, sdz * 1.1); g.add(p); }
  return g;
}
function church() {
  const g = new THREE.Group();
  const nave = new THREE.Mesh(new THREE.BoxGeometry(8, 9, 16), PM.wall2); nave.position.y = 4.5; g.add(nave);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(6, 3.5, 4), PM.roof); roof.position.y = 10.7; roof.rotation.y = Math.PI / 4; roof.scale.z = 2.1; g.add(roof);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(4, 18, 4), PM.wall); tower.position.set(0, 9, 10); g.add(tower);
  const spire = new THREE.Mesh(new THREE.ConeGeometry(2.9, 7, 4), PM.roof); spire.position.set(0, 21.5, 10); spire.rotation.y = Math.PI / 4; g.add(spire);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 3), PM.window); win.position.set(-4.01, 5, 0); win.rotation.y = -Math.PI / 2; g.add(win);
  g.userData.faceRoad = true;
  return g;
}
function dogProp() {
  if (MODELS.dog) { const g = new THREE.Group(), d = modelClone(MODELS.dog.scene); d.scale.setScalar(1.5); g.add(d); g.userData.tail = d.getObjectByName('tail'); return g; }   // the same dog as runs beside him, sized as the old prop
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.95), PM.dog); body.position.y = 0.55; g.add(body);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.4), PM.dog); head.position.set(0, 0.85, -0.6); g.add(head);
  for (const sx of [-1, 1]) { const ear = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.08), PM.dog); ear.position.set(sx * 0.16, 1.05, -0.55); g.add(ear); }
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.45), PM.dog); tail.position.set(0, 0.8, 0.65); tail.rotation.x = -0.6; g.add(tail); g.userData.tail = tail;
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.2), Mat({ color: 0x2a2126 })); snout.position.set(0, 0.78, -0.88); g.add(snout);
  for (const x of [-0.15, 0.15]) for (const z of [-0.3, 0.3]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), PM.dog); l.position.set(x, 0.2, z); g.add(l); }
  for (const x of [-0.08, 0.08]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.03, 4, 4), M.eye); e.position.set(x, 0.9, -0.81); g.add(e); }
  return g;
}
function bikeProp() {   // a slim black omafiets, upright on its stand
  const k = kit(); kBike(k, PM.pole, false, true); kb(k, PM.pole, 0.14, 0.17, 0.18, 0.02, 0.36, 0.02, 0, 0, 0.45); const g = kbuild(k);
  g.rotation.z = 0.07; g.rotation.y = Math.PI / 2;
  return g;
}
function numberPlate(n) {
  const g = new THREE.Group();
  const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8, 0.1), PM.pole); p.position.y = 0.9; g.add(p);
  const tex = labelTexture(String(n), { bg: '#2a2520', fg: '#e8e2d2' });
  const b = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7), Mat({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.5, side: THREE.DoubleSide }));
  b.position.set(0, 1.9, 0); b.userData.ownTex = true; g.add(b);
  return g;
}
function waterPatch() { // a short stretch of water right beside the road, with reeds
  const g = new THREE.Group();
  const w = new THREE.Mesh(new THREE.PlaneGeometry(9, 16), M.water); w.rotation.x = -Math.PI / 2; w.position.set(-4.5, -0.6, 0); g.add(w);
  for (let i = 0; i < 3; i++) { const r = reeds(); r.position.set(-0.4, -0.7, -6 + i * 6); g.add(r); }
  g.userData.faceRoad = true;
  return g;
}
// props you can be asked about: builder + how far past the road edge they stand
const PROPS = {
  hond: { make: dogProp, off: 0.4, scale: 2.0 }, huis: { make: () => house({ lit: 0.5 }), off: 3.2 }, fiets: { make: bikeProp, off: 0.4, scale: 1.15 },
  kerk: { make: church, off: 6 }, boom: { make: tree, off: 1.5 }, molen: { make: windmill, off: 6 }, brug: { make: bridge, off: 0.5 },
  water: { make: waterPatch, off: 0.3 }, winkel: { make: () => house({ sign: 'WINKEL', lit: 0.6, quiz: true }), off: 3.2 }, lamp: { make: lamppost, off: 0.8 },
  deur: { make: () => house({ w: 4, lit: 0.2 }), off: 2.4 },
  tuin: { make: () => { const g = new THREE.Group(); for (let i = 0; i < 5; i++) { const t = tree(); t.scale.setScalar(0.45); t.position.set(rnd(0, 3), 0, rnd(-3, 3)); g.add(t); } const f = fence(); f.rotation.y = Math.PI / 2; f.position.set(-0.3, 0, 0); g.add(f); return g; }, off: 0.6 },
  nummer: { make: (v) => numberPlate(v), off: 0.4, scale: 1.7 },
};

export { bench, bikeProp, boat, bollard, brickMat, bridge, cheeseCart, church, dogProp, drawbridge, fingerpost, graffitiWall, house, PICTO,
  PICTO_ALIAS, PROPS, reeds, seeded, surfUV, tulipBox, WIN_LIT };
