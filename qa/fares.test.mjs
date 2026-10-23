// Unit checks for fares.js: loads it in a vm with a fake window, no browser needed.
// usage: node qa/fares.test.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '..', 'fares.js'), 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(src, ctx, { filename: 'fares.js' });
const F = ctx.window.FARES;

let pass = 0, fail = 0;
const eq = (name, got, want) => {
  if (got === want) pass++;
  else { fail++; console.log(`FAIL ${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`); }
};
const ok = (name, cond) => eq(name, !!cond, true);

ok('window.FARES exists', F);
eq('only FARES on window', Object.keys(ctx.window).join(','), 'FARES');
eq('FARES keys', Object.keys(F).sort().join(','), ['euroToWords', 'fmtEuro', 'fareFor', 'payCents', 'FLAT', 'REFUSE', 'TIPS'].sort().join(','));

const WORDS = [
  [0, 'nul euro'], [0.5, 'vijftig cent'], [0.1, 'tien cent'], [1, 'één euro'], [1.5, 'één euro vijftig'],
  [2, 'twee euro'], [2.3, 'twee euro dertig'], [4.5, 'vier euro vijftig'], [7, 'zeven euro'], [11.1, 'elf euro tien'],
  [12.3, 'twaalf euro dertig'], [21, 'eenentwintig euro'], [22, 'tweeëntwintig euro'], [23.2, 'drieëntwintig euro twintig'],
  [33, 'drieëndertig euro'], [44.4, 'vierenveertig euro veertig'], [48.8, 'achtenveertig euro tachtig'],
  [99.9, 'negenennegentig euro negentig'], [100, 'honderd euro'], [101, 'honderdeen euro'],
  [150.5, 'honderdvijftig euro vijftig'], [200, 'tweehonderd euro'],
];
for (const [n, w] of WORDS) eq(`euroToWords(${n})`, F.euroToWords(n), w);
eq('euroToWords rows', WORDS.length, 22);

const PAY = [[[450, 0, 1], 450], [[450, 1, 1], 0], [[450, 1, 2], 220], [[450, 2, 2], 0], [[1050, 2, 3], 260], [[1050, 3, 3], 0]];
for (const [args, want] of PAY) eq(`payCents(${args.join(',')})`, F.payCents(...args), want);

const entry = forks => ({ parts: Array.from({ length: forks }, () => ({ o: ['a', 'b'], a: 0 })).flatMap(p => ['x', p]) });
for (let tier = 1; tier <= 12; tier++) for (let forks = 1; forks <= 4; forks++) {
  const f = F.fareFor(entry(forks), tier);
  ok(`fareFor tier ${tier} forks ${forks} = ${f} in 200..1200`, f >= 200 && f <= 1200);
  eq(`fareFor tier ${tier} forks ${forks} % 10`, f % 10, 0);
}
eq('fareFor tier 1 one fork', F.fareFor(entry(1), 1), 200);
eq('fareFor tier 3 two forks', F.fareFor(entry(2), 3), 450);
eq('fareFor tier 12 three forks', F.fareFor(entry(3), 12), 1050);
eq('fareFor cap', F.fareFor(entry(4), 12), 1200);
eq('fareFor word item', F.fareFor({ w: 'the dog', nl: 'de hond' }, 1), 200);
eq('fareFor read', F.fareFor({ read: true }, 5), F.FLAT.read);
eq('fareFor look', F.fareFor({ look: true }, 5), F.FLAT.look);
eq('fareFor dehet', F.fareFor({ dehet: true, parts: [{ o: ['de', 'het'] }, 'x'] }, 5), F.FLAT.dehet);
eq('FLAT', JSON.stringify(F.FLAT), JSON.stringify({ dehet: 50, look: 100, read: 150 }));

eq('fmtEuro(450)', F.fmtEuro(450), '€ 4,50');
eq('fmtEuro(0)', F.fmtEuro(0), '€ 0,00');
eq('fmtEuro(1230)', F.fmtEuro(1230), '€ 12,30');

for (const r of F.REFUSE) { ok(`no ! in refusal ${r.nl}`, !/!/.test(r.nl + r.en)); ok(`refusal tier ${r.nl}`, r.minTier >= 1); }
for (const t of F.TIPS) ok(`no ! in tip ${t.nl}`, !/!/.test(t.nl + t.en));
ok('first tip is Hou de rest maar.', F.TIPS.find(t => t.first).nl === 'Hou de rest maar.');
for (let tier = 1; tier <= 12; tier++) ok(`at least two refusals at tier ${tier}`, F.REFUSE.filter(r => r.minTier <= tier && tier <= r.maxTier).length >= 2);

console.log(`fares.test: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
