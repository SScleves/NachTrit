// The word book (PLAN.md phase 4 points 4 to 6), opened from the map: every word met with its article, meaning, pictogram,
// town, a speaker button and a five-step strength mark from its box, filtered by town and strength; the rules with a bar
// each, the three weakest on top; and the save tab, which moves the progress to another device as a file or a paste code.
// Also the two rides built from the learner model: the practice ride (the 20 weakest items, no stars, small fares; the end
// card links to it when there were misses) and the trophy ride per saved town (all its items, no hints, double fares).
// The rules behind it are pure: src/learn.js (the model, the lists) and src/save.js (the file and the code).
import { bookWords, ruleRows, weakest } from './learn.js?v=44';
import { decodeCode, encodeCode, fromFile, toFile } from './save.js?v=44';
import { entryText } from './forks.js?v=44';
import { VOICES } from './voice.js?v=44';
import { $ } from './engine.js?v=44';
import { contentIndex, persist, S, SAVE } from './state.js?v=44';
import { esc } from './hud.js?v=44';
import { initAudio } from './audio.js?v=44';
import { speak } from './speech.js?v=44';
import { openMap, openMission, pictogram, TOWN_OF, towns } from './map.js?v=44';
import './wallet.js?v=44';   // keeps the order the game's code runs in

// ---------- practice and trophy rides ----------
const PRACTICE_N = 20, TROPHY_N = 30;
// the player's 20 weakest items (lowest box first) as a level: the knobs of the furthest level they come from, its town,
// no hint, each item's wrong options from its own level. null when fewer than four items can ride
function practiceLevel() {
  const ix = contentIndex(), keys = weakest(SAVE.items, ix.rows.map(r => r.key), PRACTICE_N);
  if (keys.length < 4) return null;
  const rows = keys.map(k => ix.byKey.get(k)), far = rows.reduce((a, b) => (b.order > a.order ? b : a));
  const items = rows.map(r => r.item), n = items.length;
  return Object.assign({}, far.level, {
    id: 3000, name: 'Practice', place: 'practice', town: far.town, practice: true, hint: null, items, deliveries: n,
    pools: new Map(rows.map(r => [r.item, r.level.items])), intro: '', introNl: '',
    obstacles: far.level.obstacles === 'normal' ? 'light' : far.level.obstacles,
    mission: { where: 'The roads you already know.', carry: `Your ${n} weakest words and sentences, from the word book.`,
      want: 'No stars and small fares. What you get right on the first try moves up a box.' },
  });
}
// a town's trophy ride: drawn from every item of its levels, no hints, double fares, the knobs of its last level
function trophyLevel(t) {
  const lvs = LEVELS.filter(l => !l.soon && l.items && l.items.length && (l.town || TOWN_OF(l.id)) === t.id);
  if (!lvs.length) return null;
  const seen = new Set(), items = [], pools = new Map();
  for (const lv of lvs) for (const it of lv.items) { const k = entryText(it); if (!k || seen.has(k)) continue; seen.add(k); items.push(it); pools.set(it, lv.items); }
  const last = lvs[lvs.length - 1], n = Math.min(TROPHY_N, items.length);
  return Object.assign({}, last, {
    id: 2000 + t.tier, name: 'Trophy ride', place: 'trophy', town: t.id, trophy: true, fareK: 2, hint: null, items, pools, deliveries: n,
    intro: `All of ${t.name} in one ride: ${n} deliveries drawn from its ${items.length} words and sentences. No hints. Every fare is doubled.`,
    introNl: `Heel ${t.name} in één rit. Geen hulp. Elke rit levert het dubbele op.`,
    mission: { where: `Every street in ${t.name}.`, carry: `${n} deliveries from all ${items.length} of its words and sentences.`, want: 'No hints and no glowing signs. Every fare is doubled.' },
  });
}
// ?level=: a level id, 'practice' or 'trophy-<town id>' (the boot and qa/ride.mjs)
function levelOf(q) {
  if (q === 'practice') return practiceLevel();
  if (/^trophy-/.test(q)) { const t = towns().find(x => x.id === q.slice(7)); return t ? trophyLevel(t) : null; }
  return LEVELS.find(l => l.id === +q) || null;
}
// the end card's link and the word book's button
function openPractice() {
  const lv = practiceLevel();
  if (!lv) { openBook('words'); return; }
  $('book').style.display = 'none'; $('summary').style.display = 'none';
  openMission(lv);
}

