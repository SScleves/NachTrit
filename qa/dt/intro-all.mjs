// The whole intro, panel by panel: which panels play as 3D shots, errors, and that the ride afterwards is clean.
// usage: node intro-all.mjs [base] [out] [w] [h] [secsPerPanel]
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8765/index.html', out = process.argv[3] || 'qa/out/intro-all';
const w = +(process.argv[4] || 1280), h = +(process.argv[5] || 800), secs = +(process.argv[6] || 2.6);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = [];
p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
await p.addInitScript(() => { try { const all = {}; for (let i = 1; i <= 40; i++) all[i] = 3; localStorage.setItem('nachtrit.progress', JSON.stringify(all)); } catch (e) {} });
await p.goto(base + '?cine=1'); await p.waitForFunction(() => window.NR && window.NRW); await p.waitForTimeout(600);
const rows = [];
for (let i = 0; i < 16; i++) {
  if (await p.evaluate(() => document.getElementById('intro').style.display === 'none')) break;
  await p.waitForTimeout(secs * 1000);
  const st = await p.evaluate(() => ({ text: document.getElementById('pixtext').textContent.slice(0, 34), cine: document.getElementById('intro').classList.contains('cine'), mode: NR.mode, props: NRW.scene.children.length }));
  await p.screenshot({ path: `${out}/p${String(i + 1).padStart(2, '0')}.png` });
  rows.push(st); console.log(String(i + 1).padStart(2), st.cine ? '3D   ' : 'paint', st.mode.padEnd(6), 'scene children', String(st.props).padStart(4), '|', st.text);
  await p.keyboard.press('Space'); await p.waitForTimeout(450);
}
await p.waitForFunction(() => document.getElementById('map').style.display !== 'none', null, { timeout: 15000 }).catch(() => errs.push('harness: the map never opened'));
const after = await p.evaluate(() => ({ mode: NR.mode, children: NRW.scene.children.length, beam: NRW.beam.visible, bike: NRW.bike.visible, view: !!(NRW.camera.view && NRW.camera.view.enabled), bodyCine: document.body.classList.contains('cine') }));
console.log('after the intro', JSON.stringify(after));
const ok = await p.evaluate(() => window.goLevel(1)); await p.waitForTimeout(400); if (ok) await p.click('#m_go').catch(e => errs.push('harness: ' + e.message));
for (let k = 0; k < 8 && await p.evaluate(() => NR.mode !== 'ride' && NR.mode !== 'intro'); k++) { await p.keyboard.press('Space'); await p.waitForTimeout(400); }
await p.waitForTimeout(4500); await p.screenshot({ path: `${out}/ride.png` });
const ride = await p.evaluate(() => ({ mode: NR.mode, lampLight: Math.round(NRW.lampLight.intensity * 10) / 10, hiddenScenery: 0 }));
console.log('ride', JSON.stringify(ride), '| errors', errs.length);
for (const e of errs.slice(0, 8)) console.log('  ! ' + e.slice(0, 220));
await b.close();
