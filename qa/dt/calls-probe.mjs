// Where the draw calls of one ride frame go, on the real GPU: renders the ?level=&shot= frame once with counters,
// then lists the meshes three.js would draw (visible chain, in the camera frustum), grouped by their top-level scene
// child and by geometry, worst first. Run it 3 times to see the spread between loads.
// usage: node qa/dt/calls-probe.mjs [base=http://localhost:8775/index.html] [level=12] [shot=8] [runs=1]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [base = 'http://localhost:8775/index.html', level = '12', shot = '8', runs = '1'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--headless=new', '--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=gl'] });
for (let run = 0; run < +runs; run++) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); p.setDefaultTimeout(180000);
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.addInitScript(() => { localStorage.setItem('nachtrit.intro', '1'); });
  await p.goto(`${base}?renderer=webgl&gpu=low&level=${level}&shot=${shot}&lane=1`, { waitUntil: 'load' });
  await p.waitForFunction(() => window.NR && window.NRW && window.NRpost);
  await p.waitForFunction(() => [...document.images].some(i => i.style.zIndex === '1' && i.complete), null, { timeout: 240000 }).catch(() => {});
  const r = await p.evaluate(() => {
    const { renderer, THREE } = NRpost(), { scene, camera } = NRW, info = renderer.info;
    const was = info.autoReset; info.autoReset = false; info.reset(); NRstep(1); const calls = info.render.calls; info.autoReset = was;
    camera.updateMatrixWorld(); const fr = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
    const sph = new THREE.Sphere(), byTop = {}, byGeo = {}; let n = 0;
    const vis = o => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
    scene.traverse(o => {
      if (!(o.isMesh || o.isSprite || o.isPoints || o.isLine) || !vis(o)) return;
      if (o.frustumCulled && o.geometry) { if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); sph.copy(o.geometry.boundingSphere).applyMatrix4(o.matrixWorld); if (!fr.intersectsSphere(sph)) return; }
      const m = Array.isArray(o.material) ? o.material.length : 1; n += m;
      let top = o; while (top.parent && top.parent !== scene) top = top.parent;
      const tk = (top.name || top.userData.kind || top.type) + (top === o ? '' : ' (group)');
      byTop[tk] = (byTop[tk] || 0) + m;
      const gk = (o.geometry ? o.geometry.type + ' ' + (o.geometry.name || o.geometry.uuid.slice(0, 6)) : o.type) + (o.isInstancedMesh ? ' inst' : '');
      byGeo[gk] = (byGeo[gk] || 0) + m;
    });
    const top = o => Object.entries(o).sort((a, c) => c[1] - a[1]).slice(0, 18);
    const worst = top(byGeo).slice(0, 4).map(([k]) => { const id = k.split(' ')[1]; let ex = null, n = 0, mats = new Set(), parents = new Set();
      scene.traverse(o => { if (o.geometry && o.geometry.uuid.startsWith(id)) { n++; ex = ex || o; mats.add((o.material.name || o.material.type) + ':' + (o.material.color ? o.material.color.getHexString() : '')); parents.add((o.parent.name || o.parent.type) + '/' + o.parent.children.length); } });
      return `${k}: ${n} meshes, ${ex.geometry.attributes.position.count} verts, y ${ex.position.y.toFixed(2)}, mats ${[...mats].slice(0, 4).join(',')}, parents ${[...parents].slice(0, 4).join(',')}`; });
    return { calls, meshesInView: n, topLevel: scene.children.length, byTop: top(byTop), byGeo: top(byGeo), worst };
  });
  console.log(`run ${run + 1}: L${level} calls ${r.calls}, meshes in view ${r.meshesInView}, scene children ${r.topLevel}, errors ${errs.length}`);
  console.log('  by scene child: ' + r.byTop.map(([k, v]) => `${k} ${v}`).join(' | '));
  console.log('  by geometry:    ' + r.byGeo.map(([k, v]) => `${k} ${v}`).join(' | '));
  for (const w of r.worst) console.log('  worst: ' + w);
  await p.close();
}
await b.close();
