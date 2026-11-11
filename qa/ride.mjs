// The step-driven ride (PLAN.md phase 1.1): rides whole levels by stepping the game with window.NRstep, so a slow or busy
// machine reaches the summary card in the same number of frames as a fast one. Nothing depends on wall-clock time:
//   - the game's own animation loop is held (requestAnimationFrame is parked), so only NRstep moves the world, 1/60 s a frame;
//   - setTimeout runs on a virtual clock that the steps advance (the passenger pick-up and the card use timers);
//   - Math.random is seeded (--seed), so the same tree and seed ride the same road and give the same numbers.
// It steers with the existing autopilot (__bot in qa/lampbot.js, every 12 frames as qa/dt/lamp-balance.mjs does: always
// right, dodges obstacles, collects wisps unless --ignore). Each page.evaluate runs a fixed chunk of frames (--chunk, default
// 300 = 5 game seconds), well under 30 s even on SwiftShader with another heavy job running.
// Nothing is drawn during the ride: the game's rules never read a drawn frame, and on SwiftShader one new shader program
// takes 10 to 30 s to compile in a draw. The renderer's draw call is a no-op inside the chunks (--draw draws the last frame
// of each chunk, as NRstep does by itself). Rides with and without drawing give the same numbers (checked 11 Nov on 1, 12, 75).
//
// usage: node qa/ride.mjs [levels=1] [--base URL] [--gpu] [--seed N|off] [--ignore] [--miss K] [--teach] [--chunk 300] [--draw]
//                         [--w 1280 --h 800] [--out dir] [--json file]
//   levels      comma list of level ids (1,75); practice (the 20 weakest items of the save) and trophy-<town> ride the built ones
//   --base      a served index.html; without it the script serves its own working tree on a free local port
//   --gpu       the installed Chrome on the real GPU (headless=new, ANGLE on GL); default is SwiftShader in Playwright's Chromium
//   --seed      seed for Math.random (default 1); off leaves the game random
//   --ignore    the autopilot ignores wisps (expect deaths on 58 and 75)
//   --miss K    ride through a wrong sign at every K-th fork (exercises the wrong path, the why line and the mistakes list)
//   --teach     a first-time player: the teaching forks of the first ride (nachtrit.taught unset)
//   --shots     also save a frame of the first why card (after a wrong answer), of the first card with the "again" tag
//               (a missed item come back) and of the first spaced-review fork (an item due from an earlier ride); use with --gpu
//   --keep      one browser profile for all the levels: the save (nachtrit.save) carries from ride to ride, as for a player
//               who rides them in a row. Without it every level is a first-time player's ride (a fresh profile)
//   --miss-only ids   apply --miss only on these levels (comma list), ride the others right
// With --keep, each ride also prints the save's numbers (PLAN.md phase 4): the ride counter, items in the learner model, the
// spaced-review forks it carried (from which level, their box, the tag on the card, the first try) and its own first-try
// misses; at the end, for every first-try miss, the later ride that brought it back as a marked review fork, or FAIL when
// the next two rides did not.
// With misses, each level also prints the learning core's numbers (PLAN.md 3a, 3d): the returns, the other forks between each
// miss and its return, full and paid fares, metres of review road, lamp lost on review road and while the why card was up.
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
const VALUED = ['base', 'seed', 'miss', 'chunk', 'w', 'h', 'out', 'json', 'miss-only'];
const pos = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && VALUED.includes(argv[i - 1].replace(/^--/, ''))));
const levels = (pos[0] || '1').split(',').map(s => s.trim()).filter(Boolean).map(s => /^\d+$/.test(s) ? +s : s);   // ids, or practice and trophy-<town> (with --keep)
const opt = {
  base: val('base', ''), gpu: flag('gpu'), draw: flag('draw'), shots: flag('shots'), seed: val('seed', '1'), collect: !flag('ignore'), miss: +val('miss', 0) || 0, teach: flag('teach'), keep: flag('keep'), missOnly: String(val('miss-only', '')).split(',').map(s => +s.trim()).filter(Boolean),
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
function rideSetup({ collect, miss, draw, shots }) {
  const R = window.__ride = { frame: 0, forks: 0, missed: 0, ended: false, idx: new WeakMap(), draw,
    shots: shots ? ['why', 'again'] : [], pause: '', lamp: NR.lamp, rev: false, why: false, lostRev: 0, lostWhy: 0, whySec: 0, revFrames: 0,
    gate: null, gateAfterWhy: false, reads: [], dueTags: new Map() };
  if (shots) R.shots.push('due');
  const rr = NRpost().renderer; R.drawCall = rr.render; R.noDraw = () => {};   // the renderer's own draw, and a stand-in that draws nothing
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
    // the learning core: lamp lost on a frame that began and ended on review road, or began under the why card
    const d = NR.lamp - R.lamp, rev = !!NR.onReview, why = NR.whyT > 0;
    if (d < 0 && rev && R.rev) R.lostRev -= d;
    if (d < 0 && R.why && NR.mode === 'ride') R.lostWhy -= d;
    if (why) R.whySec += 1 / 60; if (rev) R.revFrames++;
    R.lamp = NR.lamp; R.rev = rev; R.why = why;
    // reading time per fork: the legible seconds it had against its budget, and whether a why card came just before it
    const g0 = NR.activeFork;
    if (R.gate && R.gate !== g0 && R.gate.resolved) { R.reads.push({ legT: R.gate.legT, budget: R.gate.budget, go: !!R.gate.go, afterWhy: R.gateAfterWhy }); R.gate = null; }
    if (g0 && g0 !== R.gate) { R.gate = g0; R.gateAfterWhy = R.whyEnded; }
    if (g0 && g0.fork.entry.due && g0.armed && !R.dueTags.has(g0.fork.entry.nl)) R.dueTags.set(g0.fork.entry.nl, document.querySelector('#card .again').textContent);   // the tag on a review fork's card
    if (why) R.whyEnded = true; else if (g0) R.whyEnded = false;
    if (NR.mode === 'dead') { R.ended = true; throw R; }   // the summary card is up: stop on this frame
    if (R.frame % 12 === 0) R.steer();
    if (R.shots.length && NR.mode === 'ride') {   // --shots: stop the chunk on the frame worth a picture
      const g = NR.activeFork;
      if (R.shots[0] === 'why' && why && R.whySec > 1.6) { R.pause = R.shots.shift(); throw R; }
      if (R.shots.includes('due') && g && g.fork.entry.due && g.legT > 0.8) { R.shots.splice(R.shots.indexOf('due'), 1); R.pause = 'due'; throw R; }
      if (R.shots.includes('again') && g && g.fork.entry.again && !g.fork.entry.due && g.legT > 0.8) { R.shots.splice(R.shots.indexOf('again'), 1); R.pause = 'again'; throw R; }
    }
  };
  R.steer();
}
function rideChunk(n) {
  const R = window.__ride, t0 = performance.now(), rr = NRpost().renderer;
  if (!R.draw) rr.render = R.noDraw;
  R.pause = '';
  try { if (!R.ended) NRstep(n, R.each); } catch (e) { if (e !== R) throw e; } finally { rr.render = R.drawCall; }
  return { frame: R.frame, ended: R.ended, mode: NR.mode, ms: Math.round(performance.now() - t0), pause: R.pause };
}
// --shots: draw this frame into an image under the HUD (a headless screenshot does not see the WebGL canvas), or take it away
function shotFrame(on) {
  document.querySelectorAll('img.__shot').forEach(i => i.remove());
  if (!on) return;
  NRbright(); const img = new Image(); img.className = '__shot'; img.src = NRpost().renderer.domElement.toDataURL();
  img.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:1'; document.body.appendChild(img);
}
function rideResult() {
  const R = window.__ride, $ = id => document.getElementById(id);
  return {
    result: NR.mode === 'dead' ? (NR.dieT >= 10 ? 'home' : 'dies') : NR.mode, delivered: NR.delivered, total: NR.deliveriesTotal, right: NR.good, wrong: NR.bad,
    lamp: Math.round(NR.lamp * 10) / 10, lampMin: Math.round(NR.lampMin * 10) / 10, dist: Math.round(NR.dist), gameSec: Math.round(R.frame / 6) / 10, frames: R.frame,
    missedOnPurpose: R.missed,
    learn: { returns: NR.learn.returns, againRight: NR.learn.right, againWrong: NR.learn.wrong, whyCards: NR.learn.whyN, whySec: Math.round(R.whySec * 10) / 10,
      reviewM: Math.round(NR.reviewM), lampLostOnReview: Math.round(R.lostRev * 100) / 100, lampLostUnderWhy: Math.round(R.lostWhy * 100) / 100, missedItems: NR.missList.length,
      weakest: (document.querySelector('#s_missed .weak') || {}).textContent || '',
      reading: (() => { const sum = list => ({ forks: list.length, short: list.filter(r => r.legT < r.budget - 1e-6).length, minRatio: list.length ? Math.round(Math.min(...list.map(r => r.legT / r.budget)) * 100) / 100 : null });
        return { afterWhy: sum(R.reads.filter(r => r.afterWhy)), others: sum(R.reads.filter(r => !r.afterWhy)) }; })(),
      log: NR.learn.log.map(r => ({ nl: r.nl, misses: r.misses, afterFork: r.at, gap: r.gap, full: r.full, paid: r.fare, result: r.result })) },
    title: $('sumtitle').textContent, stars: $('stars').textContent, score: NR.score, cents: NR.cents, mistakes: NR.mistakes.length,
    summaryShown: $('summary').style.display === 'flex', errBox: $('err').textContent.trim(), timersLeft: __vt.pending(),
    save: { ride: NRsave().ride, items: Object.keys(NRsave().items).length, rules: Object.keys(NRsave().rules).length, stored: (localStorage.getItem('nachtrit.save') || '').length,
      due: NR.due.map(d => ({ key: d.key, nl: d.nl, box: d.box, level: d.level, result: d.result, tag: R.dueTags.get(d.nl) || '' })),
      missed: [...NR.noted].filter(([k, v]) => !v.right && !v.due).map(([k, v]) => ({ key: k, nl: v.nl })), practiceButton: $('practice').style.display !== 'none' },
  };
}

