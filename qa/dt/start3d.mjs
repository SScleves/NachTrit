// The title screen in 3D: the shot runs behind the title, Start cuts into intro panel 1, every way out leaves the world clean.
// usage: node qa/dt/start3d.mjs [base] [out] [w] [h]
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8765/index.html', out = process.argv[3] || 'qa/out/start3d';
const w = +(process.argv[4] || 1280), h = +(process.argv[5] || 800);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const errs = [];
const state = p => p.evaluate(() => ({
  mode: NR.mode, live3d: document.getElementById('start').classList.contains('live3d'),
  pix: getComputedStyle(document.getElementById('startpix')).display, bodyCine: document.body.classList.contains('cine'),
  view: !!(NRW.camera.view && NRW.camera.view.enabled), start: document.getElementById('start').style.display,
  intro: document.getElementById('intro').style.display, introCine: document.getElementById('intro').classList.contains('cine'),
  text: document.getElementById('pixtext').textContent.slice(0, 40), children: NRW.scene.children.length,
}));
const page = async (seen) => {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  await p.addInitScript((seen) => { try { localStorage.clear(); if (seen) localStorage.setItem('nachtrit.intro', 'full'); const all = {}; for (let i = 1; i <= 40; i++) all[i] = 3; localStorage.setItem('nachtrit.progress', JSON.stringify(all)); } catch (e) {} }, seen);
  await p.goto(base); await p.waitForFunction(() => window.NR && window.NRW); return p;
};

// 1. first run: the title in 3D, then Start cuts into panel 1 in 3D, then skip to the map
let p = await page(false);
await p.waitForTimeout(1500); console.log('title       ', JSON.stringify(await state(p))); await p.screenshot({ path: `${out}/title-a.png` });
await p.waitForTimeout(7000); await p.screenshot({ path: `${out}/title-b.png` });
await p.waitForTimeout(7000); await p.screenshot({ path: `${out}/title-c.png` });
await p.keyboard.press('Space'); await p.waitForTimeout(2500);
console.log('panel 1     ', JSON.stringify(await state(p))); await p.screenshot({ path: `${out}/intro-1.png` });
await p.keyboard.press('Escape'); await p.waitForTimeout(800);
console.log('map (skip)  ', JSON.stringify(await state(p)));
await p.close();

// 2. intro already seen: Start opens the map straight from the 3D title, then a level rides clean
p = await page(true);
await p.waitForTimeout(1500); console.log('title seen  ', JSON.stringify(await state(p)));
await p.click('#go'); await p.waitForTimeout(800);
console.log('map (go)    ', JSON.stringify(await state(p)));
const ok = await p.evaluate(() => window.goLevel(1)); await p.waitForTimeout(400); if (ok) await p.click('#m_go').catch(e => errs.push('harness: ' + e.message));
for (let k = 0; k < 8 && await p.evaluate(() => NR.mode !== 'ride' && NR.mode !== 'intro'); k++) { await p.keyboard.press('Space'); await p.waitForTimeout(400); }
await p.waitForTimeout(4500); await p.screenshot({ path: `${out}/ride.png` });
console.log('ride        ', JSON.stringify(await state(p)));
await p.close();

// 3. the replay link plays the full intro from the 3D title
p = await page(true);
await p.waitForTimeout(1200); await p.click('#replay'); await p.waitForTimeout(2500);
console.log('replay p1   ', JSON.stringify(await state(p)));
await p.close();
console.log('errors', errs.length); for (const e of errs.slice(0, 10)) console.log('  ! ' + e.slice(0, 240));
await b.close();
