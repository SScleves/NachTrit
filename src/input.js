// Input: steering (arrow keys, A and D, swipes, taps, clicks) and the go key (up, W, swipe up) that ends a fork's reading wait
// and the why card after a wrong answer.
import { $, clamp } from './engine.js?v=39';
import { renderer } from './render.js?v=39';
import { LANE_X, S } from './state.js?v=39';
import { card, endWhy, setToastT, toastT } from './hud.js?v=39';
import './speech.js?v=39';   // keeps the order the game's code runs in

// ---------- input ----------
function steer(dir) { if (S.mode !== 'ride') return; S.lane = clamp(S.lane + dir, 0, LANE_X.length - 1); }
// go: "I've chosen". The reading slow-down ends for this fork and the bike eases back to cruising speed; steering is not go
const TOUCH = matchMedia('(pointer: coarse)').matches;
function goKnown() { try { return localStorage.getItem('nachtrit.go') === '1'; } catch (e) { return false; } }
function goNow() {
  if (S.mode === 'ride' && S.whyT > 0) { endWhy(); return; }   // the why card is up: go ends it, the bike picks up speed
  const g = S.activeFork; if (S.mode !== 'ride' || !g || g.resolved || g.go) return;
  g.go = true; g.goEarly = g.legT < g.budget;   // answered before the budget ran out: a little extra lamp if it is right
  if (g.hold) { g.hold = false; if (S.held) { S.held = false; setToastT(Math.min(toastT, 1.2)); } }
  card.querySelector('.gohint').textContent = '';
  try { localStorage.setItem('nachtrit.go', '1'); } catch (e) {}
}
addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { if (S.mode === 'ride') { goNow(); e.preventDefault(); } }
  else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') steer(-1);
  else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') steer(1);
  else if ((e.key === ' ' || e.key === 'Enter') && (S.mode === 'start' || S.mode === 'cine') && $('start').style.display !== 'none' && $('map').style.display === 'none') { e.stopImmediatePropagation(); e.preventDefault(); $('go').click(); }   // cine: the title screen's 3D shot; the key must not also move the intro it opens past panel 1
});
let touchX = null, touchY = 0, touchT = 0;
addEventListener('touchstart', e => { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; touchT = performance.now(); }, { passive: true });
addEventListener('touchend', e => {
  if (touchX == null) return;
  const dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY; const dt = performance.now() - touchT;
  if (dy < -40 && -dy > Math.abs(dx)) goNow();   // swipe up: go
  else if (Math.abs(dx) > 30) steer(dx > 0 ? 1 : -1);
  else if (dt < 300 && S.mode === 'ride') steer(e.changedTouches[0].clientX < innerWidth / 2 ? -1 : 1);
  touchX = null;
}, { passive: true });
addEventListener('mousedown', e => { if (S.mode === 'ride' && e.target === renderer.domElement) steer(e.clientX < innerWidth / 2 ? -1 : 1); });

export { goKnown, goNow, TOUCH };
