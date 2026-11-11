// PLAN.md 3f: vocabulary per level, how new words come back, coverage of the most frequent Dutch words,
// and the order in which grammar rules first appear, against a standard Dutch-as-a-second-language order.
// usage: node qa/audit-vocab.mjs     writes Opus 5.5 DT/reports/dt-vocab.md and dt-vocab.json
// Lemmas are rough: an irregular verb table plus a light stemmer (qa/lib/nl.mjs). Good enough to count, not to teach.
// Frequency list: qa/data/nl-freq-top5000.txt, the top 5000 forms of hermitdave/FrequencyWords nl 2018
// (OpenSubtitles 2018, CC BY-SA 4.0). Subtitles are spoken Dutch, close to what the game teaches.
import fs from 'node:fs'; import path from 'node:path';
import { loadContent, forksOf, kindOf } from './lib/load.mjs';
import { tokens, stem, allowList } from './lib/nl.mjs';

const ROOT = process.cwd(), OUT = path.join(ROOT, 'Opus 5.5 DT', 'reports');
const { levels, towns, RULES } = loadContent(ROOT); const allow = allowList(ROOT);
const NAMES = new Set([...allow].filter(([, g]) => /^names|^places/.test(g)).map(([w]) => w));
const TARGET = { newPerLevel: 10, returns: 4, window: 10, band: { A1: 500, 'A1-A2': 750, A2: 1000, 'A2-B1': 1500, B1: 2000, 'B1-B2': 2500, B2: 3000 } };

// the right Dutch a player reads or hears in a level
function rightText(it) {
  if (it.parts) return it.parts.map(p => typeof p === 'string' ? p : p.o[p.a]).join(' ');
  if (it.dehet) return `${it.art} ${it.nl}`;
  return it.nl || '';
}
const lemmasOf = s => tokens(s).filter(t => !NAMES.has(t.toLowerCase()) && !/^\d/.test(t)).map(t => stem(t));

// ---- per level ----
const seenAt = new Map();      // lemma -> index of first level
const occ = levels.map(() => new Map());   // per level: lemma -> occurrences
const example = new Map();     // lemma -> a surface form
levels.forEach((lv, i) => {
  for (const it of lv.items) for (const t of tokens(rightText(it))) {
    if (NAMES.has(t.toLowerCase()) || /^\d/.test(t)) continue;
    const l = stem(t); occ[i].set(l, (occ[i].get(l) || 0) + 1);
    if (!example.has(l)) example.set(l, t.toLowerCase());
  }
});
const rows = []; let cum = 0;
levels.forEach((lv, i) => {
  const lem = [...occ[i].keys()], fresh = lem.filter(l => !seenAt.has(l));
  fresh.forEach(l => seenAt.set(l, i)); cum += fresh.length;
  // how often each new word returns in the next ten levels (occurrences, not levels)
  const ret = fresh.map(l => { let n = 0; for (let j = i + 1; j <= Math.min(levels.length - 1, i + TARGET.window); j++) n += occ[j].get(l) || 0; return [l, n]; });
  const weak = ret.filter(([, n]) => n < TARGET.returns);
  const lastWindow = i + TARGET.window >= levels.length;
  rows.push({ id: lv.id, name: lv.name, town: lv._town, tier: lv._tier, cefr: lv.cefr, lemmas: lem.length, fresh: fresh.length, cumulative: cum,
    band: TARGET.band[lv.cefr] || null, returnedEnough: fresh.length - weak.length, returnedPct: fresh.length ? Math.round(100 * (fresh.length - weak.length) / fresh.length) : 100,
    neverAgain: ret.filter(([, n]) => n === 0).length, lastWindow, newWords: fresh.map(l => example.get(l)), weakWords: weak.map(([l, n]) => `${example.get(l)} ${n}`) });
});

