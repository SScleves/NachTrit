// Load the content scripts the way the browser does (classic scripts in a vm context), in play order.
// Shared by the qa/audit-*.mjs tools. No browser, no dependencies.
import vm from 'node:vm'; import fs from 'node:fs'; import path from 'node:path';

export const TOWN_OF = id => id === 41 ? 'alblasserdam' : id <= 5 ? 'alblasserdam' : id <= 10 ? 'kinderdijk' : id <= 15 ? 'gouda' : id <= 20 ? 'utrecht' : id <= 30 ? 'rotterdam' : 'amsterdam';

export function loadContent(root = process.cwd()) {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const listed = [...html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)].map(m => m[1]).filter(s => /^(data|levels)\.js$|^content\//.test(s));
  const BUNDLES = { 'content/extra.js': 'content/extra', 'content/towns-new.js': 'content/new' };
  for (let i = 0; i < listed.length; i++) { const dir = BUNDLES[listed[i]]; if (dir && fs.existsSync(path.join(root, dir))) { const files = fs.readdirSync(path.join(root, dir)).filter(f => f.endsWith('.js')).sort().map(f => `${dir}/${f}`); listed.splice(i, 1, ...files); i += files.length - 1; } }
  const ctx = { console }; ctx.window = ctx; vm.createContext(ctx);
  // remember which source file defined or extended each item, so reports can point at it
  let current = null;
  for (const src of listed) {
    current = src;
    const code = fs.readFileSync(path.join(root, src), 'utf8');
    vm.runInContext(code, ctx, { filename: src });
    for (const lv of ctx.LEVELS || []) for (const it of lv.items || []) if (it && typeof it === 'object' && !Object.prototype.hasOwnProperty.call(it, '__src')) Object.defineProperty(it, '__src', { value: current, enumerable: false });
  }
  const towns = (ctx.TOWNS || []).slice().sort((a, b) => a.tier - b.tier);
  const playable = (ctx.LEVELS || []).filter(l => !l.soon && (l.items || []).length);
  // play order: towns by tier, levels of a town in LEVELS order (as townLevels() in index.html)
  const levels = [];
  for (const t of towns) for (const l of playable) if ((l.town || TOWN_OF(l.id)) === t.id) levels.push(Object.assign(l, { _town: t.id, _tier: t.tier, _townName: t.name }));
  levels.forEach((l, i) => { l._order = i; });
  return { ctx, RULES: ctx.RULES || {}, towns, levels };
}

// every fork a level can show, as the engine builds them from items (word/look/listen forks have
// distractors drawn at random from the level; we record the item's own `wrong` if set)
export function forksOf(item) {
  if (item.parts) return item.parts.filter(p => typeof p !== 'string').map((p, i) => ({ o: p.o, a: p.a, r: p.r, w: p.w, task: p.task, entry: item, idx: i }));
  if (item.read && item.o) return [{ o: item.o, a: item.a || 0, r: item.r || 'woord', w: item.w, task: item.task, read: true, entry: item, idx: 0 }];
  return [];
}
export function kindOf(it) { return it.dehet ? 'dehet' : it.look ? 'look' : it.read ? 'read' : it.listen ? 'listen' : it.parts ? 'build' : it.w != null ? 'word' : '?'; }
export function sentenceOf(it) {
  if (it.parts) return it.parts.map(p => typeof p === 'string' ? p : p.o[p.a]).join(' ').replace(/\s+([,.?!])/g, '$1').replace(/\s+/g, ' ').trim();
  if (it.dehet) return `${it.art} ${it.nl}`;
  return it.nl || '';
}
// every word that appears in right text (sentence parts, right answers, item nl): if the content uses it as right Dutch,
// it is a word, whatever the list says (a missing compound, a name). Lower case.
export function contentWords(levels) {
  const set = new Set(), add = s => String(s || '').replace(/[“”"«»(),.?!:;…–—]/g, ' ').split(/\s+/).map(t => t.replace(/^'+(?=[a-zà-ÿ]{2,})|'+$/gi, '').toLowerCase()).filter(Boolean).forEach(t => set.add(t));
  for (const lv of levels) for (const it of lv.items) { if (it.parts) it.parts.forEach(p => add(typeof p === 'string' ? p : p.o[p.a])); else if (!(it.read && it.o)) add(it.nl); else add(it.nl); }
  return set;
}
