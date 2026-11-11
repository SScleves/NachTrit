// PLAN.md 3g: the packet for a native speaker. Generates two self-contained, printable pages:
//   review/native-review.html        the 13 open questions first, then every Dutch sentence in play order, by town
//   review/native-review-short.html  the 13 questions and 60 sentences sampled across the tiers, for one hour
// usage: node qa/make-review.mjs
// Marks can be ticked on paper or on screen; on screen they are kept in the browser and the page offers a file of marks
// (JSON, keyed by line id such as L77-3) to send back.
import fs from 'node:fs'; import path from 'node:path';
import { loadContent, kindOf } from './lib/load.mjs';

const ROOT = process.cwd(), DIR = path.join(ROOT, 'review');
const { levels, towns, ctx } = loadContent(ROOT);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tidy = s => s.replace(/\s+([,.?!])/g, '$1').replace(/\s+/g, ' ').trim();
const nWords = s => String(s).trim().split(/\s+/).filter(Boolean).length;

// one line to review: the Dutch with each choice shown, the English, the wrong options in grey
function lineOf(lv, it, n) {
  const kind = kindOf(it), id = `L${lv.id}-${n}`;
  if (it.parts) {
    const wrong = [];
    const html = tidy(it.parts.map(p => typeof p === 'string' ? esc(p) : (wrong.push(p.o.filter((_, i) => i !== p.a)), `<b class="gap">${esc(p.o[p.a])}</b>`)).join(' '));
    const plain = tidy(it.parts.map(p => typeof p === 'string' ? p : p.o[p.a]).join(' '));
    return { id, kind, plain, html, en: it.en, wrong: wrong.map(w => w.join(' / ')) };
  }
  if (kind === 'read') return { id, kind, plain: it.nl, html: esc(it.nl), en: it.o ? it.o[it.a || 0] : it.en, wrong: [] };
  if (kind === 'dehet') return { id, kind, plain: `${it.art} ${it.nl}`, html: `<b class="gap">${esc(it.art)}</b> ${esc(it.nl)}`, en: it.en, wrong: [it.art === 'de' ? 'het' : 'de'] };
  const en = it.w || it.en;
  return { id, kind, plain: it.nl, html: esc(it.nl), en: en, wrong: it.wrong ? [it.wrong] : [] };
}
const isSentence = l => l.kind === 'build' || l.kind === 'read' || nWords(l.plain) >= 3 || /[.?!]$/.test(l.plain);

// every line in play order, each Dutch text once (its first appearance)
const seen = new Set(), byTown = new Map();
for (const lv of levels) {
  const T = byTown.get(lv._town) || byTown.set(lv._town, { levels: [] }).get(lv._town);
  const L = { lv, sentences: [], words: [] };
  if (lv.introNl && !seen.has(lv.introNl)) { seen.add(lv.introNl); L.sentences.push({ id: `L${lv.id}-intro`, kind: 'intro', plain: lv.introNl, html: esc(lv.introNl), en: lv.intro, wrong: [] }); }
  lv.items.forEach((it, n) => { const l = lineOf(lv, it, n); const key = l.plain.toLowerCase(); if (seen.has(key)) return; seen.add(key); (isSentence(l) ? L.sentences : L.words).push(l); });
  T.levels.push(L);
}
const total = [...byTown.values()].reduce((a, T) => a + T.levels.reduce((b, L) => b + L.sentences.length, 0), 0);
const totalWords = [...byTown.values()].reduce((a, T) => a + T.levels.reduce((b, L) => b + L.words.length, 0), 0);

