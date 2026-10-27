// A grid of every PNG in a folder, labelled, rendered by Chrome. No image library needed.
// usage: node grid.mjs <dir> <out.png> [cols=2] [cellWidth=640]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [dir, out, colsArg, cwArg] = process.argv.slice(2);
const cols = +colsArg || 2, cw = +cwArg || 640;
const names = fs.readdirSync(dir).filter(f => f.endsWith('.png') && path.resolve(dir, f) !== path.resolve(out)).sort();
const cells = names.map(n => `<figure><img src="${pathToFileURL(path.resolve(dir, n)).href}"><figcaption>${n}</figcaption></figure>`).join('');
const html = `<html><body style="margin:0;background:#111;color:#ddd;font:13px Segoe UI">
<div style="display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:6px;padding:6px">${cells}</div>
<style>figure{margin:0} img{width:${cw}px;display:block} figcaption{padding:2px 4px}</style></body></html>`;
const tmp = path.resolve(dir, '_grid.html'); fs.writeFileSync(tmp, html);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: cols * (cw + 6) + 6, height: 400 } });
await page.goto(pathToFileURL(tmp).href); await page.waitForLoadState('load');
await page.screenshot({ path: out, fullPage: true });
await browser.close(); fs.unlinkSync(tmp);
console.log('grid:', path.resolve(out), names.length, 'frames');
