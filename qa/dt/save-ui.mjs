// The save in a real browser (PLAN.md phase 4 acceptance): old keys from the live site migrate on load; the word book shows
// the right count; export to a file and to a code, clear storage, import restores stars, scores, words and boxes; the
// imported save survives a reload. Saves screenshots of the word book (words, rules and save tabs, desktop and 360 px).
// One browser, the installed Chrome on the GPU (--swift for SwiftShader).
// usage: node qa/dt/save-ui.mjs [--base http://localhost:8779/index.html] [--out dir] [--swift]
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const argv = process.argv.slice(2), val = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const base = val('base', 'http://localhost:8779/index.html'), swift = argv.includes('--swift');
const out = val('out', path.join('qa', 'out', 'save-ui', new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)));
fs.mkdirSync(out, { recursive: true });

// what the live site (NR_VERSION 42) leaves in a player's browser
const LIVE = {
  'nachtrit.progress': JSON.stringify({ 1: 3, 2: 2, 3: 3, 4: 1, 5: 3, 41: 2, 42: 3, 6: 2, 7: 1, 1001: 1 }),
  'nachtrit.scores': JSON.stringify({ 1: 2435, 2: 2210, 3: 2604, 4: 1803, 5: 2980, 41: 2140, 42: 2311, 6: 2050, 7: 1700, 1001: 1622, endless: 812 }),
  'nachtrit.intro': 'short', 'nachtrit.taught': '1', 'nachtrit.go': '1', 'nachtrit.lamphint': '1',
};
const browser = await chromium.launch(swift
  ? { headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }
  : { executablePath: '/usr/bin/google-chrome', headless: true, args: ['--headless=new', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=gl'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
const page = await ctx.newPage(); page.setDefaultTimeout(120000);
const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const shots = [], shot = async name => { const f = path.join(out, name + '.png'); await page.waitForTimeout(250); await page.screenshot({ path: f }); shots.push(f); };
const url = base + '?map=1';
const ready = () => page.waitForFunction(() => window.NRsave && window.NRbook && document.getElementById('map').style.display === 'flex');
const save = () => page.evaluate(() => JSON.parse(JSON.stringify(NRsave())));
const log = (...a) => console.log(...a);

// 1. migration: the live keys, then the page
await page.goto(base.replace(/index\.html.*$/, 'voice/ids.json'));
await page.evaluate(live => { localStorage.clear(); for (const k in live) localStorage.setItem(k, live[k]); }, LIVE);
await page.goto(url); await ready();
let s = await save();
assert.deepEqual(s.stars, JSON.parse(LIVE['nachtrit.progress'])); assert.deepEqual(s.scores, JSON.parse(LIVE['nachtrit.scores']));
assert.deepEqual(s.flags, { intro: 1, taught: 1, go: 1, lamphint: 1 });
log('migration: the live keys loaded into the save without loss:', Object.keys(s.stars).length, 'levels with stars,', Object.keys(s.scores).length, 'scores, flags', JSON.stringify(s.flags));

// 2. a learner model as rides leave it: the items of the first 12 levels met, boxes 1 to 5, rules
await page.evaluate(() => {
  const S = NRsave(), ix = NRbook.index(); S.ride = 14;
  ix.rows.filter(r => r.order < 12).forEach((r, i) => { const box = 1 + (i * 7) % 5, seen = 1 + i % 4; S.items[r.key] = [box, seen, Math.max(0, seen - (box === 1 ? 1 : 0)), 14 - (i % 9)]; });
  Object.assign(S.rules, { woord: [96, 81], getal: [22, 17], groet: [14, 13], dehet: [30, 19], zijn: [12, 8], v2: [9, 4], hebben: [6, 5] });
  NRbook.persist();
});
s = await save();
const words = await page.evaluate(() => NRbook.words().length);

// 3. the word book: count, tabs, filters; desktop screenshots
await page.click('#bookbtn'); await page.waitForSelector('#book .bw');
const shown = await page.evaluate(() => ({ count: document.getElementById('b_count').textContent, rows: document.querySelectorAll('#b_list .bw').length, tab: document.getElementById('b_wn').textContent }));
assert.equal(shown.rows, words); assert.equal(shown.count, `${words} words met`);
log(`word book: "${shown.count}", ${shown.rows} rows, ${words} words in the model that are words in the content`);
await shot('book-words-desktop');
await page.selectOption('#b_box', '1');
const box1 = await page.evaluate(() => ({ count: document.getElementById('b_count').textContent, rows: document.querySelectorAll('#b_list .bw').length }));
log(`strength filter 1: "${box1.count}"`); assert.ok(box1.rows > 0 && box1.rows < words);
await page.selectOption('#b_box', ''); await page.selectOption('#b_town', 'kinderdijk');
log(`town filter Kinderdijk: "${await page.textContent('#b_count')}"`);
await shot('book-words-filtered-desktop');
await page.selectOption('#b_town', '');
await page.click('.btabs button[data-tab="rules"]'); await shot('book-rules-desktop');
log('rules tab, weakest first:', (await page.$$eval('#b_rules .br .brn', e => e.slice(0, 3).map(x => x.textContent))).join(', '));

// 4. export: file and code
await page.click('.btabs button[data-tab="save"]');
const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#b_file')]);
const file = path.join(out, dl.suggestedFilename()); await dl.saveAs(file);
await page.click('#b_mkcode'); await page.waitForFunction(() => document.getElementById('b_code').value.startsWith('NR1'));
const code = await page.inputValue('#b_code');
log(`export: file ${path.basename(file)} ${fs.statSync(file).size} bytes, code ${code.length} characters; message "${await page.textContent('#b_msg')}"`);
await shot('book-save-export-desktop');

// 5. clear storage, import the file, check, reload, check
const roundTrip = async (how) => {
  await page.evaluate(() => localStorage.clear()); await page.goto(url); await ready();
  const empty = await save(); assert.deepEqual(empty.stars, {}); assert.deepEqual(empty.items, {});
  await page.click('#bookbtn'); await page.click('.btabs button[data-tab="save"]');
  if (how === 'file') await page.setInputFiles('#b_input', file);
  else { await page.fill('#b_code', code); await page.click('#b_usecode'); }
  await page.waitForSelector('#b_yes');
  const offer = await page.textContent('#b_confirm p');
  if (how === 'code') await shot('book-save-import-confirm-desktop');
  await page.click('#b_yes'); await page.waitForFunction(() => document.getElementById('b_msg').textContent.startsWith('Loaded'));
  assert.deepEqual(await save(), s, `${how}: the imported save equals the exported one`);
  await page.goto(url); await ready();
  assert.deepEqual(await save(), s, `${how}: still there after a reload`);
  const back = await page.evaluate(() => NRbook.words().length); assert.equal(back, words);
  log(`import from the ${how}: "${offer}" -> stars, scores, flags, ride, ${Object.keys(s.items).length} items with their boxes and ${Object.keys(s.rules).length} rules restored, and kept after a reload`);
};
await roundTrip('file'); await roundTrip('code');
await page.click('#bookbtn'); await page.click('.btabs button[data-tab="save"]'); await page.fill('#b_code', code.slice(0, code.length - 30)); await page.click('#b_usecode');
log(`a cut code: "${await page.textContent('#b_msg')}"`);
// the town card of a saved town offers its trophy ride
await page.click('#b_close');
const trophy = await page.evaluate(() => { const t = window.TOWNS.find(x => x.id === 'alblasserdam'), lv = NRbook.trophyLevel(t); return { id: lv.id, deliveries: lv.deliveries, items: lv.items.length, fareK: lv.fareK, hint: lv.hint }; });
log('trophy ride, Alblasserdam:', JSON.stringify(trophy));

// 6. phone width
await page.setViewportSize({ width: 360, height: 740 });
await page.click('#bookbtn'); await page.click('.btabs button[data-tab="words"]'); await page.waitForSelector('#book .bw');
const fit = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, box: document.querySelector('#book .bbox').getBoundingClientRect().width, say: document.querySelector('#book .say').getBoundingClientRect().width, tab: document.querySelector('#book .btabs button').getBoundingClientRect().height }));
log('360 px:', JSON.stringify(fit)); assert.ok(fit.scrollW <= 360 && fit.say >= 44 && fit.tab >= 44);
await shot('book-words-360');
await page.click('.btabs button[data-tab="rules"]'); await shot('book-rules-360');
await page.click('.btabs button[data-tab="save"]'); await shot('book-save-360');
await page.click('#b_close'); await shot('map-360');
await page.setViewportSize({ width: 1280, height: 800 }); await page.waitForTimeout(300); await shot('map-desktop');

await browser.close();
log('errors:', errors.length, errors.slice(0, 5).join(' | '));
for (const f of shots) log('shot:', f);
process.exit(errors.length ? 1 : 0);