// ---- frequency coverage ----
const freq = fs.readFileSync(path.join(ROOT, 'qa', 'data', 'nl-freq-top5000.txt'), 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split(' ')[0]).filter(w => w.length > 1 && !w.includes("'") && !['mr', 'oh', 'hé', 'o', 'ok', 'oké', 'god'].includes(w));
const gameStems = new Set(seenAt.keys());
const topStems = []; const seenStem = new Set();
for (const w of freq) { const s = stem(w); if (!seenStem.has(s)) { seenStem.add(s); topStems.push([s, w]); } }
const cover = n => { const top = topStems.slice(0, n); const hit = top.filter(([s]) => gameStems.has(s)); return { n, covered: hit.length, pct: Math.round(100 * hit.length / n), missing: top.filter(([s]) => !gameStems.has(s)).map(([, w]) => w) }; };
const cov = [cover(500), cover(1000), cover(2000), cover(3000)];
// words the game teaches that are rare: outside the top 5000 forms
const rare = [...gameStems].filter(s => !seenStem.has(s)).length;

// ---- grammar sequence ----
// a standard order for Dutch as a second language (Nederlands in gang, Code Nederlands, the A1-B1 NT2 syllabi),
// as ranks: lower comes first. Rules with the same rank may come in any order.
const RANK = { groet: 1, woord: 1, getal: 1, zijn: 1, hebben: 1, dehet: 1, pres: 2, presens: 2, bezit: 2, vraag: 3, neg: 3, meervoud: 3, spel: 3, klok: 3, datum: 3, cult: 3,
  v2: 4, tmp: 4, adj: 4, obj: 4, objpron: 4, er: 4, eris: 4, verklein: 4, weg: 4, imper: 5, gebod: 5, modal: 5, soft: 5, formeel: 5, mag: 6, sep: 6, fut: 6, vergelijk: 6, vgl: 6, refl: 6, samen: 6,
  perf: 7, aux: 7, kof: 7, aanhet: 7, al: 7, imp: 8, omte: 8, mening: 9, bijzin: 9, diedat: 9, zou: 9, zullen: 9, idioom: 9, pronadv: 10, erop: 10, vnwadv: 10, sepbz: 10, indirect: 10, hoewel: 10,
  cond: 10, conditie: 10, alsdan: 10, voorwaarde: 10, plusq: 11, passief: 11 };
