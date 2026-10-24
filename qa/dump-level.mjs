// Print one level as the browser would see it after every content script has run.
// usage: node qa/dump-level.mjs <levelId> [--brief]
import vm from 'node:vm'; import fs from 'node:fs'; import path from 'node:path';
const ROOT = process.cwd();
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const listed = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]).filter(s => /^(data|levels)\.js$|^content\//.test(s));
// Bundles are generated; read the source folders instead so a new level is checked before anyone rebuilds.
const BUNDLES = { 'content/extra.js': 'content/extra', 'content/towns-new.js': 'content/new' };
for (let i = 0; i < listed.length; i++) { const dir = BUNDLES[listed[i]]; if (dir && fs.existsSync(path.join(ROOT, dir))) { const files = fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith('.js')).sort().map(f => `${dir}/${f}`); listed.splice(i, 1, ...files); i += files.length - 1; } }
const ctx = { console }; ctx.window = ctx; vm.createContext(ctx);
for (const src of listed) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, src), 'utf8'), ctx, { filename: src }); } catch (e) { console.error(`load error ${src}: ${e.message}`); } }
const id = Number(process.argv[2]); const lv = (ctx.LEVELS || []).find(l => l.id === id);
if (!lv) { console.error(`no level ${id}`); process.exit(1); }
if (process.argv.includes('--brief')) {
  for (const it of lv.items) console.log(it.dehet ? `dehet  ${it.art} ${it.nl} = ${it.en}` : it.look ? `look   ${it.nl} = ${it.en} (${it.prop})` : it.read ? `read   ${it.nl} = ${it.en || (it.o && it.o[it.a])}` : it.listen ? `listen ${it.nl} = ${it.en}` : it.parts ? `build  ${it.en} :: ${it.parts.map(p => typeof p === 'string' ? p : '[' + p.o.join('|') + ']').join(' ')}` : `word   ${it.w} = ${it.nl}`);
} else console.log(JSON.stringify(lv, null, 1));
