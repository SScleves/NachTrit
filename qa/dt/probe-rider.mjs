// qa: close-up of the rider on the real GPU, hiding one part at a time, to find what draws a stray shape
import { chromium } from 'playwright';
const out = process.argv[2] || 'qa/out/probe', base = process.argv[3] || 'http://localhost:8775/index.html';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: false, args: ['--headless=new', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=gl'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.addInitScript(() => { localStorage.setItem('nachtrit.intro', '1'); });
await p.goto(base + '?level=75&shot=8&lane=1', { waitUntil: 'load' });
await p.waitForFunction(() => window.NR && window.NRmodels && window.NRmodels().rider, null, { timeout: 120000 });
await p.waitForTimeout(3000);
const clip = { x: 480, y: 330, width: 320, height: 320 };
const fs = await import('fs');
const snap = async n => { const u = await p.evaluate(() => { NRstep(1); return NRpost().renderer.domElement.toDataURL('image/png'); }); fs.writeFileSync(`${out}/${n}.png`, Buffer.from(u.split(',')[1], 'base64')); };
const tree = await p.evaluate(() => { const { bike } = NRbike(); const o = []; bike.traverse(c => { let d = 0, q = c; while (q !== bike) { d++; q = q.parent; } if (d <= 3) o.push('  '.repeat(d) + (c.type) + ' ' + (c.name || '') + ' vis=' + c.visible + (c.material ? ' mat=' + c.material.type + (c.material.transparent ? ' T' : '') + ' ro=' + c.renderOrder : '')); }); return o.join('\n'); });
console.log(tree);
await snap('all');
const n = await p.evaluate(() => { const { bike } = NRbike(); window.__c = []; bike.userData.head.traverse(c => { if (c.isMesh || c.isSprite) window.__c.push(c); }); bike.children.forEach(c => { if (c.visible && c !== bike.userData.head) window.__c.push(c); }); return window.__c.map(c => c.type + ':' + (c.name || c.geometry?.type || '') + '@' + c.position.toArray().map(v => v.toFixed(2)).join(',')); });
console.log(n.join(' | '));
for (let i = 0; i < n.length; i++) { await p.evaluate(i => { window.__c[i].visible = false; }, i); await snap('hide-' + i); await p.evaluate(i => { window.__c[i].visible = true; }, i); }
await b.close();
