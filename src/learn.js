// @ts-check
// The learner model (PLAN.md phase 4 points 2 to 4): what this player knows, item by item and rule by rule, and what is due.
// An item is keyed by a stable hash of its Dutch text (itemKey: 36 bits of the voice hash's sha1, base 36), so an edit to
// another item never moves this one. Per item one short array of numbers: [box 1..5, seen, right on the first try, last
// ride]. Right on the first try moves it up a box, wrong puts it in box 1. A box waits INTERVALS rides (a ride counter, not
// a date, so a long break does not bring everything back at once). Per rule id: [seen, right].
// Also here: the spaced review's pick (selectDue, duePositions), the practice ride's pick (weakest), the content index the
// word book and the save code read (buildIndex, bookWords) and the rules list (ruleRows).
// Pure: no window, no imports. The hash function (window.voiceId from voice/hash.js) and the content come in as arguments.

/** rides a box waits before its item is due again, boxes 1 to 5 */
export const INTERVALS = [1, 2, 4, 8, 16];
/** spaced review replaces up to this share of a level's deliveries */
export const REVIEW_SHARE = 0.25;
/** the item kinds the word book lists (sentences and readings are in the model too, for review, but are not words) */
export const WORD_KINDS = ['word', 'look', 'listen', 'dehet'];

/** the Dutch text as the key sees it: trimmed, single spaces @param {string} nl */
export const normNl = nl => String(nl || '').trim().replace(/\s+/g, ' ');
/** an item's key: 36 bits of sha1('|' + text) as base 36 (up to 7 characters). idOf is window.voiceId (voice/hash.js) with
 * no voice. 36 bits: two of the game's 3,663 texts share a key with odds of about 1 in 10,000 (a unit test checks there is none)
 * @param {string} nl @param {(voice: string, text: string) => string} idOf */
export const itemKey = (nl, idOf) => parseInt(idOf('', normNl(nl)).slice(0, 9), 16).toString(36);

/** a record's share right on the first try @param {number[]} r */
const share = r => r[1] ? r[2] / r[1] : 0;

/** one first try of an item in a ride: seen, right, the box, the ride. Returns the record
 * @param {Object<string, number[]>} items @param {string} key @param {boolean} right @param {number} ride */
export function noteItem(items, key, right, ride) {
  const r = items[key] || (items[key] = [1, 0, 0, ride]);
  r[1]++;
  if (right) { r[2]++; r[0] = Math.min(5, r[0] + 1); } else r[0] = 1;
  r[3] = ride;
  return r;
}
/** one fork of a rule @param {Object<string, number[]>} rules @param {string} id @param {boolean} right */
export function noteRule(rules, id, right) {
  const r = rules[id] || (rules[id] = [0, 0]);
  r[0]++; if (right) r[1]++;
  return r;
}
/** rides past the item's interval (0 = due this ride, below 0 = not due) @param {number[]} r @param {number} ride */
export const overdue = (r, ride) => ride - r[3] - INTERVALS[Math.min(5, Math.max(1, r[0])) - 1];
/** @param {number[]} r @param {number} ride */
export const isDue = (r, ride) => overdue(r, ride) >= 0;

/** the spaced review's pick for a ride: the due items among the candidates, weakest box first, then the lowest share right,
 * then the most overdue, then the earliest in play order. No randomness: the same save gives the same pick.
 * @param {Object<string, number[]>} items @param {number} ride @param {string[]} candidates keys, in play order
 * @param {number} max @param {Set<string>} [skip] keys already in this ride @returns {string[]} */
export function selectDue(items, ride, candidates, max, skip) {
  if (max <= 0) return [];
  const due = [];
  for (let i = 0; i < candidates.length; i++) {
    const k = candidates[i], r = items[k];
    if (r && !(skip && skip.has(k)) && isDue(r, ride)) due.push({ k, i, r });
  }
  due.sort((a, b) => a.r[0] - b.r[0] || share(a.r) - share(b.r) || overdue(b.r, ride) - overdue(a.r, ride) || a.i - b.i);
  return due.slice(0, max).map(d => d.k);
}
/** how many deliveries of a level the review may take @param {number} deliveries */
export const reviewCap = deliveries => Math.floor(deliveries * REVIEW_SHARE);
/** where k review items go in a queue of n: spread evenly, never first @param {number} n @param {number} k */
export function duePositions(n, k) {
  const out = [];
  for (let j = 0; j < k; j++) out.push(Math.min(n - 1, Math.floor((j + 1) * n / (k + 1))));
  return out.filter((p, i) => p > 0 && out.indexOf(p) === i);
}

/** the practice ride's pick: the n weakest items met (lowest box, lowest share right, most recent first), among keys
 * @param {Object<string, number[]>} items @param {string[]} keys the keys that can ride (in this game's content) @param {number} n */
