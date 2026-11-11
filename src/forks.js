// @ts-check
// From level items to the entries the planner rides: itemToEntry and levelQueue. lanes is the number of lanes of the ride
// (LANE_X.length in the game). Random choices come from Math.random, in the same order as before the move.
// The game imports this (src/flow.js); the unit tests import it in Node. The planner that rides the entries is src/plan.js.
// turn a level item into an entry the planner understands
/** @param {import('./types.js').AnyItem} item @param {import('./types.js').AnyItem[]} pool @param {number} lanes @returns {import('./types.js').Entry} */
export function itemToEntry(item, pool, lanes) {
  // wrong options come from items of the same kind: nouns for noun forks, readings for reading forks
  const sameKind = p => p !== item && (item.read ? p.read : (p.w || p.listen || p.look) && !p.read && !p.parts);
  const others = kind => pool.filter(p => sameKind(p) && p[kind]).map(p => p[kind]).filter((v, i, a) => a.indexOf(v) === i).sort(() => Math.random() - 0.5);
  const wrongFirst = list => item.wrong ? [item.wrong, ...list.filter(v => v !== item.wrong)] : list;
  if (item.read && item.o) return { read: true, nl: item.nl, o: item.o.slice(), a: item.a || 0, r: item.r || 'woord', w: item.w || '', task: item.task };
  if (item.read) {
    const o = [item.en, ...others('en').filter(e => e !== item.en).slice(0, 2)];
    return { read: true, nl: item.nl, o, a: 0, r: 'woord', w: `${item.nl} = ${item.en}` };
  }
  if (item.dehet) {
    return { en: item.en, nl: `${item.art} ${item.nl}`, dehet: true, parts: [{ o: ['de', 'het'], a: item.art === 'de' ? 0 : 1, r: 'dehet', w: item.w || `${item.art} ${item.nl}`, fixed: true }, item.nl] };
  }
  if (item.look) {
    const o = [item.nl, ...wrongFirst(others('nl').filter(e => e !== item.nl)).slice(0, lanes - 1)];
    return { look: true, side: item.side || (Math.random() < 0.5 ? 'links' : 'rechts'), prop: item.prop, value: item.value, en: item.en, nl: item.nl,
      parts: [{ o, a: 0, r: 'woord', w: `${item.nl} = ${item.en}` }] };
  }
  if (item.w || item.listen) {
    const o = [item.nl, ...wrongFirst(others('nl').filter(e => e !== item.nl)).slice(0, lanes - 1)];
    return { en: item.w || item.en, nl: item.nl, listen: !!item.listen, word: !item.listen, parts: [{ o, a: 0, r: item.listen ? 'woord' : (/^\d+$/.test(item.w || '') ? 'getal' : 'woord'), w: `${item.nl} = ${item.w || item.en}` }] };
  }
  return item.nl ? item : Object.assign({}, item, { nl: item.parts.map(p => typeof p === 'string' ? p : p.o[p.a]).join(' ').replace(/\s+([,.?])/g, '$1') }); // build entry
}
// the level's deliveries in ride order: the items shuffled, repeated when the level has more deliveries than items
/** @param {import('./types.js').Level} lv @param {number} lanes @returns {import('./types.js').Entry[]} */
export function levelQueue(lv, lanes) {
  const items = lv.items.slice().sort(() => Math.random() - 0.5);
  const q = []; while (q.length < lv.deliveries) q.push(...items.slice(0, lv.deliveries - q.length));
  return q.map(i => itemToEntry(i, lv.items, lanes));
}
