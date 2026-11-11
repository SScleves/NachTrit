// The HUD: the card with the sentence and its gap, the task label and the "again" tag, the why card after a wrong answer,
// the toast, the fare row, the lanes, first-letter hints and the flash.
import { TASKS } from './tasks.js?v=41';
import { VOICES } from './voice.js?v=41';
import { $, FARES } from './engine.js?v=41';
import { L, S } from './state.js?v=41';
import './plan.js?v=41';   // keeps the order the game's code runs in
import { speak, TOUCH } from './main.js?v=41';   // later modules, through the hub

// ---------- HUD ----------
const card = $('card'), toast = $('toast');
let toastT = 0;
function setToastT(t) { toastT = t; }   // the input and the loop shorten it (an imported binding is read-only)
let cardSeq = 0;
function showCard(who, en, nlHtml, fareHtml, task) {
  cardSeq++;
  card.querySelector('.who').textContent = who; card.querySelector('.en').textContent = en; card.querySelector('.nl').innerHTML = nlHtml; card.querySelector('.fare').innerHTML = fareHtml || ''; card.style.opacity = 1;
  card.classList.remove('wrong'); card.querySelector('.whyline').textContent = '';
  cardTask(task); card.querySelector('.gohint').textContent = '';
}
// the task label: what this fork asks, in its colour; larger the first time the type comes up in a level. A missed item
// that came back carries the "again" tag beside it (and pays half, on the fare row)
function cardTask(fork) {
  const el = card.querySelector('.task'), t = fork && TASKS[fork.taskId];
  el.textContent = t ? t.label : ''; el.style.color = t ? t.color : ''; el.classList.toggle('big', !!(fork && fork.firstTask));
  card.querySelector('.again').textContent = fork && fork.entry && fork.entry.again ? 'again' : '';
}
// the whole Dutch frame: what is chosen, a glowing slot for this fork, dim slots for the later ones
const SLOT = '<b class="slot">&nbsp;</b>', SLOT_LATER = '<b class="slot later">&nbsp;</b>';
function cardFrame(st, idx) {
  const out = []; let fi = 0;
  for (const p of st.entry.parts) { if (typeof p === 'string') out.push(p); else { out.push(fi < idx ? st.chosen[fi] : fi === idx ? SLOT : SLOT_LATER); fi++; } }
  return out.join(' ').replace(/\s+([,.?!])/g, '$1');
}
// the card for a sentence fork (build, listen, de/het): the passenger's pickup and the gate both use it
function forkCard(f, fr) {
  const e = f.entry;
  if (e.listen) { showCard('Listen', '🔊 …', cardFrame(f.st, f.idx), fr, f); speak(e.nl, false, VOICES.passenger); }
  else if (e.dehet) showCard('De or het?', e.parts[1], SLOT + ' ' + e.parts[1] + ' <span style="color:#9fb0cc">· ' + e.en + '</span>', fr, f);
  else showCard('The passenger says', e.en, cardFrame(f.st, f.idx) + (L && L.hint === 'letter' && firstLetterHint(f.o[f.a]) ? ` <span style="color:#9fb0cc">(${firstLetterHint(f.o[f.a])})</span>` : ''), fr, f);
}
function hideCard() { card.style.opacity = 0; }   // .fare is left to fade with the rest: showCard always rewrites it
// ---------- the why card (PLAN.md 3d) ----------
// a wrong answer keeps the card up, where the eye already is: what he rode, struck out; the right form in its sentence; the
// why line; the fare. S.whyT counts down from whyBudget(why); meanwhile the bike crawls at the fork speed, stops short of the
// next fork's reading range and the lamp holds (src/loop.js). ↑, W or a swipe up ends it (src/input.js).
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
let whySeq = -1, whyUp = false;
function whyCard(fork, said, fareHtml, secs) {
  const e = fork.entry, right = fork.o[fork.a];
  let sentence = esc(e.nl), meaning = '';
  if (fork.read) meaning = `= <b class="right">${esc(right)}</b>`;
  else {   // the sentence up to this gap with the right form in it; later gaps stay open
    const out = []; let fi = 0;
    for (const p of e.parts) { if (typeof p === 'string') out.push(esc(p)); else { out.push(fi < fork.idx ? esc(fork.st.chosen[fi]) : fi === fork.idx ? `<b class="right">${esc(right)}</b>` : SLOT_LATER); fi++; } }
    sentence = out.join(' ').replace(/\s+([,.?!])/g, '$1');
    if (e.word || e.look || e.listen || e.dehet) meaning = `<span style="color:#9fb0cc">${esc(e.en)}</span>`;
  }
  cardSeq++; whySeq = cardSeq;
  card.querySelector('.who').innerHTML = said ? `You rode <s>${esc(said)}</s>` : 'No sign chosen';
  card.querySelector('.en').innerHTML = sentence; card.querySelector('.nl').innerHTML = meaning;
  card.querySelector('.whyline').textContent = fork.w || '';
  card.querySelector('.fare').innerHTML = fareHtml || '';
  cardTask(fork); card.querySelector('.task').classList.remove('big');
  card.querySelector('.gohint').textContent = TOUCH ? 'Swipe up to ride on.' : '↑ or W to ride on.';
  card.classList.add('wrong'); card.style.opacity = 1;
  toast.style.opacity = 0; toastT = 0;
  S.whyT = secs; whyUp = true;
}
// the why card's time is up, or he pressed go: the card goes, the bike picks up speed
function endWhy() {
  if (!whyUp) return;
  whyUp = false; S.whyT = 0; if (cardSeq === whySeq) hideCard();
  if (!S.activeFork) S.slowTarget = 1;
}
// the fare line on the card: what the ride is worth, struck through with what is left once a gap went wrong
function fareRow(fare, wrong, forks) {
  if (!fare) return '';
  if (wrong > 0) return `<s>${FARES.fmtEuro(fare)}</s> ${FARES.fmtEuro(FARES.payCents(fare, wrong, forks))}`;
  return FARES.fmtEuro(fare) + (S.fareTier <= 3 ? ` <i>${FARES.euroToWords(fare / 100)}</i>` : '');
}
function say(msg, cls, why, secs = 2.4) {
  toast.className = cls; toast.innerHTML = msg + (why ? `<span class="why">${why}</span>` : ''); toast.style.opacity = 1; toastT = secs;
}
function firstLetterHint(answer) { if (/^(de|het|een|dit|deze)$/i.test(answer.trim())) return ''; const w = answer.replace(/^(de|het|een)\s+/i, ''); return w.slice(0, 1) + '…'; }
function assembled(st, upToIdx, mark) {
  // Dutch so far: fixed parts + chosen; current fork shown as ___ ; later parts as …
  let out = [], fi = 0;
  for (const p of st.entry.parts) {
    if (typeof p === 'string') { if (fi <= upToIdx) out.push(p); }
    else {
      if (fi < upToIdx) out.push(st.chosen[fi]);
      else if (fi === upToIdx) out.push(mark || '<b>___</b>');
      fi++;
    }
  }
  return out.join(' ').replace(/\s+([,.?!])/g, '$1') + (upToIdx < st.forks.length - 1 ? ' …' : '');
}
function flash(color, a = 0.5) { const f = $('flash'); f.style.background = color; f.style.opacity = a; setTimeout(() => f.style.opacity = 0, 70); }

export { assembled, card, cardSeq, endWhy, esc, fareRow, flash, forkCard, hideCard, say, setToastT, showCard, toast, toastT, whyCard };
