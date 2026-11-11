// npm run models: writes every .glb in assets/models from the scripts beside this file, and checks the size budget
// (each under 150 KB, all under 2 MB). The files are committed; the game itself has no build step.
import { build as rider } from './rider.mjs';
import { build as dog } from './dog.mjs';
import { build as windmill } from './windmill.mjs';
import { build as gables } from './gables.mjs';
import { build as props } from './props.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { OUT } from './lib.mjs';

for (const b of [rider, dog, windmill, gables, props]) await b();
let total = 0, over = [];
for (const f of fs.readdirSync(OUT).filter(f => f.endsWith('.glb'))) { const s = fs.statSync(path.join(OUT, f)).size; total += s; if (s > 150 * 1024) over.push(f); }
console.log(`total ${(total / 1024).toFixed(1)} KB` + (over.length ? `; over 150 KB: ${over.join(', ')}` : ''));
if (over.length || total > 2 * 1024 * 1024) process.exit(1);