let keepCtx = null;   // --keep: one profile for every level
async function rideLevel(browser, base, id) {
  if (opt.keep && !keepCtx) keepCtx = await browser.newContext({ viewport: { width: opt.w, height: opt.h } });
  const page = keepCtx ? await keepCtx.newPage() : await browser.newPage({ viewport: { width: opt.w, height: opt.h } });
  const miss = opt.missOnly.length && !opt.missOnly.includes(id) ? 0 : opt.miss;
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
  await page.evaluate(rideSetup, { collect: opt.collect, miss, draw: opt.draw, shots: opt.shots });
  let st, chunks = 0, maxMs = 0, evalMax = 0; const evalMs = [], shots = [];
  do {
    const e0 = Date.now();
    st = await page.evaluate(rideChunk, opt.chunk); chunks++;
    maxMs = Math.max(maxMs, st.ms); evalMs.push(Date.now() - e0); evalMax = Math.max(evalMax, evalMs[evalMs.length - 1]);
    if (chunks % 10 === 0) process.stdout.write(`  L${id}: ${Math.round(st.frame / 60)} game s, ${Math.round((Date.now() - wall0) / 1000)} s wall\r`);
    if (st.pause) {   // --shots
      await page.evaluate(shotFrame, true); await new Promise(r => setTimeout(r, 500));   // the card's fade is real time
      const f = path.join(opt.out, `L${id}-${st.pause}.png`); await page.screenshot({ path: f }); shots.push(f);
      await page.evaluate(shotFrame, false);
    }
  } while (!st.ended && st.frame < MAX_FRAMES);
  const res = await page.evaluate(rideResult);
  if (!st.ended) errors.push(`harness: no summary card after ${MAX_FRAMES} frames (mode ${st.mode})`);
  if (res.errBox) errors.push('err box: ' + res.errBox.slice(0, 300));
  const png = path.join(opt.out, `L${id}-summary.png`);
  await page.screenshot({ path: png }).catch(() => {});
  await page.close();
  return { level: id, ...res, shots, chunks, chunkMsMax: maxMs, evaluateMsMax: evalMax, evaluateMs: evalMs.join(' '), wallSec: Math.round((Date.now() - wall0) / 1000), errors, png };
}

