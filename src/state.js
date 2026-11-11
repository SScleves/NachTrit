// The ride's state: S (mode, speed, lane, lamp, the objects in the road, the fares), the night depth, the current level L with
// its lanes and speeds, and what is saved: stars (nachtrit.progress, numbers only), best scores and the unlocks. The first
// dressing of the world, the polder, happens here as it always did.
import { nightAt } from './lamp.js?v=39';
import { BASE_SPEED, clamp, LANES3, MAX_SPEED } from './engine.js?v=39';
import { buildScenery, THEMES } from './scenery.js?v=39';
import './zombies.js?v=39';   // keeps the order the game's code runs in
import { TOWN_OF, townOpen, towns } from './main.js?v=39';   // later modules, through the hub

// ---------- state ----------
const S = {
  mode: 'start',          // start | intro | ride | dying | dead
  t: 0, dist: 0, speed: BASE_SPEED, slow: 1, slowTarget: 1,
  lane: 1, x: 0, lean: 0,
  lamp: 70, souls: 0, streak: 0, wrongRow: 0, good: 0, bad: 0,
  objs: [], planCursor: 40, lastObstacleD: 0,
  activeFork: null, forkZoom: 0, speedNorm: 0,
  mistakes: [], introT: 0, dieT: 0, stumble: 0,
  voice: true, heartT: 0,
  sentencePool: [], curv: 0, curvTarget: 0, curvNextAt: 60, grade: 0, wordPool: [],
  // fares, all integer cents
  cents: 0, walletShown: 0, missed: 0, tips: 0, tikkie: 0, cleanRow: 0, tipN: 0, lastRefuse: '', riding: null, fareTier: 1, score: 0, fxT: 0,
  paid: 0, walletLast: 0, tickT: -1,
};
// every write to the lane counts as a steer (keys, swipes, and the qa autopilots that set NR.lane): laneN releases the first gate's hold
{ let lane = S.lane; S.laneN = 0; Object.defineProperty(S, 'lane', { get() { return lane; }, set(v) { lane = v; S.laneN++; }, enumerable: true }); }
// how deep into the night we are: 0 at the start of a level, 1 at the end (endless: by distance)
const NIGHT_Q = new URLSearchParams(location.search).has('night') ? clamp(parseFloat(new URLSearchParams(location.search).get('night')) || 0, 0, 1) : null;   // ?night=0..1 holds the night depth (for measuring luma)
function nightDepth() { if (NIGHT_Q !== null) return NIGHT_Q; return nightAt(S.dist, L && S.deliveriesTotal); }
buildScenery(THEMES.polder);
let L = null;                 // current level, null = endless
let BASE = BASE_SPEED, MAXS = MAX_SPEED;
let LANE_X = LANES3;
// a ride and an intro shot set these (an imported binding is read-only)
function setL(lv) { L = lv; }
function setLaneX(x) { LANE_X = x; }
function setSpeeds(base, maxs) { BASE = base; MAXS = maxs; }
let progress = {}; try { progress = JSON.parse(localStorage.getItem('nachtrit.progress') || '{}'); } catch (e) { progress = {}; }
function saveProgress() { try { localStorage.setItem('nachtrit.progress', JSON.stringify(progress)); } catch (e) {} }
// best score per level id (and 'endless'), its own key so nachtrit.progress stays stars only
let scores = {}; try { const raw = JSON.parse(localStorage.getItem('nachtrit.scores') || '{}'); if (raw && typeof raw === 'object') for (const k in raw) if (Number.isFinite(raw[k])) scores[k] = raw[k]; } catch (e) { scores = {}; }
function saveScores() { try { localStorage.setItem('nachtrit.scores', JSON.stringify(scores)); } catch (e) {} }
function districtStars(a) { return LEVELS.filter(l => l.act === a).reduce((n, l) => n + (progress[l.id] || 0), 0); }
const DISTRICT_NEED = 5; // stars in the previous district to open the next
// ?unlock=1 opens every town on this device, to look at the art (kept in nachtrit.unlock; ?unlock=0 locks them again). The stars are not touched.
const UNLOCK_ALL = (() => { const v = new URLSearchParams(location.search).get('unlock'); try { if (v === '1') localStorage.setItem('nachtrit.unlock', '1'); else if (v === '0') localStorage.removeItem('nachtrit.unlock'); return localStorage.getItem('nachtrit.unlock') === '1'; } catch (e) { return v === '1'; } })();
function unlocked(lv) { const t = towns().find(x => x.id === (lv.town || TOWN_OF(lv.id))); return t ? townOpen(t) : lv.act === 1; }

export { BASE, DISTRICT_NEED, L, LANE_X, MAXS, nightDepth, progress, S, saveProgress, saveScores, scores, setL, setLaneX, setSpeeds, UNLOCK_ALL,
  unlocked };
