// Dump fork -> task label (the game's own taskOf, and the qa wrapper) for every fork of every level, seeded. usage: node qa/dump-tasks.mjs out.json
// Run before and after a content change that must not move any label (rule id merges) and diff the two files.
import fs from 'node:fs';
import { taskOf } from '../src/tasks.js';
import { taskOf as qaTaskOf } from './lib/tasks.mjs';
import { itemToEntry } from '../src/forks.js';
import { content_, lanesOf, withSeed, forksOfEntry } from './test/helpers.mjs';
const { levels } = content_(); const out = {};
withSeed(7, () => {
  for (const lv of levels) lv.items.forEach((item, ii) => {
    const e = itemToEntry(item, lv.items, lanesOf(lv));
    forksOfEntry(e).forEach((f, fi) => {
      const g = taskOf(f), q = qaTaskOf({ o: f.o, a: f.a, r: f.r, task: f.task, read: f.read, entry: item });
      out[`L${lv.id}.${ii}.${fi}`] = g + '|' + q;
    });
  });
});
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 0).replace(/,"/g, ',\n"'));
console.log(Object.keys(out).length, 'forks');
