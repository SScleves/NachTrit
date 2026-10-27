// The 3D intro in the flow: pixel panel 13, the dip, 3D shot 14, out to the map, then a level, checking nothing of the shot leaks.
// usage: node qa/dt/cine-flow.mjs [base=http://127.0.0.1:8765/index.html] [out=qa/out/cine-flow]
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8765/index.html', out = process.argv[3] || 'qa/out/cine-flow';
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
for (const [w, h, tag] of [[1280, 800, 'laptop'], [390, 844, 'phone'], [844, 390, 'phone-land']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => { try { const all = {}; for (let i = 1; i <= 40; i++) all[i] = 3; localStorage.setItem('nachtrit.progress', JSON.stringify(all)); } catch (e) {} });
  await p.goto(base + '?cine=13'); await p.waitForFunction(() => window.NR && window.NRW); await p.waitForTimeout(1200);
  const st = () => p.evaluate(() => ({ mode: NR.mode, introCine: document.getElementById('intro').classList.contains('cine'), bodyCine: document.body.classList.contains('cine'),
    pixframe: document.getElementById('pixframe').style.display, intro: document.getElementById('intro').style.display, map: document.getElementById('map').style.display,
    view: !!(NRW.camera.view && NRW.camera.view.enabled), bikeZ: NRW.bike.position.z, lampZ: NRW.lampLight.position.z, fov: NRW.camera.fov, text: document.getElementById('pixtext').textContent.slice(0, 30) }));
  await p.screenshot({ path: `${out}/${tag}-1-panel13.png` }); const s1 = await st();
  await p.keyboard.press('Space'); await p.waitForTimeout(1800);
  await p.screenshot({ path: `${out}/${tag}-2-shot14-beat1.png` }); const s2 = await st();
  await p.waitForTimeout(4200); await p.screenshot({ path: `${out}/${tag}-3-shot14-beat2.png` }); const s3 = await st();
  const t0 = Date.now(); await p.waitForFunction(() => document.getElementById('map').style.display !== 'none', null, { timeout: 25000 }).catch(() => errs.push('harness: the map never opened'));
  const waited = (Date.now() - t0) / 1000; await p.waitForTimeout(600); await p.screenshot({ path: `${out}/${tag}-4-map.png` }); const s4 = await st();
  const ok = await p.evaluate(() => window.goLevel(1)); await p.waitForTimeout(400);
  if (ok) await p.click('#m_go').catch(e => errs.push('harness: ' + e.message));
  for (let k = 0; k < 8 && await p.evaluate(() => NR.mode !== 'ride' && NR.mode !== 'intro'); k++) { await p.keyboard.press('Space'); await p.waitForTimeout(400); }
  await p.waitForTimeout(4500); await p.screenshot({ path: `${out}/${tag}-5-ride.png` }); const s5 = await st();
  console.log(`${tag}  errors ${errs.length}  map after ${waited.toFixed(1)} s`);
  for (const [n, s] of [['panel13', s1], ['beat1', s2], ['beat2', s3], ['map', s4], ['ride', s5]]) console.log(`  ${n.padEnd(8)} ${JSON.stringify(s)}`);
  for (const e of errs.slice(0, 6)) console.log('  ! ' + e.slice(0, 240));
  await p.close();
}
await b.close();
