// The mission card per level: is the Ride button inside the screen? usage: node mission-fit.mjs <base> <w> <h> <ids comma separated>
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [base, w, h, ids, shot] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: +w, height: +h } }); const errs = [];
p.on('pageerror', e => errs.push(String(e)));
await p.goto(base + '?unlock=1&map=1'); await p.waitForFunction(() => window.NR && window.goLevel); await p.waitForTimeout(800);
for (const id of ids.split(',').map(Number)) {
  const r = await p.evaluate(id => {
    const ok = window.goLevel(id); const m = document.getElementById('mission'), box = m && m.querySelector('.box'), go = document.getElementById('m_go');
    const rb = box ? box.getBoundingClientRect() : null, rg = go.getBoundingClientRect(), cs = getComputedStyle(m);
    const kids = box ? [...box.children].map(c => `${c.id || c.className || c.tagName}:${Math.round(c.getBoundingClientRect().height)}`).join(' ') : '';
    return { id, ok, boxTop: rb && Math.round(rb.top), boxH: rb && Math.round(rb.height), goBottom: Math.round(rg.bottom), overflowY: cs.overflowY, kids };
  }, id);
  console.log(JSON.stringify(r));
  if (shot) await p.screenshot({ path: `${shot}-L${id}.png` });
  await p.evaluate(() => { const m = document.getElementById('mission'); if (m) m.style.display = 'none'; });
}
console.log('errors', errs.length, errs.slice(0, 2).join(' | '));
await b.close();
