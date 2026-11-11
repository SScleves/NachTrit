// Load every content script the way the browser does and check the level data.
// usage: node qa/validate-content.mjs [levelId ...]      (no ids: every level)
import vm from 'node:vm'; import fs from 'node:fs'; import path from 'node:path';
import { checkLevel } from './lib/validate.mjs';
import { loadBoth } from './lib/dehet-both.mjs';   // nouns that take both de and het: never tested (qa/data/dehet-both.txt)   // the rules themselves (unit tested in qa/test/validate.test.mjs)
const ROOT = process.cwd();
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const listed = [...html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)].map(m => m[1]).filter(s => /^(data|levels)\.js$|^content\//.test(s));
// Bundles are generated; read the source folders instead so a new level is checked before anyone rebuilds.
const BUNDLES = { 'content/extra.js': 'content/extra', 'content/towns-new.js': 'content/new' };
for (let i = 0; i < listed.length; i++) { const dir = BUNDLES[listed[i]]; if (dir && fs.existsSync(path.join(ROOT, dir))) { const files = fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith('.js')).sort().map(f => `${dir}/${f}`); listed.splice(i, 1, ...files); i += files.length - 1; } }
const ctx = { console }; ctx.window = ctx; vm.createContext(ctx);
const loadErrors = [];
for (const src of listed) {
  const file = path.join(ROOT, src); if (!fs.existsSync(file)) { loadErrors.push(`missing ${src}`); continue; }
  try { vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: src }); } catch (e) { loadErrors.push(`${src}: ${e.message}`); }
}
const towns = new Set((ctx.TOWNS || []).map(t => t.id));
const RULES = ctx.RULES || {};
const both = loadBoth(ROOT);
if (!both.size) loadErrors.push('qa/data/dehet-both.txt is missing or empty');
const only = process.argv.slice(2).map(Number);
let errors = 0, warns = 0, ids = new Set();
for (const lv of ctx.LEVELS || []) {
  if (lv.soon) continue; if (only.length && !only.includes(lv.id)) continue;
  const { E, W, kinds, town, place } = checkLevel(lv, { towns, RULES, ids, both });
  const items = lv.items || [];
  errors += E.length; warns += W.length;
  console.log(`${E.length ? 'FAIL' : 'ok  '} L${lv.id} ${lv.name} [${town}/${place}] items ${items.length} deliveries ${lv.deliveries} ${Object.entries(kinds).map(([k, v]) => k + ':' + v).join(' ')}`);
  E.forEach(e => console.log('   error: ' + e)); W.forEach(w => console.log('   warn:  ' + w));
}
loadErrors.forEach(e => console.log('LOAD ERROR: ' + e));
console.log(`\n${errors + loadErrors.length} errors, ${warns} warnings`);
process.exit(errors + loadErrors.length ? 1 : 0);
