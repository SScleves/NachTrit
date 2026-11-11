// A ride from start to end: start() dresses the town and builds the level queue, reset() clears the road, the first-ride
// teaching and the lamp hint, die() and the summary card with stars and scores, and resolveFork, the verdict on each fork.
// The learning core (PLAN.md 3a, 3d) is here too: a missed item goes back in the queue (sendBack), a wrong answer gets the why
// card, every fork is noted for the end card's list of misses by rule (noteFork, missedHtml). Its pure rules: src/review.js.
import { refuelRight, TUNE } from './lamp.js?v=41';
import { levelQueue } from './forks.js?v=41';
import { whyBudget } from './reading.js?v=41';
import { TASKS } from './tasks.js?v=41';
import { VOICES } from './voice.js?v=41';
import { groupMisses, markRight, returnSlot, shouldReturn, weakLine } from './review.js?v=41';
import { $, BASE_SPEED, clamp, FARES, LANES2, LANES3, MAX_SPEED, today } from './engine.js?v=41';
import { camera, scene } from './render.js?v=41';
import { setRoadLook } from './road.js?v=41';
import { setTownId, setTownStyle, townId, townStyleOf } from './furniture.js?v=41';
import { buildScenery, theme, THEMES } from './scenery.js?v=41';
import { bike, dropPassenger, follower, rackGhost, setFace, setRackGhost } from './rider.js?v=41';
import { BASE, L, LANE_X, MAXS, progress, S, saveProgress, saveScores, scores, setL, setLaneX, setSpeeds, unlocked } from './state.js?v=41';
import { plan, unplanFinish } from './plan.js?v=41';
import { assembled, esc, fareRow, flash, hideCard, say, toast, whyCard } from './hud.js?v=41';
import { chime, initAudio } from './audio.js?v=41';
import { speak, speakSeq } from './speech.js?v=41';
import { introSeen, setIntroSeen, showIntro, showLevelIntro, startArt } from './intro.js?v=41';
import { openMap, openMission, pendingLevel, TOWN_OF, towns } from './map.js?v=41';
import { handed, paidLine, payFare, settleRide, whyLine } from './main.js?v=41';   // later modules, through the hub

