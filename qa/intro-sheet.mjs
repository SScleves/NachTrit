// The intro regression (PLAN.md phase 1.2): all 14 intro shots, each held at two times, on the real GPU through the
// installed Chrome (headless=new, ANGLE on GL, one browser), into one contact sheet, with cheap automatic checks:
//   - no page errors (page errors, console errors, failed requests, the #err box);
//   - the dogs that run beside him (NRbike().dogs) are visible only in shots 8 and 14 (shots 9 and 10 have their own sofa
//     and table dogs, which are props of those shots, not this group);
//   - in shot 9 the rider's torso is visible: drawn, and its middle inside the picture;
//   - the frame's luma (NRbright, 0 to 255) is inside the band qa/intro-bands.json gives for that shot and time.
// Look at the sheet as well: the checks catch a missing rider or a black frame, not a wrong pose.
//
// usage: node qa/intro-sheet.mjs [--base URL] [--times 2,6] [--shots 1-14] [--w 1280 --h 800] [--out dir] [--record] [--swift]
//   --base     a served index.html; without it the script serves its own working tree on a free local port
//   --record   write the measured luma into qa/intro-bands.json as new bands (after a look at the sheet says the frames are right)
//   --swift    SwiftShader in Playwright's Chromium instead of the GPU (slow, for machines without one)
// Writes <out>/s<N>-t<T>.png, <out>/sheet.png and <out>/report.json (default out: qa/out/intro-sheet/<stamp>). Exit 1 on a failed check.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BANDS_FILE = path.join(ROOT, 'qa', 'intro-bands.json');

const argv = process.argv.slice(2), flag = k => argv.includes('--' + k);
const val = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d; };
const range = s => s.split(',').flatMap(p => { const [a, b] = p.split('-').map(Number); return b ? Array.from({ length: b - a + 1 }, (_, i) => a + i) : [a]; });
const opt = {
  base: val('base', ''), times: val('times', '2,6').split(',').map(Number), shots: range(val('shots', '1-14')), w: +val('w', 1280), h: +val('h', 800),
  out: val('out', path.join(ROOT, 'qa', 'out', 'intro-sheet', new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19))), record: flag('record'), swift: flag('swift'),
};
const DOG_SHOTS = new Set([8, 14]);
const bands = fs.existsSync(BANDS_FILE) ? JSON.parse(fs.readFileSync(BANDS_FILE, 'utf8')) : { bands: {} };

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.css': 'text/css', '.woff2': 'font/woff2' };
function serve(root) {
  const srv = http.createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname), file = path.join(root, rel.endsWith('/') ? rel + 'index.html' : rel);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404, { 'Cache-Control': 'no-store' }); return res.end('not found'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    });
  });
  return new Promise(ok => srv.listen(0, '127.0.0.1', () => ok(srv)));
}

// in the page, once the shot is held: what the checks need
function probe() {
  const { bike, dogs } = NRbike(), cam = NRcam(), THREE = NRpost().THREE, v = new THREE.Vector3();
  const shown = o => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const inFrame = o => { o.getWorldPosition(v); v.project(cam); return v.z < 1 && Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1; };
  cam.updateMatrixWorld(); bike.updateMatrixWorld(true);
  const dogsOn = !!dogs && dogs.children.length > 0 && shown(dogs);
  let torso = null; for (const c of bike.children) if (c.isMesh && c.geometry && c.geometry.type === 'CapsuleGeometry') torso = c;
  return {
    dogs: dogsOn, dogsInFrame: dogsOn && dogs.children.some(inFrame), dogsLoaded: !!dogs && dogs.children.length,
    torso: !!torso && shown(torso), torsoInFrame: !!torso && shown(torso) && inFrame(torso), bike: shown(bike),
    luma: NRbright(), errBox: document.getElementById('err').textContent.trim(), cine: document.body.classList.contains('cine'),
  };
}

fs.mkdirSync(opt.out, { recursive: true });
let srv = null, base = opt.base;
if (!base) { srv = await serve(ROOT); base = `http://127.0.0.1:${srv.address().port}/index.html`; }
const browser = opt.swift
  ? await chromium.launch({ headless: true, args: ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  : await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--headless=new', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=gl'] });
