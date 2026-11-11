// node tools/models/preview.mjs rider,dog out.png [distance] [lookY]: a PNG of preview.html, served by serve.py on 8774
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [m = 'rider', out = 'qa/out/preview.png', d = '4', y = '1', spread = '0'] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1600, height: 400 * m.split(',').length } });
p.on('pageerror', e => console.log('page:', String(e)));
await p.goto(`http://localhost:8774/tools/models/preview.html?m=${m}&d=${d}&y=${y}&spread=${spread}`);
await p.waitForFunction(() => window.DONE, null, { timeout: 120000 });
await p.screenshot({ path: out }); await b.close(); console.log(out);
