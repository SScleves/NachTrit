// @ts-check
// Story payoff and stakes (PLAN.md phase 5, items 1, 2 and 5), the pure half: which lamp or shop sign a word flies to, which lamps
// stand dead when a ride starts, the halfway bus stop and its restart, and when a town plays at dawn. The game imports it
// (src/words.js, src/flow.js, src/plan.js, src/dawn.js); the unit tests import it in Node. No window, no THREE.

// ---------- words come back (item 1) ----------
// A ride starts with two lamps in three dead (the language took them), the first of every three lit, so the street is not black.
// A dawn ride starts with all of them lit and every shop sign worded.
/** @param {number} i the lamp's place in the ride's list of lamps */
export const deadAtStart = i => i % 3 !== 0;
// where a flying word may land: ahead of the bike (z negative), far enough that it lands before the lamp reaches him, near enough
// to be seen through the haze. zNear moves out with the speed: the lamp comes nearer while the word is in the air.
export const GLYPH = { flight: 1.1, zFar: -75, zNear: -16 };
/** @param {number} speed m/s */
export const glyphNear = speed => GLYPH.zNear - speed * GLYPH.flight;
/**
 * The lamp or sign a word flies to: the nearest one still dark (z closest to the bike) inside [zFar, zNear], not already the
 * target of a word in the air. When every one in range is lit, the nearest lit lamp flares instead (relight false), so a right
 * answer always shows. -1: nothing in range. No allocation: the game calls it once a right answer.
 * @param {{ z: number, lit: boolean, busy: boolean, lamp: boolean }[]} cands
 * @param {number} zNear @param {number} zFar
 * @returns {{ i: number, relight: boolean }}
 */
export function pickGlyphTarget(cands, zNear, zFar) {
  let dark = -1, lit = -1;
  for (let i = 0; i < cands.length; i++) {
    const c = cands[i]; if (c.busy || c.z > zNear || c.z < zFar) continue;
    if (!c.lit) { if (dark < 0 || c.z > cands[dark].z) dark = i; }
    else if (c.lamp && (lit < 0 || c.z > cands[lit].z)) lit = i;
  }
  return dark >= 0 ? { i: dark, relight: true } : { i: lit, relight: false };
}

// ---------- the checkpoint (item 5) ----------
// the bus stop stands after this many of the level's own deliveries (half, rounded up); returns and review forks do not count
/** @param {number} deliveries */
export const halfway = deliveries => Math.ceil(deliveries / 2);
// a dead lamp restarts from the bus stop once a ride, when he passed it, with half a lamp
export const CHECKPOINT = { lamp: 50, maxStars: 2 };
/** @param {{ passed: boolean, used: boolean } | null} cp */
export const canRestart = cp => !!cp && cp.passed && !cp.used;
/** stars a ride earns once it used the bus stop: two at most. @param {number} stars @param {boolean} used */
export const capStars = (stars, used) => used ? Math.min(stars, CHECKPOINT.maxStars) : stars;

// ---------- town dawn (item 2) ----------
/**
 * A town plays at dawn when every place in it has three stars: its level rides (bonus, trophy and practice rides have ids of
 * 1000 and up and do not count), none marked soon. A town with no places never dawns.
 * @param {{ id: number, soon?: boolean }[]} levels the town's levels
 * @param {Record<string, number>} stars the save's stars by level id
 */
export function townDawn(levels, stars) {
  let n = 0;
  for (const l of levels) { if (l.soon || l.id >= 1000) continue; n++; if ((stars[l.id] || 0) < 3) return false; }
  return n > 0;
}
// how a dawn ride looks: the haze lifts to the pale grey of concept image A (fog colour, thinner), the night depth the loop draws
// with stays at 0 (the lamp's own drain still follows the real night depth, so the ride plays the same), the sky dome and the
// hemisphere light brighter, every window lit. Numbers on what exists, not lights: src/loop.js applies them.
export const DAWN = { fog: 0x8e989f, fogThin: 0.72, sky: 1.75, hemi: 0.9, windows: 0.95 };

// ---------- keeping a seeded ride the same ----------
// three.js draws four Math.random numbers for the uuid of every object, material, texture and geometry it makes. What this phase
// builds (the glyphs, the dead lamp and blank sign materials, the bus stop) is built inside ownDraws, on a generator of its own,
// so the game's draws (the road, the dead, the wisps, the shuffles) come out the same with or without it. qa/ride.mjs depends on it.
let own = 0x2545f491;
const ownRandom = () => { own = (own + 0x9E3779B9) >>> 0; let t = own ^ (own >>> 16); t = Math.imul(t, 0x21f0aaad); t ^= t >>> 15; t = Math.imul(t, 0x735a2d97); t ^= t >>> 15; return (t >>> 0) / 4294967296; };
/** @template T @param {() => T} fn @returns {T} */
export function ownDraws(fn) {
  const keep = Math.random; Math.random = ownRandom;
  try { return fn(); } finally { Math.random = keep; }
}
