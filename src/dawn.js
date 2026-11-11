// Town dawn (PLAN.md phase 5 item 2, backlog A5): when every place in a town has three stars (townAtDawn in src/map.js, the rule
// in src/payoff.js), the next ride there plays at dawn. Nothing is lit that was not: the window atlas paints its dark panes as
// lit ones, the dead get their skin and their eyes back (they still split the bill: the Tikkie stays), every street lamp and shop
// sign starts lit (src/words.js), and src/loop.js lifts the haze to the pale grey of concept image A from the fog, sky and
// night-depth numbers it already drives. A card resolves the town's rumour, still unconfirmed. Every buildScenery (an intro shot,
// the title, the next ride) puts the night back first, so the intro is never touched.
import { PM } from './props.js?v=43';
import { PK } from './kit.js?v=43';
import { sceneryHooks } from './scenery.js?v=43';
import { ZEYE_MAT } from './zombies.js?v=43';
import { S } from './state.js?v=43';
import './words.js?v=43';   // keeps the order the game's code runs in

// the window atlas (src/houses.js): cells 0 to 2 are lit panes, 3 a dim room, 4 and 5 dark. At dawn 3, 4 and 5 take the lit ones.
let winSaved = null;
function windowsLit(on) {
  const tex = PM.winAtlas && PM.winAtlas.map, c = tex && tex.image; if (!c || !c.getContext) return;
  const g = c.getContext('2d'), cw = c.width / 6, ch = c.height / 2;
  if (on && !winSaved) { winSaved = g.getImageData(3 * cw, 0, 3 * cw, ch); for (let i = 0; i < 3; i++) g.drawImage(c, i * cw, 0, cw, ch, (3 + i) * cw, 0, cw, ch); tex.needsUpdate = true; }
  else if (!on && winSaved) { g.putImageData(winSaved, 3 * cw, 0); winSaved = null; tex.needsUpdate = true; }
}
// the dead as people: skin tones instead of the grey of the dead, the eyes dark, no glow round them
const SKIN_DAY = [0xb8876a, 0x8a5e46, 0xd2a688];
let skinNight = null, eyeNight = null;
function deadAsPeople(on) {
  if (!skinNight) { skinNight = PK.skin.map(m => m.color.getHex()); eyeNight = [PM.eyeGlow.color.getHex(), ZEYE_MAT.opacity]; }
  PK.skin.forEach((m, i) => m.color.setHex(on ? SKIN_DAY[i % SKIN_DAY.length] : skinNight[i]));
  PM.eyeGlow.color.setHex(on ? 0x221a16 : eyeNight[0]); ZEYE_MAT.opacity = on ? 0 : eyeNight[1];
}
// t: the town of this ride, or null for the night
function setDawn(t) {
  const on = !!t; if (!on && !S.dawn) return;
  S.dawn = on ? t.id : null; windowsLit(on); deadAsPeople(on);
}
sceneryHooks.push(() => setDawn(null));

export { setDawn };