// ---------- game flow ----------
function start(lv) {
  startArt.off(); setL(lv || null);
  setLaneX((L && L.lanes === 2) ? LANES2 : LANES3);
  setSpeeds(L ? L.speed : BASE_SPEED, L ? L.maxSpeed : MAX_SPEED);
  for (const id of ['start', 'summary', 'mission', 'map']) $(id).style.display = 'none';
  S.wordPool = L ? L.items.map(i => i.nl).filter(Boolean) : [];
  setTownId(L ? (L.town || TOWN_OF(L.id)) : 'alblasserdam'); const qs = new URLSearchParams(location.search), qt = qs.get('town'); if (qt) setTownId(qt);
  setTownStyle(townStyleOf(townId));
  buildScenery(THEMES[qs.get('theme') || (L && L.theme) || 'polder'] || THEMES.polder);   // ?town= and ?theme= dress any level as another place, for looking at a town's art
  setRoadLook(LANE_X.length, theme);
  $('hud').classList.toggle('endless', !L);
  reset(); S.mode = 'intro'; S.introT = 0;
}
// the town's tier prices the rides; endless rides as tier 6
function fareTier() {
  if (!L) return 6;
  const t = towns().find(t => t.id === (L.town || TOWN_OF(L.id)));
  return t ? t.tier : (L.act || 1);
}
function reset() {
  for (const o of S.objs) if (o.mesh) scene.remove(o.mesh);
  Object.assign(S, { t: 0, dist: 0, speed: BASE, slow: 1, slowTarget: 1, lane: LANE_X.length === 2 ? 0 : 1, x: 0, lean: 0, lamp: L ? 85 : 70, souls: 0, streak: 0, wrongRow: 0, good: 0, bad: 0,
    objs: [], planCursor: 40, activeFork: null, forkZoom: 0, speedNorm: 0, mistakes: [], dieT: 0, stumble: 0, sentencePool: [], queue: L ? levelQueue(L, LANE_X.length) : [], finishPlanned: false, curv: 0, curvTarget: 0, curvNextAt: 60, grade: 0, delivered: 0, deliveriesTotal: L ? L.deliveries : 0, lampMin: 100,
    met: new Map(), tasksSeen: new Set(), goHints: 0, teachPlan: L && !taughtBefore() ? 3 : 0, taught: 0, lastWords: 0, held: false, wispEasy: !!L && fareTier() === 1,
    cents: 0, walletShown: 0, missed: 0, tips: 0, tikkie: 0, cleanRow: 0, tipN: 0, lastRefuse: '', riding: null, fareTier: fareTier(), score: 0, fxT: 0, paid: 0, walletLast: 0, tickT: -1,
    // the learning core: forks answered, entries planned, the misses for the end card, first rides per task, misses per item,
    // the returns (count, their verdicts, the why cards shown, one log line each), the why card, review road
    forkN: 0, plannedN: 0, missList: [], tally: {}, missN: new Map(), learn: { returns: 0, right: 0, wrong: 0, whyN: 0, log: [] },
    whyT: 0, reviewRoad: [], reviewM: 0, onReview: false });
  $('wallet').textContent = '€ 0,00'; $('walletfx').textContent = ''; $('walletfx').className = ''; $('walletpill').classList.remove('shake');
  follower.visible = false; follower.userData.glow.intensity = 0; if (rackGhost) { bike.remove(rackGhost); setRackGhost(null); }
  camera.position.set(0, 22, 14); camera.lookAt(0, 0, -30); camera.fov = 60; camera.updateProjectionMatrix();
  hideCard(); toast.style.opacity = 0; $('vignette').style.opacity = 0; $('lanes').style.opacity = 0;
  plan();
}
// the first three forks of a player's first ride teach the move (nachtrit.taught is set once they are done)
function taughtBefore() { try { return localStorage.getItem('nachtrit.taught') === '1'; } catch (e) { return true; } }
let lampHinted = (() => { try { return localStorage.getItem('nachtrit.lamphint') === '1'; } catch (e) { return true; } })();
function setLampHinted(v) { lampHinted = v; }   // the loop gives the hint once (an imported binding is read-only)
function die() {
  S.mode = 'dying'; S.dieT = 0; S.whyT = 0; hideCard(); $('lanes').style.opacity = 0; setFace('scream', 9);
  follower.visible = true; follower.position.set(0, 0, 11); follower.lookAt(0, 4, 0);
  speak('Je bent te laat.');
}

