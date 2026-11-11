// @ts-check
// The one save (PLAN.md phase 4 point 1): everything the game keeps about a player, in one versioned object under
// nachtrit.save. Stars and best scores (until NR_VERSION 42 in nachtrit.progress and nachtrit.scores), the one-time flags
// (intro seen, first ride taught, go key known, lamp hint, unlock, lost pictures), the settings, the ride counter, the
// learner model (one short array per item, src/learn.js) and the rule tallies.
// Pure: no window, no localStorage of its own. The game passes window.localStorage in (src/state.js); the unit tests pass a
// Map. The old keys are read on every load and merged in (the higher number wins), and written next to the save, so a
// player who goes back to an older page keeps his stars. Drop that mirror one version after this one (BACKLOG A4).
// Export: a JSON file (the save as it is) and a paste code (packed, deflated, base64url; encodeCode, decodeCode).

export const SAVE_KEY = 'nachtrit.save';
export const SAVE_VERSION = 1;
/** the keys the game used before the save, and the flag each one became */
export const OLD = { progress: 'nachtrit.progress', scores: 'nachtrit.scores', intro: 'nachtrit.intro', taught: 'nachtrit.taught', go: 'nachtrit.go',
  lamphint: 'nachtrit.lamphint', unlock: 'nachtrit.unlock', lost: 'nachtrit.lost' };
/** the flags: intro 1 = the short intro seen, 2 = the full one; lost counts the pictures the graphics card dropped; the rest 0 or 1 */
export const FLAGS = ['intro', 'taught', 'go', 'lamphint', 'unlock', 'lost'];

/**
 * @typedef {{ v: number, ride: number, stars: Object<string, number>, scores: Object<string, number>, flags: Object<string, number>,
 *   settings: Object<string, number>, items: Object<string, number[]>, rules: Object<string, number[]> }} Save
 *   items: key (src/learn.js itemKey) -> [box 1..5, seen, right on the first try, last ride]; rules: rule id -> [seen, right]
 * @typedef {{ getItem(k: string): string | null, setItem(k: string, v: string): void, removeItem(k: string): void }} Store
 */

/** @returns {Save} */
export const emptySave = () => ({ v: SAVE_VERSION, ride: 0, stars: {}, scores: {}, flags: {}, settings: {}, items: {}, rules: {} });

const isObj = x => !!x && typeof x === 'object' && !Array.isArray(x);
const nonNeg = x => typeof x === 'number' && Number.isFinite(x) && x >= 0;
const count = x => nonNeg(x) && Number.isInteger(x);
/** a map of numbers, junk dropped @param {any} o @param {(x: number) => boolean} ok */
function numMap(o, ok = nonNeg) {
  /** @type {Object<string, number>} */ const out = {};
  if (isObj(o)) for (const k of Object.keys(o)) if (ok(o[k])) out[k] = o[k];
  return out;
}
const KEY_RE = /^[0-9a-z]{1,8}$/, RULE_RE = /^[\w-]{1,24}$/;

/** a save as it came from storage, a file or a code, made safe: unknown top-level fields are kept (a newer version's), the
 * known ones are checked field by field and junk is dropped
 * @param {any} raw @returns {Save} */
export function normalize(raw) {
  const s = Object.assign(emptySave(), isObj(raw) ? raw : {});
  s.v = count(s.v) && s.v >= 1 ? s.v : SAVE_VERSION;
  s.ride = count(s.ride) ? s.ride : 0;
  s.stars = numMap(s.stars, x => count(x) && x <= 3);
  s.scores = numMap(s.scores);
  s.flags = numMap(s.flags, count);
  s.settings = numMap(s.settings);
  /** @type {Object<string, number[]>} */ const items = {};
  if (isObj(raw && raw.items)) for (const k of Object.keys(raw.items)) {
    const r = raw.items[k];
    if (!KEY_RE.test(k) || !Array.isArray(r) || r.length < 4 || !r.slice(0, 4).every(count)) continue;
    items[k] = [Math.min(5, Math.max(1, r[0])), r[1], Math.min(r[1], r[2]), r[3]];
  }
  s.items = items;
  /** @type {Object<string, number[]>} */ const rules = {};
  if (isObj(raw && raw.rules)) for (const k of Object.keys(raw.rules)) {
    const r = raw.rules[k];
    if (RULE_RE.test(k) && Array.isArray(r) && r.length >= 2 && count(r[0]) && count(r[1])) rules[k] = [r[0], Math.min(r[0], r[1])];
  }
  s.rules = rules;
  return s;
}

