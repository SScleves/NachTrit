// PLAN.md 3c.2: every option of every fork, and every `wrong` of a word item, token by token against a Dutch word list.
// A token that is not a Dutch word is legitimate only in a Spelling fork ('t kofschip, open and closed syllables /
// adjective -e, plural and diminutive spelling). Everything else must be replaced.
// usage: node qa/audit-distractors.mjs      writes Opus 5.5 DT/reports/dt-nonwords.{md,json}
// Word list: dictionary-nl (OpenTaal, BSD-3-Clause OR CC-BY-3.0) through nspell (MIT), devDependencies only.
// Names, places and dialect that the list lacks go in qa/allow-words.txt.
import fs from 'node:fs'; import path from 'node:path';
import { loadContent, forksOf, kindOf, sentenceOf, contentWords } from './lib/load.mjs';
import { taskOf, taskLabel } from './lib/tasks.mjs';
import { compare } from './lib/forks.mjs';
import { tokens, isWord, allowList, sameLemma, stem } from './lib/nl.mjs';

const ROOT = process.cwd(), OUT = path.join(ROOT, 'Opus 5.5 DT', 'reports');
const { levels, towns } = loadContent(ROOT); const allow = allowList(ROOT);
for (const t of contentWords(levels)) if (!allow.has(t)) allow.set(t, 'used as right text in the content');
const real = t => isWord(t, allow, false);
const SPELL_RULES = new Set(['kof', 'spel', 'adj', 'meervoud', 'verklein', 'samen']);

