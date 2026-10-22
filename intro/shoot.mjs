// Shoot the intro art from intro/gallery.html in headless Chromium.
// usage: node intro/shoot.mjs <panel-N | scene-NAME | cast | props | all> [t ...] [--bench] [--scale=4]
//   node intro/shoot.mjs panel-3 0 2.5 5     three frames of panel 3
//   node intro/shoot.mjs all 2               the contact sheet at t = 2
//   node intro/shoot.mjs all --bench         milliseconds per frame for every piece
// Writes intro/out/<name>-t<t>.png and prints the paths and any console errors.
// Needs the game server: NR_GALLERY overrides http://localhost:8768/intro/gallery.html
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, 'out');
const args = process.argv.slice(2);
const bench = args.includes('--bench');
const scaleArg = (args.find(a => a.startsWith('--scale=')) || '').split('=')[1];
const rest = args.filter(a => !a.startsWith('--'));
const name = rest[0] || 'all';
const times = rest.slice(1).length ? rest.slice(1) : (bench ? [] : ['2']);
const base = process.env.NR_GALLERY || 'http://localhost:8768/intro/gallery.html';
if (!/^(all|cast|props|panel-[1-9]\d*|scene-[a-z]+)$/.test(name)) { console.error('usage: node intro/shoot.mjs <panel-N|scene-NAME|cast|props|all> [t ...] [--bench] [--scale=4]'); process.exit(2); }
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: name === 'all' ? 2000 : Math.max(1000, 340 * (+scaleArg || 3)), height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(String(e && e.stack || e)));
page.on('requestfailed', r => errors.push('request failed: ' + r.url()));
page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });

const query = extra => base + (name === 'all' ? '?all=1' : `?only=${name}`) + (scaleArg ? `&scale=${scaleArg}` : '') + extra;
try {
  for (const t of times) {
    await page.goto(query(`&t=${encodeURIComponent(t)}`), { waitUntil: 'load' });
    await page.waitForFunction(() => window.NRGALLERY && window.NRGALLERY.done, null, { timeout: 30000 });
    const file = path.join(outDir, `${name}-t${t}.png`);
    if (name === 'all') await page.screenshot({ path: file, fullPage: true });
    else await page.locator('figure').first().screenshot({ path: file });
    console.log(file);
  }
  if (bench) {
    await page.goto(query('&t=0&bench=1'), { waitUntil: 'load' });
    await page.waitForFunction(() => window.NRGALLERY && window.NRGALLERY.benchDone, null, { timeout: 180000 });
    console.log(await page.evaluate(() => window.NRGALLERY.benchText));
  }
  const pieceErrors = await page.evaluate(() => (window.NRGALLERY && window.NRGALLERY.errors) || []);
  for (const e of pieceErrors) if (!errors.some(x => x.includes(e))) errors.push(e);
} catch (e) { errors.push('shoot: ' + (e && e.stack || e)); }
await browser.close();
console.log(errors.length ? `console errors: ${errors.length}\n` + errors.map(e => '  ' + e).join('\n') : 'console errors: 0');
process.exitCode = errors.length ? 1 : 0;
