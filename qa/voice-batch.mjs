// Collect every Dutch line the game can speak and write voice/lines.json as [{id, text, voice, kind}].
// id = first 12 hex of sha1(voice + '|' + text). The hook in index.html must hash the same string (see voice/README.md).
// usage: node qa/voice-batch.mjs            (run from the repo root; npm run voice:lines)
import vm from 'node:vm'; import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const ROOT = process.cwd();
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// voices: the rider and the narrator are Maarten, passengers and read items are Fenna, the towns talk as Colette
export const VOICE = { rider: 'nl-NL-MaartenNeural', narrator: 'nl-NL-MaartenNeural', passenger: 'nl-NL-FennaNeural', town: 'nl-NL-ColetteNeural' };
export const voiceId = (voice, text) => crypto.createHash('sha1').update(voice + '|' + text, 'utf8').digest('hex').slice(0, 12);

// load the classic scripts the way the browser does (bundles replaced by their source folders, as validate-content does)
const listed = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]).filter(s => /^(data|levels|fares)\.js$|^content\/|^intro\/(art|panel-\d+)\.js$/.test(s));
const BUNDLES = { 'content/extra.js': 'content/extra', 'content/towns-new.js': 'content/new' };
for (let i = 0; i < listed.length; i++) { const dir = BUNDLES[listed[i]]; if (dir && fs.existsSync(path.join(ROOT, dir))) { const files = fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith('.js')).sort().map(f => `${dir}/${f}`); listed.splice(i, 1, ...files); i += files.length - 1; } }
const ctx = { console, Math, document: { createElement: () => ({ getContext: () => ({}) }) } }; ctx.window = ctx; vm.createContext(ctx);
for (const src of listed) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, src), 'utf8'), ctx, { filename: src }); } catch (e) { console.error(`load ${src}: ${e.message}`); process.exitCode = 1; } }

const out = new Map(), kinds = {};
const add = (text, voice, kind) => {
  if (typeof text !== 'string') return; text = text.trim(); if (!text || text === '...') return;
  const id = voiceId(voice, text); if (out.has(id)) return;
  out.set(id, { id, text, voice, kind }); kinds[kind] = (kinds[kind] || 0) + 1;
};
const sentenceOf = it => it.nl ? it.nl : it.parts.map(p => typeof p === 'string' ? p : p.o[p.a]).join(' ').replace(/\s+([,.?])/g, '$1'); // itemToEntry

// items: what settleRide speaks first (entry.nl) and the whispered right option at each fork of a build
function addItem(it) {
  if (it.dehet) return add(`${it.art} ${it.nl}`, VOICE.rider, 'dehet');
  if (it.read) return add(it.nl, VOICE.passenger, 'read');
  if (it.listen) return add(it.nl, VOICE.passenger, 'listen');
  if (it.look) return add(it.nl, VOICE.rider, 'look');
  if (it.parts) {
    add(sentenceOf(it), VOICE.rider, 'build');
    const forks = it.parts.filter(p => typeof p !== 'string');
    forks.slice(0, -1).forEach(p => add(p.o[p.a], VOICE.rider, 'fork'));   // the last fork ends the ride: the sentence is said instead
    return;
  }
  if (it.w != null) return add(it.nl, VOICE.rider, 'word');
}
for (const lv of ctx.LEVELS || []) { if (lv.soon) continue; (lv.items || []).forEach(addItem); add(lv.introNl, VOICE.narrator, 'intro'); }
(ctx.SENTENCES || []).forEach(addItem);   // endless mode

// the intro: the painted panels (NRART) and the fallback PANELS in index.html; showIntro speaks p.nl
(ctx.NRART && ctx.NRART.panels || []).forEach(p => p && add(p.nl, VOICE.narrator, 'panel'));
const pb = html.slice(html.indexOf('const PANELS = ['), html.indexOf('function showIntro('));
for (const m of pb.matchAll(/\bnl: '((?:[^'\\]|\\.)*)'/g)) add(m[1].replace(/\\'/g, "'"), VOICE.narrator, 'panel');

// towns: the rumour card the narrator reads (showLevelIntro), and every other Dutch field for the town voice
for (const t of ctx.TOWNS || []) {
  if (t.rumourNl) add(`${t.name}. Niemand is het eens over de oorzaak. Hier zeggen ze: ${t.rumourNl}`, VOICE.narrator, 'rumour');
  const walk = (o, k) => { if (typeof o === 'string') { if (k === 'nl' || /Nl$/.test(k)) add(o, VOICE.town, 'town'); } else if (o && typeof o === 'object') for (const [kk, v] of Object.entries(o)) walk(v, Array.isArray(o) ? k : kk); };
  walk(t, '');
}

// fares: every amount a passenger can name (10 cent steps up to 30 euro), the tips and the refusals
const F = ctx.FARES;
for (let c = 10; c <= 3000; c += 10) add(F.euroToWords(c / 100), VOICE.passenger, 'fare');
F.TIPS.forEach(t => add(t.nl, VOICE.passenger, 'tip')); F.REFUSE.forEach(r => add(r.nl, VOICE.passenger, 'refuse'));

// fixed lines spoken by index.html: speak('...') with a literal
for (const m of html.matchAll(/\bspeak\('((?:[^'\\]|\\.)*)'/g)) add(m[1], VOICE.narrator, 'fixed');

const lines = [...out.values()];
fs.mkdirSync(path.join(ROOT, 'voice'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'voice/lines.json'), '[\n' + lines.map(l => JSON.stringify(l)).join(',\n') + '\n]\n');
const chars = lines.reduce((n, l) => n + l.text.length, 0);
console.log(`voice/lines.json: ${lines.length} lines, ${chars} characters`);
console.log(Object.entries(kinds).map(([k, v]) => `${k} ${v}`).join(', '));
const byVoice = {}; lines.forEach(l => byVoice[l.voice] = (byVoice[l.voice] || 0) + 1); console.log(byVoice);
