// How far ahead fork signs become legible, measured on the game's own sign fitting (window.NRread: signFit + legDist),
// over every fork option in the content. Groups by the words on one sign and prints min / median / max metres, for tier 1
// (letters 1.3x) and tiers 2 and up. The numbers behind CONTENT-BRIEF.md "Word limits are reading limits".
// Fonts differ per system ("Segoe UI" on Windows, a fallback on Linux), so the metres shift a little between machines.
// usage: node qa/dt/sign-reach.mjs [base=http://localhost:8775/index.html]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:8775/index.html';
const b = await chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); p.setDefaultTimeout(120000);
await p.addInitScript(() => { localStorage.setItem('nachtrit.intro', '1'); });
await p.goto(base); await p.waitForFunction(() => window.NRread && window.LEVELS && window.LEVELS.length > 50);
const rows = await p.evaluate(() => {
  const { signFit, legDist } = NRread, seen = new Map();
  const walk = (x, tier1) => {
    if (!x || typeof x !== 'object') return;
    if (Array.isArray(x.o) && x.o.length > 1 && x.o.every(t => typeof t === 'string')) for (const t of x.o) seen.set(t + '|' + tier1, [t, tier1]);
    for (const v of Array.isArray(x) ? x : Object.values(x)) if (v && typeof v === 'object') walk(v, tier1);
  };
  for (const L of LEVELS) if (!L.soon) walk(L.items, (L.town || (L.id === 41 || L.id <= 5 ? 'alblasserdam' : '')) === 'alblasserdam');   // tier 1 is Alblasserdam
  const by = {};
  for (const [t, tier1] of seen.values()) {
    const n = t.trim().split(/\s+/).length, f = signFit(t), em = f.px / 250 * 1.02 * (tier1 ? 1.3 : 1);
    const k = (tier1 ? 't1 ' : 't2+') + ' ' + Math.min(n, 9);
    (by[k] = by[k] || []).push({ d: legDist(em), tall: f.H === 400, px: f.px });
  }
  return Object.entries(by).map(([k, a]) => { a.sort((x, y) => x.d - y.d); const q = i => a[Math.min(a.length - 1, Math.floor(i * a.length))].d;
    return { k, n: a.length, min: a[0].d, p10: q(0.1), med: q(0.5), p90: q(0.9), max: a[a.length - 1].d, tall: a.filter(x => x.tall).length }; })
    .sort((x, y) => x.k.localeCompare(y.k, 'en', { numeric: true }));
});
console.log('| tiers | words on the sign | signs | min m | 10% | median | 90% | max m | tall boards |'); console.log('|---|---|---|---|---|---|---|---|---|');
for (const r of rows) { const [t, w] = r.k.split(/\s+/); console.log(`| ${t === 't1' ? '1' : '2 to 13'} | ${w === '9' ? '9+' : w} | ${r.n} | ${r.min} | ${r.p10} | ${r.med} | ${r.p90} | ${r.max} | ${r.tall} |`); }
await b.close();
