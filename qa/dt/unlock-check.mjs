// ?unlock=1 opens every town for a fresh player, is remembered without the parameter, ?unlock=0 locks again; the stars stay untouched.
// usage: node unlock-check.mjs [base=http://127.0.0.1:8779/index.html]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8765/index.html';
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
const look = async (q) => {
  await p.goto(base + q); await p.waitForFunction(() => window.NR); await p.waitForTimeout(900);
  return p.evaluate(() => ({ towns: document.querySelectorAll('#nl .town').length, locked: document.querySelectorAll('#nl .town.locked').length,
    places: document.querySelectorAll('#town .place').length, placesLocked: document.querySelectorAll('#town .place.locked').length,
    flag: localStorage.getItem('nachtrit.unlock'), progress: localStorage.getItem('nachtrit.progress') }));
};
for (const [label, q] of [['fresh player', '?map=1'], ['?unlock=1', '?unlock=1&map=1'], ['remembered', '?map=1'], ['amsterdam card', '?map=amsterdam'], ['?unlock=0', '?unlock=0&map=1']])
  console.log(label.padEnd(15), JSON.stringify(await look(q)));
for (const town of (process.argv[3] || 'gouda,utrecht,rotterdam').split(',')) {
  await p.goto(base + '?unlock=1&map=' + town); await p.waitForFunction(() => window.NR); await p.waitForTimeout(900);
  const name = await p.evaluate(() => { const s = document.querySelector('#town .place:not(.locked) .lv'); if (!s) return null; s.click(); return s.textContent; });
  await p.waitForTimeout(400); if (name) await p.click('#m_go').catch(e => errs.push('harness: ' + e.message));
  for (let k = 0; k < 8 && await p.evaluate(() => NR.mode !== 'ride' && NR.mode !== 'intro'); k++) { await p.keyboard.press('Space'); await p.waitForTimeout(400); }
  await p.waitForTimeout(4000); await p.screenshot({ path: `qa/out/unlock-${town}-ride.png` });
  console.log(town.padEnd(10), 'level', JSON.stringify(name), 'mode', await p.evaluate(() => NR.mode));
}
console.log('errors', errs.length, errs.slice(0, 3).join(' | '));
await b.close();
