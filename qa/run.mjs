// Nachtrit QA: plays the game in headless Chromium and saves frames + a report.
// usage: node qa/run.mjs [1..25 | endless | intro | all]   (server must run on :8765)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const URL = process.env.NR_URL || 'http://localhost:8765/index.html';
const what = process.argv[2] || '1';
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const out = path.join('qa', 'out', stamp); fs.mkdirSync(out, { recursive: true });
const report = { url: URL, what, started: new Date().toISOString(), errors: [], runs: [] };
const log = (...a) => { console.log(...a); };

const AUTOPILOT = `window.autopilot = () => {
  if (NR.mode !== 'ride') return;
  const g = NR.activeFork;
  if (g) { const p = g.posts.find(q => q.oi === g.fork.a); if (p) { NR.lane = p.lane; return; } }
  const ahead = NR.objs.filter(o => (o.type === 'obstacle' || o.type === 'puddle') && !o.hit && o.d - NR.dist > 0 && o.d - NR.dist < 22);
  const lanes = [0, 1, 2].slice(0, (NR.lanesN || 3));
  if (ahead.some(o => o.lane === NR.lane)) { const free = lanes.filter(l => !ahead.some(o => o.lane === l)); if (free.length) NR.lane = free.sort((a, b) => Math.abs(a - NR.lane) - Math.abs(b - NR.lane))[0]; }
};`;

const browser = await chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', m => { if (m.type() === 'error') report.errors.push({ where: 'console', text: m.text() }); });
page.on('pageerror', e => report.errors.push({ where: 'page', text: String(e) }));

async function shot(name) { const f = path.join(out, name + '.png'); await page.screenshot({ path: f }); return f; }
async function errBox() { return page.evaluate(() => document.getElementById('err').textContent); }

async function fps(ms) {
  return page.evaluate(async (ms) => { const t0 = performance.now(); let n = 0, worst = 0, last = t0; await new Promise(res => { function f(t) { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < ms) requestAnimationFrame(f); else res(); } requestAnimationFrame(f); }); return { fps: Math.round(n / (ms / 1000)), worstMs: Math.round(worst) }; }, ms);
}

await page.addInitScript(() => { try { localStorage.setItem('nachtrit.intro', '1'); const all = {}; for (let i = 1; i <= 40; i++) all[i] = 3; localStorage.setItem('nachtrit.progress', JSON.stringify(all)); } catch (e) {} });   // every district open for testing
async function openGame() {
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.evaluate(AUTOPILOT);
}

async function playLevel(n) {
  const run = { level: n, frames: [], events: [] };
  await openGame();
  await page.click('#go'); await page.waitForTimeout(300);
  await shot(`map`);
  const ok = await page.evaluate((n) => window.goLevel(n), n);
  if (!ok) { run.skipped = 'locked or missing'; report.runs.push(run); return; }
  await page.waitForTimeout(300); run.frames.push(await shot(`L${n}-mission`));
  await page.evaluate(() => { NR.lanesN = 3; });
  await page.click('#m_go');
  await page.waitForTimeout(900); run.frames.push(await shot(`L${n}-intro`)); for (let k = 0; k < 12 && await page.evaluate(() => window.NR && NR.mode !== 'ride' && NR.mode !== 'intro'); k++) { await page.keyboard.press('Space'); await page.waitForTimeout(400); }
  await page.evaluate(() => { NR.lanesN = document.querySelectorAll('#lanes div[style*="display: none"]').length ? 2 : 3; });
  await page.waitForTimeout(4200); run.frames.push(await shot(`L${n}-ride-start`));
  const t0 = Date.now(); let lastShot = 0, shotIdx = 0, lastForkD = -1;
  while (Date.now() - t0 < 600000) {   // long levels: up to ten minutes of software rendering
    const st = await page.evaluate(() => { autopilot(); NR.lanesN = [...document.querySelectorAll('#lanes div')].filter(d => d.style.display !== 'none').length || 3; const g = NR.activeFork; return { mode: NR.mode, dist: NR.dist, delivered: NR.delivered, total: NR.deliveriesTotal, good: NR.good, bad: NR.bad, lamp: NR.lamp, forkD: g ? g.d : -1, forkZ: g ? NR.dist - g.d : 99, kind: g ? (g.fork.read ? 'read' : g.fork.entry.look ? 'look' : g.fork.entry.listen ? 'listen' : 'word') : '' }; });
    if (st.mode === 'dead') break;
    if (st.forkD !== lastForkD && st.forkZ > -9) { lastForkD = st.forkD; run.frames.push(await shot(`L${n}-fork${++shotIdx}-${st.kind}`)); run.events.push({ t: Date.now() - t0, fork: st.kind, dist: Math.round(st.dist) }); }
    else if (Date.now() - lastShot > 6000) { lastShot = Date.now(); run.frames.push(await shot(`L${n}-t${Math.round((Date.now() - t0) / 1000)}s`)); }
    await page.waitForTimeout(90);
  }
  run.perf = await fps(3000).catch(() => null);
  run.result = await page.evaluate(() => ({ mode: NR.mode, dist: Math.round(NR.dist), delivered: NR.delivered + '/' + NR.deliveriesTotal, good: NR.good, bad: NR.bad, lampMin: Math.round(NR.lampMin), title: document.getElementById('sumtitle').textContent, stars: document.getElementById('stars').textContent, progress: localStorage.getItem('nachtrit.progress') }));
  run.frames.push(await shot(`L${n}-end`)); run.err = await errBox();
  report.runs.push(run); log(`level ${n}:`, JSON.stringify(run.result), run.perf ? `fps ${run.perf.fps} worst ${run.perf.worstMs}ms` : '', run.err ? 'ERR ' + run.err : '');
}

async function playIntro() {
  await page.goto(URL + '?intro=1', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  await shot('title');
  await page.click('#go');
  for (let i = 0; i < 14; i++) { await page.waitForTimeout(3400); await shot(`intro${i + 1}`); await page.keyboard.press('Space'); await page.waitForTimeout(150); await page.keyboard.press('Space'); }
  await page.waitForTimeout(400); await shot('after-intro');
  report.runs.push({ intro: true, err: await errBox() });
}

async function playEndless() {
  await openGame(); await page.click('#go'); await page.waitForTimeout(300); await page.click('#endless');
  await page.waitForTimeout(4200);
  const t0 = Date.now(); let i = 0;
  while (Date.now() - t0 < 40000) { await page.evaluate(() => autopilot()); if ((Date.now() - t0) > i * 8000) { await shot(`endless-${i++}`); } await page.waitForTimeout(90); const dead = await page.evaluate(() => NR.mode === 'dead'); if (dead) break; }
  const perf = await fps(3000).catch(() => null);
  const res = await page.evaluate(() => ({ mode: NR.mode, dist: Math.round(NR.dist), good: NR.good, bad: NR.bad }));
  report.runs.push({ endless: true, res, perf, err: await errBox() }); log('endless:', JSON.stringify(res), perf);
}

try {
  if (what === 'intro') await playIntro();
  else if (what === 'endless') await playEndless();
  else if (what === 'all') { await playIntro(); for (let n = 1; n <= 5; n++) await playLevel(n); await playEndless(); }
  else await playLevel(parseInt(what, 10));
} catch (e) { report.errors.push({ where: 'harness', text: String(e && e.stack || e) }); log('harness error', e); }
report.finished = new Date().toISOString();
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
log('frames in', out, '| errors:', report.errors.length);
await browser.close();
