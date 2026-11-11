// PLAN.md 3b.1: what every fork asks, and whether its options differ in more than one way.
// usage: node qa/audit-forks.mjs            writes Opus 5.5 DT/reports/dt-audit-forks.{json,md}
// No browser. Loads content like qa/validate-content.mjs; task labels from qa/lib/tasks.mjs (a copy of taskOf in index.html).
import fs from 'node:fs'; import path from 'node:path';
import { loadContent, forksOf, kindOf, sentenceOf, contentWords } from './lib/load.mjs';
import { taskOf, taskLabel, isPureReorder } from './lib/tasks.mjs';
import { compare, intendedDim, acceptedDims, DIM_LABEL } from './lib/forks.mjs';
import { allowList } from './lib/nl.mjs';

const ROOT = process.cwd(), OUT = path.join(ROOT, 'Opus 5.5 DT', 'reports');
const { levels, towns } = loadContent(ROOT); const allow = allowList(ROOT);
for (const t of contentWords(levels)) if (!allow.has(t)) allow.set(t, 'used as right text in the content');
const nw = s => String(s).trim().split(/\s+/).filter(Boolean).length;
const gapped = (it, fi) => { let k = -1; return it.parts.map(p => typeof p === 'string' ? p : (++k === fi ? '___' : p.o[p.a])).join(' ').replace(/\s+([,.?!])/g, '$1'); };

const rows = [], perLevel = [], perTown = {};
let itemForks = 0;
for (const lv of levels) {
  const L = { id: lv.id, name: lv.name, town: lv._town, forks: 0, build: 0, read: 0, multi: 0, reorder: 0, mixed: 0, mixedMulti: 0, nonWordForks: 0, labelMismatch: 0, longSigns: 0, split: 0, narrow: 0, tasks: {} };
  for (const it of lv.items) {
    const kind = kindOf(it);
    if (!it.parts && !(it.read && it.o)) { itemForks++; L.forks++; const t = taskOf({ o: [it.nl], entry: Object.assign({}, it, { word: kind === 'word' }) }); L.tasks[t] = (L.tasks[t] || 0) + 1; continue; }
    forksOf(it).forEach((f, fi) => {
      L.forks++;
      const task = taskOf(f); L.tasks[task] = (L.tasks[task] || 0) + 1;
      if (f.read) { L.read++; return; }   // English options: a Meaning task, nothing to split
      L.build++;
      const ans = f.o[f.a], wrongs = f.o.filter((_, i) => i !== f.a);
      const multi = f.o.some(o => /\s/.test(o.trim())), reorder = isPureReorder(f.o);
      if (multi) L.multi++; if (reorder) L.reorder++;
      const per = wrongs.map(w => { const c = compare(ans, w, allow); return { o: w, dims: [...c.dims], notes: c.notes, nonWords: c.nonWords }; });
      const dims = [...new Set(per.flatMap(p => p.dims))];
      const words = f.o.map(nw), maxWords = Math.max(...words);
      if (maxWords > 3) L.longSigns++;
      const nonWord = per.some(p => p.nonWords.length);
      if (nonWord) L.nonWordForks++;
      const want = intendedDim(task, f.r);
      const mixed = dims.length > 1;
      const row = { level: lv.id, town: lv._town, file: it.__src, en: it.en, sentence: gapped(it, fi), answer: ans, options: f.o, rule: f.r, task, label: taskLabel(task), dims, per, words, maxWords, mixed, multi, reorder, intended: want };
      // label check: a single-dimension fork whose dimension is not what its label promises
      if (!mixed && dims.length === 1 && dims[0] !== 'spelling' && !acceptedDims(task, f.r).includes(dims[0])) { row.labelMismatch = `options differ in ${DIM_LABEL[dims[0]]}, label says ${taskLabel(task)}`; L.labelMismatch++; }
      if (mixed) {
        L.mixed++; if (multi) L.mixedMulti++;
        const keep = dims.includes(want) ? want : dims.includes('order') ? 'order' : dims[0];
        const off = per.filter(p => p.dims.some(d => d !== keep));
        const bothInOne = per.some(p => p.dims.length > 1);
        if (dims.includes('order') && dims.some(d => d !== 'order') && maxWords >= 3) {
          row.repair = 'split'; L.split++;
          row.suggest = `Split, as level 75 does: one fork for the ${dims.filter(d => d !== 'order').map(d => DIM_LABEL[d]).join(' and ')} with the word order fixed in the sentence, and a second fork for word order with the forms fixed.`;
        } else {
          row.repair = 'narrow'; L.narrow++;
          const keepN = f.o.length - off.length;
          row.suggest = `Narrow to ${DIM_LABEL[keep]}: ` + (keepN >= 2 && !bothInOne ? `drop ${off.map(p => JSON.stringify(p.o)).join(' and ')}` : `replace ${off.map(p => JSON.stringify(p.o)).join(' and ')} with a wrong option that differs from ${JSON.stringify(ans)} only in ${DIM_LABEL[keep]}`) + '.';
        }
        if (nonWord && !['kof', 'spel', 'meervoud', 'adj', 'verklein'].includes(f.r)) row.suggest += ' The non-word must go (PLAN 3c).';
      }
      rows.push(row);
    });
  }
  perLevel.push(L);
  const T = perTown[lv._town] ||= { town: lv._town, levels: 0, forks: 0, build: 0, multi: 0, mixed: 0, mixedMulti: 0, split: 0, narrow: 0, nonWordForks: 0, labelMismatch: 0, longSigns: 0 };
  T.levels++; for (const k of ['forks', 'build', 'multi', 'mixed', 'mixedMulti', 'split', 'narrow', 'nonWordForks', 'labelMismatch', 'longSigns']) T[k] += L[k];
}

