// Before/after contact sheet: one HTML page, rendered and screenshotted by Chrome. No image library needed.
// usage: node sheet.mjs <beforeDir> <afterDir> <out.png> [reference.png]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [before, after, out, ref] = process.argv.slice(2);
const names = fs.readdirSync(after).filter(f => f.endsWith('.png') && fs.existsSync(path.join(before, f))).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
const src = p => pathToFileURL(path.resolve(p)).href;
const cell = (p, label) => `<figure><img src="${src(p)}" data-luma><figcaption>${label} <b class="l"></b></figcaption></figure>`;
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#111418;color:#cfd6dd;font:13px system-ui;padding:12px}
h1{font-size:16px;margin:4px 0 10px}.row{display:grid;grid-template-columns:120px 1fr 1fr;gap:8px;align-items:center;margin-bottom:8px}
figure{margin:0}img{width:100%;display:block;border-radius:4px}figcaption{opacity:.8;margin-top:2px}.n{font-weight:600}
.ref{display:grid;grid-template-columns:120px 1fr 1fr;gap:8px;margin-bottom:12px}</style>
<h1>NachTrit world pass: before (main) and after (dt/world-pass), Intel Iris Xe, 1280x800, ?shot=8</h1>
${ref ? `<div class="ref"><div class="n">target</div>${cell(ref, 'concept D')}<div></div></div>` : ''}
${names.map(n => `<div class="row"><div class="n">${n.replace('.png', '')}</div>${cell(path.join(before, n), 'before')}${cell(path.join(after, n), 'after')}</div>`).join('\n')}
<script>
for (const img of document.querySelectorAll('img[data-luma]')) img.addEventListener('load', () => {
  const c = document.createElement('canvas'); c.width = 64; c.height = 40; const g = c.getContext('2d'); g.drawImage(img, 0, 0, 64, 40);
  const d = g.getImageData(0, 0, 64, 40).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  img.parentElement.querySelector('.l').textContent = 'luma ' + Math.round(s / (d.length / 4)); img.dataset.done = 1;
});
</script>`;
const htmlFile = path.resolve(out.replace(/\.png$/, '.html'));
fs.writeFileSync(htmlFile, html);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto(pathToFileURL(htmlFile).href);
await page.waitForFunction(() => [...document.images].every(i => i.dataset.done), null, { timeout: 60000 });
await page.screenshot({ path: out, fullPage: true });
console.log('sheet:', path.resolve(out), '| html:', htmlFile, '| rows:', names.length);
await browser.close();