function showSummary(won) {
  S.mode = 'dead'; S.whyT = 0;
  $('s_souls').textContent = L ? `${S.delivered}/${S.deliveriesTotal}` : S.souls; $('s_dist').textContent = Math.round(S.dist) + ' m';
  $('s_good').textContent = S.good; $('s_bad').textContent = S.bad;
  let stars = 0;
  if (L && won) {
    const ratio = S.delivered / S.deliveriesTotal;
    const three = S.deliveriesTotal >= 16 ? 0.95 : 1;   // long levels allow one miss for three stars
    stars = ratio >= three && S.lampMin >= 40 ? 3 : ratio >= 0.83 ? 2 : ratio >= 0.66 ? 1 : 0;
    if (stars > (progress[L.id] || 0)) { progress[L.id] = stars; saveProgress(); }
  }
  $('sumtitle').textContent = !L ? 'IT HAS YOU.' : !won ? 'IT HAS YOU.' : stars ? 'DELIVERED.' : 'NOT ENOUGH.';
  $('stars').textContent = L && won ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '';
  $('sumline').textContent = !won ? (S.bad === 0 ? 'No mistakes. The lamp just ran out. Ride faster, collect the wisps.' : `${S.mistakes.length} mistake${S.mistakes.length === 1 ? '' : 's'} to practise.`)
    : stars ? (stars === 3 ? 'Every delivery, lamp never below half. The dead are pleased.' : (S.deliveriesTotal >= 16 ? 'Delivered. Three stars allow one miss and need a healthy lamp.' : 'Delivered. Three stars need every one right with a healthy lamp.')) : `You need ${Math.ceil(S.deliveriesTotal * 0.66)} of ${S.deliveriesTotal} right for a star. Stars open the next town.`;
  $('again').textContent = L && won && stars ? 'Next place' : 'Again';
  const wl = [...S.met.entries()];
  $('s_words').innerHTML = wl.length ? `<div style="color:var(--dim);font-size:11px;letter-spacing:.12em;text-transform:uppercase">Words tonight · ${wl.filter(w => w[1].ok).length} of ${wl.length} right</div>`
    + wl.map(([nl, w]) => `<span class="${w.ok ? 'ok' : 'no'}">${w.ok ? '✓' : '✗'}</span> <b>${nl}</b> ${w.en}`).join(' · ') : '';
  $('log').value = S.mistakes.map(m => `- ${today()} — ${m.said} → ${m.should} → [[${m.note}]]`).join('\n') || '(no mistakes)';
  const missed = missedHtml(); $('s_missed').innerHTML = missed; $('summary').classList.toggle('hasmissed', !!missed);
  // money: score, best per level (levels only when home, endless on every death), the wallet line
  S.score = S.delivered * 100 + S.cents / 10 + Math.round(clamp(S.lampMin, 0, 100));
  const sk = L ? String(L.id) : 'endless';
  if ((!L || won) && S.score > (scores[sk] || 0)) { scores[sk] = S.score; saveScores(); }
  $('s_wallet').textContent = FARES.fmtEuro(S.cents); $('s_score').textContent = S.score; $('s_best').textContent = scores[sk] || 0;
  const f = FARES.fmtEuro;
  $('s_money').innerHTML = `<div>Fares ${f(S.paid)} · tips ${f(S.tips)} · Tikkie − ${f(S.tikkie)} · missed ${f(S.missed)}</div>`
    + (S.riding ? `<div>Niet afgeleverd · ${f(S.riding.fare)}</div>` : '') + (L && !won ? '<div>Score counts when you get home.</div>' : '');
  $('summary').style.display = 'flex';
}
function levelDone() { S.mode = 'dying'; S.dieT = 10; showSummary(true); }
$('go').onclick = () => { initAudio(); if (!introSeen) { setIntroSeen(true); $('start').style.display = 'none'; showIntro(openMap); } else openMap(); };
$('replay').onclick = () => { $('start').style.display = 'none'; showIntro(openMap, null, true); }; $('tomap').onclick = openMap; $('endless').onclick = () => start(null);
$('m_go').onclick = () => { const lv = pendingLevel; $('mission').style.display = 'none'; showLevelIntro(lv, () => start(lv)); }; $('m_back').onclick = openMap;
$('again').onclick = () => {
  if (L && $('again').textContent === 'Next place') { const next = LEVELS.find(l => l.id === L.id + 1); if (next && !next.soon && L.id < 1000 && unlocked(next)) return openMission(next); return openMap(); }
  start(L);
};
// the end card's misses (PLAN.md 3d point 4): grouped by rule (the task label), the weakest rule in one line, and per item the
// sentence with the right form marked, what he rode, the why line, how its return went, and a speaker button
function missedHtml() {
  const { groups, weakest } = groupMisses(S.missList, S.tally, TASKS);
  if (!groups.length) return '';
  const row = m => {
    const [a, b, c] = markRight(m.nl, m.right);
    const sent = b ? `${esc(a)}<b>${esc(b)}</b>${esc(c)}` : `${esc(m.nl)} <span class="eq">=</span> <b>${esc(m.right)}</b>`;
    const back = m.again === 'right' ? '<div class="magain right">Right when it came back.</div>' : m.again === 'wrong' ? '<div class="magain wrong">Missed again when it came back.</div>' : '';
    return `<div class="mrow"><button class="say" data-say="${esc(m.nl)}" title="Hear it" aria-label="Hear it">🔊</button><div><div class="msent">${sent}</div>`
      + `<div class="mwhy">${m.said ? `<s>${esc(m.said)}</s>${m.why ? ' · ' : ''}` : ''}${esc(m.why)}</div>${back}</div></div>`;
  };
  return `<div class="mhead">Missed tonight · ${S.missList.length}</div>` + (weakest ? `<div class="weak">${esc(weakLine(weakest))}</div>` : '')
    + groups.map(g => `<div class="mrule" style="color:${g.color}">${esc(g.label)} · ${g.items.length}</div>` + g.items.map(row).join('')).join('');
}
$('s_missed').onclick = e => { const b = e.target.closest && e.target.closest('button[data-say]'); if (b) { initAudio(); speak(b.dataset.say, false, VOICES.rider, true); } };
$('copy').onclick = () => { navigator.clipboard?.writeText($('log').value); $('copy').textContent = 'Copied'; setTimeout(() => $('copy').textContent = 'Copy mistakes', 1500); };

