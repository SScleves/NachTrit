// Every local script in index.html must carry the release version, so a browser never mixes a new index.html with old
// cached shot or town files (GitHub Pages caches for 10 minutes and its headers cannot be changed).
// usage: node qa/check-versions.mjs            fails (exit 1) when a local script tag or a local module import lacks ?v=<NR_VERSION>
//        node qa/check-versions.mjs --bump     raises NR_VERSION by one and rewrites every local tag and import to it
import fs from 'node:fs'; import path from 'node:path';
const file = path.join(process.cwd(), 'index.html');
let html = fs.readFileSync(file, 'utf8');
const vm = /window\.NR_VERSION\s*=\s*(\d+)\s*;/.exec(html);
if (!vm) { console.error('no window.NR_VERSION = <number>; in index.html'); process.exit(1); }
let V = +vm[1];
const local = src => !/^(https?:)?\/\//.test(src) && !src.startsWith('data:');
// <script src="..."> tags, and import specifiers inside the module: from './x.js', import('./x.js'), and import-map targets
const TAG = /<script\b[^>]*\bsrc="([^"]+)"/g;
const IMP = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.{1,2}\/[^'"]+|\/[^'"]+)\2/g;
const MAP = /<script type="importmap">([\s\S]*?)<\/script>/;
if (process.argv.includes('--bump')) {
  const N = V + 1;
  html = html.replace(/window\.NR_VERSION\s*=\s*\d+\s*;/, `window.NR_VERSION = ${N};`)
    .replace(TAG, (m, src) => local(src) ? m.replace(src, src.split('?')[0] + '?v=' + N) : m)
    .replace(IMP, (m, a, q, src) => a + q + src.split('?')[0] + '?v=' + N + q);
  fs.writeFileSync(file, html); console.log(`NR_VERSION ${V} -> ${N}`); V = N;
}
const bad = [], seen = [];
for (const [, src] of html.matchAll(TAG)) if (local(src)) { seen.push(src); if (!src.endsWith('?v=' + V)) bad.push(`script tag ${src}`); }
for (const [, , , src] of html.matchAll(IMP)) { seen.push(src); if (!src.endsWith('?v=' + V)) bad.push(`module import ${src}`); }
const im = MAP.exec(html); if (im) { try { for (const [k, v] of Object.entries(JSON.parse(im[1]).imports || {})) if (local(v) && !v.endsWith('/')) { seen.push(v); if (!v.endsWith('?v=' + V)) bad.push(`import map ${k} -> ${v}`); } } catch (e) { bad.push('import map is not valid JSON'); } }
// every tagged file must exist, or the version is pinned to a 404
for (const s of seen) { const f = path.join(process.cwd(), s.split('?')[0]); if (!fs.existsSync(f)) bad.push(`missing file ${s}`); }
if (bad.length) { console.error(`NR_VERSION ${V}: ${bad.length} local script(s) without ?v=${V}:\n  ` + bad.join('\n  ')); process.exit(1); }
console.log(`NR_VERSION ${V}: ${seen.length} local scripts, all ?v=${V}`);
