// Reading time per fork at several levels: loads qa/readbot.js in the page, rides each level on autopilot (always right,
// collecting wisps, lamp held at 30 or more so every fork is reached) and prints one row per fork: kind, words, budget,
// seconds the sign text was legible, the distance it became legible at, the speed then and the lowest speed.
// usage: node qa/dt/reading-time.mjs [base] [levels=1,75,99,123] [--teach] [--w 1280 --h 800] [--gpu]
//   --gpu renders on the real GPU through the installed Chrome (the measure is the same projection; minutes instead of two hours)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const args = process.argv.slice(2), pos = args.filter(a => !a.startsWith('--'));
const base = pos[0] || 'http://localhost:8765/index.html', levels = (pos[1] || '1,75,99,123').split(',').map(Number);
const teach = args.includes('--teach'), w = +(args[args.indexOf('--w') + 1] || 0) || 1280, h = +(args[args.indexOf('--h') + 1] || 0) || 800;
const gpu = args.includes('--gpu');
const launch = () => gpu ? chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--headless=new', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=gl'] })
  : chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let fails = 0, errors = 0;
for (const id of levels) {
  const b = await launch(); const p = await b.newPage({ viewport: { width: w, height: h } }); p.setDefaultTimeout(120000);
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(t => { localStorage.setItem('nachtrit.intro', 'short'); if (t) localStorage.removeItem('nachtrit.taught'); else localStorage.setItem('nachtrit.taught', '1'); localStorage.setItem('nachtrit.lamphint', '1'); }, teach);
  await p.goto(`${base}?unlock=1&shot=0&level=${id}${gpu ? '&renderer=webgl&gpu=low' : ''}`); await p.waitForFunction(() => window.NR && window.NRcam);
  await p.evaluate(async () => eval(await (await fetch('qa/readbot.js')).text()));
  let st; do { st = await p.evaluate(() => __read(true, 20000, 30)); } while (st.mode === 'ride' || st.mode === 'intro');
  const rows = await p.evaluate(() => __readLog()), info = await p.evaluate(() => ({ speed: NR.speed, tier: NR.fareTier }));
  console.log(`\nLevel ${id} (tier ${info.tier}), ${st.del} delivered, ${rows.length} forks, errors ${errs.length}`);
  console.log('| # | kind | words | budget s | legible s | legible from m (planned) | speed then m/s | lowest m/s | ok |');
  console.log('|---|---|---|---|---|---|---|---|---|');
  rows.forEach((r, i) => { const ok = r.leg + 1e-6 >= r.budget; if (!ok) fails++; console.log(`| ${i + 1}${r.teach ? 't' : ''} | ${r.kind} | ${r.words} | ${r.budget} | ${r.leg} | ${r.legFrom ?? '-'} (${r.pred}) | ${r.vAt ?? '-'} | ${r.minV} | ${ok ? 'yes' : 'NO'} |`); });
  const legs = rows.map(r => r.leg - r.budget); console.log(`min margin ${Math.min(...legs).toFixed(2)} s, forks under budget ${rows.filter(r => r.leg + 1e-6 < r.budget).length}`);
  errors += errs.length; if (errs.length) console.log(errs.slice(0, 5).join('\n'));
  await b.close();
}
console.log(`\nTOTAL forks under budget ${fails}, errors ${errors}`);
