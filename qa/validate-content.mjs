// Load every content script the way the browser does and check the level data.
// usage: node qa/validate-content.mjs [levelId ...]      (no ids: every level)
import vm from 'node:vm'; import fs from 'node:fs'; import path from 'node:path';
const ROOT = process.cwd();
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const listed = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]).filter(s => /^(data|levels)\.js$|^content\//.test(s));
const dirs = ['content/new', 'content/extra'];
const extras = dirs.flatMap(d => fs.existsSync(path.join(ROOT, d)) ? fs.readdirSync(path.join(ROOT, d)).filter(f => f.endsWith('.js')).sort().map(f => `${d}/${f}`) : []);
const ctx = { console }; ctx.window = ctx; vm.createContext(ctx);
const loadErrors = [];
for (const src of [...listed, ...extras]) {
  const file = path.join(ROOT, src); if (!fs.existsSync(file)) { loadErrors.push(`missing ${src}`); continue; }
  try { vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: src }); } catch (e) { loadErrors.push(`${src}: ${e.message}`); }
}
const PROPS = ['hond', 'huis', 'fiets', 'kerk', 'boom', 'molen', 'brug', 'water', 'winkel', 'lamp', 'deur', 'tuin', 'nummer'];
const PLACES = ['thuis', 'winkels', 'eten', 'station', 'werk', 'sport', 'mensen', 'eigen', 'bonus'];
const TOWN_OF = id => id === 41 ? 'alblasserdam' : id <= 5 ? 'alblasserdam' : id <= 10 ? 'kinderdijk' : id <= 15 ? 'gouda' : id <= 20 ? 'utrecht' : id <= 30 ? 'rotterdam' : 'amsterdam';
const PLACE_OF = { 41: 'thuis', 1: 'thuis', 2: 'mensen', 3: 'thuis', 4: 'mensen', 5: 'winkels', 6: 'winkels', 7: 'eten', 8: 'thuis', 9: 'eten', 10: 'station', 11: 'werk', 12: 'station', 13: 'mensen', 14: 'winkels', 15: 'sport' };
const towns = new Set((ctx.TOWNS || []).map(t => t.id));
const RULES = ctx.RULES || {};
const only = process.argv.slice(2).map(Number);
const words = s => s.trim().split(/\s+/).filter(w => /[\p{L}\d€]/u.test(w)).length;
let errors = 0, warns = 0, ids = new Set();
for (const lv of ctx.LEVELS || []) {
  if (lv.soon) continue; if (only.length && !only.includes(lv.id)) continue;
  const E = [], W = [];
  if (ids.has(lv.id)) E.push(`duplicate level id ${lv.id}`); ids.add(lv.id);
  const town = lv.town || TOWN_OF(lv.id); if (!towns.has(town)) E.push(`unknown town ${town}`);
  const place = lv.place || PLACE_OF[lv.id]; if (!PLACES.includes(place)) E.push(`unknown place ${place}`);
  if (!lv.name) E.push('no name');
  if (!lv.intro || !lv.introNl) W.push('no intro or introNl');
  if (!lv.mission || !lv.mission.where || !lv.mission.carry || !lv.mission.want) W.push('mission incomplete');
  const items = lv.items || []; if (items.length < 10) E.push(`only ${items.length} items`);
  if (!(lv.deliveries > 0)) E.push('no deliveries');
  const bang = (s, where) => { if (typeof s === 'string' && s.includes('!')) E.push(`exclamation mark in ${where}: ${s}`); };
  [lv.intro, lv.introNl, lv.mission && lv.mission.where, lv.mission && lv.mission.carry, lv.mission && lv.mission.want].forEach(s => bang(s, 'level text'));
  const seen = new Map(), kinds = {};
  items.forEach((it, n) => {
    const tag = `item ${n}`;
    const kind = it.dehet ? 'dehet' : it.look ? 'look' : it.read ? 'read' : it.listen ? 'listen' : it.parts ? 'build' : it.w != null ? 'word' : '?';
    kinds[kind] = (kinds[kind] || 0) + 1;
    if (kind === '?') { E.push(`${tag}: unknown kind ${JSON.stringify(it).slice(0, 80)}`); return; }
    const key = kind + ':' + (it.nl || it.en); if (seen.has(key)) W.push(`${tag}: duplicate of item ${seen.get(key)} (${key})`); else seen.set(key, n);
    for (const k of ['nl', 'en']) bang(it[k], tag); if (kind !== 'build') bang(it.w, tag);
    if (kind === 'word') { if (!it.nl) E.push(`${tag}: word without nl`); if (/^the /i.test(it.w || '') && !/^(de|het) /.test(it.nl || '')) W.push(`${tag}: "${it.w}" has no article in "${it.nl}"`); if (it.wrong && it.wrong === it.nl) E.push(`${tag}: wrong equals nl`); }
    if (kind === 'dehet') { if (!['de', 'het'].includes(it.art)) E.push(`${tag}: art must be de or het`); if (!it.nl || !it.en) E.push(`${tag}: dehet needs nl and en`); }
    if (kind === 'look') { if (!PROPS.includes(it.prop)) E.push(`${tag}: unknown prop ${it.prop}`); if (!it.nl || !it.en) E.push(`${tag}: look needs nl and en`); }
    if (kind === 'listen' && (!it.nl || !it.en)) E.push(`${tag}: listen needs nl and en`);
    if (kind === 'read') {
      if (!it.nl) E.push(`${tag}: read needs nl`);
      if (it.o) {
        if (!Array.isArray(it.o) || it.o.length < 2 || it.o.length > 3) E.push(`${tag}: read o needs 2 or 3 options`);
        else { if (!(it.a >= 0 && it.a < it.o.length)) E.push(`${tag}: read answer index out of range`); if (new Set(it.o).size !== it.o.length) E.push(`${tag}: duplicate options`); it.o.forEach(o => bang(o, tag)); }
        if (it.r && !RULES[it.r]) E.push(`${tag}: unknown rule ${it.r}`);
      } else if (!it.en) E.push(`${tag}: read needs en or o`);
    }
    if (kind === 'build') {
      const forks = it.parts.filter(p => typeof p !== 'string'); if (!forks.length) E.push(`${tag}: build without a fork`);
      const sentence = [];
      for (const p of it.parts) {
        if (typeof p === 'string') { sentence.push(p); bang(p, tag); continue; }
        if (!Array.isArray(p.o) || p.o.length < 2 || p.o.length > 3) { E.push(`${tag}: fork needs 2 or 3 options`); continue; }
        if (!(Number.isInteger(p.a) && p.a >= 0 && p.a < p.o.length)) E.push(`${tag}: fork answer index out of range`);
        if (new Set(p.o.map(s => s.trim().toLowerCase())).size !== p.o.length) E.push(`${tag}: duplicate fork options ${JSON.stringify(p.o)}`);
        if (!RULES[p.r]) E.push(`${tag}: unknown rule ${p.r}`);
        if (!p.w) W.push(`${tag}: fork without a why line`);
        p.o.forEach(o => bang(o, tag)); bang(p.w, tag);
        sentence.push(p.o[p.a] || '');
      }
      const s = sentence.join(' ').replace(/\s+([,.?])/g, '$1'); const n = words(s), max = lv.maxWords || 99;
      if (n > max + 2) E.push(`${tag}: ${n} words, max ${max}: ${s}`); else if (n > max) W.push(`${tag}: ${n} words, max ${max}: ${s}`);
      if (!it.en) E.push(`${tag}: build needs en`);
    }
  });
  if (items.length && lv.deliveries > items.length) W.push(`deliveries ${lv.deliveries} > items ${items.length}, items will repeat`);
  errors += E.length; warns += W.length;
  console.log(`${E.length ? 'FAIL' : 'ok  '} L${lv.id} ${lv.name} [${town}/${place}] items ${items.length} deliveries ${lv.deliveries} ${Object.entries(kinds).map(([k, v]) => k + ':' + v).join(' ')}`);
  E.forEach(e => console.log('   error: ' + e)); W.forEach(w => console.log('   warn:  ' + w));
}
loadErrors.forEach(e => console.log('LOAD ERROR: ' + e));
console.log(`\n${errors + loadErrors.length} errors, ${warns} warnings`);
process.exit(errors + loadErrors.length ? 1 : 0);
