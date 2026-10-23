// Nachtrit fares, played: level 1 on autopilot with the first passenger fork answered wrong on purpose,
// then a forced zombie Tikkie on a second ride. Checks refusal, missed, delivered, the first tip,
// the wallet invariant at the summary, the saved best score and that no shader compiled.
// usage: NR_URL=http://localhost:8767/index.html node qa/fares-play.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const URL = process.env.NR_URL || 'http://localhost:8765/index.html';
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const out = path.join('qa', 'out', 'fares-' + stamp); fs.mkdirSync(out, { recursive: true });
const errors = [];
let pass = 0, fail = 0;
const check = (name, cond, info) => { if (cond) { pass++; console.log('ok  ', name); } else { fail++; console.log('FAIL', name, info === undefined ? '' : JSON.stringify(info)); } };

// the run.mjs autopilot, except the first passenger fork goes into a wrong post
const AUTOPILOT = `window.autopilot = () => {
  if (NR.mode !== 'ride') return;
  const g = NR.activeFork;
  if (g) {
    const st = g.fork.st, passenger = st && !g.fork.read && !g.fork.entry.look;
    if (passenger && (!window.__wrong || window.__wrong.st === st) && st.wrong < Math.min(2, st.forks.length)) {
      if (!window.__wrong) window.__wrong = { st, gate: g, fare: st.fare, pre: NRfare(), delivered: NR.delivered, forks: st.forks.length };
      window.__wrong.gate = g;
      const bad = g.posts.find(q => q.oi !== g.fork.a); if (bad) { NR.lane = bad.lane; return; }
    }
    const p = g.posts.find(q => q.oi === g.fork.a); if (p) { NR.lane = p.lane; return; }
  }
  const ahead = NR.objs.filter(o => (o.type === 'obstacle' || o.type === 'puddle') && !o.hit && o.d - NR.dist > 0 && o.d - NR.dist < 22);
  const lanes = [0, 1, 2].slice(0, (NR.lanesN || 3));
  if (ahead.some(o => o.lane === NR.lane)) { const free = lanes.filter(l => !ahead.some(o => o.lane === l)); if (free.length) NR.lane = free.sort((a, b) => Math.abs(a - NR.lane) - Math.abs(b - NR.lane))[0]; }
};`;

// the game is driven in fixed steps (NRstep) so a loaded machine cannot slow the ride into a timeout;
// one snapshot per step in which the money changed, with the toast and card fare text of that step
const DRIVE = `(() => {
  window.__events = []; window.__fareLog = []; let last = '', lastFare = '';
  const fareEl = document.querySelector('#card .fare');
  window.__snap = () => {
    const ft = fareEl.textContent; if (ft && ft !== lastFare) window.__fareLog.push(ft); lastFare = ft;
    const m = NRfare(); const key = [m.cents, m.paid, m.tips, m.tikkie, m.cleanRow, m.missed].join('|');
    if (key !== last) { last = key; window.__events.push(Object.assign({ toast: document.getElementById('toast').textContent, delivered: NR.delivered, programs: NRinfo().programs }, m)); }
    const w = window.__wrong;
    if (w && !w.post && w.st.chosen.length === w.forks) w.post = Object.assign({ delivered: NR.delivered, card: ft }, NRfare());
  };
  window.__drive = (calls, n) => { for (let i = 0; i < calls && NR.mode !== 'dead'; i++) { autopilot(); NRstep(n); window.__snap(); } return NR.mode; };
})();`;

const browser = await chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('pageerror', e => errors.push('page: ' + String(e)));
await page.addInitScript(() => { try { localStorage.setItem('nachtrit.intro', '1'); const all = {}; for (let i = 1; i <= 40; i++) all[i] = 3; localStorage.setItem('nachtrit.progress', JSON.stringify(all)); localStorage.removeItem('nachtrit.scores'); } catch (e) {} });

async function rideLevel1() {
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.evaluate(AUTOPILOT);
  await page.click('#go'); await page.waitForTimeout(300);
  check('goLevel(1)', await page.evaluate(() => window.goLevel(1)));
  await page.waitForTimeout(300);
  const fareLine = await page.evaluate(() => document.getElementById('m_fare').textContent);
  check('mission card shows the fares', /^Fares here € \d+,\d\d/.test(fareLine), fareLine);
  await page.click('#m_go'); await page.waitForTimeout(900);
  await page.keyboard.press('Space'); await page.waitForTimeout(150); await page.keyboard.press('Space');
  for (let i = 0; i < 300 && await page.evaluate(() => NR.mode) !== 'intro'; i++) await page.waitForTimeout(100);
  for (let i = 0; i < 100 && await page.evaluate(() => { NRstep(6); return NR.mode; }) !== 'ride'; i++);
  await page.evaluate(() => { NR.lanesN = [...document.querySelectorAll('#lanes div')].filter(d => d.style.display !== 'none').length || 3; });
}