// what kind of mistake a non-word is, judged against the right token it replaces
const swapDT = x => [x.replace(/dt$/, 'd'), x.replace(/dt$/, 't'), x.replace(/tt$/, 't'), x.replace(/dd$/, 'd'), x.replace(/d$/, 't'), x.replace(/t$/, 'd'), x.replace(/de(n?)$/, 'te$1'), x.replace(/te(n?)$/, 'de$1'), x.replace(/d$/, 'dt'), x.replace(/t$/, 'dt'), x.replace(/([^t])t$/, '$1d'), x.replace(/([^d])d$/, '$1dt')].filter(y => y !== x);
const undouble = x => x.replace(/([a-zà-ÿ])\1/g, '$1');
function classify(x, ans, rule) {
  const lx = x.toLowerCase(), la = (ans || '').toLowerCase();
  const verbRule = ['imp', 'perf', 'plusq', 'kof', 'passief', 'aux', 'sep', 'sepbz'].includes(rule);
  if (/^(nul|een|twee|drie|vier|vijf|zes|zeven|acht|negen|tien|elf|twaalf|der|veer|tig|twin|honderd|duizend|en|ën|tach)+$/.test(lx) || /tig$|tien$/.test(lx) && rule === 'getal') return { cat: 'invented numeral', legit: false };
  const strong = /^(ge)?(ging|kwam|zag|was|had|kon|wou|mocht|moest|zou|deed|liep|at|kocht|bracht|dacht|zocht|vroeg|zei|wist|liet|sliep|begon|reed|viel|hield|hielp|bleef|nam|gaf|kreeg|vond|sprak|las|schreef)/.test(la);
  if (!strong && /[dt]$|[dt]en?$/.test(lx) && (swapDT(lx).some(y => y === la || (real(y) && sameLemma(y, la))) || /[dt]$/.test(la) && lx.replace(/[dt]$/, '') === la || /[dt]{2}$/.test(la) && la.replace(/[dt]$/, '') === lx)) return { cat: "d or t ('t kofschip, wordt, snijdt)", legit: true };
  if (undouble(lx) === undouble(la)) return { cat: 'open and closed syllables (vowel or consonant doubling)', legit: true };
  if (/^ge/.test(lx) && (!/^ge/.test(la) || /^gege|^geop|^geuit|^geaf|^geaan|^geweg|^geterug|^gein|^geïn|^geover|^gelangs|^gedicht|^geklaar|^getoe|^geher|^gever|^gebe|^geont/.test(lx))) return { cat: 'participle: ge- where it does not go', legit: false };
  const PRT = '(op|uit|af|aan|in|mee|weg|terug|over|langs|dicht|toe|klaar|thuis)';
  if (new RegExp('^' + PRT + 'ge').test(lx) || new RegExp('^' + PRT + 'ge').test(la) && new RegExp('^' + PRT).test(lx)) return { cat: 'separable participle formed wrongly', legit: false };
  if (verbRule && /(te|de|ten|den|d|t)$/.test(lx) && !/(te|de|ten|den)$/.test(la)) return { cat: 'irregular verb made regular (koopte, gegaand)', legit: false };
  if (/^ge.*(en|t|d)$/.test(lx)) return { cat: 'participle formed wrongly', legit: false };
  if (['vergelijk', 'vgl'].includes(rule) || ['goed', 'graag', 'lief', 'veel'].some(w => lx.startsWith(w)) && /(er|der|ste|st)$/.test(lx)) return { cat: 'comparative formed wrongly (graager, gooder, duurer)', legit: false };
  if (rule === 'verklein' || /(tje|pje|je|jes|tjes|ties|tjen|jen)$/.test(lx)) return { cat: 'diminutive spelling', legit: true };
  if (!verbRule && (rule === 'meervoud' || /('s|s|en)$/.test(lx) && ['woord', 'spel', 'samen', 'meervoud', 'dehet', 'adj', 'getal', 'datum'].includes(rule))) return { cat: 'plural spelling', legit: true };
  if (rule === 'adj' && (lx.endsWith('e') || la.endsWith('e'))) return { cat: 'adjective -e', legit: true };
  if (rule === 'samen') return { cat: 'compound linking letters (tussen-s, tussen-n)', legit: true };
  if (isWord(lx, allow, true)) return { cat: 'compound the list lacks (probably real, check by hand)', legit: null };
  if (rule === 'kof') return { cat: "d or t ('t kofschip, wordt, snijdt)", legit: true };
  if (rule === 'spel') return { cat: 'open and closed syllables (vowel or consonant doubling)', legit: true };
  return { cat: 'other non-word', legit: false };
}

const occ = [], rightUnknown = new Map();
const noteRight = (s, lv) => { for (const t of tokens(s)) if (!isWord(t, allow, true)) { const k = t.toLowerCase(); if (!rightUnknown.has(k)) rightUnknown.set(k, new Set()); rightUnknown.get(k).add(lv.id); } };
let optionTokens = 0, forksChecked = 0, wrongChecked = 0;
for (const lv of levels) for (const it of lv.items) {
  const kind = kindOf(it);
  if (it.parts) {
    it.parts.forEach(p => { if (typeof p === 'string') noteRight(p, lv); else noteRight(p.o[p.a], lv); });
    const forks = forksOf(it);
    forks.forEach((f, fi) => {
      forksChecked++;
      const ans = f.o[f.a];
      f.o.forEach((o, oi) => {
        optionTokens += tokens(o).length;
        if (oi === f.a) return;
        const c = compare(ans, o, allow);
        for (const x of c.nonWords) {
          const pair = c.notes.map(n => n.match(/^(\S+) -> (\S+) \(not a word\)$/)).find(m => m && m[2] === x.toLowerCase());
          const ansTok = pair ? pair[1] : (tokens(ans).find(a => sameLemma(a, x)) || tokens(ans)[0]);
          const k = classify(x, ansTok, f.r);
          let k2 = 0; const gap = it.parts.map(p => typeof p === 'string' ? p : (k2++ === fi ? `[${p.o.join(' | ')}]` : p.o[p.a])).join(' ').replace(/\s+([,.?!])/g, '$1');
          occ.push({ level: lv.id, town: lv._town, file: it.__src, kind, token: x, replaces: ansTok, rule: f.r, label: taskLabel(taskOf(f)), sentence: gap, en: it.en, options: f.o, answer: ans, category: k.cat, legit: k.legit, spellingRule: SPELL_RULES.has(f.r), verdict: k.legit === true ? (SPELL_RULES.has(f.r) ? 'keep in a Spelling fork' : 'keep only if the fork becomes a Spelling fork') : k.legit === null ? 'check by hand' : 'replace with a real Dutch form' });
        }
      });
    });
  } else {
    noteRight(kind === 'dehet' ? it.nl : it.nl || '', lv);
    if (it.wrong) { wrongChecked++; optionTokens += tokens(it.wrong).length; for (const x of tokens(it.wrong).filter(t => !real(t))) { const ansTok = tokens(it.nl).find(a => sameLemma(a, x)) || tokens(it.nl).slice(-1)[0]; const k = classify(x, ansTok, 'woord'); occ.push({ level: lv.id, town: lv._town, file: it.__src, kind, token: x, replaces: ansTok, rule: 'woord', label: 'Which word', sentence: `${it.w || it.en}: [${it.nl} | ${it.wrong}]`, en: it.w || it.en, options: [it.nl, it.wrong], answer: it.nl, category: k.cat, legit: k.legit, spellingRule: false, verdict: k.legit === true ? 'keep only if the item becomes a Spelling fork' : k.legit === null ? 'check by hand' : 'replace with a real Dutch form' }); } }
  }
}

const cats = {}; for (const o of occ) { const c = cats[o.category] ||= { n: 0, legit: o.legit, tokens: new Set(), rules: {} }; c.n++; c.tokens.add(o.token); c.rules[o.rule] = (c.rules[o.rule] || 0) + 1; }
const replace = occ.filter(o => o.legit === false), keep = occ.filter(o => o.legit === true), check = occ.filter(o => o.legit === null);
const perTown = {}; for (const o of occ) { const t = perTown[o.town] ||= { replace: 0, keep: 0, keepNeedsLabel: 0, check: 0 }; if (o.legit === false) t.replace++; else if (o.legit === null) t.check++; else { t.keep++; if (!o.spellingRule) t.keepNeedsLabel++; } }
const perLevel = {}; for (const o of occ) { const l = perLevel[o.level] ||= { town: o.town, replace: 0, keep: 0, check: 0 }; l[o.legit === false ? 'replace' : o.legit === null ? 'check' : 'keep']++; }
const forksWithReplace = new Set(replace.map(o => o.level + '|' + o.sentence)).size;
const totals = { forksChecked, wordItemsWithWrong: wrongChecked, optionTokens, nonWordOccurrences: occ.length, uniqueNonWords: new Set(occ.map(o => o.token.toLowerCase())).size, replace: replace.length, forksWithReplace, legitSpelling: keep.length, legitInSpellingRule: keep.filter(o => o.spellingRule).length, checkByHand: check.length, rightTextUnknown: rightUnknown.size };

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'dt-nonwords.json'), JSON.stringify({ generated: new Date().toISOString(), totals, categories: Object.fromEntries(Object.entries(cats).map(([k, v]) => [k, { n: v.n, legit: v.legit, tokens: [...v.tokens], rules: v.rules }])), perTown, perLevel, rightTextUnknown: Object.fromEntries([...rightUnknown].map(([k, v]) => [k, [...v]])), occurrences: occ }));

const md = [];
md.push('# Non-words in wrong options (PLAN 3c.2)', '', 'Generated by `node qa/audit-distractors.mjs`. Full data: `dt-nonwords.json` in this folder. (The October distractor audit is `dt-audit-distractors.md`; this file does not replace it.)', '');
md.push('Every option of every build fork and every `wrong` of a word item is split into words and checked against the OpenTaal list (`dictionary-nl`, read with `nspell`) plus `qa/allow-words.txt`. Right answers and sentence text may also be compounds of listed words (kaas + boer); a wrong option must be in the list itself, because a split like gesp + eelt would let gespeelt pass.', '');
md.push('Policy (PLAN 3c): a form that does not exist may only appear in a **Spelling** fork: \'t kofschip, open and closed syllables (which covers the adjective -e and plural spelling), plural and diminutive spelling. Everything else is replaced by a real Dutch form that is wrong in the sentence.', '');
md.push('## Totals', '', '| Measure | Count |', '|---|---|');
for (const [k, v] of [['Build forks checked', forksChecked], ['Word items with a `wrong` option', wrongChecked], ['Option tokens checked', optionTokens], ['Non-word occurrences in wrong options', occ.length], ['Unique non-words', totals.uniqueNonWords],
  ['**Must be replaced (not a spelling rule)**', `**${replace.length}** in ${forksWithReplace} forks`], ['Legitimate Spelling contrasts', keep.length], ['... already under a spelling rule id (kof, spel, adj, meervoud, verklein)', totals.legitInSpellingRule], ['... under another rule id: keep only if the fork becomes a Spelling fork', keep.length - totals.legitInSpellingRule], ['Compounds the list lacks, check by hand', check.length], ['Words in right answers and sentences the list does not know (allow list candidates)', rightUnknown.size]]) md.push(`| ${k} | ${v} |`);
md.push('', '## By kind of mistake', '', '| Kind | Verdict | Occurrences | Rule ids | Examples |', '|---|---|---|---|---|');
for (const [k, v] of Object.entries(cats).sort((a, b) => b[1].n - a[1].n)) md.push(`| ${k} | ${v.legit === true ? 'Spelling fork' : v.legit === null ? 'check' : '**replace**'} | ${v.n} | ${Object.entries(v.rules).sort((a, b) => b[1] - a[1]).map(([r, n]) => `${r} ${n}`).join(', ')} | ${[...v.tokens].slice(0, 10).join(', ')} |`);
md.push('', '## Per town (play order)', '', '| Town | Replace | Spelling (legit) | ... of which need the Spelling label | Check |', '|---|---|---|---|---|');
for (const t of towns) { const T = perTown[t.id]; if (T) md.push(`| ${t.name} | ${T.replace} | ${T.keep} | ${T.keepNeedsLabel} | ${T.check} |`); }
md.push('', '## Must be replaced, per level', '', 'Token, the right form it stands for, rule id and label, then the fork.', '');
let cur = null;
for (const o of replace) { if (o.level !== cur) { cur = o.level; md.push('', `### Level ${o.level} (${o.town}) \`${o.file}\``, ''); } md.push(`- **${o.token}** for ${o.replaces} · ${o.category} · \`${o.rule}\` ${o.label} · ${o.sentence}`); }
md.push('', '## Legitimate Spelling contrasts', '', 'These may stay, in a fork labelled Spelling whose wrong options differ from the answer only in spelling.', '');
cur = null;
for (const o of keep) { if (o.level !== cur) { cur = o.level; md.push('', `### Level ${o.level} (${o.town})`, ''); } md.push(`- **${o.token}** for ${o.replaces} · ${o.category} · \`${o.rule}\`${o.spellingRule ? '' : ' (needs the Spelling label)'} · ${o.sentence}`); }
if (check.length) { md.push('', '## Check by hand', ''); for (const o of check) md.push(`- L${o.level} **${o.token}** · ${o.sentence}`); }
md.push('', '## Words in right answers the list does not know', '', 'Everything here is either in `qa/allow-words.txt` already or should be looked at. Level ids in brackets.', '');
md.push([...rightUnknown].map(([k, v]) => `${k} (${[...v].slice(0, 4).join(', ')})`).join(', ') || 'none');
fs.writeFileSync(path.join(OUT, 'dt-nonwords.md'), md.join('\n') + '\n');

console.log(`forks ${forksChecked}, word items with wrong ${wrongChecked}, option tokens ${optionTokens}`);
console.log(`non-word occurrences ${occ.length} (${totals.uniqueNonWords} unique): replace ${replace.length} in ${forksWithReplace} forks, legit spelling ${keep.length} (${totals.legitInSpellingRule} under a spelling rule), check ${check.length}`);
console.log('kinds:', Object.entries(cats).sort((a, b) => b[1].n - a[1].n).map(([k, v]) => `${k} ${v.n}`).join('; '));
console.log(`right-text words unknown to the list: ${rightUnknown.size}${rightUnknown.size ? ' (' + [...rightUnknown.keys()].join(' ') + ')' : ''}`);
console.log('wrote Opus 5.5 DT/reports/dt-nonwords.md and .json');
