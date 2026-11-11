// node tools/models/closeup.mjs <query> <out.png>: the rider and his dogs from four sides in the running game (one browser,
// SwiftShader), stepping a few frames between views so the pedalling and the gallop show. Serve on 8774 first.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [query = 'level=12&shot=4&lane=1', out = 'qa/out/closeup.png', target = 'rider'] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
p.on('pageerror', e => console.log('page:', String(e)));
await p.addInitScript(() => { try { localStorage.setItem('nachtrit.intro', '1'); } catch (e) {} });
await p.goto('http://localhost:8774/index.html?' + query, { waitUntil: 'load', timeout: 120000 });
await p.waitForFunction(() => window.NR && window.NRpost && [...document.images].some(i => i.style.zIndex === '1'), null, { timeout: 300000 });
const shots = await p.evaluate(target => {
  const { renderer, THREE } = NRpost(), { bike } = NRbike(), scene = bike.parent, cam = new THREE.PerspectiveCamera(32, 1.6, 0.05, 400), out = [];
  // what to look at: the rider, the nearest windmill (the object with turning sails), or the nearest house with a model gable (stone trim)
  let obj = bike, k = 1, ly = 0.85;
  if (target !== 'rider') {
    const found = []; scene.updateMatrixWorld(true);
    scene.traverse(o => { if (target === 'mill' ? o.userData && o.userData.blades : o.isMesh && o.material && o.material.color && o.material.color.getHexString() === '6f6b63') found.push(o); });
    const bp = new THREE.Vector3().setFromMatrixPosition(bike.matrixWorld);
    const at = o => { if (o.isMesh) { o.geometry.computeBoundingBox(); return o.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(o.matrixWorld); } return new THREE.Vector3().setFromMatrixPosition(o.matrixWorld); };
    found.sort((a, b) => at(a).distanceTo(bp) - at(b).distanceTo(bp)); obj = found[0];
    if (!obj) return [];
    const c = at(obj); obj = { matrixWorld: new THREE.Matrix4().makeTranslation(c.x, target === 'mill' ? 0 : c.y - 4, c.z), updateMatrixWorld() {} }; k = target === 'mill' ? 6 : 4.5; ly = target === 'mill' ? 4.5 : 4;
  }
  const views = [[0, 1.6, 4.2], [3.6, 1.3, 0.3], [-2.6, 1.5, 2.6], [0.6, 1.5, -3.6]];
  for (const [x, y, z] of views) {
    NRstep(4); obj.updateMatrixWorld(true);
    const c = new THREE.Vector3().setFromMatrixPosition(obj.matrixWorld);
    cam.position.set(c.x + x * k, c.y + y * k * 0.6 + (k > 1 ? 2 : 0), c.z + z * k); cam.lookAt(c.x, c.y + ly, c.z + 0.1);
    renderer.setRenderTarget(null); renderer.setSize(640, 400, false); renderer.render(scene, cam); out.push(renderer.domElement.toDataURL());
  }
  return out;
}, target);
// four views stacked in one HTML page, screenshotted
await p.setViewportSize({ width: 1280, height: 800 });
await p.setContent(`<body style="margin:0;display:grid;grid-template-columns:640px 640px">${shots.map(s => `<img src="${s}" width=640 height=400>`).join('')}</body>`);
await p.screenshot({ path: out }); await b.close(); console.log(out);