console.log(`intro sheet: ${base} | ${opt.swift ? 'SwiftShader' : 'GPU (Chrome)'} | shots ${opt.shots.join(',')} at t=${opt.times.join(',')}`);
const rows = [];
let fails = 0;
try {
  for (const n of opt.shots) for (const t of opt.times) {
    const page = await browser.newPage({ viewport: { width: opt.w, height: opt.h } }), errors = [];
    page.setDefaultTimeout(120000);
    page.on('pageerror', e => errors.push('page: ' + String(e)));
    page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    page.on('response', r => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`); });
    await page.route('**/favicon.ico', r => r.fulfill({ status: 204, body: '' }));
    await page.addInitScript(() => { try { localStorage.setItem('nachtrit.intro', '1'); } catch (e) {} });
    const t0 = Date.now();
    await page.goto(`${base}?cine=${n}&t=${t}&renderer=webgl${opt.swift ? '' : '&gpu=low'}`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.NRW && window.NRbike && document.body.classList.contains('cine'), null, { timeout: 120000 }).catch(() => errors.push('harness: the shot never started'));
    await page.waitForTimeout(1500);   // a few rendered frames of the held shot
    const file = path.join(opt.out, `s${n}-t${t}.png`);
    await page.screenshot({ path: file });
    const p = await page.evaluate(probe).catch(e => ({ error: String(e) }));
    if (p.error) errors.push('harness: ' + p.error);
    if (p.errBox) errors.push('err box: ' + p.errBox.slice(0, 200));
    const key = `${n}@${t}`, band = bands.bands[key], fail = [];
    if (errors.length) fail.push(`${errors.length} error(s)`);
    if (!p.error) {
      if (!p.dogsLoaded) fail.push('the dog model did not load');
      if (DOG_SHOTS.has(n) && !p.dogs) fail.push('the dogs are hidden (they ride along in 8 and 14)');
      if (!DOG_SHOTS.has(n) && p.dogs) fail.push('the riding dogs are visible (only 8 and 14)');
      if (n === 9 && !p.torsoInFrame) fail.push(p.torso ? 'his torso is outside the picture' : 'his torso is hidden');
      if (band && !(p.luma >= band[0] && p.luma <= band[1])) fail.push(`luma ${p.luma} outside ${band[0]} to ${band[1]}`);
      if (!band && !opt.record) fail.push(`no luma band for ${key} (run once with --record)`);
    }
    if (fail.length) fails++;
    const row = { shot: n, t, file, ms: Date.now() - t0, ...p, band: band || null, fail, errors };
    rows.push(row);
    console.log(`s${String(n).padEnd(2)} t=${t}  luma ${String(p.luma).padStart(3)}${band ? ` [${band[0]}-${band[1]}]` : ''}  dogs ${p.dogs ? (p.dogsInFrame ? 'shown' : 'on, out of frame') : 'off'}${n === 9 ? `  torso ${p.torsoInFrame ? 'in frame' : p.torso ? 'out of frame' : 'hidden'}` : ''}  ${fail.length ? 'FAIL: ' + fail.join('; ') : 'ok'}`);
    for (const e of errors.slice(0, 4)) console.log('      ' + e.slice(0, 240));
    await page.close();
  }
  // the contact sheet: four frames a row (two shots, both times), labelled; a failed frame gets a red label
  const cw = 400, ch = Math.round(cw * opt.h / opt.w), cols = 2 * opt.times.length;
  const cells = rows.map(r => `<figure class="${r.fail.length ? 'bad' : ''}"><img src="${pathToFileURL(r.file).href}"><figcaption><b>${r.shot}</b> t=${r.t} · luma ${r.luma}${r.shot === 9 ? ' · torso ' + (r.torsoInFrame ? 'yes' : 'NO') : ''} · dogs ${r.dogs ? 'on' : 'off'}${r.fail.length ? ' · ' + r.fail.join('; ') : ''}</figcaption></figure>`).join('');
  const html = `<!doctype html><html><body style="margin:0;background:#111;color:#ddd;font:12px system-ui,sans-serif">
<div style="padding:6px 8px;font-size:14px">Nachtrit intro, ${rows.length} frames, ${fails} failed · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} · ${opt.swift ? 'SwiftShader' : 'GPU'}</div>
<div style="display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:6px;padding:0 6px 6px">${cells}</div>
<style>figure{margin:0} img{width:${cw}px;height:${ch}px;display:block;object-fit:cover} figcaption{padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .bad figcaption{background:#a33;color:#fff}</style></body></html>`;
  const tmp = path.join(opt.out, '_sheet.html'); fs.writeFileSync(tmp, html);
  const sp = await browser.newPage({ viewport: { width: cols * (cw + 6) + 6, height: 400 } });
  await sp.goto(pathToFileURL(tmp).href); await sp.waitForLoadState('load');
  await sp.screenshot({ path: path.join(opt.out, 'sheet.png'), fullPage: true });
  await sp.close(); fs.unlinkSync(tmp);
} finally {
  await browser.close();
  if (srv) srv.close();
}
if (opt.record) {   // a band round what was measured: 6 luma either side plus a quarter, so a lighting tweak passes and a black or blown frame does not
  const next = { note: 'Luma bands (NRbright, 0 to 255) per intro shot and time, written by node qa/intro-sheet.mjs --record after a look at the sheet. Edit by hand if a shot is relit on purpose.', recorded: new Date().toISOString().slice(0, 10), bands: { ...bands.bands } };
  for (const r of rows) if (Number.isFinite(r.luma)) { const pad = 6 + Math.round(r.luma * 0.25); next.bands[`${r.shot}@${r.t}`] = [Math.max(0, r.luma - pad), Math.min(255, r.luma + pad)]; }
  fs.writeFileSync(BANDS_FILE, JSON.stringify(next, null, 1) + '\n'); console.log('bands written:', BANDS_FILE);
}
fs.writeFileSync(path.join(opt.out, 'report.json'), JSON.stringify({ opt: { ...opt, base }, rows }, null, 1));
console.log(`\n${rows.length} frames, ${fails} failed\nsheet: ${path.join(opt.out, 'sheet.png')}`);
process.exit(fails ? 1 : 0);
