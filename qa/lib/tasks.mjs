// Task label derivation, a copy of taskOf() in index.html (search "const TASKS"). Keep the two in step
// until phase 2 moves the engine copy to src/tasks.js and both import one module.
export const TASKS = {
  order: { label: 'Word order', color: '#7fc8ff' }, past: { label: 'Past tense', color: '#ffb86b' }, verb: { label: 'Verb form', color: '#c9a2ff' },
  word: { label: 'Which word', color: '#9fe0a0' }, dehet: { label: 'de or het', color: '#ffd27a' }, comp: { label: 'Comparison', color: '#ff9fbf' },
  listen: { label: 'Listen', color: '#7fe0d8' }, meaning: { label: 'Meaning', color: '#e8e4d8' },
};
export const TASK_OF_RULE = {};
for (const [t, ids] of Object.entries({
  order: 'v2 bijzin tmp sepbz hoewel indirect alsdan cond conditie voorwaarde',
  past: 'imp kof perf plusq aux',
  verb: 'sep modal zou fut zullen aanhet presens pres passief gebod omte al zijn hebben om',
  comp: 'vergelijk', dehet: 'dehet',
})) for (const r of ids.split(' ')) TASK_OF_RULE[r] = t;
// options that are the same words in another order ask for word order, whatever the rule id says
export const wordBag = t => String(t).toLowerCase().replace(/[.,?!]/g, '').trim().split(/\s+/).sort().join(' ');
export const isPureReorder = o => o.length > 1 && o.every(t => /\s/.test(String(t).trim())) && o.every(t => wordBag(t) === wordBag(o[0]));
// fork: { o, a, r, task?, read?, entry: item }
export function taskOf(fork) {
  const e = fork.entry || {};
  if (fork.task || e.task) return TASKS[fork.task || e.task] ? fork.task || e.task : 'word';
  if (fork.read) return 'meaning';
  if (e.listen) return 'listen';
  if (e.dehet) return 'dehet';
  if (e.look || e.word || (e.w != null && !e.parts)) return 'word';
  if (isPureReorder(fork.o)) return 'order';
  return TASK_OF_RULE[fork.r] || 'word';
}
export const taskLabel = id => (TASKS[id] || TASKS.word).label;
