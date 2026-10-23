import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
await p.addInitScript(() => { window.__sqMagenta = true; window.__sqSkipMill = true; });
await p.goto('http://localhost:8768/intro/gallery.html?only=scene-square&t=1.5', { waitUntil: 'load' });
await p.waitForFunction(() => window.NRGALLERY && window.NRGALLERY.done);
await p.locator('figure').first().screenshot({ path: process.argv[2] });
await b.close();
