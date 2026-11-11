// Which items carry a level's new words, and how often each new word returns in the next ten levels.
// usage: node qa/vocab-items.mjs 7 [12 ...]     (level ids; prints each item with its new lemmas marked, then a summary)
// New = not in any earlier level in play order (the same lemma rule as qa/audit-vocab.mjs). A work tool for the vocabulary pass.
import fs from 'node:fs'; import path from 'node:path';
import { loadContent, kindOf } from './lib/load.mjs';
import { tokens, stem, allowList } from './lib/nl.mjs';
const ROOT = process.cwd(); const { levels } = loadContent(ROOT); const allow = allowList(ROOT);
const NAMES = new Set([...allow].filter(([, g]) => /^names|^places/.test(g)).map(([w]) => w));
const freq = fs.readFileSync(path.join(ROOT, 'qa', 'data', 'nl-freq-top5000.txt'), 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split(' ')[0]);
const rank = new Map(); freq.forEach((w, i) => { const s = stem(w); if (!rank.has(s)) rank.set(s, i + 1); });
const rightText = it => it.parts ? it.parts.map(p => typeof p === 'string' ? p : p.o[p.a]).join(' ') : it.dehet ? `${it.art} ${it.nl}` : (it.nl || '');
const lem = s => tokens(s).filter(t => !NAMES.has(t.toLowerCase()) && !/^\d/.test(t)).map(t => [stem(t), t.toLowerCase()]);
const seen = new Set(), at = new Map(), occ = levels.map(() => new Map());
levels.forEach((lv, i) => { for (const it of lv.items) for (const [l] of lem(rightText(it))) occ[i].set(l, (occ[i].get(l) || 0) + 1); });
const firstAt = new Map(); levels.forEach((lv, i) => { for (const l of occ[i].keys()) if (!firstAt.has(l)) firstAt.set(l, i); });
for (const id of process.argv.slice(2).map(Number)) {
  const i = levels.findIndex(l => l.id === id), lv = levels[i];
  const fresh = [...occ[i].keys()].filter(l => firstAt.get(l) === i);
  const ret = l => { let n = 0; for (let j = i + 1; j <= Math.min(levels.length - 1, i + 10); j++) n += occ[j].get(l) || 0; return n; };
  console.log(`\n=== L${id} ${lv.name} (${lv._town}, play #${i + 1}): ${fresh.length} new lemmas, ${fresh.filter(l => ret(l) >= 4).length} return 4+ times`);
  lv.items.forEach((it, ii) => {
    const f = [...new Set(lem(rightText(it)).filter(([l]) => firstAt.get(l) === i).map(([l]) => l))];
    if (!f.length) return;
    console.log(`#${ii} ${kindOf(it)}: ${rightText(it)}  ${it.en ? '(' + it.en + ')' : it.w && !it.parts ? '(' + it.w + ')' : ''}\n      new: ${f.map(l => `${l}[rank ${rank.get(l) || '>5000'}, back ${ret(l)}]`).join(' ')}`);
  });
}
