// Browser-side balance bot for the lamp. Load in the page console:
//   fetch('/qa/lampbot.js').then(r => r.text()).then(eval)
// then:  __sim('name', collectWisps, msBudget)   (call repeatedly until mode !== 'ride')
(() => {
  window.__nl = window.__nl || 3;
  window.__bot = (collect) => {
    const g = NR.activeFork;
    if (g) { const p = g.posts.find(q => q.oi === g.fork.a); if (p) NR.lane = p.lane; return; }
    const near = NR.objs.filter(o => !o.hit && o.type && o.d - NR.dist > 0 && o.d - NR.dist < 26);
    const bad = l => near.some(o => (o.type === 'obstacle' || o.type === 'puddle') && o.lane === l && o.d - NR.dist < 22);
    if (bad(NR.lane)) {
      const free = [0, 1, 2].slice(0, window.__nl).filter(l => !bad(l));
      if (free.length) NR.lane = free.sort((a, b) => Math.abs(a - NR.lane) - Math.abs(b - NR.lane))[0];
      return;
    }
    if (collect) { const w = near.filter(o => o.type === 'wisp' && !bad(o.lane)); if (w.length) NR.lane = w.sort((a, b) => a.d - b.d)[0].lane; }
  };
  window.__runs = {};
  window.__sim = (key, collect, ms) => {
    const r = __runs[key] || (__runs[key] = { n: 0, minL: 100, traj: [] });
    const t0 = performance.now();
    while (performance.now() - t0 < ms && NR.mode === 'ride') {
      __bot(collect); NRstep(12); r.n += 12; r.minL = Math.min(r.minL, NR.lamp);
      if (r.n % 360 === 0) r.traj.push(Math.round(NR.dist) + ':' + NR.delivered + ':' + Math.round(NR.lamp));
    }
    return { mode: NR.mode, dist: Math.round(NR.dist), del: NR.delivered + '/' + NR.deliveriesTotal, lamp: Math.round(NR.lamp), minL: Math.round(r.minL), good: NR.good, bad: NR.bad, traj: r.traj.join(' ') };
  };
})();
