// Captures deterministic NachTrit frames with metrics, on the real GPU or on SwiftShader.
// usage: node shoot.mjs [--gl gpu|swift] [--browser chromium|chrome|msedge] [--out dir] [--w 1280 --h 800]
//                       [--base http://127.0.0.1:8765/index.html] name=query [name=query ...]
// example: node shoot.mjs --gl gpu --out shots/base gouda12="shot=8&level=12&lane=1"
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const argv = process.argv.slice(2);
const opt = { gl: 'gpu', browser: 'chromium', out: 'qa/out/shots/' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19), w: 1280, h: 800, base: 'http://127.0.0.1:8765/index.html', fps: 0 };
const jobs = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith('--')) { const k = a.slice(2); opt[k] = ['w', 'h', 'fps'].includes(k) ? +argv[++i] : argv[++i]; }
  else { const eq = a.indexOf('='); jobs.push({ name: a.slice(0, eq), query: a.slice(eq + 1) }); }
}
fs.mkdirSync(opt.out, { recursive: true });

const glArgs = opt.gl === 'gpu'
  ? ['--ignore-gpu-blocklist', '--use-angle=d3d11', '--enable-gpu-rasterization']
  : ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
const launch = { headless: true, args: glArgs };
if (opt.browser !== 'chromium') launch.channel = opt.browser;
const browser = await chromium.launch(launch);
const results = [];

for (const job of jobs) {
  const page = await browser.newPage({ viewport: { width: opt.w, height: opt.h } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('page: ' + String(e)));
  page.on('response', r => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`); });
  await page.addInitScript(() => { try { localStorage.setItem('nachtrit.intro', '1'); const all = {}; for (let i = 1; i <= 140; i++) all[i] = 3; localStorage.setItem('nachtrit.progress', JSON.stringify(all)); } catch (e) {} });
  const t0 = Date.now();
  await page.route('**/favicon.ico', r => r.fulfill({ status: 204, body: '' }));
  await page.goto(opt.base + (job.query ? '?' + job.query : ''), { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction(() => window.NR && window.NRpost, null, { timeout: 120000 });
  if (/shot=/.test(job.query)) await page.waitForFunction(() => [...document.images].some(i => i.style.zIndex === '1' && i.complete), null, { timeout: 180000 }).catch(() => errors.push('harness: shot image never appeared'));
  else await page.waitForTimeout(2500);
  const loadMs = Date.now() - t0;
  const m = await page.evaluate(() => {
    const { renderer } = NRpost();
    const gl = renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const gpu = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    const info = renderer.info;
    info.autoReset = false; info.reset();
    const t = performance.now(); NRstep(1); const stepMs = performance.now() - t;
    const out = { gpu, calls: info.render.calls, tris: info.render.triangles, programs: info.programs.length, textures: info.memory.textures, geometries: info.memory.geometries, stepMs: Math.round(stepMs * 10) / 10 };
    info.autoReset = true;
    out.luma = NRbright();
    out.mode = NR.mode; out.theme = NR.theme || null; out.dpr = NRinfo().dpr;
    return out;
  });
  if (opt.fps) m.perf = await page.evaluate(async ms => { const t0 = performance.now(); let n = 0, worst = 0, last = t0; await new Promise(res => { function f(t) { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < ms) requestAnimationFrame(f); else res(); } requestAnimationFrame(f); }); return { fps: Math.round(n / (ms / 1000)), worstMs: Math.round(worst) }; }, opt.fps);
  const file = path.join(opt.out, job.name + '.png');
  await page.screenshot({ path: file });
  const r = { name: job.name, query: job.query, loadMs, ...m, errors };
  results.push(r);
  console.log(`${job.name.padEnd(14)} calls ${String(m.calls).padStart(5)}  tris ${String(m.tris).padStart(8)}  prog ${String(m.programs).padStart(3)}  tex ${String(m.textures).padStart(3)}  geo ${String(m.geometries).padStart(4)}  step ${String(m.stepMs).padStart(6)}ms  luma ${String(m.luma).padStart(3)}  ${m.perf ? 'fps ' + m.perf.fps + ' worst ' + m.perf.worstMs + 'ms  ' : ''}errors ${errors.length}  (${Math.round(loadMs / 1000)}s)`);
  for (const e of errors.slice(0, 5)) console.log('    ' + e.slice(0, 300));
  await page.close();
}
fs.writeFileSync(path.join(opt.out, 'report.json'), JSON.stringify({ opt, results }, null, 1));
console.log('gpu:', results[0] ? results[0].gpu : '-', '| out:', path.resolve(opt.out));
await browser.close();