// ---- the 13 open points from reports/dt-audit-distractors.md, with the live text pulled from the content ----
const find = (ids, re) => { const out = []; for (const lv of levels.filter(l => ids.includes(l.id))) lv.items.forEach((it, n) => { const l = lineOf(lv, it, n); const text = l.plain + ' ' + l.wrong.join(' '); if (re.test(text)) out.push({ lv: lv.id, ...l }); }); if (re.test('intro')) {} for (const lv of levels.filter(l => ids.includes(l.id))) if (re.test(lv.introNl || '')) out.push({ lv: lv.id, id: `L${lv.id}-intro`, html: esc(lv.introNl), en: lv.intro, wrong: [] }); return out; };
const town = id => (ctx.TOWNS || []).find(t => t.id === id) || {};
const zeeland = town('zeeland'), amsterdam = town('amsterdam');
const FLAGS = [
  { t: 'The historic present', q: 'Both sentences talk about yesterday, and the English is past. The game marks the present tense (eten we, duurt) as wrong. In a story ("Zit ik gisteren in de trein...") the present is possible. As a plain statement, is the present wrong enough to be a wrong option?', lines: [...find([77], /Gisteravond/), ...find([79], /Gisteren duurde/)] },
  { t: 'kraam: de or het', q: 'The game teaches de kraam and de marktkraam, and marks het marktkraam as wrong. We believe the Woordenlijst allows both. Is het kraam normal Dutch for you? If both are fine, the de/het questions on kraam have to go.', lines: [...find([69], /kraam/), ...find([124], /kramen|kraampje/)] },
  { t: 'Groningen earthquake words', q: 'These are plain vocabulary in the Groningen levels, not jokes. This is a horror game set at night. Would someone from Groningen find a quake crack in the "Thuis" level too close? Keep, soften, or remove?', lines: [...find([99], /beving/), ...find([103], /aardbeving|scheur/)] },
  { t: 'The Zeeland town text', q: 'On the map, this joke comes right after the line about the 1,836 people who died in 1953. It can read as the drowned knocking on the barrier. Would a Zeeuw find this in bad taste?', lines: [{ id: 'town-zeeland', html: `${esc(zeeland.blurbNl || '')}<br>${esc(zeeland.jokeNl || '')}`, en: `${zeeland.blurb || ''} ${zeeland.joke || ''}`, wrong: [] }] },
  { t: 'bomma', q: 'The Maastricht levels use de bomma for grandma and call it Maastricht dialect. It may be mainly Flemish and Belgian Limburg. Do people in Maastricht say bomma? If not, should it be oma, or a Maastricht word?', lines: find([107, 113], /bomma/).slice(0, 3) },
  { t: 'wel even or even wel', q: 'The game marks "even wel" as wrong. Particle order is a matter of feel. Is "Ik pak even wel..." wrong, or only less usual?', lines: [...find([76], /wel even/), ...find([115], /wel even/)] },
  { t: 'Ik zal graag ... willen', q: 'zal is a wrong option here. "Ik zal graag een starttijd willen reserveren" is very odd, but is it impossible?', lines: find([80], /starttijd willen reserveren/) },
  { t: 'helpen met, aan, voor', q: 'met is right. "iemand aan iets helpen" exists (to get someone something). Is aan clearly wrong in this sentence?', lines: find([79], /kunnen helpen met/) },
  { t: 'met de fiets aan de hand', q: 'in de hand is a wrong option. Do some speakers say "met de fiets in de hand"? If yes, it cannot stay a wrong option.', lines: find([129], /aan de hand/) },
  { t: 'hem or haar for de taal', q: 'The sentence is about the language (de taal) as if it were a person. The game wants hem; zich is the wrong option. Is hem natural here, or would you say haar? Is zich clearly wrong?', lines: find([130], /niemand hem/) },
  { t: 'Big families on Urk', q: 'A gentle joke about big (orthodox) families on Urk. Fine, or unkind?', lines: find([83], /gezinnen/) },
  { t: 'The drunk German', q: 'A well-known tourist line about how Dutch sounds, used as the Amsterdam rumour. Fine?', lines: [...find([123], /dronken Duitser/), { id: 'town-amsterdam', html: esc(amsterdam.rumourNl || ''), en: amsterdam.rumour || '', wrong: [] }].slice(0, 2) },
  { t: "pizza's or pizzas", q: 'The two options differ only by an apostrophe. Is that a fair spelling question for a learner, or too fine to be worth a fork?', lines: find([9], /pizza/) },
];

