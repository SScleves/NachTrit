// Task labels for the qa tools: the game's own module (src/tasks.js, which index.html imports), so the audits and the game
// can never disagree. The tools hand raw level items to taskOf; the game hands it entries from itemToEntry, where a word item
// carries word: true. itemTask() makes that one difference good, nothing else.
import { TASKS, TASK_OF_RULE, wordBag, isPureReorder, taskOf as engineTaskOf } from '../../src/tasks.js';
export { TASKS, TASK_OF_RULE, wordBag, isPureReorder };
// fork: { o, a, r, task?, read?, entry: item } with the raw item as entry
export function taskOf(fork) {
  const e = fork.entry || {};
  return engineTaskOf(e.w != null && !e.parts && !e.word ? { ...fork, entry: { ...e, word: true } } : fork);
}
export const taskLabel = id => (TASKS[id] || TASKS.word).label;