// what each rule needs first (any one of each inner list)
const NEEDS = {
  v2: [['pres', 'presens', 'zijn', 'hebben']], vraag: [['pres', 'presens', 'zijn', 'hebben']], neg: [['pres', 'presens', 'zijn', 'hebben']], modal: [['pres', 'presens']], sep: [['pres', 'presens'], ['v2']],
  perf: [['pres', 'presens', 'hebben'], ['v2']], aux: [['perf']], kof: [['perf', 'imp']], imp: [['pres', 'presens']], plusq: [['perf'], ['imp']], passief: [['perf']],
  bijzin: [['v2']], sepbz: [['sep'], ['bijzin']], diedat: [['bijzin'], ['dehet']], indirect: [['bijzin'], ['vraag']], hoewel: [['bijzin']], mening: [['bijzin']],
  cond: [['bijzin']], conditie: [['bijzin']], alsdan: [['bijzin']], voorwaarde: [['bijzin']], zou: [['modal'], ['imp']], zullen: [['modal']], fut: [['modal', 'pres', 'presens']],
  omte: [['modal']], aanhet: [['pres', 'presens']], refl: [['pres', 'presens'], ['obj', 'objpron']], adj: [['dehet']], vergelijk: [['adj']], vgl: [['adj']], verklein: [['dehet']],
  mag: [['modal'], ['neg']], pronadv: [['obj', 'objpron', 'er', 'eris']], erop: [['er', 'eris']], vnwadv: [['er', 'eris']], tmp: [['v2']], gebod: [['pres', 'presens']], imper: [['pres', 'presens']],
};
const first = {}, firstCount = {};
levels.forEach((lv, i) => { for (const it of lv.items) for (const f of forksOf(it)) { if (!(f.r in first)) first[f.r] = i; if (first[f.r] === i) firstCount[f.r] = (firstCount[f.r] || 0) + 1; } });
const at = i => i == null ? 'never' : `L${levels[i].id} (#${i + 1}, ${levels[i]._town})`;
const seq = Object.entries(first).sort((a, b) => a[1] - b[1]).map(([r, i]) => ({ rule: r, name: (RULES[r] || {}).name || r, first: levels[i].id, index: i + 1, town: levels[i]._town, rank: RANK[r] ?? null, forksThere: firstCount[r] }));
const problems = [];
for (const [r, groups] of Object.entries(NEEDS)) {
  if (!(r in first)) continue;
  for (const g of groups) {
    const fi = Math.min(...g.map(x => first[x] ?? Infinity));
    if (fi > first[r]) problems.push({ rule: r, at: at(first[r]), needs: g.join(' or '), needsAt: fi === Infinity ? 'never tested' : at(fi), gap: fi === Infinity ? null : fi - first[r] });
  }
}
// rank inversions on the core path the plan names
const CORE = [['pres/presens', ['pres', 'presens']], ['v2', ['v2']], ['questions (vraag)', ['vraag']], ['modal', ['modal']], ['sep', ['sep']], ['perf', ['perf']], ['imp', ['imp']], ['bijzin', ['bijzin']]];
const coreFirst = CORE.map(([n, ids]) => [n, Math.min(...ids.map(x => first[x] ?? Infinity))]);
const coreInv = []; for (let a = 0; a < coreFirst.length; a++) for (let b = a + 1; b < coreFirst.length; b++) if (coreFirst[b][1] < coreFirst[a][1]) coreInv.push(`${coreFirst[b][0]} (${at(coreFirst[b][1] === Infinity ? null : coreFirst[b][1])}) before ${coreFirst[a][0]} (${at(coreFirst[a][1] === Infinity ? null : coreFirst[a][1])})`);
// structures used in right sentences before the rule is first tested
const SIGNS = { bijzin: /\b(omdat|terwijl|hoewel|voordat|nadat|zodat|totdat|zodra)\b/i, imp: /\b(was|waren|had|hadden|ging|gingen|kwam|kwamen|zag|zagen|deed|deden|kon|konden|wilde|moest|mocht)\b/i, modal: /\b(kan|kun|kunt|wil|wilt|mag|moet|moeten|kunnen|willen|mogen)\b/i };
const usedEarly = {};
for (const [r, re] of Object.entries(SIGNS)) { const fi = first[r] ?? Infinity; let n = 0, lv = new Set(), ex = []; levels.forEach((L, i) => { if (i >= fi) return; for (const it of L.items) { const s = rightText(it); if (re.test(s)) { n++; lv.add(L.id); if (ex.length < 4) ex.push(`L${L.id}: ${s.replace(/\s+([,.?!])/g, '$1')}`); } } }); usedEarly[r] = { firstTested: at(fi === Infinity ? null : fi), sentences: n, levels: [...lv], examples: ex }; }

// ---- verdicts ----
const overNew = rows.filter(r => r.fresh > TARGET.newPerLevel);
const worstNew = rows.slice().sort((a, b) => b.fresh - a.fresh).slice(0, 15);
const worstReturn = rows.filter(r => !r.lastWindow && r.fresh >= 5).sort((a, b) => a.returnedPct - b.returnedPct).slice(0, 15);
const allFresh = rows.reduce((n, r) => n + r.fresh, 0), allOk = rows.reduce((n, r) => n + r.returnedEnough, 0), never = rows.filter(r => !r.lastWindow).reduce((n, r) => n + r.neverAgain, 0);
const bandRows = []; { let prev = null; for (const r of rows) if (r.cefr !== prev || r === rows[rows.length - 1]) { bandRows.push(r); prev = r.cefr; } }
const totals = { levels: levels.length, lemmas: gameStems.size, rareLemmas: rare, newPerLevelMedian: rows.map(r => r.fresh).sort((a, b) => a - b)[Math.floor(rows.length / 2)], levelsOverTen: overNew.length, newWordsReturnedEnoughPct: Math.round(100 * allOk / allFresh), newWordsNeverAgain: never, coverage: cov.map(c => ({ n: c.n, covered: c.covered, pct: c.pct })), sequenceProblems: problems.length, coreInversions: coreInv.length };
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'dt-vocab.json'), JSON.stringify({ generated: new Date().toISOString(), source: { frequencyList: 'hermitdave/FrequencyWords content/2018/nl/nl_50k.txt (OpenSubtitles 2018), CC BY-SA 4.0, top 5000 forms in qa/data/nl-freq-top5000.txt' }, targets: TARGET, totals, levels: rows, coverage: cov, sequence: seq, problems, coreInversions: coreInv, usedEarly }));