// ---- run 1: level 1 to the end, first passenger answered wrong
await rideLevel1();
await page.evaluate(DRIVE);
const programs0 = await page.evaluate(() => NRinfo().programs);
for (let i = 0; i < 600; i++) {
  const st = await page.evaluate(() => ({ mode: window.__drive(30, 10), dist: Math.round(NR.dist), delivered: NR.delivered, total: NR.deliveriesTotal }));
  if (i % 10 === 0) console.log('  ride', JSON.stringify(st));
  if (i === 12) await page.screenshot({ path: path.join(out, 'L1-ride.png') });
  if (st.mode === 'dead') break;
}
await page.screenshot({ path: path.join(out, 'L1-summary.png') });
const r = await page.evaluate(() => {
  const w = window.__wrong;
  return {
    mode: NR.mode, delivered: NR.delivered, total: NR.deliveriesTotal, fare: NRfare(), programs: NRinfo().programs,
    wrong: w ? { fare: w.fare, forks: w.forks, wrongs: w.st.wrong, pre: w.pre, deliveredBefore: w.delivered, post: w.post || null } : null,
    fareLog: window.__fareLog, events: window.__events, refusals: window.FARES.REFUSE.map(x => x.nl),
    summary: document.getElementById('summary').style.display, title: document.getElementById('sumtitle').textContent,
    wallet: document.getElementById('s_wallet').textContent, score: document.getElementById('s_score').textContent, best: document.getElementById('s_best').textContent,
    money: document.getElementById('s_money').textContent, hudWallet: document.getElementById('wallet').textContent,
    scores: localStorage.getItem('nachtrit.scores'), progress: localStorage.getItem('nachtrit.progress'),
    fmt: window.FARES.fmtEuro(NR.cents),
  };
});
console.log('level 1:', JSON.stringify({ mode: r.mode, title: r.title, delivered: `${r.delivered}/${r.total}`, fare: r.fare, wallet: r.wallet, score: r.score, best: r.best, money: r.money }));

// the wrong answer
check('a passenger fork was answered wrong', r.wrong && r.wrong.post, r.wrong);
if (r.wrong && r.wrong.post) {
  const { pre, post } = r.wrong;
  const pay = r.wrong.wrongs >= Math.min(3, r.wrong.forks) ? 0 : Math.floor(r.wrong.fare / 2 ** r.wrong.wrongs / 10) * 10;
  console.log('wrong ride:', JSON.stringify({ fare: r.wrong.fare, forks: r.wrong.forks, wrongs: r.wrong.wrongs, pay, pre, post }));
  check('the wrong ride pays nothing', pay === 0, pay);
  check('cents unchanged by the wrong ride', post.cents - pre.cents === -(post.tikkie - pre.tikkie) && post.paid === pre.paid, { pre, post });
  check('missed grew by that fare', post.missed - pre.missed === r.wrong.fare, { fare: r.wrong.fare, pre: pre.missed, post: post.missed });
  check('delivered did not grow', post.delivered === r.wrong.deliveredBefore, { before: r.wrong.deliveredBefore, after: post.delivered });
  check('cleanRow reset by the wrong fork', post.cleanRow === 0, post.cleanRow);
  const shown = r.fareLog.find(t => r.refusals.some(x => t.startsWith(x)));
  check('#card .fare showed a refusal', !!shown, r.fareLog.slice(0, 8));
  console.log('refusal on the card:', shown);
}

