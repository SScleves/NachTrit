// Browser-side reading-time bot: rides a level on autopilot (always right) and logs, for every fork, how long
// the sign text was legible against the fork's reading budget. Load in the page:
//   fetch('/qa/readbot.js').then(r => r.text()).then(eval)
// then __read(collectWisps, msBudget) in chunks until mode !== 'ride'; __readLog() gives one row per fork.
// Legible: the smallest sign of the fork shows its letters (the em of the drawn font) at least READ_THR of the
// viewport height (1.25 percent: 10 px on an 800 px window, the smallest UI text size that reads; the boards are bold light-on-dark), its centre
// is on screen, and it is still READ_AHEAD m or more in front of the bike (room to change lane).
(() => {
  const THREE = NRpost().THREE, cam = NRcam(), v = new THREE.Vector3();
  const READ_THR = window.READ_THR || 0.0125, READ_AHEAD = 2;
  const emOf = p => { const b = p.mesh.userData.board; return ((b.material.map && b.material.map.userData.fontPx) || 60) / 250 * 1.02 * p.mesh.scale.y; };   // G.board is 2.1 x 1.02 m over a 512 x 250 canvas
  const frac = p => {   // projected em height as a fraction of the viewport height
    const m = p.mesh, y = m.position.y + m.userData.board.position.y * m.scale.y;
    v.set(m.position.x, y, m.position.z).project(cam); if (v.z > 1 || Math.abs(v.x) > 1 || Math.abs(v.y) > 1) return 0;
    const y0 = v.y; v.set(m.position.x, y + emOf(p), m.position.z).project(cam); return (v.y - y0) / 2;
  };
  const words = o => o.reduce((n, t) => n + String(t).trim().split(/\s+/).length, 0);
  const ownBudget = f => { const e = f.entry || {}; if (e.dehet || e.word) return 3; let b = Math.min(7, Math.max(3, 0.35 * words(f.o) + 1.2)); if (f.read || e.listen) b *= 1.5; return b; };
  const kindOf = f => f.read ? 'read' : f.entry.listen ? 'listen' : f.entry.dehet ? 'dehet' : f.entry.look ? 'look' : f.entry.word ? 'word' : 'build';
  const rows = window.__readRows = [], seen = new Map();
  let lastG = null;
  function sample() {
    const g = NR.activeFork;
    if (lastG && lastG !== g) { const r = seen.get(lastG); if (r && !r.done) { r.done = true; rows.push(r); } }
    lastG = g; if (!g || NR.mode !== 'ride') return;
    let r = seen.get(g);
    if (!r) { const f = g.fork; r = { kind: kindOf(f), words: words(f.o), budget: f.budget || ownBudget(f), pred: g.legD != null ? Math.round(g.legD * 10) / 10 : '-', leg: 0, legFrom: null, minV: 99, teach: !!g.teach, text: f.o.join(' / ').slice(0, 60), slow: null }; seen.set(g, r); }
    const z = NR.dist - g.d; cam.updateMatrixWorld();
    const vNow = NR.speed * NR.slow; r.minV = Math.min(r.minV, vNow);
    if (z <= -READ_AHEAD) {
      let m = 1; for (const p of g.posts) m = Math.min(m, frac(p));
      if (m >= READ_THR) { r.leg += 1 / 60; if (r.legFrom == null) { r.legFrom = Math.round(-z * 10) / 10; r.vAt = Math.round(vNow * 10) / 10; } }
    }
  }
  window.__readBot = (collect) => {
    const g = NR.activeFork, nl = LANES();
    if (g) { const p = g.posts.find(q => q.oi === g.fork.a); if (p) NR.lane = p.lane; return; }
    const near = NR.objs.filter(o => !o.hit && o.type && o.d - NR.dist > 0 && o.d - NR.dist < 26);
    const bad = l => near.some(o => (o.type === 'obstacle' || o.type === 'puddle') && o.lane === l && o.d - NR.dist < 22);
    if (bad(NR.lane)) { const free = [0, 1, 2].slice(0, nl).filter(l => !bad(l)); if (free.length) NR.lane = free.sort((a, b) => Math.abs(a - NR.lane) - Math.abs(b - NR.lane))[0]; return; }
    if (collect) { const w = near.filter(o => o.type === 'wisp' && !bad(o.lane)); if (w.length) NR.lane = w.sort((a, b) => a.d - b.d)[0].lane; }
  };
  const LANES = () => [...document.querySelectorAll('#lanes div')].filter(d => d.style.display !== 'none').length || 3;
  window.__read = (collect, ms, lampFloor) => {
    const t0 = performance.now();
    while (performance.now() - t0 < ms && (NR.mode === 'ride' || NR.mode === 'intro')) {
      __readBot(collect); if (lampFloor) NR.lamp = Math.max(NR.lamp, lampFloor);
      NRstep(20, sample);
    }
    return { mode: NR.mode === 'dying' && NR.dieT >= 10 ? 'home' : NR.mode, dist: Math.round(NR.dist), del: NR.delivered + '/' + NR.deliveriesTotal, forks: rows.length };
  };
  window.__readLog = () => rows.map(r => ({ ...r, budget: Math.round(r.budget * 10) / 10, leg: Math.round(r.leg * 10) / 10, minV: Math.round(r.minV * 10) / 10 }));
})();