// ---- markdown ----
const md = [];
md.push('# Vocabulary and grammar sequence (PLAN 3f)', '', 'Generated by `node qa/audit-vocab.mjs`. Full data: `dt-vocab.json` in this folder.', '');
md.push('**How it was measured.** All right Dutch in a level\'s items (sentences with the right options filled in, word, look, listen, read and de/het items) is split into words. Names and places from `qa/allow-words.txt` are left out. Each word is reduced to a rough lemma: an irregular verb table (ben, is, was, geweest all count as zijn) and a light stemmer (honden, hondje count as hond). The stemmer is rough: it sometimes joins two words or splits one, so treat single counts as approximate and the patterns as real.', '');
md.push('**Frequency list.** `qa/data/nl-freq-top5000.txt`: the top 5,000 word forms of [hermitdave/FrequencyWords](https://github.com/hermitdave/FrequencyWords) `content/2018/nl/nl_50k.txt`, counted from Dutch subtitles (OpenSubtitles 2018). Licence of the list: CC BY-SA 4.0. SUBTLEX-NL would be the academic choice, but its licence is not stated as open; this list is built the same way (subtitles) and is openly licensed. It is used here only to measure, never shipped.', '');
md.push('## Headline', '', '| Measure | Value | Target |', '|---|---|---|',
  `| Distinct lemmas taught across ${levels.length} levels | ${gameStems.size} | B1 about 2,000 by the end |`,
  `| New lemmas per level, median | ${totals.newPerLevelMedian} | at most ${TARGET.newPerLevel} |`,
  `| Levels with more than ${TARGET.newPerLevel} new lemmas | ${overNew.length} of ${levels.length} | 0 |`,
  `| New lemmas met at least ${TARGET.returns} more times in the next ${TARGET.window} levels | ${totals.newWordsReturnedEnoughPct}% | 100% |`,
  `| New lemmas never seen again in the next ${TARGET.window} levels | ${never} | 0 |`,
  ...cov.map(c => `| Top ${c.n} frequent words covered | ${c.covered} (${c.pct}%) | as many as the tier allows |`),
  `| Lemmas outside the top 5,000 | ${rare} | |`,
  `| Rules that appear before what they depend on | ${problems.length} | 0 |`, '');
