// The map as a fresh player sees it and as one with the first town saved, with the brightness of the painted board.
// usage: node qa/dt/map-shot.mjs [base] [out] [w] [h]
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8765/index.html', out = process.argv[3] || 'qa/out/map';
const w = +(process.argv[4] || 1280), h = +(process.argv[5] || 800);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const [name, stars] of [['fresh', {}], ['saved1', { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 41: 3 }]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(s => { try { localStorage.clear(); localStorage.setItem('nachtrit.intro', 'short'); localStorage.setItem('nachtrit.progress', JSON.stringify(s)); } catch (e) {} }, stars);
  await p.goto(base, { timeout: 120000 }); await p.waitForFunction(() => window.NR && window.NRW, null, { timeout: 120000 });
  await p.click('#go'); await p.waitForTimeout(2500);
  const m = await p.evaluate(() => {
    const c = document.getElementById('nlart'), t = document.createElement('canvas'); t.width = 160; t.height = 100; const g = t.getContext('2d'); g.drawImage(c, 0, 0, 160, 100);
    const d = g.getImageData(0, 0, 160, 100).data; let s = 0, warm = 0; for (let i = 0; i < d.length; i += 4) { s += (d[i] + d[i + 1] + d[i + 2]) / 3; if (d[i] > 120 && d[i] > d[i + 2] + 40) warm++; }
    const lay = window.NRMAP.lastLay; return { luma: Math.round(s / (d.length / 4)), warmPx: warm, ms: window.NRMAP.ms, last: window.NRMAP.last, vw: lay ? lay.vw.map(v => +(v / lay.f).toFixed(1)).join(" ") : null };
  });
  await p.screenshot({ path: `${out}/${name}-${w}x${h}.png` });
  console.log(name, `${w}x${h}`, JSON.stringify(m), 'errors', errs.length, errs.slice(0, 3).join(' | '));
  await p.close();
}
await b.close();
