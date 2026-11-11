// The signs: G, the shared geometries of everything that spawns often (boards, posts, carts, puddles, wisps), and the labels:
// the largest font that fits a board, the sign texture, the signpost and the big sign of a fork.
import { THREE } from './engine.js?v=40';
import { M, Mat } from './materials.js?v=40';
import './rider.js?v=40';   // keeps the order the game's code runs in

// shared geometries for everything that spawns often
const G = {
  board: new THREE.PlaneGeometry(2.1, 1.02),
  boardTall: new THREE.PlaneGeometry(2.1, 1.632),   // the same letters per metre on a 512 x 400 canvas, for long options
  post: new THREE.CylinderGeometry(0.06, 0.08, 1.6, 6),
  fpost: new THREE.BoxGeometry(0.12, 0.9, 0.12),
  rail: new THREE.BoxGeometry(2.0, 0.08, 0.08),
  cartBody: new THREE.BoxGeometry(1.6, 0.7, 2.0),
  hay: new THREE.SphereGeometry(0.8, 8, 6),
  wheel: new THREE.CylinderGeometry(0.35, 0.35, 0.1, 10),
  puddle: new THREE.CircleGeometry(0.9, 14),
  wisp: new THREE.SphereGeometry(0.13, 10, 8),
  ghostBody: new THREE.ConeGeometry(0.45, 1.9, 8, 1, true),
  ghostHead: new THREE.SphereGeometry(0.22, 8, 8),
};

// ---------- labels ----------
// the largest font that fits: at most four lines; grow also shrinks a word that is wider than the board
function fitLabel(g, text, H, start, grow, plain) {
  const W = 512, pad = 30, room = (W - pad * 2) / (grow ? 0.8 : 1); let size = start, lines;   // grow: lines may be set 0.8 narrow
  const wrap = (sz) => {
    g.font = `${plain ? 'italic 900' : 'bold'} ${sz}px "Segoe UI", system-ui, sans-serif`;
    const words = text.split(' '); const out = []; let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (g.measureText(t).width > room && cur) { out.push(cur); cur = w; } else cur = t;
    }
    if (cur) out.push(cur); return out;
  };
  // grow: a word wider than the board is first narrowed (down to 0.72 of its width, as road signs do), then made smaller
  const sq = () => { let w = 0; for (const l of lines) w = Math.max(w, g.measureText(l).width); return Math.min(1, (W - pad * 2) / w); };
  do { lines = wrap(size); size -= 3; } while ((lines.length > 4 || lines.length * size * 1.15 > H - pad || (grow && sq() < 0.72)) && size > 15);
  return { lines, size: size + 3, squeeze: grow ? Math.max(0.72, sq()) : 1 };
}
// a fork sign: letters as large as the board allows; long options get the tall board when that reads larger
const fitCtx = document.createElement('canvas').getContext('2d');
function signFit(text) {
  const a = fitLabel(fitCtx, text, 250, 100, true);
  if (a.size >= 64) return { H: 250, px: a.size };
  const b = fitLabel(fitCtx, text, 400, 100, true);
  return b.size > a.size + 6 ? { H: 400, px: b.size } : { H: 250, px: a.size };
}
function labelTexture(text, opts = {}) {
  const W = 512, H = opts.H || 250, pad = 30;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  // board
  if (!opts.plain) { g.fillStyle = opts.bg || '#2b2118'; g.fillRect(0, 0, W, H); g.strokeStyle = '#5a4531'; g.lineWidth = 7; g.strokeRect(5, 5, W - 10, H - 10); }
  g.fillStyle = opts.fg || '#efe6cf'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const { lines, size, squeeze } = fitLabel(g, text, H, opts.grow || 60, !!opts.grow, opts.plain);
  const lh = size * 1.15; const y0 = H / 2 - (lines.length - 1) * lh / 2;
  lines.forEach((l, i) => { if (squeeze < 1) { g.save(); g.translate(W / 2, y0 + i * lh); g.scale(squeeze, 1); g.fillText(l, 0, 0); g.restore(); } else g.fillText(l, W / 2, y0 + i * lh); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.userData.fontPx = size; return t;   // fontPx: the drawn size, for how far off it reads
}
function signpost(text, fit) {
  const g = new THREE.Group(); fit = fit || signFit(text); const tall = fit.H === 400;
  const post = new THREE.Mesh(G.post, M.wood); post.position.y = 0.8; g.add(post);
  const tex = labelTexture(text, { H: fit.H, grow: 100 });
  const board = new THREE.Mesh(tall ? G.boardTall : G.board, Mat({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.25, side: THREE.DoubleSide }));
  board.position.y = tall ? 2.3 : 2.0; g.add(board); g.userData.board = board;   // high enough that the rider's head stays under the sign row (the post still meets the board)
  return g;
}
function bigSign(text) { // the reading board, wider, stands over the road
  const g = new THREE.Group();
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 4.2, 6), M.wood); p.position.set(s * 4.3, 2.1, 0); g.add(p); }
  const board = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.4), Mat({ map: labelTexture(text, { bg: '#1d1a22', fg: '#d8dcff' }), emissive: 0xffffff, emissiveMap: labelTexture(text, { bg: '#1d1a22', fg: '#d8dcff' }), emissiveIntensity: 0.3, side: THREE.DoubleSide }));
  board.position.y = 3.6; board.scale.set(1.5, 1, 1); g.add(board);
  return g;
}

export { bigSign, G, labelTexture, signFit, signpost };
