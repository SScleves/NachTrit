// The world map and the mission card: towns by tier (window.TOWNS, painted by map-art.js), which town is open and saved, the
// route board with the cyclist riding between towns, the de/het bonus level per town, the town card, and the mission card with
// its fares and the pictograms of its three words.
import { townDawn } from './payoff.js?v=44';
import { $, FARES } from './engine.js?v=44';
import { PICTO, PICTO_ALIAS } from './houses.js?v=44';
import { DISTRICT_NEED, progress, S, scores, UNLOCK_ALL } from './state.js?v=44';
import { audioCtx, initAudio } from './audio.js?v=44';
import { startArt } from './intro.js?v=44';
import './cine.js?v=44';   // keeps the order the game's code runs in
import { trophyLevel, warmUp } from './main.js?v=44';   // later modules, through the hub

// ---------- the world map ----------
const PLACES = [['thuis', 'Thuis'], ['winkels', 'De winkels'], ['eten', 'Eten en drinken'], ['station', 'Het station'], ['werk', 'Het werk'], ['sport', 'De sport'], ['mensen', 'De mensen'], ['eigen', 'Alleen hier'], ['practice', 'Practice'], ['trophy', 'Trophy']];
const TOWN_OF = id => id === 41 ? 'alblasserdam' : id <= 5 ? 'alblasserdam' : id <= 10 ? 'kinderdijk' : id <= 15 ? 'gouda' : id <= 20 ? 'utrecht' : id <= 30 ? 'rotterdam' : 'amsterdam';
const PLACE_OF = { 41: 'thuis', 1: 'thuis', 2: 'mensen', 3: 'thuis', 4: 'mensen', 5: 'winkels', 6: 'winkels', 7: 'eten', 8: 'thuis', 9: 'eten', 10: 'station', 11: 'werk', 12: 'station', 13: 'mensen', 14: 'winkels', 15: 'sport' };
const LL = (lon, lat) => [(lon - 3.3) / (7.2 - 3.3), 1 - (lat - 50.75) / (53.55 - 50.75)];
const TOWNS_FALLBACK = [
  { id: 'alblasserdam', name: 'Alblasserdam', tier: 1, cefr: 'A1', pos: LL(4.66, 51.87), blurb: 'Home. The dogs still need a walk.' },
  { id: 'kinderdijk', name: 'Kinderdijk en Dordrecht', tier: 2, cefr: 'A1', pos: LL(4.68, 51.83), blurb: 'Nineteen mills and the oldest city. The water never sleeps.' },
  { id: 'gouda', name: 'Gouda', tier: 3, cefr: 'A1-A2', pos: LL(4.71, 52.01), blurb: 'Cheese, stroopwafels, a town hall in the middle of the square.' },
  { id: 'utrecht', name: 'Utrecht', tier: 4, cefr: 'A2', pos: LL(5.12, 52.09), blurb: 'The Dom, the wharves, more bikes than people.' },
  { id: 'rotterdam', name: 'Rotterdam', tier: 5, cefr: 'A2-B1', pos: LL(4.48, 51.92), blurb: 'Big, loud, rebuilt. The harbour does not stop for the dead.' },
  { id: 'amsterdam', name: 'Amsterdam', tier: 6, cefr: 'B1-B2', pos: LL(4.9, 52.37), blurb: 'Canals, trams, tourists, bells. The hardest night.' },
];
function towns() { return (window.TOWNS && window.TOWNS.length ? window.TOWNS : TOWNS_FALLBACK).slice().sort((a, b) => a.tier - b.tier); }
function townLevels(t) { return LEVELS.filter(l => (l.town || TOWN_OF(l.id)) === t.id); }
function townStars(t) { return townLevels(t).reduce((n, l) => n + (progress[l.id] || 0), 0); }
// town dawn (PLAN.md phase 5 item 2): every place in the town has three stars. ?dawn=<town id> shows one town at dawn without the
// stars (on the map and on its rides, for looking at it); ?dawn=0 turns dawn off everywhere (qa/dt/gpu-shot.mjs seeds every star)
const DAWN_Q = new URLSearchParams(location.search).get('dawn');
function townAtDawn(t) { if (!t || DAWN_Q === '0') return false; if (DAWN_Q) return DAWN_Q === t.id; return townDawn(townLevels(t), progress); }
function townOpen(t) { if (t.tier === 1 || UNLOCK_ALL) return true; const prev = towns().find(x => x.tier === t.tier - 1); return prev ? townStars(prev) >= DISTRICT_NEED : false; }
// the route board: towns in tier order along roads over the real country, painted by map-art.js (window.NRMAP)
const CEFR_COL = { A1: '#8fd16a', 'A1-A2': '#c8d85a', A2: '#ffd27a', 'A2-B1': '#f0a050', B1: '#e87a3a', 'B1-B2': '#d9532a', B2: '#b8282a' };
let mapAt = 0, mapAnim = null, mapNodes = [], mapLay = null, mapBadges = [], mapFxOn = false;
const mapBike = { x: null, y: 0, flip: false, moving: false, cur: 0, from: -1, to: -1, side: 0 }; window.NRmapBike = mapBike;   // debug hook: where the rider is on the map
function mapF() { const W = $('world').clientWidth || innerWidth, H = $('world').clientHeight || innerHeight; return Math.max(8.5, Math.min(13, Math.min(W * 1.1, H) / 64)); }
function nodePositions(n) {   // real geography (lon/lat), a lens on the Randstad, then pushed apart so no badge or label overlaps
  const W = $('world').clientWidth || innerWidth, H = $('world').clientHeight || innerHeight, wb = $('world').getBoundingClientRect();
  const top = $('maphead').getBoundingClientRect().bottom - wb.top + 4, bot = $('mapfoot').getBoundingClientRect().top - wb.top - 2;
  const f = mapF(), box = { x: Math.max(8, W * 0.02), y: top, w: W - 2 * Math.max(8, W * 0.02), h: Math.max(120, bot - top) };
  mapLay = NRMAP.layout(W, H, box, towns().slice(0, n), f); return mapLay.nodes;
}
function townState(t) { return !townOpen(t) ? 'locked' : townStars(t) >= DISTRICT_NEED ? 'saved' : 'open'; }
function drawWorld() {
  const svg = $('nl'); const W = $('world').clientWidth || innerWidth, H = $('world').clientHeight || innerHeight;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.innerHTML = '';
  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const T = towns(); const pts = nodePositions(T.length); mapNodes = pts; const f = mapLay.f;
  const states = T.map(townState);
  NRMAP.paint($('nlart'), mapLay, T, states);   // the country, the roads and the towns, cached until the size or the progress changes
  const openIdx = T.map((t, i) => townOpen(t) ? i : -1).filter(i => i >= 0); if (!openIdx.includes(mapAt)) mapAt = openIdx[openIdx.length - 1] || 0;
  const defs = el('defs', {}); defs.innerHTML = NRMAP.defs + '<radialGradient id="nrdawn"><stop offset="0" stop-color="#fff6d8" stop-opacity="1"/><stop offset=".3" stop-color="#ffe0a0" stop-opacity=".8"/><stop offset=".6" stop-color="#ffc060" stop-opacity=".32"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>'; svg.appendChild(defs);
  mapBadges = [];
  T.forEach((t, i) => {
    const [x, y] = pts[i]; const st = states[i]; const stars = townStars(t); const col = CEFR_COL[t.cefr] || '#e8e4d8';
    const g = el('g', { class: 'town' + (st === 'locked' ? ' locked' : ''), transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` });
    g.appendChild(el('circle', { r: f * 2.6, fill: 'transparent' }));
    if (townAtDawn(t)) g.appendChild(el('circle', { r: f * 5.5, fill: 'url(#nrdawn)', class: 'dawnglow' }));   // a town at dawn glows on the map
    const b = el('g', {}); g.appendChild(b); mapBadges.push({ b, t, st, col });
    const label = el('text', { y: f * 2.75, 'text-anchor': 'middle', class: 'nm', style: `font-size:${f}px` }); label.textContent = NRMAP.label(t); g.appendChild(label);
    const band = el('text', { y: f * 3.95, 'text-anchor': 'middle', class: 'band', style: `font-size:${(f * 0.88).toFixed(1)}px;fill:${st === 'locked' ? '#aab4c2' : col}` }); band.textContent = t.cefr + (st !== 'locked' && stars ? ' · ★' + stars : '') + (townAtDawn(t) ? ' · dawn' : ''); g.appendChild(band);
    g.onclick = () => rideTo(i);
    svg.appendChild(g);
  });
  // until the first town is saved, the endless night is a quiet text link, not the biggest thing on the screen
  $('endless').classList.toggle('aslink', !states.includes('saved'));
  if (mapAnim) { cancelAnimationFrame(mapAnim); mapAnim = null; }
  mapBike.from = mapBike.to = -1; placeBike(mapAt); mapFxStart();
}
function markCurrent(cur) { mapBadges.forEach(({ b, t, st, col }, i) => { b.innerHTML = NRMAP.badge(t, i, st, i === cur, mapLay.f, col); }); }
function segLen(i) { return mapLay ? (mapLay.route.nodeS[i] || 0) : 0; }   // road length from the first town to town i
function bikeRest(i, side) {   // where the bike waits at town i: on the road just outside the badge, on the side it came in; null when both sides run under the label
  const R = mapLay.route, f = mapLay.f, s = segLen(i), n = mapLay.nodes[i], B = mapLay.blk[i];
  const sides = [side || (i > 0 ? -1 : 1), -(side || (i > 0 ? -1 : 1))].filter(d => (d < 0 && i > 0) || (d > 0 && i < R.nodeS.length - 1));
  for (const d of sides) { const p = NRMAP.at(R, s + d * f * 2.7); if (!(Math.abs(p.x - n[0]) < B.w / 2 && p.y > n[1] + f * 0.6)) return s + d * f * 2.7; }
  return null;
}
function placeBike(i, s, dir) {   // at rest at town i, or riding at arc length s in direction dir
  if (!mapLay || !mapNodes.length) return;
  const rest = s == null;
  if (rest) {
    s = bikeRest(i, mapBike.side); markCurrent(i);
    if (s == null) { const n = mapLay.nodes[i], f = mapLay.f; Object.assign(mapBike, { x: n[0] + f * 2.6, y: n[1] + f * 0.55, flip: true, moving: false, cur: i }); return; }   // beside the badge, facing it
    dir = s <= segLen(i) ? 1 : -1;
  }
  const p = NRMAP.at(mapLay.route, s);
  mapBike.x = p.x; mapBike.y = p.y; mapBike.flip = p.dx * dir < 0; mapBike.moving = !rest; mapBike.cur = rest ? i : -1;
}
function mapFxStart() {   // the only animation on the map: glow pulse, road lamps, the lighthouse and the cyclist
  if (mapFxOn) return; mapFxOn = true; let last = 0;
  const tick = now => {
    if ($('map').style.display === 'none') { mapFxOn = false; return; }
    if (mapBike.moving || now - last > 32) { last = now; NRMAP.fx($('nlfx'), mapLay, now / 1000, mapBike); }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
let _mapResize = 0;
addEventListener('resize', () => { clearTimeout(_mapResize); _mapResize = setTimeout(() => { if ($('map').style.display !== 'none' && !mapAnim) drawWorld(); }, 150); });
function rideTo(target) {   // ride the road to an open town, through the towns between, then go in
  const T = towns(); if (!townOpen(T[target])) { openTown(T[target]); return; }
  if (mapAnim) return;
  if (target === mapAt) { openTown(T[target]); return; }
  const f = mapLay.f, dir = target > mapAt ? 1 : -1, r0 = bikeRest(mapAt, mapBike.side), r1 = bikeRest(target, -dir), s0 = r0 == null ? segLen(mapAt) : r0, s1 = r1 == null ? segLen(target) : r1;
  const dur = Math.min(4500, Math.max(800, Math.abs(s1 - s0) / (f * 0.04))), t0 = performance.now();
  mapBike.from = mapAt; mapBike.to = target; markCurrent(-1);
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    placeBike(mapAt, s0 + (s1 - s0) * e, dir);
    if (k >= 1) { mapAt = target; mapAnim = null; mapBike.side = -dir; mapBike.from = mapBike.to = -1; placeBike(target); openTown(T[target]); return; }
    mapAnim = requestAnimationFrame(step);
  };
  closeTown();
  mapAnim = requestAnimationFrame(step);
}
addEventListener('keydown', e => {
  if ($('map').style.display === 'none' || S.mode !== 'start' || $('book').style.display !== 'none') return;
  const T = towns();
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { const n = T.findIndex((t, i) => i > mapAt && townOpen(t)); if (n >= 0) rideTo(n); e.preventDefault(); }
  else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { let n = -1; for (let i = mapAt - 1; i >= 0; i--) if (townOpen(T[i])) { n = i; break; } if (n >= 0) rideTo(n); e.preventDefault(); }
  else if (e.key === 'Enter' || e.key === ' ') {
    const a = document.activeElement, inCard = townCardUp && a && a.tagName === 'BUTTON' && $('town').contains(a) && a.id !== 't_close';
    if (townCardUp && (inCard || townNext)) (inCard ? a : townNext).click(); else openTown(T[mapAt]);
    e.preventDefault();
  }
  else if (e.key === 'Escape' && townCardUp) closeTown();
});
// a de/het bonus level per town, built from every noun with an article in that town and the towns before it
function dehetBonus(t) {
  const seen = new Map();
  for (const lv of LEVELS) {
    if (lv.soon || !lv.items) continue; const lt = towns().find(x => x.id === (lv.town || TOWN_OF(lv.id))); if (!lt || lt.tier > t.tier) continue;
    for (const it of lv.items) {
      const nl = it.dehet ? `${it.art} ${it.nl}` : it.nl; const en = it.dehet ? it.en : (it.w || it.en); if (!nl || !en) continue;
      const m = /^(de|het)\s+(\S.*)$/.exec(nl); if (!m || /^\d/.test(en)) continue;
      if (!seen.has(m[2])) seen.set(m[2], { dehet: true, nl: m[2], art: m[1], en, w: it.w && it.wrong ? '' : (it.w || '') });
    }
  }
  const items = [...seen.values()];
  const tierKnobs = { 1: { lanes: 2, speed: 12, forkSlow: 0.45 }, 2: { lanes: 2, speed: 13, forkSlow: 0.4 }, 3: { lanes: 2, speed: 14, forkSlow: 0.35 } }[t.tier] || { lanes: 2, speed: 15, forkSlow: 0.3 };
  return { id: 1000 + t.tier, act: t.tier, name: 'De of het', theme: 'street', town: t.id, place: 'bonus', ...tierKnobs, maxSpeed: tierKnobs.speed + 3, ramp: true, lampDecay: 0.4 + t.tier * 0.05, hint: null, obstacles: 'puddles', filler: [14, 20], deliveries: Math.min(24, Math.max(12, Math.floor(items.length / 2))), cefr: t.cefr, maxWords: 2,
    intro: `${items.length} nouns from ${t.name} and everything before it. De left, het right. There is still no rule.`, introNl: `${items.length} woorden uit ${t.name} en alles daarvoor. De links, het rechts. Er is nog steeds geen regel.`,
    mission: { where: `Every door in ${t.name}.`, carry: 'A roll of labels. Half say de, half say het.', want: 'The dead hold up a thing. Steer left for de, right for het. Fast, no hints.' },
    items };
}
function openTown(t) {
  const open = townOpen(t);
  { const i = towns().findIndex(x => x.id === t.id); if (open && i >= 0 && i !== mapAt && !mapAnim && mapLay) { mapAt = i; mapBike.side = 0; placeBike(i); } }   // an open town opened directly (a link, ?map=id): the rider is there
  $('t_tier').textContent = `Tier ${t.tier} · ${t.cefr}` + (open ? '' : ` · ${Math.max(0, DISTRICT_NEED - townStars(towns().find(x => x.tier === t.tier - 1) || t))} more stars in the town before`);
  $('t_name').textContent = t.name; $('t_blurb').textContent = t.blurb || ''; $('t_blurbnl').innerHTML = (t.blurbNl || '') + (t.rumour ? `<div style="margin-top:6px;color:#9fb0cc;font-style:normal"><span style="color:var(--dim);font-size:11px;letter-spacing:.12em;text-transform:uppercase">What they say here</span><br>${t.rumour}<br><i>${t.rumourNl}</i></div>` : '');
  // one list in story order: what is done collapses to a row of stars, the first place not played yet is lit and focused so
  // Enter rides it, the rest follow quietly; places that do not exist yet ("Alleen hier" in most towns) are not shown
  const box = $('t_places'); box.innerHTML = '';
  const rows = []; for (const [pid, pname] of PLACES) for (const l of townLevels(t)) if ((l.place || PLACE_OF[l.id]) === pid && !l.soon) rows.push({ l, pname });
  const bonus = dehetBonus(t); rows.push({ l: bonus, pname: 'Bonus', bonus: true });
  const trophy = townStars(t) >= DISTRICT_NEED && trophyLevel(t); if (trophy) rows.push({ l: trophy, pname: 'Trophy', bonus: true, trophy: true });   // a saved town: one ride through all of it
  const stars = n => '★'.repeat(n) + '☆'.repeat(3 - n);
  const done = rows.filter(r => progress[r.l.id] > 0), todo = rows.filter(r => !(progress[r.l.id] > 0));
  if (done.length) {
    const strip = document.createElement('div'); strip.className = 'tdone';
    for (const r of done) {
      const b = document.createElement('button'); b.className = 'star'; b.title = `${r.pname} · ${r.l.name}` + (scores[r.l.id] ? ` · best ${scores[r.l.id]}` : '');
      b.innerHTML = `${stars(progress[r.l.id])}<span>${r.l.name}</span>`; b.onclick = () => openMission(r.l); strip.appendChild(b);
    }
    box.appendChild(strip);
  }
  const tier = t.tier, later = document.createElement('div'); later.className = 'tlater'; townNext = null;
  todo.forEach((r, i) => {
    const b = document.createElement('button'), next = open && i === 0, words = r.trophy ? `, ${r.l.deliveries} of ${r.l.items.length}` : r.bonus ? `, ${r.l.items.length} words` : '';
    b.className = 'place' + (next ? ' next' : ' later') + (r.bonus ? ' bonus' : '') + (open ? '' : ' locked');
    b.innerHTML = next
      ? `<small>${r.pname}${r.bonus ? '' : ' · next'}</small><b>${r.l.name}${words}</b><span class="go">${r.l.mission ? r.l.mission.where : ''}${missionFares(r.l, tier) ? ` <i>${missionFares(r.l, tier)}</i>` : ''}</span>`
      : `<small>${r.pname}</small>${r.l.name}${words}`;
    if (open) b.onclick = () => openMission(r.l); else b.disabled = true;
    if (next) townNext = b;
    (next ? box : later).appendChild(b);
  });
  if (later.children.length) box.appendChild(later);
  $('town').style.transform = 'translate(-50%,0)'; townCardUp = true; $('town').scrollTop = 0;
  if (townNext) townNext.focus({ preventScroll: true });
}
let townNext = null, townCardUp = false;
function closeTown() { $('town').style.transform = 'translate(-50%,105%)'; townCardUp = false; if (document.activeElement && $('town').contains(document.activeElement)) document.activeElement.blur(); }
$('t_close').onclick = closeTown;

function openMap() {
  startArt.off(); warmUp(); initAudio(); if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  for (const id of ['start', 'summary', 'mission']) $(id).style.display = 'none';
  $('map').style.display = 'flex'; drawWorld(); closeTown();
  S.mode = 'start';
}
let pendingLevel = null;
function openMission(lv) {
  pendingLevel = lv; $('map').style.display = 'none'; townCardUp = false;
  const t = towns().find(x => x.id === (lv.town || TOWN_OF(lv.id))); const pl = PLACES.find(p => p[0] === (lv.place || PLACE_OF[lv.id]));
  $('m_act').textContent = `${t ? t.name : ''} · ${pl ? pl[1] : ''} · tier ${t ? t.tier : lv.act}`; $('m_name').textContent = lv.name;
  $('m_fare').textContent = missionFares(lv, lv.practice ? 1 : t ? t.tier : (lv.act || 1));
  $('m_lines').innerHTML = `<div>📍 ${lv.mission.where}</div><div>📦 ${lv.mission.carry}</div><div>👻 ${lv.mission.want}</div>`;
  // three words as a teaser, the new ones first (not met on a road already starred); the full list comes at the end of the ride
  const met = new Set(); for (const l of LEVELS) if (progress[l.id] > 0 && l.id !== lv.id && l.items) for (const i of l.items) if (i.nl) met.add(i.nl);
  const cand = lv.place === 'bonus' ? [] : lv.items.filter(i => i.w && i.nl && !/^\d+$/.test(i.w)).filter((v, i, a) => a.findIndex(x => x.nl === v.nl) === i);
  const fresh = lv.practice || lv.trophy ? [] : cand.filter(i => !met.has(i.nl)), three = (fresh.length ? fresh : cand).slice(0, 3);
  $('m_words').innerHTML = three.length ? `<div style="color:var(--dim);font-size:11px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;text-align:center">${fresh.length ? 'New tonight' : 'Tonight'}</div><div class="wchips">`
    + three.map(i => `<div class="wchip"><span class="pic">${pictogram(i.nl)}</span><div><b>${i.nl}</b><span>${i.w}</span></div></div>`).join('') + '</div>' : '';
  $('mission').style.display = 'flex'; $('mission').scrollTop = 0;
}
// 'Fares here € 1,00 to € 2,90 · best 1284': every fare on this road, signposts and look forks included
function missionFares(lv, tier) {
  const fares = (lv.items || []).map(i => FARES.fareFor(i, tier) * (lv.fareK || 1)).filter(f => f > 0);
  if (!fares.length) return '';
  const lo = Math.min(...fares), hi = Math.max(...fares), best = scores[lv.id];
  return 'Fares here ' + (lo === hi ? FARES.fmtEuro(lo) + ' each' : FARES.fmtEuro(lo) + ' to ' + FARES.fmtEuro(hi)) + (best ? ' · best ' + best : '');
}
// pictograms for the mission card's three words: the game's own drawn pictograms (PICTO, the graffiti ones), painted once per word
const pictoCache = {};
function pictogram(nl) {
  const bare = String(nl).replace(/^(de|het|een)\s+/i, '').toLowerCase().trim(), key = PICTO[bare] ? bare : PICTO_ALIAS[bare];
  if (!key) return '<span style="color:var(--dim)">·</span>';
  if (!pictoCache[key]) { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); g.scale(0.5, 0.5); g.fillStyle = g.strokeStyle = '#ffd27a'; g.lineCap = 'round'; PICTO[key](g); pictoCache[key] = c.toDataURL(); }
  return `<img src="${pictoCache[key]}" width="32" height="32" alt="">`;
}

export { openMap, openMission, openTown, pendingLevel, pictogram, TOWN_OF, townAtDawn, townOpen, towns };