md.push('## Vocabulary size against the CEFR band of each tier', '', '| Level where the band starts or ends | Town | CEFR | Cumulative lemmas | Rough band |', '|---|---|---|---|---|');
for (const r of bandRows) md.push(`| ${r.id} | ${r.town} | ${r.cefr} | ${r.cumulative} | ${r.band ?? '-'} |`);
md.push('', '## Worst levels: too many new words', '', '| Level | Town | Name | New lemmas | Of which met 4+ times in the next 10 levels | A few of them |', '|---|---|---|---|---|---|');
for (const r of worstNew) md.push(`| ${r.id} | ${r.town} | ${r.name} | ${r.fresh} | ${r.returnedEnough} (${r.returnedPct}%) | ${r.newWords.slice(0, 8).join(', ')} |`);
md.push('', '## Worst levels: new words that do not come back', '', 'Levels with at least five new lemmas, outside the last ten levels (which have no ten levels after them).', '', '| Level | Town | New lemmas | Met 4+ times again | Never again | Words that do not return enough (count in next 10 levels) |', '|---|---|---|---|---|---|');
for (const r of worstReturn) md.push(`| ${r.id} | ${r.town} | ${r.fresh} | ${r.returnedPct}% | ${r.neverAgain} | ${r.weakWords.slice(0, 10).join(', ')} |`);
md.push('', '## Frequent words the game never teaches', '', `From the top 1,000 (${cov[1].missing.length} missing). Many are function words or swear words from subtitles; the useful gaps are the everyday verbs, nouns and adverbs.`, '', cov[1].missing.slice(0, 150).join(', '), '');
md.push('## Grammar sequence', '', 'First appearance of each rule id in a fork, in play order. Rank is its place in a standard NT2 order (1 = first week, 11 = B1). Ranks are approximate; what matters is the dependency check below.', '', '| Rule | Name | First level | Play position | Town | Rank | Forks there |', '|---|---|---|---|---|---|---|');
for (const s of seq) md.push(`| ${s.rule} | ${s.name} | ${s.first} | ${s.index} | ${s.town} | ${s.rank ?? '-'} | ${s.forksThere} |`);
md.push('', '### Rules introduced before what they depend on', '');
if (!problems.length) md.push('None.'); else { md.push('| Rule | First tested | Needs | Which first appears | Levels early |', '|---|---|---|---|---|'); for (const p of problems) md.push(`| ${p.rule} | ${p.at} | ${p.needs} | ${p.needsAt} | ${p.gap ?? '-'} |`); }
md.push('', '### The core path the plan names', '', 'Present tense and V2, questions, modals, separable verbs, perfect, imperfect, sub-clause order last.', '');
md.push(coreFirst.map(([n, i]) => `${n}: ${at(i === Infinity ? null : i)}`).join(' · '), '');
md.push(coreInv.length ? 'Out of order: ' + coreInv.join('; ') + '.' : 'In order.', '');
const late = seq.filter(x => x.rank != null && x.rank <= 5 && x.index > 50);
md.push('', '### Basics that arrive late', '', 'Rules of rank 5 or lower whose first fork comes after play position 50 (halfway). The words may be used earlier; the rule is not tested.', '');
md.push(late.length ? late.map(x => `- **${x.rule}** (${x.name}), rank ${x.rank}: first tested at L${x.first}, position ${x.index}, ${x.town}`).join('\n') : 'None.');
const SYN = [['pres', 'presens'], ['vergelijk', 'vgl'], ['obj', 'objpron'], ['er', 'eris'], ['gebod', 'imper'], ['cond', 'conditie', 'alsdan', 'voorwaarde'], ['pronadv', 'vnwadv', 'erop']];
md.push('', '### Rule ids that name the same rule', '', 'These pairs split one rule over two or more ids, so a per-rule count (the weakest-rule line in 3d, the learner model in phase 4) sees two half-rules. Merge them before phase 4.', '');
for (const g of SYN) md.push(`- ${g.map(r => `\`${r}\` (${(RULES[r] || {}).name || '?'}, ${seq.find(x => x.rule === r) ? 'first L' + seq.find(x => x.rule === r).first : 'unused'})`).join(' = ')}`);
md.push('', '### Structures used in right sentences before their rule is tested', '', 'Not wrong in itself (a learner can read a sentence before being tested on its grammar), but a fork elsewhere in the sentence then rests on grammar the player has not met.', '');
for (const [r, u] of Object.entries(usedEarly)) md.push(`- **${r}** (first tested ${u.firstTested}): ${u.sentences} sentences in ${u.levels.length} earlier levels. ${u.examples.join(' · ')}`);
md.push('', '## Every level', '', '| Level | Town | CEFR | Lemmas | New | Cumulative | New met 4+ times | Never again |', '|---|---|---|---|---|---|---|---|');
for (const r of rows) md.push(`| ${r.id} | ${r.town} | ${r.cefr} | ${r.lemmas} | ${r.fresh} | ${r.cumulative} | ${r.lastWindow ? '(end)' : r.returnedPct + '%'} | ${r.lastWindow ? '-' : r.neverAgain} |`);
fs.writeFileSync(path.join(OUT, 'dt-vocab.md'), md.join('\n') + '\n');

console.log(`lemmas ${gameStems.size}; new per level median ${totals.newPerLevelMedian}; levels over ${TARGET.newPerLevel}: ${overNew.length}/${levels.length}`);
console.log(`new lemmas met ${TARGET.returns}+ times in next ${TARGET.window} levels: ${totals.newWordsReturnedEnoughPct}%; never again: ${never}`);
console.log('coverage:', cov.map(c => `top ${c.n} ${c.pct}%`).join(', '));
console.log(`sequence problems ${problems.length}: ${problems.map(p => `${p.rule}<${p.needs}`).join(', ')}`);
console.log(`core inversions: ${coreInv.length ? coreInv.join('; ') : 'none'}`);
console.log('wrote Opus 5.5 DT/reports/dt-vocab.md and .json');
