// @ts-check
// Missed items come back in the same ride (PLAN.md 3a), and the end card lists what was missed, grouped by rule (3d point 4).
// The pure half: when a missed item goes back, where in the queue, which stretch of road is review road, and the grouping
// of the misses with the weakest rule. The game imports it (src/flow.js, src/plan.js, src/loop.js); the unit tests in Node.
// Pure: no window, no THREE, no imports (the task labels come in as an argument). The why card's timing is whyBudget in
// src/reading.js.

// cap: returns in one ride. gapMin, gapMax: other forks between a miss and its return. late: a second miss comes back in
// the last quarter of the ride. times: how often one item comes back at most.
export const AGAIN = { cap: 6, gapMin: 3, gapMax: 5, late: 0.75, times: 2 };

/** whether a missed item goes back in the queue.
 * @param {number} misses how often this item has been missed in this ride, this miss included (1 = on its first ride)
 * @param {number} used returns already scheduled in this ride */
export const shouldReturn = (misses, used) => misses >= 1 && misses <= AGAIN.times && used < AGAIN.cap;

/** where a missed item goes back into the queue: the index to insert it at.
 * After gapMin other forks at least: the forks already on the road ahead count first, then the queued entries in order. A
 * second miss also waits for the last quarter of the ride. When the queue runs out first, it goes at the end.
 * @param {number} ahead forks on the road ahead, not yet answered
 * @param {number[]} queueForks the fork count of each queued entry, in ride order
 * @param {number} planned entries placed on the road so far (the missed one included)
 * @param {number} misses 1 for a first miss, 2 for a second */
export function returnSlot(ahead, queueForks, planned, misses) {
  let i = 0, n = ahead;
  while (i < queueForks.length && n < AGAIN.gapMin) n += queueForks[i++];
  if (misses >= 2) {   // the ride's entries, this return included: it should ride at 3/4 of them or later
    const total = planned + queueForks.length + 1;
    i = Math.max(i, Math.ceil(AGAIN.late * total) - planned);
  }
  return Math.min(i, queueForks.length);
}

/** is distance d on review road (the stretch a return added)? spans: [from, to) pairs in metres. No allocation: the loop calls it.
 * @param {number[][]} spans @param {number} d */
export function onReviewRoad(spans, d) {
  for (let i = 0; i < spans.length; i++) if (d >= spans[i][0] && d < spans[i][1]) return true;
  return false;
}

/** the right form inside the sentence, for marking it: [before, right, after]; [nl, '', ''] when the sentence does not hold it
 * (a reading: the right form is English)
 * @param {string} nl @param {string} right @returns {[string, string, string]} */
export function markRight(nl, right) {
  const s = String(nl || ''), r = String(right || '').trim();
  if (!r) return [s, '', ''];
  const esc = r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp(`(^|[^\\p{L}])(${esc})(?![\\p{L}])`, 'iu').exec(s);   // a whole word or phrase, not a piece of a longer word
  if (!m) return [s, '', ''];
  const at = m.index + m[1].length;
  return [s.slice(0, at), s.slice(at, at + r.length), s.slice(at + r.length)];
}

/**
 * @typedef {{ task: string, nl: string, right: string, said: string, why: string, again: string, first: boolean }} Miss
 *   one missed fork: its task id, the whole right sentence (or the sign), the right form, what was ridden, the why line,
 *   how its return went ('' none, 'right', 'wrong') and whether the miss was on the item's first ride
 * @typedef {Object<string, { tried: number, missed: number }>} Tally   first rides per task id
 */
/** the misses grouped by rule (the task label), the most missed rule first, and the weakest rule. Weakest is the most misses
 * times the share missed (missed x missed / tried) on first rides, so 3 of 3 beats 4 of 15 and 3 of 5 beats 1 of 1; then the
 * most misses, then the first group. weakest is null when nothing was missed on a first ride.
 * @param {Miss[]} misses @param {Tally} tally @param {Object<string, { label: string, color: string }>} tasks TASKS from src/tasks.js */
export function groupMisses(misses, tally, tasks) {
  /** @type {{ task: string, label: string, color: string, items: Miss[] }[]} */
  const groups = [];
  for (const m of misses) {
    let g = groups.find(x => x.task === m.task);
    if (!g) { const t = tasks[m.task] || tasks.word; g = { task: m.task, label: t.label, color: t.color, items: [] }; groups.push(g); }
    g.items.push(m);
  }
  const order = groups.map(g => g.task);
  groups.sort((a, b) => b.items.length - a.items.length || order.indexOf(a.task) - order.indexOf(b.task));
  /** @type {{ task: string, label: string, missed: number, tried: number } | null} */
  let weakest = null;
  for (const g of groups) {
    const t = tally[g.task]; if (!t || !t.missed) continue;
    const w = { task: g.task, label: g.label, missed: t.missed, tried: t.tried };
    const k = w.missed * w.missed / w.tried, kw = weakest ? weakest.missed * weakest.missed / weakest.tried : -1;
    if (k > kw + 1e-9 || (Math.abs(k - kw) < 1e-9 && w.missed > weakest.missed)) weakest = w;
  }
  return { groups, weakest };
}

/** the one line that names the weakest rule, '' when there is none
 * @param {{ label: string, missed: number, tried: number } | null} weakest */
export const weakLine = weakest => weakest ? `Weakest rule tonight: ${weakest.label}, ${weakest.missed} of ${weakest.tried} missed on the first try.` : '';
