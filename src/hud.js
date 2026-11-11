// The HUD: the card with the sentence and its gap, the task label, the toast with the why line, the fare row, the lanes,
// first-letter hints and the flash.
import { TASKS } from './tasks.js?v=40';
import { VOICES } from './voice.js?v=40';
import { $, FARES } from './engine.js?v=40';
import { L, S } from './state.js?v=40';
import './plan.js?v=40';   // keeps the order the game's code runs in
import { speak } from './main.js?v=40';   // later modules, through the hub

// ---------- HUD ----------
const card = $('card'), toast = $('toast');
let toastT = 0;
function setToastT(t) { toastT = t; }   // the input and the loop shorten it (an imported binding is read-only)
let cardSeq = 0;
function showCard(who, en, nlHtml, fareHtml, task) {
  cardSeq++;
  card.querySelector('.who').textContent = who; card.querySelector('.en').textContent = en; card.querySelector('.nl').innerHTML = nlHtml; card.querySelector('.fare').innerHTML = fareHtml || ''; card.style.opacity = 1;
  cardTask(task); card.querySelector('.gohint').textContent = '';
}
// the task label: what this fork asks, in its colour; larger the first time the type comes up in a level
function cardTask(fork) {
  const el = card.querySelector('.task'), t = fork && TASKS[fork.taskId];
  el.textContent = t ? t.label : ''; el.style.color = t ? t.color : ''; el.classList.toggle('big', !!(fork && fork.firstTask));
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

export { assembled, card, cardSeq, fareRow, flash, forkCard, hideCard, say, setToastT, showCard, toast, toastT };
