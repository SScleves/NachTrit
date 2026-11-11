// How a wrong option differs from the right one, in four dimensions (PLAN.md 3b.1):
//   order    the same words in another order (also a separable verb glued or split: door fiets / doorfiets)
//   form     another form of the same word (werkt / werkte, groot / grote, ben / is, an extra or missing te)
//   word     a different word (deze / dit, met / aan, an extra or missing function word)
//   spelling a token that is not a Dutch word (werkde, groote, pizzas)
import { tokens, sameLemma, isWord, PARTICLES, CLOSED } from './nl.mjs';

function take(list, x) { const i = list.indexOf(x); if (i >= 0) { list.splice(i, 1); return true; } return false; }

export function compare(answer, wrong, allow) {
  const A = tokens(answer).map(t => t.toLowerCase()), Dt = tokens(wrong), D = Dt.map(t => t.toLowerCase());
  const orig = new Map(Dt.map(t => [t.toLowerCase(), t])), real = t => isWord(orig.get(t) || t, allow, false);
  const dims = new Set(), notes = [], nonWords = Dt.filter(t => !isWord(t, allow, false));
  // a separable verb in its te-form (uit te laten) is one form of uitlaten: glue it, so only the te differs
  const glueTe = (L, M) => { for (let i = 0; i + 2 < L.length; i++) if (L[i + 1] === 'te' && M.includes(L[i] + L[i + 2]) && M[M.indexOf(L[i] + L[i + 2]) - 1] !== 'te') L.splice(i, 3, 'te', L[i] + L[i + 2]); return L; };
  glueTe(A, D); glueTe(D, A);
  if (A.join(' ') === D.join(' ')) { dims.add('spelling'); notes.push('punctuation or case only'); return { dims, notes, nonWords }; }
  const remA = A.slice(), remD = [];
  for (const t of D) if (!take(remA, t)) remD.push(t);
  const repl = new Map();   // distractor token -> the answer tokens it stands for
  // glued or split separable verbs and compounds: door + fiets = doorfiets
  for (const d of remD.slice()) for (const a1 of remA) for (const a2 of remA) if (a1 !== a2 && (a1 + a2 === d || a2 + a1 === d)) { if (remD.includes(d) && remA.includes(a1) && remA.includes(a2)) { take(remD, d); take(remA, a1); take(remA, a2); dims.add('order'); notes.push(`${a1} ${a2} -> ${d}`); repl.set(d, [a1, a2]); } }
  for (const a of remA.slice()) for (const d1 of remD) for (const d2 of remD) if (d1 !== d2 && (d1 + d2 === a || d2 + d1 === a)) { if (remA.includes(a) && remD.includes(d1) && remD.includes(d2)) { take(remA, a); take(remD, d1); take(remD, d2); dims.add('order'); notes.push(`${a} -> ${d1} ${d2}`); } }
  // a separable particle glued on or cut off: lever / inlever, op / opbellen
  const glued = (x, y) => !(CLOSED.has(x) && CLOSED.has(y)) && PARTICLES.some(p => y.startsWith(p) && (y.slice(p.length) === x || x === p || sameLemma(y.slice(p.length), x)));
  for (const d of remD.slice()) { const a = remA.find(x => glued(x, d) || glued(d, x)); if (a) { take(remA, a); take(remD, d); dims.add('order'); const p = PARTICLES.find(p => a.startsWith(p) && remD.includes(p)); if (p) take(remD, p); notes.push(`${a} -> ${d}${p ? ' ' + p : ''} (particle)`); repl.set(d, [a]); } }
  // forms of one word
  for (const d of remD.slice()) { const a = remA.find(x => sameLemma(x, d)); if (a) { take(remA, a); take(remD, d); const ok = real(d); dims.add(ok ? 'form' : 'spelling'); notes.push(`${a} -> ${d}${ok ? '' : ' (not a word)'}`); repl.set(d, [a]); } }
  // non-words that are not a form of anything in the answer: spelling, paired with what they replace
  for (const d of remD.slice()) if (!real(d)) { const a = remA.shift(); take(remD, d); dims.add('spelling'); notes.push(`${a || '-'} -> ${d} (not a word)`); if (a) repl.set(d, [a]); }
  // different words, one for one
  while (remA.length && remD.length) { const a = remA.shift(), d = remD.shift(); dims.add('word'); notes.push(`${a} -> ${d}`); repl.set(d, [a]); }
  // extra or missing words: te is part of the verb form, anything else is a word choice
  for (const t of remA) { dims.add(t === 'te' ? 'form' : 'word'); notes.push(`${t} missing`); }
  for (const t of remD) { dims.add(t === 'te' ? 'form' : 'word'); notes.push(`${t} added`); }
  // after mapping the swapped words back, is the order still different?
  const extra = new Set([...remA, ...remD]);
  const a2 = A.filter(t => !extra.has(t)), d2 = D.flatMap(t => repl.get(t) || [t]).filter(t => !extra.has(t));
  if (!dims.has('order') && a2.length === d2.length && a2.join(' ') !== d2.join(' ') && a2.slice().sort().join(' ') === d2.slice().sort().join(' ')) dims.add('order');
  return { dims, notes, nonWords };
}

// the dimension a rule is meant to test; null where the rule allows more than one honest reading
export const SPELLING_RULES = new Set(['kof', 'spel', 'meervoud', 'verklein', 'adj', 'samen']);
export function intendedDim(task, rule) {
  if (task === 'spell') return 'spelling';
  if (task === 'order') return 'order';
  if (['kof', 'spel', 'meervoud'].includes(rule)) return 'spelling';
  if (task === 'past' || task === 'verb' || task === 'comp') return 'form';
  if (['adj', 'verklein'].includes(rule)) return 'form';
  return 'word';
}
// dimensions a label honestly covers; spelling is reported by the non-word check, never as a label problem
export function acceptedDims(task, rule) {
  if (task === 'spell') return ['spelling'];
  const aux = ['aux', 'plusq', 'passief', 'zijn', 'hebben', 'aanhet'].includes(rule);
  if (task === 'order') return ['order'];
  if (task === 'past' || task === 'verb') return aux ? ['form', 'word'] : rule === 'sep' || rule === 'omte' ? ['form', 'order'] : ['form'];
  if (task === 'comp') return ['form', 'word'];
  if (task === 'dehet') return ['word'];
  return ['adj', 'verklein', 'meervoud', 'spel', 'samen'].includes(rule) ? ['form', 'word'] : ['word'];
}
export const DIM_LABEL = { order: 'word order', form: 'form of the same word', word: 'word choice', spelling: 'spelling (not a word)' };
