// The lamp and the night, as numbers (HANDOVER.md section 6). The game imports this from index.html and keeps the same TUNE
// object on window.NRTUNE, so the qa bots can still change it at run time. Pure: no window, no THREE.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// fast: extra refuel for a right answer after the go key before the reading budget ran out
// cap: tier presets above 0.6 only get harder through speed and obstacles
export const TUNE = { drain: 2.8, wisp: 2.0, right: 3, cap: 0.6, fast: 1 };
// how deep into the night the ride is, 0 to 1 over the level (a level is about 95 m a delivery; endless over 2600 m)
export const nightAt = (dist, deliveriesTotal) => clamp(dist / (deliveriesTotal ? deliveriesTotal * 95 : 2600), 0, 1);
// what share of the drain applies: none while the first gate holds, in proportion to the speed while a fork is armed
// (slowing to read is cheap), all of it on open road
export const lampReadK = (held, forkArmed, slow) => held ? 0 : forkArmed ? clamp(slow / 0.85, 0, 1) : 1;
// lamp lost over dt seconds. lv: the level (null in endless, where the drain follows speed instead of lampDecay)
export const lampLoss = (dt, readK, lv, speed, night) => dt * readK * (lv ? Math.min(lv.lampDecay, TUNE.cap) * TUNE.drain : (1.1 + (speed < 17 ? 0.6 : 0))) * (0.6 + 1.1 * night);
// lamp a right answer gives back, before the go-key bonus (TUNE.fast)
export const refuelRight = streak => TUNE.right + Math.min(streak, 4) * 0.3;