function resolveFork(gate) {
  const { fork } = gate; gate.resolved = true; S.activeFork = null; S.slowTarget = 1; $('lanes').style.opacity = 0; hideCard();
  const post = gate.posts.find(p => p.lane === S.lane);
  const chosenIdx = post ? post.oi : -1;
  const ok = chosenIdx === fork.a;
  const back = fork.entry.again || 0;   // 0 on the item's first ride; 1 or 2 when a miss brought it back (it never counts for stars)
  S.forkN++; const fresh = noteFork(fork, ok, back, chosenIdx);   // fresh: a miss the end card did not list yet
  if (L && !back && (fork.read || (fork.st && fork.st.forks.length === 1))) {   // the words of the ride, for the end card: words met, words right
    const k = fork.entry.nl, was = S.met.get(k); S.met.set(k, { en: fork.read ? fork.o[fork.a] : fork.entry.en, ok: ok && (!was || was.ok) });
  }
  if (gate.teach && ++S.taught >= 3) { try { localStorage.setItem('nachtrit.taught', '1'); } catch (e) {} }
  const rule = RULES[fork.r] || { name: fork.r, note: fork.r };
  const done = fork.read || fork.idx === fork.st.forks.length - 1;
  if (ok) {
    if (back) S.learn.right++; else S.good++;
    S.streak++; S.wrongRow = 0; setFace('smug', 1.6);
    S.lamp = clamp(S.lamp + refuelRight(S.streak) + (gate.goEarly ? TUNE.fast : 0), 0, 100); S.speed = clamp(S.speed + 1.6, BASE, MAXS);
    flash('#f6e7b0', 0.35); chime(true);
    if (fork.read) { if (!back) { S.souls++; S.delivered++; } const tip = payFare(fork.fare, true); say(`<b>${fork.o[fork.a]}</b>`, 'good', whyLine(fork.w, paidLine(fork.fare, tip)), 3); speakSeq([fork.entry.nl, FARES.euroToWords(handed(fork.fare, tip) / 100), tip]); }
    else {
      fork.st.chosen.push(fork.o[fork.a]);
      if (done) { if (!back) { S.souls++; if (fork.st.wrong === 0) S.delivered++; } hideCard(); const m = settleRide(fork); say(`<b>${fork.entry.nl}</b>`, 'good', whyLine(L ? fork.w : 'Delivered.', m.line), 3.2); speakSeq(m.voice); dropPassenger(); }
      else { say(`<b>${fork.o[fork.a]}</b>`, 'good', null, 1.6); speak(fork.o[fork.a], true); }
    }
  } else {
    if (back) S.learn.wrong++; else { S.bad++; S.wrongRow++; }   // a return answered wrong never counts toward the three in a row
    S.streak = 0; S.cleanRow = 0; setFace('ouch', 2.2);
    if (!back) S.lamp = clamp(S.lamp - (L ? 14 : 22), 0, 100);   // review never kills: a return costs no lamp
    S.speed = clamp(S.speed - 3, BASE, MAXS);
    flash('#a01010', 0.45); chime(false); S.stumble = 1;
    const saidTxt = chosenIdx >= 0 ? fork.o[chosenIdx] : '(geen keuze)', said = chosenIdx >= 0 ? fork.o[chosenIdx] : '';
    const secs = whyBudget(fork.w); S.learn.whyN++;
    if (fork.read) {
      S.missed += fork.fare;
      whyCard(fork, said, '<span class="no">Geen cent.</span>', secs);
      if (fresh) S.mistakes.push({ said: `"${fork.entry.nl}" read as "${saidTxt}"`, should: `"${fork.o[fork.a]}"`, note: rule.note });
    } else {
      const wrongSentence = assembled(fork.st, fork.idx, chosenIdx >= 0 ? saidTxt : '___').replace(' …', '');
      if (fresh) S.mistakes.push({ said: wrongSentence, should: fork.entry.nl, note: rule.note });
      fork.st.chosen.push(fork.o[fork.a]); // the sentence continues with the right word
      fork.st.wrong++; if (fork.st.lostAt < 0) fork.st.lostAt = fork.idx;
      if (done) { if (!back) S.souls++; hideCard(); const m = settleRide(fork); whyCard(fork, said, settledHtml(fork.st, m), secs); speakSeq(m.voice); dropPassenger(); }
      else whyCard(fork, said, fareRow(fork.st.fare, fork.st.wrong, fork.st.forks.length), secs);
    }
    if (S.wrongRow >= 3) S.lamp = 0;
  }
  for (const p of gate.posts) p.mesh.userData.board.material.color.set(p.oi === fork.a ? 0x9fdc7a : 0x7a3a3a);
  if (back && done) { const r = S.learn.log.find(x => x.entry === fork.entry); if (r) { r.result = (fork.read ? ok : fork.st.wrong === 0) ? 'right' : 'wrong'; r.fare = fork.read ? fork.fare : fork.st.fare; } }
  if (L && done && (fork.read ? !ok : fork.st.wrong > 0)) sendBack(fork);   // a missed item comes back later in this ride
}
// the fare line of a ride settled on a wrong answer: the struck fare and what was paid, or the refusal
function settledHtml(st, m) {
  if (m.line) return `${fareRow(st.fare, st.wrong, st.forks.length)} · ${esc(m.line)}`;
  const r = m.refused && FARES.REFUSE.find(x => x.nl === m.refused);
  return r ? `<span class="no">${esc(r.nl)} <i>${esc(r.en)}</i></span>` : '';
}
// every fork, for the end card: first rides per task (the weakest rule), each missed fork once, and how its return went.
// Returns true for a miss not listed yet (the vault log takes the same ones)
function noteFork(fork, ok, back, chosenIdx) {
  const origin = fork.entry.origin || fork.entry, task = fork.taskId || 'word';
  if (!back) { const t = S.tally[task] || (S.tally[task] = { tried: 0, missed: 0 }); t.tried++; if (!ok) t.missed++; }
  if (back && fork.idx === 0) { const r = S.learn.log.find(x => x.entry === fork.entry); if (r) r.gap = S.forkN - r.at - 1; }   // other forks between the miss and its return
  const m = S.missList.find(x => x.origin === origin && x.idx === fork.idx);
  if (ok) { if (m && back) m.again = 'right'; return false; }
  if (m) { if (back) m.again = 'wrong'; return false; }
  S.missList.push({ origin, idx: fork.idx, task, nl: fork.entry.nl, right: fork.o[fork.a], said: chosenIdx >= 0 ? fork.o[chosenIdx] : '', why: fork.w || '', again: '', first: !back });
  return true;
}
// a missed item goes back in the queue (PLAN.md 3a): after 3 to 5 other forks, a second miss in the last quarter, at most twice,
// at most six a ride. It rides as a copy with again = 1 or 2: the "again" tag, half fare, review road
const forksIn = e => e.read ? 1 : e.parts.filter(p => typeof p !== 'string').length;
function sendBack(fork) {
  const origin = fork.entry.origin || fork.entry, n = (S.missN.get(origin) || 0) + 1; S.missN.set(origin, n);
  if (!shouldReturn(n, S.learn.returns)) return;
  let ahead = 0; for (const o of S.objs) if (o.type === 'gate' && !o.gate.resolved) ahead++;
  const at = returnSlot(ahead, S.queue.map(forksIn), S.plannedN, n);
  const e = Object.assign({}, origin, { again: n, origin });
  S.queue.splice(at, 0, e); S.learn.returns++;
  S.learn.log.push({ entry: e, nl: origin.nl, misses: n, at: S.forkN, ahead, slot: at, ofQueue: S.queue.length - 1, planned: S.plannedN,
    full: origin.read ? FARES.FLAT.read || 0 : FARES.fareFor(origin, S.fareTier) || 0, fare: -1, gap: -1, result: '' });
  if (S.finishPlanned) unplanFinish();   // the finish was already on the road: the return rides before it
}

export { die, lampHinted, levelDone, reset, resolveFork, setLampHinted, showSummary, start };
