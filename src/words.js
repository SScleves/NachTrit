// Words come back during the ride (PLAN.md phase 5 item 1), the picture of intro shot 11 in play: a ride starts with two street
// lamps in three dead and every shop sign blank; a right answer sends its Dutch word off the sign as a small golden glyph, up the
// street to the nearest dark lamp or blank shop sign, and that one catches: the lamp burns, the sign gets its trade back. It stays
// so for the rest of the ride (the scenery keeps it as it comes round again). No light is added: a dead lamp is its halo swapped
// for a dim one and its cone, pool and reflection hidden, a lit one is the shared lamp materials again; the glyph is a pooled
// sprite. The pure rules (which lamps start dead, which one a word flies to) are in src/payoff.js.
// No Math.random here: a seeded ride draws the same numbers with or without it.
import { deadAtStart, GLYPH, glyphNear, ownDraws, pickGlyphTarget } from './payoff.js?v=44';
import { clamp, smooth, THREE } from './engine.js?v=44';
import { scene } from './render.js?v=44';
import { GlowMat, glowTex } from './materials.js?v=44';
import { LAMP_CONE_MAT, LAMP_HALO_MAT, LAMP_POOL_MAT, LAMP_STREAK_MAT, PM } from './props.js?v=44';
import { scenery } from './scenery.js?v=44';
import './plan.js?v=44';   // keeps the order the game's code runs in

// ---------- shared materials: a dead lamp, a blank sign, the glyph's halo ----------
// (all made in ownDraws: three.js draws Math.random for every uuid, and a seeded ride must not see these)
const [DEAD_HALO_MAT, DEAD_HEAD_MAT, GLYPH_HALO_MAT] = ownDraws(() => [GlowMat(glowTex, 0x7c8796, 0.14, true), new THREE.MeshBasicMaterial({ color: 0x2b2f35 }), GlowMat(glowTex, 0xffc860, 0.9, true)]);
for (const m of [DEAD_HALO_MAT, DEAD_HEAD_MAT, GLYPH_HALO_MAT]) m.userData.shared = true;   // the glass of a dead lamp catches a little haze, no more
const BLANK_SIGN = ownDraws(() => {   // a shop board with its words gone: the paint and the frame, nothing on it
  const c = document.createElement('canvas'); c.width = 512; c.height = 250; const g = c.getContext('2d');
  g.fillStyle = '#16181c'; g.fillRect(0, 0, 512, 250); g.strokeStyle = '#3a3128'; g.lineWidth = 7; g.strokeRect(5, 5, 502, 240);
  g.fillStyle = 'rgba(212,205,185,0.05)'; g.fillRect(60, 95, 392, 60);   // where the letters were, a little less dirty
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; return t;
});

// ---------- what can be lit in this ride's street ----------
// a unit: a lamp (its halo sprite, the cone, pool and reflection beside it, a lamp head mesh if it has one of its own) or a shop
// sign (its board and its own word texture). z, busy and lit are what pickGlyphTarget reads.
let units = [];
const SIGN_EMI = 0.45;
function findUnits() {
  const out = [];
  for (const o of scenery) {
    o.mesh.traverse(m => {
      if (m.isSprite && m.material === LAMP_HALO_MAT) {
        const sib = m.parent.children, at = sib.indexOf(m), parts = [];
        for (let j = at + 1; j < sib.length && parts.length < 3; j++) { const q = sib[j].material; if (q === LAMP_CONE_MAT || q === LAMP_POOL_MAT || q === LAMP_STREAK_MAT) parts.push(sib[j]); else break; }
        const heads = sib.filter(h => h.isMesh && h.material === PM.lampHead);
        out.push({ lamp: true, root: o.mesh, node: m, parts, heads, sx: m.scale.x, sy: m.scale.y, lit: true, busy: false, z: 0, catchT: 0 });
      } else if (m.isMesh && m.userData.shopWord && m.material.map) {
        m.userData.ownMap = m.material.map;   // scenery.js disposes this one, not the shared blank, when the street is cleared
        out.push({ lamp: false, root: o.mesh, node: m, tex: m.material.map, lit: true, busy: false, z: 0, catchT: 0 });
      }
    });
  }
  return out;
}
function setLamp(u, on) {
  u.lit = on; u.node.material = on ? LAMP_HALO_MAT : DEAD_HALO_MAT;
  for (const p of u.parts) p.visible = on;
  for (const h of u.heads) h.material = on ? PM.lampHead : DEAD_HEAD_MAT;
}
function setSign(u, on) {
  u.lit = on; const m = u.node.material; m.map = m.emissiveMap = on ? u.tex : BLANK_SIGN; m.emissiveIntensity = on ? SIGN_EMI : 0.08;
}
// a ride starts: find the street's lamps and shop signs and put the language out of them (a dawn ride keeps them all lit)
function wordsStart(dawn) {
  for (const g of glyphs) endGlyph(g);
  units = findUnits(); let li = 0;
  for (const u of units) {
    if (u.lamp) setLamp(u, dawn || !deadAtStart(li++)); else setSign(u, !!dawn);
  }
  return units.length;
}