// ---------- the word book ----------
let tab = 'words';
const STRENGTH = ['', 'missed last time', 'learning', 'learning', 'nearly there', 'known'];
function openBook(which) {
  tab = which || tab;
  for (const id of ['summary', 'mission']) $(id).style.display = 'none';
  $('book').style.display = 'flex'; showTab(tab);
}
function closeBook() { $('book').style.display = 'none'; openMap(); }
function showTab(which) {
  tab = which;
  for (const b of $('book').querySelectorAll('.btabs button')) { const on = b.dataset.tab === tab; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); }
  for (const id of ['words', 'rules', 'save']) $('b_' + id).style.display = id === tab ? '' : 'none';
  if (tab === 'words') drawWords(true); else if (tab === 'rules') drawRules(); else drawSave();
  $('b_scroll').scrollTop = 0;
}
const dots = box => `<span class="str s${box}" title="Strength ${box} of 5: ${STRENGTH[box]}" aria-label="Strength ${box} of 5">${'●'.repeat(box)}<i>${'●'.repeat(5 - box)}</i></span>`;
function drawWords(fill) {
  const ix = contentIndex(), all = bookWords(SAVE.items, ix, entryText), T = towns(), name = id => (T.find(t => t.id === id) || { name: id }).name;
  if (fill) {   // the filters list only what is there: the towns with words met, the strengths with words
    const tv = $('b_town').value, bv = $('b_box').value;
    const byTown = T.map(t => [t, all.filter(w => w.town === t.id).length]).filter(x => x[1]);
    $('b_town').innerHTML = `<option value="">All towns · ${all.length}</option>` + byTown.map(([t, n]) => `<option value="${t.id}">${esc(t.name)} · ${n}</option>`).join('');
    $('b_box').innerHTML = '<option value="">Any strength</option>' + [1, 2, 3, 4, 5].map(b => `<option value="${b}">${b} of 5 · ${STRENGTH[b]} · ${all.filter(w => w.box === b).length}</option>`).join('');
    if ([...$('b_town').options].some(o => o.value === tv)) $('b_town').value = tv;
    $('b_box').value = bv;
  }
  const town = $('b_town').value, box = +$('b_box').value || 0;
  const list = all.filter(w => (!town || w.town === town) && (!box || w.box === box));
  $('b_wn').textContent = all.length ? String(all.length) : '';
  $('b_count').textContent = !all.length ? '' : list.length === all.length ? `${all.length} word${all.length === 1 ? '' : 's'} met` : `${list.length} of the ${all.length} words met`;
  $('b_list').innerHTML = !all.length ? '<p class="bempty">No words yet. The words you meet on a ride show up here, with how well you know them.</p>'
    : !list.length ? '<p class="bempty">No words with this town and strength.</p>'
    : list.map(w => `<div class="bw"><span class="pic">${pictogram(w.nl)}</span><div class="bt"><b>${esc(w.nl)}</b><span>${esc(w.en)}</span><small>${esc(name(w.town))}</small></div>`
      + `${dots(w.box)}<button class="say" data-say="${esc(w.nl)}" aria-label="Hear ${esc(w.nl)}">🔊</button></div>`).join('');
  const p = practiceLevel();
  $('b_practice').disabled = !p;
  $('b_pnote').textContent = p ? `Your ${p.items.length} weakest words and sentences in one ride. No stars, small fares.` : 'Meet a few more words first. The practice ride needs at least four.';
}
function drawRules() {
  const { weakest: w, rest } = ruleRows(SAVE.rules, window.RULES || {});
  const row = r => { const pc = Math.round(100 * r.right / r.seen); return `<div class="br"><div class="brn">${esc(r.name)}</div><div class="bar"><i style="width:${pc}%"></i></div><div class="brc">${r.right} of ${r.seen} right</div></div>`; };
  $('b_rules').innerHTML = !w.length && !rest.length ? '<p class="bempty">No rules yet. Each fork practises a rule; after a ride they show up here with how often you got them right.</p>'
    : (w.length ? `<h3>Weakest</h3>${w.map(row).join('')}` : '') + `<h3>${w.length ? 'All the others' : 'All rules'}</h3>` + rest.map(row).join('');
}
const counts = s => ({ stars: Object.values(s.stars).reduce((a, b) => a + b, 0), places: Object.keys(s.stars).length, words: bookWords(s.items, contentIndex(), entryText).length, items: Object.keys(s.items).length });
function drawSave() {
  const c = counts(SAVE);
  $('b_have').textContent = `This browser has ${c.stars} star${c.stars === 1 ? '' : 's'} in ${c.places} place${c.places === 1 ? '' : 's'}, ${c.words} word${c.words === 1 ? '' : 's'} met and ${SAVE.ride} ride${SAVE.ride === 1 ? '' : 's'}.`;
  msg(''); $('b_confirm').innerHTML = '';
}
function msg(t, bad) { $('b_msg').textContent = t; $('b_msg').className = bad ? 'bad' : ''; }
// a save from a file or a code: say what is in it and ask before it replaces this browser's progress
let pending = null;
function offer(next) {
  pending = next; const c = counts(next);
  msg('');
  $('b_confirm').innerHTML = `<p>This save has ${c.stars} star${c.stars === 1 ? '' : 's'} in ${c.places} place${c.places === 1 ? '' : 's'}, ${c.words} word${c.words === 1 ? '' : 's'} met and ${next.ride} ride${next.ride === 1 ? '' : 's'}. Loading it replaces the progress in this browser.</p>`
    + '<button class="btn" id="b_yes">Load it</button><button class="btn ghost" id="b_no">Cancel</button>';
  $('b_yes').onclick = () => { apply(pending); pending = null; };
  $('b_no').onclick = () => { pending = null; $('b_confirm').innerHTML = ''; };
  $('b_yes').focus();
}
// replace the save in place: the stars and scores objects are the ones the map and the rides hold
function apply(next) {
  for (const f of ['stars', 'scores', 'flags', 'settings', 'items', 'rules']) { const o = SAVE[f]; for (const k of Object.keys(o)) delete o[k]; Object.assign(o, next[f]); }
  for (const k of Object.keys(next)) if (!['stars', 'scores', 'flags', 'settings', 'items', 'rules'].includes(k)) SAVE[k] = next[k];
  S.voice = SAVE.settings.voice !== 0; $('snd').textContent = S.voice ? '🔊' : '🔇';
  const ok = persist(); drawSave();
  msg(ok ? 'Loaded. The map and the word book show the progress from the save.' : 'Loaded for now, but this browser would not keep it (private window or full storage).', !ok);
}
function download() {
  const blob = new Blob([toFile(SAVE)], { type: 'application/json' }), a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `nachtrit-save-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  msg('Saved. Keep the file, or open it in the word book on the other device.');
}

// ---------- wiring ----------
$('bookbtn').onclick = () => { initAudio(); openBook(); };
$('b_close').onclick = closeBook;
for (const b of $('book').querySelectorAll('.btabs button')) b.onclick = () => showTab(b.dataset.tab);
$('b_town').onchange = $('b_box').onchange = () => drawWords(false);
$('b_list').onclick = e => { const b = e.target.closest && e.target.closest('button[data-say]'); if (b) { initAudio(); speak(b.dataset.say, false, VOICES.rider, true); } };
$('b_practice').onclick = openPractice;
$('b_file').onclick = download;
$('b_load').onclick = () => $('b_input').click();
$('b_input').onchange = async () => {
  const f = $('b_input').files[0]; $('b_input').value = ''; if (!f) return;
  try { offer(fromFile(await f.text())); } catch (e) { msg(e.message, true); }
};
$('b_mkcode').onclick = async () => {
  const code = await encodeCode(SAVE, contentIndex().keys); $('b_code').value = code;
  try { await navigator.clipboard.writeText(code); msg(`Copied. The code is ${code.length} characters. Paste it into the word book on the other device.`); }
  catch (e) { $('b_code').select(); msg(`The code is ${code.length} characters, selected above. Copy it, then paste it into the word book on the other device.`); }
};
$('b_usecode').onclick = async () => {
  const code = $('b_code').value.trim(); if (!code) { msg('Paste a code into the box first.', true); return; }
  try { offer(await decodeCode(code, contentIndex().keys)); } catch (e) { msg(e.message, true); }
};
addEventListener('keydown', e => { if (e.key === 'Escape' && $('book').style.display !== 'none') { closeBook(); e.preventDefault(); } });
window.NRbook = { open: openBook, practiceLevel, trophyLevel, index: contentIndex, persist, words: () => bookWords(SAVE.items, contentIndex(), entryText) };   // qa

export { levelOf, openBook, openPractice, practiceLevel, trophyLevel };
