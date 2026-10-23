import { chromium } from 'playwright';
const URL = process.env.NR_URL;
const browser = await chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
page.on('pageerror', e => console.log('pageerror', String(e)));
page.on('crash', () => console.log('CRASH'));
page.on('framenavigated', f => console.log('nav', f.url()));
await page.addInitScript(() => { localStorage.setItem('nachtrit.intro', '1'); const all = {}; for (let i = 1; i <= 40; i++) all[i] = 3; localStorage.setItem('nachtrit.progress', JSON.stringify(all)); });
await page.goto(URL, { waitUntil: 'load' }); await page.waitForTimeout(1500);
await page.click('#go'); await page.waitForTimeout(300);
await page.evaluate(() => goLevel(1)); await page.waitForTimeout(300);
await page.click('#m_go'); await page.waitForTimeout(900);
await page.keyboard.press('Space'); await page.waitForTimeout(150); await page.keyboard.press('Space');
for (let i = 0; i < 300 && await page.evaluate(() => NR.mode) !== 'intro'; i++) await page.waitForTimeout(100);
console.log('mode', await page.evaluate(() => NR.mode));
for (let k = 0; k < 8; k++) {
  const t = Date.now();
  const r = await page.evaluate(() => { const t0 = performance.now(); NRstep(4); const t1 = performance.now(); return { ms: Math.round(t1 - t0), mode: NR.mode, dist: Math.round(NR.dist), info: NRinfo(), heap: performance.memory && Math.round(performance.memory.usedJSHeapSize / 1e6) }; });
  console.log(Date.now() - t, JSON.stringify(r));
}
await browser.close();
