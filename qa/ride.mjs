// The step-driven ride (PLAN.md phase 1.1): rides whole levels by stepping the game with window.NRstep, so a slow or busy
// machine reaches the summary card in the same number of frames as a fast one. Nothing depends on wall-clock time:
//   - the game's own animation loop is held (requestAnimationFrame is parked), so only NRstep moves the world, 1/60 s a frame;
//   - setTimeout runs on a virtual clock that the steps advance (the passenger pick-up and the card use timers);
//   - Math.random is seeded (--seed), so the same tree and seed ride the same road and give the same numbers.
// It steers with the existing autopilot (__bot in qa/lampbot.js, every 12 frames as qa/dt/lamp-balance.mjs does: always
// right, dodges obstacles, collects wisps unless --ignore). Each page.evaluate runs a fixed chunk of frames (--chunk, default
// 300 = 5 game seconds), well under 30 s even on SwiftShader with another heavy job running.
//
// usage: node qa/ride.mjs [levels=1] [--base URL] [--gpu] [--seed N|off] [--ignore] [--miss K] [--teach] [--chunk 300]
//                         [--w 1280 --h 800] [--out dir] [--json file]
//   levels      comma list of level ids (1,75)
//   --base      a served index.html; without it the script serves its own working tree on a free local port
//   --gpu       the installed Chrome on the real GPU (headless=new, ANGLE on GL); default is SwiftShader in Playwright's Chromium
//   --seed      seed for Math.random (default 1); off leaves the game random
//   --ignore    the autopilot ignores wisps (expect deaths on 58 and 75)
//   --miss K    ride through a wrong sign at every K-th fork (exercises the wrong path, the why line and the mistakes list)
//   --teach     a first-time player: the teaching forks of the first ride (nachtrit.taught unset)
// Prints one line per level and a table; writes qa/out/ride/<stamp>/report.json and a PNG of each summary card.
// Exit 1 on any page error, a ride that never reached the summary card, or (in the default always-right, collecting mode) a death.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const argv = process.argv.slice(2), flag = k => argv.includes('--' + k);
const val = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d; };
const VALUED = ['base', 'seed', 'miss', 'chunk', 'w', 'h', 'out', 'json'];
const pos = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && VALUED.includes(argv[i - 1].replace(/^--/, ''))));
const levels = (pos[0] || '1').split(',').map(s => +s.trim()).filter(Boolean);
const opt = {
  base: val('base', ''), gpu: flag('gpu'), seed: val('seed', '1'), collect: !flag('ignore'), miss: +val('miss', 0) || 0, teach: flag('teach'),
  chunk: Math.max(12, Math.round((+val('chunk', 300) || 300) / 12) * 12), w: +val('w', 1280), h: +val('h', 800),
  out: val('out', path.join(ROOT, 'qa', 'out', 'ride', new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19))), json: val('json', ''),
};
const MAX_FRAMES = 60 * 60 * 20;   // 20 game minutes: a ride that has not ended by then is stuck

// ---- a no-cache static server for this working tree (only when --base is not given)
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.css': 'text/css', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.wasm': 'application/wasm' };
function serve(root) {
  const srv = http.createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname), file = path.join(root, rel.endsWith('/') ? rel + 'index.html' : rel);
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404, { 'Cache-Control': 'no-store' }); return res.end('not found'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    });
  });
  return new Promise(ok => srv.listen(0, '127.0.0.1', () => ok(srv)));
}