export function weakest(items, keys, n) {
  return keys.filter(k => items[k]).map((k, i) => ({ k, i, r: items[k] }))
    .sort((a, b) => a.r[0] - b.r[0] || share(a.r) - share(b.r) || b.r[3] - a.r[3] || a.i - b.i)
    .slice(0, n).map(d => d.k);
}

/**
 * @typedef {{ key: string, item: any, level: any, town: string, tier: number, order: number, kind: string, word: any, wordTown: string }} IndexRow
 *   one Dutch text of the content: its first item and level in play order (and the town, tier, play order), and its first
 *   occurrence as a word (word, look, listen or de/het item), if it has one, with that town
 * @typedef {{ rows: IndexRow[], byKey: Map<string, IndexRow>, keys: string[], levelOrder: Map<number, number> }} ContentIndex
 */
/** the kind of a content item @param {any} it */
export const kindOf = it => it.dehet ? 'dehet' : it.look ? 'look' : it.read ? 'read' : it.listen ? 'listen' : it.parts ? 'build' : it.w != null ? 'word' : '?';
/** every Dutch text in the content, in play order (towns by tier, a town's levels in LEVELS order), first occurrence wins.
 * keys: the sorted keys (the save code's bitmap runs over them). textOf: the entry text of an item (src/forks.js entryText)
 * @param {any[]} levels window.LEVELS @param {any[]} towns window.TOWNS @param {(id: number) => string} townOf
 * @param {(nl: string) => string} keyOf @param {(item: any) => string} textOf @returns {ContentIndex} */
export function buildIndex(levels, towns, townOf, keyOf, textOf) {
  const rows = [], byKey = new Map(), levelOrder = new Map();
  const ts = towns.slice().sort((a, b) => a.tier - b.tier);
  for (const t of ts) for (const lv of levels) {
    if (lv.soon || !lv.items || !lv.items.length || (lv.town || townOf(lv.id)) !== t.id) continue;
    const order = levelOrder.size; levelOrder.set(lv.id, order);
    for (const item of lv.items) {
      const text = textOf(item); if (!text) continue;
      const key = keyOf(text), kind = kindOf(item);
      let row = byKey.get(key);
      if (!row) { row = { key, item, level: lv, town: t.id, tier: t.tier, order, kind, word: null, wordTown: '' }; byKey.set(key, row); rows.push(row); }
      if (!row.word && WORD_KINDS.includes(kind)) { row.word = item; row.wordTown = t.id; }
    }
  }
  return { rows, byKey, keys: [...byKey.keys()].sort(), levelOrder };
}
/** what an item means in English @param {any} it */
export const meaningOf = it => it.read && it.o ? it.o[it.a || 0] : it.dehet ? it.en : it.w || it.en || '';

/**
 * @typedef {{ key: string, nl: string, en: string, town: string, box: number, seen: number, right: number }} BookWord
 */
/** the word book's list: every word met (a key in the model whose text is a word somewhere in the content), in play order.
 * Filters: town id, strength (the box, 1 to 5). nl is the content's Dutch with its article (textOf), en its meaning
 * @param {Object<string, number[]>} items @param {ContentIndex} index @param {(item: any) => string} textOf
 * @param {{ town?: string, box?: number }} [filter] @returns {BookWord[]} */
export function bookWords(items, index, textOf, filter = {}) {
  const out = [];
  for (const row of index.rows) {
    const r = items[row.key];
    if (!r || !row.word) continue;
    if (filter.town && row.wordTown !== filter.town) continue;
    if (filter.box && r[0] !== filter.box) continue;
    out.push({ key: row.key, nl: textOf(row.word), en: meaningOf(row.word), town: row.wordTown, box: r[0], seen: r[1], right: r[2] });
  }
  return out;
}

/**
 * @typedef {{ id: string, name: string, seen: number, right: number }} RuleRow
 */
/** the rules tab: every rule practised, the three weakest on top (seen 3 times or more, lowest share right, then the most
 * seen), the rest by how often they came up
 * @param {Object<string, number[]>} rules @param {Object<string, { name: string }>} names window.RULES
 * @returns {{ weakest: RuleRow[], rest: RuleRow[] }} */
export function ruleRows(rules, names) {
  const rows = Object.keys(rules).map(id => ({ id, name: (names[id] && names[id].name) || id, seen: rules[id][0], right: rules[id][1] }));
  const sh = (/** @type {RuleRow} */ r) => r.seen ? r.right / r.seen : 1;
  const weak = rows.filter(r => r.seen >= 3 && r.right < r.seen).sort((a, b) => sh(a) - sh(b) || b.seen - a.seen || (a.id < b.id ? -1 : 1)).slice(0, 3);
  const rest = rows.filter(r => !weak.includes(r)).sort((a, b) => b.seen - a.seen || (a.id < b.id ? -1 : 1));
  return { weakest: weak, rest };
}
