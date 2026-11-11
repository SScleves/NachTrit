// The sky: a painted dome that follows the camera, the aurora band, and paintSky, which repaints the dome for a town's haze,
// stars, glows, clouds and moon.
import { clamp, THREE } from './engine.js?v=40';
import { scene } from './render.js?v=40';

// ---------- the sky: a painted dome that follows the camera ----------
// pale haze at the horizon (exactly the fog colour, so the far town melts into it), a little bluer above, a darker cold slate overhead,
// a faint moon in a soft halo and a few soft cloud bands. Unlit, no fog; nightDepth() dims it through its colour.
const SKY_W = 2048, SKY_H = 1024, SKY_THETA = Math.PI * 0.58;   // the dome covers the top 104 degrees: everything above the horizon and a little below
const skyCanvas = document.createElement('canvas'); skyCanvas.width = SKY_W; skyCanvas.height = SKY_H;
const skyTex = new THREE.CanvasTexture(skyCanvas); skyTex.colorSpace = THREE.SRGBColorSpace;
const skyDome = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 20, 0, Math.PI * 2, 0, SKY_THETA), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false }));
skyDome.frustumCulled = false; skyDome.renderOrder = -10;
skyDome.onBeforeRender = (r, s, cam) => { skyDome.matrixWorld.setPosition(cam.position); };   // centred on the eye, every view, every frame
scene.add(skyDome);
// the aurora: green curtains with a violet top low over the horizon, drifting and breathing; a town's sky turns it on (sky.aurora, sky.auroraAz)
const aurora = (() => {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 256; const g = c.getContext('2d');
  let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 260; i++) {
    const x = r() * 1024, w = 2 + r() * 8, top = 20 + r() * 140, a = 0.05 + r() * 0.12, gr = g.createLinearGradient(0, 256, 0, top);
    gr.addColorStop(0, 'rgba(60,255,150,0)'); gr.addColorStop(0.1, `rgba(80,255,165,${a})`); gr.addColorStop(0.55, `rgba(110,235,180,${a * 0.55})`); gr.addColorStop(1, 'rgba(170,90,210,0)');
    g.fillStyle = gr; for (const off of [-1024, 0, 1024]) g.fillRect(x + off, top, w, 256 - top);
  }
  g.globalCompositeOperation = 'destination-in';   // soft ends, so the sector has no edge
  const fade = g.createLinearGradient(0, 0, 1024, 0); fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(0.25, 'rgba(0,0,0,1)'); fade.addColorStop(0.75, 'rgba(0,0,0,1)'); fade.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = fade; g.fillRect(0, 0, 1024, 256);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const geo = new THREE.CylinderGeometry(250, 250, 75, 48, 1, true, Math.PI - 0.95, 1.9); geo.translate(0, 75 / 2 - 6, 0);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false, side: THREE.BackSide, blending: THREE.AdditiveBlending, opacity: 0 }));
  m.renderOrder = -9.8; m.frustumCulled = false; m.visible = false; m.userData.k = 0; scene.add(m); return m;
})();
// o (a town or theme can set it): stars (true or a count), milkyWay 0 to 1 (with milkyWayAz), aurora 0 to 1 (with auroraAz),
// glows [{ az, el, w, h, color, a }] (greenhouses, a port, a city under the clouds), clouds 0 to 1 (default 1), moon (default true)
function paintSky(fogHex, o) {
  if (typeof o !== 'object' || !o) o = { stars: !!o };
  const g = skyCanvas.getContext('2d'), W = SKY_W, H = SKY_H;
  const h = [(fogHex >> 16) & 255, (fogHex >> 8) & 255, fogHex & 255];   // sRGB components, as painted
  const rgb = (c, a) => `rgba(${c.map(Math.round).join(',')},${a == null ? 1 : a})`;
  const yOf = elev => (90 - elev) / (SKY_THETA * 180 / Math.PI) * H;                 // canvas row of an elevation in degrees
  const mid = [h[0] + 1, h[1] + 3, h[2] + 5], top = [h[0] * 0.76, h[1] * 0.8, h[2] * 0.86];
  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, rgb(top)); gr.addColorStop(yOf(55) / H, rgb(top)); gr.addColorStop(yOf(22) / H, rgb(mid)); gr.addColorStop(yOf(9) / H, rgb(mid));
  gr.addColorStop(yOf(1.5) / H, rgb(h)); gr.addColorStop(1, rgb(h));
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const px = W / 360, py = H / (SKY_THETA * 180 / Math.PI);   // pixels per degree across and up
  // the camera looks down -z, which is u = 0.75 on the sphere; positive az is to the left on screen
  const xOf = az => (0.75 + az / 360) * W;
  const blob = (az, el, w, hh, c, a) => { const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1); rg.addColorStop(0, rgb(c, a)); rg.addColorStop(1, rgb(c, 0)); for (const off of [-W, 0, W]) { g.save(); g.translate(xOf(az) + off, yOf(el)); g.scale(w * px / 2, hh * py); g.fillStyle = rg; g.beginPath(); g.arc(0, 0, 1, 0, 7); g.fill(); g.restore(); } };
  const hex3 = c => [(c >> 16) & 255, (c >> 8) & 255, c & 255];
  for (const gl of o.glows || []) blob(gl.az || 0, gl.el || 0, gl.w || 70, gl.h || 9, hex3(gl.color || 0xff9a50), gl.a == null ? 0.22 : gl.a);   // light from below the horizon
  let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // the Milky Way: a pale band rising from the horizon across the low sky in front of the rider, dense faint stars in it and darker dust lanes
  const mw = o.milkyWay || 0, mwAz = o.milkyWayAz == null ? -55 : o.milkyWayAz;
  const mwEl = az => clamp((mwAz - az) * 0.42, -4, 80);   // where the band's spine is at an azimuth (it climbs to the left)
  if (mw) {
    for (let az = mwAz - 2; az > mwAz - 190; az -= 3) { const e = mwEl(az); if (e > 75) break; blob(az, e, 30, 10, [200, 210, 228], 0.09 * mw); blob(az, e + 1, 14, 4.5, [228, 230, 238], 0.1 * mw); }
    for (let i = 0; i < 3600 * mw; i++) { const az = mwAz - r() * 180, e = mwEl(az) + (r() + r() + r() - 1.5) * 9; if (e < 0.5 || e > 80) continue; g.fillStyle = `rgba(232,236,246,${0.12 + r() * 0.4})`; g.fillRect(xOf(az), yOf(e), 1 + (r() < 0.1), 1 + (r() < 0.1)); }
    for (let az = mwAz - 6; az > mwAz - 160; az -= 2) { const e = mwEl(az) + Math.sin(az * 0.21) * 1.6; blob(az, e, 7, 1.2, h.map(v => v * 0.55), 0.2 * mw); }   // the dust lanes
  }
  // stars: true for a few, or a count; low ones too, because the camera mostly sees the first 25 degrees above the horizon
  const ns = o.stars === true ? 260 : (o.stars || 0);
  for (let i = 0; i < ns; i++) { const e = (ns > 300 ? 2 : 14) + Math.pow(r(), ns > 300 ? 1.4 : 1) * 70, a = r() * 360 - 180, b = r(); g.fillStyle = `rgba(220,228,240,${0.08 + b * (ns > 300 ? 0.5 : 0.22)})`; const sz = b > 0.97 ? 3 : 2; g.fillRect(xOf(a), yOf(e), sz, sz); }
  // the aurora's steady glow, low over the horizon; the moving curtains are a separate band (see aurora)
  if (o.aurora) { const aaz = o.auroraAz == null ? 25 : o.auroraAz; blob(aaz, 3, 110, 11, [70, 230, 150], 0.16 * o.aurora); blob(aaz - 10, 9, 70, 8, [120, 120, 210], 0.06 * o.aurora); }
  // soft cloud bands: long low-contrast streaks, a lighter top and a darker underside
  seed = 3; const rr = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const nc = Math.round(16 * (o.clouds == null ? 1 : o.clouds));
  for (let i = 0; i < nc; i++) {
    const e = 6 + rr() * 26, a = rr() * 360 - 180, w = (40 + rr() * 70) * px, hh = (1.2 + rr() * 2.2) * py;
    for (const [dy, c, al] of [[0, [h[0] + 14, h[1] + 16, h[2] + 18], 0.16], [hh * 0.45, [h[0] * 0.82, h[1] * 0.85, h[2] * 0.9], 0.12]]) {
      const cx = xOf(a), cy = yOf(e) + dy, rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
      rg.addColorStop(0, rgb(c, al)); rg.addColorStop(1, rgb(c, 0));
      for (const off of [-W, 0, W]) { g.save(); g.translate(cx + off, cy); g.scale(w / 2, hh); g.fillStyle = rg; g.beginPath(); g.arc(0, 0, 1, 0, 7); g.fill(); g.restore(); }
    }
  }
  // the moon: up and to the left of the road, small and veiled, in a wide soft halo
  const mx = xOf(24), my = yOf(17);
  for (const [rad, a] of [[14, 0.07], [6, 0.1], [2.4, 0.14]]) {
    const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1); rg.addColorStop(0, `rgba(222,228,232,${a})`); rg.addColorStop(1, 'rgba(222,228,232,0)');
    g.save(); g.translate(mx, my); g.scale(rad * px, rad * py); g.fillStyle = rg; g.beginPath(); g.arc(0, 0, 1, 0, 7); g.fill(); g.restore();
  }
  g.save(); g.translate(mx, my); g.scale(0.75 * px, 0.75 * py); g.fillStyle = 'rgba(214,220,220,0.42)'; g.beginPath(); g.arc(0, 0, 1, 0, 7); g.fill(); g.restore();
  skyTex.needsUpdate = true;
}

export { aurora, paintSky, skyDome };
