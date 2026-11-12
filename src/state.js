// The ride's state: S (mode, speed, lane, lamp, the objects in the road, the fares), the night depth, the current level L with
// its lanes and speeds, and what is saved: the one save (src/save.js, under nachtrit.save: stars, best scores, the flags, the
// settings, the ride counter and the learner model), read here once, written by persist(). The first dressing of the world,
// the polder, happens here as it always did.
import { nightAt } from './lamp.js?v=44';
import { loadSave, writeSave } from './save.js?v=44';
import { buildIndex, itemKey } from './learn.js?v=44';
import { entryText } from './forks.js?v=44';
import { BASE_SPEED, clamp, LANES3, MAX_SPEED } from './engine.js?v=44';
import { buildScenery, THEMES } from './scenery.js?v=44';
import './zombies.js?v=44';   // keeps the order the game's code runs in
import { TOWN_OF, townOpen, towns } from './main.js?v=44';   // later modules, through the hub

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
  // the learning core (PLAN.md 3a, 3d): the why card's time left, review road and the distance ridden on it
  whyT: 0, reviewRoad: [], reviewM: 0, onReview: false,
  // the learner model (phase 4): review items on this ride, keys noted this ride, the fare factor (2 on a trophy ride)
  due: [], noted: new Map(), fareK: 1,
};
// every write to the lane counts as a steer (keys, swipes, and the qa autopilots that set NR.lane): laneN releases the first gate's hold
{ let lane = S.lane; S.laneN = 0; Object.defineProperty(S, 'lane', { get() { return lane; }, set(v) { lane = v; S.laneN++; }, enumerable: true }); }
// how deep into the night we are: 0 at the start of a level, 1 at the end (endless: by distance)
const NIGHT_Q = new URLSearchParams(location.search).has('night') ? clamp(parseFloat(new URLSearchParams(location.search).get('night')) || 0, 0, 1) : null;   // ?night=0..1 holds the night depth (for measuring luma)
function nightDepth() { if (NIGHT_Q !== null) return NIGHT_Q; return nightAt(S.dist - S.reviewM, L && S.deliveriesTotal); }   // review road does not bring the dawn nearer
buildScenery(THEMES.polder);
let L = null;                 // current level, null = endless
let BASE = BASE_SPEED, MAXS = MAX_SPEED;
let LANE_X = LANES3;
// a ride and an intro shot set these (an imported binding is read-only)
function setL(lv) { L = lv; }
function setLaneX(x) { LANE_X = x; }
function setSpeeds(base, maxs) { BASE = base; MAXS = maxs; }
// ---------- the save ----------
const STORE = (() => { try { return window.localStorage; } catch (e) { return null; } })();
const SAVE = loadSave(STORE).save;   // the old keys (nachtrit.progress, .scores, .intro, ...) are merged in on every load, for one version
const progress = SAVE.stars, scores = SAVE.scores;   // the same objects as in the save: an import refills them in place
function persist() { return writeSave(STORE, SAVE); }
const saveProgress = persist, saveScores = persist;
const flag = f => SAVE.flags[f] || 0;
function setFlag(f, v) { if (flag(f) === v) return; SAVE.flags[f] = v; persist(); }
S.voice = SAVE.settings.voice !== 0;
// the learner model is noted fork by fork and written at the end of a ride; a page closed mid-ride keeps what it had
addEventListener('pagehide', persist);
addEventListener('visibilitychange', () => { if (document.hidden) persist(); });
// an item's key (src/learn.js): the voice hash of its Dutch text
const keyOf = nl => itemKey(nl, window.voiceId);
// every Dutch text of the content with its first level and town, built the first time it is needed (a ride with something
// due, the word book, the paste code), never for a first-time player's ride
let INDEX = null;
const contentIndex = () => INDEX || (INDEX = buildIndex(LEVELS, towns(), TOWN_OF, keyOf, entryText));
function districtStars(a) { return LEVELS.filter(l => l.act === a).reduce((n, l) => n + (progress[l.id] || 0), 0); }
const DISTRICT_NEED = 5; // stars in the previous district to open the next
// ?unlock=1 opens every town on this device, to look at the art (kept in the save's flags; ?unlock=0 locks them again). The stars are not touched.
const UNLOCK_ALL = (() => { const v = new URLSearchParams(location.search).get('unlock'); if (v === '1') setFlag('unlock', 1); else if (v === '0') setFlag('unlock', 0); return flag('unlock') === 1; })();
function unlocked(lv) { const t = towns().find(x => x.id === (lv.town || TOWN_OF(lv.id))); return t ? townOpen(t) : lv.act === 1; }

export { BASE, contentIndex, DISTRICT_NEED, flag, keyOf, L, LANE_X, MAXS, nightDepth, persist, progress, S, SAVE, saveProgress, saveScores, scores, setFlag,
  setL, setLaneX, setSpeeds, STORE, UNLOCK_ALL, unlocked };
