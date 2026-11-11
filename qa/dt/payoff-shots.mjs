// Phase 5 frames on the real GPU (PLAN.md phase 5, items 1, 2 and 5): one headless Chrome, the game held and stepped as in
// qa/ride.mjs (requestAnimationFrame parked, timers on a virtual clock, Math.random seeded), the always-right autopilot of
// qa/lampbot.js, and a frame saved at the moments worth looking at:
//   word     level 1: a word in the air on its way to a dark lamp, then the lamp lit after it lands
//   signs    a shops street (--signs-level, default 60, Utrecht): a blank shop sign, then the same street after words gave signs back
//   dawn     ?dawn=<town> on one of its levels (--dawn-town gouda --dawn-level 12): the street at dawn, the dawn card, and the map with the town glowing
//   stop     a hard level ridden ignoring wisps (--stop-level, default 75): the bus stop as he passes it, the restart card
// usage: node qa/dt/payoff-shots.mjs [--base http://localhost:8780/index.html] [--jobs word,signs,dawn,stop] [--out dir]
//                                    [--signs-level 60] [--stop-level 75] [--dawn-town gouda] [--probe 60,68,70]
//   --probe ids   no frames: start each level and print how many lamps and shop signs its street has (to pick --signs-level)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const argv = process.argv.slice(2), val = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const base = val('base', 'http://localhost:8780/index.html'), jobs = val('jobs', 'word,signs,dawn,stop').split(','), probe = val('probe', '');
const out = val('out', `qa/out/payoff/${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`);
const DAWN_LEVEL = +val('dawn-level', 12), SIGNS = +val('signs-level', 60), STOP = +val('stop-level', 75), DAWN_TOWN = val('dawn-town', 'gouda');
fs.mkdirSync(out, { recursive: true });

