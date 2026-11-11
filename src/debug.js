// The debug and qa hooks on window, in one place: NR (the state), NRstep (step the world without the clock), NRbright, NRinfo,
// NRbackend, NRpost, NRbike, NRface, NRcam, NRsnap, NRsetDPR, NRTUNE, NRfare, NRfareFns, NRread, NRgo, NRmodels, goLevel. qa/ and
// qa/dt/ depend on them. Three live next to what they show: NRW (cine.js, the towns use it too), NRmapBike (map.js), NRTK (scenery.js).
import { legDist, READ_AHEAD, READ_THR } from './reading.js?v=42';
import { TUNE } from './lamp.js?v=42';
import { NODES, THREE } from './engine.js?v=42';
import { MSAA } from './render-nodes.js?v=42';
import { bloomPass, camera, composer, DPR, gradePass, inkPass, postSize, render, renderer, setDPR } from './render.js?v=42';
import { MODELS } from './kit.js?v=42';
import { modelsReady } from './models.js?v=42';
import { bike, dogs, faceState, setFace } from './rider.js?v=42';
import { signFit } from './signs.js?v=42';
import { S } from './state.js?v=42';
import { goNow } from './input.js?v=42';
import { openMission } from './map.js?v=42';
import { paidLine, payTikkie } from './wallet.js?v=42';
import { update } from './main.js?v=42';   // later modules, through the hub

// the lamp's numbers (drain, wisp, right-answer refuel, cap, go-key bonus) are TUNE in src/lamp.js; the bots change them through NRTUNE
window.NRTUNE = TUNE;
window.NR = S; // debug handle
window.NRsetDPR = v => { setDPR(v); renderer.setPixelRatio(DPR); postSize(); };
window.NRpost = () => ({ composer, inkPass, bloomPass, gradePass, renderer, THREE });
window.NRface = (n, secs) => setFace(n, secs || 3);
window.NRbike = () => ({ bike, faceState, dogs });   // dogs: the pair that runs beside him (qa/intro-sheet.mjs checks where they show)
window.NRsnap = async () => { render(); const url = renderer.domElement.toDataURL('image/png'); const r = await fetch('http://localhost:8766/shot', { method: 'POST', body: url }); return r.text(); };
window.NRstep = (n, each) => { for (let i = 0; i < (n || 60); i++) { update(1 / 60); if (each) each(); } render(); };   // each: qa bots sample every frame
window.NRcam = () => camera;
window.NRbright = () => { render(); const c = renderer.domElement, t = document.createElement('canvas'); t.width = 64; t.height = 36; const g = t.getContext('2d'); g.drawImage(c, 0, 0, 64, 36); const d = g.getImageData(0, 0, 64, 36).data; let sum = 0; for (let i = 0; i < d.length; i += 4) sum += d[i] + d[i + 1] + d[i + 2]; return Math.round(sum / (d.length / 4) / 3); };
// which backend really runs, and on what: 'webgpu', 'webgl2 (WebGPURenderer fallback)' or 'webgl2 (WebGLRenderer)'
window.NRbackend = async () => {
  const glName = gl => { const e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); };
  if (!NODES) return { backend: 'webgl2 (WebGLRenderer)', adapter: glName(renderer.getContext()) };
  const b = renderer.backend;
  if (b.isWebGPUBackend) { const i = b.device.adapterInfo || {}; return { backend: 'webgpu', adapter: [i.vendor, i.architecture, i.device, i.description].filter(Boolean).join(' ') || 'unknown adapter' }; }
  return { backend: 'webgl2 (WebGPURenderer fallback)', adapter: glName(b.gl) };
};
window.NRinfo = () => ({ geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures, programs: (renderer.info.programs || []).length, calls: renderer.info.render.drawCalls != null ? renderer.info.render.drawCalls : renderer.info.render.calls, dpr: DPR, post: !!composer, msaa: NODES ? MSAA : 0 });
window.NRfare = () => ({ cents: S.cents, missed: S.missed, tips: S.tips, tikkie: S.tikkie, cleanRow: S.cleanRow, score: S.score, paid: S.paid });
window.NRfareFns = { paidLine, payTikkie };   // qa: the toast line and the Tikkie, called directly
window.goLevel = id => { const lv = LEVELS.find(l => l.id === id); if (lv && !lv.soon) { openMission(lv); return true; } return false; };

window.NRread = { signFit, legDist, READ_THR, READ_AHEAD };   // qa: how far off a sign text reads (em = signFit(t).px / 250 * 1.02, x1.3 on tier 1)
window.NRgo = goNow;   // qa
window.NRmodels = () => ({ loaded: Object.keys(MODELS), rider: !!bike.userData.model, t: Math.round(performance.now()) });   // which models arrived (qa)
modelsReady.then(() => { window.NRmodelsAt = Math.round(performance.now()); });