const build = rows.length, multiNonReorder = rows.filter(r => r.multi && !r.reorder).length;
const mixed = rows.filter(r => r.mixed), byDims = {};
for (const r of mixed) { const k = r.dims.slice().sort().join(' + '); byDims[k] = (byDims[k] || 0) + 1; }
const mixedInOne = mixed.filter(r => r.per.some(p => p.dims.length > 1)).length;
const byTask = {}; for (const r of mixed) byTask[r.label] = (byTask[r.label] || 0) + 1;
const byRule = {}; for (const r of mixed) byRule[r.rule] = (byRule[r.rule] || 0) + 1;
const totals = { levels: levels.length, forksAll: rows.length + itemForks + perLevel.reduce((n, l) => n + l.read, 0), buildForks: build, readForks: perLevel.reduce((n, l) => n + l.read, 0), itemForks,
  multiWord: rows.filter(r => r.multi).length, pureReorder: rows.filter(r => r.reorder).length, multiNonReorder, mixed: mixed.length, mixedMultiWord: mixed.filter(r => r.multi).length, mixedSingleWord: mixed.filter(r => !r.multi).length,
  mixedWithinOneOption: mixedInOne, split: mixed.filter(r => r.repair === 'split').length, narrow: mixed.filter(r => r.repair === 'narrow').length,
  labelMismatch: rows.filter(r => r.labelMismatch).length, signsOver3Words: rows.filter(r => r.maxWords > 3).length, byDims, byTask, byRule };

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'dt-audit-forks.json'), JSON.stringify({ generated: new Date().toISOString(), totals, perTown: Object.values(perTown), perLevel, forks: rows }));