const CSS = `
:root { --ink: #1d1d1b; --muted: #6b6860; --line: #d9d5cb; --gap: #8a4b00; --bg: #fffdf8; --flag: #fff4dc; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.45 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
main { max-width: 980px; margin: 0 auto; padding: 24px 16px 64px; }
h1 { font-size: 26px; margin: 0 0 4px; } h2 { font-size: 21px; margin: 36px 0 8px; border-bottom: 2px solid var(--ink); padding-bottom: 4px; }
h3 { font-size: 16px; margin: 22px 0 6px; color: var(--muted); font-weight: 600; }
.intro { background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 12px 16px; margin: 12px 0 20px; }
.intro p { margin: 6px 0; } .intro ol { margin: 6px 0 6px 20px; padding: 0; }
table { width: 100%; border-collapse: collapse; } tr { break-inside: avoid; page-break-inside: avoid; }
td { border-top: 1px solid var(--line); padding: 7px 6px; vertical-align: top; }
td.id { width: 64px; color: var(--muted); font-size: 11px; white-space: nowrap; }
td.text .nl { font-size: 16px; } td.text .en { color: var(--muted); font-size: 13px; margin-top: 2px; }
td.text .wr { color: var(--muted); font-size: 12px; margin-top: 2px; } .wr::before { content: "wrong options: "; font-style: italic; }
b.gap { color: var(--gap); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
td.ticks { width: 190px; white-space: nowrap; font-size: 12px; } td.ticks label { display: inline-flex; align-items: center; gap: 3px; margin-right: 6px; }
td.ticks input { width: 15px; height: 15px; margin: 0; }
td.notes { width: 210px; } .note { min-height: 30px; border-bottom: 1px dotted var(--muted); font-size: 13px; outline: none; }
.flag { background: var(--flag); border: 1px solid #ecd9a8; border-radius: 8px; padding: 10px 14px; margin: 14px 0; break-inside: avoid; page-break-inside: avoid; }
.flag .q { margin: 4px 0 8px; } .flag table td { border-color: #ecd9a8; }
.words { columns: 3 200px; column-gap: 18px; font-size: 13px; margin: 6px 0 4px; } .words div { break-inside: avoid; padding: 2px 0; border-bottom: 1px solid #eee; }
.words label { display: inline-flex; gap: 4px; align-items: baseline; } .words .en { color: var(--muted); }
.bar { position: sticky; top: 0; background: var(--bg); border-bottom: 1px solid var(--line); padding: 8px 16px; display: flex; gap: 10px; align-items: center; font-size: 13px; z-index: 2; }
.bar button { font: inherit; padding: 4px 10px; border: 1px solid var(--ink); background: #fff; border-radius: 6px; cursor: pointer; }
@media (max-width: 700px) { td.ticks, td.notes { display: block; width: auto; border-top: 0; padding-top: 0; } td.id { display: none; } tr { display: block; border-top: 1px solid var(--line); } }
@media print { .bar { display: none; } body { background: #fff; font-size: 12px; } main { padding: 0; max-width: none; } h2 { break-before: page; } h2.first { break-before: auto; } .flag { background: #fff; } }
`;
const JS = `
(function(){
  var KEY = 'nachtrit-review:' + document.body.dataset.sheet, marks = {};
  try { marks = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(marks)); } catch (e) {} var n = Object.keys(marks).length; var c = document.getElementById('count'); if (c) c.textContent = n + ' marked'; }
  document.querySelectorAll('input[type=checkbox]').forEach(function (b) {
    var id = b.dataset.id, v = b.value; if (marks[id] && marks[id].mark === v) { b.checked = true; b.setAttribute('checked', ''); }
    b.addEventListener('change', function () {
      document.querySelectorAll('input[data-id="' + id + '"]').forEach(function (o) { if (o !== b) { o.checked = false; o.removeAttribute('checked'); } });
      if (b.checked) { b.setAttribute('checked', ''); marks[id] = Object.assign(marks[id] || {}, { mark: v }); } else { b.removeAttribute('checked'); if (marks[id]) delete marks[id].mark; if (marks[id] && !marks[id].note) delete marks[id]; }
      save();
    });
  });
  document.querySelectorAll('.note').forEach(function (d) {
    var id = d.dataset.id; if (marks[id] && marks[id].note) d.textContent = marks[id].note;
    d.addEventListener('input', function () { var t = d.textContent.trim(); if (t) marks[id] = Object.assign(marks[id] || {}, { note: t }); else if (marks[id]) { delete marks[id].note; if (!marks[id].mark) delete marks[id]; } save(); });
  });
  var dl = document.getElementById('dl'); if (dl) dl.addEventListener('click', function () {
    var rows = {}; Object.keys(marks).forEach(function (id) { var el = document.querySelector('[data-line="' + id + '"] .nl'); rows[id] = Object.assign({ dutch: el ? el.textContent : '' }, marks[id]); });
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ sheet: document.body.dataset.sheet, saved: new Date().toISOString(), marks: rows }, null, 1)], { type: 'application/json' }));
    a.download = 'nachtrit-review-marks.json'; a.click();
  });
  save();
})();`;

