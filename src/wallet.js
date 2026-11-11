// The wallet during a ride: what the passenger says when paying (fares.js has the amounts and the words), settling a ride on
// its last fork, tips for clean rides in a row, refusals, the wallet's float-up and the zombie's Tikkie.
import { $, FARES, pick } from './engine.js?v=41';
import { L, S } from './state.js?v=41';
import { card, cardSeq, hideCard } from './hud.js?v=41';
import './flow.js?v=41';   // keeps the order the game's code runs in

// ---------- fares ----------
const whyLine = (...parts) => parts.filter(Boolean).join(' · ');
// what the passenger names: the fare, or fare + the tip euro when the tip line is 'Klopt zo.' (said over the amount handed over)
const handed = (cents, tip) => cents + (tip && FARES.TIPS.some(t => t.handOver && t.nl === tip) ? 100 : 0);
function paidLine(cents, tip) {   // 'Alsjeblieft. Twee euro dertig.' plus the tip line
  const w = FARES.euroToWords(handed(cents, tip) / 100).replace(/^één/, 'eén');
  return w ? 'Alsjeblieft. ' + w.charAt(0).toUpperCase() + w.slice(1) + '.' + (tip ? ' ' + tip : '') : '';
}
// the last fork of a ride settles the money: full or part pay, or a refusal; returns the toast line and what is said
function settleRide(fork) {
  const st = fork.st, nl = fork.entry.nl; S.riding = null;
  const quiet = fork.entry.dehet || (L && L.id > 1000);   // de/het and bonus fares are not spoken: the next card comes too fast
  const pay = FARES.payCents(st.fare, st.wrong, st.forks.length);
  if (S.wrongRow >= 3) { S.missed += st.fare; return { line: '', voice: [nl] }; }   // the death on the next frame owns this moment
  if (pay > 0) {
    S.missed += st.fare - pay;
    const tip = payFare(pay, st.wrong === 0);
    return { line: paidLine(pay, tip), voice: quiet ? [nl] : [nl, FARES.euroToWords(handed(pay, tip) / 100), tip] };
  }
  const r = refuse(st);
  return { line: '', voice: quiet ? [nl] : [nl, r] };
}
// money in; every third clean ride in a row adds a tip; returns the tip line or ''
function payFare(cents, clean = true) {
  if (!(cents > 0)) return '';
  S.cents += cents; S.paid += cents;
  if (!clean || ++S.cleanRow % 3) return '';
  S.cents += 100; S.tips += 100;
  const later = FARES.TIPS.filter(t => !t.first && t.minTier <= S.fareTier);
  const t = S.tipN === 0 || !later.length ? (FARES.TIPS.find(x => x.first) || FARES.TIPS[0]) : later[(S.tipN - 1) % later.length];
  S.tipN++; walletFx('+ € 1,00', 'tip');
  return t ? t.nl : '';
}
// no pay: a dry line on the card, never the same one twice in a row
function refuse(st) {
  const pool = FARES.REFUSE.filter(r => r.minTier <= S.fareTier && S.fareTier <= (r.maxTier || 99) && r.nl !== S.lastRefuse);
  const r = pool.length ? pick(pool) : null;
  S.missed += st.fare;
  if (!r) return '';
  S.lastRefuse = r.nl;
  card.querySelector('.nl').textContent = st.entry.nl; card.querySelector('.fare').innerHTML = `<span class="no">${r.nl} <i>${r.en}</i></span>`; card.style.opacity = 1;
  const seq = cardSeq; setTimeout(() => { if (cardSeq === seq) hideCard(); }, 2400);
  return r.nl;
}
function walletFx(text, cls) { const fx = $('walletfx'); fx.textContent = text; fx.className = cls; S.fxT = 1.8; }
// a zombie's Tikkie: up to € 4,50 out of the wallet, never below zero
function payTikkie() {
  const taken = Math.min(S.cents, 450); S.cents -= taken; S.tikkie += taken; S.cleanRow = 0;
  if (!taken) return;   // an empty wallet loses nothing: the toast still asks for € 4,50, the pill stays put
  walletFx('− ' + FARES.fmtEuro(taken), 'lost');
  const p = $('walletpill'); p.classList.add('shake'); setTimeout(() => p.classList.remove('shake'), 400);
}

export { handed, paidLine, payFare, payTikkie, settleRide, whyLine };
