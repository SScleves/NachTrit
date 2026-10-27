// The card before a level: open each level from the map, shoot its card panels, check they play as 3D, then the ride starts clean.
// usage: node qa/dt/card-check.mjs <base> <out> <ids comma separated> [w h]
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [base, out, ids, w, h] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: +(w || 1280), height: +(h || 800) } }); const errs = [];
p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.addInitScript(() => { try { localStorage.setItem('nachtrit.intro', '1'); localStorage.setItem('nachtrit.unlock', '1'); } catch (e) {} });
await p.goto(base + '?map=1'); await p.waitForFunction(() => window.NR && window.goLevel); await p.waitForTimeout(700);
for (const id of ids.split(',').map(Number)) {
  const ok = await p.evaluate(id => window.goLevel(id), id); if (!ok) { console.log(`L${id} cannot open`); continue; }
  await p.waitForTimeout(300); await p.click('#m_go');
  const rows = [];
  for (let k = 0; k < 4; k++) {
    await p.waitForTimeout(1600);
    const st = await p.evaluate(() => ({ intro: document.getElementById('intro').style.display !== 'none', cine: document.getElementById('intro').classList.contains('cine'), mode: NR.mode, text: document.getElementById('pixtext').textContent.slice(0, 40) }));
    if (!st.intro) break;
    await p.screenshot({ path: `${out}/L${id}-card${k + 1}.png` }); rows.push(st);
    await p.keyboard.press('Space');
  }
  for (let k = 0; k < 10 && await p.evaluate(() => NR.mode !== 'ride'); k++) await p.waitForTimeout(500);
  const ride = await p.evaluate(() => ({ mode: NR.mode, bodyCine: document.body.classList.contains('cine'), view: !!(NRW.camera.view && NRW.camera.view.enabled) }));
  console.log(`L${id} cards: ${rows.map(r => (r.cine ? '3D' : 'paint') + ' "' + r.text + '"').join(' | ')} -> ${JSON.stringify(ride)}`);
  await p.goto(base + '?map=1'); await p.waitForFunction(() => window.NR && window.goLevel); await p.waitForTimeout(500);
}
console.log('errors', errs.length, errs.slice(0, 4).join(' | '));
await b.close();