// markdown
const md = [];
md.push('# Fork audit (PLAN 3b.1)', '', `Generated by \`node qa/audit-forks.mjs\`. Full data: \`dt-audit-forks.json\` in this folder.`, '');
md.push('Every build fork is compared option by option with its right answer. A wrong option can differ in **word order**, **form** of the same word (werkt / werkte, groot / grote, ben / is, an extra te), **word choice** (deze / dit, met / aan, an extra or missing small word) or **spelling** (not a Dutch word, checked against the OpenTaal list). A fork is **mixed** when its wrong options together differ in more than one of these, so the player cannot tell what the fork asks.', '');
md.push('## Totals', '', '| Measure | Count |', '|---|---|');
for (const [k, v] of [['Playable levels', totals.levels], ['Forks of all kinds (word, look, listen, de/het, read, build)', totals.forksAll], ['Build forks (authored options)', build], ['Read forks with authored English options', totals.readForks],
  ['Build forks with a multi-word option', totals.multiWord], ['... of which pure reorderings', totals.pureReorder], ['... not a pure reordering (the PLAN\'s 625)', multiNonReorder],
  ['**Mixed forks (two or more dimensions)**', `**${mixed.length}**`], ['... with multi-word options', totals.mixedMultiWord], ['... single-word options', totals.mixedSingleWord], ['... where one wrong option alone differs in two ways', mixedInOne],
  ['Suggested repair: split', totals.split], ['Suggested repair: narrow', totals.narrow], ['Single-dimension forks whose label does not match (spelling excluded, see dt-audit-distractors)', totals.labelMismatch], ['Forks with an option longer than three words (PLAN 3b.3)', totals.signsOver3Words]]) md.push(`| ${k} | ${v} |`);
md.push('', '### Mixed forks by dimension pair', '', '| Dimensions | Forks |', '|---|---|', ...Object.entries(byDims).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`));
md.push('', '### Mixed forks by label the player sees', '', '| Label | Forks |', '|---|---|', ...Object.entries(byTask).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`));
md.push('', '### Mixed forks by rule id', '', Object.entries(byRule).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', '));
md.push('', '## Per town (play order)', '', '| Town | Levels | Build forks | Multi-word | Mixed | Split | Narrow | Non-word forks | Label mismatch | Option > 3 words |', '|---|---|---|---|---|---|---|---|---|---|');
for (const t of towns) { const T = perTown[t.id]; if (T) md.push(`| ${t.name} | ${T.levels} | ${T.build} | ${T.multi} | ${T.mixed} | ${T.split} | ${T.narrow} | ${T.nonWordForks} | ${T.labelMismatch} | ${T.longSigns} |`); }
md.push('', '## Per level (play order)', '', '| Level | Town | Name | Build forks | Mixed | Split | Narrow | Non-word | Label mismatch | Option > 3 words |', '|---|---|---|---|---|---|---|---|---|---|');
for (const L of perLevel) md.push(`| ${L.id} | ${L.town} | ${L.name} | ${L.build} | ${L.mixed} | ${L.split} | ${L.narrow} | ${L.nonWordForks} | ${L.labelMismatch} | ${L.longSigns} |`);
md.push('', '## Every mixed fork, with a suggested repair', '', 'Answer first in the options. Each wrong option is followed by how it differs.', '');
let cur = null;
for (const r of mixed) {
  if (r.level !== cur) { cur = r.level; md.push('', `### Level ${r.level} (${r.town}) \`${r.file}\``, ''); }
  md.push(`- **${r.sentence}** · ${r.label} · rule \`${r.rule}\` · [${r.answer} | ${r.per.map(p => `${p.o} *(${p.dims.join('+')})*`).join(' | ')}] → **${r.repair}**. ${r.suggest}`);
}
md.push('', '## Single-dimension forks whose label does not match', '', 'These need no rewrite, only a `task:` override or a different rule id.', '');
for (const r of rows.filter(r => r.labelMismatch)) md.push(`- L${r.level} ${r.sentence} [${r.options.join(' | ')}] rule \`${r.rule}\`: ${r.labelMismatch}`);
fs.writeFileSync(path.join(OUT, 'dt-audit-forks.md'), md.join('\n') + '\n');

console.log(`levels ${levels.length}, build forks ${build}, multi-word not reorder ${multiNonReorder}`);
console.log(`mixed forks ${mixed.length} (multi-word ${totals.mixedMultiWord}, single-word ${totals.mixedSingleWord}); split ${totals.split}, narrow ${totals.narrow}; one option two ways ${mixedInOne}`);
console.log(`label mismatches ${totals.labelMismatch}; options over three words ${totals.signsOver3Words}`);
console.log('by dimensions:', Object.entries(byDims).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', '));
console.log('per town:', towns.map(t => perTown[t.id] ? `${t.id} ${perTown[t.id].mixed}` : '').filter(Boolean).join(', '));
console.log('wrote Opus 5.5 DT/reports/dt-audit-forks.md and .json');
