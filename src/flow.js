// A ride from start to end: start() dresses the town and builds the level queue, reset() clears the road, the first-ride
// teaching and the lamp hint, die() and the summary card with stars and scores, and resolveFork, the verdict on each fork.
// The learning core (PLAN.md 3a, 3d) is here too: a missed item goes back in the queue (sendBack), a wrong answer gets the why
// card, every fork is noted for the end card's list of misses by rule (noteFork, missedHtml). Its pure rules: src/review.js.
// The learner model (PLAN.md phase 4, src/learn.js): a level ride counts in the save's ride counter, items due from earlier
// levels replace up to a quarter of its deliveries (addReview), each item's first try moves its box (noteLearn), and the
// save is written when the end card shows.
import { refuelRight, TUNE } from './lamp.js?v=43';
import { canRestart, capStars, CHECKPOINT } from './payoff.js?v=43';
import { itemToEntry, levelQueue } from './forks.js?v=43';
import { duePositions, noteItem, noteRule, reviewCap, selectDue } from './learn.js?v=43';
import { whyBudget } from './reading.js?v=43';
import { TASKS } from './tasks.js?v=43';
import { VOICES } from './voice.js?v=43';
import { groupMisses, markRight, returnSlot, shouldReturn, weakLine } from './review.js?v=43';
import { $, BASE_SPEED, clamp, FARES, LANES2, LANES3, MAX_SPEED, today } from './engine.js?v=43';
import { camera, scene } from './render.js?v=43';
import { setRoadLook } from './road.js?v=43';
import { PG } from './props.js?v=43';
import { setTownId, setTownStyle, townId, townStyleOf } from './furniture.js?v=43';
import { buildScenery, theme, THEMES } from './scenery.js?v=43';
import { bike, dropPassenger, follower, rackGhost, setFace, setRackGhost } from './rider.js?v=43';
import { BASE, contentIndex, flag, keyOf, L, LANE_X, MAXS, persist, progress, S, SAVE, saveProgress, scores, setFlag, setL, setLaneX, setSpeeds, unlocked } from './state.js?v=43';
import { placeStop, plan, unplanFinish } from './plan.js?v=43';
import { wordBack, wordsStart } from './words.js?v=43';
import { setDawn } from './dawn.js?v=43';
import { assembled, esc, fareRow, flash, hideCard, say, toast, whyCard } from './hud.js?v=43';
import { chime, initAudio } from './audio.js?v=43';
import { speak, speakSeq } from './speech.js?v=43';
import { G } from './signs.js?v=43';
import { introSeen, setIntroSeen, showIntro, showLevelIntro, startArt } from './intro.js?v=43';
import { openMap, openMission, pendingLevel, TOWN_OF, townAtDawn, towns } from './map.js?v=43';
import { handed, openPractice, paidLine, payFare, settleRide, whyLine } from './main.js?v=43';   // later modules, through the hub

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
  const town = L && towns().find(t => t.id === (L.town || TOWN_OF(L.id))), dawn = !!(L && !L.practice && townAtDawn(town));
  if (dawn) setDawn(town);   // every place in this town has three stars: it plays at dawn (src/dawn.js); buildScenery put the night back otherwise
  wordsStart(dawn);   // the street's lamps go out, its shop signs go blank: right answers give them back (src/words.js); at dawn they are all lit
  if (L) SAVE.ride++;   // the learner model counts rides, not days
  reset(); S.mode = 'intro'; S.introT = 0;
  if (dawn) S.dawnCard = town;   // the rumour, resolved, when the camera comes down (src/loop.js)
}
// the town's tier prices the rides; endless rides as tier 6
function fareTier() {
  if (!L) return 6;
  if (L.practice) return 1;   // a practice ride pays small fares
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
    whyT: 0, reviewRoad: [], reviewM: 0, onReview: false,
    // the learner model: items from earlier rides on this one (key, text, box, level, result), keys noted this ride, the fare factor
    due: [], noted: new Map(), fareK: (L && L.fareK) || 1,
    // words back (phase 5): one entry a right answer, what its word flew to (null: nothing in range)
    wordsBack: [],
    // the bus stop at halfway (phase 5): own entries planned, the checkpoint once placed (src/plan.js placeStop), the line after a restart
    ownPlanned: 0, cp: null, introLine: null });
  $('wallet').textContent = '€ 0,00'; $('walletfx').textContent = ''; $('walletfx').className = ''; $('walletpill').classList.remove('shake');
  follower.visible = false; follower.userData.glow.intensity = 0; if (rackGhost) { bike.remove(rackGhost); setRackGhost(null); }
  camera.position.set(0, 22, 14); camera.lookAt(0, 0, -30); camera.fov = 60; camera.updateProjectionMatrix();
  hideCard(); toast.style.opacity = 0; $('vignette').style.opacity = 0; $('lanes').style.opacity = 0;
  addReview();
  plan();
}
// spaced review (PLAN.md phase 4 point 3): up to a quarter of a level's deliveries become items due from earlier levels of the
// same or a lower tier, weakest box first, spread through the ride. They ride as returns do (the again tag, half fare, review
// road, never counted, never a lamp lost) and their first try moves their box. Nothing is due on a first ride, and with
// nothing due nothing here runs: no hash, no random draw
function addReview() {
  if (!L || L.id >= 1000 || L.practice || L.trophy) return;
  const cap = reviewCap(L.deliveries); let any = false; for (const k in SAVE.items) { any = true; break; }
  if (!cap || !any) return;
  const ix = contentIndex(), order = ix.levelOrder.get(L.id); if (order == null) return;
  const cands = []; for (const r of ix.rows) { if (r.order >= order) break; cands.push(r.key); }   // rows are in play order
  const keys = selectDue(SAVE.items, SAVE.ride, cands, cap, new Set(S.queue.map(e => keyOf(e.nl))));
  const at = duePositions(S.queue.length, keys.length);
  at.forEach((p, j) => {
    const row = ix.byKey.get(keys[j]), e = itemToEntry(row.item, row.level.items, LANE_X.length);
    S.queue[p] = Object.assign({}, e, { again: 1, due: true });
    S.due.push({ key: keys[j], nl: e.nl, box: SAVE.items[keys[j]][0], level: row.level.id, result: '' });
  });
  S.deliveriesTotal = L.deliveries - at.length;   // stars count the level's own deliveries
}
// the first three forks of a player's first ride teach the move (nachtrit.taught is set once they are done)
function taughtBefore() { return flag('taught') === 1; }
let lampHinted = flag('lamphint') === 1;
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
  if (L && won && !L.practice) {   // a practice ride gives no stars
    const ratio = S.delivered / S.deliveriesTotal;
    const three = L.deliveries >= 16 ? 0.95 : 1;   // long levels allow one miss for three stars
    stars = ratio >= three && S.lampMin >= 40 ? 3 : ratio >= 0.83 ? 2 : ratio >= 0.66 ? 1 : 0;
    stars = capStars(stars, !!(S.cp && S.cp.used));   // a ride that started again at the bus stop earns two stars at most
    if (stars > (progress[L.id] || 0)) { progress[L.id] = stars; saveProgress(); }
  }
  $('sumtitle').textContent = !L ? 'IT HAS YOU.' : !won ? 'IT HAS YOU.' : L.practice ? 'PRACTISED.' : stars ? 'DELIVERED.' : 'NOT ENOUGH.';
  $('stars').textContent = L && won && !L.practice ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '';
  $('sumline').textContent = !won ? (S.bad === 0 ? 'No mistakes. The lamp just ran out. Ride faster, collect the wisps.' : `${S.missList.length} mistake${S.missList.length === 1 ? '' : 's'} to practise.`)
    : L.practice ? 'A practice ride gives no stars. What you got right on the first try moves up in the word book.'
    : stars && S.cp && S.cp.used ? 'Delivered, after a restart at the bus stop. A ride that used the bus stop earns two stars at most.'
    : stars ? (stars === 3 ? 'Every delivery, lamp never below half. The dead are pleased.' : (L.deliveries >= 16 ? 'Delivered. Three stars allow one miss and need a healthy lamp.' : 'Delivered. Three stars need every one right with a healthy lamp.')) : `You need ${Math.ceil(S.deliveriesTotal * 0.66)} of ${S.deliveriesTotal} right for a star. Stars open the next town.`;
  $('again').textContent = L && won && stars ? 'Next place' : 'Again';
  const wl = [...S.met.entries()];
  $('s_words').innerHTML = wl.length ? `<div style="color:var(--dim);font-size:11px;letter-spacing:.12em;text-transform:uppercase">Words tonight · ${wl.filter(w => w[1].ok).length} of ${wl.length} right</div>`
    + wl.map(([nl, w]) => `<span class="${w.ok ? 'ok' : 'no'}">${w.ok ? '✓' : '✗'}</span> <b>${nl}</b> ${w.en}`).join(' · ') : '';
  $('log').value = S.mistakes.map(m => `- ${today()} — ${m.said} → ${m.should} → [[${m.note}]]`).join('\n') || '(no mistakes)';
  const missed = missedHtml(); $('s_missed').innerHTML = missed; $('summary').classList.toggle('hasmissed', !!missed);
  // money: score, best per level (levels only when home, endless on every death), the wallet line
  S.score = S.delivered * 100 + S.cents / 10 + Math.round(clamp(S.lampMin, 0, 100));
  const sk = L ? String(L.id) : 'endless';
  if ((!L || won) && !(L && L.practice) && S.score > (scores[sk] || 0)) scores[sk] = S.score;
  persist();   // stars, the best score and what this ride taught the learner model, in one write
  $('s_wallet').textContent = FARES.fmtEuro(S.cents); $('s_score').textContent = S.score; $('s_best').textContent = L && L.practice ? '–' : scores[sk] || 0;
  const f = FARES.fmtEuro;
  $('s_money').innerHTML = `<div>Fares ${f(S.paid)} · tips ${f(S.tips)} · Tikkie − ${f(S.tikkie)} · missed ${f(S.missed)}</div>`
    + (S.riding ? `<div>Niet afgeleverd · ${f(S.riding.fare)}</div>` : '') + (L && !won ? '<div>Score counts when you get home.</div>' : '')
    + (S.due.length ? `<div>From earlier rides: ${S.due.length} back for review, ${S.due.filter(d => d.result === 'right').length} right on the first try.</div>` : '');
  $('practice').style.display = L && S.missList.length ? '' : 'none';   // misses: a practice ride of the weakest items
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
$('practice').onclick = () => openPractice();
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
  if (gate.teach && ++S.taught >= 3) setFlag('taught', 1);
  const rule = RULES[fork.r] || { name: fork.r, note: fork.r };
  const done = fork.read || fork.idx === fork.st.forks.length - 1;
  if (ok) {
    if (back) S.learn.right++; else S.good++;
    S.streak++; S.wrongRow = 0; setFace('smug', 1.6);
    S.lamp = clamp(S.lamp + refuelRight(S.streak) + (gate.goEarly ? TUNE.fast : 0), 0, 100); S.speed = clamp(S.speed + 1.6, BASE, MAXS);
    flash('#f6e7b0', 0.35); chime(true);
    { const p = gate.posts.find(q => q.oi === fork.a); if (p) S.wordsBack.push(wordBack(fork.read ? fork.entry.nl : fork.o[fork.a], p.mesh, S.speed)); }   // the word flies to a dark lamp or a blank sign
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
  if (L && (!back || (fork.entry.due && !fork.entry.origin))) noteLearn(fork, ok, done);   // first rides and review, not returns
}
// the learner model: every fork's rule, and when an item is done its first try (all its forks right), once per item a ride
function noteLearn(fork, ok, done) {
  noteRule(SAVE.rules, fork.r || 'woord', ok);
  if (!done) return;
  const key = keyOf(fork.entry.nl); if (S.noted.has(key)) return;
  const right = fork.read ? ok : fork.st.wrong === 0;
  S.noted.set(key, { right, nl: fork.entry.nl, due: !!fork.entry.due }); noteItem(SAVE.items, key, right, SAVE.ride);
  if (fork.entry.due) { const d = S.due.find(x => x.key === key); if (d) d.result = right ? 'right' : 'wrong'; }
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

// ---------- the bus stop at halfway (PLAN.md phase 5 item 5; the rules in src/payoff.js) ----------
// He passed the bus stop: save the ride as it stands there. Every fork before the stop is answered by now (it stands after them);
// the entries already planned beyond it go back to the front of the queue, in road order, so a restart rides them again.
function passStop() {
  const cp = S.cp; if (!cp || cp.passed) return;
  const ahead = []; for (const o of S.objs) if (o.type === 'gate' && o.d > cp.d && !ahead.includes(o.gate.fork.entry)) ahead.push(o.gate.fork.entry);   // S.objs is in planned order
  cp.passed = true; cp.deliveredAt = S.delivered;
  cp.snap = { queue: ahead.concat(S.queue), plannedN: S.plannedN - ahead.length, ownPlanned: S.ownPlanned - ahead.filter(e => !e.again).length,
    reviewRoad: S.reviewRoad.filter(r => r[0] < cp.d).map(r => r.slice()), reviewM: S.reviewM, missN: new Map(S.missN),
    learn: { returns: S.learn.returns, right: S.learn.right, wrong: S.learn.wrong, logN: S.learn.log.length },
    n: { good: S.good, bad: S.bad, delivered: S.delivered, souls: S.souls, cents: S.cents, paid: S.paid, tips: S.tips, tikkie: S.tikkie, missed: S.missed, tipN: S.tipN, cleanRow: S.cleanRow } };
}
// the lamp died: once a ride, after the bus stop, he starts again just before it with half a lamp. What happened after the stop is
// taken back (deliveries, fares, returns queued); the misses he made stay on the end card and in the learner model, as they happened
function restartFromStop() {
  const cp = S.cp; if (!L || !canRestart(cp)) return false;
  const sn = cp.snap; cp.used = true; cp.restartAt = S.dist;
  for (const o of S.objs) if (o.mesh) { scene.remove(o.mesh); o.mesh.traverse(m => { if (m.material && m.material.map && !m.material.userData.shared) { m.material.map.dispose(); m.material.dispose(); } if (m.geometry && !Object.values(G).includes(m.geometry) && !Object.values(PG).includes(m.geometry)) m.geometry.dispose(); }); }
  Object.assign(S, sn.n, { objs: [], queue: sn.queue.slice(), plannedN: sn.plannedN, ownPlanned: sn.ownPlanned, reviewRoad: sn.reviewRoad, reviewM: sn.reviewM, missN: sn.missN,
    dist: cp.d - 30, planCursor: cp.d - 4, finishPlanned: false, lamp: CHECKPOINT.lamp, speed: BASE, slow: 1, slowTarget: 1, stumble: 0, held: false, streak: 0, wrongRow: 0,
    activeFork: null, forkZoom: 0, whyT: 0, onReview: false, riding: null, teachPlan: 0, dieT: 0, mode: 'intro', introT: 0,
    introLine: [/* voice */ 'Terug bij de halte.', `Half a lamp. Ride on from here: this ride can earn ${CHECKPOINT.maxStars} stars at most.`] });
  Object.assign(S.learn, { returns: sn.learn.returns, right: sn.learn.right, wrong: sn.learn.wrong }); S.learn.log.length = sn.learn.logN;
  follower.visible = false; follower.userData.glow.intensity = 0; if (rackGhost) { bike.remove(rackGhost); setRackGhost(null); }
  camera.position.set(0, 22, 14); camera.lookAt(0, 0, -30); camera.fov = 60; camera.updateProjectionMatrix();
  hideCard(); toast.style.opacity = 0; $('vignette').style.opacity = 0; $('lanes').style.opacity = 0; setFace('deadpan', 0.1, false);
  placeStop(cp.d, true);   // the stop stands where it stood, lit, already passed
  plan();
  return true;
}

export { die, lampHinted, levelDone, passStop, reset, resolveFork, restartFromStop, setLampHinted, showSummary, start };