fs.mkdirSync(opt.out, { recursive: true });
let srv = null, base = opt.base;
if (!base) { srv = await serve(ROOT); base = `http://127.0.0.1:${srv.address().port}/index.html`; }
const browser = opt.gpu
  ? await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--headless=new', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=gl'] })
  : await chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
console.log(`ride: ${base} | ${opt.gpu ? 'GPU (Chrome)' : 'SwiftShader'} | seed ${opt.seed} | ${opt.collect ? 'collects wisps' : 'ignores wisps'}${opt.miss ? ` | misses every ${opt.miss}th fork` : ''}${opt.teach ? ' | first ride' : ''} | chunk ${opt.chunk} frames${opt.draw ? ', drawn' : ''}`);
const results = [];
let fail = 0;
try {
  for (const id of levels) {
    const r = await rideLevel(browser, base, id);
    results.push(r);
    const died = r.result !== 'home', bad = r.errors.length || !r.summaryShown || (died && opt.collect && !opt.miss);
    if (opt.keep) {
      const sv = r.save; console.log(`    save: ride ${sv.ride}, ${sv.items} items and ${sv.rules} rules in the learner model, nachtrit.save ${sv.stored} bytes`);
      for (const d of sv.due) console.log(`      review fork from L${d.level}, box ${d.box}, tag "${d.tag}", ${d.result || 'not ridden'}: ${d.nl}`);
      for (const m of sv.missed) console.log(`      missed on the first try: ${m.nl}`);
    }
    if (bad) fail++;
    console.log(`L${id}: ${r.result}, delivered ${r.delivered}/${r.total}, right ${r.right}, wrong ${r.wrong}, lamp left ${r.lamp} (lowest ${r.lampMin}), ${r.stars || '-'} ${r.title}, ${r.dist} m in ${r.gameSec} game s | ${r.wallSec} s wall, ${r.chunks} chunks, longest evaluate ${r.evaluateMsMax} ms | errors ${r.errors.length}${bad ? '  FAIL' : ''}`);
    const Ln = r.learn;
    if (Ln.whyCards || Ln.returns) {
      console.log(`    learning: ${Ln.returns} returns (right ${Ln.againRight}, wrong ${Ln.againWrong}), ${Ln.reviewM} m review road, lamp lost on it ${Ln.lampLostOnReview}; ${Ln.whyCards} why cards, ${Ln.whySec} s up, lamp lost under them ${Ln.lampLostUnderWhy}; ${Ln.missedItems} missed on the end card`);
      for (const x of Ln.log) console.log(`      ${x.misses === 1 ? 'back ' : 'back2'} after fork ${x.afterFork}, ${x.gap} forks between, fare ${x.full} -> ${x.paid}, ${x.result || 'not ridden'}: ${x.nl}`);
      if (Ln.weakest) console.log(`    ${Ln.weakest}`);
      const rd = Ln.reading; console.log(`    reading time: forks right after a why card ${rd.afterWhy.forks}, short of budget ${rd.afterWhy.short}, lowest legible/budget ${rd.afterWhy.minRatio}; other forks ${rd.others.forks}, short ${rd.others.short}, lowest ${rd.others.minRatio}`);
    }
    for (const f of r.shots) console.log('    shot: ' + f);
    for (const e of r.errors.slice(0, 6)) console.log('    ' + e.slice(0, 300));
  }
} finally {
  await browser.close();
  if (srv) srv.close();
}
if (opt.keep) {   // spaced review: every first-try miss comes back as a marked review fork within the next two rides
  console.log('\nspaced review across rides:');
  results.forEach((r, i) => {
    if (typeof r.level !== 'number' || r.level >= 1000) return;   // misses of level rides
    for (const m of r.save.missed) {
      const later = results.slice(i + 1).filter(x => typeof x.level === 'number' && x.level < 1000).slice(0, 2), at =   // the next two level rides (practice and trophy rides carry no review forks) later.findIndex(x => x.save.due.some(d => d.key === m.key && d.tag === 'again'));
      if (later.length < 2 && at < 0) { console.log(`  L${r.level} missed "${m.nl}": not enough level rides after it to tell`); continue; }
      if (at < 0) fail++;
      console.log(`  L${r.level} missed "${m.nl}": ${at < 0 ? 'not back within two rides  FAIL' : `back on L${later[at].level} (${at + 1} ride${at ? 's' : ''} later) as a review fork tagged again`}`);
    }
  });
}
console.log('\n| Level | result | delivered | right | wrong | lamp left | lowest lamp | game s | wall s | longest evaluate ms | errors |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|');
for (const r of results) console.log(`| ${r.level} | ${r.result} | ${r.delivered}/${r.total} | ${r.right} | ${r.wrong} | ${r.lamp} | ${r.lampMin} | ${r.gameSec} | ${r.wallSec} | ${r.evaluateMsMax} | ${r.errors.length} |`);
const report = { opt: { ...opt, base }, results };
fs.writeFileSync(path.join(opt.out, 'report.json'), JSON.stringify(report, null, 1));
if (opt.json) fs.writeFileSync(opt.json, JSON.stringify(report, null, 1));
console.log('out:', opt.out);
process.exit(fail ? 1 : 0);
