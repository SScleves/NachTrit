// Shared by the unit tests in qa/test: the repo root, the content as the browser loads it, and a seeded Math.random.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent } from '../lib/load.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
let content = null;
export const content_ = () => content || (content = loadContent(ROOT));   // { ctx, RULES, towns, levels } (levels in play order)
// the number of lanes a level rides with (LANE_X.length in the game)
export const lanesOf = lv => lv.lanes === 2 ? 2 : 3;
// run fn with Math.random seeded (mulberry32), so a failure can be replayed
export function withSeed(seed, fn) {
  const was = Math.random; let a = seed >>> 0 || 1;
  Math.random = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  try { return fn(); } finally { Math.random = was; }
}
// the forks the planner builds from an entry (planSentence in index.html): one per non-string part, or the read fork
export function forksOfEntry(entry) {
  if (entry.read) return [{ entry, idx: 0, o: entry.o, a: entry.a, r: entry.r, w: entry.w, read: true }];
  return entry.parts.filter(p => typeof p !== 'string').map((f, i) => ({ entry, idx: i, o: f.o, a: f.a, r: f.r, w: f.w, task: f.task, read: false, fixed: !!f.fixed }));
}
