// Real-GPU frames and numbers from Node: drives the installed Google Chrome through Playwright with GPU flags,
// reports which backend actually ran (WebGPU or the WebGL2 fallback, with the adapter / GL renderer string),
// draw calls, luma, fps over a ride, and saves one PNG per level.
//
// usage: node qa/dt/gpu-shot.mjs [--base http://localhost:8773/index.html] [--levels 1,40,75] [--renderer webgpu|webgl2|webgl]
//                                [--mode headless|headed] [--power low|high] [--secs 10] [--shot 8] [--out dir] [--w 1280 --h 800]
//   --renderer webgl adds ?renderer=webgl (the old WebGLRenderer path, for comparison); webgpu is the default page.
//   --power low asks for the low-power adapter (the Intel iGPU on a dual-GPU laptop); high picks the discrete one.
//   --mode headed opens a real window parked off screen, for machines where headless Chrome cannot reach the GPU.
//   --extra 'fx=-bloom&post=0' adds page parameters; --lockdpr 1 stops the game lowering its resolution during the ride.
//   --swift uses SwiftShader instead (software, the old harness's error check; fps is meaningless there).
// On this machine (Linux, Intel UHD CML + NVIDIA T2000) headless=new with --use-gl=angle --use-angle=gl
// --enable-unsafe-webgpu reaches both GPUs; --use-angle=vulkan gives no WebGL and no WebGPU adapter headless.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const argv = process.argv.slice(2);
const opt = { base: 'http://localhost:8773/index.html', levels: '1,40,75', renderer: 'webgpu', mode: 'headless', power: 'low', secs: 10, shot: 8, w: 1280, h: 800, out: '', swift: false, chrome: '/usr/bin/google-chrome' };
for (let i = 0; i < argv.length; i++) {
  const k = argv[i].replace(/^--/, '');
  if (k === 'swift') { opt.swift = true; continue; }
  opt[k] = ['secs', 'shot', 'w', 'h'].includes(k) ? +argv[++i] : argv[++i];
}
opt.out = opt.out || `qa/out/gpu-shot/${opt.renderer}-${opt.swift ? 'swift' : opt.power}-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;
fs.mkdirSync(opt.out, { recursive: true });

const args = opt.swift
  ? ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--enable-unsafe-webgpu']
  : ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=gl', '--enable-unsafe-webgpu', '--enable-features=Vulkan', '--enable-gpu-rasterization'];
if (opt.mode === 'headless') args.unshift('--headless=new');
else args.push('--window-position=-3000,-3000', `--window-size=${opt.w},${opt.h}`);
const browser = await chromium.launch({ executablePath: opt.chrome, headless: opt.mode === 'headless', args });
const results = [];

for (const lv of String(opt.levels).split(',').map(s => s.trim()).filter(Boolean)) {
  const page = await browser.newPage({ viewport: { width: opt.w, height: opt.h } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); if (/THREE\.|WebGPU|fallback/i.test(m.text()) && m.type() === 'warning') errors.push('warn: ' + m.text()); });
  page.on('pageerror', e => errors.push('page: ' + String(e)));
  page.on('response', r => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`); });
  if (opt.lockdpr) await page.addInitScript(() => { window.NRnoAutoDPR = 1; });
  await page.addInitScript(() => { try { localStorage.setItem('nachtrit.intro', '1'); const all = {}; for (let i = 1; i <= 140; i++) all[i] = 3; localStorage.setItem('nachtrit.progress', JSON.stringify(all)); } catch (e) {} });
  await page.route('**/favicon.ico', r => r.fulfill({ status: 204, body: '' }));
  const qs = new URLSearchParams({ level: lv, shot: String(opt.shot), lane: '1' });
  if (opt.renderer !== 'webgpu') qs.set('renderer', opt.renderer);   // webgl: the old WebGLRenderer; webgl2: the node path forced onto its WebGL2 fallback
  if (opt.power) qs.set('gpu', opt.power);
  if (opt.extra) for (const [k, v] of new URLSearchParams(opt.extra)) qs.set(k, v);
  const t0 = Date.now();
  await page.goto(opt.base + '?' + qs, { waitUntil: 'load', timeout: 180000 });
  await page.waitForFunction(() => window.NR && window.NRpost, null, { timeout: 180000 });
  await page.waitForFunction(() => [...document.images].some(i => i.style.zIndex === '1' && i.complete), null, { timeout: 240000 }).catch(() => errors.push('harness: shot image never appeared'));
  const loadMs = Date.now() - t0;
  const file = path.join(opt.out, `L${lv}.png`);
  await page.screenshot({ path: file });
  const m = await page.evaluate(async () => {
    const { renderer } = NRpost();
    let backend, adapter;
    if (window.NRbackend) ({ backend, adapter } = await NRbackend());
    else { const gl = renderer.getContext(), e = gl.getExtension('WEBGL_debug_renderer_info'); backend = 'webgl2 (WebGLRenderer)'; adapter = e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); }
    const info = renderer.info;
    let calls, tris, stepMs;
    if (info.render.drawCalls != null) {   // WebGPURenderer: its own loop resets the counters each animation frame; read them after the game's frame
      await new Promise(r => requestAnimationFrame(() => r()));
      calls = info.render.drawCalls; tris = info.render.triangles;
      const t = performance.now(); NRstep(1); stepMs = performance.now() - t;
    } else {
      const was = info.autoReset; info.autoReset = false; info.reset();
      const t = performance.now(); NRstep(1); stepMs = performance.now() - t;
      calls = info.render.calls; tris = info.render.triangles; info.autoReset = was;
    }
    stepMs = Math.round(stepMs * 10) / 10;
    return { backend, adapter, calls, tris, stepMs, luma: NRbright(), dpr: NRinfo().dpr };
  });
  // the ride: drop the held frame and let the game run on its own clock for opt.secs seconds
  m.ride = await page.evaluate(async ms => {
    document.querySelectorAll('img').forEach(i => { if (i.style.zIndex === '1') i.remove(); });
    const t0 = performance.now(); let n = 0, worst = 0, last = t0;
    await new Promise(res => { function f(t) { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < ms) requestAnimationFrame(f); else res(); } requestAnimationFrame(f); });
    return { fps: Math.round(n / (ms / 1000) * 10) / 10, worstMs: Math.round(worst), mode: NR.mode, dprAfter: NRinfo().dpr, lumaAfter: NRbright() };
  }, opt.secs * 1000);
  await page.screenshot({ path: path.join(opt.out, `L${lv}-after-ride.png`) });
  const r = { level: lv, loadMs, ...m, file, errors };
  results.push(r);
  console.log(`L${String(lv).padEnd(4)} ${m.backend} | ${m.adapter}\n      calls ${m.calls}  tris ${m.tris}  step ${m.stepMs}ms  luma ${m.luma}  ride ${opt.secs}s: ${m.ride.fps} fps (worst ${m.ride.worstMs} ms, dpr ${m.dpr}->${m.ride.dprAfter}, luma after ${m.ride.lumaAfter})  errors ${errors.length}  (${Math.round(loadMs / 1000)}s)`);
  for (const e of errors.slice(0, 6)) console.log('      ' + e.slice(0, 300));
  await page.close();
}
fs.writeFileSync(path.join(opt.out, 'report.json'), JSON.stringify({ opt, args, results }, null, 1));
console.log('out:', path.resolve(opt.out));
await browser.close();
