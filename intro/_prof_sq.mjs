import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
await p.goto('http://localhost:8768/intro/gallery.html?only=scene-square&t=1', { waitUntil: 'load' });
await p.waitForFunction(() => window.NRGALLERY && window.NRGALLERY.done);
const r = await p.evaluate(() => {
  const A = window.NRART, cv = document.createElement('canvas'); cv.width = 320; cv.height = 180; const ctx = cv.getContext('2d');
  for (let i = 0; i < 20; i++) A.paint(ctx, A.scenes.square, i / 60);
  const t0 = performance.now(); for (let i = 0; i < 100; i++) A.paint(ctx, A.scenes.square, i / 30); const total = (performance.now() - t0) / 100;
  window.__sqProf = {}; for (let i = 0; i < 100; i++) A.paint(ctx, A.scenes.square, i / 30);
  const o = {}; for (const k in window.__sqProf) o[k] = +(window.__sqProf[k] / 100).toFixed(3);
  // blit only
  const t1 = performance.now(); for (let i = 0; i < 100; i++) A.paint(ctx, () => {}, 0); const blit = (performance.now() - t1) / 100;
  return { total: +total.toFixed(3), blitOnly: +blit.toFixed(3), parts: o };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