/** what the old keys hold, as a save (stars, scores, flags; nothing else was kept before)
 * @param {(k: string) => string | null} get @returns {Save} */
export function fromOld(get) {
  const s = emptySave(), json = k => { try { return JSON.parse(get(k) || 'null'); } catch (e) { return null; } };
  s.stars = numMap(json(OLD.progress), x => count(x) && x <= 3);
  s.scores = numMap(json(OLD.scores));
  const intro = get(OLD.intro); if (intro) s.flags.intro = intro === 'full' ? 2 : 1;   // 'short', 'full', or '1' from the qa tools
  for (const f of ['taught', 'go', 'lamphint', 'unlock']) if (get(OLD[f]) === '1') s.flags[f] = 1;
  const lost = Math.floor(+(get(OLD.lost) || 0)); if (lost > 0) s.flags.lost = lost;
  return s;
}

/** the old keys merged into a save: per level the higher stars and score, per flag the higher number. a wins everything else
 * @param {Save} a @param {Save} b @returns {Save} */
export function mergeOld(a, b) {
  const s = Object.assign({}, a, { stars: Object.assign({}, a.stars), scores: Object.assign({}, a.scores), flags: Object.assign({}, a.flags) });
  for (const k in b.stars) s.stars[k] = Math.max(s.stars[k] || 0, b.stars[k]);
  for (const k in b.scores) s.scores[k] = Math.max(s.scores[k] || 0, b.scores[k]);
  for (const k in b.flags) s.flags[k] = Math.max(s.flags[k] || 0, b.flags[k]);
  return s;
}

/** read the save: nachtrit.save if there is one, with whatever the old keys hold merged in. A storage that throws (a private
 * window) gives an empty save. migrated: there was no save yet and the old keys had something
 * @param {Store | null} store @returns {{ save: Save, migrated: boolean }} */
export function loadSave(store) {
  const get = k => { try { return store ? store.getItem(k) : null; } catch (e) { return null; } };
  let raw = null; try { raw = JSON.parse(get(SAVE_KEY) || 'null'); } catch (e) { raw = null; }
  const old = fromOld(get), had = isObj(raw);
  const oldHas = Object.keys(old.stars).length + Object.keys(old.scores).length + Object.keys(old.flags).length > 0;
  return { save: mergeOld(had ? normalize(raw) : emptySave(), old), migrated: !had && oldHas };
}

/** write the save, and the old keys next to it for one version (an older page still reads them). false when storage refused
 * @param {Store | null} store @param {Save} s */
export function writeSave(store, s) {
  if (!store) return false;
  try {
    store.setItem(SAVE_KEY, JSON.stringify(s));
    store.setItem(OLD.progress, JSON.stringify(s.stars)); store.setItem(OLD.scores, JSON.stringify(s.scores));
    for (const f of FLAGS) {
      const v = s.flags[f] || 0;
      if (!v) store.removeItem(OLD[f]);
      else store.setItem(OLD[f], f === 'intro' ? (v === 2 ? 'full' : 'short') : f === 'lost' ? String(v) : '1');
    }
    return true;
  } catch (e) { return false; }
}

/** how many bytes the save takes in storage (UTF-16 in most browsers: twice this) @param {Save} s */
export const savedBytes = s => JSON.stringify(s).length;

// ---------- the file ----------
/** the export file: the save as it is, with a header that says what it is @param {Save} s */
export const toFile = s => JSON.stringify({ game: 'nachtrit', what: 'save', v: s.v, save: s });