function pageInit() {
  try { localStorage.setItem('nachtrit.intro', 'short'); localStorage.setItem('nachtrit.lamphint', '1'); localStorage.setItem('nachtrit.taught', '1'); } catch (e) {}
  let a = 7; Math.random = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const q = []; let now = 0, id = 0;
  window.setTimeout = (fn, ms, ...args) => { const i = --id; q.push({ i, at: now + (+ms || 0), fn, args }); return i; };
  window.clearTimeout = i => { const k = q.findIndex(t => t.i === i); if (k >= 0) q.splice(k, 1); };
  window.requestAnimationFrame = () => 0;
  window.__vt = { tick(sec) { now += sec * 1000; for (;;) { let k = -1; for (let i = 0; i < q.length; i++) if (q[i].at <= now && (k < 0 || q[i].at < q[k].at)) k = i; if (k < 0) return; const t = q.splice(k, 1)[0]; if (typeof t.fn === 'function') t.fn(...t.args); } } };
}
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--headless=new', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=gl'] });
const errors = [];
async function open(query, seedStars) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('pageerror', e => errors.push('page: ' + String(e))); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.addInitScript(pageInit);
  if (seedStars) await page.addInitScript(s => { try { localStorage.setItem('nachtrit.progress', JSON.stringify(s)); } catch (e) {} }, seedStars);
  await page.goto(`${base}?${query}&renderer=webgl&gpu=low`, { waitUntil: 'load', timeout: 180000 });
  for (let t = 0; ; t += 250) {
    if (await page.evaluate(() => !!(window.NR && window.NRstep && (NR.mode !== 'start' || document.getElementById('map').style.display === 'flex'))).catch(() => false)) break;
    if (t > 180000) throw new Error('no boot: ' + query);
    await new Promise(r => setTimeout(r, 250));
  }
  await page.evaluate(async () => { document.querySelectorAll('img').forEach(i => { if (i.style.zIndex === '1') i.remove(); }); eval(await (await fetch('qa/lampbot.js')).text()); window.__nl = NR.objs.some(o => o.lane === 2) ? 3 : 2; });
  return page;
}
// step until cond (a function body over NR, run each frame) holds, at most secs game seconds; the bot steers every 12 frames
async function stepUntil(page, cond, secs, collect = true) {
  return page.evaluate(({ cond, secs, collect }) => {
    const f = new Function('NR', 'return (' + cond + ')'); let n = 0;
    while (n < secs * 60) { n++; NRstep(1, () => {}); __vt.tick(1 / 60); if (n % 12 === 0 && NR.mode === 'ride') __bot(collect); if (f(NR)) return { ok: true, sec: Math.round(n / 6) / 10, mode: NR.mode }; }
    return { ok: false, sec: Math.round(n / 6) / 10, mode: NR.mode };
  }, { cond, secs, collect });
}
async function frame(page, name, note) {
  await page.evaluate(() => { document.querySelectorAll('img.__shot').forEach(i => i.remove()); NRbright(); const img = new Image(); img.className = '__shot'; img.src = NRpost().renderer.domElement.toDataURL(); img.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:1'; document.body.appendChild(img); });
  await new Promise(r => setTimeout(r, 400));
  const f = path.join(out, name + '.png'); await page.screenshot({ path: f });
  const w = await page.evaluate(() => window.NRwords ? NRwords() : null);
  console.log(`${name.padEnd(22)} ${f}  ${note || ''} ${w ? `| lamps ${w.lampsLit}/${w.lamps} lit, signs ${w.signsLit}/${w.signs}, in the air ${w.flying}` : ''}`);
  await page.evaluate(() => document.querySelectorAll('img.__shot').forEach(i => i.remove()));
}

if (probe) {
  for (const id of probe.split(',')) {
    const p = await open(`unlock=1&shot=0&level=${id}`);
    console.log(`L${id}`, JSON.stringify(await p.evaluate(i => { const l = LEVELS.find(x => x.id === +i) || {}; return { town: l.town, theme: l.theme, ...NRwords() }; }, id)));
    await p.close();
  }
}
if (!probe && jobs.includes('trace')) {   // numbers only: where the first word flies, frame by frame
  const p = await open('unlock=1&shot=0&level=1');
  await stepUntil(p, 'NRwords().flying > 0', 120);
  for (let i = 0; i < 8; i++) { console.log(JSON.stringify({ cam: await p.evaluate(() => NRcam().position.toArray().map(v => Math.round(v * 10) / 10)), ...(await p.evaluate(() => NRwords().at)) })); await stepUntil(p, 'false', 0.15); }
  await p.close();
}
if (!probe && jobs.includes('word')) {
  const p = await open('unlock=1&shot=0&level=1');
  let r = await stepUntil(p, 'NR.wordsBack.length >= 1 && NRwords().flying > 0', 120);
  await stepUntil(p, 'false', 0.7);
  await frame(p, 'L1-word-flying', `first right answer at ${r.sec} s: ${JSON.stringify(await p.evaluate(() => NR.wordsBack[0]))}`);
  r = await stepUntil(p, 'NRwords().flying === 0', 5); await stepUntil(p, 'false', 0.25);
  await frame(p, 'L1-lamp-catches', 'the lamp it landed in, catching, 0.25 s after');
  await stepUntil(p, 'false', 0.7);
  await frame(p, 'L1-lamp-lit', 'and lit, 0.7 s later');
  r = await stepUntil(p, 'NR.wordsBack.length >= 6 && NRwords().flying === 0', 200); await stepUntil(p, 'false', 1);
  await frame(p, 'L1-after-six', `six right answers: ${JSON.stringify(await p.evaluate(() => NR.wordsBack))}`);
  await p.close();
}
if (!probe && jobs.includes('signs')) {
  const p = await open(`unlock=1&shot=0&level=${SIGNS}`);
  await stepUntil(p, 'NR.mode === "ride"', 10); await stepUntil(p, 'false', 2);
  await frame(p, `L${SIGNS}-signs-blank`, 'the shops street at the start: signs blank');
  let r = await stepUntil(p, 'NR.wordsBack.some(w => w && !w.lamp) && NRwords().flying > 0', 200);
  await stepUntil(p, 'false', 0.55); await frame(p, `L${SIGNS}-word-to-sign`, `a word on its way to a sign at ${r.sec} s`);
  await stepUntil(p, 'NRwords().flying === 0', 5); await stepUntil(p, 'false', 0.3);
  await frame(p, `L${SIGNS}-sign-worded`, 'the sign has its word back');
  r = await stepUntil(p, 'NR.wordsBack.length >= 10 && NRwords().flying === 0', 300); await stepUntil(p, 'false', 1);
  await frame(p, `L${SIGNS}-signs-later`, `ten right answers: ${JSON.stringify(await p.evaluate(() => NRwords()))}`);
  await p.close();
}
if (!probe && jobs.includes('dawn')) {
  const lv = DAWN_LEVEL;
  const p = await open(`unlock=1&shot=0&level=${lv}&dawn=${DAWN_TOWN}`);
  await stepUntil(p, 'NR.mode === "ride"', 10); await stepUntil(p, 'false', 0.2);
  await frame(p, `dawn-${DAWN_TOWN}-card`, 'the dawn card as the ride begins');
  await stepUntil(p, 'false', 6);
  await frame(p, `dawn-${DAWN_TOWN}-street`, `L${lv} at dawn`);
  await stepUntil(p, 'NR.activeFork && NR.activeFork.armed', 60); await stepUntil(p, 'false', 1.2);
  await frame(p, `dawn-${DAWN_TOWN}-fork`, 'a fork at dawn');
  await p.close();
  const m = await open(`map=1&unlock=1&dawn=${DAWN_TOWN}`);
  await new Promise(r => setTimeout(r, 1500));
  const f = path.join(out, `dawn-${DAWN_TOWN}-map.png`); await m.screenshot({ path: f }); console.log(`dawn-${DAWN_TOWN}-map`.padEnd(22), f);
  await m.close();
}
if (!probe && jobs.includes('stop')) {
  const p = await open(`unlock=1&shot=0&level=${STOP}`);
  let r = await stepUntil(p, 'NR.objs.some(o => o.type === "halte" && NR.dist - o.d > -20 && NR.dist - o.d < -10) && !NR.activeFork', 400, false);
  await frame(p, `L${STOP}-bus-stop`, `the bus stop ahead at ${r.sec} s: ${JSON.stringify(await p.evaluate(() => ({ delivered: NR.delivered, total: NR.deliveriesTotal })))}`);
  r = await stepUntil(p, 'NR.cp && NR.cp.used && NR.mode === "ride"', 600, false);
  await stepUntil(p, 'false', 0.3);
  await frame(p, `L${STOP}-restart`, `restarted at ${r.sec} s (${r.ok ? 'after a dead lamp' : 'no restart'}): ${JSON.stringify(await p.evaluate(() => ({ lamp: Math.round(NR.lamp), delivered: NR.delivered, cp: NR.cp && { at: NR.cp.d, used: NR.cp.used } })))}`);
  r = await stepUntil(p, 'NR.mode === "dead"', 900, false);
  await new Promise(x => setTimeout(x, 300));
  const f = path.join(out, `L${STOP}-end-card.png`); await p.screenshot({ path: f });
  console.log(`L${STOP}-end-card`.padEnd(22), f, JSON.stringify(await p.evaluate(() => ({ stars: document.getElementById('stars').textContent, line: document.getElementById('sumline').textContent }))));
  await p.close();
}
console.log(errors.length ? 'errors:\n  ' + errors.slice(0, 10).join('\n  ') : 'errors 0');
await browser.close();