// ---------- the glyphs: a small pool, each a word sprite with its own canvas and a halo ----------
const GLYPH_N = 4, GH = 128, GW = 512;
const glyphs = [];
ownDraws(() => { for (let i = 0; i < GLYPH_N; i++) {
  const c = document.createElement('canvas'); c.width = GW; c.height = GH;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter;
  const mat = GlowMat(tex, 0xffe6b0, 1, true); mat.userData.shared = true;
  const word = new THREE.Sprite(mat), halo = new THREE.Sprite(GLYPH_HALO_MAT);
  word.visible = halo.visible = false; word.renderOrder = halo.renderOrder = 6; word.frustumCulled = halo.frustumCulled = false;
  scene.add(halo); scene.add(word);
  glyphs.push({ c, g: c.getContext('2d'), tex, word, halo, on: false, t: 0, unit: null, relight: false, aspect: 1, from: new THREE.Vector3() });
} });
function paintGlyph(G, text) {
  const g = G.g; g.clearRect(0, 0, GW, GH);
  let fs = 74; g.font = `600 ${fs}px "Segoe UI", system-ui, sans-serif`;
  while (g.measureText(text).width > GW - 40 && fs > 30) { fs -= 4; g.font = `600 ${fs}px "Segoe UI", system-ui, sans-serif`; }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = 'rgba(255,170,70,1)'; g.shadowBlur = 18; g.fillStyle = '#ffd88a'; g.fillText(text, GW / 2, GH / 2);
  g.shadowBlur = 0; g.fillStyle = '#fff6dc'; g.fillText(text, GW / 2, GH / 2);
  G.tex.needsUpdate = true; G.aspect = GW / GH;   // the sprite shows the whole canvas, the word in its middle
}
function endGlyph(G) { G.on = false; G.word.visible = G.halo.visible = false; if (G.unit) G.unit.busy = false; G.unit = null; }

const _v = new THREE.Vector3(), _to = new THREE.Vector3();
function worldOf(u, out) { u.node.updateWorldMatrix(true, false); return out.setFromMatrixPosition(u.node.matrixWorld); }
// a right answer: the Dutch word leaves its sign (sign: the post the bike rode through) for the nearest dark lamp or blank sign
function wordBack(text, sign, speed) {
  if (!units.length || !sign) return null;
  let G = null; for (const g of glyphs) if (!g.on) { G = g; break; }
  if (!G) return null;   // four words in the air already: this one does not fly
  for (const u of units) { u.z = u.root.visible ? worldOf(u, _v).z : 1e9; }   // a piece the scenery hid cannot be a target
  const pick = pickGlyphTarget(units, glyphNear(speed), GLYPH.zFar);
  if (pick.i < 0) return null;
  const u = units[pick.i]; u.busy = true;
  sign.updateWorldMatrix(true, false); G.from.setFromMatrixPosition(sign.matrixWorld); G.from.set(G.from.x * 0.6, 2.5, -3.5);   // it leaves over the sign he rode through, just ahead of him, so the camera sees it go
  paintGlyph(G, String(text || '').trim());
  G.on = true; G.t = 0; G.unit = u; G.relight = pick.relight; G.word.visible = G.halo.visible = true;
  G.word.position.copy(G.from); G.halo.position.copy(G.from);
  return { lamp: u.lamp, relight: pick.relight, z: Math.round(u.z) };
}
// every frame: the glyphs fly, the lamps and signs that caught settle. Nothing allocated
function wordsTick(dt) {
  for (const G of glyphs) {
    if (!G.on) continue;
    G.t += dt; const k = clamp(G.t / GLYPH.flight, 0, 1), e = smooth(k);
    worldOf(G.unit, _to);
    _v.lerpVectors(G.from, _to, e); _v.y += Math.sin(Math.PI * k) * 1.8;   // up the street in an arc, as in shot 11
    G.word.position.copy(_v); G.halo.position.copy(_v);
    const s = 1.15 * (1 - 0.45 * e); G.word.scale.set(s * G.aspect, s, 1);
    const h = 1.3 + 0.9 * e; G.halo.scale.set(h, h, 1);
    G.word.material.opacity = k < 0.85 ? 1 : (1 - k) / 0.15;
    if (k >= 1) {
      const u = G.unit;
      if (G.relight) { if (u.lamp) setLamp(u, true); else setSign(u, true); }
      u.catchT = 0.8; endGlyph(G);
    }
  }
  for (const u of units) {
    if (u.catchT <= 0) continue;
    u.catchT = Math.max(0, u.catchT - dt); const f = u.catchT / 0.8, flare = 1 + 0.9 * Math.sin(Math.PI * Math.min(1, (1 - f) * 1.6)) * f;   // it catches: a flare that settles
    if (u.lamp) u.node.scale.set(u.sx * flare, u.sy * flare, 1);
    else u.node.material.emissiveIntensity = SIGN_EMI * flare;
    if (u.catchT === 0) { if (u.lamp) u.node.scale.set(u.sx, u.sy, 1); else u.node.material.emissiveIntensity = SIGN_EMI; }
  }
}
// qa: how many lamps and signs the street has, how many are lit, words in the air
function wordsInfo() {
  let lamps = 0, lampsLit = 0, signs = 0, signsLit = 0; for (const u of units) { if (u.lamp) { lamps++; if (u.lit) lampsLit++; } else { signs++; if (u.lit) signsLit++; } }
  let flying = 0, at = null; for (const G of glyphs) if (G.on) { flying++; if (!at) { const r = v => [v.x, v.y, v.z].map(n => Math.round(n * 10) / 10); at = { word: r(G.word.position), to: r(worldOf(G.unit, _to)), from: r(G.from), k: Math.round(G.t / GLYPH.flight * 100) / 100 }; } }
  return { lamps, lampsLit, signs, signsLit, flying, at };
}

export { wordBack, wordsInfo, wordsStart, wordsTick };