/** a save from a file's text; throws an Error with a plain sentence when it is not one @param {string} text @returns {Save} */
export function fromFile(text) {
  let o; try { o = JSON.parse(String(text)); } catch (e) { throw new Error('This file is not a Nachtrit save.'); }
  if (isObj(o) && o.game === 'nachtrit' && isObj(o.save)) return normalize(o.save);
  if (isObj(o) && count(o.v) && isObj(o.stars)) return normalize(o);   // the bare save object
  throw new Error('This file is not a Nachtrit save.');
}

// ---------- the paste code ----------
// The code packs the save into bytes, deflates them and writes them as base64url after "NR1z." (or "NR1r." when the browser
// cannot deflate). Numbers are varints; a number that is not a whole number >= 0 is written as a float, so nothing is
// rounded. Items whose key is in this game's content go in as one bit each in a bitmap over the content's sorted keys, then
// their boxes, seen, right and last ride as columns (that is what makes the code short); other keys go in whole. The
// bitmap only means something with the same content, so the code carries the content's size and fingerprint, and a
// device with other content refuses it rather than mix the words up. A checksum catches a code cut short.

class Out {
  constructor() { /** @type {number[]} */ this.b = []; }
  /** @param {number} n */ uv(n) { for (;;) { const low = n % 128; n = Math.floor(n / 128); if (n === 0) { this.b.push(low); return; } this.b.push(low | 128); } }
  /** @param {number} x */ num(x) {
    if (Number.isInteger(x) && x >= 0 && x <= Number.MAX_SAFE_INTEGER / 2) { this.uv(x * 2); return; }
    this.uv(1); const f = new DataView(new ArrayBuffer(8)); f.setFloat64(0, x); for (let i = 0; i < 8; i++) this.b.push(f.getUint8(i));
  }
  /** @param {string} s */ str(s) { const u = new TextEncoder().encode(s); this.uv(u.length); for (const c of u) this.b.push(c); }
  /** @param {Object<string, number>} m */ map(m) { const k = Object.keys(m); this.uv(k.length); for (const x of k) { this.str(x); this.num(m[x]); } }
}
class In {
  /** @param {Uint8Array} b */ constructor(b) { this.b = b; this.i = 0; }
  byte() { if (this.i >= this.b.length) throw new Error('short'); return this.b[this.i++]; }
  uv() { let n = 0, m = 1; for (;;) { const c = this.byte(); n += (c & 127) * m; if (c < 128) return n; m *= 128; if (m > 2 ** 56) throw new Error('varint'); } }
  num() { const v = this.uv(); if (v !== 1) return v / 2; const f = new DataView(new ArrayBuffer(8)); for (let i = 0; i < 8; i++) f.setUint8(i, this.byte()); return f.getFloat64(0); }
  str() { const n = this.uv(); if (this.i + n > this.b.length) throw new Error('short'); const s = new TextDecoder().decode(this.b.subarray(this.i, this.i + n)); this.i += n; return s; }
  /** @returns {Object<string, number>} */
  map() {
    const n = this.uv(), m = /** @type {Object<string, number>} */ ({});
    for (let k = 0; k < n; k++) { const key = this.str(); m[key] = this.num(); }
    return m;
  }
}
/** FNV-1a, 32 bits: the code's checksum and the content's fingerprint @param {ArrayLike<number> | string} x */
export function fnv(x) {
  let h = 0x811c9dc5;
  for (let i = 0; i < x.length; i++) { h ^= typeof x === 'string' ? x.charCodeAt(i) : x[i]; h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}
/** the content's fingerprint: its sorted item keys @param {string[]} keys */
export const contentPrint = keys => fnv(keys.join(','));

/** @param {Uint8Array} b @param {string} how */
async function pipe(b, how) {
  const CS = how === 'deflate' ? globalThis.CompressionStream : globalThis.DecompressionStream;
  const s = new Blob([/** @type {BlobPart} */ (/** @type {unknown} */ (b))]).stream().pipeThrough(new CS('deflate'));
  return new Uint8Array(await new Response(s).arrayBuffer());
}
const b64u = (/** @type {Uint8Array} */ b) => { let s = ''; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, Array.from(b.subarray(i, i + 8192))); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const unb64u = (/** @type {string} */ s) => { const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/')); const b = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i); return b; };

/** the save as a paste code. contentKeys: every item key of this game's content, sorted (src/learn.js buildIndex)
 * @param {Save} s @param {string[]} contentKeys @returns {Promise<string>} */
export async function encodeCode(s, contentKeys) {
  const o = new Out();
  o.uv(s.v); o.num(s.ride); o.map(s.stars); o.map(s.scores); o.map(s.flags); o.map(s.settings);
  o.uv(Object.keys(s.rules).length); for (const k in s.rules) { o.str(k); o.num(s.rules[k][0]); o.num(s.rules[k][1]); }
  const n = contentKeys.length, at = new Map(contentKeys.map((k, i) => [k, i])), bits = new Uint8Array(Math.ceil(n / 8)), inside = [], orphans = [];
  for (const k in s.items) { const i = at.get(k); if (i === undefined) orphans.push(k); else { bits[i >> 3] |= 1 << (i & 7); inside.push(i); } }
  inside.sort((a, b) => a - b);
  o.uv(n); o.uv(contentPrint(contentKeys));
  for (const c of bits) o.b.push(c);
  const cols = inside.map(i => s.items[contentKeys[i]]);
  for (const r of cols) o.b.push(r[0]);
  for (let f = 1; f < 4; f++) for (const r of cols) o.num(r[f]);
  o.uv(orphans.length); for (const k of orphans) { o.str(k); for (const x of s.items[k]) o.num(x); }
  const body = Uint8Array.from(o.b), sum = fnv(body), all = new Uint8Array(body.length + 4);
  all.set(body); new DataView(all.buffer).setUint32(body.length, sum);
  if (typeof globalThis.CompressionStream === 'function') return 'NR1z.' + b64u(await pipe(all, 'deflate'));
  return 'NR1r.' + b64u(all);
}

/** a save from a paste code; throws an Error with a plain sentence when the code cannot be used
 * @param {string} code @param {string[]} contentKeys @returns {Promise<Save>} */
export async function decodeCode(code, contentKeys) {
  const c = String(code || '').replace(/\s+/g, ''), m = /^NR1([zr])\.([A-Za-z0-9_-]+)$/.exec(c);
  if (!m) throw new Error('This is not a Nachtrit code. It starts with NR1.');
  let all;
  try { all = unb64u(m[2]); if (m[1] === 'z') all = await pipe(all, 'inflate'); } catch (e) { throw new Error('This code is incomplete or damaged. Copy all of it and try again.'); }
  if (all.length < 5) throw new Error('This code is incomplete or damaged. Copy all of it and try again.');
  const body = all.subarray(0, all.length - 4);
  if (fnv(body) !== new DataView(all.buffer, all.byteOffset).getUint32(all.length - 4)) throw new Error('This code is incomplete or damaged. Copy all of it and try again.');
  const r = new In(body), s = emptySave();
  try {
    s.v = r.uv(); s.ride = r.num(); s.stars = r.map(); s.scores = r.map(); s.flags = r.map(); s.settings = r.map();
    for (let k = 0, n = r.uv(); k < n; k++) { const id = r.str(); s.rules[id] = [r.num(), r.num()]; }
    const n = r.uv(), print = r.uv(), bits = r.b.subarray(r.i, r.i + Math.ceil(n / 8)); r.i += Math.ceil(n / 8);
    const inside = []; for (let i = 0; i < n; i++) if (bits[i >> 3] & (1 << (i & 7))) inside.push(i);
    if (inside.length && (n !== contentKeys.length || print !== contentPrint(contentKeys))) throw new Error('content');
    const cols = inside.map(() => [r.byte(), 0, 0, 0]);
    for (let f = 1; f < 4; f++) for (const row of cols) row[f] = r.num();
    inside.forEach((i, j) => { s.items[contentKeys[i]] = cols[j]; });
    for (let k = 0, o = r.uv(); k < o; k++) { const key = r.str(); s.items[key] = [r.num(), r.num(), r.num(), r.num()]; }
  } catch (e) {
    if (e instanceof Error && e.message === 'content') throw new Error('This code comes from another version of the game. Reload the game on both devices and make a new code, or move the progress with a file.');
    throw new Error('This code is incomplete or damaged. Copy all of it and try again.');
  }
  return normalize(s);
}