const ticks = id => ['natural', 'odd but correct', 'wrong'].map(v => `<label><input type="checkbox" data-id="${id}" value="${v}">${v}</label>`).join('');
const row = l => `<tr data-line="${l.id}"><td class="id">${esc(l.id)}</td><td class="text"><div class="nl">${l.html}</div>${l.en ? `<div class="en">${esc(l.en)}</div>` : ''}${l.wrong && l.wrong.length ? `<div class="wr">${esc(l.wrong.join('; '))}</div>` : ''}</td><td class="ticks">${l.noTicks ? '' : ticks(l.id)}</td><td class="notes"><div class="note" contenteditable="true" data-id="${l.id}"></div></td></tr>`;
const flagHtml = () => FLAGS.map((f, i) => `<div class="flag"><strong>${i + 1}. ${esc(f.t)}</strong><div class="q">${esc(f.q)}</div><table>${f.lines.map(row).join('')}</table><table>${row({ id: `Q${i + 1}`, html: '<i>Your answer to the question</i>', en: '', wrong: [], noTicks: true })}</table></div>`).join('\n');

function page(sheet, title, introHtml, bodyHtml) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>${CSS}</style></head>
<body data-sheet="${sheet}"><div class="bar"><strong>${esc(title)}</strong><span id="count"></span><span style="flex:1"></span><button id="dl" type="button">Save my marks as a file</button><button type="button" onclick="window.print()">Print</button></div>
<main>${introHtml}${bodyHtml}</main><script>${JS}</script></body></html>
`;
}
const howTo = (n, extra) => `<div class="intro">
<p><strong>What this is.</strong> Nachtrit is a game that teaches Dutch to English speakers. A player cycles through a Dutch town at night and picks the right word at forks in the road. All the Dutch below was written without a native speaker. ${extra}</p>
<p><strong>What we ask.</strong></p>
<ol>
<li>Read each Dutch line. The <b class="gap">underlined</b> words are what the player has to choose. The English below it is what the player sees as the meaning.</li>
<li>Tick one box: <b>natural</b> (a Dutch speaker would say or write this), <b>odd but correct</b> (grammatical, but nobody says it like that), or <b>wrong</b>.</li>
<li>Under some lines you see the <i>wrong options</i> the player can pick. If one of them is also correct Dutch in that sentence, please write it in the notes. That is the most useful thing you can tell us.</li>
<li>Use the notes for a better way to say it. A few words are enough.</li>
</ol>
<p>Netherlands Dutch is the target. Where a level uses dialect (Urk, Groningen, Maastricht) it says so. You can tick on paper, or on screen and press <i>Save my marks as a file</i> and send us that file. ${n}</p>
</div>`;

// ---- the full packet ----
const full = [];
full.push(`<h1>Nachtrit: native speaker review</h1><p>Every Dutch line in the game, in the order a player meets it. ${total} lines to tick, then ${totalWords} single words and short phrases in a compact list per level. Generated ${new Date().toISOString().slice(0, 10)} by <code>node qa/make-review.mjs</code>.</p>`);
const fullIntro = howTo('Start with the 13 questions: they are the points we are least sure about. Then go as far as you can; the early towns matter most, because every player sees them.', '');
full.push(`<h2 class="first">Part 1. Thirteen open questions</h2>`, flagHtml());
full.push(`<h2>Part 2. Every line, town by town</h2><p>Words and short phrases are listed after each level's sentences. For those, tick <b>wrong</b> only if the word, its article (de or het) or its English is wrong.</p>`);
for (const t of towns) {
  const T = byTown.get(t.id); if (!T) continue;
  const td = town(t.id);
  full.push(`<h2>${esc(t.name)} <small style="font-weight:400;color:var(--muted)">tier ${t.tier}, ${esc(t.cefr || '')}</small></h2>`);
  const townLines = [['blurb', td.blurbNl, td.blurb], ['joke', td.jokeNl, td.joke], ['rumour', td.rumourNl, td.rumour]].filter(x => x[1]).map(([k, nl, en]) => ({ id: `town-${t.id}-${k}`, html: esc(nl), en, wrong: [] }));
  if (townLines.length) full.push(`<h3>Map text for ${esc(t.name)}</h3><table>${townLines.map(row).join('')}</table>`);
  for (const L of T.levels) {
    if (!L.sentences.length && !L.words.length) continue;
    full.push(`<h3>Level ${L.lv.id}: ${esc(L.lv.name)}</h3>`);
    if (L.sentences.length) full.push(`<table>${L.sentences.map(row).join('')}</table>`);
    if (L.words.length) full.push(`<div class="words">${L.words.map(w => `<div data-line="${w.id}"><label><input type="checkbox" data-id="${w.id}" value="wrong"><span class="nl">${w.html}</span></label> <span class="en">${esc(w.en || '')}</span></div>`).join('')}</div><table>${row({ id: `L${L.lv.id}-words`, html: '<i>Notes on the words of this level</i>', en: '', wrong: [], noTicks: true })}</table>`);
  }
}
fs.mkdirSync(DIR, { recursive: true });
fs.writeFileSync(path.join(DIR, 'native-review.html'), page('full', 'Nachtrit native review', fullIntro, full.join('\n')));

