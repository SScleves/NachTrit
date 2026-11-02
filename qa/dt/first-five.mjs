// A fresh player's first five minutes: map, town card (lit next place, Enter rides), mission card (three words), the first
// ride's teaching forks (arrows, chevrons, the lit sign), the HUD, then the end card with the words of the ride.
// Steps the game with NRstep, so it runs on software GL in a few minutes.
// usage: node qa/dt/first-five.mjs [base] [out] [w] [h] [--gl gpu]
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const pos = process.argv.slice(2).filter(a => !a.startsWith('--'));
const base = pos[0] || 'http://localhost:8765/index.html', out = pos[1] || 'qa/out/first-five';
const w = +(pos[2] || 1280), h = +(pos[3] || 800), gpu = process.argv.includes('gpu');
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch(gpu ? { channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] }
  : { headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errs = [];
const p = await b.newPage({ viewport: { width: w, height: h } });
p.setDefaultTimeout(90000);
p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
await p.addInitScript(() => { if (!sessionStorage.getItem('ff')) { sessionStorage.setItem('ff', '1'); localStorage.clear(); localStorage.setItem('nachtrit.intro', 'short'); } });
await p.goto(base); await p.waitForFunction(() => window.NR && window.NRW);
const snap = async n => { await p.screenshot({ path: `${out}/${n}.png` }); console.log('frame', `${out}/${n}.png`); };
const log = (k, v) => console.log(k.padEnd(14), typeof v === 'string' ? v : JSON.stringify(v));
await p.waitForTimeout(800);
await p.click('#go'); await p.waitForTimeout(1200);
log('endless', await p.evaluate(() => ({ aslink: document.getElementById('endless').classList.contains('aslink') })));
await snap('1-map');
await p.keyboard.press('Enter'); await p.waitForTimeout(700);
log('town card', await p.evaluate(() => { const a = document.activeElement; return { focusNext: !!(a && a.classList.contains('place') && a.classList.contains('next')), next: a && a.textContent.slice(0, 80), rows: document.querySelectorAll('#t_places .place').length, soon: /soon/.test(document.getElementById('t_places').textContent), bonus: (document.querySelector('#t_places .bonus') || {}).textContent }; }));
await snap('2-town');
await p.keyboard.press('Enter'); await p.waitForTimeout(700);
log('mission', await p.evaluate(() => ({ shown: document.getElementById('mission').style.display, chips: document.querySelectorAll('#m_words .wchip').length, words: [...document.querySelectorAll('#m_words .wchip b')].map(b => b.textContent), pics: document.querySelectorAll('#m_words img').length, rideOnScreen: (() => { const r = document.getElementById('m_go').getBoundingClientRect(); return r.bottom <= innerHeight && r.top >= 0; })() })));
await snap('3-mission');
await p.click('#m_go');
for (let k = 0; k < 40 && await p.evaluate(() => NR.mode !== 'ride'); k++) { await p.waitForTimeout(500); if (await p.evaluate(() => document.getElementById('intro').style.display !== 'none')) await p.keyboard.press('Space'); }
await p.evaluate(() => NRstep(240));
await snap('4-ride-start');
log('hud', await p.evaluate(() => { const r = [...document.querySelectorAll('#hud .pill')].filter(e => getComputedStyle(e).display !== 'none').map(e => ({ id: e.id || e.querySelector('small').textContent, top: Math.round(e.getBoundingClientRect().top) })); return { pills: r.map(x => x.id), oneRow: new Set(r.map(x => x.top)).size === 1, font: getComputedStyle(document.querySelector('#hud .pill')).fontSize }; }));
// near-wisps: in the first 200 m every wisp stands in the start lane
log('wisps<200m', await p.evaluate(() => { const ws = NR.objs.filter(o => o.type === 'wisp' && o.d < 200); return { n: ws.length, lanes: [...new Set(ws.map(o => o.lane))] }; }));
const pilot = () => p.evaluate(() => { const g = NR.activeFork; if (g) { const q = g.posts.find(x => x.oi === g.fork.a); if (q) NR.lane = q.lane; } });
for (let f = 1; f <= 4; f++) {   // ride to each of the first forks, look at it 14 m out
  for (let i = 0; i < 400 && await p.evaluate(() => !(NR.activeFork && NR.dist - NR.activeFork.d > -14 && !NR.activeFork.resolved)); i++) await p.evaluate(() => NRstep(10));
  const st = await p.evaluate(() => { const g = NR.activeFork; return { teach: !!g.teach, decals: NR.objs.filter(o => o.type === 'decal' && Math.abs(o.d - g.d) < 30).length, lanes: [...document.querySelectorAll('#lanes div')].filter(d => d.style.display !== 'none').map(d => d.textContent), slow: +NR.slowTarget.toFixed(2), signScale: g.posts[0].mesh.scale.x, calls: (() => { const r = NRpost().renderer; r.info.autoReset = false; r.info.reset(); NRstep(0); const n = r.info.render.calls; r.info.autoReset = true; return n; })(), toast: document.getElementById('toast').textContent }; });
  log(`fork ${f}`, st);
  if (f <= 2 || f === 4) await snap(`5-fork${f}`);
  await pilot();
  for (let i = 0; i < 200 && await p.evaluate(() => NR.activeFork && !NR.activeFork.resolved); i++) { await pilot(); await p.evaluate(() => NRstep(6)); }
}
log('taught', await p.evaluate(() => ({ key: localStorage.getItem('nachtrit.taught'), taught: NR.taught })));
// the lamp toast: drop the lamp under half once
await p.evaluate(() => { NR.lamp = 45; for (let i = 0; i < 40 && !/lamp is going/.test(document.getElementById('toast').textContent); i++) { NR.lamp = Math.min(NR.lamp, 45); NRstep(15); } });
log('lamp toast', await p.evaluate(() => ({ text: document.getElementById('toast').textContent, key: localStorage.getItem('nachtrit.lamphint') })));
await snap('6-lamp-toast');
// ride home on autopilot
for (let i = 0; i < 900 && await p.evaluate(() => NR.mode === 'ride'); i++) { await pilot(); await p.evaluate(() => { const g = NR.activeFork; if (g) { const q = g.posts.find(x => x.oi === g.fork.a); if (q) NR.lane = q.lane; } NR.lamp = Math.max(NR.lamp, 60); NRstep(20); }); }
await p.waitForTimeout(400);
log('summary', await p.evaluate(() => ({ mode: NR.mode, shown: document.getElementById('summary').style.display, words: document.getElementById('s_words').textContent.slice(0, 160) })));
await snap('7-summary');
console.log('errors', errs.length, errs.slice(0, 5).join('\n'));
await b.close();