// the first tip: three clean rides in a row, cents up by the three fares + 100, 'Hou de rest maar.' in the toast
const ev = r.events; const ti = ev.findIndex((e, i) => i > 0 && e.tips > ev[i - 1].tips);
check('a tip was paid', ti > 0);
if (ti > 0) {
  let bi = ti - 1; while (bi > 0 && ev[bi].cleanRow !== 0) bi--;
  const base = ev[bi], tip = ev[ti];
  const paidRides = ev.slice(bi + 1, ti + 1).filter((e, k) => e.paid > ev[bi + k].paid).length;
  console.log('tip:', JSON.stringify({ base: { cents: base.cents, paid: base.paid, cleanRow: base.cleanRow }, tip: { cents: tip.cents, paid: tip.paid, tips: tip.tips, cleanRow: tip.cleanRow, toast: tip.toast } }));
  check('three clean paid rides before the tip', paidRides === 3 && tip.cleanRow === 3, { paidRides, cleanRow: tip.cleanRow });
  check('cents rose by the three fares + 100', tip.cents - base.cents === (tip.paid - base.paid) + 100 - (tip.tikkie - base.tikkie), { base, tip });
  check("the toast carries 'Hou de rest maar.'", tip.toast.includes('Hou de rest maar.'), tip.toast);
}

// the summary
const f = r.fare;
check('level finished, summary up', r.mode === 'dead' && r.summary === 'flex', { mode: r.mode, summary: r.summary });
check('invariant cents === paid + tips - tikkie', f.cents === f.paid + f.tips - f.tikkie, f);
check('cents % 10 === 0 and cents >= 0', f.cents % 10 === 0 && f.cents >= 0, f.cents);
check('summary Wallet shows the cents', r.wallet === r.fmt, { wallet: r.wallet, want: r.fmt });
check('HUD wallet caught up', r.hudWallet === r.fmt, r.hudWallet);
check('summary Score is NRfare().score', +r.score === f.score && f.score > 0, { shown: r.score, score: f.score });
check('Best equals the score on a first won run', +r.best === f.score, r.best);
check('nachtrit.scores saved the level', JSON.parse(r.scores || '{}')['1'] === f.score, r.scores);
check('nachtrit.progress is numbers only', Object.values(JSON.parse(r.progress || '{}')).every(v => typeof v === 'number'), r.progress);
check('summary money line', /^Fares € \d+,\d\d · tips € \d+,\d\d · Tikkie − € \d+,\d\d · missed € \d+,\d\d/.test(r.money), r.money);
const paidEvents = ev.filter((e, i) => i > 0 && e.paid > ev[i - 1].paid);
const p10 = paidEvents.length ? paidEvents[0].programs : programs0;
check(`no shader compiles across ${paidEvents.length} paid deliveries`, r.programs === p10 && paidEvents.every(e => e.programs === p10), { first: p10, end: r.programs, start: programs0 });

// ---- run 2: a forced zombie hit with 200 cents in the wallet
await rideLevel1();
let zr = null;
for (let i = 0; i < 600 && !zr; i++) {
  zr = await page.evaluate(() => {
    if (NR.mode !== 'ride') return null;
    const o = NR.objs.find(q => q.zombie && !q.hit && q.mesh && q.d - NR.dist > 3);
    if (!o) return null;
    NR.cents = 200; const before = NRfare();
    o.d = NR.dist + 0.3; o.pz = undefined; NR.lane = o.lane;
    NRstep(1);
    return { before, after: NRfare(), hit: o.hit, fx: document.getElementById('walletfx').textContent, fxClass: document.getElementById('walletfx').className, shake: document.getElementById('walletpill').classList.contains('shake'), toast: document.getElementById('toast').textContent };
  });
  if (!zr) await page.evaluate(() => { for (let k = 0; k < 6; k++) { autopilot(); NRstep(10); } });
}
console.log('zombie:', JSON.stringify(zr));
await page.screenshot({ path: path.join(out, 'L1-tikkie.png') });
check('a zombie was forced into the bike', zr && zr.hit, zr);
if (zr) {
  check('cents become 0', zr.after.cents === 0, zr.after.cents);
  check('tikkie 200', zr.after.tikkie - zr.before.tikkie === 200, zr.after.tikkie);
  check("toast stays '€4,50' / 'Tikkie.'", zr.toast === '€4,50Tikkie.', zr.toast);
  check("walletfx '− € 4,50' red, pill shakes", zr.fx === '− € 4,50' && zr.fxClass === 'lost' && zr.shake, zr);
  check('cleanRow reset by the Tikkie', zr.after.cleanRow === 0, zr.after.cleanRow);
}
const err = await page.evaluate(() => document.getElementById('err').textContent);
check('no error text on the page', !err, err);
check('no console or page errors', errors.length === 0, errors);

await browser.close();
console.log('frames in', out);
console.log(`fares-play: ${pass} passed, ${fail} failed | errors: ${errors.length}`);
process.exit(fail ? 1 : 0);