// ---- the short sheet: 60 sentences across the tiers ----
let seed = 20261111; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const perTown = towns.filter(t => byTown.get(t.id)).map((t, i, all) => [t, i < 60 % all.length ? Math.ceil(60 / all.length) : Math.floor(60 / all.length)]);
const short = [];
for (const [t, k] of perTown) {
  const pool = byTown.get(t.id).levels.flatMap(L => L.sentences.filter(l => (l.kind === 'build' || l.kind === 'read') && nWords(l.plain) >= 4).map(l => ({ ...l, level: L.lv.id })));
  const pick = []; const used = new Set();
  // spread over the town's levels: shuffle, then take one per level until k
  const shuffled = pool.map(l => [rnd(), l]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  for (const l of shuffled) { if (pick.length >= k) break; if (used.has(l.level)) continue; used.add(l.level); pick.push(l); }
  for (const l of shuffled) { if (pick.length >= k) break; if (!pick.includes(l)) pick.push(l); }
  short.push({ t, lines: pick.sort((a, b) => levels.findIndex(x => x.id === a.level) - levels.findIndex(x => x.id === b.level)) });
}
const nShort = short.reduce((n, s) => n + s.lines.length, 0);
const sh = [`<h1>Nachtrit: one-hour review</h1><p>The 13 open questions, then ${nShort} sentences picked across all ${short.length} towns, from the easiest (A1) to the hardest (B1-B2). About 15 minutes for the questions and 45 for the sentences. Generated ${new Date().toISOString().slice(0, 10)} by <code>node qa/make-review.mjs</code>.</p>`,
  `<h2 class="first">Part 1. Thirteen open questions</h2>`, flagHtml(), `<h2>Part 2. ${nShort} sentences</h2>`];
for (const s of short) sh.push(`<h3>${esc(s.t.name)}, tier ${s.t.tier}, ${esc(s.t.cefr || '')}</h3><table>${s.lines.map(row).join('')}</table>`);
fs.writeFileSync(path.join(DIR, 'native-review-short.html'), page('short', 'Nachtrit one-hour review', howTo('', ''), sh.join('\n')));

const size = f => (fs.statSync(path.join(DIR, f)).size / 1024).toFixed(0) + ' KB';
console.log(`native-review.html: 13 questions (${FLAGS.reduce((n, f) => n + f.lines.length, 0)} quoted lines), ${total} sentences, ${totalWords} words and short phrases, ${size('native-review.html')}`);
console.log(`native-review-short.html: 13 questions and ${nShort} sentences from ${short.length} towns, ${size('native-review-short.html')}`);
FLAGS.forEach((f, i) => { if (!f.lines.length) console.log(`WARNING: question ${i + 1} (${f.t}) found no line in the content`); });
