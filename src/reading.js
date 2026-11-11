// @ts-check
// Reading time: every fork's signs stay legible for its budget, at any tier's speed (PLAN.md section 2, "Language difficulty
// stays doable at every tier"). The pure half of it: the budget per fork and how far off letters of a given size read.
// The game imports it (src/plan.js, src/loop.js); the unit tests import it in Node. Placing the signs by it is src/plan.js.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// legible: the letters (the em of the drawn font) are at least READ_THR of the viewport height (1.25 percent, 10 px on an
// 800 px window) and the sign is still READ_AHEAD (3) m in front of the bike. qa/readbot.js measures the same thing.
export const READ_THR = 0.0125, READ_AHEAD = 3, HOLD_AT = 7;
export const wordsIn = list => { let n = 0; for (const t of list) n += String(t).trim().split(/\s+/).length; return n; };
// seconds to read a fork: 0.35 s a word over all options plus 1.2 s to decide, 3 to 7 s; listen and read 1.5x; de/het and word items the minimum
export function readBudget(fork) {
  const e = fork.entry || {};
  const first = fork.firstTask ? 1.5 : 0;   // the first fork of a task type in a level: 1.5 s more, once
  if (e.dehet || e.word) return 3 + first;
  const b = clamp(0.35 * wordsIn(fork.o) + 1.2, 3, 7);
  return (fork.read || e.listen ? b * 1.5 : b) + first;
}
// seconds the why card stays up after a wrong answer: 0.35 s a word of the why line, at least 3 (PLAN.md 3d). The go key ends it sooner.
export const whyBudget = why => Math.max(3, 0.35 * wordsIn([why || '']));
// how far ahead letters of em metres become legible, through the fork camera at full speed (it widens and closes in as the gate nears)
export function legDist(em) {
  for (let a = 40; a > READ_AHEAD; a -= 0.5) { const fz = clamp(1 - a / 46, 0, 1), sf = 1 - fz, half = (60 + sf * 10 + fz * 22) * Math.PI / 360; if (em / (2 * Math.tan(half) * (a + 6.4 + sf * 2.6 - fz * 2.4)) >= READ_THR) return a; }
  return READ_AHEAD + 0.5;
}