// ---- runs in the page before any of its scripts: seeded Math.random, virtual timers, the animation loop held
function pageInit({ seed, teach }) {
  try {
    localStorage.setItem('nachtrit.intro', 'short'); localStorage.setItem('nachtrit.lamphint', '1');
    if (teach) localStorage.removeItem('nachtrit.taught'); else localStorage.setItem('nachtrit.taught', '1');
  } catch (e) {}
  if (seed !== 'off') {   // mulberry32
    let a = (+seed >>> 0) || 1;
    Math.random = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const q = []; let now = 0, nextId = 0;
  window.setTimeout = (fn, ms, ...args) => { const id = --nextId; q.push({ id, at: now + (+ms || 0), fn, args }); return id; };   // negative ids: never a real timer's
  window.clearTimeout = id => { const i = q.findIndex(t => t.id === id); if (i >= 0) q.splice(i, 1); };
  window.requestAnimationFrame = () => 0;   // the game's loop() stops after its first frame; NRstep moves the world from here
  window.__vt = {
    now: () => now, pending: () => q.length,
    tick(sec) {   // advance the virtual clock and run every timer now due, in order of due time
      now += sec * 1000;
      for (;;) {
        let k = -1; for (let i = 0; i < q.length; i++) if (q[i].at <= now && (k < 0 || q[i].at < q[k].at)) k = i;
        if (k < 0) return;
        const t = q.splice(k, 1)[0]; if (typeof t.fn === 'function') t.fn(...t.args);
      }
    },
  };
}

// ---- the ride, in the page (after qa/lampbot.js has defined __bot)
function rideSetup({ collect, miss }) {
  const R = window.__ride = { frame: 0, forks: 0, missed: 0, ended: false, idx: new WeakMap() };
  window.__nl = NR.objs.some(o => o.lane === 2) ? 3 : 2;   // as lamp-balance.mjs: two-lane levels have no lane 2
  R.steer = () => {
    if (NR.mode !== 'ride') return;
    __bot(collect);
    const g = NR.activeFork;
    if (g && miss) {
      if (!R.idx.has(g)) { R.idx.set(g, R.forks++); if (R.idx.get(g) % miss === miss - 1) R.missed++; }
      if (R.idx.get(g) % miss === miss - 1) { const p = g.posts.find(q => q.oi !== g.fork.a); if (p) NR.lane = p.lane; }
    }
  };
  R.each = () => {
    R.frame++; __vt.tick(1 / 60);
    if (NR.mode === 'dead') { R.ended = true; throw R; }   // the summary card is up: stop on this frame
    if (R.frame % 12 === 0) R.steer();
  };
  R.steer();
}
function rideChunk(n) {
  const R = window.__ride, t0 = performance.now();
  if (!R.ended) { try { NRstep(n, R.each); } catch (e) { if (e !== R) throw e; } }
  return { frame: R.frame, ended: R.ended, mode: NR.mode, ms: Math.round(performance.now() - t0) };
}
function rideResult() {
  const R = window.__ride, $ = id => document.getElementById(id);
  return {
    result: NR.mode === 'dead' ? (NR.dieT >= 10 ? 'home' : 'dies') : NR.mode, delivered: NR.delivered, total: NR.deliveriesTotal, right: NR.good, wrong: NR.bad,
    lamp: Math.round(NR.lamp * 10) / 10, lampMin: Math.round(NR.lampMin * 10) / 10, dist: Math.round(NR.dist), gameSec: Math.round(R.frame / 6) / 10, frames: R.frame,
    missedOnPurpose: R.missed,
    title: $('sumtitle').textContent, stars: $('stars').textContent, score: NR.score, cents: NR.cents, mistakes: NR.mistakes.length,
    summaryShown: $('summary').style.display === 'flex', errBox: $('err').textContent.trim(), timersLeft: __vt.pending(),
  };
}

async function rideLevel(browser, base, id) {
  const page = await browser.newPage({ viewport: { width: opt.w, height: opt.h } });
  page.setDefaultTimeout(180000);
  const errors = [];
  page.on('pageerror', e => errors.push('page: ' + String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('response', r => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`); });
  await page.route('**/favicon.ico', r => r.fulfill({ status: 204, body: '' }));
  await page.addInitScript(pageInit, { seed: String(opt.seed), teach: opt.teach });
  const wall0 = Date.now();
  await page.goto(`${base}?unlock=1&shot=0&level=${id}&renderer=webgl${opt.gpu ? '&gpu=low' : ''}`, { waitUntil: 'load' });
  // booted: start() has run and the held frame is up (the ?shot path ends with it)
  // (polled from Node: the page's requestAnimationFrame and setTimeout are the harness's own, so waitForFunction cannot poll)
  for (let t = 0; ; t += 250) {
    if (await page.evaluate(() => !!(window.NR && window.NRstep && [...document.images].some(i => i.style.zIndex === '1'))).catch(() => false)) break;
    if (t > 180000) throw new Error(`level ${id}: the page did not boot in 180 s (${errors.slice(0, 3).join(' | ')})`);
    await new Promise(r => setTimeout(r, 250));
  }
  const r0 = await page.evaluate(() => { document.querySelectorAll('img').forEach(i => { if (i.style.zIndex === '1') i.remove(); }); return { mode: NR.mode, level: NR.deliveriesTotal }; });
  if (r0.mode !== 'intro') errors.push(`harness: level ${id} did not start (mode ${r0.mode})`);
  await page.evaluate(async () => { eval(await (await fetch('qa/lampbot.js')).text()); });
  await page.evaluate(rideSetup, { collect: opt.collect, miss: opt.miss });
  let st, chunks = 0, maxMs = 0, evalMax = 0;
  do {
    const e0 = Date.now();
    st = await page.evaluate(rideChunk, opt.chunk); chunks++;
    maxMs = Math.max(maxMs, st.ms); evalMax = Math.max(evalMax, Date.now() - e0);
    if (chunks % 10 === 0) process.stdout.write(`  L${id}: ${Math.round(st.frame / 60)} game s, ${Math.round((Date.now() - wall0) / 1000)} s wall\r`);
  } while (!st.ended && st.frame < MAX_FRAMES);
  const res = await page.evaluate(rideResult);
  if (!st.ended) errors.push(`harness: no summary card after ${MAX_FRAMES} frames (mode ${st.mode})`);
  if (res.errBox) errors.push('err box: ' + res.errBox.slice(0, 300));
  const png = path.join(opt.out, `L${id}-summary.png`);
  await page.screenshot({ path: png }).catch(() => {});
  await page.close();
  return { level: id, ...res, chunks, chunkMsMax: maxMs, evaluateMsMax: evalMax, wallSec: Math.round((Date.now() - wall0) / 1000), errors, png };
}

fs.mkdirSync(opt.out, { recursive: true });
let srv = null, base = opt.base;
if (!base) { srv = await serve(ROOT); base = `http://127.0.0.1:${srv.address().port}/index.html`; }
const browser = opt.gpu
  ? await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--headless=new', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=gl'] })
  : await chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
console.log(`ride: ${base} | ${opt.gpu ? 'GPU (Chrome)' : 'SwiftShader'} | seed ${opt.seed} | ${opt.collect ? 'collects wisps' : 'ignores wisps'}${opt.miss ? ` | misses every ${opt.miss}th fork` : ''}${opt.teach ? ' | first ride' : ''} | chunk ${opt.chunk} frames`);
const results = [];
let fail = 0;
try {
  for (const id of levels) {
    const r = await rideLevel(browser, base, id);
    results.push(r);
    const died = r.result !== 'home', bad = r.errors.length || !r.summaryShown || (died && opt.collect && !opt.miss);
    if (bad) fail++;
    console.log(`L${id}: ${r.result}, delivered ${r.delivered}/${r.total}, right ${r.right}, wrong ${r.wrong}, lamp left ${r.lamp} (lowest ${r.lampMin}), ${r.stars || '-'} ${r.title}, ${r.dist} m in ${r.gameSec} game s | ${r.wallSec} s wall, ${r.chunks} chunks, longest evaluate ${r.evaluateMsMax} ms | errors ${r.errors.length}${bad ? '  FAIL' : ''}`);
    for (const e of r.errors.slice(0, 6)) console.log('    ' + e.slice(0, 300));
  }
} finally {
  await browser.close();
  if (srv) srv.close();
}
console.log('\n| Level | result | delivered | right | wrong | lamp left | lowest lamp | game s | wall s | longest evaluate ms | errors |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|');
for (const r of results) console.log(`| ${r.level} | ${r.result} | ${r.delivered}/${r.total} | ${r.right} | ${r.wrong} | ${r.lamp} | ${r.lampMin} | ${r.gameSec} | ${r.wallSec} | ${r.evaluateMsMax} | ${r.errors.length} |`);
const report = { opt: { ...opt, base }, results };
fs.writeFileSync(path.join(opt.out, 'report.json'), JSON.stringify(report, null, 1));
if (opt.json) fs.writeFileSync(opt.json, JSON.stringify(report, null, 1));
console.log('out:', opt.out);
process.exit(fail ? 1 : 0);
