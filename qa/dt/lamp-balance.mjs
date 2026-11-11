// The lamp balance table of HANDOVER section 6: qa/lampbot.js (always-right autopilot) on each level, collecting wisps
// and ignoring them. Prints finish or death, deliveries and the lamp left.
// usage: node qa/dt/lamp-balance.mjs [base] [levels=1,11,58,75] [modes=collect,ignore] [--gpu]
//   --gpu renders on the real GPU through the installed Chrome (the lamp maths is the same; a run takes minutes, not half an hour)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const pos = process.argv.slice(2).filter(a => !a.startsWith('--')), gpu = process.argv.includes('--gpu');
const base = pos[0] || 'http://localhost:8765/index.html', levels = (pos[1] || '1,11,58,75').split(',').map(Number), modes = (pos[2] || 'collect,ignore').split(',');
const launch = () => gpu ? chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--headless=new', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=gl'] })
  : chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
console.log('| Level | mode | result | delivered | lamp left | lowest lamp | dist m | errors |'); console.log('|---|---|---|---|---|---|---|---|');
for (const id of levels) for (const mode of modes) {
  const b = await launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); p.setDefaultTimeout(120000);
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => { localStorage.setItem('nachtrit.intro', 'short'); localStorage.setItem('nachtrit.taught', '1'); localStorage.setItem('nachtrit.lamphint', '1'); });
  await p.goto(`${base}?unlock=1&shot=0&level=${id}${gpu ? '&renderer=webgl&gpu=low' : ''}`); await p.waitForFunction(() => window.NR && window.NRstep);
  await p.evaluate(async () => { eval(await (await fetch('qa/lampbot.js')).text()); window.__nl = NR.objs.some(o => o.lane === 2) ? 3 : 2; });
  await p.evaluate(() => { while (NR.mode === 'intro') NRstep(30); });
  let r; do { r = await p.evaluate(c => __sim('k', c, 20000), mode === 'collect'); } while (r.mode === 'ride');
  const done = await p.evaluate(() => NR.dieT >= 10);
  console.log(`| ${id} | ${mode} | ${done ? 'finishes' : 'dies'} | ${r.del} | ${r.lamp} | ${r.minL} | ${r.dist} | ${errs.length} |`);
  await b.close();
}
